import type { Camera, Scene, WebGLRenderer } from 'three'
import { WebGLPathTracer } from 'three-gpu-pathtracer'
import {
  DEFAULT_RENDER_PREVIEW_SETTINGS,
  DEFAULT_RENDER_PREVIEW_TARGET_SAMPLES as DEFAULT_SHARED_RENDER_PREVIEW_TARGET_SAMPLES,
  normalizeRenderPreviewSettings,
  type RenderPreviewGpuLoad,
  type RenderPreviewNoiseCleanup,
  type RenderPreviewSettings,
} from '../shared/viewSettingsTypes'

export const DEFAULT_RENDER_PREVIEW_TARGET_SAMPLES =
  DEFAULT_SHARED_RENDER_PREVIEW_TARGET_SAMPLES

export type RenderPreviewRuntimeCreateOptions = {
  renderer: WebGLRenderer
  settings?: Partial<RenderPreviewSettings>
  targetSamples?: number
}

export type RenderPreviewRuntimeSettings = RenderPreviewSettings

export type RenderPreviewRuntimeAdapterSettings = {
  targetSamples: number
  bounces: number
  renderScale: number
  filterGlossyFactor: number
  tiles: { x: number; y: number }
}

export type RenderPreviewRuntimeSample = {
  completedSamples: number
  targetSamples: number
  complete: boolean
}

export interface RenderPreviewRuntime {
  readonly targetSamples: number
  readonly isSupported: boolean
  readonly unsupportedReason: string | null
  start: (scene: Scene, camera: Camera) => void
  renderSample: () => RenderPreviewRuntimeSample
  reset: (scene: Scene, camera: Camera) => void
  updateCamera: (camera: Camera) => void
  updateMaterials: () => void
  updateEnvironment: () => void
  updateLights: () => void
  dispose: () => void
}

type RenderPreviewRuntimeFactory = (options: RenderPreviewRuntimeCreateOptions) => RenderPreviewRuntime

const resolveRenderPreviewRuntimeSettings = (
  settings: Partial<RenderPreviewSettings> | undefined,
  targetSamples: number | undefined,
): RenderPreviewRuntimeSettings =>
  normalizeRenderPreviewSettings(
    settings ?? (targetSamples === undefined ? undefined : { targetSamples }),
    DEFAULT_RENDER_PREVIEW_SETTINGS,
  )

export const createRenderPreviewRuntimeSettingsKey = (
  settings: RenderPreviewRuntimeSettings,
): string =>
  [
    settings.targetSamples,
    settings.bounces,
    settings.renderScale,
    settings.noiseCleanup,
    settings.gpuLoad,
  ].join(':')

const resolveNoiseCleanupFilterGlossyFactor = (
  noiseCleanup: RenderPreviewNoiseCleanup,
): number => {
  switch (noiseCleanup) {
    case 'low':
      return 0.25
    case 'medium':
      return 0.5
    case 'high':
      return 1
    case 'off':
      return 0
  }
}

const resolveGpuLoadTiles = (gpuLoad: RenderPreviewGpuLoad): { x: number; y: number } => {
  switch (gpuLoad) {
    case 'smooth':
      return { x: 4, y: 4 }
    case 'fast':
      return { x: 1, y: 1 }
    case 'balanced':
      return { x: 2, y: 2 }
  }
}

export const resolveRenderPreviewRuntimeAdapterSettings = (
  settings: RenderPreviewRuntimeSettings,
): RenderPreviewRuntimeAdapterSettings => ({
  targetSamples: settings.targetSamples,
  bounces: settings.bounces,
  renderScale: settings.renderScale,
  filterGlossyFactor: resolveNoiseCleanupFilterGlossyFactor(settings.noiseCleanup),
  tiles: resolveGpuLoadTiles(settings.gpuLoad),
})

class UnsupportedRenderPreviewRuntime implements RenderPreviewRuntime {
  public readonly isSupported = false
  public readonly unsupportedReason: string
  public readonly targetSamples: number

  public constructor(targetSamples: number, unsupportedReason: string) {
    this.targetSamples = targetSamples
    this.unsupportedReason = unsupportedReason
  }

  public start(_scene: Scene, _camera: Camera): void {}

  public renderSample(): RenderPreviewRuntimeSample {
    return {
      completedSamples: 0,
      targetSamples: this.targetSamples,
      complete: false,
    }
  }

