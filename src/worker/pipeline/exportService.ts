import type { ExportRequest, ExportResult } from '../../shared/exportTypes'

const toBase64 = (value: string): string => btoa(value)

export const exportService = async (
  request: ExportRequest,
): Promise<ExportResult> => {
  const buildRequestId = request.input.request.buildRequestId
  const descriptor = [
    request.schemaVersion,
    request.format,
    request.input.schemaVersion,
    request.input.request.graphDocumentId,
    buildRequestId,
    request.input.authoritativeHandle.handleId,
  ].join(':')
  return {
    requestId: request.requestId,
    format: request.format,
    filename: `parahook-${buildRequestId}.${request.format}`,
    dataBase64: toBase64(descriptor),
  }
}
