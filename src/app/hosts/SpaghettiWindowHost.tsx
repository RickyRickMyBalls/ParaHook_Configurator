import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  type MutableRefObject,
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
import {
  defaultWorkspaceSplitDirection,
  defaultWorkspaceSplitPriority,
} from '../workspace/workspaceSplitTypes'
import { type LeftDockPanelId } from './useAppShellDockController'

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
    onShellClick,
    onContextMenu,
  } = props
  const requestGraphDocumentBuild = useAppStore((state) => state.requestGraphDocumentBuild)
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
    requestGraphDocumentBuild(graphDocumentId)
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

type SpaghettiWindowHostProps = {
  viewportRef: RefObject<HTMLElement | null>
  dockedMeatballHostRef: RefObject<HTMLDivElement | null>
  leftDockWidth: number
  isLeftDockViewportSplit: boolean
  activeLeftDockPreviewPanelId: LeftDockPanelId | null
  setActiveLeftDockPreviewPanelId: Dispatch<SetStateAction<LeftDockPanelId | null>>
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
  const setEditorViewportPosition = useSpaghettiStore((state) => state.setEditorViewportPosition)
  const setEditorViewportSize = useSpaghettiStore((state) => state.setEditorViewportSize)
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
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
  const [windowClampEditingByViewportId, setWindowClampEditingByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [headerToggleRevisionByViewportId, setHeaderToggleRevisionByViewportId] = useState<
    Record<string, number>
  >({})
  const [isBottomSplitDockPreviewActive, setIsBottomSplitDockPreviewActive] = useState(false)
  const floatingPosRef = useRef<FloatingPosition>(initialFloatingPosition)
  const floatingSizeRef = useRef<FloatingSize>(initialFloatingSize)
  const isBottomSplitDockPreviewActiveRef = useRef(false)
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
  const splitResizeRef = useRef<{
    viewportTop: number
    viewportHeight: number
  } | null>(null)
  const lastLeftDockWidthRef = useRef<number | null>(null)

  const activeWindowMode = activeEditorViewport?.windowMode ?? null
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
  const splitRatio = activeEditorViewport?.splitRatio ?? 0.5
  const splitDirection = activeEditorViewport?.splitDirection ?? defaultWorkspaceSplitDirection
  const splitPriority = activeEditorViewport?.splitPriority ?? defaultWorkspaceSplitPriority
  const splitDirectionClass =
    splitDirection === 'vertical' ? 'isVertical' : 'isHorizontal'
  const splitPriorityClass =
    splitPriority === 'favorFirst'
      ? 'isFavorFirst'
      : splitPriority === 'favorSecond'
        ? 'isFavorSecond'
        : 'isBalanced'
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

  const getViewportLimits = useCallback(() => {
    const viewportElement = viewportRef.current
    if (
      viewportElement === null ||
      viewportElement.clientWidth <= 0 ||
      viewportElement.clientHeight <= 0
    ) {
      return null
    }
    return {
      maxWidth: Math.max(minFloatingWidth, viewportElement.clientWidth - 24),
      maxHeight: Math.max(minFloatingHeight, viewportElement.clientHeight - 24),
    }
  }, [viewportRef])

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
      const limits = getViewportLimits()
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
    [getViewportLimits],
  )

  const normalizeFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getViewportLimits()
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
    [clampFloatingSize, getViewportLimits],
  )

  const clampFloatingPos = useCallback(
    (pos: FloatingPosition): FloatingPosition => {
      const viewportElement = viewportRef.current
      if (
        viewportElement === null ||
        viewportElement.clientWidth <= 0 ||
        viewportElement.clientHeight <= 0
      ) {
        return {
          x: Math.max(0, Math.round(pos.x)),
          y: Math.max(0, Math.round(pos.y)),
        }
      }
      const maxX = Math.max(
        0,
        viewportElement.clientWidth - floatingSizeRef.current.width - floatingEdgePadding,
      )
      const maxY = Math.max(0, viewportElement.clientHeight - minVisibleFloatingHandleHeight)
      return {
        x: Math.min(maxX, Math.max(0, Math.round(pos.x))),
        y: Math.min(maxY, Math.max(0, Math.round(pos.y))),
      }
    },
    [viewportRef],
  )

  const resolveDockLockedFloatingPos = useCallback(
    (nextLeftDockWidth: number): FloatingPosition | null => {
      if (
        activeEditorViewport === null ||
        (activeEditorViewport.windowMode !== 'expanded' &&
          activeEditorViewport.windowMode !== 'collapsed')
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

  const shouldPreviewBottomSplitDock = useCallback(
    (candidateY: number, titleBarHeight: number) => {
      const viewportElement = viewportRef.current
      if (viewportElement === null || viewportElement.clientHeight <= 0) {
        return false
      }
      const bottomEdge = candidateY + titleBarHeight
      return bottomEdge >= viewportElement.clientHeight - 20
    },
    [viewportRef],
  )

  useEffect(() => {
    setDockedMeatballPortalTarget(dockedMeatballHostRef.current)
  }, [dockedMeatballHostRef])

  useEffect(() => {
    floatingPosRef.current = activeEditorViewport?.position ?? initialFloatingPosition
  }, [activeEditorViewport?.position])

  useEffect(() => {
    floatingSizeRef.current = activeEditorViewport?.size ?? initialFloatingSize
  }, [activeEditorViewport?.size])

  useEffect(() => {
    isBottomSplitDockPreviewActiveRef.current = isBottomSplitDockPreviewActive
  }, [isBottomSplitDockPreviewActive])

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
    if (!showFloatingShell && isBottomSplitDockPreviewActive) {
      setIsBottomSplitDockPreviewActive(false)
    }
  }, [isBottomSplitDockPreviewActive, showFloatingShell])

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
    const clampedSize = normalizeFloatingSize(activeEditorViewport.size)
    if (
      clampedSize.width !== activeEditorViewport.size.width ||
      clampedSize.height !== activeEditorViewport.size.height
    ) {
      setEditorViewportSize(activeEditorViewport.editorViewportId, clampedSize)
    }
    const clampedPos = clampFloatingPos(activeEditorViewport.position)
    if (
      clampedPos.x !== activeEditorViewport.position.x ||
      clampedPos.y !== activeEditorViewport.position.y
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
      const nextSize = normalizeFloatingSize(activeEditorViewport.size)
      if (
        nextSize.width !== activeEditorViewport.size.width ||
        nextSize.height !== activeEditorViewport.size.height
      ) {
        setEditorViewportSize(activeEditorViewport.editorViewportId, nextSize)
      }
      const nextPos = clampFloatingPos(activeEditorViewport.position)
      if (
        nextPos.x !== activeEditorViewport.position.x ||
        nextPos.y !== activeEditorViewport.position.y
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
      setIsBottomSplitDockPreviewActive(false)
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
        setActiveLeftDockPreviewPanelId(
          resolveLeftDockPreviewPanelId('meatball-editor', moveEvent.clientX, moveEvent.clientY),
        )
        const shouldPreviewBottomDock = shouldPreviewBottomSplitDock(
          clamped.y,
          dragState.titleBarHeight,
        )
        isBottomSplitDockPreviewActiveRef.current = shouldPreviewBottomDock
        setIsBottomSplitDockPreviewActive(shouldPreviewBottomDock)
      }

      const handleUp = (upEvent: PointerEvent) => {
        const dragState = dragRef.current
        const shouldDockToSplit =
          isBottomSplitDockPreviewActiveRef.current ||
          (dragState !== null &&
            shouldPreviewBottomSplitDock(floatingPosRef.current.y, dragState.titleBarHeight))
        const shouldDockToMeatball =
          resolveLeftDockPreviewPanelId('meatball-editor', upEvent.clientX, upEvent.clientY) ===
          'meatball-editor'
        dragRef.current = null
        setActiveLeftDockPreviewPanelId(null)
        setIsBottomSplitDockPreviewActive(false)
        if (shouldDockToSplit) {
          setEditorViewportWindowMode(editorViewportId, 'split view')
        } else if (shouldDockToMeatball) {
          setEditorViewportHeaderCollapsed(editorViewportId, true)
          setEditorViewportWindowMode(editorViewportId, 'meatball editor view')
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
      setEditorViewportWindowMode,
      shouldPreviewBottomSplitDock,
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
        activeEditorViewport.windowMode !== 'meatball editor view'
      ) {
        return
      }
      const panelRect = dockedMeatballHostRef.current?.getBoundingClientRect()
      if (panelRect === undefined) {
        return
      }
      const editorViewportId = activeEditorViewport.editorViewportId
      const startSize = activeEditorViewport.size
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
      activeEditorViewport.windowMode === 'maximized' && headerCollapsed && !canvasToolbarVisible

    if (activeEditorViewport.windowMode === 'collapsed') {
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

  const handleHeaderToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setHeaderToggleRevisionByViewportId((current) => ({
      ...current,
      [activeEditorViewport.editorViewportId]:
        (current[activeEditorViewport.editorViewportId] ?? 0) + 1,
    }))
    setEditorViewportHeaderCollapsed(
      activeEditorViewport.editorViewportId,
      !(headerCollapsedByViewportId[activeEditorViewport.editorViewportId] ?? false),
    )
  }, [activeEditorViewport, headerCollapsedByViewportId, setEditorViewportHeaderCollapsed])

  const handleSetHeaderCollapsed = useCallback(
    (collapsed: boolean) => {
      if (activeEditorViewport === null) {
        return
      }
      setEditorViewportHeaderCollapsed(activeEditorViewport.editorViewportId, collapsed)
    },
    [activeEditorViewport, setEditorViewportHeaderCollapsed],
  )

  const handleCanvasToolbarToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportCanvasToolbarVisible(
      activeEditorViewport.editorViewportId,
      !(canvasToolbarVisibleByViewportId[activeEditorViewport.editorViewportId] ?? true),
    )
  }, [activeEditorViewport, canvasToolbarVisibleByViewportId, setEditorViewportCanvasToolbarVisible])

  const handleMeatballMode = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setActiveLeftDockPreviewPanelId(null)
    if (activeEditorViewport.windowMode !== 'meatball editor view') {
      setEditorViewportHeaderCollapsed(activeEditorViewport.editorViewportId, true)
    }
    setEditorViewportWindowMode(
      activeEditorViewport.editorViewportId,
      activeEditorViewport.windowMode === 'meatball editor view' ? 'expanded' : 'meatball editor view',
    )
  }, [
    activeEditorViewport,
    setActiveLeftDockPreviewPanelId,
    setEditorViewportHeaderCollapsed,
    setEditorViewportWindowMode,
  ])

  const handleMaximizeToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'maximized')
  }, [activeEditorViewport, setEditorViewportWindowMode])

  const handleSplitToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'split view')
  }, [activeEditorViewport, setEditorViewportWindowMode])

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
      if (
        event.button !== 0 ||
        !event.ctrlKey ||
        activeEditorViewport === null ||
        activeWindowMode !== 'split view'
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
      const pointerOffsetX = event.clientX - titleBarRect.left
      const pointerOffsetY = event.clientY - titleBarRect.top
      const nextPos = clampFloatingPos({
        x: event.clientX - viewportRect.left - pointerOffsetX,
        y: event.clientY - viewportRect.top - pointerOffsetY,
      })

      floatingPosRef.current = nextPos
      setEditorViewportPosition(activeEditorViewport.editorViewportId, nextPos)
      setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'expanded')
      beginFloatingSpaghettiDrag(
        activeEditorViewport.editorViewportId,
        pointerOffsetX,
        pointerOffsetY,
        Math.max(1, Math.round(titleBarRect.height)),
      )
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
      ['--left-dock-split-width' as const]: `${leftDockWidth}px`,
    }),
    [leftDockWidth, splitDirection, splitRatio],
  )

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
          className={`ViewportSplitLayout ${splitDirectionClass} ${splitPriorityClass} ${
            isLeftDockViewportSplit ? 'isLeftDockSplit' : ''
          }`}
          style={splitLayoutStyle}
        >
          <div className="ViewportSplitPane ViewportSplitPane--viewer">{viewerSurface}</div>
          <div className="ViewportSplitDividerShell">
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
          <div className="ViewportSplitPane ViewportSplitPane--editor">
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
          {showFloatingShell && isBottomSplitDockPreviewActive ? (
            <div
              className={`ViewportBottomSplitDockGhost ${
                isLeftDockViewportSplit && splitPriority !== 'favorSecond' ? 'isLeftDockShifted' : ''
              }`}
              style={{
                top: `calc(${(splitRatio * 100).toFixed(4)}% + ${splitDividerHeight}px)`,
                '--left-dock-split-width': `${leftDockWidth}px`,
              } as CSSProperties}
              aria-hidden="true"
            />
          ) : null}
        </>
      )}
      {showFloatingShell && activeEditorViewport !== null ? (
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
              left:
                activeWindowMode === 'maximized' ? '0px' : `${activeEditorViewport.position.x}px`,
              top:
                activeWindowMode === 'maximized' ? '0px' : `${activeEditorViewport.position.y}px`,
              width:
                activeWindowMode === 'maximized' ? '100%' : `${activeEditorViewport.size.width}px`,
              height:
                activeWindowMode === 'maximized'
                  ? '100%'
                  : activeWindowMode === 'collapsed'
                    ? undefined
                    : `${activeEditorViewport.size.height}px`,
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
        </aside>
      ) : null}
    </>
  )
}
