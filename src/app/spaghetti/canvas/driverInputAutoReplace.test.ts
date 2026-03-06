import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { validateGraph } from '../compiler/validateGraph'
import {
  buildTargetEndpointKey,
  planEdgeInsertWithDriverInputAutoReplace,
} from './driverInputAutoReplace'

describe('driverInputAutoReplace endpoint key', () => {
  it('treats driver virtual input endpoint keys as whole-port only', () => {
    const whole = buildTargetEndpointKey({
      nodeId: 'n-target',
      portId: 'in:drv:widthMm',
    })
    const withPath = buildTargetEndpointKey({
      nodeId: 'n-target',
      portId: 'drv:in:widthMm',
      path: ['x'],
    })

    expect(whole).toBe('n-target::in:drv:widthMm::')
    expect(withPath).toBe(whole)
  })
})

describe('planEdgeInsertWithDriverInputAutoReplace', () => {
  it('replaces a single existing incoming edge on driver input', () => {
    const plan = planEdgeInsertWithDriverInputAutoReplace({
      edgeId: 'e-new',
      from: { nodeId: 'n-source-next', portId: 'out' },
      to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
      edges: [
        {
          edgeId: 'e-old',
          from: { nodeId: 'n-source-old', portId: 'out' },
          to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
        },
      ],
    })

    expect(plan.kind).toBe('insert')
    if (plan.kind !== 'insert') {
      return
    }
    expect(plan.removedEdgeIds).toEqual(['e-old'])
    expect(plan.nextEdges).toEqual([
      {
        edgeId: 'e-new',
        from: { nodeId: 'n-source-next', portId: 'out' },
        to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
      },
    ])
  })

  it('self-heals legacy multiple incoming driver edges and appends one new edge', () => {
    const plan = planEdgeInsertWithDriverInputAutoReplace({
      edgeId: 'e-new',
      from: { nodeId: 'n-source-next', portId: 'out' },
      to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
      edges: [
        {
          edgeId: 'e-other',
          from: { nodeId: 'n-a', portId: 'out' },
          to: { nodeId: 'n-other', portId: 'width' },
        },
        {
          edgeId: 'e-old-1',
          from: { nodeId: 'n-source-old-1', portId: 'out' },
          to: { nodeId: 'n-target', portId: 'drv:in:widthMm', path: ['x'] },
        },
        {
          edgeId: 'e-old-2',
          from: { nodeId: 'n-source-old-2', portId: 'out' },
          to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
        },
      ],
    })

    expect(plan.kind).toBe('insert')
    if (plan.kind !== 'insert') {
      return
    }
    expect(plan.removedEdgeIds.slice().sort((a, b) => a.localeCompare(b))).toEqual([
      'e-old-1',
      'e-old-2',
    ])
    expect(plan.nextEdges).toEqual([
      {
        edgeId: 'e-other',
        from: { nodeId: 'n-a', portId: 'out' },
        to: { nodeId: 'n-other', portId: 'width' },
      },
      {
        edgeId: 'e-new',
        from: { nodeId: 'n-source-next', portId: 'out' },
        to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
      },
    ])
  })

  it('treats legacy and canonical driver-input aliases as one replace target', () => {
    const plan = planEdgeInsertWithDriverInputAutoReplace({
      edgeId: 'e-new',
      from: { nodeId: 'n-source-next', portId: 'out' },
      to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
      edges: [
        {
          edgeId: 'e-old-legacy',
          from: { nodeId: 'n-source-old', portId: 'out' },
          to: { nodeId: 'n-target', portId: 'drv:in:widthMm' },
        },
      ],
    })

    expect(plan.kind).toBe('insert')
    if (plan.kind !== 'insert') {
      return
    }
    expect(plan.removedEdgeIds).toEqual(['e-old-legacy'])
  })

  it('returns no-op for exact duplicate drop on a clean occupied driver endpoint', () => {
    const plan = planEdgeInsertWithDriverInputAutoReplace({
      edgeId: 'e-new-ignored',
      from: { nodeId: 'n-source', portId: 'out' },
      to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
      edges: [
        {
          edgeId: 'e-existing',
          from: { nodeId: 'n-source', portId: 'out' },
          to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
        },
      ],
    })

    expect(plan).toEqual({
      kind: 'noop',
      preservedEdgeId: 'e-existing',
      nextEdges: [
        {
          edgeId: 'e-existing',
          from: { nodeId: 'n-source', portId: 'out' },
          to: { nodeId: 'n-target', portId: 'in:drv:widthMm' },
        },
      ],
      removedEdgeIds: [],
    })
  })

  it('replacement candidate remains subject to cycle validation at commit time', () => {
    const base: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'n-baseplate',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'n-id',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'e-forward',
          from: { nodeId: 'n-baseplate', portId: 'out:drv:widthMm' },
          to: { nodeId: 'n-id', portId: 'in' },
        },
      ],
    }

    const plan = planEdgeInsertWithDriverInputAutoReplace({
      edgeId: 'e-backward',
      from: { nodeId: 'n-id', portId: 'out' },
      to: { nodeId: 'n-baseplate', portId: 'in:drv:widthMm' },
      edges: base.edges,
    })

    expect(plan.kind).toBe('insert')
    if (plan.kind !== 'insert') {
      return
    }

    const candidate: SpaghettiGraph = {
      ...base,
      edges: plan.nextEdges,
    }
    const validation = validateGraph(candidate)
    expect(validation.ok).toBe(false)
    expect(validation.errors.some((error) => error.code === 'GRAPH_CYCLE_DETECTED')).toBe(
      true,
    )
  })
})
