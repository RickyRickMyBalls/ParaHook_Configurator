import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { BuildStatsDrawer } from './components/BuildStatsDrawer'
import { TitleStatusBar } from './components/TitleStatusBar'
import { Toolbar } from './components/Toolbar'
import { ViewToolbar } from './components/ViewToolbar'
import { ViewerHost } from './components/ViewerHost'
import { ViewportOverlay } from './components/ViewportOverlay'
import { BoxPanel } from './panels/BoxPanel'
import { BrowserPanel } from './panels/BrowserPanel'
import { PartsListPanel } from './panels/PartsListPanel'
import { SpaghettiPanel } from './panels/SpaghettiPanel'
import {
  defaultSpaghettiWindowAppearance,
  mergeSpaghettiWindowAppearance,
  type SpaghettiWindowAppearance,
} from './panels/spaghettiWindowAppearance'
import {
  defaultViewportPosition,
  defaultViewportSize,
  selectActiveEditorViewport,
  selectEditorViewportById,
  useSpaghettiStore,
} from './spaghetti/store/useSpaghettiStore'
import { useAppStore } from './store/useAppStore'
import { useBuildStatsStore } from './store/buildStatsStore'

type FloatingPosition = {
  x: number
  y: number
}

type FloatingSize = {
  width: number
  height: number
}

type LeftDockPanelId = 'browser' | 'meatball-editor'

type DockTargetRect = {
  left: number
  right: number
  top: number
  bottom: number
}

type LeftDockResizeMenuState = {
  x: number
  y: number
}

const initialFloatingPosition: FloatingPosition = defaultViewportPosition
const initialFloatingSize: FloatingSize = defaultViewportSize

const minFloatingWidth = 200
const minFloatingHeight = 200
const minBrowserFloatingWidth = 280
const minBrowserFloatingHeight = 220
const floatingEdgePadding = 12
const minVisibleFloatingHandleHeight = 56
const splitDividerHeight = 10
const dockGhostHeight = 72
const normalizedFloatingHeightRatio = 0.9
const floatingDockLockGap = 25
const defaultBrowserFloatingPosition: FloatingPosition = { x: 16, y: 96 }
const defaultBrowserFloatingSize: FloatingSize = { width: 320, height: 560 }
const defaultLeftDockWidth = 320
const minLeftDockWidth = 260
const maxLeftDockWidth = 520

function isPointInsideRect(clientX: number, clientY: number, rect: DockTargetRect | null): boolean {
  if (rect === null) {
    return false
  }
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  )
}

