import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import type { SketchFeature } from '../features/featureTypes'
import { evaluateSpaghettiGraph } from './evaluateGraph'
import { buildExtrudeBodyMemberPortId } from '../features/extrudeBodyVirtualPorts'
import { profileIdFromSignature } from '../features/profileDerivation'
import { buildSketchProfileMemberPortId } from '../features/sketchProfileVirtualPorts'
import {
  registry,
  type NodeDefinition,
} from '../registry/nodeRegistry'
import { cloneOutputPreviewDefaultParams, OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

const testVec2SourceType = 'Test/Vec2Source'
const testNumberSourceType = 'Test/NumberMm'
const testVec2SinkType = 'Test/Vec2Sink'
const testRailMathSourceType = 'Test/RailMathSource'
const testRailMathSinkType = 'Test/RailMathSink'
const testToeLoftSourceType = 'Test/ToeLoftSource'
const testToeLoftSinkType = 'Test/ToeLoftSink'
const testSolidBodiesSourceType = 'Test/SolidBodiesSource'
const testSolidBodiesSinkType = 'Test/SolidBodiesSink'
const testBrokenNumberSourceType = 'Test/BrokenNumberMm'
const testNumberDegSourceType = 'Test/NumberDeg'
const testPlaneSourceType = 'Test/PlaneSource'

const registryWithTests = registry as unknown as Record<string, NodeDefinition>

const vec2MmSchema = z.object({ x: z.number(), y: z.number() }).strict()

beforeAll(() => {
  registryWithTests[testVec2SourceType] = {
    type: testVec2SourceType as never,
    label: 'Test Vec2 Source',
    paramsSchema: z
      .object({
        value: vec2MmSchema,
      })
      .strict(),
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'vec2', unit: 'mm' },
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  }

  registryWithTests[testNumberSourceType] = {
    type: testNumberSourceType as never,
    label: 'Test Number Source',
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
        type: { kind: 'number', unit: 'mm' },
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  }

  registryWithTests[testVec2SinkType] = {
    type: testVec2SinkType as never,
    label: 'Test Vec2 Sink',
    paramsSchema: z
      .object({
        in: vec2MmSchema.optional(),
      })
      .strict(),
    inputs: [
      {
        portId: 'in',
        label: 'In',
        type: { kind: 'vec2', unit: 'mm' },
        optional: true,
      },
    ],
    outputs: [
      {
        portId: 'out',
        label: 'Out',
        type: { kind: 'vec2', unit: 'mm' },
      },
    ],
    compute: ({ inputs }) => ({
      out: inputs.in,
    }),
  }

  registryWithTests[testRailMathSourceType] = {
    type: testRailMathSourceType as never,
    label: 'Test RailMath Source',
    paramsSchema: z
      .object({
        value: z.unknown(),
      })
      .strict(),
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'railMath' },
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  }

  registryWithTests[testRailMathSinkType] = {
    type: testRailMathSinkType as never,
    label: 'Test RailMath Sink',
    paramsSchema: z
      .object({
        in: z.unknown().optional(),
      })
      .strict(),
    inputs: [
      {
        portId: 'in',
        label: 'In',
        type: { kind: 'railMath' },
        optional: true,
      },
    ],
    outputs: [
      {
        portId: 'out',
        label: 'Out',
        type: { kind: 'railMath' },
      },
    ],
    compute: ({ inputs }) => ({
      out: inputs.in ?? null,
    }),
  }

  registryWithTests[testToeLoftSourceType] = {
    type: testToeLoftSourceType as never,
    label: 'Test ToeLoft Source',
    paramsSchema: z
      .object({
        value: z.unknown(),
      })
      .strict(),
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'toeLoft' },
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  }

  registryWithTests[testToeLoftSinkType] = {
    type: testToeLoftSinkType as never,
    label: 'Test ToeLoft Sink',
    paramsSchema: z
      .object({
        in: z.unknown().optional(),
      })
      .strict(),
    inputs: [
      {
        portId: 'in',
        label: 'In',
        type: { kind: 'toeLoft' },
        optional: true,
      },
    ],
    outputs: [
      {
        portId: 'out',
        label: 'Out',
        type: { kind: 'toeLoft' },
      },
    ],
    compute: ({ inputs }) => ({
      out: inputs.in ?? null,
    }),
  }

  registryWithTests[testSolidBodiesSourceType] = {
    type: testSolidBodiesSourceType as never,
    label: 'Test SolidBodies Source',
    paramsSchema: z
      .object({
        value: z.unknown(),
      })
      .strict(),
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'solidBodies' },
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  }

  registryWithTests[testSolidBodiesSinkType] = {
    type: testSolidBodiesSinkType as never,
    label: 'Test SolidBodies Sink',
    paramsSchema: z
      .object({
        in: z.unknown().optional(),
      })
      .strict(),
    inputs: [
      {
        portId: 'in',
        label: 'In',
        type: { kind: 'solidBodies' },
        optional: true,
      },
    ],
    outputs: [
      {
        portId: 'out',
        label: 'Out',
        type: { kind: 'solidBodies' },
      },
    ],
    compute: ({ inputs }) => ({
      out: inputs.in ?? null,
    }),
  }

  registryWithTests[testBrokenNumberSourceType] = {
    type: testBrokenNumberSourceType as never,
    label: 'Test Broken Number Source',
    paramsSchema: z.object({}).strict(),
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'number', unit: 'mm' },
      },
    ],
    compute: () => ({}),
  }

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

  registryWithTests[testPlaneSourceType] = {
    type: testPlaneSourceType as never,
    label: 'Test Plane Source',
    paramsSchema: z
      .object({
        value: z.enum(['XY', 'YZ', 'XZ']),
      })
      .strict(),
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'plane' },
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  }
})

