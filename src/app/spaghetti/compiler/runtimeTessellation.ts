import type { Segment2 } from '../features/featureTypes'

type Point2 = { x: number; y: number }

export const CANON_DECIMALS = 6
export const CURVE_TESSELLATION_BEZIER_STEPS = 24
export const CURVE_TESSELLATION_ARC_STEPS = 24
export const EPSILON = 1e-6
export const EPSILON2 = EPSILON * EPSILON

const CANON_SCALE = 10 ** CANON_DECIMALS

const round6 = (value: number): number => Math.round(value * CANON_SCALE) / CANON_SCALE

const canonPoint = (point: Point2): Point2 => ({
  x: round6(point.x),
  y: round6(point.y),
})

const pointEq = (a: Point2, b: Point2): boolean => a.x === b.x && a.y === b.y

const dist2 = (a: Point2, b: Point2): number => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return dx * dx + dy * dy
}

const toSegmentStart = (segment: Segment2): Point2 => {
  if (segment.kind === 'line2') return segment.a
  if (segment.kind === 'bezier2') return segment.p0
  return segment.start
}

const sampleBezier = (
  p0: Point2,
  p1: Point2,
  p2: Point2,
  p3: Point2,
  steps: number,
): Point2[] => {
  const out: Point2[] = []
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps
    const u = 1 - t
    const b0 = u * u * u
    const b1 = 3 * u * u * t
    const b2 = 3 * u * t * t
    const b3 = t * t * t
    out.push({
      x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
      y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
    })
  }
  return out
}

const sampleArc3pt = (
  start: Point2,
  mid: Point2,
  end: Point2,
  steps: number,
): Point2[] => {
  const ax = start.x
  const ay = start.y
  const bx = mid.x
  const by = mid.y
  const cx = end.x
  const cy = end.y
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
  if (Math.abs(d) < 1e-9) {
    const out: Point2[] = []
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps
      out.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      })
    }
    return out
  }
  const a2 = ax * ax + ay * ay
  const b2 = bx * bx + by * by
  const c2 = cx * cx + cy * cy
  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d
  const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d
  const r = Math.hypot(start.x - ux, start.y - uy)
  const angle = (p: Point2): number => Math.atan2(p.y - uy, p.x - ux)
  let a0 = angle(start)
  let am = angle(mid)
  let a1 = angle(end)
  while (am - a0 > Math.PI) am -= 2 * Math.PI
  while (am - a0 < -Math.PI) am += 2 * Math.PI
  while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI
  while (a1 - a0 < -Math.PI) a1 += 2 * Math.PI
  const between = (x: number, lo: number, hi: number): boolean =>
    lo <= hi ? x >= lo - 1e-8 && x <= hi + 1e-8 : x <= lo + 1e-8 && x >= hi - 1e-8
  if (!between(am, a0, a1)) {
    a1 += a1 >= a0 ? -2 * Math.PI : 2 * Math.PI
  }
  const out: Point2[] = []
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps
    const a = a0 + (a1 - a0) * t
    out.push({
      x: ux + Math.cos(a) * r,
      y: uy + Math.sin(a) * r,
    })
  }
  return out
}

const appendWithCanonicalEpsilon = (vertices: Point2[], next: Point2): void => {
  const candidate = canonPoint(next)
  const prev = vertices[vertices.length - 1]
  if (prev === undefined) {
    vertices.push(candidate)
    return
  }
  if (dist2(prev, candidate) <= EPSILON2) {
    return
  }
  vertices.push(candidate)
}

const isExplicitlyClosed = (vertices: readonly Point2[]): boolean =>
  vertices.length > 1 && pointEq(vertices[0], vertices[vertices.length - 1])

const openRing = (vertices: readonly Point2[]): Point2[] =>
  isExplicitlyClosed(vertices) ? [...vertices.slice(0, -1)] : [...vertices]

const snapClosureWithinEpsilon = (vertices: Point2[]): Point2[] => {
  if (vertices.length < 2) return vertices
  const first = vertices[0]
  const lastIndex = vertices.length - 1
  const last = vertices[lastIndex]
  if (dist2(first, last) <= EPSILON2) {
    vertices[lastIndex] = first
  }
  while (
    vertices.length > 2 &&
    pointEq(vertices[vertices.length - 1], first) &&
    pointEq(vertices[vertices.length - 2], first)
  ) {
    vertices.pop()
  }
  return vertices
}

export const signedAreaOpenLoop = (vertices: readonly Point2[]): number => {
  const ring = openRing(vertices)
  if (ring.length < 3) return 0
  let sum = 0
  for (let index = 0; index < ring.length - 1; index += 1) {
    const current = ring[index]
    const next = ring[index + 1]
    sum += current.x * next.y - next.x * current.y
  }
  const last = ring[ring.length - 1]
  const first = ring[0]
  sum += last.x * first.y - first.x * last.y
  return sum * 0.5
}

const normalizeCounterClockwise = (vertices: Point2[]): Point2[] => {
  if (signedAreaOpenLoop(vertices) >= 0) return vertices
  const ring = openRing(vertices)
  if (ring.length === 0) return vertices
  const reversed = [ring[0], ...ring.slice(1).reverse()]
  if (isExplicitlyClosed(vertices)) {
    reversed.push(reversed[0])
  }
  return reversed
}

export const tessellateProfileLoop = (segments: Segment2[]): Point2[] => {
  if (segments.length === 0) return []
  const vertices: Point2[] = []
  appendWithCanonicalEpsilon(vertices, toSegmentStart(segments[0]))

  for (const segment of segments) {
    if (segment.kind === 'line2') {
      appendWithCanonicalEpsilon(vertices, segment.b)
      continue
    }
    if (segment.kind === 'bezier2') {
      for (const point of sampleBezier(
        segment.p0,
        segment.p1,
        segment.p2,
        segment.p3,
        CURVE_TESSELLATION_BEZIER_STEPS,
      )) {
        appendWithCanonicalEpsilon(vertices, point)
      }
      continue
    }
    for (const point of sampleArc3pt(
      segment.start,
      segment.mid,
      segment.end,
      CURVE_TESSELLATION_ARC_STEPS,
    )) {
      appendWithCanonicalEpsilon(vertices, point)
    }
  }

  const closureSnapped = snapClosureWithinEpsilon(vertices)
  const ccw = normalizeCounterClockwise(closureSnapped)
  const reclosed = snapClosureWithinEpsilon(ccw)
  return reclosed
}
