export const RIGHT_DOCK_PADDING_X = 16
export const AXIS_WIDGET_TOP = 12
export const VIEW_ANCHOR_GAP = 12
export const VIEWPORT_HUD_GAP = 10
export const MIN_AXIS_WIDGET_SIZE = 80
export const MAX_AXIS_WIDGET_SIZE = 420
export const COMPACT_AXIS_WIDGET_SIZE = MIN_AXIS_WIDGET_SIZE
export const DEFAULT_EXPANDED_AXIS_WIDGET_SIZE = 308

export const resolveRightDockWidth = (axisWidgetSize: number): number =>
  axisWidgetSize + RIGHT_DOCK_PADDING_X * 2

export const resolveViewAnchorTop = (axisWidgetSize: number): number =>
  AXIS_WIDGET_TOP + axisWidgetSize + VIEW_ANCHOR_GAP

export const resolveViewportHudRight = (axisWidgetSize: number): number =>
  RIGHT_DOCK_PADDING_X + axisWidgetSize + VIEWPORT_HUD_GAP
