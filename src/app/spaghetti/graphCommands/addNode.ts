import type { GraphNodePos, SpaghettiNode } from '../schema/spaghettiTypes'
import type { GraphCommand } from './types'

export const addNode = (options: {
  node: SpaghettiNode
  position?: GraphNodePos
}): GraphCommand => {
  const { node, position } = options
  return (graph) => {
    if (graph.nodes.some((candidate) => candidate.nodeId === node.nodeId)) {
      return graph
    }
    const nextNodes = [...graph.nodes, node]
    if (position === undefined) {
      return {
        ...graph,
        nodes: nextNodes,
      }
    }
    return {
      ...graph,
      nodes: nextNodes,
      ui: {
        ...graph.ui,
        nodes: {
          ...(graph.ui?.nodes ?? {}),
          [node.nodeId]: {
            x: Math.round(position.x),
            y: Math.round(position.y),
          },
        },
      },
    }
  }
}
