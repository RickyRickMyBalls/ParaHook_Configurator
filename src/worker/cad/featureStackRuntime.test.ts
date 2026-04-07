import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { SpaghettiGraph } from '../../app/spaghetti/schema/spaghettiTypes'
import type { NodeDefinition } from '../../app/spaghetti/registry/nodeRegistry'
import type { PortSpec, PortType } from '../../app/spaghetti/schema/spaghettiTypes'

const makeFixtureNodeDef = (config: {
  label: string
  outputs: PortSpec[]
}): NodeDefinition =>
  ({
    type: 'Primitive/Number',
    label: config.label,
    paramsSchema: z
      .object({
        value: z.number(),
      })
      .strict(),
    inputs: [],
    outputs: config.outputs,
    compute: ({ params }: { params: { value: number } }) => ({
      value: params.value,
    }),
  }) as unknown as NodeDefinition

const numberMmType: PortType = { kind: 'number', unit: 'mm' }

const fixtureNodeDefs: Record<string, NodeDefinition> = {
  'Test/NumberMmSource': makeFixtureNodeDef({
    label: 'Test Number Source (mm)',
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: numberMmType,
      },
    ],
  }),
}

vi.mock('../../app/spaghetti/registry/nodeRegistry', async () => {
  const actual = await vi.importActual<typeof import('../../app/spaghetti/registry/nodeRegistry')>(
    '../../app/spaghetti/registry/nodeRegistry',
  )
  return {
    ...actual,
    getNodeDef: (type: string) => fixtureNodeDefs[type] ?? actual.getNodeDef(type),
  }
})

import { compileSpaghettiGraph } from '../../app/spaghetti/compiler/compileGraph'
import { getDefaultNodeParams } from '../../app/spaghetti/registry/nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../../app/spaghetti/system/outputPreviewNode'
import { buildModel } from '../buildModel'
import type { CompiledBuildData } from '../../shared/buildTypes'
import { createViewerGeometryFromArtifactMesh } from '../../viewer/artifactMeshGeometry'
import {
  executeFeatureStack,
  type FeatureStackIRPayload,
} from './featureStackRuntime'
import { createDefaultSketchPlaneTransform } from '../../app/spaghetti/features/featureTypes'

const rectangleVertices = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 5 },
  { x: 0, y: 5 },
]

const emptyProfileLoop = {
  segments: [],
  winding: 'CCW' as const,
}

const resolvedProfile = (
  profileId: string,
  area: number,
  verticesProxy: Array<{ x: number; y: number }> = rectangleVertices,
) => ({
  profileId,
  profileIndex: 0,
  area,
  loop: emptyProfileLoop,
  verticesProxy,
})

const profileRef = (sketchFeatureId: string, profileId: string) => ({
  sketchFeatureId,
  profileId,
  profileIndex: 0,
})

const defaultExtrudeFields = {
  extrudeType: 'Body' as const,
  taperResolved: 0,
  offsetResolved: 0,
}

const roundMeshSlice = (values: number[]): number[] =>
  values.map((value) => Number(value.toFixed(6)))

const basePayload = (): FeatureStackIRPayload => ({
  schemaVersion: 1,
  parts: {
    baseplate: [
      {
        op: 'sketch',
        featureId: 'sketch-1',
        profilesResolved: [
          resolvedProfile('prof-a', 50),
        ],
      },
      {
        op: 'extrude',
        featureId: 'extrude-1',
        profileRef: profileRef('sketch-1', 'prof-a'),
        ...defaultExtrudeFields,
        depthResolved: 3,
        bodyId: 'body-a',
      },
    ],
  },
})

const compiledBuildDataFromResolvedShared = (
  resolvedShared: Record<string, unknown>,
): CompiledBuildData => ({
  orderedPartKeys: Object.keys(
    ((resolvedShared.sp_featureStackIR as { parts?: Record<string, unknown> } | undefined)?.parts ??
      {}) as Record<string, unknown>,
  ),
  resolvedParts: {},
  resolvedShared,
  outputEntries: [],
})

