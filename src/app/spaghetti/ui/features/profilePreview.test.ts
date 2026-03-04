import { describe, expect, it } from 'vitest'
import {
  computeBounds,
  ensureClosedLoop,
  fitVerticesToBox,
  labelProfilesForPreview,
  sortProfilesForPreview,
} from './profilePreview'

describe('profilePreview helpers', () => {
  it('computes deterministic bounds', () => {
    const bounds = computeBounds([
      { x: 3, y: -2 },
      { x: 7, y: 5 },
      { x: -1, y: 4 },
    ])

    expect(bounds).toEqual({
      minX: -1,
      maxX: 7,
      minY: -2,
      maxY: 5,
      width: 8,
      height: 7,
    })
  })

  it('enforces closed loop by connecting last vertex to first', () => {
    const closed = ensureClosedLoop([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 5 },
      { x: 0, y: 5 },
    ])

    expect(closed).toHaveLength(5)
    expect(closed[0]).toEqual(closed[closed.length - 1])
  })

  it('maps vertices deterministically into a fit box', () => {
    const fitted = fitVerticesToBox(
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ],
      40,
      20,
      2,
    )

    expect(fitted).toEqual([
      { x: 12, y: 18 },
      { x: 28, y: 18 },
      { x: 28, y: 2 },
      { x: 12, y: 2 },
      { x: 12, y: 18 },
    ])
  })

  it('sorts and labels profiles deterministically by area desc then profileId asc', () => {
    const sorted = sortProfilesForPreview([
      { profileId: 'prof_z', area: 50, vertices: [] },
      { profileId: 'prof_a', area: 50, vertices: [] },
      { profileId: 'prof_b', area: 90, vertices: [] },
    ])
    const labeled = labelProfilesForPreview(sorted)

    expect(sorted.map((profile) => profile.profileId)).toEqual(['prof_b', 'prof_a', 'prof_z'])
    expect(labeled.map((profile) => profile.label)).toEqual(['A', 'B', 'C'])
  })
})
