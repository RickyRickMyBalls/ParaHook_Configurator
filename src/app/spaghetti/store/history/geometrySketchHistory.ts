import type { SpaghettiNode } from '../../schema/spaghettiTypes'
import type {
  GeometrySketchDrawDraft,
  GeometrySketchDrawStage,
  GeometrySketchSelectionWindowDraft,
  GeometrySketchTool,
} from '../useSpaghettiStore'

type GeometrySketchSessionSnapshotState = {
  activeTool: GeometrySketchTool | null
  lastUsedTool: GeometrySketchTool | null
  drawStage: GeometrySketchDrawStage | null
  drawDraft: GeometrySketchDrawDraft | null
  selectedComponentIds: string[]
  hoveredComponentId: string | null
  selectionWindowDraft: GeometrySketchSelectionWindowDraft | null
}

type GeometrySketchSessionHistoryFields = {
  stagedUndoCommands: GeometrySketchStagedCommand[]
  stagedRedoCommands: GeometrySketchStagedCommand[]
  sessionUndoCommands: GeometrySketchSessionHistoryCommand[]
  sessionRedoCommands: GeometrySketchSessionHistoryCommand[]
}

export type GeometrySketchSessionSnapshot = GeometrySketchSessionSnapshotState

export type GeometrySketchStagedCommand = {
  commandId: string
  nodeId: string
  label: string
  kind: 'geometry'
  beforeSessionState: GeometrySketchSessionSnapshot
  afterSessionState: GeometrySketchSessionSnapshot
  beforeParams: SpaghettiNode['params']
  afterParams: SpaghettiNode['params']
}

export type GeometrySketchToolSelectionCommand = {
  commandId: string
  label: string
  kind: 'tool-selection'
  beforeSessionState: GeometrySketchSessionSnapshot
  afterSessionState: GeometrySketchSessionSnapshot
}

export type GeometrySketchSessionHistoryCommand =
  | GeometrySketchStagedCommand
  | GeometrySketchToolSelectionCommand

export type GeometrySketchLocalHistoryState = {
  undoCommands: GeometrySketchSessionHistoryCommand[]
  redoCommands: GeometrySketchSessionHistoryCommand[]
}

type CloneNodeParams = (params: SpaghettiNode['params']) => SpaghettiNode['params']

const cloneGeometrySketchDrawDraft = (
  draft: GeometrySketchDrawDraft | null,
): GeometrySketchDrawDraft | null =>
  draft === null
    ? null
    : {
        points: draft.points.map((point) => ({ ...point })),
        hoverPoint: draft.hoverPoint === null ? null : { ...draft.hoverPoint },
        hoverSnapTarget: draft.hoverSnapTarget,
      }

const cloneGeometrySketchSelectionWindowDraft = (
  draft: GeometrySketchSelectionWindowDraft | null,
): GeometrySketchSelectionWindowDraft | null =>
  draft === null
    ? null
    : {
        anchor: { ...draft.anchor },
        current: { ...draft.current },
        mode: draft.mode,
      }

const getGeometrySketchUndoHistoryCommands = (
  commands: readonly GeometrySketchSessionHistoryCommand[],
): GeometrySketchStagedCommand[] =>
  commands.filter(
    (command): command is GeometrySketchStagedCommand => command.kind === 'geometry',
  )

export const cloneGeometrySketchSessionSnapshot = (
  snapshot: GeometrySketchSessionSnapshot,
): GeometrySketchSessionSnapshot => ({
  activeTool: snapshot.activeTool,
  lastUsedTool: snapshot.lastUsedTool,
  drawStage: snapshot.drawStage,
  drawDraft: cloneGeometrySketchDrawDraft(snapshot.drawDraft),
  selectedComponentIds: [...snapshot.selectedComponentIds],
  hoveredComponentId: snapshot.hoveredComponentId,
  selectionWindowDraft: cloneGeometrySketchSelectionWindowDraft(snapshot.selectionWindowDraft),
})

export const buildGeometrySketchSessionSnapshot = (
  session: GeometrySketchSessionSnapshotState,
): GeometrySketchSessionSnapshot => ({
  activeTool: session.activeTool,
  lastUsedTool: session.lastUsedTool,
  drawStage: session.drawStage,
  drawDraft: cloneGeometrySketchDrawDraft(session.drawDraft),
  selectedComponentIds: [...session.selectedComponentIds],
  hoveredComponentId: session.hoveredComponentId,
  selectionWindowDraft: cloneGeometrySketchSelectionWindowDraft(session.selectionWindowDraft),
})

export const applyGeometrySketchSessionSnapshot = <T extends GeometrySketchSessionSnapshotState>(
  session: T,
  snapshot: GeometrySketchSessionSnapshot,
): T => ({
  ...session,
  activeTool: snapshot.activeTool,
  lastUsedTool: snapshot.lastUsedTool,
  drawStage: snapshot.drawStage,
  drawDraft: cloneGeometrySketchDrawDraft(snapshot.drawDraft),
  selectedComponentIds: [...snapshot.selectedComponentIds],
  hoveredComponentId: snapshot.hoveredComponentId,
  selectionWindowDraft: cloneGeometrySketchSelectionWindowDraft(snapshot.selectionWindowDraft),
})

