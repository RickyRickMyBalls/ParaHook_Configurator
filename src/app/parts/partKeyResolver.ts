import { partKeyToString, type PartArtifact } from '../../shared/buildTypes'

type InstancePartId = 'heelKick' | 'toeHook'

const INSTANCE_PART_KEY_PATTERN = /^(heelKick|toeHook)#([1-9]\d*)$/

const fallbackPartIdToPartKeyStr = (id: PartArtifact['id']): string => {
  if (id === 'heelKick') {
    return 'heelKick#1'
  }
  if (id === 'toeHook') {
    return 'toeHook#1'
  }
  return id
}

export const artifactToPartKeyStr = (artifact: PartArtifact): string => {
  if (typeof artifact.partKeyStr === 'string' && artifact.partKeyStr.length > 0) {
    return artifact.partKeyStr
  }
  if (artifact.partKey !== undefined) {
    return partKeyToString(artifact.partKey)
  }
  return fallbackPartIdToPartKeyStr(artifact.id)
}

export const parseInstancePartKey = (
  partKeyStr: string,
): { id: InstancePartId; instance: number } | null => {
  const match = INSTANCE_PART_KEY_PATTERN.exec(partKeyStr)
  if (match === null) {
    return null
  }
  return {
    id: match[1] as InstancePartId,
    instance: Number(match[2]),
  }
}

export const partKeyStrToLabel = (partKeyStr: string): string => {
  if (partKeyStr === 'baseplate') {
    return 'Baseplate'
  }
  if (partKeyStr === 'assembled') {
    return 'Assembled'
  }
  const parsed = parseInstancePartKey(partKeyStr)
  if (parsed === null) {
    return partKeyStr
  }
  if (parsed.id === 'heelKick') {
    return `Heel Kick #${parsed.instance}`
  }
  return `Toe Hook #${parsed.instance}`
}
