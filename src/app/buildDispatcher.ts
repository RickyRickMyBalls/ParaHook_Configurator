import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  isBuildResultBundle,
  LEGACY_RUNTIME_GRAPH_DOCUMENT_ID,
  LEGACY_RUNTIME_PROJECT_FILE_ID,
} from '../shared/buildTypes'
import type {
  BuildIdentity,
  BuildInvalidation,
  BuildProgress,
  BuildRequest,
  BuildResult,
  BuildRoutingIdentity,
  BuildExecutionIntent,
  CompiledBuildData,
  WorkerError,
} from '../shared/buildTypes'

type BuildResultHandler = (result: BuildResult) => void
type WorkerErrorHandler = (error: WorkerError) => void

type GraphBuildRequestOptions = {
  routingIdentity?: BuildRoutingIdentity
  executionIntent?: BuildExecutionIntent
  changedParamIds?: string[]
  buildStatsPartKeys?: string[]
  compiledBuildData: CompiledBuildData
  buildIdentity: BuildIdentity
  invalidation: BuildInvalidation
}

type RoutingLedger = {
  latestRequestedSeq: number
  latestResolvedSeq: number
  pendingChangedParamIdsBySeq: Map<number, string[]>
  pendingBuildRequestIdBySeq: Map<number, string>
}

export type BuildRequestStartedContext = {
  seq: number
  routingIdentity: BuildRoutingIdentity
  executionIntent: BuildExecutionIntent
  buildStatsPartKeys: string[]
}

