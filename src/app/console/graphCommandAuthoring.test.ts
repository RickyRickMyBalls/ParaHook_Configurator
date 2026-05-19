import { describe, expect, it, vi } from 'vitest'
import {
  authorExtrudeGraphCommand,
  authorSketchGraphCommand,
} from './graphCommandAuthoring'

describe('authorSketchGraphCommand', () => {
  it('reuses the selected sketch when a sketch node is selected', () => {
    const createSketchNode = vi.fn()

    const result = authorSketchGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: 'node-sketch-selected',
      graphNodes: [
        { nodeId: 'node-sketch-first', type: 'Geometry/Sketch' },
        { nodeId: 'node-sketch-selected', type: 'Geometry/Sketch' },
      ],
      entryPoint: 'console-root',
      createSketchNode,
    })

    expect(result).toMatchObject({
      kind: 'committed',
      sketchNodeId: 'node-sketch-selected',
      createdNode: null,
      commitSummary: {
        commandFamily: 'Sketch',
        entryPoint: 'console-root',
        lifecycleState: 'committed',
        createdNodeIds: [],
        reusedNodeIds: ['node-sketch-selected'],
      },
    })
    expect(createSketchNode).not.toHaveBeenCalled()
  })

  it('reuses the first sketch when no selected sketch is active', () => {
    const createSketchNode = vi.fn()

    const result = authorSketchGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: 'node-extrude-1',
      graphNodes: [
        { nodeId: 'node-extrude-1', type: 'Geometry/Extrude' },
        { nodeId: 'node-sketch-first', type: 'Geometry/Sketch' },
      ],
      entryPoint: 'console-root',
      createSketchNode,
    })

    expect(result).toMatchObject({
      kind: 'committed',
      sketchNodeId: 'node-sketch-first',
      commitSummary: {
        createdNodeIds: [],
        reusedNodeIds: ['node-sketch-first'],
      },
    })
    expect(createSketchNode).not.toHaveBeenCalled()
  })

  it('creates a sketch when no reusable sketch exists', () => {
    const createSketchNode = vi.fn(() => ({
      nodeId: 'node-sketch-created',
      nodeLabel: 'sketch_[1]',
    }))

    const result = authorSketchGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: null,
      graphNodes: [],
      entryPoint: 'viewport-shortcut',
      createSketchNode,
    })

    expect(result).toMatchObject({
      kind: 'committed',
      sketchNodeId: 'node-sketch-created',
      createdNode: {
        nodeId: 'node-sketch-created',
        nodeLabel: 'sketch_[1]',
      },
      commitSummary: {
        commandFamily: 'Sketch',
        entryPoint: 'viewport-shortcut',
        createdNodeIds: ['node-sketch-created'],
        reusedNodeIds: [],
      },
    })
    expect(createSketchNode).toHaveBeenCalledWith('graph-document-1')
  })

  it('creates a fresh sketch for new sketch even when a sketch exists', () => {
    const createSketchNode = vi.fn(() => ({
      nodeId: 'node-sketch-created',
      nodeLabel: 'sketch_[2]',
    }))

    const result = authorSketchGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: 'node-sketch-existing',
      graphNodes: [{ nodeId: 'node-sketch-existing', type: 'Geometry/Sketch' }],
      entryPoint: 'console-root',
      forceNew: true,
      createSketchNode,
    })

    expect(result).toMatchObject({
      kind: 'committed',
      sketchNodeId: 'node-sketch-created',
      createdNode: {
        nodeLabel: 'sketch_[2]',
      },
      commitSummary: {
        createdNodeIds: ['node-sketch-created'],
        reusedNodeIds: [],
      },
    })
    expect(createSketchNode).toHaveBeenCalledWith('graph-document-1')
  })

  it('returns a cancelled no-mutation result when graph context is missing', () => {
    const result = authorSketchGraphCommand({
      graphDocumentId: null,
      selectedNodeId: null,
      graphNodes: [],
      entryPoint: 'console-root',
      createSketchNode: vi.fn(),
    })

    expect(result).toEqual({
      kind: 'cancelled',
      reason: 'missing-graph-document',
      commitSummary: {
        commandFamily: 'Sketch',
        entryPoint: 'console-root',
        lifecycleState: 'cancelled',
        reason: 'missing-graph-document',
      },
    })
  })

  it('returns a cancelled no-mutation result when sketch creation fails', () => {
    const result = authorSketchGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: null,
      graphNodes: [],
      entryPoint: 'console-root',
      createSketchNode: vi.fn(() => null),
    })

    expect(result).toEqual({
      kind: 'cancelled',
      reason: 'create-sketch-node-failed',
      commitSummary: {
        commandFamily: 'Sketch',
        entryPoint: 'console-root',
        lifecycleState: 'cancelled',
        reason: 'create-sketch-node-failed',
      },
    })
  })
})

