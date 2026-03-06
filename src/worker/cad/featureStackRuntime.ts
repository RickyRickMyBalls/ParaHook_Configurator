import { compareSpaghettiSourcePartKeys } from '../../shared/buildStatsKeys'
import {
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

type IRProfileResolved = {
  profileId: string
  area: number
  vertices: Point2[]
}

type IRSketch = {
  op: 'sketch'
  featureId: string
  profilesResolved: IRProfileResolved[]
}

type IRProfileRef = {
  profileId: string
  sketchFeatureId?: string
  sourceFeatureId?: string
}

type IRExtrude = {
  op: 'extrude'
  featureId: string
  profileRef: IRProfileRef | null
  depthResolved: number
  bodyId?: string
}

type FeatureOp = IRSketch | IRExtrude

export type FeatureStackIRPayload = {
  schemaVersion: 1
  parts: Record<string, FeatureOp[]>
}

type SketchRuntime = {
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isPoint2 = (value: unknown): value is Point2 =>
  isRecord(value) && typeof value.x === 'number' && typeof value.y === 'number'

const isProfileResolved = (value: unknown): value is IRProfileResolved =>
  isRecord(value) &&
  typeof value.profileId === 'string' &&
  typeof value.area === 'number' &&
  Array.isArray(value.vertices) &&
  value.vertices.every(isPoint2)

const isSketchOp = (value: unknown): value is IRSketch =>
  isRecord(value) &&
  value.op === 'sketch' &&
  typeof value.featureId === 'string' &&
  Array.isArray(value.profilesResolved) &&
  value.profilesResolved.every(isProfileResolved)

const isProfileRef = (value: unknown): value is IRProfileRef =>
  isRecord(value) &&
  typeof value.profileId === 'string' &&
  (value.sketchFeatureId === undefined || typeof value.sketchFeatureId === 'string') &&
  (value.sourceFeatureId === undefined || typeof value.sourceFeatureId === 'string')

const isExtrudeOp = (value: unknown): value is IRExtrude =>
  isRecord(value) &&
  value.op === 'extrude' &&
  typeof value.featureId === 'string' &&
  typeof value.depthResolved === 'number' &&
  (value.bodyId === undefined || typeof value.bodyId === 'string') &&
  (value.profileRef === null || isProfileRef(value.profileRef))

const isFeatureOp = (value: unknown): value is FeatureOp => isSketchOp(value) || isExtrudeOp(value)

export const isFeatureStackIRPayload = (value: unknown): value is FeatureStackIRPayload => {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.parts)) {
    return false
  }
  return Object.values(value.parts).every(
    (operations) => Array.isArray(operations) && operations.every(isFeatureOp),
  )
}

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

const runSketch = (
  context: RuntimeContext,
  partKey: string,
  feature: IRSketch,
  diagnostics: RuntimeDiagnostic[],
): void => {
  const sketchProfiles = new Map<string, Wire>()

  for (const profile of feature.profilesResolved) {
    try {
      const wire = wireFromLoop(profile.vertices)
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
  const sketchFeatureId = feature.profileRef.sketchFeatureId ?? feature.profileRef.sourceFeatureId
  const wireFromSketch =
    sketchFeatureId === undefined
      ? undefined
      : context.sketches.get(sketchFeatureId)?.profiles.get(profileId)
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
    const shape = extrudeFaceAlongZ(face, feature.depthResolved, {
      bodyId,
      featureId: feature.featureId,
      op: 'extrude',
      partKey,
    })
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
