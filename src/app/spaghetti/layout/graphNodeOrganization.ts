import type {
  GraphNodePos,
  SpaghettiEdge,
  SpaghettiNode,
} from '../schema/spaghettiTypes'

export type GraphNodeOrganizationSpacing = {
  originX: number
  originY: number
  columnX: number
  laneY: number
  disconnectedGapY: number
}

export type GraphNodeOrganizationPlan = {
  positionsByNodeId: Record<string, GraphNodePos>
  columnIndexByNodeId: Record<string, number>
  laneIndexByNodeId: Record<string, number>
}

export type GraphNodeOrganizationMode = 'parallel' | 'linear'

export type PlanGraphNodeOrganizationRequest = {
  nodes: readonly Pick<SpaghettiNode, 'nodeId' | 'type'>[]
  edges: readonly SpaghettiEdge[]
  nodePositions?: Readonly<Record<string, GraphNodePos>>
  mode?: GraphNodeOrganizationMode
  spacing?: Partial<GraphNodeOrganizationSpacing>
}

const DEFAULT_SPACING: GraphNodeOrganizationSpacing = {
  originX: 80,
  originY: 80,
  columnX: 360,
  laneY: 460,
  disconnectedGapY: 110,
}

const compareNodes = (
  left: Pick<SpaghettiNode, 'nodeId' | 'type'>,
  right: Pick<SpaghettiNode, 'nodeId' | 'type'>,
): number => left.type.localeCompare(right.type) || left.nodeId.localeCompare(right.nodeId)

const roundNodePos = (position: GraphNodePos): GraphNodePos => ({
  x: Math.round(position.x),
  y: Math.round(position.y),
  ...(typeof position.width === 'number' && Number.isFinite(position.width)
    ? { width: Math.round(position.width) }
    : {}),
})

