import {
  isDriverVirtualInputPortId,
  isDriverVirtualOutputPortId,
  parseDriverVirtualInputPortId,
  parseDriverVirtualOutputPortId,
  toCanonicalDriverVirtualInputPortId,
  toCanonicalDriverVirtualOutputPortId,
} from '../features/driverVirtualPorts'
import { listEffectiveOutputPorts } from '../features/effectivePorts'
import { getNodeDef } from '../registry/nodeRegistry'
import type { PortSpec, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import {
  buildNodeDriverVm,
  type DriverControlRowVm,
  type DriverEndpointRowVm,
  type InputEndpointRowVm,
  type NodeDriverVm,
  type OutputPinnedRowVm,
} from '../canvas/driverVm'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const listNumericNodeParamDriverIds = (
  nodeDef: ReturnType<typeof getNodeDef>,
): string[] => {
  if (nodeDef === undefined) {
    return []
  }
  const ids = new Set<string>()
  for (const spec of nodeDef.inputDrivers ?? []) {
    if (spec.kind !== 'nodeParam' || spec.control.kind !== 'nodeParam') {
      continue
    }
    if (spec.control.wireOutputType?.kind !== 'number') {
      continue
    }
    ids.add(spec.control.paramId)
  }
  return [...ids].sort((a, b) => a.localeCompare(b))
}

export type DriverDrivenState = {
  driven: boolean
  connectionCount: number
  resolvedValue?: unknown
  unresolved: boolean
}

export type DriverVmSelection = {
  driverInputPortByRowId: Record<string, PortSpec>
  driverOutputPortByRowId: Record<string, PortSpec>
  driverDrivenStateByRowId: Record<string, DriverDrivenState>
  drivenValueByParamId: Record<string, number>
  offsetValueByParamId: Record<string, number>
  effectiveValueByParamId: Record<string, number>
  driverVm: NodeDriverVm | null
  driverRows: DriverRowVm[]
  driverRowsBySection: {
    drivers: DriverRowVm[]
    inputs: DriverRowVm[]
    outputs: DriverRowVm[]
    otherOutputs: DriverRowVm[]
  }
}

export type DriverRowVm = {
  rowId: string
  section: 'drivers' | 'inputs' | 'outputs' | 'otherOutputs'
  paramId?: string
}

type SelectDriverVmParams = {
  node: SpaghettiNode
  incoming: readonly SpaghettiGraph['edges'][number][]
  effectiveInputPorts: readonly PortSpec[]
  resolvedInputsByPortId: Record<string, unknown> | undefined
  connectionCountByPortId: Map<string, number>
}

const toParamIdForRow = (
  row:
    | DriverControlRowVm
    | InputEndpointRowVm
    | OutputPinnedRowVm
    | DriverEndpointRowVm,
): string | undefined => {
  if (!row.rowId.startsWith('drv:')) {
    return undefined
  }
  const paramId = row.rowId.slice(4)
  return paramId.length > 0 ? paramId : undefined
}

const toDriverRowsBySection = (driverVm: NodeDriverVm | null): DriverVmSelection['driverRowsBySection'] => {
  if (driverVm === null) {
    return {
      drivers: [],
      inputs: [],
      outputs: [],
      otherOutputs: [],
    }
  }
  return {
    drivers: driverVm.drivers.map((row) => ({
      rowId: row.rowId,
      section: 'drivers',
      paramId: toParamIdForRow(row),
    })),
    inputs: driverVm.inputs.map((row) => ({
      rowId: row.rowId,
      section: 'inputs',
      paramId: toParamIdForRow(row),
    })),
    outputs: driverVm.outputs.map((row) => ({
      rowId: row.rowId,
      section: 'outputs',
      paramId: toParamIdForRow(row),
    })),
    otherOutputs: driverVm.otherOutputs.map((row) => ({
      rowId: row.rowId,
      section: 'otherOutputs',
      paramId: toParamIdForRow(row),
    })),
  }
}

const buildDriverVmSelection = (params: SelectDriverVmParams): DriverVmSelection => {
  const { node, incoming, effectiveInputPorts, resolvedInputsByPortId, connectionCountByPortId } =
    params
  const nodeDef = getNodeDef(node.type)

  const driverInputPortByRowId: Record<string, PortSpec> = {}
  const driverDrivenStateByRowId: Record<string, DriverDrivenState> = {}
  const driverInputAccumByRowId: Record<
    string,
    {
      port: PortSpec
      portIsCanonical: boolean
      connectionCount: number
      resolvedValue?: unknown
      hasResolvedValue: boolean
      resolvedIsCanonical: boolean
    }
  > = {}

  for (const port of effectiveInputPorts) {
    if (!isDriverVirtualInputPortId(port.portId)) {
      continue
    }
    const parsed = parseDriverVirtualInputPortId(port.portId)
    if (parsed === null) {
      continue
    }
    const rowId = `drv:${parsed.paramId}`
    const canonicalPortId = toCanonicalDriverVirtualInputPortId(port.portId)
    const isCanonical = canonicalPortId !== null && canonicalPortId === port.portId
    const connectionCount = incoming.filter(
      (edge) =>
        edge.to.portId === port.portId &&
        (edge.to.path === undefined || edge.to.path.length === 0),
    ).length
    const resolvedValue = resolvedInputsByPortId?.[port.portId]
    const existing = driverInputAccumByRowId[rowId]
    if (existing === undefined) {
      driverInputAccumByRowId[rowId] = {
        port,
        portIsCanonical: isCanonical,
        connectionCount,
        ...(resolvedValue === undefined ? {} : { resolvedValue }),
        hasResolvedValue: resolvedValue !== undefined,
        resolvedIsCanonical: resolvedValue !== undefined && isCanonical,
      }
      continue
    }
    existing.connectionCount += connectionCount
    if (isCanonical && !existing.portIsCanonical) {
      existing.port = port
      existing.portIsCanonical = true
    }
    if (resolvedValue === undefined) {
      continue
    }
    if (!existing.hasResolvedValue || (isCanonical && !existing.resolvedIsCanonical)) {
      existing.resolvedValue = resolvedValue
      existing.hasResolvedValue = true
      existing.resolvedIsCanonical = isCanonical
    }
  }

  for (const [rowId, accum] of Object.entries(driverInputAccumByRowId)) {
    driverInputPortByRowId[rowId] = accum.port
    const driven = accum.connectionCount > 0
    driverDrivenStateByRowId[rowId] = {
      driven,
      connectionCount: accum.connectionCount,
      ...(accum.hasResolvedValue ? { resolvedValue: accum.resolvedValue } : {}),
      unresolved: driven && !accum.hasResolvedValue,
    }
  }

  const driverOutputPortByRowId: Record<string, PortSpec> = {}
  for (const port of listEffectiveOutputPorts(node, nodeDef)) {
    if (!isDriverVirtualOutputPortId(port.portId)) {
      continue
    }
    const parsed = parseDriverVirtualOutputPortId(port.portId)
    if (parsed === null) {
      continue
    }
    const rowId = `drv:${parsed.paramId}`
    const canonicalPortId = toCanonicalDriverVirtualOutputPortId(port.portId)
    const isCanonical = canonicalPortId !== null && canonicalPortId === port.portId
    const existing = driverOutputPortByRowId[rowId]
    if (existing === undefined) {
      driverOutputPortByRowId[rowId] = port
      continue
    }
    const existingCanonicalPortId = toCanonicalDriverVirtualOutputPortId(existing.portId)
    const existingIsCanonical =
      existingCanonicalPortId !== null && existingCanonicalPortId === existing.portId
    if (isCanonical && !existingIsCanonical) {
      driverOutputPortByRowId[rowId] = port
    }
  }

  const numericDriverParamIds = listNumericNodeParamDriverIds(nodeDef)
  const rawDriverOffsetByParamId = isRecord(node.params.driverOffsetByParamId)
    ? node.params.driverOffsetByParamId
    : undefined
  const rawDriverDrivenByParamId = isRecord(node.params.driverDrivenByParamId)
    ? node.params.driverDrivenByParamId
    : undefined
  const offsetValueByParamId: Record<string, number> = {}
  const drivenValueByParamId: Record<string, number> = {}
  const effectiveValueByParamId: Record<string, number> = {}
  for (const paramId of numericDriverParamIds) {
    const rowId = `drv:${paramId}`
    const state = driverDrivenStateByRowId[rowId]
    const drivenFlag = rawDriverDrivenByParamId?.[paramId] === true
    const offsetModeActive =
      rawDriverDrivenByParamId === undefined ? state?.driven === true : drivenFlag
    const rawOffset = rawDriverOffsetByParamId?.[paramId]
    const offsetValue =
      typeof rawOffset === 'number' && Number.isFinite(rawOffset) ? rawOffset : 0
    offsetValueByParamId[paramId] = offsetValue
    if (
      offsetModeActive &&
      state?.driven === true &&
      state.unresolved !== true &&
      typeof state.resolvedValue === 'number' &&
      Number.isFinite(state.resolvedValue)
    ) {
      drivenValueByParamId[paramId] = state.resolvedValue
      effectiveValueByParamId[paramId] = state.resolvedValue + offsetValue
    }
  }

  const driverVm = buildNodeDriverVm(node, nodeDef, {
    resolvedInputsByPortId,
    connectionCountByPortId,
    resolvedDriverValuesByParamId: Object.fromEntries(
      Object.entries(driverDrivenStateByRowId)
        .filter(([, state]) => state.resolvedValue !== undefined)
        .map(([rowId, state]) => [rowId.slice(4), state.resolvedValue]),
    ),
    driverDrivenStateByParamId: Object.fromEntries(
      Object.entries(driverDrivenStateByRowId).map(([rowId, state]) => [
        rowId.slice(4),
        {
          driven: state.driven,
          unresolved: state.unresolved,
        },
      ]),
    ),
    drivenValueByParamId,
    offsetByParamId: offsetValueByParamId,
    effectiveValueByParamId,
  })

  const driverRowsBySection = toDriverRowsBySection(driverVm)
  return {
    driverInputPortByRowId,
    driverOutputPortByRowId,
    driverDrivenStateByRowId,
    drivenValueByParamId,
    offsetValueByParamId,
    effectiveValueByParamId,
    driverVm,
    driverRowsBySection,
    driverRows: [
      ...driverRowsBySection.drivers,
      ...driverRowsBySection.inputs,
      ...driverRowsBySection.outputs,
      ...driverRowsBySection.otherOutputs,
    ],
  }
}

let lastParams: SelectDriverVmParams | undefined
let lastSelection: DriverVmSelection | undefined

export const selectDriverVm = (params: SelectDriverVmParams): DriverVmSelection => {
  if (
    lastSelection !== undefined &&
    lastParams !== undefined &&
    lastParams.node === params.node &&
    lastParams.incoming === params.incoming &&
    lastParams.effectiveInputPorts === params.effectiveInputPorts &&
    lastParams.resolvedInputsByPortId === params.resolvedInputsByPortId &&
    lastParams.connectionCountByPortId === params.connectionCountByPortId
  ) {
    return lastSelection
  }
  const next = buildDriverVmSelection(params)
  lastParams = params
  lastSelection = next
  return next
}
