import type { FeatureStack, ProfileReference } from './featureTypes'

export const pickDefaultProfileRef = (
  stack: FeatureStack,
  insertIndex: number,
): ProfileReference | null => {
  for (let index = insertIndex - 1; index >= 0; index -= 1) {
    const feature = stack[index]
    if (feature.type === 'closeProfile') {
      const resolved = feature.outputs.profileRef
      if (resolved === null) {
        return null
      }
      return {
        sourceFeatureId: feature.featureId,
        profileId: resolved.profileId,
        profileIndex: resolved.profileIndex,
      }
    }
    if (feature.type !== 'sketch') {
      continue
    }
    const profiles = feature.outputs.profiles
    if (profiles.length === 0) {
      return null
    }
    const selected = [...profiles].sort((a, b) => b.area - a.area)[0]
    return {
      sourceFeatureId: feature.featureId,
      profileId: selected.profileId,
      profileIndex: selected.profileIndex,
    }
  }
  return null
}

export const findDefaultExtrudeProfileRef = pickDefaultProfileRef
