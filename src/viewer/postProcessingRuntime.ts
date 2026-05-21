import { Vector2, type Camera, type Scene, type WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js'
import type {
  ViewPostProcessSettings,
  ViewSsaoQuality,
} from '../shared/viewSettingsTypes'

const SSAO_KERNEL_SIZE_BY_QUALITY: Record<ViewSsaoQuality, number> = {
  low: 16,
  medium: 32,
  high: 64,
}

type SsaoRuntimeSettings = {
  aoType: 'basicSsao'
  kernelSize: number
  kernelRadius: number
  minDistance: number
  maxDistance: number
}

type SaoRuntimeSettings = {
  aoType: 'sao'
  saoIntensity: number
  saoScale: number
  saoKernelRadius: number
  saoBlurRadius: number
  saoBlurStdDev: number
}

type AoRuntimeSettings = SsaoRuntimeSettings | SaoRuntimeSettings

export type ViewerPostProcessingRuntime = {
  isAvailable: () => boolean
  render: (camera: Camera) => void
  setSize: (width: number, height: number) => void
  updateSettings: (settings: ViewPostProcessSettings) => boolean
  dispose: () => void
}

export type ViewerPostProcessingRuntimeOptions = {
  renderer: WebGLRenderer
  scene: Scene
  camera: Camera
  postProcessing: ViewPostProcessSettings
}

type ViewerPostProcessingRuntimeFactory = (
  options: ViewerPostProcessingRuntimeOptions,
) => ViewerPostProcessingRuntime

export const resolveSsaoRuntimeSettings = (
  settings: ViewPostProcessSettings,
): SsaoRuntimeSettings => {
  return {
    aoType: 'basicSsao',
    kernelSize: SSAO_KERNEL_SIZE_BY_QUALITY[settings.ssaoQuality],
    kernelRadius: settings.ssaoRadius * 8,
    minDistance: settings.ssaoContactBias,
    maxDistance: settings.ssaoDistanceThreshold,
  }
}

export const resolveSaoRuntimeSettings = (
  settings: ViewPostProcessSettings,
): SaoRuntimeSettings => {
  const qualityIndex =
    settings.ssaoQuality === 'high' ? 2 : settings.ssaoQuality === 'medium' ? 1 : 0
  return {
    aoType: 'sao',
    saoIntensity: settings.ssaoIntensity * 0.18,
    saoScale: Math.max(0.001, settings.ssaoDistanceThreshold * 10),
    saoKernelRadius: Math.max(1, settings.ssaoRadius * 32),
    saoBlurRadius: [4, 8, 12][qualityIndex],
    saoBlurStdDev: [2, 4, 6][qualityIndex],
  }
}

const resolveAoRuntimeSettings = (settings: ViewPostProcessSettings): AoRuntimeSettings => {
  if (settings.aoType === 'sao') {
    return resolveSaoRuntimeSettings(settings)
  }
  return resolveSsaoRuntimeSettings(settings)
}

const disposePass = (pass: { dispose?: () => void } | null): void => {
  if (pass === null) {
    return
  }
  pass.dispose?.()
}

const applySaoRuntimeSettings = (
  saoPass: SAOPass,
  settings: SaoRuntimeSettings,
): void => {
  saoPass.params.saoIntensity = settings.saoIntensity
  saoPass.params.saoScale = settings.saoScale
  saoPass.params.saoKernelRadius = settings.saoKernelRadius
  saoPass.params.saoBlurRadius = settings.saoBlurRadius
  saoPass.params.saoBlurStdDev = settings.saoBlurStdDev
}

const createDefaultViewerPostProcessingRuntime: ViewerPostProcessingRuntimeFactory = ({
  renderer,
  scene,
  camera,
  postProcessing,
}) => {
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  const outputPass = new OutputPass()
  let aoRuntimeSettings = resolveAoRuntimeSettings(postProcessing)
  const aoPass =
    aoRuntimeSettings.aoType === 'sao'
      ? new SAOPass(scene, camera, new Vector2(512, 512))
      : new SSAOPass(scene, camera, 512, 512, aoRuntimeSettings.kernelSize)
  if (aoRuntimeSettings.aoType === 'sao') {
    applySaoRuntimeSettings(aoPass as SAOPass, aoRuntimeSettings)
  } else {
    const ssaoPass = aoPass as SSAOPass
    ssaoPass.kernelRadius = aoRuntimeSettings.kernelRadius
    ssaoPass.minDistance = aoRuntimeSettings.minDistance
    ssaoPass.maxDistance = aoRuntimeSettings.maxDistance
  }
  composer.addPass(renderPass)
  composer.addPass(aoPass)
  composer.addPass(outputPass)

  return {
    isAvailable: () => true,
    render: (activeCamera) => {
      renderPass.camera = activeCamera
      aoPass.camera = activeCamera
      composer.render()
    },
    setSize: (width, height) => {
      composer.setSize(width, height)
      aoPass.setSize?.(width, height)
    },
    updateSettings: (settings) => {
      const nextSettings = resolveAoRuntimeSettings(settings)
      if (nextSettings.aoType !== aoRuntimeSettings.aoType) {
        return false
      }
      if (
        nextSettings.aoType === 'basicSsao' &&
        aoRuntimeSettings.aoType === 'basicSsao'
      ) {
        const ssaoPass = aoPass as SSAOPass
        if (nextSettings.kernelSize !== aoRuntimeSettings.kernelSize) {
          return false
        }
        ssaoPass.kernelRadius = nextSettings.kernelRadius
        ssaoPass.minDistance = nextSettings.minDistance
        ssaoPass.maxDistance = nextSettings.maxDistance
      }
      if (nextSettings.aoType === 'sao') {
        applySaoRuntimeSettings(aoPass as SAOPass, nextSettings)
      }
      aoRuntimeSettings = nextSettings
      return true
    },
    dispose: () => {
      disposePass(aoPass)
      composer.dispose()
    },
  }
}

let viewerPostProcessingRuntimeFactory: ViewerPostProcessingRuntimeFactory =
  createDefaultViewerPostProcessingRuntime

export const createViewerPostProcessingRuntime = (
  options: ViewerPostProcessingRuntimeOptions,
): ViewerPostProcessingRuntime => viewerPostProcessingRuntimeFactory(options)

export const setViewerPostProcessingRuntimeFactoryForTests = (
  factory: ViewerPostProcessingRuntimeFactory | null,
): void => {
  viewerPostProcessingRuntimeFactory = factory ?? createDefaultViewerPostProcessingRuntime
}
