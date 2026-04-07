import { describe, expect, it } from 'vitest'
import {
  createAuthoritativeGeometryResultBundle,
  createDraftGeometryResultBundle,
} from './geometryResult'
import {
  createAuthoritativeExportInput,
  deriveAuthoritativeExportInput,
  isAuthoritativeExportInput,
} from './exportTypes'

const createRequest = () => ({
  graphDocumentId: 'graph-document-1',
  buildRequestId: 'build-request-1',
  partKeys: ['part-a', 'part-b'],
})

describe('authoritative export input contract', () => {
  it('publishes a typed export input from authoritative retained geometry', () => {
    const request = createRequest()
    const bundle = createAuthoritativeGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: {
        vertices: [0, 0, 0, 1, 0, 0, 0, 1, 0],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-1',
      },
    })

    const exportInput = deriveAuthoritativeExportInput(bundle)

    expect(exportInput).toEqual({
      schemaVersion: 1,
      request,
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-1',
      },
    })
    expect(isAuthoritativeExportInput(exportInput)).toBe(true)
  })

  it('does not derive export input from draft retained geometry', () => {
    const request = createRequest()
    const bundle = createDraftGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: {
        vertices: [0, 0, 0, 1, 0, 0, 0, 1, 0],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    expect(deriveAuthoritativeExportInput(bundle)).toBeNull()
  })

  it('stays independent from viewport-only preview presence', () => {
    const request = createRequest()
    const bundle = createAuthoritativeGeometryResultBundle({
      request,
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-2',
      },
    })

    expect(deriveAuthoritativeExportInput(bundle)).toEqual({
      schemaVersion: 1,
      request,
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-2',
      },
    })
  })

  it('clones request identity when creating export input directly', () => {
    const request = createRequest()
    const exportInput = createAuthoritativeExportInput({
      request,
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-3',
      },
    })

    request.partKeys.push('part-c')

    expect(exportInput.request.partKeys).toEqual(['part-a', 'part-b'])
  })
})
