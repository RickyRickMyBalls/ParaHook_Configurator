export type ToneMappingMode = 'none' | 'aces'
export type EnvPreset = 'baseline' | 'studio' | 'dark_studio'
export type EnvironmentSourceKind = 'preset' | 'custom' | 'hdri'
export type EnvironmentGradeSettings = {
  toneMapping: ToneMappingMode
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  whites: number
  blacks: number
  temperature: number
  tint: number
  saturation: number
}
export type EnvironmentSourceSettings = {
  kind: EnvironmentSourceKind
  label: string
  assetPath: string | null
  backgroundVisible?: boolean
  intensity?: number
  backgroundIntensity?: number
  rotationDeg?: number
}
export type EnvironmentLookSnapshot = Pick<
  ViewSettings,
  'envPreset' | 'environmentGrade' | 'environmentSource' | 'lighting'
>
export type ProjectionMode = 'perspective' | 'orthographic'
export type ViewDisplayMode = 'solid' | 'wireframe' | 'material' | 'rendered' | 'renderPreview'
export type ViewEdgeDisplayMode = 'on' | 'off' | 'visibleEdgesOnly'
export type ViewGeometryDisplayEdgeMode = 'off' | 'visibleOnly' | 'all'
export type ViewGeometryDisplayEdgeDepthMode = 'surface' | 'xray'
export type ViewGeometryDisplayEdgePreset = 'off' | 'visibleOnly' | 'xray' | 'hiddenLine'
export type ViewGeometryDisplayEdgePresetRead = ViewGeometryDisplayEdgePreset | 'custom'
export type ViewGeometryDisplayEdgeLineStyle = 'solid' | 'dashed'
export type ViewGeometryDisplaySurfaceSource = 'materialSet' | 'custom'
export type ViewportStyle = 'standard' | 'clayStudio'
export type RenderPresetId = ViewportStyle
export type RenderPreviewNoiseCleanup = 'off' | 'low' | 'medium' | 'high'
export type RenderPreviewGpuLoad = 'smooth' | 'balanced' | 'fast'
export type RenderPreviewQualityPreset = 'fast' | 'balanced' | 'clean' | 'high'
export type RenderPreviewQualityPresetRead = RenderPreviewQualityPreset | 'custom'
export type ViewSsaoQuality = 'low' | 'medium' | 'high'
export type ViewAmbientOcclusionType = 'off' | 'basicSsao' | 'sao'
export type ViewAmbientOcclusionPreset = 'off' | ViewSsaoQuality
export type ViewAmbientOcclusionPresetRead = ViewAmbientOcclusionPreset | 'custom'
export type AxisOverlayLabelSize = 'small' | 'medium' | 'large'
export type AxisOverlayBackgroundMode = 'none' | 'blur'
export type GroundMaterialPresetId = 'matte_dark' | 'matte_mid' | 'glossy_studio'
export const DEFAULT_VIEW_DISPLAY_MODE: ViewDisplayMode = 'rendered'
export const DEFAULT_VIEW_EDGE_DISPLAY_MODE: ViewEdgeDisplayMode = 'off'
export const DEFAULT_VIEWPORT_STYLE: ViewportStyle = 'standard'
export const VIEW_DISPLAY_MODES: readonly ViewDisplayMode[] = [
  'solid',
  'wireframe',
  'material',
  'rendered',
  'renderPreview',
]
export const VIEW_EDGE_DISPLAY_MODES: readonly ViewEdgeDisplayMode[] = [
  'on',
  'off',
  'visibleEdgesOnly',
]
export const VIEW_GEOMETRY_DISPLAY_EDGE_MODES: readonly ViewGeometryDisplayEdgeMode[] = [
  'off',
  'visibleOnly',
  'all',
]
export const VIEW_GEOMETRY_DISPLAY_EDGE_DEPTH_MODES: readonly ViewGeometryDisplayEdgeDepthMode[] = [
  'surface',
  'xray',
]
export const VIEW_GEOMETRY_DISPLAY_EDGE_PRESETS: readonly ViewGeometryDisplayEdgePreset[] = [
  'off',
  'visibleOnly',
  'xray',
  'hiddenLine',
]
export const VIEW_GEOMETRY_DISPLAY_EDGE_LINE_STYLES: readonly ViewGeometryDisplayEdgeLineStyle[] = [
  'solid',
  'dashed',
]
export const VIEW_GEOMETRY_DISPLAY_SURFACE_SOURCES: readonly ViewGeometryDisplaySurfaceSource[] = [
  'materialSet',
  'custom',
]
export const VIEWPORT_STYLE_OPTIONS: readonly ViewportStyle[] = [
  'standard',
  'clayStudio',
]
export const VIEW_RENDER_PRESET_OPTIONS: readonly RenderPresetId[] = VIEWPORT_STYLE_OPTIONS
export const RENDER_PREVIEW_NOISE_CLEANUP_OPTIONS: readonly RenderPreviewNoiseCleanup[] = [
  'off',
  'low',
  'medium',
  'high',
]
export const RENDER_PREVIEW_GPU_LOAD_OPTIONS: readonly RenderPreviewGpuLoad[] = [
  'smooth',
  'balanced',
  'fast',
]
export const VIEW_SSAO_QUALITY_OPTIONS: readonly ViewSsaoQuality[] = [
  'low',
  'medium',
  'high',
]
export const VIEW_AMBIENT_OCCLUSION_TYPE_OPTIONS: readonly ViewAmbientOcclusionType[] = [
  'off',
  'basicSsao',
  'sao',
]
export const VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS: readonly ViewAmbientOcclusionPreset[] = [
  'off',
  'low',
  'medium',
  'high',
]
export const MIN_RENDER_PREVIEW_TARGET_SAMPLES = 16
export const MAX_RENDER_PREVIEW_TARGET_SAMPLES = 256
export const DEFAULT_RENDER_PREVIEW_TARGET_SAMPLES = 64
export const MIN_RENDER_PREVIEW_BOUNCES = 1
export const MAX_RENDER_PREVIEW_BOUNCES = 12
export const DEFAULT_RENDER_PREVIEW_BOUNCES = 6
export const MIN_RENDER_PREVIEW_RENDER_SCALE = 0.5
export const MAX_RENDER_PREVIEW_RENDER_SCALE = 1
export const DEFAULT_RENDER_PREVIEW_RENDER_SCALE = 1
export const DEFAULT_RENDER_PREVIEW_NOISE_CLEANUP: RenderPreviewNoiseCleanup = 'off'
export const DEFAULT_RENDER_PREVIEW_GPU_LOAD: RenderPreviewGpuLoad = 'balanced'
export const MIN_VIEW_SSAO_INTENSITY = 0
export const MAX_VIEW_SSAO_INTENSITY = 25
export const DEFAULT_VIEW_SSAO_INTENSITY = 1
export const MIN_VIEW_SSAO_RADIUS = 0
export const MAX_VIEW_SSAO_RADIUS = 25
export const DEFAULT_VIEW_SSAO_RADIUS = 1
export const DEFAULT_VIEW_SSAO_QUALITY: ViewSsaoQuality = 'medium'
export const MIN_VIEW_SSAO_CONTACT_BIAS = 0
export const MAX_VIEW_SSAO_CONTACT_BIAS = 0.1
export const DEFAULT_VIEW_SSAO_CONTACT_BIAS = 0.003
export const MIN_VIEW_SSAO_DISTANCE_THRESHOLD = 0
export const MAX_VIEW_SSAO_DISTANCE_THRESHOLD = 2
export const DEFAULT_VIEW_SSAO_DISTANCE_THRESHOLD = 0.1
export const DEFAULT_VIEW_AMBIENT_OCCLUSION_TYPE: ViewAmbientOcclusionType = 'off'
export const MIN_GRID_PRESENTATION_HEIGHT = -25
export const MAX_GRID_PRESENTATION_HEIGHT = 25
export const MIN_GRID_PRESENTATION_SIZE = 25
export const MAX_GRID_PRESENTATION_SIZE = 1000
export const MIN_GRID_PRESENTATION_SPACING = 0.1
export const MAX_GRID_PRESENTATION_SPACING = 100
export const MIN_GRID_PRESENTATION_OPACITY = 0
export const MAX_GRID_PRESENTATION_OPACITY = 1
export const MIN_GRID_PRESENTATION_HEIGHT_OFFSET = -0.05
export const MAX_GRID_PRESENTATION_HEIGHT_OFFSET = 0.05
export const MIN_CONTACT_SHADOW_OPACITY = 0
export const MAX_CONTACT_SHADOW_OPACITY = 1
export const MIN_CONTACT_SHADOW_SPREAD = 0.5
export const MAX_CONTACT_SHADOW_SPREAD = 2
export const MIN_CONTACT_SHADOW_HEIGHT_FADE = 1
export const MAX_CONTACT_SHADOW_HEIGHT_FADE = 16
export const MIN_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY = 0
export const MAX_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY = 1
export const MIN_VIEW_GEOMETRY_DISPLAY_HIDDEN_LINE_DASH_SIZE = 0.01
export const MAX_VIEW_GEOMETRY_DISPLAY_HIDDEN_LINE_DASH_SIZE = 1
export const MIN_VIEW_GEOMETRY_DISPLAY_HIDDEN_LINE_GAP_SIZE = 0.01
export const MAX_VIEW_GEOMETRY_DISPLAY_HIDDEN_LINE_GAP_SIZE = 1
export const DEFAULT_ENVIRONMENT_BACKGROUND = '#0b0b0f'
export const STUDIO_ENVIRONMENT_BACKGROUND = '#151922'
export const DARK_STUDIO_ENVIRONMENT_BACKGROUND = '#06080d'
export const DEFAULT_ENVIRONMENT_GRADE: EnvironmentGradeSettings = {
  toneMapping: 'aces',
  exposure: 1.15,
  contrast: 1,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  temperature: 0,
  tint: 0,
  saturation: 1,
}

export type LightType = 'directional' | 'point' | 'spot' | 'hemisphere' | 'ambient'

export type Vec3 = { x: number; y: number; z: number }

export type AxisOverlayStyleSettings = {
  mainLineOpacity: number
  secondaryLineOpacity: number
  sphereScale: number
  cameraDistance: number
  labelsVisible: boolean
  labelSize: AxisOverlayLabelSize
  backgroundMode: AxisOverlayBackgroundMode
  backgroundOpacity: number
}

