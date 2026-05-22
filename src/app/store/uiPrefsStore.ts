import { create } from 'zustand'
import type {
  EnvPreset,
  EnvironmentGradeSettings,
  EnvironmentLookSnapshot,
  LightSpec,
  LightType,
  MaterialPreset,
  MaterialPresetId,
  PartMaterialMap,
  Vec3,
  ViewSettings,
} from '../../shared/viewSettingsTypes'
import {
  createEnvironmentLookSnapshot,
  createGeometryDisplaySurfaceStylesFromHighlights,
  createHighlightsFromGeometryDisplaySurfaceStyles,
  createHighlightsFromGeometryDisplayStyles,
  createHdriEnvironmentSource,
  createEnvironmentPresetViewPatch,
  DEFAULT_VIEW_SETTINGS,
  geometryDisplayEdgeModeAndDepthToPreset,
  geometryDisplayEdgePresetToDepthMode,
  geometryDisplayEdgePresetToHiddenEdges,
  geometryDisplayEdgePresetToLineStyle,
  geometryDisplayEdgePresetToMode,
  isViewDisplayMode,
  isViewEdgeDisplayMode,
  normalizeViewSettings,
  normalizeEnvironmentGrade,
  normalizeViewHighlightSettings,
  viewEdgeDisplayModeToGeometryDisplayEdgeMode,
} from '../../shared/viewSettingsTypes'
import {
  areSpaghettiWindowAppearanceEqual,
  defaultSpaghettiWindowAppearance,
  normalizeSpaghettiWindowAppearance,
  type SpaghettiWindowAppearance,
} from '../panels/spaghettiWindowAppearance'
import {
  DEFAULT_VISUAL_STYLE_MENU_RECIPE_ID,
  normalizeVisualStyleMenuRecipeId,
  type VisualStyleMenuRecipeId,
} from '../visualStyleMenuRecipes'

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const MIN_CAMERA_SHORTCUT_TRANSITION_DURATION_MS = 50
const MAX_CAMERA_SHORTCUT_TRANSITION_DURATION_MS = 2000
const DEFAULT_CAMERA_SHORTCUT_TRANSITION_DURATION_MS = 320
export const MIN_WORKSPACE_PANE_FILLET_RADIUS_PX = 0
export const MAX_WORKSPACE_PANE_FILLET_RADIUS_PX = 100
export const DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX = 12
export const MIN_WORKSPACE_PANEL_SHELL_PADDING_PX = 0
export const MAX_WORKSPACE_PANEL_SHELL_PADDING_PX = 24
export const DEFAULT_WORKSPACE_PANEL_SHELL_PADDING_PX = 0
export type ConsoleInputPriorityMode = 'console-first' | 'shortcuts-first'
export const DEFAULT_CONSOLE_INPUT_PRIORITY_MODE: ConsoleInputPriorityMode = 'console-first'

const normalizeWorkspacePaneFilletRadiusPx = (value: number | undefined): number =>
  Number.isFinite(value)
    ? clamp(
        Math.round(value as number),
        MIN_WORKSPACE_PANE_FILLET_RADIUS_PX,
        MAX_WORKSPACE_PANE_FILLET_RADIUS_PX,
      )
    : DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX

const normalizeWorkspacePanelShellPaddingPx = (value: number | undefined): number =>
  Number.isFinite(value)
    ? clamp(
        Math.round(value as number),
        MIN_WORKSPACE_PANEL_SHELL_PADDING_PX,
        MAX_WORKSPACE_PANEL_SHELL_PADDING_PX,
      )
    : DEFAULT_WORKSPACE_PANEL_SHELL_PADDING_PX

const hasGeometryDisplayEdgeInteractionStyleChanged = (
  currentView: ViewSettings,
  nextGeometryDisplay: ViewSettings['geometryDisplay'],
): boolean =>
  currentView.geometryDisplay.edges.hover.color !== nextGeometryDisplay.edges.hover.color ||
  currentView.geometryDisplay.edges.hover.opacity !== nextGeometryDisplay.edges.hover.opacity ||
  currentView.geometryDisplay.edges.selected.color !== nextGeometryDisplay.edges.selected.color ||
  currentView.geometryDisplay.edges.selected.opacity !== nextGeometryDisplay.edges.selected.opacity

const hasGeometryDisplaySurfaceInteractionStyleChanged = (
  currentView: ViewSettings,
  nextGeometryDisplay: ViewSettings['geometryDisplay'],
): boolean =>
  currentView.geometryDisplay.surfaces.hover.color !== nextGeometryDisplay.surfaces.hover.color ||
  currentView.geometryDisplay.surfaces.hover.opacity !==
    nextGeometryDisplay.surfaces.hover.opacity ||
  currentView.geometryDisplay.surfaces.selected.color !==
    nextGeometryDisplay.surfaces.selected.color ||
  currentView.geometryDisplay.surfaces.selected.opacity !==
    nextGeometryDisplay.surfaces.selected.opacity ||
  currentView.geometryDisplay.surfaces.bodySelected.color !==
    nextGeometryDisplay.surfaces.bodySelected.color ||
  currentView.geometryDisplay.surfaces.bodySelected.opacity !==
    nextGeometryDisplay.surfaces.bodySelected.opacity

