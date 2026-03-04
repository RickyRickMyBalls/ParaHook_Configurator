export type ExportFormat = 'stl' | 'step'

export interface ExportRequest {
  schemaVersion: number
  requestId: string
  format: ExportFormat
  buildRequestId: string
}

export interface ExportResult {
  requestId: string
  format: ExportFormat
  filename: string
  dataBase64: string
}
