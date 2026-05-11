import type {
  MaterialPreset,
  MaterialPresetId,
  PartMaterialMap,
  ViewSettings,
} from '../../shared/viewSettingsTypes'
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

export type MultiTargetMaterialPresetPatchTarget = {
  partId: string
  preset: MaterialPreset
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
      preset.transparent === rightPreset.transparent &&
      preset.doubleSided === rightPreset.doubleSided
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

export const createMaterialPresetWithHistory = (
  preset: Partial<MaterialPreset> = {},
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().addMaterialPreset(preset), {
    targetId: 'material-preset:create',
    targetLabel: 'Material preset',
    ...options,
  })

export const createAndAssignMaterialPresetWithHistory = (
  partId: string,
  preset: Partial<MaterialPreset> = {},
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(
    () => {
      const store = useUiPrefsStore.getState()
      store.addMaterialPreset(preset)
      const createdPresetId = useUiPrefsStore.getState().view.materials.selectedPresetId
      useUiPrefsStore.getState().setUsePerPartMaterial(true)
      useUiPrefsStore.getState().assignPartMaterial(partId, createdPresetId)
    },
    {
      targetId: `material-per-part:${partId}:create-assign`,
      targetLabel: 'Material preset assignment',
      ...options,
    },
  )

export const deleteMaterialPresetWithHistory = (
  id: MaterialPresetId,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().deleteMaterialPreset(id), {
    targetId: `material-preset:${id}:delete`,
    targetLabel: 'Material preset',
    ...options,
  })

export const updateMaterialPresetWithHistory = (
  id: MaterialPresetId,
  patch: Partial<MaterialPreset>,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().updateMaterialPreset(id, patch), {
    targetId: `material-preset:${id}:update`,
    targetLabel: 'Material preset properties',
    ...options,
  })

export const updateMaterialPresetsForPartsWithHistory = (
  targets: MultiTargetMaterialPresetPatchTarget[],
  patch: Partial<MaterialPreset>,
  options: MaterialHistoryOptions = {},
): boolean => {
  const uniquePresetIds = Array.from(new Set(targets.map((target) => target.preset.id))).filter(
    (presetId) => presetId.length > 0,
  )
  if (uniquePresetIds.length === 0) {
    return false
  }

  return runMaterialHistoryAction(
    () => {
      uniquePresetIds.forEach((presetId) => {
        useUiPrefsStore.getState().updateMaterialPreset(presetId, patch)
      })
    },
    {
      targetId: `material-preset:batch:${uniquePresetIds.join('|')}:update`,
      targetLabel: 'Selected material objects',
      ...options,
    },
  )
}

export const updateMaterialPresetCopiesForPartsWithHistory = (
  targets: MultiTargetMaterialPresetPatchTarget[],
  patch: Partial<MaterialPreset>,
  options: MaterialHistoryOptions = {},
): boolean => {
  const uniqueTargets = targets.filter(
    (target, index, candidateTargets) =>
      target.partId.length > 0 &&
      candidateTargets.findIndex((candidate) => candidate.partId === target.partId) === index,
  )
  if (uniqueTargets.length === 0) {
    return false
  }

  return runMaterialHistoryAction(
    () => {
      const store = useUiPrefsStore.getState()
      store.setUsePerPartMaterial(true)
      uniqueTargets.forEach((target) => {
        const seed = {
          name: patch.name ?? `${target.preset.name} Multi Edit`,
          color: patch.color ?? target.preset.color,
          metalness: patch.metalness ?? target.preset.metalness,
          roughness: patch.roughness ?? target.preset.roughness,
          emissive: patch.emissive ?? target.preset.emissive,
          emissiveIntensity: patch.emissiveIntensity ?? target.preset.emissiveIntensity,
          opacity: patch.opacity ?? target.preset.opacity,
          transparent: patch.transparent ?? target.preset.transparent,
          doubleSided: patch.doubleSided ?? target.preset.doubleSided,
        }
        useUiPrefsStore.getState().addMaterialPreset(seed)
        const createdPresetId = useUiPrefsStore.getState().view.materials.selectedPresetId
        useUiPrefsStore.getState().assignPartMaterial(target.partId, createdPresetId)
      })
    },
    {
      targetId: `material-per-part:batch:${uniqueTargets
        .map((target) => target.partId)
        .join('|')}:edit-copies`,
      targetLabel: 'Selected material objects',
      ...options,
    },
  )
}

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

export const assignMaterialPresetToPartWithHistory = (
  partId: string,
  presetId: MaterialPresetId,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(
    () => {
      useUiPrefsStore.getState().setUsePerPartMaterial(true)
      useUiPrefsStore.getState().assignPartMaterial(partId, presetId)
    },
    {
      targetId: `material-per-part:${partId}:assign`,
      targetLabel: 'Per-part material assignment',
      ...options,
    },
  )

export const assignMaterialPresetToPartsWithHistory = (
  partIds: string[],
  presetId: MaterialPresetId,
  options: MaterialHistoryOptions = {},
): boolean => {
  const uniquePartIds = Array.from(new Set(partIds)).filter((partId) => partId.length > 0)
  if (uniquePartIds.length === 0) {
    return false
  }

  return runMaterialHistoryAction(
    () => {
      const store = useUiPrefsStore.getState()
      if (!store.view.materials.presets.some((preset) => preset.id === presetId)) {
        return
      }

      store.setUsePerPartMaterial(true)
      uniquePartIds.forEach((partId) => {
        useUiPrefsStore.getState().assignPartMaterial(partId, presetId)
      })
    },
    {
      targetId: `material-per-part:batch:${uniquePartIds.join('|')}:assign`,
      targetLabel: 'Grouped material assignment',
      ...options,
    },
  )
}

export const duplicateMaterialPresetForPartWithHistory = (
  partId: string,
  preset: MaterialPreset,
  options: MaterialHistoryOptions = {},
): boolean =>
  createAndAssignMaterialPresetWithHistory(
    partId,
    {
      name: `${preset.name} Copy`,
      color: preset.color,
      metalness: preset.metalness,
      roughness: preset.roughness,
      emissive: preset.emissive,
      emissiveIntensity: preset.emissiveIntensity,
      opacity: preset.opacity,
      transparent: preset.transparent,
      doubleSided: preset.doubleSided,
    },
    {
      targetId: `material-per-part:${partId}:duplicate-assign`,
      targetLabel: 'Material preset duplicate assignment',
      ...options,
    },
  )

export const clearPartMaterialWithHistory = (
  partId: string,
  options: MaterialHistoryOptions = {},
): boolean =>
  runMaterialHistoryAction(() => useUiPrefsStore.getState().clearPartMaterial(partId), {
    targetId: `material-per-part:${partId}:clear`,
    targetLabel: 'Per-part material assignment',
    ...options,
  })