const compiledBuildDataFromCompileResult = (
  compileResult: ReturnType<typeof compileSpaghettiGraph>,
): CompiledBuildData => ({
  orderedPartKeys: compileResult.buildInputs?.orderedPartKeys ?? [],
  resolvedParts: compileResult.buildInputs?.resolvedParts ?? {},
  ...(compileResult.buildInputs?.resolvedShared !== undefined
    ? { resolvedShared: compileResult.buildInputs.resolvedShared }
    : {}),
  outputEntries: [],
})

const cubeGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'n-width',
      type: 'Test/NumberMmSource',
      params: {
        value: 15,
      },
    },
    {
      nodeId: 'n-length',
      type: 'Test/NumberMmSource',
      params: {
        value: 30,
      },
    },
    {
      nodeId: 'n-height',
      type: 'Test/NumberMmSource',
      params: {
        value: 25,
      },
    },
    {
      nodeId: 'n-cube',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
    {
      nodeId: 'n-output-preview',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: {
        slots: [{ slotId: 's001' }],
        nextSlotIndex: 2,
      },
    },
  ],
  edges: [
    {
      edgeId: 'e-cube-width',
      from: {
        nodeId: 'n-width',
        portId: 'value',
      },
      to: {
        nodeId: 'n-cube',
        portId: 'fs:in:cube-sketch-1:sketchRect:width',
      },
    },
    {
      edgeId: 'e-cube-length',
      from: {
        nodeId: 'n-length',
        portId: 'value',
      },
      to: {
        nodeId: 'n-cube',
        portId: 'fs:in:cube-sketch-1:sketchRect:length',
      },
    },
    {
      edgeId: 'e-cube-height',
      from: {
        nodeId: 'n-height',
        portId: 'value',
      },
      to: {
        nodeId: 'n-cube',
        portId: 'fs:in:cube-extrude-1:extrude:depth',
      },
    },
    {
      edgeId: 'e-cube-preview',
      from: {
        nodeId: 'n-cube',
        portId: 'solid',
      },
      to: {
        nodeId: 'n-output-preview',
        portId: 'in:solid:s001',
      },
    },
  ],
})

const defaultCubeGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'n-cube',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
    {
      nodeId: 'n-output-preview',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: {
        slots: [{ slotId: 's001' }],
        nextSlotIndex: 2,
      },
    },
  ],
  edges: [
    {
      edgeId: 'e-cube-preview',
      from: {
        nodeId: 'n-cube',
        portId: 'solid',
      },
      to: {
        nodeId: 'n-output-preview',
        portId: 'in:solid:s001',
      },
    },
  ],
})

const disabledCubeExtrudeGraph = (): SpaghettiGraph => {
  const params = getDefaultNodeParams('Part/Cube') as { featureStack: Array<Record<string, unknown>> }
  return {
    schemaVersion: 1,
    nodes: [
      {
        nodeId: 'n-cube',
        type: 'Part/Cube',
        params: {
          ...params,
          featureStack: params.featureStack.map((feature, index) =>
            index === 1
              ? {
                  ...feature,
                  enabled: false,
                }
              : feature,
          ),
        },
      },
      {
        nodeId: 'n-output-preview',
        type: OUTPUT_PREVIEW_NODE_TYPE,
        params: {
          slots: [{ slotId: 's001' }],
          nextSlotIndex: 2,
        },
      },
    ],
    edges: [
      {
        edgeId: 'e-cube-preview',
        from: {
          nodeId: 'n-cube',
          portId: 'solid',
        },
        to: {
          nodeId: 'n-output-preview',
          portId: 'in:solid:s001',
        },
      },
    ],
  }
}

