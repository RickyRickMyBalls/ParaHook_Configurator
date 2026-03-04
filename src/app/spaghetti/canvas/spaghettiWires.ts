import type { SpaghettiEdge } from '../schema/spaghettiTypes'
import type {
  BezierCurve,
  EdgeWaypointMap,
  Point2,
  PortAnchorMap,
  WireCrossing,
  WireGeometry,
} from './types'
import { buildPortAnchorKey } from './types'

const bezierMinControl = 48
const bezierMaxControl = 180
const intersectionEpsilon = 0.000001

const clampNumber = (min: number, max: number, value: number): number =>
  Math.min(max, Math.max(min, value))

const normalizeCurviness = (curviness: number): number =>
  clampNumber(0, 100, Number.isFinite(curviness) ? curviness : 25)

type TangentMode = 'auto' | 'out' | 'in'

const pointAtCubic = (curve: BezierCurve, t: number): Point2 => {
  const oneMinusT = 1 - t
  const oneMinusTSq = oneMinusT * oneMinusT
  const oneMinusTCube = oneMinusTSq * oneMinusT
  const tSq = t * t
  const tCube = tSq * t
  return {
    x:
      oneMinusTCube * curve.p0.x +
      3 * oneMinusTSq * t * curve.p1.x +
      3 * oneMinusT * tSq * curve.p2.x +
      tCube * curve.p3.x,
    y:
      oneMinusTCube * curve.p0.y +
      3 * oneMinusTSq * t * curve.p1.y +
      3 * oneMinusT * tSq * curve.p2.y +
      tCube * curve.p3.y,
  }
}

const normalizeVector = (vector: Point2): Point2 => {
  const length = Math.hypot(vector.x, vector.y)
  if (length <= intersectionEpsilon) {
    return { x: 1, y: 0 }
  }
  return {
    x: vector.x / length,
    y: vector.y / length,
  }
}

const scaleVector = (vector: Point2, scale: number): Point2 => ({
  x: vector.x * scale,
  y: vector.y * scale,
})

const addVector = (a: Point2, b: Point2): Point2 => ({
  x: a.x + b.x,
  y: a.y + b.y,
})

const subtractVector = (a: Point2, b: Point2): Point2 => ({
  x: a.x - b.x,
  y: a.y - b.y,
})

const chooseWaypointBaseTangent = (previous: Point2, current: Point2, next: Point2): Point2 => {
  const inDir = normalizeVector(subtractVector(current, previous))
  const outDir = normalizeVector(subtractVector(next, current))
  const sum = addVector(inDir, outDir)
  const sumLength = Math.hypot(sum.x, sum.y)
  if (sumLength <= intersectionEpsilon) {
    return outDir
  }
  return {
    x: sum.x / sumLength,
    y: sum.y / sumLength,
  }
}

const buildSegmentFromTangents = (
  from: Point2,
  to: Point2,
  startTangent: Point2,
  endTangent: Point2,
  curviness: number,
): BezierCurve => {
  const segmentLength = Math.hypot(to.x - from.x, to.y - from.y)
  const scale = normalizeCurviness(curviness) / 25
  const handleLength = segmentLength * 0.35 * scale
  const p1 = addVector(from, scaleVector(normalizeVector(startTangent), handleLength))
  const p2 = subtractVector(to, scaleVector(normalizeVector(endTangent), handleLength))
  const curve: BezierCurve = {
    p0: from,
    p1,
    p2,
    p3: to,
    d: '',
    lengthPx: 0,
  }
  curve.d = `M ${curve.p0.x} ${curve.p0.y} C ${curve.p1.x} ${curve.p1.y}, ${curve.p2.x} ${curve.p2.y}, ${curve.p3.x} ${curve.p3.y}`
  curve.lengthPx = approximateBezierLength(curve)
  return curve
}

export const getBezierPath = (
  from: Point2,
  to: Point2,
  curviness = 25,
  options?: {
    startMode?: TangentMode
    endMode?: TangentMode
  },
): BezierCurve => {
  const dx = to.x - from.x
  const sign = dx >= 0 ? 1 : -1
  const baseControl = clampNumber(
    bezierMinControl,
    bezierMaxControl,
    bezierMinControl + Math.abs(dx) * 0.4,
  )
  const normalizedCurviness = normalizeCurviness(curviness)
  // 25 matches the legacy baseline. 0 is linear and 100 is exaggerated.
  const controlScale = normalizedCurviness / 25
  const control = baseControl * controlScale
  const startMode = options?.startMode ?? 'auto'
  const endMode = options?.endMode ?? 'auto'

  const startSign = startMode === 'auto' ? sign : 1
  // End sign determines the side where p2 sits relative to target.
  // `in` forces p2 to target-left so derivative at t=1 points rightward
  // and arrives tangentially at the input side of a node.
  const endSign = endMode === 'auto' ? sign : 1

  const curve: BezierCurve = {
    p0: from,
    p1: { x: from.x + control * startSign, y: from.y },
    p2: { x: to.x - control * endSign, y: to.y },
    p3: to,
    d: '',
    lengthPx: 0,
  }

  curve.d = `M ${curve.p0.x} ${curve.p0.y} C ${curve.p1.x} ${curve.p1.y}, ${curve.p2.x} ${curve.p2.y}, ${curve.p3.x} ${curve.p3.y}`
  curve.lengthPx = approximateBezierLength(curve)
  return curve
}

