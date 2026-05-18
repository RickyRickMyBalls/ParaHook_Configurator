import { BufferGeometry, Float32BufferAttribute } from 'three'
import type { ArtifactMesh } from '../shared/buildTypes'
import type { GeometryTopologyPreview } from '../shared/geometryResult'

export type SelectedTopologyFace = {
  partKey: string
  faceId: string
  bodyId: string
}

export type SelectedTopologyEdge = {
  partKey: string
  edgeId: string
  bodyId: string
}

export type SelectedTopologyPoint = {
  partKey: string
  pointId: string
  bodyId: string
}

export type SelectedTopologyEntity =
  | ({ kind: 'face' } & SelectedTopologyFace)
  | ({ kind: 'edge' } & SelectedTopologyEdge)
  | ({ kind: 'point' } & SelectedTopologyPoint)

export const resolveTopologyFaceFromTriangleIndex = (
  topologyPreview: GeometryTopologyPreview | null | undefined,
  faceIndex: number | null | undefined,
): { faceId: string; bodyId: string } | null => {
  if (
    topologyPreview === null ||
    topologyPreview === undefined ||
    faceIndex === null ||
    faceIndex === undefined ||
    !Number.isInteger(faceIndex) ||
    faceIndex < 0
  ) {
    return null
  }
  const faceId = topologyPreview.triangleFaceIds[faceIndex]
  if (typeof faceId !== 'string' || faceId.length === 0) {
    return null
  }
  const face = topologyPreview.faces.find((candidate) => candidate.faceId === faceId)
  return face === undefined ? null : { faceId: face.faceId, bodyId: face.bodyId }
}

export const createSemanticFaceHighlightGeometry = (
  mesh: ArtifactMesh,
  topologyPreview: GeometryTopologyPreview | null | undefined,
  faceId: string,
): BufferGeometry | null => {
  if (topologyPreview === null || topologyPreview === undefined || faceId.length === 0) {
    return null
  }
  const vertices: number[] = []
  const triangleCount = Math.floor(mesh.indices.length / 3)
  for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex += 1) {
    if (topologyPreview.triangleFaceIds[triangleIndex] !== faceId) {
      continue
    }
    for (let corner = 0; corner < 3; corner += 1) {
      const vertexIndex = mesh.indices[triangleIndex * 3 + corner]
      const vertexOffset = vertexIndex * 3
      const x = mesh.vertices[vertexOffset]
      const y = mesh.vertices[vertexOffset + 1]
      const z = mesh.vertices[vertexOffset + 2]
      if (
        typeof x !== 'number' ||
        typeof y !== 'number' ||
        typeof z !== 'number' ||
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(z)
      ) {
        return null
      }
      vertices.push(x, y, z)
    }
  }
  if (vertices.length === 0) {
    return null
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  return geometry
}

export const createSemanticEdgeOverlayGeometry = (
  topologyPreview: GeometryTopologyPreview | null | undefined,
): BufferGeometry | null => {
  if (topologyPreview === null || topologyPreview === undefined) {
    return null
  }
  const vertices: number[] = []
  for (const edge of topologyPreview.edges) {
    if (edge.polyline.length < 6 || edge.polyline.length % 3 !== 0) {
      continue
    }
    for (let pointIndex = 0; pointIndex < edge.polyline.length / 3 - 1; pointIndex += 1) {
      const startOffset = pointIndex * 3
      const endOffset = startOffset + 3
      const x1 = edge.polyline[startOffset]
      const y1 = edge.polyline[startOffset + 1]
      const z1 = edge.polyline[startOffset + 2]
      const x2 = edge.polyline[endOffset]
      const y2 = edge.polyline[endOffset + 1]
      const z2 = edge.polyline[endOffset + 2]
      if (
        typeof x1 !== 'number' ||
        typeof y1 !== 'number' ||
        typeof z1 !== 'number' ||
        typeof x2 !== 'number' ||
        typeof y2 !== 'number' ||
        typeof z2 !== 'number' ||
        !Number.isFinite(x1) ||
        !Number.isFinite(y1) ||
        !Number.isFinite(z1) ||
        !Number.isFinite(x2) ||
        !Number.isFinite(y2) ||
        !Number.isFinite(z2)
      ) {
        return null
      }
      vertices.push(x1, y1, z1, x2, y2, z2)
    }
  }
  if (vertices.length === 0) {
    return null
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.computeBoundingBox()
  return geometry
}

export const createSemanticEdgeSelectionGeometry = (
  topologyPreview: GeometryTopologyPreview | null | undefined,
  edgeId: string,
): BufferGeometry | null => {
  if (topologyPreview === null || topologyPreview === undefined || edgeId.length === 0) {
    return null
  }
  const edge = topologyPreview.edges.find((candidate) => candidate.edgeId === edgeId)
  if (edge === undefined) {
    return null
  }
  return createSemanticEdgeOverlayGeometry({
    ...topologyPreview,
    edges: [edge],
  })
}

export const createSemanticPointMarkerGeometry = (
  topologyPreview: GeometryTopologyPreview | null | undefined,
  pointId: string,
): BufferGeometry | null => {
  if (topologyPreview === null || topologyPreview === undefined || pointId.length === 0) {
    return null
  }
  const point = topologyPreview.points.find((candidate) => candidate.pointId === pointId)
  if (point === undefined) {
    return null
  }
  const [x, y, z] = point.position
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof z !== 'number' ||
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(z)
  ) {
    return null
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute([x, y, z], 3))
  geometry.computeBoundingBox()
  return geometry
}

export const resolveTopologyPointPosition = (
  topologyPreview: GeometryTopologyPreview | null | undefined,
  pointId: string,
): [number, number, number] | null => {
  if (topologyPreview === null || topologyPreview === undefined || pointId.length === 0) {
    return null
  }
  const point = topologyPreview.points.find((candidate) => candidate.pointId === pointId)
  if (point === undefined) {
    return null
  }
  const [x, y, z] = point.position
  return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)
    ? [x, y, z]
    : null
}
