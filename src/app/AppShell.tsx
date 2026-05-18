import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { ConsoleDock } from './console/ConsoleDock'
import { FloatingWindowQuickDockButton } from './components/FloatingWindowQuickDockButton'
import {
  readPersistedDashboardState,
  writePersistedDashboardState,
} from './dashboard/dashboardPersistence'
import { serializeDashboardState, useDashboardStore } from './dashboard/useDashboardStore'
import { useConsoleStore } from './console/useConsoleStore'
import { BrowserDockHost } from './hosts/BrowserDockHost'
import { DashboardWindowHost } from './hosts/DashboardWindowHost'
import { NotepadWindowHost } from './hosts/NotepadWindowHost'
import { RadioRuntimeHost } from './hosts/RadioRuntimeHost'
import { SimpleFloatingSurfaceHost } from './hosts/SimpleFloatingSurfaceHost'
import { SpaghettiWindowHost } from './hosts/SpaghettiWindowHost'
import {
  readPersistedNotepadState,
  writePersistedNotepadState,
} from './notepad/notepadPersistence'
import { serializeNotepadState, useNotepadStore } from './notepad/useNotepadStore'
import { useAppShellConsoleTransition } from './hosts/useAppShellConsoleTransition'
import { useAppShellDockController } from './hosts/useAppShellDockController'
import {
  useAppShellWorkspaceMenus,
  type ViewportSpawnMenuState,
} from './hosts/useAppShellWorkspaceMenus'
import { useAppShellSurfaceActivation } from './hosts/useAppShellSurfaceActivation'
import { useAppShellViewportActions } from './hosts/useAppShellViewportActions'
import { useAppShellWorkspaceSelectors } from './hosts/useAppShellWorkspaceSelectors'
import { RadioPanel } from './panels/RadioPanel'
import type { SettingsSectionId } from './workspace/SettingsSurface'
import {
  selectActiveEditorViewport,
  useSpaghettiStore,
} from './spaghetti/store/useSpaghettiStore'
import {
  RADIO_SUPPORT_PROFILE,
  useAudioSamplerStore,
} from './store/audioSamplerStore'
import { useAppStore } from './store/useAppStore'
import { useUiPrefsStore } from './store/uiPrefsStore'
import { CatalogSurface } from './workspace/CatalogSurface'
import { useWorkspaceChildWindow } from './workspace/useWorkspaceChildWindow'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import { cycleBrowserPresentationModeWithHistory } from './store/workspaceLayoutEditHistory'
import {
  WorkspaceViewportTree,
  type WorkspaceViewportSplitCorner,
} from './workspace/WorkspaceViewportTree'
import { ViewportOverlayModeTitlebarControls } from './workspace/ViewportOverlayModeTitlebarControls'
import { ViewportWorkspaceHost } from './workspace/ViewportWorkspaceHost'
import {
  floatWorkspaceSurface,
  popoutWorkspaceSurface,
  restoreDetachedSurfaceByKind,
} from './workspace/workspaceSurfaceActions'
import {
  createDefaultModelViewportPopoutState,
  defaultBrowserHostRouteId,
  defaultPrimaryViewportSlotId,
  defaultPrimaryWorkspaceViewportId,
  type WorkspaceLayoutNode,
  type WorkspaceDetachedSlotSurfaceState,
  type WorkspaceSurfaceKind,
  type WorkspaceViewportSlot,
} from './workspace/workspaceShellTypes'
import { useWorkspacePersistenceBridge } from './workspace/useWorkspacePersistenceBridge'
import { useUiPrefsPersistenceBridge } from './store/useUiPrefsPersistenceBridge'
import { useGraphBrowserStoragePersistenceBridge } from './spaghetti/store/useGraphBrowserStoragePersistenceBridge'
import { useWorkspaceDetachedRestoreCompatibilityBridge } from './workspace/useWorkspaceDetachedRestoreCompatibilityBridge'
import type { WorkspaceSplitDockSide } from './workspace/workspaceSplitTypes'
const floatingDockLockGap = 25
const modelViewportPopoutBackground = 'rgb(7, 11, 18)'
const detachedViewerFloatingMinWidth = 320
const detachedViewerFloatingMinHeight = 240
const detachedViewerFloatingEdgePadding = 12
const workspaceSplitCornerGestureDeadzonePx = 10
const workspaceSplitCornerGestureAxisSwitchHysteresisPx = 24
const workspaceSplitCornerCommitThresholdRatio = 0.12
const workspaceLayoutSplitRatioMin = 0.15
const workspaceLayoutSplitRatioMax = 0.85

type WorkspaceSplitPaneArea = 'viewer' | 'editor'

type ViewportSplitCornerPreview = {
  anchorEdge: 'left' | 'right' | 'top' | 'bottom'
  orientation: 'vertical' | 'horizontal'
  paneArea: WorkspaceSplitPaneArea
  rawRatio: number
  ratio: number
  targetNodeId: string
}

type ViewportPaneRect = {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}

type ViewportSplitCornerGestureSession = {
  deadzoneCrossed: boolean
  latestClientX: number
  latestClientY: number
  nodeId: string
  paneArea: WorkspaceSplitPaneArea
  corner: WorkspaceViewportSplitCorner
  paneRect: ViewportPaneRect
  pointerId: number
  originClientX: number
  originClientY: number
  previewOrientation: 'vertical' | 'horizontal' | null
}

type DetachedViewerFloatingRect = {
  x: number
  y: number
  width: number
  height: number
}

type WorkspaceSplitEdge = 'start' | 'end'

const clampWorkspaceLayoutSplitRatio = (ratio: number): number =>
  Math.min(workspaceLayoutSplitRatioMax, Math.max(workspaceLayoutSplitRatioMin, ratio))

const resolveWorkspaceSplitPrimaryEdge = (
  node: Extract<WorkspaceLayoutNode, { kind: 'split' }>,
): WorkspaceSplitEdge =>
  node.splitDirection === 'vertical'
    ? node.splitDockSide === 'left'
      ? 'start'
      : 'end'
    : node.splitDockSide === 'top'
      ? 'start'
      : 'end'

const resolveWorkspaceSplitEdgeFraction = (
  node: Extract<WorkspaceLayoutNode, { kind: 'split' }>,
  edge: WorkspaceSplitEdge,
): number => {
  const primaryEdge = resolveWorkspaceSplitPrimaryEdge(node)
  return edge === primaryEdge ? node.ratio : 1 - node.ratio
}

const resolveWorkspaceSplitRatioForEdgeFraction = (
  node: Extract<WorkspaceLayoutNode, { kind: 'split' }>,
  edge: WorkspaceSplitEdge,
  edgeFraction: number,
): number => {
  const primaryEdge = resolveWorkspaceSplitPrimaryEdge(node)
  return primaryEdge === edge ? edgeFraction : 1 - edgeFraction
}

const isPristineDashboardState = (state: {
  lanes: Array<{ id: string; title: string; order: number; width: number }>
  stickyNoteLayoutsByNoteId: Record<string, unknown>
}): boolean =>
  state.stickyNoteLayoutsByNoteId && Object.keys(state.stickyNoteLayoutsByNoteId).length === 0 &&
  state.lanes.length === 2 &&
  state.lanes[0]?.id === 'todo' &&
  state.lanes[0]?.title === 'TO DO' &&
  state.lanes[0]?.order === 0 &&
  state.lanes[0]?.width === 1 &&
  state.lanes[1]?.id === 'completed' &&
  state.lanes[1]?.title === 'Completed' &&
  state.lanes[1]?.order === 1 &&
  state.lanes[1]?.width === 1

const isPristineNotepadState = (state: {
  notesById: Record<string, unknown>
  noteOrder: string[]
  activeNoteId: string | null
}): boolean =>
  Object.keys(state.notesById).length === 0 &&
  state.noteOrder.length === 0 &&
  state.activeNoteId === null

type DetachedViewerPopoutWindowProps = {
  surface: WorkspaceDetachedSlotSurfaceState
  onActivateViewerSurface: (viewportId: string) => void
  onClearDetachedSurface: (surfaceInstanceId: string) => void
  onQuickDock: (surfaceInstanceId: string) => void
}

