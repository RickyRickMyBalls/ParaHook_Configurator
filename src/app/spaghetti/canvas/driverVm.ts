import { readFeatureStack } from '../features/featureSchema'
import type { ExtrudeFeature, FeatureStack } from '../features/featureTypes'
import type {
  DriverEndpointRef,
  DriverNumberControlSpec,
  DriverVec2ControlSpec,
  NodeDefinition,
} from '../registry/nodeRegistry'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
import { getFieldNodeAtPath, getFieldTree } from '../types/fieldTree'
import {
  buildDriverFeatureParamRowId,
  buildDriverNodeParamRowId,
  buildInputRowId,
  buildOutputRowId,
} from '../parts/partRowOrder'

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const pathKey = (path: string[] | undefined): string =>
  normalizePath(path)?.join('.') ?? ''

const getValueAtPath = (value: unknown, path: string[] | undefined): unknown => {
  const normalizedPath = normalizePath(path)
  if (normalizedPath === undefined) {
    return value
  }
  let current: unknown = value
  for (const segment of normalizedPath) {
    if (typeof current !== 'object' || current === null) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }
  return current
}

const formatDisplayNumber = (value: number, unit?: string): string => {
  const rounded = Number(value.toFixed(3))
  const asText = rounded.toString()
  return unit === undefined ? asText : `${asText} ${unit}`
}

export const buildDriverEndpointKey = (
  portId: string,
  path: string[] | undefined,
): string => `${portId}::${pathKey(path)}`

const leafLabel = (path: string[], fallback?: string): string => {
  if (path.length <= 1 && fallback !== undefined && fallback.length > 0) {
    return fallback
  }
  const fromPath = path
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('.')
  if (fromPath.length > 0) {
    return fromPath
  }
  if (fallback !== undefined && fallback.length > 0) {
    return fallback
  }
  return 'Value'
}

const resolveEndpointPort = (
  ports: PortSpec[],
  endpoint: DriverEndpointRef,
): { port: PortSpec; path?: string[] } | null => {
  const rootPort = ports.find((port) => port.portId === endpoint.portId)
  if (rootPort === undefined) {
    return null
  }
  const normalizedPath = normalizePath(endpoint.path)
  if (normalizedPath === undefined) {
    return {
      port: rootPort,
    }
  }
  const leafNode = getFieldNodeAtPath(getFieldTree(rootPort.type), normalizedPath)
  if (leafNode === undefined) {
    return null
  }
  return {
    port: {
      ...rootPort,
      label: leafLabel(normalizedPath, leafNode.label),
      type: leafNode.type,
    },
    path: normalizedPath,
  }
}

const readFirstExtrudeFeature = (stack: FeatureStack): ExtrudeFeature | undefined =>
  stack.find((feature): feature is ExtrudeFeature => feature.type === 'extrude')

export type DriverNumberChange =
  | {
      kind: 'nodeParam'
      paramId: string
      syncRect?: DriverNumberControlSpec['syncRect']
    }
  | {
      kind: 'nodeParamVec2Axis'
      paramId: string
      axis: 'x' | 'y'
    }
  | {
      kind: 'nodeParamOffset'
      paramId: string
    }
  | {
      kind: 'featureParam'
      featureParamKind: 'firstExtrudeDepth'
      featureId?: string
    }

export type DriverNumberInputVm = {
  value: number
  min?: number
  max?: number
  step?: number
  showSlider?: boolean
  disabled?: boolean
  driven?: boolean
  unresolved?: boolean
  change: DriverNumberChange
}

export type DriverEndpointRowVm = {
  kind: 'endpoint'
  rowId: string
  direction: 'in' | 'out'
  port: PortSpec
  endpointPortId: string
  endpointPath?: string[]
  labelOverride?: string
  numberInput?: DriverNumberInputVm
  displayValue?: string
  inputWiringDisabled?: boolean
  drivenMessage?: string
}

export type DriverFeatureParamRowVm = {
  kind: 'featureParam'
  rowId: string
  label: string
  groupLabel?: string
  numberInput: DriverNumberInputVm
}

