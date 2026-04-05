import { describe, expect, it } from 'vitest'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import { selectDiagnosticsVm } from './selectDiagnosticsVm'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { selectNodeVm } from './selectNodeVm'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

describe('selectNodeVm', () => {
  it('preserves graph.nodes ordering and is deterministic', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        { nodeId: 'node-b', type: 'Part/ToeHook', params: {} },
        { nodeId: 'node-a', type: 'Part/Baseplate', params: {} },
      ],
      edges: [
        {
          edgeId: 'edge-1',
          from: { nodeId: 'node-a', portId: 'anchorSpline2' },
          to: { nodeId: 'node-b', portId: 'anchorSpline' },
        },
      ],
    }
    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })

    const first = selectNodeVm(graph, evaluation, diagnosticsVm)
    const second = selectNodeVm(graph, evaluation, diagnosticsVm)

    expect(first.orderedNodeIds).toEqual(['node-b', 'node-a'])
    expect(first).toEqual(second)
    expect(second).toBe(first)
    expect(first.byNodeId.has('node-a')).toBe(true)
    expect(first.byNodeId.has('node-b')).toBe(true)
    expect(first.nodes.map((node) => node.nodeId)).toEqual(['node-b', 'node-a'])
  })

  it('maps non-ok driver input edge status to row warning by edgeId', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-src',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'node-target',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-driver-missing',
          from: { nodeId: 'node-src', portId: 'missingPort' },
          to: { nodeId: 'node-target', portId: 'in:drv:widthMm' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const nodeVm = vm.byNodeId.get('node-target')

    expect(nodeVm?.driverWarningByRowId['drv:widthMm']?.kind).toBe('missingPort')
    expect(nodeVm?.driverWarningByRowId['drv:widthMm']?.message).toContain('does not exist')
  })

  it('uses deterministic first-edge fallback for corrupt multi-edge driver inputs', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-src-a',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'node-src-b',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'node-target',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-driver-a',
          from: { nodeId: 'node-src-a', portId: 'out' },
          to: { nodeId: 'node-target', portId: 'in:drv:widthMm' },
        },
        {
          edgeId: 'edge-driver-b',
          from: { nodeId: 'node-src-b', portId: 'out' },
          to: { nodeId: 'node-target', portId: 'in:drv:widthMm' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const warning = vm.byNodeId.get('node-target')?.driverWarningByRowId['drv:widthMm']

    expect(warning?.kind).toBe('unresolved')
    expect(warning?.reasons).toEqual(['unresolved'])
    expect(warning?.message).toContain('first edge "edge-driver-a" selected')
  })

  it('provides selector-owned OutputPreview row identities', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [],
    }
    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const row = vm.byNodeId.get('node-output-preview-1')?.outputPreviewRows?.[0]
    expect(row?.rowId).toBe('op-slot:s001')
    expect(row?.nodeId).toBe('node-output-preview-1')
  })

  it('provides deterministic internal feature dependency rows and edges', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-part-1',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-1',
                      profileIndex: 0,
                      area: 10,
                      loop: {
                        segments: [],
                        winding: 'CCW',
                      },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: {
                  collapsed: false,
                },
              },
              {
                type: 'extrude',
                featureId: 'extrude-1',
                inputs: {
                  profileRef: {
                    sourceFeatureId: 'sketch-1',
                    profileId: 'profile-1',
                    profileIndex: 0,
                  },
                },
                params: {
                  depth: {
                    kind: 'lit',
                    value: 10,
                  },
                },
                outputs: {
                  bodyId: 'body-1',
                },
                uiState: {
                  collapsed: false,
                },
              },
            ],
          },
        },
      ],
      edges: [],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const nodeVm = vm.byNodeId.get('node-part-1')

    expect(nodeVm?.featureRows).toEqual([
      {
        rowId: 'feature:sketch-1',
        featureId: 'sketch-1',
        featureType: 'sketch',
        orderIndex: 0,
        enabled: true,
        effective: true,
      },
      {
        rowId: 'feature:extrude-1',
        featureId: 'extrude-1',
        featureType: 'extrude',
        orderIndex: 1,
        enabled: true,
        effective: true,
      },
    ])
    expect(nodeVm?.featureRowIndexById).toEqual({
      'feature:sketch-1': 0,
      'feature:extrude-1': 1,
    })
    expect(nodeVm?.internalDependencyEdges).toEqual([
      {
        id: 'dep:driver:drv:feature:firstExtrudeDepth->feature:extrude-1',
        kind: 'driverToFeature',
        sourceKind: 'driverRow',
        sourceId: 'drv:feature:firstExtrudeDepth',
        targetFeatureId: 'extrude-1',
        targetRowId: 'feature:extrude-1',
        enabled: true,
        effective: true,
      },
      {
        id: 'dep:feature:sketch-1->feature:extrude-1',
        kind: 'featureToFeature',
        sourceKind: 'feature',
        sourceId: 'sketch-1',
        targetFeatureId: 'extrude-1',
        targetRowId: 'feature:extrude-1',
        enabled: true,
        effective: true,
      },
    ])
  })

  it('builds selector-owned utility node vm data for Param nodes', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-param-number',
          type: 'Param/Number',
          params: { value: 15 },
        },
        {
          nodeId: 'node-param-boolean',
          type: 'Param/Boolean',
          params: { value: true },
        },
        {
          nodeId: 'node-param-vec2',
          type: 'Param/Vec2',
          params: { value: { x: 3, y: 9 } },
        },
      ],
      edges: [],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)

    expect(vm.byNodeId.get('node-param-number')?.utilityVm).toEqual({
      source: 'param',
      kind: 'paramNumber',
      value: 15,
      outputPort: {
        portId: 'value',
        label: 'Value',
        type: { kind: 'number', unit: 'mm' },
      },
    })
    expect(vm.byNodeId.get('node-param-boolean')?.utilityVm).toEqual({
      source: 'param',
      kind: 'paramBoolean',
      value: true,
      outputPort: {
        portId: 'value',
        label: 'Value',
        type: { kind: 'boolean' },
      },
    })
    expect(vm.byNodeId.get('node-param-vec2')?.utilityVm).toEqual({
      source: 'param',
      kind: 'paramVec2',
      value: { x: 3, y: 9 },
      outputPort: {
        portId: 'value',
        label: 'Value',
        type: { kind: 'vec2', unit: 'mm' },
      },
    })
  })

  it('matches stable NodeVm contract snapshot', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        { nodeId: 'node-a', type: 'Part/Baseplate', params: {} },
      ],
      edges: [],
    }
    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    expect(vm.nodes).toMatchSnapshot()
  })

  it('stays stable across benign graph ui mutation', () => {
    const base: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [{ nodeId: 'node-a', type: 'Part/Baseplate', params: {} }],
      edges: [],
    }
    const mutated: SpaghettiGraph = {
      ...base,
      ui: {
        nodes: {
          'node-a': { x: 120, y: 90 },
        },
      },
    }
    const baseVm = selectNodeVm(base, evaluateSpaghettiGraph(base))
    const mutatedVm = selectNodeVm(mutated, evaluateSpaghettiGraph(mutated))
    expect(mutatedVm.nodes).toEqual(baseVm.nodes)
  })

  it('maps a whole-number unitless Type input into the shared extrude enum row contract', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-type-driver',
          type: 'Primitive/Number',
          params: { value: 1, unit: 'unitless' },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            depthMm: 20,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-type-drive',
          from: { nodeId: 'node-type-driver', portId: 'value' },
          to: { nodeId: 'node-extrude-1', portId: 'Type' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.extrudeType).toBe('Walls')
    expect(extrudeVm?.localExtrudeType).toBe('Body')
    expect(extrudeVm?.typeDriven).toBe(true)
  })

  it('keeps the authored extrude type when the Type input is unwired', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Walls',
            depthMm: 20,
          },
        },
      ],
      edges: [],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.extrudeType).toBe('Walls')
    expect(extrudeVm?.localExtrudeType).toBe('Walls')
    expect(extrudeVm?.typeDriven).toBe(false)
  })
})