afterAll(() => {
  delete registryWithTests[testVec2SourceType]
  delete registryWithTests[testNumberSourceType]
  delete registryWithTests[testVec2SinkType]
  delete registryWithTests[testRailMathSourceType]
  delete registryWithTests[testRailMathSinkType]
  delete registryWithTests[testToeLoftSourceType]
  delete registryWithTests[testToeLoftSinkType]
  delete registryWithTests[testSolidBodiesSourceType]
  delete registryWithTests[testSolidBodiesSinkType]
  delete registryWithTests[testBrokenNumberSourceType]
  delete registryWithTests[testNumberDegSourceType]
  delete registryWithTests[testPlaneSourceType]
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

const rectangleComponent = (
  rowId: string,
  componentId: string,
  a: { x: number; y: number },
  b: { x: number; y: number },
): SketchFeature['components'][number] => ({
  rowId,
  componentId,
  type: 'rectangle',
  a: { kind: 'lit', x: a.x, y: a.y },
  b: { kind: 'lit', x: b.x, y: b.y },
})

const baseNodes = () => [
  {
    nodeId: 'n-vec2',
    type: testVec2SourceType,
    params: {
      value: { x: 1, y: 2 },
    },
  },
  {
    nodeId: 'n-num',
    type: testNumberSourceType,
    params: {
      value: 9,
    },
  },
] as const

describe('evaluateSpaghettiGraph composite resolution', () => {
  it('applies leaf > whole > literal > default priority', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        ...baseNodes(),
        {
          nodeId: 'n-sink',
          type: testVec2SinkType,
          params: {
            in: { x: 11, y: 22 },
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-whole',
          from: { nodeId: 'n-vec2', portId: 'value' },
          to: { nodeId: 'n-sink', portId: 'in' },
        },
        {
          edgeId: 'e-leaf-x',
          from: { nodeId: 'n-num', portId: 'value' },
          to: { nodeId: 'n-sink', portId: 'in', path: ['x'] },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-sink']?.out).toEqual({ x: 9, y: 2 })
  })

  it('uses literal then default for unwired leaves', () => {
    const literalGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        ...baseNodes(),
        {
          nodeId: 'n-sink',
          type: testVec2SinkType,
          params: {
            in: { x: 11, y: 22 },
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-leaf-x',
          from: { nodeId: 'n-num', portId: 'value' },
          to: { nodeId: 'n-sink', portId: 'in', path: ['x'] },
        },
      ],
    }

    const literalResult = evaluateSpaghettiGraph(literalGraph)
    expect(literalResult.ok).toBe(true)
    expect(literalResult.outputsByNodeId['n-sink']?.out).toEqual({ x: 9, y: 22 })

    const defaultGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        ...baseNodes(),
        {
          nodeId: 'n-sink',
          type: testVec2SinkType,
          params: {},
        },
      ],
      edges: [],
    }

    const defaultResult = evaluateSpaghettiGraph(defaultGraph)
    expect(defaultResult.ok).toBe(true)
    expect(defaultResult.outputsByNodeId['n-sink']?.out).toEqual({ x: 0, y: 0 })
  })
})

