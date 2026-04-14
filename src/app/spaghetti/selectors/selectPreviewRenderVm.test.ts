import { describe, expect, it } from 'vitest'
import type { BuildResultBundle, PartArtifact } from '../../../shared/buildTypes'
import type { GraphPreviewPreparation } from '../previewPreparation'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import {
  selectPreviewRenderVm,
  selectPreviewRenderVmFromPreparation,
} from './selectPreviewRenderVm'

const outputPreviewNode = (slotIds: string[]) => ({
  nodeId: 'node-output-preview-1',
  type: OUTPUT_PREVIEW_NODE_TYPE,
  params: {
    slots: slotIds.map((slotId) => ({ slotId })),
    nextSlotIndex: slotIds.length + 1,
  },
})

const graph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [
    outputPreviewNode(['s001', 's002']),
    { nodeId: 'node-toe', type: 'Part/ToeHook', params: {} },
  ],
  edges: [
    {
      edgeId: 'edge-1',
      from: { nodeId: 'node-toe', portId: 'toeLoft' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
}

const outputs: PartArtifact[] = [
  {
    id: 'toeHook',
    label: 'Toe Hook',
    kind: 'box',
    params: { width: 10, length: 20, height: 5 },
    partKeyStr: 'toeHook#1',
    partKey: { id: 'toeHook', instance: 1 },
  },
]

const cubeGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [
    outputPreviewNode(['s001']),
    {
      nodeId: 'node-cube',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
  ],
  edges: [
    {
      edgeId: 'edge-cube',
      from: { nodeId: 'node-cube', portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
}

const multiCubeGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [
    outputPreviewNode(['s010', 's020', 's030']),
    {
      nodeId: 'node-cube-2',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
    {
      nodeId: 'node-cube-1',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
  ],
  edges: [
    {
      edgeId: 'edge-cube-2',
      from: { nodeId: 'node-cube-2', portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s010' },
    },
    {
      edgeId: 'edge-cube-1',
      from: { nodeId: 'node-cube-1', portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s020' },
    },
  ],
}

const cubeArtifact: PartArtifact = {
  id: 'cube',
  label: 'Cube',
  kind: 'box',
  params: { width: 20, length: 20, height: 20 },
  partKeyStr: 'cube',
  partKey: { id: 'cube', instance: null },
}

const cubeArtifact1: PartArtifact = {
  id: 'cube',
  label: 'Cube #1',
  kind: 'box',
  params: { width: 20, length: 20, height: 20 },
  partKeyStr: 'cube#1',
  partKey: { id: 'cube', instance: 1 },
}

const cubeArtifact2: PartArtifact = {
  id: 'cube',
  label: 'Cube #2',
  kind: 'box',
  params: { width: 20, length: 20, height: 20 },
  partKeyStr: 'cube#2',
  partKey: { id: 'cube', instance: 2 },
}

describe('selectPreviewRenderVm', () => {
  it('keeps valid connected slots and adds isReady metadata', () => {
    const vm = selectPreviewRenderVm(graph, outputs)
    expect(vm.items).toHaveLength(1)
    expect(vm.items[0]?.slotId).toBe('s001')
    expect(vm.items[0]?.nodeId).toBe('node-toe')
    expect(vm.items[0]?.isReady).toBe(true)
    expect(vm.items[0]?.sourcePartKeyStr).toBe('toeHook#1')
    expect(vm.items[0]?.viewerKey).toBe('output-entry:s001:node-toe')
    expect(vm.viewerParts[0]?.viewerKey).toBe('output-entry:s001:node-toe')
    expect(vm.viewerParts[0]?.artifact.partKeyStr).toBe('toeHook#1')
  })

  it('skips unresolved slots during preview rendering', () => {
    const unresolvedGraph: SpaghettiGraph = {
      ...graph,
      edges: [
        {
          edgeId: 'edge-unresolved',
          from: { nodeId: 'node-toe', portId: 'missingPort' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
        },
      ],
    }

    const vm = selectPreviewRenderVm(unresolvedGraph, outputs)
    expect(vm.items).toEqual([])
    expect(vm.viewerParts).toEqual([])
  })

  it('includes one cube render item when the cube part is connected', () => {
    const vm = selectPreviewRenderVm(cubeGraph, [cubeArtifact])
    expect(vm.items).toHaveLength(1)
    expect(vm.items[0]?.nodeId).toBe('node-cube')
    expect(vm.items[0]?.sourcePortId).toBe('solid')
    expect(vm.items[0]?.sourcePartKeyStr).toBe('cube')
    expect(vm.items[0]?.viewerPart?.viewerKey).toBe('output-entry:s001:node-cube')
    expect(vm.items[0]?.viewerPart?.artifact.partKeyStr).toBe('cube')
    expect(vm.viewerParts).toHaveLength(1)
  })

  it('keeps the cube slot out of viewerParts when the artifact is missing', () => {
    const vm = selectPreviewRenderVm(cubeGraph, [])
    expect(vm.items).toHaveLength(1)
    expect(vm.items[0]?.isReady).toBe(false)
    expect(vm.items[0]?.viewerPart).toBeNull()
    expect(vm.viewerParts).toEqual([])
  })

  it('skips cube preview rendering when a connected cube dimension wire is invalid', () => {
    const unresolvedCubeGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        outputPreviewNode(['s001']),
        {
          nodeId: 'node-cube',
          type: 'Part/Cube',
          params: getDefaultNodeParams('Part/Cube'),
        },
        {
          nodeId: 'node-number',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-cube-preview',
          from: { nodeId: 'node-cube', portId: 'solid' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
        },
        {
          edgeId: 'edge-cube-width-invalid',
          from: { nodeId: 'node-number', portId: 'out' },
          to: { nodeId: 'node-cube', portId: 'fs:in:cube-sketch-1:sketchRect:width' },
        },
      ],
    }

    const vm = selectPreviewRenderVm(unresolvedCubeGraph, [cubeArtifact])
    expect(vm.items).toEqual([])
    expect(vm.viewerParts).toEqual([])
  })

  it('keeps multi-slot preview identity output-entry-scoped while resolving distinct multi-part artifacts', () => {
    const vm = selectPreviewRenderVm(multiCubeGraph, [cubeArtifact2, cubeArtifact1])

    expect(vm.items.map((item) => item.slotId)).toEqual(['s010', 's020'])
    expect(vm.items.map((item) => item.sourcePartKeyStr)).toEqual(['cube#2', 'cube#1'])
    expect(vm.items.map((item) => item.viewerKey)).toEqual([
      'output-entry:s010:node-cube-2',
      'output-entry:s020:node-cube-1',
    ])
    expect(vm.viewerParts.map((item) => item.viewerKey)).toEqual([
      'output-entry:s010:node-cube-2',
      'output-entry:s020:node-cube-1',
    ])
    expect(vm.viewerParts.map((item) => item.artifact.partKeyStr)).toEqual(['cube#2', 'cube#1'])
  })

  it('is deterministic for the same inputs', () => {
    const first = selectPreviewRenderVm(graph, outputs)
    const second = selectPreviewRenderVm(graph, outputs)
    expect(first).toEqual(second)
    expect(second).toBe(first)
  })

  it('matches stable PreviewRenderVm contract snapshot', () => {
    expect(selectPreviewRenderVm(graph, outputs)).toMatchSnapshot()
  })

  it('fans split publication into multiple preview items and viewer keys from one slot', () => {
    const preparation: GraphPreviewPreparation = {
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
    const artifact: PartArtifact = {
      id: 'extrude',
      label: 'Extrude',
      kind: 'box',
      params: { width: 20, length: 20, height: 20 },
      partKeyStr: 'extrude',
      partKey: { id: 'extrude', instance: null },
    }

    const vm = selectPreviewRenderVmFromPreparation(preparation, [artifact])

    expect(vm.items.map((item) => item.viewerKey)).toEqual([
      'output-entry:s001:node-extrude-1:member-001',
      'output-entry:s001:node-extrude-1:member-002',
    ])
    expect(vm.viewerParts.map((item) => item.viewerKey)).toEqual([
      'output-entry:s001:node-extrude-1:member-001',
      'output-entry:s001:node-extrude-1:member-002',
    ])
  })

  it('prefers accepted bundle entry artifacts for split members over the coarse part-key fallback', () => {
    const preparation: GraphPreviewPreparation = {
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

    const vm = selectPreviewRenderVmFromPreparation(preparation, [coarseArtifact], acceptedBundle)

    expect(vm.viewerParts.map((item) => item.artifact.partKeyStr)).toEqual([
      'extrude:node-extrude-1:body:001',
      'extrude:node-extrude-1:body:002',
    ])
  })

  it('prefers accepted bundle entry artifacts for same-slot explicit contributors from the same node', () => {
    const preparation: GraphPreviewPreparation = {
      outputPreviewNodeId: 'node-output-preview-1',
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude'],
      sourceNodeIdBySlotId: { s001: 'node-extrude-1' },
      sourcePartKeyBySlotId: { s001: 'extrude' },
      sourcePortIdBySlotId: { s001: 'SolidBody:001' },
      sourcePartKeyByNodeId: { 'node-extrude-1': 'extrude' },
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
      publicationModeBySlotId: { s001: 'grouped' },
      splitMemberCountBySlotId: { s001: 1 },
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
          buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
          outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [memberArtifactA],
        },
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
          outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [memberArtifactB],
        },
      ],
    }

    const vm = selectPreviewRenderVmFromPreparation(preparation, [coarseArtifact], acceptedBundle)

    expect(vm.items.map((item) => item.outputEntryId)).toEqual([
      'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
      'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
    ])
    expect(vm.viewerParts.map((item) => item.artifact.partKeyStr)).toEqual([
      'extrude:node-extrude-1:body:001',
      'extrude:node-extrude-1:body:002',
    ])
  })

  it('does not fall back to the coarse parent artifact for unresolved explicit contributors', () => {
    const preparation: GraphPreviewPreparation = {
      outputPreviewNodeId: 'node-output-preview-1',
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude'],
      sourceNodeIdBySlotId: { s001: 'node-extrude-1' },
      sourcePartKeyBySlotId: { s001: 'extrude' },
      sourcePortIdBySlotId: { s001: 'SolidBody:001' },
      sourcePartKeyByNodeId: { 'node-extrude-1': 'extrude' },
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
      publicationModeBySlotId: { s001: 'grouped' },
      splitMemberCountBySlotId: { s001: 1 },
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
          artifacts: [memberArtifactA],
        },
      ],
    }

    const vm = selectPreviewRenderVmFromPreparation(preparation, [coarseArtifact], acceptedBundle)

    expect(vm.items.map((item) => ({
      outputEntryId: item.outputEntryId,
      isReady: item.isReady,
      renderable: item.renderable?.partKeyStr ?? null,
    }))).toEqual([
      {
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        isReady: true,
        renderable: 'extrude:node-extrude-1:body:001',
      },
      {
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
        isReady: false,
        renderable: null,
      },
    ])
    expect(vm.viewerParts.map((item) => item.artifact.partKeyStr)).toEqual([
      'extrude:node-extrude-1:body:001',
    ])
  })

  it('can narrow overlay membership to rebuilt bundle entries only while preserving retained bundle truth elsewhere', () => {
    const preparation: GraphPreviewPreparation = {
      outputPreviewNodeId: 'node-output-preview-1',
      outputSlotIds: ['s001', 's002'],
      previewCandidateSlotIds: ['s001', 's002'],
      previewCandidatePartKeys: ['extrude-1', 'extrude-2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-1',
        s002: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude-1',
        s002: 'extrude-2',
      },
      sourcePortIdBySlotId: {
        s001: 'out:extrude-1',
        s002: 'out:extrude-2',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-1': 'extrude-1',
        'node-extrude-2': 'extrude-2',
      },
      slotStatusBySlotId: {
        s001: 'ok',
        s002: 'ok',
      },
      buildStatsReadyPartKeys: [],
      previewIntent: 'outputPreview',
    }
    const retainedArtifact: PartArtifact = {
      id: 'extrude-1',
      label: 'Extrude 1',
      kind: 'box',
      params: { width: 20, length: 20, height: 20 },
      partKeyStr: 'extrude-1',
      partKey: { id: 'extrude-1', instance: null },
    }
    const rebuiltArtifact: PartArtifact = {
      id: 'extrude-2',
      label: 'Extrude 2',
      kind: 'box',
      params: { width: 10, length: 20, height: 20 },
      partKeyStr: 'extrude-2',
      partKey: { id: 'extrude-2', instance: null },
    }
    const acceptedBundle: BuildResultBundle = {
      buildRequestId: 'build-request-rebuilt-only-overlay',
      graphDocumentId: 'graph-document-1',
      seq: 2,
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
        retainedCount: 1,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:s001:node-extrude-1',
          outputEntryId: 'output-entry:s001:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
          resultClass: 'draft',
          artifacts: [retainedArtifact],
        },
        {
          buildUnitId: 'output-entry:s002:node-extrude-2',
          outputEntryId: 'output-entry:s002:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [rebuiltArtifact],
        },
      ],
    }

    const allAcceptedVm = selectPreviewRenderVmFromPreparation(
      preparation,
      [retainedArtifact, rebuiltArtifact],
      acceptedBundle,
    )
    const rebuiltOnlyVm = selectPreviewRenderVmFromPreparation(
      preparation,
      [retainedArtifact, rebuiltArtifact],
      acceptedBundle,
      'rebuiltOnly',
    )

    expect(allAcceptedVm.viewerParts.map((item) => item.artifact.partKeyStr)).toEqual([
      'extrude-1',
      'extrude-2',
    ])
    expect(rebuiltOnlyVm.items.map((item) => ({
      outputEntryId: item.outputEntryId,
      isReady: item.isReady,
      renderable: item.renderable?.partKeyStr ?? null,
    }))).toEqual([
      {
        outputEntryId: 'output-entry:s001:node-extrude-1',
        isReady: false,
        renderable: null,
      },
      {
        outputEntryId: 'output-entry:s002:node-extrude-2',
        isReady: true,
        renderable: 'extrude-2',
      },
    ])
    expect(rebuiltOnlyVm.viewerParts.map((item) => item.artifact.partKeyStr)).toEqual([
      'extrude-2',
    ])
  })
})
