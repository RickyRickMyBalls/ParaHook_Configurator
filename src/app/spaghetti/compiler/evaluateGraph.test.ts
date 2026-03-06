import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { evaluateSpaghettiGraph } from './evaluateGraph'
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
const testBrokenNumberSourceType = 'Test/BrokenNumberMm'
const testNumberDegSourceType = 'Test/NumberDeg'

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
})

afterAll(() => {
  delete registryWithTests[testVec2SourceType]
  delete registryWithTests[testNumberSourceType]
  delete registryWithTests[testVec2SinkType]
  delete registryWithTests[testRailMathSourceType]
  delete registryWithTests[testRailMathSinkType]
  delete registryWithTests[testToeLoftSourceType]
  delete registryWithTests[testToeLoftSinkType]
  delete registryWithTests[testBrokenNumberSourceType]
  delete registryWithTests[testNumberDegSourceType]
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
