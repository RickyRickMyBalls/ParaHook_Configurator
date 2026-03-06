import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { validateGraph } from '../compiler/validateGraph'
import { validateConnectionCheap } from './SpaghettiCanvas'

describe('feature virtual input resolver consistency', () => {
  const basePartNode = {
    nodeId: 'n-baseplate',
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
  }

  it('accepts the same valid external feature-wire endpoint in cheap and full validation', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        basePartNode,
      ],
      edges: [],
    }

    const payload = {
      from: {
        nodeId: 'n-source-mm',
        portId: 'out',
      },
      to: {
        nodeId: 'n-baseplate',
        portId: 'fs:in:feature-depth-1:extrude:depth',
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    const validated = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-depth',
          from: payload.from,
          to: payload.to,
        },
      ],
    })

    expect(cheap.ok).toBe(true)
    expect(validated.ok).toBe(true)
  })

  it('accepts valid external offset wire and rejects taper unit mismatch with parity', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        basePartNode,
      ],
      edges: [],
    }

    const validPayload = {
      from: {
        nodeId: 'n-source-mm',
        portId: 'out',
      },
      to: {
        nodeId: 'n-baseplate',
        portId: 'fs:in:feature-depth-1:extrude:offset',
      },
    }
    const invalidPayload = {
      from: {
        nodeId: 'n-source-mm',
        portId: 'out',
      },
      to: {
        nodeId: 'n-baseplate',
        portId: 'fs:in:feature-depth-1:extrude:taper',
      },
    }

    const cheapValid = validateConnectionCheap(graph, validPayload)
    const validatedValid = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-offset-ok',
          from: validPayload.from,
          to: validPayload.to,
        },
      ],
    })
    const cheapInvalid = validateConnectionCheap(graph, invalidPayload)
    const validatedInvalid = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-taper-bad-unit',
          from: invalidPayload.from,
          to: invalidPayload.to,
        },
      ],
    })

    expect(cheapValid.ok).toBe(true)
    expect(validatedValid.ok).toBe(true)
    expect(cheapInvalid.ok).toBe(false)
    expect(validatedInvalid.ok).toBe(false)
    expect(validatedInvalid.errors.some((error) => error.code === 'EDGE_TYPE_MISMATCH')).toBe(
      true,
    )
  })

  it('rejects same-node feature-target wire in cheap and full validation', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [basePartNode],
      edges: [],
    }

    const payload = {
      from: {
        nodeId: 'n-baseplate',
        portId: 'anchorSpline2',
      },
      to: {
        nodeId: 'n-baseplate',
        portId: 'fs:in:feature-depth-1:extrude:depth',
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    const validated = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-depth-same-node',
          from: payload.from,
          to: payload.to,
        },
      ],
    })

    expect(cheap.ok).toBe(false)
    expect(validated.ok).toBe(false)
    expect(
      validated.errors.some((error) => error.code === 'FEATURE_WIRE_INTRA_NODE_UNSUPPORTED'),
    ).toBe(true)
  })

  it('rejects path on feature virtual input with parity code/reason', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        basePartNode,
      ],
      edges: [],
    }

    const payload = {
      from: {
        nodeId: 'n-source-mm',
        portId: 'out',
      },
      to: {
        nodeId: 'n-baseplate',
        portId: 'fs:in:feature-depth-1:extrude:offset',
        path: ['x'],
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    const validated = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-feature-path',
          from: payload.from,
          to: payload.to,
        },
      ],
    })

    expect(cheap.ok).toBe(false)
    expect(cheap.code).toBe('FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED')
    expect(cheap.reason).toBe('Feature virtual inputs do not support path connections.')
    expect(validated.ok).toBe(false)
    expect(
      validated.errors.some((error) => error.code === 'FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED'),
    ).toBe(true)
  })

  it('rejects occupied feature virtual input in cheap-check (no auto-replace)', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm-a',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'n-source-mm-b',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        basePartNode,
      ],
      edges: [
        {
          edgeId: 'e-depth-existing',
          from: {
            nodeId: 'n-source-mm-a',
            portId: 'out',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:offset',
          },
        },
      ],
    }

    const payload = {
      from: {
        nodeId: 'n-source-mm-b',
        portId: 'out',
      },
      to: {
        nodeId: 'n-baseplate',
        portId: 'fs:in:feature-depth-1:extrude:offset',
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    expect(cheap.ok).toBe(false)
    expect(cheap.reason).toContain('Input allows up to')
  })
})

