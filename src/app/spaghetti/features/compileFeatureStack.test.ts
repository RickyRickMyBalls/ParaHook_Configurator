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
    entities: [
      {
        entityId: 'e3',
        type: 'line',
        start: { kind: 'lit', x: 10, y: 10 },
        end: { kind: 'lit', x: 0, y: 10 },
      },
      {
        entityId: 'e1',
        type: 'line',
        start: { kind: 'lit', x: 0, y: 0 },
        end: { kind: 'lit', x: 10, y: 0 },
      },
      {
        entityId: 'e4',
        type: 'line',
        start: { kind: 'lit', x: 0, y: 10 },
        end: { kind: 'lit', x: 0, y: 0 },
      },
      {
        entityId: 'e2',
        type: 'line',
        start: { kind: 'lit', x: 10, y: 0 },
        end: { kind: 'lit', x: 10, y: 10 },
      },
    ],
    outputs: {
      profiles: [
        {
          profileId: 'prof_rect',
          entityIds: ['e1', 'e2', 'e3', 'e4'],
          area: 100,
        },
      ],
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
    expect(ir[0].profilesResolved[0].vertices).toHaveLength(4)
    expect(signedArea(ir[0].profilesResolved[0].vertices)).toBeGreaterThan(0)
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
    })
    expect(ir[1].bodyId).toBe('body-1')
  })

  it('returns empty vertices when profile entity chain cannot be resolved', () => {
    const stack = rectangleStack()
    const sketch = stack[0] as Extract<FeatureStack[number], { type: 'sketch' }>
    sketch.outputs.profiles[0].entityIds = ['e1', 'missing', 'e3', 'e4']

    const ir = compileFeatureStack(stack)
    expect(ir[0].op).toBe('sketch')
    if (ir[0].op !== 'sketch') {
      return
    }
    expect(ir[0].profilesResolved[0].vertices).toEqual([])
  })
})
