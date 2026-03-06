import type { EvaluationResult } from '../compiler/evaluateGraph'
import {
  listEffectiveInputPorts,
} from '../features/effectivePorts'
import { readFeatureStack } from '../features/featureSchema'
import {
  analyzeFeatureDependencyGraph,
  type FeatureDependencyEdge,
  type FeatureDependencyRow,
} from '../features/featureDependencies'
import { isFeatureVirtualInputPortId } from '../features/featureVirtualPorts'
import { getNodeDef, type NodeUiSection } from '../registry/nodeRegistry'
import type { PortSpec, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import type { PortDetailLine } from '../canvas/PortView'
import {
  type DriverControlRowVm,
  type OutputPinnedRowVm,
} from '../canvas/driverVm'
import {
  buildVmRowIdsForSection,
  normalizePartRowOrder,
  orderDrivers,
  orderInputs,
  orderOutputsEndpointRowsKeepingReservedFixed,
} from '../parts/partRowOrder'
import { selectDriverVm } from './selectDriverVm'
import {
  selectDiagnosticsVm,
  type DiagnosticsVm,
  type EdgeDiagnosticReason,
} from './selectDiagnosticsVm'

const compareEdges = (a: SpaghettiGraph['edges'][number], b: SpaghettiGraph['edges'][number]): number =>
  a.edgeId.localeCompare(b.edgeId)

const describePortType = (type: PortSpec['type']): string =>
  type.unit === undefined ? type.kind : `${type.kind}:${type.unit}`

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? value.toString() : value.toFixed(3)

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const endpointPathKey = (path: string[] | undefined): string =>
  normalizePath(path)?.join('.') ?? ''

const leafPortPathKey = (portId: string, path: string[] | undefined): string =>
  `${portId}::${endpointPathKey(path)}`

const EDGE_REASON_ORDER: EdgeDiagnosticReason[] = [
  'missingPort',
  'cycle',
  'typeMismatch',
  'unresolved',
]

const reasonKindForStatus = (
  reasons: ReadonlyArray<EdgeDiagnosticReason> | undefined,
  fallbackKind: 'ok' | DriverRowWarningVm['kind'],
): DriverRowWarningVm['kind'] | null => {
  for (const reason of EDGE_REASON_ORDER) {
    if ((reasons ?? []).includes(reason)) {
      return reason
    }
  }
  return fallbackKind === 'ok' ? null : fallbackKind
}

const isVec2Like = (value: unknown): value is { x: number; y: number } => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as { x?: unknown; y?: unknown }
  return (
    typeof candidate.x === 'number' &&
    Number.isFinite(candidate.x) &&
    typeof candidate.y === 'number' &&
    Number.isFinite(candidate.y)
  )
}

const isSpline2Like = (value: unknown): value is { points: Array<{ x: number; y: number }>; closed: boolean } => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as { points?: unknown; closed?: unknown }
  if (!Array.isArray(candidate.points) || typeof candidate.closed !== 'boolean') {
    return false
  }
  return candidate.points.every((point) => {
    if (typeof point !== 'object' || point === null) {
      return false
    }
    const vec = point as { x?: unknown; y?: unknown }
    return typeof vec.x === 'number' && Number.isFinite(vec.x) && typeof vec.y === 'number' && Number.isFinite(vec.y)
  })
}

const getValueAtPath = (value: unknown, path: string[] | undefined): unknown => {
  if (path === undefined || path.length === 0) {
    return value
  }
  let current: unknown = value
  for (const segment of path) {
    if (typeof current !== 'object' || current === null) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }
  return current
}

const resolveNodeDisplayLabel = (node: SpaghettiNode): string => {
  const maybeLabel = (node as SpaghettiNode & { label?: unknown }).label
  if (typeof maybeLabel === 'string' && maybeLabel.trim().length > 0) {
    return maybeLabel.trim()
  }
  return getNodeDef(node.type)?.label ?? node.type
}

export type DriverRowWarningVm = {
  kind: 'missingPort' | 'cycle' | 'typeMismatch' | 'unresolved'
  message?: string
  blame?: 'from' | 'to' | 'both'
  reasons?: Array<'missingPort' | 'cycle' | 'typeMismatch' | 'unresolved'>
}

