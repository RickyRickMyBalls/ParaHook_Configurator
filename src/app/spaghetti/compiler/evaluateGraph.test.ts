import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { evaluateSpaghettiGraph } from './evaluateGraph'
import {
  registry,
  type NodeDefinition,
} from '../registry/nodeRegistry'

const testVec2SourceType = 'Test/Vec2Source'
const testNumberSourceType = 'Test/NumberMm'
const testVec2SinkType = 'Test/Vec2Sink'
const testRailMathSourceType = 'Test/RailMathSource'
const testRailMathSinkType = 'Test/RailMathSink'
const testToeLoftSourceType = 'Test/ToeLoftSource'
const testToeLoftSinkType = 'Test/ToeLoftSink'

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
})

afterAll(() => {
  delete registryWithTests[testVec2SourceType]
  delete registryWithTests[testNumberSourceType]
  delete registryWithTests[testVec2SinkType]
  delete registryWithTests[testRailMathSourceType]
  delete registryWithTests[testRailMathSinkType]
  delete registryWithTests[testToeLoftSourceType]
  delete registryWithTests[testToeLoftSinkType]
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
