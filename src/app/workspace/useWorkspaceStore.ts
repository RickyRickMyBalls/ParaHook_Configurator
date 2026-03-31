import { create } from 'zustand'
import {
  defaultBrowserPresentationMode,
  defaultBrowserToolbarOwnerSurfaceInstanceId,
  createNextWorkspaceGeneratedId,
  createDefaultWorkspaceLayoutSplitNode,
  createDefaultWorkspaceSlotTree,
  createDefaultEditorWorkspaceSurfaceState,
  createDefaultWorkspaceViewportChromeState,
  createDefaultWorkspaceViewportLocalViewState,
  createDefaultWorkspaceViewportSlot,
  createWorkspaceSurfaceInstanceIdForSlot,
  defaultBrowserFloatingPosition,
  defaultBrowserPopoutState,
  defaultBrowserFloatingSize,
  defaultBrowserViewportSplitDockSide,
  defaultBrowserViewportSplitRatio,
  defaultLeftDockWidth,
  defaultPrimaryWorkspaceViewportId,
  defaultPrimaryViewportSlotId,
  defaultSecondaryViewportSlotId,
  defaultViewportLayoutRootNodeId,
  type BrowserShellState,
  type BrowserPresentationMode,
  type BrowserFloatingPosition,
  type BrowserFloatingSize,
  type EditorWorkspaceSurfaceState,
  type WorkspaceDetachedSlotSurfaceState,
  type WorkspaceEditorSurfaceBinding,
  type WorkspaceLayoutNode,
  type WorkspaceLayoutNodeId,
  type LeftDockPanelId,
  type LeftDockResizeMenuState,
  type PersistedWorkspaceLayout,
  type WorkspacePopoutSurfaceState,
  type WorkspaceSurfaceKind,
  type WorkspaceViewportSlot,
  type WorkspaceViewportSlotId,
  type WorkspaceViewportChromeState,
  type WorkspaceViewportLocalViewState,
  type WorkspaceViewportId,
  type WorkspaceSplitMenuState,
  type WorkspaceSurfaceInstanceId,
} from './workspaceShellTypes'
import {
  resolveWorkspaceSplitDirectionForDockSide,
  type WorkspaceSplitDockSide,
} from './workspaceSplitTypes'

type WorkspaceStoreState = {
  leftDockWidth: number
  isLeftDockViewportSplit: boolean
  activeLeftDockPreviewPanelId: LeftDockPanelId | null
  leftDockResizeMenu: LeftDockResizeMenuState | null
  workspaceSplitMenu: WorkspaceSplitMenuState | null
  browserToolbarOwnerSurfaceInstanceId: WorkspaceSurfaceInstanceId | null
  browserShell: BrowserShellState
  activeViewerViewportId: WorkspaceViewportId
  primaryViewportId: WorkspaceViewportId
  viewportChromeById: Record<string, WorkspaceViewportChromeState>
  viewportSlotRootNodeId: WorkspaceLayoutNodeId
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>
  detachedSlotSurfaceById: Record<string, WorkspaceDetachedSlotSurfaceState>
  editorSurfacePlacementById: Record<string, EditorWorkspaceSurfaceState>
  editorSurfaceBindingById: Record<string, WorkspaceEditorSurfaceBinding>
  setLeftDockWidth: (width: number) => void
  setLeftDockViewportSplit: (isSplit: boolean) => void
  setActiveLeftDockPreviewPanelId: (panelId: LeftDockPanelId | null) => void
  setLeftDockResizeMenu: (menu: LeftDockResizeMenuState | null) => void
  setWorkspaceSplitMenu: (menu: WorkspaceSplitMenuState | null) => void
  setBrowserToolbarOwnerSurfaceInstanceId: (
    surfaceInstanceId: WorkspaceSurfaceInstanceId | null,
  ) => void
  setBrowserCollapsed: (isCollapsed: boolean) => void
  setBrowserPresentationMode: (presentationMode: BrowserPresentationMode) => void
  setBrowserFloating: (isFloating: boolean) => void
  setBrowserPoppedOut: (isPoppedOut: boolean) => void
  setBrowserViewportSplit: (isViewportSplit: boolean) => void
  setBrowserFloatingPosition: (position: BrowserFloatingPosition) => void
  setBrowserFloatingSize: (size: BrowserFloatingSize) => void
  setBrowserViewportSplitRatio: (splitRatio: number) => void
  setBrowserViewportSplitDockSide: (splitDockSide: WorkspaceSplitDockSide) => void
  setBrowserPopoutState: (popoutState: WorkspacePopoutSurfaceState | null) => void
  showViewportSplitSlot: (
    surfaceKind: WorkspaceSurfaceKind,
    splitDockSide: WorkspaceSplitDockSide,
  ) => void
  hideViewportSplitSlot: () => void
  splitViewportSlot: (
    slotId: WorkspaceViewportSlotId,
    splitDockSide: WorkspaceSplitDockSide,
    options?: {
      surfaceKind?: WorkspaceSurfaceKind
      surfaceInstanceId?: string
      preferredRatio?: number
    },
  ) => WorkspaceViewportSlotId | null
  splitViewportRoot: (
    splitDockSide: WorkspaceSplitDockSide,
    options?: {
      surfaceKind?: WorkspaceSurfaceKind
      surfaceInstanceId?: string
      preferredRatio?: number
      hostViewportId?: WorkspaceViewportId | null
    },
  ) => WorkspaceViewportSlotId | null
  setViewportLayoutSplitRatio: (nodeId: WorkspaceLayoutNodeId, ratio: number) => void
  removeViewportSlot: (slotId: WorkspaceViewportSlotId) => void
  detachViewportSlotSurface: (
    slotId: WorkspaceViewportSlotId,
    hostMode: 'floating' | 'popout',
  ) => WorkspaceDetachedSlotSurfaceState | null
  clearDetachedSlotSurface: (surfaceInstanceId: string) => void
  redockDetachedSurface: (
    surfaceInstanceId: string,
    splitDockSide?: WorkspaceSplitDockSide,
  ) => WorkspaceViewportSlotId | null
  setViewportSlotSurfaceKind: (
    slotId: WorkspaceViewportSlotId,
    surfaceKind: WorkspaceSurfaceKind,
    options?: {
      surfaceInstanceId?: string
    },
  ) => void
  hydratePersistedWorkspaceLayout: (layout: PersistedWorkspaceLayout) => void
  setActiveViewerViewportId: (viewportId: WorkspaceViewportId) => void
  ensureViewportChrome: (viewportId: WorkspaceViewportId) => void
  setViewportLocalViewState: (
    viewportId: WorkspaceViewportId,
    patch: Partial<WorkspaceViewportLocalViewState>,
  ) => void
  ensureEditorSurfacePlacement: (
    surfaceInstanceId: string,
    seed?: Partial<EditorWorkspaceSurfaceState>,
  ) => void
  setEditorSurfaceBinding: (surfaceInstanceId: string, graphDocumentId: string) => void
  removeEditorSurfaceBinding: (surfaceInstanceId: string) => void
  setEditorSurfacePlacement: (
    surfaceInstanceId: string,
    placement: EditorWorkspaceSurfaceState,
  ) => void
  removeEditorSurfacePlacement: (surfaceInstanceId: string) => void
}

