import { parsePartKeyString } from './buildTypes'

export const LEGACY_BUILD_STATS_PART_ORDER = [
  'baseplate',
  'heelKick#1',
  'toeHook#1',
  'assembled',
] as const

export const ASSEMBLED_BUILD_STATS_KEY = 'assembled' as const

const SPAGHETTI_SOURCE_PART_BASE_ORDER = [
  'baseplate',
  'cube',
  'cubeProof',
  'toeHook',
  'heelKick',
] as const

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null

const SPAGHETTI_SOURCE_PART_BASE_RANK = new Map<string, number>(
  SPAGHETTI_SOURCE_PART_BASE_ORDER.map((partKey, index) => [partKey, index]),
)

export const compareSpaghettiSourcePartKeys = (a: string, b: string): number => {
  const partA = parsePartKeyString(a)
  const partB = parsePartKeyString(b)
  const rankA = SPAGHETTI_SOURCE_PART_BASE_RANK.get(partA.id)
  const rankB = SPAGHETTI_SOURCE_PART_BASE_RANK.get(partB.id)

  if (rankA !== undefined || rankB !== undefined) {
    if (rankA === undefined) return 1
    if (rankB === undefined) return -1
    if (rankA !== rankB) {
      return rankA - rankB
    }
  }

  if (partA.instance !== partB.instance) {
    if (partA.instance === null) return -1
    if (partB.instance === null) return 1
    return partA.instance - partB.instance
  }

  return a.localeCompare(b)
}

export const orderSpaghettiSourcePartKeys = (partKeys: readonly string[]): string[] => {
  const unique = [...new Set(partKeys.filter((partKey) => partKey.length > 0))]
  return unique.sort(compareSpaghettiSourcePartKeys)
}

export const withAssembledBuildStatsKey = (partKeys: readonly string[]): string[] => {
  const ordered = partKeys.filter((partKey) => partKey !== ASSEMBLED_BUILD_STATS_KEY)
  return [...ordered, ASSEMBLED_BUILD_STATS_KEY]
}

export const deriveSpaghettiSourcePartKeysFromProfilePatch = (
  profilePatch: Record<string, unknown>,
): string[] => {
  const partKeys: string[] = []
  if (
    Object.prototype.hasOwnProperty.call(profilePatch, 'sp_baseplate_anchorSpline2') ||
    Object.prototype.hasOwnProperty.call(profilePatch, 'sp_baseplate_offsetSpline2')
  ) {
    partKeys.push('baseplate')
  }
  if (Object.prototype.hasOwnProperty.call(profilePatch, 'sp_toeHook1_anchorSpline2')) {
    partKeys.push('toeHook#1')
  }
  if (Object.prototype.hasOwnProperty.call(profilePatch, 'sp_heelKick1_anchorSpline2')) {
    partKeys.push('heelKick#1')
  }

  const featureStackPayload = asRecord(profilePatch.sp_featureStackIR)
  const featureStackParts = asRecord(featureStackPayload?.parts)
  if (featureStackParts !== null) {
    partKeys.push(...Object.keys(featureStackParts))
  }

  return orderSpaghettiSourcePartKeys(partKeys)
}
