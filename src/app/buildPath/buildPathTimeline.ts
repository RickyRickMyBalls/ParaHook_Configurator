import type { BuildPathEvent } from './buildPathEvents'
import type { BuildPathLifecycleCard } from './buildPathLifecycle'
import { getTypeColor } from '../spaghetti/canvas/typeColors'
import type { PortKind } from '../spaghetti/schema/spaghettiTypes'

export const BUILD_PATH_MASTER_TIMELINE_ID = 'build-path-master-linear-timeline'

export type BuildPathTimelineStatus = 'empty' | 'ready'

export type BuildPathTimelineStepIcon = 'sketch' | 'extrude' | 'graph-created' | 'graph-loaded'

export type BuildPathTimelineStepDisplayMetadata = {
  label: string
  icon: BuildPathTimelineStepIcon
  iconLabel: string
}

export type BuildPathTimelineEventReference = {
  buildPathEventId: string
  sourceProjectionId: string
  graphDocumentId: string
  eventSequence: number
}

export type BuildPathBuildEventTimelineStep = {
  timelineStepId: string
  stepKind: 'build-event'
  orderIndex: number
  eventReference: BuildPathTimelineEventReference
  event: BuildPathEvent
  display: BuildPathTimelineStepDisplayMetadata
}

export type BuildPathLifecycleTimelineStep = {
  timelineStepId: string
  stepKind: 'lifecycle-card'
  orderIndex: number
  eventReference: BuildPathTimelineEventReference
  lifecycleCard: BuildPathLifecycleCard
  display: BuildPathTimelineStepDisplayMetadata
}

export type BuildPathTimelineStep =
  | BuildPathBuildEventTimelineStep
  | BuildPathLifecycleTimelineStep

export type BuildPathTimelineEmptyState = {
  title: string
  detail: string
}

export type BuildPathMasterTimeline = {
  timelineId: typeof BUILD_PATH_MASTER_TIMELINE_ID
  status: BuildPathTimelineStatus
  steps: BuildPathTimelineStep[]
  emptyState?: BuildPathTimelineEmptyState
}

export type BuildPathMasterScrubState = {
  mode: 'master'
  timelineId: typeof BUILD_PATH_MASTER_TIMELINE_ID
  isViewOnly: true
  selectedTimelineStepId: string | null
  selectedOrderIndex: number | null
  selectedEventReference: BuildPathTimelineEventReference | null
}

export type BuildPathGraphDependency = {
  edgeId: string
  fromNodeId: string
  toNodeId: string
  fromPortId?: string
  toPortId?: string
  connectorKind?: PortKind
  connectorColor?: string
  graphDocumentId?: string
  sourceKind?: 'recorded' | 'reconstructed'
}

export type BuildPathBranchTimelineRole = Exclude<BuildPathEvent['timelineRole'], 'unclassified'>

export type BuildPathBranchEventClassification = {
  timelineStepId: string
  role: BuildPathBranchTimelineRole
  branchLaneId: string
  predecessorTimelineStepIds: string[]
  dependencyEdgeIds: string[]
  isCheckpointCandidate: boolean
}

export type BuildPathBranchLane = {
  branchLaneId: string
  timelineStepIds: string[]
  originTimelineStepId: string
  latestTimelineStepId: string
}

export type BuildPathBranchProjection = {
  masterTimelineId: typeof BUILD_PATH_MASTER_TIMELINE_ID
  masterTimelineStepIds: string[]
  lanes: BuildPathBranchLane[]
  eventClassifications: BuildPathBranchEventClassification[]
}

export type BuildPathTopologyNodeKind = 'timeline-step' | 'output-sink'

export type BuildPathTopologyNodeIcon = BuildPathTimelineStepIcon | 'output-preview'

export type BuildPathTopologyNode = {
  topologyNodeId: string
  nodeKind: BuildPathTopologyNodeKind
  graphNodeId: string
  timelineStepId: string | null
  orderIndex: number
  columnIndex: number
  laneIndex: number
  display: {
    label: string
    icon: BuildPathTopologyNodeIcon
    iconLabel: string
  }
}

export type BuildPathTopologyConnector = {
  connectorId: string
  edgeId: string
  fromTopologyNodeId: string
  toTopologyNodeId: string
  fromGraphNodeId: string
  toGraphNodeId: string
  fromPortId: string | null
  toPortId: string | null
  connectorKind: PortKind | null
  connectorColor: string
}