export type LightSpec = {
  id: string
  name: string
  type: LightType
  enabled: boolean
  color: string
  intensity: number
  position?: Vec3
  target?: Vec3
  distance?: number
  angleDeg?: number
  penumbra?: number
  decay?: number
  castShadow?: boolean
  shadowBias?: number
  shadowMapSize?: number
}

export type MaterialPresetId = string

export type MaterialPreset = {
  id: MaterialPresetId
  name: string
  color: string
  metalness: number
  roughness: number
  emissive: string
  emissiveIntensity: number
  opacity: number
  transparent: boolean
  doubleSided: boolean
}

type MaterialPresetInput = Omit<MaterialPreset, 'doubleSided'> & {
  doubleSided?: boolean
}

export type PartMaterialMap = Record<string, MaterialPresetId>

export type GroundSettings = {
  enabled: boolean
  height: number
  materialPresetId: GroundMaterialPresetId
}

export type GridPresentationLayerId = 'grid1' | 'grid2' | 'grid3'

export type GridPresentationLayerSettings = {
  id: GridPresentationLayerId
  enabled: boolean
  spacing: number
  color: string
  opacity: number
  heightOffset: number
}

export type GridPresentationSettings = {
  height: number
  size: number
  layers: GridPresentationLayerSettings[]
}

export type RenderPreviewSettings = {
  targetSamples: number
  bounces: number
  renderScale: number
  noiseCleanup: RenderPreviewNoiseCleanup
  gpuLoad: RenderPreviewGpuLoad
}

export type ViewPostProcessSettings = {
  aoType: ViewAmbientOcclusionType
  ssaoEnabled: boolean
  ssaoIntensity: number
  ssaoRadius: number
  ssaoQuality: ViewSsaoQuality
  ssaoContactBias: number
  ssaoDistanceThreshold: number
}

export type ViewContactShadowSettings = {
  enabled: boolean
  opacity: number
  spread: number
  heightFade: number
}

export type ViewGeometryDisplaySettings = {
  surfaces: {
    visible: boolean
    source: ViewGeometryDisplaySurfaceSource
    customMaterial: MaterialPreset
    hover: ViewGeometryDisplaySurfaceStyle
    selected: ViewGeometryDisplaySurfaceStyle
    bodySelected: ViewGeometryDisplaySurfaceStyle
  }
  edges: {
    preset: ViewGeometryDisplayEdgePreset
    mode: ViewGeometryDisplayEdgeMode
    color: string
    opacity: number
    depthMode: ViewGeometryDisplayEdgeDepthMode
    hiddenEdges: boolean
    lineStyle: ViewGeometryDisplayEdgeLineStyle
    hiddenLine: ViewGeometryDisplayHiddenLineStyle
    hover: ViewGeometryDisplayEdgeInteractionStyle
    selected: ViewGeometryDisplayEdgeInteractionStyle
  }
  points: {
    visible: boolean
  }
}

export type ViewGeometryDisplaySurfaceStyle = {
  color: string
  opacity: number
}

export type ViewGeometryDisplayEdgeInteractionStyle = {
  color: string
  opacity: number
}

export type ViewGeometryDisplayHiddenLineStyle = {
  color: string
  opacity: number
  dashSize: number
  gapSize: number
}

export type ViewHighlightSettings = {
  hoverColor: string
  selectedColor: string
  bodySelectedColor: string
  hoverGlow: number
  selectedGlow: number
  pointHoverSize: number
  pointSelectedSize: number
  edgeHoverThickness: number
  edgeSelectedThickness: number
  surfaceHoverOpacity: number
  surfaceSelectedOpacity: number
  bodySelectedOpacity: number
}

export type ViewSettings = {
  projectionMode: ProjectionMode
  orbitEnabled: boolean
  gridVisible: boolean
  axesVisible: boolean
  shadowsEnabled: boolean
  wireframe: boolean
  displayMode: ViewDisplayMode
  edgeDisplayMode: ViewEdgeDisplayMode
  geometryDisplay: ViewGeometryDisplaySettings
  viewportStyle: ViewportStyle
  envPreset: EnvPreset
  environmentGrade: EnvironmentGradeSettings
  environmentSource: EnvironmentSourceSettings
  ground: GroundSettings
  gridPresentation: GridPresentationSettings
  renderPreview: RenderPreviewSettings
  postProcessing: ViewPostProcessSettings
  contactShadows: ViewContactShadowSettings
  highlights: ViewHighlightSettings
  axisOverlayEnabled: boolean
  axisOverlayStyle: AxisOverlayStyleSettings
  lighting: {
    selectedLightId: string | null
    lights: LightSpec[]
  }
  materials: {
    presets: MaterialPreset[]
    selectedPresetId: MaterialPresetId
    usePerPart: boolean
    perPart: PartMaterialMap
  }
}

const cloneVec3 = (value: Vec3 | undefined): Vec3 | undefined =>
  value === undefined ? undefined : { ...value }

const cloneLightSpec = (light: LightSpec): LightSpec => ({
  ...light,
  position: cloneVec3(light.position),
  target: cloneVec3(light.target),
})

const cloneLightingSettings = (
  lighting: ViewSettings['lighting'],
): ViewSettings['lighting'] => ({
  selectedLightId: lighting.selectedLightId,
  lights: lighting.lights.map(cloneLightSpec),
})

const cloneGridPresentationLayer = (
  layer: GridPresentationLayerSettings,
): GridPresentationLayerSettings => ({
  ...layer,
})

const cloneGridPresentationSettings = (
  settings: GridPresentationSettings,
): GridPresentationSettings => ({
  height: settings.height,
  size: settings.size,
  layers: settings.layers.map(cloneGridPresentationLayer),
})

const normalizeMaterialPreset = (preset: MaterialPresetInput): MaterialPreset => ({
  ...preset,
  doubleSided: preset.doubleSided ?? true,
})

const cloneEnvironmentSource = (
  source: EnvironmentSourceSettings,
): EnvironmentSourceSettings => ({
  ...source,
})

const cloneEnvironmentLookSnapshot = (
  look: EnvironmentLookSnapshot,
): EnvironmentLookSnapshot => ({
  envPreset: look.envPreset,
  environmentGrade: cloneEnvironmentGrade(look.environmentGrade),
  environmentSource: cloneEnvironmentSource(look.environmentSource),
  lighting: cloneLightingSettings(look.lighting),
})

const cloneEnvironmentGrade = (
  grade: EnvironmentGradeSettings,
): EnvironmentGradeSettings => ({
  ...grade,
})

const normalizeEnvironmentGradeValue = (
  value: number | undefined,
  fallback: number,
  min: number,
  max: number,
): number => {
  const normalizedValue =
    typeof value === 'number' && Number.isFinite(value) ? value : fallback
  return Math.min(max, Math.max(min, normalizedValue))
}

const normalizeNumber = (
  value: number | undefined,
  fallback: number,
  min: number,
  max: number,
): number => {
  const normalizedValue =
    typeof value === 'number' && Number.isFinite(value) ? value : fallback
  return Math.min(max, Math.max(min, normalizedValue))
}

const GRID_PRESENTATION_LAYER_IDS: readonly GridPresentationLayerId[] = [
  'grid1',
  'grid2',
  'grid3',
]

const isGridPresentationLayerId = (value: unknown): value is GridPresentationLayerId =>
  typeof value === 'string' &&
  GRID_PRESENTATION_LAYER_IDS.includes(value as GridPresentationLayerId)

const normalizeHexColor = (value: unknown, fallback: string): string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback

const normalizeInteger = (
  value: number | undefined,
  fallback: number,
  min: number,
  max: number,
): number =>
  Math.round(normalizeNumber(value, fallback, min, max))

export const isViewDisplayMode = (value: unknown): value is ViewDisplayMode =>
  typeof value === 'string' &&
  VIEW_DISPLAY_MODES.includes(value as ViewDisplayMode)

export const isViewEdgeDisplayMode = (value: unknown): value is ViewEdgeDisplayMode =>
  typeof value === 'string' &&
  VIEW_EDGE_DISPLAY_MODES.includes(value as ViewEdgeDisplayMode)

export const isViewGeometryDisplayEdgeMode = (
  value: unknown,
): value is ViewGeometryDisplayEdgeMode =>
  typeof value === 'string' &&
  VIEW_GEOMETRY_DISPLAY_EDGE_MODES.includes(value as ViewGeometryDisplayEdgeMode)

export const isViewGeometryDisplayEdgeDepthMode = (
  value: unknown,
): value is ViewGeometryDisplayEdgeDepthMode =>
  typeof value === 'string' &&
  VIEW_GEOMETRY_DISPLAY_EDGE_DEPTH_MODES.includes(value as ViewGeometryDisplayEdgeDepthMode)

export const isViewGeometryDisplayEdgePreset = (
  value: unknown,
): value is ViewGeometryDisplayEdgePreset =>
  typeof value === 'string' &&
  VIEW_GEOMETRY_DISPLAY_EDGE_PRESETS.includes(value as ViewGeometryDisplayEdgePreset)

export const isViewGeometryDisplayEdgeLineStyle = (
  value: unknown,
): value is ViewGeometryDisplayEdgeLineStyle =>
  typeof value === 'string' &&
  VIEW_GEOMETRY_DISPLAY_EDGE_LINE_STYLES.includes(value as ViewGeometryDisplayEdgeLineStyle)

export const isViewGeometryDisplaySurfaceSource = (
  value: unknown,
): value is ViewGeometryDisplaySurfaceSource =>
  typeof value === 'string' &&
  VIEW_GEOMETRY_DISPLAY_SURFACE_SOURCES.includes(value as ViewGeometryDisplaySurfaceSource)

export const isViewportStyle = (value: unknown): value is ViewportStyle =>
  typeof value === 'string' && VIEWPORT_STYLE_OPTIONS.includes(value as ViewportStyle)

export const isViewRenderPresetId = (value: unknown): value is RenderPresetId =>
  typeof value === 'string' && VIEW_RENDER_PRESET_OPTIONS.includes(value as RenderPresetId)

export const createDisplayModeViewPatch = (
  displayMode: ViewDisplayMode,
): Pick<ViewSettings, 'displayMode'> => ({
  displayMode,
})

export const geometryDisplayEdgeModeToViewEdgeDisplayMode = (
  mode: ViewGeometryDisplayEdgeMode,
): ViewEdgeDisplayMode => {
  if (mode === 'all') {
    return 'on'
  }
  if (mode === 'visibleOnly') {
    return 'visibleEdgesOnly'
  }
  return 'off'
}

