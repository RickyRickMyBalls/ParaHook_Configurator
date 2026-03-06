import { describe, expect, it } from 'vitest'
import { getNodeDef } from '../registry/nodeRegistry'
import type { SpaghettiNode } from '../schema/spaghettiTypes'
import {
  buildLegacyDriverVirtualInputPortId,
  buildLegacyDriverVirtualOutputPortId,
  buildDriverVirtualInputPortId,
  buildDriverVirtualOutputPortId,
  getDriverVirtualOutputValue,
  isDriverVirtualInputPortId,
  isDriverVirtualOutputPortId,
  listDriverVirtualInputPorts,
  listDriverVirtualOutputPorts,
  parseDriverVirtualInputPortId,
  parseDriverVirtualOutputPortId,
  toCanonicalDriverVirtualInputPortId,
  toCanonicalDriverVirtualOutputPortId,
} from './driverVirtualPorts'

describe('driverVirtualPorts', () => {
  it('builds canonical output ids and parses both canonical + legacy formats', () => {
    const portId = buildDriverVirtualOutputPortId('widthMm')
    const legacyPortId = buildLegacyDriverVirtualOutputPortId('widthMm')
    expect(portId).toBe('out:drv:widthMm')
    expect(legacyPortId).toBe('drv:widthMm')
    expect(isDriverVirtualOutputPortId(portId)).toBe(true)
    expect(isDriverVirtualOutputPortId(legacyPortId)).toBe(true)
    expect(parseDriverVirtualOutputPortId(portId)).toEqual({ paramId: 'widthMm' })
    expect(parseDriverVirtualOutputPortId(legacyPortId)).toEqual({ paramId: 'widthMm' })
    expect(toCanonicalDriverVirtualOutputPortId(portId)).toBe(portId)
    expect(toCanonicalDriverVirtualOutputPortId(legacyPortId)).toBe(portId)
    expect(parseDriverVirtualOutputPortId('drv:')).toBeNull()
    expect(parseDriverVirtualOutputPortId('drv:feature:firstExtrudeDepth')).toBeNull()
    expect(parseDriverVirtualOutputPortId('out:drv:feature:firstExtrudeDepth')).toBeNull()
    expect(parseDriverVirtualOutputPortId('drv:width-mm')).toBeNull()
    expect(parseDriverVirtualOutputPortId('out:drv:width-mm')).toBeNull()
    expect(parseDriverVirtualOutputPortId('drv:width mm')).toBeNull()
    expect(parseDriverVirtualOutputPortId('out:drv:width mm')).toBeNull()
    expect(isDriverVirtualOutputPortId('drv:width-mm')).toBe(false)
    expect(isDriverVirtualOutputPortId('out:drv:width-mm')).toBe(false)
  })

  it('builds canonical input ids and parses both canonical + legacy formats', () => {
    const portId = buildDriverVirtualInputPortId('widthMm')
    const legacyPortId = buildLegacyDriverVirtualInputPortId('widthMm')
    expect(portId).toBe('in:drv:widthMm')
    expect(legacyPortId).toBe('drv:in:widthMm')
    expect(isDriverVirtualInputPortId(portId)).toBe(true)
    expect(isDriverVirtualInputPortId(legacyPortId)).toBe(true)
    expect(parseDriverVirtualInputPortId(portId)).toEqual({ paramId: 'widthMm' })
    expect(parseDriverVirtualInputPortId(legacyPortId)).toEqual({ paramId: 'widthMm' })
    expect(toCanonicalDriverVirtualInputPortId(portId)).toBe(portId)
    expect(toCanonicalDriverVirtualInputPortId(legacyPortId)).toBe(portId)
    expect(toCanonicalDriverVirtualInputPortId('in:widthMm')).toBeNull()
    expect(parseDriverVirtualInputPortId('drv:in:')).toBeNull()
    expect(parseDriverVirtualInputPortId('in:drv:')).toBeNull()
    expect(parseDriverVirtualInputPortId('drv:in:width-mm')).toBeNull()
    expect(parseDriverVirtualInputPortId('in:drv:width-mm')).toBeNull()
    expect(parseDriverVirtualInputPortId('drv:in:width:mm')).toBeNull()
    expect(parseDriverVirtualInputPortId('in:drv:width:mm')).toBeNull()
    expect(isDriverVirtualInputPortId('drv:in:width-mm')).toBe(false)
    expect(isDriverVirtualInputPortId('in:drv:width-mm')).toBe(false)
    expect(parseDriverVirtualOutputPortId('drv:in:widthMm')).toBeNull()
    expect(parseDriverVirtualOutputPortId('in:drv:widthMm')).toBeNull()
  })

  it('lists canonical then legacy nodeParam virtual ports in nodeDef order', () => {
    const node: SpaghettiNode = {
      nodeId: 'n-baseplate',
      type: 'Part/Baseplate',
      params: {},
    }
    const ports = listDriverVirtualOutputPorts(node)
    expect(ports.map((port) => port.portId)).toEqual([
      'out:drv:widthMm',
      'drv:widthMm',
      'out:drv:lengthMm',
      'drv:lengthMm',
    ])
    expect(ports.every((port) => port.type.kind === 'number')).toBe(true)
    expect(ports.every((port) => port.type.unit === 'mm')).toBe(true)
    expect(ports.some((port) => port.portId === 'drv:feature:firstExtrudeDepth')).toBe(false)
    expect(ports.some((port) => port.portId === 'out:drv:feature:firstExtrudeDepth')).toBe(
      false,
    )

    const inputPorts = listDriverVirtualInputPorts(node)
    expect(inputPorts.map((port) => port.portId)).toEqual([
      'in:drv:widthMm',
      'drv:in:widthMm',
      'in:drv:lengthMm',
      'drv:in:lengthMm',
    ])
    expect(inputPorts.every((port) => port.maxConnectionsIn === 1)).toBe(true)
    expect(inputPorts.every((port) => port.optional === true)).toBe(true)
    expect(inputPorts.some((port) => port.portId === 'drv:in:feature:firstExtrudeDepth')).toBe(
      false,
    )
    expect(inputPorts.some((port) => port.portId === 'in:drv:feature:firstExtrudeDepth')).toBe(
      false,
    )
  })

  it('resolves values from node.params first, then driver fallback when available', () => {
    const baseplateDef = getNodeDef('Part/Baseplate')
    expect(baseplateDef).toBeDefined()

    const explicitNode: SpaghettiNode = {
      nodeId: 'n-baseplate-explicit',
      type: 'Part/Baseplate',
      params: {
        widthMm: 77,
      },
    }
    expect(getDriverVirtualOutputValue(explicitNode, baseplateDef!, 'out:drv:widthMm')).toBe(77)
    expect(getDriverVirtualOutputValue(explicitNode, baseplateDef!, 'drv:widthMm')).toBe(77)

    const fallbackNode: SpaghettiNode = {
      nodeId: 'n-baseplate-fallback',
      type: 'Part/Baseplate',
      params: {},
    }
    expect(getDriverVirtualOutputValue(fallbackNode, baseplateDef!, 'out:drv:lengthMm')).toBe(200)
    expect(getDriverVirtualOutputValue(fallbackNode, baseplateDef!, 'drv:lengthMm')).toBe(200)
  })

  it('applies offset only for driven numeric nodeParam driver outputs', () => {
    const baseplateDef = getNodeDef('Part/Baseplate')
    expect(baseplateDef).toBeDefined()

    const notDrivenNode: SpaghettiNode = {
      nodeId: 'n-baseplate-not-driven',
      type: 'Part/Baseplate',
      params: {
        widthMm: 40,
        driverOffsetByParamId: {
          widthMm: 5,
        },
      },
    }
    expect(getDriverVirtualOutputValue(notDrivenNode, baseplateDef!, 'out:drv:widthMm')).toBe(40)

    const drivenNode: SpaghettiNode = {
      nodeId: 'n-baseplate-driven',
      type: 'Part/Baseplate',
      params: {
        widthMm: 40,
        driverOffsetByParamId: {
          widthMm: 5,
        },
        driverDrivenByParamId: {
          widthMm: true,
        },
      },
    }
    expect(getDriverVirtualOutputValue(drivenNode, baseplateDef!, 'out:drv:widthMm')).toBe(45)
    expect(getDriverVirtualOutputValue(drivenNode, baseplateDef!, 'drv:widthMm')).toBe(45)
  })

  it('supports vec2 nodeParam driver outputs and excludes unknown ids', () => {
    const toeHookDef = getNodeDef('Part/ToeHook')
    expect(toeHookDef).toBeDefined()

    const explicitVec2Node: SpaghettiNode = {
      nodeId: 'n-toehook',
      type: 'Part/ToeHook',
      params: {
        profileA_end: { x: 12, y: 34 },
        driverOffsetByParamId: {
          profileA_end: 99,
        },
        driverDrivenByParamId: {
          profileA_end: true,
        },
      },
    }
    expect(
      getDriverVirtualOutputValue(explicitVec2Node, toeHookDef!, 'out:drv:profileA_end'),
    ).toEqual({
      x: 12,
      y: 34,
    })
    expect(getDriverVirtualOutputValue(explicitVec2Node, toeHookDef!, 'drv:profileA_end')).toEqual(
      {
        x: 12,
        y: 34,
      },
    )
    expect(getDriverVirtualOutputValue(explicitVec2Node, toeHookDef!, 'drv:unknown')).toBeUndefined()
    expect(getDriverVirtualOutputValue(explicitVec2Node, toeHookDef!, 'out:drv:unknown')).toBeUndefined()
  })
})
