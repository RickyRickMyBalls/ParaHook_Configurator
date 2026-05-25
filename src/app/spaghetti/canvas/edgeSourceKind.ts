import { getNodeDef } from '../registry/nodeRegistry'
import type {
  PortKind,
  PortSpec,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'
import {
  resolveEffectiveInputPort,
  resolveEffectiveOutputPort,
} from '../features/effectivePorts'
import { getFieldNodeAtPath, getFieldTree } from '../types/fieldTree'
import type { PortDirection } from './types'
import { classifyExtrudeProfileContributorEdge } from '../features/extrudeProfileConnections'

type EndpointPayload = {
  nodeId: string
  portId: string
  path?: string[]
}

export const resolveCanvasEndpointKind = (
  graph: SpaghettiGraph,
  endpoint: EndpointPayload,
  direction: PortDirection,
): PortSpec['type']['kind'] | null => {
  const node = graph.nodes.find((candidate) => candidate.nodeId === endpoint.nodeId)
  if (node === undefined) {
    return null
  }
  const nodeDef = getNodeDef(node.type)
  if (nodeDef === undefined) {
    return null
  }
  const port =
    direction === 'out'
      ? resolveEffectiveOutputPort(node, endpoint.portId, nodeDef)
      : resolveEffectiveInputPort(node, endpoint.portId, nodeDef)
  if (port === undefined) {
    return null
  }
  const fieldNode = getFieldNodeAtPath(getFieldTree(port.type), endpoint.path)
  if (fieldNode?.kind === 'leaf') {
    return fieldNode.type.kind
  }
  return port.type.kind
}

export const resolveCanvasEdgeSourceKind = (
  graph: SpaghettiGraph,
  edge: SpaghettiGraph['edges'][number],
): PortKind | null => {
  const extrudeContributor = classifyExtrudeProfileContributorEdge(edge)
  if (extrudeContributor?.kind === 'aggregate') {
    return 'sketchProfiles'
  }
  if (extrudeContributor?.kind === 'single') {
    return 'sketchProfile'
  }
  return resolveCanvasEndpointKind(graph, edge.from, 'out')
}

export const resolveCanvasNodeOutputKind = (
  graph: SpaghettiGraph,
  node: SpaghettiNode,
  portId: string,
): PortKind | null =>
  resolveCanvasEndpointKind(graph, { nodeId: node.nodeId, portId }, 'out')
