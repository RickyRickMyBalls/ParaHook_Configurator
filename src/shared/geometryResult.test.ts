import { describe, expect, it } from 'vitest'
import {
  createAuthoritativeGeometryResultBundle,
  createDraftGeometryResultBundle,
  createGeometryResultBundle,
  isGeometryResultAuthoritativeHandle,
  isGeometryResultBundle,
} from './geometryResult'

const request = {
  graphDocumentId: 'graph-document-1',
  buildRequestId: 'build-request-1',
  partKeys: ['cube'],
}

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
