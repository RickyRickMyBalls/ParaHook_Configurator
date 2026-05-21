/* eslint-disable react-refresh/only-export-components */
import { useRef, useState, type ReactNode } from 'react'
import {
  DEFAULT_RENDER_PREVIEW_SETTINGS,
  DEFAULT_VIEW_GEOMETRY_DISPLAY_CUSTOM_SURFACE_MATERIAL,
  MAX_CONTACT_SHADOW_HEIGHT_FADE,
  MAX_CONTACT_SHADOW_OPACITY,
  MAX_CONTACT_SHADOW_SPREAD,
  MAX_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY,
  MAX_GRID_PRESENTATION_HEIGHT,
  MAX_GRID_PRESENTATION_HEIGHT_OFFSET,
  MAX_GRID_PRESENTATION_OPACITY,
  MAX_GRID_PRESENTATION_SIZE,
  MAX_GRID_PRESENTATION_SPACING,
  MAX_RENDER_PREVIEW_BOUNCES,
  MAX_RENDER_PREVIEW_RENDER_SCALE,
  MAX_RENDER_PREVIEW_TARGET_SAMPLES,
  MAX_VIEW_SSAO_CONTACT_BIAS,
  MAX_VIEW_SSAO_DISTANCE_THRESHOLD,
  MAX_VIEW_SSAO_INTENSITY,
  MAX_VIEW_SSAO_RADIUS,
  MIN_GRID_PRESENTATION_HEIGHT,
  MIN_GRID_PRESENTATION_HEIGHT_OFFSET,
  MIN_GRID_PRESENTATION_OPACITY,
  MIN_GRID_PRESENTATION_SIZE,
  MIN_GRID_PRESENTATION_SPACING,
  MIN_RENDER_PREVIEW_BOUNCES,
  MIN_RENDER_PREVIEW_RENDER_SCALE,
  MIN_RENDER_PREVIEW_TARGET_SAMPLES,
  MIN_CONTACT_SHADOW_HEIGHT_FADE,
  MIN_CONTACT_SHADOW_OPACITY,
  MIN_CONTACT_SHADOW_SPREAD,
  MIN_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY,
  MIN_VIEW_SSAO_CONTACT_BIAS,
  MIN_VIEW_SSAO_DISTANCE_THRESHOLD,
  MIN_VIEW_SSAO_INTENSITY,
  MIN_VIEW_SSAO_RADIUS,
  RENDER_PREVIEW_QUALITY_PRESET_OPTIONS,
  RENDER_PREVIEW_GPU_LOAD_OPTIONS,
  RENDER_PREVIEW_NOISE_CLEANUP_OPTIONS,
  VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS,
  VIEW_AMBIENT_OCCLUSION_TYPE_OPTIONS,
  VIEW_DISPLAY_MODES,
  VIEW_GEOMETRY_DISPLAY_EDGE_DEPTH_MODES,
  VIEW_GEOMETRY_DISPLAY_EDGE_MODES,
  VIEW_GEOMETRY_DISPLAY_SURFACE_SOURCES,
  VIEW_RENDER_PRESET_OPTIONS,
  VIEW_SSAO_QUALITY_OPTIONS,
  createDisplayModeViewPatch,
  createRenderPreviewQualityPresetSettings,
  createRenderPresetViewPatch,
  createViewAmbientOcclusionPresetSettings,
  isViewAmbientOcclusionPreset,
  isViewAmbientOcclusionType,
  isViewDisplayMode,
  isViewGeometryDisplayEdgeDepthMode,
  isViewGeometryDisplayEdgeMode,
  isViewGeometryDisplaySurfaceSource,
  isViewRenderPresetId,
  isRenderPreviewGpuLoad,
  isRenderPreviewNoiseCleanup,
  isViewSsaoQuality,
  normalizeRenderPreviewSettings,
  resolveRenderPreviewQualityPresetRead,
  resolveViewAmbientOcclusionPresetRead,
  type EnvironmentGradeSettings,
  type EnvironmentLookSnapshot,
  type GroundMaterialPresetId,
  type GridPresentationLayerId,
  type GridPresentationLayerSettings,
  type GridPresentationSettings,
  type LightSpec,
  type LightType,
  type MaterialPreset,
  type ViewAmbientOcclusionType,
  type ViewAmbientOcclusionPresetRead,
  type RenderPresetId,
  type RenderPreviewGpuLoad,
  type RenderPreviewNoiseCleanup,
  type RenderPreviewQualityPreset,
  type RenderPreviewSettings,
  type ViewContactShadowSettings,
  type ViewDisplayMode,
  type ViewGeometryDisplayEdgeDepthMode,
  type ViewGeometryDisplayEdgeInteractionStyle,
  type ViewGeometryDisplayEdgeMode,
  type ViewGeometryDisplaySurfaceSource,
  type ViewGeometryDisplaySettings,
  type ViewGeometryDisplaySurfaceStyle,
  type ViewPostProcessSettings,
  type ViewSsaoQuality,
} from '../../shared/viewSettingsTypes'
import { ParaSelect } from '../components/ParaSelect'
import { ParaSlider } from '../components/ParaSlider'
import {
  captureEnvironmentLookHistorySnapshot,
  commitEnvironmentLookHistory,
  runEnvironmentLookHistoryAction,
} from '../store/environmentLookEditHistory'
import {
  captureGroundHistorySnapshot,
  commitGroundHistory,
  setGroundEnabledWithHistory,
  setGroundMaterialPresetWithHistory,
  type GroundHistorySnapshot,
} from '../store/groundEditHistory'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { PropertiesColorControl } from './PropertiesColorControl'
import type { PropertiesSectionDefinition } from './propertiesSectionContract'

const SAMPLE_STEP = 8
const BOUNCE_STEP = 1
const RENDER_SCALE_STEP = 0.05
const SHADOW_MAP_SIZES = [256, 512, 1024, 2048]