describe('authorExtrudeGraphCommand', () => {
  it('creates an extrude node and wires every selected sketch profile into it', () => {
    const commitExtrudeGraphPlan = vi.fn(() => ({
      kind: 'committed' as const,
      extrudeNodeId: 'node-extrude-created',
      createdNode: {
        nodeId: 'node-extrude-created',
        nodeLabel: 'extrude_[1]',
      },
      addedEdges: [{ edgeId: 'edge-profile-a' }, { edgeId: 'edge-profile-b' }],
    }))

    const result = authorExtrudeGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: null,
      graphNodes: [{ nodeId: 'node-sketch-1', type: 'Geometry/Sketch' }],
      entryPoint: 'console-root',
      selectedProfileSources: [
        { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
        { nodeId: 'node-sketch-2', portId: 'SketchProfiles' },
      ],
      commitExtrudeGraphPlan,
    })

    expect(result).toMatchObject({
      kind: 'committed',
      graphDocumentId: 'graph-document-1',
      extrudeNodeId: 'node-extrude-created',
      createdNode: {
        nodeLabel: 'extrude_[1]',
      },
      addedEdgeIds: ['edge-profile-a', 'edge-profile-b'],
      commitSummary: {
        commandFamily: 'Extrude',
        entryPoint: 'console-root',
        lifecycleState: 'committed',
        createdNodeIds: ['node-extrude-created'],
        reusedNodeIds: [],
        addedEdgeIds: ['edge-profile-a', 'edge-profile-b'],
      },
    })
    expect(commitExtrudeGraphPlan).toHaveBeenCalledWith({
      graphDocumentId: 'graph-document-1',
      target: { kind: 'create' },
      selectedProfileSources: [
        { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
        { nodeId: 'node-sketch-2', portId: 'SketchProfiles' },
      ],
      targetProfilePortId: 'ExtrusionProfile',
    })
  })

  it('reuses the selected extrude node when one is already selected', () => {
    const commitExtrudeGraphPlan = vi.fn(() => ({
      kind: 'committed' as const,
      extrudeNodeId: 'node-extrude-selected',
      createdNode: null,
      addedEdges: [{ edgeId: 'edge-profile-a' }],
    }))

    const result = authorExtrudeGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: 'node-extrude-selected',
      graphNodes: [
        { nodeId: 'node-extrude-selected', type: 'Geometry/Extrude' },
        { nodeId: 'node-sketch-1', type: 'Geometry/Sketch' },
      ],
      entryPoint: 'viewport-toolbar',
      selectedProfileSources: [{ nodeId: 'node-sketch-1', portId: 'SketchProfiles' }],
      commitExtrudeGraphPlan,
    })

    expect(result).toMatchObject({
      kind: 'committed',
      extrudeNodeId: 'node-extrude-selected',
      createdNode: null,
      addedEdgeIds: ['edge-profile-a'],
      commitSummary: {
        commandFamily: 'Extrude',
        entryPoint: 'viewport-toolbar',
        createdNodeIds: [],
        reusedNodeIds: ['node-extrude-selected'],
        addedEdgeIds: ['edge-profile-a'],
      },
    })
    expect(commitExtrudeGraphPlan).toHaveBeenCalledWith({
      graphDocumentId: 'graph-document-1',
      target: { kind: 'reuse', nodeId: 'node-extrude-selected' },
      selectedProfileSources: [{ nodeId: 'node-sketch-1', portId: 'SketchProfiles' }],
      targetProfilePortId: 'ExtrusionProfile',
    })
  })

  it('cancels before graph mutation when no sketch profiles are selected', () => {
    const commitExtrudeGraphPlan = vi.fn()

    const result = authorExtrudeGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: null,
      graphNodes: [],
      entryPoint: 'console-root',
      selectedProfileSources: [],
      commitExtrudeGraphPlan,
    })

    expect(result).toEqual({
      kind: 'cancelled',
      reason: 'missing-profile-selection',
      commitSummary: {
        commandFamily: 'Extrude',
        entryPoint: 'console-root',
        lifecycleState: 'cancelled',
        reason: 'missing-profile-selection',
      },
    })
    expect(commitExtrudeGraphPlan).not.toHaveBeenCalled()
  })

  it('cancels before graph mutation when graph context is missing', () => {
    const commitExtrudeGraphPlan = vi.fn()

    const result = authorExtrudeGraphCommand({
      graphDocumentId: null,
      selectedNodeId: null,
      graphNodes: [],
      entryPoint: 'console-root',
      selectedProfileSources: [{ nodeId: 'node-sketch-1', portId: 'SketchProfiles' }],
      commitExtrudeGraphPlan,
    })

    expect(result).toEqual({
      kind: 'cancelled',
      reason: 'missing-graph-document',
      commitSummary: {
        commandFamily: 'Extrude',
        entryPoint: 'console-root',
        lifecycleState: 'cancelled',
        reason: 'missing-graph-document',
      },
    })
    expect(commitExtrudeGraphPlan).not.toHaveBeenCalled()
  })

  it('cancels without exposing partial edge mutation when the atomic plan commit cannot create the extrude node', () => {
    const commitExtrudeGraphPlan = vi.fn(() => ({
      kind: 'cancelled' as const,
      reason: 'create-extrude-node-failed' as const,
    }))

    const result = authorExtrudeGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: null,
      graphNodes: [{ nodeId: 'node-sketch-1', type: 'Geometry/Sketch' }],
      entryPoint: 'console-root',
      selectedProfileSources: [{ nodeId: 'node-sketch-1', portId: 'SketchProfiles' }],
      commitExtrudeGraphPlan,
    })

    expect(result).toEqual({
      kind: 'cancelled',
      reason: 'create-extrude-node-failed',
      commitSummary: {
        commandFamily: 'Extrude',
        entryPoint: 'console-root',
        lifecycleState: 'cancelled',
        reason: 'create-extrude-node-failed',
      },
    })
    expect(commitExtrudeGraphPlan).toHaveBeenCalledTimes(1)
  })

  it('cancels before reporting a commit when the atomic plan commit rejects profile wires', () => {
    const commitExtrudeGraphPlan = vi.fn(() => ({
      kind: 'cancelled' as const,
      reason: 'profile-wire-failed' as const,
    }))

    const result = authorExtrudeGraphCommand({
      graphDocumentId: 'graph-document-1',
      selectedNodeId: null,
      graphNodes: [{ nodeId: 'node-sketch-1', type: 'Geometry/Sketch' }],
      entryPoint: 'viewport-toolbar',
      selectedProfileSources: [
        { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
        { nodeId: 'node-sketch-2', portId: 'SketchProfiles' },
      ],
      commitExtrudeGraphPlan,
    })

    expect(result).toEqual({
      kind: 'cancelled',
      reason: 'profile-wire-failed',
      commitSummary: {
        commandFamily: 'Extrude',
        entryPoint: 'viewport-toolbar',
        lifecycleState: 'cancelled',
        reason: 'profile-wire-failed',
      },
    })
    expect(commitExtrudeGraphPlan).toHaveBeenCalledWith({
      graphDocumentId: 'graph-document-1',
      target: { kind: 'create' },
      selectedProfileSources: [
        { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
        { nodeId: 'node-sketch-2', portId: 'SketchProfiles' },
      ],
      targetProfilePortId: 'ExtrusionProfile',
    })
  })
})
