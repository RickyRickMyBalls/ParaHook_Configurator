import {
  defaultWorkspaceSplitDirection,
  resolveDefaultWorkspaceSplitDockSide,
  defaultWorkspaceSplitPriority,
  resolveWorkspaceSplitDirectionForDockSide,
  type WorkspaceSplitDockSide,
  type WorkspaceSplitDirection,
  type WorkspaceSplitPriority,
} from './workspaceSplitTypes'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'
import type { ProjectionMode } from '../../shared/viewSettingsTypes'

export type LeftDockPanelId = 'browser' | 'meatball-editor'

export type LeftDockResizeMenuState = {
  x: number
  y: number
}

export type WorkspaceSplitMenuState = {
  x: number
  y: number
  scope: 'floating-titlebar' | 'divider'
  targetSurfaceInstanceId?: string | null
}

export type BrowserFloatingPosition = {
  x: number
  y: number
}

export type BrowserFloatingSize = {
  width: number
  height: number
}

export type BrowserPresentationMode = 'expanded' | 'essentials' | 'collapsed'

export type BrowserShellState = {
  presentationMode: BrowserPresentationMode
  isCollapsed: boolean
  isFloating: boolean
  isPoppedOut: boolean
  isViewportSplit: boolean
  position: BrowserFloatingPosition
  size: BrowserFloatingSize
  viewportSplitRatio: number
  viewportSplitDockSide: WorkspaceSplitDockSide
  popoutState: WorkspacePopoutSurfaceState | null
}

export type WorkspaceSurfaceKind =
  | 'modelViewer'
  | 'browser'
  | 'catalog'
  | 'console'
  | 'spaghettiEditor'
  | 'notepad'
  | 'dashboard'

export type WorkspaceSurfaceInstanceId = string
export type WorkspaceViewportId = WorkspaceSurfaceInstanceId
export type WorkspaceViewportSlotId = string
export type WorkspaceLayoutNodeId = string
export type WorkspaceHostRouteId = 'left-dock-browser'
export type WorkspaceRetainedSurfaceInstanceIdsByKind = Partial<
  Record<WorkspaceSurfaceKind, WorkspaceSurfaceInstanceId>
>

export type WorkspacePresentationMode = 'windowed' | 'tiled'
export type WorkspaceSurfaceHostMode = 'slotted' | 'floating' | 'popout'
export type WorkspaceSurfacePlacementHostMode = WorkspaceSurfaceHostMode | 'docked'

export type WorkspaceHostedSurfaceWindowOwner = 'main-app' | 'child-window'
export type WorkspaceChildWindowId = string

export type WorkspaceChildWindowSpec = {
  childWindowId: WorkspaceChildWindowId
  windowName: string
  windowTitle: string
  windowFeatures: string
}

export type WorkspacePopoutSurfaceState = WorkspaceChildWindowSpec & {
  owner: WorkspaceHostedSurfaceWindowOwner
}

export type WorkspaceFloatingRect = {
  x: number
  y: number
  width: number
  height: number
}

export type WorkspaceSurfaceRestoreTarget = {
  slotId?: WorkspaceViewportSlotId
  preferredSplitDockSide?: WorkspaceSplitDockSide
}

export type WorkspaceHostRouteOwnership = {
  routeId: WorkspaceHostRouteId
  surfaceKind: WorkspaceSurfaceKind
  surfaceInstanceId: WorkspaceSurfaceInstanceId
  hostViewportId: WorkspaceViewportId | null
}

export type WorkspaceHostRouteOwnershipByRouteId = Partial<
  Record<WorkspaceHostRouteId, WorkspaceHostRouteOwnership>
>

export type WorkspaceSurfacePlacementState = {
  surfaceKind: WorkspaceSurfaceKind
  surfaceInstanceId: WorkspaceSurfaceInstanceId
  hostMode: WorkspaceSurfacePlacementHostMode
  hostViewportId: WorkspaceViewportId | null
  slotId?: WorkspaceViewportSlotId
  floatingRect?: WorkspaceFloatingRect
  popoutState?: WorkspacePopoutSurfaceState | null
  restoreTarget?: WorkspaceSurfaceRestoreTarget | null
  namedHostRouteId?: WorkspaceHostRouteId
}

