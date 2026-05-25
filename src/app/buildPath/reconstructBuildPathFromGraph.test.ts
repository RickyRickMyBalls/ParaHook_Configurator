import { describe, expect, it } from 'vitest'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../spaghetti/families/OutputPreview/system/outputPreviewNode'
import {
  deriveBuildPathBranchProjection,
  deriveBuildPathMasterTimeline,
  deriveBuildPathTopologyLayout,
} from './buildPathTimeline'
import { reconstructBuildPathFromLoadedGraph } from './reconstructBuildPathFromGraph'

const createDocument = (graph: GraphDocument['graph']): GraphDocument => ({
  graphDocumentId: 'graph-document-loaded',
  name: 'Loaded Graph',
  version: 1,
  graph,
})

describe('reconstructBuildPathFromLoadedGraph', () => {
  it('returns no events for a graph without supported build nodes', () => {
    const reconstruction = reconstructBuildPathFromLoadedGraph(
      createDocument({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-baseplate-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      }),
    )

    expect(reconstruction.events).toEqual([])
    expect(reconstruction.dependencies).toEqual([])
    expect(reconstruction.unsupportedNodeIds).toEqual(['node-baseplate-1'])
  })

  it('reconstructs Sketch before dependent Extrude from graph structure', () => {
    const reconstruction = reconstructBuildPathFromLoadedGraph(
      createDocument({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {},
          },
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {},
          },
          {
            nodeId: 'node-output-preview-1',
            type: OUTPUT_PREVIEW_NODE_TYPE,
            params: {},
          },
        ],
        edges: [
          {
            edgeId: 'edge-sketch-to-extrude',
            from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
            to: { nodeId: 'node-extrude-1', portId: 'Profile' },
          },
          {
            edgeId: 'edge-extrude-to-output',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
          },
        ],
      }),
    )

    expect(reconstruction.events.map((event) => event.commandFamily)).toEqual([
      'Sketch',
      'Extrude',
    ])
    expect(reconstruction.events.map((event) => event.sourceKind)).toEqual([
      'reconstructed',
      'reconstructed',
    ])
    expect(reconstruction.events[1]?.affectedOutputIds).toEqual([
      'output-entry:s001:node-extrude-1',
    ])
    expect(reconstruction.dependencies).toEqual([
      {
        edgeId: 'edge-sketch-to-extrude',
        fromNodeId: 'node-sketch-1',
        fromPortId: 'SketchProfiles',
        toNodeId: 'node-extrude-1',
        toPortId: 'Profile',
        connectorKind: 'sketchProfiles',
        connectorColor: '#10b981',
        graphDocumentId: 'graph-document-loaded',
        sourceKind: 'reconstructed',
      },
      {
        edgeId: 'edge-extrude-to-output',
        fromNodeId: 'node-extrude-1',
        fromPortId: 'SolidBody',
        toNodeId: 'node-output-preview-1',
        toPortId: 'in:solid:s001',
        connectorKind: 'solidBody',
        connectorColor: '#b19dff',
        graphDocumentId: 'graph-document-loaded',
        sourceKind: 'reconstructed',
      },
    ])
  })

  it('derives the canonical Sketch to six parallel Extrudes to Output topology', () => {
    const sketchNodeId = 'node-018b75f8-cf1c-45e6-917a-de92f37ba2bb'
    const outputNodeId = 'node-18a758ee-34d0-45a0-8473-774edca4c4e9'
    const extrudeNodeIds = [
      'node-ccee18c1-66e2-4674-87a0-55ece9e14c2b',
      'node-924e0938-b420-4165-a837-3d485b22739e',
      'node-23e67ce8-10be-479e-8690-45c0a1a984f0',
      'node-55b6fc8b-3660-4acb-8e4a-4bc19256db27',
      'node-ebf4345a-4616-44c3-85f5-ad361556fc0d',
      'node-94ec8d44-1fef-41e0-b487-3718cb6da4e5',
    ]
    const reconstruction = reconstructBuildPathFromLoadedGraph(
      createDocument({
        schemaVersion: 1,
        nodes: [
          { nodeId: outputNodeId, type: OUTPUT_PREVIEW_NODE_TYPE, params: {} },
          { nodeId: sketchNodeId, type: 'Geometry/Sketch', params: {} },
          ...extrudeNodeIds.map((nodeId) => ({
            nodeId,
            type: 'Geometry/Extrude',
            params: {},
          })),
        ],
        edges: extrudeNodeIds.flatMap((extrudeNodeId, index) => [
          {
            edgeId: `edge-sketch-profile-${index + 1}`,
            from: { nodeId: sketchNodeId, portId: `SketchProfile:prof_${index + 1}` },
            to: { nodeId: extrudeNodeId, portId: 'ExtrusionProfile' },
          },
          {
            edgeId: `edge-solid-body-${index + 1}`,
            from: { nodeId: extrudeNodeId, portId: 'SolidBody' },
            to: { nodeId: outputNodeId, portId: `in:solid:s00${index + 1}` },
          },
        ]),
      }),
    )
    const timeline = deriveBuildPathMasterTimeline(reconstruction.events)
    const topologyLayout = deriveBuildPathTopologyLayout({
      dependencies: reconstruction.dependencies,
      timeline,
    })

    expect(topologyLayout.columns.map((column) => column.topologyNodeIds)).toEqual([
      [expect.stringContaining(sketchNodeId)],
      extrudeNodeIds.map((nodeId) => expect.stringContaining(nodeId)),
      [expect.stringContaining(outputNodeId)],
    ])
    expect(topologyLayout.nodes.map((node) => node.graphNodeId)).toEqual([
      sketchNodeId,
      ...extrudeNodeIds,
      outputNodeId,
    ])
    expect(topologyLayout.connectors).toHaveLength(12)
    expect(
      topologyLayout.connectors
        .filter((connector) => connector.fromGraphNodeId === sketchNodeId)
        .map((connector) => connector.connectorKind),
    ).toEqual(Array.from({ length: 6 }, () => 'sketchProfile'))
    expect(
      topologyLayout.connectors
        .filter((connector) => connector.toGraphNodeId === outputNodeId)
        .map((connector) => connector.connectorKind),
    ).toEqual(Array.from({ length: 6 }, () => 'solidBody'))
    expect(
      topologyLayout.connectors
        .filter((connector) => connector.fromGraphNodeId === sketchNodeId)
        .map((connector) => connector.connectorColor),
    ).toEqual(Array.from({ length: 6 }, () => '#6ee7b7'))
    expect(
      topologyLayout.connectors
        .filter((connector) => connector.toGraphNodeId === outputNodeId)
        .map((connector) => connector.connectorColor),
    ).toEqual(Array.from({ length: 6 }, () => '#b19dff'))
    expect(timeline.steps.map((step) => step.orderIndex)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('keeps independent branch chains deterministic and branch-projectable', () => {
    const reconstruction = reconstructBuildPathFromLoadedGraph(
      createDocument({
        schemaVersion: 1,
        nodes: [
          { nodeId: 'node-sketch-a', type: 'Geometry/Sketch', params: {} },
          { nodeId: 'node-extrude-a', type: 'Geometry/Extrude', params: {} },
          { nodeId: 'node-sketch-b', type: 'Geometry/Sketch', params: {} },
          { nodeId: 'node-extrude-b', type: 'Geometry/Extrude', params: {} },
        ],
        edges: [
          {
            edgeId: 'edge-a',
            from: { nodeId: 'node-sketch-a', portId: 'SketchProfiles' },
            to: { nodeId: 'node-extrude-a', portId: 'Profile' },
          },
          {
            edgeId: 'edge-b',
            from: { nodeId: 'node-sketch-b', portId: 'SketchProfiles' },
            to: { nodeId: 'node-extrude-b', portId: 'Profile' },
          },
        ],
      }),
    )

    const timeline = deriveBuildPathMasterTimeline(reconstruction.events)
    const branchProjection = deriveBuildPathBranchProjection({
      dependencies: reconstruction.dependencies,
      timeline,
    })

    expect(reconstruction.events.map((event) => event.affectedNodeIds[0])).toEqual([
      'node-sketch-a',
      'node-extrude-a',
      'node-sketch-b',
      'node-extrude-b',
    ])
    expect(branchProjection.lanes).toHaveLength(2)
    expect(branchProjection.eventClassifications.map((classification) => classification.role)).toContain(
      'branch-local',
    )
  })
})