describe('executeFeatureStack', () => {
  it('builds a rectangle extrude body', () => {
    const result = executeFeatureStack(basePayload())
    expect(Object.keys(result.bodies)).toEqual(['baseplate:body-a'])
    expect(result.bodies['baseplate:body-a'].mesh.vertices.length).toBeGreaterThan(0)
    expect(result.bodies['baseplate:body-a'].mesh.indices.length).toBeGreaterThan(0)
    expect(result.diagnostics).toEqual([])
  })

  it('supports multiple profile extrudes', () => {
    const payload = basePayload()
    payload.parts.baseplate[0] = {
      op: 'sketch',
      featureId: 'sketch-1',
      profilesResolved: [
        resolvedProfile('prof-a', 50),
        resolvedProfile('prof-b', 9, [
          { x: 20, y: 0 },
          { x: 23, y: 0 },
          { x: 23, y: 3 },
          { x: 20, y: 3 },
        ]),
      ],
    }
    payload.parts.baseplate.push({
      op: 'extrude',
      featureId: 'extrude-2',
      profileRef: profileRef('sketch-1', 'prof-b'),
      ...defaultExtrudeFields,
      depthResolved: 2,
      bodyId: 'body-b',
    })

    const result = executeFeatureStack(payload)
    expect(Object.keys(result.bodies)).toEqual(['baseplate:body-a', 'baseplate:body-b'])
  })

  it('sorts body output deterministically', () => {
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        zPart: [
          {
            op: 'sketch',
            featureId: 'z-sketch',
            profilesResolved: [resolvedProfile('z-prof', 1)],
          },
          {
            op: 'extrude',
            featureId: 'z-extrude',
            profileRef: profileRef('z-sketch', 'z-prof'),
            ...defaultExtrudeFields,
            depthResolved: 1,
            bodyId: 'body-z',
          },
        ],
        aPart: [
          {
            op: 'sketch',
            featureId: 'a-sketch',
            profilesResolved: [resolvedProfile('a-prof', 1)],
          },
          {
            op: 'extrude',
            featureId: 'a-extrude',
            profileRef: profileRef('a-sketch', 'a-prof'),
            ...defaultExtrudeFields,
            depthResolved: 1,
            bodyId: 'body-a',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)
    expect(Object.keys(result.bodies)).toEqual(['aPart:body-a', 'zPart:body-z'])
    expect(result.bodyTrace.map((item) => item.partKey)).toEqual(['aPart', 'zPart'])
  })

  it('keeps same bodyId valid across different part keys', () => {
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        'cube#2': [
          {
            op: 'sketch',
            featureId: 'cube-2-sketch',
            profilesResolved: [resolvedProfile('prof-2', 1)],
          },
          {
            op: 'extrude',
            featureId: 'cube-2-extrude',
            profileRef: profileRef('cube-2-sketch', 'prof-2'),
            ...defaultExtrudeFields,
            depthResolved: 1,
            bodyId: 'cube-body-1',
          },
        ],
        'cube#1': [
          {
            op: 'sketch',
            featureId: 'cube-1-sketch',
            profilesResolved: [resolvedProfile('prof-1', 1)],
          },
          {
            op: 'extrude',
            featureId: 'cube-1-extrude',
            profileRef: profileRef('cube-1-sketch', 'prof-1'),
            ...defaultExtrudeFields,
            depthResolved: 1,
            bodyId: 'cube-body-1',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)

    expect(Object.keys(result.bodies)).toEqual(['cube#1:cube-body-1', 'cube#2:cube-body-1'])
    expect(result.diagnostics).toEqual([])
    expect(result.bodyTrace.map((item) => item.bodyKey)).toEqual([
      'cube#1:cube-body-1',
      'cube#2:cube-body-1',
    ])
  })

  it('handles missing profileRef safely', () => {
    const payload = basePayload()
    payload.parts.baseplate[1] = {
      op: 'extrude',
      featureId: 'extrude-1',
      profileRef: null,
      ...defaultExtrudeFields,
      depthResolved: 3,
      bodyId: 'body-a',
    }

    const result = executeFeatureStack(payload)
    expect(result.bodies).toEqual({})
    expect(result.diagnostics.some((item) => item.reason === 'missing_profile_ref')).toBe(true)
  })

  it('keeps first body on duplicate bodyId', () => {
    const payload = basePayload()
    payload.parts.baseplate.push({
      op: 'extrude',
      featureId: 'extrude-2',
      profileRef: profileRef('sketch-1', 'prof-a'),
      ...defaultExtrudeFields,
      depthResolved: 6,
      bodyId: 'body-a',
    })

    const result = executeFeatureStack(payload)
    expect(Object.keys(result.bodies)).toEqual(['baseplate:body-a'])
    expect(
      result.diagnostics.some((item) => item.reason === 'duplicate_body_id'),
    ).toBe(true)
  })

  it('extrudes along the referenced sketch plane normal for non-XY graph-native extrudes', () => {
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        extrude: [
          {
            op: 'sketch',
            featureId: 'graph-sketch',
            plane: 'XZ',
            profilesResolved: [resolvedProfile('prof-xz', 50)],
          },
          {
            op: 'extrude',
            featureId: 'graph-extrude',
            profileRef: profileRef('graph-sketch', 'prof-xz'),
            ...defaultExtrudeFields,
            plane: 'XZ',
            depthResolved: 4,
            bodyId: 'body-xz',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)
    const shape = result.bodies['extrude:body-xz']

    expect(shape).toBeDefined()
    expect(shape?.mesh.vertices.slice(0, 6)).toEqual([0, 0, 0, 10, 0, 0])
    expect(shape?.mesh.vertices).toContain(4)
  })

  it('extrudes graph-native sketches from the authored transformed plane frame', () => {
    const planeTransform = {
      ...createDefaultSketchPlaneTransform(),
      translation: { x: 10, y: -2, z: 5 },
      rotationDeg: { x: 0, y: 0, z: 90 },
    }
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        extrude: [
          {
            op: 'sketch',
            featureId: 'graph-sketch',
            plane: 'XY',
            planeTransform,
            profilesResolved: [resolvedProfile('prof-xy', 50)],
          },
          {
            op: 'extrude',
            featureId: 'graph-extrude',
            profileRef: profileRef('graph-sketch', 'prof-xy'),
            ...defaultExtrudeFields,
            plane: 'XY',
            planeTransform,
            depthResolved: 4,
            bodyId: 'body-xy',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)
    const shape = result.bodies['extrude:body-xy']

    expect(shape).toBeDefined()
    expect(roundMeshSlice(shape?.mesh.vertices.slice(0, 12) ?? [])).toEqual([
      10, -2, 5, 10, 8, 5, 5, 8, 5, 5, -2, 5,
    ])
    expect(roundMeshSlice(shape?.mesh.vertices.slice(12, 24) ?? [])).toEqual([
      10, -2, 9, 10, 8, 9, 5, 8, 9, 5, -2, 9,
    ])
    expect(result.diagnostics).toEqual([])
  })

  it('emits uncapped side-wall geometry when extrudeType is Walls', () => {
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        extrude: [
          {
            op: 'sketch',
            featureId: 'graph-sketch',
            plane: 'XY',
            profilesResolved: [resolvedProfile('prof-xy', 50)],
          },
          {
            op: 'extrude',
            featureId: 'graph-extrude',
            profileRef: profileRef('graph-sketch', 'prof-xy'),
            extrudeType: 'Walls',
            taperResolved: 0,
            offsetResolved: 0,
            plane: 'XY',
            depthResolved: 4,
            bodyId: 'body-xy',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)
    const shape = result.bodies['extrude:body-xy']

    expect(shape).toBeDefined()
    expect(shape?.mesh.vertices.length).toBe(24)
    expect(shape?.mesh.indices.length).toBe(24)
    expect(result.diagnostics).toEqual([])
  })

  it('executes TwoSides graph-native extrudes across the authored start and end depths', () => {
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        extrude: [
          {
            op: 'sketch',
            featureId: 'graph-sketch',
            plane: 'XY',
            profilesResolved: [resolvedProfile('prof-xy', 50)],
          },
          {
            op: 'extrude',
            featureId: 'graph-extrude',
            profileRef: profileRef('graph-sketch', 'prof-xy'),
            extrudeType: 'Body',
            extrudeDirection: 'TwoSides',
            depthResolved: 11,
            startDepthResolved: 4,
            endDepthResolved: 7,
            taperResolved: 0,
            offsetResolved: 0,
            plane: 'XY',
            bodyId: 'body-xy',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)
    const shape = result.bodies['extrude:body-xy']
    const zValues = (shape?.mesh.vertices ?? []).filter((_, index) => index % 3 === 2)

    expect(shape).toBeDefined()
    expect(Math.min(...zValues)).toBe(-4)
    expect(Math.max(...zValues)).toBe(7)
    expect(result.diagnostics).toEqual([])
  })

  it('executes Symmetric graph-native extrudes equally on both sides of the sketch plane', () => {
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        extrude: [
          {
            op: 'sketch',
            featureId: 'graph-sketch',
            plane: 'XY',
            profilesResolved: [resolvedProfile('prof-xy', 50)],
          },
          {
            op: 'extrude',
            featureId: 'graph-extrude',
            profileRef: profileRef('graph-sketch', 'prof-xy'),
            extrudeType: 'Body',
            extrudeDirection: 'Symmetric',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            plane: 'XY',
            bodyId: 'body-xy',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)
    const shape = result.bodies['extrude:body-xy']
    const zValues = (shape?.mesh.vertices ?? []).filter((_, index) => index % 3 === 2)

    expect(shape).toBeDefined()
    expect(Math.min(...zValues)).toBe(-10)
    expect(Math.max(...zValues)).toBe(10)
    expect(result.diagnostics).toEqual([])
  })

  it('emits a direction-aware invalid-depth diagnostic for TwoSides when one split depth is not positive', () => {
    const payload: FeatureStackIRPayload = {
      schemaVersion: 1,
      parts: {
        extrude: [
          {
            op: 'sketch',
            featureId: 'graph-sketch',
            plane: 'XY',
            profilesResolved: [resolvedProfile('prof-xy', 50)],
          },
          {
            op: 'extrude',
            featureId: 'graph-extrude',
            profileRef: profileRef('graph-sketch', 'prof-xy'),
            extrudeType: 'Body',
            extrudeDirection: 'TwoSides',
            depthResolved: 5,
            startDepthResolved: 0,
            endDepthResolved: 5,
            taperResolved: 0,
            offsetResolved: 0,
            plane: 'XY',
            bodyId: 'body-xy',
          },
        ],
      },
    }

    const result = executeFeatureStack(payload)

    expect(result.bodies).toEqual({})
    expect(result.diagnostics).toEqual([
      {
        partKey: 'extrude',
        featureId: 'graph-extrude',
        reason: 'invalid_extrude_depth',
        message: 'Extrude skipped because TwoSides requires positive depth values.',
      },
    ])
  })
})

describe('buildModel diagnostics flush', () => {
  it('keeps cube default dimensions renderable when no cube dimension wires are present', async () => {
    const compileResult = compileSpaghettiGraph(defaultCubeGraph())
    expect(compileResult.ok).toBe(true)

    const parts = await buildModel({
      compiledBuildData: compiledBuildDataFromCompileResult(compileResult),
    })

    expect(parts.find((part) => part.partKeyStr === 'cube')).toEqual(
      expect.objectContaining({
        id: 'cube',
        label: 'Cube',
        kind: 'mesh',
        partKeyStr: 'cube',
        partKey: {
          id: 'cube',
          instance: null,
        },
      }),
    )
  })

  it('emits a deterministic cube PartArtifact from compiled graph Feature Stack IR', async () => {
    const compileResult = compileSpaghettiGraph(cubeGraph())
    expect(compileResult.ok).toBe(true)
    expect(compileResult.buildInputs).toBeDefined()

    const compiledBuildData = compiledBuildDataFromCompileResult(compileResult)

    const parts = await buildModel({
      compiledBuildData,
    })
    const repeated = await buildModel({
      compiledBuildData,
    })

    const cube = parts.find((part) => part.partKeyStr === 'cube')
    expect(repeated).toEqual(parts)
    expect(cube).toEqual(
      expect.objectContaining({
        id: 'cube',
        label: 'Cube',
        kind: 'mesh',
        partKeyStr: 'cube',
        partKey: {
          id: 'cube',
          instance: null,
        },
      }),
    )
  })

  it('emits deterministic multi-part cube PartArtifacts from compiled graph Feature Stack IR', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-cube-b',
          type: 'Part/Cube',
          params: getDefaultNodeParams('Part/Cube'),
        },
        {
          nodeId: 'n-cube-a',
          type: 'Part/Cube',
          params: getDefaultNodeParams('Part/Cube'),
        },
      ],
      edges: [],
    }

    const compileResult = compileSpaghettiGraph(graph)
    expect(compileResult.ok).toBe(true)

    const parts = await buildModel({
      compiledBuildData: compiledBuildDataFromCompileResult(compileResult),
    })

    expect(parts.map((part) => part.partKeyStr)).toEqual(
      expect.arrayContaining(['cube#1', 'cube#2']),
    )
    expect(parts.find((part) => part.partKeyStr === 'cube#1')?.label).toBe('Cube #1')
    expect(parts.find((part) => part.partKeyStr === 'cube#2')?.label).toBe('Cube #2')
  })

  it('emits a graph-native Extrude PartArtifact from Geometry/Sketch -> Geometry/Extrude IR', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'YZ',
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'line-1',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 20, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 20, y: 0 },
                  b: { kind: 'lit', x: 20, y: 10 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 20, y: 10 },
                  b: { kind: 'lit', x: 0, y: 10 },
                },
                {
                  rowId: 'row-4',
                  componentId: 'line-4',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 10 },
                  b: { kind: 'lit', x: 0, y: 0 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            depthMm: 5,
          },
        },
        {
          nodeId: 'n-output-preview',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profile',
          from: {
            nodeId: 'n-sketch',
            portId: 'SketchProfile',
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
        {
          edgeId: 'e-extrude-preview',
          from: {
            nodeId: 'n-extrude',
            portId: 'SolidBody',
          },
          to: {
            nodeId: 'n-output-preview',
            portId: 'in:solid:s001',
          },
        },
      ],
    }

    const compileResult = compileSpaghettiGraph(graph)
    expect(compileResult.ok).toBe(true)

    const parts = await buildModel({
      compiledBuildData: compiledBuildDataFromCompileResult(compileResult),
    })

    expect(parts.find((part) => part.partKeyStr === 'extrude')).toEqual(
      expect.objectContaining({
        id: 'extrude',
        label: 'Extrude',
        kind: 'mesh',
        partKeyStr: 'extrude',
        partKey: {
          id: 'extrude',
          instance: null,
        },
      }),
    )
  })

  it('emits a graph-native mesh PartArtifact for canonical compiled Geometry/Sketch -> Geometry/Extrude builds', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'YZ',
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'line-1',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 20, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 20, y: 0 },
                  b: { kind: 'lit', x: 20, y: 10 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 20, y: 10 },
                  b: { kind: 'lit', x: 0, y: 10 },
                },
                {
                  rowId: 'row-4',
                  componentId: 'line-4',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 10 },
                  b: { kind: 'lit', x: 0, y: 0 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            depthMm: 5,
          },
        },
        {
          nodeId: 'n-output-preview',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profile',
          from: {
            nodeId: 'n-sketch',
            portId: 'SketchProfile',
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
        {
          edgeId: 'e-extrude-preview',
          from: {
            nodeId: 'n-extrude',
            portId: 'SolidBody',
          },
          to: {
            nodeId: 'n-output-preview',
            portId: 'in:solid:s001',
          },
        },
      ],
    }

    const compileResult = compileSpaghettiGraph(graph)
    expect(compileResult.ok).toBe(true)
    expect(compileResult.buildInputs).toBeDefined()

    const parts = await buildModel({
      compiledBuildData: compiledBuildDataFromCompileResult(compileResult),
    })

    expect(parts.find((part) => part.partKeyStr === 'extrude')).toEqual(
      expect.objectContaining({
        id: 'extrude',
        label: 'Extrude',
        kind: 'mesh',
        partKeyStr: 'extrude',
        partKey: {
          id: 'extrude',
          instance: null,
        },
      }),
    )
    const extrude = parts.find((part) => part.partKeyStr === 'extrude')
    expect(extrude?.kind).toBe('mesh')
    if (extrude?.kind === 'mesh') {
      expect(extrude.mesh.vertices.length).toBeGreaterThan(0)
      expect(extrude.mesh.indices.length).toBeGreaterThan(0)
    }
  })

  it('keeps transformed graph-native extrude preview mesh aligned to the authored sketch plane frame', async () => {
    const planeTransform = {
      ...createDefaultSketchPlaneTransform(),
      translation: { x: 10, y: -2, z: 5 },
      rotationDeg: { x: 0, y: 0, z: 90 },
    }
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform,
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'line-1',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 10, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 10, y: 0 },
                  b: { kind: 'lit', x: 10, y: 5 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 10, y: 5 },
                  b: { kind: 'lit', x: 0, y: 5 },
                },
                {
                  rowId: 'row-4',
                  componentId: 'line-4',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 5 },
                  b: { kind: 'lit', x: 0, y: 0 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            depthMm: 4,
          },
        },
        {
          nodeId: 'n-output-preview',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profile',
          from: {
            nodeId: 'n-sketch',
            portId: 'SketchProfile',
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
        {
          edgeId: 'e-extrude-preview',
          from: {
            nodeId: 'n-extrude',
            portId: 'SolidBody',
          },
          to: {
            nodeId: 'n-output-preview',
            portId: 'in:solid:s001',
          },
        },
      ],
    }

    const compileResult = compileSpaghettiGraph(graph)
    expect(compileResult.ok).toBe(true)

    const parts = await buildModel({
      compiledBuildData: compiledBuildDataFromCompileResult(compileResult),
    })
    const extrude = parts.find((part) => part.partKeyStr === 'extrude')

    expect(extrude?.kind).toBe('mesh')
    if (extrude?.kind !== 'mesh') {
      return
    }

    const geometry = createViewerGeometryFromArtifactMesh(extrude.mesh)
    const positions = geometry?.getAttribute('position')

    expect(positions).not.toBeNull()
    expect(roundMeshSlice(Array.from((positions?.array ?? []) as ArrayLike<number>).slice(0, 12))).toEqual([
      10, -2, 5, 10, 8, 5, 5, 8, 5, 5, -2, 5,
    ])
    expect(roundMeshSlice(Array.from((positions?.array ?? []) as ArrayLike<number>).slice(12, 24))).toEqual([
      10, -2, 9, 10, 8, 9, 5, 8, 9, 5, -2, 9,
    ])
  })

  it('keeps graph-native extrude preview mesh on authored sketch-local coordinates away from the local origin', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: createDefaultSketchPlaneTransform(),
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'line-1',
                  type: 'line',
                  a: { kind: 'lit', x: 40, y: 15 },
                  b: { kind: 'lit', x: 70, y: 15 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 70, y: 15 },
                  b: { kind: 'lit', x: 68, y: 38 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 68, y: 38 },
                  b: { kind: 'lit', x: 40, y: 15 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            depthMm: 6,
          },
        },
        {
          nodeId: 'n-output-preview',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profile',
          from: {
            nodeId: 'n-sketch',
            portId: 'SketchProfile',
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
        {
          edgeId: 'e-extrude-preview',
          from: {
            nodeId: 'n-extrude',
            portId: 'SolidBody',
          },
          to: {
            nodeId: 'n-output-preview',
            portId: 'in:solid:s001',
          },
        },
      ],
    }

    const compileResult = compileSpaghettiGraph(graph)
    expect(compileResult.ok).toBe(true)

    const parts = await buildModel({
      compiledBuildData: compiledBuildDataFromCompileResult(compileResult),
    })
    const extrude = parts.find((part) => part.partKeyStr === 'extrude')

    expect(extrude?.kind).toBe('mesh')
    if (extrude?.kind !== 'mesh') {
      return
    }

    const geometry = createViewerGeometryFromArtifactMesh(extrude.mesh)
    const positions = geometry?.getAttribute('position')

    expect(positions).not.toBeNull()
    expect(roundMeshSlice(Array.from((positions?.array ?? []) as ArrayLike<number>).slice(0, 9))).toEqual([
      40, 15, 0, 70, 15, 0, 68, 38, 0,
    ])
    expect(roundMeshSlice(Array.from((positions?.array ?? []) as ArrayLike<number>).slice(9, 18))).toEqual([
      40, 15, 6, 70, 15, 6, 68, 38, 6,
    ])
  })

  it('keeps cube unresolved at runtime when the extrude feature is disabled', async () => {
    const compileResult = compileSpaghettiGraph(disabledCubeExtrudeGraph())
    expect(compileResult.ok).toBe(true)

    const parts = await buildModel({
      compiledBuildData: compiledBuildDataFromCompileResult(compileResult),
    })

    expect(parts.some((part) => part.partKeyStr === 'cube')).toBe(false)
  })

  it('builds an uncapped graph-native extrude mesh for Walls type', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'line-1',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 20, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 20, y: 0 },
                  b: { kind: 'lit', x: 20, y: 10 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 20, y: 10 },
                  b: { kind: 'lit', x: 0, y: 10 },
                },
                {
                  rowId: 'row-4',
                  componentId: 'line-4',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 10 },
                  b: { kind: 'lit', x: 0, y: 0 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Walls',
            depthMm: 5,
          },
        },
        {
          nodeId: 'n-output-preview',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profile',
          from: {
            nodeId: 'n-sketch',
            portId: 'SketchProfile',
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
        {
          edgeId: 'e-extrude-preview',
          from: {
            nodeId: 'n-extrude',
            portId: 'SolidBody',
          },
          to: {
            nodeId: 'n-output-preview',
            portId: 'in:solid:s001',
          },
        },
      ],
    }

    const compileResult = compileSpaghettiGraph(graph)
    expect(compileResult.ok).toBe(true)

    const parts = await buildModel({
      compiledBuildData: compiledBuildDataFromCompileResult(compileResult),
    })
    const extrude = parts.find((part) => part.partKeyStr === 'extrude')

    expect(extrude?.kind).toBe('mesh')
    if (extrude?.kind !== 'mesh') {
      return
    }

    expect(extrude.mesh.indices.length).toBe(24)
  })

  it('flushes unique warnings once per build', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await buildModel({
      compiledBuildData: compiledBuildDataFromResolvedShared({
        sp_featureStackIR: {
          schemaVersion: 1,
          parts: {
            baseplate: [
              {
                op: 'extrude',
                featureId: 'e1',
                profileRef: null,
                extrudeType: 'Body',
                depthResolved: 1,
                taperResolved: 0,
                offsetResolved: 0,
                bodyId: 'dup',
              },
              {
                op: 'extrude',
                featureId: 'e1',
                profileRef: null,
                extrudeType: 'Body',
                depthResolved: 1,
                taperResolved: 0,
                offsetResolved: 0,
                bodyId: 'dup',
              },
            ],
          },
        },
      }),
    })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockRestore()
  })
})