const NOISE_CLEANUP_LABELS: Record<RenderPreviewNoiseCleanup, string> = {
  off: 'Off',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const GPU_LOAD_LABELS: Record<RenderPreviewGpuLoad, string> = {
  smooth: 'Smooth',
  balanced: 'Balanced',
  fast: 'Fast',
}

const DISPLAY_MODE_LABELS: Record<ViewDisplayMode, string> = {
  solid: 'Solid',
  wireframe: 'Wireframe',
  material: 'Material',
  rendered: 'Rendered',
  renderPreview: 'Render Preview',
}

const RENDER_PRESET_LABELS: Record<RenderPresetId, string> = {
  standard: 'Standard',
  clayStudio: 'Clay Studio',
}

const GEOMETRY_DISPLAY_EDGE_LABELS: Record<ViewGeometryDisplayEdgeMode, string> = {
  off: 'Off',
  visibleOnly: 'Visible Only',
  all: 'All',
}

const GEOMETRY_DISPLAY_EDGE_DEPTH_LABELS: Record<ViewGeometryDisplayEdgeDepthMode, string> = {
  surface: 'Surface',
  xray: 'Xray',
}

const GEOMETRY_DISPLAY_SURFACE_SOURCE_LABELS: Record<ViewGeometryDisplaySurfaceSource, string> = {
  materialSet: 'Material Set',
  custom: 'Custom',
}

const AO_TYPE_LABELS: Record<ViewAmbientOcclusionType, string> = {
  off: 'Off',
  basicSsao: 'Basic SSAO',
  sao: 'SAO',
}

const AMBIENT_OCCLUSION_LABELS: Record<ViewAmbientOcclusionPresetRead, string> = {
  off: 'Off',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  custom: 'Custom',
}

const AO_QUALITY_LABELS: Record<ViewSsaoQuality, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const LIGHT_TYPE_LABELS: Record<LightType, string> = {
  directional: 'Directional',
  point: 'Point',
  spot: 'Spot',
  hemisphere: 'Hemisphere',
  ambient: 'Ambient',
}

const noiseCleanupOptions = RENDER_PREVIEW_NOISE_CLEANUP_OPTIONS.map((value) => ({
  value,
  label: NOISE_CLEANUP_LABELS[value],
}))

const gpuLoadOptions = RENDER_PREVIEW_GPU_LOAD_OPTIONS.map((value) => ({
  value,
  label: GPU_LOAD_LABELS[value],
}))

const displayModeOptions = VIEW_DISPLAY_MODES.map((value) => ({
  value,
  label: DISPLAY_MODE_LABELS[value],
}))

const renderPresetOptions = VIEW_RENDER_PRESET_OPTIONS.map((value) => ({
  value,
  label: RENDER_PRESET_LABELS[value],
}))

const geometryDisplayEdgeOptions = VIEW_GEOMETRY_DISPLAY_EDGE_MODES.map((value) => ({
  value,
  label: GEOMETRY_DISPLAY_EDGE_LABELS[value],
}))

const geometryDisplayEdgeDepthOptions = VIEW_GEOMETRY_DISPLAY_EDGE_DEPTH_MODES.map((value) => ({
  value,
  label: GEOMETRY_DISPLAY_EDGE_DEPTH_LABELS[value],
}))

const geometryDisplaySurfaceSourceOptions = VIEW_GEOMETRY_DISPLAY_SURFACE_SOURCES.map((value) => ({
  value,
  label: GEOMETRY_DISPLAY_SURFACE_SOURCE_LABELS[value],
}))

const aoTypeOptions = VIEW_AMBIENT_OCCLUSION_TYPE_OPTIONS.map((value) => ({
  value,
  label: AO_TYPE_LABELS[value],
}))

const ambientOcclusionOptions = [
  ...VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS.map((value) => ({
    value,
    label: AMBIENT_OCCLUSION_LABELS[value],
  })),
  { value: 'custom', label: AMBIENT_OCCLUSION_LABELS.custom },
]

const aoQualityOptions = VIEW_SSAO_QUALITY_OPTIONS.map((value) => ({
  value,
  label: AO_QUALITY_LABELS[value],
}))

const enabledOptions = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
]

const shadowMapOptions = SHADOW_MAP_SIZES.map((size) => ({
  value: `${size}`,
  label: `${size}`,
}))

const groundMaterialOptions: Array<{ value: GroundMaterialPresetId; label: string }> = [
  { value: 'matte_dark', label: 'Matte Dark' },
  { value: 'matte_mid', label: 'Matte Mid' },
  { value: 'glossy_studio', label: 'Glossy Studio' },
]

const GRID_PRESENTATION_LAYER_LABELS: Record<GridPresentationLayerId, string> = {
  grid1: 'Grid 1',
  grid2: 'Grid 2',
  grid3: 'Grid 3',
}

const isRenderPreviewQualityPreset = (value: string): value is RenderPreviewQualityPreset =>
  value === 'fast' || value === 'balanced' || value === 'clean' || value === 'high'

const formatSamples = (value: number): string => `${Math.round(value)}`
const formatBounces = (value: number): string => `${Math.round(value)}`
const formatRenderScale = (value: number): string => `${Math.round(value * 100)}%`
const formatGroundHeight = (value: number): string =>
  Number.isInteger(value) ? `${value}` : value.toFixed(2)
const formatGridHeight = (value: number): string => value.toFixed(1)
const formatGridSize = (value: number): string => `${Math.round(value)}`
const formatGridSpacing = (value: number): string =>
  value >= 10 ? `${Math.round(value)}` : Number(value.toFixed(2)).toString()
const formatGridOpacity = (value: number): string => `${Math.round(value * 100)}%`
const formatMaterialPercent = (value: number): string => `${Math.round(value * 100)}%`
const formatGridHeightOffset = (value: number): string => value.toFixed(3)
const formatEnvironmentGradeMultiplierValue = (value: number): string =>
  `${Number(value.toFixed(2)).toString()}x`
const formatEnvironmentGradeOffsetValue = (value: number): string =>
  `${value > 0 ? '+' : ''}${Math.round(value)}`
const formatLightShadowBiasValue = (value: number): string => value.toFixed(4)
const lightTypeLabel = (type: LightType): string => LIGHT_TYPE_LABELS[type]
const supportsShadow = (type: LightType): boolean =>
  type === 'directional' || type === 'point' || type === 'spot'

const buildRenderPreviewPatch = (
  current: RenderPreviewSettings,
  patch: Partial<RenderPreviewSettings>,
): RenderPreviewSettings => normalizeRenderPreviewSettings({ ...current, ...patch }, current)

type GeometryDisplaySubsectionId = 'surfaces' | 'edges' | 'points'

const renderRenderSectionContent = (): ReactNode => <PropertiesRenderSectionContent />

export const propertiesRenderSectionDefinition: PropertiesSectionDefinition = {
  id: 'render',
  label: 'Render',
  summary: 'Preview quality',
  supports: () => true,
  renderContent: renderRenderSectionContent,
}