export type NodeInputCompositeState = {
  wholeDrivenByPortId: ReadonlySet<string>
  leafDrivenByPortIdPathKey: ReadonlySet<string>
  legacyLeafOverrideOnWhole: ReadonlySet<string>
  vec2DisplayByPortId: ReadonlyMap<string, { x: number; y: number }>
}

export type OutputPreviewSlotRowVm = {
  rowId: string
  nodeId: string
  slotId: string
  port: PortSpec
  slotStatus: 'ok' | 'unresolved' | 'empty'
  statusPrimary: string
  statusSecondary?: string
  warningMessage?: string
  isTrailingEmpty: boolean
}

export type DriverSectionGroupVm = {
  groupId: string
  label: string
  rows: DriverControlRowVm[]
}

const buildOutputPreviewSlotRows = (params: {
  node: SpaghettiNode
  incoming: readonly SpaghettiGraph['edges'][number][]
  effectiveInputPorts: readonly PortSpec[]
  nodeById: ReadonlyMap<string, SpaghettiNode>
  slotStatusById: Record<string, 'ok' | 'unresolved' | 'empty'>
  edgeStatusById: DiagnosticsVm['edgeStatusById']
}): OutputPreviewSlotRowVm[] => {
  const rawSlots = (params.node.params as { slots?: unknown }).slots
  if (!Array.isArray(rawSlots)) {
    return []
  }
  const slotIds = rawSlots
    .map((slot) => {
      if (
        typeof slot !== 'object' ||
        slot === null ||
        typeof (slot as { slotId?: unknown }).slotId !== 'string'
      ) {
        return null
      }
      const slotId = (slot as { slotId: string }).slotId
      return slotId.length > 0 ? slotId : null
    })
    .filter((slotId): slotId is string => slotId !== null)

  return slotIds.flatMap((slotId, index) => {
    const portId = `in:solid:${slotId}`
    const port = params.effectiveInputPorts.find((candidate) => candidate.portId === portId)
    if (port === undefined) {
      return []
    }
    const matchingEdges = params.incoming.filter((edge) => edge.to.portId === portId)
    const matchingEdge = matchingEdges[0]
    const slotStatus =
      params.slotStatusById[slotId] ?? (matchingEdge === undefined ? 'empty' : 'ok')

    if (matchingEdge !== undefined) {
      const upstreamNode = params.nodeById.get(matchingEdge.from.nodeId)
      const upstreamLabel =
        upstreamNode === undefined ? matchingEdge.from.nodeId : resolveNodeDisplayLabel(upstreamNode)
      const upstreamType = upstreamNode?.type ?? 'unknown'
      const unresolvedEdge = matchingEdges.find(
        (edge) => params.edgeStatusById[edge.edgeId]?.kind !== 'ok',
      )
      const warningMessage =
        unresolvedEdge === undefined
          ? undefined
          : params.edgeStatusById[unresolvedEdge.edgeId]?.message

      return [
        {
          rowId: `op-slot:${slotId}`,
          nodeId: params.node.nodeId,
          slotId,
          port,
          slotStatus,
          statusPrimary: upstreamLabel,
          statusSecondary: `${upstreamType} | ${matchingEdge.from.portId}`,
          warningMessage,
          isTrailingEmpty: false,
        },
      ]
    }

    const isTrailingEmpty = index === slotIds.length - 1
    return [
      {
        rowId: `op-slot:${slotId}`,
        nodeId: params.node.nodeId,
        slotId,
        port,
        slotStatus,
        statusPrimary: '(empty)',
        statusSecondary: isTrailingEmpty ? 'Drop part here' : undefined,
        isTrailingEmpty,
      },
    ]
  })
}

const toDriverGroups = (rows: readonly DriverControlRowVm[]): DriverSectionGroupVm[] => {
  const groups: DriverSectionGroupVm[] = []
  const groupsById = new Map<string, DriverSectionGroupVm>()
  for (const row of rows) {
    const groupId =
      row.groupLabel === undefined || row.groupLabel.length === 0 ? '__untitled__' : row.groupLabel
    const existing = groupsById.get(groupId)
    if (existing !== undefined) {
      existing.rows = [...existing.rows, row]
      continue
    }
    const created: DriverSectionGroupVm = {
      groupId,
      label: groupId === '__untitled__' ? 'Properties' : groupId,
      rows: [row],
    }
    groupsById.set(groupId, created)
    groups.push(created)
  }
  return groups
}

