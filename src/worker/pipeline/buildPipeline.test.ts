import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_BUILD_EXECUTION_INTENT, type CompiledBuildData } from '../../shared/buildTypes'
import { createAuthoritativeGeometryResultBundle } from '../../shared/geometryResult'

const bundleArtifacts = (
  result: { bundle: { entries: Array<{ artifacts: Array<{ partKeyStr: string; kind: string }> }> } },
) => result.bundle.entries.flatMap((entry) => entry.artifacts)

const emptyProfileLoop = {
  segments: [],
  winding: 'CCW' as const,
}

const resolvedProfile = (profileId: string, area: number) => ({
  profileId,
  profileIndex: 0,
  area,
  loop: emptyProfileLoop,
  verticesProxy: [
    { x: 0, y: 0 },
    { x: 20, y: 0 },
    { x: 20, y: 20 },
    { x: 0, y: 20 },
  ],
})

const resolvedProfileRef = (sketchFeatureId: string, profileId: string) => ({
  sketchFeatureId,
  profileId,
  profileIndex: 0,
})

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
              resolvedProfile('cube-profile-1', 400),
            ],
          },
          {
            op: 'extrude',
            featureId: 'cube-extrude-1',
            profileRef: resolvedProfileRef('cube-sketch-1', 'cube-profile-1'),
            extrudeType: 'Body',
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
              resolvedProfile('cube-2-profile-1', 400),
            ],
          },
          {
            op: 'extrude',
            featureId: 'cube-2-extrude-1',
            profileRef: resolvedProfileRef('cube-2-sketch-1', 'cube-2-profile-1'),
            extrudeType: 'Body',
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
              resolvedProfile('cube-1-profile-1', 400),
            ],
          },
          {
            op: 'extrude',
            featureId: 'cube-1-extrude-1',
            profileRef: resolvedProfileRef('cube-1-sketch-1', 'cube-1-profile-1'),
            extrudeType: 'Body',
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
  executionIntent?: typeof DEFAULT_BUILD_EXECUTION_INTENT
}) => ({
  type: 'build' as const,
  lane: 'build' as const,
  seq: options.seq,
  projectFileId: 'graph-native-project',
  graphDocumentId: 'graph-document-1',
  buildRequestId: options.buildRequestId,
  executionIntent:
    options.executionIntent ?? {
      ...DEFAULT_BUILD_EXECUTION_INTENT,
      geometryTarget: 'draft_preview' as const,
    },
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

afterEach(() => {
  vi.doUnmock('../authoritative/buildAuthoritativeGeometry')
  vi.restoreAllMocks()
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
    expect(result.draftGeometryResult).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-1',
          partKeys: ['cube'],
        },
        resultClass: 'draft',
        status: 'ok',
      }),
    )
    expect(result.authoritativeGeometryResult).toBeUndefined()
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

  it('passes through authoritative retained geometry emitted by the authoritative adapter seam', async () => {
    const authoritativeBundle = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-12',
        partKeys: ['cube'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-1',
      },
    })

    expect(authoritativeBundle.resultClass).toBe('authoritative')
    expect(authoritativeBundle.authoritativeHandle).toEqual({
      resourceType: 'shape_set',
      handleId: 'shape-set-1',
    })

    vi.resetModules()
    const buildAuthoritativeGeometry = vi.fn(async () => ({
      authoritativeGeometryResult: authoritativeBundle,
    }))
    vi.doMock('../authoritative/buildAuthoritativeGeometry', () => ({
      buildAuthoritativeGeometry,
    }))
    const { buildPipeline } = await import('./buildPipeline')
    const result = await buildPipeline(
      buildRequest({
        seq: 12,
        buildRequestId: 'build-request-12',
        compiledBuildData: cubeCompiledBuildData(),
        changedParamIds: ['sp_full'],
        executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
      }),
      () => {},
    )

    expect(result.draftGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'draft',
        status: 'ok',
        authoritativeHandle: null,
      }),
    )
    expect(result.authoritativeGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'authoritative',
        status: 'ok',
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    )
    expect(buildAuthoritativeGeometry).toHaveBeenCalledWith({
      compiledBuildData: expect.objectContaining({
        orderedPartKeys: ['cube'],
      }),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-12',
        partKeys: ['cube'],
      },
    })
  })

  it('exits before buildModelResult when the request is already superseded at the first checkpoint', async () => {
    vi.resetModules()
    const buildModelResult = vi.fn(async () => ({
      parts: [],
      draftGeometryResult: undefined,
      authoritativeGeometryResult: undefined,
    }))
    vi.doMock('../buildModel', () => ({
      buildModelResult,
    }))
    const {
      buildPipeline,
      BuildSupersededError,
    } = await import('./buildPipeline')

    await expect(
      buildPipeline(
        buildRequest({
          seq: 20,
          buildRequestId: 'build-request-20',
          compiledBuildData: cubeCompiledBuildData(),
          changedParamIds: ['sp_full'],
        }),
        () => {},
        {
          isSuperseded: () => true,
        },
      ),
    ).rejects.toBeInstanceOf(BuildSupersededError)
    expect(buildModelResult).not.toHaveBeenCalled()
  })

  it('stops at the next part checkpoint when a request becomes superseded mid-loop', async () => {
    vi.resetModules()
    vi.doMock('../buildModel', () => ({
      buildModelResult: vi.fn(async () => ({
        parts: [
          {
            id: 'cube-1',
            label: 'Cube 1',
            kind: 'mesh' as const,
            mesh: {
              vertices: [],
              indices: [],
            },
            partKeyStr: 'cube#1',
            partKey: {
              id: 'cube',
              instance: 1,
            },
          },
          {
            id: 'cube-2',
            label: 'Cube 2',
            kind: 'mesh' as const,
            mesh: {
              vertices: [],
              indices: [],
            },
            partKeyStr: 'cube#2',
            partKey: {
              id: 'cube',
              instance: 2,
            },
          },
        ],
        draftGeometryResult: undefined,
        authoritativeGeometryResult: undefined,
      })),
    }))
    const {
      buildPipeline,
      BuildSupersededError,
    } = await import('./buildPipeline')
    const progress: Array<{ partKey: string; state: string }> = []
    let superseded = false

    await expect(
      buildPipeline(
        buildRequest({
          seq: 21,
          buildRequestId: 'build-request-21',
          compiledBuildData: multiCubeCompiledBuildData(),
          changedParamIds: ['sp_full'],
        }),
        (message) => {
          progress.push({ partKey: message.partKey, state: message.state })
          if (message.partKey === 'cube#1' && message.state === 'done') {
            superseded = true
          }
        },
        {
          isSuperseded: () => superseded,
        },
      ),
    ).rejects.toBeInstanceOf(BuildSupersededError)

    expect(progress).toEqual(
      expect.arrayContaining([
        { partKey: 'cube#1', state: 'queued' },
        { partKey: 'cube#1', state: 'done' },
      ]),
    )
    expect(progress.some((entry) => entry.partKey === 'cube#2')).toBe(false)
  })
})
