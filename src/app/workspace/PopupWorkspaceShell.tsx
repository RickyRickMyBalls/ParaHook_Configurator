import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'
import { BrowserPanel } from '../panels/BrowserPanel'
import { ConsoleBar } from '../console/ConsoleBar'
import { ConsolePanel } from '../console/ConsolePanel'
import { SpaghettiPanel } from '../panels/SpaghettiPanel'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import {
  createDefaultWorkspaceLayoutLeafNode,
  createDefaultWorkspaceViewportSlot,
  createNextWorkspaceGeneratedId,
  createWorkspaceSurfaceInstanceIdForSlot,
  type WorkspaceLayoutNode,
  type WorkspaceLayoutNodeId,
  type WorkspaceSurfaceKind,
  type WorkspaceViewportSlot,
  type WorkspaceViewportSlotId,
} from './workspaceShellTypes'
import { ViewportFrame } from './ViewportFrame'
import { ViewportOverlayModeTitlebarControls } from './ViewportOverlayModeTitlebarControls'
import { ViewportWorkspaceHost } from './ViewportWorkspaceHost'
import {
  resolveWorkspaceSplitDirectionForDockSide,
  type WorkspaceSplitDockSide,
} from './workspaceSplitTypes'

const popupAvailableSurfaceKinds: readonly WorkspaceSurfaceKind[] = [
  'modelViewer',
  'spaghettiEditor',
  'console',
  'browser',
]
const popupSplitDividerHeight = 5
const popupMinSplitRatio = 0.15
const popupMaxSplitRatio = 0.85

const clampPopupSplitRatio = (ratio: number): number =>
  Math.min(popupMaxSplitRatio, Math.max(popupMinSplitRatio, ratio))

const isHtmlDivLikeElement = (value: Element | null): value is HTMLDivElement =>
  value !== null && value.tagName === 'DIV'

type PopupWorkspaceStoreState = {
  viewportSlotRootNodeId: WorkspaceLayoutNodeId
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>
  activeSlotId: WorkspaceViewportSlotId
  splitViewportSlot: (
    slotId: WorkspaceViewportSlotId,
    splitDockSide: WorkspaceSplitDockSide,
    options?: {
      surfaceKind?: WorkspaceSurfaceKind
      surfaceInstanceId?: string
    },
  ) => WorkspaceViewportSlotId | null
  setViewportSlotSurfaceKind: (
    slotId: WorkspaceViewportSlotId,
    surfaceKind: WorkspaceSurfaceKind,
    options?: {
      surfaceInstanceId?: string
      discardRetainedSurfaceKinds?: WorkspaceSurfaceKind[]
    },
  ) => void
  setViewportLayoutSplitRatio: (nodeId: WorkspaceLayoutNodeId, ratio: number) => void
  setActiveSlotId: (slotId: WorkspaceViewportSlotId) => void
  removeViewportSlot: (slotId: WorkspaceViewportSlotId) => void
}

type PopupWorkspaceShellProps = {
  popupWorkspaceId: string
  rootSurfaceKind?: WorkspaceSurfaceKind
  rootSurfaceInstanceId: string
  initialSplitDockSide?: WorkspaceSplitDockSide | null
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
  onManagedViewportIdsChange?: (editorViewportIds: string[]) => void
  onQuickDockRoot?: () => void
  onCloseRoot?: () => void
  onCollapseToRootSurface?: () => void
}

const findParentSplitNodeId = (
  nodesById: Record<string, WorkspaceLayoutNode>,
  childNodeId: WorkspaceLayoutNodeId,
): WorkspaceLayoutNodeId | null => {
  for (const node of Object.values(nodesById)) {
    if (node.kind !== 'split') {
      continue
    }
    if (node.firstChildId === childNodeId || node.secondChildId === childNodeId) {
      return node.nodeId
    }
  }
  return null
}

