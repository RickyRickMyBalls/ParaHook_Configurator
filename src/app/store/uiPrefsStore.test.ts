import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_ENVIRONMENT_GRADE,
  DEFAULT_GRID_PRESENTATION_SETTINGS,
  DEFAULT_RENDER_PREVIEW_SETTINGS,
  DEFAULT_VIEW_CONTACT_SHADOW_SETTINGS,
  DEFAULT_VIEW_POST_PROCESS_SETTINGS,
  DEFAULT_VIEW_HIGHLIGHT_SETTINGS,
  DEFAULT_VIEW_DISPLAY_MODE,
  DEFAULT_VIEW_EDGE_DISPLAY_MODE,
  DEFAULT_VIEWPORT_STYLE,
  DEFAULT_VIEW_SETTINGS,
  areEnvironmentLookSnapshotsEqual,
  createEnvironmentLookSnapshot,
  createViewAmbientOcclusionPresetSettings,
  getEnvironmentPresetDefinition,
  normalizeViewSettings,
  resolveViewAmbientOcclusionPresetRead,
  resolveViewGeometryDisplayEdgePresetRead,
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

  it('defaults and normalizes grid presentation as view-only presentation state', () => {
    expect(useUiPrefsStore.getState().view.gridPresentation).toEqual(
      DEFAULT_GRID_PRESENTATION_SETTINGS,
    )

    const legacyView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      gridPresentation: undefined,
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(legacyView.gridPresentation).toEqual(DEFAULT_GRID_PRESENTATION_SETTINGS)

    const normalized = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      gridPresentation: {
        height: 999,
        size: -10,
        layers: [
          {
            id: 'grid1',
            enabled: false,
            spacing: 0,
            color: 'not-a-color',
            opacity: 2,
            heightOffset: 1,
          },
          {
            id: 'grid2',
            spacing: 12,
            color: '#ff00aa',
            opacity: 0.45,
            heightOffset: 0.025,
          },
        ],
      },
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(normalized.gridPresentation).toEqual({
      height: 25,
      size: 25,
      layers: [
        {
          id: 'grid1',
          enabled: false,
          spacing: 0.1,
          color: '#ffffff',
          opacity: 1,
          heightOffset: 0.05,
        },
        {
          id: 'grid2',
          enabled: true,
          spacing: 12,
          color: '#ff00aa',
          opacity: 0.45,
          heightOffset: 0.025,
        },
        DEFAULT_GRID_PRESENTATION_SETTINGS.layers[2],
      ],
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

  it('normalizes display mode as view presentation state with legacy wireframe migration', () => {
    expect(useUiPrefsStore.getState().view.displayMode).toBe(DEFAULT_VIEW_DISPLAY_MODE)
    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe(DEFAULT_VIEW_EDGE_DISPLAY_MODE)
    expect(useUiPrefsStore.getState().view.wireframe).toBe(false)

    const legacyWireframeView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      displayMode: undefined,
      edgeDisplayMode: undefined,
      wireframe: true,
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(legacyWireframeView.displayMode).toBe('wireframe')
    expect(legacyWireframeView.edgeDisplayMode).toBe('on')
    expect(legacyWireframeView.wireframe).toBe(true)

    const invalidDisplayModeView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      displayMode: 'xray',
      wireframe: false,
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(invalidDisplayModeView.displayMode).toBe('rendered')
    expect(invalidDisplayModeView.wireframe).toBe(false)
  })

  it('normalizes edge display mode as independent view presentation state', () => {
    const validEdgeView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      edgeDisplayMode: 'visibleEdgesOnly',
    })

    expect(validEdgeView.edgeDisplayMode).toBe('visibleEdgesOnly')
    expect(validEdgeView.geometryDisplay.edges.preset).toBe('visibleOnly')
    expect(validEdgeView.geometryDisplay.edges.mode).toBe('visibleOnly')

    const invalidEdgeView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      edgeDisplayMode: 'triangles',
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(invalidEdgeView.edgeDisplayMode).toBe(DEFAULT_VIEW_EDGE_DISPLAY_MODE)
    expect(invalidEdgeView.geometryDisplay.edges.preset).toBe('off')
    expect(invalidEdgeView.geometryDisplay.edges.mode).toBe('off')
  })

  it('normalizes geometry display settings as the surface edge and point shell', () => {
    const normalized = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      edgeDisplayMode: 'off',
      geometryDisplay: {
        surfaces: { visible: false },
        edges: {
          mode: 'all',
          color: '#00ffaa',
          opacity: 2,
          depthMode: 'surface',
        },
        points: { visible: false },
      },
    })

    expect(normalized.geometryDisplay).toEqual({
      surfaces: {
        visible: false,
        source: 'materialSet',
        customMaterial: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.customMaterial,
        hover: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.hover,
        selected: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.selected,
        bodySelected: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.bodySelected,
      },
      edges: {
        preset: 'visibleOnly',
        mode: 'visibleOnly',
        color: '#00ffaa',
        opacity: 1,
        depthMode: 'surface',
        hiddenEdges: false,
        lineStyle: 'solid',
        hiddenLine: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hiddenLine,
        hover: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hover,
        selected: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.selected,
      },
      points: { visible: false },
    })
    expect(normalized.edgeDisplayMode).toBe('visibleEdgesOnly')

    const legacyEdgeOnlyView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      edgeDisplayMode: 'visibleEdgesOnly',
      geometryDisplay: undefined,
    })

    expect(legacyEdgeOnlyView.geometryDisplay.edges.preset).toBe('visibleOnly')
    expect(legacyEdgeOnlyView.geometryDisplay.edges.mode).toBe('visibleOnly')
    expect(legacyEdgeOnlyView.edgeDisplayMode).toBe('visibleEdgesOnly')
    expect(legacyEdgeOnlyView.geometryDisplay.edges.color).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.color,
    )

    const hiddenLineView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      geometryDisplay: {
        ...structuredClone(DEFAULT_VIEW_SETTINGS.geometryDisplay),
        edges: {
          ...structuredClone(DEFAULT_VIEW_SETTINGS.geometryDisplay.edges),
          preset: 'hiddenLine',
          hiddenEdges: undefined,
          lineStyle: undefined,
          hiddenLine: {
            color: 'not-a-color',
            opacity: 2,
            dashSize: -1,
            gapSize: 99,
          },
        },
      },
    })

    expect(hiddenLineView.geometryDisplay.edges).toMatchObject({
      preset: 'hiddenLine',
      mode: 'all',
      depthMode: 'xray',
      hiddenEdges: true,
      lineStyle: 'dashed',
      hiddenLine: {
        color: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hiddenLine.color,
        opacity: 1,
        dashSize: 0.01,
        gapSize: 1,
      },
    })
    expect(hiddenLineView.edgeDisplayMode).toBe('on')
    expect(resolveViewGeometryDisplayEdgePresetRead(hiddenLineView.geometryDisplay.edges)).toBe(
      'hiddenLine',
    )

    expect(
      resolveViewGeometryDisplayEdgePresetRead({
        ...hiddenLineView.geometryDisplay.edges,
        depthMode: 'surface',
        hiddenEdges: false,
        lineStyle: 'dashed',
      }),
    ).toBe('custom')
    expect(
      resolveViewGeometryDisplayEdgePresetRead({
        ...hiddenLineView.geometryDisplay.edges,
        hiddenEdges: false,
        lineStyle: 'dashed',
      }),
    ).toBe('xray')
    const restyledHiddenLineEdges = {
      ...hiddenLineView.geometryDisplay.edges,
      color: '#ff00aa',
      opacity: 0.14,
      hiddenLine: {
        color: '#00ffaa',
        opacity: 0.35,
        dashSize: 0.42,
        gapSize: 0.24,
      },
    }
    expect(resolveViewGeometryDisplayEdgePresetRead(restyledHiddenLineEdges)).toBe('hiddenLine')

    const customSurfaceView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      geometryDisplay: {
        ...structuredClone(DEFAULT_VIEW_SETTINGS.geometryDisplay),
        surfaces: {
          visible: true,
          source: 'custom',
          customMaterial: {
            ...DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.customMaterial,
            color: '#ff00aa',
            metalness: 2,
            roughness: -1,
            emissive: 'pink',
            emissiveIntensity: 8,
            opacity: -2,
            transparent: true,
            doubleSided: false,
          },
          hover: {
            color: '#00ffaa',
            opacity: 2,
          },
          selected: {
            color: 'blue',
            opacity: -1,
          },
          bodySelected: {
            color: '#123abc',
            opacity: 2,
          },
        },
      },
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(customSurfaceView.geometryDisplay.surfaces).toEqual({
      visible: true,
      source: 'custom',
      customMaterial: {
        ...DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.customMaterial,
        color: '#ff00aa',
        metalness: 1,
        roughness: 0,
        emissive: '#ffffff',
        emissiveIntensity: 2,
        opacity: 0,
        transparent: true,
        doubleSided: false,
      },
      hover: {
        color: '#00ffaa',
        opacity: 0.9,
      },
      selected: {
        color: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.selected.color,
        opacity: 0.05,
      },
      bodySelected: {
        color: '#123abc',
        opacity: 0.85,
      },
    })
    expect(customSurfaceView.highlights).toMatchObject({
      hoverColor: '#00ffaa',
      surfaceHoverOpacity: 0.9,
      selectedColor: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.selected.color,
      surfaceSelectedOpacity: 0.05,
      bodySelectedColor: '#123abc',
      bodySelectedOpacity: 0.85,
    })
  })

  it('keeps geometry display surface styles synchronized with legacy highlights', () => {
    useUiPrefsStore.getState().setViewKey('geometryDisplay', {
      ...useUiPrefsStore.getState().view.geometryDisplay,
      surfaces: {
        ...useUiPrefsStore.getState().view.geometryDisplay.surfaces,
        hover: { color: '#00ffaa', opacity: 0.33 },
        selected: { color: '#ff00aa', opacity: 0.44 },
        bodySelected: { color: '#123abc', opacity: 0.55 },
      },
    })

    expect(useUiPrefsStore.getState().view.highlights).toMatchObject({
      hoverColor: '#00ffaa',
      surfaceHoverOpacity: 0.33,
      selectedColor: '#ff00aa',
      surfaceSelectedOpacity: 0.44,
      bodySelectedColor: '#123abc',
      bodySelectedOpacity: 0.55,
    })

    useUiPrefsStore.getState().setViewKey('highlights', {
      ...useUiPrefsStore.getState().view.highlights,
      hoverColor: '#111111',
      surfaceHoverOpacity: 0.22,
      selectedColor: '#222222',
      surfaceSelectedOpacity: 0.66,
      bodySelectedColor: '#333333',
      bodySelectedOpacity: 0.77,
    })

    expect(useUiPrefsStore.getState().view.geometryDisplay.surfaces).toMatchObject({
      hover: { color: '#111111', opacity: 0.22 },
      selected: { color: '#222222', opacity: 0.66 },
      bodySelected: { color: '#333333', opacity: 0.77 },
    })
  })

  it('normalizes viewport style as independent view presentation state', () => {
    expect(useUiPrefsStore.getState().view.viewportStyle).toBe(DEFAULT_VIEWPORT_STYLE)

    const validStyleView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      viewportStyle: 'clayStudio',
    })

    expect(validStyleView.viewportStyle).toBe('clayStudio')

    const invalidStyleView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      viewportStyle: 'glassbox',
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(invalidStyleView.viewportStyle).toBe(DEFAULT_VIEWPORT_STYLE)
  })

  it('keeps the display mode contract synchronized with the legacy wireframe key', () => {
    useUiPrefsStore.getState().setViewKey('displayMode', 'solid')

    expect(useUiPrefsStore.getState().view.displayMode).toBe('solid')
    expect(useUiPrefsStore.getState().view.wireframe).toBe(false)
    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('off')

    useUiPrefsStore.getState().setViewKey('wireframe', true)

    expect(useUiPrefsStore.getState().view.displayMode).toBe('wireframe')
    expect(useUiPrefsStore.getState().view.wireframe).toBe(true)
    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('on')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.preset).toBe('xray')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.mode).toBe('all')

    useUiPrefsStore.getState().setViewKey('wireframe', false)

    expect(useUiPrefsStore.getState().view.displayMode).toBe('rendered')
    expect(useUiPrefsStore.getState().view.wireframe).toBe(false)
    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('off')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.preset).toBe('off')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.mode).toBe('off')
  })

  it('keeps explicit edge display mode independent from non-wireframe display modes', () => {
    useUiPrefsStore.getState().setViewKey('edgeDisplayMode', 'visibleEdgesOnly')
    useUiPrefsStore.getState().setViewKey('displayMode', 'material')

    expect(useUiPrefsStore.getState().view.displayMode).toBe('material')
    expect(useUiPrefsStore.getState().view.wireframe).toBe(false)
    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('visibleEdgesOnly')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.preset).toBe('visibleOnly')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.mode).toBe('visibleOnly')
  })

  it('normalizes render-preview quality settings as presentation state', () => {
    expect(useUiPrefsStore.getState().view.renderPreview).toEqual(DEFAULT_RENDER_PREVIEW_SETTINGS)

    const normalized = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      renderPreview: {
        targetSamples: 999,
        bounces: -3,
        renderScale: 0.12,
        noiseCleanup: 'sparkly',
        gpuLoad: 'maximum',
      },
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(normalized.renderPreview).toEqual({
      targetSamples: 256,
      bounces: 1,
      renderScale: 0.5,
      noiseCleanup: 'off',
      gpuLoad: 'balanced',
    })

    const sourceSettings = {
      targetSamples: 128,
      bounces: 8,
      renderScale: 0.75,
      noiseCleanup: 'medium',
      gpuLoad: 'fast',
    } as const
    const cloned = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      renderPreview: sourceSettings,
    })

    expect(cloned.renderPreview).toEqual(sourceSettings)
    expect(cloned.renderPreview).not.toBe(sourceSettings)
  })

  it('updates render-preview settings through the generic view-setting path', () => {
    useUiPrefsStore.getState().setViewKey('renderPreview', {
      targetSamples: 96,
      bounces: 9,
      renderScale: 0.8,
      noiseCleanup: 'high',
      gpuLoad: 'smooth',
    })

    expect(useUiPrefsStore.getState().view.renderPreview).toEqual({
      targetSamples: 96,
      bounces: 9,
      renderScale: 0.8,
      noiseCleanup: 'high',
      gpuLoad: 'smooth',
    })

    useUiPrefsStore.getState().setView({
      renderPreview: {
        targetSamples: 3,
        bounces: 99,
        renderScale: 5,
        noiseCleanup: 'low',
        gpuLoad: 'balanced',
      },
    })

    expect(useUiPrefsStore.getState().view.renderPreview).toEqual({
      targetSamples: 16,
      bounces: 12,
      renderScale: 1,
      noiseCleanup: 'low',
      gpuLoad: 'balanced',
    })
  })

  it('normalizes SSAO post-processing settings as view presentation state', () => {
    expect(useUiPrefsStore.getState().view.postProcessing).toEqual(
      DEFAULT_VIEW_POST_PROCESS_SETTINGS,
    )

    const legacyView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      postProcessing: undefined,
    })

    expect(legacyView.postProcessing).toEqual(DEFAULT_VIEW_POST_PROCESS_SETTINGS)

    const legacyEnabledView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      postProcessing: {
        ssaoEnabled: true,
      },
    } as Parameters<typeof normalizeViewSettings>[0])

    expect(legacyEnabledView.postProcessing).toEqual({
      ...DEFAULT_VIEW_POST_PROCESS_SETTINGS,
      aoType: 'basicSsao',
      ssaoEnabled: true,
    })

    const legacyDisabledView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      postProcessing: {
        ssaoEnabled: false,
      },
    } as Parameters<typeof normalizeViewSettings>[0])

    expect(legacyDisabledView.postProcessing).toEqual(DEFAULT_VIEW_POST_PROCESS_SETTINGS)

    const invalidView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      postProcessing: {
        aoType: 'strange',
        ssaoEnabled: 'yes',
        ssaoIntensity: 99,
        ssaoRadius: -4,
        ssaoQuality: 'ultra',
        ssaoContactBias: 99,
        ssaoDistanceThreshold: -1,
      },
    } as unknown as Parameters<typeof normalizeViewSettings>[0])

    expect(invalidView.postProcessing).toEqual({
      aoType: 'off',
      ssaoEnabled: false,
      ssaoIntensity: 25,
      ssaoRadius: 0,
      ssaoQuality: 'medium',
      ssaoContactBias: 0.1,
      ssaoDistanceThreshold: 0,
    })

    const sourceSettings = {
      aoType: 'sao',
      ssaoEnabled: true,
      ssaoIntensity: 1.8,
      ssaoRadius: 2.4,
      ssaoQuality: 'high',
      ssaoContactBias: 0.004,
      ssaoDistanceThreshold: 0.15,
    } as const
    const cloned = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      postProcessing: sourceSettings,
    })

    expect(cloned.postProcessing).toEqual(sourceSettings)
    expect(cloned.postProcessing).not.toBe(sourceSettings)
  })

  it('updates SSAO post-processing settings through the generic view-setting path', () => {
    useUiPrefsStore.getState().setViewKey('postProcessing', {
      aoType: 'sao',
      ssaoEnabled: true,
      ssaoIntensity: 1.5,
      ssaoRadius: 2,
      ssaoQuality: 'high',
      ssaoContactBias: 0.004,
      ssaoDistanceThreshold: 0.18,
    })

    expect(useUiPrefsStore.getState().view.postProcessing).toEqual({
      aoType: 'sao',
      ssaoEnabled: true,
      ssaoIntensity: 1.5,
      ssaoRadius: 2,
      ssaoQuality: 'high',
      ssaoContactBias: 0.004,
      ssaoDistanceThreshold: 0.18,
    })

    useUiPrefsStore.getState().setView({
      postProcessing: {
        aoType: 'off',
        ssaoEnabled: false,
        ssaoIntensity: -1,
        ssaoRadius: 10,
        ssaoQuality: 'low',
        ssaoContactBias: -1,
        ssaoDistanceThreshold: 10,
      },
    })

    expect(useUiPrefsStore.getState().view.postProcessing).toEqual({
      aoType: 'off',
      ssaoEnabled: false,
      ssaoIntensity: 0,
      ssaoRadius: 10,
      ssaoQuality: 'low',
      ssaoContactBias: 0,
      ssaoDistanceThreshold: 2,
    })
  })

  it('normalizes contact shadows as view presentation state', () => {
    expect(useUiPrefsStore.getState().view.contactShadows).toEqual(
      DEFAULT_VIEW_CONTACT_SHADOW_SETTINGS,
    )

    const legacyView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      contactShadows: undefined,
    })

    expect(legacyView.contactShadows).toEqual(DEFAULT_VIEW_CONTACT_SHADOW_SETTINGS)

    const invalidView = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      contactShadows: {
        enabled: true,
        opacity: 2,
        spread: 0,
        heightFade: 99,
      },
    })

    expect(invalidView.contactShadows).toEqual({
      enabled: true,
      opacity: 1,
      spread: 0.5,
      heightFade: 16,
    })

    useUiPrefsStore.getState().setViewKey('contactShadows', {
      enabled: true,
      opacity: 0.42,
      spread: 1.5,
      heightFade: 6,
    })

    expect(useUiPrefsStore.getState().view.contactShadows).toEqual({
      enabled: true,
      opacity: 0.42,
      spread: 1.5,
      heightFade: 6,
    })
  })

  it('maps ambient occlusion presets through shared post-processing settings', () => {
    expect(createViewAmbientOcclusionPresetSettings('off')).toEqual(
      DEFAULT_VIEW_POST_PROCESS_SETTINGS,
    )
    expect(createViewAmbientOcclusionPresetSettings('low')).toEqual({
      aoType: 'basicSsao',
      ssaoEnabled: true,
      ssaoIntensity: 0.55,
      ssaoRadius: 1.15,
      ssaoQuality: 'low',
      ssaoContactBias: 0.0021,
      ssaoDistanceThreshold: 0.06625,
    })
    expect(createViewAmbientOcclusionPresetSettings('medium')).toEqual({
      aoType: 'basicSsao',
      ssaoEnabled: true,
      ssaoIntensity: 0.82,
      ssaoRadius: 1.85,
      ssaoQuality: 'medium',
      ssaoContactBias: 0.00264,
      ssaoDistanceThreshold: 0.0865,
    })
    expect(createViewAmbientOcclusionPresetSettings('high')).toEqual({
      aoType: 'basicSsao',
      ssaoEnabled: true,
      ssaoIntensity: 1.05,
      ssaoRadius: 2.65,
      ssaoQuality: 'high',
      ssaoContactBias: 0.0031,
      ssaoDistanceThreshold: 0.10375,
    })

    expect(
      resolveViewAmbientOcclusionPresetRead(
        createViewAmbientOcclusionPresetSettings('medium'),
      ),
    ).toBe('medium')
    expect(
      resolveViewAmbientOcclusionPresetRead({
        aoType: 'basicSsao',
        ssaoEnabled: true,
        ssaoIntensity: 1.8,
        ssaoRadius: 2.5,
        ssaoQuality: 'high',
        ssaoContactBias: 0.0031,
        ssaoDistanceThreshold: 0.10375,
      }),
    ).toBe('custom')
    expect(
      resolveViewAmbientOcclusionPresetRead({
        ...createViewAmbientOcclusionPresetSettings('high'),
        ssaoDistanceThreshold: 0.2,
      }),
    ).toBe('custom')
    expect(
      resolveViewAmbientOcclusionPresetRead({
        aoType: 'sao',
        ssaoEnabled: true,
        ssaoIntensity: 1.8,
        ssaoRadius: 2.5,
        ssaoQuality: 'high',
        ssaoContactBias: 0.0031,
        ssaoDistanceThreshold: 0.10375,
      }),
    ).toBe('custom')
    expect(
      resolveViewAmbientOcclusionPresetRead({
        aoType: 'off',
        ssaoEnabled: false,
        ssaoIntensity: 0.7,
        ssaoRadius: 0.75,
        ssaoQuality: 'low',
        ssaoContactBias: 0.1,
        ssaoDistanceThreshold: 2,
      }),
    ).toBe('off')
  })

  it('normalizes viewport highlight settings through the generic view-setting path', () => {
    expect(useUiPrefsStore.getState().view.highlights).toEqual(DEFAULT_VIEW_HIGHLIGHT_SETTINGS)

    useUiPrefsStore.getState().setViewKey('highlights', {
      ...DEFAULT_VIEW_HIGHLIGHT_SETTINGS,
      hoverColor: '#FFFFFF',
      selectedColor: 'blue',
      bodySelectedColor: '#123ABC',
      hoverGlow: 2,
      selectedGlow: -1,
      pointHoverSize: 1,
      pointSelectedSize: 0,
      edgeHoverThickness: 10,
      edgeSelectedThickness: 0,
      surfaceHoverOpacity: 2,
      surfaceSelectedOpacity: 0,
      bodySelectedOpacity: 2,
    })

    expect(useUiPrefsStore.getState().view.highlights).toEqual({
      ...DEFAULT_VIEW_HIGHLIGHT_SETTINGS,
      hoverColor: '#ffffff',
      selectedColor: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.selectedColor,
      bodySelectedColor: '#123abc',
      hoverGlow: 1,
      selectedGlow: 0,
      pointHoverSize: 0.2,
      pointSelectedSize: 0.02,
      edgeHoverThickness: 6,
      edgeSelectedThickness: 0.5,
      surfaceHoverOpacity: 0.9,
      surfaceSelectedOpacity: 0.05,
      bodySelectedOpacity: 0.85,
    })
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges).toMatchObject({
      hover: {
        color: '#ffffff',
        opacity: 1,
      },
      selected: {
        color: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.selected.color,
        opacity: 0.7,
      },
    })
  })

  it('bridges geometry display edge interaction styles with legacy highlight settings', () => {
    useUiPrefsStore.getState().setViewKey('geometryDisplay', {
      ...DEFAULT_VIEW_SETTINGS.geometryDisplay,
      edges: {
        ...DEFAULT_VIEW_SETTINGS.geometryDisplay.edges,
        hover: {
          color: '#00ffaa',
          opacity: 0.93,
        },
        selected: {
          color: '#ff00aa',
          opacity: 0.82,
        },
      },
    })

    expect(useUiPrefsStore.getState().view.geometryDisplay.edges).toMatchObject({
      hover: {
        color: '#00ffaa',
        opacity: 0.93,
      },
      selected: {
        color: '#ff00aa',
        opacity: 0.82,
      },
    })
    expect(useUiPrefsStore.getState().view.highlights).toMatchObject({
      hoverColor: '#00ffaa',
      selectedColor: '#ff00aa',
      hoverGlow: 0.8,
      selectedGlow: (0.82 - 0.7) / 0.3,
    })

    const legacyPhase4View = normalizeViewSettings({
      ...structuredClone(DEFAULT_VIEW_SETTINGS),
      geometryDisplay: {
        ...structuredClone(DEFAULT_VIEW_SETTINGS.geometryDisplay),
        edges: {
          mode: 'all',
          color: '#ffffff',
          opacity: 2,
          depthMode: 'surface',
        },
      },
    })

    expect(legacyPhase4View.geometryDisplay.edges).toEqual({
      preset: 'visibleOnly',
      mode: 'visibleOnly',
      color: '#ffffff',
      opacity: 1,
      depthMode: 'surface',
      hiddenEdges: false,
      lineStyle: 'solid',
      hiddenLine: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hiddenLine,
      hover: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hover,
      selected: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.selected,
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
