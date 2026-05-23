import type {
  BuildPathBranchEventClassification,
  BuildPathExplicitActionBoundary,
  BuildPathExplicitActionKind,
  BuildPathTimelineStep,
} from './buildPathTimeline'
import {
  BUILD_PATH_EXPLICIT_ACTION_BOUNDARIES,
  isBuildPathBuildEventTimelineStep,
} from './buildPathTimeline'

export type BuildPathCheckpointReadinessStatus =
  | 'no-selected-step'
  | 'read-only-candidate'
  | 'missing-worker-checkpoint'

export type BuildPathCheckpointReadiness = {
  status: BuildPathCheckpointReadinessStatus
  selectedTimelineStepId: string | null
  isCheckpointCandidate: boolean
  isRestoreReady: false
  missingRequirements: string[]
}

export type BuildPathRestoreReadiness = {
  status: 'not-selected' | 'not-a-checkpoint' | 'missing-restore-contract'
  selectedTimelineStepId: string | null
  canExecuteRestore: false
  requiresExplicitUserCommand: true
  requiresConfirmation: true
  wouldCreateEditHistoryEntry: true
  graphSnapshotRequirement: 'missing'
  workerCheckpointRequirement: 'missing'
  consequenceReadback: string
  ownerPhase: 'Build-Path-7'
}

export type BuildPathBranchFromHereReadiness = {
  status: 'not-selected' | 'missing-branch-contract'
  selectedTimelineStepId: string | null
  canCreateBranch: false
  requiresExplicitUserCommand: true
  requiresConfirmation: true
  wouldCreateEditHistoryEntry: true
  destinationKind: 'new-graph-document'
  branchNamePreview: string | null
  graphOwnership: 'spaghetti-graph-document'
  storageRequirement: 'missing-branch-storage-policy'
  downstreamEventPolicy: 'fork-from-selected-step'
  consequenceReadback: string
  ownerPhase: 'Build-Path-8'
}

export type BuildPathCompareReadiness = {
  status: 'not-selected' | 'missing-compare-target'
  selectedTimelineStepId: string | null
  canCompare: false
  requiresExplicitUserCommand: true
  compareSourceKind: 'none' | 'selected-build-step'
  requiredTargetKind: 'second-build-step-or-pinned-checkpoint'
  supportedReadModels: ('visual' | 'build-result' | 'graph-read')[]
  consequenceReadback: string
  ownerPhase: 'Build-Path-9'
}

export type BuildPathPinCheckpointReadiness = {
  status: 'not-selected' | 'missing-pin-persistence' | 'checkpoint-candidate'
  selectedTimelineStepId: string | null
  canPersistPin: false
  canPersistCheckpoint: false
  isCheckpointCandidate: boolean
  persistenceOwner: 'Build-Path-9'
  pinTruthOwner: 'build-path-read-model'
  checkpointStorageRequirement: 'missing-worker-checkpoint-cache'
  consequenceReadback: string
  ownerPhase: 'Build-Path-9'
}

export type BuildPathWorkerCheckpointReadiness = {
  status: 'missing-worker-cache-owner'
  canReplayCheckpoint: false
  ownerRecommendation: 'worker-family-follow-up'
  requiredForActions: BuildPathExplicitActionKind[]
  missingRequirements: string[]
  ownerPhase: 'Build-Path-9'
}

export type BuildPathActionAvailability = {
  actionKind: BuildPathExplicitActionKind
  label: string
  status: 'planned-disabled'
  reason: string
  boundary: BuildPathExplicitActionBoundary
  restoreReadiness?: BuildPathRestoreReadiness
  branchFromHereReadiness?: BuildPathBranchFromHereReadiness
  compareReadiness?: BuildPathCompareReadiness
  pinCheckpointReadiness?: BuildPathPinCheckpointReadiness
}

export type BuildPathActionBoundaryRead = {
  checkpointReadiness: BuildPathCheckpointReadiness
  workerCheckpointReadiness: BuildPathWorkerCheckpointReadiness
  actions: BuildPathActionAvailability[]
}

const actionLabelByKind: Record<BuildPathExplicitActionKind, string> = {
  restore: 'Restore',
  'branch-from-here': 'Branch',
  compare: 'Compare',
  pin: 'Pin',
}

const actionOwnerByKind: Record<BuildPathExplicitActionKind, string> = {
  restore: 'Build-Path-7',
  'branch-from-here': 'Build-Path-8',
  compare: 'Build-Path-9',
  pin: 'Build-Path-9',
}