export type DriverNodeParamNumberRowVm = {
  kind: 'nodeParamNumber'
  rowId: string
  label: string
  groupLabel?: string
  numberInput: DriverNumberInputVm
  offsetMode?: boolean
  drivenValue?: number
  offsetInput?: DriverNumberInputVm
  effectiveValue?: number
}

export type DriverNodeParamVec2RowVm = {
  kind: 'nodeParamVec2'
  rowId: string
  label: string
  groupLabel?: string
  xInput: DriverNumberInputVm
  yInput: DriverNumberInputVm
}

export type DriverReservedOutputRowVm = {
  kind: 'reserved'
  rowId: string
  label: string
  reservedKind: 'mesh'
  state: 'pending'
}

export type DriverControlRowVm =
  | DriverFeatureParamRowVm
  | DriverNodeParamNumberRowVm
  | DriverNodeParamVec2RowVm
export type InputEndpointRowVm = DriverEndpointRowVm
export type OutputPinnedRowVm = DriverEndpointRowVm | DriverReservedOutputRowVm

export type NodeDriverVm = {
  template: 'part'
  drivers: DriverControlRowVm[]
  inputs: InputEndpointRowVm[]
  outputs: OutputPinnedRowVm[]
  otherOutputs: DriverEndpointRowVm[]
}

type DriverDrivenState = {
  driven: boolean
  unresolved: boolean
}

const toFiniteNumberOr = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const isVec2Like = (value: unknown): value is { x: number; y: number } =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { x?: unknown }).x === 'number' &&
  Number.isFinite((value as { x: number }).x) &&
  typeof (value as { y?: unknown }).y === 'number' &&
  Number.isFinite((value as { y: number }).y)

const resolveNumberControl = (
  node: SpaghettiNode,
  control: DriverNumberControlSpec,
  resolvedOverrideValue: unknown,
  drivenState: DriverDrivenState | undefined,
): DriverNumberInputVm => {
  const fallbackValue = control.fallbackValue ?? 0
  const resolvedValue =
    typeof resolvedOverrideValue === 'number' && Number.isFinite(resolvedOverrideValue)
      ? resolvedOverrideValue
      : toFiniteNumberOr(node.params[control.paramId], fallbackValue)
  return {
    value: resolvedValue,
    min: control.min,
    max: control.max,
    step: control.step,
    showSlider: control.showSlider,
    disabled: drivenState?.driven === true ? true : undefined,
    driven: drivenState?.driven === true ? true : undefined,
    unresolved: drivenState?.unresolved === true ? true : undefined,
    change: {
      kind: 'nodeParam',
      paramId: control.paramId,
      ...(control.syncRect === undefined ? {} : { syncRect: control.syncRect }),
    },
  }
}

const resolveVec2Control = (
  node: SpaghettiNode,
  control: DriverVec2ControlSpec,
  resolvedOverrideValue: unknown,
  drivenState: DriverDrivenState | undefined,
): Pick<DriverNodeParamVec2RowVm, 'xInput' | 'yInput'> => {
  const fallbackValue = control.fallbackValue ?? { x: 0, y: 0 }
  const resolved =
    isVec2Like(resolvedOverrideValue)
      ? resolvedOverrideValue
      : isVec2Like(node.params[control.paramId])
        ? (node.params[control.paramId] as { x: number; y: number })
        : fallbackValue
  return {
    xInput: {
      value: toFiniteNumberOr(resolved.x, fallbackValue.x),
      min: control.min,
      max: control.max,
      step: control.step,
      disabled: drivenState?.driven === true ? true : undefined,
      driven: drivenState?.driven === true ? true : undefined,
      unresolved: drivenState?.unresolved === true ? true : undefined,
      change: {
        kind: 'nodeParamVec2Axis',
        paramId: control.paramId,
        axis: 'x',
      },
    },
    yInput: {
      value: toFiniteNumberOr(resolved.y, fallbackValue.y),
      min: control.min,
      max: control.max,
      step: control.step,
      disabled: drivenState?.driven === true ? true : undefined,
      driven: drivenState?.driven === true ? true : undefined,
      unresolved: drivenState?.unresolved === true ? true : undefined,
      change: {
        kind: 'nodeParamVec2Axis',
        paramId: control.paramId,
        axis: 'y',
      },
    },
  }
}

