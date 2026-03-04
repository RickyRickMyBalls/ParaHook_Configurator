import { resolveNumberExpression, resolveVec2Expression } from './expressions'
import type { FeatureStack, ProfileReference } from './featureTypes'

type Point2 = {
  x: number
  y: number
}

type ResolvedLine = {
  entityId: string
  start: Point2
  end: Point2
}

type IRProfileReference = {
  sketchFeatureId: string
  profileId: string
}

export type IRSketch = {
  op: 'sketch'
  featureId: string
  linesResolved: ResolvedLine[]
  profilesResolved: Array<{
    profileId: string
    area: number
    vertices: Point2[]
  }>
}

export type IRExtrude = {
  op: 'extrude'
  featureId: string
  profileRef: IRProfileReference | null
  depthResolved: number
  bodyId?: string
}

export type FeatureStackIR = Array<IRSketch | IRExtrude>

const pointKey = (point: Point2): string => `${String(point.x)}|${String(point.y)}`

const signedArea = (vertices: readonly Point2[]): number => {
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

const normalizeCounterClockwise = (vertices: Point2[]): Point2[] => {
  const area = signedArea(vertices)
  if (area >= 0) {
    return vertices
  }
  return [vertices[0], ...vertices.slice(1).reverse()]
}

const compareVertexSequences = (a: readonly Point2[], b: readonly Point2[]): number => {
  const count = Math.min(a.length, b.length)
  for (let index = 0; index < count; index += 1) {
    const keyA = pointKey(a[index])
    const keyB = pointKey(b[index])
    const comparison = keyA.localeCompare(keyB)
    if (comparison !== 0) {
      return comparison
    }
  }
  return a.length - b.length
}

const tryBuildLoop = (segments: readonly ResolvedLine[], reverseFirst: boolean): Point2[] | null => {
  if (segments.length < 3) {
    return null
  }
  const first = segments[0]
  const start = reverseFirst ? first.end : first.start
  const next = reverseFirst ? first.start : first.end
  const vertices: Point2[] = [start, next]
  let current = next

  for (let index = 1; index < segments.length; index += 1) {
    const segment = segments[index]
    const startKey = pointKey(segment.start)
    const endKey = pointKey(segment.end)
    const currentKey = pointKey(current)
    if (startKey === currentKey) {
      current = segment.end
      vertices.push(current)
      continue
    }
    if (endKey === currentKey) {
      current = segment.start
      vertices.push(current)
      continue
    }
    return null
  }

  if (pointKey(vertices[0]) !== pointKey(current)) {
    return null
  }
  return vertices.slice(0, vertices.length - 1)
}

const toIRProfileRef = (profileRef: ProfileReference | null): IRProfileReference | null => {
  if (profileRef === null) {
    return null
  }
  return {
    sketchFeatureId: profileRef.sourceFeatureId,
    profileId: profileRef.profileId,
  }
}

const resolveProfileVertices = (
  entityIds: readonly string[],
  linesByEntityId: ReadonlyMap<string, ResolvedLine>,
): Point2[] => {
  if (entityIds.length < 3) {
    return []
  }
  const segments: ResolvedLine[] = []
  for (const entityId of entityIds) {
    const segment = linesByEntityId.get(entityId)
    if (segment === undefined) {
      return []
    }
    segments.push(segment)
  }

  const direct = tryBuildLoop(segments, false)
  const reversed = tryBuildLoop(segments, true)
  const selected = (() => {
    if (direct === null && reversed === null) {
      return null
    }
    if (direct === null) {
      return reversed
    }
    if (reversed === null) {
      return direct
    }
    return compareVertexSequences(direct, reversed) <= 0 ? direct : reversed
  })()

  if (selected === null) {
    return []
  }
  const normalized = normalizeCounterClockwise(selected)
  return Math.abs(signedArea(normalized)) > 0 ? normalized : []
}

export const compileFeatureStack = (stack: FeatureStack): FeatureStackIR =>
  stack.map((feature) => {
    if (feature.type === 'sketch') {
      const linesResolved: ResolvedLine[] = feature.entities.map((entity) => ({
        entityId: entity.entityId,
        start: resolveVec2Expression(entity.start),
        end: resolveVec2Expression(entity.end),
      }))
      const linesByEntityId = new Map(linesResolved.map((line) => [line.entityId, line]))
      return {
        op: 'sketch',
        featureId: feature.featureId,
        linesResolved,
        profilesResolved: feature.outputs.profiles.map((profile) => ({
          profileId: profile.profileId,
          area: profile.area,
          vertices: resolveProfileVertices(profile.entityIds, linesByEntityId),
        })),
      }
    }

    return {
      op: 'extrude',
      featureId: feature.featureId,
      profileRef: toIRProfileRef(feature.inputs.profileRef),
      depthResolved: resolveNumberExpression(feature.params.depth),
      bodyId: feature.outputs.bodyId,
    }
  })
