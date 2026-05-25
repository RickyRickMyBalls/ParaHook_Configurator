import {
  projectGraphCommandCommitForBuildPath,
  type BuildPathCommandProjection,
  type BuildPathProjectionBuildResultState,
} from '../console/buildPathProjection'
import type { GraphCommandCommitSummary } from '../console/commandCommitContract'
import {
  createBuildPathEventFromCommandProjection,
  type BuildPathEvent,
} from './buildPathEvents'
import {
  createBuildPathLifecycleCard,
  type BuildPathLifecycleCard,
  type BuildPathLifecycleKind,
} from './buildPathLifecycle'
import {
  deriveBuildPathMasterTimeline,
  type BuildPathGraphDependency,
  type BuildPathMasterTimeline,
} from './buildPathTimeline'

export type BuildPathRuntimeState = {
  events: BuildPathEvent[]
  lifecycleCards: BuildPathLifecycleCard[]
  graphDependencies: BuildPathGraphDependency[]
  nextEventSequence: number
}

export type BuildPathRuntimeIntakeResult =
  | {
    status: 'accepted'
    event: BuildPathEvent
    state: BuildPathRuntimeState
  }
  | {
    status: 'duplicate-projection' | 'skipped'
    event: null
    state: BuildPathRuntimeState
  }

export type IntakeBuildPathCommandProjectionRequest = {
  state: BuildPathRuntimeState
  projection: BuildPathCommandProjection | null
  acceptedAt?: string
}

export type IntakeGraphCommandCommitForBuildPathRequest = {
  state: BuildPathRuntimeState
  graphDocumentId: string
  commandSummary: GraphCommandCommitSummary
  projectionId?: string
  outputIds?: readonly string[]
  buildResultState?: BuildPathProjectionBuildResultState
  acceptedAt?: string
}

export type ReplaceBuildPathRuntimeGraphReconstructionRequest = {
  state: BuildPathRuntimeState
  graphDocumentId: string
  lifecycleCards?: readonly BuildPathLifecycleCard[]
  events: readonly BuildPathEvent[]
  dependencies: readonly BuildPathGraphDependency[]
}

export type ReplaceBuildPathRuntimeGraphSnapshotRequest = {
  state: BuildPathRuntimeState
  graphDocumentId: string
  events: readonly BuildPathEvent[]
  dependencies: readonly BuildPathGraphDependency[]
}

export type AppendBuildPathRuntimeLifecycleCardRequest = {
  state: BuildPathRuntimeState
  lifecycleKind: BuildPathLifecycleKind
  graphDocumentId: string
  graphLabel?: string
  acceptedAt?: string
}

export const createBuildPathRuntimeState = (
  events: readonly BuildPathEvent[] = [],
  lifecycleCards: readonly BuildPathLifecycleCard[] = [],
): BuildPathRuntimeState => {
  const copiedEvents = events.map(cloneBuildPathEvent)
  const copiedLifecycleCards = lifecycleCards.map(cloneBuildPathLifecycleCard)
  const maxSequence = copiedEvents.reduce(
    (max, event) => Math.max(max, event.eventSequence),
    0,
  )
  const maxLifecycleSequence = copiedLifecycleCards.reduce(
    (max, card) => Math.max(max, card.eventSequence),
    0,
  )

  return {
    events: copiedEvents,
    lifecycleCards: copiedLifecycleCards,
    graphDependencies: [],
    nextEventSequence: Math.max(maxSequence, maxLifecycleSequence) + 1,
  }
}

export const readBuildPathRuntimeEvents = (
  state: BuildPathRuntimeState,
): BuildPathEvent[] => state.events.map(cloneBuildPathEvent)

export const readBuildPathRuntimeLifecycleCards = (
  state: BuildPathRuntimeState,
): BuildPathLifecycleCard[] => state.lifecycleCards.map(cloneBuildPathLifecycleCard)

export const readBuildPathRuntimeGraphDependencies = (
  state: BuildPathRuntimeState,
): BuildPathGraphDependency[] => state.graphDependencies.map(cloneBuildPathGraphDependency)

export const readBuildPathRuntimeMasterTimeline = (
  state: BuildPathRuntimeState,
): BuildPathMasterTimeline => deriveBuildPathMasterTimeline(state.events, state.lifecycleCards)

