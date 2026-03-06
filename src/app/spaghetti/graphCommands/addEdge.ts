import type { SpaghettiEdge } from '../schema/spaghettiTypes'
import type { GraphCommand } from './types'

export const addEdge = (edge: SpaghettiEdge): GraphCommand => {
  return (graph) => {
    if (graph.edges.some((candidate) => candidate.edgeId === edge.edgeId)) {
      return graph
    }
    return {
      ...graph,
      edges: [...graph.edges, edge],
    }
  }
}
