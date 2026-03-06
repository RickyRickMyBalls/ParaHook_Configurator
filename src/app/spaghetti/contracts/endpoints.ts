import { getNodeDef, type NodeDefinition } from '../registry/nodeRegistry'
import type {
  EdgeEndpoint,
  PortSpec,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'
import { getFieldNodeAtPath, getFieldTree } from '../types/fieldTree'
import {
  resolveEffectiveInputPort,
  resolveEffectiveOutputPort,
} from '../features/effectivePorts'
import {
  buildDriverVirtualInputPortId,
  buildDriverVirtualOutputPortId,
  parseDriverVirtualInputPortId,
  parseDriverVirtualOutputPortId,
} from '../features/driverVirtualPorts'
import { isFeatureVirtualInputPortId } from '../features/featureVirtualPorts'
import type { PortDirection } from '../canvas/types'

export type ConnectionContractCode =
  | 'OK'
  | 'EDGE_FROM_NODE_MISSING'
  | 'EDGE_TO_NODE_MISSING'
  | 'NODE_TYPE_UNKNOWN'
  | 'EDGE_FROM_PORT_MISSING'
  | 'EDGE_TO_PORT_MISSING'
  | 'EDGE_FROM_PATH_INVALID'
  | 'EDGE_FROM_PATH_NOT_LEAF'
  | 'EDGE_TO_PATH_INVALID'
  | 'EDGE_TO_PATH_NOT_LEAF'
  | 'EDGE_TO_PATH_DUPLICATE'
  | 'FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED'
  | 'DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED'
  | 'FEATURE_WIRE_INTRA_NODE_UNSUPPORTED'
  | 'EDGE_TYPE_MISMATCH'
  | 'EDGE_TO_MAX_CONNECTIONS'

export type NodeRegistryLike = {
  getNodeDef: (type: string) => NodeDefinition | undefined
}

export const defaultNodeRegistry: NodeRegistryLike = {
  getNodeDef,
}

export type ResolvedEndpoint = {
  exists: boolean
  direction: PortDirection
  nodeId: string
  portId: string
  path?: string[]
  pathKey: string
  canonicalEndpointKey: string
  node?: SpaghettiNode
  nodeDef?: NodeDefinition
  port?: PortSpec
  type?: PortSpec['type']
  optional?: boolean
  maxConnectionsIn?: number
  pathExists: boolean
  pathIsLeaf: boolean
  isFeatureVirtualInput: boolean
  isDriverVirtualInput: boolean
}

export type ConnectionContractDetails = {
  fromNodeId: string
  toNodeId: string
  fromPortId: string
  toPortId: string
  fromCanonicalPortId: string
  toCanonicalPortId: string
  fromPathKey: string
  toPathKey: string
  endpointKey?: string
  incomingCount?: number
  maxConnectionsIn?: number
  nodeType?: string
}

export type ConnectionContractResult =
  | {
      ok: true
      code: 'OK'
      details: ConnectionContractDetails
    }
  | {
      ok: false
      code: Exclude<ConnectionContractCode, 'OK'>
      details: ConnectionContractDetails
    }

export type ConnectionContractIncrementalState = {
  incomingCountByEndpointKey: Map<string, number>
  seenLeafTargetByEndpointKey: Set<string>
}

export const createConnectionContractIncrementalState =
  (): ConnectionContractIncrementalState => ({
    incomingCountByEndpointKey: new Map<string, number>(),
    seenLeafTargetByEndpointKey: new Set<string>(),
  })

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const endpointPathKey = (path: string[] | undefined): string =>
  normalizePath(path)?.join('.') ?? ''

export const canonicalizeDriverPortId = (portId: string): string => {
  const parsedInput = parseDriverVirtualInputPortId(portId)
  if (parsedInput !== null) {
    return buildDriverVirtualInputPortId(parsedInput.paramId)
  }
  const parsedOutput = parseDriverVirtualOutputPortId(portId)
  if (parsedOutput !== null) {
    return buildDriverVirtualOutputPortId(parsedOutput.paramId)
  }
  return portId
}

export const canonicalizePortIdByNodeType = (
  _nodeType: string,
  portId: string,
): string => canonicalizeDriverPortId(portId)

export const buildCanonicalEndpointKey = (
  nodeId: string,
  portId: string,
  path?: string[],
): string => {
  const canonicalPortId = canonicalizeDriverPortId(portId)
  const parsedDriverInput = parseDriverVirtualInputPortId(canonicalPortId)
  if (parsedDriverInput !== null) {
    return `${nodeId}::${buildDriverVirtualInputPortId(parsedDriverInput.paramId)}::`
  }
  return `${nodeId}::${canonicalPortId}::${endpointPathKey(path)}`
}

// Secondary grouping helper for endpoint-equivalent behaviors (e.g. contract checks,
// max-connection counting). Never use this key as diagnostics identity; diagnostics
// identity is edgeId-based.
export const buildEndpointGroupingKey = (
  nodeId: string,
  portId: string,
  path?: string[],
): string => buildCanonicalEndpointKey(nodeId, portId, path)

export const resolveEndpoint = (
  graph: SpaghettiGraph,
  nodeRegistry: NodeRegistryLike,
  endpoint: EdgeEndpoint,
  direction: PortDirection,
): ResolvedEndpoint => {
  const normalizedPath = normalizePath(endpoint.path)
  const node = graph.nodes.find((candidate) => candidate.nodeId === endpoint.nodeId)
  const fallbackCanonicalPortId = canonicalizeDriverPortId(endpoint.portId)
  const fallbackPathKey = endpointPathKey(normalizedPath)
  const fallbackEndpointKey = buildCanonicalEndpointKey(
    endpoint.nodeId,
    fallbackCanonicalPortId,
    normalizedPath,
  )
  if (node === undefined) {
    return {
      exists: false,
      direction,
      nodeId: endpoint.nodeId,
      portId: fallbackCanonicalPortId,
      ...(normalizedPath === undefined ? {} : { path: normalizedPath }),
      pathKey: fallbackPathKey,
      canonicalEndpointKey: fallbackEndpointKey,
      pathExists: false,
      pathIsLeaf: false,
      isFeatureVirtualInput: false,
      isDriverVirtualInput: parseDriverVirtualInputPortId(fallbackCanonicalPortId) !== null,
    }
  }

  const nodeDef = nodeRegistry.getNodeDef(node.type)
  const canonicalPortId = canonicalizePortIdByNodeType(node.type, endpoint.portId)
  const canonicalEndpointKey = buildCanonicalEndpointKey(
    node.nodeId,
    canonicalPortId,
    normalizedPath,
  )
  if (nodeDef === undefined) {
    return {
      exists: false,
      direction,
      nodeId: node.nodeId,
      portId: canonicalPortId,
      ...(normalizedPath === undefined ? {} : { path: normalizedPath }),
      pathKey: fallbackPathKey,
      canonicalEndpointKey,
      node,
      pathExists: false,
      pathIsLeaf: false,
      isFeatureVirtualInput:
        direction === 'in' && isFeatureVirtualInputPortId(canonicalPortId),
      isDriverVirtualInput:
        direction === 'in' && parseDriverVirtualInputPortId(canonicalPortId) !== null,
    }
  }

  const port =
    direction === 'out'
      ? resolveEffectiveOutputPort(node, canonicalPortId, nodeDef)
      : resolveEffectiveInputPort(node, canonicalPortId, nodeDef)
  if (port === undefined) {
    return {
      exists: false,
      direction,
      nodeId: node.nodeId,
      portId: canonicalPortId,
      ...(normalizedPath === undefined ? {} : { path: normalizedPath }),
      pathKey: fallbackPathKey,
      canonicalEndpointKey,
      node,
      nodeDef,
      pathExists: false,
      pathIsLeaf: false,
      isFeatureVirtualInput:
        direction === 'in' && isFeatureVirtualInputPortId(canonicalPortId),
      isDriverVirtualInput:
        direction === 'in' && parseDriverVirtualInputPortId(canonicalPortId) !== null,
    }
  }

  const fieldNode = getFieldNodeAtPath(getFieldTree(port.type), normalizedPath)
  return {
    exists: true,
    direction,
    nodeId: node.nodeId,
    portId: canonicalPortId,
    ...(normalizedPath === undefined ? {} : { path: normalizedPath }),
    pathKey: endpointPathKey(normalizedPath),
    canonicalEndpointKey,
    node,
    nodeDef,
    port,
    type: fieldNode?.type,
    optional: port.optional,
    maxConnectionsIn: port.maxConnectionsIn,
    pathExists: fieldNode !== undefined,
    pathIsLeaf: fieldNode?.kind === 'leaf',
    isFeatureVirtualInput:
      direction === 'in' && isFeatureVirtualInputPortId(canonicalPortId),
    isDriverVirtualInput:
      direction === 'in' && parseDriverVirtualInputPortId(canonicalPortId) !== null,
  }
}

const buildBaseDetails = (
  fromEndpoint: EdgeEndpoint,
  toEndpoint: EdgeEndpoint,
  fromResolved: ResolvedEndpoint,
  toResolved: ResolvedEndpoint,
): ConnectionContractDetails => ({
  fromNodeId: fromEndpoint.nodeId,
  toNodeId: toEndpoint.nodeId,
  fromPortId: fromEndpoint.portId,
  toPortId: toEndpoint.portId,
  fromCanonicalPortId: fromResolved.portId,
  toCanonicalPortId: toResolved.portId,
  fromPathKey: endpointPathKey(fromEndpoint.path),
  toPathKey: endpointPathKey(toEndpoint.path),
})

const fail = (
  code: Exclude<ConnectionContractCode, 'OK'>,
  details: ConnectionContractDetails,
): ConnectionContractResult => ({
  ok: false,
  code,
  details,
})

type ValidateConnectionContractOptions = {
  incrementalState?: ConnectionContractIncrementalState
}

export const validateConnectionContract = (
  graph: SpaghettiGraph,
  nodeRegistry: NodeRegistryLike,
  fromEndpoint: EdgeEndpoint,
  toEndpoint: EdgeEndpoint,
  opts?: ValidateConnectionContractOptions,
): ConnectionContractResult => {
  const fromResolved = resolveEndpoint(graph, nodeRegistry, fromEndpoint, 'out')
  const toResolved = resolveEndpoint(graph, nodeRegistry, toEndpoint, 'in')
  const baseDetails = buildBaseDetails(
    fromEndpoint,
    toEndpoint,
    fromResolved,
    toResolved,
  )

  if (fromResolved.node === undefined) {
    return fail('EDGE_FROM_NODE_MISSING', baseDetails)
  }
  if (toResolved.node === undefined) {
    return fail('EDGE_TO_NODE_MISSING', baseDetails)
  }
  if (fromResolved.nodeDef === undefined) {
    return fail('NODE_TYPE_UNKNOWN', {
      ...baseDetails,
      nodeType: fromResolved.node.type,
    })
  }
  if (toResolved.nodeDef === undefined) {
    return fail('NODE_TYPE_UNKNOWN', {
      ...baseDetails,
      nodeType: toResolved.node.type,
    })
  }
  if (fromResolved.port === undefined) {
    return fail('EDGE_FROM_PORT_MISSING', baseDetails)
  }
  if (toResolved.port === undefined) {
    return fail('EDGE_TO_PORT_MISSING', baseDetails)
  }

  if (toResolved.isFeatureVirtualInput && toResolved.path !== undefined) {
    return fail('FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED', baseDetails)
  }
  if (toResolved.isDriverVirtualInput && toResolved.path !== undefined) {
    return fail('DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED', baseDetails)
  }
  if (toResolved.isFeatureVirtualInput && fromResolved.nodeId === toResolved.nodeId) {
    return fail('FEATURE_WIRE_INTRA_NODE_UNSUPPORTED', baseDetails)
  }

  if (!fromResolved.pathExists) {
    return fail('EDGE_FROM_PATH_INVALID', baseDetails)
  }
  if (fromResolved.path !== undefined && !fromResolved.pathIsLeaf) {
    return fail('EDGE_FROM_PATH_NOT_LEAF', baseDetails)
  }
  if (!toResolved.pathExists) {
    return fail('EDGE_TO_PATH_INVALID', baseDetails)
  }
  if (toResolved.path !== undefined && !toResolved.pathIsLeaf) {
    return fail('EDGE_TO_PATH_NOT_LEAF', baseDetails)
  }
  if (
    fromResolved.type === undefined ||
    toResolved.type === undefined ||
    fromResolved.type.kind !== toResolved.type.kind ||
    fromResolved.type.unit !== toResolved.type.unit
  ) {
    return fail('EDGE_TYPE_MISMATCH', baseDetails)
  }

  const endpointKey = toResolved.canonicalEndpointKey
  const maxConnectionsIn = toResolved.maxConnectionsIn ?? 1

  if (opts?.incrementalState !== undefined) {
    if (toResolved.path !== undefined) {
      if (opts.incrementalState.seenLeafTargetByEndpointKey.has(endpointKey)) {
        return fail('EDGE_TO_PATH_DUPLICATE', {
          ...baseDetails,
          endpointKey,
          incomingCount: 2,
          maxConnectionsIn,
        })
      }
      opts.incrementalState.seenLeafTargetByEndpointKey.add(endpointKey)
    }

    const nextCount =
      (opts.incrementalState.incomingCountByEndpointKey.get(endpointKey) ?? 0) + 1
    opts.incrementalState.incomingCountByEndpointKey.set(endpointKey, nextCount)
    if (nextCount > maxConnectionsIn) {
      return fail('EDGE_TO_MAX_CONNECTIONS', {
        ...baseDetails,
        endpointKey,
        incomingCount: nextCount,
        maxConnectionsIn,
      })
    }
  } else {
    let incomingCount = 0
    for (const edge of graph.edges) {
      const currentKey = buildCanonicalEndpointKey(
        edge.to.nodeId,
        edge.to.portId,
        edge.to.path,
      )
      if (currentKey === endpointKey) {
        incomingCount += 1
      }
    }
    if (toResolved.path !== undefined && incomingCount > 1) {
      return fail('EDGE_TO_PATH_DUPLICATE', {
        ...baseDetails,
        endpointKey,
        incomingCount,
        maxConnectionsIn,
      })
    }
    if (incomingCount > maxConnectionsIn) {
      return fail('EDGE_TO_MAX_CONNECTIONS', {
        ...baseDetails,
        endpointKey,
        incomingCount,
        maxConnectionsIn,
      })
    }
  }

  return {
    ok: true,
    code: 'OK',
    details: {
      ...baseDetails,
      endpointKey,
      maxConnectionsIn,
    },
  }
}
