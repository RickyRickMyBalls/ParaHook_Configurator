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
