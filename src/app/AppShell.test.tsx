// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConsoleStore } from './console/useConsoleStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let currentSpaghettiState: any
let currentAppState: any
let currentBuildStatsState: any

vi.mock('./spaghetti/store/useSpaghettiStore', () => ({
  defaultViewportPosition: { x: 12, y: 12 },
  defaultViewportSize: { width: 980, height: 760 },
  useSpaghettiStore: (selector: (state: any) => unknown) => selector(currentSpaghettiState),
  selectActiveEditorViewport: (state: any) =>
    state.editorViewportsById[state.activeEditorViewportId] ?? null,
  selectEditorViewportById: (state: any, editorViewportId: string) =>
    state.editorViewportsById[editorViewportId] ?? null,
}))

vi.mock('./store/useAppStore', () => ({
  useAppStore: (selector: (state: any) => unknown) => selector(currentAppState),
}))

vi.mock('./store/buildStatsStore', () => ({
  useBuildStatsStore: (selector: (state: any) => unknown) => selector(currentBuildStatsState),
}))

vi.mock('./components/BuildStatsDrawer', () => ({
  BuildStatsDrawer: () => <div>Build Stats Drawer</div>,
}))

vi.mock('./components/TitleStatusBar', () => ({
  TitleStatusBar: () => <div>Title Status</div>,
}))

vi.mock('./components/Toolbar', () => ({
  Toolbar: () => <div>Toolbar Panel</div>,
}))

vi.mock('./components/ViewToolbar', () => ({
  ViewToolbar: () => <div>View Toolbar</div>,
}))

vi.mock('./components/ViewerHost', () => ({
  ViewerHost: () => <div>Viewer Host</div>,
}))

vi.mock('./components/ViewportOverlay', () => ({
  ViewportOverlay: () => <div>Viewport Overlay</div>,
}))

