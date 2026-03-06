import { planEdgeInsertWithDriverInputAutoReplace } from '../canvas/driverInputAutoReplace'
import type { EdgeEndpoint, SpaghettiGraph } from '../schema/spaghettiTypes'
import type { GraphCommand } from './types'

export type ConnectEdgeWithAutoReplacePlan = ReturnType<
  typeof planEdgeInsertWithDriverInputAutoReplace
> & {
  nextGraph: SpaghettiGraph
}

export const planConnectEdgeWithAutoReplace = (
  graph: SpaghettiGraph,
  options: {
    edgeId: string
    from: EdgeEndpoint
    to: EdgeEndpoint
  },
): ConnectEdgeWithAutoReplacePlan => {
  const plan = planEdgeInsertWithDriverInputAutoReplace({
    edges: graph.edges,
    edgeId: options.edgeId,
    from: options.from,
    to: options.to,
  })
  return {
    ...plan,
    nextGraph:
      plan.kind === 'noop'
        ? graph
        : {
            ...graph,
            edges: plan.nextEdges,
          },
  }
}

export const connectEdgeWithAutoReplace = (options: {
  edgeId: string
  from: EdgeEndpoint
  to: EdgeEndpoint
}): GraphCommand => {
  return (graph) => planConnectEdgeWithAutoReplace(graph, options).nextGraph
}