const createGeometryDisplayEdgePresetPatch = (
  edgeDisplayMode: ViewSettings['edgeDisplayMode'],
): Pick<
  ViewSettings['geometryDisplay']['edges'],
  'preset' | 'mode' | 'depthMode' | 'hiddenEdges' | 'lineStyle'
> => {
  const preset = geometryDisplayEdgeModeAndDepthToPreset(
    viewEdgeDisplayModeToGeometryDisplayEdgeMode(edgeDisplayMode),
    edgeDisplayMode === 'visibleEdgesOnly' ? 'surface' : 'xray',
  )
  return {
    preset,
    mode: geometryDisplayEdgePresetToMode(preset),
    depthMode: geometryDisplayEdgePresetToDepthMode(preset),
    hiddenEdges: geometryDisplayEdgePresetToHiddenEdges(preset),
    lineStyle: geometryDisplayEdgePresetToLineStyle(preset),
  }
}

const createHighlightsForGeometryDisplayPatch = (
  currentView: ViewSettings,
  nextGeometryDisplay: ViewSettings['geometryDisplay'],
  baseHighlights: ViewSettings['highlights'],
): ViewSettings['highlights'] => {
  if (hasGeometryDisplayEdgeInteractionStyleChanged(currentView, nextGeometryDisplay)) {
    return createHighlightsFromGeometryDisplayStyles(baseHighlights, nextGeometryDisplay)
  }
  if (hasGeometryDisplaySurfaceInteractionStyleChanged(currentView, nextGeometryDisplay)) {
    return createHighlightsFromGeometryDisplaySurfaceStyles(baseHighlights, nextGeometryDisplay)
  }
  return baseHighlights
}

const normalizeEnvironmentIntensity = (value: number | undefined, fallback = 1): number =>
  Number.isFinite(value) ? clamp(value as number, 0, 5) : fallback

const normalizeEnvironmentRotationDeg = (value: number | undefined): number =>
  Number.isFinite(value) ? clamp(value as number, 0, 360) : 0

const createDefaultView = (): ViewSettings => normalizeViewSettings(DEFAULT_VIEW_SETTINGS)

const hasApplicablePosition = (type: LightType): boolean =>
  type === 'directional' || type === 'point' || type === 'spot'

const hasApplicableTarget = (type: LightType): boolean =>
  type === 'directional' || type === 'spot'

const hasDistanceSettings = (type: LightType): boolean => type === 'point' || type === 'spot'

const supportsShadows = (type: LightType): boolean =>
  type === 'directional' || type === 'point' || type === 'spot'

const defaultVector = (x: number, y: number, z: number): Vec3 => ({ x, y, z })

const getLightDefaults = (type: LightType): Partial<LightSpec> => {
  if (type === 'directional') {
    return {
      position: defaultVector(6, 8, 6),
      target: defaultVector(0, 0, 0),
      distance: undefined,
      angleDeg: undefined,
      penumbra: undefined,
      decay: undefined,
      castShadow: true,
      shadowBias: -0.0005,
      shadowMapSize: 1024,
    }
  }

  if (type === 'point') {
    return {
      position: defaultVector(4, 6, 4),
      target: undefined,
      distance: 0,
      angleDeg: undefined,
      penumbra: undefined,
      decay: 2,
      castShadow: true,
      shadowBias: -0.0002,
      shadowMapSize: 1024,
    }
  }

  if (type === 'spot') {
    return {
      position: defaultVector(5, 8, 5),
      target: defaultVector(0, 0, 0),
      distance: 0,
      angleDeg: 35,
      penumbra: 0.2,
      decay: 2,
      castShadow: true,
      shadowBias: -0.0003,
      shadowMapSize: 1024,
    }
  }

  if (type === 'hemisphere') {
    return {
      position: undefined,
      target: undefined,
      distance: undefined,
      angleDeg: undefined,
      penumbra: undefined,
      decay: undefined,
      castShadow: undefined,
      shadowBias: undefined,
      shadowMapSize: undefined,
    }
  }

  return {
    position: undefined,
    target: undefined,
    distance: undefined,
    angleDeg: undefined,
    penumbra: undefined,
    decay: undefined,
    castShadow: undefined,
    shadowBias: undefined,
    shadowMapSize: undefined,
  }
}

const makeLightName = (index: number): string => `Light ${index}`
const makeLightId = (seed: number, salt: number): string => `light_${seed}_${salt}`

