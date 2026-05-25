import { create } from 'zustand'
import { editHistoryStore } from '../store/editHistoryStore'
import {
  addBuildPathRuntimeGraphDependencies,
  appendBuildPathRuntimeLifecycleCard,
  appendBuildPathRuntimeEvent,
  createBuildPathRuntimeState,
  intakeGraphCommandCommitForBuildPath,
  intakeBuildPathCommandProjection,
  readBuildPathRuntimeEvents,
  readBuildPathRuntimeGraphDependencies,
  readBuildPathRuntimeLifecycleCards,
  readBuildPathRuntimeMasterTimeline,
  replaceBuildPathRuntimeGraphReconstruction,
  replaceBuildPathRuntimeGraphSnapshot,
  type BuildPathRuntimeIntakeResult,
  type BuildPathRuntimeState,
} from './buildPathRuntime'
import type { BuildPathEvent } from './buildPathEvents'
import type { BuildPathLifecycleCard, BuildPathLifecycleKind } from './buildPathLifecycle'
import type {
  BuildPathCommandProjection,
  BuildPathProjectionBuildResultState,
} from '../console/buildPathProjection'
import type { GraphCommandCommitSummary } from '../console/commandCommitContract'
import {
  createBuildPathMasterScrubState,
  selectBuildPathMasterTimelineStep,
  type BuildPathMasterScrubState,
  type BuildPathMasterTimeline,
  type BuildPathGraphDependency,
  type BuildPathTimelineStep,
} from './buildPathTimeline'

export type BuildPathTopologyAlignment = 'top' | 'center' | 'bottom'

export type BuildPathRuntimeStoreState = {
  runtimeState: BuildPathRuntimeState
  selectedTimelineStepId: string | null
  isParallelModeEnabled: boolean
  topologyAlignment: BuildPathTopologyAlignment
  isParallelLaneReadbackExpanded: boolean
  selectedBranchTimelineStepIdByLaneId: Record<string, string>
  appendEvent: (event: BuildPathEvent) => BuildPathRuntimeIntakeResult
  appendLifecycleCard: (request: {
    lifecycleKind: BuildPathLifecycleKind
    graphDocumentId: string
    graphLabel?: string
    acceptedAt?: string
  }) => void
  addGraphDependencies: (dependencies: readonly BuildPathGraphDependency[]) => void
  replaceGraphReconstruction: (request: {
    graphDocumentId: string
    lifecycleCards?: readonly BuildPathLifecycleCard[]
    events: readonly BuildPathEvent[]
    dependencies: readonly BuildPathGraphDependency[]
  }) => void
  replaceGraphSnapshot: (request: {
    graphDocumentId: string
    events: readonly BuildPathEvent[]
    dependencies: readonly BuildPathGraphDependency[]
  }) => void
  intakeCommandProjection: (
    projection: BuildPathCommandProjection | null,
    acceptedAt?: string,
  ) => BuildPathRuntimeIntakeResult
  intakeGraphCommandCommit: (request: {
    graphDocumentId: string
    commandSummary: GraphCommandCommitSummary
    projectionId?: string
    outputIds?: readonly string[]
    buildResultState?: BuildPathProjectionBuildResultState
    acceptedAt?: string
  }) => BuildPathRuntimeIntakeResult
  readEvents: () => BuildPathEvent[]
  readLifecycleCards: () => BuildPathLifecycleCard[]
  readGraphDependencies: () => BuildPathGraphDependency[]
  readMasterTimeline: () => BuildPathMasterTimeline
  readMasterScrubState: () => BuildPathMasterScrubState
  readSelectedTimelineStep: () => BuildPathTimelineStep | null
  selectTimelineStep: (timelineStepId: string | null) => BuildPathMasterScrubState
  setParallelModeEnabled: (isEnabled: boolean) => void
  setTopologyAlignment: (alignment: BuildPathTopologyAlignment) => void
  setParallelLaneReadbackExpanded: (isExpanded: boolean) => void
  selectBranchTimelineStep: (branchLaneId: string, timelineStepId: string) => void
  resetRuntimeState: (events?: readonly BuildPathEvent[]) => void
}

