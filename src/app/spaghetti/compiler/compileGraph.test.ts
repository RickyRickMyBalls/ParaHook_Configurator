import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { compileSpaghettiGraph } from './compileGraph'

describe('compileSpaghettiGraph determinism', () => {
  it('returns stable output for identical graph input', () => {
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

    const first = compileSpaghettiGraph(graph)
    const second = compileSpaghettiGraph(graph)

    expect(first.ok).toBe(true)
    expect(second).toEqual(first)
  })

  it('keeps ToeHook payload key anchorSpline2 while resolving canonical anchorSpline input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-toehook',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-baseplate-to-toehook',
          from: {
            nodeId: 'n-baseplate',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'n-toehook',
            portId: 'anchorSpline',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.buildInputs).toBeDefined()

    const toeHookResolved = result.buildInputs?.resolvedParts['toeHook#1'] ?? {}
    expect(Object.prototype.hasOwnProperty.call(toeHookResolved, 'anchorSpline2')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(toeHookResolved, 'anchorSpline')).toBe(false)
  })

  it('keeps HeelKick payload key anchorSpline2 while resolving canonical anchorSpline input', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-heelkick',
          type: 'Part/HeelKick',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-baseplate-to-heelkick',
          from: {
            nodeId: 'n-baseplate',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'n-heelkick',
            portId: 'anchorSpline',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.buildInputs).toBeDefined()

    const heelKickResolved = result.buildInputs?.resolvedParts['heelKick#1'] ?? {}
    expect(Object.prototype.hasOwnProperty.call(heelKickResolved, 'anchorSpline2')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(heelKickResolved, 'anchorSpline')).toBe(false)
  })

  it('keeps HeelKick legacy anchorSpline2 edge input working via fallback resolution', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-heelkick',
          type: 'Part/HeelKick',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-baseplate-to-heelkick-legacy',
          from: {
            nodeId: 'n-baseplate',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'n-heelkick',
            portId: 'anchorSpline2',
          },
        },
      ],
    }

    const result = compileSpaghettiGraph(graph)
    expect(result.ok).toBe(true)
    expect(result.buildInputs).toBeDefined()

    const heelKickResolved = result.buildInputs?.resolvedParts['heelKick#1'] ?? {}
    expect(Object.prototype.hasOwnProperty.call(heelKickResolved, 'anchorSpline2')).toBe(true)
    expect(heelKickResolved.anchorSpline2).not.toBeUndefined()
  })
})