describe('evaluateSpaghettiGraph Param nodes', () => {
  it('resolves Param/* outputs to authored typed values deterministically', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-param-number',
          type: 'Param/Number',
          params: { value: 12.5 },
        },
        {
          nodeId: 'n-param-boolean',
          type: 'Param/Boolean',
          params: { value: true },
        },
        {
          nodeId: 'n-param-vec2',
          type: 'Param/Vec2',
          params: { value: { x: 4, y: 7 } },
        },
      ],
      edges: [],
    }

    const first = evaluateSpaghettiGraph(graph)
    const second = evaluateSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(first.outputsByNodeId['n-param-number']?.value).toBe(12.5)
    expect(first.outputsByNodeId['n-param-boolean']?.value).toBe(true)
    expect(first.outputsByNodeId['n-param-vec2']?.value).toEqual({ x: 4, y: 7 })
    expect(second).toEqual(first)
  })

  it('feeds Param/Number and Param/Vec2 into current part inputs through normal evaluation', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-param-number',
          type: 'Param/Number',
          params: { value: 44 },
        },
        {
          nodeId: 'n-param-vec2',
          type: 'Param/Vec2',
          params: { value: { x: 10, y: 20 } },
        },
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-width',
          from: { nodeId: 'n-param-number', portId: 'value' },
          to: { nodeId: 'n-baseplate', portId: 'width' },
        },
        {
          edgeId: 'e-anchor-1',
          from: { nodeId: 'n-param-vec2', portId: 'value' },
          to: { nodeId: 'n-baseplate', portId: 'anchorPoint1' },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.inputsByNodeId['n-baseplate']?.width).toBe(44)
    expect(result.inputsByNodeId['n-baseplate']?.anchorPoint1).toEqual({ x: 10, y: 20 })
  })
})

