import type {
  OutputPreviewObject,
  OutputPreviewParams,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'

export const OUTPUT_PREVIEW_NODE_TYPE = 'System/OutputPreview' as const
export const OUTPUT_PREVIEW_DEFAULT_COMPONENT_LABEL = 'Published Component' as const
export const OUTPUT_PREVIEW_DEFAULT_OBJECT_LABEL_PREFIX = 'Object' as const

const buildDefaultOutputPreviewObjectLabel = (orderIndex: number): string =>
  `${OUTPUT_PREVIEW_DEFAULT_OBJECT_LABEL_PREFIX} ${orderIndex + 1}`

export const OUTPUT_PREVIEW_DEFAULT_PARAMS: OutputPreviewParams = {
  componentLabel: OUTPUT_PREVIEW_DEFAULT_COMPONENT_LABEL,
  objects: [
    {
      objectId: 'output-object:s001',
      label: buildDefaultOutputPreviewObjectLabel(0),
      slotId: 's001',
      orderIndex: 0,
    },
  ],
  slots: [{ slotId: 's001' }],
  nextSlotIndex: 2,
}

export const cloneOutputPreviewDefaultParams = (): OutputPreviewParams => ({
  componentLabel: OUTPUT_PREVIEW_DEFAULT_PARAMS.componentLabel,
  objects: OUTPUT_PREVIEW_DEFAULT_PARAMS.objects.map((objectRow) => ({ ...objectRow })),
  slots: OUTPUT_PREVIEW_DEFAULT_PARAMS.slots.map((slot) => ({ ...slot })),
  nextSlotIndex: OUTPUT_PREVIEW_DEFAULT_PARAMS.nextSlotIndex,
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toNonEmptyString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

const toPositiveInt = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 ? value : fallback

const buildDefaultOutputPreviewObjectId = (slotId: string): string => `output-object:${slotId}`

const isLegacyDefaultOutputPreviewObjectLabel = (
  label: string | null,
  slotId: string,
  objectId: string | null,
): boolean =>
  label === slotId && (objectId === null || objectId === buildDefaultOutputPreviewObjectId(slotId))

export const readOutputPreviewNode = (graph: SpaghettiGraph): SpaghettiNode | undefined =>
  graph.nodes.find((node) => node.type === OUTPUT_PREVIEW_NODE_TYPE)

const toOutputPreviewParamsRecord = (
  params: SpaghettiNode['params'] | null | undefined,
): Record<string, unknown> =>
  typeof params === 'object' && params !== null ? (params as Record<string, unknown>) : {}

export const normalizeOutputPreviewParams = (
  params: Record<string, unknown>,
  slotsOverride?: OutputPreviewParams['slots'],
): OutputPreviewParams => {
  const slots =
    slotsOverride ??
    ((Array.isArray(params.slots)
      ? params.slots.flatMap((slot) => {
          if (!isRecord(slot)) {
            return []
          }
          const slotId = toNonEmptyString(slot.slotId)
          return slotId === null ? [] : [{ slotId }]
        })
      : []) as OutputPreviewParams['slots'])

  const normalizedSlots =
    slots.length > 0 ? slots : OUTPUT_PREVIEW_DEFAULT_PARAMS.slots.map((slot) => ({ ...slot }))

  const rawObjects = Array.isArray(params.objects) ? params.objects : []
  const rawObjectsBySlotId = new Map<string, OutputPreviewObject>()

  for (const rawObject of rawObjects) {
    if (!isRecord(rawObject)) {
      continue
    }
    const slotId = toNonEmptyString(rawObject.slotId)
    if (slotId === null || rawObjectsBySlotId.has(slotId)) {
      continue
    }
    const objectId = toNonEmptyString(rawObject.objectId) ?? buildDefaultOutputPreviewObjectId(slotId)
    rawObjectsBySlotId.set(slotId, {
      objectId,
      label: toNonEmptyString(rawObject.label) ?? '',
      slotId,
      orderIndex: toPositiveInt(rawObject.orderIndex, 1) - 1,
    })
  }

  const objects = normalizedSlots.map((slot, index) => {
    const existing = rawObjectsBySlotId.get(slot.slotId)
    const fallbackLabel = buildDefaultOutputPreviewObjectLabel(index)
    return {
      objectId: existing?.objectId ?? buildDefaultOutputPreviewObjectId(slot.slotId),
      label:
        existing === undefined ||
        existing.label.length === 0 ||
        isLegacyDefaultOutputPreviewObjectLabel(existing.label, slot.slotId, existing.objectId)
          ? fallbackLabel
          : existing.label,
      slotId: slot.slotId,
      orderIndex: index,
    } satisfies OutputPreviewObject
  })

  return {
    componentLabel:
      toNonEmptyString(params.componentLabel) ?? OUTPUT_PREVIEW_DEFAULT_COMPONENT_LABEL,
    objects,
    slots: normalizedSlots.map((slot) => ({ ...slot })),
    nextSlotIndex: toPositiveInt(params.nextSlotIndex, normalizedSlots.length + 1),
  }
}

export const readNormalizedOutputPreviewParams = (
  graph: SpaghettiGraph,
  slotsOverride?: OutputPreviewParams['slots'],
): OutputPreviewParams | null => {
  const outputPreviewNode = readOutputPreviewNode(graph)
  if (outputPreviewNode === undefined) {
    return null
  }
  return normalizeOutputPreviewParams(
    toOutputPreviewParamsRecord(outputPreviewNode.params),
    slotsOverride,
  )
}

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
