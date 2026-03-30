// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { BrowserDockHost } from './BrowserDockHost'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

vi.mock('../panels/BrowserPanel', () => ({
  BrowserPanel: ({
    isFloating,
    isPoppedOut,
    isCollapsed,
    onToggleCollapsed,
    onTogglePopout,
    onTitleBarPointerDown,
  }: {
    isFloating?: boolean
    isPoppedOut?: boolean
    isCollapsed?: boolean
    onToggleCollapsed?: () => void
    onTogglePopout?: () => void
    onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void
  }) => (
    <div>
      <div
        data-testid={`browser-titlebar-${isFloating === true ? 'floating' : 'docked'}`}
        onPointerDown={onTitleBarPointerDown}
      >
        Browser Titlebar
      </div>
      <div>{`Browser Panel ${
        isPoppedOut === true ? 'poppedout' : isFloating === true ? 'floating' : 'docked'
      } ${
        isCollapsed === true ? 'collapsed' : 'expanded'
      }`}</div>
      <button type="button" aria-label="Mock browser toggle collapse" onClick={onToggleCollapsed}>
        Toggle Browser Collapse
      </button>
      <button type="button" aria-label="Mock browser popout" onClick={onTogglePopout}>
        Toggle Browser Popout
      </button>
    </div>
  ),
}))

const mockRect = (
  element: Element | null | undefined,
  rect: { left: number; top: number; width: number; height: number },
) => {
  if (!(element instanceof HTMLElement)) {
    return
  }
  const nextRect = {
    x: rect.left,
    y: rect.top,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    toJSON: () => '',
  }
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => nextRect,
  })
}

const mockElementSize = (
  element: Element | null | undefined,
  size: { width: number; height: number },
) => {
  if (!(element instanceof HTMLElement)) {
    return
  }
  Object.defineProperty(element, 'clientWidth', {
    configurable: true,
    value: size.width,
  })
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: size.height,
  })
}

function BrowserDockHostHarness() {
  const appShellRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const viewportSplitHostRef = useRef<HTMLDivElement | null>(null)
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const activePreviewPanelId = useWorkspaceStore((state) => state.activeLeftDockPreviewPanelId)
  const resolveLeftDockPreviewPanelId = (
    panelId: 'browser' | 'meatball-editor',
    clientX: number,
    clientY: number,
  ) => {
    if (panelId !== 'browser') {
      return null
    }
    const rect = dockedBrowserHostRef.current?.getBoundingClientRect()
    if (rect === undefined) {
      return null
    }
    return clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
      ? 'browser'
      : null
  }

  return (
    <div ref={appShellRef} className="AppShellRoot">
      <div ref={viewportRef} className="ViewportArea">
        <div ref={viewportSplitHostRef} className="BrowserViewportSplitHost" />
      </div>
      <div
        ref={dockedBrowserHostRef}
        className={`LeftDockPanelTarget LeftDockPanelTarget--browser ${
          activePreviewPanelId === 'browser' ? 'isPreviewActive' : ''
        }`}
      />
      <BrowserDockHost
        appShellRef={appShellRef}
        viewportRef={viewportRef}
        viewportSplitHostRef={viewportSplitHostRef}
        dockedBrowserHostRef={dockedBrowserHostRef}
        resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
        onActivateBrowserFloatingWindow={() => {}}
        newEditorSpawnPosition={{ x: 345, y: 16 }}
        workspaceActiveSurface={null}
      />
    </div>
  )
}

