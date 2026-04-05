import type { BufferGeometry } from 'three'
import type { PartArtifact } from '../shared/buildTypes'

export type ViewerPartPlacement = {
  position: {
    x: number
    y: number
    z: number
  }
  lengthForCursor: number
}

export const resolveViewerPartPlacement = (
  artifact: PartArtifact,
  _geometry: BufferGeometry,
  xCursor: number,
): ViewerPartPlacement => {
  if (artifact.kind === 'box') {
    return {
      position: {
        x: xCursor + artifact.params.length / 2,
        y: artifact.params.height / 2,
        z: 0,
      },
      lengthForCursor: artifact.params.length,
    }
  }

  return {
    position: { x: 0, y: 0, z: 0 },
    lengthForCursor: 0,
  }
}