const createPopupWorkspaceStore = (
  popupWorkspaceId: string,
  rootSurfaceKind: WorkspaceSurfaceKind,
  rootSurfaceInstanceId: string,
) => {
  const initialSlotId = `${popupWorkspaceId}-slot-1`
  const initialLeafId = `${popupWorkspaceId}-leaf-1`

  return createStore<PopupWorkspaceStoreState>((set, get) => ({
    viewportSlotRootNodeId: initialLeafId,
    viewportSlotsById: {
      [initialSlotId]: {
        ...createDefaultWorkspaceViewportSlot(initialSlotId, rootSurfaceKind, initialLeafId),
        surfaceInstanceId: rootSurfaceInstanceId,
        hostViewportId: rootSurfaceKind === 'modelViewer' ? rootSurfaceInstanceId : null,
        retainedSurfaceInstanceIdsByKind: {
          [rootSurfaceKind]: rootSurfaceInstanceId,
        },
      },
    },
    viewportLayoutNodesById: {
      [initialLeafId]: createDefaultWorkspaceLayoutLeafNode(initialLeafId, initialSlotId),
    },
    activeSlotId: initialSlotId,
    splitViewportSlot: (slotId, splitDockSide, options) => {
      const state = get()
      const currentSlot = state.viewportSlotsById[slotId]
      if (currentSlot === undefined) {
        return null
      }
      const currentLeafNode = state.viewportLayoutNodesById[currentSlot.leafNodeId]
      if (currentLeafNode?.kind !== 'leaf') {
        return null
      }

      const nextSlotId = createNextWorkspaceGeneratedId(
        `${popupWorkspaceId}-slot`,
        Object.keys(state.viewportSlotsById),
      )
      const nextLeafNodeId = createNextWorkspaceGeneratedId(
        `${popupWorkspaceId}-leaf`,
        Object.keys(state.viewportLayoutNodesById),
      )
      const nextSplitNodeId = createNextWorkspaceGeneratedId(
        `${popupWorkspaceId}-split`,
        Object.keys(state.viewportLayoutNodesById),
      )
      const nextSurfaceKind = options?.surfaceKind ?? currentSlot.surfaceKind
      const nextSurfaceInstanceId =
        options?.surfaceInstanceId ??
        createWorkspaceSurfaceInstanceIdForSlot(nextSurfaceKind, nextSlotId)
      const nextSlot: WorkspaceViewportSlot = {
        ...createDefaultWorkspaceViewportSlot(nextSlotId, nextSurfaceKind, nextLeafNodeId),
        surfaceInstanceId: nextSurfaceInstanceId,
        hostViewportId: nextSurfaceKind === 'modelViewer' ? nextSurfaceInstanceId : null,
        retainedSurfaceInstanceIdsByKind: {
          [nextSurfaceKind]: nextSurfaceInstanceId,
        },
      }
      const nextLeafNode = createDefaultWorkspaceLayoutLeafNode(nextLeafNodeId, nextSlotId)
      const parentSplitNodeId = findParentSplitNodeId(
        state.viewportLayoutNodesById,
        currentSlot.leafNodeId,
      )
      const nextSplitNode: WorkspaceLayoutNode = {
        nodeId: nextSplitNodeId,
        kind: 'split',
        splitDirection: resolveWorkspaceSplitDirectionForDockSide(splitDockSide),
        splitDockSide,
        ratio: 0.5,
        firstChildId:
          splitDockSide === 'left' || splitDockSide === 'top'
            ? nextLeafNodeId
            : currentSlot.leafNodeId,
        secondChildId:
          splitDockSide === 'left' || splitDockSide === 'top'
            ? currentSlot.leafNodeId
            : nextLeafNodeId,
      }

      const nextViewportLayoutNodesById = {
        ...state.viewportLayoutNodesById,
        [nextLeafNodeId]: nextLeafNode,
        [nextSplitNodeId]: nextSplitNode,
      }
      if (parentSplitNodeId !== null) {
        const parentNode = nextViewportLayoutNodesById[parentSplitNodeId]
        if (parentNode?.kind === 'split') {
          nextViewportLayoutNodesById[parentSplitNodeId] =
            parentNode.firstChildId === currentSlot.leafNodeId
              ? { ...parentNode, firstChildId: nextSplitNodeId }
              : { ...parentNode, secondChildId: nextSplitNodeId }
        }
      }

      set({
        viewportSlotRootNodeId:
          state.viewportSlotRootNodeId === currentSlot.leafNodeId
            ? nextSplitNodeId
            : state.viewportSlotRootNodeId,
        viewportSlotsById: {
          ...state.viewportSlotsById,
          [nextSlotId]: nextSlot,
        },
        viewportLayoutNodesById: nextViewportLayoutNodesById,
        activeSlotId: nextSlotId,
      })
      return nextSlotId
    },
    setViewportSlotSurfaceKind: (slotId, surfaceKind, options) => {
      const state = get()
      const currentSlot = state.viewportSlotsById[slotId]
      if (currentSlot === undefined) {
        return
      }
      const nextRetainedSurfaceInstanceIdsByKind = {
        ...currentSlot.retainedSurfaceInstanceIdsByKind,
        [currentSlot.surfaceKind]: currentSlot.surfaceInstanceId,
      }
      for (const discardedSurfaceKind of options?.discardRetainedSurfaceKinds ?? []) {
        delete nextRetainedSurfaceInstanceIdsByKind[discardedSurfaceKind]
      }
      const nextSurfaceInstanceId =
        options?.surfaceInstanceId ??
        nextRetainedSurfaceInstanceIdsByKind[surfaceKind] ??
        createWorkspaceSurfaceInstanceIdForSlot(surfaceKind, slotId)
      set({
        viewportSlotsById: {
          ...state.viewportSlotsById,
          [slotId]: {
            ...currentSlot,
            surfaceKind,
            surfaceInstanceId: nextSurfaceInstanceId,
            hostViewportId: surfaceKind === 'modelViewer' ? nextSurfaceInstanceId : null,
            retainedSurfaceInstanceIdsByKind: {
              ...nextRetainedSurfaceInstanceIdsByKind,
              [surfaceKind]: nextSurfaceInstanceId,
            },
          },
        },
      })
    },
    setViewportLayoutSplitRatio: (nodeId, ratio) => {
      const state = get()
      const currentNode = state.viewportLayoutNodesById[nodeId]
      if (currentNode?.kind !== 'split') {
        return
      }
      set({
        viewportLayoutNodesById: {
          ...state.viewportLayoutNodesById,
          [nodeId]: {
            ...currentNode,
            ratio: clampPopupSplitRatio(ratio),
          },
        },
      })
    },
    setActiveSlotId: (slotId) => {
      if (get().viewportSlotsById[slotId] === undefined) {
        return
      }
      set({ activeSlotId: slotId })
    },
    removeViewportSlot: (slotId) => {
      const state = get()
      const currentSlot = state.viewportSlotsById[slotId]
      if (currentSlot === undefined) {
        return
      }
      const currentLeafNodeId = currentSlot.leafNodeId
      const parentSplitNodeId = findParentSplitNodeId(state.viewportLayoutNodesById, currentLeafNodeId)
      if (parentSplitNodeId === null) {
        return
      }
      const parentSplitNode = state.viewportLayoutNodesById[parentSplitNodeId]
      if (parentSplitNode?.kind !== 'split') {
        return
      }
      const siblingNodeId =
        parentSplitNode.firstChildId === currentLeafNodeId
          ? parentSplitNode.secondChildId
          : parentSplitNode.firstChildId
      const grandparentSplitNodeId = findParentSplitNodeId(
        state.viewportLayoutNodesById,
        parentSplitNodeId,
      )

      const nextViewportSlotsById = { ...state.viewportSlotsById }
      delete nextViewportSlotsById[slotId]

      const nextViewportLayoutNodesById = { ...state.viewportLayoutNodesById }
      delete nextViewportLayoutNodesById[currentLeafNodeId]
      delete nextViewportLayoutNodesById[parentSplitNodeId]

      let nextViewportSlotRootNodeId = state.viewportSlotRootNodeId
      if (grandparentSplitNodeId === null) {
        nextViewportSlotRootNodeId = siblingNodeId
      } else {
        const grandparentSplitNode = state.viewportLayoutNodesById[grandparentSplitNodeId]
        if (grandparentSplitNode?.kind !== 'split') {
          return
        }
        nextViewportLayoutNodesById[grandparentSplitNodeId] = {
          ...grandparentSplitNode,
          firstChildId:
            grandparentSplitNode.firstChildId === parentSplitNodeId
              ? siblingNodeId
              : grandparentSplitNode.firstChildId,
          secondChildId:
            grandparentSplitNode.secondChildId === parentSplitNodeId
              ? siblingNodeId
              : grandparentSplitNode.secondChildId,
        }
      }

      const nextActiveSlotId =
        state.activeSlotId === slotId
          ? (nextViewportLayoutNodesById[siblingNodeId]?.kind === 'leaf'
              ? nextViewportLayoutNodesById[siblingNodeId].slotId
              : state.activeSlotId)
          : state.activeSlotId

      set({
        viewportSlotRootNodeId: nextViewportSlotRootNodeId,
        viewportSlotsById: nextViewportSlotsById,
        viewportLayoutNodesById: nextViewportLayoutNodesById,
        activeSlotId: nextActiveSlotId,
      })
    },
  }))
}

