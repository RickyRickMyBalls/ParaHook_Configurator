// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { BoxGeometry, Mesh, Object3D, PerspectiveCamera, Vector3 } from 'three'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const {
  loadReferenceAssetObjectMock,
  disposeReferenceObjectTreeMock,
  rendererSetSizeMock,
  rendererRenderMock,
  rendererSetPixelRatioMock,
  rendererDisposeMock,
  orbitAddEventListenerMock,
  orbitDisposeMock,
  orbitUpdateMock,
  gridHelperInstances,
} = vi.hoisted(() => ({
  loadReferenceAssetObjectMock: vi.fn(),
  disposeReferenceObjectTreeMock: vi.fn(),
  rendererSetSizeMock: vi.fn(),
  rendererRenderMock: vi.fn(),
  rendererSetPixelRatioMock: vi.fn(),
  rendererDisposeMock: vi.fn(),
  orbitAddEventListenerMock: vi.fn(),
  orbitDisposeMock: vi.fn(),
  orbitUpdateMock: vi.fn(),
  gridHelperInstances: [] as import('three').GridHelper[],
}))

class MockResizeObserver {
  public readonly callback: ResizeObserverCallback

  public static instances: MockResizeObserver[] = []

  public constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }

  public observe = vi.fn()
  public disconnect = vi.fn()

  public trigger() {
    this.callback([], this as unknown as ResizeObserver)
  }

  public static reset() {
    MockResizeObserver.instances = []
  }
}

vi.mock('../../viewer/referenceAssetLoader', () => ({
  loadReferenceAssetObject: loadReferenceAssetObjectMock,
  disposeReferenceObjectTree: disposeReferenceObjectTreeMock,
}))

vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three')

  class MockWebGLRenderer {
    public constructor(_options?: unknown) {}

    public setPixelRatio = rendererSetPixelRatioMock
    public setSize = rendererSetSizeMock
    public render = rendererRenderMock
    public dispose = rendererDisposeMock
  }

  return {
    ...actual,
    GridHelper: class extends actual.GridHelper {
      public constructor(...args: ConstructorParameters<typeof actual.GridHelper>) {
        super(...args)
        gridHelperInstances.push(this)
      }
    },
    WebGLRenderer: MockWebGLRenderer,
  }
})

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: class {
    public target = new Vector3()
    public enableDamping = false
    public enablePan = false
    public minDistance = 0
    public maxDistance = 0
    public addEventListener = orbitAddEventListenerMock
    public update = orbitUpdateMock
    public dispose = orbitDisposeMock
  },
}))

import {
  framePreviewCameraToObject,
  StagedImportPreviewViewport,
} from './StagedImportPreviewViewport'