export type BuildPathTopologyColumn = {
  columnIndex: number
  topologyNodeIds: string[]
}

export type BuildPathTopologyLayout = {
  status: 'empty' | 'ready'
  masterTimelineId: typeof BUILD_PATH_MASTER_TIMELINE_ID
  masterTimelineStepIds: string[]
  columns: BuildPathTopologyColumn[]
  nodes: BuildPathTopologyNode[]
  connectors: BuildPathTopologyConnector[]
}

export type BuildPathBranchPlayhead = {
  branchLaneId: string
  selectedTimelineStepId: string | null
  selectedOrderIndex: number | null
  anchorMasterTimelineStepId: string | null
}

export type BuildPathParallelScrubState = {
  mode: 'parallel'
  isViewOnly: true
  masterTimelineId: typeof BUILD_PATH_MASTER_TIMELINE_ID
  masterPlayhead: BuildPathMasterScrubState
  branchPlayheads: Record<string, BuildPathBranchPlayhead>
}

export type BuildPathExplicitActionKind = 'restore' | 'branch-from-here' | 'compare' | 'pin'

export type BuildPathExplicitActionBoundary = {
  actionKind: BuildPathExplicitActionKind
  status: 'planned-explicit-command'
  requiresExplicitUserCommand: true
  isTriggeredByScrub: false
  ownerPhase: 'future'
}

export type BuildPathExplicitActionBoundaries = Record<
  BuildPathExplicitActionKind,
  BuildPathExplicitActionBoundary
>

export const BUILD_PATH_MASTER_TIMELINE_EMPTY_STATE: BuildPathTimelineEmptyState = {
  title: 'No accepted build events',
  detail: 'Accepted graph build events will appear in the master timeline.',
}

const displayMetadataByCommandFamily: Record<
  BuildPathEvent['commandFamily'],
  BuildPathTimelineStepDisplayMetadata
> = {
  Sketch: {
    label: 'Sketch',
    icon: 'sketch',
    iconLabel: 'Sketch build event',
  },
  Extrude: {
    label: 'Extrude',
    icon: 'extrude',
    iconLabel: 'Extrude build event',
  },
}

const displayMetadataByLifecycleKind: Record<
  BuildPathLifecycleCard['lifecycleKind'],
  BuildPathTimelineStepDisplayMetadata
> = {
  'graph-created': {
    label: 'Graph Created',
    icon: 'graph-created',
    iconLabel: 'Graph created lifecycle card',
  },
  'graph-loaded': {
    label: 'Graph Loaded',
    icon: 'graph-loaded',
    iconLabel: 'Graph loaded lifecycle card',
  },
}

const createBuildPathTimelineStepId = (event: BuildPathEvent): string =>
  ['build-path-step', event.eventSequence.toString(), event.buildPathEventId].join(':')

const createBuildPathLifecycleTimelineStepId = (card: BuildPathLifecycleCard): string =>
  ['build-path-step', card.eventSequence.toString(), card.buildPathLifecycleCardId].join(':')

const createBuildPathTimelineEventReference = (
  event: BuildPathEvent,
): BuildPathTimelineEventReference => ({
  buildPathEventId: event.buildPathEventId,
  sourceProjectionId: event.sourceProjectionId,
  graphDocumentId: event.graphDocumentId,
  eventSequence: event.eventSequence,
})

const createBuildPathLifecycleEventReference = (
  card: BuildPathLifecycleCard,
): BuildPathTimelineEventReference => ({
  buildPathEventId: card.buildPathLifecycleCardId,
  sourceProjectionId: card.buildPathLifecycleCardId,
  graphDocumentId: card.graphDocumentId,
  eventSequence: card.eventSequence,
})

const getDisplayMetadataForEvent = (
  event: BuildPathEvent,
): BuildPathTimelineStepDisplayMetadata => ({
  ...displayMetadataByCommandFamily[event.commandFamily],
})

const getDisplayMetadataForLifecycleCard = (
  card: BuildPathLifecycleCard,
): BuildPathTimelineStepDisplayMetadata => ({
  ...displayMetadataByLifecycleKind[card.lifecycleKind],
})

export const isBuildPathBuildEventTimelineStep = (
  step: BuildPathTimelineStep,
): step is BuildPathBuildEventTimelineStep => step.stepKind === 'build-event'

