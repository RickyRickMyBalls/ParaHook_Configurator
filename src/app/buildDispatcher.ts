import {
  normalizeInstances,
  PART_ORDER,
  partKeyToString,
} from '../shared/buildTypes'
import type {
  AssembleRequest,
  AssembleResult,
  BoxParams,
  BuildProgress,
  BuildRequest,
  BuildResult,
  PartArtifact,
  PartId,
  WorkerError,
} from '../shared/buildTypes'
import { useBuildStatsStore } from './store/buildStatsStore'

type BuildResultHandler = (result: BuildResult) => void
type AssembleResultHandler = (result: AssembleResult) => void
type WorkerErrorHandler = (error: WorkerError) => void
type BuildInstances = {
  heelKickInstances?: number[]
  toeHookInstances?: number[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const partIds = [...PART_ORDER]
const buildPartOrder: string[] = [
  partKeyToString({ id: 'baseplate', instance: null }),
  partKeyToString({ id: 'heelKick', instance: 1 }),
  partKeyToString({ id: 'toeHook', instance: 1 }),
  partKeyToString({ id: 'assembled', instance: null }),
]

const SIGNATURE_ENGINE_MODE = 'stub_box'
const SIGNATURE_CONTROL_MODE = 'profile_editor'

const isPartArtifact = (value: unknown): value is PartArtifact => {
  if (!isRecord(value)) {
    return false
  }
  if (
    !partIds.includes(value.id as PartId) ||
    typeof value.label !== 'string' ||
    value.kind !== 'box'
  ) {
    return false
  }
  if (!isRecord(value.params)) {
    return false
  }
  if (value.partKeyStr !== undefined && typeof value.partKeyStr !== 'string') {
    return false
  }
  if (value.partKey !== undefined) {
    if (!isRecord(value.partKey)) {
      return false
    }
    if (!partIds.includes(value.partKey.id as PartId)) {
      return false
    }
    if (
      value.partKey.instance !== null &&
      (typeof value.partKey.instance !== 'number' ||
        !Number.isInteger(value.partKey.instance) ||
        value.partKey.instance < 1)
    ) {
      return false
    }
  }
  return (
    typeof value.params.width === 'number' &&
    typeof value.params.length === 'number' &&
    typeof value.params.height === 'number'
  )
}

const isBuildResult = (value: unknown): value is BuildResult => {
  if (!isRecord(value)) {
    return false
  }
  if (value.type !== 'build_result' || typeof value.seq !== 'number') {
    return false
  }
  if (!Array.isArray(value.parts)) {
    return false
  }
  if (value.changedParamIds !== undefined && !isStringArray(value.changedParamIds)) {
    return false
  }
  return value.parts.every(isPartArtifact)
}

const isAssembleResult = (value: unknown): value is AssembleResult => {
  if (!isRecord(value)) {
    return false
  }
  if (
    value.type !== 'assemble_result' ||
    typeof value.seq !== 'number' ||
    typeof value.signature !== 'string'
  ) {
    return false
  }
  if (!isRecord(value.assembled)) {
    return false
  }
  return (
    typeof value.assembled.width === 'number' &&
    typeof value.assembled.length === 'number' &&
    typeof value.assembled.height === 'number'
  )
}

const isWorkerError = (value: unknown): value is WorkerError => {
  if (!isRecord(value)) {
    return false
  }
  return (
    value.type === 'worker_error' &&
    typeof value.seq === 'number' &&
    (value.op === 'assemble' || value.op === 'build' || value.op === 'export') &&
    typeof value.message === 'string'
  )
}

const isBuildProgress = (value: unknown): value is BuildProgress => {
  if (!isRecord(value)) {
    return false
  }
  if (
    value.type !== 'build_progress' ||
    typeof value.seq !== 'number' ||
    typeof value.partKey !== 'string'
  ) {
    return false
  }
  const phaseValid = value.phase === 'parts' || value.phase === 'assemble' || value.phase === 'export'
  const stateValid =
    value.state === 'queued' ||
    value.state === 'cache_hit' ||
    value.state === 'building' ||
    value.state === 'done' ||
    value.state === 'error'
  if (!phaseValid || !stateValid) {
    return false
  }
  if (value.progress01 !== undefined && typeof value.progress01 !== 'number') {
    return false
  }
  if (value.ms !== undefined && typeof value.ms !== 'number') {
    return false
  }
  if (value.message !== undefined && typeof value.message !== 'string') {
    return false
  }
  return true
}

export class BuildDispatcher {
  private readonly worker: Worker
  private seqCounter = 0
  private latestRequestedSeq = 0
  private latestResolvedSeq = 0
  private readonly pendingChangedParamIdsBySeq = new Map<number, string[]>()
  private getChangedParamIdsForNextBuild: (() => string[]) | null = null
  private getBuildInstancesForNextBuild: (() => BuildInstances) | null = null
  private onBuildResult: BuildResultHandler = () => {}
  private onAssembleResult: AssembleResultHandler = () => {}
  private onWorkerError: WorkerErrorHandler = () => {}
  private cachedAssembledSignature: string | null = null
  private hasCachedAssembled = false

  public constructor() {
    this.worker = new Worker(new URL('../worker/worker.ts', import.meta.url), {
      type: 'module',
    })
    this.worker.addEventListener('message', this.handleMessage)
  }

  public setBuildResultHandler(handler: BuildResultHandler): void {
    this.onBuildResult = handler
  }

  public setAssembleResultHandler(handler: AssembleResultHandler): void {
    this.onAssembleResult = handler
  }

  public setWorkerErrorHandler(handler: WorkerErrorHandler): void {
    this.onWorkerError = handler
  }

  public setChangedParamIdsProvider(provider: () => string[]): void {
    this.getChangedParamIdsForNextBuild = provider
  }

  public setBuildInstancesProvider(provider: () => BuildInstances): void {
    this.getBuildInstancesForNextBuild = provider
  }

  public requestBuild(params: BoxParams): number {
    const seq = ++this.seqCounter
    this.latestRequestedSeq = seq
    const buildInstances = this.getBuildInstancesForNextBuild?.()
    const heelKickInstances =
      buildInstances === undefined
        ? undefined
        : normalizeInstances(buildInstances.heelKickInstances)
    const toeHookInstances =
      buildInstances === undefined
        ? undefined
        : normalizeInstances(buildInstances.toeHookInstances)
    const changedParamIds = this.normalizeChangedParamIds(
      this.getChangedParamIdsForNextBuild?.() ?? [],
    )
    this.pendingChangedParamIdsBySeq.set(seq, changedParamIds)
    this.prunePendingChangedParamIds(this.latestRequestedSeq)

    useBuildStatsStore.getState().resetStatsForSeq(seq, buildPartOrder)
    useBuildStatsStore.getState().setOverallState('building')

    const message: BuildRequest = {
      type: 'build',
      seq,
      payload: params,
      ...(changedParamIds.length > 0 ? { changedParamIds } : {}),
      ...(buildInstances === undefined
        ? {}
        : {
            heelKickInstances,
            toeHookInstances,
          }),
    }
    this.worker.postMessage(message)
    return seq
  }

  public requestAssemble(payload: BoxParams): number {
    const seq = ++this.seqCounter
    this.latestRequestedSeq = seq

    useBuildStatsStore.getState().resetStatsForSeq(seq, ['assembled'])
    useBuildStatsStore.getState().setOverallState('assembling')

    const message: AssembleRequest = {
      type: 'assemble',
      seq,
      payload,
    }
    this.worker.postMessage(message)
    return seq
  }

  public isAssembledCacheValid(payload: BoxParams): boolean {
    const signature = this.computeSignature(payload)
    return this.hasCachedAssembled && this.cachedAssembledSignature === signature
  }

  public assembleIfNeeded(payload: BoxParams): void {
    if (!this.isAssembledCacheValid(payload)) {
      this.requestAssemble(payload)
      return
    }

    const seq = this.getCurrentStatsSeq()
    useBuildStatsStore.getState().resetStatsForSeq(seq, ['assembled'])
    useBuildStatsStore.getState().applyProgress({
      type: 'build_progress',
      seq,
      phase: 'assemble',
      partKey: 'assembled',
      state: 'cache_hit',
      progress01: 1,
      ms: 0,
    })
    useBuildStatsStore.getState().applyProgress({
      type: 'build_progress',
      seq,
      phase: 'assemble',
      partKey: 'assembled',
      state: 'done',
      progress01: 1,
      ms: 0,
    })
    useBuildStatsStore.getState().setOverallState('idle')
    useBuildStatsStore.getState().triggerCacheHitPulse()
  }

  public dispose(): void {
    this.worker.removeEventListener('message', this.handleMessage)
    this.worker.terminate()
  }

  private readonly handleMessage = (event: MessageEvent<unknown>): void => {
    this.prunePendingChangedParamIds(this.latestRequestedSeq)

    if (isBuildProgress(event.data)) {
      if (this.isStale(event.data.seq)) {
        return
      }
      useBuildStatsStore.getState().applyProgress(event.data)
      return
    }

    if (isBuildResult(event.data)) {
      if (this.isStale(event.data.seq)) {
        this.pendingChangedParamIdsBySeq.delete(event.data.seq)
        return
      }

      const acceptedChangedParamIds = this.normalizeChangedParamIds(
        event.data.changedParamIds ??
          this.pendingChangedParamIdsBySeq.get(event.data.seq) ??
          [],
      )
      this.pendingChangedParamIdsBySeq.delete(event.data.seq)
      this.latestResolvedSeq = event.data.seq
      this.onBuildResult({
        ...event.data,
        changedParamIds: acceptedChangedParamIds,
      })
      useBuildStatsStore.getState().setOverallState('idle')
      return
    }

    if (isAssembleResult(event.data)) {
      if (this.isStale(event.data.seq)) {
        return
      }

      this.latestResolvedSeq = event.data.seq
      this.cachedAssembledSignature = event.data.signature
      this.hasCachedAssembled = true
      this.onAssembleResult(event.data)
      useBuildStatsStore.getState().setOverallState('idle')
      return
    }

    if (isWorkerError(event.data)) {
      if (this.isStale(event.data.seq)) {
        if (event.data.op === 'build') {
          this.pendingChangedParamIdsBySeq.delete(event.data.seq)
        }
        return
      }
      if (event.data.op === 'build') {
        this.pendingChangedParamIdsBySeq.delete(event.data.seq)
      }
      this.latestResolvedSeq = event.data.seq
      this.onWorkerError(event.data)
      useBuildStatsStore.getState().setOverallState('error')
    }
  }

  private isStale(seq: number): boolean {
    if (seq < this.latestRequestedSeq) {
      return true
    }
    if (seq <= this.latestResolvedSeq) {
      return true
    }
    return false
  }

  private getCurrentStatsSeq(): number {
    if (this.latestRequestedSeq > 0) {
      return this.latestRequestedSeq
    }
    if (this.latestResolvedSeq > 0) {
      return this.latestResolvedSeq
    }
    if (this.seqCounter > 0) {
      return this.seqCounter
    }
    return 1
  }

  private computeSignature(payload: BoxParams): string {
    return `build|engine=${SIGNATURE_ENGINE_MODE}|control=${SIGNATURE_CONTROL_MODE}|width=${payload.width}|length=${payload.length}|height=${payload.height}`
  }

  private normalizeChangedParamIds(ids: readonly unknown[]): string[] {
    const normalized = [
      ...new Set(
        ids.filter((id): id is string => typeof id === 'string' && id.length > 0),
      ),
    ]
    normalized.sort((a, b) => a.localeCompare(b))
    return normalized
  }

  private prunePendingChangedParamIds(minSeq: number): void {
    for (const seq of this.pendingChangedParamIdsBySeq.keys()) {
      if (seq < minSeq) {
        this.pendingChangedParamIdsBySeq.delete(seq)
      }
    }
  }
}

export const buildDispatcher = new BuildDispatcher()
