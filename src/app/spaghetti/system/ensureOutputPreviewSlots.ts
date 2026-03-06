import type {
  OutputPreviewSlot,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from './outputPreviewNode'

const IN_SOLID_PREFIX = 'in:solid:'
const SEEDED_SLOT_ID = 's001'

const isOutputPreviewNode = (node: SpaghettiNode): boolean =>
  node.type === OUTPUT_PREVIEW_NODE_TYPE

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toPositiveInt = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    return fallback
  }
  return value
}

const pad3 = (value: number): string => String(value).padStart(3, '0')

const collectFilledSlotIds = (
  graph: SpaghettiGraph,
  outputPreviewNodeId: string,
): Set<string> => {
  const filled = new Set<string>()
  for (const edge of graph.edges) {
    if (edge.to.nodeId !== outputPreviewNodeId) {
      continue
    }
    if (!edge.to.portId.startsWith(IN_SOLID_PREFIX)) {
      continue
    }
    filled.add(edge.to.portId.slice(IN_SOLID_PREFIX.length))
  }
  return filled
}

const countTrailingEmptySlots = (
  slots: OutputPreviewSlot[],
  filledSlotIds: Set<string>,
): number => {
  let trailingEmptyCount = 0
  for (let index = slots.length - 1; index >= 0; index -= 1) {
    if (filledSlotIds.has(slots[index].slotId)) {
      break
    }
    trailingEmptyCount += 1
  }
  return trailingEmptyCount
}

const getSlotsFromParams = (params: Record<string, unknown>): OutputPreviewSlot[] | null => {
  const rawSlots = params.slots
  if (!Array.isArray(rawSlots)) {
    return null
  }
  return rawSlots as OutputPreviewSlot[]
}

export const ensureOutputPreviewSlotsPatch = (
  graph: SpaghettiGraph,
): ((prev: SpaghettiGraph) => SpaghettiGraph) | null => {
  const outputPreviewNode = graph.nodes.find(isOutputPreviewNode)
  if (outputPreviewNode === undefined) {
    return null
  }

  const paramsRecord = isRecord(outputPreviewNode.params) ? outputPreviewNode.params : {}
  const currentSlots = getSlotsFromParams(paramsRecord)
  let nextSlots = currentSlots
  let nextSlotIndex = toPositiveInt(paramsRecord.nextSlotIndex, 1)

  let slotsSeeded = false
  let nextSlotIndexChanged = false
  let slotsChanged = false

  if (nextSlots === null || nextSlots.length === 0) {
    nextSlots = [{ slotId: SEEDED_SLOT_ID }]
    slotsSeeded = true
    slotsChanged = true
    const seededNextSlotIndex = Math.max(nextSlotIndex, 2)
    if (seededNextSlotIndex !== nextSlotIndex) {
      nextSlotIndex = seededNextSlotIndex
      nextSlotIndexChanged = true
    }
  }

  const filledSlotIds = collectFilledSlotIds(graph, outputPreviewNode.nodeId)
  const trailingEmptyCount = countTrailingEmptySlots(nextSlots, filledSlotIds)

  if (trailingEmptyCount === 0) {
    nextSlots = [...nextSlots, { slotId: `s${pad3(nextSlotIndex)}` }]
    nextSlotIndex += 1
    slotsChanged = true
    nextSlotIndexChanged = true
  } else if (trailingEmptyCount > 1) {
    const trimCount = trailingEmptyCount - 1
    nextSlots = nextSlots.slice(0, nextSlots.length - trimCount)
    slotsChanged = true
  }

  if (!slotsChanged && !nextSlotIndexChanged) {
    return null
  }

  const nodeId = outputPreviewNode.nodeId
  const resolvedSlots = nextSlots
  const shouldWriteNextSlotIndex = nextSlotIndexChanged || slotsSeeded

  return (prev: SpaghettiGraph): SpaghettiGraph => ({
    ...prev,
    nodes: prev.nodes.map((node) => {
      if (node.nodeId !== nodeId) {
        return node
      }
      const nodeParams = isRecord(node.params) ? node.params : {}
      return {
        ...node,
        params: {
          ...nodeParams,
          slots: resolvedSlots,
          ...(shouldWriteNextSlotIndex ? { nextSlotIndex } : {}),
        },
      }
    }),
  })
}
