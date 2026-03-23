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

  const remappedPositions: number[] = []
  for (let index = 0; index < artifactMesh.vertices.length; index += 3) {
    remappedPositions.push(
      artifactMesh.vertices[index],
      artifactMesh.vertices[index + 2],
      artifactMesh.vertices[index + 1],
    )
  }

  const remappedIndices: number[] = []
  for (let index = 0; index < artifactMesh.indices.length; index += 3) {
    remappedIndices.push(
      artifactMesh.indices[index],
      artifactMesh.indices[index + 2],
      artifactMesh.indices[index + 1],
    )
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(remappedPositions, 3))
  geometry.setIndex(remappedIndices)
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  return geometry
}
