import { describe, expect, it } from 'vitest'

import {
  buildReferenceTimelineConfig,
  evaluateReferenceTimelineChannelValue,
  evaluateReferenceTransformOverrideWithTimelines,
  shiftReferenceTimelineConfig,
  type ReferenceTimelineConfig,
} from './referenceTimeline'

describe('referenceTimeline', () => {
  it('evaluates a timeline channel within the configured clamp range', () => {
    const config: ReferenceTimelineConfig = {
      speed: 1,
      cycle: 'left-to-right',
      startedAtMs: 0,
      points: [
        { pointId: 'p0', t: 0, value: -10, inHandle: null, outHandle: { t: 0.3, value: -10 } },
        { pointId: 'p1', t: 1, value: 10, inHandle: { t: 0.7, value: 10 }, outHandle: null },
      ],
    }

    const value = evaluateReferenceTimelineChannelValue(
      'timeline',
      config,
      0,
      { min: -5, max: 5 },
      2000,
    )

    expect(value).toBeGreaterThanOrEqual(-5)
    expect(value).toBeLessThanOrEqual(5)
  })

  it('shifts an authored timeline curve when the base value changes', () => {
    const config = buildReferenceTimelineConfig(10, { min: -300, max: 300 }, 0)
    const shifted = shiftReferenceTimelineConfig(config, 5, { min: -300, max: 300 })

    expect(shifted.points[0]?.value).toBe(15)
    expect(shifted.points[1]?.value).toBe(15)
  })

  it('evaluates transform overrides and leaves non-timeline channels untouched', () => {
    const config = buildReferenceTimelineConfig(25, { min: -300, max: 300 }, 0)
    const transformOverride = evaluateReferenceTransformOverrideWithTimelines(
      {
        position: { x: 25, y: 4, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      2000,
      (channel) => (channel === 'move-x' ? 'timeline' : 'basic'),
      (channel) => (channel === 'move-x' ? config : null),
      () => ({ min: -300, max: 300 }),
    )

    expect(transformOverride.position.x).toBe(25)
    expect(transformOverride.position.y).toBe(4)
    expect(transformOverride.scale.x).toBe(1)
  })
})