export const buildNodeDriverVm = (
  node: SpaghettiNode,
  nodeDef: NodeDefinition | undefined,
  options?: {
    resolvedInputsByPortId?: Record<string, unknown>
    connectionCountByPortId?: ReadonlyMap<string, number>
    resolvedDriverValuesByParamId?: Record<string, unknown>
    driverDrivenStateByParamId?: Record<string, DriverDrivenState>
    drivenValueByParamId?: Record<string, number>
    offsetByParamId?: Record<string, number>
    effectiveValueByParamId?: Record<string, number>
  },
): NodeDriverVm | null => {
  if (nodeDef?.template !== 'part') {
    return null
  }

  const drivers: DriverControlRowVm[] = []
  const inputs: InputEndpointRowVm[] = []
  const outputs: OutputPinnedRowVm[] = []

  const stack = readFeatureStack(node.params.featureStack)
  const firstExtrude = readFirstExtrudeFeature(stack)

  for (const spec of nodeDef.inputDrivers ?? []) {
    if (spec.kind === 'endpoint') {
      const resolved = resolveEndpointPort(nodeDef.inputs, spec.endpoint)
      if (resolved === null) {
        continue
      }
      const endpointConnectionCount =
        options?.connectionCountByPortId?.get(spec.endpoint.portId) ?? 0
      if (spec.visibility === 'connectedOnly' && endpointConnectionCount === 0) {
        continue
      }
      const resolvedRootInput = options?.resolvedInputsByPortId?.[spec.endpoint.portId]
      const resolvedInputValue = getValueAtPath(resolvedRootInput, resolved.path)
      const displayValue =
        resolved.port.type.kind === 'number' && typeof resolvedInputValue === 'number' && Number.isFinite(resolvedInputValue)
          ? formatDisplayNumber(resolvedInputValue, resolved.port.type.unit)
          : undefined
      const encodedInputPath = pathKey(resolved.path)
      inputs.push({
        kind: 'endpoint',
        rowId: buildInputRowId(
          spec.endpoint.portId,
          encodedInputPath.length === 0 ? undefined : encodedInputPath,
        ),
        direction: 'in',
        port: resolved.port,
        endpointPortId: spec.endpoint.portId,
        endpointPath: resolved.path,
        labelOverride: spec.endpoint.label,
        displayValue,
        inputWiringDisabled: spec.wiringDisabled === true,
        drivenMessage:
          spec.wiringDisabled === true ? 'Legacy wire (read-only)' : undefined,
        ...(spec.numberControl === undefined
          ? {}
          : {
              numberInput: resolveNumberControl(
                node,
                spec.numberControl,
                undefined,
                undefined,
              ),
            }),
      })
      continue
    }

    if (spec.kind === 'nodeParam') {
      if (spec.control.kind === 'nodeParam') {
        const drivenState = options?.driverDrivenStateByParamId?.[spec.control.paramId]
        const offsetValueRaw = options?.offsetByParamId?.[spec.control.paramId]
        const offsetValue =
          typeof offsetValueRaw === 'number' && Number.isFinite(offsetValueRaw)
            ? offsetValueRaw
            : 0
        const drivenValue = options?.drivenValueByParamId?.[spec.control.paramId]
        const effectiveValueFromOption =
          options?.effectiveValueByParamId?.[spec.control.paramId]
        const effectiveValue =
          typeof effectiveValueFromOption === 'number' &&
          Number.isFinite(effectiveValueFromOption)
            ? effectiveValueFromOption
            : typeof drivenValue === 'number' && Number.isFinite(drivenValue)
              ? drivenValue + offsetValue
              : undefined
        drivers.push({
          kind: 'nodeParamNumber',
          rowId: buildDriverNodeParamRowId(spec.control.paramId),
          label: spec.label,
          groupLabel: spec.groupLabel,
          numberInput: resolveNumberControl(
            node,
            spec.control,
            options?.resolvedDriverValuesByParamId?.[spec.control.paramId],
            drivenState,
          ),
          offsetMode: drivenState?.driven === true ? true : undefined,
          drivenValue:
            drivenState?.driven === true &&
            drivenState.unresolved !== true &&
            typeof drivenValue === 'number' &&
            Number.isFinite(drivenValue)
              ? drivenValue
              : undefined,
          offsetInput:
            drivenState?.driven === true
              ? {
                  value: offsetValue,
                  step: spec.control.step,
                  change: {
                    kind: 'nodeParamOffset',
                    paramId: spec.control.paramId,
                  },
                }
              : undefined,
          effectiveValue:
            drivenState?.driven === true &&
            drivenState.unresolved !== true &&
            typeof effectiveValue === 'number' &&
            Number.isFinite(effectiveValue)
              ? effectiveValue
              : undefined,
        })
        continue
      }
      const vec2Control = resolveVec2Control(
        node,
        spec.control,
        options?.resolvedDriverValuesByParamId?.[spec.control.paramId],
        options?.driverDrivenStateByParamId?.[spec.control.paramId],
      )
      drivers.push({
        kind: 'nodeParamVec2',
        rowId: buildDriverNodeParamRowId(spec.control.paramId),
        label: spec.label,
        groupLabel: spec.groupLabel,
        ...vec2Control,
      })
      continue
    }

    if (spec.featureParam.kind !== 'firstExtrudeDepth') {
      continue
    }
    const depthValue =
      firstExtrude !== undefined && Number.isFinite(firstExtrude.params.depth.value)
        ? firstExtrude.params.depth.value
        : 0
    drivers.push({
      kind: 'featureParam',
      rowId: buildDriverFeatureParamRowId(spec.featureParam.kind),
      label: spec.label,
      groupLabel: spec.groupLabel,
      numberInput: {
        value: depthValue,
        min: 0,
        max: 2000,
        step: 0.1,
        showSlider: true,
        disabled: firstExtrude === undefined,
        driven: firstExtrude === undefined,
        change: {
          kind: 'featureParam',
          featureParamKind: 'firstExtrudeDepth',
          ...(firstExtrude === undefined ? {} : { featureId: firstExtrude.featureId }),
        },
      },
    })
  }

  const outputDriverEndpointKeys = new Set<string>()
  for (const [index, spec] of (nodeDef.outputDrivers ?? []).entries()) {
    if (spec.kind === 'endpoint') {
      const resolved = resolveEndpointPort(nodeDef.outputs, spec.endpoint)
      if (resolved === null) {
        continue
      }
      const encodedOutputPath = pathKey(resolved.path)
      outputDriverEndpointKeys.add(buildDriverEndpointKey(spec.endpoint.portId, resolved.path))
      outputs.push({
        kind: 'endpoint',
        rowId: buildOutputRowId(
          spec.endpoint.portId,
          encodedOutputPath.length === 0 ? undefined : encodedOutputPath,
        ),
        direction: 'out',
        port: resolved.port,
        endpointPortId: spec.endpoint.portId,
        endpointPath: resolved.path,
        labelOverride: spec.endpoint.label,
      })
      continue
    }
    outputs.push({
      kind: 'reserved',
      rowId: `out-reserved-${index}-${spec.reserved.kind}`,
      label: spec.label,
      reservedKind: spec.reserved.kind,
      state: spec.reserved.state,
    })
  }

  const otherOutputs: DriverEndpointRowVm[] = nodeDef.outputs
    .filter((port) => !outputDriverEndpointKeys.has(buildDriverEndpointKey(port.portId, undefined)))
    .map((port) => ({
      kind: 'endpoint',
      rowId: buildOutputRowId(port.portId),
      direction: 'out',
      port,
      endpointPortId: port.portId,
    }))

  return {
    template: 'part',
    drivers,
    inputs,
    outputs,
    otherOutputs,
  }
}
