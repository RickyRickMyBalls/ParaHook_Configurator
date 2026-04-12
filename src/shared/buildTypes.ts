import type { GeometryResultBundle } from './geometryResult'

export type BoxParams = {
  width: number
  length: number
  height: number
}

export const LEGACY_RUNTIME_PROJECT_FILE_ID = 'legacy-runtime-project'
export const LEGACY_RUNTIME_GRAPH_DOCUMENT_ID = 'legacy-runtime-graph'

export type BuildRoutingIdentity = {
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
}
export type BuildUnitId = string

export type ViewMode = 'parts'
export type BuildPhase = 'parts' | 'export'
export type WorkerLane = 'build' | 'export'
export type BuildProgressState = 'queued' | 'cache_hit' | 'building' | 'done' | 'error'
export type GeometryExecutionTarget = 'draft_preview' | 'authoritative'
export type DraftSchedulingPolicy = 'live' | 'release' | 'settle' | 'suppressed'
export type AuthoritativeSchedulingPolicy = 'live' | 'release' | 'settle' | 'explicit'
export type BuildExecutionIntent = {
  buildMode: 'preview' | 'final'
  quality: 'draft' | 'full'
  updatePolicy: 'auto' | 'defer_until_release' | 'manual'
  draftPolicy: DraftSchedulingPolicy
  authoritativePolicy: AuthoritativeSchedulingPolicy
  outputIntent: 'transient_preview' | 'accepted_final'
  geometryTarget: GeometryExecutionTarget
}

export const DEFAULT_BUILD_EXECUTION_INTENT = {
  buildMode: 'final',
  quality: 'full',
  updatePolicy: 'auto',
  draftPolicy: 'live',
  authoritativePolicy: 'explicit',
  outputIntent: 'accepted_final',
  geometryTarget: 'authoritative',
} as const satisfies BuildExecutionIntent

export type PartId = string
export type PartKey = {
  id: PartId
  instance: number | null
}

export type ArtifactMesh = {
  vertices: number[]
  indices: number[]
}

export const normalizeInstances = (instances?: number[]): number[] => {
  if (instances === undefined || instances.length === 0) {
    return [1]
  }
  const normalized = [
    ...new Set(
      instances.filter(
        (value) => Number.isInteger(value) && Number.isFinite(value) && value >= 1,
      ),
    ),
  ]
  normalized.sort((a, b) => a - b)
  return normalized.length > 0 ? normalized : [1]
}

export const partKeyToString = (partKey: PartKey): string =>
  partKey.instance === null ? partKey.id : `${partKey.id}#${partKey.instance}`

export const parsePartKeyString = (partKeyStr: string): PartKey => {
  const match = /^(.*)#([1-9]\d*)$/.exec(partKeyStr)
  if (match === null) {
    return {
      id: partKeyStr,
      instance: null,
    }
  }
  return {
    id: match[1],
    instance: Number(match[2]),
  }
}

export type BoxPartArtifact = {
  id: PartId
  label: string
  kind: 'box'
  params: BoxParams
  partKeyStr: string
  partKey: PartKey
}

export type MeshPartArtifact = {
  id: PartId
  label: string
  kind: 'mesh'
  mesh: ArtifactMesh
  partKeyStr: string
  partKey: PartKey
}

export type PartArtifact = BoxPartArtifact | MeshPartArtifact

