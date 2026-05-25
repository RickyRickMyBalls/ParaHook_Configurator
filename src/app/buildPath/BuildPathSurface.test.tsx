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
import { createBuildPathLifecycleCard } from './buildPathLifecycle'
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

const createPointerLikeEvent = (type: string, clientX: number): MouseEvent =>
  new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
  })

const stubBuildPathStepButtonRects = (
  stepButtons: readonly Element[],
  startX = 100,
  stepPitch = 30,
) => {
  stepButtons.forEach((stepButton, index) => {
    const left = startX + index * stepPitch
    Object.defineProperty(stepButton, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        bottom: 24,
        height: 24,
        left,
        right: left + 24,
        top: 0,
        width: 24,
        x: left,
        y: 0,
        toJSON: () => undefined,
      }),
    })
  })
}

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
    const rail = container?.querySelector('.BuildPathTimelineStepRail')

    expect(dock).not.toBeNull()
    expect(dock?.getAttribute('data-build-path-viewport-anchor')).toBe('bottom-left')
    expect(strip?.getAttribute('data-build-path-timeline-status')).toBe('empty')
    expect(strip?.textContent).not.toContain('Build Path')
    expect(strip?.querySelector('.BuildPathTimelineEmptyGlyph')).not.toBeNull()
    expect(rail).toBeNull()
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

  it('keeps the viewport dock to the icon timeline and marker scrub controls', async () => {
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

    const extrudeStep = container?.querySelector(
      '.BuildPathTimelineStep--extrude',
    ) as HTMLButtonElement | null
    const marker = container?.querySelector('[data-build-path-current-position-line="true"]')

    expect(container?.querySelector('[data-build-path-dock-readback-state="selected"]')).toBeNull()
    expect(container?.querySelector('.BuildPathViewportScrubButton')).toBeNull()
    expect(marker?.getAttribute('data-build-path-current-step-index')).toBe('0')
    expect(marker?.getAttribute('data-build-path-current-step-id')).toContain(
      'projection-dock-sketch',
    )

    await act(async () => {
      extrudeStep?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const selectedStep = useBuildPathRuntimeStore.getState().readSelectedTimelineStep()
    const updatedMarker = container?.querySelector('[data-build-path-current-position-line="true"]')

    if (selectedStep?.stepKind !== 'build-event') {
      throw new Error('Expected selected Build Path step to be a build event.')
    }
    expect(selectedStep.event.commandFamily).toBe('Extrude')
    expect(updatedMarker?.getAttribute('data-build-path-current-step-index')).toBe('1')
    expect(updatedMarker?.getAttribute('data-build-path-current-step-id')).toContain(
      'projection-dock-extrude',
    )
    expect(editHistoryStore.getUndoEntries().at(-1)).toMatchObject({
      label: 'Build Path timeline selection',
      source: { surface: 'build-path' },
      targetLabel: 'Step 2',
    })
    expect(editHistoryStore.getRedoEntries()).toEqual([])

    await act(async () => {
      editHistoryStore.undo()
    })

    expect(useBuildPathRuntimeStore.getState().readSelectedTimelineStep()?.display.label).toBe(
      'Sketch',
    )
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).not.toEqual(redoBefore)
  })

  it('allows a long viewport-docked timeline rail to scroll horizontally', async () => {
    useBuildPathRuntimeStore.getState().resetRuntimeState(
      Array.from({ length: 18 }, (_, index) =>
        createBuildPathEvent({
          commandFamily: index % 3 === 0 ? 'Sketch' : 'Extrude',
          eventSequence: index + 1,
          projectionId: `projection-scroll-${index + 1}`,
        }),
      ),
    )

    await act(async () => {
      root?.render(<BuildPathViewportDock />)
    })

    const dock = container?.querySelector('[data-build-path-viewport-dock="bottom"]')
    const strip = container?.querySelector('.BuildPathTimelineStrip--viewport-dock')
    const rail = container?.querySelector('.BuildPathTimelineStepRail')
    const steps = Array.from(container?.querySelectorAll('.BuildPathTimelineStep') ?? [])

    expect(dock?.getAttribute('data-build-path-viewport-anchor')).toBe('bottom-left')
    expect(strip).not.toBeNull()
    expect(rail).not.toBeNull()
    expect(rail?.getAttribute('data-build-path-timeline-overflow')).toBe('horizontal-scroll')
    expect(rail?.getAttribute('data-build-path-timeline-scrollbar-visible')).toBe('false')
    expect(steps).toHaveLength(18)

    Object.defineProperty(rail, 'clientWidth', {
      configurable: true,
      value: 320,
    })
    Object.defineProperty(rail, 'scrollWidth', {
      configurable: true,
      value: 720,
    })

    await act(async () => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(rail?.getAttribute('data-build-path-timeline-scrollbar-visible')).toBe('true')
  })

  it('renders a draggable current-position line that scrubs master timeline selection', async () => {
    const graphSnapshot = {
      nodes: ['node-sketch', 'node-extrude', 'node-sketch-2'],
    }
    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-marker-sketch',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-marker-extrude',
        affectedNodeIds: ['node-extrude'],
      }),
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 3,
        projectionId: 'projection-marker-sketch-2',
        affectedNodeIds: ['node-sketch-2'],
      }),
    ])

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-marker-test" hostMode="workspace" />,
      )
    })

    stubBuildPathStepButtonRects(
      Array.from(container?.querySelectorAll('.BuildPathTimelineStep') ?? []),
    )

    const initialMarker = container?.querySelector(
      '[data-build-path-current-position-line="true"]',
    ) as HTMLButtonElement | null

    expect(initialMarker).not.toBeNull()
    expect(initialMarker?.getAttribute('data-build-path-current-position-placement')).toBe(
      'after-step',
    )
    expect(initialMarker?.getAttribute('data-build-path-current-step-index')).toBe('0')
    expect(initialMarker?.getAttribute('data-build-path-current-step-id')).toContain(
      'projection-marker-sketch',
    )

    await act(async () => {
      initialMarker?.dispatchEvent(createPointerLikeEvent('pointerdown', 112))
      initialMarker?.dispatchEvent(createPointerLikeEvent('pointermove', 172))
      initialMarker?.dispatchEvent(createPointerLikeEvent('pointerup', 172))
    })

    const selectedStep = useBuildPathRuntimeStore.getState().readSelectedTimelineStep()
    const updatedMarker = container?.querySelector(
      '[data-build-path-current-position-line="true"]',
    )

    expect(selectedStep?.display.label).toBe('Sketch')
    expect(selectedStep?.orderIndex).toBe(2)
    expect(updatedMarker?.getAttribute('data-build-path-current-step-index')).toBe('2')
    expect(updatedMarker?.getAttribute('data-build-path-current-step-id')).toContain(
      'projection-marker-sketch-2',
    )
    expect(editHistoryStore.getUndoEntries().at(-1)).toMatchObject({
      label: 'Build Path timeline selection',
      source: { surface: 'build-path' },
      targetLabel: 'Step 3',
    })
    expect(graphSnapshot).toEqual({
      nodes: ['node-sketch', 'node-extrude', 'node-sketch-2'],
    })
  })

  it('keeps the current-position line synchronized with docked icon selection', async () => {
    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sync-sketch',
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-sync-extrude',
      }),
    ])

    await act(async () => {
      root?.render(<BuildPathViewportDock />)
    })

    const extrudeStep = container?.querySelector(
      '.BuildPathTimelineStep--extrude',
    ) as HTMLButtonElement | null

    await act(async () => {
      extrudeStep?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    let marker = container?.querySelector('[data-build-path-current-position-line="true"]')

    expect(marker?.getAttribute('data-build-path-current-step-index')).toBe('1')
    expect(marker?.getAttribute('data-build-path-current-position-placement')).toBe(
      'after-step',
    )
    expect(marker?.getAttribute('data-build-path-current-step-id')).toContain(
      'projection-sync-extrude',
    )

    await act(async () => {
      const sketchStep = container?.querySelector(
        '.BuildPathTimelineStep--sketch',
      ) as HTMLButtonElement | null
      sketchStep?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    marker = container?.querySelector('[data-build-path-current-position-line="true"]')

    expect(marker?.getAttribute('data-build-path-current-step-index')).toBe('0')
    expect(marker?.getAttribute('data-build-path-current-step-id')).toContain(
      'projection-sync-sketch',
    )
    expect(useBuildPathRuntimeStore.getState().readSelectedTimelineStep()?.display.label).toBe(
      'Sketch',
    )
  })

  it('marks timeline steps after the scrub position as future while keeping them clickable', async () => {
    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-temporal-sketch',
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-temporal-extrude-1',
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 3,
        projectionId: 'projection-temporal-extrude-2',
      }),
    ])

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-temporal-test" hostMode="workspace" />,
      )
    })

    const readTemporalStates = () =>
      Array.from(container?.querySelectorAll('.BuildPathTimelineStep') ?? [])
        .map((step) => step.getAttribute('data-build-path-step-temporal-state'))
    const timelineSteps = Array.from(
      container?.querySelectorAll('.BuildPathTimelineStep') ?? [],
    ) as HTMLButtonElement[]

    expect(readTemporalStates()).toEqual(['current', 'future', 'future'])
    expect(timelineSteps[2]?.disabled).toBe(false)

    await act(async () => {
      timelineSteps[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(readTemporalStates()).toEqual(['past', 'past', 'current'])
    expect(useBuildPathRuntimeStore.getState().readSelectedTimelineStep()?.display.label).toBe(
      'Extrude',
    )
    expect(editHistoryStore.getUndoEntries().at(-1)).toMatchObject({
      label: 'Build Path timeline selection',
      source: { surface: 'build-path' },
      targetLabel: 'Step 3',
    })
  })

  it('exposes future temporal state on the viewport-docked timeline strip', async () => {
    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-dock-temporal-sketch',
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-dock-temporal-extrude',
      }),
    ])

    await act(async () => {
      root?.render(<BuildPathViewportDock />)
    })

    const steps = Array.from(container?.querySelectorAll('.BuildPathTimelineStep') ?? [])

    expect(steps.map((step) => step.getAttribute('data-build-path-step-temporal-state')))
      .toEqual(['current', 'future'])
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

  it('selects a visible timeline step into undoable scrub state without touching graph truth', async () => {
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

    if (selectedStep?.stepKind !== 'build-event') {
      throw new Error('Expected selected Build Path step to be a build event.')
    }
    expect(selectedStep.event.commandFamily).toBe('Extrude')
    expect(extrudeStep?.getAttribute('aria-pressed')).toBe('true')
    expect(extrudeStep?.getAttribute('data-build-path-step-selected')).toBe('true')
    expect(readback?.textContent).toContain('Extrude')
    expect(readback?.textContent).toContain('Linked result build-result-1')
    expect(editHistoryStore.getUndoEntries().at(-1)).toMatchObject({
      label: 'Build Path timeline selection',
      source: { surface: 'build-path' },
      targetLabel: 'Step 2',
    })
    expect(editHistoryStore.getRedoEntries()).toEqual([])

    await act(async () => {
      editHistoryStore.undo()
    })

    expect(useBuildPathRuntimeStore.getState().readSelectedTimelineStep()?.display.label).toBe(
      'Sketch',
    )
    await act(async () => {
      editHistoryStore.redo()
    })
    expect(useBuildPathRuntimeStore.getState().readSelectedTimelineStep()?.display.label).toBe(
      'Extrude',
    )
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).not.toEqual(redoBefore)
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

  it('renders graph lifecycle cards distinctly without action boundaries', async () => {
    const graphLoadedCard = createBuildPathLifecycleCard({
      lifecycleKind: 'graph-loaded',
      graphDocumentId: 'graph-document-loaded',
      graphLabel: 'Loaded Graph',
      sourceKind: 'reconstructed',
      eventSequence: 1,
    })
    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 2,
        projectionId: 'projection-loaded-sketch',
      }),
    ])
    useBuildPathRuntimeStore.setState((state) => ({
      runtimeState: {
        ...state.runtimeState,
        lifecycleCards: [graphLoadedCard],
      },
    }))

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-lifecycle-test" hostMode="workspace" />,
      )
    })

    const lifecycleStep = container?.querySelector(
      '.BuildPathTimelineStep--graph-loaded',
    ) as HTMLButtonElement | null
    const selectedStep = useBuildPathRuntimeStore.getState().readSelectedTimelineStep()
    const readback = container?.querySelector('[data-build-path-readback-state="selected"]')

    expect(lifecycleStep).not.toBeNull()
    expect(lifecycleStep?.getAttribute('aria-label')).toBe('1. Graph loaded lifecycle card')
    expect(selectedStep?.stepKind).toBe('lifecycle-card')
    expect(readback?.textContent).toContain('Graph Loaded')
    expect(readback?.textContent).toContain('Lifecycle')
    expect(readback?.textContent).toContain('None')
    expect(container?.querySelector('[data-build-path-action-boundary-state]')).toBeNull()
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
    expect(parallelRead?.querySelector('.BuildPathParallelModeHeader')).toBeNull()
    expect(parallelRead?.textContent).toContain('Dependency hints unavailable')
    expect(useBuildPathRuntimeStore.getState().readMasterTimeline().steps.flatMap(
      (step) => step.stepKind === 'build-event' ? [step.event.commandFamily] : [],
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

    const laneReadbackToggle = container?.querySelector(
      '.BuildPathParallelLaneReadbackToggle',
    ) as HTMLButtonElement | null

    await act(async () => {
      laneReadbackToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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
    expect(parallelRead?.getAttribute('data-build-path-lane-readback-expanded')).toBe('true')
    expect(branchSteps).toHaveLength(2)
    expect(extrudeBranchStep?.getAttribute('aria-pressed')).toBe('true')
    expect(useBuildPathRuntimeStore.getState().selectedBranchTimelineStepIdByLaneId[laneId])
      .toContain('projection-branch-extrude')
    expect(useBuildPathRuntimeStore.getState().readMasterTimeline().steps.flatMap(
      (step) => step.stepKind === 'build-event' ? [step.event.commandFamily] : [],
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
      sourcePortIds: ['SketchProfile:prof_live'],
      targetPortIds: ['ExtrusionProfile'],
      connectorKinds: ['sketchProfile'],
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

    const laneReadbackToggle = container?.querySelector(
      '.BuildPathParallelLaneReadbackToggle',
    ) as HTMLButtonElement | null

    await act(async () => {
      laneReadbackToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const parallelRead = container?.querySelector('[data-build-path-parallel-state]')
    const topologyRead = container?.querySelector('[data-build-path-topology-state]')
    const topologyConnector = container?.querySelector(
      '[data-build-path-topology-edge-id="edge-live-profile"]',
    )
    const branchSteps = Array.from(container?.querySelectorAll('.BuildPathBranchStep') ?? [])
    const branchRoles = branchSteps.map((step) => step.getAttribute('data-build-path-branch-role'))

    expect(sketchResult?.status).toBe('accepted')
    expect(extrudeResult.status).toBe('accepted')
    expect(parallelRead?.getAttribute('data-build-path-parallel-state')).toBe('ready')
    expect(parallelRead?.getAttribute('data-build-path-lane-readback-expanded')).toBe('true')
    expect(topologyRead?.getAttribute('data-build-path-topology-column-count')).toBe('2')
    expect(topologyRead?.getAttribute('data-build-path-topology-connector-count')).toBe('1')
    expect(topologyConnector?.getAttribute('data-build-path-topology-connector-kind')).toBe(
      'sketchProfile',
    )
    expect(topologyConnector?.getAttribute('data-build-path-topology-connector-color')).toBe(
      '#6ee7b7',
    )
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
        fromPortId: 'SketchProfile:prof_live',
        toNodeId: 'node-live-extrude',
        toPortId: 'ExtrusionProfile',
        connectorKind: 'sketchProfile',
        graphDocumentId: 'graph-document-live-proof',
        sourceKind: 'recorded',
      },
    ])
    expect(useBuildPathRuntimeStore.getState().readMasterTimeline().steps.flatMap(
      (step) => step.stepKind === 'build-event' ? [step.event.commandFamily] : [],
    )).toEqual(['Sketch', 'Extrude'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual(redoBefore)
  })

  it('renders the canonical Sketch to six Extrudes to Output topology as visible icon cards', async () => {
    const sketchNodeId = 'node-parallel-sketch'
    const outputNodeId = 'node-parallel-output'
    const extrudeNodeIds = Array.from(
      { length: 6 },
      (_, index) => `node-parallel-extrude-${index + 1}`,
    )

    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-parallel-sketch',
        affectedNodeIds: [sketchNodeId],
      }),
      ...extrudeNodeIds.map((nodeId, index) =>
        createBuildPathEvent({
          commandFamily: 'Extrude',
          eventSequence: index + 2,
          projectionId: `projection-parallel-extrude-${index + 1}`,
          affectedNodeIds: [nodeId],
        }),
      ),
    ])
    useBuildPathRuntimeStore.getState().addGraphDependencies(
      extrudeNodeIds.flatMap((nodeId, index) => [
        {
          edgeId: `edge-parallel-profile-${index + 1}`,
          fromNodeId: sketchNodeId,
          fromPortId: `SketchProfile:prof_${index + 1}`,
          toNodeId: nodeId,
          toPortId: 'ExtrusionProfile',
          connectorKind: 'sketchProfile' as const,
        },
        {
          edgeId: `edge-parallel-solid-${index + 1}`,
          fromNodeId: nodeId,
          fromPortId: 'SolidBody',
          toNodeId: outputNodeId,
          toPortId: `in:solid:s00${index + 1}`,
          connectorKind: 'solidBody' as const,
        },
      ]),
    )

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-topology-proof" hostMode="workspace" />,
      )
    })

    const parallelButton = Array.from(container?.querySelectorAll('.BuildPathWorkspaceModeButton') ?? [])
      .find((button) => button.textContent === 'Parallel') as HTMLButtonElement | undefined

    await act(async () => {
      parallelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const topologyRead = container?.querySelector('[data-build-path-topology-state]')
    const topologyCards = Array.from(container?.querySelectorAll('.BuildPathTopologyCard') ?? [])
    const sketchCards = topologyCards.filter(
      (card) => card.getAttribute('data-build-path-topology-icon') === 'sketch',
    )
    const extrudeCards = topologyCards.filter(
      (card) => card.getAttribute('data-build-path-topology-icon') === 'extrude',
    )
    const outputCards = topologyCards.filter(
      (card) => card.getAttribute('data-build-path-topology-icon') === 'output-preview',
    )
    const connectors = Array.from(
      container?.querySelectorAll('.BuildPathTopologyConnector') ?? [],
    )
    const sketchProfileConnectors = connectors.filter(
      (connector) =>
        connector.getAttribute('data-build-path-topology-connector-kind') === 'sketchProfile',
    )
    const solidBodyConnectors = connectors.filter(
      (connector) =>
        connector.getAttribute('data-build-path-topology-connector-kind') === 'solidBody',
    )
    const firstExtrudeCard = extrudeCards[0] as HTMLButtonElement | undefined

    await act(async () => {
      firstExtrudeCard?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(topologyRead?.getAttribute('data-build-path-topology-state')).toBe('ready')
    expect(topologyRead?.getAttribute('data-build-path-topology-column-count')).toBe('3')
    expect(topologyRead?.getAttribute('data-build-path-topology-node-count')).toBe('8')
    expect(topologyRead?.getAttribute('data-build-path-topology-connector-count')).toBe('12')
    expect(sketchCards).toHaveLength(1)
    expect(extrudeCards).toHaveLength(6)
    expect(outputCards).toHaveLength(1)
    expect(sketchCards[0]?.getAttribute('data-build-path-topology-column-index')).toBe('0')
    expect(outputCards[0]?.getAttribute('data-build-path-topology-column-index')).toBe('2')
    expect(extrudeCards.map((card) => card.getAttribute('data-build-path-topology-column-index')))
      .toEqual(Array.from({ length: 6 }, () => '1'))
    expect(extrudeCards.map((card) => card.getAttribute('data-build-path-topology-lane-index')))
      .toEqual(['0', '1', '2', '3', '4', '5'])
    expect(topologyRead?.getAttribute('data-build-path-topology-alignment')).toBe('center')
    expect(sketchCards[0]?.getAttribute('data-build-path-topology-temporal-state')).toBe(
      'current',
    )
    expect(extrudeCards.map((card) =>
      card.getAttribute('data-build-path-topology-temporal-state'),
    )).toEqual(Array.from({ length: 6 }, () => 'future'))
    expect(outputCards[0]?.getAttribute('data-build-path-topology-temporal-state')).toBe(
      'future',
    )
    expect((sketchCards[0] as HTMLElement | undefined)?.style.getPropertyValue(
      '--build-path-topology-row',
    )).toBe('1 / span 6')
    expect((outputCards[0] as HTMLElement | undefined)?.style.getPropertyValue(
      '--build-path-topology-row',
    )).toBe('1 / span 6')
    expect(connectors).toHaveLength(12)
    expect(sketchProfileConnectors).toHaveLength(6)
    expect(solidBodyConnectors).toHaveLength(6)
    expect(sketchProfileConnectors.map(
      (connector) => connector.getAttribute('data-build-path-topology-connector-color'),
    )).toEqual(Array.from({ length: 6 }, () => '#6ee7b7'))
    expect(solidBodyConnectors.map(
      (connector) => connector.getAttribute('data-build-path-topology-connector-color'),
    )).toEqual(Array.from({ length: 6 }, () => '#b19dff'))
    expect(connectors.map(
      (connector) => connector.getAttribute('data-build-path-topology-temporal-state'),
    )).toEqual(Array.from({ length: 12 }, () => 'future'))
    expect(firstExtrudeCard?.getAttribute('aria-pressed')).toBe('true')
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('aligns source and sink topology cards without creating Edit History entries', async () => {
    const sketchNodeId = 'node-align-sketch'
    const outputNodeId = 'node-align-output'
    const extrudeNodeIds = Array.from(
      { length: 6 },
      (_, index) => `node-align-extrude-${index + 1}`,
    )

    useBuildPathRuntimeStore.getState().resetRuntimeState([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-align-sketch',
        affectedNodeIds: [sketchNodeId],
      }),
      ...extrudeNodeIds.map((nodeId, index) =>
        createBuildPathEvent({
          commandFamily: 'Extrude',
          eventSequence: index + 2,
          projectionId: `projection-align-extrude-${index + 1}`,
          affectedNodeIds: [nodeId],
        }),
      ),
    ])
    useBuildPathRuntimeStore.getState().addGraphDependencies(
      extrudeNodeIds.flatMap((nodeId, index) => [
        {
          edgeId: `edge-align-profile-${index + 1}`,
          fromNodeId: sketchNodeId,
          fromPortId: `SketchProfile:align_${index + 1}`,
          toNodeId: nodeId,
          toPortId: 'ExtrusionProfile',
          connectorKind: 'sketchProfile' as const,
        },
        {
          edgeId: `edge-align-solid-${index + 1}`,
          fromNodeId: nodeId,
          fromPortId: 'SolidBody',
          toNodeId: outputNodeId,
          toPortId: `in:solid:a00${index + 1}`,
          connectorKind: 'solidBody' as const,
        },
      ]),
    )

    await act(async () => {
      root?.render(
        <BuildPathSurface surfaceInstanceId="build-path-topology-align-proof" hostMode="workspace" />,
      )
    })

    const parallelButton = Array.from(container?.querySelectorAll('.BuildPathWorkspaceModeButton') ?? [])
      .find((button) => button.textContent === 'Parallel') as HTMLButtonElement | undefined

    await act(async () => {
      parallelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const readTopology = () => container?.querySelector('[data-build-path-topology-state]')
    const readSourceRow = () =>
      (container?.querySelector(
        '[data-build-path-topology-icon="sketch"]',
      ) as HTMLElement | null)?.style.getPropertyValue('--build-path-topology-row')
    const readOutputRow = () =>
      (container?.querySelector(
        '[data-build-path-topology-icon="output-preview"]',
      ) as HTMLElement | null)?.style.getPropertyValue('--build-path-topology-row')
    const readExtrudeRows = () =>
      Array.from(container?.querySelectorAll('[data-build-path-topology-icon="extrude"]') ?? [])
        .map((card) =>
          (card as HTMLElement).style.getPropertyValue('--build-path-topology-row'),
        )
    const topButton = container?.querySelector(
      '[data-build-path-topology-align-control="top"]',
    ) as HTMLButtonElement | null
    const centerButton = container?.querySelector(
      '[data-build-path-topology-align-control="center"]',
    ) as HTMLButtonElement | null
    const bottomButton = container?.querySelector(
      '[data-build-path-topology-align-control="bottom"]',
    ) as HTMLButtonElement | null

    expect(readTopology()?.getAttribute('data-build-path-topology-alignment')).toBe('center')
    expect(readSourceRow()).toBe('1 / span 6')
    expect(readOutputRow()).toBe('1 / span 6')
    expect(readExtrudeRows()).toEqual(['1', '2', '3', '4', '5', '6'])

    await act(async () => {
      bottomButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(readTopology()?.getAttribute('data-build-path-topology-alignment')).toBe('bottom')
    expect(readSourceRow()).toBe('6')
    expect(readOutputRow()).toBe('6')
    expect(readExtrudeRows()).toEqual(['6', '5', '4', '3', '2', '1'])
    expect(bottomButton?.getAttribute('aria-pressed')).toBe('true')

    await act(async () => {
      topButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(readTopology()?.getAttribute('data-build-path-topology-alignment')).toBe('top')
    expect(readSourceRow()).toBe('1')
    expect(readOutputRow()).toBe('1')
    expect(readExtrudeRows()).toEqual(['1', '2', '3', '4', '5', '6'])

    await act(async () => {
      centerButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const sketchProfileConnectors = Array.from(
      container?.querySelectorAll(
        '[data-build-path-topology-connector-kind="sketchProfile"]',
      ) ?? [],
    )

    expect(readTopology()?.getAttribute('data-build-path-topology-alignment')).toBe('center')
    expect(readSourceRow()).toBe('1 / span 6')
    expect(readOutputRow()).toBe('1 / span 6')
    expect(sketchProfileConnectors.map(
      (connector) => connector.getAttribute('data-build-path-topology-connector-color'),
    )).toEqual(Array.from({ length: 6 }, () => '#6ee7b7'))
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })
})
