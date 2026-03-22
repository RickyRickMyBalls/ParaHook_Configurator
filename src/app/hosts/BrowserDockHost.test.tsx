// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { BrowserDockHost } from './BrowserDockHost'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

vi.mock('../panels/BrowserPanel', () => ({
  BrowserPanel: ({
    isFloating,
    isCollapsed,
    onToggleCollapsed,
    onTogglePopout,
    onTitleBarPointerDown,
  }: {
    isFloating?: boolean
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
      <div>{`Browser Panel ${isFloating === true ? 'floating' : 'docked'} ${
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
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const [activePreviewPanelId, setActivePreviewPanelId] = useState<'browser' | 'meatball-editor' | null>(
    null,
  )
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
      <div
        ref={dockedBrowserHostRef}
        className={`LeftDockPanelTarget LeftDockPanelTarget--browser ${
          activePreviewPanelId === 'browser' ? 'isPreviewActive' : ''
        }`}
      />
      <BrowserDockHost
        appShellRef={appShellRef}
        dockedBrowserHostRef={dockedBrowserHostRef}
        activeLeftDockPreviewPanelId={activePreviewPanelId}
        setActiveLeftDockPreviewPanelId={setActivePreviewPanelId}
        resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
        onActivateBrowserFloatingWindow={() => {}}
        onFloatingStateChange={() => {}}
        newEditorSpawnPosition={{ x: 345, y: 16 }}
        workspaceActiveSurface={null}
      />
    </div>
  )
}

describe('BrowserDockHost', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

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
    mockRect(container?.querySelector('.LeftDockPanelTarget--browser'), {
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
  })

  it('caps popout width from the dock host measurement path', async () => {
    await renderHarness()
    mockGeometry(960)

    const popoutButton = container?.querySelector(
      'button[aria-label="Mock browser popout"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      popoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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

    const popoutButton = container?.querySelector(
      'button[aria-label="Mock browser popout"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      popoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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
})