const compareTimelineSourceOrder = (
  left: { eventSequence: number; id: string },
  right: { eventSequence: number; id: string },
): number => {
  const sequenceOrder = left.eventSequence - right.eventSequence

  if (sequenceOrder !== 0) {
    return sequenceOrder
  }

  return left.id.localeCompare(right.id)
}

export const deriveBuildPathMasterTimeline = (
  events: readonly BuildPathEvent[],
  lifecycleCards: readonly BuildPathLifecycleCard[] = [],
): BuildPathMasterTimeline => {
  const orderedSources = [
    ...events.map((event) => ({
      sourceKind: 'build-event' as const,
      eventSequence: event.eventSequence,
      id: event.buildPathEventId,
      event,
    })),
    ...lifecycleCards.map((lifecycleCard) => ({
      sourceKind: 'lifecycle-card' as const,
      eventSequence: lifecycleCard.eventSequence,
      id: lifecycleCard.buildPathLifecycleCardId,
      lifecycleCard,
    })),
  ].sort(compareTimelineSourceOrder)

  const steps = orderedSources.map((source, orderIndex): BuildPathTimelineStep => {
    if (source.sourceKind === 'lifecycle-card') {
      return {
        timelineStepId: createBuildPathLifecycleTimelineStepId(source.lifecycleCard),
        stepKind: 'lifecycle-card',
        orderIndex,
        eventReference: createBuildPathLifecycleEventReference(source.lifecycleCard),
        lifecycleCard: source.lifecycleCard,
        display: getDisplayMetadataForLifecycleCard(source.lifecycleCard),
      }
    }

    return {
      timelineStepId: createBuildPathTimelineStepId(source.event),
      stepKind: 'build-event',
      orderIndex,
      eventReference: createBuildPathTimelineEventReference(source.event),
      event: source.event,
      display: getDisplayMetadataForEvent(source.event),
    }
  })

  return {
    timelineId: BUILD_PATH_MASTER_TIMELINE_ID,
    status: steps.length === 0 ? 'empty' : 'ready',
    steps,
    ...(steps.length === 0 ? { emptyState: { ...BUILD_PATH_MASTER_TIMELINE_EMPTY_STATE } } : {}),
  }
}

export const createBuildPathMasterScrubState = (
  timeline: BuildPathMasterTimeline,
): BuildPathMasterScrubState => {
  const firstStep = timeline.steps[0] ?? null

  return {
    mode: 'master',
    timelineId: timeline.timelineId,
    isViewOnly: true,
    selectedTimelineStepId: firstStep?.timelineStepId ?? null,
    selectedOrderIndex: firstStep?.orderIndex ?? null,
    selectedEventReference: firstStep?.eventReference ?? null,
  }
}

export const selectBuildPathMasterTimelineStep = (
  timeline: BuildPathMasterTimeline,
  timelineStepId: string | null,
): BuildPathMasterScrubState => {
  if (timelineStepId === null) {
    return {
      mode: 'master',
      timelineId: timeline.timelineId,
      isViewOnly: true,
      selectedTimelineStepId: null,
      selectedOrderIndex: null,
      selectedEventReference: null,
    }
  }

  const selectedStep = timeline.steps.find((step) => step.timelineStepId === timelineStepId) ?? null

  return {
    mode: 'master',
    timelineId: timeline.timelineId,
    isViewOnly: true,
    selectedTimelineStepId: selectedStep?.timelineStepId ?? null,
    selectedOrderIndex: selectedStep?.orderIndex ?? null,
    selectedEventReference: selectedStep?.eventReference ?? null,
  }
}

const createBranchLaneId = (laneIndex: number): string => `build-path-branch-lane:${laneIndex}`

