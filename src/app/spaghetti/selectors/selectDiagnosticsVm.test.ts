import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import type { SpaghettiDiagnostic } from '../compiler/validateGraph'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { selectDiagnosticsVm } from './selectDiagnosticsVm'

const d = (value: SpaghettiDiagnostic): SpaghettiDiagnostic => value

const graph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: {
        slots: [{ slotId: 's001' }, { slotId: 's002' }, { slotId: 's003' }],
        nextSlotIndex: 4,
      },
    },
    { nodeId: 'node-a', type: 'Part/ToeHook', params: {} },
    { nodeId: 'node-b', type: 'Part/HeelKick', params: {} },
    { nodeId: 'node-c', type: 'Part/Baseplate', params: {} },
    { nodeId: 'node-d', type: 'Utility/IdentityNumberMm', params: {} },
    { nodeId: 'node-cycle-a', type: 'Utility/IdentityNumberMm', params: {} },
    { nodeId: 'node-cycle-b', type: 'Utility/IdentityNumberMm', params: {} },
  ],
  edges: [
    {
      edgeId: 'edge-ok',
      from: { nodeId: 'node-a', portId: 'toeLoft' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
    {
      edgeId: 'edge-unresolved',
      from: { nodeId: 'node-b', portId: 'hookLoft' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s002' },
    },
    {
      edgeId: 'edge-type',
      from: { nodeId: 'node-c', portId: 'anchorSpline2' },
      to: { nodeId: 'node-d', portId: 'in' },
    },
    {
      edgeId: 'edge-missing',
      from: { nodeId: 'node-c', portId: 'anchorSpline2' },
      to: { nodeId: 'node-d', portId: 'missing' },
    },
    {
      edgeId: 'edge-cycle-1',
      from: { nodeId: 'node-cycle-a', portId: 'out' },
      to: { nodeId: 'node-cycle-b', portId: 'in' },
    },
    {
      edgeId: 'edge-cycle-2',
      from: { nodeId: 'node-cycle-b', portId: 'out' },
      to: { nodeId: 'node-cycle-a', portId: 'in' },
    },
  ],
}

describe('selectDiagnosticsVm', () => {
  it('classifies edgeStatusById and slotStatus deterministically', () => {
    const vm = selectDiagnosticsVm({
      graph,
      validation: {
        ok: false,
        errors: [
          d({
            level: 'error',
            code: 'EDGE_TYPE_MISMATCH',
            message: 'type mismatch',
            edgeId: 'edge-type',
          }),
          d({
            level: 'error',
            code: 'EDGE_TO_PORT_MISSING',
            message: 'target port missing',
            edgeId: 'edge-missing',
          }),
          d({
            level: 'error',
            code: 'GRAPH_CYCLE_DETECTED',
            message: 'Cycle detected involving nodes: node-cycle-a, node-cycle-b.',
          }),
        ],
        warnings: [],
      },
      evaluation: {
        ok: false,
        inputsByNodeId: {},
        outputsByNodeId: {},
        topoOrder: [],
        diagnostics: {
          errors: [
            d({
              level: 'error',
              code: 'INPUT_SOURCE_VALUE_MISSING',
              message: 'missing source value',
              edgeId: 'edge-unresolved',
            }),
          ],
          warnings: [],
        },
      },
    })

    expect(vm.edgeStatusById['edge-ok']?.kind).toBe('ok')
    expect(vm.edgeStatusById['edge-unresolved']?.kind).toBe('unresolved')
    expect(vm.edgeStatusById['edge-type']?.kind).toBe('typeMismatch')
    expect(vm.edgeStatusById['edge-missing']?.kind).toBe('missingPort')
    expect(vm.edgeStatusById['edge-cycle-1']?.kind).toBe('cycle')
    expect(vm.edgeStatusById['edge-cycle-2']?.kind).toBe('cycle')

    expect(vm.slotStatus).toEqual({
      s001: 'ok',
      s002: 'unresolved',
      s003: 'empty',
    })
    expect(vm.items.every((item) => item.id.length > 0)).toBe(true)

    expect(Object.keys(vm.edgeStatusById)).toEqual([
      'edge-cycle-1',
      'edge-cycle-2',
      'edge-missing',
      'edge-ok',
      'edge-type',
      'edge-unresolved',
    ])
  })

  it('applies precedence and is idempotent across repeated calls', () => {
    const precedenceGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        { nodeId: 'n1', type: 'Utility/IdentityNumberMm', params: {} },
        { nodeId: 'n2', type: 'Utility/IdentityNumberMm', params: {} },
      ],
      edges: [
        {
          edgeId: 'edge-precedence',
          from: { nodeId: 'n1', portId: 'out' },
          to: { nodeId: 'n2', portId: 'in' },
        },
      ],
    }

    const params = {
      graph: precedenceGraph,
      validation: {
        ok: false,
        errors: [
          d({
            level: 'error',
            code: 'EDGE_TO_PORT_MISSING',
            message: 'missing target',
            edgeId: 'edge-precedence',
          }),
          d({
            level: 'error',
            code: 'GRAPH_CYCLE_DETECTED',
            message: 'Cycle detected involving nodes: n1, n2.',
          }),
        ],
        warnings: [],
      },
      evaluation: {
        ok: false,
        inputsByNodeId: {},
        outputsByNodeId: {},
        topoOrder: [],
        diagnostics: {
          errors: [
            d({
              level: 'error',
              code: 'INPUT_SOURCE_VALUE_MISSING',
              message: 'missing source',
              edgeId: 'edge-precedence',
            }),
          ],
          warnings: [],
        },
      },
    }

    const first = selectDiagnosticsVm(params)
    const second = selectDiagnosticsVm(params)

    expect(first.edgeStatusById['edge-precedence']?.kind).toBe('missingPort')
    expect(first.edgeStatusById['edge-precedence']?.reasons).toEqual([
      'missingPort',
      'cycle',
      'unresolved',
    ])
    expect(first).toEqual(second)
    expect(second).toBe(first)
  })

  it('matches stable DiagnosticsVm contract snapshot', () => {
    const vm = selectDiagnosticsVm({
      graph,
      validation: {
        ok: false,
        errors: [
          d({
            level: 'error',
            code: 'EDGE_TYPE_MISMATCH',
            message: 'type mismatch',
            edgeId: 'edge-type',
          }),
        ],
        warnings: [],
      },
      evaluation: {
        ok: false,
        inputsByNodeId: {},
        outputsByNodeId: {},
        topoOrder: [],
        diagnostics: {
          errors: [],
          warnings: [],
        },
      },
    })
    expect({
      items: vm.items,
      edgeStatusById: vm.edgeStatusById,
      slotStatus: vm.slotStatus,
    }).toMatchSnapshot()
  })
})
