import { afterEach, describe, expect, it } from 'vitest'
import {
  cancelGraphCommandBeforeCommit,
  commitReadyGraphCommandPlan,
  createReadyGraphCommandCommitPlan,
} from '../console/commandCommitContract'
import { editHistoryStore } from '../store/editHistoryStore'
import {
  recordGraphCommandSummaryForBuildPath,
  recordGraphDependenciesForBuildPath,
  recordSketchSourceForBuildPathIfMissing,
} from './recordBuildPathGraphCommand'
import { useBuildPathRuntimeStore } from './useBuildPathRuntimeStore'

afterEach(() => {
  editHistoryStore.clear()
  useBuildPathRuntimeStore.getState().resetRuntimeState()
})

describe('recordGraphCommandSummaryForBuildPath', () => {
  it('records repeated committed graph commands as distinct live Build Path events', () => {
    const commandSummary = commitReadyGraphCommandPlan(
      createReadyGraphCommandCommitPlan({
        commandFamily: 'Sketch',
        entryPoint: 'console-root',
        intendedMutations: ['reuse-node'],
      }),
      {
        reusedNodeIds: ['sketch-node-1'],
      },
    )

    const first = recordGraphCommandSummaryForBuildPath({
      commandSummary,
      graphDocumentId: 'graph-document-1',
    })
    const second = recordGraphCommandSummaryForBuildPath({
      commandSummary,
      graphDocumentId: 'graph-document-1',
    })

    expect(first.status).toBe('accepted')
    expect(second.status).toBe('accepted')
    expect(useBuildPathRuntimeStore.getState().readEvents()).toMatchObject([
      {
        sourceProjectionId: 'build-path-live:graph-document-1:sketch:1',
        commandFamily: 'Sketch',
        eventSequence: 1,
      },
      {
        sourceProjectionId: 'build-path-live:graph-document-1:sketch:2',
        commandFamily: 'Sketch',
        eventSequence: 2,
      },
    ])
  })

  it('skips cancelled graph commands and preserves canonical redo history', () => {
    editHistoryStore.commitEntry({
      entryId: 'authored-redo-proof',
      label: 'Authored edit',
      source: { surface: 'build-path-test' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistoryStore.undo()
    const redoBefore = editHistoryStore.getRedoEntries().map((entry) => entry.entryId)

    const result = recordGraphCommandSummaryForBuildPath({
      commandSummary: cancelGraphCommandBeforeCommit({
        commandFamily: 'Extrude',
        entryPoint: 'console-root',
        reason: 'missing-profile-selection',
      }),
      graphDocumentId: 'graph-document-1',
    })

    expect(result.status).toBe('skipped')
    expect(useBuildPathRuntimeStore.getState().readEvents()).toEqual([])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })

  it('backfills a missing source Sketch before recording a dependent Extrude', () => {
    const sketchBackfill = recordSketchSourceForBuildPathIfMissing({
      graphDocumentId: 'graph-document-1',
      sketchNodeId: 'sketch-node-1',
    })
    const duplicateSketchBackfill = recordSketchSourceForBuildPathIfMissing({
      graphDocumentId: 'graph-document-1',
      sketchNodeId: 'sketch-node-1',
    })
    const extrude = recordGraphCommandSummaryForBuildPath({
      commandSummary: commitReadyGraphCommandPlan(
        createReadyGraphCommandCommitPlan({
          commandFamily: 'Extrude',
          entryPoint: 'console-root',
          intendedMutations: ['create-node', 'add-wire'],
        }),
        {
          addedEdgeIds: ['edge-profile-1'],
          createdNodeIds: ['extrude-node-1'],
          updatedNodeIds: ['extrude-node-1'],
        },
      ),
      graphDocumentId: 'graph-document-1',
    })

    expect(sketchBackfill?.status).toBe('accepted')
    expect(duplicateSketchBackfill).toBeNull()
    expect(extrude.status).toBe('accepted')
    expect(useBuildPathRuntimeStore.getState().readEvents()).toMatchObject([
      {
        affectedNodeIds: ['sketch-node-1'],
        commandFamily: 'Sketch',
        eventSequence: 1,
      },
      {
        affectedEdgeIds: ['edge-profile-1'],
        commandFamily: 'Extrude',
        eventSequence: 2,
      },
    ])
  })

  it('records Build Path dependency hints without creating Edit History entries', () => {
    editHistoryStore.commitEntry({
      entryId: 'dependency-redo-proof',
      label: 'Authored edit',
      source: { surface: 'build-path-test' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistoryStore.undo()
    const redoBefore = editHistoryStore.getRedoEntries().map((entry) => entry.entryId)

    const dependencies = recordGraphDependenciesForBuildPath({
      graphDocumentId: 'graph-document-1',
      sourceNodeIds: ['sketch-node-1'],
      targetNodeIds: ['extrude-node-1'],
      edgeIds: ['edge-profile-1'],
    })

    expect(dependencies).toEqual([
      {
        edgeId: 'edge-profile-1',
        fromNodeId: 'sketch-node-1',
        toNodeId: 'extrude-node-1',
      },
    ])
    expect(useBuildPathRuntimeStore.getState().readGraphDependencies()).toEqual(dependencies)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })
})
