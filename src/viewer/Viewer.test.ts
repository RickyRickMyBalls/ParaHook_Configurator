// @vitest-environment jsdom

import {
  Box3,
  DoubleSide,
  FrontSide,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  Texture,
  Vector3,
} from 'three'
import type { Camera, Vector3 as ThreeVector3 } from 'three'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CameraClipRangeMode } from './scene/CameraController'

const cameraControllerMocks = vi.hoisted(() => ({
  instances: [] as Array<{
    activeCamera: { position: { x: number; y: number; z: number }; up: { x: number; y: number; z: number } }
    perspectiveFovDeg: number
    clipRangeMode: CameraClipRangeMode
    clipStart: number
    clipEnd: number
    beginTemporaryOrbitDrag: ReturnType<typeof vi.fn>
    updateTemporaryOrbitDrag: ReturnType<typeof vi.fn>
    endTemporaryOrbitDrag: ReturnType<typeof vi.fn>
    beginTemporaryPanDrag: ReturnType<typeof vi.fn>
    updateTemporaryPanDrag: ReturnType<typeof vi.fn>
    endTemporaryPanDrag: ReturnType<typeof vi.fn>
    beginFlyMode: ReturnType<typeof vi.fn>
    endFlyMode: ReturnType<typeof vi.fn>
    applyFlyLookDelta: ReturnType<typeof vi.fn>
    applyFlyLookDeltaUpright: ReturnType<typeof vi.fn>
    applyFlyRollDelta: ReturnType<typeof vi.fn>
    restoreFlyUpright: ReturnType<typeof vi.fn>
    setPreset: ReturnType<typeof vi.fn>
    animateToDirection: ReturnType<typeof vi.fn>
    snapToDirection: ReturnType<typeof vi.fn>
    translateFly: ReturnType<typeof vi.fn>
    zoomByWheelDelta: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    setPerspectiveFovDeg: ReturnType<typeof vi.fn>
    setCameraClipRange: ReturnType<typeof vi.fn>
    resetCameraClipRange: ReturnType<typeof vi.fn>
    frameObject: ReturnType<typeof vi.fn>
    frameBox: ReturnType<typeof vi.fn>
  }>,
}))

const axisGizmoMocks = vi.hoisted(() => ({
  instances: [] as Array<{
    onTargetSelected: ((target: { kind: 'axis' | 'corner' | 'edge'; direction: readonly [number, number, number] }) => void) | null
    onOrbitDragStart: ((clientX: number, clientY: number) => void) | null
    onOrbitDragMove: ((clientX: number, clientY: number) => void) | null
    onOrbitDragEnd: (() => void) | null
    beginPointerInteraction: ReturnType<typeof vi.fn>
    updatePointerInteraction: ReturnType<typeof vi.fn>
    endPointerInteraction: ReturnType<typeof vi.fn>
    cancelPointerInteraction: ReturnType<typeof vi.fn>
    updatePointerHover: ReturnType<typeof vi.fn>
    clearPointerHover: ReturnType<typeof vi.fn>
    setOnTargetSelected: ReturnType<typeof vi.fn>
    setOnOrbitDragStart: ReturnType<typeof vi.fn>
    setOnOrbitDragMove: ReturnType<typeof vi.fn>
    setOnOrbitDragEnd: ReturnType<typeof vi.fn>
    setStyle: ReturnType<typeof vi.fn>
    renderFromCameraQuaternion: ReturnType<typeof vi.fn>
    dispose: ReturnType<typeof vi.fn>
  }>,
}))

const postProcessingExampleMocks = vi.hoisted(() => ({
  composers: [] as Array<{
    passes: unknown[]
    addPass: ReturnType<typeof vi.fn>
    render: ReturnType<typeof vi.fn>
    setSize: ReturnType<typeof vi.fn>
    dispose: ReturnType<typeof vi.fn>
  }>,
  renderPasses: [] as Array<{
    scene: unknown
    camera: unknown
  }>,
  outputPasses: [] as Array<{
    isOutputPass: boolean
  }>,
  ssaoPasses: [] as Array<{
    scene: unknown
    camera: unknown
    width: number
    height: number
    kernelSize: number
    kernelRadius: number
    minDistance: number
    maxDistance: number
    setSize: ReturnType<typeof vi.fn>
    dispose: ReturnType<typeof vi.fn>
  }>,
  saoPasses: [] as Array<{
    scene: unknown
    camera: unknown
    resolution: unknown
    params: {
      output: number
      saoBias: number
      saoIntensity: number
      saoScale: number
      saoKernelRadius: number
      saoMinResolution: number
      saoBlur: boolean
      saoBlurRadius: number
      saoBlurStdDev: number
      saoBlurDepthCutoff: number
    }
    setSize: ReturnType<typeof vi.fn>
    dispose: ReturnType<typeof vi.fn>
  }>,
}))

vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three')

  class MockWebGLRenderer {
    public readonly domElement = document.createElement('canvas')
    public readonly shadowMap = {
      enabled: false,
      type: null as unknown,
    }
    public toneMapping = actual.NoToneMapping
    public toneMappingExposure = 1

    public constructor() {}

    public setPixelRatio(): void {}

    public setSize(): void {}

    public render(): void {}

    public dispose(): void {}
  }

  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  }
})

vi.mock('three/examples/jsm/postprocessing/EffectComposer.js', () => {
  class MockEffectComposer {
    public readonly passes: unknown[] = []
    public readonly addPass = vi.fn((pass: unknown) => {
      this.passes.push(pass)
    })
    public readonly render = vi.fn()
    public readonly setSize = vi.fn()
    public readonly dispose = vi.fn()

    public constructor() {
      postProcessingExampleMocks.composers.push(this)
    }
  }

  return {
    EffectComposer: MockEffectComposer,
  }
})

vi.mock('three/examples/jsm/postprocessing/RenderPass.js', () => {
  class MockRenderPass {
    public scene: unknown
    public camera: unknown

    public constructor(scene: unknown, camera: unknown) {
      this.scene = scene
      this.camera = camera
      postProcessingExampleMocks.renderPasses.push(this)
    }
  }

  return {
    RenderPass: MockRenderPass,
  }
})

vi.mock('three/examples/jsm/postprocessing/OutputPass.js', () => {
  class MockOutputPass {
    public readonly isOutputPass = true

    public constructor() {
      postProcessingExampleMocks.outputPasses.push(this)
    }
  }

  return {
    OutputPass: MockOutputPass,
  }
})

vi.mock('three/examples/jsm/postprocessing/SSAOPass.js', () => {
  class MockSSAOPass {
    public static OUTPUT = {
      Default: 0,
    }
    public kernelRadius = 8
    public minDistance = 0.005
    public maxDistance = 0.1
    public readonly setSize = vi.fn()
    public readonly dispose = vi.fn()
    public scene: unknown
    public camera: unknown
    public width: number
    public height: number
    public kernelSize: number

    public constructor(
      scene: unknown,
      camera: unknown,
      width = 512,
      height = 512,
      kernelSize = 32,
    ) {
      this.scene = scene
      this.camera = camera
      this.width = width
      this.height = height
      this.kernelSize = kernelSize
      postProcessingExampleMocks.ssaoPasses.push(this)
    }
  }

  return {
    SSAOPass: MockSSAOPass,
  }
})

vi.mock('three/examples/jsm/postprocessing/SAOPass.js', () => {
  class MockSAOPass {
    public static OUTPUT = {
      Default: 0,
      SAO: 1,
      Normal: 2,
    }
    public readonly params = {
      output: 0,
      saoBias: 0.5,
      saoIntensity: 0.18,
      saoScale: 1,
      saoKernelRadius: 100,
      saoMinResolution: 0,
      saoBlur: true,
      saoBlurRadius: 8,
      saoBlurStdDev: 4,
      saoBlurDepthCutoff: 0.01,
    }
    public readonly setSize = vi.fn()
    public readonly dispose = vi.fn()
    public scene: unknown
    public camera: unknown
    public resolution: unknown

    public constructor(scene: unknown, camera: unknown, resolution: unknown) {
      this.scene = scene
      this.camera = camera
      this.resolution = resolution
      postProcessingExampleMocks.saoPasses.push(this)
    }
  }

  return {
    SAOPass: MockSAOPass,
  }
})

vi.mock('three-gpu-pathtracer', () => {
  class MockWebGLPathTracer {
    public readonly tiles = {
      set: vi.fn(),
    }
    public samples = 0
    public rasterizeScene = true
    public renderToCanvas = true
    public minSamples = 1
    public constructor() {}
    public setScene(): void {
      this.samples = 0
    }
    public setCamera(): void {}
    public updateCamera(): void {}
    public updateMaterials(): void {}
    public updateEnvironment(): void {}
    public updateLights(): void {}
    public renderSample(): void {
      this.samples += 1
    }
    public reset(): void {
      this.samples = 0
    }
    public dispose(): void {}
  }

  return {
    WebGLPathTracer: MockWebGLPathTracer,
  }
})

vi.mock('./overlay/AxisGizmo', () => {
  class MockAxisGizmo {
    public onTargetSelected:
      | ((target: { kind: 'axis' | 'corner' | 'edge'; direction: readonly [number, number, number] }) => void)
      | null = null
    public onOrbitDragStart: ((clientX: number, clientY: number) => void) | null = null
    public onOrbitDragMove: ((clientX: number, clientY: number) => void) | null = null
    public onOrbitDragEnd: (() => void) | null = null
    public readonly beginPointerInteraction = vi.fn()
    public readonly updatePointerInteraction = vi.fn()
    public readonly endPointerInteraction = vi.fn()
    public readonly cancelPointerInteraction = vi.fn()
    public readonly updatePointerHover = vi.fn()
    public readonly clearPointerHover = vi.fn()
    public readonly setOnTargetSelected = vi.fn(
      (
        handler:
          | ((target: { kind: 'axis' | 'corner' | 'edge'; direction: readonly [number, number, number] }) => void)
          | null,
      ) => {
        this.onTargetSelected = handler
      },
    )
    public readonly setOnOrbitDragStart = vi.fn((handler: ((clientX: number, clientY: number) => void) | null) => {
      this.onOrbitDragStart = handler
    })
    public readonly setOnOrbitDragMove = vi.fn((handler: ((clientX: number, clientY: number) => void) | null) => {
      this.onOrbitDragMove = handler
    })
    public readonly setOnOrbitDragEnd = vi.fn((handler: (() => void) | null) => {
      this.onOrbitDragEnd = handler
    })
    public readonly setStyle = vi.fn()
    public readonly renderFromCameraQuaternion = vi.fn()
    public readonly dispose = vi.fn()

    public constructor() {
      axisGizmoMocks.instances.push(this as unknown as (typeof axisGizmoMocks.instances)[number])
    }
  }

  return {
    AxisGizmo: MockAxisGizmo,
  }
})

vi.mock('./scene/CameraController', async () => {
  const { Vector3 } = await vi.importActual<typeof import('three')>('three')

  class MockCameraController {
    private readonly activeCamera: {
      position: ThreeVector3
      up: ThreeVector3
    }

    private readonly controls = {
      target: new Vector3(),
    }

    public readonly applyFlyLookDelta = vi.fn()
    public readonly applyFlyLookDeltaUpright = vi.fn()
    public readonly applyFlyRollDelta = vi.fn()
    public readonly restoreFlyUpright = vi.fn()
    public readonly beginTemporaryOrbitDrag = vi.fn()
    public readonly updateTemporaryOrbitDrag = vi.fn()
    public readonly endTemporaryOrbitDrag = vi.fn()
    public readonly beginTemporaryPanDrag = vi.fn()
    public readonly updateTemporaryPanDrag = vi.fn()
    public readonly endTemporaryPanDrag = vi.fn()
    public readonly beginFlyMode = vi.fn()
    public readonly endFlyMode = vi.fn()
    public readonly translateFly = vi.fn()
    public readonly zoomByWheelDelta = vi.fn()
    public readonly update = vi.fn()
    public readonly setPreset = vi.fn()
    public readonly animateToDirection = vi.fn()
    public readonly snapToDirection = vi.fn()
    public perspectiveFovDeg = 45
    public clipRangeMode: CameraClipRangeMode = 'auto'
    public clipStart = 0.1
    public clipEnd = 1000
    public readonly setPerspectiveFovDeg = vi.fn((fovDeg: number) => {
      this.perspectiveFovDeg = fovDeg
    })
    public readonly setCameraClipRange = vi.fn((range: { clipStart?: number; clipEnd?: number }) => {
      this.clipRangeMode = 'authored'
      this.clipStart = range.clipStart ?? this.clipStart
      this.clipEnd = range.clipEnd ?? this.clipEnd
    })
    public readonly resetCameraClipRange = vi.fn(() => {
      this.clipRangeMode = 'auto'
      this.clipStart = 0.1
      this.clipEnd = 1000
    })
    public readonly frameObject = vi.fn()
    public readonly frameBox = vi.fn()

    public constructor(
      perspectiveCamera: { position: ThreeVector3; up: ThreeVector3 },
    ) {
      this.activeCamera = perspectiveCamera
      cameraControllerMocks.instances.push(this as unknown as (typeof cameraControllerMocks.instances)[number])
    }

    public getActiveCamera() {
      return this.activeCamera
    }

    public getControls() {
      return this.controls
    }

    public setProjectionMode(): void {}
    public animateToPose(): void {}
    public applyPose(pose: {
      perspectiveFovDeg: number
      clipRangeMode: CameraClipRangeMode
      clipStart: number
      clipEnd: number
    }): void {
      this.perspectiveFovDeg = pose.perspectiveFovDeg
      this.clipRangeMode = pose.clipRangeMode
      this.clipStart = pose.clipStart
      this.clipEnd = pose.clipEnd
    }
    public setEnabled(): void {}
    public setLeftButtonOrbitEnabled(): void {}
    public setViewportSize(): void {}
    public frameWindowClientRect(): boolean {
      return false
    }

    public getPose() {
      return {
        position: new Vector3(),
        target: new Vector3(),
        up: new Vector3(0, 1, 0),
        projectionMode: 'perspective' as const,
        perspectiveFovDeg: this.perspectiveFovDeg,
        orthoViewHeight: 4,
        clipRangeMode: this.clipRangeMode,
        clipStart: this.clipStart,
        clipEnd: this.clipEnd,
      }
    }

    public getPerspectiveFovDeg(): number {
      return this.perspectiveFovDeg
    }

    public getCameraClipRange() {
      return {
        mode: this.clipRangeMode,
        clipStart: this.clipStart,
        clipEnd: this.clipEnd,
      }
    }

    public trackObject(): null {
      return null
    }

    public trackScaledObject(): null {
      return null
    }
  }

  return {
    CameraController: MockCameraController,
  }
})

vi.mock('./gizmo/TransformGizmo', async () => {
  const { Group } = await vi.importActual<typeof import('three')>('three')

  class MockTransformGizmo {
    private readonly helper = new Group()

    public constructor() {}

    public setOnObjectChange(): void {}
    public setOnDragComplete(): void {}
    public setOnDraggingChange(): void {}
    public setOnHandleChange(): void {}
    public setMode(): void {}
    public setSpace(): void {}
    public setCamera(): void {}
    public setEnabled(): void {}
    public setSize(): void {}
    public setSnap(): void {}
    public completeActiveDrag(): void {}
    public cancelActiveDrag(): void {}
    public clearActiveHandle(): void {}
    public activateHandle(): void {}
    public attach(): void {}
    public detach(): void {}
    public dispose(): void {}

    public isDragging(): boolean {
      return false
    }

    public beginTranslateCenterHandleDragFromGizmoCenter(): boolean {
      return false
    }

    public beginHandleDrag(): boolean {
      return false
    }

    public getHelper() {
      return this.helper
    }
  }

  return {
    TransformGizmo: MockTransformGizmo,
  }
})

vi.mock('./sketch/SketchPlanePickHelper', async () => {
  const { Group } = await vi.importActual<typeof import('three')>('three')

  class MockSketchPlanePickHelper {
    private readonly group = new Group()
    private readonly previewPivot = new Group()

    public constructor() {
      this.group.add(this.previewPivot)
    }

    public getGroup() {
      return this.group
    }

    public getPreviewPivot() {
      return this.previewPivot
    }

    public setOverlay(): void {}
    public setHoveredPlane(): void {}
    public dispose(): void {}
    public pickPlane(): null {
      return null
    }
    public readDraftTransform() {
      return {
        offsetMm: 0,
        translation: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      }
    }
  }

  return {
    SketchPlanePickHelper: MockSketchPlanePickHelper,
  }
})

vi.mock('./GeometrySketchDrawHelper', async () => {
  const { Group } = await vi.importActual<typeof import('three')>('three')

  class MockGeometrySketchDrawHelper {
    private readonly group = new Group()

    public getGroup() {
      return this.group
    }

    public setOverlay(): void {}
    public dispose(): void {}
    public projectPointerToSketch(): null {
      return null
    }
  }

  return {
    GeometrySketchDrawHelper: MockGeometrySketchDrawHelper,
  }
})

vi.mock('./ReferenceTransformHistoryHelper', async () => {
  const { Group } = await vi.importActual<typeof import('three')>('three')

  class MockReferenceTransformHistoryHelper {
    private readonly group = new Group()

    public getGroup() {
      return this.group
    }

    public setOverlay(): void {}
    public dispose(): void {}
  }

  return {
    ReferenceTransformHistoryHelper: MockReferenceTransformHistoryHelper,
  }
})

vi.mock('./ReferenceTransformMoveSnapHelper', async () => {
  const { Group } = await vi.importActual<typeof import('three')>('three')

  class MockReferenceTransformMoveSnapHelper {
    private readonly group = new Group()

    public getGroup() {
      return this.group
    }

    public setDotScaleMultiplier(): void {}
    public setEnabled(): void {}
    public setDotDelayMs(): void {}
    public setDotNearScale(): void {}
    public setDotFarScale(): void {}
    public setDotVisibleRadiusMultiplier(): void {}
    public setOverlay(): void {}
    public tick(): void {}
    public dispose(): void {}
  }

  return {
    ReferenceTransformMoveSnapHelper: MockReferenceTransformMoveSnapHelper,
    isReferenceTransformMoveSnapHandle: () => false,
  }
})

vi.mock('./ReferenceTransformRotateSnapHelper', async () => {
  const { Group } = await vi.importActual<typeof import('three')>('three')

  class MockReferenceTransformRotateSnapHelper {
    private readonly group = new Group()

    public getGroup() {
      return this.group
    }

    public setEnabled(): void {}
    public setLineSize(): void {}
    public setLineThickness(): void {}
    public setPreviewRadiusDeg(): void {}
    public setDelayMs(): void {}
    public setOverlay(): void {}
    public tick(): void {}
    public dispose(): void {}
  }

  return {
    ReferenceTransformRotateSnapHelper: MockReferenceTransformRotateSnapHelper,
  }
})

const createArtifact = (partKeyStr: string, length: number) => ({
  id: `artifact:${partKeyStr}:${length}`,
  kind: 'box' as const,
  label: `${partKeyStr}:${length}`,
  partKeyStr,
  partKey: { id: partKeyStr, instance: null },
  params: { width: 10, length, height: 5 },
})

const createTwoTriangleMeshArtifact = (partKeyStr: string) => ({
  id: `artifact:${partKeyStr}:mesh`,
  kind: 'mesh' as const,
  label: partKeyStr,
  partKeyStr,
  partKey: { id: partKeyStr, instance: null },
  mesh: {
    vertices: [
      0, 0, 0,
      1, 0, 0,
      1, 1, 0,
      0, 1, 0,
    ],
    indices: [
      0, 1, 2,
      0, 2, 3,
    ],
  },
})

const createCylinderLikeMeshArtifact = (partKeyStr: string, segments = 16) => {
  const vertices: number[] = []
  const indices: number[] = []
  const topCenterIndex = 0
  const bottomCenterIndex = 1
  vertices.push(0, 0.5, 0, 0, -0.5, 0)

  const topRingStart = vertices.length / 3
  for (let index = 0; index < segments; index += 1) {
    const angle = (Math.PI * 2 * index) / segments
    vertices.push(Math.cos(angle), 0.5, Math.sin(angle))
  }
  const bottomRingStart = vertices.length / 3
  for (let index = 0; index < segments; index += 1) {
    const angle = (Math.PI * 2 * index) / segments
    vertices.push(Math.cos(angle), -0.5, Math.sin(angle))
  }

  for (let index = 0; index < segments; index += 1) {
    const nextIndex = (index + 1) % segments
    const topA = topRingStart + index
    const topB = topRingStart + nextIndex
    const bottomA = bottomRingStart + index
    const bottomB = bottomRingStart + nextIndex
    indices.push(topA, bottomA, bottomB, topA, bottomB, topB)
    indices.push(topCenterIndex, topB, topA)
    indices.push(bottomCenterIndex, bottomA, bottomB)
  }

  return {
    id: `artifact:${partKeyStr}:cylinder-mesh`,
    kind: 'mesh' as const,
    label: partKeyStr,
    partKeyStr,
    partKey: { id: partKeyStr, instance: null },
    mesh: {
      vertices,
      indices,
    },
  }
}

