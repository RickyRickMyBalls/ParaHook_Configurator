import type {
  BuildExecutionIntent,
  BuildRequest,
  BuildProgress,
  BuildResult,
  WorkerError,
} from '../shared/buildTypes'
import {
  isBuildIdentity,
  isBuildInvalidation,
  isCompiledBuildData,
} from '../shared/buildTypes'
import {
  buildPipeline,
  type ProgressEmitter,
} from './pipeline/buildPipeline'

interface WorkerScope {
  postMessage: (message: BuildResult | WorkerError | BuildProgress) => void
  addEventListener: (
    type: 'message',
    listener: (event: MessageEvent<unknown>) => void,
  ) => void
}

const workerScope = self as unknown as WorkerScope
let isWarm = false

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
  const outputIntentValid =
    value.outputIntent === 'transient_preview' ||
    value.outputIntent === 'accepted_final'
  return buildModeValid && qualityValid && updatePolicyValid && outputIntentValid
}

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

warmWorker()

workerScope.addEventListener('message', async (event: MessageEvent<unknown>) => {
  warmWorker()

  if (!isBuildRequest(event.data)) {
    return
  }

  const emitProgress: ProgressEmitter = (message) => {
    workerScope.postMessage(message)
  }
  try {
    const result = await buildPipeline(event.data, emitProgress)
    workerScope.postMessage(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Build failed.'
    const workerError: WorkerError = {
      type: 'worker_error',
      seq: event.data.seq,
      op: 'build',
      lane: 'build',
      message,
      projectFileId: event.data.projectFileId,
      graphDocumentId: event.data.graphDocumentId,
      buildRequestId: event.data.buildRequestId,
    }
    workerScope.postMessage(workerError)
  }
})
