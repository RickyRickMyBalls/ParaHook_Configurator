import {
  normalizeInstances,
  partKeyToString,
  type BoxParams,
  type PartArtifact,
  type PartId,
  type PartKey,
} from '../../shared/buildTypes'

type BuildInstances = {
  heelKickInstances?: number[]
  toeHookInstances?: number[]
}

const PART_LABELS: Record<PartId, string> = {
  baseplate: 'Baseplate',
  heelKick: 'Heel Kick',
  toeHook: 'Toe Hook',
  assembled: 'Assembled',
}

const createPart = (partKey: PartKey, params: BoxParams): PartArtifact => ({
  id: partKey.id,
  label: PART_LABELS[partKey.id],
  kind: 'box',
  params,
  partKeyStr: partKeyToString(partKey),
  partKey,
})

export const deriveBuildPartKeys = (instances: BuildInstances): PartKey[] => {
  const heelKickInstances = normalizeInstances(instances.heelKickInstances)
  const toeHookInstances = normalizeInstances(instances.toeHookInstances)
  const keys: PartKey[] = [{ id: 'baseplate', instance: null }]

  for (const instance of heelKickInstances) {
    keys.push({ id: 'heelKick', instance })
  }
  for (const instance of toeHookInstances) {
    keys.push({ id: 'toeHook', instance })
  }

  keys.push({ id: 'assembled', instance: null })
  return keys
}

export const deriveBuildPartKeyStrings = (instances: BuildInstances): string[] =>
  deriveBuildPartKeys(instances).map((partKey) => partKeyToString(partKey))

export const deriveLegacyParts = (
  payload: BoxParams,
  instances: BuildInstances = {},
): PartArtifact[] =>
  deriveBuildPartKeys(instances).map((partKey) => {
    if (partKey.id === 'baseplate') {
      return createPart(partKey, {
        length: payload.length,
        width: payload.width,
        height: payload.height * 0.25,
      })
    }
    if (partKey.id === 'heelKick') {
      return createPart(partKey, {
        length: payload.length * 0.35,
        width: payload.width * 0.9,
        height: payload.height * 0.6,
      })
    }
    if (partKey.id === 'toeHook') {
      return createPart(partKey, {
        length: payload.length * 0.35,
        width: payload.width * 0.9,
        height: payload.height * 0.6,
      })
    }
    return createPart(partKey, {
      length: payload.length,
      width: payload.width,
      height: payload.height,
    })
  })
