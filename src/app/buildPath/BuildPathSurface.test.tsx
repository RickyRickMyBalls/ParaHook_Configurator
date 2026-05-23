// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  commitReadyGraphCommandPlan,
  createReadyGraphCommandCommitPlan,
} from '../console/commandCommitContract'
import { editHistoryStore } from '../store/editHistoryStore'
import type { BuildPathEvent } from './buildPathEvents'
import { deriveBuildPathMasterTimeline } from './buildPathTimeline'
import {
  BuildPathSurface,
  BuildPathTimelineStrip,
  BuildPathViewportDock,
} from './BuildPathSurface'
import {
  recordGraphCommandSummaryForBuildPath,
  recordGraphDependenciesForBuildPath,
  recordSketchSourceForBuildPathIfMissing,
} from './recordBuildPathGraphCommand'
import { useBuildPathRuntimeStore } from './useBuildPathRuntimeStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const createBuildPathEvent = ({
  affectedEdgeIds,
  affectedNodeIds,
  affectedOutputIds,
  buildResultState,
  commandFamily,
  eventSequence,
  projectionId,
}: {
  commandFamily: BuildPathEvent['commandFamily']
  eventSequence: number
  projectionId: string
  affectedNodeIds?: string[]
  affectedEdgeIds?: string[]
  affectedOutputIds?: string[]
  buildResultState?: BuildPathEvent['buildResultState']
}): BuildPathEvent => ({
  buildPathEventId: ['build-path-event', eventSequence.toString(), projectionId].join(':'),
  sourceProjectionId: projectionId,
  sourceKind: 'recorded',
  graphDocumentId: 'graph-document-1',
  commandFamily,
  entryPoint: 'console-root',
  eventSequence,
  affectedNodeIds: affectedNodeIds ?? [`node-${projectionId}`],
  affectedEdgeIds: affectedEdgeIds ?? [],
  affectedOutputIds: affectedOutputIds ?? [],
  mutationSummary: {
    createdNodeIds: affectedNodeIds ?? [`node-${projectionId}`],
    reusedNodeIds: [],
    updatedNodeIds: [],
    addedEdgeIds: affectedEdgeIds ?? [],
    removedEdgeIds: [],
  },
  buildResultState: buildResultState ?? { kind: 'pending' },
  timelineRole: 'unclassified',
})

