let fallbackCounter = 0

export const newId = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  fallbackCounter += 1
  return `${prefix}-fallback-${fallbackCounter}`
}

export const makeRowId = (): string => newId('row')

export const makeComponentId = (): string => newId('comp')
