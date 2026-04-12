import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from './schema/spaghettiTypes'
import {
  buildGraphOutputSurface,
  buildGraphPublishedContentSurface,
  GRAPH_OUTPUT_SURFACE_VERSION,
  type GraphOutputSurface,
} from './outputSurface'
import {
  prepareGraphPreviewPreparation,
  type GraphPreviewPreparation,
} from './previewPreparation'
import { getDefaultNodeParams } from './registry/nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from './system/outputPreviewNode'
import { ensureOutputPreviewSlotsPatch } from './system/ensureOutputPreviewSlots'

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

const createConnectedGraph = (options: {
  params: Record<string, unknown>
  sources: Array<{
    nodeId: string
    portId: string
    params?: Record<string, unknown>
  }>
}): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: options.params,
    },
    ...options.sources.map((source) => ({
      nodeId: source.nodeId,
      type: 'Geometry/Extrude',
      params: source.params ?? {},
    })),
  ],
  edges: options.sources.map((source, index) => ({
    edgeId: `edge-${index + 1}`,
    from: { nodeId: source.nodeId, portId: source.portId },
    to: {
      nodeId: 'node-output-preview-1',
      portId:
        Array.isArray((options.params as { slots?: Array<{ slotId: string }> }).slots) &&
        (options.params as { slots: Array<{ slotId: string }> }).slots[index] !== undefined
          ? `in:solid:${(options.params as { slots: Array<{ slotId: string }> }).slots[index]!.slotId}`
          : 'in:solid:s001',
    },
  })),
})

