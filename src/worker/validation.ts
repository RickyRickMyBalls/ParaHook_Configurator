import {
  parseWorkerInboundMessage,
  type WorkerInboundMessage,
} from '../app/protocol'

export const validateWorkerMessage = (message: unknown): WorkerInboundMessage =>
  parseWorkerInboundMessage(message)
