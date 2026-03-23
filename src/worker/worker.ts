import type {
  AssembleRequest,
  AssembleResult,
  BuildExecutionIntent,
  BuildProgress,
  BuildRequest,
  BuildResult,
  WorkerError,
} from '../shared/buildTypes'
import {
  isBuildIdentity,
  isBuildInvalidation,
  isCompiledBuildData,
} from '../shared/buildTypes'
import {
  assemblePipeline,
  buildPipeline,
  type ProgressEmitter,
} from './pipeline/buildPipeline'

interface WorkerScope {
  postMessage: (message: BuildResult | AssembleResult | WorkerError | BuildProgress) => void
  addEventListener: (
    type: 'message',
    listener: (event: MessageEvent<unknown>) => void,
  ) => void
}

const workerScope = self as unknown as WorkerScope
let currentAssembleSeq = 0
let isWarm = false

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number')

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
  if (!isRecord(value.payload)) {
    return false
  }
  if (!isBuildExecutionIntent(value.executionIntent)) {
    return false
  }
  if (value.changedParamIds !== undefined && !isStringArray(value.changedParamIds)) {
    return false
  }
  if (value.heelKickInstances !== undefined && !isNumberArray(value.heelKickInstances)) {
    return false
  }
  if (value.toeHookInstances !== undefined && !isNumberArray(value.toeHookInstances)) {
    return false
  }
  if (value.buildIdentity !== undefined && !isBuildIdentity(value.buildIdentity)) {
    return false
  }
  if (value.invalidation !== undefined && !isBuildInvalidation(value.invalidation)) {
    return false
  }
  if (value.compiledBuildData !== undefined && !isCompiledBuildData(value.compiledBuildData)) {
    return false
  }
  return (
    typeof value.payload.width === 'number' &&
    typeof value.payload.length === 'number' &&
    typeof value.payload.height === 'number'
  )
}

const isAssembleRequest = (value: unknown): value is AssembleRequest => {
  if (!isRecord(value)) {
    return false
  }
  if (value.type !== 'assemble' || typeof value.seq !== 'number') {
    return false
  }
  if (!isRecord(value.payload)) {
    return false
  }
  return (
    typeof value.payload.width === 'number' &&
    typeof value.payload.length === 'number' &&
    typeof value.payload.height === 'number'
  )
}

const warmWorker = (): void => {
  if (!isWarm) {
    isWarm = true
  }
}

warmWorker()

workerScope.addEventListener('message', async (event: MessageEvent<unknown>) => {
  warmWorker()

  if (!isBuildRequest(event.data) && !isAssembleRequest(event.data)) {
    return
  }

  if (event.data.type === 'build') {
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
    return
  }

  if (event.data.seq < currentAssembleSeq) {
    return
  }

  const requestSeq = event.data.seq
  currentAssembleSeq = requestSeq

  const emitProgress: ProgressEmitter = (message) => {
    if (requestSeq !== currentAssembleSeq) {
      return
    }
    workerScope.postMessage(message)
  }

  try {
    const result = await assemblePipeline(event.data, emitProgress)
    if (requestSeq !== currentAssembleSeq) {
      return
    }
    workerScope.postMessage(result)
  } catch (error: unknown) {
    if (requestSeq !== currentAssembleSeq) {
      return
    }
    const message =
      error instanceof Error ? error.message : 'Failed to assemble preview.'
    const workerError: WorkerError = {
      type: 'worker_error',
      seq: requestSeq,
      op: 'assemble',
      message,
    }
    workerScope.postMessage(workerError)
  }
})
