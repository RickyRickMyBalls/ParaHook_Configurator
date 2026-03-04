import type {
  AssembleRequest,
  AssembleResult,
  BuildProgress,
  BuildRequest,
  BuildResult,
  WorkerError,
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
let currentSeq = 0
let isWarm = false

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number')

const isBuildRequest = (value: unknown): value is BuildRequest => {
  if (!isRecord(value)) {
    return false
  }
  if (value.type !== 'build' || typeof value.seq !== 'number') {
    return false
  }
  if (!isRecord(value.payload)) {
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

  if (event.data.seq < currentSeq) {
    return
  }

  const requestSeq = event.data.seq
  currentSeq = requestSeq

  const emitProgress: ProgressEmitter = (message) => {
    if (requestSeq !== currentSeq) {
      return
    }
    workerScope.postMessage(message)
  }

  if (event.data.type === 'build') {
    try {
      const result = await buildPipeline(event.data, emitProgress)
      if (requestSeq !== currentSeq) {
        return
      }
      workerScope.postMessage(result)
    } catch (error: unknown) {
      if (requestSeq !== currentSeq) {
        return
      }
      const message = error instanceof Error ? error.message : 'Build failed.'
      const workerError: WorkerError = {
        type: 'worker_error',
        seq: requestSeq,
        op: 'build',
        message,
      }
      workerScope.postMessage(workerError)
    }
    return
  }

  try {
    const result = await assemblePipeline(event.data, emitProgress)
    if (requestSeq !== currentSeq) {
      return
    }
    workerScope.postMessage(result)
  } catch (error: unknown) {
    if (requestSeq !== currentSeq) {
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
