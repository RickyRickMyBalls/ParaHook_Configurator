/* eslint-disable react-refresh/only-export-components */
import { useRef, type ReactNode } from 'react'
import {
  DEFAULT_RENDER_PREVIEW_SETTINGS,
  MAX_RENDER_PREVIEW_BOUNCES,
  MAX_RENDER_PREVIEW_RENDER_SCALE,
  MAX_RENDER_PREVIEW_TARGET_SAMPLES,
  MIN_RENDER_PREVIEW_BOUNCES,
  MIN_RENDER_PREVIEW_RENDER_SCALE,
  MIN_RENDER_PREVIEW_TARGET_SAMPLES,
  RENDER_PREVIEW_QUALITY_PRESET_OPTIONS,
  RENDER_PREVIEW_GPU_LOAD_OPTIONS,
  RENDER_PREVIEW_NOISE_CLEANUP_OPTIONS,
  VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS,
  VIEWPORT_STYLE_OPTIONS,
  createRenderPreviewQualityPresetSettings,
  createViewAmbientOcclusionPresetSettings,
  isViewAmbientOcclusionPreset,
  isViewportStyle,
  isRenderPreviewGpuLoad,
  isRenderPreviewNoiseCleanup,
  normalizeRenderPreviewSettings,
  resolveRenderPreviewQualityPresetRead,
  resolveViewAmbientOcclusionPresetRead,
  type EnvironmentGradeSettings,
  type EnvironmentLookSnapshot,
  type GroundMaterialPresetId,
  type LightSpec,
  type LightType,
  type ViewAmbientOcclusionPreset,
  type RenderPreviewGpuLoad,
  type RenderPreviewNoiseCleanup,
  type RenderPreviewQualityPreset,
  type RenderPreviewSettings,
  type ViewportStyle,
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

const VIEWPORT_STYLE_LABELS: Record<ViewportStyle, string> = {
  standard: 'Standard',
  clayStudio: 'Clay Studio',
}

const AMBIENT_OCCLUSION_LABELS: Record<ViewAmbientOcclusionPreset, string> = {
  off: 'Off',
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

const viewportStyleOptions = VIEWPORT_STYLE_OPTIONS.map((value) => ({
  value,
  label: VIEWPORT_STYLE_LABELS[value],
}))

const ambientOcclusionOptions = VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS.map((value) => ({
  value,
  label: AMBIENT_OCCLUSION_LABELS[value],
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

const isRenderPreviewQualityPreset = (value: string): value is RenderPreviewQualityPreset =>
  value === 'fast' || value === 'balanced' || value === 'clean' || value === 'high'

const formatSamples = (value: number): string => `${Math.round(value)}`
const formatBounces = (value: number): string => `${Math.round(value)}`
const formatRenderScale = (value: number): string => `${Math.round(value * 100)}%`
const formatGroundHeight = (value: number): string =>
  Number.isInteger(value) ? `${value}` : value.toFixed(2)
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
  const renderPreview = useUiPrefsStore((state) => state.view.renderPreview)
  const viewportStyle = useUiPrefsStore((state) => state.view.viewportStyle)
  const postProcessing = useUiPrefsStore((state) => state.view.postProcessing)
  const environmentGrade = useUiPrefsStore((state) => state.view.environmentGrade)
  const shadowsEnabled = useUiPrefsStore((state) => state.view.shadowsEnabled)
  const ground = useUiPrefsStore((state) => state.view.ground)
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

  const handleViewportStyleChange = (value: string) => {
    if (!isViewportStyle(value)) {
      return
    }
    setViewKey('viewportStyle', value)
  }

  const handleAmbientOcclusionChange = (value: string) => {
    if (!isViewAmbientOcclusionPreset(value)) {
      return
    }
    setViewKey('postProcessing', createViewAmbientOcclusionPresetSettings(value))
  }

  const handleReset = () => {
    setViewKey('renderPreview', DEFAULT_RENDER_PREVIEW_SETTINGS)
  }

  const updateEnvironmentGrade = (patch: Partial<EnvironmentGradeSettings>) => {
    if (viewportStyle === 'clayStudio') {
      return
    }
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
    if (viewportStyle === 'clayStudio') {
      return
    }
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
    if (viewportStyle === 'clayStudio') {
      return
    }
    runEnvironmentLookCommit(action, {
      targetId: selectedLightHistoryTarget(lightId, field),
      targetLabel: selectedLightHistoryLabel(fieldLabel),
    })
  }

  const updateShadowsEnabled = (value: string) => {
    if (viewportStyle === 'clayStudio') {
      return
    }
    setViewKey('shadowsEnabled', value === 'on')
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
    if (viewportStyle === 'clayStudio') {
      return
    }
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
    if (viewportStyle === 'clayStudio') {
      return
    }
    setGroundEnabledWithHistory(value === 'on')
  }

  const updateGroundMaterialPreset = (value: string) => {
    if (viewportStyle === 'clayStudio') {
      return
    }
    setGroundMaterialPresetWithHistory(value as GroundMaterialPresetId)
  }

  const qualityPresetRead = resolveRenderPreviewQualityPresetRead(renderPreview)
  const ambientOcclusionRead = resolveViewAmbientOcclusionPresetRead(postProcessing)
  const clayStudioActive = viewportStyle === 'clayStudio'
  const selectedLight =
    lighting.lights.find((light) => light.id === lighting.selectedLightId) ?? null
  const selectedLightSupportsShadow =
    selectedLight !== null && supportsShadow(selectedLight.type)
  const environmentGradeReadback = clayStudioActive ? 'Clay Studio preset' : 'View settings grade'
  const environmentGradeNote = clayStudioActive
    ? 'Preset Locked. Switch to Standard to edit the saved grade.'
    : 'Uses the saved environment grade.'
  const shadowsReadback = clayStudioActive
    ? 'Clay Studio preset'
    : shadowsEnabled
      ? 'On in rendered mode'
      : 'Off'
  const shadowsNote = clayStudioActive
    ? 'Preset Locked. Hard shadows stay off; contact treatment is preset-owned.'
    : 'Uses the saved shadow setting and selected light shadow controls.'
  const groundReadback = clayStudioActive
    ? 'Clay Studio preset'
    : ground.enabled
      ? `On at ${formatGroundHeight(ground.height)}`
      : 'Off'
  const groundNote = clayStudioActive
    ? `Preset Locked. Ground is forced on; saved height ${formatGroundHeight(ground.height)}.`
    : 'Uses the saved ground setting.'

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
              label="Viewport Style"
              value={viewportStyle}
              options={viewportStyleOptions}
              onChange={handleViewportStyleChange}
              menuMode="custom"
              capGlyph="chevron"
            />
          </div>
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
            />
          </div>
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
                  disabled={clayStudioActive}
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
                  disabled={clayStudioActive}
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
                  disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
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
              disabled={clayStudioActive}
            />
          </div>
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
