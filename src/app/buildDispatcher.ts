import {
  getGeometryResultAuthoritativeHandleId,
  isGeometryResultBundle,
} from '../shared/geometryResult'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  isBuildResultBundle,
  LEGACY_RUNTIME_GRAPH_DOCUMENT_ID,
  LEGACY_RUNTIME_PROJECT_FILE_ID,
} from '../shared/buildTypes'
import type {
  BuildChangedInputHint,
  BuildIdentity,
  BuildInvalidation,
  BuildProgress,
  BuildRequest,
  BuildResult,
  BuildRoutingIdentity,
  BuildExecutionIntent,
  BuildSuperseded,
  CompiledBuildData,
  WorkerError,
} from '../shared/buildTypes'
import {
  isExportWorkerResult,
  type AuthoritativeExportInput,
  type ExportFormat,
  type ExportWorkerRequest,
  type ExportWorkerResult,
} from '../shared/exportTypes'

type BuildResultHandler = (result: BuildResult) => void
type ExportResultHandler = (result: ExportWorkerResult) => void
type WorkerErrorHandler = (error: WorkerError) => void
type BuildDispatcherWorker = Pick<
  Worker,
  'addEventListener' | 'removeEventListener' | 'postMessage' | 'terminate'
>

type GraphBuildRequestOptions = {
  routingIdentity?: BuildRoutingIdentity
  executionIntent?: BuildExecutionIntent
  changedParamIds?: string[]
  changedInputHint?: BuildChangedInputHint
  buildStatsPartKeys?: string[]
  compiledBuildData: CompiledBuildData
  buildIdentity: BuildIdentity
  invalidation: BuildInvalidation
}

type GraphExportRequestOptions = {
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  requestId: string
  format: ExportFormat
  input: AuthoritativeExportInput
}

type GeometryExecutionTarget = BuildExecutionIntent['geometryTarget']

type RoutingLedger = {
  latestRequestedSeq: number
  latestRequestedBuildRequestId: string | null
  latestResolvedSeq: number
  pendingChangedParamIdsBySeq: Map<number, string[]>
  pendingBuildRequestIdBySeq: Map<number, string>
}

type ExportRoutingLedger = {
  latestRequestedSeq: number
  latestResolvedSeq: number
  pendingRequestBySeq: Map<
    number,
    {
      buildRequestId: string
      requestId: string
    }
  >
}

export type BuildSupersessionTarget = Pick<
  BuildRoutingIdentity,
  'projectFileId' | 'graphDocumentId'
>

export type LatestBuildRequestSnapshot = BuildSupersessionTarget & {
  latestRequestedSeq: number
  latestRequestedBuildRequestId: string | null
  latestResolvedSeq: number
}

export type BuildRequestStartedContext = {
  seq: number
  routingIdentity: BuildRoutingIdentity
  executionIntent: BuildExecutionIntent
  buildStatsPartKeys: string[]
}

