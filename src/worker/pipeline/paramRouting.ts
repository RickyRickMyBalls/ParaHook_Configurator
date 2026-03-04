import { partKeyToString, type PartKey } from '../../shared/buildTypes'
import { deriveBuildPartKeys } from './partsSpec'

type BuildInstances = {
  heelKickInstances?: number[]
  toeHookInstances?: number[]
}

const asAllKeys = (instances: BuildInstances): string[] =>
  deriveBuildPartKeys(instances).map((partKey) => partKeyToString(partKey))

const parseTargetPartKey = (prefix: string): PartKey | null => {
  if (prefix === 'bp') {
    return { id: 'baseplate', instance: null }
  }

  const hkMatch = /^hk(\d+)$/.exec(prefix)
  if (hkMatch !== null) {
    return { id: 'heelKick', instance: Number(hkMatch[1]) }
  }

  const thMatch = /^th(\d+)$/.exec(prefix)
  if (thMatch !== null) {
    return { id: 'toeHook', instance: Number(thMatch[1]) }
  }

  return null
}

export const computeAffectedPartKeys = (
  changedParamIds: string[] | undefined,
  instances: BuildInstances,
): string[] => {
  const orderedKeys = asAllKeys(instances)
  if (changedParamIds === undefined || changedParamIds.length === 0) {
    return orderedKeys
  }

  const orderedKeySet = new Set(orderedKeys)
  const affected = new Set<string>()
  for (const paramId of changedParamIds) {
    const separator = paramId.indexOf('_')
    if (separator <= 0) {
      return orderedKeys
    }

    const prefix = paramId.slice(0, separator)
    const targetPartKey = parseTargetPartKey(prefix)
    if (targetPartKey === null) {
      return orderedKeys
    }

    const targetKey = partKeyToString(targetPartKey)
    if (!orderedKeySet.has(targetKey)) {
      continue
    }
    affected.add(targetKey)
  }

  return orderedKeys.filter((partKey) => affected.has(partKey))
}
