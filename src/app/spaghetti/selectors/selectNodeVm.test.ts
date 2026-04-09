import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import { buildExtrudeProfileEntryPortId } from '../features/extrudeProfileEntryPorts'
import { profileIdFromSignature } from '../features/profileDerivation'
import { buildSketchProfileMemberPortId } from '../features/sketchProfileVirtualPorts'
import { selectDiagnosticsVm } from './selectDiagnosticsVm'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import type { SketchFeature } from '../features/featureTypes'
import { selectNodeVm } from './selectNodeVm'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { registry, type NodeDefinition } from '../registry/nodeRegistry'

const testNumberDegSourceType = 'Test/NumberDeg'
const registryWithTests = registry as unknown as Record<string, NodeDefinition>

beforeAll(() => {
  registryWithTests[testNumberDegSourceType] = {
    type: testNumberDegSourceType as never,
    label: 'Test Number Source (deg)',
    paramsSchema: z
      .object({
        value: z.number(),
      })
      .strict(),
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'number', unit: 'deg' },
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  }
})

afterAll(() => {
  delete registryWithTests[testNumberDegSourceType]
})

const createSketchFeature = (
  components: SketchFeature['components'] = [],
  options?: { selectedProfileId?: string },
): SketchFeature => ({
  type: 'sketch',
  featureId: 'sketch-1',
  plane: 'XY',
  components,
  outputs: {
    profiles: [],
    diagnostics: [],
  },
  uiState: {
    collapsed: false,
    ...(options?.selectedProfileId === undefined
      ? {}
      : { selectedProfileId: options.selectedProfileId }),
  },
})

