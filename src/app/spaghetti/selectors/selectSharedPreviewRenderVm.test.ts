import { describe, expect, it } from 'vitest'
import type { BuildResultBundle, PartArtifact } from '../../../shared/buildTypes'
import type { GraphPreviewPreparation } from '../previewPreparation'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { prepareGraphPreviewPreparation } from '../previewPreparation'
import { selectSharedPreviewRenderVm } from './selectSharedPreviewRenderVm'

const outputPreviewNode = (slotIds: string[]) => ({
  nodeId: 'node-output-preview-1',
  type: OUTPUT_PREVIEW_NODE_TYPE,
  params: {
    slots: slotIds.map((slotId) => ({ slotId })),
    nextSlotIndex: slotIds.length + 1,
  },
})

const cubeGraph = (nodeId: string): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    outputPreviewNode(['s001']),
    {
      nodeId,
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
  ],
  edges: [
    {
      edgeId: `edge-${nodeId}`,
      from: { nodeId, portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
})

const cubeArtifact = (partKeyStr: string): PartArtifact => ({
  id: 'cube',
  label: `Cube ${partKeyStr}`,
  kind: 'box',
  params: { width: 20, length: 20, height: 20 },
  partKeyStr,
  partKey: { id: 'cube', instance: partKeyStr === 'cube' ? null : 1 },
})

describe('selectSharedPreviewRenderVm', () => {
  it('qualifies viewer identities by graph document when composing more than one graph', () => {
    const sharedVm = selectSharedPreviewRenderVm([
      {
        graphDocumentId: 'graph-document-1',
        previewPreparation: prepareGraphPreviewPreparation(cubeGraph('node-cube-1')),
        buildOutputs: [cubeArtifact('cube')],
      },
      {
        graphDocumentId: 'graph-document-2',
        previewPreparation: prepareGraphPreviewPreparation(cubeGraph('node-cube-2')),
        buildOutputs: [cubeArtifact('cube')],
      },
    ])

    expect(sharedVm.contributingGraphDocumentIds).toEqual([
      'graph-document-1',
      'graph-document-2',
    ])
    expect(sharedVm.viewerParts.map((item) => item.viewerKey)).toEqual([
      'graph-document-1:output-entry:s001:node-cube-1',
      'graph-document-2:output-entry:s001:node-cube-2',
    ])
    expect(sharedVm.items.map((item) => item.id)).toEqual([
      'graph-document-1:preview:output-entry:s001:node-cube-1',
      'graph-document-2:preview:output-entry:s001:node-cube-2',
    ])
  })

  it('keeps unresolved participants in the contribution order while rendering only resolved viewer parts', () => {
    const sharedVm = selectSharedPreviewRenderVm([
      {
        graphDocumentId: 'graph-document-1',
        previewPreparation: prepareGraphPreviewPreparation(cubeGraph('node-cube-1')),
        buildOutputs: [cubeArtifact('cube')],
      },
      {
        graphDocumentId: 'graph-document-2',
        previewPreparation: prepareGraphPreviewPreparation(cubeGraph('node-cube-2')),
        buildOutputs: [],
      },
    ])

    expect(sharedVm.contributingGraphDocumentIds).toEqual([
      'graph-document-1',
      'graph-document-2',
    ])
    expect(sharedVm.viewerParts.map((item) => item.viewerKey)).toEqual([
      'graph-document-1:output-entry:s001:node-cube-1',
    ])
    expect(sharedVm.items).toHaveLength(2)
    expect(sharedVm.items[1]?.viewerPart).toBeNull()
  })

  it('qualifies split publication viewer identities per graph document', () => {
    const splitPreparation: GraphPreviewPreparation = {
      outputPreviewNodeId: 'node-output-preview-1',
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude'],
      sourceNodeIdBySlotId: { s001: 'node-extrude-1' },
      sourcePartKeyBySlotId: { s001: 'extrude' },
      sourcePortIdBySlotId: { s001: 'SolidBody' },
      sourcePartKeyByNodeId: { 'node-extrude-1': 'extrude' },
      publicationModeBySlotId: { s001: 'split' },
      splitMemberCountBySlotId: { s001: 2 },
      slotStatusBySlotId: { s001: 'ok' },
      buildStatsReadyPartKeys: [],
      previewIntent: 'outputPreview',
    }
    const extrudeArtifact: PartArtifact = {
      id: 'extrude',
      label: 'Extrude',
      kind: 'box',
      params: { width: 20, length: 20, height: 20 },
      partKeyStr: 'extrude',
      partKey: { id: 'extrude', instance: null },
    }

    const sharedVm = selectSharedPreviewRenderVm([
      {
        graphDocumentId: 'graph-document-1',
        previewPreparation: splitPreparation,
        buildOutputs: [extrudeArtifact],
      },
    ])

    expect(sharedVm.viewerParts.map((item) => item.viewerKey)).toEqual([
      'graph-document-1:output-entry:s001:node-extrude-1:member-001',
      'graph-document-1:output-entry:s001:node-extrude-1:member-002',
    ])
  })

  it('uses accepted bundle entry artifacts for split members during shared composition', () => {
    const splitPreparation: GraphPreviewPreparation = {
      outputPreviewNodeId: 'node-output-preview-1',
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude'],
      sourceNodeIdBySlotId: { s001: 'node-extrude-1' },
      sourcePartKeyBySlotId: { s001: 'extrude' },
      sourcePortIdBySlotId: { s001: 'SolidBody' },
      sourcePartKeyByNodeId: { 'node-extrude-1': 'extrude' },
      publicationModeBySlotId: { s001: 'split' },
      splitMemberCountBySlotId: { s001: 2 },
      slotStatusBySlotId: { s001: 'ok' },
      buildStatsReadyPartKeys: [],
      previewIntent: 'outputPreview',
    }
    const coarseArtifact: PartArtifact = {
      id: 'extrude',
      label: 'Extrude',
      kind: 'box',
      params: { width: 20, length: 20, height: 20 },
      partKeyStr: 'extrude',
      partKey: { id: 'extrude', instance: null },
    }
    const memberArtifactA: PartArtifact = {
      id: 'extrude',
      label: 'Extrude',
      kind: 'box',
      params: { width: 10, length: 20, height: 20 },
      partKeyStr: 'extrude:node-extrude-1:body:001',
      partKey: { id: 'extrude:node-extrude-1:body:001', instance: null },
    }
    const memberArtifactB: PartArtifact = {
      id: 'extrude',
      label: 'Extrude',
      kind: 'box',
      params: { width: 30, length: 20, height: 20 },
      partKeyStr: 'extrude:node-extrude-1:body:002',
      partKey: { id: 'extrude:node-extrude-1:body:002', instance: null },
    }
    const acceptedBundle: BuildResultBundle = {
      buildRequestId: 'build-request-1',
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
        rebuiltCount: 2,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:member-001',
          outputEntryId: 'output-entry:s001:node-extrude-1:member-001',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [memberArtifactA],
        },
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:member-002',
          outputEntryId: 'output-entry:s001:node-extrude-1:member-002',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [memberArtifactB],
        },
      ],
    }

    const sharedVm = selectSharedPreviewRenderVm([
      {
        graphDocumentId: 'graph-document-1',
        previewPreparation: splitPreparation,
        buildOutputs: [coarseArtifact],
        buildBundle: acceptedBundle,
      },
    ])

    expect(sharedVm.viewerParts.map((item) => item.artifact.partKeyStr)).toEqual([
      'extrude:node-extrude-1:body:001',
      'extrude:node-extrude-1:body:002',
    ])
  })
})
