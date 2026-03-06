import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { NodeDefinition } from '../registry/nodeRegistry'
import type { PortSpec, PortType, SpaghettiGraph } from '../schema/spaghettiTypes'

const makeFixtureNodeDef = (config: {
  label: string
  inputs: PortSpec[]
  outputs: PortSpec[]
}): NodeDefinition =>
  ({
    type: 'Primitive/Number',
    label: config.label,
    paramsSchema: z.object({}).strict(),
    inputs: config.inputs,
    outputs: config.outputs,
    compute: () => ({}),
  }) as unknown as NodeDefinition

const numberMmType: PortType = { kind: 'number', unit: 'mm' }
const numberDegType: PortType = { kind: 'number', unit: 'deg' }

const fixtureNodeDefs: Record<string, NodeDefinition> = {
  'Test/NumberMmSource': makeFixtureNodeDef({
    label: 'Test Number Source (mm)',
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: numberMmType,
      },
    ],
  }),
  'Test/NumberDegSource': makeFixtureNodeDef({
    label: 'Test Number Source (deg)',
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: numberDegType,
      },
    ],
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

import { validateConnectionCheap } from '../canvas/SpaghettiCanvas'
import { planConnectEdgeWithAutoReplace } from '../graphCommands'
import type { EdgeEndpoint } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { validateGraphConnectionDecision } from '../compiler/validateGraph'

type ConnectionPayload = {
  from: EdgeEndpoint
  to: EdgeEndpoint
}

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const toEdgeEndpoint = (endpoint: EdgeEndpoint): EdgeEndpoint => {
  const path = normalizePath(endpoint.path)
  return {
    nodeId: endpoint.nodeId,
    portId: endpoint.portId,
    ...(path === undefined ? {} : { path }),
  }
}

const getProjectedContractDecision = (
  graph: SpaghettiGraph,
  payload: ConnectionPayload,
) => {
  const plan = planConnectEdgeWithAutoReplace(graph, {
    edgeId: '__ct1-parity-probe__',
    from: toEdgeEndpoint(payload.from),
    to: toEdgeEndpoint(payload.to),
  })
  if (plan.kind === 'noop') {
    return { ok: true, code: 'OK' as const }
  }
  const projectedGraph: SpaghettiGraph = {
    ...graph,
    edges: plan.nextEdges,
  }
  return validateGraphConnectionDecision(projectedGraph, payload)
}

const assertProjectedParity = (
  graph: SpaghettiGraph,
  payload: ConnectionPayload,
) => {
  const cheap = validateConnectionCheap(graph, payload)
  const decision = getProjectedContractDecision(graph, payload)
  expect(cheap.ok).toBe(decision.ok)
  expect(cheap.code).toBe(decision.code)
}

