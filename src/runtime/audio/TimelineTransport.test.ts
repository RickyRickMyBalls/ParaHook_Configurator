import { describe, expect, it } from 'vitest'
import { resolveBurstWindow } from './TimelineTransport'

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
})
