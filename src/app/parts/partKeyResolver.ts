import {
  getPartArtifactKey,
  parsePartKeyString,
  type PartArtifact,
} from '../../shared/buildTypes'

type InstancePartId = 'heelKick' | 'toeHook'

const PART_LABELS: Record<string, string> = {
  assembled: 'Assembled',
  baseplate: 'Baseplate',
  cube: 'Cube',
  cubeProof: 'Cube Proof',
  heelKick: 'Heel Kick',
  toeHook: 'Toe Hook',
}

export const artifactToPartKeyStr = (artifact: PartArtifact): string =>
  getPartArtifactKey(artifact)

export const parseInstancePartKey = (
  partKeyStr: string,
): { id: InstancePartId; instance: number } | null => {
  const parsed = parsePartKeyString(partKeyStr)
  if (
    parsed.instance === null ||
    (parsed.id !== 'heelKick' && parsed.id !== 'toeHook')
  ) {
    return null
  }
  return {
    id: parsed.id as InstancePartId,
    instance: parsed.instance,
  }
}

export const partKeyStrToLabel = (partKeyStr: string): string => {
  const parsed = parsePartKeyString(partKeyStr)
  const baseLabel = PART_LABELS[parsed.id]
  if (baseLabel === undefined) {
    return partKeyStr
  }
  if (parsed.instance === null) {
    return baseLabel
  }
  return `${baseLabel} #${parsed.instance}`
}
