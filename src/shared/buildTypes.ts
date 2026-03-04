export type BoxParams = {
  width: number
  length: number
  height: number
}

export type ViewMode = 'parts' | 'assembled'
export type BuildPhase = 'parts' | 'assemble' | 'export'
export type BuildProgressState = 'queued' | 'cache_hit' | 'building' | 'done' | 'error'

export const PART_ORDER = ['baseplate', 'heelKick', 'toeHook', 'assembled'] as const

export type PartId = (typeof PART_ORDER)[number]
export type PartKey = {
  id: PartId
  instance: number | null
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

export type PartArtifact = {
  id: PartId
  label: string
  kind: 'box'
  params: BoxParams
  partKeyStr?: string
  partKey?: PartKey
}

export type BuildRequest = {
  type: 'build'
  seq: number
  payload: BoxParams
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
  seq: number
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
}

export type BuildProgress = {
  type: 'build_progress'
  seq: number
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
