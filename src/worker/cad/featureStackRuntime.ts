import {
  createDefaultSketchPlaneTransform,
  type SketchPlaneTransform,
} from '../../app/spaghetti/features/featureTypes'
import { tessellateProfileLoop } from '../../app/spaghetti/compiler/runtimeTessellation'
import {
  isGeometryRequestPayload,
  type GeometryRequestExtrudeOp,
  type GeometryRequestPayload,
  type GeometryRequestSketchOp,
  type GeometryRequestSketchProfile,
} from '../../app/spaghetti/contracts/geometryRequest'
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
}

type RuntimeContext = {
  sketches: Map<string, SketchRuntime>
  profiles: Map<string, Wire>
  bodies: Map<string, Shape3D>
  bodyTrace: RuntimeTraceBody[]
}

export type ExecuteFeatureStackResult = {
  bodies: Record<string, Shape3D>
  mergedMesh: MeshPack | null
  diagnostics: RuntimeDiagnostic[]
  bodyTrace: RuntimeTraceBody[]
}

export const isFeatureStackIRPayload = isGeometryRequestPayload

const mergeBodies = (bodies: ReadonlyMap<string, Shape3D>): MeshPack | null => {
  if (bodies.size === 0) {
    return null
  }
  const meshes = [...bodies.entries()]
    .sort(
      (a, b) =>
        compareSpaghettiSourcePartKeys(a[1].partKey, b[1].partKey) ||
        a[1].bodyId.localeCompare(b[1].bodyId),
    )
    .map(([, shape]) => shape.mesh)
  return mergeMeshPacks(meshes)
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

  for (const profile of feature.profilesResolved) {
    try {
      const wire = wireFromLoop(profileVerticesFromResolved(profile))
      if (sketchProfiles.has(profile.profileId)) {
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
  })
}

const runExtrude = (
  context: RuntimeContext,
  partKey: string,
  feature: IRExtrude,
  diagnostics: RuntimeDiagnostic[],
  executionIndex: number,
): number => {
  if (feature.profileRef === null) {
    pushDiagnostic(
      diagnostics,
      partKey,
      feature.featureId,
      'missing_profile_ref',
      'Extrude skipped because profileRef is null.',
    )
    return executionIndex
  }

  const profileId = feature.profileRef.profileId
  const sketchFeatureId = feature.profileRef.sketchFeatureId
  const wireFromSketch =
    sketchFeatureId === undefined
      ? undefined
      : context.sketches.get(sketchFeatureId)?.profiles.get(profileId)
  const planeFromSketch =
    sketchFeatureId === undefined ? undefined : context.sketches.get(sketchFeatureId)?.plane
  const planeTransformFromSketch =
    sketchFeatureId === undefined
      ? undefined
      : context.sketches.get(sketchFeatureId)?.planeTransform
  const wire = wireFromSketch ?? context.profiles.get(profileId)

  if (wire === undefined) {
    pushDiagnostic(
      diagnostics,
      partKey,
      feature.featureId,
      'missing_profile',
      `Extrude skipped because profileId "${profileId}" is unavailable.`,
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
    const face = faceFromWire(wire)
    const sketchPlane = feature.plane ?? planeFromSketch ?? 'XY'
    const basePlaneTransform = feature.planeTransform ?? planeTransformFromSketch
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
    const capped = feature.extrudeType !== 'Walls'
    const shape =
      sketchPlane === 'XY'
        ? extrudeFaceAlongZ(face, extrusionDepthResolved, {
            bodyId,
            featureId: feature.featureId,
            op: 'extrude',
            partKey,
          }, sketchPlaneTransform, { capped })
        : extrudeFaceOnPlane(face, sketchPlane, extrusionDepthResolved, {
            bodyId,
            featureId: feature.featureId,
            op: 'extrude',
            partKey,
          }, sketchPlaneTransform, { capped })
    context.bodies.set(bodyKey, shape)
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
    bodyTrace: [],
  }
  const diagnostics: RuntimeDiagnostic[] = []
  const partKeys = Object.keys(partsIR.parts).sort(compareSpaghettiSourcePartKeys)

  for (const partKey of partKeys) {
    const partContext: RuntimeContext = {
      sketches: new Map(),
      profiles: new Map(),
      bodies: context.bodies,
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
    diagnostics,
    bodyTrace: [...context.bodyTrace].sort(
      (a, b) =>
        compareSpaghettiSourcePartKeys(a.partKey, b.partKey) ||
        a.executionIndex - b.executionIndex ||
        a.bodyId.localeCompare(b.bodyId),
    ),
  }
}
