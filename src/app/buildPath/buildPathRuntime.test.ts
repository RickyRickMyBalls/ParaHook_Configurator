import { describe, expect, it } from 'vitest'
import {
  cancelGraphCommandBeforeCommit,
  commitReadyGraphCommandPlan,
  createReadyGraphCommandCommitPlan,
} from '../console/commandCommitContract'
import { createEditHistoryStore } from '../store/editHistoryStore'
import type { BuildPathEvent } from './buildPathEvents'
import { createBuildPathLifecycleCard } from './buildPathLifecycle'
import {
  addBuildPathRuntimeGraphDependencies,
  appendBuildPathRuntimeLifecycleCard,
  appendBuildPathRuntimeEvent,
  createBuildPathRuntimeState,
  intakeGraphCommandCommitForBuildPath,
  readBuildPathRuntimeEvents,
  readBuildPathRuntimeGraphDependencies,
  readBuildPathRuntimeLifecycleCards,
  readBuildPathRuntimeMasterTimeline,
  replaceBuildPathRuntimeGraphReconstruction,
} from './buildPathRuntime'

const createTestEvent = ({
  eventSequence,
  graphDocumentId = 'graph-document-1',
  projectionId,
  sourceKind = 'recorded',
}: {
  eventSequence: number
  graphDocumentId?: string
  projectionId: string
  sourceKind?: BuildPathEvent['sourceKind']
}): BuildPathEvent => ({
  buildPathEventId: `build-path-event:${eventSequence}:${projectionId}`,
  sourceProjectionId: projectionId,
  sourceKind,
  graphDocumentId,
  commandFamily: 'Sketch',
  entryPoint: 'console-root',
  eventSequence,
  affectedNodeIds: [`node-${projectionId}`],
  affectedEdgeIds: [],
  affectedOutputIds: [],
  mutationSummary: {
    createdNodeIds: [`node-${projectionId}`],
    reusedNodeIds: [],
    updatedNodeIds: [],
    addedEdgeIds: [],
    removedEdgeIds: [],
  },
  buildResultState: { kind: 'pending' },
  timelineRole: 'unclassified',
})

