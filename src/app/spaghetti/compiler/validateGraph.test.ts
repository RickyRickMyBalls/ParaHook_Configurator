import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { NodeDefinition } from '../registry/nodeRegistry'
import type { PortSpec, PortType, SpaghettiGraph } from '../schema/spaghettiTypes'

const makeFixtureNodeDef = (config: {
  label: string
  inputs: PortSpec[]
  outputs: PortSpec[]
}): NodeDefinition =>
  ({
    // Test-only fixture defs are injected through mocked lookup.
    type: 'Primitive/Number',
    label: config.label,
    paramsSchema: z.object({}).strict(),
    inputs: config.inputs,
    outputs: config.outputs,
    compute: () => ({}),
  }) as unknown as NodeDefinition

const profileLoopType: PortType = { kind: 'profileLoop' }

const fixtureNodeDefs: Record<string, NodeDefinition> = {
  'Test/ProfileLoopSource': makeFixtureNodeDef({
    label: 'Test ProfileLoop Source',
    inputs: [],
    outputs: [
      {
        portId: 'loop',
        label: 'Loop',
        type: profileLoopType,
      },
    ],
  }),
  'Test/ProfileLoopSink': makeFixtureNodeDef({
    label: 'Test ProfileLoop Sink',
    inputs: [
      {
        portId: 'loop',
        label: 'Loop',
        type: profileLoopType,
      },
    ],
    outputs: [],
  }),
}

vi.mock('../registry/nodeRegistry', async () => {
  const actual = await vi.importActual<typeof import('../registry/nodeRegistry')>(
    '../registry/nodeRegistry',
  )
  return {
    ...actual,
    getNodeDef: (type: string) => fixtureNodeDefs[type] ?? actual.getNodeDef(type),
  }
})

import { validateGraph } from './validateGraph'

const createBaseGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'n-num',
      type: 'Primitive/Number',
      params: {
        value: 10,
      },
    },
    {
      nodeId: 'n-spline',
      type: 'Primitive/SplineFromPoints',
      params: {
        points: [],
      },
    },
  ],
  edges: [],
})

const createProfileLoopGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'n-loop-source',
      type: 'Test/ProfileLoopSource',
      params: {},
    },
    {
      nodeId: 'n-loop-sink',
      type: 'Test/ProfileLoopSink',
      params: {},
    },
  ],
  edges: [],
})

describe('validateGraph endpoint paths', () => {
  it('accepts valid leaf path endpoint', () => {
    const graph = createBaseGraph()
    graph.edges.push({
      edgeId: 'e-valid-path',
      from: {
        nodeId: 'n-num',
        portId: 'value',
      },
      to: {
        nodeId: 'n-spline',
        portId: 'points',
        path: ['x'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects invalid endpoint path', () => {
    const graph = createBaseGraph()
    graph.edges.push({
      edgeId: 'e-invalid-path',
      from: {
        nodeId: 'n-num',
        portId: 'value',
      },
      to: {
        nodeId: 'n-spline',
        portId: 'points',
        path: ['z'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_PATH_INVALID')).toBe(true)
  })

  it('rejects duplicate target leaf-path connections', () => {
    const graph = createBaseGraph()
    graph.edges.push(
      {
        edgeId: 'e-1',
        from: {
          nodeId: 'n-num',
          portId: 'value',
        },
        to: {
          nodeId: 'n-spline',
          portId: 'points',
          path: ['x'],
        },
      },
      {
        edgeId: 'e-2',
        from: {
          nodeId: 'n-num',
          portId: 'value',
        },
        to: {
          nodeId: 'n-spline',
          portId: 'points',
          path: ['x'],
        },
      },
    )

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_PATH_DUPLICATE')).toBe(true)
  })

  it('accepts valid profileLoop leaf path endpoint via test fixture', () => {
    const graph = createProfileLoopGraph()
    graph.edges.push({
      edgeId: 'e-profile-valid',
      from: {
        nodeId: 'n-loop-source',
        portId: 'loop',
        path: ['centroid', 'x'],
      },
      to: {
        nodeId: 'n-loop-sink',
        portId: 'loop',
        path: ['centroid', 'x'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects profileLoop non-leaf path endpoint via test fixture', () => {
    const graph = createProfileLoopGraph()
    graph.edges.push({
      edgeId: 'e-profile-not-leaf',
      from: {
        nodeId: 'n-loop-source',
        portId: 'loop',
        path: ['centroid', 'x'],
      },
      to: {
        nodeId: 'n-loop-sink',
        portId: 'loop',
        path: ['centroid'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_PATH_NOT_LEAF')).toBe(true)
  })

  it('rejects profileLoop unknown path endpoint via test fixture', () => {
    const graph = createProfileLoopGraph()
    graph.edges.push({
      edgeId: 'e-profile-unknown-path',
      from: {
        nodeId: 'n-loop-source',
        portId: 'loop',
        path: ['centroid', 'x'],
      },
      to: {
        nodeId: 'n-loop-sink',
        portId: 'loop',
        path: ['unknown'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_PATH_INVALID')).toBe(true)
  })
})
