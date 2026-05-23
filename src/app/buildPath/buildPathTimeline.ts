import type { BuildPathEvent } from './buildPathEvents'
import type { BuildPathLifecycleCard } from './buildPathLifecycle'

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
