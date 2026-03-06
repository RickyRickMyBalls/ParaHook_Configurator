import { describe, expect, it } from 'vitest'
import type { FeatureStack } from './featureTypes'
import type { SpaghettiNode } from '../schema/spaghettiTypes'
import {
  applyFeatureVirtualInputOverrides,
  buildExtrudeDepthVirtualInputPortId,
  buildExtrudeOffsetVirtualInputPortId,
  buildExtrudeTaperVirtualInputPortId,
  buildSketchRectLengthVirtualInputPortId,
  buildSketchRectWidthVirtualInputPortId,
  isFeatureVirtualInputPortId,
  listFeatureVirtualInputPorts,
  parseFeatureVirtualInputPortId,
} from './featureVirtualPorts'

const basePartNode = (featureStack: FeatureStack): SpaghettiNode => ({
  nodeId: 'n-baseplate',
  type: 'Part/Baseplate',
  params: {
    featureStack,
  },
})

const cubePartNode = (featureStack: FeatureStack): SpaghettiNode => ({
  nodeId: 'n-cube',
  type: 'Part/Cube',
  params: {
    featureStack,
  },
})

const cubeFeatureStack = (): FeatureStack => [
  {
    type: 'sketch',
    featureId: 'cube-sketch-1',
    plane: 'XY',
    components: [
      {
        rowId: 'cube-row-1',
        componentId: 'cube-line-1',
        type: 'line',
        a: { kind: 'lit', x: 0, y: 0 },
        b: { kind: 'lit', x: 20, y: 0 },
      },
      {
        rowId: 'cube-row-2',
        componentId: 'cube-line-2',
        type: 'line',
        a: { kind: 'lit', x: 20, y: 0 },
        b: { kind: 'lit', x: 20, y: 20 },
      },
      {
        rowId: 'cube-row-3',
        componentId: 'cube-line-3',
        type: 'line',
        a: { kind: 'lit', x: 20, y: 20 },
        b: { kind: 'lit', x: 0, y: 20 },
      },
      {
        rowId: 'cube-row-4',
        componentId: 'cube-line-4',
        type: 'line',
        a: { kind: 'lit', x: 0, y: 20 },
        b: { kind: 'lit', x: 0, y: 0 },
      },
    ],
    outputs: {
      profiles: [
        {
          profileId: 'cube-profile-1',
          profileIndex: 0,
          area: 400,
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
    type: 'extrude',
    featureId: 'cube-extrude-1',
    inputs: {
      profileRef: {
        sourceFeatureId: 'cube-sketch-1',
        profileId: 'cube-profile-1',
        profileIndex: 0,
      },
    },
    params: {
      depth: {
        kind: 'lit',
        value: 20,
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
      bodyId: 'cube-body-1',
    },
    uiState: {
      collapsed: false,
    },
  },
]

describe('featureVirtualPorts', () => {
  it('builds and parses deterministic sketch-rectangle virtual input port ids', () => {
    const widthPortId = buildSketchRectWidthVirtualInputPortId('cube-sketch-1')
    const lengthPortId = buildSketchRectLengthVirtualInputPortId('cube-sketch-1')
    expect(widthPortId).toBe('fs:in:cube-sketch-1:sketchRect:width')
    expect(lengthPortId).toBe('fs:in:cube-sketch-1:sketchRect:length')
    expect(isFeatureVirtualInputPortId(widthPortId)).toBe(true)
    expect(isFeatureVirtualInputPortId(lengthPortId)).toBe(true)
    expect(parseFeatureVirtualInputPortId(widthPortId)).toEqual({
      kind: 'sketchRectWidth',
      featureId: 'cube-sketch-1',
    })
    expect(parseFeatureVirtualInputPortId(lengthPortId)).toEqual({
      kind: 'sketchRectLength',
      featureId: 'cube-sketch-1',
    })
  })

  it('builds and parses deterministic extrude depth virtual input port ids', () => {
    const portId = buildExtrudeDepthVirtualInputPortId('feature-abc')
    expect(portId).toBe('fs:in:feature-abc:extrude:depth')
    expect(isFeatureVirtualInputPortId(portId)).toBe(true)
    expect(parseFeatureVirtualInputPortId(portId)).toEqual({
      kind: 'extrudeDepth',
      featureId: 'feature-abc',
    })
  })

  it('builds and parses deterministic extrude taper/offset virtual input port ids', () => {
    const taperPortId = buildExtrudeTaperVirtualInputPortId('feature-abc')
    const offsetPortId = buildExtrudeOffsetVirtualInputPortId('feature-abc')
    expect(taperPortId).toBe('fs:in:feature-abc:extrude:taper')
    expect(offsetPortId).toBe('fs:in:feature-abc:extrude:offset')
    expect(parseFeatureVirtualInputPortId(taperPortId)).toEqual({
      kind: 'extrudeTaper',
      featureId: 'feature-abc',
    })
    expect(parseFeatureVirtualInputPortId(offsetPortId)).toEqual({
      kind: 'extrudeOffset',
      featureId: 'feature-abc',
    })
  })

  it('lists virtual input ports only for extrude features in stack order', () => {
    const ports = listFeatureVirtualInputPorts(
      basePartNode([
        {
          type: 'sketch',
          featureId: 'f-sketch',
          plane: 'XY',
          components: [],
          outputs: {
            profiles: [],
            diagnostics: [],
          },
          uiState: {
            collapsed: false,
          },
        },
        {
          type: 'extrude',
          featureId: 'f-extrude-1',
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
        {
          type: 'extrude',
          featureId: 'f-extrude-2',
          inputs: {
            profileRef: null,
          },
          params: {
            depth: {
              kind: 'lit',
              value: 20,
            },
          },
          outputs: {
            bodyId: 'body-2',
          },
          uiState: {
            collapsed: false,
          },
        },
      ]),
    )

    expect(ports.map((port) => port.portId)).toEqual([
      'fs:in:f-extrude-1:extrude:depth',
      'fs:in:f-extrude-1:extrude:taper',
      'fs:in:f-extrude-1:extrude:offset',
      'fs:in:f-extrude-2:extrude:depth',
      'fs:in:f-extrude-2:extrude:taper',
      'fs:in:f-extrude-2:extrude:offset',
    ])
    expect(ports.every((port) => port.type.kind === 'number')).toBe(true)
    expect(ports.every((port) => port.maxConnectionsIn === 1)).toBe(true)
    expect(ports.find((port) => port.portId.endsWith(':depth'))?.type.unit).toBe('mm')
    expect(ports.find((port) => port.portId.endsWith(':taper'))?.type.unit).toBe('deg')
    expect(ports.find((port) => port.portId.endsWith(':offset'))?.type.unit).toBe('mm')
  })

  it('lists sketch-rectangle width/length ports before extrude ports for cube seed stacks', () => {
    const ports = listFeatureVirtualInputPorts(cubePartNode(cubeFeatureStack()))
    expect(ports.map((port) => port.portId)).toEqual([
      'fs:in:cube-sketch-1:sketchRect:width',
      'fs:in:cube-sketch-1:sketchRect:length',
      'fs:in:cube-extrude-1:extrude:depth',
      'fs:in:cube-extrude-1:extrude:taper',
      'fs:in:cube-extrude-1:extrude:offset',
    ])
    expect(ports.find((port) => port.portId.endsWith(':sketchRect:width'))?.type.unit).toBe(
      'mm',
    )
    expect(ports.find((port) => port.portId.endsWith(':sketchRect:length'))?.type.unit).toBe(
      'mm',
    )
  })

  it('applies depth/taper/offset overrides deterministically from resolved virtual inputs', () => {
    const stack: FeatureStack = [
      {
        type: 'extrude',
        featureId: 'f-extrude',
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
            value: 1,
          },
          offset: {
            kind: 'lit',
            value: 2,
          },
        },
        outputs: {
          bodyId: 'body-1',
        },
        uiState: {
          collapsed: false,
        },
      },
    ]
    const depthPortId = buildExtrudeDepthVirtualInputPortId('f-extrude')
    const taperPortId = buildExtrudeTaperVirtualInputPortId('f-extrude')
    const offsetPortId = buildExtrudeOffsetVirtualInputPortId('f-extrude')
    const first = applyFeatureVirtualInputOverrides(stack, {
      [depthPortId]: 42,
      [taperPortId]: 7,
      [offsetPortId]: 8,
    })
    const second = applyFeatureVirtualInputOverrides(stack, {
      [depthPortId]: 42,
      [taperPortId]: 7,
      [offsetPortId]: 8,
    })

    expect(first).toEqual(second)
    expect(first[0]).toMatchObject({
      type: 'extrude',
      params: {
        depth: {
          kind: 'lit',
          value: 42,
        },
        taper: {
          kind: 'lit',
          value: 7,
        },
        offset: {
          kind: 'lit',
          value: 8,
        },
      },
    })
  })

  it('materializes deterministic 0 literals for taper/offset when missing', () => {
    const stack: FeatureStack = [
      {
        type: 'extrude',
        featureId: 'f-extrude',
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
    ]
    const resolved = applyFeatureVirtualInputOverrides(stack, {})
    expect(resolved[0]).toMatchObject({
      params: {
        taper: { kind: 'lit', value: 0 },
        offset: { kind: 'lit', value: 0 },
      },
    })
  })

  it('keeps seeded cube sketch literals when width/length virtual inputs are absent', () => {
    const resolved = applyFeatureVirtualInputOverrides(cubeFeatureStack(), {})
    expect(resolved[0]).toMatchObject({
      type: 'sketch',
      components: [
        { a: { x: 0, y: 0 }, b: { x: 20, y: 0 } },
        { a: { x: 20, y: 0 }, b: { x: 20, y: 20 } },
        { a: { x: 20, y: 20 }, b: { x: 0, y: 20 } },
        { a: { x: 0, y: 20 }, b: { x: 0, y: 0 } },
      ],
    })
  })

  it('applies deterministic width/length overrides to the cube seed sketch', () => {
    const first = applyFeatureVirtualInputOverrides(cubeFeatureStack(), {
      [buildSketchRectWidthVirtualInputPortId('cube-sketch-1')]: 15,
      [buildSketchRectLengthVirtualInputPortId('cube-sketch-1')]: 30,
    })
    const second = applyFeatureVirtualInputOverrides(cubeFeatureStack(), {
      [buildSketchRectWidthVirtualInputPortId('cube-sketch-1')]: 15,
      [buildSketchRectLengthVirtualInputPortId('cube-sketch-1')]: 30,
    })

    expect(first).toEqual(second)
    expect(first[0]).toMatchObject({
      type: 'sketch',
      components: [
        { a: { x: 0, y: 0 }, b: { x: 30, y: 0 } },
        { a: { x: 30, y: 0 }, b: { x: 30, y: 15 } },
        { a: { x: 30, y: 15 }, b: { x: 0, y: 15 } },
        { a: { x: 0, y: 15 }, b: { x: 0, y: 0 } },
      ],
    })
    expect(first[1]).toMatchObject({
      type: 'extrude',
      params: {
        depth: {
          kind: 'lit',
          value: 20,
        },
      },
    })
  })
})