export const viewEdgeDisplayModeToGeometryDisplayEdgeMode = (
  mode: ViewEdgeDisplayMode,
): ViewGeometryDisplayEdgeMode => {
  if (mode === 'on') {
    return 'all'
  }
  if (mode === 'visibleEdgesOnly') {
    return 'visibleOnly'
  }
  return 'off'
}

export const geometryDisplayEdgePresetToMode = (
  preset: ViewGeometryDisplayEdgePreset,
): ViewGeometryDisplayEdgeMode => {
  if (preset === 'xray' || preset === 'hiddenLine') {
    return 'all'
  }
  return preset
}

export const geometryDisplayEdgePresetToDepthMode = (
  preset: ViewGeometryDisplayEdgePreset,
): ViewGeometryDisplayEdgeDepthMode => {
  if (preset === 'visibleOnly') {
    return 'surface'
  }
  return 'xray'
}

export const geometryDisplayEdgePresetToHiddenEdges = (
  preset: ViewGeometryDisplayEdgePreset,
): boolean => preset === 'hiddenLine'

export const geometryDisplayEdgePresetToLineStyle = (
  preset: ViewGeometryDisplayEdgePreset,
): ViewGeometryDisplayEdgeLineStyle => (preset === 'hiddenLine' ? 'dashed' : 'solid')

export const geometryDisplayEdgeModeAndDepthToPreset = (
  mode: ViewGeometryDisplayEdgeMode,
  depthMode: ViewGeometryDisplayEdgeDepthMode,
): ViewGeometryDisplayEdgePreset => {
  if (mode === 'off') {
    return 'off'
  }
  if (mode === 'visibleOnly' || depthMode === 'surface') {
    return 'visibleOnly'
  }
  return 'xray'
}

const doesGeometryDisplayEdgeRecipeMatchPreset = (
  edges: Pick<
    ViewGeometryDisplaySettings['edges'],
    'mode' | 'depthMode' | 'hiddenEdges' | 'lineStyle'
  >,
  preset: ViewGeometryDisplayEdgePreset,
): boolean => {
  const expectedHiddenEdges = geometryDisplayEdgePresetToHiddenEdges(preset)
  const actualLineStyle = edges.hiddenEdges ? edges.lineStyle : 'solid'
  const expectedLineStyle = expectedHiddenEdges
    ? geometryDisplayEdgePresetToLineStyle(preset)
    : 'solid'

  return (
    edges.mode === geometryDisplayEdgePresetToMode(preset) &&
    edges.depthMode === geometryDisplayEdgePresetToDepthMode(preset) &&
    edges.hiddenEdges === expectedHiddenEdges &&
    actualLineStyle === expectedLineStyle
  )
}

export const resolveViewGeometryDisplayEdgePresetRead = (
  edges: Pick<
    ViewGeometryDisplaySettings['edges'],
    'preset' | 'mode' | 'depthMode' | 'hiddenEdges' | 'lineStyle'
  >,
): ViewGeometryDisplayEdgePresetRead => {
  const matchingPreset = VIEW_GEOMETRY_DISPLAY_EDGE_PRESETS.find((preset) =>
    doesGeometryDisplayEdgeRecipeMatchPreset(edges, preset),
  )

  return matchingPreset ?? 'custom'
}

export const createRenderPresetViewPatch = (
  renderPresetId: RenderPresetId,
  currentView: Pick<ViewSettings, 'displayMode' | 'ground' | 'gridPresentation'>,
): Pick<
  ViewSettings,
  | 'displayMode'
  | 'viewportStyle'
  | 'environmentGrade'
  | 'shadowsEnabled'
  | 'ground'
  | 'gridVisible'
  | 'gridPresentation'
  | 'postProcessing'
  | 'contactShadows'
> => {
  if (renderPresetId === 'clayStudio') {
    return {
      viewportStyle: renderPresetId,
      displayMode: 'rendered',
      environmentGrade: { ...CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE },
      shadowsEnabled: false,
      ground: {
        ...currentView.ground,
        enabled: true,
      },
      gridVisible: false,
      gridPresentation: cloneGridPresentationSettings(currentView.gridPresentation),
      postProcessing: createViewAmbientOcclusionPresetSettings('medium'),
      contactShadows: {
        ...CLAY_STUDIO_CONTACT_SHADOW_SETTINGS,
      },
    }
  }
  return {
    viewportStyle: renderPresetId,
    displayMode: currentView.displayMode,
    environmentGrade: cloneEnvironmentGrade(DEFAULT_VIEW_SETTINGS.environmentGrade),
    shadowsEnabled: DEFAULT_VIEW_SETTINGS.shadowsEnabled,
    ground: { ...DEFAULT_VIEW_SETTINGS.ground },
    gridVisible: DEFAULT_VIEW_SETTINGS.gridVisible,
    gridPresentation: cloneGridPresentationSettings(DEFAULT_VIEW_SETTINGS.gridPresentation),
    postProcessing: normalizeViewPostProcessSettings(DEFAULT_VIEW_SETTINGS.postProcessing),
    contactShadows: normalizeViewContactShadowSettings(DEFAULT_VIEW_SETTINGS.contactShadows),
  }
}

export const isRenderPreviewNoiseCleanup = (
  value: unknown,
): value is RenderPreviewNoiseCleanup =>
  typeof value === 'string' &&
  RENDER_PREVIEW_NOISE_CLEANUP_OPTIONS.includes(value as RenderPreviewNoiseCleanup)

export const isRenderPreviewGpuLoad = (value: unknown): value is RenderPreviewGpuLoad =>
  typeof value === 'string' &&
  RENDER_PREVIEW_GPU_LOAD_OPTIONS.includes(value as RenderPreviewGpuLoad)

export const isViewSsaoQuality = (value: unknown): value is ViewSsaoQuality =>
  typeof value === 'string' && VIEW_SSAO_QUALITY_OPTIONS.includes(value as ViewSsaoQuality)

export const isViewAmbientOcclusionType = (
  value: unknown,
): value is ViewAmbientOcclusionType =>
  typeof value === 'string' &&
  VIEW_AMBIENT_OCCLUSION_TYPE_OPTIONS.includes(value as ViewAmbientOcclusionType)

export const DEFAULT_RENDER_PREVIEW_SETTINGS: RenderPreviewSettings = {
  targetSamples: DEFAULT_RENDER_PREVIEW_TARGET_SAMPLES,
  bounces: DEFAULT_RENDER_PREVIEW_BOUNCES,
  renderScale: DEFAULT_RENDER_PREVIEW_RENDER_SCALE,
  noiseCleanup: DEFAULT_RENDER_PREVIEW_NOISE_CLEANUP,
  gpuLoad: DEFAULT_RENDER_PREVIEW_GPU_LOAD,
}

export const DEFAULT_VIEW_POST_PROCESS_SETTINGS: ViewPostProcessSettings = {
  aoType: DEFAULT_VIEW_AMBIENT_OCCLUSION_TYPE,
  ssaoEnabled: false,
  ssaoIntensity: DEFAULT_VIEW_SSAO_INTENSITY,
  ssaoRadius: DEFAULT_VIEW_SSAO_RADIUS,
  ssaoQuality: DEFAULT_VIEW_SSAO_QUALITY,
  ssaoContactBias: DEFAULT_VIEW_SSAO_CONTACT_BIAS,
  ssaoDistanceThreshold: DEFAULT_VIEW_SSAO_DISTANCE_THRESHOLD,
}

export const DEFAULT_VIEW_CONTACT_SHADOW_SETTINGS: ViewContactShadowSettings = {
  enabled: false,
  opacity: 1,
  spread: 1,
  heightFade: 8,
}

export const CLAY_STUDIO_CONTACT_SHADOW_SETTINGS: ViewContactShadowSettings = {
  enabled: true,
  opacity: 1,
  spread: 1,
  heightFade: 8,
}

export const CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE: EnvironmentGradeSettings = {
  toneMapping: 'aces',
  exposure: 1.28,
  contrast: 0.86,
  highlights: -4,
  shadows: 36,
  whites: 16,
  blacks: 4,
  temperature: 0,
  tint: 0,
  saturation: 0.82,
}

const VIEW_AMBIENT_OCCLUSION_PRESET_SETTINGS: Record<
  ViewAmbientOcclusionPreset,
  ViewPostProcessSettings
> = {
  off: DEFAULT_VIEW_POST_PROCESS_SETTINGS,
  low: {
    aoType: 'basicSsao',
    ssaoEnabled: true,
    ssaoIntensity: 0.55,
    ssaoRadius: 1.15,
    ssaoQuality: 'low',
    ssaoContactBias: 0.0021,
    ssaoDistanceThreshold: 0.06625,
  },
  medium: {
    aoType: 'basicSsao',
    ssaoEnabled: true,
    ssaoIntensity: 0.82,
    ssaoRadius: 1.85,
    ssaoQuality: 'medium',
    ssaoContactBias: 0.00264,
    ssaoDistanceThreshold: 0.0865,
  },
  high: {
    aoType: 'basicSsao',
    ssaoEnabled: true,
    ssaoIntensity: 1.05,
    ssaoRadius: 2.65,
    ssaoQuality: 'high',
    ssaoContactBias: 0.0031,
    ssaoDistanceThreshold: 0.10375,
  },
}

export const DEFAULT_VIEW_HIGHLIGHT_SETTINGS: ViewHighlightSettings = {
  hoverColor: '#f5f7fb',
  selectedColor: '#2f80ff',
  bodySelectedColor: '#8fb3df',
  hoverGlow: 0.45,
  selectedGlow: 0.6,
  pointHoverSize: 0.06,
  pointSelectedSize: 0.07,
  edgeHoverThickness: 1.4,
  edgeSelectedThickness: 1.7,
  surfaceHoverOpacity: 0.26,
  surfaceSelectedOpacity: 0.58,
  bodySelectedOpacity: 0.42,
}

