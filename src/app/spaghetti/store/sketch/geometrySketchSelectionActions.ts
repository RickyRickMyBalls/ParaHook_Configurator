import type { StoreApi } from 'zustand'
import type { SketchFeature } from '../../features/featureTypes'
import type { SpaghettiGraph, SpaghettiNode } from '../../schema/spaghettiTypes'
import type { GeometrySketchSession, SpaghettiStoreState } from '../useSpaghettiStore'

type GeometrySketchSelectionActions = Pick<
  SpaghettiStoreState,
  | 'setGeometrySketchHoveredComponent'
  | 'setGeometrySketchSelectedComponents'
  | 'setGeometrySketchSelectionWindowDraft'
  | 'deleteGeometrySketchSelectedComponents'
>

type GeometrySketchHistoryCommand = GeometrySketchSession['sessionUndoCommands'][number]

type GeometrySketchSelectionActionDependencies = {
  set: StoreApi<SpaghettiStoreState>['setState']
  normalizeGeometrySketchSelectionIds: (rowIds: readonly string[]) => string[]
  normalizeGeometrySketchDraftPoint: (
    point: NonNullable<GeometrySketchSession['selectionWindowDraft']>['anchor'],
  ) => NonNullable<GeometrySketchSession['selectionWindowDraft']>['anchor']
  areGeometrySketchDraftPointsEqual: (
    left: NonNullable<GeometrySketchSession['selectionWindowDraft']>['anchor'] | null,
    right: NonNullable<GeometrySketchSession['selectionWindowDraft']>['anchor'] | null,
  ) => boolean
  updateGeometrySketchNode: (
    graph: SpaghettiGraph,
    nodeId: string,
    updateFn: (feature: SketchFeature) => SketchFeature,
  ) => SpaghettiGraph
  recomputeSketchFeature: (feature: SketchFeature) => SketchFeature
  buildGeometrySketchStagedCommand: (input: {
    nodeId: string
    beforeGraph: SpaghettiGraph
    afterGraph: SpaghettiGraph
    label: string
    beforeSessionState: GeometrySketchHistoryCommand['beforeSessionState']
    afterSessionState: GeometrySketchHistoryCommand['afterSessionState']
  }) => GeometrySketchHistoryCommand | null
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
    snapshot: GeometrySketchHistoryCommand['afterSessionState'],
  ) => GeometrySketchSession
  withUpdatedActiveGraphDocumentState: (
    state: SpaghettiStoreState,
    nextGraph: SpaghettiGraph,
  ) => Partial<SpaghettiStoreState>
  cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params']
}

export const createGeometrySketchSelectionActions = (
  dependencies: GeometrySketchSelectionActionDependencies,
): GeometrySketchSelectionActions => ({
  setGeometrySketchHoveredComponent: (rowId) => {
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== null ||
        session.drawStage !== 'sessionIdle' ||
        session.hoveredComponentId === rowId
      ) {
        return state
      }
      return {
        geometrySketchSession: {
          ...session,
          hoveredComponentId: rowId,
        },
      }
    })
  },

  setGeometrySketchSelectedComponents: (rowIds) => {
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== null ||
        session.drawStage !== 'sessionIdle'
      ) {
        return state
      }
      const nextSelectedComponentIds = dependencies.normalizeGeometrySketchSelectionIds(rowIds)
      if (
        nextSelectedComponentIds.length === session.selectedComponentIds.length &&
        nextSelectedComponentIds.every(
          (rowId, index) => rowId === session.selectedComponentIds[index],
        )
      ) {
        return state
      }
      return {
        geometrySketchSession: {
          ...session,
          selectedComponentIds: nextSelectedComponentIds,
          selectionWindowDraft: null,
        },
      }
    })
  },

  setGeometrySketchSelectionWindowDraft: (draft) => {
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== null ||
        session.drawStage !== 'sessionIdle'
      ) {
        return state
      }
      const nextDraft =
        draft === null
          ? null
          : {
              anchor: dependencies.normalizeGeometrySketchDraftPoint(draft.anchor),
              current: dependencies.normalizeGeometrySketchDraftPoint(draft.current),
              mode: draft.mode,
            }
      const currentDraft = session.selectionWindowDraft
      if (
        (currentDraft === null && nextDraft === null) ||
        (currentDraft !== null &&
          nextDraft !== null &&
          currentDraft.mode === nextDraft.mode &&
          dependencies.areGeometrySketchDraftPointsEqual(
            currentDraft.anchor,
            nextDraft.anchor,
          ) &&
          dependencies.areGeometrySketchDraftPointsEqual(
            currentDraft.current,
            nextDraft.current,
          ))
      ) {
        return state
      }
      return {
        geometrySketchSession: {
          ...session,
          selectionWindowDraft: nextDraft,
          hoveredComponentId: nextDraft === null ? session.hoveredComponentId : null,
        },
      }
    })
  },

  deleteGeometrySketchSelectedComponents: () => {
    dependencies.set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== null ||
        session.drawStage !== 'sessionIdle' ||
        session.selectedComponentIds.length === 0
      ) {
        return state
      }
      const selectedIds = new Set(session.selectedComponentIds)
      let deletedCount = 0
      const nextGraph = dependencies.updateGeometrySketchNode(
        state.graph,
        session.nodeId,
        (feature) => {
          const nextComponents = feature.components.filter(
            (component) => !selectedIds.has(component.rowId),
          )
          deletedCount = feature.components.length - nextComponents.length
          if (nextComponents.length === feature.components.length) {
            return feature
          }
          return dependencies.recomputeSketchFeature({
            ...feature,
            components: nextComponents,
          })
        },
      )
      if (nextGraph === state.graph) {
        return state
      }
      const stagedCommand = dependencies.buildGeometrySketchStagedCommand({
        nodeId: session.nodeId,
        beforeGraph: state.graph,
        afterGraph: nextGraph,
        label: deletedCount === 1 ? 'Delete sketch component' : 'Delete sketch components',
        beforeSessionState: dependencies.buildGeometrySketchSessionSnapshot(session),
        afterSessionState: dependencies.buildGeometrySketchCommittedSessionSnapshot(session),
      })
      if (stagedCommand === null) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
        geometrySketchSession: dependencies.buildGeometrySketchSessionWithHistory({
          session: dependencies.applyGeometrySketchSessionSnapshot(
            session,
            dependencies.buildGeometrySketchCommittedSessionSnapshot(session),
          ),
          undoCommands: [...session.sessionUndoCommands, stagedCommand],
          redoCommands: [],
          cloneNodeParams: dependencies.cloneNodeParams,
        }),
      }
    })
  },
})
