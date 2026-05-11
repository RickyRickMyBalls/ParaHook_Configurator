import { buildReferenceObjectMaterialTargetKey } from '../../shared/materialTargetKeys'
import type { MaterialPreset, ViewSettings } from '../../shared/viewSettingsTypes'
import {
  buildImportedReferenceRowId,
  resolveOwnedContentSelection,
  type AppState,
} from '../store/useAppStore'
import type { PropertiesSectionContext } from './propertiesSectionContract'

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
  | 'missing'

export type MaterialsSelectedMaterialRead = {
  status: MaterialsPhase1Status
  target: MaterialsTargetRow | null
  source: MaterialsSelectedMaterialReadSource
  sourceLabel: string
  preset: MaterialPreset | null
}

export type MaterialsPhase1ViewModel = {
  focusedObjectId: string
  focusedObjectLabel: string
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
    }
  }

  return {
    status: 'pending',
    target,
    source: 'missing',
    sourceLabel: 'Material preset missing',
    preset: null,
  }
}

const buildAuthoredPartTargetRows = (
  context: PropertiesSectionContext,
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
): MaterialsTargetRow[] => {
  const selection = resolveOwnedContentSelection(state, context.selectedTarget)
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

export const buildMaterialsTargetRows = (
  context: PropertiesSectionContext,
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
): MaterialsTargetRow[] => {
  if (context.selectedTarget.kind !== 'object') {
    return []
  }

  const focusedObjectId = context.selectedTarget.objectId
  const referenceRows = buildReferencePartTargetRows(focusedObjectId, state)
  if (referenceRows.length > 0) {
    return referenceRows
  }

  return buildAuthoredPartTargetRows(context, state)
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
    context.selectedTarget.kind === 'object' ? context.selectedTarget.objectId : context.focusSummary.detail
  const presetCount = materials.presets.length
  const assignedPartCount = Object.keys(materials.perPart).length
  const targetRows = buildMaterialsTargetRows(context, state)

  return {
    focusedObjectId,
    focusedObjectLabel: `${context.focusSummary.title}: ${context.focusSummary.detail}`,
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
