import { afterEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from '../../store/editHistoryStore'
import type { FeatureStack } from '../features/featureTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from './useSpaghettiStore'

const emptyPartGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'part-1',
      type: 'Part/Baseplate',
      params: {
        featureStack: [],
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

const sketchFeature = (featureId: string): FeatureStack[number] => ({
  type: 'sketch',
  featureId,
  plane: 'XY',
  components: [],
  outputs: {
    profiles: [],
  },
  uiState: {
    collapsed: false,
  },
})

const sketchFeatureWithProfile = (featureId: string): FeatureStack[number] => ({
  type: 'sketch',
  featureId,
  plane: 'XY',
  components: [],
  outputs: {
    profiles: [
      {
        profileId: 'profile-1',
        profileIndex: 0,
        area: 1,
        loop: {
          segments: [],
          winding: 'CCW',
        },
        verticesProxy: [],
      },
    ],
  },
  uiState: {
    collapsed: false,
  },
})

const extrudeFeature = (featureId: string): FeatureStack[number] => ({
  type: 'extrude',
  featureId,
  inputs: {
    profileRef: {
      sourceFeatureId: 'feature-sketch-1',
      profileId: 'profile-1',
      profileIndex: 0,
    },
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
  ...emptyPartGraph(),
  nodes: emptyPartGraph().nodes.map((node) =>
    node.nodeId === 'part-1'
      ? {
          ...node,
          params: {
            ...node.params,
            featureStack: stack,
          },
        }
      : node,
  ),
})

const resetStores = (): void => {
  editHistoryStore.clear()
  useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
}

const featureStack = (nodeId = 'part-1'): FeatureStack =>
  (useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === nodeId)
    ?.params.featureStack ?? []) as FeatureStack

const featureIds = (): string[] => featureStack().map((feature) => feature.featureId)

const featureTypes = (): string[] => featureStack().map((feature) => feature.type)

describe('feature stack edit history store adapters', () => {
  afterEach(() => {
    resetStores()
  })

  it('commits supported feature adds as undoable and redoable entries', () => {
    const cases: Array<{
      add: () => void
      expectedType: string
      targetLabel: string
    }> = [
      {
        add: () => useSpaghettiStore.getState().addSketchFeature('part-1'),
        expectedType: 'sketch',
        targetLabel: 'Sketch feature',
      },
      {
        add: () => useSpaghettiStore.getState().addCloseProfileFeature('part-1'),
        expectedType: 'closeProfile',
        targetLabel: 'Close profile feature',
      },
      {
        add: () => useSpaghettiStore.getState().addExtrudeFeature('part-1'),
        expectedType: 'extrude',
        targetLabel: 'Extrude feature',
      },
    ]

    for (const entryCase of cases) {
      resetStores()
      useSpaghettiStore.getState().setGraph(emptyPartGraph())
      editHistoryStore.clear()

      entryCase.add()

      expect(featureTypes()).toEqual([entryCase.expectedType])
      expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
      expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
        label: 'Add feature',
        source: {
          surface: 'spaghetti-graph',
          sourceId: 'graph-feature-stack',
          sourceLabel: 'Graph Feature Stack',
        },
        targetId: 'part-1',
        targetLabel: entryCase.targetLabel,
      })

      const addedFeatureIds = featureIds()
      editHistoryStore.undo()
      expect(featureStack()).toEqual([])

      editHistoryStore.redo()
      expect(featureIds()).toEqual(addedFeatureIds)
      expect(featureTypes()).toEqual([entryCase.expectedType])
    }
  })

  it('commits dependency-safe feature reorder up and down as undoable and redoable entries', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([
      sketchFeature('feature-sketch-1'),
      sketchFeature('feature-sketch-2'),
    ]))
    editHistoryStore.clear()

    useSpaghettiStore.getState().moveFeatureUp('part-1', 'feature-sketch-2')

    expect(featureIds()).toEqual(['feature-sketch-2', 'feature-sketch-1'])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Reorder feature',
      targetId: 'feature-sketch-2',
      targetLabel: 'feature-sketch-2',
    })

    editHistoryStore.undo()
    expect(featureIds()).toEqual(['feature-sketch-1', 'feature-sketch-2'])

    editHistoryStore.redo()
    expect(featureIds()).toEqual(['feature-sketch-2', 'feature-sketch-1'])

    editHistoryStore.clear()
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([
      sketchFeature('feature-sketch-1'),
      sketchFeature('feature-sketch-2'),
    ]))

    useSpaghettiStore.getState().moveFeatureDown('part-1', 'feature-sketch-1')

    expect(featureIds()).toEqual(['feature-sketch-2', 'feature-sketch-1'])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)

    editHistoryStore.undo()
    expect(featureIds()).toEqual(['feature-sketch-1', 'feature-sketch-2'])
  })

  it('does not create entries for unsupported or no-op feature stack mutations', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([
      sketchFeatureWithProfile('feature-sketch-1'),
      extrudeFeature('feature-extrude-1'),
    ]))
    editHistoryStore.clear()

    useSpaghettiStore.getState().addSketchFeature('missing-node')
    useSpaghettiStore.getState().addSketchFeature('utility-1')
    useSpaghettiStore.getState().moveFeatureUp('part-1', 'missing-feature')
    useSpaghettiStore.getState().moveFeatureUp('part-1', 'feature-sketch-1')
    useSpaghettiStore.getState().moveFeatureUp('part-1', 'feature-extrude-1')

    expect(featureIds()).toEqual(['feature-sketch-1', 'feature-extrude-1'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('does not route feature collapse state through canonical history', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([
      sketchFeature('feature-sketch-1'),
    ]))
    editHistoryStore.clear()

    useSpaghettiStore.getState().toggleFeatureCollapsed('part-1', 'feature-sketch-1')

    expect(featureStack()[0]?.uiState.collapsed).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('restores feature stack history without clearing unrelated view state', () => {
    useSpaghettiStore.getState().setGraph(emptyPartGraph())
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

    useSpaghettiStore.getState().addSketchFeature('part-1')

    expect(featureTypes()).toEqual(['sketch'])
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

    expect(featureStack()).toEqual([])
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
