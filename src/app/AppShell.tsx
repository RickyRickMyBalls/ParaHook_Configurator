import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { ConsoleDock } from './console/ConsoleDock'
import { useConsoleStore } from './console/useConsoleStore'
import { BrowserDockHost } from './hosts/BrowserDockHost'
import { RadioRuntimeHost } from './hosts/RadioRuntimeHost'
import { SpaghettiWindowHost } from './hosts/SpaghettiWindowHost'
import { useAppShellDockController } from './hosts/useAppShellDockController'
import { RadioPanel } from './panels/RadioPanel'
import { selectActiveEditorViewport, useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { useAudioSamplerStore } from './store/audioSamplerStore'
import { useAppStore } from './store/useAppStore'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import { PrimaryViewportLeftDock } from './workspace/PrimaryViewportLeftDock'
import { ViewportFrame } from './workspace/ViewportFrame'
import { ViewportSurfaceRegistry } from './workspace/ViewportSurfaceRegistry'
import { ViewportWorkspaceHost } from './workspace/ViewportWorkspaceHost'
import {
  readPersistedWorkspaceLayout,
  serializeWorkspaceLayout,
  writePersistedWorkspaceLayout,
} from './workspace/workspacePersistence'
import {
  defaultBrowserFloatingPosition,
  defaultBrowserFloatingSize,
  defaultPrimaryViewportSlotId,
} from './workspace/workspaceShellTypes'
import {
  defaultWorkspaceSplitDirection,
  resolveDefaultWorkspaceSplitDockSide,
  defaultWorkspaceSplitPriority,
  type WorkspaceSplitDirection,
  type WorkspaceSplitPriority,
} from './workspace/workspaceSplitTypes'

const floatingDockLockGap = 25
const splitDividerHeight = 10

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

export function AppShell() {
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession ?? null)
  const setEditorViewportWindowMode = useSpaghettiStore((state) => state.setEditorViewportWindowMode)
  const setEditorViewportSplitDirection = useSpaghettiStore(
    (state) => state.setEditorViewportSplitDirection,
  )
  const setEditorViewportSplitPriority = useSpaghettiStore(
    (state) => state.setEditorViewportSplitPriority,
  )
  const setEditorViewportSplitRatio = useSpaghettiStore((state) => state.setEditorViewportSplitRatio)
  const isRadioToolbarOpen = useAudioSamplerStore((state) => state.isRadioToolbarOpen)
  const floatingShellActivationRequest = useAppStore((state) => state.floatingShellActivationRequest)
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const workspaceSelectedTarget = useAppStore((state) => state.workspaceSelection.selectedTarget)
  const workspaceExplicitSelectedTargets = useAppStore(
    (state) => state.workspaceSelection.explicitSelectedTargets ?? [],
  )
  const setActiveSurface = useAppStore((state) => state.setActiveSurface)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const appShellRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLElement | null>(null)
  const browserViewportSplitHostRef = useRef<HTMLDivElement | null>(null)
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const dockedMeatballHostRef = useRef<HTMLDivElement | null>(null)
  const leftDockWidthPreviewHandlerRef = useRef<((nextWidth: number) => void) | null>(null)
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
  const setIsBrowserFloating = useWorkspaceStore((state) => state.setBrowserFloating)
  const setIsBrowserPoppedOut = useWorkspaceStore((state) => state.setBrowserPoppedOut)
  const setIsBrowserViewportSplit = useWorkspaceStore((state) => state.setBrowserViewportSplit)
  const setBrowserPresentationMode = useWorkspaceStore((state) => state.setBrowserPresentationMode)
  const setBrowserFloatingPosition = useWorkspaceStore((state) => state.setBrowserFloatingPosition)
  const setBrowserFloatingSize = useWorkspaceStore((state) => state.setBrowserFloatingSize)
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
  const redockDetachedSurface = useWorkspaceStore((state) => state.redockDetachedSurface)
  const setViewportSlotSurfaceKind = useWorkspaceStore((state) => state.setViewportSlotSurfaceKind)
  const setViewportLayoutSplitRatio = useWorkspaceStore((state) => state.setViewportLayoutSplitRatio)
  const hydratePersistedWorkspaceLayout = useWorkspaceStore(
    (state) => state.hydratePersistedWorkspaceLayout,
  )
  const activeEditorSurface = useWorkspaceStore((state) =>
    activeEditorViewportId.length > 0 ? state.editorSurfacePlacementById[activeEditorViewportId] ?? null : null,
  )
  const [browserSlotHeaderDragSeed, setBrowserSlotHeaderDragSeed] = useState<{
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null>(null)
  const [, setActiveFloatingShell] = useState<'spaghetti' | 'browser' | null>(null)
  const lastHandledFloatingShellActivationSeqRef = useRef(0)
  const hasHydratedWorkspacePersistenceRef = useRef(false)

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

  const activeWindowMode = activeEditorSurface?.windowMode ?? activeEditorViewport?.windowMode ?? null
  const showEditorSurface = activeEditorViewport !== null
  const showFloatingShell =
    showEditorSurface &&
    (activeWindowMode === 'expanded' ||
      activeWindowMode === 'maximized' ||
      activeWindowMode === 'collapsed')
  const showSplitLayout = showEditorSurface && activeWindowMode === 'split view'
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
  const suppressLegacyDockedBrowserSurface = browserSlotCount > 0 || activeDetachedBrowserSurface !== null
  const suppressLegacyDockedConsoleSurface =
    consoleSlotCount > 0 || activeDetachedConsoleSurface !== null
  const primaryViewportSlotIsConstrained = useMemo(() => {
    const primarySlot = viewportSlotsById[defaultPrimaryViewportSlotId] ?? null
    if (primarySlot === null) {
      return isLeftDockViewportSplit || showSplitLayout
    }
    return (
      isLeftDockViewportSplit ||
      showSplitLayout ||
      findParentSplitNodeIdForLayoutNode(primarySlot.leafNodeId, viewportLayoutNodesById) !== null
    )
  }, [isLeftDockViewportSplit, showSplitLayout, viewportLayoutNodesById, viewportSlotsById])

  const handleActivateSpaghettiFloatingWindow = useCallback(() => {
    setActiveFloatingShell('spaghetti')
    setActiveSurface('spaghetti')
    requestConsoleContextSync('surface-activation')
  }, [requestConsoleContextSync, setActiveSurface])

  const handleActivateSpaghettiSurface = useCallback(() => {
    setActiveSurface('spaghetti')
    requestConsoleContextSync('surface-activation')
  }, [requestConsoleContextSync, setActiveSurface])

  const handleActivateViewerSurface = useCallback(() => {
    setActiveFloatingShell(null)
    setActiveSurface('viewer')
    if (sketchPlanePickSession !== null) {
      return
    }
    if (workspaceSelectedTarget !== null || workspaceExplicitSelectedTargets.length > 0) {
      return
    }
    requestConsoleContextSync('surface-clear')
  }, [
    requestConsoleContextSync,
    setActiveSurface,
    sketchPlanePickSession,
    workspaceExplicitSelectedTargets.length,
    workspaceSelectedTarget,
  ])

  const handleActivateBrowserFloatingWindow = useCallback(() => {
    setActiveFloatingShell('browser')
    setActiveSurface('browser')
  }, [setActiveSurface])

  useEffect(() => {
    if (!showFloatingShell && workspaceActiveSurface === 'spaghetti') {
      setActiveFloatingShell(null)
      setActiveSurface(null)
      requestConsoleContextSync('surface-clear')
    }
  }, [requestConsoleContextSync, setActiveSurface, showFloatingShell, workspaceActiveSurface])

  useEffect(() => {
    if (!isBrowserFloating && !isBrowserPoppedOut && workspaceActiveSurface === 'browser') {
      setActiveFloatingShell(null)
    }
  }, [isBrowserFloating, isBrowserPoppedOut, workspaceActiveSurface])

  useEffect(() => {
    if (
      floatingShellActivationRequest === null ||
      floatingShellActivationRequest.seq === lastHandledFloatingShellActivationSeqRef.current
    ) {
      return
    }
    lastHandledFloatingShellActivationSeqRef.current = floatingShellActivationRequest.seq
    if (floatingShellActivationRequest.target === 'spaghetti') {
      if (showFloatingShell) {
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
    isBrowserFloating,
    isBrowserPoppedOut,
    setActiveSurface,
    showFloatingShell,
  ])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        (target.closest('.SpaghettiFloatingWindow') !== null ||
          target.closest('.BrowserFloatingWindow') !== null ||
          target.closest('.ViewportWorkspaceHost') !== null ||
          target.closest('.ViewportViewerSurface') !== null)
      ) {
        return
      }
      if (workspaceActiveSurface === 'spaghetti' || workspaceActiveSurface === 'browser') {
        setActiveFloatingShell(null)
        setActiveSurface(null)
        requestConsoleContextSync('surface-clear')
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [requestConsoleContextSync, setActiveSurface, workspaceActiveSurface])

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
          spaghettiState.setEditorViewportWindowMode(editorViewportId, placement.windowMode)
        }
      }
    }
    writePersistedWorkspaceLayout(serializeWorkspaceLayout(useWorkspaceStore.getState()))
  }, [hydratePersistedWorkspaceLayout])

  useEffect(() => {
    const unsubscribe = useWorkspaceStore.subscribe((state) => {
      if (!hasHydratedWorkspacePersistenceRef.current) {
        return
      }
      writePersistedWorkspaceLayout(serializeWorkspaceLayout(state))
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!isBrowserViewportSplit || browserSlotCount > 0) {
      return
    }
    if (activeDetachedBrowserSurface !== null) {
      redockDetachedSurface(activeDetachedBrowserSurface.surfaceInstanceId, browserViewportSplitDockSide)
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
    redockDetachedSurface,
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
    redockDetachedSurface(
      activeDetachedBrowserSurface.surfaceInstanceId,
      activeDetachedBrowserSurface.preferredSplitDockSide,
    )
  }, [
    activeDetachedBrowserSurface,
    browserSlotCount,
    isBrowserFloating,
    isBrowserPoppedOut,
    isBrowserViewportSplit,
    redockDetachedSurface,
  ])

  useEffect(() => {
    if (activeDetachedConsoleSurface === null || consoleWindowMode !== 'docked' || consoleSlotCount > 0) {
      return
    }
    redockDetachedSurface(
      activeDetachedConsoleSurface.surfaceInstanceId,
      activeDetachedConsoleSurface.preferredSplitDockSide,
    )
  }, [activeDetachedConsoleSurface, consoleSlotCount, consoleWindowMode, redockDetachedSurface])

  const handleFloatingSplitMenu = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (activeEditorViewport === null || activeWindowMode === 'split view') {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setWorkspaceSplitMenu({
        x: event.clientX,
        y: event.clientY,
        scope: 'floating-titlebar',
      })
    },
    [activeEditorViewport, activeWindowMode],
  )

  const handleDividerSplitMenu = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setWorkspaceSplitMenu({
      x: event.clientX,
      y: event.clientY,
      scope: 'divider',
    })
  }, [])

  const handleSetSplitDirection = useCallback(
    (nextDirection: WorkspaceSplitDirection) => {
      if (activeEditorViewport === null) {
        return
      }
      const editorViewportId = activeEditorViewport.editorViewportId
      setEditorViewportSplitDirection(editorViewportId, nextDirection)
      if (activeWindowMode !== 'split view') {
        setEditorViewportWindowMode(editorViewportId, 'split view')
      }
      setWorkspaceSplitMenu(null)
    },
    [
      activeEditorViewport,
      activeWindowMode,
      setEditorViewportSplitDirection,
      setEditorViewportWindowMode,
    ],
  )

  const handleResetSplitRatio = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportSplitRatio(activeEditorViewport.editorViewportId, 0.5)
    setWorkspaceSplitMenu(null)
  }, [activeEditorViewport, setEditorViewportSplitRatio])

  const handleSetSplitPriority = useCallback(
    (nextPriority: WorkspaceSplitPriority) => {
      if (activeEditorViewport === null) {
        return
      }
      setEditorViewportSplitPriority(activeEditorViewport.editorViewportId, nextPriority)
      setWorkspaceSplitMenu(null)
    },
    [activeEditorViewport, setEditorViewportSplitPriority],
  )

  const handleCloseSplitFromMenu = useCallback(() => {
    if (activeEditorViewport === null || activeWindowMode !== 'split view') {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'split view')
    setWorkspaceSplitMenu(null)
  }, [activeEditorViewport, activeWindowMode, setEditorViewportWindowMode])

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
      splitViewportSlot(slotId, splitDockSide, {
        surfaceKind: sourceSlot.surfaceKind,
        ...(nextSurfaceInstanceId === null ? {} : { surfaceInstanceId: nextSurfaceInstanceId }),
        ...(preferredBrowserSideSplitRatio === undefined
          ? {}
          : { preferredRatio: preferredBrowserSideSplitRatio }),
      })
    },
    [
      appShellRef,
      createDuplicatedEditorSurfaceInstanceId,
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
        nextSurfaceKind === 'spaghettiEditor' &&
        currentSlot.retainedSurfaceInstanceIdsByKind.spaghettiEditor === undefined
          ? createDuplicatedEditorSurfaceInstanceId(currentSlot.surfaceInstanceId)
          : null
      setViewportSlotSurfaceKind(slotId, nextSurfaceKind, {
        ...(nextSurfaceInstanceId === null ? {} : { surfaceInstanceId: nextSurfaceInstanceId }),
      })
      if (currentSlot.surfaceKind === 'browser' && browserSlotCount <= 1 && isBrowserViewportSplit) {
        setIsBrowserViewportSplit(false)
      }
    },
    [
      browserSlotCount,
      createDuplicatedEditorSurfaceInstanceId,
      isBrowserViewportSplit,
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
      detachViewportSlotSurface(slotId, 'floating')
      if (slot.surfaceKind === 'browser') {
        if (browserSlotCount <= 1) {
          setIsBrowserViewportSplit(false)
        }
        if (options?.preserveBrowserFloatingShell !== true) {
          setBrowserFloatingSize(defaultBrowserFloatingSize)
          setBrowserFloatingPosition(defaultBrowserFloatingPosition)
        }
        setIsBrowserFloating(true)
        return
      }
      if (slot.surfaceKind === 'console') {
        useConsoleStore.getState().switchToFloating()
        return
      }
      if (slot.surfaceKind === 'spaghettiEditor') {
        useSpaghettiStore.getState().setActiveEditorViewportId?.(slot.surfaceInstanceId)
        setEditorViewportWindowMode(slot.surfaceInstanceId, 'expanded')
      }
    },
    [
      browserSlotCount,
      detachViewportSlotSurface,
      setEditorViewportWindowMode,
      setIsBrowserFloating,
      setIsBrowserViewportSplit,
      viewportSlotsById,
    ],
  )

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
      }
      handleViewportSlotFloat(slotId, {
        preserveBrowserFloatingShell: slot.surfaceKind === 'browser',
      })
    },
    [
      appShellRef,
      handleViewportSlotFloat,
      setBrowserFloatingPosition,
      setBrowserFloatingSize,
      setBrowserSlotHeaderDragSeed,
      viewportSlotsById,
    ],
  )

  const handleViewportSlotPopOut = useCallback(
    (slotId: string) => {
      const slot = viewportSlotsById[slotId] ?? null
      if (slot === null || slotId === defaultPrimaryViewportSlotId) {
        return
      }
      detachViewportSlotSurface(slotId, 'popout')
      if (slot.surfaceKind === 'browser') {
        if (browserSlotCount <= 1) {
          setIsBrowserViewportSplit(false)
        }
        setIsBrowserPoppedOut(true)
        return
      }
      if (slot.surfaceKind === 'console') {
        useConsoleStore.getState().switchToPopout()
        return
      }
      if (slot.surfaceKind === 'spaghettiEditor') {
        useSpaghettiStore.getState().setActiveEditorViewportId?.(slot.surfaceInstanceId)
        setEditorViewportWindowMode(slot.surfaceInstanceId, 'separateWindow')
      }
    },
    [
      browserSlotCount,
      detachViewportSlotSurface,
      setEditorViewportWindowMode,
      setIsBrowserPoppedOut,
      setIsBrowserViewportSplit,
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
      redockDetachedSurface(activeDetachedBrowserSurface.surfaceInstanceId, 'left')
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
    redockDetachedSurface,
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
          onPopOut={isPrimarySlot ? undefined : () => handleViewportSlotPopOut(slot.slotId)}
          onHeaderDragOut={
            slot.surfaceKind === 'browser' && !isPrimarySlot
              ? (payload) => handleViewportSlotHeaderDragOut(slot.slotId, payload)
              : undefined
          }
        >
          {slot.surfaceKind === 'modelViewer' && isPrimarySlot ? (
            <>
              <PrimaryViewportLeftDock
                leftDockWidth={leftDockWidth}
                bottomInset={
                  showSplitLayout &&
                  splitDirection === 'horizontal' &&
                  splitDockSide === 'bottom' &&
                  (!isLeftDockViewportSplit || splitPriority !== 'favorFirst')
                    ? `calc(${((1 - splitRatio) * 100).toFixed(4)}% + ${splitDividerHeight}px)`
                    : '0px'
                }
                isConstrained={primaryViewportSlotIsConstrained}
                isViewportSplitHandleConstrained={isLeftDockViewportSplit && showSplitLayout}
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
              <ViewportWorkspaceHost
                viewportId={primaryViewportId}
                onActivateViewerSurface={handleActivateViewerSurface}
              />
            </>
          ) : (
            <ViewportSurfaceRegistry
              slotId={slot.slotId}
              surfaceKind={slot.surfaceKind}
              surfaceInstanceId={slot.surfaceInstanceId}
              onActivateSpaghettiSurface={handleActivateSpaghettiSurface}
            />
          )}
        </ViewportFrame>
      )
    },
    [
      handleActivateSpaghettiSurface,
      handleActivateViewerSurface,
      handleViewportSlotFloat,
      handleViewportSlotHeaderDragOut,
      handleViewportSlotPopOut,
      handleViewportSlotSplit,
      handleViewportSlotSurfaceKindChange,
      browserPresentationMode,
      isBrowserCollapsed,
      primaryViewportId,
      setBrowserPresentationMode,
      viewportSlotsById,
      leftDockWidth,
      showSplitLayout,
      splitDirection,
      splitDockSide,
      splitPriority,
      splitRatio,
      isLeftDockViewportSplit,
      isBrowserDockPreviewActive,
      isMeatballDockPreviewActive,
      handleLeftDockResizeStart,
      handleLeftDockResizeContextMenu,
      handleLeftDockSplitTogglePointerDown,
      handleLeftDockSplitToggleClick,
      dockedBrowserHostRef,
      dockedMeatballHostRef,
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

  return (
    <div ref={appShellRef} className="AppShellRoot">
      <section
        ref={viewportRef}
        className="ViewportArea"
      >
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
          onActivateSpaghettiSurface={handleActivateSpaghettiSurface}
          onActivateSpaghettiFloatingWindow={handleActivateSpaghettiFloatingWindow}
          onOpenFloatingSplitMenu={handleFloatingSplitMenu}
          onOpenDividerSplitMenu={handleDividerSplitMenu}
          onResetSplitRatio={handleResetSplitRatio}
          leftDockWidthPreviewHandlerRef={leftDockWidthPreviewHandlerRef}
        />
        <ConsoleDock
          listLeftOffset={consoleListLeftOffset}
          suppressDockedSurface={suppressLegacyDockedConsoleSurface}
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
          <button
            type="button"
            className="PrimaryViewportLeftDockResizeMenuAction"
            onClick={() => handleSetSplitDirection('horizontal')}
          >
            Split Horizontal
          </button>
          <button
            type="button"
            className="PrimaryViewportLeftDockResizeMenuAction"
            onClick={() => handleSetSplitDirection('vertical')}
          >
            Split Vertical
          </button>
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
                  splitPriority === 'balanced' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('balanced')}
              >
                Balanced Priority
              </button>
              <button
                type="button"
                className={`PrimaryViewportLeftDockResizeMenuAction ${
                  splitPriority === 'favorFirst' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('favorFirst')}
              >
                Favor First Pane
              </button>
              <button
                type="button"
                className={`PrimaryViewportLeftDockResizeMenuAction ${
                  splitPriority === 'favorSecond' ? 'isActive' : ''
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
