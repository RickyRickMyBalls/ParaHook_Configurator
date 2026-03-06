import { describe, expect, it } from 'vitest'
import { parseSpaghettiGraph } from './spaghettiSchema'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

describe('parseSpaghettiGraph partSlots compatibility', () => {
  it.each([
    ['null', null],
    ['array', []],
    ['string', 'legacy'],
    ['partial object', { drivers: true }],
    [
      'extra keys',
      {
        drivers: true,
        inputs: true,
        featureStack: true,
        outputs: true,
        extra: true,
      },
    ],
    [
      'false literal',
      {
        drivers: true,
        inputs: true,
        featureStack: false,
        outputs: true,
      },
    ],
  ])('does not reject malformed partSlots payload: %s', (_label, malformedPartSlots) => {
    const parsed = parseSpaghettiGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
          partSlots: malformedPartSlots,
        },
      ],
      edges: [],
    })

    expect(parsed.nodes).toHaveLength(1)
    expect(parsed.nodes[0]?.nodeId).toBe('n-baseplate')
    expect(parsed.nodes[0]?.partSlots).toEqual(malformedPartSlots)
  })
})

describe('parseSpaghettiGraph OutputPreview compatibility', () => {
  it('preserves OutputPreview slots ordering and nextSlotIndex through parse roundtrip', () => {
    const input = {
      schemaVersion: 1 as const,
      nodes: [
        {
          nodeId: 'n-output-preview',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }, { slotId: 's010' }, { slotId: 's002' }],
            nextSlotIndex: 11,
          },
        },
      ],
      edges: [],
    }

    const parsed = parseSpaghettiGraph(JSON.parse(JSON.stringify(input)))
    const node = parsed.nodes.find((candidate) => candidate.nodeId === 'n-output-preview')

    expect(node?.type).toBe(OUTPUT_PREVIEW_NODE_TYPE)
    expect(node?.params.slots).toEqual([{ slotId: 's001' }, { slotId: 's010' }, { slotId: 's002' }])
    expect(node?.params.nextSlotIndex).toBe(11)
  })
})
