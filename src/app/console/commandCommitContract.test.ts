import { describe, expect, it } from 'vitest'
import {
  canCommandLifecycleMutateGraph,
  cancelGraphCommandBeforeCommit,
  commitReadyGraphCommandPlan,
  createReadyGraphCommandCommitPlan,
  isCommittedGraphCommandSummary,
  viewportCommandLifecycleStates,
  type ViewportCommandLifecycleState,
} from './commandCommitContract'

describe('commandCommitContract', () => {
  it('keeps graph mutation reserved for the ready-to-commit transition', () => {
    const mutableStates = viewportCommandLifecycleStates.filter((state) =>
      canCommandLifecycleMutateGraph(state),
    )

    expect(mutableStates).toEqual(['readyToCommit'])
    expect(
      viewportCommandLifecycleStates.filter(
        (state): state is Exclude<ViewportCommandLifecycleState, 'readyToCommit'> =>
          state !== 'readyToCommit',
      ).every((state) => !canCommandLifecycleMutateGraph(state)),
    ).toBe(true)
  })

  it('summarizes committed graph truth without storing preview state', () => {
    const plan = createReadyGraphCommandCommitPlan({
      commandFamily: 'Sketch',
      entryPoint: 'console-root',
      intendedMutations: ['create-node'],
    })

    const summary = commitReadyGraphCommandPlan(plan, {
      createdNodeIds: ['node-sketch-1'],
    })

    expect(summary).toEqual({
      commandFamily: 'Sketch',
      entryPoint: 'console-root',
      lifecycleState: 'committed',
      createdNodeIds: ['node-sketch-1'],
      reusedNodeIds: [],
      updatedNodeIds: [],
      addedEdgeIds: [],
      removedEdgeIds: [],
    })
    expect(isCommittedGraphCommandSummary(summary)).toBe(true)
  })

  it('summarizes cancellation as no durable graph mutation', () => {
    const summary = cancelGraphCommandBeforeCommit({
      commandFamily: 'Extrude',
      entryPoint: 'viewport-toolbar',
      reason: 'cancelled-before-profile-selection',
    })

    expect(summary).toEqual({
      commandFamily: 'Extrude',
      entryPoint: 'viewport-toolbar',
      lifecycleState: 'cancelled',
      reason: 'cancelled-before-profile-selection',
    })
    expect(isCommittedGraphCommandSummary(summary)).toBe(false)
  })
})
