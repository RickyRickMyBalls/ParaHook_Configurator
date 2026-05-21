import type { Camera, Scene, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js'
import type { ViewPostProcessSettings, ViewSsaoQuality } from '../shared/viewSettingsTypes'

const SSAO_KERNEL_SIZE_BY_QUALITY: Record<ViewSsaoQuality, number> = {
  low: 16,
  medium: 32,
  high: 64,
}

type SsaoRuntimeSettings = {
  kernelSize: number
  kernelRadius: number
  minDistance: number
  maxDistance: number
}

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
  const intensity = settings.ssaoIntensity
  return {
    kernelSize: SSAO_KERNEL_SIZE_BY_QUALITY[settings.ssaoQuality],
    kernelRadius: settings.ssaoRadius * 8,
    minDistance: 0.001 + intensity * 0.002,
    maxDistance: 0.025 + intensity * 0.075,
  }
}

const disposeSsaoPass = (ssaoPass: SSAOPass | null): void => {
  if (ssaoPass === null) {
    return
  }
  ;(ssaoPass as SSAOPass & { dispose: () => void }).dispose()
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
  let ssaoRuntimeSettings = resolveSsaoRuntimeSettings(postProcessing)
  const ssaoPass = new SSAOPass(
    scene,
    camera,
    512,
    512,
    ssaoRuntimeSettings.kernelSize,
  )
  ssaoPass.kernelRadius = ssaoRuntimeSettings.kernelRadius
  ssaoPass.minDistance = ssaoRuntimeSettings.minDistance
  ssaoPass.maxDistance = ssaoRuntimeSettings.maxDistance
  composer.addPass(renderPass)
  composer.addPass(ssaoPass)
  composer.addPass(outputPass)

  return {
    isAvailable: () => true,
    render: (activeCamera) => {
      renderPass.camera = activeCamera
      ssaoPass.camera = activeCamera
      composer.render()
    },
    setSize: (width, height) => {
      composer.setSize(width, height)
    },
    updateSettings: (settings) => {
      const nextSettings = resolveSsaoRuntimeSettings(settings)
      if (nextSettings.kernelSize !== ssaoRuntimeSettings.kernelSize) {
        return false
      }
      ssaoRuntimeSettings = nextSettings
      ssaoPass.kernelRadius = nextSettings.kernelRadius
      ssaoPass.minDistance = nextSettings.minDistance
      ssaoPass.maxDistance = nextSettings.maxDistance
      return true
    },
    dispose: () => {
      disposeSsaoPass(ssaoPass)
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