const toRowIndexById = <TRow extends { rowId: string }>(
  rows: readonly TRow[],
): Record<string, number> =>
  Object.fromEntries(rows.map((row, index) => [row.rowId, index]))

const toOutputEndpointIndexById = (
  rows: readonly OutputPinnedRowVm[],
): { outputEndpointIndexByRowId: Record<string, number>; outputEndpointCount: number } => {
  const endpointRows = rows.filter(
    (row): row is Extract<OutputPinnedRowVm, { kind: 'endpoint' }> => row.kind === 'endpoint',
  )
  return {
    outputEndpointIndexByRowId: toRowIndexById(endpointRows),
    outputEndpointCount: endpointRows.length,
  }
}

export type NodeVm = {
  nodeId: string
  title: string
  template?: 'part'
  uiSections?: NodeUiSection[]
  presetOptions?: string[]
  allInputs: PortSpec[]
  allOutputs: PortSpec[]
  inputPortDetails: Record<string, PortDetailLine[]>
  outputPortDetails: Record<string, PortDetailLine[]>
  driverInputPortByRowId: Record<string, PortSpec>
  driverOutputPortByRowId: Record<string, PortSpec>
  driverDrivenStateByRowId: Record<
    string,
    {
      driven: boolean
      connectionCount: number
      resolvedValue?: unknown
      unresolved: boolean
    }
  >
  driverWarningByRowId: Record<string, DriverRowWarningVm>
  inputCompositeState: NodeInputCompositeState
  featureVirtualInputStateByPortId: Record<
    string,
    {
      driven: boolean
      connectionCount: number
      unresolved: boolean
      drivenValue?: number
    }
  >
  primitiveNumberValue: number
  driverVm: ReturnType<typeof selectDriverVm>['driverVm']
  driverGroups: DriverSectionGroupVm[]
  driverRowIndexById: Record<string, number>
  featureRows: FeatureDependencyRow[]
  featureRowIndexById: Record<string, number>
  internalDependencyEdges: FeatureDependencyEdge[]
  inputRowIndexById: Record<string, number>
  outputEndpointIndexByRowId: Record<string, number>
  outputEndpointCount: number
  outputPreviewRows?: OutputPreviewSlotRowVm[]
}

export type { FeatureDependencyEdge, FeatureDependencyRow }

export type SelectNodeVmResult = {
  orderedNodeIds: string[]
  nodes: NodeVm[]
  byNodeId: Map<string, NodeVm>
}