export const normalizeViewHighlightSettings = (
  settings: Partial<ViewHighlightSettings> | undefined,
  fallback: ViewHighlightSettings = DEFAULT_VIEW_HIGHLIGHT_SETTINGS,
): ViewHighlightSettings => ({
  hoverColor: normalizeHexColor(settings?.hoverColor, fallback.hoverColor),
  selectedColor: normalizeHexColor(settings?.selectedColor, fallback.selectedColor),
  bodySelectedColor: normalizeHexColor(
    settings?.bodySelectedColor,
    fallback.bodySelectedColor,
  ),
  hoverGlow: normalizeNumber(settings?.hoverGlow, fallback.hoverGlow, 0, 1),
  selectedGlow: normalizeNumber(settings?.selectedGlow, fallback.selectedGlow, 0, 1),
  pointHoverSize: normalizeNumber(settings?.pointHoverSize, fallback.pointHoverSize, 0.02, 0.2),
  pointSelectedSize: normalizeNumber(
    settings?.pointSelectedSize,
    fallback.pointSelectedSize,
    0.02,
    0.2,
  ),
  edgeHoverThickness: normalizeNumber(
    settings?.edgeHoverThickness,
    fallback.edgeHoverThickness,
    0.5,
    6,
  ),
  edgeSelectedThickness: normalizeNumber(
    settings?.edgeSelectedThickness,
    fallback.edgeSelectedThickness,
    0.5,
    6,
  ),
  surfaceHoverOpacity: normalizeNumber(
    settings?.surfaceHoverOpacity,
    fallback.surfaceHoverOpacity,
    0.05,
    0.9,
  ),
  surfaceSelectedOpacity: normalizeNumber(
    settings?.surfaceSelectedOpacity,
    fallback.surfaceSelectedOpacity,
    0.05,
    0.95,
  ),
  bodySelectedOpacity: normalizeNumber(
    settings?.bodySelectedOpacity,
    fallback.bodySelectedOpacity,
    0.05,
    0.85,
  ),
})

export type RenderPreviewQualityPresetDefinition = {
  id: RenderPreviewQualityPreset
  label: string
  settings: RenderPreviewSettings
}

export const RENDER_PREVIEW_QUALITY_PRESET_DEFINITIONS: readonly RenderPreviewQualityPresetDefinition[] =
  [
    {
      id: 'fast',
      label: 'Fast',
      settings: {
        targetSamples: 32,
        bounces: 3,
        renderScale: 0.5,
        noiseCleanup: 'off',
        gpuLoad: 'smooth',
      },
    },
    {
      id: 'balanced',
      label: 'Balanced',
      settings: DEFAULT_RENDER_PREVIEW_SETTINGS,
    },
    {
      id: 'clean',
      label: 'Clean',
      settings: {
        targetSamples: 128,
        bounces: 8,
        renderScale: 1,
        noiseCleanup: 'medium',
        gpuLoad: 'balanced',
      },
    },
    {
      id: 'high',
      label: 'High',
      settings: {
        targetSamples: 256,
        bounces: 12,
        renderScale: 1,
        noiseCleanup: 'high',
        gpuLoad: 'fast',
      },
    },
  ]

export const CUSTOM_RENDER_PREVIEW_QUALITY_PRESET_OPTION = {
  value: 'custom' as const,
  label: 'Custom',
}

export const RENDER_PREVIEW_QUALITY_PRESET_OPTIONS = [
  ...RENDER_PREVIEW_QUALITY_PRESET_DEFINITIONS.map((preset) => ({
    value: preset.id,
    label: preset.label,
  })),
  CUSTOM_RENDER_PREVIEW_QUALITY_PRESET_OPTION,
]

export const normalizeRenderPreviewSettings = (
  settings: Partial<RenderPreviewSettings> | undefined,
  fallback: RenderPreviewSettings = DEFAULT_RENDER_PREVIEW_SETTINGS,
): RenderPreviewSettings => ({
  targetSamples: normalizeInteger(
    settings?.targetSamples,
    fallback.targetSamples,
    MIN_RENDER_PREVIEW_TARGET_SAMPLES,
    MAX_RENDER_PREVIEW_TARGET_SAMPLES,
  ),
  bounces: normalizeInteger(
    settings?.bounces,
    fallback.bounces,
    MIN_RENDER_PREVIEW_BOUNCES,
    MAX_RENDER_PREVIEW_BOUNCES,
  ),
  renderScale: normalizeNumber(
    settings?.renderScale,
    fallback.renderScale,
    MIN_RENDER_PREVIEW_RENDER_SCALE,
    MAX_RENDER_PREVIEW_RENDER_SCALE,
  ),
  noiseCleanup: isRenderPreviewNoiseCleanup(settings?.noiseCleanup)
    ? settings.noiseCleanup
    : fallback.noiseCleanup,
  gpuLoad: isRenderPreviewGpuLoad(settings?.gpuLoad) ? settings.gpuLoad : fallback.gpuLoad,
})

const resolveViewAmbientOcclusionType = (
  settings: Partial<ViewPostProcessSettings> | undefined,
  fallback: ViewPostProcessSettings = DEFAULT_VIEW_POST_PROCESS_SETTINGS,
): ViewAmbientOcclusionType => {
  if (isViewAmbientOcclusionType(settings?.aoType)) {
    return settings.aoType
  }
  if (typeof settings?.ssaoEnabled === 'boolean') {
    return settings.ssaoEnabled ? 'basicSsao' : 'off'
  }
  return fallback.aoType
}

export const normalizeViewPostProcessSettings = (
  settings: Partial<ViewPostProcessSettings> | undefined,
  fallback: ViewPostProcessSettings = DEFAULT_VIEW_POST_PROCESS_SETTINGS,
): ViewPostProcessSettings => {
  const aoType = resolveViewAmbientOcclusionType(settings, fallback)
  return {
    aoType,
    ssaoEnabled: aoType !== 'off',
    ssaoIntensity: normalizeNumber(
      settings?.ssaoIntensity,
      fallback.ssaoIntensity,
      MIN_VIEW_SSAO_INTENSITY,
      MAX_VIEW_SSAO_INTENSITY,
    ),
    ssaoRadius: normalizeNumber(
      settings?.ssaoRadius,
      fallback.ssaoRadius,
      MIN_VIEW_SSAO_RADIUS,
      MAX_VIEW_SSAO_RADIUS,
    ),
    ssaoQuality: isViewSsaoQuality(settings?.ssaoQuality)
      ? settings.ssaoQuality
      : fallback.ssaoQuality,
    ssaoContactBias: normalizeNumber(
      settings?.ssaoContactBias,
      fallback.ssaoContactBias,
      MIN_VIEW_SSAO_CONTACT_BIAS,
      MAX_VIEW_SSAO_CONTACT_BIAS,
    ),
    ssaoDistanceThreshold: normalizeNumber(
      settings?.ssaoDistanceThreshold,
      fallback.ssaoDistanceThreshold,
      MIN_VIEW_SSAO_DISTANCE_THRESHOLD,
      MAX_VIEW_SSAO_DISTANCE_THRESHOLD,
    ),
  }
}

export const normalizeViewContactShadowSettings = (
  settings: Partial<ViewContactShadowSettings> | undefined,
  fallback: ViewContactShadowSettings = DEFAULT_VIEW_CONTACT_SHADOW_SETTINGS,
): ViewContactShadowSettings => ({
  enabled: typeof settings?.enabled === 'boolean' ? settings.enabled : fallback.enabled,
  opacity: normalizeNumber(
    settings?.opacity,
    fallback.opacity,
    MIN_CONTACT_SHADOW_OPACITY,
    MAX_CONTACT_SHADOW_OPACITY,
  ),
  spread: normalizeNumber(
    settings?.spread,
    fallback.spread,
    MIN_CONTACT_SHADOW_SPREAD,
    MAX_CONTACT_SHADOW_SPREAD,
  ),
  heightFade: normalizeNumber(
    settings?.heightFade,
    fallback.heightFade,
    MIN_CONTACT_SHADOW_HEIGHT_FADE,
    MAX_CONTACT_SHADOW_HEIGHT_FADE,
  ),
})

export const isViewAmbientOcclusionPreset = (
  value: unknown,
): value is ViewAmbientOcclusionPreset =>
  typeof value === 'string' &&
  VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS.includes(value as ViewAmbientOcclusionPreset)

export const createViewAmbientOcclusionPresetSettings = (
  preset: ViewAmbientOcclusionPreset,
): ViewPostProcessSettings =>
  normalizeViewPostProcessSettings(VIEW_AMBIENT_OCCLUSION_PRESET_SETTINGS[preset])

export const isViewBasicSsaoEnabled = (settings: ViewPostProcessSettings): boolean =>
  settings.aoType === 'basicSsao'

export const isViewPostProcessingAoEnabled = (settings: ViewPostProcessSettings): boolean =>
  settings.aoType !== 'off'

export const areViewPostProcessSettingsEqual = (
  left: ViewPostProcessSettings,
  right: ViewPostProcessSettings,
): boolean =>
  left.aoType === right.aoType &&
  left.ssaoEnabled === right.ssaoEnabled &&
  left.ssaoIntensity === right.ssaoIntensity &&
  left.ssaoRadius === right.ssaoRadius &&
  left.ssaoQuality === right.ssaoQuality &&
  left.ssaoContactBias === right.ssaoContactBias &&
  left.ssaoDistanceThreshold === right.ssaoDistanceThreshold

export const resolveViewAmbientOcclusionPresetRead = (
  settings: ViewPostProcessSettings,
): ViewAmbientOcclusionPresetRead => {
  const normalizedSettings = normalizeViewPostProcessSettings(settings)
  if (normalizedSettings.aoType === 'off') {
    return 'off'
  }
  if (!isViewBasicSsaoEnabled(normalizedSettings)) {
    return 'custom'
  }

  const matchingPreset = VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS.find((preset) =>
    areViewPostProcessSettingsEqual(
      normalizedSettings,
      VIEW_AMBIENT_OCCLUSION_PRESET_SETTINGS[preset],
    ),
  )

  return matchingPreset ?? 'custom'
}

export const areRenderPreviewSettingsEqual = (
  left: RenderPreviewSettings,
  right: RenderPreviewSettings,
): boolean =>
  left.targetSamples === right.targetSamples &&
  left.bounces === right.bounces &&
  left.renderScale === right.renderScale &&
  left.noiseCleanup === right.noiseCleanup &&
  left.gpuLoad === right.gpuLoad

export const getRenderPreviewQualityPresetDefinition = (
  preset: RenderPreviewQualityPreset,
): RenderPreviewQualityPresetDefinition =>
  RENDER_PREVIEW_QUALITY_PRESET_DEFINITIONS.find((definition) => definition.id === preset) ??
  RENDER_PREVIEW_QUALITY_PRESET_DEFINITIONS[1]

