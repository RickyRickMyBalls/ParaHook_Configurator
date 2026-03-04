import { z } from 'zod'
import { SCHEMA_VERSION } from '../shared/constants'
import { productSchema } from '../shared/productSchema'

const meshPayloadSchema = z.object({
  vertices: z.array(z.number()),
  indices: z.array(z.number()),
})

const partArtifactSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  order: z.number().int().nonnegative(),
})

export const buildRequestSchema = z.object({
  schemaVersion: z.number().int().default(SCHEMA_VERSION),
  product: productSchema,
  profile: z.record(z.string(), z.unknown()),
  jakeMode: z.boolean(),
})

export const exportRequestSchema = z.object({
  schemaVersion: z.number().int().default(SCHEMA_VERSION),
  requestId: z.string().min(1),
  format: z.enum(['stl', 'step']),
  buildRequestId: z.string().min(1),
})

const buildRequestMessageSchema = z.object({
  type: z.literal('build/request'),
  requestId: z.string().min(1),
  payload: buildRequestSchema,
})

const exportRequestMessageSchema = z.object({
  type: z.literal('export/request'),
  requestId: z.string().min(1),
  payload: exportRequestSchema,
})

const buildResultMessageSchema = z.object({
  type: z.literal('build/result'),
  requestId: z.string().min(1),
  payload: z.object({
    requestId: z.string().min(1),
    product: productSchema,
    mesh: meshPayloadSchema,
    parts: z.array(partArtifactSchema),
  }),
})

const exportResultMessageSchema = z.object({
  type: z.literal('export/result'),
  requestId: z.string().min(1),
  payload: z.object({
    requestId: z.string().min(1),
    format: z.enum(['stl', 'step']),
    filename: z.string().min(1),
    dataBase64: z.string(),
  }),
})

const buildDroppedMessageSchema = z.object({
  type: z.literal('build/dropped'),
  requestId: z.string().min(1),
})

const workerReadyMessageSchema = z.object({
  type: z.literal('worker/ready'),
})

const workerErrorMessageSchema = z.object({
  type: z.literal('worker/error'),
  requestId: z.string().nullable(),
  error: z.string().min(1),
})

export const workerInboundMessageSchema = z.discriminatedUnion('type', [
  buildRequestMessageSchema,
  exportRequestMessageSchema,
])

export const workerOutboundMessageSchema = z.discriminatedUnion('type', [
  buildResultMessageSchema,
  exportResultMessageSchema,
  buildDroppedMessageSchema,
  workerReadyMessageSchema,
  workerErrorMessageSchema,
])

export type BuildRequestMessage = z.infer<typeof buildRequestMessageSchema>
export type ExportRequestMessage = z.infer<typeof exportRequestMessageSchema>
export type WorkerInboundMessage = z.infer<typeof workerInboundMessageSchema>
export type WorkerOutboundMessage = z.infer<typeof workerOutboundMessageSchema>

export const parseWorkerInboundMessage = (message: unknown): WorkerInboundMessage =>
  workerInboundMessageSchema.parse(message)

export const parseWorkerOutboundMessage = (
  message: unknown,
): WorkerOutboundMessage => workerOutboundMessageSchema.parse(message)
