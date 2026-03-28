import { Group } from 'three'
import { describe, expect, it } from 'vitest'
import {
  ReferenceTransformMoveSnapHelper,
  buildReferenceTransformMoveSnapDotTargets,
  buildReferenceTransformMoveSnapPositions,
} from './ReferenceTransformMoveSnapHelper'

const makeReferenceObject = (): Group => {
  const object = new Group()
  object.visible = true
  object.position.set(10, -2, 4)
  object.userData.referenceTransformBase = {
    position: { x: 10, y: -2, z: 4 },
    rotationDeg: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  }
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
      -40, -2, 4,
      -30, -2, 4,
      -20, -2, 4,
      -10, -2, 4,
      0, -2, 4,
      10, -2, 4,
      20, -2, 4,
      30, -2, 4,
      40, -2, 4,
      50, -2, 4,
      60, -2, 4,
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

    expect(positions).toHaveLength(209 * 3)
    expect(positions.slice(0, 3)).toEqual([-35, -52, 4])
    expect(positions.slice(-3)).toEqual([55, 48, 4])
  })

  it('builds a buffered 3D snap field for center move handles', () => {
    const positions = buildReferenceTransformMoveSnapPositions(
      {
        handle: { mode: 'translate', kind: 'center' },
        snapValues: { x: 2, y: 4, z: 8 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    expect(positions).toHaveLength(1331 * 3)
    expect(positions.slice(0, 3)).toEqual([0, -22, -36])
    expect(positions.slice(-3)).toEqual([20, 18, 44])
  })

  it('keeps the snap field anchored to absolute lattice points as the gizmo moves', () => {
    const referenceObject = makeReferenceObject()
    referenceObject.position.set(15, -2, 4)

    const positions = buildReferenceTransformMoveSnapPositions(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 5, y: 10, z: 10 },
        space: 'world',
      },
      referenceObject,
    )

    expect(positions).toEqual([
      -30, -2, 4,
      -25, -2, 4,
      -20, -2, 4,
      -15, -2, 4,
      -10, -2, 4,
      -5, -2, 4,
      0, -2, 4,
      5, -2, 4,
      10, -2, 4,
      15, -2, 4,
      20, -2, 4,
      25, -2, 4,
      30, -2, 4,
      35, -2, 4,
      40, -2, 4,
      45, -2, 4,
      50, -2, 4,
      55, -2, 4,
      60, -2, 4,
    ])
  })

  it('anchors the snap field to the live entry origin when one is provided', () => {
    const referenceObject = makeReferenceObject()
    referenceObject.position.set(25, 30, 4)

    const positions = buildReferenceTransformMoveSnapPositions(
      {
        handle: { mode: 'translate', kind: 'plane', plane: 'xy' },
        snapValues: { x: 5, y: 10, z: 15 },
        space: 'world',
        anchorPosition: { x: 20, y: 20, z: 4 },
      },
      referenceObject,
    )

    expect(positions).toHaveLength(209 * 3)
    expect(positions.slice(0, 3)).toEqual([-20, -20, 4])
    expect(positions.slice(-3)).toEqual([70, 80, 4])
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
    expect(positions[1]).toBeCloseTo(-52, 4)
    expect(positions[2]).toBeCloseTo(4, 4)
    expect(positions[30]).toBeCloseTo(10, 4)
    expect(positions[31]).toBeCloseTo(48, 4)
    expect(positions[32]).toBeCloseTo(4, 4)
  })

  it('weights the current target above nearby dots and fades outer dots continuously', () => {
    const targets = buildReferenceTransformMoveSnapDotTargets(
      {
        handle: { mode: 'translate', kind: 'plane', plane: 'xy' },
        snapValues: { x: 5, y: 10, z: 15 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    const currentTarget = targets.find((entry) => entry.isCurrentTarget)
    const nearNeighbor = targets.find(
      (entry) => !entry.isCurrentTarget && entry.normalizedDistance === 0.5,
    )
    const farNeighbor = targets.find((entry) => entry.normalizedDistance === 1)

    expect(currentTarget?.targetOpacity ?? 0).toBeGreaterThan(nearNeighbor?.targetOpacity ?? 0)
    expect(currentTarget?.targetScale ?? 0).toBeGreaterThan(nearNeighbor?.targetScale ?? 0)
    expect(nearNeighbor?.targetOpacity ?? 0).toBeGreaterThan(farNeighbor?.targetOpacity ?? 0)
    expect(nearNeighbor?.targetScale ?? 0).toBeGreaterThan(farNeighbor?.targetScale ?? 0)
  })

  it('sizes the current target as a modest 20 percent highlight over the normal baseline', () => {
    const highlightedTargets = buildReferenceTransformMoveSnapDotTargets(
      {
        handle: { mode: 'translate', kind: 'plane', plane: 'xy' },
        snapValues: { x: 5, y: 10, z: 15 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    const currentTarget = highlightedTargets.find((entry) => entry.isCurrentTarget)
    const nearScale = 1.45
    const farScale = 0.04
    const normalBaselineAtCenter = farScale + (nearScale - farScale) * 0.6

    expect(currentTarget).toBeDefined()
    expect(currentTarget?.targetScale).toBeCloseTo(normalBaselineAtCenter * 1.2, 5)
  })

  it('keeps one buffered outer plane ring hidden until the gizmo moves toward it', () => {
    const targets = buildReferenceTransformMoveSnapDotTargets(
      {
        handle: { mode: 'translate', kind: 'plane', plane: 'xy' },
        snapValues: { x: 5, y: 10, z: 15 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    const hiddenOuterRing = targets.filter(
      (entry) => entry.targetOpacity === 0 && entry.targetScale === 0,
    )

    expect(hiddenOuterRing).toHaveLength(56)
  })

  it('keeps one buffered outer axis ring hidden until the gizmo moves toward it', () => {
    const targets = buildReferenceTransformMoveSnapDotTargets(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    const hiddenOuterRing = targets.filter(
      (entry) => entry.targetOpacity === 0 && entry.targetScale === 0,
    )

    expect(hiddenOuterRing).toHaveLength(2)
  })

  it('keeps one buffered outer center shell hidden until the gizmo moves toward it', () => {
    const targets = buildReferenceTransformMoveSnapDotTargets(
      {
        handle: { mode: 'translate', kind: 'center' },
        snapValues: { x: 2, y: 4, z: 8 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    const hiddenOuterShell = targets.filter(
      (entry) => entry.targetOpacity === 0 && entry.targetScale === 0,
    )

    expect(hiddenOuterShell).toHaveLength(602)
  })

  it('widens the buffered field when the visible radius distance increases', () => {
    const defaultTargets = buildReferenceTransformMoveSnapDotTargets(
      {
        handle: { mode: 'translate', kind: 'plane', plane: 'xy' },
        snapValues: { x: 5, y: 10, z: 15 },
        space: 'world',
      },
      makeReferenceObject(),
    )

    const widerTargets = buildReferenceTransformMoveSnapDotTargets(
      {
        handle: { mode: 'translate', kind: 'plane', plane: 'xy' },
        snapValues: { x: 5, y: 10, z: 15 },
        space: 'world',
      },
      makeReferenceObject(),
      { visibleRadiusDistance: 80 },
    )

    expect(widerTargets).toHaveLength(513)
    expect(widerTargets.length).toBeGreaterThan(defaultTargets.length)
  })

  it('animates dots in and back out instead of hard hiding them', () => {
    const helper = new ReferenceTransformMoveSnapHelper()
    const referenceObject = makeReferenceObject()

    helper.setOverlay(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      referenceObject,
    )
    for (let index = 0; index < 8; index += 1) {
      helper.tick(1 / 60)
    }

    expect(helper.getGroup().visible).toBe(true)

    helper.setOverlay(null, referenceObject)
    helper.tick(1 / 60)

    expect(helper.getGroup().visible).toBe(true)

    for (let index = 0; index < 60; index += 1) {
      helper.tick(1 / 60)
    }

    expect(helper.getGroup().visible).toBe(false)
    helper.dispose()
  })

  it('slows emphasis changes when the configured dot delay is higher', () => {
    const referenceObject = makeReferenceObject()
    const fastHelper = new ReferenceTransformMoveSnapHelper()
    const slowHelper = new ReferenceTransformMoveSnapHelper()

    fastHelper.setDotDelayMs(0)
    slowHelper.setDotDelayMs(500)

    fastHelper.setOverlay(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      referenceObject,
    )
    slowHelper.setOverlay(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      referenceObject,
    )

    fastHelper.tick(1 / 60)
    slowHelper.tick(1 / 60)

    const fastDot = fastHelper.getDebugDots().find((entry) => entry.key === 'axis:x:0')
    const slowDot = slowHelper.getDebugDots().find((entry) => entry.key === 'axis:x:0')

    expect(fastDot?.currentScale ?? 0).toBeGreaterThan(slowDot?.currentScale ?? 0)

    fastHelper.dispose()
    slowHelper.dispose()
  })

  it('preserves dot identity by absolute key as the snapped target advances', () => {
    const referenceObject = makeReferenceObject()
    const helper = new ReferenceTransformMoveSnapHelper()

    helper.setOverlay(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      referenceObject,
    )
    helper.tick(1 / 60)

    const originalDot = helper.getDebugDots().find((entry) => entry.key === 'axis:x:0')

    referenceObject.position.set(20, -2, 4)
    helper.setOverlay(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      referenceObject,
    )

    const persistedDot = helper.getDebugDots().find((entry) => entry.key === 'axis:x:0')
    const newTargetDot = helper.getDebugDots().find((entry) => entry.key === 'axis:x:1')

    expect(originalDot?.position).toEqual({ x: 10, y: -2, z: 4 })
    expect(persistedDot?.position).toEqual({ x: 10, y: -2, z: 4 })
    expect(newTargetDot?.position).toEqual({ x: 20, y: -2, z: 4 })

    helper.dispose()
  })

  it('transfers highlight on arrival instead of pre-growing the new snapped target early', () => {
    const referenceObject = makeReferenceObject()
    const helper = new ReferenceTransformMoveSnapHelper()

    helper.setDotDelayMs(500)
    helper.setOverlay(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      referenceObject,
    )

    for (let index = 0; index < 30; index += 1) {
      helper.tick(1 / 60)
    }

    const previousTargetBeforeStep =
      helper.getDebugDots().find((entry) => entry.key === 'axis:x:0')?.currentScale ?? 0
    const nextTargetBeforeStep =
      helper.getDebugDots().find((entry) => entry.key === 'axis:x:1')?.currentScale ?? 0

    referenceObject.position.set(20, -2, 4)
    helper.setOverlay(
      {
        handle: { mode: 'translate', kind: 'axis', axis: 'x' },
        snapValues: { x: 10, y: 20, z: 30 },
        space: 'world',
      },
      referenceObject,
    )
    helper.tick(1 / 60)

    const previousTargetAfterStep =
      helper.getDebugDots().find((entry) => entry.key === 'axis:x:0')?.currentScale ?? 0
    const nextTargetAfterStep =
      helper.getDebugDots().find((entry) => entry.key === 'axis:x:1')?.currentScale ?? 0

    expect(previousTargetAfterStep).toBeLessThan(previousTargetBeforeStep)
    expect(nextTargetAfterStep).toBeGreaterThanOrEqual(nextTargetBeforeStep)

    helper.dispose()
  })
})
