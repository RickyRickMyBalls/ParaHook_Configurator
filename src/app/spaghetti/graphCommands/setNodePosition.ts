import type { GraphCommand } from './types'

export const setNodePosition = (options: {
  nodeId: string
  x: number
  y: number
}): GraphCommand => {
  const { nodeId, x, y } = options
  return (graph) => {
    if (!graph.nodes.some((node) => node.nodeId === nodeId)) {
      return graph
    }
    const roundedX = Math.round(x)
    const roundedY = Math.round(y)
    const current = graph.ui?.nodes?.[nodeId]
    if (current?.x === roundedX && current.y === roundedY) {
      return graph
    }
    return {
      ...graph,
      ui: {
        ...graph.ui,
        nodes: {
          ...(graph.ui?.nodes ?? {}),
          [nodeId]: {
            x: roundedX,
            y: roundedY,
          },
        },
      },
    }
  }
}