export const deriveBuildPathBranchProjection = ({
  dependencies,
  timeline,
}: {
  dependencies: readonly BuildPathGraphDependency[]
  timeline: BuildPathMasterTimeline
}): BuildPathBranchProjection => {
  const lanes: BuildPathBranchLane[] = []
  const eventClassifications: BuildPathBranchEventClassification[] = []
  const nodeOwnerByNodeId = new Map<string, { branchLaneId: string; timelineStepId: string }>()
  const rootStepIds = new Set<string>()

  timeline.steps.filter(isBuildPathBuildEventTimelineStep).forEach((step) => {
    const affectedNodeIds = new Set(step.event.affectedNodeIds)
    const predecessorMatches = dependencies.flatMap((dependency) => {
      if (!affectedNodeIds.has(dependency.toNodeId)) {
        return []
      }
      const predecessor = nodeOwnerByNodeId.get(dependency.fromNodeId)
      return predecessor === undefined
        ? []
        : [{
            dependency,
            predecessor,
          }]
    })
    const predecessorTimelineStepIds = uniqueInOrder(
      predecessorMatches.map((match) => match.predecessor.timelineStepId),
    )
    const predecessorLaneIds = uniqueInOrder(
      predecessorMatches.map((match) => match.predecessor.branchLaneId),
    )
    const dependencyEdgeIds = uniqueInOrder(
      predecessorMatches.map((match) => match.dependency.edgeId),
    )
    const branchLaneId = predecessorLaneIds[0] ?? createBranchLaneId(lanes.length + 1)
    const existingLane = lanes.find((lane) => lane.branchLaneId === branchLaneId) ?? null

    if (existingLane === null) {
      lanes.push({
        branchLaneId,
        timelineStepIds: [step.timelineStepId],
        originTimelineStepId: step.timelineStepId,
        latestTimelineStepId: step.timelineStepId,
      })
      if (predecessorTimelineStepIds.length === 0) {
        rootStepIds.add(step.timelineStepId)
      }
    } else {
      existingLane.timelineStepIds = [...existingLane.timelineStepIds, step.timelineStepId]
      existingLane.latestTimelineStepId = step.timelineStepId
    }

    const isCheckpointCandidate =
      predecessorTimelineStepIds.length > 1 ||
      step.event.affectedOutputIds.length > 0 ||
      step.event.buildResultState.kind === 'linked'
    const role: BuildPathBranchTimelineRole =
      predecessorTimelineStepIds.length > 1
        ? 'merge'
        : predecessorTimelineStepIds.length === 0
          ? 'linear'
          : 'linear'

    eventClassifications.push({
      timelineStepId: step.timelineStepId,
      role,
      branchLaneId,
      predecessorTimelineStepIds,
      dependencyEdgeIds,
      isCheckpointCandidate,
    })

    step.event.affectedNodeIds.forEach((nodeId) => {
      nodeOwnerByNodeId.set(nodeId, {
        branchLaneId,
        timelineStepId: step.timelineStepId,
      })
    })
  })

  const hasParallelRoots = rootStepIds.size > 1
  const normalizedClassifications = hasParallelRoots
    ? eventClassifications.map((classification) =>
        lanes.some(
          (lane) =>
            lane.branchLaneId === classification.branchLaneId &&
            rootStepIds.has(lane.originTimelineStepId),
        ) && classification.role === 'linear'
          ? { ...classification, role: 'branch-local' as const }
          : classification,
      )
    : eventClassifications

  return {
    masterTimelineId: timeline.timelineId,
    masterTimelineStepIds: timeline.steps.map((step) => step.timelineStepId),
    lanes,
    eventClassifications: normalizedClassifications,
  }
}

const createBuildPathTopologyTimelineNodeId = (timelineStepId: string): string =>
  `build-path-topology-node:${timelineStepId}`

const createBuildPathTopologyOutputSinkNodeId = (graphNodeId: string): string =>
  `build-path-topology-output-sink:${graphNodeId}`

const isOutputSinkDependency = (dependency: BuildPathGraphDependency): boolean =>
  dependency.toPortId?.startsWith('in:solid:') === true

const compareTopologyNodesByOrder = (
  left: Pick<BuildPathTopologyNode, 'orderIndex' | 'topologyNodeId'>,
  right: Pick<BuildPathTopologyNode, 'orderIndex' | 'topologyNodeId'>,
): number => {
  const orderIndex = left.orderIndex - right.orderIndex
  return orderIndex === 0 ? left.topologyNodeId.localeCompare(right.topologyNodeId) : orderIndex
}

