import { describe, expect, it } from 'vitest'
import type { PartArtifact } from '../../../shared/buildTypes'
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
      'graph-document-1:s001',
      'graph-document-2:s001',
    ])
    expect(sharedVm.items.map((item) => item.id)).toEqual([
      'graph-document-1:preview:s001:node-cube-1:cube',
      'graph-document-2:preview:s001:node-cube-2:cube',
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
    expect(sharedVm.viewerParts.map((item) => item.viewerKey)).toEqual(['graph-document-1:s001'])
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
      'graph-document-1:s001:member-001',
      'graph-document-1:s001:member-002',
    ])
  })
})
