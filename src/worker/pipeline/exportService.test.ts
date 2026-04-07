import { describe, expect, it } from 'vitest'
import { createAuthoritativeExportInput } from '../../shared/exportTypes'
import { exportService } from './exportService'

describe('exportService', () => {
  it('consumes the published authoritative export input contract', async () => {
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

    const result = await exportService({
      schemaVersion: 1,
      requestId: 'export-request-1',
      format: 'step',
      input,
    })

    expect(result).toEqual({
      requestId: 'export-request-1',
      format: 'step',
      filename: 'parahook-build-request-1.step',
      dataBase64: btoa('1:step:1:graph-document-1:build-request-1:shape-set-1'),
    })
  })
})
