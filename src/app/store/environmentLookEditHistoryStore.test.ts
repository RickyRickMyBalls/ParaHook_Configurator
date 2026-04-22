import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_VIEW_SETTINGS,
  createEnvironmentLookSnapshot,
} from '../../shared/viewSettingsTypes'
import { editHistoryStore } from './editHistoryStore'
import {
  captureEnvironmentLookHistorySnapshot,
  commitEnvironmentLookHistory,
  runEnvironmentLookHistoryAction,
} from './environmentLookEditHistory'
import { useUiPrefsStore } from './uiPrefsStore'

const resetStores = () => {
  editHistoryStore.clear()
  useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
}

describe('environment look edit history', () => {
  beforeEach(() => {
    resetStores()
  })

  it('commits one undoable environment look entry for preset changes', () => {
    const committed = runEnvironmentLookHistoryAction(
      () => useUiPrefsStore.getState().applyEnvironmentPreset('studio'),
      {
        entryId: 'environment-look-preset-test',
        targetId: 'environment-preset',
        targetLabel: 'Environment preset',
      },
    )

    expect(committed).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'environment-look-preset-test',
        label: 'Change environment look',
        source: {
          surface: 'viewer-environment',
          sourceId: 'environment-look',
          sourceLabel: 'Environment Look',
        },
        targetId: 'environment-preset',
        targetLabel: 'Environment preset',
      },
    ])
    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')

    expect(editHistoryStore.undo()?.entryId).toBe('environment-look-preset-test')
    expect(useUiPrefsStore.getState().view.envPreset).toBe(DEFAULT_VIEW_SETTINGS.envPreset)

    expect(editHistoryStore.redo()?.entryId).toBe('environment-look-preset-test')
    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')
  })

  it('collapses live grade updates into one committed entry at interaction end', () => {
    const beforeSnapshot = captureEnvironmentLookHistorySnapshot()

    useUiPrefsStore.getState().setEnvironmentGrade({ exposure: 1.5 })
    useUiPrefsStore.getState().setEnvironmentGrade({ exposure: 1.75 })
    useUiPrefsStore.getState().setEnvironmentGrade({ contrast: 1.2 })

    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(
      commitEnvironmentLookHistory(beforeSnapshot, {
        entryId: 'environment-look-grade-test',
        targetId: 'environment-grade:exposure',
        targetLabel: 'Exposure',
      }),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(useUiPrefsStore.getState().view.environmentGrade).toMatchObject({
      exposure: 1.75,
      contrast: 1.2,
    })

    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.environmentGrade).toEqual(
      DEFAULT_VIEW_SETTINGS.environmentGrade,
    )

    editHistoryStore.redo()
    expect(useUiPrefsStore.getState().view.environmentGrade).toMatchObject({
      exposure: 1.75,
      contrast: 1.2,
    })
  })

  it('keeps no-op commits out of history and preserves redo', () => {
    editHistoryStore.commitEntry({
      entryId: 'environment-look-redo-sentinel',
      label: 'Redo sentinel',
      source: {
        surface: 'environment-look-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    })
    expect(editHistoryStore.undo()?.entryId).toBe('environment-look-redo-sentinel')
    expect(editHistoryStore.getRedoEntries()).toHaveLength(1)

    expect(
      runEnvironmentLookHistoryAction(
        () => useUiPrefsStore.getState().applyEnvironmentPreset(DEFAULT_VIEW_SETTINGS.envPreset),
        {
          entryId: 'environment-look-noop-test',
          targetId: 'environment-preset',
          targetLabel: 'Environment preset',
        },
      ),
    ).toBe(false)

    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'environment-look-redo-sentinel',
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('restores only environment look fields and preserves broader view workflow state', () => {
    runEnvironmentLookHistoryAction(
      () => {
        useUiPrefsStore.getState().applyHdriEnvironment({
          label: 'Studio Small 09 2K HDR',
          assetPath: '/HDRI/studio_small_09_2k.hdr',
        })
        useUiPrefsStore.getState().setEnvironmentGrade({ exposure: 1.6 })
      },
      {
        entryId: 'environment-look-hdri-test',
        targetId: 'environment-source:catalog',
        targetLabel: 'Studio Small 09 2K HDR',
      },
    )

    useUiPrefsStore.getState().setView({
      projectionMode: 'orthographic',
      gridVisible: false,
      wireframe: true,
      ground: {
        enabled: true,
        height: 2,
        materialPresetId: 'glossy_studio',
      },
    })
    useUiPrefsStore.getState().captureEnvironmentLook()
    const capturedLook = useUiPrefsStore.getState().capturedEnvironmentLook

    editHistoryStore.undo()
    const afterUndo = useUiPrefsStore.getState()
    expect(afterUndo.view.environmentSource).toEqual(DEFAULT_VIEW_SETTINGS.environmentSource)
    expect(afterUndo.view.environmentGrade).toEqual(DEFAULT_VIEW_SETTINGS.environmentGrade)
    expect(afterUndo.view.projectionMode).toBe('orthographic')
    expect(afterUndo.view.gridVisible).toBe(false)
    expect(afterUndo.view.wireframe).toBe(true)
    expect(afterUndo.view.ground).toEqual({
      enabled: true,
      height: 2,
      materialPresetId: 'glossy_studio',
    })
    expect(afterUndo.capturedEnvironmentLook).toEqual(capturedLook)
  })

  it('undoes and redoes lighting commits without capturing material state', () => {
    const beforeSnapshot = captureEnvironmentLookHistorySnapshot()
    useUiPrefsStore.getState().updateLight('key', {
      enabled: false,
      intensity: 2.4,
    })
    expect(
      commitEnvironmentLookHistory(beforeSnapshot, {
        entryId: 'environment-look-light-test',
        targetId: 'environment-light:key',
        targetLabel: 'Environment light',
      }),
    ).toBe(true)

    useUiPrefsStore.getState().setUsePerPartMaterial(true)
    editHistoryStore.undo()
    expect(
      useUiPrefsStore.getState().view.lighting.lights.find((light) => light.id === 'key'),
    ).toMatchObject({
      enabled: true,
      intensity: DEFAULT_VIEW_SETTINGS.lighting.lights.find((light) => light.id === 'key')
        ?.intensity,
    })
    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)

    editHistoryStore.redo()
    expect(
      useUiPrefsStore.getState().view.lighting.lights.find((light) => light.id === 'key'),
    ).toMatchObject({
      enabled: false,
      intensity: 2.4,
    })
    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)
  })

  it('keeps raw setters history-free before explicit wrapper commits', () => {
    useUiPrefsStore.getState().applyHdriEnvironment({
      label: 'Docklands 02 2K',
      assetPath: '/HDRI/docklands_02_2k.hdr',
    })
    useUiPrefsStore.getState().setHdriEnvironmentBackgroundVisible(false)
    useUiPrefsStore.getState().setHdriEnvironmentIntensity(1.8)
    useUiPrefsStore.getState().updateLight('fill', {
      enabled: false,
    })

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(createEnvironmentLookSnapshot(useUiPrefsStore.getState().view)).toMatchObject({
      environmentSource: expect.objectContaining({
        kind: 'hdri',
        label: 'Docklands 02 2K',
        assetPath: '/HDRI/docklands_02_2k.hdr',
        backgroundVisible: false,
        intensity: 1.8,
      }),
    })
  })
})
