import {
  type GeometryResultBundle,
} from '../shared/geometryResult'
import type {
  BuildExecutionIntent,
  CompiledBuildData,
  PartArtifact,
} from '../shared/buildTypes'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  LEGACY_RUNTIME_GRAPH_DOCUMENT_ID as LEGACY_GRAPH_DOCUMENT_ID,
} from '../shared/buildTypes'
import {
  buildFoothookCompatibleArtifactsFromRetainedGeometryResult,
  buildFoothookRetainedGeometryResult,
} from './products/foothook/foothookCompatibilityAdapter'
import { buildAuthoritativeGeometry } from './authoritative/buildAuthoritativeGeometry'

export type BuildModelRequest = {
  compiledBuildData: CompiledBuildData
  executionIntent?: BuildExecutionIntent
  requestIdentity?: {
    graphDocumentId: string
    buildRequestId: string
  }
}

export type BuildModelResult = {
  draftGeometryResult: GeometryResultBundle | null
  authoritativeGeometryResult: GeometryResultBundle | null
  parts: PartArtifact[]
}

const defaultBuildRequestIdentity = (compiledBuildData: CompiledBuildData): {
  graphDocumentId: string
  buildRequestId: string
  partKeys: string[]
} => {
  const featureStackPartKeys =
    typeof compiledBuildData.resolvedShared?.sp_featureStackIR === 'object' &&
    compiledBuildData.resolvedShared.sp_featureStackIR !== null &&
    typeof (compiledBuildData.resolvedShared.sp_featureStackIR as { parts?: unknown }).parts ===
      'object' &&
    (compiledBuildData.resolvedShared.sp_featureStackIR as { parts?: Record<string, unknown> }).parts !==
      null
      ? Object.keys(
          (compiledBuildData.resolvedShared.sp_featureStackIR as { parts: Record<string, unknown> })
            .parts,
        )
      : []
  const partKeys = [
    ...new Set(
      (compiledBuildData.orderedPartKeys.length > 0
        ? compiledBuildData.orderedPartKeys
        : featureStackPartKeys
      ).filter((partKey) => typeof partKey === 'string' && partKey.length > 0),
    ),
  ]
  return {
    graphDocumentId: LEGACY_GRAPH_DOCUMENT_ID,
    buildRequestId: 'legacy-build-model',
    partKeys,
  }
}

export const buildModelResult = ({
  compiledBuildData,
  executionIntent,
  requestIdentity,
}: BuildModelRequest): Promise<BuildModelResult> => {
  const resolvedExecutionIntent = executionIntent ?? DEFAULT_BUILD_EXECUTION_INTENT
  const request = {
    ...defaultBuildRequestIdentity(compiledBuildData),
    ...(requestIdentity ?? {}),
  }
  const draftGeometryResult = buildFoothookRetainedGeometryResult({
    compiledBuildData,
    request,
  })
  const parts = buildFoothookCompatibleArtifactsFromRetainedGeometryResult(draftGeometryResult)
  const authoritativeGeometryResultPromise: Promise<GeometryResultBundle | null> =
    resolvedExecutionIntent.geometryTarget === 'authoritative'
      ? buildAuthoritativeGeometry({
          compiledBuildData,
          request,
        }).then((result) => result.authoritativeGeometryResult)
      : Promise.resolve(null)
  return authoritativeGeometryResultPromise.then((authoritativeGeometryResult) => ({
    draftGeometryResult,
    authoritativeGeometryResult,
    parts,
  }))
}

export const buildModel = ({
  compiledBuildData,
  executionIntent,
  requestIdentity,
}: BuildModelRequest): Promise<PartArtifact[]> =>
  buildModelResult({
    compiledBuildData,
    executionIntent:
      executionIntent ??
      {
        ...DEFAULT_BUILD_EXECUTION_INTENT,
        geometryTarget: 'draft_preview',
      },
    requestIdentity,
  }).then((result) => result.parts)