export const deriveBuildPathCheckpointReadiness = ({
  classification,
  selectedStep,
}: {
  classification?: BuildPathBranchEventClassification | null
  selectedStep: BuildPathTimelineStep | null
}): BuildPathCheckpointReadiness => {
  if (selectedStep === null) {
    return {
      status: 'no-selected-step',
      selectedTimelineStepId: null,
      isCheckpointCandidate: false,
      isRestoreReady: false,
      missingRequirements: ['Select a Build Path step before action readiness can be read.'],
    }
  }

  const isCheckpointCandidate =
    isBuildPathBuildEventTimelineStep(selectedStep) &&
    (
      classification?.isCheckpointCandidate === true ||
      selectedStep.event.affectedOutputIds.length > 0 ||
      selectedStep.event.buildResultState.kind === 'linked'
    )

  return {
    status: isCheckpointCandidate ? 'missing-worker-checkpoint' : 'read-only-candidate',
    selectedTimelineStepId: selectedStep.timelineStepId,
    isCheckpointCandidate,
    isRestoreReady: false,
    missingRequirements: isCheckpointCandidate
      ? [
          'Restore-ready worker checkpoint storage is not implemented.',
          'Authored graph restore semantics are not approved.',
        ]
      : ['This step is readable but is not a restore-ready checkpoint.'],
  }
}

export const deriveBuildPathRestoreReadiness = (
  checkpointReadiness: BuildPathCheckpointReadiness,
): BuildPathRestoreReadiness => {
  if (checkpointReadiness.selectedTimelineStepId === null) {
    return {
      status: 'not-selected',
      selectedTimelineStepId: null,
      canExecuteRestore: false,
      requiresExplicitUserCommand: true,
      requiresConfirmation: true,
      wouldCreateEditHistoryEntry: true,
      graphSnapshotRequirement: 'missing',
      workerCheckpointRequirement: 'missing',
      consequenceReadback: 'Select a Build Path step before Restore can be evaluated.',
      ownerPhase: 'Build-Path-7',
    }
  }

  if (!checkpointReadiness.isCheckpointCandidate) {
    return {
      status: 'not-a-checkpoint',
      selectedTimelineStepId: checkpointReadiness.selectedTimelineStepId,
      canExecuteRestore: false,
      requiresExplicitUserCommand: true,
      requiresConfirmation: true,
      wouldCreateEditHistoryEntry: true,
      graphSnapshotRequirement: 'missing',
      workerCheckpointRequirement: 'missing',
      consequenceReadback: 'This build step is readable, but it is not a restore-ready checkpoint.',
      ownerPhase: 'Build-Path-7',
    }
  }

  return {
    status: 'missing-restore-contract',
    selectedTimelineStepId: checkpointReadiness.selectedTimelineStepId,
    canExecuteRestore: false,
    requiresExplicitUserCommand: true,
    requiresConfirmation: true,
    wouldCreateEditHistoryEntry: true,
    graphSnapshotRequirement: 'missing',
    workerCheckpointRequirement: 'missing',
    consequenceReadback:
      'Restore needs authored graph snapshot semantics and worker checkpoint data before it can mutate graph truth.',
    ownerPhase: 'Build-Path-7',
  }
}

const createBranchNamePreview = (selectedStep: BuildPathTimelineStep): string =>
  `${selectedStep.display.label} branch #${selectedStep.orderIndex + 1}`

export const deriveBuildPathBranchFromHereReadiness = ({
  selectedStep,
}: {
  selectedStep: BuildPathTimelineStep | null
}): BuildPathBranchFromHereReadiness => {
  if (selectedStep === null) {
    return {
      status: 'not-selected',
      selectedTimelineStepId: null,
      canCreateBranch: false,
      requiresExplicitUserCommand: true,
      requiresConfirmation: true,
      wouldCreateEditHistoryEntry: true,
      destinationKind: 'new-graph-document',
      branchNamePreview: null,
      graphOwnership: 'spaghetti-graph-document',
      storageRequirement: 'missing-branch-storage-policy',
      downstreamEventPolicy: 'fork-from-selected-step',
      consequenceReadback: 'Select a Build Path step before Branch can be evaluated.',
      ownerPhase: 'Build-Path-8',
    }
  }

  return {
    status: 'missing-branch-contract',
    selectedTimelineStepId: selectedStep.timelineStepId,
    canCreateBranch: false,
    requiresExplicitUserCommand: true,
    requiresConfirmation: true,
    wouldCreateEditHistoryEntry: true,
    destinationKind: 'new-graph-document',
    branchNamePreview: createBranchNamePreview(selectedStep),
    graphOwnership: 'spaghetti-graph-document',
    storageRequirement: 'missing-branch-storage-policy',
    downstreamEventPolicy: 'fork-from-selected-step',
    consequenceReadback:
      'Branch From Here needs graph/document storage ownership and naming policy before it can create authored graph state.',
    ownerPhase: 'Build-Path-8',
  }
}

export const deriveBuildPathCompareReadiness = ({
  selectedStep,
}: {
  selectedStep: BuildPathTimelineStep | null
}): BuildPathCompareReadiness => {
  if (selectedStep === null) {
    return {
      status: 'not-selected',
      selectedTimelineStepId: null,
      canCompare: false,
      requiresExplicitUserCommand: true,
      compareSourceKind: 'none',
      requiredTargetKind: 'second-build-step-or-pinned-checkpoint',
      supportedReadModels: ['visual', 'build-result', 'graph-read'],
      consequenceReadback: 'Select a Build Path step before Compare can be evaluated.',
      ownerPhase: 'Build-Path-9',
    }
  }

  return {
    status: 'missing-compare-target',
    selectedTimelineStepId: selectedStep.timelineStepId,
    canCompare: false,
    requiresExplicitUserCommand: true,
    compareSourceKind: 'selected-build-step',
    requiredTargetKind: 'second-build-step-or-pinned-checkpoint',
    supportedReadModels: ['visual', 'build-result', 'graph-read'],
    consequenceReadback:
      'Compare needs an explicit second build step or pinned checkpoint target before it can run.',
    ownerPhase: 'Build-Path-9',
  }
}

