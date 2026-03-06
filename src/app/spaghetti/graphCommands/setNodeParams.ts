import type { GraphCommand } from './types'

export const setNodeParams = (options: {
  nodeId: string
  params: Record<string, unknown>
}): GraphCommand => {
  const { nodeId, params } = options
  return (graph) => {
    let changed = false
    const nextNodes = graph.nodes.map((node) => {
      if (node.nodeId !== nodeId) {
        return node
      }
      changed = true
      return {
        ...node,
        params,
      }
    })
    if (!changed) {
      return graph
    }
    return {
      ...graph,
      nodes: nextNodes,
    }
  }
}
