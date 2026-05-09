import type { StoreApi } from 'zustand'
import type { EditHistoryEntryChildRestorePoint } from '../../../store/editHistoryStore'
import type { EditorViewport, SpaghettiGraph, SpaghettiNode } from '../../schema/spaghettiTypes'
import type {
  GeometrySketchDrawDraft,
  GeometrySketchSession,
  GeometrySketchTool,
  SpaghettiStoreState,
} from '../useSpaghettiStore'
import type { CommitGeometrySketchFeatureHistoryOptions } from '../history/geometrySketchHistoryCommitAdapter'

type GeometrySketchSessionLifecycleActions = Pick<
  SpaghettiStoreState,
  | 'startGeometrySketchSession'
  | 'closeGeometrySketchSession'
  | 'openGeometrySketchHistoryScrub'
  | 'clearGeometrySketchHistoryScrub'
  | 'returnActiveSketchSessionOneLevel'
>

type AppendConsoleEntryInput = {
  layer: 'App' | 'Commands' | 'Transforms'
  text: string
  source?: string
  severity?: 'error' | 'info'
  commandLineKind?: 'user'
}

type GeometrySketchSessionLifecycleDependencies = {
  set: StoreApi<SpaghettiStoreState>['setState']
  get: StoreApi<SpaghettiStoreState>['getState']
  appendConsoleEntry: (entry: AppendConsoleEntryInput) => void
  appendGeometrySketchConsolePrompt: (
    tool: GeometrySketchTool | null,
    draft: GeometrySketchDrawDraft | null,
    lastUsedTool: GeometrySketchTool | null,
  ) => void
  buildGeometrySketchSessionDraft: (
    mode: GeometrySketchSession['mode'],
    tool: GeometrySketchTool | null,
  ) => GeometrySketchDrawDraft | null
  resolveGeometrySketchDrawStage: (
    mode: GeometrySketchSession['mode'],
    tool: GeometrySketchTool | null,
    draft: GeometrySketchDrawDraft | null,
  ) => GeometrySketchSession['drawStage']
  readGeometrySketchNodeParams: (
    graph: SpaghettiGraph,
    nodeId: string,
  ) => SpaghettiNode['params'] | null
  getGeometrySketchLocalHistoryTargetId: (
    graphDocumentId: string,
    nodeId: string,
  ) => string
  cloneGeometrySketchLocalHistoryState: (
    history: SpaghettiStoreState['geometrySketchLocalHistoryByTargetId'][string] | null | undefined,
    cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params'],
  ) => NonNullable<GeometrySketchSession['stagedBaselineHistory']>
  buildGeometrySketchSessionWithHistory: (input: {
    session: GeometrySketchSession
    undoCommands: GeometrySketchSession['sessionUndoCommands']
    redoCommands: GeometrySketchSession['sessionRedoCommands']
    cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params']
  }) => GeometrySketchSession
  cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params']
  selectActiveEditorViewport: (
    state: Pick<SpaghettiStoreState, 'editorViewportsById' | 'activeEditorViewportId'>,
  ) => EditorViewport | null
  snapshotCollapsedRestoreState: (viewport: EditorViewport) => EditorViewport['restoreFromCollapsed']
  syncCollapsedViewportToWorkspace: (viewport: EditorViewport) => void
  replaceGraphNodeParams: (
    graph: SpaghettiGraph,
    nodeId: string,
    params: SpaghettiNode['params'],
  ) => SpaghettiGraph
  areNodeParamsEqual: (
    left: SpaghettiNode['params'],
    right: SpaghettiNode['params'],
  ) => boolean
  buildGeometrySketchLocalHistoryState: (
    undoCommands: GeometrySketchSession['sessionUndoCommands'],
    redoCommands: GeometrySketchSession['sessionRedoCommands'],
    cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params'],
  ) => NonNullable<GeometrySketchSession['stagedBaselineHistory']>
  withGeometrySketchLocalHistoryState: (
    state: SpaghettiStoreState['geometrySketchLocalHistoryByTargetId'],
    targetId: string,
    history: NonNullable<GeometrySketchSession['stagedBaselineHistory']>,
    cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params'],
  ) => SpaghettiStoreState['geometrySketchLocalHistoryByTargetId']
  commitGeometrySketchFeatureHistoryCommand: (
    input: CommitGeometrySketchFeatureHistoryOptions,
  ) => boolean
  createGeometrySketchChildSummaries: (
    commands: GeometrySketchSession['sessionUndoCommands'],
  ) => Array<{
    childId: string
    label: string
    kind: GeometrySketchSession['sessionUndoCommands'][number]['kind']
    sequence: number
  }>
  createGeometrySketchChildRestorePoints: (input: {
    graphDocumentId: string
    nodeId: string
    baselineParams: SpaghettiNode['params']
    commands: GeometrySketchSession['sessionUndoCommands']
  }) => EditHistoryEntryChildRestorePoint[]
  selectEditorViewportById: (
    state: Pick<SpaghettiStoreState, 'editorViewportsById'>,
    editorViewportId: string,
  ) => EditorViewport | null
  setEditorViewportWindowMode: (
    editorViewportId: string,
    windowMode: EditorViewport['windowMode'],
  ) => void
  isGeometrySketchNode: (value: SpaghettiNode) => boolean
  cloneSketchPlaneTransform: (
    transform: NonNullable<SpaghettiStoreState['sketchPlanePickSession']>['draftTransform'],
  ) => NonNullable<SpaghettiStoreState['sketchPlanePickSession']>['draftTransform']
  buildSketchPlaneMovePrompt: (translation: { x: number; y: number; z: number }) => string
  buildSketchPlaneRotatePrompt: (rotationDeg: { x: number; y: number; z: number }) => string
  sketchPlaneRootPrompt: string
  reopenSketchPlanePickPlaneSelection: () => void
  cancelSketchPlanePick: () => void
  cancelGeometrySketchDrawDraft: () => void
}

