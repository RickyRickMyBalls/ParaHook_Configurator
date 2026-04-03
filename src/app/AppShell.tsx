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
import { createPortal } from 'react-dom'
import { ConsoleDock } from './console/ConsoleDock'
import type { ConsoleFloatingRect } from './console/consoleTypes'
import { useConsoleStore } from './console/useConsoleStore'
import { BrowserDockHost } from './hosts/BrowserDockHost'
import { RadioRuntimeHost } from './hosts/RadioRuntimeHost'
import { SpaghettiWindowHost } from './hosts/SpaghettiWindowHost'
import { useAppShellDockController } from './hosts/useAppShellDockController'
import { RadioPanel } from './panels/RadioPanel'
import {
  selectActiveEditorViewport,
  selectEditorViewportSelectedNodeId,
  useSpaghettiStore,
} from './spaghetti/store/useSpaghettiStore'
import { useAudioSamplerStore } from './store/audioSamplerStore'
import { useAppStore, type ConsoleContextSyncSource } from './store/useAppStore'
import { useWorkspaceChildWindow } from './workspace/useWorkspaceChildWindow'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import { PrimaryViewportLeftDock } from './workspace/PrimaryViewportLeftDock'
import { ViewportFrame } from './workspace/ViewportFrame'
import { ViewportSurfaceRegistry } from './workspace/ViewportSurfaceRegistry'
import { ViewportWorkspaceHost } from './workspace/ViewportWorkspaceHost'
import {
  commitWorkspaceSurfaceRootSplit,
  commitWorkspaceSurfaceSlotSplit,
  floatingConsoleCompatibilitySurfaceInstanceId,
  floatWorkspaceSurface,
  popoutWorkspaceSurface,
  restoreDetachedSurfaceByKind,
  splitWorkspaceSurfaceToSide,
} from './workspace/workspaceSurfaceActions'
import {
  readPersistedWorkspaceLayout,
  serializeWorkspaceLayout,
  writePersistedWorkspaceLayout,
} from './workspace/workspacePersistence'
import {
  createDefaultModelViewportPopoutState,
  defaultBrowserHostRouteId,
  defaultBrowserFloatingPosition,
  defaultBrowserFloatingSize,
  defaultPrimaryViewportSlotId,
  type WorkspaceDetachedSlotSurfaceState,
} from './workspace/workspaceShellTypes'
import {
  getLatestViewerCameraPose,
  getViewer,
  restoreViewerCameraPose,
  setActiveViewer,
} from './viewerBridge'
import {
  defaultWorkspaceSplitPriority,
  resolveWorkspaceSplitDirectionForDockSide,
  type WorkspaceSplitPriority,
  type WorkspaceSplitDockSide,
} from './workspace/workspaceSplitTypes'
import {
  resolveWorkspaceSplitDockPreview,
  type WorkspaceSplitDockPreview,
} from './workspace/workspaceSplitPreview'

const floatingDockLockGap = 25
const splitDividerHeight = 10
const consoleFloatingViewportMargin = 12
const consoleFloatingMinWidth = 420
const consoleFloatingMinHeight = 220
const modelViewportPopoutBackground = 'rgb(7, 11, 18)'
const detachedViewerFloatingMinWidth = 320
const detachedViewerFloatingMinHeight = 240
const detachedViewerFloatingEdgePadding = 12

type DetachedViewerFloatingRect = {
  x: number
  y: number
  width: number
  height: number
}

type ViewportSpawnMenuState = {
  viewportId: string
  x: number
  y: number
  query: string
}

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

