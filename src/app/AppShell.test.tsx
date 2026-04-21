// @vitest-environment jsdom

import { act, useLayoutEffect, type MouseEvent as ReactMouseEvent } from 'react'
import { useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dashboardStorageKey } from './dashboard/dashboardPersistence'
import { useDashboardStore } from './dashboard/useDashboardStore'
import { notepadStorageKey } from './notepad/notepadPersistence'
import { useNotepadStore } from './notepad/useNotepadStore'
import { useConsoleStore } from './console/useConsoleStore'
import {
  RADIO_SUPPORT_PROFILE,
  resetAudioSamplerStore,
  useAudioSamplerStore,
} from './store/audioSamplerStore'
import { useUiPrefsStore, type WorkspaceStartupSurface } from './store/uiPrefsStore'
import { consumeQueuedViewerCameraPose, setViewer } from './viewerBridge'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import {
  workspaceLayoutStorageKey,
} from './workspace/workspacePersistence'
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
const originalWindowPrompt = window.prompt
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
  store.subscribe = () => () => undefined
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
    selectGraphBrowserStorageWorkingSetSnapshot: (state: any) => ({
      version: 1,
      graphDocumentsById: state.graphDocumentsById ?? {},
      graphDocumentOrder: state.graphDocumentOrder ?? [],
      activeGraphDocumentId: state.activeGraphDocumentId ?? null,
    }),
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
    reserveBottomConsoleBar = false,
    onViewportContextMenu,
  }: {
    viewportId: string
    onActivateViewerSurface: (viewportId: string) => void
    reserveBottomConsoleBar?: boolean
    onViewportContextMenu?: (
      viewportId: string,
      event: ReactMouseEvent<HTMLDivElement>,
    ) => void
  }) => (
    <div
      className="ViewportWorkspaceHost"
      data-workspace-viewport-id={viewportId}
      data-bottom-console-bar-reserved={reserveBottomConsoleBar ? 'true' : 'false'}
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

const renderAppShell = async (workspaceStartupSurface: WorkspaceStartupSurface = 'modelViewer') => {
  useUiPrefsStore.getState().setWorkspaceStartupSurface(workspaceStartupSurface)
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

const expectStickyNoteToRenderAbove = (
  container: HTMLDivElement | null,
  laneId: string,
  noteId: string,
  noteBelowId: string,
) => {
  const laneSurface = container?.querySelector(
    `[data-dashboard-lane-board="${laneId}"] .DashboardSurfaceLaneStage`,
  )
  expect(laneSurface).not.toBeNull()
  const renderedNotes = Array.from(
    laneSurface?.querySelectorAll('.DashboardStickyNote') ?? [],
  ) as HTMLElement[]
  const noteIndex = renderedNotes.findIndex((element) => element.dataset.noteId === noteId)
  const noteBelowIndex = renderedNotes.findIndex((element) => element.dataset.noteId === noteBelowId)
  expect(noteIndex).toBeGreaterThanOrEqual(0)
  expect(noteBelowIndex).toBeGreaterThanOrEqual(0)
  expect(noteIndex).toBeGreaterThan(noteBelowIndex)
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
    useDashboardStore.setState(useDashboardStore.getInitialState(), true)
    useNotepadStore.setState(useNotepadStore.getInitialState(), true)
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    resetAudioSamplerStore()
    window.localStorage.clear()
    window.confirm = vi.fn(() => true)
    window.prompt = vi.fn(() => 'New lane')
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
      referenceWorkspace: {
        importedReferencesById: {},
        importedReferenceOrder: [],
      },
      floatingShellActivationRequest: null,
      consoleContextSyncRequest: null,
      consoleWorkspaceContextHandoff: null,
      addImportedReference: vi.fn(),
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
    window.prompt = originalWindowPrompt
    window.open = originalWindowOpen
    window.AudioContext = originalAudioContext
    setViewer('model-viewer-primary', null)
    setViewer('model-viewer-workspace-slot-2', null)
    setViewer('model-viewer-detached-1', null)
  })

  it('renders a true header-only shell in collapsed mode', async () => {
    currentSpaghettiState.editorViewportsById['editor-viewport-1'] = viewport('collapsed')

    ;({ container } = await renderAppShell())

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

  it('mounts the docked console in the app-shell console row without viewport-local bottom reservation', async () => {
    ;({ container, root } = await renderAppShell())

    const getPrimaryHost = () =>
      container?.querySelector(
        '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-primary"]',
      ) as HTMLDivElement | null
    const consoleRow = container?.querySelector(
      '.AppShellConsoleRow[data-app-shell-console-row="true"]',
    ) as HTMLElement | null

    expect(consoleRow).not.toBeNull()
    expect(consoleRow?.querySelector('.ConsoleDockMock')).not.toBeNull()
    expect(getPrimaryHost()?.dataset.bottomConsoleBarReserved).toBe('false')

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-secondary',
      })
    })

    const secondaryHost = container?.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-secondary"]',
    ) as HTMLDivElement | null
    expect(secondaryHost?.dataset.bottomConsoleBarReserved).toBe('false')

    await act(async () => {
      useConsoleStore.setState((state) => ({
        ...state,
        windowMode: 'floating',
      }))
    })

    expect(getPrimaryHost()?.dataset.bottomConsoleBarReserved).toBe('false')

    await act(async () => {
      useConsoleStore.setState((state) => ({
        ...state,
        windowMode: 'popout',
      }))
    })

    expect(getPrimaryHost()?.dataset.bottomConsoleBarReserved).toBe('false')

    await act(async () => {
      useConsoleStore.setState((state) => ({
        ...state,
        windowMode: 'docked',
      }))
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-reserved-test',
      })
    })

    expect(getPrimaryHost()?.dataset.bottomConsoleBarReserved).toBe('false')
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

  it('keeps the primary left dock panel stack constrained even before the primary viewport is split', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

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
        clipRangeMode: 'auto',
        clipStart: 0.1,
        clipEnd: 1000,
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
      clipRangeMode: 'auto',
    })
    expect(secondaryQueuedPose).toMatchObject({
      projectionMode: 'perspective',
      perspectiveFovDeg: 55,
      orthoViewHeight: 12,
      clipRangeMode: 'auto',
    })
    expect(applyCameraPose).toHaveBeenCalledWith(
      expect.objectContaining({
        projectionMode: 'perspective',
        perspectiveFovDeg: 55,
        orthoViewHeight: 12,
        clipRangeMode: 'auto',
      }),
    )
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) => entry.text === 'User selected: Model Viewport 1 > Split Right',
        ),
    ).toBe(true)
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
    expect(quickDockButton?.getAttribute('aria-label')).toBe('Quick Dock')
    expect(quickDockButton?.classList.contains('FloatingWindowHeaderAction')).toBe(true)
    expect(quickDockButton?.querySelector('svg')).not.toBeNull()
    expect(quickDockButton?.textContent?.trim()).toBe('')

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

  it('switches a non-primary slot into dashboard from the viewport type picker', async () => {
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

    const dashboardAction = Array.from(
      container?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Dashboard') as HTMLButtonElement | undefined

    expect(dashboardAction).not.toBeUndefined()

    await act(async () => {
      dashboardAction?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await rerenderAppShell(root!)

    const replacedSlot = browserSlotId === null ? null : useWorkspaceStore.getState().viewportSlotsById[browserSlotId]
    expect(replacedSlot?.surfaceKind).toBe('dashboard')
    expect(replacedSlot?.surfaceInstanceId).toBe(`dashboard-${browserSlotId}`)
    expect(container?.textContent).toContain('Dashboard')
  })

  it('switches a non-primary slot into notepad from the viewport type picker', async () => {
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

    const notepadAction = Array.from(
      container?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Notepad') as HTMLButtonElement | undefined

    expect(notepadAction).not.toBeUndefined()

    await act(async () => {
      notepadAction?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await rerenderAppShell(root!)

    const replacedSlot =
      browserSlotId === null ? null : useWorkspaceStore.getState().viewportSlotsById[browserSlotId]
    expect(replacedSlot?.surfaceKind).toBe('notepad')
    expect(replacedSlot?.surfaceInstanceId).toBe(`notepad-${browserSlotId}`)
    expect(container?.textContent).toContain('Focused notes land here')
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

  it('renders a detached floating dashboard surface and quick docks it back', async () => {
    ;({ container, root } = await renderAppShell())

    let dashboardSlotId: string | null = null
    await act(async () => {
      dashboardSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'dashboard',
        surfaceInstanceId: 'dashboard-surface-1',
      })
    })

    await act(async () => {
      useWorkspaceStore.getState().detachViewportSlotSurface(dashboardSlotId ?? '', 'floating')
    })
    await rerenderAppShell(root!)

    const floatingDashboard = container?.querySelector(
      '.DashboardFloatingWindow[data-workspace-surface-instance-id="dashboard-surface-1"]',
    ) as HTMLDivElement | null
    expect(floatingDashboard).not.toBeNull()
    expect(floatingDashboard?.textContent).toContain('Floating Dashboard')
    expect(
      floatingDashboard?.querySelector('[data-dashboard-lane-add-note-button="todo"]'),
    ).not.toBeNull()

    const quickDockButton = floatingDashboard?.querySelector(
      '.DashboardFloatingWindowQuickDock',
    ) as HTMLButtonElement | null
    expect(quickDockButton).not.toBeNull()
    expect(quickDockButton?.getAttribute('aria-label')).toBe('Quick Dock')
    expect(quickDockButton?.classList.contains('FloatingWindowHeaderAction')).toBe(true)
    expect(quickDockButton?.querySelector('svg')).not.toBeNull()
    expect(quickDockButton?.textContent?.trim()).toBe('')

    await act(async () => {
      quickDockButton?.click()
    })
    await rerenderAppShell(root!)

    expect(
      container?.querySelector('.DashboardFloatingWindow[data-workspace-surface-instance-id="dashboard-surface-1"]'),
    ).toBeNull()
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['dashboard-surface-1']).toBeUndefined()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'dashboard' && slot.surfaceInstanceId === 'dashboard-surface-1',
      ),
    ).toBe(true)
  })

  it('pops out a dashboard slot into a child window and quick docks it back', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const { popoutDocument, popoutWindow } = createMockChildWindow()
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'dashboard',
        surfaceInstanceId: 'dashboard-surface-1',
      })
    })

    const slotPopoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Pop out Dashboard',
    ) as HTMLButtonElement | undefined
    expect(slotPopoutButton).not.toBeUndefined()

    await act(async () => {
      slotPopoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(window.open).toHaveBeenCalled()
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['dashboard-surface-1']?.hostMode).toBe(
      'popout',
    )
    expect(popoutDocument.body.textContent).toContain('Dashboard')
    expect(
      popoutDocument.body.querySelector('[data-dashboard-lane-add-note-button="todo"]'),
    ).not.toBeNull()

    const quickDockButton = popoutDocument.body.querySelector(
      '.DashboardPopoutWindowQuickDock',
    ) as HTMLButtonElement | null
    expect(quickDockButton).not.toBeNull()

    await act(async () => {
      quickDockButton?.click()
    })
    await rerenderAppShell(root!)

    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['dashboard-surface-1']).toBeUndefined()
    expect(popoutWindow.close).toHaveBeenCalled()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'dashboard' && slot.surfaceInstanceId === 'dashboard-surface-1',
      ),
    ).toBe(true)
  })

  it('renders a detached floating notepad surface and quick docks it back', async () => {
    ;({ container, root } = await renderAppShell())

    let notepadSlotId: string | null = null
    await act(async () => {
      notepadSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'notepad',
        surfaceInstanceId: 'notepad-surface-1',
      })
    })

    await act(async () => {
      useWorkspaceStore.getState().detachViewportSlotSurface(notepadSlotId ?? '', 'floating')
    })
    await rerenderAppShell(root!)

    const floatingNotepad = container?.querySelector(
      '.NotepadFloatingWindow[data-workspace-surface-instance-id="notepad-surface-1"]',
    ) as HTMLDivElement | null
    expect(floatingNotepad).not.toBeNull()
    expect(floatingNotepad?.textContent).toContain('Floating Notepad')
    expect(floatingNotepad?.textContent).toContain('Focused notes land here')

    const quickDockButton = floatingNotepad?.querySelector(
      '.NotepadFloatingWindowQuickDock',
    ) as HTMLButtonElement | null
    expect(quickDockButton).not.toBeNull()
    expect(quickDockButton?.getAttribute('aria-label')).toBe('Quick Dock')
    expect(quickDockButton?.classList.contains('FloatingWindowHeaderAction')).toBe(true)
    expect(quickDockButton?.querySelector('svg')).not.toBeNull()
    expect(quickDockButton?.textContent?.trim()).toBe('')

    await act(async () => {
      quickDockButton?.click()
    })
    await rerenderAppShell(root!)

    expect(
      container?.querySelector('.NotepadFloatingWindow[data-workspace-surface-instance-id="notepad-surface-1"]'),
    ).toBeNull()
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['notepad-surface-1']).toBeUndefined()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'notepad' && slot.surfaceInstanceId === 'notepad-surface-1',
      ),
    ).toBe(true)
  })

  it('renders a detached floating catalog surface and quick docks it back', async () => {
    ;({ container, root } = await renderAppShell())

    let catalogSlotId: string | null = null
    await act(async () => {
      catalogSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'catalog',
        surfaceInstanceId: 'catalog-surface-1',
      })
    })

    await act(async () => {
      useWorkspaceStore.getState().detachViewportSlotSurface(catalogSlotId ?? '', 'floating')
    })
    await rerenderAppShell(root!)

    const floatingCatalog = container?.querySelector(
      '.CatalogFloatingWindow[data-workspace-surface-instance-id="catalog-surface-1"]',
    ) as HTMLDivElement | null
    expect(floatingCatalog).not.toBeNull()
    expect(floatingCatalog?.textContent).toContain('Floating Catalog')
    expect(floatingCatalog?.textContent).toContain('Catalog workspace foundation is live')

    const quickDockButton = floatingCatalog?.querySelector(
      '.CatalogFloatingWindowQuickDock',
    ) as HTMLButtonElement | null
    expect(quickDockButton).not.toBeNull()
    expect(quickDockButton?.getAttribute('aria-label')).toBe('Quick Dock')
    expect(quickDockButton?.classList.contains('FloatingWindowHeaderAction')).toBe(true)
    expect(quickDockButton?.querySelector('svg')).not.toBeNull()
    expect(quickDockButton?.textContent?.trim()).toBe('')

    await act(async () => {
      quickDockButton?.click()
    })
    await rerenderAppShell(root!)

    expect(
      container?.querySelector('.CatalogFloatingWindow[data-workspace-surface-instance-id="catalog-surface-1"]'),
    ).toBeNull()
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['catalog-surface-1']).toBeUndefined()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'catalog' && slot.surfaceInstanceId === 'catalog-surface-1',
      ),
    ).toBe(true)
  })

  it('floats a slotted catalog surface from the titlebar action menu', async () => {
    ;({ container, root } = await renderAppShell())

    let secondarySlotId: string | null = null
    await act(async () => {
      secondarySlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'modelViewer',
      })
    })

    const secondarySlotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') === secondarySlotId &&
        element.getAttribute('data-workspace-surface-kind') === 'modelViewer',
    ) as HTMLDivElement | undefined
    const modeButton = secondarySlotFrame?.querySelector(
      '.ViewportFrameModeButton',
    ) as HTMLButtonElement | null

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

    const catalogAction = Array.from(
      container?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Catalog') as HTMLButtonElement | undefined

    expect(catalogAction).not.toBeUndefined()

    await act(async () => {
      catalogAction?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const catalogSlotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') === secondarySlotId &&
        element.getAttribute('data-workspace-surface-kind') === 'catalog',
    ) as HTMLDivElement | undefined
    const catalogHeader = catalogSlotFrame?.querySelector('.ViewportFrameHeader') as
      | HTMLDivElement
      | null

    expect(catalogHeader).not.toBeNull()

    await act(async () => {
      catalogHeader?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 64,
        }),
      )
    })

    const floatAction = Array.from(
      container?.querySelectorAll('.ViewportFrameActionMenuAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Float') as HTMLButtonElement | undefined

    expect(floatAction).not.toBeUndefined()

    await act(async () => {
      floatAction?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    await rerenderAppShell(root!)

    const catalogSurfaceInstanceId = `catalog-${secondarySlotId}`
    const floatingCatalog = container?.querySelector(
      `.CatalogFloatingWindow[data-workspace-surface-instance-id="${catalogSurfaceInstanceId}"]`,
    ) as HTMLDivElement | null

    expect(floatingCatalog).not.toBeNull()
    expect(floatingCatalog?.textContent).toContain('Floating Catalog')
    expect(floatingCatalog?.style.zIndex).toBe('19')
    expect(
      useWorkspaceStore.getState().detachedSlotSurfaceById[catalogSurfaceInstanceId]?.hostMode,
    ).toBe('floating')
    expect(
      container?.querySelector(
        `.ViewportFrame[data-workspace-slot-id="${secondarySlotId}"][data-workspace-surface-kind="catalog"]`,
      ),
    ).toBeNull()

    const quickDockButton = floatingCatalog?.querySelector(
      '.CatalogFloatingWindowQuickDock',
    ) as HTMLButtonElement | null
    expect(quickDockButton).not.toBeNull()

    await act(async () => {
      quickDockButton?.click()
    })
    await rerenderAppShell(root!)

    expect(useWorkspaceStore.getState().detachedSlotSurfaceById[catalogSurfaceInstanceId]).toBeUndefined()
    expect(
      container?.querySelector(
        `.ViewportFrame[data-workspace-slot-id="${secondarySlotId}"][data-workspace-surface-kind="catalog"]`,
      ),
    ).not.toBeNull()
  })

  it('pops out a notepad slot into a child window and quick docks it back', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const { popoutDocument, popoutWindow } = createMockChildWindow()
    window.open = vi.fn(() => popoutWindow) as typeof window.open

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'notepad',
        surfaceInstanceId: 'notepad-surface-1',
      })
    })

    const slotPopoutButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Pop out Notepad',
    ) as HTMLButtonElement | undefined
    expect(slotPopoutButton).not.toBeUndefined()

    await act(async () => {
      slotPopoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(window.open).toHaveBeenCalled()
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['notepad-surface-1']?.hostMode).toBe(
      'popout',
    )
    expect(popoutDocument.body.textContent).toContain('Notepad')
    expect(popoutDocument.body.textContent).toContain('Focused notes land here')

    const quickDockButton = popoutDocument.body.querySelector(
      '.NotepadPopoutWindowQuickDock',
    ) as HTMLButtonElement | null
    expect(quickDockButton).not.toBeNull()

    await act(async () => {
      quickDockButton?.click()
    })
    await rerenderAppShell(root!)

    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['notepad-surface-1']).toBeUndefined()
    expect(popoutWindow.close).toHaveBeenCalled()
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'notepad' && slot.surfaceInstanceId === 'notepad-surface-1',
      ),
    ).toBe(true)
  })

  it('hydrates persisted notepad notes independently from workspace-layout restore', async () => {
    window.localStorage.setItem(
      notepadStorageKey,
      JSON.stringify({
        version: 1,
        notesById: {
          'note-1': {
            id: 'note-1',
            title: 'Recovered note',
            body: 'Persisted body',
            createdAt: '2026-04-03T20:00:00.000Z',
            updatedAt: '2026-04-03T20:01:00.000Z',
            isPinned: true,
          },
        },
        noteOrder: ['note-1'],
        activeNoteId: 'note-1',
      }),
    )
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'notepad',
      surfaceInstanceId: 'notepad-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    expect(useNotepadStore.getState().activeNoteId).toBe('note-1')
    expect(useNotepadStore.getState().notesById['note-1']).toEqual(
      expect.objectContaining({
        title: 'Recovered note',
        body: 'Persisted body',
        isPinned: true,
      }),
    )
    expect(container?.textContent).toContain('Recovered note')
    expect(container?.textContent).toContain('Persisted body')
  })

  it('renders pinned notes as sticky notes in dashboard and unpinning keeps the note in notepad', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Pinned dashboard note',
      body: 'Remember to validate the first sticky-note widget path.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    expect(container?.textContent).toContain('TO DO')
    expect(container?.textContent).toContain('Completed')
    expect(container?.textContent).toContain('Pinned dashboard note')
    expect(container?.textContent).toContain('Remember to validate the first sticky-note widget path.')
    expect(container?.querySelector('.DashboardStickyNote')).not.toBeNull()

    const unpinButton = Array.from(
      container?.querySelectorAll('.DashboardStickyNoteActionButton') ?? [],
    ).find((button) => button.textContent === 'Unpin') as HTMLButtonElement | undefined
    expect(unpinButton).not.toBeUndefined()

    await act(async () => {
      unpinButton?.click()
    })

    expect(useNotepadStore.getState().notesById[noteId]).toEqual(
      expect.objectContaining({
        id: noteId,
        isPinned: false,
      }),
    )
    expect(container?.querySelector('.DashboardStickyNote')).toBeNull()
    expect(container?.textContent).toContain('Sticky notes land here.')
  })

  it('creates a sticky note from a lane toolbar, pins it into that lane, and starts inline body editing', async () => {
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const addStickyNoteButton = container?.querySelector(
      '[data-dashboard-lane-add-note-button="completed"]',
    ) as HTMLButtonElement | null
    expect(addStickyNoteButton).not.toBeNull()

    await act(async () => {
      addStickyNoteButton?.click()
    })

    const state = useNotepadStore.getState()
    const createdNoteId = state.activeNoteId
    expect(createdNoteId).not.toBeNull()
    expect(createdNoteId === null ? null : state.notesById[createdNoteId]).toEqual(
      expect.objectContaining({
        id: createdNoteId,
        title: '',
        body: '',
        isPinned: true,
      }),
    )
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[createdNoteId ?? '']).toEqual(
      expect.objectContaining({
        noteId: createdNoteId,
        laneId: 'completed',
      }),
    )

    const bodyInput = container?.querySelector(
      '[data-dashboard-sticky-note-body-input="true"]',
    ) as HTMLTextAreaElement | null
    expect(bodyInput).not.toBeNull()
    expect(document.activeElement).toBe(bodyInput)
  })

  it('adds, renames, and deletes dashboard lanes while preserving note placement through lane migration', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Lane migration note',
      body: 'Move me through a deleted lane.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const addLaneButton = container?.querySelector(
      '[data-dashboard-lane-add-lane-button="todo"]',
    ) as HTMLButtonElement | null
    expect(addLaneButton).not.toBeNull()

    await act(async () => {
      addLaneButton?.click()
    })

    let state = useDashboardStore.getState()
    const reviewLane = state.lanes.find((lane) => lane.title === 'New lane') ?? null
    expect(reviewLane).not.toBeNull()
    expect(state.lanes.map((lane) => lane.title)).toEqual(['TO DO', 'New lane', 'Completed'])

    const reviewLaneId = reviewLane?.id ?? ''
    await act(async () => {
      useDashboardStore.getState().setStickyNotePlacement(noteId, reviewLaneId, 336, 188)
    })

    const renameTitleButton = container?.querySelector(
      `[data-dashboard-lane-title-button="${reviewLaneId}"]`,
    ) as HTMLButtonElement | null
    expect(renameTitleButton).not.toBeNull()

    await act(async () => {
      renameTitleButton?.click()
    })

    const renameTitleInput = container?.querySelector(
      `[data-dashboard-lane-title-input="${reviewLaneId}"]`,
    ) as HTMLInputElement | null
    expect(renameTitleInput).not.toBeNull()

    await act(async () => {
      if (renameTitleInput !== null) {
        renameTitleInput.value = 'Doing'
        renameTitleInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    await act(async () => {
      renameTitleInput?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }),
      )
    })

    state = useDashboardStore.getState()
    expect(state.lanes.find((lane) => lane.id === reviewLaneId)?.title).toBe('Doing')
    expect(container?.textContent).toContain('Doing')

    vi.mocked(window.prompt).mockImplementationOnce(() => 'Completed')
    vi.mocked(window.confirm).mockImplementationOnce(() => true)

    const deleteButton = container?.querySelector(
      `[data-dashboard-lane-delete-button="${reviewLaneId}"]`,
    ) as HTMLButtonElement | null
    expect(deleteButton).not.toBeNull()

    await act(async () => {
      deleteButton?.click()
    })

    state = useDashboardStore.getState()
    expect(state.lanes.some((lane) => lane.id === reviewLaneId)).toBe(false)
    expect(state.stickyNoteLayoutsByNoteId[noteId]).toEqual(
      expect.objectContaining({
        noteId,
        laneId: 'completed',
        x: 336,
        y: 188,
      }),
    )
    expect(window.prompt).toHaveBeenCalledWith(
      'Move notes from "Doing" to which lane?',
      'TO DO',
    )
    expect(window.confirm).toHaveBeenCalledWith('Delete lane "Doing"?')
  })

  it('cancels inline lane title editing on Escape without renaming the lane', async () => {
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const titleButton = container?.querySelector(
      '[data-dashboard-lane-title-button="todo"]',
    ) as HTMLButtonElement | null
    expect(titleButton).not.toBeNull()

    await act(async () => {
      titleButton?.click()
    })

    const titleInput = container?.querySelector(
      '[data-dashboard-lane-title-input="todo"]',
    ) as HTMLInputElement | null
    expect(titleInput).not.toBeNull()

    await act(async () => {
      if (titleInput !== null) {
        titleInput.value = 'Discarded lane name'
        titleInput.dispatchEvent(new Event('input', { bubbles: true }))
        titleInput.dispatchEvent(
          new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }),
        )
      }
    })

    expect(useDashboardStore.getState().lanes.find((lane) => lane.id === 'todo')?.title).toBe('TO DO')
    expect(container?.textContent).toContain('TO DO')
  })

  it('disables lane deletion when only one lane remains', async () => {
    useDashboardStore.getState().removeLane('todo', 'completed')
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const deleteButton = container?.querySelector(
      '[data-dashboard-lane-delete-button="completed"]',
    ) as HTMLButtonElement | null
    expect(deleteButton?.disabled).toBe(true)
  })

  it('resizes adjacent dashboard lanes through the vertical splitter and persists the widths', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Resize lane note',
      body: 'Resize the board lanes without moving me.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    const todoLane = container?.querySelector(
      '[data-dashboard-lane="todo"]',
    ) as HTMLElement | null
    const completedLane = container?.querySelector(
      '[data-dashboard-lane="completed"]',
    ) as HTMLElement | null
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    const completedLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="completed"]',
    ) as HTMLDivElement | null
    mockRect(todoLane, {
      left: 360,
      top: 120,
      width: 520,
      height: 560,
    })
    mockRect(completedLane, {
      left: 894,
      top: 120,
      width: 520,
      height: 560,
    })
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 520,
      height: 480,
    })
    mockRect(completedLaneBoard, {
      left: 894,
      top: 180,
      width: 520,
      height: 480,
    })

    const resizeHandle = container?.querySelector(
      '[data-dashboard-lane-resize-handle="todo:completed"]',
    ) as HTMLDivElement | null
    const board = container?.querySelector('.DashboardSurfaceBoard') as HTMLDivElement | null
    const layoutBeforeResize = useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]

    expect(resizeHandle).not.toBeNull()
    expect(board?.style.gridTemplateColumns).toContain('14px')

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 31,
          clientX: 887,
          clientY: 320,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 31,
          clientX: 1287,
          clientY: 320,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 31,
          clientX: 1287,
          clientY: 320,
        }),
      )
    })

    expect(useDashboardStore.getState().lanes.find((lane) => lane.id === 'todo')?.width).toBeCloseTo(
      1.7692307,
      5,
    )
    expect(
      useDashboardStore.getState().lanes.find((lane) => lane.id === 'completed')?.width,
    ).toBeCloseTo(0.2307692, 5)
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual(layoutBeforeResize)

    await vi.waitFor(() => {
      const persisted = JSON.parse(window.localStorage.getItem(dashboardStorageKey) ?? 'null') as
        | { lanes?: Array<{ id: string; width: number }> }
        | null
      expect(persisted?.lanes?.find((lane) => lane.id === 'todo')?.width).toBeCloseTo(1.7692307, 5)
      expect(persisted?.lanes?.find((lane) => lane.id === 'completed')?.width).toBeCloseTo(
        0.2307692,
        5,
      )
    })
  })

  it('edits a sticky note title inline and keeps the same shared note when opening in notepad', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Title before edit',
      body: 'Keep this note linked to notepad.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const titleButton = container?.querySelector(
      '[data-dashboard-sticky-note-title-button="true"]',
    ) as HTMLButtonElement | null
    expect(titleButton).not.toBeNull()

    await act(async () => {
      titleButton?.click()
    })

    const titleInput = container?.querySelector(
      '[data-dashboard-sticky-note-title-input="true"]',
    ) as HTMLInputElement | null
    expect(titleInput).not.toBeNull()

    await act(async () => {
      if (titleInput !== null) {
        titleInput.value = 'Dashboard renamed note'
        titleInput.dispatchEvent(new Event('input', { bubbles: true }))
        titleInput.dispatchEvent(new Event('change', { bubbles: true }))
        titleInput.dispatchEvent(new FocusEvent('blur', { bubbles: true }))
      }
    })

    expect(useNotepadStore.getState().notesById[noteId]?.title).toBe('Dashboard renamed note')

    const stickyMenuButton = container?.querySelector(
      '[data-dashboard-sticky-note-menu-button="true"]',
    ) as HTMLButtonElement | null
    expect(stickyMenuButton).not.toBeNull()

    await act(async () => {
      stickyMenuButton?.click()
    })

    const openButton = container?.querySelector(
      '[data-dashboard-sticky-note-menu-action="open-in-notepad"]',
    ) as HTMLButtonElement | null
    expect(openButton).not.toBeNull()

    await act(async () => {
      openButton?.click()
    })

    expect(useNotepadStore.getState().activeNoteId).toBe(noteId)
    expect(container?.textContent).toContain('Dashboard renamed note')
  })

  it('edits a sticky note body inline and keeps the same shared note when opening in notepad', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Body edit note',
      body: 'Before edit',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const bodyButton = container?.querySelector(
      '[data-dashboard-sticky-note-body-button="true"]',
    ) as HTMLButtonElement | null
    expect(bodyButton).not.toBeNull()

    await act(async () => {
      bodyButton?.click()
    })

    const bodyInput = container?.querySelector(
      '[data-dashboard-sticky-note-body-input="true"]',
    ) as HTMLTextAreaElement | null
    expect(bodyInput).not.toBeNull()

    await act(async () => {
      if (bodyInput !== null) {
        bodyInput.value = 'Updated on the dashboard board.'
        bodyInput.dispatchEvent(new Event('input', { bubbles: true }))
        bodyInput.dispatchEvent(new Event('change', { bubbles: true }))
        bodyInput.dispatchEvent(new FocusEvent('blur', { bubbles: true }))
      }
    })

    expect(useNotepadStore.getState().notesById[noteId]?.body).toBe('Updated on the dashboard board.')

    const stickyMenuButton = container?.querySelector(
      '[data-dashboard-sticky-note-menu-button="true"]',
    ) as HTMLButtonElement | null
    expect(stickyMenuButton).not.toBeNull()

    await act(async () => {
      stickyMenuButton?.click()
    })

    const openButton = container?.querySelector(
      '[data-dashboard-sticky-note-menu-action="open-in-notepad"]',
    ) as HTMLButtonElement | null
    expect(openButton).not.toBeNull()

    await act(async () => {
      openButton?.click()
    })

    expect(useNotepadStore.getState().activeNoteId).toBe(noteId)
    expect(container?.textContent).toContain('Updated on the dashboard board.')
  })

  it('cancels sticky note title and body drafts on Escape without persisting them', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Keep original title',
      body: 'Keep original body',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const titleButton = container?.querySelector(
      '[data-dashboard-sticky-note-title-button="true"]',
    ) as HTMLButtonElement | null
    expect(titleButton).not.toBeNull()

    await act(async () => {
      titleButton?.click()
    })

    const titleInput = container?.querySelector(
      '[data-dashboard-sticky-note-title-input="true"]',
    ) as HTMLInputElement | null
    expect(titleInput).not.toBeNull()

    await act(async () => {
      if (titleInput !== null) {
        titleInput.value = 'Discarded title'
        titleInput.dispatchEvent(new Event('input', { bubbles: true }))
        titleInput.dispatchEvent(
          new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }),
        )
      }
    })

    const bodyButton = container?.querySelector(
      '[data-dashboard-sticky-note-body-button="true"]',
    ) as HTMLButtonElement | null
    expect(bodyButton).not.toBeNull()

    await act(async () => {
      bodyButton?.click()
    })

    const bodyInput = container?.querySelector(
      '[data-dashboard-sticky-note-body-input="true"]',
    ) as HTMLTextAreaElement | null
    expect(bodyInput).not.toBeNull()

    await act(async () => {
      if (bodyInput !== null) {
        bodyInput.value = 'Discarded body'
        bodyInput.dispatchEvent(new Event('input', { bubbles: true }))
        bodyInput.dispatchEvent(
          new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }),
        )
      }
    })

    expect(useNotepadStore.getState().notesById[noteId]).toEqual(
      expect.objectContaining({
        title: 'Keep original title',
        body: 'Keep original body',
      }),
    )
    expect(container?.textContent).toContain('Keep original title')
    expect(container?.textContent).toContain('Keep original body')
  })

  it('opens a sticky note color palette on title bar right click and updates the shared note color', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Color menu note',
      body: 'Right click the title bar to recolor me.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const titleBar = container?.querySelector('.DashboardStickyNoteTitleBar') as HTMLDivElement | null
    expect(titleBar).not.toBeNull()

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 220,
        }),
      )
    })

    const colorMenu = container?.querySelector(
      '[data-dashboard-sticky-note-color-menu="true"]',
    ) as HTMLDivElement | null
    expect(colorMenu).not.toBeNull()

    const blueSwatch = colorMenu?.querySelector(
      '[data-note-color-option="blue"]',
    ) as HTMLButtonElement | null
    expect(blueSwatch).not.toBeNull()

    await act(async () => {
      blueSwatch?.click()
    })

    expect(useNotepadStore.getState().notesById[noteId]?.colorPreset).toBe('blue')
    const stickyNote = container?.querySelector('.DashboardStickyNote') as HTMLElement | null
    expect(stickyNote?.getAttribute('data-note-color-preset')).toBe('blue')
    expect(
      container?.querySelector('[data-dashboard-sticky-note-color-menu="true"]'),
    ).toBeNull()
  })

  it('opens a sticky note burger menu and updates the shared note color from the menu', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Burger color note',
      body: 'Use the visible menu to recolor me.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const menuButton = container?.querySelector(
      '[data-dashboard-sticky-note-menu-button="true"]',
    ) as HTMLButtonElement | null
    expect(menuButton).not.toBeNull()

    await act(async () => {
      menuButton?.click()
    })

    const overflowMenu = container?.querySelector(
      '[data-dashboard-sticky-note-menu="true"]',
    ) as HTMLDivElement | null
    expect(overflowMenu).not.toBeNull()

    const blueSwatch = overflowMenu?.querySelector(
      '[data-note-color-option="blue"]',
    ) as HTMLButtonElement | null
    expect(blueSwatch).not.toBeNull()

    await act(async () => {
      blueSwatch?.click()
    })

    expect(useNotepadStore.getState().notesById[noteId]?.colorPreset).toBe('blue')
    const stickyNote = container?.querySelector('.DashboardStickyNote') as HTMLElement | null
    expect(stickyNote?.getAttribute('data-note-color-preset')).toBe('blue')
    expect(container?.querySelector('[data-dashboard-sticky-note-menu="true"]')).toBeNull()
  })

  it('opens the sticky note burger menu from a real pointer click on the menu button', async () => {
    useNotepadStore.getState().createNote({
      title: 'Pointer menu note',
      body: 'Open the overflow menu with pointer events.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const menuButton = container?.querySelector(
      '[data-dashboard-sticky-note-menu-button="true"]',
    ) as HTMLButtonElement | null
    expect(menuButton).not.toBeNull()

    await act(async () => {
      menuButton?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 201,
          clientX: 585,
          clientY: 250,
        }),
      )
      menuButton?.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 201,
          clientX: 585,
          clientY: 250,
        }),
      )
      menuButton?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: 585,
          clientY: 250,
        }),
      )
    })

    expect(container?.querySelector('[data-dashboard-sticky-note-menu="true"]')).not.toBeNull()
  })

  it('selects one dashboard sticky note when the user clicks it', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Selected note',
      body: 'Click me to select.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Other note',
      body: 'I should stay unselected.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const firstStickyNote = container?.querySelector(
      `[data-note-id="${firstNoteId}"]`,
    ) as HTMLElement | null
    const secondStickyNote = container?.querySelector(
      `[data-note-id="${secondNoteId}"]`,
    ) as HTMLElement | null

    expect(firstStickyNote).not.toBeNull()
    expect(secondStickyNote).not.toBeNull()

    await act(async () => {
      firstStickyNote?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 61,
          clientX: 420,
          clientY: 240,
        }),
      )
      firstStickyNote?.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 61,
          clientX: 420,
          clientY: 240,
        }),
      )
    })

    expect(firstStickyNote?.getAttribute('data-dashboard-note-selected')).toBe('true')
    expect(secondStickyNote?.getAttribute('data-dashboard-note-selected')).toBe('false')
  })

  it('selects multiple dashboard sticky notes with a lane-local selection rectangle without mutating placement', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'First selected note',
      body: 'Inside the selection rectangle.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Second selected note',
      body: 'Also inside the selection rectangle.',
      isPinned: true,
    })
    const thirdNoteId = useNotepadStore.getState().createNote({
      title: 'Unselected note',
      body: 'Outside the selection rectangle.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(firstNoteId, 'todo', 120, 100)
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'todo', 320, 220)
    useDashboardStore.getState().setStickyNotePlacement(thirdNoteId, 'todo', 900, 720)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    const firstLayoutBeforeSelection = useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]
    const secondLayoutBeforeSelection = useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]
    const thirdLayoutBeforeSelection = useDashboardStore.getState().stickyNoteLayoutsByNoteId[thirdNoteId]

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 62,
          clientX: 390,
          clientY: 210,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 62,
          clientX: 930,
          clientY: 620,
        }),
      )
    })

    expect(
      container?.querySelector('[data-dashboard-selection-box="todo"]'),
    ).not.toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 62,
          clientX: 930,
          clientY: 620,
        }),
      )
    })

    const firstStickyNote = container?.querySelector(
      `[data-note-id="${firstNoteId}"]`,
    ) as HTMLElement | null
    const secondStickyNote = container?.querySelector(
      `[data-note-id="${secondNoteId}"]`,
    ) as HTMLElement | null
    const thirdStickyNote = container?.querySelector(
      `[data-note-id="${thirdNoteId}"]`,
    ) as HTMLElement | null

    expect(firstStickyNote?.getAttribute('data-dashboard-note-selected')).toBe('true')
    expect(secondStickyNote?.getAttribute('data-dashboard-note-selected')).toBe('true')
    expect(thirdStickyNote?.getAttribute('data-dashboard-note-selected')).toBe('false')
    expect(
      container?.querySelector('[data-dashboard-selection-box="todo"]'),
    ).toBeNull()
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]).toEqual(firstLayoutBeforeSelection)
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]).toEqual(secondLayoutBeforeSelection)
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[thirdNoteId]).toEqual(thirdLayoutBeforeSelection)
  })

  it('clears dashboard sticky note selection when the user clicks empty board space', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Clear selection note',
      body: 'Select me, then clear by clicking empty board space.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    const stickyNote = container?.querySelector(`[data-note-id="${noteId}"]`) as HTMLElement | null

    await act(async () => {
      stickyNote?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 63,
          clientX: 420,
          clientY: 240,
        }),
      )
      stickyNote?.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 63,
          clientX: 420,
          clientY: 240,
        }),
      )
    })

    expect(stickyNote?.getAttribute('data-dashboard-note-selected')).toBe('true')

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 64,
          clientX: 390,
          clientY: 210,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 64,
          clientX: 390,
          clientY: 210,
        }),
      )
    })

    expect(stickyNote?.getAttribute('data-dashboard-note-selected')).toBe('false')
  })

  it('drags a lane-local selected sticky-note set together while preserving relative spacing', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Group move first note',
      body: 'I move with the selected set.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Group move second note',
      body: 'I should keep my offset.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(firstNoteId, 'todo', 120, 100)
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'todo', 320, 220)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 65,
          clientX: 390,
          clientY: 210,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 65,
          clientX: 930,
          clientY: 620,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 65,
          clientX: 930,
          clientY: 620,
        }),
      )
    })

    const firstStickyTitleBar = container?.querySelector(
      `[data-note-id="${firstNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(firstStickyTitleBar).not.toBeNull()

    await act(async () => {
      firstStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 66,
          clientX: 520,
          clientY: 300,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 66,
          clientX: 640,
          clientY: 400,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 66,
          clientX: 640,
          clientY: 400,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]).toEqual({
      noteId: firstNoteId,
      laneId: 'todo',
      x: 240,
      y: 200,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]).toEqual({
      noteId: secondNoteId,
      laneId: 'todo',
      x: 440,
      y: 320,
    })
  })

  it('aligns a lane-local selected sticky-note set vertically without mutating unselected note placement', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Vertical align first note',
      body: 'I provide the top-most x anchor.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Vertical align second note',
      body: 'I should snap to the same x edge.',
      isPinned: true,
    })
    const thirdNoteId = useNotepadStore.getState().createNote({
      title: 'Unselected align note',
      body: 'I should not move.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(firstNoteId, 'todo', 320, 100)
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'todo', 140, 260)
    useDashboardStore.getState().setStickyNotePlacement(thirdNoteId, 'todo', 940, 760)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 67,
          clientX: 430,
          clientY: 230,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 67,
          clientX: 780,
          clientY: 660,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 67,
          clientX: 780,
          clientY: 660,
        }),
      )
    })

    const verticalAlignButton = container?.querySelector(
      '[data-dashboard-lane-align-vertical-button="todo"]',
    ) as HTMLButtonElement | null
    expect(verticalAlignButton).not.toBeNull()
    expect(verticalAlignButton?.disabled).toBe(false)

    await act(async () => {
      verticalAlignButton?.click()
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]).toEqual({
      noteId: firstNoteId,
      laneId: 'todo',
      x: 320,
      y: 100,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]).toEqual({
      noteId: secondNoteId,
      laneId: 'todo',
      x: 320,
      y: 260,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[thirdNoteId]).toEqual({
      noteId: thirdNoteId,
      laneId: 'todo',
      x: 940,
      y: 760,
    })

    const firstStickyNote = container?.querySelector(
      `[data-note-id="${firstNoteId}"]`,
    ) as HTMLElement | null
    const secondStickyNote = container?.querySelector(
      `[data-note-id="${secondNoteId}"]`,
    ) as HTMLElement | null
    expect(firstStickyNote?.getAttribute('data-dashboard-note-selected')).toBe('true')
    expect(secondStickyNote?.getAttribute('data-dashboard-note-selected')).toBe('true')
  })

  it('keeps horizontal align unavailable until two notes are selected and then aligns them', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Horizontal align first note',
      body: 'I should snap to the left-most y anchor.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Horizontal align second note',
      body: 'I should share the same y edge once selected.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(firstNoteId, 'todo', 260, 140)
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'todo', 540, 320)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const horizontalAlignButton = container?.querySelector(
      '[data-dashboard-lane-align-horizontal-button="todo"]',
    ) as HTMLButtonElement | null
    expect(horizontalAlignButton).not.toBeNull()
    expect(horizontalAlignButton?.disabled).toBe(true)

    const firstStickyNote = container?.querySelector(
      `[data-note-id="${firstNoteId}"]`,
    ) as HTMLElement | null
    expect(firstStickyNote).not.toBeNull()

    await act(async () => {
      firstStickyNote?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 68,
          clientX: 520,
          clientY: 320,
        }),
      )
      firstStickyNote?.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 68,
          clientX: 520,
          clientY: 320,
        }),
      )
    })

    expect(horizontalAlignButton?.disabled).toBe(true)

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 69,
          clientX: 430,
          clientY: 250,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 69,
          clientX: 980,
          clientY: 760,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 69,
          clientX: 980,
          clientY: 760,
        }),
      )
    })

    expect(horizontalAlignButton?.disabled).toBe(false)

    await act(async () => {
      horizontalAlignButton?.click()
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]).toEqual({
      noteId: firstNoteId,
      laneId: 'todo',
      x: 260,
      y: 140,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]).toEqual({
      noteId: secondNoteId,
      laneId: 'todo',
      x: 540,
      y: 140,
    })
  })

  it('smart-aligns a selected sticky-note set vertically without overlap while preserving order', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Smart vertical first note',
      body: 'I anchor the top of the smart stack.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Smart vertical second note',
      body: 'I should stack below without overlap.',
      isPinned: true,
    })
    const thirdNoteId = useNotepadStore.getState().createNote({
      title: 'Smart vertical unselected note',
      body: 'I should stay put.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNoteFrame(firstNoteId, {
      x: 320,
      y: 100,
      width: 248,
      height: 220,
    })
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'todo', 140, 260)
    useDashboardStore.getState().setStickyNotePlacement(thirdNoteId, 'todo', 940, 760)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 71,
          clientX: 430,
          clientY: 230,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 71,
          clientX: 780,
          clientY: 660,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 71,
          clientX: 780,
          clientY: 660,
        }),
      )
    })

    const smartAlignButton = container?.querySelector(
      '[data-dashboard-lane-smart-align-button="todo"]',
    ) as HTMLButtonElement | null
    const verticalAlignButton = container?.querySelector(
      '[data-dashboard-lane-align-vertical-button="todo"]',
    ) as HTMLButtonElement | null
    expect(smartAlignButton).not.toBeNull()
    expect(smartAlignButton?.getAttribute('aria-pressed')).toBe('false')

    await act(async () => {
      smartAlignButton?.click()
    })

    expect(smartAlignButton?.getAttribute('aria-pressed')).toBe('true')

    await act(async () => {
      verticalAlignButton?.click()
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]).toEqual({
      noteId: firstNoteId,
      laneId: 'todo',
      x: 320,
      y: 100,
      width: 248,
      height: 220,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]).toEqual({
      noteId: secondNoteId,
      laneId: 'todo',
      x: 320,
      y: 344,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[thirdNoteId]).toEqual({
      noteId: thirdNoteId,
      laneId: 'todo',
      x: 940,
      y: 760,
    })
  })

  it('smart-aligns a selected sticky-note set horizontally without overlap while preserving order', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Smart horizontal first note',
      body: 'I anchor the left edge of the smart row.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Smart horizontal second note',
      body: 'I should stack to the right without overlap.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNoteFrame(firstNoteId, {
      x: 260,
      y: 140,
      width: 300,
      height: 196,
    })
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'todo', 540, 320)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 72,
          clientX: 430,
          clientY: 250,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 72,
          clientX: 980,
          clientY: 760,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 72,
          clientX: 980,
          clientY: 760,
        }),
      )
    })

    const smartAlignButton = container?.querySelector(
      '[data-dashboard-lane-smart-align-button="todo"]',
    ) as HTMLButtonElement | null
    const horizontalAlignButton = container?.querySelector(
      '[data-dashboard-lane-align-horizontal-button="todo"]',
    ) as HTMLButtonElement | null
    expect(smartAlignButton).not.toBeNull()

    await act(async () => {
      smartAlignButton?.click()
      horizontalAlignButton?.click()
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]).toEqual({
      noteId: firstNoteId,
      laneId: 'todo',
      x: 260,
      y: 140,
      width: 300,
      height: 196,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]).toEqual({
      noteId: secondNoteId,
      laneId: 'todo',
      x: 584,
      y: 140,
    })
  })

  it('arranges a selected lane-local sticky-note set into a grid without moving unselected notes', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Grid selected first note',
      body: 'I should become the second note in the arranged row.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Grid selected second note',
      body: 'I should become the first note in the arranged row.',
      isPinned: true,
    })
    const thirdNoteId = useNotepadStore.getState().createNote({
      title: 'Grid unselected note',
      body: 'I should stay where I am.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNoteFrame(firstNoteId, {
      x: 420,
      y: 140,
      width: 320,
      height: 220,
    })
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'todo', 160, 120)
    useDashboardStore.getState().setStickyNotePlacement(thirdNoteId, 'todo', 940, 760)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 70,
          clientX: 500,
          clientY: 280,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 70,
          clientX: 820,
          clientY: 620,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 70,
          clientX: 820,
          clientY: 620,
        }),
      )
    })

    const gridButton = container?.querySelector(
      '[data-dashboard-lane-grid-button="todo"]',
    ) as HTMLButtonElement | null
    expect(gridButton).not.toBeNull()
    expect(gridButton?.disabled).toBe(false)

    await act(async () => {
      gridButton?.click()
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]).toEqual({
      noteId: secondNoteId,
      laneId: 'todo',
      x: 24,
      y: 24,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]).toEqual({
      noteId: firstNoteId,
      laneId: 'todo',
      x: 296,
      y: 24,
      width: 320,
      height: 220,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[thirdNoteId]).toEqual({
      noteId: thirdNoteId,
      laneId: 'todo',
      x: 940,
      y: 760,
    })
  })

  it('falls back to arranging the full lane into a grid when there is no meaningful selection', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Grid full lane first note',
      body: 'Arrange the whole lane without selection.',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Grid full lane second note',
      body: 'I should become the second slot.',
      isPinned: true,
    })
    const thirdNoteId = useNotepadStore.getState().createNote({
      title: 'Grid full lane third note',
      body: 'I should become the third slot.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(firstNoteId, 'completed', 640, 320)
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'completed', 120, 220)
    useDashboardStore.getState().setStickyNotePlacement(thirdNoteId, 'completed', 420, 80)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const gridButton = container?.querySelector(
      '[data-dashboard-lane-grid-button="completed"]',
    ) as HTMLButtonElement | null
    expect(gridButton).not.toBeNull()
    expect(gridButton?.disabled).toBe(false)

    await act(async () => {
      gridButton?.click()
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[thirdNoteId]).toEqual({
      noteId: thirdNoteId,
      laneId: 'completed',
      x: 24,
      y: 24,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[secondNoteId]).toEqual({
      noteId: secondNoteId,
      laneId: 'completed',
      x: 296,
      y: 24,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[firstNoteId]).toEqual({
      noteId: firstNoteId,
      laneId: 'completed',
      x: 568,
      y: 24,
    })
  })

  it('middle-mouse drags a dashboard lane camera without mutating sticky-note placement', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Pan lane note',
      body: 'Pan the lane without moving me.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    const todoLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="todo"]',
    ) as HTMLDivElement | null
    const layoutBeforePan = useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]

    expect(todoLaneBoard).not.toBeNull()
    expect(todoLaneStage).not.toBeNull()

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 1,
          pointerId: 21,
          clientX: 640,
          clientY: 320,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 21,
          clientX: 580,
          clientY: 260,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 21,
          clientX: 580,
          clientY: 260,
        }),
      )
    })

    expect(todoLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('-60')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('-60')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('1')
    expect(todoLaneStage?.style.transform).toBe('translate(-60px, -60px) scale(1)')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual(layoutBeforePan)
  })

  it('keeps lane zoom locked by default and ignores wheel zoom until the lane is unlocked', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Locked zoom note',
      body: 'Zoom should stay locked until I say otherwise.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    const todoLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="todo"]',
    ) as HTMLDivElement | null
    const zoomLockButton = container?.querySelector(
      '[data-dashboard-lane-zoom-lock-button="todo"]',
    ) as HTMLButtonElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    const layoutBeforeWheel = useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]

    expect(zoomLockButton?.getAttribute('aria-label')).toBe('Unlock zoom for TO DO')
    expect(zoomLockButton?.getAttribute('aria-pressed')).toBe('false')

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          clientX: 600,
          clientY: 300,
          deltaY: -120,
        }),
      )
    })

    expect(todoLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('0')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('0')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('1')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual(layoutBeforeWheel)
  })

  it('unlocks lane zoom and updates the lane camera through wheel zoom without mutating sticky-note placement', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Unlocked zoom note',
      body: 'Wheel zoom should move the lane camera only after unlock.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    const todoLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="todo"]',
    ) as HTMLDivElement | null
    const zoomLockButton = container?.querySelector(
      '[data-dashboard-lane-zoom-lock-button="todo"]',
    ) as HTMLButtonElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    const layoutBeforeWheel = useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]

    await act(async () => {
      zoomLockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(zoomLockButton?.getAttribute('aria-label')).toBe('Lock zoom for TO DO')
    expect(zoomLockButton?.getAttribute('aria-pressed')).toBe('true')

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          clientX: 600,
          clientY: 300,
          deltaY: -120,
        }),
      )
    })

    expect(todoLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('-24')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('-12')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('1.1')
    expect(todoLaneStage?.style.transform).toBe('translate(-24px, -12px) scale(1.1)')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual(layoutBeforeWheel)
  })

  it('fits notes back into view for each lane without mutating sticky-note placement', async () => {
    const todoNoteId = useNotepadStore.getState().createNote({
      title: 'Todo fit note',
      body: 'Bring the todo note back into view.',
      isPinned: true,
    })
    const completedNoteId = useNotepadStore.getState().createNote({
      title: 'Completed fit note',
      body: 'Bring the completed note back into view.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(todoNoteId, 'todo', 480, 360)
    useDashboardStore.getState().setStickyNotePlacement(completedNoteId, 'completed', 420, 168)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    mockRect(container?.querySelector('[data-dashboard-lane-board="completed"]'), {
      left: 1120,
      top: 180,
      width: 720,
      height: 480,
    })

    const todoButton = container?.querySelector(
      '[data-dashboard-lane-fit-button="todo"]',
    ) as HTMLButtonElement | null
    const completedButton = container?.querySelector(
      '[data-dashboard-lane-fit-button="completed"]',
    ) as HTMLButtonElement | null
    const todoLayoutBeforeFit = useDashboardStore.getState().stickyNoteLayoutsByNoteId[todoNoteId]
    const completedLayoutBeforeFit = useDashboardStore.getState().stickyNoteLayoutsByNoteId[completedNoteId]

    expect(todoButton?.disabled).toBe(false)
    expect(completedButton?.disabled).toBe(false)

    await act(async () => {
      todoButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const todoLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="todo"]',
    ) as HTMLDivElement | null
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('-244')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('-218')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('1')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[todoNoteId]).toEqual(todoLayoutBeforeFit)

    await act(async () => {
      completedButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const completedLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="completed"]',
    ) as HTMLDivElement | null
    expect(completedLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('-184')
    expect(completedLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('-26')
    expect(completedLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('1')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[completedNoteId]).toEqual(
      completedLayoutBeforeFit,
    )
  })

  it('fits unlocked dashboard lanes to the full note bounds vertically and horizontally without mutating sticky-note placement', async () => {
    const tallNoteTopId = useNotepadStore.getState().createNote({
      title: 'Tall top note',
      body: 'Top of the tall cluster.',
      isPinned: true,
    })
    const tallNoteBottomId = useNotepadStore.getState().createNote({
      title: 'Tall bottom note',
      body: 'Bottom of the tall cluster.',
      isPinned: true,
    })
    const wideNoteLeftId = useNotepadStore.getState().createNote({
      title: 'Wide left note',
      body: 'Left edge of the wide cluster.',
      isPinned: true,
    })
    const wideNoteRightId = useNotepadStore.getState().createNote({
      title: 'Wide right note',
      body: 'Right edge of the wide cluster.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(tallNoteTopId, 'todo', 120, 100)
    useDashboardStore.getState().setStickyNotePlacement(tallNoteBottomId, 'todo', 140, 560)
    useDashboardStore.getState().setStickyNotePlacement(wideNoteLeftId, 'completed', 80, 160)
    useDashboardStore.getState().setStickyNotePlacement(wideNoteRightId, 'completed', 900, 160)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    const completedLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="completed"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    mockRect(completedLaneBoard, {
      left: 1120,
      top: 180,
      width: 720,
      height: 480,
    })

    const todoUnlockButton = container?.querySelector(
      '[data-dashboard-lane-zoom-lock-button="todo"]',
    ) as HTMLButtonElement | null
    const completedUnlockButton = container?.querySelector(
      '[data-dashboard-lane-zoom-lock-button="completed"]',
    ) as HTMLButtonElement | null
    const todoFitButton = container?.querySelector(
      '[data-dashboard-lane-fit-button="todo"]',
    ) as HTMLButtonElement | null
    const completedFitButton = container?.querySelector(
      '[data-dashboard-lane-fit-button="completed"]',
    ) as HTMLButtonElement | null
    const tallTopLayoutBeforeFit = useDashboardStore.getState().stickyNoteLayoutsByNoteId[tallNoteTopId]
    const tallBottomLayoutBeforeFit =
      useDashboardStore.getState().stickyNoteLayoutsByNoteId[tallNoteBottomId]
    const wideLeftLayoutBeforeFit = useDashboardStore.getState().stickyNoteLayoutsByNoteId[wideNoteLeftId]
    const wideRightLayoutBeforeFit =
      useDashboardStore.getState().stickyNoteLayoutsByNoteId[wideNoteRightId]

    await act(async () => {
      todoUnlockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      completedUnlockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      todoFitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const todoLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="todo"]',
    ) as HTMLDivElement | null
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('0')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('-34')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('0.64')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[tallNoteTopId]).toEqual(tallTopLayoutBeforeFit)
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[tallNoteBottomId]).toEqual(
      tallBottomLayoutBeforeFit,
    )

    await act(async () => {
      completedFitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const completedLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="completed"]',
    ) as HTMLDivElement | null
    expect(completedLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('-21')
    expect(completedLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('0')
    expect(completedLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('0.62')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[wideNoteLeftId]).toEqual(
      wideLeftLayoutBeforeFit,
    )
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[wideNoteRightId]).toEqual(
      wideRightLayoutBeforeFit,
    )
  })

  it('disables the lane fit action when a lane has no notes', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Only todo note',
      body: 'Completed lane should stay disabled.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(noteId, 'todo', 184, 164)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const todoButton = container?.querySelector(
      '[data-dashboard-lane-fit-button="todo"]',
    ) as HTMLButtonElement | null
    const completedButton = container?.querySelector(
      '[data-dashboard-lane-fit-button="completed"]',
    ) as HTMLButtonElement | null

    expect(todoButton?.disabled).toBe(false)
    expect(completedButton?.disabled).toBe(true)
  })

  it('drags a dashboard sticky note correctly after the lane camera has moved', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Camera drag note',
      body: 'Drag me after panning the lane camera.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 1,
          pointerId: 31,
          clientX: 640,
          clientY: 320,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 31,
          clientX: 720,
          clientY: 380,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 31,
          clientX: 720,
          clientY: 380,
        }),
      )
    })

    const stickyTitleBar = container?.querySelector('.DashboardStickyNoteTitleBar') as HTMLDivElement | null
    expect(stickyTitleBar).not.toBeNull()

    await act(async () => {
      stickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 32,
          clientX: 504,
          clientY: 284,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 32,
          clientX: 604,
          clientY: 364,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 32,
          clientX: 604,
          clientY: 364,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual({
      noteId,
      laneId: 'todo',
      x: 124,
      y: 104,
    })
    const todoLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="todo"]',
    ) as HTMLDivElement | null
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('80')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('60')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('1')
  })

  it('drags a dashboard sticky note correctly after lane zoom unlock changes the lane camera', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Zoom drag note',
      body: 'Drag me after zooming the lane camera.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLDivElement | null
    const zoomLockButton = container?.querySelector(
      '[data-dashboard-lane-zoom-lock-button="todo"]',
    ) as HTMLButtonElement | null
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    await act(async () => {
      zoomLockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      todoLaneBoard?.dispatchEvent(
        new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          clientX: 600,
          clientY: 300,
          deltaY: -120,
        }),
      )
    })

    const stickyTitleBar = container?.querySelector('.DashboardStickyNoteTitleBar') as HTMLDivElement | null
    expect(stickyTitleBar).not.toBeNull()

    await act(async () => {
      stickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 44,
          clientX: 400,
          clientY: 220,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 44,
          clientX: 510,
          clientY: 310,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 44,
          clientX: 510,
          clientY: 310,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual({
      noteId,
      laneId: 'todo',
      x: 124,
      y: 106,
    })
    const todoLaneStage = container?.querySelector(
      '[data-dashboard-lane-stage="todo"]',
    ) as HTMLDivElement | null
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-x')).toBe('-24')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-y')).toBe('-12')
    expect(todoLaneStage?.getAttribute('data-dashboard-camera-zoom')).toBe('1.1')
  })

  it('attaches a dashboard sticky note on same-lane drop when its title bar overlaps another note title bar', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Attachment parent',
      body: 'Drop another title bar onto me.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Attachment child',
      body: 'I should attach on drop.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 520, 320)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector('[data-dashboard-lane-board="todo"]')
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const childStickyTitleBar = container?.querySelector(
      `[data-note-id="${childNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(childStickyTitleBar).not.toBeNull()

    await act(async () => {
      childStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 21,
          clientX: 900,
          clientY: 520,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 21,
          clientX: 600,
          clientY: 346,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 21,
          clientX: 600,
          clientY: 346,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 220,
      y: 146,
      parentNoteId: parentNoteId,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[parentNoteId]?.parentNoteId).toBeUndefined()
  })

  it('attaches a dashboard sticky note on same-lane drop when its title bar overlaps the parent note body only', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Body parent',
      body: 'Drop onto any visible part of me.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Body child',
      body: 'I should attach from parent-body overlap too.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 520, 320)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector('[data-dashboard-lane-board="todo"]')
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const childStickyTitleBar = container?.querySelector(
      `[data-note-id="${childNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(childStickyTitleBar).not.toBeNull()

    await act(async () => {
      childStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 121,
          clientX: 900,
          clientY: 520,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 121,
          clientX: 600,
          clientY: 390,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 121,
          clientX: 600,
          clientY: 390,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 220,
      y: 190,
      parentNoteId: parentNoteId,
    })
  })

  it('resizes a dashboard sticky note from the south-east corner and persists the new width and height', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Resizable note',
      body: 'Grow me from the corner.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const southEastHandle = container?.querySelector(
      `[data-note-id="${noteId}"] [data-dashboard-sticky-note-resize-handle="south-east"]`,
    ) as HTMLButtonElement | null
    expect(southEastHandle).not.toBeNull()

    await act(async () => {
      southEastHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 301,
          clientX: 632,
          clientY: 400,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 301,
          clientX: 712,
          clientY: 460,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 301,
          clientX: 712,
          clientY: 460,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual({
      noteId,
      laneId: 'todo',
      x: 24,
      y: 24,
      width: 328,
      height: 256,
    })
    expect(JSON.parse(window.localStorage.getItem(dashboardStorageKey) ?? 'null')).toEqual(
      expect.objectContaining({
        stickyNoteLayoutsByNoteId: expect.objectContaining({
          [noteId]: expect.objectContaining({
            width: 328,
            height: 256,
          }),
        }),
      }),
    )
  })

  it('resizes a dashboard sticky note from the west edge while keeping menu and title-bar drag behavior reachable', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Resize then use',
      body: 'The menu and drag should still work.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const westHandle = container?.querySelector(
      `[data-note-id="${noteId}"] [data-dashboard-sticky-note-resize-handle="west"]`,
    ) as HTMLButtonElement | null
    expect(westHandle).not.toBeNull()

    await act(async () => {
      westHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 302,
          clientX: 384,
          clientY: 302,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 302,
          clientX: 424,
          clientY: 302,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 302,
          clientX: 424,
          clientY: 302,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual({
      noteId,
      laneId: 'todo',
      x: 64,
      y: 24,
      width: 208,
      height: 196,
    })

    const menuButton = container?.querySelector(
      `[data-note-id="${noteId}"] [data-dashboard-sticky-note-menu-button="true"]`,
    ) as HTMLButtonElement | null
    expect(menuButton).not.toBeNull()

    await act(async () => {
      menuButton?.click()
    })

    expect(container?.querySelector('[data-dashboard-sticky-note-menu="true"]')).not.toBeNull()

    const stickyTitleBar = container?.querySelector(
      `[data-note-id="${noteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(stickyTitleBar).not.toBeNull()

    await act(async () => {
      stickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 303,
          clientX: 520,
          clientY: 220,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 303,
          clientX: 620,
          clientY: 290,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 303,
          clientX: 620,
          clientY: 290,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual({
      noteId,
      laneId: 'todo',
      x: 164,
      y: 94,
      width: 208,
      height: 196,
    })
  })

  it('attaches a dashboard sticky note against a resized parent note body', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Resized parent',
      body: 'My larger body should accept attachments.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Resized body child',
      body: 'Attach me against the larger parent body.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNoteFrame(parentNoteId, {
      x: 200,
      y: 140,
      width: 380,
      height: 300,
    })
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 620, 420)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const childStickyTitleBar = container?.querySelector(
      `[data-note-id="${childNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(childStickyTitleBar).not.toBeNull()

    await act(async () => {
      childStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 304,
          clientX: 980,
          clientY: 620,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 304,
          clientX: 720,
          clientY: 470,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 304,
          clientX: 720,
          clientY: 470,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[parentNoteId]).toEqual({
      noteId: parentNoteId,
      laneId: 'todo',
      x: 200,
      y: 140,
      width: 380,
      height: 300,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 360,
      y: 270,
      parentNoteId: parentNoteId,
    })
  })

  it('chooses the strongest same-lane title-bar overlap as the dashboard sticky note attachment parent', async () => {
    const leftParentNoteId = useNotepadStore.getState().createNote({
      title: 'Left parent',
      body: 'Smaller overlap.',
      isPinned: true,
    })
    const rightParentNoteId = useNotepadStore.getState().createNote({
      title: 'Right parent',
      body: 'Larger overlap.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Overlap child',
      body: 'Pick the strongest parent.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(leftParentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(rightParentNoteId, 'todo', 340, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 560, 320)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector('[data-dashboard-lane-board="todo"]')
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const childStickyTitleBar = container?.querySelector(
      `[data-note-id="${childNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(childStickyTitleBar).not.toBeNull()

    await act(async () => {
      childStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 22,
          clientX: 940,
          clientY: 520,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 22,
          clientX: 700,
          clientY: 346,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 22,
          clientX: 700,
          clientY: 346,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 320,
      y: 146,
      parentNoteId: rightParentNoteId,
    })
  })

  it('keeps an ordinary same-lane dashboard sticky note drop detached when no title bars overlap', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Detached parent',
      body: 'Start attached, end detached.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Detached child',
      body: 'Move away from overlap.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 220, 146)
    useDashboardStore.getState().setStickyNoteAttachmentParent(childNoteId, parentNoteId)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector('[data-dashboard-lane-board="todo"]')
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const childStickyTitleBar = container?.querySelector(
      `[data-note-id="${childNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(childStickyTitleBar).not.toBeNull()

    await act(async () => {
      childStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 23,
          clientX: 600,
          clientY: 346,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 23,
          clientX: 940,
          clientY: 540,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 23,
          clientX: 940,
          clientY: 540,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 560,
      y: 340,
    })
  })

  it('drags an attached dashboard sticky-note child subtree with its parent while preserving relative spacing', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Subtree parent',
      body: 'My child should follow me.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Subtree child',
      body: 'I should move with my parent.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 220, 146)
    useDashboardStore.getState().setStickyNoteAttachmentParent(childNoteId, parentNoteId)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector('[data-dashboard-lane-board="todo"]')
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const parentStickyTitleBar = container?.querySelector(
      `[data-note-id="${parentNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(parentStickyTitleBar).not.toBeNull()

    await act(async () => {
      parentStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 24,
          clientX: 600,
          clientY: 346,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 24,
          clientX: 720,
          clientY: 430,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 24,
          clientX: 720,
          clientY: 430,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[parentNoteId]).toEqual({
      noteId: parentNoteId,
      laneId: 'todo',
      x: 320,
      y: 224,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 340,
      y: 230,
      parentNoteId: parentNoteId,
    })
  })

  it('attaches one dashboard sticky note on drop and then carries it when the parent is dragged next', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Follow parent',
      body: 'Move me second.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Attach then follow',
      body: 'Attach first, then follow.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 520, 320)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector('[data-dashboard-lane-board="todo"]')
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const childStickyTitleBar = container?.querySelector(
      `[data-note-id="${childNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(childStickyTitleBar).not.toBeNull()

    await act(async () => {
      childStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 202,
          clientX: 900,
          clientY: 520,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 202,
          clientX: 600,
          clientY: 346,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 202,
          clientX: 600,
          clientY: 346,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 220,
      y: 146,
      parentNoteId: parentNoteId,
    })

    const parentStickyTitleBar = container?.querySelector(
      `[data-note-id="${parentNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(parentStickyTitleBar).not.toBeNull()

    await act(async () => {
      parentStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 203,
          clientX: 600,
          clientY: 346,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 203,
          clientX: 720,
          clientY: 430,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 203,
          clientX: 720,
          clientY: 430,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[parentNoteId]).toEqual({
      noteId: parentNoteId,
      laneId: 'todo',
      x: 320,
      y: 224,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 340,
      y: 230,
      parentNoteId: parentNoteId,
    })
  })

  it('renders an attached dashboard child above its parent when they overlap', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Layer parent',
      body: 'I should render beneath my child.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Layer child',
      body: 'I should render above my parent.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 220, 146)
    useDashboardStore.getState().setStickyNoteAttachmentParent(childNoteId, parentNoteId)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const parentStickyNote = container?.querySelector(
      `[data-note-id="${parentNoteId}"]`,
    ) as HTMLElement | null
    const childStickyNote = container?.querySelector(
      `[data-note-id="${childNoteId}"]`,
    ) as HTMLElement | null
    expect(parentStickyNote).not.toBeNull()
    expect(childStickyNote).not.toBeNull()
    expectStickyNoteToRenderAbove(container, 'todo', childNoteId, parentNoteId)
  })

  it('keeps an attached dashboard child above its parent while the parent subtree is dragged', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Dragging layer parent',
      body: 'My child should still stay on top.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Dragging layer child',
      body: 'Stay above during drag.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 220, 146)
    useDashboardStore.getState().setStickyNoteAttachmentParent(childNoteId, parentNoteId)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const parentStickyTitleBar = container?.querySelector(
      `[data-note-id="${parentNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(parentStickyTitleBar).not.toBeNull()

    await act(async () => {
      parentStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 401,
          clientX: 600,
          clientY: 346,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 401,
          clientX: 680,
          clientY: 410,
        }),
      )
    })

    const parentStickyNote = container?.querySelector(
      `[data-note-id="${parentNoteId}"]`,
    ) as HTMLElement | null
    const childStickyNote = container?.querySelector(
      `[data-note-id="${childNoteId}"]`,
    ) as HTMLElement | null
    expect(parentStickyNote?.classList.contains('isDragging')).toBe(true)
    expect(childStickyNote?.classList.contains('isDragging')).toBe(true)
    expectStickyNoteToRenderAbove(container, 'todo', childNoteId, parentNoteId)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 401,
          clientX: 680,
          clientY: 410,
        }),
      )
    })

    expect(parentStickyNote?.classList.contains('isSelected')).toBe(true)
    expectStickyNoteToRenderAbove(container, 'todo', childNoteId, parentNoteId)
  })

  it('double-click lifts one dashboard sticky note above the normal attachment stack', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Lifted parent',
      body: 'I normally render beneath my child.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Lifted child',
      body: 'I normally stay on top.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 220, 146)
    useDashboardStore.getState().setStickyNoteAttachmentParent(childNoteId, parentNoteId)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    expectStickyNoteToRenderAbove(container, 'todo', childNoteId, parentNoteId)

    const parentStickyNote = container?.querySelector(
      `[data-note-id="${parentNoteId}"]`,
    ) as HTMLElement | null
    expect(parentStickyNote).not.toBeNull()

    await act(async () => {
      parentStickyNote?.dispatchEvent(
        new MouseEvent('dblclick', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expectStickyNoteToRenderAbove(container, 'todo', parentNoteId, childNoteId)
  })

  it('double-click again clears dashboard sticky note focus lift and restores attachment order', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Restored parent',
      body: 'I should go back underneath after the lift clears.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Restored child',
      body: 'I should return to the top.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 220, 146)
    useDashboardStore.getState().setStickyNoteAttachmentParent(childNoteId, parentNoteId)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const parentStickyNote = container?.querySelector(
      `[data-note-id="${parentNoteId}"]`,
    ) as HTMLElement | null
    expect(parentStickyNote).not.toBeNull()

    await act(async () => {
      parentStickyNote?.dispatchEvent(
        new MouseEvent('dblclick', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expectStickyNoteToRenderAbove(container, 'todo', parentNoteId, childNoteId)

    await act(async () => {
      parentStickyNote?.dispatchEvent(
        new MouseEvent('dblclick', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expectStickyNoteToRenderAbove(container, 'todo', childNoteId, parentNoteId)
  })

  it('drags a dashboard sticky-note child with its own descendant subtree while keeping direct child drag behavior unchanged', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Nested subtree parent',
      body: 'My child may move away.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Nested subtree child',
      body: 'My descendant should follow me.',
      isPinned: true,
    })
    const grandchildNoteId = useNotepadStore.getState().createNote({
      title: 'Nested subtree grandchild',
      body: 'I should keep following the child.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 180, 120)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 200, 126)
    useDashboardStore.getState().setStickyNotePlacement(grandchildNoteId, 'todo', 220, 132)
    useDashboardStore.getState().setStickyNoteAttachmentParent(childNoteId, parentNoteId)
    useDashboardStore.getState().setStickyNoteAttachmentParent(grandchildNoteId, childNoteId)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    const todoLaneBoard = container?.querySelector('[data-dashboard-lane-board="todo"]')
    mockRect(todoLaneBoard, {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const childStickyTitleBar = container?.querySelector(
      `[data-note-id="${childNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(childStickyTitleBar).not.toBeNull()

    await act(async () => {
      childStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 25,
          clientX: 600,
          clientY: 332,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 25,
          clientX: 840,
          clientY: 520,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 25,
          clientX: 840,
          clientY: 520,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[parentNoteId]).toEqual({
      noteId: parentNoteId,
      laneId: 'todo',
      x: 180,
      y: 120,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'todo',
      x: 440,
      y: 314,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[grandchildNoteId]).toEqual({
      noteId: grandchildNoteId,
      laneId: 'todo',
      x: 460,
      y: 320,
      parentNoteId: childNoteId,
    })
  })

  it('drags an attached dashboard sticky-note subtree into another lane together and preserves attachment links', async () => {
    const parentNoteId = useNotepadStore.getState().createNote({
      title: 'Cross-lane subtree parent',
      body: 'Carry my child with me.',
      isPinned: true,
    })
    const childNoteId = useNotepadStore.getState().createNote({
      title: 'Cross-lane subtree child',
      body: 'I should stay attached after the move.',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(parentNoteId, 'todo', 200, 140)
    useDashboardStore.getState().setStickyNotePlacement(childNoteId, 'todo', 220, 146)
    useDashboardStore.getState().setStickyNoteAttachmentParent(childNoteId, parentNoteId)
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    mockRect(container?.querySelector('[data-dashboard-lane-board="completed"]'), {
      left: 1120,
      top: 180,
      width: 720,
      height: 480,
    })

    const parentStickyTitleBar = container?.querySelector(
      `[data-note-id="${parentNoteId}"] .DashboardStickyNoteTitleBar`,
    ) as HTMLDivElement | null
    expect(parentStickyTitleBar).not.toBeNull()

    await act(async () => {
      parentStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 26,
          clientX: 600,
          clientY: 346,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 26,
          clientX: 1260,
          clientY: 390,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 26,
          clientX: 1260,
          clientY: 390,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[parentNoteId]).toEqual({
      noteId: parentNoteId,
      laneId: 'completed',
      x: 100,
      y: 184,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[childNoteId]).toEqual({
      noteId: childNoteId,
      laneId: 'completed',
      x: 120,
      y: 190,
      parentNoteId: parentNoteId,
    })
  })

  it('drags a dashboard sticky note between the TO DO and Completed lanes and preserves the note record', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Finish lane task',
      body: 'This note should move cleanly between the two dashboard lanes.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    mockRect(container?.querySelector('[data-dashboard-lane-board="completed"]'), {
      left: 1120,
      top: 180,
      width: 720,
      height: 480,
    })

    const stickyTitleBar = container?.querySelector('.DashboardStickyNoteTitleBar') as HTMLDivElement | null
    expect(stickyTitleBar).not.toBeNull()

    await act(async () => {
      stickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 11,
          clientX: 400,
          clientY: 220,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 11,
          clientX: 1240,
          clientY: 330,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 11,
          clientX: 1240,
          clientY: 330,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual(
      expect.objectContaining({
        noteId,
        laneId: 'completed',
      }),
    )
    expect(useNotepadStore.getState().notesById[noteId]?.isPinned).toBe(true)
    expect(
      container?.querySelector('.DashboardSurfaceLane[data-dashboard-lane="completed"] .DashboardStickyNote'),
    ).not.toBeNull()
    const completedStickyTitleBar = container?.querySelector(
      '.DashboardSurfaceLane[data-dashboard-lane="completed"] .DashboardStickyNoteTitleBar',
    ) as HTMLDivElement | null
    expect(completedStickyTitleBar).not.toBeNull()

    await act(async () => {
      completedStickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 12,
          clientX: 1240,
          clientY: 330,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 12,
          clientX: 520,
          clientY: 280,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 12,
          clientX: 520,
          clientY: 280,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual(
      expect.objectContaining({
        noteId,
        laneId: 'todo',
      }),
    )
    expect(
      container?.querySelector('.DashboardSurfaceLane[data-dashboard-lane="todo"] .DashboardStickyNote'),
    ).not.toBeNull()
  })

  it('drags a dashboard sticky note from TO DO into the Completed lane and persists the dropped placement', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Cross lane drag',
      body: 'This note should land inside the completed lane after drop.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })
    mockRect(container?.querySelector('[data-dashboard-lane-board="completed"]'), {
      left: 1120,
      top: 180,
      width: 720,
      height: 480,
    })

    const stickyTitleBar = container?.querySelector('.DashboardStickyNoteTitleBar') as HTMLDivElement | null
    expect(stickyTitleBar).not.toBeNull()

    await act(async () => {
      stickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 9,
          clientX: 400,
          clientY: 220,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 9,
          clientX: 1240,
          clientY: 330,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 9,
          clientX: 1240,
          clientY: 330,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual({
      noteId,
      laneId: 'completed',
      x: 104,
      y: 134,
    })
    expect(
      container?.querySelector('.DashboardSurfaceLane[data-dashboard-lane="completed"] .DashboardStickyNote'),
    ).not.toBeNull()
    expect(
      JSON.parse(window.localStorage.getItem(dashboardStorageKey) ?? 'null'),
    ).toEqual(
      expect.objectContaining({
        stickyNoteLayoutsByNoteId: expect.objectContaining({
          [noteId]: expect.objectContaining({
            noteId,
            laneId: 'completed',
            x: 104,
            y: 134,
          }),
        }),
      }),
    )
  })

  it('opens a sticky note in notepad from a slotted dashboard surface', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Open from dashboard',
      body: 'Switch the current slot into notepad and focus this note.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())

    const menuButton = container?.querySelector(
      '[data-dashboard-sticky-note-menu-button="true"]',
    ) as HTMLButtonElement | null
    expect(menuButton).not.toBeNull()

    await act(async () => {
      menuButton?.click()
    })

    const openButton = container?.querySelector(
      '[data-dashboard-sticky-note-menu-action="open-in-notepad"]',
    ) as HTMLButtonElement | null
    expect(openButton).not.toBeNull()

    await act(async () => {
      openButton?.click()
    })

    const secondarySlot = Object.values(useWorkspaceStore.getState().viewportSlotsById).find(
      (slot) => slot.slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlot?.surfaceKind).toBe('notepad')
    expect(useNotepadStore.getState().activeNoteId).toBe(noteId)
    expect(container?.textContent).toContain('Open from dashboard')
    expect(container?.textContent).toContain('Switch the current slot into notepad and focus this note.')
  })

  it('opens a sticky note in notepad from a floating dashboard surface while preserving detached host mode', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Floating dashboard handoff',
      body: 'Detached dashboard hosts should swap into notepad cleanly.',
      isPinned: true,
    })

    let dashboardSlotId: string | null = null
    await act(async () => {
      dashboardSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'dashboard',
        surfaceInstanceId: 'dashboard-surface-1',
      })
      useWorkspaceStore.getState().detachViewportSlotSurface(dashboardSlotId ?? '', 'floating')
    })

    ;({ container, root } = await renderAppShell())

    const floatingDashboard = container?.querySelector(
      '.DashboardFloatingWindow[data-workspace-surface-instance-id="dashboard-surface-1"]',
    ) as HTMLDivElement | null
    expect(floatingDashboard).not.toBeNull()

    const menuButton = floatingDashboard?.querySelector(
      '[data-dashboard-sticky-note-menu-button="true"]',
    ) as HTMLButtonElement | null
    expect(menuButton).not.toBeNull()

    await act(async () => {
      menuButton?.click()
    })

    const openButton = floatingDashboard?.querySelector(
      '[data-dashboard-sticky-note-menu-action="open-in-notepad"]',
    ) as HTMLButtonElement | null
    expect(openButton).not.toBeNull()

    await act(async () => {
      openButton?.click()
    })

    expect(useNotepadStore.getState().activeNoteId).toBe(noteId)
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['dashboard-surface-1']).toEqual(
      expect.objectContaining({
        surfaceKind: 'notepad',
        hostMode: 'floating',
      }),
    )
    expect(
      container?.querySelector('.DashboardFloatingWindow[data-workspace-surface-instance-id="dashboard-surface-1"]'),
    ).toBeNull()
    expect(
      container?.querySelector('.NotepadFloatingWindow[data-workspace-surface-instance-id="dashboard-surface-1"]'),
    ).not.toBeNull()
  })

  it('persists dragged sticky-note placement through dashboard widget storage', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Drag me',
      body: 'Move this card and keep the layout.',
      isPinned: true,
    })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)
    mockRect(container?.querySelector('[data-dashboard-lane-board="todo"]'), {
      left: 360,
      top: 180,
      width: 720,
      height: 480,
    })

    const stickyTitleBar = container?.querySelector('.DashboardStickyNoteTitleBar') as HTMLDivElement | null
    expect(stickyTitleBar).not.toBeNull()

    await act(async () => {
      stickyTitleBar?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 1,
          clientX: 400,
          clientY: 220,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 560,
          clientY: 360,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 560,
          clientY: 360,
        }),
      )
    })

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual({
      noteId,
      laneId: 'todo',
      x: 184,
      y: 164,
    })
    expect(
      JSON.parse(window.localStorage.getItem(dashboardStorageKey) ?? 'null'),
    ).toEqual(
      expect.objectContaining({
        stickyNoteLayoutsByNoteId: expect.objectContaining({
          [noteId]: expect.objectContaining({
            noteId,
            laneId: 'todo',
            x: 184,
            y: 164,
          }),
        }),
      }),
    )
  })

  it('hydrates persisted dashboard widget layouts independently from workspace-layout restore', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Recovered dashboard note',
      body: 'Pinned notes should land back on the same board coordinates.',
      isPinned: true,
    })
    const persistedDashboardStateJson = JSON.stringify({
      version: 2,
      lanes: [
        { id: 'todo', title: 'TO DO', order: 0, width: 1 },
        { id: 'completed', title: 'Completed', order: 1, width: 1 },
      ],
      stickyNoteLayoutsByNoteId: {
        [noteId]: {
          noteId,
          laneId: 'completed',
          x: 420,
          y: 168,
        },
      },
    })
    window.localStorage.setItem(dashboardStorageKey, persistedDashboardStateJson)
    const originalStorageGetItem = Storage.prototype.getItem
    const storageGetItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(function (this: Storage, key: string) {
        if (this === window.localStorage && key === dashboardStorageKey) {
          return persistedDashboardStateJson
        }
        return Reflect.apply(originalStorageGetItem, this, [key]) as string | null
      })
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    try {
      ;({ container, root } = await renderAppShell())
      await vi.waitFor(() => {
        expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual({
          noteId,
          laneId: 'completed',
          x: 420,
          y: 168,
        })
      })
      const stickyNote = container?.querySelector(
        '.DashboardSurfaceLane[data-dashboard-lane="completed"] .DashboardStickyNote',
      ) as HTMLElement | null
      expect(stickyNote?.style.left).toBe('420px')
      expect(stickyNote?.style.top).toBe('168px')
    } finally {
      storageGetItemSpy.mockRestore()
    }
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

  it('uses the model viewport header button as an A D F result-mode control', async () => {
    ;({ container, root } = await renderAppShell())

    const slotFrame = Array.from(container?.querySelectorAll('.ViewportFrame') ?? []).find(
      (element) =>
        element.getAttribute('data-workspace-slot-id') === 'workspace-slot-primary' &&
        element.getAttribute('data-workspace-surface-kind') === 'modelViewer',
    ) as HTMLDivElement | undefined
    const modeButton = slotFrame?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null

    expect(modeButton?.textContent).toBe('A')
    expect(modeButton?.getAttribute('aria-label')).toBe(
      'Model Viewport result mode: Auto. Click to switch to Draft.',
    )
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewportResultMode,
    ).toBe('auto')

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(modeButton?.textContent).toBe('D')
    expect(modeButton?.getAttribute('aria-label')).toBe(
      'Model Viewport result mode: Draft. Click to switch to Final.',
    )
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewportResultMode,
    ).toBe('draft')

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(modeButton?.textContent).toBe('F')
    expect(modeButton?.getAttribute('aria-label')).toBe(
      'Model Viewport result mode: Final. Click to switch to Auto.',
    )
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewportResultMode,
    ).toBe('final')

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(modeButton?.textContent).toBe('A')
    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewportResultMode,
    ).toBe('auto')
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

  it('hydrates the shared workspace seam while applying the startup surface on startup', async () => {
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
        viewportSlotRootNodeId: 'workspace-slot-leaf-primary',
        viewportSlotsById: {
          'workspace-slot-primary': {
            slotId: 'workspace-slot-primary',
            surfaceKind: 'homePage',
            surfaceInstanceId: 'home-page-workspace-slot-primary',
            hostMode: 'slotted',
            hostViewportId: 'model-viewer-primary',
            leafNodeId: 'workspace-slot-leaf-primary',
            retainedSurfaceInstanceIdsByKind: {
              homePage: 'home-page-workspace-slot-primary',
            },
          },
        },
        viewportLayoutNodesById: {
          'workspace-slot-leaf-primary': {
            nodeId: 'workspace-slot-leaf-primary',
            kind: 'leaf',
            slotId: 'workspace-slot-primary',
          },
        },
        editorSurfacePlacementById: {
          'editor-viewport-1': persistedEditorSurface,
        },
      }),
    )
    useUiPrefsStore.getState().setWorkspaceStartupSurface('modelViewer')

    ;({ container, root } = await renderAppShell())

    const workspaceState = useWorkspaceStore.getState()
    const primarySlot = container?.querySelector('.ViewportFrame.isPrimarySlot') as HTMLElement | null
    expect(window.confirm).not.toHaveBeenCalled()
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
    expect(
      workspaceState.viewportSlotsById[defaultPrimaryViewportSlotId]?.surfaceKind,
    ).toBe('modelViewer')
    expect(primarySlot?.getAttribute('data-workspace-surface-kind')).toBe('modelViewer')
    expect(primarySlot?.textContent).toContain('Model Viewport')
  })

  it('defaults to Home Page on startup when there is no saved workspace layout', async () => {
    ;({ container, root } = await renderAppShell('homePage'))

    const primarySlot = container?.querySelector('.ViewportFrame.isPrimarySlot') as HTMLElement | null

    expect(window.confirm).not.toHaveBeenCalled()
    expect(primarySlot?.getAttribute('data-workspace-surface-kind')).toBe('homePage')
    expect(primarySlot?.textContent).toContain('Home Page')
    expect(
      useWorkspaceStore.getState().viewportSlotsById[defaultPrimaryViewportSlotId]?.surfaceKind,
    ).toBe('homePage')
  })

  it('can start directly in Model Viewport when the startup preference is turned off', async () => {
    useUiPrefsStore.getState().setWorkspaceStartupSurface('modelViewer')

    ;({ container, root } = await renderAppShell())

    const primarySlot = container?.querySelector('.ViewportFrame.isPrimarySlot') as HTMLElement | null

    expect(window.confirm).not.toHaveBeenCalled()
    expect(primarySlot?.getAttribute('data-workspace-surface-kind')).toBe('modelViewer')
    expect(primarySlot?.textContent).toContain('Model Viewport')
    expect(
      useWorkspaceStore.getState().viewportSlotsById[defaultPrimaryViewportSlotId]?.surfaceKind,
    ).toBe('modelViewer')
  })

  it('starts fresh and leaves the saved layout untouched when workspace restore is turned off', async () => {
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
    useUiPrefsStore.getState().setWorkspaceRestorePersistence(false)
    ;({ container, root } = await renderAppShell('homePage'))

    const workspaceState = useWorkspaceStore.getState()
    expect(window.confirm).not.toHaveBeenCalled()
    expect(workspaceState.leftDockWidth).toBe(useWorkspaceStore.getInitialState().leftDockWidth)
    expect(workspaceState.isLeftDockViewportSplit).toBe(
      useWorkspaceStore.getInitialState().isLeftDockViewportSplit,
    )
    expect(workspaceState.browserShell.isFloating).toBe(false)
    expect(currentSpaghettiState.setEditorViewportPosition).not.toHaveBeenCalled()

    const persisted = JSON.parse(
      window.localStorage.getItem(workspaceLayoutStorageKey) ?? 'null',
    ) as Record<string, unknown> | null

    expect(persisted?.leftDockWidth).toBe(404)
    expect(persisted?.isLeftDockViewportSplit).toBe(true)
    expect(
      (persisted?.browserShell as { isFloating?: boolean } | undefined)?.isFloating,
    ).toBe(true)
    expect(persisted?.primaryViewportId).toBe('model-viewer-primary')
    expect(
      (persisted?.viewportSlotsById as Record<string, { surfaceKind?: string }> | undefined)?.[
        defaultPrimaryViewportSlotId
      ]?.surfaceKind,
    ).not.toBe('homePage')
  })

  it('keeps dashboard and notepad persistence read-only when their Home Page toggles are off', async () => {
    window.localStorage.setItem(
      dashboardStorageKey,
      JSON.stringify({
        version: 4,
        lanes: [
          { id: 'todo', title: 'TO DO', order: 0, width: 1 },
          { id: 'completed', title: 'Completed', order: 1, width: 1 },
        ],
        stickyNoteLayoutsByNoteId: {
          'note-1': { noteId: 'note-1', laneId: 'todo', x: 24, y: 24 },
        },
      }),
    )
    window.localStorage.setItem(
      notepadStorageKey,
      JSON.stringify({
        version: 1,
        notesById: {
          'note-1': {
            id: 'note-1',
            title: 'Persisted note',
            body: 'Kept for later',
            createdAt: '2026-04-19T00:00:00.000Z',
            updatedAt: '2026-04-19T00:00:00.000Z',
            isPinned: true,
            colorPreset: 'yellow',
          },
        },
        noteOrder: ['note-1'],
        activeNoteId: 'note-1',
      }),
    )
    useUiPrefsStore.getState().setDashboardPersistence(false)
    useUiPrefsStore.getState().setNotepadPersistence(false)

    ;({ container, root } = await renderAppShell('homePage'))

    expect(useDashboardStore.getState().lanes.map((lane) => lane.id)).toEqual(['todo', 'completed'])
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId).toEqual({})
    expect(useNotepadStore.getState().noteOrder).toEqual([])
    expect(useNotepadStore.getState().notesById).toEqual({})
    expect(
      JSON.parse(window.localStorage.getItem(dashboardStorageKey) ?? 'null'),
    ).toEqual(
      expect.objectContaining({
        version: 4,
        stickyNoteLayoutsByNoteId: {
          'note-1': { noteId: 'note-1', laneId: 'todo', x: 24, y: 24 },
        },
      }),
    )
    expect(JSON.parse(window.localStorage.getItem(notepadStorageKey) ?? 'null')).toEqual(
      expect.objectContaining({
        version: 1,
        noteOrder: ['note-1'],
        activeNoteId: 'note-1',
      }),
    )

    await act(async () => {
      useDashboardStore.getState().createLane('Review')
      useNotepadStore.getState().createNote({ title: 'Runtime note' })
    })

    expect(
      JSON.parse(window.localStorage.getItem(dashboardStorageKey) ?? 'null'),
    ).toEqual(
      expect.objectContaining({
        version: 4,
        stickyNoteLayoutsByNoteId: {
          'note-1': { noteId: 'note-1', laneId: 'todo', x: 24, y: 24 },
        },
      }),
    )
    expect(JSON.parse(window.localStorage.getItem(notepadStorageKey) ?? 'null')).toEqual(
      expect.objectContaining({
        version: 1,
        noteOrder: ['note-1'],
        activeNoteId: 'note-1',
      }),
    )
  })

  it('wires the Home Page browser launch into the existing shell seam', async () => {
    ;({ container, root } = await renderAppShell('homePage'))

    const openBrowserButton = Array.from(
      container?.querySelectorAll('.HomePageSurfaceLaunchActions button') ?? [],
    ).find((button) => button.textContent === 'Open Browser') as HTMLButtonElement | undefined
    expect(openBrowserButton).not.toBeUndefined()

    await act(async () => {
      openBrowserButton?.click()
    })

    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('browser')
  })

  it('wires the Home Page console launch into the existing shell seam', async () => {
    ;({ container, root } = await renderAppShell('homePage'))

    const openConsoleButton = Array.from(
      container?.querySelectorAll('.HomePageSurfaceLaunchActions button') ?? [],
    ).find((button) => button.textContent === 'Open Console') as HTMLButtonElement | undefined
    expect(openConsoleButton).not.toBeUndefined()

    await act(async () => {
      openConsoleButton?.click()
    })

    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('console')
  })

  it('wires the Home Page model viewport launch into the existing viewer seam', async () => {
    ;({ container, root } = await renderAppShell('homePage'))

    const openModelViewportButton = Array.from(
      container?.querySelectorAll('.HomePageSurfaceLaunchActions button') ?? [],
    ).find(
      (button) => button.textContent === 'Open Model Viewport',
    ) as HTMLButtonElement | undefined
    expect(openModelViewportButton).not.toBeUndefined()

    await act(async () => {
      openModelViewportButton?.click()
    })

    expect(currentAppState.workspaceSelection.activeSurface).toBe('viewer')
    expect(
      useWorkspaceStore.getState().viewportSlotsById[defaultPrimaryViewportSlotId]?.surfaceKind,
    ).toBe('modelViewer')
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

  it('closes the root model viewport back to Home Page through the shared slot menu', async () => {
    ;({ container, root } = await renderAppShell())

    const primaryHeader = container?.querySelector(
      '.ViewportFrame.isPrimarySlot .ViewportFrameHeader',
    ) as HTMLDivElement | null
    expect(primaryHeader).not.toBeNull()

    await act(async () => {
      primaryHeader?.dispatchEvent(
        new MouseEvent('contextmenu', { bubbles: true, cancelable: true }),
      )
    })

    const closeButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionMenu button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Close') as HTMLButtonElement | undefined

    expect(closeButton).not.toBeUndefined()
    expect(closeButton?.disabled).toBe(false)

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const primarySlot = container?.querySelector('.ViewportFrame.isPrimarySlot') as HTMLElement | null
    const workspaceState = useWorkspaceStore.getState()

    expect(primarySlot?.getAttribute('data-workspace-surface-kind')).toBe('homePage')
    expect(primarySlot?.textContent).toContain('Home Page')
    expect(
      workspaceState.viewportSlotsById[defaultPrimaryViewportSlotId]?.surfaceKind,
    ).toBe('homePage')
    expect(
      Object.values(workspaceState.viewportSlotsById).some((slot) => slot.surfaceKind === 'modelViewer'),
    ).toBe(false)
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
    const resizeHandle = container?.querySelector(
      '.PrimaryViewportLeftDockResizeHandle',
    ) as HTMLDivElement | null

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
    const splitViewportButton = Array.from(
      container?.querySelectorAll('.PrimaryViewportLeftDockResizeMenuAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Split Viewport') as
      | HTMLButtonElement
      | undefined
    expect(splitViewportButton).not.toBeUndefined()

    await act(async () => {
      splitViewportButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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
    const splitViewportButton = Array.from(
      container?.querySelectorAll('.PrimaryViewportLeftDockResizeMenuAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Split Viewport') as
      | HTMLButtonElement
      | undefined
    expect(splitViewportButton).not.toBeUndefined()

    await act(async () => {
      splitViewportButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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

    expect(
      container?.querySelector('.PrimaryViewportLeftDockPanelTarget--meatball-editor')?.classList.contains(
        'isOccupied',
      ),
    ).toBe(true)
    expect(container?.textContent).not.toContain('Parts List Panel')
    expect(container?.textContent).not.toContain('Legacy Box Panel')
    expect(container?.querySelector('.SpaghettiMeatballHost')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiMeatballHost .SpaghettiFloatingHandle')).not.toBeNull()
    expect(container?.textContent).toContain('Spaghetti Panel editor-viewport-1')
    expect(container?.querySelector('.SpaghettiFloatingDock')).toBeNull()
  })

  it('keeps the meatball dock target collapsed when no meatball editor view is active', async () => {
    ;({ container, root } = await renderAppShell())

    expect(
      container?.querySelector('.PrimaryViewportLeftDockPanelTarget--meatball-editor')?.classList.contains(
        'isOccupied',
      ),
    ).toBe(false)
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
    const titleStatusZone = container?.querySelector('.PrimaryViewportLeftDockStatus') as HTMLElement | null
    const dockedBrowserHost = container?.querySelector(
      '.PrimaryViewportLeftDockPanelTarget--browser',
    ) as HTMLElement | null
    let resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
    expect(leftDock).not.toBeNull()
    expect(titleStatusZone).not.toBeNull()
    expect(dockedBrowserHost).not.toBeNull()
    expect(resizeHandle).not.toBeNull()
    expect(leftDock?.style.width).toBe('320px')
    expect(titleStatusZone?.dataset.leftDockSharedWidth).toBe('320')
    expect(dockedBrowserHost?.dataset.leftDockSharedWidth).toBe('320')

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
    expect(titleStatusZone?.dataset.leftDockSharedWidth).toBe('392')
    expect(dockedBrowserHost?.dataset.leftDockSharedWidth).toBe('392')
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

  it('lets the resize-handle menu switch left dock viewport split on and off', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    let resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
    expect(resizeHandle?.classList.contains('isViewportSplit')).toBe(false)
    expect(container?.querySelector('button[aria-label="Toggle left dock viewport split"]')).toBeNull()

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

    let splitToggle = Array.from(
      container?.querySelectorAll('.PrimaryViewportLeftDockResizeMenuAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Split Viewport') as
      | HTMLButtonElement
      | undefined
    expect(splitToggle).not.toBeUndefined()

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
    splitToggle = Array.from(
      container?.querySelectorAll('.PrimaryViewportLeftDockResizeMenuAction') ?? [],
    ).find((element) => element.textContent?.trim() === 'Unsplit Viewport') as
      | HTMLButtonElement
      | undefined
    expect(splitToggle).not.toBeUndefined()

    await act(async () => {
      splitToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    workspaceState = useWorkspaceStore.getState()
    rootNode = workspaceState.viewportLayoutNodesById[workspaceState.viewportSlotRootNodeId]
    resizeHandle = container?.querySelector('.PrimaryViewportLeftDockResizeHandle') as HTMLDivElement | null
    expect(rootNode?.kind).toBe('leaf')
    expect(resizeHandle?.classList.contains('isViewportSplit')).toBe(false)
    expect(resizeHandle?.classList.contains('isSlotSplitActive')).toBe(false)
    expect(container?.querySelector('button[aria-label="Toggle left dock viewport split"]')).toBeNull()
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

  it('marks radio as an optional background-runtime family without onboarding it into workspace surfaces', async () => {
    ;({ container, root } = await renderAppShell())
    mockShellGeometry(container)

    await act(async () => {
      useAudioSamplerStore.getState().openRadioToolbar()
    })

    const radioFamily = container?.querySelector('.AppShellRadioRuntimeFamily')
    expect(radioFamily).not.toBeNull()
    expect(radioFamily?.getAttribute('data-radio-support-classification')).toBe(
      RADIO_SUPPORT_PROFILE.classification,
    )
    expect(radioFamily?.getAttribute('data-radio-requires-workspace-surface')).toBe('false')
    expect(container?.textContent).toContain(RADIO_SUPPORT_PROFILE.label)
    expect(
      container?.querySelector('.ViewportFrame[data-workspace-surface-kind="radio"]'),
    ).toBeNull()
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
