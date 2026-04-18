import {
  defaultBrowserHostRouteId,
  createDefaultWorkspaceLayoutLeafNode,
  createDefaultWorkspaceSlotTree,
  createDefaultEditorPopoutState,
  defaultBrowserPresentationMode,
  defaultBrowserToolbarOwnerSurfaceInstanceId,
  defaultBrowserViewportSplitDockSide,
  defaultBrowserViewportSplitRatio,
  createDefaultEditorWorkspaceSurfaceState,
  createDefaultWorkspaceViewportChromeState,
  createDefaultWorkspaceViewportSlot,
  defaultBrowserPopoutState,
  defaultLeftDockWidth,
  defaultPrimaryWorkspaceViewportId,
  defaultPrimaryViewportLeafNodeId,
  defaultPrimaryViewportSlotId,
  resolveWorkspaceActiveSurfaceInstanceId,
  defaultSecondaryViewportLeafNodeId,
  defaultSecondaryViewportSlotId,
  defaultViewportLayoutRootNodeId,
  type BrowserShellState,
  type BrowserPresentationMode,
  type EditorWorkspaceSurfaceState,
  type WorkspaceDetachedSlotSurfaceState,
  type WorkspaceHostRouteOwnership,
  type WorkspaceHostRouteOwnershipByRouteId,
  type WorkspaceLayoutNode,
  type WorkspaceLayoutNodeId,
  type PersistedWorkspaceLayout,
  type WorkspaceFloatingRect,
  type WorkspacePopoutSurfaceState,
  type WorkspaceSurfaceKind,
  type WorkspaceSurfacePlacementState,
  type WorkspaceRetainedSurfaceInstanceIdsByKind,
  type WorkspaceViewportSlot,
  type WorkspaceViewportChromeState,
  type WorkspaceViewportId,
} from './workspaceShellTypes'
import {
  parseWorkspaceSurfaceKind,
  workspaceSurfaceParticipatesInPersistence,
} from './workspaceSurfaceCatalog'
import {
  resolveDefaultWorkspaceSplitDockSide,
  resolveWorkspaceSplitDirectionForDockSide,
} from './workspaceSplitTypes'

export const workspaceLayoutStorageKey = 'parahook.workspace.lastLayout.v1'

type WorkspacePersistenceSource = {
  leftDockWidth: number
  isLeftDockViewportSplit: boolean
  browserToolbarOwnerSurfaceInstanceId: string | null
  browserShell: BrowserShellState
  hostRouteOwnershipByRouteId: WorkspaceHostRouteOwnershipByRouteId
  surfacePlacementById: Record<string, WorkspaceSurfacePlacementState>
  activeViewerViewportId: WorkspaceViewportId
  primaryViewportId: WorkspaceViewportId
  viewportChromeById: Record<string, WorkspaceViewportChromeState>
  viewportSlotRootNodeId: WorkspaceLayoutNodeId
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>
  detachedSlotSurfaceById: Record<string, WorkspaceDetachedSlotSurfaceState>
  editorSurfacePlacementById: Record<string, EditorWorkspaceSurfaceState>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const roundNumber = (value: number, fallback: number): number =>
  Number.isFinite(value) ? Math.round(value) : fallback

const cloneWorkspaceFloatingRect = (rect: WorkspaceFloatingRect): WorkspaceFloatingRect => ({
  x: roundNumber(rect.x, 16),
  y: roundNumber(rect.y, 96),
  width: roundNumber(rect.width, 320),
  height: roundNumber(rect.height, 560),
})

const normalizeWorkspaceFloatingRect = (value: unknown): WorkspaceFloatingRect | null => {
  if (!isRecord(value)) {
    return null
  }
  const x = Number(value.x)
  const y = Number(value.y)
  const width = Number(value.width)
  const height = Number(value.height)
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
    return null
  }
  if (width <= 0 || height <= 0) {
    return null
  }
  return {
    x: roundNumber(x, 16),
    y: roundNumber(y, 96),
    width: roundNumber(width, 320),
    height: roundNumber(height, 560),
  }
}

const cloneBrowserShellState = (browserShell: BrowserShellState): BrowserShellState => ({
  presentationMode:
    browserShell.presentationMode === 'collapsed' ||
    browserShell.presentationMode === 'essentials' ||
    browserShell.presentationMode === 'expanded'
      ? browserShell.presentationMode
      : browserShell.isCollapsed
        ? 'collapsed'
        : defaultBrowserPresentationMode,
  isCollapsed: browserShell.isCollapsed,
  isFloating: browserShell.isFloating,
  isPoppedOut: browserShell.isPoppedOut,
  isViewportSplit: browserShell.isViewportSplit,
  position: {
    x: roundNumber(browserShell.position.x, 16),
    y: roundNumber(browserShell.position.y, 96),
  },
  size: {
    width: roundNumber(browserShell.size.width, 320),
    height: roundNumber(browserShell.size.height, 560),
  },
  viewportSplitRatio:
    typeof browserShell.viewportSplitRatio === 'number' && Number.isFinite(browserShell.viewportSplitRatio)
      ? Math.min(0.85, Math.max(0.15, browserShell.viewportSplitRatio))
      : defaultBrowserViewportSplitRatio,
  viewportSplitDockSide:
    browserShell.viewportSplitDockSide === 'top' ||
    browserShell.viewportSplitDockSide === 'right' ||
    browserShell.viewportSplitDockSide === 'bottom' ||
    browserShell.viewportSplitDockSide === 'left'
      ? browserShell.viewportSplitDockSide
      : defaultBrowserViewportSplitDockSide,
  popoutState:
    browserShell.popoutState === null
      ? null
      : cloneWorkspacePopoutSurfaceState(browserShell.popoutState),
})

