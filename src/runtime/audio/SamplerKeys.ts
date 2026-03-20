export const hashSamplerKey = (input: string): number => {
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export type GeneratedToneProfile = {
  primaryHz: number
  accentHz: number
  modulationHz: number
}

export const buildGeneratedToneProfile = (key: string): GeneratedToneProfile => {
  const hash = hashSamplerKey(key)
  return {
    primaryHz: 110 + (hash % 180),
    accentHz: 220 + ((hash >>> 8) % 240),
    modulationHz: 0.5 + ((hash >>> 16) % 20) / 10,
  }
}