export const deriveBuildPathTopologyLayout = ({
  dependencies,
  timeline,
}: {
  dependencies: readonly BuildPathGraphDependency[]
  timeline: BuildPathMasterTimeline
}): BuildPathTopologyLayout => {
  const buildSteps = timeline.steps.filter(isBuildPathBuildEventTimelineStep)
  const topologyNodeById = new Map<string, BuildPathTopologyNode>()
  const topologyNodeIdByGraphNodeId = new Map<string, string>()

  buildSteps.forEach((step) => {
    const graphNodeId = step.event.affectedNodeIds[0]
    if (graphNodeId === undefined) {
      return
    }
    const topologyNodeId = createBuildPathTopologyTimelineNodeId(step.timelineStepId)
    topologyNodeById.set(topologyNodeId, {
      topologyNodeId,
      nodeKind: 'timeline-step',
      graphNodeId,
      timelineStepId: step.timelineStepId,
      orderIndex: step.orderIndex,
      columnIndex: 0,
      laneIndex: 0,
      display: {
        ...step.display,
      },
    })
    step.event.affectedNodeIds.forEach((nodeId) => {
      topologyNodeIdByGraphNodeId.set(nodeId, topologyNodeId)
    })
  })

  dependencies.forEach((dependency) => {
    if (
      !topologyNodeIdByGraphNodeId.has(dependency.toNodeId) &&
      topologyNodeIdByGraphNodeId.has(dependency.fromNodeId) &&
      isOutputSinkDependency(dependency)
    ) {
      const topologyNodeId = createBuildPathTopologyOutputSinkNodeId(dependency.toNodeId)
      if (!topologyNodeById.has(topologyNodeId)) {
        topologyNodeById.set(topologyNodeId, {
          topologyNodeId,
          nodeKind: 'output-sink',
          graphNodeId: dependency.toNodeId,
          timelineStepId: null,
          orderIndex: timeline.steps.length + topologyNodeById.size,
          columnIndex: 0,
          laneIndex: 0,
          display: {
            label: 'Output',
            icon: 'output-preview',
            iconLabel: 'Output Preview sink',
          },
        })
        topologyNodeIdByGraphNodeId.set(dependency.toNodeId, topologyNodeId)
      }
    }
  })

  const connectors = dependencies.flatMap((dependency): BuildPathTopologyConnector[] => {
    const fromTopologyNodeId = topologyNodeIdByGraphNodeId.get(dependency.fromNodeId)
    const toTopologyNodeId = topologyNodeIdByGraphNodeId.get(dependency.toNodeId)
    if (fromTopologyNodeId === undefined || toTopologyNodeId === undefined) {
      return []
    }
    const connectorKind = dependency.connectorKind ?? null
    return [{
      connectorId: `build-path-topology-connector:${dependency.edgeId}`,
      edgeId: dependency.edgeId,
      fromTopologyNodeId,
      toTopologyNodeId,
      fromGraphNodeId: dependency.fromNodeId,
      toGraphNodeId: dependency.toNodeId,
      fromPortId: dependency.fromPortId ?? null,
      toPortId: dependency.toPortId ?? null,
      connectorKind,
      connectorColor:
        dependency.connectorColor ??
        (connectorKind === null ? getTypeColor('number') : getTypeColor(connectorKind)),
    }]
  })

  const predecessorIdsByNodeId = new Map<string, Set<string>>()
  const successorIdsByNodeId = new Map<string, Set<string>>()
  topologyNodeById.forEach((_node, topologyNodeId) => {
    predecessorIdsByNodeId.set(topologyNodeId, new Set())
    successorIdsByNodeId.set(topologyNodeId, new Set())
  })
  connectors.forEach((connector) => {
    predecessorIdsByNodeId.get(connector.toTopologyNodeId)?.add(connector.fromTopologyNodeId)
    successorIdsByNodeId.get(connector.fromTopologyNodeId)?.add(connector.toTopologyNodeId)
  })

  const columnIndexByNodeId = new Map<string, number>()
  const orderedNodeIds = [...topologyNodeById.values()]
    .sort(compareTopologyNodesByOrder)
    .map((node) => node.topologyNodeId)

  orderedNodeIds.forEach((topologyNodeId) => {
    const predecessorColumnIndexes = [...(predecessorIdsByNodeId.get(topologyNodeId) ?? [])]
      .map((predecessorId) => columnIndexByNodeId.get(predecessorId) ?? 0)
    const columnIndex =
      predecessorColumnIndexes.length === 0
        ? 0
        : Math.max(...predecessorColumnIndexes) + 1
    columnIndexByNodeId.set(topologyNodeId, columnIndex)
  })

  const nodes = [...topologyNodeById.values()]
    .map((node) => ({
      ...node,
      columnIndex: columnIndexByNodeId.get(node.topologyNodeId) ?? 0,
    }))
    .sort((left, right) => left.columnIndex - right.columnIndex || compareTopologyNodesByOrder(left, right))

  const columnLaneCount = new Map<number, number>()
  nodes.forEach((node) => {
    const nextLaneIndex = columnLaneCount.get(node.columnIndex) ?? 0
    columnLaneCount.set(node.columnIndex, nextLaneIndex + 1)
    node.laneIndex = nextLaneIndex
  })

  const nodesWithLanes = nodes.map((node) => ({
    ...node,
  }))
  const columns = [...new Set(nodesWithLanes.map((node) => node.columnIndex))]
    .sort((left, right) => left - right)
    .map((columnIndex) => ({
      columnIndex,
      topologyNodeIds: nodesWithLanes
        .filter((node) => node.columnIndex === columnIndex)
        .sort(compareTopologyNodesByOrder)
        .map((node) => node.topologyNodeId),
    }))

  return {
    status: nodesWithLanes.length === 0 ? 'empty' : 'ready',
    masterTimelineId: timeline.timelineId,
    masterTimelineStepIds: timeline.steps.map((step) => step.timelineStepId),
    columns,
    nodes: nodesWithLanes,
    connectors,
  }
}

