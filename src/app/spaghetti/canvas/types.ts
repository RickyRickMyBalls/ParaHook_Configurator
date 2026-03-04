import type { SpaghettiEdge } from '../schema/spaghettiTypes'

export type Point2 = {
  x: number
  y: number
}

export type PortDirection = 'in' | 'out'

export type PortAnchorKey = `${string}::${PortDirection}::${string}::${string}`

export type PortAnchor = {
  key: string
  nodeId: string
  portId: string
  path?: string[]
  direction: PortDirection
  x: number
  y: number
}

export type PortAnchorMap = Record<string, PortAnchor>

export type EdgeWaypoint = {
  waypointId: string
  x: number
  y: number
  flipSide1: boolean
  flipSide2: boolean
}

export type EdgeWaypointMap = Record<string, EdgeWaypoint[]>

export type ConnectionValidationResult = {
  ok: boolean
  reason?: string
}

export type BezierCurve = {
  p0: Point2
  p1: Point2
  p2: Point2
  p3: Point2
  d: string
  lengthPx: number
}

export type WireGeometry = {
  edge: SpaghettiEdge
  from: PortAnchor
  to: PortAnchor
  bezier: BezierCurve
  polyline: Point2[]
}

export type WireCrossing = {
  crossingId: string
  overEdgeId: string
  underEdgeId: string
  point: Point2
  tangent: Point2
}

export const buildPortAnchorKey = (
  nodeId: string,
  direction: PortDirection,
  portId: string,
  path?: string[],
): PortAnchorKey => {
  const pathToken =
    path === undefined || path.length === 0
      ? ''
      : path.map((segment) => encodeURIComponent(segment)).join('/')
  return `${nodeId}::${direction}::${portId}::${pathToken}`
}

export const parsePortAnchorKey = (
  key: string,
): { nodeId: string; direction: PortDirection; portId: string; path?: string[] } | null => {
  const [nodeId, directionRaw, portId, pathToken] = key.split('::')
  if (
    nodeId === undefined ||
    directionRaw === undefined ||
    portId === undefined ||
    pathToken === undefined ||
    (directionRaw !== 'in' && directionRaw !== 'out')
  ) {
    return null
  }
  const decodedPath =
    pathToken.length === 0
      ? undefined
      : pathToken
          .split('/')
          .filter((segment) => segment.length > 0)
          .map((segment) => decodeURIComponent(segment))
  return {
    nodeId,
    direction: directionRaw,
    portId,
    ...(decodedPath === undefined || decodedPath.length === 0
      ? {}
      : { path: decodedPath }),
  }
}
