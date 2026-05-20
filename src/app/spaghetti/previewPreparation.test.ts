import { describe, expect, it } from 'vitest'
import {
  buildPreviewPreparationEntries,
  getPreviewPreparationEntriesForSlot,
  hasExplicitSolidBodyMemberPublication,
  prepareGraphPreviewPreparation,
} from './previewPreparation'
import type { BuildResultBundle, PartArtifact } from '../../shared/buildTypes'
import type { SpaghettiGraph } from './schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from './system/outputPreviewNode'

const createPreviewPreparationGraph = (
  outputPreviewParams: Record<string, unknown>,
): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-sketch-1',
      type: 'Geometry/Sketch',
      params: {
        sketch: {
          type: 'sketch',
          featureId: 'sketch-1',
          plane: 'XY',
          components: [
            {
              rowId: 'row-1',
              componentId: 'rect-a',
              type: 'rectangle',
              a: { kind: 'lit', x: 0, y: 0 },
              b: { kind: 'lit', x: 40, y: 20 },
            },
            {
              rowId: 'row-2',
              componentId: 'rect-b',
              type: 'rectangle',
              a: { kind: 'lit', x: 60, y: 0 },
              b: { kind: 'lit', x: 100, y: 20 },
            },
          ],
          outputs: {
            profiles: [],
            diagnostics: [],
          },
          uiState: {
            collapsed: false,
          },
        },
      },
    },
    {
      nodeId: 'node-extrude-1',
      type: 'Geometry/Extrude',
      params: {
        bodyGenerationMode: 'NewObjects',
        depthMm: 25,
      },
    },
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: outputPreviewParams,
    },
  ],
  edges: [
    {
      edgeId: 'edge-sketch-to-extrude',
      from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
      to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
    },
    {
      edgeId: 'edge-extrude-to-output-preview',
      from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
})

