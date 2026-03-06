import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import {
  OUTPUT_PREVIEW_NODE_TYPE,
} from './outputPreviewNode'
import { ensureOutputPreviewSingletonPatch } from './ensureOutputPreviewSingleton'

const emptyGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [],
  edges: [],
}

describe('ensureOutputPreviewSingletonPatch', () => {
  it('auto-creates OutputPreview when missing', () => {
    const patch = ensureOutputPreviewSingletonPatch(emptyGraph)
    expect(patch).not.toBeNull()

    const repaired = patch === null ? emptyGraph : patch(emptyGraph)
    const outputPreviewNodes = repaired.nodes.filter(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )

    expect(outputPreviewNodes).toHaveLength(1)
    expect(outputPreviewNodes[0].params).toEqual({
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })
  })

  it('returns null when exactly one OutputPreview exists', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-001',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [],
    }

    expect(ensureOutputPreviewSingletonPatch(graph)).toBeNull()
  })

  it('keeps the smallest OutputPreview nodeId and removes connected edges deterministically', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-020',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: { slots: [{ slotId: 's001' }], nextSlotIndex: 2 },
        },
        {
          nodeId: 'node-part-001',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'node-output-003',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: { slots: [{ slotId: 's001' }], nextSlotIndex: 2 },
        },
        {
          nodeId: 'node-output-100',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: { slots: [{ slotId: 's001' }], nextSlotIndex: 2 },
        },
      ],
      edges: [
        {
          edgeId: 'edge-1-removed-from',
          from: { nodeId: 'node-output-020', portId: 'out' },
          to: { nodeId: 'node-part-001', portId: 'in' },
        },
        {
          edgeId: 'edge-2-keep-1',
          from: { nodeId: 'node-output-003', portId: 'out' },
          to: { nodeId: 'node-part-001', portId: 'in' },
        },
        {
          edgeId: 'edge-3-removed-to',
          from: { nodeId: 'node-part-001', portId: 'out' },
          to: { nodeId: 'node-output-100', portId: 'in' },
        },
        {
          edgeId: 'edge-4-keep-2',
          from: { nodeId: 'node-part-001', portId: 'out' },
          to: { nodeId: 'node-output-003', portId: 'in' },
        },
      ],
    }

    const patch = ensureOutputPreviewSingletonPatch(graph)
    expect(patch).not.toBeNull()
    if (patch === null) {
      return
    }

    const repaired = patch(graph)
    const repairedAgain = patch(graph)

    expect(repaired).toEqual(repairedAgain)

    const outputPreviewNodes = repaired.nodes.filter(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )
    expect(outputPreviewNodes).toHaveLength(1)
    expect(outputPreviewNodes[0].nodeId).toBe('node-output-003')

    expect(repaired.edges.map((edge) => edge.edgeId)).toEqual([
      'edge-2-keep-1',
      'edge-4-keep-2',
    ])
  })
})