function DetachedViewerPopoutWindow(props: DetachedViewerPopoutWindowProps) {
  const {
    surface,
    onActivateViewerSurface,
    onClearDetachedSurface,
    onQuickDock,
  } = props
  const popoutState = useMemo(
    () => createDefaultModelViewportPopoutState(surface.surfaceInstanceId),
    [surface.surfaceInstanceId],
  )
  const { childWindow, host } = useWorkspaceChildWindow({
    isOpen: true,
    spec: popoutState,
    rootClassName: 'DetachedViewerPopoutRoot',
    bodyBackground: modelViewportPopoutBackground,
    onClosed: () => {
      onClearDetachedSurface(surface.surfaceInstanceId)
    },
  })

  useEffect(() => {
    if (childWindow === null) {
      return
    }
    const handleFocus = () => {
      onActivateViewerSurface(surface.surfaceInstanceId)
    }
    childWindow.addEventListener('focus', handleFocus)
    return () => {
      childWindow.removeEventListener('focus', handleFocus)
    }
  }, [childWindow, onActivateViewerSurface, surface.surfaceInstanceId])

  if (host === null) {
    return null
  }

  return createPortal(
    <div
      className="DetachedViewerPopoutWindow"
      data-workspace-surface-instance-id={surface.surfaceInstanceId}
      data-workspace-host-viewport-id={surface.hostViewportId ?? ''}
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '48px minmax(0, 1fr)',
        background: modelViewportPopoutBackground,
        color: 'rgba(255,255,255,0.92)',
      }}
    >
      <div
        className="DetachedViewerPopoutWindowHeader"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '0 12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        <span>Model Viewport</span>
        <button
          type="button"
          className="DetachedViewerPopoutWindowQuickDock"
          onClick={() => {
            onQuickDock(surface.surfaceInstanceId)
          }}
        >
          Quick Dock
        </button>
      </div>
      <div style={{ position: 'relative', minHeight: 0 }}>
        <ViewportWorkspaceHost
          viewportId={surface.surfaceInstanceId}
          onActivateViewerSurface={onActivateViewerSurface}
        />
      </div>
    </div>,
    host,
  )
}

function findParentSplitNodeIdForLayoutNode(
  childNodeId: string,
  viewportLayoutNodesById: Record<string, { kind: string; firstChildId?: string; secondChildId?: string }>,
): string | null {
  for (const [nodeId, node] of Object.entries(viewportLayoutNodesById)) {
    if (node.kind !== 'split') {
      continue
    }
    if (node.firstChildId === childNodeId || node.secondChildId === childNodeId) {
      return nodeId
    }
  }
  return null
}

function clampDetachedViewerFloatingRect(
  nextRect: DetachedViewerFloatingRect,
  viewportWidth: number,
  viewportHeight: number,
): DetachedViewerFloatingRect {
  const width = Math.max(
    detachedViewerFloatingMinWidth,
    Math.min(Math.round(nextRect.width), Math.max(detachedViewerFloatingMinWidth, viewportWidth - detachedViewerFloatingEdgePadding * 2)),
  )
  const height = Math.max(
    detachedViewerFloatingMinHeight,
    Math.min(Math.round(nextRect.height), Math.max(detachedViewerFloatingMinHeight, viewportHeight - detachedViewerFloatingEdgePadding * 2)),
  )
  const maxX = Math.max(detachedViewerFloatingEdgePadding, viewportWidth - width - detachedViewerFloatingEdgePadding)
  const maxY = Math.max(detachedViewerFloatingEdgePadding, viewportHeight - height - detachedViewerFloatingEdgePadding)
  return {
    x: Math.max(detachedViewerFloatingEdgePadding, Math.min(Math.round(nextRect.x), maxX)),
    y: Math.max(detachedViewerFloatingEdgePadding, Math.min(Math.round(nextRect.y), maxY)),
    width,
    height,
  }
}

function resolveViewportSplitCornerAnchorEdge(
  corner: WorkspaceViewportSplitCorner,
  orientation: 'vertical' | 'horizontal',
): 'left' | 'right' | 'top' | 'bottom' {
  if (orientation === 'vertical') {
    return corner === 'topRight' || corner === 'bottomRight' ? 'right' : 'left'
  }
  return corner === 'bottomLeft' || corner === 'bottomRight' ? 'bottom' : 'top'
}

function clampViewportSplitCornerPreviewRatio(value: number): number {
  return Math.min(0.85, Math.max(0.12, value))
}

function resolveViewportSplitCornerTargetNodeId(
  nodeId: string,
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>,
  viewportSlotRootNodeId: string,
  viewportSlotsById: Record<string, WorkspaceViewportSlot>,
): string | null {
  const node = viewportLayoutNodesById[nodeId]
  if (node?.kind !== 'leaf') {
    return null
  }
  if (nodeId === viewportSlotRootNodeId) {
    const slot = viewportSlotsById[node.slotId] ?? null
    if (slot?.slotId !== defaultPrimaryViewportSlotId || slot.surfaceKind !== 'modelViewer') {
      return null
    }
  }
  return nodeId
}