const normalizeLight = (light: LightSpec): LightSpec => ({
  ...light,
  intensity: clamp(light.intensity, 0, 8),
  distance: light.distance === undefined ? undefined : Math.max(light.distance, 0),
  angleDeg: light.angleDeg === undefined ? undefined : clamp(light.angleDeg, 0, 89),
  penumbra: light.penumbra === undefined ? undefined : clamp(light.penumbra, 0, 1),
  decay: light.decay === undefined ? undefined : Math.max(light.decay, 0),
  position: hasApplicablePosition(light.type)
    ? light.position ?? defaultVector(0, 5, 0)
    : undefined,
  target: hasApplicableTarget(light.type) ? light.target ?? defaultVector(0, 0, 0) : undefined,
  castShadow: supportsShadows(light.type) ? light.castShadow ?? false : undefined,
  shadowBias:
    supportsShadows(light.type) && light.castShadow
      ? light.shadowBias ?? -0.0003
      : light.shadowBias,
  shadowMapSize:
    supportsShadows(light.type) && light.castShadow
      ? light.shadowMapSize ?? 1024
      : light.shadowMapSize,
})

const uniqueMaterialId = (presets: MaterialPreset[]): MaterialPresetId => {
  const seed = Date.now()
  let salt = 0
  while (true) {
    const candidate = `mat_${seed + salt}`
    if (!presets.some((preset) => preset.id === candidate)) {
      return candidate
    }
    salt += 1
  }
}

const sanitizePreset = (preset: MaterialPreset): MaterialPreset => ({
  ...preset,
  metalness: clamp(preset.metalness, 0, 1),
  roughness: clamp(preset.roughness, 0, 1),
  emissiveIntensity: clamp(preset.emissiveIntensity, 0, 2),
  opacity: clamp(preset.opacity, 0, 1),
  doubleSided: preset.doubleSided ?? true,
})

export type WorkspaceStartupSurface = 'homePage' | 'modelViewer'

type UiPrefsState = {
  view: ViewSettings
  workspaceStartupSurface: WorkspaceStartupSurface
  consoleInputPriorityMode: ConsoleInputPriorityMode
  spaghettiWindowAppearanceDefaults: SpaghettiWindowAppearance
  workspacePaneFilletRadiusPx: number
  workspacePanelShellPaddingPx: number
  workspaceNestedResizeKeepsFarPane: boolean
  radialMenuRecipeId: VisualStyleMenuRecipeId
  edgeRecipeFollowsDisplayMode: boolean
  workspaceRestorePersistence: boolean
  viewSettingsPersistence: boolean
  environmentPersistence: boolean
  dashboardPersistence: boolean
  notepadPersistence: boolean
  capturedEnvironmentLook: EnvironmentLookSnapshot | null
  environmentLookComparisonActive: boolean
  environmentLookComparisonRestore: EnvironmentLookSnapshot | null
  cameraShortcutTransitionDurationMs: number
  sketchPlaneToolbarGhostPlaneScale: number
  sketchPlaneToolbarGizmoScale: number
  sketchPlaneToolbarTranslateSnapEnabled: boolean
  sketchPlaneToolbarTranslateSnapValue: number
  sketchPlaneToolbarRotateSnapEnabled: boolean
  sketchPlaneToolbarRotateSnapValue: number
  sketchDrawSnapEnabled: boolean
  sketchDrawSnapDistancePx: number
  sketchDrawCrosshairSize: number
  sketchDrawStartPointVisible: boolean
  sketchDrawStartPointSymbolSize: number
  sketchDrawStartPointSymbolType: 'crosshair' | 'circle'
  sketchDrawPlinePointVisible: boolean
  sketchDrawPlinePointSymbolSize: number
  sketchDrawPlinePointSymbolType: 'crosshair' | 'circle'
  setView: (patch: Partial<ViewSettings>) => void
  setViewKey: <K extends keyof ViewSettings>(key: K, value: ViewSettings[K]) => void
  setWorkspaceStartupSurface: (workspaceStartupSurface: WorkspaceStartupSurface) => void
  setConsoleInputPriorityMode: (consoleInputPriorityMode: ConsoleInputPriorityMode) => void
  setSpaghettiWindowAppearanceDefaults: (
    spaghettiWindowAppearanceDefaults: SpaghettiWindowAppearance,
  ) => void
  resetSpaghettiWindowAppearanceDefaults: () => void
  setWorkspaceNestedResizeKeepsFarPane: (workspaceNestedResizeKeepsFarPane: boolean) => void
  setWorkspaceRestorePersistence: (workspaceRestorePersistence: boolean) => void
  setWorkspacePaneFilletRadiusPx: (workspacePaneFilletRadiusPx: number) => void
  setWorkspacePanelShellPaddingPx: (workspacePanelShellPaddingPx: number) => void
  setViewSettingsPersistence: (viewSettingsPersistence: boolean) => void
  setRadialMenuRecipeId: (radialMenuRecipeId: VisualStyleMenuRecipeId) => void
  setEdgeRecipeFollowsDisplayMode: (edgeRecipeFollowsDisplayMode: boolean) => void
  setEnvironmentPersistence: (environmentPersistence: boolean) => void
  setDashboardPersistence: (dashboardPersistence: boolean) => void
  setNotepadPersistence: (notepadPersistence: boolean) => void
  setEnvironmentGrade: (patch: Partial<EnvironmentGradeSettings>) => void
  captureEnvironmentLook: () => void
  recallEnvironmentLook: () => void
  toggleEnvironmentLookComparison: () => void
  applyEnvironmentPreset: (preset: EnvPreset) => void
  applyHdriEnvironment: (source: { label: string; assetPath: string }) => void
  setHdriEnvironmentBackgroundVisible: (visible: boolean) => void
  setHdriEnvironmentIntensity: (intensity: number) => void
  setHdriEnvironmentBackgroundIntensity: (intensity: number) => void
  setHdriEnvironmentRotation: (rotationDeg: number) => void
  setCameraShortcutTransitionDurationMs: (value: number) => void
  setSketchPlaneToolbarGhostPlaneScale: (scale: number) => void
  setSketchPlaneToolbarGizmoScale: (scale: number) => void
  setSketchPlaneToolbarTranslateSnapEnabled: (enabled: boolean) => void
  setSketchPlaneToolbarTranslateSnapValue: (value: number) => void
  setSketchPlaneToolbarRotateSnapEnabled: (enabled: boolean) => void
  setSketchPlaneToolbarRotateSnapValue: (value: number) => void
  setSketchDrawSnapEnabled: (enabled: boolean) => void
  setSketchDrawSnapDistancePx: (value: number) => void
  setSketchDrawCrosshairSize: (value: number) => void
  setSketchDrawStartPointVisible: (enabled: boolean) => void
  setSketchDrawStartPointSymbolSize: (value: number) => void
  setSketchDrawStartPointSymbolType: (value: 'crosshair' | 'circle') => void
  setSketchDrawPlinePointVisible: (enabled: boolean) => void
  setSketchDrawPlinePointSymbolSize: (value: number) => void
  setSketchDrawPlinePointSymbolType: (value: 'crosshair' | 'circle') => void
  selectLight: (id: string | null) => void
  addLight: (spec?: Partial<LightSpec>) => void
  deleteLight: (id: string) => void
  updateLight: (id: string, patch: Partial<LightSpec>) => void
  selectMaterialPreset: (id: MaterialPresetId) => void
  updateMaterialPreset: (id: MaterialPresetId, patch: Partial<MaterialPreset>) => void
  addMaterialPreset: (preset?: Partial<MaterialPreset>) => void
  deleteMaterialPreset: (id: MaterialPresetId) => void
  setUsePerPartMaterial: (enabled: boolean) => void
  assignPartMaterial: (partId: string, presetId: MaterialPresetId) => void
  clearPartMaterial: (partId: string) => void
  setPerPartMaterialMap: (map: PartMaterialMap) => void
}