export const createRenderPreviewQualityPresetSettings = (
  preset: RenderPreviewQualityPreset,
): RenderPreviewSettings =>
  normalizeRenderPreviewSettings(getRenderPreviewQualityPresetDefinition(preset).settings)

export const resolveRenderPreviewQualityPresetRead = (
  settings: RenderPreviewSettings,
): RenderPreviewQualityPresetRead => {
  const normalizedSettings = normalizeRenderPreviewSettings(settings)
  const matchingPreset = RENDER_PREVIEW_QUALITY_PRESET_DEFINITIONS.find((preset) =>
    areRenderPreviewSettingsEqual(normalizedSettings, preset.settings),
  )

  return matchingPreset?.id ?? 'custom'
}

const normalizeViewDisplayMode = (
  displayMode: unknown,
  legacyWireframe: boolean | undefined,
): ViewDisplayMode => {
  if (isViewDisplayMode(displayMode)) {
    return displayMode
  }

  return legacyWireframe === true ? 'wireframe' : DEFAULT_VIEW_DISPLAY_MODE
}

const normalizeViewEdgeDisplayMode = (
  edgeDisplayMode: unknown,
  displayMode: ViewDisplayMode,
): ViewEdgeDisplayMode => {
  if (isViewEdgeDisplayMode(edgeDisplayMode)) {
    return edgeDisplayMode
  }

  return displayMode === 'wireframe' ? 'on' : DEFAULT_VIEW_EDGE_DISPLAY_MODE
}

export const normalizeViewGeometryDisplayCustomMaterial = (
  material: Partial<MaterialPreset> | undefined,
  fallback: MaterialPreset = DEFAULT_VIEW_GEOMETRY_DISPLAY_CUSTOM_SURFACE_MATERIAL,
): MaterialPreset => ({
  id:
    typeof material?.id === 'string' && material.id.trim().length > 0
      ? material.id
      : fallback.id,
  name:
    typeof material?.name === 'string' && material.name.trim().length > 0
      ? material.name
      : fallback.name,
  color: normalizeHexColor(material?.color, fallback.color),
  metalness: normalizeNumber(material?.metalness, fallback.metalness, 0, 1),
  roughness: normalizeNumber(material?.roughness, fallback.roughness, 0, 1),
  emissive: normalizeHexColor(material?.emissive, fallback.emissive),
  emissiveIntensity: normalizeNumber(
    material?.emissiveIntensity,
    fallback.emissiveIntensity,
    0,
    2,
  ),
  opacity: normalizeNumber(material?.opacity, fallback.opacity, 0, 1),
  transparent:
    typeof material?.transparent === 'boolean'
      ? material.transparent
      : fallback.transparent,
  doubleSided:
    typeof material?.doubleSided === 'boolean'
      ? material.doubleSided
      : fallback.doubleSided,
})

const normalizeViewGeometryDisplaySurfaceStyle = (
  style: Partial<ViewGeometryDisplaySurfaceStyle> | undefined,
  fallback: ViewGeometryDisplaySurfaceStyle,
  minOpacity: number,
  maxOpacity: number,
): ViewGeometryDisplaySurfaceStyle => ({
  color: normalizeHexColor(style?.color, fallback.color),
  opacity: normalizeNumber(style?.opacity, fallback.opacity, minOpacity, maxOpacity),
})

const normalizeViewGeometryDisplayEdgeInteractionStyle = (
  style: Partial<ViewGeometryDisplayEdgeInteractionStyle> | undefined,
  fallback: ViewGeometryDisplayEdgeInteractionStyle,
): ViewGeometryDisplayEdgeInteractionStyle => ({
  color: normalizeHexColor(style?.color, fallback.color),
  opacity: normalizeNumber(style?.opacity, fallback.opacity, 0, 1),
})

const normalizeViewGeometryDisplayHiddenLineStyle = (
  style: Partial<ViewGeometryDisplayHiddenLineStyle> | undefined,
  fallback: ViewGeometryDisplayHiddenLineStyle,
): ViewGeometryDisplayHiddenLineStyle => ({
  color: normalizeHexColor(style?.color, fallback.color),
  opacity: normalizeNumber(style?.opacity, fallback.opacity, 0, 1),
  dashSize: normalizeNumber(
    style?.dashSize,
    fallback.dashSize,
    MIN_VIEW_GEOMETRY_DISPLAY_HIDDEN_LINE_DASH_SIZE,
    MAX_VIEW_GEOMETRY_DISPLAY_HIDDEN_LINE_DASH_SIZE,
  ),
  gapSize: normalizeNumber(
    style?.gapSize,
    fallback.gapSize,
    MIN_VIEW_GEOMETRY_DISPLAY_HIDDEN_LINE_GAP_SIZE,
    MAX_VIEW_GEOMETRY_DISPLAY_HIDDEN_LINE_GAP_SIZE,
  ),
})

export const normalizeViewGeometryDisplaySettings = (
  settings: LegacyViewSettingsInput['geometryDisplay'] | undefined,
  fallback: ViewGeometryDisplaySettings = DEFAULT_VIEW_GEOMETRY_DISPLAY_SETTINGS,
  legacyEdgeDisplayMode?: ViewEdgeDisplayMode,
): ViewGeometryDisplaySettings => ({
  surfaces: {
    visible:
      typeof settings?.surfaces?.visible === 'boolean'
        ? settings.surfaces.visible
        : fallback.surfaces.visible,
    source: isViewGeometryDisplaySurfaceSource(settings?.surfaces?.source)
      ? settings.surfaces.source
      : fallback.surfaces.source,
    customMaterial: normalizeViewGeometryDisplayCustomMaterial(
      settings?.surfaces?.customMaterial,
      fallback.surfaces.customMaterial,
    ),
    hover: normalizeViewGeometryDisplaySurfaceStyle(
      settings?.surfaces?.hover,
      fallback.surfaces.hover,
      0.05,
      0.9,
    ),
    selected: normalizeViewGeometryDisplaySurfaceStyle(
      settings?.surfaces?.selected,
      fallback.surfaces.selected,
      0.05,
      0.95,
    ),
    bodySelected: normalizeViewGeometryDisplaySurfaceStyle(
      settings?.surfaces?.bodySelected,
      fallback.surfaces.bodySelected,
      0.05,
      0.85,
    ),
  },
  edges: (() => {
    const legacyMode = isViewGeometryDisplayEdgeMode(settings?.edges?.mode)
      ? settings.edges.mode
      : legacyEdgeDisplayMode === undefined
        ? fallback.edges.mode
        : viewEdgeDisplayModeToGeometryDisplayEdgeMode(legacyEdgeDisplayMode)
    const legacyDepthMode = isViewGeometryDisplayEdgeDepthMode(settings?.edges?.depthMode)
      ? settings.edges.depthMode
      : fallback.edges.depthMode
    const preset = isViewGeometryDisplayEdgePreset(settings?.edges?.preset)
      ? settings.edges.preset
      : geometryDisplayEdgeModeAndDepthToPreset(legacyMode, legacyDepthMode)
    const depthMode = isViewGeometryDisplayEdgeDepthMode(settings?.edges?.depthMode)
      ? settings.edges.depthMode
      : geometryDisplayEdgePresetToDepthMode(preset)
    return {
      preset,
      mode: geometryDisplayEdgePresetToMode(preset),
      color: normalizeHexColor(settings?.edges?.color, fallback.edges.color),
      opacity: normalizeNumber(
        settings?.edges?.opacity,
        fallback.edges.opacity,
        MIN_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY,
        MAX_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY,
      ),
      depthMode,
      hiddenEdges:
        depthMode === 'surface'
          ? false
          : typeof settings?.edges?.hiddenEdges === 'boolean'
            ? settings.edges.hiddenEdges
            : geometryDisplayEdgePresetToHiddenEdges(preset),
      lineStyle: isViewGeometryDisplayEdgeLineStyle(settings?.edges?.lineStyle)
        ? settings.edges.lineStyle
        : geometryDisplayEdgePresetToLineStyle(preset),
      hiddenLine: normalizeViewGeometryDisplayHiddenLineStyle(
        settings?.edges?.hiddenLine,
        fallback.edges.hiddenLine,
      ),
      hover: normalizeViewGeometryDisplayEdgeInteractionStyle(
        settings?.edges?.hover,
        fallback.edges.hover,
      ),
      selected: normalizeViewGeometryDisplayEdgeInteractionStyle(
        settings?.edges?.selected,
        fallback.edges.selected,
      ),
    }
  })(),
  points: {
    visible:
      typeof settings?.points?.visible === 'boolean'
        ? settings.points.visible
        : fallback.points.visible,
  },
})

const createGeometryDisplayFallbackFromHighlights = (
  highlights: ViewHighlightSettings,
): ViewGeometryDisplaySettings => ({
  ...DEFAULT_VIEW_GEOMETRY_DISPLAY_SETTINGS,
  surfaces: {
    ...DEFAULT_VIEW_GEOMETRY_DISPLAY_SETTINGS.surfaces,
    hover: {
      color: highlights.hoverColor,
      opacity: highlights.surfaceHoverOpacity,
    },
    selected: {
      color: highlights.selectedColor,
      opacity: highlights.surfaceSelectedOpacity,
    },
    bodySelected: {
      color: highlights.bodySelectedColor,
      opacity: highlights.bodySelectedOpacity,
    },
  },
  edges: {
    ...DEFAULT_VIEW_GEOMETRY_DISPLAY_SETTINGS.edges,
    hover: {
      color: highlights.hoverColor,
      opacity: 0.65 + highlights.hoverGlow * 0.35,
    },
    selected: {
      color: highlights.selectedColor,
      opacity: 0.7 + highlights.selectedGlow * 0.3,
    },
  },
})

export const createHighlightsFromGeometryDisplaySurfaceStyles = (
  highlights: ViewHighlightSettings,
  geometryDisplay: Pick<ViewGeometryDisplaySettings, 'surfaces'>,
): ViewHighlightSettings =>
  normalizeViewHighlightSettings({
    ...highlights,
    hoverColor: geometryDisplay.surfaces.hover.color,
    surfaceHoverOpacity: geometryDisplay.surfaces.hover.opacity,
    selectedColor: geometryDisplay.surfaces.selected.color,
    surfaceSelectedOpacity: geometryDisplay.surfaces.selected.opacity,
    bodySelectedColor: geometryDisplay.surfaces.bodySelected.color,
    bodySelectedOpacity: geometryDisplay.surfaces.bodySelected.opacity,
  })

