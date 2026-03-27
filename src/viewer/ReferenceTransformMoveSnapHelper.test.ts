import { Group } from 'three'
import { describe, expect, it } from 'vitest'
import {
  ReferenceTransformMoveSnapHelper,
  buildReferenceTransformMoveSnapPositions,
} from './ReferenceTransformMoveSnapHelper'

const makeReferenceObject = (): Group => {
  const object = new Group()
  object.visible = true
  object.position.set(10, -2, 4)
  return object
}

describe('ReferenceTransformMoveSnapHelper', () => {
  it('builds a bounded 1D snap field for axis move handles', () => {
    const positions = buildReferenceTransformMoveSnapPositions(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    expect(positions).toEqual([
      -20, -2, 4,
      -10, -2, 4,
      0, -2, 4,
      10, -2, 4,
      20, -2, 4,
      30, -2, 4,
      40, -2, 4,
    ])
  })

  it('builds a bounded 2D snap field for plane move handles', () => {
    const positions = buildReferenceTransformMoveSnapPositions(
      {
        handle: { mode: 'translate', kind: 'plane', plane: 'xy' },
        snapValues: { x: 5, y: 10, z: 15 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    expect(positions).toHaveLength(25 * 3)
    expect(positions.slice(0, 3)).toEqual([0, -22, 4])
    expect(positions.slice(-3)).toEqual([20, 18, 4])
  })

  it('builds a bounded 3D snap field for center move handles', () => {
    const positions = buildReferenceTransformMoveSnapPositions(
      {
        handle: { mode: 'translate', kind: 'center' },
        snapValues: { x: 2, y: 4, z: 8 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    expect(positions).toHaveLength(27 * 3)
    expect(positions.slice(0, 3)).toEqual([8, -6, -4])
    expect(positions.slice(-3)).toEqual([12, 2, 12])
  })

  it('orients local-axis snap fields with the reference rotation', () => {
    const referenceObject = makeReferenceObject()
    referenceObject.rotation.set(0, 0, Math.PI / 2)

    const positions = buildReferenceTransformMoveSnapPositions(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 10, z: 10 },
        space: 'local',
      },
      referenceObject,
    )

    expect(positions[0]).toBeCloseTo(10, 4)
    expect(positions[1]).toBeCloseTo(-32, 4)
    expect(positions[2]).toBeCloseTo(4, 4)
    expect(positions[18]).toBeCloseTo(10, 4)
    expect(positions[19]).toBeCloseTo(28, 4)
    expect(positions[20]).toBeCloseTo(4, 4)
  })

  it('hides the dots when the overlay or reference object is unavailable', () => {
    const helper = new ReferenceTransformMoveSnapHelper()
    helper.setOverlay(null, makeReferenceObject())

    expect(helper.getGroup().visible).toBe(false)

    helper.dispose()
  })
})
