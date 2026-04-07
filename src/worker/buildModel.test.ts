import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createAuthoritativeGeometryResultBundle,
  isGeometryResultBundle,
} from '../shared/geometryResult'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  type CompiledBuildData,
} from '../shared/buildTypes'
import { buildModel, buildModelResult } from './buildModel'

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
            profilesResolved: [resolvedProfile('cube-profile-1', 400)],
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

afterEach(() => {
  vi.doUnmock('./authoritative/buildAuthoritativeGeometry')
  vi.restoreAllMocks()
})

describe('buildModel retained geometry result contract', () => {
  it('keeps draft-preview retained geometry artifact-safe when authoritative execution is not requested', async () => {
    const result = await buildModelResult({
      compiledBuildData: cubeCompiledBuildData(),
      executionIntent: {
        ...DEFAULT_BUILD_EXECUTION_INTENT,
        geometryTarget: 'draft_preview',
      },
      requestIdentity: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
      },
    })

    expect(isGeometryResultBundle(result.draftGeometryResult)).toBe(true)
    expect(result.authoritativeGeometryResult).toBeNull()
    expect(result.draftGeometryResult).toEqual(
      expect.objectContaining({
        schemaVersion: 1,
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-1',
          partKeys: ['cube'],
        },
        resultClass: 'draft',
        status: 'ok',
        authoritativeHandle: null,
      }),
    )
    expect(Object.keys(result.draftGeometryResult?.bodies ?? {})).toEqual(['cube:cube-body-1'])
    expect(result.draftGeometryResult?.meshPreview).not.toBeNull()
    expect(result.parts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          partKeyStr: 'cube',
          kind: 'mesh',
        }),
      ]),
    )
  })

  it('keeps the legacy artifact-only buildModel wrapper working for existing callers', async () => {
    const parts = await buildModel({
      compiledBuildData: cubeCompiledBuildData(),
    })

    expect(parts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          partKeyStr: 'cube',
          kind: 'mesh',
        }),
      ]),
    )
  })

  it('routes authoritative requests through the worker-owned authoritative adapter seam', async () => {
    vi.resetModules()
    const authoritativeBundle = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-3',
        partKeys: ['cube'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-3',
      },
    })
    const buildAuthoritativeGeometry = vi.fn(async () => ({
      authoritativeGeometryResult: authoritativeBundle,
    }))
    vi.doMock('./authoritative/buildAuthoritativeGeometry', () => ({
      buildAuthoritativeGeometry,
    }))

    const { buildModelResult } = await import('./buildModel')
    const result = await buildModelResult({
      compiledBuildData: cubeCompiledBuildData(),
      executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
      requestIdentity: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-3',
      },
    })

    expect(buildAuthoritativeGeometry).toHaveBeenCalledWith({
      compiledBuildData: expect.objectContaining({
        orderedPartKeys: ['cube'],
      }),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-3',
        partKeys: ['cube'],
      },
    })
    expect(result.authoritativeGeometryResult).toEqual(authoritativeBundle)
    expect(result.draftGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'draft',
      }),
    )
  })

  it('skips the authoritative adapter seam for draft-preview requests', async () => {
    vi.resetModules()
    const buildAuthoritativeGeometry = vi.fn(async () => ({
      authoritativeGeometryResult: createAuthoritativeGeometryResultBundle({
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-4',
          partKeys: ['cube'],
        },
        bodies: {},
        meshPreview: null,
        diagnostics: [],
        trace: [],
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-4',
        },
      }),
    }))
    vi.doMock('./authoritative/buildAuthoritativeGeometry', () => ({
      buildAuthoritativeGeometry,
    }))

    const { buildModelResult } = await import('./buildModel')
    const result = await buildModelResult({
      compiledBuildData: cubeCompiledBuildData(),
      executionIntent: {
        ...DEFAULT_BUILD_EXECUTION_INTENT,
        geometryTarget: 'draft_preview',
      },
      requestIdentity: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-4',
      },
    })

    expect(buildAuthoritativeGeometry).not.toHaveBeenCalled()
    expect(result.authoritativeGeometryResult).toBeNull()
    expect(result.draftGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'draft',
      }),
    )
  })

  it('can represent an authoritative retained geometry bundle without changing live build behavior', () => {
    const authoritativeBundle = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-2',
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

    expect(isGeometryResultBundle(authoritativeBundle)).toBe(true)
    expect(authoritativeBundle).toEqual(
      expect.objectContaining({
        resultClass: 'authoritative',
        status: 'ok',
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    )
  })
})
