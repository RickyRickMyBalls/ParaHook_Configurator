import {
  createDefaultSketchPlaneTransform,
  type SketchPlaneTransform,
} from '../../shared/sketchTypes'
import { projectSketchPointToWorld } from '../../shared/sketchPlaneFrame'
import { tessellateProfileLoop } from '../../app/spaghetti/compiler/runtimeTessellation'
import type { GeometryTopologyPreview } from '../../shared/geometryResult'
import {
  isGeometryRequestPayload,
  type GeometryRequestExtrudeOp,
  type GeometryRequestPayload,
  type GeometryRequestSketchOp,
  type GeometryRequestSketchProfile,
} from '../../shared/geometryRequest'
import { compareSpaghettiSourcePartKeys } from '../../shared/buildStatsKeys'
import {
  extrudeFaceOnPlane,
  extrudeFaceAlongZ,
  faceFromWire,
  mergeMeshPacks,
  wireFromLoop,
} from './cadKernelAdapter'
import type {
  MeshPack,
  Point2,
  RuntimeDiagnostic,
  RuntimeTraceBody,
  Shape3D,
  Wire,
} from './cadTypes'

type IRProfileResolved = GeometryRequestSketchProfile

type IRSketch = GeometryRequestSketchOp

type IRExtrude = GeometryRequestExtrudeOp

export type FeatureStackIRPayload = GeometryRequestPayload

type SketchRuntime = {
  plane: 'XY' | 'XZ' | 'YZ'
  planeTransform?: SketchPlaneTransform
  profiles: Map<string, Wire>
  hasInvalidProfiles: boolean
}

type ResolvedExtrudeProfileTarget = {
  wire: Wire
  plane?: 'XY' | 'XZ' | 'YZ'
  planeTransform?: SketchPlaneTransform
}

type ResolvedExtrudeProfileSelection =
  | {
      ok: true
      targets: ResolvedExtrudeProfileTarget[]
    }
  | {
      ok: false
      reason: string
      message: string
    }

type RuntimeContext = {
  sketches: Map<string, SketchRuntime>
  profiles: Map<string, Wire>
  bodies: Map<string, Shape3D>
  topologyByBodyKey: Map<string, GeometryTopologyPreview>
  bodyTrace: RuntimeTraceBody[]
}

export type ExecuteFeatureStackResult = {
  bodies: Record<string, Shape3D>
  mergedMesh: MeshPack | null
  topologyPreview: GeometryTopologyPreview | null
  diagnostics: RuntimeDiagnostic[]
  bodyTrace: RuntimeTraceBody[]
}

export const isFeatureStackIRPayload = isGeometryRequestPayload

const getSortedBodyEntries = (
  bodies: ReadonlyMap<string, Shape3D>,
): Array<[string, Shape3D]> =>
  [...bodies.entries()].sort(
    (a, b) =>
      compareSpaghettiSourcePartKeys(a[1].partKey, b[1].partKey) ||
      a[1].bodyId.localeCompare(b[1].bodyId),
  )

const mergeBodies = (bodies: ReadonlyMap<string, Shape3D>): MeshPack | null => {
  if (bodies.size === 0) {
    return null
  }
  const meshes = getSortedBodyEntries(bodies).map(([, shape]) => shape.mesh)
  return mergeMeshPacks(meshes)
}

const mergeBodyTopologies = (
  bodies: ReadonlyMap<string, Shape3D>,
  topologyByBodyKey: ReadonlyMap<string, GeometryTopologyPreview>,
): GeometryTopologyPreview | null => {
  if (bodies.size === 0 || topologyByBodyKey.size === 0) {
    return null
  }
  const merged: GeometryTopologyPreview = {
    faces: [],
    triangleFaceIds: [],
    edges: [],
    points: [],
  }
  for (const [bodyKey, shape] of getSortedBodyEntries(bodies)) {
    const triangleCount = shape.mesh.indices.length / 3
    const topologyPreview = topologyByBodyKey.get(bodyKey)
    if (topologyPreview === undefined || topologyPreview.triangleFaceIds.length !== triangleCount) {
      merged.triangleFaceIds.push(...Array<string | null>(triangleCount).fill(null))
      continue
    }
    merged.faces.push(...topologyPreview.faces)
    merged.triangleFaceIds.push(...topologyPreview.triangleFaceIds)
    merged.edges.push(...topologyPreview.edges)
    merged.points.push(...topologyPreview.points)
  }
  return merged.faces.length > 0 || merged.edges.length > 0 || merged.points.length > 0
    ? merged
    : null
}

