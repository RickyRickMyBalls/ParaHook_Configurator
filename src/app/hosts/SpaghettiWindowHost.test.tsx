// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StrictMode, useRef, useState } from 'react'
const workspaceChildWindowMockState = vi.hoisted(() => ({
  forceNullHost: false,
  forcedChildWindow: null as Window | null,
}))
const spaghettiPanelMockState = vi.hoisted(() => ({
  throwOnRender: false,
}))

vi.mock('../workspace/useWorkspaceChildWindow', async () => {
  const actual =
    await vi.importActual<typeof import('../workspace/useWorkspaceChildWindow')>(
      '../workspace/useWorkspaceChildWindow',
    )
  return {
    ...actual,
    useWorkspaceChildWindow: (options: Parameters<typeof actual.useWorkspaceChildWindow>[0]) => {
      if (workspaceChildWindowMockState.forceNullHost) {
        return {
          childWindow: workspaceChildWindowMockState.forcedChildWindow,
          host: null,
        }
      }
      return actual.useWorkspaceChildWindow(options)
    },
  }
})

import { SpaghettiWindowHost } from './SpaghettiWindowHost'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import { createDefaultEditorWorkspaceSurfaceState } from '../workspace/workspaceShellTypes'

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
    selectOrderedEditorViewports: (state: any) =>
      (state.editorViewportOrder ?? [])
        .map((editorViewportId: string) => state.editorViewportsById[editorViewportId] ?? null)
        .filter(Boolean),
    selectEditorViewportById: (state: any, editorViewportId: string) =>
      state.editorViewportsById[editorViewportId] ?? null,
  }
})

vi.mock('../store/useAppStore', () => ({
  useAppStore: (selector: (state: any) => unknown) =>
    selector({
      requestGraphDocumentBuild: mockRequestGraphDocumentBuild,
      requestBrowserGraphDocumentBuild: mockRequestGraphDocumentBuild,
    }),
}))

vi.mock('../panels/BrowserPanel', () => ({
  BrowserPanel: ({
    showTitleBar,
  }: {
    showTitleBar?: boolean
  }) => (
    <div
      className={`BrowserPanelRoot ${showTitleBar === false ? 'BrowserPanelRoot--headerless' : ''}`}
    >
      Mock Browser Panel
    </div>
  ),
}))

vi.mock('../panels/SpaghettiPanel', () => ({
  SpaghettiPanel: ({
    editorViewportId,
    onActivateEditorContext,
    activateOnPointerDownCapture,
    isHeaderCollapsed,
    isCanvasToolbarVisible,
    isWindowSettingsOpen,
  }: {
    editorViewportId: string
    onActivateEditorContext?: (
      editorViewportId: string,
      target?: {
        graphDocumentId?: string | null
        nodeId?: string | null
        mode?: 'graph' | 'node'
      },
    ) => void
    activateOnPointerDownCapture?: boolean
    isHeaderCollapsed?: boolean
    isCanvasToolbarVisible?: boolean
    isWindowSettingsOpen?: boolean
  }) => {
    if (spaghettiPanelMockState.throwOnRender) {
      throw new Error('Forced popup subtree error')
    }
    return (
      <div
        className="MockSpaghettiPanel"
        data-editor-viewport-id={editorViewportId}
        onPointerDownCapture={
          activateOnPointerDownCapture
            ? () => {
                onActivateEditorContext?.(editorViewportId)
              }
            : undefined
        }
      >{`Spaghetti Panel ${editorViewportId} ${
        isHeaderCollapsed === true ? 'header-collapsed' : 'header-expanded'
      } ${isCanvasToolbarVisible === false ? 'canvas-toolbar-hidden' : 'canvas-toolbar-visible'} ${
        isWindowSettingsOpen === true ? 'window-settings-open' : 'window-settings-closed'
      }`}</div>
    )
  },
}))

