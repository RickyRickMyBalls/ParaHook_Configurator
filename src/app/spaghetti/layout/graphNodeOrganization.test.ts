import { describe, expect, it } from 'vitest'
import type { SpaghettiEdge, SpaghettiNode } from '../schema/spaghettiTypes'
import { planGraphNodeOrganization } from './graphNodeOrganization'

const node = (nodeId: string, type = 'Geometry/Sketch'): Pick<SpaghettiNode, 'nodeId' | 'type'> => ({
  nodeId,
  type,
})

const edge = (
  edgeId: string,
  fromNodeId: string,
  toNodeId: string,
): SpaghettiEdge => ({
  edgeId,
  from: { nodeId: fromNodeId, portId: 'out' },
  to: { nodeId: toNodeId, portId: 'in' },
})

describe('planGraphNodeOrganization', () => {
  it('lays out a linear graph as dependency columns', () => {
    const plan = planGraphNodeOrganization({
      nodes: [
        node('node-output', 'System/OutputPreview'),
        node('node-sketch'),
        node('node-extrude', 'Geometry/Extrude'),
      ],
      edges: [
        edge('edge-sketch-extrude', 'node-sketch', 'node-extrude'),
        edge('edge-extrude-output', 'node-extrude', 'node-output'),
      ],
    })

    expect(plan.columnIndexByNodeId).toEqual({
      'node-sketch': 0,
      'node-extrude': 1,
      'node-output': 2,
    })
    expect(plan.positionsByNodeId['node-sketch']).toMatchObject({ x: 80, y: 80 })
    expect(plan.positionsByNodeId['node-extrude']).toMatchObject({ x: 440, y: 80 })
    expect(plan.positionsByNodeId['node-output']).toMatchObject({ x: 800, y: 80 })
  })

  it('stacks sibling branches between one source and one sink', () => {
    const extrudeNodeIds = Array.from({ length: 6 }, (_, index) => `node-extrude-${index + 1}`)
    const plan = planGraphNodeOrganization({
      nodes: [
        node('node-sketch'),
        node('node-output', 'System/OutputPreview'),
        ...extrudeNodeIds.map((nodeId) => node(nodeId, 'Geometry/Extrude')),
      ],
      edges: [
        ...extrudeNodeIds.map((nodeId) => edge(`edge-sketch-${nodeId}`, 'node-sketch', nodeId)),
        ...extrudeNodeIds.map((nodeId) => edge(`edge-${nodeId}-output`, nodeId, 'node-output')),
      ],
    })

    expect(plan.columnIndexByNodeId['node-sketch']).toBe(0)
    expect(plan.columnIndexByNodeId['node-output']).toBe(2)
    expect(extrudeNodeIds.map((nodeId) => plan.columnIndexByNodeId[nodeId])).toEqual([
      1,
      1,
      1,
      1,
      1,
      1,
    ])
    expect(extrudeNodeIds.map((nodeId) => plan.positionsByNodeId[nodeId]?.y)).toEqual([
      80,
      540,
      1000,
      1460,
      1920,
      2380,
    ])
  })

  it('places disconnected nodes after the connected topology', () => {
    const plan = planGraphNodeOrganization({
      nodes: [
        node('node-a'),
        node('node-b', 'Geometry/Extrude'),
        node('node-floating', 'Utility/Number'),
      ],
      edges: [edge('edge-a-b', 'node-a', 'node-b')],
    })

    expect(plan.columnIndexByNodeId['node-floating']).toBe(2)
    expect(plan.positionsByNodeId['node-floating']).toMatchObject({
      x: 800,
      y: 650,
    })
  })

  it('preserves existing node widths while replacing position', () => {
    const plan = planGraphNodeOrganization({
      nodes: [node('node-a'), node('node-b', 'Geometry/Extrude')],
      edges: [edge('edge-a-b', 'node-a', 'node-b')],
      nodePositions: {
        'node-b': { x: 999, y: 999, width: 333 },
      },
    })

    expect(plan.positionsByNodeId['node-b']).toEqual({
      x: 440,
      y: 80,
      width: 333,
    })
  })

  it('returns stable output for shuffled input arrays', () => {
    const first = planGraphNodeOrganization({
      nodes: [
        node('node-output', 'System/OutputPreview'),
        node('node-extrude-b', 'Geometry/Extrude'),
        node('node-sketch'),
        node('node-extrude-a', 'Geometry/Extrude'),
      ],
      edges: [
        edge('edge-b-output', 'node-extrude-b', 'node-output'),
        edge('edge-sketch-b', 'node-sketch', 'node-extrude-b'),
        edge('edge-a-output', 'node-extrude-a', 'node-output'),
        edge('edge-sketch-a', 'node-sketch', 'node-extrude-a'),
      ],
    })
    const second = planGraphNodeOrganization({
      nodes: [
        node('node-sketch'),
        node('node-output', 'System/OutputPreview'),
        node('node-extrude-a', 'Geometry/Extrude'),
        node('node-extrude-b', 'Geometry/Extrude'),
      ],
      edges: [
        edge('edge-sketch-a', 'node-sketch', 'node-extrude-a'),
        edge('edge-a-output', 'node-extrude-a', 'node-output'),
        edge('edge-sketch-b', 'node-sketch', 'node-extrude-b'),
        edge('edge-b-output', 'node-extrude-b', 'node-output'),
      ],
    })

    expect(second).toEqual(first)
  })

  it('can organize a fan-out graph into one linear flow', () => {
    const plan = planGraphNodeOrganization({
      mode: 'linear',
      nodes: [
        node('node-sketch-1', 'Geometry/Sketch'),
        node('node-extrude-2', 'Geometry/Extrude'),
        node('node-extrude-1', 'Geometry/Extrude'),
        node('node-output-preview-1', 'System/OutputPreview'),
      ],
      edges: [
        edge('edge-sketch-extrude-1', 'node-sketch-1', 'node-extrude-1'),
        edge('edge-sketch-extrude-2', 'node-sketch-1', 'node-extrude-2'),
        edge('edge-extrude-1-output', 'node-extrude-1', 'node-output-preview-1'),
        edge('edge-extrude-2-output', 'node-extrude-2', 'node-output-preview-1'),
      ],
    })

    expect(plan.positionsByNodeId).toEqual({
      'node-sketch-1': { x: 80, y: 80 },
      'node-extrude-1': { x: 440, y: 80 },
      'node-extrude-2': { x: 800, y: 80 },
      'node-output-preview-1': { x: 1160, y: 80 },
    })
    expect(plan.columnIndexByNodeId).toEqual({
      'node-sketch-1': 0,
      'node-extrude-1': 1,
      'node-extrude-2': 2,
      'node-output-preview-1': 3,
    })
  })
})
