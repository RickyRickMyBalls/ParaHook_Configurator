// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FlyActivationMode, FlyModeType } from '../viewerBridge'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const {
  frameAllCommandMock,
  frameSelectedCommandMock,
  setCameraPresetCommandMock,
  setProjectionModeCommandMock,
} = vi.hoisted(() => ({
  frameAllCommandMock: vi.fn(),
  frameSelectedCommandMock: vi.fn(),
  setCameraPresetCommandMock: vi.fn(),
  setProjectionModeCommandMock: vi.fn(),
}))

vi.mock('../viewCommands', () => ({
  frameAllCommand: frameAllCommandMock,
  frameSelectedCommand: frameSelectedCommandMock,
  setCameraPresetCommand: setCameraPresetCommandMock,
  setProjectionModeCommand: setProjectionModeCommandMock,
}))

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

describe('ViewToolbar', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalWorker = globalThis.Worker
  const originalResizeObserver = globalThis.ResizeObserver
  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
  const originalScrollHeightDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight',
  )
  let viewToolbarPanelScrollHeight = 144
  let viewportFrameBodyHeight = 480

  beforeEach(async () => {
    vi.resetModules()
    frameAllCommandMock.mockReset()
    frameSelectedCommandMock.mockReset()
    setCameraPresetCommandMock.mockReset()
    setProjectionModeCommandMock.mockReset()
    viewToolbarPanelScrollHeight = 144
    viewportFrameBodyHeight = 480
    globalThis.Worker = MockWorker as unknown as typeof Worker
    class MockResizeObserver {
      private static readonly instances = new Set<MockResizeObserver>()
      private readonly targets = new Set<Element>()
      private readonly callback: ResizeObserverCallback

      public static notify(target: Element): void {
        for (const instance of MockResizeObserver.instances) {
          if (!instance.targets.has(target)) {
            continue
          }
          instance.callback(
            [
              {
                target,
                contentRect: target.getBoundingClientRect(),
              } as ResizeObserverEntry,
            ],
            instance as unknown as ResizeObserver,
          )
        }
      }

      public constructor(callback: ResizeObserverCallback) {
        this.callback = callback
        MockResizeObserver.instances.add(this)
      }

      public observe(target: Element): void {
        this.targets.add(target)
      }

      public disconnect(): void {
        this.targets.clear()
        MockResizeObserver.instances.delete(this)
      }
    }
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.classList.contains('ViewportFrameBody')) {
        return new DOMRect(0, 0, 320, viewportFrameBodyHeight)
      }
      if (this.classList.contains('RightPanelStack')) {
        return new DOMRect(0, 0, 320, 480)
      }
      if (this.classList.contains('ViewToolbarRoot')) {
        return new DOMRect(200, 100, 320, 180)
      }
      if (this.classList.contains('ViewToolbarPanel')) {
        return new DOMRect(200, 136, 320, viewToolbarPanelScrollHeight)
      }
      return originalGetBoundingClientRect.call(this)
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get(this: HTMLElement) {
        if (this.classList.contains('ViewToolbarRoot')) {
          return this.hasAttribute('open') ? 999 : 48
        }
        if (this.classList.contains('ViewToolbarPanel')) {
          return viewToolbarPanelScrollHeight
        }
        return originalScrollHeightDescriptor?.get?.call(this) ?? 0
      },
    })

    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useAppStore.setState({ selectedPartKey: 'part:object-1' })
    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-primary')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
    })
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
    try {
      const { setViewer } = await import('../viewerBridge')
      setViewer('model-viewer-primary', null)
      setViewer('model-viewer-secondary', null)
    } catch {
      // Ignore cleanup failures from partially initialized modules.
    }
    try {
      const { buildDispatcher } = await import('../buildDispatcher')
      buildDispatcher.dispose()
    } catch {
      // Ignore cleanup failures from partially initialized modules.
    }
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
    if (originalScrollHeightDescriptor === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollHeight')
    } else {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeightDescriptor)
    }
    if (originalResizeObserver === undefined) {
      Reflect.deleteProperty(globalThis, 'ResizeObserver')
    } else {
      globalThis.ResizeObserver = originalResizeObserver
    }
    globalThis.Worker = originalWorker
  })

  it('routes projection, camera preset, and framing through the shared view command owner seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const perspectiveButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Perspective',
    )
    const topButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Top',
    )
    const frameButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Frame',
    )
    const frameAllButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Frame All',
    )

    await act(async () => {
      perspectiveButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      topButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      frameButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      frameAllButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(setProjectionModeCommandMock).toHaveBeenCalledWith('perspective', 'model-viewer-primary')
    expect(setCameraPresetCommandMock).toHaveBeenCalledWith('top', 'model-viewer-primary')
    expect(frameSelectedCommandMock).toHaveBeenCalledWith('part:object-1', 'model-viewer-primary')
    expect(frameAllCommandMock).toHaveBeenCalledWith('model-viewer-primary')
  })

  it('renders a shared camera transition slider in Projection & Framing and syncs it to ui prefs', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const subsection = container.querySelector(
      '.CameraProjectionFramingSubsection',
    ) as HTMLDetailsElement | null
    const increaseButton = container.querySelector(
      'button[aria-label="Increase Transition"]',
    ) as HTMLButtonElement | null
    const valueButton = container.querySelector(
      'button[aria-label="Edit Transition value"]',
    ) as HTMLButtonElement | null

    expect(subsection?.textContent).toContain('Transition')
    expect(increaseButton).not.toBeNull()
    expect(valueButton?.textContent).toBe('320 ms')
    expect(useUiPrefsStore.getState().cameraShortcutTransitionDurationMs).toBe(320)

    await act(async () => {
      increaseButton?.click()
    })

    expect(useUiPrefsStore.getState().cameraShortcutTransitionDurationMs).toBe(330)
    expect(valueButton?.textContent).toBe('330 ms')
  })

  it('renders a perspective-only FOV slider in the camera section and keeps it synced to the viewer seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { setViewer } = await import('../viewerBridge')

    let perspectiveFovDeg = 60
    let onPerspectiveFovDegChange: ((fovDeg: number) => void) | null = null
    const viewer = {
      getPerspectiveFovDeg: vi.fn(() => perspectiveFovDeg),
      setPerspectiveFovDeg: vi.fn((fovDeg: number) => {
        perspectiveFovDeg = fovDeg
        onPerspectiveFovDegChange?.(perspectiveFovDeg)
      }),
      setOnPerspectiveFovDegChange: vi.fn((handler: ((fovDeg: number) => void) | null) => {
        onPerspectiveFovDegChange = handler
      }),
    }

    setViewer('model-viewer-primary', viewer as never)

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const cameraSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find((section) =>
      section.querySelector('summary')?.textContent?.includes('Camera'),
    )
    const increaseButton = container.querySelector(
      'button[aria-label="Increase FOV"]',
    ) as HTMLButtonElement | null
    const valueButton = container.querySelector(
      'button[aria-label="Edit FOV value"]',
    ) as HTMLButtonElement | null

    expect(cameraSection).toBeTruthy()
    expect(cameraSection?.textContent).toContain('FOV')
    expect(increaseButton).not.toBeNull()
    expect(valueButton?.textContent).toBe('60 deg')

    await act(async () => {
      increaseButton?.click()
    })

    expect(viewer.setPerspectiveFovDeg).toHaveBeenCalledWith(61)
    expect(valueButton?.textContent).toBe('61 deg')

    await act(async () => {
      onPerspectiveFovDegChange?.(72)
    })

    expect(valueButton?.textContent).toBe('72 deg')
  })

  it('keeps the camera FOV slider hidden while orthographic projection is active', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { setViewer } = await import('../viewerBridge')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      projectionMode: 'orthographic',
    })

    const viewer = {
      getPerspectiveFovDeg: vi.fn(() => 55),
      setPerspectiveFovDeg: vi.fn(),
      setOnPerspectiveFovDegChange: vi.fn(),
    }

    setViewer('model-viewer-primary', viewer as never)

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const cameraSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find((section) =>
      section.querySelector('summary')?.textContent?.includes('Camera'),
    )

    expect(cameraSection).toBeTruthy()
    expect(cameraSection?.textContent).not.toContain('FOV')
    expect(container.querySelector('button[aria-label="Increase FOV"]')).toBeNull()
    expect(container.querySelector('button[aria-label="Edit FOV value"]')).toBeNull()
  })

  it('keeps camera controls synchronized when projection mode toggles away from and back to perspective', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { setViewer } = await import('../viewerBridge')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    let perspectiveFovDeg = 60
    let onPerspectiveFovDegChange: ((fovDeg: number) => void) | null = null
    let clipMode: 'auto' | 'authored' = 'authored'
    let clipStart = 0.5
    let clipEnd = 300
    let onCameraClipRangeChange:
      | ((range: { mode: 'auto' | 'authored'; clipStart: number; clipEnd: number }) => void)
      | null = null
    const viewer = {
      getPerspectiveFovDeg: vi.fn(() => perspectiveFovDeg),
      setPerspectiveFovDeg: vi.fn((fovDeg: number) => {
        perspectiveFovDeg = fovDeg
        onPerspectiveFovDegChange?.(perspectiveFovDeg)
      }),
      setOnPerspectiveFovDegChange: vi.fn((handler: ((fovDeg: number) => void) | null) => {
        onPerspectiveFovDegChange = handler
      }),
      getCameraClipRange: vi.fn(() => ({
        mode: clipMode,
        clipStart,
        clipEnd,
      })),
      setCameraClipRange: vi.fn((range: { clipStart?: number; clipEnd?: number }) => {
        clipMode = 'authored'
        clipStart = range.clipStart ?? clipStart
        clipEnd = range.clipEnd ?? clipEnd
        onCameraClipRangeChange?.({
          mode: clipMode,
          clipStart,
          clipEnd,
        })
      }),
      setOnCameraClipRangeChange: vi.fn(
        (
          handler:
            | ((range: { mode: 'auto' | 'authored'; clipStart: number; clipEnd: number }) => void)
            | null,
        ) => {
          onCameraClipRangeChange = handler
        },
      ),
      resetCameraClipRange: vi.fn(() => {
        clipMode = 'auto'
        clipStart = 0.1
        clipEnd = 1000
        onCameraClipRangeChange?.({
          mode: clipMode,
          clipStart,
          clipEnd,
        })
      }),
    }

    setViewer('model-viewer-primary', viewer as never)

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const getCameraSection = () =>
      Array.from(container?.querySelectorAll('.ViewStyledSection') ?? []).find((section) =>
        section.querySelector('summary')?.textContent?.includes('Camera'),
      )

    expect(getCameraSection()?.textContent).toContain('FOV')
    expect(getCameraSection()?.textContent).toContain('Clip Start')
    expect(getCameraSection()?.textContent).toContain('Clip End')
    expect(getCameraSection()?.textContent).toContain('Clip: Authored. Start stays before end.')
    expect(
      (container?.querySelector(
        'button[aria-label="Edit FOV value"]',
      ) as HTMLButtonElement | null)?.textContent,
    ).toBe('60 deg')

    await act(async () => {
      useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
        projectionMode: 'orthographic',
      })
    })

    expect(getCameraSection()?.textContent).not.toContain('FOV')
    expect(getCameraSection()?.textContent).toContain('Clip Start')
    expect(getCameraSection()?.textContent).toContain('Clip End')
    expect(getCameraSection()?.textContent).toContain('Clip: Authored. Start stays before end.')
    expect(container?.querySelector('button[aria-label="Increase FOV"]')).toBeNull()
    expect(container?.querySelector('button[aria-label="Edit FOV value"]')).toBeNull()

    await act(async () => {
      perspectiveFovDeg = 72
      onPerspectiveFovDegChange?.(perspectiveFovDeg)
      clipMode = 'auto'
      clipStart = 0.1
      clipEnd = 1000
      onCameraClipRangeChange?.({
        mode: clipMode,
        clipStart,
        clipEnd,
      })
    })

    expect(getCameraSection()?.textContent).toContain('Clip: Auto. Distance driven.')

    await act(async () => {
      useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
        projectionMode: 'perspective',
      })
    })

    expect(getCameraSection()?.textContent).toContain('FOV')
    expect(getCameraSection()?.textContent).toContain('Clip Start')
    expect(getCameraSection()?.textContent).toContain('Clip End')
    expect(getCameraSection()?.textContent).toContain('Clip: Auto. Distance driven.')
    expect(
      (container?.querySelector(
        'button[aria-label="Edit FOV value"]',
      ) as HTMLButtonElement | null)?.textContent,
    ).toBe('72 deg')
    expect(
      Array.from(container?.querySelectorAll('button') ?? []).find(
        (button) => button.textContent === 'Auto Clip',
      ),
    ).toBeUndefined()
  })

  it('renders Clip Start and Clip End sliders in the camera section and keeps them synced to the viewer seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { setViewer } = await import('../viewerBridge')

    let clipStart = 0.5
    let clipEnd = 300
    let onCameraClipRangeChange:
      | ((range: { mode: 'auto' | 'authored'; clipStart: number; clipEnd: number }) => void)
      | null = null
    const viewer = {
      getCameraClipRange: vi.fn(() => ({
        mode: 'authored' as const,
        clipStart,
        clipEnd,
      })),
      setCameraClipRange: vi.fn((range: { clipStart?: number; clipEnd?: number }) => {
        clipStart = range.clipStart ?? clipStart
        clipEnd = range.clipEnd ?? clipEnd
        onCameraClipRangeChange?.({
          mode: 'authored',
          clipStart,
          clipEnd,
        })
      }),
      setOnCameraClipRangeChange: vi.fn(
        (
          handler:
            | ((range: { mode: 'auto' | 'authored'; clipStart: number; clipEnd: number }) => void)
            | null,
        ) => {
          onCameraClipRangeChange = handler
        },
      ),
      resetCameraClipRange: vi.fn(() => {
        clipStart = 0.1
        clipEnd = 1000
        onCameraClipRangeChange?.({
          mode: 'auto',
          clipStart,
          clipEnd,
        })
      }),
    }

    setViewer('model-viewer-primary', viewer as never)

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const cameraSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find((section) =>
      section.querySelector('summary')?.textContent?.includes('Camera'),
    )
    const clipStartIncreaseButton = container.querySelector(
      'button[aria-label="Increase Clip Start"]',
    ) as HTMLButtonElement | null
    const clipEndIncreaseButton = container.querySelector(
      'button[aria-label="Increase Clip End"]',
    ) as HTMLButtonElement | null
    const clipStartValueButton = container.querySelector(
      'button[aria-label="Edit Clip Start value"]',
    ) as HTMLButtonElement | null
    const clipEndValueButton = container.querySelector(
      'button[aria-label="Edit Clip End value"]',
    ) as HTMLButtonElement | null

    expect(cameraSection).toBeTruthy()
    expect(cameraSection?.textContent).toContain('Clip Start')
    expect(cameraSection?.textContent).toContain('Clip End')
    expect(cameraSection?.textContent).toContain('Clip: Authored. Start stays before end.')
    expect(clipStartIncreaseButton).not.toBeNull()
    expect(clipEndIncreaseButton).not.toBeNull()
    expect(clipStartValueButton?.textContent).toBe('0.5')
    expect(clipEndValueButton?.textContent).toBe('300')
    expect(container.querySelectorAll('button').length).toBeGreaterThan(0)

    await act(async () => {
      clipStartIncreaseButton?.click()
      clipEndIncreaseButton?.click()
    })

    expect(viewer.setCameraClipRange).toHaveBeenCalledWith({ clipStart: 0.51 })
    expect(viewer.setCameraClipRange).toHaveBeenCalledWith({ clipEnd: 301 })
    expect(clipStartValueButton?.textContent).toBe('0.51')
    expect(clipEndValueButton?.textContent).toBe('301')

    await act(async () => {
      onCameraClipRangeChange?.({
        mode: 'authored',
        clipStart: 1.25,
        clipEnd: 150,
      })
    })

    expect(clipStartValueButton?.textContent).toBe('1.25')
    expect(clipEndValueButton?.textContent).toBe('150')
  })

  it('offers an Auto Clip reset button that returns the clip seam to auto mode', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { setViewer } = await import('../viewerBridge')

    let clipStart = 0.5
    let clipEnd = 300
    let clipMode: 'auto' | 'authored' = 'authored'
    let onCameraClipRangeChange:
      | ((range: { mode: 'auto' | 'authored'; clipStart: number; clipEnd: number }) => void)
      | null = null
    const viewer = {
      getCameraClipRange: vi.fn(() => ({
        mode: clipMode,
        clipStart,
        clipEnd,
      })),
      setCameraClipRange: vi.fn(),
      setOnCameraClipRangeChange: vi.fn(
        (
          handler:
            | ((range: { mode: 'auto' | 'authored'; clipStart: number; clipEnd: number }) => void)
            | null,
        ) => {
          onCameraClipRangeChange = handler
        },
      ),
      resetCameraClipRange: vi.fn(() => {
        clipMode = 'auto'
        clipStart = 0.1
        clipEnd = 1000
        onCameraClipRangeChange?.({
          mode: clipMode,
          clipStart,
          clipEnd,
        })
      }),
    }

    setViewer('model-viewer-primary', viewer as never)

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const autoClipButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Auto Clip',
    ) as HTMLButtonElement | undefined

    expect(autoClipButton).toBeDefined()

    await act(async () => {
      autoClipButton?.click()
    })

    expect(viewer.resetCameraClipRange).toHaveBeenCalledTimes(1)
    expect(container.textContent).toContain('Clip: Auto. Distance driven.')
    expect(Array.from(container.querySelectorAll('button')).find((button) => button.textContent === 'Auto Clip')).toBeUndefined()
  })

  it('groups projection and framing into a collapsible lower camera subsection without changing command routing', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { setViewer } = await import('../viewerBridge')

    let perspectiveFovDeg = 60
    let onPerspectiveFovDegChange: ((fovDeg: number) => void) | null = null
    let clipMode: 'auto' | 'authored' = 'authored'
    let clipStart = 0.5
    let clipEnd = 300
    let onCameraClipRangeChange:
      | ((range: { mode: 'auto' | 'authored'; clipStart: number; clipEnd: number }) => void)
      | null = null
    const viewer = {
      getPerspectiveFovDeg: vi.fn(() => perspectiveFovDeg),
      setPerspectiveFovDeg: vi.fn((fovDeg: number) => {
        perspectiveFovDeg = fovDeg
        onPerspectiveFovDegChange?.(perspectiveFovDeg)
      }),
      setOnPerspectiveFovDegChange: vi.fn((handler: ((fovDeg: number) => void) | null) => {
        onPerspectiveFovDegChange = handler
      }),
      getCameraClipRange: vi.fn(() => ({
        mode: clipMode,
        clipStart,
        clipEnd,
      })),
      setCameraClipRange: vi.fn((range: { clipStart?: number; clipEnd?: number }) => {
        clipMode = 'authored'
        clipStart = range.clipStart ?? clipStart
        clipEnd = range.clipEnd ?? clipEnd
        onCameraClipRangeChange?.({
          mode: clipMode,
          clipStart,
          clipEnd,
        })
      }),
      setOnCameraClipRangeChange: vi.fn(
        (
          handler:
            | ((range: { mode: 'auto' | 'authored'; clipStart: number; clipEnd: number }) => void)
            | null,
        ) => {
          onCameraClipRangeChange = handler
        },
      ),
      resetCameraClipRange: vi.fn(() => {
        clipMode = 'auto'
        clipStart = 0.1
        clipEnd = 1000
        onCameraClipRangeChange?.({
          mode: clipMode,
          clipStart,
          clipEnd,
        })
      }),
    }

    setViewer('model-viewer-primary', viewer as never)

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const cameraSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find((section) =>
      section.querySelector('summary')?.textContent?.includes('Camera'),
    )
    const autoClipButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Auto Clip',
    ) as HTMLButtonElement | undefined
    const subsection = container.querySelector(
      '.CameraProjectionFramingSubsection',
    ) as HTMLDetailsElement | null
    const subsectionSummary = subsection?.querySelector('summary') as HTMLElement | null

    expect(cameraSection).toBeTruthy()
    expect(autoClipButton).toBeDefined()
    expect(subsection).not.toBeNull()
    expect(subsectionSummary?.textContent).toBe('Projection & Framing')
    expect(subsection?.open).toBe(true)
    expect(
      (autoClipButton?.compareDocumentPosition(subsection as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(subsection?.textContent).toContain('Perspective')
    expect(subsection?.textContent).toContain('Orthographic')
    expect(subsection?.textContent).toContain('Frame')
    expect(subsection?.textContent).toContain('Frame All')

    await act(async () => {
      if (subsection !== null) {
        subsection.open = false
        subsection.dispatchEvent(new Event('toggle'))
      }
    })

    expect(subsection?.open).toBe(false)
    expect(subsection?.textContent).toContain('Projection & Framing')
    expect(subsection?.textContent).not.toContain('Perspective')
    expect(subsection?.textContent).not.toContain('Orthographic')
    expect(subsection?.textContent).not.toContain('Frame All')
    expect(
      Array.from(subsection?.querySelectorAll('button') ?? []).find(
        (button) => button.textContent === 'Perspective',
      ),
    ).toBeUndefined()

    await act(async () => {
      if (subsection !== null) {
        subsection.open = true
        subsection.dispatchEvent(new Event('toggle'))
      }
    })

    const perspectiveButton = Array.from(subsection?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'Perspective',
    ) as HTMLButtonElement | undefined
    const topButton = Array.from(subsection?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'Top',
    ) as HTMLButtonElement | undefined
    const frameButton = Array.from(subsection?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'Frame',
    ) as HTMLButtonElement | undefined
    const frameAllButton = Array.from(subsection?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'Frame All',
    ) as HTMLButtonElement | undefined

    expect(subsection?.open).toBe(true)
    expect(perspectiveButton).toBeDefined()
    expect(topButton).toBeDefined()
    expect(frameButton).toBeDefined()
    expect(frameAllButton).toBeDefined()

    await act(async () => {
      perspectiveButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      topButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      frameButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      frameAllButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(setProjectionModeCommandMock).toHaveBeenCalledWith('perspective', 'model-viewer-primary')
    expect(setCameraPresetCommandMock).toHaveBeenCalledWith('top', 'model-viewer-primary')
    expect(frameSelectedCommandMock).toHaveBeenCalledWith('part:object-1', 'model-viewer-primary')
    expect(frameAllCommandMock).toHaveBeenCalledWith('model-viewer-primary')
  })

  it('keeps Clip Start and Clip End visible in orthographic mode while FOV stays hidden', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { setViewer } = await import('../viewerBridge')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      projectionMode: 'orthographic',
    })

    const viewer = {
      getCameraClipRange: vi.fn(() => ({
        mode: 'auto' as const,
        clipStart: 0.1,
        clipEnd: 1000,
      })),
      setCameraClipRange: vi.fn(),
      setOnCameraClipRangeChange: vi.fn(),
      resetCameraClipRange: vi.fn(),
      getPerspectiveFovDeg: vi.fn(() => 55),
      setPerspectiveFovDeg: vi.fn(),
      setOnPerspectiveFovDegChange: vi.fn(),
    }

    setViewer('model-viewer-primary', viewer as never)

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const cameraSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find((section) =>
      section.querySelector('summary')?.textContent?.includes('Camera'),
    )

    expect(cameraSection).toBeTruthy()
    expect(cameraSection?.textContent).not.toContain('FOV')
    expect(cameraSection?.textContent).toContain('Clip Start')
    expect(cameraSection?.textContent).toContain('Clip End')
    expect(cameraSection?.textContent).toContain('Clip: Auto. Distance driven.')
    expect(container.querySelector('button[aria-label="Increase FOV"]')).toBeNull()
    expect(container.querySelector('button[aria-label="Edit FOV value"]')).toBeNull()
    expect(container.querySelector('button[aria-label="Increase Clip Start"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Increase Clip End"]')).not.toBeNull()
  })

  it('keeps toolbar open state local to the clicked model viewport', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-secondary')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-secondary', {
      viewToolbarOpen: false,
      viewToolbarCompactAxisWidgetSize: 96,
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <>
          <ViewToolbar viewportId="model-viewer-primary" />
          <ViewToolbar viewportId="model-viewer-secondary" />
        </>,
      )
    })

    const toolbarRoots = Array.from(
      container.querySelectorAll('.ViewToolbarRoot'),
    ) as HTMLDetailsElement[]
    const rightDocks = Array.from(container.querySelectorAll('.RightDock')) as HTMLElement[]
    const scrollSurfaces = Array.from(
      container.querySelectorAll('.ViewToolbarScrollSurface'),
    ) as HTMLDetailsElement[]
    expect(toolbarRoots).toHaveLength(2)
    expect(rightDocks).toHaveLength(2)
    expect(scrollSurfaces).toHaveLength(2)
    expect(toolbarRoots[0]?.open).toBe(true)
    expect(toolbarRoots[1]?.open).toBe(false)
    expect(rightDocks[0]?.style.paddingTop).toBe('332px')
    expect(rightDocks[1]?.style.paddingTop).toBe('120px')
    expect(scrollSurfaces[0]?.classList.contains('ViewToolbarRoot')).toBe(true)
    expect(scrollSurfaces[1]?.classList.contains('ViewToolbarRoot')).toBe(true)
    expect(scrollSurfaces[0]?.style.getPropertyValue('--v15-view-toolbar-max-height')).toBe('435px')
    expect(scrollSurfaces[1]?.style.getPropertyValue('--v15-view-toolbar-max-height')).toBe('435px')
    expect(scrollSurfaces[0]?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('180px')
    expect(scrollSurfaces[1]?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('48px')
    expect(scrollSurfaces[0]?.dataset.scrollable).toBe('false')
    expect(scrollSurfaces[1]?.dataset.scrollable).toBe('false')

    const toggles = Array.from(container.querySelectorAll('.ViewToolbarToggle')) as HTMLElement[]
    expect(toggles).toHaveLength(2)

    await act(async () => {
      toggles[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarOpen,
    ).toBe(false)
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState
        .viewToolbarOpen,
    ).toBe(false)

    await act(async () => {
      toggles[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarOpen,
    ).toBe(false)
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState
        .viewToolbarOpen,
    ).toBe(true)
  })

  it('keeps toolbar presentation mode local to the selected model viewport', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-secondary')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-secondary', {
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'tabs',
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <>
          <ViewToolbar viewportId="model-viewer-primary" />
          <ViewToolbar viewportId="model-viewer-secondary" />
        </>,
      )
    })

    const presentationSelects = Array.from(
      container.querySelectorAll('.ParaSelectNative[aria-label="Presentation"]'),
    ) as HTMLSelectElement[]
    expect(presentationSelects).toHaveLength(2)
    expect(presentationSelects[0]?.value).toBe('classic')
    expect(presentationSelects[1]?.value).toBe('tabs')

    await act(async () => {
      presentationSelects[0]!.value = 'tabs'
      presentationSelects[0]?.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarExpandedPresentationMode,
    ).toBe('tabs')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState
        .viewToolbarExpandedPresentationMode,
    ).toBe('tabs')

    await act(async () => {
      presentationSelects[1]!.value = 'classic'
      presentationSelects[1]?.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarExpandedPresentationMode,
    ).toBe('tabs')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState
        .viewToolbarExpandedPresentationMode,
    ).toBe('classic')
  })

  it('keeps toolbar dock mode local and updates the expanded top-right anchor', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-secondary')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-secondary', {
      viewToolbarOpen: true,
      viewToolbarDockMode: 'top-right-cluster',
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <>
          <ViewToolbar viewportId="model-viewer-primary" />
          <ViewToolbar viewportId="model-viewer-secondary" />
        </>,
      )
    })

    const dockSelects = Array.from(
      container.querySelectorAll('.ParaSelectNative[aria-label="Dock"]'),
    ) as HTMLSelectElement[]
    const rightDocks = Array.from(container.querySelectorAll('.RightDock')) as HTMLElement[]
    expect(dockSelects).toHaveLength(2)
    expect(rightDocks).toHaveLength(2)
    expect(dockSelects[0]?.value).toBe('below-axis')
    expect(dockSelects[1]?.value).toBe('top-right-cluster')
    expect(rightDocks[0]?.dataset.viewToolbarDockMode).toBe('below-axis')
    expect(rightDocks[1]?.dataset.viewToolbarDockMode).toBe('top-right-cluster')
    expect(rightDocks[0]?.style.paddingTop).toBe('332px')
    expect(rightDocks[1]?.style.paddingTop).toBe('12px')

    await act(async () => {
      dockSelects[0]!.value = 'top-right-cluster'
      dockSelects[0]?.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarDockMode,
    ).toBe('top-right-cluster')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState
        .viewToolbarDockMode,
    ).toBe('top-right-cluster')
    expect(rightDocks[0]?.dataset.viewToolbarDockMode).toBe('top-right-cluster')
    expect(rightDocks[0]?.style.paddingTop).toBe('12px')

    await act(async () => {
      dockSelects[1]!.value = 'below-axis'
      dockSelects[1]?.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarDockMode,
    ).toBe('top-right-cluster')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState
        .viewToolbarDockMode,
    ).toBe('below-axis')
    expect(rightDocks[1]?.dataset.viewToolbarDockMode).toBe('below-axis')
    expect(rightDocks[1]?.style.paddingTop).toBe('332px')
  })

  it('opens an expanded-toolbar presentation context menu that syncs with the viewport-local select', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-secondary')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-secondary', {
      viewToolbarOpen: false,
      viewToolbarExpandedPresentationMode: 'classic',
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <>
          <ViewToolbar viewportId="model-viewer-primary" />
          <ViewToolbar viewportId="model-viewer-secondary" />
        </>,
      )
    })

    const toolbarToggles = Array.from(
      container.querySelectorAll('.ViewToolbarToggle'),
    ) as HTMLElement[]
    expect(toolbarToggles).toHaveLength(2)

    await act(async () => {
      toolbarToggles[1]?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 220,
          clientY: 180,
        }),
      )
    })

    expect(container.querySelector('.ViewToolbarContextMenu')).toBeNull()

    await act(async () => {
      toolbarToggles[0]?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 220,
          clientY: 180,
        }),
      )
    })

    const contextMenu = container.querySelector('.ViewToolbarContextMenu') as HTMLDivElement | null
    expect(contextMenu).not.toBeNull()

    const menuItems = Array.from(
      container.querySelectorAll('.ViewToolbarContextMenu .SpaghettiContextMenuItem'),
    ) as HTMLButtonElement[]
    const classicItem = menuItems.find((item) => item.textContent === 'Classic')
    const tabsItem = menuItems.find((item) => item.textContent === 'Tabs')

    expect(classicItem).not.toBeUndefined()
    expect(tabsItem).not.toBeUndefined()
    expect(classicItem?.disabled).toBe(true)
    expect(tabsItem?.disabled).toBe(false)

    await act(async () => {
      tabsItem?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ViewToolbarContextMenu')).toBeNull()
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarExpandedPresentationMode,
    ).toBe('tabs')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState
        .viewToolbarExpandedPresentationMode,
    ).toBe('classic')

    const viewTabButton = Array.from(container.querySelectorAll('.ViewToolbarTabButton')).find(
      (button) => button.textContent === 'View',
    ) as HTMLButtonElement | undefined
    expect(viewTabButton).toBeDefined()

    await act(async () => {
      viewTabButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const presentationSelects = Array.from(
      container.querySelectorAll('.ParaSelectNative[aria-label="Presentation"]'),
    ) as HTMLSelectElement[]
    expect(presentationSelects).toHaveLength(2)
    expect(presentationSelects.map((select) => select.value).sort()).toEqual(['classic', 'tabs'])

    await act(async () => {
      toolbarToggles[0]?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 240,
          clientY: 200,
        }),
      )
    })

    const reopenedMenuItems = Array.from(
      container.querySelectorAll('.ViewToolbarContextMenu .SpaghettiContextMenuItem'),
    ) as HTMLButtonElement[]
    const reopenedClassicItem = reopenedMenuItems.find((item) => item.textContent === 'Classic')
    const reopenedTabsItem = reopenedMenuItems.find((item) => item.textContent === 'Tabs')

    expect(reopenedClassicItem?.disabled).toBe(false)
    expect(reopenedTabsItem?.disabled).toBe(true)
  })

  it('renders tabs mode with the full section rail and keeps camera commands functional', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'tabs',
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const tabButtons = Array.from(
      container.querySelectorAll('.ViewToolbarTabButton'),
    ) as HTMLButtonElement[]
    expect(tabButtons.map((button) => button.textContent)).toEqual([
      'Camera',
      'Fly Mode',
      'Transform',
      'Snap',
      'Gizmo',
      'View',
      'Environment',
      'Ground',
      'Materials',
    ])
    expect(container.querySelectorAll('[data-tab-active="true"]')).toHaveLength(1)

    const viewTabButton = tabButtons.find((button) => button.textContent === 'View')
    expect(viewTabButton).not.toBeUndefined()

    await act(async () => {
      viewTabButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const activeViewSection = container.querySelector(
      '[data-view-toolbar-section="view"][data-tab-active="true"]',
    ) as HTMLDetailsElement | null
    expect(activeViewSection).not.toBeNull()
    expect(container.querySelector('.ParaSelectNative[aria-label="Presentation"]')).not.toBeNull()

    const cameraTabButton = tabButtons.find((button) => button.textContent === 'Camera')
    expect(cameraTabButton).not.toBeUndefined()

    await act(async () => {
      cameraTabButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const orthographicButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Orthographic',
    )
    expect(orthographicButton).not.toBeUndefined()

    await act(async () => {
      orthographicButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(setProjectionModeCommandMock).toHaveBeenCalledWith('orthographic', 'model-viewer-primary')
  })

  it('restores the remembered active tab per viewport after remounting tabs mode', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-secondary')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'tabs',
      viewToolbarActiveTab: 'view',
    })
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-secondary', {
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'tabs',
      viewToolbarActiveTab: 'ground',
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    const renderToolbarPair = async () => {
      await act(async () => {
        root?.render(
          <>
            <ViewToolbar viewportId="model-viewer-primary" />
            <ViewToolbar viewportId="model-viewer-secondary" />
          </>,
        )
      })
    }

    await renderToolbarPair()

    const primaryDock = container.querySelector(
      '.RightDock[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLElement | null
    const secondaryDock = container.querySelector(
      '.RightDock[data-workspace-viewport-id="model-viewer-secondary"]',
    ) as HTMLElement | null

    expect(primaryDock).not.toBeNull()
    expect(secondaryDock).not.toBeNull()
    expect(
      primaryDock?.querySelector('[data-view-toolbar-section="view"][data-tab-active="true"]'),
    ).not.toBeNull()
    expect(
      secondaryDock?.querySelector(
        '[data-view-toolbar-section="ground"][data-tab-active="true"]',
      ),
    ).not.toBeNull()

    await act(async () => {
      root?.unmount()
    })

    root = createRoot(container)
    await renderToolbarPair()

    const remountedPrimaryDock = container.querySelector(
      '.RightDock[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLElement | null
    const remountedSecondaryDock = container.querySelector(
      '.RightDock[data-workspace-viewport-id="model-viewer-secondary"]',
    ) as HTMLElement | null

    expect(
      remountedPrimaryDock?.querySelector(
        '[data-view-toolbar-section="view"][data-tab-active="true"]',
      ),
    ).not.toBeNull()
    expect(
      remountedSecondaryDock?.querySelector(
        '[data-view-toolbar-section="ground"][data-tab-active="true"]',
      ),
    ).not.toBeNull()
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarActiveTab,
    ).toBe('view')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState
        .viewToolbarActiveTab,
    ).toBe('ground')
  })

  it('renders para-style view-level environment controls and keeps them on the shared view seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const viewSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find((section) =>
      section.querySelector('summary')?.textContent?.includes('View'),
    )
    const shadowsSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Shadows"]',
    ) as HTMLSelectElement | null
    const toneMappingSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Tone Mapping"]',
    ) as HTMLSelectElement | null
    const increaseExposureButton = container.querySelector(
      'button[aria-label="Increase Exposure"]',
    ) as HTMLButtonElement | null

    expect(viewSection).toBeTruthy()
    expect(viewSection?.textContent).toContain('Shadows')
    expect(viewSection?.textContent).toContain('Tone Mapping')
    expect(viewSection?.textContent).not.toContain('Exposure Value')
    expect(shadowsSelect).not.toBeNull()
    expect(toneMappingSelect).not.toBeNull()
    expect(increaseExposureButton).not.toBeNull()

    await act(async () => {
      if (shadowsSelect !== null) {
        shadowsSelect.value = 'off'
        shadowsSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (toneMappingSelect !== null) {
        toneMappingSelect.value = 'none'
        toneMappingSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      increaseExposureButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(useUiPrefsStore.getState().view.shadowsEnabled).toBe(false)
    expect(useUiPrefsStore.getState().view.toneMapping).toBe('none')
    expect(useUiPrefsStore.getState().view.exposure).toBe(1.2)
  })

  it('renders a dedicated ground section and routes its controls into the shared ground view seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const groundSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find((section) =>
      section.querySelector('summary')?.textContent?.includes('Ground'),
    )
    const groundSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Ground"]',
    ) as HTMLSelectElement | null
    const materialSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Material"]',
    ) as HTMLSelectElement | null
    const increaseHeightButton = container.querySelector(
      'button[aria-label="Increase Ground Height"]',
    ) as HTMLButtonElement | null

    expect(groundSection).toBeTruthy()
    expect(groundSection?.textContent).toContain('Ground Height')
    expect(groundSection?.textContent).toContain('Material')
    expect(groundSelect).not.toBeNull()
    expect(materialSelect).not.toBeNull()
    expect(increaseHeightButton).not.toBeNull()

    await act(async () => {
      if (groundSelect !== null) {
        groundSelect.value = 'on'
        groundSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
    await act(async () => {
      increaseHeightButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    await act(async () => {
      if (materialSelect !== null) {
        materialSelect.value = 'glossy_studio'
        materialSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.ground).toEqual({
      enabled: true,
      height: 0.5,
      materialPresetId: 'glossy_studio',
    })
  })

  it('publishes gizmo style controls into the shared axis-overlay style seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const mainLinesIncreaseButton = container.querySelector(
      'button[aria-label="Increase Main Lines"]',
    ) as HTMLButtonElement | null
    const otherLinesDecreaseButton = container.querySelector(
      'button[aria-label="Decrease Other Lines"]',
    ) as HTMLButtonElement | null
    const sphereSizeIncreaseButton = container.querySelector(
      'button[aria-label="Increase Sphere Size"]',
    ) as HTMLButtonElement | null
    const cameraDollyIncreaseButton = container.querySelector(
      'button[aria-label="Increase Camera Dolly"]',
    ) as HTMLButtonElement | null
    const labelsSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Labels"]',
    ) as HTMLSelectElement | null
    const backgroundSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Background"]',
    ) as HTMLSelectElement | null
    const textSizeSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Text Size"]',
    ) as HTMLSelectElement | null

    expect(mainLinesIncreaseButton).not.toBeNull()
    expect(otherLinesDecreaseButton).not.toBeNull()
    expect(sphereSizeIncreaseButton).not.toBeNull()
    expect(cameraDollyIncreaseButton).not.toBeNull()
    expect(labelsSelect).not.toBeNull()
    expect(backgroundSelect).not.toBeNull()
    expect(textSizeSelect).not.toBeNull()

    await act(async () => {
      mainLinesIncreaseButton?.click()
      otherLinesDecreaseButton?.click()
      sphereSizeIncreaseButton?.click()
      cameraDollyIncreaseButton?.click()
      if (labelsSelect !== null) {
        labelsSelect.value = 'off'
        labelsSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (backgroundSelect !== null) {
        backgroundSelect.value = 'blur'
        backgroundSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (textSizeSelect !== null) {
        textSizeSelect.value = 'large'
        textSizeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.axisOverlayStyle).toEqual({
      mainLineOpacity: 0.52,
      secondaryLineOpacity: 0.08,
      sphereScale: 1.05,
      cameraDistance: 4.55,
      labelsVisible: false,
      backgroundMode: 'blur',
      backgroundOpacity: 0,
      labelSize: 'large',
    })
  })

  it('splits transform and snap controls out of gizmo while keeping gizmo style controls in gizmo', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const sections = Array.from(container.querySelectorAll('.ViewStyledSection')) as HTMLElement[]
    const transformSection = sections.find((section) =>
      section.querySelector('summary')?.textContent?.includes('Transform'),
    )
    const snapSection = sections.find((section) =>
      section.querySelector('summary')?.textContent?.includes('Snap'),
    )
    const gizmoSection = sections.find((section) =>
      section.querySelector('summary')?.textContent?.includes('Gizmo'),
    )

    expect(transformSection).toBeTruthy()
    expect(snapSection).toBeTruthy()
    expect(gizmoSection).toBeTruthy()
    expect(transformSection?.textContent).toContain('Gizmo Off')
    expect(transformSection?.textContent).toContain('Mode: translate')
    expect(transformSection?.textContent).not.toContain('Main Lines')
    expect(transformSection?.textContent).not.toContain('Sphere Size')
    expect(transformSection?.textContent).not.toContain('Move Snap')
    expect(transformSection?.textContent).not.toContain('Apply Snap')

    expect(snapSection?.textContent).toContain('Move Snap')
    expect(snapSection?.textContent).toContain('Rot Snap')
    expect(snapSection?.textContent).toContain('Scale Snap')
    expect(snapSection?.textContent).toContain('Apply Snap')
    expect(snapSection?.textContent).not.toContain('Mode: translate')
    expect(snapSection?.textContent).not.toContain('Main Lines')

    expect(gizmoSection?.textContent).toContain('Main Lines')
    expect(gizmoSection?.textContent).toContain('Other Lines')
    expect(gizmoSection?.textContent).toContain('Sphere Size')
    expect(gizmoSection?.textContent).toContain('Camera Dolly')
    expect(gizmoSection?.textContent).toContain('Labels')
    expect(gizmoSection?.textContent).toContain('Background')
    expect(gizmoSection?.textContent).toContain('Text Size')
    expect(gizmoSection?.textContent).not.toContain('Apply Snap')
    expect(gizmoSection?.textContent).not.toContain('Mode: translate')
  })

  it('adds a fly-mode section that routes roll-speed changes through the viewer fly-roll seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { setViewer } = await import('../viewerBridge')

    let flyModeType: FlyModeType = 'drone'
    let onFlyModeTypeChange: ((mode: FlyModeType) => void) | null = null
    let flyActivationMode: FlyActivationMode = 'right-click'
    let onFlyActivationModeChange: ((mode: FlyActivationMode) => void) | null = null
    let flyRollSpeed = Math.PI * 0.75
    let onFlyRollSpeedChange: ((speed: number) => void) | null = null
    const viewer = {
      getFlyModeType: vi.fn(() => flyModeType),
      setFlyModeType: vi.fn((mode: FlyModeType) => {
        flyModeType = mode
        onFlyModeTypeChange?.(flyModeType)
      }),
      setOnFlyModeTypeChange: vi.fn((handler: ((mode: FlyModeType) => void) | null) => {
        onFlyModeTypeChange = handler
      }),
      getFlyActivationMode: vi.fn(() => flyActivationMode),
      setFlyActivationMode: vi.fn((mode: FlyActivationMode) => {
        flyActivationMode = mode
        onFlyActivationModeChange?.(flyActivationMode)
      }),
      setOnFlyActivationModeChange: vi.fn(
        (handler: ((mode: FlyActivationMode) => void) | null) => {
          onFlyActivationModeChange = handler
        },
      ),
      getFlyRollSpeed: vi.fn(() => flyRollSpeed),
      setFlyRollSpeed: vi.fn((speed: number) => {
        flyRollSpeed = speed
        onFlyRollSpeedChange?.(flyRollSpeed)
      }),
      setOnFlyRollSpeedChange: vi.fn((handler: ((speed: number) => void) | null) => {
        onFlyRollSpeedChange = handler
      }),
    }

    setViewer('model-viewer-primary', viewer as never)

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const flyModeSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find((section) =>
      section.querySelector('summary')?.textContent?.includes('Fly Mode'),
    )
    const increaseButton = container.querySelector(
      'button[aria-label="Increase Roll Speed"]',
    ) as HTMLButtonElement | null
    const flyModeTypeSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Fly Mode Type"]',
    ) as HTMLSelectElement | null
    const activationModeSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Fly Mode Activate"]',
    ) as HTMLSelectElement | null
    const valueButton = container.querySelector(
      'button[aria-label="Edit Roll Speed value"]',
    ) as HTMLButtonElement | null

    expect(flyModeSection).toBeTruthy()
    expect(flyModeSection?.textContent).toContain('Fly Mode Type')
    expect(flyModeSection?.textContent).toContain('Fly Mode Activate')
    expect(flyModeSection?.textContent).toContain('Roll Speed')
    expect(flyModeSection?.textContent).toContain('Drone')
    expect(flyModeSection?.textContent).toContain('Right Click')
    expect(flyModeSection?.textContent).toContain('135 deg/s')
    expect(flyModeTypeSelect).not.toBeNull()
    expect(activationModeSelect).not.toBeNull()
    expect(increaseButton).not.toBeNull()
    expect(valueButton?.textContent).toBe('135 deg/s')

    await act(async () => {
      if (flyModeTypeSelect !== null) {
        flyModeTypeSelect.value = 'free-cam'
        flyModeTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (activationModeSelect !== null) {
        activationModeSelect.value = 'always-on'
        activationModeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      increaseButton?.click()
    })

    expect(viewer.setFlyModeType).toHaveBeenCalledWith('free-cam')
    expect(viewer.setFlyActivationMode).toHaveBeenCalledWith('always-on')
    expect(viewer.setFlyRollSpeed).toHaveBeenCalledWith(2.4062)
    expect(flyModeSection?.textContent).toContain('Free Cam')
    expect(flyModeSection?.textContent).toContain('Always On')
    expect(valueButton?.textContent).toBe('138 deg/s')
  })

  it('recomputes used height when subsections collapse without shrinking the closed shell', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const toolbarRoot = container.querySelector('.ViewToolbarRoot') as HTMLDetailsElement | null
    const cameraSection = container.querySelector('.CameraSection') as HTMLDetailsElement | null
    const toolbarPanel = container.querySelector('.ViewToolbarPanel') as HTMLDivElement | null
    expect(toolbarRoot).not.toBeNull()
    expect(cameraSection).not.toBeNull()
    expect(toolbarPanel).not.toBeNull()
    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('180px')
    expect(toolbarRoot?.dataset.scrollable).toBe('false')

    viewToolbarPanelScrollHeight = 76
    await act(async () => {
      cameraSection?.dispatchEvent(new Event('toggle'))
    })

    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('112px')
    expect(toolbarRoot?.dataset.scrollable).toBe('false')

    viewToolbarPanelScrollHeight = 484
    await act(async () => {
      cameraSection?.dispatchEvent(new Event('toggle'))
    })

    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('435px')
    expect(toolbarRoot?.dataset.scrollable).toBe('true')

    viewportFrameBodyHeight = 360
    await act(async () => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-max-height')).toBe('315px')
    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('315px')
    expect(toolbarRoot?.dataset.scrollable).toBe('true')

    await act(async () => {
      useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
        viewToolbarOpen: false,
      })
    })

    expect(toolbarRoot?.open).toBe(false)
    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('48px')
    expect(toolbarRoot?.dataset.scrollable).toBe('false')
  })
})
