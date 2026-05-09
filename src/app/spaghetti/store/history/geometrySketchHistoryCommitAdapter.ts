import type {
  EditHistoryEntryChildRestorePoint,
  EditHistoryEntryChildSummary,
  EditHistoryOwner,
  EditHistorySourceMetadata,
} from '../../../store/editHistoryStore'
import type { SpaghettiGraph, SpaghettiNode } from '../../schema/spaghettiTypes'
import {
  buildGeometrySketchLocalHistoryState,
  cloneGeometrySketchLocalHistoryState,
  cloneGeometrySketchSessionSnapshot,
  type GeometrySketchLocalHistoryState,
  type GeometrySketchSessionHistoryCommand,
  type GeometrySketchSessionSnapshot,
  type GeometrySketchStagedCommand,
} from './geometrySketchHistory'

type CloneNodeParams = (params: SpaghettiNode['params']) => SpaghettiNode['params']

type GeometrySketchNodeReader = (
  graph: SpaghettiGraph,
  nodeId: string,
) => SpaghettiNode['params'] | null

type GeometrySketchNodeRestore = (
  graphDocumentId: string,
  nodeId: string,
  params: SpaghettiNode['params'],
  localHistory?: GeometrySketchLocalHistoryState,
) => void

export type CommitGeometrySketchFeatureHistoryOptions = {
  nodeId: string
  beforeGraph: SpaghettiGraph
  afterGraph?: SpaghettiGraph
  beforeLocalHistory?: GeometrySketchLocalHistoryState
  afterLocalHistory?: GeometrySketchLocalHistoryState
  label: string
  targetId?: string
  targetLabel?: string
  childSummaries?: readonly EditHistoryEntryChildSummary[]
  childRestorePoints?: readonly EditHistoryEntryChildRestorePoint[]
}

type BuildGeometrySketchStagedCommandOptions = {
  nodeId: string
  beforeGraph: SpaghettiGraph
  afterGraph: SpaghettiGraph
  label: string
  beforeSessionState: GeometrySketchSessionSnapshot
  afterSessionState: GeometrySketchSessionSnapshot
}

type CreateGeometrySketchChildRestorePointsOptions = {
  graphDocumentId: string
  nodeId: string
  baselineParams: SpaghettiNode['params']
  commands: readonly GeometrySketchSessionHistoryCommand[]
}

type GeometrySketchHistoryCommitAdapterDependencies = {
  getActiveGraphDocumentId: () => string
  getCurrentGraph: () => SpaghettiGraph
  normalizeGraphForStoreCommit: (graph: SpaghettiGraph) => SpaghettiGraph
  cloneNodeParams: CloneNodeParams
  areNodeParamsEqual: (
    left: SpaghettiNode['params'],
    right: SpaghettiNode['params'],
  ) => boolean
  readGeometrySketchNodeParams: GeometrySketchNodeReader
  isGeometrySketchNode: (node: SpaghettiNode) => boolean
  nextGraphStructureHistoryEntryId: (graphDocumentId: string) => string
  nextGeometrySketchStagedCommandId: (nodeId: string) => string
  geometrySketchDrawHistorySource: EditHistorySourceMetadata
  commitEditHistoryEntry: EditHistoryOwner['commitEntry']
  restoreGeometrySketchNodeParameterSnapshot: GeometrySketchNodeRestore
}

