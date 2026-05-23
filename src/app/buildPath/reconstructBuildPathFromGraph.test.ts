import { describe, expect, it } from 'vitest'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../spaghetti/families/OutputPreview/system/outputPreviewNode'
import { deriveBuildPathBranchProjection, deriveBuildPathMasterTimeline } from './buildPathTimeline'
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
        toNodeId: 'node-extrude-1',
        graphDocumentId: 'graph-document-loaded',
        sourceKind: 'reconstructed',
      },
    ])
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
