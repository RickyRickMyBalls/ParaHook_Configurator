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

export type ViewMode = 'parts' | 'assembled'
export type BuildPhase = 'parts' | 'assemble' | 'export'
export type WorkerLane = 'build' | 'export'
export type BuildProgressState = 'queued' | 'cache_hit' | 'building' | 'done' | 'error'
export type BuildExecutionIntent = {
  buildMode: 'preview' | 'final'
  quality: 'draft' | 'full'
  updatePolicy: 'auto' | 'defer_until_release' | 'manual'
  outputIntent: 'transient_preview' | 'accepted_final'
}

export const DEFAULT_BUILD_EXECUTION_INTENT = {
  buildMode: 'final',
  quality: 'full',
  updatePolicy: 'auto',
  outputIntent: 'accepted_final',
} as const satisfies BuildExecutionIntent

export const PART_ORDER = ['baseplate', 'heelKick', 'toeHook', 'assembled'] as const

export type LegacyPartId = (typeof PART_ORDER)[number]
export type PartId = string
export type PartKey = {
  id: PartId
  instance: number | null
}

export type ArtifactMesh = {
  vertices: number[]
  indices: number[]
}

export const isInstancePartId = (id: PartId): id is 'heelKick' | 'toeHook' =>
  id === 'heelKick' || id === 'toeHook'

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

export type CompiledBuildInstances = {
  heelKickInstances: number[]
  toeHookInstances: number[]
}

export type CompiledBuildData = {
  instances: CompiledBuildInstances
  orderedPartKeys: string[]
  resolvedParts: Record<string, Record<string, unknown>>
  resolvedShared?: Record<string, unknown>
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

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number')

export const isCompiledBuildInstances = (value: unknown): value is CompiledBuildInstances =>
  isRecord(value) &&
  isNumberArray(value.heelKickInstances) &&
  isNumberArray(value.toeHookInstances)

export const isCompiledBuildData = (value: unknown): value is CompiledBuildData =>
  isRecord(value) &&
  isCompiledBuildInstances(value.instances) &&
  isStringArray(value.orderedPartKeys) &&
  isRecord(value.resolvedParts) &&
  Object.values(value.resolvedParts).every(isRecord) &&
  (value.resolvedShared === undefined || isRecord(value.resolvedShared))

export const isBuildIdentity = (value: unknown): value is BuildIdentity =>
  isRecord(value) &&
  typeof value.graphRevision === 'number' &&
  Number.isInteger(value.graphRevision) &&
  value.graphRevision >= 0 &&
  isStringArray(value.targetBuildUnitIds)

export const isBuildInvalidation = (value: unknown): value is BuildInvalidation =>
  isRecord(value) && isStringArray(value.affectedBuildUnitIds)

export type BuildRequest = {
  type: 'build'
  lane: 'build'
  seq: number
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  payload: BoxParams
  executionIntent: BuildExecutionIntent
  buildIdentity?: BuildIdentity
  invalidation?: BuildInvalidation
  compiledBuildData?: CompiledBuildData
  changedParamIds?: string[]
  heelKickInstances?: number[]
  toeHookInstances?: number[]
}

export type AssembleRequest = {
  type: 'assemble'
  seq: number
  payload: BoxParams
}

export type BuildResult = {
  type: 'build_result'
  lane: 'build'
  seq: number
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  parts: PartArtifact[]
  changedParamIds?: string[]
}

export type AssembleResult = {
  type: 'assemble_result'
  seq: number
  assembled: {
    width: number
    length: number
    height: number
  }
  signature: string
}

export type WorkerError = {
  type: 'worker_error'
  seq: number
  op: 'assemble' | 'build' | 'export'
  message: string
  lane?: WorkerLane
  projectFileId?: string
  graphDocumentId?: string
  buildRequestId?: string
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
  | AssembleResult
  | WorkerError
  | BuildProgress