export const deriveBuildPathPinCheckpointReadiness = (
  checkpointReadiness: BuildPathCheckpointReadiness,
): BuildPathPinCheckpointReadiness => {
  if (checkpointReadiness.selectedTimelineStepId === null) {
    return {
      status: 'not-selected',
      selectedTimelineStepId: null,
      canPersistPin: false,
      canPersistCheckpoint: false,
      isCheckpointCandidate: false,
      persistenceOwner: 'Build-Path-9',
      pinTruthOwner: 'build-path-read-model',
      checkpointStorageRequirement: 'missing-worker-checkpoint-cache',
      consequenceReadback: 'Select a Build Path step before Pin can be evaluated.',
      ownerPhase: 'Build-Path-9',
    }
  }

  if (checkpointReadiness.isCheckpointCandidate) {
    return {
      status: 'checkpoint-candidate',
      selectedTimelineStepId: checkpointReadiness.selectedTimelineStepId,
      canPersistPin: false,
      canPersistCheckpoint: false,
      isCheckpointCandidate: true,
      persistenceOwner: 'Build-Path-9',
      pinTruthOwner: 'build-path-read-model',
      checkpointStorageRequirement: 'missing-worker-checkpoint-cache',
      consequenceReadback:
        'This step can be read as a checkpoint candidate, but persistent pins and worker checkpoint storage are not implemented.',
      ownerPhase: 'Build-Path-9',
    }
  }

  return {
    status: 'missing-pin-persistence',
    selectedTimelineStepId: checkpointReadiness.selectedTimelineStepId,
    canPersistPin: false,
    canPersistCheckpoint: false,
    isCheckpointCandidate: false,
    persistenceOwner: 'Build-Path-9',
    pinTruthOwner: 'build-path-read-model',
    checkpointStorageRequirement: 'missing-worker-checkpoint-cache',
    consequenceReadback:
      'Pin needs accepted persistence ownership before it can store Build Path read state.',
    ownerPhase: 'Build-Path-9',
  }
}

export const deriveBuildPathWorkerCheckpointReadiness =
  (): BuildPathWorkerCheckpointReadiness => ({
    status: 'missing-worker-cache-owner',
    canReplayCheckpoint: false,
    ownerRecommendation: 'worker-family-follow-up',
    requiredForActions: ['restore', 'compare', 'pin'],
    missingRequirements: [
      'Worker checkpoint cache owner is not implemented.',
      'Checkpoint replay contract is not approved.',
      'Build Path must remain a reader/action surface until worker storage exists.',
    ],
    ownerPhase: 'Build-Path-9',
  })

export const deriveBuildPathActionBoundaryRead = ({
  classification,
  selectedStep,
}: {
  classification?: BuildPathBranchEventClassification | null
  selectedStep: BuildPathTimelineStep | null
}): BuildPathActionBoundaryRead => {
  const checkpointReadiness = deriveBuildPathCheckpointReadiness({
    classification,
    selectedStep,
  })
  const restoreReadiness = deriveBuildPathRestoreReadiness(checkpointReadiness)
  const branchFromHereReadiness = deriveBuildPathBranchFromHereReadiness({
    selectedStep,
  })
  const compareReadiness = deriveBuildPathCompareReadiness({
    selectedStep,
  })
  const pinCheckpointReadiness = deriveBuildPathPinCheckpointReadiness(checkpointReadiness)
  const workerCheckpointReadiness = deriveBuildPathWorkerCheckpointReadiness()

  return {
    checkpointReadiness,
    workerCheckpointReadiness,
    actions: Object.values(BUILD_PATH_EXPLICIT_ACTION_BOUNDARIES).map((boundary) => ({
      actionKind: boundary.actionKind,
      label: actionLabelByKind[boundary.actionKind],
      status: 'planned-disabled',
      reason:
        boundary.actionKind === 'restore'
          ? restoreReadiness.consequenceReadback
          : boundary.actionKind === 'branch-from-here'
            ? branchFromHereReadiness.consequenceReadback
            : boundary.actionKind === 'compare'
              ? compareReadiness.consequenceReadback
              : boundary.actionKind === 'pin'
                ? pinCheckpointReadiness.consequenceReadback
          : `${actionOwnerByKind[boundary.actionKind]} owns this explicit command.`,
      boundary,
      ...(boundary.actionKind === 'restore' ? { restoreReadiness } : {}),
      ...(boundary.actionKind === 'branch-from-here' ? { branchFromHereReadiness } : {}),
      ...(boundary.actionKind === 'compare' ? { compareReadiness } : {}),
      ...(boundary.actionKind === 'pin' ? { pinCheckpointReadiness } : {}),
    })),
  }
}