export const approximateBezierLength = (curve: BezierCurve): number => {
  let length = 0
  let previous = curve.p0
  const steps = 20
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps
    const current = pointAtCubic(curve, t)
    length += Math.hypot(current.x - previous.x, current.y - previous.y)
    previous = current
  }
  return length
}

export const sampleBezierToPolyline = (curve: BezierCurve): Point2[] => {
  const steps = clampNumber(12, 48, Math.ceil(curve.lengthPx / 30))
  const points: Point2[] = []
  for (let i = 0; i <= steps; i += 1) {
    points.push(pointAtCubic(curve, i / steps))
  }
  return points
}

type SegmentIntersection = {
  point: Point2
  segAIndex: number
  segBIndex: number
  uA: number
  uB: number
}

const segmentIntersection = (
  a1: Point2,
  a2: Point2,
  b1: Point2,
  b2: Point2,
): SegmentIntersection | null => {
  const denominator =
    (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x)

  if (Math.abs(denominator) <= intersectionEpsilon) {
    return null
  }

  const numeratorA =
    (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)
  const numeratorB =
    (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)
  const uA = numeratorA / denominator
  const uB = numeratorB / denominator

  if (uA <= 0.001 || uA >= 0.999 || uB <= 0.001 || uB >= 0.999) {
    return null
  }

  return {
    point: {
      x: a1.x + uA * (a2.x - a1.x),
      y: a1.y + uA * (a2.y - a1.y),
    },
    segAIndex: -1,
    segBIndex: -1,
    uA,
    uB,
  }
}

export const segmentIntersections = (
  polylineA: Point2[],
  polylineB: Point2[],
): SegmentIntersection[] => {
  const intersections: SegmentIntersection[] = []
  for (let aIndex = 0; aIndex < polylineA.length - 1; aIndex += 1) {
    const a1 = polylineA[aIndex]
    const a2 = polylineA[aIndex + 1]
    for (let bIndex = 0; bIndex < polylineB.length - 1; bIndex += 1) {
      const b1 = polylineB[bIndex]
      const b2 = polylineB[bIndex + 1]
      const intersection = segmentIntersection(a1, a2, b1, b2)
      if (intersection === null) {
        continue
      }
      intersections.push({
        ...intersection,
        segAIndex: aIndex,
        segBIndex: bIndex,
      })
    }
  }
  return intersections
}

export const buildWireGeometries = (
  edges: SpaghettiEdge[],
  portAnchors: PortAnchorMap,
  edgeWaypoints: EdgeWaypointMap = {},
  curviness = 25,
): WireGeometry[] => {
  const sortedEdges = [...edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))
  const geometries: WireGeometry[] = []

  for (const edge of sortedEdges) {
    const fromKey = buildPortAnchorKey(
      edge.from.nodeId,
      'out',
      edge.from.portId,
      edge.from.path,
    )
    const toKey = buildPortAnchorKey(edge.to.nodeId, 'in', edge.to.portId, edge.to.path)
    const from = portAnchors[fromKey]
    const to = portAnchors[toKey]
    if (from === undefined || to === undefined) {
      continue
    }
    const waypoints = (edgeWaypoints[edge.edgeId] ?? []).filter(
      (waypoint) => Number.isFinite(waypoint.x) && Number.isFinite(waypoint.y),
    )
    if (waypoints.length === 0) {
      const bezier = getBezierPath(
        { x: from.x, y: from.y },
        { x: to.x, y: to.y },
        curviness,
        {
          startMode: 'out',
          endMode: 'in',
        },
      )
      geometries.push({
        edge,
        from,
        to,
        bezier,
        polyline: sampleBezierToPolyline(bezier),
      })
      continue
    }

    const chain: Point2[] = [
      { x: from.x, y: from.y },
      ...waypoints.map((waypoint) => ({ x: waypoint.x, y: waypoint.y })),
      { x: to.x, y: to.y },
    ]
    const segmentCount = chain.length - 1
    const baseWaypointTangents: Point2[] = waypoints.map((_, index) =>
      chooseWaypointBaseTangent(chain[index], chain[index + 1], chain[index + 2]),
    )
    const segments: BezierCurve[] = []
    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex += 1) {
      const startTangent =
        segmentIndex === 0
          ? { x: 1, y: 0 }
          : (() => {
              const waypoint = waypoints[segmentIndex - 1]
              const base = baseWaypointTangents[segmentIndex - 1]
              const sign = waypoint?.flipSide2 === true ? -1 : 1
              return scaleVector(base, sign)
            })()
      const endTangent =
        segmentIndex === segmentCount - 1
          ? { x: 1, y: 0 }
          : (() => {
              const waypoint = waypoints[segmentIndex]
              const base = baseWaypointTangents[segmentIndex]
              const sign = waypoint?.flipSide1 === true ? -1 : 1
              return scaleVector(base, sign)
            })()
      segments.push(
        buildSegmentFromTangents(
          chain[segmentIndex],
          chain[segmentIndex + 1],
          startTangent,
          endTangent,
          curviness,
        ),
      )
    }
    const bezier = segments[0]
    bezier.d =
      `M ${segments[0].p0.x} ${segments[0].p0.y} ` +
      segments
        .map(
          (segment) =>
            `C ${segment.p1.x} ${segment.p1.y}, ${segment.p2.x} ${segment.p2.y}, ${segment.p3.x} ${segment.p3.y}`,
        )
        .join(' ')
    bezier.lengthPx = segments.reduce((acc, segment) => acc + segment.lengthPx, 0)
    const polyline = segments.flatMap((segment, index) => {
      const sampled = sampleBezierToPolyline(segment)
      return index === 0 ? sampled : sampled.slice(1)
    })
    geometries.push({
      edge,
      from,
      to,
      bezier,
      polyline,
    })
  }

  return geometries
}