describe('BrowserDockHost', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalWindowOpen = window.open

  beforeEach(() => {
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    window.open = originalWindowOpen
  })

  const renderHarness = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(<BrowserDockHostHarness />)
    })
  }

  const mockGeometry = (browserWidth = 320) => {
    mockRect(container?.querySelector('.AppShellRoot'), {
      left: 0,
      top: 0,
      width: 864,
      height: 900,
    })
    mockElementSize(container?.querySelector('.AppShellRoot'), {
      width: 864,
      height: 900,
    })
    mockRect(container?.querySelector('.ViewportArea'), {
      left: 320,
      top: 0,
      width: 544,
      height: 900,
    })
    mockElementSize(container?.querySelector('.ViewportArea'), {
      width: 544,
      height: 900,
    })
    mockRect(container?.querySelector('.LeftDockPanelTarget--browser'), {
      left: 16,
      top: 88,
      width: browserWidth,
      height: 420,
    })
    mockRect(container?.querySelector('[data-testid="browser-titlebar-docked"]')?.parentElement, {
      left: 16,
      top: 88,
      width: browserWidth,
      height: 420,
    })
  }

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
    window.open = originalWindowOpen
  })

  it('caps floating width from the dock host measurement path', async () => {
    await renderHarness()
    mockGeometry(960)

    const dockedTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-docked"]',
    ) as HTMLDivElement | null

    await act(async () => {
      dockedTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 40,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 72,
          clientY: 156,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }))
    })

    const browserShell = container?.querySelector('.BrowserFloatingWindow') as HTMLDivElement | null
    expect(browserShell?.style.width).toBe('840px')
  })

  it('undocks the browser into a floating window when the docked titlebar is dragged', async () => {
    await renderHarness()
    mockGeometry()

    const dockedTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-docked"]',
    ) as HTMLDivElement | null

    await act(async () => {
      dockedTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 40,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 72,
          clientY: 156,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()
  })

  it('shows the dock preview and re-docks when the floating browser is dragged back to its slot', async () => {
    await renderHarness()
    mockGeometry()

    const dockedTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-docked"]',
    ) as HTMLDivElement | null

    await act(async () => {
      dockedTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 40,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 72,
          clientY: 156,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }))
    })

    mockGeometry()

    const floatingTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-floating"]',
    ) as HTMLDivElement | null

    await act(async () => {
      floatingTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 260,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 60,
          clientY: 110,
        }),
      )
    })

    expect(
      container?.querySelector('.LeftDockPanelTarget--browser')?.classList.contains('isPreviewActive'),
    ).toBe(true)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 60,
          clientY: 110,
        }),
      )
    })

    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('moves the docked browser into a child-window popout owner and docks it again when closed', async () => {
    await renderHarness()
    mockGeometry()

    const popoutDocument = document.implementation.createHTMLDocument('Browser Popout')
    let beforeUnloadHandler: (() => void) | null = null
    let isPopoutClosed = false
    const popoutWindow = {
      get closed() {
        return isPopoutClosed
      },
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(() => {
        isPopoutClosed = true
      }),
      addEventListener: vi.fn((type: string, handler: EventListenerOrEventListenerObject) => {
        if (type === 'beforeunload' && typeof handler === 'function') {
          beforeUnloadHandler = handler as () => void
        }
      }),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    const popoutButton = container?.querySelector(
      'button[aria-label="Mock browser popout"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      popoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(window.open).toHaveBeenCalled()
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.textContent).not.toContain('Browser Panel docked expanded')
    expect(popoutDocument.body.textContent).toContain('Browser Panel poppedout expanded')

    await act(async () => {
      beforeUnloadHandler?.()
    })

    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('shows a right split ghost and moves the floating browser into viewport split on release', async () => {
    await renderHarness()
    mockGeometry()

    const dockedTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-docked"]',
    ) as HTMLDivElement | null

    await act(async () => {
      dockedTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 40,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 72,
          clientY: 156,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }))
    })

    const floatingTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-floating"]',
    ) as HTMLDivElement | null

    await act(async () => {
      floatingTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 360,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 852,
          clientY: 260,
        }),
      )
    })

    expect(container?.querySelector('.ViewportSplitDockGhost.isDockRight')).not.toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 852,
          clientY: 260,
        }),
      )
    })

    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.querySelector('.BrowserViewportSplitWindow')).not.toBeNull()
  })

  it('drags the viewport-split browser titlebar back into a floating browser window', async () => {
    useWorkspaceStore.setState((state) => ({
      ...state,
      browserShell: {
        ...state.browserShell,
        isViewportSplit: true,
        viewportSplitDockSide: 'right',
      },
    }))

    await renderHarness()
    mockGeometry()

    const splitTitlebar = container?.querySelector(
      '.BrowserViewportSplitWindow [data-testid="browser-titlebar-docked"]',
    ) as HTMLDivElement | null

    await act(async () => {
      splitTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 620,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 700,
          clientY: 220,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 700,
          clientY: 220,
        }),
      )
    })

    expect(container?.querySelector('.BrowserViewportSplitWindow')).toBeNull()
    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()
  })
})
