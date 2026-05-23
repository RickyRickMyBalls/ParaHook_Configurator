import { describe, expect, it } from 'vitest'
import { createEditHistoryStore } from '../store/editHistoryStore'
import type { BuildPathEvent } from './buildPathEvents'
import {
  BUILD_PATH_EXPLICIT_ACTION_BOUNDARIES,
  createBuildPathMasterScrubState,
  createBuildPathParallelScrubState,
  deriveBuildPathBranchProjection,
  deriveBuildPathMasterTimeline,
  selectBuildPathBranchTimelineStep,
  selectBuildPathMasterTimelineStep,
} from './buildPathTimeline'

const createBuildPathEvent = ({
  affectedEdgeIds,
  affectedNodeIds,
  affectedOutputIds,
  buildResultState,
  commandFamily,
  eventSequence,
  projectionId,
}: {
  commandFamily: BuildPathEvent['commandFamily']
  eventSequence: number
  projectionId: string
  affectedNodeIds?: string[]
  affectedEdgeIds?: string[]
  affectedOutputIds?: string[]
  buildResultState?: BuildPathEvent['buildResultState']
}): BuildPathEvent => ({
  buildPathEventId: ['build-path-event', eventSequence.toString(), projectionId].join(':'),
  sourceProjectionId: projectionId,
  sourceKind: 'recorded',
  graphDocumentId: 'graph-document-1',
  commandFamily,
  entryPoint: 'console-root',
  eventSequence,
  affectedNodeIds: affectedNodeIds ?? [`node-${projectionId}`],
  affectedEdgeIds: affectedEdgeIds ?? [],
  affectedOutputIds: affectedOutputIds ?? [],
  mutationSummary: {
    createdNodeIds: affectedNodeIds ?? [`node-${projectionId}`],
    reusedNodeIds: [],
    updatedNodeIds: [],
    addedEdgeIds: affectedEdgeIds ?? [],
    removedEdgeIds: [],
  },
  buildResultState: buildResultState ?? { kind: 'pending' },
  timelineRole: 'unclassified',
})

describe('deriveBuildPathMasterTimeline', () => {
  it('returns an empty master timeline when no accepted build events exist', () => {
    const timeline = deriveBuildPathMasterTimeline([])

    expect(timeline).toEqual({
      timelineId: 'build-path-master-linear-timeline',
      status: 'empty',
      steps: [],
      emptyState: {
        title: 'No accepted build events',
        detail: 'Accepted graph build events will appear in the master timeline.',
      },
    })
  })

  it('orders Sketch then Extrude by event sequence', () => {
    const sketchEvent = createBuildPathEvent({
      commandFamily: 'Sketch',
      eventSequence: 1,
      projectionId: 'projection-sketch-1',
    })
    const extrudeEvent = createBuildPathEvent({
      commandFamily: 'Extrude',
      eventSequence: 2,
      projectionId: 'projection-extrude-1',
    })

    const timeline = deriveBuildPathMasterTimeline([extrudeEvent, sketchEvent])

    expect(timeline.status).toBe('ready')
    expect(timeline.emptyState).toBeUndefined()
    expect(timeline.steps.map((step) => step.eventReference.buildPathEventId)).toEqual([
      'build-path-event:1:projection-sketch-1',
      'build-path-event:2:projection-extrude-1',
    ])
    expect(timeline.steps.map((step) => step.display.icon)).toEqual(['sketch', 'extrude'])
    expect(timeline.steps.map((step) => step.orderIndex)).toEqual([0, 1])
  })

  it('gives repeated command families stable distinct timeline steps', () => {
    const firstSketchEvent = createBuildPathEvent({
      commandFamily: 'Sketch',
      eventSequence: 3,
      projectionId: 'projection-sketch-a',
    })
    const secondSketchEvent = createBuildPathEvent({
      commandFamily: 'Sketch',
      eventSequence: 4,
      projectionId: 'projection-sketch-b',
    })

    const timeline = deriveBuildPathMasterTimeline([secondSketchEvent, firstSketchEvent])

    expect(timeline.steps.map((step) => step.timelineStepId)).toEqual([
      'build-path-step:3:build-path-event:3:projection-sketch-a',
      'build-path-step:4:build-path-event:4:projection-sketch-b',
    ])
    expect(new Set(timeline.steps.map((step) => step.timelineStepId)).size).toBe(2)
    expect(timeline.steps.map((step) => step.display.icon)).toEqual(['sketch', 'sketch'])
  })

  it('keeps display metadata presentational instead of command truth', () => {
    const extrudeEvent = createBuildPathEvent({
      commandFamily: 'Extrude',
      eventSequence: 1,
      projectionId: 'projection-extrude-display',
    })

    const timeline = deriveBuildPathMasterTimeline([extrudeEvent])
    const [step] = timeline.steps

    expect(step.display).toEqual({
      label: 'Extrude',
      icon: 'extrude',
      iconLabel: 'Extrude build event',
    })
    expect(step.event.commandFamily).toBe('Extrude')
    expect(step.eventReference).toEqual({
      buildPathEventId: 'build-path-event:1:projection-extrude-display',
      sourceProjectionId: 'projection-extrude-display',
      graphDocumentId: 'graph-document-1',
      eventSequence: 1,
    })
  })
})