describe('driver virtual output resolver consistency', () => {
  it('accepts matching driver-output to input endpoint in cheap and full validation', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-baseplate',
          type: 'Part/Baseplate',
          params: {
            widthMm: 30,
            lengthMm: 200,
          },
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    const payload = {
      from: {
        nodeId: 'n-source-baseplate',
        portId: 'out:drv:widthMm',
      },
      to: {
        nodeId: 'n-target-baseplate',
        portId: 'width',
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    const validated = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-driver-accept',
          from: payload.from,
          to: payload.to,
        },
      ],
    })

    expect(cheap.ok).toBe(true)
    expect(validated.ok).toBe(true)
  })

  it('rejects mismatched driver-output to input endpoint in cheap and full validation', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-toehook',
          type: 'Part/ToeHook',
          params: {},
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    const payload = {
      from: {
        nodeId: 'n-source-toehook',
        portId: 'out:drv:profileA_end',
      },
      to: {
        nodeId: 'n-target-baseplate',
        portId: 'width',
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    const validated = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-driver-reject',
          from: payload.from,
          to: payload.to,
        },
      ],
    })

    expect(cheap.ok).toBe(false)
    expect(validated.ok).toBe(false)
    expect(validated.errors.some((error) => error.code === 'EDGE_TYPE_MISMATCH')).toBe(true)
  })

  it('accepts output -> driver virtual input in cheap and full validation', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    const payload = {
      from: {
        nodeId: 'n-source-mm',
        portId: 'out',
      },
      to: {
        nodeId: 'n-target-baseplate',
        portId: 'in:drv:widthMm',
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    const validated = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-driver-in-accept',
          from: payload.from,
          to: payload.to,
        },
      ],
    })

    expect(cheap.ok).toBe(true)
    expect(validated.ok).toBe(true)
  })

  it('allows occupied driver virtual input target in cheap-check for auto-replace semantics', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-old',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'n-source-new',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-existing-driver-input',
          from: {
            nodeId: 'n-source-old',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
      ],
    }

    const payload = {
      from: {
        nodeId: 'n-source-new',
        portId: 'out',
      },
      to: {
        nodeId: 'n-target-baseplate',
        portId: 'in:drv:widthMm',
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    expect(cheap.ok).toBe(true)
  })

  it('keeps max-connection rejection for non-driver occupied targets', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-old',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'n-source-new',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'n-target-identity',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-existing-input',
          from: {
            nodeId: 'n-source-old',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-identity',
            portId: 'in',
          },
        },
      ],
    }

    const payload = {
      from: {
        nodeId: 'n-source-new',
        portId: 'out',
      },
      to: {
        nodeId: 'n-target-identity',
        portId: 'in',
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    expect(cheap.ok).toBe(false)
    expect(cheap.reason).toContain('Input allows up to')
  })

  it('rejects path on driver virtual input in cheap and full validation with parity code/reason', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    const payload = {
      from: {
        nodeId: 'n-source-mm',
        portId: 'out',
      },
      to: {
        nodeId: 'n-target-baseplate',
        portId: 'in:drv:widthMm',
        path: ['x'],
      },
    }

    const cheap = validateConnectionCheap(graph, payload)
    const validated = validateGraph({
      ...graph,
      edges: [
        {
          edgeId: 'e-driver-in-path-reject',
          from: payload.from,
          to: payload.to,
        },
      ],
    })

    expect(cheap.ok).toBe(false)
    expect(cheap.code).toBe('DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED')
    expect(cheap.reason).toBe('Driver virtual inputs do not support path connections.')
    expect(validated.ok).toBe(false)
    expect(
      validated.errors.some(
        (error) => error.code === 'DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED',
      ),
    ).toBe(true)
  })
})