describe('Viewer baseline replacement', () => {
  let container: HTMLDivElement | null = null
  let viewer: { dispose: () => void } | null = null
  let resizeObserverCallback: ResizeObserverCallback | null = null
  let pointerLockElement: Element | null = null

  beforeEach(() => {
    cameraControllerMocks.instances.length = 0
    axisGizmoMocks.instances.length = 0
    postProcessingExampleMocks.composers.length = 0
    postProcessingExampleMocks.renderPasses.length = 0
    postProcessingExampleMocks.outputPasses.length = 0
    postProcessingExampleMocks.ssaoPasses.length = 0
    postProcessingExampleMocks.saoPasses.length = 0
    pointerLockElement = null
    class MockResizeObserver {
      public constructor(callback: ResizeObserverCallback) {
        resizeObserverCallback = callback
      }

      public observe(): void {}
      public disconnect(): void {}
      public unobserve(): void {}
    }

    vi.stubGlobal('ResizeObserver', MockResizeObserver)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    Object.defineProperty(document, 'pointerLockElement', {
      configurable: true,
      get: () => pointerLockElement,
    })
    Object.defineProperty(document, 'exitPointerLock', {
      configurable: true,
      value: vi.fn(() => {
        pointerLockElement = null
      }),
    })
  })

  afterEach(async () => {
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')
    const { setViewerPostProcessingRuntimeFactoryForTests } = await import('./postProcessingRuntime')
    setRenderPreviewRuntimeFactoryForTests(null)
    setViewerPostProcessingRuntimeFactoryForTests(null)
    viewer?.dispose()
    container?.remove()
    viewer = null
    container = null
    resizeObserverCallback = null
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('replaces old baseline meshes instead of stacking them across repeated render-layer updates', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const renderLayers = (length: number) => {
      ;(viewer as unknown as {
        setViewportRenderLayers: (
          layers: {
            baseParts: unknown[]
            baselineParts: unknown[]
            overlayParts: unknown[]
            overlayOpacity: number
            baselineStyle: { opacity: number; color: string }
          },
          visibility: Record<string, boolean>,
          selectedPartKey?: string | null,
        ) => void
      }).setViewportRenderLayers(
        {
          baseParts: [],
          baselineParts: [
            toViewerRenderablePart(createArtifact('output-entry:slot-extrude:node-extrude-1', length)),
          ],
          overlayParts: [],
          baselineStyle: {
            opacity: 0.5,
            color: '#5f83d6',
          },
          overlayOpacity: 0.5,
        },
        {},
        null,
      )
    }

    renderLayers(10)
    renderLayers(20)
    renderLayers(30)

    const rootGroup = (viewer as unknown as {
      rootGroup: {
        traverse: (callback: (object: { name: string }) => void) => void
      }
    }).rootGroup

    const baselineMeshNames: string[] = []
    rootGroup.traverse((object) => {
      if (object.name.endsWith(':baseline')) {
        baselineMeshNames.push(object.name)
      }
    })

    expect(baselineMeshNames).toHaveLength(1)
  })

  it('loads exploded imported references as isolated single-part objects and stores no child part descriptors', async () => {
    const { BoxGeometry, Group, Mesh, MeshStandardMaterial } = await import('three')
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const rawObject = new Group()
    rawObject.name = 'Wrapper Root'

    const upperMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    upperMesh.name = 'Upper'
    const soleGroup = new Group()
    soleGroup.name = 'Sole Group'
    const soleMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    soleMesh.name = 'Sole'
    soleGroup.add(soleMesh)
    rawObject.add(upperMesh)
    rawObject.add(soleGroup)

    const loadReferenceAssetObject = vi.fn(async () => rawObject)
    ;(viewer as unknown as { loadReferenceAssetObject: typeof loadReferenceAssetObject }).loadReferenceAssetObject =
      loadReferenceAssetObject

    await (viewer as unknown as {
      ensureReferenceLoaded: (reference: {
        referenceId: string
        assetPath: string
        fileType: 'glb'
        explodedFromReferenceId: string
        sourcePartKey: string
        sourceMeshIndex: number
      }) => Promise<void>
    }).ensureReferenceLoaded({
      referenceId: 'exploded-child',
      assetPath: 'blob:wrapper',
      fileType: 'glb',
      explodedFromReferenceId: 'wrapper-reference',
      sourcePartKey: 'reference-part:wrapper-reference:1',
      sourceMeshIndex: 1,
    })

    expect(loadReferenceAssetObject).toHaveBeenCalledTimes(1)
    expect((viewer as unknown as { getReferencePartDescriptors: (referenceId: string) => unknown[] }).getReferencePartDescriptors('exploded-child')).toEqual([])

    const loadedPivot = (viewer as unknown as {
      referenceObjects: Map<string, { traverse: (callback: (object: { name: string }) => void) => void }>
    }).referenceObjects.get('exploded-child')
    expect(loadedPivot).toBeDefined()

    const meshNames: string[] = []
    loadedPivot?.traverse((object) => {
      if (object.name.length > 0) {
        meshNames.push(object.name)
      }
    })

    expect(meshNames).toContain('Sole')
    expect(meshNames).not.toContain('Upper')
  })

  it('hands off exploded children from a live wrapper without reloading the source asset', async () => {
    const { BoxGeometry, Group, Mesh, MeshStandardMaterial } = await import('three')
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const rawObject = new Group()
    rawObject.name = 'Wrapper Root'
    const upperMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    upperMesh.name = 'Upper'
    const soleGroup = new Group()
    soleGroup.name = 'Sole Group'
    const soleMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    soleMesh.name = 'Sole'
    soleGroup.add(soleMesh)
    rawObject.add(upperMesh)
    rawObject.add(soleGroup)

    const loadReferenceAssetObject = vi.fn(async () => rawObject)
    ;(viewer as unknown as { loadReferenceAssetObject: typeof loadReferenceAssetObject }).loadReferenceAssetObject =
      loadReferenceAssetObject

    await (viewer as unknown as {
      ensureReferenceLoaded: (reference: {
        referenceId: string
        assetPath: string
        fileType: 'glb'
      }) => Promise<void>
    }).ensureReferenceLoaded({
      referenceId: 'wrapper-reference',
      assetPath: 'blob:wrapper',
      fileType: 'glb',
    })
    ;(viewer as unknown as { setReferenceVisible: (referenceId: string, visible: boolean) => void }).setReferenceVisible(
      'wrapper-reference',
      true,
    )

    const handedOffReferenceIds = (
      viewer as unknown as {
        handoffExplodedReferenceChildren: (
          wrapperReferenceId: string,
          children: Array<{
            referenceId: string
            assetPath: string
            fileType: 'glb'
            explodedFromReferenceId: string
            sourcePartKey: string
            sourceMeshIndex: number
          }>,
          visible: boolean,
        ) => string[]
      }
    ).handoffExplodedReferenceChildren(
      'wrapper-reference',
      [
        {
          referenceId: 'exploded-upper',
          assetPath: 'blob:wrapper',
          fileType: 'glb',
          explodedFromReferenceId: 'wrapper-reference',
          sourcePartKey: 'reference-part:wrapper-reference:0',
          sourceMeshIndex: 0,
        },
        {
          referenceId: 'exploded-sole',
          assetPath: 'blob:wrapper',
          fileType: 'glb',
          explodedFromReferenceId: 'wrapper-reference',
          sourcePartKey: 'reference-part:wrapper-reference:1',
          sourceMeshIndex: 1,
        },
      ],
      true,
    )

    expect(handedOffReferenceIds).toEqual(['exploded-upper', 'exploded-sole'])
    expect(loadReferenceAssetObject).toHaveBeenCalledTimes(1)
    expect(
      (viewer as unknown as { getReferencePartDescriptors: (referenceId: string) => unknown[] }).getReferencePartDescriptors(
        'exploded-upper',
      ),
    ).toEqual([])
    expect(
      (viewer as unknown as { getReferencePartDescriptors: (referenceId: string) => unknown[] }).getReferencePartDescriptors(
        'exploded-sole',
      ),
    ).toEqual([])

    const upperObject = (viewer as unknown as {
      referenceObjects: Map<string, { visible: boolean; traverse: (callback: (object: { name: string }) => void) => void }>
    }).referenceObjects.get('exploded-upper')
    const soleObject = (viewer as unknown as {
      referenceObjects: Map<string, { visible: boolean; traverse: (callback: (object: { name: string }) => void) => void }>
    }).referenceObjects.get('exploded-sole')
    expect(upperObject?.visible).toBe(true)
    expect(soleObject?.visible).toBe(true)

    const upperNames: string[] = []
    upperObject?.traverse((object) => {
      if (object.name.length > 0) {
        upperNames.push(object.name)
      }
    })
    expect(upperNames).toContain('Upper')
    expect(upperNames).not.toContain('Sole')

    const soleNames: string[] = []
    soleObject?.traverse((object) => {
      if (object.name.length > 0) {
        soleNames.push(object.name)
      }
    })
    expect(soleNames).toContain('Sole')
    expect(soleNames).not.toContain('Upper')
  })

  it('hands off direct split children from one loaded group source and keeps the shared asset load to one parse across siblings', async () => {
    const { BoxGeometry, Group, Mesh, MeshStandardMaterial } = await import('three')
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const rawObject = new Group()
    rawObject.name = 'Shared Root'
    const upperMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    upperMesh.name = 'Upper'
    const soleGroup = new Group()
    soleGroup.name = 'Sole Group'
    const soleMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    soleMesh.name = 'Sole'
    soleGroup.add(soleMesh)
    rawObject.add(upperMesh)
    rawObject.add(soleGroup)

    const loadReferenceAssetObject = vi.fn(async () => rawObject)
    ;(viewer as unknown as { loadReferenceAssetObject: typeof loadReferenceAssetObject }).loadReferenceAssetObject =
      loadReferenceAssetObject

    await (viewer as unknown as {
      ensureReferenceLoaded: (reference: {
        referenceId: string
        assetPath: string
        fileType: 'glb'
        directPartSourceKind: 'split-import-child'
        directPartSourceGroupId: string
        sourcePartKey: string
        sourceMeshIndex: number
      }) => Promise<void>
    }).ensureReferenceLoaded({
      referenceId: 'split-child-a',
      assetPath: 'blob:shared-glb',
      fileType: 'glb',
      directPartSourceKind: 'split-import-child',
      directPartSourceGroupId: 'direct-part-source-group:1',
      sourcePartKey: 'reference-part:shared:0',
      sourceMeshIndex: 0,
    })
    ;(viewer as unknown as { setReferenceVisible: (referenceId: string, visible: boolean) => void }).setReferenceVisible(
      'split-child-a',
      true,
    )

    const handedOffReferenceIds = (
      viewer as unknown as {
        handoffDirectPartBackedReferenceChildren: (
          directPartSourceGroupId: string,
          children: Array<{
            referenceId: string
            assetPath: string
            fileType: 'glb'
            directPartSourceKind: 'split-import-child'
            directPartSourceGroupId: string
            sourcePartKey: string
            sourceMeshIndex: number
          }>,
          visible: boolean,
        ) => string[]
      }
    ).handoffDirectPartBackedReferenceChildren(
      'direct-part-source-group:1',
      [
        {
          referenceId: 'split-child-b',
          assetPath: 'blob:shared-glb',
          fileType: 'glb',
          directPartSourceKind: 'split-import-child',
          directPartSourceGroupId: 'direct-part-source-group:1',
          sourcePartKey: 'reference-part:shared:1',
          sourceMeshIndex: 1,
        },
        {
          referenceId: 'split-child-c',
          assetPath: 'blob:shared-glb',
          fileType: 'glb',
          directPartSourceKind: 'split-import-child',
          directPartSourceGroupId: 'direct-part-source-group:1',
          sourcePartKey: 'reference-part:shared:0',
          sourceMeshIndex: 0,
        },
      ],
      true,
    )

    expect(handedOffReferenceIds).toEqual(['split-child-b', 'split-child-c'])
    expect(loadReferenceAssetObject).toHaveBeenCalledTimes(1)
    expect(
      (viewer as unknown as { getReferencePartDescriptors: (referenceId: string) => unknown[] }).getReferencePartDescriptors(
        'split-child-b',
      ),
    ).toEqual([])
    expect(
      (viewer as unknown as { getReferencePartDescriptors: (referenceId: string) => unknown[] }).getReferencePartDescriptors(
        'split-child-c',
      ),
    ).toEqual([])

    const splitChildBObject = (viewer as unknown as {
      referenceObjects: Map<string, { visible: boolean; traverse: (callback: (object: { name: string }) => void) => void }>
    }).referenceObjects.get('split-child-b')
    const splitChildCObject = (viewer as unknown as {
      referenceObjects: Map<string, { visible: boolean; traverse: (callback: (object: { name: string }) => void) => void }>
    }).referenceObjects.get('split-child-c')
    expect(splitChildBObject?.visible).toBe(true)
    expect(splitChildCObject?.visible).toBe(true)
    expect(splitChildBObject).toBeDefined()
    expect(splitChildCObject).toBeDefined()
    expect(splitChildBObject).not.toBe(splitChildCObject)

    const splitChildBNames: string[] = []
    splitChildBObject?.traverse((object) => {
      if (object.name.length > 0) {
        splitChildBNames.push(object.name)
      }
    })
    expect(splitChildBNames).toContain('Sole')
    expect(splitChildBNames).not.toContain('Upper')

    const splitChildCNames: string[] = []
    splitChildCObject?.traverse((object) => {
      if (object.name.length > 0) {
        splitChildCNames.push(object.name)
      }
    })
    expect(splitChildCNames).toContain('Upper')
    expect(splitChildCNames).not.toContain('Sole')
  })

  it('fails exploded reference loads when the stored source mesh index cannot be resolved', async () => {
    const { BoxGeometry, Group, Mesh, MeshStandardMaterial } = await import('three')
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const rawObject = new Group()
    const onlyMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    onlyMesh.name = 'Only Mesh'
    rawObject.add(onlyMesh)

    const loadReferenceAssetObject = vi.fn(async () => rawObject)
    ;(viewer as unknown as { loadReferenceAssetObject: typeof loadReferenceAssetObject }).loadReferenceAssetObject =
      loadReferenceAssetObject

    await expect(
      (viewer as unknown as {
        ensureReferenceLoaded: (reference: {
          referenceId: string
          assetPath: string
          fileType: 'glb'
          explodedFromReferenceId: string
          sourcePartKey: string
          sourceMeshIndex: number
        }) => Promise<void>
      }).ensureReferenceLoaded({
        referenceId: 'exploded-child',
        assetPath: 'blob:wrapper',
        fileType: 'glb',
        explodedFromReferenceId: 'wrapper-reference',
        sourcePartKey: 'reference-part:wrapper-reference:3',
        sourceMeshIndex: 3,
      }),
    ).rejects.toThrow('Could not resolve exploded source mesh 3.')
  })

  it('loads direct part-backed child references without exploded provenance through the split-import load contract', async () => {
    const { BoxGeometry, Group, Mesh, MeshStandardMaterial } = await import('three')
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const rawObject = new Group()
    rawObject.name = 'Shared Root'
    const upperMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    upperMesh.name = 'Upper'
    const soleGroup = new Group()
    soleGroup.name = 'Sole Group'
    const soleMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
    soleMesh.name = 'Sole'
    soleGroup.add(soleMesh)
    rawObject.add(upperMesh)
    rawObject.add(soleGroup)

    const loadReferenceAssetObject = vi.fn(async () => rawObject)
    ;(viewer as unknown as { loadReferenceAssetObject: typeof loadReferenceAssetObject }).loadReferenceAssetObject =
      loadReferenceAssetObject

    await (viewer as unknown as {
      ensureReferenceLoaded: (reference: {
        referenceId: string
        assetPath: string
        fileType: 'glb'
        directPartSourceKind: 'split-import-child'
        sourcePartKey: string
        sourceMeshIndex: number
      }) => Promise<void>
    }).ensureReferenceLoaded({
      referenceId: 'split-child',
      assetPath: 'blob:shared-glb',
      fileType: 'glb',
      directPartSourceKind: 'split-import-child',
      sourcePartKey: 'reference-part:shared:1',
      sourceMeshIndex: 1,
    })

    expect(loadReferenceAssetObject).toHaveBeenCalledTimes(1)
    expect(
      (viewer as unknown as { getReferencePartDescriptors: (referenceId: string) => unknown[] }).getReferencePartDescriptors(
        'split-child',
      ),
    ).toEqual([])

    const loadedPivot = (viewer as unknown as {
      referenceObjects: Map<string, { traverse: (callback: (object: { name: string }) => void) => void }>
    }).referenceObjects.get('split-child')
    expect(loadedPivot).toBeDefined()

    const meshNames: string[] = []
    loadedPivot?.traverse((object) => {
      if (object.name.length > 0) {
        meshNames.push(object.name)
      }
    })

    expect(meshNames).toContain('Sole')
    expect(meshNames).not.toContain('Upper')
  })

  it('still rejects part-backed child fields without direct or exploded provenance', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const loadReferenceAssetObject = vi.fn(async () => {
      throw new Error('should not attempt asset load for invalid provenance')
    })
    ;(viewer as unknown as { loadReferenceAssetObject: typeof loadReferenceAssetObject }).loadReferenceAssetObject =
      loadReferenceAssetObject

    await expect(
      (viewer as unknown as {
        ensureReferenceLoaded: (reference: {
          referenceId: string
          assetPath: string
          fileType: 'glb'
          sourcePartKey: string
          sourceMeshIndex: number
        }) => Promise<void>
      }).ensureReferenceLoaded({
        referenceId: 'split-child',
        assetPath: 'blob:shared-glb',
        fileType: 'glb',
        sourcePartKey: 'reference-part:shared:0',
        sourceMeshIndex: 0,
      }),
    ).rejects.toThrow('Exploded reference "split-child" is missing valid source provenance.')
    expect(loadReferenceAssetObject).not.toHaveBeenCalled()
  })

  it('starts a temporary fly session on RMB, applies look deltas, moves while keys are held, and suppresses the release context menu', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    ;(canvas as HTMLCanvasElement & { requestPointerLock?: () => void }).requestPointerLock = vi.fn()
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!
    ;(viewer as unknown as { clock: { getDelta: () => number } }).clock.getDelta = () => 1
    ;(viewer as unknown as { setFlyModeType: (mode: 'drone' | 'free-cam') => void }).setFlyModeType('drone')

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 2,
        buttons: 2,
        pointerId: 7,
        clientX: 100,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect((viewer as unknown as { isFlyModeActive: () => boolean }).isFlyModeActive()).toBe(true)
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(7)
    expect(controller.beginFlyMode).toHaveBeenCalledTimes(1)

    canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        pointerId: 7,
        clientX: 130,
        clientY: 140,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(controller.applyFlyLookDelta).toHaveBeenCalledWith(30, 20)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', bubbles: true, cancelable: true }))
    ;(viewer as unknown as { renderLoop: () => void }).renderLoop()

    expect(controller.translateFly).toHaveBeenCalledTimes(1)
    const baseForwardDistance = controller.translateFly.mock.calls[0]?.[0] ?? 0
    expect(baseForwardDistance).toBeGreaterThan(0)
    expect(controller.translateFly.mock.calls[0]?.[1]).toBe(0)
    expect(controller.translateFly.mock.calls[0]?.[2]).toBe(0)

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Control',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    )
    ;(viewer as unknown as { renderLoop: () => void }).renderLoop()

    expect(controller.translateFly).toHaveBeenCalledTimes(2)
    expect(controller.translateFly.mock.calls[1]?.[0]).toBeGreaterThan(0)
    expect(controller.translateFly.mock.calls[1]?.[2]).toBeLessThan(0)

    window.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: 'Control',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    )
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true, cancelable: true }))
    ;(viewer as unknown as { renderLoop: () => void }).renderLoop()

    expect(controller.translateFly).toHaveBeenCalledTimes(3)
    expect((controller.translateFly.mock.calls[2]?.[0] ?? 0)).toBeGreaterThan(baseForwardDistance)
    expect(controller.translateFly.mock.calls[2]?.[2]).toBe(0)

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', bubbles: true, cancelable: true }))
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', bubbles: true, cancelable: true }))
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        button: 2,
        buttons: 0,
        pointerId: 7,
        clientX: 130,
        clientY: 140,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect((viewer as unknown as { isFlyModeActive: () => boolean }).isFlyModeActive()).toBe(false)
    expect(canvas.releasePointerCapture).toHaveBeenCalledWith(7)
    expect(controller.endFlyMode).toHaveBeenCalledWith({ restoreUpright: true })

    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    canvas.dispatchEvent(contextMenuEvent)

    expect(contextMenuEvent.defaultPrevented).toBe(true)
  })

  it('uses pointer-lock movement deltas during fly mode and releases pointer lock on exit', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    ;(canvas as HTMLCanvasElement & {
      requestPointerLock?: (options?: PointerLockOptions) => Promise<void>
    }).requestPointerLock = vi.fn(async () => {
      pointerLockElement = canvas
    })
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!
    ;(viewer as unknown as { setFlyModeType: (mode: 'drone' | 'free-cam') => void }).setFlyModeType('drone')

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 2,
        buttons: 2,
        pointerId: 31,
        clientX: 200,
        clientY: 220,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(canvas.requestPointerLock).toHaveBeenCalledTimes(1)
    expect(pointerLockElement).toBe(canvas)

    const moveEvent = new PointerEvent('pointermove', {
      pointerId: 31,
      clientX: 200,
      clientY: 220,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(moveEvent, 'movementX', {
      configurable: true,
      value: 18,
    })
    Object.defineProperty(moveEvent, 'movementY', {
      configurable: true,
      value: -11,
    })
    canvas.dispatchEvent(moveEvent)

    expect(controller.applyFlyLookDelta).toHaveBeenCalledWith(18, -11)

    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        button: 2,
        buttons: 0,
        pointerId: 31,
        clientX: 200,
        clientY: 220,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(document.exitPointerLock).toHaveBeenCalledTimes(1)
    expect(pointerLockElement).toBeNull()
  })

  it('routes orientation-gizmo corner and outer-edge targets through animated camera snaps', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const axisCanvas = document.createElement('canvas')
    ;(viewer as unknown as { setAxisOverlayCanvas: (canvas: HTMLCanvasElement | null) => void }).setAxisOverlayCanvas(
      axisCanvas,
    )

    const axisGizmo = axisGizmoMocks.instances[0]!
    const controller = cameraControllerMocks.instances[0]!

    axisGizmo.onTargetSelected?.({
      kind: 'corner',
      direction: [1, 1, 1],
    })
    axisGizmo.onTargetSelected?.({
      kind: 'edge',
      direction: [0, 1, 1],
    })

    expect(controller.animateToDirection).toHaveBeenCalledTimes(2)
    expect(controller.snapToDirection).not.toHaveBeenCalled()
    expect(controller.animateToDirection.mock.calls[0]?.[0]).toMatchObject({
      x: 1,
      y: 1,
      z: 1,
    })
    expect(controller.animateToDirection.mock.calls[0]?.[1]).toMatchObject({
      durationMs: 320,
    })
    expect(controller.animateToDirection.mock.calls[1]?.[0]).toMatchObject({
      x: 0,
      y: 1,
      z: 1,
    })
  })

  it('routes gizmo viewport drag callbacks through the temporary orbit path', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const axisCanvas = document.createElement('canvas')
    ;(viewer as unknown as { setAxisOverlayCanvas: (canvas: HTMLCanvasElement | null) => void }).setAxisOverlayCanvas(
      axisCanvas,
    )

    const axisGizmo = axisGizmoMocks.instances[0]!
    const controller = cameraControllerMocks.instances[0]!

    axisGizmo.onOrbitDragStart?.(120, 140)
    axisGizmo.onOrbitDragMove?.(132, 155)
    axisGizmo.onOrbitDragEnd?.()

    expect(controller.beginTemporaryOrbitDrag).toHaveBeenCalledWith(120, 140)
    expect(controller.updateTemporaryOrbitDrag).toHaveBeenCalledWith(132, 155)
    expect(controller.endTemporaryOrbitDrag).toHaveBeenCalledTimes(1)
    expect(controller.animateToDirection).not.toHaveBeenCalled()
  })

  it('forwards animated preset options through the shared viewer camera seam without changing default preset callers', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const controller = cameraControllerMocks.instances[0]!
    const cameraPresetViewer = viewer as unknown as {
      setCameraPreset: (
        preset: 'top' | 'front' | 'back' | 'left' | 'right' | 'iso',
        options?: { animate?: boolean; durationMs?: number },
      ) => void
    }

    cameraPresetViewer.setCameraPreset('top')
    cameraPresetViewer.setCameraPreset('right', {
      animate: true,
      durationMs: 320,
    })

    expect(controller.setPreset).toHaveBeenNthCalledWith(1, 'top')
    expect(controller.setPreset).toHaveBeenNthCalledWith(2, 'right', {
      animate: true,
      durationMs: 320,
    })
  })

  it('forwards animated frame-selected options through the shared viewer framing seam', async () => {
    const { Viewer } = await import('./Viewer')
    const { Mesh, BoxGeometry, MeshBasicMaterial } = await import('three')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const controller = cameraControllerMocks.instances[0]!
    const frameViewer = viewer as unknown as {
      partMeshes: Map<string, object>
      frameSelected: (
        partId: string | null,
        options?: { animate?: boolean; durationMs?: number },
      ) => void
    }
    frameViewer.partMeshes.set(
      'part:object-1',
      new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()),
    )

    frameViewer.frameSelected('part:object-1', {
      animate: true,
      durationMs: 320,
    })

    expect(controller.frameObject).toHaveBeenCalledWith(expect.any(Mesh), {
      animate: true,
      durationMs: 320,
    })
  })

  it('frames the selected topology entity before falling back to the whole selected part', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const topologyPreview = {
      faces: [{ faceId: 'face:front', bodyId: 'body:1' }],
      triangleFaceIds: ['face:front', 'face:front'],
      edges: [
        {
          edgeId: 'edge:bottom',
          bodyId: 'body:1',
          faceIds: ['face:front'],
          polyline: [
            0, 0, 0,
            1, 0, 0,
          ],
        },
      ],
      points: [
        {
          pointId: 'point:origin',
          bodyId: 'body:1',
          position: [0, 0, 0] as [number, number, number],
        },
      ],
    }

    const runtime = viewer as unknown as {
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      setSelectedTopologyEntity: (entity: {
        kind: 'edge' | 'point' | 'face'
        partKey: string
        edgeId?: string
        pointId?: string
        faceId?: string
        bodyId: string
      } | null) => void
      frameSelected: (
        partId: string | null,
        options?: { animate?: boolean; durationMs?: number },
      ) => void
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [
          toViewerRenderablePart(
            createTwoTriangleMeshArtifact('part:topology-frame'),
            'part:topology-frame',
            topologyPreview,
          ),
        ],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      'part:topology-frame',
    )

    const controller = cameraControllerMocks.instances[0]!

    runtime.setSelectedTopologyEntity({
      kind: 'edge',
      partKey: 'part:topology-frame',
      edgeId: 'edge:bottom',
      bodyId: 'body:1',
    })
    runtime.frameSelected('part:topology-frame', {
      animate: true,
      durationMs: 320,
    })
    expect(controller.frameObject).not.toHaveBeenCalled()
    expect(controller.frameBox).toHaveBeenCalledTimes(1)
    expect(controller.frameBox).toHaveBeenLastCalledWith(expect.any(Box3), {
      animate: true,
      durationMs: 320,
    })
    const edgeBounds = controller.frameBox.mock.calls.at(-1)?.[0] as Box3
    expect(edgeBounds.min.x).toBeCloseTo(-0.05)
    expect(edgeBounds.max.x).toBeCloseTo(1.05)
    expect(edgeBounds.min.y).toBeCloseTo(-0.05)
    expect(edgeBounds.max.y).toBeCloseTo(0.05)

    runtime.setSelectedTopologyEntity({
      kind: 'point',
      partKey: 'part:topology-frame',
      pointId: 'point:origin',
      bodyId: 'body:1',
    })
    runtime.frameSelected('part:topology-frame')
    expect(controller.frameBox).toHaveBeenCalledTimes(2)
    const pointBounds = controller.frameBox.mock.calls.at(-1)?.[0] as Box3
    expect(pointBounds.min.x).toBeCloseTo(-0.06)
    expect(pointBounds.max.x).toBeCloseTo(0.06)
    expect(pointBounds.min.y).toBeCloseTo(-0.06)
    expect(pointBounds.max.y).toBeCloseTo(0.06)

    runtime.setSelectedTopologyEntity({
      kind: 'face',
      partKey: 'part:topology-frame',
      faceId: 'face:front',
      bodyId: 'body:1',
    })
    runtime.frameSelected('part:topology-frame')
    expect(controller.frameBox).toHaveBeenCalledTimes(3)
    const faceBounds = controller.frameBox.mock.calls.at(-1)?.[0] as Box3
    expect(faceBounds.min.x).toBeCloseTo(-0.05)
    expect(faceBounds.max.x).toBeCloseTo(1.05)
    expect(faceBounds.min.y).toBeCloseTo(-0.05)
    expect(faceBounds.max.y).toBeCloseTo(1.05)

    runtime.setSelectedTopologyEntity(null)
    runtime.frameSelected('part:topology-frame')
    expect(controller.frameObject).toHaveBeenCalledTimes(1)
  })

  it('keeps middle-button double-click zoom separate from middle-button pan drag', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!

    for (const pointerId of [71, 72]) {
      canvas.dispatchEvent(
        new PointerEvent('pointerdown', {
          button: 1,
          buttons: 4,
          pointerId,
          clientX: 180,
          clientY: 140,
          bubbles: true,
          cancelable: true,
        }),
      )
      canvas.dispatchEvent(
        new PointerEvent('pointerup', {
          button: 1,
          buttons: 0,
          pointerId,
          clientX: 180,
          clientY: 140,
          bubbles: true,
          cancelable: true,
        }),
      )
    }

    expect(controller.frameBox).toHaveBeenCalledTimes(1)
    expect(controller.beginTemporaryPanDrag).not.toHaveBeenCalled()
    expect(controller.updateTemporaryPanDrag).not.toHaveBeenCalled()
    expect(controller.endTemporaryPanDrag).not.toHaveBeenCalled()
  })

  it('starts middle-button pan only after the held button moves past the click threshold', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 1,
        buttons: 4,
        pointerId: 73,
        clientX: 200,
        clientY: 160,
        bubbles: true,
        cancelable: true,
      }),
    )
    canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        buttons: 4,
        pointerId: 73,
        clientX: 201,
        clientY: 161,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(controller.beginTemporaryPanDrag).not.toHaveBeenCalled()
    expect(controller.updateTemporaryPanDrag).not.toHaveBeenCalled()

    canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        buttons: 4,
        pointerId: 73,
        clientX: 206,
        clientY: 164,
        bubbles: true,
        cancelable: true,
      }),
    )
    canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        buttons: 4,
        pointerId: 73,
        clientX: 211,
        clientY: 169,
        bubbles: true,
        cancelable: true,
      }),
    )
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        button: 1,
        buttons: 0,
        pointerId: 73,
        clientX: 211,
        clientY: 169,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(controller.beginTemporaryPanDrag).toHaveBeenCalledWith(200, 160)
    expect(controller.updateTemporaryPanDrag).toHaveBeenNthCalledWith(1, 206, 164)
    expect(controller.updateTemporaryPanDrag).toHaveBeenNthCalledWith(2, 211, 169)
    expect(controller.endTemporaryPanDrag).toHaveBeenCalledTimes(1)
    expect(controller.frameBox).not.toHaveBeenCalled()
  })

  it('keeps modified Z chords out of the viewer-local zoom-object shortcut', async () => {
    const { Viewer } = await import('./Viewer')
    const { Mesh, BoxGeometry, MeshBasicMaterial } = await import('three')
    const { useAppStore } = await import('../app/store/useAppStore')
    const { useUiPrefsStore } = await import('../app/store/uiPrefsStore')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const controller = cameraControllerMocks.instances[0]!
    const frameViewer = viewer as unknown as {
      partMeshes: Map<string, object>
    }
    frameViewer.partMeshes.set(
      'part:object-1',
      new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()),
    )
    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.setState({ selectedPartKey: 'part:object-1' })
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useUiPrefsStore.getState().setConsoleInputPriorityMode('shortcuts-first')

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'z',
        code: 'KeyZ',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(controller.frameObject).not.toHaveBeenCalled()
    expect(controller.frameBox).not.toHaveBeenCalled()

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'z',
        code: 'KeyZ',
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(controller.frameObject).toHaveBeenCalledTimes(1)
    expect(controller.frameBox).not.toHaveBeenCalled()
  })

  it('keeps plain Z dormant in viewer-local Console-first mode', async () => {
    const { Viewer } = await import('./Viewer')
    const { useUiPrefsStore } = await import('../app/store/uiPrefsStore')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const controller = cameraControllerMocks.instances[0]!
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useUiPrefsStore.getState().setConsoleInputPriorityMode('console-first')

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'z',
        code: 'KeyZ',
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(controller.frameObject).not.toHaveBeenCalled()
    expect(controller.frameBox).not.toHaveBeenCalled()
  })

  it('frames viewer-local multi-selection with plain Z in Shortcuts-first mode', async () => {
    const { Viewer } = await import('./Viewer')
    const { Mesh, BoxGeometry, MeshBasicMaterial } = await import('three')
    const { useAppStore } = await import('../app/store/useAppStore')
    const { useUiPrefsStore } = await import('../app/store/uiPrefsStore')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const controller = cameraControllerMocks.instances[0]!
    const frameViewer = viewer as unknown as {
      partMeshes: Map<string, object>
    }
    frameViewer.partMeshes.set(
      'graph-document-1:output-entry-1',
      new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()),
    )
    frameViewer.partMeshes.set(
      'graph-document-1:output-entry-2',
      new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()),
    )

    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useUiPrefsStore.getState().setConsoleInputPriorityMode('shortcuts-first')
    useAppStore.setState((state) => ({
      ...useAppStore.getInitialState(),
      projectContent: {
        ...state.projectContent,
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-output-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-output-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      selectedPartKey: null,
      workspaceSelection: {
        ...state.workspaceSelection,
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
          {
            kind: 'object',
            objectId: 'object-2',
          },
        ],
      },
    }), true)

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'z',
        code: 'KeyZ',
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(controller.frameBox).toHaveBeenCalledTimes(1)
    expect(controller.frameObject).not.toHaveBeenCalled()
  })

  it('forwards animated frame-reference options through the shared viewer framing seam', async () => {
    const { Viewer } = await import('./Viewer')
    const { Group } = await import('three')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const controller = cameraControllerMocks.instances[0]!
    const frameViewer = viewer as unknown as {
      referenceObjects: Map<string, object>
      frameReference: (
        referenceId: string,
        options?: { animate?: boolean; durationMs?: number },
      ) => void
    }
    frameViewer.referenceObjects.set('shoe:shoe-1', new Group())

    frameViewer.frameReference('shoe:shoe-1', {
      animate: true,
      durationMs: 480,
    })

    expect(controller.frameObject).toHaveBeenCalledWith(expect.any(Group), {
      animate: true,
      durationMs: 480,
    })
  })

  it('forwards axis-overlay shell interactions into the live gizmo helper', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const axisCanvas = document.createElement('canvas')
    ;(viewer as unknown as { setAxisOverlayCanvas: (canvas: HTMLCanvasElement | null) => void }).setAxisOverlayCanvas(
      axisCanvas,
    )

    const axisGizmo = axisGizmoMocks.instances[0]!

    ;(viewer as unknown as {
      beginAxisOverlayPointerInteraction: (pointerId: number, clientX: number, clientY: number) => void
      updateAxisOverlayPointerInteraction: (pointerId: number, clientX: number, clientY: number) => void
      endAxisOverlayPointerInteraction: (pointerId: number) => void
      cancelAxisOverlayPointerInteraction: (pointerId: number) => void
      updateAxisOverlayPointerHover: (clientX: number, clientY: number) => void
      clearAxisOverlayPointerHover: () => void
    }).beginAxisOverlayPointerInteraction(7, 12, 18)
    ;(viewer as unknown as {
      updateAxisOverlayPointerInteraction: (pointerId: number, clientX: number, clientY: number) => void
    }).updateAxisOverlayPointerInteraction(7, 20, 26)
    ;(viewer as unknown as { endAxisOverlayPointerInteraction: (pointerId: number) => void }).endAxisOverlayPointerInteraction(7)
    ;(viewer as unknown as { cancelAxisOverlayPointerInteraction: (pointerId: number) => void }).cancelAxisOverlayPointerInteraction(7)
    ;(viewer as unknown as { updateAxisOverlayPointerHover: (clientX: number, clientY: number) => void }).updateAxisOverlayPointerHover(30, 40)
    ;(viewer as unknown as { clearAxisOverlayPointerHover: () => void }).clearAxisOverlayPointerHover()

    expect(axisGizmo.beginPointerInteraction).toHaveBeenCalledWith(7, 12, 18)
    expect(axisGizmo.updatePointerInteraction).toHaveBeenCalledWith(7, 20, 26)
    expect(axisGizmo.endPointerInteraction).toHaveBeenCalledWith(7)
    expect(axisGizmo.cancelPointerInteraction).toHaveBeenCalledWith(7)
    expect(axisGizmo.updatePointerHover).toHaveBeenCalledWith(30, 40)
    expect(axisGizmo.clearPointerHover).toHaveBeenCalledTimes(1)
  })

  it('applies axis-overlay style settings to the helper when the overlay is created and when view settings change', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const axisCanvas = document.createElement('canvas')
    ;(viewer as unknown as { setAxisOverlayCanvas: (canvas: HTMLCanvasElement | null) => void }).setAxisOverlayCanvas(
      axisCanvas,
    )

    const axisGizmo = axisGizmoMocks.instances[0]!
    expect(axisGizmo.setStyle).toHaveBeenCalledWith(DEFAULT_VIEW_SETTINGS.axisOverlayStyle)

    ;(viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
    }).applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      axisOverlayStyle: {
        ...DEFAULT_VIEW_SETTINGS.axisOverlayStyle,
        mainLineOpacity: 0.42,
        secondaryLineOpacity: 0.08,
        sphereScale: 1.35,
        cameraDistance: 4.05,
        labelsVisible: false,
        labelSize: 'large',
      },
    })

    expect(axisGizmo.setStyle).toHaveBeenLastCalledWith({
      mainLineOpacity: 0.42,
      secondaryLineOpacity: 0.08,
      sphereScale: 1.35,
      cameraDistance: 4.05,
      labelsVisible: false,
      backgroundMode: 'none',
      backgroundOpacity: 0,
      labelSize: 'large',
    })
  })

  it('applies the retuned default environment baseline through the existing runtime seams', async () => {
    const { Viewer } = await import('./Viewer')
    const {
      DEFAULT_VIEW_SETTINGS,
      getEnvironmentPresetDefinition,
    } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    expect(DEFAULT_VIEW_SETTINGS.environmentGrade).toEqual({
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
    })
    expect(DEFAULT_VIEW_SETTINGS.lighting.lights.map((light) => light.id)).toEqual([
      'key',
      'fill',
      'rim',
    ])
    expect(DEFAULT_VIEW_SETTINGS.lighting.lights[0]).toMatchObject({
      color: '#fff2e6',
      intensity: 1.85,
      position: { x: 11, y: 13, z: 8 },
      target: { x: 0, y: 0.5, z: 0 },
    })
    expect(DEFAULT_VIEW_SETTINGS.lighting.lights[1]).toMatchObject({
      color: '#eef3ff',
      intensity: 0.95,
    })
    expect(DEFAULT_VIEW_SETTINGS.lighting.lights[2]).toMatchObject({
      intensity: 0.42,
      position: { x: -11, y: 7, z: -9 },
      target: { x: 0, y: 0.75, z: 0 },
    })

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderer: { toneMappingExposure: number; domElement: HTMLCanvasElement }
      scene: { background: { getHexString: () => string } | null }
      lightsById: Map<string, { intensity: number }>
      gridHelpers: Array<{
        material: { opacity: number; color: { getHexString: () => string } }
        position: { y: number }
        userData: { gridPresentationLayerId?: string }
      }>
    }

    expect(runtime.renderer.toneMappingExposure).toBe(DEFAULT_VIEW_SETTINGS.environmentGrade.exposure)
    expect(runtime.renderer.domElement.style.filter).toContain('brightness(')
    expect(runtime.renderer.domElement.style.filter).toContain('contrast(')
    expect(runtime.renderer.domElement.style.filter).toContain('saturate(')
    expect(runtime.renderer.domElement.style.filter).toContain('hue-rotate(')
    expect(runtime.scene.background?.getHexString()).toBe('0b0b0f')
    expect([...runtime.lightsById.keys()]).toEqual(['key', 'fill', 'rim'])
    expect(runtime.lightsById.get('rim')?.intensity).toBe(0.42)
    expect(runtime.gridHelpers.map((helper) => helper.userData.gridPresentationLayerId)).toEqual([
      'grid1',
      'grid2',
      'grid3',
    ])
    expect(runtime.gridHelpers.map((helper) => helper.material.opacity)).toEqual([0.1, 0.3, 1])
    expect(runtime.gridHelpers.map((helper) => helper.position.y)).toEqual([0, 0.001, 0.002])

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      envPreset: 'studio',
    })

    expect(runtime.scene.background?.getHexString()).toBe(
      getEnvironmentPresetDefinition('studio').background.slice(1),
    )

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      envPreset: 'dark_studio',
    })

    expect(runtime.scene.background?.getHexString()).toBe(
      getEnvironmentPresetDefinition('dark_studio').background.slice(1),
    )

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      environmentGrade: {
        ...DEFAULT_VIEW_SETTINGS.environmentGrade,
        exposure: 1.35,
        contrast: 1.18,
        highlights: 24,
        shadows: -14,
        whites: 12,
        blacks: -8,
        temperature: 18,
        tint: -10,
        saturation: 1.24,
      },
    })

    expect(runtime.renderer.toneMappingExposure).toBe(1.35)
    expect(runtime.renderer.domElement.style.filter).toContain('contrast(')
    expect(runtime.renderer.domElement.style.filter).toContain('saturate(')
    expect(runtime.renderer.domElement.style.filter).toContain('hue-rotate(')
  })

  it('applies an active HDRI as one lighting contribution seam while keeping background treatment separate', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS, createHdriEnvironmentSource } = await import(
      '../shared/viewSettingsTypes'
    )

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const hdriTexture = new Texture()
    const loadHdriTexture = vi.fn(async () => hdriTexture)
    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      loadHdriTexture: (assetPath: string) => Promise<Texture>
      scene: {
        environment: Texture | null
        background: Texture | { getHexString: () => string } | null
        environmentIntensity?: number
        backgroundIntensity?: number
        environmentRotation: { y: number }
        backgroundRotation: { y: number }
      }
      lightsById: Map<string, { intensity: number }>
    }
    runtime.loadHdriTexture = loadHdriTexture

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      environmentSource: createHdriEnvironmentSource({
        label: 'Workshop Loft',
        assetPath: '/HDRI/workshop_loft.hdr',
        backgroundVisible: false,
        intensity: 1.35,
        backgroundIntensity: 0.45,
        rotationDeg: 90,
      }),
    })

    expect(loadHdriTexture).toHaveBeenCalledWith('/HDRI/workshop_loft.hdr')
    expect(runtime.scene.background).toBeNull()
    expect([...runtime.lightsById.keys()]).toEqual(['key', 'fill', 'rim'])

    await Promise.resolve()
    await Promise.resolve()

    expect(runtime.scene.environment).toBe(hdriTexture)
    expect(runtime.scene.background).toBeNull()
    expect(runtime.scene.environmentIntensity).toBe(1.35)
    expect(runtime.scene.backgroundIntensity).toBe(0.45)
    expect(runtime.scene.environmentRotation.y).toBeCloseTo(Math.PI / 2)
    expect(runtime.scene.backgroundRotation.y).toBeCloseTo(Math.PI / 2)
    expect(runtime.lightsById.get('key')?.intensity).toBe(1.85)

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      environmentSource: createHdriEnvironmentSource({
        label: 'Workshop Loft',
        assetPath: '/HDRI/workshop_loft.hdr',
        backgroundVisible: true,
        intensity: 1.35,
        backgroundIntensity: 0.45,
        rotationDeg: 180,
      }),
    })

    expect(runtime.scene.environment).toBe(hdriTexture)
    expect(runtime.scene.background).toBe(hdriTexture)
    expect(runtime.scene.environmentIntensity).toBe(1.35)
    expect(runtime.scene.backgroundIntensity).toBe(0.45)
    expect(runtime.scene.environmentRotation.y).toBeCloseTo(Math.PI)
    expect(runtime.scene.backgroundRotation.y).toBeCloseTo(Math.PI)
  })

  it('creates wireframe helpers for environment lights and picks them through the shared target contract', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)
    const canvas = (viewer as unknown as { renderer: { domElement: HTMLCanvasElement } }).renderer
      .domElement
    Object.defineProperty(canvas, 'getBoundingClientRect', {
      configurable: true,
      value: () =>
        ({
          left: 0,
          top: 0,
          width: 800,
          height: 600,
          right: 800,
          bottom: 600,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    })

    const environmentLightView = {
      ...DEFAULT_VIEW_SETTINGS,
      lighting: {
        selectedLightId: 'light-key',
        lights: [
          {
            id: 'light-key',
            name: 'Key',
            type: 'point' as const,
            enabled: true,
            color: '#fff2e6',
            intensity: 1.25,
            position: { x: 0, y: 0, z: 0 },
            castShadow: true,
            shadowBias: -0.0002,
            shadowMapSize: 1024,
          },
        ],
      },
    }

    ;(viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
    }).applyViewSettings(environmentLightView)

    const runtime = viewer as unknown as {
      environmentLightHelpersById: Map<
        string,
        {
          userData: { environmentLightId: string }
          getWorldPosition: (target: Vector3) => Vector3
        }
      >
      collectWorkspaceSelectionCandidates: () => Array<{
        pick: { kind: string; lightId?: string }
      }>
      pickWorkspaceSelection: (clientX: number, clientY: number) => { kind: string; lightId?: string } | null
    }

    const helper = runtime.environmentLightHelpersById.get('light-key')
    expect(helper?.userData.environmentLightId).toBe('light-key')
    expect(runtime.collectWorkspaceSelectionCandidates().some((candidate) => candidate.pick.kind === 'environment-light')).toBe(true)
    const helperWorldPosition = new Vector3()
    helper?.getWorldPosition(helperWorldPosition)
    const projected = helperWorldPosition.project(
      (viewer as unknown as { cameraController: { getActiveCamera: () => { project: (vector: Vector3) => Vector3 } } })
        .cameraController.getActiveCamera() as unknown as Camera,
    )
    const pickX = ((projected.x + 1) / 2) * 800
    const pickY = ((1 - projected.y) / 2) * 600
    expect(runtime.pickWorkspaceSelection(pickX, pickY)).toEqual({
      kind: 'environment-light',
      lightId: 'light-key',
    })
  })

  it('hides disabled environment-light helpers from the viewport and picking', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    ;(viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
    }).applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      lighting: {
        selectedLightId: 'light-key',
        lights: [
          {
            id: 'light-key',
            name: 'Key',
            type: 'point' as const,
            enabled: false,
            color: '#fff2e6',
            intensity: 1.25,
            position: { x: 0, y: 0, z: 0 },
            castShadow: true,
            shadowBias: -0.0002,
            shadowMapSize: 1024,
          },
        ],
      },
    })

    const runtime = viewer as unknown as {
      environmentLightHelpersById: Map<string, { visible: boolean }>
      collectWorkspaceSelectionCandidates: () => Array<{
        pick: { kind: string; lightId?: string }
      }>
    }

    const helper = runtime.environmentLightHelpersById.get('light-key')
    expect(helper?.visible).toBe(false)
    expect(
      runtime.collectWorkspaceSelectionCandidates().some(
        (candidate) =>
          candidate.pick.kind === 'environment-light' &&
          candidate.pick.lightId === 'light-key',
      ),
    ).toBe(false)
  })

  it('frames environment-light helpers by light id without falling back to frame all for missing helpers', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    ;(viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
    }).applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      lighting: {
        selectedLightId: 'light-key',
        lights: [
          {
            id: 'light-key',
            name: 'Key',
            type: 'point' as const,
            enabled: true,
            color: '#fff2e6',
            intensity: 1.25,
            position: { x: 1, y: 2, z: 3 },
            castShadow: true,
            shadowBias: -0.0002,
            shadowMapSize: 1024,
          },
        ],
      },
    })

    const controller = cameraControllerMocks.instances[0]!
    const runtime = viewer as unknown as {
      frameEnvironmentLight: (
        lightId: string,
        options?: { animate?: boolean; durationMs?: number },
      ) => boolean
    }

    expect(
      runtime.frameEnvironmentLight('light-key', {
        animate: true,
        durationMs: 320,
      }),
    ).toBe(true)
    expect(controller.frameObject).toHaveBeenCalledWith(expect.any(Object), {
      animate: true,
      durationMs: 320,
    })

    controller.frameObject.mockClear()

    expect(runtime.frameEnvironmentLight('missing-light')).toBe(false)
    expect(controller.frameObject).not.toHaveBeenCalled()
  })

  it('reports translated environment-light helper movement through the shared viewer transform callback', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    ;(viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
    }).applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      lighting: {
        selectedLightId: 'light-key',
        lights: [
          {
            id: 'light-key',
            name: 'Key',
            type: 'point' as const,
            enabled: true,
            color: '#fff2e6',
            intensity: 1.25,
            position: { x: 1, y: 2, z: 3 },
            castShadow: true,
            shadowBias: -0.0002,
            shadowMapSize: 1024,
          },
        ],
      },
    })

    const handleViewerTransformChange = vi.fn()
    const runtime = viewer as unknown as {
      environmentLightHelpersById: Map<string, { position: Vector3 }>
      setOnViewerTransformChange: (
        handler:
          | ((
              target: { kind: 'environment-light'; lightId: string },
              transform: {
                position: { x: number; y: number; z: number }
                rotationDeg: { x: number; y: number; z: number }
                scale: { x: number; y: number; z: number }
              },
            ) => void)
          | null,
      ) => void
      setViewerTransformSession: (session: {
        targetKind: 'environment-light'
        targetId: string
        mode: 'translate'
        space: 'world'
        entryOrigin: null
      }) => void
      handleTransformGizmoObjectChange: (object: object) => void
    }

    runtime.setOnViewerTransformChange(handleViewerTransformChange)
    runtime.setViewerTransformSession({
      targetKind: 'environment-light',
      targetId: 'light-key',
      mode: 'translate',
      space: 'world',
      entryOrigin: null,
    })

    const helper = runtime.environmentLightHelpersById.get('light-key')
    expect(helper).toBeTruthy()

    helper!.position.set(4, 5, 6)
    runtime.handleTransformGizmoObjectChange(helper!)

    expect(handleViewerTransformChange).toHaveBeenCalledWith(
      {
        kind: 'environment-light',
        lightId: 'light-key',
      },
      expect.objectContaining({
        position: { x: 4, y: 5, z: 6 },
      }),
    )
  })

  it('creates a hidden ground plane by default and applies ground visibility, height, and material through the shared view seam', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      groundPlane: {
        visible: boolean
        position: { y: number }
        castShadow: boolean
        receiveShadow: boolean
        material: {
          color: { getHexString: () => string }
          roughness: number
          metalness: number
        }
      }
      gridHelpers: Array<{ material: { opacity: number } }>
      scene: { background: { getHexString: () => string } | null }
    }

    expect(DEFAULT_VIEW_SETTINGS.ground).toEqual({
      enabled: false,
      height: 0,
      materialPresetId: 'matte_mid',
    })
    expect(runtime.groundPlane.visible).toBe(false)
    expect(runtime.groundPlane.position.y).toBe(0)
    expect(runtime.groundPlane.castShadow).toBe(false)
    expect(runtime.groundPlane.receiveShadow).toBe(true)
    expect(runtime.groundPlane.material.color.getHexString()).toBe('4c5562')

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      ground: {
        enabled: true,
        height: 4.5,
        materialPresetId: 'glossy_studio',
      },
    })

    expect(runtime.groundPlane.visible).toBe(true)
    expect(runtime.groundPlane.position.y).toBe(4.5)
    expect(runtime.groundPlane.castShadow).toBe(false)
    expect(runtime.groundPlane.receiveShadow).toBe(true)
    expect(runtime.groundPlane.material.color.getHexString()).toBe('777f8d')
    expect(runtime.groundPlane.material.roughness).toBe(0.26)
    expect(runtime.groundPlane.material.metalness).toBe(0.04)
    expect(runtime.gridHelpers[0]?.material.opacity).toBe(0.1)
    expect(runtime.scene.background?.getHexString()).toBe('0b0b0f')
  })

  it('builds editable grid presentation layers from the shared view seam', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      gridHelpers: Array<{
        material: { opacity: number; color: { getHexString: () => string } }
        position: { y: number }
        userData: { gridPresentationLayerId?: string }
      }>
      gridGroup: { visible: boolean }
    }

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      gridVisible: true,
      gridPresentation: {
        height: 2,
        size: 125,
        layers: [
          {
            id: 'grid1',
            enabled: true,
            spacing: 2,
            color: '#ff00aa',
            opacity: 0.2,
            heightOffset: 0.01,
          },
          {
            id: 'grid2',
            enabled: false,
            spacing: 10,
            color: '#00ffaa',
            opacity: 0.4,
            heightOffset: 0.02,
          },
          {
            id: 'grid3',
            enabled: true,
            spacing: 25,
            color: '#3366ff',
            opacity: 0.8,
            heightOffset: 0.03,
          },
        ],
      },
    })

    expect(runtime.gridGroup.visible).toBe(true)
    expect(runtime.gridHelpers.map((helper) => helper.userData.gridPresentationLayerId)).toEqual([
      'grid1',
      'grid3',
    ])
    expect(runtime.gridHelpers.map((helper) => helper.material.opacity)).toEqual([0.2, 0.8])
    expect(runtime.gridHelpers.map((helper) => helper.material.color.getHexString())).toEqual([
      'ff00aa',
      '3366ff',
    ])
    expect(runtime.gridHelpers.map((helper) => helper.position.y)).toEqual([2.01, 2.03])

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      gridVisible: false,
      gridPresentation: {
        ...DEFAULT_VIEW_SETTINGS.gridPresentation,
        height: -1,
        layers: DEFAULT_VIEW_SETTINGS.gridPresentation.layers.map((layer) => ({ ...layer })),
      },
    })

    expect(runtime.gridGroup.visible).toBe(false)
    expect(runtime.gridHelpers.map((helper) => helper.position.y)).toEqual([-1, -0.999, -0.998])
  })

  it('uses whole-object material fallback keys when rendered imported parts lack exact assignments', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setContentObjectMaterialFallbackGroups: (
        groups: Array<{ fallbackPartKey: string; partKeys: string[] }>,
      ) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      partMeshes: Map<string, { material: { color: { getHexString: () => string } } }>
    }

    runtime.setContentObjectMaterialFallbackGroups([
      {
        fallbackPartKey: 'reference-object:shoe-import',
        partKeys: ['reference-part:shoe-import:0', 'reference-part:shoe-import:1'],
      },
    ])
    runtime.setViewportRenderLayers(
      {
        baseParts: [
          toViewerRenderablePart(createArtifact('reference-part:shoe-import:0', 10)),
          toViewerRenderablePart(createArtifact('reference-part:shoe-import:1', 12)),
        ],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      materials: {
        presets: DEFAULT_VIEW_SETTINGS.materials.presets,
        selectedPresetId: 'default_matte',
        usePerPart: true,
        perPart: {
          'reference-object:shoe-import': 'brushed_metal',
          'reference-part:shoe-import:1': 'highlight_gloss',
        },
      },
    })

    expect(
      runtime.partMeshes.get('reference-part:shoe-import:0')?.material.color.getHexString(),
    ).toBe('afb5bf')
    expect(
      runtime.partMeshes.get('reference-part:shoe-import:1')?.material.color.getHexString(),
    ).toBe('f3f4f7')
  })

  it('applies typed material side settings from material presets', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      partMeshes: Map<string, { material: { side: number } }>
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [toViewerRenderablePart(createArtifact('part:side-proof', 10))],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      materials: {
        ...DEFAULT_VIEW_SETTINGS.materials,
        presets: DEFAULT_VIEW_SETTINGS.materials.presets.map((preset) =>
          preset.id === 'default_matte' ? { ...preset, doubleSided: false } : preset,
        ),
      },
    })

    expect(runtime.partMeshes.get('part:side-proof')?.material.side).toBe(FrontSide)

    runtime.applyViewSettings(DEFAULT_VIEW_SETTINGS)

    expect(runtime.partMeshes.get('part:side-proof')?.material.side).toBe(DoubleSide)
  })

  it('applies display modes through existing mesh presentation without rebuilding geometry', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      partMeshes: Map<
        string,
        {
          geometry: object
          material: {
            color: { getHexString: () => string }
            depthWrite: boolean
            opacity: number
            transparent: boolean
            wireframe: boolean
          }
        }
      >
      meshEdgeWireframeOverlaysByPartKey: Map<string, LineSegments[]>
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [toViewerRenderablePart(createArtifact('part:display-mode-proof', 10))],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )

    const materialSettings = {
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'material' as const,
      materials: {
        ...DEFAULT_VIEW_SETTINGS.materials,
        presets: DEFAULT_VIEW_SETTINGS.materials.presets.map((preset) =>
          preset.id === 'default_matte' ? { ...preset, color: '#ff0000' } : preset,
        ),
      },
    }

    runtime.applyViewSettings(materialSettings)

    const firstMesh = runtime.partMeshes.get('part:display-mode-proof')
    const firstGeometry = firstMesh?.geometry
    expect(firstMesh?.material).toBeInstanceOf(MeshStandardMaterial)
    expect(firstMesh?.material.color.getHexString()).toBe('ff0000')
    expect(firstMesh?.material.wireframe).toBe(false)

    runtime.applyViewSettings({
      ...materialSettings,
      displayMode: 'rendered',
    })

    const renderedMesh = runtime.partMeshes.get('part:display-mode-proof')
    expect(renderedMesh).toBe(firstMesh)
    expect(renderedMesh?.geometry).toBe(firstGeometry)
    expect(renderedMesh?.material).toBeInstanceOf(MeshStandardMaterial)
    expect(renderedMesh?.material.color.getHexString()).toBe('ff0000')
    expect(renderedMesh?.material.wireframe).toBe(false)

    runtime.applyViewSettings({
      ...materialSettings,
      displayMode: 'rendered',
      geometryDisplay: {
        ...materialSettings.geometryDisplay,
        surfaces: {
          ...materialSettings.geometryDisplay.surfaces,
          source: 'custom',
          customMaterial: {
            ...materialSettings.geometryDisplay.surfaces.customMaterial,
            color: '#00ffaa',
            metalness: 0.72,
            roughness: 0.18,
            opacity: 0.44,
            transparent: true,
            doubleSided: false,
          },
        },
      },
    })

    const customSurfaceMesh = runtime.partMeshes.get('part:display-mode-proof')
    const customSurfaceMaterial = customSurfaceMesh?.material as MeshStandardMaterial | undefined
    expect(customSurfaceMesh).toBe(firstMesh)
    expect(customSurfaceMesh?.geometry).toBe(firstGeometry)
    expect(customSurfaceMaterial?.color.getHexString()).toBe('00ffaa')
    expect(customSurfaceMaterial?.metalness).toBeCloseTo(0.72)
    expect(customSurfaceMaterial?.roughness).toBeCloseTo(0.18)
    expect(customSurfaceMaterial?.opacity).toBeCloseTo(0.44)
    expect(customSurfaceMaterial?.transparent).toBe(true)

    runtime.applyViewSettings(materialSettings)

    expect(runtime.partMeshes.get('part:display-mode-proof')).toBe(firstMesh)
    expect(runtime.partMeshes.get('part:display-mode-proof')?.geometry).toBe(firstGeometry)
    expect(runtime.partMeshes.get('part:display-mode-proof')?.material.color.getHexString()).toBe(
      'ff0000',
    )

    runtime.applyViewSettings({
      ...materialSettings,
      displayMode: 'solid',
    })

    const solidMesh = runtime.partMeshes.get('part:display-mode-proof')
    expect(solidMesh).toBe(firstMesh)
    expect(solidMesh?.geometry).toBe(firstGeometry)
    expect(solidMesh?.material.color.getHexString()).toBe('aeb6c2')
    expect(solidMesh?.material.wireframe).toBe(false)

    runtime.applyViewSettings({
      ...materialSettings,
      displayMode: 'wireframe',
      edgeDisplayMode: 'on',
    })

    const wireframeMesh = runtime.partMeshes.get('part:display-mode-proof')
    expect(wireframeMesh).toBe(firstMesh)
    expect(wireframeMesh?.geometry).toBe(firstGeometry)
    expect(wireframeMesh?.material).toBeInstanceOf(MeshStandardMaterial)
    expect(wireframeMesh?.material.color.getHexString()).toBe('ff0000')
    expect(wireframeMesh?.material.wireframe).toBe(false)
    expect(runtime.meshEdgeWireframeOverlaysByPartKey.get('part:display-mode-proof')?.[0]?.visible)
      .toBe(true)

    runtime.applyViewSettings({
      ...materialSettings,
      displayMode: 'solid',
      edgeDisplayMode: 'on',
    })

    expect(runtime.meshEdgeWireframeOverlaysByPartKey.get('part:display-mode-proof')?.[0]?.visible)
      .toBe(true)
    const xrayOverlayMaterial =
      runtime.meshEdgeWireframeOverlaysByPartKey.get('part:display-mode-proof')?.[0]
        ?.material as LineBasicMaterial | undefined
    expect(xrayOverlayMaterial?.color.getHexString()).toBe('6f92d9')
    expect(xrayOverlayMaterial?.opacity).toBe(DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.opacity)
    expect(xrayOverlayMaterial?.depthTest).toBe(false)
    expect(
      (
        runtime.meshEdgeWireframeOverlaysByPartKey.get('part:display-mode-proof')?.[0]
          ?.material as LineBasicMaterial | undefined
      )?.depthTest,
    ).toBe(false)
    expect(runtime.partMeshes.get('part:display-mode-proof')?.material.wireframe).toBe(false)

    runtime.applyViewSettings({
      ...materialSettings,
      displayMode: 'solid',
      edgeDisplayMode: 'on',
      geometryDisplay: {
        ...materialSettings.geometryDisplay,
        surfaces: {
          ...materialSettings.geometryDisplay.surfaces,
          visible: false,
        },
        edges: {
          ...materialSettings.geometryDisplay.edges,
          mode: 'all',
        },
      },
    })

    const hiddenSurfaceMaterial = runtime.partMeshes.get('part:display-mode-proof')
      ?.material as MeshStandardMaterial | undefined
    expect(hiddenSurfaceMaterial?.visible).toBe(false)
    expect(runtime.meshEdgeWireframeOverlaysByPartKey.get('part:display-mode-proof')?.[0]?.visible)
      .toBe(true)

    runtime.applyViewSettings({
      ...materialSettings,
      displayMode: 'wireframe',
      edgeDisplayMode: 'off',
      geometryDisplay: {
        ...materialSettings.geometryDisplay,
        edges: {
          ...materialSettings.geometryDisplay.edges,
          mode: 'off',
        },
      },
    })

    const restoredSurfaceMaterial = runtime.partMeshes.get('part:display-mode-proof')
      ?.material as MeshStandardMaterial | undefined
    expect(restoredSurfaceMaterial?.visible).toBe(true)
    expect(runtime.meshEdgeWireframeOverlaysByPartKey.get('part:display-mode-proof')?.[0]?.visible)
      .toBe(false)
    expect(runtime.partMeshes.get('part:display-mode-proof')?.material.wireframe).toBe(false)

    runtime.applyViewSettings({
      ...materialSettings,
      displayMode: 'rendered',
      edgeDisplayMode: 'visibleEdgesOnly',
    })

    const edgesOnlyMesh = runtime.partMeshes.get('part:display-mode-proof')
    const visibleEdgesOnlyOverlay =
      runtime.meshEdgeWireframeOverlaysByPartKey.get('part:display-mode-proof')?.[0]
    const visibleEdgesOnlyOverlayMaterial =
      visibleEdgesOnlyOverlay?.material as LineBasicMaterial | undefined
    expect(visibleEdgesOnlyOverlay?.visible).toBe(true)
    expect(visibleEdgesOnlyOverlayMaterial?.color.getHexString()).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.color.slice(1),
    )
    expect(visibleEdgesOnlyOverlayMaterial?.opacity).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.opacity,
    )
    expect(visibleEdgesOnlyOverlayMaterial?.depthTest).toBe(true)
    expect(edgesOnlyMesh?.material.wireframe).toBe(false)
    expect(edgesOnlyMesh?.material.transparent).toBe(false)
    expect(edgesOnlyMesh?.material.depthWrite).toBe(true)
    expect(edgesOnlyMesh?.material.opacity).toBe(1)

    runtime.applyViewSettings(materialSettings)

    const restoredMesh = runtime.partMeshes.get('part:display-mode-proof')
    expect(restoredMesh).toBe(firstMesh)
    expect(restoredMesh?.geometry).toBe(firstGeometry)
    expect(restoredMesh?.material).toBeInstanceOf(MeshStandardMaterial)
    expect(restoredMesh?.material.color.getHexString()).toBe('ff0000')
    expect(restoredMesh?.material.wireframe).toBe(false)
    expect(runtime.meshEdgeWireframeOverlaysByPartKey.get('part:display-mode-proof')?.[0]?.visible)
      .toBe(false)
  })

  it('applies Clay Studio as a rendered-mode presentation override without rebuilding geometry', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const {
      CLAY_STUDIO_CONTACT_SHADOW_SETTINGS,
      CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE,
      DEFAULT_VIEW_SETTINGS,
    } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      renderer: { toneMappingExposure: number; shadowMap: { enabled: boolean } }
      scene: { background: { getHexString: () => string } | null }
      gridGroup: { visible: boolean }
      axesHelper: { visible: boolean }
      groundPlane: {
        visible: boolean
        material: MeshStandardMaterial
      }
      clayStudioContactShadowGroup: {
        visible: boolean
        children: Mesh[]
      }
      lightsById: Map<string, { intensity: number }>
      partMeshes: Map<
        string,
        {
          geometry: object
          material: MeshStandardMaterial
        }
      >
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [toViewerRenderablePart(createArtifact('part:clay-studio-proof', 10))],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )

    const renderedSettings = {
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'rendered' as const,
      gridVisible: true,
      axesVisible: true,
      ground: {
        ...DEFAULT_VIEW_SETTINGS.ground,
        enabled: false,
      },
      materials: {
        ...DEFAULT_VIEW_SETTINGS.materials,
        presets: DEFAULT_VIEW_SETTINGS.materials.presets.map((preset) =>
          preset.id === 'default_matte' ? { ...preset, color: '#ff0000' } : preset,
        ),
      },
    }

    runtime.applyViewSettings(renderedSettings)

    const firstMesh = runtime.partMeshes.get('part:clay-studio-proof')
    const firstGeometry = firstMesh?.geometry
    expect(firstMesh?.material.color.getHexString()).toBe('ff0000')
    expect(runtime.gridGroup.visible).toBe(true)
    expect(runtime.axesHelper.visible).toBe(true)
    expect(runtime.groundPlane.visible).toBe(false)
    expect(runtime.clayStudioContactShadowGroup.visible).toBe(false)
    expect(runtime.clayStudioContactShadowGroup.children).toHaveLength(0)

    const clayPresetSettings = {
      ...renderedSettings,
      viewportStyle: 'clayStudio' as const,
      environmentGrade: CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE,
      shadowsEnabled: false,
      ground: {
        ...renderedSettings.ground,
        enabled: true,
      },
      gridVisible: false,
      contactShadows: {
        ...CLAY_STUDIO_CONTACT_SHADOW_SETTINGS,
      },
    }

    runtime.applyViewSettings(clayPresetSettings)

    const clayMesh = runtime.partMeshes.get('part:clay-studio-proof')
    expect(clayMesh).toBe(firstMesh)
    expect(clayMesh?.geometry).toBe(firstGeometry)
    expect(clayMesh?.material.color.getHexString()).toBe('f0eee8')
    expect(clayMesh?.material.roughness).toBeCloseTo(0.94)
    expect(clayMesh?.material.emissiveIntensity).toBeCloseTo(0.08)
    expect(runtime.scene.background?.getHexString()).toBe('e8e8e5')
    expect(runtime.renderer.toneMappingExposure).toBeCloseTo(1.28)
    expect(runtime.renderer.shadowMap.enabled).toBe(false)
    expect(runtime.gridGroup.visible).toBe(false)
    expect(runtime.axesHelper.visible).toBe(false)
    expect(runtime.groundPlane.visible).toBe(true)
    expect(runtime.groundPlane.material.color.getHexString()).toBe('ece9e1')
    expect(runtime.clayStudioContactShadowGroup.visible).toBe(true)
    expect(runtime.clayStudioContactShadowGroup.children).toHaveLength(3)
    const contactShadow = runtime.clayStudioContactShadowGroup.children[0]
    expect(contactShadow?.userData.clayStudioContactShadow).toBe(true)
    expect(contactShadow?.userData.partKey).toBe('part:clay-studio-proof')
    expect(contactShadow?.position.y).toBeGreaterThan(0)
    expect(contactShadow?.renderOrder).toBe(4)
    const contactShadowMaterial = contactShadow?.material as MeshBasicMaterial | undefined
    expect(contactShadowMaterial?.color.getHexString()).toBe('8f8b82')
    expect(contactShadowMaterial?.transparent).toBe(true)
    expect(contactShadowMaterial?.depthWrite).toBe(false)
    expect(contactShadowMaterial?.toneMapped).toBe(false)
    expect([...runtime.lightsById.keys()]).toEqual([
      'clay-studio-key',
      'clay-studio-fill',
      'clay-studio-ambient',
      'clay-studio-rim',
    ])
    expect(runtime.lightsById.get('clay-studio-key')?.intensity).toBeCloseTo(0.62)
    expect(runtime.lightsById.get('clay-studio-fill')?.intensity).toBeCloseTo(2.15)
    expect(runtime.lightsById.get('clay-studio-ambient')?.intensity).toBeCloseTo(0.58)
    expect(runtime.lightsById.get('clay-studio-rim')?.intensity).toBeCloseTo(0.16)

    runtime.applyViewSettings({
      ...clayPresetSettings,
      environmentGrade: {
        ...DEFAULT_VIEW_SETTINGS.environmentGrade,
        exposure: 1.67,
      },
      shadowsEnabled: true,
      gridVisible: true,
      ground: {
        ...clayPresetSettings.ground,
        enabled: false,
      },
    })

    expect(runtime.renderer.toneMappingExposure).toBeCloseTo(1.67)
    expect(runtime.renderer.shadowMap.enabled).toBe(true)
    expect(runtime.gridGroup.visible).toBe(true)
    expect(runtime.groundPlane.visible).toBe(false)
    expect(runtime.clayStudioContactShadowGroup.visible).toBe(false)

    runtime.applyViewSettings(renderedSettings)

    const restoredMesh = runtime.partMeshes.get('part:clay-studio-proof')
    expect(restoredMesh).toBe(firstMesh)
    expect(restoredMesh?.geometry).toBe(firstGeometry)
    expect(restoredMesh?.material.color.getHexString()).toBe('ff0000')
    expect(runtime.renderer.shadowMap.enabled).toBe(true)
    expect(runtime.gridGroup.visible).toBe(true)
    expect(runtime.axesHelper.visible).toBe(true)
    expect(runtime.groundPlane.visible).toBe(false)
    expect(runtime.clayStudioContactShadowGroup.visible).toBe(false)
    expect(runtime.clayStudioContactShadowGroup.children).toHaveLength(0)

    runtime.applyViewSettings({
      ...renderedSettings,
      viewportStyle: 'standard',
      ground: {
        ...renderedSettings.ground,
        enabled: true,
      },
      contactShadows: {
        enabled: true,
        opacity: 0.5,
        spread: 1.5,
        heightFade: 4,
      },
    })

    expect(runtime.clayStudioContactShadowGroup.visible).toBe(true)
    expect(runtime.clayStudioContactShadowGroup.children).toHaveLength(3)
    const standardContactShadow = runtime.clayStudioContactShadowGroup.children[0]
    const standardContactMaterial = standardContactShadow?.material as MeshBasicMaterial | undefined
    expect(standardContactMaterial?.opacity).toBeGreaterThan(0)
    expect(standardContactMaterial?.opacity).toBeLessThan(0.065)
    expect(standardContactShadow?.scale.x).toBeGreaterThan(contactShadow?.scale.x ?? 0)

    runtime.applyViewSettings({
      ...renderedSettings,
      displayMode: 'renderPreview',
      ground: {
        ...renderedSettings.ground,
        enabled: true,
      },
      contactShadows: {
        enabled: true,
        opacity: 1,
        spread: 1,
        heightFade: 8,
      },
    })

    expect(runtime.clayStudioContactShadowGroup.visible).toBe(false)
    expect(runtime.clayStudioContactShadowGroup.children).toHaveLength(0)

    runtime.applyViewSettings({
      ...renderedSettings,
      displayMode: 'renderPreview',
      viewportStyle: 'clayStudio',
    })

    const renderPreviewMesh = runtime.partMeshes.get('part:clay-studio-proof')
    expect(renderPreviewMesh).toBe(firstMesh)
    expect(renderPreviewMesh?.geometry).toBe(firstGeometry)
    expect(renderPreviewMesh?.material.color.getHexString()).toBe('ff0000')
  })

  it('keeps selected outlines visible when display edges are off', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      meshEdgeWireframeOverlaysByPartKey: Map<string, LineSegments[]>
      partSelectionOutlines: Map<string, LineSegments>
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [toViewerRenderablePart(createArtifact('part:selected-edge-proof', 10))],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      'part:selected-edge-proof',
    )
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'solid',
      edgeDisplayMode: 'off',
    })

    const displayEdgeOverlay =
      runtime.meshEdgeWireframeOverlaysByPartKey.get('part:selected-edge-proof')?.[0]
    const selectedOutline = runtime.partSelectionOutlines.get('part:selected-edge-proof')
    const selectedOutlineMaterial = selectedOutline?.material as LineBasicMaterial | undefined

    expect(displayEdgeOverlay?.visible).toBe(false)
    expect(selectedOutline?.visible).toBe(true)
    expect(selectedOutlineMaterial?.color.getHexString()).toBe('9ec3ff')
    expect(selectedOutlineMaterial?.opacity).toBeGreaterThan(0.9)
  })

  it('reduces cylinder mesh fallback seams while preserving silhouette rings', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      meshEdgeWireframeOverlaysByPartKey: Map<string, LineSegments[]>
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [
          toViewerRenderablePart(
            createCylinderLikeMeshArtifact('part:cylinder-edge-proof', 16),
            'part:cylinder-edge-proof',
          ),
        ],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'wireframe',
      edgeDisplayMode: 'on',
    })

    const overlay = runtime.meshEdgeWireframeOverlaysByPartKey.get('part:cylinder-edge-proof')?.[0]

    expect(overlay).toBeInstanceOf(LineSegments)
    expect(overlay?.visible).toBe(true)
    expect(overlay?.geometry.getAttribute('position').count).toBe(64)
  })

  it('uses semantic edge overlays instead of triangle material wireframe for topology-backed wireframe mode', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const topologyPreview = {
      faces: [{ faceId: 'face:front', bodyId: 'body:1' }],
      triangleFaceIds: ['face:front', 'face:front'],
      edges: [
        {
          edgeId: 'edge:bottom',
          bodyId: 'body:1',
          faceIds: ['face:front'],
          polyline: [
            0, 0, 0,
            1, 0, 0,
          ],
        },
        {
          edgeId: 'edge:right',
          bodyId: 'body:1',
          faceIds: ['face:front'],
          polyline: [
            1, 0, 0,
            1, 1, 0,
          ],
        },
        {
          edgeId: 'edge:top',
          bodyId: 'body:1',
          faceIds: ['face:front'],
          polyline: [
            1, 1, 0,
            0, 1, 0,
          ],
        },
        {
          edgeId: 'edge:left',
          bodyId: 'body:1',
          faceIds: ['face:front'],
          polyline: [
            0, 1, 0,
            0, 0, 0,
          ],
        },
      ],
      points: [],
    }

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      partMeshes: Map<
        string,
        {
          geometry: object
          material: {
            wireframe: boolean
          }
        }
      >
      semanticEdgeOverlaysByPartKey: Map<string, LineSegments>
      meshEdgeWireframeOverlaysByPartKey: Map<string, LineSegments[]>
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [
          toViewerRenderablePart(
            createTwoTriangleMeshArtifact('part:semantic-wireframe'),
            'part:semantic-wireframe',
            topologyPreview,
          ),
          toViewerRenderablePart(createTwoTriangleMeshArtifact('part:mesh-only'), 'part:mesh-only'),
        ],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'wireframe',
      edgeDisplayMode: 'on',
    })

    const semanticMesh = runtime.partMeshes.get('part:semantic-wireframe')
    const meshOnly = runtime.partMeshes.get('part:mesh-only')
    const semanticOverlay = runtime.semanticEdgeOverlaysByPartKey.get('part:semantic-wireframe')
    const meshOnlyOverlay = runtime.meshEdgeWireframeOverlaysByPartKey.get('part:mesh-only')?.[0]

    expect(semanticMesh?.material.wireframe).toBe(false)
    expect(meshOnly?.material.wireframe).toBe(false)
    expect(semanticOverlay).toBeInstanceOf(LineSegments)
    expect(semanticOverlay?.visible).toBe(true)
    expect(semanticOverlay?.geometry.getAttribute('position').count).toBe(8)
    expect((semanticOverlay?.material as LineBasicMaterial | undefined)?.color.getHexString()).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.color.slice(1),
    )
    expect((semanticOverlay?.material as LineBasicMaterial | undefined)?.opacity).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.opacity,
    )
    expect((meshOnlyOverlay?.material as LineBasicMaterial | undefined)?.opacity).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.opacity,
    )
    expect(runtime.semanticEdgeOverlaysByPartKey.has('part:mesh-only')).toBe(false)
    expect(runtime.meshEdgeWireframeOverlaysByPartKey.has('part:semantic-wireframe')).toBe(false)
    expect(meshOnlyOverlay).toBeInstanceOf(LineSegments)
    expect(meshOnlyOverlay?.visible).toBe(true)
    expect(meshOnlyOverlay?.geometry.getAttribute('position').count).toBe(8)

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'solid',
    })

    expect(runtime.partMeshes.get('part:semantic-wireframe')).toBe(semanticMesh)
    expect(runtime.partMeshes.get('part:semantic-wireframe')?.geometry).toBe(semanticMesh?.geometry)
    expect(semanticOverlay?.visible).toBe(false)
    expect(meshOnlyOverlay?.visible).toBe(false)
  })

  it('returns topology point picks before edge and face picks when helpers overlap', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const topologyPreview = {
      faces: [{ faceId: 'face:front', bodyId: 'body:1' }],
      triangleFaceIds: ['face:front', 'face:front'],
      edges: [
        {
          edgeId: 'edge:bottom',
          bodyId: 'body:1',
          faceIds: ['face:front'],
          polyline: [
            0, 0, 0,
            1, 0, 0,
          ],
        },
      ],
      points: [
        {
          pointId: 'point:origin',
          bodyId: 'body:1',
          position: [0, 0, 0] as [number, number, number],
        },
      ],
    }

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      partMeshes: Map<string, Mesh>
      topologyEdgePickTargetsByPartKey: Map<string, LineSegments[]>
      topologyPointPickTargetsByPartKey: Map<string, Points[]>
      raycaster: {
        intersectObjects: ReturnType<typeof vi.fn>
      }
      renderer: {
        domElement: HTMLCanvasElement
      }
      pickWorkspaceSelection: (clientX: number, clientY: number) => unknown
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [
          toViewerRenderablePart(
            createTwoTriangleMeshArtifact('part:topology-pick'),
            'part:topology-pick',
            topologyPreview,
          ),
        ],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'wireframe',
      edgeDisplayMode: 'on',
    })

    const mesh = runtime.partMeshes.get('part:topology-pick')
    const edgeTarget = runtime.topologyEdgePickTargetsByPartKey.get('part:topology-pick')?.[0]
    const pointTarget = runtime.topologyPointPickTargetsByPartKey.get('part:topology-pick')?.[0]
    expect(mesh).toBeInstanceOf(Mesh)
    expect(edgeTarget).toBeInstanceOf(LineSegments)
    expect(pointTarget).toBeInstanceOf(Points)

    runtime.renderer.domElement.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))
    runtime.raycaster.intersectObjects = vi.fn(() => [
      { object: mesh, faceIndex: 0 },
      { object: edgeTarget },
      { object: pointTarget },
    ])

    expect(runtime.pickWorkspaceSelection(400, 300)).toEqual({
      kind: 'part',
      partKey: 'part:topology-pick',
      pointId: 'point:origin',
      topologyBodyId: 'body:1',
    })
  })

  it('returns topology edge picks before face picks and highlights selected edges and points', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const topologyPreview = {
      faces: [{ faceId: 'face:front', bodyId: 'body:1' }],
      triangleFaceIds: ['face:front', 'face:front'],
      edges: [
        {
          edgeId: 'edge:bottom',
          bodyId: 'body:1',
          faceIds: ['face:front'],
          polyline: [
            0, 0, 0,
            1, 0, 0,
          ],
        },
      ],
      points: [
        {
          pointId: 'point:origin',
          bodyId: 'body:1',
          position: [0, 0, 0] as [number, number, number],
        },
      ],
    }

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      partMeshes: Map<string, Mesh>
      semanticEdgeOverlaysByPartKey: Map<string, LineSegments>
      topologyEdgePickTargetsByPartKey: Map<string, LineSegments[]>
      raycaster: {
        intersectObjects: ReturnType<typeof vi.fn>
      }
      renderer: {
        domElement: HTMLCanvasElement
      }
      pickWorkspaceSelection: (clientX: number, clientY: number) => unknown
      setSelectedTopologyEntity: (entity: {
        kind: 'edge' | 'point' | 'face'
        partKey: string
        edgeId?: string
        pointId?: string
        faceId?: string
        bodyId: string
      } | null) => void
      setHoveredTopologyEntity: (entity: {
        kind: 'edge' | 'point' | 'face'
        partKey: string
        edgeId?: string
        pointId?: string
        faceId?: string
        bodyId: string
      } | null) => void
      setSelectedPart: (partKey: string | null) => void
      setHighlightedPartKeys: (partKeys: string[]) => void
      partSelectionOutlines: Map<string, LineSegments>
      selectedTopologyEntityOverlay: unknown
      hoveredTopologyEntityOverlay: unknown
      selectedBodyOverlay: unknown
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [
          toViewerRenderablePart(
            createTwoTriangleMeshArtifact('part:topology-edge-pick'),
            'part:topology-edge-pick',
            topologyPreview,
          ),
        ],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'wireframe',
      edgeDisplayMode: 'on',
    })

    const mesh = runtime.partMeshes.get('part:topology-edge-pick')
    const semanticOverlay = runtime.semanticEdgeOverlaysByPartKey.get('part:topology-edge-pick')
    const edgeTarget = runtime.topologyEdgePickTargetsByPartKey.get('part:topology-edge-pick')?.[0]
    expect(mesh).toBeInstanceOf(Mesh)
    expect(semanticOverlay).toBeInstanceOf(LineSegments)
    expect(edgeTarget).toBeInstanceOf(LineSegments)

    runtime.renderer.domElement.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))
    runtime.raycaster.intersectObjects = vi.fn(() => [
      { object: mesh, faceIndex: 0 },
      { object: edgeTarget },
    ])

    expect(runtime.pickWorkspaceSelection(400, 300)).toEqual({
      kind: 'part',
      partKey: 'part:topology-edge-pick',
      edgeId: 'edge:bottom',
      topologyBodyId: 'body:1',
    })

    runtime.setSelectedPart('part:topology-edge-pick')
    runtime.setHighlightedPartKeys(['part:topology-edge-pick'])
    const partSelectionOutline = runtime.partSelectionOutlines.get('part:topology-edge-pick')
    expect(partSelectionOutline).toBeInstanceOf(LineSegments)
    expect(partSelectionOutline?.visible).toBe(true)

    runtime.setSelectedTopologyEntity({
      kind: 'edge',
      partKey: 'part:topology-edge-pick',
      edgeId: 'edge:bottom',
      bodyId: 'body:1',
    })
    expect(partSelectionOutline?.visible).toBe(false)
    expect(runtime.selectedTopologyEntityOverlay).toBeInstanceOf(LineSegments)
    const selectedEdgeMaterial = (runtime.selectedTopologyEntityOverlay as LineSegments)
      .material as LineBasicMaterial
    expect(selectedEdgeMaterial.color.getHexString()).toBe(
      DEFAULT_VIEW_SETTINGS.highlights.selectedColor.slice(1),
    )
    expect((semanticOverlay?.material as LineBasicMaterial | undefined)?.color.getHexString()).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.color.slice(1),
    )

    runtime.setSelectedTopologyEntity({
      kind: 'point',
      partKey: 'part:topology-edge-pick',
      pointId: 'point:origin',
      bodyId: 'body:1',
    })
    expect(partSelectionOutline?.visible).toBe(false)
    expect(runtime.selectedTopologyEntityOverlay).toBeInstanceOf(Mesh)
    const selectedPointMaterial = (runtime.selectedTopologyEntityOverlay as Mesh)
      .material as MeshBasicMaterial
    expect(selectedPointMaterial.color.getHexString()).toBe(
      DEFAULT_VIEW_SETTINGS.highlights.selectedColor.slice(1),
    )

    runtime.setSelectedTopologyEntity({
      kind: 'face',
      partKey: 'part:topology-edge-pick',
      faceId: 'face:front',
      bodyId: 'body:1',
    })
    expect(runtime.selectedTopologyEntityOverlay).toBeInstanceOf(Mesh)
    const selectedFaceMaterial = (runtime.selectedTopologyEntityOverlay as Mesh)
      .material as MeshBasicMaterial
    expect(selectedFaceMaterial.color.getHexString()).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.selected.color.slice(1),
    )
    expect(selectedFaceMaterial.opacity).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.selected.opacity,
    )
    expect(runtime.selectedBodyOverlay).toBeNull()

    runtime.setHoveredTopologyEntity({
      kind: 'edge',
      partKey: 'part:topology-edge-pick',
      edgeId: 'edge:bottom',
      bodyId: 'body:1',
    })
    expect(runtime.hoveredTopologyEntityOverlay).toBeInstanceOf(LineSegments)
    const hoveredEdgeMaterial = (runtime.hoveredTopologyEntityOverlay as LineSegments)
      .material as LineBasicMaterial
    expect(hoveredEdgeMaterial.color.getHexString()).toBe(
      DEFAULT_VIEW_SETTINGS.highlights.hoverColor.slice(1),
    )

    runtime.setSelectedTopologyEntity(null)
    expect(partSelectionOutline?.visible).toBe(true)
    expect(runtime.selectedBodyOverlay).toBeInstanceOf(Mesh)
    const selectedBodyMaterial = (runtime.selectedBodyOverlay as Mesh).material as MeshBasicMaterial
    expect(selectedBodyMaterial.color.getHexString()).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.bodySelected.color.slice(1),
    )
    expect(selectedBodyMaterial.opacity).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.bodySelected.opacity,
    )

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      geometryDisplay: {
        ...DEFAULT_VIEW_SETTINGS.geometryDisplay,
        surfaces: {
          ...DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces,
          hover: { color: '#00ffaa', opacity: 0.31 },
          selected: { color: '#ff00aa', opacity: 0.47 },
          bodySelected: { color: '#123abc', opacity: 0.53 },
        },
      },
    })

    runtime.setSelectedTopologyEntity({
      kind: 'face',
      partKey: 'part:topology-edge-pick',
      faceId: 'face:front',
      bodyId: 'body:1',
    })
    const customSelectedFaceMaterial = (runtime.selectedTopologyEntityOverlay as Mesh)
      .material as MeshBasicMaterial
    expect(customSelectedFaceMaterial.color.getHexString()).toBe('ff00aa')
    expect(customSelectedFaceMaterial.opacity).toBe(0.47)

    runtime.setHoveredTopologyEntity({
      kind: 'face',
      partKey: 'part:topology-edge-pick',
      faceId: 'face:front',
      bodyId: 'body:1',
    })
    const customHoveredFaceMaterial = (runtime.hoveredTopologyEntityOverlay as Mesh)
      .material as MeshBasicMaterial
    expect(customHoveredFaceMaterial.color.getHexString()).toBe('00ffaa')
    expect(customHoveredFaceMaterial.opacity).toBe(0.31)

    runtime.setSelectedTopologyEntity(null)
    const customSelectedBodyMaterial = (runtime.selectedBodyOverlay as Mesh)
      .material as MeshBasicMaterial
    expect(customSelectedBodyMaterial.color.getHexString()).toBe('123abc')
    expect(customSelectedBodyMaterial.opacity).toBe(0.53)

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      geometryDisplay: {
        ...DEFAULT_VIEW_SETTINGS.geometryDisplay,
        edges: {
          ...DEFAULT_VIEW_SETTINGS.geometryDisplay.edges,
          hover: { color: '#ffaa00', opacity: 0.44 },
          selected: { color: '#aa00ff', opacity: 0.72 },
        },
      },
    })

    runtime.setSelectedTopologyEntity({
      kind: 'edge',
      partKey: 'part:topology-edge-pick',
      edgeId: 'edge:bottom',
      bodyId: 'body:1',
    })
    const customSelectedEdgeMaterial = (runtime.selectedTopologyEntityOverlay as LineSegments)
      .material as LineBasicMaterial
    expect(customSelectedEdgeMaterial.color.getHexString()).toBe('aa00ff')
    expect(customSelectedEdgeMaterial.opacity).toBe(0.72)

    runtime.setHoveredTopologyEntity({
      kind: 'edge',
      partKey: 'part:topology-edge-pick',
      edgeId: 'edge:bottom',
      bodyId: 'body:1',
    })
    const customHoveredEdgeMaterial = (runtime.hoveredTopologyEntityOverlay as LineSegments)
      .material as LineBasicMaterial
    expect(customHoveredEdgeMaterial.color.getHexString()).toBe('ffaa00')
    expect(customHoveredEdgeMaterial.opacity).toBe(0.44)
  })

  it('keeps material mode on neutral inspection lighting when environment lighting changes', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      renderer: {
        domElement: { style: { filter: string } }
        toneMappingExposure: number
      }
      lightsById: Map<string, unknown>
      materialModeInspectionLight: { visible: boolean; intensity: number; castShadow: boolean }
      partMeshes: Map<
        string,
        {
          geometry: object
          material: {
            color: { getHexString: () => string }
            toneMapped: boolean
            metalness: number
            roughness: number
            emissive: { getHexString: () => string }
            emissiveIntensity: number
          }
        }
      >
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [toViewerRenderablePart(createArtifact('part:material-light-proof', 10))],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )

    const materialModeSettings = {
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'material' as const,
      materials: {
        ...DEFAULT_VIEW_SETTINGS.materials,
        presets: DEFAULT_VIEW_SETTINGS.materials.presets.map((preset) =>
          preset.id === 'default_matte'
            ? {
                ...preset,
                color: '#25a1ff',
                metalness: 1,
                roughness: 0,
                emissive: '#ff8800',
                emissiveIntensity: 2,
              }
            : preset,
        ),
      },
    }

    runtime.applyViewSettings(materialModeSettings)

    const materialModeMesh = runtime.partMeshes.get('part:material-light-proof')
    const firstGeometry = materialModeMesh?.geometry
    const firstMaterial = materialModeMesh?.material
    expect(firstMaterial).toBeInstanceOf(MeshStandardMaterial)
    expect(firstMaterial?.color.getHexString()).toBe('25a1ff')
    expect(firstMaterial?.metalness).toBe(1)
    expect(firstMaterial?.roughness).toBe(0)
    expect(firstMaterial?.emissive.getHexString()).toBe('ff8800')
    expect(firstMaterial?.emissiveIntensity).toBe(2)
    expect(firstMaterial?.toneMapped).toBe(false)
    expect(runtime.renderer.toneMappingExposure).toBe(1)
    expect(runtime.renderer.domElement.style.filter).toBe('')
    expect(runtime.materialModeInspectionLight.visible).toBe(true)
    expect(runtime.materialModeInspectionLight.intensity).toBeGreaterThan(0)
    expect(runtime.materialModeInspectionLight.castShadow).toBe(false)
    expect([...runtime.lightsById.keys()]).toEqual([])

    runtime.applyViewSettings({
      ...materialModeSettings,
      environmentGrade: {
        ...DEFAULT_VIEW_SETTINGS.environmentGrade,
        exposure: 1.8,
        contrast: 1.35,
        highlights: 25,
        shadows: -25,
        temperature: 45,
        tint: -30,
        saturation: 1.75,
      },
      lighting: {
        ...DEFAULT_VIEW_SETTINGS.lighting,
        lights: DEFAULT_VIEW_SETTINGS.lighting.lights.map((light) => ({
          ...light,
          intensity: light.intensity * 4,
        })),
      },
    })

    const changedEnvironmentMesh = runtime.partMeshes.get('part:material-light-proof')
    expect(changedEnvironmentMesh).toBe(materialModeMesh)
    expect(changedEnvironmentMesh?.geometry).toBe(firstGeometry)
    expect(changedEnvironmentMesh?.material).toBe(firstMaterial)
    expect(changedEnvironmentMesh?.material).toBeInstanceOf(MeshStandardMaterial)
    expect(changedEnvironmentMesh?.material.color.getHexString()).toBe('25a1ff')
    expect(changedEnvironmentMesh?.material.metalness).toBe(1)
    expect(changedEnvironmentMesh?.material.roughness).toBe(0)
    expect(runtime.renderer.toneMappingExposure).toBe(1)
    expect(runtime.renderer.domElement.style.filter).toBe('')
    expect(runtime.materialModeInspectionLight.visible).toBe(true)
    expect([...runtime.lightsById.keys()]).toEqual([])

    runtime.applyViewSettings({
      ...materialModeSettings,
      displayMode: 'rendered',
    })

    const renderedMesh = runtime.partMeshes.get('part:material-light-proof')
    expect(renderedMesh).toBe(materialModeMesh)
    expect(renderedMesh?.geometry).toBe(firstGeometry)
    expect(renderedMesh?.material).toBeInstanceOf(MeshStandardMaterial)
    expect(renderedMesh?.material.color.getHexString()).toBe('25a1ff')
    expect(renderedMesh?.material.metalness).toBe(1)
    expect(renderedMesh?.material.roughness).toBe(0)
    expect(runtime.materialModeInspectionLight.visible).toBe(false)
    expect([...runtime.lightsById.keys()]).toEqual(['key', 'fill', 'rim'])
    expect(runtime.renderer.toneMappingExposure).toBe(
      DEFAULT_VIEW_SETTINGS.environmentGrade.exposure,
    )
    expect(runtime.renderer.domElement.style.filter).toContain('brightness(')
  })

  it('keeps rendered scene polish behind rendered and render-preview display modes', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      renderer: { shadowMap: { enabled: boolean } }
      groundPlane: { visible: boolean }
      partMeshes: Map<string, { castShadow: boolean; receiveShadow: boolean }>
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [toViewerRenderablePart(createArtifact('part:scene-polish-proof', 10))],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )

    const scenePolishSettings = {
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'rendered' as const,
      shadowsEnabled: true,
      ground: {
        enabled: true,
        height: 0,
        materialPresetId: 'matte_mid' as const,
      },
    }

    runtime.applyViewSettings(scenePolishSettings)

    expect(runtime.renderer.shadowMap.enabled).toBe(true)
    expect(runtime.groundPlane.visible).toBe(true)
    expect(runtime.partMeshes.get('part:scene-polish-proof')?.castShadow).toBe(true)
    expect(runtime.partMeshes.get('part:scene-polish-proof')?.receiveShadow).toBe(true)

    runtime.applyViewSettings({
      ...scenePolishSettings,
      displayMode: 'material',
    })

    expect(runtime.renderer.shadowMap.enabled).toBe(false)
    expect(runtime.groundPlane.visible).toBe(false)
    expect(runtime.partMeshes.get('part:scene-polish-proof')?.castShadow).toBe(false)
    expect(runtime.partMeshes.get('part:scene-polish-proof')?.receiveShadow).toBe(false)

    runtime.applyViewSettings({
      ...scenePolishSettings,
      displayMode: 'renderPreview',
    })

    expect(runtime.renderer.shadowMap.enabled).toBe(true)
    expect(runtime.groundPlane.visible).toBe(true)
    expect(runtime.partMeshes.get('part:scene-polish-proof')?.castShadow).toBe(true)
    expect(runtime.partMeshes.get('part:scene-polish-proof')?.receiveShadow).toBe(true)
  })

  it('reports render-preview sample progress and completion from the backend adapter', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')

    const statuses: unknown[] = []
    const runtimeCalls = {
      start: vi.fn(),
      renderSample: vi.fn(),
      reset: vi.fn(),
      dispose: vi.fn(),
    }
    let samples = 0
    setRenderPreviewRuntimeFactoryForTests(() => ({
      targetSamples: 3,
      isSupported: true,
      unsupportedReason: null,
      start: runtimeCalls.start,
      renderSample: runtimeCalls.renderSample.mockImplementation(() => {
        samples = Math.min(3, samples + 1)
        return {
          completedSamples: samples,
          targetSamples: 3,
          complete: samples >= 3,
        }
      }),
      reset: runtimeCalls.reset.mockImplementation(() => {
        samples = 0
      }),
      updateCamera: vi.fn(),
      updateMaterials: vi.fn(),
      updateEnvironment: vi.fn(),
      updateLights: vi.fn(),
      dispose: runtimeCalls.dispose,
    }))

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      setOnRenderPreviewStatusChange: (handler: (status: unknown) => void) => void
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
    }
    runtime.setOnRenderPreviewStatusChange((status) => statuses.push(status))
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
    })

    runtime.renderLoop()
    runtime.renderLoop()
    runtime.renderLoop()

    expect(runtimeCalls.start).toHaveBeenCalled()
    expect(runtimeCalls.renderSample).toHaveBeenCalledTimes(3)
    expect(statuses).toContainEqual({
      status: 'rendering',
      completedSamples: 0,
      targetSamples: 3,
    })
    expect(statuses).toContainEqual({
      status: 'rendering',
      completedSamples: 1,
      targetSamples: 3,
    })
    expect(statuses).toContainEqual({
      status: 'complete',
      completedSamples: 3,
      targetSamples: 3,
    })
  })

  it('maps render-preview quality settings into runtime adapter settings', async () => {
    const {
      resolveRenderPreviewRuntimeAdapterSettings,
    } = await import('./renderPreviewRuntime')

    expect(
      resolveRenderPreviewRuntimeAdapterSettings({
        targetSamples: 128,
        bounces: 9,
        renderScale: 0.75,
        noiseCleanup: 'medium',
        gpuLoad: 'smooth',
      }),
    ).toEqual({
      targetSamples: 128,
      bounces: 9,
      renderScale: 0.75,
      filterGlossyFactor: 0.5,
      tiles: { x: 4, y: 4 },
    })
    expect(
      resolveRenderPreviewRuntimeAdapterSettings({
        targetSamples: 32,
        bounces: 2,
        renderScale: 0.5,
        noiseCleanup: 'high',
        gpuLoad: 'fast',
      }),
    ).toEqual({
      targetSamples: 32,
      bounces: 2,
      renderScale: 0.5,
      filterGlossyFactor: 1,
      tiles: { x: 1, y: 1 },
    })
  })

  it('passes selected render-preview settings into the runtime and HUD target', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')

    const statuses: unknown[] = []
    const factoryCalls: unknown[] = []
    setRenderPreviewRuntimeFactoryForTests((options) => {
      factoryCalls.push(options)
      const targetSamples = options.settings?.targetSamples ?? options.targetSamples ?? 64
      return {
        targetSamples,
        isSupported: true,
        unsupportedReason: null,
        start: vi.fn(),
        renderSample: vi.fn(() => ({
          completedSamples: targetSamples,
          targetSamples,
          complete: true,
        })),
        reset: vi.fn(),
        updateCamera: vi.fn(),
        updateMaterials: vi.fn(),
        updateEnvironment: vi.fn(),
        updateLights: vi.fn(),
        dispose: vi.fn(),
      }
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      setOnRenderPreviewStatusChange: (handler: (status: unknown) => void) => void
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
    }
    runtime.setOnRenderPreviewStatusChange((status) => statuses.push(status))
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
      renderPreview: {
        targetSamples: 128,
        bounces: 9,
        renderScale: 0.75,
        noiseCleanup: 'medium',
        gpuLoad: 'smooth',
      },
    })

    expect(factoryCalls).toHaveLength(1)
    expect(factoryCalls[0]).toMatchObject({
      settings: {
        targetSamples: 128,
        bounces: 9,
        renderScale: 0.75,
        noiseCleanup: 'medium',
        gpuLoad: 'smooth',
      },
    })
    expect(statuses).toContainEqual({
      status: 'rendering',
      completedSamples: 0,
      targetSamples: 128,
    })
  })

  it('recreates render-preview runtime and restarts accumulation when quality changes', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')

    const statuses: unknown[] = []
    const runtimeDisposes: ReturnType<typeof vi.fn>[] = []
    setRenderPreviewRuntimeFactoryForTests((options) => {
      const targetSamples = options.settings?.targetSamples ?? options.targetSamples ?? 64
      const dispose = vi.fn()
      runtimeDisposes.push(dispose)
      return {
        targetSamples,
        isSupported: true,
        unsupportedReason: null,
        start: vi.fn(),
        renderSample: vi.fn(() => ({
          completedSamples: 1,
          targetSamples,
          complete: false,
        })),
        reset: vi.fn(),
        updateCamera: vi.fn(),
        updateMaterials: vi.fn(),
        updateEnvironment: vi.fn(),
        updateLights: vi.fn(),
        dispose,
      }
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      setOnRenderPreviewStatusChange: (handler: (status: unknown) => void) => void
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
    }
    runtime.setOnRenderPreviewStatusChange((status) => statuses.push(status))
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
      renderPreview: {
        ...DEFAULT_VIEW_SETTINGS.renderPreview,
        targetSamples: 64,
      },
    })
    runtime.renderLoop()
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
      renderPreview: {
        ...DEFAULT_VIEW_SETTINGS.renderPreview,
        targetSamples: 128,
      },
    })

    expect(runtimeDisposes).toHaveLength(2)
    expect(runtimeDisposes[0]).toHaveBeenCalled()
    expect(statuses).toContainEqual({
      status: 'rendering',
      completedSamples: 0,
      targetSamples: 128,
    })
  })

  it('restarts active render preview when a quality preset changes settings', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS, createRenderPreviewQualityPresetSettings } = await import(
      '../shared/viewSettingsTypes'
    )
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')

    const statuses: unknown[] = []
    const runtimeDisposes: ReturnType<typeof vi.fn>[] = []
    const factorySettings: unknown[] = []
    setRenderPreviewRuntimeFactoryForTests((options) => {
      factorySettings.push(options.settings)
      const targetSamples = options.settings?.targetSamples ?? options.targetSamples ?? 64
      const dispose = vi.fn()
      runtimeDisposes.push(dispose)
      return {
        targetSamples,
        isSupported: true,
        unsupportedReason: null,
        start: vi.fn(),
        renderSample: vi.fn(() => ({
          completedSamples: 1,
          targetSamples,
          complete: false,
        })),
        reset: vi.fn(),
        updateCamera: vi.fn(),
        updateMaterials: vi.fn(),
        updateEnvironment: vi.fn(),
        updateLights: vi.fn(),
        dispose,
      }
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      setOnRenderPreviewStatusChange: (handler: (status: unknown) => void) => void
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
    }
    runtime.setOnRenderPreviewStatusChange((status) => statuses.push(status))
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
      renderPreview: createRenderPreviewQualityPresetSettings('fast'),
    })
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
      renderPreview: createRenderPreviewQualityPresetSettings('clean'),
    })

    expect(factorySettings).toEqual([
      createRenderPreviewQualityPresetSettings('fast'),
      createRenderPreviewQualityPresetSettings('clean'),
    ])
    expect(runtimeDisposes).toHaveLength(2)
    expect(runtimeDisposes[0]).toHaveBeenCalled()
    expect(statuses).toContainEqual({
      status: 'rendering',
      completedSamples: 0,
      targetSamples: 128,
    })
  })

  it('does not create render-preview runtime when quality changes outside render-preview mode', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')

    const runtimeFactory = vi.fn((options) => ({
      targetSamples: options.settings?.targetSamples ?? options.targetSamples ?? 64,
      isSupported: true,
      unsupportedReason: null,
      start: vi.fn(),
      renderSample: vi.fn(),
      reset: vi.fn(),
      updateCamera: vi.fn(),
      updateMaterials: vi.fn(),
      updateEnvironment: vi.fn(),
      updateLights: vi.fn(),
      dispose: vi.fn(),
    }))
    setRenderPreviewRuntimeFactoryForTests(runtimeFactory)

    container = document.createElement('div')
    document.body.appendChild(container)
    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
    }
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'rendered',
      renderPreview: {
        ...DEFAULT_VIEW_SETTINGS.renderPreview,
        targetSamples: 64,
      },
    })
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'rendered',
      renderPreview: {
        ...DEFAULT_VIEW_SETTINGS.renderPreview,
        targetSamples: 128,
      },
    })

    expect(runtimeFactory).not.toHaveBeenCalled()
  })

  it('resets render-preview progress for scene and camera changes, then disposes on exit', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')

    const runtimeCalls = {
      start: vi.fn(),
      renderSample: vi.fn(),
      reset: vi.fn(),
      dispose: vi.fn(),
    }
    let samples = 0
    setRenderPreviewRuntimeFactoryForTests(({ targetSamples = 64 }) => ({
      targetSamples,
      isSupported: true,
      unsupportedReason: null,
      start: runtimeCalls.start.mockImplementation(() => {
        samples = 0
      }),
      renderSample: runtimeCalls.renderSample.mockImplementation(() => {
        samples = Math.min(targetSamples, samples + 1)
        return {
          completedSamples: samples,
          targetSamples,
          complete: samples >= targetSamples,
        }
      }),
      reset: runtimeCalls.reset.mockImplementation(() => {
        samples = 0
      }),
      updateCamera: vi.fn(),
      updateMaterials: vi.fn(),
      updateEnvironment: vi.fn(),
      updateLights: vi.fn(),
      dispose: runtimeCalls.dispose,
    }))

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      setOnCameraPoseChange: (handler: (pose: unknown) => void) => void
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      renderLoop: () => void
    }
    runtime.setOnCameraPoseChange(() => {})
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
    })
    runtime.renderLoop()

    runtime.setViewportRenderLayers(
      {
        baseParts: [toViewerRenderablePart(createArtifact('part:render-preview-reset', 10))],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )

    const controller = cameraControllerMocks.instances[0]!
    controller.perspectiveFovDeg = 55
    runtime.renderLoop()

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'rendered',
    })

    expect(runtimeCalls.reset).toHaveBeenCalled()
    expect(runtimeCalls.dispose).toHaveBeenCalled()
  })

  it('reports unsupported render preview without blocking raster rendering fallback', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')

    const statuses: unknown[] = []
    setRenderPreviewRuntimeFactoryForTests(({ targetSamples = 64 }) => ({
      targetSamples,
      isSupported: false,
      unsupportedReason: 'WebGL2 is unavailable',
      start: vi.fn(),
      renderSample: vi.fn(() => ({
        completedSamples: 0,
        targetSamples,
        complete: false,
      })),
      reset: vi.fn(),
      updateCamera: vi.fn(),
      updateMaterials: vi.fn(),
      updateEnvironment: vi.fn(),
      updateLights: vi.fn(),
      dispose: vi.fn(),
    }))

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      setOnRenderPreviewStatusChange: (handler: (status: unknown) => void) => void
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
      renderer: { render: () => void }
    }
    const rasterRenderSpy = vi.spyOn(runtime.renderer, 'render')
    runtime.setOnRenderPreviewStatusChange((status) => statuses.push(status))
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
    })
    runtime.renderLoop()

    expect(statuses).toContainEqual({
      status: 'unsupported',
      message: 'WebGL2 is unavailable',
    })
    expect(rasterRenderSpy).toHaveBeenCalled()
  })

  it('keeps direct raster rendering as the default post-processing fallback path', async () => {
    const { Viewer } = await import('./Viewer')
    const { setViewerPostProcessingRuntimeFactoryForTests } = await import('./postProcessingRuntime')

    const runtimeFactory = vi.fn()
    setViewerPostProcessingRuntimeFactoryForTests(runtimeFactory)

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      renderLoop: () => void
      renderer: { render: () => void }
    }
    const rasterRenderSpy = vi.spyOn(runtime.renderer, 'render')
    runtime.renderLoop()

    expect(runtimeFactory).not.toHaveBeenCalled()
    expect(rasterRenderSpy).toHaveBeenCalled()
  })

  it('routes enabled post-processing through a disposable, resizable runtime', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setViewerPostProcessingRuntimeFactoryForTests } = await import('./postProcessingRuntime')

    const postProcessingRuntime = {
      isAvailable: vi.fn(() => true),
      render: vi.fn(),
      setSize: vi.fn(),
      updateSettings: vi.fn(() => true),
      dispose: vi.fn(),
    }
    const runtimeFactory = vi.fn(() => postProcessingRuntime)
    setViewerPostProcessingRuntimeFactoryForTests(runtimeFactory)

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
      renderer: { render: () => void }
    }
    const rasterRenderSpy = vi.spyOn(runtime.renderer, 'render')
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao' as const,
        ssaoEnabled: true,
      },
    })

    runtime.renderLoop()

    expect(runtimeFactory).toHaveBeenCalledTimes(1)
    expect(postProcessingRuntime.setSize).toHaveBeenCalledWith(800, 600)
    expect(postProcessingRuntime.render).toHaveBeenCalledTimes(1)
    expect(rasterRenderSpy).not.toHaveBeenCalled()

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 512,
    })
    resizeObserverCallback?.([], {} as ResizeObserver)

    expect(postProcessingRuntime.setSize).toHaveBeenCalledWith(1024, 512)

    viewer.dispose()
    viewer = null

    expect(postProcessingRuntime.dispose).toHaveBeenCalled()
  })

  it('keeps post-processing disabled when the AO type is Off', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setViewerPostProcessingRuntimeFactoryForTests } = await import('./postProcessingRuntime')

    const runtimeFactory = vi.fn()
    setViewerPostProcessingRuntimeFactoryForTests(runtimeFactory)

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
      renderer: { render: () => void }
    }
    const rasterRenderSpy = vi.spyOn(runtime.renderer, 'render')
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'off',
        ssaoEnabled: true,
      },
    })
    runtime.renderLoop()

    expect(runtimeFactory).not.toHaveBeenCalled()
    expect(rasterRenderSpy).toHaveBeenCalled()
  })

  it('passes normalized SSAO settings into the post-processing runtime and updates them live', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setViewerPostProcessingRuntimeFactoryForTests } = await import('./postProcessingRuntime')

    const postProcessingRuntime = {
      isAvailable: vi.fn(() => true),
      render: vi.fn(),
      setSize: vi.fn(),
      updateSettings: vi.fn(() => true),
      dispose: vi.fn(),
    }
    const runtimeFactory = vi.fn(() => postProcessingRuntime)
    setViewerPostProcessingRuntimeFactoryForTests(runtimeFactory)

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
    }
    const enabledSettings = {
      aoType: 'basicSsao' as const,
      ssaoEnabled: true,
      ssaoIntensity: 1.5,
      ssaoRadius: 1.25,
      ssaoQuality: 'medium' as const,
      ssaoContactBias: 0.004,
      ssaoDistanceThreshold: 0.14,
    }
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      postProcessing: enabledSettings,
    })
    runtime.renderLoop()

    expect(runtimeFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        postProcessing: enabledSettings,
      }),
    )

    const updatedSettings = {
      aoType: 'basicSsao' as const,
      ssaoEnabled: true,
      ssaoIntensity: 2,
      ssaoRadius: 2.5,
      ssaoQuality: 'medium' as const,
      ssaoContactBias: 0.006,
      ssaoDistanceThreshold: 0.2,
    }
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      postProcessing: updatedSettings,
    })

    expect(postProcessingRuntime.updateSettings).toHaveBeenCalledWith(updatedSettings)
    expect(postProcessingRuntime.dispose).not.toHaveBeenCalled()
  })

  it('recreates the post-processing runtime when SSAO quality requires a new kernel', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setViewerPostProcessingRuntimeFactoryForTests } = await import('./postProcessingRuntime')

    const firstRuntime = {
      isAvailable: vi.fn(() => true),
      render: vi.fn(),
      setSize: vi.fn(),
      updateSettings: vi.fn(() => false),
      dispose: vi.fn(),
    }
    const secondRuntime = {
      isAvailable: vi.fn(() => true),
      render: vi.fn(),
      setSize: vi.fn(),
      updateSettings: vi.fn(() => true),
      dispose: vi.fn(),
    }
    const runtimeFactory = vi
      .fn()
      .mockReturnValueOnce(firstRuntime)
      .mockReturnValueOnce(secondRuntime)
    setViewerPostProcessingRuntimeFactoryForTests(runtimeFactory)

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
    }
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao' as const,
        ssaoEnabled: true,
        ssaoQuality: 'medium',
      },
    })
    runtime.renderLoop()
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao',
        ssaoEnabled: true,
        ssaoQuality: 'high',
      },
    })
    runtime.renderLoop()

    expect(firstRuntime.updateSettings).toHaveBeenCalled()
    expect(firstRuntime.dispose).toHaveBeenCalled()
    expect(runtimeFactory).toHaveBeenCalledTimes(2)
    expect(secondRuntime.render).toHaveBeenCalled()
  })

  it('maps SSAO quality, radius, bias, and threshold onto the Three.js SSAO pass', async () => {
    const { createViewerPostProcessingRuntime } = await import('./postProcessingRuntime')
    const { Scene, PerspectiveCamera, WebGLRenderer } = await import('three')

    const scene = new Scene()
    const camera = new PerspectiveCamera()
    const renderer = new WebGLRenderer()
    const runtime = createViewerPostProcessingRuntime({
      renderer,
      scene,
      camera,
      postProcessing: {
        aoType: 'basicSsao',
        ssaoEnabled: true,
        ssaoIntensity: 2,
        ssaoRadius: 1.5,
        ssaoQuality: 'high',
        ssaoContactBias: 0.007,
        ssaoDistanceThreshold: 0.19,
      },
    })

    const ssaoPass = postProcessingExampleMocks.ssaoPasses[0]!
    expect(ssaoPass.kernelSize).toBe(64)
    expect(ssaoPass.kernelRadius).toBe(12)
    expect(ssaoPass.minDistance).toBeCloseTo(0.007, 6)
    expect(ssaoPass.maxDistance).toBeCloseTo(0.19, 6)
    expect(postProcessingExampleMocks.composers[0]?.passes).toEqual([
      postProcessingExampleMocks.renderPasses[0],
      ssaoPass,
      postProcessingExampleMocks.outputPasses[0],
    ])

    expect(
      runtime.updateSettings({
        aoType: 'basicSsao',
        ssaoEnabled: true,
        ssaoIntensity: 1,
        ssaoRadius: 0.5,
        ssaoQuality: 'high',
        ssaoContactBias: 0.003,
        ssaoDistanceThreshold: 0.1,
      }),
    ).toBe(true)
    expect(ssaoPass.kernelRadius).toBe(4)
    expect(ssaoPass.minDistance).toBeCloseTo(0.003, 6)
    expect(ssaoPass.maxDistance).toBeCloseTo(0.1, 6)

    expect(
      runtime.updateSettings({
        aoType: 'basicSsao',
        ssaoEnabled: true,
        ssaoIntensity: 1,
        ssaoRadius: 0.5,
        ssaoQuality: 'low',
        ssaoContactBias: 0.003,
        ssaoDistanceThreshold: 0.1,
      }),
    ).toBe(false)

    runtime.dispose()
    expect(ssaoPass.dispose).toHaveBeenCalled()
    expect(postProcessingExampleMocks.composers[0]?.dispose).toHaveBeenCalled()
  })

  it('maps SAO settings onto the Three.js SAO pass', async () => {
    const { createViewerPostProcessingRuntime } = await import('./postProcessingRuntime')
    const { Scene, PerspectiveCamera, WebGLRenderer } = await import('three')

    const scene = new Scene()
    const camera = new PerspectiveCamera()
    const renderer = new WebGLRenderer()
    const runtime = createViewerPostProcessingRuntime({
      renderer,
      scene,
      camera,
      postProcessing: {
        aoType: 'sao',
        ssaoEnabled: true,
        ssaoIntensity: 2,
        ssaoRadius: 1.5,
        ssaoQuality: 'high',
        ssaoContactBias: 0.007,
        ssaoDistanceThreshold: 0.19,
      },
    })

    const saoPass = postProcessingExampleMocks.saoPasses[0]!
    expect(postProcessingExampleMocks.ssaoPasses).toHaveLength(0)
    expect(saoPass.params.saoIntensity).toBeCloseTo(0.36, 6)
    expect(saoPass.params.saoScale).toBeCloseTo(1.9, 6)
    expect(saoPass.params.saoKernelRadius).toBeCloseTo(48, 6)
    expect(saoPass.params.saoBlurRadius).toBe(12)
    expect(postProcessingExampleMocks.composers[0]?.passes).toEqual([
      postProcessingExampleMocks.renderPasses[0],
      saoPass,
      postProcessingExampleMocks.outputPasses[0],
    ])

    runtime.setSize(320, 240)
    expect(saoPass.setSize).toHaveBeenCalledWith(320, 240)

    expect(
      runtime.updateSettings({
        aoType: 'sao',
        ssaoEnabled: true,
        ssaoIntensity: 1,
        ssaoRadius: 0.5,
        ssaoQuality: 'low',
        ssaoContactBias: 0.003,
        ssaoDistanceThreshold: 0.1,
      }),
    ).toBe(true)
    expect(saoPass.params.saoIntensity).toBeCloseTo(0.18, 6)
    expect(saoPass.params.saoKernelRadius).toBeCloseTo(16, 6)
    expect(saoPass.params.saoBlurRadius).toBe(4)

    expect(
      runtime.updateSettings({
        aoType: 'basicSsao',
        ssaoEnabled: true,
        ssaoIntensity: 1,
        ssaoRadius: 0.5,
        ssaoQuality: 'low',
        ssaoContactBias: 0.003,
        ssaoDistanceThreshold: 0.1,
      }),
    ).toBe(false)

    runtime.dispose()
    expect(saoPass.dispose).toHaveBeenCalled()
    expect(postProcessingExampleMocks.composers[0]?.dispose).toHaveBeenCalled()
  })

  it('falls back to direct raster rendering when post-processing setup fails', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setViewerPostProcessingRuntimeFactoryForTests } = await import('./postProcessingRuntime')

    setViewerPostProcessingRuntimeFactoryForTests(() => {
      throw new Error('composer unavailable')
    })

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
      renderer: { render: () => void }
    }
    const rasterRenderSpy = vi.spyOn(runtime.renderer, 'render')
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao',
        ssaoEnabled: true,
      },
    })

    expect(() => runtime.renderLoop()).not.toThrow()
    expect(rasterRenderSpy).toHaveBeenCalled()
  })

  it('keeps render preview ahead of the post-processing path', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')
    const { setRenderPreviewRuntimeFactoryForTests } = await import('./renderPreviewRuntime')
    const { setViewerPostProcessingRuntimeFactoryForTests } = await import('./postProcessingRuntime')

    const postProcessingRuntimeFactory = vi.fn()
    const renderSample = vi.fn(() => ({
      completedSamples: 1,
      targetSamples: 64,
      complete: false,
    }))
    setViewerPostProcessingRuntimeFactoryForTests(postProcessingRuntimeFactory)
    setRenderPreviewRuntimeFactoryForTests(({ targetSamples = 64 }) => ({
      targetSamples,
      isSupported: true,
      unsupportedReason: null,
      start: vi.fn(),
      renderSample,
      reset: vi.fn(),
      updateCamera: vi.fn(),
      updateMaterials: vi.fn(),
      updateEnvironment: vi.fn(),
      updateLights: vi.fn(),
      dispose: vi.fn(),
    }))

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
    }
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'renderPreview',
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao',
        ssaoEnabled: true,
      },
    })

    runtime.renderLoop()

    expect(renderSample).toHaveBeenCalled()
    expect(postProcessingRuntimeFactory).not.toHaveBeenCalled()
  })

  it('preserves topology selection and hover overlay contracts while SSAO is enabled', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const topologyPreview = {
      faces: [{ faceId: 'face:front', bodyId: 'body:1' }],
      triangleFaceIds: ['face:front', 'face:front'],
      edges: [
        {
          edgeId: 'edge:bottom',
          bodyId: 'body:1',
          faceIds: ['face:front'],
          polyline: [
            0, 0, 0,
            1, 0, 0,
          ],
        },
      ],
      points: [
        {
          pointId: 'point:origin',
          bodyId: 'body:1',
          position: [0, 0, 0] as [number, number, number],
        },
      ],
    }

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      setSelectedTopologyEntity: (entity: {
        kind: 'edge' | 'point' | 'face'
        partKey: string
        edgeId?: string
        pointId?: string
        faceId?: string
        bodyId: string
      } | null) => void
      setHoveredTopologyEntity: (entity: {
        kind: 'edge' | 'point' | 'face'
        partKey: string
        edgeId?: string
        pointId?: string
        faceId?: string
        bodyId: string
      } | null) => void
      selectedTopologyEntityOverlay: unknown
      hoveredTopologyEntityOverlay: unknown
      selectedBodyOverlay: unknown
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [
          toViewerRenderablePart(
            createTwoTriangleMeshArtifact('part:ssao-topology-overlay'),
            'part:ssao-topology-overlay',
            topologyPreview,
          ),
        ],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      'part:ssao-topology-overlay',
    )
    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'rendered',
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao',
        ssaoEnabled: true,
      },
    })
    runtime.renderLoop()

    expect(postProcessingExampleMocks.ssaoPasses).toHaveLength(1)

    runtime.setSelectedTopologyEntity({
      kind: 'face',
      partKey: 'part:ssao-topology-overlay',
      faceId: 'face:front',
      bodyId: 'body:1',
    })
    const selectedFace = runtime.selectedTopologyEntityOverlay as Mesh
    const selectedFaceMaterial = selectedFace.material as MeshBasicMaterial
    expect(selectedFace).toBeInstanceOf(Mesh)
    expect(selectedFace.renderOrder).toBe(130)
    expect(selectedFace.userData.selectionOverlay).toBe(true)
    expect(selectedFaceMaterial.depthTest).toBe(false)
    expect(selectedFaceMaterial.depthWrite).toBe(false)
    expect(selectedFaceMaterial.toneMapped).toBe(false)

    runtime.setHoveredTopologyEntity({
      kind: 'face',
      partKey: 'part:ssao-topology-overlay',
      faceId: 'face:front',
      bodyId: 'body:1',
    })
    const hoveredFace = runtime.hoveredTopologyEntityOverlay as Mesh
    const hoveredFaceMaterial = hoveredFace.material as MeshBasicMaterial
    expect(hoveredFace).toBeInstanceOf(Mesh)
    expect(hoveredFace.renderOrder).toBe(132)
    expect(hoveredFace.userData.hoverOverlay).toBe(true)
    expect(hoveredFaceMaterial.depthTest).toBe(false)
    expect(hoveredFaceMaterial.depthWrite).toBe(false)
    expect(hoveredFaceMaterial.toneMapped).toBe(false)

    runtime.setSelectedTopologyEntity({
      kind: 'edge',
      partKey: 'part:ssao-topology-overlay',
      edgeId: 'edge:bottom',
      bodyId: 'body:1',
    })
    const selectedEdge = runtime.selectedTopologyEntityOverlay as LineSegments
    const selectedEdgeMaterial = selectedEdge.material as LineBasicMaterial
    expect(selectedEdge).toBeInstanceOf(LineSegments)
    expect(selectedEdge.renderOrder).toBe(135)
    expect(selectedEdge.userData.selectionOverlay).toBe(true)
    expect(selectedEdgeMaterial.depthTest).toBe(false)
    expect(selectedEdgeMaterial.depthWrite).toBe(false)
    expect(selectedEdgeMaterial.toneMapped).toBe(false)

    runtime.setHoveredTopologyEntity({
      kind: 'point',
      partKey: 'part:ssao-topology-overlay',
      pointId: 'point:origin',
      bodyId: 'body:1',
    })
    const hoveredPoint = runtime.hoveredTopologyEntityOverlay as Mesh
    const hoveredPointMaterial = hoveredPoint.material as MeshBasicMaterial
    expect(hoveredPoint).toBeInstanceOf(Mesh)
    expect(hoveredPoint.renderOrder).toBe(142)
    expect(hoveredPoint.userData.hoverOverlay).toBe(true)
    expect(hoveredPointMaterial.depthTest).toBe(false)
    expect(hoveredPointMaterial.depthWrite).toBe(false)
    expect(hoveredPointMaterial.toneMapped).toBe(false)

    runtime.setSelectedTopologyEntity(null)
    const selectedBody = runtime.selectedBodyOverlay as Mesh
    const selectedBodyMaterial = selectedBody.material as MeshBasicMaterial
    expect(selectedBody).toBeInstanceOf(Mesh)
    expect(selectedBody.renderOrder).toBe(128)
    expect(selectedBody.userData.selectionOverlay).toBe(true)
    expect(selectedBodyMaterial.depthTest).toBe(false)
    expect(selectedBodyMaterial.depthWrite).toBe(false)
    expect(selectedBodyMaterial.toneMapped).toBe(false)
  })

  it('preserves display-edge depth behavior while SSAO is enabled', async () => {
    const { Viewer } = await import('./Viewer')
    const { toViewerRenderablePart } = await import('../shared/buildTypes')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
      setViewportRenderLayers: (
        layers: {
          baseParts: unknown[]
          baselineParts: unknown[]
          overlayParts: unknown[]
          overlayOpacity: number
          baselineStyle: { opacity: number; color: string }
        },
        visibility: Record<string, boolean>,
        selectedPartKey?: string | null,
      ) => void
      meshEdgeWireframeOverlaysByPartKey: Map<string, LineSegments[]>
    }

    runtime.setViewportRenderLayers(
      {
        baseParts: [toViewerRenderablePart(createArtifact('part:ssao-edge-display', 10))],
        baselineParts: [],
        overlayParts: [],
        baselineStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      {},
      null,
    )

    const ssaoSettings = {
      ...DEFAULT_VIEW_SETTINGS,
      displayMode: 'rendered' as const,
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao' as const,
        ssaoEnabled: true,
      },
    }

    runtime.applyViewSettings({
      ...ssaoSettings,
      edgeDisplayMode: 'on',
      geometryDisplay: {
        ...DEFAULT_VIEW_SETTINGS.geometryDisplay,
        edges: {
          ...DEFAULT_VIEW_SETTINGS.geometryDisplay.edges,
          color: '#00ffaa',
          opacity: 0.37,
          depthMode: 'xray',
        },
      },
    })
    runtime.renderLoop()

    const xrayOverlay = runtime.meshEdgeWireframeOverlaysByPartKey.get('part:ssao-edge-display')?.[0]
    const xrayOverlayMaterial = xrayOverlay?.material as LineBasicMaterial | undefined
    expect(postProcessingExampleMocks.ssaoPasses).toHaveLength(1)
    expect(xrayOverlay?.visible).toBe(true)
    expect(xrayOverlayMaterial?.color.getHexString()).toBe('00ffaa')
    expect(xrayOverlayMaterial?.opacity).toBe(0.37)
    expect(xrayOverlayMaterial?.depthTest).toBe(false)
    expect(xrayOverlayMaterial?.toneMapped).toBe(false)

    runtime.applyViewSettings({
      ...ssaoSettings,
      edgeDisplayMode: 'visibleEdgesOnly',
      geometryDisplay: {
        ...DEFAULT_VIEW_SETTINGS.geometryDisplay,
        edges: {
          ...DEFAULT_VIEW_SETTINGS.geometryDisplay.edges,
          color: '#ff00aa',
          opacity: 0.51,
          depthMode: 'xray',
        },
      },
    })

    const visibleOnlyOverlay =
      runtime.meshEdgeWireframeOverlaysByPartKey.get('part:ssao-edge-display')?.[0]
    const visibleOnlyMaterial = visibleOnlyOverlay?.material as LineBasicMaterial | undefined
    expect(visibleOnlyOverlay?.visible).toBe(true)
    expect(visibleOnlyMaterial?.color.getHexString()).toBe('ff00aa')
    expect(visibleOnlyMaterial?.opacity).toBe(0.51)
    expect(visibleOnlyMaterial?.depthTest).toBe(true)
    expect(visibleOnlyMaterial?.toneMapped).toBe(false)

    runtime.applyViewSettings({
      ...ssaoSettings,
      edgeDisplayMode: 'on',
      geometryDisplay: {
        ...DEFAULT_VIEW_SETTINGS.geometryDisplay,
        edges: {
          ...DEFAULT_VIEW_SETTINGS.geometryDisplay.edges,
          mode: 'all',
          color: '#123abc',
          opacity: 0.44,
          depthMode: 'surface',
        },
      },
    })

    const surfaceDepthOverlay =
      runtime.meshEdgeWireframeOverlaysByPartKey.get('part:ssao-edge-display')?.[0]
    const surfaceDepthMaterial = surfaceDepthOverlay?.material as LineBasicMaterial | undefined
    expect(surfaceDepthOverlay?.visible).toBe(true)
    expect(surfaceDepthMaterial?.color.getHexString()).toBe('123abc')
    expect(surfaceDepthMaterial?.opacity).toBe(0.44)
    expect(surfaceDepthMaterial?.depthTest).toBe(true)

    runtime.applyViewSettings({
      ...ssaoSettings,
      edgeDisplayMode: 'off',
    })

    expect(runtime.meshEdgeWireframeOverlaysByPartKey.get('part:ssao-edge-display')?.[0]?.visible)
      .toBe(false)
  })

  it('preserves sketch and extrude overlay material contracts while SSAO is enabled', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const planeTransform = {
      offsetMm: 0,
      translation: { x: 0, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      inPlaneRotationDeg: 0,
    }
    const profileVertices = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
      { x: 0, y: 0 },
    ]

    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
      setGeometrySketchOverlay: (overlay: unknown) => void
      setExtrudeCommandPreviewOverlay: (overlay: unknown) => void
      geometrySketchOverlayGroup: { renderOrder: number; children: unknown[] }
      extrudeCommandPreviewGroup: { renderOrder: number; children: unknown[] }
    }

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao',
        ssaoEnabled: true,
      },
    })
    runtime.setGeometrySketchOverlay({
      nodeId: 'sketch:ssao-proof',
      mode: 'review',
      plane: 'XY',
      planeTransform,
      drawStage: null,
      activeTool: null,
      components: [],
      profiles: [
        {
          profileId: 'profile:selected',
          vertices: profileVertices,
        },
      ],
      selectedProfileIds: ['profile:selected'],
      hoveredProfileId: null,
      drawDraft: null,
      ui: {
        snapEnabled: true,
        snapDistancePx: 10,
        crosshairSize: 14,
        startPointVisible: false,
        startPointSymbolSize: 8,
        startPointSymbolType: 'crosshair',
        plinePointVisible: false,
        plinePointSymbolSize: 8,
        plinePointSymbolType: 'circle',
      },
    })
    runtime.setExtrudeCommandPreviewOverlay({
      graphDocumentId: 'graph:ssao-proof',
      depthMm: 12,
      profiles: [
        {
          sketchNodeId: 'sketch:ssao-proof',
          profileId: 'profile:selected',
          plane: 'XY',
          planeTransform,
          vertices: profileVertices,
        },
      ],
    })
    runtime.renderLoop()

    expect(postProcessingExampleMocks.ssaoPasses).toHaveLength(1)
    expect(runtime.geometrySketchOverlayGroup.renderOrder).toBe(96)
    const sketchChildren = runtime.geometrySketchOverlayGroup.children as Array<Mesh | Line>
    expect(sketchChildren.length).toBeGreaterThanOrEqual(2)
    for (const child of sketchChildren) {
      const material = child.material as MeshBasicMaterial | LineBasicMaterial
      expect(material.depthTest).toBe(false)
      expect(material.toneMapped).toBe(false)
      expect(child.renderOrder).toBeGreaterThanOrEqual(95)
    }

    expect(runtime.extrudeCommandPreviewGroup.renderOrder).toBe(93)
    const extrudeChildren = runtime.extrudeCommandPreviewGroup.children as Array<Mesh | Line>
    expect(extrudeChildren).toHaveLength(4)
    const extrudeMeshes = extrudeChildren.filter((child) => child instanceof Mesh) as Mesh[]
    const extrudeEdges = extrudeChildren.filter((child) => child instanceof Line) as Line[]
    expect(extrudeMeshes).toHaveLength(3)
    expect(extrudeEdges).toHaveLength(1)
    for (const mesh of extrudeMeshes) {
      const material = mesh.material as MeshBasicMaterial
      expect(material.depthTest).toBe(true)
      expect(material.toneMapped).toBe(false)
      expect(mesh.renderOrder).toBeGreaterThanOrEqual(92)
    }
    const edgeMaterial = extrudeEdges[0]?.material as LineBasicMaterial | undefined
    expect(edgeMaterial?.depthTest).toBe(false)
    expect(edgeMaterial?.toneMapped).toBe(false)
    expect(extrudeEdges[0]?.renderOrder).toBe(94)
  })

  it('keeps the axis HUD render outside the SSAO composer path', async () => {
    const { Viewer } = await import('./Viewer')
    const { DEFAULT_VIEW_SETTINGS } = await import('../shared/viewSettingsTypes')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const axisCanvas = document.createElement('canvas')
    const runtime = viewer as unknown as {
      applyViewSettings: (settings: typeof DEFAULT_VIEW_SETTINGS) => void
      renderLoop: () => void
      setAxisOverlayCanvas: (canvas: HTMLCanvasElement | null) => void
    }
    runtime.setAxisOverlayCanvas(axisCanvas)
    const axisGizmo = axisGizmoMocks.instances.at(-1)

    runtime.applyViewSettings({
      ...DEFAULT_VIEW_SETTINGS,
      axisOverlayEnabled: true,
      postProcessing: {
        ...DEFAULT_VIEW_SETTINGS.postProcessing,
        aoType: 'basicSsao',
        ssaoEnabled: true,
      },
    })
    runtime.renderLoop()

    expect(postProcessingExampleMocks.composers[0]?.render).toHaveBeenCalled()
    expect(axisGizmo?.renderFromCameraQuaternion).toHaveBeenCalled()
  })

  it('uses an explicit base fly speed value and keeps boost multiplicative on top of it', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    ;(canvas as HTMLCanvasElement & { requestPointerLock?: () => void }).requestPointerLock = vi.fn()
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!
    ;(viewer as unknown as { clock: { getDelta: () => number } }).clock.getDelta = () => 1

    const flySpeedViewer = viewer as unknown as {
      getFlyMoveSpeed: () => number
      setFlyMoveSpeed: (speed: number) => void
      renderLoop: () => void
    }

    expect(flySpeedViewer.getFlyMoveSpeed()).toBe(4)

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 2,
        buttons: 2,
        pointerId: 11,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }),
    )

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', bubbles: true, cancelable: true }))
    flySpeedViewer.renderLoop()

    const defaultForwardDistance = controller.translateFly.mock.calls[0]?.[0] ?? 0
    expect(defaultForwardDistance).toBeGreaterThan(0)

    flySpeedViewer.setFlyMoveSpeed(8)
    expect(flySpeedViewer.getFlyMoveSpeed()).toBe(8)

    flySpeedViewer.renderLoop()
    const customForwardDistance = controller.translateFly.mock.calls[1]?.[0] ?? 0
    expect(customForwardDistance).toBeGreaterThan(defaultForwardDistance)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true, cancelable: true }))
    flySpeedViewer.renderLoop()

    const boostedForwardDistance = controller.translateFly.mock.calls[2]?.[0] ?? 0
    expect(boostedForwardDistance).toBeGreaterThan(customForwardDistance)

    flySpeedViewer.setFlyMoveSpeed(-5)
    expect(flySpeedViewer.getFlyMoveSpeed()).toBe(0.1)

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', bubbles: true, cancelable: true }))
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', bubbles: true, cancelable: true }))
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        button: 2,
        buttons: 0,
        pointerId: 11,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }),
    )
  })

  it('remaps real canvas wheel events to fly-speed control only while fly mode is active', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    ;(canvas as HTMLCanvasElement & { requestPointerLock?: () => void }).requestPointerLock = vi.fn()
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!
    const flySpeedViewer = viewer as unknown as {
      getFlyMoveSpeed: () => number
      zoomCameraByWheelDelta: (deltaY: number) => void
    }

    flySpeedViewer.zoomCameraByWheelDelta(-120)
    expect(controller.zoomByWheelDelta).toHaveBeenCalledWith(-120)
    expect(flySpeedViewer.getFlyMoveSpeed()).toBe(4)

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 2,
        buttons: 2,
        pointerId: 23,
        clientX: 100,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    )

    const flyWheelUp = new WheelEvent('wheel', {
      deltaY: -120,
      bubbles: true,
      cancelable: true,
    })
    canvas.dispatchEvent(flyWheelUp)
    expect(controller.zoomByWheelDelta).toHaveBeenCalledTimes(1)
    expect(flySpeedViewer.getFlyMoveSpeed()).toBeCloseTo(4.4, 6)
    expect(flyWheelUp.defaultPrevented).toBe(true)

    const flyWheelDown = new WheelEvent('wheel', {
      deltaY: 120,
      bubbles: true,
      cancelable: true,
    })
    canvas.dispatchEvent(flyWheelDown)
    expect(controller.zoomByWheelDelta).toHaveBeenCalledTimes(1)
    expect(flySpeedViewer.getFlyMoveSpeed()).toBeCloseTo(4, 6)
    expect(flyWheelDown.defaultPrevented).toBe(true)

    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        button: 2,
        buttons: 0,
        pointerId: 23,
        clientX: 100,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    )

    flySpeedViewer.zoomCameraByWheelDelta(120)
    expect(controller.zoomByWheelDelta).toHaveBeenCalledTimes(2)
    expect(controller.zoomByWheelDelta).toHaveBeenLastCalledWith(120)
  })

  it('applies fly roll while stationary and keeps translation separate from Q/E roll input', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    ;(canvas as HTMLCanvasElement & { requestPointerLock?: () => void }).requestPointerLock = vi.fn()
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!
    ;(viewer as unknown as { clock: { getDelta: () => number } }).clock.getDelta = () => 1
    ;(viewer as unknown as { setFlyModeType: (mode: 'drone' | 'free-cam') => void }).setFlyModeType('drone')

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 2,
        buttons: 2,
        pointerId: 17,
        clientX: 100,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    )

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', bubbles: true, cancelable: true }))
    ;(viewer as unknown as { renderLoop: () => void }).renderLoop()

    expect(controller.applyFlyRollDelta).toHaveBeenCalledTimes(1)
    expect(controller.applyFlyRollDelta.mock.calls[0]?.[0]).toBeLessThan(0)
    expect(controller.translateFly).not.toHaveBeenCalled()

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'q', bubbles: true, cancelable: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true, cancelable: true }))
    ;(viewer as unknown as { renderLoop: () => void }).renderLoop()

    expect(controller.applyFlyRollDelta).toHaveBeenCalledTimes(2)
    expect(controller.applyFlyRollDelta.mock.calls[1]?.[0]).toBeGreaterThan(0)
    expect(controller.translateFly).not.toHaveBeenCalled()

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', bubbles: true, cancelable: true }))
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        button: 2,
        buttons: 0,
        pointerId: 17,
        clientX: 100,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    )
  })

  it('uses a viewer-owned fly roll speed value instead of the old hard-coded roll seam', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    ;(canvas as HTMLCanvasElement & { requestPointerLock?: () => void }).requestPointerLock = vi.fn()
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!
    ;(viewer as unknown as { clock: { getDelta: () => number } }).clock.getDelta = () => 1

    const flyRollViewer = viewer as unknown as {
      getFlyRollSpeed: () => number
      setFlyRollSpeed: (speed: number) => void
      setFlyModeType: (mode: 'drone' | 'free-cam') => void
      renderLoop: () => void
    }

    expect(flyRollViewer.getFlyRollSpeed()).toBeCloseTo(Math.PI * 0.75, 6)
    flyRollViewer.setFlyModeType('drone')

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 2,
        buttons: 2,
        pointerId: 19,
        clientX: 100,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    )

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', bubbles: true, cancelable: true }))
    flyRollViewer.renderLoop()

    expect(controller.applyFlyRollDelta.mock.calls[0]?.[0]).toBeCloseTo(-(Math.PI * 0.75), 6)

    flyRollViewer.setFlyRollSpeed(0.5)
    expect(flyRollViewer.getFlyRollSpeed()).toBe(0.5)

    flyRollViewer.renderLoop()
    expect(controller.applyFlyRollDelta.mock.calls[1]?.[0]).toBeCloseTo(-0.5, 6)

    flyRollViewer.setFlyRollSpeed(-4)
    expect(flyRollViewer.getFlyRollSpeed()).toBe(0)

    flyRollViewer.renderLoop()
    expect(controller.applyFlyRollDelta.mock.calls[2]?.[0]).toBeCloseTo(0, 6)

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'q', bubbles: true, cancelable: true }))
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        button: 2,
        buttons: 0,
        pointerId: 19,
        clientX: 100,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    )
  })

  it('exposes a dedicated perspective FOV viewer contract and notifies listeners on change', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const controller = cameraControllerMocks.instances[0]!
    const handlePerspectiveFovChange = vi.fn()
    const fovViewer = viewer as unknown as {
      getPerspectiveFovDeg: () => number
      setPerspectiveFovDeg: (fovDeg: number) => void
      setOnPerspectiveFovDegChange: (handler: ((fovDeg: number) => void) | null) => void
      applyCameraPose: (pose: {
        position: ThreeVector3
        target: ThreeVector3
        up: ThreeVector3
        projectionMode: 'perspective' | 'orthographic'
        perspectiveFovDeg: number
        orthoViewHeight: number
      }) => void
      getCameraPose: () => {
        position: ThreeVector3
        target: ThreeVector3
        up: ThreeVector3
        projectionMode: 'perspective' | 'orthographic'
        perspectiveFovDeg: number
        orthoViewHeight: number
      }
    }

    expect(fovViewer.getPerspectiveFovDeg()).toBe(45)

    fovViewer.setOnPerspectiveFovDegChange(handlePerspectiveFovChange)
    fovViewer.setPerspectiveFovDeg(70)

    expect(controller.setPerspectiveFovDeg).toHaveBeenCalledWith(70)
    expect(fovViewer.getPerspectiveFovDeg()).toBe(70)
    expect(handlePerspectiveFovChange).toHaveBeenCalledWith(70)

    const currentPose = fovViewer.getCameraPose()
    fovViewer.applyCameraPose({
      ...currentPose,
      perspectiveFovDeg: 55,
    })

    expect(fovViewer.getPerspectiveFovDeg()).toBe(55)
    expect(handlePerspectiveFovChange).toHaveBeenLastCalledWith(55)
  })

  it('exposes a dedicated camera clip-range viewer contract and notifies listeners on change', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const controller = cameraControllerMocks.instances[0]!
    const handleCameraClipRangeChange = vi.fn()
    const clipViewer = viewer as unknown as {
      getCameraClipRange: () => {
        mode: CameraClipRangeMode
        clipStart: number
        clipEnd: number
      }
      setCameraClipRange: (range: { clipStart?: number; clipEnd?: number }) => void
      resetCameraClipRange: () => void
      setOnCameraClipRangeChange: (
        handler:
          | ((range: { mode: CameraClipRangeMode; clipStart: number; clipEnd: number }) => void)
          | null,
      ) => void
      applyCameraPose: (pose: {
        position: ThreeVector3
        target: ThreeVector3
        up: ThreeVector3
        projectionMode: 'perspective' | 'orthographic'
        perspectiveFovDeg: number
        orthoViewHeight: number
        clipRangeMode: CameraClipRangeMode
        clipStart: number
        clipEnd: number
      }) => void
      getCameraPose: () => {
        position: ThreeVector3
        target: ThreeVector3
        up: ThreeVector3
        projectionMode: 'perspective' | 'orthographic'
        perspectiveFovDeg: number
        orthoViewHeight: number
        clipRangeMode: CameraClipRangeMode
        clipStart: number
        clipEnd: number
      }
    }

    expect(clipViewer.getCameraClipRange()).toMatchObject({
      mode: 'auto',
      clipStart: 0.1,
      clipEnd: 1000,
    })

    clipViewer.setOnCameraClipRangeChange(handleCameraClipRangeChange)
    clipViewer.setCameraClipRange({ clipStart: 0.5, clipEnd: 300 })

    expect(controller.setCameraClipRange).toHaveBeenCalledWith({
      clipStart: 0.5,
      clipEnd: 300,
    })
    expect(clipViewer.getCameraClipRange()).toMatchObject({
      mode: 'authored',
      clipStart: 0.5,
      clipEnd: 300,
    })
    expect(handleCameraClipRangeChange).toHaveBeenCalledWith({
      mode: 'authored',
      clipStart: 0.5,
      clipEnd: 300,
    })

    const currentPose = clipViewer.getCameraPose()
    clipViewer.applyCameraPose({
      ...currentPose,
      clipRangeMode: 'authored',
      clipStart: 1.5,
      clipEnd: 150,
    })

    expect(clipViewer.getCameraClipRange()).toMatchObject({
      mode: 'authored',
      clipStart: 1.5,
      clipEnd: 150,
    })
    expect(handleCameraClipRangeChange).toHaveBeenLastCalledWith({
      mode: 'authored',
      clipStart: 1.5,
      clipEnd: 150,
    })

    clipViewer.resetCameraClipRange()

    expect(controller.resetCameraClipRange).toHaveBeenCalledTimes(1)
    expect(clipViewer.getCameraClipRange()).toMatchObject({
      mode: 'auto',
      clipStart: 0.1,
      clipEnd: 1000,
    })
    expect(handleCameraClipRangeChange).toHaveBeenLastCalledWith({
      mode: 'auto',
      clipStart: 0.1,
      clipEnd: 1000,
    })
  })

  it('preserves drone roll behavior while keeping free-cam upright and ignoring roll input', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    ;(canvas as HTMLCanvasElement & { requestPointerLock?: () => void }).requestPointerLock = vi.fn()
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!
    ;(viewer as unknown as { clock: { getDelta: () => number } }).clock.getDelta = () => 1

    const flyModeTypeViewer = viewer as unknown as {
      getFlyModeType: () => 'drone' | 'free-cam'
      setFlyModeType: (mode: 'drone' | 'free-cam') => void
      renderLoop: () => void
    }

    expect(flyModeTypeViewer.getFlyModeType()).toBe('free-cam')

    flyModeTypeViewer.setFlyModeType('drone')
    expect(flyModeTypeViewer.getFlyModeType()).toBe('drone')

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 2,
        buttons: 2,
        pointerId: 47,
        clientX: 100,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    )

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', bubbles: true, cancelable: true }))
    flyModeTypeViewer.renderLoop()

    expect(controller.applyFlyRollDelta).toHaveBeenCalledTimes(1)
    expect(controller.restoreFlyUpright).not.toHaveBeenCalled()

    flyModeTypeViewer.setFlyModeType('free-cam')
    expect(flyModeTypeViewer.getFlyModeType()).toBe('free-cam')
    expect(controller.restoreFlyUpright).toHaveBeenCalledTimes(1)

    canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        buttons: 2,
        pointerId: 47,
        clientX: 118,
        clientY: 132,
        movementX: 18,
        movementY: 12,
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(controller.applyFlyLookDeltaUpright).toHaveBeenCalledWith(18, 12)
    expect(controller.applyFlyLookDelta).not.toHaveBeenCalled()
    expect(controller.restoreFlyUpright).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'q', bubbles: true, cancelable: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true, cancelable: true }))
    flyModeTypeViewer.renderLoop()

    expect(controller.applyFlyRollDelta).toHaveBeenCalledTimes(1)

    flyModeTypeViewer.setFlyModeType('drone')
    expect(flyModeTypeViewer.getFlyModeType()).toBe('drone')

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', bubbles: true, cancelable: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true, cancelable: true }))
    flyModeTypeViewer.renderLoop()

    expect(controller.applyFlyRollDelta).toHaveBeenCalledTimes(2)
    expect(controller.applyFlyRollDelta.mock.calls[1]?.[0]).toBeGreaterThan(0)

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', bubbles: true, cancelable: true }))
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        button: 2,
        buttons: 0,
        pointerId: 47,
        clientX: 118,
        clientY: 132,
        bubbles: true,
        cancelable: true,
      }),
    )
  })

  it('starts always-on fly from the next viewport click, keeps the session alive on pointer release, and ends when the mode switches back', async () => {
    const { Viewer } = await import('./Viewer')

    container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 600,
    })

    viewer = new Viewer(container)
    resizeObserverCallback?.([], {} as ResizeObserver)

    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    ;(canvas as HTMLCanvasElement & { requestPointerLock?: () => void }).requestPointerLock = vi.fn()
    const capturedPointerIds = new Set<number>()
    canvas.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.add(pointerId)
    })
    canvas.releasePointerCapture = vi.fn((pointerId: number) => {
      capturedPointerIds.delete(pointerId)
    })
    canvas.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerIds.has(pointerId))

    const controller = cameraControllerMocks.instances[0]!
    const flyActivationViewer = viewer as unknown as {
      getFlyActivationMode: () => 'right-click' | 'always-on'
      setFlyActivationMode: (mode: 'right-click' | 'always-on') => void
      isFlyModeActive: () => boolean
    }

    expect(flyActivationViewer.getFlyActivationMode()).toBe('right-click')

    flyActivationViewer.setFlyActivationMode('always-on')
    expect(flyActivationViewer.getFlyActivationMode()).toBe('always-on')
    expect(flyActivationViewer.isFlyModeActive()).toBe(false)

    const entryPointerDown = new PointerEvent('pointerdown', {
      button: 0,
      buttons: 1,
      pointerId: 41,
      clientX: 140,
      clientY: 160,
      bubbles: true,
      cancelable: true,
    })
    canvas.dispatchEvent(entryPointerDown)

    expect(entryPointerDown.defaultPrevented).toBe(true)
    expect(flyActivationViewer.isFlyModeActive()).toBe(true)
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(41)
    expect(controller.beginFlyMode).toHaveBeenCalledTimes(1)

    const entryPointerUp = new PointerEvent('pointerup', {
      button: 0,
      buttons: 0,
      pointerId: 41,
      clientX: 140,
      clientY: 160,
      bubbles: true,
      cancelable: true,
    })
    canvas.dispatchEvent(entryPointerUp)

    expect(entryPointerUp.defaultPrevented).toBe(true)
    expect(flyActivationViewer.isFlyModeActive()).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    expect(flyActivationViewer.isFlyModeActive()).toBe(true)

    window.dispatchEvent(new Event('blur'))
    expect(flyActivationViewer.isFlyModeActive()).toBe(false)
    expect(controller.endFlyMode).toHaveBeenCalledTimes(1)

    const secondEntryPointerDown = new PointerEvent('pointerdown', {
      button: 0,
      buttons: 1,
      pointerId: 43,
      clientX: 180,
      clientY: 200,
      bubbles: true,
      cancelable: true,
    })
    canvas.dispatchEvent(secondEntryPointerDown)

    expect(flyActivationViewer.isFlyModeActive()).toBe(true)
    expect(controller.beginFlyMode).toHaveBeenCalledTimes(2)

    flyActivationViewer.setFlyActivationMode('right-click')
    expect(flyActivationViewer.getFlyActivationMode()).toBe('right-click')
    expect(flyActivationViewer.isFlyModeActive()).toBe(false)
    expect(controller.endFlyMode).toHaveBeenCalledTimes(2)
  })
})
