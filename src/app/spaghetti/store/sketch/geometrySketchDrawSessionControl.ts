import type { StoreApi } from 'zustand'
import {
  normalizeGeometrySketchDrawCommand,
  type GeometrySketchDrawCommand,
} from '../../sketchCommands/drawCommands'
import type { SpaghettiNode } from '../../schema/spaghettiTypes'
import type {
  GeometrySketchDrawDraft,
  GeometrySketchDraftPoint,
  GeometrySketchSession,
  GeometrySketchTool,
  SpaghettiStoreState,
} from '../useSpaghettiStore'

type GeometrySketchDrawSessionControlActions = Pick<
  SpaghettiStoreState,
  | 'runGeometrySketchDrawCommand'
  | 'setGeometrySketchSessionTool'
  | 'setGeometrySketchDrawHoverPoint'
>

type AppendConsoleEntryInput = {
  layer: 'App' | 'Commands' | 'Transforms'
  text: string
  source?: string
  severity?: 'error' | 'info'
  commandLineKind?: 'user'
}

type GeometrySketchHistoryCommand = GeometrySketchSession['sessionUndoCommands'][number]
type GeometrySketchSessionSnapshot = GeometrySketchHistoryCommand['beforeSessionState']

type GeometrySketchDrawSessionControlDependencies = {
  set: StoreApi<SpaghettiStoreState>['setState']
  get: StoreApi<SpaghettiStoreState>['getState']
  appendConsoleEntry: (entry: AppendConsoleEntryInput) => void
  appendGeometrySketchConsolePrompt: (
    tool: GeometrySketchTool | null,
    draft: GeometrySketchDrawDraft | null,
    lastUsedTool: GeometrySketchTool | null,
  ) => void
  isGeometrySketchDrawTool: (
    tool: GeometrySketchTool | null,
  ) => tool is Extract<GeometrySketchTool, 'line' | 'pline' | 'rectangle' | 'circle'>
  buildGeometrySketchSessionDraft: (
    mode: GeometrySketchSession['mode'],
    tool: GeometrySketchTool | null,
  ) => GeometrySketchDrawDraft | null
  resolveGeometrySketchDrawStage: (
    mode: GeometrySketchSession['mode'],
    tool: GeometrySketchTool | null,
    draft: GeometrySketchDrawDraft | null,
  ) => GeometrySketchSession['drawStage']
  buildGeometrySketchToolSelectionCommand: (input: {
    tool: GeometrySketchTool
    beforeSessionState: GeometrySketchSessionSnapshot
    afterSessionState: GeometrySketchSessionSnapshot
  }) => GeometrySketchHistoryCommand
  buildGeometrySketchSessionSnapshot: (
    session: GeometrySketchSession,
  ) => GeometrySketchSessionSnapshot
  buildGeometrySketchSessionWithHistory: (input: {
    session: GeometrySketchSession
    undoCommands: GeometrySketchSession['sessionUndoCommands']
    redoCommands: GeometrySketchSession['sessionRedoCommands']
    cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params']
  }) => GeometrySketchSession
  cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params']
  normalizeGeometrySketchDraftPoint: (
    point: GeometrySketchDraftPoint,
  ) => GeometrySketchDraftPoint
  areGeometrySketchDraftPointsEqual: (
    left: GeometrySketchDraftPoint | null,
    right: GeometrySketchDraftPoint | null,
  ) => boolean
}

type GeometrySketchConsolePrompt = {
  tool: GeometrySketchTool | null
  draft: GeometrySketchDrawDraft | null
  lastUsedTool: GeometrySketchTool | null
}

