import type { WorkspaceViewToolbarDockMode } from '../workspace/workspaceShellTypes'

export const RIGHT_DOCK_PADDING_X = 16
export const AXIS_WIDGET_TOP = 12
export const VIEW_ANCHOR_GAP = 12
export const VIEWPORT_HUD_GAP = 10
export const MIN_AXIS_WIDGET_SIZE = 80
export const MAX_AXIS_WIDGET_SIZE = 1000
export const COMPACT_AXIS_WIDGET_SIZE = MIN_AXIS_WIDGET_SIZE
export const DEFAULT_EXPANDED_AXIS_WIDGET_SIZE = 308

const resolveEffectiveViewToolbarDockMode = (
  dockMode: WorkspaceViewToolbarDockMode,
  isToolbarOpen: boolean,
): WorkspaceViewToolbarDockMode =>
  dockMode === 'top-right-cluster' && isToolbarOpen ? 'top-right-cluster' : 'below-axis'

export const resolveRightDockWidth = (axisWidgetSize: number): number =>
  axisWidgetSize + RIGHT_DOCK_PADDING_X * 2

export const resolveAxisWidgetRight = (
  axisWidgetSize: number,
  dockMode: WorkspaceViewToolbarDockMode,
  isToolbarOpen: boolean,
): number =>
  resolveEffectiveViewToolbarDockMode(dockMode, isToolbarOpen) === 'top-right-cluster'
    ? resolveRightDockWidth(axisWidgetSize) + VIEWPORT_HUD_GAP
    : RIGHT_DOCK_PADDING_X

export const resolveViewAnchorTop = (
  axisWidgetSize: number,
  dockMode: WorkspaceViewToolbarDockMode,
  isToolbarOpen: boolean,
): number =>
  resolveEffectiveViewToolbarDockMode(dockMode, isToolbarOpen) === 'top-right-cluster'
    ? AXIS_WIDGET_TOP
    : AXIS_WIDGET_TOP + axisWidgetSize + VIEW_ANCHOR_GAP

export const resolveViewportHudRight = (
  axisWidgetSize: number,
  dockMode: WorkspaceViewToolbarDockMode,
  isToolbarOpen: boolean,
): number => resolveAxisWidgetRight(axisWidgetSize, dockMode, isToolbarOpen) + axisWidgetSize + VIEWPORT_HUD_GAP
