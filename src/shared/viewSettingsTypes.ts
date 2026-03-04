export type ToneMappingMode = 'none' | 'aces'
export type EnvPreset = 'none' | 'studio'

export type LightType = 'directional' | 'point' | 'spot' | 'hemisphere' | 'ambient'

export type Vec3 = { x: number; y: number; z: number }

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

export type ViewSettings = {
  orbitEnabled: boolean
  gridVisible: boolean
  axesVisible: boolean
  shadowsEnabled: boolean
  wireframe: boolean
  toneMapping: ToneMappingMode
  exposure: number
  envPreset: EnvPreset
  axisOverlayEnabled: boolean
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
  orbitEnabled: true,
  gridVisible: true,
  axesVisible: false,
  shadowsEnabled: true,
  wireframe: false,
  toneMapping: 'aces',
  exposure: 1,
  envPreset: 'none',
  axisOverlayEnabled: true,
  lighting: {
    selectedLightId: 'key',
    lights: [
      {
        id: 'key',
        name: 'Key',
        type: 'directional',
        enabled: true,
        color: '#ffffff',
        intensity: 1.5,
        position: { x: 6, y: 8, z: 6 },
        target: { x: 0, y: 0, z: 0 },
        castShadow: true,
        shadowBias: -0.0005,
        shadowMapSize: 1024,
      },
      {
        id: 'fill',
        name: 'Fill',
        type: 'hemisphere',
        enabled: true,
        color: '#ffffff',
        intensity: 0.6,
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