const createPreviewGraph = (params: Record<string, unknown>): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params,
    },
    {
      nodeId: 'node-cube-1',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
  ],
  edges: [
    {
      edgeId: 'edge-cube-to-output-preview',
      from: { nodeId: 'node-cube-1', portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
})

const createPreviewPreparation = (
  overrides: Partial<GraphPreviewPreparation> = {},
): GraphPreviewPreparation => ({
  outputPreviewNodeId: 'node-output-preview-1',
  outputSlotIds: ['s001'],
  previewCandidateSlotIds: ['s001'],
  previewCandidatePartKeys: ['extrude'],
  sourceNodeIdBySlotId: { s001: 'node-extrude-1' },
  sourcePartKeyBySlotId: { s001: 'extrude' },
  sourcePortIdBySlotId: { s001: 'SolidBody' },
  sourcePartKeyByNodeId: { 'node-extrude-1': 'extrude' },
  publicationModeBySlotId: { s001: 'grouped' },
  splitMemberCountBySlotId: { s001: 1 },
  slotStatusBySlotId: { s001: 'ok' },
  buildStatsReadyPartKeys: [],
  previewIntent: 'outputPreview',
  ...overrides,
})

describe('buildGraphPublishedContentSurface', () => {
  it('fans one split slot into multiple deterministic output entries', () => {
    const surface = buildGraphOutputSurface({
      graphDocumentId: 'graph-document-1',
      previewPreparation: createPreviewPreparation({
        publicationModeBySlotId: { s001: 'split' },
        splitMemberCountBySlotId: { s001: 2 },
      }),
      acceptedBuildOutputs: [],
      publishedAtBuildSeq: 7,
    })

    expect(surface.entries).toEqual([
      {
        outputEntryId: 'output-entry:s001:node-extrude-1:member-001',
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        memberIndex: 0,
        label: 's001',
        state: 'unresolved',
        acceptedArtifactKey: null,
        buildUnitId: null,
        resultEntryStatus: null,
        resultClass: null,
        diagnosticsState: 'unknown',
      },
      {
        outputEntryId: 'output-entry:s001:node-extrude-1:member-002',
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        memberIndex: 1,
        label: 's001',
        state: 'unresolved',
        acceptedArtifactKey: null,
        buildUnitId: null,
        resultEntryStatus: null,
        resultClass: null,
        diagnosticsState: 'unknown',
      },
    ])
  })

  it('keeps touched legacy grouped materialization aligned through output-surface building', () => {
    const legacyGraph = createPreviewGraph({
      componentLabel: 'Published Component',
      objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Object 1', orderIndex: 0 }],
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })

    const repairPatch = ensureOutputPreviewSlotsPatch(legacyGraph)
    const repairedGraph = repairPatch === null ? legacyGraph : repairPatch(legacyGraph)

    expect(
      repairedGraph.nodes.find((node) => node.type === OUTPUT_PREVIEW_NODE_TYPE)?.params,
    ).toMatchObject({
      slots: [
        { slotId: 's001', publicationMode: 'grouped' },
        { slotId: 's002', publicationMode: 'split' },
      ],
    })

    const previewPreparation = prepareGraphPreviewPreparation(repairedGraph)
    const surface = buildGraphOutputSurface({
      graphDocumentId: 'graph-document-1',
      previewPreparation,
      acceptedBuildOutputs: [],
      publishedAtBuildSeq: 7,
    })

    expect(previewPreparation.publicationModeBySlotId).toEqual({
      s001: 'grouped',
      s002: 'split',
    })
    expect(surface.entries).toEqual([
      {
        outputEntryId: 'output-entry:s001:node-cube-1',
        slotId: 's001',
        sourceNodeId: 'node-cube-1',
        label: 's001',
        state: 'unresolved',
        acceptedArtifactKey: null,
        buildUnitId: null,
        resultEntryStatus: null,
        resultClass: null,
        diagnosticsState: 'unknown',
      },
      {
        outputEntryId: 'output-entry:s002:unbound',
        slotId: 's002',
        sourceNodeId: '',
        label: 's002',
        state: 'empty',
        acceptedArtifactKey: null,
        buildUnitId: null,
        resultEntryStatus: null,
        resultClass: null,
        diagnosticsState: 'none',
      },
    ])
  })

  it('builds separate output entries when one slot flattens multiple contributors from the same node', () => {
    const surface = buildGraphOutputSurface({
      graphDocumentId: 'graph-document-1',
      previewPreparation: createPreviewPreparation({
        sourceEntriesBySlotId: {
          s001: [
            {
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              sourcePartKeyStr: 'extrude',
              sourcePortId: 'SolidBody:001',
            },
            {
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              sourcePartKeyStr: 'extrude',
              sourcePortId: 'SolidBody:002',
            },
          ],
        },
      }),
      acceptedBuildOutputs: [],
      publishedAtBuildSeq: 7,
    })

    expect(surface.entries).toEqual([
      {
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        label: 's001',
        state: 'unresolved',
        acceptedArtifactKey: null,
        buildUnitId: null,
        resultEntryStatus: null,
        resultClass: null,
        diagnosticsState: 'unknown',
      },
      {
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        label: 's001',
        state: 'unresolved',
        acceptedArtifactKey: null,
        buildUnitId: null,
        resultEntryStatus: null,
        resultClass: null,
        diagnosticsState: 'unknown',
      },
    ])
  })

  it('resolves same-slot explicit contributors from the same node with port-qualified bundle entries', () => {
    const surface = buildGraphOutputSurface({
      graphDocumentId: 'graph-document-1',
      previewPreparation: createPreviewPreparation({
        sourceEntriesBySlotId: {
          s001: [
            {
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              sourcePartKeyStr: 'extrude',
              sourcePortId: 'SolidBody:001',
            },
            {
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              sourcePartKeyStr: 'extrude',
              sourcePortId: 'SolidBody:002',
            },
          ],
        },
      }),
      acceptedBundle: {
        buildRequestId: 'build-request-1',
        graphDocumentId: 'graph-document-1',
        seq: 7,
        resultClass: 'final',
        executionIntent: {
          buildMode: 'final',
          quality: 'full',
          updatePolicy: 'manual',
          draftPolicy: 'suppressed',
          authoritativePolicy: 'explicit',
          outputIntent: 'accepted_final',
          geometryTarget: 'authoritative',
        },
        summary: {
          rebuiltCount: 2,
          retainedCount: 0,
          evictedCount: 0,
        },
        entries: [
          {
            buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
            outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
            sourceNodeId: 'node-extrude-1',
            status: 'rebuilt',
            resultClass: 'final',
            artifacts: [
              {
                id: 'extrude-001',
                label: 'Extrude 001',
                kind: 'box',
                params: { width: 10, length: 20, height: 30 },
                partKeyStr: 'extrude:node-extrude-1:body:001',
                partKey: { id: 'extrude:node-extrude-1:body:001', instance: null },
              },
            ],
          },
          {
            buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
            outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
            sourceNodeId: 'node-extrude-1',
            status: 'rebuilt',
            resultClass: 'final',
            artifacts: [
              {
                id: 'extrude-002',
                label: 'Extrude 002',
                kind: 'box',
                params: { width: 40, length: 20, height: 30 },
                partKeyStr: 'extrude:node-extrude-1:body:002',
                partKey: { id: 'extrude:node-extrude-1:body:002', instance: null },
              },
            ],
          },
        ],
      },
      acceptedBuildOutputs: [],
      publishedAtBuildSeq: 7,
    })

    expect(surface.entries).toEqual([
      expect.objectContaining({
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        state: 'resolved',
        acceptedArtifactKey: 'extrude:node-extrude-1:body:001',
      }),
      expect.objectContaining({
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
        state: 'resolved',
        acceptedArtifactKey: 'extrude:node-extrude-1:body:002',
      }),
    ])
  })

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

  it('keeps one split SolidBodies slot as one component with four published objects', () => {
    const graph = createGraph({
      componentLabel: 'Published Component',
      objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Pedal Body', orderIndex: 0 }],
      slots: [{ slotId: 's001', publicationMode: 'split' }],
      nextSlotIndex: 2,
    })

    const surface = buildGraphPublishedContentSurface({
      graphDocumentId: 'graph-document-1',
      graph,
      outputSurface: createOutputSurface([
        {
          outputEntryId: 'output-entry:s001:node-extrude-1:member-001',
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:001',
        },
        {
          outputEntryId: 'output-entry:s001:node-extrude-1:member-002',
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:002',
        },
        {
          outputEntryId: 'output-entry:s001:node-extrude-1:member-003',
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:003',
        },
        {
          outputEntryId: 'output-entry:s001:node-extrude-1:member-004',
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:004',
        },
      ]),
    })

    expect(surface).toEqual({
      graphDocumentId: 'graph-document-1',
      rows: [
        {
          kind: 'component',
          componentLabel: 'Published Component',
          objects: [
            {
              objectId: 'output-object:s001:member-001',
              label: 'Pedal Body 1',
              outputEntryId: 'output-entry:s001:node-extrude-1:member-001',
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              acceptedArtifactKey: 'extrude:001',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s001:member-002',
              label: 'Pedal Body 2',
              outputEntryId: 'output-entry:s001:node-extrude-1:member-002',
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              acceptedArtifactKey: 'extrude:002',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s001:member-003',
              label: 'Pedal Body 3',
              outputEntryId: 'output-entry:s001:node-extrude-1:member-003',
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              acceptedArtifactKey: 'extrude:003',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s001:member-004',
              label: 'Pedal Body 4',
              outputEntryId: 'output-entry:s001:node-extrude-1:member-004',
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              acceptedArtifactKey: 'extrude:004',
              state: 'resolved',
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

  it('fans one split slot into multiple published objects with deterministic labels and ids', () => {
    const graph = createGraph({
      componentLabel: 'Pedal Assembly',
      objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Pedal Body', orderIndex: 0 }],
      slots: [{ slotId: 's001', publicationMode: 'split' }],
      nextSlotIndex: 2,
    })

    const surface = buildGraphPublishedContentSurface({
      graphDocumentId: 'graph-document-1',
      graph,
      outputSurface: createOutputSurface([
        {
          outputEntryId: 'output-entry:s001:node-extrude-1:member-001',
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          memberIndex: 0,
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude',
        },
        {
          outputEntryId: 'output-entry:s001:node-extrude-1:member-002',
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          memberIndex: 1,
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude',
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
              objectId: 'output-object:s001:member-001',
              label: 'Pedal Body 1',
              outputEntryId: 'output-entry:s001:node-extrude-1:member-001',
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              acceptedArtifactKey: 'extrude',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s001:member-002',
              label: 'Pedal Body 2',
              outputEntryId: 'output-entry:s001:node-extrude-1:member-002',
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              acceptedArtifactKey: 'extrude',
              state: 'resolved',
            },
          ],
        },
      ],
    })
  })

  it('fans one multi-contributor slot into indexed published objects under the component', () => {
    const graph = createGraph({
      componentLabel: 'Pedal Assembly',
      objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Pedal Body', orderIndex: 0 }],
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })

    const surface = buildGraphPublishedContentSurface({
      graphDocumentId: 'graph-document-1',
      graph,
      outputSurface: createOutputSurface([
        {
          outputEntryId: 'output-entry:s001:node-extrude-1',
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude#1',
        },
        {
          outputEntryId: 'output-entry:s001:node-extrude-2',
          slotId: 's001',
          sourceNodeId: 'node-extrude-2',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude#2',
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
              objectId: 'output-object:s001:member-001',
              label: 'Pedal Body 1',
              outputEntryId: 'output-entry:s001:node-extrude-1',
              slotId: 's001',
              sourceNodeId: 'node-extrude-1',
              acceptedArtifactKey: 'extrude#1',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s001:member-002',
              label: 'Pedal Body 2',
              outputEntryId: 'output-entry:s001:node-extrude-2',
              slotId: 's001',
              sourceNodeId: 'node-extrude-2',
              acceptedArtifactKey: 'extrude#2',
              state: 'resolved',
            },
          ],
        },
      ],
    })
  })

  it('keeps many SolidBodies rows as row-owned subcomponents under one top-level component', () => {
    const graph = createConnectedGraph({
      params: {
        componentLabel: 'Pedal Assembly',
        objects: [
          { objectId: 'output-object:s001', slotId: 's001', label: 'Object 1', orderIndex: 0 },
          { objectId: 'output-object:s002', slotId: 's002', label: 'Object 2', orderIndex: 1 },
        ],
        slots: [
          { slotId: 's001', publicationMode: 'split' },
          { slotId: 's002', publicationMode: 'split' },
        ],
        nextSlotIndex: 3,
      },
      sources: [
        { nodeId: 'node-extrude-a', portId: 'SolidBody', params: { bodyGenerationMode: 'NewObjects' } },
        { nodeId: 'node-extrude-b', portId: 'SolidBody', params: { bodyGenerationMode: 'NewObjects' } },
      ],
    })

    const surface = buildGraphPublishedContentSurface({
      graphDocumentId: 'graph-document-1',
      graph,
      outputSurface: createOutputSurface([
        {
          outputEntryId: 'output-entry:s001:node-extrude-a:member-001',
          slotId: 's001',
          sourceNodeId: 'node-extrude-a',
          memberIndex: 0,
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:a:001',
        },
        {
          outputEntryId: 'output-entry:s001:node-extrude-a:member-002',
          slotId: 's001',
          sourceNodeId: 'node-extrude-a',
          memberIndex: 1,
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:a:002',
        },
        {
          outputEntryId: 'output-entry:s002:node-extrude-b',
          slotId: 's002',
          sourceNodeId: 'node-extrude-b',
          label: 's002',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:b:001',
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
              objectId: 'output-object:s001:member-001',
              label: 'Object 1 1',
              outputEntryId: 'output-entry:s001:node-extrude-a:member-001',
              slotId: 's001',
              sourceNodeId: 'node-extrude-a',
              acceptedArtifactKey: 'extrude:a:001',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s001:member-002',
              label: 'Object 1 2',
              outputEntryId: 'output-entry:s001:node-extrude-a:member-002',
              slotId: 's001',
              sourceNodeId: 'node-extrude-a',
              acceptedArtifactKey: 'extrude:a:002',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s002',
              label: 'Object 2',
              outputEntryId: 'output-entry:s002:node-extrude-b',
              slotId: 's002',
              sourceNodeId: 'node-extrude-b',
              acceptedArtifactKey: 'extrude:b:001',
              state: 'resolved',
            },
          ],
          subcomponents: [
            {
              subcomponentId: 'output-object:s001:collection',
              label: 'Object 1',
              slotId: 's001',
              objects: [
                {
                  objectId: 'output-object:s001:member-001',
                  label: 'Object 1 1',
                  outputEntryId: 'output-entry:s001:node-extrude-a:member-001',
                  slotId: 's001',
                  sourceNodeId: 'node-extrude-a',
                  acceptedArtifactKey: 'extrude:a:001',
                  state: 'resolved',
                },
                {
                  objectId: 'output-object:s001:member-002',
                  label: 'Object 1 2',
                  outputEntryId: 'output-entry:s001:node-extrude-a:member-002',
                  slotId: 's001',
                  sourceNodeId: 'node-extrude-a',
                  acceptedArtifactKey: 'extrude:a:002',
                  state: 'resolved',
                },
              ],
            },
            {
              subcomponentId: 'output-object:s002:collection',
              label: 'Object 2',
              slotId: 's002',
              objects: [
                {
                  objectId: 'output-object:s002',
                  label: 'Object 2',
                  outputEntryId: 'output-entry:s002:node-extrude-b',
                  slotId: 's002',
                  sourceNodeId: 'node-extrude-b',
                  acceptedArtifactKey: 'extrude:b:001',
                  state: 'resolved',
                },
              ],
            },
          ],
        },
      ],
    })
  })

  it('keeps singular rows as direct object siblings when mixed with one SolidBodies row', () => {
    const graph = createConnectedGraph({
      params: {
        componentLabel: 'Pedal Assembly',
        objects: [
          { objectId: 'output-object:s001', slotId: 's001', label: 'Object 1', orderIndex: 0 },
          { objectId: 'output-object:s002', slotId: 's002', label: 'Object 2', orderIndex: 1 },
        ],
        slots: [
          { slotId: 's001', publicationMode: 'grouped' },
          { slotId: 's002', publicationMode: 'grouped' },
        ],
        nextSlotIndex: 3,
      },
      sources: [
        { nodeId: 'node-extrude-a', portId: 'SolidBody', params: { bodyGenerationMode: 'NewObjects' } },
        { nodeId: 'node-extrude-b', portId: 'SolidBody', params: { bodyGenerationMode: 'Combine' } },
      ],
    })

    const surface = buildGraphPublishedContentSurface({
      graphDocumentId: 'graph-document-1',
      graph,
      outputSurface: createOutputSurface([
        {
          outputEntryId: 'output-entry:s001:node-extrude-a',
          slotId: 's001',
          sourceNodeId: 'node-extrude-a',
          label: 's001',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:a',
        },
        {
          outputEntryId: 'output-entry:s002:node-extrude-b',
          slotId: 's002',
          sourceNodeId: 'node-extrude-b',
          label: 's002',
          state: 'resolved',
          acceptedArtifactKey: 'extrude:b',
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
              label: 'Object 1',
              outputEntryId: 'output-entry:s001:node-extrude-a',
              slotId: 's001',
              sourceNodeId: 'node-extrude-a',
              acceptedArtifactKey: 'extrude:a',
              state: 'resolved',
            },
            {
              objectId: 'output-object:s002',
              label: 'Object 2',
              outputEntryId: 'output-entry:s002:node-extrude-b',
              slotId: 's002',
              sourceNodeId: 'node-extrude-b',
              acceptedArtifactKey: 'extrude:b',
              state: 'resolved',
            },
          ],
          directObjects: [
            {
              objectId: 'output-object:s002',
              label: 'Object 2',
              outputEntryId: 'output-entry:s002:node-extrude-b',
              slotId: 's002',
              sourceNodeId: 'node-extrude-b',
              acceptedArtifactKey: 'extrude:b',
              state: 'resolved',
            },
          ],
          subcomponents: [
            {
              subcomponentId: 'output-object:s001:collection',
              label: 'Object 1',
              slotId: 's001',
              objects: [
                {
                  objectId: 'output-object:s001',
                  label: 'Object 1',
                  outputEntryId: 'output-entry:s001:node-extrude-a',
                  slotId: 's001',
                  sourceNodeId: 'node-extrude-a',
                  acceptedArtifactKey: 'extrude:a',
                  state: 'resolved',
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
