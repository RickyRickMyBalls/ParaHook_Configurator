import { describe, expect, it, vi } from 'vitest'
import { createAuthoritativeExportInput } from '../../shared/exportTypes'
import { exportService } from './exportService'

describe('exportService', () => {
  it('writes STEP data from the published authoritative export input contract', async () => {
    const input = createAuthoritativeExportInput({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        partKeys: ['part-a'],
      },
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-1',
      },
    })
    const shapeSet = {
      ownedResources: [{ delete: vi.fn() }],
    }
    const oc = {}
    const writeStep = vi.fn(() => 'ISO-10303-21;\nEND-ISO-10303-21;\n')

    const result = await exportService({
      schemaVersion: 1,
      requestId: 'export-request-1',
      format: 'step',
      input,
    }, {
      getShapeSet: (handleId) => (handleId === 'shape-set-1' ? shapeSet : null),
      getOcInstance: async () => oc,
      writeStep,
    })

    expect(writeStep).toHaveBeenCalledWith(
      oc,
      shapeSet,
      'parahook-build-request-1.step',
    )
    expect(result).toEqual({
      requestId: 'export-request-1',
      format: 'step',
      filename: 'parahook-build-request-1.step',
      dataBase64: btoa('ISO-10303-21;\nEND-ISO-10303-21;\n'),
    })
  })

  it('rejects missing authoritative shape-set handles instead of returning a fake file', async () => {
    const input = createAuthoritativeExportInput({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        partKeys: ['part-a'],
      },
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-missing',
      },
    })
    const writeStep = vi.fn()

    await expect(
      exportService({
        schemaVersion: 1,
        requestId: 'export-request-1',
        format: 'step',
        input,
      }, {
        getShapeSet: () => null,
        getOcInstance: async () => ({}),
        writeStep,
      }),
    ).rejects.toThrow('Authoritative geometry is unavailable for export.')

    expect(writeStep).not.toHaveBeenCalled()
  })
})
