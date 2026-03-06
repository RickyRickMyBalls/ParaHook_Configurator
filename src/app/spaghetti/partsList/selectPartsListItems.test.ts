import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { selectPartsListItems, selectPartsListPanelVm } from '../selectors'

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

const graphWithOutputPreview = (
  slotIds: string[],
  edges: SpaghettiGraph['edges'],
): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [outputPreviewNode(slotIds), toeHookNode, heelKickNode],
  edges,
})

describe('selectPartsListItems', () => {
  it('returns [] when OutputPreview node is missing', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [toeHookNode],
      edges: [],
    }

    expect(selectPartsListItems(graph)).toEqual([])
  })

  it('returns all slots with empty status in slot order when no edges exist', () => {
    const graph = graphWithOutputPreview(['s001', 's002', 's003'], [])

    const result = selectPartsListItems(graph)
    expect(result.map((item) => item.slotId)).toEqual(['s001', 's002', 's003'])
    expect(result.map((item) => item.slotStatus)).toEqual(['empty', 'empty', 'empty'])
    expect(result[0]?.rowId).toBe('parts-slot:s001')
    expect(result.every((item) => item.isConnected === false)).toBe(true)
    expect(result.every((item) => item.sourceNodeId === null)).toBe(true)
  })

  it('keeps connected and trailing empty slots in params.slots order', () => {
    const graph = graphWithOutputPreview(['s001', 's002', 's003'], [
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

    const result = selectPartsListItems(graph)
    expect(result.map((item) => item.slotId)).toEqual(['s001', 's002', 's003'])
    expect(result.map((item) => item.slotStatus)).toEqual(['ok', 'ok', 'empty'])
    expect(result.map((item) => item.isConnected)).toEqual([true, true, false])
    expect(result[0]?.sourceNodeLabel).toBe('Toe Hook')
    expect(result[1]?.sourceNodeLabel).toBe('Heel Kick')
    expect(result[2]?.sourceNodeLabel).toBeNull()
  })

  it('marks unresolved slots visible when connected edge has non-ok diagnostics', () => {
    const graph = graphWithOutputPreview(['s001', 's002'], [
      {
        edgeId: 'edge-s001-unresolved',
        from: { nodeId: 'node-toehook-1', portId: 'missingPort' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
      {
        edgeId: 'edge-s002-ok',
        from: { nodeId: 'node-heelkick-1', portId: 'hookLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s002' },
      },
    ])

    const result = selectPartsListItems(graph)
    expect(result.map((item) => item.slotStatus)).toEqual(['unresolved', 'ok'])
    expect(result[0]?.warningMessage).toContain('does not exist')
  })

  it('preserves interior empty slots without compaction', () => {
    const graph = graphWithOutputPreview(['s001', 's002', 's003', 's004'], [
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

    const result = selectPartsListItems(graph)
    expect(result.map((item) => [item.slotId, item.slotStatus])).toEqual([
      ['s001', 'ok'],
      ['s002', 'empty'],
      ['s003', 'empty'],
      ['s004', 'ok'],
    ])
  })

  it('uses the first matching edge in deterministic edgeId order for duplicate slot edges', () => {
    const graph = graphWithOutputPreview(['s001'], [
      {
        edgeId: 'edge-second',
        from: { nodeId: 'node-heelkick-1', portId: 'hookLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
      {
        edgeId: 'edge-first',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
    ])

    const result = selectPartsListItems(graph)
    expect(result).toHaveLength(1)
    expect(result[0]?.sourceNodeId).toBe('node-toehook-1')
    expect(result[0]?.sourcePortId).toBe('toeLoft')
  })

  it('is deterministic across repeated calls with identical inputs', () => {
    const graph = graphWithOutputPreview(['s001', 's002'], [
      {
        edgeId: 'edge-s001',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
    ])

    const first = selectPartsListItems(graph)
    const second = selectPartsListItems(graph)
    expect(second).toEqual(first)
    expect(second).toBe(first)
  })

  it('exposes panel vm through selector barrel and hides trailing empty slot', () => {
    const graph = graphWithOutputPreview(['s001', 's002'], [
      {
        edgeId: 'edge-s001',
        from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
        to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
      },
    ])

    const vm = selectPartsListPanelVm(graph)
    expect(vm.items).toHaveLength(1)
    expect(vm.items[0]?.slotId).toBe('s001')
    expect(vm.items[0]?.primaryLabel).toContain('s001:')
  })
})
