import { describe, expect, it } from 'vitest'
import type { BuildPathEvent } from './buildPathEvents'
import {
  deriveBuildPathActionBoundaryRead,
  deriveBuildPathBranchFromHereReadiness,
  deriveBuildPathCheckpointReadiness,
  deriveBuildPathCompareReadiness,
  deriveBuildPathPinCheckpointReadiness,
  deriveBuildPathRestoreReadiness,
  deriveBuildPathWorkerCheckpointReadiness,
} from './buildPathActions'
import { deriveBuildPathMasterTimeline } from './buildPathTimeline'

const createBuildPathEvent = ({
  affectedOutputIds = [],
  buildResultState = { kind: 'pending' },
}: {
  affectedOutputIds?: string[]
  buildResultState?: BuildPathEvent['buildResultState']
} = {}): BuildPathEvent => ({
  buildPathEventId: 'build-path-event:1:projection-action',
  sourceProjectionId: 'projection-action',
  sourceKind: 'recorded',
  graphDocumentId: 'graph-document-1',
  commandFamily: 'Extrude',
  entryPoint: 'console-root',
  eventSequence: 1,
  affectedNodeIds: ['node-extrude'],
  affectedEdgeIds: ['edge-profile'],
  affectedOutputIds,
  mutationSummary: {
    createdNodeIds: ['node-extrude'],
    reusedNodeIds: [],
    updatedNodeIds: [],
    addedEdgeIds: ['edge-profile'],
    removedEdgeIds: [],
  },
  buildResultState,
  timelineRole: 'unclassified',
})

