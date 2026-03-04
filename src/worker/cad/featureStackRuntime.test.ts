import { describe, expect, it, vi } from 'vitest'
import { buildModel } from '../buildModel'
import {
  executeFeatureStack,
  type FeatureStackIRPayload,
} from './featureStackRuntime'

const rectangleVertices = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 5 },
  { x: 0, y: 5 },
]

const basePayload = (): FeatureStackIRPayload => ({
  schemaVersion: 1,
  parts: {
    baseplate: [
      {
        op: 'sketch',
        featureId: 'sketch-1',
        profilesResolved: [
          {
            profileId: 'prof-a',
            area: 50,
            vertices: rectangleVertices,
          },
        ],
      },
      {
        op: 'extrude',
        featureId: 'extrude-1',
        profileRef: {
          sketchFeatureId: 'sketch-1',
          profileId: 'prof-a',
        },
        depthResolved: 3,
        bodyId: 'body-a',
      },
    ],
  },
})

describe('executeFeatureStack', () => {
  it('builds a rectangle extrude body', () => {
    const result = executeFeatureStack(basePayload())
    expect(Object.keys(result.bodies)).toEqual(['body-a'])
    expect(result.bodies['body-a'].mesh.vertices.length).toBeGreaterThan(0)
    expect(result.bodies['body-a'].mesh.indices.length).toBeGreaterThan(0)
    expect(result.diagnostics).toEqual([])
  })

  it('supports multiple profile extrudes', () => {
    const payload = basePayload()
    payload.parts.baseplate[0] = {
      op: 'sketch',
      featureId: 'sketch-1',
      profilesResolved: [
        { profileId: 'prof-a', area: 50, vertices: rectangleVertices },
        {
          profileId: 'prof-b',
          area: 9,
          vertices: [
            { x: 20, y: 0 },
            { x: 23, y: 0 },
            { x: 23, y: 3 },
            { x: 20, y: 3 },
          ],
        },
      ],
    }
    payload.parts.baseplate.push({
      op: 'extrude',
      featureId: 'extrude-2',
      profileRef: {
        sketchFeatureId: 'sketch-1',
        profileId: 'prof-b',
      },
      depthResolved: 2,
      bodyId: 'body-b',
    })

    const result = executeFeatureStack(payload)
    expect(Object.keys(result.bodies)).toEqual(['body-a', 'body-b'])
  })

  it('sorts body output deterministically', () => {
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        zPart: [
          {
            op: 'sketch',
            featureId: 'z-sketch',
            profilesResolved: [{ profileId: 'z-prof', area: 1, vertices: rectangleVertices }],
          },
          {
            op: 'extrude',
            featureId: 'z-extrude',
            profileRef: { sketchFeatureId: 'z-sketch', profileId: 'z-prof' },
            depthResolved: 1,
            bodyId: 'body-z',
          },
        ],
        aPart: [
          {
            op: 'sketch',
            featureId: 'a-sketch',
            profilesResolved: [{ profileId: 'a-prof', area: 1, vertices: rectangleVertices }],
          },
          {
            op: 'extrude',
            featureId: 'a-extrude',
            profileRef: { sketchFeatureId: 'a-sketch', profileId: 'a-prof' },
            depthResolved: 1,
            bodyId: 'body-a',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)
    expect(Object.keys(result.bodies)).toEqual(['body-a', 'body-z'])
    expect(result.bodyTrace.map((item) => item.partKey)).toEqual(['aPart', 'zPart'])
  })

  it('handles missing profileRef safely', () => {
    const payload = basePayload()
    payload.parts.baseplate[1] = {
      op: 'extrude',
      featureId: 'extrude-1',
      profileRef: null,
      depthResolved: 3,
      bodyId: 'body-a',
    }

    const result = executeFeatureStack(payload)
    expect(result.bodies).toEqual({})
    expect(result.diagnostics.some((item) => item.reason === 'missing_profile_ref')).toBe(true)
  })

  it('keeps first body on duplicate bodyId', () => {
    const payload = basePayload()
    payload.parts.baseplate.push({
      op: 'extrude',
      featureId: 'extrude-2',
      profileRef: {
        sketchFeatureId: 'sketch-1',
        profileId: 'prof-a',
      },
      depthResolved: 6,
      bodyId: 'body-a',
    })

    const result = executeFeatureStack(payload)
    expect(Object.keys(result.bodies)).toEqual(['body-a'])
    expect(
      result.diagnostics.some((item) => item.reason === 'duplicate_body_id'),
    ).toBe(true)
  })
})

describe('buildModel diagnostics flush', () => {
  it('flushes unique warnings once per build', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    buildModel({
      payload: {
        width: 1,
        length: 2,
        height: 3,
        sp_featureStackIR: {
          schemaVersion: 1,
          parts: {
            baseplate: [
              {
                op: 'extrude',
                featureId: 'e1',
                profileRef: null,
                depthResolved: 1,
                bodyId: 'dup',
              },
              {
                op: 'extrude',
                featureId: 'e1',
                profileRef: null,
                depthResolved: 1,
                bodyId: 'dup',
              },
            ],
          },
        },
      } as unknown as { width: number; length: number; height: number },
      instances: {},
    })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockRestore()
  })
})