const cloneWorkspacePopoutSurfaceState = (
  popoutState: WorkspacePopoutSurfaceState,
): WorkspacePopoutSurfaceState => ({
  childWindowId:
    typeof popoutState.childWindowId === 'string' && popoutState.childWindowId.length > 0
      ? popoutState.childWindowId
      : defaultBrowserPopoutState.childWindowId,
  owner: popoutState.owner === 'child-window' ? 'child-window' : 'main-app',
  windowName:
    typeof popoutState.windowName === 'string' && popoutState.windowName.length > 0
      ? popoutState.windowName
      : defaultBrowserPopoutState.windowName,
  windowTitle:
    typeof popoutState.windowTitle === 'string' && popoutState.windowTitle.length > 0
      ? popoutState.windowTitle
      : defaultBrowserPopoutState.windowTitle,
  windowFeatures:
    typeof popoutState.windowFeatures === 'string' && popoutState.windowFeatures.length > 0
      ? popoutState.windowFeatures
      : defaultBrowserPopoutState.windowFeatures,
})

const cloneWorkspaceHostRouteOwnership = (
  ownership: WorkspaceHostRouteOwnership,
): WorkspaceHostRouteOwnership => ({
  routeId: ownership.routeId,
  surfaceKind: ownership.surfaceKind,
  surfaceInstanceId: ownership.surfaceInstanceId,
  hostViewportId: ownership.hostViewportId,
})

const cloneWorkspaceSurfacePlacement = (
  placement: WorkspaceSurfacePlacementState,
): WorkspaceSurfacePlacementState => ({
  ...placement,
  hostMode: placement.hostMode,
  hostViewportId: placement.hostViewportId,
  floatingRect:
    placement.floatingRect === undefined
      ? undefined
      : {
          x: roundNumber(placement.floatingRect.x, 16),
          y: roundNumber(placement.floatingRect.y, 96),
          width: roundNumber(placement.floatingRect.width, 320),
          height: roundNumber(placement.floatingRect.height, 560),
        },
  popoutState:
    placement.popoutState === undefined || placement.popoutState === null
      ? placement.popoutState
      : cloneWorkspacePopoutSurfaceState(placement.popoutState),
  restoreTarget:
    placement.restoreTarget === undefined || placement.restoreTarget === null
      ? placement.restoreTarget
      : {
          ...placement.restoreTarget,
        },
})

const cloneDetachedSlotSurfaceState = (
  detachedSurface: WorkspaceDetachedSlotSurfaceState,
): WorkspaceDetachedSlotSurfaceState => ({
  surfaceKind: detachedSurface.surfaceKind,
  surfaceInstanceId: detachedSurface.surfaceInstanceId,
  hostMode: detachedSurface.hostMode,
  hostViewportId: detachedSurface.hostViewportId,
  lastSlotId: detachedSurface.lastSlotId,
  preferredSplitDockSide: detachedSurface.preferredSplitDockSide,
})

const cloneViewportChromeState = (
  chrome: WorkspaceViewportChromeState,
): WorkspaceViewportChromeState => {
  const baseChrome = createDefaultWorkspaceViewportChromeState(chrome.viewportId)
  return {
    ...baseChrome,
    ...chrome,
    localViewState: {
      ...baseChrome.localViewState,
      ...(chrome.localViewState ?? {}),
      viewToolbarHostMode:
        chrome.localViewState?.viewToolbarHostMode === 'floating' ? 'floating' : 'docked',
      viewToolbarFloatingRect:
        chrome.localViewState?.viewToolbarFloatingRect === null
          ? null
          : chrome.localViewState?.viewToolbarFloatingRect === undefined
            ? baseChrome.localViewState.viewToolbarFloatingRect
            : cloneWorkspaceFloatingRect(chrome.localViewState.viewToolbarFloatingRect),
    },
  }
}

const cloneEditorSurfacePlacement = (
  surface: EditorWorkspaceSurfaceState,
): EditorWorkspaceSurfaceState => ({
  ...surface,
  position: {
    x: roundNumber(surface.position.x, 344),
    y: roundNumber(surface.position.y, 16),
  },
  size: {
    width: roundNumber(surface.size.width, 980),
    height: roundNumber(surface.size.height, 760),
  },
  splitDockSide: surface.splitDockSide,
  popoutState:
    surface.popoutState === null
      ? null
      : cloneWorkspacePopoutSurfaceState(surface.popoutState),
  restoreFromCollapsed:
    surface.restoreFromCollapsed === null
      ? null
      : {
          ...surface.restoreFromCollapsed,
          position:
            surface.restoreFromCollapsed.position === undefined
              ? undefined
              : {
                  x: roundNumber(surface.restoreFromCollapsed.position.x, surface.position.x),
                  y: roundNumber(surface.restoreFromCollapsed.position.y, surface.position.y),
                },
          size:
            surface.restoreFromCollapsed.size === undefined
              ? undefined
              : {
                  width: roundNumber(surface.restoreFromCollapsed.size.width, surface.size.width),
                  height: roundNumber(surface.restoreFromCollapsed.size.height, surface.size.height),
                },
        },
  restoreFromSplit:
    surface.restoreFromSplit === null
      ? null
      : {
          ...surface.restoreFromSplit,
          position:
            surface.restoreFromSplit.position === undefined
              ? undefined
              : {
                  x: roundNumber(surface.restoreFromSplit.position.x, surface.position.x),
                  y: roundNumber(surface.restoreFromSplit.position.y, surface.position.y),
                },
          size:
            surface.restoreFromSplit.size === undefined
              ? undefined
              : {
                  width: roundNumber(surface.restoreFromSplit.size.width, surface.size.width),
                  height: roundNumber(surface.restoreFromSplit.size.height, surface.size.height),
                },
        },
  restoreFromSeparateWindow:
    surface.restoreFromSeparateWindow === null
      ? null
      : {
          ...surface.restoreFromSeparateWindow,
          position:
            surface.restoreFromSeparateWindow.position === undefined
              ? undefined
              : {
                  x: roundNumber(
                    surface.restoreFromSeparateWindow.position.x,
                    surface.position.x,
                  ),
                  y: roundNumber(
                    surface.restoreFromSeparateWindow.position.y,
                    surface.position.y,
                  ),
                },
          size:
            surface.restoreFromSeparateWindow.size === undefined
              ? undefined
              : {
                  width: roundNumber(
                    surface.restoreFromSeparateWindow.size.width,
                    surface.size.width,
                  ),
                  height: roundNumber(
                    surface.restoreFromSeparateWindow.size.height,
                    surface.size.height,
                  ),
                },
        },
})