function collectLeafSlotIdsFromLayoutNode(
  nodeId: string,
  viewportLayoutNodesById: Record<string, { kind: string; firstChildId?: string; secondChildId?: string; slotId?: string }>,
): string[] {
  const node = viewportLayoutNodesById[nodeId]
  if (node === undefined) {
    return []
  }
  if (node.kind === 'leaf') {
    return node.slotId !== undefined ? [node.slotId] : []
  }
  if (node.kind !== 'split' || node.firstChildId === undefined || node.secondChildId === undefined) {
    return []
  }
  return [
    ...collectLeafSlotIdsFromLayoutNode(node.firstChildId, viewportLayoutNodesById),
    ...collectLeafSlotIdsFromLayoutNode(node.secondChildId, viewportLayoutNodesById),
  ]
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

function clampConsoleTransitionFloatingRect(
  nextRect: ConsoleFloatingRect,
  viewportWidth: number,
  viewportHeight: number,
  bounds?: {
    minX?: number
    minY?: number
    maxX?: number
    maxY?: number
  },
): ConsoleFloatingRect {
  const maxWidth = Math.max(
    consoleFloatingMinWidth,
    viewportWidth - consoleFloatingViewportMargin * 2,
  )
  const maxHeight = Math.max(
    consoleFloatingMinHeight,
    viewportHeight - consoleFloatingViewportMargin * 2,
  )
  const width = Math.min(maxWidth, Math.max(consoleFloatingMinWidth, Math.round(nextRect.width)))
  const height = Math.min(
    maxHeight,
    Math.max(consoleFloatingMinHeight, Math.round(nextRect.height)),
  )
  const minX = Math.max(
    consoleFloatingViewportMargin,
    Math.round(bounds?.minX ?? consoleFloatingViewportMargin),
  )
  const minY = Math.max(
    consoleFloatingViewportMargin,
    Math.round(bounds?.minY ?? consoleFloatingViewportMargin),
  )
  const maxX = Math.max(
    minX,
    Math.min(
      viewportWidth - width - consoleFloatingViewportMargin,
      Math.round(bounds?.maxX ?? viewportWidth - width - consoleFloatingViewportMargin),
    ),
  )
  const maxY = Math.max(
    minY,
    Math.min(
      viewportHeight - height - consoleFloatingViewportMargin,
      Math.round(bounds?.maxY ?? viewportHeight - height - consoleFloatingViewportMargin),
    ),
  )
  return {
    x: Math.max(minX, Math.min(Math.round(nextRect.x), maxX)),
    y: Math.max(minY, Math.min(Math.round(nextRect.y), maxY)),
    width,
    height,
  }
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
  const viewportSpawnMenuRef = useRef<HTMLDivElement | null>(null)
  const viewportSpawnMenuInputRef = useRef<HTMLInputElement | null>(null)
  const leftDockWidthPreviewHandlerRef = useRef<((nextWidth: number) => void) | null>(null)
  const [, setDetachedViewerFloatingLayoutVersion] = useState(0)
  const [viewportSpawnMenu, setViewportSpawnMenu] = useState<ViewportSpawnMenuState | null>(null)
  const [isFloatingSplitSubmenuHovered, setIsFloatingSplitSubmenuHovered] = useState(false)
  const [isFloatingSplitSubmenuLocked, setIsFloatingSplitSubmenuLocked] = useState(false)
  const leftDockWidth = useWorkspaceStore((state) => state.leftDockWidth)
  const setLeftDockWidth = useWorkspaceStore((state) => state.setLeftDockWidth)
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
  const setBrowserPresentationMode = useWorkspaceStore((state) => state.setBrowserPresentationMode)
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
  const hydratePersistedWorkspaceLayout = useWorkspaceStore(
    (state) => state.hydratePersistedWorkspaceLayout,
  )
  const activeEditorSurface = useWorkspaceStore((state) =>
    activeEditorViewportId.length > 0 ? state.editorSurfacePlacementById[activeEditorViewportId] ?? null : null,
  )
  const editorSurfacePlacementById = useWorkspaceStore((state) => state.editorSurfacePlacementById)
  const activeEditorSlot = useMemo(
    () =>
      activeEditorViewportId.length > 0
        ? Object.values(viewportSlotsById).find(
            (slot) =>
              slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === activeEditorViewportId,
          ) ?? null
        : null,
    [activeEditorViewportId, viewportSlotsById],
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
  const [consoleTransitionSplitDockPreview, setConsoleTransitionSplitDockPreview] =
    useState<WorkspaceSplitDockPreview | null>(null)
  const [isConsoleTransitionDragActive, setIsConsoleTransitionDragActive] = useState(false)
  const [, setActiveFloatingShell] = useState<'spaghetti' | 'browser' | null>(null)
  const lastHandledFloatingShellActivationSeqRef = useRef(0)
  const hasHydratedWorkspacePersistenceRef = useRef(false)
  const consoleTransitionSplitDockPreviewRef = useRef<WorkspaceSplitDockPreview | null>(null)
  const consoleTransitionDragCleanupRef = useRef<(() => void) | null>(null)

  const {
    resolveLeftDockPreviewPanelId,
    handleLeftDockResizeStart,
    handleLeftDockResizeContextMenu,
    handleResetLeftDockWidth,
    handleLeftDockSplitTogglePointerDown,
  } = useAppShellDockController({
    appShellRef,
    dockedBrowserHostRef,
    dockedMeatballHostRef,
    leftDockWidth,
    setLeftDockWidth,
    isLeftDockViewportSplit,
    leftDockResizeMenu,
    setLeftDockResizeMenu,
    workspaceSplitMenu,
    setWorkspaceSplitMenu,
    setIsLeftDockViewportSplit,
    onLeftDockWidthPreview: (nextWidth) => {
      leftDockWidthPreviewHandlerRef.current?.(nextWidth)
    },
  })

  const hasVisibleSpaghettiInAppShell = useMemo(
    () =>
      Object.values(editorViewportsById).some((viewport) => {
        const editorViewportId = viewport.editorViewportId
        const placement = editorSurfacePlacementById[editorViewportId] ?? null
        const windowMode = viewport.windowMode ?? placement?.windowMode
        const isSlotted = Object.values(viewportSlotsById).some(
          (slot) =>
            slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === editorViewportId,
        )
        return (
          !isSlotted &&
          (windowMode === 'expanded' ||
            windowMode === 'maximized' ||
            windowMode === 'collapsed' ||
            windowMode === 'meatball editor view')
        )
      }),
    [editorSurfacePlacementById, editorViewportsById, viewportSlotsById],
  )
  const hasSlottedSpaghettiSurface = useMemo(
    () => Object.values(viewportSlotsById).some((slot) => slot.surfaceKind === 'spaghettiEditor'),
    [viewportSlotsById],
  )
  const hasDetachedSpaghettiSurface = useMemo(
    () =>
      Object.values(detachedSlotSurfaceById).some(
        (surface) => surface.surfaceKind === 'spaghettiEditor',
      ),
    [detachedSlotSurfaceById],
  )
  const hasPopoutSpaghettiSurface = useMemo(
    () =>
      Object.values(editorViewportsById).some(
        (viewport) => (viewport.windowMode ?? '') === 'separateWindow',
      ),
    [editorViewportsById],
  )
  const hasFocusableSpaghettiSurface =
    hasVisibleSpaghettiInAppShell ||
    hasSlottedSpaghettiSurface ||
    hasDetachedSpaghettiSurface ||
    hasPopoutSpaghettiSurface
  const editorViewportSplitViewSignature = Object.values(editorViewportsById)
    .map((viewport) =>
      [
        viewport.editorViewportId,
        viewport.windowMode,
        viewport.splitDirection,
        viewport.splitDockSide,
        viewport.splitRatio,
      ].join(':'),
    )
    .join('|')
  const splitRatio = activeEditorSurface?.splitRatio ?? activeEditorViewport?.splitRatio ?? 0.5
  const splitPriority =
    activeEditorSurface?.splitPriority ??
    activeEditorViewport?.splitPriority ??
    defaultWorkspaceSplitPriority
  const workspaceSplitMenuTargetSurfaceInstanceId =
    workspaceSplitMenu?.scope === 'floating-titlebar'
      ? workspaceSplitMenu.targetSurfaceInstanceId ?? activeEditorViewport?.editorViewportId ?? null
      : activeEditorViewport?.editorViewportId ?? null
  const workspaceSplitMenuTargetEditorViewportId =
    workspaceSplitMenuTargetSurfaceInstanceId !== null &&
    editorViewportsById[workspaceSplitMenuTargetSurfaceInstanceId] !== undefined
      ? workspaceSplitMenuTargetSurfaceInstanceId
      : activeEditorViewport?.editorViewportId ?? null
  const workspaceSplitMenuTargetEditorViewport =
    workspaceSplitMenuTargetEditorViewportId !== null
      ? editorViewportsById[workspaceSplitMenuTargetEditorViewportId] ?? null
      : activeEditorViewport
  const workspaceSplitMenuTargetEditorSurface =
    workspaceSplitMenuTargetEditorViewportId !== null
      ? editorSurfacePlacementById[workspaceSplitMenuTargetEditorViewportId] ?? null
      : activeEditorSurface
  const workspaceSplitMenuTargetEditorSlot = useMemo(
    () =>
      workspaceSplitMenuTargetEditorViewportId !== null
        ? Object.values(viewportSlotsById).find(
            (slot) =>
              slot.surfaceKind === 'spaghettiEditor' &&
              slot.surfaceInstanceId === workspaceSplitMenuTargetEditorViewportId,
          ) ?? null
        : activeEditorSlot,
    [activeEditorSlot, viewportSlotsById, workspaceSplitMenuTargetEditorViewportId],
  )
  const workspaceSplitMenuTargetSplitPriority =
    workspaceSplitMenuTargetEditorSurface?.splitPriority ??
    workspaceSplitMenuTargetEditorViewport?.splitPriority ??
    splitPriority
  const isBrowserDockPreviewActive = activeLeftDockPreviewPanelId === 'browser'
  const isMeatballDockPreviewActive = activeLeftDockPreviewPanelId === 'meatball-editor'
  const browserSlotCount = useMemo(
    () => Object.values(viewportSlotsById).filter((slot) => slot.surfaceKind === 'browser').length,
    [viewportSlotsById],
  )
  const consoleSlotCount = useMemo(
    () => Object.values(viewportSlotsById).filter((slot) => slot.surfaceKind === 'console').length,
    [viewportSlotsById],
  )
  const browserToolbarOwnerSurfaceInstanceId = useWorkspaceStore(
    (state) => state.hostRouteOwnershipByRouteId[defaultBrowserHostRouteId]?.surfaceInstanceId ?? null,
  )
  const activeDetachedBrowserSurface = useMemo(
    () =>
      Object.values(detachedSlotSurfaceById).find((surface) => surface.surfaceKind === 'browser') ?? null,
    [detachedSlotSurfaceById],
  )
  const activeDetachedConsoleSurface = useMemo(
    () =>
      Object.values(detachedSlotSurfaceById).find((surface) => surface.surfaceKind === 'console') ?? null,
    [detachedSlotSurfaceById],
  )
  const workspaceSplitMenuTargetSurfaceKind =
    workspaceSplitMenuTargetSurfaceInstanceId === null
      ? null
      : editorViewportsById[workspaceSplitMenuTargetSurfaceInstanceId] !== undefined
        ? 'spaghettiEditor'
        : activeDetachedConsoleSurface?.surfaceInstanceId === workspaceSplitMenuTargetSurfaceInstanceId ||
            workspaceSplitMenuTargetSurfaceInstanceId === floatingConsoleCompatibilitySurfaceInstanceId
          ? 'console'
          : null
  const detachedViewerFloatingSurfaces = useMemo(
    () =>
      Object.values(detachedSlotSurfaceById).filter(
        (surface) => surface.surfaceKind === 'modelViewer' && surface.hostMode === 'floating',
      ),
    [detachedSlotSurfaceById],
  )
  const detachedViewerPopoutSurfaces = useMemo(
    () =>
      Object.values(detachedSlotSurfaceById).filter(
        (surface) => surface.surfaceKind === 'modelViewer' && surface.hostMode === 'popout',
      ),
    [detachedSlotSurfaceById],
  )
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

  useEffect(() => {
    if (viewportSpawnMenu === null) {
      return
    }
    viewportSpawnMenuInputRef.current?.focus()
    const handlePointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node | null
      if (targetNode !== null && viewportSpawnMenuRef.current?.contains(targetNode)) {
        return
      }
      setViewportSpawnMenu(null)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      setViewportSpawnMenu(null)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [viewportSpawnMenu])
  const rootLeftSplitSlotIds = useMemo(() => {
    const rootNode = viewportLayoutNodesById[viewportSlotRootNodeId] ?? null
    if (rootNode?.kind !== 'split' || rootNode.splitDockSide !== 'left') {
      return [] as string[]
    }
    return collectLeafSlotIdsFromLayoutNode(rootNode.firstChildId, viewportLayoutNodesById).filter(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
  }, [viewportLayoutNodesById, viewportSlotRootNodeId])
  const consoleWindowMode = useConsoleStore((state) => state.windowMode)
  const [suppressRuntimeProjectedDockedBrowserSurface, setSuppressRuntimeProjectedDockedBrowserSurface] =
    useState(false)
  const browserSlotCountRef = useRef(browserSlotCount)
  const [windowSettingsOpenByViewportId, setWindowSettingsOpenByViewportId] = useState<
    Record<string, boolean>
  >({})
  const suppressLegacyDockedBrowserSurface =
    browserToolbarOwnerSurfaceInstanceId === null || suppressRuntimeProjectedDockedBrowserSurface
  const suppressLegacyDockedConsoleSurface =
    consoleSlotCount > 0 || activeDetachedConsoleSurface !== null
  const primaryViewportSlotIsConstrained = useMemo(() => {
    const primarySlot = viewportSlotsById[defaultPrimaryViewportSlotId] ?? null
    if (primarySlot === null) {
      return isLeftDockViewportSplit
    }
    return (
      isLeftDockViewportSplit ||
      findParentSplitNodeIdForLayoutNode(primarySlot.leafNodeId, viewportLayoutNodesById) !== null
    )
  }, [isLeftDockViewportSplit, viewportLayoutNodesById, viewportSlotsById])

  const resolveViewerTargetSlotId = useCallback(() => {
    const targetViewerSlot =
      Object.values(viewportSlotsById).find(
        (slot) => slot.surfaceKind === 'modelViewer' && slot.surfaceInstanceId === primaryViewportId,
      ) ?? viewportSlotsById[defaultPrimaryViewportSlotId]
    return targetViewerSlot?.slotId ?? defaultPrimaryViewportSlotId
  }, [primaryViewportId, viewportSlotsById])

  const ensureLegacySplitViewMigrated = useCallback(
    (editorViewportId: string, splitDockSideForMigration: 'top' | 'right' | 'bottom' | 'left', ratio: number) => {
      const existingSlot = Object.values(useWorkspaceStore.getState().viewportSlotsById).find(
        (slot) =>
          slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === editorViewportId,
      )
      if (existingSlot === undefined) {
        splitWorkspaceSurfaceToSide(editorViewportId, splitDockSideForMigration, {
          preferredRatio: ratio,
          targetSlotId: resolveViewerTargetSlotId(),
        })
      }
      useSpaghettiStore.getState().setEditorViewportWindowMode(editorViewportId, 'expanded')
    },
    [resolveViewerTargetSlotId],
  )

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

  const activateSpaghettiWorkspaceContext = useCallback(
    (
      editorViewportId?: string,
      options?: {
        floatingShell?: boolean
        graphDocumentId?: string | null
        nodeId?: string | null
        mode?: 'graph' | 'node'
      },
    ) => {
      const nextEditorViewportId =
        editorViewportId !== undefined && editorViewportId.length > 0 ? editorViewportId : null
      if (nextEditorViewportId !== null) {
        setActiveEditorViewportId(nextEditorViewportId)
      }
      const spaghettiState = useSpaghettiStore.getState()
      const appState = useAppStore.getState()
      const targetEditorViewportId =
        nextEditorViewportId ??
        (spaghettiState.activeEditorViewportId.length > 0 ? spaghettiState.activeEditorViewportId : null)
      const targetViewport =
        targetEditorViewportId === null
          ? null
          : spaghettiState.editorViewportsById[targetEditorViewportId] ?? null
      const resolvedGraphDocumentId =
        options?.graphDocumentId !== undefined
          ? options.graphDocumentId
          : targetViewport?.graphDocumentId ?? null
      const resolvedNodeId =
        options?.nodeId !== undefined
          ? options.nodeId
          : targetEditorViewportId === null
            ? null
            : selectEditorViewportSelectedNodeId(spaghettiState, targetEditorViewportId)
      const resolvedMode = options?.mode ?? (resolvedNodeId === null ? 'graph' : 'node')
      if (options?.floatingShell === true) {
        setActiveFloatingShell('spaghetti')
      }
      setActiveSurface('spaghetti')
      if (resolvedGraphDocumentId !== null) {
        setWorkspaceSelectedTarget(
          resolvedNodeId === null
            ? {
                kind: 'graph-document',
                graphDocumentId: resolvedGraphDocumentId,
              }
            : {
                kind: 'graph-node',
                graphDocumentId: resolvedGraphDocumentId,
                nodeId: resolvedNodeId,
              },
        )
      }
      requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'spaghetti',
        mode: resolvedMode,
        graphDocumentId: resolvedGraphDocumentId,
        nodeId: resolvedNodeId,
        editorViewportId: targetEditorViewportId,
        selectedTarget: appState.workspaceSelection.selectedTarget,
      })
      requestConsoleContextSync('surface-activation')
    },
    [
      requestConsoleContextSync,
      requestConsoleWorkspaceContextHandoff,
      setWorkspaceSelectedTarget,
      setActiveEditorViewportId,
      setActiveFloatingShell,
      setActiveSurface,
    ],
  )

  const handleActivateSpaghettiFloatingWindow = useCallback((
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => {
    activateSpaghettiWorkspaceContext(editorViewportId, { floatingShell: true, ...target })
  }, [activateSpaghettiWorkspaceContext])

  const handleActivateSpaghettiSurface = useCallback((
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => {
    activateSpaghettiWorkspaceContext(editorViewportId, target)
  }, [activateSpaghettiWorkspaceContext])

  const handleActivateViewerSurface = useCallback((viewportId: string) => {
    setViewportSpawnMenu(null)
    setActiveFloatingShell(null)
    setActiveViewerViewportId(viewportId)
    setActiveViewer(viewportId)
    setActiveSurface('viewer')
    const appState = useAppStore.getState()
    requestConsoleWorkspaceContextHandoff({
      sourceSurface: 'viewer',
      mode: 'root',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: appState.workspaceSelection.selectedTarget,
    })
    if (sketchPlanePickSession !== null) {
      return
    }
    requestConsoleContextSync('surface-clear', 'viewer-activation')
  }, [
    requestConsoleContextSync,
    requestConsoleWorkspaceContextHandoff,
    setViewportSpawnMenu,
    setActiveViewerViewportId,
    setActiveSurface,
    sketchPlanePickSession,
  ])

  const handleOpenViewportSpawnMenu = useCallback(
    (viewportId: string, event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      handleActivateViewerSurface(viewportId)
      setViewportSpawnMenu({
        viewportId,
        x: event.clientX,
        y: event.clientY,
        query: '',
      })
    },
    [handleActivateViewerSurface],
  )

  const resolveViewportSpawnPosition = useCallback(
    (clientX: number, clientY: number) => {
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (viewportRect === undefined) {
        return { ...defaultBrowserFloatingPosition }
      }
      return {
        x: Math.max(24, Math.round(clientX - viewportRect.left + 20)),
        y: Math.max(24, Math.round(clientY - viewportRect.top + 20)),
      }
    },
    [],
  )

  const handleSpawnViewportSpaghettiEditor = useCallback(() => {
    const graphDocumentId = activeGraphDocumentId || graphDocumentOrder[0] || null
    if (graphDocumentId === null || viewportSpawnMenu === null) {
      return
    }
    const editorViewportId = openGraphDocumentInNewViewport(graphDocumentId)
    if (editorViewportId !== null) {
      setEditorViewportPosition(
        editorViewportId,
        resolveViewportSpawnPosition(viewportSpawnMenu.x, viewportSpawnMenu.y),
      )
      activateSpaghettiWorkspaceContext(editorViewportId, {
        graphDocumentId,
        mode: 'graph',
      })
    }
    setViewportSpawnMenu(null)
  }, [
    activeGraphDocumentId,
    activateSpaghettiWorkspaceContext,
    graphDocumentOrder,
    openGraphDocumentInNewViewport,
    resolveViewportSpawnPosition,
    setEditorViewportPosition,
    viewportSpawnMenu,
  ])

  const handleSpawnViewportBrowser = useCallback(() => {
    if (viewportSpawnMenu === null) {
      return
    }
    const spawnPosition = resolveViewportSpawnPosition(viewportSpawnMenu.x, viewportSpawnMenu.y)
    setBrowserFloatingSize(defaultBrowserFloatingSize)
    setBrowserFloatingPosition(spawnPosition)
    setIsBrowserPoppedOut(false)
    setIsBrowserViewportSplit(false)
    setBrowserFloating(true)
    setActiveFloatingShell('browser')
    setActiveSurface('browser')
    setViewportSpawnMenu(null)
  }, [
    resolveViewportSpawnPosition,
    setActiveSurface,
    setBrowserFloating,
    setBrowserFloatingPosition,
    setBrowserFloatingSize,
    setIsBrowserPoppedOut,
    setIsBrowserViewportSplit,
    viewportSpawnMenu,
  ])

  const handleActivateBrowserFloatingWindow = useCallback(() => {
    setActiveFloatingShell('browser')
    setActiveSurface('browser')
  }, [setActiveSurface])

  const requestAppShellSurfaceClear = useCallback(
    (source: ConsoleContextSyncSource) => {
      setActiveFloatingShell(null)
      setActiveSurface(null)
      requestConsoleContextSync('surface-clear', source)
    },
    [requestConsoleContextSync, setActiveSurface],
  )

  const viewportSpawnMenuItems = useMemo(() => {
    const normalizedQuery = viewportSpawnMenu?.query.trim().toLowerCase() ?? ''
    const items = [
      {
        id: 'spawn-spaghetti-editor',
        label: 'Spawn Spaghetti Editor',
        keywords: 'spaghetti editor graph',
        onSelect: handleSpawnViewportSpaghettiEditor,
      },
      {
        id: 'spawn-browser',
        label: 'Spawn Browser',
        keywords: 'browser panel',
        onSelect: handleSpawnViewportBrowser,
      },
    ]
    if (normalizedQuery.length === 0) {
      return items
    }
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.keywords.includes(normalizedQuery),
    )
  }, [handleSpawnViewportBrowser, handleSpawnViewportSpaghettiEditor, viewportSpawnMenu?.query])

  useEffect(() => {
    if (!hasFocusableSpaghettiSurface && workspaceActiveSurface === 'spaghetti') {
      requestAppShellSurfaceClear('lost-spaghetti-visibility')
    }
  }, [hasFocusableSpaghettiSurface, requestAppShellSurfaceClear, workspaceActiveSurface])

  useEffect(() => {
    if (!isBrowserFloating && !isBrowserPoppedOut && workspaceActiveSurface === 'browser') {
      setActiveFloatingShell(null)
    }
  }, [isBrowserFloating, isBrowserPoppedOut, workspaceActiveSurface])

  useEffect(() => {
    if (workspaceSplitMenu === null || workspaceSplitMenu.scope !== 'floating-titlebar') {
      setIsFloatingSplitSubmenuHovered(false)
      setIsFloatingSplitSubmenuLocked(false)
    }
  }, [workspaceSplitMenu])

  const isFloatingSplitSubmenuOpen = isFloatingSplitSubmenuLocked || isFloatingSplitSubmenuHovered

  const handleFloatingSplitSubmenuMouseEnter = useCallback(() => {
    if (isFloatingSplitSubmenuLocked) {
      return
    }
    setIsFloatingSplitSubmenuHovered(true)
  }, [isFloatingSplitSubmenuLocked])

  const handleFloatingSplitSubmenuMouseLeave = useCallback(() => {
    if (isFloatingSplitSubmenuLocked) {
      return
    }
    setIsFloatingSplitSubmenuHovered(false)
  }, [isFloatingSplitSubmenuLocked])

  const handleToggleFloatingSplitSubmenu = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsFloatingSplitSubmenuLocked((current) => {
        const nextValue = !current
        setIsFloatingSplitSubmenuHovered(nextValue)
        return nextValue
      })
    },
    [],
  )

  useEffect(() => {
    if (
      floatingShellActivationRequest === null ||
      floatingShellActivationRequest.seq === lastHandledFloatingShellActivationSeqRef.current
    ) {
      return
    }
    lastHandledFloatingShellActivationSeqRef.current = floatingShellActivationRequest.seq
    if (floatingShellActivationRequest.target === 'spaghetti') {
      if (hasVisibleSpaghettiInAppShell) {
        setActiveFloatingShell('spaghetti')
        setActiveSurface('spaghetti')
      }
      return
    }
    if (isBrowserFloating || isBrowserPoppedOut) {
      setActiveFloatingShell('browser')
      setActiveSurface('browser')
    }
  }, [
    floatingShellActivationRequest,
    hasVisibleSpaghettiInAppShell,
    isBrowserFloating,
    isBrowserPoppedOut,
    setActiveSurface,
  ])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        (target.closest('.SpaghettiFloatingWindow') !== null ||
          target.closest('.ViewportFrame--spaghettiEditor') !== null ||
          target.closest('.WorkspaceViewportSlotSurface--spaghetti') !== null ||
          target.closest('.BrowserFloatingWindow') !== null ||
          target.closest('.ViewportFrame--browser') !== null ||
          target.closest('.WorkspaceViewportSlotSurface--browser') !== null ||
          target.closest('.BrowserPanelRoot') !== null ||
          target.closest('.BrowserPanelBody') !== null ||
          target.closest('.BrowserTree') !== null ||
          target.closest('.ViewportWorkspaceHost') !== null ||
          target.closest('.ViewportViewerSurface') !== null)
      ) {
        return
      }
      if (workspaceActiveSurface === 'spaghetti' || workspaceActiveSurface === 'browser') {
        requestAppShellSurfaceClear('global-outside-click')
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [requestAppShellSurfaceClear, workspaceActiveSurface])

  useEffect(() => {
    if (hasHydratedWorkspacePersistenceRef.current) {
      return
    }
    hasHydratedWorkspacePersistenceRef.current = true
    const persistedLayout = readPersistedWorkspaceLayout()
    if (persistedLayout !== null) {
      const shouldRestorePersistedLayout =
        typeof window.confirm !== 'function' ||
        window.confirm('Restore your saved workspace layout? Click Cancel to start fresh.')
      if (shouldRestorePersistedLayout) {
        hydratePersistedWorkspaceLayout(persistedLayout)
        const spaghettiState = useSpaghettiStore.getState()
        const legacySplitPlacements: Array<{
          editorViewportId: string
          splitDockSide: 'top' | 'right' | 'bottom' | 'left'
          splitRatio: number
        }> = []
        for (const [editorViewportId, placement] of Object.entries(
          persistedLayout.editorSurfacePlacementById,
        )) {
          if (spaghettiState.editorViewportsById[editorViewportId] === undefined) {
            continue
          }
          spaghettiState.setEditorViewportPosition(editorViewportId, placement.position)
          spaghettiState.setEditorViewportSize(editorViewportId, placement.size)
          spaghettiState.setEditorViewportSplitRatio(editorViewportId, placement.splitRatio)
          spaghettiState.setEditorViewportSplitDirection(editorViewportId, placement.splitDirection)
          spaghettiState.setEditorViewportSplitDockSide(editorViewportId, placement.splitDockSide)
          spaghettiState.setEditorViewportSplitPriority(editorViewportId, placement.splitPriority)
          if (placement.windowMode === 'split view') {
            const splitDockSideForMigration =
              placement.splitDirection === 'vertical'
                ? placement.splitDockSide === 'left' || placement.splitDockSide === 'right'
                  ? placement.splitDockSide
                  : 'left'
                : placement.splitDockSide
            legacySplitPlacements.push({
              editorViewportId,
              splitDockSide: splitDockSideForMigration,
              splitRatio: placement.splitRatio,
            })
            spaghettiState.setEditorViewportWindowMode(editorViewportId, 'expanded')
            continue
          }
          spaghettiState.setEditorViewportWindowMode(editorViewportId, placement.windowMode)
        }
        for (const placement of legacySplitPlacements) {
          ensureLegacySplitViewMigrated(
            placement.editorViewportId,
            placement.splitDockSide,
            placement.splitRatio,
          )
        }
      }
    }
    writePersistedWorkspaceLayout(serializeWorkspaceLayout(useWorkspaceStore.getState()))
  }, [ensureLegacySplitViewMigrated, hydratePersistedWorkspaceLayout])

  useEffect(() => {
    for (const [editorViewportId, viewport] of Object.entries(editorViewportsById ?? {})) {
      if (viewport.windowMode !== 'split view') {
        continue
      }
      const splitDockSideForMigration =
        viewport.splitDirection === 'vertical'
          ? viewport.splitDockSide === 'left' || viewport.splitDockSide === 'right'
            ? viewport.splitDockSide
            : 'left'
          : viewport.splitDockSide ?? 'bottom'
      ensureLegacySplitViewMigrated(editorViewportId, splitDockSideForMigration, viewport.splitRatio ?? 0.5)
    }
  }, [editorViewportSplitViewSignature, ensureLegacySplitViewMigrated, viewportSlotsById])

  useEffect(() => {
    const unsubscribe = useWorkspaceStore.subscribe((state) => {
      if (!hasHydratedWorkspacePersistenceRef.current) {
        return
      }
      writePersistedWorkspaceLayout(serializeWorkspaceLayout(state))
    })
    return unsubscribe
  }, [])

  const handleSetEditorViewportWindowSettingsOpen = useCallback(
    (editorViewportId: string, isOpen: boolean) => {
      setWindowSettingsOpenByViewportId((current) => ({
        ...current,
        [editorViewportId]: isOpen,
      }))
    },
    [],
  )

  useEffect(() => {
    if (!isBrowserViewportSplit || browserSlotCount > 0) {
      return
    }
    if (activeDetachedBrowserSurface !== null) {
      restoreDetachedSurfaceByKind('browser', {
        splitDockSide: browserViewportSplitDockSide,
      })
      setIsBrowserViewportSplit(false)
      return
    }
    splitViewportSlot(defaultPrimaryViewportSlotId, browserViewportSplitDockSide, {
      surfaceKind: 'browser',
      preferredRatio: browserViewportSplitRatio,
    })
  }, [
    activeDetachedBrowserSurface,
    browserSlotCount,
    browserViewportSplitDockSide,
    browserViewportSplitRatio,
    isBrowserViewportSplit,
    restoreDetachedSurfaceByKind,
    setIsBrowserViewportSplit,
    splitViewportSlot,
  ])

  useEffect(() => {
    if (
      activeDetachedBrowserSurface === null ||
      isBrowserFloating ||
      isBrowserPoppedOut ||
      isBrowserViewportSplit ||
      browserSlotCount > 0
    ) {
      return
    }
    restoreDetachedSurfaceByKind('browser')
  }, [
    activeDetachedBrowserSurface,
    browserSlotCount,
    isBrowserFloating,
    isBrowserPoppedOut,
    isBrowserViewportSplit,
    restoreDetachedSurfaceByKind,
  ])

  useEffect(() => {
    if (activeDetachedConsoleSurface === null || consoleWindowMode !== 'docked' || consoleSlotCount > 0) {
      return
    }
    restoreDetachedSurfaceByKind('console')
  }, [activeDetachedConsoleSurface, consoleSlotCount, consoleWindowMode, restoreDetachedSurfaceByKind])

  const handleFloatingSplitMenu = useCallback(
    (surfaceInstanceId: string, event: ReactMouseEvent<HTMLDivElement>) => {
      if (
        editorViewportsById[surfaceInstanceId] === undefined &&
        surfaceInstanceId !== floatingConsoleCompatibilitySurfaceInstanceId &&
        activeDetachedConsoleSurface?.surfaceInstanceId !== surfaceInstanceId
      ) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setIsFloatingSplitSubmenuHovered(false)
      setIsFloatingSplitSubmenuLocked(false)
      setWorkspaceSplitMenu({
        x: event.clientX,
        y: event.clientY,
        scope: 'floating-titlebar',
        targetSurfaceInstanceId: surfaceInstanceId,
      })
    },
    [activeDetachedConsoleSurface, editorViewportsById, setWorkspaceSplitMenu],
  )

  const handleCommitFloatingSurfaceSplit = useCallback(
    (
      splitDockSide: WorkspaceSplitDockSide,
      scope: 'local' | 'global',
    ) => {
      if (workspaceSplitMenuTargetSurfaceInstanceId === null) {
        return
      }
      if (workspaceSplitMenuTargetSurfaceKind === 'console') {
        const preferredRatio = 0.5
        if (scope === 'local') {
          commitWorkspaceSurfaceSlotSplit(
            workspaceSplitMenuTargetSurfaceInstanceId,
            resolveViewerTargetSlotId(),
            splitDockSide,
            {
              preferredRatio,
            },
          )
        } else {
          commitWorkspaceSurfaceRootSplit(workspaceSplitMenuTargetSurfaceInstanceId, splitDockSide, {
            preferredRatio,
          })
        }
        setWorkspaceSplitMenu(null)
        setIsFloatingSplitSubmenuHovered(false)
        setIsFloatingSplitSubmenuLocked(false)
        return
      }
      if (workspaceSplitMenuTargetEditorViewport === null) {
        return
      }
      const editorViewportId = workspaceSplitMenuTargetEditorViewport.editorViewportId
      const preferredRatio =
        workspaceSplitMenuTargetEditorSurface?.splitRatio ??
        workspaceSplitMenuTargetEditorViewport.splitRatio ??
        splitRatio
      setEditorViewportSplitDirection(
        editorViewportId,
        resolveWorkspaceSplitDirectionForDockSide(splitDockSide),
      )
      if (scope === 'local') {
        commitWorkspaceSurfaceSlotSplit(
          editorViewportId,
          resolveViewerTargetSlotId(),
          splitDockSide,
          {
            preferredRatio,
          },
        )
      } else {
        commitWorkspaceSurfaceRootSplit(editorViewportId, splitDockSide, {
          preferredRatio,
        })
      }
      setEditorViewportWindowMode(editorViewportId, 'expanded')
      setWorkspaceSplitMenu(null)
      setIsFloatingSplitSubmenuHovered(false)
      setIsFloatingSplitSubmenuLocked(false)
    },
    [
      commitWorkspaceSurfaceRootSplit,
      commitWorkspaceSurfaceSlotSplit,
      resolveViewerTargetSlotId,
      setEditorViewportSplitDirection,
      setEditorViewportWindowMode,
      setWorkspaceSplitMenu,
      splitRatio,
      workspaceSplitMenuTargetEditorSurface,
      workspaceSplitMenuTargetEditorViewport,
      workspaceSplitMenuTargetSurfaceInstanceId,
      workspaceSplitMenuTargetSurfaceKind,
    ],
  )

  const handleSelectFloatingSurfaceSplitDockSide = useCallback(
    (splitDockSide: WorkspaceSplitDockSide) => {
      if (workspaceSplitMenuTargetSurfaceInstanceId === null) {
        return
      }
      if (
        workspaceSplitMenuTargetSurfaceKind === 'console' ||
        workspaceSplitMenuTargetSurfaceKind === 'spaghettiEditor'
      ) {
        splitWorkspaceSurfaceToSide(workspaceSplitMenuTargetSurfaceInstanceId, splitDockSide, {
          preferredRatio: 0.5,
          targetSlotId: resolveViewerTargetSlotId(),
        })
        setWorkspaceSplitMenu(null)
        setIsFloatingSplitSubmenuHovered(false)
        setIsFloatingSplitSubmenuLocked(false)
        return
      }
      setWorkspaceSplitMenu(null)
      setIsFloatingSplitSubmenuHovered(false)
      setIsFloatingSplitSubmenuLocked(false)
    },
    [
      resolveViewerTargetSlotId,
      setWorkspaceSplitMenu,
      splitWorkspaceSurfaceToSide,
      workspaceSplitMenuTargetSurfaceInstanceId,
      workspaceSplitMenuTargetSurfaceKind,
    ],
  )

  const handleResetSplitRatio = useCallback(() => {
    if (workspaceSplitMenuTargetEditorViewport === null) {
      return
    }
    if (workspaceSplitMenuTargetEditorSlot !== null) {
      const parentSplitNodeId = findParentSplitNodeIdForLayoutNode(
        workspaceSplitMenuTargetEditorSlot.leafNodeId,
        viewportLayoutNodesById,
      )
      if (parentSplitNodeId !== null) {
        setViewportLayoutSplitRatio(parentSplitNodeId, 0.5)
      }
    } else {
      setEditorViewportSplitRatio(workspaceSplitMenuTargetEditorViewport.editorViewportId, 0.5)
    }
    setWorkspaceSplitMenu(null)
  }, [
    setEditorViewportSplitRatio,
    setWorkspaceSplitMenu,
    setViewportLayoutSplitRatio,
    viewportLayoutNodesById,
    workspaceSplitMenuTargetEditorSlot,
    workspaceSplitMenuTargetEditorViewport,
  ])

  const handleSetSplitPriority = useCallback(
    (nextPriority: WorkspaceSplitPriority) => {
      if (workspaceSplitMenuTargetEditorViewport === null) {
        return
      }
      setEditorViewportSplitPriority(workspaceSplitMenuTargetEditorViewport.editorViewportId, nextPriority)
      setWorkspaceSplitMenu(null)
    },
    [setEditorViewportSplitPriority, setWorkspaceSplitMenu, workspaceSplitMenuTargetEditorViewport],
  )

  const handleCloseSplitFromMenu = useCallback(() => {
    if (workspaceSplitMenuTargetEditorViewport === null) {
      return
    }
    if (workspaceSplitMenuTargetEditorSlot !== null) {
      removeViewportSlot(workspaceSplitMenuTargetEditorSlot.slotId)
    }
    setEditorViewportWindowMode(workspaceSplitMenuTargetEditorViewport.editorViewportId, 'expanded')
    setWorkspaceSplitMenu(null)
  }, [
    removeViewportSlot,
    setEditorViewportWindowMode,
    setWorkspaceSplitMenu,
    workspaceSplitMenuTargetEditorSlot,
    workspaceSplitMenuTargetEditorViewport,
  ])

  const handleCloseSurfaceFromFloatingMenu = useCallback(() => {
    if (workspaceSplitMenuTargetSurfaceKind === 'console') {
      useConsoleStore.getState().switchToDocked(false)
      setWorkspaceSplitMenu(null)
      setIsFloatingSplitSubmenuHovered(false)
      setIsFloatingSplitSubmenuLocked(false)
      return
    }
    if (workspaceSplitMenuTargetEditorViewport === null) {
      return
    }
    closeEditorViewport(workspaceSplitMenuTargetEditorViewport.editorViewportId)
    setWorkspaceSplitMenu(null)
    setIsFloatingSplitSubmenuHovered(false)
    setIsFloatingSplitSubmenuLocked(false)
  }, [
    closeEditorViewport,
    setWorkspaceSplitMenu,
    workspaceSplitMenuTargetEditorViewport,
    workspaceSplitMenuTargetSurfaceKind,
  ])

  const handleCloseViewportSlotFromMenu = useCallback(
    (slotId: string) => {
      const slot = viewportSlotsById[slotId] ?? null
      if (slot === null || slotId === defaultPrimaryViewportSlotId) {
        return
      }
      removeViewportSlot(slotId)
      if (slot.surfaceKind === 'spaghettiEditor') {
        closeEditorViewport(slot.surfaceInstanceId)
        return
      }
      if (slot.surfaceKind === 'browser') {
        if (browserSlotCount <= 1 && isBrowserViewportSplit) {
          setIsBrowserViewportSplit(false)
        }
        return
      }
      if (slot.surfaceKind === 'console') {
        useConsoleStore.getState().switchToDocked(false)
      }
    },
    [
      browserSlotCount,
      closeEditorViewport,
      isBrowserViewportSplit,
      removeViewportSlot,
      setIsBrowserViewportSplit,
      viewportSlotsById,
    ],
  )

  const createDuplicatedEditorSurfaceInstanceId = useCallback(
    (sourceSurfaceInstanceId?: string | null) => {
      const spaghettiState = useSpaghettiStore.getState()
      const preferredGraphDocumentId =
        (sourceSurfaceInstanceId !== undefined && sourceSurfaceInstanceId !== null
          ? editorSurfaceBindingById[sourceSurfaceInstanceId]?.graphDocumentId
          : undefined) ??
        activeEditorViewport?.graphDocumentId ??
        spaghettiState.activeGraphDocumentId ??
        spaghettiState.graphDocumentOrder?.[0] ??
        null
      if (preferredGraphDocumentId === null || preferredGraphDocumentId === undefined) {
        return null
      }
      return spaghettiState.openGraphDocumentInNewViewport?.(preferredGraphDocumentId) ?? null
    },
    [activeEditorViewport?.graphDocumentId, editorSurfaceBindingById],
  )

  const resolveEditorSurfaceInstanceIdForSlotSwitch = useCallback(
    (currentSlot: {
      surfaceInstanceId: string
      retainedSurfaceInstanceIdsByKind: Partial<Record<'modelViewer' | 'browser' | 'console' | 'spaghettiEditor', string>>
    }) => {
      const isReusableUnboundEditorViewport = (editorViewportId: string) => {
        const viewport = editorViewportsById[editorViewportId] ?? null
        if (viewport === null) {
          return false
        }
        const isSlotted = Object.values(viewportSlotsById).some(
          (slot) =>
            slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === editorViewportId,
        )
        if (isSlotted) {
          return false
        }
        const placement = editorSurfacePlacementById[editorViewportId] ?? null
        const windowMode = viewport.windowMode ?? placement?.windowMode
        return !(
          windowMode === 'expanded' ||
          windowMode === 'maximized' ||
          windowMode === 'collapsed' ||
          windowMode === 'meatball editor view' ||
          windowMode === 'separateWindow'
        )
      }

      const retainedEditorViewportId =
        currentSlot.retainedSurfaceInstanceIdsByKind.spaghettiEditor ?? null
      if (
        retainedEditorViewportId !== null &&
        isReusableUnboundEditorViewport(retainedEditorViewportId)
      ) {
        return retainedEditorViewportId
      }

      return createDuplicatedEditorSurfaceInstanceId(currentSlot.surfaceInstanceId)
    },
    [
      createDuplicatedEditorSurfaceInstanceId,
      editorSurfacePlacementById,
      editorViewportsById,
      viewportSlotsById,
    ],
  )

  const handleViewportSlotSplit = useCallback(
    (slotId: string, splitDockSide: 'top' | 'right' | 'bottom' | 'left') => {
      const sourceSlot = viewportSlotsById[slotId] ?? null
      if (sourceSlot === null) {
        return
      }
      const sourceSlotFrame = appShellRef.current?.querySelector(
        `[data-workspace-slot-id="${slotId}"]`,
      )
      const sourceSlotFrameRect =
        sourceSlotFrame instanceof HTMLElement ? sourceSlotFrame.getBoundingClientRect() : null
      const preferredBrowserSideSplitRatio =
        sourceSlot.surfaceKind === 'browser' &&
        (splitDockSide === 'left' || splitDockSide === 'right') &&
        sourceSlotFrameRect !== null &&
        sourceSlotFrameRect.width > 0
          ? defaultBrowserFloatingSize.width / sourceSlotFrameRect.width
          : undefined
      const nextSurfaceInstanceId =
        sourceSlot.surfaceKind === 'spaghettiEditor'
          ? createDuplicatedEditorSurfaceInstanceId(sourceSlot.surfaceInstanceId)
          : null
      const sourceViewer =
        sourceSlot.surfaceKind === 'modelViewer'
          ? getViewer(sourceSlot.surfaceInstanceId)
          : null
      const sourceCameraPose =
        sourceSlot.surfaceKind === 'modelViewer'
          ? typeof sourceViewer?.getCameraPose === 'function'
            ? sourceViewer.getCameraPose()
            : getLatestViewerCameraPose(sourceSlot.surfaceInstanceId)
          : null
      const nextSlotId = splitViewportSlot(slotId, splitDockSide, {
        surfaceKind: sourceSlot.surfaceKind,
        ...(nextSurfaceInstanceId === null ? {} : { surfaceInstanceId: nextSurfaceInstanceId }),
        ...(preferredBrowserSideSplitRatio === undefined
          ? {}
          : { preferredRatio: preferredBrowserSideSplitRatio }),
      })
      if (sourceSlot.surfaceKind === 'modelViewer' && sourceCameraPose !== null) {
        restoreViewerCameraPose(sourceSlot.surfaceInstanceId, sourceCameraPose)
      }
      if (sourceSlot.surfaceKind === 'modelViewer' && nextSlotId !== null && sourceCameraPose !== null) {
        const nextSlot = useWorkspaceStore.getState().viewportSlotsById[nextSlotId] ?? null
        if (nextSlot !== null) {
          restoreViewerCameraPose(nextSlot.surfaceInstanceId, sourceCameraPose)
        }
      }
    },
    [
      appShellRef,
      createDuplicatedEditorSurfaceInstanceId,
      getViewer,
      restoreViewerCameraPose,
      splitViewportSlot,
      viewportSlotsById,
    ],
  )

  const handleViewportSlotSurfaceKindChange = useCallback(
    (slotId: string, nextSurfaceKind: 'modelViewer' | 'browser' | 'console' | 'spaghettiEditor') => {
      const currentSlot = viewportSlotsById[slotId] ?? null
      if (currentSlot === null) {
        return
      }
      if (slotId === defaultPrimaryViewportSlotId) {
        return
      }
      const nextSurfaceInstanceId =
        nextSurfaceKind === 'spaghettiEditor'
          ? resolveEditorSurfaceInstanceIdForSlotSwitch(currentSlot)
          : null
      const isDestructiveSpaghettiReplace =
        currentSlot.surfaceKind === 'spaghettiEditor' && nextSurfaceKind !== 'spaghettiEditor'
      setViewportSlotSurfaceKind(slotId, nextSurfaceKind, {
        ...(nextSurfaceInstanceId === null ? {} : { surfaceInstanceId: nextSurfaceInstanceId }),
        ...(isDestructiveSpaghettiReplace
          ? { discardRetainedSurfaceKinds: ['spaghettiEditor' as const] }
          : {}),
      })
      if (isDestructiveSpaghettiReplace) {
        closeEditorViewport(currentSlot.surfaceInstanceId)
      }
      if (currentSlot.surfaceKind === 'browser' && browserSlotCount <= 1 && isBrowserViewportSplit) {
        setIsBrowserViewportSplit(false)
      }
    },
    [
      browserSlotCount,
      closeEditorViewport,
      isBrowserViewportSplit,
      resolveEditorSurfaceInstanceIdForSlotSwitch,
      setIsBrowserViewportSplit,
      setViewportSlotSurfaceKind,
      viewportSlotsById,
    ],
  )

  const handleViewportSlotFloat = useCallback(
    (
      slotId: string,
      options?: {
        preserveBrowserFloatingShell?: boolean
      },
    ) => {
      const slot = viewportSlotsById[slotId] ?? null
      if (slot === null || slotId === defaultPrimaryViewportSlotId) {
        return
      }
      if (slot.surfaceKind === 'browser') {
        if (browserSlotCount <= 1) {
          setIsBrowserViewportSplit(false)
        }
        if (options?.preserveBrowserFloatingShell !== true) {
          setBrowserFloatingSize(defaultBrowserFloatingSize)
          setBrowserFloatingPosition(defaultBrowserFloatingPosition)
        }
        floatWorkspaceSurface(slot.surfaceInstanceId)
        return
      }
      if (slot.surfaceKind === 'modelViewer') {
        detachViewportSlotSurface(slotId, 'floating')
        setActiveViewerViewportId(slot.surfaceInstanceId)
        setActiveViewer(slot.surfaceInstanceId)
        setActiveSurface('viewer')
        return
      }
      floatWorkspaceSurface(slot.surfaceInstanceId)
    },
    [
      browserSlotCount,
      detachViewportSlotSurface,
      floatWorkspaceSurface,
      setActiveSurface,
      setActiveViewerViewportId,
      setIsBrowserViewportSplit,
      viewportSlotsById,
    ],
  )

  const resolveConsoleTransitionViewportBounds = useCallback(() => {
    const viewportElement = viewportRef.current
    const shellRect = appShellRef.current?.getBoundingClientRect()
    const viewportRect = viewportElement?.getBoundingClientRect()
    const primaryViewportBodyElement = viewportElement?.querySelector(
      '.ViewportFrame.isPrimarySlot .ViewportFrameBody',
    ) as HTMLElement | null
    const primaryViewportBodyRect = primaryViewportBodyElement?.getBoundingClientRect()
    const viewportWidth =
      shellRect?.width ??
      viewportRect?.width ??
      viewportElement?.clientWidth ??
      window.innerWidth
    const viewportHeight =
      shellRect?.height ??
      viewportRect?.height ??
      viewportElement?.clientHeight ??
      window.innerHeight

    if (
      shellRect === undefined ||
      primaryViewportBodyRect === undefined ||
      primaryViewportBodyRect.width <= 0 ||
      primaryViewportBodyRect.height <= 0
    ) {
      return {
        viewportWidth,
        viewportHeight,
        bounds: undefined,
      }
    }

    return {
      viewportWidth,
      viewportHeight,
      bounds: {
        minX: primaryViewportBodyRect.left - shellRect.left,
        minY: primaryViewportBodyRect.top - shellRect.top,
        maxX: primaryViewportBodyRect.right - shellRect.left,
        maxY: primaryViewportBodyRect.bottom - shellRect.top,
      },
    }
  }, [])

  const resolveConsoleTransitionSplitDockPreview = useCallback(
    (pointerClientX: number, pointerClientY: number): WorkspaceSplitDockPreview | null =>
      resolveWorkspaceSplitDockPreview(
        viewportRef.current,
        viewportSlotsById,
        pointerClientX,
        pointerClientY,
      ),
    [viewportSlotsById],
  )

  const commitConsoleTransitionWorkspaceSplit = useCallback(
    (surfaceInstanceId: string, preview: WorkspaceSplitDockPreview) => {
      if (preview.scope === 'global') {
        commitWorkspaceSurfaceRootSplit(surfaceInstanceId, preview.side)
        return
      }
      if (preview.targetSlotId === null) {
        return
      }
      commitWorkspaceSurfaceSlotSplit(surfaceInstanceId, preview.targetSlotId, preview.side)
    },
    [],
  )

  const stopConsoleTransitionDrag = useCallback(() => {
    consoleTransitionDragCleanupRef.current?.()
  }, [])

  useEffect(() => () => stopConsoleTransitionDrag(), [stopConsoleTransitionDrag])

  const consoleTransitionSplitDockGhostStyle = useMemo(() => {
    if (consoleTransitionSplitDockPreview === null) {
      return null
    }
    const previewRatio = 0.25
    const horizontalPreviewWidth = Math.max(
      0,
      consoleTransitionSplitDockPreview.rect.width * previewRatio - splitDividerHeight,
    )
    const verticalPreviewHeight = Math.max(
      0,
      consoleTransitionSplitDockPreview.rect.height * previewRatio - splitDividerHeight,
    )

    if (consoleTransitionSplitDockPreview.side === 'bottom') {
      return {
        left: `${consoleTransitionSplitDockPreview.rect.left}px`,
        top: `${
          consoleTransitionSplitDockPreview.rect.top +
          consoleTransitionSplitDockPreview.rect.height * (1 - previewRatio) +
          splitDividerHeight
        }px`,
        width: `${consoleTransitionSplitDockPreview.rect.width}px`,
        height: `${verticalPreviewHeight}px`,
        right: 'auto',
        bottom: 'auto',
      } satisfies CSSProperties
    }
    if (consoleTransitionSplitDockPreview.side === 'top') {
      return {
        left: `${consoleTransitionSplitDockPreview.rect.left}px`,
        top: `${consoleTransitionSplitDockPreview.rect.top}px`,
        width: `${consoleTransitionSplitDockPreview.rect.width}px`,
        height: `${verticalPreviewHeight}px`,
        right: 'auto',
        bottom: 'auto',
      } satisfies CSSProperties
    }
    if (consoleTransitionSplitDockPreview.side === 'right') {
      return {
        left: `${
          consoleTransitionSplitDockPreview.rect.left +
          consoleTransitionSplitDockPreview.rect.width * (1 - previewRatio) +
          splitDividerHeight
        }px`,
        top: `${consoleTransitionSplitDockPreview.rect.top}px`,
        width: `${horizontalPreviewWidth}px`,
        height: `${consoleTransitionSplitDockPreview.rect.height}px`,
        right: 'auto',
        bottom: 'auto',
      } satisfies CSSProperties
    }
    return {
      left: `${consoleTransitionSplitDockPreview.rect.left}px`,
      top: `${consoleTransitionSplitDockPreview.rect.top}px`,
      width: `${horizontalPreviewWidth}px`,
      height: `${consoleTransitionSplitDockPreview.rect.height}px`,
      right: 'auto',
      bottom: 'auto',
    } satisfies CSSProperties
  }, [consoleTransitionSplitDockPreview])

  const handleViewportSlotHeaderDragOut = useCallback(
    (
      slotId: string,
      payload: {
        pointerId: number
        clientX: number
        clientY: number
        frameRect: DOMRect
        headerRect: DOMRect
      },
    ) => {
      const slot = viewportSlotsById[slotId] ?? null
      if (slot === null || slotId === defaultPrimaryViewportSlotId) {
        return
      }
      if (slot.surfaceKind === 'browser') {
        const shellRect = appShellRef.current?.getBoundingClientRect()
        const pointerOffsetX = Math.min(
          Math.max(16, Math.round(payload.clientX - payload.frameRect.left)),
          Math.max(16, defaultBrowserFloatingSize.width - 16),
        )
        const pointerOffsetY = Math.min(
          Math.max(0, Math.round(payload.clientY - payload.frameRect.top)),
          Math.max(1, Math.round(payload.headerRect.height)) - 1,
        )
        if (shellRect !== undefined) {
          setBrowserFloatingSize(defaultBrowserFloatingSize)
          setBrowserFloatingPosition({
            x: Math.round(payload.clientX - shellRect.left - pointerOffsetX),
            y: Math.round(payload.clientY - shellRect.top - pointerOffsetY),
          })
        } else {
          setBrowserFloatingSize(defaultBrowserFloatingSize)
          setBrowserFloatingPosition(defaultBrowserFloatingPosition)
        }
        setBrowserSlotHeaderDragSeed({
          pointerId: payload.pointerId,
          clientX: payload.clientX,
          clientY: payload.clientY,
          pointerOffsetX,
          pointerOffsetY,
          titleBarHeight: Math.max(1, Math.round(payload.headerRect.height)),
        })
      } else if (slot.surfaceKind === 'spaghettiEditor') {
        const spaghettiViewport =
          useSpaghettiStore.getState().editorViewportsById[slot.surfaceInstanceId] ?? null
        const floatingSize = spaghettiViewport?.size ?? {
          width: Math.max(1, Math.round(payload.frameRect.width)),
          height: Math.max(1, Math.round(payload.frameRect.height)),
        }
        const pointerOffsetX = Math.min(
          Math.max(16, Math.round(payload.clientX - payload.frameRect.left)),
          Math.max(16, floatingSize.width - 16),
        )
        const pointerOffsetY = Math.min(
          Math.max(0, Math.round(payload.clientY - payload.frameRect.top)),
          Math.max(1, Math.round(payload.headerRect.height)) - 1,
        )
        setSpaghettiSlotHeaderDragSeed({
          pointerId: payload.pointerId,
          clientX: payload.clientX,
          clientY: payload.clientY,
          pointerOffsetX,
          pointerOffsetY,
          titleBarHeight: Math.max(1, Math.round(payload.headerRect.height)),
        })
      } else if (slot.surfaceKind === 'console') {
        const floatingRect = useConsoleStore.getState().floatingRect
        const floatingSize = {
          width: Math.max(1, Math.round(floatingRect.width)),
          height: Math.max(1, Math.round(floatingRect.height)),
        }
        const pointerOffsetX = Math.min(
          Math.max(16, Math.round(payload.clientX - payload.frameRect.left)),
          Math.max(16, floatingSize.width - 16),
        )
        const pointerOffsetY = Math.min(
          Math.max(0, Math.round(payload.clientY - payload.frameRect.top)),
          Math.max(1, Math.round(payload.headerRect.height)) - 1,
        )
        const shellRect = appShellRef.current?.getBoundingClientRect()
        const { viewportWidth, viewportHeight, bounds } = resolveConsoleTransitionViewportBounds()
        const nextFloatingRect = clampConsoleTransitionFloatingRect(
          {
            ...floatingRect,
            ...floatingSize,
            x:
              shellRect === undefined
                ? floatingRect.x
                : Math.round(payload.clientX - shellRect.left - pointerOffsetX),
            y:
              shellRect === undefined
                ? floatingRect.y
                : Math.round(payload.clientY - shellRect.top - pointerOffsetY),
          },
          viewportWidth,
          viewportHeight,
          bounds,
        )
        stopConsoleTransitionDrag()
        consoleTransitionSplitDockPreviewRef.current = null
        setConsoleTransitionSplitDockPreview(null)
        setIsConsoleTransitionDragActive(true)
        setConsoleFloatingRect(nextFloatingRect)
        floatWorkspaceSurface(slot.surfaceInstanceId)

        let isStopped = false
        const move = (moveEvent: PointerEvent) => {
          if (moveEvent.pointerId !== payload.pointerId) {
            return
          }
          const nextBounds = resolveConsoleTransitionViewportBounds()
          setConsoleFloatingRect(
            clampConsoleTransitionFloatingRect(
              {
                ...nextFloatingRect,
                x:
                  shellRect === undefined
                    ? nextFloatingRect.x
                    : Math.round(moveEvent.clientX - shellRect.left - pointerOffsetX),
                y:
                  shellRect === undefined
                    ? nextFloatingRect.y
                    : Math.round(moveEvent.clientY - shellRect.top - pointerOffsetY),
              },
              nextBounds.viewportWidth,
              nextBounds.viewportHeight,
              nextBounds.bounds,
            ),
          )
          const nextSplitDockPreview = resolveConsoleTransitionSplitDockPreview(
            moveEvent.clientX,
            moveEvent.clientY,
          )
          consoleTransitionSplitDockPreviewRef.current = nextSplitDockPreview
          setConsoleTransitionSplitDockPreview(nextSplitDockPreview)
        }
        const stop = () => {
          if (isStopped) {
            return
          }
          isStopped = true
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', handlePointerUp)
          window.removeEventListener('pointercancel', handlePointerCancel)
          if (consoleTransitionDragCleanupRef.current === stop) {
            consoleTransitionDragCleanupRef.current = null
          }
          consoleTransitionSplitDockPreviewRef.current = null
          setConsoleTransitionSplitDockPreview(null)
          setIsConsoleTransitionDragActive(false)
        }
        const handlePointerUp = (upEvent: PointerEvent) => {
          if (upEvent.pointerId !== payload.pointerId) {
            return
          }
          const nextSplitDockPreview =
            consoleTransitionSplitDockPreviewRef.current ??
            resolveConsoleTransitionSplitDockPreview(upEvent.clientX, upEvent.clientY)
          stop()
          if (nextSplitDockPreview !== null) {
            commitConsoleTransitionWorkspaceSplit(slot.surfaceInstanceId, nextSplitDockPreview)
          }
        }
        const handlePointerCancel = (cancelEvent?: PointerEvent) => {
          if (
            cancelEvent !== undefined &&
            cancelEvent.pointerId !== payload.pointerId
          ) {
            return
          }
          stop()
        }

        consoleTransitionDragCleanupRef.current = stop
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', handlePointerUp)
        window.addEventListener('pointercancel', handlePointerCancel)
        const initialSplitDockPreview = resolveConsoleTransitionSplitDockPreview(
          payload.clientX,
          payload.clientY,
        )
        consoleTransitionSplitDockPreviewRef.current = initialSplitDockPreview
        setConsoleTransitionSplitDockPreview(initialSplitDockPreview)
        return
      }
      handleViewportSlotFloat(slotId, {
        preserveBrowserFloatingShell: slot.surfaceKind === 'browser',
      })
    },
    [
      appShellRef,
      clampConsoleTransitionFloatingRect,
      commitConsoleTransitionWorkspaceSplit,
      floatWorkspaceSurface,
      handleViewportSlotFloat,
      resolveConsoleTransitionSplitDockPreview,
      resolveConsoleTransitionViewportBounds,
      setBrowserFloatingPosition,
      setBrowserFloatingSize,
      setBrowserSlotHeaderDragSeed,
      setConsoleFloatingRect,
      setIsConsoleTransitionDragActive,
      setSpaghettiSlotHeaderDragSeed,
      stopConsoleTransitionDrag,
      viewportSlotsById,
    ],
  )

  const handleViewportSlotPopOut = useCallback(
    (slotId: string) => {
      const slot = viewportSlotsById[slotId] ?? null
      if (slot === null) {
        return
      }
      if (slot.surfaceKind === 'modelViewer' && slotId === defaultPrimaryViewportSlotId) {
        const detachedSurface = createDetachedViewportSurfaceCopy(slot.surfaceInstanceId, 'popout')
        if (detachedSurface !== null) {
          const sourceViewer = getViewer(slot.surfaceInstanceId)
          const sourceCameraPose =
            typeof sourceViewer?.getCameraPose === 'function'
              ? sourceViewer.getCameraPose()
              : getLatestViewerCameraPose(slot.surfaceInstanceId)
          if (sourceCameraPose !== null) {
            restoreViewerCameraPose(detachedSurface.surfaceInstanceId, sourceCameraPose)
          }
          setActiveViewerViewportId(detachedSurface.surfaceInstanceId)
          setActiveViewer(detachedSurface.surfaceInstanceId)
          setActiveSurface('viewer')
        }
        return
      }
      if (slotId === defaultPrimaryViewportSlotId) {
        return
      }
      if (slot.surfaceKind === 'browser') {
        setIsBrowserPoppedOut(true)
        return
      }
      popoutWorkspaceSurface(slot.surfaceInstanceId)
    },
    [
      createDetachedViewportSurfaceCopy,
      popoutWorkspaceSurface,
      setActiveSurface,
      setActiveViewerViewportId,
      setIsBrowserPoppedOut,
      viewportSlotsById,
    ],
  )

  const handleTogglePrimaryLeftDockSlotSplit = useCallback(() => {
    const primarySlotFrame = appShellRef.current?.querySelector(
      `[data-workspace-slot-id="${defaultPrimaryViewportSlotId}"]`,
    )
    const primarySlotFrameRect =
      primarySlotFrame instanceof HTMLElement ? primarySlotFrame.getBoundingClientRect() : null
    const preferredPrimaryBrowserSideSplitRatio =
      primarySlotFrameRect !== null && primarySlotFrameRect.width > 0
        ? defaultBrowserFloatingSize.width / primarySlotFrameRect.width
        : undefined
    if (isLeftDockViewportSplit) {
      let nextRootLeftSplitSlotIds = rootLeftSplitSlotIds
      while (nextRootLeftSplitSlotIds.length > 0) {
        removeViewportSlot(nextRootLeftSplitSlotIds[0])
        const nextWorkspaceState = useWorkspaceStore.getState()
        const nextRootNode =
          nextWorkspaceState.viewportLayoutNodesById[nextWorkspaceState.viewportSlotRootNodeId] ?? null
        if (nextRootNode?.kind !== 'split' || nextRootNode.splitDockSide !== 'left') {
          nextRootLeftSplitSlotIds = []
          break
        }
        nextRootLeftSplitSlotIds = collectLeafSlotIdsFromLayoutNode(
          nextRootNode.firstChildId,
          nextWorkspaceState.viewportLayoutNodesById,
        ).filter((slotId) => slotId !== defaultPrimaryViewportSlotId)
      }
      setIsLeftDockViewportSplit(false)
      setLeftDockResizeMenu(null)
      return
    }

    if (rootLeftSplitSlotIds.length > 0) {
      setViewportSlotSurfaceKind(rootLeftSplitSlotIds[0], 'browser')
      setIsLeftDockViewportSplit(true)
      setLeftDockResizeMenu(null)
      return
    }

    if (activeDetachedBrowserSurface !== null) {
      if (preferredPrimaryBrowserSideSplitRatio !== undefined) {
        setBrowserViewportSplitRatio(preferredPrimaryBrowserSideSplitRatio)
      }
      restoreDetachedSurfaceByKind('browser', {
        splitDockSide: 'left',
      })
    } else {
      splitViewportSlot(defaultPrimaryViewportSlotId, 'left', {
        surfaceKind: 'browser',
        ...(preferredPrimaryBrowserSideSplitRatio === undefined
          ? {}
          : { preferredRatio: preferredPrimaryBrowserSideSplitRatio }),
      })
    }
    setIsLeftDockViewportSplit(true)
    setLeftDockResizeMenu(null)
  }, [
    activeDetachedBrowserSurface,
    isLeftDockViewportSplit,
    restoreDetachedSurfaceByKind,
    removeViewportSlot,
    rootLeftSplitSlotIds,
    setBrowserViewportSplitRatio,
    setIsLeftDockViewportSplit,
    setLeftDockResizeMenu,
    setViewportSlotSurfaceKind,
    splitViewportSlot,
    appShellRef,
  ])

  const handleLeftDockSplitToggleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      handleTogglePrimaryLeftDockSlotSplit()
    },
    [handleTogglePrimaryLeftDockSlotSplit],
  )

  const newEditorSpawnPosition = useMemo(
    () => ({
      x: leftDockWidth + floatingDockLockGap,
      y: 16,
    }),
    [leftDockWidth],
  )

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

  const workspaceSplitMenuStyle =
    workspaceSplitMenu === null
      ? undefined
      : {
          left: `${Math.max(
            12,
            Math.min(
              workspaceSplitMenu.x,
              (typeof window === 'undefined' ? workspaceSplitMenu.x : window.innerWidth) - 240,
            ),
          )}px`,
          top: `${Math.max(
            12,
            Math.min(
              workspaceSplitMenu.y,
              (typeof window === 'undefined' ? workspaceSplitMenu.y : window.innerHeight) - 280,
            ),
          )}px`,
        }

  const consoleListLeftOffset = leftDockWidth

  const handleViewportLayoutDividerPointerDown = useCallback(
    (nodeId: string, event: ReactMouseEvent<HTMLButtonElement>) => {
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
        const nextRatio =
          splitNode.splitDirection === 'vertical'
            ? splitNode.splitDockSide === 'left'
              ? (moveEvent.clientX - splitRect.left) / splitRect.width
              : (splitRect.right - moveEvent.clientX) / splitRect.width
            : splitNode.splitDockSide === 'top'
              ? (moveEvent.clientY - splitRect.top) / splitRect.height
              : (splitRect.bottom - moveEvent.clientY) / splitRect.height
        setViewportLayoutSplitRatio(nodeId, nextRatio)
      }
      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }

      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    },
    [setViewportLayoutSplitRatio, viewportLayoutNodesById],
  )

  const renderViewportSlot = useCallback(
    (slotId: string) => {
      const slot = viewportSlotsById[slotId] ?? null
      if (slot === null) {
        return null
      }
      const isPrimarySlot = slot.slotId === defaultPrimaryViewportSlotId
      return (
        <ViewportFrame
          key={slot.slotId}
          slotId={slot.slotId}
          surfaceKind={slot.surfaceKind}
          isPrimary={isPrimarySlot}
          onActivateSurface={
            slot.surfaceKind === 'spaghettiEditor'
              ? () => handleActivateSpaghettiSurface(slot.surfaceInstanceId)
              : undefined
          }
          onPrimaryButtonClick={
            slot.surfaceKind === 'browser'
              ? () =>
                  setBrowserPresentationMode(
                    browserPresentationMode === 'expanded'
                      ? 'essentials'
                      : browserPresentationMode === 'essentials'
                        ? 'collapsed'
                        : 'expanded',
                  )
              : undefined
          }
          primaryButtonLabel={
            slot.surfaceKind === 'browser'
              ? browserPresentationMode === 'expanded'
                ? '-'
                : browserPresentationMode === 'essentials'
                  ? 'e'
                  : '+'
              : undefined
          }
          primaryButtonAriaLabel={
            slot.surfaceKind === 'browser'
              ? browserPresentationMode === 'expanded'
                ? 'Browser essentials'
                : browserPresentationMode === 'essentials'
                  ? 'Collapse browser'
                  : 'Expand browser'
              : undefined
          }
          primaryButtonTitle={
            slot.surfaceKind === 'browser'
              ? browserPresentationMode === 'expanded'
                ? 'Browser essentials'
                : browserPresentationMode === 'essentials'
                  ? 'Collapse browser'
                  : 'Expand browser'
              : undefined
          }
          primaryButtonExpanded={slot.surfaceKind === 'browser' ? !isBrowserCollapsed : undefined}
          onRequestSurfaceKind={(nextSurfaceKind) =>
            handleViewportSlotSurfaceKindChange(slot.slotId, nextSurfaceKind)
          }
          onSplitTop={() => handleViewportSlotSplit(slot.slotId, 'top')}
          onSplitRight={() => handleViewportSlotSplit(slot.slotId, 'right')}
          onSplitBottom={() => handleViewportSlotSplit(slot.slotId, 'bottom')}
          onSplitLeft={() => handleViewportSlotSplit(slot.slotId, 'left')}
          onFloat={isPrimarySlot ? undefined : () => handleViewportSlotFloat(slot.slotId)}
          onPopOut={
            slot.surfaceKind === 'modelViewer' || !isPrimarySlot
              ? () => handleViewportSlotPopOut(slot.slotId)
              : undefined
          }
          popOutButtonAriaLabel={
            isPrimarySlot && slot.surfaceKind === 'modelViewer'
              ? 'Open Model Viewport in new browser'
              : undefined
          }
          popOutButtonTitle={
            isPrimarySlot && slot.surfaceKind === 'modelViewer'
              ? 'Open in new browser'
              : undefined
          }
          onClose={isPrimarySlot ? undefined : () => handleCloseViewportSlotFromMenu(slot.slotId)}
          onHeaderDragOut={
            !isPrimarySlot && slot.surfaceKind !== 'modelViewer'
              ? (payload) => handleViewportSlotHeaderDragOut(slot.slotId, payload)
              : undefined
          }
        >
          {slot.surfaceKind === 'modelViewer' ? (
            <>
              {isPrimarySlot ? (
                <PrimaryViewportLeftDock
                  leftDockWidth={leftDockWidth}
                  bottomInset={
                    (() => {
                      const parentSplitNodeId = findParentSplitNodeIdForLayoutNode(
                        slot.leafNodeId,
                        viewportLayoutNodesById,
                      )
                      const parentSplitNode =
                        parentSplitNodeId !== null ? viewportLayoutNodesById[parentSplitNodeId] : null
                      if (
                        parentSplitNode?.kind === 'split' &&
                        parentSplitNode.splitDirection === 'horizontal' &&
                        parentSplitNode.splitDockSide === 'bottom' &&
                        parentSplitNode.firstChildId === slot.leafNodeId
                      ) {
                        return `calc(${parentSplitNode.ratio * 100}% + ${splitDividerHeight}px)`
                      }
                      return '0px'
                    })()
                  }
                  isConstrained={primaryViewportSlotIsConstrained}
                  isViewportSplitHandleConstrained={false}
                  isLeftDockViewportSplit={isLeftDockViewportSplit}
                  isBrowserDockPreviewActive={isBrowserDockPreviewActive}
                  isMeatballDockPreviewActive={isMeatballDockPreviewActive}
                  dockedBrowserHostRef={dockedBrowserHostRef}
                  dockedMeatballHostRef={dockedMeatballHostRef}
                  onResizeStart={handleLeftDockResizeStart}
                  onResizeContextMenu={handleLeftDockResizeContextMenu}
                  onSplitTogglePointerDown={handleLeftDockSplitTogglePointerDown}
                  onSplitToggleClick={handleLeftDockSplitToggleClick}
                />
              ) : null}
              <ViewportWorkspaceHost
                viewportId={slot.surfaceInstanceId}
                onActivateViewerSurface={handleActivateViewerSurface}
                onViewportContextMenu={handleOpenViewportSpawnMenu}
              />
            </>
          ) : (
            <ViewportSurfaceRegistry
              slotId={slot.slotId}
              surfaceKind={slot.surfaceKind}
              surfaceInstanceId={slot.surfaceInstanceId}
              onActivateSpaghettiSurface={handleActivateSpaghettiSurface}
              spaghettiWindowSettingsOpen={windowSettingsOpenByViewportId[slot.surfaceInstanceId] ?? false}
            />
          )}
        </ViewportFrame>
      )
    },
    [
      handleActivateSpaghettiSurface,
      handleActivateViewerSurface,
      handleOpenViewportSpawnMenu,
      handleViewportSlotFloat,
      handleViewportSlotHeaderDragOut,
      handleViewportSlotPopOut,
      handleViewportSlotSplit,
      handleViewportSlotSurfaceKindChange,
      browserPresentationMode,
      isBrowserCollapsed,
      setBrowserPresentationMode,
      isBrowserDockPreviewActive,
      isMeatballDockPreviewActive,
      dockedBrowserHostRef,
      dockedMeatballHostRef,
      handleLeftDockResizeContextMenu,
      handleLeftDockResizeStart,
      handleLeftDockSplitToggleClick,
      handleLeftDockSplitTogglePointerDown,
      isLeftDockViewportSplit,
      leftDockWidth,
      viewportLayoutNodesById,
      viewportSlotsById,
      windowSettingsOpenByViewportId,
    ],
  )

  const renderViewportLayoutNode = useCallback(
    (nodeId: string): ReturnType<typeof renderViewportSlot> => {
      const node = viewportLayoutNodesById[nodeId] ?? null
      if (node === null) {
        return null
      }
      if (node.kind === 'leaf') {
        return renderViewportSlot(node.slotId)
      }
      const splitDirectionClass = node.splitDirection === 'vertical' ? 'isVertical' : 'isHorizontal'
      const splitDockSideClass =
        node.splitDockSide === 'left'
          ? 'isEditorLeft'
          : node.splitDockSide === 'right'
            ? 'isEditorRight'
            : node.splitDockSide === 'top'
              ? 'isEditorTop'
              : 'isEditorBottom'
      const splitRatio = node.ratio
      const firstChildArea =
        node.splitDirection === 'vertical'
          ? node.splitDockSide === 'left'
            ? 'editor'
            : 'viewer'
          : node.splitDockSide === 'top'
            ? 'editor'
            : 'viewer'
      const secondChildArea = firstChildArea === 'editor' ? 'viewer' : 'editor'
      return (
        <div
          key={node.nodeId}
          className={`ViewportSplitLayout ${splitDirectionClass} ${splitDockSideClass}`}
          style={{
            gridTemplateColumns:
              node.splitDirection === 'vertical'
                ? node.splitDockSide === 'left'
                  ? `${splitRatio}fr ${splitDividerHeight}px ${1 - splitRatio}fr`
                  : `${1 - splitRatio}fr ${splitDividerHeight}px ${splitRatio}fr`
                : 'minmax(0, 1fr)',
            gridTemplateRows:
              node.splitDirection === 'vertical'
                ? 'minmax(0, 1fr)'
                : node.splitDockSide === 'top'
                  ? `${splitRatio}fr ${splitDividerHeight}px ${1 - splitRatio}fr`
                  : `${1 - splitRatio}fr ${splitDividerHeight}px ${splitRatio}fr`,
            gridTemplateAreas:
              node.splitDirection === 'vertical'
                ? node.splitDockSide === 'left'
                  ? '"editor divider viewer"'
                  : '"viewer divider editor"'
                : node.splitDockSide === 'top'
                  ? '"editor" "divider" "viewer"'
                  : '"viewer" "divider" "editor"',
          }}
        >
          <div
            className={`ViewportSplitPane ${
              firstChildArea === 'viewer' ? 'ViewportSplitPane--viewer' : 'ViewportSplitPane--editor'
            }`}
            style={{ gridArea: firstChildArea }}
          >
            {renderViewportLayoutNode(node.firstChildId)}
          </div>
          <div className="ViewportSplitDividerShell" style={{ gridArea: 'divider' }}>
            <button
              type="button"
              className="ViewportSplitDivider"
              onPointerDown={(event) => handleViewportLayoutDividerPointerDown(node.nodeId, event)}
              aria-label="Resize split view"
              title="Drag to resize split view"
            />
          </div>
          <div
            className={`ViewportSplitPane ${
              secondChildArea === 'viewer' ? 'ViewportSplitPane--viewer' : 'ViewportSplitPane--editor'
            }`}
            style={{ gridArea: secondChildArea }}
          >
            {renderViewportLayoutNode(node.secondChildId)}
          </div>
        </div>
      )
    },
    [
      renderViewportSlot,
      handleViewportLayoutDividerPointerDown,
      viewportLayoutNodesById,
    ],
  )

  const viewerSurface = renderViewportLayoutNode(viewportSlotRootNodeId)
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
          <span>Floating Model Viewport</span>
          <button
            type="button"
            className="DetachedViewerFloatingWindowQuickDock"
            onClick={() => {
              redockDetachedSurface(surface.surfaceInstanceId)
            }}
          >
            Quick Dock
          </button>
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
  const viewportSpawnMenuSurface =
    viewportSpawnMenu !== null && viewportRef.current !== null
      ? createPortal(
          <div
            ref={viewportSpawnMenuRef}
            className="ViewportSpawnMenu"
            style={{
              left: `${Math.max(
                12,
                Math.round(
                  viewportSpawnMenu.x -
                    (viewportRef.current?.getBoundingClientRect().left ?? 0),
                ),
              )}px`,
              top: `${Math.max(
                12,
                Math.round(
                  viewportSpawnMenu.y -
                    (viewportRef.current?.getBoundingClientRect().top ?? 0),
                ),
              )}px`,
            }}
          >
            <input
              ref={viewportSpawnMenuInputRef}
              className="ViewportSpawnMenuSearch"
              type="text"
              value={viewportSpawnMenu.query}
              placeholder="Search spawn actions"
              onChange={(event) => {
                const nextQuery = event.target.value
                setViewportSpawnMenu((current) =>
                  current === null ? null : { ...current, query: nextQuery },
                )
              }}
            />
            <div className="ViewportSpawnMenuList">
              {viewportSpawnMenuItems.length > 0 ? (
                viewportSpawnMenuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="ViewportSpawnMenuAction"
                    onClick={() => {
                      item.onSelect()
                    }}
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <div className="ViewportSpawnMenuEmpty">No matching actions.</div>
              )}
            </div>
          </div>,
          viewportRef.current,
        )
      : null

  return (
    <div ref={appShellRef} className="AppShellRoot">
      <section
        ref={viewportRef}
        className="ViewportArea"
      >
        {viewportSpawnMenuSurface}
        {detachedViewerWindows}
        {detachedViewerPopoutWindows}
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
        <ConsoleDock
          listLeftOffset={consoleListLeftOffset}
          suppressDockedSurface={suppressLegacyDockedConsoleSurface}
          suppressSlotHeaderDragSeedReplay={isConsoleTransitionDragActive}
          onOpenFloatingSplitMenu={handleFloatingSplitMenu}
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
      <BrowserDockHost
        appShellRef={appShellRef}
        viewportRef={viewportRef}
        viewportSplitHostRef={browserViewportSplitHostRef}
        dockedBrowserHostRef={dockedBrowserHostRef}
        renderViewportSplitSurface={false}
        suppressDockedSurface={suppressLegacyDockedBrowserSurface}
        resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
        onActivateBrowserFloatingWindow={handleActivateBrowserFloatingWindow}
        newEditorSpawnPosition={newEditorSpawnPosition}
      workspaceActiveSurface={workspaceActiveSurface}
      slotHeaderDragSeed={browserSlotHeaderDragSeed}
      onConsumeSlotHeaderDragSeed={() => setBrowserSlotHeaderDragSeed(null)}
    />
      {leftDockResizeMenu !== null ? (
        <div className="PrimaryViewportLeftDockResizeMenu" style={leftDockResizeMenuStyle}>
          <button
            type="button"
            className="PrimaryViewportLeftDockResizeMenuAction"
            onClick={handleResetLeftDockWidth}
          >
            Default Width
          </button>
          <button
            type="button"
            className="PrimaryViewportLeftDockResizeMenuAction"
            onClick={handleTogglePrimaryLeftDockSlotSplit}
          >
            {isLeftDockViewportSplit ? 'Unsplit Viewport' : 'Split Viewport'}
          </button>
        </div>
      ) : null}
      {workspaceSplitMenu !== null ? (
        <div
          className="WorkspaceSplitMenu PrimaryViewportLeftDockResizeMenu"
          style={workspaceSplitMenuStyle}
        >
          {workspaceSplitMenu.scope === 'floating-titlebar' ? (
            <>
              {workspaceSplitMenuTargetSurfaceKind === 'console' ||
              workspaceSplitMenuTargetSurfaceKind === 'spaghettiEditor' ? (
                <>
                  <div
                    className="PrimaryViewportLeftDockResizeMenuSubmenuGroup"
                    onMouseEnter={handleFloatingSplitSubmenuMouseEnter}
                    onMouseLeave={handleFloatingSplitSubmenuMouseLeave}
                  >
                    <button
                      type="button"
                      className="PrimaryViewportLeftDockResizeMenuAction PrimaryViewportLeftDockResizeMenuAction--submenu"
                      aria-haspopup="menu"
                      aria-expanded={isFloatingSplitSubmenuOpen}
                      onFocus={handleFloatingSplitSubmenuMouseEnter}
                      onClick={handleToggleFloatingSplitSubmenu}
                    >
                      <span>Split</span>
                      <span className="PrimaryViewportLeftDockResizeMenuChevron">›</span>
                    </button>
                    {isFloatingSplitSubmenuOpen ? (
                      <div className="PrimaryViewportLeftDockResizeSubmenu" role="menu">
                        <button
                          type="button"
                          className="PrimaryViewportLeftDockResizeMenuAction"
                          onClick={() => handleSelectFloatingSurfaceSplitDockSide('top')}
                        >
                          Split Top
                        </button>
                        <button
                          type="button"
                          className="PrimaryViewportLeftDockResizeMenuAction"
                          onClick={() => handleSelectFloatingSurfaceSplitDockSide('right')}
                        >
                          Split Right
                        </button>
                        <button
                          type="button"
                          className="PrimaryViewportLeftDockResizeMenuAction"
                          onClick={() => handleSelectFloatingSurfaceSplitDockSide('bottom')}
                        >
                          Split Bottom
                        </button>
                        <button
                          type="button"
                          className="PrimaryViewportLeftDockResizeMenuAction"
                          onClick={() => handleSelectFloatingSurfaceSplitDockSide('left')}
                        >
                          Split Left
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="PrimaryViewportLeftDockResizeMenuAction"
                    onClick={handleCloseSurfaceFromFloatingMenu}
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="PrimaryViewportLeftDockResizeMenuAction"
                    onClick={() => handleCommitFloatingSurfaceSplit('right', 'local')}
                  >
                    Split Right Locally
                  </button>
                  <button
                    type="button"
                    className="PrimaryViewportLeftDockResizeMenuAction"
                    onClick={() => handleCommitFloatingSurfaceSplit('right', 'global')}
                  >
                    Split Right Globally
                  </button>
                  <button
                    type="button"
                    className="PrimaryViewportLeftDockResizeMenuAction"
                    onClick={handleCloseSurfaceFromFloatingMenu}
                  >
                    Close
                  </button>
                </>
              )}
            </>
          ) : null}
          {workspaceSplitMenu.scope === 'divider' ? (
            <>
              <button
                type="button"
                className="PrimaryViewportLeftDockResizeMenuAction"
                onClick={handleResetSplitRatio}
              >
                Reset Ratio
              </button>
              <button
                type="button"
                className={`PrimaryViewportLeftDockResizeMenuAction ${
                  workspaceSplitMenuTargetSplitPriority === 'balanced' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('balanced')}
              >
                Balanced Priority
              </button>
              <button
                type="button"
                className={`PrimaryViewportLeftDockResizeMenuAction ${
                  workspaceSplitMenuTargetSplitPriority === 'favorFirst' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('favorFirst')}
              >
                Favor First Pane
              </button>
              <button
                type="button"
                className={`PrimaryViewportLeftDockResizeMenuAction ${
                  workspaceSplitMenuTargetSplitPriority === 'favorSecond' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('favorSecond')}
              >
                Favor Second Pane
              </button>
              <button
                type="button"
                className="PrimaryViewportLeftDockResizeMenuAction"
                onClick={handleCloseSplitFromMenu}
              >
                Close Split
              </button>
              <button
                type="button"
                className="PrimaryViewportLeftDockResizeMenuAction"
                onClick={handleCloseSplitFromMenu}
              >
                Merge With Neighbor
              </button>
            </>
          ) : null}
        </div>
      ) : null}
      {isRadioToolbarOpen ? <RadioPanel /> : null}
      <RadioRuntimeHost />
    </div>
  )
}
