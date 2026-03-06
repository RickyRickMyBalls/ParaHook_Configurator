import { describe, expect, it } from 'vitest'
import {
  deriveProfiles,
  deriveProfilesWithDiagnostics,
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
  it('derives one deterministic profile for a closed rectangle chain', () => {
    const profiles = deriveProfiles([
      line('e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
      line('e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
      line('e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
      line('e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
    ])

    expect(profiles).toHaveLength(1)
    expect(profiles[0].profileIndex).toBe(0)
    expect(profiles[0].area).toBe(5000)
    expect(profiles[0].profileId).toBe(profileIdFromSignature('e1|e2|e3|e4'))
    expect(profiles[0].loop.segments).toHaveLength(4)
  })

  it('returns not-closed diagnostic for open chains', () => {
    const result = deriveProfilesWithDiagnostics([
      line('e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
      line('e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
      line('e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
    ])
    expect(result.profiles).toEqual([])
    expect(result.diagnostics).toEqual([
      {
        code: 'SKETCH_PROFILE_NOT_CLOSED',
        message: 'Sketch chain is not closed (first start does not match last end).',
      },
    ])
  })

  it('returns degenerate diagnostic for zero-area closed chains', () => {
    const result = deriveProfilesWithDiagnostics([
      line('e1', { x: 0, y: 0 }, { x: 10, y: 0 }),
      line('e2', { x: 10, y: 0 }, { x: 20, y: 0 }),
      line('e3', { x: 20, y: 0 }, { x: 0, y: 0 }),
    ])
    expect(result.profiles).toEqual([])
    expect(result.diagnostics[0]?.code).toBe('SKETCH_PROFILE_DEGENERATE')
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