vi.mock('./panels/BrowserPanel', () => ({
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
    onTitleBarPointerDown?: (event: any) => void
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

vi.mock('./panels/PartsListPanel', () => ({
  PartsListPanel: () => <div>Parts List Panel</div>,
}))

vi.mock('./panels/BoxPanel', () => ({
  BoxPanel: () => <div>Legacy Box Panel</div>,
}))

vi.mock('./panels/SpaghettiPanel', () => ({
  SpaghettiPanel: ({
    editorViewportId,
    isHeaderCollapsed,
    isCanvasToolbarVisible,
    isWindowSettingsOpen,
    windowAppearance,
  }: {
    editorViewportId: string
    isHeaderCollapsed?: boolean
    isCanvasToolbarVisible?: boolean
    isWindowSettingsOpen?: boolean
    windowAppearance?: { fontScale?: string }
  }) => (
    <div>{`Spaghetti Panel ${editorViewportId} ${
      isHeaderCollapsed === true ? 'header-collapsed' : 'header-expanded'
    } ${isCanvasToolbarVisible === false ? 'canvas-toolbar-hidden' : 'canvas-toolbar-visible'} ${
      isWindowSettingsOpen === true ? 'window-settings-open' : 'window-settings-closed'
    } ${windowAppearance?.fontScale ?? 'font-md'}`}</div>
  ),
}))

import { AppShell } from './AppShell'

const viewport = (windowMode: string) => ({
  editorViewportId: 'editor-viewport-1',
  graphDocumentId: 'graph-document-1',
  isFocused: true,
  windowMode,
  position: { x: 24, y: 28 },
  size: { width: 800, height: 600 },
  splitRatio: 0.6,
  restoreFromCollapsed: null,
  restoreFromSplit: null,
  zOrder: 5,
})

const renderAppShell = async () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  await act(async () => {
    root.render(<AppShell />)
  })
  return { container, root }
}

const rerenderAppShell = async (root: Root) => {
  await act(async () => {
    root.render(<AppShell />)
  })
}

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

const mockShellGeometry = (container: HTMLDivElement | null) => {
  mockRect(container?.querySelector('.AppShellRoot'), {
    left: 0,
    top: 0,
    width: 1440,
    height: 900,
  })
  mockElementSize(container?.querySelector('.AppShellRoot'), {
    width: 1440,
    height: 900,
  })
  mockRect(container?.querySelector('.ViewportArea'), {
    left: 320,
    top: 0,
    width: 1120,
    height: 900,
  })
  mockElementSize(container?.querySelector('.ViewportArea'), {
    width: 1120,
    height: 900,
  })
  mockRect(container?.querySelector('.LeftDockPanelTarget--browser'), {
    left: 16,
    top: 88,
    width: 320,
    height: 420,
  })
  mockRect(container?.querySelector('.LeftDockPanelTarget--meatball-editor'), {
    left: 16,
    top: 470,
    width: 320,
    height: 280,
  })
}

describe('AppShell', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    currentSpaghettiState = {
      activeEditorViewportId: 'editor-viewport-1',
      editorViewportsById: {
        'editor-viewport-1': viewport('expanded'),
      },
      graphDocumentsById: {
        'graph-document-1': {
          graphDocumentId: 'graph-document-1',
          name: 'Graph 1',
        },
      },
      graphDocumentOrder: ['graph-document-1'],
      setActiveEditorViewportId: vi.fn(),
      setEditorViewportWindowMode: vi.fn((editorViewportId: string, windowMode: string) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState.editorViewportsById[editorViewportId] = {
          ...currentViewport,
          windowMode,
        }
      }),
      setEditorViewportSplitRatio: vi.fn(),
      closeEditorViewport: vi.fn(),
      setEditorViewportPosition: vi.fn((editorViewportId: string, position: { x: number; y: number }) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState.editorViewportsById[editorViewportId] = {
          ...currentViewport,
          position,
        }
      }),
      setEditorViewportSize: vi.fn((editorViewportId: string, size: { width: number; height: number }) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState.editorViewportsById[editorViewportId] = {
          ...currentViewport,
          size,
        }
      }),
    }

    currentAppState = {
      inputMode: 'spaghetti',
      requestGraphDocumentBuild: vi.fn(),
    }

    currentBuildStatsState = {
      statsExpanded: false,
    }
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
  })

  it('renders a true header-only shell in collapsed mode', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('collapsed')

    ;({ container, root } = await renderAppShell())

    expect(container?.querySelector('.SpaghettiFloatingHandle')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiFloatingBody')).toBeNull()
    expect(container?.textContent).toContain('Viewer Host')
    expect(container?.querySelector('.ConsoleBar')).not.toBeNull()
    expect(container?.textContent).not.toContain('Spaghetti Panel editor-viewport-1')
  })

  it('keeps a persistent bottom console row and expands it from the shell', async () => {
    ;({ container, root } = await renderAppShell())

    expect(container?.querySelector('.ConsoleBar')).not.toBeNull()
    expect(container?.querySelector('.ConsolePanel')).toBeNull()

    const expandButton = container?.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null
    expect(expandButton).not.toBeNull()

    await act(async () => {
      expandButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ConsolePanel')).not.toBeNull()
  })

  it('anchors console list mode to the browser resize seam and moves it with dock resize', async () => {
    useConsoleStore.getState().appendEntry({
      layer: 'Worker',
      text: 'Build started',
      source: 'app-shell-test',
    })
    useConsoleStore.getState().switchToList()

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const listView = container?.querySelector('.ConsoleListView') as HTMLDivElement | null
    const resizeHandle = container?.querySelector('.LeftDockResizeHandle') as HTMLDivElement | null
    expect(listView).not.toBeNull()
    expect(listView?.style.left).toBe('320px')
    expect(listView?.textContent).toContain('Build started')
    expect(resizeHandle).not.toBeNull()

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 320,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 392,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 392,
          clientY: 300,
        }),
      )
    })

    expect((container?.querySelector('.ConsoleListView') as HTMLDivElement | null)?.style.left).toBe(
      '392px',
    )
  })

  it('renders split view as a non-overlay top/bottom layout', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())

    expect(container?.querySelector('.ViewportSplitLayout')).not.toBeNull()
    expect(container?.querySelector('.ViewportSplitDivider')).not.toBeNull()
    expect((container?.querySelector('.LeftDock') as HTMLElement | null)?.style.bottom).toContain(
      'calc(',
    )
    expect(container?.textContent).toContain('Viewer Host')
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.querySelector('.SpaghettiFloatingDock')).toBeNull()
  })

  it('lets split view give the lower spaghetti editor full-width priority when the left dock is also split', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const leftDockSplitButton = container?.querySelector(
      'button[aria-label=\"Toggle left dock viewport split\"]',
    ) as HTMLButtonElement | null
    expect(leftDockSplitButton).not.toBeNull()

    await act(async () => {
      leftDockSplitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const priorityButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Give spaghetti editor bottom priority in split view',
    )
    expect(priorityButton).not.toBeNull()

    await act(async () => {
      priorityButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ViewportSplitLayout')?.classList.contains('isEditorPriority')).toBe(
      true,
    )
    expect((container?.querySelector('.LeftDock') as HTMLElement | null)?.style.bottom).toContain('calc(')
  })

  it('ctrl-clicking the split spaghetti title bar detaches back to the floating editor', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())

    const splitTitleBar = container?.querySelector('.SpaghettiSplitWindow .SpaghettiFloatingHandle')
    expect(splitTitleBar).not.toBeNull()

    await act(async () => {
      splitTitleBar?.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }))
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'expanded',
    )
  })

  it('ctrl-dragging the split spaghetti title bar hands off into a live floating drag', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const splitTitleBar = container?.querySelector('.SpaghettiSplitWindow .SpaghettiFloatingHandle')
    expect(splitTitleBar).not.toBeNull()

    await act(async () => {
      splitTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          ctrlKey: true,
          clientX: 520,
          clientY: 620,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 620,
          clientY: 700,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 620,
          clientY: 700,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'expanded',
    )
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalled()
  })

  it('shows a bottom split ghost and docks the floating spaghetti editor into split view on release', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('.SpaghettiFloatingDock .SpaghettiFloatingHandle'), {
      left: 420,
      top: 40,
      width: 340,
      height: 48,
    })

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(floatingTitleBar).not.toBeNull()

    await act(async () => {
      floatingTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 520,
          clientY: 60,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 560,
          clientY: 872,
        }),
      )
    })

    expect(container?.querySelector('.ViewportBottomSplitDockGhost')).not.toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 560,
          clientY: 872,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'split view',
    )
  })

  it('keeps the floating spaghetti editor draggable when left dock viewport split is active', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('.SpaghettiFloatingDock .SpaghettiFloatingHandle'), {
      left: 420,
      top: 40,
      width: 340,
      height: 48,
    })

    const leftDockSplitButton = container?.querySelector(
      'button[aria-label=\"Toggle left dock viewport split\"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      leftDockSplitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    mockShellGeometry(container)

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    mockRect(floatingTitleBar, {
      left: 420,
      top: 40,
      width: 340,
      height: 48,
    })

    await act(async () => {
      floatingTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 520,
          clientY: 60,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 560,
          clientY: 872,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith(
      'editor-viewport-1',
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
      }),
    )
  })

  it('renders meatball editor view in the left dock below parts list', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('meatball editor view')

    ;({ container, root } = await renderAppShell())

    expect(container?.textContent).toContain('Parts List Panel')
    expect(container?.querySelector('.SpaghettiMeatballHost')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiMeatballHost .SpaghettiFloatingHandle')).not.toBeNull()
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.querySelector('.SpaghettiFloatingDock')).toBeNull()
  })

  it('moves the Browser between docked and floating hosts from the popout toggle', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    expect(container?.textContent).toContain('Browser Panel docked expanded')
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()

    const popoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Mock browser popout',
    )
    expect(popoutButton).not.toBeNull()

    await act(async () => {
      popoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Browser Panel floating expanded')
    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()

    const dockButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Mock browser popout',
    )
    expect(dockButton).not.toBeNull()

    await act(async () => {
      dockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Browser Panel docked expanded')
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
  })

  it('lets the user resize the full left dock width from the shared vertical handle', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const leftDock = container?.querySelector('.LeftDock') as HTMLElement | null
    const resizeHandle = container?.querySelector('.LeftDockResizeHandle') as HTMLDivElement | null
    expect(leftDock).not.toBeNull()
    expect(resizeHandle).not.toBeNull()
    expect(leftDock?.style.width).toBe('320px')

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 320,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 392,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 392,
          clientY: 300,
        }),
      )
    })

    expect(leftDock?.style.width).toBe('392px')
    expect(leftDock?.style.minWidth).toBe('392px')
    expect(leftDock?.style.maxWidth).toBe('392px')
  })

  it('bumps the floating spaghetti editor with the dock during resize and releases the lock on pointer-up', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('.SpaghettiFloatingDock .SpaghettiFloatingHandle'), {
      left: 344,
      top: 40,
      width: 340,
      height: 48,
    })

    const resizeHandle = container?.querySelector('.LeftDockResizeHandle') as HTMLDivElement | null
    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(resizeHandle).not.toBeNull()
    expect(floatingTitleBar).not.toBeNull()

    currentSpaghettiState.setEditorViewportPosition.mockClear()

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 320,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 392,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 340,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 340,
          clientY: 300,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith(
      'editor-viewport-1',
      {
        x: 97,
        y: 28,
      },
    )
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith(
      'editor-viewport-1',
      {
        x: 45,
        y: 28,
      },
    )

    currentSpaghettiState.setEditorViewportPosition.mockClear()

    await act(async () => {
      floatingTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 390,
          clientY: 60,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 520,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 520,
          clientY: 120,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith(
      'editor-viewport-1',
      {
        x: 175,
        y: 88,
      },
    )
  })

  it('lets the resize handle menu reset the dock width back to default', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const leftDock = container?.querySelector('.LeftDock') as HTMLElement | null
    const resizeHandle = container?.querySelector('.LeftDockResizeHandle') as HTMLDivElement | null
    expect(leftDock).not.toBeNull()
    expect(resizeHandle).not.toBeNull()

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 320,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 392,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 392,
          clientY: 300,
        }),
      )
    })

    expect(leftDock?.style.width).toBe('392px')

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 380,
          clientY: 260,
        }),
      )
    })

    const resetButton = Array.from(container?.querySelectorAll('.LeftDockResizeMenuAction') ?? []).find(
      (element) => element.textContent?.trim() === 'Default Width',
    ) as HTMLButtonElement | undefined
    expect(resetButton).not.toBeUndefined()

    await act(async () => {
      resetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(leftDock?.style.width).toBe('320px')
  })

  it('lets the resize handle menu split the viewport from the left dock edge', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const resizeHandle = container?.querySelector('.LeftDockResizeHandle') as HTMLDivElement | null
    const viewportArea = container?.querySelector('.ViewportArea') as HTMLElement | null
    expect(resizeHandle).not.toBeNull()
    expect(viewportArea).not.toBeNull()
    expect(viewportArea?.style.marginLeft).toBe('')

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 380,
          clientY: 260,
        }),
      )
    })

    const splitButton = Array.from(container?.querySelectorAll('.LeftDockResizeMenuAction') ?? []).find(
      (element) => element.textContent?.trim() === 'Split Viewport',
    ) as HTMLButtonElement | undefined
    expect(splitButton).not.toBeUndefined()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(viewportArea?.classList.contains('isLeftDockSplit')).toBe(true)
    expect(viewportArea?.style.marginLeft).toBe('320px')
  })

  it('lets the resize-bar toggle button switch left dock viewport split on and off', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const splitToggle = Array.from(container?.querySelectorAll('button') ?? []).find(
      (element) => element.getAttribute('aria-label') === 'Toggle left dock viewport split',
    ) as HTMLButtonElement | undefined
    const viewportArea = container?.querySelector('.ViewportArea') as HTMLElement | null
    const resizeHandle = container?.querySelector('.LeftDockResizeHandle') as HTMLDivElement | null
    expect(splitToggle).not.toBeUndefined()
    expect(viewportArea?.classList.contains('isLeftDockSplit')).toBe(false)
    expect(resizeHandle?.classList.contains('isViewportSplit')).toBe(false)

    await act(async () => {
      splitToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(viewportArea?.classList.contains('isLeftDockSplit')).toBe(true)
    expect(viewportArea?.style.marginLeft).toBe('320px')
    expect(resizeHandle?.classList.contains('isViewportSplit')).toBe(false)

    await act(async () => {
      splitToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(viewportArea?.classList.contains('isLeftDockSplit')).toBe(false)
    expect(viewportArea?.style.marginLeft).toBe('')
    expect(resizeHandle?.classList.contains('isViewportSplit')).toBe(false)
  })

  it('undocks the Browser into a floating window when the docked titlebar is dragged', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const dockedTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-docked"]',
    ) as HTMLDivElement | null
    expect(dockedTitlebar).not.toBeNull()
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()

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
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(container?.textContent).toContain('Browser Panel floating expanded')
    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()
  })

  it('shows a browser dock ghost and re-docks when the floating Browser is dragged back to its slot', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const popoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Mock browser popout',
    )

    await act(async () => {
      popoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    mockShellGeometry(container)

    const floatingTitlebar = container?.querySelector(
      '[data-testid="browser-titlebar-floating"]',
    ) as HTMLDivElement | null
    expect(floatingTitlebar).not.toBeNull()

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

  it('keeps the window controls available in meatball editor view', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('meatball editor view')

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const maximizeButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) =>
        button.closest('.SpaghettiMeatballHost') !== null &&
        button.getAttribute('aria-label') === 'Maximize editor',
    )

    expect(maximizeButton).not.toBeNull()

    await act(async () => {
      maximizeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'maximized',
    )
  })

  it('drags the docked meatball editor out into the floating spaghetti editor shell', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('meatball editor view')

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const meatballTitlebar = container?.querySelector(
      '.SpaghettiMeatballHost .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(meatballTitlebar).not.toBeNull()

    await act(async () => {
      meatballTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 120,
          clientY: 520,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 520,
          clientY: 260,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 620,
          clientY: 300,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'expanded',
    )
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledTimes(2)
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenLastCalledWith(
      'editor-viewport-1',
      expect.objectContaining({ x: 196, y: 250 }),
    )

    await rerenderAppShell(root!)
    mockShellGeometry(container)

    expect(container?.querySelector('.SpaghettiMeatballHost')).toBeNull()
    expect(container?.querySelector('.SpaghettiFloatingDock')).not.toBeNull()
  })

  it('shows a meatball dock ghost and re-enters meatball editor view when the floating editor is dragged back', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('expanded')

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const floatingTitlebar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(floatingTitlebar).not.toBeNull()

    await act(async () => {
      floatingTitlebar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 420,
          clientY: 140,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 70,
          clientY: 500,
        }),
      )
    })

    expect(
      container?.querySelector('.LeftDockPanelTarget--meatball-editor')?.classList.contains('isPreviewActive'),
    ).toBe(true)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 70,
          clientY: 500,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'meatball editor view',
    )

    await rerenderAppShell(root!)
    mockShellGeometry(container)

    expect(container?.querySelector('.SpaghettiMeatballHost')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiFloatingDock')).toBeNull()
  })

  it('wires the maximize titlebar button to the viewport window-mode action', async () => {
    ;({ container, root } = await renderAppShell())

    const maximizeButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Maximize editor',
    )
    expect(maximizeButton).not.toBeNull()

    await act(async () => {
      maximizeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'maximized',
    )
  })

  it('starts with a compact titlebar tray and expands the advanced actions on demand', async () => {
    ;({ container, root } = await renderAppShell())

    const advancedActions = container?.querySelector(
      '.SpaghettiFloatingHandleAdvancedActions',
    ) as HTMLDivElement | null
    const trayToggleButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Expand titlebar actions',
    )

    expect(advancedActions?.classList.contains('isExpanded')).toBe(false)
    expect(trayToggleButton).not.toBeNull()

    await act(async () => {
      trayToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(advancedActions?.classList.contains('isExpanded')).toBe(true)
  })

  it('wires the toolbar titlebar button to expand and collapse the spaghetti header toolbar', async () => {
    ;({ container, root } = await renderAppShell())

    expect(container?.textContent).toContain('header-expanded')

    const trayToggleButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Expand titlebar actions',
    )
    expect(trayToggleButton).not.toBeNull()

    await act(async () => {
      trayToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const headerToggleButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Collapse spaghetti toolbar',
    )
    expect(headerToggleButton).not.toBeNull()

    await act(async () => {
      headerToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('header-collapsed')
  })

  it('toggles the new window settings section from the titlebar i button', async () => {
    ;({ container, root } = await renderAppShell())

    const trayToggleButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Expand titlebar actions',
    )
    expect(trayToggleButton).not.toBeNull()

    await act(async () => {
      trayToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const settingsButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Open window settings',
    )
    expect(settingsButton).not.toBeNull()
    expect(container?.textContent).toContain('window-settings-closed')

    await act(async () => {
      settingsButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('window-settings-open')
  })

  it('keeps window settings open for the same viewport across presentation mode changes', async () => {
    ;({ container, root } = await renderAppShell())

    const trayToggleButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Expand titlebar actions',
    )
    expect(trayToggleButton).not.toBeNull()

    await act(async () => {
      trayToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const settingsButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Open window settings',
    )
    expect(settingsButton).not.toBeNull()

    await act(async () => {
      settingsButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('window-settings-open')

    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')
    await rerenderAppShell(root!)

    expect(container?.textContent).toContain('window-settings-open')

    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('meatball editor view')
    await rerenderAppShell(root!)

    expect(container?.textContent).toContain('window-settings-open')
  })

  it('does not leak window settings state into a different viewport', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-2'] = {
      ...viewport('expanded'),
      editorViewportId: 'editor-viewport-2',
      graphDocumentId: 'graph-document-1',
    }

    ;({ container, root } = await renderAppShell())

    const trayToggleButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Expand titlebar actions',
    )
    expect(trayToggleButton).not.toBeNull()

    await act(async () => {
      trayToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const settingsButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Open window settings',
    )
    expect(settingsButton).not.toBeNull()

    await act(async () => {
      settingsButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.textContent).toContain('window-settings-open')

    currentSpaghettiState.activeEditorViewportId = 'editor-viewport-2'
    await rerenderAppShell(root!)

    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-2')
    expect(container?.textContent).toContain('window-settings-closed')
  })

  it('wires the canvas titlebar button to hide and show the canvas toolbar strip', async () => {
    ;({ container, root } = await renderAppShell())

    expect(container?.textContent).toContain('canvas-toolbar-visible')

    const trayToggleButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Expand titlebar actions',
    )
    expect(trayToggleButton).not.toBeNull()

    await act(async () => {
      trayToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const canvasToggleButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Hide canvas toolbar',
    )
    expect(canvasToggleButton).not.toBeNull()

    await act(async () => {
      canvasToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('canvas-toolbar-hidden')
  })
})
