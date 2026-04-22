import { afterEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from '../../store/editHistoryStore'
import type { FeatureStack } from '../features/featureTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from './useSpaghettiStore'

const profileLoop = {
  segments: [],
  winding: 'CCW' as const,
}

const sketchFeatureWithProfile = (featureId: string, profileId: string): FeatureStack[number] => ({
  type: 'sketch',
  featureId,
  plane: 'XY',
  components: [],
  outputs: {
    profiles: [
      {
        profileId,
        profileIndex: 0,
        area: 1,
        loop: profileLoop,
        verticesProxy: [],
      },
    ],
  },
  uiState: {
    collapsed: false,
  },
})

const closeProfileFeature = (sourceSketchFeatureId: string | null): FeatureStack[number] => ({
  type: 'closeProfile',
  featureId: 'feature-close-1',
  inputs: {
    sourceSketchFeatureId,
  },
  outputs: {
    profileRef: null,
  },
  uiState: {
    collapsed: false,
  },
})

const extrudeFeature = (): FeatureStack[number] => ({
  type: 'extrude',
  featureId: 'feature-extrude-1',
  inputs: {
    profileRef: null,
  },
  params: {
    depth: {
      kind: 'lit',
      value: 10,
    },
    taper: {
      kind: 'lit',
      value: 0,
    },
    offset: {
      kind: 'lit',
      value: 0,
    },
  },
  outputs: {
    bodyId: 'body-1',
  },
  uiState: {
    collapsed: false,
  },
})

const graphWithFeatureStack = (stack: FeatureStack): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'part-1',
      type: 'Part/Baseplate',
      params: {
        featureStack: stack,
      },
    },
    {
      nodeId: 'utility-1',
      type: 'Utility/Output',
      params: {},
    },
  ],
  edges: [],
})

const baseStack = (): FeatureStack => [
  sketchFeatureWithProfile('feature-sketch-1', 'profile-1'),
  closeProfileFeature(null),
  extrudeFeature(),
]

const resetStores = (): void => {
  editHistoryStore.clear()
  useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
}

const featureStack = (): FeatureStack =>
  (useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'part-1')
    ?.params.featureStack ?? []) as FeatureStack

const closeProfileSource = (): string | null =>
  (featureStack().find((feature) => feature.featureId === 'feature-close-1') as
    | Extract<FeatureStack[number], { type: 'closeProfile' }>
    | undefined)?.inputs.sourceSketchFeatureId ?? null

const extrude = (): Extract<FeatureStack[number], { type: 'extrude' }> =>
  featureStack().find((feature) => feature.featureId === 'feature-extrude-1') as Extract<
    FeatureStack[number],
    { type: 'extrude' }
  >

