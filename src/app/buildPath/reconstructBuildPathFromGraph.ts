import type { BuildPathEvent } from './buildPathEvents'
import type { BuildPathGraphDependency } from './buildPathTimeline'
import type { GraphCommandFamily } from '../console/commandCommitContract'
import { buildGraphOutputEntryId } from '../spaghetti/outputSurface'
import type {
  GraphDocument,
  SpaghettiEdge,
  SpaghettiGraph,
  SpaghettiNode,
} from '../spaghetti/schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../spaghetti/families/OutputPreview/system/outputPreviewNode'

export type LoadedGraphBuildPathReconstruction = {
  sourceKind: 'reconstructed'
  graphDocumentId: string
  events: BuildPathEvent[]
  dependencies: BuildPathGraphDependency[]
  unsupportedNodeIds: string[]
}

const commandFamilyByNodeType: Record<string, GraphCommandFamily> = {
  'Geometry/Sketch': 'Sketch',
  'Geometry/Extrude': 'Extrude',
}

const readSupportedCommandFamily = (node: SpaghettiNode): GraphCommandFamily | null =>
  commandFamilyByNodeType[node.type] ?? null

const uniqueInOrder = (values: readonly string[]): string[] => {
  const seen = new Set<string>()
  const result: string[] = []

  values.forEach((value) => {
    if (value.length === 0 || seen.has(value)) {
      return
    }
    seen.add(value)
    result.push(value)
  })

  return result
}

const compareNodesByFileOrder = (
  nodeIndexById: ReadonlyMap<string, number>,
  leftNodeId: string,
  rightNodeId: string,
): number => {
  const indexOrder = (nodeIndexById.get(leftNodeId) ?? 0) - (nodeIndexById.get(rightNodeId) ?? 0)
  return indexOrder === 0 ? leftNodeId.localeCompare(rightNodeId) : indexOrder
}

const deriveSupportedNodeOrder = (
  graph: SpaghettiGraph,
  supportedNodes: readonly SpaghettiNode[],
): SpaghettiNode[] => {
  const supportedNodeIds = new Set(supportedNodes.map((node) => node.nodeId))
  const supportedNodeById = new Map(supportedNodes.map((node) => [node.nodeId, node] as const))
  const nodeIndexById = new Map(graph.nodes.map((node, index) => [node.nodeId, index] as const))
  const predecessorIdsByNodeId = new Map<string, Set<string>>()
  const successorIdsByNodeId = new Map<string, Set<string>>()

  supportedNodeIds.forEach((nodeId) => {
    predecessorIdsByNodeId.set(nodeId, new Set())
    successorIdsByNodeId.set(nodeId, new Set())
  })

  graph.edges.forEach((edge) => {
    if (!supportedNodeIds.has(edge.from.nodeId) || !supportedNodeIds.has(edge.to.nodeId)) {
      return
    }
    predecessorIdsByNodeId.get(edge.to.nodeId)?.add(edge.from.nodeId)
    successorIdsByNodeId.get(edge.from.nodeId)?.add(edge.to.nodeId)
  })

  const readyNodeIds = [...supportedNodeIds]
    .filter((nodeId) => (predecessorIdsByNodeId.get(nodeId)?.size ?? 0) === 0)
    .sort((left, right) => compareNodesByFileOrder(nodeIndexById, left, right))
  const orderedNodeIds: string[] = []

  while (readyNodeIds.length > 0) {
    const nodeId = readyNodeIds.shift()
    if (nodeId === undefined) {
      break
    }
    orderedNodeIds.push(nodeId)

    const successorIds = [...(successorIdsByNodeId.get(nodeId) ?? [])].sort((left, right) =>
      compareNodesByFileOrder(nodeIndexById, left, right),
    )
    successorIds.forEach((successorId) => {
      const predecessorIds = predecessorIdsByNodeId.get(successorId)
      predecessorIds?.delete(nodeId)
      if (predecessorIds?.size === 0 && !orderedNodeIds.includes(successorId)) {
        readyNodeIds.push(successorId)
        readyNodeIds.sort((left, right) => compareNodesByFileOrder(nodeIndexById, left, right))
      }
    })
  }

  const unresolvedNodeIds = [...supportedNodeIds]
    .filter((nodeId) => !orderedNodeIds.includes(nodeId))
    .sort((left, right) => compareNodesByFileOrder(nodeIndexById, left, right))

  return [...orderedNodeIds, ...unresolvedNodeIds]
    .map((nodeId) => supportedNodeById.get(nodeId))
    .filter((node): node is SpaghettiNode => node !== undefined)
}

