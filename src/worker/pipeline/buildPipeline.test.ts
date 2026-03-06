import { describe, expect, it, vi } from 'vitest'

const cubePayload = () =>
  ({
    width: 1,
    length: 2,
    height: 3,
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        cube: [
          {
            op: 'sketch',
            featureId: 'cube-sketch-1',
            profilesResolved: [
              {
                profileId: 'cube-profile-1',
                area: 400,
                vertices: [
                  { x: 0, y: 0 },
                  { x: 20, y: 0 },
                  { x: 20, y: 20 },
                  { x: 0, y: 20 },
                ],
              },
            ],
          },
          {
            op: 'extrude',
            featureId: 'cube-extrude-1',
            profileRef: {
              sketchFeatureId: 'cube-sketch-1',
              profileId: 'cube-profile-1',
            },
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'cube-body-1',
          },
        ],
      },
    },
  }) as unknown as { width: number; length: number; height: number }

const multiCubePayload = () =>
  ({
    width: 1,
    length: 2,
    height: 3,
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        'cube#2': [
          {
            op: 'sketch',
            featureId: 'cube-2-sketch-1',
            profilesResolved: [
              {
                profileId: 'cube-2-profile-1',
                area: 400,
                vertices: [
                  { x: 0, y: 0 },
                  { x: 20, y: 0 },
                  { x: 20, y: 20 },
                  { x: 0, y: 20 },
                ],
              },
            ],
          },
          {
            op: 'extrude',
            featureId: 'cube-2-extrude-1',
            profileRef: {
              sketchFeatureId: 'cube-2-sketch-1',
              profileId: 'cube-2-profile-1',
            },
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'cube-body-1',
          },
        ],
        'cube#1': [
          {
            op: 'sketch',
            featureId: 'cube-1-sketch-1',
            profilesResolved: [
              {
                profileId: 'cube-1-profile-1',
                area: 400,
                vertices: [
                  { x: 0, y: 0 },
                  { x: 20, y: 0 },
                  { x: 20, y: 20 },
                  { x: 0, y: 20 },
                ],
              },
            ],
          },
          {
            op: 'extrude',
            featureId: 'cube-1-extrude-1',
            profileRef: {
              sketchFeatureId: 'cube-1-sketch-1',
              profileId: 'cube-1-profile-1',
            },
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'cube-body-1',
          },
        ],
      },
    },
  }) as unknown as { width: number; length: number; height: number }

describe('buildPipeline spaghetti stats integration', () => {
  it('emits spaghetti progress rows using canonical source/build identity', async () => {
    vi.resetModules()
    const { buildPipeline } = await import('./buildPipeline')
    const progress: Array<{ partKey: string; state: string }> = []

    const result = await buildPipeline(
      {
        type: 'build',
        seq: 1,
        payload: cubePayload(),
        changedParamIds: ['sp_full'],
      },
      (message) => {
        progress.push({ partKey: message.partKey, state: message.state })
      },
    )

    expect(
      progress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube', 'assembled'])
    expect(progress.some((message) => message.partKey === 's001')).toBe(false)
    expect(result.parts.some((part) => part.partKeyStr === 'cube')).toBe(true)
  })

  it('keeps repeated unchanged spaghetti builds on deterministic cache-hit rows', async () => {
    vi.resetModules()
    const { buildPipeline } = await import('./buildPipeline')
    await buildPipeline(
      {
        type: 'build',
        seq: 1,
        payload: cubePayload(),
        changedParamIds: ['sp_full'],
      },
      () => {},
    )

    const repeatedProgress: Array<{ partKey: string; state: string }> = []
    await buildPipeline(
      {
        type: 'build',
        seq: 2,
        payload: cubePayload(),
        changedParamIds: [],
      },
      (message) => {
        repeatedProgress.push({ partKey: message.partKey, state: message.state })
      },
    )

    expect(repeatedProgress).toEqual(
      expect.arrayContaining([
        { partKey: 'cube', state: 'cache_hit' },
        { partKey: 'assembled', state: 'cache_hit' },
      ]),
    )
    expect(
      repeatedProgress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube', 'assembled'])
  })

  it('emits deterministic multi-part progress rows and preserves repeated cache-hit ordering', async () => {
    vi.resetModules()
    const { buildPipeline } = await import('./buildPipeline')
    const firstProgress: Array<{ partKey: string; state: string }> = []

    const firstResult = await buildPipeline(
      {
        type: 'build',
        seq: 10,
        payload: multiCubePayload(),
        changedParamIds: ['sp_full'],
      },
      (message) => {
        firstProgress.push({ partKey: message.partKey, state: message.state })
      },
    )

    expect(
      firstProgress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube#1', 'cube#2', 'assembled'])
    expect(firstResult.parts.map((part) => part.partKeyStr)).toEqual(
      expect.arrayContaining(['cube#1', 'cube#2']),
    )

    const repeatedProgress: Array<{ partKey: string; state: string }> = []
    await buildPipeline(
      {
        type: 'build',
        seq: 11,
        payload: multiCubePayload(),
        changedParamIds: [],
      },
      (message) => {
        repeatedProgress.push({ partKey: message.partKey, state: message.state })
      },
    )

    expect(
      repeatedProgress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube#1', 'cube#2', 'assembled'])
    expect(repeatedProgress).toEqual(
      expect.arrayContaining([
        { partKey: 'cube#1', state: 'cache_hit' },
        { partKey: 'cube#2', state: 'cache_hit' },
        { partKey: 'assembled', state: 'cache_hit' },
      ]),
    )
  })
})
