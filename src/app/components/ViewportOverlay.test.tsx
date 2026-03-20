// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./ReferenceTransformToolbar', () => ({
  ReferenceTransformToolbar: () => <div data-testid="reference-transform-toolbar" />,
}))

vi.mock('../viewerBridge', () => ({
  getViewer: vi.fn(() => null),
  subscribeViewer: vi.fn(() => () => {}),
}))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

type WorkerMessageHandler = (event: MessageEvent<unknown>) => void

class MockWorker {
  private readonly handlers = new Set<WorkerMessageHandler>()

  public addEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    if (type !== 'message' || typeof handler !== 'function') {
      return
    }
    this.handlers.add(handler as WorkerMessageHandler)
  }

  public removeEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    if (type !== 'message' || typeof handler !== 'function') {
      return
    }
    this.handlers.delete(handler as WorkerMessageHandler)
  }

  public postMessage(_message: unknown): void {}

  public terminate(): void {}
}

describe('ViewportOverlay sketch session window', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalWorker = globalThis.Worker

  const seedSketchSession = async () => {
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 0 },
                    b: { kind: 'lit', x: 100, y: 0 },
                  },
                ],
                outputs: {
                  profiles: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })
  }

  const seedSketchPlanePickSession = async () => {
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                planeTransform: {
                  offsetMm: 0,
                  translation: { x: 0, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  inPlaneRotationDeg: 0,
                },
                components: [],
                outputs: {
                  profiles: [],
                  diagnostics: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    })
  }

  beforeEach(async () => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    const { useAppStore } = await import('../store/useAppStore')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    useAppStore.setState(useAppStore.getInitialState(), true)
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
    globalThis.Worker = originalWorker
  })

  it('keeps the floating sketch window controls-only without the old embedded preview card', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    expect(container.querySelector('.ViewportOverlaySketchPreviewCard')).toBeNull()
    expect(container.querySelector('button[aria-label="Line"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="PLine"]')).not.toBeNull()
    expect(container.textContent).toContain('Sketch Draw')
    expect(container.textContent).toContain('No Tool Selected')
    expect(container.textContent).toContain('Choose a sketch tool to begin drawing in the main viewport.')
    expect(container.textContent).toContain('Review Profiles')
    expect(container.textContent).toContain('entities staged on this sketch')
  })

  it('opens the shared i menu from sketch draw titlebar right click', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const sessionWindow = container.querySelector(
      '.ViewportOverlaySketchSessionWindow',
    ) as HTMLDivElement | null
    const titleBar = container.querySelector(
      '.ViewportOverlaySketchSessionTitleBar',
    ) as HTMLDivElement | null

    expect(sessionWindow).not.toBeNull()
    expect(titleBar).not.toBeNull()

    Object.defineProperty(sessionWindow, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 100,
        top: 40,
        right: 520,
        bottom: 560,
        width: 420,
        height: 520,
        x: 100,
        y: 40,
        toJSON: () => ({}),
      }),
    })

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 180,
          clientY: 90,
        }),
      )
    })

    const openIMenu = Array.from(
      container.querySelectorAll('.SpaghettiContextMenuItem'),
    ).find((item) => item.textContent?.includes('Open i Menu')) as HTMLButtonElement | undefined

    expect(openIMenu).toBeDefined()

    await act(async () => {
      openIMenu?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(container.textContent).toContain('UI Customization')
    expect(container.textContent).toContain('Toolbar Window')
    expect(container.textContent).toContain('Toolbar Width')
    expect(container.textContent).toContain('Toolbar Height')
    expect(container.textContent).toContain('Sketch Draw Settings')
    expect(container.textContent).toContain('Snap')
    expect(container.textContent).toContain('Snap Distance')
    expect(container.textContent).toContain('Crosshair Size')
    expect(container.textContent).toContain('Start Point')
    expect(container.textContent).toContain('Start Point Symbol')
    expect(container.textContent).toContain('Start Point Symbol Size')
    expect(container.textContent).toContain('PLine Point Symbols')
    expect(container.textContent).toContain('PLine Point Symbol')
    expect(container.textContent).toContain('PLine Point Size')
  })

  it('supports titlebar dragging and renders all edge/corner resize handles', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const sessionWindow = container.querySelector(
      '.ViewportOverlaySketchSessionWindow',
    ) as HTMLDivElement | null
    const overlayRoot = container.querySelector('.ViewportOverlayRoot') as HTMLDivElement | null
    const titleBar = container.querySelector(
      '.ViewportOverlaySketchSessionTitleBar',
    ) as HTMLDivElement | null
    const resizeHandles = container.querySelectorAll('.ViewportOverlaySketchSessionResizeHandle')
    const southEastHandle = container.querySelector(
      '.ViewportOverlaySketchSessionResizeHandle--se',
    ) as HTMLDivElement | null

    expect(sessionWindow).not.toBeNull()
    expect(overlayRoot).not.toBeNull()
    expect(titleBar).not.toBeNull()
    expect(resizeHandles).toHaveLength(8)
    expect(southEastHandle).not.toBeNull()

    Object.defineProperty(sessionWindow, 'offsetWidth', {
      configurable: true,
      get: () => 420,
    })
    Object.defineProperty(sessionWindow, 'offsetHeight', {
      configurable: true,
      get: () => 520,
    })
    Object.defineProperty(overlayRoot, 'clientWidth', {
      configurable: true,
      get: () => 1600,
    })
    Object.defineProperty(overlayRoot, 'clientHeight', {
      configurable: true,
      get: () => 1200,
    })
    const initialLeft = Number.parseInt(sessionWindow?.style.left ?? '0', 10)
    const initialTop = Number.parseInt(sessionWindow?.style.top ?? '0', 10)

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 100,
          clientY: 100,
        }),
      )
      window.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 140,
          clientY: 130,
        }),
      )
      window.dispatchEvent(new MouseEvent('mouseup'))
    })

    expect(sessionWindow?.style.left).toBe(`${initialLeft + 40}px`)
    expect(sessionWindow?.style.top).toBe(`${initialTop + 30}px`)

    await act(async () => {
      southEastHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          button: 0,
          clientX: 420,
          clientY: 520,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 2,
          clientX: 460,
          clientY: 560,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2 }))
    })

    expect(sessionWindow?.style.width).toBe('460px')
    expect(sessionWindow?.style.height).toBe('560px')
  })

  it('spawns the sketch session window to the right of the docked browser using overlay-local coordinates', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
    try {
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: function mockGetBoundingClientRect(this: HTMLElement) {
          if (this.classList.contains('LeftDockPanelTarget--browser')) {
            return {
              left: 0,
              top: 24,
              right: 320,
              bottom: 420,
              width: 320,
              height: 396,
              x: 0,
              y: 24,
              toJSON: () => ({}),
            }
          }
          if (this.classList.contains('LeftDock')) {
            return {
              left: 0,
              top: 0,
              right: 320,
              bottom: 720,
              width: 320,
              height: 720,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            }
          }
          if (this.classList.contains('ViewportOverlayRoot')) {
            return {
              left: 120,
              top: 0,
              right: 1080,
              bottom: 720,
              width: 960,
              height: 720,
              x: 120,
              y: 0,
              toJSON: () => ({}),
            }
          }
          return originalGetBoundingClientRect.call(this)
        },
      })

      const leftDock = document.createElement('aside')
      leftDock.className = 'LeftDock'
      const browserTarget = document.createElement('div')
      browserTarget.className = 'LeftDockPanelTarget LeftDockPanelTarget--browser'
      leftDock.appendChild(browserTarget)
      document.body.appendChild(leftDock)

      await seedSketchSession()

      container = document.createElement('div')
      document.body.appendChild(container)
      root = createRoot(container)

      await act(async () => {
        root?.render(<ViewportOverlay />)
      })

      const overlayRoot = container.querySelector('.ViewportOverlayRoot') as HTMLDivElement | null
      const sessionWindow = container.querySelector(
        '.ViewportOverlaySketchSessionWindow',
      ) as HTMLDivElement | null

      expect(overlayRoot).not.toBeNull()
      expect(sessionWindow).not.toBeNull()

      Object.defineProperty(overlayRoot, 'clientWidth', {
        configurable: true,
        get: () => 960,
      })
      Object.defineProperty(overlayRoot, 'clientHeight', {
        configurable: true,
        get: () => 720,
      })

      await act(async () => {
        useSpaghettiStore.getState().closeGeometrySketchSession()
      })
      await act(async () => {
        useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      })

      expect(sessionWindow?.style.left).toBe('216px')
      expect(sessionWindow?.style.top).toBe('152px')
    } finally {
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: originalGetBoundingClientRect,
      })
    }
  })

  it('renders the viewport-first sketch-plane session and commits the draft on Done', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    expect(container.querySelector('.ViewportOverlaySketchPlanePicker')).toBeNull()
    expect(container.querySelector('.ViewportOverlaySketchPlaneSession')).not.toBeNull()
    expect(container.querySelector('.ViewportOverlaySketchPlaneStage')).toBeNull()
    expect(container.querySelector('.ViewportOverlaySketchPlanePreview')).toBeNull()
    expect(container.querySelector('.ViewportOverlaySketchPlaneDock')).not.toBeNull()
    expect(container.querySelector('.ViewportOverlaySketchPlaneViewportLayer')).toBeNull()
    expect(container.querySelectorAll('.ViewportOverlaySketchPlaneOriginPlane')).toHaveLength(0)
    expect(container.textContent).toContain('Pick Origin Plane')

    const done = container.querySelector(
      '.ViewportOverlayToolPanelTitleDone',
    ) as HTMLButtonElement | null
    expect(done?.disabled).toBe(true)

    const planeTrackButton = container.querySelector(
      'button.ParaSelectTrackButton[aria-label="Plane"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      planeTrackButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const xzPlane = Array.from(container.querySelectorAll('.ParaSelectMenuOption')).find(
      (button) => button.textContent === 'XZ',
    ) as HTMLButtonElement | undefined

    await act(async () => {
      xzPlane?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Adjust Sketch Plane')
    expect(done?.disabled).toBe(false)
    const resetTransform = container.querySelector(
      'button[aria-label="Reset sketch plane transform"]',
    ) as HTMLButtonElement | null
    expect(resetTransform).not.toBeNull()
    expect(container.querySelectorAll('.ViewportOverlaySketchPlaneGizmoRows .ParaSlider')).toHaveLength(6)
    expect(container.querySelectorAll('.ViewportOverlaySketchPlaneGizmoRows .ParaVec3Slider').length).toBe(0)
    expect(container.textContent).toContain('Move X')
    expect(container.textContent).toContain('Rotate Z')
    expect(container.textContent).not.toContain('Sketch Origin Gizmo')
    expect(container.querySelector('.ViewportOverlaySketchPlaneGizmoModes')).toBeNull()
    const sliderGroups = container.querySelectorAll(
      '.ViewportOverlaySketchPlaneGizmoSliderGroup',
    )
    const moveLabel = container.querySelectorAll(
      '.ViewportOverlaySketchPlaneGizmoSliderGroupLabel',
    )[0] as HTMLButtonElement | undefined
    const rotateLabel = container.querySelectorAll(
      '.ViewportOverlaySketchPlaneGizmoSliderGroupLabel',
    )[1] as HTMLButtonElement | undefined
    const moveSnapToggle = container.querySelector(
      'button[aria-label="Toggle move snap"]',
    ) as HTMLButtonElement | null
    const rotateSnapToggle = container.querySelector(
      'button[aria-label="Toggle rotate snap"]',
    ) as HTMLButtonElement | null
    expect(sliderGroups[0]?.classList.contains('isActive')).toBe(true)
    expect(sliderGroups[1]?.classList.contains('isActive')).toBe(false)
    expect(moveSnapToggle).not.toBeNull()
    expect(rotateSnapToggle).not.toBeNull()
    expect(container.textContent).not.toContain('Move Snap')
    expect(container.textContent).not.toContain('Rotate Snap')

    await act(async () => {
      moveSnapToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Move Snap')

    const moveXTrack = container.querySelector(
      '.ParaSliderTrack[aria-label="Move X"]',
    ) as HTMLDivElement | null
    expect(moveXTrack).not.toBeNull()

    Object.defineProperty(moveXTrack, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 400,
        height: 30,
        right: 400,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => '',
      }),
    })

    await act(async () => {
      moveXTrack?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 200,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: 206,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', {}))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.draftTransform.translation.x).toBe(10)

    await act(async () => {
      moveLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelectorAll('.ViewportOverlaySketchPlaneGizmoRows .ParaVec3Slider').length).toBe(1)
    expect(container.textContent).not.toContain('Move X')

    await act(async () => {
      rotateSnapToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Rotate Snap')

    await act(async () => {
      rotateLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(sliderGroups[0]?.classList.contains('isActive')).toBe(false)
    expect(sliderGroups[1]?.classList.contains('isActive')).toBe(true)
    expect(container.querySelectorAll('.ViewportOverlaySketchPlaneGizmoRows .ParaVec3Slider').length).toBe(1)

    await act(async () => {
      rotateLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelectorAll('.ViewportOverlaySketchPlaneGizmoRows .ParaVec3Slider').length).toBe(2)
    expect(container.textContent).not.toContain('Rotate X')

    await act(async () => {
      moveLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.gizmoMode).toBe('translate')

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'r',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.gizmoMode).toBe('rotate')
    expect(sliderGroups[0]?.classList.contains('isActive')).toBe(false)
    expect(sliderGroups[1]?.classList.contains('isActive')).toBe(true)
    expect(container.textContent).not.toContain('Move X')
    expect(container.textContent).toContain('Rotate X')

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'm',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.gizmoMode).toBe('translate')
    expect(sliderGroups[0]?.classList.contains('isActive')).toBe(true)
    expect(sliderGroups[1]?.classList.contains('isActive')).toBe(false)
    expect(container.textContent).toContain('Move X')
    expect(container.textContent).not.toContain('Rotate X')

    await act(async () => {
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 24.5)
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.draftTransform.translation.x).toBe(24.5)

    await act(async () => {
      resetTransform?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.draftTransform.translation.x).toBe(0)
    expect(useSpaghettiStore.getState().sketchPlanePickSession?.draftTransform.rotationDeg.z).toBe(0)

    await act(async () => {
      done?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ViewportOverlaySketchPlaneSession')).toBeNull()
    const sketch = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-sketch-1')
      ?.params.sketch as { plane: string }
    expect(sketch.plane).toBe('XZ')
  })

  it('opens the titlebar right-click menu and reveals the hidden i-menu customization section', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const titleBar = container.querySelector(
      '.ViewportOverlayToolPanelTitleBar',
    ) as HTMLDivElement | null
    const panel = container.querySelector('.ViewportOverlayToolPanel') as HTMLDivElement | null
    expect(titleBar).not.toBeNull()
    expect(panel).not.toBeNull()
    expect(container.textContent).not.toContain('UI Customization')

    Object.defineProperty(panel, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 100,
        top: 80,
        right: 440,
        bottom: 440,
        width: 340,
        height: 360,
        x: 100,
        y: 80,
        toJSON: () => ({}),
      }),
    })

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 180,
          clientY: 160,
        }),
      )
    })

    const menuAction = Array.from(container.querySelectorAll('.SpaghettiContextMenuItem')).find(
      (button) => button.textContent === 'Open i Menu',
    ) as HTMLButtonElement | undefined
    expect(menuAction).not.toBeUndefined()
    const menu = container.querySelector('.ViewportOverlayToolPanelContextMenu') as HTMLDivElement | null
    expect(menu?.style.left).toBe('80px')
    expect(menu?.style.top).toBe('80px')

    await act(async () => {
      menuAction?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('UI Customization')
    expect(container.querySelector('.ViewportOverlayToolPanelBodySplitResizeHandle')).not.toBeNull()
    expect(container.textContent).toContain('Match the toolbar shell to the same customization language used by console tools.')
    expect(container.textContent).toContain('Preset')
    expect(container.textContent).toContain('BG Fill')
    expect(container.textContent).toContain('Text')
    expect(container.textContent).toContain('Font')
    expect(container.textContent).toContain('Z Index')
    expect(container.textContent).toContain('Fill Type')
    expect(container.textContent).toContain('BG Color')
    expect(container.textContent).toContain('Toolbar Width')
    expect(container.textContent).toContain('Toolbar Height')
    expect(container.textContent).toContain('Toolbar Window')
    expect(container.textContent).toContain('Sketch Plane UI')
    expect(container.textContent).toContain('Gizmo Size')
    expect(container.textContent).toContain('Ghost Plane Size')
    expect(container.querySelector('.ViewportOverlayToolPanelIMenuSection')).not.toBeNull()

    const iMenuToggle = Array.from(
      container.querySelectorAll('.ViewportOverlayToolPanelTextToggle'),
    ).find((button) => button.textContent?.includes('UI Customization')) as
      | HTMLButtonElement
      | undefined
    expect(iMenuToggle).not.toBeUndefined()

    await act(async () => {
      iMenuToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('UI Customization')
    expect(container.textContent).not.toContain('Toolbar Width')
    expect(container.textContent).not.toContain('Toolbar Height')
  })

  it('can return to plane selection without resetting the draft transform', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const planeTrackButton = container.querySelector(
      'button.ParaSelectTrackButton[aria-label="Plane"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      planeTrackButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const xzPlane = Array.from(container.querySelectorAll('.ParaSelectMenuOption')).find(
      (button) => button.textContent === 'XZ',
    ) as HTMLButtonElement | undefined

    await act(async () => {
      xzPlane?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 24.5)
    })

    const reselectButton = Array.from(
      container.querySelectorAll('.ViewportOverlaySketchPlaneSessionAction'),
    ).find((button) => button.textContent?.includes('Reselect Plane')) as
      | HTMLButtonElement
      | undefined

    await act(async () => {
      reselectButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Pick Origin Plane')
    expect(container.textContent).toContain('Selecting Plane')
    const session = useSpaghettiStore.getState().sketchPlanePickSession
    expect(session?.stage).toBe('pick')
    expect(session?.draftPlane).toBe('XZ')
    expect(session?.draftTransform.translation.x).toBe(24.5)
  })

  it('uses the shared tool-panel window shell with a draggable title bar, top-right close, and 8 resize handles', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const overlayRoot = container.querySelector('.ViewportOverlayRoot') as HTMLDivElement | null
    const toolPanel = container.querySelector('.ViewportOverlaySketchPlaneDock') as HTMLDivElement | null
    const titleBar = container.querySelector(
      '.ViewportOverlayToolPanelTitleBar',
    ) as HTMLDivElement | null
    const resizeHandles = container.querySelectorAll('.ViewportOverlayToolPanelResizeHandle')
    const southEastHandle = container.querySelector(
      '.ViewportOverlayToolPanelResizeHandle--se',
    ) as HTMLDivElement | null

    expect(overlayRoot).not.toBeNull()
    expect(toolPanel).not.toBeNull()
    expect(titleBar).not.toBeNull()
    expect(resizeHandles).toHaveLength(8)
    expect(titleBar?.lastElementChild?.textContent).toContain('X')
    expect(southEastHandle).not.toBeNull()

    Object.defineProperty(toolPanel, 'offsetWidth', {
      configurable: true,
      get: () => 340,
    })
    Object.defineProperty(toolPanel, 'offsetHeight', {
      configurable: true,
      get: () => 360,
    })
    Object.defineProperty(overlayRoot, 'clientWidth', {
      configurable: true,
      get: () => 1600,
    })
    Object.defineProperty(overlayRoot, 'clientHeight', {
      configurable: true,
      get: () => 1200,
    })

    const initialLeft = Number.parseInt(toolPanel?.style.left ?? '0', 10)
    const initialTop = Number.parseInt(toolPanel?.style.top ?? '0', 10)

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 100,
          clientY: 100,
        }),
      )
      window.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 130,
          clientY: 125,
        }),
      )
      window.dispatchEvent(new MouseEvent('mouseup'))
    })

    expect(toolPanel?.style.left).toBe(`${initialLeft + 30}px`)
    expect(toolPanel?.style.top).toBe(`${initialTop + 25}px`)

    await act(async () => {
      southEastHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 4,
          button: 0,
          clientX: 340,
          clientY: 360,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 4,
          clientX: 380,
          clientY: 410,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 4 }))
    })

    expect(toolPanel?.style.width).toBe('380px')
    expect(toolPanel?.style.height).toBe('410px')
  })

  it('returns the sketch-plane toolbar to auto height when a section collapses after manual resize', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const overlayRoot = container.querySelector('.ViewportOverlayRoot') as HTMLDivElement | null
    const toolPanel = container.querySelector('.ViewportOverlaySketchPlaneDock') as HTMLDivElement | null
    const southEastHandle = container.querySelector(
      '.ViewportOverlayToolPanelResizeHandle--se',
    ) as HTMLDivElement | null

    expect(overlayRoot).not.toBeNull()
    expect(toolPanel).not.toBeNull()
    expect(southEastHandle).not.toBeNull()

    Object.defineProperty(toolPanel, 'offsetWidth', {
      configurable: true,
      get: () => 340,
    })
    Object.defineProperty(toolPanel, 'offsetHeight', {
      configurable: true,
      get: () => 360,
    })
    Object.defineProperty(overlayRoot, 'clientWidth', {
      configurable: true,
      get: () => 1600,
    })
    Object.defineProperty(overlayRoot, 'clientHeight', {
      configurable: true,
      get: () => 1200,
    })

    await act(async () => {
      southEastHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 7,
          button: 0,
          clientX: 340,
          clientY: 360,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 7,
          clientX: 380,
          clientY: 410,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 7 }))
    })

    expect(toolPanel?.style.height).toBe('410px')

    const planeSelectionToggle = Array.from(
      container.querySelectorAll('.ViewportOverlaySketchPlaneTextToggle'),
    ).find((button) => button.textContent?.includes('Plane Selection')) as
      | HTMLButtonElement
      | undefined

    expect(planeSelectionToggle).not.toBeUndefined()

    await act(async () => {
      planeSelectionToggle?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(toolPanel?.style.height).toBe('')
  })

  it('uses Escape from adjust to return to plane selection without closing the sketch-plane session', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    await seedSketchPlanePickSession()

    act(() => {
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 24.5)
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    expect(container.textContent).toContain('Adjust Sketch Plane')

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      stage: 'pick',
      draftPlane: 'XZ',
      draftTransform: {
        translation: { x: 24.5, y: 0, z: 0 },
      },
    })
    expect(container.textContent).toContain('Pick Origin Plane')
    expect(container.textContent).toContain('Selecting Plane')
  })

  it('uses Escape in sketch draw to return one level without closing the draw session', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    await seedSketchSession()

    act(() => {
      useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
      useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, 'origin')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: 'line',
      drawStage: 'toolSelected',
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(container.textContent).toContain('No Tool Selected')
  })

  it('uses the sketch draw Back toolbar action to return one level', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    await seedSketchSession()

    act(() => {
      useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const backButton = Array.from(
      container.querySelectorAll('.ViewportOverlayToolPanelTrailingActions button'),
    ).find((button) => button.textContent?.trim() === 'Back') as HTMLButtonElement | undefined

    expect(backButton).not.toBeUndefined()
    expect(backButton?.disabled).toBe(false)

    await act(async () => {
      backButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
  })

  it('cycles the sketch-plane toolbar through collapsed, essentials, and expanded body states', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const getDensityButton = () =>
      container?.querySelector('.ViewportOverlayToolPanelDensityAction') as HTMLButtonElement | null

    expect(container.querySelector('.ViewportOverlayToolPanelSectionLabel')?.textContent).toContain(
      'Plane Selection',
    )
    expect(
      Array.from(container.querySelectorAll('.ViewportOverlayToolPanelSectionLabel')).some(
        (label) => label.textContent?.includes('Transform'),
      ),
    ).toBe(true)
    expect(getDensityButton()?.textContent).toBe('+')

    await act(async () => {
      getDensityButton()?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(getDensityButton()?.textContent).toBe('-')
    expect(container.querySelector('.ViewportOverlayToolPanelSectionLabel')).toBeNull()

    await act(async () => {
      getDensityButton()?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(getDensityButton()?.textContent).toBe('e')
    expect(
      Array.from(container.querySelectorAll('.ViewportOverlayToolPanelSectionLabel')).some((label) =>
        label.textContent?.includes('Plane Selection'),
      ),
    ).toBe(true)

    await act(async () => {
      getDensityButton()?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(getDensityButton()?.textContent).toBe('+')
    expect(
      Array.from(container.querySelectorAll('.ViewportOverlayToolPanelSectionLabel')).map((label) =>
        label.textContent ?? '',
      ),
    ).toSatisfy((labels: string[]) =>
      labels.length === 2 &&
      labels[0]?.includes('Plane Selection') &&
      labels[1]?.includes('Transform'),
    )
  })

  it('lets Plane Selection collapse and expand from its text label', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const planeSelectionToggle = Array.from(
      container.querySelectorAll('.ViewportOverlayToolPanelSectionLabel button'),
    ).find((button) => button.textContent?.includes('Plane Selection')) as
      | HTMLButtonElement
      | undefined
    const planeSelectionChevron = planeSelectionToggle?.querySelector(
      '.ViewportOverlaySketchPlaneChevron',
    ) as HTMLSpanElement | null

    expect(container.textContent).toContain('Selecting Plane')
    expect(container.textContent).toContain('Done')
    expect(planeSelectionChevron?.classList.contains('isExpanded')).toBe(true)

    await act(async () => {
      planeSelectionToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).not.toContain('Selecting Plane')
    expect(container.querySelector('button.ParaSelectTrackButton[aria-label="Plane"]')).toBeNull()
    expect(planeSelectionChevron?.classList.contains('isExpanded')).toBe(false)

    await act(async () => {
      planeSelectionToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Selecting Plane')
    expect(container.querySelector('button.ParaSelectTrackButton[aria-label="Plane"]')).not.toBeNull()
    expect(planeSelectionChevron?.classList.contains('isExpanded')).toBe(true)
  })

  it('lets the expanded sketch-plane toolbar resize the top subsection with one horizontal split bar', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const splitHandle = container.querySelector(
      '.ViewportOverlayToolPanelSplitResizeHandle',
    ) as HTMLDivElement | null
    const topPane = container.querySelector(
      '.ViewportOverlayToolPanelSplitPane--top',
    ) as HTMLDivElement | null

    expect(splitHandle).not.toBeNull()
    expect(topPane).not.toBeNull()
    expect(topPane?.style.height).toBe('156px')

    await act(async () => {
      splitHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 5,
          button: 0,
          clientX: 100,
          clientY: 100,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 5,
          clientX: 100,
          clientY: 132,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 5 }))
    })

    expect(topPane?.style.height).toBe('188px')
  })

  it('cancels the viewport-first sketch-plane session from the X action', async () => {
    const { ViewportOverlay } = await import('./ViewportOverlay')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    await seedSketchPlanePickSession()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewportOverlay />)
    })

    const cancel = Array.from(
      container.querySelectorAll('.ViewportOverlaySketchPlaneSessionAction'),
    ).find((button) => button.textContent === 'X') as HTMLButtonElement | undefined

    await act(async () => {
      cancel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ViewportOverlaySketchPlaneSession')).toBeNull()
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toBeNull()
  })
})
