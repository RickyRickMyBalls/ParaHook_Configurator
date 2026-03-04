import { create } from 'zustand'
import type {
  LightSpec,
  LightType,
  MaterialPreset,
  MaterialPresetId,
  PartMaterialMap,
  Vec3,
  ViewSettings,
} from '../../shared/viewSettingsTypes'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const cloneVec3 = (value: Vec3 | undefined): Vec3 | undefined =>
  value === undefined ? undefined : { ...value }

const cloneLight = (light: LightSpec): LightSpec => ({
  ...light,
  position: cloneVec3(light.position),
  target: cloneVec3(light.target),
})

const clonePreset = (preset: MaterialPreset): MaterialPreset => ({ ...preset })

const cloneView = (view: ViewSettings): ViewSettings => ({
  ...view,
  lighting: {
    selectedLightId: view.lighting.selectedLightId,
    lights: view.lighting.lights.map(cloneLight),
  },
  materials: {
    selectedPresetId: view.materials.selectedPresetId,
    usePerPart: view.materials.usePerPart,
    presets: view.materials.presets.map(clonePreset),
    perPart: { ...view.materials.perPart },
  },
})

const createDefaultView = (): ViewSettings => cloneView(DEFAULT_VIEW_SETTINGS)

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
})

type UiPrefsState = {
  view: ViewSettings
  setView: (patch: Partial<ViewSettings>) => void
  setViewKey: <K extends keyof ViewSettings>(key: K, value: ViewSettings[K]) => void
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
  setView: (patch) => {
    set({ view: { ...get().view, ...patch } })
  },
  setViewKey: (key, value) => {
    set({ view: { ...get().view, [key]: value } })
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
      view: {
        ...state.view,
        lighting: {
          selectedLightId: light.id,
          lights: [...state.view.lighting.lights, light],
        },
      },
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
      view: {
        ...state.view,
        lighting: {
          selectedLightId: nextSelected,
          lights: nextLights,
        },
      },
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
      view: {
        ...state.view,
        lighting: {
          ...state.view.lighting,
          lights: nextLights,
        },
      },
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
      emissive: preset?.emissive ?? base?.emissive ?? '#000000',
      emissiveIntensity: preset?.emissiveIntensity ?? base?.emissiveIntensity ?? 0,
      opacity: preset?.opacity ?? base?.opacity ?? 1,
      transparent: preset?.transparent ?? base?.transparent ?? false,
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