export type EditorSurfaceWindowMode =
  | 'collapsed'
  | 'meatball editor view'
  | 'expanded'
  | 'maximized'
  | 'split view'
  | 'separateWindow'

export type EditorSurfacePosition = {
  x: number
  y: number
}

export type EditorSurfaceSize = {
  width: number
  height: number
}

export type EditorSurfaceRestoreFromCollapsed = {
  windowMode: 'expanded' | 'maximized' | 'split view'
  position?: EditorSurfacePosition
  size?: EditorSurfaceSize
  splitRatio?: number
}

export type EditorSurfaceRestoreFromSplit = {
  windowMode: 'expanded' | 'maximized'
  position?: EditorSurfacePosition
  size?: EditorSurfaceSize
}

export type EditorSurfaceRestoreFromSeparateWindow = {
  windowMode: Exclude<EditorSurfaceWindowMode, 'separateWindow'>
  position?: EditorSurfacePosition
  size?: EditorSurfaceSize
  splitRatio?: number
  splitDirection?: WorkspaceSplitDirection
  splitDockSide?: WorkspaceSplitDockSide
  splitPriority?: WorkspaceSplitPriority
}

export type EditorWorkspaceSurfaceState = {
  surfaceKind: 'spaghettiEditor'
  surfaceInstanceId: WorkspaceSurfaceInstanceId
  presentationMode: WorkspacePresentationMode
  windowMode: EditorSurfaceWindowMode
  position: EditorSurfacePosition
  size: EditorSurfaceSize
  splitRatio: number
  splitDirection: WorkspaceSplitDirection
  splitDockSide: WorkspaceSplitDockSide
  splitPriority: WorkspaceSplitPriority
  popoutState: WorkspacePopoutSurfaceState | null
  restoreFromCollapsed: EditorSurfaceRestoreFromCollapsed | null
  restoreFromSplit: EditorSurfaceRestoreFromSplit | null
  restoreFromSeparateWindow: EditorSurfaceRestoreFromSeparateWindow | null
}

export type WorkspaceEditorSurfaceBinding = {
  surfaceKind: 'spaghettiEditor'
  surfaceInstanceId: WorkspaceSurfaceInstanceId
  graphDocumentId: string
}

export type WorkspaceViewportChromeState = {
  viewportId: WorkspaceViewportId
  surfaceKind: 'modelViewer'
  localViewState: WorkspaceViewportLocalViewState
}

export type WorkspaceViewportResultMode = 'auto' | 'draft' | 'final'
export type WorkspaceViewToolbarExpandedPresentationMode = 'classic' | 'tabs'
export type WorkspaceViewToolbarHostMode = 'docked' | 'floating'
export type WorkspaceViewToolbarDockMode = 'below-axis' | 'top-right-cluster'
export type WorkspaceViewToolbarTabKey =
  | 'camera'
  | 'fly-mode'
  | 'transform'
  | 'snap'
  | 'gizmo'
  | 'view'
  | 'environment'
  | 'shadows'
  | 'ground'
  | 'materials'

export type WorkspaceViewportLocalViewState = {
  projectionMode: ProjectionMode
  axisOverlayEnabled: boolean
  viewToolbarOpen: boolean
  viewToolbarExpandedPresentationMode: WorkspaceViewToolbarExpandedPresentationMode
  viewToolbarHostMode: WorkspaceViewToolbarHostMode
  viewToolbarDockMode: WorkspaceViewToolbarDockMode
  viewToolbarFloatingRect: WorkspaceFloatingRect | null
  viewToolbarActiveTab: WorkspaceViewToolbarTabKey
  viewToolbarCompactAxisWidgetSize: number | null
  viewToolbarExpandedAxisWidgetSize: number | null
  viewportResultMode: WorkspaceViewportResultMode
}

export type WorkspaceViewportSlot = {
  slotId: WorkspaceViewportSlotId
  surfaceKind: WorkspaceSurfaceKind
  surfaceInstanceId: WorkspaceSurfaceInstanceId
  hostMode: 'slotted'
  hostViewportId: WorkspaceViewportId | null
  leafNodeId: WorkspaceLayoutNodeId
  retainedSurfaceInstanceIdsByKind: WorkspaceRetainedSurfaceInstanceIdsByKind
}

