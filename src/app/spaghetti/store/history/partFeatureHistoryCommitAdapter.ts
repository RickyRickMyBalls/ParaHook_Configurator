import type {
  EditHistoryOwner,
  EditHistorySourceMetadata,
} from '../../../store/editHistoryStore'
import type { FeatureStack } from '../../features/featureTypes'
import type { SpaghettiGraph } from '../../schema/spaghettiTypes'

export type CommitPartFeatureParameterHistoryOptions = {
  nodeId: string
  featureId: string
  beforeGraph: SpaghettiGraph
  afterGraph?: SpaghettiGraph
  targetId?: string
  targetLabel?: string
}

export type CommitPartSketchFeatureHistoryOptions = {
  nodeId: string
  featureId: string
  beforeGraph: SpaghettiGraph
  afterGraph?: SpaghettiGraph
  label?: string
  targetId?: string
  targetLabel?: string
}

type CommitPartSketchFeatureStackHistoryOptions = {
  nodeId: string
  featureId: string
  label: string
  targetId?: string
  targetLabel?: string
  buildFeatureStack: (stack: FeatureStack) => FeatureStack
}

type ReadPartNodeFeatureStack = (
  graph: SpaghettiGraph,
  nodeId: string,
) => FeatureStack | null

type RestorePartNodeFeatureStackSnapshot = (
  graphDocumentId: string,
  nodeId: string,
  stack: FeatureStack,
) => void

type PartFeatureHistoryCommitAdapterDependencies = {
  getActiveGraphDocumentId: () => string
  getCurrentGraph: () => SpaghettiGraph
  normalizeGraphForStoreCommit: (graph: SpaghettiGraph) => SpaghettiGraph
  cloneFeatureStack: (stack: FeatureStack) => FeatureStack
  areFeatureStacksEqual: (left: FeatureStack, right: FeatureStack) => boolean
  readPartNodeFeatureStack: ReadPartNodeFeatureStack
  recomputePartFeatureStack: (stack: FeatureStack) => FeatureStack
  replacePartNodeFeatureStack: (
    graph: SpaghettiGraph,
    nodeId: string,
    stack: FeatureStack,
  ) => SpaghettiGraph
  areNormalizedGraphsEqual: (
    left: SpaghettiGraph,
    right: SpaghettiGraph,
  ) => boolean
  applyGraphHistorySnapshotToActiveDocument: (nextGraph: SpaghettiGraph) => void
  nextGraphStructureHistoryEntryId: (graphDocumentId: string) => string
  graphSketchFeatureHistorySource: EditHistorySourceMetadata
  graphFeatureParameterHistorySource: EditHistorySourceMetadata
  commitEditHistoryEntry: EditHistoryOwner['commitEntry']
  restorePartNodeFeatureStackSnapshot: RestorePartNodeFeatureStackSnapshot
}

const findHistoryFeature = (
  stack: FeatureStack,
  featureId: string,
): FeatureStack[number] | undefined =>
  stack.find((feature) => feature.featureId === featureId)

const isHistorySupportedFeatureParameterTarget = (
  feature: FeatureStack[number],
): boolean => feature.type === 'closeProfile' || feature.type === 'extrude'

