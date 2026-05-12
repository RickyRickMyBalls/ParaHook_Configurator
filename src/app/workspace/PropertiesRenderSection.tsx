import type { ReactNode } from 'react'
import {
  DEFAULT_RENDER_PREVIEW_SETTINGS,
  MAX_RENDER_PREVIEW_BOUNCES,
  MAX_RENDER_PREVIEW_RENDER_SCALE,
  MAX_RENDER_PREVIEW_TARGET_SAMPLES,
  MIN_RENDER_PREVIEW_BOUNCES,
  MIN_RENDER_PREVIEW_RENDER_SCALE,
  MIN_RENDER_PREVIEW_TARGET_SAMPLES,
  RENDER_PREVIEW_GPU_LOAD_OPTIONS,
  RENDER_PREVIEW_NOISE_CLEANUP_OPTIONS,
  isRenderPreviewGpuLoad,
  isRenderPreviewNoiseCleanup,
  normalizeRenderPreviewSettings,
  type RenderPreviewGpuLoad,
  type RenderPreviewNoiseCleanup,
  type RenderPreviewSettings,
} from '../../shared/viewSettingsTypes'
import { ParaSelect } from '../components/ParaSelect'
import { ParaSlider } from '../components/ParaSlider'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import type { PropertiesSectionContext, PropertiesSectionDefinition } from './propertiesSectionContract'

const SAMPLE_STEP = 8
const BOUNCE_STEP = 1
const RENDER_SCALE_STEP = 0.05

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

const noiseCleanupOptions = RENDER_PREVIEW_NOISE_CLEANUP_OPTIONS.map((value) => ({
  value,
  label: NOISE_CLEANUP_LABELS[value],
}))

const gpuLoadOptions = RENDER_PREVIEW_GPU_LOAD_OPTIONS.map((value) => ({
  value,
  label: GPU_LOAD_LABELS[value],
}))

const formatSamples = (value: number): string => `${Math.round(value)}`
const formatBounces = (value: number): string => `${Math.round(value)}`
const formatRenderScale = (value: number): string => `${Math.round(value * 100)}%`

const buildRenderPreviewPatch = (
  current: RenderPreviewSettings,
  patch: Partial<RenderPreviewSettings>,
): RenderPreviewSettings => normalizeRenderPreviewSettings({ ...current, ...patch }, current)

const renderRenderSectionContent = (_context: PropertiesSectionContext): ReactNode => (
  <PropertiesRenderSectionContent />
)

export const propertiesRenderSectionDefinition: PropertiesSectionDefinition = {
  id: 'render',
  label: 'Render',
  summary: 'Preview quality',
  supports: () => true,
  renderContent: renderRenderSectionContent,
}

function PropertiesRenderSectionContent() {
  const renderPreview = useUiPrefsStore((state) => state.view.renderPreview)
  const setViewKey = useUiPrefsStore((state) => state.setViewKey)

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

  const handleReset = () => {
    setViewKey('renderPreview', DEFAULT_RENDER_PREVIEW_SETTINGS)
  }

  return (
    <section className="SettingsSurfaceGroup PropertiesRenderSection" aria-label="Render settings">
      <header className="SettingsSurfaceGroupHeader">
        <span className="SettingsSurfaceGroupEyebrow">Render</span>
        <strong>Render Preview quality</strong>
        <p>Presentation settings for the progressive viewport renderer.</p>
      </header>
      <div className="SettingsSurfaceEditorPanel">
        <div className="SettingsSurfaceEditorGrid">
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
