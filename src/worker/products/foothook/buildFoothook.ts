import type { PartArtifact } from '../../../shared/partsTypes'
import {
  executeFeatureStack,
  isFeatureStackIRPayload,
  type ExecuteFeatureStackResult,
} from '../../cad/featureStackRuntime'
import { createBaseplatePart } from './parts/baseplate'
import { createHeelKickPart } from './parts/heelKick'
import { createToeHookPart } from './parts/toeHook'

const seedFromProfile = (profile: Record<string, unknown>): number =>
  JSON.stringify(profile).length

export const buildFoothookParts = (
  profile: Record<string, unknown>,
): PartArtifact[] => {
  const seed = seedFromProfile(profile)
  return [
    createBaseplatePart(seed),
    createHeelKickPart(seed),
    createToeHookPart(seed),
  ]
}

export const runFoothookFeatureStack = (
  profilePatch: Record<string, unknown>,
): ExecuteFeatureStackResult | null => {
  const candidate = profilePatch.sp_featureStackIR
  if (!isFeatureStackIRPayload(candidate)) {
    return null
  }
  return executeFeatureStack(candidate)
}
