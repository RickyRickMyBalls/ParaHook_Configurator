import type { FeatureStack } from './featureTypes'
import { getEffectiveFeatureStack, getFeatureDependencyIssues } from './featureDependencies'

export type FeatureDiagnosticCode =
  | 'SKETCH_PROFILE_NOT_CLOSED'
  | 'SKETCH_PROFILE_DEGENERATE'
  | 'CLOSE_PROFILE_SOURCE_MISSING'
  | 'CLOSE_PROFILE_PROFILE_MISSING'
  | 'EXTRUDE_PROFILE_REF_INVALID'

export type Diagnostic = {
  featureId: string
  level: 'warning' | 'error'
  code: FeatureDiagnosticCode
  message: string
}

export const getFeatureDiagnostics = (stack: FeatureStack): Diagnostic[] => {
  const diagnostics: Diagnostic[] = []
  const effectiveStack = getEffectiveFeatureStack(stack)

  for (const feature of effectiveStack) {
    if (feature.type === 'sketch') {
      for (const diagnostic of feature.outputs.diagnostics ?? []) {
        diagnostics.push({
          featureId: feature.featureId,
          level: 'error',
          code: diagnostic.code,
          message: diagnostic.message,
        })
      }
    }
  }

  for (const issue of getFeatureDependencyIssues(stack)) {
    if (issue.code === 'CLOSE_PROFILE_SOURCE_MISSING') {
      diagnostics.push({
        featureId: issue.featureId,
        level: 'error',
        code: issue.code,
        message: 'Close Profile references missing sketch.',
      })
      continue
    }
    if (issue.code === 'CLOSE_PROFILE_PROFILE_MISSING') {
      diagnostics.push({
        featureId: issue.featureId,
        level: 'error',
        code: issue.code,
        message: 'Close Profile source sketch has no resolved profile.',
      })
      continue
    }
    diagnostics.push({
      featureId: issue.featureId,
      level: 'error',
      code: issue.code,
      message: 'Extrude references missing profile source.',
    })
  }

  for (const feature of effectiveStack) {
    if (feature.type !== 'extrude' || feature.inputs.profileRef !== null) {
      continue
    }
    diagnostics.push({
      featureId: feature.featureId,
      level: 'warning',
      code: 'EXTRUDE_PROFILE_REF_INVALID',
      message: 'Extrude missing profile.',
    })
  }

  return diagnostics
}

export type FeatureDiagnostic = Diagnostic