describe('evaluateSpaghettiGraph opaque kinds', () => {
  it('accepts railMath null and __opaqueRef values but rejects arbitrary objects', () => {
    const nullGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-rail-source',
          type: testRailMathSourceType,
          params: { value: null },
        },
        {
          nodeId: 'n-rail-sink',
          type: testRailMathSinkType,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-rail-null',
          from: { nodeId: 'n-rail-source', portId: 'value' },
          to: { nodeId: 'n-rail-sink', portId: 'in' },
        },
      ],
    }
    const nullResult = evaluateSpaghettiGraph(nullGraph)
    expect(nullResult.ok).toBe(true)

    const tokenGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-rail-source',
          type: testRailMathSourceType,
          params: { value: { __opaqueRef: 'rail-token' } },
        },
        {
          nodeId: 'n-rail-sink',
          type: testRailMathSinkType,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-rail-token',
          from: { nodeId: 'n-rail-source', portId: 'value' },
          to: { nodeId: 'n-rail-sink', portId: 'in' },
        },
      ],
    }
    const tokenResult = evaluateSpaghettiGraph(tokenGraph)
    expect(tokenResult.ok).toBe(true)

    const invalidGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-rail-source',
          type: testRailMathSourceType,
          params: { value: { foo: 1 } },
        },
        {
          nodeId: 'n-rail-sink',
          type: testRailMathSinkType,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-rail-invalid',
          from: { nodeId: 'n-rail-source', portId: 'value' },
          to: { nodeId: 'n-rail-sink', portId: 'in' },
        },
      ],
    }
    const invalidResult = evaluateSpaghettiGraph(invalidGraph)
    expect(invalidResult.ok).toBe(false)
    expect(invalidResult.diagnostics.errors.some((error) => error.code === 'OUTPUT_INVALID_SHAPE')).toBe(true)
  })

  it('accepts toeLoft null and __opaqueRef values but rejects arbitrary objects', () => {
    const nullGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-toe-source',
          type: testToeLoftSourceType,
          params: { value: null },
        },
        {
          nodeId: 'n-toe-sink',
          type: testToeLoftSinkType,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-toe-null',
          from: { nodeId: 'n-toe-source', portId: 'value' },
          to: { nodeId: 'n-toe-sink', portId: 'in' },
        },
      ],
    }
    const nullResult = evaluateSpaghettiGraph(nullGraph)
    expect(nullResult.ok).toBe(true)

    const tokenGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-toe-source',
          type: testToeLoftSourceType,
          params: { value: { __opaqueRef: 'toe-token' } },
        },
        {
          nodeId: 'n-toe-sink',
          type: testToeLoftSinkType,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-toe-token',
          from: { nodeId: 'n-toe-source', portId: 'value' },
          to: { nodeId: 'n-toe-sink', portId: 'in' },
        },
      ],
    }
    const tokenResult = evaluateSpaghettiGraph(tokenGraph)
    expect(tokenResult.ok).toBe(true)

    const invalidGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-toe-source',
          type: testToeLoftSourceType,
          params: { value: { foo: 1 } },
        },
        {
          nodeId: 'n-toe-sink',
          type: testToeLoftSinkType,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-toe-invalid',
          from: { nodeId: 'n-toe-source', portId: 'value' },
          to: { nodeId: 'n-toe-sink', portId: 'in' },
        },
      ],
    }
    const invalidResult = evaluateSpaghettiGraph(invalidGraph)
    expect(invalidResult.ok).toBe(false)
    expect(invalidResult.diagnostics.errors.some((error) => error.code === 'OUTPUT_INVALID_SHAPE')).toBe(true)
  })

  it('accepts explicit solidBodies aggregates but rejects nested collections and boolean mode flags', () => {
    const aggregateGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-solidbodies-source',
          type: testSolidBodiesSourceType,
          params: {
            value: {
              bodies: [{ bodyId: 'body-a' }, { __opaqueRef: 'body-token-b' }],
            },
          },
        },
        {
          nodeId: 'n-solidbodies-sink',
          type: testSolidBodiesSinkType,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-solidbodies-aggregate',
          from: { nodeId: 'n-solidbodies-source', portId: 'value' },
          to: { nodeId: 'n-solidbodies-sink', portId: 'in' },
        },
      ],
    }

    const aggregateResult = evaluateSpaghettiGraph(aggregateGraph)
    expect(aggregateResult.ok).toBe(true)
    expect(aggregateResult.inputsByNodeId['n-solidbodies-sink']?.in).toEqual({
      bodies: [{ bodyId: 'body-a' }, { __opaqueRef: 'body-token-b' }],
    })
    expect(aggregateResult.outputsByNodeId['n-solidbodies-sink']?.out).toEqual({
      bodies: [{ bodyId: 'body-a' }, { __opaqueRef: 'body-token-b' }],
    })

    const nestedCollectionGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-solidbodies-source',
          type: testSolidBodiesSourceType,
          params: {
            value: {
              bodies: [{ bodies: [{ bodyId: 'nested-body' }] }],
            },
          },
        },
      ],
      edges: [],
    }

    const nestedCollectionResult = evaluateSpaghettiGraph(nestedCollectionGraph)
    expect(nestedCollectionResult.ok).toBe(false)
    expect(
      nestedCollectionResult.diagnostics.errors.some(
        (error) => error.code === 'OUTPUT_INVALID_SHAPE',
      ),
    ).toBe(true)

    const booleanModeGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-solidbodies-source',
          type: testSolidBodiesSourceType,
          params: {
            value: {
              bodies: [{ bodyId: 'body-a' }],
              combined: true,
            },
          },
        },
      ],
      edges: [],
    }

    const booleanModeResult = evaluateSpaghettiGraph(booleanModeGraph)
    expect(booleanModeResult.ok).toBe(false)
    expect(
      booleanModeResult.diagnostics.errors.some(
        (error) => error.code === 'OUTPUT_INVALID_SHAPE',
      ),
    ).toBe(true)
  })
})

