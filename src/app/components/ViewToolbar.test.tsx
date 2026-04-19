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
  let viewportFrameBodyWidth = 800
  let viewToolbarPanelScrollHeight = 144
  let viewportFrameBodyHeight = 480

  beforeEach(async () => {
    vi.resetModules()
    frameAllCommandMock.mockReset()
    frameSelectedCommandMock.mockReset()
    setCameraPresetCommandMock.mockReset()
    setProjectionModeCommandMock.mockReset()
    viewportFrameBodyWidth = 800
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
      if (
        this.classList.contains('ViewportFrameBody') ||
        this.classList.contains('ViewportWorkspaceHost')
      ) {
        return new DOMRect(0, 0, viewportFrameBodyWidth, viewportFrameBodyHeight)
      }
      if (this.classList.contains('RightPanelStack')) {
        return new DOMRect(0, 0, 320, 480)
      }
      if (this.classList.contains('ViewToolbarTabsHost')) {
        return new DOMRect(165, 100, 320, 180)
      }
      if (this.classList.contains('ViewToolbarTabRail')) {
        return new DOMRect(165, 132, 25, 260)
      }
      if (this.classList.contains('ViewToolbarRoot')) {
        return new DOMRect(200, 100, 320, 180)
      }
      if (this.classList.contains('ViewToolbarPanel')) {
        return new DOMRect(200, 136, 320, viewToolbarPanelScrollHeight)
      }
      if (this.classList.contains('ViewToolbarFloatingWindow')) {
        return new DOMRect(
          Number.parseFloat(this.style.left || '24'),
          Number.parseFloat(this.style.top || '24'),
          Number.parseFloat(this.style.width || '320'),
          Number.parseFloat(this.style.height || '360'),
        )
      }
      if (this.classList.contains('ViewToolbarFloatingChrome')) {
        const parentRect = this.parentElement?.getBoundingClientRect() ?? new DOMRect(24, 24, 320, 360)
        return new DOMRect(parentRect.x, parentRect.y, parentRect.width, parentRect.height)
      }
      if (this.classList.contains('ViewToolbarFloatingWindowHeader')) {
        const parentRect = this.parentElement?.getBoundingClientRect() ?? new DOMRect(24, 24, 320, 360)
        return new DOMRect(parentRect.x, parentRect.y, parentRect.width, 32)
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

    const reopenedToolbarToggles = Array.from(
      container.querySelectorAll('.ViewToolbarToggle'),
    ) as HTMLElement[]
    expect(reopenedToolbarToggles).toHaveLength(2)

    await act(async () => {
      reopenedToolbarToggles[0]?.dispatchEvent(
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
    const tabsShell = container.querySelector('.ViewToolbarPanel--tabs') as HTMLDivElement | null
    const toolbarRoot = container.querySelector('.ViewToolbarRoot') as HTMLDetailsElement | null
    const tabsPanel = container.querySelector('.ViewToolbarTabPanel') as HTMLDivElement | null
    expect(tabButtons.map((button) => button.textContent)).toEqual([
      'Camera',
      'Fly Mode',
      'Transform',
      'Snap',
      'Gizmo',
      'View',
      'Environment',
      'Shadows',
      'Ground',
      'Materials',
    ])
    expect(tabsShell).not.toBeNull()
    expect(tabsShell?.classList.contains('ViewToolbarTabsHost')).toBe(true)
    expect(toolbarRoot).not.toBeNull()
    expect(tabsPanel).not.toBeNull()
    expect(tabsShell?.querySelector('.ViewToolbarTabRail')).not.toBeNull()
    expect(tabsShell?.querySelector('.ViewToolbarRoot')).toBe(toolbarRoot)
    expect(toolbarRoot?.querySelector('.ViewToolbarTabRail')).toBeNull()
    expect(toolbarRoot?.querySelector('.ViewToolbarTabPanel')).toBe(tabsPanel)
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

  it('renders classic mode through the shared body seam with the same section order and no tab rail', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'classic',
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const toolbarPanel = container.querySelector('.ViewToolbarPanel') as HTMLDivElement | null
    const sectionSummaries = Array.from(
      container.querySelectorAll('.ViewStyledSection > summary'),
    ).map((summary) => summary.textContent)

    expect(toolbarPanel?.dataset.presentation).toBe('classic')
    expect(container.querySelector('.ViewToolbarTabRail')).toBeNull()
    expect(sectionSummaries).toEqual([
      'Camera',
      'Fly Mode',
      'Transform',
      'Snap',
      'Gizmo',
      'View',
      'Environment',
      'Shadows',
      'Ground',
      'Materials',
    ])
  })

  it('renders a floating toolbar shell, keeps the shared body live, and quick docks back to the docked shell', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarFloatingRect: { x: 120, y: 48, width: 320, height: 360 },
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody ViewportWorkspaceHost'
    container.dataset.workspaceViewportId = 'model-viewer-primary'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const floatingWindow = container.querySelector('.ViewToolbarFloatingWindow') as HTMLDivElement | null
    const quickDockButton = container.querySelector(
      '.ViewToolbarFloatingWindowQuickDock',
    ) as HTMLButtonElement | null
    const orthographicButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Orthographic',
    )

    expect(floatingWindow).not.toBeNull()
    expect(floatingWindow?.style.left).toBe('120px')
    expect(floatingWindow?.style.top).toBe('48px')
    expect(container.querySelector('.RightDock')).toBeNull()
    expect(orthographicButton).not.toBeUndefined()

    await act(async () => {
      orthographicButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(setProjectionModeCommandMock).toHaveBeenCalledWith('orthographic', 'model-viewer-primary')

    await act(async () => {
      quickDockButton?.click()
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarHostMode,
    ).toBe('docked')
    expect(container.querySelector('.ViewToolbarFloatingWindow')).toBeNull()
    expect(container.querySelector('.RightDock')).not.toBeNull()
  })

  it('drags the floating toolbar titlebar around the owning viewport and clamps it inside the viewport host', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarFloatingRect: { x: 120, y: 48, width: 320, height: 360 },
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody ViewportWorkspaceHost'
    container.dataset.workspaceViewportId = 'model-viewer-primary'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const floatingWindow = container.querySelector('.ViewToolbarFloatingWindow') as HTMLDivElement | null
    const floatingHeader = container.querySelector(
      '.ViewToolbarFloatingWindowHeader',
    ) as HTMLDivElement | null

    expect(floatingWindow).not.toBeNull()
    expect(floatingHeader).not.toBeNull()

    await act(async () => {
      floatingHeader?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 7,
          clientX: 160,
          clientY: 64,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 7,
          clientX: 280,
          clientY: 180,
        }),
      )
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarFloatingRect,
    ).toMatchObject({
      x: 240,
      y: 108,
      width: 320,
      height: 360,
    })
    expect(floatingWindow?.style.left).toBe('240px')
    expect(floatingWindow?.style.top).toBe('108px')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 7,
          clientX: 1200,
          clientY: 900,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 7,
        }),
      )
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarFloatingRect,
    ).toMatchObject({
      x: 468,
      y: 108,
      width: 320,
      height: 360,
    })
    expect(floatingWindow?.style.left).toBe('468px')
    expect(floatingWindow?.style.top).toBe('108px')
  })

  it('resizes the floating toolbar from an edge, then keeps drag and quick dock behavior working', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarFloatingRect: { x: 120, y: 48, width: 320, height: 360 },
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody ViewportWorkspaceHost'
    container.dataset.workspaceViewportId = 'model-viewer-primary'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const floatingWindow = container.querySelector('.ViewToolbarFloatingWindow') as HTMLDivElement | null
    const eastHandle = container.querySelector(
      '[data-view-toolbar-resize-handle="e"]',
    ) as HTMLDivElement | null
    const floatingHeader = container.querySelector(
      '.ViewToolbarFloatingWindowHeader',
    ) as HTMLDivElement | null
    const quickDockButton = container.querySelector(
      '.ViewToolbarFloatingWindowQuickDock',
    ) as HTMLButtonElement | null

    expect(floatingWindow).not.toBeNull()
    expect(eastHandle).not.toBeNull()
    expect(floatingHeader).not.toBeNull()
    expect(quickDockButton).not.toBeNull()

    await act(async () => {
      eastHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 11,
          clientX: 440,
          clientY: 180,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 11,
          clientX: 600,
          clientY: 180,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 11,
        }),
      )
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarFloatingRect,
    ).toMatchObject({
      x: 120,
      y: 48,
      width: 480,
      height: 360,
    })
    expect(floatingWindow?.style.width).toBe('480px')
    expect(floatingWindow?.style.height).toBe('360px')

    await act(async () => {
      floatingHeader?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 12,
          clientX: 200,
          clientY: 64,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 12,
          clientX: 340,
          clientY: 124,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 12,
        }),
      )
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarFloatingRect,
    ).toMatchObject({
      x: 260,
      y: 108,
      width: 480,
      height: 360,
    })
    expect(floatingWindow?.style.left).toBe('260px')
    expect(floatingWindow?.style.top).toBe('108px')

    await act(async () => {
      quickDockButton?.click()
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarHostMode,
    ).toBe('docked')
    expect(container.querySelector('.ViewToolbarFloatingWindow')).toBeNull()
    expect(container.querySelector('.RightDock')).not.toBeNull()
  })

  it('resizes the floating toolbar from the north-west corner, clamping and enforcing minimum size', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarFloatingRect: { x: 120, y: 48, width: 320, height: 360 },
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody ViewportWorkspaceHost'
    container.dataset.workspaceViewportId = 'model-viewer-primary'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const floatingWindow = container.querySelector('.ViewToolbarFloatingWindow') as HTMLDivElement | null
    const northWestHandle = container.querySelector(
      '[data-view-toolbar-resize-handle="nw"]',
    ) as HTMLDivElement | null

    expect(floatingWindow).not.toBeNull()
    expect(northWestHandle).not.toBeNull()

    await act(async () => {
      northWestHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 13,
          clientX: 120,
          clientY: 48,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 13,
          clientX: -100,
          clientY: -100,
        }),
      )
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarFloatingRect,
    ).toMatchObject({
      x: 12,
      y: 12,
      width: 428,
      height: 396,
    })
    expect(floatingWindow?.style.left).toBe('12px')
    expect(floatingWindow?.style.top).toBe('12px')
    expect(floatingWindow?.style.width).toBe('428px')
    expect(floatingWindow?.style.height).toBe('396px')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 13,
          clientX: 500,
          clientY: 500,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 13,
        }),
      )
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarFloatingRect,
    ).toMatchObject({
      x: 160,
      y: 228,
      width: 280,
      height: 180,
    })
    expect(floatingWindow?.style.left).toBe('160px')
    expect(floatingWindow?.style.top).toBe('228px')
    expect(floatingWindow?.style.width).toBe('280px')
    expect(floatingWindow?.style.height).toBe('180px')
  })

  it('opens the floating-shell context menu with the same presentation items and ignores interactive controls', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarExpandedPresentationMode: 'classic',
      viewToolbarFloatingRect: { x: 120, y: 48, width: 320, height: 360 },
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody ViewportWorkspaceHost'
    container.dataset.workspaceViewportId = 'model-viewer-primary'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const floatingWindow = container.querySelector('.ViewToolbarFloatingWindow') as HTMLDivElement | null
    const headerLabel = Array.from(
      container.querySelectorAll('.ViewToolbarFloatingWindowHeader span'),
    ).find((element) => element.textContent === 'View') as HTMLSpanElement | undefined
    const quickDockButton = container.querySelector(
      '.ViewToolbarFloatingWindowQuickDock',
    ) as HTMLButtonElement | null

    expect(floatingWindow).not.toBeNull()
    expect(headerLabel).toBeDefined()
    expect(quickDockButton).not.toBeNull()
    expect(quickDockButton?.getAttribute('aria-label')).toBe('Quick Dock')
    expect(quickDockButton?.classList.contains('FloatingWindowHeaderAction')).toBe(true)
    expect(quickDockButton?.querySelector('svg')).not.toBeNull()
    expect(quickDockButton?.textContent?.trim()).toBe('')
    expect(container.querySelector('.ViewToolbarContextMenu')).toBeNull()

    await act(async () => {
      quickDockButton?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 74,
        }),
      )
    })

    expect(container.querySelector('.ViewToolbarContextMenu')).toBeNull()

    await act(async () => {
      headerLabel?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 220,
          clientY: 96,
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
    expect(floatingWindow?.dataset.viewToolbarHostMode).toBe('floating')
  })

  it('keeps floating and docked toolbar ownership separated across two viewports and quick-docks only the owning viewport', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-secondary')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarExpandedPresentationMode: 'tabs',
      viewToolbarActiveTab: 'materials',
      viewToolbarFloatingRect: { x: 120, y: 48, width: 320, height: 360 },
    })
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-secondary', {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'docked',
      viewToolbarExpandedPresentationMode: 'classic',
      viewToolbarDockMode: 'top-right-cluster',
      viewToolbarActiveTab: 'camera',
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <>
          <div
            className="ViewportFrameBody ViewportWorkspaceHost"
            data-workspace-viewport-id="model-viewer-primary"
          >
            <ViewToolbar viewportId="model-viewer-primary" />
          </div>
          <div
            className="ViewportFrameBody ViewportWorkspaceHost"
            data-workspace-viewport-id="model-viewer-secondary"
          >
            <ViewToolbar viewportId="model-viewer-secondary" />
          </div>
        </>,
      )
    })

    const primaryHost = container.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLDivElement | null
    const secondaryHost = container.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-secondary"]',
    ) as HTMLDivElement | null

    const primaryFloatingWindow = primaryHost?.querySelector(
      '.ViewToolbarFloatingWindow',
    ) as HTMLDivElement | null
    const primaryFloatingTabsHost = primaryHost?.querySelector(
      '.ViewToolbarTabsHost--floating',
    ) as HTMLDivElement | null
    const primaryFloatingChrome = primaryHost?.querySelector(
      '.ViewToolbarFloatingChrome',
    ) as HTMLDivElement | null
    const primaryFloatingBody = primaryHost?.querySelector(
      '.ViewToolbarFloatingWindowBody',
    ) as HTMLDivElement | null
    const primaryFloatingPanel = primaryHost?.querySelector(
      '.ViewToolbarFloatingWindowBody .ViewToolbarPanel',
    ) as HTMLDivElement | null
    const primaryFloatingWestResizeHandle = primaryHost?.querySelector(
      '[data-view-toolbar-resize-handle="w"]',
    ) as HTMLDivElement | null
    const primaryFloatingNorthResizeHandle = primaryHost?.querySelector(
      '[data-view-toolbar-resize-handle="n"]',
    ) as HTMLDivElement | null
    const primaryFloatingNorthwestResizeHandle = primaryHost?.querySelector(
      '[data-view-toolbar-resize-handle="nw"]',
    ) as HTMLDivElement | null
    const primaryFloatingSouthwestResizeHandle = primaryHost?.querySelector(
      '[data-view-toolbar-resize-handle="sw"]',
    ) as HTMLDivElement | null
    const primaryQuickDockButton = primaryHost?.querySelector(
      '.ViewToolbarFloatingWindowQuickDock',
    ) as HTMLButtonElement | null
    const secondaryDock = secondaryHost?.querySelector('.RightDock') as HTMLElement | null

    expect(primaryFloatingWindow).not.toBeNull()
    expect(primaryFloatingWindow?.style.left).toBe('120px')
    expect(primaryFloatingWindow?.dataset.viewToolbarHostMode).toBe('floating')
    expect(
      primaryFloatingWindow?.style.getPropertyValue('--v15-view-toolbar-floating-titlebar-height'),
    ).toBe('32px')
    expect(primaryFloatingTabsHost).not.toBeNull()
    expect(primaryFloatingChrome).not.toBeNull()
    expect(primaryFloatingChrome?.dataset.presentation).toBe('tabs')
    expect(primaryFloatingBody?.dataset.presentation).toBe('tabs')
    expect(primaryFloatingPanel?.style.paddingTop).toBe('0px')
    expect(primaryFloatingPanel?.style.paddingLeft).toBe('0px')
    expect(primaryFloatingPanel?.style.paddingRight).toBe('0px')
    expect(primaryFloatingTabsHost?.querySelector('.ViewToolbarTabRail')).not.toBeNull()
    expect(primaryFloatingChrome?.querySelector('.ViewToolbarTabRail')).toBeNull()
    expect(primaryFloatingWestResizeHandle?.style.left).toBe('25px')
    expect(primaryFloatingNorthResizeHandle?.style.left).toBe('39px')
    expect(primaryFloatingNorthwestResizeHandle?.style.left).toBe('25px')
    expect(primaryFloatingSouthwestResizeHandle?.style.left).toBe('25px')
    expect(
      primaryHost?.querySelector('[data-view-toolbar-section="materials"][data-tab-active="true"]'),
    ).not.toBeNull()

    expect(secondaryDock).not.toBeNull()
    expect(secondaryDock?.dataset.viewToolbarHostMode).toBe('docked')
    expect(secondaryDock?.dataset.viewToolbarDockMode).toBe('top-right-cluster')
    expect(
      secondaryHost?.querySelector('[data-view-toolbar-section="camera"][data-tab-active="true"]'),
    ).not.toBeNull()

    await act(async () => {
      primaryQuickDockButton?.click()
    })

    expect(primaryHost?.querySelector('.ViewToolbarFloatingWindow')).toBeNull()
    expect(primaryHost?.querySelector('.RightDock')).not.toBeNull()
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState,
    ).toEqual(
      expect.objectContaining({
        viewToolbarHostMode: 'docked',
        viewToolbarExpandedPresentationMode: 'tabs',
        viewToolbarActiveTab: 'materials',
        viewToolbarFloatingRect: {
          x: 120,
          y: 48,
          width: 320,
          height: 360,
        },
      }),
    )
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-secondary']?.localViewState,
    ).toEqual(
      expect.objectContaining({
        viewToolbarHostMode: 'docked',
        viewToolbarExpandedPresentationMode: 'classic',
        viewToolbarDockMode: 'top-right-cluster',
        viewToolbarActiveTab: 'camera',
      }),
    )
    expect(secondaryHost?.querySelector('.RightDock')).not.toBeNull()
    expect(secondaryHost?.querySelector('.ViewToolbarFloatingWindow')).toBeNull()
  })

  it('keeps the floating tabs window at least as tall as the outside rail when content is short', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarExpandedPresentationMode: 'tabs',
      viewToolbarActiveTab: 'ground',
      viewToolbarFloatingRect: { x: 120, y: 48, width: 320, height: 180 },
    })

    container = document.createElement('div')
    container.className = 'ViewportFrameBody ViewportWorkspaceHost'
    container.dataset.workspaceViewportId = 'model-viewer-primary'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    await act(async () => {})

    const floatingWindow = container.querySelector('.ViewToolbarFloatingWindow') as HTMLDivElement | null

    expect(
      floatingWindow?.style.getPropertyValue('--v15-view-toolbar-floating-min-height'),
    ).toBe('292px')
    expect(floatingWindow?.style.height).toBe('292px')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarFloatingRect,
    ).toEqual(
      expect.objectContaining({
        x: 120,
        y: 48,
        width: 320,
        height: 292,
      }),
    )
  })

  it('drags the docked toolbar summary out of the dock and converts it into a floating toolbar', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody ViewportWorkspaceHost'
    container.dataset.workspaceViewportId = 'model-viewer-primary'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const summary = container.querySelector('.ViewToolbarToggle') as HTMLElement | null
    expect(summary).not.toBeNull()

    await act(async () => {
      summary?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 9,
          clientX: 210,
          clientY: 112,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 9,
          clientX: 260,
          clientY: 164,
        }),
      )
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarHostMode,
    ).toBe('floating')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewToolbarOpen,
    ).toBe(true)
    expect(container.querySelector('.ViewToolbarFloatingWindow')).not.toBeNull()
    expect(container.querySelector('.RightDock')).toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 9,
        }),
      )
    })
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

  it('renders para-style view controls and keeps non-environment toggles on the shared view seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

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
    const findToggleByLabel = (labelText: string): HTMLInputElement | null => {
      const label = Array.from(viewSection?.querySelectorAll('label') ?? []).find((candidate) =>
        candidate.textContent?.includes(labelText),
      )
      return label?.querySelector('input[type="checkbox"]') ?? null
    }
    const orbitEnabledToggle = findToggleByLabel('Orbit Enabled')
    const gridToggle = findToggleByLabel('Grid')
    const axesToggle = findToggleByLabel('Axes')
    const wireframeToggle = findToggleByLabel('Wireframe')
    const axisOverlayToggle = findToggleByLabel('Axis Overlay')

    expect(viewSection).toBeTruthy()
    expect(viewSection?.textContent).toContain('Presentation')
    expect(viewSection?.textContent).toContain('Dock')
    expect(viewSection?.textContent).toContain('Orbit Enabled')
    expect(viewSection?.textContent).toContain('Grid')
    expect(viewSection?.textContent).toContain('Axes')
    expect(viewSection?.textContent).toContain('Wireframe')
    expect(viewSection?.textContent).toContain('Axis Overlay')
    expect(viewSection?.textContent).not.toContain('Tone Mapping')
    expect(viewSection?.textContent).not.toContain('Exposure')
    expect(orbitEnabledToggle).not.toBeNull()
    expect(gridToggle).not.toBeNull()
    expect(axesToggle).not.toBeNull()
    expect(wireframeToggle).not.toBeNull()
    expect(axisOverlayToggle).not.toBeNull()

    await act(async () => {
      orbitEnabledToggle?.click()
      gridToggle?.click()
      axesToggle?.click()
      wireframeToggle?.click()
      axisOverlayToggle?.click()
    })

    expect(useUiPrefsStore.getState().view.orbitEnabled).toBe(false)
    expect(useUiPrefsStore.getState().view.gridVisible).toBe(false)
    expect(useUiPrefsStore.getState().view.axesVisible).toBe(true)
    expect(useUiPrefsStore.getState().view.wireframe).toBe(true)
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .axisOverlayEnabled,
    ).toBe(false)
  })

  it('renders para-style core environment controls and keeps preset plus add-light type ownership intact', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { getEnvironmentPresetDefinition } = await import('../../shared/viewSettingsTypes')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const environmentSection = Array.from(container.querySelectorAll('.ViewStyledSection')).find(
      (section) => section.querySelector('summary')?.textContent?.includes('Environment'),
    )
    const presetSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Preset"]',
    ) as HTMLSelectElement | null
    const addLightTypeSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Add Light Type"]',
    ) as HTMLSelectElement | null
    const reapplyPresetButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Reapply Selected Preset',
    ) as HTMLButtonElement | undefined
    const exposureIncreaseButton = container.querySelector(
      'button[aria-label="Increase Exposure"]',
    ) as HTMLButtonElement | null
    const lightNameInput = container.querySelector(
      'input[placeholder="Light name"]',
    ) as HTMLInputElement | null
    const addLightButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Add Light',
    ) as HTMLButtonElement | undefined
    const initialLightCount = useUiPrefsStore.getState().view.lighting.lights.length

    expect(environmentSection).toBeTruthy()
    expect(environmentSection?.textContent).toContain('Preset')
    expect(environmentSection?.textContent).toContain('Post-Look Grade')
    expect(environmentSection?.textContent).toContain(
      'The Environment-2 grade surface is visible here now, and it stays downstream from the',
    )
    expect(environmentSection?.textContent).toContain('Exposure')
    expect(environmentSection?.textContent).toContain('Contrast')
    expect(environmentSection?.textContent).toContain('Highlights')
    expect(environmentSection?.textContent).toContain('Shadows')
    expect(environmentSection?.textContent).toContain('Whites')
    expect(environmentSection?.textContent).toContain('Blacks')
    expect(environmentSection?.textContent).toContain('Temperature')
    expect(environmentSection?.textContent).toContain('Tint')
    expect(environmentSection?.textContent).toContain('Saturation')
    expect(environmentSection?.textContent).toContain('Add Environment Light')
    expect(environmentSection?.textContent).toContain('Add Light Type')
    expect(environmentSection?.textContent).toContain('Selected Light')
    expect(environmentSection?.textContent).toContain(
      'Use the Browser eye to turn this light on or off.',
    )
    expect(environmentSection?.textContent).toContain(
      'Baseline is selected and still matches the live scene.',
    )
    expect(environmentSection?.querySelectorAll('.ListRow')).toHaveLength(0)
    expect(presetSelect).not.toBeNull()
    expect(exposureIncreaseButton).not.toBeNull()
    expect(addLightTypeSelect).not.toBeNull()
    expect(reapplyPresetButton).not.toBeUndefined()
    expect(lightNameInput).not.toBeNull()
    expect(addLightButton).not.toBeUndefined()

    await act(async () => {
      if (presetSelect !== null) {
        presetSelect.value = 'studio'
        presetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (addLightTypeSelect !== null) {
        addLightTypeSelect.value = 'spot'
        addLightTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(environmentSection?.textContent).toContain(
      'Studio is selected and still matches the live scene.',
    )

    await act(async () => {
      exposureIncreaseButton?.click()
    })

    expect(useUiPrefsStore.getState().view.environmentGrade.exposure).toBe(1.23)
    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'custom',
      label: 'Custom Studio',
    })
    expect(environmentSection?.textContent).toContain(
      'Studio is selected, but the live scene has diverged from it.',
    )

    await act(async () => {
      reapplyPresetButton?.click()
    })

    const studioPreset = getEnvironmentPresetDefinition('studio')
    expect(useUiPrefsStore.getState().view.environmentGrade).toEqual(studioPreset.environmentGrade)
    expect(environmentSection?.textContent).toContain(
      'Studio is selected and still matches the live scene.',
    )

    await act(async () => {
      addLightButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')
    expect(environmentSection?.textContent).toContain(
      'Studio is selected, but the live scene has diverged from it.',
    )
    expect(useUiPrefsStore.getState().view.lighting.lights).toHaveLength(initialLightCount + 1)
    expect(
      useUiPrefsStore.getState().view.lighting.lights.at(-1)?.type,
    ).toBe('spot')
  })

  it('captures, recalls, and quick-compares a remembered environment look from the toolbar', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const getEnvironmentSection = () =>
      Array.from(container!.querySelectorAll('.ViewStyledSection')).find((section) =>
        section.querySelector('summary')?.textContent?.includes('Environment'),
      )

    const environmentSection = getEnvironmentSection()
    const captureButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Capture Look',
    ) as HTMLButtonElement | undefined
    const recallButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Recall Look',
    ) as HTMLButtonElement | undefined
    const compareButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Compare A/B',
    ) as HTMLButtonElement | undefined

    expect(environmentSection?.textContent).toContain(
      'Capture the current environment look to enable recall and A/B compare.',
    )
    expect(captureButton).not.toBeUndefined()
    expect(recallButton?.disabled).toBe(true)
    expect(compareButton?.disabled).toBe(true)

    await act(async () => {
      captureButton?.click()
    })

    expect(recallButton?.disabled).toBe(false)
    expect(compareButton?.disabled).toBe(false)
    expect(environmentSection?.textContent).toContain(
      'The live look matches the remembered look.',
    )

    await act(async () => {
      useUiPrefsStore.getState().setEnvironmentGrade({
        exposure: 1.42,
        contrast: 1.18,
      })
    })

    expect(environmentSection?.textContent).toContain(
      'The remembered look is ready to recall or compare against the live look.',
    )

    await act(async () => {
      compareButton?.click()
    })

    expect(compareButton?.textContent).toBe('Return to Current')
    expect(environmentSection?.textContent).toContain(
      'A/B compare is showing the remembered look. Click Return to Current to restore the live look.',
    )
    expect(useUiPrefsStore.getState().view.environmentGrade.exposure).not.toBe(1.42)

    await act(async () => {
      const returnButton = Array.from(container!.querySelectorAll('button')).find(
        (button) => button.textContent === 'Return to Current',
      ) as HTMLButtonElement | undefined
      returnButton?.click()
    })

    expect(compareButton?.textContent).toBe('Compare A/B')
    expect(useUiPrefsStore.getState().environmentLookComparisonActive).toBe(false)
  })

  it('surfaces active HDRI lighting and background intensity controls in the Environment section', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const getEnvironmentSection = () =>
      Array.from(container!.querySelectorAll('.ViewStyledSection')).find((section) =>
        section.querySelector('summary')?.textContent?.includes('Environment'),
      )

    let environmentSection = getEnvironmentSection()
    expect(environmentSection?.textContent).toContain('Active Environment')
    expect(environmentSection?.textContent).toContain(
      'HDRI lighting controls appear here after an HDRI/EXR environment is applied.',
    )

    await act(async () => {
      useUiPrefsStore.getState().applyHdriEnvironment({
        label: 'Workshop Loft',
        assetPath: '/HDRI/workshop_loft.hdr',
      })
    })

    environmentSection = getEnvironmentSection()
    const increaseLightingIntensityButton = environmentSection?.querySelector(
      'button[aria-label="Increase Lighting Intensity"]',
    ) as HTMLButtonElement | null
    const increaseBackgroundIntensityButton = environmentSection?.querySelector(
      'button[aria-label="Increase Background Intensity"]',
    ) as HTMLButtonElement | null
    const backgroundSelect = environmentSection?.querySelector(
      '.ParaSelectNative[aria-label="Background"]',
    ) as HTMLSelectElement | null
    const increaseOrientationButton = environmentSection?.querySelector(
      'button[aria-label="Increase Orientation"]',
    ) as HTMLButtonElement | null

    expect(environmentSection?.textContent).toContain(
      'Workshop Loft is the active HDRI/EXR environment.',
    )
    expect(increaseLightingIntensityButton).not.toBeNull()
    expect(increaseBackgroundIntensityButton).not.toBeNull()
    expect(increaseOrientationButton).not.toBeNull()
    expect(backgroundSelect?.value).toBe('visible')

    await act(async () => {
      increaseLightingIntensityButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      increaseBackgroundIntensityButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      increaseOrientationButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      if (backgroundSelect !== null) {
        backgroundSelect.value = 'hidden'
        backgroundSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'hdri',
      label: 'Workshop Loft',
      intensity: 1.05,
      backgroundIntensity: 1.05,
      backgroundVisible: false,
      rotationDeg: 1,
    })
  })

  it('proves the Environment-1 closeout flow from preset baseline to active HDRI tuning', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { getEnvironmentPresetDefinition } = await import('../../shared/viewSettingsTypes')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const getEnvironmentSection = () =>
      Array.from(container!.querySelectorAll('.ViewStyledSection')).find((section) =>
        section.querySelector('summary')?.textContent?.includes('Environment'),
      )

    let environmentSection = getEnvironmentSection()
    const presetSelect = container.querySelector(
      '.ParaSelectNative[aria-label="Preset"]',
    ) as HTMLSelectElement | null
    const reapplyPresetButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Reapply Selected Preset',
    ) as HTMLButtonElement | undefined

    expect(environmentSection?.textContent).toContain(
      'Baseline is selected and still matches the live scene.',
    )
    expect(presetSelect).not.toBeNull()
    expect(reapplyPresetButton).not.toBeUndefined()

    await act(async () => {
      if (presetSelect !== null) {
        presetSelect.value = 'studio'
        presetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(environmentSection?.textContent).toContain(
      'Studio is selected and still matches the live scene.',
    )

    await act(async () => {
      reapplyPresetButton?.click()
    })

    const studioPreset = getEnvironmentPresetDefinition('studio')
    expect(useUiPrefsStore.getState().view.environmentGrade).toEqual(studioPreset.environmentGrade)
    expect(environmentSection?.textContent).toContain(
      'Studio is selected and still matches the live scene.',
    )

    await act(async () => {
      useUiPrefsStore.getState().applyHdriEnvironment({
        label: 'Workshop Loft',
        assetPath: '/HDRI/workshop_loft.hdr',
      })
    })

    environmentSection = getEnvironmentSection()
    const increaseLightingIntensityButton = environmentSection?.querySelector(
      'button[aria-label="Increase Lighting Intensity"]',
    ) as HTMLButtonElement | null
    const increaseBackgroundIntensityButton = environmentSection?.querySelector(
      'button[aria-label="Increase Background Intensity"]',
    ) as HTMLButtonElement | null
    const backgroundSelect = environmentSection?.querySelector(
      '.ParaSelectNative[aria-label="Background"]',
    ) as HTMLSelectElement | null
    const increaseOrientationButton = environmentSection?.querySelector(
      'button[aria-label="Increase Orientation"]',
    ) as HTMLButtonElement | null

    expect(environmentSection?.textContent).toContain(
      'Workshop Loft is the active HDRI/EXR environment.',
    )
    expect(increaseLightingIntensityButton).not.toBeNull()
    expect(increaseBackgroundIntensityButton).not.toBeNull()
    expect(increaseOrientationButton).not.toBeNull()

    await act(async () => {
      increaseLightingIntensityButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      increaseBackgroundIntensityButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      increaseOrientationButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      if (backgroundSelect !== null) {
        backgroundSelect.value = 'hidden'
        backgroundSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.environmentSource).toMatchObject({
      kind: 'hdri',
      label: 'Workshop Loft',
      intensity: 1.05,
      backgroundIntensity: 1.05,
      backgroundVisible: false,
      rotationDeg: 1,
    })
  })

  it('renders para-style selected-light core tuning controls and preserves type-gated light branches', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const host = container
    const getEditorPanel = () => host?.querySelector('.EditorPanel') as HTMLDivElement | null
    const getSelectedLight = () => {
      const { selectedLightId, lights } = useUiPrefsStore.getState().view.lighting
      return lights.find((light) => light.id === selectedLightId) ?? null
    }

    const editorPanel = getEditorPanel()
    const typeSelect = editorPanel?.querySelector(
      '.ParaSelectNative[aria-label="Type"]',
    ) as HTMLSelectElement | null
    const increaseIntensityButton = editorPanel?.querySelector(
      'button[aria-label="Increase Intensity"]',
    ) as HTMLButtonElement | null
    const selectedLightNameInput = editorPanel?.querySelector(
      'input[type="text"]:not([placeholder="Light name"])',
    ) as HTMLInputElement | null
    const selectedLightColorInput = editorPanel?.querySelector(
      'input[type="color"]',
    ) as HTMLInputElement | null

    expect(editorPanel).not.toBeNull()
    expect(editorPanel?.textContent).toContain('Use the Browser eye to turn this light on or off.')
    expect(editorPanel?.querySelector('.ParaSelectNative[aria-label="Enabled"]')).toBeNull()
    expect(typeSelect).not.toBeNull()
    expect(increaseIntensityButton).not.toBeNull()
    expect(selectedLightNameInput?.value).toBe('Key')
    expect(selectedLightColorInput?.value).toBe('#fff2e6')
    expect(editorPanel?.querySelectorAll('.ParaVec3Field')).toHaveLength(2)
    expect(editorPanel?.querySelectorAll('.ParaVec3FieldCompact')).toHaveLength(2)
    expect(editorPanel?.querySelectorAll('.ParaVec3Slider.isCompact')).toHaveLength(2)
    expect(editorPanel?.querySelectorAll('.ParaVec3Slider.isStacked')).toHaveLength(0)

    await act(async () => {
      increaseIntensityButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(getSelectedLight()).toMatchObject({
      id: 'key',
      intensity: 1.9,
      type: 'directional',
    })

    await act(async () => {
      const currentTypeSelect = getEditorPanel()?.querySelector(
        '.ParaSelectNative[aria-label="Type"]',
      ) as HTMLSelectElement | null
      if (currentTypeSelect !== null) {
        currentTypeSelect.value = 'point'
        currentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(getSelectedLight()).toMatchObject({
      id: 'key',
      type: 'point',
      distance: 0,
      decay: 2,
      castShadow: true,
      shadowBias: -0.0002,
      shadowMapSize: 1024,
    })
    expect(getSelectedLight()?.target).toBeUndefined()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Distance"]')).not.toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Decay"]')).not.toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Angle (deg)"]')).toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Penumbra"]')).toBeNull()

    await act(async () => {
      getEditorPanel()
        ?.querySelector('button[aria-label="Increase Distance"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      getEditorPanel()
        ?.querySelector('button[aria-label="Increase Decay"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(getSelectedLight()).toMatchObject({
      id: 'key',
      distance: 0.1,
      decay: 2.1,
    })

    await act(async () => {
      const currentTypeSelect = getEditorPanel()?.querySelector(
        '.ParaSelectNative[aria-label="Type"]',
      ) as HTMLSelectElement | null
      if (currentTypeSelect !== null) {
        currentTypeSelect.value = 'spot'
        currentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(getSelectedLight()).toMatchObject({
      id: 'key',
      type: 'spot',
      distance: 0,
      decay: 2,
      angleDeg: 35,
      penumbra: 0.2,
      castShadow: true,
      shadowBias: -0.0003,
      shadowMapSize: 1024,
    })
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Distance"]')).not.toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Decay"]')).not.toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Angle (deg)"]')).not.toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Penumbra"]')).not.toBeNull()

    await act(async () => {
      getEditorPanel()
        ?.querySelector('button[aria-label="Increase Angle (deg)"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      getEditorPanel()
        ?.querySelector('button[aria-label="Increase Penumbra"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(getSelectedLight()).toMatchObject({
      id: 'key',
      angleDeg: 36,
      penumbra: 0.25,
    })

    await act(async () => {
      const currentTypeSelect = getEditorPanel()?.querySelector(
        '.ParaSelectNative[aria-label="Type"]',
      ) as HTMLSelectElement | null
      if (currentTypeSelect !== null) {
        currentTypeSelect.value = 'ambient'
        currentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(getSelectedLight()).toMatchObject({
      id: 'key',
      type: 'ambient',
    })
    expect(getSelectedLight()?.position).toBeUndefined()
    expect(getSelectedLight()?.target).toBeUndefined()
    expect(getSelectedLight()?.distance).toBeUndefined()
    expect(getSelectedLight()?.decay).toBeUndefined()
    expect(getSelectedLight()?.angleDeg).toBeUndefined()
    expect(getSelectedLight()?.penumbra).toBeUndefined()
    expect(getSelectedLight()?.castShadow).toBeUndefined()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Distance"]')).toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Decay"]')).toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Angle (deg)"]')).toBeNull()
    expect(getEditorPanel()?.querySelector('button[aria-label="Increase Penumbra"]')).toBeNull()
  })

  it('renders selected-light tail parity controls, adopts ParaVec3Field for vectors, and keeps vector plus shadow branches intact', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    container = document.createElement('div')
    container.className = 'ViewportFrameBody'
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const host = container
    const getEditorPanel = () => host?.querySelector('.EditorPanel') as HTMLDivElement | null
    const getShadowSection = () =>
      (Array.from(host?.querySelectorAll('.ViewStyledSection') ?? []).find((section) =>
        section.querySelector('summary')?.textContent?.includes('Shadows'),
      ) as HTMLDetailsElement | undefined) ?? null
    const getSelectedLight = () => {
      const { selectedLightId, lights } = useUiPrefsStore.getState().view.lighting
      return lights.find((light) => light.id === selectedLightId) ?? null
    }

    const getPositionField = () =>
      ((getEditorPanel()
        ?.querySelector('button[aria-label="Toggle Position"]')
        ?.closest('.ParaVec3Field') as HTMLDivElement | null) ?? null)
    const getTargetField = () =>
      ((getEditorPanel()
        ?.querySelector('button[aria-label="Toggle Target"]')
        ?.closest('.ParaVec3Field') as HTMLDivElement | null) ?? null)
    const getPositionToggle = () =>
      getEditorPanel()?.querySelector(
        'button[aria-label="Toggle Position"]',
      ) as HTMLButtonElement | null
    const getTargetToggle = () =>
      getEditorPanel()?.querySelector(
        'button[aria-label="Toggle Target"]',
      ) as HTMLButtonElement | null

    const getCastShadowSelect = () =>
      getShadowSection()?.querySelector(
        '.ParaSelectNative[aria-label="Cast Shadow"]',
      ) as HTMLSelectElement | null
    const getIncreaseShadowBiasButton = () =>
      getShadowSection()?.querySelector(
        'button[aria-label="Increase Shadow Bias"]',
      ) as HTMLButtonElement | null
    const getShadowMapSelect = () =>
      getShadowSection()?.querySelector(
        '.ParaSelectNative[aria-label="Shadow Map"]',
      ) as HTMLSelectElement | null
    const getVectorFieldSlider = (field: HTMLDivElement | null) =>
      field?.querySelector('.ParaVec3Slider') as HTMLDivElement | null
    const setTrackBounds = (track: Element | undefined) => {
      if (track === undefined) {
        return
      }
      Object.defineProperty(track, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({
          left: 0,
          top: 0,
          width: 100,
          height: 26,
          right: 100,
          bottom: 26,
          x: 0,
          y: 0,
          toJSON: () => '',
        }),
      })
    }

    expect(getPositionField()).not.toBeNull()
    expect(getTargetField()).not.toBeNull()
    expect(getPositionToggle()?.getAttribute('aria-expanded')).toBe('false')
    expect(getTargetToggle()?.getAttribute('aria-expanded')).toBe('false')
    expect(getPositionField()?.querySelector('.ParaVec3FieldCompact')).not.toBeNull()
    expect(getTargetField()?.querySelector('.ParaVec3FieldCompact')).not.toBeNull()
    expect(getVectorFieldSlider(getPositionField())?.classList.contains('isCompact')).toBe(true)
    expect(getVectorFieldSlider(getTargetField())?.classList.contains('isCompact')).toBe(true)
    expect(getCastShadowSelect()).not.toBeNull()
    expect(getIncreaseShadowBiasButton()).not.toBeNull()
    expect(getShadowMapSelect()).not.toBeNull()
    expect(Array.from(getShadowMapSelect()?.options ?? []).map((option) => option.value)).toEqual([
      '256',
      '512',
      '1024',
      '2048',
    ])
    await act(async () => {
      getPositionToggle()?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      getTargetToggle()?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(getPositionToggle()?.getAttribute('aria-expanded')).toBe('true')
    expect(getTargetToggle()?.getAttribute('aria-expanded')).toBe('true')
    expect(getVectorFieldSlider(getPositionField())).not.toBeNull()
    expect(getVectorFieldSlider(getTargetField())).not.toBeNull()
    expect(getVectorFieldSlider(getPositionField())?.classList.contains('isStacked')).toBe(true)
    expect(getVectorFieldSlider(getTargetField())?.classList.contains('isStacked')).toBe(true)
    expect(getPositionField()?.querySelectorAll('.ParaSliderTrack')).toHaveLength(3)
    expect(getTargetField()?.querySelectorAll('.ParaSliderTrack')).toHaveLength(3)
    const positionTracks = Array.from(
      getPositionField()?.querySelectorAll('.ParaSliderTrack') ?? [],
    )
    const targetTracks = Array.from(getTargetField()?.querySelectorAll('.ParaSliderTrack') ?? [])
    setTrackBounds(positionTracks[0])
    setTrackBounds(targetTracks[1])

    await act(async () => {
      ;(positionTracks[0] as HTMLDivElement | undefined)?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 52,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', {}))
      ;(targetTracks[1] as HTMLDivElement | undefined)?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 50.25,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', {}))
      const castShadowSelect = getCastShadowSelect()
      if (castShadowSelect !== null) {
        castShadowSelect.value = 'off'
        castShadowSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      getIncreaseShadowBiasButton()?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      const shadowMapSelect = getShadowMapSelect()
      if (shadowMapSelect !== null) {
        shadowMapSelect.value = '2048'
        shadowMapSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(getSelectedLight()).toMatchObject({
      id: 'key',
      castShadow: false,
      shadowBias: -0.0004,
      shadowMapSize: 2048,
      position: { x: 12, y: 13, z: 8 },
      target: { x: 0, y: 1.5, z: 0 },
    })

    await act(async () => {
      const currentTypeSelect = getEditorPanel()?.querySelector(
        '.ParaSelectNative[aria-label="Type"]',
      ) as HTMLSelectElement | null
      if (currentTypeSelect !== null) {
        currentTypeSelect.value = 'point'
        currentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(getPositionField()).not.toBeNull()
    expect(getTargetField()).toBeNull()
    expect(getPositionToggle()?.getAttribute('aria-expanded')).toBe('true')
    expect(getVectorFieldSlider(getPositionField())).not.toBeNull()
    expect(getVectorFieldSlider(getPositionField())?.classList.contains('isStacked')).toBe(true)
    expect(getCastShadowSelect()).not.toBeNull()
    expect(getIncreaseShadowBiasButton()).not.toBeNull()
    expect(getShadowMapSelect()).not.toBeNull()

    await act(async () => {
      const currentTypeSelect = getEditorPanel()?.querySelector(
        '.ParaSelectNative[aria-label="Type"]',
      ) as HTMLSelectElement | null
      if (currentTypeSelect !== null) {
        currentTypeSelect.value = 'ambient'
        currentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(getPositionField()).toBeNull()
    expect(getTargetField()).toBeNull()
    expect(getCastShadowSelect()).toBeNull()
    expect(getIncreaseShadowBiasButton()).toBeNull()
    expect(getShadowMapSelect()).toBeNull()
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