describe('contract parity (canvas cheap-check vs validator decision)', () => {
  it('keeps parity for canonical and legacy driver aliases', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-driver-source',
          type: 'Part/Baseplate',
          params: {
            widthMm: 33,
            lengthMm: 200,
          },
        },
        {
          nodeId: 'n-mm-source',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-driver-target',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    const canonicalOutPayload: ConnectionPayload = {
      from: { nodeId: 'n-driver-source', portId: 'out:drv:widthMm' },
      to: { nodeId: 'n-driver-target', portId: 'width' },
    }
    const legacyOutPayload: ConnectionPayload = {
      from: { nodeId: 'n-driver-source', portId: 'drv:widthMm' },
      to: { nodeId: 'n-driver-target', portId: 'width' },
    }
    const canonicalInPayload: ConnectionPayload = {
      from: { nodeId: 'n-mm-source', portId: 'value' },
      to: { nodeId: 'n-driver-target', portId: 'in:drv:widthMm' },
    }
    const legacyInPayload: ConnectionPayload = {
      from: { nodeId: 'n-mm-source', portId: 'value' },
      to: { nodeId: 'n-driver-target', portId: 'drv:in:widthMm' },
    }

    assertProjectedParity(graph, canonicalOutPayload)
    assertProjectedParity(graph, legacyOutPayload)
    assertProjectedParity(graph, canonicalInPayload)
    assertProjectedParity(graph, legacyInPayload)
  })

  it('treats mixed driver-input aliases as one logical endpoint for maxConnections', () => {
    const payload: ConnectionPayload = {
      from: { nodeId: 'n-source-b', portId: 'value' },
      to: { nodeId: 'n-target', portId: 'drv:in:widthMm' },
    }
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        { nodeId: 'n-source-a', type: 'Test/NumberMmSource', params: {} },
        { nodeId: 'n-source-b', type: 'Test/NumberMmSource', params: {} },
        { nodeId: 'n-target', type: 'Part/Baseplate', params: {} },
      ],
      edges: [
        {
          edgeId: 'e-existing-driver',
          from: { nodeId: 'n-source-a', portId: 'value' },
          to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
        },
      ],
    }

    assertProjectedParity(graph, payload)

    const strictGraph: SpaghettiGraph = {
      ...graph,
      edges: [
        ...graph.edges,
        {
          edgeId: 'e-mixed-alias-second',
          from: payload.from,
          to: payload.to,
        },
      ],
    }
    const strictDecision = validateGraphConnectionDecision(strictGraph, payload)
    expect(strictDecision.ok).toBe(false)
    if (strictDecision.ok) {
      return
    }
    expect(strictDecision.code).toBe('EDGE_TO_MAX_CONNECTIONS')
  })

  it('keeps parity for number unit mismatch rejection (mm -> deg)', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-mm-source',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-part',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'extrude' as const,
                featureId: 'feature-depth-1',
                inputs: {
                  profileRef: null,
                },
                params: {
                  depth: {
                    kind: 'lit' as const,
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
    const payload: ConnectionPayload = {
      from: { nodeId: 'n-mm-source', portId: 'value' },
      to: { nodeId: 'n-part', portId: 'fs:in:feature-depth-1:extrude:taper' },
    }

    assertProjectedParity(graph, payload)
    const decision = getProjectedContractDecision(graph, payload)
    expect(decision.ok).toBe(false)
    if (decision.ok) {
      return
    }
    expect(decision.code).toBe('EDGE_TYPE_MISMATCH')
  })

  it('keeps parity for OutputPreview dynamic slot input resolution', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-toehook',
          type: 'Part/ToeHook',
          params: {},
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
      edges: [],
    }
    const payload: ConnectionPayload = {
      from: { nodeId: 'n-toehook', portId: 'toeLoft' },
      to: { nodeId: 'n-output-preview', portId: 'in:solid:s001' },
    }

    assertProjectedParity(graph, payload)
  })

  it('keeps parity across feature virtual ports (depth/taper/offset)', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-mm-source',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-deg-source',
          type: 'Test/NumberDegSource',
          params: {},
        },
        {
          nodeId: 'n-part',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'extrude' as const,
                featureId: 'feature-depth-1',
                inputs: {
                  profileRef: null,
                },
                params: {
                  depth: {
                    kind: 'lit' as const,
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

    assertProjectedParity(graph, {
      from: { nodeId: 'n-mm-source', portId: 'value' },
      to: { nodeId: 'n-part', portId: 'fs:in:feature-depth-1:extrude:depth' },
    })
    assertProjectedParity(graph, {
      from: { nodeId: 'n-deg-source', portId: 'value' },
      to: { nodeId: 'n-part', portId: 'fs:in:feature-depth-1:extrude:taper' },
    })
    assertProjectedParity(graph, {
      from: { nodeId: 'n-mm-source', portId: 'value' },
      to: { nodeId: 'n-part', portId: 'fs:in:feature-depth-1:extrude:offset' },
    })
  })

  it('keeps parity for composite leaf-path rules (valid, invalid, non-leaf, duplicate)', () => {
    const baseGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-a',
          type: 'Utility/IdentitySpline2',
          params: {},
        },
        {
          nodeId: 'n-source-b',
          type: 'Utility/IdentitySpline2',
          params: {},
        },
        {
          nodeId: 'n-target',
          type: 'Utility/IdentitySpline2',
          params: {},
        },
      ],
      edges: [],
    }

    assertProjectedParity(baseGraph, {
      from: { nodeId: 'n-source-a', portId: 'out', path: ['start', 'x'] },
      to: { nodeId: 'n-target', portId: 'in', path: ['end', 'x'] },
    })
    assertProjectedParity(baseGraph, {
      from: { nodeId: 'n-source-a', portId: 'out', path: ['start', 'z'] },
      to: { nodeId: 'n-target', portId: 'in', path: ['end', 'x'] },
    })
    assertProjectedParity(baseGraph, {
      from: { nodeId: 'n-source-a', portId: 'out', path: ['start', 'x'] },
      to: { nodeId: 'n-target', portId: 'in', path: ['end'] },
    })

    const duplicateGraph: SpaghettiGraph = {
      ...baseGraph,
      edges: [
        {
          edgeId: 'e-existing-leaf',
          from: { nodeId: 'n-source-a', portId: 'out', path: ['start', 'x'] },
          to: { nodeId: 'n-target', portId: 'in', path: ['end', 'x'] },
        },
      ],
    }
    assertProjectedParity(duplicateGraph, {
      from: { nodeId: 'n-source-b', portId: 'out', path: ['start', 'y'] },
      to: { nodeId: 'n-target', portId: 'in', path: ['end', 'x'] },
    })
  })
})