describe('evaluateSpaghettiGraph feature virtual inputs', () => {
  it('resolves wired extrude depth virtual input into inputsByNodeId', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-num',
          type: testNumberSourceType,
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
            nodeId: 'n-num',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:depth',
          },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.inputsByNodeId['n-baseplate']?.['fs:in:feature-depth-1:extrude:depth']).toBe(
      42,
    )
  })

  it('resolves wired extrude taper/offset virtual inputs into inputsByNodeId deterministically', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-num-mm',
          type: testNumberSourceType,
          params: {
            value: 5,
          },
        },
        {
          nodeId: 'n-num-deg',
          type: testNumberDegSourceType,
          params: {
            value: 12,
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
            nodeId: 'n-num-mm',
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
            nodeId: 'n-num-deg',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-2:extrude:taper',
          },
        },
      ],
    }

    const first = evaluateSpaghettiGraph(graph)
    const second = evaluateSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(first.inputsByNodeId['n-baseplate']?.['fs:in:feature-depth-2:extrude:offset']).toBe(5)
    expect(first.inputsByNodeId['n-baseplate']?.['fs:in:feature-depth-2:extrude:taper']).toBe(12)
    expect(second).toEqual(first)
  })
})

describe('evaluateSpaghettiGraph driver virtual outputs', () => {
  it('resolves nodeParam driver outputs and supports driver-input overrides deterministically', () => {
    const graphWithoutOverride: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-num',
          type: testNumberSourceType,
          params: {
            value: 77,
          },
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {
            widthMm: 10,
            lengthMm: 200,
          },
        },
      ],
      edges: [],
    }

    const baseline = evaluateSpaghettiGraph(graphWithoutOverride)
    expect(baseline.ok).toBe(true)
    expect(baseline.outputsByNodeId['n-target-baseplate']?.['out:drv:widthMm']).toBe(10)
    expect(baseline.outputsByNodeId['n-target-baseplate']?.['drv:widthMm']).toBe(10)

    const graph: SpaghettiGraph = {
      ...graphWithoutOverride,
      edges: [
        {
          edgeId: 'e-driver-input-override',
          from: {
            nodeId: 'n-source-num',
            portId: 'value',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.inputsByNodeId['n-target-baseplate']?.['in:drv:widthMm']).toBe(77)
    expect(result.outputsByNodeId['n-target-baseplate']?.['out:drv:widthMm']).toBe(77)
    expect(result.outputsByNodeId['n-target-baseplate']?.['drv:widthMm']).toBe(77)

    const second = evaluateSpaghettiGraph(graph)
    expect(second).toEqual(result)
  })

  it('keeps legacy driver-input aliases working for backwards compatibility', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-num',
          type: testNumberSourceType,
          params: {
            value: 88,
          },
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {
            widthMm: 10,
            lengthMm: 200,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-driver-input-legacy',
          from: {
            nodeId: 'n-source-num',
            portId: 'value',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'drv:in:widthMm',
          },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.inputsByNodeId['n-target-baseplate']?.['drv:in:widthMm']).toBe(88)
    expect(result.outputsByNodeId['n-target-baseplate']?.['out:drv:widthMm']).toBe(88)
  })

  it('emits effective numeric driver output when driven offset metadata is present', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-num',
          type: testNumberSourceType,
          params: {
            value: 77,
          },
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {
            widthMm: 10,
            lengthMm: 200,
            driverOffsetByParamId: {
              widthMm: 3,
            },
            driverDrivenByParamId: {
              widthMm: true,
            },
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-driver-input-offset',
          from: {
            nodeId: 'n-source-num',
            portId: 'value',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.inputsByNodeId['n-target-baseplate']?.['in:drv:widthMm']).toBe(77)
    expect(result.outputsByNodeId['n-target-baseplate']?.['out:drv:widthMm']).toBe(80)
    expect(result.outputsByNodeId['n-target-baseplate']?.['drv:widthMm']).toBe(80)

    const second = evaluateSpaghettiGraph(graph)
    expect(second).toEqual(result)
  })

  it('treats wired-but-unresolved driver inputs as unresolved and avoids manual fallback', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-broken',
          type: testBrokenNumberSourceType,
          params: {},
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {
            widthMm: 10,
            lengthMm: 200,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-driver-input-unresolved',
          from: {
            nodeId: 'n-source-broken',
            portId: 'value',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.diagnostics.errors.some((error) => error.code === 'INPUT_SOURCE_VALUE_MISSING')).toBe(
      true,
    )
    expect(result.outputsByNodeId['n-target-baseplate']).toBeUndefined()
  })
})