describe('Build Path runtime state', () => {
  it('starts with an empty event list and empty master timeline read', () => {
    const state = createBuildPathRuntimeState()
    const timeline = readBuildPathRuntimeMasterTimeline(state)

    expect(readBuildPathRuntimeEvents(state)).toEqual([])
    expect(state.nextEventSequence).toBe(1)
    expect(timeline).toMatchObject({
      timelineId: 'build-path-master-linear-timeline',
      status: 'empty',
      steps: [],
    })
  })

  it('appends accepted events and derives the master timeline without sharing arrays', () => {
    const state = createBuildPathRuntimeState()
    const firstEvent = createTestEvent({
      eventSequence: 1,
      projectionId: 'projection-sketch-1',
    })
    const result = appendBuildPathRuntimeEvent({ state, event: firstEvent })

    firstEvent.affectedNodeIds.push('node-late-mutation')

    expect(result.status).toBe('accepted')
    expect(result.state.nextEventSequence).toBe(2)
    expect(readBuildPathRuntimeEvents(result.state)[0].affectedNodeIds).toEqual([
      'node-projection-sketch-1',
    ])
    expect(readBuildPathRuntimeMasterTimeline(result.state).steps.map((step) => step.eventReference)).toEqual([
      {
        buildPathEventId: 'build-path-event:1:projection-sketch-1',
        sourceProjectionId: 'projection-sketch-1',
        graphDocumentId: 'graph-document-1',
        eventSequence: 1,
      },
    ])
  })

  it('does not add duplicate event ids', () => {
    const event = createTestEvent({
      eventSequence: 1,
      projectionId: 'projection-sketch-1',
    })
    const accepted = appendBuildPathRuntimeEvent({
      state: createBuildPathRuntimeState(),
      event,
    })

    const duplicate = appendBuildPathRuntimeEvent({
      state: accepted.state,
      event,
    })

    expect(duplicate.status).toBe('duplicate-projection')
    expect(readBuildPathRuntimeEvents(duplicate.state)).toHaveLength(1)
    expect(duplicate.state).toBe(accepted.state)
  })

  it('stores graph dependency hints without duplicating or sharing arrays', () => {
    const state = createBuildPathRuntimeState()
    const nextState = addBuildPathRuntimeGraphDependencies({
      state,
      dependencies: [
        {
          edgeId: 'edge-profile-1',
          fromNodeId: 'node-sketch-1',
          toNodeId: 'node-extrude-1',
        },
        {
          edgeId: 'edge-profile-1',
          fromNodeId: 'node-sketch-1',
          toNodeId: 'node-extrude-1',
        },
      ],
    })

    const dependencies = readBuildPathRuntimeGraphDependencies(nextState)
    dependencies[0].fromNodeId = 'mutated-late'

    expect(readBuildPathRuntimeGraphDependencies(nextState)).toEqual([
      {
        edgeId: 'edge-profile-1',
        fromNodeId: 'node-sketch-1',
        toNodeId: 'node-extrude-1',
      },
    ])
  expect(addBuildPathRuntimeGraphDependencies({
      state: nextState,
      dependencies: readBuildPathRuntimeGraphDependencies(nextState),
    })).toBe(nextState)
  })

  it('replaces only reconstructed data for the loaded graph', () => {
    const recordedEvent = createTestEvent({
      eventSequence: 1,
      graphDocumentId: 'graph-document-live',
      projectionId: 'recorded-live',
    })
    const staleReconstructedEvent = createTestEvent({
      eventSequence: 2,
      graphDocumentId: 'graph-document-loaded',
      projectionId: 'stale-reconstructed',
      sourceKind: 'reconstructed',
    })
    const nextReconstructedEvent = createTestEvent({
      eventSequence: 1,
      graphDocumentId: 'graph-document-loaded',
      projectionId: 'next-reconstructed',
      sourceKind: 'reconstructed',
    })
    const staleLoadedCard = createBuildPathLifecycleCard({
      lifecycleKind: 'graph-loaded',
      graphDocumentId: 'graph-document-loaded',
      graphLabel: 'Stale Loaded Graph',
      sourceKind: 'reconstructed',
      eventSequence: 1,
    })
    const nextLoadedCard = createBuildPathLifecycleCard({
      lifecycleKind: 'graph-loaded',
      graphDocumentId: 'graph-document-loaded',
      graphLabel: 'Next Loaded Graph',
      sourceKind: 'reconstructed',
      eventSequence: 1,
    })
    const state = addBuildPathRuntimeGraphDependencies({
      state: createBuildPathRuntimeState([recordedEvent, staleReconstructedEvent], [staleLoadedCard]),
      dependencies: [
        {
          edgeId: 'edge-stale',
          fromNodeId: 'node-a',
          toNodeId: 'node-b',
          graphDocumentId: 'graph-document-loaded',
          sourceKind: 'reconstructed',
        },
        {
          edgeId: 'edge-recorded',
          fromNodeId: 'node-live-a',
          toNodeId: 'node-live-b',
        },
      ],
    })

    const nextState = replaceBuildPathRuntimeGraphReconstruction({
      state,
      graphDocumentId: 'graph-document-loaded',
      lifecycleCards: [nextLoadedCard],
      events: [nextReconstructedEvent],
      dependencies: [
        {
          edgeId: 'edge-next',
          fromNodeId: 'node-next-a',
          toNodeId: 'node-next-b',
          graphDocumentId: 'graph-document-loaded',
          sourceKind: 'reconstructed',
        },
      ],
    })

    expect(readBuildPathRuntimeEvents(nextState).map((event) => event.sourceProjectionId)).toEqual([
      'recorded-live',
      'next-reconstructed',
    ])
    expect(readBuildPathRuntimeLifecycleCards(nextState).map((card) => card.graphLabel)).toEqual([
      'Next Loaded Graph',
    ])
    expect(readBuildPathRuntimeGraphDependencies(nextState)).toEqual([
      {
        edgeId: 'edge-recorded',
        fromNodeId: 'node-live-a',
        toNodeId: 'node-live-b',
      },
      {
        edgeId: 'edge-next',
        fromNodeId: 'node-next-a',
        toNodeId: 'node-next-b',
        graphDocumentId: 'graph-document-loaded',
        sourceKind: 'reconstructed',
      },
    ])
  })

  it('appends Graph Created lifecycle cards without creating build events', () => {
    const state = appendBuildPathRuntimeLifecycleCard({
      state: createBuildPathRuntimeState(),
      lifecycleKind: 'graph-created',
      graphDocumentId: 'graph-document-new',
      graphLabel: 'Graph New',
    })
    const timeline = readBuildPathRuntimeMasterTimeline(state)

    expect(readBuildPathRuntimeEvents(state)).toEqual([])
    expect(readBuildPathRuntimeLifecycleCards(state)).toMatchObject([
      {
        lifecycleKind: 'graph-created',
        graphDocumentId: 'graph-document-new',
        graphLabel: 'Graph New',
        isStructural: true,
        affectsGeometry: false,
      },
    ])
    expect(timeline.steps).toHaveLength(1)
    expect(timeline.steps[0].display).toEqual({
      label: 'Graph Created',
      icon: 'graph-created',
      iconLabel: 'Graph created lifecycle card',
    })
  })
})

