import { getNodeDef } from '../registry/nodeRegistry'
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

type PartsListItemsCache = {
  graph?: SpaghettiGraph
  nodeRegistry?: NodeRegistryLike
  value?: PartsListItem[]
}

let partsListItemsCache: PartsListItemsCache = {}

type PartsListPanelCache = {
  graph?: SpaghettiGraph
  nodeRegistry?: NodeRegistryLike
  value?: PartsListPanelVm
}

let partsListPanelCache: PartsListPanelCache = {}

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
