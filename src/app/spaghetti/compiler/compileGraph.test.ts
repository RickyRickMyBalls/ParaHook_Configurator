import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import type { NodeDefinition } from '../registry/nodeRegistry'
import type { PortSpec, PortType } from '../schema/spaghettiTypes'
import { cloneOutputPreviewDefaultParams, OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

const signedAreaOpenLoop = (vertices: Array<{ x: number; y: number }>): number => {
  const open =
    vertices.length > 1 &&
    vertices[0].x === vertices[vertices.length - 1].x &&
    vertices[0].y === vertices[vertices.length - 1].y
      ? vertices.slice(0, -1)
      : vertices
  if (open.length < 3) {
    return 0
  }
  let sum = 0
  for (let index = 0; index < open.length - 1; index += 1) {
    const current = open[index]
    const next = open[index + 1]
    sum += current.x * next.y - next.x * current.y
  }
  const last = open[open.length - 1]
  const first = open[0]
  sum += last.x * first.y - first.x * last.y
  return sum * 0.5
}

const makeFixtureNodeDef = (config: {
  label: string
  inputs: PortSpec[]
  outputs: PortSpec[]
  paramsSchema?: NodeDefinition['paramsSchema']
  compute?: NodeDefinition['compute']
}): NodeDefinition =>
  ({
    type: 'Primitive/Number',
    label: config.label,
    paramsSchema: config.paramsSchema ?? z.object({}).strict(),
    inputs: config.inputs,
    outputs: config.outputs,
    compute: config.compute ?? (() => ({})),
  }) as unknown as NodeDefinition

const numberMmType: PortType = { kind: 'number', unit: 'mm' }
const numberDegType: PortType = { kind: 'number', unit: 'deg' }
const defaultPlaneTransform = createDefaultSketchPlaneTransform()

const fixtureNodeDefs: Record<string, NodeDefinition> = {
  'Test/NumberMmSource': makeFixtureNodeDef({
    label: 'Test Number Source (mm)',
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
        type: numberMmType,
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  }),
  'Test/NumberDegSource': makeFixtureNodeDef({
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
        type: numberDegType,
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
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

import { compileSpaghettiGraph, computeFeatureStackIrParts } from './compileGraph'
import { evaluateSpaghettiGraph } from './evaluateGraph'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import { createDefaultSketchPlaneTransform } from '../features/featureTypes'

const cubeNode = (nodeId: string = 'n-cube') => ({
  nodeId,
  type: 'Part/Cube',
  params: getDefaultNodeParams('Part/Cube'),
})

const outputPreviewNode = () => ({
  nodeId: 'n-output-preview',
  type: OUTPUT_PREVIEW_NODE_TYPE,
  params: {
    slots: [{ slotId: 's001' }],
    nextSlotIndex: 2,
  },
})

describe('compileSpaghettiGraph determinism', () => {
  it('returns stable output for identical graph input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    const first = compileSpaghettiGraph(graph)
    const second = compileSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(second).toEqual(first)
  })

  it('keeps build payload and diagnostics unchanged when OutputPreview node is present', () => {
    const withoutOutputPreview: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    const withOutputPreview: SpaghettiGraph = {
      ...withoutOutputPreview,
      nodes: [
        ...withoutOutputPreview.nodes,
        {
          nodeId: 'n-output-preview',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: cloneOutputPreviewDefaultParams(),
        },
      ],
    }

    const resultWithout = compileSpaghettiGraph(withoutOutputPreview)
    const resultWith = compileSpaghettiGraph(withOutputPreview)

    expect(resultWith.ok).toBe(resultWithout.ok)
    expect(resultWith.buildInputs).toEqual(resultWithout.buildInputs)
    expect(resultWith.diagnostics.errors).toEqual(resultWithout.diagnostics.errors)
    expect(resultWith.diagnostics.warnings).toEqual(resultWithout.diagnostics.warnings)
  })

  it('includes cube Feature Stack IR deterministically when width/length/height are wired into OutputPreview', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-width-source',
          type: 'Test/NumberMmSource',
          params: {
            value: 15,
          },
        },
        {
          nodeId: 'n-length-source',
          type: 'Test/NumberMmSource',
          params: {
            value: 30,
          },
        },
        {
          nodeId: 'n-height-source',
          type: 'Test/NumberMmSource',
          params: {
            value: 25,
          },
        },
        cubeNode(),
        outputPreviewNode(),
      ],
      edges: [
        {
          edgeId: 'e-cube-width',
          from: {
            nodeId: 'n-width-source',
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
            nodeId: 'n-length-source',
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
            nodeId: 'n-height-source',
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
    }

    const first = compileSpaghettiGraph(graph)
    const second = compileSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(second).toEqual(first)
    expect(first.buildInputs?.resolvedShared).toBeDefined()
    expect(first.buildInputs?.resolvedShared?.sp_featureStackIR).toBeDefined()

    const featureIr = first.buildInputs?.resolvedShared?.sp_featureStackIR as
      | {
          schemaVersion: 1
          parts?: Record<string, Array<{ op: string; featureId: string }>>
        }
      | undefined

    expect(featureIr?.schemaVersion).toBe(1)
    expect(featureIr?.parts?.cube).toEqual([
      {
        op: 'sketch',
        featureId: 'cube-sketch-1',
        plane: 'XY',
        planeTransform: defaultPlaneTransform,
        profilesResolved: [
          {
            area: 450,
            profileId: 'cube-profile-1',
            vertices: [
              { x: 0, y: 0 },
              { x: 30, y: 0 },
              { x: 30, y: 15 },
              { x: 0, y: 15 },
              { x: 0, y: 0 },
            ],
          },
        ],
      },
      {
        op: 'extrude',
        featureId: 'cube-extrude-1',
        profileRef: {
          sketchFeatureId: 'cube-sketch-1',
          profileId: 'cube-profile-1',
        },
        extrudeType: 'Body',
        depthResolved: 25,
        taperResolved: 0,
        offsetResolved: 0,
        bodyId: 'cube-body-1',
      },
    ])
  })

  it('assigns deterministic owned part keys for multiple supported part nodes', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        { nodeId: 'n-baseplate', type: 'Part/Baseplate', params: {} },
        cubeNode('n-cube-b'),
        cubeNode('n-cube-a'),
        { nodeId: 'n-toe-b', type: 'Part/ToeHook', params: {} },
        { nodeId: 'n-toe-a', type: 'Part/ToeHook', params: {} },
      ],
      edges: [],
    }

    const result = computeFeatureStackIrParts(graph)

    expect(result.orderedPartKeys).toEqual([
      'baseplate',
      'cube#1',
      'cube#2',
      'toeHook#1',
      'toeHook#2',
    ])
    expect(result.nodeIdToPartKey).toEqual({
      'n-baseplate': 'baseplate',
      'n-cube-a': 'cube#1',
      'n-cube-b': 'cube#2',
      'n-toe-a': 'toeHook#1',
      'n-toe-b': 'toeHook#2',
    })
  })

  it('emits deterministic multi-part Feature Stack IR payloads for repeated identical graphs', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        cubeNode('n-cube-b'),
        cubeNode('n-cube-a'),
      ],
      edges: [],
    }

    const first = compileSpaghettiGraph(graph)
    const second = compileSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(second).toEqual(first)
    expect(first.buildInputs?.orderedPartKeys).toEqual(['cube#1', 'cube#2'])

    const featureIr = first.buildInputs?.resolvedShared?.sp_featureStackIR as
      | {
          schemaVersion: 1
          parts?: Record<string, Array<{ op: string; featureId: string }>>
        }
      | undefined

    expect(Object.keys(featureIr?.parts ?? {})).toEqual(['cube#1', 'cube#2'])
  })

  it('keeps untouched cube dimensions on seeded defaults when only one dimension is wired', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-width-source',
          type: 'Test/NumberMmSource',
          params: {
            value: 12,
          },
        },
        cubeNode(),
        outputPreviewNode(),
      ],
      edges: [
        {
          edgeId: 'e-cube-width',
          from: {
            nodeId: 'n-width-source',
            portId: 'value',
          },
          to: {
            nodeId: 'n-cube',
            portId: 'fs:in:cube-sketch-1:sketchRect:width',
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
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)

    const featureIr = result.buildInputs?.resolvedShared?.sp_featureStackIR as
      | {
          schemaVersion: 1
          parts?: Record<string, Array<{ op: string; featureId: string; depthResolved?: number }>>
        }
      | undefined
    expect(featureIr?.parts?.cube).toEqual([
      {
        op: 'sketch',
        featureId: 'cube-sketch-1',
        plane: 'XY',
        planeTransform: defaultPlaneTransform,
        profilesResolved: [
          {
            area: 240,
            profileId: 'cube-profile-1',
            vertices: [
              { x: 0, y: 0 },
              { x: 20, y: 0 },
              { x: 20, y: 12 },
              { x: 0, y: 12 },
              { x: 0, y: 0 },
            ],
          },
        ],
      },
      {
        op: 'extrude',
        featureId: 'cube-extrude-1',
        profileRef: {
          sketchFeatureId: 'cube-sketch-1',
          profileId: 'cube-profile-1',
        },
        extrudeType: 'Body',
        depthResolved: 20,
        taperResolved: 0,
        offsetResolved: 0,
        bodyId: 'cube-body-1',
      },
    ])
  })

  it('keeps ToeHook payload key anchorSpline2 while resolving canonical anchorSpline input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-toehook',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-baseplate-to-toehook',
          from: {
            nodeId: 'n-baseplate',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'n-toehook',
            portId: 'anchorSpline',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.buildInputs).toBeDefined()

    const toeHookResolved = result.buildInputs?.resolvedParts['toeHook#1'] ?? {}
    expect(Object.prototype.hasOwnProperty.call(toeHookResolved, 'anchorSpline2')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(toeHookResolved, 'anchorSpline')).toBe(false)
  })

  it('keeps HeelKick payload key anchorSpline2 while resolving canonical anchorSpline input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-heelkick',
          type: 'Part/HeelKick',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-baseplate-to-heelkick',
          from: {
            nodeId: 'n-baseplate',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'n-heelkick',
            portId: 'anchorSpline',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.buildInputs).toBeDefined()

    const heelKickResolved = result.buildInputs?.resolvedParts['heelKick#1'] ?? {}
    expect(Object.prototype.hasOwnProperty.call(heelKickResolved, 'anchorSpline2')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(heelKickResolved, 'anchorSpline')).toBe(false)
  })

  it('keeps HeelKick legacy anchorSpline2 edge input working via fallback resolution', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-heelkick',
          type: 'Part/HeelKick',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-baseplate-to-heelkick-legacy',
          from: {
            nodeId: 'n-baseplate',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'n-heelkick',
            portId: 'anchorSpline2',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.buildInputs).toBeDefined()

    const heelKickResolved = result.buildInputs?.resolvedParts['heelKick#1'] ?? {}
    expect(Object.prototype.hasOwnProperty.call(heelKickResolved, 'anchorSpline2')).toBe(true)
    expect(heelKickResolved.anchorSpline2).not.toBeUndefined()
  })

  it('applies extrude depth virtual wire override deterministically in compiled Feature Stack IR', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Test/NumberMmSource',
          params: {
            value: 42,
          },
        },
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'extrude',
                featureId: 'feature-depth-1',
                inputs: {
                  profileRef: null,
                },
                params: {
                  depth: {
                    kind: 'lit',
                    value: 10,
                  },
                  taper: {
                    kind: 'lit',
                    value: 0,
                  },
                  offset: {
                    kind: 'lit',
                    value: 0,
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
      edges: [
        {
          edgeId: 'e-depth',
          from: {
            nodeId: 'n-source-mm',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:depth',
          },
        },
      ],
    }

    const first = compileSpaghettiGraph(graph)
    const second = compileSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(second).toEqual(first)

    const featureIr = first.buildInputs?.resolvedShared?.sp_featureStackIR as
      | {
          schemaVersion: 1
          parts?: Record<
            string,
            Array<{
              op: string
              featureId: string
              depthResolved?: number
              taperResolved?: number
              offsetResolved?: number
            }>
          >
        }
      | undefined
    const baseplateIr = featureIr?.parts?.baseplate ?? []
    const extrudeOp = baseplateIr.find(
      (op) => op.op === 'extrude' && op.featureId === 'feature-depth-1',
    )
    expect(extrudeOp?.depthResolved).toBe(42)
    expect(extrudeOp?.taperResolved).toBe(0)
    expect(extrudeOp?.offsetResolved).toBe(0)
  })

  it('applies extrude taper/offset virtual wire overrides deterministically in compiled Feature Stack IR', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Test/NumberMmSource',
          params: {
            value: 6,
          },
        },
        {
          nodeId: 'n-source-deg',
          type: 'Test/NumberDegSource',
          params: {
            value: 3,
          },
        },
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'extrude',
                featureId: 'feature-depth-2',
                inputs: {
                  profileRef: null,
                },
                params: {
                  depth: {
                    kind: 'lit',
                    value: 10,
                  },
                },
                outputs: {
                  bodyId: 'body-2',
                },
                uiState: {
                  collapsed: false,
                },
              },
            ],
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-offset',
          from: {
            nodeId: 'n-source-mm',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-2:extrude:offset',
          },
        },
        {
          edgeId: 'e-taper',
          from: {
            nodeId: 'n-source-deg',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-2:extrude:taper',
          },
        },
      ],
    }

    const first = compileSpaghettiGraph(graph)
    const second = compileSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(second).toEqual(first)

    const featureIr = first.buildInputs?.resolvedShared?.sp_featureStackIR as
      | {
          schemaVersion: 1
          parts?: Record<
            string,
            Array<{
              op: string
              featureId: string
              depthResolved?: number
              taperResolved?: number
              offsetResolved?: number
            }>
          >
        }
      | undefined
    const baseplateIr = featureIr?.parts?.baseplate ?? []
    const extrudeOp = baseplateIr.find(
      (op) => op.op === 'extrude' && op.featureId === 'feature-depth-2',
    )
    expect(extrudeOp?.depthResolved).toBe(10)
    expect(extrudeOp?.taperResolved).toBe(3)
    expect(extrudeOp?.offsetResolved).toBe(6)
  })

  it('emits byte-identical runtime payload for sketch->closeProfile->extrude curve fixture', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'sketch',
                featureId: 'feature-sketch-curve',
                plane: 'XY',
                components: [
                  {
                    rowId: 'row-1',
                    componentId: 'comp-1',
                    type: 'spline',
                    p0: { kind: 'lit', x: 0, y: 0 },
                    p1: { kind: 'lit', x: 3, y: 0 },
                    p2: { kind: 'lit', x: 3, y: 2 },
                    p3: { kind: 'lit', x: 2, y: 2 },
                  },
                  {
                    rowId: 'row-2',
                    componentId: 'comp-2',
                    type: 'line',
                    a: { kind: 'lit', x: 2, y: 2 },
                    b: { kind: 'lit', x: 2, y: 4 },
                  },
                  {
                    rowId: 'row-3',
                    componentId: 'comp-3',
                    type: 'line',
                    a: { kind: 'lit', x: 2, y: 4 },
                    b: { kind: 'lit', x: 0, y: 4 },
                  },
                  {
                    rowId: 'row-4',
                    componentId: 'comp-4',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 4 },
                    b: { kind: 'lit', x: 0, y: 0 },
                  },
                ],
                outputs: {
                  profiles: [
                    {
                      profileId: 'legacy-profile',
                      profileIndex: 0,
                      area: 1,
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
                type: 'closeProfile',
                featureId: 'feature-close-curve',
                inputs: {
                  sourceSketchFeatureId: 'feature-sketch-curve',
                },
                outputs: {
                  profileRef: {
                    sourceFeatureId: 'feature-sketch-curve',
                    profileId: 'legacy-profile',
                    profileIndex: 0,
                  },
                },
                uiState: {
                  collapsed: false,
                },
              },
              {
                type: 'extrude',
                featureId: 'feature-extrude-curve',
                inputs: {
                  profileRef: {
                    sourceFeatureId: 'feature-close-curve',
                    profileId: 'legacy-profile',
                    profileIndex: 0,
                  },
                },
                params: {
                  depth: {
                    kind: 'lit',
                    value: 5,
                  },
                },
                outputs: {
                  bodyId: 'body-curve',
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

    const first = compileSpaghettiGraph(graph)
    const second = compileSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(second.ok).toBe(true)

    const payloadA = first.buildInputs?.resolvedShared?.sp_featureStackIR
    const payloadB = second.buildInputs?.resolvedShared?.sp_featureStackIR
    expect(payloadA).toBeDefined()
    expect(payloadB).toBeDefined()
    expect(JSON.stringify(payloadA)).toBe(JSON.stringify(payloadB))

    const payload = payloadA as
      | {
          schemaVersion: 1
          parts: Record<
            string,
            Array<{
              op: string
              profilesResolved?: Array<{
                profileId: string
                area: number
                vertices: Array<{ x: number; y: number }>
              }>
            }>
          >
        }
      | undefined
    expect(payload?.schemaVersion).toBe(1)

    const baseplateOps = payload?.parts.baseplate ?? []
    expect(baseplateOps.length).toBeGreaterThan(0)
    expect(baseplateOps.every((operation) => operation.op === 'sketch' || operation.op === 'extrude')).toBe(
      true,
    )
    expect(baseplateOps.some((operation) => operation.op === 'closeProfile')).toBe(false)

    const sketchOp = baseplateOps.find((operation) => operation.op === 'sketch')
    expect(sketchOp?.profilesResolved?.length ?? 0).toBeGreaterThan(0)
    const vertices = sketchOp?.profilesResolved?.[0]?.vertices ?? []
    expect(vertices.length).toBeGreaterThan(2)
    expect(signedAreaOpenLoop(vertices)).toBeGreaterThanOrEqual(0)
  })

  it('compiles Geometry/Sketch -> Geometry/Extrude into graph-native runtime IR with the full selected sketch profile shape preserved', () => {
    const planeTransform = {
      ...createDefaultSketchPlaneTransform(),
      translation: { x: 12, y: -4, z: 7 },
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
              plane: 'XZ',
              planeTransform,
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'line-1',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 40, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 40, y: 0 },
                  b: { kind: 'lit', x: 40, y: 10 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 40, y: 10 },
                  b: { kind: 'lit', x: 20, y: 10 },
                },
                {
                  rowId: 'row-4',
                  componentId: 'line-4',
                  type: 'line',
                  a: { kind: 'lit', x: 20, y: 10 },
                  b: { kind: 'lit', x: 20, y: 20 },
                },
                {
                  rowId: 'row-5',
                  componentId: 'line-5',
                  type: 'line',
                  a: { kind: 'lit', x: 20, y: 20 },
                  b: { kind: 'lit', x: 0, y: 20 },
                },
                {
                  rowId: 'row-6',
                  componentId: 'line-6',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 20 },
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
            depthMm: 30,
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

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.buildInputs?.orderedPartKeys).toEqual(['extrude'])

    const featureIr = result.buildInputs?.resolvedShared?.sp_featureStackIR as
      | {
          schemaVersion: 1
          parts?: Record<string, Array<Record<string, unknown>>>
        }
      | undefined

    expect(featureIr?.parts?.extrude).toEqual([
      {
        op: 'sketch',
        featureId: 'n-sketch',
        plane: 'XZ',
        planeTransform,
        profilesResolved: [
          {
            profileId: expect.any(String),
            area: 600,
            vertices: [
              { x: 0, y: 0 },
              { x: 40, y: 0 },
              { x: 40, y: 10 },
              { x: 20, y: 10 },
              { x: 20, y: 20 },
              { x: 0, y: 20 },
              { x: 0, y: 0 },
            ],
          },
        ],
      },
      {
        op: 'extrude',
        featureId: 'n-extrude',
        profileRef: {
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
        },
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        depthResolved: 30,
        taperResolved: 0,
        offsetResolved: 0,
        plane: 'XZ',
        planeTransform,
        bodyId: 'n-extrude:body',
      },
    ])
  })

  it('keeps Geometry/Extrude walls type in the graph-native runtime IR payload', () => {
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
                  b: { kind: 'lit', x: 30, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 30, y: 0 },
                  b: { kind: 'lit', x: 30, y: 20 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 30, y: 20 },
                  b: { kind: 'lit', x: 0, y: 20 },
                },
                {
                  rowId: 'row-4',
                  componentId: 'line-4',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 20 },
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
            depthMm: 12,
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
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    expect(evaluation.ok).toBe(true)

    const result = computeFeatureStackIrParts(graph, {
      resolvedInputsByNodeId: evaluation.inputsByNodeId,
    })
    expect(result.warnings).toEqual([])

    const extrudeOp = result.parts.extrude?.find((operation) => operation.op === 'extrude') as
      | {
          op: 'extrude'
          extrudeType: 'Body' | 'Walls'
        }
      | undefined

    expect(extrudeOp?.extrudeType).toBe('Walls')
  })

  it('keeps Geometry/Extrude TwoSides direction with explicit split depths in the graph-native runtime IR payload', () => {
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
                  b: { kind: 'lit', x: 30, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 30, y: 0 },
                  b: { kind: 'lit', x: 30, y: 20 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 30, y: 20 },
                  b: { kind: 'lit', x: 0, y: 20 },
                },
                {
                  rowId: 'row-4',
                  componentId: 'line-4',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 20 },
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
            extrudeDirection: 'TwoSides',
            depthMm: 12,
            startDepthMm: 3,
            endDepthMm: 9,
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
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    expect(evaluation.ok).toBe(true)

    const result = computeFeatureStackIrParts(graph, {
      resolvedInputsByNodeId: evaluation.inputsByNodeId,
    })
    expect(result.warnings).toEqual([])

    const extrudeOp = result.parts.extrude?.find((operation) => operation.op === 'extrude') as
      | {
          op: 'extrude'
          extrudeDirection?: 'OneSide' | 'TwoSides' | 'Symmetric'
          depthResolved: number
          startDepthResolved?: number
          endDepthResolved?: number
        }
      | undefined

    expect(extrudeOp?.extrudeDirection).toBe('TwoSides')
    expect(extrudeOp?.depthResolved).toBe(12)
    expect(extrudeOp?.startDepthResolved).toBe(3)
    expect(extrudeOp?.endDepthResolved).toBe(9)
  })

  it('keeps Geometry/Extrude Symmetric direction in the graph-native runtime IR payload', () => {
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
                  b: { kind: 'lit', x: 30, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 30, y: 0 },
                  b: { kind: 'lit', x: 30, y: 20 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 30, y: 20 },
                  b: { kind: 'lit', x: 0, y: 20 },
                },
                {
                  rowId: 'row-4',
                  componentId: 'line-4',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 20 },
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
            extrudeDirection: 'Symmetric',
            depthMm: 6,
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
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    expect(evaluation.ok).toBe(true)

    const result = computeFeatureStackIrParts(graph, {
      resolvedInputsByNodeId: evaluation.inputsByNodeId,
    })
    expect(result.warnings).toEqual([])

    const extrudeOp = result.parts.extrude?.find((operation) => operation.op === 'extrude') as
      | {
          op: 'extrude'
          extrudeDirection?: 'OneSide' | 'TwoSides' | 'Symmetric'
          depthResolved: number
        }
      | undefined

    expect(extrudeOp?.extrudeDirection).toBe('Symmetric')
    expect(extrudeOp?.depthResolved).toBe(6)
  })

  it('preserves the selected sketch profile loop instead of rebuilding an empty loop proxy', () => {
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
                  b: { kind: 'lit', x: 30, y: 0 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'line-2',
                  type: 'line',
                  a: { kind: 'lit', x: 30, y: 0 },
                  b: { kind: 'lit', x: 0, y: 20 },
                },
                {
                  rowId: 'row-3',
                  componentId: 'line-3',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 20 },
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
            depthMm: 12,
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
      ],
    }

    const evaluation = evaluateSpaghettiGraph(graph)
    expect(evaluation.ok).toBe(true)

    const result = computeFeatureStackIrParts(graph, {
      resolvedInputsByNodeId: evaluation.inputsByNodeId,
    })
    expect(result.warnings).toEqual([])

    const sketchOp = result.parts.extrude?.find((operation) => operation.op === 'sketch') as
      | {
          op: 'sketch'
          profilesResolved: Array<{
            loop: { segments: unknown[] }
            verticesProxy: Array<{ x: number; y: number }>
          }>
        }
      | undefined
    expect(sketchOp?.op).toBe('sketch')
    if (sketchOp?.op !== 'sketch') {
      throw new Error('Expected sketch operation in extrude part IR.')
    }

    expect(sketchOp.profilesResolved).toHaveLength(1)
    expect(sketchOp.profilesResolved[0]?.loop.segments.length).toBeGreaterThan(0)
    expect(sketchOp.profilesResolved[0]?.verticesProxy).toEqual([
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 0, y: 20 },
    ])
  })
})
