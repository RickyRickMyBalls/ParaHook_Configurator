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
  BuildChangedInputExtrudeField,
  BuildChangedInputHint,
  BuildUnitId,
  CompiledBuildData,
  CompiledBuildDataOutputEntry,
} from '../../../shared/buildTypes'
import { parsePartKeyString } from '../../../shared/buildTypes'
import type {
  GeometryRequestExtrudeOp,
  GeometryRequestOp,
  GeometryRequestSketchOp,
} from '../../../shared/geometryRequest'

export type SpaghettiBuildInputs = NonNullable<CompileSpaghettiGraphResult['buildInputs']>

export type BuildInputsRequestTranslation = {
  compiledBuildData: CompiledBuildData
  targetBuildUnitIds: BuildUnitId[]
  affectedBuildUnitIds: BuildUnitId[]
  changedParamIds: string[]
  changedInputHint?: BuildChangedInputHint
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
type FeatureStackPayload = {
  schemaVersion: 1
  parts: Record<string, GeometryRequestOp[]>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const EXTRUDE_PARAM_FIELDS = [
  'extrudeType',
  'extrudeDirection',
  'depthResolved',
  'startDepthResolved',
  'endDepthResolved',
  'taperResolved',
  'offsetResolved',
] as const satisfies readonly BuildChangedInputExtrudeField[]

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
): value is FeatureStackPayload =>
  isRecord(value) &&
  value.schemaVersion === 1 &&
  isRecord(value.parts)

const readFeatureStackPayload = (
  buildInputs: SpaghettiBuildInputs | undefined,
): FeatureStackPayload | undefined => {
  if (buildInputs === undefined) {
    return undefined
  }
  const featureStackIR = readFeatureStackIR(buildInputs)
  return isFeatureStackPayload(featureStackIR) ? featureStackIR : undefined
}

const isSketchOp = (value: GeometryRequestOp): value is GeometryRequestSketchOp =>
  value.op === 'sketch'

const isExtrudeOp = (value: GeometryRequestOp): value is GeometryRequestExtrudeOp =>
  value.op === 'extrude'

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

const collectTargetBuildUnitIdsForPartKeys = (
  compiledBuildData: CompiledBuildData,
  partKeys: readonly string[],
): BuildUnitId[] => {
  const targetPartKeySet = new Set(partKeys)
  const outputEntries = compiledBuildData.outputEntries ?? []
  const buildUnitIds: BuildUnitId[] = []
  const seen = new Set<string>()

  for (const entry of outputEntries) {
    if (!targetPartKeySet.has(entry.partKey) || seen.has(entry.buildUnitId)) {
      continue
    }
    seen.add(entry.buildUnitId)
    buildUnitIds.push(entry.buildUnitId)
  }

  return buildUnitIds
}

const deriveScopedTargetBuildUnitIds = (
  compiledBuildData: CompiledBuildData,
  fallbackTargetBuildUnitIds: readonly BuildUnitId[],
  changedInputHint: BuildChangedInputHint | undefined,
): BuildUnitId[] => {
  if (changedInputHint === undefined) {
    return [...fallbackTargetBuildUnitIds]
  }

  const scopedPartKeys =
    changedInputHint.kind === 'graph_local_extrude_params'
      ? [changedInputHint.changedPartKey]
      : changedInputHint.changedPartKeys
  const scopedBuildUnitIds = collectTargetBuildUnitIdsForPartKeys(compiledBuildData, scopedPartKeys)
  return scopedBuildUnitIds.length > 0 ? scopedBuildUnitIds : [...fallbackTargetBuildUnitIds]
}

const collectChangedPartKeys = (
  currentPayload: FeatureStackPayload | undefined,
  previousPayload: FeatureStackPayload | undefined,
): string[] => {
  const partKeys = [
    ...new Set([
      ...Object.keys(currentPayload?.parts ?? {}),
      ...Object.keys(previousPayload?.parts ?? {}),
    ]),
  ]
  return orderSpaghettiSourcePartKeys(
    partKeys.filter(
      (partKey) =>
        stableHash(currentPayload?.parts[partKey] ?? null) !==
        stableHash(previousPayload?.parts[partKey] ?? null),
    ),
  )
}

const buildSketchOpMap = (
  operations: readonly GeometryRequestSketchOp[],
): Map<string, GeometryRequestSketchOp> =>
  new Map(operations.map((operation) => [operation.featureId, operation] as const))

const collectChangedSketchNodeIds = (
  currentPayload: FeatureStackPayload | undefined,
  previousPayload: FeatureStackPayload | undefined,
  changedPartKeys: readonly string[],
): string[] => {
  const changedSketchNodeIds = new Set<string>()

  for (const partKey of changedPartKeys) {
    const currentSketchOps = (currentPayload?.parts[partKey] ?? []).filter(isSketchOp)
    const previousSketchOps = (previousPayload?.parts[partKey] ?? []).filter(isSketchOp)
    const currentByFeatureId = buildSketchOpMap(currentSketchOps)
    const previousByFeatureId = buildSketchOpMap(previousSketchOps)
    const featureIds = [
      ...new Set([...currentByFeatureId.keys(), ...previousByFeatureId.keys()]),
    ].sort((left, right) => left.localeCompare(right))

    for (const featureId of featureIds) {
      if (
        stableHash(currentByFeatureId.get(featureId) ?? null) !==
        stableHash(previousByFeatureId.get(featureId) ?? null)
      ) {
        changedSketchNodeIds.add(featureId)
      }
    }
  }

  return [...changedSketchNodeIds].sort((left, right) => left.localeCompare(right))
}

const projectExtrudeStructure = (operation: GeometryRequestExtrudeOp) => ({
  featureId: operation.featureId,
  profileSelection: operation.profileSelection ?? null,
  profileRef: operation.profileRef,
  plane: operation.plane ?? null,
  planeTransform: operation.planeTransform ?? null,
  bodyId: operation.bodyId ?? null,
})

const collectChangedExtrudeFields = (
  currentExtrudeOps: readonly GeometryRequestExtrudeOp[],
  previousExtrudeOps: readonly GeometryRequestExtrudeOp[],
): BuildChangedInputExtrudeField[] =>
  [...EXTRUDE_PARAM_FIELDS].filter(
    (field) =>
      stableHash(currentExtrudeOps.map((operation) => operation[field] ?? null)) !==
      stableHash(previousExtrudeOps.map((operation) => operation[field] ?? null)),
  )

const buildLocalExtrudeChangedInputHint = (
  currentPayload: FeatureStackPayload | undefined,
  previousPayload: FeatureStackPayload | undefined,
): BuildChangedInputHint | undefined => {
  const changedPartKeys = collectChangedPartKeys(currentPayload, previousPayload)
  if (changedPartKeys.length !== 1) {
    return undefined
  }

  const changedPartKey = changedPartKeys[0]
  const currentOperations = currentPayload?.parts[changedPartKey]
  const previousOperations = previousPayload?.parts[changedPartKey]
  if (currentOperations === undefined || previousOperations === undefined) {
    return undefined
  }

  const currentSketchOps = currentOperations.filter(isSketchOp)
  const previousSketchOps = previousOperations.filter(isSketchOp)
  if (stableHash(currentSketchOps) !== stableHash(previousSketchOps)) {
    return undefined
  }

  const currentExtrudeOps = currentOperations.filter(isExtrudeOp)
  const previousExtrudeOps = previousOperations.filter(isExtrudeOp)
  if (
    currentExtrudeOps.length === 0 ||
    previousExtrudeOps.length === 0 ||
    currentExtrudeOps.length !== previousExtrudeOps.length
  ) {
    return undefined
  }

  const changedNodeIds = [
    ...new Set([
      ...currentExtrudeOps.map((operation) => operation.featureId),
      ...previousExtrudeOps.map((operation) => operation.featureId),
    ]),
  ]
  if (changedNodeIds.length !== 1) {
    return undefined
  }

  if (
    stableHash(currentExtrudeOps.map(projectExtrudeStructure)) !==
    stableHash(previousExtrudeOps.map(projectExtrudeStructure))
  ) {
    return undefined
  }

  const changedFields = collectChangedExtrudeFields(currentExtrudeOps, previousExtrudeOps)
  if (changedFields.length === 0) {
    return undefined
  }

  return {
    kind: 'graph_local_extrude_params',
    changedNodeId: changedNodeIds[0],
    changedPartKey,
    changedFields,
  }
}

const buildChangedInputHint = (
  currentBuildInputs: SpaghettiBuildInputs,
  previousBuildInputs: SpaghettiBuildInputs | undefined,
): BuildChangedInputHint | undefined => {
  const currentPayload = readFeatureStackPayload(currentBuildInputs)
  const previousPayload = readFeatureStackPayload(previousBuildInputs)
  const localExtrudeHint = buildLocalExtrudeChangedInputHint(currentPayload, previousPayload)
  if (localExtrudeHint !== undefined) {
    return localExtrudeHint
  }

  const changedPartKeys = collectChangedPartKeys(currentPayload, previousPayload)
  if (changedPartKeys.length === 0) {
    return undefined
  }

  const changedSketchNodeIds = collectChangedSketchNodeIds(
    currentPayload,
    previousPayload,
    changedPartKeys,
  )

  return {
    kind: 'graph_shared_upstream',
    changedPartKeys,
    upstreamNodeIds: changedSketchNodeIds,
    reason: changedSketchNodeIds.length > 0 ? 'sketch_change' : 'feature_stack_change',
  }
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
  const allTargetBuildUnitIds = collectTargetBuildUnitIds(previewPreparation)

  if (previousBuildInputs === undefined) {
    return {
      compiledBuildData,
      targetBuildUnitIds: allTargetBuildUnitIds,
      affectedBuildUnitIds: [...allTargetBuildUnitIds],
      changedParamIds: ['sp_full'],
      buildStatsPartKeys,
    }
  }

  const previousPatch = toProfilePatch(workerFacingPreviousBuildInputs ?? previousBuildInputs)
  const changedParamIds = spProfileKeys.filter(
    (key) => stableHash(getPatchValue(profilePatch, key)) !== stableHash(getPatchValue(previousPatch, key)),
  )
  const changedInputHint = buildChangedInputHint(
    workerFacingBuildInputs,
    workerFacingPreviousBuildInputs,
  )
  const targetBuildUnitIds = deriveScopedTargetBuildUnitIds(
    compiledBuildData,
    allTargetBuildUnitIds,
    changedInputHint,
  )

  return {
    compiledBuildData,
    targetBuildUnitIds,
    affectedBuildUnitIds: [...targetBuildUnitIds],
    changedParamIds,
    ...(changedInputHint === undefined ? {} : { changedInputHint }),
    buildStatsPartKeys,
  }
}
