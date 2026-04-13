import { useMemo } from 'react'
import type { EditorViewport } from '../spaghetti/schema/spaghettiTypes'
import { floatingConsoleCompatibilitySurfaceInstanceId } from '../workspace/workspaceSurfaceActions'
import {
  getWorkspaceSurfaceCoordination,
  getWorkspaceSurfaceRenderFamily,
} from '../workspace/workspaceSurfaceCatalog'
import {
  defaultPrimaryViewportSlotId,
  type EditorWorkspaceSurfaceState,
  type WorkspaceDetachedSlotSurfaceState,
  type WorkspaceLayoutNode,
  type WorkspaceLayoutNodeId,
  type WorkspaceSplitMenuState,
  type WorkspaceViewportSlot,
} from '../workspace/workspaceShellTypes'
import { defaultWorkspaceSplitPriority } from '../workspace/workspaceSplitTypes'

type UseAppShellWorkspaceSelectorsArgs = {
  activeEditorSurface: EditorWorkspaceSurfaceState | null
  activeEditorViewport: EditorViewport | null
  activeEditorViewportId: string
  browserToolbarOwnerSurfaceInstanceId: string | null
  detachedSlotSurfaceById: Record<string, WorkspaceDetachedSlotSurfaceState>
  editorSurfacePlacementById: Record<string, EditorWorkspaceSurfaceState>
  editorViewportsById: Record<string, EditorViewport>
  isLeftDockViewportSplit: boolean
  suppressRuntimeProjectedDockedBrowserSurface: boolean
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>
  viewportSlotRootNodeId: WorkspaceLayoutNodeId
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  workspaceSplitMenu: WorkspaceSplitMenuState | null
}

