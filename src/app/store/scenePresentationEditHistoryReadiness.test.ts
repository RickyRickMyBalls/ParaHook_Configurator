import { beforeEach, describe, expect, it } from 'vitest'
import { resolveCatalogActionPlan } from '../catalog/catalogActionPlan'
import { resolveCatalogEnvironmentApplyRequest } from '../catalog/catalogEnvironmentApply'
import type { CatalogItemRecord } from '../catalog/catalogItemContract'
import {
  DEFAULT_VIEW_SETTINGS,
  createEnvironmentLookSnapshot,
  createHdriEnvironmentSource,
  normalizeViewSettings,
  type GroundMaterialPresetId,
} from '../../shared/viewSettingsTypes'
import { editHistoryStore } from './editHistoryStore'
import { runEnvironmentLookHistoryAction } from './environmentLookEditHistory'
import { selectMaterialPresetWithHistory } from './materialEditHistory'
import {
  applyPersistedUiPrefsView,
  mergePersistedUiPrefsView,
  serializePersistedUiPrefs,
} from './uiPrefsPersistence'
import { useUiPrefsStore } from './uiPrefsStore'
import { setProjectionModeCommand } from '../viewCommands'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'

describe('scene presentation edit-history readiness', () => {
  beforeEach(() => {
    editHistoryStore.clear()
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
  })

  it('keeps environment look state in environment persistence apart from broader view settings', () => {
    const baseView = normalizeViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      projectionMode: 'perspective',
      gridVisible: true,
      wireframe: false,
      ground: {
        enabled: false,
        height: 0,
        materialPresetId: 'matte_mid',
      },
      materials: {
        ...DEFAULT_VIEW_SETTINGS.materials,
        selectedPresetId: 'default_matte',
      },
    })
    const persistedView = normalizeViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      projectionMode: 'orthographic',
      gridVisible: false,
      wireframe: true,
      envPreset: 'studio',
      environmentGrade: {
        ...DEFAULT_VIEW_SETTINGS.environmentGrade,
        exposure: 1.42,
        contrast: 1.2,
      },
      environmentSource: createHdriEnvironmentSource({
        label: 'Docklands 02 2K',
        assetPath: '/HDRI/docklands_02_2k.hdr',
        intensity: 1.35,
        backgroundIntensity: 0.45,
        rotationDeg: 90,
      }),
      lighting: {
        selectedLightId: 'fill',
        lights: DEFAULT_VIEW_SETTINGS.lighting.lights.map((light) => (
          light.id === 'fill' ? { ...light, intensity: 1.75 } : light
        )),
      },
      ground: {
        enabled: true,
        height: 1.25,
        materialPresetId: 'glossy_studio',
      },
      materials: {
        ...DEFAULT_VIEW_SETTINGS.materials,
        selectedPresetId: 'brushed_metal',
      },
    })

    const environmentOnlyView = applyPersistedUiPrefsView(baseView, {
      view: persistedView,
      viewSettingsPersistence: false,
      environmentPersistence: true,
    })

    expect(environmentOnlyView.envPreset).toBe('studio')
    expect(environmentOnlyView.environmentGrade).toEqual(persistedView.environmentGrade)
    expect(environmentOnlyView.environmentSource).toEqual(persistedView.environmentSource)
    expect(environmentOnlyView.lighting).toEqual(persistedView.lighting)
    expect(environmentOnlyView.projectionMode).toBe(baseView.projectionMode)
    expect(environmentOnlyView.gridVisible).toBe(baseView.gridVisible)
    expect(environmentOnlyView.wireframe).toBe(baseView.wireframe)
    expect(environmentOnlyView.ground).toEqual(baseView.ground)
    expect(environmentOnlyView.materials).toEqual(baseView.materials)

    const viewSettingsOnlyView = applyPersistedUiPrefsView(baseView, {
      view: persistedView,
      viewSettingsPersistence: true,
      environmentPersistence: false,
    })

    expect(viewSettingsOnlyView.envPreset).toBe(baseView.envPreset)
    expect(viewSettingsOnlyView.environmentGrade).toEqual(baseView.environmentGrade)
    expect(viewSettingsOnlyView.environmentSource).toEqual(baseView.environmentSource)
    expect(viewSettingsOnlyView.lighting).toEqual(baseView.lighting)
    expect(viewSettingsOnlyView.projectionMode).toBe('orthographic')
    expect(viewSettingsOnlyView.gridVisible).toBe(false)
    expect(viewSettingsOnlyView.wireframe).toBe(true)
    expect(viewSettingsOnlyView.ground).toEqual(persistedView.ground)
    expect(viewSettingsOnlyView.materials).toEqual(persistedView.materials)
  })

  it('serializes and merges environment look through the environment persistence policy only', () => {
    useUiPrefsStore.getState().applyHdriEnvironment({
      label: 'Studio Small 09 2K HDR',
      assetPath: '/HDRI/studio_small_09_2k.hdr',
    })
    useUiPrefsStore.getState().setEnvironmentGrade({
      exposure: 1.36,
      tint: 8,
    })
    useUiPrefsStore.getState().updateLight('key', {
      enabled: false,
      intensity: 2.4,
    })
    useUiPrefsStore.getState().setView({
      projectionMode: 'orthographic',
      gridVisible: false,
      ground: {
        enabled: true,
        height: 2,
        materialPresetId: 'glossy_studio',
      },
    })

    const currentView = useUiPrefsStore.getState().view
    const serialized = serializePersistedUiPrefs(currentView, 'modelViewer', {
      workspaceRestorePersistence: true,
      viewSettingsPersistence: false,
      environmentPersistence: true,
      dashboardPersistence: true,
      notepadPersistence: true,
    })

    expect(serialized.view.envPreset).toBe(currentView.envPreset)
    expect(serialized.view.environmentGrade).toEqual(currentView.environmentGrade)
    expect(serialized.view.environmentSource).toEqual(currentView.environmentSource)
    expect(serialized.view.lighting).toEqual(currentView.lighting)

    const merged = mergePersistedUiPrefsView(currentView, DEFAULT_VIEW_SETTINGS, {
      viewSettingsPersistence: false,
      environmentPersistence: true,
    })

    expect(merged.environmentSource).toEqual(currentView.environmentSource)
    expect(merged.environmentGrade).toEqual(currentView.environmentGrade)
    expect(merged.lighting).toEqual(currentView.lighting)
    expect(merged.projectionMode).toBe(DEFAULT_VIEW_SETTINGS.projectionMode)
    expect(merged.gridVisible).toBe(DEFAULT_VIEW_SETTINGS.gridVisible)
    expect(merged.ground).toEqual(DEFAULT_VIEW_SETTINGS.ground)
    expect(merged.materials).toEqual(DEFAULT_VIEW_SETTINGS.materials)
  })

  it('keeps raw environment actions history-free and preserves redo until wrappers exist', () => {
    const redoEntry = {
      entryId: 'readiness-redo-entry',
      label: 'Readiness redo entry',
      source: {
        surface: 'readiness-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    }
    editHistoryStore.commitEntry(redoEntry)
    expect(editHistoryStore.undo()?.entryId).toBe(redoEntry.entryId)
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])

    useUiPrefsStore.getState().applyEnvironmentPreset('studio')
    useUiPrefsStore.getState().applyHdriEnvironment({
      label: 'Docklands 02 2K',
      assetPath: '/HDRI/docklands_02_2k.hdr',
    })
    useUiPrefsStore.getState().setEnvironmentGrade({
      exposure: 1.25,
      contrast: 1.15,
      saturation: 1.1,
    })
    useUiPrefsStore.getState().setHdriEnvironmentBackgroundVisible(false)
    useUiPrefsStore.getState().setHdriEnvironmentIntensity(1.85)
    useUiPrefsStore.getState().setHdriEnvironmentBackgroundIntensity(0.65)
    useUiPrefsStore.getState().setHdriEnvironmentRotation(45)
    useUiPrefsStore.getState().updateLight('key', {
      enabled: false,
      intensity: 2.2,
    })

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('keeps raw material actions history-free and preserves redo until wrappers exist', () => {
    const redoEntry = {
      entryId: 'readiness-material-redo-entry',
      label: 'Readiness material redo entry',
      source: {
        surface: 'readiness-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    }
    editHistoryStore.commitEntry(redoEntry)
    expect(editHistoryStore.undo()?.entryId).toBe(redoEntry.entryId)
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])

    const initialLook = createEnvironmentLookSnapshot(useUiPrefsStore.getState().view)

    useUiPrefsStore.getState().selectMaterialPreset('brushed_metal')
    useUiPrefsStore.getState().updateMaterialPreset('brushed_metal', {
      name: 'Proof Brushed Metal',
      color: '#aabbcc',
      metalness: 0.72,
      roughness: 0.18,
      transparent: true,
    })
    useUiPrefsStore.getState().addMaterialPreset({
      name: 'Proof Preset',
      color: '#445566',
    })
    const addedPresetId = useUiPrefsStore.getState().view.materials.selectedPresetId
    useUiPrefsStore.getState().setUsePerPartMaterial(true)
    useUiPrefsStore.getState().assignPartMaterial('part:proof-wheel', addedPresetId)
    useUiPrefsStore.getState().clearPartMaterial('part:proof-wheel')
    useUiPrefsStore.getState().deleteMaterialPreset(addedPresetId)

    expect(createEnvironmentLookSnapshot(useUiPrefsStore.getState().view)).toEqual(initialLook)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('keeps raw ground settings history-free under view settings persistence', () => {
    const redoEntry = {
      entryId: 'readiness-ground-redo-entry',
      label: 'Readiness ground redo entry',
      source: {
        surface: 'readiness-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    }
    editHistoryStore.commitEntry(redoEntry)
    expect(editHistoryStore.undo()?.entryId).toBe(redoEntry.entryId)

    const groundMaterialIds = [
      'matte_dark',
      'matte_mid',
      'glossy_studio',
    ] satisfies GroundMaterialPresetId[]
    const editableMaterialIds = DEFAULT_VIEW_SETTINGS.materials.presets.map((preset) => preset.id)
    expect(groundMaterialIds.some((id) => editableMaterialIds.includes(id))).toBe(false)

    useUiPrefsStore.getState().setView({
      materials: {
        presets: [DEFAULT_VIEW_SETTINGS.materials.presets[0]],
        selectedPresetId: DEFAULT_VIEW_SETTINGS.materials.presets[0].id,
        usePerPart: false,
        perPart: {},
      },
      ground: {
        enabled: true,
        height: 2.5,
        materialPresetId: 'glossy_studio',
      },
    })
    useUiPrefsStore.getState().setView({
      ground: {
        enabled: true,
        height: -1,
        materialPresetId: 'matte_dark',
      },
    })

    expect(useUiPrefsStore.getState().view.ground).toEqual({
      enabled: true,
      height: -1,
      materialPresetId: 'matte_dark',
    })
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.some((preset) => preset.id === 'matte_dark'),
    ).toBe(false)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])
    expect(editHistoryStore.canRedo()).toBe(true)

    const serializedView = serializePersistedUiPrefs(useUiPrefsStore.getState().view, 'modelViewer', {
      workspaceRestorePersistence: true,
      viewSettingsPersistence: true,
      environmentPersistence: false,
      dashboardPersistence: true,
      notepadPersistence: true,
    }).view
    expect(serializedView.ground).toEqual(useUiPrefsStore.getState().view.ground)

    const environmentOnlyView = applyPersistedUiPrefsView(DEFAULT_VIEW_SETTINGS, {
      view: useUiPrefsStore.getState().view,
      viewSettingsPersistence: false,
      environmentPersistence: true,
    })
    expect(environmentOnlyView.ground).toEqual(DEFAULT_VIEW_SETTINGS.ground)
  })

  it('keeps raw global display preference writes history-free and separated from environment look', () => {
    const redoEntry = {
      entryId: 'readiness-display-redo-entry',
      label: 'Readiness display redo entry',
      source: {
        surface: 'readiness-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    }
    editHistoryStore.commitEntry(redoEntry)
    expect(editHistoryStore.undo()?.entryId).toBe(redoEntry.entryId)
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])

    const initialLook = createEnvironmentLookSnapshot(useUiPrefsStore.getState().view)

    useUiPrefsStore.getState().setViewKey('gridVisible', false)
    useUiPrefsStore.getState().setViewKey('wireframe', true)
    useUiPrefsStore.getState().setViewKey('axesVisible', true)
    useUiPrefsStore.getState().setViewKey('shadowsEnabled', false)
    useUiPrefsStore.getState().setView({
      axisOverlayStyle: {
        ...useUiPrefsStore.getState().view.axisOverlayStyle,
        labelsVisible: false,
        backgroundMode: 'none',
        labelSize: 'large',
        mainLineOpacity: 0.42,
      },
    })

    expect(useUiPrefsStore.getState().view.gridVisible).toBe(false)
    expect(useUiPrefsStore.getState().view.wireframe).toBe(true)
    expect(useUiPrefsStore.getState().view.axesVisible).toBe(true)
    expect(useUiPrefsStore.getState().view.shadowsEnabled).toBe(false)
    expect(useUiPrefsStore.getState().view.axisOverlayStyle).toMatchObject({
      labelsVisible: false,
      backgroundMode: 'none',
      labelSize: 'large',
      mainLineOpacity: 0.42,
    })
    expect(createEnvironmentLookSnapshot(useUiPrefsStore.getState().view)).toEqual(initialLook)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('keeps projection mode split between global view settings and viewport-local workspace state', () => {
    const redoEntry = {
      entryId: 'readiness-projection-redo-entry',
      label: 'Readiness projection redo entry',
      source: {
        surface: 'readiness-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    }
    editHistoryStore.commitEntry(redoEntry)
    expect(editHistoryStore.undo()?.entryId).toBe(redoEntry.entryId)

    const localViewBeforeGlobalProjection = structuredClone(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState,
    )
    setProjectionModeCommand('orthographic')

    expect(useUiPrefsStore.getState().view.projectionMode).toBe('orthographic')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState,
    ).toEqual(localViewBeforeGlobalProjection)

    setProjectionModeCommand('perspective')
    setProjectionModeCommand('orthographic', 'model-viewer-primary')

    expect(useUiPrefsStore.getState().view.projectionMode).toBe('perspective')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .projectionMode,
    ).toBe('orthographic')
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('keeps axis overlay enabled split between global view settings and viewport-local workspace state', () => {
    const redoEntry = {
      entryId: 'readiness-axis-overlay-redo-entry',
      label: 'Readiness axis overlay redo entry',
      source: {
        surface: 'readiness-test',
      },
      undo: () => undefined,
      redo: () => undefined,
    }
    editHistoryStore.commitEntry(redoEntry)
    expect(editHistoryStore.undo()?.entryId).toBe(redoEntry.entryId)

    const localViewBeforeGlobalAxisOverlay = structuredClone(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState,
    )
    useUiPrefsStore.getState().setViewKey('axisOverlayEnabled', false)

    expect(useUiPrefsStore.getState().view.axisOverlayEnabled).toBe(false)
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState,
    ).toEqual(localViewBeforeGlobalAxisOverlay)

    useUiPrefsStore.getState().setViewKey('axisOverlayEnabled', true)
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      axisOverlayEnabled: false,
    })

    expect(useUiPrefsStore.getState().view.axisOverlayEnabled).toBe(true)
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .axisOverlayEnabled,
    ).toBe(false)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      redoEntry.entryId,
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('keeps ground outside environment-look and material-only history restores', () => {
    expect(
      runEnvironmentLookHistoryAction(() => useUiPrefsStore.getState().applyEnvironmentPreset('studio'), {
        entryId: 'readiness-ground-environment-test',
        targetId: 'environment-preset',
        targetLabel: 'Environment preset',
      }),
    ).toBe(true)

    const groundAfterEnvironmentCommit = {
      enabled: true,
      height: 3.5,
      materialPresetId: 'glossy_studio' as const,
    }
    useUiPrefsStore.getState().setView({
      ground: groundAfterEnvironmentCommit,
    })

    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.envPreset).toBe(DEFAULT_VIEW_SETTINGS.envPreset)
    expect(useUiPrefsStore.getState().view.ground).toEqual(groundAfterEnvironmentCommit)

    editHistoryStore.redo()
    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')
    expect(useUiPrefsStore.getState().view.ground).toEqual(groundAfterEnvironmentCommit)

    editHistoryStore.clear()
    expect(
      selectMaterialPresetWithHistory('brushed_metal', {
        entryId: 'readiness-ground-material-test',
      }),
    ).toBe(true)

    const groundAfterMaterialCommit = {
      enabled: false,
      height: -2,
      materialPresetId: 'matte_dark' as const,
    }
    useUiPrefsStore.getState().setView({
      ground: groundAfterMaterialCommit,
    })

    editHistoryStore.undo()
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe(
      DEFAULT_VIEW_SETTINGS.materials.selectedPresetId,
    )
    expect(useUiPrefsStore.getState().view.ground).toEqual(groundAfterMaterialCommit)

    editHistoryStore.redo()
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('brushed_metal')
    expect(useUiPrefsStore.getState().view.ground).toEqual(groundAfterMaterialCommit)
  })

  it('keeps Catalog environment apply as a viewer-environment handoff instead of Browser project content', () => {
    const item: CatalogItemRecord = {
      itemId: 'environment:docklands-02-2k-hdr',
      label: 'Docklands 02 2K',
      familyKey: 'environments',
      sectionKey: 'hdris',
      tags: ['environment', 'hdri', 'hdr'],
      description: 'Repo-backed HDRI for Catalog browse.',
      assetKind: 'environment',
      actionKind: 'apply-environment',
      source: {
        sourceKind: 'repo',
        assetPath: 'HDRI/docklands_02_2k.hdr',
      },
      previewMedia: [],
    }

    const actionPlan = resolveCatalogActionPlan(item)
    const request = resolveCatalogEnvironmentApplyRequest(item, actionPlan)

    expect(actionPlan).toMatchObject({
      actionFamily: 'environment',
      downstreamOwner: 'viewer-environment',
      previewOwner: null,
    })
    expect(request).toEqual({
      downstreamOwner: 'viewer-environment',
      label: 'Docklands 02 2K',
      assetPath: expect.stringMatching(/\/HDRI\/docklands_02_2k\.hdr$/),
      fileType: 'hdr',
    })
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })
})
