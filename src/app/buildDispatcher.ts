import {
  isPartArtifact,
  LEGACY_RUNTIME_GRAPH_DOCUMENT_ID,
  LEGACY_RUNTIME_PROJECT_FILE_ID,
  normalizeInstances,
} from '../shared/buildTypes'
import { LEGACY_BUILD_STATS_PART_ORDER } from '../shared/buildStatsKeys'
import type {
  AssembleRequest,
  AssembleResult,
  BuildProgress,
  BuildRequest,
  BuildResult,
  BuildRoutingIdentity,
  BoxParams,
  WorkerError,
} from '../shared/buildTypes'
import { appendConsoleEntry } from './console/useConsoleStore'
import { useBuildStatsStore } from './store/buildStatsStore'

type BuildResultHandler = (result: BuildResult) => void
type AssembleResultHandler = (result: AssembleResult) => void
type WorkerErrorHandler = (error: WorkerError) => void
type BuildInstances = {
  heelKickInstances?: number[]
  toeHookInstances?: number[]
}

type BuildRequestOptions = {
  routingIdentity?: BuildRoutingIdentity
  changedParamIds?: string[]
  buildInstances?: BuildInstances
  buildStatsPartKeys?: string[]
}

type RoutingLedger = {
  latestRequestedSeq: number
  latestResolvedSeq: number
  pendingChangedParamIdsBySeq: Map<number, string[]>
  pendingBuildRequestIdBySeq: Map<number, string>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const SIGNATURE_ENGINE_MODE = 'stub_box'
const SIGNATURE_CONTROL_MODE = 'profile_editor'

const isBuildResult = (value: unknown): value is BuildResult => {
  if (!isRecord(value)) {
    return false
  }
  if (
    value.type !== 'build_result' ||
    typeof value.seq !== 'number' ||
    typeof value.projectFileId !== 'string' ||
    typeof value.graphDocumentId !== 'string' ||
    typeof value.buildRequestId !== 'string'
  ) {
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
  if (
    value.type !== 'worker_error' ||
    typeof value.seq !== 'number' ||
    (value.op !== 'assemble' && value.op !== 'build' && value.op !== 'export') ||
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
  private readonly routingLedgerByKey = new Map<string, RoutingLedger>()
  private getChangedParamIdsForNextBuild: (() => string[]) | null = null
  private getBuildStatsPartKeysForNextBuild: (() => string[]) | null = null
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

  public setBuildStatsPartKeysProvider(provider: () => string[]): void {
    this.getBuildStatsPartKeysForNextBuild = provider
  }

  public requestBuild(params: BoxParams, options?: BuildRequestOptions): number {
    const seq = ++this.seqCounter
    this.latestRequestedSeq = seq
    const routingIdentity = options?.routingIdentity ?? this.createLegacyRoutingIdentity(seq)
    const ledger = this.getOrCreateRoutingLedger(routingIdentity)
    ledger.latestRequestedSeq = seq

    const buildInstances = options?.buildInstances ?? this.getBuildInstancesForNextBuild?.()
    const heelKickInstances =
      buildInstances === undefined
        ? undefined
        : normalizeInstances(buildInstances.heelKickInstances)
    const toeHookInstances =
      buildInstances === undefined
        ? undefined
        : normalizeInstances(buildInstances.toeHookInstances)
    const changedParamIds = this.normalizeChangedParamIds(
      options?.changedParamIds ?? this.getChangedParamIdsForNextBuild?.() ?? [],
    )
    const buildStatsPartKeys = this.normalizeBuildStatsPartKeys(
      options?.buildStatsPartKeys ??
        this.getBuildStatsPartKeysForNextBuild?.() ??
        [...LEGACY_BUILD_STATS_PART_ORDER],
    )
    ledger.pendingChangedParamIdsBySeq.set(seq, changedParamIds)
    ledger.pendingBuildRequestIdBySeq.set(seq, routingIdentity.buildRequestId)
    this.prunePendingRoutingState(ledger)

    useBuildStatsStore.getState().resetStatsForSeq(seq, buildStatsPartKeys)
    useBuildStatsStore.getState().setOverallState('building')
    appendConsoleEntry({
      layer: 'Worker',
      text: `Build started (${routingIdentity.graphDocumentId})`,
      source: routingIdentity.graphDocumentId,
      severity: 'info',
    })

    const message: BuildRequest = {
      type: 'build',
      seq,
      projectFileId: routingIdentity.projectFileId,
      graphDocumentId: routingIdentity.graphDocumentId,
      buildRequestId: routingIdentity.buildRequestId,
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
    appendConsoleEntry({
      layer: 'Worker',
      text: 'Assemble started',
      source: 'assembled',
      severity: 'info',
    })

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
      projectFileId: LEGACY_RUNTIME_PROJECT_FILE_ID,
      graphDocumentId: LEGACY_RUNTIME_GRAPH_DOCUMENT_ID,
      buildRequestId: `legacy-assemble-${seq}`,
      phase: 'assemble',
      partKey: 'assembled',
      state: 'cache_hit',
      progress01: 1,
      ms: 0,
    })
    useBuildStatsStore.getState().applyProgress({
      type: 'build_progress',
      seq,
      projectFileId: LEGACY_RUNTIME_PROJECT_FILE_ID,
      graphDocumentId: LEGACY_RUNTIME_GRAPH_DOCUMENT_ID,
      buildRequestId: `legacy-assemble-${seq}`,
      phase: 'assemble',
      partKey: 'assembled',
      state: 'done',
      progress01: 1,
      ms: 0,
    })
    useBuildStatsStore.getState().setOverallState('idle')
    useBuildStatsStore.getState().triggerCacheHitPulse()
    appendConsoleEntry({
      layer: 'Worker',
      text: 'Assembled cache hit',
      source: 'assembled',
      severity: 'info',
    })
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
      useBuildStatsStore.getState().applyProgress(event.data)
      appendConsoleEntry({
        layer: 'Worker',
        text: `${event.data.partKey}: ${event.data.state}`,
        source: event.data.graphDocumentId,
        severity: event.data.state === 'error' ? 'error' : 'info',
      })
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
      this.onBuildResult({
        ...event.data,
        changedParamIds: acceptedChangedParamIds,
      })
      useBuildStatsStore.getState().setOverallState('idle')
      appendConsoleEntry({
        layer: 'Worker',
        text: `Build complete (${event.data.graphDocumentId})`,
        source: event.data.graphDocumentId,
        severity: 'info',
      })
      return
    }

    if (isAssembleResult(event.data)) {
      if (this.isGlobalStale(event.data.seq)) {
        return
      }

      this.latestResolvedSeq = event.data.seq
      this.cachedAssembledSignature = event.data.signature
      this.hasCachedAssembled = true
      this.onAssembleResult(event.data)
      useBuildStatsStore.getState().setOverallState('idle')
      appendConsoleEntry({
        layer: 'Worker',
        text: 'Assemble complete',
        source: 'assembled',
        severity: 'info',
      })
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
      useBuildStatsStore.getState().setOverallState('error')
      appendConsoleEntry({
        layer: 'Diagnostics',
        text: event.data.message,
        source:
          event.data.graphDocumentId ??
          (event.data.op === 'assemble' ? 'assembled' : event.data.op),
        severity: 'error',
      })
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

  private normalizeBuildStatsPartKeys(partKeys: readonly unknown[]): string[] {
    const normalized = [
      ...new Set(
        partKeys.filter(
          (partKey): partKey is string => typeof partKey === 'string' && partKey.length > 0,
        ),
      ),
    ]
    return normalized.length > 0 ? normalized : [...LEGACY_BUILD_STATS_PART_ORDER]
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