vi.mock('../workspace/ViewportWorkspaceHost', () => ({
  ViewportWorkspaceHost: ({
    viewportId,
    onActivateViewerSurface,
  }: {
    viewportId: string
    onActivateViewerSurface?: (viewportId: string) => void
  }) => (
    <div
      className="ViewportWorkspaceHost"
      data-workspace-viewport-id={viewportId}
      onPointerDownCapture={() => onActivateViewerSurface?.(viewportId)}
    >{`Viewer Host ${viewportId}`}</div>
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
  splitDockSide: 'bottom',
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
  const appShellRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLElement | null>(null)
  const leftDockHostRef = useRef<HTMLDivElement | null>(null)
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
    const statusRect = leftDockHostRef.current
      ?.querySelector('.PrimaryViewportLeftDockStatus')
      ?.getBoundingClientRect()
    if (rect === undefined) {
      return null
    }
    const isInsideDockTarget =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    const isInsideStatusTarget =
      statusRect !== undefined &&
      clientX >= statusRect.left &&
      clientX <= statusRect.right &&
      clientY >= statusRect.top &&
      clientY <= statusRect.bottom
    return isInsideDockTarget || isInsideStatusTarget
      ? 'meatball-editor'
      : null
  }

  return (
    <div ref={appShellRef} className="AppShellRoot">
      <section ref={viewportRef} className="ViewportArea">
        <div ref={leftDockHostRef} className="PrimaryViewportLeftDock">
          <div className="PrimaryViewportLeftDockStatus">Title Status</div>
          <div
            ref={dockedMeatballHostRef}
            className={`PrimaryViewportLeftDockPanelTarget PrimaryViewportLeftDockPanelTarget--meatball-editor ${
              activePreviewPanelId === 'meatball-editor' ? 'isPreviewActive' : ''
            }`}
          />
        </div>
        <SpaghettiWindowHost
          appShellRef={appShellRef}
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
          slotHeaderDragSeed={null}
          onConsumeSlotHeaderDragSeed={() => {}}
          onActivateSpaghettiSurface={() => {}}
          onActivateSpaghettiFloatingWindow={() => {}}
          onOpenFloatingSplitMenu={() => {}}
          onActivateViewerSurface={() => {}}
          leftDockWidthPreviewHandlerRef={leftDockWidthPreviewHandlerRef}
        />
      </section>
    </div>
  )
}

describe('SpaghettiWindowHost', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalWindowOpen = window.open

  const renderHarness = async (options?: { strict?: boolean }) => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(
        options?.strict ? (
          <StrictMode>
            <SpaghettiWindowHostHarness />
          </StrictMode>
        ) : (
          <SpaghettiWindowHostHarness />
        ),
      )
    })
  }

  const rerenderHarness = async (options?: { strict?: boolean }) => {
    await act(async () => {
      root?.render(
        options?.strict ? (
          <StrictMode>
            <SpaghettiWindowHostHarness />
          </StrictMode>
        ) : (
          <SpaghettiWindowHostHarness />
        ),
      )
    })
  }

  const mockGeometry = () => {
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
    mockRect(container?.querySelector('.PrimaryViewportLeftDockPanelTarget--meatball-editor'), {
      left: 16,
      top: 470,
      width: 320,
      height: 280,
    })
    mockRect(container?.querySelector('.PrimaryViewportLeftDockStatus'), {
      left: 16,
      top: 16,
      width: 320,
      height: 56,
    })
  }

  beforeEach(() => {
    workspaceChildWindowMockState.forceNullHost = false
    workspaceChildWindowMockState.forcedChildWindow = null
    spaghettiPanelMockState.throwOnRender = false
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    mockRequestGraphDocumentBuild.mockClear()
    mockOnResetSplitRatio.mockClear()
    window.open = originalWindowOpen
    currentSpaghettiState = {
      activeEditorViewportId: 'editor-viewport-1',
      editorViewportOrder: ['editor-viewport-1'],
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
        if (windowMode === 'separateWindow' && currentViewport.windowMode === 'separateWindow') {
          currentSpaghettiState = {
            ...currentSpaghettiState,
            editorViewportsById: {
              ...currentSpaghettiState.editorViewportsById,
              [editorViewportId]: {
                ...currentViewport,
                windowMode: 'expanded',
              },
            },
          }
          return
        }
        currentSpaghettiState = {
          ...currentSpaghettiState,
          editorViewportsById: {
            ...currentSpaghettiState.editorViewportsById,
            [editorViewportId]: {
              ...currentViewport,
              windowMode,
            },
          },
        }
      }),
      restoreEditorViewportFromSeparateWindow: vi.fn((editorViewportId: string) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined || currentViewport.windowMode !== 'separateWindow') {
          return
        }
        currentSpaghettiState = {
          ...currentSpaghettiState,
          editorViewportsById: {
            ...currentSpaghettiState.editorViewportsById,
            [editorViewportId]: {
              ...currentViewport,
              windowMode: 'expanded',
            },
          },
        }
      }),
      setEditorViewportHeaderCollapsed: vi.fn((editorViewportId: string, collapsed: boolean) => {
        currentSpaghettiState = {
          ...currentSpaghettiState,
          editorViewportHeaderCollapsedById: {
            ...currentSpaghettiState.editorViewportHeaderCollapsedById,
            [editorViewportId]: collapsed,
          },
        }
      }),
      setEditorViewportCanvasToolbarVisible: vi.fn((editorViewportId: string, visible: boolean) => {
        currentSpaghettiState = {
          ...currentSpaghettiState,
          editorViewportCanvasToolbarVisibleById: {
            ...currentSpaghettiState.editorViewportCanvasToolbarVisibleById,
            [editorViewportId]: visible,
          },
        }
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
      setEditorViewportSplitDockSide: vi.fn((editorViewportId: string, splitDockSide: string) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState = {
          ...currentSpaghettiState,
          editorViewportsById: {
            ...currentSpaghettiState.editorViewportsById,
            [editorViewportId]: {
              ...currentViewport,
              splitDockSide,
              splitDirection:
                splitDockSide === 'left' || splitDockSide === 'right' ? 'vertical' : 'horizontal',
            },
          },
        }
      }),
      setEditorViewportPosition: vi.fn((editorViewportId: string, position: { x: number; y: number }) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState = {
          ...currentSpaghettiState,
          editorViewportsById: {
            ...currentSpaghettiState.editorViewportsById,
            [editorViewportId]: {
              ...currentViewport,
              position,
            },
          },
        }
      }),
      setEditorViewportSize: vi.fn((editorViewportId: string, size: { width: number; height: number }) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState = {
          ...currentSpaghettiState,
          editorViewportsById: {
            ...currentSpaghettiState.editorViewportsById,
            [editorViewportId]: {
              ...currentViewport,
              size,
            },
          },
        }
      }),
      openGraphDocumentInNewViewport: vi.fn((graphDocumentId: string) => {
        const nextOrdinal =
          Object.keys(currentSpaghettiState.editorViewportsById).length + 1
        const editorViewportId = `editor-viewport-${nextOrdinal}`
        useWorkspaceStore
          .getState()
          .setEditorSurfaceBinding(editorViewportId, graphDocumentId)
        currentSpaghettiState = {
          ...currentSpaghettiState,
          activeEditorViewportId: editorViewportId,
          editorViewportOrder: [...currentSpaghettiState.editorViewportOrder, editorViewportId],
          editorViewportsById: {
            ...currentSpaghettiState.editorViewportsById,
            [editorViewportId]: {
              ...viewport('expanded'),
              editorViewportId,
              graphDocumentId,
              zOrder: nextOrdinal + 4,
            },
          },
        }
        return editorViewportId
      }),
      closeEditorViewport: vi.fn((editorViewportId: string) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        const nextEditorViewportsById = { ...currentSpaghettiState.editorViewportsById }
        delete nextEditorViewportsById[editorViewportId]
        currentSpaghettiState = {
          ...currentSpaghettiState,
          editorViewportsById: nextEditorViewportsById,
          editorViewportOrder: currentSpaghettiState.editorViewportOrder.filter(
            (currentViewportId: string) => currentViewportId !== editorViewportId,
          ),
          activeEditorViewportId:
            currentSpaghettiState.activeEditorViewportId === editorViewportId
              ? currentSpaghettiState.editorViewportOrder.find(
                  (currentViewportId: string) => currentViewportId !== editorViewportId,
                ) ?? ''
              : currentSpaghettiState.activeEditorViewportId,
        }
        const workspaceState = useWorkspaceStore.getState()
        workspaceState.clearDetachedSlotSurface(editorViewportId)
        workspaceState.removeEditorSurfacePlacement(editorViewportId)
        workspaceState.removeEditorSurfaceBinding(editorViewportId)
      }),
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
    window.open = originalWindowOpen
    workspaceChildWindowMockState.forceNullHost = false
    workspaceChildWindowMockState.forcedChildWindow = null
    spaghettiPanelMockState.throwOnRender = false
  })

  it('renders the meatball editor into the left dock host via portal', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('meatball editor view')

    await renderHarness()
    mockGeometry()
    await rerenderHarness()

    expect(container?.querySelector('.SpaghettiMeatballHost')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiMeatballHost .SpaghettiFloatingHandle')).not.toBeNull()
  })

  it('does not render the old bespoke split divider when split view state is present', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    await renderHarness()
    mockGeometry()

    expect(container?.querySelector('.SpaghettiSplitWindow')).toBeNull()
    expect(container?.querySelector('.ViewportSplitDivider')).toBeNull()
  })

  it('treats split view as compatibility-only and does not revive the old split titlebar', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    await renderHarness()

    expect(container?.querySelector('.SpaghettiSplitWindow .SpaghettiFloatingHandle')).toBeNull()
  })

  it('keeps the viewer surface mounted while legacy split view state is being phased out', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    await renderHarness()

    expect(container?.textContent).toContain('Viewer Host')
    expect(container?.querySelector('.SpaghettiSplitWindow')).toBeNull()
  })

  it('shows a bottom split ghost and docks the floating editor into the workspace slot tree on release', async () => {
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

    expect(container?.querySelector('.ViewportSplitDockGhost.isDockBottom')).not.toBeNull()

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
      'expanded',
    )
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === 'editor-viewport-1',
      ),
    ).toBe(true)
    expect(currentSpaghettiState.setEditorViewportSplitDockSide).toHaveBeenCalledWith(
      'editor-viewport-1',
      'bottom',
    )
  })

  it('uses cursor position inside the viewport to show a top split ghost even when the floating editor frame is not flush to the top edge', async () => {
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
          clientX: 760,
          clientY: 8,
        }),
      )
    })

    expect(container?.querySelector('.ViewportSplitDockGhost.isDockTop')).not.toBeNull()
  })

  it('treats the left dock status bar as a meatball dock target for the floating editor', async () => {
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
          clientX: 120,
          clientY: 40,
        }),
      )
    })

    expect(
      container
        ?.querySelector('.PrimaryViewportLeftDockPanelTarget--meatball-editor')
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

    expect(currentSpaghettiState.setEditorViewportHeaderCollapsed).toHaveBeenCalledWith(
      'editor-viewport-1',
      true,
    )
    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'meatball editor view',
    )
  })

  it('uses right-edge drag to create a right-side workspace split for the editor', async () => {
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
          clientX: 1432,
          clientY: 360,
        }),
      )
    })

    const rightGhost = container?.querySelector('.ViewportSplitDockGhost.isDockRight') as
      | HTMLDivElement
      | null
    expect(rightGhost).not.toBeNull()
    expect(rightGhost?.dataset.splitPreviewScope).toBe('global')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 1432,
          clientY: 360,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportSplitDockSide).toHaveBeenCalledWith(
      'editor-viewport-1',
      'right',
    )
    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'expanded',
    )
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === 'editor-viewport-1',
      ),
    ).toBe(true)
  })

  it('uses the inner right-edge band to show a local split preview for the floating editor', async () => {
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
          clientX: 1420,
          clientY: 360,
        }),
      )
    })

    const rightGhost = container?.querySelector('.ViewportSplitDockGhost.isDockRight') as
      | HTMLDivElement
      | null
    expect(rightGhost).not.toBeNull()
    expect(rightGhost?.dataset.splitPreviewScope).toBe('local')
  })

  it('redocks a detached slotted editor back into the workspace slot tree when it hits a viewport edge', async () => {
    const detachedSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'spaghettiEditor',
      surfaceInstanceId: 'editor-viewport-1',
    })
    expect(detachedSlotId).toBeTruthy()
    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'floating')

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
          clientX: 1432,
          clientY: 360,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 1432,
          clientY: 360,
        }),
      )
    })

    const spaghettiSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'spaghettiEditor',
    )
    expect(spaghettiSlots).toHaveLength(1)
    expect(spaghettiSlots[0]?.surfaceInstanceId).toBe('editor-viewport-1')
    expect(
      useWorkspaceStore.getState().detachedSlotSurfaceById['editor-viewport-1'],
    ).toBeUndefined()
    expect(currentSpaghettiState.setEditorViewportWindowMode).not.toHaveBeenCalledWith(
      'editor-viewport-1',
      'split view',
    )
  })

  it('closes the editor when the child-window popout closes', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popout')
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

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    expect(window.open).toHaveBeenCalled()
    expect(popoutWindow.focus).not.toHaveBeenCalled()
    expect(container?.querySelector('.SpaghettiFloatingWindow')).toBeNull()
    expect(popoutDocument.body.querySelector('.SpaghettiPopoutContent')).not.toBeNull()
    expect(popoutDocument.body.textContent).toContain('Spaghetti Panel editor-viewport-1')

    await act(async () => {
      beforeUnloadHandler?.()
    })
    await rerenderHarness({ strict: true })

    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-1')
    expect(currentSpaghettiState.editorViewportsById['editor-viewport-1']).toBeUndefined()
    expect(container?.querySelector('.SpaghettiFloatingWindow')).toBeNull()
  })

  it('does not mount popup content when the child window exists but the host is missing', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popout Missing Host')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window
    workspaceChildWindowMockState.forceNullHost = true
    workspaceChildWindowMockState.forcedChildWindow = popoutWindow

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    expect(popoutDocument.body.querySelector('.SpaghettiPopoutContent')).toBeNull()
    expect(popoutDocument.body.querySelector('.SpaghettiPopoutDiagnostics')).toBeNull()
  })

  it('opens a visible child-window popout through the shared hook when the popout button is clicked', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popout Direct')
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
      'button[aria-label="Pop editor out into browser window"]',
    ) as HTMLButtonElement | null
    expect(popoutButton).not.toBeNull()

    await act(async () => {
      popoutButton?.click()
    })
    await rerenderHarness({ strict: true })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'separateWindow',
    )
    expect(window.open).toHaveBeenCalledTimes(1)
    expect(popoutDocument.body.querySelector('.SpaghettiPopoutContent')).not.toBeNull()
    expect(popoutDocument.body.querySelector('.SpaghettiPopoutDiagnostics')).toBeNull()
    expect(popoutDocument.body.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(beforeUnloadHandler).not.toBeNull()
  })

  it('splits a popped-out spaghetti editor into a popup-local two-viewport shell and allows model viewport switching', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popup Workspace')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    const titleBar = popoutDocument.body.querySelector('.SpaghettiFloatingHandle') as HTMLDivElement | null
    expect(titleBar).not.toBeNull()

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 80,
        }),
      )
    })

    const splitRightButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameActionMenuAction'),
    ).find((action) => action.textContent?.includes('Split Right')) as HTMLButtonElement | undefined
    expect(splitRightButton).toBeDefined()

    await act(async () => {
      splitRightButton?.click()
    })
    await rerenderHarness({ strict: true })

    expect(popoutDocument.body.querySelector('.PopupWorkspaceShell')).not.toBeNull()
    expect(popoutDocument.body.querySelectorAll('.ViewportFrame')).toHaveLength(2)
    expect(popoutDocument.body.querySelectorAll('.MockSpaghettiPanel')).toHaveLength(2)
    expect(popoutDocument.body.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(popoutDocument.body.textContent).toContain('Spaghetti Panel editor-viewport-2')
    expect(container?.textContent).not.toContain('Spaghetti Panel editor-viewport-2')

    const secondModeButton = popoutDocument.body.querySelectorAll(
      '.ViewportFrameModeButton',
    )[1] as HTMLButtonElement | undefined
    expect(secondModeButton).toBeDefined()

    await act(async () => {
      secondModeButton?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 260,
          clientY: 140,
        }),
      )
    })

    const modelViewportButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameTypePickerAction'),
    ).find((action) => action.textContent?.includes('Model Viewport')) as HTMLButtonElement | undefined
    expect(modelViewportButton).toBeDefined()

    await act(async () => {
      modelViewportButton?.click()
    })
    await rerenderHarness({ strict: true })

    expect(popoutDocument.body.textContent).toContain('Viewer Host')
    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-2')
  })

  it('allows switching a popup-local slot to console without mutating the main host tree', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popup Workspace')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    const titleBar = popoutDocument.body.querySelector('.SpaghettiFloatingHandle') as HTMLDivElement | null
    expect(titleBar).not.toBeNull()

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 80,
        }),
      )
    })

    const splitRightButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameActionMenuAction'),
    ).find((action) => action.textContent?.includes('Split Right')) as HTMLButtonElement | undefined
    expect(splitRightButton).toBeDefined()

    await act(async () => {
      splitRightButton?.click()
    })
    await rerenderHarness({ strict: true })

    const secondModeButton = popoutDocument.body.querySelectorAll(
      '.ViewportFrameModeButton',
    )[1] as HTMLButtonElement | undefined
    expect(secondModeButton).toBeDefined()

    await act(async () => {
      secondModeButton?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 260,
          clientY: 140,
        }),
      )
    })

    const consoleButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameTypePickerAction'),
    ).find((action) => action.textContent?.includes('Console')) as HTMLButtonElement | undefined
    expect(consoleButton).toBeDefined()

    await act(async () => {
      consoleButton?.click()
    })
    await rerenderHarness({ strict: true })

    expect(popoutDocument.body.querySelector('.ConsolePanel')).not.toBeNull()
    expect(popoutDocument.body.querySelector('.ConsoleBar')).not.toBeNull()
    expect(container?.querySelector('.ConsolePanel')).toBeNull()
    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-2')
  })

  it('returns a popup-local split back to the original single-surface popout after closing the sibling slot', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popup Workspace')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    const rootTitleBar = popoutDocument.body.querySelector('.SpaghettiFloatingHandle') as HTMLDivElement | null
    expect(rootTitleBar).not.toBeNull()

    await act(async () => {
      rootTitleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 80,
        }),
      )
    })

    const splitRightButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameActionMenuAction'),
    ).find((action) => action.textContent?.includes('Split Right')) as HTMLButtonElement | undefined
    expect(splitRightButton).toBeDefined()

    await act(async () => {
      splitRightButton?.click()
    })
    await rerenderHarness({ strict: true })

    const splitHeaders = popoutDocument.body.querySelectorAll('.ViewportFrameHeader')
    const siblingHeader = splitHeaders[1] as HTMLDivElement | undefined
    expect(siblingHeader).toBeDefined()

    await act(async () => {
      siblingHeader?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 260,
          clientY: 140,
        }),
      )
    })

    const closeButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameActionMenuAction'),
    ).find((action) => action.textContent?.trim() === 'Close') as HTMLButtonElement | undefined
    expect(closeButton).toBeDefined()

    await act(async () => {
      closeButton?.click()
    })
    await rerenderHarness({ strict: true })

    expect(popoutDocument.body.querySelectorAll('.ViewportFrame')).toHaveLength(0)
    expect(popoutDocument.body.querySelector('.PopupWorkspaceShell')).toBeNull()
    expect(popoutDocument.body.querySelector('.SpaghettiFloatingHandle')).not.toBeNull()
    expect(popoutDocument.body.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(popoutDocument.body.textContent).not.toContain('Spaghetti Panel editor-viewport-2')
    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-2')
  })

  it('allows switching a popup-local slot to browser without mutating the main host tree', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popup Workspace')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    const titleBar = popoutDocument.body.querySelector('.SpaghettiFloatingHandle') as HTMLDivElement | null
    expect(titleBar).not.toBeNull()

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 80,
        }),
      )
    })

    const splitRightButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameActionMenuAction'),
    ).find((action) => action.textContent?.includes('Split Right')) as HTMLButtonElement | undefined
    expect(splitRightButton).toBeDefined()

    await act(async () => {
      splitRightButton?.click()
    })
    await rerenderHarness({ strict: true })

    const secondModeButton = popoutDocument.body.querySelectorAll(
      '.ViewportFrameModeButton',
    )[1] as HTMLButtonElement | undefined
    expect(secondModeButton).toBeDefined()

    await act(async () => {
      secondModeButton?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 260,
          clientY: 140,
        }),
      )
    })

    const browserButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameTypePickerAction'),
    ).find((action) => action.textContent?.includes('Browser')) as HTMLButtonElement | undefined
    expect(browserButton).toBeDefined()

    await act(async () => {
      browserButton?.click()
    })
    await rerenderHarness({ strict: true })

    expect(popoutDocument.body.querySelector('.BrowserPanelRoot')).not.toBeNull()
    expect(container?.querySelector('.BrowserPanelRoot')).toBeNull()
    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-2')
  })

  it('allows resizing popup-local vertical splits inside the child window', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popup Workspace')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    const titleBar = popoutDocument.body.querySelector('.SpaghettiFloatingHandle') as HTMLDivElement | null
    expect(titleBar).not.toBeNull()

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 80,
        }),
      )
    })

    const splitRightButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameActionMenuAction'),
    ).find((action) => action.textContent?.includes('Split Right')) as HTMLButtonElement | undefined
    expect(splitRightButton).toBeDefined()

    await act(async () => {
      splitRightButton?.click()
    })
    await rerenderHarness({ strict: true })

    const splitLayout = popoutDocument.body.querySelector('.ViewportSplitLayout') as HTMLDivElement | null
    const divider = popoutDocument.body.querySelector('.ViewportSplitDividerShell') as HTMLDivElement | null
    expect(splitLayout).not.toBeNull()
    expect(divider).not.toBeNull()
    mockRect(splitLayout, { left: 0, top: 0, width: 1000, height: 800 })
    expect(splitLayout?.style.gridTemplateColumns).toContain('0.5fr')

    await act(async () => {
      divider?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          button: 0,
          clientX: 500,
          clientY: 200,
        }),
      )
      popoutDocument.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 250,
          clientY: 200,
        }),
      )
      popoutDocument.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 250,
          clientY: 200,
        }),
      )
    })

    expect(splitLayout?.style.gridTemplateColumns).toContain('0.75fr')
  })

  it('allows resizing popup-local horizontal splits inside the child window', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popup Workspace')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    const titleBar = popoutDocument.body.querySelector('.SpaghettiFloatingHandle') as HTMLDivElement | null
    expect(titleBar).not.toBeNull()

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 80,
        }),
      )
    })

    const splitBottomButton = Array.from(
      popoutDocument.body.querySelectorAll('.ViewportFrameActionMenuAction'),
    ).find((action) => action.textContent?.includes('Split Bottom')) as HTMLButtonElement | undefined
    expect(splitBottomButton).toBeDefined()

    await act(async () => {
      splitBottomButton?.click()
    })
    await rerenderHarness({ strict: true })

    const splitLayout = popoutDocument.body.querySelector('.ViewportSplitLayout') as HTMLDivElement | null
    const divider = popoutDocument.body.querySelector('.ViewportSplitDividerShell') as HTMLDivElement | null
    expect(splitLayout).not.toBeNull()
    expect(divider).not.toBeNull()
    mockRect(splitLayout, { left: 0, top: 0, width: 900, height: 800 })
    expect(splitLayout?.style.gridTemplateRows).toContain('0.5fr')

    await act(async () => {
      divider?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          button: 0,
          clientX: 200,
          clientY: 400,
        }),
      )
      popoutDocument.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          clientX: 200,
          clientY: 200,
        }),
      )
      popoutDocument.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          clientX: 200,
          clientY: 200,
        }),
      )
    })

    expect(splitLayout?.style.gridTemplateRows).toContain('0.75fr')
  })

  it('relays non-editable console keys from the popout window back to the main window', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popout Enter Relay')
    let keyDownHandler: ((event: KeyboardEvent) => void) | null = null
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn((type: string, handler: EventListenerOrEventListenerObject) => {
        if (type === 'keydown' && typeof handler === 'function') {
          keyDownHandler = handler as (event: KeyboardEvent) => void
        }
      }),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    const surface = popoutDocument.body.querySelector('.SpaghettiPopoutSurface') as HTMLElement | null
    expect(surface).not.toBeNull()
    expect(keyDownHandler).not.toBeNull()

    await act(async () => {
      keyDownHandler?.(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(dispatchSpy).toHaveBeenCalled()
    const relayedEvent = dispatchSpy.mock.calls.at(-1)?.[0] as KeyboardEvent | undefined
    expect(relayedEvent?.key).toBe('Enter')

    await act(async () => {
      keyDownHandler?.(
        new KeyboardEvent('keydown', {
          key: 'ArrowUp',
          bubbles: true,
          cancelable: true,
        }),
      )
      keyDownHandler?.(
        new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
          cancelable: true,
        }),
      )
      keyDownHandler?.(
        new KeyboardEvent('keydown', {
          key: 'S',
          bubbles: true,
          cancelable: true,
        }),
      )
      keyDownHandler?.(
        new KeyboardEvent('keydown', {
          key: 'D',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    const relayedKeys = dispatchSpy.mock.calls.map((call) => (call[0] as KeyboardEvent).key)
    expect(relayedKeys).toContain('ArrowUp')
    expect(relayedKeys).toContain('ArrowDown')
    expect(relayedKeys).toContain('S')
    expect(relayedKeys).toContain('D')
  })

  it('renders the popup crash fallback when the popup subtree crashes', async () => {
    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Spaghetti Popout Crash')
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
    spaghettiPanelMockState.throwOnRender = true

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    expect(popoutDocument.body.querySelector('.SpaghettiPopoutDiagnostics')).toBeNull()
    expect(popoutDocument.body.textContent).toContain(
      'Detached Spaghetti popup crashed: Forced popup subtree error',
    )
    expect(beforeUnloadHandler).not.toBeNull()
  })

  it('closes a detached slotted editor instead of redocking it when the popout window closes', async () => {
    const detachedSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'spaghettiEditor',
      surfaceInstanceId: 'editor-viewport-1',
    })
    expect(detachedSlotId).toBeTruthy()
    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'popout')

    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Detached Slot Popout')
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

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    await act(async () => {
      beforeUnloadHandler?.()
    })
    await rerenderHarness({ strict: true })

    const spaghettiSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'spaghettiEditor',
    )
    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-1')
    expect(currentSpaghettiState.editorViewportsById['editor-viewport-1']).toBeUndefined()
    expect(spaghettiSlots).toHaveLength(0)
    expect(
      useWorkspaceStore.getState().detachedSlotSurfaceById['editor-viewport-1'],
    ).toBeUndefined()
  })

  it('redocks a detached slotted editor only when the popout dock action is clicked', async () => {
    const detachedSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'spaghettiEditor',
      surfaceInstanceId: 'editor-viewport-1',
    })
    expect(detachedSlotId).toBeTruthy()
    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'popout')

    await renderHarness({ strict: true })

    const popoutDocument = document.implementation.createHTMLDocument('Detached Slot Popout Dock')
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
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window

    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      currentSpaghettiState.setEditorViewportWindowMode('editor-viewport-1', 'separateWindow')
    })
    await rerenderHarness({ strict: true })

    const dockButton = popoutDocument.body.querySelector(
      'button[aria-label="Dock editor back into workspace"]',
    ) as HTMLButtonElement | null
    expect(dockButton).not.toBeNull()

    await act(async () => {
      dockButton?.click()
    })
    await rerenderHarness({ strict: true })

    const spaghettiSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'spaghettiEditor',
    )
    expect(currentSpaghettiState.closeEditorViewport).not.toHaveBeenCalledWith('editor-viewport-1')
    expect(spaghettiSlots).toHaveLength(1)
    expect(spaghettiSlots[0]?.surfaceInstanceId).toBe('editor-viewport-1')
    expect(currentSpaghettiState.editorViewportsById['editor-viewport-1']?.windowMode).toBe('expanded')
    expect(
      useWorkspaceStore.getState().detachedSlotSurfaceById['editor-viewport-1'],
    ).toBeUndefined()
  })

  it('keeps a popped-out editor surface alive when another viewport is active in-app', async () => {
    currentSpaghettiState.activeEditorViewportId = 'editor-viewport-2'
    currentSpaghettiState.editorViewportOrder = ['editor-viewport-1', 'editor-viewport-2']
    currentSpaghettiState.editorViewportsById = {
      'editor-viewport-1': {
        ...viewport('separateWindow'),
        editorViewportId: 'editor-viewport-1',
        graphDocumentId: 'graph-document-1',
      },
      'editor-viewport-2': {
        ...viewport('expanded'),
        editorViewportId: 'editor-viewport-2',
        graphDocumentId: 'graph-document-2',
        position: { x: 80, y: 72 },
      },
    }

    const popoutDocument = document.implementation.createHTMLDocument('Detached Editor')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await renderHarness()
    mockGeometry()
    await rerenderHarness()

    expect(window.open).toHaveBeenCalledTimes(1)
    expect(popoutDocument.body.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.querySelector('.SpaghettiFloatingWindow')).not.toBeNull()
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-2')
  })

  it('keeps two floating editor windows on different graphs pinned to their own geometry when active focus changes', async () => {
    currentSpaghettiState.activeEditorViewportId = 'editor-viewport-2'
    currentSpaghettiState.editorViewportOrder = ['editor-viewport-1', 'editor-viewport-2']
    currentSpaghettiState.editorViewportsById = {
      'editor-viewport-1': {
        ...viewport('expanded'),
        editorViewportId: 'editor-viewport-1',
        graphDocumentId: 'graph-document-1',
        position: { x: 24, y: 28 },
        size: { width: 800, height: 600 },
        zOrder: 4,
      },
      'editor-viewport-2': {
        ...viewport('expanded'),
        editorViewportId: 'editor-viewport-2',
        graphDocumentId: 'graph-document-2',
        position: { x: 196, y: 112 },
        size: { width: 620, height: 420 },
        zOrder: 7,
      },
    }

    await renderHarness()
    mockGeometry()
    await rerenderHarness()

    let floatingWindows = Array.from(
      container?.querySelectorAll('.SpaghettiFloatingWindow') ?? [],
    ) as HTMLDivElement[]
    expect(floatingWindows).toHaveLength(2)
    expect(floatingWindows[0]?.textContent).toContain('editor-viewport-1')
    expect(floatingWindows[1]?.textContent).toContain('editor-viewport-2')
    expect(floatingWindows[0]?.style.left).toBe('344px')
    expect(floatingWindows[0]?.style.top).toBe('28px')
    expect(floatingWindows[0]?.style.width).toBe('800px')
    expect(floatingWindows[0]?.style.height).toBe('600px')
    expect(floatingWindows[1]?.style.left).toBe('516px')
    expect(floatingWindows[1]?.style.top).toBe('112px')
    expect(floatingWindows[1]?.style.width).toBe('620px')
    expect(floatingWindows[1]?.style.height).toBe('420px')

    await act(async () => {
      currentSpaghettiState.setActiveEditorViewportId('editor-viewport-1')
    })
    await rerenderHarness()

    floatingWindows = Array.from(
      container?.querySelectorAll('.SpaghettiFloatingWindow') ?? [],
    ) as HTMLDivElement[]
    expect(floatingWindows).toHaveLength(2)
    expect(floatingWindows[0]?.style.left).toBe('344px')
    expect(floatingWindows[0]?.style.top).toBe('28px')
    expect(floatingWindows[0]?.style.width).toBe('800px')
    expect(floatingWindows[0]?.style.height).toBe('600px')
    expect(floatingWindows[1]?.style.left).toBe('516px')
    expect(floatingWindows[1]?.style.top).toBe('112px')
    expect(floatingWindows[1]?.style.width).toBe('620px')
    expect(floatingWindows[1]?.style.height).toBe('420px')
  })

  it('renders a detached editor popup from workspace placement even if the old viewport order no longer carries it', async () => {
    currentSpaghettiState.activeEditorViewportId = 'editor-viewport-2'
    currentSpaghettiState.editorViewportOrder = ['editor-viewport-2']
    currentSpaghettiState.editorViewportsById = {
      'editor-viewport-1': {
        ...viewport('separateWindow'),
        editorViewportId: 'editor-viewport-1',
        graphDocumentId: 'graph-document-1',
      },
      'editor-viewport-2': {
        ...viewport('expanded'),
        editorViewportId: 'editor-viewport-2',
        graphDocumentId: 'graph-document-2',
      },
    }
    const detachedPlacement = createDefaultEditorWorkspaceSurfaceState('editor-viewport-1')
    useWorkspaceStore.getState().setEditorSurfacePlacement('editor-viewport-1', {
      ...detachedPlacement,
      windowMode: 'separateWindow',
      popoutState: {
        ...detachedPlacement.popoutState!,
        childWindowId: 'spaghetti-editor-workspace-placement-test-popout',
        windowName: 'parahook-spaghetti-workspace-placement-test',
        windowTitle: 'ParaHook Spaghetti Editor Placement Test',
        owner: 'child-window',
      },
    })

    const popoutDocument = document.implementation.createHTMLDocument('Detached Editor')
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await renderHarness()
    await rerenderHarness()

    expect(window.open).toHaveBeenCalledTimes(1)
    expect(popoutDocument.body.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-2')
  })

  it('lets a bottom drag override an older vertical split side when re-entering split view', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = {
      ...viewport('expanded'),
      splitDirection: 'vertical',
      splitDockSide: 'right',
    }

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
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 560,
          clientY: 872,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportSplitDockSide).toHaveBeenCalledWith(
      'editor-viewport-1',
      'bottom',
    )
    expect(currentSpaghettiState.editorViewportsById['editor-viewport-1']?.splitDirection).toBe(
      'horizontal',
    )
  })

  it('resizes the floating spaghetti window from the west edge by changing width and x position together', async () => {
    await renderHarness()
    mockGeometry()

    const westHandle = container?.querySelector(
      '[data-spaghetti-floating-resize-handle="w"]',
    ) as HTMLDivElement | null

    expect(westHandle).not.toBeNull()

    await act(async () => {
      westHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 24,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 4,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 4,
          clientY: 300,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportSize).toHaveBeenCalledWith(
      'editor-viewport-1',
      expect.objectContaining({
        width: 820,
        height: 600,
      }),
    )
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith(
      'editor-viewport-1',
      expect.objectContaining({
        x: 4,
        y: 28,
      }),
    )
  })

  it('resizes the floating spaghetti window from the north-west corner by changing height width x and y together', async () => {
    await renderHarness()
    mockGeometry()

    const northWestHandle = container?.querySelector(
      '[data-spaghetti-floating-resize-handle="nw"]',
    ) as HTMLDivElement | null

    expect(northWestHandle).not.toBeNull()

    await act(async () => {
      northWestHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 24,
          clientY: 28,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 10,
          clientY: 10,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 10,
          clientY: 10,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportSize).toHaveBeenCalledWith(
      'editor-viewport-1',
      expect.objectContaining({
        width: 814,
        height: 618,
      }),
    )
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith(
      'editor-viewport-1',
      expect.objectContaining({
        x: 10,
        y: 10,
      }),
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
