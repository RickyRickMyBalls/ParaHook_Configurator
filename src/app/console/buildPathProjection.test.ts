import { describe, expect, it } from 'vitest'
import {
  cancelGraphCommandBeforeCommit,
  commitReadyGraphCommandPlan,
  createReadyGraphCommandCommitPlan,
} from './commandCommitContract'
import { projectGraphCommandCommitForBuildPath } from './buildPathProjection'

describe('projectGraphCommandCommitForBuildPath', () => {
  it('projects a created Sketch commit into a Build Path-ready graph record', () => {
    const commitSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Sketch',
        entryPoint: 'console-root',
        intendedMutations: ['create-node'],
      }),
      {
        createdNodeIds: ['node-sketch-1'],
      },
    )

    const projection = projectGraphCommandCommitForBuildPath({
      graphDocumentId: 'graph-document-1',
      projectionId: 'projection-sketch-1',
      commandSummary: commitSummary,
    })

    expect(projection).toEqual({
      projectionId: 'projection-sketch-1',
      graphDocumentId: 'graph-document-1',
      commandFamily: 'Sketch',
      entryPoint: 'console-root',
      rowLabel: 'Sketch (1 node)',
      graphMutationSummary: {
        createdNodeIds: ['node-sketch-1'],
        reusedNodeIds: [],
        updatedNodeIds: [],
        addedEdgeIds: [],
        removedEdgeIds: [],
      },
      affectedGraphIds: {
        graphDocumentId: 'graph-document-1',
        nodeIds: ['node-sketch-1'],
        edgeIds: [],
        outputIds: [],
      },
      buildResultState: { kind: 'pending' },
    })
  })

  it('projects a reused Sketch commit without pretending a new node exists', () => {
    const commitSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Sketch',
        entryPoint: 'viewport-shortcut',
        intendedMutations: ['reuse-node'],
      }),
      {
        reusedNodeIds: ['node-sketch-existing'],
      },
    )

    const projection = projectGraphCommandCommitForBuildPath({
      graphDocumentId: 'graph-document-1',
      commandSummary: commitSummary,
    })

    expect(projection).toMatchObject({
      commandFamily: 'Sketch',
      entryPoint: 'viewport-shortcut',
      rowLabel: 'Sketch (1 node)',
      graphMutationSummary: {
        createdNodeIds: [],
        reusedNodeIds: ['node-sketch-existing'],
      },
      affectedGraphIds: {
        graphDocumentId: 'graph-document-1',
        nodeIds: ['node-sketch-existing'],
        edgeIds: [],
      },
    })
  })

  it('projects an Extrude commit with created node and selected profile wires', () => {
    const commitSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Extrude',
        entryPoint: 'viewport-toolbar',
        intendedMutations: ['create-node', 'add-wire'],
      }),
      {
        createdNodeIds: ['node-extrude-1'],
        addedEdgeIds: ['edge-profile-a', 'edge-profile-b'],
      },
    )

    const projection = projectGraphCommandCommitForBuildPath({
      graphDocumentId: 'graph-document-1',
      commandSummary: commitSummary,
      outputIds: ['output-preview-1', 'output-preview-1'],
      buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
    })

    expect(projection).toMatchObject({
      commandFamily: 'Extrude',
      entryPoint: 'viewport-toolbar',
      rowLabel: 'Extrude (1 node, 2 wires)',
      graphMutationSummary: {
        createdNodeIds: ['node-extrude-1'],
        addedEdgeIds: ['edge-profile-a', 'edge-profile-b'],
      },
      affectedGraphIds: {
        graphDocumentId: 'graph-document-1',
        nodeIds: ['node-extrude-1'],
        edgeIds: ['edge-profile-a', 'edge-profile-b'],
        outputIds: ['output-preview-1'],
      },
      buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
    })
  })

  it('skips cancelled command summaries instead of creating history rows', () => {
    const cancelledSummary = cancelGraphCommandBeforeCommit({
      commandFamily: 'Extrude',
      entryPoint: 'console-root',
      reason: 'missing-profile-selection',
    })

    expect(
      projectGraphCommandCommitForBuildPath({
        graphDocumentId: 'graph-document-1',
        commandSummary: cancelledSummary,
      }),
    ).toBeNull()
  })

  it('preserves graph ids from the summary without reading live graph state', () => {
    const commitSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Extrude',
        entryPoint: 'feature-assist',
        intendedMutations: ['reuse-node', 'update-params', 'add-wire', 'remove-wire'],
      }),
      {
        reusedNodeIds: ['node-extrude-1'],
        updatedNodeIds: ['node-extrude-1'],
        addedEdgeIds: ['edge-new-profile'],
        removedEdgeIds: ['edge-old-profile'],
      },
    )

    const projection = projectGraphCommandCommitForBuildPath({
      graphDocumentId: 'graph-document-explicit',
      commandSummary: commitSummary,
      buildResultState: { kind: 'unavailable', reason: 'not-built-yet' },
    })

    expect(projection?.graphDocumentId).toBe('graph-document-explicit')
    expect(projection?.graphMutationSummary).toEqual({
      createdNodeIds: [],
      reusedNodeIds: ['node-extrude-1'],
      updatedNodeIds: ['node-extrude-1'],
      addedEdgeIds: ['edge-new-profile'],
      removedEdgeIds: ['edge-old-profile'],
    })
    expect(projection?.affectedGraphIds).toEqual({
      graphDocumentId: 'graph-document-explicit',
      nodeIds: ['node-extrude-1'],
      edgeIds: ['edge-new-profile', 'edge-old-profile'],
      outputIds: [],
    })
    expect(projection?.buildResultState).toEqual({
      kind: 'unavailable',
      reason: 'not-built-yet',
    })
  })
})