const resolveOverEdgeId = (
  edgeAId: string,
  edgeBId: string,
  selectedEdgeId: string | null,
  hoveredEdgeId: string | null,
): string => {
  if (selectedEdgeId === edgeAId && selectedEdgeId !== edgeBId) {
    return edgeAId
  }
  if (selectedEdgeId === edgeBId && selectedEdgeId !== edgeAId) {
    return edgeBId
  }
  if (hoveredEdgeId === edgeAId && hoveredEdgeId !== edgeBId) {
    return edgeAId
  }
  if (hoveredEdgeId === edgeBId && hoveredEdgeId !== edgeAId) {
    return edgeBId
  }
  return edgeAId.localeCompare(edgeBId) <= 0 ? edgeAId : edgeBId
}

export const buildWireCrossings = (
  geometries: WireGeometry[],
  selectedEdgeId: string | null,
  hoveredEdgeId: string | null,
): WireCrossing[] => {
  const sorted = [...geometries].sort((a, b) => a.edge.edgeId.localeCompare(b.edge.edgeId))
  const crossings: WireCrossing[] = []

  for (let i = 0; i < sorted.length; i += 1) {
    const edgeA = sorted[i]
    for (let j = i + 1; j < sorted.length; j += 1) {
      const edgeB = sorted[j]

      const intersections = segmentIntersections(edgeA.polyline, edgeB.polyline)
      for (const intersection of intersections) {
          const aIndex = intersection.segAIndex
          const bIndex = intersection.segBIndex
          const a1 = edgeA.polyline[aIndex]
          const a2 = edgeA.polyline[aIndex + 1]
          const b1 = edgeB.polyline[bIndex]
          const b2 = edgeB.polyline[bIndex + 1]

          const overEdgeId = resolveOverEdgeId(
            edgeA.edge.edgeId,
            edgeB.edge.edgeId,
            selectedEdgeId,
            hoveredEdgeId,
          )
          const underEdgeId =
            overEdgeId === edgeA.edge.edgeId ? edgeB.edge.edgeId : edgeA.edge.edgeId
          const tangentSource =
            overEdgeId === edgeA.edge.edgeId
              ? { x: a2.x - a1.x, y: a2.y - a1.y }
              : { x: b2.x - b1.x, y: b2.y - b1.y }

          crossings.push({
            crossingId: `${edgeA.edge.edgeId}|${aIndex}|${edgeB.edge.edgeId}|${bIndex}`,
            overEdgeId,
            underEdgeId,
            point: { x: intersection.point.x, y: intersection.point.y },
            tangent: normalizeVector(tangentSource),
          })
      }
    }
  }

  return crossings.sort((a, b) => a.crossingId.localeCompare(b.crossingId))
}

export const getCrossingGapPath = (crossing: WireCrossing, radius = 9): string => {
  const start = {
    x: crossing.point.x - crossing.tangent.x * radius,
    y: crossing.point.y - crossing.tangent.y * radius,
  }
  const end = {
    x: crossing.point.x + crossing.tangent.x * radius,
    y: crossing.point.y + crossing.tangent.y * radius,
  }
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
}

export const getCrossingLoopPath = (
  crossing: WireCrossing,
  radius = 9,
  lift = 8,
): string => {
  const tangent = normalizeVector(crossing.tangent)
  const normal = { x: -tangent.y, y: tangent.x }
  const start = {
    x: crossing.point.x - tangent.x * radius,
    y: crossing.point.y - tangent.y * radius,
  }
  const end = {
    x: crossing.point.x + tangent.x * radius,
    y: crossing.point.y + tangent.y * radius,
  }
  const control = {
    x: crossing.point.x + normal.x * lift,
    y: crossing.point.y + normal.y * lift,
  }
  return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`
}