describe('evaluateSpaghettiGraph OutputPreview inertness', () => {
  it('keeps shared-node inputs/outputs and diagnostics unchanged when OutputPreview exists', () => {
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

    const resultWithout = evaluateSpaghettiGraph(withoutOutputPreview)
    const resultWith = evaluateSpaghettiGraph(withOutputPreview)

    expect(resultWith.ok).toBe(resultWithout.ok)
    expect(resultWith.diagnostics.errors).toEqual(resultWithout.diagnostics.errors)
    expect(resultWith.diagnostics.warnings).toEqual(resultWithout.diagnostics.warnings)
    expect(resultWith.inputsByNodeId['n-baseplate']).toEqual(resultWithout.inputsByNodeId['n-baseplate'])
    expect(resultWith.outputsByNodeId['n-baseplate']).toEqual(resultWithout.outputsByNodeId['n-baseplate'])
  })
})

describe('evaluateSpaghettiGraph Geometry/Sketch', () => {
  it('emits empty SketchProfiles and null SketchProfile for an empty managed sketch', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
      ],
      edges: [],
    }

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-sketch']?.SketchProfiles).toEqual([])
    expect(result.outputsByNodeId['n-sketch']?.SketchProfile).toBeNull()
  })

  it('derives one downstream-ready profile from a valid closed rectangle sketch', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
              lineComponent('row-2', 'e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
              lineComponent('row-3', 'e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
              lineComponent('row-4', 'e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
            ]),
          },
        },
      ],
      edges: [],
    }

    const result = evaluateSpaghettiGraph(graph)
    const profiles = result.outputsByNodeId['n-sketch']?.SketchProfiles
    const selectedProfile = result.outputsByNodeId['n-sketch']?.SketchProfile

    expect(result.ok).toBe(true)
    expect(Array.isArray(profiles)).toBe(true)
    expect(profiles).toHaveLength(1)
    expect((profiles as Array<{ area: number }>)[0]?.area).toBe(5000)
    expect(selectedProfile).toMatchObject({
      profileIndex: 0,
      area: 5000,
    })
  })

  it('uses an explicit selectedProfileId when multiple sketch profiles are resolved', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(
              [
                rectangleComponent('row-1', 'rect-a', { x: 0, y: 0 }, { x: 40, y: 20 }),
                rectangleComponent('row-2', 'rect-b', { x: 60, y: 0 }, { x: 90, y: 30 }),
              ],
              {
                selectedProfileId: profileIdFromSignature('rect-b'),
              },
            ),
          },
        },
      ],
      edges: [],
    }

    const result = evaluateSpaghettiGraph(graph)
    const profiles = result.outputsByNodeId['n-sketch']?.SketchProfiles as Array<{
      profileId: string
      area: number
    }>

    expect(result.ok).toBe(true)
    expect(profiles).toHaveLength(2)
    expect(result.outputsByNodeId['n-sketch']?.SketchProfile).toMatchObject({
      profileId: profileIdFromSignature('rect-b'),
      area: 900,
    })
  })

  it('lets a wired plane input override the locally stored sketch plane for evaluation', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-plane',
          type: testPlaneSourceType,
          params: {
            value: 'YZ',
          },
        },
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              ...createSketchFeature(),
              plane: 'XY',
            },
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-plane-sketch',
          from: {
            nodeId: 'n-plane',
            portId: 'value',
          },
          to: {
            nodeId: 'n-sketch',
            portId: 'SketchPlane',
          },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.inputsByNodeId['n-sketch']?.SketchPlane).toBe('YZ')
  })
})

