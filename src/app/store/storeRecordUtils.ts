export const deleteRecordKey = <T extends Record<string, unknown>>(record: T, key: string): T => {
  if (!(key in record)) {
    return record
  }
  const next = { ...record }
  delete next[key]
  return next
}
