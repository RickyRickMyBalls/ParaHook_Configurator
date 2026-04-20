import { useCallback, type RefObject } from 'react'
import type { EditorViewport } from '../spaghetti/schema/spaghettiTypes'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { appendConsoleEntry, useConsoleStore } from '../console/useConsoleStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import {
  defaultBrowserFloatingPosition,
  defaultBrowserFloatingSize,
  defaultPrimaryViewportSlotId,
  workspacePrimarySlotSupportsSurfaceKind,
  type WorkspaceDetachedSlotSurfaceState,
  type WorkspaceEditorSurfaceBinding,
  type WorkspaceLayoutNode,
  type WorkspaceViewportSlot,
} from '../workspace/workspaceShellTypes'
import { type WorkspaceSplitDockSide } from '../workspace/workspaceSplitTypes'
import {
  getWorkspaceSplitActionLabel,
  getWorkspaceViewportDisplayLabel,
} from '../workspace/workspaceViewportLabels'
import {
  getLatestViewerCameraPose,
  getViewer,
  restoreViewerCameraPose,
  setActiveViewer,
} from '../viewerBridge'

type ViewportSlotHeaderDragOutPayload = {
  pointerId: number
  clientX: number
  clientY: number
  headerRect: DOMRect
  frameRect: DOMRect
}

