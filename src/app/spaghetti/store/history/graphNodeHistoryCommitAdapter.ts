import type {
  EditHistoryOwner,
  EditHistorySourceMetadata,
} from '../../../store/editHistoryStore'
import type {
  GraphNodePos,
  SpaghettiGraph,
  SpaghettiNode,
} from '../../schema/spaghettiTypes'

export type CommitGraphNodeMoveHistoryOptions = {
  nodeId: string
  from: GraphNodePos
  to: GraphNodePos
}

export type CommitGraphNodeParameterHistoryOptions = {
  nodeId: string
  beforeGraph: SpaghettiGraph
  afterGraph?: SpaghettiGraph
  targetId?: string
  targetLabel?: string
}

type RestoreGraphNodeParameterSnapshot = (
  graphDocumentId: string,
  nodeId: string,
  params: SpaghettiNode['params'],
) => void

type RestoreGraphNodePositionSnapshot = (
  graphDocumentId: string,
  nodeId: string,
  position: GraphNodePos,
) => void

type GraphNodeHistoryCommitAdapterDependencies = {
  getActiveGraphDocumentId: () => string
  getCurrentGraph: () => SpaghettiGraph
  normalizeGraphForStoreCommit: (graph: SpaghettiGraph) => SpaghettiGraph
  cloneNodeParams: (params: SpaghettiNode['params']) => SpaghettiNode['params']
  areNodeParamsEqual: (
    left: SpaghettiNode['params'],
    right: SpaghettiNode['params'],
  ) => boolean
  normalizeNodeWidth: (value: unknown) => number
  nextGraphStructureHistoryEntryId: (graphDocumentId: string) => string
  graphNodeMoveHistorySource: EditHistorySourceMetadata
  graphNodeParameterHistorySource: EditHistorySourceMetadata
  commitEditHistoryEntry: EditHistoryOwner['commitEntry']
  restoreGraphNodeParameterSnapshot: RestoreGraphNodeParameterSnapshot
  restoreGraphNodePositionSnapshot: RestoreGraphNodePositionSnapshot
}

const normalizeGraphNodeHistoryPos = (
  pos: GraphNodePos,
  fallbackWidth: number,
  normalizeNodeWidth: GraphNodeHistoryCommitAdapterDependencies['normalizeNodeWidth'],
): GraphNodePos => ({
  x: Math.round(pos.x),
  y: Math.round(pos.y),
  width:
    typeof pos.width === 'number' && Number.isFinite(pos.width)
      ? normalizeNodeWidth(pos.width)
      : fallbackWidth,
})

const areGraphNodePositionsEqual = (left: GraphNodePos, right: GraphNodePos): boolean =>
  left.x === right.x && left.y === right.y && left.width === right.width

export const createGraphNodeHistoryCommitAdapter = (
  dependencies: GraphNodeHistoryCommitAdapterDependencies,
) => ({
  commitGraphNodeParameterHistoryCommand: (
    options: CommitGraphNodeParameterHistoryOptions,
  ): boolean => {
    const graphDocumentId = dependencies.getActiveGraphDocumentId()
    const beforeGraph = dependencies.normalizeGraphForStoreCommit(options.beforeGraph)
    const afterGraph = dependencies.normalizeGraphForStoreCommit(
      options.afterGraph ?? dependencies.getCurrentGraph(),
    )
    const beforeNode = beforeGraph.nodes.find((node) => node.nodeId === options.nodeId)
    const afterNode = afterGraph.nodes.find((node) => node.nodeId === options.nodeId)
    if (beforeNode === undefined || afterNode === undefined) {
      return false
    }

    const beforeParams = dependencies.cloneNodeParams(beforeNode.params)
    const afterParams = dependencies.cloneNodeParams(afterNode.params)
    if (dependencies.areNodeParamsEqual(beforeParams, afterParams)) {
      return false
    }

    return dependencies.commitEditHistoryEntry({
      entryId: dependencies.nextGraphStructureHistoryEntryId(graphDocumentId),
      label: 'Change graph parameter',
      source: dependencies.graphNodeParameterHistorySource,
      targetId: options.targetId ?? options.nodeId,
      targetLabel: options.targetLabel ?? options.nodeId,
      undo: () =>
        dependencies.restoreGraphNodeParameterSnapshot(
          graphDocumentId,
          options.nodeId,
          beforeParams,
        ),
      redo: () =>
        dependencies.restoreGraphNodeParameterSnapshot(
          graphDocumentId,
          options.nodeId,
          afterParams,
        ),
    })
  },

  commitGraphNodeMoveHistoryCommand: (
    options: CommitGraphNodeMoveHistoryOptions,
  ): boolean => {
    const graphDocumentId = dependencies.getActiveGraphDocumentId()
    const graph = dependencies.normalizeGraphForStoreCommit(dependencies.getCurrentGraph())
    if (!graph.nodes.some((node) => node.nodeId === options.nodeId)) {
      return false
    }

    const currentPos = graph.ui?.nodes?.[options.nodeId]
    const fallbackWidth = dependencies.normalizeNodeWidth(
      options.to.width ?? options.from.width ?? currentPos?.width,
    )
    const from = normalizeGraphNodeHistoryPos(
      options.from,
      fallbackWidth,
      dependencies.normalizeNodeWidth,
    )
    const to = normalizeGraphNodeHistoryPos(
      options.to,
      fallbackWidth,
      dependencies.normalizeNodeWidth,
    )
    if (areGraphNodePositionsEqual(from, to)) {
      return false
    }
    const widthChanged = from.width !== to.width

    dependencies.restoreGraphNodePositionSnapshot(graphDocumentId, options.nodeId, to)

    return dependencies.commitEditHistoryEntry({
      entryId: dependencies.nextGraphStructureHistoryEntryId(graphDocumentId),
      label: widthChanged ? 'Resize graph node' : 'Move graph node',
      source: dependencies.graphNodeMoveHistorySource,
      targetId: options.nodeId,
      targetLabel: options.nodeId,
      undo: () =>
        dependencies.restoreGraphNodePositionSnapshot(graphDocumentId, options.nodeId, from),
      redo: () =>
        dependencies.restoreGraphNodePositionSnapshot(graphDocumentId, options.nodeId, to),
    })
  },
})