describe('feature parameter edit history store adapters', () => {
  afterEach(() => {
    resetStores()
  })

  it('commits close-profile source selects as one undoable and redoable entry', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack(baseStack()))
    editHistoryStore.clear()

    useSpaghettiStore.getState().setCloseProfileSource(
      'part-1',
      'feature-close-1',
      'feature-sketch-1',
    )

    expect(closeProfileSource()).toBe('feature-sketch-1')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change feature parameter',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'graph-feature-parameter',
        sourceLabel: 'Graph Feature Parameter',
      },
      targetId: 'part-1:feature-close-1:source',
      targetLabel: 'Close profile source',
    })

    editHistoryStore.undo()
    expect(closeProfileSource()).toBeNull()

    editHistoryStore.redo()
    expect(closeProfileSource()).toBe('feature-sketch-1')
  })

  it('commits extrude profile-ref selects as one undoable and redoable entry', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack(baseStack()))
    editHistoryStore.clear()

    useSpaghettiStore.getState().setExtrudeProfileRef('part-1', 'feature-extrude-1', {
      sourceFeatureId: 'feature-sketch-1',
      profileId: 'profile-1',
      profileIndex: 0,
    })

    expect(extrude().inputs.profileRef).toEqual({
      sourceFeatureId: 'feature-sketch-1',
      profileId: 'profile-1',
      profileIndex: 0,
    })
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change feature parameter',
      targetId: 'part-1:feature-extrude-1:profileRef',
      targetLabel: 'Extrude profile',
    })

    editHistoryStore.undo()
    expect(extrude().inputs.profileRef).toBeNull()

    editHistoryStore.redo()
    expect(extrude().inputs.profileRef).toEqual({
      sourceFeatureId: 'feature-sketch-1',
      profileId: 'profile-1',
      profileIndex: 0,
    })
  })

  it('keeps numeric ticks history-free until one semantic commit restores final values', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack(baseStack()))
    editHistoryStore.clear()

    const beforeGraph = useSpaghettiStore.getState().graph
    useSpaghettiStore.getState().setExtrudeDepth('part-1', 'feature-extrude-1', {
      kind: 'lit',
      value: 20,
    })
    useSpaghettiStore.getState().setExtrudeDepth('part-1', 'feature-extrude-1', {
      kind: 'lit',
      value: 35,
    })

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(extrude().params.depth).toEqual({ kind: 'lit', value: 35 })

    const committed = useSpaghettiStore.getState().commitPartFeatureParameterWithHistory({
      nodeId: 'part-1',
      featureId: 'feature-extrude-1',
      beforeGraph,
      targetId: 'part-1:feature-extrude-1:depth',
      targetLabel: 'Extrude depth',
    })

    expect(committed).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change feature parameter',
      targetId: 'part-1:feature-extrude-1:depth',
      targetLabel: 'Extrude depth',
    })

    editHistoryStore.undo()
    expect(extrude().params.depth).toEqual({ kind: 'lit', value: 10 })

    editHistoryStore.redo()
    expect(extrude().params.depth).toEqual({ kind: 'lit', value: 35 })
  })

  it('does not create entries for missing, wrong-type, unchanged, or sketch-owned parameter changes', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack(baseStack()))
    editHistoryStore.clear()

    const beforeGraph = useSpaghettiStore.getState().graph
    expect(useSpaghettiStore.getState().commitPartFeatureParameterWithHistory({
      nodeId: 'missing-node',
      featureId: 'feature-extrude-1',
      beforeGraph,
    })).toBe(false)
    expect(useSpaghettiStore.getState().commitPartFeatureParameterWithHistory({
      nodeId: 'utility-1',
      featureId: 'feature-extrude-1',
      beforeGraph,
    })).toBe(false)
    expect(useSpaghettiStore.getState().commitPartFeatureParameterWithHistory({
      nodeId: 'part-1',
      featureId: 'missing-feature',
      beforeGraph,
    })).toBe(false)
    expect(useSpaghettiStore.getState().commitPartFeatureParameterWithHistory({
      nodeId: 'part-1',
      featureId: 'feature-sketch-1',
      beforeGraph,
    })).toBe(false)

    useSpaghettiStore.getState().setExtrudeDepth('part-1', 'feature-extrude-1', {
      kind: 'lit',
      value: 10,
    })
    expect(useSpaghettiStore.getState().commitPartFeatureParameterWithHistory({
      nodeId: 'part-1',
      featureId: 'feature-extrude-1',
      beforeGraph,
      targetId: 'part-1:feature-extrude-1:depth',
      targetLabel: 'Extrude depth',
    })).toBe(false)

    useSpaghettiStore.getState().setCloseProfileSource(
      'part-1',
      'feature-extrude-1',
      'feature-sketch-1',
    )
    useSpaghettiStore.getState().setExtrudeProfileRef('part-1', 'feature-close-1', {
      sourceFeatureId: 'feature-sketch-1',
      profileId: 'profile-1',
      profileIndex: 0,
    })
    useSpaghettiStore.getState().setSketchRectangleDimensions('part-1', 'feature-sketch-1', {
      width: 20,
    })

    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('restores feature parameter history without clearing unrelated view state', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack(baseStack()))
    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    editHistoryStore.clear()
    useSpaghettiStore.getState().setSelectedNodeId('utility-1')
    useSpaghettiStore.getState().setHoveredEdgeId('hovered-edge')
    useSpaghettiStore.getState().setConnectionDrag({
      anchorDirection: 'out',
      anchorNodeId: 'utility-1',
      anchorPortId: 'out',
      pointerX: 12,
      pointerY: 24,
    })
    useSpaghettiStore.getState().setUiMessage({
      level: 'info',
      text: 'preserve me',
    })

    useSpaghettiStore.getState().setExtrudeProfileRef('part-1', 'feature-extrude-1', {
      sourceFeatureId: 'feature-sketch-1',
      profileId: 'profile-1',
      profileIndex: 0,
    })

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'utility-1',
      hoveredEdgeId: 'hovered-edge',
      connectionDrag: {
        anchorNodeId: 'utility-1',
        anchorPortId: 'out',
      },
      uiMessage: {
        text: 'preserve me',
      },
    })

    editHistoryStore.undo()

    expect(extrude().inputs.profileRef).toBeNull()
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'utility-1',
      hoveredEdgeId: 'hovered-edge',
      connectionDrag: {
        anchorNodeId: 'utility-1',
        anchorPortId: 'out',
      },
      uiMessage: {
        text: 'preserve me',
      },
    })
  })
})
