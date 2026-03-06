import { describe, expect, it } from 'vitest'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import { listEffectiveInputPorts } from '../features/effectivePorts'
import { getNodeDef } from '../registry/nodeRegistry'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { selectDriverVm } from './selectDriverVm'

const buildGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-src',
      type: 'Part/Baseplate',
      params: {},
    },
    {
      nodeId: 'node-toe',
      type: 'Part/ToeHook',
      params: {
        driverOffsetByParamId: { hookWidth: 3 },
        driverDrivenByParamId: { hookWidth: true },
      },
    },
  ],
  edges: [
    {
      edgeId: 'edge-in',
      from: { nodeId: 'node-src', portId: 'out:drv:widthMm' },
      to: { nodeId: 'node-toe', portId: 'in:drv:hookWidth' },
    },
  ],
})

describe('selectDriverVm', () => {
  it('computes driven/effective values for driven numeric driver offset mode', () => {
    const graph = buildGraph()
    const node = graph.nodes.find((item) => item.nodeId === 'node-toe')!
    const nodeDef = getNodeDef(node.type)
    const incoming = graph.edges.filter((edge) => edge.to.nodeId === node.nodeId)
    const evaluation = evaluateSpaghettiGraph(graph)
    const effectiveInputPorts = listEffectiveInputPorts(node, nodeDef)

    const selected = selectDriverVm({
      node,
      incoming,
      effectiveInputPorts,
      resolvedInputsByPortId: evaluation.inputsByNodeId[node.nodeId],
      connectionCountByPortId: new Map([['in:drv:hookWidth', 1]]),
    })

    expect(selected.driverDrivenStateByRowId['drv:hookWidth']?.driven).toBe(true)
    expect(selected.offsetValueByParamId.hookWidth).toBe(3)
    expect(typeof selected.drivenValueByParamId.hookWidth).toBe('number')
    expect(selected.effectiveValueByParamId.hookWidth).toBe(
      selected.drivenValueByParamId.hookWidth + 3,
    )
    expect(selected.driverRows.find((row) => row.rowId === 'drv:hookWidth')?.paramId).toBe('hookWidth')
  })

  it('does not apply offset when base driven value is unresolved', () => {
    const graph = buildGraph()
    graph.edges[0] = {
      edgeId: 'edge-in',
      from: { nodeId: 'node-src', portId: 'missing' },
      to: { nodeId: 'node-toe', portId: 'in:drv:hookWidth' },
    }
    const node = graph.nodes.find((item) => item.nodeId === 'node-toe')!
    const nodeDef = getNodeDef(node.type)
    const incoming = graph.edges.filter((edge) => edge.to.nodeId === node.nodeId)
    const evaluation = evaluateSpaghettiGraph(graph)

    const selected = selectDriverVm({
      node,
      incoming,
      effectiveInputPorts: listEffectiveInputPorts(node, nodeDef),
      resolvedInputsByPortId: evaluation.inputsByNodeId[node.nodeId],
      connectionCountByPortId: new Map([['in:drv:hookWidth', 1]]),
    })

    expect(selected.driverDrivenStateByRowId['drv:hookWidth']?.unresolved).toBe(true)
    expect(selected.effectiveValueByParamId.hookWidth).toBeUndefined()
  })

  it('returns same reference for repeated calls with same references', () => {
    const graph = buildGraph()
    const node = graph.nodes.find((item) => item.nodeId === 'node-toe')!
    const nodeDef = getNodeDef(node.type)
    const incoming = graph.edges.filter((edge) => edge.to.nodeId === node.nodeId)
    const evaluation = evaluateSpaghettiGraph(graph)
    const effectiveInputPorts = listEffectiveInputPorts(node, nodeDef)
    const connectionCountByPortId = new Map([['in:drv:hookWidth', 1]])

    const first = selectDriverVm({
      node,
      incoming,
      effectiveInputPorts,
      resolvedInputsByPortId: evaluation.inputsByNodeId[node.nodeId],
      connectionCountByPortId,
    })
    const second = selectDriverVm({
      node,
      incoming,
      effectiveInputPorts,
      resolvedInputsByPortId: evaluation.inputsByNodeId[node.nodeId],
      connectionCountByPortId,
    })
    expect(second).toBe(first)
  })

  it('matches stable DriverRowVm contract snapshot', () => {
    const graph = buildGraph()
    const node = graph.nodes.find((item) => item.nodeId === 'node-toe')!
    const nodeDef = getNodeDef(node.type)
    const incoming = graph.edges.filter((edge) => edge.to.nodeId === node.nodeId)
    const evaluation = evaluateSpaghettiGraph(graph)
    const selected = selectDriverVm({
      node,
      incoming,
      effectiveInputPorts: listEffectiveInputPorts(node, nodeDef),
      resolvedInputsByPortId: evaluation.inputsByNodeId[node.nodeId],
      connectionCountByPortId: new Map([['in:drv:hookWidth', 1]]),
    })

    expect(selected.driverRows).toMatchSnapshot()
  })
})
