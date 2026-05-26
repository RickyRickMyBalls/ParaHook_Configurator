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
import type { ExtrudeGraphCommandProfileSource } from '../console/graphCommandAuthoring'

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

export type RecordAcceptedExtrudeCommandForBuildPathRequest = {
  graphDocumentId: string
  commandSummary: GraphCommandCommitSummary
  profileSources: readonly ExtrudeGraphCommandProfileSource[]
  acceptedAt?: string
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

const uniqueInOrder = (values: readonly string[]): string[] => {
  const seen = new Set<string>()
  const result: string[] = []

  values.forEach((value) => {
    if (seen.has(value)) {
      return
    }
    seen.add(value)
    result.push(value)
  })

  return result
}

export const recordAcceptedExtrudeCommandForBuildPath = ({
  acceptedAt,
  commandSummary,
  graphDocumentId,
  profileSources,
}: RecordAcceptedExtrudeCommandForBuildPathRequest) => {
  if (!isCommittedGraphCommandSummary(commandSummary)) {
    return recordGraphCommandSummaryForBuildPath({
      acceptedAt,
      commandSummary,
      graphDocumentId,
    })
  }

  const sourceNodeIds = uniqueInOrder(profileSources.map((source) => source.nodeId))
  const targetNodeIds = uniqueInOrder([
    ...commandSummary.createdNodeIds,
    ...commandSummary.reusedNodeIds,
    ...commandSummary.updatedNodeIds,
  ])

  sourceNodeIds.forEach((sketchNodeId) => {
    recordSketchSourceForBuildPathIfMissing({
      acceptedAt,
      graphDocumentId,
      sketchNodeId,
    })
  })

  if (sourceNodeIds.length > 0 && targetNodeIds.length > 0) {
    recordGraphDependenciesForBuildPath({
      graphDocumentId,
      sourceNodeIds,
      targetNodeIds,
      edgeIds: commandSummary.addedEdgeIds,
    })
  }

  return recordGraphCommandSummaryForBuildPath({
    acceptedAt,
    commandSummary,
    graphDocumentId,
  })
}
