import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_ENVIRONMENT_GRADE,
  DEFAULT_VIEW_SETTINGS,
  areEnvironmentLookSnapshotsEqual,
  createEnvironmentLookSnapshot,
  getEnvironmentPresetDefinition,
  normalizeViewSettings,
} from '../../shared/viewSettingsTypes'
import { useUiPrefsStore } from './uiPrefsStore'

describe('uiPrefsStore environment source state', () => {
  beforeEach(() => {
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
  })

  it('keeps the default environment grade nested beside the locked startup scene', () => {
    expect(useUiPrefsStore.getState().view.environmentGrade).toEqual(DEFAULT_ENVIRONMENT_GRADE)
    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'preset',
      label: 'Baseline',
    })
  })

  it('marks a named environment preset custom when the nested grade diverges', () => {
    useUiPrefsStore.getState().applyEnvironmentPreset('studio')
    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'preset',
      label: 'Studio',
    })

    useUiPrefsStore.getState().setEnvironmentGrade({
      exposure: 1.4,
      contrast: 1.1,
      saturation: 1.08,
    })

    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')
    expect(useUiPrefsStore.getState().view.environmentGrade).toMatchObject({
      toneMapping: 'aces',
      exposure: 1.4,
      contrast: 1.1,
      saturation: 1.08,
    })
    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'custom',
      label: 'Custom Studio',
    })
  })

  it('restores preset source identity when the selected preset is reapplied', () => {
    useUiPrefsStore.getState().applyEnvironmentPreset('studio')
    useUiPrefsStore.getState().setView({
      environmentGrade: {
        ...useUiPrefsStore.getState().view.environmentGrade,
        exposure: 1.4,
      },
    })

    useUiPrefsStore.getState().applyEnvironmentPreset('studio')

    const studioPreset = getEnvironmentPresetDefinition('studio')
    expect(useUiPrefsStore.getState().view.environmentGrade).toEqual(studioPreset.environmentGrade)
    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'preset',
      label: 'Studio',
    })
  })

  it('keeps the grade seam separate when the scene source changes', () => {
    const originalGrade = structuredClone(useUiPrefsStore.getState().view.environmentGrade)

    useUiPrefsStore.getState().applyHdriEnvironment({
      label: 'Docklands 02 2K',
      assetPath: '/HDRI/docklands_02_2k.hdr',
    })

    expect(useUiPrefsStore.getState().view.environmentGrade).toEqual(originalGrade)
    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'hdri',
      label: 'Docklands 02 2K',
    })
  })

  it('keeps HDRI ownership downstream when grade edits change the look', () => {
    useUiPrefsStore.getState().applyHdriEnvironment({
      label: 'Docklands 02 2K',
      assetPath: '/HDRI/docklands_02_2k.hdr',
    })
    const originalSource = structuredClone(useUiPrefsStore.getState().view.environmentSource)

    useUiPrefsStore.getState().setEnvironmentGrade({
      contrast: 1.2,
      temperature: 12,
      saturation: 1.1,
    })

    expect(useUiPrefsStore.getState().view.environmentSource).toEqual(originalSource)
    expect(useUiPrefsStore.getState().view.environmentGrade).toMatchObject({
      contrast: 1.2,
      temperature: 12,
      saturation: 1.1,
    })
  })

  it('marks the source custom when a light is manually edited', () => {
    useUiPrefsStore.getState().applyEnvironmentPreset('studio')
    const selectedLightId = useUiPrefsStore.getState().view.lighting.selectedLightId
    expect(selectedLightId).not.toBeNull()

    useUiPrefsStore.getState().updateLight(selectedLightId as string, { intensity: 3 })

    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'custom',
      label: 'Custom Studio',
    })
  })

  it('normalizes legacy grade fields into the nested environment grade seam', () => {
    const normalized = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      environmentGrade: undefined,
      toneMapping: 'none',
      exposure: 0.72,
    } as Parameters<typeof normalizeViewSettings>[0])

    expect(normalized.environmentGrade).toEqual({
      toneMapping: 'none',
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
    expect(normalized.environmentSource).toMatchObject({
      kind: 'custom',
      label: 'Custom Baseline',
    })
  })

  it('applies HDRI environment files and updates first-pass HDRI controls', () => {
    useUiPrefsStore.getState().applyHdriEnvironment({
      label: 'Docklands 02 2K',
      assetPath: '/HDRI/docklands_02_2k.hdr',
    })

    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'hdri',
      label: 'Docklands 02 2K',
      assetPath: '/HDRI/docklands_02_2k.hdr',
      backgroundVisible: true,
      intensity: 1,
      backgroundIntensity: 1,
      rotationDeg: 0,
    })

    useUiPrefsStore.getState().setHdriEnvironmentBackgroundVisible(false)
    useUiPrefsStore.getState().setHdriEnvironmentIntensity(4.5)
    useUiPrefsStore.getState().setHdriEnvironmentBackgroundIntensity(0.75)
    useUiPrefsStore.getState().setHdriEnvironmentRotation(37)

    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'hdri',
      backgroundVisible: false,
      intensity: 4.5,
      backgroundIntensity: 0.75,
      rotationDeg: 37,
    })
  })

  it('captures, recalls, and A/B compares the remembered environment look without owning the scene', () => {
    useUiPrefsStore.getState().applyHdriEnvironment({
      label: 'Workshop Loft',
      assetPath: '/HDRI/workshop_loft.hdr',
    })
    useUiPrefsStore.getState().setView({
      projectionMode: 'orthographic',
      gridVisible: false,
    })
    useUiPrefsStore.getState().setEnvironmentGrade({
      exposure: 1.35,
      contrast: 1.08,
      saturation: 1.1,
    })

    useUiPrefsStore.getState().captureEnvironmentLook()

    const capturedLook = useUiPrefsStore.getState().capturedEnvironmentLook
    expect(capturedLook).toEqual(
      createEnvironmentLookSnapshot({
        envPreset: useUiPrefsStore.getState().view.envPreset,
        environmentGrade: useUiPrefsStore.getState().view.environmentGrade,
        environmentSource: useUiPrefsStore.getState().view.environmentSource,
        lighting: useUiPrefsStore.getState().view.lighting,
      }),
    )

    useUiPrefsStore.getState().setView({
      projectionMode: 'perspective',
      gridVisible: true,
    })
    useUiPrefsStore.getState().setEnvironmentGrade({
      exposure: 1.05,
      contrast: 1.25,
      saturation: 0.96,
    })

    useUiPrefsStore.getState().recallEnvironmentLook()

    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'hdri',
      label: 'Workshop Loft',
      assetPath: '/HDRI/workshop_loft.hdr',
    })
    expect(useUiPrefsStore.getState().view.environmentGrade).toMatchObject({
      exposure: 1.35,
      contrast: 1.08,
      saturation: 1.1,
    })
    expect(useUiPrefsStore.getState().view.projectionMode).toBe('perspective')
    expect(useUiPrefsStore.getState().view.gridVisible).toBe(true)
    expect(useUiPrefsStore.getState().environmentLookComparisonActive).toBe(false)

    useUiPrefsStore.getState().setEnvironmentGrade({
      exposure: 1.05,
      contrast: 1.25,
      saturation: 0.96,
    })
    useUiPrefsStore.getState().toggleEnvironmentLookComparison()

    expect(useUiPrefsStore.getState().environmentLookComparisonActive).toBe(true)
    expect(
      areEnvironmentLookSnapshotsEqual(
        createEnvironmentLookSnapshot(useUiPrefsStore.getState().view),
        capturedLook!,
      ),
    ).toBe(true)

    useUiPrefsStore.getState().toggleEnvironmentLookComparison()

    expect(useUiPrefsStore.getState().environmentLookComparisonActive).toBe(false)
    expect(useUiPrefsStore.getState().view.environmentGrade).toMatchObject({
      exposure: 1.05,
      contrast: 1.25,
      saturation: 0.96,
    })
    expect(useUiPrefsStore.getState().view.projectionMode).toBe('perspective')
    expect(useUiPrefsStore.getState().view.gridVisible).toBe(true)
  })
})
