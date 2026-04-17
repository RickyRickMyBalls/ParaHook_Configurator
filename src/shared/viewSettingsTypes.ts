export type ToneMappingMode = 'none' | 'aces'
export type EnvPreset = 'none' | 'studio'
export type ProjectionMode = 'perspective' | 'orthographic'
export type AxisOverlayLabelSize = 'small' | 'medium' | 'large'
export type AxisOverlayBackgroundMode = 'none' | 'blur'
export type GroundMaterialPresetId = 'matte_dark' | 'matte_mid' | 'glossy_studio'

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
}

export type PartMaterialMap = Record<string, MaterialPresetId>

export type GroundSettings = {
  enabled: boolean
  height: number
  materialPresetId: GroundMaterialPresetId
}

export type ViewSettings = {
  projectionMode: ProjectionMode
  orbitEnabled: boolean
  gridVisible: boolean
  axesVisible: boolean
  shadowsEnabled: boolean
  wireframe: boolean
  toneMapping: ToneMappingMode
  exposure: number
  envPreset: EnvPreset
  ground: GroundSettings
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
    emissive: '#000000',
    emissiveIntensity: 0,
    opacity: 1,
    transparent: false,
  },
  {
    id: 'studio_plastic',
    name: 'Studio Plastic',
    color: '#9aa9be',
    metalness: 0.02,
    roughness: 0.5,
    emissive: '#000000',
    emissiveIntensity: 0,
    opacity: 1,
    transparent: false,
  },
  {
    id: 'brushed_metal',
    name: 'Brushed Metal',
    color: '#afb5bf',
    metalness: 0.9,
    roughness: 0.28,
    emissive: '#000000',
    emissiveIntensity: 0,
    opacity: 1,
    transparent: false,
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
  },
]

export const DEFAULT_VIEW_SETTINGS: ViewSettings = {
  projectionMode: 'perspective',
  orbitEnabled: true,
  gridVisible: true,
  axesVisible: false,
  shadowsEnabled: true,
  wireframe: false,
  toneMapping: 'aces',
  exposure: 1.15,
  envPreset: 'none',
  ground: {
    enabled: false,
    height: 0,
    materialPresetId: 'matte_mid',
  },
  axisOverlayEnabled: true,
  axisOverlayStyle: DEFAULT_AXIS_OVERLAY_STYLE_SETTINGS,
  lighting: {
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
  },
  materials: {
    presets: DEFAULT_MATERIAL_PRESETS,
    selectedPresetId: 'default_matte',
    usePerPart: false,
    perPart: {},
  },
}