describe('StagedImportPreviewViewport', () => {
  let container: HTMLDivElement
  let root: Root
  let originalResizeObserver: typeof ResizeObserver | undefined
  let originalWebGLRenderingContext: typeof WebGLRenderingContext | undefined
  let originalActEnvironment: boolean | undefined
  let width = 320
  let height = 240

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    originalResizeObserver = globalThis.ResizeObserver
    originalWebGLRenderingContext = globalThis.WebGLRenderingContext
    originalActEnvironment = (
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT
    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      value: MockResizeObserver,
      writable: true,
    })
    Object.defineProperty(globalThis, 'WebGLRenderingContext', {
      configurable: true,
      value: class {},
      writable: true,
    })
    ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true

    loadReferenceAssetObjectMock.mockReset()
    disposeReferenceObjectTreeMock.mockReset()
    rendererSetSizeMock.mockReset()
    rendererRenderMock.mockReset()
    rendererSetPixelRatioMock.mockReset()
    rendererDisposeMock.mockReset()
    orbitAddEventListenerMock.mockReset()
    orbitDisposeMock.mockReset()
    orbitUpdateMock.mockReset()
    gridHelperInstances.length = 0
    MockResizeObserver.reset()
    width = 320
    height = 240

    Object.defineProperty(HTMLCanvasElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => width,
    })
    Object.defineProperty(HTMLCanvasElement.prototype, 'clientHeight', {
      configurable: true,
      get: () => height,
    })
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    container.remove()
    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      value: originalResizeObserver,
      writable: true,
    })
    Object.defineProperty(globalThis, 'WebGLRenderingContext', {
      configurable: true,
      value: originalWebGLRenderingContext,
      writable: true,
    })
    ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
      .IS_REACT_ACT_ENVIRONMENT = originalActEnvironment
    vi.restoreAllMocks()
  })

  it('fits the same object farther away when the preview viewport is narrower', () => {
    const object = new Mesh(new BoxGeometry(10, 10, 10))
    const wideCamera = new PerspectiveCamera(42, 2, 0.1, 1000)
    const narrowCamera = new PerspectiveCamera(42, 0.5, 0.1, 1000)

    const wideCenter = framePreviewCameraToObject(wideCamera, object)
    const wideDistance = wideCamera.position.distanceTo(wideCenter)

    const narrowCenter = framePreviewCameraToObject(narrowCamera, object)
    const narrowDistance = narrowCamera.position.distanceTo(narrowCenter)

    expect(narrowDistance).toBeGreaterThan(wideDistance)
  })

  it('applies the staged up-axis orientation to the loaded preview object before framing', async () => {
    const loadedObject = new Object3D()
    loadReferenceAssetObjectMock.mockResolvedValue(loadedObject)

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'upright.step',
            fileType: 'step',
            objectUrl: 'blob:upright-step',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'y-up',
            scaleAlignment: 'current-size',
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
      await Promise.resolve()
    })

    expect(loadedObject.rotation.x).toBeCloseTo(Math.PI / 2)
    expect(loadedObject.rotation.y).toBeCloseTo(0)
    expect(loadedObject.rotation.z).toBeCloseTo(0)
    expect(loadedObject.scale.x).toBeCloseTo(1)
    expect(loadedObject.scale.y).toBeCloseTo(1)
    expect(loadedObject.scale.z).toBeCloseTo(1)
  })

  it('keeps the loaded preview object alive and rotates it in place when only the staged up-axis changes', async () => {
    const loadedObject = new Object3D()
    loadReferenceAssetObjectMock.mockResolvedValue(loadedObject)

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'upright.step',
            fileType: 'step',
            objectUrl: 'blob:upright-step',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'z-up',
            scaleAlignment: 'current-size',
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
      await Promise.resolve()
    })

    expect(loadReferenceAssetObjectMock).toHaveBeenCalledTimes(1)
    expect(rendererDisposeMock).not.toHaveBeenCalled()
    expect(loadedObject.rotation.x).toBeCloseTo(0)
    expect(loadedObject.rotation.y).toBeCloseTo(0)

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'upright.step',
            fileType: 'step',
            objectUrl: 'blob:upright-step',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'x-up',
            scaleAlignment: 'current-size',
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
    })

    expect(loadReferenceAssetObjectMock).toHaveBeenCalledTimes(1)
    expect(rendererDisposeMock).not.toHaveBeenCalled()
    expect(disposeReferenceObjectTreeMock).not.toHaveBeenCalled()
    expect(loadedObject.rotation.x).toBeCloseTo(0)
    expect(loadedObject.rotation.y).toBeCloseTo(-Math.PI / 2)
    expect(loadedObject.rotation.z).toBeCloseTo(0)
  })

  it('keeps the loaded preview object alive and rescales it in place when only the staged scale changes', async () => {
    const loadedObject = new Object3D()
    loadReferenceAssetObjectMock.mockResolvedValue(loadedObject)

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'scaled.step',
            fileType: 'step',
            objectUrl: 'blob:scaled-step',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'z-up',
            scaleAlignment: 'current-size',
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
      await Promise.resolve()
    })

    expect(loadReferenceAssetObjectMock).toHaveBeenCalledTimes(1)
    expect(rendererDisposeMock).not.toHaveBeenCalled()
    expect(loadedObject.scale.x).toBeCloseTo(1)
    expect(loadedObject.scale.y).toBeCloseTo(1)
    expect(loadedObject.scale.z).toBeCloseTo(1)

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'scaled.step',
            fileType: 'step',
            objectUrl: 'blob:scaled-step',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'z-up',
            scaleAlignment: 'custom',
            scaleMultiplier: 2.5,
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
    })

    expect(loadReferenceAssetObjectMock).toHaveBeenCalledTimes(1)
    expect(rendererDisposeMock).not.toHaveBeenCalled()
    expect(disposeReferenceObjectTreeMock).not.toHaveBeenCalled()
    expect(loadedObject.scale.x).toBeCloseTo(2.5)
    expect(loadedObject.scale.y).toBeCloseTo(2.5)
    expect(loadedObject.scale.z).toBeCloseTo(2.5)
  })

  it('keeps the current camera distance on scale changes until zoom to fit is pressed explicitly', async () => {
    const loadedObject = new Mesh(new BoxGeometry(10, 10, 10))
    loadReferenceAssetObjectMock.mockResolvedValue(loadedObject)

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'scaled.step',
            fileType: 'step',
            objectUrl: 'blob:scaled-step',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'z-up',
            scaleAlignment: 'current-size',
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
      await Promise.resolve()
    })

    const initialCamera = rendererRenderMock.mock.calls.at(-1)?.[1] as PerspectiveCamera | undefined
    expect(initialCamera).toBeDefined()
    const initialDistance = initialCamera!.position.length()

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'scaled.step',
            fileType: 'step',
            objectUrl: 'blob:scaled-step',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'z-up',
            scaleAlignment: 'custom',
            scaleMultiplier: 2.5,
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
    })

    const scaledCamera = rendererRenderMock.mock.calls.at(-1)?.[1] as PerspectiveCamera | undefined
    expect(scaledCamera).toBeDefined()
    expect(scaledCamera!.position.length()).toBeCloseTo(initialDistance, 5)

    const fitButton = container.querySelector(
      'button[title="Zoom to fit preview"]',
    ) as HTMLButtonElement | null
    expect(fitButton).not.toBeNull()

    await act(async () => {
      fitButton?.click()
    })

    const refitCamera = rendererRenderMock.mock.calls.at(-1)?.[1] as PerspectiveCamera | undefined
    expect(refitCamera).toBeDefined()
    expect(refitCamera!.position.length()).toBeGreaterThan(initialDistance)
  })

  it('updates the preview camera projection after divider-style resize changes the viewport aspect', async () => {
    loadReferenceAssetObjectMock.mockResolvedValue(new Object3D())
    const updateProjectionMatrixSpy = vi.spyOn(
      PerspectiveCamera.prototype,
      'updateProjectionMatrix',
    )

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'previewable.glb',
            fileType: 'glb',
            objectUrl: 'blob:previewable-glb',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'z-up',
            scaleAlignment: 'current-size',
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
      await Promise.resolve()
    })

    expect(rendererSetSizeMock).toHaveBeenCalledWith(320, 240, false)
    const projectionCountAfterInitialLoad = updateProjectionMatrixSpy.mock.calls.length
    expect(projectionCountAfterInitialLoad).toBeGreaterThan(0)

    width = 420
    height = 240

    await act(async () => {
      MockResizeObserver.instances[0]?.trigger()
    })

    expect(rendererSetSizeMock).toHaveBeenCalledWith(420, 240, false)
    expect(updateProjectionMatrixSpy.mock.calls.length).toBeGreaterThan(
      projectionCountAfterInitialLoad,
    )
  })

  it('shows a local 300 by 300 preview grid toggle above zoom to fit and toggles it without reloading the asset', async () => {
    loadReferenceAssetObjectMock.mockResolvedValue(new Object3D())

    await act(async () => {
      root.render(
        <StagedImportPreviewViewport
          selectedFile={{
            fileName: 'previewable.glb',
            fileType: 'glb',
            objectUrl: 'blob:previewable-glb',
            stagedFileId: 'staged-import-file:preview',
            importMode: 'single-object',
            upAxis: 'z-up',
            scaleAlignment: 'current-size',
            structureInspection: {
              status: 'ready',
              summary: {
                hasMultipleObjects: false,
                hasHierarchy: false,
                hasParts: false,
                labels: [],
                partRows: [],
              },
              errorMessage: null,
            },
          }}
        />,
      )
      await Promise.resolve()
    })

    const gridButton = container.querySelector(
      'button[title="Show 300x300 preview grid"]',
    ) as HTMLButtonElement | null
    const fitButton = container.querySelector(
      'button[title="Zoom to fit preview"]',
    ) as HTMLButtonElement | null

    expect(gridButton).not.toBeNull()
    expect(fitButton).not.toBeNull()
    expect(gridButton?.getAttribute('aria-pressed')).toBe('false')
    expect(loadReferenceAssetObjectMock).toHaveBeenCalledTimes(1)
    expect(gridHelperInstances).toHaveLength(1)
    expect(gridHelperInstances[0]?.visible).toBe(false)

    await act(async () => {
      gridButton?.click()
    })

    expect(gridButton?.getAttribute('aria-pressed')).toBe('true')
    expect(gridHelperInstances[0]?.visible).toBe(true)
    expect(loadReferenceAssetObjectMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      gridButton?.click()
    })

    expect(gridButton?.getAttribute('aria-pressed')).toBe('false')
    expect(gridHelperInstances[0]?.visible).toBe(false)
    expect(loadReferenceAssetObjectMock).toHaveBeenCalledTimes(1)
  })
})
