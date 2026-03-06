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
import {
  executeFeatureStack,
  type FeatureStackIRPayload,
} from './featureStackRuntime'

const rectangleVertices = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 5 },
  { x: 0, y: 5 },
]

const basePayload = (): FeatureStackIRPayload => ({
  schemaVersion: 1,
  parts: {
    baseplate: [
      {
        op: 'sketch',
        featureId: 'sketch-1',
        profilesResolved: [
          {
            profileId: 'prof-a',
            area: 50,
            vertices: rectangleVertices,
          },
        ],
      },
      {
        op: 'extrude',
        featureId: 'extrude-1',
        profileRef: {
          sketchFeatureId: 'sketch-1',
          profileId: 'prof-a',
        },
        depthResolved: 3,
        bodyId: 'body-a',
      },
    ],
  },
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
        { profileId: 'prof-a', area: 50, vertices: rectangleVertices },
        {
          profileId: 'prof-b',
          area: 9,
          vertices: [
            { x: 20, y: 0 },
            { x: 23, y: 0 },
            { x: 23, y: 3 },
            { x: 20, y: 3 },
          ],
        },
      ],
    }
    payload.parts.baseplate.push({
      op: 'extrude',
      featureId: 'extrude-2',
      profileRef: {
        sketchFeatureId: 'sketch-1',
        profileId: 'prof-b',
      },
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
            profilesResolved: [{ profileId: 'z-prof', area: 1, vertices: rectangleVertices }],
          },
          {
            op: 'extrude',
            featureId: 'z-extrude',
            profileRef: { sketchFeatureId: 'z-sketch', profileId: 'z-prof' },
            depthResolved: 1,
            bodyId: 'body-z',
          },
        ],
        aPart: [
          {
            op: 'sketch',
            featureId: 'a-sketch',
            profilesResolved: [{ profileId: 'a-prof', area: 1, vertices: rectangleVertices }],
          },
          {
            op: 'extrude',
            featureId: 'a-extrude',
            profileRef: { sketchFeatureId: 'a-sketch', profileId: 'a-prof' },
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
            profilesResolved: [{ profileId: 'prof-2', area: 1, vertices: rectangleVertices }],
          },
          {
            op: 'extrude',
            featureId: 'cube-2-extrude',
            profileRef: { sketchFeatureId: 'cube-2-sketch', profileId: 'prof-2' },
            depthResolved: 1,
            bodyId: 'cube-body-1',
          },
        ],
        'cube#1': [
          {
            op: 'sketch',
            featureId: 'cube-1-sketch',
            profilesResolved: [{ profileId: 'prof-1', area: 1, vertices: rectangleVertices }],
          },
          {
            op: 'extrude',
            featureId: 'cube-1-extrude',
            profileRef: { sketchFeatureId: 'cube-1-sketch', profileId: 'prof-1' },
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
      profileRef: {
        sketchFeatureId: 'sketch-1',
        profileId: 'prof-a',
      },
      depthResolved: 6,
      bodyId: 'body-a',
    })

    const result = executeFeatureStack(payload)
    expect(Object.keys(result.bodies)).toEqual(['baseplate:body-a'])
    expect(
      result.diagnostics.some((item) => item.reason === 'duplicate_body_id'),
    ).toBe(true)
  })
})

describe('buildModel diagnostics flush', () => {
  it('keeps cube default dimensions renderable when no cube dimension wires are present', () => {
    const compileResult = compileSpaghettiGraph(defaultCubeGraph())
    expect(compileResult.ok).toBe(true)

    const parts = buildModel({
      payload: {
        width: 1,
        length: 2,
        height: 3,
        ...(compileResult.buildInputs?.resolvedShared ?? {}),
      } as unknown as { width: number; length: number; height: number },
      instances: {},
    })

    expect(parts.find((part) => part.partKeyStr === 'cube')).toEqual({
      id: 'cube',
      label: 'Cube',
      kind: 'box',
      params: {
        length: 20,
        width: 20,
        height: 20,
      },
      partKeyStr: 'cube',
      partKey: {
        id: 'cube',
        instance: null,
      },
    })
  })

  it('emits a deterministic cube PartArtifact from compiled graph Feature Stack IR', () => {
    const compileResult = compileSpaghettiGraph(cubeGraph())
    expect(compileResult.ok).toBe(true)
    expect(compileResult.buildInputs).toBeDefined()

    const payload = {
      width: 1,
      length: 2,
      height: 3,
      ...(compileResult.buildInputs?.resolvedShared ?? {}),
    } as unknown as { width: number; length: number; height: number }

    const parts = buildModel({
      payload: {
        ...payload,
      },
      instances: {},
    })
    const repeated = buildModel({
      payload: {
        ...payload,
      },
      instances: {},
    })

    const cube = parts.find((part) => part.partKeyStr === 'cube')
    expect(repeated).toEqual(parts)
    expect(cube).toEqual({
      id: 'cube',
      label: 'Cube',
      kind: 'box',
      params: {
        length: 30,
        width: 15,
        height: 25,
      },
      partKeyStr: 'cube',
      partKey: {
        id: 'cube',
        instance: null,
      },
    })
  })

  it('emits deterministic multi-part cube PartArtifacts from compiled graph Feature Stack IR', () => {
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

    const parts = buildModel({
      payload: {
        width: 1,
        length: 2,
        height: 3,
        ...(compileResult.buildInputs?.resolvedShared ?? {}),
      } as unknown as { width: number; length: number; height: number },
      instances: {},
    })

    expect(parts.map((part) => part.partKeyStr)).toEqual(
      expect.arrayContaining(['cube#1', 'cube#2']),
    )
    expect(parts.find((part) => part.partKeyStr === 'cube#1')?.label).toBe('Cube #1')
    expect(parts.find((part) => part.partKeyStr === 'cube#2')?.label).toBe('Cube #2')
  })

  it('keeps cube unresolved at runtime when the extrude feature is disabled', () => {
    const compileResult = compileSpaghettiGraph(disabledCubeExtrudeGraph())
    expect(compileResult.ok).toBe(true)

    const parts = buildModel({
      payload: {
        width: 1,
        length: 2,
        height: 3,
        ...(compileResult.buildInputs?.resolvedShared ?? {}),
      } as unknown as { width: number; length: number; height: number },
      instances: {},
    })

    expect(parts.some((part) => part.partKeyStr === 'cube')).toBe(false)
  })

  it('flushes unique warnings once per build', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    buildModel({
      payload: {
        width: 1,
        length: 2,
        height: 3,
        sp_featureStackIR: {
          schemaVersion: 1,
          parts: {
            baseplate: [
              {
                op: 'extrude',
                featureId: 'e1',
                profileRef: null,
                depthResolved: 1,
                bodyId: 'dup',
              },
              {
                op: 'extrude',
                featureId: 'e1',
                profileRef: null,
                depthResolved: 1,
                bodyId: 'dup',
              },
            ],
          },
        },
      } as unknown as { width: number; length: number; height: number },
      instances: {},
    })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockRestore()
  })
})
