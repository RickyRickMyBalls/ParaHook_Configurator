import type { PortSpec, PortType, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import { getNodeDef } from '../registry/nodeRegistry'
import { getFieldNodeAtPath, getFieldTree } from '../types/fieldTree'

export type SpaghettiDiagnostic = {
  level: 'error' | 'warn'
  code: string
  message: string
  nodeId?: string
  edgeId?: string
}

export type GraphValidationResult = {
  ok: boolean
  errors: SpaghettiDiagnostic[]
  warnings: SpaghettiDiagnostic[]
}

const compareByNodeId = (a: SpaghettiNode, b: SpaghettiNode): number =>
  a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type)

const compareTypesExact = (source: PortType, target: PortType): boolean =>
  source.kind === target.kind && source.unit === target.unit

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const endpointPathKey = (path: string[] | undefined): string =>
  normalizePath(path)?.join('.') ?? ''

const getFirstParamIssue = (paramsError: unknown): string => {
  if (paramsError && typeof paramsError === 'object' && 'issues' in paramsError) {
    const issues = paramsError.issues
    if (Array.isArray(issues) && issues.length > 0) {
      const firstIssue = issues[0]
      if (
        firstIssue &&
        typeof firstIssue === 'object' &&
        'message' in firstIssue &&
        typeof firstIssue.message === 'string'
      ) {
        return firstIssue.message
      }
    }
  }
  return 'Invalid params.'
}

const collectCycleNodes = (
  adjacency: Map<string, Set<string>>,
  indegree: Map<string, number>,
): string[] => {
  const queue = [...indegree.entries()]
    .filter(([, degree]) => degree === 0)
    .map(([nodeId]) => nodeId)
    .sort((a, b) => a.localeCompare(b))

  let processed = 0
  let cursor = 0

  while (cursor < queue.length) {
    const nodeId = queue[cursor++]
    processed += 1
    const neighbors = [...(adjacency.get(nodeId) ?? [])].sort((a, b) =>
      a.localeCompare(b),
    )
    for (const neighbor of neighbors) {
      const nextInDegree = (indegree.get(neighbor) ?? 0) - 1
      indegree.set(neighbor, nextInDegree)
      if (nextInDegree === 0) {
        queue.push(neighbor)
        queue.sort((a, b) => a.localeCompare(b))
      }
    }
  }

  if (processed === indegree.size) {
    return []
  }

  return [...indegree.entries()]
    .filter(([, degree]) => degree > 0)
    .map(([nodeId]) => nodeId)
    .sort((a, b) => a.localeCompare(b))
}