const readOutputIdsBySourceNodeId = (graph: SpaghettiGraph): Map<string, string[]> => {
  const outputPreviewNodeIds = new Set(
    graph.nodes
      .filter((node) => node.type === OUTPUT_PREVIEW_NODE_TYPE)
      .map((node) => node.nodeId),
  )
  const outputIdsBySourceNodeId = new Map<string, string[]>()

  graph.edges.forEach((edge) => {
    if (!outputPreviewNodeIds.has(edge.to.nodeId) || !edge.to.portId.startsWith('in:solid:')) {
      return
    }
    const slotId = edge.to.portId.slice('in:solid:'.length)
    const current = outputIdsBySourceNodeId.get(edge.from.nodeId) ?? []
    outputIdsBySourceNodeId.set(edge.from.nodeId, [
      ...current,
      buildGraphOutputEntryId(slotId, edge.from.nodeId, null, edge.from.portId),
    ])
  })

  return new Map(
    [...outputIdsBySourceNodeId.entries()].map(([nodeId, outputIds]) => [
      nodeId,
      uniqueInOrder(outputIds),
    ]),
  )
}

const collectNodeEdgeIds = (
  nodeId: string,
  edges: readonly SpaghettiEdge[],
): string[] =>
  uniqueInOrder(
    edges
      .filter((edge) => edge.from.nodeId === nodeId || edge.to.nodeId === nodeId)
      .map((edge) => edge.edgeId),
  )

export const reconstructBuildPathFromLoadedGraph = (
  document: GraphDocument,
): LoadedGraphBuildPathReconstruction => {
  const supportedNodes = document.graph.nodes.filter(
    (node) => readSupportedCommandFamily(node) !== null,
  )
  const supportedNodeIds = new Set(supportedNodes.map((node) => node.nodeId))
  const orderedNodes = deriveSupportedNodeOrder(document.graph, supportedNodes)
  const outputIdsBySourceNodeId = readOutputIdsBySourceNodeId(document.graph)
  const dependencies: BuildPathGraphDependency[] = document.graph.edges.flatMap((edge) =>
    supportedNodeIds.has(edge.from.nodeId) && supportedNodeIds.has(edge.to.nodeId)
      ? [{
          edgeId: edge.edgeId,
          fromNodeId: edge.from.nodeId,
          toNodeId: edge.to.nodeId,
          graphDocumentId: document.graphDocumentId,
          sourceKind: 'reconstructed' as const,
        }]
      : [],
  )

  return {
    sourceKind: 'reconstructed',
    graphDocumentId: document.graphDocumentId,
    events: orderedNodes.map((node, index): BuildPathEvent => {
      const commandFamily = readSupportedCommandFamily(node)
      const eventSequence = index + 1
      const sourceProjectionId = [
        'build-path-reconstructed',
        document.graphDocumentId,
        node.nodeId,
      ].join(':')

      return {
        buildPathEventId: [
          'build-path-event',
          eventSequence.toString(),
          sourceProjectionId,
        ].join(':'),
        sourceProjectionId,
        sourceKind: 'reconstructed',
        graphDocumentId: document.graphDocumentId,
        commandFamily: commandFamily ?? 'Sketch',
        entryPoint: 'loaded-graph-reconstruction',
        eventSequence,
        affectedNodeIds: [node.nodeId],
        affectedEdgeIds: collectNodeEdgeIds(node.nodeId, document.graph.edges),
        affectedOutputIds: outputIdsBySourceNodeId.get(node.nodeId) ?? [],
        mutationSummary: {
          createdNodeIds: [node.nodeId],
          reusedNodeIds: [],
          updatedNodeIds: [],
          addedEdgeIds: collectNodeEdgeIds(node.nodeId, document.graph.edges),
          removedEdgeIds: [],
        },
        buildResultState: {
          kind: 'unavailable',
          reason: 'reconstructed-from-loaded-graph',
        },
        timelineRole: 'unclassified',
      }
    }),
    dependencies,
    unsupportedNodeIds: document.graph.nodes
      .filter((node) => readSupportedCommandFamily(node) === null)
      .map((node) => node.nodeId),
  }
}