const lineComponent = (
  rowId: string,
  componentId: string,
  start: { x: number; y: number },
  end: { x: number; y: number },
): SketchFeature['components'][number] => ({
  rowId,
  componentId,
  type: 'line',
  a: { kind: 'lit', x: start.x, y: start.y },
  b: { kind: 'lit', x: end.x, y: end.y },
})

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

  it('keeps the authored extrude type when extra extrude params are present', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Walls',
            depthMm: 20,
            taperDeg: 3,
            wallThicknessMm: 1.5,
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

  it('maps a whole-number unitless Direction input into the shared extrude enum row contract', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-direction-driver',
          type: 'Primitive/Number',
          params: { value: 2, unit: 'unitless' },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            extrudeDirection: 'OneSide',
            depthMm: 20,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-direction-drive',
          from: { nodeId: 'node-direction-driver', portId: 'value' },
          to: { nodeId: 'node-extrude-1', portId: 'Direction' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.extrudeDirection).toBe('Symmetric')
    expect(extrudeVm?.localExtrudeDirection).toBe('OneSide')
    expect(extrudeVm?.directionDriven).toBe(true)
  })

  it('keeps the authored extrude direction when the Direction input is unwired', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            extrudeDirection: 'TwoSides',
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

    expect(extrudeVm?.extrudeDirection).toBe('TwoSides')
    expect(extrudeVm?.localExtrudeDirection).toBe('TwoSides')
    expect(extrudeVm?.directionDriven).toBe(false)
  })

  it('defaults missing authored extrude direction to OneSide even when extra extrude params are present', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Walls',
            depthMm: 20,
            taperDeg: 3,
            wallThicknessMm: 1.5,
          },
        },
      ],
      edges: [],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.extrudeDirection).toBe('OneSide')
    expect(extrudeVm?.localExtrudeDirection).toBe('OneSide')
    expect(extrudeVm?.directionDriven).toBe(false)
  })

  it('keeps the authored taper angle when the TaperAngle input is unwired', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            extrudeDirection: 'OneSide',
            depthMm: 20,
            taperAngleDeg: 3,
          },
        },
      ],
      edges: [],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.localTaperAngleDeg).toBe(3)
    expect(extrudeVm?.effectiveTaperAngleDeg).toBe(3)
    expect(extrudeVm?.taperVisible).toBe(true)
    expect(extrudeVm?.taperDriven).toBe(false)
  })

  it('keeps taper row ownership honest when the TaperAngle input is wire-driven', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-taper-driver',
          type: testNumberDegSourceType as never,
          params: { value: 8.5 },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            extrudeDirection: 'OneSide',
            depthMm: 20,
            taperAngleDeg: 3,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-taper-drive',
          from: { nodeId: 'node-taper-driver', portId: 'value' },
          to: { nodeId: 'node-extrude-1', portId: 'TaperAngle' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.localTaperAngleDeg).toBe(3)
    expect(extrudeVm?.effectiveTaperAngleDeg).toBe(8.5)
    expect(extrudeVm?.taperVisible).toBe(true)
    expect(extrudeVm?.taperDriven).toBe(true)
  })

  it('hides taper visibility for Walls even while authored taper state remains intact', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Walls',
            extrudeDirection: 'OneSide',
            depthMm: 20,
            taperAngleDeg: 3,
          },
        },
      ],
      edges: [],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.localTaperAngleDeg).toBe(3)
    expect(extrudeVm?.effectiveTaperAngleDeg).toBe(3)
    expect(extrudeVm?.taperVisible).toBe(false)
  })

  it('hides taper visibility for unsupported direction modes even while authored taper state remains intact', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            extrudeDirection: 'Symmetric',
            depthMm: 20,
            taperAngleDeg: 3,
          },
        },
      ],
      edges: [],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.localTaperAngleDeg).toBe(3)
    expect(extrudeVm?.effectiveTaperAngleDeg).toBe(3)
    expect(extrudeVm?.taperVisible).toBe(false)
  })

  it('falls back TwoSides start and end depth rows from depthMm when split params are missing', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            extrudeDirection: 'TwoSides',
            depthMm: 32,
          },
        },
      ],
      edges: [],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.depthVisible).toBe(false)
    expect(extrudeVm?.startDepthVisible).toBe(true)
    expect(extrudeVm?.endDepthVisible).toBe(true)
    expect(extrudeVm?.localDepthMm).toBe(32)
    expect(extrudeVm?.effectiveDepthMm).toBe(32)
    expect(extrudeVm?.localStartDepthMm).toBe(32)
    expect(extrudeVm?.effectiveStartDepthMm).toBe(32)
    expect(extrudeVm?.startDepthDriven).toBe(false)
    expect(extrudeVm?.localEndDepthMm).toBe(32)
    expect(extrudeVm?.effectiveEndDepthMm).toBe(32)
    expect(extrudeVm?.endDepthDriven).toBe(false)
  })

  it('keeps split depth row ownership honest when TwoSides start and end depth rows are wire-driven', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-start-depth-driver',
          type: 'Param/Number',
          params: { value: 12 },
        },
        {
          nodeId: 'node-end-depth-driver',
          type: 'Param/Number',
          params: { value: 18 },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            extrudeDirection: 'TwoSides',
            depthMm: 20,
            startDepthMm: 6,
            endDepthMm: 7,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-start-depth-drive',
          from: { nodeId: 'node-start-depth-driver', portId: 'value' },
          to: { nodeId: 'node-extrude-1', portId: 'StartDepth' },
        },
        {
          edgeId: 'edge-end-depth-drive',
          from: { nodeId: 'node-end-depth-driver', portId: 'value' },
          to: { nodeId: 'node-extrude-1', portId: 'EndDepth' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.extrudeDirection).toBe('TwoSides')
    expect(extrudeVm?.localExtrudeDirection).toBe('TwoSides')
    expect(extrudeVm?.directionDriven).toBe(false)
    expect(extrudeVm?.depthVisible).toBe(false)
    expect(extrudeVm?.startDepthVisible).toBe(true)
    expect(extrudeVm?.endDepthVisible).toBe(true)
    expect(extrudeVm?.localStartDepthMm).toBe(6)
    expect(extrudeVm?.effectiveStartDepthMm).toBe(12)
    expect(extrudeVm?.startDepthDriven).toBe(true)
    expect(extrudeVm?.localEndDepthMm).toBe(7)
    expect(extrudeVm?.effectiveEndDepthMm).toBe(18)
    expect(extrudeVm?.endDepthDriven).toBe(true)
  })

  it('marks whole-port SketchProfiles aggregate extrude targets explicitly in the selector vm', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 40, y: 0 }),
              lineComponent('row-2', 'e2', { x: 40, y: 0 }, { x: 40, y: 20 }),
              lineComponent('row-3', 'e3', { x: 40, y: 20 }, { x: 0, y: 20 }),
              lineComponent('row-4', 'e4', { x: 0, y: 20 }, { x: 0, y: 0 }),
              lineComponent('row-5', 'e5', { x: 60, y: 0 }, { x: 90, y: 0 }),
              lineComponent('row-6', 'e6', { x: 90, y: 0 }, { x: 90, y: 15 }),
              lineComponent('row-7', 'e7', { x: 90, y: 15 }, { x: 60, y: 15 }),
              lineComponent('row-8', 'e8', { x: 60, y: 15 }, { x: 60, y: 0 }),
            ]),
          },
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
          edgeId: 'edge-sketch-profiles',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.profileTargetMode).toBe('allFromSketch')
    expect(extrudeVm?.profileCount).toBe(2)
    expect(extrudeVm?.hasProfile).toBe(true)
    expect(extrudeVm?.bodyId).toBe('node-extrude-1:body')
  })

  it('marks SketchProfile extrude targets explicitly as singular in the selector vm', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(
              [
                lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 40, y: 0 }),
                lineComponent('row-2', 'e2', { x: 40, y: 0 }, { x: 40, y: 20 }),
                lineComponent('row-3', 'e3', { x: 40, y: 20 }, { x: 0, y: 20 }),
                lineComponent('row-4', 'e4', { x: 0, y: 20 }, { x: 0, y: 0 }),
                lineComponent('row-5', 'e5', { x: 60, y: 0 }, { x: 90, y: 0 }),
                lineComponent('row-6', 'e6', { x: 90, y: 0 }, { x: 90, y: 15 }),
                lineComponent('row-7', 'e7', { x: 90, y: 15 }, { x: 60, y: 15 }),
                lineComponent('row-8', 'e8', { x: 60, y: 15 }, { x: 60, y: 0 }),
              ],
              { selectedProfileId: profileIdFromSignature('e5|e6|e7|e8') },
            ),
          },
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
          edgeId: 'edge-sketch-profile',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfile' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.profileTargetMode).toBe('single')
    expect(extrudeVm?.profileCount).toBe(1)
    expect(extrudeVm?.hasProfile).toBe(true)
    expect(extrudeVm?.profileId).toBe(profileIdFromSignature('e5|e6|e7|e8'))
    expect(extrudeVm?.bodyId).toBe('node-extrude-1:body')
  })

  it('treats revealed sketch profile member output ports as singular extrude targets in the selector vm', () => {
    const selectedProfileId = profileIdFromSignature('e5|e6|e7|e8')
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(
              [
                lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 40, y: 0 }),
                lineComponent('row-2', 'e2', { x: 40, y: 0 }, { x: 40, y: 20 }),
                lineComponent('row-3', 'e3', { x: 40, y: 20 }, { x: 0, y: 20 }),
                lineComponent('row-4', 'e4', { x: 0, y: 20 }, { x: 0, y: 0 }),
                lineComponent('row-5', 'e5', { x: 60, y: 0 }, { x: 90, y: 0 }),
                lineComponent('row-6', 'e6', { x: 90, y: 0 }, { x: 90, y: 15 }),
                lineComponent('row-7', 'e7', { x: 90, y: 15 }, { x: 60, y: 15 }),
                lineComponent('row-8', 'e8', { x: 60, y: 15 }, { x: 60, y: 0 }),
              ],
              { selectedProfileId },
            ),
          },
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
          edgeId: 'edge-sketch-profile-member',
          from: {
            nodeId: 'node-sketch-1',
            portId: buildSketchProfileMemberPortId(selectedProfileId),
          },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.profileTargetMode).toBe('single')
    expect(extrudeVm?.profileCount).toBe(1)
    expect(extrudeVm?.hasProfile).toBe(true)
    expect(extrudeVm?.profileId).toBe(selectedProfileId)
    expect(extrudeVm?.bodyId).toBe('node-extrude-1:body')
  })

  it('surfaces one profile input entry per actual aggregate and singular extrude connection', () => {
    const selectedProfileId = profileIdFromSignature('e5|e6|e7|e8')
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(
              [
                lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 40, y: 0 }),
                lineComponent('row-2', 'e2', { x: 40, y: 0 }, { x: 40, y: 20 }),
                lineComponent('row-3', 'e3', { x: 40, y: 20 }, { x: 0, y: 20 }),
                lineComponent('row-4', 'e4', { x: 0, y: 20 }, { x: 0, y: 0 }),
                lineComponent('row-5', 'e5', { x: 60, y: 0 }, { x: 90, y: 0 }),
                lineComponent('row-6', 'e6', { x: 90, y: 0 }, { x: 90, y: 15 }),
                lineComponent('row-7', 'e7', { x: 90, y: 15 }, { x: 60, y: 15 }),
                lineComponent('row-8', 'e8', { x: 60, y: 15 }, { x: 60, y: 0 }),
              ],
              { selectedProfileId },
            ),
          },
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
          edgeId: 'edge-sketch-profiles',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-sketch-profile-member',
          from: {
            nodeId: 'node-sketch-1',
            portId: buildSketchProfileMemberPortId(selectedProfileId),
          },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.profileInputEntries).toEqual([
      {
        endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profiles'),
        entryId: 'edge-sketch-profiles',
        kind: 'aggregate',
        label: 'SketchProfiles',
        sourceNodeId: 'node-sketch-1',
        sourceNodeLabel: 'Sketch',
      },
      {
        endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profile-member'),
        entryId: 'edge-sketch-profile-member',
        kind: 'single',
        label: 'SketchProfile',
        sourceNodeId: 'node-sketch-1',
        sourceNodeLabel: 'Sketch',
        profileId: selectedProfileId,
      },
    ])
  })

  it('ignores invalid non-profile inputs when building extrude profile entry identity', () => {
    const selectedProfileId = profileIdFromSignature('e5|e6|e7|e8')
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(
              [
                lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 40, y: 0 }),
                lineComponent('row-2', 'e2', { x: 40, y: 0 }, { x: 40, y: 20 }),
                lineComponent('row-3', 'e3', { x: 40, y: 20 }, { x: 0, y: 20 }),
                lineComponent('row-4', 'e4', { x: 0, y: 20 }, { x: 0, y: 0 }),
                lineComponent('row-5', 'e5', { x: 60, y: 0 }, { x: 90, y: 0 }),
                lineComponent('row-6', 'e6', { x: 90, y: 0 }, { x: 90, y: 15 }),
                lineComponent('row-7', 'e7', { x: 90, y: 15 }, { x: 60, y: 15 }),
                lineComponent('row-8', 'e8', { x: 60, y: 15 }, { x: 60, y: 0 }),
              ],
              { selectedProfileId },
            ),
          },
        },
        {
          nodeId: 'node-number-1',
          type: 'Param/Number',
          params: { value: 42 },
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
          edgeId: 'edge-number-invalid',
          from: { nodeId: 'node-number-1', portId: 'value' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-sketch-profile-member',
          from: {
            nodeId: 'node-sketch-1',
            portId: buildSketchProfileMemberPortId(selectedProfileId),
          },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const extrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(extrudeVm?.profileInputEntries).toEqual([
      {
        endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profile-member'),
        entryId: 'edge-sketch-profile-member',
        kind: 'single',
        label: 'SketchProfile',
        sourceNodeId: 'node-sketch-1',
        sourceNodeLabel: 'Sketch',
        profileId: selectedProfileId,
      },
    ])
    expect(extrudeVm?.profileTargetMode).toBe('single')
  })
})
