import {
  createDraftGeometryResultBundle,
  type GeometryBody,
  type GeometryResultBundle,
  type GeometryDiagnostic,
  type GeometryMesh,
  type GeometryResultRequestIdentity,
  type GeometryTraceBody,
} from '../../../shared/geometryResult'
import type { PartArtifact } from '../../../shared/partsTypes'
import {
  executeFeatureStack,
  isFeatureStackIRPayload,
} from '../../cad/featureStackRuntime'
import { createBaseplatePart } from './parts/baseplate'
import { createHeelKickPart } from './parts/heelKick'
import { createToeHookPart } from './parts/toeHook'

const seedFromProfile = (profile: Record<string, unknown>): number =>
  JSON.stringify(profile).length

export const buildFoothookParts = (
  profile: Record<string, unknown>,
): PartArtifact[] => {
  const seed = seedFromProfile(profile)
  return [
    createBaseplatePart(seed),
    createHeelKickPart(seed),
    createToeHookPart(seed),
  ]
}

export const runFoothookFeatureStack = (
  options: {
    profilePatch: Record<string, unknown>
    request: GeometryResultRequestIdentity
  },
): GeometryResultBundle | null => {
  const candidate = options.profilePatch.sp_featureStackIR
  if (!isFeatureStackIRPayload(candidate)) {
    return null
  }
  const execution = executeFeatureStack(candidate)

  const bodies = Object.fromEntries(
    Object.entries(execution.bodies).map(([bodyKey, shape]) => [
      bodyKey,
      {
        kind: shape.kind,
        bodyId: shape.bodyId,
        featureId: shape.featureId,
        op: shape.op,
        partKey: shape.partKey,
        mesh: {
          vertices: [...shape.mesh.vertices],
          indices: [...shape.mesh.indices],
        } satisfies GeometryMesh,
      } satisfies GeometryBody,
    ]),
  )
  const meshPreview =
    execution.mergedMesh === null
      ? null
      : ({
          vertices: [...execution.mergedMesh.vertices],
          indices: [...execution.mergedMesh.indices],
        } satisfies GeometryMesh)
  const diagnostics = execution.diagnostics.map(
    (diagnostic) =>
      ({
        partKey: diagnostic.partKey,
        featureId: diagnostic.featureId,
        reason: diagnostic.reason,
        message: diagnostic.message,
      }) satisfies GeometryDiagnostic,
  )
  const trace = execution.bodyTrace.map(
    (traceItem) =>
      ({
        bodyKey: traceItem.bodyKey,
        bodyId: traceItem.bodyId,
        partKey: traceItem.partKey,
        featureId: traceItem.featureId,
        op: traceItem.op,
        executionIndex: traceItem.executionIndex,
      }) satisfies GeometryTraceBody,
  )

  return createDraftGeometryResultBundle({
    request: options.request,
    bodies,
    meshPreview,
    topologyPreview: execution.topologyPreview,
    diagnostics,
    trace,
  })
}
