import type { MaterialPresetId, PartMaterialMap, ViewSettings } from '../../shared/viewSettingsTypes'
import { normalizeViewSettings } from '../../shared/viewSettingsTypes'
import { editHistoryStore } from './editHistoryStore'
import { useUiPrefsStore } from './uiPrefsStore'

export type MaterialHistorySnapshot = ViewSettings['materials']

type MaterialHistoryOptions = {
  entryId?: string
  label?: string
  sourceId?: string
  sourceLabel?: string
  targetId?: string
  targetLabel?: string
}

let materialHistorySequence = 0

const materialHistorySource = {
  surface: 'viewer-material',
  sourceId: 'materials',
  sourceLabel: 'Materials',
}

const nextMaterialHistoryEntryId = (): string => {
  materialHistorySequence += 1
  return `material-${materialHistorySequence}`
}

const cloneMaterialSnapshot = (materials: ViewSettings['materials']): MaterialHistorySnapshot => ({
  presets: materials.presets.map((preset) => ({ ...preset })),
  selectedPresetId: materials.selectedPresetId,
  usePerPart: materials.usePerPart,
  perPart: { ...materials.perPart },
})

const arePartMaterialMapsEqual = (left: PartMaterialMap, right: PartMaterialMap): boolean => {
  const leftEntries = Object.entries(left).sort(([leftKey], [rightKey]) =>
    leftKey.localeCompare(rightKey),
  )
  const rightEntries = Object.entries(right).sort(([leftKey], [rightKey]) =>
    leftKey.localeCompare(rightKey),
  )
  return (
    leftEntries.length === rightEntries.length &&
    leftEntries.every(([key, value], index) => {
      const rightEntry = rightEntries[index]
      return rightEntry?.[0] === key && rightEntry[1] === value
    })
  )
}

export const areMaterialHistorySnapshotsEqual = (
  left: MaterialHistorySnapshot,
  right: MaterialHistorySnapshot,
): boolean =>
  left.selectedPresetId === right.selectedPresetId &&
  left.usePerPart === right.usePerPart &&
  left.presets.length === right.presets.length &&
  left.presets.every((preset, index) => {
    const rightPreset = right.presets[index]
    return (
      rightPreset !== undefined &&
      preset.id === rightPreset.id &&
      preset.name === rightPreset.name &&
      preset.color === rightPreset.color &&
      preset.metalness === rightPreset.metalness &&
      preset.roughness === rightPreset.roughness &&
      preset.emissive === rightPreset.emissive &&
      preset.emissiveIntensity === rightPreset.emissiveIntensity &&
      preset.opacity === rightPreset.opacity &&
      preset.transparent === rightPreset.transparent
    )
  }) &&
  arePartMaterialMapsEqual(left.perPart, right.perPart)

export const captureMaterialHistorySnapshot = (): MaterialHistorySnapshot =>
  cloneMaterialSnapshot(useUiPrefsStore.getState().view.materials)

export const restoreMaterialHistorySnapshot = (snapshot: MaterialHistorySnapshot): void => {
  const state = useUiPrefsStore.getState()
  useUiPrefsStore.setState({
    view: normalizeViewSettings({
      ...state.view,
      materials: cloneMaterialSnapshot(snapshot),
    }),
  })
}

export const commitMaterialHistory = (
  beforeSnapshot: MaterialHistorySnapshot,
  options: MaterialHistoryOptions = {},
): boolean => {
  const afterSnapshot = captureMaterialHistorySnapshot()
  if (areMaterialHistorySnapshotsEqual(beforeSnapshot, afterSnapshot)) {
    return false
  }

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextMaterialHistoryEntryId(),
    label: options.label ?? 'Change material',
    source: {
      ...materialHistorySource,
      sourceId: options.sourceId ?? materialHistorySource.sourceId,
      sourceLabel: options.sourceLabel ?? materialHistorySource.sourceLabel,
    },
    targetId: options.targetId,
    targetLabel: options.targetLabel,
    undo: () => restoreMaterialHistorySnapshot(beforeSnapshot),
    redo: () => restoreMaterialHistorySnapshot(afterSnapshot),
  })
}

export const runMaterialHistoryAction = (
  action: () => void,
  options: MaterialHistoryOptions = {},
): boolean => {
  const beforeSnapshot = captureMaterialHistorySnapshot()
  action()
  return commitMaterialHistory(beforeSnapshot, options)
}

export const selectMaterialPresetWithHistory = (
  id: MaterialPresetId,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().selectMaterialPreset(id), {
    targetId: `material-preset:${id}:select`,
    targetLabel: 'Material preset selection',
    ...options,
  })

export const addMaterialPresetWithHistory = (
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().addMaterialPreset(), {
    targetId: 'material-preset:add',
    targetLabel: 'Material preset',
    ...options,
  })

export const deleteMaterialPresetWithHistory = (
  id: MaterialPresetId,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().deleteMaterialPreset(id), {
    targetId: `material-preset:${id}:delete`,
    targetLabel: 'Material preset',
    ...options,
  })

export const setMaterialPresetTransparentWithHistory = (
  id: MaterialPresetId,
  transparent: boolean,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(
    () => useUiPrefsStore.getState().updateMaterialPreset(id, { transparent }),
    {
      targetId: `material-preset:${id}:transparent`,
      targetLabel: 'Material preset transparency',
      ...options,
    },
  )

export const setUsePerPartMaterialWithHistory = (
  enabled: boolean,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().setUsePerPartMaterial(enabled), {
    targetId: 'material-per-part:enabled',
    targetLabel: 'Per-part material mode',
    ...options,
  })

export const assignPartMaterialWithHistory = (
  partId: string,
  presetId: MaterialPresetId,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().assignPartMaterial(partId, presetId), {
    targetId: `material-per-part:${partId}`,
    targetLabel: 'Per-part material assignment',
    ...options,
  })

export const clearPartMaterialWithHistory = (
  partId: string,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().clearPartMaterial(partId), {
    targetId: `material-per-part:${partId}:clear`,
    targetLabel: 'Per-part material assignment',
    ...options,
  })