export function PopupWorkspaceShell(props: PopupWorkspaceShellProps) {
  const {
    popupWorkspaceId,
    rootSurfaceKind = 'spaghettiEditor',
    rootSurfaceInstanceId,
    initialSplitDockSide = null,
    onActivateSpaghettiSurface,
    onActivateViewerSurface,
    onCreatePopupSpaghettiViewport,
    onClosePopupSpaghettiViewport,
    onManagedViewportIdsChange,
    onCollapseToRootSurface,
  } = props
  const rootGraphDocumentId = useSpaghettiStore(
    (state) =>
      rootSurfaceKind === 'spaghettiEditor'
        ? state.editorViewportsById[rootSurfaceInstanceId]?.graphDocumentId ?? null
        : null,
  )
  const editorViewportsById = useSpaghettiStore((state) => state.editorViewportsById)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const popupWorkspaceStoreRef = useRef<ReturnType<typeof createPopupWorkspaceStore> | null>(null)
  if (popupWorkspaceStoreRef.current === null) {
    popupWorkspaceStoreRef.current = createPopupWorkspaceStore(
      popupWorkspaceId,
      rootSurfaceKind,
      rootSurfaceInstanceId,
    )
  }
  const popupWorkspaceStore = popupWorkspaceStoreRef.current
  const viewportSlotRootNodeId = useStore(
    popupWorkspaceStore,
    (state) => state.viewportSlotRootNodeId,
  )
  const viewportSlotsById = useStore(popupWorkspaceStore, (state) => state.viewportSlotsById)
  const viewportLayoutNodesById = useStore(
    popupWorkspaceStore,
    (state) => state.viewportLayoutNodesById,
  )
  const [ownedEditorViewportIds, setOwnedEditorViewportIds] = useState<string[]>([])
  const hasAppliedInitialSplitRef = useRef(false)
  const hasRenderedMultiViewportRef = useRef(false)
  const dividerResizeStateRef = useRef<{
    pointerId: number
    nodeId: WorkspaceLayoutNodeId
    splitDirection: 'vertical' | 'horizontal'
    splitDockSide: WorkspaceSplitDockSide
    layoutElement: HTMLDivElement
    ownerDocument: Document
  } | null>(null)

  useEffect(() => {
    onManagedViewportIdsChange?.(ownedEditorViewportIds)
  }, [onManagedViewportIdsChange, ownedEditorViewportIds])

  useEffect(() => {
    const viewportSlots = Object.values(viewportSlotsById)
    if (viewportSlots.length > 1) {
      hasRenderedMultiViewportRef.current = true
      return
    }
    if (!hasRenderedMultiViewportRef.current) {
      return
    }
    const onlySlot = viewportSlots[0] ?? null
    if (
      onlySlot === null ||
      viewportSlotRootNodeId !== onlySlot.leafNodeId ||
      onlySlot.slotId !== `${popupWorkspaceId}-slot-1` ||
      onlySlot.surfaceKind !== rootSurfaceKind ||
      onlySlot.surfaceInstanceId !== rootSurfaceInstanceId
    ) {
      return
    }
    onCollapseToRootSurface?.()
  }, [
    onCollapseToRootSurface,
    popupWorkspaceId,
    rootSurfaceInstanceId,
    rootSurfaceKind,
    viewportSlotRootNodeId,
    viewportSlotsById,
  ])

  const closeOwnedEditorViewport = useCallback(
    (editorViewportId: string) => {
      onClosePopupSpaghettiViewport(editorViewportId)
      setOwnedEditorViewportIds((current) =>
        current.filter((currentEditorViewportId) => currentEditorViewportId !== editorViewportId),
      )
    },
    [onClosePopupSpaghettiViewport],
  )

  const createPopupSpaghettiViewport = useCallback(
    (preferredGraphDocumentId: string | null) => {
      const nextGraphDocumentId = preferredGraphDocumentId ?? rootGraphDocumentId
      if (nextGraphDocumentId === null) {
        return null
      }
      const nextEditorViewportId = onCreatePopupSpaghettiViewport(nextGraphDocumentId)
      if (nextEditorViewportId === null) {
        return null
      }
      setOwnedEditorViewportIds((current) =>
        current.includes(nextEditorViewportId) ? current : [...current, nextEditorViewportId],
      )
      if (rootSurfaceKind === 'spaghettiEditor') {
        setActiveEditorViewportId(rootSurfaceInstanceId)
      }
      return nextEditorViewportId
    },
    [
      onCreatePopupSpaghettiViewport,
      rootGraphDocumentId,
      rootSurfaceInstanceId,
      rootSurfaceKind,
      setActiveEditorViewportId,
    ],
  )

  const handleSplitSlot = useCallback(
    (slotId: WorkspaceViewportSlotId, splitDockSide: WorkspaceSplitDockSide) => {
      const currentSlot = popupWorkspaceStore.getState().viewportSlotsById[slotId]
      if (currentSlot === undefined) {
        return
      }
      const nextSurfaceKind = currentSlot.surfaceKind
      const nextSurfaceInstanceId =
        nextSurfaceKind === 'spaghettiEditor'
          ? createPopupSpaghettiViewport(
              editorViewportsById[currentSlot.surfaceInstanceId]?.graphDocumentId ?? rootGraphDocumentId,
            )
          : undefined
      if (nextSurfaceKind === 'spaghettiEditor' && nextSurfaceInstanceId === null) {
        return
      }
      popupWorkspaceStore
        .getState()
        .splitViewportSlot(slotId, splitDockSide, {
          surfaceKind: nextSurfaceKind,
          surfaceInstanceId: nextSurfaceInstanceId ?? undefined,
        })
    },
    [createPopupSpaghettiViewport, editorViewportsById, popupWorkspaceStore, rootGraphDocumentId],
  )

  useEffect(() => {
    if (initialSplitDockSide === null) {
      return
    }
    if (hasAppliedInitialSplitRef.current) {
      return
    }
    hasAppliedInitialSplitRef.current = true
    handleSplitSlot(`${popupWorkspaceId}-slot-1`, initialSplitDockSide)
  }, [handleSplitSlot, initialSplitDockSide, popupWorkspaceId])

  const handleRequestSurfaceKind = useCallback(
    (slotId: WorkspaceViewportSlotId, nextSurfaceKind: WorkspaceSurfaceKind) => {
      const currentSlot = popupWorkspaceStore.getState().viewportSlotsById[slotId]
      if (currentSlot === undefined || currentSlot.surfaceKind === nextSurfaceKind) {
        return
      }

      const discardRetainedSurfaceKinds: WorkspaceSurfaceKind[] = []
      if (
        currentSlot.surfaceKind === 'spaghettiEditor' &&
        currentSlot.surfaceInstanceId !== rootSurfaceInstanceId &&
        ownedEditorViewportIds.includes(currentSlot.surfaceInstanceId)
      ) {
        closeOwnedEditorViewport(currentSlot.surfaceInstanceId)
        discardRetainedSurfaceKinds.push('spaghettiEditor')
      }

      let nextSurfaceInstanceId: string | undefined
      if (nextSurfaceKind === 'spaghettiEditor') {
        const retainedSpaghettiViewportId =
          currentSlot.retainedSurfaceInstanceIdsByKind.spaghettiEditor ?? null
        if (retainedSpaghettiViewportId === rootSurfaceInstanceId) {
          nextSurfaceInstanceId = retainedSpaghettiViewportId
        } else if (
          retainedSpaghettiViewportId !== null &&
          ownedEditorViewportIds.includes(retainedSpaghettiViewportId)
        ) {
          nextSurfaceInstanceId = retainedSpaghettiViewportId
        } else {
          nextSurfaceInstanceId =
            createPopupSpaghettiViewport(rootGraphDocumentId) ?? undefined
        }
      }

      popupWorkspaceStore.getState().setViewportSlotSurfaceKind(slotId, nextSurfaceKind, {
        surfaceInstanceId: nextSurfaceInstanceId,
        discardRetainedSurfaceKinds,
      })
    },
    [
      closeOwnedEditorViewport,
      createPopupSpaghettiViewport,
      ownedEditorViewportIds,
      popupWorkspaceStore,
      rootSurfaceInstanceId,
      rootGraphDocumentId,
    ],
  )

  const handleCloseSlot = useCallback(
    (slotId: WorkspaceViewportSlotId) => {
      const currentSlot = popupWorkspaceStore.getState().viewportSlotsById[slotId] ?? null
      if (currentSlot === null) {
        return
      }
      const isRootSpaghettiSlot =
        slotId === `${popupWorkspaceId}-slot-1` &&
        currentSlot.surfaceKind === rootSurfaceKind &&
        currentSlot.surfaceInstanceId === rootSurfaceInstanceId
      if (isRootSpaghettiSlot) {
        return
      }
      popupWorkspaceStore.getState().removeViewportSlot(slotId)
      if (
        currentSlot.surfaceKind === 'spaghettiEditor' &&
        ownedEditorViewportIds.includes(currentSlot.surfaceInstanceId)
      ) {
        closeOwnedEditorViewport(currentSlot.surfaceInstanceId)
      }
    },
    [
      closeOwnedEditorViewport,
      ownedEditorViewportIds,
      popupWorkspaceId,
      popupWorkspaceStore,
      rootSurfaceInstanceId,
      rootSurfaceKind,
    ],
  )

  const handleSplitDividerPointerDown = useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
      nodeId: WorkspaceLayoutNodeId,
      splitDirection: 'vertical' | 'horizontal',
      splitDockSide: WorkspaceSplitDockSide,
    ) => {
      if (event.button !== 0) {
        return
      }
      const layoutElement = event.currentTarget.closest('.ViewportSplitLayout')
      if (!isHtmlDivLikeElement(layoutElement)) {
        return
      }
      const ownerDocument = layoutElement.ownerDocument
      const handlePointerMove = (moveEvent: PointerEvent) => {
        const resizeState = dividerResizeStateRef.current
        if (resizeState === null || resizeState.pointerId !== moveEvent.pointerId) {
          return
        }
        const rect = resizeState.layoutElement.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) {
          return
        }
        const nextRatio =
          resizeState.splitDirection === 'vertical'
            ? resizeState.splitDockSide === 'left'
              ? (moveEvent.clientX - rect.left) / rect.width
              : (rect.right - moveEvent.clientX) / rect.width
            : resizeState.splitDockSide === 'top'
              ? (moveEvent.clientY - rect.top) / rect.height
              : (rect.bottom - moveEvent.clientY) / rect.height
        popupWorkspaceStore
          .getState()
          .setViewportLayoutSplitRatio(nodeId, clampPopupSplitRatio(nextRatio))
      }
      const stopResize = (pointerId?: number) => {
        const resizeState = dividerResizeStateRef.current
        if (
          resizeState === null ||
          (pointerId !== undefined && resizeState.pointerId !== pointerId)
        ) {
          return
        }
        ownerDocument.removeEventListener('pointermove', handlePointerMove)
        ownerDocument.removeEventListener('pointerup', handlePointerUp)
        ownerDocument.removeEventListener('pointercancel', handlePointerCancel)
        dividerResizeStateRef.current = null
      }
      const handlePointerUp = (upEvent: PointerEvent) => {
        stopResize(upEvent.pointerId)
      }
      const handlePointerCancel = (cancelEvent: PointerEvent) => {
        stopResize(cancelEvent.pointerId)
      }

      dividerResizeStateRef.current = {
        pointerId: event.pointerId,
        nodeId,
        splitDirection,
        splitDockSide,
        layoutElement,
        ownerDocument,
      }
      ownerDocument.addEventListener('pointermove', handlePointerMove)
      ownerDocument.addEventListener('pointerup', handlePointerUp)
      ownerDocument.addEventListener('pointercancel', handlePointerCancel)
      event.preventDefault()
      event.stopPropagation()
    },
    [popupWorkspaceStore],
  )

  const renderConsoleSurface = useCallback(
    (slotId: WorkspaceViewportSlotId) => (
      <div
        className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--console"
        onPointerDownCapture={() => popupWorkspaceStore.getState().setActiveSlotId(slotId)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          height: '100%',
        }}
      >
        <ConsolePanel
          surfaceMode="docked"
          isVisible
          onFloatToggle={() => {}}
          onPopoutToggle={() => {}}
          onListToggle={() => {}}
        />
        <ConsoleBar
          surfaceMode="docked"
          showExpandToggle
        />
      </div>
    ),
    [popupWorkspaceStore],
  )

  const renderBrowserSurface = useCallback(
    (slotId: WorkspaceViewportSlotId) => (
      <div
        className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--browser"
        onPointerDownCapture={() => popupWorkspaceStore.getState().setActiveSlotId(slotId)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          height: '100%',
        }}
      >
        <BrowserPanel showTitleBar={false} />
      </div>
    ),
    [popupWorkspaceStore],
  )

  const renderViewportSlot = useCallback(
    (slotId: WorkspaceViewportSlotId): ReactNode => {
      const slot = viewportSlotsById[slotId] ?? null
      if (slot === null) {
        return null
      }
      return (
        <ViewportFrame
          key={slot.slotId}
          slotId={slot.slotId}
          surfaceKind={slot.surfaceKind}
          availableSurfaceKinds={popupAvailableSurfaceKinds}
          enableHeaderStripContextMenu={slot.surfaceKind === 'browser'}
          headerSupplement={
            slot.surfaceKind === 'modelViewer' ? (
              <ViewportOverlayModeTitlebarControls viewportId={slot.surfaceInstanceId} />
            ) : undefined
          }
          headerSupplementAlignment={slot.surfaceKind === 'modelViewer' ? 'start' : 'end'}
          onActivateSurface={() => popupWorkspaceStore.getState().setActiveSlotId(slot.slotId)}
          onRequestSurfaceKind={(surfaceKind) => handleRequestSurfaceKind(slot.slotId, surfaceKind)}
          onSplitTop={() => handleSplitSlot(slot.slotId, 'top')}
          onSplitRight={() => handleSplitSlot(slot.slotId, 'right')}
          onSplitBottom={() => handleSplitSlot(slot.slotId, 'bottom')}
          onSplitLeft={() => handleSplitSlot(slot.slotId, 'left')}
          onClose={
            slot.slotId === `${popupWorkspaceId}-slot-1` &&
            slot.surfaceKind === rootSurfaceKind &&
            slot.surfaceInstanceId === rootSurfaceInstanceId
              ? undefined
              : () => handleCloseSlot(slot.slotId)
          }
        >
          {slot.surfaceKind === 'modelViewer' ? (
            <div className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--viewer">
              <ViewportWorkspaceHost
                viewportId={slot.surfaceInstanceId}
                onActivateViewerSurface={onActivateViewerSurface}
              />
            </div>
          ) : slot.surfaceKind === 'console' ? (
            renderConsoleSurface(slot.slotId)
          ) : slot.surfaceKind === 'browser' ? (
            renderBrowserSurface(slot.slotId)
          ) : (
            <div className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--spaghetti">
              <SpaghettiPanel
                editorViewportId={slot.surfaceInstanceId}
                onActivateEditorContext={onActivateSpaghettiSurface}
                activateOnPointerDownCapture
              />
            </div>
          )}
        </ViewportFrame>
      )
    },
    [
      handleRequestSurfaceKind,
      handleCloseSlot,
      renderBrowserSurface,
      renderConsoleSurface,
      handleSplitSlot,
      onActivateSpaghettiSurface,
      onActivateViewerSurface,
      viewportSlotsById,
      popupWorkspaceStore,
    ],
  )

  const renderViewportLayoutNode = useCallback(
    (nodeId: WorkspaceLayoutNodeId): ReactNode => {
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
                  ? `${splitRatio}fr ${popupSplitDividerHeight}px ${1 - splitRatio}fr`
                  : `${1 - splitRatio}fr ${popupSplitDividerHeight}px ${splitRatio}fr`
                : 'minmax(0, 1fr)',
            gridTemplateRows:
              node.splitDirection === 'vertical'
                ? 'minmax(0, 1fr)'
                : node.splitDockSide === 'top'
                  ? `${splitRatio}fr ${popupSplitDividerHeight}px ${1 - splitRatio}fr`
                  : `${1 - splitRatio}fr ${popupSplitDividerHeight}px ${splitRatio}fr`,
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
          <div
            className="ViewportSplitDividerShell"
            style={{
              gridArea: 'divider',
              cursor: node.splitDirection === 'vertical' ? 'col-resize' : 'row-resize',
            }}
            onPointerDown={(event) =>
              handleSplitDividerPointerDown(
                event,
                node.nodeId,
                node.splitDirection,
                node.splitDockSide,
              )
            }
          >
            <div className="ViewportSplitDivider" aria-hidden="true" />
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
    [handleSplitDividerPointerDown, renderViewportSlot, viewportLayoutNodesById],
  )

  return (
    <div
      className="PopupWorkspaceShell"
      data-popup-workspace-id={popupWorkspaceId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
        {renderViewportLayoutNode(viewportSlotRootNodeId)}
      </div>
    </div>
  )
}