const toPolyline = (
  start: readonly [number, number, number],
  end: readonly [number, number, number],
): number[] => [start[0], start[1], start[2], end[0], end[1], end[2]]

const buildExtrudeTopologyPreview = (options: {
  wire: Wire
  plane: 'XY' | 'XZ' | 'YZ'
  planeTransform?: SketchPlaneTransform
  depth: number
  bodyId: string
  featureId: string
  partKey: string
}): GeometryTopologyPreview | null => {
  const loop = options.wire.vertices
  const count = loop.length
  if (count < 3 || !Number.isFinite(options.depth) || options.depth <= 0) {
    return null
  }

  const bottomPoints = loop.map((point) => {
    const worldPoint = projectSketchPointToWorld(
      options.plane,
      options.planeTransform,
      point,
      0,
    )
    return [worldPoint.x, worldPoint.y, worldPoint.z] as [number, number, number]
  })
  const topPoints = loop.map((point) => {
    const worldPoint = projectSketchPointToWorld(
      options.plane,
      options.planeTransform,
      point,
      options.depth,
    )
    return [worldPoint.x, worldPoint.y, worldPoint.z] as [number, number, number]
  })

  const idBase = `${options.partKey}:${options.featureId}:${options.bodyId}`
  const bottomFaceId = `${idBase}:face:bottom`
  const topFaceId = `${idBase}:face:top`
  const sideFaceIds = loop.map((_, index) => `${idBase}:face:side:${index}`)
  const triangleFaceIds = [
    ...Array<string | null>(count - 2).fill(bottomFaceId),
    ...Array<string | null>(count - 2).fill(topFaceId),
    ...sideFaceIds.flatMap((faceId) => [faceId, faceId]),
  ]

  return {
    faces: [
      {
        faceId: bottomFaceId,
        bodyId: options.bodyId,
        label: 'Bottom cap',
      },
      {
        faceId: topFaceId,
        bodyId: options.bodyId,
        label: 'Top cap',
      },
      ...sideFaceIds.map((faceId, index) => ({
        faceId,
        bodyId: options.bodyId,
        label: `Side ${index + 1}`,
      })),
    ],
    triangleFaceIds,
    edges: loop.flatMap((_, index) => {
      const next = (index + 1) % count
      const previous = (index - 1 + count) % count
      return [
        {
          edgeId: `${idBase}:edge:bottom:${index}`,
          bodyId: options.bodyId,
          faceIds: [bottomFaceId, sideFaceIds[index]],
          polyline: toPolyline(bottomPoints[index], bottomPoints[next]),
          label: `Bottom edge ${index + 1}`,
        },
        {
          edgeId: `${idBase}:edge:top:${index}`,
          bodyId: options.bodyId,
          faceIds: [topFaceId, sideFaceIds[index]],
          polyline: toPolyline(topPoints[index], topPoints[next]),
          label: `Top edge ${index + 1}`,
        },
        {
          edgeId: `${idBase}:edge:vertical:${index}`,
          bodyId: options.bodyId,
          faceIds: [sideFaceIds[previous], sideFaceIds[index]],
          polyline: toPolyline(bottomPoints[index], topPoints[index]),
          label: `Vertical edge ${index + 1}`,
        },
      ]
    }),
    points: [
      ...bottomPoints.map((position, index) => ({
        pointId: `${idBase}:point:bottom:${index}`,
        bodyId: options.bodyId,
        position,
        label: `Bottom point ${index + 1}`,
      })),
      ...topPoints.map((position, index) => ({
        pointId: `${idBase}:point:top:${index}`,
        bodyId: options.bodyId,
        position,
        label: `Top point ${index + 1}`,
      })),
    ],
  }
}

const pushDiagnostic = (
  diagnostics: RuntimeDiagnostic[],
  partKey: string,
  featureId: string,
  reason: string,
  message: string,
): void => {
  diagnostics.push({
    partKey,
    featureId,
    reason,
    message,
  })
}

