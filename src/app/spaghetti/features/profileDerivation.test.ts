import { describe, expect, it } from 'vitest'
import {
  deriveProfiles,
  deriveProfilesFromLines,
  profileIdFromSignature,
} from './profileDerivation'
import type { LineEntity } from './featureTypes'

const line = (
  entityId: string,
  start: { x: number; y: number },
  end: { x: number; y: number },
): LineEntity => ({
  entityId,
  type: 'line',
  start: {
    kind: 'lit',
    x: start.x,
    y: start.y,
  },
  end: {
    kind: 'lit',
    x: end.x,
    y: end.y,
  },
})

describe('deriveProfiles', () => {
  it('derives one deterministic profile for a rectangle', () => {
    const profiles = deriveProfiles([
      line('e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
      line('e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
      line('e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
      line('e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
    ])

    expect(profiles).toHaveLength(1)
    expect(profiles[0].entityIds).toEqual(['e1', 'e2', 'e3', 'e4'])
    expect(profiles[0].area).toBe(5000)
    expect(profiles[0].profileId).toBe(profileIdFromSignature('e1|e2|e3|e4'))
  })

  it('sorts multiple loops deterministically by area desc', () => {
    const profiles = deriveProfiles([
      line('a1', { x: 0, y: 0 }, { x: 100, y: 0 }),
      line('a2', { x: 100, y: 0 }, { x: 100, y: 100 }),
      line('a3', { x: 100, y: 100 }, { x: 0, y: 100 }),
      line('a4', { x: 0, y: 100 }, { x: 0, y: 0 }),
      line('b1', { x: 200, y: 0 }, { x: 220, y: 0 }),
      line('b2', { x: 220, y: 0 }, { x: 220, y: 20 }),
      line('b3', { x: 220, y: 20 }, { x: 200, y: 20 }),
      line('b4', { x: 200, y: 20 }, { x: 200, y: 0 }),
    ])

    expect(profiles).toHaveLength(2)
    expect(profiles[0].area).toBe(10000)
    expect(profiles[1].area).toBe(400)
  })

  it('keeps profileId stable across cycle direction/rotation variants', () => {
    const clockwise = deriveProfiles([
      line('c1', { x: 0, y: 0 }, { x: 10, y: 0 }),
      line('c2', { x: 10, y: 0 }, { x: 10, y: 10 }),
      line('c3', { x: 10, y: 10 }, { x: 0, y: 10 }),
      line('c4', { x: 0, y: 10 }, { x: 0, y: 0 }),
    ])
    const reversed = deriveProfiles([
      line('c3', { x: 0, y: 10 }, { x: 10, y: 10 }),
      line('c2', { x: 10, y: 10 }, { x: 10, y: 0 }),
      line('c1', { x: 10, y: 0 }, { x: 0, y: 0 }),
      line('c4', { x: 0, y: 0 }, { x: 0, y: 10 }),
    ])

    expect(clockwise).toHaveLength(1)
    expect(reversed).toHaveLength(1)
    expect(clockwise[0].profileId).toBe(reversed[0].profileId)
    expect(clockwise[0].entityIds).toEqual(reversed[0].entityIds)
  })

  it('keeps the compatibility alias wired to deriveProfiles', () => {
    const entities = [
      line('e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
      line('e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
      line('e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
      line('e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
    ]
    expect(deriveProfilesFromLines(entities)).toEqual(deriveProfiles(entities))
  })
})
