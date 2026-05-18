import type { ExportWorkerResult } from '../shared/exportTypes'

const toBytes = (base64: string): Uint8Array => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export const downloadExportResult = (result: ExportWorkerResult): void => {
  if (typeof document === 'undefined' || typeof URL === 'undefined') {
    return
  }

  const mimeType = result.format === 'step' ? 'model/step' : 'application/octet-stream'
  const bytes = toBytes(result.dataBase64)
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
  const blob = new Blob([buffer], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = result.filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
