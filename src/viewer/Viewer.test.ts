// @vitest-environment jsdom

import type { Vector3 as ThreeVector3 } from 'three'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cameraControllerMocks = vi.hoisted(() => ({
  instances: [] as Array<{
    activeCamera: { position: { x: number; y: number; z: number }; up: { x: number; y: number; z: number } }
    beginTemporaryOrbitDrag: ReturnType<typeof vi.fn>
    updateTemporaryOrbitDrag: ReturnType<typeof vi.fn>
    endTemporaryOrbitDrag: ReturnType<typeof vi.fn>
    beginFlyMode: ReturnType<typeof vi.fn>
    endFlyMode: ReturnType<typeof vi.fn>
    applyFlyLookDelta: ReturnType<typeof vi.fn>
    applyFlyRollDelta: ReturnType<typeof vi.fn>
    restoreFlyUpright: ReturnType<typeof vi.fn>
    animateToDirection: ReturnType<typeof vi.fn>
    snapToDirection: ReturnType<typeof vi.fn>
    translateFly: ReturnType<typeof vi.fn>
    zoomByWheelDelta: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
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

    public constructor(_canvas: HTMLCanvasElement) {
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
    public readonly applyFlyRollDelta = vi.fn()
    public readonly restoreFlyUpright = vi.fn()
    public readonly beginTemporaryOrbitDrag = vi.fn()
    public readonly updateTemporaryOrbitDrag = vi.fn()
    public readonly endTemporaryOrbitDrag = vi.fn()
    public readonly beginFlyMode = vi.fn()
    public readonly endFlyMode = vi.fn()
    public readonly translateFly = vi.fn()
    public readonly zoomByWheelDelta = vi.fn()
    public readonly update = vi.fn()
    public readonly animateToDirection = vi.fn()
    public readonly snapToDirection = vi.fn()

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
    public beginTemporaryPanDrag(): void {}
    public updateTemporaryPanDrag(): void {}
    public endTemporaryPanDrag(): void {}
    public frameBox(): void {}
    public frameObject(): void {}
    public animateToPose(): void {}
    public applyPose(): void {}
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
  let pointerLockElement: Element | null = null

  beforeEach(() => {
    cameraControllerMocks.instances.length = 0
    axisGizmoMocks.instances.length = 0
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
      renderLoop: () => void
    }

    expect(flyRollViewer.getFlyRollSpeed()).toBeCloseTo(Math.PI * 0.75, 6)

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

    expect(controller.applyFlyLookDelta).toHaveBeenCalledWith(18, 12)
    expect(controller.restoreFlyUpright).toHaveBeenCalledTimes(2)

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