export const appendBuildPathRuntimeEvent = ({
  event,
  state,
}: {
  event: BuildPathEvent
  state: BuildPathRuntimeState
}): BuildPathRuntimeIntakeResult => {
  if (hasEventWithId(state, event.buildPathEventId)) {
    return {
      status: 'duplicate-projection',
      event: null,
      state,
    }
  }

  return acceptEvent(state, event)
}

export const appendBuildPathRuntimeLifecycleCard = ({
  acceptedAt,
  graphDocumentId,
  graphLabel,
  lifecycleKind,
  state,
}: AppendBuildPathRuntimeLifecycleCardRequest): BuildPathRuntimeState => {
  const card = createBuildPathLifecycleCard({
    acceptedAt,
    eventSequence: state.nextEventSequence,
    graphDocumentId,
    graphLabel,
    lifecycleKind,
  })

  if (state.lifecycleCards.some(
    (candidate) => candidate.buildPathLifecycleCardId === card.buildPathLifecycleCardId,
  )) {
    return state
  }

  return {
    ...state,
    lifecycleCards: [
      ...state.lifecycleCards.map(cloneBuildPathLifecycleCard),
      cloneBuildPathLifecycleCard(card),
    ],
    nextEventSequence: card.eventSequence + 1,
  }
}

export const addBuildPathRuntimeGraphDependencies = ({
  dependencies,
  state,
}: {
  dependencies: readonly BuildPathGraphDependency[]
  state: BuildPathRuntimeState
}): BuildPathRuntimeState => {
  const existingKeys = new Set(state.graphDependencies.map(createDependencyKey))
  const nextDependencies = dependencies.filter((dependency) => {
    const key = createDependencyKey(dependency)
    if (existingKeys.has(key)) {
      return false
    }
    existingKeys.add(key)
    return true
  })

  if (nextDependencies.length === 0) {
    return state
  }

  return {
    ...state,
    graphDependencies: [
      ...state.graphDependencies.map(cloneBuildPathGraphDependency),
      ...nextDependencies.map(cloneBuildPathGraphDependency),
    ],
  }
}

export const replaceBuildPathRuntimeGraphReconstruction = ({
  dependencies,
  events,
  graphDocumentId,
  lifecycleCards = [],
  state,
}: ReplaceBuildPathRuntimeGraphReconstructionRequest): BuildPathRuntimeState => {
  const retainedEvents = state.events.filter(
    (event) => !(event.graphDocumentId === graphDocumentId && event.sourceKind === 'reconstructed'),
  )
  const retainedLifecycleCards = state.lifecycleCards.filter(
    (card) => !(card.graphDocumentId === graphDocumentId && card.sourceKind === 'reconstructed'),
  )
  const retainedDependencies = state.graphDependencies.filter(
    (dependency) =>
      !(
        dependency.graphDocumentId === graphDocumentId &&
        dependency.sourceKind === 'reconstructed'
      ),
  )
  const nextEvents = [...retainedEvents, ...events].map(cloneBuildPathEvent)
  const nextLifecycleCards = [
    ...retainedLifecycleCards,
    ...lifecycleCards,
  ].map(cloneBuildPathLifecycleCard)
  const maxEventSequence = nextEvents.reduce(
    (max, event) => Math.max(max, event.eventSequence),
    0,
  )
  const maxLifecycleSequence = nextLifecycleCards.reduce(
    (max, card) => Math.max(max, card.eventSequence),
    0,
  )

  return {
    events: nextEvents,
    lifecycleCards: nextLifecycleCards,
    graphDependencies: [
      ...retainedDependencies.map(cloneBuildPathGraphDependency),
      ...dependencies.map(cloneBuildPathGraphDependency),
    ],
    nextEventSequence: Math.max(
      state.nextEventSequence,
      maxEventSequence + 1,
      maxLifecycleSequence + 1,
    ),
  }
}

