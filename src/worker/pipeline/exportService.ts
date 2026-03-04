import type { ExportRequest, ExportResult } from '../../shared/exportTypes'

const toBase64 = (value: string): string => btoa(value)

export const exportService = async (
  request: ExportRequest,
): Promise<ExportResult> => {
  const descriptor = `${request.schemaVersion}:${request.format}:${request.buildRequestId}`
  return {
    requestId: request.requestId,
    format: request.format,
    filename: `parahook-${request.buildRequestId}.${request.format}`,
    dataBase64: toBase64(descriptor),
  }
}
