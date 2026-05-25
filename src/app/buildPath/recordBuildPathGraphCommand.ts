import {
  commitReadyGraphCommandPlan,
  createReadyGraphCommandCommitPlan,
  isCommittedGraphCommandSummary,
  type GraphCommandCommitSummary,
} from '../console/commandCommitContract'
import type { BuildPathProjectionBuildResultState } from '../console/buildPathProjection'
import { useBuildPathRuntimeStore } from './useBuildPathRuntimeStore'
import type { BuildPathGraphDependency } from './buildPathTimeline'
import type { PortKind } from '../spaghetti/schema/spaghettiTypes'

export type RecordGraphCommandSummaryForBuildPathRequest = {
  graphDocumentId: string
  commandSummary: GraphCommandCommitSummary
  outputIds?: readonly string[]
  buildResultState?: BuildPathProjectionBuildResultState
  acceptedAt?: string
}

export type RecordSketchSourceForBuildPathRequest = {
  graphDocumentId: string
  sketchNodeId: string
  acceptedAt?: string
}

export type RecordGraphDependenciesForBuildPathRequest = {
  graphDocumentId: string
  sourceNodeIds: readonly string[]
  targetNodeIds: readonly string[]
  edgeIds?: readonly string[]
  sourcePortIds?: readonly string[]
  targetPortIds?: readonly string[]
  connectorKinds?: readonly PortKind[]
}

const createLiveBuildPathProjectionId = ({
  commandSummary,
  eventCount,
  graphDocumentId,
}: {
  commandSummary: GraphCommandCommitSummary
  eventCount: number
  graphDocumentId: string
}): string =>
  [
    'build-path-live',
    graphDocumentId,
    commandSummary.commandFamily.toLowerCase(),
    (eventCount + 1).toString(),
  ].join(':')

export const recordGraphCommandSummaryForBuildPath = ({
  acceptedAt,
  buildResultState,
  commandSummary,
  graphDocumentId,
  outputIds,
}: RecordGraphCommandSummaryForBuildPathRequest) => {
  const store = useBuildPathRuntimeStore.getState()

  if (!isCommittedGraphCommandSummary(commandSummary)) {
    return store.intakeGraphCommandCommit({
      acceptedAt,
      buildResultState,
      commandSummary,
      graphDocumentId,
      outputIds,
    })
  }

  return store.intakeGraphCommandCommit({
    acceptedAt,
    buildResultState,
    commandSummary,
    graphDocumentId,
    outputIds,
    projectionId: createLiveBuildPathProjectionId({
      commandSummary,
      eventCount: store.readEvents().length,
      graphDocumentId,
    }),
  })
}

export const recordSketchSourceForBuildPathIfMissing = ({
  acceptedAt,
  graphDocumentId,
  sketchNodeId,
}: RecordSketchSourceForBuildPathRequest) => {
  const store = useBuildPathRuntimeStore.getState()
  const hasSketchSource = store.readEvents().some(
    (event) =>
      event.commandFamily === 'Sketch' &&
      event.graphDocumentId === graphDocumentId &&
      event.affectedNodeIds.includes(sketchNodeId),
  )

  if (hasSketchSource) {
    return null
  }

  const commandSummary = commitReadyGraphCommandPlan(
    createReadyGraphCommandCommitPlan({
      commandFamily: 'Sketch',
      entryPoint: 'console-root',
      intendedMutations: ['reuse-node'],
    }),
    {
      reusedNodeIds: [sketchNodeId],
    },
  )

  return recordGraphCommandSummaryForBuildPath({
    acceptedAt,
    commandSummary,
    graphDocumentId,
  })
}

export const recordGraphDependenciesForBuildPath = ({
  connectorKinds = [],
  edgeIds = [],
  graphDocumentId,
  sourcePortIds = [],
  sourceNodeIds,
  targetPortIds = [],
  targetNodeIds,
}: RecordGraphDependenciesForBuildPathRequest): BuildPathGraphDependency[] => {
  const dependencies = sourceNodeIds.flatMap((sourceNodeId, sourceIndex) =>
    targetNodeIds.map((targetNodeId, targetIndex): BuildPathGraphDependency => {
      const fromPortId = sourcePortIds[sourceIndex]
      const toPortId = targetPortIds[targetIndex]
      const connectorKind = connectorKinds[targetIndex] ?? connectorKinds[sourceIndex]

      return {
        edgeId:
          edgeIds[targetIndex] ??
          edgeIds[sourceIndex] ??
          [
            'build-path-dependency',
            graphDocumentId,
            sourceNodeId,
            targetNodeId,
          ].join(':'),
        fromNodeId: sourceNodeId,
        toNodeId: targetNodeId,
        ...(fromPortId === undefined ? {} : { fromPortId }),
        ...(toPortId === undefined ? {} : { toPortId }),
        ...(connectorKind === undefined ? {} : { connectorKind }),
        graphDocumentId,
        sourceKind: 'recorded',
      }
    }),
  )

  useBuildPathRuntimeStore.getState().addGraphDependencies(dependencies)

  return dependencies
}
