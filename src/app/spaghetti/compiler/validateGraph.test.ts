import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { NodeDefinition } from '../registry/nodeRegistry'
import type { PortSpec, PortType, SpaghettiGraph } from '../schema/spaghettiTypes'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

const makeFixtureNodeDef = (config: {
  label: string
  inputs: PortSpec[]
  outputs: PortSpec[]
}): NodeDefinition =>
  ({
    // Test-only fixture defs are injected through mocked lookup.
    type: 'Primitive/Number',
    label: config.label,
    paramsSchema: z.object({}).strict(),
    inputs: config.inputs,
    outputs: config.outputs,
    compute: () => ({}),
  }) as unknown as NodeDefinition

const profileLoopType: PortType = { kind: 'profileLoop' }
const numberMmType: PortType = { kind: 'number', unit: 'mm' }
const numberDegType: PortType = { kind: 'number', unit: 'deg' }

const fixtureNodeDefs: Record<string, NodeDefinition> = {
  'Test/ProfileLoopSource': makeFixtureNodeDef({
    label: 'Test ProfileLoop Source',
    inputs: [],
    outputs: [
      {
        portId: 'loop',
        label: 'Loop',
        type: profileLoopType,
      },
    ],
  }),
  'Test/ProfileLoopSink': makeFixtureNodeDef({
    label: 'Test ProfileLoop Sink',
    inputs: [
      {
        portId: 'loop',
        label: 'Loop',
        type: profileLoopType,
      },
    ],
    outputs: [],
  }),
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

import { validateGraph } from './validateGraph'

const createBaseGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'n-num',
      type: 'Primitive/Number',
      params: {
        value: 10,
      },
    },
    {
      nodeId: 'n-spline',
      type: 'Primitive/SplineFromPoints',
      params: {
        points: [],
      },
    },
  ],
  edges: [],
})

const createProfileLoopGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'n-loop-source',
      type: 'Test/ProfileLoopSource',
      params: {},
    },
    {
      nodeId: 'n-loop-sink',
      type: 'Test/ProfileLoopSink',
      params: {},
    },
  ],
  edges: [],
})

