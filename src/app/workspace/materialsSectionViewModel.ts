import { buildReferenceObjectMaterialTargetKey } from '../../shared/materialTargetKeys'
import type { MaterialPreset, ViewSettings } from '../../shared/viewSettingsTypes'
import {
  buildImportedReferenceRowId,
  resolveOwnedContentSelection,
  type AppState,
} from '../store/useAppStore'
import type {
  PropertiesSectionContext,
  WorkspaceObjectSelectedTarget,
} from './propertiesSectionContract'

export type MaterialsPhase1Status = 'ready' | 'pending'
export type MaterialsTargetSourceKind = 'authored-part' | 'reference-part' | 'reference-object'

export type MaterialsTargetRow = {
  targetId: string
  label: string
  partKey: string
  sourceKind: MaterialsTargetSourceKind
  detail: string
}

export type MaterialsAssignmentGroupId = 'all' | 'odd' | 'even'

export type MaterialsAssignmentGroup = {
  id: MaterialsAssignmentGroupId
  label: string
  description: string
  partKeys: string[]
}

export type MaterialsAssignmentScopeKind = 'single-object' | 'multi-object'

export type MaterialsAssignmentObjectGroup = {
  objectId: string
  label: string
  targetRows: MaterialsTargetRow[]
}

export type MaterialsAssignmentScope = {
  kind: MaterialsAssignmentScopeKind
  objectCount: number
  targetCount: number
  partKeys: string[]
  targetRows: MaterialsTargetRow[]
  objectGroups: MaterialsAssignmentObjectGroup[]
}

export type MaterialsPhase1Row = {
  id: string
  label: string
  description: string
  value: string
  status: MaterialsPhase1Status
}

export type MaterialsSelectedMaterialReadSource =
  | 'per-part'
  | 'selected-preset'
  | 'first-preset-fallback'
  | 'multi-object'
  | 'mixed'
  | 'missing'

export type MaterialsSelectedMaterialRead = {
  status: MaterialsPhase1Status
  target: MaterialsTargetRow | null
  source: MaterialsSelectedMaterialReadSource
  sourceLabel: string
  preset: MaterialPreset | null
  targetCount: number
  fields: MaterialsSelectedMaterialFieldReads
}

export type MaterialsSelectedMaterialFieldKey =
  | 'name'
  | 'color'
  | 'emissive'
  | 'metalness'
  | 'roughness'
  | 'opacity'
  | 'emissiveIntensity'
  | 'transparent'
  | 'doubleSided'

export type MaterialsSelectedMaterialFieldRead<T> =
  | {
      status: 'value'
      value: T
    }
  | {
      status: 'mixed'
      value: null
    }
  | {
      status: 'pending'
      value: null
    }

export type MaterialsSelectedMaterialFieldReads = {
  name: MaterialsSelectedMaterialFieldRead<string>
  color: MaterialsSelectedMaterialFieldRead<string>
  emissive: MaterialsSelectedMaterialFieldRead<string>
  metalness: MaterialsSelectedMaterialFieldRead<number>
  roughness: MaterialsSelectedMaterialFieldRead<number>
  opacity: MaterialsSelectedMaterialFieldRead<number>
  emissiveIntensity: MaterialsSelectedMaterialFieldRead<number>
  transparent: MaterialsSelectedMaterialFieldRead<boolean>
  doubleSided: MaterialsSelectedMaterialFieldRead<boolean>
}

export type MaterialsPhase1ViewModel = {
  focusedObjectId: string
  focusedObjectLabel: string
  assignmentScope: MaterialsAssignmentScope
  targetRows: MaterialsTargetRow[]
  targetStatusLabel: string
  rows: MaterialsPhase1Row[]
  owedFeatureGroups: string[]
}

const formatBooleanMode = (enabled: boolean): string => (enabled ? 'enabled' : 'disabled')

const findMaterialPreset = (
  materials: ViewSettings['materials'],
  presetId: string | undefined,
): MaterialPreset | null => {
  if (presetId === undefined) {
    return null
  }

  return materials.presets.find((preset) => preset.id === presetId) ?? null
}

const buildValueFieldReads = (preset: MaterialPreset): MaterialsSelectedMaterialFieldReads => ({
  name: { status: 'value', value: preset.name },
  color: { status: 'value', value: preset.color },
  emissive: { status: 'value', value: preset.emissive },
  metalness: { status: 'value', value: preset.metalness },
  roughness: { status: 'value', value: preset.roughness },
  opacity: { status: 'value', value: preset.opacity },
  emissiveIntensity: { status: 'value', value: preset.emissiveIntensity },
  transparent: { status: 'value', value: preset.transparent },
  doubleSided: { status: 'value', value: preset.doubleSided },
})

