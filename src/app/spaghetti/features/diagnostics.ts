import type { FeatureStack } from './featureTypes'

export type Diagnostic = {
  featureId: string
  level: 'warning' | 'error'
  message: string
}

export const getFeatureDiagnostics = (stack: FeatureStack): Diagnostic[] => {
  const diagnostics: Diagnostic[] = []
  const sketchById = new Map<string, Extract<FeatureStack[number], { type: 'sketch' }>>()
  for (const feature of stack) {
    if (feature.type === 'sketch') {
      sketchById.set(feature.featureId, feature)
    }
  }

  for (const feature of stack) {
    if (feature.type !== 'extrude') {
      continue
    }
    const profileRef = feature.inputs.profileRef
    if (profileRef === null) {
      diagnostics.push({
        featureId: feature.featureId,
        level: 'warning',
        message: 'Extrude missing profile',
      })
      continue
    }
    const sourceSketch = sketchById.get(profileRef.sourceFeatureId)
    if (sourceSketch === undefined) {
      diagnostics.push({
        featureId: feature.featureId,
        level: 'error',
        message: 'Extrude references missing sketch',
      })
      continue
    }
    const profileExists = sourceSketch.outputs.profiles.some(
      (profile) => profile.profileId === profileRef.profileId,
    )
    if (!profileExists) {
      diagnostics.push({
        featureId: feature.featureId,
        level: 'error',
        message: 'Extrude references missing profile',
      })
    }
  }

  return diagnostics
}

export type FeatureDiagnostic = Diagnostic