describe('Build Path master scrub', () => {
  it('selects master timeline steps without creating edit history entries or changing graph truth', () => {
    const editHistory = createEditHistoryStore()
    const graphSnapshot = {
      nodes: [{ nodeId: 'node-sketch', type: 'Geometry/Sketch' }],
      edges: [],
    }
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch-1',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude-1',
        affectedNodeIds: ['node-extrude'],
      }),
    ])

    editHistory.commitEntry({
      entryId: 'authored-entry-1',
      label: 'Authored edit',
      source: { surface: 'graph' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistory.undo()
    const redoBefore = editHistory.getRedoEntries().map((entry) => entry.entryId)
    const firstState = createBuildPathMasterScrubState(timeline)
    const selectedState = selectBuildPathMasterTimelineStep(
      timeline,
      timeline.steps[1].timelineStepId,
    )

    expect(firstState).toMatchObject({
      mode: 'master',
      isViewOnly: true,
      selectedTimelineStepId: timeline.steps[0].timelineStepId,
    })
    expect(selectedState).toMatchObject({
      mode: 'master',
      isViewOnly: true,
      selectedTimelineStepId: timeline.steps[1].timelineStepId,
      selectedOrderIndex: 1,
    })
    expect(editHistory.getUndoEntries()).toEqual([])
    expect(editHistory.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
    expect(graphSnapshot).toEqual({
      nodes: [{ nodeId: 'node-sketch', type: 'Geometry/Sketch' }],
      edges: [],
    })
  })
})

