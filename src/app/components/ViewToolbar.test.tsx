// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
  let viewToolbarRootScrollHeight = 180

  beforeEach(async () => {
    vi.resetModules()
    frameAllCommandMock.mockReset()
    frameSelectedCommandMock.mockReset()
    setCameraPresetCommandMock.mockReset()
    setProjectionModeCommandMock.mockReset()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    class MockResizeObserver {
      public constructor(_callback: ResizeObserverCallback) {}

      public observe(): void {}

      public disconnect(): void {}
    }
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.classList.contains('RightPanelStack')) {
        return new DOMRect(0, 0, 320, 480)
      }
      return originalGetBoundingClientRect.call(this)
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get(this: HTMLElement) {
        if (this.classList.contains('ViewToolbarRoot')) {
          return this.hasAttribute('open') ? viewToolbarRootScrollHeight : 48
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
    expect(scrollSurfaces[0]?.style.getPropertyValue('--v15-view-toolbar-max-height')).toBe('450px')
    expect(scrollSurfaces[1]?.style.getPropertyValue('--v15-view-toolbar-max-height')).toBe('450px')
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

  it('recomputes used height when subsections collapse without shrinking the closed shell', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar viewportId="model-viewer-primary" />)
    })

    const toolbarRoot = container.querySelector('.ViewToolbarRoot') as HTMLDetailsElement | null
    const cameraSection = container.querySelector('.CameraSection') as HTMLDetailsElement | null
    expect(toolbarRoot).not.toBeNull()
    expect(cameraSection).not.toBeNull()
    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('180px')
    expect(toolbarRoot?.dataset.scrollable).toBe('false')

    viewToolbarRootScrollHeight = 112
    await act(async () => {
      cameraSection?.dispatchEvent(new Event('toggle'))
    })

    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('112px')
    expect(toolbarRoot?.dataset.scrollable).toBe('false')

    viewToolbarRootScrollHeight = 520
    await act(async () => {
      cameraSection?.dispatchEvent(new Event('toggle'))
    })

    expect(toolbarRoot?.style.getPropertyValue('--v15-view-toolbar-used-height')).toBe('450px')
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
