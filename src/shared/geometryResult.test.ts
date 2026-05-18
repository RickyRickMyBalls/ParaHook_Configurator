import { describe, expect, it } from 'vitest'
import {
  cloneGeometryResultBundle,
  createAuthoritativeGeometryResultBundle,
  createDraftGeometryResultBundle,
  createGeometryResultBundle,
  type GeometryTopologyPreview,
  isGeometryResultAuthoritativeHandle,
  isGeometryResultBundle,
  isGeometryTopologyPreview,
} from './geometryResult'

const request = {
  graphDocumentId: 'graph-document-1',
  buildRequestId: 'build-request-1',
  partKeys: ['cube'],
}

const topologyPreview = (): GeometryTopologyPreview => ({
  faces: [
    {
      faceId: 'face-top',
      bodyId: 'body-1',
      label: 'Top',
    },
  ],
  triangleFaceIds: ['face-top', 'face-top', null],
  edges: [
    {
      edgeId: 'edge-front',
      bodyId: 'body-1',
      faceIds: ['face-top'],
      polyline: [0, 0, 0, 1, 0, 0],
      label: 'Front edge',
    },
  ],
  points: [
    {
      pointId: 'point-origin',
      bodyId: 'body-1',
      position: [0, 0, 0],
      label: 'Origin',
    },
  ],
})

describe('geometryResult authoritative contract', () => {
  it('keeps draft bundles valid with a null authoritative handle', () => {
    const bundle = createDraftGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })

    expect(bundle.resultClass).toBe('draft')
    expect(bundle.authoritativeHandle).toBeNull()
    expect(bundle.topologyPreview).toBeNull()
    expect(isGeometryResultBundle(bundle)).toBe(true)
  })

  it('represents authoritative bundles only when a valid handle is present', () => {
    const bundle = createAuthoritativeGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-1',
      },
    })

    expect(bundle.resultClass).toBe('authoritative')
    expect(bundle.authoritativeHandle).toEqual({
      resourceType: 'shape_set',
      handleId: 'shape-set-1',
    })
    expect(isGeometryResultAuthoritativeHandle(bundle.authoritativeHandle)).toBe(true)
    expect(isGeometryResultBundle(bundle)).toBe(true)
  })

  it('carries semantic topology previews beside mesh previews', () => {
    const topology = topologyPreview()
    const bundle = createAuthoritativeGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: {
        vertices: [0, 0, 0, 1, 0, 0, 0, 1, 0],
        indices: [0, 1, 2],
      },
      topologyPreview: topology,
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-1',
      },
    })

    expect(bundle.topologyPreview).toEqual(topology)
    expect(bundle.topologyPreview).not.toBe(topology)
    expect(bundle.topologyPreview?.edges[0]?.polyline).not.toBe(topology.edges[0]?.polyline)
    expect(isGeometryTopologyPreview(bundle.topologyPreview)).toBe(true)
    expect(isGeometryResultBundle(bundle)).toBe(true)
  })

  it('deep clones semantic topology previews with retained geometry bundles', () => {
    const bundle = createDraftGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: null,
      topologyPreview: topologyPreview(),
      diagnostics: [],
      trace: [],
    })

    const clone = cloneGeometryResultBundle(bundle)

    expect(clone.topologyPreview).toEqual(bundle.topologyPreview)
    expect(clone.topologyPreview).not.toBe(bundle.topologyPreview)
    expect(clone.topologyPreview?.faces[0]).not.toBe(bundle.topologyPreview?.faces[0])
    expect(clone.topologyPreview?.edges[0]?.faceIds).not.toBe(
      bundle.topologyPreview?.edges[0]?.faceIds,
    )
    expect(clone.topologyPreview?.edges[0]?.polyline).not.toBe(
      bundle.topologyPreview?.edges[0]?.polyline,
    )
    expect(clone.topologyPreview?.points[0]?.position).not.toBe(
      bundle.topologyPreview?.points[0]?.position,
    )
  })

  it('rejects malformed topology preview packets', () => {
    const bundle = createDraftGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: null,
      topologyPreview: {
        ...topologyPreview(),
        edges: [
          {
            edgeId: 'edge-front',
            bodyId: 'body-1',
            faceIds: ['face-top'],
            polyline: [0, 0],
          },
        ],
      },
      diagnostics: [],
      trace: [],
    })

    expect(isGeometryTopologyPreview(bundle.topologyPreview)).toBe(false)
    expect(isGeometryResultBundle(bundle)).toBe(false)
  })

  it('rejects topology preview face references that do not resolve to declared faces', () => {
    const bundle = createDraftGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: null,
      topologyPreview: {
        ...topologyPreview(),
        triangleFaceIds: ['missing-face'],
      },
      diagnostics: [],
      trace: [],
    })

    expect(isGeometryTopologyPreview(bundle.topologyPreview)).toBe(false)
    expect(isGeometryResultBundle(bundle)).toBe(false)
  })

  it('accepts older mesh-only result payloads without topology preview fields', () => {
    const bundle = createDraftGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })
    const legacyPayload = { ...bundle }
    delete (legacyPayload as Partial<typeof legacyPayload>).topologyPreview

    expect(isGeometryResultBundle(legacyPayload)).toBe(true)
  })

  it('rejects authoritative bundles without a handle', () => {
    expect(() =>
      createGeometryResultBundle({
        request,
        resultClass: 'authoritative',
        status: 'ok',
        bodies: {},
        meshPreview: null,
        diagnostics: [],
        trace: [],
        authoritativeHandle: null,
      }),
    ).toThrow('Authoritative geometry results require an authoritative handle.')
  })

  it('rejects draft bundles that try to carry an authoritative handle', () => {
    expect(() =>
      createGeometryResultBundle({
        request,
        resultClass: 'draft',
        status: 'ok',
        bodies: {},
        meshPreview: null,
        diagnostics: [],
        trace: [],
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    ).toThrow('Draft geometry results cannot carry an authoritative handle.')
  })
})