const edgeInteractionOpacityToGlow = (
  opacity: number,
  baseOpacity: number,
  glowRange: number,
): number => Number(normalizeNumber((opacity - baseOpacity) / glowRange, 0, 0, 1).toFixed(6))

export const createHighlightsFromGeometryDisplayStyles = (
  highlights: ViewHighlightSettings,
  geometryDisplay: Pick<ViewGeometryDisplaySettings, 'surfaces' | 'edges'>,
): ViewHighlightSettings => {
  const surfaceHighlights = createHighlightsFromGeometryDisplaySurfaceStyles(
    highlights,
    geometryDisplay,
  )
  return normalizeViewHighlightSettings({
    ...surfaceHighlights,
    hoverColor: geometryDisplay.edges.hover.color,
    selectedColor: geometryDisplay.edges.selected.color,
    hoverGlow: edgeInteractionOpacityToGlow(geometryDisplay.edges.hover.opacity, 0.65, 0.35),
    selectedGlow: edgeInteractionOpacityToGlow(
      geometryDisplay.edges.selected.opacity,
      0.7,
      0.3,
    ),
  })
}

export const createGeometryDisplaySurfaceStylesFromHighlights = (
  geometryDisplay: ViewGeometryDisplaySettings,
  highlights: ViewHighlightSettings,
): ViewGeometryDisplaySettings =>
  normalizeViewGeometryDisplaySettings({
    ...geometryDisplay,
    surfaces: {
      ...geometryDisplay.surfaces,
      hover: {
        color: highlights.hoverColor,
        opacity: highlights.surfaceHoverOpacity,
      },
      selected: {
        color: highlights.selectedColor,
        opacity: highlights.surfaceSelectedOpacity,
      },
      bodySelected: {
        color: highlights.bodySelectedColor,
        opacity: highlights.bodySelectedOpacity,
      },
    },
    edges: {
      ...geometryDisplay.edges,
      hover: {
        color: highlights.hoverColor,
        opacity: 0.65 + highlights.hoverGlow * 0.35,
      },
      selected: {
        color: highlights.selectedColor,
        opacity: 0.7 + highlights.selectedGlow * 0.3,
      },
    },
  })

const BASELINE_ENVIRONMENT_PRESET_LIGHTING: ViewSettings['lighting'] = {
  selectedLightId: 'key',
  lights: [
    {
      id: 'key',
      name: 'Key',
      type: 'directional',
      enabled: true,
      color: '#fff2e6',
      intensity: 1.85,
      position: { x: 11, y: 13, z: 8 },
      target: { x: 0, y: 0.5, z: 0 },
      castShadow: true,
      shadowBias: -0.0005,
      shadowMapSize: 1024,
    },
    {
      id: 'fill',
      name: 'Fill',
      type: 'hemisphere',
      enabled: true,
      color: '#eef3ff',
      intensity: 0.95,
    },
    {
      id: 'rim',
      name: 'Rim',
      type: 'directional',
      enabled: true,
      color: '#e7ecff',
      intensity: 0.42,
      position: { x: -11, y: 7, z: -9 },
      target: { x: 0, y: 0.75, z: 0 },
      castShadow: false,
    },
  ],
}

const STUDIO_ENVIRONMENT_PRESET_LIGHTING: ViewSettings['lighting'] = {
  selectedLightId: 'key',
  lights: [
    {
      id: 'key',
      name: 'Key',
      type: 'directional',
      enabled: true,
      color: '#fff4eb',
      intensity: 2.05,
      position: { x: 10, y: 12, z: 7 },
      target: { x: 0, y: 0.5, z: 0 },
      castShadow: true,
      shadowBias: -0.0005,
      shadowMapSize: 1024,
    },
    {
      id: 'fill',
      name: 'Fill',
      type: 'hemisphere',
      enabled: true,
      color: '#f1f5ff',
      intensity: 1.12,
    },
    {
      id: 'rim',
      name: 'Rim',
      type: 'directional',
      enabled: true,
      color: '#f2f6ff',
      intensity: 0.54,
      position: { x: -10, y: 8, z: -8 },
      target: { x: 0, y: 0.75, z: 0 },
      castShadow: false,
    },
  ],
}

const DARK_STUDIO_ENVIRONMENT_PRESET_LIGHTING: ViewSettings['lighting'] = {
  selectedLightId: 'key',
  lights: [
    {
      id: 'key',
      name: 'Key',
      type: 'directional',
      enabled: true,
      color: '#f5efe8',
      intensity: 1.55,
      position: { x: 12, y: 13, z: 9 },
      target: { x: 0, y: 0.5, z: 0 },
      castShadow: true,
      shadowBias: -0.0005,
      shadowMapSize: 1024,
    },
    {
      id: 'fill',
      name: 'Fill',
      type: 'hemisphere',
      enabled: true,
      color: '#dfe6f7',
      intensity: 0.72,
    },
    {
      id: 'rim',
      name: 'Rim',
      type: 'directional',
      enabled: true,
      color: '#dfe7ff',
      intensity: 0.34,
      position: { x: -12, y: 8, z: -10 },
      target: { x: 0, y: 0.75, z: 0 },
      castShadow: false,
    },
  ],
}

export type EnvironmentPresetDefinition = {
  id: EnvPreset
  label: string
  environmentGrade: EnvironmentGradeSettings
  lighting: ViewSettings['lighting']
  background: string
}

const BASELINE_ENVIRONMENT_PRESET_DEFINITION: EnvironmentPresetDefinition = {
  id: 'baseline',
  label: 'Baseline',
  environmentGrade: cloneEnvironmentGrade(DEFAULT_ENVIRONMENT_GRADE),
  lighting: BASELINE_ENVIRONMENT_PRESET_LIGHTING,
  background: DEFAULT_ENVIRONMENT_BACKGROUND,
}

const STUDIO_ENVIRONMENT_PRESET_DEFINITION: EnvironmentPresetDefinition = {
  id: 'studio',
  label: 'Studio',
  environmentGrade: {
    toneMapping: 'aces',
    exposure: 1.22,
    contrast: 1,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    temperature: 0,
    tint: 0,
    saturation: 1,
  },
  lighting: STUDIO_ENVIRONMENT_PRESET_LIGHTING,
  background: STUDIO_ENVIRONMENT_BACKGROUND,
}

const DARK_STUDIO_ENVIRONMENT_PRESET_DEFINITION: EnvironmentPresetDefinition = {
  id: 'dark_studio',
  label: 'Dark Studio',
  environmentGrade: {
    toneMapping: 'aces',
    exposure: 1.02,
    contrast: 1,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    temperature: 0,
    tint: 0,
    saturation: 1,
  },
  lighting: DARK_STUDIO_ENVIRONMENT_PRESET_LIGHTING,
  background: DARK_STUDIO_ENVIRONMENT_BACKGROUND,
}

export const ENVIRONMENT_PRESET_DEFINITIONS: EnvironmentPresetDefinition[] = [
  BASELINE_ENVIRONMENT_PRESET_DEFINITION,
  STUDIO_ENVIRONMENT_PRESET_DEFINITION,
  DARK_STUDIO_ENVIRONMENT_PRESET_DEFINITION,
]

export const ENVIRONMENT_PRESET_OPTIONS = ENVIRONMENT_PRESET_DEFINITIONS.map((preset) => ({
  value: preset.id,
  label: preset.label,
}))

export const getEnvironmentPresetDefinition = (
  preset: EnvPreset,
): EnvironmentPresetDefinition => {
  if (preset === 'studio') {
    return STUDIO_ENVIRONMENT_PRESET_DEFINITION
  }
  if (preset === 'dark_studio') {
    return DARK_STUDIO_ENVIRONMENT_PRESET_DEFINITION
  }
  return BASELINE_ENVIRONMENT_PRESET_DEFINITION
}

export type LegacyViewSettingsInput = Omit<
  Partial<ViewSettings>,
  | 'environmentGrade'
  | 'gridPresentation'
  | 'postProcessing'
  | 'contactShadows'
  | 'geometryDisplay'
> & {
  environmentGrade?: Partial<EnvironmentGradeSettings>
  gridPresentation?: Partial<GridPresentationSettings> & {
    layers?: Array<Partial<GridPresentationLayerSettings>>
  }
  postProcessing?: Partial<ViewPostProcessSettings>
  contactShadows?: Partial<ViewContactShadowSettings>
  geometryDisplay?: {
    surfaces?: {
      visible?: boolean
      source?: ViewGeometryDisplaySurfaceSource
      customMaterial?: Partial<MaterialPreset>
      hover?: Partial<ViewGeometryDisplaySurfaceStyle>
      selected?: Partial<ViewGeometryDisplaySurfaceStyle>
      bodySelected?: Partial<ViewGeometryDisplaySurfaceStyle>
    }
    edges?: {
      preset?: ViewGeometryDisplayEdgePreset
      mode?: ViewGeometryDisplayEdgeMode
      color?: string
      opacity?: number
      depthMode?: ViewGeometryDisplayEdgeDepthMode
      hiddenEdges?: boolean
      lineStyle?: ViewGeometryDisplayEdgeLineStyle
      hiddenLine?: Partial<ViewGeometryDisplayHiddenLineStyle>
      hover?: Partial<ViewGeometryDisplayEdgeInteractionStyle>
      selected?: Partial<ViewGeometryDisplayEdgeInteractionStyle>
    }
    points?: {
      visible?: boolean
    }
  }
  toneMapping?: ToneMappingMode
  exposure?: number
}

export const normalizeEnvironmentGrade = (
  grade: Partial<EnvironmentGradeSettings> | undefined,
  fallback: EnvironmentGradeSettings = DEFAULT_ENVIRONMENT_GRADE,
): EnvironmentGradeSettings => {
  return {
    toneMapping: grade?.toneMapping ?? fallback.toneMapping,
    exposure: normalizeEnvironmentGradeValue(grade?.exposure, fallback.exposure, 0, 5),
    contrast: normalizeEnvironmentGradeValue(grade?.contrast, fallback.contrast, 0, 3),
    highlights: normalizeEnvironmentGradeValue(grade?.highlights, fallback.highlights, -100, 100),
    shadows: normalizeEnvironmentGradeValue(grade?.shadows, fallback.shadows, -100, 100),
    whites: normalizeEnvironmentGradeValue(grade?.whites, fallback.whites, -100, 100),
    blacks: normalizeEnvironmentGradeValue(grade?.blacks, fallback.blacks, -100, 100),
    temperature: normalizeEnvironmentGradeValue(
      grade?.temperature,
      fallback.temperature,
      -100,
      100,
    ),
    tint: normalizeEnvironmentGradeValue(grade?.tint, fallback.tint, -100, 100),
    saturation: normalizeEnvironmentGradeValue(grade?.saturation, fallback.saturation, 0, 3),
  }
}

