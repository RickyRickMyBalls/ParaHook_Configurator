import { describe, expect, it } from 'vitest'
import { getDefaultNodeParams, getNodeDef } from '../registry/nodeRegistry'
import type { SpaghettiNode } from '../schema/spaghettiTypes'
import { buildNodeDriverVm } from './driverVm'

describe('buildNodeDriverVm Baseplate', () => {
  it('moves width/length into drivers and hides legacy input rows when disconnected', () => {
    const node: SpaghettiNode = {
      nodeId: 'node-baseplate-1',
      type: 'Part/Baseplate',
      params: getDefaultNodeParams('Part/Baseplate'),
    }
    const nodeDef = getNodeDef(node.type)
    const vm = buildNodeDriverVm(node, nodeDef, {
      resolvedInputsByPortId: {
        width: 235.6,
        length: 812.25,
      },
    })

    expect(vm).not.toBeNull()
    if (vm === null) {
      return
    }

    expect(vm.drivers.map((row) => `${row.label}|${row.kind}`)).toEqual([
      'Width|nodeParamNumber',
      'Length|nodeParamNumber',
      'Thickness|featureParam',
    ])
    expect(vm.inputs).toEqual([])
  })

  it('shows legacy width/length rows as read-only when legacy wires are connected', () => {
    const node: SpaghettiNode = {
      nodeId: 'node-baseplate-legacy',
      type: 'Part/Baseplate',
      params: getDefaultNodeParams('Part/Baseplate'),
    }
    const nodeDef = getNodeDef(node.type)
    const vm = buildNodeDriverVm(node, nodeDef, {
      resolvedInputsByPortId: {
        width: 235.6,
        length: 812.25,
      },
      connectionCountByPortId: new Map<string, number>([
        ['width', 1],
        ['length', 1],
      ]),
    })

    expect(vm).not.toBeNull()
    if (vm === null) {
      return
    }

    expect(vm.inputs.map((row) => row.endpointPortId)).toEqual(['width', 'length'])
    expect(vm.inputs.map((row) => row.displayValue)).toEqual(['235.6 mm', '812.25 mm'])
    expect(vm.inputs.every((row) => row.inputWiringDisabled === true)).toBe(true)
    expect(vm.inputs.every((row) => row.drivenMessage === 'Legacy wire (read-only)')).toBe(true)
  })
})

describe('buildNodeDriverVm ToeHook', () => {
  it('builds deterministic drivers, inputs, and outputs for ToeHook', () => {
    const node: SpaghettiNode = {
      nodeId: 'node-toehook-1',
      type: 'Part/ToeHook',
      params: getDefaultNodeParams('Part/ToeHook'),
    }
    const nodeDef = getNodeDef(node.type)
    const vm = buildNodeDriverVm(node, nodeDef)

    expect(vm).not.toBeNull()
    if (vm === null) {
      return
    }

    expect(vm.drivers.map((row) => `${row.groupLabel ?? ''}|${row.label}|${row.kind}`)).toEqual([
      'Global|Hook Width|nodeParamNumber',
      'Global|Hook Thickness|nodeParamNumber',
      'Global|Hook Trim|nodeParamNumber',
      'Profile A|Hook End|nodeParamVec2',
      'Profile A|End Control|nodeParamVec2',
      'Profile A|Base Point Control|nodeParamVec2',
      'Profile B|Hook End|nodeParamVec2',
      'Profile B|End Control|nodeParamVec2',
      'Profile B|Base Point Control|nodeParamVec2',
    ])
    expect(vm.inputs.map((row) => row.endpointPortId)).toEqual(['anchorSpline', 'railMath'])
    expect(
      vm.outputs.map((row) =>
        row.kind === 'endpoint' ? row.endpointPortId : `reserved:${row.reservedKind}`,
      ),
    ).toEqual(['toeLoft'])
    expect(vm.otherOutputs).toEqual([])
  })
})

describe('buildNodeDriverVm HeelKick', () => {
  it('builds deterministic drivers, inputs, and outputs for HeelKick', () => {
    const node: SpaghettiNode = {
      nodeId: 'node-heelkick-1',
      type: 'Part/HeelKick',
      params: getDefaultNodeParams('Part/HeelKick'),
    }
    const nodeDef = getNodeDef(node.type)
    const vm = buildNodeDriverVm(node, nodeDef)

    expect(vm).not.toBeNull()
    if (vm === null) {
      return
    }

    expect(vm.drivers.map((row) => `${row.groupLabel ?? ''}|${row.label}|${row.kind}`)).toEqual([
      'Global|Hook Width|nodeParamNumber',
      'Global|Hook Thickness|nodeParamNumber',
      'Global|Hook Trim|nodeParamNumber',
      'Profile A|Hook End|nodeParamVec2',
      'Profile A|End Control|nodeParamVec2',
      'Profile A|Base Point Control|nodeParamVec2',
      'Profile B|Hook End|nodeParamVec2',
      'Profile B|End Control|nodeParamVec2',
      'Profile B|Base Point Control|nodeParamVec2',
    ])
    expect(vm.inputs.map((row) => row.endpointPortId)).toEqual(['anchorSpline', 'railMath'])
    expect(
      vm.outputs.map((row) =>
        row.kind === 'endpoint' ? row.endpointPortId : `reserved:${row.reservedKind}`,
      ),
    ).toEqual(['hookLoft'])
    expect(vm.otherOutputs).toEqual([])
  })

  it('uses profile defaults that differ from ToeHook', () => {
    const toe = getDefaultNodeParams('Part/ToeHook')
    const heel = getDefaultNodeParams('Part/HeelKick')
    expect(heel.profileA_end).not.toEqual(toe.profileA_end)
    expect(heel.profileB_end).not.toEqual(toe.profileB_end)
  })
})
