import { describe, expect, it } from 'vitest'
import {
  resolveStagedScaleMultiplierFromTrackValue,
  resolveStagedScaleMultiplierTrackValue,
  STAGED_SCALE_MULTIPLIER_TRACK_LOW_BREAK,
  STAGED_SCALE_MULTIPLIER_TRACK_MID_BREAK,
} from './stagedScaleMultiplierCurve'

describe('stagedScaleMultiplierCurve', () => {
  it('maps the locked curve breakpoints exactly', () => {
    expect(resolveStagedScaleMultiplierFromTrackValue(0)).toBeCloseTo(0.1)
    expect(
      resolveStagedScaleMultiplierFromTrackValue(STAGED_SCALE_MULTIPLIER_TRACK_LOW_BREAK),
    ).toBeCloseTo(2)
    expect(
      resolveStagedScaleMultiplierFromTrackValue(STAGED_SCALE_MULTIPLIER_TRACK_MID_BREAK),
    ).toBeCloseTo(25)
    expect(resolveStagedScaleMultiplierFromTrackValue(100)).toBeCloseTo(1000)
  })

  it('maps actual multiplier values back into the expected curve zones', () => {
    expect(resolveStagedScaleMultiplierTrackValue(0.1)).toBeCloseTo(0)
    expect(resolveStagedScaleMultiplierTrackValue(2)).toBeCloseTo(25)
    expect(resolveStagedScaleMultiplierTrackValue(25)).toBeCloseTo(50)
    expect(resolveStagedScaleMultiplierTrackValue(1000)).toBeCloseTo(100)
    expect(resolveStagedScaleMultiplierTrackValue(10)).toBeCloseTo(33.6957, 3)
  })

  it('round-trips representative values through the segmented curve', () => {
    ;[0.1, 0.5, 2, 10, 25, 100, 512.5, 1000].forEach((scaleMultiplier) => {
      expect(
        resolveStagedScaleMultiplierFromTrackValue(
          resolveStagedScaleMultiplierTrackValue(scaleMultiplier),
        ),
      ).toBeCloseTo(scaleMultiplier, 4)
    })
  })
})