const normalizeViewportChromeRecord = (
  value: unknown,
  fallbackViewportId: WorkspaceViewportId,
): WorkspaceViewportChromeState | null => {
  if (!isRecord(value)) {
    return null
  }
  const viewportId =
    typeof value.viewportId === 'string' && value.viewportId.length > 0
      ? value.viewportId
      : fallbackViewportId
  const baseChrome = createDefaultWorkspaceViewportChromeState(viewportId)
  const localViewState = isRecord(value.localViewState) ? value.localViewState : null
  return {
    ...baseChrome,
    localViewState: {
      ...baseChrome.localViewState,
      ...(localViewState?.projectionMode === 'orthographic'
        ? { projectionMode: 'orthographic' as const }
        : {}),
      ...(typeof localViewState?.axisOverlayEnabled === 'boolean'
        ? { axisOverlayEnabled: localViewState.axisOverlayEnabled }
        : {}),
      ...(typeof localViewState?.viewToolbarOpen === 'boolean'
        ? { viewToolbarOpen: localViewState.viewToolbarOpen }
        : {}),
      ...(localViewState?.viewToolbarExpandedPresentationMode === 'tabs'
        ? { viewToolbarExpandedPresentationMode: 'tabs' as const }
        : localViewState?.viewToolbarExpandedPresentationMode === 'classic'
          ? { viewToolbarExpandedPresentationMode: 'classic' as const }
          : {}),
      ...(localViewState?.viewToolbarHostMode === 'floating'
        ? { viewToolbarHostMode: 'floating' as const }
        : localViewState?.viewToolbarHostMode === 'docked'
          ? { viewToolbarHostMode: 'docked' as const }
          : {}),
      ...(localViewState?.viewToolbarDockMode === 'top-right-cluster'
        ? { viewToolbarDockMode: 'top-right-cluster' as const }
        : localViewState?.viewToolbarDockMode === 'below-axis'
          ? { viewToolbarDockMode: 'below-axis' as const }
          : {}),
      ...(localViewState?.viewToolbarFloatingRect === null
        ? { viewToolbarFloatingRect: null }
        : localViewState?.viewToolbarFloatingRect !== undefined
          ? (() => {
              const floatingRect = normalizeWorkspaceFloatingRect(
                localViewState.viewToolbarFloatingRect,
              )
              return floatingRect === null ? {} : { viewToolbarFloatingRect: floatingRect }
            })()
          : {}),
      ...(localViewState?.viewToolbarActiveTab === 'camera' ||
      localViewState?.viewToolbarActiveTab === 'fly-mode' ||
      localViewState?.viewToolbarActiveTab === 'transform' ||
      localViewState?.viewToolbarActiveTab === 'snap' ||
      localViewState?.viewToolbarActiveTab === 'gizmo' ||
      localViewState?.viewToolbarActiveTab === 'view' ||
      localViewState?.viewToolbarActiveTab === 'environment' ||
      localViewState?.viewToolbarActiveTab === 'ground' ||
      localViewState?.viewToolbarActiveTab === 'materials'
        ? { viewToolbarActiveTab: localViewState.viewToolbarActiveTab }
        : {}),
      ...(typeof localViewState?.viewToolbarExpandedAxisWidgetSize === 'number' &&
      Number.isFinite(localViewState.viewToolbarExpandedAxisWidgetSize)
        ? {
            viewToolbarExpandedAxisWidgetSize:
              localViewState.viewToolbarExpandedAxisWidgetSize,
          }
        : localViewState?.viewToolbarExpandedAxisWidgetSize === null
          ? { viewToolbarExpandedAxisWidgetSize: null }
          : {}),
      ...(typeof localViewState?.viewToolbarCompactAxisWidgetSize === 'number' &&
      Number.isFinite(localViewState.viewToolbarCompactAxisWidgetSize)
        ? {
            viewToolbarCompactAxisWidgetSize:
              localViewState.viewToolbarCompactAxisWidgetSize,
          }
        : localViewState?.viewToolbarCompactAxisWidgetSize === null
          ? { viewToolbarCompactAxisWidgetSize: null }
          : {}),
      ...(localViewState?.viewportResultMode === 'draft' ||
      localViewState?.viewportResultMode === 'final'
        ? { viewportResultMode: localViewState.viewportResultMode }
        : localViewState?.viewportResultMode === 'auto'
          ? { viewportResultMode: 'auto' as const }
          : {}),
    },
  }
}

