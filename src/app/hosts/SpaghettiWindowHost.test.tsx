// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRef, useState } from 'react'
import { SpaghettiWindowHost } from './SpaghettiWindowHost'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let currentSpaghettiState: any
const mockRequestGraphDocumentBuild = vi.fn()
const mockOnResetSplitRatio = vi.fn()

vi.mock('../spaghetti/store/useSpaghettiStore', () => {
  const store = ((selector: (state: any) => unknown) => selector(currentSpaghettiState)) as any
  store.getState = () => currentSpaghettiState
  return {
    defaultViewportPosition: { x: 12, y: 12 },
    defaultViewportSize: { width: 980, height: 760 },
    useSpaghettiStore: store,
    selectActiveEditorViewport: (state: any) =>
      state.editorViewportsById[state.activeEditorViewportId] ?? null,
    selectEditorViewportById: (state: any, editorViewportId: string) =>
      state.editorViewportsById[editorViewportId] ?? null,
  }
})

vi.mock('../store/useAppStore', () => ({
  useAppStore: (selector: (state: any) => unknown) =>
    selector({
      requestGraphDocumentBuild: mockRequestGraphDocumentBuild,
    }),
}))

vi.mock('../panels/SpaghettiPanel', () => ({
  SpaghettiPanel: ({
    editorViewportId,
    isHeaderCollapsed,
    isCanvasToolbarVisible,
    isWindowSettingsOpen,
  }: {
    editorViewportId: string
    isHeaderCollapsed?: boolean
    isCanvasToolbarVisible?: boolean
    isWindowSettingsOpen?: boolean
  }) => (
    <div>{`Spaghetti Panel ${editorViewportId} ${
      isHeaderCollapsed === true ? 'header-collapsed' : 'header-expanded'
    } ${isCanvasToolbarVisible === false ? 'canvas-toolbar-hidden' : 'canvas-toolbar-visible'} ${
      isWindowSettingsOpen === true ? 'window-settings-open' : 'window-settings-closed'
    }`}</div>
  ),
}))

const viewport = (windowMode: string) => ({
  editorViewportId: 'editor-viewport-1',
  graphDocumentId: 'graph-document-1',
  isFocused: true,
  windowMode,
  position: { x: 24, y: 28 },
  size: { width: 800, height: 600 },
  splitRatio: 0.6,
  splitDirection: 'horizontal',
  splitPriority: 'balanced',
  restoreFromCollapsed: null,
  restoreFromSplit: null,
  zOrder: 5,
})

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

function SpaghettiWindowHostHarness() {
  const viewportRef = useRef<HTMLElement | null>(null)
  const dockedMeatballHostRef = useRef<HTMLDivElement | null>(null)
  const leftDockWidthPreviewHandlerRef = useRef<((nextWidth: number) => void) | null>(null)
  const [activePreviewPanelId, setActivePreviewPanelId] = useState<'browser' | 'meatball-editor' | null>(
    null,
  )
  const resolveLeftDockPreviewPanelId = (
    panelId: 'browser' | 'meatball-editor',
    clientX: number,
    clientY: number,
  ) => {
    if (panelId !== 'meatball-editor') {
      return null
    }
    const rect = dockedMeatballHostRef.current?.getBoundingClientRect()
    if (rect === undefined) {
      return null
    }
    return clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
      ? 'meatball-editor'
      : null
  }

  return (
    <section ref={viewportRef} className="ViewportArea">
      <div
        ref={dockedMeatballHostRef}
        className={`LeftDockPanelTarget LeftDockPanelTarget--meatball-editor ${
          activePreviewPanelId === 'meatball-editor' ? 'isPreviewActive' : ''
        }`}
      />
      <SpaghettiWindowHost
        viewportRef={viewportRef}
        dockedMeatballHostRef={dockedMeatballHostRef}
        leftDockWidth={320}
        isLeftDockViewportSplit={false}
        activeLeftDockPreviewPanelId={activePreviewPanelId}
        setActiveLeftDockPreviewPanelId={setActivePreviewPanelId}
        resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
        viewerSurface={
          <>
            <div className="ViewportViewerSurface">Viewer Host</div>
            <div>Viewport Overlay</div>
          </>
        }
        workspaceActiveSurface={null}
        onActivateSpaghettiSurface={() => {}}
        onActivateSpaghettiFloatingWindow={() => {}}
        onOpenFloatingSplitMenu={() => {}}
        onOpenDividerSplitMenu={() => {}}
        onResetSplitRatio={mockOnResetSplitRatio}
        leftDockWidthPreviewHandlerRef={leftDockWidthPreviewHandlerRef}
      />
    </section>
  )
}

