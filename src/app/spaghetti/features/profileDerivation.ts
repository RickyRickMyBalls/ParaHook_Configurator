import type {
  ProfileOutput,
  Segment2,
  SketchComponent,
  SketchDerivationDiagnostic,
  SketchEntity,
} from './featureTypes'

type Point2 = { x: number; y: number }

type DeriveProfilesResult = {
  profiles: ProfileOutput[]
  diagnostics: SketchDerivationDiagnostic[]
}

const CANON_PRECISION = 6
const CANON_SCALE = 10 ** CANON_PRECISION

const canonNumber = (value: number): number =>
  Math.round(value * CANON_SCALE) / CANON_SCALE

const canonPoint = (point: Point2): Point2 => ({
  x: canonNumber(point.x),
  y: canonNumber(point.y),
})

const pointKeyFromPoint = (point: Point2): string => `${String(point.x)}|${String(point.y)}`

const pointsEqual = (a: Point2, b: Point2): boolean =>
  pointKeyFromPoint(canonPoint(a)) === pointKeyFromPoint(canonPoint(b))

const signedShoelaceArea = (vertices: readonly Point2[]): number => {
  if (vertices.length < 3) {
    return 0
  }
  let sum = 0
  for (let index = 0; index < vertices.length; index += 1) {
    const current = vertices[index]
    const next = vertices[(index + 1) % vertices.length]
    sum += current.x * next.y - next.x * current.y
  }
  return sum * 0.5
}

const pushUnique = (points: Point2[], next: Point2): void => {
  const candidate = canonPoint(next)
  if (points.length === 0) {
    points.push(candidate)
    return
  }
  const prev = points[points.length - 1]
  if (pointKeyFromPoint(prev) !== pointKeyFromPoint(candidate)) {
    points.push(candidate)
  }
}

const midBezierAt05 = (p0: Point2, p1: Point2, p2: Point2, p3: Point2): Point2 => {
  // Deterministic midpoint proxy only for orientation/area math.
  const t = 0.5
  const u = 1 - t
  const b0 = u * u * u
  const b1 = 3 * u * u * t
  const b2 = 3 * u * t * t
  const b3 = t * t * t
  return {
    x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
  }
}

const toSegmentStart = (segment: Segment2): Point2 => {
  if (segment.kind === 'line2') return segment.a
  if (segment.kind === 'bezier2') return segment.p0
  return segment.start
}

const toSegmentEnd = (segment: Segment2): Point2 => {
  if (segment.kind === 'line2') return segment.b
  if (segment.kind === 'bezier2') return segment.p3
  return segment.end
}

const resolveSketchComponentToSegment = (component: SketchComponent): Segment2 => {
  if (component.type === 'line') {
    return {
      kind: 'line2',
      a: canonPoint(component.a),
      b: canonPoint(component.b),
    }
  }
  if (component.type === 'spline') {
    return {
      kind: 'bezier2',
      p0: canonPoint(component.p0),
      p1: canonPoint(component.p1),
      p2: canonPoint(component.p2),
      p3: canonPoint(component.p3),
    }
  }
  return {
    kind: 'arc3pt2',
    start: canonPoint(component.start),
    mid: canonPoint(component.mid),
    end: canonPoint(component.end),
  }
}

const normalizeLegacyEntities = (entities: readonly SketchEntity[]): SketchComponent[] =>
  entities.map((entity) => ({
    rowId: `legacy-row-${entity.entityId}`,
    componentId: entity.entityId,
    type: 'line',
    a: entity.start,
    b: entity.end,
  }))

export const hashFnv1a32 = (str: string): number => {
  const bytes = new TextEncoder().encode(str)
  let hash = 0x811c9dc5
  for (const byte of bytes) {
    hash ^= byte
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash >>> 0
}

export const profileIdFromSignature = (sig: string): string =>
  `prof_${hashFnv1a32(sig).toString(36)}`

const buildProxyVertices = (segments: readonly Segment2[]): Point2[] => {
  const out: Point2[] = []
  if (segments.length === 0) return out
  pushUnique(out, toSegmentStart(segments[0]))
  for (const segment of segments) {
    if (segment.kind === 'bezier2') {
      pushUnique(out, midBezierAt05(segment.p0, segment.p1, segment.p2, segment.p3))
      pushUnique(out, segment.p3)
      continue
    }
    if (segment.kind === 'arc3pt2') {
      pushUnique(out, segment.mid)
      pushUnique(out, segment.end)
      continue
    }
    pushUnique(out, segment.b)
  }
  if (out.length > 0 && !pointsEqual(out[0], out[out.length - 1])) {
    out.push(out[0])
  }
  if (out.length > 1) {
    out.pop()
  }
  return out
}

export const deriveProfilesWithDiagnostics = (
  input: SketchComponent[] | SketchEntity[],
): DeriveProfilesResult => {
  const components = input.length === 0
    ? []
    : 'entityId' in input[0]
      ? normalizeLegacyEntities(input as SketchEntity[])
      : (input as SketchComponent[])

  if (components.length === 0) {
    return { profiles: [], diagnostics: [] }
  }

  const segments = components.map(resolveSketchComponentToSegment)
  const firstStart = toSegmentStart(segments[0])
  const lastEnd = toSegmentEnd(segments[segments.length - 1])
  if (!pointsEqual(firstStart, lastEnd)) {
    return {
      profiles: [],
      diagnostics: [
        {
          code: 'SKETCH_PROFILE_NOT_CLOSED',
          message: 'Sketch chain is not closed (first start does not match last end).',
        },
      ],
    }
  }

  const proxyVertices = buildProxyVertices(segments)
  const areaSigned = signedShoelaceArea(proxyVertices)
  if (Math.abs(areaSigned) <= 1e-9) {
    return {
      profiles: [],
      diagnostics: [
        {
          code: 'SKETCH_PROFILE_DEGENERATE',
          message: 'Sketch chain is closed but degenerate (zero proxy area).',
        },
      ],
    }
  }

  const winding: 'CCW' | 'CW' = areaSigned >= 0 ? 'CCW' : 'CW'
  const canonicalSig = components.map((component) => component.componentId).join('|')
  const profileId = profileIdFromSignature(canonicalSig)

  return {
    profiles: [
      {
        profileId,
        profileIndex: 0,
        area: Math.abs(areaSigned),
        loop: {
          segments,
          winding,
        },
        verticesProxy: proxyVertices,
      },
    ],
    diagnostics: [],
  }
}

export const deriveProfiles = (input: SketchComponent[] | SketchEntity[]): ProfileOutput[] =>
  deriveProfilesWithDiagnostics(input).profiles

export const deriveProfilesFromLines = deriveProfiles
