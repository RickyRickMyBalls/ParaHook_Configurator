import type { PortSpec, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import {
  countProfilesForExtrudeContributorEdge,
  isWholeExtrusionProfileTargetEndpoint,
} from './extrudeProfileConnections'
import { readGeometryExtrudeBodyGenerationModeFromParams } from '../registry/nodeRegistry'
import { parseSketchProfileMemberPortId } from './sketchProfileVirtualPorts'

const EXTRUDE_BODY_MEMBER_PORT_PREFIX = 'SolidBody:'

const formatMemberIndex = (memberIndex: number): string =>
  `${memberIndex + 1}`.padStart(3, '0')

export const buildExtrudeBodyMemberPortId = (memberIndex: number): string =>
  `${EXTRUDE_BODY_MEMBER_PORT_PREFIX}${formatMemberIndex(memberIndex)}`

export const parseExtrudeBodyMemberPortId = (
  portId: string,
): { memberIndex: number } | null => {
  if (!portId.startsWith(EXTRUDE_BODY_MEMBER_PORT_PREFIX)) {
    return null
  }
  const suffix = portId.slice(EXTRUDE_BODY_MEMBER_PORT_PREFIX.length)
  if (!/^\d+$/.test(suffix)) {
    return null
  }
  const parsed = Number.parseInt(suffix, 10)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }
  return { memberIndex: parsed - 1 }
}

const listWholeIncomingProfileEdges = (
  graph: SpaghettiGraph,
  nodeId: string,
): SpaghettiGraph['edges'][number][] =>
  graph.edges.filter(
    (edge) =>
      edge.to.nodeId === nodeId &&
      isWholeExtrusionProfileTargetEndpoint(edge.to),
  )

const countResolvedExtrudeBodyMembersFromGraph = (
  graph: SpaghettiGraph,
  node: SpaghettiNode,
): number => {
  if (node.type !== 'Geometry/Extrude') {
    return 0
  }
  if (readGeometryExtrudeBodyGenerationModeFromParams(node.params) !== 'NewObjects') {
    return 0
  }
  let count = 0
  for (const edge of listWholeIncomingProfileEdges(graph, node.nodeId)) {
    if (
      edge.from.portId === 'SketchProfile' ||
      parseSketchProfileMemberPortId(edge.from.portId) !== null
    ) {
      count += 1
      continue
    }
    count += countProfilesForExtrudeContributorEdge(graph, edge)
  }
  return count
}

export const listExtrudeBodyMemberOutputPorts = (
  graph: SpaghettiGraph | undefined,
  node: SpaghettiNode,
): PortSpec[] => {
  if (graph === undefined) {
    return []
  }
  const memberCount = countResolvedExtrudeBodyMembersFromGraph(graph, node)
  return Array.from({ length: memberCount }, (_, memberIndex) => ({
    portId: buildExtrudeBodyMemberPortId(memberIndex),
    label: 'SolidBody',
    type: { kind: 'solidBody' },
  }))
}

export const getExtrudeBodyMemberOutputValue = (
  collectionValue: unknown,
  portId: string,
): unknown => {
  const parsed = parseExtrudeBodyMemberPortId(portId)
  if (parsed === null) {
    return undefined
  }
  if (
    typeof collectionValue !== 'object' ||
    collectionValue === null ||
    !Array.isArray((collectionValue as { bodies?: unknown[] }).bodies)
  ) {
    return undefined
  }
  return (collectionValue as { bodies: unknown[] }).bodies[parsed.memberIndex]
}