const profileVerticesFromResolved = (profile: IRProfileResolved): Point2[] =>
  profile.loop.segments.length > 0
    ? tessellateProfileLoop(profile.loop.segments)
    : profile.verticesProxy

const runSketch = (
  context: RuntimeContext,
  partKey: string,
  feature: IRSketch,
  diagnostics: RuntimeDiagnostic[],
): void => {
  const sketchProfiles = new Map<string, Wire>()
  let hasInvalidProfiles = false

  for (const profile of feature.profilesResolved) {
    try {
      const wire = wireFromLoop(profileVerticesFromResolved(profile))
      if (sketchProfiles.has(profile.profileId)) {
        hasInvalidProfiles = true
        pushDiagnostic(
          diagnostics,
          partKey,
          feature.featureId,
          'duplicate_profile_id_in_sketch',
          `Skipping duplicate profileId "${profile.profileId}" in sketch feature.`,
        )
        continue
      }
      sketchProfiles.set(profile.profileId, wire)
      if (context.profiles.has(profile.profileId)) {
        pushDiagnostic(
          diagnostics,
          partKey,
          feature.featureId,
          'duplicate_profile_id_global',
          `Global profileId "${profile.profileId}" already exists; keeping first.`,
        )
        continue
      }
      context.profiles.set(profile.profileId, wire)
    } catch (error: unknown) {
      hasInvalidProfiles = true
      const message = error instanceof Error ? error.message : 'Failed to build profile wire.'
      pushDiagnostic(
        diagnostics,
        partKey,
        feature.featureId,
        'invalid_profile_vertices',
        `Skipping profile "${profile.profileId}": ${message}`,
      )
    }
  }

  context.sketches.set(feature.featureId, {
    plane: feature.plane ?? 'XY',
    planeTransform: feature.planeTransform,
    profiles: sketchProfiles,
    hasInvalidProfiles,
  })
}

const resolveExtrudeProfileSelection = (
  context: RuntimeContext,
  feature: IRExtrude,
): ResolvedExtrudeProfileSelection => {
  const resolveAllFromSketchTargets = (
    sketchFeatureId: string,
    messagePrefix: string,
  ): ResolvedExtrudeProfileSelection => {
    const sketch = context.sketches.get(sketchFeatureId)
    if (sketch === undefined || sketch.profiles.size === 0) {
      return {
        ok: false,
        reason: 'missing_profile_selection',
        message: `${messagePrefix} sketch "${sketchFeatureId}" has no available closed profiles.`,
      }
    }
    if (sketch.hasInvalidProfiles) {
      return {
        ok: false,
        reason: 'missing_profile_selection',
        message: `${messagePrefix} sketch "${sketchFeatureId}" contains invalid closed profiles.`,
      }
    }
    return {
      ok: true,
      targets: [...sketch.profiles.values()].map((wire) => ({
        wire,
        plane: sketch.plane,
        planeTransform: sketch.planeTransform,
      })),
    }
  }

  const resolveSingleTarget = (
    sketchFeatureId: string,
    profileId: string,
    messagePrefix: string,
  ): ResolvedExtrudeProfileSelection => {
    const sketch = context.sketches.get(sketchFeatureId)
    const wire = sketch?.profiles.get(profileId)
    if (wire === undefined) {
      return {
        ok: false,
        reason: 'missing_profile_selection',
        message: `${messagePrefix} profile "${profileId}" is unavailable.`,
      }
    }
    return {
      ok: true,
      targets: [
        {
          wire,
          plane: sketch?.plane,
          planeTransform: sketch?.planeTransform,
        },
      ],
    }
  }

  if (feature.profileSelection?.mode === 'allFromSketch') {
    return resolveAllFromSketchTargets(
      feature.profileSelection.sketchFeatureId,
      'Extrude skipped because',
    )
  }

  if (feature.profileSelection?.mode === 'single') {
    return resolveSingleTarget(
      feature.profileSelection.sketchFeatureId,
      feature.profileSelection.profileId,
      'Extrude skipped because profileSelection references',
    )
  }

  if (feature.profileSelection?.mode === 'contributors') {
    const targets: ResolvedExtrudeProfileTarget[] = []
    for (const [index, contributor] of feature.profileSelection.contributors.entries()) {
      const messagePrefix = `Extrude skipped because contributor ${index + 1} references`
      const resolved =
        contributor.kind === 'allFromSketch'
          ? resolveAllFromSketchTargets(contributor.sketchFeatureId, messagePrefix)
          : resolveSingleTarget(
              contributor.sketchFeatureId,
              contributor.profileId,
              messagePrefix,
            )
      if (!resolved.ok) {
        return resolved
      }
      targets.push(...resolved.targets)
    }
    if (targets.length === 0) {
      return {
        ok: false,
        reason: 'missing_profile_selection',
        message: 'Extrude skipped because contributors resolved no available closed profiles.',
      }
    }
    return {
      ok: true,
      targets,
    }
  }

  if (feature.profileRef === null) {
    return {
      ok: false,
      reason: 'missing_profile_ref',
      message: 'Extrude skipped because profileRef is null.',
    }
  }

  const profileId = feature.profileRef.profileId
  const sketchFeatureId = feature.profileRef.sketchFeatureId
  const sketch = sketchFeatureId === undefined ? undefined : context.sketches.get(sketchFeatureId)
  const wireFromSketch = sketch?.profiles.get(profileId)
  const wire = wireFromSketch ?? context.profiles.get(profileId)
  if (wire === undefined) {
    return {
      ok: false,
      reason: 'missing_profile',
      message: `Extrude skipped because profileId "${profileId}" is unavailable.`,
    }
  }

  return {
    ok: true,
    targets: [
      {
        wire,
        plane: sketch?.plane,
        planeTransform: sketch?.planeTransform,
      },
    ],
  }
}