const normalizeViewportSlotRecord = (
  slotId: string,
  value: unknown,
  primaryViewportId: WorkspaceViewportId,
): WorkspaceViewportSlot | null => {
  if (!isRecord(value)) {
    return null
  }
  const parsedSurfaceKind = parseWorkspaceSurfaceKind(value.surfaceKind)
  const surfaceKind: WorkspaceSurfaceKind =
    parsedSurfaceKind ?? (slotId === defaultPrimaryViewportSlotId ? 'modelViewer' : 'browser')
  const leafNodeId =
    typeof value.leafNodeId === 'string' && value.leafNodeId.length > 0
      ? value.leafNodeId
      : slotId === defaultPrimaryViewportSlotId
        ? defaultPrimaryViewportLeafNodeId
        : defaultSecondaryViewportLeafNodeId
  const baseSlot = createDefaultWorkspaceViewportSlot(slotId, surfaceKind, leafNodeId, primaryViewportId)
  const retainedSurfaceInstanceIdsByKind: WorkspaceRetainedSurfaceInstanceIdsByKind = {
    ...baseSlot.retainedSurfaceInstanceIdsByKind,
  }
  if (isRecord(value.retainedSurfaceInstanceIdsByKind)) {
    for (const [kind, surfaceInstanceId] of Object.entries(value.retainedSurfaceInstanceIdsByKind)) {
      const retainedSurfaceKind = parseWorkspaceSurfaceKind(kind)
      if (
        retainedSurfaceKind !== null &&
        workspaceSurfaceParticipatesInPersistence(retainedSurfaceKind) &&
        typeof surfaceInstanceId === 'string' &&
        surfaceInstanceId.length > 0
      ) {
        retainedSurfaceInstanceIdsByKind[retainedSurfaceKind] = surfaceInstanceId
      }
    }
  }
  return {
    ...baseSlot,
    surfaceInstanceId:
      typeof value.surfaceInstanceId === 'string' && value.surfaceInstanceId.length > 0
        ? value.surfaceInstanceId
        : baseSlot.surfaceInstanceId,
    hostMode: 'slotted',
    hostViewportId:
      typeof value.hostViewportId === 'string' && value.hostViewportId.length > 0
        ? value.hostViewportId
        : primaryViewportId,
    retainedSurfaceInstanceIdsByKind,
  }
}

const normalizeViewportLayoutNodeRecord = (
  nodeId: string,
  value: unknown,
): WorkspaceLayoutNode | null => {
  if (!isRecord(value)) {
    return null
  }
  if (value.kind === 'split') {
    const splitDockSide =
      value.splitDockSide === 'top' ||
      value.splitDockSide === 'right' ||
      value.splitDockSide === 'bottom' ||
      value.splitDockSide === 'left'
        ? value.splitDockSide
        : defaultBrowserViewportSplitDockSide
    return {
      nodeId,
      kind: 'split',
      splitDirection:
        value.splitDirection === 'vertical' || value.splitDirection === 'horizontal'
          ? value.splitDirection
          : resolveWorkspaceSplitDirectionForDockSide(splitDockSide),
      splitDockSide,
      ratio:
        typeof value.ratio === 'number' && Number.isFinite(value.ratio)
          ? Math.min(0.85, Math.max(0.15, value.ratio))
          : defaultBrowserViewportSplitRatio,
      firstChildId:
        typeof value.firstChildId === 'string' && value.firstChildId.length > 0
          ? value.firstChildId
          : defaultPrimaryViewportLeafNodeId,
      secondChildId:
        typeof value.secondChildId === 'string' && value.secondChildId.length > 0
          ? value.secondChildId
          : defaultSecondaryViewportLeafNodeId,
    }
  }
  const slotId =
    typeof value.slotId === 'string' && value.slotId.length > 0
      ? value.slotId
      : nodeId === defaultPrimaryViewportLeafNodeId
        ? defaultPrimaryViewportSlotId
        : defaultSecondaryViewportSlotId
  return createDefaultWorkspaceLayoutLeafNode(nodeId, slotId)
}

