import { describe, expect, it } from 'vitest'
import type { Segment2 } from '../features/featureTypes'
import { EPSILON, tessellateProfileLoop, signedAreaOpenLoop } from './runtimeTessellation'

describe('tessellateProfileLoop', () => {
  it('suppresses join duplicates using canonicalize-then-epsilon append ordering', () => {
    const segments: Segment2[] = [
      {
        kind: 'line2',
        a: { x: 0, y: 0 },
        b: { x: 1, y: 0 },
      },
      {
        kind: 'line2',
        a: { x: 1, y: 0 },
        b: { x: 1 + EPSILON * 0.4, y: 0 },
      },
      {
        kind: 'line2',
        a: { x: 1 + EPSILON * 0.4, y: 0 },
        b: { x: 1, y: 1 },
      },
    ]

    const vertices = tessellateProfileLoop(segments)
    expect(vertices).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ])
  })

  it('snaps near-closure to exact start once without double-close', () => {
    const segments: Segment2[] = [
      {
        kind: 'line2',
        a: { x: 0, y: 0 },
        b: { x: 2, y: 0 },
      },
      {
        kind: 'line2',
        a: { x: 2, y: 0 },
        b: { x: 2, y: 2 },
      },
      {
        kind: 'line2',
        a: { x: 2, y: 2 },
        b: { x: 0, y: 2 },
      },
      {
        kind: 'line2',
        a: { x: 0, y: 2 },
        b: { x: 0, y: EPSILON * 0.4 },
      },
    ]

    const vertices = tessellateProfileLoop(segments)
    expect(vertices[0]).toEqual({ x: 0, y: 0 })
    expect(vertices[vertices.length - 1]).toEqual(vertices[0])
    expect(vertices[vertices.length - 2]).not.toEqual(vertices[0])
  })

  it('enforces CCW using open-loop area with implicit closing edge', () => {
    const segments: Segment2[] = [
      {
        kind: 'line2',
        a: { x: 0, y: 0 },
        b: { x: 0, y: 2 },
      },
      {
        kind: 'line2',
        a: { x: 0, y: 2 },
        b: { x: 2, y: 2 },
      },
      {
        kind: 'line2',
        a: { x: 2, y: 2 },
        b: { x: 2, y: 0 },
      },
      {
        kind: 'line2',
        a: { x: 2, y: 0 },
        b: { x: 0, y: 0 },
      },
    ]

    const vertices = tessellateProfileLoop(segments)
    expect(signedAreaOpenLoop(vertices)).toBeGreaterThanOrEqual(0)
  })

  it('is byte-deterministic for curved input across runs', () => {
    const segments: Segment2[] = [
      {
        kind: 'bezier2',
        p0: { x: 0, y: 0 },
        p1: { x: 3, y: 0 },
        p2: { x: 3, y: 2 },
        p3: { x: 0, y: 2 },
      },
      {
        kind: 'line2',
        a: { x: 0, y: 2 },
        b: { x: 0, y: 0 },
      },
    ]

    const first = tessellateProfileLoop(segments)
    const second = tessellateProfileLoop(segments)

    expect(JSON.stringify(first)).toBe(JSON.stringify(second))
  })
})