function PropertiesRenderSectionContent() {
  const environmentLookDraftRef = useRef<EnvironmentLookSnapshot | null>(null)
  const groundHeightDraftRef = useRef<GroundHistorySnapshot | null>(null)
  const [expandedGridColorLayerIds, setExpandedGridColorLayerIds] = useState<
    ReadonlySet<GridPresentationLayerId>
  >(() => new Set())
  const [customSurfaceColorExpanded, setCustomSurfaceColorExpanded] = useState(false)
  const [customSurfaceEmissiveExpanded, setCustomSurfaceEmissiveExpanded] = useState(false)
  const [surfaceHoverColorExpanded, setSurfaceHoverColorExpanded] = useState(false)
  const [surfaceSelectedColorExpanded, setSurfaceSelectedColorExpanded] = useState(false)
  const [bodySelectedColorExpanded, setBodySelectedColorExpanded] = useState(false)
  const [edgeColorExpanded, setEdgeColorExpanded] = useState(false)
  const [edgeHoverColorExpanded, setEdgeHoverColorExpanded] = useState(false)
  const [edgeSelectedColorExpanded, setEdgeSelectedColorExpanded] = useState(false)
  const [expandedGeometryDisplaySubsections, setExpandedGeometryDisplaySubsections] = useState<
    Record<GeometryDisplaySubsectionId, boolean>
  >({
    surfaces: true,
    edges: true,
    points: true,
  })
  const renderPreview = useUiPrefsStore((state) => state.view.renderPreview)
  const displayMode = useUiPrefsStore((state) => state.view.displayMode)
  const geometryDisplay = useUiPrefsStore((state) => state.view.geometryDisplay)
  const viewportStyle = useUiPrefsStore((state) => state.view.viewportStyle)
  const postProcessing = useUiPrefsStore((state) => state.view.postProcessing)
  const contactShadows = useUiPrefsStore((state) => state.view.contactShadows)
  const environmentGrade = useUiPrefsStore((state) => state.view.environmentGrade)
  const shadowsEnabled = useUiPrefsStore((state) => state.view.shadowsEnabled)
  const ground = useUiPrefsStore((state) => state.view.ground)
  const gridVisible = useUiPrefsStore((state) => state.view.gridVisible)
  const gridPresentation = useUiPrefsStore((state) => state.view.gridPresentation)
  const lighting = useUiPrefsStore((state) => state.view.lighting)
  const setView = useUiPrefsStore((state) => state.setView)
  const setViewKey = useUiPrefsStore((state) => state.setViewKey)
  const setEnvironmentGrade = useUiPrefsStore((state) => state.setEnvironmentGrade)
  const updateLight = useUiPrefsStore((state) => state.updateLight)

  const updateRenderPreview = (patch: Partial<RenderPreviewSettings>) => {
    setViewKey('renderPreview', buildRenderPreviewPatch(renderPreview, patch))
  }

  const handleNoiseCleanupChange = (value: string) => {
    if (!isRenderPreviewNoiseCleanup(value)) {
      return
    }
    updateRenderPreview({ noiseCleanup: value })
  }

  const handleGpuLoadChange = (value: string) => {
    if (!isRenderPreviewGpuLoad(value)) {
      return
    }
    updateRenderPreview({ gpuLoad: value })
  }

  const handlePresetChange = (value: string) => {
    if (!isRenderPreviewQualityPreset(value)) {
      return
    }
    setViewKey('renderPreview', createRenderPreviewQualityPresetSettings(value))
  }

  const handleDisplayModeChange = (value: string) => {
    if (!isViewDisplayMode(value)) {
      return
    }
    setView(createDisplayModeViewPatch(value))
  }

  const handleRenderPresetChange = (value: string) => {
    if (!isViewRenderPresetId(value)) {
      return
    }
    setView(createRenderPresetViewPatch(value, { displayMode, ground, gridPresentation }))
  }

  const updateGeometryDisplay = (patch: Partial<ViewGeometryDisplaySettings>) => {
    const currentGeometryDisplay = useUiPrefsStore.getState().view.geometryDisplay
    setViewKey('geometryDisplay', {
      ...currentGeometryDisplay,
      ...patch,
      surfaces: patch.surfaces ?? currentGeometryDisplay.surfaces,
      edges: patch.edges ?? currentGeometryDisplay.edges,
      points: patch.points ?? currentGeometryDisplay.points,
    })
  }

  const updateSurfaceVisibility = (value: string) => {
    const currentSurfaces = useUiPrefsStore.getState().view.geometryDisplay.surfaces
    updateGeometryDisplay({
      surfaces: {
        ...currentSurfaces,
        visible: value === 'on',
      },
    })
  }

  const updateSurfaceSource = (value: string) => {
    if (!isViewGeometryDisplaySurfaceSource(value)) {
      return
    }
    const currentSurfaces = useUiPrefsStore.getState().view.geometryDisplay.surfaces
    updateGeometryDisplay({
      surfaces: {
        ...currentSurfaces,
        source: value,
      },
    })
  }

  const updateCustomSurfaceMaterial = (patch: Partial<MaterialPreset>) => {
    const currentSurfaces = useUiPrefsStore.getState().view.geometryDisplay.surfaces
    updateGeometryDisplay({
      surfaces: {
        ...currentSurfaces,
        customMaterial: {
          ...currentSurfaces.customMaterial,
          ...patch,
        },
      },
    })
  }

  const updateSurfaceStyle = (
    key: 'hover' | 'selected' | 'bodySelected',
    patch: Partial<ViewGeometryDisplaySurfaceStyle>,
  ) => {
    const currentSurfaces = useUiPrefsStore.getState().view.geometryDisplay.surfaces
    updateGeometryDisplay({
      surfaces: {
        ...currentSurfaces,
        [key]: {
          ...currentSurfaces[key],
          ...patch,
        },
      },
    })
  }

  const updateEdgeVisibility = (value: string) => {
    if (!isViewGeometryDisplayEdgeMode(value)) {
      return
    }
    const currentEdges = useUiPrefsStore.getState().view.geometryDisplay.edges
    updateGeometryDisplay({
      edges: {
        ...currentEdges,
        mode: value,
      },
    })
  }

  const updateEdgeStyle = (patch: Partial<ViewGeometryDisplaySettings['edges']>) => {
    const currentEdges = useUiPrefsStore.getState().view.geometryDisplay.edges
    updateGeometryDisplay({
      edges: {
        ...currentEdges,
        ...patch,
      },
    })
  }

  const updateEdgeInteractionStyle = (
    key: 'hover' | 'selected',
    patch: Partial<ViewGeometryDisplayEdgeInteractionStyle>,
  ) => {
    const currentEdges = useUiPrefsStore.getState().view.geometryDisplay.edges
    updateGeometryDisplay({
      edges: {
        ...currentEdges,
        [key]: {
          ...currentEdges[key],
          ...patch,
        },
      },
    })
  }

  const updateEdgeDepth = (value: string) => {
    if (!isViewGeometryDisplayEdgeDepthMode(value)) {
      return
    }
    updateEdgeStyle({ depthMode: value })
  }

  const updatePointVisibility = (value: string) => {
    updateGeometryDisplay({
      points: {
        visible: value === 'on',
      },
    })
  }

  const handleAmbientOcclusionChange = (value: string) => {
    if (!isViewAmbientOcclusionPreset(value)) {
      return
    }
    setViewKey('postProcessing', createViewAmbientOcclusionPresetSettings(value))
  }

  const updateAmbientOcclusion = (patch: Partial<ViewPostProcessSettings>) => {
    const currentPostProcessing = useUiPrefsStore.getState().view.postProcessing
    setViewKey('postProcessing', {
      ...currentPostProcessing,
      ...patch,
    })
  }

  const handleAmbientOcclusionTypeChange = (value: string) => {
    if (!isViewAmbientOcclusionType(value)) {
      return
    }
    updateAmbientOcclusion({
      aoType: value,
      ssaoEnabled: value !== 'off',
    })
  }

  const updateAmbientOcclusionQuality = (value: string) => {
    if (!isViewSsaoQuality(value)) {
      return
    }
    updateAmbientOcclusion({ ssaoQuality: value })
  }

  const handleReset = () => {
    setViewKey('renderPreview', DEFAULT_RENDER_PREVIEW_SETTINGS)
  }

  const updateEnvironmentGrade = (patch: Partial<EnvironmentGradeSettings>) => {
    setEnvironmentGrade(patch)
  }

  const beginEnvironmentLookDraft = () => {
    if (environmentLookDraftRef.current === null) {
      environmentLookDraftRef.current = captureEnvironmentLookHistorySnapshot()
    }
  }

  const commitEnvironmentLookDraft = (options: {
    targetId: string
    targetLabel: string
  }) => {
    const beforeSnapshot = environmentLookDraftRef.current
    environmentLookDraftRef.current = null
    if (beforeSnapshot === null) {
      return
    }
    commitEnvironmentLookHistory(beforeSnapshot, options)
  }

  const runEnvironmentLookCommit = (action: () => void, options: {
    targetId: string
    targetLabel: string
  }) => {
    runEnvironmentLookHistoryAction(action, options)
  }

  const selectedLightHistoryTarget = (lightId: string, field: string) =>
    `environment-light:${lightId}:${field}`

  const selectedLightHistoryLabel = (fieldLabel: string) =>
    `Environment light ${fieldLabel}`

  const updateSelectedLightLive = (
    lightId: string,
    patch: Partial<LightSpec>,
  ) => {
    beginEnvironmentLookDraft()
    updateLight(lightId, patch)
  }

  const commitSelectedLightDraft = (
    lightId: string,
    field: string,
    fieldLabel: string,
  ) => {
    commitEnvironmentLookDraft({
      targetId: selectedLightHistoryTarget(lightId, field),
      targetLabel: selectedLightHistoryLabel(fieldLabel),
    })
  }

  const runSelectedLightCommit = (
    lightId: string,
    field: string,
    fieldLabel: string,
    action: () => void,
  ) => {
    runEnvironmentLookCommit(action, {
      targetId: selectedLightHistoryTarget(lightId, field),
      targetLabel: selectedLightHistoryLabel(fieldLabel),
    })
  }

  const updateShadowsEnabled = (value: string) => {
    setViewKey('shadowsEnabled', value === 'on')
  }

  const updateContactShadows = (patch: Partial<ViewContactShadowSettings>) => {
    const currentContactShadows = useUiPrefsStore.getState().view.contactShadows
    setViewKey('contactShadows', {
      ...currentContactShadows,
      ...patch,
    })
  }

  const updateContactShadowsEnabled = (value: string) => {
    updateContactShadows({ enabled: value === 'on' })
  }

  const setGround = (patch: Partial<typeof ground>) => {
    setView({
      ground: {
        ...ground,
        ...patch,
      },
    })
  }

  const beginGroundHeightDraft = () => {
    if (groundHeightDraftRef.current !== null) {
      return
    }
    groundHeightDraftRef.current = captureGroundHistorySnapshot()
  }

  const updateGroundHeight = (value: number) => {
    beginGroundHeightDraft()
    setGround({ height: value })
  }

  const commitGroundHeightDraft = () => {
    const beforeSnapshot = groundHeightDraftRef.current
    groundHeightDraftRef.current = null
    if (beforeSnapshot === null) {
      return
    }
    commitGroundHistory(beforeSnapshot, {
      targetId: 'ground:height',
      targetLabel: 'Ground height',
    })
  }

  const updateGroundEnabled = (value: string) => {
    setGroundEnabledWithHistory(value === 'on')
  }

  const updateGroundMaterialPreset = (value: string) => {
    setGroundMaterialPresetWithHistory(value as GroundMaterialPresetId)
  }

  const updateGridVisible = (value: string) => {
    setViewKey('gridVisible', value === 'on')
  }

  const updateGridPresentation = (patch: Partial<GridPresentationSettings>) => {
    const currentGridPresentation = useUiPrefsStore.getState().view.gridPresentation
    setViewKey('gridPresentation', {
      ...currentGridPresentation,
      ...patch,
      layers: patch.layers ?? currentGridPresentation.layers,
    })
  }

  const updateGridLayer = (
    layerId: GridPresentationLayerId,
    patch: Partial<GridPresentationLayerSettings>,
  ) => {
    const currentGridPresentation = useUiPrefsStore.getState().view.gridPresentation
    updateGridPresentation({
      layers: currentGridPresentation.layers.map((layer) =>
        layer.id === layerId ? { ...layer, ...patch } : layer,
      ),
    })
  }

  const setGridLayerColorExpanded = (
    layerId: GridPresentationLayerId,
    nextExpanded: boolean,
  ) => {
    setExpandedGridColorLayerIds((currentLayerIds) => {
      const nextLayerIds = new Set(currentLayerIds)
      if (nextExpanded) {
        nextLayerIds.add(layerId)
      } else {
        nextLayerIds.delete(layerId)
      }
      return nextLayerIds
    })
  }

  const toggleGeometryDisplaySubsection = (sectionId: GeometryDisplaySubsectionId) => {
    setExpandedGeometryDisplaySubsections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }))
  }

  const qualityPresetRead = resolveRenderPreviewQualityPresetRead(renderPreview)
  const ambientOcclusionRead = resolveViewAmbientOcclusionPresetRead(postProcessing)
  const selectedLight =
    lighting.lights.find((light) => light.id === lighting.selectedLightId) ?? null
  const selectedLightSupportsShadow =
    selectedLight !== null && supportsShadow(selectedLight.type)
  const environmentGradeReadback = 'View settings grade'
  const environmentGradeNote = 'Uses the saved environment grade.'
  const shadowsReadback = shadowsEnabled ? 'On in rendered mode' : 'Off'
  const shadowsNote = 'Uses the saved shadow setting and selected light shadow controls.'
  const groundReadback = ground.enabled ? `On at ${formatGroundHeight(ground.height)}` : 'Off'
  const groundNote = 'Uses the saved ground setting.'
  const gridReadback = gridVisible ? `On at ${formatGridHeight(gridPresentation.height)}` : 'Off'
  const gridNote = 'Uses the saved grid presentation setting.'
  const aoEnabled = postProcessing.aoType !== 'off'
  const basicSsaoActive = postProcessing.aoType === 'basicSsao'
  const customSurfaceMaterial =
    geometryDisplay.surfaces.customMaterial ??
    DEFAULT_VIEW_GEOMETRY_DISPLAY_CUSTOM_SURFACE_MATERIAL
  const customSurfaceActive = geometryDisplay.surfaces.source === 'custom'

  return (
    <section className="SettingsSurfaceGroup PropertiesRenderSection" aria-label="Render settings">
      <header className="SettingsSurfaceGroupHeader">
        <span className="SettingsSurfaceGroupEyebrow">Render</span>
        <strong>Viewport presentation</strong>
      </header>
      <div className="SettingsSurfaceEditorPanel">
        <div className="SettingsSurfaceEditorGrid">
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Display Mode"
              value={displayMode}
              options={displayModeOptions}
              onChange={handleDisplayModeChange}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Render Preset"
              value={viewportStyle}
              options={renderPresetOptions}
              onChange={handleRenderPresetChange}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
        </div>
      </div>
      <header className="SettingsSurfaceGroupHeader">
        <span className="SettingsSurfaceGroupEyebrow">Render</span>
        <strong>Geometry Display</strong>
      </header>
      <div className="SettingsSurfaceEditorPanel PropertiesGeometryDisplayPanel">
        <div className="PropertiesGeometryDisplaySubsection">
          <button
            type="button"
            className="PropertiesGeometryDisplaySubsectionHeader"
            aria-expanded={expandedGeometryDisplaySubsections.surfaces}
            aria-controls="properties-geometry-display-surfaces"
            aria-label="Toggle Surfaces controls"
            onClick={() => toggleGeometryDisplaySubsection('surfaces')}
          >
            <span>Surfaces</span>
            <span className="PropertiesGeometryDisplaySubsectionGlyph" aria-hidden="true">
              {expandedGeometryDisplaySubsections.surfaces ? '-' : '+'}
            </span>
          </button>
          {expandedGeometryDisplaySubsections.surfaces ? (
            <div
              id="properties-geometry-display-surfaces"
              className="SettingsSurfaceEditorGrid PropertiesGeometryDisplaySubsectionBody"
            >
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSelect
                  label="Surfaces"
                  value={geometryDisplay.surfaces.visible ? 'on' : 'off'}
                  options={enabledOptions}
                  onChange={updateSurfaceVisibility}
                  menuMode="custom"
                  capGlyph="chevron"
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSelect
                  label="Surface Source"
                  value={geometryDisplay.surfaces.source}
                  options={geometryDisplaySurfaceSourceOptions}
                  onChange={updateSurfaceSource}
                  menuMode="custom"
                  capGlyph="chevron"
                />
              </div>
              {customSurfaceActive ? (
                <>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <PropertiesColorControl
                      id="surface-color"
                      label="Surface Color"
                      value={customSurfaceMaterial.color}
                      isExpanded={customSurfaceColorExpanded}
                      onExpandedChange={setCustomSurfaceColorExpanded}
                      onChange={(color) => updateCustomSurfaceMaterial({ color })}
                      nativeInputLabel="Surface Color"
                      expandButtonLabel="Expand surface color controls"
                      expandedControlsLabel="Expanded surface color controls"
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <PropertiesColorControl
                      id="surface-emissive-color"
                      label="Surface Emissive Color"
                      value={customSurfaceMaterial.emissive}
                      isExpanded={customSurfaceEmissiveExpanded}
                      onExpandedChange={setCustomSurfaceEmissiveExpanded}
                      onChange={(emissive) => updateCustomSurfaceMaterial({ emissive })}
                      nativeInputLabel="Surface Emissive Color"
                      expandButtonLabel="Expand surface emissive color controls"
                      expandedControlsLabel="Expanded surface emissive color controls"
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSlider
                      label="Surface Metalness"
                      value={customSurfaceMaterial.metalness}
                      min={0}
                      max={1}
                      step={0.01}
                      formatValue={formatMaterialPercent}
                      onChange={(metalness) => updateCustomSurfaceMaterial({ metalness })}
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSlider
                      label="Surface Roughness"
                      value={customSurfaceMaterial.roughness}
                      min={0}
                      max={1}
                      step={0.01}
                      formatValue={formatMaterialPercent}
                      onChange={(roughness) => updateCustomSurfaceMaterial({ roughness })}
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSlider
                      label="Surface Opacity"
                      value={customSurfaceMaterial.opacity}
                      min={0}
                      max={1}
                      step={0.01}
                      formatValue={formatMaterialPercent}
                      onChange={(opacity) => updateCustomSurfaceMaterial({ opacity })}
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSlider
                      label="Surface Emissive"
                      value={customSurfaceMaterial.emissiveIntensity}
                      min={0}
                      max={2}
                      step={0.01}
                      formatValue={formatMaterialPercent}
                      onChange={(emissiveIntensity) =>
                        updateCustomSurfaceMaterial({ emissiveIntensity })
                      }
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSelect
                      label="Surface Transparency"
                      value={customSurfaceMaterial.transparent ? 'transparent' : 'opaque'}
                      options={[
                        { value: 'opaque', label: 'Opaque' },
                        { value: 'transparent', label: 'Transparent' },
                      ]}
                      onChange={(value) =>
                        updateCustomSurfaceMaterial({ transparent: value === 'transparent' })
                      }
                      menuMode="custom"
                      capGlyph="chevron"
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSelect
                      label="Surface Rendering"
                      value={customSurfaceMaterial.doubleSided ? 'double' : 'front'}
                      options={[
                        { value: 'front', label: 'Front-sided' },
                        { value: 'double', label: 'Double-sided' },
                      ]}
                      onChange={(value) =>
                        updateCustomSurfaceMaterial({ doubleSided: value === 'double' })
                      }
                      menuMode="custom"
                      capGlyph="chevron"
                    />
                  </div>
                </>
              ) : null}
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <PropertiesColorControl
                  id="surface-hover-color"
                  label="Surface Hover Color"
                  value={geometryDisplay.surfaces.hover.color}
                  isExpanded={surfaceHoverColorExpanded}
                  onExpandedChange={setSurfaceHoverColorExpanded}
                  onChange={(color) => updateSurfaceStyle('hover', { color })}
                  nativeInputLabel="Surface Hover Color"
                  expandButtonLabel="Expand surface hover color controls"
                  expandedControlsLabel="Expanded surface hover color controls"
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="Surface Hover Opacity"
                  value={geometryDisplay.surfaces.hover.opacity}
                  min={0.05}
                  max={0.9}
                  step={0.01}
                  formatValue={formatMaterialPercent}
                  onChange={(opacity) => updateSurfaceStyle('hover', { opacity })}
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <PropertiesColorControl
                  id="surface-selected-color"
                  label="Surface Selected Color"
                  value={geometryDisplay.surfaces.selected.color}
                  isExpanded={surfaceSelectedColorExpanded}
                  onExpandedChange={setSurfaceSelectedColorExpanded}
                  onChange={(color) => updateSurfaceStyle('selected', { color })}
                  nativeInputLabel="Surface Selected Color"
                  expandButtonLabel="Expand surface selected color controls"
                  expandedControlsLabel="Expanded surface selected color controls"
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="Surface Selected Opacity"
                  value={geometryDisplay.surfaces.selected.opacity}
                  min={0.05}
                  max={0.95}
                  step={0.01}
                  formatValue={formatMaterialPercent}
                  onChange={(opacity) => updateSurfaceStyle('selected', { opacity })}
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <PropertiesColorControl
                  id="body-selected-color"
                  label="Body Selected Color"
                  value={geometryDisplay.surfaces.bodySelected.color}
                  isExpanded={bodySelectedColorExpanded}
                  onExpandedChange={setBodySelectedColorExpanded}
                  onChange={(color) => updateSurfaceStyle('bodySelected', { color })}
                  nativeInputLabel="Body Selected Color"
                  expandButtonLabel="Expand body selected color controls"
                  expandedControlsLabel="Expanded body selected color controls"
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="Body Selected Opacity"
                  value={geometryDisplay.surfaces.bodySelected.opacity}
                  min={0.05}
                  max={0.85}
                  step={0.01}
                  formatValue={formatMaterialPercent}
                  onChange={(opacity) => updateSurfaceStyle('bodySelected', { opacity })}
                />
              </div>
            </div>
          ) : null}
        </div>
        <div className="PropertiesGeometryDisplaySubsection">
          <button
            type="button"
            className="PropertiesGeometryDisplaySubsectionHeader"
            aria-expanded={expandedGeometryDisplaySubsections.edges}
            aria-controls="properties-geometry-display-edges"
            aria-label="Toggle Edges controls"
            onClick={() => toggleGeometryDisplaySubsection('edges')}
          >
            <span>Edges</span>
            <span className="PropertiesGeometryDisplaySubsectionGlyph" aria-hidden="true">
              {expandedGeometryDisplaySubsections.edges ? '-' : '+'}
            </span>
          </button>
          {expandedGeometryDisplaySubsections.edges ? (
            <div
              id="properties-geometry-display-edges"
              className="SettingsSurfaceEditorGrid PropertiesGeometryDisplaySubsectionBody"
            >
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSelect
                  label="Edges"
                  value={geometryDisplay.edges.mode}
                  options={geometryDisplayEdgeOptions}
                  onChange={updateEdgeVisibility}
                  menuMode="custom"
                  capGlyph="chevron"
                />
              </div>
              {geometryDisplay.edges.mode !== 'off' ? (
                <>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <PropertiesColorControl
                      id="edge-color"
                      label="Edge Color"
                      value={geometryDisplay.edges.color}
                      isExpanded={edgeColorExpanded}
                      onExpandedChange={setEdgeColorExpanded}
                      onChange={(color) => updateEdgeStyle({ color })}
                      nativeInputLabel="Edge Color"
                      expandButtonLabel="Expand edge color controls"
                      expandedControlsLabel="Expanded edge color controls"
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSlider
                      label="Edge Opacity"
                      value={geometryDisplay.edges.opacity}
                      min={MIN_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY}
                      max={MAX_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY}
                      step={0.01}
                      formatValue={formatMaterialPercent}
                      onChange={(opacity) => updateEdgeStyle({ opacity })}
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSelect
                      label="Edge Depth"
                      value={geometryDisplay.edges.depthMode}
                      options={geometryDisplayEdgeDepthOptions}
                      onChange={updateEdgeDepth}
                      menuMode="custom"
                      capGlyph="chevron"
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <PropertiesColorControl
                      id="edge-hover-color"
                      label="Edge Hover Color"
                      value={geometryDisplay.edges.hover.color}
                      isExpanded={edgeHoverColorExpanded}
                      onExpandedChange={setEdgeHoverColorExpanded}
                      onChange={(color) => updateEdgeInteractionStyle('hover', { color })}
                      nativeInputLabel="Edge Hover Color"
                      expandButtonLabel="Expand edge hover color controls"
                      expandedControlsLabel="Expanded edge hover color controls"
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSlider
                      label="Edge Hover Opacity"
                      value={geometryDisplay.edges.hover.opacity}
                      min={MIN_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY}
                      max={MAX_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY}
                      step={0.01}
                      formatValue={formatMaterialPercent}
                      onChange={(opacity) => updateEdgeInteractionStyle('hover', { opacity })}
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <PropertiesColorControl
                      id="edge-selected-color"
                      label="Edge Selected Color"
                      value={geometryDisplay.edges.selected.color}
                      isExpanded={edgeSelectedColorExpanded}
                      onExpandedChange={setEdgeSelectedColorExpanded}
                      onChange={(color) => updateEdgeInteractionStyle('selected', { color })}
                      nativeInputLabel="Edge Selected Color"
                      expandButtonLabel="Expand edge selected color controls"
                      expandedControlsLabel="Expanded edge selected color controls"
                    />
                  </div>
                  <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                    <ParaSlider
                      label="Edge Selected Opacity"
                      value={geometryDisplay.edges.selected.opacity}
                      min={MIN_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY}
                      max={MAX_VIEW_GEOMETRY_DISPLAY_EDGE_OPACITY}
                      step={0.01}
                      formatValue={formatMaterialPercent}
                      onChange={(opacity) => updateEdgeInteractionStyle('selected', { opacity })}
                    />
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="PropertiesGeometryDisplaySubsection">
          <button
            type="button"
            className="PropertiesGeometryDisplaySubsectionHeader"
            aria-expanded={expandedGeometryDisplaySubsections.points}
            aria-controls="properties-geometry-display-points"
            aria-label="Toggle Points controls"
            onClick={() => toggleGeometryDisplaySubsection('points')}
          >
            <span>Points</span>
            <span className="PropertiesGeometryDisplaySubsectionGlyph" aria-hidden="true">
              {expandedGeometryDisplaySubsections.points ? '-' : '+'}
            </span>
          </button>
          {expandedGeometryDisplaySubsections.points ? (
            <div
              id="properties-geometry-display-points"
              className="SettingsSurfaceEditorGrid PropertiesGeometryDisplaySubsectionBody"
            >
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSelect
                  label="Points"
                  value={geometryDisplay.points.visible ? 'on' : 'off'}
                  options={enabledOptions}
                  onChange={updatePointVisibility}
                  menuMode="custom"
                  capGlyph="chevron"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <header className="SettingsSurfaceGroupHeader">
        <span className="SettingsSurfaceGroupEyebrow">Render</span>
        <strong>Environment</strong>
      </header>
      <div className="SettingsSurfaceEditorPanel">
        <div className="SettingsSurfaceEditorGrid">
          <div
            className="SettingsSurfaceEditorField PropertiesRenderControl"
            data-properties-render-readback="environment"
          >
            <span className="SettingsSurfaceFieldLabel">Grade</span>
            <strong>{environmentGradeReadback}</strong>
            <p>{environmentGradeNote}</p>
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Exposure"
              value={environmentGrade.exposure}
              min={0}
              max={5}
              step={0.01}
              formatValue={formatEnvironmentGradeMultiplierValue}
              onChange={(exposure) => updateEnvironmentGrade({ exposure })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Contrast"
              value={environmentGrade.contrast}
              min={0}
              max={3}
              step={0.01}
              formatValue={formatEnvironmentGradeMultiplierValue}
              onChange={(contrast) => updateEnvironmentGrade({ contrast })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Highlights"
              value={environmentGrade.highlights}
              min={-100}
              max={100}
              step={1}
              formatValue={formatEnvironmentGradeOffsetValue}
              onChange={(highlights) => updateEnvironmentGrade({ highlights })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Shadows"
              value={environmentGrade.shadows}
              min={-100}
              max={100}
              step={1}
              formatValue={formatEnvironmentGradeOffsetValue}
              onChange={(shadows) => updateEnvironmentGrade({ shadows })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Whites"
              value={environmentGrade.whites}
              min={-100}
              max={100}
              step={1}
              formatValue={formatEnvironmentGradeOffsetValue}
              onChange={(whites) => updateEnvironmentGrade({ whites })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Blacks"
              value={environmentGrade.blacks}
              min={-100}
              max={100}
              step={1}
              formatValue={formatEnvironmentGradeOffsetValue}
              onChange={(blacks) => updateEnvironmentGrade({ blacks })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Temperature"
              value={environmentGrade.temperature}
              min={-100}
              max={100}
              step={1}
              formatValue={formatEnvironmentGradeOffsetValue}
              onChange={(temperature) => updateEnvironmentGrade({ temperature })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Tint"
              value={environmentGrade.tint}
              min={-100}
              max={100}
              step={1}
              formatValue={formatEnvironmentGradeOffsetValue}
              onChange={(tint) => updateEnvironmentGrade({ tint })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Saturation"
              value={environmentGrade.saturation}
              min={0}
              max={3}
              step={0.01}
              formatValue={formatEnvironmentGradeMultiplierValue}
              onChange={(saturation) => updateEnvironmentGrade({ saturation })}
            />
          </div>
        </div>
      </div>
      <header className="SettingsSurfaceGroupHeader">
        <span className="SettingsSurfaceGroupEyebrow">Render</span>
        <strong>Shadows</strong>
      </header>
      <div className="SettingsSurfaceEditorPanel">
        <div className="SettingsSurfaceEditorGrid">
          <div
            className="SettingsSurfaceEditorField PropertiesRenderControl"
            data-properties-render-readback="shadows"
          >
            <span className="SettingsSurfaceFieldLabel">Shadows</span>
            <strong>{shadowsReadback}</strong>
            <p>{shadowsNote}</p>
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Shadows"
              value={shadowsEnabled ? 'on' : 'off'}
              options={enabledOptions}
              onChange={updateShadowsEnabled}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="AO Type"
              value={postProcessing.aoType}
              options={aoTypeOptions}
              onChange={handleAmbientOcclusionTypeChange}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
          {basicSsaoActive ? (
            <div className="SettingsSurfaceEditorField PropertiesRenderControl">
              <ParaSelect
                label="Ambient Occlusion"
                value={ambientOcclusionRead}
                options={ambientOcclusionOptions}
                onChange={handleAmbientOcclusionChange}
                menuMode="custom"
                capGlyph="chevron"
              />
            </div>
          ) : null}
          {aoEnabled ? (
            <>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="AO Intensity"
                  value={postProcessing.ssaoIntensity}
                  min={MIN_VIEW_SSAO_INTENSITY}
                  max={MAX_VIEW_SSAO_INTENSITY}
                  step={0.01}
                  formatValue={formatEnvironmentGradeMultiplierValue}
                  onChange={(ssaoIntensity) => updateAmbientOcclusion({ ssaoIntensity })}
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="AO Radius"
                  value={postProcessing.ssaoRadius}
                  min={MIN_VIEW_SSAO_RADIUS}
                  max={MAX_VIEW_SSAO_RADIUS}
                  step={0.01}
                  formatValue={formatGridSpacing}
                  onChange={(ssaoRadius) => updateAmbientOcclusion({ ssaoRadius })}
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSelect
                  label="AO Quality"
                  value={postProcessing.ssaoQuality}
                  options={aoQualityOptions}
                  onChange={updateAmbientOcclusionQuality}
                  menuMode="custom"
                  capGlyph="chevron"
                />
              </div>
            </>
          ) : null}
          {basicSsaoActive ? (
            <div className="SettingsSurfaceEditorField PropertiesRenderControl">
              <ParaSlider
                label="AO Contact Bias"
                value={postProcessing.ssaoContactBias}
                min={MIN_VIEW_SSAO_CONTACT_BIAS}
                max={MAX_VIEW_SSAO_CONTACT_BIAS}
                step={0.0001}
                formatValue={formatLightShadowBiasValue}
                onChange={(ssaoContactBias) => updateAmbientOcclusion({ ssaoContactBias })}
              />
            </div>
          ) : null}
          {aoEnabled ? (
            <div className="SettingsSurfaceEditorField PropertiesRenderControl">
              <ParaSlider
                label="AO Distance Threshold"
                value={postProcessing.ssaoDistanceThreshold}
                min={MIN_VIEW_SSAO_DISTANCE_THRESHOLD}
                max={MAX_VIEW_SSAO_DISTANCE_THRESHOLD}
                step={0.001}
                formatValue={formatGridSpacing}
                onChange={(ssaoDistanceThreshold) =>
                  updateAmbientOcclusion({ ssaoDistanceThreshold })
                }
              />
            </div>
          ) : null}
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Contact Shadows"
              value={contactShadows.enabled ? 'on' : 'off'}
              options={enabledOptions}
              onChange={updateContactShadowsEnabled}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
          {contactShadows.enabled ? (
            <>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="Contact Opacity"
                  value={contactShadows.opacity}
                  min={MIN_CONTACT_SHADOW_OPACITY}
                  max={MAX_CONTACT_SHADOW_OPACITY}
                  step={0.01}
                  formatValue={formatEnvironmentGradeMultiplierValue}
                  onChange={(opacity) => updateContactShadows({ opacity })}
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="Contact Spread"
                  value={contactShadows.spread}
                  min={MIN_CONTACT_SHADOW_SPREAD}
                  max={MAX_CONTACT_SHADOW_SPREAD}
                  step={0.01}
                  formatValue={formatEnvironmentGradeMultiplierValue}
                  onChange={(spread) => updateContactShadows({ spread })}
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="Contact Height Fade"
                  value={contactShadows.heightFade}
                  min={MIN_CONTACT_SHADOW_HEIGHT_FADE}
                  max={MAX_CONTACT_SHADOW_HEIGHT_FADE}
                  step={0.5}
                  formatValue={(value) => value.toFixed(1)}
                  onChange={(heightFade) => updateContactShadows({ heightFade })}
                />
              </div>
            </>
          ) : null}
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <span className="SettingsSurfaceFieldLabel">Selected Light Shadows</span>
            {selectedLight === null ? (
              <p>Select a light to edit shadow controls.</p>
            ) : !selectedLightSupportsShadow ? (
              <p>{lightTypeLabel(selectedLight.type)} lights do not support shadows.</p>
            ) : (
              <>
                <strong>{selectedLight.name}</strong>
                <p>Uses the selected environment light shadow settings.</p>
              </>
            )}
          </div>
          {selectedLight !== null && selectedLightSupportsShadow ? (
            <>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSelect
                  label="Cast Shadow"
                  value={selectedLight.castShadow ? 'on' : 'off'}
                  options={enabledOptions}
                  onChange={(value) =>
                    runSelectedLightCommit(selectedLight.id, 'castShadow', 'cast shadow', () =>
                      updateLight(selectedLight.id, { castShadow: value === 'on' }),
                    )
                  }
                  menuMode="custom"
                  capGlyph="chevron"
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSlider
                  label="Shadow Bias"
                  min={-0.01}
                  max={0.01}
                  step={0.0001}
                  value={selectedLight.shadowBias ?? -0.0003}
                  onChange={(value) =>
                    updateSelectedLightLive(selectedLight.id, { shadowBias: value })
                  }
                  onChangeEnd={() =>
                    commitSelectedLightDraft(selectedLight.id, 'shadowBias', 'shadow bias')
                  }
                  formatValue={formatLightShadowBiasValue}
                />
              </div>
              <div className="SettingsSurfaceEditorField PropertiesRenderControl">
                <ParaSelect
                  label="Shadow Map"
                  value={`${selectedLight.shadowMapSize ?? 1024}`}
                  options={shadowMapOptions}
                  onChange={(value) =>
                    runSelectedLightCommit(selectedLight.id, 'shadowMapSize', 'shadow map', () =>
                      updateLight(selectedLight.id, { shadowMapSize: Number(value) }),
                    )
                  }
                  menuMode="custom"
                  capGlyph="chevron"
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
      <header className="SettingsSurfaceGroupHeader">
        <span className="SettingsSurfaceGroupEyebrow">Render</span>
        <strong>Ground</strong>
      </header>
      <div className="SettingsSurfaceEditorPanel">
        <div className="SettingsSurfaceEditorGrid">
          <div
            className="SettingsSurfaceEditorField PropertiesRenderControl"
            data-properties-render-readback="ground"
          >
            <span className="SettingsSurfaceFieldLabel">Ground</span>
            <strong>{groundReadback}</strong>
            <p>{groundNote}</p>
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Ground"
              value={ground.enabled ? 'on' : 'off'}
              options={enabledOptions}
              onChange={updateGroundEnabled}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Ground Height"
              value={ground.height}
              min={-25}
              max={25}
              step={0.5}
              formatValue={(value) => value.toFixed(1)}
              onChange={updateGroundHeight}
              onChangeEnd={commitGroundHeightDraft}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Material"
              value={ground.materialPresetId}
              options={groundMaterialOptions}
              onChange={updateGroundMaterialPreset}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
        </div>
      </div>
      <header className="SettingsSurfaceGroupHeader">
        <span className="SettingsSurfaceGroupEyebrow">Render</span>
        <strong>Grid</strong>
      </header>
      <div className="SettingsSurfaceEditorPanel">
        <div className="SettingsSurfaceEditorGrid">
          <div
            className="SettingsSurfaceEditorField PropertiesRenderControl"
            data-properties-render-readback="grid"
          >
            <span className="SettingsSurfaceFieldLabel">Grid</span>
            <strong>{gridReadback}</strong>
            <p>{gridNote}</p>
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Grid"
              value={gridVisible ? 'on' : 'off'}
              options={enabledOptions}
              onChange={updateGridVisible}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Grid Height"
              value={gridPresentation.height}
              min={MIN_GRID_PRESENTATION_HEIGHT}
              max={MAX_GRID_PRESENTATION_HEIGHT}
              step={0.5}
              formatValue={formatGridHeight}
              onChange={(height) => updateGridPresentation({ height })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Grid Size"
              value={gridPresentation.size}
              min={MIN_GRID_PRESENTATION_SIZE}
              max={MAX_GRID_PRESENTATION_SIZE}
              step={25}
              formatValue={formatGridSize}
              onChange={(size) => updateGridPresentation({ size })}
            />
          </div>
          {gridPresentation.layers.map((layer) => {
            const layerLabel = GRID_PRESENTATION_LAYER_LABELS[layer.id]
            return (
              <div
                key={layer.id}
                className="SettingsSurfaceEditorField PropertiesRenderControl"
                data-properties-render-grid-layer={layer.id}
              >
                <span className="SettingsSurfaceFieldLabel">{layerLabel}</span>
                <ParaSelect
                  label={`${layerLabel} Layer`}
                  value={layer.enabled ? 'on' : 'off'}
                  options={enabledOptions}
                  onChange={(value) => updateGridLayer(layer.id, { enabled: value === 'on' })}
                  menuMode="custom"
                  capGlyph="chevron"
                />
                <ParaSlider
                  label={`${layerLabel} Spacing`}
                  value={layer.spacing}
                  min={MIN_GRID_PRESENTATION_SPACING}
                  max={MAX_GRID_PRESENTATION_SPACING}
                  step={0.1}
                  formatValue={formatGridSpacing}
                  onChange={(spacing) => updateGridLayer(layer.id, { spacing })}
                />
                <PropertiesColorControl
                  id={`${layer.id}-color`}
                  label={`${layerLabel} Color`}
                  value={layer.color}
                  isExpanded={expandedGridColorLayerIds.has(layer.id)}
                  onExpandedChange={(nextExpanded) =>
                    setGridLayerColorExpanded(layer.id, nextExpanded)
                  }
                  onChange={(color) => updateGridLayer(layer.id, { color })}
                  nativeInputLabel={`${layerLabel} Color`}
                  expandButtonLabel={`Expand ${layerLabel} color controls`}
                  expandedControlsLabel={`Expanded ${layerLabel} color controls`}
                />
                <ParaSlider
                  label={`${layerLabel} Opacity`}
                  value={layer.opacity}
                  min={MIN_GRID_PRESENTATION_OPACITY}
                  max={MAX_GRID_PRESENTATION_OPACITY}
                  step={0.05}
                  formatValue={formatGridOpacity}
                  onChange={(opacity) => updateGridLayer(layer.id, { opacity })}
                />
                <ParaSlider
                  label={`${layerLabel} Height Offset`}
                  value={layer.heightOffset}
                  min={MIN_GRID_PRESENTATION_HEIGHT_OFFSET}
                  max={MAX_GRID_PRESENTATION_HEIGHT_OFFSET}
                  step={0.001}
                  formatValue={formatGridHeightOffset}
                  onChange={(heightOffset) => updateGridLayer(layer.id, { heightOffset })}
                />
              </div>
            )
          })}
        </div>
      </div>
      <header className="SettingsSurfaceGroupHeader">
        <span className="SettingsSurfaceGroupEyebrow">Render Preview</span>
        <strong>Render Preview quality</strong>
        <p>Presentation settings for the progressive viewport renderer.</p>
      </header>
      <div className="SettingsSurfaceEditorPanel">
        <div className="SettingsSurfaceEditorGrid">
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Quality preset"
              value={qualityPresetRead}
              options={RENDER_PREVIEW_QUALITY_PRESET_OPTIONS}
              onChange={handlePresetChange}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Samples"
              value={renderPreview.targetSamples}
              min={MIN_RENDER_PREVIEW_TARGET_SAMPLES}
              max={MAX_RENDER_PREVIEW_TARGET_SAMPLES}
              step={SAMPLE_STEP}
              formatValue={formatSamples}
              onChange={(targetSamples) => updateRenderPreview({ targetSamples })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Light bounces"
              value={renderPreview.bounces}
              min={MIN_RENDER_PREVIEW_BOUNCES}
              max={MAX_RENDER_PREVIEW_BOUNCES}
              step={BOUNCE_STEP}
              formatValue={formatBounces}
              onChange={(bounces) => updateRenderPreview({ bounces })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSlider
              label="Render scale"
              value={renderPreview.renderScale}
              min={MIN_RENDER_PREVIEW_RENDER_SCALE}
              max={MAX_RENDER_PREVIEW_RENDER_SCALE}
              step={RENDER_SCALE_STEP}
              formatValue={formatRenderScale}
              displayValue={formatRenderScale(renderPreview.renderScale)}
              onChange={(renderScale) => updateRenderPreview({ renderScale })}
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="Noise cleanup"
              value={renderPreview.noiseCleanup}
              options={noiseCleanupOptions}
              onChange={handleNoiseCleanupChange}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
          <div className="SettingsSurfaceEditorField PropertiesRenderControl">
            <ParaSelect
              label="GPU load"
              value={renderPreview.gpuLoad}
              options={gpuLoadOptions}
              onChange={handleGpuLoadChange}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
        </div>
        <div className="SettingsSurfaceEditorActions">
          <button
            type="button"
            className="SettingsSurfaceEditorResetButton"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  )
}
