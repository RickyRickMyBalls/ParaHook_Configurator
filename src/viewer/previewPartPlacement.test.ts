import { BoxGeometry, BufferGeometry, Float32BufferAttribute } from 'three'
import { describe, expect, it } from 'vitest'
import type { PartArtifact } from '../shared/buildTypes'
import { resolveViewerPartPlacement } from './previewPartPlacement'

const meshGeometry = (): BufferGeometry => {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(
      [
        10, -2, 5,
        10, 8, 5,
        5, 8, 5,
      ],
      3,
    ),
  )
  geometry.setIndex([0, 1, 2])
  geometry.computeBoundingBox()
  return geometry
}

const meshArtifact = (): PartArtifact => ({
  id: 'extrude',
  label: 'Extrude',
  kind: 'mesh',
  mesh: {
    vertices: [
      10, -2, 5,
      10, 8, 5,
      5, 8, 5,
    ],
    indices: [0, 1, 2],
  },
  partKeyStr: 'extrude',
  partKey: { id: 'extrude', instance: null },
})

const boxArtifact = (): PartArtifact => ({
  id: 'baseplate',
  label: 'Baseplate',
  kind: 'box',
  params: { width: 10, length: 20, height: 5 },
  partKeyStr: 'baseplate',
  partKey: { id: 'baseplate', instance: null },
})

describe('resolveViewerPartPlacement', () => {
  it('keeps mesh artifacts at their authored origin instead of preview-layout offsetting them', () => {
    expect(resolveViewerPartPlacement(meshArtifact(), meshGeometry(), -2)).toEqual({
      position: { x: 0, y: 0, z: 0 },
      lengthForCursor: 0,
    })
  })

  it('keeps legacy box artifacts on the preview layout path', () => {
    expect(resolveViewerPartPlacement(boxArtifact(), new BoxGeometry(20, 5, 10), -2)).toEqual({
      position: { x: 8, y: 2.5, z: 0 },
      lengthForCursor: 20,
    })
  })
})