const createInitialState = (): Omit<
  WorkspaceStoreState,
  | 'setLeftDockWidth'
  | 'setLeftDockViewportSplit'
  | 'setActiveLeftDockPreviewPanelId'
  | 'setLeftDockResizeMenu'
  | 'setWorkspaceSplitMenu'
  | 'setBrowserToolbarOwnerSurfaceInstanceId'
  | 'setBrowserCollapsed'
  | 'setBrowserPresentationMode'
  | 'setBrowserFloating'
  | 'setBrowserPoppedOut'
  | 'setBrowserViewportSplit'
  | 'setBrowserFloatingPosition'
  | 'setBrowserFloatingSize'
  | 'setBrowserViewportSplitRatio'
  | 'setBrowserViewportSplitDockSide'
  | 'setBrowserPopoutState'
  | 'showViewportSplitSlot'
  | 'hideViewportSplitSlot'
  | 'splitViewportSlot'
  | 'splitViewportRoot'
  | 'setViewportLayoutSplitRatio'
  | 'removeViewportSlot'
  | 'detachViewportSlotSurface'
  | 'clearDetachedSlotSurface'
  | 'redockDetachedSurface'
  | 'setViewportSlotSurfaceKind'
  | 'hydratePersistedWorkspaceLayout'
  | 'setActiveViewerViewportId'
  | 'ensureViewportChrome'
  | 'setViewportLocalViewState'
  | 'ensureEditorSurfacePlacement'
  | 'setEditorSurfaceBinding'
  | 'removeEditorSurfaceBinding'
  | 'setEditorSurfacePlacement'
  | 'removeEditorSurfacePlacement'
> => ({
  leftDockWidth: defaultLeftDockWidth,
  isLeftDockViewportSplit: false,
  activeLeftDockPreviewPanelId: null,
  leftDockResizeMenu: null,
  workspaceSplitMenu: null,
  browserToolbarOwnerSurfaceInstanceId: defaultBrowserToolbarOwnerSurfaceInstanceId,
  browserShell: {
    presentationMode: defaultBrowserPresentationMode,
    isCollapsed: false,
    isFloating: false,
    isPoppedOut: false,
    isViewportSplit: false,
    position: defaultBrowserFloatingPosition,
    size: defaultBrowserFloatingSize,
    viewportSplitRatio: defaultBrowserViewportSplitRatio,
    viewportSplitDockSide: defaultBrowserViewportSplitDockSide,
    popoutState: defaultBrowserPopoutState,
  },
  activeViewerViewportId: defaultPrimaryWorkspaceViewportId,
  primaryViewportId: defaultPrimaryWorkspaceViewportId,
  viewportChromeById: {
    [defaultPrimaryWorkspaceViewportId]:
      createDefaultWorkspaceViewportChromeState(defaultPrimaryWorkspaceViewportId),
  },
  ...createDefaultWorkspaceSlotTree(),
  detachedSlotSurfaceById: {},
  editorSurfacePlacementById: {},
  editorSurfaceBindingById: {},
})

