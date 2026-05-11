import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_ENVIRONMENT_GRADE,
  DEFAULT_VIEW_SETTINGS,
  areEnvironmentLookSnapshotsEqual,
  createEnvironmentLookSnapshot,
  getEnvironmentPresetDefinition,
  normalizeViewSettings,
} from '../../shared/viewSettingsTypes'
import { defaultSpaghettiWindowAppearance } from '../panels/spaghettiWindowAppearance'
import {
  DEFAULT_CONSOLE_INPUT_PRIORITY_MODE,
  DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX,
  MAX_WORKSPACE_PANE_FILLET_RADIUS_PX,
  MIN_WORKSPACE_PANE_FILLET_RADIUS_PX,
  useUiPrefsStore,
} from './uiPrefsStore'

describe('uiPrefsStore environment source state', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
  })

  it('keeps the persistence policy controls enabled by default and lets the caller flip them', () => {
    expect(useUiPrefsStore.getState().spaghettiWindowAppearanceDefaults).toEqual(
      defaultSpaghettiWindowAppearance,
    )

    expect(useUiPrefsStore.getState().workspaceRestorePersistence).toBe(true)
    expect(useUiPrefsStore.getState().viewSettingsPersistence).toBe(true)
    expect(useUiPrefsStore.getState().environmentPersistence).toBe(true)
    expect(useUiPrefsStore.getState().dashboardPersistence).toBe(true)
    expect(useUiPrefsStore.getState().notepadPersistence).toBe(true)
    expect(useUiPrefsStore.getState().workspacePaneFilletRadiusPx).toBe(
      DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX,
    )
    expect(useUiPrefsStore.getState().workspaceNestedResizeKeepsFarPane).toBe(true)
    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe(
      DEFAULT_CONSOLE_INPUT_PRIORITY_MODE,
    )

    useUiPrefsStore.getState().setWorkspaceRestorePersistence(false)
    useUiPrefsStore.getState().setViewSettingsPersistence(false)
    useUiPrefsStore.getState().setEnvironmentPersistence(false)
    useUiPrefsStore.getState().setDashboardPersistence(false)
    useUiPrefsStore.getState().setNotepadPersistence(false)
    useUiPrefsStore.getState().setWorkspacePaneFilletRadiusPx(18.4)
    useUiPrefsStore.getState().setWorkspaceNestedResizeKeepsFarPane(false)
    useUiPrefsStore.getState().setConsoleInputPriorityMode('shortcuts-first')
    useUiPrefsStore.getState().setSpaghettiWindowAppearanceDefaults({
      ...defaultSpaghettiWindowAppearance,
      titlebarTint: 'blue',
    })

    expect(useUiPrefsStore.getState().workspaceRestorePersistence).toBe(false)
    expect(useUiPrefsStore.getState().viewSettingsPersistence).toBe(false)
    expect(useUiPrefsStore.getState().environmentPersistence).toBe(false)
    expect(useUiPrefsStore.getState().dashboardPersistence).toBe(false)
    expect(useUiPrefsStore.getState().notepadPersistence).toBe(false)
    expect(useUiPrefsStore.getState().workspacePaneFilletRadiusPx).toBe(18)
    expect(useUiPrefsStore.getState().workspaceNestedResizeKeepsFarPane).toBe(false)
    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe('shortcuts-first')
    expect(useUiPrefsStore.getState().spaghettiWindowAppearanceDefaults.titlebarTint).toBe('blue')
  })

  it('stores the Console input priority mode without changing keyboard routing', () => {
    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe('console-first')

    useUiPrefsStore.getState().setConsoleInputPriorityMode('shortcuts-first')
    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe('shortcuts-first')

    useUiPrefsStore.getState().setConsoleInputPriorityMode('console-first')
    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe('console-first')
  })

  it('defaults and clamps the workspace corner radius preference', () => {
    expect(useUiPrefsStore.getState().workspacePaneFilletRadiusPx).toBe(
      DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX,
    )

    useUiPrefsStore.getState().setWorkspacePaneFilletRadiusPx(MAX_WORKSPACE_PANE_FILLET_RADIUS_PX + 10)
    expect(useUiPrefsStore.getState().workspacePaneFilletRadiusPx).toBe(
      MAX_WORKSPACE_PANE_FILLET_RADIUS_PX,
    )

    useUiPrefsStore.getState().setWorkspacePaneFilletRadiusPx(MIN_WORKSPACE_PANE_FILLET_RADIUS_PX - 5)
    expect(useUiPrefsStore.getState().workspacePaneFilletRadiusPx).toBe(
      MIN_WORKSPACE_PANE_FILLET_RADIUS_PX,
    )
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
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

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

  it('defaults legacy material presets to double-sided rendering', () => {
    const legacyPreset = structuredClone(DEFAULT_VIEW_SETTINGS.materials.presets[0])
    const normalized = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      materials: {
        ...structuredClone(DEFAULT_VIEW_SETTINGS.materials),
        presets: [{ ...legacyPreset, doubleSided: undefined }],
      },
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(normalized.materials.presets[0]?.doubleSided).toBe(true)
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

  it('keeps material presets and per-part material state in the view settings seam', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000)

    useUiPrefsStore.getState().selectMaterialPreset('brushed_metal')
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('brushed_metal')

    useUiPrefsStore.getState().updateMaterialPreset('brushed_metal', {
      name: 'Proof Brushed',
      color: '#aabbcc',
      metalness: 3,
      roughness: -2,
      emissive: '#010203',
      emissiveIntensity: 5,
      opacity: 2,
      transparent: true,
      doubleSided: false,
    })

    expect(
      useUiPrefsStore.getState().view.materials.presets.find((preset) => preset.id === 'brushed_metal'),
    ).toMatchObject({
      id: 'brushed_metal',
      name: 'Proof Brushed',
      color: '#aabbcc',
      metalness: 1,
      roughness: 0,
      emissive: '#010203',
      emissiveIntensity: 2,
      opacity: 1,
      transparent: true,
      doubleSided: false,
    })

    useUiPrefsStore.getState().addMaterialPreset({
      name: '',
      color: '#445566',
      metalness: 0.24,
      roughness: 0.64,
    })

    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('mat_1700000000000')
    expect(
      useUiPrefsStore.getState().view.materials.presets.find(
        (preset) => preset.id === 'mat_1700000000000',
      ),
    ).toMatchObject({
      id: 'mat_1700000000000',
      name: 'Preset 5',
      color: '#445566',
      metalness: 0.24,
      roughness: 0.64,
      doubleSided: false,
    })

    useUiPrefsStore.getState().setUsePerPartMaterial(true)
    useUiPrefsStore.getState().assignPartMaterial('part:door', 'mat_1700000000000')
    useUiPrefsStore.getState().assignPartMaterial('part:invalid', 'missing_preset')

    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'mat_1700000000000',
    })

    useUiPrefsStore.getState().clearPartMaterial('part:missing')
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'part:door': 'mat_1700000000000',
    })

    useUiPrefsStore.getState().deleteMaterialPreset('mat_1700000000000')

    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('default_matte')
    expect(
      useUiPrefsStore.getState().view.materials.presets.some(
        (preset) => preset.id === 'mat_1700000000000',
      ),
    ).toBe(false)
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({})
  })

  it('keeps one-preset material delete and missing material operations as no-ops', () => {
    useUiPrefsStore.getState().setView({
      materials: {
        presets: [DEFAULT_VIEW_SETTINGS.materials.presets[0]],
        selectedPresetId: DEFAULT_VIEW_SETTINGS.materials.presets[0].id,
        usePerPart: false,
        perPart: {},
      },
    })

    const onePresetMaterials = structuredClone(useUiPrefsStore.getState().view.materials)

    useUiPrefsStore.getState().deleteMaterialPreset(onePresetMaterials.selectedPresetId)
    useUiPrefsStore.getState().selectMaterialPreset('missing_preset')
    useUiPrefsStore.getState().assignPartMaterial('part:door', 'missing_preset')
    useUiPrefsStore.getState().clearPartMaterial('part:door')

    expect(useUiPrefsStore.getState().view.materials).toEqual(onePresetMaterials)
  })
})
