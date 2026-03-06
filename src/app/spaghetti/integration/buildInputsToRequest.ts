import type { CompileSpaghettiGraphResult } from '../compiler/compileGraph'
import {
  deriveSpaghettiSourcePartKeysFromProfilePatch,
  orderSpaghettiSourcePartKeys,
  withAssembledBuildStatsKey,
} from '../../../shared/buildStatsKeys'

export type SpaghettiBuildInputs = NonNullable<CompileSpaghettiGraphResult['buildInputs']>

export type BuildInputsRequestTranslation = {
  profilePatch: Record<string, unknown>
  instances: {
    heelKickInstances: number[]
    toeHookInstances: number[]
  }
  changedParamIds: string[]
  partKeys: string[]
}

const spProfileKeys = [
  'sp_baseplate_anchorSpline2',
  'sp_baseplate_offsetSpline2',
  'sp_toeHook1_anchorSpline2',
  'sp_heelKick1_anchorSpline2',
  'sp_featureStackIR',
] as const

type SpProfileKey = (typeof spProfileKeys)[number]
type ProfilePatch = Partial<Record<SpProfileKey, unknown>>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }

  const entries = Object.entries(value as Record<string, unknown>).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )
  const serialized = entries.map(
    ([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`,
  )
  return `{${serialized.join(',')}}`
}

export const stableHash = (value: unknown): string => stableStringify(value)

const readFeatureStackIR = (buildInputs: SpaghettiBuildInputs): unknown | undefined => {
  if (!isRecord(buildInputs.resolvedShared)) {
    return undefined
  }
  return buildInputs.resolvedShared.sp_featureStackIR
}

const getPatchValue = (patch: ProfilePatch, key: SpProfileKey): unknown =>
  Object.prototype.hasOwnProperty.call(patch, key) ? patch[key] : undefined

const toProfilePatch = (
  buildInputs: SpaghettiBuildInputs,
  previousBuildInputs?: SpaghettiBuildInputs,
): ProfilePatch => {
  const baseplate = buildInputs.resolvedParts.baseplate
  const toeHook1 = buildInputs.resolvedParts['toeHook#1']
  const heelKick1 = buildInputs.resolvedParts['heelKick#1']
  const currentFeatureStackIR = readFeatureStackIR(buildInputs)
  const previousFeatureStackIR =
    previousBuildInputs === undefined ? undefined : readFeatureStackIR(previousBuildInputs)

  const patch: ProfilePatch = {
    ...(isRecord(baseplate)
      ? {
          sp_baseplate_anchorSpline2: baseplate.anchorSpline2 ?? null,
          sp_baseplate_offsetSpline2: baseplate.offsetSpline2 ?? null,
        }
      : {}),
    ...(isRecord(toeHook1)
      ? {
          sp_toeHook1_anchorSpline2: toeHook1.anchorSpline2 ?? null,
        }
      : {}),
    ...(isRecord(heelKick1)
      ? {
          sp_heelKick1_anchorSpline2: heelKick1.anchorSpline2 ?? null,
        }
      : {}),
  }

  if (currentFeatureStackIR !== undefined) {
    patch.sp_featureStackIR = currentFeatureStackIR
  } else if (previousFeatureStackIR !== undefined) {
    patch.sp_featureStackIR = null
  }

  return patch
}

export const buildRequestFromBuildInputs = (
  buildInputs: SpaghettiBuildInputs,
  previousBuildInputs?: SpaghettiBuildInputs,
): BuildInputsRequestTranslation => {
  const profilePatch = toProfilePatch(buildInputs, previousBuildInputs)
  const orderedSourcePartKeys =
    buildInputs.orderedPartKeys.length > 0
      ? orderSpaghettiSourcePartKeys(buildInputs.orderedPartKeys)
      : deriveSpaghettiSourcePartKeysFromProfilePatch(profilePatch)
  const partKeys = withAssembledBuildStatsKey(orderedSourcePartKeys)
  const instances = {
    heelKickInstances: [...buildInputs.instances.heelKickInstances],
    toeHookInstances: [...buildInputs.instances.toeHookInstances],
  }

  if (previousBuildInputs === undefined) {
    return {
      profilePatch,
      instances,
      changedParamIds: ['sp_full'],
      partKeys,
    }
  }

  const previousPatch = toProfilePatch(previousBuildInputs)
  const changedParamIds = spProfileKeys.filter(
    (key) => stableHash(getPatchValue(profilePatch, key)) !== stableHash(getPatchValue(previousPatch, key)),
  )

  return {
    profilePatch,
    instances,
    changedParamIds,
    partKeys,
  }
}
