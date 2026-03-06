import type {
  OutputPreviewParams,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'

export const OUTPUT_PREVIEW_NODE_TYPE = 'System/OutputPreview' as const

export const OUTPUT_PREVIEW_DEFAULT_PARAMS: OutputPreviewParams = {
  slots: [{ slotId: 's001' }],
  nextSlotIndex: 2,
}

export const cloneOutputPreviewDefaultParams = (): OutputPreviewParams => ({
  slots: OUTPUT_PREVIEW_DEFAULT_PARAMS.slots.map((slot) => ({ ...slot })),
  nextSlotIndex: OUTPUT_PREVIEW_DEFAULT_PARAMS.nextSlotIndex,
})

const buildTentativeNodeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `node-${crypto.randomUUID()}`
  }
  fallbackNodeIdCounter += 1
  return `node-fallback-${fallbackNodeIdCounter}`
}

let fallbackNodeIdCounter = 0

const generateUniqueNodeId = (graph: SpaghettiGraph): string => {
  const existing = new Set(graph.nodes.map((node) => node.nodeId))
  let candidate = buildTentativeNodeId()
  let suffix = 2
  while (existing.has(candidate)) {
    candidate = `${buildTentativeNodeId()}-${suffix}`
    suffix += 1
  }
  return candidate
}

export const createOutputPreviewNode = (graph: SpaghettiGraph): SpaghettiNode => ({
  nodeId: generateUniqueNodeId(graph),
  type: OUTPUT_PREVIEW_NODE_TYPE,
  params: cloneOutputPreviewDefaultParams(),
})

export const createOutputPreviewNodePatch =
  (graph: SpaghettiGraph) => {
    const createdNode = createOutputPreviewNode(graph)
    return (prev: SpaghettiGraph): SpaghettiGraph => ({
      ...prev,
      nodes: [...prev.nodes, createdNode],
    })
  }
