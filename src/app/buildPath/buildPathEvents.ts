import type {
  BuildPathCommandProjection,
  BuildPathGraphMutationSummary,
  BuildPathProjectionBuildResultState,
} from '../console/buildPathProjection'
import type { GraphCommandEntryPoint, GraphCommandFamily } from '../console/commandCommitContract'

export type BuildPathTimelineRole =
  | 'unclassified'
  | 'linear'
  | 'branch-local'
  | 'merge'
  | 'checkpoint-candidate'

export type BuildPathEventSourceKind = 'recorded' | 'reconstructed'

export type BuildPathEvent = {
  buildPathEventId: string
  sourceProjectionId: string
  sourceKind: BuildPathEventSourceKind
  graphDocumentId: string
  commandFamily: GraphCommandFamily
  entryPoint: GraphCommandEntryPoint
  eventSequence: number
  affectedNodeIds: string[]
  affectedEdgeIds: string[]
  affectedOutputIds: string[]
  mutationSummary: BuildPathGraphMutationSummary
  buildResultState: BuildPathProjectionBuildResultState
  acceptedAt?: string
  timelineRole: BuildPathTimelineRole
}

export type CreateBuildPathEventFromCommandProjectionRequest = {
  projection: BuildPathCommandProjection
  eventSequence: number
  acceptedAt?: string
}

const createBuildPathEventId = ({
  eventSequence,
  projectionId,
}: {
  eventSequence: number
  projectionId: string
}): string => ['build-path-event', eventSequence.toString(), projectionId].join(':')

export const createBuildPathEventFromCommandProjection = ({
  acceptedAt,
  eventSequence,
  projection,
}: CreateBuildPathEventFromCommandProjectionRequest): BuildPathEvent => ({
  buildPathEventId: createBuildPathEventId({
    eventSequence,
    projectionId: projection.projectionId,
  }),
  sourceProjectionId: projection.projectionId,
  sourceKind: 'recorded',
  graphDocumentId: projection.graphDocumentId,
  commandFamily: projection.commandFamily,
  entryPoint: projection.entryPoint,
  eventSequence,
  affectedNodeIds: [...projection.affectedGraphIds.nodeIds],
  affectedEdgeIds: [...projection.affectedGraphIds.edgeIds],
  affectedOutputIds: [...projection.affectedGraphIds.outputIds],
  mutationSummary: {
    createdNodeIds: [...projection.graphMutationSummary.createdNodeIds],
    reusedNodeIds: [...projection.graphMutationSummary.reusedNodeIds],
    updatedNodeIds: [...projection.graphMutationSummary.updatedNodeIds],
    addedEdgeIds: [...projection.graphMutationSummary.addedEdgeIds],
    removedEdgeIds: [...projection.graphMutationSummary.removedEdgeIds],
  },
  buildResultState: projection.buildResultState,
  ...(acceptedAt === undefined ? {} : { acceptedAt }),
  timelineRole: 'unclassified',
})
