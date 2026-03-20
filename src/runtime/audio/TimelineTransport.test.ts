import { describe, expect, it } from 'vitest'
import {
  resolveBarDurationSec,
  resolveBurstWindow,
  resolveRepeatOffsetsSec,
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

  it('derives one-bar and per-step durations from bpm and step count', () => {
    expect(resolveBarDurationSec(120)).toBe(2)
    expect(resolveStepDurationSec(120, 4)).toBe(0.5)
    expect(resolveStepDurationSec(120, 16)).toBe(0.125)
    expect(resolveStepStartTimeSec(3, 120, 16)).toBe(0.375)
  })

  it('keeps note-repeat offsets inside the current step window', () => {
    expect(resolveRepeatOffsetsSec(0.5, 4, 4)).toEqual([0, 0.125, 0.25, 0.375])
    expect(resolveRepeatOffsetsSec(0.5, 8, 4)).toEqual([0, 0.125, 0.25, 0.375])
  })
})