export function AppShell() {
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const editorViewportsById = useSpaghettiStore((state) => state.editorViewportsById)
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession ?? null)
  const setEditorViewportWindowMode = useSpaghettiStore((state) => state.setEditorViewportWindowMode)
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
  const setEditorViewportSplitDirection = useSpaghettiStore(
    (state) => state.setEditorViewportSplitDirection,
  )
  const setEditorViewportSplitPriority = useSpaghettiStore(
    (state) => state.setEditorViewportSplitPriority,
  )
  const setEditorViewportSplitRatio = useSpaghettiStore((state) => state.setEditorViewportSplitRatio)
  const activeGraphDocumentId = useSpaghettiStore((state) => state.activeGraphDocumentId)
  const graphDocumentOrder = useSpaghettiStore((state) => state.graphDocumentOrder)
  const openGraphDocumentInNewViewport = useSpaghettiStore(
    (state) => state.openGraphDocumentInNewViewport,
  )
  const setEditorViewportPosition = useSpaghettiStore((state) => state.setEditorViewportPosition)
  const isRadioToolbarOpen = useAudioSamplerStore((state) => state.isRadioToolbarOpen)
  const floatingShellActivationRequest = useAppStore((state) => state.floatingShellActivationRequest)
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const setActiveSurface = useAppStore((state) => state.setActiveSurface)
  const setWorkspaceSelectedTarget = useAppStore((state) => state.setWorkspaceSelectedTarget)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const requestConsoleWorkspaceContextHandoff = useAppStore(
    (state) => state.requestConsoleWorkspaceContextHandoff,
  )
  const appShellRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLElement | null>(null)
  const viewportSplitCornerGestureButtonRef = useRef<HTMLButtonElement | null>(null)
  const browserViewportSplitHostRef = useRef<HTMLDivElement | null>(null)
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const dockedMeatballHostRef = useRef<HTMLDivElement | null>(null)
  const detachedViewerFloatingRectsRef = useRef<Record<string, DetachedViewerFloatingRect>>({})
  const detachedViewerFloatingWindowRefBySurfaceId = useRef<Record<string, HTMLDivElement | null>>({})
  const detachedViewerDragRef = useRef<{
    surfaceInstanceId: string
    pointerId: number
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const leftDockWidthPreviewHandlerRef = useRef<((nextWidth: number) => void) | null>(null)
  const [, setDetachedViewerFloatingLayoutVersion] = useState(0)
  const [viewportSpawnMenu, setViewportSpawnMenu] = useState<ViewportSpawnMenuState | null>(null)
  const leftDockWidth = useWorkspaceStore((state) => state.leftDockWidth)
  const setLeftDockWidth = useWorkspaceStore((state) => state.setLeftDockWidth)
  const leftDockStackHeight = useWorkspaceStore((state) => state.leftDockStackHeight)
  const setLeftDockStackHeight = useWorkspaceStore((state) => state.setLeftDockStackHeight)
  const leftDockStackSplitRatio = useWorkspaceStore((state) => state.leftDockStackSplitRatio)
  const setLeftDockStackSplitRatio = useWorkspaceStore((state) => state.setLeftDockStackSplitRatio)
  const isLeftDockViewportSplit = useWorkspaceStore((state) => state.isLeftDockViewportSplit)
  const setIsLeftDockViewportSplit = useWorkspaceStore((state) => state.setLeftDockViewportSplit)
  const activeLeftDockPreviewPanelId = useWorkspaceStore(
    (state) => state.activeLeftDockPreviewPanelId,
  )
  const setActiveLeftDockPreviewPanelId = useWorkspaceStore(
    (state) => state.setActiveLeftDockPreviewPanelId,
  )
  const leftDockResizeMenu = useWorkspaceStore((state) => state.leftDockResizeMenu)
  const setLeftDockResizeMenu = useWorkspaceStore((state) => state.setLeftDockResizeMenu)
  const workspaceSplitMenu = useWorkspaceStore((state) => state.workspaceSplitMenu)
  const setWorkspaceSplitMenu = useWorkspaceStore((state) => state.setWorkspaceSplitMenu)
  const isBrowserFloating = useWorkspaceStore((state) => state.browserShell.isFloating)
  const isBrowserPoppedOut = useWorkspaceStore((state) => state.browserShell.isPoppedOut)
  const isBrowserViewportSplit = useWorkspaceStore((state) => state.browserShell.isViewportSplit)
  const browserPresentationMode = useWorkspaceStore((state) => state.browserShell.presentationMode)
  const isBrowserCollapsed = useWorkspaceStore((state) => state.browserShell.isCollapsed)
  const browserViewportSplitRatio = useWorkspaceStore(
    (state) => state.browserShell.viewportSplitRatio,
  )
  const browserViewportSplitDockSide = useWorkspaceStore(
    (state) => state.browserShell.viewportSplitDockSide,
  )
  const setIsBrowserPoppedOut = useWorkspaceStore((state) => state.setBrowserPoppedOut)
  const setIsBrowserViewportSplit = useWorkspaceStore((state) => state.setBrowserViewportSplit)
  const setBrowserFloating = useWorkspaceStore((state) => state.setBrowserFloating)
  const setBrowserFloatingPosition = useWorkspaceStore((state) => state.setBrowserFloatingPosition)
  const setBrowserFloatingSize = useWorkspaceStore((state) => state.setBrowserFloatingSize)
  const setConsoleFloatingRect = useConsoleStore((state) => state.setFloatingRect)
  const setBrowserViewportSplitRatio = useWorkspaceStore(
    (state) => state.setBrowserViewportSplitRatio,
  )
  const primaryViewportId = useWorkspaceStore((state) => state.primaryViewportId)
  const viewportSlotRootNodeId = useWorkspaceStore((state) => state.viewportSlotRootNodeId)
  const viewportSlotsById = useWorkspaceStore((state) => state.viewportSlotsById)
  const viewportLayoutNodesById = useWorkspaceStore((state) => state.viewportLayoutNodesById)
  const detachedSlotSurfaceById = useWorkspaceStore((state) => state.detachedSlotSurfaceById)
  const editorSurfaceBindingById = useWorkspaceStore((state) => state.editorSurfaceBindingById)
  const splitViewportSlot = useWorkspaceStore((state) => state.splitViewportSlot)
  const splitViewportLayoutNode = useWorkspaceStore((state) => state.splitViewportLayoutNode)
  const removeViewportSlot = useWorkspaceStore((state) => state.removeViewportSlot)
  const detachViewportSlotSurface = useWorkspaceStore((state) => state.detachViewportSlotSurface)
  const clearDetachedSlotSurface = useWorkspaceStore((state) => state.clearDetachedSlotSurface)
  const redockDetachedSurface = useWorkspaceStore((state) => state.redockDetachedSurface)
  const createDetachedViewportSurfaceCopy = useWorkspaceStore(
    (state) => state.createDetachedViewportSurfaceCopy,
  )
  const setViewportSlotSurfaceKind = useWorkspaceStore((state) => state.setViewportSlotSurfaceKind)
  const setViewportLayoutSplitRatio = useWorkspaceStore((state) => state.setViewportLayoutSplitRatio)
  const setActiveViewerViewportId = useWorkspaceStore((state) => state.setActiveViewerViewportId)
  const setDetachedSurfaceKind = useWorkspaceStore((state) => state.setDetachedSurfaceKind)
  const hydratePersistedNotepadState = useNotepadStore((state) => state.hydratePersistedNotepadState)
  const setActiveNoteId = useNotepadStore((state) => state.setActiveNoteId)
  const hydratePersistedDashboardState = useDashboardStore(
    (state) => state.hydratePersistedDashboardState,
  )
  const dashboardPersistence = useUiPrefsStore((state) => state.dashboardPersistence)
  const notepadPersistence = useUiPrefsStore((state) => state.notepadPersistence)
  const workspaceNestedResizeKeepsFarPane = useUiPrefsStore(
    (state) => state.workspaceNestedResizeKeepsFarPane,
  )
  const activeEditorSurface = useWorkspaceStore((state) =>
    activeEditorViewportId.length > 0 ? state.editorSurfacePlacementById[activeEditorViewportId] ?? null : null,
  )
  const editorSurfacePlacementById = useWorkspaceStore((state) => state.editorSurfacePlacementById)
  const browserToolbarOwnerSurfaceInstanceId = useWorkspaceStore(
    (state) => state.hostRouteOwnershipByRouteId[defaultBrowserHostRouteId]?.surfaceInstanceId ?? null,
  )
  const [browserSlotHeaderDragSeed, setBrowserSlotHeaderDragSeed] = useState<{
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null>(null)
  const [spaghettiSlotHeaderDragSeed, setSpaghettiSlotHeaderDragSeed] = useState<{
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null>(null)
  const [, setActiveFloatingShell] = useState<'spaghetti' | 'browser' | null>(null)
  const hasHydratedNotepadPersistenceRef = useRef(false)
  const hasHydratedDashboardPersistenceRef = useRef(false)
  const dashboardPersistenceWasEnabledRef = useRef(false)
  const notepadPersistenceWasEnabledRef = useRef(false)

  const {
    resolveLeftDockPreviewPanelId,
    handleLeftDockResizeStart,
    handleLeftDockResizeContextMenu,
    handleResetLeftDockWidth,
  } = useAppShellDockController({
    appShellRef,
    dockedBrowserHostRef,
    dockedMeatballHostRef,
    leftDockWidth,
    setLeftDockWidth,
    leftDockStackHeight,
    setLeftDockStackHeight,
    setLeftDockStackSplitRatio,
    leftDockResizeMenu,
    setLeftDockResizeMenu,
    workspaceSplitMenu,
    setWorkspaceSplitMenu,
    onLeftDockWidthPreview: (nextWidth) => {
      leftDockWidthPreviewHandlerRef.current?.(nextWidth)
    },
  })

  const splitRatio = activeEditorSurface?.splitRatio ?? activeEditorViewport?.splitRatio ?? 0.5
  const isBrowserDockPreviewActive = activeLeftDockPreviewPanelId === 'browser'
  const isMeatballDockPreviewActive = activeLeftDockPreviewPanelId === 'meatball-editor'
  const isMeatballDockOccupied = useMemo(
    () =>
      Object.values(editorViewportsById).some(
        (viewport) =>
          viewport.windowMode === 'meatball editor view' ||
          (viewport.windowMode === 'collapsed' &&
            viewport.restoreFromCollapsed?.windowMode === 'meatball editor view'),
      ),
    [editorViewportsById],
  )
  const consoleWindowMode = useConsoleStore((state) => state.windowMode)
  const [suppressRuntimeProjectedDockedBrowserSurface, setSuppressRuntimeProjectedDockedBrowserSurface] =
    useState(false)
  const [windowSettingsOpenByViewportId, setWindowSettingsOpenByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [settingsSurfaceInitialSectionId, setSettingsSurfaceInitialSectionId] =
    useState<SettingsSectionId>('all')
  const [viewportSplitCornerGestureSession, setViewportSplitCornerGestureSession] =
    useState<ViewportSplitCornerGestureSession | null>(null)
  const viewportSplitCornerPreview = useMemo<ViewportSplitCornerPreview | null>(() => {
    if (
      viewportSplitCornerGestureSession === null ||
      viewportSplitCornerGestureSession.deadzoneCrossed === false ||
      viewportSplitCornerGestureSession.previewOrientation === null
    ) {
      return null
    }
    const targetNodeId = resolveViewportSplitCornerTargetNodeId(
      viewportSplitCornerGestureSession.nodeId,
      viewportLayoutNodesById,
      viewportSlotRootNodeId,
      viewportSlotsById,
    )
    if (targetNodeId === null) {
      return null
    }
    const orientation = viewportSplitCornerGestureSession.previewOrientation
    const axisTravel =
      orientation === 'vertical'
        ? Math.abs(
            viewportSplitCornerGestureSession.latestClientX -
              viewportSplitCornerGestureSession.originClientX,
          )
        : Math.abs(
            viewportSplitCornerGestureSession.latestClientY -
              viewportSplitCornerGestureSession.originClientY,
          )
    const axisExtent =
      orientation === 'vertical'
        ? Math.max(1, viewportSplitCornerGestureSession.paneRect.width)
        : Math.max(1, viewportSplitCornerGestureSession.paneRect.height)
    const rawRatio = axisTravel / axisExtent
    return {
      anchorEdge: resolveViewportSplitCornerAnchorEdge(
        viewportSplitCornerGestureSession.corner,
        orientation,
      ),
      orientation,
      paneArea: viewportSplitCornerGestureSession.paneArea,
      rawRatio,
      ratio: clampViewportSplitCornerPreviewRatio(rawRatio),
      targetNodeId,
    }
  }, [
    viewportLayoutNodesById,
    viewportSlotRootNodeId,
    viewportSlotsById,
    viewportSplitCornerGestureSession,
  ])
  const {
    spaghetti: {
      hasVisibleSpaghettiInAppShell,
      hasFocusableSpaghettiSurface,
    },
    splitMenuTarget: {
      workspaceSplitMenuTargetSurfaceInstanceId,
      workspaceSplitMenuTargetEditorViewport,
      workspaceSplitMenuTargetEditorSurface,
      workspaceSplitMenuTargetEditorSlot,
      workspaceSplitMenuTargetSplitPriority,
      workspaceSplitMenuTargetSurfaceKind,
    },
    slotCounts: {
      browserSlotCount,
      consoleSlotCount,
    },
    detachedSurfaces: {
      activeDetachedBrowserSurface,
      activeDetachedConsoleSurface,
      detachedViewerFloatingSurfaces,
      detachedViewerPopoutSurfaces,
      detachedDashboardFloatingSurfaces,
      detachedDashboardPopoutSurfaces,
      detachedCatalogFloatingSurfaces,
      detachedNotepadFloatingSurfaces,
      detachedNotepadPopoutSurfaces,
    },
    dockSuppression: {
      suppressLegacyDockedBrowserSurface,
      suppressLegacyDockedConsoleSurface,
    },
    layout: {
      rootLeftSplitSlotIds,
      primaryViewportSlotIsConstrained,
    },
  } = useAppShellWorkspaceSelectors({
    activeEditorSurface,
    activeEditorViewport,
    activeEditorViewportId,
    browserToolbarOwnerSurfaceInstanceId,
    detachedSlotSurfaceById,
    editorSurfacePlacementById,
    editorViewportsById,
    isLeftDockViewportSplit,
    suppressRuntimeProjectedDockedBrowserSurface,
    viewportLayoutNodesById,
    viewportSlotRootNodeId,
    viewportSlotsById,
    workspaceSplitMenu,
  })
  const browserSlotCountRef = useRef(browserSlotCount)
  const getDefaultDetachedViewerFloatingRect = useCallback(
    (surface: WorkspaceDetachedSlotSurfaceState): DetachedViewerFloatingRect => {
      const viewportAreaRect = viewportRef.current?.getBoundingClientRect() ?? null
      const targetHost =
        appShellRef.current?.querySelector(
          `.ViewportWorkspaceHost[data-workspace-viewport-id="${surface.hostViewportId ?? primaryViewportId}"]`,
        ) ?? null
      const targetRect =
        targetHost instanceof HTMLElement ? targetHost.getBoundingClientRect() : viewportAreaRect
      const nextRect = {
        x:
          viewportAreaRect !== null && targetRect !== null
            ? Math.max(
                detachedViewerFloatingEdgePadding,
                Math.round(targetRect.left - viewportAreaRect.left + 24),
              )
            : 24,
        y:
          viewportAreaRect !== null && targetRect !== null
            ? Math.max(
                detachedViewerFloatingEdgePadding,
                Math.round(targetRect.top - viewportAreaRect.top + 24),
              )
            : 24,
        width:
          targetRect !== null
            ? Math.max(
                detachedViewerFloatingMinWidth,
                Math.min(720, Math.round(targetRect.width * 0.45)),
              )
            : 420,
        height:
          targetRect !== null
            ? Math.max(
                detachedViewerFloatingMinHeight,
                Math.min(520, Math.round(targetRect.height * 0.45)),
              )
            : 320,
      }
      if (viewportAreaRect === null) {
        return nextRect
      }
      return clampDetachedViewerFloatingRect(
        nextRect,
        Math.max(1, Math.round(viewportAreaRect.width)),
        Math.max(1, Math.round(viewportAreaRect.height)),
      )
    },
    [primaryViewportId],
  )
  const setDetachedViewerFloatingRect = useCallback(
    (surfaceInstanceId: string, nextRect: DetachedViewerFloatingRect) => {
      detachedViewerFloatingRectsRef.current[surfaceInstanceId] = nextRect
      setDetachedViewerFloatingLayoutVersion((version) => version + 1)
    },
    [],
  )

  useEffect(() => {
    const nextSurfaceIds = new Set(detachedViewerFloatingSurfaces.map((surface) => surface.surfaceInstanceId))
    let didChange = false
    for (const surface of detachedViewerFloatingSurfaces) {
      if (detachedViewerFloatingRectsRef.current[surface.surfaceInstanceId] !== undefined) {
        continue
      }
      detachedViewerFloatingRectsRef.current[surface.surfaceInstanceId] =
        getDefaultDetachedViewerFloatingRect(surface)
      didChange = true
    }
    for (const surfaceInstanceId of Object.keys(detachedViewerFloatingRectsRef.current)) {
      if (nextSurfaceIds.has(surfaceInstanceId)) {
        continue
      }
      delete detachedViewerFloatingRectsRef.current[surfaceInstanceId]
      delete detachedViewerFloatingWindowRefBySurfaceId.current[surfaceInstanceId]
      didChange = true
    }
    if (didChange) {
      setDetachedViewerFloatingLayoutVersion((version) => version + 1)
    }
  }, [detachedViewerFloatingSurfaces, getDefaultDetachedViewerFloatingRect])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const dragState = detachedViewerDragRef.current
      if (dragState === null || dragState.pointerId !== event.pointerId) {
        return
      }
      const viewportAreaRect = viewportRef.current?.getBoundingClientRect() ?? null
      const currentRect = detachedViewerFloatingRectsRef.current[dragState.surfaceInstanceId]
      if (viewportAreaRect === null || currentRect === undefined) {
        return
      }
      setDetachedViewerFloatingRect(
        dragState.surfaceInstanceId,
        clampDetachedViewerFloatingRect(
          {
            ...currentRect,
            x: event.clientX - viewportAreaRect.left - dragState.pointerOffsetX,
            y: event.clientY - viewportAreaRect.top - dragState.pointerOffsetY,
          },
          Math.max(1, Math.round(viewportAreaRect.width)),
          Math.max(1, Math.round(viewportAreaRect.height)),
        ),
      )
    }
    const handlePointerFinish = (event: PointerEvent) => {
      const dragState = detachedViewerDragRef.current
      if (dragState === null || dragState.pointerId !== event.pointerId) {
        return
      }
      detachedViewerDragRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerFinish)
    window.addEventListener('pointercancel', handlePointerFinish)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerFinish)
      window.removeEventListener('pointercancel', handlePointerFinish)
    }
  }, [setDetachedViewerFloatingRect])

  const resolveViewerTargetSlotId = useCallback(() => {
    const targetViewerSlot =
      Object.values(viewportSlotsById).find(
        (slot) => slot.surfaceKind === 'modelViewer' && slot.surfaceInstanceId === primaryViewportId,
      ) ?? viewportSlotsById[defaultPrimaryViewportSlotId]
    return targetViewerSlot?.slotId ?? defaultPrimaryViewportSlotId
  }, [primaryViewportId, viewportSlotsById])

  useEffect(() => {
    const previousBrowserSlotCount = browserSlotCountRef.current
    if (
      previousBrowserSlotCount === 0 &&
      browserSlotCount > 0 &&
      browserToolbarOwnerSurfaceInstanceId !== null
    ) {
      setSuppressRuntimeProjectedDockedBrowserSurface(true)
    } else if (browserSlotCount === 0) {
      setSuppressRuntimeProjectedDockedBrowserSurface(false)
    }
    browserSlotCountRef.current = browserSlotCount
  }, [browserSlotCount, browserToolbarOwnerSurfaceInstanceId])
  const {
    handleActivateSpaghettiFloatingWindow,
    handleActivateSpaghettiSurface,
    handleActivateViewerSurface,
    handleActivateBrowserFloatingWindow,
  } = useAppShellSurfaceActivation({
    floatingShellActivationRequest,
    hasFocusableSpaghettiSurface,
    hasVisibleSpaghettiInAppShell,
    isBrowserFloating,
    isBrowserPoppedOut,
    requestConsoleContextSync,
    requestConsoleWorkspaceContextHandoff,
    setActiveEditorViewportId,
    setActiveFloatingShell,
    setActiveSurface,
    setActiveViewerViewportId,
    setViewportSpawnMenu,
    setWorkspaceSelectedTarget,
    sketchPlanePickSession,
    workspaceActiveSurface,
  })

  useUiPrefsPersistenceBridge()
  useGraphBrowserStoragePersistenceBridge()
  useWorkspacePersistenceBridge()

  useLayoutEffect(() => {
    if (!notepadPersistence) {
      notepadPersistenceWasEnabledRef.current = false
      return
    }

    const currentNotepadState = useNotepadStore.getState()
    if (
      !hasHydratedNotepadPersistenceRef.current &&
      isPristineNotepadState(currentNotepadState)
    ) {
      const persistedNotepadState = readPersistedNotepadState()
      if (persistedNotepadState !== null) {
        hydratePersistedNotepadState(persistedNotepadState)
      }
      hasHydratedNotepadPersistenceRef.current = true
    } else if (
      !notepadPersistenceWasEnabledRef.current &&
      isPristineNotepadState(currentNotepadState)
    ) {
      const persistedNotepadState = readPersistedNotepadState()
      if (persistedNotepadState !== null) {
        hydratePersistedNotepadState(persistedNotepadState)
      }
    }

    hasHydratedNotepadPersistenceRef.current = true
    notepadPersistenceWasEnabledRef.current = true
    writePersistedNotepadState(serializeNotepadState(useNotepadStore.getState()))
  }, [hydratePersistedNotepadState, notepadPersistence])

  useEffect(() => {
    const unsubscribe = useNotepadStore.subscribe((state) => {
      if (!hasHydratedNotepadPersistenceRef.current || !notepadPersistence) {
        return
      }
      writePersistedNotepadState(serializeNotepadState(state))
    })
    return unsubscribe
  }, [notepadPersistence])

  useLayoutEffect(() => {
    if (!dashboardPersistence) {
      dashboardPersistenceWasEnabledRef.current = false
      return
    }

    const currentDashboardState = useDashboardStore.getState()
    if (
      !hasHydratedDashboardPersistenceRef.current &&
      isPristineDashboardState(currentDashboardState)
    ) {
      const persistedDashboardState = readPersistedDashboardState()
      if (persistedDashboardState !== null) {
        hydratePersistedDashboardState(persistedDashboardState)
      }
      hasHydratedDashboardPersistenceRef.current = true
    } else if (
      !dashboardPersistenceWasEnabledRef.current &&
      isPristineDashboardState(currentDashboardState)
    ) {
      const persistedDashboardState = readPersistedDashboardState()
      if (persistedDashboardState !== null) {
        hydratePersistedDashboardState(persistedDashboardState)
      }
    }

    hasHydratedDashboardPersistenceRef.current = true
    dashboardPersistenceWasEnabledRef.current = true
    writePersistedDashboardState(serializeDashboardState(useDashboardStore.getState()))
  }, [dashboardPersistence, hydratePersistedDashboardState])

  useEffect(() => {
    const unsubscribe = useDashboardStore.subscribe((state) => {
      if (!hasHydratedDashboardPersistenceRef.current || !dashboardPersistence) {
        return
      }
      writePersistedDashboardState(serializeDashboardState(state))
    })
    return unsubscribe
  }, [dashboardPersistence])

  const handleSetEditorViewportWindowSettingsOpen = useCallback(
    (editorViewportId: string, isOpen: boolean) => {
      setWindowSettingsOpenByViewportId((current) => ({
        ...current,
        [editorViewportId]: isOpen,
      }))
    },
    [],
  )

  useWorkspaceDetachedRestoreCompatibilityBridge({
    activeDetachedBrowserSurface,
    activeDetachedConsoleSurface,
    browserSlotCount,
    browserViewportSplitDockSide,
    browserViewportSplitRatio,
    consoleSlotCount,
    consoleWindowMode,
    isBrowserFloating,
    isBrowserPoppedOut,
    isBrowserViewportSplit,
    setIsBrowserViewportSplit,
    splitViewportSlot,
  })

  const {
    consoleTransitionSplitDockGhostStyle,
    consoleTransitionSplitDockPreview,
    handleConsoleViewportSlotHeaderDragOut,
    isConsoleTransitionDragActive,
  } = useAppShellConsoleTransition({
    appShellRef,
    viewportRef,
    viewportSlotsById,
    floatWorkspaceSurface,
    setConsoleFloatingRect,
  })

  const {
    handleCloseViewportSlotFromMenu,
    handleViewportSlotSplit,
    handleViewportSlotSurfaceKindChange,
    handleViewportSlotFloat,
    handleViewportSlotHeaderDragOut,
    handleViewportSlotPopOut,
    handleTogglePrimaryLeftDockSlotSplit,
  } = useAppShellViewportActions({
    activeDetachedBrowserSurface,
    activeEditorViewport,
    appShellRef,
    browserSlotCount,
    editorSurfaceBindingById,
    editorSurfacePlacementById,
    editorViewportsById,
    isBrowserViewportSplit,
    isLeftDockViewportSplit,
    primaryViewportId,
    rootLeftSplitSlotIds,
    viewportLayoutNodesById,
    viewportSlotsById,
    closeEditorViewport,
    createDetachedViewportSurfaceCopy,
    detachViewportSlotSurface,
    floatWorkspaceSurface,
    onStartConsoleViewportSlotHeaderDragOut: handleConsoleViewportSlotHeaderDragOut,
    popoutWorkspaceSurface,
    removeViewportSlot,
    restoreDetachedSurfaceByKind,
    setActiveSurface,
    setActiveViewerViewportId,
    setBrowserFloatingPosition,
    setBrowserFloatingSize,
    setBrowserSlotHeaderDragSeed,
    setBrowserViewportSplitRatio,
    setIsBrowserPoppedOut,
    setIsBrowserViewportSplit,
    setIsLeftDockViewportSplit,
    setLeftDockResizeMenu,
    setSpaghettiSlotHeaderDragSeed,
    setViewportSlotSurfaceKind,
    splitViewportSlot,
  })

  const handleOpenSettingsSurface = useCallback(
    (initialSectionId: SettingsSectionId = 'all') => {
      setSettingsSurfaceInitialSectionId(initialSectionId)
      handleViewportSlotSurfaceKindChange(defaultPrimaryViewportSlotId, 'settings')
    },
    [handleViewportSlotSurfaceKindChange],
  )

  const {
    handleFloatingSplitMenu,
    handleOpenViewportSpawnMenu,
    leftDockResizeMenuSurface,
    viewportSpawnMenuSurface,
    workspaceSplitMenuSurface,
  } = useAppShellWorkspaceMenus({
    viewportRef,
    viewportSpawnMenu,
    setViewportSpawnMenu,
    leftDockResizeMenu,
    workspaceSplitMenu,
    isLeftDockViewportSplit,
    activeDetachedConsoleSurface,
    activeGraphDocumentId,
    graphDocumentOrder,
    editorViewportsById,
    splitRatio,
    viewportLayoutNodesById,
    workspaceSplitMenuTargetSurfaceInstanceId,
    workspaceSplitMenuTargetEditorViewport,
    workspaceSplitMenuTargetEditorSurface,
    workspaceSplitMenuTargetEditorSlot,
    workspaceSplitMenuTargetSplitPriority,
    workspaceSplitMenuTargetSurfaceKind,
    resolveViewerTargetSlotId,
    handleActivateViewerSurface,
    handleActivateSpaghettiSurface,
    handleActivateBrowserFloatingWindow,
    openGraphDocumentInNewViewport,
    setEditorViewportPosition,
    setEditorViewportSplitDirection,
    setEditorViewportSplitPriority,
    setEditorViewportSplitRatio,
    setEditorViewportWindowMode,
    setViewportLayoutSplitRatio,
    setWorkspaceSplitMenu,
    setIsBrowserPoppedOut,
    setIsBrowserViewportSplit,
    setBrowserFloating,
    setBrowserFloatingPosition,
    setBrowserFloatingSize,
    closeEditorViewport,
    removeViewportSlot,
    handleResetLeftDockWidth,
    handleTogglePrimaryLeftDockSlotSplit,
  })

  const newEditorSpawnPosition = useMemo(
    () => ({
      x: leftDockWidth + floatingDockLockGap,
      y: 16,
    }),
    [leftDockWidth],
  )

  const consoleListLeftOffset = leftDockWidth

  const handleViewportLayoutDividerPointerDown = useCallback(
    (nodeId: string, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return
      }
      const splitLayout = event.currentTarget.closest('.ViewportSplitLayout')
      if (!(splitLayout instanceof HTMLElement)) {
        return
      }
      const splitNode = viewportLayoutNodesById[nodeId]
      if (splitNode?.kind !== 'split') {
        return
      }
      event.preventDefault()
      event.stopPropagation()

      const splitRect = splitLayout.getBoundingClientRect()
      const handlePointerMove = (moveEvent: PointerEvent) => {
        const rawNextRatio =
          splitNode.splitDirection === 'vertical'
            ? splitNode.splitDockSide === 'left'
              ? (moveEvent.clientX - splitRect.left) / splitRect.width
              : (splitRect.right - moveEvent.clientX) / splitRect.width
            : splitNode.splitDockSide === 'top'
              ? (moveEvent.clientY - splitRect.top) / splitRect.height
              : (splitRect.bottom - moveEvent.clientY) / splitRect.height
        const nextRatio = clampWorkspaceLayoutSplitRatio(rawNextRatio)
        setViewportLayoutSplitRatio(nodeId, nextRatio)

        if (!workspaceNestedResizeKeepsFarPane) {
          return
        }

        const currentStartFraction = resolveWorkspaceSplitEdgeFraction(splitNode, 'start')
        const currentEndFraction = 1 - currentStartFraction
        const nextStartFraction =
          resolveWorkspaceSplitPrimaryEdge(splitNode) === 'start' ? nextRatio : 1 - nextRatio
        const nextEndFraction = 1 - nextStartFraction
        const nestedResizePlans: Array<{
          childNodeId: string
          childNode: Extract<WorkspaceLayoutNode, { kind: 'split' }>
          currentSubtreeFraction: number
          nextSubtreeFraction: number
          preservedFarEdge: WorkspaceSplitEdge
        }> = []

        const startChildNode = viewportLayoutNodesById[splitNode.firstChildId]
        if (startChildNode?.kind === 'split' && startChildNode.splitDirection === splitNode.splitDirection) {
          nestedResizePlans.push({
            childNodeId: splitNode.firstChildId,
            childNode: startChildNode,
            currentSubtreeFraction: currentStartFraction,
            nextSubtreeFraction: nextStartFraction,
            preservedFarEdge: 'start',
          })
        }

        const endChildNode = viewportLayoutNodesById[splitNode.secondChildId]
        if (endChildNode?.kind === 'split' && endChildNode.splitDirection === splitNode.splitDirection) {
          nestedResizePlans.push({
            childNodeId: splitNode.secondChildId,
            childNode: endChildNode,
            currentSubtreeFraction: currentEndFraction,
            nextSubtreeFraction: nextEndFraction,
            preservedFarEdge: 'end',
          })
        }

        for (const resizePlan of nestedResizePlans) {
          if (resizePlan.currentSubtreeFraction <= 0 || resizePlan.nextSubtreeFraction <= 0) {
            continue
          }
          const preservedFarFractionWithinSubtree = resolveWorkspaceSplitEdgeFraction(
            resizePlan.childNode,
            resizePlan.preservedFarEdge,
          )
          const preservedFarFractionWithinParent =
            resizePlan.currentSubtreeFraction * preservedFarFractionWithinSubtree
          const nextFarFractionWithinSubtree =
            preservedFarFractionWithinParent / resizePlan.nextSubtreeFraction
          const nextChildRatio = clampWorkspaceLayoutSplitRatio(
            resolveWorkspaceSplitRatioForEdgeFraction(
              resizePlan.childNode,
              resizePlan.preservedFarEdge,
              nextFarFractionWithinSubtree,
            ),
          )
          setViewportLayoutSplitRatio(resizePlan.childNodeId, nextChildRatio)
        }
      }
      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }

      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    },
    [setViewportLayoutSplitRatio, viewportLayoutNodesById, workspaceNestedResizeKeepsFarPane],
  )

  const releaseViewportSplitCornerPointerCapture = useCallback(
    (target: HTMLButtonElement | null, pointerId: number | null) => {
      if (
        target === null ||
        pointerId === null ||
        typeof target.releasePointerCapture !== 'function'
      ) {
        return
      }
      target.releasePointerCapture(pointerId)
    },
    [],
  )

  const clearViewportSplitCornerGestureSession = useCallback(
    (pointerId?: number | null, target?: HTMLButtonElement | null) => {
      const resolvedPointerId = pointerId ?? viewportSplitCornerGestureSession?.pointerId ?? null
      const resolvedTarget = target ?? viewportSplitCornerGestureButtonRef.current
      releaseViewportSplitCornerPointerCapture(resolvedTarget, resolvedPointerId)
      viewportSplitCornerGestureButtonRef.current = null
      setViewportSplitCornerGestureSession(null)
    },
    [releaseViewportSplitCornerPointerCapture, viewportSplitCornerGestureSession?.pointerId],
  )

  const handleViewportSplitCornerPointerDown = useCallback(
    (
      nodeId: string,
      paneArea: WorkspaceSplitPaneArea,
      corner: WorkspaceViewportSplitCorner,
      event: ReactPointerEvent<HTMLButtonElement>,
    ) => {
      if (event.button !== 0) {
        return
      }
      if (
        resolveViewportSplitCornerTargetNodeId(
          nodeId,
          viewportLayoutNodesById,
          viewportSlotRootNodeId,
          viewportSlotsById,
        ) === null
      ) {
        return
      }
      const paneElement = event.currentTarget.closest('.ViewportSplitPane')
      if (!(paneElement instanceof HTMLElement)) {
        return
      }
      const paneRect = paneElement.getBoundingClientRect()
      event.preventDefault()
      event.stopPropagation()

      if (typeof event.currentTarget.setPointerCapture === 'function') {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      viewportSplitCornerGestureButtonRef.current = event.currentTarget
      setViewportSplitCornerGestureSession({
        nodeId,
        paneArea,
        corner,
        pointerId: event.pointerId,
        originClientX: event.clientX,
        originClientY: event.clientY,
        latestClientX: event.clientX,
        latestClientY: event.clientY,
        deadzoneCrossed: false,
        paneRect: {
          bottom: paneRect.bottom,
          height: paneRect.height,
          left: paneRect.left,
          right: paneRect.right,
          top: paneRect.top,
          width: paneRect.width,
        },
        previewOrientation: null,
      })
    },
    [viewportLayoutNodesById, viewportSlotRootNodeId, viewportSlotsById],
  )

  const handleViewportSplitCornerPointerMove = useCallback(
    (
      _nodeId: string,
      _paneArea: WorkspaceSplitPaneArea,
      _corner: WorkspaceViewportSplitCorner,
      event: ReactPointerEvent<HTMLButtonElement>,
    ) => {
      setViewportSplitCornerGestureSession((currentSession) => {
        if (currentSession === null || currentSession.pointerId !== event.pointerId) {
          return currentSession
        }

        event.preventDefault()
        event.stopPropagation()

        const deadzoneCrossed =
          Math.max(
            Math.abs(event.clientX - currentSession.originClientX),
            Math.abs(event.clientY - currentSession.originClientY),
          ) >= workspaceSplitCornerGestureDeadzonePx
        const absDeltaX = Math.abs(event.clientX - currentSession.originClientX)
        const absDeltaY = Math.abs(event.clientY - currentSession.originClientY)
        let previewOrientation = currentSession.previewOrientation
        if (!deadzoneCrossed) {
          previewOrientation = null
        } else if (previewOrientation === null) {
          previewOrientation = absDeltaX >= absDeltaY ? 'vertical' : 'horizontal'
        } else if (
          previewOrientation === 'vertical' &&
          absDeltaY - absDeltaX >= workspaceSplitCornerGestureAxisSwitchHysteresisPx
        ) {
          previewOrientation = 'horizontal'
        } else if (
          previewOrientation === 'horizontal' &&
          absDeltaX - absDeltaY >= workspaceSplitCornerGestureAxisSwitchHysteresisPx
        ) {
          previewOrientation = 'vertical'
        }
        if (
          currentSession.latestClientX === event.clientX &&
          currentSession.latestClientY === event.clientY &&
          currentSession.deadzoneCrossed === deadzoneCrossed &&
          currentSession.previewOrientation === previewOrientation
        ) {
          return currentSession
        }

        return {
          ...currentSession,
          latestClientX: event.clientX,
          latestClientY: event.clientY,
          deadzoneCrossed,
          previewOrientation,
        }
      })
    },
    [],
  )

  const handleViewportSplitCornerPointerUp = useCallback(
    (
      _nodeId: string,
      _paneArea: WorkspaceSplitPaneArea,
      _corner: WorkspaceViewportSplitCorner,
      event: ReactPointerEvent<HTMLButtonElement>,
    ) => {
      if (viewportSplitCornerGestureSession?.pointerId !== event.pointerId) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (
        viewportSplitCornerPreview !== null &&
        viewportSplitCornerPreview.rawRatio >= workspaceSplitCornerCommitThresholdRatio
      ) {
        const createdSlotId = splitViewportLayoutNode(
          viewportSplitCornerPreview.targetNodeId,
          viewportSplitCornerPreview.anchorEdge as WorkspaceSplitDockSide,
          {
            preferredRatio: viewportSplitCornerPreview.ratio,
          },
        )
        if (createdSlotId !== null) {
          const workspaceState = useWorkspaceStore.getState()
          const createdSlot = workspaceState.viewportSlotsById[createdSlotId]
          const createdSplitNodeId =
            createdSlot !== undefined
              ? findParentSplitNodeIdForLayoutNode(
                  createdSlot.leafNodeId,
                  workspaceState.viewportLayoutNodesById,
                )
              : null
          if (createdSplitNodeId !== null) {
            setViewportLayoutSplitRatio(createdSplitNodeId, viewportSplitCornerPreview.ratio)
          }
        }
      }
      clearViewportSplitCornerGestureSession(event.pointerId, event.currentTarget)
    },
    [
      clearViewportSplitCornerGestureSession,
      setViewportLayoutSplitRatio,
      splitViewportLayoutNode,
      viewportSplitCornerGestureSession?.pointerId,
      viewportSplitCornerPreview,
    ],
  )

  const handleViewportSplitCornerPointerCancel = useCallback(
    (
      _nodeId: string,
      _paneArea: WorkspaceSplitPaneArea,
      _corner: WorkspaceViewportSplitCorner,
      event: ReactPointerEvent<HTMLButtonElement>,
    ) => {
      if (viewportSplitCornerGestureSession?.pointerId !== event.pointerId) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      clearViewportSplitCornerGestureSession(event.pointerId, event.currentTarget)
    },
    [clearViewportSplitCornerGestureSession, viewportSplitCornerGestureSession?.pointerId],
  )

  const resolvePrimaryLeftDockBottomInset = useCallback(
    (slotLeafNodeId: string) => {
      const parentSplitNodeId = findParentSplitNodeIdForLayoutNode(
        slotLeafNodeId,
        viewportLayoutNodesById,
      )
      const parentSplitNode =
        parentSplitNodeId !== null ? viewportLayoutNodesById[parentSplitNodeId] : null
      if (
        parentSplitNode?.kind === 'split' &&
        parentSplitNode.splitDirection === 'horizontal' &&
        parentSplitNode.splitDockSide === 'bottom' &&
        parentSplitNode.firstChildId === slotLeafNodeId
      ) {
        return `calc(${parentSplitNode.ratio * 100}% + 10px)`
      }
      return '0px'
    },
    [viewportLayoutNodesById],
  )

  const handleOpenDashboardNoteInNotepad = useCallback(
    (dashboardSurfaceInstanceId: string, noteId: string) => {
      setActiveNoteId(noteId)
      const workspaceState = useWorkspaceStore.getState()
      const slottedDashboard = Object.values(workspaceState.viewportSlotsById).find(
        (slot) =>
          slot.surfaceKind === 'dashboard' &&
          slot.surfaceInstanceId === dashboardSurfaceInstanceId,
      )
      if (slottedDashboard !== undefined) {
        handleViewportSlotSurfaceKindChange(slottedDashboard.slotId, 'notepad')
        return
      }
      const detachedSurface = workspaceState.detachedSlotSurfaceById[dashboardSurfaceInstanceId] ?? null
      if (detachedSurface?.surfaceKind === 'dashboard') {
        setDetachedSurfaceKind(dashboardSurfaceInstanceId, 'notepad')
      }
    },
    [handleViewportSlotSurfaceKindChange, setActiveNoteId, setDetachedSurfaceKind],
  )

  const handleOpenHomePageSurface = useCallback(
    (surfaceKind: WorkspaceSurfaceKind) => {
      if (surfaceKind === 'homePage') {
        return
      }
      handleViewportSlotSurfaceKindChange(defaultPrimaryViewportSlotId, surfaceKind)
      if (surfaceKind === 'modelViewer') {
        handleActivateViewerSurface(
          useWorkspaceStore.getState().primaryViewportId ?? defaultPrimaryWorkspaceViewportId,
        )
      }
    },
    [handleActivateViewerSurface, handleViewportSlotSurfaceKindChange],
  )

  const viewerSurface = (
    <WorkspaceViewportTree
      viewportSlotRootNodeId={viewportSlotRootNodeId}
      viewportSlotsById={viewportSlotsById}
      viewportLayoutNodesById={viewportLayoutNodesById}
      leftDockWidth={leftDockWidth}
      leftDockStackHeight={leftDockStackHeight}
      leftDockStackSplitRatio={leftDockStackSplitRatio}
      primaryViewportSlotIsConstrained={primaryViewportSlotIsConstrained}
      isLeftDockViewportSplit={isLeftDockViewportSplit}
      isBrowserDockPreviewActive={isBrowserDockPreviewActive}
      isMeatballDockPreviewActive={isMeatballDockPreviewActive}
      isMeatballDockOccupied={isMeatballDockOccupied}
      browserPresentationMode={browserPresentationMode}
      isBrowserCollapsed={isBrowserCollapsed}
      windowSettingsOpenByViewportId={windowSettingsOpenByViewportId}
      settingsInitialSectionId={settingsSurfaceInitialSectionId}
      dockedBrowserHostRef={dockedBrowserHostRef}
      dockedMeatballHostRef={dockedMeatballHostRef}
      onOpenHomePageSurface={handleOpenHomePageSurface}
      onOpenSettings={handleOpenSettingsSurface}
      onActivateSpaghettiSurface={handleActivateSpaghettiSurface}
      onActivateViewerSurface={handleActivateViewerSurface}
      onOpenViewportSpawnMenu={handleOpenViewportSpawnMenu}
      onCycleBrowserPresentationMode={() =>
        cycleBrowserPresentationModeWithHistory(browserPresentationMode)
      }
      onRequestViewportSlotSurfaceKind={handleViewportSlotSurfaceKindChange}
      onOpenDashboardNoteInNotepad={handleOpenDashboardNoteInNotepad}
      onSplitViewportSlot={handleViewportSlotSplit}
      onSplitViewportSlotWithSurfaceKind={(slotId, splitDockSide, surfaceKind) =>
        handleViewportSlotSplit(slotId, splitDockSide, { surfaceKind })
      }
      onFloatViewportSlot={handleViewportSlotFloat}
      onPopOutViewportSlot={handleViewportSlotPopOut}
      onCloseViewportSlot={handleCloseViewportSlotFromMenu}
      onViewportSlotHeaderDragOut={handleViewportSlotHeaderDragOut}
      onViewportLayoutDividerPointerDown={handleViewportLayoutDividerPointerDown}
      onViewportSplitCornerPointerDown={handleViewportSplitCornerPointerDown}
      onViewportSplitCornerPointerMove={handleViewportSplitCornerPointerMove}
      onViewportSplitCornerPointerUp={handleViewportSplitCornerPointerUp}
      onViewportSplitCornerPointerCancel={handleViewportSplitCornerPointerCancel}
      onLeftDockResizeStart={handleLeftDockResizeStart}
      onLeftDockResizeContextMenu={handleLeftDockResizeContextMenu}
      resolvePrimaryLeftDockBottomInset={resolvePrimaryLeftDockBottomInset}
      reservePrimaryViewportBottomConsoleBar={false}
      activeViewportSplitCornerSession={
        viewportSplitCornerGestureSession === null
          ? null
          : {
              nodeId: viewportSplitCornerGestureSession.nodeId,
              corner: viewportSplitCornerGestureSession.corner,
              deadzoneCrossed: viewportSplitCornerGestureSession.deadzoneCrossed,
            }
      }
      activeViewportSplitCornerPreview={viewportSplitCornerPreview}
    />
  )
  const detachedViewerWindows = detachedViewerFloatingSurfaces.map((surface) => {
    const floatingRect =
      detachedViewerFloatingRectsRef.current[surface.surfaceInstanceId] ??
      getDefaultDetachedViewerFloatingRect(surface)
    const hostViewportId = surface.hostViewportId ?? primaryViewportId

    return (
      <div
        key={surface.surfaceInstanceId}
        ref={(element) => {
          detachedViewerFloatingWindowRefBySurfaceId.current[surface.surfaceInstanceId] = element
        }}
        className="DetachedViewerFloatingWindow"
        data-workspace-surface-instance-id={surface.surfaceInstanceId}
        data-workspace-host-viewport-id={hostViewportId}
        style={{
          position: 'absolute',
          left: `${floatingRect.x}px`,
          top: `${floatingRect.y}px`,
          width: `${floatingRect.width}px`,
          height: `${floatingRect.height}px`,
          zIndex: 18,
          display: 'grid',
          gridTemplateRows: '32px minmax(0, 1fr)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'rgba(7, 11, 18, 0.96)',
          boxShadow: '0 18px 44px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          className="DetachedViewerFloatingWindowHeader"
          onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
            if (event.button !== 0) {
              return
            }
            if (event.target instanceof Element && event.target.closest('button') !== null) {
              return
            }
            const viewportAreaRect = viewportRef.current?.getBoundingClientRect() ?? null
            const floatingWindow =
              detachedViewerFloatingWindowRefBySurfaceId.current[surface.surfaceInstanceId]
            const floatingWindowRect = floatingWindow?.getBoundingClientRect() ?? null
            if (viewportAreaRect === null || floatingWindowRect === null) {
              return
            }
            detachedViewerDragRef.current = {
              surfaceInstanceId: surface.surfaceInstanceId,
              pointerId: event.pointerId,
              pointerOffsetX: event.clientX - floatingWindowRect.left,
              pointerOffsetY: event.clientY - floatingWindowRect.top,
            }
            handleActivateViewerSurface(surface.surfaceInstanceId)
            event.preventDefault()
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '0 10px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            cursor: 'grab',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: 0,
              flex: '1 1 auto',
            }}
          >
            <span>Floating Model Viewport</span>
            <ViewportOverlayModeTitlebarControls viewportId={surface.surfaceInstanceId} />
          </div>
          <FloatingWindowQuickDockButton
            className="DetachedViewerFloatingWindowQuickDock"
            onClick={() => {
              redockDetachedSurface(surface.surfaceInstanceId)
            }}
          />
        </div>
        <div style={{ position: 'relative', minHeight: 0 }}>
          <ViewportWorkspaceHost
            viewportId={surface.surfaceInstanceId}
            onActivateViewerSurface={handleActivateViewerSurface}
            onViewportContextMenu={handleOpenViewportSpawnMenu}
          />
        </div>
      </div>
    )
  })
  const detachedViewerPopoutWindows = detachedViewerPopoutSurfaces.map((surface) => (
    <DetachedViewerPopoutWindow
      key={surface.surfaceInstanceId}
      surface={surface}
      onActivateViewerSurface={handleActivateViewerSurface}
      onClearDetachedSurface={clearDetachedSlotSurface}
      onQuickDock={redockDetachedSurface}
    />
  ))
  return (
    <div ref={appShellRef} className="AppShellRoot">
      <section
        ref={viewportRef}
        className="ViewportArea"
      >
        {viewportSpawnMenuSurface}
        {detachedViewerWindows}
        {detachedViewerPopoutWindows}
        <DashboardWindowHost
          viewportRef={viewportRef}
          primaryViewportId={primaryViewportId}
          floatingSurfaces={detachedDashboardFloatingSurfaces}
          popoutSurfaces={detachedDashboardPopoutSurfaces}
          onClearDetachedSurface={clearDetachedSlotSurface}
          onOpenNoteInNotepad={handleOpenDashboardNoteInNotepad}
          onQuickDock={redockDetachedSurface}
          onOpenSettings={handleOpenSettingsSurface}
        />
        <SimpleFloatingSurfaceHost
          viewportRef={viewportRef}
          floatingSurfaces={detachedCatalogFloatingSurfaces}
          onQuickDock={redockDetachedSurface}
          onOpenSettings={handleOpenSettingsSurface}
          title="Floating Catalog"
          windowClassName="CatalogFloatingWindow"
          headerClassName="CatalogFloatingWindowHeader"
          quickDockClassName="CatalogFloatingWindowQuickDock"
          defaultRect={{ x: 72, y: 72, width: 520, height: 320 }}
          minWidth={360}
          minHeight={240}
          renderSurface={(surface) => (
            <CatalogSurface surfaceInstanceId={surface.surfaceInstanceId} hostMode="floating" />
          )}
        />
        <NotepadWindowHost
          viewportRef={viewportRef}
          floatingSurfaces={detachedNotepadFloatingSurfaces}
          popoutSurfaces={detachedNotepadPopoutSurfaces}
          onClearDetachedSurface={clearDetachedSlotSurface}
          onQuickDock={redockDetachedSurface}
          onOpenSettings={handleOpenSettingsSurface}
        />
        <SpaghettiWindowHost
          appShellRef={appShellRef}
          viewportRef={viewportRef}
          dockedMeatballHostRef={dockedMeatballHostRef}
          leftDockWidth={leftDockWidth}
          isLeftDockViewportSplit={isLeftDockViewportSplit}
          activeLeftDockPreviewPanelId={activeLeftDockPreviewPanelId}
          setActiveLeftDockPreviewPanelId={setActiveLeftDockPreviewPanelId}
          resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
          viewerSurface={viewerSurface}
          workspaceActiveSurface={workspaceActiveSurface}
          slotHeaderDragSeed={spaghettiSlotHeaderDragSeed}
          onConsumeSlotHeaderDragSeed={() => setSpaghettiSlotHeaderDragSeed(null)}
          onActivateSpaghettiSurface={handleActivateSpaghettiSurface}
          onActivateSpaghettiFloatingWindow={handleActivateSpaghettiFloatingWindow}
          onOpenFloatingSplitMenu={handleFloatingSplitMenu}
          onActivateViewerSurface={handleActivateViewerSurface}
          windowSettingsOpenByViewportId={windowSettingsOpenByViewportId}
          onSetWindowSettingsOpen={handleSetEditorViewportWindowSettingsOpen}
          leftDockWidthPreviewHandlerRef={leftDockWidthPreviewHandlerRef}
        />
        {consoleTransitionSplitDockPreview !== null &&
        consoleTransitionSplitDockGhostStyle !== null &&
        viewportRef.current !== null
          ? createPortal(
              <div
                className={`ViewportSplitDockGhost ${
                  consoleTransitionSplitDockPreview.scope === 'global'
                    ? 'isWholeBrowserScope'
                    : 'isPaneLocalScope'
                } ${
                  consoleTransitionSplitDockPreview.side === 'left'
                    ? 'isDockLeft'
                    : consoleTransitionSplitDockPreview.side === 'right'
                      ? 'isDockRight'
                      : consoleTransitionSplitDockPreview.side === 'top'
                        ? 'isDockTop'
                        : 'isDockBottom'
                }`}
                data-split-preview-scope={consoleTransitionSplitDockPreview.scope}
                aria-hidden="true"
                style={consoleTransitionSplitDockGhostStyle}
              />,
              viewportRef.current,
            )
          : null}
      </section>
      <section className="AppShellConsoleRow" data-app-shell-console-row="true">
        <ConsoleDock
          listLeftOffset={consoleListLeftOffset}
          suppressDockedSurface={suppressLegacyDockedConsoleSurface}
          suppressSlotHeaderDragSeedReplay={isConsoleTransitionDragActive}
          onOpenFloatingSplitMenu={handleFloatingSplitMenu}
        />
      </section>
      <BrowserDockHost
        appShellRef={appShellRef}
        viewportRef={viewportRef}
        viewportSplitHostRef={browserViewportSplitHostRef}
        dockedBrowserHostRef={dockedBrowserHostRef}
        renderViewportSplitSurface={false}
        suppressDockedSurface={suppressLegacyDockedBrowserSurface}
        resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
        onActivateBrowserFloatingWindow={handleActivateBrowserFloatingWindow}
        onOpenSettings={handleOpenSettingsSurface}
        newEditorSpawnPosition={newEditorSpawnPosition}
        workspaceActiveSurface={workspaceActiveSurface}
        slotHeaderDragSeed={browserSlotHeaderDragSeed}
        onConsumeSlotHeaderDragSeed={() => setBrowserSlotHeaderDragSeed(null)}
      />
      {leftDockResizeMenuSurface}
      {workspaceSplitMenuSurface}
      <div
        className="AppShellRadioRuntimeFamily"
        data-radio-support-classification={RADIO_SUPPORT_PROFILE.classification}
        data-radio-requires-workspace-surface={`${RADIO_SUPPORT_PROFILE.requiresWorkspaceSurface}`}
        style={{ display: 'contents' }}
      >
        {isRadioToolbarOpen ? <RadioPanel /> : null}
        <RadioRuntimeHost />
      </div>
    </div>
  )
}
