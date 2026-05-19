export const viewportCommandLifecycleStates = [
  'idle',
  'previewing',
  'readyToCommit',
  'committed',
  'cancelled',
] as const

export type ViewportCommandLifecycleState = (typeof viewportCommandLifecycleStates)[number]

export type GraphCommandFamily = 'Sketch' | 'Extrude'

export type GraphCommandEntryPoint =
  | 'console-root'
  | 'viewport-shortcut'
  | 'viewport-toolbar'
  | 'feature-assist'

export type GraphCommandMutationKind =
  | 'create-node'
  | 'reuse-node'
  | 'update-params'
  | 'add-wire'
  | 'remove-wire'

export type ReadyGraphCommandCommitPlan = {
  commandFamily: GraphCommandFamily
  entryPoint: GraphCommandEntryPoint
  lifecycleState: 'readyToCommit'
  intendedMutations: GraphCommandMutationKind[]
}

export type CommittedGraphCommandSummary = {
  commandFamily: GraphCommandFamily
  entryPoint: GraphCommandEntryPoint
  lifecycleState: 'committed'
  createdNodeIds: string[]
  reusedNodeIds: string[]
  updatedNodeIds: string[]
  addedEdgeIds: string[]
  removedEdgeIds: string[]
}

export type CancelledGraphCommandSummary = {
  commandFamily: GraphCommandFamily
  entryPoint: GraphCommandEntryPoint
  lifecycleState: 'cancelled'
  reason: string
}

export type GraphCommandCommitSummary =
  | CommittedGraphCommandSummary
  | CancelledGraphCommandSummary

export const canCommandLifecycleMutateGraph = (
  lifecycleState: ViewportCommandLifecycleState,
): boolean => lifecycleState === 'readyToCommit'

export const isCommittedGraphCommandSummary = (
  summary: GraphCommandCommitSummary,
): summary is CommittedGraphCommandSummary => summary.lifecycleState === 'committed'

export const createReadyGraphCommandCommitPlan = ({
  commandFamily,
  entryPoint,
  intendedMutations,
}: {
  commandFamily: GraphCommandFamily
  entryPoint: GraphCommandEntryPoint
  intendedMutations: GraphCommandMutationKind[]
}): ReadyGraphCommandCommitPlan => ({
  commandFamily,
  entryPoint,
  lifecycleState: 'readyToCommit',
  intendedMutations: [...intendedMutations],
})

export const commitReadyGraphCommandPlan = (
  plan: ReadyGraphCommandCommitPlan,
  result: {
    createdNodeIds?: string[]
    reusedNodeIds?: string[]
    updatedNodeIds?: string[]
    addedEdgeIds?: string[]
    removedEdgeIds?: string[]
  },
): CommittedGraphCommandSummary => ({
  commandFamily: plan.commandFamily,
  entryPoint: plan.entryPoint,
  lifecycleState: 'committed',
  createdNodeIds: [...(result.createdNodeIds ?? [])],
  reusedNodeIds: [...(result.reusedNodeIds ?? [])],
  updatedNodeIds: [...(result.updatedNodeIds ?? [])],
  addedEdgeIds: [...(result.addedEdgeIds ?? [])],
  removedEdgeIds: [...(result.removedEdgeIds ?? [])],
})

export const cancelGraphCommandBeforeCommit = ({
  commandFamily,
  entryPoint,
  reason,
}: {
  commandFamily: GraphCommandFamily
  entryPoint: GraphCommandEntryPoint
  reason: string
}): CancelledGraphCommandSummary => ({
  commandFamily,
  entryPoint,
  lifecycleState: 'cancelled',
  reason,
})