export const buildGeometrySketchCommittedSessionSnapshot = (
  session: Pick<GeometrySketchSessionSnapshotState, 'lastUsedTool'>,
): GeometrySketchSessionSnapshot => ({
  activeTool: null,
  lastUsedTool: session.lastUsedTool,
  drawStage: 'sessionIdle',
  drawDraft: null,
  selectedComponentIds: [],
  hoveredComponentId: null,
  selectionWindowDraft: null,
})

export const getGeometrySketchLocalHistoryTargetId = (
  graphDocumentId: string,
  nodeId: string,
): string => `${graphDocumentId}:${nodeId}:sketch:draw-local-history`

export const cloneGeometrySketchSessionHistoryCommand = (
  command: GeometrySketchSessionHistoryCommand,
  cloneNodeParams: CloneNodeParams,
): GeometrySketchSessionHistoryCommand => {
  if (command.kind === 'geometry') {
    return {
      ...command,
      beforeSessionState: cloneGeometrySketchSessionSnapshot(command.beforeSessionState),
      afterSessionState: cloneGeometrySketchSessionSnapshot(command.afterSessionState),
      beforeParams: cloneNodeParams(command.beforeParams),
      afterParams: cloneNodeParams(command.afterParams),
    }
  }

  return {
    ...command,
    beforeSessionState: cloneGeometrySketchSessionSnapshot(command.beforeSessionState),
    afterSessionState: cloneGeometrySketchSessionSnapshot(command.afterSessionState),
  }
}

export const cloneGeometrySketchLocalHistoryState = (
  history: GeometrySketchLocalHistoryState | null | undefined,
  cloneNodeParams: CloneNodeParams,
): GeometrySketchLocalHistoryState => ({
  undoCommands:
    history?.undoCommands.map((command) =>
      cloneGeometrySketchSessionHistoryCommand(command, cloneNodeParams),
    ) ?? [],
  redoCommands:
    history?.redoCommands.map((command) =>
      cloneGeometrySketchSessionHistoryCommand(command, cloneNodeParams),
    ) ?? [],
})

export const buildGeometrySketchLocalHistoryState = (
  undoCommands: readonly GeometrySketchSessionHistoryCommand[],
  redoCommands: readonly GeometrySketchSessionHistoryCommand[],
  cloneNodeParams: CloneNodeParams,
): GeometrySketchLocalHistoryState => ({
  undoCommands: undoCommands.map((command) =>
    cloneGeometrySketchSessionHistoryCommand(command, cloneNodeParams),
  ),
  redoCommands: redoCommands.map((command) =>
    cloneGeometrySketchSessionHistoryCommand(command, cloneNodeParams),
  ),
})

export const hasGeometrySketchLocalHistoryCommands = (
  history: GeometrySketchLocalHistoryState,
): boolean => history.undoCommands.length > 0 || history.redoCommands.length > 0

export const findPreferredGeometrySketchHistoryCommandIndex = (
  commands: readonly GeometrySketchSessionHistoryCommand[],
  preferGeometry: boolean,
): number => {
  if (!preferGeometry) {
    return commands.length - 1
  }
  for (let index = commands.length - 1; index >= 0; index -= 1) {
    if (commands[index]?.kind === 'geometry') {
      return index
    }
  }
  return commands.length - 1
}

export const withGeometrySketchLocalHistoryState = (
  historyByTargetId: Record<string, GeometrySketchLocalHistoryState>,
  targetId: string,
  history: GeometrySketchLocalHistoryState,
  cloneNodeParams: CloneNodeParams,
): Record<string, GeometrySketchLocalHistoryState> => {
  if (!hasGeometrySketchLocalHistoryCommands(history)) {
    const { [targetId]: _removed, ...remaining } = historyByTargetId
    return remaining
  }

  return {
    ...historyByTargetId,
    [targetId]: cloneGeometrySketchLocalHistoryState(history, cloneNodeParams),
  }
}

export const buildGeometrySketchSessionWithHistory = <T extends object>(options: {
  session: T
  undoCommands: readonly GeometrySketchSessionHistoryCommand[]
  redoCommands: readonly GeometrySketchSessionHistoryCommand[]
  cloneNodeParams: CloneNodeParams
}): T & GeometrySketchSessionHistoryFields => {
  const undoCommands = options.undoCommands.map((command) =>
    cloneGeometrySketchSessionHistoryCommand(command, options.cloneNodeParams),
  )
  const redoCommands = options.redoCommands.map((command) =>
    cloneGeometrySketchSessionHistoryCommand(command, options.cloneNodeParams),
  )
  return {
    ...options.session,
    sessionUndoCommands: undoCommands,
    sessionRedoCommands: redoCommands,
    stagedUndoCommands: getGeometrySketchUndoHistoryCommands(undoCommands),
    stagedRedoCommands: getGeometrySketchUndoHistoryCommands(redoCommands),
  }
}

export const createGeometrySketchChildSummaries = (
  commands: readonly GeometrySketchSessionHistoryCommand[],
): {
  childId: string
  label: string
  kind: GeometrySketchSessionHistoryCommand['kind']
  sequence: number
}[] =>
  commands.map((command, index) => ({
    childId: command.commandId,
    label: command.label,
    kind: command.kind,
    sequence: index + 1,
  }))
