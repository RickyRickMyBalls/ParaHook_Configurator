import {
  isCommittedGraphCommandSummary,
  type GraphCommandCommitSummary,
  type GraphCommandEntryPoint,
  type GraphCommandFamily,
} from './commandCommitContract'

export type BuildPathProjectionBuildResultState =
  | { kind: 'pending' }
  | { kind: 'linked'; buildResultId: string }
  | { kind: 'unavailable'; reason: string }

export type BuildPathGraphMutationSummary = {
  createdNodeIds: string[]
  reusedNodeIds: string[]
  updatedNodeIds: string[]
  addedEdgeIds: string[]
  removedEdgeIds: string[]
}

export type BuildPathAffectedGraphIds = {
  graphDocumentId: string
  nodeIds: string[]
  edgeIds: string[]
  outputIds: string[]
}

export type BuildPathCommandProjection = {
  projectionId: string
  graphDocumentId: string
  commandFamily: GraphCommandFamily
  entryPoint: GraphCommandEntryPoint
  rowLabel: string
  graphMutationSummary: BuildPathGraphMutationSummary
  affectedGraphIds: BuildPathAffectedGraphIds
  buildResultState: BuildPathProjectionBuildResultState
}

export type ProjectGraphCommandCommitForBuildPathRequest = {
  graphDocumentId: string
  commandSummary: GraphCommandCommitSummary
  projectionId?: string
  outputIds?: readonly string[]
  buildResultState?: BuildPathProjectionBuildResultState
}

const createDefaultProjectionId = ({
  commandFamily,
  graphDocumentId,
  mutationSummary,
}: {
  commandFamily: GraphCommandFamily
  graphDocumentId: string
  mutationSummary: BuildPathGraphMutationSummary
}): string => {
  const touchedNodeIds = [
    ...mutationSummary.createdNodeIds,
    ...mutationSummary.reusedNodeIds,
    ...mutationSummary.updatedNodeIds,
  ].join(',')
  const touchedEdgeIds = [
    ...mutationSummary.addedEdgeIds,
    ...mutationSummary.removedEdgeIds,
  ].join(',')

  return [
    'build-path',
    graphDocumentId,
    commandFamily.toLowerCase(),
    touchedNodeIds || 'no-nodes',
    touchedEdgeIds || 'no-edges',
  ].join(':')
}

const uniqueInOrder = (values: readonly string[]): string[] => {
  const seen = new Set<string>()
  const uniqueValues: string[] = []

  values.forEach((value) => {
    if (!seen.has(value)) {
      seen.add(value)
      uniqueValues.push(value)
    }
  })

  return uniqueValues
}

const buildRowLabel = (
  commandFamily: GraphCommandFamily,
  mutationSummary: BuildPathGraphMutationSummary,
): string => {
  const nodeCount =
    mutationSummary.createdNodeIds.length +
    mutationSummary.reusedNodeIds.length +
    mutationSummary.updatedNodeIds.length
  const edgeCount =
    mutationSummary.addedEdgeIds.length + mutationSummary.removedEdgeIds.length

  if (nodeCount === 0 && edgeCount === 0) {
    return commandFamily
  }

  const fragments: string[] = []
  if (nodeCount > 0) {
    fragments.push(`${nodeCount} node${nodeCount === 1 ? '' : 's'}`)
  }
  if (edgeCount > 0) {
    fragments.push(`${edgeCount} wire${edgeCount === 1 ? '' : 's'}`)
  }

  return `${commandFamily} (${fragments.join(', ')})`
}

export const projectGraphCommandCommitForBuildPath = ({
  buildResultState = { kind: 'pending' },
  commandSummary,
  graphDocumentId,
  outputIds = [],
  projectionId,
}: ProjectGraphCommandCommitForBuildPathRequest): BuildPathCommandProjection | null => {
  if (!isCommittedGraphCommandSummary(commandSummary)) {
    return null
  }

  const graphMutationSummary: BuildPathGraphMutationSummary = {
    createdNodeIds: [...commandSummary.createdNodeIds],
    reusedNodeIds: [...commandSummary.reusedNodeIds],
    updatedNodeIds: [...commandSummary.updatedNodeIds],
    addedEdgeIds: [...commandSummary.addedEdgeIds],
    removedEdgeIds: [...commandSummary.removedEdgeIds],
  }
  const nodeIds = uniqueInOrder([
    ...graphMutationSummary.createdNodeIds,
    ...graphMutationSummary.reusedNodeIds,
    ...graphMutationSummary.updatedNodeIds,
  ])
  const edgeIds = uniqueInOrder([
    ...graphMutationSummary.addedEdgeIds,
    ...graphMutationSummary.removedEdgeIds,
  ])

  return {
    projectionId:
      projectionId ??
      createDefaultProjectionId({
        commandFamily: commandSummary.commandFamily,
        graphDocumentId,
        mutationSummary: graphMutationSummary,
      }),
    graphDocumentId,
    commandFamily: commandSummary.commandFamily,
    entryPoint: commandSummary.entryPoint,
    rowLabel: buildRowLabel(commandSummary.commandFamily, graphMutationSummary),
    graphMutationSummary,
    affectedGraphIds: {
      graphDocumentId,
      nodeIds,
      edgeIds,
      outputIds: uniqueInOrder(outputIds),
    },
    buildResultState,
  }
}