const findParentSplitNodeId = (
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>,
  childNodeId: WorkspaceLayoutNodeId,
): WorkspaceLayoutNodeId | null => {
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

const resolveSplitChildOrder = (
  splitDockSide: WorkspaceSplitDockSide,
  existingLeafNodeId: WorkspaceLayoutNodeId,
  nextLeafNodeId: WorkspaceLayoutNodeId,
): { firstChildId: WorkspaceLayoutNodeId; secondChildId: WorkspaceLayoutNodeId } =>
  splitDockSide === 'left' || splitDockSide === 'top'
    ? {
        firstChildId: nextLeafNodeId,
        secondChildId: existingLeafNodeId,
      }
    : {
        firstChildId: existingLeafNodeId,
        secondChildId: nextLeafNodeId,
      }

const oppositeSplitDockSide = (
  splitDockSide: WorkspaceSplitDockSide,
): WorkspaceSplitDockSide =>
  splitDockSide === 'left'
    ? 'right'
    : splitDockSide === 'right'
      ? 'left'
      : splitDockSide === 'top'
        ? 'bottom'
        : 'top'

const resolveSlotPreferredSplitDockSide = (
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>,
  slot: WorkspaceViewportSlot,
): WorkspaceSplitDockSide => {
  const parentSplitNodeId = findParentSplitNodeId(viewportLayoutNodesById, slot.leafNodeId)
  if (parentSplitNodeId === null) {
    return 'right'
  }
  const parentSplitNode = viewportLayoutNodesById[parentSplitNodeId]
  if (parentSplitNode?.kind !== 'split') {
    return 'right'
  }
  const slotOwnsPrimaryDockSide =
    (parentSplitNode.firstChildId === slot.leafNodeId &&
      (parentSplitNode.splitDockSide === 'left' || parentSplitNode.splitDockSide === 'top')) ||
    (parentSplitNode.secondChildId === slot.leafNodeId &&
      (parentSplitNode.splitDockSide === 'right' || parentSplitNode.splitDockSide === 'bottom'))
  return slotOwnsPrimaryDockSide
    ? parentSplitNode.splitDockSide
    : oppositeSplitDockSide(parentSplitNode.splitDockSide)
}

const clampWorkspaceSplitRatio = (ratio: number): number => Math.min(0.85, Math.max(0.15, ratio))

export const useWorkspaceStore = create<WorkspaceStoreState>((set) => ({
  ...createInitialState(),
  setLeftDockWidth: (leftDockWidth) => {
    set({
      leftDockWidth: Math.round(leftDockWidth),
    })
  },
  setLeftDockViewportSplit: (isLeftDockViewportSplit) => {
    set({
      isLeftDockViewportSplit,
    })
  },
  setActiveLeftDockPreviewPanelId: (activeLeftDockPreviewPanelId) => {
    set({
      activeLeftDockPreviewPanelId,
    })
  },
  setLeftDockResizeMenu: (leftDockResizeMenu) => {
    set({
      leftDockResizeMenu,
    })
  },
  setWorkspaceSplitMenu: (workspaceSplitMenu) => {
    set({
      workspaceSplitMenu,
    })
  },
  setBrowserToolbarOwnerSurfaceInstanceId: (browserToolbarOwnerSurfaceInstanceId) => {
    set({
      browserToolbarOwnerSurfaceInstanceId,
    })
  },
  setBrowserCollapsed: (isCollapsed) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        presentationMode: isCollapsed ? 'collapsed' : 'expanded',
        isCollapsed,
      },
    }))
  },
  setBrowserPresentationMode: (presentationMode) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        presentationMode,
        isCollapsed: presentationMode === 'collapsed',
      },
    }))
  },
  setBrowserFloating: (isFloating) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        isFloating,
        isViewportSplit: isFloating ? false : state.browserShell.isViewportSplit,
      },
    }))
  },
  setBrowserPoppedOut: (isPoppedOut) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        isPoppedOut,
        popoutState: isPoppedOut
          ? state.browserShell.popoutState ?? defaultBrowserPopoutState
          : state.browserShell.popoutState,
      },
    }))
  },
  setBrowserViewportSplit: (isViewportSplit) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        isFloating: isViewportSplit ? false : state.browserShell.isFloating,
        isViewportSplit,
      },
    }))
  },
  setBrowserFloatingPosition: (position) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        position: {
          x: Math.round(position.x),
          y: Math.round(position.y),
        },
      },
    }))
  },
  setBrowserFloatingSize: (size) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        size: {
          width: Math.round(size.width),
          height: Math.round(size.height),
        },
      },
    }))
  },
  setBrowserViewportSplitRatio: (viewportSplitRatio) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        viewportSplitRatio: Math.min(0.85, Math.max(0.15, viewportSplitRatio)),
      },
    }))
  },
  setBrowserViewportSplitDockSide: (viewportSplitDockSide) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        viewportSplitDockSide,
      },
    }))
  },
  setBrowserPopoutState: (popoutState) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        popoutState,
      },
    }))
  },
  showViewportSplitSlot: (surfaceKind, splitDockSide) => {
    set((state) => {
      const nextPrimarySlot =
        state.viewportSlotsById[defaultPrimaryViewportSlotId] ??
        createDefaultWorkspaceSlotTree().viewportSlotsById[defaultPrimaryViewportSlotId]
      const nextSecondarySlot: WorkspaceViewportSlot = {
        slotId: defaultSecondaryViewportSlotId,
        surfaceKind,
        surfaceInstanceId: createWorkspaceSurfaceInstanceIdForSlot(
          surfaceKind,
          defaultSecondaryViewportSlotId,
        ),
        hostMode: 'slotted',
        hostViewportId: state.primaryViewportId,
        leafNodeId: 'workspace-slot-leaf-secondary',
        retainedSurfaceInstanceIdsByKind: {
          [surfaceKind]: createWorkspaceSurfaceInstanceIdForSlot(
            surfaceKind,
            defaultSecondaryViewportSlotId,
          ),
        },
      }
      return {
        viewportSlotRootNodeId: 'workspace-slot-split-root',
        viewportSlotsById: {
          [defaultPrimaryViewportSlotId]: nextPrimarySlot,
          [defaultSecondaryViewportSlotId]: nextSecondarySlot,
        },
        viewportLayoutNodesById: {
          'workspace-slot-leaf-primary': {
            nodeId: 'workspace-slot-leaf-primary',
            kind: 'leaf',
            slotId: defaultPrimaryViewportSlotId,
          },
          'workspace-slot-leaf-secondary': {
            nodeId: 'workspace-slot-leaf-secondary',
            kind: 'leaf',
            slotId: defaultSecondaryViewportSlotId,
          },
          'workspace-slot-split-root': createDefaultWorkspaceLayoutSplitNode(
            splitDockSide,
            surfaceKind === 'browser'
              ? state.browserShell.viewportSplitRatio
              : defaultBrowserViewportSplitRatio,
          ),
        },
      }
    })
  },
  hideViewportSplitSlot: () => {
    set((state) => {
      const primarySlot =
        state.viewportSlotsById[defaultPrimaryViewportSlotId] ??
        createDefaultWorkspaceSlotTree().viewportSlotsById[defaultPrimaryViewportSlotId]
      return {
        ...createDefaultWorkspaceSlotTree(),
        viewportSlotsById: {
          [defaultPrimaryViewportSlotId]: primarySlot,
        },
      }
    })
  },
  splitViewportSlot: (slotId, splitDockSide, options) => {
    let createdSlotId: WorkspaceViewportSlotId | null = null
    set((state) => {
      const currentSlot = state.viewportSlotsById[slotId]
      if (currentSlot === undefined) {
        return state
      }
      const currentLeafNode = state.viewportLayoutNodesById[currentSlot.leafNodeId]
      if (currentLeafNode?.kind !== 'leaf') {
        return state
      }

      const nextSlotId = createNextWorkspaceGeneratedId(
        'workspace-slot',
        Object.keys(state.viewportSlotsById),
      )
      const nextLeafNodeId = createNextWorkspaceGeneratedId(
        'workspace-slot-leaf',
        Object.keys(state.viewportLayoutNodesById),
      )
      const nextSplitNodeId = createNextWorkspaceGeneratedId(
        'workspace-slot-split',
        Object.keys(state.viewportLayoutNodesById),
      )
      const nextSurfaceKind = options?.surfaceKind ?? currentSlot.surfaceKind
      const nextSurfaceInstanceId =
        options?.surfaceInstanceId ??
        createWorkspaceSurfaceInstanceIdForSlot(nextSurfaceKind, nextSlotId)
      const nextHostViewportId =
        nextSurfaceKind === 'modelViewer'
          ? currentSlot.surfaceKind === 'modelViewer'
            ? currentSlot.surfaceInstanceId
            : currentSlot.hostViewportId ?? state.primaryViewportId
          : state.primaryViewportId
      const nextSlot: WorkspaceViewportSlot = {
        ...createDefaultWorkspaceViewportSlot(
          nextSlotId,
          nextSurfaceKind,
          nextLeafNodeId,
          nextHostViewportId,
        ),
        surfaceInstanceId: nextSurfaceInstanceId,
        retainedSurfaceInstanceIdsByKind: {
          [nextSurfaceKind]: nextSurfaceInstanceId,
        },
      }
      const nextLeafNode: WorkspaceLayoutNode = {
        nodeId: nextLeafNodeId,
        kind: 'leaf',
        slotId: nextSlotId,
      }
      const childOrder = resolveSplitChildOrder(splitDockSide, currentSlot.leafNodeId, nextLeafNodeId)
      const nextSplitNode: WorkspaceLayoutNode = {
        nodeId: nextSplitNodeId,
        kind: 'split',
        splitDirection: resolveWorkspaceSplitDirectionForDockSide(splitDockSide),
        splitDockSide,
        ratio: clampWorkspaceSplitRatio(options?.preferredRatio ?? defaultBrowserViewportSplitRatio),
        firstChildId: childOrder.firstChildId,
        secondChildId: childOrder.secondChildId,
      }

      const parentSplitNodeId = findParentSplitNodeId(
        state.viewportLayoutNodesById,
        currentSlot.leafNodeId,
      )
      const nextViewportLayoutNodesById: Record<string, WorkspaceLayoutNode> = {
        ...state.viewportLayoutNodesById,
        [nextLeafNodeId]: nextLeafNode,
        [nextSplitNodeId]: nextSplitNode,
      }

      let nextViewportSlotRootNodeId = state.viewportSlotRootNodeId
      if (parentSplitNodeId === null) {
        nextViewportSlotRootNodeId = nextSplitNodeId
      } else {
        const parentSplitNode = state.viewportLayoutNodesById[parentSplitNodeId]
        if (parentSplitNode?.kind !== 'split') {
          return state
        }
        nextViewportLayoutNodesById[parentSplitNodeId] = {
          ...parentSplitNode,
          firstChildId:
            parentSplitNode.firstChildId === currentSlot.leafNodeId
              ? nextSplitNodeId
              : parentSplitNode.firstChildId,
          secondChildId:
            parentSplitNode.secondChildId === currentSlot.leafNodeId
              ? nextSplitNodeId
              : parentSplitNode.secondChildId,
        }
      }

      createdSlotId = nextSlotId
      return {
        viewportSlotRootNodeId: nextViewportSlotRootNodeId,
        viewportSlotsById: {
          ...state.viewportSlotsById,
          [nextSlotId]: nextSlot,
        },
        viewportLayoutNodesById: nextViewportLayoutNodesById,
      }
    })
    return createdSlotId
  },
  splitViewportRoot: (splitDockSide, options) => {
    let createdSlotId: WorkspaceViewportSlotId | null = null
    set((state) => {
      const currentRootNode = state.viewportLayoutNodesById[state.viewportSlotRootNodeId]
      if (currentRootNode === undefined) {
        return state
      }

      const nextSlotId = createNextWorkspaceGeneratedId(
        'workspace-slot',
        Object.keys(state.viewportSlotsById),
      )
      const nextLeafNodeId = createNextWorkspaceGeneratedId(
        'workspace-slot-leaf',
        Object.keys(state.viewportLayoutNodesById),
      )
      const nextSplitNodeId = createNextWorkspaceGeneratedId(
        'workspace-slot-split',
        Object.keys(state.viewportLayoutNodesById),
      )
      const nextSurfaceKind = options?.surfaceKind ?? 'browser'
      const nextSurfaceInstanceId =
        options?.surfaceInstanceId ??
        createWorkspaceSurfaceInstanceIdForSlot(nextSurfaceKind, nextSlotId)
      const nextSlot: WorkspaceViewportSlot = {
        ...createDefaultWorkspaceViewportSlot(
          nextSlotId,
          nextSurfaceKind,
          nextLeafNodeId,
          options?.hostViewportId === undefined ? state.primaryViewportId : options.hostViewportId,
        ),
        surfaceInstanceId: nextSurfaceInstanceId,
        retainedSurfaceInstanceIdsByKind: {
          [nextSurfaceKind]: nextSurfaceInstanceId,
        },
      }
      const nextLeafNode: WorkspaceLayoutNode = {
        nodeId: nextLeafNodeId,
        kind: 'leaf',
        slotId: nextSlotId,
      }
      const childOrder = resolveSplitChildOrder(
        splitDockSide,
        state.viewportSlotRootNodeId,
        nextLeafNodeId,
      )
      const nextSplitNode: WorkspaceLayoutNode = {
        nodeId: nextSplitNodeId,
        kind: 'split',
        splitDirection: resolveWorkspaceSplitDirectionForDockSide(splitDockSide),
        splitDockSide,
        ratio: clampWorkspaceSplitRatio(options?.preferredRatio ?? defaultBrowserViewportSplitRatio),
        firstChildId: childOrder.firstChildId,
        secondChildId: childOrder.secondChildId,
      }

      createdSlotId = nextSlotId
      return {
        viewportSlotRootNodeId: nextSplitNodeId,
        viewportSlotsById: {
          ...state.viewportSlotsById,
          [nextSlotId]: nextSlot,
        },
        viewportLayoutNodesById: {
          ...state.viewportLayoutNodesById,
          [nextLeafNodeId]: nextLeafNode,
          [nextSplitNodeId]: nextSplitNode,
        },
      }
    })
    return createdSlotId
  },
  setViewportLayoutSplitRatio: (nodeId, ratio) => {
    set((state) => {
      const currentNode = state.viewportLayoutNodesById[nodeId]
      if (currentNode?.kind !== 'split') {
        return state
      }
      return {
        viewportLayoutNodesById: {
          ...state.viewportLayoutNodesById,
          [nodeId]: {
            ...currentNode,
            ratio: clampWorkspaceSplitRatio(ratio),
          },
        },
      }
    })
  },
  removeViewportSlot: (slotId) => {
    set((state) => {
      const currentSlot = state.viewportSlotsById[slotId]
      if (currentSlot === undefined) {
        return state
      }
      const currentLeafNodeId = currentSlot.leafNodeId
      const parentSplitNodeId = findParentSplitNodeId(state.viewportLayoutNodesById, currentLeafNodeId)
      if (parentSplitNodeId === null) {
        return state
      }
      const parentSplitNode = state.viewportLayoutNodesById[parentSplitNodeId]
      if (parentSplitNode?.kind !== 'split') {
        return state
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
          return state
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

      return {
        viewportSlotRootNodeId: nextViewportSlotRootNodeId,
        viewportSlotsById: nextViewportSlotsById,
        viewportLayoutNodesById: nextViewportLayoutNodesById,
      }
    })
  },
  detachViewportSlotSurface: (slotId, hostMode) => {
    let detachedSurface: WorkspaceDetachedSlotSurfaceState | null = null
    set((state) => {
      const currentSlot = state.viewportSlotsById[slotId]
      if (
        currentSlot === undefined ||
        currentSlot.slotId === defaultPrimaryViewportSlotId
      ) {
        return state
      }
      const currentLeafNodeId = currentSlot.leafNodeId
      const parentSplitNodeId = findParentSplitNodeId(state.viewportLayoutNodesById, currentLeafNodeId)
      if (parentSplitNodeId === null) {
        return state
      }
      const parentSplitNode = state.viewportLayoutNodesById[parentSplitNodeId]
      if (parentSplitNode?.kind !== 'split') {
        return state
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
          return state
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

      detachedSurface = {
        surfaceKind: currentSlot.surfaceKind,
        surfaceInstanceId: currentSlot.surfaceInstanceId,
        hostMode,
        hostViewportId: currentSlot.hostViewportId,
        lastSlotId: currentSlot.slotId,
        preferredSplitDockSide: resolveSlotPreferredSplitDockSide(
          state.viewportLayoutNodesById,
          currentSlot,
        ),
      }

      return {
        viewportSlotRootNodeId: nextViewportSlotRootNodeId,
        viewportSlotsById: nextViewportSlotsById,
        viewportLayoutNodesById: nextViewportLayoutNodesById,
        detachedSlotSurfaceById: {
          ...state.detachedSlotSurfaceById,
          [currentSlot.surfaceInstanceId]: detachedSurface,
        },
      }
    })
    return detachedSurface
  },
  clearDetachedSlotSurface: (surfaceInstanceId) => {
    set((state) => {
      if (state.detachedSlotSurfaceById[surfaceInstanceId] === undefined) {
        return state
      }
      const nextDetachedSlotSurfaceById = { ...state.detachedSlotSurfaceById }
      delete nextDetachedSlotSurfaceById[surfaceInstanceId]
      return {
        detachedSlotSurfaceById: nextDetachedSlotSurfaceById,
      }
    })
  },
  redockDetachedSurface: (surfaceInstanceId, splitDockSide) => {
    let createdSlotId: WorkspaceViewportSlotId | null = null
    set((state) => {
      const detachedSurface = state.detachedSlotSurfaceById[surfaceInstanceId]
      if (detachedSurface === undefined) {
        return state
      }
      const nextSplitDockSide = splitDockSide ?? detachedSurface.preferredSplitDockSide
      const targetViewerSlot =
        Object.values(state.viewportSlotsById).find(
          (slot) =>
            slot.surfaceKind === 'modelViewer' &&
            slot.surfaceInstanceId === detachedSurface.hostViewportId,
        ) ?? state.viewportSlotsById[defaultPrimaryViewportSlotId]
      const targetSlotId = targetViewerSlot?.slotId ?? defaultPrimaryViewportSlotId
      const currentSlot = state.viewportSlotsById[targetSlotId]
      if (currentSlot === undefined) {
        return state
      }
      const currentLeafNode = state.viewportLayoutNodesById[currentSlot.leafNodeId]
      if (currentLeafNode?.kind !== 'leaf') {
        return state
      }

      const nextSlotId = createNextWorkspaceGeneratedId(
        'workspace-slot',
        Object.keys(state.viewportSlotsById),
      )
      const nextLeafNodeId = createNextWorkspaceGeneratedId(
        'workspace-slot-leaf',
        Object.keys(state.viewportLayoutNodesById),
      )
      const nextSplitNodeId = createNextWorkspaceGeneratedId(
        'workspace-slot-split',
        Object.keys(state.viewportLayoutNodesById),
      )
      const nextSlot: WorkspaceViewportSlot = {
        ...createDefaultWorkspaceViewportSlot(
          nextSlotId,
          detachedSurface.surfaceKind,
          nextLeafNodeId,
          currentSlot.surfaceInstanceId,
        ),
        surfaceInstanceId,
        retainedSurfaceInstanceIdsByKind: {
          [detachedSurface.surfaceKind]: surfaceInstanceId,
        },
      }
      const nextLeafNode: WorkspaceLayoutNode = {
        nodeId: nextLeafNodeId,
        kind: 'leaf',
        slotId: nextSlotId,
      }
      const childOrder = resolveSplitChildOrder(
        nextSplitDockSide,
        currentSlot.leafNodeId,
        nextLeafNodeId,
      )
      const nextSplitNode: WorkspaceLayoutNode = {
        nodeId: nextSplitNodeId,
        kind: 'split',
        splitDirection: resolveWorkspaceSplitDirectionForDockSide(nextSplitDockSide),
        splitDockSide: nextSplitDockSide,
        ratio: clampWorkspaceSplitRatio(
          detachedSurface.surfaceKind === 'browser'
            ? state.browserShell.viewportSplitRatio
            : defaultBrowserViewportSplitRatio,
        ),
        firstChildId: childOrder.firstChildId,
        secondChildId: childOrder.secondChildId,
      }

      const parentSplitNodeId = findParentSplitNodeId(
        state.viewportLayoutNodesById,
        currentSlot.leafNodeId,
      )
      const nextViewportLayoutNodesById: Record<string, WorkspaceLayoutNode> = {
        ...state.viewportLayoutNodesById,
        [nextLeafNodeId]: nextLeafNode,
        [nextSplitNodeId]: nextSplitNode,
      }

      let nextViewportSlotRootNodeId = state.viewportSlotRootNodeId
      if (parentSplitNodeId === null) {
        nextViewportSlotRootNodeId = nextSplitNodeId
      } else {
        const parentSplitNode = state.viewportLayoutNodesById[parentSplitNodeId]
        if (parentSplitNode?.kind !== 'split') {
          return state
        }
        nextViewportLayoutNodesById[parentSplitNodeId] = {
          ...parentSplitNode,
          firstChildId:
            parentSplitNode.firstChildId === currentSlot.leafNodeId
              ? nextSplitNodeId
              : parentSplitNode.firstChildId,
          secondChildId:
            parentSplitNode.secondChildId === currentSlot.leafNodeId
              ? nextSplitNodeId
              : parentSplitNode.secondChildId,
        }
      }

      const nextDetachedSlotSurfaceById = { ...state.detachedSlotSurfaceById }
      delete nextDetachedSlotSurfaceById[surfaceInstanceId]
      createdSlotId = nextSlotId
      return {
        viewportSlotRootNodeId: nextViewportSlotRootNodeId,
        viewportSlotsById: {
          ...state.viewportSlotsById,
          [nextSlotId]: nextSlot,
        },
        viewportLayoutNodesById: nextViewportLayoutNodesById,
        detachedSlotSurfaceById: nextDetachedSlotSurfaceById,
      }
    })
    return createdSlotId
  },
  setViewportSlotSurfaceKind: (slotId, surfaceKind, options) => {
    set((state) => {
      const currentSlot = state.viewportSlotsById[slotId]
      if (currentSlot === undefined || currentSlot.surfaceKind === surfaceKind) {
        return state
      }
      const nextRetainedSurfaceInstanceIdsByKind = {
        ...currentSlot.retainedSurfaceInstanceIdsByKind,
        [currentSlot.surfaceKind]: currentSlot.surfaceInstanceId,
      }
      const nextSurfaceInstanceId =
        options?.surfaceInstanceId ??
        nextRetainedSurfaceInstanceIdsByKind[surfaceKind] ??
        createWorkspaceSurfaceInstanceIdForSlot(surfaceKind, slotId)
      return {
        viewportSlotsById: {
          ...state.viewportSlotsById,
          [slotId]: {
            ...currentSlot,
            surfaceKind,
            surfaceInstanceId: nextSurfaceInstanceId,
            hostViewportId:
              surfaceKind === 'modelViewer'
                ? currentSlot.hostViewportId ?? state.primaryViewportId
                : state.primaryViewportId,
            retainedSurfaceInstanceIdsByKind: {
              ...nextRetainedSurfaceInstanceIdsByKind,
              [surfaceKind]: nextSurfaceInstanceId,
            },
          },
        },
        ...(currentSlot.surfaceKind === 'modelViewer' &&
        surfaceKind !== 'modelViewer' &&
        state.activeViewerViewportId === currentSlot.surfaceInstanceId
          ? { activeViewerViewportId: state.primaryViewportId }
          : {}),
      }
    })
  },
  hydratePersistedWorkspaceLayout: (layout) => {
    const nextViewportChromeById = Object.fromEntries(
      Object.entries(layout.viewportChromeById).map(([viewportId, chrome]) => [
        viewportId,
        {
          ...createDefaultWorkspaceViewportChromeState(viewportId),
          ...chrome,
          localViewState: {
            ...createDefaultWorkspaceViewportLocalViewState(),
            ...(chrome?.localViewState ?? {}),
          },
        },
      ]),
    )
    set({
      leftDockWidth: Math.round(layout.leftDockWidth),
      isLeftDockViewportSplit: layout.isLeftDockViewportSplit,
      browserToolbarOwnerSurfaceInstanceId:
        layout.browserToolbarOwnerSurfaceInstanceId ?? defaultBrowserToolbarOwnerSurfaceInstanceId,
      browserShell: {
        presentationMode:
          layout.browserShell.presentationMode ??
          (layout.browserShell.isCollapsed ? 'collapsed' : 'expanded'),
        isCollapsed: layout.browserShell.isCollapsed,
        isFloating: layout.browserShell.isFloating,
        isPoppedOut: layout.browserShell.isPoppedOut,
        isViewportSplit: layout.browserShell.isViewportSplit,
        position: {
          x: Math.round(layout.browserShell.position.x),
          y: Math.round(layout.browserShell.position.y),
        },
        size: {
          width: Math.round(layout.browserShell.size.width),
          height: Math.round(layout.browserShell.size.height),
        },
        viewportSplitRatio: layout.browserShell.viewportSplitRatio,
        viewportSplitDockSide: layout.browserShell.viewportSplitDockSide,
        popoutState: layout.browserShell.popoutState,
      },
      activeViewerViewportId: layout.activeViewerViewportId ?? layout.primaryViewportId,
      primaryViewportId: layout.primaryViewportId,
      viewportChromeById:
        Object.keys(nextViewportChromeById).length > 0
          ? nextViewportChromeById
          : {
              [layout.primaryViewportId]: createDefaultWorkspaceViewportChromeState(
                layout.primaryViewportId,
              ),
            },
      viewportSlotRootNodeId: layout.viewportSlotRootNodeId ?? defaultViewportLayoutRootNodeId,
      viewportSlotsById:
        Object.keys(layout.viewportSlotsById ?? {}).length > 0
          ? {
              ...layout.viewportSlotsById,
            }
          : createDefaultWorkspaceSlotTree().viewportSlotsById,
      viewportLayoutNodesById:
        Object.keys(layout.viewportLayoutNodesById ?? {}).length > 0
          ? {
              ...layout.viewportLayoutNodesById,
            }
          : createDefaultWorkspaceSlotTree().viewportLayoutNodesById,
      detachedSlotSurfaceById: {
        ...(layout.detachedSlotSurfaceById ?? {}),
      },
      editorSurfacePlacementById: {
        ...layout.editorSurfacePlacementById,
      },
    })
  },
  setActiveViewerViewportId: (activeViewerViewportId) => {
    set({
      activeViewerViewportId,
    })
  },
  ensureViewportChrome: (viewportId) => {
    set((state) => {
      if (state.viewportChromeById[viewportId] !== undefined) {
        return state
      }
      return {
        viewportChromeById: {
          ...state.viewportChromeById,
          [viewportId]: createDefaultWorkspaceViewportChromeState(viewportId),
        },
      }
    })
  },
  setViewportLocalViewState: (viewportId, patch) => {
    set((state) => {
      const currentChrome =
        state.viewportChromeById[viewportId] ?? createDefaultWorkspaceViewportChromeState(viewportId)
      return {
        viewportChromeById: {
          ...state.viewportChromeById,
          [viewportId]: {
            ...currentChrome,
            localViewState: {
              ...createDefaultWorkspaceViewportLocalViewState(),
              ...currentChrome.localViewState,
              ...patch,
            },
          },
        },
      }
    })
  },
  ensureEditorSurfacePlacement: (surfaceInstanceId, seed) => {
    set((state) => {
      if (state.editorSurfacePlacementById[surfaceInstanceId] !== undefined) {
        return state
      }
      return {
        editorSurfacePlacementById: {
          ...state.editorSurfacePlacementById,
          [surfaceInstanceId]: {
            ...createDefaultEditorWorkspaceSurfaceState(surfaceInstanceId),
            ...seed,
          },
        },
      }
    })
  },
  setEditorSurfaceBinding: (surfaceInstanceId, graphDocumentId) => {
    set((state) => ({
      editorSurfaceBindingById: {
        ...state.editorSurfaceBindingById,
        [surfaceInstanceId]: {
          surfaceKind: 'spaghettiEditor',
          surfaceInstanceId,
          graphDocumentId,
        },
      },
    }))
  },
  removeEditorSurfaceBinding: (surfaceInstanceId) => {
    set((state) => {
      if (state.editorSurfaceBindingById[surfaceInstanceId] === undefined) {
        return state
      }
      const nextEditorSurfaceBindingById = { ...state.editorSurfaceBindingById }
      delete nextEditorSurfaceBindingById[surfaceInstanceId]
      return {
        editorSurfaceBindingById: nextEditorSurfaceBindingById,
      }
    })
  },
  setEditorSurfacePlacement: (surfaceInstanceId, placement) => {
    set((state) => ({
      editorSurfacePlacementById: {
        ...state.editorSurfacePlacementById,
        [surfaceInstanceId]: {
          ...placement,
          surfaceInstanceId,
        },
      },
    }))
  },
  removeEditorSurfacePlacement: (surfaceInstanceId) => {
    set((state) => {
      if (state.editorSurfacePlacementById[surfaceInstanceId] === undefined) {
        return state
      }
      const nextEditorSurfacePlacementById = { ...state.editorSurfacePlacementById }
      delete nextEditorSurfacePlacementById[surfaceInstanceId]
      return {
        editorSurfacePlacementById: nextEditorSurfacePlacementById,
      }
    })
  },
}))
