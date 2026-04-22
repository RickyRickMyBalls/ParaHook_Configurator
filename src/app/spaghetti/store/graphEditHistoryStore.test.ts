import { afterEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from '../../store/editHistoryStore'
import type { GraphNodePos, SpaghettiGraph } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from './useSpaghettiStore'

const emptyGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [],
  edges: [],
}

const baseGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    { nodeId: 'node-a', type: 'Part/Baseplate', params: {} },
    { nodeId: 'node-b', type: 'Part/ToeHook', params: {} },
  ],
  edges: [
    {
      edgeId: 'edge-1',
      from: { nodeId: 'node-a', portId: 'out' },
      to: { nodeId: 'node-b', portId: 'in:drv:toeLength' },
    },
  ],
})

const autoReplaceGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    { nodeId: 'node-src-a', type: 'Part/Baseplate', params: {} },
    { nodeId: 'node-src-b', type: 'Part/Baseplate', params: {} },
    { nodeId: 'node-target', type: 'Part/ToeHook', params: {} },
  ],
  edges: [
    {
      edgeId: 'edge-existing',
      from: { nodeId: 'node-src-a', portId: 'out' },
      to: { nodeId: 'node-target', portId: 'in:drv:toeLength' },
    },
  ],
})

const graphWithUnrelatedEdge = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    { nodeId: 'node-a', type: 'Part/Baseplate', params: {} },
    { nodeId: 'node-b', type: 'Part/ToeHook', params: {} },
    { nodeId: 'node-c', type: 'Part/HeelKick', params: {} },
    { nodeId: 'node-d', type: 'Part/Baseplate', params: {} },
  ],
  edges: [
    {
      edgeId: 'edge-removed',
      from: { nodeId: 'node-a', portId: 'out' },
      to: { nodeId: 'node-b', portId: 'in:drv:toeLength' },
    },
    {
      edgeId: 'edge-unrelated',
      from: { nodeId: 'node-c', portId: 'out' },
      to: { nodeId: 'node-d', portId: 'in:drv:length' },
    },
  ],
})

const graphNodeIds = (): string[] =>
  useSpaghettiStore.getState().graph.nodes.map((node) => node.nodeId)

const graphEdgeIds = (): string[] =>
  useSpaghettiStore.getState().graph.edges.map((edge) => edge.edgeId)

const graphNodePos = (nodeId: string): GraphNodePos | undefined =>
  useSpaghettiStore.getState().graph.ui?.nodes?.[nodeId]

const graphNodeParams = (nodeId: string): Record<string, unknown> | undefined =>
  useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === nodeId)?.params

const resetStores = (): void => {
  editHistoryStore.clear()
  useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
}