describe('BuildPathSurface', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    editHistoryStore.clear()
    useBuildPathRuntimeStore.getState().resetRuntimeState()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
    editHistoryStore.clear()
    useBuildPathRuntimeStore.getState().resetRuntimeState()
  })

  it('renders an empty viewport dock strip without visible Build Path body text', async () => {
    await act(async () => {
      root?.render(<BuildPathViewportDock />)
    })

    const dock = container?.querySelector('[data-build-path-viewport-dock="bottom"]')
    const strip = container?.querySelector('.BuildPathTimelineStrip--viewport-dock')

    expect(dock).not.toBeNull()
    expect(strip?.getAttribute('data-build-path-timeline-status')).toBe('empty')
    expect(strip?.textContent).not.toContain('Build Path')
    expect(strip?.querySelector('.BuildPathTimelineEmptyGlyph')).not.toBeNull()
  })

  it('renders Sketch then Extrude as compact timeline icons from display metadata', async () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch',
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude',
      }),
    ])

    await act(async () => {
      root?.render(<BuildPathTimelineStrip timeline={timeline} hostMode="viewport-dock" />)
    })

    const steps = Array.from(container?.querySelectorAll('.BuildPathTimelineStep') ?? [])

    expect(steps).toHaveLength(2)
    expect(steps[0]?.className).toContain('BuildPathTimelineStep--sketch')
    expect(steps[0]?.getAttribute('aria-label')).toBe('1. Sketch build event')
    expect(steps[0]?.getAttribute('aria-pressed')).toBe('false')
    expect(steps[1]?.className).toContain('BuildPathTimelineStep--extrude')
    expect(steps[1]?.getAttribute('aria-label')).toBe('2. Extrude build event')
    expect(steps[1]?.getAttribute('aria-pressed')).toBe('false')
    expect(container?.textContent).not.toContain('Build Path')
  })

  it('shows docked scrub readback and moves selection without Edit History entries', async () => {
    editHistoryStore.commitEntry({
      entryId: 'viewport-dock-redo-proof',
      label: 'Authored edit',
      source: { surface: 'graph' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistoryStore.undo()
    const redoBefore = editHistoryStore.getRedoEntries().map((entry) => entry.entryId)

    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-dock-sketch',
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-dock-extrude',
      }),
    ])

    await act(async () => {
      root?.render(<BuildPathViewportDock />)
    })

    const readback = container?.querySelector('[data-build-path-dock-readback-state="selected"]')
    const nextButton = container?.querySelector(
      '.BuildPathViewportScrubButton[aria-label="Select next Build Path step"]',
    ) as HTMLButtonElement | null

    expect(readback?.textContent).toContain('1')
    expect(readback?.textContent).toContain('Sketch')

    await act(async () => {
      nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const selectedStep = useBuildPathRuntimeStore.getState().readSelectedTimelineStep()

    expect(selectedStep?.event.commandFamily).toBe('Extrude')
    expect(readback?.textContent).toContain('2')
    expect(readback?.textContent).toContain('Extrude')
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })

  it('reads the Build Path runtime store for workspace-hosted surfaces', async () => {
    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 4,
        projectionId: 'projection-store-sketch',
      }),
    ])

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-workspace-test" hostMode="workspace" />,
      )
    })

    const surface = container?.querySelector(
      '.WorkspaceViewportSlotSurface--buildPath[data-workspace-surface-instance-id="build-path-workspace-test"]',
    )
    const step = surface?.querySelector('.BuildPathTimelineStep--sketch')

    expect(surface).not.toBeNull()
    expect(surface?.getAttribute('data-build-path-host-mode')).toBe('workspace')
    expect(step?.getAttribute('data-build-path-event-id')).toBe(
      'build-path-event:4:projection-store-sketch',
    )
    expect(surface?.querySelector('[data-build-path-readback-state="selected"]')).not.toBeNull()
    expect(surface?.textContent).toContain('Sketch')
    expect(surface?.textContent).toContain('Nodes')
  })

  it('selects a visible timeline step into view-only scrub state without touching Edit History or graph truth', async () => {
    const graphSnapshot = {
      graphDocumentId: 'graph-document-1',
      nodes: ['node-sketch', 'node-extrude'],
      edges: ['edge-profile'],
    }
    editHistoryStore.commitEntry({
      entryId: 'authored-entry-1',
      label: 'Authored edit',
      source: { surface: 'graph' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistoryStore.undo()
    const redoBefore = editHistoryStore.getRedoEntries().map((entry) => entry.entryId)

    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude',
        affectedNodeIds: ['node-extrude'],
        affectedEdgeIds: ['edge-profile'],
        affectedOutputIds: ['output-solid'],
        buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
      }),
    ])

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-select-test" hostMode="workspace" />,
      )
    })

    const extrudeStep = container?.querySelector(
      '.BuildPathTimelineStep--extrude',
    ) as HTMLButtonElement | null

    await act(async () => {
      extrudeStep?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const selectedStep = useBuildPathRuntimeStore.getState().readSelectedTimelineStep()
    const readback = container?.querySelector('[data-build-path-readback-state="selected"]')

    expect(selectedStep?.event.commandFamily).toBe('Extrude')
    expect(extrudeStep?.getAttribute('aria-pressed')).toBe('true')
    expect(extrudeStep?.getAttribute('data-build-path-step-selected')).toBe('true')
    expect(readback?.textContent).toContain('Extrude')
    expect(readback?.textContent).toContain('Linked result build-result-1')
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
    expect(graphSnapshot).toEqual({
      graphDocumentId: 'graph-document-1',
      nodes: ['node-sketch', 'node-extrude'],
      edges: ['edge-profile'],
    })
  })

  it('renders explicit planned action boundaries without enabling graph mutations', async () => {
    editHistoryStore.commitEntry({
      entryId: 'action-boundary-redo-proof',
      label: 'Authored edit',
      source: { surface: 'graph' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistoryStore.undo()
    const redoBefore = editHistoryStore.getRedoEntries().map((entry) => entry.entryId)

    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 1,
        projectionId: 'projection-action-extrude',
        affectedOutputIds: ['output-solid'],
        buildResultState: { kind: 'linked', buildResultId: 'build-result-1' },
      }),
    ])

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-action-boundary-test" hostMode="workspace" />,
      )
    })

    const boundaryPanel = container?.querySelector('[data-build-path-action-boundary-state]')
    const actionButtons = Array.from(container?.querySelectorAll('.BuildPathActionButton') ?? [])

    expect(boundaryPanel?.getAttribute('data-build-path-action-boundary-state')).toBe(
      'missing-worker-checkpoint',
    )
    expect(boundaryPanel?.getAttribute('data-build-path-restore-ready')).toBe('false')
    expect(boundaryPanel?.textContent).toContain('Checkpoint candidate')
    expect(actionButtons.map((button) => button.getAttribute('data-build-path-action-kind'))).toEqual([
      'restore',
      'branch-from-here',
      'compare',
      'pin',
    ])
    expect(actionButtons[0]?.getAttribute('data-build-path-restore-status')).toBe(
      'missing-restore-contract',
    )
    expect(actionButtons[0]?.getAttribute('data-build-path-restore-can-execute')).toBe('false')
    expect(actionButtons[1]?.getAttribute('data-build-path-branch-status')).toBe(
      'missing-branch-contract',
    )
    expect(actionButtons[1]?.getAttribute('data-build-path-branch-can-create')).toBe('false')
    expect(actionButtons[1]?.getAttribute('data-build-path-branch-destination')).toBe(
      'new-graph-document',
    )
    expect(actionButtons[2]?.getAttribute('data-build-path-compare-status')).toBe(
      'missing-compare-target',
    )
    expect(actionButtons[2]?.getAttribute('data-build-path-compare-can-run')).toBe('false')
    expect(actionButtons[3]?.getAttribute('data-build-path-pin-status')).toBe(
      'checkpoint-candidate',
    )
    expect(actionButtons[3]?.getAttribute('data-build-path-pin-can-persist')).toBe('false')
    expect(actionButtons[3]?.getAttribute('data-build-path-checkpoint-can-persist')).toBe(
      'false',
    )
    expect(actionButtons.every((button) => (button as HTMLButtonElement).disabled)).toBe(true)
    expect(actionButtons.every(
      (button) => button.getAttribute('data-build-path-action-triggered-by-scrub') === 'false',
    )).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })

  it('enters workspace parallel mode without mutating master order or Edit History', async () => {
    editHistoryStore.commitEntry({
      entryId: 'parallel-mode-redo-proof',
      label: 'Authored edit',
      source: { surface: 'graph' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistoryStore.undo()
    const redoBefore = editHistoryStore.getRedoEntries().map((entry) => entry.entryId)

    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-parallel-sketch',
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-parallel-extrude',
      }),
    ])

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-parallel-test" hostMode="workspace" />,
      )
    })

    const parallelButton = Array.from(container?.querySelectorAll('.BuildPathWorkspaceModeButton') ?? [])
      .find((button) => button.textContent === 'Parallel') as HTMLButtonElement | undefined

    await act(async () => {
      parallelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const parallelRead = container?.querySelector('[data-build-path-parallel-state]')

    expect(useBuildPathRuntimeStore.getState().isParallelModeEnabled).toBe(true)
    expect(parallelRead?.getAttribute('data-build-path-parallel-state')).toBe(
      'dependency-hints-unavailable',
    )
    expect(parallelRead?.textContent).toContain('2 steps')
    expect(useBuildPathRuntimeStore.getState().readMasterTimeline().steps.map(
      (step) => step.event.commandFamily,
    )).toEqual(['Sketch', 'Extrude'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })

  it('renders dependency-derived branch lanes and moves a branch-local playhead view-only', async () => {
    editHistoryStore.commitEntry({
      entryId: 'branch-playhead-redo-proof',
      label: 'Authored edit',
      source: { surface: 'graph' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistoryStore.undo()
    const redoBefore = editHistoryStore.getRedoEntries().map((entry) => entry.entryId)

    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-branch-sketch',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-branch-extrude',
        affectedNodeIds: ['node-extrude'],
      }),
    ])
    useBuildPathRuntimeStore.getState().addGraphDependencies([
      {
        edgeId: 'edge-profile',
        fromNodeId: 'node-sketch',
        toNodeId: 'node-extrude',
      },
    ])

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-branch-test" hostMode="workspace" />,
      )
    })

    const parallelButton = Array.from(container?.querySelectorAll('.BuildPathWorkspaceModeButton') ?? [])
      .find((button) => button.textContent === 'Parallel') as HTMLButtonElement | undefined

    await act(async () => {
      parallelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const parallelRead = container?.querySelector('[data-build-path-parallel-state]')
    const lane = container?.querySelector('[data-build-path-branch-lane-id]')
    const branchSteps = Array.from(container?.querySelectorAll('.BuildPathBranchStep') ?? [])
    const extrudeBranchStep = branchSteps.find(
      (step) => step.textContent?.includes('Extrude') === true,
    ) as HTMLButtonElement | undefined

    await act(async () => {
      extrudeBranchStep?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const laneId = lane?.getAttribute('data-build-path-branch-lane-id') ?? ''

    expect(parallelRead?.getAttribute('data-build-path-parallel-state')).toBe('ready')
    expect(branchSteps).toHaveLength(2)
    expect(extrudeBranchStep?.getAttribute('aria-pressed')).toBe('true')
    expect(useBuildPathRuntimeStore.getState().selectedBranchTimelineStepIdByLaneId[laneId])
      .toContain('projection-branch-extrude')
    expect(useBuildPathRuntimeStore.getState().readMasterTimeline().steps.map(
      (step) => step.event.commandFamily,
    )).toEqual(['Sketch', 'Extrude'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })

  it('proves a fresh Sketch to dependent Extrude recording path reaches ready Parallel lanes', async () => {
    editHistoryStore.commitEntry({
      entryId: 'fresh-live-branch-proof',
      label: 'Authored edit',
      source: { surface: 'graph' },
      undo: () => undefined,
      redo: () => undefined,
    })
    editHistoryStore.undo()
    const redoBefore = editHistoryStore.getRedoEntries().map((entry) => entry.entryId)

    const sketchResult = recordSketchSourceForBuildPathIfMissing({
      graphDocumentId: 'graph-document-live-proof',
      sketchNodeId: 'node-live-sketch',
    })

    recordGraphDependenciesForBuildPath({
      graphDocumentId: 'graph-document-live-proof',
      sourceNodeIds: ['node-live-sketch'],
      targetNodeIds: ['node-live-extrude'],
      edgeIds: ['edge-live-profile'],
    })

    const extrudeResult = recordGraphCommandSummaryForBuildPath({
      commandSummary: commitReadyGraphCommandPlan(
        createReadyGraphCommandCommitPlan({
          commandFamily: 'Extrude',
          entryPoint: 'console-root',
          intendedMutations: ['create-node', 'add-wire'],
        }),
        {
          addedEdgeIds: ['edge-live-profile'],
          createdNodeIds: ['node-live-extrude'],
          updatedNodeIds: ['node-live-extrude'],
        },
      ),
      graphDocumentId: 'graph-document-live-proof',
      outputIds: ['output-live-solid'],
    })

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-fresh-proof" hostMode="workspace" />,
      )
    })

    const parallelButton = Array.from(container?.querySelectorAll('.BuildPathWorkspaceModeButton') ?? [])
      .find((button) => button.textContent === 'Parallel') as HTMLButtonElement | undefined

    await act(async () => {
      parallelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const parallelRead = container?.querySelector('[data-build-path-parallel-state]')
    const branchSteps = Array.from(container?.querySelectorAll('.BuildPathBranchStep') ?? [])
    const branchRoles = branchSteps.map((step) => step.getAttribute('data-build-path-branch-role'))

    expect(sketchResult?.status).toBe('accepted')
    expect(extrudeResult.status).toBe('accepted')
    expect(parallelRead?.getAttribute('data-build-path-parallel-state')).toBe('ready')
    expect(branchSteps.map((step) => step.textContent)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Sketch'),
        expect.stringContaining('Extrude'),
      ]),
    )
    expect(branchRoles).toContain('linear')
    expect(useBuildPathRuntimeStore.getState().readGraphDependencies()).toEqual([
      {
        edgeId: 'edge-live-profile',
        fromNodeId: 'node-live-sketch',
        toNodeId: 'node-live-extrude',
      },
    ])
    expect(useBuildPathRuntimeStore.getState().readMasterTimeline().steps.map(
      (step) => step.event.commandFamily,
    )).toEqual(['Sketch', 'Extrude'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })
})
