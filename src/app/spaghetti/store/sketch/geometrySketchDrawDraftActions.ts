import type { StoreApi } from 'zustand'
import type { SketchComponent, SketchFeature } from '../../features/featureTypes'
import type { EditorViewport, SpaghettiGraph, SpaghettiNode } from '../../schema/spaghettiTypes'
import type {
  GeometrySketchDrawDraft,
  GeometrySketchDraftPoint,
  GeometrySketchSession,
  GeometrySketchTool,
  SpaghettiStoreState,
} from '../useSpaghettiStore'

type GeometrySketchDrawDraftActions = Pick<
  SpaghettiStoreState,
  | 'undoGeometrySketchDrawDraftPoint'
  | 'undoGeometrySketchStagedCommand'
  | 'redoGeometrySketchStagedCommand'
  | 'confirmGeometrySketchDrawPoint'
  | 'finishGeometrySketchDrawDraft'
  | 'cancelGeometrySketchDrawDraft'
>

type GeometrySketchConsolePrompt = {
  tool: GeometrySketchTool | null
  draft: GeometrySketchDrawDraft | null
  lastUsedTool: GeometrySketchTool | null
}

type GeometrySketchHistoryCommand = GeometrySketchSession['sessionUndoCommands'][number]

type GeometrySketchDrawDraftActionDependencies = {
  set: StoreApi<SpaghettiStoreState>['setState']
  get: StoreApi<SpaghettiStoreState>['getState']
  appendGeometrySketchConsolePrompt: (
    tool: GeometrySketchTool | null,
    draft: GeometrySketchDrawDraft | null,
    lastUsedTool: GeometrySketchTool | null,
  ) => void
  isGeometrySketchDrawTool: (
    tool: GeometrySketchTool | null,
  ) => tool is Extract<GeometrySketchTool, 'line' | 'pline' | 'rectangle' | 'circle'>
  normalizeGeometrySketchDraftPoint: (
    point: GeometrySketchDraftPoint,
  ) => GeometrySketchDraftPoint
  areGeometrySketchDraftPointsEqual: (
    left: GeometrySketchDraftPoint | null,
    right: GeometrySketchDraftPoint | null,
  ) => boolean
  resolveGeometrySketchDrawStage: (
    mode: GeometrySketchSession['mode'],
    tool: GeometrySketchTool | null,
    draft: GeometrySketchDrawDraft | null,
  ) => GeometrySketchSession['drawStage']
  updateGeometrySketchNode: (
    graph: SpaghettiGraph,
    nodeId: string,
    updateFn: (feature: SketchFeature) => SketchFeature,
  ) => SpaghettiGraph
  recomputeSketchFeature: (feature: SketchFeature) => SketchFeature
  buildGeometrySketchLineComponent: (
    start: GeometrySketchDraftPoint,
    end: GeometrySketchDraftPoint,
    options?: { drawGroupId?: string },
  ) => SketchComponent
  buildGeometrySketchRectangleComponent: (
    start: GeometrySketchDraftPoint,
    end: GeometrySketchDraftPoint,
  ) => SketchComponent
  buildGeometrySketchCircleComponent: (
    center: GeometrySketchDraftPoint,
    edge: GeometrySketchDraftPoint,
  ) => SketchComponent
  makeComponentId: () => string
  getGeometrySketchDrawHistoryLabel: (
    tool: Extract<GeometrySketchTool, 'line' | 'pline' | 'rectangle' | 'circle'>,
  ) => string
  buildGeometrySketchSessionSnapshot: (
    session: GeometrySketchSession,
  ) => GeometrySketchHistoryCommand['beforeSessionState']
  buildGeometrySketchCommittedSessionSnapshot: (
    session: GeometrySketchSession,
  ) => GeometrySketchHistoryCommand['afterSessionState']
  buildGeometrySketchSessionWithHistory: (input: {
    session: GeometrySketchSession
    undoCommands: GeometrySketchSession['sessionUndoCommands']
    redoCommands: GeometrySketchSession['sessionRedoCommands']
    cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params']
  }) => GeometrySketchSession
  applyGeometrySketchSessionSnapshot: (
    session: GeometrySketchSession,
    snapshot: GeometrySketchHistoryCommand['beforeSessionState'],
  ) => GeometrySketchSession
  cloneGeometrySketchSessionSnapshot: (
    snapshot: GeometrySketchHistoryCommand['beforeSessionState'],
  ) => GeometrySketchHistoryCommand['beforeSessionState']
  buildGeometrySketchStagedCommand: (input: {
    nodeId: string
    beforeGraph: SpaghettiGraph
    afterGraph: SpaghettiGraph
    label: string
    beforeSessionState: GeometrySketchHistoryCommand['beforeSessionState']
    afterSessionState: GeometrySketchHistoryCommand['afterSessionState']
  }) => GeometrySketchHistoryCommand | null
  findPreferredGeometrySketchHistoryCommandIndex: (
    commands: GeometrySketchHistoryCommand[],
    preferMostRecent: boolean,
  ) => number
  cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params']
  replaceGraphNodeParams: (
    graph: SpaghettiGraph,
    nodeId: string,
    params: SpaghettiNode['params'],
  ) => SpaghettiGraph
  withUpdatedActiveGraphDocumentState: (
    state: SpaghettiStoreState,
    nextGraph: SpaghettiGraph,
  ) => Partial<SpaghettiStoreState>
  pruneGeometrySketchSession: (
    graph: SpaghettiGraph,
    session: GeometrySketchSession | null,
  ) => GeometrySketchSession | null
  getGeometrySketchLocalHistoryTargetId: (
    graphDocumentId: string,
    nodeId: string,
  ) => string
  withGeometrySketchLocalHistoryState: (
    state: SpaghettiStoreState['geometrySketchLocalHistoryByTargetId'],
    targetId: string,
    history: NonNullable<GeometrySketchSession['stagedBaselineHistory']>,
    cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params'],
  ) => SpaghettiStoreState['geometrySketchLocalHistoryByTargetId']
  selectEditorViewportById: (
    state: Pick<SpaghettiStoreState, 'editorViewportsById'>,
    editorViewportId: string,
  ) => EditorViewport | null
}

