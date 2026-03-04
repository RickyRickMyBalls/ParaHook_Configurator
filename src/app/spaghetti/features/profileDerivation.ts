import type { ProfileOutput, SketchEntity } from './featureTypes'

type Point2 = { x: number; y: number }

type EndpointsByEntity = {
  aKey: string
  bKey: string
}

type CycleTraversal = {
  entityIds: string[]
  pointKeys: string[]
}

const pointKeyFromPoint = (point: Point2): string => `${String(point.x)}|${String(point.y)}`

const compareStringArrays = (a: readonly string[], b: readonly string[]): number => {
  const count = Math.min(a.length, b.length)
  for (let index = 0; index < count; index += 1) {
    const comparison = a[index].localeCompare(b[index])
    if (comparison !== 0) {
      return comparison
    }
  }
  return a.length - b.length
}

const rotate = <T>(items: readonly T[], index: number): T[] => [
  ...items.slice(index),
  ...items.slice(0, index),
]

const rotateToSmallestEntityId = (ring: readonly string[]): string[] => {
  if (ring.length === 0) {
    return []
  }
  let smallestIndex = 0
  for (let index = 1; index < ring.length; index += 1) {
    if (ring[index].localeCompare(ring[smallestIndex]) < 0) {
      smallestIndex = index
    }
  }
  return rotate(ring, smallestIndex)
}

const canonicalEntityRing = (ring: readonly string[]): string[] => {
  if (ring.length === 0) {
    return []
  }
  const forward = rotateToSmallestEntityId(ring)
  const reverse = rotateToSmallestEntityId([...ring].reverse())
  return compareStringArrays(forward, reverse) <= 0 ? forward : reverse
}

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

const otherPointKey = (
  endpoints: EndpointsByEntity,
  currentPointKey: string,
): string | null => {
  if (endpoints.aKey === currentPointKey) {
    return endpoints.bKey
  }
  if (endpoints.bKey === currentPointKey) {
    return endpoints.aKey
  }
  return null
}

const findCycleFromStart = (
  startPointKey: string,
  endpointsByEntityId: ReadonlyMap<string, EndpointsByEntity>,
  adjacencyByPointKey: ReadonlyMap<string, string[]>,
  availableEntityIds: ReadonlySet<string>,
): CycleTraversal | null => {
  const usedInPath = new Set<string>()
  const entityIds: string[] = []
  const pointKeys: string[] = [startPointKey]

  let currentPointKey = startPointKey
  while (true) {
    const candidateEntityIds = adjacencyByPointKey.get(currentPointKey) ?? []
    let nextEntityId: string | null = null
    let nextPointKey: string | null = null

    for (const entityId of candidateEntityIds) {
      if (!availableEntityIds.has(entityId) || usedInPath.has(entityId)) {
        continue
      }
      const endpoints = endpointsByEntityId.get(entityId)
      if (endpoints === undefined) {
        continue
      }
      const nextKey = otherPointKey(endpoints, currentPointKey)
      if (nextKey === null) {
        continue
      }
      nextEntityId = entityId
      nextPointKey = nextKey
      break
    }

    if (nextEntityId === null || nextPointKey === null) {
      return null
    }

    usedInPath.add(nextEntityId)
    entityIds.push(nextEntityId)
    pointKeys.push(nextPointKey)

    if (nextPointKey === startPointKey) {
      return entityIds.length >= 3 ? { entityIds, pointKeys } : null
    }

    currentPointKey = nextPointKey
  }
}

const buildGraph = (entities: readonly SketchEntity[]) => {
  const endpointsByEntityId = new Map<string, EndpointsByEntity>()
  const adjacencyByPointKey = new Map<string, string[]>()
  const pointsByKey = new Map<string, Point2>()
  const sortedEntities = [...entities].sort((a, b) => a.entityId.localeCompare(b.entityId))

  for (const entity of sortedEntities) {
    if (entity.type !== 'line') {
      continue
    }
    const startPoint: Point2 = { x: entity.start.x, y: entity.start.y }
    const endPoint: Point2 = { x: entity.end.x, y: entity.end.y }
    const aKey = pointKeyFromPoint(startPoint)
    const bKey = pointKeyFromPoint(endPoint)
    if (aKey === bKey) {
      continue
    }

    endpointsByEntityId.set(entity.entityId, { aKey, bKey })
    if (!pointsByKey.has(aKey)) {
      pointsByKey.set(aKey, startPoint)
    }
    if (!pointsByKey.has(bKey)) {
      pointsByKey.set(bKey, endPoint)
    }

    const aAdjacency = adjacencyByPointKey.get(aKey) ?? []
    aAdjacency.push(entity.entityId)
    adjacencyByPointKey.set(aKey, aAdjacency)

    const bAdjacency = adjacencyByPointKey.get(bKey) ?? []
    bAdjacency.push(entity.entityId)
    adjacencyByPointKey.set(bKey, bAdjacency)
  }

  for (const adjacency of adjacencyByPointKey.values()) {
    adjacency.sort((a, b) => a.localeCompare(b))
  }

  return {
    endpointsByEntityId,
    adjacencyByPointKey,
    pointsByKey,
  }
}

export const deriveProfiles = (entities: SketchEntity[]): ProfileOutput[] => {
  if (entities.length < 3) {
    return []
  }

  const { endpointsByEntityId, adjacencyByPointKey, pointsByKey } = buildGraph(entities)
  if (endpointsByEntityId.size < 3) {
    return []
  }

  const availableEntityIds = new Set<string>(
    [...endpointsByEntityId.keys()].sort((a, b) => a.localeCompare(b)),
  )
  const pointKeys = [...adjacencyByPointKey.keys()].sort((a, b) => a.localeCompare(b))
  const seenSignatures = new Set<string>()
  const derived: Array<ProfileOutput & { signature: string }> = []

  for (const startPointKey of pointKeys) {
    while (true) {
      const traversal = findCycleFromStart(
        startPointKey,
        endpointsByEntityId,
        adjacencyByPointKey,
        availableEntityIds,
      )
      if (traversal === null) {
        break
      }

      const canonicalEntityIds = canonicalEntityRing(traversal.entityIds)
      const signature = canonicalEntityIds.join('|')
      if (signature.length === 0 || seenSignatures.has(signature)) {
        break
      }

      const vertices = traversal.pointKeys
        .slice(0, traversal.pointKeys.length - 1)
        .map((pointKey) => pointsByKey.get(pointKey))
        .filter((point): point is Point2 => point !== undefined)
      const area = Math.abs(signedShoelaceArea(vertices))
      if (area <= 0) {
        break
      }

      seenSignatures.add(signature)
      derived.push({
        profileId: profileIdFromSignature(signature),
        entityIds: canonicalEntityIds,
        area,
        signature,
      })

      for (const entityId of traversal.entityIds) {
        availableEntityIds.delete(entityId)
      }
    }
  }

  derived.sort((a, b) => {
    if (b.area !== a.area) {
      return b.area - a.area
    }
    const signatureComparison = a.signature.localeCompare(b.signature)
    if (signatureComparison !== 0) {
      return signatureComparison
    }
    return a.profileId.localeCompare(b.profileId)
  })

  return derived.map(({ signature: _signature, ...profile }) => profile)
}

export const deriveProfilesFromLines = deriveProfiles
