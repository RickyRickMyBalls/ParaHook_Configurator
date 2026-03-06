import type { EdgeEndpoint, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import { isPartNodeType, normalizePartSlots } from '../parts/partSlots'
import { buildNodeDriverVm, type OutputPinnedRowVm } from '../canvas/driverVm'
import { getNodeDef } from '../registry/nodeRegistry'
import { readFeatureStack } from '../features/featureSchema'
import { getFeatureDependencyIssues } from '../features/featureDependencies'
import {
  buildVmRowIdsForSection,
  normalizePartRowOrder,
} from '../parts/partRowOrder'
import {
  createConnectionContractIncrementalState,
  defaultNodeRegistry,
  type ConnectionContractCode,
  type ConnectionContractResult,
  validateConnectionContract,
} from '../contracts/endpoints'

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

  while (queue.length > 0) {
    const nodeId = queue.shift()
    if (nodeId === undefined) {
      break
    }
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

const formatEndpointPathSuffix = (endpoint: EdgeEndpoint): string => {
  const pathKey = endpointPathKey(endpoint.path)
  return pathKey.length === 0 ? '' : `.${pathKey}`
}

const formatEndpointPathSuffixFromKey = (pathKey: string): string =>
  pathKey.length === 0 ? '' : `.${pathKey}`

const buildConnectionDiagnosticMessage = (
  edge: SpaghettiGraph['edges'][number],
  decision: Extract<ConnectionContractResult, { ok: false }>,
): string => {
  switch (decision.code) {
    case 'EDGE_FROM_NODE_MISSING':
      return `Edge source node "${edge.from.nodeId}" does not exist.`
    case 'EDGE_TO_NODE_MISSING':
      return `Edge target node "${edge.to.nodeId}" does not exist.`
    case 'NODE_TYPE_UNKNOWN':
      return `Unknown node type "${decision.details.nodeType ?? 'unknown'}".`
    case 'EDGE_FROM_PORT_MISSING':
      return `Output port "${edge.from.portId}" does not exist on node "${edge.from.nodeId}".`
    case 'EDGE_TO_PORT_MISSING':
      return `Input port "${edge.to.portId}" does not exist on node "${edge.to.nodeId}".`
    case 'EDGE_FROM_PATH_INVALID':
      return `Output path "${endpointPathKey(edge.from.path)}" does not exist on "${edge.from.nodeId}.${edge.from.portId}".`
    case 'EDGE_FROM_PATH_NOT_LEAF':
      return `Output path "${endpointPathKey(edge.from.path)}" is not a leaf on "${edge.from.nodeId}.${edge.from.portId}".`
    case 'EDGE_TO_PATH_INVALID':
      return `Input path "${endpointPathKey(edge.to.path)}" does not exist on "${edge.to.nodeId}.${edge.to.portId}".`
    case 'EDGE_TO_PATH_NOT_LEAF':
      return `Input path "${endpointPathKey(edge.to.path)}" is not a leaf on "${edge.to.nodeId}.${edge.to.portId}".`
    case 'FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED':
      return `Feature virtual input "${edge.to.nodeId}.${edge.to.portId}" does not support path connections.`
    case 'DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED':
      return `Driver virtual input "${edge.to.nodeId}.${edge.to.portId}" does not support path connections.`
    case 'FEATURE_WIRE_INTRA_NODE_UNSUPPORTED':
      return `Feature virtual input "${edge.to.nodeId}.${edge.to.portId}" cannot be driven from the same node in Phase 2 v1.`
    case 'EDGE_TYPE_MISMATCH':
      return `Type mismatch from "${edge.from.nodeId}.${edge.from.portId}${formatEndpointPathSuffix(edge.from)}" to "${edge.to.nodeId}.${edge.to.portId}${formatEndpointPathSuffix(edge.to)}".`
    case 'EDGE_TO_PATH_DUPLICATE': {
      const pathKey = decision.details.toPathKey
      return `Duplicate leaf-path connections targeting "${edge.to.nodeId}.${edge.to.portId}${formatEndpointPathSuffixFromKey(pathKey)}".`
    }
    case 'EDGE_TO_MAX_CONNECTIONS': {
      const pathKey = decision.details.toPathKey
      const maxConnectionsIn = decision.details.maxConnectionsIn ?? 1
      return `Input endpoint "${edge.to.nodeId}.${edge.to.portId}${formatEndpointPathSuffixFromKey(pathKey)}" exceeds maxConnectionsIn (${maxConnectionsIn}).`
    }
    default: {
      const _exhaustive: never = decision.code
      return _exhaustive
    }
  }
}

const isCycleExcludedConnectionCode = (code: ConnectionContractCode): boolean =>
  code === 'FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED' ||
  code === 'DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED' ||
  code === 'FEATURE_WIRE_INTRA_NODE_UNSUPPORTED'

export const validateGraphConnectionDecision = (
  graph: SpaghettiGraph,
  edge: {
    from: EdgeEndpoint
    to: EdgeEndpoint
  },
): ConnectionContractResult =>
  validateConnectionContract(graph, defaultNodeRegistry, edge.from, edge.to)

export const validateGraph = (graph: SpaghettiGraph): GraphValidationResult => {
  const errors: SpaghettiDiagnostic[] = []
  const warnings: SpaghettiDiagnostic[] = []

  const sortedNodes = [...graph.nodes].sort(compareByNodeId)
  const sortedEdges = [...graph.edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))
  const inputConnectionCountsByNodeId = new Map<string, Map<string, number>>()
  for (const edge of sortedEdges) {
    const byPort = inputConnectionCountsByNodeId.get(edge.to.nodeId) ?? new Map<string, number>()
    byPort.set(edge.to.portId, (byPort.get(edge.to.portId) ?? 0) + 1)
    inputConnectionCountsByNodeId.set(edge.to.nodeId, byPort)
  }

  const nodeById = new Map<string, SpaghettiNode>()
  for (const node of sortedNodes) {
    nodeById.set(node.nodeId, node)
    const nodeDef = getNodeDef(node.type)
    let paramsForValidation = node.params

    if (isPartNodeType(node.type)) {
      const normalized = normalizePartSlots(node.partSlots, node.nodeId)
      for (const warning of normalized.warnings) {
        warnings.push({
          level: 'warn',
          code: warning.code,
          message: warning.message,
          nodeId: node.nodeId,
        })
      }
      // TODO(partSlots): enforce slot type/category gating when slot contents are introduced.

      const vm = buildNodeDriverVm(node, nodeDef, {
        connectionCountByPortId: inputConnectionCountsByNodeId.get(node.nodeId),
      })
      if (vm !== null) {
        const outputEndpointRows = vm.outputs.filter(
          (row): row is Extract<OutputPinnedRowVm, { kind: 'endpoint' }> => row.kind === 'endpoint',
        )
        const normalizedPartRowOrder = normalizePartRowOrder({
          node,
          vmDriversRowIds: buildVmRowIdsForSection(node.nodeId, vm.drivers),
          vmInputsRowIds: buildVmRowIdsForSection(node.nodeId, vm.inputs),
          vmOutputsRowIds: buildVmRowIdsForSection(node.nodeId, outputEndpointRows),
        })
        for (const warning of normalizedPartRowOrder.warnings) {
          warnings.push({
            level: 'warn',
            code: warning.code,
            message: warning.message,
            nodeId: node.nodeId,
          })
        }
        if (normalizedPartRowOrder.repairedNode !== undefined) {
          paramsForValidation = normalizedPartRowOrder.repairedNode.params
        }
      }
    }

    if (nodeDef === undefined) {
      errors.push({
        level: 'error',
        code: 'NODE_TYPE_UNKNOWN',
        message: `Unknown node type "${node.type}".`,
        nodeId: node.nodeId,
      })
      continue
    }

    const paramsResult = nodeDef.paramsSchema.safeParse(paramsForValidation)
    if (!paramsResult.success) {
      errors.push({
        level: 'error',
        code: 'NODE_PARAMS_INVALID',
        message: `Invalid params for node type "${node.type}": ${getFirstParamIssue(paramsResult.error)}.`,
        nodeId: node.nodeId,
      })
    }
  }

  for (const node of sortedNodes) {
    if (!isPartNodeType(node.type)) {
      continue
    }
    const stack = readFeatureStack(node.params.featureStack)
    for (const issue of getFeatureDependencyIssues(stack)) {
      if (issue.code === 'CLOSE_PROFILE_SOURCE_MISSING') {
        errors.push({
          level: 'error',
          code: issue.code,
          message: `Close Profile "${issue.featureId}" references missing source sketch.`,
          nodeId: node.nodeId,
        })
        continue
      }
      if (issue.code === 'CLOSE_PROFILE_PROFILE_MISSING') {
        errors.push({
          level: 'error',
          code: issue.code,
          message: `Close Profile "${issue.featureId}" source sketch has no profile.`,
          nodeId: node.nodeId,
        })
        continue
      }
      errors.push({
        level: 'error',
        code: issue.code,
        message: `Extrude "${issue.featureId}" references missing profile source.`,
        nodeId: node.nodeId,
      })
    }
  }

  const adjacency = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()

  const excludedEdgeIds = new Set<string>()
  const incrementalConnectionState = createConnectionContractIncrementalState()

  for (const edge of sortedEdges) {
    const decision = validateConnectionContract(
      graph,
      defaultNodeRegistry,
      edge.from,
      edge.to,
      {
        incrementalState: incrementalConnectionState,
      },
    )
    if (!decision.ok && decision.code !== 'NODE_TYPE_UNKNOWN') {
      errors.push({
        level: 'error',
        code: decision.code,
        message: buildConnectionDiagnosticMessage(edge, decision),
        edgeId: edge.edgeId,
      })
      if (isCycleExcludedConnectionCode(decision.code)) {
        excludedEdgeIds.add(edge.edgeId)
      }
    }

    if (excludedEdgeIds.has(edge.edgeId)) {
      continue
    }

    const fromNode = nodeById.get(edge.from.nodeId)
    const toNode = nodeById.get(edge.to.nodeId)
    if (fromNode === undefined || toNode === undefined) {
      continue
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
