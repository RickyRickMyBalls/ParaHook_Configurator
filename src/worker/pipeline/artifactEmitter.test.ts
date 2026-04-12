import { describe, expect, it } from 'vitest'
import { DEFAULT_BUILD_EXECUTION_INTENT, type CompiledBuildData, type PartArtifact } from '../../shared/buildTypes'
import { createDraftGeometryResultBundle } from '../../shared/geometryResult'
import { emitArtifacts } from './artifactEmitter'

const baseExtrudeArtifact = (): PartArtifact => ({
  id: 'extrude',
  label: 'Extrude',
  kind: 'mesh',
  mesh: {
    vertices: [0, 0, 0, 1, 0, 0, 0, 1, 0],
    indices: [0, 1, 2],
  },
  partKeyStr: 'extrude',
  partKey: {
    id: 'extrude',
    instance: null,
  },
})

describe('artifactEmitter', () => {
  it('emits per-output-entry artifacts from geometry body ownership when bodyId is provided', () => {
    const compiledBuildData: CompiledBuildData = {
      orderedPartKeys: ['extrude'],
      resolvedParts: {},
      outputEntries: [
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:member-001',
          outputEntryId: 'output-entry:s001:node-extrude-1:member-001',
          sourceNodeId: 'node-extrude-1',
          partKey: 'extrude',
          bodyId: 'node-extrude-1:body:001',
        },
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:member-002',
          outputEntryId: 'output-entry:s001:node-extrude-1:member-002',
          sourceNodeId: 'node-extrude-1',
          partKey: 'extrude',
          bodyId: 'node-extrude-1:body:002',
        },
      ],
    }

    const draftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        partKeys: ['extrude'],
      },
      bodies: {
        'extrude:node-extrude-1:body:001': {
          kind: 'extrusion',
          bodyId: 'node-extrude-1:body:001',
          featureId: 'node-extrude-1',
          op: 'extrude',
          partKey: 'extrude',
          mesh: {
            vertices: [0, 0, 0, 2, 0, 0, 0, 1, 0],
            indices: [0, 1, 2],
          },
        },
        'extrude:node-extrude-1:body:002': {
          kind: 'extrusion',
          bodyId: 'node-extrude-1:body:002',
          featureId: 'node-extrude-1',
          op: 'extrude',
          partKey: 'extrude',
          mesh: {
            vertices: [0, 0, 0, 3, 0, 0, 0, 1, 0],
            indices: [0, 1, 2],
          },
        },
      },
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })

    const result = emitArtifacts(
      {
        seq: 1,
        projectFileId: 'project-file-1',
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        executionIntent: {
          ...DEFAULT_BUILD_EXECUTION_INTENT,
          geometryTarget: 'draft_preview',
        },
        compiledBuildData,
        draftGeometryResult,
      },
      [baseExtrudeArtifact()],
    )

    expect(result.bundle.entries).toEqual([
      expect.objectContaining({
        outputEntryId: 'output-entry:s001:node-extrude-1:member-001',
        artifacts: [
          expect.objectContaining({
            partKeyStr: 'extrude:node-extrude-1:body:001',
            mesh: {
              vertices: [0, 0, 0, 2, 0, 0, 0, 1, 0],
              indices: [0, 1, 2],
            },
          }),
        ],
      }),
      expect.objectContaining({
        outputEntryId: 'output-entry:s001:node-extrude-1:member-002',
        artifacts: [
          expect.objectContaining({
            partKeyStr: 'extrude:node-extrude-1:body:002',
            mesh: {
              vertices: [0, 0, 0, 3, 0, 0, 0, 1, 0],
              indices: [0, 1, 2],
            },
          }),
        ],
      }),
    ])
  })
})