const buildPendingFieldReads = (): MaterialsSelectedMaterialFieldReads => ({
  name: { status: 'pending', value: null },
  color: { status: 'pending', value: null },
  emissive: { status: 'pending', value: null },
  metalness: { status: 'pending', value: null },
  roughness: { status: 'pending', value: null },
  opacity: { status: 'pending', value: null },
  emissiveIntensity: { status: 'pending', value: null },
  transparent: { status: 'pending', value: null },
  doubleSided: { status: 'pending', value: null },
})

const buildAggregateFieldRead = <T,>(
  presets: MaterialPreset[],
  selectValue: (preset: MaterialPreset) => T,
): MaterialsSelectedMaterialFieldRead<T> => {
  if (presets.length === 0) {
    return { status: 'pending', value: null }
  }

  const firstValue = selectValue(presets[0]!)
  const hasMixedValue = presets.some((preset) => selectValue(preset) !== firstValue)
  return hasMixedValue ? { status: 'mixed', value: null } : { status: 'value', value: firstValue }
}

const buildAggregateFieldReads = (presets: MaterialPreset[]): MaterialsSelectedMaterialFieldReads => ({
  name: buildAggregateFieldRead(presets, (preset) => preset.name),
  color: buildAggregateFieldRead(presets, (preset) => preset.color),
  emissive: buildAggregateFieldRead(presets, (preset) => preset.emissive),
  metalness: buildAggregateFieldRead(presets, (preset) => preset.metalness),
  roughness: buildAggregateFieldRead(presets, (preset) => preset.roughness),
  opacity: buildAggregateFieldRead(presets, (preset) => preset.opacity),
  emissiveIntensity: buildAggregateFieldRead(presets, (preset) => preset.emissiveIntensity),
  transparent: buildAggregateFieldRead(presets, (preset) => preset.transparent),
  doubleSided: buildAggregateFieldRead(presets, (preset) => preset.doubleSided),
})

const hasMixedFieldRead = (fields: MaterialsSelectedMaterialFieldReads): boolean =>
  Object.values(fields).some((field) => field.status === 'mixed')

export const resolveSelectedTargetMaterialRead = (
  target: MaterialsTargetRow | null,
  materials: ViewSettings['materials'],
): MaterialsSelectedMaterialRead => {
  if (target === null) {
    return {
      status: 'pending',
      target,
      source: 'missing',
      sourceLabel: 'No selected target',
      preset: null,
      targetCount: 0,
      fields: buildPendingFieldReads(),
    }
  }

  const perPartPresetId = materials.usePerPart ? materials.perPart[target.partKey] : undefined
  const perPartPreset = findMaterialPreset(materials, perPartPresetId)
  if (perPartPreset !== null) {
    return {
      status: 'ready',
      target,
      source: 'per-part',
      sourceLabel: 'Per-part assignment',
      preset: perPartPreset,
      targetCount: 1,
      fields: buildValueFieldReads(perPartPreset),
    }
  }

  const selectedPreset = findMaterialPreset(materials, materials.selectedPresetId)
  if (selectedPreset !== null) {
    return {
      status: 'ready',
      target,
      source: 'selected-preset',
      sourceLabel: 'Selected preset',
      preset: selectedPreset,
      targetCount: 1,
      fields: buildValueFieldReads(selectedPreset),
    }
  }

  const fallbackPreset = materials.presets[0] ?? null
  if (fallbackPreset !== null) {
    return {
      status: 'ready',
      target,
      source: 'first-preset-fallback',
      sourceLabel: 'First preset fallback',
      preset: fallbackPreset,
      targetCount: 1,
      fields: buildValueFieldReads(fallbackPreset),
    }
  }

  return {
    status: 'pending',
    target,
    source: 'missing',
    sourceLabel: 'Material preset missing',
    preset: null,
    targetCount: 0,
    fields: buildPendingFieldReads(),
  }
}

export const resolveSelectedMaterialScopeRead = (
  activeTarget: MaterialsTargetRow | null,
  assignmentScope: MaterialsAssignmentScope,
  materials: ViewSettings['materials'],
): MaterialsSelectedMaterialRead => {
  if (assignmentScope.kind !== 'multi-object' || assignmentScope.targetRows.length <= 1) {
    return resolveSelectedTargetMaterialRead(activeTarget, materials)
  }

  const targetReads = assignmentScope.targetRows.map((targetRow) =>
    resolveSelectedTargetMaterialRead(targetRow, materials),
  )
  const readyReads = targetReads.filter(
    (read): read is MaterialsSelectedMaterialRead & { preset: MaterialPreset } =>
      read.status === 'ready' && read.preset !== null,
  )

  if (readyReads.length === 0) {
    return {
      status: 'pending',
      target: activeTarget,
      source: 'missing',
      sourceLabel: 'Material preset missing',
      preset: null,
      targetCount: assignmentScope.targetRows.length,
      fields: buildPendingFieldReads(),
    }
  }

  const fields = buildAggregateFieldReads(readyReads.map((read) => read.preset))
  const hasMixedFields = hasMixedFieldRead(fields)
  return {
    status: 'ready',
    target: activeTarget,
    source: hasMixedFields ? 'mixed' : 'multi-object',
    sourceLabel: hasMixedFields ? 'Multiple material values' : 'Shared material values',
    preset: readyReads[0]!.preset,
    targetCount: assignmentScope.targetRows.length,
    fields,
  }
}

