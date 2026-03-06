import {
  parseDriverVirtualInputPortId,
} from '../features/driverVirtualPorts'
import type { EdgeEndpoint, SpaghettiEdge } from '../schema/spaghettiTypes'
import { buildCanonicalEndpointKey } from '../contracts/endpoints'

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const endpointPathKey = (path: string[] | undefined): string =>
  normalizePath(path)?.join('.') ?? ''

const normalizeEndpoint = (endpoint: EdgeEndpoint): EdgeEndpoint => {
  const path = normalizePath(endpoint.path)
  return {
    nodeId: endpoint.nodeId,
    portId: endpoint.portId,
    ...(path === undefined ? {} : { path }),
  }
}

const endpointsEqualExact = (a: EdgeEndpoint, b: EdgeEndpoint): boolean =>
  a.nodeId === b.nodeId &&
  a.portId === b.portId &&
  endpointPathKey(a.path) === endpointPathKey(b.path)

export const buildTargetEndpointKey = (endpoint: EdgeEndpoint): string => {
  return buildCanonicalEndpointKey(endpoint.nodeId, endpoint.portId, endpoint.path)
}

export type EdgeInsertPlan =
  | {
      kind: 'noop'
      preservedEdgeId: string
      nextEdges: SpaghettiEdge[]
      removedEdgeIds: string[]
    }
  | {
      kind: 'insert'
      insertedEdge: SpaghettiEdge
      nextEdges: SpaghettiEdge[]
      removedEdgeIds: string[]
    }

export const planEdgeInsertWithDriverInputAutoReplace = (options: {
  edges: readonly SpaghettiEdge[]
  from: EdgeEndpoint
  to: EdgeEndpoint
  edgeId: string
}): EdgeInsertPlan => {
  const from = normalizeEndpoint(options.from)
  const to = normalizeEndpoint(options.to)
  const edges = [...options.edges]

  if (parseDriverVirtualInputPortId(to.portId) === null) {
    const insertedEdge: SpaghettiEdge = {
      edgeId: options.edgeId,
      from,
      to,
    }
    return {
      kind: 'insert',
      insertedEdge,
      nextEdges: [...edges, insertedEdge],
      removedEdgeIds: [],
    }
  }

  const targetKey = buildTargetEndpointKey(to)
  const existingAtTarget = edges.filter((edge) => buildTargetEndpointKey(edge.to) === targetKey)
  const exactDuplicate = existingAtTarget.find(
    (edge) => endpointsEqualExact(edge.from, from) && endpointsEqualExact(edge.to, to),
  )

  if (exactDuplicate !== undefined && existingAtTarget.length === 1) {
    return {
      kind: 'noop',
      preservedEdgeId: exactDuplicate.edgeId,
      nextEdges: edges,
      removedEdgeIds: [],
    }
  }

  const removedEdgeIds = new Set(existingAtTarget.map((edge) => edge.edgeId))
  const survivors = edges.filter((edge) => !removedEdgeIds.has(edge.edgeId))
  const insertedEdge: SpaghettiEdge = {
    edgeId: options.edgeId,
    from,
    to,
  }

  return {
    kind: 'insert',
    insertedEdge,
    nextEdges: [...survivors, insertedEdge],
    removedEdgeIds: [...removedEdgeIds],
  }
}