type GeometrySketchConsolePrompt = {
  tool: GeometrySketchTool | null
  draft: GeometrySketchDrawDraft | null
  lastUsedTool: GeometrySketchTool | null
}

export const createGeometrySketchSessionLifecycleActions = (
  dependencies: GeometrySketchSessionLifecycleDependencies,
): GeometrySketchSessionLifecycleActions => ({
  startGeometrySketchSession: (nodeId, mode) => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    let collapsedViewportForWorkspace: EditorViewport | null = null
    dependencies.set((state) => {
      const node = state.graph.nodes.find((candidate) => candidate.nodeId === nodeId)
      if (node === undefined || !dependencies.isGeometrySketchNode(node)) {
        return state
      }
      const current = state.geometrySketchSession
      if (current !== null && current.nodeId === nodeId && current.mode === mode) {
        return state
      }
      const shouldCollapseViewport = mode === 'draw'
      const activeViewport = shouldCollapseViewport
        ? dependencies.selectActiveEditorViewport(state)
        : null
      const shouldRestoreViewportWindowMode =
        shouldCollapseViewport &&
        activeViewport !== null &&
        activeViewport.windowMode !== 'collapsed' &&
        activeViewport.windowMode !== 'separateWindow'
      const editorViewportId = shouldCollapseViewport
        ? (current?.editorViewportId ?? activeViewport?.editorViewportId ?? null)
        : null
      const nextEditorViewportsById: typeof state.editorViewportsById =
        shouldRestoreViewportWindowMode && activeViewport !== null
          ? (() => {
              const collapsedViewport: EditorViewport = {
                ...activeViewport,
                windowMode: 'collapsed',
                restoreFromCollapsed: dependencies.snapshotCollapsedRestoreState(
                  activeViewport,
                ),
              }
              collapsedViewportForWorkspace = collapsedViewport
              return {
                ...state.editorViewportsById,
                [activeViewport.editorViewportId]: collapsedViewport,
              }
            })()
          : state.editorViewportsById
      const activeTool =
        mode === 'draw' && current?.nodeId === nodeId && current.mode === 'draw'
          ? current.activeTool
          : null
      const lastUsedTool = current?.nodeId === nodeId ? current.lastUsedTool : null
      const drawDraft = dependencies.buildGeometrySketchSessionDraft(mode, activeTool)
      const stagedBaselineParams =
        mode === 'draw' ? dependencies.readGeometrySketchNodeParams(state.graph, nodeId) : null
      const localHistoryTargetId = dependencies.getGeometrySketchLocalHistoryTargetId(
        state.activeGraphDocumentId,
        nodeId,
      )
      const stagedBaselineHistory =
        mode === 'draw'
          ? dependencies.cloneGeometrySketchLocalHistoryState(
              state.geometrySketchLocalHistoryByTargetId[localHistoryTargetId],
              dependencies.cloneNodeParams,
            )
          : null
      if (mode === 'draw') {
        nextPromptRef.current = {
          tool: activeTool,
          draft: drawDraft,
          lastUsedTool,
        }
      }
      const nextSession: GeometrySketchSession = {
        nodeId,
        mode,
        activeTool,
        lastUsedTool,
        drawStage: dependencies.resolveGeometrySketchDrawStage(mode, activeTool, drawDraft),
        editorViewportId,
        shouldRestoreViewportWindowMode:
          current?.nodeId === nodeId
            ? current.shouldRestoreViewportWindowMode || shouldRestoreViewportWindowMode
            : shouldRestoreViewportWindowMode,
        drawDraft,
        selectedComponentIds: [],
        hoveredComponentId: null,
        selectionWindowDraft: null,
        stagedBaselineParams,
        stagedBaselineHistory,
        stagedUndoCommands: [],
        stagedRedoCommands: [],
        sessionUndoCommands: [],
        sessionRedoCommands: [],
      }
      return {
        ...(nextEditorViewportsById === state.editorViewportsById
          ? {}
          : { editorViewportsById: nextEditorViewportsById }),
        geometrySketchSession:
          stagedBaselineHistory === null
            ? nextSession
            : dependencies.buildGeometrySketchSessionWithHistory({
                session: nextSession,
                undoCommands: stagedBaselineHistory.undoCommands,
                redoCommands: stagedBaselineHistory.redoCommands,
                cloneNodeParams: dependencies.cloneNodeParams,
              }),
        geometrySketchHistoryScrub: null,
        sketchPlanePickSession: null,
      }
    })
    if (collapsedViewportForWorkspace !== null) {
      dependencies.syncCollapsedViewportToWorkspace(collapsedViewportForWorkspace)
    }
    if (nextPromptRef.current !== null) {
      dependencies.appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },

  closeGeometrySketchSession: () => {
    const session = dependencies.get().geometrySketchSession
    if (
      session?.mode === 'draw' &&
      session.stagedBaselineParams !== null &&
      session.stagedBaselineHistory !== null
    ) {
      const afterParams = dependencies.readGeometrySketchNodeParams(
        dependencies.get().graph,
        session.nodeId,
      )
      const beforeGraph = dependencies.replaceGraphNodeParams(
        dependencies.get().graph,
        session.nodeId,
        session.stagedBaselineParams,
      )
      const hasAcceptedParamChange =
        afterParams !== null &&
        !dependencies.areNodeParamsEqual(session.stagedBaselineParams, afterParams)
      const localHistoryTargetId = dependencies.getGeometrySketchLocalHistoryTargetId(
        dependencies.get().activeGraphDocumentId,
        session.nodeId,
      )
      const acceptedLocalHistory = hasAcceptedParamChange
        ? dependencies.buildGeometrySketchLocalHistoryState(
            session.sessionUndoCommands,
            [],
            dependencies.cloneNodeParams,
          )
        : dependencies.cloneGeometrySketchLocalHistoryState(
            session.stagedBaselineHistory,
            dependencies.cloneNodeParams,
          )
      dependencies.set((state) => ({
        geometrySketchLocalHistoryByTargetId: dependencies.withGeometrySketchLocalHistoryState(
          state.geometrySketchLocalHistoryByTargetId,
          localHistoryTargetId,
          acceptedLocalHistory,
          dependencies.cloneNodeParams,
        ),
      }))
      if (hasAcceptedParamChange) {
        const activeGraphDocumentId = dependencies.get().activeGraphDocumentId
        dependencies.commitGeometrySketchFeatureHistoryCommand({
          nodeId: session.nodeId,
          beforeGraph,
          afterGraph: dependencies.get().graph,
          beforeLocalHistory: session.stagedBaselineHistory,
          afterLocalHistory: acceptedLocalHistory,
          label: 'Commit sketch draw changes',
          targetId: `${session.nodeId}:sketch:components`,
          targetLabel: 'Sketch Draw changes',
          childSummaries: dependencies.createGeometrySketchChildSummaries(
            session.sessionUndoCommands,
          ),
          childRestorePoints: dependencies.createGeometrySketchChildRestorePoints({
            graphDocumentId: activeGraphDocumentId,
            nodeId: session.nodeId,
            baselineParams: session.stagedBaselineParams,
            commands: session.sessionUndoCommands,
          }),
        })
      }
    }
    dependencies.set({ geometrySketchSession: null })
    if (
      session?.shouldRestoreViewportWindowMode === true &&
      session.editorViewportId !== null &&
      dependencies.selectEditorViewportById(
        dependencies.get(),
        session.editorViewportId,
      )?.windowMode === 'collapsed'
    ) {
      dependencies.setEditorViewportWindowMode(session.editorViewportId, 'collapsed')
    }
  },

  openGeometrySketchHistoryScrub: (input) => {
    let didOpen = false
    dependencies.set((state) => {
      if (state.activeGraphDocumentId !== input.graphDocumentId) {
        return state
      }
      const node = state.graph.nodes.find((candidate) => candidate.nodeId === input.nodeId)
      if (node === undefined || !dependencies.isGeometrySketchNode(node)) {
        return state
      }
      didOpen = true
      return {
        geometrySketchHistoryScrub: { ...input },
        geometrySketchSession: null,
        sketchPlanePickSession: null,
      }
    })
    return didOpen
  },

  clearGeometrySketchHistoryScrub: () => {
    dependencies.set((state) =>
      state.geometrySketchHistoryScrub === null
        ? state
        : {
            geometrySketchHistoryScrub: null,
          },
    )
  },

  returnActiveSketchSessionOneLevel: () => {
    const state = dependencies.get()
    if (state.sketchPlanePickSession !== null) {
      if (state.sketchPlanePickSession.adjustScope === 'move-axis') {
        const revertedTransform =
          state.sketchPlanePickSession.transformCommandOrigin === null
            ? state.sketchPlanePickSession.draftTransform
            : dependencies.cloneSketchPlaneTransform(
                state.sketchPlanePickSession.transformCommandOrigin,
              )
        dependencies.set({
          sketchPlanePickSession: {
            ...state.sketchPlanePickSession,
            adjustScope: 'move',
            activeTransformAxis: 'free',
            transformCommandOrigin: dependencies.cloneSketchPlaneTransform(
              revertedTransform,
            ),
            draftTransform: revertedTransform,
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        dependencies.appendConsoleEntry({
          layer: 'Commands',
          text: dependencies.buildSketchPlaneMovePrompt(revertedTransform.translation),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      if (state.sketchPlanePickSession.adjustScope === 'move-snap') {
        dependencies.set({
          sketchPlanePickSession: {
            ...state.sketchPlanePickSession,
            adjustScope: 'move',
            activeTransformAxis: 'free',
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        dependencies.appendConsoleEntry({
          layer: 'Commands',
          text: dependencies.buildSketchPlaneMovePrompt(
            state.sketchPlanePickSession.draftTransform.translation,
          ),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      if (state.sketchPlanePickSession.adjustScope === 'rotate-snap') {
        dependencies.set({
          sketchPlanePickSession: {
            ...state.sketchPlanePickSession,
            adjustScope: 'rotate',
            activeTransformAxis: 'free',
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        dependencies.appendConsoleEntry({
          layer: 'Commands',
          text: dependencies.buildSketchPlaneRotatePrompt(
            state.sketchPlanePickSession.draftTransform.rotationDeg,
          ),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      if (
        state.sketchPlanePickSession.stage === 'adjust' &&
        state.sketchPlanePickSession.adjustScope !== 'root'
      ) {
        const revertedTransform =
          state.sketchPlanePickSession.transformCommandOrigin === null
            ? state.sketchPlanePickSession.draftTransform
            : dependencies.cloneSketchPlaneTransform(
                state.sketchPlanePickSession.transformCommandOrigin,
              )
        dependencies.set({
          sketchPlanePickSession: {
            ...state.sketchPlanePickSession,
            adjustScope: 'root',
            activeTransformAxis: null,
            transformCommandOrigin: null,
            draftTransform: revertedTransform,
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        dependencies.appendConsoleEntry({
          layer: 'Commands',
          text: dependencies.sketchPlaneRootPrompt,
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      if (state.sketchPlanePickSession.stage === 'adjust') {
        dependencies.reopenSketchPlanePickPlaneSelection()
        return
      }
      dependencies.cancelSketchPlanePick()
      return
    }
    if (state.geometrySketchSession?.mode === 'draw') {
      dependencies.cancelGeometrySketchDrawDraft()
    }
  },
})
