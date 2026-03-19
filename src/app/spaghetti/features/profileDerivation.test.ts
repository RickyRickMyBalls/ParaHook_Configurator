import { describe, expect, it } from 'vitest'
import {
  deriveProfiles,
  deriveProfilesWithDiagnostics,
  deriveProfilesFromLines,
  profileIdFromSignature,
} from './profileDerivation'
import type { LineEntity, SketchComponent } from './featureTypes'

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

const rectangle = (
  componentId: string,
  a: { x: number; y: number },
  b: { x: number; y: number },
): SketchComponent => ({
  rowId: `row-${componentId}`,
  componentId,
  type: 'rectangle',
  a: { kind: 'lit', x: a.x, y: a.y },
  b: { kind: 'lit', x: b.x, y: b.y },
})

const circle = (
  componentId: string,
  center: { x: number; y: number },
  edge: { x: number; y: number },
): SketchComponent => ({
  rowId: `row-${componentId}`,
  componentId,
  type: 'circle',
  center: { kind: 'lit', x: center.x, y: center.y },
  edge: { kind: 'lit', x: edge.x, y: edge.y },
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

  it('derives one profile from a first-class rectangle sketch component', () => {
    const profiles = deriveProfiles([rectangle('rect-1', { x: 0, y: 0 }, { x: 100, y: 50 })])

    expect(profiles).toHaveLength(1)
    expect(profiles[0].area).toBe(5000)
    expect(profiles[0].loop.segments).toHaveLength(4)
  })

  it('derives one profile from a first-class circle sketch component', () => {
    const profiles = deriveProfiles([circle('circle-1', { x: 0, y: 0 }, { x: 20, y: 0 })])

    expect(profiles).toHaveLength(1)
    expect(profiles[0].loop.segments).toHaveLength(2)
    expect(profiles[0].area).toBeGreaterThan(0)
  })

  it('derives multiple profiles from ordered closed chains', () => {
    const profiles = deriveProfiles([
      rectangle('rect-a', { x: 0, y: 0 }, { x: 40, y: 20 }),
      rectangle('rect-b', { x: 60, y: 0 }, { x: 90, y: 30 }),
    ])

    expect(profiles).toHaveLength(2)
    expect(profiles.map((profile) => profile.area)).toEqual([800, 900])
  })
})