const collectLeafSlotIdsFromLayoutNode = (
  nodeId: WorkspaceLayoutNodeId,
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

const findParentSplitNodeIdForLayoutNode = (
  childNodeId: WorkspaceLayoutNodeId,
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>,
): WorkspaceLayoutNodeId | null => {
  for (const node of Object.values(viewportLayoutNodesById)) {
    if (
      node.kind === 'split' &&
      (node.firstChildId === childNodeId || node.secondChildId === childNodeId)
    ) {
      return node.nodeId
    }
  }
  return null
}

export function useAppShellWorkspaceSelectors(args: UseAppShellWorkspaceSelectorsArgs) {
  const {
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
  } = args

  return useMemo(() => {
    const activeEditorSlot =
      activeEditorViewportId.length > 0
        ? Object.values(viewportSlotsById).find(
            (slot) =>
              getWorkspaceSurfaceCoordination(slot.surfaceKind) === 'spaghettiViewport' &&
              slot.surfaceInstanceId === activeEditorViewportId,
          ) ?? null
        : null

    const hasVisibleSpaghettiInAppShell = Object.values(editorViewportsById).some((viewport) => {
      const editorViewportId = viewport.editorViewportId
      const placement = editorSurfacePlacementById[editorViewportId] ?? null
      const windowMode = viewport.windowMode ?? placement?.windowMode
      const isSlotted = Object.values(viewportSlotsById).some(
        (slot) =>
          getWorkspaceSurfaceCoordination(slot.surfaceKind) === 'spaghettiViewport' &&
          slot.surfaceInstanceId === editorViewportId,
      )
      return (
        !isSlotted &&
        (windowMode === 'expanded' ||
          windowMode === 'maximized' ||
          windowMode === 'collapsed' ||
          windowMode === 'meatball editor view')
      )
    })
    const hasSlottedSpaghettiSurface = Object.values(viewportSlotsById).some(
      (slot) => getWorkspaceSurfaceCoordination(slot.surfaceKind) === 'spaghettiViewport',
    )
    const hasDetachedSpaghettiSurface = Object.values(detachedSlotSurfaceById).some(
      (surface) => getWorkspaceSurfaceCoordination(surface.surfaceKind) === 'spaghettiViewport',
    )
    const hasPopoutSpaghettiSurface = Object.values(editorViewportsById).some(
      (viewport) => (viewport.windowMode ?? '') === 'separateWindow',
    )
    const hasFocusableSpaghettiSurface =
      hasVisibleSpaghettiInAppShell ||
      hasSlottedSpaghettiSurface ||
      hasDetachedSpaghettiSurface ||
      hasPopoutSpaghettiSurface

    const activeEditorSplitPriority =
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
    const workspaceSplitMenuTargetEditorSlot =
      workspaceSplitMenuTargetEditorViewportId !== null
        ? Object.values(viewportSlotsById).find(
            (slot) =>
              getWorkspaceSurfaceCoordination(slot.surfaceKind) === 'spaghettiViewport' &&
              slot.surfaceInstanceId === workspaceSplitMenuTargetEditorViewportId,
          ) ?? null
        : activeEditorSlot
    const workspaceSplitMenuTargetSplitPriority =
      workspaceSplitMenuTargetEditorSurface?.splitPriority ??
      workspaceSplitMenuTargetEditorViewport?.splitPriority ??
      activeEditorSplitPriority

    const browserSlotCount = Object.values(viewportSlotsById).filter(
      (slot) => getWorkspaceSurfaceCoordination(slot.surfaceKind) === 'browserShell',
    ).length
    const consoleSlotCount = Object.values(viewportSlotsById).filter(
      (slot) => getWorkspaceSurfaceCoordination(slot.surfaceKind) === 'consoleStore',
    ).length

    const activeDetachedBrowserSurface =
      Object.values(detachedSlotSurfaceById).find(
        (surface) => getWorkspaceSurfaceCoordination(surface.surfaceKind) === 'browserShell',
      ) ??
      null
    const activeDetachedConsoleSurface =
      Object.values(detachedSlotSurfaceById).find(
        (surface) => getWorkspaceSurfaceCoordination(surface.surfaceKind) === 'consoleStore',
      ) ??
      null
    const workspaceSplitMenuTargetSurfaceKind: 'console' | 'spaghettiEditor' | null =
      workspaceSplitMenuTargetSurfaceInstanceId === null
        ? null
        : editorViewportsById[workspaceSplitMenuTargetSurfaceInstanceId] !== undefined
          ? 'spaghettiEditor'
          : activeDetachedConsoleSurface?.surfaceInstanceId ===
                workspaceSplitMenuTargetSurfaceInstanceId ||
              workspaceSplitMenuTargetSurfaceInstanceId ===
                floatingConsoleCompatibilitySurfaceInstanceId
            ? 'console'
            : null

    const detachedViewerFloatingSurfaces = Object.values(detachedSlotSurfaceById).filter(
      (surface) =>
        getWorkspaceSurfaceRenderFamily(surface.surfaceKind) === 'modelViewer' &&
        surface.hostMode === 'floating',
    )
    const detachedViewerPopoutSurfaces = Object.values(detachedSlotSurfaceById).filter(
      (surface) =>
        getWorkspaceSurfaceRenderFamily(surface.surfaceKind) === 'modelViewer' &&
        surface.hostMode === 'popout',
    )
    const detachedDashboardFloatingSurfaces = Object.values(detachedSlotSurfaceById).filter(
      (surface) =>
        getWorkspaceSurfaceRenderFamily(surface.surfaceKind) === 'dashboard' &&
        surface.hostMode === 'floating',
    )
    const detachedDashboardPopoutSurfaces = Object.values(detachedSlotSurfaceById).filter(
      (surface) =>
        getWorkspaceSurfaceRenderFamily(surface.surfaceKind) === 'dashboard' &&
        surface.hostMode === 'popout',
    )
    const detachedNotepadFloatingSurfaces = Object.values(detachedSlotSurfaceById).filter(
      (surface) =>
        getWorkspaceSurfaceRenderFamily(surface.surfaceKind) === 'notepad' &&
        surface.hostMode === 'floating',
    )
    const detachedNotepadPopoutSurfaces = Object.values(detachedSlotSurfaceById).filter(
      (surface) =>
        getWorkspaceSurfaceRenderFamily(surface.surfaceKind) === 'notepad' &&
        surface.hostMode === 'popout',
    )

    const rootNode = viewportLayoutNodesById[viewportSlotRootNodeId] ?? null
    const rootLeftSplitSlotIds =
      rootNode?.kind !== 'split' || rootNode.splitDockSide !== 'left'
        ? []
        : collectLeafSlotIdsFromLayoutNode(rootNode.firstChildId, viewportLayoutNodesById).filter(
            (slotId) => slotId !== defaultPrimaryViewportSlotId,
          )

    const suppressLegacyDockedBrowserSurface =
      browserToolbarOwnerSurfaceInstanceId === null || suppressRuntimeProjectedDockedBrowserSurface
    const suppressLegacyDockedConsoleSurface =
      consoleSlotCount > 0 || activeDetachedConsoleSurface !== null

    const primarySlot = viewportSlotsById[defaultPrimaryViewportSlotId] ?? null
    const primaryViewportSlotIsConstrained =
      primarySlot === null
        ? isLeftDockViewportSplit
        : isLeftDockViewportSplit ||
          findParentSplitNodeIdForLayoutNode(primarySlot.leafNodeId, viewportLayoutNodesById) !==
            null

    return {
      editor: {
        activeEditorSlot,
      },
      spaghetti: {
        hasVisibleSpaghettiInAppShell,
        hasSlottedSpaghettiSurface,
        hasDetachedSpaghettiSurface,
        hasPopoutSpaghettiSurface,
        hasFocusableSpaghettiSurface,
      },
      splitMenuTarget: {
        workspaceSplitMenuTargetSurfaceInstanceId,
        workspaceSplitMenuTargetEditorViewportId,
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
    }
  }, [
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
  ])
}