const updatePrompt = (
  dependencies: GeometrySketchDrawDraftActionDependencies,
  prompt: GeometrySketchConsolePrompt | null,
) => {
  if (prompt === null) {
    return
  }
  dependencies.appendGeometrySketchConsolePrompt(
    prompt.tool,
    prompt.draft,
    prompt.lastUsedTool,
  )
}

const commitGeometrySketchDrawGraphChange = (
  dependencies: GeometrySketchDrawDraftActionDependencies,
  input: {
    state: SpaghettiStoreState
    session: GeometrySketchSession
    nextGraph: SpaghettiGraph
    stagedCommand: GeometrySketchHistoryCommand
  },
) => ({
  ...dependencies.withUpdatedActiveGraphDocumentState(input.state, input.nextGraph),
  geometrySketchSession: dependencies.buildGeometrySketchSessionWithHistory({
    session: dependencies.applyGeometrySketchSessionSnapshot(
      input.session,
      dependencies.buildGeometrySketchCommittedSessionSnapshot(input.session),
    ),
    undoCommands: [...input.session.sessionUndoCommands, input.stagedCommand],
    redoCommands: [],
    cloneNodeParams: dependencies.cloneNodeParams,
  }),
})

export const createGeometrySketchDrawDraftActions = (
  dependencies: GeometrySketchDrawDraftActionDependencies,
): GeometrySketchDrawDraftActions => ({
  undoGeometrySketchDrawDraftPoint: () => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.drawDraft === null ||
        !dependencies.isGeometrySketchDrawTool(session.activeTool) ||
        session.drawDraft.points.length === 0
      ) {
        return state
      }

      const nextDraft = {
        ...session.drawDraft,
        points: session.drawDraft.points.slice(0, -1),
      }
      nextPromptRef.current = {
        tool: session.activeTool,
        draft: nextDraft,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        geometrySketchSession: {
          ...session,
          drawStage: dependencies.resolveGeometrySketchDrawStage(
            session.mode,
            session.activeTool,
            nextDraft,
          ),
          drawDraft: nextDraft,
        },
      }
    })
    updatePrompt(dependencies, nextPromptRef.current)
  },

  undoGeometrySketchStagedCommand: () => {
    let didUndo = false
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.sessionUndoCommands.length === 0
      ) {
        return state
      }
      const commandIndex = dependencies.findPreferredGeometrySketchHistoryCommandIndex(
        session.sessionUndoCommands,
        session.stagedUndoCommands.length > 1 ||
          (session.stagedUndoCommands.length === 1 &&
            (session.activeTool === null ||
              session.activeTool === session.stagedUndoCommands[0]?.beforeSessionState.activeTool)),
      )
      const command = session.sessionUndoCommands[commandIndex]
      const nextUndoCommands = session.sessionUndoCommands.filter(
        (_candidate, index) => index !== commandIndex,
      )
      const nextRedoCommands = [...session.sessionRedoCommands, command]
      const nextSessionBase = dependencies.buildGeometrySketchSessionWithHistory({
        session: dependencies.applyGeometrySketchSessionSnapshot(
          session,
          dependencies.cloneGeometrySketchSessionSnapshot(command.beforeSessionState),
        ),
        undoCommands: nextUndoCommands,
        redoCommands: nextRedoCommands,
        cloneNodeParams: dependencies.cloneNodeParams,
      })
      didUndo = true
      if (command.kind === 'geometry') {
        const nextGraph = dependencies.replaceGraphNodeParams(
          state.graph,
          command.nodeId,
          command.beforeParams,
        )
        return {
          ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
          geometrySketchSession: dependencies.pruneGeometrySketchSession(
            nextGraph,
            nextSessionBase,
          ),
        }
      }
      return {
        geometrySketchSession: nextSessionBase,
      }
    })
    return didUndo
  },

  redoGeometrySketchStagedCommand: () => {
    let didRedo = false
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.sessionRedoCommands.length === 0
      ) {
        return state
      }
      const commandIndex = dependencies.findPreferredGeometrySketchHistoryCommandIndex(
        session.sessionRedoCommands,
        session.stagedRedoCommands.length > 0,
      )
      const command = session.sessionRedoCommands[commandIndex]
      const nextUndoCommands = [...session.sessionUndoCommands, command]
      const nextRedoCommands = session.sessionRedoCommands.filter(
        (_candidate, index) => index !== commandIndex,
      )
      const nextSessionBase = dependencies.buildGeometrySketchSessionWithHistory({
        session: dependencies.applyGeometrySketchSessionSnapshot(
          session,
          dependencies.cloneGeometrySketchSessionSnapshot(command.afterSessionState),
        ),
        undoCommands: nextUndoCommands,
        redoCommands: nextRedoCommands,
        cloneNodeParams: dependencies.cloneNodeParams,
      })
      didRedo = true
      if (command.kind === 'geometry') {
        const nextGraph = dependencies.replaceGraphNodeParams(
          state.graph,
          command.nodeId,
          command.afterParams,
        )
        return {
          ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
          geometrySketchSession: dependencies.pruneGeometrySketchSession(
            nextGraph,
            nextSessionBase,
          ),
        }
      }
      return {
        geometrySketchSession: nextSessionBase,
      }
    })
    return didRedo
  },

  confirmGeometrySketchDrawPoint: (point, snapTarget) => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.drawDraft === null ||
        !dependencies.isGeometrySketchDrawTool(session.activeTool)
      ) {
        return state
      }

      const nextPoint = dependencies.normalizeGeometrySketchDraftPoint(point)
      if (
        session.activeTool === 'line' ||
        session.activeTool === 'rectangle' ||
        session.activeTool === 'circle'
      ) {
        const beforeSessionState = dependencies.buildGeometrySketchSessionSnapshot(session)
        const startPoint = session.drawDraft.points[0] ?? null
        if (startPoint === null) {
          const nextDraft = {
            points: [nextPoint],
            hoverPoint: session.activeTool === 'circle' ? null : nextPoint,
            hoverSnapTarget: session.activeTool === 'circle' ? null : snapTarget,
          }
          nextPromptRef.current = {
            tool: session.activeTool,
            draft: nextDraft,
            lastUsedTool: session.lastUsedTool,
          }
          return {
            geometrySketchSession: {
              ...session,
              drawStage: dependencies.resolveGeometrySketchDrawStage(
                session.mode,
                session.activeTool,
                nextDraft,
              ),
              drawDraft: nextDraft,
            },
          }
        }
        if (dependencies.areGeometrySketchDraftPointsEqual(startPoint, nextPoint)) {
          return state
        }
        const nextGraph = dependencies.updateGeometrySketchNode(
          state.graph,
          session.nodeId,
          (feature) =>
            dependencies.recomputeSketchFeature({
              ...feature,
              components: [
                ...feature.components,
                session.activeTool === 'line'
                  ? dependencies.buildGeometrySketchLineComponent(startPoint, nextPoint)
                  : session.activeTool === 'circle'
                    ? dependencies.buildGeometrySketchCircleComponent(startPoint, nextPoint)
                    : dependencies.buildGeometrySketchRectangleComponent(startPoint, nextPoint),
              ],
            }),
        )
        if (nextGraph === state.graph) {
          return state
        }
        const stagedCommand = dependencies.buildGeometrySketchStagedCommand({
          nodeId: session.nodeId,
          beforeGraph: state.graph,
          afterGraph: nextGraph,
          label: dependencies.getGeometrySketchDrawHistoryLabel(session.activeTool),
          beforeSessionState,
          afterSessionState: dependencies.buildGeometrySketchCommittedSessionSnapshot(session),
        })
        if (stagedCommand === null) {
          return state
        }
        nextPromptRef.current = {
          tool: null,
          draft: null,
          lastUsedTool: session.lastUsedTool,
        }
        return commitGeometrySketchDrawGraphChange(dependencies, {
          state,
          session,
          nextGraph,
          stagedCommand,
        })
      }

      const previousPoint = session.drawDraft.points[session.drawDraft.points.length - 1] ?? null
      if (
        previousPoint !== null &&
        dependencies.areGeometrySketchDraftPointsEqual(previousPoint, nextPoint)
      ) {
        return state
      }
      const nextDraft = {
        points: [...session.drawDraft.points, nextPoint],
        hoverPoint: nextPoint,
        hoverSnapTarget: snapTarget,
      }
      nextPromptRef.current = {
        tool: session.activeTool,
        draft: nextDraft,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        geometrySketchSession: {
          ...session,
          drawStage: dependencies.resolveGeometrySketchDrawStage(
            session.mode,
            session.activeTool,
            nextDraft,
          ),
          drawDraft: nextDraft,
        },
      }
    })
    updatePrompt(dependencies, nextPromptRef.current)
  },

  finishGeometrySketchDrawDraft: () => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.drawDraft === null ||
        !dependencies.isGeometrySketchDrawTool(session.activeTool)
      ) {
        return state
      }

      if (
        session.activeTool === 'line' ||
        session.activeTool === 'rectangle' ||
        session.activeTool === 'circle'
      ) {
        const startPoint = session.drawDraft.points[0] ?? null
        const hoverPoint = session.drawDraft.hoverPoint
        if (
          startPoint === null ||
          hoverPoint === null ||
          dependencies.areGeometrySketchDraftPointsEqual(startPoint, hoverPoint)
        ) {
          return state
        }
        const nextGraph = dependencies.updateGeometrySketchNode(
          state.graph,
          session.nodeId,
          (feature) =>
            dependencies.recomputeSketchFeature({
              ...feature,
              components: [
                ...feature.components,
                session.activeTool === 'line'
                  ? dependencies.buildGeometrySketchLineComponent(startPoint, hoverPoint)
                  : session.activeTool === 'circle'
                    ? dependencies.buildGeometrySketchCircleComponent(startPoint, hoverPoint)
                    : dependencies.buildGeometrySketchRectangleComponent(startPoint, hoverPoint),
              ],
            }),
        )
        if (nextGraph === state.graph) {
          return state
        }
        const stagedCommand = dependencies.buildGeometrySketchStagedCommand({
          nodeId: session.nodeId,
          beforeGraph: state.graph,
          afterGraph: nextGraph,
          label: dependencies.getGeometrySketchDrawHistoryLabel(session.activeTool),
          beforeSessionState: dependencies.buildGeometrySketchSessionSnapshot(session),
          afterSessionState: dependencies.buildGeometrySketchCommittedSessionSnapshot(session),
        })
        if (stagedCommand === null) {
          return state
        }
        nextPromptRef.current = {
          tool: null,
          draft: null,
          lastUsedTool: session.lastUsedTool,
        }
        return commitGeometrySketchDrawGraphChange(dependencies, {
          state,
          session,
          nextGraph,
          stagedCommand,
        })
      }

      if (session.drawDraft.points.length < 2) {
        return state
      }

      const drawGroupId = `pline:${dependencies.makeComponentId()}`
      const nextComponents = session.drawDraft.points
        .slice(1)
        .map((point, index) =>
          dependencies.buildGeometrySketchLineComponent(session.drawDraft!.points[index], point, {
            drawGroupId,
          }),
        )
      const nextGraph = dependencies.updateGeometrySketchNode(
        state.graph,
        session.nodeId,
        (feature) =>
          dependencies.recomputeSketchFeature({
            ...feature,
            components: [...feature.components, ...nextComponents],
          }),
      )
      if (nextGraph === state.graph) {
        return state
      }
      const stagedCommand = dependencies.buildGeometrySketchStagedCommand({
        nodeId: session.nodeId,
        beforeGraph: state.graph,
        afterGraph: nextGraph,
        label: 'Draw sketch polyline',
        beforeSessionState: dependencies.buildGeometrySketchSessionSnapshot(session),
        afterSessionState: dependencies.buildGeometrySketchCommittedSessionSnapshot(session),
      })
      if (stagedCommand === null) {
        return state
      }
      nextPromptRef.current = {
        tool: null,
        draft: null,
        lastUsedTool: session.lastUsedTool,
      }
      return commitGeometrySketchDrawGraphChange(dependencies, {
        state,
        session,
        nextGraph,
        stagedCommand,
      })
    })
    updatePrompt(dependencies, nextPromptRef.current)
  },

  cancelGeometrySketchDrawDraft: () => {
    const currentSession = dependencies.get().geometrySketchSession
    if (currentSession === null || currentSession.mode !== 'draw') {
      return
    }
    if (currentSession.activeTool === null) {
      const hasStagedCommands =
        currentSession.stagedUndoCommands.length > 0 ||
        currentSession.stagedRedoCommands.length > 0
      if (
        !hasStagedCommands ||
        currentSession.stagedBaselineParams === null ||
        currentSession.stagedBaselineHistory === null
      ) {
        return
      }
      dependencies.set((state) => {
        const session = state.geometrySketchSession
        if (session === null || session.nodeId !== currentSession.nodeId) {
          return state
        }
        const nextGraph = dependencies.replaceGraphNodeParams(
          state.graph,
          session.nodeId,
          currentSession.stagedBaselineParams!,
        )
        const localHistoryTargetId = dependencies.getGeometrySketchLocalHistoryTargetId(
          state.activeGraphDocumentId,
          session.nodeId,
        )
        return {
          ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
          geometrySketchSession: null,
          geometrySketchLocalHistoryByTargetId: dependencies.withGeometrySketchLocalHistoryState(
            state.geometrySketchLocalHistoryByTargetId,
            localHistoryTargetId,
            currentSession.stagedBaselineHistory!,
            dependencies.cloneNodeParams,
          ),
        }
      })
      if (
        currentSession.shouldRestoreViewportWindowMode &&
        currentSession.editorViewportId !== null &&
        dependencies.selectEditorViewportById(
          dependencies.get(),
          currentSession.editorViewportId,
        )?.windowMode === 'collapsed'
      ) {
        dependencies.get().setEditorViewportWindowMode(currentSession.editorViewportId, 'collapsed')
      }
      return
    }
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (session === null) {
        return state
      }
      nextPromptRef.current = {
        tool: null,
        draft: null,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        geometrySketchSession: {
          ...session,
          activeTool: null,
          drawStage: dependencies.resolveGeometrySketchDrawStage(session.mode, null, null),
          drawDraft: null,
          hoveredComponentId: null,
          selectionWindowDraft: null,
        },
      }
    })
    updatePrompt(dependencies, nextPromptRef.current)
  },
})