const buildAuthoredPartTargetRows = (
  selectedTarget: WorkspaceObjectSelectedTarget,
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
): MaterialsTargetRow[] => {
  const selection = resolveOwnedContentSelection(state, selectedTarget)
  if (selection === null || selection.rootKind !== 'object') {
    return []
  }

  return selection.partKeys.map((partKey, index) => ({
    targetId: `authored-part:${partKey}`,
    label: selection.partKeys.length === 1 ? 'Material target' : `Material target ${index + 1}`,
    partKey,
    sourceKind: 'authored-part',
    detail: 'Project part',
  }))
}

const buildReferencePartTargetRows = (
  focusedObjectId: string,
  state: Pick<AppState, 'referenceWorkspace'>,
): MaterialsTargetRow[] => {
  const referenceId =
    state.referenceWorkspace.importedReferenceOrder.find(
      (candidateReferenceId) => buildImportedReferenceRowId(candidateReferenceId) === focusedObjectId,
    ) ?? null
  if (referenceId === null) {
    return []
  }

  const partRows = state.referenceWorkspace.partRowsByReferenceId[referenceId] ?? []
  if (partRows.length > 0) {
    return partRows.map((partRow) => ({
      targetId: `reference-part:${partRow.partKey}`,
      label: partRow.label,
      partKey: partRow.partKey,
      sourceKind: 'reference-part',
      detail: `Imported mesh ${partRow.sourceMeshIndex + 1}`,
    }))
  }

  const referenceRecord = state.referenceWorkspace.importedReferencesById[referenceId]
  if (
    referenceRecord?.sourcePartKey !== null &&
    referenceRecord?.sourcePartKey !== undefined &&
    referenceRecord.sourceMeshIndex !== null
  ) {
    return [
      {
        targetId: `reference-part:${referenceRecord.sourcePartKey}`,
        label: referenceRecord.label,
        partKey: referenceRecord.sourcePartKey,
        sourceKind: 'reference-part',
        detail: `Imported mesh ${referenceRecord.sourceMeshIndex + 1}`,
      },
    ]
  }

  if (referenceRecord !== undefined) {
    const partKey = buildReferenceObjectMaterialTargetKey(referenceId)
    return [
      {
        targetId: partKey,
        label: referenceRecord.label,
        partKey,
        sourceKind: 'reference-object',
        detail: 'Whole imported object',
      },
    ]
  }

  return []
}

const resolveMaterialObjectLabel = (
  target: WorkspaceObjectSelectedTarget,
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
): string => {
  const objectRecord = state.projectContent.objectsById[target.objectId]
  if (objectRecord !== undefined) {
    return objectRecord.label
  }

  const referenceId =
    state.referenceWorkspace.importedReferenceOrder.find(
      (candidateReferenceId) => buildImportedReferenceRowId(candidateReferenceId) === target.objectId,
    ) ?? null
  if (referenceId !== null) {
    return state.referenceWorkspace.importedReferencesById[referenceId]?.label ?? target.objectId
  }

  return target.objectId
}

export const buildMaterialsTargetRowsForObjectTarget = (
  selectedTarget: WorkspaceObjectSelectedTarget,
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
): MaterialsTargetRow[] => {
  const referenceRows = buildReferencePartTargetRows(selectedTarget.objectId, state)
  if (referenceRows.length > 0) {
    return referenceRows
  }

  return buildAuthoredPartTargetRows(selectedTarget, state)
}

export const buildMaterialsTargetRows = (
  context: PropertiesSectionContext,
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
): MaterialsTargetRow[] => {
  if (context.selectedTarget?.kind !== 'object') {
    return []
  }

  return buildMaterialsTargetRowsForObjectTarget(context.selectedTarget, state)
}