describe('prepareGraphPreviewPreparation', () => {
  it('fans split publication entries from normalized OutputPreview slot publication mode', () => {
    const previewPreparation = prepareGraphPreviewPreparation(
      createPreviewPreparationGraph({
        slots: [{ slotId: 's001', publicationMode: 'split' }],
        objects: [
          {
            objectId: 'output-object:s001',
            slotId: 's001',
            label: 'Pedal Body',
            orderIndex: 0,
          },
        ],
        nextSlotIndex: 2,
      }),
    )

    expect(previewPreparation.publicationModeBySlotId).toEqual({ s001: 'split' })
    expect(getPreviewPreparationEntriesForSlot(previewPreparation, 's001')).toEqual([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKeyStr: 'extrude#1',
        sourcePortId: 'SolidBody',
        memberIndex: 0,
      },
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKeyStr: 'extrude#1',
        sourcePortId: 'SolidBody',
        memberIndex: 1,
      },
    ])
    expect(previewPreparation.splitMemberCountBySlotId).toEqual({ s001: 2 })
  })

  it('keeps explicit grouped override grouped through backend-normalized publication metadata', () => {
    const previewPreparation = prepareGraphPreviewPreparation(
      createPreviewPreparationGraph({
        slots: [{ slotId: 's001', publicationMode: 'grouped' }],
        objects: [
          {
            objectId: 'output-object:s001',
            slotId: 's001',
            label: 'Pedal Body',
            orderIndex: 0,
          },
        ],
        nextSlotIndex: 2,
      }),
    )

    expect(previewPreparation.publicationModeBySlotId).toEqual({ s001: 'grouped' })
    expect(getPreviewPreparationEntriesForSlot(previewPreparation, 's001')).toEqual([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKeyStr: 'extrude#1',
        sourcePortId: 'SolidBody',
      },
    ])
    expect(previewPreparation.splitMemberCountBySlotId).toEqual({ s001: 1 })
  })

  it('keeps legacy omitted slot publication grouped through backend normalization', () => {
    const previewPreparation = prepareGraphPreviewPreparation(
      createPreviewPreparationGraph({
        slots: [{ slotId: 's001' }],
        objects: [
          {
            objectId: 'output-object:s001',
            slotId: 's001',
            label: 'Pedal Body',
            orderIndex: 0,
          },
        ],
        nextSlotIndex: 2,
      }),
    )

    expect(previewPreparation.publicationModeBySlotId).toEqual({ s001: 'grouped' })
    expect(getPreviewPreparationEntriesForSlot(previewPreparation, 's001')).toEqual([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKeyStr: 'extrude#1',
        sourcePortId: 'SolidBody',
      },
    ])
    expect(previewPreparation.splitMemberCountBySlotId).toEqual({ s001: 1 })
  })

  it('does not fall back to the coarse parent artifact for explicit SolidBody contributors', () => {
    const previewPreparation = prepareGraphPreviewPreparation(
      createPreviewPreparationGraph({
        slots: [{ slotId: 's001', publicationMode: 'grouped' }],
        objects: [
          {
            objectId: 'output-object:s001',
            slotId: 's001',
            label: 'Pedal Body',
            orderIndex: 0,
          },
        ],
        nextSlotIndex: 2,
      }),
    )
    previewPreparation.sourceEntriesBySlotId = {
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
    }
    const coarseArtifact: PartArtifact = {
      id: 'extrude',
      label: 'Extrude',
      kind: 'box',
      params: { width: 20, length: 20, height: 20 },
      partKeyStr: 'extrude',
      partKey: { id: 'extrude', instance: null },
    }
    const memberArtifact: PartArtifact = {
      id: 'extrude-body-001',
      label: 'Extrude Body 001',
      kind: 'box',
      params: { width: 10, length: 20, height: 20 },
      partKeyStr: 'extrude:node-extrude-1:body:001',
      partKey: { id: 'extrude:node-extrude-1:body:001', instance: null },
    }
    const acceptedBundle: BuildResultBundle = {
      buildRequestId: 'build-request-explicit-subset',
      graphDocumentId: 'graph-document-1',
      seq: 1,
      resultClass: 'draft',
      executionIntent: {
        buildMode: 'preview',
        quality: 'draft',
        updatePolicy: 'auto',
        draftPolicy: 'live',
        authoritativePolicy: 'explicit',
        outputIntent: 'transient_preview',
        geometryTarget: 'draft_preview',
      },
      summary: {
        rebuiltCount: 1,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
          outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [memberArtifact],
        },
      ],
    }

    expect(
      buildPreviewPreparationEntries(previewPreparation, [coarseArtifact], acceptedBundle),
    ).toEqual([
      expect.objectContaining({
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        renderable: memberArtifact,
      }),
      expect.objectContaining({
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
        renderable: null,
      }),
    ])
  })

  it('keeps both Output Preview surfaces in preview preparation for a parallel graph with separate preview nodes', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'rect-a',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 40, y: 20 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'rect-b',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 60, y: 0 },
                  b: { kind: 'lit', x: 100, y: 20 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'NewObjects',
            depthMm: 25,
          },
        },
        {
          nodeId: 'node-extrude-2',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'NewObjects',
            depthMm: 12,
          },
        },
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 'slot-extrude-1', publicationMode: 'grouped' }],
            objects: [
              {
                objectId: 'output-object:slot-extrude-1',
                slotId: 'slot-extrude-1',
                label: 'Extrude 1',
                orderIndex: 0,
              },
            ],
            nextSlotIndex: 2,
          },
        },
        {
          nodeId: 'node-output-preview-2',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 'slot-extrude-2', publicationMode: 'grouped' }],
            objects: [
              {
                objectId: 'output-object:slot-extrude-2',
                slotId: 'slot-extrude-2',
                label: 'Extrude 2',
                orderIndex: 0,
              },
            ],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-sketch-to-extrude-1',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-sketch-to-extrude-2',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-2', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-extrude-1-to-output-1',
          from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-1' },
        },
        {
          edgeId: 'edge-extrude-2-to-output-2',
          from: { nodeId: 'node-extrude-2', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-2', portId: 'in:solid:slot-extrude-2' },
        },
      ],
    }

    const previewPreparation = prepareGraphPreviewPreparation(graph)

    expect(previewPreparation.outputSlotIds).toEqual(['slot-extrude-1', 'slot-extrude-2'])
    expect(previewPreparation.previewCandidateSlotIds).toEqual([
      'slot-extrude-1',
      'slot-extrude-2',
    ])
    expect(previewPreparation.sourceNodeIdBySlotId).toEqual({
      'slot-extrude-1': 'node-extrude-1',
      'slot-extrude-2': 'node-extrude-2',
    })
  })

  it('detects explicit SolidBody member publication', () => {
    const previewPreparation = prepareGraphPreviewPreparation(
      createPreviewPreparationGraph({
        slots: [{ slotId: 's001', publicationMode: 'grouped' }],
        objects: [
          {
            objectId: 'output-object:s001',
            slotId: 's001',
            label: 'Pedal Body',
            orderIndex: 0,
          },
        ],
        nextSlotIndex: 2,
      }),
    )

    expect(hasExplicitSolidBodyMemberPublication(previewPreparation)).toBe(false)

    previewPreparation.sourceEntriesBySlotId = {
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:001',
        },
      ],
    }

    expect(hasExplicitSolidBodyMemberPublication(previewPreparation)).toBe(true)
  })
})