describe('buildPathActions', () => {
  it('keeps checkpoint candidates separate from restore-ready checkpoints', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        affectedOutputIds: ['output-solid'],
        buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
      }),
    ])
    const selectedStep = timeline.steps[0] ?? null

    const readiness = deriveBuildPathCheckpointReadiness({
      selectedStep,
    })

    expect(readiness).toMatchObject({
      status: 'missing-worker-checkpoint',
      isCheckpointCandidate: true,
      isRestoreReady: false,
      selectedTimelineStepId: selectedStep?.timelineStepId,
    })
    expect(readiness.missingRequirements).toContain(
      'Restore-ready worker checkpoint storage is not implemented.',
    )
  })

  it('keeps explicit actions disabled and detached from scrub movement', () => {
    const timeline = deriveBuildPathMasterTimeline([createBuildPathEvent()])

    const boundaryRead = deriveBuildPathActionBoundaryRead({
      selectedStep: timeline.steps[0] ?? null,
    })

    expect(boundaryRead.actions.map((action) => action.actionKind)).toEqual([
      'restore',
      'branch-from-here',
      'compare',
      'pin',
    ])
    expect(boundaryRead.actions.every((action) => action.status === 'planned-disabled')).toBe(true)
    expect(boundaryRead.actions.every((action) => action.boundary.requiresExplicitUserCommand)).toBe(
      true,
    )
    expect(boundaryRead.actions.every((action) => !action.boundary.isTriggeredByScrub)).toBe(true)
  })

  it('defines restore readiness without allowing restore execution', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        affectedOutputIds: ['output-solid'],
        buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
      }),
    ])
    const checkpointReadiness = deriveBuildPathCheckpointReadiness({
      selectedStep: timeline.steps[0] ?? null,
    })

    const restoreReadiness = deriveBuildPathRestoreReadiness(checkpointReadiness)
    const boundaryRead = deriveBuildPathActionBoundaryRead({
      selectedStep: timeline.steps[0] ?? null,
    })
    const restoreAction = boundaryRead.actions.find((action) => action.actionKind === 'restore')

    expect(restoreReadiness).toMatchObject({
      status: 'missing-restore-contract',
      canExecuteRestore: false,
      requiresExplicitUserCommand: true,
      requiresConfirmation: true,
      wouldCreateEditHistoryEntry: true,
      graphSnapshotRequirement: 'missing',
      workerCheckpointRequirement: 'missing',
      ownerPhase: 'Build-Path-7',
    })
    expect(restoreAction?.restoreReadiness).toEqual(restoreReadiness)
  })

  it('defines branch-from-here ownership without creating branch state', () => {
    const timeline = deriveBuildPathMasterTimeline([createBuildPathEvent()])
    const selectedStep = timeline.steps[0] ?? null

    const branchReadiness = deriveBuildPathBranchFromHereReadiness({
      selectedStep,
    })
    const boundaryRead = deriveBuildPathActionBoundaryRead({
      selectedStep,
    })
    const branchAction = boundaryRead.actions.find(
      (action) => action.actionKind === 'branch-from-here',
    )

    expect(branchReadiness).toMatchObject({
      status: 'missing-branch-contract',
      canCreateBranch: false,
      requiresExplicitUserCommand: true,
      requiresConfirmation: true,
      wouldCreateEditHistoryEntry: true,
      destinationKind: 'new-graph-document',
      graphOwnership: 'spaghetti-graph-document',
      storageRequirement: 'missing-branch-storage-policy',
      downstreamEventPolicy: 'fork-from-selected-step',
      ownerPhase: 'Build-Path-8',
    })
    expect(branchReadiness.branchNamePreview).toBe('Extrude branch #1')
    expect(branchAction?.branchFromHereReadiness).toEqual(branchReadiness)
  })

  it('defines compare read models without allowing compare execution', () => {
    const timeline = deriveBuildPathMasterTimeline([createBuildPathEvent()])
    const selectedStep = timeline.steps[0] ?? null

    const compareReadiness = deriveBuildPathCompareReadiness({ selectedStep })
    const boundaryRead = deriveBuildPathActionBoundaryRead({ selectedStep })
    const compareAction = boundaryRead.actions.find((action) => action.actionKind === 'compare')

    expect(compareReadiness).toMatchObject({
      status: 'missing-compare-target',
      canCompare: false,
      requiresExplicitUserCommand: true,
      compareSourceKind: 'selected-build-step',
      requiredTargetKind: 'second-build-step-or-pinned-checkpoint',
      supportedReadModels: ['visual', 'build-result', 'graph-read'],
      ownerPhase: 'Build-Path-9',
    })
    expect(compareAction?.compareReadiness).toEqual(compareReadiness)
    expect(compareAction?.boundary.isTriggeredByScrub).toBe(false)
  })

  it('separates visual pin persistence from worker checkpoint storage', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        affectedOutputIds: ['output-solid'],
        buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
      }),
    ])
    const checkpointReadiness = deriveBuildPathCheckpointReadiness({
      selectedStep: timeline.steps[0] ?? null,
    })

    const pinCheckpointReadiness =
      deriveBuildPathPinCheckpointReadiness(checkpointReadiness)
    const workerCheckpointReadiness = deriveBuildPathWorkerCheckpointReadiness()
    const boundaryRead = deriveBuildPathActionBoundaryRead({
      selectedStep: timeline.steps[0] ?? null,
    })
    const pinAction = boundaryRead.actions.find((action) => action.actionKind === 'pin')

    expect(pinCheckpointReadiness).toMatchObject({
      status: 'checkpoint-candidate',
      canPersistPin: false,
      canPersistCheckpoint: false,
      isCheckpointCandidate: true,
      pinTruthOwner: 'build-path-read-model',
      checkpointStorageRequirement: 'missing-worker-checkpoint-cache',
      ownerPhase: 'Build-Path-9',
    })
    expect(workerCheckpointReadiness).toMatchObject({
      status: 'missing-worker-cache-owner',
      canReplayCheckpoint: false,
      ownerRecommendation: 'worker-family-follow-up',
      requiredForActions: ['restore', 'compare', 'pin'],
      ownerPhase: 'Build-Path-9',
    })
    expect(workerCheckpointReadiness.missingRequirements).toContain(
      'Build Path must remain a reader/action surface until worker storage exists.',
    )
    expect(boundaryRead.workerCheckpointReadiness).toEqual(workerCheckpointReadiness)
    expect(pinAction?.pinCheckpointReadiness).toEqual(pinCheckpointReadiness)
  })
})
