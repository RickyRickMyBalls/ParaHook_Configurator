import type { SpaghettiEdge } from '../schema/spaghettiTypes'
import type { GraphCommand } from './types'

export const replaceEdge = (options: {
  edgeId: string
  nextEdge: SpaghettiEdge
}): GraphCommand => {
  const { edgeId, nextEdge } = options
  return (graph) => {
    const index = graph.edges.findIndex((edge) => edge.edgeId === edgeId)
    if (index < 0) {
      return graph
    }
    if (
      nextEdge.edgeId !== edgeId &&
      graph.edges.some((edge) => edge.edgeId === nextEdge.edgeId)
    ) {
      return graph
    }
    const nextEdges = [...graph.edges]
    nextEdges[index] = nextEdge
    return {
      ...graph,
      edges: nextEdges,
    }
  }
}
