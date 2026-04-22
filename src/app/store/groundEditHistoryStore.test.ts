import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'
import { editHistoryStore } from './editHistoryStore'
import {
  setGroundEnabledWithHistory,
  setGroundHeightWithHistory,
  setGroundMaterialPresetWithHistory,
} from './groundEditHistory'
import { useUiPrefsStore } from './uiPrefsStore'

const resetStores = () => {
  editHistoryStore.clear()
  useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
}

describe('ground edit history', () => {
  beforeEach(() => {
    resetStores()
  })

  it('commits one undoable entry for ground visibility', () => {
    expect(
      setGroundEnabledWithHistory(true, {
        entryId: 'ground-enabled-test',
      }),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'ground-enabled-test',
        label: 'Change ground setting',
        source: {
          surface: 'viewer-ground',
          sourceId: 'ground',
          sourceLabel: 'Ground',
        },
        targetId: 'ground:enabled',
        targetLabel: 'Ground visibility',
      },
    ])
    expect(useUiPrefsStore.getState().view.ground.enabled).toBe(true)

    expect(editHistoryStore.undo()?.entryId).toBe('ground-enabled-test')
    expect(useUiPrefsStore.getState().view.ground).toEqual(DEFAULT_VIEW_SETTINGS.ground)

    expect(editHistoryStore.redo()?.entryId).toBe('ground-enabled-test')
    expect(useUiPrefsStore.getState().view.ground.enabled).toBe(true)
  })

  it('commits material preset and height changes without capturing other view state', () => {
    useUiPrefsStore.getState().applyEnvironmentPreset('studio')
    useUiPrefsStore.getState().setView({
      projectionMode: 'orthographic',
      gridVisible: false,
      wireframe: true,
      materials: {
        ...DEFAULT_VIEW_SETTINGS.materials,
        selectedPresetId: 'brushed_metal',
      },
    })

    expect(
      setGroundMaterialPresetWithHistory('glossy_studio', {
        entryId: 'ground-material-test',
      }),
    ).toBe(true)
    expect(
      setGroundHeightWithHistory(2.5, {
        entryId: 'ground-height-test',
      }),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'ground-material-test',
        targetId: 'ground:material',
        targetLabel: 'Ground material',
      },
      {
        entryId: 'ground-height-test',
        targetId: 'ground:height',
        targetLabel: 'Ground height',
      },
    ])
    expect(useUiPrefsStore.getState().view.ground).toEqual({
      enabled: false,
      height: 2.5,
      materialPresetId: 'glossy_studio',
    })

    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.ground).toEqual({
      enabled: false,
      height: 0,
      materialPresetId: 'glossy_studio',
    })
    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.ground).toEqual(DEFAULT_VIEW_SETTINGS.ground)

    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')
    expect(useUiPrefsStore.getState().view.projectionMode).toBe('orthographic')
    expect(useUiPrefsStore.getState().view.gridVisible).toBe(false)
    expect(useUiPrefsStore.getState().view.wireframe).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('brushed_metal')
  })

  it('keeps no-op ground commits out of history and preserves redo', () => {
    editHistoryStore.commitEntry({
      entryId: 'ground-redo-sentinel',
      label: 'Redo sentinel',
      source: {
        surface: 'ground-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    })
    expect(editHistoryStore.undo()?.entryId).toBe('ground-redo-sentinel')

    expect(setGroundEnabledWithHistory(DEFAULT_VIEW_SETTINGS.ground.enabled)).toBe(false)
    expect(
      setGroundMaterialPresetWithHistory(DEFAULT_VIEW_SETTINGS.ground.materialPresetId),
    ).toBe(false)
    expect(setGroundHeightWithHistory(DEFAULT_VIEW_SETTINGS.ground.height)).toBe(false)

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'ground-redo-sentinel',
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('keeps raw setView ground updates history-free', () => {
    useUiPrefsStore.getState().setView({
      ground: {
        enabled: true,
        height: -1.5,
        materialPresetId: 'matte_dark',
      },
    })

    expect(useUiPrefsStore.getState().view.ground).toEqual({
      enabled: true,
      height: -1.5,
      materialPresetId: 'matte_dark',
    })
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })
})
