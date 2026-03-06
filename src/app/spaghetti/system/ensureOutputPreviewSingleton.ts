import type { SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import {
  createOutputPreviewNode,
  OUTPUT_PREVIEW_NODE_TYPE,
} from './outputPreviewNode'

const isOutputPreviewNode = (node: SpaghettiNode): boolean =>
  node.type === OUTPUT_PREVIEW_NODE_TYPE

const compareNodeIdAscending = (a: SpaghettiNode, b: SpaghettiNode): number =>
  String(a.nodeId).localeCompare(String(b.nodeId))

export const ensureOutputPreviewSingletonPatch = (
  graph: SpaghettiGraph,
): ((prev: SpaghettiGraph) => SpaghettiGraph) | null => {
  const outputPreviewNodes = graph.nodes.filter(isOutputPreviewNode)

  if (outputPreviewNodes.length === 0) {
    const createdNode = createOutputPreviewNode(graph)
    return (prev: SpaghettiGraph): SpaghettiGraph => ({
      ...prev,
      nodes: [...prev.nodes, createdNode],
    })
  }

  if (outputPreviewNodes.length === 1) {
    return null
  }

  const sortedOutputPreviewNodes = [...outputPreviewNodes].sort(compareNodeIdAscending)
  const keepNodeId = sortedOutputPreviewNodes[0].nodeId
  const removedNodeIds = new Set(
    sortedOutputPreviewNodes
      .map((node) => node.nodeId)
      .filter((nodeId) => nodeId !== keepNodeId),
  )

  return (prev: SpaghettiGraph): SpaghettiGraph => {
    const nodes = prev.nodes.filter(
      (node) =>
        !(
          node.type === OUTPUT_PREVIEW_NODE_TYPE &&
          removedNodeIds.has(node.nodeId)
        ),
    )
    const edges = prev.edges.filter(
      (edge) =>
        !removedNodeIds.has(edge.from.nodeId) && !removedNodeIds.has(edge.to.nodeId),
    )
    return {
      ...prev,
      nodes,
      edges,
    }
  }
}
