// @vitest-environment jsdom

import type { Vector3 as ThreeVector3 } from 'three'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cameraControllerMocks = vi.hoisted(() => ({
  instances: [] as Array<{
    activeCamera: { position: { x: number; y: number; z: number }; up: { x: number; y: number; z: number } }
    applyFlyLookDelta: ReturnType<typeof vi.fn>
    translateFly: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
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

    public constructor(_options?: unknown) {}

    public setPixelRatio(_ratio: number): void {}

    public setSize(_width: number, _height: number, _updateStyle?: boolean): void {}

    public render(): void {}

    public dispose(): void {}
  }

  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
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
    public readonly translateFly = vi.fn()
    public readonly update = vi.fn()

    public constructor(
      perspectiveCamera: { position: ThreeVector3; up: ThreeVector3 },
      _orthographicCamera: unknown,
      _domElement: unknown,
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
    public setPreset(): void {}
    public snapToDirection(): void {}
    public beginTemporaryOrbitDrag(): void {}
    public updateTemporaryOrbitDrag(): void {}
    public endTemporaryOrbitDrag(): void {}
    public zoomByWheelDelta(): void {}
    public beginTemporaryPanDrag(): void {}
    public updateTemporaryPanDrag(): void {}
    public endTemporaryPanDrag(): void {}
    public frameBox(): void {}
    public frameObject(): void {}
    public animateToPose(): void {}
    public applyPose(): void {}
    public animateToDirection(): void {}
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

    public constructor(_camera: unknown, _domElement: unknown, _controls: unknown) {}

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

describe('Viewer baseline replacement', () => {
  let container: HTMLDivElement | null = null
  let viewer: { dispose: () => void } | null = null
  let resizeObserverCallback: ResizeObserverCallback | null = null

  beforeEach(() => {
    cameraControllerMocks.instances.length = 0
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
  })

  afterEach(async () => {
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
    expect(controller.translateFly.mock.calls[0]?.[0]).toBeGreaterThan(0)
    expect(controller.translateFly.mock.calls[0]?.[1]).toBe(0)
    expect(controller.translateFly.mock.calls[0]?.[2]).toBe(0)

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', bubbles: true, cancelable: true }))
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

    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    canvas.dispatchEvent(contextMenuEvent)

    expect(contextMenuEvent.defaultPrevented).toBe(true)
  })
})