export const validateGraph = (graph: SpaghettiGraph): GraphValidationResult => {
  const errors: SpaghettiDiagnostic[] = []
  const warnings: SpaghettiDiagnostic[] = []

  const sortedNodes = [...graph.nodes].sort(compareByNodeId)
  const sortedEdges = [...graph.edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))

  const nodeById = new Map<string, SpaghettiNode>()
  const nodeDefsById = new Map<string, ReturnType<typeof getNodeDef>>()

  for (const node of sortedNodes) {
    nodeById.set(node.nodeId, node)
    const nodeDef = getNodeDef(node.type)
    nodeDefsById.set(node.nodeId, nodeDef)

    if (nodeDef === undefined) {
      errors.push({
        level: 'error',
        code: 'NODE_TYPE_UNKNOWN',
        message: `Unknown node type "${node.type}".`,
        nodeId: node.nodeId,
      })
      continue
    }

    const paramsResult = nodeDef.paramsSchema.safeParse(node.params)
    if (!paramsResult.success) {
      errors.push({
        level: 'error',
        code: 'NODE_PARAMS_INVALID',
        message: `Invalid params for node type "${node.type}": ${getFirstParamIssue(paramsResult.error)}.`,
        nodeId: node.nodeId,
      })
    }
  }

  const adjacency = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()

  const findPort = (ports: PortSpec[], portId: string): PortSpec | undefined =>
    ports.find((port) => port.portId === portId)

  for (const edge of sortedEdges) {
    const fromNode = nodeById.get(edge.from.nodeId)
    const toNode = nodeById.get(edge.to.nodeId)

    if (fromNode === undefined) {
      errors.push({
        level: 'error',
        code: 'EDGE_FROM_NODE_MISSING',
        message: `Edge source node "${edge.from.nodeId}" does not exist.`,
        edgeId: edge.edgeId,
      })
    }

    if (toNode === undefined) {
      errors.push({
        level: 'error',
        code: 'EDGE_TO_NODE_MISSING',
        message: `Edge target node "${edge.to.nodeId}" does not exist.`,
        edgeId: edge.edgeId,
      })
    }

    if (fromNode !== undefined && toNode !== undefined) {
      const fromDef = nodeDefsById.get(fromNode.nodeId)
      const toDef = nodeDefsById.get(toNode.nodeId)

      let fromPort: PortSpec | undefined
      let fromType: PortType | undefined
      if (fromDef !== undefined) {
        fromPort = findPort(fromDef.outputs, edge.from.portId)
        if (fromPort === undefined) {
          errors.push({
            level: 'error',
            code: 'EDGE_FROM_PORT_MISSING',
            message: `Output port "${edge.from.portId}" does not exist on node "${fromNode.nodeId}".`,
            edgeId: edge.edgeId,
          })
        } else {
          const resolved = getFieldNodeAtPath(
            getFieldTree(fromPort.type),
            normalizePath(edge.from.path),
          )
          if (resolved === undefined) {
            errors.push({
              level: 'error',
              code: 'EDGE_FROM_PATH_INVALID',
              message: `Output path "${endpointPathKey(edge.from.path)}" does not exist on "${fromNode.nodeId}.${fromPort.portId}".`,
              edgeId: edge.edgeId,
            })
          } else if (edge.from.path !== undefined && resolved.kind !== 'leaf') {
            errors.push({
              level: 'error',
              code: 'EDGE_FROM_PATH_NOT_LEAF',
              message: `Output path "${endpointPathKey(edge.from.path)}" is not a leaf on "${fromNode.nodeId}.${fromPort.portId}".`,
              edgeId: edge.edgeId,
            })
          } else {
            fromType = resolved.type
          }
        }
      }

      let toPort: PortSpec | undefined
      let toType: PortType | undefined
      if (toDef !== undefined) {
        toPort = findPort(toDef.inputs, edge.to.portId)
        if (toPort === undefined) {
          errors.push({
            level: 'error',
            code: 'EDGE_TO_PORT_MISSING',
            message: `Input port "${edge.to.portId}" does not exist on node "${toNode.nodeId}".`,
            edgeId: edge.edgeId,
          })
        } else {
          const resolved = getFieldNodeAtPath(
            getFieldTree(toPort.type),
            normalizePath(edge.to.path),
          )
          if (resolved === undefined) {
            errors.push({
              level: 'error',
              code: 'EDGE_TO_PATH_INVALID',
              message: `Input path "${endpointPathKey(edge.to.path)}" does not exist on "${toNode.nodeId}.${toPort.portId}".`,
              edgeId: edge.edgeId,
            })
          } else if (edge.to.path !== undefined && resolved.kind !== 'leaf') {
            errors.push({
              level: 'error',
              code: 'EDGE_TO_PATH_NOT_LEAF',
              message: `Input path "${endpointPathKey(edge.to.path)}" is not a leaf on "${toNode.nodeId}.${toPort.portId}".`,
              edgeId: edge.edgeId,
            })
          } else {
            toType = resolved.type
          }
        }
      }

      if (fromPort !== undefined && toPort !== undefined && fromType !== undefined && toType !== undefined) {
        if (!compareTypesExact(fromType, toType)) {
          errors.push({
            level: 'error',
            code: 'EDGE_TYPE_MISMATCH',
            message: `Type mismatch from "${fromNode.nodeId}.${fromPort.portId}${edge.from.path === undefined ? '' : `.${endpointPathKey(edge.from.path)}`}" to "${toNode.nodeId}.${toPort.portId}${edge.to.path === undefined ? '' : `.${endpointPathKey(edge.to.path)}`}".`,
            edgeId: edge.edgeId,
          })
        }
      }

      if (!adjacency.has(fromNode.nodeId)) {
        adjacency.set(fromNode.nodeId, new Set())
      }
      adjacency.get(fromNode.nodeId)?.add(toNode.nodeId)
      if (!indegree.has(fromNode.nodeId)) {
        indegree.set(fromNode.nodeId, 0)
      }
      if (!indegree.has(toNode.nodeId)) {
        indegree.set(toNode.nodeId, 0)
      }
      indegree.set(toNode.nodeId, (indegree.get(toNode.nodeId) ?? 0) + 1)
    }
  }

  const incomingByEndpoint = new Map<string, { count: number; max: number; edgeId: string }>()
  const duplicateLeafTargets = new Set<string>()
  for (const edge of sortedEdges) {
    const toNode = nodeById.get(edge.to.nodeId)
    if (toNode === undefined) {
      continue
    }
    const toDef = nodeDefsById.get(toNode.nodeId)
    if (toDef === undefined) {
      continue
    }
    const toPort = findPort(toDef.inputs, edge.to.portId)
    if (toPort === undefined) {
      continue
    }

    const pathKey = endpointPathKey(edge.to.path)
    const endpointKey = `${edge.to.nodeId}::${edge.to.portId}::${pathKey}`
    if (edge.to.path !== undefined) {
      if (duplicateLeafTargets.has(endpointKey)) {
        errors.push({
          level: 'error',
          code: 'EDGE_TO_PATH_DUPLICATE',
          message: `Duplicate leaf-path connections targeting "${edge.to.nodeId}.${edge.to.portId}.${pathKey}".`,
          edgeId: edge.edgeId,
        })
      } else {
        duplicateLeafTargets.add(endpointKey)
      }
    }

    const current = incomingByEndpoint.get(endpointKey)
    if (current === undefined) {
      incomingByEndpoint.set(endpointKey, {
        count: 1,
        max: toPort.maxConnectionsIn ?? 1,
        edgeId: edge.edgeId,
      })
      continue
    }
    current.count += 1
    if (current.count > current.max) {
      errors.push({
        level: 'error',
        code: 'EDGE_TO_MAX_CONNECTIONS',
        message: `Input endpoint "${edge.to.nodeId}.${edge.to.portId}${pathKey.length === 0 ? '' : `.${pathKey}`}" exceeds maxConnectionsIn (${current.max}).`,
        edgeId: edge.edgeId,
      })
    }
  }

  const cycleNodeIds = collectCycleNodes(adjacency, new Map(indegree))
  if (cycleNodeIds.length > 0) {
    errors.push({
      level: 'error',
      code: 'GRAPH_CYCLE_DETECTED',
      message: `Cycle detected involving nodes: ${cycleNodeIds.join(', ')}.`,
    })
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}
