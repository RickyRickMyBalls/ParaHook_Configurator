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
import {
  selectActiveEditorViewport,
  useSpaghettiStore,
} from './spaghetti/store/useSpaghettiStore'
import {
  RADIO_SUPPORT_PROFILE,
  useAudioSamplerStore,
} from './store/audioSamplerStore'
import { useAppStore } from './store/useAppStore'
import { useWorkspaceChildWindow } from './workspace/useWorkspaceChildWindow'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import { WorkspaceViewportTree } from './workspace/WorkspaceViewportTree'
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
  type WorkspaceDetachedSlotSurfaceState,
} from './workspace/workspaceShellTypes'
import { useWorkspacePersistenceBridge } from './workspace/useWorkspacePersistenceBridge'
import { useWorkspaceDetachedRestoreCompatibilityBridge } from './workspace/useWorkspaceDetachedRestoreCompatibilityBridge'
const floatingDockLockGap = 25
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
  const leftDockWidthPreviewHandlerRef = useRef<((nextWidth: number) => void) | null>(null)
  const [, setDetachedViewerFloatingLayoutVersion] = useState(0)
  const [viewportSpawnMenu, setViewportSpawnMenu] = useState<ViewportSpawnMenuState | null>(null)
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
  const setDetachedSurfaceKind = useWorkspaceStore((state) => state.setDetachedSurfaceKind)
  const hydratePersistedNotepadState = useNotepadStore((state) => state.hydratePersistedNotepadState)
  const setActiveNoteId = useNotepadStore((state) => state.setActiveNoteId)
  const hydratePersistedDashboardState = useDashboardStore(
    (state) => state.hydratePersistedDashboardState,
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
        (viewport) => viewport.windowMode === 'meatball editor view',
      ),
    [editorViewportsById],
  )
  const consoleWindowMode = useConsoleStore((state) => state.windowMode)
  const [suppressRuntimeProjectedDockedBrowserSurface, setSuppressRuntimeProjectedDockedBrowserSurface] =
    useState(false)
  const [windowSettingsOpenByViewportId, setWindowSettingsOpenByViewportId] = useState<
    Record<string, boolean>
  >({})
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
  const shouldReservePrimaryViewportBottomConsoleBar =
    consoleWindowMode === 'docked' && !suppressLegacyDockedConsoleSurface
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

  useWorkspacePersistenceBridge()

  useEffect(() => {
    if (hasHydratedNotepadPersistenceRef.current) {
      return
    }
    hasHydratedNotepadPersistenceRef.current = true
    const persistedNotepadState = readPersistedNotepadState()
    if (persistedNotepadState !== null) {
      hydratePersistedNotepadState(persistedNotepadState)
    }
    writePersistedNotepadState(serializeNotepadState(useNotepadStore.getState()))
  }, [hydratePersistedNotepadState])

  useEffect(() => {
    const unsubscribe = useNotepadStore.subscribe((state) => {
      if (!hasHydratedNotepadPersistenceRef.current) {
        return
      }
      writePersistedNotepadState(serializeNotepadState(state))
    })
    return unsubscribe
  }, [])

  useLayoutEffect(() => {
    if (hasHydratedDashboardPersistenceRef.current) {
      return
    }
    hasHydratedDashboardPersistenceRef.current = true
    const persistedDashboardState = readPersistedDashboardState()
    if (persistedDashboardState !== null) {
      hydratePersistedDashboardState(persistedDashboardState)
    }
    writePersistedDashboardState(serializeDashboardState(useDashboardStore.getState()))
  }, [hydratePersistedDashboardState])

  useEffect(() => {
    const unsubscribe = useDashboardStore.subscribe((state) => {
      if (!hasHydratedDashboardPersistenceRef.current) {
        return
      }
      writePersistedDashboardState(serializeDashboardState(state))
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

  const viewerSurface = (
    <WorkspaceViewportTree
      viewportSlotRootNodeId={viewportSlotRootNodeId}
      viewportSlotsById={viewportSlotsById}
      viewportLayoutNodesById={viewportLayoutNodesById}
      leftDockWidth={leftDockWidth}
      primaryViewportSlotIsConstrained={primaryViewportSlotIsConstrained}
      isLeftDockViewportSplit={isLeftDockViewportSplit}
      isBrowserDockPreviewActive={isBrowserDockPreviewActive}
      isMeatballDockPreviewActive={isMeatballDockPreviewActive}
      isMeatballDockOccupied={isMeatballDockOccupied}
      browserPresentationMode={browserPresentationMode}
      isBrowserCollapsed={isBrowserCollapsed}
      windowSettingsOpenByViewportId={windowSettingsOpenByViewportId}
      dockedBrowserHostRef={dockedBrowserHostRef}
      dockedMeatballHostRef={dockedMeatballHostRef}
      onActivateSpaghettiSurface={handleActivateSpaghettiSurface}
      onActivateViewerSurface={handleActivateViewerSurface}
      onOpenViewportSpawnMenu={handleOpenViewportSpawnMenu}
      onCycleBrowserPresentationMode={() =>
        setBrowserPresentationMode(
          browserPresentationMode === 'expanded'
            ? 'essentials'
            : browserPresentationMode === 'essentials'
              ? 'collapsed'
              : 'expanded',
        )
      }
      onRequestViewportSlotSurfaceKind={handleViewportSlotSurfaceKindChange}
      onOpenDashboardNoteInNotepad={handleOpenDashboardNoteInNotepad}
      onSplitViewportSlot={handleViewportSlotSplit}
      onFloatViewportSlot={handleViewportSlotFloat}
      onPopOutViewportSlot={handleViewportSlotPopOut}
      onCloseViewportSlot={handleCloseViewportSlotFromMenu}
      onViewportSlotHeaderDragOut={handleViewportSlotHeaderDragOut}
      onViewportLayoutDividerPointerDown={handleViewportLayoutDividerPointerDown}
      onLeftDockResizeStart={handleLeftDockResizeStart}
      onLeftDockResizeContextMenu={handleLeftDockResizeContextMenu}
      resolvePrimaryLeftDockBottomInset={resolvePrimaryLeftDockBottomInset}
      reservePrimaryViewportBottomConsoleBar={shouldReservePrimaryViewportBottomConsoleBar}
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
        />
        <NotepadWindowHost
          viewportRef={viewportRef}
          floatingSurfaces={detachedNotepadFloatingSurfaces}
          popoutSurfaces={detachedNotepadPopoutSurfaces}
          onClearDetachedSurface={clearDetachedSlotSurface}
          onQuickDock={redockDetachedSurface}
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