describe('graph edit history store adapters', () => {
  afterEach(() => {
    resetStores()
  })

  it('commits node add as one undoable and redoable graph entry', () => {
    useSpaghettiStore.getState().setGraph(baseGraph())
    editHistoryStore.clear()

    const committed = useSpaghettiStore.getState().addGraphNodeWithHistory({
      node: {
        nodeId: 'node-c',
        type: 'Part/HeelKick',
        params: {},
      },
      position: { x: 10, y: 20 },
    })

    expect(committed).toBe(true)
    expect(graphNodeIds()).toContain('node-c')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)

    editHistoryStore.undo()
    expect(graphNodeIds()).not.toContain('node-c')

    editHistoryStore.redo()
    expect(graphNodeIds()).toContain('node-c')
  })

  it('commits node remove with related edges as one restorable graph entry', () => {
    useSpaghettiStore.getState().setGraph(baseGraph())
    editHistoryStore.clear()

    const committed = useSpaghettiStore.getState().removeGraphNodeWithHistory('node-a')

    expect(committed).toBe(true)
    expect(graphNodeIds()).not.toContain('node-a')
    expect(graphEdgeIds()).toEqual([])

    editHistoryStore.undo()
    expect(graphNodeIds()).toContain('node-a')
    expect(graphEdgeIds()).toContain('edge-1')

    editHistoryStore.redo()
    expect(graphNodeIds()).not.toContain('node-a')
    expect(graphEdgeIds()).toEqual([])
  })

  it('commits wire connect as one undoable and redoable graph entry', () => {
    useSpaghettiStore.getState().setGraph({
      ...baseGraph(),
      edges: [],
    })
    editHistoryStore.clear()

    const committed = useSpaghettiStore.getState().connectGraphEdgeWithHistory({
      edgeId: 'edge-new',
      from: { nodeId: 'node-a', portId: 'out' },
      to: { nodeId: 'node-b', portId: 'in:drv:toeLength' },
    })

    expect(committed).toBe(true)
    expect(graphEdgeIds()).toEqual(['edge-new'])

    editHistoryStore.undo()
    expect(graphEdgeIds()).toEqual([])

    editHistoryStore.redo()
    expect(graphEdgeIds()).toEqual(['edge-new'])
  })

  it('commits wire remove as one restorable graph entry', () => {
    useSpaghettiStore.getState().setGraph(baseGraph())
    editHistoryStore.clear()

    const committed = useSpaghettiStore.getState().removeGraphEdgeWithHistory('edge-1')

    expect(committed).toBe(true)
    expect(graphEdgeIds()).toEqual([])

    editHistoryStore.undo()
    expect(graphEdgeIds()).toEqual(['edge-1'])

    editHistoryStore.redo()
    expect(graphEdgeIds()).toEqual([])
  })

  it('restores deterministic auto-replace wire connect snapshots', () => {
    useSpaghettiStore.getState().setGraph(autoReplaceGraph())
    editHistoryStore.clear()

    const committed = useSpaghettiStore.getState().connectGraphEdgeWithHistory({
      edgeId: 'edge-new',
      from: { nodeId: 'node-src-b', portId: 'out' },
      to: { nodeId: 'node-target', portId: 'in:drv:toeLength' },
    })

    expect(committed).toBe(true)
    expect(graphEdgeIds()).toEqual(['edge-new'])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)

    editHistoryStore.undo()
    expect(graphEdgeIds()).toEqual(['edge-existing'])

    editHistoryStore.redo()
    expect(graphEdgeIds()).toEqual(['edge-new'])
  })

  it('commits completed node movement as one undoable and redoable graph entry', () => {
    useSpaghettiStore.getState().setGraph({
      ...baseGraph(),
      ui: {
        nodes: {
          'node-a': { x: 10, y: 20 },
          'node-b': { x: 300, y: 20 },
        },
      },
    })
    editHistoryStore.clear()

    useSpaghettiStore.getState().setManyNodePos([
      { nodeId: 'node-a', x: 20, y: 30 },
    ])
    useSpaghettiStore.getState().setManyNodePos([
      { nodeId: 'node-a', x: 40.2, y: 50.7 },
    ])

    expect(graphNodePos('node-a')).toEqual({ x: 40, y: 51 })
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    const committed = useSpaghettiStore.getState().commitGraphNodeMoveWithHistory({
      nodeId: 'node-a',
      from: { x: 10, y: 20 },
      to: { x: 40.2, y: 50.7 },
    })

    expect(committed).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Move graph node',
      targetId: 'node-a',
      targetLabel: 'node-a',
    })

    editHistoryStore.undo()
    expect(graphNodePos('node-a')).toEqual({ x: 10, y: 20 })

    editHistoryStore.redo()
    expect(graphNodePos('node-a')).toEqual({ x: 40, y: 51 })
  })

  it('commits graph node parameter changes as one undoable and redoable entry', () => {
    useSpaghettiStore.getState().setGraph({
      ...baseGraph(),
      nodes: [
        { nodeId: 'node-a', type: 'Part/Baseplate', params: { widthMm: 40, lengthMm: 100 } },
        { nodeId: 'node-b', type: 'Part/ToeHook', params: {} },
      ],
    })
    editHistoryStore.clear()

    const beforeGraph = useSpaghettiStore.getState().graph
    useSpaghettiStore.getState().applyGraphPatch((graph) => ({
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.nodeId === 'node-a'
          ? { ...node, params: { ...node.params, widthMm: 55 } }
          : node,
      ),
    }))
    useSpaghettiStore.getState().applyGraphPatch((graph) => ({
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.nodeId === 'node-a'
          ? { ...node, params: { ...node.params, widthMm: 75 } }
          : node,
      ),
    }))

    expect(editHistoryStore.getUndoEntries()).toEqual([])

    const committed = useSpaghettiStore.getState().commitGraphNodeParameterWithHistory({
      nodeId: 'node-a',
      beforeGraph,
      targetId: 'node-a:widthMm',
      targetLabel: 'Width',
    })

    expect(committed).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change graph parameter',
      targetId: 'node-a:widthMm',
      targetLabel: 'Width',
    })
    expect(graphNodeParams('node-a')).toEqual({ widthMm: 75, lengthMm: 100 })

    editHistoryStore.undo()
    expect(graphNodeParams('node-a')).toEqual({ widthMm: 40, lengthMm: 100 })

    editHistoryStore.redo()
    expect(graphNodeParams('node-a')).toEqual({ widthMm: 75, lengthMm: 100 })
  })

  it('does not create entries for unchanged or missing graph node parameter commits', () => {
    useSpaghettiStore.getState().setGraph({
      ...baseGraph(),
      nodes: [
        { nodeId: 'node-a', type: 'Part/Baseplate', params: { widthMm: 40 } },
        { nodeId: 'node-b', type: 'Part/ToeHook', params: {} },
      ],
    })
    editHistoryStore.clear()

    const beforeGraph = useSpaghettiStore.getState().graph

    expect(useSpaghettiStore.getState().commitGraphNodeParameterWithHistory({
      nodeId: 'node-a',
      beforeGraph,
      targetId: 'node-a:widthMm',
      targetLabel: 'Width',
    })).toBe(false)
    expect(useSpaghettiStore.getState().commitGraphNodeParameterWithHistory({
      nodeId: 'missing-node',
      beforeGraph,
      targetId: 'missing-node:widthMm',
      targetLabel: 'Width',
    })).toBe(false)

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(graphNodeParams('node-a')).toEqual({ widthMm: 40 })
  })

  it('does not create entries for missing or unchanged node movement commits', () => {
    useSpaghettiStore.getState().setGraph({
      ...baseGraph(),
      ui: {
        nodes: {
          'node-a': { x: 10, y: 20 },
          'node-b': { x: 300, y: 20 },
        },
      },
    })
    editHistoryStore.clear()

    useSpaghettiStore.getState().setManyNodePos([
      { nodeId: 'node-a', x: 10.1, y: 20.2 },
    ])

    expect(useSpaghettiStore.getState().commitGraphNodeMoveWithHistory({
      nodeId: 'missing-node',
      from: { x: 0, y: 0 },
      to: { x: 50, y: 50 },
    })).toBe(false)
    expect(useSpaghettiStore.getState().commitGraphNodeMoveWithHistory({
      nodeId: 'node-a',
      from: { x: 10.1, y: 20.2 },
      to: { x: 10.4, y: 20.4 },
    })).toBe(false)

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(graphNodePos('node-a')).toEqual({ x: 10, y: 20 })
  })

  it('does not create entries for no-op graph structure mutations', () => {
    useSpaghettiStore.getState().setGraph(baseGraph())
    editHistoryStore.clear()

    expect(useSpaghettiStore.getState().addGraphNodeWithHistory({
      node: {
        nodeId: 'node-a',
        type: 'Part/Baseplate',
        params: {},
      },
    })).toBe(false)
    expect(useSpaghettiStore.getState().removeGraphNodeWithHistory('missing-node')).toBe(false)
    expect(useSpaghettiStore.getState().connectGraphEdgeWithHistory({
      edgeId: 'edge-duplicate',
      from: { nodeId: 'node-a', portId: 'out' },
      to: { nodeId: 'node-b', portId: 'in:drv:toeLength' },
    })).toBe(false)
    expect(useSpaghettiStore.getState().removeGraphEdgeWithHistory('missing-edge')).toBe(false)

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(graphNodeIds()).toContain('node-a')
    expect(graphEdgeIds()).toEqual(['edge-1'])
  })

  it('keeps direct store edge APIs canonical and no-op safe', () => {
    useSpaghettiStore.getState().setGraph({
      ...baseGraph(),
      edges: [],
    })
    editHistoryStore.clear()

    useSpaghettiStore.getState().addEdge({
      edgeId: 'edge-direct',
      from: { nodeId: 'node-a', portId: 'out' },
      to: { nodeId: 'node-b', portId: 'in:drv:toeLength' },
    })
    useSpaghettiStore.getState().addEdge({
      edgeId: 'edge-direct',
      from: { nodeId: 'node-a', portId: 'out' },
      to: { nodeId: 'node-b', portId: 'in:drv:toeLength' },
    })

    expect(graphEdgeIds()).toEqual(['edge-direct'])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)

    useSpaghettiStore.getState().removeEdge('edge-direct')
    useSpaghettiStore.getState().removeEdge('edge-direct')

    expect(graphEdgeIds()).toEqual([])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(2)
  })

  it('applies graph-history mutations without clearing unrelated view state', () => {
    useSpaghettiStore.getState().setGraph(graphWithUnrelatedEdge())
    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    editHistoryStore.clear()
    useSpaghettiStore.getState().insertEdgeWaypoint('edge-removed', 1, 2)
    useSpaghettiStore.getState().insertEdgeWaypoint('edge-unrelated', 3, 4)
    useSpaghettiStore.getState().setSelectedNodeId('node-c')
    useSpaghettiStore.getState().setSelectedEdgeId('edge-unrelated')
    useSpaghettiStore.getState().setHoveredEdgeId('edge-unrelated')
    useSpaghettiStore.getState().setConnectionDrag({
      anchorDirection: 'out',
      anchorNodeId: 'node-c',
      anchorPortId: 'out',
      pointerX: 12,
      pointerY: 24,
    })
    useSpaghettiStore.getState().setUiMessage({
      level: 'info',
      text: 'preserve me',
    })

    const committed = useSpaghettiStore.getState().removeGraphEdgeWithHistory('edge-removed')

    expect(committed).toBe(true)
    expect(graphEdgeIds()).toEqual(['edge-unrelated'])
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'node-c',
      selectedEdgeId: 'edge-unrelated',
      hoveredEdgeId: 'edge-unrelated',
      connectionDrag: {
        anchorNodeId: 'node-c',
        anchorPortId: 'out',
      },
      uiMessage: {
        text: 'preserve me',
      },
    })
    expect(Object.keys(useSpaghettiStore.getState().edgeWaypoints)).toEqual(['edge-unrelated'])

    editHistoryStore.undo()

    expect(graphEdgeIds()).toEqual(['edge-removed', 'edge-unrelated'])
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'node-c',
      selectedEdgeId: 'edge-unrelated',
      hoveredEdgeId: 'edge-unrelated',
      uiMessage: {
        text: 'preserve me',
      },
    })
    expect(Object.keys(useSpaghettiStore.getState().edgeWaypoints)).toEqual(['edge-unrelated'])
  })

  it('applies node movement history without clearing unrelated view state', () => {
    useSpaghettiStore.getState().setGraph({
      ...graphWithUnrelatedEdge(),
      ui: {
        nodes: {
          'node-a': { x: 10, y: 20 },
          'node-b': { x: 300, y: 20 },
          'node-c': { x: 10, y: 200 },
          'node-d': { x: 300, y: 200 },
        },
      },
    })
    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    editHistoryStore.clear()
    useSpaghettiStore.getState().insertEdgeWaypoint('edge-unrelated', 3, 4)
    useSpaghettiStore.getState().setSelectedNodeId('node-c')
    useSpaghettiStore.getState().setSelectedEdgeId('edge-unrelated')
    useSpaghettiStore.getState().setHoveredEdgeId('edge-unrelated')
    useSpaghettiStore.getState().setConnectionDrag({
      anchorDirection: 'out',
      anchorNodeId: 'node-c',
      anchorPortId: 'out',
      pointerX: 12,
      pointerY: 24,
    })
    useSpaghettiStore.getState().setUiMessage({
      level: 'info',
      text: 'preserve me',
    })

    const committed = useSpaghettiStore.getState().commitGraphNodeMoveWithHistory({
      nodeId: 'node-a',
      from: { x: 10, y: 20 },
      to: { x: 80.2, y: 90.7 },
    })

    expect(committed).toBe(true)
    expect(graphNodePos('node-a')).toEqual({ x: 80, y: 91 })
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'node-c',
      selectedEdgeId: 'edge-unrelated',
      hoveredEdgeId: 'edge-unrelated',
      connectionDrag: {
        anchorNodeId: 'node-c',
        anchorPortId: 'out',
      },
      uiMessage: {
        text: 'preserve me',
      },
    })
    expect(Object.keys(useSpaghettiStore.getState().edgeWaypoints)).toEqual(['edge-unrelated'])

    editHistoryStore.undo()

    expect(graphNodePos('node-a')).toEqual({ x: 10, y: 20 })
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'node-c',
      selectedEdgeId: 'edge-unrelated',
      hoveredEdgeId: 'edge-unrelated',
      uiMessage: {
        text: 'preserve me',
      },
    })
    expect(Object.keys(useSpaghettiStore.getState().edgeWaypoints)).toEqual(['edge-unrelated'])
  })

  it('applies graph parameter history without clearing unrelated view state', () => {
    useSpaghettiStore.getState().setGraph({
      ...graphWithUnrelatedEdge(),
      nodes: graphWithUnrelatedEdge().nodes.map((node) =>
        node.nodeId === 'node-a'
          ? { ...node, params: { widthMm: 40, lengthMm: 100 } }
          : node,
      ),
    })
    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    editHistoryStore.clear()
    useSpaghettiStore.getState().insertEdgeWaypoint('edge-unrelated', 3, 4)
    useSpaghettiStore.getState().setSelectedNodeId('node-c')
    useSpaghettiStore.getState().setSelectedEdgeId('edge-unrelated')
    useSpaghettiStore.getState().setHoveredEdgeId('edge-unrelated')
    useSpaghettiStore.getState().setConnectionDrag({
      anchorDirection: 'out',
      anchorNodeId: 'node-c',
      anchorPortId: 'out',
      pointerX: 12,
      pointerY: 24,
    })
    useSpaghettiStore.getState().setUiMessage({
      level: 'info',
      text: 'preserve me',
    })

    const beforeGraph = useSpaghettiStore.getState().graph
    useSpaghettiStore.getState().applyGraphPatch((graph) => ({
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.nodeId === 'node-a'
          ? { ...node, params: { ...node.params, widthMm: 80 } }
          : node,
      ),
    }))

    const committed = useSpaghettiStore.getState().commitGraphNodeParameterWithHistory({
      nodeId: 'node-a',
      beforeGraph,
      targetId: 'node-a:widthMm',
      targetLabel: 'Width',
    })

    expect(committed).toBe(true)
    expect(graphNodeParams('node-a')).toEqual({ widthMm: 80, lengthMm: 100 })
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'node-c',
      selectedEdgeId: 'edge-unrelated',
      hoveredEdgeId: 'edge-unrelated',
      connectionDrag: {
        anchorNodeId: 'node-c',
        anchorPortId: 'out',
      },
      uiMessage: {
        text: 'preserve me',
      },
    })
    expect(Object.keys(useSpaghettiStore.getState().edgeWaypoints)).toEqual(['edge-unrelated'])

    editHistoryStore.undo()

    expect(graphNodeParams('node-a')).toEqual({ widthMm: 40, lengthMm: 100 })
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'node-c',
      selectedEdgeId: 'edge-unrelated',
      hoveredEdgeId: 'edge-unrelated',
      uiMessage: {
        text: 'preserve me',
      },
    })
    expect(Object.keys(useSpaghettiStore.getState().edgeWaypoints)).toEqual(['edge-unrelated'])
  })

  it('keeps direct removeEdge no broader while preserving unrelated state and waypoints', () => {
    useSpaghettiStore.getState().setGraph(graphWithUnrelatedEdge())
    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    editHistoryStore.clear()
    useSpaghettiStore.getState().insertEdgeWaypoint('edge-removed', 1, 2)
    useSpaghettiStore.getState().insertEdgeWaypoint('edge-unrelated', 3, 4)
    useSpaghettiStore.getState().setSelectedNodeId('node-c')
    useSpaghettiStore.getState().setSelectedEdgeId('edge-removed')
    useSpaghettiStore.getState().setHoveredEdgeId('edge-removed')
    useSpaghettiStore.getState().setConnectionDrag({
      anchorDirection: 'out',
      anchorNodeId: 'node-c',
      anchorPortId: 'out',
      pointerX: 12,
      pointerY: 24,
    })
    useSpaghettiStore.getState().setUiMessage({
      level: 'info',
      text: 'preserve me',
    })

    useSpaghettiStore.getState().removeEdge('edge-removed')

    expect(graphEdgeIds()).toEqual(['edge-unrelated'])
    expect(useSpaghettiStore.getState()).toMatchObject({
      selectedNodeId: 'node-c',
      selectedEdgeId: null,
      hoveredEdgeId: null,
      connectionDrag: {
        anchorNodeId: 'node-c',
        anchorPortId: 'out',
      },
      uiMessage: {
        text: 'preserve me',
      },
    })
    expect(Object.keys(useSpaghettiStore.getState().edgeWaypoints)).toEqual(['edge-unrelated'])
  })

  it('resets cleanly back to the initial graph', () => {
    useSpaghettiStore.getState().setGraph(emptyGraph)
    editHistoryStore.clear()

    expect(graphEdgeIds()).toEqual([])
  })
})
