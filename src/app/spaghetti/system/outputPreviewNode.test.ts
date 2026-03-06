import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import {
  createOutputPreviewNode,
  createOutputPreviewNodePatch,
  OUTPUT_PREVIEW_NODE_TYPE,
} from './outputPreviewNode'

describe('createOutputPreviewNode', () => {
  it('creates deterministic default OutputPreview params', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [],
      edges: [],
    }

    const node = createOutputPreviewNode(graph)

    expect(node.type).toBe(OUTPUT_PREVIEW_NODE_TYPE)
    expect(node.params).toEqual({
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })
  })

  it('returns an add-node patch that appends OutputPreview with deterministic defaults', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [],
      edges: [],
    }

    const patch = createOutputPreviewNodePatch(graph)
    const patched = patch(graph)
    const created = patched.nodes[0]

    expect(created).toBeDefined()
    expect(created?.type).toBe(OUTPUT_PREVIEW_NODE_TYPE)
    expect(created?.params).toEqual({
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })
  })
})