export const createGeometrySketchHistoryCommitAdapter = (
  dependencies: GeometrySketchHistoryCommitAdapterDependencies,
) => ({
  commitGeometrySketchFeatureHistoryCommand: (
    options: CommitGeometrySketchFeatureHistoryOptions,
  ): boolean => {
    const graphDocumentId = dependencies.getActiveGraphDocumentId()
    const beforeGraph = dependencies.normalizeGraphForStoreCommit(options.beforeGraph)
    const afterGraph = dependencies.normalizeGraphForStoreCommit(
      options.afterGraph ?? dependencies.getCurrentGraph(),
    )
    const beforeNode = beforeGraph.nodes.find((node) => node.nodeId === options.nodeId)
    const afterNode = afterGraph.nodes.find((node) => node.nodeId === options.nodeId)
    if (
      beforeNode === undefined ||
      afterNode === undefined ||
      !dependencies.isGeometrySketchNode(beforeNode) ||
      !dependencies.isGeometrySketchNode(afterNode)
    ) {
      return false
    }

    const beforeParams = dependencies.cloneNodeParams(beforeNode.params)
    const afterParams = dependencies.cloneNodeParams(afterNode.params)
    if (dependencies.areNodeParamsEqual(beforeParams, afterParams)) {
      return false
    }
    const beforeLocalHistory = cloneGeometrySketchLocalHistoryState(
      options.beforeLocalHistory,
      dependencies.cloneNodeParams,
    )
    const afterLocalHistory = cloneGeometrySketchLocalHistoryState(
      options.afterLocalHistory,
      dependencies.cloneNodeParams,
    )

    return dependencies.commitEditHistoryEntry({
      entryId: dependencies.nextGraphStructureHistoryEntryId(graphDocumentId),
      label: options.label,
      source: dependencies.geometrySketchDrawHistorySource,
      targetId: options.targetId ?? `${options.nodeId}:sketch`,
      targetLabel: options.targetLabel ?? 'Sketch Draw',
      ...(options.childSummaries === undefined || options.childSummaries.length === 0
        ? {}
        : { childSummaries: options.childSummaries }),
      ...(options.childRestorePoints === undefined || options.childRestorePoints.length === 0
        ? {}
        : { childRestorePoints: options.childRestorePoints }),
      undo: () =>
        dependencies.restoreGeometrySketchNodeParameterSnapshot(
          graphDocumentId,
          options.nodeId,
          beforeParams,
          beforeLocalHistory,
        ),
      redo: () =>
        dependencies.restoreGeometrySketchNodeParameterSnapshot(
          graphDocumentId,
          options.nodeId,
          afterParams,
          afterLocalHistory,
        ),
    })
  },

  buildGeometrySketchStagedCommand: (
    options: BuildGeometrySketchStagedCommandOptions,
  ): GeometrySketchStagedCommand | null => {
    const beforeParams = dependencies.readGeometrySketchNodeParams(
      options.beforeGraph,
      options.nodeId,
    )
    const afterParams = dependencies.readGeometrySketchNodeParams(
      options.afterGraph,
      options.nodeId,
    )
    if (
      beforeParams === null ||
      afterParams === null ||
      dependencies.areNodeParamsEqual(beforeParams, afterParams)
    ) {
      return null
    }

    return {
      commandId: dependencies.nextGeometrySketchStagedCommandId(options.nodeId),
      nodeId: options.nodeId,
      label: options.label,
      kind: 'geometry',
      beforeSessionState: cloneGeometrySketchSessionSnapshot(options.beforeSessionState),
      afterSessionState: cloneGeometrySketchSessionSnapshot(options.afterSessionState),
      beforeParams,
      afterParams,
    }
  },

  createGeometrySketchChildRestorePoints: (
    options: CreateGeometrySketchChildRestorePointsOptions,
  ): EditHistoryEntryChildRestorePoint[] => {
    let boundaryParams = dependencies.cloneNodeParams(options.baselineParams)
    return options.commands.map((command, index) => {
      if (command.kind === 'geometry') {
        boundaryParams = dependencies.cloneNodeParams(command.afterParams)
      }

      const restoreParams = dependencies.cloneNodeParams(boundaryParams)
      const restoreLocalHistory = buildGeometrySketchLocalHistoryState(
        options.commands.slice(0, index + 1),
        options.commands.slice(index + 1),
        dependencies.cloneNodeParams,
      )
      return {
        childId: command.commandId,
        restore: () =>
          dependencies.restoreGeometrySketchNodeParameterSnapshot(
            options.graphDocumentId,
            options.nodeId,
            restoreParams,
            restoreLocalHistory,
          ),
      }
    })
  },
})
