import {
  type GeometryResultAuthoritativeHandle,
  type GeometryResultBundle,
  type GeometryResultRequestIdentity,
  isGeometryResultAuthoritativeHandle,
  isGeometryResultRequestIdentity,
} from './geometryResult'

const AUTHORITATIVE_EXPORT_INPUT_SCHEMA_VERSION = 1 as const

export type ExportFormat = 'stl' | 'step'

export type AuthoritativeExportInput = {
  schemaVersion: typeof AUTHORITATIVE_EXPORT_INPUT_SCHEMA_VERSION
  request: GeometryResultRequestIdentity
  authoritativeHandle: GeometryResultAuthoritativeHandle
}

export type ExportPreparationPendingReason =
  | 'requested-authoritative-build'
  | 'awaiting-authoritative-build'

export type ExportPreparationBlockedReason =
  | 'compile-invalid'
  | 'missing-build-inputs'
  | 'missing-preview-preparation'
  | 'no-build-targets'
  | 'authoritative-unavailable'

export type ExportPreparationResult =
  | {
      status: 'ready'
      graphDocumentId: string
      input: AuthoritativeExportInput
    }
  | {
      status: 'pending'
      graphDocumentId: string
      pendingReason: ExportPreparationPendingReason
      buildRequestId?: string
      buildSeq?: number
    }
  | {
      status: 'blocked'
      graphDocumentId: string
      blockedReason: ExportPreparationBlockedReason
      message: string
    }

export interface ExportRequest {
  schemaVersion: number
  requestId: string
  format: ExportFormat
  input: AuthoritativeExportInput
}

export interface ExportResult {
  requestId: string
  format: ExportFormat
  filename: string
  dataBase64: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isAuthoritativeExportInput = (
  value: unknown,
): value is AuthoritativeExportInput =>
  isRecord(value) &&
  value.schemaVersion === AUTHORITATIVE_EXPORT_INPUT_SCHEMA_VERSION &&
  isGeometryResultRequestIdentity(value.request) &&
  isGeometryResultAuthoritativeHandle(value.authoritativeHandle)

export const createAuthoritativeExportInput = (options: {
  request: GeometryResultRequestIdentity
  authoritativeHandle: GeometryResultAuthoritativeHandle
}): AuthoritativeExportInput => ({
  schemaVersion: AUTHORITATIVE_EXPORT_INPUT_SCHEMA_VERSION,
  request: {
    graphDocumentId: options.request.graphDocumentId,
    buildRequestId: options.request.buildRequestId,
    partKeys: [...options.request.partKeys],
  },
  authoritativeHandle: {
    resourceType: options.authoritativeHandle.resourceType,
    handleId: options.authoritativeHandle.handleId,
  },
})

export const deriveAuthoritativeExportInput = (
  bundle: GeometryResultBundle | null | undefined,
): AuthoritativeExportInput | null => {
  if (bundle?.resultClass !== 'authoritative' || bundle.authoritativeHandle === null) {
    return null
  }
  return createAuthoritativeExportInput({
    request: bundle.request,
    authoritativeHandle: bundle.authoritativeHandle,
  })
}
