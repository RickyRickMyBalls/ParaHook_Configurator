import type { GraphCommand } from './types'

export const removeEdge = (edgeId: string): GraphCommand => {
  return (graph) => {
    const nextEdges = graph.edges.filter((edge) => edge.edgeId !== edgeId)
    if (nextEdges.length === graph.edges.length) {
      return graph
    }
    return {
      ...graph,
      edges: nextEdges,
    }
  }
}