export const createGeometrySketchDrawSessionControlActions = (
  dependencies: GeometrySketchDrawSessionControlDependencies,
): GeometrySketchDrawSessionControlActions => ({
  runGeometrySketchDrawCommand: (command: GeometrySketchDrawCommand) => {
    const state = dependencies.get()
    const normalizedCommand = normalizeGeometrySketchDrawCommand(command)
    switch (normalizedCommand) {
      case 'line':
        state.setGeometrySketchSessionTool('line')
        return
      case 'pline':
        state.setGeometrySketchSessionTool('pline')
        return
      case 'rectangle':
        state.setGeometrySketchSessionTool('rectangle')
        return
      case 'circle':
        state.setGeometrySketchSessionTool('circle')
        return
      case 'previous':
        if (
          state.geometrySketchSession?.mode === 'draw' &&
          dependencies.isGeometrySketchDrawTool(state.geometrySketchSession.lastUsedTool)
        ) {
          state.setGeometrySketchSessionTool(state.geometrySketchSession.lastUsedTool)
        }
        return
      case 'undo':
        state.undoGeometrySketchDrawDraftPoint()
        return
      case 'enter':
        if (
          state.geometrySketchSession?.mode === 'draw' &&
          state.geometrySketchSession.activeTool === null &&
          dependencies.isGeometrySketchDrawTool(state.geometrySketchSession.lastUsedTool)
        ) {
          state.setGeometrySketchSessionTool(state.geometrySketchSession.lastUsedTool)
          return
        }
        state.finishGeometrySketchDrawDraft()
        return
      case 'delete':
        state.deleteGeometrySketchSelectedComponents()
        return
      case 'back':
        state.cancelGeometrySketchDrawDraft()
        return
      case 'esc':
        dependencies.appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: '> esc',
        })
        state.cancelGeometrySketchDrawDraft()
        return
      case 'x':
        state.closeGeometrySketchSession()
        return
    }
  },

  setGeometrySketchSessionTool: (tool) => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    dependencies.set((state) => {
      if (state.geometrySketchSession === null) {
        return state
      }
      const currentSession = state.geometrySketchSession
      if (state.geometrySketchSession.mode === 'draw') {
        const nextDraft =
          currentSession.activeTool === tool
            ? currentSession.drawDraft
            : dependencies.buildGeometrySketchSessionDraft(
                state.geometrySketchSession.mode,
                tool,
              )
        nextPromptRef.current = {
          tool,
          draft: nextDraft,
          lastUsedTool: tool,
        }
      }
      if (currentSession.activeTool === tool) {
        return state
      }
      const nextDrawDraft = dependencies.buildGeometrySketchSessionDraft(
        currentSession.mode,
        tool,
      )
      const nextSessionState = {
        ...currentSession,
        activeTool: tool,
        lastUsedTool: dependencies.isGeometrySketchDrawTool(tool)
          ? tool
          : currentSession.lastUsedTool,
        drawStage: dependencies.resolveGeometrySketchDrawStage(
          currentSession.mode,
          tool,
          nextDrawDraft,
        ),
        drawDraft: nextDrawDraft,
        selectedComponentIds: [],
        hoveredComponentId: null,
        selectionWindowDraft: null,
      }
      if (currentSession.mode !== 'draw') {
        return {
          geometrySketchSession: nextSessionState,
        }
      }
      const historyEntry = dependencies.buildGeometrySketchToolSelectionCommand({
        tool,
        beforeSessionState: dependencies.buildGeometrySketchSessionSnapshot(currentSession),
        afterSessionState: dependencies.buildGeometrySketchSessionSnapshot(nextSessionState),
      })
      return {
        geometrySketchSession: dependencies.buildGeometrySketchSessionWithHistory({
          session: nextSessionState,
          undoCommands: [...currentSession.sessionUndoCommands, historyEntry],
          redoCommands: [],
          cloneNodeParams: dependencies.cloneNodeParams,
        }),
      }
    })
    if (nextPromptRef.current !== null) {
      dependencies.appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },

  setGeometrySketchDrawHoverPoint: (point, snapTarget) => {
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (session === null || session.mode !== 'draw' || session.drawDraft === null) {
        return state
      }
      const normalizedPoint =
        point === null ? null : dependencies.normalizeGeometrySketchDraftPoint(point)
      const nextSnapTarget = normalizedPoint === null ? null : snapTarget
      if (
        dependencies.areGeometrySketchDraftPointsEqual(
          session.drawDraft.hoverPoint,
          normalizedPoint,
        ) &&
        session.drawDraft.hoverSnapTarget === nextSnapTarget
      ) {
        return state
      }
      return {
        geometrySketchSession: {
          ...session,
          drawStage: dependencies.resolveGeometrySketchDrawStage(
            session.mode,
            session.activeTool,
            {
              ...session.drawDraft,
              hoverPoint: normalizedPoint,
              hoverSnapTarget: nextSnapTarget,
            },
          ),
          drawDraft: {
            ...session.drawDraft,
            hoverPoint: normalizedPoint,
            hoverSnapTarget: nextSnapTarget,
          },
        },
      }
    })
  },
})
