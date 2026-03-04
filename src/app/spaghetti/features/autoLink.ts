import type { FeatureStack, ProfileReference } from './featureTypes'

export const pickDefaultProfileRef = (
  stack: FeatureStack,
  insertIndex: number,
): ProfileReference | null => {
  for (let index = insertIndex - 1; index >= 0; index -= 1) {
    const feature = stack[index]
    if (feature.type !== 'sketch') {
      continue
    }
    const profiles = feature.outputs.profiles
    if (profiles.length === 0) {
      return null
    }
    const selected = profiles[0]
    return {
      sourceFeatureId: feature.featureId,
      profileId: selected.profileId,
    }
  }
  return null
}

export const findDefaultExtrudeProfileRef = pickDefaultProfileRef