describe('Build Path command projection intake', () => {
  it('turns accepted Sketch and Extrude command summaries into ordered runtime events', () => {
    const sketchSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Sketch',
        entryPoint: 'console-root',
        intendedMutations: ['create-node'],
      }),
      {
        createdNodeIds: ['node-sketch-1'],
      },
    )
    const extrudeSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Extrude',
        entryPoint: 'viewport-toolbar',
        intendedMutations: ['create-node', 'add-wire'],
      }),
      {
        createdNodeIds: ['node-extrude-1'],
        addedEdgeIds: ['edge-profile-1'],
      },
    )

    const sketchResult = intakeGraphCommandCommitForBuildPath({
      state: createBuildPathRuntimeState(),
      graphDocumentId: 'graph-document-1',
      projectionId: 'projection-sketch-1',
      commandSummary: sketchSummary,
      acceptedAt: '2026-05-22T20:00:00.000Z',
    })
    const extrudeResult = intakeGraphCommandCommitForBuildPath({
      state: sketchResult.state,
      graphDocumentId: 'graph-document-1',
      projectionId: 'projection-extrude-1',
      commandSummary: extrudeSummary,
      outputIds: ['output-preview-1'],
      buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
    })

    expect(sketchResult.status).toBe('accepted')
    expect(extrudeResult.status).toBe('accepted')
    expect(readBuildPathRuntimeEvents(extrudeResult.state)).toMatchObject([
      {
        buildPathEventId: 'build-path-event:1:projection-sketch-1',
        commandFamily: 'Sketch',
        eventSequence: 1,
        acceptedAt: '2026-05-22T20:00:00.000Z',
      },
      {
        buildPathEventId: 'build-path-event:2:projection-extrude-1',
        commandFamily: 'Extrude',
        eventSequence: 2,
        affectedEdgeIds: ['edge-profile-1'],
        affectedOutputIds: ['output-preview-1'],
        buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
      },
    ])
    expect(readBuildPathRuntimeMasterTimeline(extrudeResult.state).steps.map((step) => step.display.icon)).toEqual([
      'sketch',
      'extrude',
    ])
  })

  it('skips cancelled command summaries and preserves deterministic sequence numbers', () => {
    const cancelledSummary = cancelGraphCommandBeforeCommit({
      commandFamily: 'Extrude',
      entryPoint: 'console-root',
      reason: 'missing-profile-selection',
    })
    const sketchSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Sketch',
        entryPoint: 'viewport-shortcut',
        intendedMutations: ['create-node'],
      }),
      {
        createdNodeIds: ['node-sketch-1'],
      },
    )

    const skipped = intakeGraphCommandCommitForBuildPath({
      state: createBuildPathRuntimeState(),
      graphDocumentId: 'graph-document-1',
      commandSummary: cancelledSummary,
    })
    const accepted = intakeGraphCommandCommitForBuildPath({
      state: skipped.state,
      graphDocumentId: 'graph-document-1',
      projectionId: 'projection-sketch-after-cancel',
      commandSummary: sketchSummary,
    })

    expect(skipped.status).toBe('skipped')
    expect(skipped.state.nextEventSequence).toBe(1)
    expect(accepted.status).toBe('accepted')
    expect(accepted.event?.eventSequence).toBe(1)
  })

  it('does not duplicate intake for the same source projection', () => {
    const sketchSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Sketch',
        entryPoint: 'feature-assist',
        intendedMutations: ['reuse-node'],
      }),
      {
        reusedNodeIds: ['node-sketch-existing'],
      },
    )
    const first = intakeGraphCommandCommitForBuildPath({
      state: createBuildPathRuntimeState(),
      graphDocumentId: 'graph-document-1',
      projectionId: 'projection-sketch-reuse',
      commandSummary: sketchSummary,
    })
    const second = intakeGraphCommandCommitForBuildPath({
      state: first.state,
      graphDocumentId: 'graph-document-1',
      projectionId: 'projection-sketch-reuse',
      commandSummary: sketchSummary,
    })

    expect(first.status).toBe('accepted')
    expect(second.status).toBe('duplicate-projection')
    expect(readBuildPathRuntimeEvents(second.state)).toHaveLength(1)
    expect(second.state.nextEventSequence).toBe(2)
  })

  it('does not affect canonical Edit History undo or redo stacks during intake', () => {
    const editHistory = createEditHistoryStore()
    const sketchSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Sketch',
        entryPoint: 'console-root',
        intendedMutations: ['create-node'],
      }),
      {
        createdNodeIds: ['node-sketch-1'],
      },
    )

    editHistory.commitEntry({
      entryId: 'authored-entry-1',
      label: 'Authored edit',
      source: { surface: 'graph' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistory.undo()

    const redoBefore = editHistory.getRedoEntries().map((entry) => entry.entryId)
    const result = intakeGraphCommandCommitForBuildPath({
      state: createBuildPathRuntimeState(),
      graphDocumentId: 'graph-document-1',
      projectionId: 'projection-sketch-history-safe',
      commandSummary: sketchSummary,
    })

    expect(result.status).toBe('accepted')
    expect(editHistory.getUndoEntries()).toEqual([])
    expect(editHistory.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })
})
