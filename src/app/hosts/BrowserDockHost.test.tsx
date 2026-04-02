// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { BrowserDockHost } from './BrowserDockHost'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import { defaultPrimaryViewportSlotId } from '../workspace/workspaceShellTypes'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

vi.mock('../panels/BrowserPanel', () => ({
  BrowserPanel: ({
    presentationMode,
    onCyclePresentationMode,
    isFloating,
    isPoppedOut,
    isCollapsed,
    onToggleCollapsed,
    showQuickDockButton,
    onQuickDock,
    onTogglePopout,
    onTitleBarContextMenu,
    onTitleBarPointerDown,
    onWheelCapture,
  }: {
    presentationMode?: 'expanded' | 'essentials' | 'collapsed'
    onCyclePresentationMode?: () => void
    isFloating?: boolean
    isPoppedOut?: boolean
    isCollapsed?: boolean
    onToggleCollapsed?: () => void
    showQuickDockButton?: boolean
    onQuickDock?: () => void
    onTogglePopout?: () => void
    onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void
    onTitleBarContextMenu?: (event: ReactMouseEvent<HTMLDivElement>) => void
    onWheelCapture?: (event: ReactWheelEvent<HTMLDivElement>) => void
  }) => (
    <div className="BrowserPanelRoot" onWheelCapture={onWheelCapture}>
      <div
        data-testid={`browser-titlebar-${isFloating === true ? 'floating' : 'docked'}`}
        onContextMenu={onTitleBarContextMenu}
        onPointerDown={onTitleBarPointerDown}
      >
        Browser Titlebar
      </div>
      <div className="BrowserPanelBody" data-testid="mock-browser-body">
        Mock Browser Body
      </div>
      <div>{`Browser Panel ${
        isPoppedOut === true ? 'poppedout' : isFloating === true ? 'floating' : 'docked'
      } ${
        presentationMode ?? (isCollapsed === true ? 'collapsed' : 'expanded')
      }`}</div>
      <button
        type="button"
        aria-label="Mock browser toggle collapse"
        onClick={onCyclePresentationMode ?? onToggleCollapsed}
      >
        Toggle Browser Collapse
      </button>
      {showQuickDockButton ? (
        <button type="button" aria-label="Mock browser quick dock" onClick={onQuickDock}>
          Quick Dock Browser
        </button>
      ) : null}
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

function BrowserDockHostHarness({
  slotHeaderDragSeed = null,
  onConsumeSlotHeaderDragSeed = () => {},
}: {
  slotHeaderDragSeed?: {
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null
  onConsumeSlotHeaderDragSeed?: () => void
}) {
  const appShellRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const viewportSplitHostRef = useRef<HTMLDivElement | null>(null)
  const leftDockHostRef = useRef<HTMLDivElement | null>(null)
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const activePreviewPanelId = useWorkspaceStore((state) => state.activeLeftDockPreviewPanelId)
  const viewportSlotsById = useWorkspaceStore((state) => state.viewportSlotsById)
  const resolveLeftDockPreviewPanelId = (
    panelId: 'browser' | 'meatball-editor',
    clientX: number,
    clientY: number,
  ) => {
    if (panelId !== 'browser') {
      return null
    }
    const rect = dockedBrowserHostRef.current?.getBoundingClientRect()
    const parentRect = dockedBrowserHostRef.current?.parentElement?.getBoundingClientRect()
    const statusRect = leftDockHostRef.current
      ?.querySelector('.PrimaryViewportLeftDockStatus')
      ?.getBoundingClientRect()
    if (rect === undefined) {
      return null
    }
    const left = rect.width > 1 ? rect.left : (parentRect?.left ?? rect.left)
    const right = rect.width > 1 ? rect.right : (parentRect?.right ?? rect.right)
    const top = rect.height > 1 ? rect.top : (parentRect?.top ?? rect.top)
    const bottom =
      rect.height > 1 ? rect.bottom : Math.max(top + 72, parentRect?.bottom ?? top + 72)
    const isInsideDockTarget =
      clientX >= left &&
      clientX <= right &&
      clientY >= top &&
      clientY <= bottom
    const isInsideStatusTarget =
      statusRect !== undefined &&
      clientX >= statusRect.left &&
      clientX <= statusRect.right &&
      clientY >= statusRect.top &&
      clientY <= statusRect.bottom
    return isInsideDockTarget || isInsideStatusTarget
      ? 'browser'
      : null
  }

  return (
    <div ref={appShellRef} className="AppShellRoot">
      <div ref={viewportRef} className="ViewportArea">
        {Object.values(viewportSlotsById).map((slot) => (
          <div key={slot.slotId} className="MockWorkspaceSlot" data-workspace-slot-id={slot.slotId}>
            {slot.surfaceKind === 'modelViewer' ? <div className="ViewportFrameBody" /> : null}
          </div>
        ))}
        <div ref={viewportSplitHostRef} className="BrowserViewportSplitHost" />
      </div>
      <div ref={leftDockHostRef} className="PrimaryViewportLeftDock">
        <div className="PrimaryViewportLeftDockStatus">Title Status</div>
        <div className="PrimaryViewportLeftDockPanelStackShell isConstrained">
          <div className="PanelStack isConstrained">
            <div
              ref={dockedBrowserHostRef}
              className={`PrimaryViewportLeftDockPanelTarget PrimaryViewportLeftDockPanelTarget--browser ${
                activePreviewPanelId === 'browser' ? 'isPreviewActive' : ''
              }`}
            />
          </div>
        </div>
      </div>
      <BrowserDockHost
        appShellRef={appShellRef}
        viewportRef={viewportRef}
        viewportSplitHostRef={viewportSplitHostRef}
        dockedBrowserHostRef={dockedBrowserHostRef}
        resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
        onActivateBrowserFloatingWindow={() => {}}
        newEditorSpawnPosition={{ x: 345, y: 16 }}
        workspaceActiveSurface={null}
        slotHeaderDragSeed={slotHeaderDragSeed}
        onConsumeSlotHeaderDragSeed={onConsumeSlotHeaderDragSeed}
      />
    </div>
  )
}

describe('BrowserDockHost', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalWindowOpen = window.open
  const originalElementsFromPoint = document.elementsFromPoint

  beforeEach(() => {
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    window.open = originalWindowOpen
    document.elementsFromPoint =
      originalElementsFromPoint === undefined
        ? ((() => []) as typeof document.elementsFromPoint)
        : originalElementsFromPoint.bind(document)
  })

  const renderHarness = async (props?: Parameters<typeof BrowserDockHostHarness>[0]) => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(<BrowserDockHostHarness {...props} />)
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
    mockRect(container?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser'), {
      left: 16,
      top: 88,
      width: browserWidth,
      height: 420,
    })
    mockRect(container?.querySelector('.PrimaryViewportLeftDockStatus'), {
      left: 16,
      top: 16,
      width: 320,
      height: 56,
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
    document.elementsFromPoint =
      originalElementsFromPoint === undefined
        ? ((() => []) as typeof document.elementsFromPoint)
        : originalElementsFromPoint.bind(document)
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
      container
        ?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser')
        ?.classList.contains('isPreviewActive'),
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

  it('forwards wheel scrolling from the whole left-docked browser surface into the browser body', async () => {
    await renderHarness()
    mockGeometry()

    const dockedHost = container?.querySelector(
      '.PrimaryViewportLeftDockPanelTarget--browser > div',
    ) as HTMLDivElement | null
    const panelStack = container?.querySelector('.PanelStack') as HTMLDivElement | null
    const browserBody = container?.querySelector(
      '[data-testid="mock-browser-body"]',
    ) as HTMLDivElement | null

    expect(dockedHost).not.toBeNull()
    expect(panelStack).not.toBeNull()
    expect(browserBody).not.toBeNull()

    if (panelStack !== null) {
      Object.defineProperty(panelStack, 'clientHeight', {
        configurable: true,
        value: 220,
      })
      Object.defineProperty(panelStack, 'scrollHeight', {
        configurable: true,
        value: 560,
      })
      Object.defineProperty(panelStack, 'scrollTop', {
        configurable: true,
        get: () => panelStack.dataset.scrollTop === undefined ? 0 : Number(panelStack.dataset.scrollTop),
        set: (value: number) => {
          panelStack.dataset.scrollTop = String(value)
        },
      })
    }

    if (browserBody !== null) {
      Object.defineProperty(browserBody, 'clientHeight', {
        configurable: true,
        value: 160,
      })
      Object.defineProperty(browserBody, 'scrollHeight', {
        configurable: true,
        value: 520,
      })
      Object.defineProperty(browserBody, 'scrollTop', {
        configurable: true,
        get: () => browserBody.dataset.scrollTop === undefined ? 0 : Number(browserBody.dataset.scrollTop),
        set: (value: number) => {
          browserBody.dataset.scrollTop = String(value)
        },
      })
    }

    const wheelEvent = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 96,
    })

    await act(async () => {
      dockedHost?.dispatchEvent(wheelEvent)
    })

    expect(panelStack?.dataset.scrollTop).toBe('96')
  })

  it('keeps the docked browser visible while opening a child-window popout copy', async () => {
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
    expect(container?.textContent).toContain('Browser Panel docked expanded')
    expect(popoutDocument.body.textContent).toContain('Browser Panel poppedout expanded')

    await act(async () => {
      beforeUnloadHandler?.()
    })

    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('still lets the original docked browser drag into floating while a popout copy is open', async () => {
    await renderHarness()
    mockGeometry()

    const popoutDocument = document.implementation.createHTMLDocument('Browser Popout')
    const popoutWindow = {
      get closed() {
        return false
      },
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    const popoutButton = container?.querySelector(
      'button[aria-label="Mock browser popout"]',
    ) as HTMLButtonElement | null
    const dockedTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-docked"]',
    ) as HTMLDivElement | null

    await act(async () => {
      popoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(popoutDocument.body.textContent).toContain('Browser Panel poppedout expanded')
    expect(container?.textContent).toContain('Browser Panel docked expanded')

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

    expect(useWorkspaceStore.getState().browserShell.isPoppedOut).toBe(true)
    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()
    expect(popoutDocument.body.textContent).toContain('Browser Panel poppedout expanded')
  })

  it('shows separate quick dock and popout controls for a floating browser', async () => {
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

    const quickDockButton = container?.querySelector(
      'button[aria-label="Mock browser quick dock"]',
    ) as HTMLButtonElement | null
    const popoutButton = container?.querySelector(
      'button[aria-label="Mock browser popout"]',
    ) as HTMLButtonElement | null

    expect(quickDockButton).not.toBeNull()
    expect(popoutButton).not.toBeNull()

    await act(async () => {
      quickDockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('quick-docks a detached slotted browser back into the toolbar through the shared route path', async () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-surface-1',
    })

    const detachedSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(detachedSlotId).toBeTruthy()

    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'floating')
    useWorkspaceStore.getState().setBrowserFloating(true)

    await renderHarness()
    mockGeometry()

    const quickDockButton = container?.querySelector(
      'button[aria-label="Mock browser quick dock"]',
    ) as HTMLButtonElement | null

    expect(quickDockButton).not.toBeNull()

    await act(async () => {
      quickDockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['browser-surface-1']).toBeUndefined()
    expect(useWorkspaceStore.getState().browserToolbarOwnerSurfaceInstanceId).toBe('browser-surface-1')
    expect(useWorkspaceStore.getState().browserShell.isFloating).toBe(false)
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 900,
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
    expect(container?.querySelector('.BrowserViewportSplitWindow')).toBeNull()
    expect(useWorkspaceStore.getState().browserShell.isViewportSplit).toBe(false)
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'browser',
      ),
    ).toHaveLength(1)
    const rootNode =
      useWorkspaceStore.getState().viewportLayoutNodesById[
        useWorkspaceStore.getState().viewportSlotRootNodeId
      ]
    expect(rootNode?.kind).toBe('split')
    expect(rootNode?.kind === 'split' ? rootNode.splitDockSide : null).toBe('right')
    expect(useWorkspaceStore.getState().browserShell.viewportSplitRatio).toBeCloseTo(
      320 / 544,
      5,
    )
  })

  it('commits a whole-layout top split above an existing left browser and model viewport when the whole-browser top ghost is dropped', async () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'left', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-existing-left',
      preferredRatio: 0.32,
    })

    await renderHarness()
    mockGeometry()

    const primarySlotElement = container?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotBodyElement = primarySlotElement?.querySelector(
      '.ViewportFrameBody',
    ) as HTMLDivElement | null
    const browserSlotElement = Array.from(
      container?.querySelectorAll('[data-workspace-slot-id]') ?? [],
    ).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') !== defaultPrimaryViewportSlotId,
    ) as HTMLDivElement | undefined

    mockRect(browserSlotElement, {
      left: 0,
      top: 0,
      width: 320,
      height: 900,
    })
    mockRect(primarySlotElement, {
      left: 320,
      top: 0,
      width: 544,
      height: 900,
    })
    mockRect(primarySlotBodyElement, {
      left: 320,
      top: 38,
      width: 544,
      height: 862,
    })

    document.elementsFromPoint = ((clientX: number, clientY: number) => {
      if (clientX >= 320 && clientX <= 864 && clientY >= 0 && clientY <= 900) {
        return primarySlotElement !== null ? [primarySlotElement] : []
      }
      if (clientX >= 0 && clientX < 320 && clientY >= 0 && clientY <= 900) {
        return browserSlotElement !== undefined ? [browserSlotElement] : []
      }
      return []
    }) as typeof document.elementsFromPoint

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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 520,
          clientY: 44,
        }),
      )
    })

    const topGhost = container?.querySelector('.ViewportSplitDockGhost.isDockTop') as
      | HTMLDivElement
      | null
    expect(topGhost?.dataset.splitPreviewScope).toBe('global')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 520,
          clientY: 44,
        }),
      )
    })

    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(useWorkspaceStore.getState().browserShell.isViewportSplit).toBe(false)
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'browser',
      ),
    ).toHaveLength(2)
    const nextRootNode =
      useWorkspaceStore.getState().viewportLayoutNodesById[
        useWorkspaceStore.getState().viewportSlotRootNodeId
      ]
    expect(nextRootNode?.kind).toBe('split')
    expect(nextRootNode?.kind === 'split' ? nextRootNode.splitDockSide : null).toBe('top')
    const secondChildNodeId =
      nextRootNode?.kind === 'split' ? nextRootNode.secondChildId : null
    const secondChildNode =
      secondChildNodeId === null
        ? null
        : useWorkspaceStore.getState().viewportLayoutNodesById[secondChildNodeId]
    expect(secondChildNode?.kind).toBe('split')
  })

  it('uses the outer right-edge band to commit a pane-local slot split instead of the whole-browser split path', async () => {
    await renderHarness()
    mockGeometry()

    const primarySlotElement = container?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotBodyElement = primarySlotElement?.querySelector(
      '.ViewportFrameBody',
    ) as HTMLDivElement | null

    mockRect(primarySlotElement, {
      left: 320,
      top: 0,
      width: 544,
      height: 900,
    })
    mockRect(primarySlotBodyElement, {
      left: 320,
      top: 38,
      width: 544,
      height: 862,
    })

    document.elementsFromPoint = ((clientX: number, clientY: number) => {
      if (clientX >= 320 && clientX <= 864 && clientY >= 0 && clientY <= 900) {
        return primarySlotElement !== null ? [primarySlotElement] : []
      }
      return []
    }) as typeof document.elementsFromPoint

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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 846,
          clientY: 260,
        }),
      )
    })

    const rightGhost = container?.querySelector('.ViewportSplitDockGhost.isDockRight') as
      | HTMLDivElement
      | null
    expect(rightGhost).not.toBeNull()
    expect(rightGhost?.dataset.splitPreviewScope).toBe('local')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 846,
          clientY: 260,
        }),
      )
    })

    expect(useWorkspaceStore.getState().browserShell.isViewportSplit).toBe(false)
    const browserSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'browser',
    )
    expect(browserSlots.length).toBe(1)
    expect(browserSlots[0]?.slotId).not.toBe(defaultPrimaryViewportSlotId)
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
  })

  it('uses cursor position inside the viewport to show a top split ghost even when the floating browser frame is not flush to the top edge', async () => {
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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 520,
          clientY: 8,
        }),
      )
    })

    expect(container?.querySelector('.ViewportSplitDockGhost.isDockTop')).not.toBeNull()
  })

  it('uses pane-local geometry in the outer right-edge band and whole-browser geometry in the inner right-edge band', async () => {
    const rightBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'right',
      {
        surfaceKind: 'browser',
      },
    )
    const topBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'top',
      {
        surfaceKind: 'browser',
      },
    )

    expect(rightBrowserSlotId).toBeTruthy()
    expect(topBrowserSlotId).toBeTruthy()

    await renderHarness()
    mockGeometry()

    const topBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${topBrowserSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotElement = container?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotBodyElement = primarySlotElement?.querySelector('.ViewportFrameBody') as HTMLDivElement | null
    const rightBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${rightBrowserSlotId}"]`,
    ) as HTMLDivElement | null

    mockRect(topBrowserSlotElement, {
      left: 320,
      top: 0,
      width: 360,
      height: 220,
    })
    mockRect(primarySlotElement, {
      left: 320,
      top: 220,
      width: 360,
      height: 680,
    })
    mockRect(primarySlotBodyElement, {
      left: 320,
      top: 258,
      width: 360,
      height: 642,
    })
    mockRect(rightBrowserSlotElement, {
      left: 680,
      top: 0,
      width: 184,
      height: 900,
    })

    document.elementsFromPoint = ((clientX: number, clientY: number) => {
      if (clientX >= 680 && clientX <= 864 && clientY >= 0 && clientY <= 900) {
        return rightBrowserSlotElement !== null ? [rightBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 0 && clientY <= 220) {
        return topBrowserSlotElement !== null ? [topBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 220 && clientY <= 900) {
        return primarySlotElement !== null ? [primarySlotElement] : []
      }
      return []
    }) as typeof document.elementsFromPoint

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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 662,
          clientY: 520,
        }),
      )
    })

    const rightGhost = container?.querySelector('.ViewportSplitDockGhost.isDockRight') as HTMLDivElement | null
    expect(rightGhost).not.toBeNull()
    expect(rightGhost?.dataset.splitPreviewScope).toBe('local')
    expect(rightGhost?.style.left).toBe('280px')
    expect(rightGhost?.style.top).toBe('258px')
    expect(rightGhost?.style.width).toBe('80px')
    expect(rightGhost?.style.height).toBe('642px')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 670,
          clientY: 520,
        }),
      )
    })

    const wholeBrowserRightGhost = container?.querySelector(
      '.ViewportSplitDockGhost.isDockRight',
    ) as HTMLDivElement | null
    expect(wholeBrowserRightGhost).not.toBeNull()
    expect(wholeBrowserRightGhost?.dataset.splitPreviewScope).toBe('global')
    expect(wholeBrowserRightGhost?.style.left).toBe('418px')
    expect(wholeBrowserRightGhost?.style.top).toBe('0px')
    expect(wholeBrowserRightGhost?.style.width).toBe('126px')
    expect(wholeBrowserRightGhost?.style.height).toBe('900px')
  })

  it('uses pane-local geometry in the outer left-edge band and whole-browser geometry in the inner left-edge band', async () => {
    const rightBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'right',
      {
        surfaceKind: 'browser',
      },
    )
    const topBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'top',
      {
        surfaceKind: 'browser',
      },
    )

    expect(rightBrowserSlotId).toBeTruthy()
    expect(topBrowserSlotId).toBeTruthy()

    await renderHarness()
    mockGeometry()

    const topBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${topBrowserSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotElement = container?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotBodyElement = primarySlotElement?.querySelector('.ViewportFrameBody') as HTMLDivElement | null
    const rightBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${rightBrowserSlotId}"]`,
    ) as HTMLDivElement | null

    mockRect(topBrowserSlotElement, {
      left: 320,
      top: 0,
      width: 360,
      height: 220,
    })
    mockRect(primarySlotElement, {
      left: 320,
      top: 220,
      width: 360,
      height: 680,
    })
    mockRect(primarySlotBodyElement, {
      left: 320,
      top: 258,
      width: 360,
      height: 642,
    })
    mockRect(rightBrowserSlotElement, {
      left: 680,
      top: 0,
      width: 184,
      height: 900,
    })

    document.elementsFromPoint = ((clientX: number, clientY: number) => {
      if (clientX >= 680 && clientX <= 864 && clientY >= 0 && clientY <= 900) {
        return rightBrowserSlotElement !== null ? [rightBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 0 && clientY <= 220) {
        return topBrowserSlotElement !== null ? [topBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 220 && clientY <= 900) {
        return primarySlotElement !== null ? [primarySlotElement] : []
      }
      return []
    }) as typeof document.elementsFromPoint

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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 338,
          clientY: 520,
        }),
      )
    })

    const leftGhost = container?.querySelector('.ViewportSplitDockGhost.isDockLeft') as HTMLDivElement | null
    expect(leftGhost).not.toBeNull()
    expect(leftGhost?.dataset.splitPreviewScope).toBe('local')
    expect(leftGhost?.style.left).toBe('0px')
    expect(leftGhost?.style.top).toBe('258px')
    expect(leftGhost?.style.width).toBe('80px')
    expect(leftGhost?.style.height).toBe('642px')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 330,
          clientY: 520,
        }),
      )
    })

    const wholeBrowserLeftGhost = container?.querySelector(
      '.ViewportSplitDockGhost.isDockLeft',
    ) as HTMLDivElement | null
    expect(wholeBrowserLeftGhost).not.toBeNull()
    expect(wholeBrowserLeftGhost?.dataset.splitPreviewScope).toBe('global')
    expect(wholeBrowserLeftGhost?.classList.contains('isWholeBrowserScope')).toBe(true)
    expect(wholeBrowserLeftGhost?.style.left).toBe('0px')
    expect(wholeBrowserLeftGhost?.style.top).toBe('0px')
    expect(wholeBrowserLeftGhost?.style.width).toBe('126px')
    expect(wholeBrowserLeftGhost?.style.height).toBe('900px')
  })

  it('uses pane-local geometry in the outer top-edge band and whole-browser geometry in the inner top-edge band', async () => {
    const rightBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'right',
      {
        surfaceKind: 'browser',
      },
    )
    const topBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'top',
      {
        surfaceKind: 'browser',
      },
    )

    expect(rightBrowserSlotId).toBeTruthy()
    expect(topBrowserSlotId).toBeTruthy()

    await renderHarness()
    mockGeometry()

    const topBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${topBrowserSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotElement = container?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotBodyElement = primarySlotElement?.querySelector('.ViewportFrameBody') as HTMLDivElement | null
    const rightBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${rightBrowserSlotId}"]`,
    ) as HTMLDivElement | null

    mockRect(topBrowserSlotElement, {
      left: 320,
      top: 0,
      width: 360,
      height: 220,
    })
    mockRect(primarySlotElement, {
      left: 320,
      top: 220,
      width: 360,
      height: 680,
    })
    mockRect(primarySlotBodyElement, {
      left: 320,
      top: 258,
      width: 360,
      height: 642,
    })
    mockRect(rightBrowserSlotElement, {
      left: 680,
      top: 0,
      width: 184,
      height: 900,
    })

    document.elementsFromPoint = ((clientX: number, clientY: number) => {
      if (clientX >= 680 && clientX <= 864 && clientY >= 0 && clientY <= 900) {
        return rightBrowserSlotElement !== null ? [rightBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 0 && clientY <= 220) {
        return topBrowserSlotElement !== null ? [topBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 220 && clientY <= 900) {
        return primarySlotElement !== null ? [primarySlotElement] : []
      }
      return []
    }) as typeof document.elementsFromPoint

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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
          clientY: 276,
        }),
      )
    })

    const topGhost = container?.querySelector('.ViewportSplitDockGhost.isDockTop') as HTMLDivElement | null
    expect(topGhost).not.toBeNull()
    expect(topGhost?.dataset.splitPreviewScope).toBe('local')
    expect(topGhost?.style.left).toBe('0px')
    expect(topGhost?.style.top).toBe('258px')
    expect(topGhost?.style.width).toBe('360px')
    expect(topGhost?.style.height).not.toBe('')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
          clientY: 268,
        }),
      )
    })

    const wholeBrowserTopGhost = container?.querySelector(
      '.ViewportSplitDockGhost.isDockTop',
    ) as HTMLDivElement | null
    expect(wholeBrowserTopGhost).not.toBeNull()
    expect(wholeBrowserTopGhost?.dataset.splitPreviewScope).toBe('global')
    expect(wholeBrowserTopGhost?.classList.contains('isWholeBrowserScope')).toBe(true)
    expect(wholeBrowserTopGhost?.style.left).toBe('0px')
    expect(wholeBrowserTopGhost?.style.top).toBe('0px')
    expect(wholeBrowserTopGhost?.style.width).toBe('544px')
    expect(wholeBrowserTopGhost?.style.height).not.toBe('')
  })

  it('uses pane-local geometry in the outer bottom-edge band and whole-browser geometry in the inner bottom-edge band', async () => {
    const rightBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'right',
      {
        surfaceKind: 'browser',
      },
    )
    const topBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'top',
      {
        surfaceKind: 'browser',
      },
    )

    expect(rightBrowserSlotId).toBeTruthy()
    expect(topBrowserSlotId).toBeTruthy()

    await renderHarness()
    mockGeometry()

    const topBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${topBrowserSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotElement = container?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotBodyElement = primarySlotElement?.querySelector('.ViewportFrameBody') as HTMLDivElement | null
    const rightBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${rightBrowserSlotId}"]`,
    ) as HTMLDivElement | null

    mockRect(topBrowserSlotElement, {
      left: 320,
      top: 0,
      width: 360,
      height: 220,
    })
    mockRect(primarySlotElement, {
      left: 320,
      top: 220,
      width: 360,
      height: 680,
    })
    mockRect(primarySlotBodyElement, {
      left: 320,
      top: 258,
      width: 360,
      height: 642,
    })
    mockRect(rightBrowserSlotElement, {
      left: 680,
      top: 0,
      width: 184,
      height: 900,
    })

    document.elementsFromPoint = ((clientX: number, clientY: number) => {
      if (clientX >= 680 && clientX <= 864 && clientY >= 0 && clientY <= 900) {
        return rightBrowserSlotElement !== null ? [rightBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 0 && clientY <= 220) {
        return topBrowserSlotElement !== null ? [topBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 220 && clientY <= 900) {
        return primarySlotElement !== null ? [primarySlotElement] : []
      }
      return []
    }) as typeof document.elementsFromPoint

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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
          clientY: 882,
        }),
      )
    })

    const bottomGhost = container?.querySelector('.ViewportSplitDockGhost.isDockBottom') as HTMLDivElement | null
    expect(bottomGhost).not.toBeNull()
    expect(bottomGhost?.dataset.splitPreviewScope).toBe('local')
    expect(bottomGhost?.style.left).toBe('0px')
    expect(bottomGhost?.style.width).toBe('360px')
    expect(bottomGhost?.style.height).not.toBe('')
    expect(bottomGhost?.style.top).not.toBe('0px')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
          clientY: 890,
        }),
      )
    })

    const wholeBrowserBottomGhost = container?.querySelector(
      '.ViewportSplitDockGhost.isDockBottom',
    ) as HTMLDivElement | null
    expect(wholeBrowserBottomGhost).not.toBeNull()
    expect(wholeBrowserBottomGhost?.dataset.splitPreviewScope).toBe('global')
    expect(wholeBrowserBottomGhost?.classList.contains('isWholeBrowserScope')).toBe(true)
    expect(wholeBrowserBottomGhost?.style.left).toBe('0px')
    expect(wholeBrowserBottomGhost?.style.top).not.toBe('0px')
    expect(wholeBrowserBottomGhost?.style.width).toBe('544px')
    expect(wholeBrowserBottomGhost?.style.height).not.toBe('')
  })

  it('shows immediate nested dual ghosts over an already split pane and splits that hovered slot with Browser on release', async () => {
    const consoleSlotId = useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'top', {
      surfaceKind: 'console',
    })
    expect(consoleSlotId).toBeTruthy()

    await renderHarness()
    mockGeometry()

    const consoleSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${consoleSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotElement = container?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    ) as HTMLDivElement | null

    mockRect(consoleSlotElement, {
      left: 320,
      top: 0,
      width: 544,
      height: 220,
    })
    mockRect(primarySlotElement, {
      left: 320,
      top: 220,
      width: 544,
      height: 680,
    })

    document.elementsFromPoint = ((clientX: number, clientY: number) => {
      if (clientX >= 320 && clientX <= 864 && clientY >= 0 && clientY <= 220) {
        return consoleSlotElement !== null ? [consoleSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 864 && clientY >= 220 && clientY <= 900) {
        return primarySlotElement !== null ? [primarySlotElement] : []
      }
      return []
    }) as typeof document.elementsFromPoint

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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 120,
        }),
      )
    })

    expect(
      container?.querySelectorAll('.ViewportSplitDockGhost[data-split-preview-kind="nested"]').length,
    ).toBe(2)
    expect(
      container?.querySelector(
        '.ViewportSplitDockGhost[data-split-preview-kind="nested"][data-split-preview-side="left"][data-split-preview-active="true"]',
      ),
    ).not.toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 120,
        }),
      )
    })

    const browserSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'browser',
    )
    expect(browserSlots.length).toBe(1)
    expect(browserSlots[0]?.slotId).not.toBe(defaultPrimaryViewportSlotId)
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
  })

  it('treats model pane interiors as plain floating space and only offers split previews at the edges', async () => {
    const rightBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'right',
      {
        surfaceKind: 'browser',
      },
    )
    const topBrowserSlotId = useWorkspaceStore.getState().splitViewportSlot(
      defaultPrimaryViewportSlotId,
      'top',
      {
        surfaceKind: 'browser',
      },
    )

    expect(rightBrowserSlotId).toBeTruthy()
    expect(topBrowserSlotId).toBeTruthy()

    await renderHarness()
    mockGeometry()

    const topBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${topBrowserSlotId}"]`,
    ) as HTMLDivElement | null
    const primarySlotElement = container?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    ) as HTMLDivElement | null
    const rightBrowserSlotElement = container?.querySelector(
      `[data-workspace-slot-id="${rightBrowserSlotId}"]`,
    ) as HTMLDivElement | null

    mockRect(topBrowserSlotElement, {
      left: 320,
      top: 0,
      width: 360,
      height: 220,
    })
    mockRect(primarySlotElement, {
      left: 320,
      top: 220,
      width: 360,
      height: 680,
    })
    mockRect(rightBrowserSlotElement, {
      left: 680,
      top: 0,
      width: 184,
      height: 900,
    })

    document.elementsFromPoint = ((clientX: number, clientY: number) => {
      if (clientX >= 680 && clientX <= 864 && clientY >= 0 && clientY <= 900) {
        return rightBrowserSlotElement !== null ? [rightBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 0 && clientY <= 220) {
        return topBrowserSlotElement !== null ? [topBrowserSlotElement] : []
      }
      if (clientX >= 320 && clientX <= 680 && clientY >= 220 && clientY <= 900) {
        return primarySlotElement !== null ? [primarySlotElement] : []
      }
      return []
    }) as typeof document.elementsFromPoint

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
          clientX: 280,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
          clientY: 520,
        }),
      )
    })

    expect(
      container?.querySelector('.ViewportSplitDockGhost[data-split-preview-kind="float-drop"]'),
    ).toBeNull()
    expect(
      container?.querySelectorAll('.ViewportSplitDockGhost[data-split-preview-kind="nested"]').length,
    ).toBe(0)
    expect(container?.querySelector('.ViewportSplitDockGhost.isDockTop')).toBeNull()
    expect(container?.querySelector('.ViewportSplitDockGhost.isDockRight')).toBeNull()
    expect(container?.querySelector('.ViewportSplitDockGhost.isDockBottom')).toBeNull()
    expect(container?.querySelector('.ViewportSplitDockGhost.isDockLeft')).toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
          clientY: 520,
        }),
      )
    })

    const browserSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'browser',
    )
    expect(browserSlots.length).toBe(2)
    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()
  })

  it('opens a floating browser titlebar split menu and moves the browser into a left split', async () => {
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
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 180,
        }),
      )
    })

    const splitLeftButton = Array.from(
      container?.querySelectorAll('.WorkspaceSplitMenu button') ?? [],
    ).find((element) => element.textContent?.trim() === 'Split Left') as HTMLButtonElement | undefined

    expect(splitLeftButton).not.toBeUndefined()

    await act(async () => {
      splitLeftButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useWorkspaceStore.getState().browserShell.isViewportSplit).toBe(true)
    expect(useWorkspaceStore.getState().browserShell.viewportSplitDockSide).toBe('left')
    expect(useWorkspaceStore.getState().browserShell.viewportSplitRatio).toBeCloseTo(
      320 / 544,
      5,
    )
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.querySelector('.BrowserViewportSplitWindow')).not.toBeNull()
  })

  it('uses the floating split menu to redock a detached slotted browser into the slot tree', async () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-surface-1',
    })

    const detachedSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(detachedSlotId).toBeTruthy()

    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'floating')
    useWorkspaceStore.getState().setBrowserFloating(true)
    useWorkspaceStore.getState().setBrowserViewportSplitRatio(320 / 544)

    await renderHarness()
    mockGeometry()

    const floatingTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-floating"]',
    ) as HTMLDivElement | null

    await act(async () => {
      floatingTitlebar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 180,
        }),
      )
    })

    const splitLeftButton = Array.from(
      container?.querySelectorAll('.WorkspaceSplitMenu button') ?? [],
    ).find((element) => element.textContent?.trim() === 'Split Left') as HTMLButtonElement | undefined

    expect(splitLeftButton).not.toBeUndefined()

    await act(async () => {
      splitLeftButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const browserSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'browser',
    )
    expect(browserSlots).toHaveLength(1)
    expect(browserSlots[0]?.surfaceInstanceId).toBe('browser-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['browser-surface-1']).toBeUndefined()
    expect(useWorkspaceStore.getState().browserShell.isFloating).toBe(false)
    expect(useWorkspaceStore.getState().browserShell.isViewportSplit).toBe(false)
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
  })

  it('locks text selection while dragging a viewport-split browser back into floating mode', async () => {
    useWorkspaceStore.getState().setBrowserViewportSplitDockSide('left')
    useWorkspaceStore.getState().setBrowserViewportSplitRatio(320 / 544)
    useWorkspaceStore.getState().setBrowserViewportSplit(true)

    await renderHarness()
    mockGeometry()

    const splitTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-docked"]',
    ) as HTMLDivElement | null

    expect(document.body.style.userSelect).toBe('')

    await act(async () => {
      splitTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 120,
          clientY: 120,
        }),
      )
    })

    expect(document.body.style.userSelect).toBe('none')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 180,
          clientY: 160,
        }),
      )
    })

    expect(document.body.style.userSelect).toBe('')
  })

  it('redocks a detached slotted browser directly into the slot tree when edge-dropped from floating', async () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-surface-1',
    })

    const detachedSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(detachedSlotId).toBeTruthy()

    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'floating')
    useWorkspaceStore.getState().setBrowserFloating(true)

    await renderHarness()
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

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 900,
          clientY: 260,
        }),
      )
    })

    const browserSlot = Object.values(useWorkspaceStore.getState().viewportSlotsById).find(
      (slot) => slot.surfaceKind === 'browser',
    )

    expect(browserSlot?.surfaceInstanceId).toBe('browser-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['browser-surface-1']).toBeUndefined()
    expect(container?.querySelector('.BrowserViewportSplitWindow')).toBeNull()
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
  })

  it('shows the left dock preview and docks a detached slotted browser back into the toolbar', async () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-surface-1',
    })

    const detachedSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(detachedSlotId).toBeTruthy()

    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'floating')
    useWorkspaceStore.getState().setBrowserFloating(true)

    await renderHarness()
    mockGeometry()
    mockRect(container?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser'), {
      left: 16,
      top: 88,
      width: 320,
      height: 0,
    })
    mockRect(
      container?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser')?.parentElement,
      {
        left: 16,
        top: 88,
        width: 320,
        height: 480,
      },
    )

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
          clientX: 120,
          clientY: 180,
        }),
      )
    })

    expect(
      container
        ?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser')
        ?.classList.contains('isPreviewActive'),
    ).toBe(true)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 180,
        }),
      )
    })

    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['browser-surface-1']).toBeUndefined()
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('treats the left dock status bar as a browser dock target', async () => {
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
          clientX: 260,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 40,
        }),
      )
    })

    expect(
      container
        ?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser')
        ?.classList.contains('isPreviewActive'),
    ).toBe(true)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 40,
        }),
      )
    })

    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.textContent).toContain('Browser Panel docked expanded')
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

  it('re-docks a viewport-split browser back into the left toolbar even when the dock target is empty', async () => {
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
    mockRect(container?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser'), {
      left: 16,
      top: 88,
      width: 320,
      height: 0,
    })
    mockRect(
      container?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser')?.parentElement,
      {
        left: 16,
        top: 88,
        width: 320,
        height: 480,
      },
    )

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
          clientX: 120,
          clientY: 180,
        }),
      )
    })

    expect(
      container
        ?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser')
        ?.classList.contains('isPreviewActive'),
    ).toBe(true)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 180,
        }),
      )
    })

    expect(container?.querySelector('.BrowserViewportSplitWindow')).toBeNull()
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('consumes a slotted-header drag seed to initialize the floating browser handoff', async () => {
    const consumeSeed = vi.fn()

    await renderHarness()
    mockGeometry()

    await act(async () => {
      useWorkspaceStore.getState().setBrowserFloating(true)
      useWorkspaceStore.getState().setBrowserFloatingPosition({ x: 0, y: 0 })
    })

    await act(async () => {
      root?.render(
        <BrowserDockHostHarness
          slotHeaderDragSeed={{
            pointerId: 7,
            clientX: 520,
            clientY: 180,
            pointerOffsetX: 60,
            pointerOffsetY: 24,
            titleBarHeight: 40,
          }}
          onConsumeSlotHeaderDragSeed={consumeSeed}
        />,
      )
    })
    mockGeometry()

    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()
    expect(consumeSeed).toHaveBeenCalledTimes(1)
    expect(useWorkspaceStore.getState().browserShell.position.x).toBeGreaterThan(0)
  })
})
