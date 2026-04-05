import { BufferGeometry, Float32BufferAttribute } from 'three'
import type { ArtifactMesh } from '../shared/buildTypes'

export const createViewerGeometryFromArtifactMesh = (
  artifactMesh: ArtifactMesh,
): BufferGeometry | null => {
  if (
    artifactMesh.vertices.length < 3 ||
    artifactMesh.vertices.length % 3 !== 0 ||
    artifactMesh.indices.length === 0 ||
    artifactMesh.indices.length % 3 !== 0
  ) {
    return null
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(artifactMesh.vertices, 3))
  geometry.setIndex(artifactMesh.indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  return geometry
}
