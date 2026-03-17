import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from './schema/spaghettiTypes'
import {
  buildGraphPublishedContentSurface,
  GRAPH_OUTPUT_SURFACE_VERSION,
  type GraphOutputSurface,
} from './outputSurface'
import { OUTPUT_PREVIEW_NODE_TYPE } from './system/outputPreviewNode'

const createOutputSurface = (entries: GraphOutputSurface['entries']): GraphOutputSurface => ({
  graphDocumentId: 'graph-document-1',
  publishedAtBuildSeq: 7,
  surfaceVersion: GRAPH_OUTPUT_SURFACE_VERSION,
  entries,
})

const createGraph = (params: Record<string, unknown>): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params,
    },
  ],
  edges: [],
})

describe('buildGraphPublishedContentSurface', () => {
  it('returns a direct object row for singleton published output groups', () => {
    const graph = createGraph({
      componentLabel: 'Ignored Singleton Component',
      objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Pedal Body', orderIndex: 0 }],
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })

    const surface = buildGraphPublishedContentSurface({
      graphDocumentId: 'graph-document-1',
      graph,
      outputSurface: createOutputSurface([
        {
          outputEntryId: 'output-entry:s001:node-baseplate-1',
          slotId: 's001',
          sourceNodeId: 'node-baseplate-1',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'baseplate',
        },
      ]),
    })

    expect(surface).toEqual({
      graphDocumentId: 'graph-document-1',
      rows: [
        {
          kind: 'object',
          object: {
            objectId: 'output-object:s001',
            label: 'Pedal Body',
            outputEntryId: 'output-entry:s001:node-baseplate-1',
            slotId: 's001',
            sourceNodeId: 'node-baseplate-1',
            acceptedArtifactKey: 'baseplate',
            state: 'resolved',
          },
        },
      ],
    })
  })

  it('returns a grouped component row when multiple objects are published', () => {
    const graph = createGraph({
      componentLabel: 'Pedal Assembly',
      objects: [
        { objectId: 'output-object:s001', slotId: 's001', label: 'Pedal Body', orderIndex: 0 },
        { objectId: 'output-object:s002', slotId: 's002', label: 'Pedal Hook', orderIndex: 1 },
      ],
      slots: [{ slotId: 's001' }, { slotId: 's002' }],
      nextSlotIndex: 3,
    })

    const surface = buildGraphPublishedContentSurface({
      graphDocumentId: 'graph-document-1',
      graph,
      outputSurface: createOutputSurface([
        {
          outputEntryId: 'output-entry:s001:node-baseplate-1',
          slotId: 's001',
          sourceNodeId: 'node-baseplate-1',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'baseplate',
        },
        {
          outputEntryId: 'output-entry:s002:node-hook-1',
          slotId: 's002',
          sourceNodeId: 'node-hook-1',
          label: 's002',
          state: 'unresolved',
          acceptedArtifactKey: null,
        },
      ]),
    })

    expect(surface).toEqual({
      graphDocumentId: 'graph-document-1',
      rows: [
        {
          kind: 'component',
          componentLabel: 'Pedal Assembly',
          objects: [
            {
              objectId: 'output-object:s001',
              label: 'Pedal Body',
              outputEntryId: 'output-entry:s001:node-baseplate-1',
              slotId: 's001',
              sourceNodeId: 'node-baseplate-1',
              acceptedArtifactKey: 'baseplate',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s002',
              label: 'Pedal Hook',
              outputEntryId: 'output-entry:s002:node-hook-1',
              slotId: 's002',
              sourceNodeId: 'node-hook-1',
              acceptedArtifactKey: null,
              state: 'unresolved',
            },
          ],
        },
      ],
    })
  })

  it('filters empty slot scaffolding out of the published content surface', () => {
    const graph = createGraph({
      componentLabel: 'Published Component',
      objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Object 1', orderIndex: 0 }],
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })

    const surface = buildGraphPublishedContentSurface({
      graphDocumentId: 'graph-document-1',
      graph,
      outputSurface: createOutputSurface([
        {
          outputEntryId: 'output-entry:s001:unbound',
          slotId: 's001',
          sourceNodeId: '',
          label: 's001',
          state: 'empty',
          acceptedArtifactKey: null,
        },
      ]),
    })

    expect(surface).toEqual({
      graphDocumentId: 'graph-document-1',
      rows: [],
    })
  })
})