export type WorkspaceDetachedSurfaceHostMode = Exclude<WorkspaceSurfaceHostMode, 'slotted'>

export type WorkspaceDetachedSlotSurfaceState = {
  surfaceKind: WorkspaceSurfaceKind
  surfaceInstanceId: WorkspaceSurfaceInstanceId
  hostMode: WorkspaceDetachedSurfaceHostMode
  hostViewportId: WorkspaceViewportId | null
  lastSlotId: WorkspaceViewportSlotId
  preferredSplitDockSide: WorkspaceSplitDockSide
}

export type WorkspaceLayoutLeafNode = {
  nodeId: WorkspaceLayoutNodeId
  kind: 'leaf'
  slotId: WorkspaceViewportSlotId
}

export type WorkspaceLayoutSplitNode = {
  nodeId: WorkspaceLayoutNodeId
  kind: 'split'
  splitDirection: WorkspaceSplitDirection
  splitDockSide: WorkspaceSplitDockSide
  ratio: number
  firstChildId: WorkspaceLayoutNodeId
  secondChildId: WorkspaceLayoutNodeId
}

export type WorkspaceLayoutNode = WorkspaceLayoutLeafNode | WorkspaceLayoutSplitNode

export type PersistedWorkspaceLayout = {
  version: 1
  leftDockWidth: number
  isLeftDockViewportSplit: boolean
  browserToolbarOwnerSurfaceInstanceId: WorkspaceSurfaceInstanceId | null
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

export const defaultLeftDockWidth = 320
export const defaultPrimaryWorkspaceViewportId: WorkspaceViewportId = 'model-viewer-primary'
export const defaultPrimaryViewportSlotId: WorkspaceViewportSlotId = 'workspace-slot-primary'
export const defaultSecondaryViewportSlotId: WorkspaceViewportSlotId = 'workspace-slot-secondary'
export const defaultPrimaryViewportLeafNodeId: WorkspaceLayoutNodeId = 'workspace-slot-leaf-primary'
export const defaultSecondaryViewportLeafNodeId: WorkspaceLayoutNodeId =
  'workspace-slot-leaf-secondary'
export const defaultViewportLayoutSplitNodeId: WorkspaceLayoutNodeId = 'workspace-slot-split-root'
export const defaultViewportLayoutRootNodeId: WorkspaceLayoutNodeId =
  defaultPrimaryViewportLeafNodeId

export const defaultBrowserFloatingPosition: BrowserFloatingPosition = { x: 16, y: 96 }
export const defaultBrowserFloatingSize: BrowserFloatingSize = { width: 320, height: 560 }
export const defaultBrowserPresentationMode: BrowserPresentationMode = 'expanded'
export const defaultBrowserToolbarOwnerSurfaceInstanceId: WorkspaceSurfaceInstanceId =
  'browser-left-dock-primary'
export const defaultBrowserHostRouteId: WorkspaceHostRouteId = 'left-dock-browser'
export const defaultBrowserViewportSplitRatio = 0.5
export const defaultBrowserViewportSplitDockSide: WorkspaceSplitDockSide = 'right'
export const defaultBrowserPopoutState: WorkspacePopoutSurfaceState = {
  childWindowId: 'browser-surface-popout',
  owner: 'child-window',
  windowName: 'parahook-browser',
  windowTitle: 'ParaHook Browser',
  windowFeatures: 'popup=yes,width=1080,height=720,resizable=yes,scrollbars=no',
}
export const defaultEditorSurfacePosition: EditorSurfacePosition = { x: 344, y: 16 }
export const defaultEditorSurfaceSize: EditorSurfaceSize = { width: 980, height: 760 }
export const defaultEditorSurfaceSplitRatio = 0.5

export const createDefaultEditorPopoutState = (
  surfaceInstanceId: WorkspaceSurfaceInstanceId,
): WorkspacePopoutSurfaceState => ({
  childWindowId: `spaghetti-editor-${surfaceInstanceId}-popout`,
  owner: 'main-app',
  windowName: `parahook-spaghetti-${surfaceInstanceId}`,
  windowTitle: 'ParaHook Spaghetti Editor',
  windowFeatures: 'popup=yes,width=1440,height=920,resizable=yes,scrollbars=no',
})

export const createDefaultModelViewportPopoutState = (
  surfaceInstanceId: WorkspaceSurfaceInstanceId,
): WorkspacePopoutSurfaceState => ({
  childWindowId: `model-viewport-${surfaceInstanceId}-popout`,
  owner: 'child-window',
  windowName: `parahook-model-viewport-${surfaceInstanceId}`,
  windowTitle: 'ParaHook Model Viewport',
  windowFeatures: 'popup=yes,width=1440,height=920,resizable=yes,scrollbars=no',
})

export const resolveWorkspacePresentationMode = (
  windowMode: EditorSurfaceWindowMode,
): WorkspacePresentationMode => (windowMode === 'split view' ? 'tiled' : 'windowed')

export const createDefaultEditorWorkspaceSurfaceState = (
  surfaceInstanceId: WorkspaceSurfaceInstanceId,
): EditorWorkspaceSurfaceState => ({
  surfaceKind: 'spaghettiEditor',
  surfaceInstanceId,
  presentationMode: 'windowed',
  windowMode: 'expanded',
  position: defaultEditorSurfacePosition,
  size: defaultEditorSurfaceSize,
  splitRatio: defaultEditorSurfaceSplitRatio,
  splitDirection: defaultWorkspaceSplitDirection,
  splitDockSide: resolveDefaultWorkspaceSplitDockSide(defaultWorkspaceSplitDirection),
  splitPriority: defaultWorkspaceSplitPriority,
  popoutState: createDefaultEditorPopoutState(surfaceInstanceId),
  restoreFromCollapsed: null,
  restoreFromSplit: null,
  restoreFromSeparateWindow: null,
})

export const createDefaultWorkspaceViewportChromeState = (
  viewportId: WorkspaceViewportId,
): WorkspaceViewportChromeState => ({
  viewportId,
  surfaceKind: 'modelViewer',
  localViewState: createDefaultWorkspaceViewportLocalViewState(),
})

export const createDefaultWorkspaceViewportLocalViewState =
  (): WorkspaceViewportLocalViewState => ({
    projectionMode: DEFAULT_VIEW_SETTINGS.projectionMode,
    axisOverlayEnabled: DEFAULT_VIEW_SETTINGS.axisOverlayEnabled,
    viewToolbarOpen: false,
    viewToolbarExpandedPresentationMode: 'classic',
    viewToolbarHostMode: 'docked',
    viewToolbarDockMode: 'below-axis',
    viewToolbarFloatingRect: null,
    viewToolbarActiveTab: 'camera',
    viewToolbarCompactAxisWidgetSize: null,
    viewToolbarExpandedAxisWidgetSize: null,
    viewportResultMode: 'auto',
  })

export const createWorkspaceSurfaceInstanceIdForSlot = (
  surfaceKind: WorkspaceSurfaceKind,
  slotId: WorkspaceViewportSlotId,
): WorkspaceSurfaceInstanceId => {
  if (surfaceKind === 'modelViewer') {
    return slotId === defaultPrimaryViewportSlotId
      ? defaultPrimaryWorkspaceViewportId
      : `model-viewer-${slotId}`
  }
  if (surfaceKind === 'browser') {
    return `browser-${slotId}`
  }
  if (surfaceKind === 'catalog') {
    return `catalog-${slotId}`
  }
  if (surfaceKind === 'console') {
    return `console-${slotId}`
  }
  if (surfaceKind === 'notepad') {
    return `notepad-${slotId}`
  }
  if (surfaceKind === 'dashboard') {
    return `dashboard-${slotId}`
  }
  return `spaghetti-${slotId}`
}

export const workspacePrimarySlotSupportsSurfaceKind = (
  surfaceKind: WorkspaceSurfaceKind,
): boolean =>
  surfaceKind === 'modelViewer' ||
  surfaceKind === 'browser' ||
  surfaceKind === 'catalog' ||
  surfaceKind === 'console' ||
  surfaceKind === 'spaghettiEditor' ||
  surfaceKind === 'notepad' ||
  surfaceKind === 'dashboard'

export const resolveWorkspaceActiveSurfaceInstanceId = ({
  preferredSurfaceInstanceId,
  viewportSlotsById,
  detachedSlotSurfaceById,
  primaryViewportId,
}: {
  preferredSurfaceInstanceId?: WorkspaceSurfaceInstanceId | null
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  detachedSlotSurfaceById?: Record<string, WorkspaceDetachedSlotSurfaceState>
  primaryViewportId: WorkspaceViewportId
}): WorkspaceViewportId => {
  const slottedViewerIds = Object.values(viewportSlotsById)
    .filter((slot) => slot.surfaceKind === 'modelViewer')
    .map((slot) => slot.surfaceInstanceId)
  if (
    typeof preferredSurfaceInstanceId === 'string' &&
    slottedViewerIds.includes(preferredSurfaceInstanceId)
  ) {
    return preferredSurfaceInstanceId
  }

  const detachedViewerIds = Object.values(detachedSlotSurfaceById ?? {})
    .filter((surface) => surface.surfaceKind === 'modelViewer')
    .map((surface) => surface.surfaceInstanceId)
  if (
    typeof preferredSurfaceInstanceId === 'string' &&
    detachedViewerIds.includes(preferredSurfaceInstanceId)
  ) {
    return preferredSurfaceInstanceId
  }

  return (
    slottedViewerIds[0] ??
    detachedViewerIds[0] ??
    viewportSlotsById[defaultPrimaryViewportSlotId]?.surfaceInstanceId ??
    primaryViewportId
  )
}

export const createNextWorkspaceGeneratedId = (
  prefix: string,
  existingIds: Iterable<string>,
): string => {
  let maxOrdinal = 0
  const matcher = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\\\]/g, '\\$&')}(?:-(\\d+))?$`)
  for (const existingId of existingIds) {
    const matched = existingId.match(matcher)
    if (matched === null) {
      continue
    }
    const ordinal =
      matched[1] === undefined || matched[1].length === 0 ? 1 : Number.parseInt(matched[1], 10)
    if (Number.isFinite(ordinal)) {
      maxOrdinal = Math.max(maxOrdinal, ordinal)
    }
  }
  return `${prefix}-${maxOrdinal + 1}`
}

export const createDefaultWorkspaceViewportSlot = (
  slotId: WorkspaceViewportSlotId,
  surfaceKind: WorkspaceSurfaceKind,
  leafNodeId: WorkspaceLayoutNodeId,
  hostViewportId: WorkspaceViewportId | null = null,
): WorkspaceViewportSlot => ({
  slotId,
  surfaceKind,
  surfaceInstanceId: createWorkspaceSurfaceInstanceIdForSlot(surfaceKind, slotId),
  hostMode: 'slotted',
  hostViewportId,
  leafNodeId,
  retainedSurfaceInstanceIdsByKind: {
    [surfaceKind]: createWorkspaceSurfaceInstanceIdForSlot(surfaceKind, slotId),
  },
})

export const createDefaultWorkspaceLayoutLeafNode = (
  nodeId: WorkspaceLayoutNodeId,
  slotId: WorkspaceViewportSlotId,
): WorkspaceLayoutLeafNode => ({
  nodeId,
  kind: 'leaf',
  slotId,
})

export const createDefaultWorkspaceLayoutSplitNode = (
  splitDockSide: WorkspaceSplitDockSide,
  ratio: number,
): WorkspaceLayoutSplitNode => ({
  nodeId: defaultViewportLayoutSplitNodeId,
  kind: 'split',
  splitDirection: resolveWorkspaceSplitDirectionForDockSide(splitDockSide),
  splitDockSide,
  ratio,
  firstChildId: defaultPrimaryViewportLeafNodeId,
  secondChildId: defaultSecondaryViewportLeafNodeId,
})

export const createDefaultWorkspaceSlotTree = (): {
  viewportSlotRootNodeId: WorkspaceLayoutNodeId
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>
} => ({
  viewportSlotRootNodeId: defaultViewportLayoutRootNodeId,
  viewportSlotsById: {
    [defaultPrimaryViewportSlotId]: createDefaultWorkspaceViewportSlot(
      defaultPrimaryViewportSlotId,
      'modelViewer',
      defaultPrimaryViewportLeafNodeId,
      defaultPrimaryWorkspaceViewportId,
    ),
  },
  viewportLayoutNodesById: {
    [defaultPrimaryViewportLeafNodeId]: createDefaultWorkspaceLayoutLeafNode(
      defaultPrimaryViewportLeafNodeId,
      defaultPrimaryViewportSlotId,
    ),
  },
})
