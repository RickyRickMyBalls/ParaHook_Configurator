import type { GraphCommand } from './types'

export const removeNode = (nodeId: string): GraphCommand => {
  return (graph) => {
    if (!graph.nodes.some((node) => node.nodeId === nodeId)) {
      return graph
    }

    const nextNodes = graph.nodes.filter((node) => node.nodeId !== nodeId)
    const nextEdges = graph.edges.filter(
      (edge) => edge.from.nodeId !== nodeId && edge.to.nodeId !== nodeId,
    )

    const nextUiNodes = { ...(graph.ui?.nodes ?? {}) }
    delete nextUiNodes[nodeId]
    const hasUiNodes = Object.keys(nextUiNodes).length > 0
    const hasViewport = graph.ui?.viewport !== undefined
    const nextUi =
      !hasUiNodes && !hasViewport
        ? undefined
        : {
            ...(hasViewport ? { viewport: graph.ui?.viewport } : {}),
            ...(hasUiNodes ? { nodes: nextUiNodes } : {}),
          }

    return {
      ...graph,
      nodes: nextNodes,
      edges: nextEdges,
      ...(nextUi === undefined ? { ui: undefined } : { ui: nextUi }),
    }
  }
}
