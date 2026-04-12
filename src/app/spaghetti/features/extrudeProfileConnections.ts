import type { EdgeEndpoint, SpaghettiGraph } from '../schema/spaghettiTypes'
import { parseExtrudeProfileEntryPortId } from './extrudeProfileEntryPorts'
import {
  listSketchProfileMemberOutputPorts,
  parseSketchProfileMemberPortId,
} from './sketchProfileVirtualPorts'

export type ExtrudeProfileContributor = {
  kind: 'aggregate' | 'single'
  label: 'SketchProfiles' | 'SketchProfile'
  profileId?: string
}

export type ProfileOutputLike = {
  profileId: string
  profileIndex: number
  area: number
}

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export const isProfileOutputLike = (value: unknown): value is ProfileOutputLike =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { profileId?: unknown }).profileId === 'string' &&
  ((value as { profileId: string }).profileId.length > 0) &&
  isFiniteNumber((value as { profileIndex?: unknown }).profileIndex) &&
  isFiniteNumber((value as { area?: unknown }).area)

export const isSketchProfilesValue = (
  value: unknown,
): value is ProfileOutputLike[] => Array.isArray(value) && value.every((entry) => isProfileOutputLike(entry))

const isExtrusionProfileTargetPortId = (portId: string): boolean =>
  portId === 'ExtrusionProfile' ||
  portId === 'SketchProfiles' ||
  parseExtrudeProfileEntryPortId(portId) !== null

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

const normalizeExtrudeProfileTargetEndpoint = (endpoint: EdgeEndpoint): EdgeEndpoint => {
  if (!isExtrusionProfileTargetPortId(endpoint.portId)) {
    return normalizeEndpointPath(endpoint)
  }
  return {
    nodeId: endpoint.nodeId,
    portId: 'ExtrusionProfile',
  }
}

export const isWholeExtrusionProfileTargetEndpoint = (
  endpoint: Pick<EdgeEndpoint, 'portId' | 'path'>,
): boolean =>
  normalizeExtrudeProfileTargetEndpoint({
    nodeId: '__target__',
    portId: endpoint.portId,
    path: endpoint.path,
  }).portId === 'ExtrusionProfile'

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
  const normalizedTo = normalizeExtrudeProfileTargetEndpoint(params.to)
  if (classifyExtrudeProfileContributorPortId(normalizedFrom.portId) !== null && isWholeExtrusionProfileTargetEndpoint(normalizedTo)) {
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
  classifyExtrudeProfileContributorPortId(edge.from.portId) !== null &&
  isWholeExtrusionProfileTargetEndpoint(edge.to)
    ? undefined
    : normalizePath(edge.from.path)

const normalizeExtrudeProfileContributorValue = (value: unknown): ProfileOutputLike[] | null => {
  if (isProfileOutputLike(value)) {
    return [value]
  }
  if (isSketchProfilesValue(value)) {
    return value
  }
  return null
}

export const flattenExtrudeProfileContributorValues = (
  values: readonly unknown[],
): ProfileOutputLike[] | null => {
  const flattened: ProfileOutputLike[] = []
  for (const value of values) {
    const normalizedValue = normalizeExtrudeProfileContributorValue(value)
    if (normalizedValue === null) {
      return null
    }
    flattened.push(...normalizedValue)
  }
  return flattened
}

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