describe('validateGraph endpoint paths', () => {
  it('accepts valid leaf path endpoint', () => {
    const graph = createBaseGraph()
    graph.edges.push({
      edgeId: 'e-valid-path',
      from: {
        nodeId: 'n-num',
        portId: 'value',
      },
      to: {
        nodeId: 'n-spline',
        portId: 'points',
        path: ['x'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects invalid endpoint path', () => {
    const graph = createBaseGraph()
    graph.edges.push({
      edgeId: 'e-invalid-path',
      from: {
        nodeId: 'n-num',
        portId: 'value',
      },
      to: {
        nodeId: 'n-spline',
        portId: 'points',
        path: ['z'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_PATH_INVALID')).toBe(true)
  })

  it('rejects duplicate target leaf-path connections', () => {
    const graph = createBaseGraph()
    graph.edges.push(
      {
        edgeId: 'e-1',
        from: {
          nodeId: 'n-num',
          portId: 'value',
        },
        to: {
          nodeId: 'n-spline',
          portId: 'points',
          path: ['x'],
        },
      },
      {
        edgeId: 'e-2',
        from: {
          nodeId: 'n-num',
          portId: 'value',
        },
        to: {
          nodeId: 'n-spline',
          portId: 'points',
          path: ['x'],
        },
      },
    )

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_PATH_DUPLICATE')).toBe(true)
  })

  it('accepts valid profileLoop leaf path endpoint via test fixture', () => {
    const graph = createProfileLoopGraph()
    graph.edges.push({
      edgeId: 'e-profile-valid',
      from: {
        nodeId: 'n-loop-source',
        portId: 'loop',
        path: ['centroid', 'x'],
      },
      to: {
        nodeId: 'n-loop-sink',
        portId: 'loop',
        path: ['centroid', 'x'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects profileLoop non-leaf path endpoint via test fixture', () => {
    const graph = createProfileLoopGraph()
    graph.edges.push({
      edgeId: 'e-profile-not-leaf',
      from: {
        nodeId: 'n-loop-source',
        portId: 'loop',
        path: ['centroid', 'x'],
      },
      to: {
        nodeId: 'n-loop-sink',
        portId: 'loop',
        path: ['centroid'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_PATH_NOT_LEAF')).toBe(true)
  })

  it('rejects profileLoop unknown path endpoint via test fixture', () => {
    const graph = createProfileLoopGraph()
    graph.edges.push({
      edgeId: 'e-profile-unknown-path',
      from: {
        nodeId: 'n-loop-source',
        portId: 'loop',
        path: ['centroid', 'x'],
      },
      to: {
        nodeId: 'n-loop-sink',
        portId: 'loop',
        path: ['unknown'],
      },
    })

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_PATH_INVALID')).toBe(true)
  })
})

describe('validateGraph feature virtual input wiring', () => {
  const cubeNode = {
    nodeId: 'n-cube',
    type: 'Part/Cube' as const,
    params: getDefaultNodeParams('Part/Cube'),
  }

  const extrudeFeature = {
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
  }

  it('accepts valid external wire into extrude depth virtual input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [extrudeFeature],
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-depth-external',
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

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts valid external wire into extrude taper virtual input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-deg',
          type: 'Test/NumberDegSource',
          params: {},
        },
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [extrudeFeature],
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-taper-external',
          from: {
            nodeId: 'n-source-deg',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:taper',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts valid external wire into extrude offset virtual input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [extrudeFeature],
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-offset-external',
          from: {
            nodeId: 'n-source-mm',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:offset',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    if (!result.ok) {
      throw new Error(JSON.stringify(result.errors))
    }
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts valid external wire into cube sketch rectangle width/length virtual inputs', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm-a',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-source-mm-b',
          type: 'Test/NumberMmSource',
          params: {},
        },
        cubeNode,
      ],
      edges: [
        {
          edgeId: 'e-width-external',
          from: {
            nodeId: 'n-source-mm-a',
            portId: 'value',
          },
          to: {
            nodeId: 'n-cube',
            portId: 'fs:in:cube-sketch-1:sketchRect:width',
          },
        },
        {
          edgeId: 'e-length-external',
          from: {
            nodeId: 'n-source-mm-b',
            portId: 'value',
          },
          to: {
            nodeId: 'n-cube',
            portId: 'fs:in:cube-sketch-1:sketchRect:length',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects path on feature virtual input with stable code', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [extrudeFeature],
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-depth-path',
          from: {
            nodeId: 'n-source-mm',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:depth',
            path: ['x'],
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(
      result.errors.some((error) => error.code === 'FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED'),
    ).toBe(true)
  })

  it('rejects path on cube sketch rectangle feature virtual input with stable code', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm',
          type: 'Test/NumberMmSource',
          params: {},
        },
        cubeNode,
      ],
      edges: [
        {
          edgeId: 'e-cube-width-path',
          from: {
            nodeId: 'n-source-mm',
            portId: 'value',
          },
          to: {
            nodeId: 'n-cube',
            portId: 'fs:in:cube-sketch-1:sketchRect:width',
            path: ['x'],
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(
      result.errors.some((error) => error.code === 'FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED'),
    ).toBe(true)
  })

  it('rejects same-node wires targeting feature virtual inputs in v1', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [extrudeFeature],
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-depth-same-node',
          from: {
            nodeId: 'n-baseplate',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:depth',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(
      result.errors.some((error) => error.code === 'FEATURE_WIRE_INTRA_NODE_UNSUPPORTED'),
    ).toBe(true)
  })

  it('rejects multiple incoming wires on the same virtual depth input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-mm-a',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-source-mm-b',
          type: 'Test/NumberMmSource',
          params: {},
        },
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [extrudeFeature],
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-depth-1',
          from: {
            nodeId: 'n-source-mm-a',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:depth',
          },
        },
        {
          edgeId: 'e-depth-2',
          from: {
            nodeId: 'n-source-mm-b',
            portId: 'value',
          },
          to: {
            nodeId: 'n-baseplate',
            portId: 'fs:in:feature-depth-1:extrude:depth',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_MAX_CONNECTIONS')).toBe(true)
  })

  it('rejects enabled downstream features that reference a disabled source feature', () => {
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
                featureId: 'feature-sketch-1',
                enabled: false,
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-1',
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
                featureId: 'feature-close-1',
                inputs: {
                  sourceSketchFeatureId: 'feature-sketch-1',
                },
                outputs: {
                  profileRef: null,
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

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'CLOSE_PROFILE_SOURCE_MISSING')).toBe(true)
  })

  it('rejects enabled downstream features that move ahead of their source feature', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'extrude',
                featureId: 'feature-extrude-1',
                inputs: {
                  profileRef: {
                    sourceFeatureId: 'feature-sketch-1',
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
              {
                type: 'sketch',
                featureId: 'feature-sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-1',
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
            ],
          },
        },
      ],
      edges: [],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EXTRUDE_PROFILE_REF_INVALID')).toBe(true)
  })
})

describe('validateGraph driver virtual output wiring', () => {
  it('accepts matching nodeParam driver output to input type', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-baseplate',
          type: 'Part/Baseplate',
          params: {
            widthMm: 33,
            lengthMm: 200,
          },
        },
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
        {
          nodeId: 'n-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-driver-ok',
          from: {
            nodeId: 'n-source-baseplate',
            portId: 'out:drv:widthMm',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'width',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects mismatched nodeParam driver output to input type', () => {
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
          params: {
            driverOffsetByParamId: {
              widthMm: 2,
            },
            driverDrivenByParamId: {
              widthMm: true,
            },
          },
        },
      ],
      edges: [
        {
          edgeId: 'e-driver-type-mismatch',
          from: {
            nodeId: 'n-source-toehook',
            portId: 'out:drv:profileA_end',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'width',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TYPE_MISMATCH')).toBe(true)
  })

  it('accepts compatible output -> driver virtual input wiring', () => {
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
      edges: [
        {
          edgeId: 'e-driver-input-ok',
          from: {
            nodeId: 'n-source-mm',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts legacy driver virtual aliases for compatibility', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-baseplate',
          type: 'Part/Baseplate',
          params: {
            widthMm: 33,
            lengthMm: 200,
          },
        },
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-driver-legacy-out',
          from: {
            nodeId: 'n-source-baseplate',
            portId: 'drv:widthMm',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'width',
          },
        },
        {
          edgeId: 'e-driver-legacy-in',
          from: {
            nodeId: 'n-source-mm',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'drv:in:widthMm',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects unit-mismatched output -> driver virtual input wiring', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-source-deg',
          type: 'Test/NumberDegSource',
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
          edgeId: 'e-driver-input-type-mismatch',
          from: {
            nodeId: 'n-source-deg',
            portId: 'value',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TYPE_MISMATCH')).toBe(true)
  })

  it('rejects path targeting driver virtual input', () => {
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
      edges: [
        {
          edgeId: 'e-driver-input-path',
          from: {
            nodeId: 'n-source-mm',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
            path: ['x'],
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(
      result.errors.some((error) => error.code === 'DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED'),
    ).toBe(true)
  })

  it('enforces maxConnectionsIn = 1 on driver virtual input', () => {
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
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-driver-input-max-1',
          from: {
            nodeId: 'n-source-mm-a',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
        {
          edgeId: 'e-driver-input-max-2',
          from: {
            nodeId: 'n-source-mm-b',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_MAX_CONNECTIONS')).toBe(true)
  })

  it('treats mixed canonical/legacy driver-input aliases as one maxConnections endpoint', () => {
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
        {
          nodeId: 'n-target-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-driver-input-mixed-1',
          from: {
            nodeId: 'n-source-mm-a',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'in:drv:widthMm',
          },
        },
        {
          edgeId: 'e-driver-input-mixed-2',
          from: {
            nodeId: 'n-source-mm-b',
            portId: 'out',
          },
          to: {
            nodeId: 'n-target-baseplate',
            portId: 'drv:in:widthMm',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_MAX_CONNECTIONS')).toBe(true)
  })
})

describe('validateGraph OutputPreview dynamic slot inputs', () => {
  it('accepts existing toeLoft output wired into OutputPreview in:solid slot port', () => {
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
      edges: [
        {
          edgeId: 'e-output-preview-slot-1',
          from: {
            nodeId: 'n-toehook',
            portId: 'toeLoft',
          },
          to: {
            nodeId: 'n-output-preview',
            portId: 'in:solid:s001',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('enforces maxConnectionsIn = 1 on OutputPreview in:solid slot ports', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-toehook',
          type: 'Part/ToeHook',
          params: {},
        },
        {
          nodeId: 'n-heelkick',
          type: 'Part/HeelKick',
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
      edges: [
        {
          edgeId: 'e-output-preview-slot-max-1',
          from: {
            nodeId: 'n-toehook',
            portId: 'toeLoft',
          },
          to: {
            nodeId: 'n-output-preview',
            portId: 'in:solid:s001',
          },
        },
        {
          edgeId: 'e-output-preview-slot-max-2',
          from: {
            nodeId: 'n-heelkick',
            portId: 'hookLoft',
          },
          to: {
            nodeId: 'n-output-preview',
            portId: 'in:solid:s001',
          },
        },
      ],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.code === 'EDGE_TO_MAX_CONNECTIONS')).toBe(true)
  })
})

describe('validateGraph partSlots normalization warnings', () => {
  it('emits partSlots_missing_normalized for part nodes without partSlots', () => {
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

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(
      result.warnings.some((warning) => warning.code === 'partSlots_missing_normalized'),
    ).toBe(true)
  })

  it.each([
    ['null', null],
    ['array', []],
    ['string', 'bad-shape'],
    [
      'partial keys',
      {
        drivers: true,
        inputs: true,
        outputs: true,
      },
    ],
    [
      'extra key',
      {
        drivers: true,
        inputs: true,
        featureStack: true,
        outputs: true,
        extra: true,
      },
    ],
    [
      'false value',
      {
        drivers: true,
        inputs: true,
        featureStack: false,
        outputs: true,
      },
    ],
  ])('emits partSlots_invalid_shape_repaired for invalid partSlots shape: %s', (_label, shape) => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
          partSlots: shape as unknown as SpaghettiGraph['nodes'][number]['partSlots'],
        },
      ],
      edges: [],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.warnings.filter((warning) => warning.code === 'partSlots_invalid_shape_repaired'))
      .toHaveLength(1)
    expect(
      result.warnings.some((warning) => warning.code === 'partSlots_missing_normalized'),
    ).toBe(false)
  })

  it('emits deterministic and reproducible warning list for mixed missing/invalid partSlots', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-part-missing',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-part-invalid',
          type: 'Part/ToeHook',
          params: {},
          partSlots: {
            drivers: true,
            inputs: true,
            outputs: true,
          } as unknown as SpaghettiGraph['nodes'][number]['partSlots'],
        },
      ],
      edges: [],
    }

    const first = validateGraph(graph)
    const second = validateGraph(graph)

    expect(first.ok).toBe(true)
    expect(second.ok).toBe(true)
    expect(first.warnings).toEqual(second.warnings)
    expect(first.warnings).toHaveLength(2)
    expect(first.warnings.map((warning) => [warning.nodeId, warning.code])).toEqual([
      ['n-part-invalid', 'partSlots_invalid_shape_repaired'],
      ['n-part-missing', 'partSlots_missing_normalized'],
    ])
  })
})

describe('validateGraph partRowOrder normalization warnings', () => {
  const validPartSlots = {
    drivers: true as const,
    inputs: true as const,
    featureStack: true as const,
    outputs: true as const,
  }

  it('does not warn when partRowOrder is absent (valid fallback mode)', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
          partSlots: validPartSlots,
        },
      ],
      edges: [],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(
      result.warnings.some((warning) => warning.code === 'partRowOrder_invalid_shape_repaired'),
    ).toBe(false)
  })

  it('emits partRowOrder_invalid_shape_repaired for invalid shape and avoids NODE_PARAMS_INVALID', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            partRowOrder: {
              drivers: [1, 2, 3],
              extra: true,
            },
          } as unknown as Record<string, unknown>,
          partSlots: validPartSlots,
        },
      ],
      edges: [],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(
      result.warnings.filter((warning) => warning.code === 'partRowOrder_invalid_shape_repaired'),
    ).toHaveLength(1)
    expect(result.errors.some((error) => error.code === 'NODE_PARAMS_INVALID')).toBe(false)
  })

  it('does not warn for non-shape content normalization (unknown/dedupe/append)', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {
            partRowOrder: {
              drivers: ['drv:lengthMm', 'drv:lengthMm', 'drv:unknown'],
            },
          },
          partSlots: validPartSlots,
        },
      ],
      edges: [],
    }

    const result = validateGraph(graph)
    expect(result.ok).toBe(true)
    expect(
      result.warnings.some((warning) => warning.code === 'partRowOrder_invalid_shape_repaired'),
    ).toBe(false)
  })
})