export const replaceBuildPathRuntimeGraphSnapshot = ({
  dependencies,
  events,
  graphDocumentId,
  state,
}: ReplaceBuildPathRuntimeGraphSnapshotRequest): BuildPathRuntimeState => {
  const retainedEvents = state.events.filter((event) => event.graphDocumentId !== graphDocumentId)
  const retainedDependencies = state.graphDependencies.filter(
    (dependency) => dependency.graphDocumentId !== graphDocumentId,
  )
  const nextEvents = [...retainedEvents, ...events].map(cloneBuildPathEvent)
  const maxEventSequence = nextEvents.reduce(
    (max, event) => Math.max(max, event.eventSequence),
    0,
  )

  return {
    events: nextEvents,
    lifecycleCards: state.lifecycleCards.map(cloneBuildPathLifecycleCard),
    graphDependencies: [
      ...retainedDependencies.map(cloneBuildPathGraphDependency),
      ...dependencies.map(cloneBuildPathGraphDependency),
    ],
    nextEventSequence: Math.max(state.nextEventSequence, maxEventSequence + 1),
  }
}

export const intakeBuildPathCommandProjection = ({
  acceptedAt,
  projection,
  state,
}: IntakeBuildPathCommandProjectionRequest): BuildPathRuntimeIntakeResult => {
  if (projection === null) {
    return {
      status: 'skipped',
      event: null,
      state,
    }
  }

  if (hasEventFromProjection(state, projection.projectionId)) {
    return {
      status: 'duplicate-projection',
      event: null,
      state,
    }
  }

  return acceptEvent(
    state,
    createBuildPathEventFromCommandProjection({
      acceptedAt,
      eventSequence: state.nextEventSequence,
      projection,
    }),
  )
}

export const intakeGraphCommandCommitForBuildPath = ({
  acceptedAt,
  buildResultState,
  commandSummary,
  graphDocumentId,
  outputIds,
  projectionId,
  state,
}: IntakeGraphCommandCommitForBuildPathRequest): BuildPathRuntimeIntakeResult =>
  intakeBuildPathCommandProjection({
    acceptedAt,
    projection: projectGraphCommandCommitForBuildPath({
      buildResultState,
      commandSummary,
      graphDocumentId,
      outputIds,
      projectionId,
    }),
    state,
  })

const acceptEvent = (
  state: BuildPathRuntimeState,
  event: BuildPathEvent,
): Extract<BuildPathRuntimeIntakeResult, { status: 'accepted' }> => ({
  status: 'accepted',
  event: cloneBuildPathEvent(event),
  state: {
    events: [...state.events.map(cloneBuildPathEvent), cloneBuildPathEvent(event)],
    lifecycleCards: state.lifecycleCards.map(cloneBuildPathLifecycleCard),
    graphDependencies: state.graphDependencies.map(cloneBuildPathGraphDependency),
    nextEventSequence: Math.max(state.nextEventSequence, event.eventSequence + 1),
  },
})

const hasEventFromProjection = (
  state: BuildPathRuntimeState,
  projectionId: string,
): boolean => state.events.some((event) => event.sourceProjectionId === projectionId)

const hasEventWithId = (
  state: BuildPathRuntimeState,
  buildPathEventId: string,
): boolean => state.events.some((event) => event.buildPathEventId === buildPathEventId)

const cloneBuildPathEvent = (event: BuildPathEvent): BuildPathEvent => ({
  ...event,
  affectedNodeIds: [...event.affectedNodeIds],
  affectedEdgeIds: [...event.affectedEdgeIds],
  affectedOutputIds: [...event.affectedOutputIds],
  mutationSummary: {
    createdNodeIds: [...event.mutationSummary.createdNodeIds],
    reusedNodeIds: [...event.mutationSummary.reusedNodeIds],
    updatedNodeIds: [...event.mutationSummary.updatedNodeIds],
    addedEdgeIds: [...event.mutationSummary.addedEdgeIds],
    removedEdgeIds: [...event.mutationSummary.removedEdgeIds],
  },
})

const cloneBuildPathLifecycleCard = (
  card: BuildPathLifecycleCard,
): BuildPathLifecycleCard => ({ ...card })

const cloneBuildPathGraphDependency = (
  dependency: BuildPathGraphDependency,
): BuildPathGraphDependency => ({ ...dependency })

const createDependencyKey = (dependency: BuildPathGraphDependency): string =>
  [dependency.edgeId, dependency.fromNodeId, dependency.toNodeId].join(':')
