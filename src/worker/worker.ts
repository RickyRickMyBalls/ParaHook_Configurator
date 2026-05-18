import type {
  BuildSuperseded,
  BuildExecutionIntent,
  BuildRequest,
  BuildProgress,
  BuildResult,
  WorkerError,
} from '../shared/buildTypes'
import {
  isExportWorkerRequest,
  type ExportWorkerResult,
} from '../shared/exportTypes'
import {
  isBuildChangedInputHint,
  isBuildIdentity,
  isBuildInvalidation,
  isCompiledBuildData,
} from '../shared/buildTypes'
import {
  buildPipeline,
  isBuildSupersededError,
  type ProgressEmitter,
} from './pipeline/buildPipeline'
import { exportService } from './pipeline/exportService'
import { releaseAuthoritativeShapeSets } from './authoritativeGeometryStore'

interface WorkerScope {
  postMessage: (
    message: BuildResult | WorkerError | BuildProgress | BuildSuperseded | ExportWorkerResult,
  ) => void
  addEventListener: (
    type: 'message',
    listener: (event: MessageEvent<unknown>) => void,
  ) => void
}

const workerScope = self as unknown as WorkerScope
let isWarm = false
const latestBuildRequestIdByRoutingKey = new Map<string, string>()

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isBuildExecutionIntent = (value: unknown): value is BuildExecutionIntent => {
  if (!isRecord(value)) {
    return false
  }
  const buildModeValid = value.buildMode === 'preview' || value.buildMode === 'final'
  const qualityValid = value.quality === 'draft' || value.quality === 'full'
  const updatePolicyValid =
    value.updatePolicy === 'auto' ||
    value.updatePolicy === 'defer_until_release' ||
    value.updatePolicy === 'manual'
  const draftPolicyValid =
    value.draftPolicy === 'live' ||
    value.draftPolicy === 'release' ||
    value.draftPolicy === 'settle' ||
    value.draftPolicy === 'suppressed'
  const authoritativePolicyValid =
    value.authoritativePolicy === 'live' ||
    value.authoritativePolicy === 'release' ||
    value.authoritativePolicy === 'settle' ||
    value.authoritativePolicy === 'explicit'
  const outputIntentValid =
    value.outputIntent === 'transient_preview' ||
    value.outputIntent === 'accepted_final'
  const geometryTargetValid =
    value.geometryTarget === 'draft_preview' || value.geometryTarget === 'authoritative'
  return (
    buildModeValid &&
    qualityValid &&
    updatePolicyValid &&
    draftPolicyValid &&
    authoritativePolicyValid &&
    outputIntentValid &&
    geometryTargetValid
  )
}

const isReleaseAuthoritativeHandlesRequest = (
  value: unknown,
): value is { type: 'release_authoritative_handles'; handleIds: string[] } =>
  isRecord(value) && value.type === 'release_authoritative_handles' && isStringArray(value.handleIds)

const isBuildRequest = (value: unknown): value is BuildRequest => {
  if (!isRecord(value)) {
    return false
  }
  if (
    value.type !== 'build' ||
    value.lane !== 'build' ||
    typeof value.seq !== 'number' ||
    typeof value.projectFileId !== 'string' ||
    typeof value.graphDocumentId !== 'string' ||
    typeof value.buildRequestId !== 'string'
  ) {
    return false
  }
  if (!isBuildExecutionIntent(value.executionIntent)) {
    return false
  }
  if (value.changedParamIds !== undefined && !isStringArray(value.changedParamIds)) {
    return false
  }
  if (value.changedInputHint !== undefined && !isBuildChangedInputHint(value.changedInputHint)) {
    return false
  }
  if (!isBuildIdentity(value.buildIdentity)) {
    return false
  }
  if (!isBuildInvalidation(value.invalidation)) {
    return false
  }
  if (!isCompiledBuildData(value.compiledBuildData)) {
    return false
  }
  return true
}

const warmWorker = (): void => {
  if (!isWarm) {
    isWarm = true
  }
}

const toBuildRoutingKey = (request: Pick<BuildRequest, 'projectFileId' | 'graphDocumentId'>): string =>
  `${request.projectFileId}::${request.graphDocumentId}`

warmWorker()

workerScope.addEventListener('message', async (event: MessageEvent<unknown>) => {
  warmWorker()

  if (isReleaseAuthoritativeHandlesRequest(event.data)) {
    releaseAuthoritativeShapeSets(event.data.handleIds)
    return
  }

  const message = event.data
  if (isExportWorkerRequest(message)) {
    try {
      const exportResult = await exportService(message)
      workerScope.postMessage({
        type: 'export_result',
        lane: 'export',
        seq: message.seq,
        projectFileId: message.projectFileId,
        graphDocumentId: message.graphDocumentId,
        buildRequestId: message.buildRequestId,
        ...exportResult,
      })
    } catch (error: unknown) {
      const messageText = error instanceof Error ? error.message : 'Export failed.'
      const workerError: WorkerError = {
        type: 'worker_error',
        seq: message.seq,
        op: 'export',
        lane: 'export',
        message: messageText,
        projectFileId: message.projectFileId,
        graphDocumentId: message.graphDocumentId,
        buildRequestId: message.buildRequestId,
      }
      workerScope.postMessage(workerError)
    }
    return
  }

  if (!isBuildRequest(message)) {
    return
  }

  const request = message
  const routingKey = toBuildRoutingKey(request)
  latestBuildRequestIdByRoutingKey.set(routingKey, request.buildRequestId)
  const emitProgress: ProgressEmitter = (message) => {
    workerScope.postMessage(message)
  }
  try {
    const result = await buildPipeline(request, emitProgress, {
      isSuperseded: () =>
        latestBuildRequestIdByRoutingKey.get(routingKey) !== request.buildRequestId,
    })
    workerScope.postMessage(result)
  } catch (error: unknown) {
    if (isBuildSupersededError(error)) {
      workerScope.postMessage({
        type: 'build_superseded',
        lane: 'build',
        seq: request.seq,
        projectFileId: request.projectFileId,
        graphDocumentId: request.graphDocumentId,
        buildRequestId: request.buildRequestId,
      })
      return
    }
    const message = error instanceof Error ? error.message : 'Build failed.'
    const workerError: WorkerError = {
      type: 'worker_error',
      seq: request.seq,
      op: 'build',
      lane: 'build',
      message,
      projectFileId: request.projectFileId,
      graphDocumentId: request.graphDocumentId,
      buildRequestId: request.buildRequestId,
    }
    workerScope.postMessage(workerError)
  }
})