export const createBuildPathParallelScrubState = ({
  branchProjection,
  masterPlayhead,
}: {
  branchProjection: BuildPathBranchProjection
  masterPlayhead: BuildPathMasterScrubState
}): BuildPathParallelScrubState => ({
  mode: 'parallel',
  isViewOnly: true,
  masterTimelineId: branchProjection.masterTimelineId,
  masterPlayhead,
  branchPlayheads: Object.fromEntries(
    branchProjection.lanes.map((lane) => [
      lane.branchLaneId,
      {
        branchLaneId: lane.branchLaneId,
        selectedTimelineStepId: lane.originTimelineStepId,
        selectedOrderIndex: 0,
        anchorMasterTimelineStepId: masterPlayhead.selectedTimelineStepId,
      },
    ]),
  ),
})

export const selectBuildPathBranchTimelineStep = ({
  branchLaneId,
  branchProjection,
  parallelScrub,
  timelineStepId,
}: {
  branchLaneId: string
  branchProjection: BuildPathBranchProjection
  parallelScrub: BuildPathParallelScrubState
  timelineStepId: string
}): BuildPathParallelScrubState => {
  const lane = branchProjection.lanes.find((candidate) => candidate.branchLaneId === branchLaneId)
  const stepIndex = lane?.timelineStepIds.indexOf(timelineStepId) ?? -1
  if (lane === undefined || stepIndex < 0) {
    return parallelScrub
  }

  return {
    ...parallelScrub,
    branchPlayheads: {
      ...parallelScrub.branchPlayheads,
      [branchLaneId]: {
        branchLaneId,
        selectedTimelineStepId: timelineStepId,
        selectedOrderIndex: stepIndex,
        anchorMasterTimelineStepId: parallelScrub.masterPlayhead.selectedTimelineStepId,
      },
    },
  }
}

export const BUILD_PATH_EXPLICIT_ACTION_BOUNDARIES: BuildPathExplicitActionBoundaries = {
  restore: {
    actionKind: 'restore',
    status: 'planned-explicit-command',
    requiresExplicitUserCommand: true,
    isTriggeredByScrub: false,
    ownerPhase: 'future',
  },
  'branch-from-here': {
    actionKind: 'branch-from-here',
    status: 'planned-explicit-command',
    requiresExplicitUserCommand: true,
    isTriggeredByScrub: false,
    ownerPhase: 'future',
  },
  compare: {
    actionKind: 'compare',
    status: 'planned-explicit-command',
    requiresExplicitUserCommand: true,
    isTriggeredByScrub: false,
    ownerPhase: 'future',
  },
  pin: {
    actionKind: 'pin',
    status: 'planned-explicit-command',
    requiresExplicitUserCommand: true,
    isTriggeredByScrub: false,
    ownerPhase: 'future',
  },
}

const uniqueInOrder = (values: readonly string[]): string[] => {
  const seen = new Set<string>()
  const uniqueValues: string[] = []

  values.forEach((value) => {
    if (!seen.has(value)) {
      seen.add(value)
      uniqueValues.push(value)
    }
  })

  return uniqueValues
}
