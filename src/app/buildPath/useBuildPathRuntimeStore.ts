import { create } from 'zustand'
import {
  addBuildPathRuntimeGraphDependencies,
  appendBuildPathRuntimeEvent,
  createBuildPathRuntimeState,
  intakeGraphCommandCommitForBuildPath,
  intakeBuildPathCommandProjection,
  readBuildPathRuntimeEvents,
  readBuildPathRuntimeGraphDependencies,
  readBuildPathRuntimeMasterTimeline,
  replaceBuildPathRuntimeGraphReconstruction,
  type BuildPathRuntimeIntakeResult,
  type BuildPathRuntimeState,
} from './buildPathRuntime'
import type { BuildPathEvent } from './buildPathEvents'
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

export type BuildPathRuntimeStoreState = {
  runtimeState: BuildPathRuntimeState
  selectedTimelineStepId: string | null
  isParallelModeEnabled: boolean
  selectedBranchTimelineStepIdByLaneId: Record<string, string>
  appendEvent: (event: BuildPathEvent) => BuildPathRuntimeIntakeResult
  addGraphDependencies: (dependencies: readonly BuildPathGraphDependency[]) => void
  replaceGraphReconstruction: (request: {
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
  readGraphDependencies: () => BuildPathGraphDependency[]
  readMasterTimeline: () => BuildPathMasterTimeline
  readMasterScrubState: () => BuildPathMasterScrubState
  readSelectedTimelineStep: () => BuildPathTimelineStep | null
  selectTimelineStep: (timelineStepId: string | null) => BuildPathMasterScrubState
  setParallelModeEnabled: (isEnabled: boolean) => void
  selectBranchTimelineStep: (branchLaneId: string, timelineStepId: string) => void
  resetRuntimeState: (events?: readonly BuildPathEvent[]) => void
}

export const useBuildPathRuntimeStore = create<BuildPathRuntimeStoreState>((set, get) => ({
  runtimeState: createBuildPathRuntimeState(),
  selectedTimelineStepId: null,
  isParallelModeEnabled: false,
  selectedBranchTimelineStepIdByLaneId: {},
  appendEvent: (event) => {
    const result = appendBuildPathRuntimeEvent({
      event,
      state: get().runtimeState,
    })
    if (result.state !== get().runtimeState) {
      set({ runtimeState: result.state })
    }
    return result
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
  replaceGraphReconstruction: ({ dependencies, events, graphDocumentId }) => {
    const nextState = replaceBuildPathRuntimeGraphReconstruction({
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
      set({ runtimeState: result.state })
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
      set({ runtimeState: result.state })
    }
    return result
  },
  readEvents: () => readBuildPathRuntimeEvents(get().runtimeState),
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
    const scrubState = selectBuildPathMasterTimelineStep(timeline, timelineStepId)

    set({ selectedTimelineStepId: scrubState.selectedTimelineStepId })

    return scrubState
  },
  setParallelModeEnabled: (isParallelModeEnabled) => {
    set({ isParallelModeEnabled })
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
      isParallelModeEnabled: false,
      selectedBranchTimelineStepIdByLaneId: {},
      runtimeState: createBuildPathRuntimeState(events),
      selectedTimelineStepId: null,
    })
  },
}))