const runExtrude = (
  context: RuntimeContext,
  partKey: string,
  feature: IRExtrude,
  diagnostics: RuntimeDiagnostic[],
  executionIndex: number,
): number => {
  const selection = resolveExtrudeProfileSelection(context, feature)
  if (!selection.ok) {
    pushDiagnostic(
      diagnostics,
      partKey,
      feature.featureId,
      selection.reason,
      selection.message,
    )
    return executionIndex
  }

  const bodyId = feature.bodyId ?? feature.featureId
  const bodyKey = `${partKey}:${bodyId}`
  if (context.bodies.has(bodyKey)) {
    pushDiagnostic(
      diagnostics,
      partKey,
      feature.featureId,
      'duplicate_body_id',
      `Body "${bodyId}" already exists; keeping first and skipping duplicate.`,
    )
    return executionIndex
  }

  try {
    const extrudeDirection = feature.extrudeDirection ?? 'OneSide'
    const startDepthResolved =
      extrudeDirection === 'TwoSides'
        ? feature.startDepthResolved ?? feature.depthResolved
        : extrudeDirection === 'Symmetric'
          ? feature.depthResolved / 2
          : 0
    const endDepthResolved =
      extrudeDirection === 'TwoSides'
        ? feature.endDepthResolved ?? feature.depthResolved
        : extrudeDirection === 'Symmetric'
          ? feature.depthResolved / 2
          : feature.depthResolved
    const extrusionDepthResolved =
      extrudeDirection === 'OneSide'
        ? feature.depthResolved
        : startDepthResolved + endDepthResolved
    const hasValidDirectionDepths =
      extrudeDirection === 'TwoSides'
        ? Number.isFinite(startDepthResolved) &&
          Number.isFinite(endDepthResolved) &&
          startDepthResolved > 0 &&
          endDepthResolved > 0
        : Number.isFinite(feature.depthResolved) && feature.depthResolved > 0
    if (!hasValidDirectionDepths) {
      pushDiagnostic(
        diagnostics,
        partKey,
        feature.featureId,
        'invalid_extrude_depth',
        `Extrude skipped because ${extrudeDirection} requires positive depth values.`,
      )
      return executionIndex
    }
    const capped = feature.extrudeType !== 'Walls'
    const topologyCandidates: GeometryTopologyPreview[] = []
    const shapes = selection.targets.map((target) => {
      const face = faceFromWire(target.wire)
      const sketchPlane = feature.plane ?? target.plane ?? 'XY'
      const basePlaneTransform = feature.planeTransform ?? target.planeTransform
      const sketchPlaneTransform =
        startDepthResolved <= 0
          ? basePlaneTransform
          : {
              ...(basePlaneTransform ?? createDefaultSketchPlaneTransform()),
              translation: {
                ...(basePlaneTransform?.translation ??
                  createDefaultSketchPlaneTransform().translation),
              },
              rotationDeg: {
                ...(basePlaneTransform?.rotationDeg ??
                  createDefaultSketchPlaneTransform().rotationDeg),
              },
              offsetMm:
                (basePlaneTransform?.offsetMm ??
                  createDefaultSketchPlaneTransform().offsetMm) - startDepthResolved,
            }
      const topologyPreview = capped
        ? buildExtrudeTopologyPreview({
            wire: target.wire,
            plane: sketchPlane,
            planeTransform: sketchPlaneTransform,
            depth: extrusionDepthResolved,
            bodyId,
            featureId: feature.featureId,
            partKey,
          })
        : null
      if (topologyPreview !== null) {
        topologyCandidates.push(topologyPreview)
      }
      return sketchPlane === 'XY'
        ? extrudeFaceAlongZ(
            face,
            extrusionDepthResolved,
            {
              bodyId,
              featureId: feature.featureId,
              op: 'extrude',
              partKey,
            },
            sketchPlaneTransform,
            { capped },
          )
        : extrudeFaceOnPlane(
            face,
            sketchPlane,
            extrusionDepthResolved,
            {
              bodyId,
              featureId: feature.featureId,
              op: 'extrude',
              partKey,
            },
            sketchPlaneTransform,
            { capped },
          )
    })
    const shape =
      shapes.length === 1
        ? shapes[0]
        : {
            kind: 'aggregate_extrusion' as const,
            bodyId,
            featureId: feature.featureId,
            op: 'extrude',
            partKey,
            mesh: mergeMeshPacks(shapes.map((candidate) => candidate.mesh)),
          }
    context.bodies.set(bodyKey, shape)
    if (shapes.length === 1 && topologyCandidates.length === 1) {
      context.topologyByBodyKey.set(bodyKey, topologyCandidates[0])
    }
    context.bodyTrace.push({
      bodyKey,
      bodyId,
      partKey,
      featureId: feature.featureId,
      op: 'extrude',
      executionIndex,
    })
    return executionIndex + 1
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Extrude failed.'
    pushDiagnostic(
      diagnostics,
      partKey,
      feature.featureId,
      'extrude_failure',
      `Extrude skipped: ${message}`,
    )
    return executionIndex
  }
}

