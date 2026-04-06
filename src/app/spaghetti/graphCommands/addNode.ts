import type { GraphNodePos, NodeRowMode, SpaghettiNode } from '../schema/spaghettiTypes'
import type { GraphCommand } from './types'

export const addNode = (options: {
  node: SpaghettiNode
  position?: GraphNodePos
  nodeMode?: NodeRowMode
}): GraphCommand => {
  const { node, position, nodeMode } = options
  return (graph) => {
    if (graph.nodes.some((candidate) => candidate.nodeId === node.nodeId)) {
      return graph
    }
    const nextNodes = [...graph.nodes, node]
    const nextNodeModes =
      nodeMode === undefined
        ? graph.ui?.nodeModesByNodeId
        : {
            ...(graph.ui?.nodeModesByNodeId ?? {}),
            [node.nodeId]: nodeMode,
          }
    if (position === undefined) {
      return {
        ...graph,
        nodes: nextNodes,
        ...(nextNodeModes === undefined
          ? {}
          : {
              ui: {
                ...graph.ui,
                nodeModesByNodeId: nextNodeModes,
              },
            }),
      }
    }
    return {
      ...graph,
      nodes: nextNodes,
      ui: {
        ...graph.ui,
        ...(nextNodeModes === undefined ? {} : { nodeModesByNodeId: nextNodeModes }),
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