const normalizeGridPresentationLayer = (
  layer: Partial<GridPresentationLayerSettings> | undefined,
  fallback: GridPresentationLayerSettings,
): GridPresentationLayerSettings => ({
  id: isGridPresentationLayerId(layer?.id) ? layer.id : fallback.id,
  enabled: typeof layer?.enabled === 'boolean' ? layer.enabled : fallback.enabled,
  spacing: normalizeNumber(
    layer?.spacing,
    fallback.spacing,
    MIN_GRID_PRESENTATION_SPACING,
    MAX_GRID_PRESENTATION_SPACING,
  ),
  color: normalizeHexColor(layer?.color, fallback.color),
  opacity: normalizeNumber(
    layer?.opacity,
    fallback.opacity,
    MIN_GRID_PRESENTATION_OPACITY,
    MAX_GRID_PRESENTATION_OPACITY,
  ),
  heightOffset: normalizeNumber(
    layer?.heightOffset,
    fallback.heightOffset,
    MIN_GRID_PRESENTATION_HEIGHT_OFFSET,
    MAX_GRID_PRESENTATION_HEIGHT_OFFSET,
  ),
})

export const normalizeGridPresentationSettings = (
  settings: LegacyViewSettingsInput['gridPresentation'] | undefined,
): GridPresentationSettings => {
  const sourceLayers = Array.isArray(settings?.layers) ? settings.layers : []
  return {
    height: normalizeNumber(
      settings?.height,
      DEFAULT_GRID_PRESENTATION_SETTINGS.height,
      MIN_GRID_PRESENTATION_HEIGHT,
      MAX_GRID_PRESENTATION_HEIGHT,
    ),
    size: normalizeNumber(
      settings?.size,
      DEFAULT_GRID_PRESENTATION_SETTINGS.size,
      MIN_GRID_PRESENTATION_SIZE,
      MAX_GRID_PRESENTATION_SIZE,
    ),
    layers: DEFAULT_GRID_PRESENTATION_SETTINGS.layers.map((fallbackLayer) => {
      const matchingLayer = sourceLayers.find((layer) => layer?.id === fallbackLayer.id)
      return normalizeGridPresentationLayer(matchingLayer, fallbackLayer)
    }),
  }
}

const normalizeEnvironmentSource = (view: ViewSettings): ViewSettings => {
  if (view.environmentSource.kind === 'hdri') {
    return {
      ...view,
      environmentSource: {
        ...view.environmentSource,
        backgroundVisible: view.environmentSource.backgroundVisible ?? true,
        intensity: Number.isFinite(view.environmentSource.intensity)
          ? view.environmentSource.intensity ?? 1
          : 1,
        backgroundIntensity: Number.isFinite(view.environmentSource.backgroundIntensity)
          ? view.environmentSource.backgroundIntensity ??
            normalizeEnvironmentGrade(
              {
                exposure: view.environmentSource.intensity,
              },
              DEFAULT_ENVIRONMENT_GRADE,
            ).exposure
          : Number.isFinite(view.environmentSource.intensity)
            ? view.environmentSource.intensity ?? 1
            : 1,
        rotationDeg: Number.isFinite(view.environmentSource.rotationDeg)
          ? view.environmentSource.rotationDeg ?? 0
          : 0,
      },
    }
  }

  const environmentRead = resolveEnvironmentPresetRead(view)
  const environmentSource = environmentRead.isDiverged
    ? createCustomEnvironmentSource(environmentRead.definition)
    : createPresetEnvironmentSource(environmentRead.definition)

  if (
    view.environmentSource.kind === environmentSource.kind &&
    view.environmentSource.label === environmentSource.label &&
    view.environmentSource.assetPath === environmentSource.assetPath
  ) {
    return view
  }

  return {
    ...view,
    environmentSource,
  }
}

export const createPresetEnvironmentSource = (
  definition: EnvironmentPresetDefinition,
): EnvironmentSourceSettings => ({
  kind: 'preset',
  label: definition.label,
  assetPath: null,
  backgroundVisible: true,
  intensity: 1,
  backgroundIntensity: 1,
  rotationDeg: 0,
})

export const createCustomEnvironmentSource = (
  definition: EnvironmentPresetDefinition,
): EnvironmentSourceSettings => ({
  kind: 'custom',
  label: `Custom ${definition.label}`,
  assetPath: null,
  backgroundVisible: true,
  intensity: 1,
  backgroundIntensity: 1,
  rotationDeg: 0,
})

export const createHdriEnvironmentSource = (options: {
  label: string
  assetPath: string
  backgroundVisible?: boolean
  intensity?: number
  backgroundIntensity?: number
  rotationDeg?: number
}): EnvironmentSourceSettings => ({
  kind: 'hdri',
  label: options.label,
  assetPath: options.assetPath,
  backgroundVisible: options.backgroundVisible ?? true,
  intensity: options.intensity ?? 1,
  backgroundIntensity: options.backgroundIntensity ?? options.intensity ?? 1,
  rotationDeg: options.rotationDeg ?? 0,
})

const areVec3Equal = (left: Vec3 | undefined, right: Vec3 | undefined): boolean =>
  left?.x === right?.x && left?.y === right?.y && left?.z === right?.z

const areLightSpecEqual = (left: LightSpec, right: LightSpec): boolean =>
  left.id === right.id &&
  left.name === right.name &&
  left.type === right.type &&
  left.enabled === right.enabled &&
  left.color === right.color &&
  left.intensity === right.intensity &&
  areVec3Equal(left.position, right.position) &&
  areVec3Equal(left.target, right.target) &&
  left.distance === right.distance &&
  left.angleDeg === right.angleDeg &&
  left.penumbra === right.penumbra &&
  left.decay === right.decay &&
  left.castShadow === right.castShadow &&
  left.shadowBias === right.shadowBias &&
  left.shadowMapSize === right.shadowMapSize

const areLightingSettingsEqual = (
  left: ViewSettings['lighting'],
  right: ViewSettings['lighting'],
): boolean =>
  left.selectedLightId === right.selectedLightId &&
  left.lights.length === right.lights.length &&
  left.lights.every((light, index) => {
    const rightLight = right.lights[index]
    return rightLight !== undefined && areLightSpecEqual(light, rightLight)
  })

const areEnvironmentGradeSettingsEqual = (
  left: EnvironmentGradeSettings,
  right: EnvironmentGradeSettings,
): boolean =>
  left.toneMapping === right.toneMapping &&
  left.exposure === right.exposure &&
  left.contrast === right.contrast &&
  left.highlights === right.highlights &&
  left.shadows === right.shadows &&
  left.whites === right.whites &&
  left.blacks === right.blacks &&
  left.temperature === right.temperature &&
  left.tint === right.tint &&
  left.saturation === right.saturation

const areEnvironmentLookSnapshotsEqualInternal = (
  left: EnvironmentLookSnapshot,
  right: EnvironmentLookSnapshot,
): boolean =>
  left.envPreset === right.envPreset &&
  areEnvironmentGradeSettingsEqual(left.environmentGrade, right.environmentGrade) &&
  left.environmentSource.kind === right.environmentSource.kind &&
  left.environmentSource.label === right.environmentSource.label &&
  left.environmentSource.assetPath === right.environmentSource.assetPath &&
  left.environmentSource.backgroundVisible === right.environmentSource.backgroundVisible &&
  left.environmentSource.intensity === right.environmentSource.intensity &&
  left.environmentSource.backgroundIntensity === right.environmentSource.backgroundIntensity &&
  left.environmentSource.rotationDeg === right.environmentSource.rotationDeg &&
  areLightingSettingsEqual(left.lighting, right.lighting)

export const createEnvironmentLookSnapshot = (
  settings: Pick<
    ViewSettings,
    'envPreset' | 'environmentGrade' | 'environmentSource' | 'lighting'
  >,
): EnvironmentLookSnapshot => cloneEnvironmentLookSnapshot(settings)

export const areEnvironmentLookSnapshotsEqual = (
  left: EnvironmentLookSnapshot,
  right: EnvironmentLookSnapshot,
): boolean => areEnvironmentLookSnapshotsEqualInternal(left, right)

export const resolveEnvironmentPresetRead = (
  settings: Pick<ViewSettings, 'envPreset' | 'environmentGrade' | 'lighting'>,
): {
  definition: EnvironmentPresetDefinition
  isDiverged: boolean
} => {
  const definition = getEnvironmentPresetDefinition(settings.envPreset)
  return {
    definition,
    isDiverged:
      !areEnvironmentGradeSettingsEqual(settings.environmentGrade, definition.environmentGrade) ||
      !areLightingSettingsEqual(settings.lighting, definition.lighting),
  }
}

export const createEnvironmentPresetViewPatch = (
  preset: EnvPreset,
): Pick<
  ViewSettings,
  'envPreset' | 'environmentSource' | 'environmentGrade' | 'lighting'
> => {
  const definition = getEnvironmentPresetDefinition(preset)
  return {
    envPreset: definition.id,
    environmentSource: createPresetEnvironmentSource(definition),
    environmentGrade: cloneEnvironmentGrade(definition.environmentGrade),
    lighting: cloneLightingSettings(definition.lighting),
  }
}

