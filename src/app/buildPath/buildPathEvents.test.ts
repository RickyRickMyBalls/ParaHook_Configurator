import { describe, expect, it } from 'vitest'
import {
  commitReadyGraphCommandPlan,
  createReadyGraphCommandCommitPlan,
} from '../console/commandCommitContract'
import { projectGraphCommandCommitForBuildPath } from '../console/buildPathProjection'
import { createBuildPathEventFromCommandProjection } from './buildPathEvents'

describe('createBuildPathEventFromCommandProjection', () => {
  it('turns a Sketch command projection into a stable Build Path event', () => {
    const commandSummary = commitReadyGraphCommandPlan(
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
      commandSummary,
    })

    expect(projection).not.toBeNull()

    const event = createBuildPathEventFromCommandProjection({
      projection: projection!,
      eventSequence: 1,
      acceptedAt: '2026-05-22T18:00:00.000Z',
    })

    expect(event).toEqual({
      buildPathEventId: 'build-path-event:1:projection-sketch-1',
      sourceProjectionId: 'projection-sketch-1',
      graphDocumentId: 'graph-document-1',
      commandFamily: 'Sketch',
      entryPoint: 'console-root',
      eventSequence: 1,
      affectedNodeIds: ['node-sketch-1'],
      affectedEdgeIds: [],
      affectedOutputIds: [],
      mutationSummary: {
        createdNodeIds: ['node-sketch-1'],
        reusedNodeIds: [],
        updatedNodeIds: [],
        addedEdgeIds: [],
        removedEdgeIds: [],
      },
      buildResultState: { kind: 'pending' },
      acceptedAt: '2026-05-22T18:00:00.000Z',
      timelineRole: 'unclassified',
    })
  })

  it('preserves Extrude graph ids, output ids, build result state, and caller ordering', () => {
    const commandSummary = commitReadyGraphCommandPlan(
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
      graphDocumentId: 'graph-document-2',
      projectionId: 'projection-extrude-1',
      commandSummary,
      outputIds: ['output-preview-1'],
      buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
    })

    expect(projection).not.toBeNull()

    const event = createBuildPathEventFromCommandProjection({
      projection: projection!,
      eventSequence: 7,
    })

    expect(event).toMatchObject({
      buildPathEventId: 'build-path-event:7:projection-extrude-1',
      sourceProjectionId: 'projection-extrude-1',
      graphDocumentId: 'graph-document-2',
      commandFamily: 'Extrude',
      entryPoint: 'viewport-toolbar',
      eventSequence: 7,
      affectedNodeIds: ['node-extrude-1'],
      affectedEdgeIds: ['edge-profile-a', 'edge-profile-b'],
      affectedOutputIds: ['output-preview-1'],
      mutationSummary: {
        createdNodeIds: ['node-extrude-1'],
        reusedNodeIds: [],
        updatedNodeIds: [],
        addedEdgeIds: ['edge-profile-a', 'edge-profile-b'],
        removedEdgeIds: [],
      },
      buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
    })
    expect(event).not.toHaveProperty('acceptedAt')
  })

  it('copies projection arrays so later projection mutation does not rewrite the event', () => {
    const commandSummary = commitReadyGraphCommandPlan(
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
      graphDocumentId: 'graph-document-3',
      projectionId: 'projection-extrude-2',
      commandSummary,
      outputIds: ['output-preview-2'],
      buildResultState: { kind: 'unavailable', reason: 'not-built-yet' },
    })

    expect(projection).not.toBeNull()

    const event = createBuildPathEventFromCommandProjection({
      projection: projection!,
      eventSequence: 2,
    })

    projection!.affectedGraphIds.nodeIds.push('node-late-mutation')
    projection!.affectedGraphIds.edgeIds.push('edge-late-mutation')
    projection!.affectedGraphIds.outputIds.push('output-late-mutation')
    projection!.graphMutationSummary.updatedNodeIds.push('node-late-mutation')

    expect(event.affectedNodeIds).toEqual(['node-extrude-1'])
    expect(event.affectedEdgeIds).toEqual(['edge-new-profile', 'edge-old-profile'])
    expect(event.affectedOutputIds).toEqual(['output-preview-2'])
    expect(event.mutationSummary.updatedNodeIds).toEqual(['node-extrude-1'])
    expect(event.buildResultState).toEqual({ kind: 'unavailable', reason: 'not-built-yet' })
  })

  it('leaves branch role classification to later Build Path phases', () => {
    const commandSummary = commitReadyGraphCommandPlan(
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
      graphDocumentId: 'graph-document-4',
      projectionId: 'projection-sketch-reuse',
      commandSummary,
    })

    expect(projection).not.toBeNull()

    const event = createBuildPathEventFromCommandProjection({
      projection: projection!,
      eventSequence: 3,
    })

    expect(event.timelineRole).toBe('unclassified')
  })
})
