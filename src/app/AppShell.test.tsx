// @vitest-environment jsdom

import { act, useLayoutEffect, type MouseEvent as ReactMouseEvent } from 'react'
import { useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConsoleStore } from './console/useConsoleStore'
import { resetAudioSamplerStore, useAudioSamplerStore } from './store/audioSamplerStore'
import { consumeQueuedViewerCameraPose, setViewer } from './viewerBridge'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import { workspaceLayoutStorageKey } from './workspace/workspacePersistence'
import {
  splitWorkspaceSurfaceToSide,
} from './workspace/workspaceSurfaceActions'
import {
  createDefaultEditorWorkspaceSurfaceState,
  defaultPrimaryViewportSlotId,
} from './workspace/workspaceShellTypes'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let currentSpaghettiState: any
let currentAppState: any
const originalWindowConfirm = window.confirm
let mockSoundCloudPlaybackMode: 'ready' | 'throw' = 'ready'
const mockSoundCloudEnsureSourceReady = vi.fn(async () => {
  if (mockSoundCloudPlaybackMode === 'throw') {
    throw new Error('SoundCloud playback unavailable')
  }
  return { durationSec: 120 }
})
const mockSoundCloudPlayWindow = vi.fn(async () => {
  if (mockSoundCloudPlaybackMode === 'throw') {
    throw new Error('SoundCloud playback unavailable')
  }
})
const mockSoundCloudGetTransportState = vi.fn(async () => ({
  currentTimeSec: 0,
  durationSec: 120,
  isSeekable: true as const,
  isPlaying: false,
}))
const mockSoundCloudSeekTo = vi.fn(async () => undefined)
const mockSoundCloudStop = vi.fn(() => undefined)
const mockSoundCloudDispose = vi.fn(() => undefined)

vi.mock('../runtime/audio/SoundCloudWidgetClient', () => ({
  createBrowserSoundCloudWidgetClient: () => ({
    ensureSourceReady: mockSoundCloudEnsureSourceReady,
    getTransportState: mockSoundCloudGetTransportState,
    seekTo: mockSoundCloudSeekTo,
    playWindow: mockSoundCloudPlayWindow,
    stop: mockSoundCloudStop,
    dispose: mockSoundCloudDispose,
  }),
}))

vi.mock('./spaghetti/store/useSpaghettiStore', () => {
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
    selectEditorViewportSelectedNodeId: (state: any, editorViewportId: string) =>
      Object.prototype.hasOwnProperty.call(
        state.editorViewportSelectedNodeIdById ?? {},
        editorViewportId,
      )
        ? state.editorViewportSelectedNodeIdById?.[editorViewportId] ?? null
        : state.activeEditorViewportId === editorViewportId
          ? state.selectedNodeId ?? null
          : null,
    selectOrderedGraphDocuments: (state: any) =>
      (state.graphDocumentOrder ?? [])
        .map((graphDocumentId: string) => state.graphDocumentsById[graphDocumentId] ?? null)
        .filter((document: unknown) => document !== null),
    selectGraphDocumentById: (state: any, graphDocumentId: string) =>
      state.graphDocumentsById[graphDocumentId] ?? null,
  }
})

vi.mock('./store/useAppStore', () => {
  const store = ((selector: (state: any) => unknown) => selector(currentAppState)) as any
  store.getState = () => currentAppState
  return {
    useAppStore: store,
    selectConsoleWorkspaceContextTarget: (state: any) => state.workspaceSelection.selectedTarget,
  }
})