describe('evaluateSpaghettiGraph Geometry/Extrude', () => {
  it('publishes one SolidBody when a selected SketchProfile and positive depth are available', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
              lineComponent('row-2', 'e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
              lineComponent('row-3', 'e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
              lineComponent('row-4', 'e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
            ]),
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'Combine',
            extrudeType: 'Basic',
            depthMm: 25,
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

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toEqual({
      bodyId: 'n-extrude:body',
    })
  })

  it('publishes child sketch profile member outputs with stable endpoint ids and lets extrude consume them', () => {
    const selectedProfileId = profileIdFromSignature('e5|e6|e7|e8')
    const childPortId = buildSketchProfileMemberPortId(selectedProfileId)
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
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
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'Combine',
            extrudeType: 'Basic',
            depthMm: 25,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profile-member',
          from: {
            nodeId: 'n-sketch',
            portId: childPortId,
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-sketch']?.[childPortId]).toMatchObject({
      profileId: selectedProfileId,
      profileIndex: 1,
    })
    expect(result.inputsByNodeId['n-extrude']?.ExtrusionProfile).toMatchObject({
      profileId: selectedProfileId,
      profileIndex: 1,
    })
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toEqual({
      bodyId: 'n-extrude:body',
    })
  })

  it('publishes one SolidBody when whole-port SketchProfiles drives aggregate extrude selection', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
              lineComponent('row-2', 'e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
              lineComponent('row-3', 'e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
              lineComponent('row-4', 'e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
              lineComponent('row-5', 'e5', { x: 140, y: 0 }, { x: 180, y: 0 }),
              lineComponent('row-6', 'e6', { x: 180, y: 0 }, { x: 180, y: 40 }),
              lineComponent('row-7', 'e7', { x: 180, y: 40 }, { x: 140, y: 40 }),
              lineComponent('row-8', 'e8', { x: 140, y: 40 }, { x: 140, y: 0 }),
            ]),
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'Combine',
            extrudeType: 'Basic',
            depthMm: 25,
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

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toEqual({
      bodyId: 'n-extrude:body',
    })
  })

  it('accepts multiple ordered profile contributors on ExtrusionProfile during evaluation', () => {
    const selectedProfileId = profileIdFromSignature('rect-b')
    const childPortId = buildSketchProfileMemberPortId(selectedProfileId)
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch-a',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(
              [
                rectangleComponent('row-1', 'rect-a', { x: 0, y: 0 }, { x: 40, y: 20 }),
                rectangleComponent('row-2', 'rect-b', { x: 60, y: 0 }, { x: 90, y: 15 }),
              ],
              { selectedProfileId },
            ),
          },
        },
        {
          nodeId: 'n-sketch-b',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              rectangleComponent('row-1', 'rect-c', { x: 0, y: 0 }, { x: 30, y: 30 }),
            ]),
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'Combine',
            extrudeType: 'Basic',
            depthMm: 25,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-profile-member',
          from: {
            nodeId: 'n-sketch-a',
            portId: childPortId,
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

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.inputsByNodeId['n-extrude']?.ExtrusionProfile).toEqual([
      expect.objectContaining({
        profileId: selectedProfileId,
        profileIndex: 1,
      }),
      [
        expect.objectContaining({
          profileIndex: 0,
          area: 900,
        }),
      ],
    ])
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toEqual({
      bodyId: 'n-extrude:body',
    })
  })

  it('publishes SolidBodies in NewObjects mode when whole-port SketchProfiles drives multiple bodies', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
              lineComponent('row-2', 'e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
              lineComponent('row-3', 'e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
              lineComponent('row-4', 'e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
              lineComponent('row-5', 'e5', { x: 140, y: 0 }, { x: 180, y: 0 }),
              lineComponent('row-6', 'e6', { x: 180, y: 0 }, { x: 180, y: 40 }),
              lineComponent('row-7', 'e7', { x: 180, y: 40 }, { x: 140, y: 40 }),
              lineComponent('row-8', 'e8', { x: 140, y: 40 }, { x: 140, y: 0 }),
            ]),
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'NewObjects',
            depthMm: 25,
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

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toEqual({
      bodies: [
        { bodyId: 'n-extrude:body:001' },
        { bodyId: 'n-extrude:body:002' },
      ],
    })
    expect(result.outputsByNodeId['n-extrude']?.[buildExtrudeBodyMemberPortId(0)]).toEqual({
      bodyId: 'n-extrude:body:001',
    })
    expect(result.outputsByNodeId['n-extrude']?.[buildExtrudeBodyMemberPortId(1)]).toEqual({
      bodyId: 'n-extrude:body:002',
    })
  })

  it('treats stray SketchProfiles source-path metadata as one aggregate extrude contributor and still publishes all bodies', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              rectangleComponent('row-1', 'rect-a', { x: 0, y: 0 }, { x: 40, y: 20 }),
              rectangleComponent('row-2', 'rect-b', { x: 60, y: 0 }, { x: 100, y: 20 }),
              rectangleComponent('row-3', 'rect-c', { x: 120, y: 0 }, { x: 160, y: 20 }),
              rectangleComponent('row-4', 'rect-d', { x: 180, y: 0 }, { x: 220, y: 20 }),
            ]),
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'NewObjects',
            depthMm: 25,
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-sketch-profiles-stale-path',
          from: {
            nodeId: 'n-sketch',
            portId: 'SketchProfiles',
            path: ['member', '0'],
          },
          to: {
            nodeId: 'n-extrude',
            portId: 'ExtrusionProfile',
          },
        },
      ],
    }

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.inputsByNodeId['n-extrude']?.ExtrusionProfile).toHaveLength(4)
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toEqual({
      bodies: [
        { bodyId: 'n-extrude:body:001' },
        { bodyId: 'n-extrude:body:002' },
        { bodyId: 'n-extrude:body:003' },
        { bodyId: 'n-extrude:body:004' },
      ],
    })
    expect(result.outputsByNodeId['n-extrude']?.[buildExtrudeBodyMemberPortId(0)]).toEqual({
      bodyId: 'n-extrude:body:001',
    })
    expect(result.outputsByNodeId['n-extrude']?.[buildExtrudeBodyMemberPortId(3)]).toEqual({
      bodyId: 'n-extrude:body:004',
    })
  })

  it('publishes a one-member SolidBodies collection in NewObjects mode for a single SketchProfile', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
              lineComponent('row-2', 'e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
              lineComponent('row-3', 'e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
              lineComponent('row-4', 'e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
            ]),
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'NewObjects',
            depthMm: 25,
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

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toEqual({
      bodies: [{ bodyId: 'n-extrude:body:001' }],
    })
  })

  it('publishes null SolidBody when the selected profile input is missing', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Basic',
            depthMm: 25,
          },
        },
      ],
      edges: [],
    }

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toBeNull()
  })

  it('publishes one SolidBody for TwoSides when both split depths are positive', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
              lineComponent('row-2', 'e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
              lineComponent('row-3', 'e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
              lineComponent('row-4', 'e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
            ]),
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'Combine',
            extrudeDirection: 'TwoSides',
            depthMm: 25,
            startDepthMm: 5,
            endDepthMm: 7,
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

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toEqual({
      bodyId: 'n-extrude:body',
    })
  })

  it('publishes null SolidBody for TwoSides when one split depth is not positive', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-sketch',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
              lineComponent('row-2', 'e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
              lineComponent('row-3', 'e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
              lineComponent('row-4', 'e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
            ]),
          },
        },
        {
          nodeId: 'n-extrude',
          type: 'Geometry/Extrude',
          params: {
            extrudeDirection: 'TwoSides',
            depthMm: 25,
            startDepthMm: 5,
            endDepthMm: 0,
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

    const result = evaluateSpaghettiGraph(graph)

    expect(result.ok).toBe(true)
    expect(result.outputsByNodeId['n-extrude']?.SolidBody).toBeNull()
  })
})
