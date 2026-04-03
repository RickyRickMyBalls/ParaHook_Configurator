import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
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
import { PopupWorkspaceShell } from '../workspace/PopupWorkspaceShell'
import {
  defaultWorkspaceSplitDirection,
  resolveDefaultWorkspaceSplitDockSide,
  type WorkspaceSplitDockSide,
} from '../workspace/workspaceSplitTypes'
import {
  createDefaultEditorPopoutState,
  defaultEditorSurfacePosition,
  defaultEditorSurfaceSize,
  defaultPrimaryViewportSlotId,
  type LeftDockPanelId,
} from '../workspace/workspaceShellTypes'
import {
  popoutWorkspaceSurface,
  commitWorkspaceSurfaceRootSplit,
  commitWorkspaceSurfaceSlotSplit,
  redockWorkspaceSurface,
} from '../workspace/workspaceSurfaceActions'
import {
  resolveWorkspaceSplitDockPreview,
  type WorkspaceSplitDockPreview,
} from '../workspace/workspaceSplitPreview'
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

const shouldRelayPopoutConsoleKeyTarget = (target: EventTarget | null): boolean => {
  if (
    target === null ||
    typeof target !== 'object' ||
    !('nodeType' in target) ||
    (target as { nodeType?: unknown }).nodeType !== Node.ELEMENT_NODE
  ) {
    return true
  }
  const element = target as HTMLElement
  if (
    element.tagName === 'INPUT' ||
    element.tagName === 'TEXTAREA' ||
    element.tagName === 'SELECT' ||
    element.isContentEditable
  ) {
    return false
  }
  return element.closest('button, [role="button"], a, summary') === null
}

type SpaghettiPopoutErrorBoundaryProps = {
  children: ReactNode
  onError?: (message: string) => void
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
    this.props.onError?.(
      error instanceof Error ? error.message : 'Unknown detached Spaghetti popup error.',
    )
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

const resolveSpaghettiWindowAppearanceStyle = (
  appearance: SpaghettiWindowAppearance,
): CSSProperties => {
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
  onActivateViewport: (editorViewportId: string) => void
  onActivateSpaghettiFloatingWindow: (
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  onClosed: (editorViewportId: string) => void
  onBlocked: (editorViewportId: string) => void
  children: ReactNode
}) {
  const {
    editorViewportId,
    popoutState,
    workspaceActiveSurface,
    onActivateViewport,
    onActivateSpaghettiFloatingWindow,
    onClosed,
    onBlocked,
    children,
  } = props
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
    onBlocked: handleBlocked,
    onClosed: handleClosed,
  })

  useEffect(() => {
    if (childWindow === null) {
      return
    }
    const handleFocus = () => {
      onActivateViewport(editorViewportId)
      onActivateSpaghettiFloatingWindow(editorViewportId)
    }
    childWindow.addEventListener('focus', handleFocus)
    return () => {
      childWindow.removeEventListener('focus', handleFocus)
    }
  }, [childWindow, editorViewportId, onActivateSpaghettiFloatingWindow, onActivateViewport])

  useEffect(() => {
    if (childWindow === null) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        !shouldRelayPopoutConsoleKeyTarget(event.target)
      ) {
        return
      }
      if (
        event.key !== 'Enter' &&
        event.key !== 'ArrowUp' &&
        event.key !== 'ArrowDown' &&
        event.key.length !== 1
      ) {
        return
      }
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: event.key,
          bubbles: true,
          cancelable: true,
          shiftKey: event.shiftKey,
        }),
      )
    }
    childWindow.addEventListener('keydown', handleKeyDown, true)
    return () => {
      childWindow.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [childWindow])

  const handlePopoutPointerDown = useCallback(() => {
    onActivateSpaghettiFloatingWindow(editorViewportId)
  }, [editorViewportId, onActivateSpaghettiFloatingWindow])

  if (host === null) {
    return null
  }

  return createPortal(
    <div className="SpaghettiPopoutSurface">
      <div
        className={`SpaghettiPopoutWindow SpaghettiWindowShell ${
          workspaceActiveSurface === 'spaghetti' ? 'isActiveWindow' : ''
        }`}
        onPointerDown={handlePopoutPointerDown}
      >
        <SpaghettiPopoutErrorBoundary>{children}</SpaghettiPopoutErrorBoundary>
      </div>
    </div>,
    host,
  )
}