const buildNodeVm = (
  graph: SpaghettiGraph,
  evaluation: EvaluationResult,
  diagnosticsVm?: DiagnosticsVm,
): SelectNodeVmResult => {
  const orderedNodes = graph.nodes
  const sortedEdges = [...graph.edges].sort(compareEdges)
  const byNodeId = new Map<string, NodeVm>()
  const nodes: NodeVm[] = []
  const nodeById = new Map(orderedNodes.map((node) => [node.nodeId, node]))
  const resolvedDiagnosticsVm =
    diagnosticsVm ??
    selectDiagnosticsVm({
      graph,
      evaluation,
    })

  for (const node of orderedNodes) {
    const nodeDef = getNodeDef(node.type)
    const nodeInputs = nodeDef?.inputs ?? []
    const nodeOutputs = nodeDef?.outputs ?? []
    const effectiveInputPorts = listEffectiveInputPorts(node, nodeDef)
    const incoming = sortedEdges.filter((edge) => edge.to.nodeId === node.nodeId)
    const outgoing = sortedEdges.filter((edge) => edge.from.nodeId === node.nodeId)
    const inputConnectionCountByPortId = new Map<string, number>()
    for (const edge of incoming) {
      inputConnectionCountByPortId.set(
        edge.to.portId,
        (inputConnectionCountByPortId.get(edge.to.portId) ?? 0) + 1,
      )
    }

    const wholeDrivenByPortId = new Set<string>()
    const leafDrivenByPortIdPathKey = new Set<string>()
    const firstWholeIncomingByPortId = new Map<string, SpaghettiGraph['edges'][number]>()
    const hasLeafByPortId = new Set<string>()
    const hasWholeByPortId = new Set<string>()
    for (const edge of incoming) {
      const normalizedToPath =
        edge.to.path === undefined || edge.to.path.length === 0 ? undefined : edge.to.path
      if (normalizedToPath === undefined) {
        wholeDrivenByPortId.add(edge.to.portId)
        hasWholeByPortId.add(edge.to.portId)
        if (!firstWholeIncomingByPortId.has(edge.to.portId)) {
          firstWholeIncomingByPortId.set(edge.to.portId, edge)
        }
        continue
      }
      leafDrivenByPortIdPathKey.add(leafPortPathKey(edge.to.portId, normalizedToPath))
      hasLeafByPortId.add(edge.to.portId)
    }
    const legacyLeafOverrideOnWhole = new Set<string>()
    for (const portId of hasWholeByPortId) {
      if (hasLeafByPortId.has(portId)) {
        legacyLeafOverrideOnWhole.add(portId)
      }
    }
    const vec2DisplayByPortId = new Map<string, { x: number; y: number }>()
    for (const port of nodeInputs) {
      if (port.type.kind !== 'vec2') {
        continue
      }
      const raw = node.params[port.portId]
      const literalVec = isVec2Like(raw) ? raw : { x: 0, y: 0 }
      if (!wholeDrivenByPortId.has(port.portId)) {
        vec2DisplayByPortId.set(port.portId, literalVec)
        continue
      }
      const wholeEdge = firstWholeIncomingByPortId.get(port.portId)
      if (wholeEdge === undefined) {
        vec2DisplayByPortId.set(port.portId, literalVec)
        continue
      }
      const sourceOutput =
        evaluation.outputsByNodeId[wholeEdge.from.nodeId]?.[wholeEdge.from.portId]
      const sourceValue = getValueAtPath(sourceOutput, wholeEdge.from.path)
      vec2DisplayByPortId.set(port.portId, isVec2Like(sourceValue) ? sourceValue : literalVec)
    }

    const inputPortDetails: Record<string, PortDetailLine[]> = Object.fromEntries(
      nodeInputs.map((port) => {
        const incomingForPort = incoming.filter((edge) => edge.to.portId === port.portId)
        const lines: PortDetailLine[] = [
          { text: `type: ${describePortType(port.type)}`, kind: port.type.kind },
          { text: `optional: ${port.optional === true ? 'yes' : 'no'}` },
          { text: `connections in: ${incomingForPort.length}/${port.maxConnectionsIn ?? 1}` },
        ]
        for (const edge of incomingForPort) {
          lines.push({
            text: `from: ${edge.from.nodeId}.${edge.from.portId}${
              edge.from.path === undefined ? '' : `.${endpointPathKey(edge.from.path)}`
            }`,
          })
        }
        return [port.portId, lines]
      }),
    )
    const outputPortDetails: Record<string, PortDetailLine[]> = Object.fromEntries(
      nodeOutputs.map((port) => {
        const outgoingForPort = outgoing.filter((edge) => edge.from.portId === port.portId)
        const lines: PortDetailLine[] = [
          { text: `type: ${describePortType(port.type)}`, kind: port.type.kind },
          { text: `connections out: ${outgoingForPort.length}` },
        ]
        const resolvedValue = evaluation.outputsByNodeId[node.nodeId]?.[port.portId]
        if (port.type.kind === 'spline2' && isSpline2Like(resolvedValue)) {
          const points = resolvedValue.points.slice(0, 5)
          points.forEach((point, index) => {
            lines.push({
              text: `vec2[${index + 1}]: (${formatNumber(point.x)}, ${formatNumber(point.y)})`,
              kind: 'vec2',
            })
          })
          lines.push({
            text: `closed: ${resolvedValue.closed ? 'true' : 'false'}`,
            kind: 'boolean',
          })
        }
        for (const edge of outgoingForPort) {
          lines.push({
            text: `to: ${edge.to.nodeId}.${edge.to.portId}${
              edge.to.path === undefined ? '' : `.${endpointPathKey(edge.to.path)}`
            }`,
          })
        }
        return [port.portId, lines]
      }),
    )
    const featureVirtualInputStateByPortId: Record<
      string,
      { driven: boolean; connectionCount: number; unresolved: boolean; drivenValue?: number }
    > = {}
    for (const port of effectiveInputPorts) {
      if (!isFeatureVirtualInputPortId(port.portId)) {
        continue
      }
      const connectionCount = incoming.filter(
        (edge) =>
          edge.to.portId === port.portId &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      ).length
      const resolvedValue = evaluation.inputsByNodeId[node.nodeId]?.[port.portId]
      const hasResolvedValue = typeof resolvedValue === 'number' && Number.isFinite(resolvedValue)
      featureVirtualInputStateByPortId[port.portId] = {
        driven: connectionCount > 0,
        connectionCount,
        unresolved: connectionCount > 0 && !hasResolvedValue,
        ...(hasResolvedValue ? { drivenValue: resolvedValue } : {}),
      }
    }

    const selectedDriver = selectDriverVm({
      node,
      incoming,
      effectiveInputPorts,
      resolvedInputsByPortId: evaluation.inputsByNodeId[node.nodeId],
      connectionCountByPortId: inputConnectionCountByPortId,
    })
    const orderedDriverVm =
      selectedDriver.driverVm === null
        ? null
        : (() => {
            const outputEndpointRows = selectedDriver.driverVm.outputs.filter(
              (row): row is Extract<OutputPinnedRowVm, { kind: 'endpoint' }> =>
                row.kind === 'endpoint',
            )
            const normalized = normalizePartRowOrder({
              node,
              vmDriversRowIds: buildVmRowIdsForSection(node.nodeId, selectedDriver.driverVm.drivers),
              vmInputsRowIds: buildVmRowIdsForSection(node.nodeId, selectedDriver.driverVm.inputs),
              vmOutputsRowIds: buildVmRowIdsForSection(node.nodeId, outputEndpointRows),
            })
            return {
              ...selectedDriver.driverVm,
              drivers: orderDrivers(selectedDriver.driverVm.drivers, normalized.normalized.drivers),
              inputs: orderInputs(selectedDriver.driverVm.inputs, normalized.normalized.inputs),
              outputs: orderOutputsEndpointRowsKeepingReservedFixed(
                selectedDriver.driverVm.outputs,
                normalized.normalized.outputs,
              ),
            }
          })()
    const driverGroups = toDriverGroups(orderedDriverVm?.drivers ?? [])
    const driverRowIndexById = toRowIndexById(orderedDriverVm?.drivers ?? [])
    const featureStack = readFeatureStack(node.params.featureStack)
    const dependencyGraph = analyzeFeatureDependencyGraph(featureStack, {
      driverLinks:
        orderedDriverVm?.drivers.flatMap((row) => {
          if (
            row.kind !== 'featureParam' ||
            row.numberInput.change.kind !== 'featureParam' ||
            row.numberInput.change.featureParamKind !== 'firstExtrudeDepth' ||
            row.numberInput.change.featureId === undefined
          ) {
            return []
          }
          return [
            {
              rowId: row.rowId,
              targetFeatureId: row.numberInput.change.featureId,
            },
          ]
        }) ?? [],
    })
    const featureRowIndexById = toRowIndexById(dependencyGraph.featureRows)
    const inputRowIndexById = toRowIndexById(orderedDriverVm?.inputs ?? [])
    const { outputEndpointIndexByRowId, outputEndpointCount } = toOutputEndpointIndexById(
      orderedDriverVm?.outputs ?? [],
    )

    const driverWarningByRowId: Record<string, DriverRowWarningVm> = {}
    for (const [rowId, inputPort] of Object.entries(selectedDriver.driverInputPortByRowId)) {
      const wholeIncomingForDriver = incoming.filter(
        (edge) =>
          edge.to.portId === inputPort.portId &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )
      if (wholeIncomingForDriver.length === 0) {
        continue
      }
      const primaryEdge = wholeIncomingForDriver[0]
      if (primaryEdge === undefined) {
        continue
      }

      const statuses = wholeIncomingForDriver
        .map((edge) => resolvedDiagnosticsVm.edgeStatusById[edge.edgeId])
        .filter((status): status is NonNullable<typeof status> => status !== undefined)
      const primaryStatus = resolvedDiagnosticsVm.edgeStatusById[primaryEdge.edgeId]
      const allReasons = EDGE_REASON_ORDER.filter((reason) =>
        statuses.some(
          (status) => status.reasons?.includes(reason) === true || status.kind === reason,
        ),
      )
      const primaryKind = primaryStatus?.kind ?? 'ok'
      const winningKind = reasonKindForStatus(allReasons, primaryKind)
      if (winningKind === null) {
        continue
      }

      const firstMessage =
        primaryStatus?.message ??
        statuses.find((status) => typeof status.message === 'string' && status.message.length > 0)
          ?.message
      const combinedMessage =
        wholeIncomingForDriver.length > 1 && firstMessage !== undefined
          ? `${firstMessage} (multiple incoming driver edges; first edge "${primaryEdge.edgeId}" selected)`
          : firstMessage

      driverWarningByRowId[rowId] = {
        kind: winningKind,
        message: combinedMessage,
        blame: primaryStatus?.blame,
        reasons: allReasons.length > 0 ? allReasons : [winningKind],
      }
    }

    const outputPreviewRows =
      node.type === OUTPUT_PREVIEW_NODE_TYPE
        ? buildOutputPreviewSlotRows({
            node,
            incoming,
            effectiveInputPorts,
            nodeById,
            slotStatusById: resolvedDiagnosticsVm.slotStatus,
            edgeStatusById: resolvedDiagnosticsVm.edgeStatusById,
          })
        : undefined

    const nodeVm: NodeVm = {
      nodeId: node.nodeId,
      title: nodeDef?.label ?? node.type,
      template: nodeDef?.template,
      uiSections: nodeDef?.uiSections,
      presetOptions: nodeDef?.presetOptions,
      allInputs: node.type === OUTPUT_PREVIEW_NODE_TYPE ? effectiveInputPorts : nodeInputs,
      allOutputs: nodeOutputs,
      inputPortDetails,
      outputPortDetails,
      driverInputPortByRowId: selectedDriver.driverInputPortByRowId,
      driverOutputPortByRowId: selectedDriver.driverOutputPortByRowId,
      driverDrivenStateByRowId: selectedDriver.driverDrivenStateByRowId,
      driverWarningByRowId,
      inputCompositeState: {
        wholeDrivenByPortId,
        leafDrivenByPortIdPathKey,
        legacyLeafOverrideOnWhole,
        vec2DisplayByPortId,
      },
      featureVirtualInputStateByPortId,
      primitiveNumberValue:
        node.type === 'Primitive/Number' && typeof node.params.value === 'number'
          ? node.params.value
          : 0,
      driverVm: orderedDriverVm,
      driverGroups,
      driverRowIndexById,
      featureRows: dependencyGraph.featureRows,
      featureRowIndexById,
      internalDependencyEdges: dependencyGraph.edges,
      inputRowIndexById,
      outputEndpointIndexByRowId,
      outputEndpointCount,
      outputPreviewRows,
    }
    byNodeId.set(node.nodeId, nodeVm)
    nodes.push(nodeVm)
  }

  return {
    orderedNodeIds: orderedNodes.map((node) => node.nodeId),
    nodes,
    byNodeId,
  }
}

let lastGraph: SpaghettiGraph | undefined
let lastEvaluation: EvaluationResult | undefined
let lastDiagnosticsVmArg: DiagnosticsVm | undefined
let lastNodeVmResult: SelectNodeVmResult | undefined

export const selectNodeVm = (
  graph: SpaghettiGraph,
  evaluation: EvaluationResult,
  diagnosticsVm?: DiagnosticsVm,
): SelectNodeVmResult => {
  if (
    lastNodeVmResult !== undefined &&
    lastGraph === graph &&
    lastEvaluation === evaluation &&
    lastDiagnosticsVmArg === diagnosticsVm
  ) {
    return lastNodeVmResult
  }
  const next = buildNodeVm(graph, evaluation, diagnosticsVm)
  lastGraph = graph
  lastEvaluation = evaluation
  lastDiagnosticsVmArg = diagnosticsVm
  lastNodeVmResult = next
  return next
}