export const createPartFeatureHistoryCommitAdapter = (
  dependencies: PartFeatureHistoryCommitAdapterDependencies,
) => ({
  commitPartSketchFeatureStackHistoryCommand: (
    options: CommitPartSketchFeatureStackHistoryOptions,
  ): boolean => {
    const graphDocumentId = dependencies.getActiveGraphDocumentId()
    const beforeGraph = dependencies.normalizeGraphForStoreCommit(dependencies.getCurrentGraph())
    const beforeStack = dependencies.readPartNodeFeatureStack(beforeGraph, options.nodeId)
    if (beforeStack === null) {
      return false
    }

    const beforeFeature = findHistoryFeature(beforeStack, options.featureId)
    if (beforeFeature === undefined || beforeFeature.type !== 'sketch') {
      return false
    }

    const afterStack = dependencies.recomputePartFeatureStack(
      dependencies.cloneFeatureStack(options.buildFeatureStack(beforeStack)),
    )
    const afterFeature = findHistoryFeature(afterStack, options.featureId)
    if (afterFeature === undefined || afterFeature.type !== 'sketch') {
      return false
    }
    if (dependencies.areFeatureStacksEqual(beforeStack, afterStack)) {
      return false
    }

    const afterGraph = dependencies.replacePartNodeFeatureStack(
      beforeGraph,
      options.nodeId,
      afterStack,
    )
    if (dependencies.areNormalizedGraphsEqual(beforeGraph, afterGraph)) {
      return false
    }

    dependencies.applyGraphHistorySnapshotToActiveDocument(afterGraph)

    return dependencies.commitEditHistoryEntry({
      entryId: dependencies.nextGraphStructureHistoryEntryId(graphDocumentId),
      label: options.label,
      source: dependencies.graphSketchFeatureHistorySource,
      targetId: options.targetId ?? `${options.nodeId}:${options.featureId}`,
      targetLabel: options.targetLabel ?? options.featureId,
      undo: () =>
        dependencies.restorePartNodeFeatureStackSnapshot(
          graphDocumentId,
          options.nodeId,
          beforeStack,
        ),
      redo: () =>
        dependencies.restorePartNodeFeatureStackSnapshot(
          graphDocumentId,
          options.nodeId,
          afterStack,
        ),
    })
  },

  commitPartSketchFeatureHistoryCommand: (
    options: CommitPartSketchFeatureHistoryOptions,
  ): boolean => {
    const graphDocumentId = dependencies.getActiveGraphDocumentId()
    const beforeGraph = dependencies.normalizeGraphForStoreCommit(options.beforeGraph)
    const afterGraph = dependencies.normalizeGraphForStoreCommit(
      options.afterGraph ?? dependencies.getCurrentGraph(),
    )
    const beforeStack = dependencies.readPartNodeFeatureStack(beforeGraph, options.nodeId)
    const afterStack = dependencies.readPartNodeFeatureStack(afterGraph, options.nodeId)
    if (beforeStack === null || afterStack === null) {
      return false
    }

    const beforeFeature = findHistoryFeature(beforeStack, options.featureId)
    const afterFeature = findHistoryFeature(afterStack, options.featureId)
    if (
      beforeFeature === undefined ||
      afterFeature === undefined ||
      beforeFeature.type !== 'sketch' ||
      afterFeature.type !== 'sketch'
    ) {
      return false
    }
    if (dependencies.areFeatureStacksEqual(beforeStack, afterStack)) {
      return false
    }

    return dependencies.commitEditHistoryEntry({
      entryId: dependencies.nextGraphStructureHistoryEntryId(graphDocumentId),
      label: options.label ?? 'Change sketch component',
      source: dependencies.graphSketchFeatureHistorySource,
      targetId: options.targetId ?? `${options.nodeId}:${options.featureId}`,
      targetLabel: options.targetLabel ?? options.featureId,
      undo: () =>
        dependencies.restorePartNodeFeatureStackSnapshot(
          graphDocumentId,
          options.nodeId,
          beforeStack,
        ),
      redo: () =>
        dependencies.restorePartNodeFeatureStackSnapshot(
          graphDocumentId,
          options.nodeId,
          afterStack,
        ),
    })
  },

  commitPartFeatureParameterHistoryCommand: (
    options: CommitPartFeatureParameterHistoryOptions,
  ): boolean => {
    const graphDocumentId = dependencies.getActiveGraphDocumentId()
    const beforeGraph = dependencies.normalizeGraphForStoreCommit(options.beforeGraph)
    const afterGraph = dependencies.normalizeGraphForStoreCommit(
      options.afterGraph ?? dependencies.getCurrentGraph(),
    )
    const beforeStack = dependencies.readPartNodeFeatureStack(beforeGraph, options.nodeId)
    const afterStack = dependencies.readPartNodeFeatureStack(afterGraph, options.nodeId)
    if (beforeStack === null || afterStack === null) {
      return false
    }

    const beforeFeature = findHistoryFeature(beforeStack, options.featureId)
    const afterFeature = findHistoryFeature(afterStack, options.featureId)
    if (
      beforeFeature === undefined ||
      afterFeature === undefined ||
      beforeFeature.type !== afterFeature.type ||
      !isHistorySupportedFeatureParameterTarget(beforeFeature) ||
      !isHistorySupportedFeatureParameterTarget(afterFeature)
    ) {
      return false
    }

    if (dependencies.areFeatureStacksEqual(beforeStack, afterStack)) {
      return false
    }

    return dependencies.commitEditHistoryEntry({
      entryId: dependencies.nextGraphStructureHistoryEntryId(graphDocumentId),
      label: 'Change feature parameter',
      source: dependencies.graphFeatureParameterHistorySource,
      targetId: options.targetId ?? `${options.nodeId}:${options.featureId}`,
      targetLabel: options.targetLabel ?? options.featureId,
      undo: () =>
        dependencies.restorePartNodeFeatureStackSnapshot(
          graphDocumentId,
          options.nodeId,
          beforeStack,
        ),
      redo: () =>
        dependencies.restorePartNodeFeatureStackSnapshot(
          graphDocumentId,
          options.nodeId,
          afterStack,
        ),
    })
  },
})
