import type { Face, MeshPack, Point2, Shape3D, Wire } from './cadTypes'

const pointKey = (point: Point2): string => `${String(point.x)}|${String(point.y)}`

const dedupeClosingVertex = (vertices: readonly Point2[]): Point2[] => {
  if (vertices.length < 2) {
    return [...vertices]
  }
  const first = vertices[0]
  const last = vertices[vertices.length - 1]
  if (pointKey(first) === pointKey(last)) {
    return vertices.slice(0, vertices.length - 1)
  }
  return [...vertices]
}

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

const ensureCounterClockwise = (vertices: readonly Point2[]): Point2[] => {
  if (signedArea(vertices) >= 0) {
    return [...vertices]
  }
  return [vertices[0], ...vertices.slice(1).reverse()]
}

export const wireFromLoop = (vertices: readonly Point2[]): Wire => {
  const normalized = ensureCounterClockwise(dedupeClosingVertex(vertices))
  if (normalized.length < 3) {
    throw new Error('Profile has fewer than 3 vertices.')
  }
  if (Math.abs(signedArea(normalized)) <= 0) {
    throw new Error('Profile has zero area.')
  }
  return {
    vertices: normalized,
  }
}

export const faceFromWire = (wire: Wire): Face => ({
  wire,
})

const extrudeMesh = (wire: Wire, depth: number): MeshPack => {
  if (!Number.isFinite(depth) || depth <= 0) {
    throw new Error('Extrude depth must be positive and finite.')
  }

  const loop = wire.vertices
  const n = loop.length
  const vertices: number[] = []
  const indices: number[] = []

  for (const point of loop) {
    vertices.push(point.x, point.y, 0)
  }
  for (const point of loop) {
    vertices.push(point.x, point.y, depth)
  }

  for (let index = 1; index < n - 1; index += 1) {
    indices.push(0, index + 1, index)
  }
  for (let index = 1; index < n - 1; index += 1) {
    indices.push(n, n + index, n + index + 1)
  }
  for (let index = 0; index < n; index += 1) {
    const next = (index + 1) % n
    indices.push(index, next, n + next)
    indices.push(index, n + next, n + index)
  }

  return { vertices, indices }
}

export const extrudeFaceAlongZ = (
  face: Face,
  depth: number,
  metadata: Pick<Shape3D, 'bodyId' | 'featureId' | 'op' | 'partKey'>,
): Shape3D => ({
  kind: 'extrusion',
  ...metadata,
  mesh: extrudeMesh(face.wire, depth),
})

export const mergeMeshPacks = (meshes: readonly MeshPack[]): MeshPack => {
  const mergedVertices: number[] = []
  const mergedIndices: number[] = []
  let vertexOffset = 0

  for (const mesh of meshes) {
    mergedVertices.push(...mesh.vertices)
    for (const index of mesh.indices) {
      mergedIndices.push(index + vertexOffset)
    }
    vertexOffset += mesh.vertices.length / 3
  }

  return {
    vertices: mergedVertices,
    indices: mergedIndices,
  }
}
