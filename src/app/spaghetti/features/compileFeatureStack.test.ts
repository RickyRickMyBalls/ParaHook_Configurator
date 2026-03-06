import { describe, expect, it } from 'vitest'
import { compileFeatureStack } from './compileFeatureStack'
import type { FeatureStack } from './featureTypes'

const signedArea = (vertices: Array<{ x: number; y: number }>): number => {
  let sum = 0
  for (let index = 0; index < vertices.length; index += 1) {
    const current = vertices[index]
    const next = vertices[(index + 1) % vertices.length]
    sum += current.x * next.y - next.x * current.y
  }
  return sum * 0.5
}

const rectangleStack = (): FeatureStack => [
  {
    type: 'sketch',
    featureId: 'sketch-1',
    plane: 'XY',
    components: [
      {
        rowId: 'r1',
        componentId: 'e1',
        type: 'line',
        a: { kind: 'lit', x: 0, y: 0 },
        b: { kind: 'lit', x: 10, y: 0 },
      },
      {
        rowId: 'r2',
        componentId: 'e2',
        type: 'line',
        a: { kind: 'lit', x: 10, y: 0 },
        b: { kind: 'lit', x: 10, y: 10 },
      },
      {
        rowId: 'r3',
        componentId: 'e3',
        type: 'line',
        a: { kind: 'lit', x: 10, y: 10 },
        b: { kind: 'lit', x: 0, y: 10 },
      },
      {
        rowId: 'r4',
        componentId: 'e4',
        type: 'line',
        a: { kind: 'lit', x: 0, y: 10 },
        b: { kind: 'lit', x: 0, y: 0 },
      },
    ],
    outputs: {
      profiles: [
        {
          profileId: 'prof_rect',
          profileIndex: 0,
          area: 100,
          loop: {
            segments: [],
            winding: 'CCW',
          },
          verticesProxy: [],
        },
      ],
      diagnostics: [],
    },
    uiState: {
      collapsed: false,
    },
  },
  {
    type: 'extrude',
    featureId: 'extrude-1',
    inputs: {
      profileRef: {
        sourceFeatureId: 'sketch-1',
        profileId: 'prof_rect',
      },
    },
    params: {
      depth: { kind: 'lit', value: 7 },
    },
    outputs: {
      bodyId: 'body-1',
    },
    uiState: {
      collapsed: false,
    },
  },
]

describe('compileFeatureStack', () => {
  it('emits Option-B profilesResolved with deterministic CCW vertices', () => {
    const ir = compileFeatureStack(rectangleStack())
    expect(ir[0].op).toBe('sketch')
    if (ir[0].op !== 'sketch') {
      return
    }

    expect(ir[0].profilesResolved).toHaveLength(1)
    expect(ir[0].profilesResolved[0].profileId).toBe('prof_rect')
    expect(ir[0].profilesResolved[0].loop.segments.length).toBeGreaterThan(0)
    expect(ir[0].profilesResolved[0].verticesProxy.length).toBeGreaterThan(2)
    expect(signedArea(ir[0].profilesResolved[0].verticesProxy)).toBeGreaterThan(0)
  })

  it('maps extrude profileRef to sketchFeatureId and keeps bodyId', () => {
    const ir = compileFeatureStack(rectangleStack())
    expect(ir[1].op).toBe('extrude')
    if (ir[1].op !== 'extrude') {
      return
    }

    expect(ir[1].profileRef).toEqual({
      sketchFeatureId: 'sketch-1',
      profileId: 'prof_rect',
      profileIndex: 0,
    })
    expect(ir[1].bodyId).toBe('body-1')
    expect(ir[1].depthResolved).toBe(7)
    expect(ir[1].taperResolved).toBe(0)
    expect(ir[1].offsetResolved).toBe(0)
  })

  it('returns empty profiles when chain is not closed', () => {
    const stack = rectangleStack()
    const sketch = stack[0] as Extract<FeatureStack[number], { type: 'sketch' }>
    const target = sketch.components[3]
    if (target.type === 'line') {
      sketch.components[3] = {
        ...target,
        b: { kind: 'lit', x: 9, y: 10 },
      }
    }

    const ir = compileFeatureStack(stack)
    expect(ir[0].op).toBe('sketch')
    if (ir[0].op !== 'sketch') {
      return
    }
    expect(ir[0].profilesResolved).toEqual([])
  })

  it('emits resolved taper/offset when provided on extrude params', () => {
    const stack = rectangleStack()
    const extrude = stack[1] as Extract<FeatureStack[number], { type: 'extrude' }>
    extrude.params.taper = { kind: 'lit', value: 4 }
    extrude.params.offset = { kind: 'lit', value: 2 }

    const ir = compileFeatureStack(stack)
    expect(ir[1].op).toBe('extrude')
    if (ir[1].op !== 'extrude') {
      return
    }

    expect(ir[1].taperResolved).toBe(4)
    expect(ir[1].offsetResolved).toBe(2)
  })

  it('excludes disabled features while preserving deterministic enabled-feature order', () => {
    const stack = rectangleStack()
    stack[0] = {
      ...stack[0],
      enabled: false,
    }

    const ir = compileFeatureStack(stack)
    expect(ir).toEqual([
      {
        op: 'extrude',
        featureId: 'extrude-1',
        profileRef: null,
        depthResolved: 7,
        taperResolved: 0,
        offsetResolved: 0,
        bodyId: 'body-1',
      },
    ])
  })
})
