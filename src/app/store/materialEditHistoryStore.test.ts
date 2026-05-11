import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'
import { editHistoryStore } from './editHistoryStore'
import {
  addMaterialPresetWithHistory,
  assignMaterialPresetToPartsWithHistory,
  assignMaterialPresetToPartWithHistory,
  assignPartMaterialWithHistory,
  clearPartMaterialWithHistory,
  createAndAssignMaterialPresetWithHistory,
  deleteMaterialPresetWithHistory,
  duplicateMaterialPresetForPartWithHistory,
  selectMaterialPresetWithHistory,
  setMaterialPresetTransparentWithHistory,
  setUsePerPartMaterialWithHistory,
  updateMaterialPresetWithHistory,
} from './materialEditHistory'
import { useUiPrefsStore } from './uiPrefsStore'

const resetStores = () => {
  vi.restoreAllMocks()
  editHistoryStore.clear()
  useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
}

describe('material edit history', () => {
  beforeEach(() => {
    resetStores()
  })

  it('commits one undoable entry for material preset selection', () => {
    expect(
      selectMaterialPresetWithHistory('brushed_metal', {
        entryId: 'material-select-test',
      }),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'material-select-test',
        label: 'Change material',
        source: {
          surface: 'viewer-material',
          sourceId: 'materials',
          sourceLabel: 'Materials',
        },
        targetId: 'material-preset:brushed_metal:select',
        targetLabel: 'Material preset selection',
      },
    ])
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('brushed_metal')

    expect(editHistoryStore.undo()?.entryId).toBe('material-select-test')
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe(
      DEFAULT_VIEW_SETTINGS.materials.selectedPresetId,
    )

    expect(editHistoryStore.redo()?.entryId).toBe('material-select-test')
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('brushed_metal')
  })

  it('preserves generated material ids across add undo and redo', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000)

    expect(
      addMaterialPresetWithHistory({
        entryId: 'material-add-test',
      }),
    ).toBe(true)

    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('mat_1700000000000')
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.some((preset) => preset.id === 'mat_1700000000000'),
    ).toBe(true)

    editHistoryStore.undo()
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.some((preset) => preset.id === 'mat_1700000000000'),
    ).toBe(false)
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe(
      DEFAULT_VIEW_SETTINGS.materials.selectedPresetId,
    )

    vi.spyOn(Date, 'now').mockReturnValue(1800000000000)
    editHistoryStore.redo()
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('mat_1700000000000')
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.some((preset) => preset.id === 'mat_1800000000000'),
    ).toBe(false)
  })

  it('creates and assigns a real material preset to one part in a single history entry', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000)

    expect(
      createAndAssignMaterialPresetWithHistory(
        'part:door',
        {
          name: 'New Material',
          color: '#224466',
        },
        {
          entryId: 'material-create-assign-test',
        },
      ),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'material-create-assign-test',
        targetId: 'material-per-part:part:door:create-assign',
      },
    ])
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('mat_1700000000000')
    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'mat_1700000000000',
    })

    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({})
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.some((preset) => preset.id === 'mat_1700000000000'),
    ).toBe(false)
  })

  it('assigns and duplicates presets for a part through selected-target helpers', () => {
    expect(
      assignMaterialPresetToPartWithHistory('part:door', 'brushed_metal', {
        entryId: 'material-assign-target-test',
      }),
    ).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'brushed_metal',
    })

    vi.spyOn(Date, 'now').mockReturnValue(1800000000000)
    const brushedMetal = useUiPrefsStore
      .getState()
      .view.materials.presets.find((preset) => preset.id === 'brushed_metal')
    expect(brushedMetal).not.toBeUndefined()

    expect(
      duplicateMaterialPresetForPartWithHistory('part:door', brushedMetal!, {
        entryId: 'material-duplicate-target-test',
      }),
    ).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('mat_1800000000000')
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === 'mat_1800000000000'),
    ).toMatchObject({
      name: 'Brushed Metal Copy',
      color: brushedMetal?.color,
      metalness: brushedMetal?.metalness,
      roughness: brushedMetal?.roughness,
      doubleSided: brushedMetal?.doubleSided,
    })
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'mat_1800000000000',
    })
  })

  it('assigns one preset to multiple parts through one undoable grouped history entry', () => {
    useUiPrefsStore.getState().setUsePerPartMaterial(true)
    useUiPrefsStore.getState().assignPartMaterial('part:door', 'default_matte')
    useUiPrefsStore.getState().assignPartMaterial('part:trim', 'highlight_gloss')
    editHistoryStore.clear()

    expect(
      assignMaterialPresetToPartsWithHistory(
        ['part:door', 'part:trim', 'part:door', 'part:handle'],
        'brushed_metal',
        {
          entryId: 'material-group-assign-test',
        },
      ),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'material-group-assign-test',
        targetLabel: 'Grouped material assignment',
      },
    ])
    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'brushed_metal',
      'part:trim': 'brushed_metal',
      'part:handle': 'brushed_metal',
    })

    expect(editHistoryStore.undo()?.entryId).toBe('material-group-assign-test')
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'default_matte',
      'part:trim': 'highlight_gloss',
    })

    expect(editHistoryStore.redo()?.entryId).toBe('material-group-assign-test')
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'brushed_metal',
      'part:trim': 'brushed_metal',
      'part:handle': 'brushed_metal',
    })
  })

  it('restores selected fallback and per-part cleanup across delete undo and redo', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000)
    addMaterialPresetWithHistory()
    useUiPrefsStore.getState().setUsePerPartMaterial(true)
    useUiPrefsStore.getState().assignPartMaterial('part:door', 'mat_1700000000000')
    editHistoryStore.clear()

    expect(
      deleteMaterialPresetWithHistory('mat_1700000000000', {
        entryId: 'material-delete-test',
      }),
    ).toBe(true)

    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('default_matte')
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({})

    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('mat_1700000000000')
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'mat_1700000000000',
    })

    editHistoryStore.redo()
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('default_matte')
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({})
  })

  it('commits transparent and per-part material changes without capturing environment or view state', () => {
    useUiPrefsStore.getState().applyEnvironmentPreset('studio')
    useUiPrefsStore.getState().setView({
      projectionMode: 'orthographic',
      gridVisible: false,
      wireframe: true,
      ground: {
        enabled: true,
        height: 1.5,
        materialPresetId: 'glossy_studio',
      },
    })

    expect(
      setMaterialPresetTransparentWithHistory('default_matte', true, {
        entryId: 'material-transparent-test',
      }),
    ).toBe(true)
    expect(setUsePerPartMaterialWithHistory(true)).toBe(true)
    expect(assignPartMaterialWithHistory('part:door', 'brushed_metal')).toBe(true)
    expect(clearPartMaterialWithHistory('part:door')).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toHaveLength(4)
    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'brushed_metal',
    })
    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({})
    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(false)
    editHistoryStore.undo()
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === 'default_matte'),
    ).toMatchObject({
      transparent: false,
    })

    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')
    expect(useUiPrefsStore.getState().view.projectionMode).toBe('orthographic')
    expect(useUiPrefsStore.getState().view.gridVisible).toBe(false)
    expect(useUiPrefsStore.getState().view.wireframe).toBe(true)
    expect(useUiPrefsStore.getState().view.ground).toEqual({
      enabled: true,
      height: 1.5,
      materialPresetId: 'glossy_studio',
    })
  })

  it('commits material preset property patches as undoable material-only entries', () => {
    expect(
      updateMaterialPresetWithHistory(
        'default_matte',
        {
          name: 'Phase 1 Matte',
          color: '#abcdef',
          metalness: 0.32,
          roughness: 0.44,
          opacity: 0.72,
          emissive: '#101112',
          emissiveIntensity: 0.18,
          transparent: true,
          doubleSided: false,
        },
        {
          entryId: 'material-update-test',
        },
      ),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'material-update-test',
        targetId: 'material-preset:default_matte:update',
        targetLabel: 'Material preset properties',
      },
    ])
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === 'default_matte'),
    ).toMatchObject({
      name: 'Phase 1 Matte',
      color: '#abcdef',
      metalness: 0.32,
      roughness: 0.44,
      opacity: 0.72,
      emissive: '#101112',
      emissiveIntensity: 0.18,
      transparent: true,
      doubleSided: false,
    })

    expect(editHistoryStore.undo()?.entryId).toBe('material-update-test')
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === 'default_matte'),
    ).toMatchObject(DEFAULT_VIEW_SETTINGS.materials.presets[0])
  })

  it('keeps no-op material commits out of history and preserves redo', () => {
    editHistoryStore.commitEntry({
      entryId: 'material-redo-sentinel',
      label: 'Redo sentinel',
      source: {
        surface: 'material-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    })
    expect(editHistoryStore.undo()?.entryId).toBe('material-redo-sentinel')

    expect(selectMaterialPresetWithHistory(DEFAULT_VIEW_SETTINGS.materials.selectedPresetId)).toBe(
      false,
    )
    expect(setMaterialPresetTransparentWithHistory('default_matte', false)).toBe(false)
    expect(setUsePerPartMaterialWithHistory(false)).toBe(false)
    expect(assignPartMaterialWithHistory('part:door', 'missing_preset')).toBe(false)
    expect(assignMaterialPresetToPartsWithHistory(['part:door'], 'missing_preset')).toBe(false)
    expect(assignMaterialPresetToPartsWithHistory([], 'brushed_metal')).toBe(false)
    expect(clearPartMaterialWithHistory('part:door')).toBe(false)

    useUiPrefsStore.getState().setView({
      materials: {
        presets: [DEFAULT_VIEW_SETTINGS.materials.presets[0]],
        selectedPresetId: DEFAULT_VIEW_SETTINGS.materials.presets[0].id,
        usePerPart: false,
        perPart: {},
      },
    })
    expect(deleteMaterialPresetWithHistory(DEFAULT_VIEW_SETTINGS.materials.presets[0].id)).toBe(
      false,
    )

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'material-redo-sentinel',
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })
})
