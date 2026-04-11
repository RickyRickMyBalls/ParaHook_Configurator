import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import {
  createOutputPreviewNode,
  createOutputPreviewNodePatch,
  OUTPUT_PREVIEW_NODE_TYPE,
  readNormalizedOutputPreviewParams,
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
      componentLabel: 'Published Component',
      objects: [
        { objectId: 'output-object:s001', slotId: 's001', label: 'Object 1', orderIndex: 0 },
      ],
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
      componentLabel: 'Published Component',
      objects: [
        { objectId: 'output-object:s001', slotId: 's001', label: 'Object 1', orderIndex: 0 },
      ],
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })
  })

  it('reads canonical normalized publish params from the graph OutputPreview node', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            componentLabel: '  Pedal Component  ',
            objects: [{ slotId: 's001', objectId: 'output-object:s001', label: '  Pedal Body  ' }],
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [],
    }

    expect(readNormalizedOutputPreviewParams(graph)).toEqual({
      componentLabel: 'Pedal Component',
      objects: [
        { objectId: 'output-object:s001', slotId: 's001', label: 'Pedal Body', orderIndex: 0 },
      ],
      slots: [{ slotId: 's001', publicationMode: 'grouped' }],
      nextSlotIndex: 2,
    })
  })

  it('normalizes explicit split publication mode on output-preview slots', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            componentLabel: 'Pedal Component',
            objects: [{ slotId: 's001', objectId: 'output-object:s001', label: 'Pedal Body' }],
            slots: [{ slotId: 's001', publicationMode: 'split' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [],
    }

    expect(readNormalizedOutputPreviewParams(graph)?.slots).toEqual([
      { slotId: 's001', publicationMode: 'split' },
    ])
  })
})
