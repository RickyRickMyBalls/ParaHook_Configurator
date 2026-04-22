import { afterEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from '../../store/editHistoryStore'
import type { FeatureStack, SketchComponent } from '../features/featureTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from './useSpaghettiStore'

const point = (x: number, y: number) => ({ kind: 'lit' as const, x, y })

const line = (
  rowId: string,
  a = point(0, 0),
  b = point(100, 0),
): Extract<SketchComponent, { type: 'line' }> => ({
  rowId,
  componentId: `component-${rowId}`,
  type: 'line',
  a,
  b,
})

const sketchFeature = (
  featureId = 'feature-sketch-1',
  components: SketchComponent[] = [],
): Extract<FeatureStack[number], { type: 'sketch' }> => ({
  type: 'sketch',
  featureId,
  plane: 'XY',
  components,
  outputs: {
    profiles: [],
    diagnostics: [],
  },
  uiState: {
    collapsed: false,
  },
})

const closeProfileFeature = (): FeatureStack[number] => ({
  type: 'closeProfile',
  featureId: 'feature-close-1',
  inputs: {
    sourceSketchFeatureId: null,
  },
  outputs: {
    profileRef: null,
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

const resetStores = (): void => {
  editHistoryStore.clear()
  useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
}

const featureStack = (nodeId = 'part-1'): FeatureStack =>
  (useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === nodeId)
    ?.params.featureStack ?? []) as FeatureStack

const sketch = (
  featureId = 'feature-sketch-1',
): Extract<FeatureStack[number], { type: 'sketch' }> =>
  featureStack().find((feature) => feature.featureId === featureId) as Extract<
    FeatureStack[number],
    { type: 'sketch' }
  >

const componentRowIds = (): string[] => sketch().components.map((component) => component.rowId)

const firstLine = (): Extract<SketchComponent, { type: 'line' }> =>
  sketch().components[0] as Extract<SketchComponent, { type: 'line' }>

const cubeRectangleFeature = (): Extract<FeatureStack[number], { type: 'sketch' }> =>
  sketchFeature('cube-sketch-1', [
    line('top', point(0, 0), point(100, 0)),
    line('right', point(100, 0), point(100, 60)),
    line('bottom', point(100, 60), point(0, 60)),
    line('left', point(0, 60), point(0, 0)),
  ])

describe('sketch edit history store adapters', () => {
  afterEach(() => {
    resetStores()
  })

  it('commits sketch component add as one undoable and redoable entry', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([sketchFeature()]))
    editHistoryStore.clear()

    useSpaghettiStore.getState().addSketchComponent('part-1', 'feature-sketch-1', 'line')

    expect(sketch().components).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Add sketch component',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'graph-sketch-feature',
        sourceLabel: 'Graph Sketch Feature',
      },
      targetId: 'part-1:feature-sketch-1:components',
      targetLabel: 'Sketch component',
    })

    const addedRowId = sketch().components[0]?.rowId
    editHistoryStore.undo()
    expect(sketch().components).toEqual([])

    editHistoryStore.redo()
    expect(sketch().components.map((component) => component.rowId)).toEqual([addedRowId])
  })

  it('commits sketch component point ticks only when a semantic interaction commits', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([
      sketchFeature('feature-sketch-1', [line('line-1')]),
    ]))
    editHistoryStore.clear()

    const beforeGraph = useSpaghettiStore.getState().graph
    useSpaghettiStore.getState().updateSketchComponentPoint(
      'part-1',
      'feature-sketch-1',
      'line-1',
      'b',
      point(125, 0),
    )
    useSpaghettiStore.getState().updateSketchComponentPoint(
      'part-1',
      'feature-sketch-1',
      'line-1',
      'b',
      point(150, 25),
    )

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(firstLine().b).toEqual(point(150, 25))

    const committed = useSpaghettiStore.getState().commitPartSketchFeatureWithHistory({
      nodeId: 'part-1',
      featureId: 'feature-sketch-1',
      beforeGraph,
      label: 'Change sketch component',
      targetId: 'part-1:feature-sketch-1:line-1:b',
      targetLabel: 'Sketch point',
    })

    expect(committed).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change sketch component',
      targetId: 'part-1:feature-sketch-1:line-1:b',
      targetLabel: 'Sketch point',
    })

    editHistoryStore.undo()
    expect(firstLine().b).toEqual(point(100, 0))

    editHistoryStore.redo()
    expect(firstLine().b).toEqual(point(150, 25))
  })

  it('commits sketch component reorder and delete as undoable and redoable entries', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([
      sketchFeature('feature-sketch-1', [
        line('line-1'),
        line('line-2', point(0, 10), point(100, 10)),
      ]),
    ]))
    editHistoryStore.clear()

    useSpaghettiStore.getState().moveSketchComponentDown('part-1', 'feature-sketch-1', 'line-1')

    expect(componentRowIds()).toEqual(['line-2', 'line-1'])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Reorder sketch component',
      targetId: 'part-1:feature-sketch-1:line-1',
    })

    editHistoryStore.undo()
    expect(componentRowIds()).toEqual(['line-1', 'line-2'])

    editHistoryStore.redo()
    expect(componentRowIds()).toEqual(['line-2', 'line-1'])

    editHistoryStore.clear()
    useSpaghettiStore.getState().removeSketchComponent('part-1', 'feature-sketch-1', 'line-2')

    expect(componentRowIds()).toEqual(['line-1'])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Remove sketch component',
      targetId: 'part-1:feature-sketch-1:line-2',
    })

    editHistoryStore.undo()
    expect(componentRowIds()).toEqual(['line-2', 'line-1'])
  })

  it('commits cube-seed rectangle dimension ticks only when interaction commits', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([cubeRectangleFeature()]))
    editHistoryStore.clear()

    const beforeGraph = useSpaghettiStore.getState().graph
    useSpaghettiStore.getState().setSketchRectangleDimensions('part-1', 'cube-sketch-1', {
      width: 80,
    })
    useSpaghettiStore.getState().setSketchRectangleDimensions('part-1', 'cube-sketch-1', {
      length: 140,
    })

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(sketch('cube-sketch-1').components[0]).toMatchObject({ b: point(140, 0) })
    expect(sketch('cube-sketch-1').components[1]).toMatchObject({ b: point(140, 80) })

    expect(useSpaghettiStore.getState().commitPartSketchFeatureWithHistory({
      nodeId: 'part-1',
      featureId: 'cube-sketch-1',
      beforeGraph,
      label: 'Change sketch dimensions',
      targetId: 'part-1:cube-sketch-1:dimensions',
      targetLabel: 'Sketch dimensions',
    })).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change sketch dimensions',
      targetId: 'part-1:cube-sketch-1:dimensions',
    })

    editHistoryStore.undo()
    expect(sketch('cube-sketch-1').components[0]).toMatchObject({ b: point(100, 0) })
    expect(sketch('cube-sketch-1').components[1]).toMatchObject({ b: point(100, 60) })

    editHistoryStore.redo()
    expect(sketch('cube-sketch-1').components[0]).toMatchObject({ b: point(140, 0) })
    expect(sketch('cube-sketch-1').components[1]).toMatchObject({ b: point(140, 80) })
  })

  it('does not create entries for missing, wrong-target, unchanged, or no-op sketch changes', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([
      sketchFeature('feature-sketch-1', [line('line-1')]),
      closeProfileFeature(),
    ]))
    editHistoryStore.clear()

    useSpaghettiStore.getState().addSketchComponent('missing-node', 'feature-sketch-1', 'line')
    useSpaghettiStore.getState().addSketchComponent('utility-1', 'feature-sketch-1', 'line')
    useSpaghettiStore.getState().addSketchComponent('part-1', 'missing-feature', 'line')
    useSpaghettiStore.getState().addSketchComponent('part-1', 'feature-close-1', 'line')
    useSpaghettiStore.getState().moveSketchComponentUp('part-1', 'feature-sketch-1', 'line-1')
    useSpaghettiStore.getState().moveSketchComponentDown('part-1', 'feature-sketch-1', 'missing-row')
    useSpaghettiStore.getState().removeSketchComponent('part-1', 'feature-sketch-1', 'missing-row')

    expect(useSpaghettiStore.getState().commitPartSketchFeatureWithHistory({
      nodeId: 'part-1',
      featureId: 'feature-sketch-1',
      beforeGraph: useSpaghettiStore.getState().graph,
    })).toBe(false)
    const beforeGraph = useSpaghettiStore.getState().graph
    useSpaghettiStore.getState().setSketchRectangleDimensions('part-1', 'feature-sketch-1', {
      width: 80,
    })
    expect(useSpaghettiStore.getState().commitPartSketchFeatureWithHistory({
      nodeId: 'missing-node',
      featureId: 'feature-sketch-1',
      beforeGraph,
    })).toBe(false)
    expect(useSpaghettiStore.getState().commitPartSketchFeatureWithHistory({
      nodeId: 'utility-1',
      featureId: 'feature-sketch-1',
      beforeGraph,
    })).toBe(false)
    expect(useSpaghettiStore.getState().commitPartSketchFeatureWithHistory({
      nodeId: 'part-1',
      featureId: 'feature-close-1',
      beforeGraph,
    })).toBe(false)

    expect(componentRowIds()).toEqual(['line-1'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('restores sketch history without clearing unrelated view state', () => {
    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([sketchFeature()]))
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

    useSpaghettiStore.getState().addSketchComponent('part-1', 'feature-sketch-1', 'line')

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

    expect(sketch().components).toEqual([])
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