  public reset(_scene: Scene, _camera: Camera): void {}

  public updateCamera(_camera: Camera): void {}

  public updateMaterials(): void {}

  public updateEnvironment(): void {}

  public updateLights(): void {}

  public dispose(): void {}
}

class ThreeGpuPathTracerRuntime implements RenderPreviewRuntime {
  public readonly isSupported = true
  public readonly unsupportedReason = null
  public readonly targetSamples: number
  private readonly pathTracer: WebGLPathTracer
  private disposed = false

  public constructor(renderer: WebGLRenderer, settings: RenderPreviewRuntimeSettings) {
    const adapterSettings = resolveRenderPreviewRuntimeAdapterSettings(settings)
    this.targetSamples = adapterSettings.targetSamples
    this.pathTracer = new WebGLPathTracer(renderer)
    this.pathTracer.rasterizeScene = true
    this.pathTracer.renderToCanvas = true
    this.pathTracer.minSamples = 1
    this.pathTracer.bounces = adapterSettings.bounces
    this.pathTracer.renderScale = adapterSettings.renderScale
    this.pathTracer.filterGlossyFactor = adapterSettings.filterGlossyFactor
    this.pathTracer.tiles.set(adapterSettings.tiles.x, adapterSettings.tiles.y)
  }

  public start(scene: Scene, camera: Camera): void {
    if (this.disposed) {
      return
    }
    this.pathTracer.setScene(scene, camera)
    this.pathTracer.reset()
  }

  public renderSample(): RenderPreviewRuntimeSample {
    if (!this.disposed && this.pathTracer.samples < this.targetSamples) {
      this.pathTracer.renderSample()
    }
    const completedSamples = Math.min(this.targetSamples, Math.floor(this.pathTracer.samples))
    return {
      completedSamples,
      targetSamples: this.targetSamples,
      complete: completedSamples >= this.targetSamples,
    }
  }

  public reset(scene: Scene, camera: Camera): void {
    if (this.disposed) {
      return
    }
    this.pathTracer.setScene(scene, camera)
    this.pathTracer.reset()
  }

  public updateCamera(camera: Camera): void {
    if (this.disposed) {
      return
    }
    this.pathTracer.setCamera(camera)
    this.pathTracer.updateCamera()
    this.pathTracer.reset()
  }

  public updateMaterials(): void {
    if (this.disposed) {
      return
    }
    this.pathTracer.updateMaterials()
    this.pathTracer.reset()
  }

  public updateEnvironment(): void {
    if (this.disposed) {
      return
    }
    this.pathTracer.updateEnvironment()
    this.pathTracer.reset()
  }

  public updateLights(): void {
    if (this.disposed) {
      return
    }
    this.pathTracer.updateLights()
    this.pathTracer.reset()
  }

  public dispose(): void {
    if (this.disposed) {
      return
    }
    this.disposed = true
    this.pathTracer.dispose()
  }
}

const rendererSupportsWebGl2 = (renderer: WebGLRenderer): boolean => {
  const canvas = renderer.domElement
  if (typeof canvas.getContext !== 'function') {
    return false
  }
  return canvas.getContext('webgl2') !== null
}

const createDefaultRenderPreviewRuntime: RenderPreviewRuntimeFactory = ({
  renderer,
  settings,
  targetSamples,
}) => {
  const runtimeSettings = resolveRenderPreviewRuntimeSettings(settings, targetSamples)
  if (!rendererSupportsWebGl2(renderer)) {
    return new UnsupportedRenderPreviewRuntime(
      runtimeSettings.targetSamples,
      'WebGL2 is unavailable',
    )
  }

  try {
    return new ThreeGpuPathTracerRuntime(renderer, runtimeSettings)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'backend setup failed'
    return new UnsupportedRenderPreviewRuntime(runtimeSettings.targetSamples, message)
  }
}

let renderPreviewRuntimeFactory: RenderPreviewRuntimeFactory = createDefaultRenderPreviewRuntime

export const createRenderPreviewRuntime = (
  options: RenderPreviewRuntimeCreateOptions,
): RenderPreviewRuntime => renderPreviewRuntimeFactory(options)

export const setRenderPreviewRuntimeFactoryForTests = (
  factory: RenderPreviewRuntimeFactory | null,
): void => {
  renderPreviewRuntimeFactory = factory ?? createDefaultRenderPreviewRuntime
}
