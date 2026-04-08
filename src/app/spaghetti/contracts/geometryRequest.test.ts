import { describe, expect, it } from 'vitest'
import {
  isGeometryRequestPayload,
  isGeometryRequestProfileLoop,
} from './geometryRequest'

describe('geometryRequest payload contract', () => {
  it('accepts loop payloads with typed line, bezier, and arc segments', () => {
    const loop = {
      segments: [
        {
          kind: 'line2',
          a: { x: 0, y: 0 },
          b: { x: 10, y: 0 },
        },
        {
          kind: 'bezier2',
          p0: { x: 10, y: 0 },
          p1: { x: 12, y: 2 },
          p2: { x: 14, y: 3 },
          p3: { x: 15, y: 5 },
        },
        {
          kind: 'arc3pt2',
          start: { x: 15, y: 5 },
          mid: { x: 8, y: 9 },
          end: { x: 0, y: 0 },
        },
      ],
      winding: 'CCW',
    }

    expect(isGeometryRequestProfileLoop(loop)).toBe(true)
    expect(
      isGeometryRequestPayload({
        schemaVersion: 1,
        parts: {
          sketchPart: [
            {
              op: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              profilesResolved: [
                {
                  profileId: 'profile-1',
                  profileIndex: 0,
                  area: 42,
                  loop,
                  verticesProxy: [
                    { x: 0, y: 0 },
                    { x: 10, y: 0 },
                    { x: 15, y: 5 },
                  ],
                },
              ],
            },
          ],
        },
      }),
    ).toBe(true)
  })

  it('rejects loop payloads with malformed segment shapes', () => {
    expect(
      isGeometryRequestProfileLoop({
        segments: [
          {
            kind: 'line2',
            a: { x: 0, y: 0 },
          },
        ],
        winding: 'CCW',
      }),
    ).toBe(false)

    expect(
      isGeometryRequestPayload({
        schemaVersion: 1,
        parts: {
          sketchPart: [
            {
              op: 'sketch',
              featureId: 'sketch-1',
              profilesResolved: [
                {
                  profileId: 'profile-1',
                  profileIndex: 0,
                  area: 42,
                  loop: {
                    segments: [
                      {
                        kind: 'arc3pt2',
                        start: { x: 0, y: 0 },
                        mid: { x: 5, y: 5 },
                      },
                    ],
                    winding: 'CW',
                  },
                  verticesProxy: [
                    { x: 0, y: 0 },
                    { x: 5, y: 5 },
                    { x: 10, y: 0 },
                  ],
                },
              ],
            },
          ],
        },
      }),
    ).toBe(false)
  })

  it('accepts extrude payloads with explicit single and aggregate profileSelection descriptors', () => {
    expect(
      isGeometryRequestPayload({
        schemaVersion: 1,
        parts: {
          extrudePart: [
            {
              op: 'extrude',
              featureId: 'extrude-single',
              profileSelection: {
                mode: 'single',
                sketchFeatureId: 'sketch-1',
                profileId: 'profile-1',
                profileIndex: 0,
              },
              profileRef: {
                sketchFeatureId: 'sketch-1',
                profileId: 'profile-1',
                profileIndex: 0,
              },
              extrudeType: 'Body',
              depthResolved: 20,
              taperResolved: 0,
              offsetResolved: 0,
            },
            {
              op: 'extrude',
              featureId: 'extrude-all',
              profileSelection: {
                mode: 'allFromSketch',
                sketchFeatureId: 'sketch-2',
              },
              profileRef: null,
              extrudeType: 'Body',
              depthResolved: 10,
              taperResolved: 0,
              offsetResolved: 0,
            },
          ],
        },
      }),
    ).toBe(true)
  })

  it('rejects malformed explicit profileSelection descriptors', () => {
    expect(
      isGeometryRequestPayload({
        schemaVersion: 1,
        parts: {
          extrudePart: [
            {
              op: 'extrude',
              featureId: 'extrude-bad-selection',
              profileSelection: {
                mode: 'single',
                sketchFeatureId: 'sketch-1',
                profileId: 'profile-1',
              },
              profileRef: null,
              extrudeType: 'Body',
              depthResolved: 20,
              taperResolved: 0,
              offsetResolved: 0,
            },
          ],
        },
      }),
    ).toBe(false)
  })
})