const readTimelineStepIdForEvent = (
  timeline: BuildPathMasterTimeline,
  event: BuildPathEvent | null,
): string | null => {
  if (event === null) {
    return null
  }

  return timeline.steps.find(
    (step) =>
      step.stepKind === 'build-event' &&
      step.eventReference.buildPathEventId === event.buildPathEventId,
  )?.timelineStepId ?? null
}

const readSelectedTimelineStepIdForAcceptedResult = (
  result: BuildPathRuntimeIntakeResult,
): string | null => {
  if (result.status !== 'accepted') {
    return null
  }

  return readTimelineStepIdForEvent(
    readBuildPathRuntimeMasterTimeline(result.state),
    result.event,
  )
}

const createBuildPathTimelineSelectionHistoryEntryId = (nextTimelineStepId: string | null): string =>
  [
    'build-path-select-timeline-step',
    nextTimelineStepId ?? 'none',
    Date.now().toString(),
  ].join(':')

export const useBuildPathRuntimeStore = create<BuildPathRuntimeStoreState>((set, get) => ({
  runtimeState: createBuildPathRuntimeState(),
  selectedTimelineStepId: null,
  isParallelModeEnabled: false,
  topologyAlignment: 'center',
  isParallelLaneReadbackExpanded: false,
  selectedBranchTimelineStepIdByLaneId: {},
  appendEvent: (event) => {
    const result = appendBuildPathRuntimeEvent({
      event,
      state: get().runtimeState,
    })
    if (result.state !== get().runtimeState) {
      set({
        runtimeState: result.state,
        selectedTimelineStepId: readSelectedTimelineStepIdForAcceptedResult(result),
      })
    }
    return result
  },
  appendLifecycleCard: ({ acceptedAt, graphDocumentId, graphLabel, lifecycleKind }) => {
    const nextState = appendBuildPathRuntimeLifecycleCard({
      acceptedAt,
      graphDocumentId,
      graphLabel,
      lifecycleKind,
      state: get().runtimeState,
    })
    if (nextState !== get().runtimeState) {
      set({ runtimeState: nextState })
    }
  },
  addGraphDependencies: (dependencies) => {
    const nextState = addBuildPathRuntimeGraphDependencies({
      dependencies,
      state: get().runtimeState,
    })
    if (nextState !== get().runtimeState) {
      set({ runtimeState: nextState })
    }
  },
  replaceGraphReconstruction: ({ dependencies, events, graphDocumentId, lifecycleCards }) => {
    const nextState = replaceBuildPathRuntimeGraphReconstruction({
      dependencies,
      events,
      graphDocumentId,
      lifecycleCards,
      state: get().runtimeState,
    })
    if (nextState !== get().runtimeState) {
      set({ runtimeState: nextState })
    }
  },
  replaceGraphSnapshot: ({ dependencies, events, graphDocumentId }) => {
    const nextState = replaceBuildPathRuntimeGraphSnapshot({
      dependencies,
      events,
      graphDocumentId,
      state: get().runtimeState,
    })
    if (nextState !== get().runtimeState) {
      set({ runtimeState: nextState })
    }
  },
  intakeCommandProjection: (projection, acceptedAt) => {
    const result = intakeBuildPathCommandProjection({
      acceptedAt,
      projection,
      state: get().runtimeState,
    })
    if (result.state !== get().runtimeState) {
      set({
        runtimeState: result.state,
        selectedTimelineStepId: readSelectedTimelineStepIdForAcceptedResult(result),
      })
    }
    return result
  },
  intakeGraphCommandCommit: ({
    acceptedAt,
    buildResultState,
    commandSummary,
    graphDocumentId,
    outputIds,
    projectionId,
  }) => {
    const result = intakeGraphCommandCommitForBuildPath({
      acceptedAt,
      buildResultState,
      commandSummary,
      graphDocumentId,
      outputIds,
      projectionId,
      state: get().runtimeState,
    })
    if (result.state !== get().runtimeState) {
      set({
        runtimeState: result.state,
        selectedTimelineStepId: readSelectedTimelineStepIdForAcceptedResult(result),
      })
    }
    return result
  },
  readEvents: () => readBuildPathRuntimeEvents(get().runtimeState),
  readLifecycleCards: () => readBuildPathRuntimeLifecycleCards(get().runtimeState),
  readGraphDependencies: () => readBuildPathRuntimeGraphDependencies(get().runtimeState),
  readMasterTimeline: () => readBuildPathRuntimeMasterTimeline(get().runtimeState),
  readMasterScrubState: () => {
    const timeline = readBuildPathRuntimeMasterTimeline(get().runtimeState)
    const selectedTimelineStepId = get().selectedTimelineStepId

    if (selectedTimelineStepId === null) {
      return createBuildPathMasterScrubState(timeline)
    }

    return selectBuildPathMasterTimelineStep(timeline, selectedTimelineStepId)
  },
  readSelectedTimelineStep: () => {
    const timeline = readBuildPathRuntimeMasterTimeline(get().runtimeState)
    const selectedTimelineStepId = get().readMasterScrubState().selectedTimelineStepId

    return timeline.steps.find((step) => step.timelineStepId === selectedTimelineStepId) ?? null
  },
  selectTimelineStep: (timelineStepId) => {
    const timeline = readBuildPathRuntimeMasterTimeline(get().runtimeState)
    const previousScrubState = get().readMasterScrubState()
    const scrubState = selectBuildPathMasterTimelineStep(timeline, timelineStepId)

    if (previousScrubState.selectedTimelineStepId === scrubState.selectedTimelineStepId) {
      return scrubState
    }

    set({ selectedTimelineStepId: scrubState.selectedTimelineStepId })
    editHistoryStore.commitEntry({
      entryId: createBuildPathTimelineSelectionHistoryEntryId(scrubState.selectedTimelineStepId),
      label: 'Build Path timeline selection',
      source: {
        surface: 'build-path',
        sourceId: 'master-timeline',
        sourceLabel: 'Build Path',
      },
      targetId: scrubState.selectedTimelineStepId ?? undefined,
      targetLabel: scrubState.selectedOrderIndex === null
        ? undefined
        : `Step ${scrubState.selectedOrderIndex + 1}`,
      undo: () => {
        const nextTimeline = readBuildPathRuntimeMasterTimeline(get().runtimeState)
        const previousState = selectBuildPathMasterTimelineStep(
          nextTimeline,
          previousScrubState.selectedTimelineStepId,
        )
        set({ selectedTimelineStepId: previousState.selectedTimelineStepId })
      },
      redo: () => {
        const nextTimeline = readBuildPathRuntimeMasterTimeline(get().runtimeState)
        const nextState = selectBuildPathMasterTimelineStep(
          nextTimeline,
          scrubState.selectedTimelineStepId,
        )
        set({ selectedTimelineStepId: nextState.selectedTimelineStepId })
      },
    })

    return scrubState
  },
  setParallelModeEnabled: (isParallelModeEnabled) => {
    set({ isParallelModeEnabled })
  },
  setTopologyAlignment: (topologyAlignment) => {
    set({ topologyAlignment })
  },
  setParallelLaneReadbackExpanded: (isParallelLaneReadbackExpanded) => {
    set({ isParallelLaneReadbackExpanded })
  },
  selectBranchTimelineStep: (branchLaneId, timelineStepId) => {
    set((state) => ({
      selectedBranchTimelineStepIdByLaneId: {
        ...state.selectedBranchTimelineStepIdByLaneId,
        [branchLaneId]: timelineStepId,
      },
    }))
  },
  resetRuntimeState: (events = []) => {
    set({
      isParallelLaneReadbackExpanded: false,
      isParallelModeEnabled: false,
      selectedBranchTimelineStepIdByLaneId: {},
      runtimeState: createBuildPathRuntimeState(events),
      selectedTimelineStepId: null,
      topologyAlignment: 'center',
    })
  },
}))
