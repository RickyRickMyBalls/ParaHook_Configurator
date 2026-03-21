import { describe, expect, it } from 'vitest'
import {
  resolveBarDurationSec,
  resolveBurstWindow,
  resolveRepeatOffsetsSec,
  resolveSamplerStepFadeEnvelope,
  resolveSamplerStepPlaybackWindow,
  resolveStepDurationSec,
  resolveStepStartTimeSec,
} from './TimelineTransport'

describe('TimelineTransport', () => {
  it('converts a normalized sample position into a bounded burst window', () => {
    expect(resolveBurstWindow(12, 0.5, 0.25)).toEqual({
      startTimeSec: 6,
      endTimeSec: 6.25,
      durationSec: 0.25,
    })
  })

  it('clamps the burst window so it does not run past the end of the source', () => {
    expect(resolveBurstWindow(2, 0.95, 0.5)).toEqual({
      startTimeSec: 1.5,
      endTimeSec: 2,
      durationSec: 0.5,
    })
  })

  it('can offset the burst start time without changing the bounded duration', () => {
    expect(resolveBurstWindow(12, 0.5, 0.25, { startOffsetSec: 0.1 })).toEqual({
      startTimeSec: 6.1,
      endTimeSec: 6.35,
      durationSec: 0.25,
    })
  })

  it('keeps sampler step duration tied to bpm instead of shrinking with step count', () => {
    expect(resolveBarDurationSec(120)).toBe(2)
    expect(resolveStepDurationSec(120, 4)).toBe(0.5)
    expect(resolveStepDurationSec(120, 16)).toBe(0.5)
    expect(resolveStepDurationSec(150, 8)).toBe(0.4)
    expect(resolveStepStartTimeSec(3, 120, 16)).toBe(1.5)
  })

  it('keeps note-repeat offsets inside the current step window', () => {
    expect(resolveRepeatOffsetsSec(0.5, 4, 4)).toEqual([0, 0.125, 0.25, 0.375])
    expect(resolveRepeatOffsetsSec(0.5, 8, 4)).toEqual([0, 0.125, 0.25, 0.375])
  })

  it('derives sampler step playback windows from step duration and scooch settings', () => {
    expect(resolveSamplerStepPlaybackWindow(0.5, 0.08, 0.06)).toEqual({
      startOffsetSec: 0.08,
      durationSec: 0.36,
    })
  })

  it('scales fade settings down when they exceed the playback window', () => {
    expect(resolveSamplerStepFadeEnvelope(0.4, 0.3, 0.3)).toEqual({
      fadeInSec: 0.2,
      fadeOutSec: 0.2,
    })
  })
})
