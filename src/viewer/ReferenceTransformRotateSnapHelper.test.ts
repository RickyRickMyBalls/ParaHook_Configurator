import { describe, expect, it } from 'vitest'
import {
  ReferenceTransformRotateSnapHelper,
  buildReferenceTransformRotateSnapLineTargets,
} from './ReferenceTransformRotateSnapHelper'

const makeOverlay = (landedAngleDeg = 0) => ({
  axis: 'y' as const,
  origin: { x: 10, y: -2, z: 4 },
  axisDirection: { x: 0, y: 1, z: 0 },
  referenceDirection: { x: 1, y: 0, z: 0 },
  landedAngleDeg,
  snapStepDeg: 15,
  ringRadius: 20,
})

describe('ReferenceTransformRotateSnapHelper', () => {
  it('builds a bounded angular neighborhood with one buffered line beyond each edge', () => {
    const targets = buildReferenceTransformRotateSnapLineTargets(makeOverlay(), {
      previewRadiusDeg: 60,
    })

    expect(targets).toHaveLength(11)

    const hiddenTargets = targets.filter((entry) => entry.targetOpacity === 0 && entry.targetScale === 0)
    expect(hiddenTargets).toHaveLength(2)
    expect(targets.find((entry) => entry.key === 'rotate:y:-4')?.targetOpacity).toBeGreaterThan(0)
    expect(targets.find((entry) => entry.key === 'rotate:y:4')?.targetOpacity).toBeGreaterThan(0)
    expect(targets.find((entry) => entry.key === 'rotate:y:-5')?.targetOpacity).toBe(0)
    expect(targets.find((entry) => entry.key === 'rotate:y:5')?.targetOpacity).toBe(0)
  })

  it('keys preview segments by absolute angular snap index and keeps positions fixed across snap steps', () => {
    const beforeTargets = buildReferenceTransformRotateSnapLineTargets(makeOverlay(0), {
      previewRadiusDeg: 60,
    })
    const afterTargets = buildReferenceTransformRotateSnapLineTargets(makeOverlay(15), {
      previewRadiusDeg: 60,
    })

    const persistedBefore = beforeTargets.find((entry) => entry.key === 'rotate:y:1')
    const persistedAfter = afterTargets.find((entry) => entry.key === 'rotate:y:1')
    const newTarget = afterTargets.find((entry) => entry.key === 'rotate:y:2')

    expect(persistedBefore?.position).toEqual(persistedAfter?.position)
    expect(newTarget?.position.x).toBeCloseTo(10 + Math.cos((30 * Math.PI) / 180) * 10, 4)
    expect(newTarget?.position.z).toBeCloseTo(4 - Math.sin((30 * Math.PI) / 180) * 10, 4)
  })

  it('keeps the current line only modestly larger than its local baseline', () => {
    const targets = buildReferenceTransformRotateSnapLineTargets(makeOverlay(), {
      previewRadiusDeg: 60,
    })

    const currentTarget = targets.find((entry) => entry.isCurrentTarget)
    const adjacentTarget = targets.find((entry) => entry.key === 'rotate:y:1')

    expect(currentTarget).toBeDefined()
    expect(adjacentTarget).toBeDefined()
    expect(currentTarget?.targetScale ?? 0).toBeLessThan(1.25)
    expect(currentTarget?.targetScale ?? 0).toBeGreaterThan(adjacentTarget?.targetScale ?? 0)
  })

  it('slows line emphasis changes when the configured delay is higher', () => {
    const fastHelper = new ReferenceTransformRotateSnapHelper()
    const slowHelper = new ReferenceTransformRotateSnapHelper()

    fastHelper.setDelayMs(0)
    slowHelper.setDelayMs(500)
    fastHelper.setOverlay(makeOverlay())
    slowHelper.setOverlay(makeOverlay())

    fastHelper.tick(1 / 60)
    slowHelper.tick(1 / 60)

    const fastCurrent = fastHelper.getDebugSegments().find((entry) => entry.key === 'rotate:y:0')
    const slowCurrent = slowHelper.getDebugSegments().find((entry) => entry.key === 'rotate:y:0')

    expect(fastCurrent?.currentScale ?? 0).toBeGreaterThan(slowCurrent?.currentScale ?? 0)

    fastHelper.dispose()
    slowHelper.dispose()
  })

  it('transfers highlight on arrival instead of pre-growing the destination line early', () => {
    const helper = new ReferenceTransformRotateSnapHelper()

    helper.setDelayMs(500)
    helper.setOverlay(makeOverlay(0))
    for (let index = 0; index < 30; index += 1) {
      helper.tick(1 / 60)
    }

    const previousBeforeStep =
      helper.getDebugSegments().find((entry) => entry.key === 'rotate:y:0')
    const nextBeforeStep = helper.getDebugSegments().find((entry) => entry.key === 'rotate:y:1')

    helper.setOverlay(makeOverlay(15))
    helper.tick(1 / 60)

    const previousAfterStep = helper
      .getDebugSegments()
      .find((entry) => entry.key === 'rotate:y:0')
    const nextAfterStep = helper.getDebugSegments().find((entry) => entry.key === 'rotate:y:1')

    expect(previousAfterStep?.targetScale ?? 0).toBeLessThan(previousBeforeStep?.targetScale ?? 0)
    expect(nextAfterStep?.targetScale ?? 0).toBeGreaterThan(nextBeforeStep?.targetScale ?? 0)
    expect(nextAfterStep?.currentScale ?? 0).toBeGreaterThanOrEqual(nextBeforeStep?.currentScale ?? 0)

    helper.dispose()
  })

  it('does not reset line identity when only the ring radius changes', () => {
    const helper = new ReferenceTransformRotateSnapHelper()

    helper.setDelayMs(500)
    helper.setOverlay(makeOverlay())
    for (let index = 0; index < 20; index += 1) {
      helper.tick(1 / 60)
    }

    const beforeRadiusChange = helper
      .getDebugSegments()
      .find((entry) => entry.key === 'rotate:y:0')

    helper.setOverlay({
      ...makeOverlay(),
      ringRadius: 24,
    })
    helper.tick(1 / 60)

    const afterRadiusChange = helper
      .getDebugSegments()
      .find((entry) => entry.key === 'rotate:y:0')

    expect(beforeRadiusChange?.currentScale ?? 0).toBeGreaterThan(0)
    expect(afterRadiusChange?.currentScale ?? 0).toBeGreaterThan(0)
    expect(afterRadiusChange?.currentScale ?? 0).toBeGreaterThanOrEqual(
      (beforeRadiusChange?.currentScale ?? 0) * 0.95,
    )

    helper.dispose()
  })
})
