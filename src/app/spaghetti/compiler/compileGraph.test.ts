import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import type { NodeDefinition } from '../registry/nodeRegistry'
import type { PortSpec, PortType } from '../schema/spaghettiTypes'
import { cloneOutputPreviewDefaultParams, OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { profileIdFromSignature } from '../features/profileDerivation'
import { buildSketchProfileMemberPortId } from '../features/sketchProfileVirtualPorts'

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
import { isGeometryRequestPayload } from '../contracts/geometryRequest'

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
            profileIndex: 0,
            loop: expect.objectContaining({
              segments: expect.any(Array),
              winding: 'CCW',
            }),
            verticesProxy: [
              { x: 0, y: 0 },
              { x: 30, y: 0 },
              { x: 30, y: 15 },
              { x: 0, y: 15 },
            ],
          },
        ],
      },
      {
        op: 'extrude',
        featureId: 'cube-extrude-1',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'cube-sketch-1',
          profileId: 'cube-profile-1',
          profileIndex: 0,
        },
        profileRef: {
          sketchFeatureId: 'cube-sketch-1',
          profileId: 'cube-profile-1',
          profileIndex: 0,
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
            profileIndex: 0,
            loop: expect.objectContaining({
              segments: expect.any(Array),
              winding: 'CCW',
            }),
            verticesProxy: [
              { x: 0, y: 0 },
              { x: 20, y: 0 },
              { x: 20, y: 12 },
              { x: 0, y: 12 },
            ],
          },
        ],
      },
      {
        op: 'extrude',
        featureId: 'cube-extrude-1',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'cube-sketch-1',
          profileId: 'cube-profile-1',
          profileIndex: 0,
        },
        profileRef: {
          sketchFeatureId: 'cube-sketch-1',
          profileId: 'cube-profile-1',
          profileIndex: 0,
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
                verticesProxy: Array<{ x: number; y: number }>
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
    const vertices = sketchOp?.profilesResolved?.[0]?.verticesProxy ?? []
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
            profileIndex: 0,
            loop: expect.objectContaining({
              segments: expect.any(Array),
              winding: 'CCW',
            }),
            verticesProxy: [
              { x: 0, y: 0 },
              { x: 40, y: 0 },
              { x: 40, y: 10 },
              { x: 20, y: 10 },
              { x: 20, y: 20 },
              { x: 0, y: 20 },
            ],
          },
        ],
      },
      {
        op: 'extrude',
        featureId: 'n-extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 0,
        },
        profileRef: {
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 0,
        },
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        depthResolved: 30,
        taperResolved: 0,
        offsetResolved: 0,
        plane: 'XZ',
        planeTransform,
        bodyId: 'n-extrude:body:001',
      },
    ])
  })

  it('compiles whole-port SketchProfiles wiring into explicit allFromSketch selection while preserving sketch profile order', () => {
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
                  componentId: 'rect-a',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 40, y: 20 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'rect-b',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 60, y: 0 },
                  b: { kind: 'lit', x: 90, y: 30 },
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
            depthMm: 14,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profiles',
          from: {
            nodeId: 'n-sketch',
            portId: 'SketchProfiles',
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)

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
        plane: 'XY',
        planeTransform: defaultPlaneTransform,
        profilesResolved: [
          expect.objectContaining({
            area: 800,
            profileIndex: 0,
          }),
          expect.objectContaining({
            area: 900,
            profileIndex: 1,
          }),
        ],
      },
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 0,
        },
        profileRef: {
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 0,
        },
        bodyId: 'n-extrude:body:001',
      }),
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 1,
        },
        profileRef: {
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 1,
        },
        bodyId: 'n-extrude:body:002',
      }),
    ])
  })

  it('compiles a revealed sketch profile member output as a singular extrude target', () => {
    const planeTransform = {
      offsetMm: 12,
      translation: { x: 1, y: 2, z: 3 },
      rotationDeg: { x: 0, y: 15, z: 0 },
      inPlaneRotationDeg: 5,
    }
    const profileId = profileIdFromSignature('line-5|line-6|line-7|line-8')
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
                { rowId: 'row-1', componentId: 'line-1', type: 'line', a: { kind: 'lit', x: 0, y: 0 }, b: { kind: 'lit', x: 40, y: 0 } },
                { rowId: 'row-2', componentId: 'line-2', type: 'line', a: { kind: 'lit', x: 40, y: 0 }, b: { kind: 'lit', x: 40, y: 10 } },
                { rowId: 'row-3', componentId: 'line-3', type: 'line', a: { kind: 'lit', x: 40, y: 10 }, b: { kind: 'lit', x: 0, y: 10 } },
                { rowId: 'row-4', componentId: 'line-4', type: 'line', a: { kind: 'lit', x: 0, y: 10 }, b: { kind: 'lit', x: 0, y: 0 } },
                { rowId: 'row-5', componentId: 'line-5', type: 'line', a: { kind: 'lit', x: 60, y: 0 }, b: { kind: 'lit', x: 90, y: 0 } },
                { rowId: 'row-6', componentId: 'line-6', type: 'line', a: { kind: 'lit', x: 90, y: 0 }, b: { kind: 'lit', x: 90, y: 15 } },
                { rowId: 'row-7', componentId: 'line-7', type: 'line', a: { kind: 'lit', x: 90, y: 15 }, b: { kind: 'lit', x: 60, y: 15 } },
                { rowId: 'row-8', componentId: 'line-8', type: 'line', a: { kind: 'lit', x: 60, y: 15 }, b: { kind: 'lit', x: 60, y: 0 } },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
                selectedProfileId: profileId,
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
      ],
      edges: [
        {
          edgeId: 'e-sketch-profile-member',
          from: {
            nodeId: 'n-sketch',
            portId: buildSketchProfileMemberPortId(profileId),
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)

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
          expect.objectContaining({
            profileId,
            profileIndex: 1,
          }),
        ],
      },
      expect.objectContaining({
        op: 'extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch',
          profileId,
          profileIndex: 1,
        },
      }),
    ])
  })

  it('compiles multiple ordered extrude contributors without inventing one fake source sketch owner', () => {
    const profileId = profileIdFromSignature('line-5|line-6|line-7|line-8')
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch-a',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-a',
              plane: 'XZ',
              components: [
                { rowId: 'row-1', componentId: 'line-1', type: 'line', a: { kind: 'lit', x: 0, y: 0 }, b: { kind: 'lit', x: 40, y: 0 } },
                { rowId: 'row-2', componentId: 'line-2', type: 'line', a: { kind: 'lit', x: 40, y: 0 }, b: { kind: 'lit', x: 40, y: 10 } },
                { rowId: 'row-3', componentId: 'line-3', type: 'line', a: { kind: 'lit', x: 40, y: 10 }, b: { kind: 'lit', x: 0, y: 10 } },
                { rowId: 'row-4', componentId: 'line-4', type: 'line', a: { kind: 'lit', x: 0, y: 10 }, b: { kind: 'lit', x: 0, y: 0 } },
                { rowId: 'row-5', componentId: 'line-5', type: 'line', a: { kind: 'lit', x: 60, y: 0 }, b: { kind: 'lit', x: 90, y: 0 } },
                { rowId: 'row-6', componentId: 'line-6', type: 'line', a: { kind: 'lit', x: 90, y: 0 }, b: { kind: 'lit', x: 90, y: 15 } },
                { rowId: 'row-7', componentId: 'line-7', type: 'line', a: { kind: 'lit', x: 90, y: 15 }, b: { kind: 'lit', x: 60, y: 15 } },
                { rowId: 'row-8', componentId: 'line-8', type: 'line', a: { kind: 'lit', x: 60, y: 15 }, b: { kind: 'lit', x: 60, y: 0 } },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
                selectedProfileId: profileId,
              },
            },
          },
        },
        {
          nodeId: 'n-sketch-b',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-b',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-b-1',
                  componentId: 'rect-b-1',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 10, y: 10 },
                },
                {
                  rowId: 'row-b-2',
                  componentId: 'rect-b-2',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 20, y: 0 },
                  b: { kind: 'lit', x: 35, y: 15 },
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
            depthMm: 18,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-profile-member',
          from: {
            nodeId: 'n-sketch-a',
            portId: buildSketchProfileMemberPortId(profileId),
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
        {
          edgeId: 'e-profile-aggregate',
          from: {
            nodeId: 'n-sketch-b',
            portId: 'SketchProfiles',
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)

    const featureIr = result.buildInputs?.resolvedShared?.sp_featureStackIR as
      | {
          schemaVersion: 1
          parts?: Record<string, Array<Record<string, unknown>>>
        }
      | undefined

    expect(featureIr?.parts?.extrude).toEqual([
      {
        op: 'sketch',
        featureId: 'n-sketch-a',
        plane: 'XZ',
        planeTransform: defaultPlaneTransform,
        profilesResolved: [
          expect.objectContaining({
            profileId,
            profileIndex: 1,
          }),
        ],
      },
      {
        op: 'sketch',
        featureId: 'n-sketch-b',
        plane: 'XY',
        planeTransform: defaultPlaneTransform,
        profilesResolved: [
          expect.objectContaining({
            profileIndex: 0,
            area: 100,
          }),
          expect.objectContaining({
            profileIndex: 1,
            area: 225,
          }),
        ],
      },
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch-a',
          profileId,
          profileIndex: 1,
        },
        profileRef: {
          sketchFeatureId: 'n-sketch-a',
          profileId,
          profileIndex: 1,
        },
        bodyId: 'n-extrude:body:001',
      }),
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch-b',
          profileId: expect.any(String),
          profileIndex: 0,
        },
        profileRef: {
          sketchFeatureId: 'n-sketch-b',
          profileId: expect.any(String),
          profileIndex: 0,
        },
        bodyId: 'n-extrude:body:002',
      }),
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch-b',
          profileId: expect.any(String),
          profileIndex: 1,
        },
        profileRef: {
          sketchFeatureId: 'n-sketch-b',
          profileId: expect.any(String),
          profileIndex: 1,
        },
        bodyId: 'n-extrude:body:003',
      }),
    ])
  })

  it('keeps repeated aggregate compile output stable across mixed sketch profile counts', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch-b',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-b',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-b-1',
                  componentId: 'rect-b-1',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 10, y: 10 },
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
          nodeId: 'n-extrude-b',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            depthMm: 8,
          },
        },
        {
          nodeId: 'n-sketch-a',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-a',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-a-1',
                  componentId: 'rect-a-1',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 20, y: 10 },
                },
                {
                  rowId: 'row-a-2',
                  componentId: 'rect-a-2',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 30, y: 0 },
                  b: { kind: 'lit', x: 40, y: 10 },
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
          nodeId: 'n-extrude-a',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Body',
            depthMm: 6,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-aggregate-a',
          from: {
            nodeId: 'n-sketch-a',
            portId: 'SketchProfiles',
          },
          to: {
            nodeId: 'n-extrude-a',
            portId: 'ExtrusionProfile',
          },
        },
        {
          edgeId: 'e-aggregate-b',
          from: {
            nodeId: 'n-sketch-b',
            portId: 'SketchProfiles',
          },
          to: {
            nodeId: 'n-extrude-b',
            portId: 'ExtrusionProfile',
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
          parts?: Record<string, Array<Record<string, unknown>>>
        }
      | undefined

    expect(Object.keys(featureIr?.parts ?? {})).toEqual(['extrude#1', 'extrude#2'])
    expect(featureIr?.parts?.['extrude#1']?.[0]).toEqual(
      expect.objectContaining({
        op: 'sketch',
        featureId: 'n-sketch-a',
        profilesResolved: [
          expect.objectContaining({ profileIndex: 0 }),
          expect.objectContaining({ profileIndex: 1 }),
        ],
      }),
    )
    expect(featureIr?.parts?.['extrude#1']?.[1]).toEqual(
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude-a',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch-a',
          profileId: expect.any(String),
          profileIndex: 0,
        },
      }),
    )
    expect(featureIr?.parts?.['extrude#1']?.[2]).toEqual(
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude-a',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch-a',
          profileId: expect.any(String),
          profileIndex: 1,
        },
      }),
    )
    expect(featureIr?.parts?.['extrude#2']?.[0]).toEqual(
      expect.objectContaining({
        op: 'sketch',
        featureId: 'n-sketch-b',
        profilesResolved: [expect.objectContaining({ profileIndex: 0 })],
      }),
    )
    expect(featureIr?.parts?.['extrude#2']?.[1]).toEqual(
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude-b',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch-b',
          profileId: expect.any(String),
          profileIndex: 0,
        },
      }),
    )
  })

  it('splits Geometry/Extrude NewObjects into per-body runtime IR operations', () => {
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
                  componentId: 'rect-1',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 20, y: 10 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'rect-2',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 30, y: 0 },
                  b: { kind: 'lit', x: 45, y: 10 },
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
            bodyGenerationMode: 'NewObjects',
            depthMm: 18,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profiles',
          from: {
            nodeId: 'n-sketch',
            portId: 'SketchProfiles',
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
      resolvedOutputsByNodeId: evaluation.outputsByNodeId,
    })
    expect(result.warnings).toEqual([])

    expect(result.parts.extrude).toEqual([
      expect.objectContaining({
        op: 'sketch',
        featureId: 'n-sketch',
        profilesResolved: [
          expect.objectContaining({ profileIndex: 0 }),
          expect.objectContaining({ profileIndex: 1 }),
        ],
      }),
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 0,
        },
        profileRef: {
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 0,
        },
        bodyId: 'n-extrude:body:001',
      }),
      expect.objectContaining({
        op: 'extrude',
        featureId: 'n-extrude',
        profileSelection: {
          mode: 'single',
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 1,
        },
        profileRef: {
          sketchFeatureId: 'n-sketch',
          profileId: expect.any(String),
          profileIndex: 1,
        },
        bodyId: 'n-extrude:body:002',
      }),
    ])
  })

  it('preserves authored Geometry/Extrude taper in the shared geometry request payload', () => {
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
            extrudeType: 'Body',
            depthMm: 12,
            taperAngleDeg: 4.5,
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
          taperResolved: number
        }
      | undefined

    expect(extrudeOp?.taperResolved).toBe(4.5)
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
    expect(
      isGeometryRequestPayload({
        schemaVersion: 1,
        parts: result.parts,
      }),
    ).toBe(true)
  })
})