export const normalizeViewSettings = (settings: LegacyViewSettingsInput): ViewSettings => {
  const definition = getEnvironmentPresetDefinition(settings.envPreset ?? DEFAULT_VIEW_SETTINGS.envPreset)
  const normalizedGrade = normalizeEnvironmentGrade(
    settings.environmentGrade ?? {
      toneMapping: settings.toneMapping,
      exposure: settings.exposure,
    },
    definition.environmentGrade,
  )
  const displayMode = normalizeViewDisplayMode(settings.displayMode, settings.wireframe)
  const edgeDisplayMode = normalizeViewEdgeDisplayMode(settings.edgeDisplayMode, displayMode)
  const normalizedHighlights = normalizeViewHighlightSettings(settings.highlights)
  let geometryDisplay = normalizeViewGeometryDisplaySettings(
    settings.geometryDisplay,
    createGeometryDisplayFallbackFromHighlights(normalizedHighlights),
    edgeDisplayMode,
  )
  if (
    (settings.geometryDisplay?.edges?.preset === undefined ||
      settings.geometryDisplay.edges.preset === DEFAULT_VIEW_GEOMETRY_DISPLAY_SETTINGS.edges.preset) &&
    settings.geometryDisplay?.edges?.mode === DEFAULT_VIEW_GEOMETRY_DISPLAY_SETTINGS.edges.mode &&
    edgeDisplayMode !== geometryDisplayEdgeModeToViewEdgeDisplayMode(geometryDisplay.edges.mode)
  ) {
    const preset = geometryDisplayEdgeModeAndDepthToPreset(
      viewEdgeDisplayModeToGeometryDisplayEdgeMode(edgeDisplayMode),
      edgeDisplayMode === 'visibleEdgesOnly' ? 'surface' : 'xray',
    )
    geometryDisplay = {
      ...geometryDisplay,
      edges: {
        ...geometryDisplay.edges,
        preset,
        mode: geometryDisplayEdgePresetToMode(preset),
        depthMode: geometryDisplayEdgePresetToDepthMode(preset),
        hiddenEdges: geometryDisplayEdgePresetToHiddenEdges(preset),
        lineStyle: geometryDisplayEdgePresetToLineStyle(preset),
      },
    }
  }
  const normalizedView: ViewSettings = {
    ...DEFAULT_VIEW_SETTINGS,
    ...settings,
    displayMode,
    edgeDisplayMode: geometryDisplayEdgeModeToViewEdgeDisplayMode(geometryDisplay.edges.mode),
    geometryDisplay,
    viewportStyle: isViewportStyle(settings.viewportStyle)
      ? settings.viewportStyle
      : DEFAULT_VIEWPORT_STYLE,
    wireframe: displayMode === 'wireframe',
    envPreset: settings.envPreset ?? DEFAULT_VIEW_SETTINGS.envPreset,
    environmentGrade: normalizedGrade,
    environmentSource:
      settings.environmentSource === undefined
        ? createPresetEnvironmentSource(definition)
        : cloneEnvironmentSource(settings.environmentSource),
    ground:
      settings.ground === undefined
        ? { ...DEFAULT_VIEW_SETTINGS.ground }
        : { ...settings.ground },
    gridPresentation: normalizeGridPresentationSettings(settings.gridPresentation),
    renderPreview: normalizeRenderPreviewSettings(settings.renderPreview),
    postProcessing: normalizeViewPostProcessSettings(settings.postProcessing),
    contactShadows: normalizeViewContactShadowSettings(settings.contactShadows),
    highlights: createHighlightsFromGeometryDisplaySurfaceStyles(
      normalizedHighlights,
      geometryDisplay,
    ),
    axisOverlayStyle:
      settings.axisOverlayStyle === undefined
        ? { ...DEFAULT_VIEW_SETTINGS.axisOverlayStyle }
        : { ...settings.axisOverlayStyle },
    lighting:
      settings.lighting === undefined
        ? cloneLightingSettings(definition.lighting)
        : cloneLightingSettings(settings.lighting),
    materials:
      settings.materials === undefined
        ? {
            presets: DEFAULT_VIEW_SETTINGS.materials.presets.map(normalizeMaterialPreset),
            selectedPresetId: DEFAULT_VIEW_SETTINGS.materials.selectedPresetId,
            usePerPart: DEFAULT_VIEW_SETTINGS.materials.usePerPart,
            perPart: { ...DEFAULT_VIEW_SETTINGS.materials.perPart },
          }
        : {
            presets: settings.materials.presets.map(normalizeMaterialPreset),
            selectedPresetId: settings.materials.selectedPresetId,
            usePerPart: settings.materials.usePerPart,
            perPart: { ...settings.materials.perPart },
          },
  }

  return normalizeEnvironmentSource(normalizedView)
}

export const DEFAULT_AXIS_OVERLAY_STYLE_SETTINGS: AxisOverlayStyleSettings = {
  mainLineOpacity: 0.5,
  secondaryLineOpacity: 0.1,
  sphereScale: 1,
  cameraDistance: 4.5,
  labelsVisible: true,
  labelSize: 'medium',
  backgroundMode: 'none',
  backgroundOpacity: 0,
}

export const DEFAULT_GRID_PRESENTATION_SETTINGS: GridPresentationSettings = {
  height: 0,
  size: 300,
  layers: [
    {
      id: 'grid1',
      enabled: true,
      spacing: 1,
      color: '#ffffff',
      opacity: 0.1,
      heightOffset: 0,
    },
    {
      id: 'grid2',
      enabled: true,
      spacing: 10,
      color: '#ffffff',
      opacity: 0.3,
      heightOffset: 0.001,
    },
    {
      id: 'grid3',
      enabled: true,
      spacing: 50,
      color: '#ffffff',
      opacity: 1,
      heightOffset: 0.002,
    },
  ],
}

export const DEFAULT_VIEW_GEOMETRY_DISPLAY_CUSTOM_SURFACE_MATERIAL: MaterialPreset = {
  id: 'geometry_display_surface_custom',
  name: 'Custom Surface',
  color: '#5f83d6',
  metalness: 0.06,
  roughness: 0.84,
  emissive: '#ffffff',
  emissiveIntensity: 0,
  opacity: 1,
  transparent: false,
  doubleSided: true,
}

export const DEFAULT_VIEW_GEOMETRY_DISPLAY_SETTINGS: ViewGeometryDisplaySettings = {
  surfaces: {
    visible: true,
    source: 'materialSet',
    customMaterial: DEFAULT_VIEW_GEOMETRY_DISPLAY_CUSTOM_SURFACE_MATERIAL,
    hover: {
      color: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.hoverColor,
      opacity: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.surfaceHoverOpacity,
    },
    selected: {
      color: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.selectedColor,
      opacity: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.surfaceSelectedOpacity,
    },
    bodySelected: {
      color: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.bodySelectedColor,
      opacity: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.bodySelectedOpacity,
    },
  },
  edges: {
    preset: geometryDisplayEdgeModeAndDepthToPreset(
      viewEdgeDisplayModeToGeometryDisplayEdgeMode(DEFAULT_VIEW_EDGE_DISPLAY_MODE),
      'xray',
    ),
    mode: viewEdgeDisplayModeToGeometryDisplayEdgeMode(DEFAULT_VIEW_EDGE_DISPLAY_MODE),
    color: '#6f92d9',
    opacity: 0.62,
    depthMode: 'xray',
    hiddenEdges: false,
    lineStyle: 'solid',
    hiddenLine: {
      color: '#6f92d9',
      opacity: 0.22,
      dashSize: 0.12,
      gapSize: 0.08,
    },
    hover: {
      color: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.hoverColor,
      opacity: 0.65 + DEFAULT_VIEW_HIGHLIGHT_SETTINGS.hoverGlow * 0.35,
    },
    selected: {
      color: DEFAULT_VIEW_HIGHLIGHT_SETTINGS.selectedColor,
      opacity: 0.7 + DEFAULT_VIEW_HIGHLIGHT_SETTINGS.selectedGlow * 0.3,
    },
  },
  points: {
    visible: true,
  },
}

export const DEFAULT_MATERIAL_PRESETS: MaterialPreset[] = [
  {
    id: 'default_matte',
    name: 'Default Matte',
    color: '#5f83d6',
    metalness: 0.06,
    roughness: 0.84,
    emissive: '#ffffff',
    emissiveIntensity: 0,
    opacity: 1,
    transparent: false,
    doubleSided: true,
  },
  {
    id: 'studio_plastic',
    name: 'Studio Plastic',
    color: '#9aa9be',
    metalness: 0.02,
    roughness: 0.5,
    emissive: '#ffffff',
    emissiveIntensity: 0,
    opacity: 1,
    transparent: false,
    doubleSided: true,
  },
  {
    id: 'brushed_metal',
    name: 'Brushed Metal',
    color: '#afb5bf',
    metalness: 0.9,
    roughness: 0.28,
    emissive: '#ffffff',
    emissiveIntensity: 0,
    opacity: 1,
    transparent: false,
    doubleSided: true,
  },
  {
    id: 'highlight_gloss',
    name: 'Highlight Gloss',
    color: '#f3f4f7',
    metalness: 0.12,
    roughness: 0.14,
    emissive: '#0d0f14',
    emissiveIntensity: 0.08,
    opacity: 1,
    transparent: false,
    doubleSided: true,
  },
]

export const DEFAULT_VIEW_SETTINGS: ViewSettings = {
  projectionMode: 'perspective',
  orbitEnabled: true,
  gridVisible: true,
  axesVisible: false,
  shadowsEnabled: true,
  wireframe: false,
  displayMode: DEFAULT_VIEW_DISPLAY_MODE,
  edgeDisplayMode: DEFAULT_VIEW_EDGE_DISPLAY_MODE,
  geometryDisplay: DEFAULT_VIEW_GEOMETRY_DISPLAY_SETTINGS,
  viewportStyle: DEFAULT_VIEWPORT_STYLE,
  envPreset: 'baseline',
  environmentGrade: cloneEnvironmentGrade(DEFAULT_ENVIRONMENT_GRADE),
  environmentSource: cloneEnvironmentSource(
    createPresetEnvironmentSource(BASELINE_ENVIRONMENT_PRESET_DEFINITION),
  ),
  ground: {
    enabled: false,
    height: 0,
    materialPresetId: 'matte_mid',
  },
  gridPresentation: cloneGridPresentationSettings(DEFAULT_GRID_PRESENTATION_SETTINGS),
  renderPreview: DEFAULT_RENDER_PREVIEW_SETTINGS,
  postProcessing: DEFAULT_VIEW_POST_PROCESS_SETTINGS,
  contactShadows: DEFAULT_VIEW_CONTACT_SHADOW_SETTINGS,
  highlights: DEFAULT_VIEW_HIGHLIGHT_SETTINGS,
  axisOverlayEnabled: true,
  axisOverlayStyle: DEFAULT_AXIS_OVERLAY_STYLE_SETTINGS,
  lighting: cloneLightingSettings(BASELINE_ENVIRONMENT_PRESET_LIGHTING),
  materials: {
    presets: DEFAULT_MATERIAL_PRESETS,
    selectedPresetId: 'default_matte',
    usePerPart: false,
    perPart: {},
  },
}