export type BuildDispatcherRuntimeHooks = {
  onBuildRequestStarted?: (context: BuildRequestStartedContext) => void
  onExportRequestStarted?: (request: ExportWorkerRequest) => void
  onBuildProgress?: (progress: BuildProgress) => void
  onBuildSuperseded?: (superseded: BuildSuperseded) => void
  onBuildResultSettled?: (result: BuildResult) => void
  onExportResultSettled?: (result: ExportWorkerResult) => void
  onExportError?: (error: WorkerError) => void
  onWorkerError?: (error: WorkerError) => void
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isOptionalBuildGeometryResult = (
  value: unknown,
  options: {
    graphDocumentId: string
    buildRequestId: string
    expectedResultClass: 'draft' | 'authoritative'
  },
): boolean => {
  if (value === undefined) {
    return true
  }
  if (!isGeometryResultBundle(value)) {
    return false
  }
  return (
    value.request.graphDocumentId === options.graphDocumentId &&
    value.request.buildRequestId === options.buildRequestId &&
    value.resultClass === options.expectedResultClass
  )
}

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
  if (
    !isOptionalBuildGeometryResult(value.draftGeometryResult, {
      graphDocumentId: value.graphDocumentId,
      buildRequestId: value.buildRequestId,
      expectedResultClass: 'draft',
    }) ||
    !isOptionalBuildGeometryResult(value.authoritativeGeometryResult, {
      graphDocumentId: value.graphDocumentId,
      buildRequestId: value.buildRequestId,
      expectedResultClass: 'authoritative',
    })
  ) {
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
  if (value.requestId !== undefined && typeof value.requestId !== 'string') {
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

const isBuildSuperseded = (value: unknown): value is BuildSuperseded => {
  if (!isRecord(value)) {
    return false
  }
  return (
    value.type === 'build_superseded' &&
    value.lane === 'build' &&
    typeof value.seq === 'number' &&
    typeof value.projectFileId === 'string' &&
    typeof value.graphDocumentId === 'string' &&
    typeof value.buildRequestId === 'string'
  )
}

export class BuildDispatcher {
  private readonly draftWorker: BuildDispatcherWorker
  private readonly authoritativeWorker: BuildDispatcherWorker
  private seqCounter = 0
  private latestRequestedSeq = 0
  private latestResolvedSeq = 0
  private readonly routingLedgerByKey = new Map<string, RoutingLedger>()
  private readonly exportRoutingLedgerByKey = new Map<string, ExportRoutingLedger>()
  private readonly executionTargetBySeq = new Map<number, GeometryExecutionTarget>()
  private onBuildResult: BuildResultHandler = () => {}
  private onExportResult: ExportResultHandler = () => {}
  private onWorkerError: WorkerErrorHandler = () => {}
  private runtimeHooks: BuildDispatcherRuntimeHooks = {}

  public constructor() {
    this.draftWorker = this.createWorker()
    this.authoritativeWorker = this.createWorker()
    this.draftWorker.addEventListener('message', this.handleMessage)
    this.authoritativeWorker.addEventListener('message', this.handleMessage)
  }

  public setBuildResultHandler(handler: BuildResultHandler): void {
    this.onBuildResult = handler
  }

  public setExportResultHandler(handler: ExportResultHandler): void {
    this.onExportResult = handler
  }

  public setWorkerErrorHandler(handler: WorkerErrorHandler): void {
    this.onWorkerError = handler
  }

  public setRuntimeHooks(hooks: BuildDispatcherRuntimeHooks): void {
    this.runtimeHooks = hooks
  }

  public getLatestBuildRequestSnapshot(
    identity: BuildSupersessionTarget,
  ): LatestBuildRequestSnapshot | null {
    const ledgers = [
      this.routingLedgerByKey.get(this.buildRoutingKey(identity, 'draft_preview')),
      this.routingLedgerByKey.get(this.buildRoutingKey(identity, 'authoritative')),
    ].filter((ledger): ledger is RoutingLedger => ledger !== undefined)
    if (ledgers.length === 0) {
      return null
    }
    const existing = ledgers.reduce((latest, candidate) =>
      candidate.latestRequestedSeq > latest.latestRequestedSeq ? candidate : latest,
    )
    if (existing.latestRequestedSeq === 0) {
      return null
    }
    return {
      projectFileId: identity.projectFileId,
      graphDocumentId: identity.graphDocumentId,
      latestRequestedSeq: existing.latestRequestedSeq,
      latestRequestedBuildRequestId: existing.latestRequestedBuildRequestId,
      latestResolvedSeq: existing.latestResolvedSeq,
    }
  }

  public requestGraphBuild(options: GraphBuildRequestOptions): number {
    const seq = ++this.seqCounter
    this.latestRequestedSeq = seq
    const routingIdentity = options.routingIdentity ?? this.createLegacyRoutingIdentity(seq)
    const executionIntent = {
      ...(options.executionIntent ?? DEFAULT_BUILD_EXECUTION_INTENT),
    } satisfies BuildExecutionIntent
    const ledger = this.getOrCreateRoutingLedger(routingIdentity, executionIntent.geometryTarget)
    ledger.latestRequestedSeq = seq
    ledger.latestRequestedBuildRequestId = routingIdentity.buildRequestId

    const changedParamIds = this.normalizeChangedParamIds(options.changedParamIds ?? [])
    const buildStatsPartKeys = this.normalizeBuildStatsPartKeys(
      options.buildStatsPartKeys ?? options.compiledBuildData.orderedPartKeys,
    )
    ledger.pendingChangedParamIdsBySeq.set(seq, changedParamIds)
    ledger.pendingBuildRequestIdBySeq.set(seq, routingIdentity.buildRequestId)
    this.executionTargetBySeq.set(seq, executionIntent.geometryTarget)
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
      ...(options.changedInputHint === undefined
        ? {}
        : { changedInputHint: options.changedInputHint }),
    }
    this.runtimeHooks.onBuildRequestStarted?.({
      seq,
      routingIdentity,
      executionIntent,
      buildStatsPartKeys,
    })
    this.workerForExecutionTarget(executionIntent.geometryTarget).postMessage(message)
    return seq
  }

  public requestGraphExport(options: GraphExportRequestOptions): number {
    const seq = ++this.seqCounter
    const ledger = this.getOrCreateExportRoutingLedger(options)
    ledger.latestRequestedSeq = seq
    ledger.pendingRequestBySeq.set(seq, {
      buildRequestId: options.buildRequestId,
      requestId: options.requestId,
    })
    this.prunePendingExportRoutingState(ledger)

    const message: ExportWorkerRequest = {
      type: 'export',
      lane: 'export',
      seq,
      projectFileId: options.projectFileId,
      graphDocumentId: options.graphDocumentId,
      buildRequestId: options.buildRequestId,
      schemaVersion: 1,
      requestId: options.requestId,
      format: options.format,
      input: options.input,
    }
    this.runtimeHooks.onExportRequestStarted?.(message)
    this.authoritativeWorker.postMessage(message)
    return seq
  }

  public dispose(): void {
    this.draftWorker.removeEventListener('message', this.handleMessage)
    this.authoritativeWorker.removeEventListener('message', this.handleMessage)
    this.draftWorker.terminate()
    this.authoritativeWorker.terminate()
  }

  public releaseAuthoritativeHandles(handleIds: readonly string[]): void {
    const normalizedHandleIds = [
      ...new Set(
        handleIds.filter(
          (handleId): handleId is string => typeof handleId === 'string' && handleId.length > 0,
        ),
      ),
    ]
    if (normalizedHandleIds.length === 0) {
      return
    }
    this.authoritativeWorker.postMessage({
      type: 'release_authoritative_handles',
      handleIds: normalizedHandleIds,
    })
  }

  private readonly handleMessage = (event: MessageEvent<unknown>): void => {
    if (isExportWorkerResult(event.data)) {
      const ledger = this.getOrCreateExportRoutingLedger(event.data)
      this.prunePendingExportRoutingState(ledger)
      if (this.isExportStale(event.data, ledger)) {
        ledger.pendingRequestBySeq.delete(event.data.seq)
        return
      }
      ledger.pendingRequestBySeq.delete(event.data.seq)
      ledger.latestResolvedSeq = event.data.seq
      this.onExportResult(event.data)
      this.runtimeHooks.onExportResultSettled?.(event.data)
      return
    }

    if (isBuildProgress(event.data)) {
      const executionTarget = this.executionTargetBySeq.get(event.data.seq)
      if (executionTarget === undefined) {
        return
      }
      const ledger = this.getOrCreateRoutingLedger(event.data, executionTarget)
      this.prunePendingRoutingState(ledger)
      if (this.isBuildStale(event.data.seq, event.data.buildRequestId, ledger)) {
        return
      }
      this.runtimeHooks.onBuildProgress?.(event.data)
      return
    }

    if (isBuildResult(event.data)) {
      const executionTarget = event.data.bundle.executionIntent.geometryTarget
      const ledger = this.getOrCreateRoutingLedger(event.data, executionTarget)
      this.prunePendingRoutingState(ledger)
      if (this.isBuildStale(event.data.seq, event.data.buildRequestId, ledger)) {
        ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
        ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
        this.executionTargetBySeq.delete(event.data.seq)
        this.releaseAuthoritativeHandlesFromResult(event.data)
        return
      }

      const acceptedChangedParamIds = this.normalizeChangedParamIds(
        event.data.changedParamIds ??
          ledger.pendingChangedParamIdsBySeq.get(event.data.seq) ??
          [],
      )
      ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
      ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
      this.executionTargetBySeq.delete(event.data.seq)
      ledger.latestResolvedSeq = event.data.seq
      const acceptedResult = {
        ...event.data,
        changedParamIds: acceptedChangedParamIds,
      }
      this.onBuildResult(acceptedResult)
      this.runtimeHooks.onBuildResultSettled?.(acceptedResult)
      return
    }

    if (isBuildSuperseded(event.data)) {
      const executionTarget = this.executionTargetBySeq.get(event.data.seq)
      if (executionTarget === undefined) {
        return
      }
      const ledger = this.getOrCreateRoutingLedger(event.data, executionTarget)
      this.prunePendingRoutingState(ledger)
      if (
        event.data.seq <= ledger.latestResolvedSeq ||
        ledger.pendingBuildRequestIdBySeq.get(event.data.seq) !== event.data.buildRequestId
      ) {
        return
      }
      ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
      ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
      this.executionTargetBySeq.delete(event.data.seq)
      ledger.latestResolvedSeq = event.data.seq
      this.runtimeHooks.onBuildSuperseded?.(event.data)
      return
    }

    if (isWorkerError(event.data)) {
      if (event.data.op === 'export' && this.hasExportRoutingIdentity(event.data)) {
        const ledger = this.getOrCreateExportRoutingLedger(event.data)
        this.prunePendingExportRoutingState(ledger)
        if (this.isExportStale(event.data, ledger)) {
          ledger.pendingRequestBySeq.delete(event.data.seq)
          return
        }
        ledger.pendingRequestBySeq.delete(event.data.seq)
        ledger.latestResolvedSeq = event.data.seq
        this.onWorkerError(event.data)
        this.runtimeHooks.onExportError?.(event.data)
        this.runtimeHooks.onWorkerError?.(event.data)
        return
      }
      if (event.data.op === 'build' && this.hasRoutingIdentity(event.data)) {
        const executionTarget = this.executionTargetBySeq.get(event.data.seq)
        if (executionTarget === undefined) {
          return
        }
        const ledger = this.getOrCreateRoutingLedger(event.data, executionTarget)
        this.prunePendingRoutingState(ledger)
        if (this.isBuildStale(event.data.seq, event.data.buildRequestId, ledger)) {
          ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
          ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
          this.executionTargetBySeq.delete(event.data.seq)
          return
        }
        ledger.pendingChangedParamIdsBySeq.delete(event.data.seq)
        ledger.pendingBuildRequestIdBySeq.delete(event.data.seq)
        this.executionTargetBySeq.delete(event.data.seq)
        ledger.latestResolvedSeq = event.data.seq
      } else if (this.isGlobalStale(event.data.seq)) {
        return
      }
      this.latestResolvedSeq = event.data.seq
      this.onWorkerError(event.data)
      this.runtimeHooks.onWorkerError?.(event.data)
    }
  }

  private releaseAuthoritativeHandlesFromResult(result: BuildResult): void {
    const authoritativeHandleId = getGeometryResultAuthoritativeHandleId(
      result.authoritativeGeometryResult,
    )
    if (authoritativeHandleId === null) {
      return
    }
    this.releaseAuthoritativeHandles([authoritativeHandleId])
  }

  private createWorker(): BuildDispatcherWorker {
    if (typeof Worker === 'undefined') {
      return {
        addEventListener: () => {},
        removeEventListener: () => {},
        postMessage: () => {},
        terminate: () => {},
      }
    }
    return new Worker(new URL('../worker/worker.ts', import.meta.url), {
      type: 'module',
    })
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
      if (seq <= ledger.latestResolvedSeq) {
        ledger.pendingChangedParamIdsBySeq.delete(seq)
      }
    }
    for (const seq of ledger.pendingBuildRequestIdBySeq.keys()) {
      if (seq <= ledger.latestResolvedSeq) {
        ledger.pendingBuildRequestIdBySeq.delete(seq)
      }
    }
  }

  private prunePendingExportRoutingState(ledger: ExportRoutingLedger): void {
    for (const seq of ledger.pendingRequestBySeq.keys()) {
      if (seq <= ledger.latestResolvedSeq) {
        ledger.pendingRequestBySeq.delete(seq)
      }
    }
  }

  private getOrCreateRoutingLedger(
    identity: Pick<BuildRoutingIdentity, 'projectFileId' | 'graphDocumentId'>,
    executionTarget: GeometryExecutionTarget,
  ): RoutingLedger {
    const key = this.buildRoutingKey(identity, executionTarget)
    const existing = this.routingLedgerByKey.get(key)
    if (existing !== undefined) {
      return existing
    }
    const created: RoutingLedger = {
      latestRequestedSeq: 0,
      latestRequestedBuildRequestId: null,
      latestResolvedSeq: 0,
      pendingChangedParamIdsBySeq: new Map<number, string[]>(),
      pendingBuildRequestIdBySeq: new Map<number, string>(),
    }
    this.routingLedgerByKey.set(key, created)
    return created
  }

  private getOrCreateExportRoutingLedger(
    identity: Pick<BuildRoutingIdentity, 'projectFileId' | 'graphDocumentId'>,
  ): ExportRoutingLedger {
    const key = this.exportRoutingKey(identity)
    const existing = this.exportRoutingLedgerByKey.get(key)
    if (existing !== undefined) {
      return existing
    }
    const created: ExportRoutingLedger = {
      latestRequestedSeq: 0,
      latestResolvedSeq: 0,
      pendingRequestBySeq: new Map(),
    }
    this.exportRoutingLedgerByKey.set(key, created)
    return created
  }

  private buildRoutingKey(
    identity: Pick<BuildRoutingIdentity, 'projectFileId' | 'graphDocumentId'>,
    executionTarget: GeometryExecutionTarget,
  ): string {
    return `${identity.projectFileId}::${identity.graphDocumentId}::${executionTarget}`
  }

  private exportRoutingKey(
    identity: Pick<BuildRoutingIdentity, 'projectFileId' | 'graphDocumentId'>,
  ): string {
    return `${identity.projectFileId}::${identity.graphDocumentId}::export`
  }

  private isExportStale(
    message: Pick<ExportWorkerResult | WorkerError, 'seq' | 'buildRequestId' | 'requestId'>,
    ledger: ExportRoutingLedger,
  ): boolean {
    if (message.seq < ledger.latestRequestedSeq) {
      return true
    }
    if (message.seq <= ledger.latestResolvedSeq) {
      return true
    }
    const expected = ledger.pendingRequestBySeq.get(message.seq)
    if (expected === undefined) {
      return true
    }
    if (message.buildRequestId !== expected.buildRequestId) {
      return true
    }
    if (message.requestId !== expected.requestId) {
      return true
    }
    return false
  }

  private workerForExecutionTarget(
    executionTarget: GeometryExecutionTarget,
  ): BuildDispatcherWorker {
    return executionTarget === 'authoritative' ? this.authoritativeWorker : this.draftWorker
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

  private hasExportRoutingIdentity(
    error: WorkerError,
  ): error is WorkerError &
    Required<Pick<BuildRoutingIdentity, 'projectFileId' | 'graphDocumentId' | 'buildRequestId'>> & {
      requestId: string
    } {
    return this.hasRoutingIdentity(error) && typeof error.requestId === 'string'
  }
}

export const buildDispatcher = new BuildDispatcher()
