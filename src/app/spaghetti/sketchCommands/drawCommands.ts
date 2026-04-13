export type PrimarySketchDrawTool = 'line' | 'pline' | 'rectangle' | 'circle'

export type CanonicalGeometrySketchDrawCommand =
  | PrimarySketchDrawTool
  | 'previous'
  | 'undo'
  | 'enter'
  | 'delete'
  | 'back'
  | 'esc'
  | 'x'

export type GeometrySketchDrawCommand =
  | CanonicalGeometrySketchDrawCommand
  | 'l'
  | 'pl'
  | 'rec'
  | 'cc'
  | 'p'
  | 'del'
  | 'b'

export type SketchDrawCommandActionId =
  | 'sketchdraw.tool.line'
  | 'sketchdraw.tool.pline'
  | 'sketchdraw.tool.rectangle'
  | 'sketchdraw.tool.circle'
  | 'sketchdraw.previous'
  | 'sketchdraw.delete'
  | 'sketchdraw.back'
  | 'sketchdraw.exit'

export const PRIMARY_SKETCH_DRAW_TOOLS = ['line', 'pline', 'rectangle', 'circle'] as const

export const SKETCH_DRAW_HELP_TEXT =
  'Draw Sketch commands: line (l), pline (pl), rectangle (rec), circle (cc), previous (p), undo, enter, esc, back (b), x, status, help'

const TOOL_LABELS: Record<PrimarySketchDrawTool, string> = {
  line: 'Line',
  pline: 'PLine',
  rectangle: 'Rectangle',
  circle: 'Circle',
}

const CONSOLE_TOOL_LABELS: Record<PrimarySketchDrawTool, string> = {
  line: 'LINE',
  pline: 'PLINE',
  rectangle: 'REC',
  circle: 'CC',
}

const NORMALIZED_DRAW_COMMANDS: Record<GeometrySketchDrawCommand, CanonicalGeometrySketchDrawCommand> = {
  line: 'line',
  l: 'line',
  pline: 'pline',
  pl: 'pline',
  rectangle: 'rectangle',
  rec: 'rectangle',
  circle: 'circle',
  cc: 'circle',
  previous: 'previous',
  p: 'previous',
  undo: 'undo',
  enter: 'enter',
  delete: 'delete',
  del: 'delete',
  back: 'back',
  b: 'back',
  esc: 'esc',
  x: 'x',
}

const ACTION_TO_DRAW_COMMAND: Record<SketchDrawCommandActionId, Exclude<CanonicalGeometrySketchDrawCommand, 'undo' | 'enter' | 'esc'>> = {
  'sketchdraw.tool.line': 'line',
  'sketchdraw.tool.pline': 'pline',
  'sketchdraw.tool.rectangle': 'rectangle',
  'sketchdraw.tool.circle': 'circle',
  'sketchdraw.previous': 'previous',
  'sketchdraw.delete': 'delete',
  'sketchdraw.back': 'back',
  'sketchdraw.exit': 'x',
}

export const isPrimarySketchDrawTool = (
  tool: string | null | undefined,
): tool is PrimarySketchDrawTool =>
  tool === 'line' || tool === 'pline' || tool === 'rectangle' || tool === 'circle'

export const getPrimarySketchDrawToolLabel = (tool: PrimarySketchDrawTool): string =>
  TOOL_LABELS[tool]

export const getPrimarySketchDrawConsoleToolLabel = (tool: PrimarySketchDrawTool): string =>
  CONSOLE_TOOL_LABELS[tool]

export const buildSketchDrawSessionIdlePrompt = (lastUsedTool: PrimarySketchDrawTool | null): string =>
  lastUsedTool !== null
    ? 'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]'
    : 'Sketch Draw > [Line, PLine, Rectangle, Circle, X]'

export const normalizeGeometrySketchDrawCommand = (
  command: GeometrySketchDrawCommand,
): CanonicalGeometrySketchDrawCommand => NORMALIZED_DRAW_COMMANDS[command]

export const resolveGeometrySketchDrawCommandFromInput = (
  input: string,
): CanonicalGeometrySketchDrawCommand | null => {
  const normalized = input.trim().toLowerCase() as GeometrySketchDrawCommand
  return normalized in NORMALIZED_DRAW_COMMANDS
    ? NORMALIZED_DRAW_COMMANDS[normalized]
    : null
}

export const resolveGeometrySketchDrawCommandFromActionId = (
  actionId: string,
): Exclude<CanonicalGeometrySketchDrawCommand, 'undo' | 'enter' | 'esc'> | null =>
  actionId in ACTION_TO_DRAW_COMMAND
    ? ACTION_TO_DRAW_COMMAND[actionId as SketchDrawCommandActionId]
    : null
