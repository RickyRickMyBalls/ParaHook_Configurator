import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { createViewerGeometryFromArtifactMesh } from './artifactMeshGeometry'

describe('createViewerGeometryFromArtifactMesh', () => {
  it('keeps authored scene-space vertex positions and winding intact', () => {
    const geometry = createViewerGeometryFromArtifactMesh({
      vertices: [
        0, 0, 0,
        1, 0, 0,
        0, 1, 0,
      ],
      indices: [0, 1, 2],
    })

    expect(geometry).not.toBeNull()
    const positions = geometry?.getAttribute('position')
    const index = geometry?.getIndex()
    expect(positions).not.toBeNull()
    expect(index).not.toBeNull()

    const a = new Vector3().fromBufferAttribute(positions!, index!.array[0] as number)
    const b = new Vector3().fromBufferAttribute(positions!, index!.array[1] as number)
    const c = new Vector3().fromBufferAttribute(positions!, index!.array[2] as number)
    const normal = new Vector3().subVectors(b, a).cross(new Vector3().subVectors(c, a)).normalize()

    expect(Array.from(positions!.array as ArrayLike<number>)).toEqual([
      0, 0, 0,
      1, 0, 0,
      0, 1, 0,
    ])
    expect(index?.array).toEqual(new Uint16Array([0, 1, 2]))
    expect(normal.x).toBeCloseTo(0)
    expect(normal.y).toBeCloseTo(0)
    expect(normal.z).toBeCloseTo(1)
  })

  it('rejects incomplete triangle index buffers', () => {
    expect(
      createViewerGeometryFromArtifactMesh({
        vertices: [
          0, 0, 0,
          1, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1],
      }),
    ).toBeNull()
  })
})
