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

    const persistedAfterHydration = readPersistedUiPrefs()
    expect(persistedAfterHydration).toEqual({
      version: 1,
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
        version: 1,
      }),
    )
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
      version: 1,
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
        version: 1,
        view: expect.any(Object),
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