export type BuildDispatcherRuntimeHooks = {
  onBuildRequestStarted?: (context: BuildRequestStartedContext) => void
  onBuildProgress?: (progress: BuildProgress) => void
  onBuildResultSettled?: (result: BuildResult) => void
  onWorkerError?: (error: WorkerError) => void
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isBuildResult = (value: unknown): value is BuildResult => {
  if (!isRecord(value)) {
    return false
  }
  if (
    value.type !== 'build_result' ||
    value.lane !== 'build' ||
    typeof value.seq !== 'number' ||
    typeof value.projectFileId !== 'string' ||
    typeof value.graphDocumentId !== 'string' ||
    typeof value.buildRequestId !== 'string'
  ) {
    return false
  }
  if (value.changedParamIds !== undefined && !isStringArray(value.changedParamIds)) {
    return false
  }
  return isBuildResultBundle(value.bundle)
}

const isWorkerError = (value: unknown): value is WorkerError => {
  if (!isRecord(value)) {
    return false
  }
  if (
    value.type !== 'worker_error' ||
    typeof value.seq !== 'number' ||
    (value.op !== 'build' && value.op !== 'export') ||
    typeof value.message !== 'string'
  ) {
    return false
  }
  if (value.projectFileId !== undefined && typeof value.projectFileId !== 'string') {
    return false
  }
  if (value.graphDocumentId !== undefined && typeof value.graphDocumentId !== 'string') {
    return false
  }
  if (value.buildRequestId !== undefined && typeof value.buildRequestId !== 'string') {
    return false
  }
  if (value.lane !== undefined && value.lane !== 'build' && value.lane !== 'export') {
    return false
  }
  if (value.op === 'build' && value.lane !== 'build') {
    return false
  }
  return true
}

const isBuildProgress = (value: unknown): value is BuildProgress => {
  if (!isRecord(value)) {
    return false
  }
  if (
    value.type !== 'build_progress' ||
    typeof value.seq !== 'number' ||
    typeof value.projectFileId !== 'string' ||
    typeof value.graphDocumentId !== 'string' ||
    typeof value.buildRequestId !== 'string' ||
    typeof value.partKey !== 'string'
  ) {
    return false
  }
  const phaseValid = value.phase === 'parts' || value.phase === 'export'
  const laneValid = value.lane === undefined || value.lane === 'build' || value.lane === 'export'
  const stateValid =
    value.state === 'queued' ||
    value.state === 'cache_hit' ||
    value.state === 'building' ||
    value.state === 'done' ||
    value.state === 'error'
  if (!phaseValid || !laneValid || !stateValid) {
    return false
  }
  if (value.phase === 'parts' && value.lane !== 'build') {
    return false
  }
  if (value.phase === 'export' && value.lane !== 'export') {
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
  private readonly routingLedgerByKey = new Map<string, RoutingLedger>()
  private onBuildResult: BuildResultHandler = () => {}
  private onWorkerError: WorkerErrorHandler = () => {}
  private runtimeHooks: BuildDispatcherRuntimeHooks = {}

  public constructor() {
    this.worker = new Worker(new URL('../worker/worker.ts', import.meta.url), {
      type: 'module',
    })
    this.worker.addEventListener('message', this.handleMessage)
  }

  public setBuildResultHandler(handler: BuildResultHandler): void {
    this.onBuildResult = handler
  }

  public setWorkerErrorHandler(handler: WorkerErrorHandler): void {
    this.onWorkerError = handler
  }

  public setRuntimeHooks(hooks: BuildDispatcherRuntimeHooks): void {
    this.runtimeHooks = hooks
  }

  public requestGraphBuild(options: GraphBuildRequestOptions): number {
    const seq = ++this.seqCounter
    this.latestRequestedSeq = seq
    const routingIdentity = options.routingIdentity ?? this.createLegacyRoutingIdentity(seq)
    const executionIntent = {
      ...(options.executionIntent ?? DEFAULT_BUILD_EXECUTION_INTENT),
    } satisfies BuildExecutionIntent
    const ledger = this.getOrCreateRoutingLedger(routingIdentity)
    ledger.latestRequestedSeq = seq

    const changedParamIds = this.normalizeChangedParamIds(options.changedParamIds ?? [])
    const buildStatsPartKeys = this.normalizeBuildStatsPartKeys(
      options.buildStatsPartKeys ?? options.compiledBuildData.orderedPartKeys,
    )
    ledger.pendingChangedParamIdsBySeq.set(seq, changedParamIds)
    ledger.pendingBuildRequestIdBySeq.set(seq, routingIdentity.buildRequestId)
    this.prunePendingRoutingState(ledger)

    const message: BuildRequest = {
      type: 'build',
      lane: 'build',
      seq,
      projectFileId: routingIdentity.projectFileId,
      graphDocumentId: routingIdentity.graphDocumentId,
      buildRequestId: routingIdentity.buildRequestId,
      executionIntent,
      compiledBuildData: options.compiledBuildData,
      buildIdentity: options.buildIdentity,
      invalidation: options.invalidation,
      ...(changedParamIds.length > 0 ? { changedParamIds } : {}),
    }
    this.runtimeHooks.onBuildRequestStarted?.({
      seq,
      routingIdentity,
      executionIntent,
      buildStatsPartKeys,
    })
    this.worker.postMessage(message)
    return seq
  }

  public dispose(): void {
    this.worker.removeEventListener('message', this.handleMessage)
    this.worker.terminate()
  }

  private readonly handleMessage = (event: MessageEvent<unknown>): void => {
    if (isBuildProgress(event.data)) {
      const ledger = this.getOrCreateRoutingLedger(event.data)
      this.prunePendingRoutingState(ledger)
      if (this.isBuildStale(event.data.seq, event.data.buildRequestId, ledger)) {
        return
      }
      this.runtimeHooks.onBuildProgress?.(event.data)
      return
    }

    if (isBuildResult(event.data)) {
      const ledger = this.getOrCreateRoutingLedger(event.data)
      this.prunePendingRoutingState(ledger)
      if (this.isBuildStale(event.data.seq, event.data.buildRequestId, ledger)) {
        ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
        ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
        return
      }

      const acceptedChangedParamIds = this.normalizeChangedParamIds(
        event.data.changedParamIds ??
          ledger.pendingChangedParamIdsBySeq.get(event.data.seq) ??
          [],
      )
      ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
      ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
      ledger.latestResolvedSeq = event.data.seq
      const acceptedResult = {
        ...event.data,
        changedParamIds: acceptedChangedParamIds,
      }
      this.onBuildResult(acceptedResult)
      this.runtimeHooks.onBuildResultSettled?.(acceptedResult)
      return
    }

    if (isWorkerError(event.data)) {
      if (event.data.op === 'build' && this.hasRoutingIdentity(event.data)) {
        const ledger = this.getOrCreateRoutingLedger(event.data)
        this.prunePendingRoutingState(ledger)
        if (this.isBuildStale(event.data.seq, event.data.buildRequestId, ledger)) {
          ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
          ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
          return
        }
        ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
        ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
        ledger.latestResolvedSeq = event.data.seq
      } else if (this.isGlobalStale(event.data.seq)) {
        return
      }
      this.latestResolvedSeq = event.data.seq
      this.onWorkerError(event.data)
      this.runtimeHooks.onWorkerError?.(event.data)
    }
  }

  private isGlobalStale(seq: number): boolean {
    if (seq < this.latestRequestedSeq) {
      return true
    }
    if (seq <= this.latestResolvedSeq) {
      return true
    }
    return false
  }

  private isBuildStale(
    seq: number,
    buildRequestId: string,
    ledger: RoutingLedger,
  ): boolean {
    if (seq < ledger.latestRequestedSeq) {
      return true
    }
    if (seq <= ledger.latestResolvedSeq) {
      return true
    }
    const expectedBuildRequestId = ledger.pendingBuildRequestIdBySeq.get(seq)
    if (expectedBuildRequestId === undefined) {
      return true
    }
    if (expectedBuildRequestId !== buildRequestId) {
      return true
    }
    return false
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

  private normalizeBuildStatsPartKeys(partKeys: readonly unknown[]): string[] {
    const normalized = [
      ...new Set(
        partKeys.filter(
          (partKey): partKey is string => typeof partKey === 'string' && partKey.length > 0,
        ),
      ),
    ]
    return normalized
  }

  private prunePendingRoutingState(ledger: RoutingLedger): void {
    for (const seq of ledger.pendingChangedParamIdsBySeq.keys()) {
      if (seq < ledger.latestRequestedSeq) {
        ledger.pendingChangedParamIdsBySeq.delete(seq)
      }
    }
    for (const seq of ledger.pendingBuildRequestIdBySeq.keys()) {
      if (seq < ledger.latestRequestedSeq) {
        ledger.pendingBuildRequestIdBySeq.delete(seq)
      }
    }
  }

  private getOrCreateRoutingLedger(
    identity: Pick<BuildRoutingIdentity, 'projectFileId' | 'graphDocumentId'>,
  ): RoutingLedger {
    const key = this.buildRoutingKey(identity)
    const existing = this.routingLedgerByKey.get(key)
    if (existing !== undefined) {
      return existing
    }
    const created: RoutingLedger = {
      latestRequestedSeq: 0,
      latestResolvedSeq: 0,
      pendingChangedParamIdsBySeq: new Map<number, string[]>(),
      pendingBuildRequestIdBySeq: new Map<number, string>(),
    }
    this.routingLedgerByKey.set(key, created)
    return created
  }

  private buildRoutingKey(
    identity: Pick<BuildRoutingIdentity, 'projectFileId' | 'graphDocumentId'>,
  ): string {
    return `${identity.projectFileId}::${identity.graphDocumentId}`
  }

  private createLegacyRoutingIdentity(seq: number): BuildRoutingIdentity {
    return {
      projectFileId: LEGACY_RUNTIME_PROJECT_FILE_ID,
      graphDocumentId: LEGACY_RUNTIME_GRAPH_DOCUMENT_ID,
      buildRequestId: `legacy-build-${seq}`,
    }
  }

  private hasRoutingIdentity(
    error: WorkerError,
  ): error is WorkerError & Required<Pick<BuildRoutingIdentity, 'projectFileId' | 'graphDocumentId' | 'buildRequestId'>> {
    return (
      typeof error.projectFileId === 'string' &&
      typeof error.graphDocumentId === 'string' &&
      typeof error.buildRequestId === 'string'
    )
  }
}

export const buildDispatcher = new BuildDispatcher()
