import type { PartSlots } from '../schema/spaghettiTypes'

export type PartSlotsNormalizationWarning = {
  code: 'partSlots_missing_normalized' | 'partSlots_invalid_shape_repaired'
  message: string
  nodeId: string
}

const PART_SLOT_KEYS = ['drivers', 'inputs', 'featureStack', 'outputs'] as const

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const cloneDefaultPartSlots = (): PartSlots => ({
  drivers: true,
  inputs: true,
  featureStack: true,
  outputs: true,
})

export const DEFAULT_PART_SLOTS: PartSlots = cloneDefaultPartSlots()

export const isPartNodeType = (nodeType: string): boolean => nodeType.startsWith('Part/')

export const hasValidPartSlots = (raw: unknown): raw is PartSlots => {
  if (!isRecord(raw)) {
    return false
  }
  const keys = Object.keys(raw).sort((a, b) => a.localeCompare(b))
  const expectedKeys = [...PART_SLOT_KEYS].sort((a, b) => a.localeCompare(b))
  if (keys.length !== expectedKeys.length) {
    return false
  }
  for (let index = 0; index < expectedKeys.length; index += 1) {
    if (keys[index] !== expectedKeys[index]) {
      return false
    }
  }
  return PART_SLOT_KEYS.every((key) => raw[key] === true)
}

export const normalizePartSlots = (
  raw: unknown,
  nodeId: string,
): {
  partSlots: PartSlots
  warnings: PartSlotsNormalizationWarning[]
  repaired: boolean
} => {
  if (raw === undefined) {
    return {
      partSlots: cloneDefaultPartSlots(),
      warnings: [
        {
          code: 'partSlots_missing_normalized',
          message: `Part node "${nodeId}" is missing partSlots; normalized to default container contract.`,
          nodeId,
        },
      ],
      repaired: true,
    }
  }

  if (hasValidPartSlots(raw)) {
    return {
      partSlots: raw,
      warnings: [],
      repaired: false,
    }
  }

  return {
    partSlots: cloneDefaultPartSlots(),
    warnings: [
      {
        code: 'partSlots_invalid_shape_repaired',
        message: `Part node "${nodeId}" has invalid partSlots; repaired to default container contract.`,
        nodeId,
      },
    ],
    repaired: true,
  }
}