function SpaghettiWindowTitleBar(props: {
  editorViewportId: string
  onCollapseToggle: () => void
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
  isCollapsed: boolean
  isActionTrayExpanded: boolean
  isWindowSettingsOpen: boolean
  isHeaderCollapsed: boolean
  isCanvasToolbarVisible: boolean
  isMeatball?: boolean
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
    isMaximized,
    isSplit,
    onClose,
    onActionTrayToggle,
    onCollapseToggle,
    onWindowSettingsToggle,
    onCanvasToolbarToggle,
    onDragStart,
    onHeaderToggle,
    onMaximizeToggle,
    onMeatball,
    onSplitToggle,
    onShellClick,
  } = props
  const requestGraphDocumentBuild = useAppStore((state) => state.requestGraphDocumentBuild)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const bindEditorViewportToGraphDocument = useSpaghettiStore(
    (state) => state.bindEditorViewportToGraphDocument,
  )
  const viewport = useSpaghettiStore((state) => selectEditorViewportById(state, editorViewportId))
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const graphDocumentOrder = useSpaghettiStore((state) => state.graphDocumentOrder)
  const graphDocumentId = viewport?.graphDocumentId ?? ''
  const orderedGraphDocuments = useMemo(
    () =>
      graphDocumentOrder
        .map((nextGraphDocumentId) => graphDocumentsById[nextGraphDocumentId] ?? null)
        .filter((document) => document !== null),
    [graphDocumentOrder, graphDocumentsById],
  )
  const selectedGraphName =
    orderedGraphDocuments.find((document) => document.graphDocumentId === graphDocumentId)?.name ??
    'Graph'
  const graphSelectWidth = `${Math.min(36, Math.max(13, selectedGraphName.length + 7))}ch`

  const stopPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const stopShellDrag = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  const stopShellClick = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  const handleBuild = () => {
    if (graphDocumentId.length === 0) {
      return
    }
    requestGraphDocumentBuild(graphDocumentId)
  }

  const handleGraphChange = (nextGraphDocumentId: string) => {
    if (viewport === null || nextGraphDocumentId.length === 0) {
      return
    }
    setActiveEditorViewportId(viewport.editorViewportId)
    bindEditorViewportToGraphDocument(viewport.editorViewportId, nextGraphDocumentId)
  }

  return (
    <div
      className={`SpaghettiFloatingHandle ${isMeatball ? 'isMeatball' : ''}`}
      onPointerDown={onDragStart}
      onClick={onShellClick}
    >
      <span className="SpaghettiFloatingHandleTitle">
        {isMeatball ? 'Meatball Editor' : 'Spaghetti Editor'}
      </span>
      <div className="SpaghettiFloatingHandleRow">
        <div
          className="SpaghettiFloatingHandleGraph"
          onPointerDown={stopShellDrag}
          onClick={stopShellClick}
        >
          <select
            className="SpaghettiGraphDocumentSelect SpaghettiGraphDocumentSelect--titlebar"
            value={graphDocumentId}
            onChange={(event) => handleGraphChange(event.target.value)}
            aria-label="Select graph document for this viewport"
            style={{ width: graphSelectWidth }}
          >
            {orderedGraphDocuments.map((document) => (
              <option key={document.graphDocumentId} value={document.graphDocumentId}>
                {document.name}
              </option>
            ))}
          </select>
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
        </div>
        <div className="SpaghettiFloatingHandleActions">
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
              className={`SpaghettiWindowAction ${isCollapsed ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onCollapseToggle}
              aria-label={isCollapsed ? 'Expand editor' : 'Collapse editor'}
              title={isCollapsed ? 'Expand editor' : 'Collapse editor'}
            >
              __
            </button>
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

export function AppShell() {
  const statsExpanded = useBuildStatsStore((state) => state.statsExpanded)
  const inputMode = useAppStore((state) => state.inputMode)
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const setEditorViewportWindowMode = useSpaghettiStore((state) => state.setEditorViewportWindowMode)
  const setEditorViewportSplitRatio = useSpaghettiStore((state) => state.setEditorViewportSplitRatio)
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
  const setEditorViewportPosition = useSpaghettiStore((state) => state.setEditorViewportPosition)
  const setEditorViewportSize = useSpaghettiStore((state) => state.setEditorViewportSize)
  const showEditorSurface = inputMode === 'spaghetti' && activeEditorViewport !== null
  const appShellRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLElement | null>(null)
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const dockedMeatballHostRef = useRef<HTMLDivElement | null>(null)
  const [isBrowserFloating, setIsBrowserFloating] = useState(false)
  const [isBrowserCollapsed, setIsBrowserCollapsed] = useState(false)
  const [activeLeftDockPreviewPanelId, setActiveLeftDockPreviewPanelId] = useState<LeftDockPanelId | null>(
    null,
  )
  const [isBottomSplitDockPreviewActive, setIsBottomSplitDockPreviewActive] = useState(false)
  const [browserFloatingPos, setBrowserFloatingPos] = useState<FloatingPosition>(
    defaultBrowserFloatingPosition,
  )
  const [browserFloatingSize, setBrowserFloatingSize] = useState<FloatingSize>(
    defaultBrowserFloatingSize,
  )
  const [leftDockWidth, setLeftDockWidth] = useState(defaultLeftDockWidth)
  const [isLeftDockViewportSplit, setIsLeftDockViewportSplit] = useState(false)
  const [leftDockResizeMenu, setLeftDockResizeMenu] = useState<LeftDockResizeMenuState | null>(null)
  const [headerCollapsedByViewportId, setHeaderCollapsedByViewportId] = useState<Record<string, boolean>>({})
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
  const [splitEditorPriorityByViewportId, setSplitEditorPriorityByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [canvasToolbarVisibleByViewportId, setCanvasToolbarVisibleByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [headerToggleRevisionByViewportId, setHeaderToggleRevisionByViewportId] = useState<
    Record<string, number>
  >({})
  const floatingPosRef = useRef<FloatingPosition>(initialFloatingPosition)
  const floatingSizeRef = useRef<FloatingSize>(initialFloatingSize)
  const browserFloatingPosRef = useRef<FloatingPosition>(defaultBrowserFloatingPosition)
  const browserFloatingSizeRef = useRef<FloatingSize>(defaultBrowserFloatingSize)
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
  const browserDragRef = useRef<{
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const browserDockDragIntentRef = useRef<{
    startClientX: number
    startClientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    width: number
    height: number
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
  const leftDockResizeRef = useRef<{
    startPointerX: number
    startWidth: number
  } | null>(null)

  const activeWindowMode = activeEditorViewport?.windowMode ?? null
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
  const canDragFloatingWindow =
    activeWindowMode === 'expanded' || activeWindowMode === 'collapsed'
  const canResizeFloatingWindow = activeWindowMode === 'expanded'
  const splitRatio = activeEditorViewport?.splitRatio ?? 0.5
  const isBrowserDockPreviewActive = activeLeftDockPreviewPanelId === 'browser'
  const isMeatballDockPreviewActive = activeLeftDockPreviewPanelId === 'meatball-editor'
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
  const isSplitEditorPriority =
    activeEditorViewport === null
      ? false
      : (splitEditorPriorityByViewportId[activeEditorViewport.editorViewportId] ?? false)

  const getViewportLimits = useCallback(() => {
    const viewportElement = viewportRef.current
    if (viewportElement === null) {
      return {
        maxWidth: minFloatingWidth,
        maxHeight: minFloatingHeight,
      }
    }
    return {
      maxWidth: Math.max(minFloatingWidth, viewportElement.clientWidth - 24),
      maxHeight: Math.max(minFloatingHeight, viewportElement.clientHeight - 24),
    }
  }, [])

  const getBrowserFloatingLimits = useCallback(() => {
    const shellElement = appShellRef.current
    if (shellElement === null) {
      return {
        maxWidth: minBrowserFloatingWidth,
        maxHeight: minBrowserFloatingHeight,
      }
    }
    return {
      maxWidth: Math.max(minBrowserFloatingWidth, shellElement.clientWidth - 24),
      maxHeight: Math.max(minBrowserFloatingHeight, shellElement.clientHeight - 24),
    }
  }, [])

  const clampLeftDockWidth = useCallback((nextWidth: number) => {
    const shellWidth = appShellRef.current?.clientWidth ?? 1440
    const cappedMaxWidth = Math.min(maxLeftDockWidth, Math.max(minLeftDockWidth, shellWidth - 240))
    return Math.min(cappedMaxWidth, Math.max(minLeftDockWidth, Math.round(nextWidth)))
  }, [])

  const getWindowAppearanceStyle = useCallback((appearance: SpaghettiWindowAppearance) => {
    const titlebarTintById: Record<
      SpaghettiWindowAppearance['titlebarTint'],
      { start: [number, number, number]; end: [number, number, number] }
    > = {
      default: {
        start: [39, 48, 68],
        end: [31, 37, 54],
      },
      slate: {
        start: [56, 62, 76],
        end: [39, 44, 56],
      },
      blue: {
        start: [28, 66, 132],
        end: [23, 50, 102],
      },
      green: {
        start: [30, 88, 74],
        end: [21, 62, 52],
      },
      red: {
        start: [122, 43, 52],
        end: [88, 30, 37],
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
    } as CSSProperties
  }, [])

  const clampFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getViewportLimits()
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

  const clampFloatingPos = useCallback((pos: FloatingPosition): FloatingPosition => {
    const viewportElement = viewportRef.current
    if (viewportElement === null) {
      return {
        x: Math.max(0, Math.round(pos.x)),
        y: Math.max(0, Math.round(pos.y)),
      }
    }
    const maxX = Math.max(0, viewportElement.clientWidth - floatingSizeRef.current.width - floatingEdgePadding)
    const maxY = Math.max(
      0,
      viewportElement.clientHeight - minVisibleFloatingHandleHeight,
    )
    return {
      x: Math.min(maxX, Math.max(0, Math.round(pos.x))),
      y: Math.min(maxY, Math.max(0, Math.round(pos.y))),
    }
  }, [])

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
    [activeEditorViewport, clampFloatingPos],
  )

  const clampBrowserFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getBrowserFloatingLimits()
      return {
        width: Math.min(limits.maxWidth, Math.max(minBrowserFloatingWidth, Math.round(size.width))),
        height: Math.min(
          limits.maxHeight,
          Math.max(minBrowserFloatingHeight, Math.round(size.height)),
        ),
      }
    },
    [getBrowserFloatingLimits],
  )

  const clampBrowserFloatingPos = useCallback((pos: FloatingPosition): FloatingPosition => {
    const shellElement = appShellRef.current
    if (shellElement === null) {
      return {
        x: Math.max(0, Math.round(pos.x)),
        y: Math.max(0, Math.round(pos.y)),
      }
    }
    const maxX = Math.max(
      0,
      shellElement.clientWidth - browserFloatingSizeRef.current.width - floatingEdgePadding,
    )
    const maxY = Math.max(
      0,
      shellElement.clientHeight - browserFloatingSizeRef.current.height - floatingEdgePadding,
    )
    return {
      x: Math.min(maxX, Math.max(0, Math.round(pos.x))),
      y: Math.min(maxY, Math.max(0, Math.round(pos.y))),
    }
  }, [])

  const openBrowserFloatingFromDock = useCallback(() => {
    const shellRect = appShellRef.current?.getBoundingClientRect()
    const dockedRect = dockedBrowserHostRef.current?.getBoundingClientRect()
    if (shellRect !== undefined && dockedRect !== undefined) {
      const nextSize = clampBrowserFloatingSize({
        width: dockedRect.width,
        height: dockedRect.height,
      })
      browserFloatingSizeRef.current = nextSize
      setBrowserFloatingSize(nextSize)
      const nextPos = clampBrowserFloatingPos({
        x: dockedRect.left - shellRect.left,
        y: dockedRect.top - shellRect.top,
      })
      browserFloatingPosRef.current = nextPos
      setBrowserFloatingPos(nextPos)
    }
    setIsBrowserFloating(true)
  }, [clampBrowserFloatingPos, clampBrowserFloatingSize])

  const getLeftDockTargetRect = useCallback((panelId: LeftDockPanelId): DockTargetRect | null => {
    const targetElement =
      panelId === 'browser' ? dockedBrowserHostRef.current : dockedMeatballHostRef.current
    if (targetElement === null) {
      return null
    }
    const targetRect = targetElement.getBoundingClientRect()
    const parentRect = targetElement.parentElement?.getBoundingClientRect()
    const left = targetRect.width > 1 ? targetRect.left : (parentRect?.left ?? targetRect.left)
    const right = targetRect.width > 1 ? targetRect.right : (parentRect?.right ?? targetRect.right)
    const top = targetRect.top
    const height = Math.max(targetRect.height, dockGhostHeight)
    return {
      left,
      right,
      top,
      bottom: top + height,
    }
  }, [])

  const resolveLeftDockPreviewPanelId = useCallback(
    (panelId: LeftDockPanelId, clientX: number, clientY: number): LeftDockPanelId | null =>
      isPointInsideRect(clientX, clientY, getLeftDockTargetRect(panelId)) ? panelId : null,
    [getLeftDockTargetRect],
  )

  const shouldPreviewBottomSplitDock = useCallback(
    (candidateY: number, titleBarHeight: number) => {
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return false
      }
      const bottomEdge = candidateY + titleBarHeight
      return bottomEdge >= viewportElement.clientHeight - 20
    },
    [],
  )

  useEffect(() => {
    floatingPosRef.current = activeEditorViewport?.position ?? initialFloatingPosition
  }, [activeEditorViewport?.position])

  useEffect(() => {
    floatingSizeRef.current = activeEditorViewport?.size ?? initialFloatingSize
  }, [activeEditorViewport?.size])

  useEffect(() => {
    browserFloatingPosRef.current = browserFloatingPos
  }, [browserFloatingPos])

  useEffect(() => {
    browserFloatingSizeRef.current = browserFloatingSize
  }, [browserFloatingSize])

  useEffect(() => {
    isBottomSplitDockPreviewActiveRef.current = isBottomSplitDockPreviewActive
  }, [isBottomSplitDockPreviewActive])

  useEffect(() => {
    if (leftDockResizeMenu === null) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('.LeftDockResizeMenu') !== null) {
        return
      }
      setLeftDockResizeMenu(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLeftDockResizeMenu(null)
      }
    }

    const handleWindowChange = () => {
      setLeftDockResizeMenu(null)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('blur', handleWindowChange)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('blur', handleWindowChange)
    }
  }, [leftDockResizeMenu])

  useEffect(() => {
    if (
      activeLeftDockPreviewPanelId === 'browser' &&
      !isBrowserFloating &&
      browserDragRef.current === null
    ) {
      setActiveLeftDockPreviewPanelId(null)
    }
  }, [activeLeftDockPreviewPanelId, isBrowserFloating])

  useEffect(() => {
    if (
      activeLeftDockPreviewPanelId === 'meatball-editor' &&
      activeWindowMode === 'meatball editor view' &&
      dragRef.current === null &&
      meatballDockDragIntentRef.current === null
    ) {
      setActiveLeftDockPreviewPanelId(null)
    }
  }, [activeLeftDockPreviewPanelId, activeWindowMode])

  useEffect(() => {
    if (!showFloatingShell && isBottomSplitDockPreviewActive) {
      setIsBottomSplitDockPreviewActive(false)
    }
  }, [isBottomSplitDockPreviewActive, showFloatingShell])

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
    clampFloatingPos,
    normalizeFloatingSize,
    setEditorViewportPosition,
    setEditorViewportSize,
    activeWindowMode,
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
    const handleResize = () => {
      if (!isBrowserFloating) {
        return
      }
      const nextSize = clampBrowserFloatingSize(browserFloatingSizeRef.current)
      if (
        nextSize.width !== browserFloatingSizeRef.current.width ||
        nextSize.height !== browserFloatingSizeRef.current.height
      ) {
        browserFloatingSizeRef.current = nextSize
        setBrowserFloatingSize(nextSize)
      }
      const nextPos = clampBrowserFloatingPos(browserFloatingPosRef.current)
      if (
        nextPos.x !== browserFloatingPosRef.current.x ||
        nextPos.y !== browserFloatingPosRef.current.y
      ) {
        browserFloatingPosRef.current = nextPos
        setBrowserFloatingPos(nextPos)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [clampBrowserFloatingPos, clampBrowserFloatingSize, isBrowserFloating])

  const beginFloatingSpaghettiDrag = useCallback(
    (
      editorViewportId: string,
      pointerOffsetX: number,
      pointerOffsetY: number,
      titleBarHeight: number,
    ) => {
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
        const shouldPreviewBottomDock = shouldPreviewBottomSplitDock(clamped.y, dragState.titleBarHeight)
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
          setHeaderCollapsedByViewportId((current) => ({
            ...current,
            [editorViewportId]: true,
          }))
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
      shouldPreviewBottomSplitDock,
      setActiveLeftDockPreviewPanelId,
      setActiveEditorViewportId,
      setEditorViewportPosition,
      setEditorViewportWindowMode,
      setHeaderCollapsedByViewportId,
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
    [
      activeEditorViewport,
      beginFloatingSpaghettiDrag,
      canDragFloatingWindow,
    ],
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

  const handleBrowserDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !isBrowserFloating) {
        return
      }
      setActiveLeftDockPreviewPanelId(null)
      const shellRect = appShellRef.current?.getBoundingClientRect()
      if (shellRect === undefined) {
        return
      }
      browserDragRef.current = {
        pointerOffsetX: event.clientX - shellRect.left - browserFloatingPosRef.current.x,
        pointerOffsetY: event.clientY - shellRect.top - browserFloatingPosRef.current.y,
      }
      event.preventDefault()
    },
    [isBrowserFloating],
  )

  const handleBrowserDockDragStart = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isBrowserFloating) {
      return
    }
    setActiveLeftDockPreviewPanelId(null)
    const shellRect = appShellRef.current?.getBoundingClientRect()
    const panelElement = event.currentTarget.parentElement
    const panelRect = panelElement?.getBoundingClientRect()
    if (shellRect === undefined || panelRect === undefined) {
      return
    }
    browserDockDragIntentRef.current = {
      startClientX: event.clientX,
      startClientY: event.clientY,
      pointerOffsetX: event.clientX - panelRect.left,
      pointerOffsetY: event.clientY - panelRect.top,
      width: panelRect.width,
      height: panelRect.height,
    }
    event.preventDefault()
  }, [isBrowserFloating])

  const handleLeftDockResizeStart = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }
    setLeftDockResizeMenu(null)
    leftDockResizeRef.current = {
      startPointerX: event.clientX,
      startWidth: leftDockWidth,
    }
    event.preventDefault()
    event.stopPropagation()
  }, [leftDockWidth])

  const handleLeftDockResizeContextMenu = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setLeftDockResizeMenu({
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  const handleResetLeftDockWidth = useCallback(() => {
    setLeftDockWidth(defaultLeftDockWidth)
    setLeftDockResizeMenu(null)
  }, [])

  const handleToggleLeftDockViewportSplit = useCallback(() => {
    setIsLeftDockViewportSplit((current) => !current)
    setLeftDockResizeMenu(null)
  }, [])

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

  const handleLeftDockSplitTogglePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
    },
    [],
  )

  const handleLeftDockSplitToggleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      handleToggleLeftDockViewportSplit()
    },
    [handleToggleLeftDockViewportSplit],
  )

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
      normalizeFloatingSize,
      setEditorViewportPosition,
      setEditorViewportSize,
      setEditorViewportWindowMode,
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
        const nextRatio = (moveEvent.clientY - state.viewportTop) / Math.max(1, state.viewportHeight)
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
    [activeEditorViewport, activeWindowMode, setEditorViewportSplitRatio],
  )

  const handleCollapseToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'collapsed')
  }, [activeEditorViewport, setEditorViewportWindowMode])

  const handleHeaderToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setHeaderToggleRevisionByViewportId((current) => ({
      ...current,
      [activeEditorViewport.editorViewportId]:
        (current[activeEditorViewport.editorViewportId] ?? 0) + 1,
    }))
    setHeaderCollapsedByViewportId((current) => ({
      ...current,
      [activeEditorViewport.editorViewportId]:
        !(current[activeEditorViewport.editorViewportId] ?? false),
    }))
  }, [activeEditorViewport])

  const handleSetHeaderCollapsed = useCallback(
    (collapsed: boolean) => {
      if (activeEditorViewport === null) {
        return
      }
      setHeaderCollapsedByViewportId((current) => ({
        ...current,
        [activeEditorViewport.editorViewportId]: collapsed,
      }))
    },
    [activeEditorViewport],
  )

  const handleCanvasToolbarToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setCanvasToolbarVisibleByViewportId((current) => ({
      ...current,
      [activeEditorViewport.editorViewportId]:
        !(current[activeEditorViewport.editorViewportId] ?? true),
    }))
  }, [activeEditorViewport])

  const handleMeatballMode = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setActiveLeftDockPreviewPanelId(null)
    if (activeEditorViewport.windowMode !== 'meatball editor view') {
      setHeaderCollapsedByViewportId((current) => ({
        ...current,
        [activeEditorViewport.editorViewportId]: true,
      }))
    }
    setEditorViewportWindowMode(
      activeEditorViewport.editorViewportId,
      activeEditorViewport.windowMode === 'meatball editor view' ? 'expanded' : 'meatball editor view',
    )
  }, [activeEditorViewport, setEditorViewportWindowMode])

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
    ],
  )

  const handleSplitPriorityToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setSplitEditorPriorityByViewportId((current) => ({
      ...current,
      [activeEditorViewport.editorViewportId]:
        !(current[activeEditorViewport.editorViewportId] ?? false),
    }))
  }, [activeEditorViewport])

  const handleCloseEditor = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    closeEditorViewport(activeEditorViewport.editorViewportId)
  }, [activeEditorViewport, closeEditorViewport])

  const handleToggleBrowserFloating = useCallback(() => {
    setActiveLeftDockPreviewPanelId(null)
    if (isBrowserFloating) {
      setIsBrowserFloating(false)
      return
    }
    openBrowserFloatingFromDock()
  }, [isBrowserFloating, openBrowserFloatingFromDock])

  const splitLayoutStyle = useMemo(
    () => ({
      gridTemplateRows: `${splitRatio}fr ${splitDividerHeight}px ${1 - splitRatio}fr`,
      ['--left-dock-split-width' as const]: `${leftDockWidth}px`,
    }),
    [leftDockWidth, splitRatio],
  )

  const newEditorSpawnPosition = useMemo(
    () => ({
      x: leftDockWidth + floatingDockLockGap,
      y: 16,
    }),
    [leftDockWidth],
  )

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (browserDockDragIntentRef.current !== null && !isBrowserFloating) {
        const shellRect = appShellRef.current?.getBoundingClientRect()
        if (shellRect !== undefined) {
          const intent = browserDockDragIntentRef.current
          const deltaX = event.clientX - intent.startClientX
          const deltaY = event.clientY - intent.startClientY
          if (Math.hypot(deltaX, deltaY) >= 8) {
            const nextSize = clampBrowserFloatingSize({
              width: intent.width,
              height: intent.height,
            })
            const nextPos = clampBrowserFloatingPos({
              x: event.clientX - shellRect.left - intent.pointerOffsetX,
              y: event.clientY - shellRect.top - intent.pointerOffsetY,
            })
            browserFloatingSizeRef.current = nextSize
            browserFloatingPosRef.current = nextPos
            setBrowserFloatingSize(nextSize)
            setBrowserFloatingPos(nextPos)
            setIsBrowserFloating(true)
            browserDragRef.current = {
              pointerOffsetX: intent.pointerOffsetX,
              pointerOffsetY: intent.pointerOffsetY,
            }
            browserDockDragIntentRef.current = null
          }
        }
      }

      if (browserDragRef.current !== null) {
        const shellRect = appShellRef.current?.getBoundingClientRect()
        if (shellRect === undefined) {
          return
        }
        const nextPos = clampBrowserFloatingPos({
          x: event.clientX - shellRect.left - browserDragRef.current.pointerOffsetX,
          y: event.clientY - shellRect.top - browserDragRef.current.pointerOffsetY,
        })
        browserFloatingPosRef.current = nextPos
        setBrowserFloatingPos(nextPos)
        setActiveLeftDockPreviewPanelId(
          resolveLeftDockPreviewPanelId('browser', event.clientX, event.clientY),
        )
      }

      if (leftDockResizeRef.current !== null) {
        const nextWidth = clampLeftDockWidth(
          leftDockResizeRef.current.startWidth + (event.clientX - leftDockResizeRef.current.startPointerX),
        )
        setLeftDockWidth(nextWidth)
        const dockLockedPos = resolveDockLockedFloatingPos(nextWidth)
        if (dockLockedPos !== null && activeEditorViewport !== null) {
          floatingDockLockRef.current = {
            editorViewportId: activeEditorViewport.editorViewportId,
          }
          floatingPosRef.current = dockLockedPos
          setEditorViewportPosition(activeEditorViewport.editorViewportId, dockLockedPos)
        }
      }

    }

    const handlePointerUp = (event: PointerEvent) => {
      const shouldDockBrowser =
        browserDragRef.current !== null &&
        resolveLeftDockPreviewPanelId('browser', event.clientX, event.clientY) === 'browser'
      browserDragRef.current = null
      leftDockResizeRef.current = null
      browserDockDragIntentRef.current = null
      meatballDockDragIntentRef.current = null
      floatingDockLockRef.current = null
      setActiveLeftDockPreviewPanelId(null)
      if (shouldDockBrowser) {
        setIsBrowserFloating(false)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [
    activeEditorViewport,
    clampBrowserFloatingPos,
    clampBrowserFloatingSize,
    clampLeftDockWidth,
    isBrowserFloating,
    resolveDockLockedFloatingPos,
    resolveLeftDockPreviewPanelId,
    setEditorViewportPosition,
  ])

  const leftDockResizeMenuStyle =
    leftDockResizeMenu === null
      ? undefined
      : {
          left: `${Math.max(
            12,
            Math.min(
              leftDockResizeMenu.x,
              (typeof window === 'undefined' ? leftDockResizeMenu.x : window.innerWidth) - 220,
            ),
          )}px`,
          top: `${Math.max(
            12,
            Math.min(
              leftDockResizeMenu.y,
              (typeof window === 'undefined' ? leftDockResizeMenu.y : window.innerHeight) - 120,
            ),
          )}px`,
        }

  return (
    <div ref={appShellRef} className="AppShellRoot">
      <aside
        className="LeftDock"
        style={{
          width: `${leftDockWidth}px`,
          minWidth: `${leftDockWidth}px`,
          maxWidth: `${leftDockWidth}px`,
          bottom:
            showSplitLayout && (!isLeftDockViewportSplit || isSplitEditorPriority)
              ? `calc(${((1 - splitRatio) * 100).toFixed(4)}% + ${splitDividerHeight}px)`
              : '0px',
        }}
      >
        <div className="LeftDockContent">
          <TitleStatusBar />
          {statsExpanded ? <BuildStatsDrawer /> : null}
          <div
            className={`LeftDockPanelStackShell ${
              isLeftDockViewportSplit || showSplitLayout ? 'isConstrained' : ''
            }`}
          >
            <div className={`PanelStack ${isLeftDockViewportSplit || showSplitLayout ? 'isConstrained' : ''}`}>
              <div
                ref={dockedBrowserHostRef}
                className={`LeftDockPanelTarget LeftDockPanelTarget--browser ${
                  isBrowserDockPreviewActive ? 'isPreviewActive' : ''
                }`}
              >
                {!isBrowserFloating ? (
                  <BrowserPanel
                    isCollapsed={isBrowserCollapsed}
                    onToggleCollapsed={() => setIsBrowserCollapsed((current) => !current)}
                    onTogglePopout={handleToggleBrowserFloating}
                    onTitleBarPointerDown={handleBrowserDockDragStart}
                    newEditorSpawnPosition={newEditorSpawnPosition}
                  />
                ) : null}
                <div className="LeftDockPanelGhostSlot" aria-hidden={!isBrowserDockPreviewActive}>
                  <div className="LeftDockPanelGhost">Browser Dock Target</div>
                </div>
              </div>
              <Toolbar />
              <PartsListPanel />
              <div
                ref={dockedMeatballHostRef}
                className={`LeftDockPanelTarget LeftDockPanelTarget--meatball-editor ${
                  isMeatballDockPreviewActive ? 'isPreviewActive' : ''
                }`}
              >
                {showMeatballDock && activeEditorViewport !== null ? (
                  <div
                    className="SpaghettiMeatballHost SpaghettiWindowShell"
                    style={getWindowAppearanceStyle(activeWindowAppearance)}
                  >
                    <SpaghettiWindowTitleBar
                      editorViewportId={activeEditorViewport.editorViewportId}
                      onCollapseToggle={handleCollapseToggle}
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
                      isMaximized={false}
                      isSplit={false}
                    />
                    <SpaghettiPanel
                      editorViewportId={activeEditorViewport.editorViewportId}
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
                <div className="LeftDockPanelGhostSlot" aria-hidden={!isMeatballDockPreviewActive}>
                  <div className="LeftDockPanelGhost">Meatball Dock Target</div>
                </div>
              </div>
              {inputMode === 'legacy' ? <BoxPanel /> : null}
            </div>
            <div
              className={`LeftDockResizeHandle ${
                isLeftDockViewportSplit && showSplitLayout ? 'isViewportSplit' : ''
              }`}
              onPointerDown={handleLeftDockResizeStart}
              onContextMenu={handleLeftDockResizeContextMenu}
              aria-hidden="true"
            >
              <button
                type="button"
                className={`LeftDockResizeToggle ${isLeftDockViewportSplit ? 'isActive' : ''}`}
                onPointerDown={handleLeftDockSplitTogglePointerDown}
                onClick={handleLeftDockSplitToggleClick}
                aria-label="Toggle left dock viewport split"
                title={isLeftDockViewportSplit ? 'Unsplit viewport' : 'Split viewport'}
              >
                []
              </button>
            </div>
          </div>
        </div>
      </aside>
      <section
        ref={viewportRef}
        className={`ViewportArea ${isLeftDockViewportSplit && !showSplitLayout ? 'isLeftDockSplit' : ''}`}
        style={{
          marginLeft:
            isLeftDockViewportSplit && !showSplitLayout ? `${leftDockWidth}px` : undefined,
        }}
      >
        {showSplitLayout && activeEditorViewport !== null ? (
          <div
            className={`ViewportSplitLayout ${isLeftDockViewportSplit ? 'isLeftDockSplit' : ''} ${
              isSplitEditorPriority ? 'isEditorPriority' : ''
            }`}
            style={splitLayoutStyle}
          >
            <div className="ViewportSplitPane ViewportSplitPane--viewer">
              <ViewerHost />
              <ViewportOverlay />
            </div>
            <div className="ViewportSplitDividerShell">
              <button
                type="button"
                className="ViewportSplitDivider"
                onPointerDown={handleSplitResizeStart}
                aria-label="Resize split view"
                title="Drag to resize viewport and editor"
              />
              {isLeftDockViewportSplit ? (
                <button
                  type="button"
                  className={`ViewportSplitPriorityToggle ViewportSplitPriorityToggle--divider ${
                    isSplitEditorPriority ? 'isEditorPriority' : ''
                  }`}
                  onClick={handleSplitPriorityToggle}
                  aria-label={
                    isSplitEditorPriority
                      ? 'Return left toolbar priority in split view'
                      : 'Give spaghetti editor bottom priority in split view'
                  }
                  title={
                    isSplitEditorPriority
                      ? 'Return left toolbar priority in split view'
                      : 'Give spaghetti editor bottom priority in split view'
                  }
                >
                  {isSplitEditorPriority ? '>' : '<'}
                </button>
              ) : null}
            </div>
            <div className="ViewportSplitPane ViewportSplitPane--editor">
              <div
                className="SpaghettiSplitWindow SpaghettiWindowShell"
                style={getWindowAppearanceStyle(activeWindowAppearance)}
              >
                <SpaghettiWindowTitleBar
                  editorViewportId={activeEditorViewport.editorViewportId}
                  onCollapseToggle={handleCollapseToggle}
                  onActionTrayToggle={handleActionTrayToggle}
                  onWindowSettingsToggle={handleWindowSettingsToggle}
                  onHeaderToggle={handleHeaderToggle}
                  onCanvasToolbarToggle={handleCanvasToolbarToggle}
                  onMeatball={handleMeatballMode}
                  onMaximizeToggle={handleMaximizeToggle}
                  onSplitToggle={handleSplitToggle}
                  onDragStart={handleSplitTitleBarDragStart}
                  onShellClick={handleSplitTitleBarClick}
                  onClose={handleCloseEditor}
                  isCollapsed={false}
                    isActionTrayExpanded={isActionTrayExpanded}
                  isWindowSettingsOpen={isWindowSettingsOpen}
                  isHeaderCollapsed={isHeaderCollapsed}
                  isCanvasToolbarVisible={isCanvasToolbarVisible}
                  isMeatball={false}
                  isMaximized={false}
                  isSplit
                />
                <div className="SpaghettiFloatingBody">
                  <SpaghettiPanel
                    editorViewportId={activeEditorViewport.editorViewportId}
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
            <ViewerHost />
            {showFloatingShell && isBottomSplitDockPreviewActive ? (
              <div
                className={`ViewportBottomSplitDockGhost ${
                  isLeftDockViewportSplit && !isSplitEditorPriority ? 'isLeftDockShifted' : ''
                }`}
                style={{
                  top: `calc(${(splitRatio * 100).toFixed(4)}% + ${splitDividerHeight}px)`,
                  '--left-dock-split-width': `${leftDockWidth}px`,
                } as CSSProperties}
                aria-hidden="true"
              />
            ) : null}
            <ViewportOverlay />
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
              }`}
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
                onCollapseToggle={handleCollapseToggle}
                onActionTrayToggle={handleActionTrayToggle}
                onWindowSettingsToggle={handleWindowSettingsToggle}
                onHeaderToggle={handleHeaderToggle}
                onCanvasToolbarToggle={handleCanvasToolbarToggle}
                onMeatball={handleMeatballMode}
                onMaximizeToggle={handleMaximizeToggle}
                onSplitToggle={handleSplitToggle}
                onClose={handleCloseEditor}
                onDragStart={handleSpaghettiDragStart}
                isCollapsed={activeWindowMode === 'collapsed'}
                isActionTrayExpanded={isActionTrayExpanded}
                isWindowSettingsOpen={isWindowSettingsOpen}
                isHeaderCollapsed={isHeaderCollapsed}
                isCanvasToolbarVisible={isCanvasToolbarVisible}
                isMeatball={false}
                isMaximized={activeWindowMode === 'maximized'}
                isSplit={false}
              />
              {activeWindowMode !== 'collapsed' ? (
                <div className="SpaghettiFloatingBody">
                  <SpaghettiPanel
                    editorViewportId={activeEditorViewport.editorViewportId}
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
      </section>
      {isBrowserFloating ? (
        <aside className="BrowserFloatingDock">
          <div
            className={`BrowserFloatingWindow ${isBrowserCollapsed ? 'isCollapsed' : ''}`}
            style={{
              left: `${browserFloatingPos.x}px`,
              top: `${browserFloatingPos.y}px`,
              width: `${browserFloatingSize.width}px`,
            }}
          >
            <BrowserPanel
              isCollapsed={isBrowserCollapsed}
              onToggleCollapsed={() => setIsBrowserCollapsed((current) => !current)}
              isFloating
              onTogglePopout={handleToggleBrowserFloating}
              onTitleBarPointerDown={handleBrowserDragStart}
              newEditorSpawnPosition={newEditorSpawnPosition}
            />
          </div>
        </aside>
      ) : null}
      {leftDockResizeMenu !== null ? (
        <div className="LeftDockResizeMenu" style={leftDockResizeMenuStyle}>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={handleResetLeftDockWidth}
          >
            Default Width
          </button>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={handleToggleLeftDockViewportSplit}
          >
            {isLeftDockViewportSplit ? 'Unsplit Viewport' : 'Split Viewport'}
          </button>
        </div>
      ) : null}
      <ViewToolbar />
    </div>
  )
}