function SpaghettiDetachedPopoutContent(props: {
  editorViewportId: string
  viewportHeaderCollapsed: boolean
  viewportHeaderToggleRevision: number
  viewportCanvasToolbarVisible: boolean
  viewportWindowSettingsOpen: boolean
  viewportWindowAppearance: SpaghettiWindowAppearance
  viewportClampEditing: boolean
  viewportActionTrayExpanded: boolean
  onWindowAppearanceChange: (patch: Partial<SpaghettiWindowAppearance>) => void
  onToggleClampEditing: () => void
  onResetWindowAppearance: () => void
  onSetHeaderCollapsed: (collapsed: boolean) => void
  onPrimaryViewModeCycle: () => void
  onActionTrayToggle: () => void
  onWindowSettingsToggle: () => void
  onHeaderToggle: () => void
  onCanvasToolbarToggle: () => void
  onMeatball: () => void
  onMaximizeToggle: () => void
  onSplitToggle: () => void
  onDockFromPopout: () => void
  onClose: () => void
  onActivateSpaghettiSurface: (
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  onActivateViewerSurface: (viewportId: string) => void
  onCreatePopupSpaghettiViewport: (graphDocumentId: string) => string | null
  onClosePopupSpaghettiViewport: (editorViewportId: string) => void
  onManagedPopupViewportIdsChange: (editorViewportId: string, managedViewportIds: string[]) => void
}) {
  const {
    editorViewportId,
    viewportHeaderCollapsed,
    viewportHeaderToggleRevision,
    viewportCanvasToolbarVisible,
    viewportWindowSettingsOpen,
    viewportWindowAppearance,
    viewportClampEditing,
    viewportActionTrayExpanded,
    onWindowAppearanceChange,
    onToggleClampEditing,
    onResetWindowAppearance,
    onSetHeaderCollapsed,
    onPrimaryViewModeCycle,
    onActionTrayToggle,
    onWindowSettingsToggle,
    onHeaderToggle,
    onCanvasToolbarToggle,
    onMeatball,
    onMaximizeToggle,
    onSplitToggle,
    onDockFromPopout,
    onClose,
    onActivateSpaghettiSurface,
    onActivateViewerSurface,
    onCreatePopupSpaghettiViewport,
    onClosePopupSpaghettiViewport,
    onManagedPopupViewportIdsChange,
  } = props
  const [splitMenuPosition, setSplitMenuPosition] = useState<{ left: number; top: number } | null>(
    null,
  )
  const [initialPopupSplitDockSide, setInitialPopupSplitDockSide] =
    useState<WorkspaceSplitDockSide | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const splitMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    onManagedPopupViewportIdsChange(editorViewportId, [])
    return () => {
      onManagedPopupViewportIdsChange(editorViewportId, [])
    }
  }, [editorViewportId, onManagedPopupViewportIdsChange])

  useEffect(() => {
    if (splitMenuPosition === null) {
      return
    }
    const ownerDocument = contentRef.current?.ownerDocument
    if (ownerDocument === undefined) {
      return
    }
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target !== null && splitMenuRef.current?.contains(target)) {
        return
      }
      setSplitMenuPosition(null)
    }
    ownerDocument.addEventListener('pointerdown', handlePointerDown)
    return () => {
      ownerDocument.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [splitMenuPosition])

  const handleTitleBarContextMenu = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const contentRect = contentRef.current?.getBoundingClientRect()
    if (contentRect === undefined) {
      return
    }
    setSplitMenuPosition({
      left: Math.max(8, Math.round(event.clientX - contentRect.left)),
      top: Math.max(44, Math.round(event.clientY - contentRect.top)),
    })
  }, [])

  const handleSelectPopupSplitDockSide = useCallback((splitDockSide: WorkspaceSplitDockSide) => {
    setSplitMenuPosition(null)
    setInitialPopupSplitDockSide(splitDockSide)
  }, [])

  if (initialPopupSplitDockSide !== null) {
    return (
      <div
        ref={contentRef}
        className="SpaghettiFloatingWindow SpaghettiPopoutContent"
        style={{
          ...resolveSpaghettiWindowAppearanceStyle(viewportWindowAppearance),
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <PopupWorkspaceShell
          popupWorkspaceId={`spaghetti-popup-workspace-${editorViewportId}`}
          rootSurfaceKind="spaghettiEditor"
          rootSurfaceInstanceId={editorViewportId}
          initialSplitDockSide={initialPopupSplitDockSide}
          onActivateSpaghettiSurface={onActivateSpaghettiSurface}
          onActivateViewerSurface={onActivateViewerSurface}
          onCreatePopupSpaghettiViewport={onCreatePopupSpaghettiViewport}
          onClosePopupSpaghettiViewport={onClosePopupSpaghettiViewport}
          onManagedViewportIdsChange={(managedViewportIds) =>
            onManagedPopupViewportIdsChange(editorViewportId, managedViewportIds)
          }
          onCollapseToRootSurface={() => {
            onManagedPopupViewportIdsChange(editorViewportId, [])
            setInitialPopupSplitDockSide(null)
          }}
        />
      </div>
    )
  }

  return (
    <div
      ref={contentRef}
      className="SpaghettiFloatingWindow SpaghettiPopoutContent"
      style={{
        ...resolveSpaghettiWindowAppearanceStyle(viewportWindowAppearance),
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <SpaghettiWindowTitleBar
        editorViewportId={editorViewportId}
        onPrimaryViewModeCycle={onPrimaryViewModeCycle}
        onActionTrayToggle={onActionTrayToggle}
        onWindowSettingsToggle={onWindowSettingsToggle}
        onHeaderToggle={onHeaderToggle}
        onCanvasToolbarToggle={onCanvasToolbarToggle}
        onMeatball={onMeatball}
        onMaximizeToggle={onMaximizeToggle}
        onSplitToggle={onSplitToggle}
        onTogglePopout={onDockFromPopout}
        popoutButtonMode="dock"
        onClose={onClose}
        onContextMenu={handleTitleBarContextMenu}
        isCollapsed={false}
        isActionTrayExpanded={viewportActionTrayExpanded}
        isWindowSettingsOpen={viewportWindowSettingsOpen}
        isHeaderCollapsed={viewportHeaderCollapsed}
        isCanvasToolbarVisible={viewportCanvasToolbarVisible}
        isMeatball={false}
        isEssentials={false}
        isMaximized={false}
        isSplit={false}
      />
      {splitMenuPosition !== null ? (
        <div
          ref={splitMenuRef}
          className="ViewportFrameActionMenu"
          role="menu"
          aria-label="Popup split actions"
          style={{
            left: `${splitMenuPosition.left}px`,
            top: `${splitMenuPosition.top}px`,
          }}
        >
          <button
            type="button"
            className="ViewportFrameActionMenuAction"
            onClick={() => handleSelectPopupSplitDockSide('top')}
          >
            Split Top
          </button>
          <button
            type="button"
            className="ViewportFrameActionMenuAction"
            onClick={() => handleSelectPopupSplitDockSide('right')}
          >
            Split Right
          </button>
          <button
            type="button"
            className="ViewportFrameActionMenuAction"
            onClick={() => handleSelectPopupSplitDockSide('bottom')}
          >
            Split Bottom
          </button>
          <button
            type="button"
            className="ViewportFrameActionMenuAction"
            onClick={() => handleSelectPopupSplitDockSide('left')}
          >
            Split Left
          </button>
        </div>
      ) : null}
      <div className="SpaghettiFloatingBody">
        <SpaghettiPanel
          editorViewportId={editorViewportId}
          onActivateEditorContext={onActivateSpaghettiSurface}
          isEssentials={false}
          isWindowSettingsOpen={viewportWindowSettingsOpen}
          isClampEditing={viewportClampEditing}
          windowAppearance={viewportWindowAppearance}
          onWindowAppearanceChange={onWindowAppearanceChange}
          onToggleClampEditing={onToggleClampEditing}
          onResetWindowAppearance={onResetWindowAppearance}
          isHeaderCollapsed={viewportHeaderCollapsed}
          isCanvasToolbarVisible={viewportCanvasToolbarVisible}
          headerToggleRevision={viewportHeaderToggleRevision}
          onSetHeaderCollapsed={onSetHeaderCollapsed}
        />
      </div>
    </div>
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
  slotHeaderDragSeed: {
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null
  onConsumeSlotHeaderDragSeed: () => void
  onActivateSpaghettiSurface: (
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  onActivateSpaghettiFloatingWindow: (
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  onOpenFloatingSplitMenu: (
    editorViewportId: string,
    event: ReactMouseEvent<HTMLDivElement>,
  ) => void
  onActivateViewerSurface: (viewportId: string) => void
  windowSettingsOpenByViewportId?: Record<string, boolean>
  onSetWindowSettingsOpen?: (editorViewportId: string, isOpen: boolean) => void
  leftDockWidthPreviewHandlerRef: MutableRefObject<((nextWidth: number) => void) | null>
}

export function SpaghettiWindowHost(props: SpaghettiWindowHostProps) {
  const {
    appShellRef,
    viewportRef,
    dockedMeatballHostRef,
    leftDockWidth,
    activeLeftDockPreviewPanelId,
    setActiveLeftDockPreviewPanelId,
    resolveLeftDockPreviewPanelId,
    viewerSurface,
    workspaceActiveSurface,
    slotHeaderDragSeed,
    onConsumeSlotHeaderDragSeed,
    onActivateSpaghettiSurface,
    onActivateSpaghettiFloatingWindow,
    onOpenFloatingSplitMenu,
    onActivateViewerSurface,
    windowSettingsOpenByViewportId,
    onSetWindowSettingsOpen,
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
  const restoreEditorViewportFromSeparateWindow = useSpaghettiStore(
    (state) => state.restoreEditorViewportFromSeparateWindow,
  )
  const setEditorViewportHeaderCollapsed = useSpaghettiStore(
    (state) => state.setEditorViewportHeaderCollapsed,
  )
  const setEditorViewportCanvasToolbarVisible = useSpaghettiStore(
    (state) => state.setEditorViewportCanvasToolbarVisible,
  )
  const setEditorViewportPresentationMode = useSpaghettiStore(
    (state) => state.setEditorViewportPresentationMode,
  )
  const setEditorViewportPosition = useSpaghettiStore((state) => state.setEditorViewportPosition)
  const setEditorViewportSize = useSpaghettiStore((state) => state.setEditorViewportSize)
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
  const openGraphDocumentInNewViewport = useSpaghettiStore(
    (state) => state.openGraphDocumentInNewViewport,
  )
  const editorSurfacePlacementById = useWorkspaceStore((state) => state.editorSurfacePlacementById)
  const detachedSlotSurfaceById = useWorkspaceStore((state) => state.detachedSlotSurfaceById)
  const viewportSlotsById = useWorkspaceStore((state) => state.viewportSlotsById)
  const removeViewportSlot = useWorkspaceStore((state) => state.removeViewportSlot)
  const clearDetachedSlotSurface = useWorkspaceStore((state) => state.clearDetachedSlotSurface)
  const [popupManagedViewportIdsByRootId, setPopupManagedViewportIdsByRootId] = useState<
    Record<string, string[]>
  >({})
  const popupManagedViewportIdSet = useMemo(
    () => new Set(Object.values(popupManagedViewportIdsByRootId).flat()),
    [popupManagedViewportIdsByRootId],
  )
  const orderedEditorViewports = (() => {
    const ordered = editorViewportOrder
      .map((editorViewportId) => editorViewportsById[editorViewportId] ?? null)
      .filter(
        (viewport) =>
          viewport !== null && !popupManagedViewportIdSet.has(viewport.editorViewportId),
      )
    const orderedViewportIdSet = new Set(ordered.map((viewport) => viewport.editorViewportId))
    const unordered = Object.values(editorViewportsById)
      .filter(
        (viewport) =>
          !orderedViewportIdSet.has(viewport.editorViewportId) &&
          !popupManagedViewportIdSet.has(viewport.editorViewportId),
      )
      .sort((left, right) => left.zOrder - right.zOrder)
    return [...ordered, ...unordered]
  })()
  const [dockedMeatballPortalTarget, setDockedMeatballPortalTarget] = useState<HTMLDivElement | null>(
    null,
  )
  const [localWindowSettingsOpenByViewportId, setLocalWindowSettingsOpenByViewportId] = useState<
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
  const [splitDockPreview, setSplitDockPreview] = useState<WorkspaceSplitDockPreview | null>(null)
  const floatingPosByViewportIdRef = useRef<Record<string, FloatingPosition>>({})
  const floatingSizeByViewportIdRef = useRef<Record<string, FloatingSize>>({})
  const splitDockPreviewRef = useRef<WorkspaceSplitDockPreview | null>(null)
  const floatingDockLockRef = useRef<{
    editorViewportId: string
  } | null>(null)
  const dragRef = useRef<{
    editorViewportId: string
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null>(null)
  const resizeRef = useRef<{
    editorViewportId: string
    startPointerX: number
    startPointerY: number
    startWidth: number
    startHeight: number
  } | null>(null)
  const effectiveWindowSettingsOpenByViewportId =
    windowSettingsOpenByViewportId ?? localWindowSettingsOpenByViewportId
  const setViewportWindowSettingsOpen = useCallback(
    (editorViewportId: string, isOpen: boolean) => {
      if (onSetWindowSettingsOpen !== undefined) {
        onSetWindowSettingsOpen(editorViewportId, isOpen)
        return
      }
      setLocalWindowSettingsOpenByViewportId((current) => ({
        ...current,
        [editorViewportId]: isOpen,
      }))
    },
    [onSetWindowSettingsOpen],
  )
  const meatballDockDragIntentRef = useRef<{
    startClientX: number
    startClientY: number
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const lastLeftDockWidthRef = useRef<number | null>(null)
  const viewportSlotByEditorViewportId = useMemo(() => {
    const next: Record<string, (typeof viewportSlotsById)[string]> = {}
    for (const slot of Object.values(viewportSlotsById)) {
      if (slot.surfaceKind === 'spaghettiEditor') {
        next[slot.surfaceInstanceId] = slot
      }
    }
    return next
  }, [viewportSlotsById])

  const orderedViewportStates = orderedEditorViewports.map((viewport) => {
    const editorViewportId = viewport.editorViewportId
    const placement = editorSurfacePlacementById[editorViewportId] ?? null
    const slot = viewportSlotByEditorViewportId[editorViewportId] ?? null
    const windowMode = viewport.windowMode ?? placement?.windowMode
    const position = viewport.position ?? placement?.position ?? defaultEditorSurfacePosition
    const size = viewport.size ?? placement?.size ?? defaultEditorSurfaceSize
    const splitDirection =
      viewport.splitDirection ?? placement?.splitDirection ?? defaultWorkspaceSplitDirection
    const splitDockSide =
      viewport.splitDockSide ??
      placement?.splitDockSide ??
      resolveDefaultWorkspaceSplitDockSide(splitDirection)
    const splitRatio = viewport.splitRatio ?? placement?.splitRatio ?? 0.5
    const windowAppearance =
      windowAppearanceByViewportId[editorViewportId] ?? defaultSpaghettiWindowAppearance
    const headerCollapsed = headerCollapsedByViewportId[editorViewportId] ?? false
    const canvasToolbarVisible = canvasToolbarVisibleByViewportId[editorViewportId] ?? true
    const isEssentials = windowMode === 'maximized' && headerCollapsed && !canvasToolbarVisible
    return {
      viewport,
      placement,
      slot,
      windowMode,
      position,
      size,
      splitDirection,
      splitDockSide,
      splitRatio,
      splitPriority: viewport.splitPriority ?? placement?.splitPriority ?? 'balanced',
      headerCollapsed,
      headerToggleRevision: headerToggleRevisionByViewportId[editorViewportId] ?? 0,
      canvasToolbarVisible,
      isWindowSettingsOpen: effectiveWindowSettingsOpenByViewportId[editorViewportId] ?? false,
      savedActionTrayExpanded: actionTrayExpandedByViewportId[editorViewportId] ?? false,
      windowAppearance,
      isWindowClampEditing: windowClampEditingByViewportId[editorViewportId] ?? false,
      isEssentials,
      isSlotted: slot !== null,
      isFloatingInApp:
        slot === null &&
        (windowMode === 'expanded' || windowMode === 'maximized' || windowMode === 'collapsed'),
      isMeatballDock: slot === null && windowMode === 'meatball editor view',
      isDetached: windowMode === 'separateWindow',
    }
  })

  const activeViewportState =
    orderedViewportStates.find(
      (viewportState) => viewportState.viewport.editorViewportId === activeEditorViewportId,
    ) ?? null
  const hasFloatingViewportInApp = orderedViewportStates.some(
    (viewportState) => viewportState.isFloatingInApp,
  )

  const activeWindowMode = activeViewportState?.windowMode ?? null
  const showFloatingShell = activeViewportState?.isFloatingInApp ?? false
  const canDragFloatingWindow =
    activeWindowMode === 'expanded' || activeWindowMode === 'collapsed'
  const canResizeFloatingWindow = activeWindowMode === 'expanded'
  const activeEditorSize = activeViewportState?.size ?? defaultEditorSurfaceSize
  const splitDirection = activeViewportState?.splitDirection ?? defaultWorkspaceSplitDirection
  const splitDockSide =
    activeViewportState?.splitDockSide ?? resolveDefaultWorkspaceSplitDockSide(splitDirection)

  const getFloatingShellFrame = useCallback(() => {
    const shellElement = appShellRef.current
    const viewportElement = viewportRef.current
    const primaryViewportBodyElement =
      viewportElement?.querySelector('.ViewportFrame.isPrimarySlot .ViewportFrameBody') instanceof
      HTMLElement
        ? (viewportElement.querySelector('.ViewportFrame.isPrimarySlot .ViewportFrameBody') as HTMLElement)
        : null
    const shellRect = shellElement?.getBoundingClientRect()
    const primaryViewportBodyRect = primaryViewportBodyElement?.getBoundingClientRect()
    const viewportRect = viewportElement?.getBoundingClientRect()
    const fallbackShellWidth =
      shellElement?.clientWidth ??
      (typeof window === 'undefined' ? 1440 : Math.max(1, window.innerWidth))
    const fallbackShellHeight =
      shellElement?.clientHeight ??
      (typeof window === 'undefined' ? 900 : Math.max(1, window.innerHeight))
    const fallbackViewportWidth =
      viewportElement?.clientWidth ??
      (typeof window === 'undefined' ? fallbackShellWidth : Math.max(1, window.innerWidth))
    const fallbackViewportHeight =
      viewportElement?.clientHeight ??
      (typeof window === 'undefined' ? fallbackShellHeight : Math.max(1, window.innerHeight))
    if (
      shellElement === null ||
      viewportElement === null ||
      shellRect === undefined ||
      viewportRect === undefined
    ) {
      return null
    }
    const shellWidth = Math.max(1, Math.round(shellRect.width || fallbackShellWidth))
    const shellHeight = Math.max(1, Math.round(shellRect.height || fallbackShellHeight))
    const viewportWidth = Math.max(1, Math.round(viewportRect.width || fallbackViewportWidth))
    const viewportHeight = Math.max(1, Math.round(viewportRect.height || fallbackViewportHeight))
    const viewportOffsetLeft =
      viewportRect.width > 0 ? Math.round(viewportRect.left - shellRect.left) : 0
    const viewportOffsetTop =
      viewportRect.height > 0 ? Math.round(viewportRect.top - shellRect.top) : 0
    const bodyOffsetTop =
      primaryViewportBodyRect !== undefined &&
      primaryViewportBodyRect.width > 0 &&
      primaryViewportBodyRect.height > 0
        ? Math.round(primaryViewportBodyRect.top - shellRect.top)
        : viewportOffsetTop
    const bodyHeight =
      primaryViewportBodyRect !== undefined &&
      primaryViewportBodyRect.width > 0 &&
      primaryViewportBodyRect.height > 0
        ? Math.max(1, Math.round(primaryViewportBodyRect.height))
        : viewportHeight
    return {
      shellWidth,
      shellHeight,
      offsetLeft: viewportOffsetLeft,
      offsetTop: viewportOffsetTop,
      viewportWidth,
      viewportHeight,
      bodyOffsetTop,
      bodyHeight,
    }
  }, [appShellRef, viewportRef])

  const getFloatingSizeForViewport = useCallback(
    (editorViewportId: string, fallbackSize?: FloatingSize): FloatingSize =>
      floatingSizeByViewportIdRef.current[editorViewportId] ??
      fallbackSize ??
      initialFloatingSize,
    [],
  )

  const getFloatingPosForViewport = useCallback(
    (editorViewportId: string, fallbackPos?: FloatingPosition): FloatingPosition =>
      floatingPosByViewportIdRef.current[editorViewportId] ??
      fallbackPos ??
      initialFloatingPosition,
    [],
  )

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

  const getWindowAppearanceStyle = useCallback(resolveSpaghettiWindowAppearanceStyle, [])

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
    (pos: FloatingPosition, size: FloatingSize = initialFloatingSize): FloatingPosition => {
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
      const minViewportX = -frame.offsetLeft
      const maxX = Math.max(
        minViewportX,
        frame.shellWidth - frame.offsetLeft - size.width - floatingEdgePadding,
      )
      const minY = frame.bodyOffsetTop
      const maxY = Math.max(
        minY,
        frame.bodyOffsetTop + frame.bodyHeight - minVisibleFloatingHandleHeight,
      )
      return {
        x: Math.min(maxX, Math.max(minViewportX, Math.round(pos.x))),
        y: Math.min(maxY, Math.max(minY, Math.round(pos.y))),
      }
    },
    [getFloatingShellFrame],
  )

  const resolveDockLockedFloatingPos = useCallback(
    (editorViewportId: string, nextLeftDockWidth: number): FloatingPosition | null => {
      const viewportState =
        orderedViewportStates.find((currentViewport) => currentViewport.viewport.editorViewportId === editorViewportId) ??
        null
      if (
        viewportState === null ||
        (viewportState.windowMode !== 'expanded' && viewportState.windowMode !== 'collapsed')
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
      const floatingPos = getFloatingPosForViewport(editorViewportId, viewportState.position)
      const floatingSize = getFloatingSizeForViewport(editorViewportId, viewportState.size)
      const isLockedToDock = floatingDockLockRef.current?.editorViewportId === editorViewportId
      if (!isLockedToDock && floatingPos.x >= lockBoundaryX) {
        return null
      }
      return clampFloatingPos({
        x: lockBoundaryX,
        y: floatingPos.y,
      }, floatingSize)
    },
    [clampFloatingPos, getFloatingPosForViewport, getFloatingSizeForViewport, orderedViewportStates, viewportRef],
  )

  const resolveSplitDockPreview = useCallback(
    (pointerClientX: number, pointerClientY: number): WorkspaceSplitDockPreview | null =>
      resolveWorkspaceSplitDockPreview(
        viewportRef.current,
        viewportSlotsById,
        pointerClientX,
        pointerClientY,
      ),
    [viewportRef, viewportSlotsById],
  )

  const dockEditorViewportIntoWorkspaceSplit = useCallback(
    (
      editorViewportId: string,
      splitPreview: WorkspaceSplitDockPreview,
    ) => {
      const splitDockSide = splitPreview.side
      const preferredRatio = orderedViewportStates.find(
        (currentViewport) => currentViewport.viewport.editorViewportId === editorViewportId,
      )?.splitRatio
      setActiveEditorViewportId(editorViewportId)
      useSpaghettiStore.getState().setEditorViewportSplitDockSide(editorViewportId, splitDockSide)
      useSpaghettiStore.getState().setEditorViewportWindowMode(editorViewportId, 'expanded')
      if (splitPreview.scope === 'global') {
        commitWorkspaceSurfaceRootSplit(editorViewportId, splitDockSide, {
          preferredRatio,
        })
        return
      }
      const targetSlotId =
        splitPreview.targetSlotId ??
        viewportSlotByEditorViewportId[editorViewportId]?.slotId ??
        defaultPrimaryViewportSlotId
      commitWorkspaceSurfaceSlotSplit(editorViewportId, targetSlotId, splitDockSide, {
        preferredRatio,
      })
    },
    [
      commitWorkspaceSurfaceRootSplit,
      commitWorkspaceSurfaceSlotSplit,
      orderedViewportStates,
      setActiveEditorViewportId,
      viewportSlotByEditorViewportId,
    ],
  )

  useEffect(() => {
    setDockedMeatballPortalTarget(dockedMeatballHostRef.current)
  }, [dockedMeatballHostRef])

  useEffect(() => {
    setFloatingSpaghettiPortalTarget(appShellRef.current)
  }, [appShellRef])

  useEffect(() => {
    for (const viewportState of orderedViewportStates) {
      floatingPosByViewportIdRef.current[viewportState.viewport.editorViewportId] = viewportState.position
      floatingSizeByViewportIdRef.current[viewportState.viewport.editorViewportId] = viewportState.size
    }
  }, [orderedViewportStates])

  useEffect(() => {
    splitDockPreviewRef.current = splitDockPreview
  }, [splitDockPreview])

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
    if (!hasFloatingViewportInApp && splitDockPreview !== null) {
      setSplitDockPreview(null)
    }
  }, [hasFloatingViewportInApp, splitDockPreview])

  useEffect(() => {
    if (!hasFloatingViewportInApp) {
      floatingDockLockRef.current = null
    }
  }, [hasFloatingViewportInApp])

  useEffect(() => {
    if (
      appShellRef.current?.clientWidth === undefined ||
      appShellRef.current.clientWidth <= 0 ||
      viewportRef.current?.clientWidth === undefined ||
      viewportRef.current.clientWidth <= 0
    ) {
      return
    }
    for (const viewportState of orderedViewportStates) {
      if (!viewportState.isFloatingInApp) {
        continue
      }
      if (viewportState.windowMode !== 'expanded' && viewportState.windowMode !== 'collapsed') {
        continue
      }
      const clampedSize = normalizeFloatingSize(viewportState.size)
      if (
        clampedSize.width !== viewportState.size.width ||
        clampedSize.height !== viewportState.size.height
      ) {
        setEditorViewportSize(viewportState.viewport.editorViewportId, clampedSize)
      }
      const clampedPos = clampFloatingPos(viewportState.position, clampedSize)
      if (
        clampedPos.x !== viewportState.position.x ||
        clampedPos.y !== viewportState.position.y
      ) {
        setEditorViewportPosition(viewportState.viewport.editorViewportId, clampedPos)
      }
    }
  }, [
    clampFloatingPos,
    normalizeFloatingSize,
    orderedViewportStates,
    setEditorViewportPosition,
    setEditorViewportSize,
  ])

  useEffect(() => {
    const handleResize = () => {
      if (
        appShellRef.current?.clientWidth === undefined ||
        appShellRef.current.clientWidth <= 0 ||
        viewportRef.current?.clientWidth === undefined ||
        viewportRef.current.clientWidth <= 0
      ) {
        return
      }
      for (const viewportState of orderedViewportStates) {
        if (!viewportState.isFloatingInApp) {
          continue
        }
        if (viewportState.windowMode !== 'expanded' && viewportState.windowMode !== 'collapsed') {
          continue
        }
        const nextSize = normalizeFloatingSize(viewportState.size)
        if (
          nextSize.width !== viewportState.size.width ||
          nextSize.height !== viewportState.size.height
        ) {
          setEditorViewportSize(viewportState.viewport.editorViewportId, nextSize)
        }
        const nextPos = clampFloatingPos(viewportState.position, nextSize)
        if (
          nextPos.x !== viewportState.position.x ||
          nextPos.y !== viewportState.position.y
        ) {
          setEditorViewportPosition(viewportState.viewport.editorViewportId, nextPos)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [
    clampFloatingPos,
    normalizeFloatingSize,
    orderedViewportStates,
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
    const dockLockedPos = resolveDockLockedFloatingPos(activeEditorViewport.editorViewportId, leftDockWidth)
    if (dockLockedPos === null) {
      return
    }
    floatingDockLockRef.current = {
      editorViewportId: activeEditorViewport.editorViewportId,
    }
    floatingPosByViewportIdRef.current[activeEditorViewport.editorViewportId] = dockLockedPos
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
      const dockLockedPos = resolveDockLockedFloatingPos(
        activeEditorViewport.editorViewportId,
        nextLeftDockWidth,
      )
      if (dockLockedPos === null) {
        return
      }
      floatingDockLockRef.current = {
        editorViewportId: activeEditorViewport.editorViewportId,
      }
      floatingPosByViewportIdRef.current[activeEditorViewport.editorViewportId] = dockLockedPos
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
      setSplitDockPreview(null)
      setActiveEditorViewportId(editorViewportId)
      dragRef.current = {
        editorViewportId,
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
        const currentViewportState =
          orderedViewportStates.find(
            (currentViewport) => currentViewport.viewport.editorViewportId === dragState.editorViewportId,
          ) ?? null
        const clamped = clampFloatingPos(
          candidate,
          getFloatingSizeForViewport(dragState.editorViewportId, currentViewportState?.size),
        )
        floatingPosByViewportIdRef.current[dragState.editorViewportId] = clamped
        setEditorViewportPosition(dragState.editorViewportId, clamped)
        const nextDockPreviewPanelId = resolveLeftDockPreviewPanelId(
          'meatball-editor',
          moveEvent.clientX,
          moveEvent.clientY,
        )
        setActiveLeftDockPreviewPanelId(nextDockPreviewPanelId)
        const nextSplitDockPreview =
          nextDockPreviewPanelId === null
            ? resolveSplitDockPreview(moveEvent.clientX, moveEvent.clientY)
            : null
        splitDockPreviewRef.current = nextSplitDockPreview
        setSplitDockPreview(nextSplitDockPreview)
      }

      const handleUp = (upEvent: PointerEvent) => {
        const dragState = dragRef.current
        const nextSplitDockPreview =
          splitDockPreviewRef.current ??
          (dragState !== null
            ? resolveSplitDockPreview(upEvent.clientX, upEvent.clientY)
            : null)
        const shouldDockToMeatball =
          resolveLeftDockPreviewPanelId('meatball-editor', upEvent.clientX, upEvent.clientY) ===
          'meatball-editor'
        dragRef.current = null
        setActiveLeftDockPreviewPanelId(null)
        setSplitDockPreview(null)
        if (shouldDockToMeatball) {
          setEditorViewportHeaderCollapsed(dragState?.editorViewportId ?? editorViewportId, true)
          setEditorViewportWindowMode(
            dragState?.editorViewportId ?? editorViewportId,
            'meatball editor view',
          )
        } else if (nextSplitDockPreview !== null) {
          dockEditorViewportIntoWorkspaceSplit(
            dragState?.editorViewportId ?? editorViewportId,
            nextSplitDockPreview,
          )
        }
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [
      clampFloatingPos,
      getFloatingSizeForViewport,
      orderedViewportStates,
      resolveLeftDockPreviewPanelId,
      setActiveEditorViewportId,
      setActiveLeftDockPreviewPanelId,
      dockEditorViewportIntoWorkspaceSplit,
      setEditorViewportHeaderCollapsed,
      setEditorViewportPosition,
      setEditorViewportWindowMode,
      resolveSplitDockPreview,
      viewportRef,
    ],
  )

  const handleViewportDragStart = useCallback(
    (editorViewportId: string, event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }
      const viewportState =
        orderedViewportStates.find(
          (currentViewport) => currentViewport.viewport.editorViewportId === editorViewportId,
        ) ?? null
      if (
        viewportState === null ||
        (viewportState.windowMode !== 'expanded' && viewportState.windowMode !== 'collapsed')
      ) {
        return
      }
      const viewportElement = viewportRef.current
      const titleBarElement = event.currentTarget
      if (viewportElement === null) {
        return
      }

      const viewportRect = viewportElement.getBoundingClientRect()
      const titleBarRect = titleBarElement.getBoundingClientRect()
      const floatingPos = getFloatingPosForViewport(editorViewportId, viewportState.position)
      const pointerOffsetX = event.clientX - viewportRect.left - floatingPos.x
      const pointerOffsetY = event.clientY - viewportRect.top - floatingPos.y
      beginFloatingSpaghettiDrag(
        editorViewportId,
        pointerOffsetX,
        pointerOffsetY,
        Math.max(1, Math.round(titleBarRect.height)),
      )
      event.preventDefault()
    },
    [beginFloatingSpaghettiDrag, getFloatingPosForViewport, orderedViewportStates, viewportRef],
  )

  useLayoutEffect(() => {
    if (!showFloatingShell || activeEditorViewport === null || slotHeaderDragSeed === null) {
      return
    }
    const viewportRect = viewportRef.current?.getBoundingClientRect()
    if (viewportRect !== undefined) {
      const nextPos = clampFloatingPos({
        x: slotHeaderDragSeed.clientX - viewportRect.left - slotHeaderDragSeed.pointerOffsetX,
        y: slotHeaderDragSeed.clientY - viewportRect.top - slotHeaderDragSeed.pointerOffsetY,
      }, getFloatingSizeForViewport(activeEditorViewport.editorViewportId, activeEditorSize))
      floatingPosByViewportIdRef.current[activeEditorViewport.editorViewportId] = nextPos
      setEditorViewportPosition(activeEditorViewport.editorViewportId, nextPos)
    }
    beginFloatingSpaghettiDrag(
      activeEditorViewport.editorViewportId,
      slotHeaderDragSeed.pointerOffsetX,
      slotHeaderDragSeed.pointerOffsetY,
      slotHeaderDragSeed.titleBarHeight,
    )
    onConsumeSlotHeaderDragSeed()
  }, [
    activeEditorViewport,
    beginFloatingSpaghettiDrag,
    clampFloatingPos,
    getFloatingSizeForViewport,
    activeEditorSize,
    onConsumeSlotHeaderDragSeed,
    setEditorViewportPosition,
    showFloatingShell,
    slotHeaderDragSeed,
    viewportRef,
  ])

  const handleViewportResizeStart = useCallback(
    (editorViewportId: string, event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }
      const viewportState =
        orderedViewportStates.find(
          (currentViewport) => currentViewport.viewport.editorViewportId === editorViewportId,
        ) ?? null
      if (viewportState === null || viewportState.windowMode !== 'expanded') {
        return
      }
      setActiveEditorViewportId(editorViewportId)
      const startSize = getFloatingSizeForViewport(editorViewportId, viewportState.size)
      resizeRef.current = {
        editorViewportId,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startWidth: startSize.width,
        startHeight: startSize.height,
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
        floatingSizeByViewportIdRef.current[state.editorViewportId] = nextSize
        setEditorViewportSize(state.editorViewportId, nextSize)
        const currentViewportState =
          orderedViewportStates.find(
            (currentViewport) => currentViewport.viewport.editorViewportId === state.editorViewportId,
          ) ?? null
        const clamped = clampFloatingPos(
          getFloatingPosForViewport(state.editorViewportId, currentViewportState?.position),
          nextSize,
        )
        floatingPosByViewportIdRef.current[state.editorViewportId] = clamped
        setEditorViewportPosition(state.editorViewportId, clamped)
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
      clampFloatingPos,
      clampFloatingSize,
      getFloatingPosForViewport,
      getFloatingSizeForViewport,
      orderedViewportStates,
      setActiveEditorViewportId,
      setEditorViewportPosition,
      setEditorViewportSize,
    ],
  )

  const handleSpaghettiDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || !canDragFloatingWindow) {
        return
      }
      handleViewportDragStart(activeEditorViewport.editorViewportId, event)
    },
    [activeEditorViewport, canDragFloatingWindow, handleViewportDragStart],
  )

  const handleSpaghettiResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || !canResizeFloatingWindow) {
        return
      }
      handleViewportResizeStart(activeEditorViewport.editorViewportId, event)
    },
    [activeEditorViewport, canResizeFloatingWindow, handleViewportResizeStart],
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
    setViewportWindowSettingsOpen(
      editorViewportId,
      !(effectiveWindowSettingsOpenByViewportId[editorViewportId] ?? false),
    )
  }, [activeEditorViewport, effectiveWindowSettingsOpenByViewportId, setViewportWindowSettingsOpen])

  const handleViewportWindowSettingsToggle = useCallback((editorViewportId: string) => {
    setViewportWindowSettingsOpen(
      editorViewportId,
      !(effectiveWindowSettingsOpenByViewportId[editorViewportId] ?? false),
    )
  }, [effectiveWindowSettingsOpenByViewportId, setViewportWindowSettingsOpen])

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
        const nextFloatingSize = hasUndocked
          ? getFloatingSizeForViewport(editorViewportId, startSize)
          : normalizeFloatingSize(startSize)
        const nextPos = clampFloatingPos(
          {
            x: moveEvent.clientX - viewportRect.left - intent.pointerOffsetX,
            y: moveEvent.clientY - viewportRect.top - intent.pointerOffsetY,
          },
          nextFloatingSize,
        )
        if (!hasUndocked) {
          floatingSizeByViewportIdRef.current[editorViewportId] = nextFloatingSize
          setEditorViewportSize(editorViewportId, nextFloatingSize)
          setEditorViewportWindowMode(editorViewportId, 'expanded')
          hasUndocked = true
        }
        floatingPosByViewportIdRef.current[editorViewportId] = nextPos
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
      getFloatingSizeForViewport,
      normalizeFloatingSize,
      setActiveLeftDockPreviewPanelId,
      setEditorViewportPosition,
      setEditorViewportSize,
      setEditorViewportWindowMode,
      viewportRef,
    ],
  )

  const handleViewportMeatballDockDragStart = useCallback(
    (editorViewportId: string, event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }
      const viewportState =
        orderedViewportStates.find(
          (currentViewport) => currentViewport.viewport.editorViewportId === editorViewportId,
        ) ?? null
      if (viewportState === null || viewportState.windowMode !== 'meatball editor view') {
        return
      }
      const panelRect = dockedMeatballHostRef.current?.getBoundingClientRect()
      if (panelRect === undefined) {
        return
      }
      const startSize = viewportState.size
      let hasUndocked = false
      meatballDockDragIntentRef.current = {
        startClientX: event.clientX,
        startClientY: event.clientY,
        pointerOffsetX: event.clientX - panelRect.left,
        pointerOffsetY: event.clientY - panelRect.top,
      }
      setActiveLeftDockPreviewPanelId(null)
      setActiveEditorViewportId(editorViewportId)

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
        const nextPos = clampFloatingPos(
          {
            x: moveEvent.clientX - viewportRect.left - intent.pointerOffsetX,
            y: moveEvent.clientY - viewportRect.top - intent.pointerOffsetY,
          },
          hasUndocked
            ? getFloatingSizeForViewport(editorViewportId, viewportState.size)
            : normalizeFloatingSize(startSize),
        )
        if (!hasUndocked) {
          const nextSize = normalizeFloatingSize(startSize)
          floatingSizeByViewportIdRef.current[editorViewportId] = nextSize
          setEditorViewportSize(editorViewportId, nextSize)
          setEditorViewportWindowMode(editorViewportId, 'expanded')
          hasUndocked = true
        }
        floatingPosByViewportIdRef.current[editorViewportId] = nextPos
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
      clampFloatingPos,
      dockedMeatballHostRef,
      getFloatingSizeForViewport,
      normalizeFloatingSize,
      orderedViewportStates,
      setActiveEditorViewportId,
      setActiveLeftDockPreviewPanelId,
      setEditorViewportPosition,
      setEditorViewportSize,
      setEditorViewportWindowMode,
      viewportRef,
    ],
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

  const handleViewportSplitToggle = useCallback(
    (editorViewportId: string) => {
      const slot = Object.values(viewportSlotsById).find(
        (candidate) =>
          candidate.surfaceKind === 'spaghettiEditor' && candidate.surfaceInstanceId === editorViewportId,
      )
      if (slot !== undefined) {
        removeViewportSlot(slot.slotId)
        setEditorViewportWindowMode(editorViewportId, 'expanded')
        return
      }
      dockEditorViewportIntoWorkspaceSplit(editorViewportId, {
        side: splitDockSide,
        scope: 'local',
        targetSlotId:
          viewportSlotByEditorViewportId[editorViewportId]?.slotId ?? defaultPrimaryViewportSlotId,
        rect: {
          left: 0,
          top: 0,
          width: 0,
          height: 0,
        },
      })
    },
    [
      dockEditorViewportIntoWorkspaceSplit,
      removeViewportSlot,
      setEditorViewportWindowMode,
      splitDockSide,
      viewportSlotByEditorViewportId,
      viewportSlotsById,
    ],
  )

  const handleSplitToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    handleViewportSplitToggle(activeEditorViewport.editorViewportId)
  }, [activeEditorViewport, handleViewportSplitToggle])

  const handleToggleViewportPopout = useCallback((editorViewportId: string) => {
    setActiveLeftDockPreviewPanelId(null)
    setSplitDockPreview(null)
    const slot = viewportSlotByEditorViewportId[editorViewportId]
    if (slot !== undefined) {
      popoutWorkspaceSurface(editorViewportId)
      return
    }
    setEditorViewportWindowMode(editorViewportId, 'separateWindow')
  }, [
    popoutWorkspaceSurface,
    setActiveLeftDockPreviewPanelId,
    setEditorViewportWindowMode,
    viewportSlotByEditorViewportId,
  ])

  const handleTogglePopout = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    handleToggleViewportPopout(activeEditorViewport.editorViewportId)
  }, [activeEditorViewport, handleToggleViewportPopout])

  const handleViewportDockFromPopout = useCallback(
    (editorViewportId: string) => {
      const viewport = editorViewportsById[editorViewportId] ?? null
      const placement = editorSurfacePlacementById[editorViewportId] ?? null
      const windowMode = placement?.windowMode ?? viewport?.windowMode ?? null
      if (windowMode !== 'separateWindow') {
        return
      }
      const popupManagedViewportIds = popupManagedViewportIdsByRootId[editorViewportId] ?? []
      for (const managedViewportId of popupManagedViewportIds) {
        closeEditorViewport(managedViewportId)
      }
      setPopupManagedViewportIdsByRootId((current) => {
        if (current[editorViewportId] === undefined) {
          return current
        }
        const next = { ...current }
        delete next[editorViewportId]
        return next
      })
      const detachedSlotSurface = detachedSlotSurfaceById[editorViewportId] ?? null
      if (detachedSlotSurface !== null) {
        restoreEditorViewportFromSeparateWindow(editorViewportId)
        redockWorkspaceSurface(editorViewportId, {
          splitDockSide: detachedSlotSurface.preferredSplitDockSide,
        })
        return
      }
      setActiveLeftDockPreviewPanelId(null)
      setSplitDockPreview(null)
      restoreEditorViewportFromSeparateWindow(editorViewportId)
    },
    [
      detachedSlotSurfaceById,
      editorSurfacePlacementById,
      editorViewportsById,
      closeEditorViewport,
      popupManagedViewportIdsByRootId,
      redockWorkspaceSurface,
      restoreEditorViewportFromSeparateWindow,
      setActiveLeftDockPreviewPanelId,
      setPopupManagedViewportIdsByRootId,
    ],
  )

  const handleViewportCloseEditor = useCallback(
    (editorViewportId: string) => {
      const popupManagedViewportIds = popupManagedViewportIdsByRootId[editorViewportId] ?? []
      for (const managedViewportId of popupManagedViewportIds) {
        closeEditorViewport(managedViewportId)
      }
      setPopupManagedViewportIdsByRootId((current) => {
        if (current[editorViewportId] === undefined) {
          return current
        }
        const next = { ...current }
        delete next[editorViewportId]
        return next
      })
      if (detachedSlotSurfaceById[editorViewportId] !== undefined) {
        clearDetachedSlotSurface(editorViewportId)
      }
      setActiveLeftDockPreviewPanelId(null)
      setSplitDockPreview(null)
      closeEditorViewport(editorViewportId)
    },
    [
      clearDetachedSlotSurface,
      closeEditorViewport,
      detachedSlotSurfaceById,
      popupManagedViewportIdsByRootId,
      setActiveLeftDockPreviewPanelId,
      setSplitDockPreview,
      setPopupManagedViewportIdsByRootId,
    ],
  )

  const handleCreatePopupSpaghettiViewport = useCallback(
    (graphDocumentId: string) => {
      const nextEditorViewportId = openGraphDocumentInNewViewport(graphDocumentId)
      if (nextEditorViewportId === null) {
        return null
      }
      return nextEditorViewportId
    },
    [openGraphDocumentInNewViewport],
  )

  const handlePopupManagedViewportIdsChange = useCallback(
    (rootEditorViewportId: string, managedViewportIds: string[]) => {
      setPopupManagedViewportIdsByRootId((current) => {
        const previousViewportIds = current[rootEditorViewportId] ?? []
        const nextViewportIds = [...managedViewportIds]
        if (
          previousViewportIds.length === nextViewportIds.length &&
          previousViewportIds.every((viewportId, index) => viewportId === nextViewportIds[index])
        ) {
          return current
        }
        if (nextViewportIds.length === 0) {
          if (current[rootEditorViewportId] === undefined) {
            return current
          }
          const next = { ...current }
          delete next[rootEditorViewportId]
          return next
        }
        return {
          ...current,
          [rootEditorViewportId]: nextViewportIds,
        }
      })
    },
    [],
  )

  const handleCloseEditor = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    handleViewportCloseEditor(activeEditorViewport.editorViewportId)
  }, [activeEditorViewport, handleViewportCloseEditor])

  const splitDockGhostStyle = useMemo(() => {
    if (splitDockPreview === null) {
      return null
    }
    const previewRatio = 0.25
    const horizontalPreviewWidth = Math.max(
      0,
      splitDockPreview.rect.width * previewRatio - splitDividerHeight,
    )
    const verticalPreviewHeight = Math.max(
      0,
      splitDockPreview.rect.height * previewRatio - splitDividerHeight,
    )
    if (splitDockPreview.side === 'bottom') {
      return {
        left: `${splitDockPreview.rect.left}px`,
        top: `${splitDockPreview.rect.top + splitDockPreview.rect.height * (1 - previewRatio) + splitDividerHeight}px`,
        width: `${splitDockPreview.rect.width}px`,
        height: `${verticalPreviewHeight}px`,
        right: 'auto',
        bottom: 'auto',
      } as CSSProperties
    }
    if (splitDockPreview.side === 'top') {
      return {
        left: `${splitDockPreview.rect.left}px`,
        top: `${splitDockPreview.rect.top}px`,
        width: `${splitDockPreview.rect.width}px`,
        height: `${verticalPreviewHeight}px`,
        right: 'auto',
        bottom: 'auto',
      } as CSSProperties
    }
    if (splitDockPreview.side === 'right') {
      return {
        left: `${splitDockPreview.rect.left + splitDockPreview.rect.width * (1 - previewRatio) + splitDividerHeight}px`,
        top: `${splitDockPreview.rect.top}px`,
        width: `${horizontalPreviewWidth}px`,
        height: `${splitDockPreview.rect.height}px`,
        right: 'auto',
        bottom: 'auto',
      } as CSSProperties
    }
    return {
      left: `${splitDockPreview.rect.left}px`,
      top: `${splitDockPreview.rect.top}px`,
      width: `${horizontalPreviewWidth}px`,
      height: `${splitDockPreview.rect.height}px`,
      right: 'auto',
      bottom: 'auto',
    } as CSSProperties
  }, [splitDockPreview])

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

  const meatballViewportState =
    orderedViewportStates.find((viewportState) => viewportState.isMeatballDock) ?? null
  const floatingViewportStates = orderedViewportStates.filter((viewportState) => viewportState.isFloatingInApp)

  const meatballShell =
    meatballViewportState !== null ? (
      <div
        className="SpaghettiMeatballHost SpaghettiWindowShell"
        onPointerDown={() =>
          onActivateSpaghettiSurface(meatballViewportState.viewport.editorViewportId)
        }
        style={getWindowAppearanceStyle(meatballViewportState.windowAppearance)}
      >
        <SpaghettiWindowTitleBar
          editorViewportId={meatballViewportState.viewport.editorViewportId}
          onPrimaryViewModeCycle={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handlePrimaryViewModeCycle
              : () => handleViewportPrimaryViewModeCycle(meatballViewportState.viewport.editorViewportId)
          }
          onActionTrayToggle={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleActionTrayToggle
              : () => handleViewportActionTrayToggle(meatballViewportState.viewport.editorViewportId)
          }
          onWindowSettingsToggle={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleWindowSettingsToggle
              : () => handleViewportWindowSettingsToggle(meatballViewportState.viewport.editorViewportId)
          }
          onHeaderToggle={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleHeaderToggle
              : () => handleViewportHeaderToggle(meatballViewportState.viewport.editorViewportId)
          }
          onCanvasToolbarToggle={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleCanvasToolbarToggle
              : () => handleViewportCanvasToolbarToggle(meatballViewportState.viewport.editorViewportId)
          }
          onMeatball={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleMeatballMode
              : () => handleViewportMeatballMode(meatballViewportState.viewport.editorViewportId)
          }
          onMaximizeToggle={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleMaximizeToggle
              : () => handleViewportMaximizeToggle(meatballViewportState.viewport.editorViewportId)
          }
          onSplitToggle={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleSplitToggle
              : () => handleViewportSplitToggle(meatballViewportState.viewport.editorViewportId)
          }
          onTogglePopout={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleTogglePopout
              : () => handleToggleViewportPopout(meatballViewportState.viewport.editorViewportId)
          }
          onClose={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleCloseEditor
              : () => handleViewportCloseEditor(meatballViewportState.viewport.editorViewportId)
          }
          onDragStart={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleMeatballDockDragStart
              : (event) =>
                  handleViewportMeatballDockDragStart(meatballViewportState.viewport.editorViewportId, event)
          }
          isCollapsed={false}
          isActionTrayExpanded={meatballViewportState.savedActionTrayExpanded}
          isWindowSettingsOpen={meatballViewportState.isWindowSettingsOpen}
          isHeaderCollapsed={meatballViewportState.headerCollapsed}
          isCanvasToolbarVisible={meatballViewportState.canvasToolbarVisible}
          isMeatball
          isEssentials={meatballViewportState.isEssentials}
          isMaximized={false}
          isSplit={meatballViewportState.isSlotted}
        />
        <SpaghettiPanel
          editorViewportId={meatballViewportState.viewport.editorViewportId}
          onActivateEditorContext={onActivateSpaghettiSurface}
          isEssentials={meatballViewportState.isEssentials}
          isWindowSettingsOpen={meatballViewportState.isWindowSettingsOpen}
          isClampEditing={meatballViewportState.isWindowClampEditing}
          windowAppearance={meatballViewportState.windowAppearance}
          onWindowAppearanceChange={(patch) =>
            handleWindowAppearanceChange(meatballViewportState.viewport.editorViewportId, patch)
          }
          onToggleClampEditing={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleWindowClampEditingToggle
              : () => handleViewportWindowClampEditingToggle(meatballViewportState.viewport.editorViewportId)
          }
          onResetWindowAppearance={() =>
            handleResetWindowAppearance(meatballViewportState.viewport.editorViewportId)
          }
          isHeaderCollapsed={meatballViewportState.headerCollapsed}
          isCanvasToolbarVisible={meatballViewportState.canvasToolbarVisible}
          headerToggleRevision={meatballViewportState.headerToggleRevision}
          onSetHeaderCollapsed={
            meatballViewportState.viewport.editorViewportId === activeEditorViewportId
              ? handleSetHeaderCollapsed
              : (collapsed) =>
                  handleSetViewportHeaderCollapsed(
                    meatballViewportState.viewport.editorViewportId,
                    collapsed,
                  )
          }
        />
      </div>
    ) : null

  return (
    <>
      {dockedMeatballPortalTarget !== null && meatballShell !== null
        ? createPortal(meatballShell, dockedMeatballPortalTarget)
        : null}
      <>
        {viewerSurface}
        {splitDockPreview !== null && splitDockGhostStyle !== null ? (
          <div
            className={`ViewportSplitDockGhost ${
              splitDockPreview.scope === 'global'
                ? 'isWholeBrowserScope'
                : 'isPaneLocalScope'
            } ${
              splitDockPreview.side === 'left'
                ? 'isDockLeft'
                : splitDockPreview.side === 'right'
                  ? 'isDockRight'
                  : splitDockPreview.side === 'top'
                    ? 'isDockTop'
                    : 'isDockBottom'
            }`}
            data-split-preview-scope={splitDockPreview.scope}
            style={splitDockGhostStyle}
            aria-hidden="true"
          />
        ) : null}
      </>
      {floatingSpaghettiPortalTarget !== null &&
      floatingViewportStates.length > 0 &&
      getFloatingShellFrame() !== null
        ? createPortal(
            <aside className="SpaghettiFloatingDock">
              {floatingViewportStates.map((viewportState) => {
                  const floatingFrame = getFloatingShellFrame()!
                  const isActiveViewportShell =
                    viewportState.viewport.editorViewportId === activeEditorViewportId
                  return (
                    <div
                      key={viewportState.viewport.editorViewportId}
                      className={`SpaghettiFloatingWindow SpaghettiWindowShell ${
                        viewportState.windowMode === 'maximized'
                          ? 'isMaximized'
                          : viewportState.windowMode === 'collapsed'
                            ? 'isCollapsed'
                            : ''
                      } ${viewportState.isEssentials ? 'isEssentials' : ''} ${
                        workspaceActiveSurface === 'spaghetti' &&
                        activeEditorViewportId === viewportState.viewport.editorViewportId
                          ? 'isActiveWindow'
                          : ''
                      }`}
                      onPointerDown={() =>
                        onActivateSpaghettiFloatingWindow(
                          viewportState.viewport.editorViewportId,
                        )
                      }
                      style={{
                        left: `${
                          viewportState.windowMode === 'maximized'
                            ? floatingFrame.offsetLeft
                            : floatingFrame.offsetLeft + viewportState.position.x
                        }px`,
                        top: `${
                          viewportState.windowMode === 'maximized'
                            ? floatingFrame.offsetTop
                            : floatingFrame.offsetTop + viewportState.position.y
                        }px`,
                        width: `${
                          viewportState.windowMode === 'maximized'
                            ? floatingFrame.viewportWidth
                            : viewportState.size.width
                        }px`,
                        height:
                          viewportState.windowMode === 'maximized'
                            ? `${floatingFrame.viewportHeight}px`
                            : viewportState.windowMode === 'collapsed'
                              ? undefined
                              : `${viewportState.size.height}px`,
                        maxHeight:
                          viewportState.windowMode === 'maximized'
                            ? `${floatingFrame.viewportHeight}px`
                            : undefined,
                        right: 'auto',
                        bottom: 'auto',
                        zIndex: viewportState.viewport.zOrder,
                        ...getWindowAppearanceStyle(viewportState.windowAppearance),
                      }}
                    >
                      <SpaghettiWindowTitleBar
                        editorViewportId={viewportState.viewport.editorViewportId}
                        onPrimaryViewModeCycle={
                          isActiveViewportShell
                            ? handlePrimaryViewModeCycle
                            : () => handleViewportPrimaryViewModeCycle(viewportState.viewport.editorViewportId)
                        }
                        onActionTrayToggle={
                          isActiveViewportShell
                            ? handleActionTrayToggle
                            : () => handleViewportActionTrayToggle(viewportState.viewport.editorViewportId)
                        }
                        onWindowSettingsToggle={
                          isActiveViewportShell
                            ? handleWindowSettingsToggle
                            : () => handleViewportWindowSettingsToggle(viewportState.viewport.editorViewportId)
                        }
                        onHeaderToggle={
                          isActiveViewportShell
                            ? handleHeaderToggle
                            : () => handleViewportHeaderToggle(viewportState.viewport.editorViewportId)
                        }
                        onCanvasToolbarToggle={
                          isActiveViewportShell
                            ? handleCanvasToolbarToggle
                            : () => handleViewportCanvasToolbarToggle(viewportState.viewport.editorViewportId)
                        }
                        onMeatball={
                          isActiveViewportShell
                            ? handleMeatballMode
                            : () => handleViewportMeatballMode(viewportState.viewport.editorViewportId)
                        }
                        onMaximizeToggle={
                          isActiveViewportShell
                            ? handleMaximizeToggle
                            : () => handleViewportMaximizeToggle(viewportState.viewport.editorViewportId)
                        }
                        onSplitToggle={
                          isActiveViewportShell
                            ? handleSplitToggle
                            : () => handleViewportSplitToggle(viewportState.viewport.editorViewportId)
                        }
                        onTogglePopout={
                          isActiveViewportShell
                            ? handleTogglePopout
                            : () => handleToggleViewportPopout(viewportState.viewport.editorViewportId)
                        }
                        onClose={
                          isActiveViewportShell
                            ? handleCloseEditor
                            : () => handleViewportCloseEditor(viewportState.viewport.editorViewportId)
                        }
                        onDragStart={
                          isActiveViewportShell
                            ? handleSpaghettiDragStart
                            : (event) => handleViewportDragStart(viewportState.viewport.editorViewportId, event)
                        }
                        onContextMenu={(event) =>
                          onOpenFloatingSplitMenu(viewportState.viewport.editorViewportId, event)
                        }
                        isCollapsed={viewportState.windowMode === 'collapsed'}
                        isActionTrayExpanded={
                          viewportState.windowMode === 'maximized'
                            ? true
                            : viewportState.savedActionTrayExpanded
                        }
                        isWindowSettingsOpen={viewportState.isWindowSettingsOpen}
                        isHeaderCollapsed={viewportState.headerCollapsed}
                        isCanvasToolbarVisible={viewportState.canvasToolbarVisible}
                        isMeatball={false}
                        isEssentials={viewportState.isEssentials}
                        isMaximized={viewportState.windowMode === 'maximized'}
                        isSplit={viewportState.isSlotted || viewportState.windowMode === 'split view'}
                      />
                      {viewportState.windowMode !== 'collapsed' ? (
                        <div
                          className={`SpaghettiFloatingBody ${
                            viewportState.isEssentials ? 'isEssentials' : ''
                          }`}
                        >
                          <SpaghettiPanel
                            editorViewportId={viewportState.viewport.editorViewportId}
                            onActivateEditorContext={onActivateSpaghettiSurface}
                            isEssentials={viewportState.isEssentials}
                            isWindowSettingsOpen={viewportState.isWindowSettingsOpen}
                            isClampEditing={viewportState.isWindowClampEditing}
                            windowAppearance={viewportState.windowAppearance}
                            onWindowAppearanceChange={(patch) =>
                              handleWindowAppearanceChange(viewportState.viewport.editorViewportId, patch)
                            }
                            onToggleClampEditing={
                              isActiveViewportShell
                                ? handleWindowClampEditingToggle
                                : () =>
                                    handleViewportWindowClampEditingToggle(
                                      viewportState.viewport.editorViewportId,
                                    )
                            }
                            onResetWindowAppearance={() =>
                              handleResetWindowAppearance(viewportState.viewport.editorViewportId)
                            }
                            isHeaderCollapsed={viewportState.headerCollapsed}
                            isCanvasToolbarVisible={viewportState.canvasToolbarVisible}
                            headerToggleRevision={viewportState.headerToggleRevision}
                            onSetHeaderCollapsed={
                              isActiveViewportShell
                                ? handleSetHeaderCollapsed
                                : (collapsed) =>
                                    handleSetViewportHeaderCollapsed(
                                      viewportState.viewport.editorViewportId,
                                      collapsed,
                                    )
                            }
                          />
                        </div>
                      ) : null}
                      {viewportState.windowMode === 'expanded' ? (
                        <div
                          className="SpaghettiFloatingResizeHandle"
                          onPointerDown={
                            isActiveViewportShell
                              ? handleSpaghettiResizeStart
                              : (event) =>
                                  handleViewportResizeStart(
                                    viewportState.viewport.editorViewportId,
                                    event,
                                  )
                          }
                        />
                      ) : null}
                    </div>
                  )
                })}
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
        const viewportWindowSettingsOpen =
          effectiveWindowSettingsOpenByViewportId[editorViewportId] ?? false
        const viewportSavedActionTrayExpanded = actionTrayExpandedByViewportId[editorViewportId] ?? false
        const viewportWindowAppearance =
          windowAppearanceByViewportId[editorViewportId] ?? defaultSpaghettiWindowAppearance
        const viewportClampEditing = windowClampEditingByViewportId[editorViewportId] ?? false
        const viewportActionTrayExpanded = viewportSavedActionTrayExpanded

        return (
          <SpaghettiPopoutSurfaceHost
            key={editorViewportId}
            editorViewportId={editorViewportId}
            popoutState={popoutState}
            workspaceActiveSurface={workspaceActiveSurface}
            onActivateViewport={handleActivateViewport}
            onActivateSpaghettiFloatingWindow={onActivateSpaghettiFloatingWindow}
            onBlocked={handleViewportDockFromPopout}
            onClosed={handleViewportCloseEditor}
          >
            <SpaghettiDetachedPopoutContent
              editorViewportId={editorViewportId}
              viewportHeaderCollapsed={viewportHeaderCollapsed}
              viewportHeaderToggleRevision={viewportHeaderToggleRevision}
              viewportCanvasToolbarVisible={viewportCanvasToolbarVisible}
              viewportWindowSettingsOpen={viewportWindowSettingsOpen}
              viewportWindowAppearance={viewportWindowAppearance}
              viewportClampEditing={viewportClampEditing}
              viewportActionTrayExpanded={viewportActionTrayExpanded}
              onWindowAppearanceChange={(patch) =>
                handleWindowAppearanceChange(editorViewportId, patch)
              }
              onToggleClampEditing={() => handleViewportWindowClampEditingToggle(editorViewportId)}
              onResetWindowAppearance={() => handleResetWindowAppearance(editorViewportId)}
              onSetHeaderCollapsed={(collapsed) =>
                handleSetViewportHeaderCollapsed(editorViewportId, collapsed)
              }
              onPrimaryViewModeCycle={() => handleViewportPrimaryViewModeCycle(editorViewportId)}
              onActionTrayToggle={() => handleViewportActionTrayToggle(editorViewportId)}
              onWindowSettingsToggle={() => handleViewportWindowSettingsToggle(editorViewportId)}
              onHeaderToggle={() => handleViewportHeaderToggle(editorViewportId)}
              onCanvasToolbarToggle={() => handleViewportCanvasToolbarToggle(editorViewportId)}
              onMeatball={() => handleViewportMeatballMode(editorViewportId)}
              onMaximizeToggle={() => handleViewportMaximizeToggle(editorViewportId)}
              onSplitToggle={() => handleViewportSplitToggle(editorViewportId)}
              onDockFromPopout={() => handleViewportDockFromPopout(editorViewportId)}
              onClose={() => handleViewportCloseEditor(editorViewportId)}
              onActivateSpaghettiSurface={onActivateSpaghettiSurface}
              onActivateViewerSurface={onActivateViewerSurface}
              onCreatePopupSpaghettiViewport={handleCreatePopupSpaghettiViewport}
              onClosePopupSpaghettiViewport={handleViewportCloseEditor}
              onManagedPopupViewportIdsChange={handlePopupManagedViewportIdsChange}
            />
          </SpaghettiPopoutSurfaceHost>
        )
      })}
    </>
  )
}
