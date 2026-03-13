import { getNodeDef } from '../registry/nodeRegistry'
import type { GraphOutputSurface, GraphPublishedOutputEntry } from '../outputSurface'
import type { SpaghettiEdge, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import { selectDiagnosticsVm } from '../selectors/selectDiagnosticsVm'

export type PartsListItem = {
  rowId: string
  key: string
  slotId: string
  slotStatus: 'ok' | 'unresolved' | 'empty'
  warningMessage: string | null
  isConnected: boolean
  sourceNodeId: string | null
  sourcePortId: string | null
  sourceNodeType: string | null
  sourceNodeLabel: string | null
}

export type PartsListPanelItemVm = PartsListItem & {
  primaryLabel: string
  secondaryLabel: string | null
}

export type PartsListPanelVm = {
  items: PartsListPanelItemVm[]
}

type NodeRegistryLike = {
  getNodeDef: (type: string) => { label?: string } | undefined
}

const defaultNodeRegistry: NodeRegistryLike = {
  getNodeDef,
}

const isOutputPreviewNode = (node: SpaghettiNode): boolean =>
  node.type === OUTPUT_PREVIEW_NODE_TYPE

const readSlotIds = (node: SpaghettiNode): string[] => {
  const rawSlots = (node.params as { slots?: unknown }).slots
  if (!Array.isArray(rawSlots)) {
    return []
  }
  return rawSlots.flatMap((slot) => {
    if (
      typeof slot !== 'object' ||
      slot === null ||
      typeof (slot as { slotId?: unknown }).slotId !== 'string'
    ) {
      return []
    }
    const slotId = (slot as { slotId: string }).slotId
    return slotId.length > 0 ? [slotId] : []
  })
}

const findIncomingSlotEdges = (
  edges: readonly SpaghettiEdge[],
  outputPreviewNodeId: string,
  slotId: string,
): SpaghettiEdge[] => {
  const targetPortId = `in:solid:${slotId}`
  return edges
    .filter((edge) => edge.to.nodeId === outputPreviewNodeId && edge.to.portId === targetPortId)
    .sort((a, b) => a.edgeId.localeCompare(b.edgeId))
}

const resolveSourceNodeLabel = (
  node: SpaghettiNode,
  nodeRegistry: NodeRegistryLike,
): string => {
  const registryLabel = nodeRegistry.getNodeDef(node.type)?.label
  if (typeof registryLabel === 'string' && registryLabel.trim().length > 0) {
    return registryLabel.trim()
  }
  if (node.type.length > 0) {
    return node.type
  }
  return node.nodeId
}

export const selectPartsListItems = (
  graph: SpaghettiGraph,
  nodeRegistry: NodeRegistryLike = defaultNodeRegistry,
): PartsListItem[] => {
  const cached = partsListItemsCache
  if (cached.graph === graph && cached.nodeRegistry === nodeRegistry && cached.value !== undefined) {
    return cached.value
  }
  const outputPreviewNode = graph.nodes.find(isOutputPreviewNode)
  if (outputPreviewNode === undefined) {
    partsListItemsCache = {
      graph,
      nodeRegistry,
      value: [],
    }
    return []
  }

  const slotIds = readSlotIds(outputPreviewNode)
  const diagnosticsVm = selectDiagnosticsVm({
    graph,
    evaluation: evaluateSpaghettiGraph(graph),
  })
  const items: PartsListItem[] = slotIds.map((slotId): PartsListItem => {
    const matchingEdges = findIncomingSlotEdges(graph.edges, outputPreviewNode.nodeId, slotId)
    const matchingEdge = matchingEdges[0]
    if (matchingEdge === undefined) {
      return {
        rowId: `parts-slot:${slotId}`,
        key: slotId,
        slotId,
        slotStatus: 'empty',
        warningMessage: null,
        isConnected: false,
        sourceNodeId: null,
        sourcePortId: null,
        sourceNodeType: null,
        sourceNodeLabel: null,
      }
    }

    const sourceNode = graph.nodes.find((node) => node.nodeId === matchingEdge.from.nodeId)
    const unresolvedEdge = matchingEdges.find(
      (edge) => diagnosticsVm.edgeStatusById[edge.edgeId]?.kind !== 'ok',
    )
    const slotStatus =
      unresolvedEdge === undefined
        ? diagnosticsVm.slotStatus[slotId] ?? 'ok'
        : 'unresolved'
    const warningMessage =
      unresolvedEdge === undefined
        ? null
        : diagnosticsVm.edgeStatusById[unresolvedEdge.edgeId]?.message ?? null

    if (sourceNode === undefined) {
      return {
        rowId: `parts-slot:${slotId}`,
        key: slotId,
        slotId,
        slotStatus,
        warningMessage,
        isConnected: true,
        sourceNodeId: matchingEdge.from.nodeId,
        sourcePortId: matchingEdge.from.portId,
        sourceNodeType: null,
        sourceNodeLabel: matchingEdge.from.nodeId,
      }
    }

    return {
      rowId: `parts-slot:${slotId}`,
      key: slotId,
      slotId,
      slotStatus,
      warningMessage,
      isConnected: true,
      sourceNodeId: matchingEdge.from.nodeId,
      sourcePortId: matchingEdge.from.portId,
      sourceNodeType: sourceNode.type.length > 0 ? sourceNode.type : null,
      sourceNodeLabel: resolveSourceNodeLabel(sourceNode, nodeRegistry),
    }
  })
  partsListItemsCache = {
    graph,
    nodeRegistry,
    value: items,
  }
  return items
}

const toPanelItem = (item: PartsListItem): PartsListPanelItemVm => {
  const primaryLabel =
    item.slotStatus === 'empty'
      ? `${item.slotId}: Empty`
      : item.isConnected
        ? `${item.slotId}: ${item.sourceNodeLabel ?? item.sourceNodeId ?? 'unknown'}`
        : `${item.slotId}: Empty`
  const secondaryLabel =
    item.slotStatus === 'empty'
      ? null
      : item.isConnected
        ? `${item.sourceNodeType ?? 'unknown'} | ${item.sourcePortId ?? 'unknown'}`
        : null
  return {
    ...item,
    primaryLabel,
    secondaryLabel,
  }
}

const toPartsListSlotStatus = (
  state: GraphPublishedOutputEntry['state'],
): PartsListItem['slotStatus'] => (state === 'resolved' ? 'ok' : state)

const buildPartsListItemsFromOutputSurface = (
  graph: SpaghettiGraph,
  outputSurface: GraphOutputSurface,
  nodeRegistry: NodeRegistryLike,
): PartsListItem[] => {
  const outputPreviewNode = graph.nodes.find(isOutputPreviewNode)
  const diagnosticsVm = selectDiagnosticsVm({
    graph,
    evaluation: evaluateSpaghettiGraph(graph),
  })
  return outputSurface.entries.map((entry) => {
    const sourceNodeId = entry.sourceNodeId.length > 0 ? entry.sourceNodeId : null
    const sourceNode =
      sourceNodeId === null
        ? undefined
        : graph.nodes.find((node) => node.nodeId === sourceNodeId)
    const matchingEdges =
      outputPreviewNode === undefined
        ? []
        : findIncomingSlotEdges(graph.edges, outputPreviewNode.nodeId, entry.slotId)
    const matchingEdge = matchingEdges[0]
    const unresolvedEdge = matchingEdges.find(
      (edge) => diagnosticsVm.edgeStatusById[edge.edgeId]?.kind !== 'ok',
    )

    return {
      rowId: `parts-slot:${entry.slotId}`,
      key: entry.slotId,
      slotId: entry.slotId,
      slotStatus: toPartsListSlotStatus(entry.state),
      warningMessage:
        entry.diagnosticsState === 'hasDiagnostics'
          ? (unresolvedEdge === undefined
              ? null
              : (diagnosticsVm.edgeStatusById[unresolvedEdge.edgeId]?.message ?? null))
          : null,
      isConnected: sourceNodeId !== null,
      sourceNodeId,
      sourcePortId: matchingEdge?.from.portId ?? null,
      sourceNodeType: sourceNode?.type.length ? sourceNode.type : null,
      sourceNodeLabel:
        sourceNode === undefined ? (sourceNodeId ?? null) : resolveSourceNodeLabel(sourceNode, nodeRegistry),
    }
  })
}

type PartsListItemsCache = {
  graph?: SpaghettiGraph
  nodeRegistry?: NodeRegistryLike
  value?: PartsListItem[]
}

let partsListItemsCache: PartsListItemsCache = {}

type PartsListOutputSurfaceCache = {
  graph?: SpaghettiGraph
  outputSurface?: GraphOutputSurface | null
  nodeRegistry?: NodeRegistryLike
  value?: PartsListItem[]
}

let partsListOutputSurfaceCache: PartsListOutputSurfaceCache = {}

type PartsListPanelCache = {
  graph?: SpaghettiGraph
  nodeRegistry?: NodeRegistryLike
  value?: PartsListPanelVm
}

let partsListPanelCache: PartsListPanelCache = {}

type PartsListPanelOutputSurfaceCache = {
  graph?: SpaghettiGraph
  outputSurface?: GraphOutputSurface | null
  nodeRegistry?: NodeRegistryLike
  value?: PartsListPanelVm
}

let partsListPanelOutputSurfaceCache: PartsListPanelOutputSurfaceCache = {}

export const selectPartsListPanelVm = (
  graph: SpaghettiGraph,
  nodeRegistry: NodeRegistryLike = defaultNodeRegistry,
): PartsListPanelVm => {
  if (
    partsListPanelCache.graph === graph &&
    partsListPanelCache.nodeRegistry === nodeRegistry &&
    partsListPanelCache.value !== undefined
  ) {
    return partsListPanelCache.value
  }
  const allItems = selectPartsListItems(graph, nodeRegistry)
  const panelItems =
    allItems.length > 0 && allItems[allItems.length - 1]?.slotStatus === 'empty'
      ? allItems.slice(0, -1)
      : allItems
  const vm: PartsListPanelVm = {
    items: panelItems.map(toPanelItem),
  }
  partsListPanelCache = {
    graph,
    nodeRegistry,
    value: vm,
  }
  return vm
}

export const selectPartsListItemsFromOutputSurface = (
  graph: SpaghettiGraph,
  outputSurface: GraphOutputSurface | null,
  nodeRegistry: NodeRegistryLike = defaultNodeRegistry,
): PartsListItem[] => {
  if (outputSurface === null) {
    return []
  }
  if (
    partsListOutputSurfaceCache.graph === graph &&
    partsListOutputSurfaceCache.outputSurface === outputSurface &&
    partsListOutputSurfaceCache.nodeRegistry === nodeRegistry &&
    partsListOutputSurfaceCache.value !== undefined
  ) {
    return partsListOutputSurfaceCache.value
  }
  const value = buildPartsListItemsFromOutputSurface(graph, outputSurface, nodeRegistry)
  partsListOutputSurfaceCache = {
    graph,
    outputSurface,
    nodeRegistry,
    value,
  }
  return value
}

export const selectPartsListPanelVmFromOutputSurface = (
  graph: SpaghettiGraph,
  outputSurface: GraphOutputSurface | null,
  nodeRegistry: NodeRegistryLike = defaultNodeRegistry,
): PartsListPanelVm => {
  if (
    partsListPanelOutputSurfaceCache.graph === graph &&
    partsListPanelOutputSurfaceCache.outputSurface === outputSurface &&
    partsListPanelOutputSurfaceCache.nodeRegistry === nodeRegistry &&
    partsListPanelOutputSurfaceCache.value !== undefined
  ) {
    return partsListPanelOutputSurfaceCache.value
  }
  const allItems = selectPartsListItemsFromOutputSurface(graph, outputSurface, nodeRegistry)
  const panelItems =
    allItems.length > 0 && allItems[allItems.length - 1]?.slotStatus === 'empty'
      ? allItems.slice(0, -1)
      : allItems
  const value: PartsListPanelVm = {
    items: panelItems.map(toPanelItem),
  }
  partsListPanelOutputSurfaceCache = {
    graph,
    outputSurface,
    nodeRegistry,
    value,
  }
  return value
}