export type ViewerRenderablePart = {
  viewerKey: string
  artifact: PartArtifact
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export const isPartKey = (value: unknown): value is PartKey => {
  if (!isRecord(value)) {
    return false
  }
  if (typeof value.id !== 'string' || value.id.length === 0) {
    return false
  }
  return (
    value.instance === null ||
    (typeof value.instance === 'number' &&
      Number.isInteger(value.instance) &&
      value.instance >= 1)
  )
}

export const getPartArtifactKey = (artifact: PartArtifact): string => artifact.partKeyStr

const isArtifactMesh = (value: unknown): value is ArtifactMesh =>
  isRecord(value) &&
  Array.isArray(value.vertices) &&
  value.vertices.every((item) => typeof item === 'number' && Number.isFinite(item)) &&
  value.vertices.length % 3 === 0 &&
  Array.isArray(value.indices) &&
  value.indices.every(
    (item) =>
      typeof item === 'number' &&
      Number.isInteger(item) &&
      Number.isFinite(item) &&
      item >= 0,
  )

export const isPartArtifact = (value: unknown): value is PartArtifact => {
  if (!isRecord(value)) {
    return false
  }
  if (
    typeof value.id !== 'string' ||
    value.id.length === 0 ||
    typeof value.label !== 'string' ||
    typeof value.partKeyStr !== 'string' ||
    value.partKeyStr.length === 0 ||
    !isPartKey(value.partKey)
  ) {
    return false
  }
  if (value.kind === 'box') {
    if (
      !isRecord(value.params) ||
      typeof value.params.width !== 'number' ||
      typeof value.params.length !== 'number' ||
      typeof value.params.height !== 'number'
    ) {
      return false
    }
  } else if (value.kind === 'mesh') {
    if (!isArtifactMesh(value.mesh)) {
      return false
    }
  } else {
    return false
  }
  return partKeyToString(value.partKey) === value.partKeyStr
}

export const toViewerRenderablePart = (
  artifact: PartArtifact,
  viewerKey: string = artifact.partKeyStr,
): ViewerRenderablePart => ({
  viewerKey,
  artifact,
})

export type CompiledBuildData = {
  orderedPartKeys: string[]
  resolvedParts: Record<string, Record<string, unknown>>
  outputEntries?: CompiledBuildDataOutputEntry[]
  resolvedShared?: Record<string, unknown>
}

export type CompiledBuildDataOutputEntry = {
  buildUnitId: BuildUnitId
  outputEntryId: string
  sourceNodeId: string
  partKey: string
  bodyId?: string | null
}

export type BuildIdentity = {
  graphRevision: number
  targetBuildUnitIds: BuildUnitId[]
}

export type BuildInvalidation = {
  affectedBuildUnitIds: BuildUnitId[]
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isCompiledBuildDataOutputEntry = (
  value: unknown,
): value is CompiledBuildDataOutputEntry =>
  isRecord(value) &&
  typeof value.buildUnitId === 'string' &&
  value.buildUnitId.length > 0 &&
  typeof value.outputEntryId === 'string' &&
  value.outputEntryId.length > 0 &&
  typeof value.sourceNodeId === 'string' &&
  value.sourceNodeId.length > 0 &&
  typeof value.partKey === 'string' &&
  value.partKey.length > 0 &&
  (value.bodyId === undefined || value.bodyId === null || typeof value.bodyId === 'string')

export const isCompiledBuildData = (value: unknown): value is CompiledBuildData =>
  isRecord(value) &&
  isStringArray(value.orderedPartKeys) &&
  isRecord(value.resolvedParts) &&
  Object.values(value.resolvedParts).every(isRecord) &&
  (value.outputEntries === undefined ||
    (Array.isArray(value.outputEntries) &&
      value.outputEntries.every(isCompiledBuildDataOutputEntry))) &&
  (value.resolvedShared === undefined || isRecord(value.resolvedShared))

export const isBuildIdentity = (value: unknown): value is BuildIdentity =>
  isRecord(value) &&
  typeof value.graphRevision === 'number' &&
  Number.isInteger(value.graphRevision) &&
  value.graphRevision >= 0 &&
  isStringArray(value.targetBuildUnitIds)

export const isBuildInvalidation = (value: unknown): value is BuildInvalidation =>
  isRecord(value) && isStringArray(value.affectedBuildUnitIds)

type BuildRequestBase = {
  type: 'build'
  lane: 'build'
  seq: number
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  executionIntent: BuildExecutionIntent
  compiledBuildData: CompiledBuildData
  buildIdentity: BuildIdentity
  invalidation: BuildInvalidation
  changedParamIds?: string[]
}

export type BuildRequest = BuildRequestBase

export type BuildResultClass = 'transient' | 'draft' | 'final'
export type BuildResultEntryStatus = 'rebuilt' | 'retained' | 'evicted'

export type BuildResultEntry = {
  buildUnitId: BuildUnitId
  outputEntryId: string
  sourceNodeId: string | null
  status: BuildResultEntryStatus
  resultClass: BuildResultClass
  artifacts: PartArtifact[]
}

export type BuildResultBundleSummary = {
  rebuiltCount: number
  retainedCount: number
  evictedCount: number
}

export type BuildResultBundle = {
  buildRequestId: string
  graphDocumentId: string
  seq: number
  resultClass: BuildResultClass
  executionIntent: BuildExecutionIntent
  summary: BuildResultBundleSummary
  entries: BuildResultEntry[]
}

const isBuildResultClass = (value: unknown): value is BuildResultClass =>
  value === 'transient' || value === 'draft' || value === 'final'

const isBuildResultEntryStatus = (value: unknown): value is BuildResultEntryStatus =>
  value === 'rebuilt' || value === 'retained' || value === 'evicted'

export const isBuildResultEntry = (value: unknown): value is BuildResultEntry =>
  isRecord(value) &&
  typeof value.buildUnitId === 'string' &&
  value.buildUnitId.length > 0 &&
  typeof value.outputEntryId === 'string' &&
  value.outputEntryId.length > 0 &&
  (value.sourceNodeId === null || typeof value.sourceNodeId === 'string') &&
  isBuildResultEntryStatus(value.status) &&
  isBuildResultClass(value.resultClass) &&
  Array.isArray(value.artifacts) &&
  value.artifacts.every(isPartArtifact)

export const isBuildResultBundle = (value: unknown): value is BuildResultBundle =>
  isRecord(value) &&
  typeof value.buildRequestId === 'string' &&
  value.buildRequestId.length > 0 &&
  typeof value.graphDocumentId === 'string' &&
  value.graphDocumentId.length > 0 &&
  typeof value.seq === 'number' &&
  Number.isInteger(value.seq) &&
  isBuildResultClass(value.resultClass) &&
  isRecord(value.executionIntent) &&
  (value.executionIntent.buildMode === 'preview' || value.executionIntent.buildMode === 'final') &&
  (value.executionIntent.quality === 'draft' || value.executionIntent.quality === 'full') &&
  (value.executionIntent.updatePolicy === 'auto' ||
    value.executionIntent.updatePolicy === 'defer_until_release' ||
    value.executionIntent.updatePolicy === 'manual') &&
  (value.executionIntent.draftPolicy === 'live' ||
    value.executionIntent.draftPolicy === 'release' ||
    value.executionIntent.draftPolicy === 'settle' ||
    value.executionIntent.draftPolicy === 'suppressed') &&
  (value.executionIntent.authoritativePolicy === 'live' ||
    value.executionIntent.authoritativePolicy === 'release' ||
    value.executionIntent.authoritativePolicy === 'settle' ||
    value.executionIntent.authoritativePolicy === 'explicit') &&
  (value.executionIntent.outputIntent === 'transient_preview' ||
    value.executionIntent.outputIntent === 'accepted_final') &&
  (value.executionIntent.geometryTarget === 'draft_preview' ||
    value.executionIntent.geometryTarget === 'authoritative') &&
  isRecord(value.summary) &&
  typeof value.summary.rebuiltCount === 'number' &&
  typeof value.summary.retainedCount === 'number' &&
  typeof value.summary.evictedCount === 'number' &&
  Array.isArray(value.entries) &&
  value.entries.every(isBuildResultEntry)

export type BuildResult = {
  type: 'build_result'
  lane: 'build'
  seq: number
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  bundle: BuildResultBundle
  draftGeometryResult?: GeometryResultBundle
  authoritativeGeometryResult?: GeometryResultBundle
  changedParamIds?: string[]
}

export type ReleaseAuthoritativeHandlesRequest = {
  type: 'release_authoritative_handles'
  handleIds: string[]
}

export const buildResultClassFromExecutionIntent = (
  executionIntent: BuildExecutionIntent,
): BuildResultClass => {
  if (executionIntent.outputIntent === 'accepted_final') {
    return 'final'
  }
  if (executionIntent.quality === 'draft') {
    return 'draft'
  }
  return 'transient'
}

export type WorkerError = {
  type: 'worker_error'
  seq: number
  op: 'build' | 'export'
  message: string
  lane?: WorkerLane
  projectFileId?: string
  graphDocumentId?: string
  buildRequestId?: string
}

export type BuildSuperseded = {
  type: 'build_superseded'
  seq: number
  lane: 'build'
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
}

export type BuildProgress = {
  type: 'build_progress'
  seq: number
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  lane?: WorkerLane
  phase: BuildPhase
  partKey: string
  state: BuildProgressState
  progress01?: number
  ms?: number
  message?: string
}

export type WorkerOutboundMessage =
  | BuildResult
  | BuildSuperseded
  | WorkerError
  | BuildProgress
