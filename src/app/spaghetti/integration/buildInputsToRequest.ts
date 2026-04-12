import type { CompileSpaghettiGraphResult } from '../compiler/compileGraph'
import { buildGraphOutputEntryIdsForSlot } from '../outputSurface'
import { buildExtrudeBodyId } from '../features/extrudeBodyIdentity'
import { parseExtrudeBodyMemberPortId } from '../features/extrudeBodyVirtualPorts'
import {
  getPreviewPreparationEntriesForSlot,
  type GraphPreviewPreparation,
} from '../previewPreparation'
import {
  deriveSpaghettiSourcePartKeysFromProfilePatch,
  orderSpaghettiSourcePartKeys,
} from '../../../shared/buildStatsKeys'
import type {
  BuildUnitId,
  CompiledBuildData,
  CompiledBuildDataOutputEntry,
} from '../../../shared/buildTypes'
import { parsePartKeyString } from '../../../shared/buildTypes'

export type SpaghettiBuildInputs = NonNullable<CompileSpaghettiGraphResult['buildInputs']>

export type BuildInputsRequestTranslation = {
  compiledBuildData: CompiledBuildData
  targetBuildUnitIds: BuildUnitId[]
  affectedBuildUnitIds: BuildUnitId[]
  changedParamIds: string[]
  buildStatsPartKeys: string[]
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

const isFeatureStackPayload = (
  value: unknown,
): value is {
  schemaVersion: 1
  parts: Record<string, unknown>
} =>
  isRecord(value) &&
  value.schemaVersion === 1 &&
  isRecord(value.parts)

const collectWorkerRelevantExtrudePartKeys = (
  previewPreparation: GraphPreviewPreparation,
): Set<string> => {
  const partKeys = new Set<string>()

  for (const slotId of previewPreparation.outputSlotIds) {
    if (previewPreparation.slotStatusBySlotId[slotId] !== 'ok') {
      continue
    }
    for (const entry of getPreviewPreparationEntriesForSlot(previewPreparation, slotId)) {
      if (
        entry.sourcePartKeyStr.length > 0 &&
        parsePartKeyString(entry.sourcePartKeyStr).id === 'extrude'
      ) {
        partKeys.add(entry.sourcePartKeyStr)
      }
    }
  }

  return partKeys
}

const filterWorkerFacingOrderedPartKeys = (
  orderedPartKeys: readonly string[],
  previewPreparation: GraphPreviewPreparation,
): string[] => {
  const workerRelevantExtrudePartKeys = collectWorkerRelevantExtrudePartKeys(previewPreparation)

  return orderedPartKeys.filter((partKey) => {
    const parsed = parsePartKeyString(partKey)
    return parsed.id !== 'extrude' || workerRelevantExtrudePartKeys.has(partKey)
  })
}

const toWorkerFacingBuildInputs = (
  buildInputs: SpaghettiBuildInputs,
  previewPreparation: GraphPreviewPreparation,
): SpaghettiBuildInputs => {
  const orderedPartKeys = filterWorkerFacingOrderedPartKeys(
    buildInputs.orderedPartKeys,
    previewPreparation,
  )
  const allowedPartKeys = new Set(orderedPartKeys)
  const featureStackIR = readFeatureStackIR(buildInputs)
  const workerFeatureStackIR = isFeatureStackPayload(featureStackIR)
    ? {
        schemaVersion: 1 as const,
        parts: Object.fromEntries(
          Object.entries(featureStackIR.parts).filter(([partKey]) => allowedPartKeys.has(partKey)),
        ),
      }
    : featureStackIR

  return {
    orderedPartKeys,
    resolvedParts: Object.fromEntries(
      Object.entries(buildInputs.resolvedParts).filter(([partKey]) => allowedPartKeys.has(partKey)),
    ),
    ...(isRecord(buildInputs.resolvedShared)
      ? {
          resolvedShared: {
            ...buildInputs.resolvedShared,
            ...(workerFeatureStackIR !== undefined ? { sp_featureStackIR: workerFeatureStackIR } : {}),
          },
        }
      : {}),
  }
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

const buildCompiledOutputEntries = (
  previewPreparation: GraphPreviewPreparation,
): CompiledBuildDataOutputEntry[] => {
  const outputEntries: CompiledBuildDataOutputEntry[] = []
  const seen = new Set<string>()

  for (const slotId of previewPreparation.outputSlotIds) {
    const slotEntries = getPreviewPreparationEntriesForSlot(previewPreparation, slotId)
    if (slotEntries.length === 0) {
      continue
    }
    const outputEntryIds = buildGraphOutputEntryIdsForSlot(slotId, slotEntries)

    slotEntries.forEach((entry, entryIndex) => {
      const outputEntryId = outputEntryIds[entryIndex]
      if (seen.has(outputEntryId)) {
        return
      }
      seen.add(outputEntryId)
      const portMemberIndex = parseExtrudeBodyMemberPortId(entry.sourcePortId)?.memberIndex
      const bodyMemberIndex = entry.memberIndex ?? portMemberIndex
      outputEntries.push({
        buildUnitId: outputEntryId,
        outputEntryId,
        sourceNodeId: entry.sourceNodeId,
        partKey: entry.sourcePartKeyStr,
        bodyId:
          bodyMemberIndex === undefined
            ? null
            : buildExtrudeBodyId(entry.sourceNodeId, bodyMemberIndex),
      })
    })
  }

  return outputEntries
}

const toCompiledBuildData = (
  buildInputs: SpaghettiBuildInputs,
  previewPreparation: GraphPreviewPreparation,
): CompiledBuildData => ({
  orderedPartKeys: [...buildInputs.orderedPartKeys],
  resolvedParts: Object.fromEntries(
    Object.entries(buildInputs.resolvedParts).map(([partKey, params]) => [partKey, { ...params }]),
  ),
  outputEntries: buildCompiledOutputEntries(previewPreparation),
  ...(isRecord(buildInputs.resolvedShared)
    ? { resolvedShared: { ...buildInputs.resolvedShared } }
    : {}),
})

const collectTargetBuildUnitIds = (
  previewPreparation: GraphPreviewPreparation,
): BuildUnitId[] => {
  const orderedIds: BuildUnitId[] = []
  const seen = new Set<string>()

  for (const slotId of previewPreparation.outputSlotIds) {
    const slotEntries = getPreviewPreparationEntriesForSlot(previewPreparation, slotId)
    if (slotEntries.length === 0) {
      continue
    }
    const buildUnitIds = buildGraphOutputEntryIdsForSlot(slotId, slotEntries)
    for (const buildUnitId of buildUnitIds) {
      if (seen.has(buildUnitId)) {
        continue
      }
      seen.add(buildUnitId)
      orderedIds.push(buildUnitId)
    }
  }

  return orderedIds
}

export const buildRequestFromBuildInputs = (
  buildInputs: SpaghettiBuildInputs,
  previewPreparation: GraphPreviewPreparation,
  previousBuildInputs?: SpaghettiBuildInputs,
): BuildInputsRequestTranslation => {
  const workerFacingBuildInputs = toWorkerFacingBuildInputs(buildInputs, previewPreparation)
  const workerFacingPreviousBuildInputs =
    previousBuildInputs === undefined
      ? undefined
      : toWorkerFacingBuildInputs(previousBuildInputs, previewPreparation)
  const compiledBuildData = toCompiledBuildData(workerFacingBuildInputs, previewPreparation)
  const profilePatch = toProfilePatch(
    workerFacingBuildInputs,
    workerFacingPreviousBuildInputs,
  )
  const orderedSourcePartKeys =
    workerFacingBuildInputs.orderedPartKeys.length > 0
      ? orderSpaghettiSourcePartKeys(workerFacingBuildInputs.orderedPartKeys)
      : deriveSpaghettiSourcePartKeysFromProfilePatch(profilePatch)
  const buildStatsPartKeys = [...orderedSourcePartKeys]
  const targetBuildUnitIds = collectTargetBuildUnitIds(previewPreparation)

  if (previousBuildInputs === undefined) {
    return {
      compiledBuildData,
      targetBuildUnitIds,
      affectedBuildUnitIds: [...targetBuildUnitIds],
      changedParamIds: ['sp_full'],
      buildStatsPartKeys,
    }
  }

  const previousPatch = toProfilePatch(workerFacingPreviousBuildInputs ?? previousBuildInputs)
  const changedParamIds = spProfileKeys.filter(
    (key) => stableHash(getPatchValue(profilePatch, key)) !== stableHash(getPatchValue(previousPatch, key)),
  )

  return {
    compiledBuildData,
    targetBuildUnitIds,
    affectedBuildUnitIds: [...targetBuildUnitIds],
    changedParamIds,
    buildStatsPartKeys,
  }
}
