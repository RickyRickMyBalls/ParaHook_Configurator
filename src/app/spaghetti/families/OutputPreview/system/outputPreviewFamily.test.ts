import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../../../schema/spaghettiTypes'
import {
  cloneOutputPreviewDefaultParams,
  createOutputPreviewNode,
  OUTPUT_PREVIEW_NODE_TYPE,
} from './outputPreviewNode'
import { ensureOutputPreviewSingletonPatch } from './ensureOutputPreviewSingleton'
import { ensureOutputPreviewSlotsPatch } from './ensureOutputPreviewSlots'

const emptyGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [],
  edges: [],
}

describe('OutputPreview family system', () => {
  it('creates the default Output Preview node from the family path', () => {
    const node = createOutputPreviewNode(emptyGraph)

    expect(node.type).toBe(OUTPUT_PREVIEW_NODE_TYPE)
    expect(node.params).toEqual(cloneOutputPreviewDefaultParams())
  })

  it('repairs singleton presence and keeps one trailing empty slot from the family path', () => {
    const singletonPatch = ensureOutputPreviewSingletonPatch(emptyGraph)
    expect(singletonPatch).not.toBeNull()
    if (singletonPatch === null) {
      return
    }

    const repairedSingletonGraph = singletonPatch(emptyGraph)
    const outputPreviewNodeId = repairedSingletonGraph.nodes[0].nodeId
    const singletonGraph = {
      ...repairedSingletonGraph,
      nodes: [
        ...repairedSingletonGraph.nodes,
        {
          nodeId: 'node-source-1',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-fill-s001',
          from: { nodeId: 'node-source-1', portId: 'toeLoft' },
          to: { nodeId: outputPreviewNodeId, portId: 'in:solid:s001' },
        },
      ],
    }
    const slotPatch = ensureOutputPreviewSlotsPatch(singletonGraph)
    expect(slotPatch).not.toBeNull()
    if (slotPatch === null) {
      return
    }

    const normalizedGraph = slotPatch(singletonGraph)
    const outputPreviewNode = normalizedGraph.nodes.find(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )

    expect(outputPreviewNode).toBeDefined()
    expect(outputPreviewNode?.params).toMatchObject({
      slots: [
        { slotId: 's001', publicationMode: 'split' },
        { slotId: 's002', publicationMode: 'split' },
      ],
      nextSlotIndex: 3,
    })
  })
})