export const planGraphNodeOrganization = ({
  edges,
  mode = 'parallel',
  nodePositions = {},
  nodes,
  spacing: spacingInput = {},
}: PlanGraphNodeOrganizationRequest): GraphNodeOrganizationPlan => {
  const spacing = {
    ...DEFAULT_SPACING,
    ...spacingInput,
  }
  const sortedNodes = [...nodes].sort(compareNodes)
  const nodeIds = new Set(sortedNodes.map((node) => node.nodeId))
  const incomingByNodeId = new Map<string, Set<string>>()
  const outgoingByNodeId = new Map<string, Set<string>>()

  sortedNodes.forEach((node) => {
    incomingByNodeId.set(node.nodeId, new Set())
    outgoingByNodeId.set(node.nodeId, new Set())
  })

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.from.nodeId) || !nodeIds.has(edge.to.nodeId)) {
      return
    }
    incomingByNodeId.get(edge.to.nodeId)?.add(edge.from.nodeId)
    outgoingByNodeId.get(edge.from.nodeId)?.add(edge.to.nodeId)
  })

  const connectedNodeIds = new Set<string>()
  edges.forEach((edge) => {
    if (!nodeIds.has(edge.from.nodeId) || !nodeIds.has(edge.to.nodeId)) {
      return
    }
    connectedNodeIds.add(edge.from.nodeId)
    connectedNodeIds.add(edge.to.nodeId)
  })

  const columnIndexByNodeId = new Map<string, number>()
  sortedNodes.forEach((node) => {
    columnIndexByNodeId.set(node.nodeId, 0)
  })

  for (let pass = 0; pass < sortedNodes.length; pass += 1) {
    let changed = false
    for (const node of sortedNodes) {
      const incoming = [...(incomingByNodeId.get(node.nodeId) ?? [])]
      if (incoming.length === 0) {
        continue
      }
      const nextColumn =
        Math.max(...incoming.map((sourceNodeId) => columnIndexByNodeId.get(sourceNodeId) ?? 0)) + 1
      if (nextColumn > (columnIndexByNodeId.get(node.nodeId) ?? 0)) {
        columnIndexByNodeId.set(node.nodeId, nextColumn)
        changed = true
      }
    }
    if (!changed) {
      break
    }
  }

  const connectedNodes = sortedNodes.filter((node) => connectedNodeIds.has(node.nodeId))
  const disconnectedNodes = sortedNodes.filter((node) => !connectedNodeIds.has(node.nodeId))
  const maxConnectedColumn = Math.max(
    0,
    ...connectedNodes.map((node) => columnIndexByNodeId.get(node.nodeId) ?? 0),
  )

  if (mode === 'linear') {
    const sortedConnectedNodes = [...connectedNodes].sort(
      (left, right) =>
        (columnIndexByNodeId.get(left.nodeId) ?? 0) -
          (columnIndexByNodeId.get(right.nodeId) ?? 0) || compareNodes(left, right),
    )
    const linearNodes = [...sortedConnectedNodes, ...disconnectedNodes]
    const positionsByNodeId: Record<string, GraphNodePos> = {}
    const laneIndexByNodeId: Record<string, number> = {}
    const columnIndexRecordByNodeId: Record<string, number> = {}

    linearNodes.forEach((node, index) => {
      const currentPosition = nodePositions[node.nodeId]
      columnIndexRecordByNodeId[node.nodeId] = index
      laneIndexByNodeId[node.nodeId] = 0
      positionsByNodeId[node.nodeId] = roundNodePos({
        x: spacing.originX + index * spacing.columnX,
        y: spacing.originY,
        ...(typeof currentPosition?.width === 'number'
          ? { width: currentPosition.width }
          : {}),
      })
    })

    return {
      positionsByNodeId,
      columnIndexByNodeId: columnIndexRecordByNodeId,
      laneIndexByNodeId,
    }
  }

  const nodesByColumn = new Map<number, typeof connectedNodes>()

  connectedNodes.forEach((node) => {
    const columnIndex = columnIndexByNodeId.get(node.nodeId) ?? 0
    nodesByColumn.set(columnIndex, [...(nodesByColumn.get(columnIndex) ?? []), node])
  })

  const positionsByNodeId: Record<string, GraphNodePos> = {}
  const laneIndexByNodeId: Record<string, number> = {}
  const columnIndexRecordByNodeId: Record<string, number> = {}

  ;[...nodesByColumn.entries()]
    .sort(([leftColumn], [rightColumn]) => leftColumn - rightColumn)
    .forEach(([columnIndex, columnNodes]) => {
      columnNodes.sort(compareNodes).forEach((node, laneIndex) => {
        const currentPosition = nodePositions[node.nodeId]
        columnIndexRecordByNodeId[node.nodeId] = columnIndex
        laneIndexByNodeId[node.nodeId] = laneIndex
        positionsByNodeId[node.nodeId] = roundNodePos({
          x: spacing.originX + columnIndex * spacing.columnX,
          y: spacing.originY + laneIndex * spacing.laneY,
          ...(typeof currentPosition?.width === 'number'
            ? { width: currentPosition.width }
            : {}),
        })
      })
    })

  const disconnectedStartY =
    spacing.originY +
    Math.max(1, ...[...nodesByColumn.values()].map((columnNodes) => columnNodes.length)) *
      spacing.laneY +
    spacing.disconnectedGapY
  disconnectedNodes.forEach((node, index) => {
    const currentPosition = nodePositions[node.nodeId]
    const columnIndex = maxConnectedColumn + 1
    columnIndexRecordByNodeId[node.nodeId] = columnIndex
    laneIndexByNodeId[node.nodeId] = index
    positionsByNodeId[node.nodeId] = roundNodePos({
      x: spacing.originX + columnIndex * spacing.columnX,
      y: disconnectedStartY + index * spacing.laneY,
      ...(typeof currentPosition?.width === 'number'
        ? { width: currentPosition.width }
        : {}),
    })
  })

  return {
    positionsByNodeId,
    columnIndexByNodeId: columnIndexRecordByNodeId,
    laneIndexByNodeId,
  }
}