describe('SpaghettiWindowHost', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  const renderHarness = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(<SpaghettiWindowHostHarness />)
    })
  }

  const rerenderHarness = async () => {
    await act(async () => {
      root?.render(<SpaghettiWindowHostHarness />)
    })
  }

  const mockGeometry = () => {
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
    mockRect(container?.querySelector('.LeftDockPanelTarget--meatball-editor'), {
      left: 16,
      top: 470,
      width: 320,
      height: 280,
    })
  }

  beforeEach(() => {
    mockRequestGraphDocumentBuild.mockClear()
    mockOnResetSplitRatio.mockClear()
    currentSpaghettiState = {
      activeEditorViewportId: 'editor-viewport-1',
      editorViewportsById: {
        'editor-viewport-1': viewport('expanded'),
      },
      editorViewportHeaderCollapsedById: {},
      editorViewportCanvasToolbarVisibleById: {},
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
      setEditorViewportHeaderCollapsed: vi.fn((editorViewportId: string, collapsed: boolean) => {
        currentSpaghettiState.editorViewportHeaderCollapsedById[editorViewportId] = collapsed
      }),
      setEditorViewportCanvasToolbarVisible: vi.fn((editorViewportId: string, visible: boolean) => {
        currentSpaghettiState.editorViewportCanvasToolbarVisibleById[editorViewportId] = visible
      }),
      setEditorViewportPresentationMode: vi.fn(
        (editorViewportId: string, mode: 'collapsed' | 'essentials' | 'expanded') => {
          const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
          if (currentViewport === undefined) {
            return
          }
          if (mode === 'collapsed') {
            currentSpaghettiState.setEditorViewportWindowMode(editorViewportId, 'collapsed')
            currentSpaghettiState.setEditorViewportHeaderCollapsed(editorViewportId, false)
            currentSpaghettiState.setEditorViewportCanvasToolbarVisible(editorViewportId, true)
            return
          }
          if (mode === 'essentials') {
            currentSpaghettiState.setEditorViewportWindowMode(editorViewportId, 'maximized')
            currentSpaghettiState.setEditorViewportHeaderCollapsed(editorViewportId, true)
            currentSpaghettiState.setEditorViewportCanvasToolbarVisible(editorViewportId, false)
            return
          }
          currentSpaghettiState.setEditorViewportWindowMode(editorViewportId, 'expanded')
          currentSpaghettiState.setEditorViewportHeaderCollapsed(editorViewportId, false)
          currentSpaghettiState.setEditorViewportCanvasToolbarVisible(editorViewportId, true)
        },
      ),
      setEditorViewportSplitRatio: vi.fn(),
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
      closeEditorViewport: vi.fn(),
    }
  })

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

  it('renders the meatball editor into the left dock host via portal', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('meatball editor view')

    await renderHarness()
    mockGeometry()
    await rerenderHarness()

    expect(container?.querySelector('.SpaghettiMeatballHost')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiMeatballHost .SpaghettiFloatingHandle')).not.toBeNull()
  })

  it('resizes split view from the divider and resets ratio on double click', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    await renderHarness()
    mockGeometry()

    const divider = container?.querySelector('.ViewportSplitDivider') as HTMLButtonElement | null

    await act(async () => {
      divider?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 700,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 700,
          clientY: 420,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }))
    })

    expect(currentSpaghettiState.setEditorViewportSplitRatio).toHaveBeenCalled()

    await act(async () => {
      divider?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }))
    })

    expect(mockOnResetSplitRatio).toHaveBeenCalledTimes(1)
  })

  it('ctrl-clicking the split titlebar detaches back to the floating editor', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    await renderHarness()

    const splitTitleBar = container?.querySelector('.SpaghettiSplitWindow .SpaghettiFloatingHandle')

    await act(async () => {
      splitTitleBar?.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }))
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'expanded',
    )
  })

  it('shows a bottom split ghost and re-enters split view when the floating editor is dropped at the bottom edge', async () => {
    await renderHarness()
    mockGeometry()
    mockRect(container?.querySelector('.SpaghettiFloatingDock .SpaghettiFloatingHandle'), {
      left: 420,
      top: 40,
      width: 340,
      height: 48,
    })

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null

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

  it('persists titlebar window settings, tray, header, and canvas state for the active viewport', async () => {
    await renderHarness()

    const trayToggle = container?.querySelector(
      'button[aria-label="Expand titlebar actions"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      trayToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const settingsButton = container?.querySelector(
      'button[aria-label="Open window settings"]',
    ) as HTMLButtonElement | null
    const headerButton = container?.querySelector(
      'button[aria-label="Collapse spaghetti toolbar"]',
    ) as HTMLButtonElement | null
    const canvasButton = container?.querySelector(
      'button[aria-label="Hide canvas toolbar"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      settingsButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      headerButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      canvasButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await rerenderHarness()

    expect(container?.textContent).toContain('window-settings-open')
    expect(container?.textContent).toContain('header-collapsed')
    expect(container?.textContent).toContain('canvas-toolbar-hidden')
    expect(container?.querySelector('.SpaghettiFloatingHandle--essentials')).toBeNull()
    expect(
      container?.querySelector('.SpaghettiFloatingHandleAdvancedActions')?.classList.contains('isExpanded'),
    ).toBe(true)
  })

  it('renders essentials as a maximized minimal overlay chip after the primary mode cycle', async () => {
    await renderHarness()

    const modeButton = container?.querySelector(
      '.SpaghettiFloatingHandle .SpaghettiWindowAction--collapse',
    ) as HTMLButtonElement | null

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    await rerenderHarness()

    const floatingWindow = container?.querySelector('.SpaghettiFloatingWindow') as HTMLElement | null
    const essentialsChip = container?.querySelector(
      '.SpaghettiFloatingHandle--essentials .SpaghettiWindowAction--collapse',
    ) as HTMLButtonElement | null

    expect(currentSpaghettiState.setEditorViewportPresentationMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'essentials',
    )
    expect(floatingWindow?.className).toContain('isMaximized')
    expect(floatingWindow?.className).toContain('isEssentials')
    expect(essentialsChip?.textContent).toBe('e')
    expect(container?.querySelector('button[aria-label="Close editor"]')).toBeNull()
    expect(container?.textContent).not.toContain('Spaghetti Editor')
  })
})