const normalizeEditorSurfacePlacement = (
  surfaceInstanceId: string,
  value: unknown,
): EditorWorkspaceSurfaceState | null => {
  if (!isRecord(value)) {
    return null
  }
  const base = createDefaultEditorWorkspaceSurfaceState(surfaceInstanceId)
  const normalized: EditorWorkspaceSurfaceState = {
    ...base,
    presentationMode: value.presentationMode === 'tiled' ? 'tiled' : 'windowed',
    windowMode:
      value.windowMode === 'collapsed' ||
      value.windowMode === 'meatball editor view' ||
      value.windowMode === 'expanded' ||
      value.windowMode === 'maximized' ||
      value.windowMode === 'split view' ||
      value.windowMode === 'separateWindow'
        ? value.windowMode
        : base.windowMode,
    position: {
      x: roundNumber(typeof value.position === 'object' && value.position !== null ? Number((value.position as Record<string, unknown>).x) : NaN, base.position.x),
      y: roundNumber(typeof value.position === 'object' && value.position !== null ? Number((value.position as Record<string, unknown>).y) : NaN, base.position.y),
    },
    size: {
      width: roundNumber(typeof value.size === 'object' && value.size !== null ? Number((value.size as Record<string, unknown>).width) : NaN, base.size.width),
      height: roundNumber(typeof value.size === 'object' && value.size !== null ? Number((value.size as Record<string, unknown>).height) : NaN, base.size.height),
    },
    splitRatio:
      typeof value.splitRatio === 'number' && Number.isFinite(value.splitRatio)
        ? value.splitRatio
        : base.splitRatio,
    splitDirection:
      value.splitDirection === 'vertical' || value.splitDirection === 'horizontal'
        ? value.splitDirection
        : base.splitDirection,
    splitDockSide: base.splitDockSide,
    splitPriority:
      value.splitPriority === 'balanced' ||
      value.splitPriority === 'favorFirst' ||
      value.splitPriority === 'favorSecond'
        ? value.splitPriority
        : base.splitPriority,
    popoutState: isRecord(value.popoutState)
      ? cloneWorkspacePopoutSurfaceState({
          childWindowId:
            typeof value.popoutState.childWindowId === 'string'
              ? value.popoutState.childWindowId
              : createDefaultEditorPopoutState(surfaceInstanceId).childWindowId,
          owner: value.popoutState.owner === 'child-window' ? 'child-window' : 'main-app',
          windowName:
            typeof value.popoutState.windowName === 'string'
              ? value.popoutState.windowName
              : createDefaultEditorPopoutState(surfaceInstanceId).windowName,
          windowTitle:
            typeof value.popoutState.windowTitle === 'string'
              ? value.popoutState.windowTitle
              : createDefaultEditorPopoutState(surfaceInstanceId).windowTitle,
          windowFeatures:
            typeof value.popoutState.windowFeatures === 'string'
              ? value.popoutState.windowFeatures
              : createDefaultEditorPopoutState(surfaceInstanceId).windowFeatures,
        })
      : base.popoutState,
    restoreFromCollapsed: base.restoreFromCollapsed,
    restoreFromSplit: base.restoreFromSplit,
    restoreFromSeparateWindow: base.restoreFromSeparateWindow,
  }

  normalized.splitDockSide =
    value.splitDockSide === 'top' ||
    value.splitDockSide === 'right' ||
    value.splitDockSide === 'bottom' ||
    value.splitDockSide === 'left'
      ? value.splitDockSide
      : resolveDefaultWorkspaceSplitDockSide(normalized.splitDirection)

  if (isRecord(value.restoreFromCollapsed)) {
    normalized.restoreFromCollapsed = {
      windowMode:
        value.restoreFromCollapsed.windowMode === 'expanded' ||
        value.restoreFromCollapsed.windowMode === 'maximized' ||
        value.restoreFromCollapsed.windowMode === 'split view'
          ? value.restoreFromCollapsed.windowMode
          : 'expanded',
      position: isRecord(value.restoreFromCollapsed.position)
        ? {
            x: roundNumber(Number(value.restoreFromCollapsed.position.x), normalized.position.x),
            y: roundNumber(Number(value.restoreFromCollapsed.position.y), normalized.position.y),
          }
        : undefined,
      size: isRecord(value.restoreFromCollapsed.size)
        ? {
            width: roundNumber(Number(value.restoreFromCollapsed.size.width), normalized.size.width),
            height: roundNumber(Number(value.restoreFromCollapsed.size.height), normalized.size.height),
          }
        : undefined,
      splitRatio:
        typeof value.restoreFromCollapsed.splitRatio === 'number' &&
        Number.isFinite(value.restoreFromCollapsed.splitRatio)
          ? value.restoreFromCollapsed.splitRatio
          : undefined,
    }
  }

  if (isRecord(value.restoreFromSplit)) {
    normalized.restoreFromSplit = {
      windowMode:
        value.restoreFromSplit.windowMode === 'expanded' ||
        value.restoreFromSplit.windowMode === 'maximized'
          ? value.restoreFromSplit.windowMode
          : 'expanded',
      position: isRecord(value.restoreFromSplit.position)
        ? {
            x: roundNumber(Number(value.restoreFromSplit.position.x), normalized.position.x),
            y: roundNumber(Number(value.restoreFromSplit.position.y), normalized.position.y),
          }
        : undefined,
      size: isRecord(value.restoreFromSplit.size)
        ? {
            width: roundNumber(Number(value.restoreFromSplit.size.width), normalized.size.width),
            height: roundNumber(Number(value.restoreFromSplit.size.height), normalized.size.height),
          }
        : undefined,
    }
  }

  if (isRecord(value.restoreFromSeparateWindow)) {
    normalized.restoreFromSeparateWindow = {
      windowMode:
        value.restoreFromSeparateWindow.windowMode === 'collapsed' ||
        value.restoreFromSeparateWindow.windowMode === 'meatball editor view' ||
        value.restoreFromSeparateWindow.windowMode === 'expanded' ||
        value.restoreFromSeparateWindow.windowMode === 'maximized' ||
        value.restoreFromSeparateWindow.windowMode === 'split view'
          ? value.restoreFromSeparateWindow.windowMode
          : 'expanded',
      position: isRecord(value.restoreFromSeparateWindow.position)
        ? {
            x: roundNumber(
              Number(value.restoreFromSeparateWindow.position.x),
              normalized.position.x,
            ),
            y: roundNumber(
              Number(value.restoreFromSeparateWindow.position.y),
              normalized.position.y,
            ),
          }
        : undefined,
      size: isRecord(value.restoreFromSeparateWindow.size)
        ? {
            width: roundNumber(
              Number(value.restoreFromSeparateWindow.size.width),
              normalized.size.width,
            ),
            height: roundNumber(
              Number(value.restoreFromSeparateWindow.size.height),
              normalized.size.height,
            ),
          }
        : undefined,
      splitRatio:
        typeof value.restoreFromSeparateWindow.splitRatio === 'number' &&
        Number.isFinite(value.restoreFromSeparateWindow.splitRatio)
          ? value.restoreFromSeparateWindow.splitRatio
          : undefined,
      splitDirection:
        value.restoreFromSeparateWindow.splitDirection === 'vertical' ||
        value.restoreFromSeparateWindow.splitDirection === 'horizontal'
          ? value.restoreFromSeparateWindow.splitDirection
          : undefined,
      splitDockSide:
        value.restoreFromSeparateWindow.splitDockSide === 'top' ||
        value.restoreFromSeparateWindow.splitDockSide === 'right' ||
        value.restoreFromSeparateWindow.splitDockSide === 'bottom' ||
        value.restoreFromSeparateWindow.splitDockSide === 'left'
          ? value.restoreFromSeparateWindow.splitDockSide
          : undefined,
      splitPriority:
        value.restoreFromSeparateWindow.splitPriority === 'balanced' ||
        value.restoreFromSeparateWindow.splitPriority === 'favorFirst' ||
        value.restoreFromSeparateWindow.splitPriority === 'favorSecond'
          ? value.restoreFromSeparateWindow.splitPriority
          : undefined,
    }
  }

  return cloneEditorSurfacePlacement(normalized)
}

const normalizeWorkspaceHostRouteOwnership = (
  routeId: string,
  value: unknown,
  primaryViewportId: WorkspaceViewportId,
): WorkspaceHostRouteOwnership | null => {
  if (!isRecord(value) || routeId !== defaultBrowserHostRouteId) {
    return null
  }
  const surfaceKind = value.surfaceKind === 'browser' ? 'browser' : null
  if (surfaceKind === null) {
    return null
  }
  return cloneWorkspaceHostRouteOwnership({
    routeId: defaultBrowserHostRouteId,
    surfaceKind,
    surfaceInstanceId:
      typeof value.surfaceInstanceId === 'string' && value.surfaceInstanceId.length > 0
        ? value.surfaceInstanceId
        : defaultBrowserToolbarOwnerSurfaceInstanceId,
    hostViewportId:
      typeof value.hostViewportId === 'string' && value.hostViewportId.length > 0
        ? value.hostViewportId
        : primaryViewportId,
  })
}

