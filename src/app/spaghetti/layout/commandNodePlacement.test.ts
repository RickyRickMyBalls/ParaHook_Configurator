import { describe, expect, it } from 'vitest'
import type { SpaghettiEdge, SpaghettiNode } from '../schema/spaghettiTypes'
import { planCommandNodePlacement } from './commandNodePlacement'

const node = (nodeId: string, type = 'Geometry/Sketch'): Pick<SpaghettiNode, 'nodeId' | 'type'> => ({
  nodeId,
  type,
})

describe('planCommandNodePlacement', () => {
  it('places a command-created consumer downstream from its upstream node', () => {
    const plan = planCommandNodePlacement({
      nodes: [node('node-sketch-1'), node('node-extrude-1', 'Geometry/Extrude')],
      edges: [],
      nodePositions: {
        'node-sketch-1': { x: 220, y: 180 },
      },
      commandCreatedNodeIds: ['node-extrude-1'],
      strongestUpstreamNodeId: 'node-sketch-1',
    })

    expect(plan.positionsByNodeId).toEqual({
      'node-extrude-1': { x: 540, y: 180 },
    })
    expect(plan.reasonsByNodeId).toEqual({
      'node-extrude-1': 'downstream-of-upstream',
    })
  })

  it('places a bridge node between positioned source and target nodes', () => {
    const plan = planCommandNodePlacement({
      nodes: [
        node('node-sketch-1'),
        node('node-extrude-1', 'Geometry/Extrude'),
        node('node-output-1', 'System/OutputPreview'),
      ],
      edges: [],
      nodePositions: {
        'node-sketch-1': { x: 120, y: 100 },
        'node-output-1': { x: 760, y: 260 },
      },
      commandCreatedNodeIds: ['node-extrude-1'],
      strongestUpstreamNodeId: 'node-sketch-1',
      targetNodeId: 'node-output-1',
      roleByNodeId: {
        'node-extrude-1': 'bridge',
      },
    })

    expect(plan.positionsByNodeId).toEqual({
      'node-extrude-1': { x: 440, y: 180 },
    })
    expect(plan.reasonsByNodeId).toEqual({
      'node-extrude-1': 'between-source-and-target',
    })
  })

  it('stacks repeated command-created nodes deterministically', () => {
    const plan = planCommandNodePlacement({
      nodes: [
        node('node-sketch-1'),
        node('node-extrude-1', 'Geometry/Extrude'),
        node('node-extrude-2', 'Geometry/Extrude'),
      ],
      edges: [],
      nodePositions: {
        'node-sketch-1': { x: 220, y: 180 },
      },
      commandCreatedNodeIds: ['node-extrude-1', 'node-extrude-2'],
      strongestUpstreamNodeId: 'node-sketch-1',
    })

    expect(plan.positionsByNodeId).toEqual({
      'node-extrude-1': { x: 540, y: 180 },
      'node-extrude-2': { x: 540, y: 340 },
    })
    expect(plan.reasonsByNodeId).toEqual({
      'node-extrude-1': 'downstream-of-upstream',
      'node-extrude-2': 'stacked-repeat',
    })
  })

  it('uses a fallback lane when no related node has position truth', () => {
    const plan = planCommandNodePlacement({
      nodes: [node('node-sketch-created')],
      edges: [],
      commandCreatedNodeIds: ['node-sketch-created'],
    })

    expect(plan.positionsByNodeId).toEqual({
      'node-sketch-created': { x: 120, y: 120 },
    })
    expect(plan.reasonsByNodeId).toEqual({
      'node-sketch-created': 'fallback-lane',
    })
  })

  it('preserves existing positioned nodes instead of proposing replacements', () => {
    const plan = planCommandNodePlacement({
      nodes: [node('node-sketch-1'), node('node-extrude-1', 'Geometry/Extrude')],
      edges: [],
      nodePositions: {
        'node-sketch-1': { x: 220, y: 180 },
        'node-extrude-1': { x: 999, y: 888 },
      },
      commandCreatedNodeIds: ['node-extrude-1'],
      strongestUpstreamNodeId: 'node-sketch-1',
    })

    expect(plan.positionsByNodeId).toEqual({})
    expect(plan.reasonsByNodeId).toEqual({})
  })

  it('can infer upstream and downstream placement anchors from graph edges', () => {
    const edges: SpaghettiEdge[] = [
      {
        edgeId: 'edge-sketch-extrude',
        from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
        to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
      },
      {
        edgeId: 'edge-extrude-output',
        from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
        to: { nodeId: 'node-output-1', portId: 'Input' },
      },
    ]

    const plan = planCommandNodePlacement({
      nodes: [
        node('node-sketch-1'),
        node('node-extrude-1', 'Geometry/Extrude'),
        node('node-output-1', 'System/OutputPreview'),
      ],
      edges,
      nodePositions: {
        'node-sketch-1': { x: 120, y: 100 },
        'node-output-1': { x: 760, y: 260 },
      },
      commandCreatedNodeIds: ['node-extrude-1'],
      roleByNodeId: {
        'node-extrude-1': 'bridge',
      },
    })

    expect(plan.positionsByNodeId).toEqual({
      'node-extrude-1': { x: 440, y: 180 },
    })
    expect(plan.reasonsByNodeId).toEqual({
      'node-extrude-1': 'between-source-and-target',
    })
    expect(edges).toHaveLength(2)
  })
})