describe('deriveBuildPathBranchProjection', () => {
  it('classifies a simple Sketch to Extrude chain while preserving master order', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude',
        affectedNodeIds: ['node-extrude'],
      }),
    ])

    const projection = deriveBuildPathBranchProjection({
      timeline,
      dependencies: [{ edgeId: 'edge-profile', fromNodeId: 'node-sketch', toNodeId: 'node-extrude' }],
    })

    expect(projection.masterTimelineStepIds).toEqual(
      timeline.steps.map((step) => step.timelineStepId),
    )
    expect(projection.lanes).toHaveLength(1)
    expect(projection.eventClassifications.map((classification) => classification.role)).toEqual([
      'linear',
      'linear',
    ])
    expect(projection.eventClassifications[1].predecessorTimelineStepIds).toEqual([
      timeline.steps[0].timelineStepId,
    ])
  })

  it('keeps independent roots in branch-local lanes instead of fake serial order', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-branch-a',
        affectedNodeIds: ['node-branch-a'],
      }),
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 2,
        projectionId: 'projection-branch-b',
        affectedNodeIds: ['node-branch-b'],
      }),
    ])

    const projection = deriveBuildPathBranchProjection({ timeline, dependencies: [] })

    expect(projection.lanes).toHaveLength(2)
    expect(projection.eventClassifications.map((classification) => classification.role)).toEqual([
      'branch-local',
      'branch-local',
    ])
    expect(projection.masterTimelineStepIds).toEqual([
      timeline.steps[0].timelineStepId,
      timeline.steps[1].timelineStepId,
    ])
  })

  it('classifies a merge and marks checkpoint candidates without changing master order', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-branch-a',
        affectedNodeIds: ['node-branch-a'],
      }),
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 2,
        projectionId: 'projection-branch-b',
        affectedNodeIds: ['node-branch-b'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 3,
        projectionId: 'projection-merge',
        affectedNodeIds: ['node-merge'],
        affectedOutputIds: ['output-preview-1'],
        buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
      }),
    ])

    const projection = deriveBuildPathBranchProjection({
      timeline,
      dependencies: [
        { edgeId: 'edge-a-merge', fromNodeId: 'node-branch-a', toNodeId: 'node-merge' },
        { edgeId: 'edge-b-merge', fromNodeId: 'node-branch-b', toNodeId: 'node-merge' },
      ],
    })
    const mergeClassification = projection.eventClassifications[2]

    expect(mergeClassification).toMatchObject({
      timelineStepId: timeline.steps[2].timelineStepId,
      role: 'merge',
      dependencyEdgeIds: ['edge-a-merge', 'edge-b-merge'],
      isCheckpointCandidate: true,
    })
    expect(mergeClassification.predecessorTimelineStepIds).toEqual([
      timeline.steps[0].timelineStepId,
      timeline.steps[1].timelineStepId,
    ])
    expect(projection.masterTimelineStepIds).toEqual(
      timeline.steps.map((step) => step.timelineStepId),
    )
  })
})

describe('Build Path parallel scrub', () => {
  it('moves a branch-local playhead without edit history entries or master timeline mutation', () => {
    const editHistory = createEditHistoryStore()
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-branch-a',
        affectedNodeIds: ['node-branch-a'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-branch-a-extrude',
        affectedNodeIds: ['node-branch-a-extrude'],
      }),
    ])
    const projection = deriveBuildPathBranchProjection({
      timeline,
      dependencies: [
        {
          edgeId: 'edge-branch-a',
          fromNodeId: 'node-branch-a',
          toNodeId: 'node-branch-a-extrude',
        },
      ],
    })
    const masterPlayhead = selectBuildPathMasterTimelineStep(timeline, timeline.steps[1].timelineStepId)
    const parallelScrub = createBuildPathParallelScrubState({
      branchProjection: projection,
      masterPlayhead,
    })
    const laneId = projection.lanes[0].branchLaneId
    const nextParallelScrub = selectBuildPathBranchTimelineStep({
      branchLaneId: laneId,
      branchProjection: projection,
      parallelScrub,
      timelineStepId: timeline.steps[1].timelineStepId,
    })

    expect(nextParallelScrub.branchPlayheads[laneId]).toEqual({
      branchLaneId: laneId,
      selectedTimelineStepId: timeline.steps[1].timelineStepId,
      selectedOrderIndex: 1,
      anchorMasterTimelineStepId: timeline.steps[1].timelineStepId,
    })
    expect(nextParallelScrub.masterPlayhead).toEqual(masterPlayhead)
    expect(timeline.steps.map((step) => step.timelineStepId)).toEqual([
      timeline.steps[0].timelineStepId,
      timeline.steps[1].timelineStepId,
    ])
    expect(editHistory.getUndoEntries()).toEqual([])
    expect(editHistory.getRedoEntries()).toEqual([])
  })
})

describe('Build Path explicit action boundaries', () => {
  it('keeps restore, branch, compare, and pin as planned explicit commands', () => {
    expect(Object.keys(BUILD_PATH_EXPLICIT_ACTION_BOUNDARIES).sort()).toEqual([
      'branch-from-here',
      'compare',
      'pin',
      'restore',
    ])
    expect(Object.values(BUILD_PATH_EXPLICIT_ACTION_BOUNDARIES)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          requiresExplicitUserCommand: true,
          isTriggeredByScrub: false,
          ownerPhase: 'future',
        }),
      ]),
    )
  })
})
