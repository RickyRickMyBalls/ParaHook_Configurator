export const RIGHT_DOCK_PADDING_X = 16
export const MIN_AXIS_WIDGET_SIZE = 80
export const MAX_AXIS_WIDGET_SIZE = 420
export const COMPACT_AXIS_WIDGET_SIZE = MIN_AXIS_WIDGET_SIZE
export const DEFAULT_EXPANDED_AXIS_WIDGET_SIZE = 308

export const resolveRightDockWidth = (axisWidgetSize: number): number =>
  axisWidgetSize + RIGHT_DOCK_PADDING_X * 2