type UseAppShellViewportActionsInput = {
  activeDetachedBrowserSurface: WorkspaceDetachedSlotSurfaceState | null
  activeEditorViewport: EditorViewport | null
  appShellRef: RefObject<HTMLDivElement | null>
  browserSlotCount: number
  editorSurfaceBindingById: Record<string, WorkspaceEditorSurfaceBinding>
  editorSurfacePlacementById: Record<string, { windowMode?: string | null }>
  editorViewportsById: Record<string, EditorViewport>
  isBrowserViewportSplit: boolean
  isLeftDockViewportSplit: boolean
  primaryViewportId: string
  rootLeftSplitSlotIds: string[]
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  closeEditorViewport: (editorViewportId: string) => void
  createDetachedViewportSurfaceCopy: (
    sourceViewportId: string,
    hostMode: 'floating' | 'popout',
  ) => WorkspaceDetachedSlotSurfaceState | null
  detachViewportSlotSurface: (
    slotId: string,
    hostMode: 'floating' | 'popout',
  ) => WorkspaceDetachedSlotSurfaceState | null
  floatWorkspaceSurface: (
    surfaceInstanceId: string,
  ) => WorkspaceDetachedSlotSurfaceState | null
  onStartConsoleViewportSlotHeaderDragOut: (
    slotId: string,
    payload: ViewportSlotHeaderDragOutPayload,
  ) => void
  popoutWorkspaceSurface: (
    surfaceInstanceId: string,
  ) => WorkspaceDetachedSlotSurfaceState | string | null
  removeViewportSlot: (slotId: string) => void
  restoreDetachedSurfaceByKind: (
    surfaceKind: WorkspaceViewportSlot['surfaceKind'],
    options?: {
      routeId?: string
      splitDockSide?: WorkspaceSplitDockSide
    },
  ) => string | null
  setActiveSurface: (surface: 'console' | 'browser' | 'spaghetti' | 'viewer' | null) => void
  setActiveViewerViewportId: (viewportId: string) => void
  setBrowserFloatingPosition: (position: { x: number; y: number }) => void
  setBrowserFloatingSize: (size: { width: number; height: number }) => void
  setBrowserSlotHeaderDragSeed: (seed: {
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null) => void
  setBrowserViewportSplitRatio: (splitRatio: number) => void
  setIsBrowserPoppedOut: (isPoppedOut: boolean) => void
  setIsBrowserViewportSplit: (isViewportSplit: boolean) => void
  setIsLeftDockViewportSplit: (isSplit: boolean) => void
  setLeftDockResizeMenu: (menu: { x: number; y: number } | null) => void
  setSpaghettiSlotHeaderDragSeed: (seed: {
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null) => void
  setViewportSlotSurfaceKind: (
    slotId: string,
    surfaceKind: WorkspaceViewportSlot['surfaceKind'],
    options?: {
      surfaceInstanceId?: string
      discardRetainedSurfaceKinds?: WorkspaceViewportSlot['surfaceKind'][]
    },
  ) => void
  splitViewportSlot: (
    slotId: string,
    splitDockSide: WorkspaceSplitDockSide,
    options?: {
      surfaceKind?: WorkspaceViewportSlot['surfaceKind']
      surfaceInstanceId?: string
      preferredRatio?: number
    },
  ) => string | null
}

const collectLeafSlotIdsFromLayoutNode = (
  nodeId: string,
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>,
): string[] => {
  const node = viewportLayoutNodesById[nodeId]
  if (node === undefined) {
    return []
  }
  if (node.kind === 'leaf') {
    return [node.slotId]
  }
  return [
    ...collectLeafSlotIdsFromLayoutNode(node.firstChildId, viewportLayoutNodesById),
    ...collectLeafSlotIdsFromLayoutNode(node.secondChildId, viewportLayoutNodesById),
  ]
}

export function useAppShellViewportActions(input: UseAppShellViewportActionsInput) {
  const {
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
    onStartConsoleViewportSlotHeaderDragOut,
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
  } = input

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
    (
      currentSlot: Pick<
        WorkspaceViewportSlot,
        'surfaceInstanceId' | 'retainedSurfaceInstanceIdsByKind'
      >,
    ) => {
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

  const handleCloseViewportSlotFromMenu = useCallback(
    (slotId: string) => {
      const slot = viewportSlotsById[slotId] ?? null
      if (slot === null) {
        return
      }
      if (slotId === defaultPrimaryViewportSlotId) {
        if (slot.surfaceKind === 'modelViewer') {
          setViewportSlotSurfaceKind(slotId, 'homePage')
        }
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

  const handleViewportSlotSplit = useCallback(
    (slotId: string, splitDockSide: WorkspaceSplitDockSide) => {
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
      const sourceViewportLabel = getWorkspaceViewportDisplayLabel(
        viewportSlotsById,
        primaryViewportId,
        sourceSlot.surfaceInstanceId,
      )
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
      if (
        sourceSlot.surfaceKind === 'modelViewer' &&
        nextSlotId !== null &&
        sourceCameraPose !== null
      ) {
        const nextSlot = useWorkspaceStore.getState().viewportSlotsById[nextSlotId] ?? null
        if (nextSlot !== null) {
          restoreViewerCameraPose(nextSlot.surfaceInstanceId, sourceCameraPose)
        }
      }
      if (nextSlotId !== null && sourceViewportLabel !== null) {
        appendConsoleEntry({
          layer: 'App',
          severity: 'info',
          source: 'app',
          text: `User selected: ${sourceViewportLabel} > ${getWorkspaceSplitActionLabel(splitDockSide)}`,
        })
      }
    },
    [
      appShellRef,
      createDuplicatedEditorSurfaceInstanceId,
      primaryViewportId,
      splitViewportSlot,
      viewportSlotsById,
    ],
  )

  const handleViewportSlotSurfaceKindChange = useCallback(
    (slotId: string, nextSurfaceKind: WorkspaceViewportSlot['surfaceKind']) => {
      const currentSlot = viewportSlotsById[slotId] ?? null
      if (currentSlot === null) {
        return
      }
      if (
        slotId === defaultPrimaryViewportSlotId &&
        !workspacePrimarySlotSupportsSurfaceKind(nextSurfaceKind)
      ) {
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
      if (
        currentSlot.surfaceKind === 'browser' &&
        browserSlotCount <= 1 &&
        isBrowserViewportSplit
      ) {
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
      setBrowserFloatingPosition,
      setBrowserFloatingSize,
      setIsBrowserViewportSplit,
      viewportSlotsById,
    ],
  )

  const handleViewportSlotHeaderDragOut = useCallback(
    (slotId: string, payload: ViewportSlotHeaderDragOutPayload) => {
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
        onStartConsoleViewportSlotHeaderDragOut(slotId, payload)
        return
      }
      handleViewportSlotFloat(slotId, {
        preserveBrowserFloatingShell: slot.surfaceKind === 'browser',
      })
    },
    [
      appShellRef,
      handleViewportSlotFloat,
      onStartConsoleViewportSlotHeaderDragOut,
      setBrowserFloatingPosition,
      setBrowserFloatingSize,
      setBrowserSlotHeaderDragSeed,
      setSpaghettiSlotHeaderDragSeed,
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
          nextWorkspaceState.viewportLayoutNodesById[nextWorkspaceState.viewportSlotRootNodeId] ??
          null
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
    appShellRef,
    isLeftDockViewportSplit,
    removeViewportSlot,
    restoreDetachedSurfaceByKind,
    rootLeftSplitSlotIds,
    setBrowserViewportSplitRatio,
    setIsLeftDockViewportSplit,
    setLeftDockResizeMenu,
    setViewportSlotSurfaceKind,
    splitViewportSlot,
    viewportLayoutNodesById,
  ])

  return {
    handleCloseViewportSlotFromMenu,
    handleViewportSlotSplit,
    handleViewportSlotSurfaceKindChange,
    handleViewportSlotFloat,
    handleViewportSlotHeaderDragOut,
    handleViewportSlotPopOut,
    handleTogglePrimaryLeftDockSlotSplit,
  }
}
