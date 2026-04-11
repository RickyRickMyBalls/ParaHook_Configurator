import type { EdgeEndpoint, SpaghettiGraph } from '../schema/spaghettiTypes'
import {
  listSketchProfileMemberOutputPorts,
  parseSketchProfileMemberPortId,
} from './sketchProfileVirtualPorts'

export type ExtrudeProfileContributor = {
  kind: 'aggregate' | 'single'
  label: 'SketchProfiles' | 'SketchProfile'
  profileId?: string
}

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const normalizeEndpointPath = (endpoint: EdgeEndpoint): EdgeEndpoint => {
  const path = normalizePath(endpoint.path)
  return path === undefined
    ? {
        nodeId: endpoint.nodeId,
        portId: endpoint.portId,
      }
    : {
        nodeId: endpoint.nodeId,
        portId: endpoint.portId,
        path,
      }
}

export const isWholeExtrusionProfileTargetEndpoint = (
  endpoint: Pick<EdgeEndpoint, 'portId' | 'path'>,
): boolean => endpoint.portId === 'ExtrusionProfile' && normalizePath(endpoint.path) === undefined

export const classifyExtrudeProfileContributorPortId = (
  portId: string,
): ExtrudeProfileContributor | null => {
  if (portId === 'SketchProfiles') {
    return {
      kind: 'aggregate',
      label: 'SketchProfiles',
    }
  }
  if (portId === 'SketchProfile') {
    return {
      kind: 'single',
      label: 'SketchProfile',
    }
  }
  const parsedMember = parseSketchProfileMemberPortId(portId)
  if (parsedMember !== null) {
    return {
      kind: 'single',
      label: 'SketchProfile',
      profileId: parsedMember.profileId,
    }
  }
  return null
}

export const classifyExtrudeProfileContributorEdge = (edge: {
  from: Pick<EdgeEndpoint, 'portId'>
  to: Pick<EdgeEndpoint, 'portId' | 'path'>
}): ExtrudeProfileContributor | null => {
  if (!isWholeExtrusionProfileTargetEndpoint(edge.to)) {
    return null
  }
  return classifyExtrudeProfileContributorPortId(edge.from.portId)
}

export const normalizeExtrudeProfileConnectionEndpoints = (params: {
  from: EdgeEndpoint
  to: EdgeEndpoint
}): { from: EdgeEndpoint; to: EdgeEndpoint } => {
  const normalizedFrom = normalizeEndpointPath(params.from)
  const normalizedTo = normalizeEndpointPath(params.to)
  if (
    normalizedFrom.portId === 'SketchProfiles' &&
    isWholeExtrusionProfileTargetEndpoint(normalizedTo)
  ) {
    return {
      from: {
        nodeId: normalizedFrom.nodeId,
        portId: normalizedFrom.portId,
      },
      to: normalizedTo,
    }
  }
  return {
    from: normalizedFrom,
    to: normalizedTo,
  }
}

export const getExtrudeProfileSourcePath = (edge: {
  from: Pick<EdgeEndpoint, 'portId' | 'path'>
  to: Pick<EdgeEndpoint, 'portId' | 'path'>
}): string[] | undefined =>
  edge.from.portId === 'SketchProfiles' && isWholeExtrusionProfileTargetEndpoint(edge.to)
    ? undefined
    : normalizePath(edge.from.path)

export const countProfilesForExtrudeContributorEdge = (
  graph: SpaghettiGraph,
  edge: SpaghettiGraph['edges'][number],
): number => {
  const contributor = classifyExtrudeProfileContributorEdge(edge)
  if (contributor === null) {
    return 0
  }
  if (contributor.kind === 'single') {
    return 1
  }
  const sourceNode = graph.nodes.find((candidate) => candidate.nodeId === edge.from.nodeId)
  if (sourceNode === undefined) {
    return 0
  }
  return listSketchProfileMemberOutputPorts(sourceNode).length
}
