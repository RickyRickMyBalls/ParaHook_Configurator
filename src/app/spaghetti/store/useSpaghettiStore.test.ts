import { afterEach, describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from './useSpaghettiStore'

const emptyGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [],
  edges: [],
}

describe('useSpaghettiStore graph normalization', () => {
  afterEach(() => {
    useSpaghettiStore.getState().setGraph(emptyGraph)
  })

  it('canonicalizes legacy ToeHook anchorSpline2 input port ids to anchorSpline', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'node-toehook-1',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-baseplate-toehook-anchor',
          from: {
            nodeId: 'node-baseplate-1',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'node-toehook-1',
            portId: 'anchorSpline2',
          },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    expect(normalized.edges[0]?.to.portId).toBe('anchorSpline')
    expect(normalized.edges[0]?.from.portId).toBe('anchorSpline2')
  })

  it('canonicalizes legacy HeelKick anchorSpline2 input port ids to anchorSpline', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'node-heelkick-1',
          type: 'Part/HeelKick',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-baseplate-heelkick-anchor',
          from: {
            nodeId: 'node-baseplate-1',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'node-heelkick-1',
            portId: 'anchorSpline2',
          },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    expect(normalized.edges[0]?.to.portId).toBe('anchorSpline')
    expect(normalized.edges[0]?.from.portId).toBe('anchorSpline2')
  })
})
