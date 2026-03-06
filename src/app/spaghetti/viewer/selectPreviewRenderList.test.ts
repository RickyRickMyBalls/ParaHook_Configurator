import { describe, expect, it } from 'vitest'
import type { PartArtifact } from '../../../shared/buildTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { selectPreviewRenderList } from './selectPreviewRenderList'

const outputPreviewNode = (slotIds: string[]) => ({
  nodeId: 'node-output-preview-1',
  type: OUTPUT_PREVIEW_NODE_TYPE,
  params: {
    slots: slotIds.map((slotId) => ({ slotId })),
    nextSlotIndex: slotIds.length + 1,
  },
})

const toeHookNode = {
  nodeId: 'node-toehook-1',
  type: 'Part/ToeHook',
  params: {},
}

const heelKickNode = {
  nodeId: 'node-heelkick-1',
  type: 'Part/HeelKick',
  params: {},
}

const cubeNode = {
  nodeId: 'node-cube-1',
  type: 'Part/Cube',
  params: getDefaultNodeParams('Part/Cube'),
}

const cubeNode2 = {
  nodeId: 'node-cube-2',
  type: 'Part/Cube',
  params: getDefaultNodeParams('Part/Cube'),
}

const baseGraph = (
  slotIds: string[],
  edges: SpaghettiGraph['edges'],
): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [outputPreviewNode(slotIds), toeHookNode, heelKickNode],
  edges,
})

const toeHookArtifact = (): PartArtifact => ({
  id: 'toeHook',
  label: 'Toe Hook',
  kind: 'box',
  params: { width: 10, length: 20, height: 5 },
  partKeyStr: 'toeHook#1',
  partKey: { id: 'toeHook', instance: 1 },
})

const heelKickArtifact = (): PartArtifact => ({
  id: 'heelKick',
  label: 'Heel Kick',
  kind: 'box',
  params: { width: 12, length: 22, height: 6 },
  partKeyStr: 'heelKick#1',
  partKey: { id: 'heelKick', instance: 1 },
})

const cubeArtifact = (): PartArtifact => ({
  id: 'cube',
  label: 'Cube',
  kind: 'box',
  params: { width: 15, length: 30, height: 25 },
  partKeyStr: 'cube',
  partKey: { id: 'cube', instance: null },
})

const cubeArtifact2 = (): PartArtifact => ({
  id: 'cube',
  label: 'Cube #2',
  kind: 'box',
  params: { width: 15, length: 30, height: 25 },
  partKeyStr: 'cube#2',
  partKey: { id: 'cube', instance: 2 },
})

const cubeArtifact1 = (): PartArtifact => ({
  id: 'cube',
  label: 'Cube #1',
  kind: 'box',
  params: { width: 15, length: 30, height: 25 },
  partKeyStr: 'cube#1',
  partKey: { id: 'cube', instance: 1 },
})

describe('selectPreviewRenderList', () => {
  it('returns one entry with stable slot key for a single connected slot', () => {
    const graph = baseGraph(['s001'], [
      {
        edgeId: 'edge-s001',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
    ])

    const result = selectPreviewRenderList(graph, [toeHookArtifact()])
    expect(result).toHaveLength(1)
    expect(result[0]?.key).toBe('s001')
    expect(result[0]?.slotId).toBe('s001')
  })

  it('returns connected slots only and ignores unconnected trailing slot', () => {
    const graph = baseGraph(['s001', 's002', 's003'], [
      {
        edgeId: 'edge-s001',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
      {
        edgeId: 'edge-s002',
        from: { nodeId: 'node-heelkick-1', portId: 'hookLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s002' },
      },
    ])

    const result = selectPreviewRenderList(graph, [toeHookArtifact(), heelKickArtifact()])
    expect(result.map((entry) => entry.slotId)).toEqual(['s001', 's002'])
  })

  it('preserves params.slots order for connected entries', () => {
    const graph = baseGraph(['s010', 's002', 's111'], [
      {
        edgeId: 'edge-s010',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s010' },
      },
      {
        edgeId: 'edge-s111',
        from: { nodeId: 'node-heelkick-1', portId: 'hookLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s111' },
      },
    ])

    const result = selectPreviewRenderList(graph, [toeHookArtifact(), heelKickArtifact()])
    expect(result.map((entry) => entry.slotId)).toEqual(['s010', 's111'])
  })

  it('keeps connected entry with null renderable when mapped artifact is missing', () => {
    const graph = baseGraph(['s001'], [
      {
        edgeId: 'edge-s001',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
    ])

    const result = selectPreviewRenderList(graph, [])
    expect(result).toHaveLength(1)
    expect(result[0]?.renderable).toBeNull()
  })

  it('maps OutputPreview slot -> nodeId -> cube partKey without a parallel output system', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [outputPreviewNode(['s001']), cubeNode],
      edges: [
        {
          edgeId: 'edge-cube',
          from: { nodeId: 'node-cube-1', portId: 'solid' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
        },
      ],
    }

    const result = selectPreviewRenderList(graph, [cubeArtifact()])
    expect(result).toEqual([
      {
        key: 's001',
        slotId: 's001',
        sourceNodeId: 'node-cube-1',
        sourcePartKeyStr: 'cube',
        sourcePortId: 'solid',
        renderable: cubeArtifact(),
      },
    ])
  })

  it('maps multiple OutputPreview slots to distinct multi-part cube artifacts in slot order', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [outputPreviewNode(['s002', 's001']), cubeNode2, cubeNode],
      edges: [
        {
          edgeId: 'edge-cube-2',
          from: { nodeId: 'node-cube-2', portId: 'solid' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s002' },
        },
        {
          edgeId: 'edge-cube-1',
          from: { nodeId: 'node-cube-1', portId: 'solid' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
        },
      ],
    }

    expect(selectPreviewRenderList(graph, [cubeArtifact2(), cubeArtifact1()])).toEqual([
      {
        key: 's002',
        slotId: 's002',
        sourceNodeId: 'node-cube-2',
        sourcePartKeyStr: 'cube#2',
        sourcePortId: 'solid',
        renderable: cubeArtifact2(),
      },
      {
        key: 's001',
        slotId: 's001',
        sourceNodeId: 'node-cube-1',
        sourcePartKeyStr: 'cube#1',
        sourcePortId: 'solid',
        renderable: cubeArtifact1(),
      },
    ])
  })

  it('ignores interior empty slots and keeps connected slot ordering', () => {
    const graph = baseGraph(['s001', 's002', 's003', 's004'], [
      {
        edgeId: 'edge-s001',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
      {
        edgeId: 'edge-s004',
        from: { nodeId: 'node-heelkick-1', portId: 'hookLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s004' },
      },
    ])

    const result = selectPreviewRenderList(graph, [toeHookArtifact(), heelKickArtifact()])
    expect(result.map((entry) => entry.slotId)).toEqual(['s001', 's004'])
  })

  it('is deterministic across repeated calls with identical inputs', () => {
    const graph = baseGraph(['s001', 's002'], [
      {
        edgeId: 'edge-s001',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
    ])
    const outputs = [toeHookArtifact()]

    const first = selectPreviewRenderList(graph, outputs)
    const second = selectPreviewRenderList(graph, outputs)
    expect(second).toEqual(first)
  })
})
