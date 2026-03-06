import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from './outputPreviewNode'
import { ensureOutputPreviewSlotsPatch } from './ensureOutputPreviewSlots'

const applySlotsPatch = (graph: SpaghettiGraph): SpaghettiGraph => {
  const patch = ensureOutputPreviewSlotsPatch(graph)
  return patch === null ? graph : patch(graph)
}

const makeGraph = (
  params: Record<string, unknown>,
  edges: SpaghettiGraph['edges'] = [],
): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params,
    },
    {
      nodeId: 'node-source-1',
      type: 'Part/ToeHook',
      params: {},
    },
  ],
  edges,
})

describe('ensureOutputPreviewSlotsPatch', () => {
  it.each([
    ['missing slots', { nextSlotIndex: 1 }],
    ['empty slots', { slots: [], nextSlotIndex: 1 }],
  ])(
    'seeds %s to one trailing empty slot and enforces nextSlotIndex >= 2',
    (_label, params) => {
      const graph = makeGraph(params)

      const normalized = applySlotsPatch(graph)
      const outputPreviewNode = normalized.nodes.find(
        (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
      )

      expect(outputPreviewNode?.params).toEqual({
        slots: [{ slotId: 's001' }],
        nextSlotIndex: 2,
      })
    },
  )

  it('auto-appends one empty trailing slot when the last slot is filled', () => {
    const graph = makeGraph(
      {
        slots: [{ slotId: 's001' }],
        nextSlotIndex: 2,
      },
      [
        {
          edgeId: 'edge-fill-s001',
          from: { nodeId: 'node-source-1', portId: 'toeLoft' },
          to: { nodeId: 'node-preview-1', portId: 'in:solid:s001' },
        },
      ],
    )

    const normalized = applySlotsPatch(graph)
    const outputPreviewNode = normalized.nodes.find(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )

    expect(outputPreviewNode?.params).toEqual({
      slots: [{ slotId: 's001' }, { slotId: 's002' }],
      nextSlotIndex: 3,
    })
  })

  it('trims extra trailing empty slots from the end only', () => {
    const graph = makeGraph({
      slots: [{ slotId: 's001' }, { slotId: 's002' }, { slotId: 's003' }],
      nextSlotIndex: 4,
    })

    const normalized = applySlotsPatch(graph)
    const outputPreviewNode = normalized.nodes.find(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )

    expect(outputPreviewNode?.params).toEqual({
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 4,
    })
  })

  it('does not compact interior empty slots when trailing-empty invariant is already valid', () => {
    const graph = makeGraph(
      {
        slots: [{ slotId: 's001' }, { slotId: 's002' }, { slotId: 's003' }],
        nextSlotIndex: 4,
      },
      [
        {
          edgeId: 'edge-fill-s002',
          from: { nodeId: 'node-source-1', portId: 'toeLoft' },
          to: { nodeId: 'node-preview-1', portId: 'in:solid:s002' },
        },
      ],
    )

    const patch = ensureOutputPreviewSlotsPatch(graph)
    const normalized = patch === null ? graph : patch(graph)
    const outputPreviewNode = normalized.nodes.find(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )

    expect(patch).toBeNull()
    expect(outputPreviewNode?.params).toEqual({
      slots: [{ slotId: 's001' }, { slotId: 's002' }, { slotId: 's003' }],
      nextSlotIndex: 4,
    })
  })

  it('is deterministic and idempotent across repeated normalization', () => {
    const graph = makeGraph(
      {
        slots: [{ slotId: 's001' }],
        nextSlotIndex: 2,
      },
      [
        {
          edgeId: 'edge-fill-s001',
          from: { nodeId: 'node-source-1', portId: 'toeLoft' },
          to: { nodeId: 'node-preview-1', portId: 'in:solid:s001' },
        },
      ],
    )

    const first = applySlotsPatch(graph)
    const second = applySlotsPatch(first)

    expect(second).toEqual(first)
    expect(ensureOutputPreviewSlotsPatch(first)).toBeNull()
  })
})