const normalizeWorkspaceSurfacePlacement = (
  surfaceInstanceId: string,
  value: unknown,
  primaryViewportId: WorkspaceViewportId,
): WorkspaceSurfacePlacementState | null => {
  if (!isRecord(value)) {
    return null
  }
  const surfaceKind: WorkspaceSurfaceKind = parseWorkspaceSurfaceKind(value.surfaceKind) ?? 'browser'
  const hostMode =
    value.hostMode === 'slotted' ||
    value.hostMode === 'floating' ||
    value.hostMode === 'popout' ||
    value.hostMode === 'docked'
      ? value.hostMode
      : 'docked'
  return cloneWorkspaceSurfacePlacement({
    surfaceKind,
    surfaceInstanceId,
    hostMode,
    hostViewportId:
      typeof value.hostViewportId === 'string' && value.hostViewportId.length > 0
        ? value.hostViewportId
        : primaryViewportId,
    slotId:
      typeof value.slotId === 'string' && value.slotId.length > 0 ? value.slotId : undefined,
    floatingRect: isRecord(value.floatingRect)
      ? {
          x: roundNumber(Number(value.floatingRect.x), 16),
          y: roundNumber(Number(value.floatingRect.y), 96),
          width: roundNumber(Number(value.floatingRect.width), 320),
          height: roundNumber(Number(value.floatingRect.height), 560),
        }
      : undefined,
    popoutState:
      isRecord(value.popoutState) || value.popoutState === null
        ? value.popoutState === null
          ? null
          : cloneWorkspacePopoutSurfaceState({
              childWindowId:
                typeof value.popoutState.childWindowId === 'string'
                  ? value.popoutState.childWindowId
                  : defaultBrowserPopoutState.childWindowId,
              owner: value.popoutState.owner === 'main-app' ? 'main-app' : 'child-window',
              windowName:
                typeof value.popoutState.windowName === 'string'
                  ? value.popoutState.windowName
                  : defaultBrowserPopoutState.windowName,
              windowTitle:
                typeof value.popoutState.windowTitle === 'string'
                  ? value.popoutState.windowTitle
                  : defaultBrowserPopoutState.windowTitle,
              windowFeatures:
                typeof value.popoutState.windowFeatures === 'string'
                  ? value.popoutState.windowFeatures
                  : defaultBrowserPopoutState.windowFeatures,
            })
        : undefined,
    restoreTarget: isRecord(value.restoreTarget)
      ? {
          slotId:
            typeof value.restoreTarget.slotId === 'string' && value.restoreTarget.slotId.length > 0
              ? value.restoreTarget.slotId
              : undefined,
          preferredSplitDockSide:
            value.restoreTarget.preferredSplitDockSide === 'top' ||
            value.restoreTarget.preferredSplitDockSide === 'right' ||
            value.restoreTarget.preferredSplitDockSide === 'bottom' ||
            value.restoreTarget.preferredSplitDockSide === 'left'
              ? value.restoreTarget.preferredSplitDockSide
              : undefined,
        }
      : value.restoreTarget === null
        ? null
        : undefined,
    namedHostRouteId: value.namedHostRouteId === defaultBrowserHostRouteId ? defaultBrowserHostRouteId : undefined,
  })
}

export const serializeWorkspaceLayout = (
  state: WorkspacePersistenceSource,
): PersistedWorkspaceLayout => ({
  version: 1,
  leftDockWidth: roundNumber(state.leftDockWidth, defaultLeftDockWidth),
  isLeftDockViewportSplit: state.isLeftDockViewportSplit,
  browserToolbarOwnerSurfaceInstanceId: state.browserToolbarOwnerSurfaceInstanceId,
  browserShell: cloneBrowserShellState(state.browserShell),
  hostRouteOwnershipByRouteId: Object.fromEntries(
    Object.entries(state.hostRouteOwnershipByRouteId).map(([routeId, ownership]) => [
      routeId,
      cloneWorkspaceHostRouteOwnership(ownership),
    ]),
  ),
  surfacePlacementById: Object.fromEntries(
    Object.entries(state.surfacePlacementById).map(([surfaceInstanceId, placement]) => [
      surfaceInstanceId,
      cloneWorkspaceSurfacePlacement(placement),
    ]),
  ),
  activeViewerViewportId: state.activeViewerViewportId,
  primaryViewportId: state.primaryViewportId,
  viewportChromeById: Object.fromEntries(
    Object.entries(state.viewportChromeById).map(([viewportId, chrome]) => [
      viewportId,
      cloneViewportChromeState(chrome),
    ]),
  ),
  viewportSlotRootNodeId: state.viewportSlotRootNodeId,
  viewportSlotsById: Object.fromEntries(
    Object.entries(state.viewportSlotsById).map(([slotId, slot]) => [
      slotId,
      {
        ...slot,
        hostMode: 'slotted' as const,
      },
    ]),
  ),
  viewportLayoutNodesById: Object.fromEntries(
    Object.entries(state.viewportLayoutNodesById).map(([nodeId, node]) => [nodeId, { ...node }]),
  ),
  detachedSlotSurfaceById: Object.fromEntries(
    Object.entries(state.detachedSlotSurfaceById).map(([surfaceInstanceId, detachedSurface]) => [
      surfaceInstanceId,
      cloneDetachedSlotSurfaceState(detachedSurface),
    ]),
  ),
  editorSurfacePlacementById: Object.fromEntries(
    Object.entries(state.editorSurfacePlacementById).map(([surfaceInstanceId, surface]) => [
      surfaceInstanceId,
      cloneEditorSurfacePlacement(surface),
    ]),
  ),
})

