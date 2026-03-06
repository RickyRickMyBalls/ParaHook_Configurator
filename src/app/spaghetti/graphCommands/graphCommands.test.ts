import { afterEach, describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { useSpaghettiStore } from '../store/useSpaghettiStore'
import { addEdge } from './addEdge'
import { addNode } from './addNode'
import {
  connectEdgeWithAutoReplace,
  planConnectEdgeWithAutoReplace,
} from './connectEdgeWithAutoReplace'
import { removeEdge } from './removeEdge'
import { removeNode } from './removeNode'

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
      from: { nodeId: 'node-a', portId: 'length' },
      to: { nodeId: 'node-b', portId: 'toeLength' },
    },
  ],
})

describe('graphCommands', () => {
  afterEach(() => {
    useSpaghettiStore.getState().setGraph(emptyGraph)
  })

  it('addNode inserts a node and position immutably', () => {
    const graph = baseGraph()
    const command = addNode({
      node: {
        nodeId: 'node-c',
        type: 'Part/HeelKick',
        params: {},
      },
      position: { x: 10.2, y: 30.7 },
    })
    const next = command(graph)

    expect(next).not.toBe(graph)
    expect(next.nodes.some((node) => node.nodeId === 'node-c')).toBe(true)
    expect(next.ui?.nodes?.['node-c']).toEqual({ x: 10, y: 31 })
    expect(graph.ui).toBeUndefined()
  })

  it('removeNode removes the node and related edges', () => {
    const graph = baseGraph()
    const next = removeNode('node-a')(graph)

    expect(next.nodes.map((node) => node.nodeId)).toEqual(['node-b'])
    expect(next.edges).toEqual([])
  })

  it('addEdge and removeEdge are deterministic and id-safe', () => {
    const graph = baseGraph()
    const edge = {
      edgeId: 'edge-2',
      from: { nodeId: 'node-b', portId: 'toeLoft' },
      to: { nodeId: 'node-a', portId: 'in' },
    } as const

    const withEdge1 = addEdge(edge)(graph)
    const withEdge2 = addEdge(edge)(graph)
    expect(withEdge1).toEqual(withEdge2)
    expect(withEdge1.edges).toHaveLength(2)

    const deduped = addEdge(edge)(withEdge1)
    expect(deduped).toBe(withEdge1)

    const removed1 = removeEdge('edge-2')(withEdge1)
    const removed2 = removeEdge('edge-2')(withEdge1)
    expect(removed1).toEqual(removed2)
    expect(removed1.edges.map((item) => item.edgeId)).toEqual(['edge-1'])
  })

  it('connectEdgeWithAutoReplace replaces prior driver input edge and is deterministic', () => {
    const graph: SpaghettiGraph = {
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
    }

    const options = {
      edgeId: 'edge-new',
      from: { nodeId: 'node-src-b', portId: 'out' },
      to: { nodeId: 'node-target', portId: 'in:drv:toeLength' },
    } as const
    const plan1 = planConnectEdgeWithAutoReplace(graph, options)
    const plan2 = planConnectEdgeWithAutoReplace(graph, options)
    expect(plan1).toEqual(plan2)
    expect(plan1.kind).toBe('insert')
    expect(plan1.removedEdgeIds).toEqual(['edge-existing'])

    const next = connectEdgeWithAutoReplace(options)(graph)
    expect(next.edges).toEqual([
      {
        edgeId: 'edge-new',
        from: { nodeId: 'node-src-b', portId: 'out' },
        to: { nodeId: 'node-target', portId: 'in:drv:toeLength' },
      },
    ])
  })

  it('OutputPreview remains non-deletable via applyGraphCommand + normalization', () => {
    useSpaghettiStore.getState().setGraph(emptyGraph)
    const state = useSpaghettiStore.getState()
    const outputPreviewNode = state.graph.nodes.find((node) => node.type === OUTPUT_PREVIEW_NODE_TYPE)
    expect(outputPreviewNode).toBeDefined()

    state.applyGraphCommand(removeNode(outputPreviewNode!.nodeId))

    const after = useSpaghettiStore.getState().graph
    const outputPreviewNodes = after.nodes.filter((node) => node.type === OUTPUT_PREVIEW_NODE_TYPE)
    expect(outputPreviewNodes).toHaveLength(1)
  })
})