export const executeFeatureStack = (partsIR: FeatureStackIRPayload): ExecuteFeatureStackResult => {
  const context: RuntimeContext = {
    sketches: new Map(),
    profiles: new Map(),
    bodies: new Map(),
    topologyByBodyKey: new Map(),
    bodyTrace: [],
  }
  const diagnostics: RuntimeDiagnostic[] = []
  const partKeys = Object.keys(partsIR.parts).sort(compareSpaghettiSourcePartKeys)

  for (const partKey of partKeys) {
    const partContext: RuntimeContext = {
      sketches: new Map(),
      profiles: new Map(),
      bodies: context.bodies,
      topologyByBodyKey: context.topologyByBodyKey,
      bodyTrace: context.bodyTrace,
    }
    const operations = partsIR.parts[partKey] ?? []
    let executionIndex = 0
    for (const operation of operations) {
      try {
        if (operation.op === 'sketch') {
          runSketch(partContext, partKey, operation, diagnostics)
          continue
        }
        executionIndex = runExtrude(partContext, partKey, operation, diagnostics, executionIndex)
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Feature execution failed unexpectedly.'
        pushDiagnostic(
          diagnostics,
          partKey,
          operation.featureId,
          'runtime_failure',
          message,
        )
      }
    }
  }

  const sortedBodies = [...context.bodies.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  return {
    bodies: Object.fromEntries(sortedBodies),
    mergedMesh: mergeBodies(context.bodies),
    topologyPreview: mergeBodyTopologies(context.bodies, context.topologyByBodyKey),
    diagnostics,
    bodyTrace: [...context.bodyTrace].sort(
      (a, b) =>
        compareSpaghettiSourcePartKeys(a.partKey, b.partKey) ||
        a.executionIndex - b.executionIndex ||
        a.bodyId.localeCompare(b.bodyId),
    ),
  }
}