export const buildMaterialsAssignmentScope = (
  context: PropertiesSectionContext,
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
): MaterialsAssignmentScope => {
  const selectedObjectTargets =
    context.selectedObjectTargets.length > 0
      ? context.selectedObjectTargets
      : context.selectedTarget?.kind === 'object'
        ? [context.selectedTarget]
        : []
  const seenObjectIds = new Set<string>()
  const objectGroups = selectedObjectTargets
    .filter((target) => {
      if (seenObjectIds.has(target.objectId)) {
        return false
      }
      seenObjectIds.add(target.objectId)
      return true
    })
    .map((target) => ({
      objectId: target.objectId,
      label: resolveMaterialObjectLabel(target, state),
      targetRows: buildMaterialsTargetRowsForObjectTarget(target, state),
    }))

  const seenPartKeys = new Set<string>()
  const targetRows: MaterialsTargetRow[] = []
  for (const group of objectGroups) {
    for (const targetRow of group.targetRows) {
      if (seenPartKeys.has(targetRow.partKey)) {
        continue
      }
      seenPartKeys.add(targetRow.partKey)
      targetRows.push(targetRow)
    }
  }

  return {
    kind: objectGroups.length > 1 ? 'multi-object' : 'single-object',
    objectCount: objectGroups.length,
    targetCount: targetRows.length,
    partKeys: targetRows.map((targetRow) => targetRow.partKey),
    targetRows,
    objectGroups,
  }
}

export const buildMaterialsAssignmentGroups = (
  targetRows: MaterialsTargetRow[],
): MaterialsAssignmentGroup[] => [
  {
    id: 'all',
    label: 'Assign To All',
    description: 'Apply the resolved material to every visible material target row.',
    partKeys: targetRows.map((targetRow) => targetRow.partKey),
  },
  {
    id: 'odd',
    label: 'Assign To Odds',
    description: 'Apply the resolved material to one-based odd target rows.',
    partKeys: targetRows
      .filter((_, index) => (index + 1) % 2 === 1)
      .map((targetRow) => targetRow.partKey),
  },
  {
    id: 'even',
    label: 'Assign To Evens',
    description: 'Apply the resolved material to one-based even target rows.',
    partKeys: targetRows
      .filter((_, index) => (index + 1) % 2 === 0)
      .map((targetRow) => targetRow.partKey),
  },
]

export const buildMaterialsPhase1ViewModel = (
  context: PropertiesSectionContext,
  materials: ViewSettings['materials'],
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
): MaterialsPhase1ViewModel => {
  const focusedObjectId =
    context.selectedTarget?.kind === 'object'
      ? context.selectedTarget.objectId
      : context.focusSummary.detail
  const presetCount = materials.presets.length
  const assignedPartCount = Object.keys(materials.perPart).length
  const targetRows = buildMaterialsTargetRows(context, state)
  const assignmentScope = buildMaterialsAssignmentScope(context, state)

  return {
    focusedObjectId,
    focusedObjectLabel: `${context.focusSummary.title}: ${context.focusSummary.detail}`,
    assignmentScope,
    targetRows,
    targetStatusLabel:
      targetRows.length > 0
        ? `${targetRows.length} material target${targetRows.length === 1 ? '' : 's'} ready`
        : 'No material parts found',
    rows: [
      {
        id: 'focused-object',
        label: 'Focused object intake',
        description: 'Object context arrives from the shared Properties shell contract.',
        value: focusedObjectId,
        status: 'ready',
      },
      {
        id: 'material-truth',
        label: 'Material truth source',
        description: 'Typed material presets, selection, per-part mode, and assignments live in view settings.',
        value: `${presetCount} presets / selected ${materials.selectedPresetId}`,
        status: 'ready',
      },
      {
        id: 'mutation-history',
        label: 'Mutation and history seam',
        description: 'Material writes currently route through ui-prefs actions wrapped by material edit history.',
        value: 'uiPrefsStore + materialEditHistory',
        status: 'ready',
      },
      {
        id: 'viewer-consumer',
        label: 'Viewer consumer seam',
        description: 'The viewer resolves effective material by partKey from selected preset or per-part assignment.',
        value: `${formatBooleanMode(materials.usePerPart)} per-part mode / ${assignedPartCount} assignments`,
        status: 'ready',
      },
      {
        id: 'target-discovery',
        label: 'Target discovery status',
        description: 'Target rows are projected from explicit authored part keys or stored reference part rows.',
        value:
          targetRows.length > 0
            ? `${targetRows.length} target row${targetRows.length === 1 ? '' : 's'} projected`
            : 'No authored or imported material targets available',
        status: targetRows.length > 0 ? 'ready' : 'pending',
      },
    ],
    owedFeatureGroups: [
      'focused target list',
      'selected-target material read',
      'editable material controls',
      'new, assign, and duplicate material actions',
      'odds and evens grouped target actions',
      'default material preset list',
    ],
  }
}
