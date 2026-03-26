import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_BUILD_EXECUTION_INTENT, type CompiledBuildData } from '../../shared/buildTypes'

const bundleArtifacts = (
  result: { bundle: { entries: Array<{ artifacts: Array<{ partKeyStr: string; kind: string }> }> } },
) => result.bundle.entries.flatMap((entry) => entry.artifacts)

const cubeCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['cube'],
  resolvedParts: {},
  resolvedShared: {
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
  },
  outputEntries: [],
})

const multiCubeCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['cube#1', 'cube#2'],
  resolvedParts: {},
  resolvedShared: {
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
  },
  outputEntries: [],
})

const buildRequest = (options: {
  seq: number
  buildRequestId: string
  compiledBuildData: CompiledBuildData
  changedParamIds: string[]
}) => ({
  type: 'build' as const,
  lane: 'build' as const,
  seq: options.seq,
  projectFileId: 'graph-native-project',
  graphDocumentId: 'graph-document-1',
  buildRequestId: options.buildRequestId,
  executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
  buildIdentity: {
    graphRevision: options.seq,
    targetBuildUnitIds: options.compiledBuildData.orderedPartKeys.map(
      (partKey) => `build-unit:${partKey}`,
    ),
  },
  invalidation: {
    affectedBuildUnitIds: options.compiledBuildData.orderedPartKeys.map(
      (partKey) => `build-unit:${partKey}`,
    ),
  },
  compiledBuildData: options.compiledBuildData,
  changedParamIds: options.changedParamIds,
})

describe('buildPipeline spaghetti stats integration', () => {
  it('prefers compiled graph-native build data when present', async () => {
    vi.resetModules()
    const { buildPipeline } = await import('./buildPipeline')
    const progress: Array<{ partKey: string; state: string }> = []

    const result = await buildPipeline(
      buildRequest({
        seq: 1,
        buildRequestId: 'build-request-1',
        compiledBuildData: cubeCompiledBuildData(),
        changedParamIds: ['sp_full'],
      }),
      (message) => {
        progress.push({ partKey: message.partKey, state: message.state })
      },
    )

    expect(
      progress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube'])
    expect(bundleArtifacts(result)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          partKeyStr: 'cube',
          kind: 'mesh',
        }),
      ]),
    )
  })

  it('emits graph-native progress rows using canonical source/build identity', async () => {
    vi.resetModules()
    const { buildPipeline } = await import('./buildPipeline')
    const progress: Array<{ partKey: string; state: string; lane?: string }> = []

    const result = await buildPipeline(
      buildRequest({
        seq: 1,
        buildRequestId: 'build-request-1',
        compiledBuildData: cubeCompiledBuildData(),
        changedParamIds: ['sp_full'],
      }),
      (message) => {
        progress.push({ partKey: message.partKey, state: message.state, lane: message.lane })
      },
    )

    expect(
      progress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube'])
    expect(progress.every((message) => message.lane === 'build')).toBe(true)
    expect(progress.some((message) => message.partKey === 's001')).toBe(false)
    expect(result.lane).toBe('build')
    expect(bundleArtifacts(result).some((part) => part.partKeyStr === 'cube')).toBe(true)
  })

  it('keeps repeated unchanged spaghetti builds on deterministic cache-hit rows', async () => {
    vi.resetModules()
    const { buildPipeline } = await import('./buildPipeline')
    await buildPipeline(
      buildRequest({
        seq: 1,
        buildRequestId: 'build-request-1',
        compiledBuildData: cubeCompiledBuildData(),
        changedParamIds: ['sp_full'],
      }),
      () => {},
    )

    const repeatedProgress: Array<{ partKey: string; state: string }> = []
    await buildPipeline(
      buildRequest({
        seq: 2,
        buildRequestId: 'build-request-2',
        compiledBuildData: cubeCompiledBuildData(),
        changedParamIds: [],
      }),
      (message) => {
        repeatedProgress.push({ partKey: message.partKey, state: message.state })
      },
    )

    expect(repeatedProgress).toEqual(
      expect.arrayContaining([
        { partKey: 'cube', state: 'cache_hit' },
      ]),
    )
    expect(
      repeatedProgress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube'])
  })

  it('emits deterministic multi-part progress rows and preserves repeated cache-hit ordering', async () => {
    vi.resetModules()
    const { buildPipeline } = await import('./buildPipeline')
    const firstProgress: Array<{ partKey: string; state: string }> = []

    const firstResult = await buildPipeline(
      buildRequest({
        seq: 10,
        buildRequestId: 'build-request-10',
        compiledBuildData: multiCubeCompiledBuildData(),
        changedParamIds: ['sp_full'],
      }),
      (message) => {
        firstProgress.push({ partKey: message.partKey, state: message.state })
      },
    )

    expect(
      firstProgress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube#1', 'cube#2'])
    expect(firstResult.lane).toBe('build')
    expect(bundleArtifacts(firstResult).map((part) => part.partKeyStr)).toEqual(
      expect.arrayContaining(['cube#1', 'cube#2']),
    )

    const repeatedProgress: Array<{ partKey: string; state: string }> = []
    await buildPipeline(
      buildRequest({
        seq: 11,
        buildRequestId: 'build-request-11',
        compiledBuildData: multiCubeCompiledBuildData(),
        changedParamIds: [],
      }),
      (message) => {
        repeatedProgress.push({ partKey: message.partKey, state: message.state })
      },
    )

    expect(
      repeatedProgress.filter((message) => message.state === 'queued').map((message) => message.partKey),
    ).toEqual(['cube#1', 'cube#2'])
    expect(repeatedProgress).toEqual(
      expect.arrayContaining([
        { partKey: 'cube#1', state: 'cache_hit' },
        { partKey: 'cube#2', state: 'cache_hit' },
      ]),
    )
  })
})
