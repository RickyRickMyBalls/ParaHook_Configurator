import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ErrorInfo,
  type MouseEvent as ReactMouseEvent,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { SpaghettiPanel } from '../panels/SpaghettiPanel'
import {
  defaultSpaghettiWindowAppearance,
  mergeSpaghettiWindowAppearance,
  type SpaghettiWindowAppearance,
} from '../panels/spaghettiWindowAppearance'
import {
  defaultViewportPosition,
  defaultViewportSize,
  selectActiveEditorViewport,
  selectEditorViewportById,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import { useAppStore } from '../store/useAppStore'
import { useWorkspaceChildWindow } from '../workspace/useWorkspaceChildWindow'
import {
  defaultWorkspaceSplitDirection,
  resolveDefaultWorkspaceSplitDockSide,
  defaultWorkspaceSplitPriority,
  type WorkspaceSplitDockSide,
} from '../workspace/workspaceSplitTypes'
import {
  createDefaultEditorPopoutState,
  defaultEditorSurfacePosition,
  defaultEditorSurfaceSize,
  type LeftDockPanelId,
} from '../workspace/workspaceShellTypes'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'

type FloatingPosition = {
  x: number
  y: number
}

type FloatingSize = {
  width: number
  height: number
}

const initialFloatingPosition: FloatingPosition = defaultViewportPosition
const initialFloatingSize: FloatingSize = defaultViewportSize

const minFloatingWidth = 200
const minFloatingHeight = 200
const floatingEdgePadding = 12
const minVisibleFloatingHandleHeight = 56
const splitDividerHeight = 10
const normalizedFloatingHeightRatio = 0.9
const floatingDockLockGap = 25
const spaghettiPopoutBackground = 'rgb(5, 7, 11)'

type WorkspaceSurface = 'spaghetti' | 'browser' | 'console' | 'viewer' | null

type SpaghettiPopoutErrorBoundaryProps = {
  children: ReactNode
}

type SpaghettiPopoutErrorBoundaryState = {
  hasError: boolean
  message: string
}

class SpaghettiPopoutErrorBoundary extends Component<
  SpaghettiPopoutErrorBoundaryProps,
  SpaghettiPopoutErrorBoundaryState
> {
  public state: SpaghettiPopoutErrorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: unknown): SpaghettiPopoutErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unknown detached Spaghetti popup error.',
    }
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error('Detached Spaghetti popup render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="SpaghettiFloatingWindow SpaghettiPopoutContent">
          <div className="SpaghettiFloatingBody">
            <div className="V15Error">
              Detached Spaghetti popup crashed: {this.state.message}
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function SpaghettiWindowTitleBar(props: {
  editorViewportId: string
  onPrimaryViewModeCycle: () => void
  onActionTrayToggle: () => void
  onWindowSettingsToggle: () => void
  onHeaderToggle: () => void
  onCanvasToolbarToggle: () => void
  onMeatball: () => void
  onMaximizeToggle: () => void
  onSplitToggle: () => void
  onTogglePopout?: () => void
  onClose: () => void
  onDragStart?: (event: ReactPointerEvent<HTMLDivElement>) => void
  onShellClick?: (event: ReactMouseEvent<HTMLDivElement>) => void
  onContextMenu?: (event: ReactMouseEvent<HTMLDivElement>) => void
  isCollapsed: boolean
  isActionTrayExpanded: boolean
  isWindowSettingsOpen: boolean
  isHeaderCollapsed: boolean
  isCanvasToolbarVisible: boolean
  isMeatball?: boolean
  isEssentials?: boolean
  isMaximized: boolean
  isSplit: boolean
  popoutButtonMode?: 'popout' | 'dock'
}) {
  const {
    editorViewportId,
    isCollapsed,
    isActionTrayExpanded,
    isWindowSettingsOpen,
    isHeaderCollapsed,
    isCanvasToolbarVisible,
    isMeatball = false,
    isEssentials = false,
    isMaximized,
    isSplit,
    onClose,
    onActionTrayToggle,
    onPrimaryViewModeCycle,
    onWindowSettingsToggle,
    onCanvasToolbarToggle,
    onDragStart,
    onHeaderToggle,
    onMaximizeToggle,
    onMeatball,
    onSplitToggle,
    onTogglePopout,
    onShellClick,
    onContextMenu,
    popoutButtonMode = 'popout',
  } = props
  const requestBrowserGraphDocumentBuild = useAppStore(
    (state) => state.requestBrowserGraphDocumentBuild,
  )
  const viewport = useSpaghettiStore((state) => selectEditorViewportById(state, editorViewportId))
  const graphDocumentId = viewport?.graphDocumentId ?? ''
  const primaryModeButtonLabel = isCollapsed ? '+' : isEssentials ? 'e' : '-'
  const primaryModeButtonAriaLabel = isCollapsed
    ? 'Restore expanded editor'
    : isEssentials
      ? 'Collapse editor from essentials mode'
      : 'Switch editor to essentials mode'
  const primaryModeButtonTitle = isCollapsed
    ? 'Restore expanded editor'
    : isEssentials
      ? 'Collapse editor from essentials mode'
      : 'Switch editor to essentials mode'

  const stopPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleBuild = () => {
    if (graphDocumentId.length === 0) {
      return
    }
    requestBrowserGraphDocumentBuild(graphDocumentId, {
      explicit: true,
    })
  }

  if (isEssentials) {
    return (
      <div className="SpaghettiFloatingHandle SpaghettiFloatingHandle--essentials">
        <button
          type="button"
          className="SpaghettiWindowAction SpaghettiWindowAction--collapse isActive"
          onPointerDown={stopPointer}
          onClick={onPrimaryViewModeCycle}
          aria-label={primaryModeButtonAriaLabel}
          aria-expanded={!isCollapsed}
          title={primaryModeButtonTitle}
        >
          {primaryModeButtonLabel}
        </button>
      </div>
    )
  }

  return (
    <div
      className={`SpaghettiFloatingHandle ${isMeatball ? 'isMeatball' : ''}`}
      onPointerDown={onDragStart}
      onClick={onShellClick}
      onContextMenu={onContextMenu}
    >
      <div className="SpaghettiFloatingHandleStart">
        <button
          type="button"
          className={`SpaghettiWindowAction SpaghettiWindowAction--collapse ${
            isCollapsed || isEssentials ? 'isActive' : ''
          }`}
          onPointerDown={stopPointer}
          onClick={onPrimaryViewModeCycle}
          aria-label={primaryModeButtonAriaLabel}
          aria-expanded={!isCollapsed}
          title={primaryModeButtonTitle}
        >
          {primaryModeButtonLabel}
        </button>
        <span className="SpaghettiFloatingHandleTitle">
          {isMeatball ? 'Meatball Editor' : 'Spaghetti Editor'}
        </span>
      </div>
      <div className="SpaghettiFloatingHandleRow">
        <div className="SpaghettiFloatingHandleActions">
          <button
            type="button"
            className="SpaghettiWindowAction SpaghettiWindowAction--build"
            onPointerDown={stopPointer}
            onClick={handleBuild}
            disabled={graphDocumentId.length === 0}
            aria-label="Compile and build graph"
            title="Compile and build graph"
          >
            []
          </button>
          <div
            className={`SpaghettiFloatingHandleAdvancedActions ${
              isActionTrayExpanded ? 'isExpanded' : ''
            }`}
            aria-hidden={!isActionTrayExpanded}
          >
            <button
              type="button"
              className={`SpaghettiWindowAction ${isWindowSettingsOpen ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onWindowSettingsToggle}
              aria-label={isWindowSettingsOpen ? 'Close window settings' : 'Open window settings'}
              title={isWindowSettingsOpen ? 'Close window settings' : 'Open window settings'}
            >
              i
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction ${!isHeaderCollapsed ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onHeaderToggle}
              aria-label={isHeaderCollapsed ? 'Expand spaghetti toolbar' : 'Collapse spaghetti toolbar'}
              title={isHeaderCollapsed ? 'Expand spaghetti toolbar' : 'Collapse spaghetti toolbar'}
            >
              t
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction ${isCanvasToolbarVisible ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onCanvasToolbarToggle}
              aria-label={isCanvasToolbarVisible ? 'Hide canvas toolbar' : 'Show canvas toolbar'}
              title={isCanvasToolbarVisible ? 'Hide canvas toolbar' : 'Show canvas toolbar'}
            >
              c
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction SpaghettiWindowAction--meatball ${
                isMeatball ? 'isActive' : ''
              }`}
              onPointerDown={stopPointer}
              onClick={onMeatball}
              aria-label={isMeatball ? 'Return to spaghetti editor' : 'Move editor to meatball editor view'}
              title={isMeatball ? 'Return to spaghetti editor' : 'Move editor to meatball editor view'}
            >
              {isMeatball ? 'MB' : 'SP'}
            </button>
          </div>
          <button
            type="button"
            className={`SpaghettiWindowAction SpaghettiWindowActionTrayToggle ${
              isActionTrayExpanded ? 'isActive' : ''
            }`}
            onPointerDown={stopPointer}
            onClick={onActionTrayToggle}
            aria-label={isActionTrayExpanded ? 'Collapse titlebar actions' : 'Expand titlebar actions'}
            title={isActionTrayExpanded ? 'Collapse titlebar actions' : 'Expand titlebar actions'}
          >
            {isActionTrayExpanded ? '>' : '<'}
          </button>
          <div className="SpaghettiFloatingHandleCoreActions">
            <button
              type="button"
              className={`SpaghettiWindowAction ${isMaximized ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onMaximizeToggle}
              aria-label={isMaximized ? 'Restore editor to floating size' : 'Maximize editor'}
              title={isMaximized ? 'Restore editor to floating size' : 'Maximize editor'}
            >
              []
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction ${isSplit ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onSplitToggle}
              aria-label={isSplit ? 'Exit split view' : 'Enter split view'}
              title={isSplit ? 'Exit split view' : 'Enter split view'}
            >
              ==
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction ${
                popoutButtonMode === 'dock' ? 'isActive' : ''
              }`}
              onPointerDown={stopPointer}
              onClick={onTogglePopout}
              aria-label={
                popoutButtonMode === 'dock'
                  ? 'Dock editor back into workspace'
                  : 'Pop editor out into browser window'
              }
              title={
                popoutButtonMode === 'dock'
                  ? 'Dock editor back into workspace'
                  : 'Pop editor out into browser window'
              }
            >
              {popoutButtonMode === 'dock' ? 'DK' : 'PO'}
            </button>
            <button
              type="button"
              className="SpaghettiWindowAction"
              onPointerDown={stopPointer}
              onClick={onClose}
              aria-label="Close editor"
              title="Close editor"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SpaghettiPopoutSurfaceHost(props: {
  editorViewportId: string
  popoutState: ReturnType<typeof createDefaultEditorPopoutState>
  workspaceActiveSurface: WorkspaceSurface
  onActivateSpaghettiSurface: () => void
  onActivateViewport: (editorViewportId: string) => void
  onActivateSpaghettiFloatingWindow: () => void
  claimPendingWindow?: (editorViewportId: string) => Window | null
  onClosed: (editorViewportId: string) => void
  onBlocked: (editorViewportId: string) => void
  children: ReactNode
}) {
  const {
    editorViewportId,
    popoutState,
    workspaceActiveSurface,
    onActivateSpaghettiSurface,
    onActivateViewport,
    onActivateSpaghettiFloatingWindow,
    claimPendingWindow,
    onClosed,
    onBlocked,
    children,
  } = props

  const claimPendingWindowForViewport = useCallback(
    () => claimPendingWindow?.(editorViewportId) ?? null,
    [claimPendingWindow, editorViewportId],
  )
  const handleBlocked = useCallback(() => {
    onBlocked(editorViewportId)
  }, [editorViewportId, onBlocked])
  const handleClosed = useCallback(() => {
    onClosed(editorViewportId)
  }, [editorViewportId, onClosed])

  const { childWindow, host } = useWorkspaceChildWindow({
    isOpen: true,
    spec: popoutState,
    rootClassName: 'SpaghettiPopoutRoot',
    bodyBackground: spaghettiPopoutBackground,
    claimPendingWindow: claimPendingWindowForViewport,
    onBlocked: handleBlocked,
    onClosed: handleClosed,
  })

  useEffect(() => {
    if (childWindow === null) {
      return
    }
    const handleFocus = () => {
      onActivateViewport(editorViewportId)
      onActivateSpaghettiFloatingWindow()
    }
    childWindow.addEventListener('focus', handleFocus)
    return () => {
      childWindow.removeEventListener('focus', handleFocus)
    }
  }, [childWindow, editorViewportId, onActivateSpaghettiFloatingWindow, onActivateViewport])

  if (host === null) {
    return null
  }

  return createPortal(
    <div className="SpaghettiPopoutSurface" onPointerDownCapture={onActivateSpaghettiSurface}>
      <div
        className={`SpaghettiPopoutWindow SpaghettiWindowShell ${
          workspaceActiveSurface === 'spaghetti' ? 'isActiveWindow' : ''
        }`}
        onPointerDown={() => onActivateViewport(editorViewportId)}
      >
        {children}
      </div>
    </div>,
    host,
  )
}

type SpaghettiWindowHostProps = {
  appShellRef: RefObject<HTMLDivElement | null>
  viewportRef: RefObject<HTMLElement | null>
  dockedMeatballHostRef: RefObject<HTMLDivElement | null>
  leftDockWidth: number
  isLeftDockViewportSplit: boolean
  activeLeftDockPreviewPanelId: LeftDockPanelId | null
  setActiveLeftDockPreviewPanelId: (panelId: LeftDockPanelId | null) => void
  resolveLeftDockPreviewPanelId: (
    panelId: LeftDockPanelId,
    clientX: number,
    clientY: number,
  ) => LeftDockPanelId | null
  viewerSurface: ReactNode
  workspaceActiveSurface: 'spaghetti' | 'browser' | 'console' | 'viewer' | null
  onActivateSpaghettiSurface: () => void
  onActivateSpaghettiFloatingWindow: () => void
  onOpenFloatingSplitMenu: (event: ReactMouseEvent<HTMLDivElement>) => void
  onOpenDividerSplitMenu: (event: ReactMouseEvent<HTMLElement>) => void
  onResetSplitRatio: () => void
  leftDockWidthPreviewHandlerRef: MutableRefObject<((nextWidth: number) => void) | null>
}

export function SpaghettiWindowHost(props: SpaghettiWindowHostProps) {
  const {
    appShellRef,
    viewportRef,
    dockedMeatballHostRef,
    leftDockWidth,
    isLeftDockViewportSplit,
    activeLeftDockPreviewPanelId,
    setActiveLeftDockPreviewPanelId,
    resolveLeftDockPreviewPanelId,
    viewerSurface,
    workspaceActiveSurface,
    onActivateSpaghettiSurface,
    onActivateSpaghettiFloatingWindow,
    onOpenFloatingSplitMenu,
    onOpenDividerSplitMenu,
    onResetSplitRatio,
    leftDockWidthPreviewHandlerRef,
  } = props
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const editorViewportsById = useSpaghettiStore((state) => state.editorViewportsById) ?? {}
  const editorViewportOrder = useSpaghettiStore((state) => state.editorViewportOrder) ?? []
  const headerCollapsedByViewportId = useSpaghettiStore(
    (state) => state.editorViewportHeaderCollapsedById,
  ) ?? {}
  const canvasToolbarVisibleByViewportId = useSpaghettiStore(
    (state) => state.editorViewportCanvasToolbarVisibleById,
  ) ?? {}
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const setEditorViewportWindowMode = useSpaghettiStore((state) => state.setEditorViewportWindowMode)
  const setEditorViewportHeaderCollapsed = useSpaghettiStore(
    (state) => state.setEditorViewportHeaderCollapsed,
  )
  const setEditorViewportCanvasToolbarVisible = useSpaghettiStore(
    (state) => state.setEditorViewportCanvasToolbarVisible,
  )
  const setEditorViewportPresentationMode = useSpaghettiStore(
    (state) => state.setEditorViewportPresentationMode,
  )
  const setEditorViewportSplitRatio = useSpaghettiStore((state) => state.setEditorViewportSplitRatio)
  const setEditorViewportSplitDockSide = useSpaghettiStore(
    (state) => state.setEditorViewportSplitDockSide,
  )
  const setEditorViewportPosition = useSpaghettiStore((state) => state.setEditorViewportPosition)
  const setEditorViewportSize = useSpaghettiStore((state) => state.setEditorViewportSize)
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
  const editorSurfacePlacementById = useWorkspaceStore((state) => state.editorSurfacePlacementById)
  const activeEditorSurface =
    activeEditorViewportId.length > 0 ? editorSurfacePlacementById[activeEditorViewportId] ?? null : null
  const orderedEditorViewports = useMemo(
    () =>
      editorViewportOrder
        .map((editorViewportId) => editorViewportsById[editorViewportId] ?? null)
        .filter((viewport) => viewport !== null),
    [editorViewportOrder, editorViewportsById],
  )
  const [dockedMeatballPortalTarget, setDockedMeatballPortalTarget] = useState<HTMLDivElement | null>(
    null,
  )
  const [windowSettingsOpenByViewportId, setWindowSettingsOpenByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [actionTrayExpandedByViewportId, setActionTrayExpandedByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [windowAppearanceByViewportId, setWindowAppearanceByViewportId] = useState<
    Record<string, SpaghettiWindowAppearance>
  >({})
  const [floatingSpaghettiPortalTarget, setFloatingSpaghettiPortalTarget] =
    useState<HTMLDivElement | null>(null)
  const [windowClampEditingByViewportId, setWindowClampEditingByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [headerToggleRevisionByViewportId, setHeaderToggleRevisionByViewportId] = useState<
    Record<string, number>
  >({})
  const [splitDockPreviewSide, setSplitDockPreviewSide] = useState<WorkspaceSplitDockSide | null>(null)
  const floatingPosRef = useRef<FloatingPosition>(initialFloatingPosition)
  const floatingSizeRef = useRef<FloatingSize>(initialFloatingSize)
  const splitDockPreviewSideRef = useRef<WorkspaceSplitDockSide | null>(null)
  const floatingDockLockRef = useRef<{
    editorViewportId: string
  } | null>(null)
  const dragRef = useRef<{
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null>(null)
  const resizeRef = useRef<{
    startPointerX: number
    startPointerY: number
    startWidth: number
    startHeight: number
  } | null>(null)
  const meatballDockDragIntentRef = useRef<{
    startClientX: number
    startClientY: number
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const splitTitlebarDragIntentRef = useRef<{
    startClientX: number
    startClientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null>(null)
  const splitResizeRef = useRef<{
    viewportTop: number
    viewportHeight: number
  } | null>(null)
  const lastLeftDockWidthRef = useRef<number | null>(null)
  const pendingPopoutWindowByViewportIdRef = useRef<Record<string, Window | null>>({})

  const activeWindowMode = activeEditorSurface?.windowMode ?? activeEditorViewport?.windowMode ?? null
  const showEditorSurface = activeEditorViewport !== null
  const isHeaderCollapsed =
    activeEditorViewport === null
      ? false
      : (headerCollapsedByViewportId[activeEditorViewport.editorViewportId] ?? false)
  const headerToggleRevision =
    activeEditorViewport === null
      ? 0
      : (headerToggleRevisionByViewportId[activeEditorViewport.editorViewportId] ?? 0)
  const isCanvasToolbarVisible =
    activeEditorViewport === null
      ? true
      : (canvasToolbarVisibleByViewportId[activeEditorViewport.editorViewportId] ?? true)
  const showSplitLayout = showEditorSurface && activeWindowMode === 'split view'
  const showMeatballDock = showEditorSurface && activeWindowMode === 'meatball editor view'
  const showFloatingShell =
    showEditorSurface &&
    (activeWindowMode === 'expanded' ||
      activeWindowMode === 'maximized' ||
      activeWindowMode === 'collapsed')
  const isEssentials =
    activeEditorViewport !== null &&
    activeWindowMode === 'maximized' &&
    isHeaderCollapsed &&
    !isCanvasToolbarVisible
  const canDragFloatingWindow =
    activeWindowMode === 'expanded' || activeWindowMode === 'collapsed'
  const canResizeFloatingWindow = activeWindowMode === 'expanded'
  const activeEditorPosition =
    activeEditorSurface?.position ?? activeEditorViewport?.position ?? defaultEditorSurfacePosition
  const activeEditorSize =
    activeEditorSurface?.size ?? activeEditorViewport?.size ?? defaultEditorSurfaceSize
  const splitRatio = activeEditorSurface?.splitRatio ?? activeEditorViewport?.splitRatio ?? 0.5
  const splitDirection =
    activeEditorSurface?.splitDirection ??
    activeEditorViewport?.splitDirection ??
    defaultWorkspaceSplitDirection
  const splitDockSide =
    activeEditorSurface?.splitDockSide ??
    activeEditorViewport?.splitDockSide ??
    resolveDefaultWorkspaceSplitDockSide(splitDirection)
  const splitPriority =
    activeEditorSurface?.splitPriority ??
    activeEditorViewport?.splitPriority ??
    defaultWorkspaceSplitPriority
  const splitDirectionClass =
    splitDirection === 'vertical' ? 'isVertical' : 'isHorizontal'
  const splitPriorityClass =
    splitPriority === 'favorFirst'
      ? 'isFavorFirst'
      : splitPriority === 'favorSecond'
        ? 'isFavorSecond'
        : 'isBalanced'
  const splitDockSideClass =
    splitDockSide === 'left'
      ? 'isEditorLeft'
      : splitDockSide === 'right'
        ? 'isEditorRight'
        : splitDockSide === 'top'
          ? 'isEditorTop'
          : 'isEditorBottom'
  const isWindowSettingsOpen =
    activeEditorViewport === null
      ? false
      : (windowSettingsOpenByViewportId[activeEditorViewport.editorViewportId] ?? false)
  const savedActionTrayExpanded =
    activeEditorViewport === null
      ? false
      : (actionTrayExpandedByViewportId[activeEditorViewport.editorViewportId] ?? false)
  const isActionTrayExpanded = activeWindowMode === 'maximized' ? true : savedActionTrayExpanded
  const activeWindowAppearance =
    activeEditorViewport === null
      ? defaultSpaghettiWindowAppearance
      : (windowAppearanceByViewportId[activeEditorViewport.editorViewportId] ??
        defaultSpaghettiWindowAppearance)
  const isWindowClampEditing =
    activeEditorViewport === null
      ? false
      : (windowClampEditingByViewportId[activeEditorViewport.editorViewportId] ?? false)

  const getFloatingShellFrame = useCallback(() => {
    const shellElement = appShellRef.current
    const viewportElement = viewportRef.current
    const shellRect = shellElement?.getBoundingClientRect()
    const viewportRect = viewportElement?.getBoundingClientRect()
    if (
      shellElement === null ||
      viewportElement === null ||
      shellRect === undefined ||
      viewportRect === undefined
    ) {
      return null
    }
    return {
      shellWidth: shellElement.clientWidth,
      shellHeight: shellElement.clientHeight,
      offsetLeft: Math.round(viewportRect.left - shellRect.left),
      offsetTop: Math.round(viewportRect.top - shellRect.top),
      viewportWidth: viewportElement.clientWidth,
      viewportHeight: viewportElement.clientHeight,
    }
  }, [appShellRef, viewportRef])

  const getFloatingShellLimits = useCallback(() => {
    const frame = getFloatingShellFrame()
    if (frame === null || frame.shellWidth <= 0 || frame.shellHeight <= 0) {
      return null
    }
    return {
      maxWidth: Math.max(minFloatingWidth, frame.shellWidth - 24),
      maxHeight: Math.max(minFloatingHeight, frame.shellHeight - 24),
    }
  }, [getFloatingShellFrame])

  const getWindowAppearanceStyle = useCallback((appearance: SpaghettiWindowAppearance) => {
    const titlebarTintById: Record<
      SpaghettiWindowAppearance['titlebarTint'],
      { start: [number, number, number]; end: [number, number, number] }
    > = {
      default: {
        start: [24, 28, 36],
        end: [6, 8, 12],
      },
      slate: {
        start: [32, 36, 44],
        end: [10, 12, 16],
      },
      blue: {
        start: [20, 34, 62],
        end: [6, 10, 18],
      },
      green: {
        start: [20, 44, 38],
        end: [6, 14, 12],
      },
      red: {
        start: [64, 24, 28],
        end: [16, 6, 8],
      },
    }
    const bodyTintById: Record<
      SpaghettiWindowAppearance['bodyTint'],
      {
        backgroundRgb: [number, number, number]
        backgroundAlpha: number
        borderRgb: [number, number, number]
        borderAlpha: number
      }
    > = {
      default: {
        backgroundRgb: [20, 20, 24],
        backgroundAlpha: 0.9,
        borderRgb: [255, 255, 255],
        borderAlpha: 0.14,
      },
      'cool-dark': {
        backgroundRgb: [16, 22, 30],
        backgroundAlpha: 0.9,
        borderRgb: [120, 166, 255],
        borderAlpha: 0.16,
      },
      'neutral-dark': {
        backgroundRgb: [24, 24, 24],
        backgroundAlpha: 0.92,
        borderRgb: [255, 255, 255],
        borderAlpha: 0.12,
      },
      'glass-dark': {
        backgroundRgb: [14, 18, 28],
        backgroundAlpha: 0.76,
        borderRgb: [180, 198, 255],
        borderAlpha: 0.18,
      },
    }
    const fontSizeById: Record<SpaghettiWindowAppearance['fontScale'], string> = {
      sm: '11px',
      md: '12px',
      lg: '13px',
    }
    const fontFamilyById: Record<SpaghettiWindowAppearance['fontFamily'], string> = {
      default: '"Segoe UI", sans-serif',
      mono: '"Consolas", "Courier New", monospace',
      serif: '"Georgia", "Times New Roman", serif',
    }
    const paddingScaleById: Record<
      SpaghettiWindowAppearance['paddingScale'],
      { x: string; y: string; gap: string }
    > = {
      tight: { x: '6px', y: '6px', gap: '6px' },
      normal: { x: '8px', y: '8px', gap: '8px' },
      loose: { x: '10px', y: '10px', gap: '10px' },
    }
    const bodyTint = bodyTintById[appearance.bodyTint]
    const titlebarTint = titlebarTintById[appearance.titlebarTint]
    const paddingScale = paddingScaleById[appearance.paddingScale]
    const shellInsetX = `${Math.round(appearance.bodyInsetX * 12)}px`
    const shellInsetY = `${Math.round(appearance.bodyInsetY * 12)}px`
    const titlebarAlpha = Math.max(0.2, Math.min(1, appearance.titlebarOpacity * 0.96))
    const bodyAlpha = Math.max(0.2, Math.min(1, bodyTint.backgroundAlpha * appearance.windowOpacity))
    const borderAlpha = Math.max(0.08, Math.min(0.6, bodyTint.borderAlpha * appearance.windowOpacity))
    return {
      '--sp-window-opacity': `${appearance.windowOpacity}`,
      '--sp-graph-content-opacity': `${appearance.graphContentOpacity}`,
      '--sp-window-body-rgb': `${bodyTint.backgroundRgb.join(', ')}`,
      '--sp-window-body-alpha': `${bodyAlpha}`,
      '--sp-window-titlebar-bg': `linear-gradient(180deg, rgba(${titlebarTint.start.join(
        ', ',
      )}, ${titlebarAlpha}) 0%, rgba(${titlebarTint.end.join(', ')}, ${titlebarAlpha}) 100%)`,
      '--sp-window-body-bg': `rgba(${bodyTint.backgroundRgb.join(', ')}, ${bodyAlpha})`,
      '--sp-window-body-border': `rgba(${bodyTint.borderRgb.join(', ')}, ${borderAlpha})`,
      '--sp-window-font-size': fontSizeById[appearance.fontScale],
      '--sp-window-font-family': fontFamilyById[appearance.fontFamily],
      '--sp-window-pad-x': paddingScale.x,
      '--sp-window-pad-y': paddingScale.y,
      '--sp-window-gap': paddingScale.gap,
      '--sp-window-shell-pad-x': shellInsetX,
      '--sp-window-shell-pad-y': shellInsetY,
    } as CSSProperties
  }, [])

  const clampFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getFloatingShellLimits()
      if (limits === null) {
        return {
          width: Math.max(minFloatingWidth, Math.round(size.width)),
          height: Math.max(minFloatingHeight, Math.round(size.height)),
        }
      }
      return {
        width: Math.min(limits.maxWidth, Math.max(minFloatingWidth, Math.round(size.width))),
        height: Math.min(limits.maxHeight, Math.max(minFloatingHeight, Math.round(size.height))),
      }
    },
    [getFloatingShellLimits],
  )

  const normalizeFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getFloatingShellLimits()
      if (limits === null) {
        return {
          width: Math.max(minFloatingWidth, Math.round(size.width)),
          height: Math.max(minFloatingHeight, Math.round(size.height)),
        }
      }
      const clamped = clampFloatingSize(size)
      const isDefaultSize =
        size.width === defaultViewportSize.width && size.height === defaultViewportSize.height

      if (!isDefaultSize) {
        return clamped
      }

      return {
        width: clamped.width,
        height: Math.min(
          limits.maxHeight,
          Math.max(minFloatingHeight, Math.round(limits.maxHeight * normalizedFloatingHeightRatio)),
        ),
      }
    },
    [clampFloatingSize, getFloatingShellLimits],
  )

  const clampFloatingPos = useCallback(
    (pos: FloatingPosition): FloatingPosition => {
      const frame = getFloatingShellFrame()
      if (
        frame === null ||
        frame.shellWidth <= 0 ||
        frame.shellHeight <= 0
      ) {
        return {
          x: Math.max(0, Math.round(pos.x)),
          y: Math.max(0, Math.round(pos.y)),
        }
      }
      const minX = -frame.offsetLeft
      const maxX = Math.max(
        minX,
        frame.shellWidth - frame.offsetLeft - floatingSizeRef.current.width - floatingEdgePadding,
      )
      const minY = -frame.offsetTop
      const maxY = Math.max(
        minY,
        frame.shellHeight - frame.offsetTop - minVisibleFloatingHandleHeight,
      )
      return {
        x: Math.min(maxX, Math.max(minX, Math.round(pos.x))),
        y: Math.min(maxY, Math.max(minY, Math.round(pos.y))),
      }
    },
    [getFloatingShellFrame],
  )

  const resolveDockLockedFloatingPos = useCallback(
    (nextLeftDockWidth: number): FloatingPosition | null => {
      if (
        activeEditorViewport === null ||
        (activeWindowMode !== 'expanded' && activeWindowMode !== 'collapsed')
      ) {
        return null
      }
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (viewportRect === undefined) {
        return null
      }
      const lockBoundaryX = Math.max(
        0,
        Math.round(nextLeftDockWidth - viewportRect.left + floatingDockLockGap),
      )
      const isLockedToDock =
        floatingDockLockRef.current?.editorViewportId === activeEditorViewport.editorViewportId
      if (!isLockedToDock && floatingPosRef.current.x >= lockBoundaryX) {
        return null
      }
      return clampFloatingPos({
        x: lockBoundaryX,
        y: floatingPosRef.current.y,
      })
    },
    [activeEditorViewport, clampFloatingPos, viewportRef],
  )

  const resolveSplitDockPreviewSide = useCallback(
    (candidate: FloatingPosition, titleBarHeight: number): WorkspaceSplitDockSide | null => {
      const viewportElement = viewportRef.current
      if (
        viewportElement === null ||
        viewportElement.clientWidth <= 0 ||
        viewportElement.clientHeight <= 0
      ) {
        return null
      }
      const edgeThreshold = 20
      const edgeDistances: Array<{ side: WorkspaceSplitDockSide; distance: number }> = [
        { side: 'top', distance: Math.max(0, candidate.y) },
        {
          side: 'right',
          distance: Math.max(0, viewportElement.clientWidth - (candidate.x + floatingSizeRef.current.width)),
        },
        {
          side: 'bottom',
          distance: Math.max(0, viewportElement.clientHeight - (candidate.y + titleBarHeight)),
        },
        { side: 'left', distance: Math.max(0, candidate.x) },
      ]
      const previewableEdge = edgeDistances
        .filter((entry) => entry.distance <= edgeThreshold)
        .sort((left, right) => left.distance - right.distance)[0]
      return previewableEdge?.side ?? null
    },
    [viewportRef],
  )

  useEffect(() => {
    setDockedMeatballPortalTarget(dockedMeatballHostRef.current)
  }, [dockedMeatballHostRef])

  useEffect(() => {
    setFloatingSpaghettiPortalTarget(appShellRef.current)
  }, [appShellRef])

  useEffect(() => {
    floatingPosRef.current = activeEditorViewport?.position ?? initialFloatingPosition
  }, [activeEditorViewport?.position])

  useEffect(() => {
    floatingSizeRef.current = activeEditorViewport?.size ?? initialFloatingSize
  }, [activeEditorViewport?.size])

  useEffect(() => {
    splitDockPreviewSideRef.current = splitDockPreviewSide
  }, [splitDockPreviewSide])

  useEffect(() => {
    if (
      activeLeftDockPreviewPanelId === 'meatball-editor' &&
      activeWindowMode === 'meatball editor view' &&
      dragRef.current === null &&
      meatballDockDragIntentRef.current === null
    ) {
      setActiveLeftDockPreviewPanelId(null)
    }
  }, [activeLeftDockPreviewPanelId, activeWindowMode, setActiveLeftDockPreviewPanelId])

  useEffect(() => {
    if (!showFloatingShell && splitDockPreviewSide !== null) {
      setSplitDockPreviewSide(null)
    }
  }, [showFloatingShell, splitDockPreviewSide])

  useEffect(() => {
    if (!showFloatingShell) {
      floatingDockLockRef.current = null
    }
  }, [showFloatingShell])

  useEffect(() => {
    if (
      !showFloatingShell ||
      activeEditorViewport === null ||
      (activeWindowMode !== 'expanded' && activeWindowMode !== 'collapsed')
    ) {
      return
    }
    const clampedSize = normalizeFloatingSize(activeEditorSize)
    if (
      clampedSize.width !== activeEditorSize.width ||
      clampedSize.height !== activeEditorSize.height
    ) {
      setEditorViewportSize(activeEditorViewport.editorViewportId, clampedSize)
    }
    const clampedPos = clampFloatingPos(activeEditorPosition)
    if (
      clampedPos.x !== activeEditorPosition.x ||
      clampedPos.y !== activeEditorPosition.y
    ) {
      setEditorViewportPosition(activeEditorViewport.editorViewportId, clampedPos)
    }
  }, [
    activeEditorViewport,
    activeWindowMode,
    clampFloatingPos,
    normalizeFloatingSize,
    setEditorViewportPosition,
    setEditorViewportSize,
    showFloatingShell,
  ])

  useEffect(() => {
    const handleResize = () => {
      if (
        activeEditorViewport === null ||
        (activeWindowMode !== 'expanded' && activeWindowMode !== 'collapsed')
      ) {
        return
      }
      const nextSize = normalizeFloatingSize(activeEditorSize)
      if (
        nextSize.width !== activeEditorSize.width ||
        nextSize.height !== activeEditorSize.height
      ) {
        setEditorViewportSize(activeEditorViewport.editorViewportId, nextSize)
      }
      const nextPos = clampFloatingPos(activeEditorPosition)
      if (
        nextPos.x !== activeEditorPosition.x ||
        nextPos.y !== activeEditorPosition.y
      ) {
        setEditorViewportPosition(activeEditorViewport.editorViewportId, nextPos)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [
    activeEditorViewport,
    activeWindowMode,
    clampFloatingPos,
    normalizeFloatingSize,
    setEditorViewportPosition,
    setEditorViewportSize,
  ])

  useEffect(() => {
    if (lastLeftDockWidthRef.current === null) {
      lastLeftDockWidthRef.current = leftDockWidth
      return
    }
    if (lastLeftDockWidthRef.current === leftDockWidth || activeEditorViewport === null) {
      return
    }
    lastLeftDockWidthRef.current = leftDockWidth
    const dockLockedPos = resolveDockLockedFloatingPos(leftDockWidth)
    if (dockLockedPos === null) {
      return
    }
    floatingDockLockRef.current = {
      editorViewportId: activeEditorViewport.editorViewportId,
    }
    floatingPosRef.current = dockLockedPos
    setEditorViewportPosition(activeEditorViewport.editorViewportId, dockLockedPos)
  }, [activeEditorViewport, leftDockWidth, resolveDockLockedFloatingPos, setEditorViewportPosition])

  useEffect(() => {
    const handlePointerUp = () => {
      floatingDockLockRef.current = null
    }

    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  useEffect(() => {
    leftDockWidthPreviewHandlerRef.current = (nextLeftDockWidth: number) => {
      if (activeEditorViewport === null) {
        return
      }
      const dockLockedPos = resolveDockLockedFloatingPos(nextLeftDockWidth)
      if (dockLockedPos === null) {
        return
      }
      floatingDockLockRef.current = {
        editorViewportId: activeEditorViewport.editorViewportId,
      }
      floatingPosRef.current = dockLockedPos
      setEditorViewportPosition(activeEditorViewport.editorViewportId, dockLockedPos)
    }

    return () => {
      if (leftDockWidthPreviewHandlerRef.current !== null) {
        leftDockWidthPreviewHandlerRef.current = null
      }
    }
  }, [
    activeEditorViewport,
    leftDockWidthPreviewHandlerRef,
    resolveDockLockedFloatingPos,
    setEditorViewportPosition,
  ])

  const beginFloatingSpaghettiDrag = useCallback(
    (
      editorViewportId: string,
      pointerOffsetX: number,
      pointerOffsetY: number,
      titleBarHeight: number,
    ) => {
      floatingDockLockRef.current = null
      setActiveLeftDockPreviewPanelId(null)
      setSplitDockPreviewSide(null)
      setActiveEditorViewportId(editorViewportId)
      dragRef.current = {
        pointerOffsetX,
        pointerOffsetY,
        titleBarHeight,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const viewport = viewportRef.current
        const dragState = dragRef.current
        if (viewport === null || dragState === null) {
          return
        }
        const rect = viewport.getBoundingClientRect()
        const candidate = {
          x: moveEvent.clientX - rect.left - dragState.pointerOffsetX,
          y: moveEvent.clientY - rect.top - dragState.pointerOffsetY,
        }
        const clamped = clampFloatingPos(candidate)
        floatingPosRef.current = clamped
        setEditorViewportPosition(editorViewportId, clamped)
        const nextDockPreviewPanelId = resolveLeftDockPreviewPanelId(
          'meatball-editor',
          moveEvent.clientX,
          moveEvent.clientY,
        )
        setActiveLeftDockPreviewPanelId(nextDockPreviewPanelId)
        const nextSplitDockPreviewSide =
          nextDockPreviewPanelId === null
            ? resolveSplitDockPreviewSide(clamped, dragState.titleBarHeight)
            : null
        splitDockPreviewSideRef.current = nextSplitDockPreviewSide
        setSplitDockPreviewSide(nextSplitDockPreviewSide)
      }

      const handleUp = (upEvent: PointerEvent) => {
        const dragState = dragRef.current
        const nextSplitDockSide =
          splitDockPreviewSideRef.current ??
          (dragState !== null
            ? resolveSplitDockPreviewSide(floatingPosRef.current, dragState.titleBarHeight)
            : null)
        const shouldDockToMeatball =
          resolveLeftDockPreviewPanelId('meatball-editor', upEvent.clientX, upEvent.clientY) ===
          'meatball-editor'
        dragRef.current = null
        setActiveLeftDockPreviewPanelId(null)
        setSplitDockPreviewSide(null)
        if (shouldDockToMeatball) {
          setEditorViewportHeaderCollapsed(editorViewportId, true)
          setEditorViewportWindowMode(editorViewportId, 'meatball editor view')
        } else if (nextSplitDockSide !== null) {
          setEditorViewportSplitDockSide(editorViewportId, nextSplitDockSide)
          setEditorViewportWindowMode(editorViewportId, 'split view')
        }
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [
      clampFloatingPos,
      resolveLeftDockPreviewPanelId,
      setActiveEditorViewportId,
      setActiveLeftDockPreviewPanelId,
      setEditorViewportHeaderCollapsed,
      setEditorViewportPosition,
      setEditorViewportSplitDockSide,
      setEditorViewportWindowMode,
      resolveSplitDockPreviewSide,
      viewportRef,
    ],
  )

  const handleSpaghettiDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || !canDragFloatingWindow) {
        return
      }
      const viewportElement = viewportRef.current
      const titleBarElement = event.currentTarget
      if (viewportElement === null) {
        return
      }

      const viewportRect = viewportElement.getBoundingClientRect()
      const titleBarRect = titleBarElement.getBoundingClientRect()
      const pointerOffsetX = event.clientX - viewportRect.left - floatingPosRef.current.x
      const pointerOffsetY = event.clientY - viewportRect.top - floatingPosRef.current.y
      beginFloatingSpaghettiDrag(
        activeEditorViewport.editorViewportId,
        pointerOffsetX,
        pointerOffsetY,
        Math.max(1, Math.round(titleBarRect.height)),
      )
      event.preventDefault()
    },
    [activeEditorViewport, beginFloatingSpaghettiDrag, canDragFloatingWindow, viewportRef],
  )

  const handleSpaghettiResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || !canResizeFloatingWindow) {
        return
      }
      setActiveEditorViewportId(activeEditorViewport.editorViewportId)
      resizeRef.current = {
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startWidth: floatingSizeRef.current.width,
        startHeight: floatingSizeRef.current.height,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const state = resizeRef.current
        if (state === null) {
          return
        }
        const nextSize = clampFloatingSize({
          width: state.startWidth + (moveEvent.clientX - state.startPointerX),
          height: state.startHeight + (moveEvent.clientY - state.startPointerY),
        })
        floatingSizeRef.current = nextSize
        setEditorViewportSize(activeEditorViewport.editorViewportId, nextSize)
        const clamped = clampFloatingPos(floatingPosRef.current)
        floatingPosRef.current = clamped
        setEditorViewportPosition(activeEditorViewport.editorViewportId, clamped)
      }

      const handleUp = () => {
        resizeRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
      event.stopPropagation()
    },
    [
      activeEditorViewport,
      canResizeFloatingWindow,
      clampFloatingPos,
      clampFloatingSize,
      setActiveEditorViewportId,
      setEditorViewportPosition,
      setEditorViewportSize,
    ],
  )

  const handleActivateViewport = useCallback(
    (editorViewportId: string) => {
      setActiveEditorViewportId(editorViewportId)
    },
    [setActiveEditorViewportId],
  )

  const handleWindowSettingsToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setWindowSettingsOpenByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [activeEditorViewport])

  const handleViewportWindowSettingsToggle = useCallback((editorViewportId: string) => {
    setWindowSettingsOpenByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [])

  const handleActionTrayToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setActionTrayExpandedByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [activeEditorViewport])

  const handleViewportActionTrayToggle = useCallback((editorViewportId: string) => {
    setActionTrayExpandedByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [])

  const handleWindowClampEditingToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setWindowClampEditingByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [activeEditorViewport])

  const handleViewportWindowClampEditingToggle = useCallback((editorViewportId: string) => {
    setWindowClampEditingByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [])

  const handleWindowAppearanceChange = useCallback(
    (editorViewportId: string, patch: Partial<SpaghettiWindowAppearance>) => {
      setWindowAppearanceByViewportId((current) => ({
        ...current,
        [editorViewportId]: mergeSpaghettiWindowAppearance(
          current[editorViewportId] ?? defaultSpaghettiWindowAppearance,
          patch,
        ),
      }))
    },
    [],
  )

  const handleResetWindowAppearance = useCallback((editorViewportId: string) => {
    setWindowAppearanceByViewportId((current) => ({
      ...current,
      [editorViewportId]: defaultSpaghettiWindowAppearance,
    }))
  }, [])

  const handleMeatballDockDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        event.button !== 0 ||
        activeEditorViewport === null ||
        activeWindowMode !== 'meatball editor view'
      ) {
        return
      }
      const panelRect = dockedMeatballHostRef.current?.getBoundingClientRect()
      if (panelRect === undefined) {
        return
      }
      const editorViewportId = activeEditorViewport.editorViewportId
      const startSize = activeEditorSize
      let hasUndocked = false
      meatballDockDragIntentRef.current = {
        startClientX: event.clientX,
        startClientY: event.clientY,
        pointerOffsetX: event.clientX - panelRect.left,
        pointerOffsetY: event.clientY - panelRect.top,
      }
      setActiveLeftDockPreviewPanelId(null)

      const handleMove = (moveEvent: PointerEvent) => {
        const viewportElement = viewportRef.current
        const intent = meatballDockDragIntentRef.current
        if (viewportElement === null || intent === null) {
          return
        }
        const deltaX = moveEvent.clientX - intent.startClientX
        const deltaY = moveEvent.clientY - intent.startClientY
        if (Math.hypot(deltaX, deltaY) < 8) {
          return
        }
        const viewportRect = viewportElement.getBoundingClientRect()
        const nextPos = clampFloatingPos({
          x: moveEvent.clientX - viewportRect.left - intent.pointerOffsetX,
          y: moveEvent.clientY - viewportRect.top - intent.pointerOffsetY,
        })
        if (!hasUndocked) {
          const nextSize = normalizeFloatingSize(startSize)
          floatingSizeRef.current = nextSize
          setEditorViewportSize(editorViewportId, nextSize)
          setEditorViewportWindowMode(editorViewportId, 'expanded')
          hasUndocked = true
        }
        floatingPosRef.current = nextPos
        setEditorViewportPosition(editorViewportId, nextPos)
      }

      const handleUp = () => {
        meatballDockDragIntentRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
    },
    [
      activeEditorViewport,
      clampFloatingPos,
      dockedMeatballHostRef,
      normalizeFloatingSize,
      setActiveLeftDockPreviewPanelId,
      setEditorViewportPosition,
      setEditorViewportSize,
      setEditorViewportWindowMode,
      viewportRef,
    ],
  )

  const handleSplitResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || activeWindowMode !== 'split view') {
        return
      }
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return
      }
      const rect = viewportElement.getBoundingClientRect()
      splitResizeRef.current = {
        viewportTop: rect.top,
        viewportHeight: rect.height - splitDividerHeight,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const state = splitResizeRef.current
        if (state === null) {
          return
        }
        const viewportRect = viewportRef.current?.getBoundingClientRect()
        if (viewportRect === undefined) {
          return
        }
        const nextRatio =
          splitDirection === 'vertical'
            ? (moveEvent.clientX - viewportRect.left) / Math.max(1, viewportRect.width - splitDividerHeight)
            : (moveEvent.clientY - state.viewportTop) / Math.max(1, state.viewportHeight)
        setEditorViewportSplitRatio(activeEditorViewport.editorViewportId, nextRatio)
      }

      const handleUp = () => {
        splitResizeRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
      event.stopPropagation()
    },
    [activeEditorViewport, activeWindowMode, setEditorViewportSplitRatio, splitDirection, viewportRef],
  )

  const handlePrimaryViewModeCycle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    const headerCollapsed = headerCollapsedByViewportId[editorViewportId] ?? false
    const canvasToolbarVisible = canvasToolbarVisibleByViewportId[editorViewportId] ?? true
    const isEssentials =
      activeWindowMode === 'maximized' && headerCollapsed && !canvasToolbarVisible

    if (activeWindowMode === 'collapsed') {
      setEditorViewportPresentationMode(editorViewportId, 'expanded')
      return
    }

    if (isEssentials) {
      setEditorViewportPresentationMode(editorViewportId, 'collapsed')
      return
    }

    setEditorViewportPresentationMode(editorViewportId, 'essentials')
  }, [
    activeEditorViewport,
    canvasToolbarVisibleByViewportId,
    headerCollapsedByViewportId,
    setEditorViewportPresentationMode,
  ])

  const handleViewportPrimaryViewModeCycle = useCallback(
    (editorViewportId: string) => {
      const viewport = orderedEditorViewports.find(
        (currentViewport) => currentViewport.editorViewportId === editorViewportId,
      )
      if (viewport === undefined) {
        return
      }
      const viewportPlacement = editorSurfacePlacementById[editorViewportId] ?? null
      const windowMode = viewportPlacement?.windowMode ?? viewport.windowMode
      const headerCollapsed = headerCollapsedByViewportId[editorViewportId] ?? false
      const canvasToolbarVisible = canvasToolbarVisibleByViewportId[editorViewportId] ?? true
      const isViewportEssentials =
        windowMode === 'maximized' && headerCollapsed && !canvasToolbarVisible

      if (windowMode === 'collapsed') {
        setEditorViewportPresentationMode(editorViewportId, 'expanded')
        return
      }

      if (isViewportEssentials) {
        setEditorViewportPresentationMode(editorViewportId, 'collapsed')
        return
      }

      setEditorViewportPresentationMode(editorViewportId, 'essentials')
    },
    [
      canvasToolbarVisibleByViewportId,
      editorSurfacePlacementById,
      headerCollapsedByViewportId,
      orderedEditorViewports,
      setEditorViewportPresentationMode,
    ],
  )

  const handleHeaderToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setHeaderToggleRevisionByViewportId((current) => ({
      ...current,
      [editorViewportId]: (current[editorViewportId] ?? 0) + 1,
    }))
    setEditorViewportHeaderCollapsed(
      editorViewportId,
      !(headerCollapsedByViewportId[editorViewportId] ?? false),
    )
  }, [activeEditorViewport, headerCollapsedByViewportId, setEditorViewportHeaderCollapsed])

  const handleViewportHeaderToggle = useCallback(
    (editorViewportId: string) => {
      setHeaderToggleRevisionByViewportId((current) => ({
        ...current,
        [editorViewportId]: (current[editorViewportId] ?? 0) + 1,
      }))
      setEditorViewportHeaderCollapsed(
        editorViewportId,
        !(headerCollapsedByViewportId[editorViewportId] ?? false),
      )
    },
    [headerCollapsedByViewportId, setEditorViewportHeaderCollapsed],
  )

  const handleSetHeaderCollapsed = useCallback(
    (collapsed: boolean) => {
      if (activeEditorViewport === null) {
        return
      }
      setEditorViewportHeaderCollapsed(activeEditorViewport.editorViewportId, collapsed)
    },
    [activeEditorViewport, setEditorViewportHeaderCollapsed],
  )

  const handleSetViewportHeaderCollapsed = useCallback(
    (editorViewportId: string, collapsed: boolean) => {
      setEditorViewportHeaderCollapsed(editorViewportId, collapsed)
    },
    [setEditorViewportHeaderCollapsed],
  )

  const handleCanvasToolbarToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setEditorViewportCanvasToolbarVisible(
      editorViewportId,
      !(canvasToolbarVisibleByViewportId[editorViewportId] ?? true),
    )
  }, [activeEditorViewport, canvasToolbarVisibleByViewportId, setEditorViewportCanvasToolbarVisible])

  const handleViewportCanvasToolbarToggle = useCallback(
    (editorViewportId: string) => {
      setEditorViewportCanvasToolbarVisible(
        editorViewportId,
        !(canvasToolbarVisibleByViewportId[editorViewportId] ?? true),
      )
    },
    [canvasToolbarVisibleByViewportId, setEditorViewportCanvasToolbarVisible],
  )

  const handleMeatballMode = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setActiveLeftDockPreviewPanelId(null)
    if (activeWindowMode !== 'meatball editor view') {
      setEditorViewportHeaderCollapsed(activeEditorViewport.editorViewportId, true)
    }
    setEditorViewportWindowMode(
      activeEditorViewport.editorViewportId,
      activeWindowMode === 'meatball editor view' ? 'expanded' : 'meatball editor view',
    )
  }, [
    activeEditorViewport,
    setActiveLeftDockPreviewPanelId,
    setEditorViewportHeaderCollapsed,
    setEditorViewportWindowMode,
  ])

  const handleViewportMeatballMode = useCallback(
    (editorViewportId: string) => {
      const viewport = orderedEditorViewports.find(
        (currentViewport) => currentViewport.editorViewportId === editorViewportId,
      )
      if (viewport === undefined) {
        return
      }
      const viewportPlacement = editorSurfacePlacementById[editorViewportId] ?? null
      const windowMode = viewportPlacement?.windowMode ?? viewport.windowMode
      setActiveLeftDockPreviewPanelId(null)
      if (windowMode !== 'meatball editor view') {
        setEditorViewportHeaderCollapsed(editorViewportId, true)
      }
      setEditorViewportWindowMode(
        editorViewportId,
        windowMode === 'meatball editor view' ? 'expanded' : 'meatball editor view',
      )
    },
    [
      editorSurfacePlacementById,
      orderedEditorViewports,
      setActiveLeftDockPreviewPanelId,
      setEditorViewportHeaderCollapsed,
      setEditorViewportWindowMode,
    ],
  )

  const handleMaximizeToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'maximized')
  }, [activeEditorViewport, setEditorViewportWindowMode])

  const handleViewportMaximizeToggle = useCallback(
    (editorViewportId: string) => {
      setEditorViewportWindowMode(editorViewportId, 'maximized')
    },
    [setEditorViewportWindowMode],
  )

  const handleSplitToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'split view')
  }, [activeEditorViewport, setEditorViewportWindowMode])

  const handleViewportSplitToggle = useCallback(
    (editorViewportId: string) => {
      setEditorViewportWindowMode(editorViewportId, 'split view')
    },
    [setEditorViewportWindowMode],
  )

  const preopenViewportPopoutWindow = useCallback(
    (editorViewportId: string) => {
      const placement = editorSurfacePlacementById[editorViewportId] ?? null
      const popoutState = placement?.popoutState ?? createDefaultEditorPopoutState(editorViewportId)
      const popup = window.open('', popoutState.windowName, popoutState.windowFeatures)
      pendingPopoutWindowByViewportIdRef.current[editorViewportId] = popup
      return popup
    },
    [editorSurfacePlacementById],
  )

  const claimPendingViewportPopoutWindow = useCallback((editorViewportId: string) => {
    const pendingWindow = pendingPopoutWindowByViewportIdRef.current[editorViewportId] ?? null
    delete pendingPopoutWindowByViewportIdRef.current[editorViewportId]
    return pendingWindow
  }, [])

  const handleTogglePopout = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setActiveLeftDockPreviewPanelId(null)
    setSplitDockPreviewSide(null)
    preopenViewportPopoutWindow(editorViewportId)
    setEditorViewportWindowMode(editorViewportId, 'separateWindow')
  }, [
    activeEditorViewport,
    preopenViewportPopoutWindow,
    setActiveLeftDockPreviewPanelId,
    setEditorViewportWindowMode,
  ])

  const handleViewportDockFromPopout = useCallback(
    (editorViewportId: string) => {
      delete pendingPopoutWindowByViewportIdRef.current[editorViewportId]
      const viewport = editorViewportsById[editorViewportId] ?? null
      const placement = editorSurfacePlacementById[editorViewportId] ?? null
      const windowMode = placement?.windowMode ?? viewport?.windowMode ?? null
      if (windowMode !== 'separateWindow') {
        return
      }
      setActiveLeftDockPreviewPanelId(null)
      setSplitDockPreviewSide(null)
      setEditorViewportWindowMode(editorViewportId, 'separateWindow')
    },
    [
      editorSurfacePlacementById,
      editorViewportsById,
      setActiveLeftDockPreviewPanelId,
      setEditorViewportWindowMode,
    ],
  )

  const handleSplitTitleBarClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!event.ctrlKey || activeEditorViewport === null || activeWindowMode !== 'split view') {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'expanded')
    },
    [activeEditorViewport, activeWindowMode, setEditorViewportWindowMode],
  )

  const handleSplitTitleBarDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || activeWindowMode !== 'split view') {
        return
      }
      const viewportElement = viewportRef.current
      const titleBarElement = event.currentTarget
      if (viewportElement === null) {
        return
      }

      const viewportRect = viewportElement.getBoundingClientRect()
      const titleBarRect = titleBarElement.getBoundingClientRect()
      const pointerOffsetX = event.clientX - titleBarRect.left
      const pointerOffsetY = event.clientY - titleBarRect.top
      const titleBarHeight = Math.max(1, Math.round(titleBarRect.height))
      const editorViewportId = activeEditorViewport.editorViewportId

      if (event.ctrlKey) {
        const nextPos = clampFloatingPos({
          x: event.clientX - viewportRect.left - pointerOffsetX,
          y: event.clientY - viewportRect.top - pointerOffsetY,
        })

        floatingPosRef.current = nextPos
        setEditorViewportPosition(editorViewportId, nextPos)
        setEditorViewportWindowMode(editorViewportId, 'expanded')
        beginFloatingSpaghettiDrag(editorViewportId, pointerOffsetX, pointerOffsetY, titleBarHeight)
        event.preventDefault()
        event.stopPropagation()
        return
      }

      splitTitlebarDragIntentRef.current = {
        startClientX: event.clientX,
        startClientY: event.clientY,
        pointerOffsetX,
        pointerOffsetY,
        titleBarHeight,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const intent = splitTitlebarDragIntentRef.current
        const liveViewport = viewportRef.current
        if (intent === null || liveViewport === null) {
          return
        }
        const deltaX = moveEvent.clientX - intent.startClientX
        const deltaY = moveEvent.clientY - intent.startClientY
        if (Math.hypot(deltaX, deltaY) < 8) {
          return
        }
        splitTitlebarDragIntentRef.current = null
        const liveViewportRect = liveViewport.getBoundingClientRect()
        const nextPos = clampFloatingPos({
          x: moveEvent.clientX - liveViewportRect.left - intent.pointerOffsetX,
          y: moveEvent.clientY - liveViewportRect.top - intent.pointerOffsetY,
        })
        floatingPosRef.current = nextPos
        setEditorViewportPosition(editorViewportId, nextPos)
        setEditorViewportWindowMode(editorViewportId, 'expanded')
        beginFloatingSpaghettiDrag(
          editorViewportId,
          intent.pointerOffsetX,
          intent.pointerOffsetY,
          intent.titleBarHeight,
        )
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      const handleUp = () => {
        splitTitlebarDragIntentRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
      event.stopPropagation()
    },
    [
      activeEditorViewport,
      activeWindowMode,
      beginFloatingSpaghettiDrag,
      clampFloatingPos,
      setEditorViewportPosition,
      setEditorViewportWindowMode,
      viewportRef,
    ],
  )

  const handleCloseEditor = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    closeEditorViewport(activeEditorViewport.editorViewportId)
  }, [activeEditorViewport, closeEditorViewport])

  const handleViewportCloseEditor = useCallback(
    (editorViewportId: string) => {
      closeEditorViewport(editorViewportId)
    },
    [closeEditorViewport],
  )

  const splitLayoutStyle = useMemo(
    () => ({
      gridTemplateColumns:
        splitDirection === 'vertical'
          ? `${splitRatio}fr ${splitDividerHeight}px ${1 - splitRatio}fr`
          : 'minmax(0, 1fr)',
      gridTemplateRows:
        splitDirection === 'vertical'
          ? 'minmax(0, 1fr)'
          : `${splitRatio}fr ${splitDividerHeight}px ${1 - splitRatio}fr`,
      gridTemplateAreas:
        splitDirection === 'vertical'
          ? splitDockSide === 'left'
            ? '"editor divider viewer"'
            : '"viewer divider editor"'
          : splitDockSide === 'top'
            ? '"editor" "divider" "viewer"'
            : '"viewer" "divider" "editor"',
      ['--left-dock-split-width' as const]: `${leftDockWidth}px`,
    }),
    [leftDockWidth, splitDirection, splitDockSide, splitRatio],
  )

  const splitDockGhostStyle = useMemo(() => {
    if (splitDockPreviewSide === null) {
      return null
    }
    if (splitDockPreviewSide === 'bottom') {
      return {
        top: `calc(${(splitRatio * 100).toFixed(4)}% + ${splitDividerHeight}px)`,
      } as CSSProperties
    }
    if (splitDockPreviewSide === 'top') {
      return {
        bottom: `calc(${((1 - splitRatio) * 100).toFixed(4)}% + ${splitDividerHeight}px)`,
      } as CSSProperties
    }
    if (splitDockPreviewSide === 'right') {
      return {
        left: `calc(${(splitRatio * 100).toFixed(4)}% + ${splitDividerHeight}px)`,
      } as CSSProperties
    }
    return {
      right: `calc(${((1 - splitRatio) * 100).toFixed(4)}% + ${splitDividerHeight}px)`,
    } as CSSProperties
  }, [splitDockPreviewSide, splitRatio])

  const detachedEditorViewportIds = useMemo(() => {
    const orderedDetachedViewportIds = orderedEditorViewports
      .filter((viewport) => {
        const placement = editorSurfacePlacementById[viewport.editorViewportId] ?? null
        const windowMode = placement?.windowMode ?? viewport.windowMode
        return windowMode === 'separateWindow'
      })
      .map((viewport) => viewport.editorViewportId)

    const detachedViewportIdSet = new Set(orderedDetachedViewportIds)
    for (const [editorViewportId, placement] of Object.entries(editorSurfacePlacementById)) {
      if (placement.windowMode !== 'separateWindow') {
        continue
      }
      if (editorViewportsById[editorViewportId] === undefined) {
        continue
      }
      detachedViewportIdSet.add(editorViewportId)
    }

    return Array.from(detachedViewportIdSet)
  }, [editorSurfacePlacementById, editorViewportsById, orderedEditorViewports])

  const meatballShell =
    showMeatballDock && activeEditorViewport !== null ? (
      <div
        className="SpaghettiMeatballHost SpaghettiWindowShell"
        onPointerDownCapture={onActivateSpaghettiSurface}
        style={getWindowAppearanceStyle(activeWindowAppearance)}
      >
        <SpaghettiWindowTitleBar
          editorViewportId={activeEditorViewport.editorViewportId}
          onPrimaryViewModeCycle={handlePrimaryViewModeCycle}
          onActionTrayToggle={handleActionTrayToggle}
          onWindowSettingsToggle={handleWindowSettingsToggle}
          onHeaderToggle={handleHeaderToggle}
          onCanvasToolbarToggle={handleCanvasToolbarToggle}
          onMeatball={handleMeatballMode}
          onMaximizeToggle={handleMaximizeToggle}
          onSplitToggle={handleSplitToggle}
          onTogglePopout={handleTogglePopout}
          onClose={handleCloseEditor}
          onDragStart={handleMeatballDockDragStart}
          isCollapsed={false}
          isActionTrayExpanded={isActionTrayExpanded}
          isWindowSettingsOpen={isWindowSettingsOpen}
          isHeaderCollapsed={isHeaderCollapsed}
          isCanvasToolbarVisible={isCanvasToolbarVisible}
          isMeatball
          isEssentials={isEssentials}
          isMaximized={false}
          isSplit={false}
        />
        <SpaghettiPanel
          editorViewportId={activeEditorViewport.editorViewportId}
          isEssentials={isEssentials}
          isWindowSettingsOpen={isWindowSettingsOpen}
          isClampEditing={isWindowClampEditing}
          windowAppearance={activeWindowAppearance}
          onWindowAppearanceChange={(patch) =>
            handleWindowAppearanceChange(activeEditorViewport.editorViewportId, patch)
          }
          onToggleClampEditing={handleWindowClampEditingToggle}
          onResetWindowAppearance={() =>
            handleResetWindowAppearance(activeEditorViewport.editorViewportId)
          }
          isHeaderCollapsed={isHeaderCollapsed}
          isCanvasToolbarVisible={isCanvasToolbarVisible}
          headerToggleRevision={headerToggleRevision}
          onSetHeaderCollapsed={handleSetHeaderCollapsed}
        />
      </div>
    ) : null

  return (
    <>
      {dockedMeatballPortalTarget !== null && meatballShell !== null
        ? createPortal(meatballShell, dockedMeatballPortalTarget)
        : null}
      {showSplitLayout && activeEditorViewport !== null ? (
        <div
          className={`ViewportSplitLayout ${splitDirectionClass} ${splitPriorityClass} ${splitDockSideClass} ${
            isLeftDockViewportSplit ? 'isLeftDockSplit' : ''
          }`}
          style={splitLayoutStyle}
        >
          <div className="ViewportSplitPane ViewportSplitPane--viewer" style={{ gridArea: 'viewer' }}>
            {viewerSurface}
          </div>
          <div className="ViewportSplitDividerShell" style={{ gridArea: 'divider' }}>
            <button
              type="button"
              className="ViewportSplitDivider"
              onPointerDown={handleSplitResizeStart}
              onContextMenu={onOpenDividerSplitMenu}
              onDoubleClick={onResetSplitRatio}
              aria-label="Resize split view"
              title="Drag to resize viewport and editor"
            />
          </div>
          <div className="ViewportSplitPane ViewportSplitPane--editor" style={{ gridArea: 'editor' }}>
            <div
              className="SpaghettiSplitWindow SpaghettiWindowShell"
              onPointerDownCapture={onActivateSpaghettiSurface}
              style={getWindowAppearanceStyle(activeWindowAppearance)}
            >
              <SpaghettiWindowTitleBar
                editorViewportId={activeEditorViewport.editorViewportId}
                onPrimaryViewModeCycle={handlePrimaryViewModeCycle}
                onActionTrayToggle={handleActionTrayToggle}
                onWindowSettingsToggle={handleWindowSettingsToggle}
                onHeaderToggle={handleHeaderToggle}
                onCanvasToolbarToggle={handleCanvasToolbarToggle}
                onMeatball={handleMeatballMode}
                onMaximizeToggle={handleMaximizeToggle}
                onSplitToggle={handleSplitToggle}
                onTogglePopout={handleTogglePopout}
                onDragStart={handleSplitTitleBarDragStart}
                onShellClick={handleSplitTitleBarClick}
                onContextMenu={onOpenDividerSplitMenu}
                onClose={handleCloseEditor}
                isCollapsed={false}
                isActionTrayExpanded={isActionTrayExpanded}
                isWindowSettingsOpen={isWindowSettingsOpen}
                isHeaderCollapsed={isHeaderCollapsed}
                isCanvasToolbarVisible={isCanvasToolbarVisible}
                isMeatball={false}
                isEssentials={isEssentials}
                isMaximized={false}
                isSplit
              />
              <div className={`SpaghettiFloatingBody ${isEssentials ? 'isEssentials' : ''}`}>
                <SpaghettiPanel
                  editorViewportId={activeEditorViewport.editorViewportId}
                  isEssentials={isEssentials}
                  isWindowSettingsOpen={isWindowSettingsOpen}
                  isClampEditing={isWindowClampEditing}
                  windowAppearance={activeWindowAppearance}
                  onWindowAppearanceChange={(patch) =>
                    handleWindowAppearanceChange(activeEditorViewport.editorViewportId, patch)
                  }
                  onToggleClampEditing={handleWindowClampEditingToggle}
                  onResetWindowAppearance={() =>
                    handleResetWindowAppearance(activeEditorViewport.editorViewportId)
                  }
                  isHeaderCollapsed={isHeaderCollapsed}
                  isCanvasToolbarVisible={isCanvasToolbarVisible}
                  headerToggleRevision={headerToggleRevision}
                  onSetHeaderCollapsed={handleSetHeaderCollapsed}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {viewerSurface}
          {showFloatingShell && splitDockPreviewSide !== null && splitDockGhostStyle !== null ? (
            <div
              className={`ViewportSplitDockGhost ${
                splitDockPreviewSide === 'left'
                  ? 'isDockLeft'
                  : splitDockPreviewSide === 'right'
                    ? 'isDockRight'
                    : splitDockPreviewSide === 'top'
                      ? 'isDockTop'
                      : 'isDockBottom'
              }`}
              style={splitDockGhostStyle}
              aria-hidden="true"
            />
          ) : null}
        </>
      )}
      {showFloatingShell &&
      activeEditorViewport !== null &&
      floatingSpaghettiPortalTarget !== null &&
      getFloatingShellFrame() !== null
        ? createPortal(
            <aside className="SpaghettiFloatingDock">
              <div
                className={`SpaghettiFloatingWindow SpaghettiWindowShell ${
                  activeWindowMode === 'maximized'
                    ? 'isMaximized'
                    : activeWindowMode === 'collapsed'
                      ? 'isCollapsed'
                      : ''
                } ${isEssentials ? 'isEssentials' : ''} ${
                  workspaceActiveSurface === 'spaghetti' ? 'isActiveWindow' : ''
                }`}
                onPointerDown={onActivateSpaghettiFloatingWindow}
                onPointerDownCapture={onActivateSpaghettiSurface}
                style={{
                  left: `${
                    activeWindowMode === 'maximized'
                      ? getFloatingShellFrame()!.offsetLeft
                      : getFloatingShellFrame()!.offsetLeft + activeEditorPosition.x
                  }px`,
                  top: `${
                    activeWindowMode === 'maximized'
                      ? getFloatingShellFrame()!.offsetTop
                      : getFloatingShellFrame()!.offsetTop + activeEditorPosition.y
                  }px`,
                  width: `${
                    activeWindowMode === 'maximized'
                      ? getFloatingShellFrame()!.viewportWidth
                      : activeEditorSize.width
                  }px`,
                  height:
                    activeWindowMode === 'maximized'
                      ? `${getFloatingShellFrame()!.viewportHeight}px`
                      : activeWindowMode === 'collapsed'
                        ? undefined
                        : `${activeEditorSize.height}px`,
                  maxHeight:
                    activeWindowMode === 'maximized'
                      ? `${getFloatingShellFrame()!.viewportHeight}px`
                      : undefined,
                  right: 'auto',
                  bottom: 'auto',
                  zIndex: activeEditorViewport.zOrder,
                  ...getWindowAppearanceStyle(activeWindowAppearance),
                }}
              >
                <SpaghettiWindowTitleBar
                  editorViewportId={activeEditorViewport.editorViewportId}
                  onPrimaryViewModeCycle={handlePrimaryViewModeCycle}
                  onActionTrayToggle={handleActionTrayToggle}
                  onWindowSettingsToggle={handleWindowSettingsToggle}
                  onHeaderToggle={handleHeaderToggle}
                  onCanvasToolbarToggle={handleCanvasToolbarToggle}
                  onMeatball={handleMeatballMode}
                  onMaximizeToggle={handleMaximizeToggle}
                  onSplitToggle={handleSplitToggle}
                  onTogglePopout={handleTogglePopout}
                  onClose={handleCloseEditor}
                  onDragStart={handleSpaghettiDragStart}
                  onContextMenu={onOpenFloatingSplitMenu}
                  isCollapsed={activeWindowMode === 'collapsed'}
                  isActionTrayExpanded={isActionTrayExpanded}
                  isWindowSettingsOpen={isWindowSettingsOpen}
                  isHeaderCollapsed={isHeaderCollapsed}
                  isCanvasToolbarVisible={isCanvasToolbarVisible}
                  isMeatball={false}
                  isEssentials={isEssentials}
                  isMaximized={activeWindowMode === 'maximized'}
                  isSplit={false}
                />
                {activeWindowMode !== 'collapsed' ? (
                  <div className={`SpaghettiFloatingBody ${isEssentials ? 'isEssentials' : ''}`}>
                    <SpaghettiPanel
                      editorViewportId={activeEditorViewport.editorViewportId}
                      isEssentials={isEssentials}
                      isWindowSettingsOpen={isWindowSettingsOpen}
                      isClampEditing={isWindowClampEditing}
                      windowAppearance={activeWindowAppearance}
                      onWindowAppearanceChange={(patch) =>
                        handleWindowAppearanceChange(activeEditorViewport.editorViewportId, patch)
                      }
                      onToggleClampEditing={handleWindowClampEditingToggle}
                      onResetWindowAppearance={() =>
                        handleResetWindowAppearance(activeEditorViewport.editorViewportId)
                      }
                      isHeaderCollapsed={isHeaderCollapsed}
                      isCanvasToolbarVisible={isCanvasToolbarVisible}
                      headerToggleRevision={headerToggleRevision}
                      onSetHeaderCollapsed={handleSetHeaderCollapsed}
                    />
                  </div>
                ) : null}
                {canResizeFloatingWindow ? (
                  <div
                    className="SpaghettiFloatingResizeHandle"
                    onPointerDown={handleSpaghettiResizeStart}
                  />
                ) : null}
              </div>
            </aside>,
            floatingSpaghettiPortalTarget,
          )
        : null}
      {detachedEditorViewportIds.map((editorViewportId) => {
        const viewport = editorViewportsById[editorViewportId] ?? null
        if (viewport === null) {
          return null
        }
        const placement = editorSurfacePlacementById[editorViewportId] ?? null
        const popoutState = placement?.popoutState ?? createDefaultEditorPopoutState(editorViewportId)
        const windowMode = placement?.windowMode ?? viewport.windowMode
        if (windowMode !== 'separateWindow') {
          return null
        }
        const viewportHeaderCollapsed = headerCollapsedByViewportId[editorViewportId] ?? false
        const viewportHeaderToggleRevision = headerToggleRevisionByViewportId[editorViewportId] ?? 0
        const viewportCanvasToolbarVisible =
          canvasToolbarVisibleByViewportId[editorViewportId] ?? true
        const viewportWindowSettingsOpen = windowSettingsOpenByViewportId[editorViewportId] ?? false
        const viewportSavedActionTrayExpanded = actionTrayExpandedByViewportId[editorViewportId] ?? false
        const viewportWindowAppearance =
          windowAppearanceByViewportId[editorViewportId] ?? defaultSpaghettiWindowAppearance
        const viewportClampEditing = windowClampEditingByViewportId[editorViewportId] ?? false
        const viewportIsEssentials = false
        const viewportActionTrayExpanded = viewportSavedActionTrayExpanded

        return (
          <SpaghettiPopoutSurfaceHost
            key={editorViewportId}
            editorViewportId={editorViewportId}
            popoutState={popoutState}
            workspaceActiveSurface={workspaceActiveSurface}
            onActivateSpaghettiSurface={onActivateSpaghettiSurface}
            onActivateViewport={handleActivateViewport}
            onActivateSpaghettiFloatingWindow={onActivateSpaghettiFloatingWindow}
            claimPendingWindow={claimPendingViewportPopoutWindow}
            onBlocked={handleViewportDockFromPopout}
            onClosed={handleViewportDockFromPopout}
          >
            <SpaghettiPopoutErrorBoundary>
              <div
                className="SpaghettiFloatingWindow SpaghettiPopoutContent"
                style={getWindowAppearanceStyle(viewportWindowAppearance)}
              >
                <SpaghettiWindowTitleBar
                  editorViewportId={editorViewportId}
                  onPrimaryViewModeCycle={() => handleViewportPrimaryViewModeCycle(editorViewportId)}
                  onActionTrayToggle={() => handleViewportActionTrayToggle(editorViewportId)}
                  onWindowSettingsToggle={() => handleViewportWindowSettingsToggle(editorViewportId)}
                  onHeaderToggle={() => handleViewportHeaderToggle(editorViewportId)}
                  onCanvasToolbarToggle={() => handleViewportCanvasToolbarToggle(editorViewportId)}
                  onMeatball={() => handleViewportMeatballMode(editorViewportId)}
                  onMaximizeToggle={() => handleViewportMaximizeToggle(editorViewportId)}
                  onSplitToggle={() => handleViewportSplitToggle(editorViewportId)}
                  onTogglePopout={() => handleViewportDockFromPopout(editorViewportId)}
                  popoutButtonMode="dock"
                  onClose={() => handleViewportCloseEditor(editorViewportId)}
                  isCollapsed={false}
                  isActionTrayExpanded={viewportActionTrayExpanded}
                  isWindowSettingsOpen={viewportWindowSettingsOpen}
                  isHeaderCollapsed={viewportHeaderCollapsed}
                  isCanvasToolbarVisible={viewportCanvasToolbarVisible}
                  isMeatball={false}
                  isEssentials={viewportIsEssentials}
                  isMaximized={false}
                  isSplit={false}
                />
                <div className={`SpaghettiFloatingBody ${viewportIsEssentials ? 'isEssentials' : ''}`}>
                  <SpaghettiPanel
                    editorViewportId={editorViewportId}
                    isEssentials={viewportIsEssentials}
                    isWindowSettingsOpen={viewportWindowSettingsOpen}
                    isClampEditing={viewportClampEditing}
                    windowAppearance={viewportWindowAppearance}
                    onWindowAppearanceChange={(patch) =>
                      handleWindowAppearanceChange(editorViewportId, patch)
                    }
                    onToggleClampEditing={() =>
                      handleViewportWindowClampEditingToggle(editorViewportId)
                    }
                    onResetWindowAppearance={() => handleResetWindowAppearance(editorViewportId)}
                    isHeaderCollapsed={viewportHeaderCollapsed}
                    isCanvasToolbarVisible={viewportCanvasToolbarVisible}
                    headerToggleRevision={viewportHeaderToggleRevision}
                    onSetHeaderCollapsed={(collapsed) =>
                      handleSetViewportHeaderCollapsed(editorViewportId, collapsed)
                    }
                  />
                </div>
              </div>
            </SpaghettiPopoutErrorBoundary>
          </SpaghettiPopoutSurfaceHost>
        )
      })}
    </>
  )
}
