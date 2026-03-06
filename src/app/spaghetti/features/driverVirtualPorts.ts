import { getNodeDef, type NodeDefinition } from '../registry/nodeRegistry'
import type { PortSpec, PortType, SpaghettiNode } from '../schema/spaghettiTypes'

type ParsedDriverVirtualOutputPort = {
  paramId: string
}

type ParsedDriverVirtualInputPort = {
  paramId: string
}

const DRIVER_VIRTUAL_OUTPUT_PREFIX = 'out:drv:'
const DRIVER_VIRTUAL_INPUT_PREFIX = 'in:drv:'
const LEGACY_DRIVER_VIRTUAL_OUTPUT_PREFIX = 'drv:'
const LEGACY_DRIVER_VIRTUAL_INPUT_PREFIX = 'drv:in:'
const DRIVER_PARAM_ID_PATTERN = /^[A-Za-z0-9_]+$/

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isFiniteVec2 = (value: unknown): value is { x: number; y: number } =>
  typeof value === 'object' &&
  value !== null &&
  isFiniteNumber((value as { x?: unknown }).x) &&
  isFiniteNumber((value as { y?: unknown }).y)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isValidForPortType = (value: unknown, type: PortType): boolean => {
  switch (type.kind) {
    case 'number':
      return isFiniteNumber(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'vec2':
      return isFiniteVec2(value)
    default:
      return false
  }
}

export const buildDriverVirtualOutputPortId = (paramId: string): string =>
  `${DRIVER_VIRTUAL_OUTPUT_PREFIX}${paramId}`

export const buildLegacyDriverVirtualOutputPortId = (paramId: string): string =>
  `${LEGACY_DRIVER_VIRTUAL_OUTPUT_PREFIX}${paramId}`

export const parseDriverVirtualOutputPortId = (
  portId: string,
): ParsedDriverVirtualOutputPort | null => {
  if (
    portId.startsWith(DRIVER_VIRTUAL_INPUT_PREFIX) ||
    portId.startsWith(LEGACY_DRIVER_VIRTUAL_INPUT_PREFIX)
  ) {
    return null
  }
  let paramId = ''
  if (portId.startsWith(DRIVER_VIRTUAL_OUTPUT_PREFIX)) {
    paramId = portId.slice(DRIVER_VIRTUAL_OUTPUT_PREFIX.length)
  } else if (portId.startsWith(LEGACY_DRIVER_VIRTUAL_OUTPUT_PREFIX)) {
    paramId = portId.slice(LEGACY_DRIVER_VIRTUAL_OUTPUT_PREFIX.length)
  } else {
    return null
  }
  if (
    paramId.length === 0 ||
    paramId.includes(':') ||
    !DRIVER_PARAM_ID_PATTERN.test(paramId)
  ) {
    return null
  }
  return { paramId }
}

export const isDriverVirtualOutputPortId = (portId: string): boolean =>
  parseDriverVirtualOutputPortId(portId) !== null

export const buildDriverVirtualInputPortId = (paramId: string): string =>
  `${DRIVER_VIRTUAL_INPUT_PREFIX}${paramId}`

export const buildLegacyDriverVirtualInputPortId = (paramId: string): string =>
  `${LEGACY_DRIVER_VIRTUAL_INPUT_PREFIX}${paramId}`

export const parseDriverVirtualInputPortId = (
  portId: string,
): ParsedDriverVirtualInputPort | null => {
  let paramId = ''
  if (portId.startsWith(DRIVER_VIRTUAL_INPUT_PREFIX)) {
    paramId = portId.slice(DRIVER_VIRTUAL_INPUT_PREFIX.length)
  } else if (portId.startsWith(LEGACY_DRIVER_VIRTUAL_INPUT_PREFIX)) {
    paramId = portId.slice(LEGACY_DRIVER_VIRTUAL_INPUT_PREFIX.length)
  } else {
    return null
  }
  if (
    paramId.length === 0 ||
    paramId.includes(':') ||
    !DRIVER_PARAM_ID_PATTERN.test(paramId)
  ) {
    return null
  }
  return { paramId }
}

export const isDriverVirtualInputPortId = (portId: string): boolean =>
  parseDriverVirtualInputPortId(portId) !== null

export const toCanonicalDriverVirtualInputPortId = (portId: string): string | null => {
  const parsed = parseDriverVirtualInputPortId(portId)
  if (parsed === null) {
    return null
  }
  return buildDriverVirtualInputPortId(parsed.paramId)
}

export const toCanonicalDriverVirtualOutputPortId = (portId: string): string | null => {
  const parsed = parseDriverVirtualOutputPortId(portId)
  if (parsed === null) {
    return null
  }
  return buildDriverVirtualOutputPortId(parsed.paramId)
}

export const listDriverVirtualOutputPorts = (
  node: SpaghettiNode,
  nodeDef?: NodeDefinition,
): PortSpec[] => {
  const resolvedNodeDef = nodeDef ?? getNodeDef(node.type)
  if (resolvedNodeDef === undefined) {
    return []
  }
  const virtualPorts: PortSpec[] = []
  for (const driverSpec of resolvedNodeDef.inputDrivers ?? []) {
    if (driverSpec.kind !== 'nodeParam') {
      continue
    }
    if (
      driverSpec.control.kind !== 'nodeParam' &&
      driverSpec.control.kind !== 'nodeParamVec2'
    ) {
      continue
    }
    const wireOutputType = driverSpec.control.wireOutputType
    if (wireOutputType === undefined) {
      continue
    }
    const paramId = driverSpec.control.paramId
    virtualPorts.push({
      portId: buildDriverVirtualOutputPortId(paramId),
      label: driverSpec.label,
      type: wireOutputType,
    })
    virtualPorts.push({
      portId: buildLegacyDriverVirtualOutputPortId(paramId),
      label: driverSpec.label,
      type: wireOutputType,
    })
  }
  return virtualPorts
}

export const listDriverVirtualInputPorts = (
  node: SpaghettiNode,
  nodeDef?: NodeDefinition,
): PortSpec[] => {
  const resolvedNodeDef = nodeDef ?? getNodeDef(node.type)
  if (resolvedNodeDef === undefined) {
    return []
  }
  const virtualPorts: PortSpec[] = []
  for (const driverSpec of resolvedNodeDef.inputDrivers ?? []) {
    if (driverSpec.kind !== 'nodeParam') {
      continue
    }
    if (
      driverSpec.control.kind !== 'nodeParam' &&
      driverSpec.control.kind !== 'nodeParamVec2'
    ) {
      continue
    }
    const wireOutputType = driverSpec.control.wireOutputType
    if (wireOutputType === undefined) {
      continue
    }
    const paramId = driverSpec.control.paramId
    virtualPorts.push({
      portId: buildDriverVirtualInputPortId(paramId),
      label: `${driverSpec.label} Driver Input`,
      type: wireOutputType,
      optional: true,
      maxConnectionsIn: 1,
    })
    virtualPorts.push({
      portId: buildLegacyDriverVirtualInputPortId(paramId),
      label: `${driverSpec.label} Driver Input`,
      type: wireOutputType,
      optional: true,
      maxConnectionsIn: 1,
    })
  }
  return virtualPorts
}

export const getDriverVirtualOutputValue = (
  node: SpaghettiNode,
  nodeDef: NodeDefinition,
  portId: string,
): unknown | undefined => {
  const parsed = parseDriverVirtualOutputPortId(portId)
  if (parsed === null) {
    return undefined
  }

  for (const driverSpec of nodeDef.inputDrivers ?? []) {
    if (driverSpec.kind !== 'nodeParam') {
      continue
    }
    const control = driverSpec.control
    if (
      control.kind !== 'nodeParam' &&
      control.kind !== 'nodeParamVec2'
    ) {
      continue
    }
    if (control.paramId !== parsed.paramId || control.wireOutputType === undefined) {
      continue
    }

    let resolvedBaseValue: unknown | undefined
    const rawValue = node.params[control.paramId]
    if (isValidForPortType(rawValue, control.wireOutputType)) {
      resolvedBaseValue = rawValue
    } else if (
      control.kind === 'nodeParam' &&
      isValidForPortType(control.fallbackValue, control.wireOutputType)
    ) {
      resolvedBaseValue = control.fallbackValue
    } else if (
      control.kind === 'nodeParamVec2' &&
      isValidForPortType(control.fallbackValue, control.wireOutputType)
    ) {
      resolvedBaseValue = control.fallbackValue
    }
    if (resolvedBaseValue === undefined) {
      return undefined
    }

    if (
      control.kind === 'nodeParam' &&
      control.wireOutputType.kind === 'number' &&
      typeof resolvedBaseValue === 'number' &&
      Number.isFinite(resolvedBaseValue)
    ) {
      const rawDrivenByParamId = node.params.driverDrivenByParamId
      const driverDrivenByParamId = isRecord(rawDrivenByParamId)
        ? rawDrivenByParamId
        : undefined
      if (driverDrivenByParamId?.[control.paramId] === true) {
        const rawOffsetByParamId = node.params.driverOffsetByParamId
        const driverOffsetByParamId = isRecord(rawOffsetByParamId)
          ? rawOffsetByParamId
          : undefined
        const rawOffset = driverOffsetByParamId?.[control.paramId]
        const offset =
          typeof rawOffset === 'number' && Number.isFinite(rawOffset) ? rawOffset : 0
        return resolvedBaseValue + offset
      }
    }

    return resolvedBaseValue
  }

  return undefined
}
