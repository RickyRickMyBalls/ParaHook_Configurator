// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { readPersistedUiPrefs, uiPrefsStorageKey } from './uiPrefsPersistence'
import { useUiPrefsStore } from './uiPrefsStore'
import { useUiPrefsPersistenceBridge } from './useUiPrefsPersistenceBridge'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

function UiPrefsPersistenceBridgeHarness() {
  useUiPrefsPersistenceBridge()
  return null
}

describe('useUiPrefsPersistenceBridge', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    window.localStorage.clear()
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
  })

  it('hydrates older saved environment views without a nested grade seam and rewrites them normalized', async () => {
    window.localStorage.setItem(
      uiPrefsStorageKey,
      JSON.stringify({
        envPreset: 'studio',
        toneMapping: 'aces',
        exposure: 0.72,
        environmentSource: {
          kind: 'hdri',
          label: 'Workshop Loft',
          assetPath: '/HDRI/workshop_loft.hdr',
          backgroundVisible: false,
          intensity: 1.35,
          backgroundIntensity: 0.45,
          rotationDeg: 90,
        },
      }),
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<UiPrefsPersistenceBridgeHarness />)
    })

    expect(useUiPrefsStore.getState().view.environmentGrade).toEqual({
      toneMapping: 'aces',
      exposure: 0.72,
      contrast: 1,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      temperature: 0,
      tint: 0,
      saturation: 1,
    })
    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'hdri',
      label: 'Workshop Loft',
      assetPath: '/HDRI/workshop_loft.hdr',
      backgroundVisible: false,
      intensity: 1.35,
      backgroundIntensity: 0.45,
      rotationDeg: 90,
    })
    expect(useUiPrefsStore.getState().workspaceStartupSurface).toBe('homePage')
    expect(useUiPrefsStore.getState().workspacePaneFilletRadiusPx).toBe(12)
    expect(useUiPrefsStore.getState().workspacePanelShellPaddingPx).toBe(0)
    expect(useUiPrefsStore.getState().workspaceNestedResizeKeepsFarPane).toBe(true)

    const persistedAfterHydration = readPersistedUiPrefs()
    expect(persistedAfterHydration).toEqual({
      version: 3,
      workspaceStartupSurface: 'homePage',
      workspacePaneFilletRadiusPx: 12,
      workspacePanelShellPaddingPx: 0,
      workspaceNestedResizeKeepsFarPane: true,
      spaghettiWindowAppearanceDefaults: expect.any(Object),
      workspaceRestorePersistence: true,
      viewSettingsPersistence: true,
      environmentPersistence: true,
      dashboardPersistence: true,
      notepadPersistence: true,
      view: expect.objectContaining({
        envPreset: 'studio',
        environmentGrade: {
          toneMapping: 'aces',
          exposure: 0.72,
          contrast: 1,
          highlights: 0,
          shadows: 0,
          whites: 0,
          blacks: 0,
          temperature: 0,
          tint: 0,
          saturation: 1,
        },
        environmentSource: expect.objectContaining({
          kind: 'hdri',
          label: 'Workshop Loft',
        }),
      }),
    })

    await act(async () => {
      useUiPrefsStore.getState().setEnvironmentGrade({
        contrast: 1.2,
        saturation: 1.1,
      })
    })

    const persistedAfterEdit = readPersistedUiPrefs()
    expect(persistedAfterEdit?.view.environmentGrade).toEqual({
      toneMapping: 'aces',
      exposure: 0.72,
      contrast: 1.2,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      temperature: 0,
      tint: 0,
      saturation: 1.1,
    })
    expect(persistedAfterEdit?.view.environmentSource).toMatchObject({
      kind: 'hdri',
      label: 'Workshop Loft',
      assetPath: '/HDRI/workshop_loft.hdr',
    })
    expect(JSON.parse(window.localStorage.getItem(uiPrefsStorageKey) ?? 'null')).toEqual(
      expect.objectContaining({
        version: 3,
        workspaceStartupSurface: 'homePage',
        workspacePaneFilletRadiusPx: 12,
        workspacePanelShellPaddingPx: 0,
        workspaceNestedResizeKeepsFarPane: true,
        workspaceRestorePersistence: true,
        viewSettingsPersistence: true,
        environmentPersistence: true,
        dashboardPersistence: true,
        notepadPersistence: true,
      }),
    )
  })

  it('hydrates workspace settings and environment settings through separate persistence policies', async () => {
    const persistedView = structuredClone(useUiPrefsStore.getState().view)
    persistedView.projectionMode = 'orthographic'
    persistedView.gridVisible = false
    persistedView.axesVisible = true
    persistedView.envPreset = 'studio'
    persistedView.environmentGrade = {
      ...persistedView.environmentGrade,
      exposure: 1.48,
      saturation: 1.12,
    }
    persistedView.environmentSource = {
      kind: 'hdri',
      label: 'Workshop Loft',
      assetPath: '/HDRI/workshop_loft.hdr',
      backgroundVisible: false,
      intensity: 1.35,
      backgroundIntensity: 0.5,
      rotationDeg: 90,
    }
    persistedView.lighting = {
      ...persistedView.lighting,
      selectedLightId: 'test-light',
      lights: [
        {
          ...persistedView.lighting.lights[0],
          id: 'test-light',
          name: 'Test Light',
          intensity: 3,
        },
        ...persistedView.lighting.lights.slice(1),
      ],
    }

    window.localStorage.setItem(
      uiPrefsStorageKey,
      JSON.stringify({
        version: 2,
        view: persistedView,
        workspaceStartupSurface: 'modelViewer',
        workspacePaneFilletRadiusPx: 18,
        workspacePanelShellPaddingPx: 8,
        workspaceNestedResizeKeepsFarPane: true,
        workspaceRestorePersistence: false,
        viewSettingsPersistence: true,
        environmentPersistence: false,
        dashboardPersistence: true,
        notepadPersistence: true,
      }),
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<UiPrefsPersistenceBridgeHarness />)
    })

    const state = useUiPrefsStore.getState()
    expect(state.workspaceStartupSurface).toBe('modelViewer')
    expect(state.workspacePaneFilletRadiusPx).toBe(18)
    expect(state.workspacePanelShellPaddingPx).toBe(8)
    expect(state.workspaceNestedResizeKeepsFarPane).toBe(true)
    expect(state.workspaceRestorePersistence).toBe(false)
    expect(state.viewSettingsPersistence).toBe(true)
    expect(state.environmentPersistence).toBe(false)
    expect(state.dashboardPersistence).toBe(true)
    expect(state.notepadPersistence).toBe(true)
    expect(state.view.projectionMode).toBe('orthographic')
    expect(state.view.gridVisible).toBe(false)
    expect(state.view.axesVisible).toBe(true)
    expect(state.view.envPreset).toBe(
      useUiPrefsStore.getInitialState().view.envPreset,
    )
    expect(state.view.environmentGrade).toEqual(
      useUiPrefsStore.getInitialState().view.environmentGrade,
    )
    expect(state.view.environmentSource).toEqual(
      useUiPrefsStore.getInitialState().view.environmentSource,
    )
    expect(state.view.lighting).toEqual(useUiPrefsStore.getInitialState().view.lighting)
  })

  it('normalizes an invalid startup preference back to the default home page and re-persists it', async () => {
    window.localStorage.setItem(
      uiPrefsStorageKey,
      JSON.stringify({
        version: 1,
        view: {
          projectionMode: 'perspective',
        },
        workspaceStartupSurface: 'not-a-real-surface',
        workspacePaneFilletRadiusPx: 99,
        workspacePanelShellPaddingPx: 99,
        workspaceNestedResizeKeepsFarPane: true,
      }),
    )
    useUiPrefsStore.setState(
      {
        workspaceStartupSurface: 'modelViewer',
      },
      false,
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<UiPrefsPersistenceBridgeHarness />)
    })

    expect(useUiPrefsStore.getState().workspaceStartupSurface).toBe('homePage')
    expect(useUiPrefsStore.getState().workspacePaneFilletRadiusPx).toBe(99)
    expect(useUiPrefsStore.getState().workspacePanelShellPaddingPx).toBe(24)
    expect(readPersistedUiPrefs()).toEqual({
      version: 3,
      workspaceStartupSurface: 'homePage',
      workspacePaneFilletRadiusPx: 99,
      workspacePanelShellPaddingPx: 24,
      workspaceNestedResizeKeepsFarPane: true,
      spaghettiWindowAppearanceDefaults: expect.any(Object),
      workspaceRestorePersistence: true,
      viewSettingsPersistence: true,
      environmentPersistence: true,
      dashboardPersistence: true,
      notepadPersistence: true,
      view: expect.objectContaining({
        projectionMode: 'perspective',
      }),
    })
  })

  it('keeps the remembered-look helper state out of the persisted view snapshot', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<UiPrefsPersistenceBridgeHarness />)
    })

    await act(async () => {
      useUiPrefsStore.getState().applyEnvironmentPreset('studio')
      useUiPrefsStore.getState().setEnvironmentGrade({
        exposure: 1.28,
        saturation: 1.12,
      })
      useUiPrefsStore.getState().captureEnvironmentLook()
      useUiPrefsStore.getState().setEnvironmentGrade({
        exposure: 1.04,
        saturation: 0.92,
      })
      useUiPrefsStore.getState().toggleEnvironmentLookComparison()
    })

    expect(readPersistedUiPrefs()).toMatchObject({
      version: 3,
      view: {
        envPreset: 'studio',
        environmentGrade: {
          toneMapping: 'aces',
          exposure: 1.28,
          contrast: 1,
          highlights: 0,
          shadows: 0,
          whites: 0,
          blacks: 0,
          temperature: 0,
          tint: 0,
          saturation: 1.12,
        },
        environmentSource: {
          kind: 'custom',
          label: 'Custom Studio',
        },
      },
    })
    expect(JSON.parse(window.localStorage.getItem(uiPrefsStorageKey) ?? 'null')).toEqual(
      expect.objectContaining({
        version: 3,
        view: expect.any(Object),
        workspacePaneFilletRadiusPx: 12,
        workspacePanelShellPaddingPx: 0,
        workspaceNestedResizeKeepsFarPane: true,
        workspaceRestorePersistence: true,
        viewSettingsPersistence: true,
        environmentPersistence: true,
        dashboardPersistence: true,
        notepadPersistence: true,
      }),
    )
    expect(JSON.parse(window.localStorage.getItem(uiPrefsStorageKey) ?? 'null')).not.toHaveProperty(
      'capturedEnvironmentLook',
    )
    expect(JSON.parse(window.localStorage.getItem(uiPrefsStorageKey) ?? 'null')).not.toHaveProperty(
      'environmentLookComparisonActive',
    )
  })
})
