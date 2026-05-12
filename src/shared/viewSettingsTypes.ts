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
export type RenderPreviewNoiseCleanup = 'off' | 'low' | 'medium' | 'high'
export type RenderPreviewGpuLoad = 'smooth' | 'balanced' | 'fast'
export type RenderPreviewQualityPreset = 'fast' | 'balanced' | 'clean' | 'high'
export type RenderPreviewQualityPresetRead = RenderPreviewQualityPreset | 'custom'
export type AxisOverlayLabelSize = 'small' | 'medium' | 'large'
export type AxisOverlayBackgroundMode = 'none' | 'blur'
export type GroundMaterialPresetId = 'matte_dark' | 'matte_mid' | 'glossy_studio'
export const DEFAULT_VIEW_DISPLAY_MODE: ViewDisplayMode = 'rendered'
export const VIEW_DISPLAY_MODES: readonly ViewDisplayMode[] = [
  'solid',
  'wireframe',
  'material',
  'rendered',
  'renderPreview',
]
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

export type RenderPreviewSettings = {
  targetSamples: number
  bounces: number
  renderScale: number
  noiseCleanup: RenderPreviewNoiseCleanup
  gpuLoad: RenderPreviewGpuLoad
}

export type ViewSettings = {
  projectionMode: ProjectionMode
  orbitEnabled: boolean
  gridVisible: boolean
  axesVisible: boolean
  shadowsEnabled: boolean
  wireframe: boolean
  displayMode: ViewDisplayMode
  envPreset: EnvPreset
  environmentGrade: EnvironmentGradeSettings
  environmentSource: EnvironmentSourceSettings
  ground: GroundSettings
  renderPreview: RenderPreviewSettings
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

export const isRenderPreviewNoiseCleanup = (
  value: unknown,
): value is RenderPreviewNoiseCleanup =>
  typeof value === 'string' &&
  RENDER_PREVIEW_NOISE_CLEANUP_OPTIONS.includes(value as RenderPreviewNoiseCleanup)

export const isRenderPreviewGpuLoad = (value: unknown): value is RenderPreviewGpuLoad =>
  typeof value === 'string' &&
  RENDER_PREVIEW_GPU_LOAD_OPTIONS.includes(value as RenderPreviewGpuLoad)

export const DEFAULT_RENDER_PREVIEW_SETTINGS: RenderPreviewSettings = {
  targetSamples: DEFAULT_RENDER_PREVIEW_TARGET_SAMPLES,
  bounces: DEFAULT_RENDER_PREVIEW_BOUNCES,
  renderScale: DEFAULT_RENDER_PREVIEW_RENDER_SCALE,
  noiseCleanup: DEFAULT_RENDER_PREVIEW_NOISE_CLEANUP,
  gpuLoad: DEFAULT_RENDER_PREVIEW_GPU_LOAD,
}

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

export type LegacyViewSettingsInput = Omit<Partial<ViewSettings>, 'environmentGrade'> & {
  environmentGrade?: Partial<EnvironmentGradeSettings>
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
  const normalizedView: ViewSettings = {
    ...DEFAULT_VIEW_SETTINGS,
    ...settings,
    displayMode,
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
    renderPreview: normalizeRenderPreviewSettings(settings.renderPreview),
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
  renderPreview: DEFAULT_RENDER_PREVIEW_SETTINGS,
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