vi.mock('./components/TitleStatusBar', () => ({
  TitleStatusBar: () => <div>Title Status</div>,
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

vi.mock('./workspace/ViewportWorkspaceHost', () => ({
  ViewportWorkspaceHost: ({
    viewportId,
    onActivateViewerSurface,
    onViewportContextMenu,
  }: {
    viewportId: string
    onActivateViewerSurface: (viewportId: string) => void
    onViewportContextMenu?: (
      viewportId: string,
      event: ReactMouseEvent<HTMLDivElement>,
    ) => void
  }) => (
    <div
      className="ViewportWorkspaceHost"
      data-workspace-viewport-id={viewportId}
      onPointerDownCapture={() => onActivateViewerSurface(viewportId)}
      onContextMenu={(event) => onViewportContextMenu?.(viewportId, event)}
    >
      <div className="ViewportViewerSurface" data-workspace-viewport-id={viewportId}>
        Viewer Host
      </div>
      <div className="ViewportOverlayRoot" data-workspace-viewport-id={viewportId}>
        Viewport Overlay
      </div>
      <div className="RightDock" data-workspace-viewport-id={viewportId}>
        View Toolbar
      </div>
    </div>
  ),
}))

vi.mock('./console/ConsoleDock', async () => {
  const { useConsoleStore } =
    await vi.importActual<typeof import('./console/useConsoleStore')>('./console/useConsoleStore')

  return {
    ConsoleDock: ({
      listLeftOffset,
      suppressDockedSurface = false,
      suppressSlotHeaderDragSeedReplay = false,
      slotHeaderDragSeed = null,
      onConsumeSlotHeaderDragSeed,
      onOpenFloatingSplitMenu,
    }: {
      listLeftOffset: number
      suppressDockedSurface?: boolean
      suppressSlotHeaderDragSeedReplay?: boolean
      slotHeaderDragSeed?: {
        pointerId: number
        clientX: number
        clientY: number
        pointerOffsetX: number
        pointerOffsetY: number
        titleBarHeight: number
      } | null
      onConsumeSlotHeaderDragSeed?: () => void
      onOpenFloatingSplitMenu?: (
        surfaceInstanceId: string,
        event: ReactMouseEvent<HTMLDivElement>,
      ) => void
    }) => {
      const isExpanded = useConsoleStore((state) => state.isExpanded)
      const isListMode = useConsoleStore((state) => state.isListMode)
      const windowMode = useConsoleStore((state) => state.windowMode)
      const entries = useConsoleStore((state) => state.entries)
      const toggleExpanded = useConsoleStore((state) => state.toggleExpanded)
      const floatingRect = useConsoleStore((state) => state.floatingRect)
      const setFloatingRect = useConsoleStore((state) => state.setFloatingRect)
      const consumedSlotHeaderDragPointerIdRef = useRef<number | null>(null)
      const shouldRenderDockedSurface = !(suppressDockedSurface && windowMode === 'docked')
      const resolveFloatingViewportSize = () => {
        const dockElement = document.querySelector('.ConsoleDockMock') as HTMLDivElement | null
        const width = dockElement?.clientWidth ?? 0
        const height = dockElement?.clientHeight ?? 0
        return {
          width: width > 0 ? width : window.innerWidth,
          height: height > 0 ? height : window.innerHeight,
        }
      }

      useLayoutEffect(() => {
        if (suppressSlotHeaderDragSeedReplay) {
          return
        }
        if (windowMode !== 'floating' || slotHeaderDragSeed === null) {
          return
        }
        if (consumedSlotHeaderDragPointerIdRef.current === slotHeaderDragSeed.pointerId) {
          return
        }
        consumedSlotHeaderDragPointerIdRef.current = slotHeaderDragSeed.pointerId

        const seededRect = {
          ...useConsoleStore.getState().floatingRect,
          x: Math.round(slotHeaderDragSeed.clientX - slotHeaderDragSeed.pointerOffsetX),
          y: Math.round(slotHeaderDragSeed.clientY - slotHeaderDragSeed.pointerOffsetY),
        }
        setFloatingRect(seededRect)

        const move = (event: PointerEvent) => {
          const viewportSize = resolveFloatingViewportSize()
          setFloatingRect({
            ...seededRect,
            x: Math.max(
              12,
              Math.min(
                Math.round(event.clientX - slotHeaderDragSeed.pointerOffsetX),
                viewportSize.width - seededRect.width - 12,
              ),
            ),
            y: Math.max(
              12,
              Math.min(
                Math.round(event.clientY - slotHeaderDragSeed.pointerOffsetY),
                viewportSize.height - seededRect.height - 12,
              ),
            ),
          })
        }
        const stop = () => {
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', stop)
          window.removeEventListener('pointercancel', stop)
        }

        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', stop)
        window.addEventListener('pointercancel', stop)
        onConsumeSlotHeaderDragSeed?.()

        return () => {
          stop()
        }
      }, [
        onConsumeSlotHeaderDragSeed,
        setFloatingRect,
        slotHeaderDragSeed,
        suppressSlotHeaderDragSeedReplay,
        windowMode,
      ])

      if (!shouldRenderDockedSurface) {
        return null
      }

      return (
        <div className="ConsoleDockMock">
          {shouldRenderDockedSurface ? (
            <div className="ConsoleBar">
              <button type="button" aria-label="Expand console" onClick={toggleExpanded}>
                ^
              </button>
            </div>
          ) : null}
          {isListMode && shouldRenderDockedSurface ? (
            <div className="ConsoleListView" style={{ left: `${listLeftOffset}px` }}>
              {entries.length > 0
                ? entries.map((entry) => (
                    <div key={entry.id} className="ConsoleListViewLine">
                      {entry.text}
                    </div>
                  ))
                : 'Ready'}
            </div>
          ) : null}
          {isExpanded && shouldRenderDockedSurface ? <div className="ConsolePanel">Console Panel</div> : null}
          {windowMode === 'floating' ? (
            <div
              className="ConsoleFloatingWindow"
              style={{
                left: `${floatingRect.x}px`,
                top: `${floatingRect.y}px`,
                width: `${floatingRect.width}px`,
                height: `${floatingRect.height}px`,
              }}
            >
              <div
                className="ConsolePanelHeader"
                onContextMenu={(event) =>
                  onOpenFloatingSplitMenu?.('console-floating-compat', event)
                }
              >
                Console Floating
              </div>
            </div>
          ) : null}
        </div>
      )
    },
  }
})

vi.mock('./panels/BrowserPanel', () => ({
  BrowserPanel: ({
    presentationMode,
    onCyclePresentationMode,
    isFloating,
    isPoppedOut,
    isCollapsed,
    showTitleBar = true,
    showQuickDockButton,
    onQuickDock,
    onToggleCollapsed,
    onTogglePopout,
    onTitleBarPointerDown,
  }: {
    presentationMode?: 'expanded' | 'essentials' | 'collapsed'
    onCyclePresentationMode?: () => void
    isFloating?: boolean
    isPoppedOut?: boolean
    isCollapsed?: boolean
    showTitleBar?: boolean
    showQuickDockButton?: boolean
    onQuickDock?: () => void
    onToggleCollapsed?: () => void
    onTogglePopout?: () => void
    onTitleBarPointerDown?: (event: any) => void
  }) => (
    <div>
      {showTitleBar ? (
        <div
          data-testid={`browser-titlebar-${isFloating === true ? 'floating' : 'docked'}`}
          onPointerDown={onTitleBarPointerDown}
        >
          Browser Titlebar
        </div>
      ) : null}
      <div>{`Browser Panel ${
        isPoppedOut === true ? 'poppedout' : isFloating === true ? 'floating' : 'docked'
      } ${
        presentationMode ?? (isCollapsed === true ? 'collapsed' : 'expanded')
      }`}</div>
      {showTitleBar ? (
        <>
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
        </>
      ) : null}
    </div>
  ),
}))

vi.mock('./panels/SpaghettiPanel', () => ({
  SpaghettiPanel: ({
    editorViewportId,
    onActivateEditorContext,
    activateOnPointerDownCapture,
    isHeaderCollapsed,
    isCanvasToolbarVisible,
    isWindowSettingsOpen,
    windowAppearance,
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
    windowAppearance?: { fontScale?: string }
  }) => (
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
  splitDirection: 'horizontal',
  splitDockSide: 'bottom',
  splitPriority: 'balanced',
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
  mockRect(container?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser'), {
    left: 16,
    top: 88,
    width: 320,
    height: 420,
  })
  mockRect(container?.querySelector('[data-testid="browser-titlebar-docked"]')?.parentElement, {
    left: 16,
    top: 88,
    width: 320,
    height: 420,
  })
  mockRect(container?.querySelector('.PrimaryViewportLeftDockPanelTarget--meatball-editor'), {
    left: 16,
    top: 470,
    width: 320,
    height: 280,
  })
}

const undockBrowserFromDock = async (container: HTMLDivElement | null) => {
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
}

const createMockChildWindow = () => {
  const popoutDocument = document.implementation.createHTMLDocument('Workspace Popout')
  let beforeUnloadHandler: (() => void) | null = null
  let isClosed = false
  const popoutWindow = {
    get closed() {
      return isClosed
    },
    document: popoutDocument,
    focus: vi.fn(),
    close: vi.fn(() => {
      isClosed = true
    }),
    addEventListener: vi.fn((type: string, handler: EventListenerOrEventListenerObject) => {
      if (type === 'beforeunload' && typeof handler === 'function') {
        beforeUnloadHandler = handler as () => void
      }
    }),
    removeEventListener: vi.fn(),
  } as unknown as Window

  return {
    popoutDocument,
    popoutWindow,
    dispatchBeforeUnload: () => beforeUnloadHandler?.(),
  }
}

describe('AppShell', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalAudioContext = window.AudioContext
  const originalWindowOpen = window.open

  class MockAudioBuffer {
    public readonly duration = 12
    private readonly channel = new Float32Array(1200)

    public getChannelData(): Float32Array {
      return this.channel
    }
  }

  class MockAudioBufferSource {
    public buffer: MockAudioBuffer | null = null
    public connect(_destination: unknown): void {}
    public disconnect(): void {}
    public start(_when = 0, _offset = 0, _duration = 0): void {}
    public stop(_when = 0): void {}
  }

  class MockAudioContext {
    public readonly state = 'running'
    public readonly currentTime = 0
    public readonly sampleRate = 100
    public readonly destination = {}

    public async resume(): Promise<void> {}

    public createBuffer(
      _channels: number,
      _length: number,
      _sampleRate: number,
    ): MockAudioBuffer {
      return new MockAudioBuffer()
    }

    public createBufferSource(): MockAudioBufferSource {
      return new MockAudioBufferSource()
    }
  }

  beforeEach(() => {
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    resetAudioSamplerStore()
    window.localStorage.clear()
    window.confirm = vi.fn(() => true)
    mockSoundCloudPlaybackMode = 'ready'
    mockSoundCloudEnsureSourceReady.mockClear()
    mockSoundCloudGetTransportState.mockClear()
    mockSoundCloudSeekTo.mockClear()
    mockSoundCloudPlayWindow.mockClear()
    mockSoundCloudStop.mockClear()
    mockSoundCloudDispose.mockClear()
    window.open = originalWindowOpen
    window.AudioContext = MockAudioContext as unknown as typeof AudioContext
    currentSpaghettiState = {
      activeGraphDocumentId: 'graph-document-1',
      activeEditorViewportId: 'editor-viewport-1',
      selectedNodeId: null,
      consolePreviewNodeId: null,
      sketchPlanePickPreviewPlane: null,
      sketchPlanePickSession: null,
      editorViewportOrder: ['editor-viewport-1'],
      editorViewportsById: {
        'editor-viewport-1': viewport('expanded'),
      },
      editorViewportSelectedNodeIdById: {},
      editorViewportHeaderCollapsedById: {},
      editorViewportCanvasToolbarVisibleById: {},
      setConsolePreviewNodeId: vi.fn((nodeId: string | null) => {
        currentSpaghettiState.consolePreviewNodeId = nodeId
      }),
      setSketchPlanePickPreviewPlane: vi.fn((plane: string | null) => {
        currentSpaghettiState.sketchPlanePickPreviewPlane = plane
      }),
      graphDocumentsById: {
        'graph-document-1': {
          graphDocumentId: 'graph-document-1',
          name: 'Graph 1',
          graph: {
            schemaVersion: 1,
            nodes: [],
            edges: [],
          },
        },
      },
      graphDocumentOrder: ['graph-document-1'],
      createGraphDocument: vi.fn(() => {
        const nextGraphDocumentId = `graph-document-${currentSpaghettiState.graphDocumentOrder.length + 1}`
        const nextGraphName = `Graph ${currentSpaghettiState.graphDocumentOrder.length + 1}`
        currentSpaghettiState.graphDocumentsById[nextGraphDocumentId] = {
          graphDocumentId: nextGraphDocumentId,
          name: nextGraphName,
          graph: {
            schemaVersion: 1,
            nodes: [],
            edges: [],
          },
        }
        currentSpaghettiState.graphDocumentOrder = [
          ...currentSpaghettiState.graphDocumentOrder,
          nextGraphDocumentId,
        ]
        return nextGraphDocumentId
      }),
      setActiveEditorViewportId: vi.fn((editorViewportId: string) => {
        const nextViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (nextViewport === undefined) {
          return
        }
        currentSpaghettiState.activeEditorViewportId = editorViewportId
        currentSpaghettiState.activeGraphDocumentId = nextViewport.graphDocumentId
      }),
      openGraphDocumentInNewViewport: vi.fn((graphDocumentId: string) => {
        const nextViewportId = `editor-viewport-${currentSpaghettiState.editorViewportOrder.length + 1}`
        const lastViewportId =
          currentSpaghettiState.editorViewportOrder[currentSpaghettiState.editorViewportOrder.length - 1]
        const lastViewport =
          lastViewportId !== undefined ? currentSpaghettiState.editorViewportsById[lastViewportId] : null
        currentSpaghettiState.editorViewportsById[nextViewportId] = {
          ...viewport('expanded'),
          editorViewportId: nextViewportId,
          graphDocumentId,
          isFocused: false,
          position:
            lastViewport === null
              ? { ...viewport('expanded').position }
              : {
                  x: lastViewport.position.x + 32,
                  y: lastViewport.position.y + 32,
                },
          zOrder: currentSpaghettiState.editorViewportOrder.length + 5,
        }
        currentSpaghettiState.editorViewportOrder = [
          ...currentSpaghettiState.editorViewportOrder,
          nextViewportId,
        ]
        currentSpaghettiState.editorViewportSelectedNodeIdById = {
          ...currentSpaghettiState.editorViewportSelectedNodeIdById,
          [nextViewportId]: null,
        }
        return nextViewportId
      }),
      bindEditorViewportToGraphDocument: vi.fn(
        (editorViewportId: string, graphDocumentId: string) => {
          const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
          if (currentViewport === undefined) {
            return
          }
          currentSpaghettiState.editorViewportsById[editorViewportId] = {
            ...currentViewport,
            graphDocumentId,
          }
        },
      ),
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
      restoreEditorViewportFromSeparateWindow: vi.fn((editorViewportId: string) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined || currentViewport.windowMode !== 'separateWindow') {
          return
        }
        currentSpaghettiState.editorViewportsById[editorViewportId] = {
          ...currentViewport,
          windowMode: 'expanded',
        }
      }),
      setEditorViewportHeaderCollapsed: vi.fn((editorViewportId: string, collapsed: boolean) => {
        if (currentSpaghettiState.editorViewportsById[editorViewportId] === undefined) {
          return
        }
        currentSpaghettiState.editorViewportHeaderCollapsedById[editorViewportId] = collapsed
      }),
      setEditorViewportCanvasToolbarVisible: vi.fn((editorViewportId: string, visible: boolean) => {
        if (currentSpaghettiState.editorViewportsById[editorViewportId] === undefined) {
          return
        }
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
      setEditorViewportSplitDirection: vi.fn((editorViewportId: string, splitDirection: string) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState.editorViewportsById[editorViewportId] = {
          ...currentViewport,
          splitDirection,
        }
      }),
      setEditorViewportSplitDockSide: vi.fn((editorViewportId: string, splitDockSide: string) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState.editorViewportsById[editorViewportId] = {
          ...currentViewport,
          splitDockSide,
          splitDirection:
            splitDockSide === 'left' || splitDockSide === 'right' ? 'vertical' : 'horizontal',
        }
      }),
      setEditorViewportSplitPriority: vi.fn((editorViewportId: string, splitPriority: string) => {
        const currentViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
        if (currentViewport === undefined) {
          return
        }
        currentSpaghettiState.editorViewportsById[editorViewportId] = {
          ...currentViewport,
          splitPriority,
        }
      }),
      closeEditorViewport: vi.fn((editorViewportId: string) => {
        if (currentSpaghettiState.editorViewportsById[editorViewportId] === undefined) {
          return
        }
        const nextEditorViewportsById = { ...currentSpaghettiState.editorViewportsById }
        delete nextEditorViewportsById[editorViewportId]
        currentSpaghettiState.editorViewportsById = nextEditorViewportsById
        currentSpaghettiState.editorViewportOrder = currentSpaghettiState.editorViewportOrder.filter(
          (candidateViewportId: string) => candidateViewportId !== editorViewportId,
        )
        if (currentSpaghettiState.activeEditorViewportId === editorViewportId) {
          currentSpaghettiState.activeEditorViewportId =
            currentSpaghettiState.editorViewportOrder[0] ?? null
        }
      }),
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
      workspaceSelection: {
        selectedTarget: null,
        activeSurface: null,
      },
      floatingShellActivationRequest: null,
      consoleContextSyncRequest: null,
      consoleWorkspaceContextHandoff: null,
      setWorkspaceSelectedTarget: vi.fn((target: unknown) => {
        currentAppState = {
          ...currentAppState,
          workspaceSelection: {
            ...currentAppState.workspaceSelection,
            selectedTarget: target,
          },
        }
      }),
      setActiveSurface: vi.fn((surface: 'spaghetti' | 'browser' | 'console' | 'viewer' | null) => {
        currentAppState = {
          ...currentAppState,
          workspaceSelection: {
            ...currentAppState.workspaceSelection,
            activeSurface: surface,
          },
        }
      }),
      requestConsoleContextSync: vi.fn((reason: string, source = 'legacy') => {
        currentAppState = {
          ...currentAppState,
          consoleContextSyncRequest: {
            reason,
            source,
            seq: (currentAppState.consoleContextSyncRequest?.seq ?? 0) + 1,
          },
        }
      }),
      requestConsoleWorkspaceContextHandoff: vi.fn((handoff: Record<string, unknown>) => {
        currentAppState = {
          ...currentAppState,
          consoleWorkspaceContextHandoff: {
            ...handoff,
            seq: (currentAppState.consoleWorkspaceContextHandoff?.seq ?? 0) + 1,
          },
        }
      }),
      requestFloatingShellActivation: vi.fn((target: 'spaghetti' | 'browser') => {
        currentAppState = {
          ...currentAppState,
          floatingShellActivationRequest: {
            target,
            seq: (currentAppState.floatingShellActivationRequest?.seq ?? 0) + 1,
          },
        }
      }),
      requestGraphDocumentBuild: vi.fn(),
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
    window.localStorage.clear()
    window.confirm = originalWindowConfirm
    window.open = originalWindowOpen
    window.AudioContext = originalAudioContext
    setViewer('model-viewer-primary', null)
    setViewer('model-viewer-workspace-slot-2', null)
    setViewer('model-viewer-detached-1', null)
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

  it('mounts the viewer, overlay, and view toolbar under one viewport-local workspace host', async () => {
    ;({ container, root } = await renderAppShell())

    const viewportHost = container?.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLDivElement | null

    expect(viewportHost).not.toBeNull()
    expect(
      viewportHost?.querySelector(
        '.ViewportViewerSurface[data-workspace-viewport-id="model-viewer-primary"]',
      ),
    ).not.toBeNull()
    expect(
      viewportHost?.querySelector(
        '.ViewportOverlayRoot[data-workspace-viewport-id="model-viewer-primary"]',
      ),
    ).not.toBeNull()
    expect(
      viewportHost?.querySelector('.RightDock[data-workspace-viewport-id="model-viewer-primary"]'),
    ).not.toBeNull()
  })

  it('mounts the generator title status bar inside the viewport area', async () => {
    ;({ container, root } = await renderAppShell())

    const viewportArea = container?.querySelector('.ViewportArea') as HTMLElement | null
    const leftDock = container?.querySelector('.PrimaryViewportLeftDock') as HTMLElement | null
    const primarySlot = container?.querySelector(
      '.ViewportFrame.isPrimarySlot',
    ) as HTMLElement | null

    expect(viewportArea?.querySelector('.PrimaryViewportLeftDockStatus')).not.toBeNull()
    expect(primarySlot?.querySelector('.PrimaryViewportLeftDockStatus')).not.toBeNull()
    expect(viewportArea?.textContent).toContain('Title Status')
    expect(leftDock?.textContent).toContain('Title Status')
  })

  it('keeps the generator title status bar docked to the primary model viewport after a left split', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'left', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    const nonPrimarySlot = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) => !element.classList.contains('isPrimarySlot'),
    ) as HTMLElement | undefined
    const primarySlot = container?.querySelector(
      '.ViewportFrame.isPrimarySlot',
    ) as HTMLElement | null

    expect(primarySlot?.querySelector('.PrimaryViewportLeftDock')).not.toBeNull()
    expect(primarySlot?.querySelector('.PrimaryViewportLeftDockStatus')).not.toBeNull()
    expect(nonPrimarySlot?.querySelector('.PrimaryViewportLeftDock')).toBeNull()
  })

  it('keeps the unified left dock attached only to the primary model viewport after a right split', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    const nonPrimarySlots = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).filter(
      (element) => !element.classList.contains('isPrimarySlot'),
    ) as HTMLElement[]
    const primarySlot = container?.querySelector(
      '.ViewportFrame.isPrimarySlot',
    ) as HTMLElement | null

    expect(primarySlot?.querySelector('.PrimaryViewportLeftDock')).not.toBeNull()
    expect(nonPrimarySlots.every((slot) => slot.querySelector('.PrimaryViewportLeftDock') === null)).toBe(
      true,
    )
  })

  it('keeps the unified left dock attached only to the primary model viewport after deeper slot-tree changes', async () => {
    ;({ container, root } = await renderAppShell())

    let rightSlotId: string | null = null
    await act(async () => {
      rightSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    expect(rightSlotId).toBeTruthy()

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot(rightSlotId ?? '', 'bottom', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-2',
      })
    })

    const nonPrimarySlots = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).filter(
      (element) => !element.classList.contains('isPrimarySlot'),
    ) as HTMLElement[]
    const primarySlot = container?.querySelector(
      '.ViewportFrame.isPrimarySlot',
    ) as HTMLElement | null

    expect(primarySlot?.querySelector('.PrimaryViewportLeftDock')).not.toBeNull()
    expect(nonPrimarySlots.length).toBe(2)
    expect(nonPrimarySlots.every((slot) => slot.querySelector('.PrimaryViewportLeftDock') === null)).toBe(
      true,
    )
  })

  it('keeps the docked browser visible after the primary left dock remounts during a left split', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'left', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-surface-secondary',
      })
    })

    await rerenderAppShell(root!)
    mockShellGeometry(container)

    const primarySlot = container?.querySelector('.ViewportFrame.isPrimarySlot') as HTMLElement | null
    expect(primarySlot?.querySelector('.PrimaryViewportLeftDock')).not.toBeNull()
    expect(primarySlot?.textContent).toContain('Browser Panel docked expanded')
  })

  it('constrains the primary left dock panel stack so it can scroll after a bottom slot split', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'bottom', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-surface-bottom',
      })
    })

    const primarySlot = container?.querySelector('.ViewportFrame.isPrimarySlot') as HTMLElement | null
    const panelStack = primarySlot?.querySelector('.PanelStack') as HTMLElement | null
    expect(primarySlot?.querySelector('.PrimaryViewportLeftDock')).not.toBeNull()
    expect(panelStack?.classList.contains('isConstrained')).toBe(true)
  })

  it('renders duplicated secondary slot surfaces from the workspace slot tree', async () => {
    const duplicatedEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport('graph-document-1')

    ;({ container, root } = await renderAppShell())

    let consoleSlotId: string | null = null
    await act(async () => {
      consoleSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
    })

    expect(consoleSlotId).toBeTruthy()

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot(consoleSlotId ?? '', 'bottom', {
        surfaceKind: 'spaghettiEditor',
        surfaceInstanceId: duplicatedEditorViewportId,
      })
    })

    expect(container?.querySelectorAll('.ViewportFrame').length).toBe(3)
    expect(container?.querySelectorAll('.ConsoleDockMock').length).toBe(1)
    expect(container?.textContent).toContain(`Spaghetti Panel ${duplicatedEditorViewportId}`)
  })

  it('treats split-slot editor to browser replacement as a true close instead of auto-floating the editor', async () => {
    const duplicatedEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport('graph-document-1')

    ;({ container, root } = await renderAppShell())

    let spaghettiSlotId: string | null = null
    await act(async () => {
      spaghettiSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'spaghettiEditor',
        surfaceInstanceId: 'editor-viewport-1',
      })
    })

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') === spaghettiSlotId &&
        element.getAttribute('data-workspace-surface-kind') === 'spaghettiEditor',
    ) as HTMLDivElement | undefined
    const modeButton = slotFrame?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null

    expect(slotFrame).not.toBeUndefined()
    expect(modeButton).not.toBeNull()

    await act(async () => {
      modeButton?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 48,
          clientY: 48,
        }),
      )
    })

    const browserAction = Array.from(
      container?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Browser') as HTMLButtonElement | undefined

    expect(browserAction).not.toBeUndefined()

    await act(async () => {
      browserAction?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await rerenderAppShell(root!)

    const workspaceState = useWorkspaceStore.getState()
    const replacedSlot = spaghettiSlotId === null ? null : workspaceState.viewportSlotsById[spaghettiSlotId]

    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-1')
    expect(replacedSlot?.surfaceKind).toBe('browser')
    expect(replacedSlot?.retainedSurfaceInstanceIdsByKind.spaghettiEditor).toBeUndefined()
    expect(currentSpaghettiState.editorViewportsById['editor-viewport-1']).toBeUndefined()
    expect(container?.textContent).not.toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.textContent).toContain(`Spaghetti Panel ${duplicatedEditorViewportId}`)
    expect(container?.querySelector('.SpaghettiFloatingWindow')?.textContent ?? '').not.toContain(
      'editor-viewport-1',
    )
  })

  it('switches a browser slot to spaghetti by creating a live editor when the retained editor id is stale', async () => {
    ;({ container, root } = await renderAppShell())

    let browserSlotId: string | null = null
    await act(async () => {
      browserSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    await act(async () => {
      useWorkspaceStore.setState((state) => ({
        viewportSlotsById: {
          ...state.viewportSlotsById,
          ...(browserSlotId === null
            ? {}
            : {
                [browserSlotId]: {
                  ...state.viewportSlotsById[browserSlotId],
                  retainedSurfaceInstanceIdsByKind: {
                    ...state.viewportSlotsById[browserSlotId].retainedSurfaceInstanceIdsByKind,
                    spaghettiEditor: 'editor-viewport-stale',
                  },
                },
              }),
        },
      }))
    })
    await rerenderAppShell(root!)

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') === browserSlotId &&
        element.getAttribute('data-workspace-surface-kind') === 'browser',
    ) as HTMLDivElement | undefined
    const modeButton = slotFrame?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null

    expect(modeButton).not.toBeNull()
    currentSpaghettiState.openGraphDocumentInNewViewport.mockClear()

    await act(async () => {
      modeButton?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 48,
          clientY: 48,
        }),
      )
    })

    const spaghettiAction = Array.from(
      container?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Spaghetti Editor') as
      | HTMLButtonElement
      | undefined

    expect(spaghettiAction).not.toBeUndefined()

    await act(async () => {
      spaghettiAction?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await rerenderAppShell(root!)

    const workspaceState = useWorkspaceStore.getState()
    const replacedSlot = browserSlotId === null ? null : workspaceState.viewportSlotsById[browserSlotId]

    expect(currentSpaghettiState.openGraphDocumentInNewViewport).toHaveBeenCalled()
    expect(replacedSlot?.surfaceKind).toBe('spaghettiEditor')
    expect(replacedSlot?.surfaceInstanceId).toBe('editor-viewport-2')
    expect(replacedSlot?.surfaceInstanceId).not.toBe('editor-viewport-stale')
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-2')
  })

  it('opens a new editor instead of stealing another visible editor when switching a browser slot to spaghetti', async () => {
    currentSpaghettiState.editorViewportOrder = ['editor-viewport-1', 'editor-viewport-2']
    currentSpaghettiState.editorViewportsById['editor-viewport-2'] = {
      ...viewport('expanded'),
      editorViewportId: 'editor-viewport-2',
      windowMode: 'expanded',
      graphDocumentId: 'graph-document-1',
    }

    ;({ container, root } = await renderAppShell())

    let browserSlotId: string | null = null
    await act(async () => {
      browserSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })
    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') === browserSlotId &&
        element.getAttribute('data-workspace-surface-kind') === 'browser',
    ) as HTMLDivElement | undefined
    const modeButton = slotFrame?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null

    expect(modeButton).not.toBeNull()
    currentSpaghettiState.openGraphDocumentInNewViewport.mockClear()

    await act(async () => {
      modeButton?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 48,
          clientY: 48,
        }),
      )
    })

    const spaghettiAction = Array.from(
      container?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Spaghetti Editor') as
      | HTMLButtonElement
      | undefined

    expect(spaghettiAction).not.toBeUndefined()

    await act(async () => {
      spaghettiAction?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await rerenderAppShell(root!)

    const workspaceState = useWorkspaceStore.getState()
    const replacedSlot = browserSlotId === null ? null : workspaceState.viewportSlotsById[browserSlotId]

    expect(replacedSlot?.surfaceKind).toBe('spaghettiEditor')
    expect(replacedSlot?.surfaceInstanceId).toBe('editor-viewport-3')
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-2')
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-3')
  })

  it('stagger-spawns a second floating spaghetti editor instead of perfectly covering the first', async () => {
    const duplicatedEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport('graph-document-1')

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    await rerenderAppShell(root!)

    const floatingWindows = Array.from(container?.querySelectorAll('.SpaghettiFloatingWindow') ?? [])
    const firstWindow = floatingWindows.find((element) =>
      element.textContent?.includes('Spaghetti Panel editor-viewport-1'),
    ) as HTMLDivElement | undefined
    const secondWindow = floatingWindows.find((element) =>
      element.textContent?.includes(`Spaghetti Panel ${duplicatedEditorViewportId}`),
    ) as HTMLDivElement | undefined

    expect(firstWindow).toBeTruthy()
    expect(secondWindow).toBeTruthy()
    expect(firstWindow?.style.left).not.toBe(secondWindow?.style.left)
    expect(firstWindow?.style.top).not.toBe(secondWindow?.style.top)
  })

  it('renders a real second model viewport host when a non-primary slot becomes modelViewer', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-workspace-slot-2',
      })
    })

    const viewportHosts = Array.from(
      container?.querySelectorAll('.ViewportWorkspaceHost') ?? [],
    ) as HTMLElement[]

    expect(viewportHosts.length).toBe(2)
    expect(
      container?.querySelector(
        '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-primary"]',
      ),
    ).not.toBeNull()
    expect(
      container?.querySelector(
        '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-workspace-slot-2"]',
      ),
    ).not.toBeNull()
    expect(container?.textContent).not.toContain(
      'Secondary model viewport runtime parity lands in `Workspace 7.3`.',
    )
  })

  it('opens a searchable viewport spawn menu on model viewport right-click', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const viewportHost = container?.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLDivElement | null
    expect(viewportHost).not.toBeNull()

    await act(async () => {
      viewportHost?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 640,
          clientY: 320,
        }),
      )
    })

    const searchInput = container?.querySelector('.ViewportSpawnMenuSearch') as HTMLInputElement | null
    expect(searchInput).not.toBeNull()
    expect(container?.textContent).toContain('Spawn Spaghetti Editor')
    expect(container?.textContent).toContain('Spawn Browser')

    expect(searchInput?.getAttribute('placeholder')).toBe('Search spawn actions')
  })

  it('spawns floating spaghetti and browser surfaces from the viewport spawn menu', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const viewportHost = container?.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLDivElement | null
    expect(viewportHost).not.toBeNull()

    await act(async () => {
      viewportHost?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 640,
          clientY: 320,
        }),
      )
    })

    const spawnSpaghettiButton = Array.from(
      container?.querySelectorAll('.ViewportSpawnMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Spawn Spaghetti Editor') as
      | HTMLButtonElement
      | undefined
    expect(spawnSpaghettiButton).toBeDefined()

    currentSpaghettiState.openGraphDocumentInNewViewport.mockClear()
    currentSpaghettiState.setEditorViewportPosition.mockClear()

    await act(async () => {
      spawnSpaghettiButton?.click()
    })

    expect(currentSpaghettiState.openGraphDocumentInNewViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalled()
    expect(container?.querySelector('.ViewportSpawnMenu')).toBeNull()

    const refreshedViewportHost = container?.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLDivElement | null
    expect(refreshedViewportHost).not.toBeNull()

    await act(async () => {
      refreshedViewportHost?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 700,
          clientY: 360,
        }),
      )
    })

    const spawnBrowserButton = Array.from(
      container?.querySelectorAll('.ViewportSpawnMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Spawn Browser') as
      | HTMLButtonElement
      | undefined
    expect(spawnBrowserButton).toBeDefined()

    await act(async () => {
      spawnBrowserButton?.click()
    })

    expect(useWorkspaceStore.getState().browserShell.isFloating).toBe(true)
    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()
  })

  it('queues the source camera onto both model viewports after a split', async () => {
    ;({ container, root } = await renderAppShell())

    const { Vector3 } = await import('three')
    const applyCameraPose = vi.fn()
    setViewer('model-viewer-primary', {
      applyCameraPose,
      getCameraPose: () => ({
        position: new Vector3(9, 8, 7),
        target: new Vector3(1, 2, 3),
        up: new Vector3(0, 1, 0),
        projectionMode: 'perspective',
        perspectiveFovDeg: 55,
        orthoViewHeight: 12,
      }),
    } as any)

    const primaryHeader = container?.querySelector(
      '.ViewportFrame.isPrimarySlot .ViewportFrameHeader',
    ) as HTMLDivElement | null
    expect(primaryHeader).not.toBeNull()

    await act(async () => {
      primaryHeader?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null
    expect(splitButton).not.toBeNull()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Split Right') as HTMLButtonElement | undefined
    expect(splitRightButton).toBeDefined()

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const secondaryViewportSlot = Object.values(useWorkspaceStore.getState().viewportSlotsById).find(
      (slot) =>
        slot.slotId !== defaultPrimaryViewportSlotId && slot.surfaceKind === 'modelViewer',
    )
    expect(secondaryViewportSlot).toBeDefined()

    const primaryQueuedPose = consumeQueuedViewerCameraPose('model-viewer-primary')
    const secondaryQueuedPose = consumeQueuedViewerCameraPose(
      secondaryViewportSlot?.surfaceInstanceId ?? '',
    )
    expect(primaryQueuedPose).not.toBeNull()
    expect(secondaryQueuedPose).not.toBeNull()
    expect(primaryQueuedPose).toMatchObject({
      projectionMode: 'perspective',
      perspectiveFovDeg: 55,
      orthoViewHeight: 12,
    })
    expect(secondaryQueuedPose).toMatchObject({
      projectionMode: 'perspective',
      perspectiveFovDeg: 55,
      orthoViewHeight: 12,
    })
    expect(applyCameraPose).toHaveBeenCalledWith(
      expect.objectContaining({
        projectionMode: 'perspective',
        perspectiveFovDeg: 55,
        orthoViewHeight: 12,
      }),
    )
  })

  it('renders a detached floating model viewport and quick docks it back to its host viewport', async () => {
    ;({ container, root } = await renderAppShell())

    let secondaryViewerSlotId: string | null = null
    await act(async () => {
      secondaryViewerSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-workspace-slot-2',
      })
    })

    expect(secondaryViewerSlotId).toBeTruthy()

    await act(async () => {
      useWorkspaceStore.getState().detachViewportSlotSurface(secondaryViewerSlotId ?? '', 'floating')
    })
    await rerenderAppShell(root!)

    const floatingViewer = container?.querySelector(
      '.DetachedViewerFloatingWindow[data-workspace-surface-instance-id="model-viewer-workspace-slot-2"]',
    ) as HTMLDivElement | null
    expect(floatingViewer).not.toBeNull()
    expect(floatingViewer?.getAttribute('data-workspace-host-viewport-id')).toBe(
      'model-viewer-primary',
    )

    const quickDockButton = floatingViewer?.querySelector(
      '.DetachedViewerFloatingWindowQuickDock',
    ) as HTMLButtonElement | null
    expect(quickDockButton).not.toBeNull()

    await act(async () => {
      quickDockButton?.click()
    })
    await rerenderAppShell(root!)

    expect(
      container?.querySelector(
        '.DetachedViewerFloatingWindow[data-workspace-surface-instance-id="model-viewer-workspace-slot-2"]',
      ),
    ).toBeNull()
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['model-viewer-workspace-slot-2']).toBeUndefined()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'modelViewer',
      ),
    ).toHaveLength(2)
  })

  it('drags a detached floating model viewport around the main viewport area', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    let secondaryViewerSlotId: string | null = null
    await act(async () => {
      secondaryViewerSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-workspace-slot-2',
      })
    })

    await act(async () => {
      useWorkspaceStore.getState().detachViewportSlotSurface(secondaryViewerSlotId ?? '', 'floating')
    })
    await rerenderAppShell(root!)

    const floatingViewer = container?.querySelector(
      '.DetachedViewerFloatingWindow[data-workspace-surface-instance-id="model-viewer-workspace-slot-2"]',
    ) as HTMLDivElement | null
    const floatingHeader = floatingViewer?.querySelector(
      '.DetachedViewerFloatingWindowHeader',
    ) as HTMLDivElement | null

    expect(floatingViewer).not.toBeNull()
    expect(floatingHeader).not.toBeNull()

    mockRect(floatingViewer, {
      left: 344,
      top: 24,
      width: 320,
      height: 405,
    })

    await act(async () => {
      floatingHeader?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 7,
          clientX: 420,
          clientY: 48,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 7,
          clientX: 620,
          clientY: 180,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 7,
          clientX: 620,
          clientY: 180,
        }),
      )
    })

    expect(floatingViewer?.style.left).toBe('224px')
    expect(floatingViewer?.style.top).toBe('156px')
  })

  it('opens a copied primary model viewport in a new browser window', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const { popoutDocument, popoutWindow } = createMockChildWindow()
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    const openInNewBrowserButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Open Model Viewport in new browser',
    ) as HTMLButtonElement | undefined
    expect(openInNewBrowserButton).toBeDefined()

    await act(async () => {
      openInNewBrowserButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(window.open).toHaveBeenCalled()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'modelViewer',
      ),
    ).toHaveLength(1)
    expect(Object.keys(useWorkspaceStore.getState().detachedSlotSurfaceById)).toHaveLength(1)
    expect(popoutDocument.body.textContent).toContain('Model Viewport')
    expect(popoutDocument.body.textContent).toContain('Viewer Host')
  })

  it('pops out a non-primary model viewport into a child window and quick docks it back', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const { popoutDocument, popoutWindow } = createMockChildWindow()
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-workspace-slot-2',
      })
    })

    const slotPopoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Pop out Model Viewport',
    ) as HTMLButtonElement | undefined
    expect(slotPopoutButton).not.toBeUndefined()

    await act(async () => {
      slotPopoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(window.open).toHaveBeenCalled()
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['model-viewer-workspace-slot-2']?.hostMode).toBe(
      'popout',
    )
    expect(
      container?.querySelector(
        '.ViewportFrame[data-workspace-surface-kind="modelViewer"][data-workspace-slot-id="workspace-slot-2"]',
      ),
    ).toBeNull()
    expect(popoutDocument.body.textContent).toContain('Model Viewport')
    expect(popoutDocument.body.textContent).toContain('Viewer Host')

    const quickDockButton = popoutDocument.body.querySelector(
      '.DetachedViewerPopoutWindowQuickDock',
    ) as HTMLButtonElement | null
    expect(quickDockButton).not.toBeNull()

    await act(async () => {
      quickDockButton?.click()
    })
    await rerenderAppShell(root!)

    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['model-viewer-workspace-slot-2']).toBeUndefined()
    expect(popoutWindow.close).toHaveBeenCalled()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'modelViewer',
      ),
    ).toHaveLength(2)
  })

  it('clears a non-primary model viewport popout when the child window closes', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const { popoutDocument, popoutWindow, dispatchBeforeUnload } = createMockChildWindow()
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-workspace-slot-2',
      })
    })

    const slotPopoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Pop out Model Viewport',
    ) as HTMLButtonElement | undefined
    expect(slotPopoutButton).not.toBeUndefined()

    await act(async () => {
      slotPopoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(popoutDocument.body.textContent).toContain('Viewer Host')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['model-viewer-workspace-slot-2']).toBeDefined()

    await act(async () => {
      dispatchBeforeUnload()
    })
    await rerenderAppShell(root!)

    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['model-viewer-workspace-slot-2']).toBeUndefined()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'modelViewer',
      ),
    ).toHaveLength(1)
  })

  it('renders a left split on the left side instead of mirroring it to the right', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'left', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    const viewerPane = container?.querySelector(
      '.ViewportSplitPane--viewer',
    ) as HTMLDivElement | null
    const editorPane = container?.querySelector(
      '.ViewportSplitPane--editor',
    ) as HTMLDivElement | null

    expect(editorPane?.textContent).toContain('Browser Panel docked expanded')
    expect(viewerPane?.textContent).toContain('Viewer Host')
  })

  it('preserves the browser side-split ratio when the legacy browser viewport split bridge creates a left slot', async () => {
    useWorkspaceStore.getState().setBrowserViewportSplitRatio(320 / 1120)
    useWorkspaceStore.getState().setBrowserViewportSplitDockSide('left')
    useWorkspaceStore.getState().setBrowserViewportSplit(true)

    ;({ container, root } = await renderAppShell())

    const splitNodeId =
      Object.keys(useWorkspaceStore.getState().viewportLayoutNodesById).find(
        (nodeId) => useWorkspaceStore.getState().viewportLayoutNodesById[nodeId]?.kind === 'split',
      ) ?? null
    const splitNode =
      (splitNodeId !== null
        ? useWorkspaceStore.getState().viewportLayoutNodesById[splitNodeId]
        : null) ?? null

    expect(splitNode?.kind).toBe('split')
    if (splitNode?.kind === 'split') {
      expect(splitNode.splitDockSide).toBe('left')
      expect(splitNode.ratio).toBeCloseTo(320 / 1120, 5)
    }
    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('quick docks a detached floating browser back into the left toolbar instead of restoring its split slot', async () => {
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-surface-1',
    })

    const detachedSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== 'workspace-slot-primary',
    )
    expect(detachedSlotId).toBeTruthy()

    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'floating')
    useWorkspaceStore.getState().setBrowserFloating(true)

    ;({ container, root } = await renderAppShell())

    const quickDockButton = container?.querySelector(
      'button[aria-label="Mock browser quick dock"]',
    ) as HTMLButtonElement | null

    expect(quickDockButton).not.toBeNull()

    await act(async () => {
      quickDockButton?.click()
    })

    const browserSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'browser',
    )

    expect(useWorkspaceStore.getState().browserShell.isFloating).toBe(false)
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['browser-surface-1']).toBeUndefined()
    expect(useWorkspaceStore.getState().browserToolbarOwnerSurfaceInstanceId).toBe(
      'browser-surface-1',
    )
    expect(browserSlots).toHaveLength(0)
    expect(container?.querySelector('.ViewportSplitLayout')).toBeNull()
    expect(
      container?.querySelector('.PrimaryViewportLeftDock')?.textContent,
    ).toContain('Browser Panel docked expanded')
  })

  it('keeps the primary left-toolbar Browser visible even when another Browser slot exists elsewhere', async () => {
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const primaryLeftDock = container?.querySelector('.PrimaryViewportLeftDock') as HTMLElement | null
    const browserFrames = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).filter(
      (element) => element.getAttribute('data-workspace-surface-kind') === 'browser',
    )

    expect(primaryLeftDock?.textContent).toContain('Browser Panel docked expanded')
    expect(browserFrames.length).toBeGreaterThan(0)
  })

  it('does not resurrect a docked Browser after the toolbar Browser is undocked and turned into viewport Browser slots', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await undockBrowserFromDock(container)

    await act(async () => {
      useWorkspaceStore.getState().setBrowserFloating(false)
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'top', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    const browserSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'browser',
    )
    const primaryLeftDock = container?.querySelector('.PrimaryViewportLeftDock') as HTMLElement | null

    expect(useWorkspaceStore.getState().browserToolbarOwnerSurfaceInstanceId).toBeNull()
    expect(browserSlots).toHaveLength(1)
    expect(primaryLeftDock?.textContent ?? '').not.toContain('Browser Panel docked expanded')
  })

  it('claims the toolbar with the detached Browser surface id when that Browser is dragged back left', async () => {
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-surface-1',
    })

    const detachedSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== 'workspace-slot-primary',
    )
    expect(detachedSlotId).toBeTruthy()

    useWorkspaceStore.getState().detachViewportSlotSurface(detachedSlotId ?? '', 'floating')
    useWorkspaceStore.getState().setBrowserFloating(true)

    ;({ container, root } = await renderAppShell())
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
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 60,
          clientY: 110,
        }),
      )
    })

    expect(useWorkspaceStore.getState().browserToolbarOwnerSurfaceInstanceId).toBe(
      'browser-surface-1',
    )
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('drags the viewport split divider to resize the slot split ratio', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
    })

    const splitLayout = container?.querySelector('.ViewportSplitLayout') as HTMLDivElement | null
    const splitDivider = container?.querySelector('.ViewportSplitDivider') as HTMLButtonElement | null
    expect(splitLayout).not.toBeNull()
    expect(splitDivider).not.toBeNull()

    mockRect(splitLayout, {
      left: 320,
      top: 0,
      width: 1120,
      height: 900,
    })

    await act(async () => {
      splitDivider?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 880,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 1208,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 1208,
          clientY: 300,
        }),
      )
    })

    const splitNodeId =
      Object.keys(useWorkspaceStore.getState().viewportLayoutNodesById).find(
        (nodeId) => useWorkspaceStore.getState().viewportLayoutNodesById[nodeId]?.kind === 'split',
      ) ?? null
    const splitNode =
      (splitNodeId !== null
        ? useWorkspaceStore.getState().viewportLayoutNodesById[splitNodeId]
        : null) ?? null
    expect(splitNode?.kind).toBe('split')
    if (splitNode?.kind === 'split') {
      expect(splitNode.ratio).toBeCloseTo(0.20714285714285716)
    }
  })

  it('suppresses the old docked browser host while a browser surface is already hosted in the slot tree', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    expect(container?.querySelectorAll('button[aria-label="Mock browser popout"]').length).toBe(0)
    expect(container?.querySelector('[data-testid="browser-titlebar-docked"]')).toBeNull()
    expect(container?.textContent).toContain('Browser Panel docked expanded')
  })

  it('uses the viewport header as the only title bar for a slotted browser and cycles - e + browser presentation modes', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    expect(container?.querySelector('[data-testid="browser-titlebar-docked"]')).toBeNull()
    expect(container?.textContent).toContain('Browser Panel docked expanded')

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') !== 'workspace-slot-primary' &&
        element.getAttribute('data-workspace-surface-kind') === 'browser',
    ) as HTMLDivElement | undefined
    const modeButton = slotFrame?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null

    expect(modeButton?.textContent).toBe('-')
    expect(modeButton?.getAttribute('aria-label')).toBe('Browser essentials')

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useWorkspaceStore.getState().browserShell.presentationMode).toBe('essentials')
    expect(useWorkspaceStore.getState().browserShell.isCollapsed).toBe(false)
    expect(container?.textContent).toContain('Browser Panel docked essentials')
    expect(modeButton?.textContent).toBe('e')

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useWorkspaceStore.getState().browserShell.presentationMode).toBe('collapsed')
    expect(useWorkspaceStore.getState().browserShell.isCollapsed).toBe(true)
    expect(container?.textContent).not.toContain('Browser Panel docked expanded')
    expect(container?.textContent).toContain('Browser Panel docked collapsed')
    expect(modeButton?.textContent).toBe('+')

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useWorkspaceStore.getState().browserShell.presentationMode).toBe('expanded')
    expect(useWorkspaceStore.getState().browserShell.isCollapsed).toBe(false)
    expect(container?.textContent).toContain('Browser Panel docked expanded')
    expect(modeButton?.textContent).toBe('-')
  })

  it('drags a slotted browser out from the viewport header into floating mode', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') !== 'workspace-slot-primary' &&
        element.getAttribute('data-workspace-surface-kind') === 'browser',
    ) as HTMLDivElement | undefined
    const header = slotFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(slotFrame).not.toBeUndefined()
    expect(header).not.toBeNull()

    mockShellGeometry(container)
    mockRect(slotFrame, {
      left: 920,
      top: 0,
      width: 520,
      height: 900,
    })
    mockElementSize(slotFrame, {
      width: 520,
      height: 900,
    })
    mockRect(header, {
      left: 920,
      top: 0,
      width: 520,
      height: 40,
    })

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 1,
          clientX: 980,
          clientY: 24,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 1020,
          clientY: 72,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 800,
          clientY: 140,
        }),
      )
    })

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 800,
          clientY: 140,
        }),
      )
    })

    expect(useWorkspaceStore.getState().browserShell.isFloating).toBe(true)
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'browser',
      ),
    ).toHaveLength(0)
    const browserShell = container?.querySelector('.BrowserFloatingWindow') as HTMLDivElement | null
    expect(browserShell).not.toBeNull()
    expect(
      container?.querySelector('.ViewportFrame[data-workspace-surface-kind="browser"]'),
    ).toBeNull()
    expect(browserShell?.style.width).toBe('320px')
    expect(useWorkspaceStore.getState().browserShell.position.x).toBeGreaterThan(0)
  })

  it('drags a slotted spaghetti editor out from the viewport header into floating mode', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'spaghettiEditor',
        surfaceInstanceId: 'editor-viewport-1',
      })
    })

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') !== 'workspace-slot-primary' &&
        element.getAttribute('data-workspace-surface-kind') === 'spaghettiEditor',
    ) as HTMLDivElement | undefined
    const header = slotFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(slotFrame).not.toBeUndefined()
    expect(header).not.toBeNull()

    mockShellGeometry(container)
    mockRect(slotFrame, {
      left: 920,
      top: 0,
      width: 520,
      height: 900,
    })
    mockElementSize(slotFrame, {
      width: 520,
      height: 900,
    })
    mockRect(header, {
      left: 920,
      top: 0,
      width: 520,
      height: 40,
    })

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 1,
          clientX: 980,
          clientY: 24,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 1020,
          clientY: 72,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 800,
          clientY: 140,
        }),
      )
    })

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 800,
          clientY: 140,
        }),
      )
    })

    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'spaghettiEditor',
      ),
    ).toHaveLength(0)
    expect(
      container?.querySelector('.ViewportFrame[data-workspace-surface-kind="spaghettiEditor"]'),
    ).toBeNull()
    expect(container?.querySelector('.SpaghettiFloatingWindow')).not.toBeNull()
    expect(currentSpaghettiState.editorViewportsById['editor-viewport-1']?.windowMode).toBe(
      'expanded',
    )
    expect(currentSpaghettiState.editorViewportsById['editor-viewport-1']?.position.x).toBeGreaterThan(
      300,
    )
    expect(currentSpaghettiState.editorViewportsById['editor-viewport-1']?.position.y).toBeGreaterThan(
      30,
    )
  })

  it('keeps a slotted console attached to the pointer until release during drag-out', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
    })

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') !== 'workspace-slot-primary' &&
        element.getAttribute('data-workspace-surface-kind') === 'console',
    ) as HTMLDivElement | undefined
    const header = slotFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(slotFrame).not.toBeUndefined()
    expect(header).not.toBeNull()

    mockShellGeometry(container)
    mockRect(slotFrame, {
      left: 920,
      top: 0,
      width: 520,
      height: 900,
    })
    mockElementSize(slotFrame, {
      width: 520,
      height: 900,
    })
    mockRect(header, {
      left: 920,
      top: 0,
      width: 520,
      height: 40,
    })

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 1,
          clientX: 980,
          clientY: 24,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 1020,
          clientY: 72,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 800,
          clientY: 140,
        }),
      )
    })

    const floatingRectBeforeRelease = useConsoleStore.getState().floatingRect
    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(floatingRectBeforeRelease.x).toBeGreaterThan(300)
    expect(floatingRectBeforeRelease.y).toBeGreaterThan(30)
    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 800,
          clientY: 140,
        }),
      )
    })

    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'console',
      ),
    ).toHaveLength(0)
    expect(container?.querySelector('.ViewportFrame[data-workspace-surface-kind="console"]')).toBeNull()
    expect(container?.querySelector('.ConsoleFloatingWindow')).not.toBeNull()
    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(useConsoleStore.getState().floatingRect).toMatchObject(floatingRectBeforeRelease)
  })

  it('pre-seeds the floating console rect from the slot header drag-out instead of snapping through the old parked float rect', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'top', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
      useConsoleStore.getState().setFloatingRect({
        x: 48,
        y: 640,
        width: 720,
        height: 420,
      })
      useConsoleStore.getState().switchToDocked(false)
    })

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') !== 'workspace-slot-primary' &&
        element.getAttribute('data-workspace-surface-kind') === 'console',
    ) as HTMLDivElement | undefined
    const header = slotFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(slotFrame).not.toBeUndefined()
    expect(header).not.toBeNull()

    mockShellGeometry(container)
    mockRect(slotFrame, {
      left: 320,
      top: 0,
      width: 1120,
      height: 260,
    })
    mockElementSize(slotFrame, {
      width: 1120,
      height: 260,
    })
    mockRect(header, {
      left: 320,
      top: 0,
      width: 1120,
      height: 40,
    })

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 1,
          clientX: 420,
          clientY: 24,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 520,
          clientY: 72,
        }),
      )
    })

    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(useConsoleStore.getState().floatingRect.x).toBeGreaterThan(250)
    expect(useConsoleStore.getState().floatingRect.y).toBeLessThan(100)
    expect(useConsoleStore.getState().floatingRect.x).not.toBe(48)
    expect(useConsoleStore.getState().floatingRect.y).not.toBe(640)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 520,
          clientY: 72,
        }),
      )
    })
  })

  it('shows the shared split ghost during a slotted console drag-out and only commits that split on pointerup', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'top', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
      useConsoleStore.getState().setFloatingRect({
        x: 64,
        y: 80,
        width: 720,
        height: 420,
      })
      useConsoleStore.getState().switchToDocked(false)
    })

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') !== 'workspace-slot-primary' &&
        element.getAttribute('data-workspace-surface-kind') === 'console',
    ) as HTMLDivElement | undefined
    const header = slotFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(slotFrame).not.toBeUndefined()
    expect(header).not.toBeNull()

    mockShellGeometry(container)
    mockRect(slotFrame, {
      left: 320,
      top: 0,
      width: 1120,
      height: 260,
    })
    mockElementSize(slotFrame, {
      width: 1120,
      height: 260,
    })
    mockRect(header, {
      left: 320,
      top: 0,
      width: 1120,
      height: 40,
    })
    mockRect(container?.querySelector('.ViewportFrame.isPrimarySlot .ViewportFrameBody'), {
      left: 320,
      top: 40,
      width: 1120,
      height: 860,
    })

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 3,
          clientX: 420,
          clientY: 24,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 3,
          clientX: 720,
          clientY: 904,
          buttons: 1,
        }),
      )
    })

    expect(container?.querySelector('.ViewportSplitDockGhost.isDockBottom')).not.toBeNull()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'console',
      ),
    ).toHaveLength(0)
    expect(useConsoleStore.getState().windowMode).toBe('floating')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 3,
          clientX: 720,
          clientY: 904,
        }),
      )
    })

    expect(container?.querySelector('.ViewportSplitDockGhost')).toBeNull()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'console',
      ),
    ).toHaveLength(1)
    expect(useConsoleStore.getState().windowMode).toBe('docked')
  })

  it('keeps the stored floating console size when a re-docked right split console is dragged back out', async () => {
    ;({ container, root } = await renderAppShell())

    let consoleSlotId: string | null = null
    await act(async () => {
      consoleSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
      useConsoleStore.getState().setFloatingRect({
        x: 64,
        y: 80,
        width: 720,
        height: 420,
      })
      useWorkspaceStore.getState().detachViewportSlotSurface(consoleSlotId ?? '', 'floating')
      useConsoleStore.getState().switchToFloating()
      splitWorkspaceSurfaceToSide('console-surface-1', 'right')
    })

    await rerenderAppShell(root!)

    const redockedConsoleSlotId =
      Object.values(useWorkspaceStore.getState().viewportSlotsById).find(
        (slot) => slot.surfaceKind === 'console' && slot.surfaceInstanceId === 'console-surface-1',
      )?.slotId ?? null
    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) => element.getAttribute('data-workspace-slot-id') === redockedConsoleSlotId,
    ) as HTMLDivElement | undefined
    const header = slotFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(slotFrame).not.toBeUndefined()
    expect(header).not.toBeNull()

    mockShellGeometry(container)
    mockRect(slotFrame, {
      left: 980,
      top: 0,
      width: 460,
      height: 900,
    })
    mockElementSize(slotFrame, {
      width: 460,
      height: 900,
    })
    mockRect(header, {
      left: 980,
      top: 0,
      width: 460,
      height: 40,
    })

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 2,
          clientX: 1040,
          clientY: 24,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          clientX: 900,
          clientY: 120,
        }),
      )
    })

    const repeatDragRect = useConsoleStore.getState().floatingRect
    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(useConsoleStore.getState().floatingRect.width).toBe(720)
    expect(useConsoleStore.getState().floatingRect.height).toBe(420)
    expect(useConsoleStore.getState().floatingRect.x).not.toBe(64)
    expect(repeatDragRect.x).toBeGreaterThan(250)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          clientX: 760,
          clientY: 220,
          buttons: 1,
        }),
      )
    })

    expect(useConsoleStore.getState().floatingRect.y).not.toBe(repeatDragRect.y)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          clientX: 900,
          clientY: 120,
        }),
      )
    })
  })

  it('suppresses the old docked console host while a console surface is already hosted in the slot tree', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
    })

    expect(container?.querySelectorAll('.ConsoleDockMock').length).toBe(1)
  })

  it('redocks a detached browser slot surface back into the slot tree when the compatibility host re-enters viewport split', async () => {
    ;({ container, root } = await renderAppShell())

    let browserSlotId: string | null = null
    await act(async () => {
      browserSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    expect(browserSlotId).toBeTruthy()

    await act(async () => {
      useWorkspaceStore.getState().detachViewportSlotSurface(browserSlotId ?? '', 'floating')
      useWorkspaceStore.getState().setBrowserFloating(true)
      useWorkspaceStore.getState().setBrowserViewportSplitDockSide('bottom')
      useWorkspaceStore.getState().setBrowserViewportSplit(true)
    })
    await rerenderAppShell(root!)

    const browserSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'browser',
    )
    expect(browserSlots).toHaveLength(1)
    expect(browserSlots[0]?.surfaceInstanceId).toBe('browser-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['browser-surface-1']).toBeUndefined()
    expect(useWorkspaceStore.getState().browserShell.isViewportSplit).toBe(false)
  })

  it('redocks a detached console slot surface back into the slot tree when the compatibility host docks', async () => {
    ;({ container, root } = await renderAppShell())

    let consoleSlotId: string | null = null
    await act(async () => {
      consoleSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
    })

    expect(consoleSlotId).toBeTruthy()

    await act(async () => {
      useWorkspaceStore.getState().detachViewportSlotSurface(consoleSlotId ?? '', 'popout')
      useConsoleStore.getState().switchToPopout()
      useConsoleStore.getState().switchToDocked()
    })
    await rerenderAppShell(root!)

    const consoleSlots = Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
      (slot) => slot.surfaceKind === 'console',
    )
    expect(consoleSlots).toHaveLength(1)
    expect(consoleSlots[0]?.surfaceInstanceId).toBe('console-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['console-surface-1']).toBeUndefined()
  })

  it('hydrates the shared workspace seam from the persisted last-layout snapshot on startup', async () => {
    const persistedEditorSurface = {
      ...createDefaultEditorWorkspaceSurfaceState('editor-viewport-1'),
      presentationMode: 'tiled' as const,
      windowMode: 'split view' as const,
      position: { x: 112, y: 44 },
      size: { width: 920, height: 610 },
      splitRatio: 0.62,
      splitDirection: 'vertical' as const,
      splitDockSide: 'right' as const,
      splitPriority: 'favorSecond' as const,
    }
    window.localStorage.setItem(
      workspaceLayoutStorageKey,
      JSON.stringify({
        version: 1,
        leftDockWidth: 404,
        isLeftDockViewportSplit: true,
        browserShell: {
          isCollapsed: true,
          isFloating: true,
          position: { x: 88, y: 132 },
          size: { width: 360, height: 520 },
        },
        primaryViewportId: 'model-viewer-primary',
        viewportChromeById: {
          'model-viewer-primary': {
            viewportId: 'model-viewer-primary',
            surfaceKind: 'modelViewer',
          },
        },
        editorSurfacePlacementById: {
          'editor-viewport-1': persistedEditorSurface,
        },
      }),
    )

    ;({ container, root } = await renderAppShell())

    const workspaceState = useWorkspaceStore.getState()
    expect(window.confirm).toHaveBeenCalledWith(
      'Restore your saved workspace layout? Click Cancel to start fresh.',
    )
    expect(workspaceState.leftDockWidth).toBe(404)
    expect(workspaceState.isLeftDockViewportSplit).toBe(true)
    expect(workspaceState.browserShell.isFloating).toBe(true)
    expect(workspaceState.browserShell.isCollapsed).toBe(true)
    expect(workspaceState.editorSurfacePlacementById['editor-viewport-1']?.windowMode).toBe(
      'split view',
    )
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith(
      'editor-viewport-1',
      persistedEditorSurface.position,
    )
    expect(currentSpaghettiState.setEditorViewportSize).toHaveBeenCalledWith(
      'editor-viewport-1',
      persistedEditorSurface.size,
    )
    expect(currentSpaghettiState.setEditorViewportSplitRatio).toHaveBeenCalledWith(
      'editor-viewport-1',
      persistedEditorSurface.splitRatio,
    )
    expect(currentSpaghettiState.setEditorViewportSplitDirection).toHaveBeenCalledWith(
      'editor-viewport-1',
      persistedEditorSurface.splitDirection,
    )
    expect(currentSpaghettiState.setEditorViewportSplitDockSide).toHaveBeenCalledWith(
      'editor-viewport-1',
      persistedEditorSurface.splitDockSide,
    )
    expect(currentSpaghettiState.setEditorViewportSplitPriority).toHaveBeenCalledWith(
      'editor-viewport-1',
      persistedEditorSurface.splitPriority,
    )
    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'expanded',
    )
  })

  it('starts fresh and overwrites the saved layout when startup restore is declined', async () => {
    window.localStorage.setItem(
      workspaceLayoutStorageKey,
      JSON.stringify({
        version: 1,
        leftDockWidth: 404,
        isLeftDockViewportSplit: true,
        browserShell: {
          isCollapsed: true,
          isFloating: true,
          position: { x: 88, y: 132 },
          size: { width: 360, height: 520 },
        },
        primaryViewportId: 'model-viewer-primary',
        viewportChromeById: {
          'model-viewer-primary': {
            viewportId: 'model-viewer-primary',
            surfaceKind: 'modelViewer',
          },
        },
        editorSurfacePlacementById: {},
      }),
    )
    window.confirm = vi.fn(() => false)

    ;({ container, root } = await renderAppShell())

    const workspaceState = useWorkspaceStore.getState()
    expect(window.confirm).toHaveBeenCalledWith(
      'Restore your saved workspace layout? Click Cancel to start fresh.',
    )
    expect(workspaceState.leftDockWidth).toBe(useWorkspaceStore.getInitialState().leftDockWidth)
    expect(workspaceState.isLeftDockViewportSplit).toBe(
      useWorkspaceStore.getInitialState().isLeftDockViewportSplit,
    )
    expect(workspaceState.browserShell.isFloating).toBe(false)
    expect(currentSpaghettiState.setEditorViewportPosition).not.toHaveBeenCalled()

    const persisted = JSON.parse(
      window.localStorage.getItem(workspaceLayoutStorageKey) ?? 'null',
    ) as Record<string, unknown> | null

    expect(persisted?.leftDockWidth).toBe(useWorkspaceStore.getInitialState().leftDockWidth)
    expect(persisted?.isLeftDockViewportSplit).toBe(false)
    expect(
      (persisted?.browserShell as { isFloating?: boolean } | undefined)?.isFloating,
    ).toBe(false)
  })

  it('persists shared workspace layout changes into the last-layout snapshot', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().setLeftDockWidth(392)
      useWorkspaceStore.getState().setLeftDockViewportSplit(true)
      useWorkspaceStore.getState().setBrowserFloating(true)
      useWorkspaceStore.getState().setBrowserFloatingPosition({ x: 73, y: 128 })
      useWorkspaceStore.getState().setBrowserFloatingSize({ width: 340, height: 600 })
    })

    const persisted = JSON.parse(
      window.localStorage.getItem(workspaceLayoutStorageKey) ?? 'null',
    ) as Record<string, unknown> | null

    expect(persisted).not.toBeNull()
    expect(persisted?.leftDockWidth).toBe(392)
    expect(persisted?.isLeftDockViewportSplit).toBe(true)
    expect(
      (persisted?.browserShell as { isFloating?: boolean } | undefined)?.isFloating,
    ).toBe(true)
    expect(
      (persisted?.browserShell as { position?: { x?: number; y?: number } } | undefined)?.position
        ?.x,
    ).toBe(73)
    expect(
      (persisted?.browserShell as { size?: { width?: number; height?: number } } | undefined)?.size
        ?.height,
    ).toBe(600)
  })

  it('highlights the floating spaghetti window when clicked and clears the highlight outside it', async () => {
    ;({ container, root } = await renderAppShell())

    const floatingShell = container?.querySelector('.SpaghettiFloatingWindow') as HTMLDivElement | null
    expect(floatingShell).not.toBeNull()
    expect(floatingShell?.classList.contains('isActiveWindow')).toBe(false)

    await act(async () => {
      floatingShell?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      )
    })

    expect(floatingShell?.classList.contains('isActiveWindow')).toBe(true)
    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('spaghetti')

    await act(async () => {
      document.body.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      )
    })

    expect(floatingShell?.classList.contains('isActiveWindow')).toBe(false)
  })

  it('publishes one spaghetti console handoff for a floating-shell click', async () => {
    ;({ container, root } = await renderAppShell())

    const floatingShell = container?.querySelector('.SpaghettiFloatingWindow') as HTMLDivElement | null
    expect(floatingShell).not.toBeNull()

    currentAppState.requestConsoleWorkspaceContextHandoff.mockClear()
    currentAppState.requestConsoleContextSync.mockClear()
    currentSpaghettiState.setActiveEditorViewportId.mockClear()

    await act(async () => {
      floatingShell?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      )
    })

    expect(currentSpaghettiState.setActiveEditorViewportId).toHaveBeenCalledTimes(1)
    expect(currentSpaghettiState.setActiveEditorViewportId).toHaveBeenCalledWith('editor-viewport-1')
    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledTimes(1)
    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'spaghetti',
      mode: 'graph',
      graphDocumentId: 'graph-document-1',
      nodeId: null,
      editorViewportId: 'editor-viewport-1',
      selectedTarget: null,
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledTimes(1)
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('surface-activation')
  })

  it('highlights the floating browser window and hands active highlight off from spaghetti', async () => {
    ;({ container, root } = await renderAppShell())

    const spaghettiShell = container?.querySelector('.SpaghettiFloatingWindow') as HTMLDivElement | null
    expect(spaghettiShell).not.toBeNull()

    await act(async () => {
      spaghettiShell?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      )
    })

    expect(spaghettiShell?.classList.contains('isActiveWindow')).toBe(true)

    mockShellGeometry(container)
    await undockBrowserFromDock(container)

    const browserShell = container?.querySelector('.BrowserFloatingWindow') as HTMLDivElement | null
    expect(browserShell).not.toBeNull()
    expect(browserShell?.classList.contains('isActiveWindow')).toBe(false)

    await act(async () => {
      browserShell?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      )
    })

    expect(browserShell?.classList.contains('isActiveWindow')).toBe(true)
    expect(spaghettiShell?.classList.contains('isActiveWindow')).toBe(false)
    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('browser')
  })

  it('activates the floating spaghetti highlight when a shared activation request targets it', async () => {
    ;({ container, root } = await renderAppShell())

    const floatingShell = container?.querySelector('.SpaghettiFloatingWindow') as HTMLDivElement | null
    expect(floatingShell).not.toBeNull()
    expect(floatingShell?.classList.contains('isActiveWindow')).toBe(false)

    await act(async () => {
      currentAppState.requestFloatingShellActivation('spaghetti')
      await rerenderAppShell(root!)
    })

    expect(floatingShell?.classList.contains('isActiveWindow')).toBe(true)
  })

  it('renders floating-window highlight from the shared active surface truth', async () => {
    ;({ container, root } = await renderAppShell())

    mockShellGeometry(container)
    await undockBrowserFromDock(container)

    const spaghettiShell = container?.querySelector('.SpaghettiFloatingWindow') as HTMLDivElement | null
    const browserShell = container?.querySelector('.BrowserFloatingWindow') as HTMLDivElement | null
    expect(spaghettiShell).not.toBeNull()
    expect(browserShell).not.toBeNull()

    await act(async () => {
      currentAppState.setActiveSurface('browser')
      await rerenderAppShell(root!)
    })

    expect(browserShell?.classList.contains('isActiveWindow')).toBe(true)
    expect(spaghettiShell?.classList.contains('isActiveWindow')).toBe(false)

    await act(async () => {
      currentAppState.setActiveSurface('spaghetti')
      await rerenderAppShell(root!)
    })

    expect(spaghettiShell?.classList.contains('isActiveWindow')).toBe(true)
    expect(browserShell?.classList.contains('isActiveWindow')).toBe(false)
  })

  it('treats a model viewport click as viewer activation and requests console root sync', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      currentAppState.setActiveSurface('spaghetti')
      await rerenderAppShell(root!)
    })

    const viewerSurface = container?.querySelector('.ViewportViewerSurface') as HTMLDivElement | null
    expect(viewerSurface).not.toBeNull()

    await act(async () => {
      viewerSurface?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
    })

    expect(currentAppState.workspaceSelection.activeSurface).toBe('viewer')
    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'viewer',
      mode: 'root',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: null,
    })
    expect(currentAppState.consoleWorkspaceContextHandoff).toMatchObject({
      sourceSurface: 'viewer',
      mode: 'root',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: null,
      seq: 1,
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith(
      'surface-clear',
      'viewer-activation',
    )
    expect(currentAppState.consoleContextSyncRequest?.reason).toBe('surface-clear')
    expect(currentAppState.consoleContextSyncRequest?.source).toBe('viewer-activation')
  })

  it('requests console root sync from a viewport click even when a shared selection already exists', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      currentAppState.setActiveSurface('spaghetti')
      currentAppState.setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      await rerenderAppShell(root!)
    })

    const viewerSurface = container?.querySelector('.ViewportViewerSurface') as HTMLDivElement | null
    expect(viewerSurface).not.toBeNull()

    await act(async () => {
      viewerSurface?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
    })

    expect(currentAppState.workspaceSelection.activeSurface).toBe('viewer')
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith(
      'surface-clear',
      'viewer-activation',
    )
    expect(currentAppState.consoleContextSyncRequest?.reason).toBe('surface-clear')
    expect(currentAppState.consoleContextSyncRequest?.source).toBe('viewer-activation')
  })

  it('does not request console root sync from a viewport click while sketch-plane pick is active', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      currentAppState.setActiveSurface('spaghetti')
      currentSpaghettiState = {
        ...currentSpaghettiState,
        sketchPlanePickSession: {
          nodeId: 'node-sketch-1',
          editorViewportId: 'editor-viewport-1',
          shouldRestoreViewportWindowMode: false,
          stage: 'pick',
          gizmoMode: 'translate',
          draftPlane: 'XY',
          draftTransform: {
            offsetMm: 0,
            translation: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            inPlaneRotationDeg: 0,
          },
        },
      }
      await rerenderAppShell(root!)
    })

    const viewerSurface = container?.querySelector('.ViewportViewerSurface') as HTMLDivElement | null
    expect(viewerSurface).not.toBeNull()

    await act(async () => {
      viewerSurface?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
    })

    expect(currentAppState.workspaceSelection.activeSurface).toBe('viewer')
    expect(currentAppState.requestConsoleContextSync).not.toHaveBeenCalledWith('surface-clear')
    expect(currentAppState.consoleContextSyncRequest?.reason).not.toBe('surface-clear')
  })

  it('does not clear docked browser surface ownership when browser becomes active', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      currentAppState.setActiveSurface('browser')
      await rerenderAppShell(root!)
    })

    expect(currentAppState.workspaceSelection.activeSurface).toBe('browser')
    expect(currentAppState.requestConsoleContextSync).not.toHaveBeenCalledWith('surface-clear')
  })

  it('does not request global-outside-click clear when clicking inside the docked browser panel', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      currentAppState.setActiveSurface('browser')
      await rerenderAppShell(root!)
    })

    currentAppState.requestConsoleContextSync.mockClear()
    const browserPanelRoot = document.createElement('div')
    browserPanelRoot.className = 'BrowserPanelRoot'
    const browserPanelBody = document.createElement('div')
    browserPanelBody.className = 'BrowserPanelBody'
    browserPanelRoot.appendChild(browserPanelBody)
    document.body.appendChild(browserPanelRoot)

    await act(async () => {
      browserPanelBody.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
    })

    expect(currentAppState.workspaceSelection.activeSurface).toBe('browser')
    expect(currentAppState.requestConsoleContextSync).not.toHaveBeenCalledWith(
      'surface-clear',
      'global-outside-click',
    )
    expect(currentAppState.consoleContextSyncRequest?.source).not.toBe('global-outside-click')

    browserPanelRoot.remove()
  })

  it('treats a split-host spaghetti click as activation of that editor viewport for console sync', async () => {
    const secondGraphDocumentId = currentSpaghettiState.createGraphDocument()
    const secondEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport(secondGraphDocumentId)

    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'spaghettiEditor',
        surfaceInstanceId: secondEditorViewportId,
      })
    })

    currentSpaghettiState.setActiveEditorViewportId.mockClear()
    currentAppState.requestConsoleContextSync.mockClear()

    const splitSpaghettiSurface = container?.querySelector(
      `.WorkspaceViewportSlotSurface--spaghetti[data-workspace-surface-instance-id="${secondEditorViewportId}"]`,
    ) as HTMLDivElement | null

    expect(splitSpaghettiSurface).not.toBeNull()

    await act(async () => {
      splitSpaghettiSurface?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
    })

    expect(currentSpaghettiState.setActiveEditorViewportId).toHaveBeenCalledWith(secondEditorViewportId)
    expect(currentSpaghettiState.activeEditorViewportId).toBe(secondEditorViewportId)
    expect(currentSpaghettiState.activeGraphDocumentId).toBe(secondGraphDocumentId)
    expect(currentAppState.workspaceSelection.activeSurface).toBe('spaghetti')
    expect(currentAppState.workspaceSelection.selectedTarget).toEqual({
      kind: 'graph-document',
      graphDocumentId: secondGraphDocumentId,
    })
    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'spaghetti',
      mode: 'graph',
      graphDocumentId: secondGraphDocumentId,
      nodeId: null,
      editorViewportId: secondEditorViewportId,
      selectedTarget: null,
    })
    expect(currentAppState.consoleWorkspaceContextHandoff).toMatchObject({
      sourceSurface: 'spaghetti',
      mode: 'graph',
      graphDocumentId: secondGraphDocumentId,
      nodeId: null,
      editorViewportId: secondEditorViewportId,
      selectedTarget: null,
      seq: 1,
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('surface-activation')
    expect(currentAppState.consoleContextSyncRequest?.reason).toBe('surface-activation')
  })

  it('resolves a split-host spaghetti click to the clicked viewport graph instead of stale ambient graph state', async () => {
    const secondGraphDocumentId = currentSpaghettiState.createGraphDocument()
    const secondEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport(secondGraphDocumentId)

    currentSpaghettiState.activeGraphDocumentId = 'graph-document-1'
    currentSpaghettiState.setActiveEditorViewportId = vi.fn((editorViewportId: string) => {
      const nextViewport = currentSpaghettiState.editorViewportsById[editorViewportId]
      if (nextViewport === undefined) {
        return
      }
      currentSpaghettiState.activeEditorViewportId = editorViewportId
    })

    ;({ container, root } = await renderAppShell())

    await act(async () => {
      splitWorkspaceSurfaceToSide(secondEditorViewportId, 'right', {
        targetSlotId: defaultPrimaryViewportSlotId,
      })
    })

    await rerenderAppShell(root!)

    const rightSpaghettiSurface = container?.querySelector(
      `.WorkspaceViewportSlotSurface--spaghetti[data-workspace-surface-instance-id="${secondEditorViewportId}"]`,
    ) as HTMLDivElement | null

    expect(rightSpaghettiSurface).not.toBeNull()

    await act(async () => {
      rightSpaghettiSurface?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
    })

    expect(currentAppState.consoleWorkspaceContextHandoff).toMatchObject({
      sourceSurface: 'spaghetti',
      mode: 'graph',
      graphDocumentId: secondGraphDocumentId,
      nodeId: null,
      editorViewportId: secondEditorViewportId,
    })
  })

  it('publishes a node-target spaghetti handoff from the clicked viewport when that viewport has a selected node', async () => {
    const secondGraphDocumentId = currentSpaghettiState.createGraphDocument()
    const secondEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport(secondGraphDocumentId)
    currentSpaghettiState.editorViewportSelectedNodeIdById = {
      ...currentSpaghettiState.editorViewportSelectedNodeIdById,
      [secondEditorViewportId]: 'node-2',
    }

    ;({ container, root } = await renderAppShell())

    await act(async () => {
      splitWorkspaceSurfaceToSide(secondEditorViewportId, 'right', {
        targetSlotId: defaultPrimaryViewportSlotId,
      })
    })

    await rerenderAppShell(root!)

    const rightSpaghettiSurface = container?.querySelector(
      `.WorkspaceViewportSlotSurface--spaghetti[data-workspace-surface-instance-id="${secondEditorViewportId}"]`,
    ) as HTMLDivElement | null

    expect(rightSpaghettiSurface).not.toBeNull()

    await act(async () => {
      rightSpaghettiSurface?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
    })

    expect(currentAppState.consoleWorkspaceContextHandoff).toMatchObject({
      sourceSurface: 'spaghetti',
      mode: 'node',
      graphDocumentId: secondGraphDocumentId,
      nodeId: 'node-2',
      editorViewportId: secondEditorViewportId,
    })
    expect(currentAppState.workspaceSelection.selectedTarget).toEqual({
      kind: 'graph-node',
      graphDocumentId: secondGraphDocumentId,
      nodeId: 'node-2',
    })
  })

  it('re-publishes split-host spaghetti activation from the frame header after docking into split mode', async () => {
    const secondGraphDocumentId = currentSpaghettiState.createGraphDocument()
    const secondEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport(secondGraphDocumentId)

    ;({ container, root } = await renderAppShell())

    await act(async () => {
      splitWorkspaceSurfaceToSide(secondEditorViewportId, 'right', {
        targetSlotId: defaultPrimaryViewportSlotId,
      })
    })

    await rerenderAppShell(root!)

    const rightSpaghettiSurface = container?.querySelector(
      `.WorkspaceViewportSlotSurface--spaghetti[data-workspace-surface-instance-id="${secondEditorViewportId}"]`,
    ) as HTMLDivElement | null
    const rightSpaghettiHeader = rightSpaghettiSurface?.closest('.ViewportFrame')?.querySelector(
      '.ViewportFrameHeader',
    ) as HTMLDivElement | null

    expect(rightSpaghettiSurface).not.toBeNull()
    expect(rightSpaghettiHeader).not.toBeNull()

    currentAppState.requestConsoleWorkspaceContextHandoff.mockClear()
    currentAppState.requestConsoleContextSync.mockClear()

    await act(async () => {
      rightSpaghettiHeader?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
    })

    expect(currentSpaghettiState.activeEditorViewportId).toBe(secondEditorViewportId)
    expect(currentSpaghettiState.activeGraphDocumentId).toBe(secondGraphDocumentId)
    expect(currentAppState.workspaceSelection.activeSurface).toBe('spaghetti')
    expect(currentAppState.consoleWorkspaceContextHandoff).toMatchObject({
      sourceSurface: 'spaghetti',
      mode: 'graph',
      graphDocumentId: secondGraphDocumentId,
      nodeId: null,
      editorViewportId: secondEditorViewportId,
      seq: 1,
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('surface-activation')

    await act(async () => {
      rightSpaghettiHeader?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
    })

    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledTimes(2)
    expect(currentAppState.consoleWorkspaceContextHandoff).toMatchObject({
      sourceSurface: 'spaghetti',
      mode: 'graph',
      graphDocumentId: secondGraphDocumentId,
      nodeId: null,
      editorViewportId: secondEditorViewportId,
      seq: 2,
    })
    expect(currentAppState.requestConsoleContextSync).not.toHaveBeenCalledWith('surface-clear')
  })

  it('does not request lost-spaghetti-visibility clear while a split-host spaghetti surface still exists', async () => {
    const secondGraphDocumentId = currentSpaghettiState.createGraphDocument()
    const secondEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport(secondGraphDocumentId)

    ;({ container, root } = await renderAppShell())

    await act(async () => {
      splitWorkspaceSurfaceToSide(secondEditorViewportId, 'right', {
        targetSlotId: defaultPrimaryViewportSlotId,
      })
      currentAppState.setActiveSurface('spaghetti')
      await rerenderAppShell(root!)
    })

    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) =>
          slot.surfaceKind === 'spaghettiEditor' &&
          slot.surfaceInstanceId === secondEditorViewportId,
      ),
    ).toBe(true)
    expect(currentAppState.workspaceSelection.activeSurface).toBe('spaghetti')
    expect(currentAppState.requestConsoleContextSync).not.toHaveBeenCalledWith(
      'surface-clear',
      'lost-spaghetti-visibility',
    )
  })

  it('re-publishes spaghetti console handoff from a nested split-host panel click after viewer activation', async () => {
    const secondGraphDocumentId = currentSpaghettiState.createGraphDocument()
    const secondEditorViewportId =
      currentSpaghettiState.openGraphDocumentInNewViewport(secondGraphDocumentId)

    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'spaghettiEditor',
        surfaceInstanceId: secondEditorViewportId,
      })
    })

    const viewerSurface = container?.querySelector('.ViewportViewerSurface') as HTMLDivElement | null
    const splitSpaghettiPanel = container?.querySelector(
      `.MockSpaghettiPanel[data-editor-viewport-id="${secondEditorViewportId}"]`,
    ) as HTMLDivElement | null

    expect(viewerSurface).not.toBeNull()
    expect(splitSpaghettiPanel).not.toBeNull()

    await act(async () => {
      viewerSurface?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
    })

    currentAppState.requestConsoleWorkspaceContextHandoff.mockClear()
    currentAppState.requestConsoleContextSync.mockClear()

    await act(async () => {
      splitSpaghettiPanel?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
    })

    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'spaghetti',
      mode: 'graph',
      graphDocumentId: secondGraphDocumentId,
      nodeId: null,
      editorViewportId: secondEditorViewportId,
      selectedTarget: null,
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('surface-activation')
  })

  it('publishes a fresh explicit console workspace handoff on repeated viewer clicks', async () => {
    ;({ container, root } = await renderAppShell())

    const viewerSurface = container?.querySelector('.ViewportViewerSurface') as HTMLDivElement | null
    expect(viewerSurface).not.toBeNull()

    await act(async () => {
      viewerSurface?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
    })

    expect(currentAppState.consoleWorkspaceContextHandoff?.seq).toBe(1)

    await act(async () => {
      viewerSurface?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
    })

    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledTimes(2)
    expect(currentAppState.consoleWorkspaceContextHandoff).toMatchObject({
      sourceSurface: 'viewer',
      mode: 'root',
      seq: 2,
    })
  })

  it('keeps the floating browser wrapper width pinned when the browser is undocked', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    await undockBrowserFromDock(container)

    const browserShell = container?.querySelector('.BrowserFloatingWindow') as HTMLDivElement | null
    expect(browserShell).not.toBeNull()
    expect(browserShell?.style.width).toBe('320px')
  })

  it('caps browser floating width from the dock host measurement path', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('.PrimaryViewportLeftDockPanelTarget--browser'), {
      left: 16,
      top: 88,
      width: 840,
      height: 840,
    })
    mockRect(container?.querySelector('[data-testid="browser-titlebar-docked"]')?.parentElement, {
      left: 16,
      top: 88,
      width: 840,
      height: 840,
    })
    await undockBrowserFromDock(container)

    const browserShell = container?.querySelector('.BrowserFloatingWindow') as HTMLDivElement | null
    expect(browserShell).not.toBeNull()
    expect(browserShell?.style.width).toBe('840px')
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
    let resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
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

  it('renders split view as a non-overlay horizontal layout by default', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())

    expect(container?.querySelector('.ViewportSplitLayout.isHorizontal')).not.toBeNull()
    expect(container?.querySelector('.ViewportSplitDivider')).not.toBeNull()
    expect((container?.querySelector('.PrimaryViewportLeftDock') as HTMLElement | null)?.style.bottom).toContain(
      'calc(',
    )
    expect(container?.textContent).toContain('Viewer Host')
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.querySelector('.SpaghettiFloatingDock')).toBeNull()
  })

  it('renders split view as a side-by-side layout when the viewport direction is vertical', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = {
      ...viewport('split view'),
      splitDirection: 'vertical',
    }

    ;({ container, root } = await renderAppShell())

    const splitLayout = container?.querySelector('.ViewportSplitLayout') as HTMLDivElement | null
    expect(splitLayout?.classList.contains('isVertical')).toBe(true)
    expect(splitLayout?.style.gridTemplateColumns).toContain('0.6fr 10px 0.4fr')
  })

  it('does not expose the old split-priority divider menu after split view migrates to the workspace tree', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())

    const divider = container?.querySelector('.ViewportSplitDivider') as HTMLButtonElement | null
    expect(divider).not.toBeNull()

    await act(async () => {
      divider?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.WorkspaceSplitMenu')).toBeNull()
    expect(currentSpaghettiState.setEditorViewportSplitPriority).not.toHaveBeenCalled()
  })

  it('opens the floating spaghetti titlebar context menu and creates a right workspace split', async () => {
    ;({ container, root } = await renderAppShell())

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(floatingTitleBar).not.toBeNull()

    await act(async () => {
      floatingTitleBar?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitGroup = container?.querySelector(
      '.PrimaryViewportLeftDockResizeMenuSubmenuGroup',
    ) as HTMLDivElement | null
    expect(splitGroup).not.toBeNull()
    const splitButton = splitGroup?.querySelector(
      '.PrimaryViewportLeftDockResizeMenuAction--submenu',
    ) as HTMLButtonElement | null
    expect(splitButton).not.toBeNull()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.WorkspaceSplitMenu button') ?? [],
    ).find(
      (button) => button.textContent === 'Split Right',
    )
    expect(splitRightButton).not.toBeNull()

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'expanded',
    )
    expect(currentSpaghettiState.setEditorViewportSplitDockSide).toHaveBeenCalledWith(
      'editor-viewport-1',
      'right',
    )
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === 'editor-viewport-1',
      ),
    ).toBe(true)
  })

  it('keeps the floating spaghetti split menu targeted at the editor that opened it even if the active editor changes', async () => {
    currentSpaghettiState.editorViewportOrder = ['editor-viewport-1', 'editor-viewport-2']
    currentSpaghettiState.editorViewportsById['editor-viewport-2'] = {
      ...viewport('expanded'),
      editorViewportId: 'editor-viewport-2',
      graphDocumentId: 'graph-document-1',
      isFocused: false,
      zOrder: 6,
      splitPriority: 'favorSecond',
    }

    ;({ container, root } = await renderAppShell())

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(floatingTitleBar).not.toBeNull()

    await act(async () => {
      floatingTitleBar?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      currentSpaghettiState.setActiveEditorViewportId('editor-viewport-2')
      await rerenderAppShell(root!)
    })

    const splitGroup = container?.querySelector(
      '.PrimaryViewportLeftDockResizeMenuSubmenuGroup',
    ) as HTMLDivElement | null
    expect(splitGroup).not.toBeNull()
    const splitButton = splitGroup?.querySelector(
      '.PrimaryViewportLeftDockResizeMenuAction--submenu',
    ) as HTMLButtonElement | null
    expect(splitButton).not.toBeNull()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.WorkspaceSplitMenu button') ?? [],
    ).find(
      (button) => button.textContent === 'Split Right',
    )
    expect(splitRightButton).not.toBeNull()

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'expanded',
    )
    expect(currentSpaghettiState.setEditorViewportSplitDockSide).toHaveBeenCalledWith(
      'editor-viewport-1',
      'right',
    )
    expect(currentSpaghettiState.setEditorViewportSplitDockSide).not.toHaveBeenCalledWith(
      'editor-viewport-2',
      'right',
    )
  })

  it('uses Split Right to keep a top-level console split intact while splitting only the model viewport pane', async () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'top', {
      surfaceKind: 'console',
      surfaceInstanceId: 'console-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(floatingTitleBar).not.toBeNull()

    await act(async () => {
      floatingTitleBar?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitGroup = container?.querySelector(
      '.PrimaryViewportLeftDockResizeMenuSubmenuGroup',
    ) as HTMLDivElement | null
    expect(splitGroup).not.toBeNull()
    const splitButton = splitGroup?.querySelector(
      '.PrimaryViewportLeftDockResizeMenuAction--submenu',
    ) as HTMLButtonElement | null
    expect(splitButton).not.toBeNull()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.WorkspaceSplitMenu button') ?? [],
    ).find(
      (button) => button.textContent === 'Split Right',
    )
    expect(splitRightButton).not.toBeNull()

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const workspaceState = useWorkspaceStore.getState()
    const rootNode = workspaceState.viewportLayoutNodesById[workspaceState.viewportSlotRootNodeId]
    const splitNodes = Object.values(workspaceState.viewportLayoutNodesById).filter(
      (node): node is Extract<(typeof workspaceState.viewportLayoutNodesById)[string], { kind: 'split' }> =>
        node.kind === 'split',
    )

    expect(rootNode?.kind).toBe('split')
    expect(rootNode?.kind === 'split' ? rootNode.splitDockSide : null).toBe('top')
    expect(splitNodes.filter((node) => node.splitDockSide === 'right')).toHaveLength(1)
  })

  it('shows the shared four-way floating split menu for the floating spaghetti header on right-click', async () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'top', {
      surfaceKind: 'console',
      surfaceInstanceId: 'console-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(floatingTitleBar).not.toBeNull()

    await act(async () => {
      floatingTitleBar?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const menuButtons = Array.from(
      container?.querySelectorAll('.WorkspaceSplitMenu button') ?? [],
    ).map((button) => button.textContent)

    expect(menuButtons.some((label) => label?.includes('Split'))).toBe(true)
    expect(menuButtons).toContain('Close')
  })

  it('locks the floating split submenu open when the split row is clicked', async () => {
    ;({ container, root } = await renderAppShell())

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(floatingTitleBar).not.toBeNull()

    await act(async () => {
      floatingTitleBar?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.PrimaryViewportLeftDockResizeMenuAction--submenu',
    ) as HTMLButtonElement | null
    expect(splitButton).not.toBeNull()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const splitGroup = container?.querySelector(
      '.PrimaryViewportLeftDockResizeMenuSubmenuGroup',
    ) as HTMLDivElement | null

    await act(async () => {
      splitGroup?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Split Top')
    expect(container?.textContent).toContain('Split Right')
  })

  it('opens the shared floating split menu for the floating console header on right-click', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useConsoleStore.getState().switchToFloating()
    })

    const floatingHeader = container?.querySelector(
      '.ConsoleFloatingWindow .ConsolePanelHeader',
    ) as HTMLDivElement | null
    expect(floatingHeader).not.toBeNull()

    await act(async () => {
      floatingHeader?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const menuButtons = Array.from(
      container?.querySelectorAll('.WorkspaceSplitMenu button') ?? [],
    ).map((button) => button.textContent)

    expect(menuButtons.some((label) => label?.includes('Split'))).toBe(true)
    expect(menuButtons).toContain('Close')
  })

  it('closes the floating console from the shared floating titlebar menu', async () => {
    ;({ container, root } = await renderAppShell())

    await act(async () => {
      useConsoleStore.getState().switchToFloating()
    })

    const floatingHeader = container?.querySelector(
      '.ConsoleFloatingWindow .ConsolePanelHeader',
    ) as HTMLDivElement | null
    expect(floatingHeader).not.toBeNull()

    await act(async () => {
      floatingHeader?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const closeButton = Array.from(
      container?.querySelectorAll('.WorkspaceSplitMenu button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Close') as HTMLButtonElement | undefined

    expect(closeButton).not.toBeUndefined()

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ConsoleFloatingWindow')).toBeNull()
  })

  it('migrates split view compatibility state onto a generic workspace divider instead of the old split shell', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())

    const divider = container?.querySelector('.ViewportSplitDivider') as HTMLButtonElement | null
    expect(divider).not.toBeNull()
    expect(container?.querySelector('.SpaghettiSplitWindow')).toBeNull()
  })

  it('does not revive the old split spaghetti title bar from compatibility state', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())

    const splitTitleBar = container?.querySelector('.SpaghettiSplitWindow .SpaghettiFloatingHandle')
    expect(splitTitleBar).toBeNull()
  })

  it('migrates split view compatibility state without exposing the old draggable split title bar', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('split view')

    ;({ container, root } = await renderAppShell())
    const splitTitleBar = container?.querySelector('.SpaghettiSplitWindow .SpaghettiFloatingHandle')
    expect(splitTitleBar).toBeNull()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === 'editor-viewport-1',
      ),
    ).toBe(true)
  })

  it('shows a bottom split ghost and docks the floating spaghetti editor into the workspace slot tree on release', async () => {
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
  })

  it('uses the full viewport width for the bottom split ghost even when left dock split is active', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('.SpaghettiFloatingDock .SpaghettiFloatingHandle'), {
      left: 420,
      top: 40,
      width: 340,
      height: 48,
    })

    const leftDockSplitButton = container?.querySelector(
      'button[aria-label="Toggle left dock viewport split"]',
    ) as HTMLButtonElement | null
    expect(leftDockSplitButton).not.toBeNull()

    await act(async () => {
      leftDockSplitButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })
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

    const ghost = container?.querySelector('.ViewportSplitDockGhost.isDockBottom') as HTMLDivElement | null
    expect(ghost).not.toBeNull()
    expect(ghost?.classList.contains('isLeftDockShifted')).toBe(false)
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

  it('lets the floating spaghetti editor cross left past the viewport boundary like the browser host', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('.SpaghettiFloatingDock .SpaghettiFloatingHandle'), {
      left: 344,
      top: 40,
      width: 340,
      height: 48,
    })

    const floatingTitleBar = container?.querySelector(
      '.SpaghettiFloatingDock .SpaghettiFloatingHandle',
    ) as HTMLDivElement | null
    expect(floatingTitleBar).not.toBeNull()

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
          clientX: 200,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 200,
          clientY: 120,
        }),
      )
    })

    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith(
      'editor-viewport-1',
      expect.objectContaining({
        x: -166,
        y: 88,
      }),
    )
  })

  it('renders meatball editor view in the left dock without the old parts list panel', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('meatball editor view')

    ;({ container, root } = await renderAppShell())

    expect(container?.textContent).not.toContain('Parts List Panel')
    expect(container?.textContent).not.toContain('Legacy Box Panel')
    expect(container?.querySelector('.SpaghettiMeatballHost')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiMeatballHost .SpaghettiFloatingHandle')).not.toBeNull()
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.querySelector('.SpaghettiFloatingDock')).toBeNull()
  })

  it('keeps the Browser docked while opening a child-window popout copy from the popout toggle', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const { popoutDocument, popoutWindow, dispatchBeforeUnload } = createMockChildWindow()
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    expect(container?.textContent).toContain('Browser Panel docked expanded')
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()

    const popoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Mock browser popout',
    )
    expect(popoutButton).not.toBeNull()

    await act(async () => {
      popoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(window.open).toHaveBeenCalled()
    expect(container?.textContent).toContain('Browser Panel docked expanded')
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
    expect(popoutDocument.body.querySelector('.PopupWorkspaceShell')).not.toBeNull()
    expect(popoutDocument.body.textContent).toContain('Browser Panel docked expanded')

    await act(async () => {
      dispatchBeforeUnload()
    })

    expect(container?.textContent).toContain('Browser Panel docked expanded')
    expect(container?.querySelector('.BrowserFloatingWindow')).toBeNull()
  })

  it('keeps a browser popout copy open after the original slotted browser slot is removed', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const { popoutDocument, popoutWindow } = createMockChildWindow()
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    let browserSlotId: string | null = null
    await act(async () => {
      browserSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    const slotPopoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Pop out Browser',
    ) as HTMLButtonElement | undefined
    expect(slotPopoutButton).not.toBeUndefined()

    await act(async () => {
      slotPopoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(popoutDocument.body.querySelector('.PopupWorkspaceShell')).not.toBeNull()
    expect(popoutDocument.body.textContent).toContain('Browser Panel docked expanded')
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter((slot) => slot.surfaceKind === 'browser'),
    ).toHaveLength(1)

    await act(async () => {
      useWorkspaceStore.getState().removeViewportSlot(browserSlotId ?? '')
    })

    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter((slot) => slot.surfaceKind === 'browser'),
    ).toHaveLength(0)
    expect(useWorkspaceStore.getState().browserShell.isPoppedOut).toBe(true)
    expect(popoutDocument.body.querySelector('.PopupWorkspaceShell')).not.toBeNull()
    expect(popoutDocument.body.textContent).toContain('Browser Panel docked expanded')
  })

  it('keeps a browser popout copy open while the original slotted browser is dragged out into floating mode', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const { popoutDocument, popoutWindow } = createMockChildWindow()
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'top', {
        surfaceKind: 'browser',
        surfaceInstanceId: 'browser-surface-1',
      })
    })

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') !== 'workspace-slot-primary' &&
        element.getAttribute('data-workspace-surface-kind') === 'browser',
    ) as HTMLDivElement | undefined
    const header = slotFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    const slotPopoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Pop out Browser',
    ) as HTMLButtonElement | undefined

    expect(slotFrame).not.toBeUndefined()
    expect(header).not.toBeNull()
    expect(slotPopoutButton).not.toBeUndefined()

    await act(async () => {
      slotPopoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useWorkspaceStore.getState().browserShell.isPoppedOut).toBe(true)
    expect(popoutDocument.body.querySelector('.PopupWorkspaceShell')).not.toBeNull()
    expect(popoutDocument.body.textContent).toContain('Browser Panel docked expanded')

    mockRect(slotFrame, {
      left: 320,
      top: 0,
      width: 1120,
      height: 320,
    })
    mockElementSize(slotFrame, {
      width: 1120,
      height: 320,
    })
    mockRect(header, {
      left: 320,
      top: 0,
      width: 1120,
      height: 40,
    })

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 1,
          clientX: 540,
          clientY: 24,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 620,
          clientY: 360,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 620,
          clientY: 360,
        }),
      )
    })

    expect(useWorkspaceStore.getState().browserShell.isFloating).toBe(true)
    expect(useWorkspaceStore.getState().browserShell.isPoppedOut).toBe(true)
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).filter(
        (slot) => slot.surfaceKind === 'browser',
      ),
    ).toHaveLength(0)
    expect(container?.querySelector('.BrowserFloatingWindow')).not.toBeNull()
    expect(
      container?.querySelector('.ViewportFrame[data-workspace-surface-kind="browser"]'),
    ).toBeNull()
    expect(popoutDocument.body.querySelector('.PopupWorkspaceShell')).not.toBeNull()
    expect(popoutDocument.body.textContent).toContain('Browser Panel docked expanded')
  })

  it('lets the user resize the full left dock width from the shared vertical handle', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const leftDock = container?.querySelector('.PrimaryViewportLeftDock') as HTMLElement | null
    let resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
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

    let resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
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

    const leftDock = container?.querySelector('.PrimaryViewportLeftDock') as HTMLElement | null
    let resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
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

    const resetButton = Array.from(
      container?.querySelectorAll('.PrimaryViewportLeftDockResizeMenuAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Default Width') as
      | HTMLButtonElement
      | undefined
    expect(resetButton).not.toBeUndefined()

    await act(async () => {
      resetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(leftDock?.style.width).toBe('320px')
  })

  it('lets the resize handle menu split the viewport from the left dock edge', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
    expect(resizeHandle).not.toBeNull()

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

    const splitButton = Array.from(
      container?.querySelectorAll('.PrimaryViewportLeftDockResizeMenuAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Split Viewport') as
      | HTMLButtonElement
      | undefined
    expect(splitButton).not.toBeUndefined()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const workspaceState = useWorkspaceStore.getState()
    const rootNode = workspaceState.viewportLayoutNodesById[workspaceState.viewportSlotRootNodeId]
    expect(rootNode?.kind).toBe('split')
    expect(rootNode?.kind === 'split' ? rootNode.splitDockSide : null).toBe('left')
    const leftSlotNode =
      rootNode?.kind === 'split'
        ? workspaceState.viewportLayoutNodesById[rootNode.firstChildId]
        : null
    expect(leftSlotNode?.kind).toBe('leaf')
    expect(
      leftSlotNode?.kind === 'leaf'
        ? workspaceState.viewportSlotsById[leftSlotNode.slotId]?.surfaceKind
        : null,
    ).toBe('browser')
  })

  it('lets the resize-bar toggle button switch left dock viewport split on and off', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    let splitToggle = Array.from(container?.querySelectorAll('button') ?? []).find(
      (element) => element.getAttribute('aria-label') === 'Toggle left dock viewport split',
    ) as HTMLButtonElement | undefined
    let resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
    expect(splitToggle).not.toBeUndefined()
    expect(resizeHandle?.classList.contains('isViewportSplit')).toBe(false)
    expect(splitToggle?.classList.contains('isSlotSplitActive')).toBe(false)

    await act(async () => {
      splitToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    let workspaceState = useWorkspaceStore.getState()
    let rootNode = workspaceState.viewportLayoutNodesById[workspaceState.viewportSlotRootNodeId]
    resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
    expect(rootNode?.kind).toBe('split')
    expect(rootNode?.kind === 'split' ? rootNode.splitDockSide : null).toBe('left')
    expect(resizeHandle?.classList.contains('isViewportSplit')).toBe(false)
    expect(resizeHandle?.classList.contains('isSlotSplitActive')).toBe(true)

    splitToggle = Array.from(container?.querySelectorAll('button') ?? []).find(
      (element) => element.getAttribute('aria-label') === 'Toggle left dock viewport split',
    ) as HTMLButtonElement | undefined
    expect(splitToggle?.classList.contains('isSlotSplitActive')).toBe(true)

    await act(async () => {
      splitToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    workspaceState = useWorkspaceStore.getState()
    rootNode = workspaceState.viewportLayoutNodesById[workspaceState.viewportSlotRootNodeId]
    resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
    splitToggle = Array.from(container?.querySelectorAll('button') ?? []).find(
      (element) => element.getAttribute('aria-label') === 'Toggle left dock viewport split',
    ) as HTMLButtonElement | undefined
    expect(rootNode?.kind).toBe('leaf')
    expect(resizeHandle?.classList.contains('isViewportSplit')).toBe(false)
    expect(resizeHandle?.classList.contains('isSlotSplitActive')).toBe(false)
    expect(splitToggle?.classList.contains('isSlotSplitActive')).toBe(false)
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

    await undockBrowserFromDock(container)

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

  it('keeps a floating browser inside the primary model viewport body instead of letting it slide under the title bar', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('.ViewportFrame.isPrimarySlot .ViewportFrameBody'), {
      left: 320,
      top: 56,
      width: 1120,
      height: 844,
    })

    await undockBrowserFromDock(container)

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
          clientX: 280,
          clientY: 0,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 280,
          clientY: 0,
        }),
      )
    })

    expect(useWorkspaceStore.getState().browserShell.position.y).toBe(56)
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
      container
        ?.querySelector('.PrimaryViewportLeftDockPanelTarget--meatball-editor')
        ?.classList.contains('isPreviewActive'),
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

  it('moves the spaghetti first button to the far left and cycles minus, essentials, and plus', async () => {
    ;({ container, root } = await renderAppShell())

    const titleBar = container?.querySelector('.SpaghettiFloatingHandle') as HTMLDivElement | null
    const title = titleBar?.querySelector('.SpaghettiFloatingHandleTitle') as HTMLSpanElement | null
    const collapseButton = title?.previousElementSibling as HTMLButtonElement | null

    expect(collapseButton?.getAttribute('aria-label')).toBe('Switch editor to essentials mode')
    expect(collapseButton?.textContent).toBe('-')
    expect(collapseButton?.getAttribute('aria-expanded')).toBe('true')
    expect(container?.textContent).toContain('header-expanded')
    expect(container?.textContent).toContain('canvas-toolbar-visible')

    await act(async () => {
      collapseButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await rerenderAppShell(root!)

    expect(currentSpaghettiState.setEditorViewportWindowMode).not.toHaveBeenCalledWith(
      'editor-viewport-1',
      'collapsed',
    )
    expect(container?.textContent).toContain('header-collapsed')
    expect(container?.textContent).toContain('canvas-toolbar-hidden')

    await rerenderAppShell(root!)

    const essentialsButton = container?.querySelector(
      '.SpaghettiFloatingHandle--essentials .SpaghettiWindowAction--collapse',
    ) as HTMLButtonElement | null

    expect(essentialsButton?.getAttribute('aria-label')).toBe(
      'Collapse editor from essentials mode',
    )
    expect(essentialsButton?.textContent).toBe('e')
    expect(essentialsButton?.getAttribute('aria-expanded')).toBe('true')

    await act(async () => {
      essentialsButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenCalledWith(
      'editor-viewport-1',
      'collapsed',
    )

    await rerenderAppShell(root!)

    const collapsedTitleBar = container?.querySelector('.SpaghettiFloatingHandle') as HTMLDivElement | null
    const collapsedTitle = collapsedTitleBar?.querySelector(
      '.SpaghettiFloatingHandleTitle',
    ) as HTMLSpanElement | null
    const expandButton = collapsedTitle?.previousElementSibling as HTMLButtonElement | null

    expect(expandButton?.getAttribute('aria-label')).toBe('Restore expanded editor')
    expect(expandButton?.textContent).toBe('+')
    expect(expandButton?.getAttribute('aria-expanded')).toBe('false')

    await act(async () => {
      expandButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(currentSpaghettiState.setEditorViewportWindowMode).toHaveBeenLastCalledWith(
      'editor-viewport-1',
      'expanded',
    )

    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('expanded')

    await rerenderAppShell(root!)

    expect(container?.textContent).toContain('header-expanded')
    expect(container?.textContent).toContain('canvas-toolbar-visible')
  })

  it('no longer renders the spaghetti graph picker in the titlebar', async () => {
    ;({ container, root } = await renderAppShell())

    const titlebarGraphPicker = container?.querySelector(
      '.SpaghettiFloatingHandleGraph .ParaSelectNative[aria-label="Graph"]',
    ) as HTMLSelectElement | null

    expect(titlebarGraphPicker).toBeNull()
  })

  it('keeps the titlebar build button after moving the graph picker out of the titlebar', async () => {
    ;({ container, root } = await renderAppShell())

    const buildButton = container?.querySelector(
      '.SpaghettiFloatingHandleActions .SpaghettiWindowAction--build',
    ) as HTMLButtonElement | null

    expect(buildButton).not.toBeNull()
    expect(buildButton?.getAttribute('aria-label')).toBe('Compile and build graph')
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

    await rerenderAppShell(root!)

    expect(container?.textContent).toContain('canvas-toolbar-hidden')
  })

  it('consumes a supported SoundCloud radio burst request and updates runtime status through the app-level bridge', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().turnRadioOn()
      useAudioSamplerStore.getState().requestRadioBurst('Console.Root.Radio', 'enter')
    })

    expect(useAudioSamplerStore.getState().lastHandledBurstRequestId).toBe(1)
    expect(useAudioSamplerStore.getState().radioRuntimeStatus).toBe('ready')
    expect(useAudioSamplerStore.getState().radioRuntimeSourceKind).toBe('soundcloud-widget')
    expect(useAudioSamplerStore.getState().radioRuntimeMessage).toBeNull()
    expect(mockSoundCloudEnsureSourceReady).toHaveBeenCalledTimes(2)
    expect(mockSoundCloudPlayWindow).toHaveBeenCalledTimes(1)
  })

  it('refreshes limited waveform state for the active SoundCloud source', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().turnRadioOn()
      useAudioSamplerStore.getState().setRadioRuntimeState({
        status: 'ready',
        sourceKind: 'soundcloud-widget',
      })
      useAudioSamplerStore.getState().setRadioTransportState({
        currentTimeSec: 12,
        durationSec: 120,
        isSeekable: true,
        isPlaying: true,
      })
    })

    expect(useAudioSamplerStore.getState().radioWaveform.kind).toBe('limited')
    expect(useAudioSamplerStore.getState().radioWaveform.sourceKind).toBe('soundcloud-widget')
    expect(useAudioSamplerStore.getState().radioWaveform.message).toBe(
      'Detailed waveform unavailable for current source',
    )
  })

  it('refreshes exact waveform state for the generated-tone runtime source', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().turnRadioOn()
      useAudioSamplerStore.getState().setRadioRuntimeState({
        status: 'fallback',
        sourceKind: 'generated-tone',
      })
    })

    expect(useAudioSamplerStore.getState().radioWaveform.kind).toBe('exact')
    expect(useAudioSamplerStore.getState().radioWaveform.sourceKind).toBe('generated-tone')
    expect(useAudioSamplerStore.getState().radioWaveform.samples.length).toBeGreaterThan(0)
  })

  it('marks unsupported custom radio urls explicitly instead of pretending they played', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().setRadioUrl('https://example.com/not-supported')
      useAudioSamplerStore.getState().requestRadioBurst('Console.Root.Radio', 'enter')
    })

    expect(useAudioSamplerStore.getState().lastHandledBurstRequestId).toBe(1)
    expect(useAudioSamplerStore.getState().radioRuntimeStatus).toBe('unsupported')
    expect(useAudioSamplerStore.getState().radioRuntimeSourceKind).toBe('unsupported-url')
    expect(useAudioSamplerStore.getState().radioRuntimeMessage).toBe(
      'Radio url is not supported yet: https://example.com/not-supported',
    )
    expect(mockSoundCloudEnsureSourceReady).not.toHaveBeenCalled()
  })

  it('falls back to the generated tone bridge if SoundCloud playback fails at runtime', async () => {
    mockSoundCloudPlaybackMode = 'throw'
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().turnRadioOn()
      useAudioSamplerStore.getState().requestRadioBurst('Console.Root.Radio', 'enter')
    })

    expect(useAudioSamplerStore.getState().radioRuntimeStatus).toBe('fallback')
    expect(useAudioSamplerStore.getState().radioRuntimeSourceKind).toBe('generated-tone')
    expect(useAudioSamplerStore.getState().radioRuntimeMessage).toBe(
      'SoundCloud playback unavailable, using fallback generated tone',
    )
  })

  it('renders the radio panel when the toolbar is opened and hides it when closed', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().openRadioToolbar()
    })

    expect(container?.querySelector('.RadioPanel')).not.toBeNull()

    await act(async () => {
      useAudioSamplerStore.getState().closeRadioToolbar()
    })

    expect(container?.querySelector('.RadioPanel')).toBeNull()
  })

  it('renders only the merged radio toolbar surface when the toolbar is opened', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().openRadioToolbar()
    })

    expect(container?.querySelector('.RadioPanel')).not.toBeNull()
    expect(container?.querySelector('.AudioSamplerPanel')).toBeNull()
  })

  it('consumes sampler step preview requests through the shared radio runtime path', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().turnRadioOn()
      useAudioSamplerStore.getState().setSampleBurstTime(0.1)
      useAudioSamplerStore.getState().setSamplerBpm(120)
      useAudioSamplerStore.getState().setRadioRuntimeState({
        status: 'ready',
        sourceKind: 'soundcloud-widget',
      })
      const firstStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''
      useAudioSamplerStore.getState().setSamplerStepPlaybackShape(firstStepId, {
        startScoochSec: 0.05,
        endScoochSec: 0.1,
      })
      useAudioSamplerStore.getState().requestSamplerStepPreview(firstStepId)
    })

    expect(useAudioSamplerStore.getState().lastHandledSamplerStepPreviewRequestId).toBe(1)
    expect(useAudioSamplerStore.getState().radioRuntimeSourceKind).toBe('soundcloud-widget')
    const samplerPreviewCalls = mockSoundCloudPlayWindow.mock.calls as unknown as Array<
      [{ durationSec: number }]
    >
    const latestSamplerPreviewWindow = samplerPreviewCalls.at(-1)?.[0] ?? null
    expect(latestSamplerPreviewWindow?.durationSec).toBeCloseTo(0.35, 5)
  })

  it('advances the sampler playhead through the app-level loop using the current radio source', async () => {
    vi.useFakeTimers()
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().turnRadioOn()
      useAudioSamplerStore.getState().setRadioRuntimeState({
        status: 'fallback',
        sourceKind: 'generated-tone',
      })
      useAudioSamplerStore.getState().setSamplerStepCount(4)
      useAudioSamplerStore.getState().setSamplerBpm(120)
      useAudioSamplerStore.getState().playSampler()
    })

    expect(useAudioSamplerStore.getState().samplerPlayheadStepIndex).toBe(0)

    await act(async () => {
      vi.advanceTimersByTime(520)
    })

    expect(useAudioSamplerStore.getState().samplerPlayheadStepIndex).toBe(1)
    expect(useAudioSamplerStore.getState().radioRuntimeSourceKind).toBe('generated-tone')

    await act(async () => {
      useAudioSamplerStore.getState().stopSampler()
      vi.runOnlyPendingTimers()
    })

    vi.useRealTimers()
  })
})