export const useUiPrefsStore = create<UiPrefsState>((set, get) => ({
  view: createDefaultView(),
  workspaceStartupSurface: 'homePage',
  consoleInputPriorityMode: DEFAULT_CONSOLE_INPUT_PRIORITY_MODE,
  spaghettiWindowAppearanceDefaults: defaultSpaghettiWindowAppearance,
  workspacePaneFilletRadiusPx: DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX,
  workspacePanelShellPaddingPx: DEFAULT_WORKSPACE_PANEL_SHELL_PADDING_PX,
  workspaceNestedResizeKeepsFarPane: true,
  radialMenuRecipeId: DEFAULT_VISUAL_STYLE_MENU_RECIPE_ID,
  edgeRecipeFollowsDisplayMode: true,
  workspaceRestorePersistence: true,
  viewSettingsPersistence: true,
  environmentPersistence: true,
  dashboardPersistence: true,
  notepadPersistence: true,
  capturedEnvironmentLook: null,
  environmentLookComparisonActive: false,
  environmentLookComparisonRestore: null,
  cameraShortcutTransitionDurationMs: DEFAULT_CAMERA_SHORTCUT_TRANSITION_DURATION_MS,
  sketchPlaneToolbarGhostPlaneScale: 1,
  sketchPlaneToolbarGizmoScale: 1,
  sketchPlaneToolbarTranslateSnapEnabled: false,
  sketchPlaneToolbarTranslateSnapValue: 10,
  sketchPlaneToolbarRotateSnapEnabled: false,
  sketchPlaneToolbarRotateSnapValue: 15,
  sketchDrawSnapEnabled: true,
  sketchDrawSnapDistancePx: 14,
  sketchDrawCrosshairSize: 1,
  sketchDrawStartPointVisible: true,
  sketchDrawStartPointSymbolSize: 0.1,
  sketchDrawStartPointSymbolType: 'circle',
  sketchDrawPlinePointVisible: true,
  sketchDrawPlinePointSymbolSize: 0.05,
  sketchDrawPlinePointSymbolType: 'circle',
  setView: (patch) => {
    const normalizedPatch = { ...patch }
    const currentView = get().view
    if ('wireframe' in patch && !('displayMode' in patch)) {
      normalizedPatch.displayMode = patch.wireframe ? 'wireframe' : 'rendered'
      normalizedPatch.edgeDisplayMode = patch.wireframe ? 'on' : 'off'
    }
    if (
      'displayMode' in patch &&
      isViewDisplayMode(patch.displayMode) &&
      !('wireframe' in patch)
    ) {
      normalizedPatch.wireframe = patch.displayMode === 'wireframe'
      if (patch.displayMode === 'wireframe' && !('edgeDisplayMode' in patch)) {
        normalizedPatch.edgeDisplayMode = 'on'
      }
    }
    if (
      'edgeDisplayMode' in normalizedPatch &&
      !('geometryDisplay' in normalizedPatch) &&
      isViewEdgeDisplayMode(normalizedPatch.edgeDisplayMode)
    ) {
      normalizedPatch.geometryDisplay = {
        ...currentView.geometryDisplay,
        edges: {
          ...currentView.geometryDisplay.edges,
          ...createGeometryDisplayEdgePresetPatch(normalizedPatch.edgeDisplayMode),
        },
      }
    }
    if ('geometryDisplay' in normalizedPatch && normalizedPatch.geometryDisplay !== undefined) {
      normalizedPatch.highlights = createHighlightsForGeometryDisplayPatch(
        currentView,
        normalizedPatch.geometryDisplay,
        normalizedPatch.highlights ?? currentView.highlights,
      )
    } else if ('highlights' in normalizedPatch && normalizedPatch.highlights !== undefined) {
      normalizedPatch.geometryDisplay = createGeometryDisplaySurfaceStylesFromHighlights(
        currentView.geometryDisplay,
        normalizeViewHighlightSettings(normalizedPatch.highlights),
      )
    }
    const nextView = normalizeViewSettings({ ...currentView, ...normalizedPatch })
    if (normalizedPatch.highlights !== undefined) {
      nextView.highlights = normalizeViewHighlightSettings(normalizedPatch.highlights)
    }
    set({ view: nextView })
  },
  setViewKey: (key, value) => {
    const patch: Partial<ViewSettings> = { [key]: value }
    const currentView = get().view
    if (key === 'wireframe') {
      patch.displayMode = value ? 'wireframe' : 'rendered'
      patch.edgeDisplayMode = value ? 'on' : 'off'
    }
    if (key === 'displayMode' && isViewDisplayMode(value)) {
      patch.wireframe = value === 'wireframe'
      if (value === 'wireframe') {
        patch.edgeDisplayMode = 'on'
      }
    }
    if (
      key === 'edgeDisplayMode' &&
      isViewEdgeDisplayMode(value)
    ) {
      patch.geometryDisplay = {
        ...currentView.geometryDisplay,
        edges: {
          ...currentView.geometryDisplay.edges,
          ...createGeometryDisplayEdgePresetPatch(value),
        },
      }
    }
    if (
      key !== 'geometryDisplay' &&
      'edgeDisplayMode' in patch &&
      isViewEdgeDisplayMode(patch.edgeDisplayMode)
    ) {
      patch.geometryDisplay = {
        ...currentView.geometryDisplay,
        edges: {
          ...currentView.geometryDisplay.edges,
          ...createGeometryDisplayEdgePresetPatch(patch.edgeDisplayMode),
        },
      }
    }
    if (key === 'geometryDisplay' && patch.geometryDisplay !== undefined) {
      patch.highlights = createHighlightsForGeometryDisplayPatch(
        currentView,
        patch.geometryDisplay,
        currentView.highlights,
      )
    }
    if (key === 'highlights' && patch.highlights !== undefined) {
      patch.geometryDisplay = createGeometryDisplaySurfaceStylesFromHighlights(
        currentView.geometryDisplay,
        normalizeViewHighlightSettings(patch.highlights),
      )
    }
    const nextView = normalizeViewSettings({ ...currentView, ...patch })
    if (patch.highlights !== undefined) {
      nextView.highlights = normalizeViewHighlightSettings(patch.highlights)
    }
    set({ view: nextView })
  },
  setWorkspaceStartupSurface: (workspaceStartupSurface) => {
    set({ workspaceStartupSurface })
  },
  setConsoleInputPriorityMode: (consoleInputPriorityMode) => {
    set({ consoleInputPriorityMode })
  },
  setSpaghettiWindowAppearanceDefaults: (spaghettiWindowAppearanceDefaults) => {
    set((state) => {
      const nextDefaults = normalizeSpaghettiWindowAppearance(spaghettiWindowAppearanceDefaults)
      if (
        areSpaghettiWindowAppearanceEqual(
          state.spaghettiWindowAppearanceDefaults,
          nextDefaults,
        )
      ) {
        return state
      }
      return { spaghettiWindowAppearanceDefaults: nextDefaults }
    })
  },
  resetSpaghettiWindowAppearanceDefaults: () => {
    set((state) => {
      if (
        areSpaghettiWindowAppearanceEqual(
          state.spaghettiWindowAppearanceDefaults,
          defaultSpaghettiWindowAppearance,
        )
      ) {
        return state
      }
      return { spaghettiWindowAppearanceDefaults: defaultSpaghettiWindowAppearance }
    })
  },
  setWorkspaceNestedResizeKeepsFarPane: (workspaceNestedResizeKeepsFarPane) => {
    set({ workspaceNestedResizeKeepsFarPane })
  },
  setWorkspaceRestorePersistence: (workspaceRestorePersistence) => {
    set({ workspaceRestorePersistence })
  },
  setWorkspacePaneFilletRadiusPx: (workspacePaneFilletRadiusPx) => {
    set((state) => {
      const nextRadius = normalizeWorkspacePaneFilletRadiusPx(workspacePaneFilletRadiusPx)
      if (state.workspacePaneFilletRadiusPx === nextRadius) {
        return state
      }
      return {
        workspacePaneFilletRadiusPx: nextRadius,
      }
    })
  },
  setWorkspacePanelShellPaddingPx: (workspacePanelShellPaddingPx) => {
    set((state) => {
      const nextPadding = normalizeWorkspacePanelShellPaddingPx(workspacePanelShellPaddingPx)
      if (state.workspacePanelShellPaddingPx === nextPadding) {
        return state
      }
      return {
        workspacePanelShellPaddingPx: nextPadding,
      }
    })
  },
  setViewSettingsPersistence: (viewSettingsPersistence) => {
    set({ viewSettingsPersistence })
  },
  setRadialMenuRecipeId: (radialMenuRecipeId) => {
    set({ radialMenuRecipeId: normalizeVisualStyleMenuRecipeId(radialMenuRecipeId) })
  },
  setEdgeRecipeFollowsDisplayMode: (edgeRecipeFollowsDisplayMode) => {
    set({ edgeRecipeFollowsDisplayMode })
  },
  setEnvironmentPersistence: (environmentPersistence) => {
    set({ environmentPersistence })
  },
  setDashboardPersistence: (dashboardPersistence) => {
    set({ dashboardPersistence })
  },
  setNotepadPersistence: (notepadPersistence) => {
    set({ notepadPersistence })
  },
  setEnvironmentGrade: (patch) => {
    const state = get()
    set({
      view: normalizeViewSettings({
        ...state.view,
        environmentGrade: normalizeEnvironmentGrade(
          {
            ...state.view.environmentGrade,
            ...patch,
          },
          state.view.environmentGrade,
        ),
      }),
    })
  },
  captureEnvironmentLook: () => {
    const state = get()
    set({
      capturedEnvironmentLook: createEnvironmentLookSnapshot(state.view),
      environmentLookComparisonActive: false,
      environmentLookComparisonRestore: null,
    })
  },
  recallEnvironmentLook: () => {
    const state = get()
    if (state.capturedEnvironmentLook === null) {
      return
    }

    set({
      view: normalizeViewSettings({
        ...state.view,
        ...state.capturedEnvironmentLook,
      }),
      environmentLookComparisonActive: false,
      environmentLookComparisonRestore: null,
    })
  },
  toggleEnvironmentLookComparison: () => {
    const state = get()
    if (state.capturedEnvironmentLook === null) {
      return
    }

    if (state.environmentLookComparisonActive) {
      const restoreLook = state.environmentLookComparisonRestore
      if (restoreLook === null) {
        return
      }
      set({
        view: normalizeViewSettings({
          ...state.view,
          ...restoreLook,
        }),
        environmentLookComparisonActive: false,
        environmentLookComparisonRestore: null,
      })
      return
    }

    set({
      view: normalizeViewSettings({
        ...state.view,
        ...state.capturedEnvironmentLook,
      }),
      environmentLookComparisonActive: true,
      environmentLookComparisonRestore: createEnvironmentLookSnapshot(state.view),
    })
  },
  applyEnvironmentPreset: (preset) => {
    const state = get()
    set({
      view: normalizeViewSettings({
        ...state.view,
        ...createEnvironmentPresetViewPatch(preset),
      }),
    })
  },
  applyHdriEnvironment: (source) => {
    const state = get()
    const currentSource = state.view.environmentSource
    const backgroundVisible =
      currentSource.kind === 'hdri' ? currentSource.backgroundVisible ?? true : true
    const intensity = currentSource.kind === 'hdri' ? currentSource.intensity ?? 1 : 1
    const backgroundIntensity =
      currentSource.kind === 'hdri'
        ? currentSource.backgroundIntensity ?? currentSource.intensity ?? 1
        : 1
    const rotationDeg = currentSource.kind === 'hdri' ? currentSource.rotationDeg ?? 0 : 0
    set({
      view: normalizeViewSettings({
        ...state.view,
        environmentSource: createHdriEnvironmentSource({
          label: source.label,
          assetPath: source.assetPath,
          backgroundVisible,
          intensity: normalizeEnvironmentIntensity(intensity),
          backgroundIntensity: normalizeEnvironmentIntensity(backgroundIntensity),
          rotationDeg: normalizeEnvironmentRotationDeg(rotationDeg),
        }),
      }),
    })
  },
  setHdriEnvironmentBackgroundVisible: (visible) => {
    const state = get()
    if (state.view.environmentSource.kind !== 'hdri') {
      return
    }
    set({
      view: normalizeViewSettings({
        ...state.view,
        environmentSource: {
          ...state.view.environmentSource,
          backgroundVisible: visible,
        },
      }),
    })
  },
  setHdriEnvironmentIntensity: (intensity) => {
    const state = get()
    if (state.view.environmentSource.kind !== 'hdri') {
      return
    }
    set({
      view: normalizeViewSettings({
        ...state.view,
        environmentSource: {
          ...state.view.environmentSource,
          intensity: normalizeEnvironmentIntensity(intensity),
        },
      }),
    })
  },
  setHdriEnvironmentBackgroundIntensity: (intensity) => {
    const state = get()
    if (state.view.environmentSource.kind !== 'hdri') {
      return
    }
    set({
      view: normalizeViewSettings({
        ...state.view,
        environmentSource: {
          ...state.view.environmentSource,
          backgroundIntensity: normalizeEnvironmentIntensity(intensity),
        },
      }),
    })
  },
  setHdriEnvironmentRotation: (rotationDeg) => {
    const state = get()
    if (state.view.environmentSource.kind !== 'hdri') {
      return
    }
    set({
      view: normalizeViewSettings({
        ...state.view,
        environmentSource: {
          ...state.view.environmentSource,
          rotationDeg: normalizeEnvironmentRotationDeg(rotationDeg),
        },
      }),
    })
  },
  setCameraShortcutTransitionDurationMs: (value) => {
    set({
      cameraShortcutTransitionDurationMs: clamp(
        value,
        MIN_CAMERA_SHORTCUT_TRANSITION_DURATION_MS,
        MAX_CAMERA_SHORTCUT_TRANSITION_DURATION_MS,
      ),
    })
  },
  setSketchPlaneToolbarGhostPlaneScale: (scale) => {
    set({ sketchPlaneToolbarGhostPlaneScale: clamp(scale, 0.4, 3) })
  },
  setSketchPlaneToolbarGizmoScale: (scale) => {
    set({ sketchPlaneToolbarGizmoScale: clamp(scale, 0.4, 3) })
  },
  setSketchPlaneToolbarTranslateSnapEnabled: (enabled) => {
    set({ sketchPlaneToolbarTranslateSnapEnabled: enabled })
  },
  setSketchPlaneToolbarTranslateSnapValue: (value) => {
    set({ sketchPlaneToolbarTranslateSnapValue: clamp(value, 0.1, 100) })
  },
  setSketchPlaneToolbarRotateSnapEnabled: (enabled) => {
    set({ sketchPlaneToolbarRotateSnapEnabled: enabled })
  },
  setSketchPlaneToolbarRotateSnapValue: (value) => {
    set({ sketchPlaneToolbarRotateSnapValue: clamp(value, 1, 90) })
  },
  setSketchDrawSnapEnabled: (enabled) => {
    set({ sketchDrawSnapEnabled: enabled })
  },
  setSketchDrawSnapDistancePx: (value) => {
    set({ sketchDrawSnapDistancePx: clamp(value, 4, 64) })
  },
  setSketchDrawCrosshairSize: (value) => {
    set({ sketchDrawCrosshairSize: clamp(value, 0.5, 3) })
  },
  setSketchDrawStartPointVisible: (enabled) => {
    set({ sketchDrawStartPointVisible: enabled })
  },
  setSketchDrawStartPointSymbolSize: (value) => {
    set({ sketchDrawStartPointSymbolSize: clamp(value, 0.01, 3) })
  },
  setSketchDrawStartPointSymbolType: (value) => {
    set({ sketchDrawStartPointSymbolType: value })
  },
  setSketchDrawPlinePointVisible: (enabled) => {
    set({ sketchDrawPlinePointVisible: enabled })
  },
  setSketchDrawPlinePointSymbolSize: (value) => {
    set({ sketchDrawPlinePointSymbolSize: clamp(value, 0.01, 3) })
  },
  setSketchDrawPlinePointSymbolType: (value) => {
    set({ sketchDrawPlinePointSymbolType: value })
  },
  selectLight: (id) => {
    set({
      view: {
        ...get().view,
        lighting: {
          ...get().view.lighting,
          selectedLightId: id,
        },
      },
    })
  },
  addLight: (spec) => {
    const state = get()
    const type: LightType = spec?.type ?? 'point'
    const defaults = getLightDefaults(type)
    let salt = 0
    let id = makeLightId(Date.now(), salt)
    while (state.view.lighting.lights.some((light) => light.id === id)) {
      salt += 1
      id = makeLightId(Date.now(), salt)
    }
    const name = spec?.name?.trim() || makeLightName(state.view.lighting.lights.length + 1)
    const light: LightSpec = normalizeLight({
      id,
      name,
      type,
      enabled: spec?.enabled ?? true,
      color: spec?.color ?? '#ffffff',
      intensity: spec?.intensity ?? (type === 'ambient' ? 0.4 : 1),
      ...defaults,
      ...spec,
    })

    set({
      view: normalizeViewSettings({
        ...state.view,
        lighting: {
          selectedLightId: light.id,
          lights: [...state.view.lighting.lights, light],
        },
      }),
    })
  },
  deleteLight: (id) => {
    const state = get()
    const nextLights = state.view.lighting.lights.filter((light) => light.id !== id)
    const nextSelected =
      state.view.lighting.selectedLightId === id
        ? (nextLights[0]?.id ?? null)
        : state.view.lighting.selectedLightId
    set({
      view: normalizeViewSettings({
        ...state.view,
        lighting: {
          selectedLightId: nextSelected,
          lights: nextLights,
        },
      }),
    })
  },
  updateLight: (id, patch) => {
    const state = get()
    const nextLights = state.view.lighting.lights.map((light) => {
      if (light.id !== id) {
        return light
      }
      const next = normalizeLight({ ...light, ...patch })
      if (!hasApplicablePosition(next.type)) {
        next.position = undefined
      }
      if (!hasApplicableTarget(next.type)) {
        next.target = undefined
      }
      if (!hasDistanceSettings(next.type)) {
        next.distance = undefined
        next.decay = undefined
      }
      if (next.type !== 'spot') {
        next.angleDeg = undefined
        next.penumbra = undefined
      }
      if (!supportsShadows(next.type)) {
        next.castShadow = undefined
        next.shadowBias = undefined
        next.shadowMapSize = undefined
      }
      return next
    })

    set({
      view: normalizeViewSettings({
        ...state.view,
        lighting: {
          ...state.view.lighting,
          lights: nextLights,
        },
      }),
    })
  },
  selectMaterialPreset: (id) => {
    const state = get()
    if (!state.view.materials.presets.some((preset) => preset.id === id)) {
      return
    }
    set({
      view: {
        ...state.view,
        materials: {
          ...state.view.materials,
          selectedPresetId: id,
        },
      },
    })
  },
  updateMaterialPreset: (id, patch) => {
    const state = get()
    const nextPresets = state.view.materials.presets.map((preset) =>
      preset.id === id ? sanitizePreset({ ...preset, ...patch, id }) : preset,
    )
    set({
      view: {
        ...state.view,
        materials: {
          ...state.view.materials,
          presets: nextPresets,
        },
      },
    })
  },
  addMaterialPreset: (preset) => {
    const state = get()
    const base =
      state.view.materials.presets.find(
        (candidate) => candidate.id === state.view.materials.selectedPresetId,
      ) ?? state.view.materials.presets[0]

    const id = uniqueMaterialId(state.view.materials.presets)
    const nextPreset = sanitizePreset({
      id,
      name: preset?.name?.trim() || `Preset ${state.view.materials.presets.length + 1}`,
      color: preset?.color ?? base?.color ?? '#d9dde6',
      metalness: preset?.metalness ?? base?.metalness ?? 0.1,
      roughness: preset?.roughness ?? base?.roughness ?? 0.75,
      emissive: preset?.emissive ?? base?.emissive ?? '#ffffff',
      emissiveIntensity: preset?.emissiveIntensity ?? base?.emissiveIntensity ?? 0,
      opacity: preset?.opacity ?? base?.opacity ?? 1,
      transparent: preset?.transparent ?? base?.transparent ?? false,
      doubleSided: preset?.doubleSided ?? base?.doubleSided ?? true,
    })

    set({
      view: {
        ...state.view,
        materials: {
          ...state.view.materials,
          selectedPresetId: nextPreset.id,
          presets: [...state.view.materials.presets, nextPreset],
        },
      },
    })
  },
  deleteMaterialPreset: (id) => {
    const state = get()
    const current = state.view.materials
    if (current.presets.length <= 1) {
      return
    }

    const nextPresets = current.presets.filter((preset) => preset.id !== id)
    if (nextPresets.length === 0) {
      return
    }

    const nextSelectedId =
      current.selectedPresetId === id ? nextPresets[0].id : current.selectedPresetId

    const nextPerPart: PartMaterialMap = {}
    for (const [partId, presetId] of Object.entries(current.perPart)) {
      if (presetId !== id) {
        nextPerPart[partId] = presetId
      }
    }

    set({
      view: {
        ...state.view,
        materials: {
          ...current,
          presets: nextPresets,
          selectedPresetId: nextSelectedId,
          perPart: nextPerPart,
        },
      },
    })
  },
  setUsePerPartMaterial: (enabled) => {
    const state = get()
    set({
      view: {
        ...state.view,
        materials: {
          ...state.view.materials,
          usePerPart: enabled,
        },
      },
    })
  },
  assignPartMaterial: (partId, presetId) => {
    const state = get()
    if (!state.view.materials.presets.some((preset) => preset.id === presetId)) {
      return
    }
    set({
      view: {
        ...state.view,
        materials: {
          ...state.view.materials,
          perPart: {
            ...state.view.materials.perPart,
            [partId]: presetId,
          },
        },
      },
    })
  },
  clearPartMaterial: (partId) => {
    const state = get()
    if (!(partId in state.view.materials.perPart)) {
      return
    }
    const nextPerPart = { ...state.view.materials.perPart }
    delete nextPerPart[partId]
    set({
      view: {
        ...state.view,
        materials: {
          ...state.view.materials,
          perPart: nextPerPart,
        },
      },
    })
  },
  setPerPartMaterialMap: (map) => {
    const state = get()
    set({
      view: {
        ...state.view,
        materials: {
          ...state.view.materials,
          perPart: { ...map },
        },
      },
    })
  },
}))
