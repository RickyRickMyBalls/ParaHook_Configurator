import type {
  GraphNodePos,
  SpaghettiEdge,
  SpaghettiNode,
} from '../schema/spaghettiTypes'

export type CommandNodePlacementRole = 'source' | 'consumer' | 'bridge' | 'output'

export type CommandNodePlacementReason =
  | 'downstream-of-upstream'
  | 'between-source-and-target'
  | 'stacked-repeat'
  | 'fallback-lane'

export type CommandNodePlacementSpacing = {
  downstreamX: number
  verticalStackY: number
  fallbackX: number
  fallbackY: number
}

export type CommandNodePlacement = {
  x: number
  y: number
  width?: number
}

export type CommandNodePlacementPlan = {
  positionsByNodeId: Record<string, CommandNodePlacement>
  reasonsByNodeId: Record<string, CommandNodePlacementReason>
}

export type PlanCommandNodePlacementRequest = {
  nodes: readonly Pick<SpaghettiNode, 'nodeId' | 'type'>[]
  edges: readonly SpaghettiEdge[]
  nodePositions?: Readonly<Record<string, GraphNodePos>>
  commandCreatedNodeIds: readonly string[]
  strongestUpstreamNodeId?: string | null
  targetNodeId?: string | null
  roleByNodeId?: Readonly<Record<string, CommandNodePlacementRole>>
  spacing?: Partial<CommandNodePlacementSpacing>
}

const DEFAULT_SPACING: CommandNodePlacementSpacing = {
  downstreamX: 320,
  verticalStackY: 160,
  fallbackX: 120,
  fallbackY: 120,
}

const roundPosition = (position: CommandNodePlacement): CommandNodePlacement => ({
  x: Math.round(position.x),
  y: Math.round(position.y),
  ...(typeof position.width === 'number' ? { width: Math.round(position.width) } : {}),
})

const getPosition = (
  nodeId: string | null | undefined,
  positions: Readonly<Record<string, GraphNodePos>>,
): GraphNodePos | null => {
  if (nodeId === null || nodeId === undefined) {
    return null
  }
  return positions[nodeId] ?? null
}

const findFirstPositionedIncomingSource = (
  nodeId: string,
  edges: readonly SpaghettiEdge[],
  positions: Readonly<Record<string, GraphNodePos>>,
): string | null =>
  edges.find((edge) => edge.to.nodeId === nodeId && positions[edge.from.nodeId] !== undefined)
    ?.from.nodeId ?? null

const findFirstPositionedOutgoingTarget = (
  nodeId: string,
  edges: readonly SpaghettiEdge[],
  positions: Readonly<Record<string, GraphNodePos>>,
): string | null =>
  edges.find((edge) => edge.from.nodeId === nodeId && positions[edge.to.nodeId] !== undefined)
    ?.to.nodeId ?? null

const makeOccupancyKey = (position: Pick<GraphNodePos, 'x' | 'y'>): string =>
  `${Math.round(position.x)}:${Math.round(position.y)}`

export const planCommandNodePlacement = ({
  commandCreatedNodeIds,
  edges,
  nodePositions = {},
  nodes,
  roleByNodeId = {},
  spacing: spacingInput = {},
  strongestUpstreamNodeId = null,
  targetNodeId = null,
}: PlanCommandNodePlacementRequest): CommandNodePlacementPlan => {
  const spacing: CommandNodePlacementSpacing = {
    ...DEFAULT_SPACING,
    ...spacingInput,
  }
  const nodeIds = new Set(nodes.map((node) => node.nodeId))
  const occupiedPositions = new Set(
    Object.values(nodePositions).map((position) => makeOccupancyKey(position)),
  )
  const anchorCounts = new Map<string, number>()
  const positionsByNodeId: Record<string, CommandNodePlacement> = {}
  const reasonsByNodeId: Record<string, CommandNodePlacementReason> = {}

  commandCreatedNodeIds.forEach((nodeId, commandIndex) => {
    if (!nodeIds.has(nodeId) || nodePositions[nodeId] !== undefined) {
      return
    }

    const role = roleByNodeId[nodeId] ?? 'consumer'
    const incomingSourceId =
      strongestUpstreamNodeId ??
      findFirstPositionedIncomingSource(nodeId, edges, nodePositions)
    const outgoingTargetId =
      targetNodeId ?? findFirstPositionedOutgoingTarget(nodeId, edges, nodePositions)
    const upstreamPosition = getPosition(incomingSourceId, nodePositions)
    const targetPosition = getPosition(outgoingTargetId, nodePositions)

    let anchorKey = 'fallback'
    let reason: CommandNodePlacementReason = 'fallback-lane'
    let nextPosition: CommandNodePlacement = {
      x: spacing.fallbackX,
      y: spacing.fallbackY + commandIndex * spacing.verticalStackY,
    }

    if (role === 'bridge' && upstreamPosition !== null && targetPosition !== null) {
      anchorKey = `bridge:${incomingSourceId ?? 'unknown'}:${outgoingTargetId ?? 'unknown'}`
      reason = 'between-source-and-target'
      nextPosition = {
        x: (upstreamPosition.x + targetPosition.x) / 2,
        y: (upstreamPosition.y + targetPosition.y) / 2,
      }
    } else if (upstreamPosition !== null) {
      anchorKey = `downstream:${incomingSourceId ?? 'unknown'}`
      reason = 'downstream-of-upstream'
      nextPosition = {
        x: upstreamPosition.x + spacing.downstreamX,
        y: upstreamPosition.y,
      }
    }

    const anchorCount = anchorCounts.get(anchorKey) ?? 0
    anchorCounts.set(anchorKey, anchorCount + 1)
    if (anchorCount > 0) {
      reason = 'stacked-repeat'
      nextPosition = {
        ...nextPosition,
        y: nextPosition.y + anchorCount * spacing.verticalStackY,
      }
    }

    let roundedPosition = roundPosition(nextPosition)
    while (occupiedPositions.has(makeOccupancyKey(roundedPosition))) {
      reason = 'stacked-repeat'
      roundedPosition = {
        ...roundedPosition,
        y: roundedPosition.y + spacing.verticalStackY,
      }
    }

    occupiedPositions.add(makeOccupancyKey(roundedPosition))
    positionsByNodeId[nodeId] = roundedPosition
    reasonsByNodeId[nodeId] = reason
  })

  return {
    positionsByNodeId,
    reasonsByNodeId,
  }
}
