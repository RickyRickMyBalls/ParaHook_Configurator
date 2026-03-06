import { describe, expect, it } from 'vitest'
import { findDefaultExtrudeProfileRef, pickDefaultProfileRef } from './autoLink'
import type { FeatureStack, SketchFeature } from './featureTypes'

const sketchWithProfiles = (
  featureId: string,
  profiles: Array<{ profileId: string; area: number }>,
): SketchFeature => ({
  type: 'sketch',
  featureId,
  plane: 'XY',
  components: [],
  outputs: {
    profiles: profiles.map((profile) => ({
      profileId: profile.profileId,
      profileIndex: 0,
      area: profile.area,
      loop: {
        segments: [],
        winding: 'CCW',
      },
      verticesProxy: [],
    })),
    diagnostics: [],
  },
  uiState: {
    collapsed: false,
  },
})

describe('pickDefaultProfileRef', () => {
  it('links to nearest previous sketch', () => {
    const stack: FeatureStack = [
      sketchWithProfiles('feature-sketch-1', [{ profileId: 'prof_old', area: 10 }]),
      {
        type: 'extrude',
        featureId: 'feature-extrude-1',
        inputs: { profileRef: null },
        params: { depth: { kind: 'lit', value: 10 } },
        outputs: { bodyId: 'body-1' },
        uiState: { collapsed: false },
      },
      sketchWithProfiles('feature-sketch-2', [{ profileId: 'prof_new', area: 50 }]),
    ]

    expect(pickDefaultProfileRef(stack, stack.length)).toEqual({
      sourceFeatureId: 'feature-sketch-2',
      profileId: 'prof_new',
      profileIndex: 0,
    })
  })

  it('chooses largest-area profile when multiple exist', () => {
    const stack: FeatureStack = [
      sketchWithProfiles('feature-sketch-1', [
        { profileId: 'prof_large', area: 100 },
        { profileId: 'prof_small', area: 10 },
      ]),
    ]

    expect(pickDefaultProfileRef(stack, stack.length)).toEqual({
      sourceFeatureId: 'feature-sketch-1',
      profileId: 'prof_large',
      profileIndex: 0,
    })
  })

  it('returns null when nearest previous sketch has no profiles', () => {
    const stack: FeatureStack = [
      sketchWithProfiles('feature-sketch-1', [{ profileId: 'prof_old', area: 10 }]),
      sketchWithProfiles('feature-sketch-2', []),
    ]

    expect(pickDefaultProfileRef(stack, stack.length)).toBeNull()
  })

  it('keeps the compatibility alias wired to pickDefaultProfileRef', () => {
    const stack: FeatureStack = [
      sketchWithProfiles('feature-sketch-1', [{ profileId: 'prof_a', area: 10 }]),
    ]
    expect(findDefaultExtrudeProfileRef(stack, stack.length)).toEqual(
      pickDefaultProfileRef(stack, stack.length),
    )
  })
})