export const normalizePersistedWorkspaceLayout = (
  value: unknown,
): PersistedWorkspaceLayout | null => {
  if (!isRecord(value)) {
    return null
  }
  const primaryViewportId =
    typeof value.primaryViewportId === 'string' && value.primaryViewportId.length > 0
      ? value.primaryViewportId
      : defaultPrimaryWorkspaceViewportId
  const viewportChromeEntries = isRecord(value.viewportChromeById)
    ? Object.entries(value.viewportChromeById)
        .map(([viewportId, chrome]) => [
          viewportId,
          normalizeViewportChromeRecord(chrome, viewportId),
        ] as const)
        .filter((entry): entry is readonly [string, WorkspaceViewportChromeState] => entry[1] !== null)
    : []
  const viewportChromeById =
    viewportChromeEntries.length > 0
      ? Object.fromEntries(viewportChromeEntries)
      : {
          [primaryViewportId]: createDefaultWorkspaceViewportChromeState(primaryViewportId),
        }
  if (viewportChromeById[primaryViewportId] === undefined) {
    viewportChromeById[primaryViewportId] =
      createDefaultWorkspaceViewportChromeState(primaryViewportId)
  }

  const editorSurfaceEntries = isRecord(value.editorSurfacePlacementById)
    ? Object.entries(value.editorSurfacePlacementById)
        .map(([surfaceInstanceId, surface]) => [
          surfaceInstanceId,
          normalizeEditorSurfacePlacement(surfaceInstanceId, surface),
        ] as const)
        .filter((entry): entry is readonly [string, EditorWorkspaceSurfaceState] => entry[1] !== null)
    : []
  const hostRouteOwnershipEntries = isRecord(value.hostRouteOwnershipByRouteId)
    ? Object.entries(value.hostRouteOwnershipByRouteId)
        .map(([routeId, ownership]) => [
          routeId,
          normalizeWorkspaceHostRouteOwnership(routeId, ownership, primaryViewportId),
        ] as const)
        .filter((entry): entry is readonly [string, WorkspaceHostRouteOwnership] => entry[1] !== null)
    : []
  const surfacePlacementEntries = isRecord(value.surfacePlacementById)
    ? Object.entries(value.surfacePlacementById)
        .map(([surfaceInstanceId, placement]) => [
          surfaceInstanceId,
          normalizeWorkspaceSurfacePlacement(surfaceInstanceId, placement, primaryViewportId),
        ] as const)
        .filter((entry): entry is readonly [string, WorkspaceSurfacePlacementState] => entry[1] !== null)
    : []
  const defaultSlotTree = createDefaultWorkspaceSlotTree()
  const viewportSlotEntries = isRecord(value.viewportSlotsById)
    ? Object.entries(value.viewportSlotsById)
        .map(([slotId, slot]) => [
          slotId,
          normalizeViewportSlotRecord(slotId, slot, primaryViewportId),
        ] as const)
        .filter((entry): entry is readonly [string, WorkspaceViewportSlot] => entry[1] !== null)
    : []
  const viewportLayoutNodeEntries = isRecord(value.viewportLayoutNodesById)
    ? Object.entries(value.viewportLayoutNodesById)
        .map(([nodeId, node]) => [
          nodeId,
          normalizeViewportLayoutNodeRecord(nodeId, node),
        ] as const)
        .filter((entry): entry is readonly [string, WorkspaceLayoutNode] => entry[1] !== null)
    : []
  const detachedSlotSurfaceEntries = isRecord(value.detachedSlotSurfaceById)
    ? Object.entries(value.detachedSlotSurfaceById)
        .map(([surfaceInstanceId, detachedSurface]) => {
          if (!isRecord(detachedSurface)) {
            return null
          }
          const surfaceKind = parseWorkspaceSurfaceKind(detachedSurface.surfaceKind)
          if (
            surfaceKind === null ||
            !workspaceSurfaceParticipatesInPersistence(surfaceKind)
          ) {
            return null
          }
          return [
            surfaceInstanceId,
            cloneDetachedSlotSurfaceState({
              surfaceKind,
              surfaceInstanceId:
                typeof detachedSurface.surfaceInstanceId === 'string' &&
                detachedSurface.surfaceInstanceId.length > 0
                  ? detachedSurface.surfaceInstanceId
                  : surfaceInstanceId,
              hostMode: detachedSurface.hostMode === 'popout' ? 'popout' : 'floating',
              hostViewportId:
                typeof detachedSurface.hostViewportId === 'string' &&
                detachedSurface.hostViewportId.length > 0
                  ? detachedSurface.hostViewportId
                  : primaryViewportId,
              lastSlotId:
                typeof detachedSurface.lastSlotId === 'string' && detachedSurface.lastSlotId.length > 0
                  ? detachedSurface.lastSlotId
                  : defaultSecondaryViewportSlotId,
              preferredSplitDockSide:
                detachedSurface.preferredSplitDockSide === 'top' ||
                detachedSurface.preferredSplitDockSide === 'right' ||
                detachedSurface.preferredSplitDockSide === 'bottom' ||
                detachedSurface.preferredSplitDockSide === 'left'
                  ? detachedSurface.preferredSplitDockSide
                  : defaultBrowserViewportSplitDockSide,
            }),
          ] as const
        })
        .filter(
          (entry): entry is readonly [string, WorkspaceDetachedSlotSurfaceState] => entry !== null,
        )
    : []
  const normalizedViewportSlotsById =
    viewportSlotEntries.length > 0
      ? Object.fromEntries(viewportSlotEntries)
      : defaultSlotTree.viewportSlotsById
  const normalizedDetachedSlotSurfaceById = Object.fromEntries(detachedSlotSurfaceEntries)

  return {
    version: 1,
    leftDockWidth: roundNumber(
      typeof value.leftDockWidth === 'number' ? value.leftDockWidth : NaN,
      defaultLeftDockWidth,
    ),
    isLeftDockViewportSplit: value.isLeftDockViewportSplit === true,
    browserToolbarOwnerSurfaceInstanceId:
      typeof value.browserToolbarOwnerSurfaceInstanceId === 'string' &&
      value.browserToolbarOwnerSurfaceInstanceId.length > 0
        ? value.browserToolbarOwnerSurfaceInstanceId
        : defaultBrowserToolbarOwnerSurfaceInstanceId,
    browserShell: cloneBrowserShellState({
      isCollapsed: isRecord(value.browserShell) && value.browserShell.isCollapsed === true,
      presentationMode:
        isRecord(value.browserShell) &&
        (value.browserShell.presentationMode === 'collapsed' ||
          value.browserShell.presentationMode === 'essentials' ||
          value.browserShell.presentationMode === 'expanded')
          ? (value.browserShell.presentationMode as BrowserPresentationMode)
          : isRecord(value.browserShell) && value.browserShell.isCollapsed === true
            ? 'collapsed'
            : defaultBrowserPresentationMode,
      isFloating: isRecord(value.browserShell) && value.browserShell.isFloating === true,
      isPoppedOut: isRecord(value.browserShell) && value.browserShell.isPoppedOut === true,
      isViewportSplit: isRecord(value.browserShell) && value.browserShell.isViewportSplit === true,
      position: {
        x:
          isRecord(value.browserShell) && isRecord(value.browserShell.position)
            ? roundNumber(Number(value.browserShell.position.x), 16)
            : 16,
        y:
          isRecord(value.browserShell) && isRecord(value.browserShell.position)
            ? roundNumber(Number(value.browserShell.position.y), 96)
            : 96,
      },
      size: {
        width:
          isRecord(value.browserShell) && isRecord(value.browserShell.size)
            ? roundNumber(Number(value.browserShell.size.width), 320)
            : 320,
        height:
          isRecord(value.browserShell) && isRecord(value.browserShell.size)
            ? roundNumber(Number(value.browserShell.size.height), 560)
            : 560,
      },
      viewportSplitRatio:
        isRecord(value.browserShell) &&
        typeof value.browserShell.viewportSplitRatio === 'number' &&
        Number.isFinite(value.browserShell.viewportSplitRatio)
          ? value.browserShell.viewportSplitRatio
          : defaultBrowserViewportSplitRatio,
      viewportSplitDockSide:
        isRecord(value.browserShell) &&
        (value.browserShell.viewportSplitDockSide === 'top' ||
          value.browserShell.viewportSplitDockSide === 'right' ||
          value.browserShell.viewportSplitDockSide === 'bottom' ||
          value.browserShell.viewportSplitDockSide === 'left')
          ? value.browserShell.viewportSplitDockSide
          : defaultBrowserViewportSplitDockSide,
      popoutState:
        isRecord(value.browserShell) && isRecord(value.browserShell.popoutState)
          ? cloneWorkspacePopoutSurfaceState({
              childWindowId:
                typeof value.browserShell.popoutState.childWindowId === 'string'
                  ? value.browserShell.popoutState.childWindowId
                  : defaultBrowserPopoutState.childWindowId,
              owner:
                value.browserShell.popoutState.owner === 'main-app'
                  ? 'main-app'
                  : 'child-window',
              windowName:
                typeof value.browserShell.popoutState.windowName === 'string'
                  ? value.browserShell.popoutState.windowName
                  : defaultBrowserPopoutState.windowName,
              windowTitle:
                typeof value.browserShell.popoutState.windowTitle === 'string'
                  ? value.browserShell.popoutState.windowTitle
                  : defaultBrowserPopoutState.windowTitle,
              windowFeatures:
                typeof value.browserShell.popoutState.windowFeatures === 'string'
                  ? value.browserShell.popoutState.windowFeatures
                  : defaultBrowserPopoutState.windowFeatures,
            })
          : defaultBrowserPopoutState,
    }),
    activeViewerViewportId: resolveWorkspaceActiveSurfaceInstanceId({
      preferredSurfaceInstanceId:
        typeof value.activeViewerViewportId === 'string' && value.activeViewerViewportId.length > 0
          ? value.activeViewerViewportId
          : null,
      viewportSlotsById: normalizedViewportSlotsById,
      detachedSlotSurfaceById: normalizedDetachedSlotSurfaceById,
      primaryViewportId,
    }),
    hostRouteOwnershipByRouteId: Object.fromEntries(hostRouteOwnershipEntries),
    surfacePlacementById: Object.fromEntries(surfacePlacementEntries),
    primaryViewportId,
    viewportChromeById,
    viewportSlotRootNodeId:
      typeof value.viewportSlotRootNodeId === 'string' && value.viewportSlotRootNodeId.length > 0
        ? value.viewportSlotRootNodeId
        : defaultViewportLayoutRootNodeId,
    viewportSlotsById: normalizedViewportSlotsById,
    viewportLayoutNodesById:
      viewportLayoutNodeEntries.length > 0
        ? Object.fromEntries(viewportLayoutNodeEntries)
        : defaultSlotTree.viewportLayoutNodesById,
    detachedSlotSurfaceById: normalizedDetachedSlotSurfaceById,
    editorSurfacePlacementById: Object.fromEntries(editorSurfaceEntries),
  }
}

export const readPersistedWorkspaceLayout = (): PersistedWorkspaceLayout | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  try {
    const rawValue = window.localStorage.getItem(workspaceLayoutStorageKey)
    if (rawValue === null || rawValue.length === 0) {
      return null
    }
    return normalizePersistedWorkspaceLayout(JSON.parse(rawValue))
  } catch {
    return null
  }
}

export const writePersistedWorkspaceLayout = (layout: PersistedWorkspaceLayout): void => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(workspaceLayoutStorageKey, JSON.stringify(layout))
  } catch {
    // Ignore storage write failures so the workspace keeps working without persistence.
  }
}
