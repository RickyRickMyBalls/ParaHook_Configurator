import type { EvaluationResult } from '../compiler/evaluateGraph'
import {
  listEffectiveInputPorts,
  listEffectiveOutputPorts,
} from '../features/effectivePorts'
import {
  buildExtrudeBodyMemberPortId,
} from '../features/extrudeBodyVirtualPorts'
import {
  classifyExtrudeProfileContributorEdge,
  type ExtrudeProfileContributor,
} from '../features/extrudeProfileConnections'
import { listSketchProfileMemberOutputPorts } from '../features/sketchProfileVirtualPorts'
import { buildExtrudeProfileEntryPortId } from '../features/extrudeProfileEntryPorts'
import { readFeatureStack } from '../features/featureSchema'
import {
  analyzeFeatureDependencyGraph,
  type FeatureDependencyEdge,
  type FeatureDependencyRow,
} from '../features/featureDependencies'
import { isFeatureVirtualInputPortId } from '../features/featureVirtualPorts'
import { getNodeDef, type NodeUiSection } from '../registry/nodeRegistry'
import {
  readGeometryExtrudeBodyGenerationModeFromParams,
  mapWholeNumberToGeometryExtrudeDirection,
  mapWholeNumberToGeometryExtrudeType,
  readGeometryExtrudeDirectionFromParams,
  readGeometryExtrudeTaperAngleDegFromParams,
  readGeometryExtrudeTypeFromParams,
  type GeometryExtrudeBodyGenerationMode,
  type GeometryExtrudeDirection,
  type GeometryExtrudeType,
} from '../registry/nodeRegistry'
import type { PortSpec, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import {
  normalizeOutputPreviewParams,
  OUTPUT_PREVIEW_NODE_TYPE,
} from '../system/outputPreviewNode'
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

const describePortType = (type: PortSpec['type']): string =>
  type.unit === undefined ? type.kind : `${type.kind}:${type.unit}`

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? value.toString() : value.toFixed(3)

const formatMaxConnectionsIn = (value: number | undefined): string =>
  value === Number.MAX_SAFE_INTEGER ? 'unbounded' : (value ?? 1).toString()

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

const isBooleanLike = (value: unknown): value is boolean => typeof value === 'boolean'

const isSketchPlaneLike = (value: unknown): value is 'XY' | 'YZ' | 'XZ' =>
  value === 'XY' || value === 'YZ' || value === 'XZ'

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

const isProfileOutputLike = (
  value: unknown,
): value is {
  profileId: string
  profileIndex: number
  area: number
} => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as { profileId?: unknown; profileIndex?: unknown; area?: unknown }
  return (
    typeof candidate.profileId === 'string' &&
    candidate.profileId.length > 0 &&
    typeof candidate.profileIndex === 'number' &&
    Number.isFinite(candidate.profileIndex) &&
    typeof candidate.area === 'number' &&
    Number.isFinite(candidate.area)
  )
}

const isSketchProfilesLike = (
  value: unknown,
): value is Array<{
  profileId: string
  profileIndex: number
  area: number
}> => Array.isArray(value) && value.every((entry) => isProfileOutputLike(entry))

const isSolidBodyLike = (value: unknown): value is { bodyId: string } =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { bodyId?: unknown }).bodyId === 'string'

const isSolidBodiesLike = (
  value: unknown,
): value is { bodies: unknown[] } =>
  typeof value === 'object' &&
  value !== null &&
  Array.isArray((value as { bodies?: unknown }).bodies)

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
  objectId?: string
  objectLabel?: string
  inputLabel?: string
  port: PortSpec
  slotStatus: 'ok' | 'unresolved' | 'empty'
  statusPrimary: string
  statusSecondary?: string
  publishedObjectRows?: Array<{
    rowId: string
    label: string
    status: string
  }>
  warningMessage?: string
  isTrailingEmpty: boolean
}

export type DriverSectionGroupVm = {
  groupId: string
  label: string
  rows: DriverControlRowVm[]
}

export type UtilityNodeVm =
  | {
      source: 'param' | 'legacyPrimitive'
      kind: 'paramNumber'
      value: number
      outputPort: PortSpec
    }
  | {
      source: 'param'
      kind: 'paramBoolean'
      value: boolean
      outputPort: PortSpec
    }
  | {
      source: 'param' | 'legacyPrimitive'
      kind: 'paramVec2'
      value: { x: number; y: number }
      outputPort: PortSpec
    }

export type SketchNodeVm = {
  localPlane: 'XY' | 'YZ' | 'XZ'
  effectivePlane: 'XY' | 'YZ' | 'XZ'
  planeDriven: boolean
  profileCount: number
  hasSelectedProfile: boolean
}

export type ExtrudeNodeVm = {
  profileInputEntries?: Array<{
    entryId: string
    endpointPortId: string
    kind: 'aggregate' | 'single'
    label: 'SketchProfiles' | 'SketchProfile'
    sourceNodeId: string
    sourceNodeLabel: string
    profileId?: string
  }>
  extrudeType: GeometryExtrudeType
  bodyGenerationMode?: GeometryExtrudeBodyGenerationMode
  localExtrudeType?: GeometryExtrudeType
  typeDriven?: boolean
  extrudeDirection: GeometryExtrudeDirection
  localExtrudeDirection?: GeometryExtrudeDirection
  directionDriven?: boolean
  localDepthMm: number
  effectiveDepthMm: number
  depthVisible: boolean
  depthDriven: boolean
  localStartDepthMm: number
  effectiveStartDepthMm: number
  startDepthVisible: boolean
  startDepthDriven: boolean
  localEndDepthMm: number
  effectiveEndDepthMm: number
  endDepthVisible: boolean
  endDepthDriven: boolean
  localTaperAngleDeg?: number
  effectiveTaperAngleDeg?: number
  taperVisible: boolean
  taperDriven?: boolean
  hasProfile: boolean
  profileTargetMode?: 'single' | 'allFromSketch'
  profileCount?: number
  profileId?: string
  profileArea?: number
  bodyId?: string
  bodyCount?: number
  bodyMemberPortIds?: string[]
}

const buildExpectedExtrudeBodyMemberPortIds = (params: {
  bodyGenerationMode: GeometryExtrudeBodyGenerationMode
  resolvedBodyCount: number
  resolvedAggregateProfiles: ReadonlyArray<unknown> | null
  resolvedSingleProfile: unknown | null
  validProfileIncoming: ReadonlyArray<{
    edge: SpaghettiGraph['edges'][number]
    contributor: ExtrudeProfileContributor
  }>
}): string[] => {
  if (params.bodyGenerationMode !== 'NewObjects') {
    return []
  }
  const expectedCount =
    params.resolvedBodyCount > 0
      ? params.resolvedBodyCount
      : params.resolvedAggregateProfiles !== null
        ? params.resolvedAggregateProfiles.length
        : params.resolvedSingleProfile !== null
          ? 1
          : params.validProfileIncoming.filter((entry) => entry.contributor.kind === 'single').length
  return Array.from({ length: expectedCount }, (_, memberIndex) =>
    buildExtrudeBodyMemberPortId(memberIndex),
  )
}

const buildOutputPreviewSlotRows = (params: {
  node: SpaghettiNode
  incoming: readonly SpaghettiGraph['edges'][number][]
  effectiveInputPorts: readonly PortSpec[]
  nodeById: ReadonlyMap<string, SpaghettiNode>
  evaluation: EvaluationResult
  slotStatusById: Record<string, 'ok' | 'unresolved' | 'empty'>
  edgeStatusById: DiagnosticsVm['edgeStatusById']
}): OutputPreviewSlotRowVm[] => {
  const normalizedOutputPreviewParams = normalizeOutputPreviewParams(
    params.node.params as Record<string, unknown>,
  )
  const objectBySlotId = new Map(
    normalizedOutputPreviewParams.objects.map((objectRow) => [objectRow.slotId, objectRow] as const),
  )
  const slotBySlotId = new Map(
    normalizedOutputPreviewParams.slots.map((slot) => [slot.slotId, slot] as const),
  )
  const slotIds = normalizedOutputPreviewParams.slots.map((slot) => slot.slotId)

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
      const objectRow = objectBySlotId.get(slotId)
      const publicationMode = slotBySlotId.get(slotId)?.publicationMode ?? 'grouped'
      const sourceOutputPort = upstreamNode
        ? listEffectiveOutputPorts(upstreamNode).find(
            (candidate) => candidate.portId === matchingEdge.from.portId,
          )
        : undefined
      const sourceKind = sourceOutputPort?.type.kind ?? 'unknown'
      const sourceValue =
        params.evaluation.outputsByNodeId[matchingEdge.from.nodeId]?.[matchingEdge.from.portId]
      const splitMemberCount =
        sourceKind === 'solidBodies' && publicationMode === 'split'
          ? Math.max(1, isSolidBodiesLike(sourceValue) ? sourceValue.bodies.length : 1)
          : 1
      const objectLabel = objectRow?.label ?? slotId
      const inputLabel = sourceKind === 'solidBodies' ? `${slotId} Collection` : objectLabel
      const sourceContractLabel =
        sourceKind === 'solidBodies'
          ? 'SolidBodies collection'
          : sourceKind === 'solidBody'
            ? 'SolidBody source'
            : sourceKind === 'toeLoft'
              ? 'toeLoft source'
              : `${sourceKind} source`
      const publicationSummary =
        sourceKind === 'solidBodies' && publicationMode === 'split'
          ? `publishes ${splitMemberCount} objects through split publication`
          : publicationMode === 'grouped'
            ? `publishes ${sourceKind === 'solidBodies' ? 'one grouped object' : 'one object'}`
            : 'publishes one object'
      const publishedObjectRows =
        sourceKind === 'solidBodies' && publicationMode === 'split'
          ? Array.from({ length: splitMemberCount }, (_, memberIndex) => ({
              rowId: `op-slot:${slotId}:published:${memberIndex + 1}`,
              label: `${objectLabel} ${memberIndex + 1}`,
              status: `Published object ${memberIndex + 1} from this split collection source.`,
            }))
          : undefined
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
          objectId: objectRow?.objectId,
          objectLabel,
          inputLabel,
          port,
          slotStatus,
          statusPrimary: upstreamLabel,
          statusSecondary: `${slotId} takes one ${sourceContractLabel} on ${matchingEdge.from.portId} and ${publicationSummary}.`,
          publishedObjectRows,
          warningMessage,
          isTrailingEmpty: false,
        },
      ]
    }

    const isTrailingEmpty = index === slotIds.length - 1
    const objectRow = objectBySlotId.get(slotId)
    return [
      {
        rowId: `op-slot:${slotId}`,
        nodeId: params.node.nodeId,
        slotId,
        objectId: objectRow?.objectId,
        objectLabel: objectRow?.label ?? slotId,
        inputLabel: slotId,
        port,
        slotStatus,
        statusPrimary: '(empty)',
        statusSecondary: isTrailingEmpty ? `${slotId} | Drop part here` : slotId,
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
  template?: 'part' | 'sketch' | 'extrude'
  utilityVm?: UtilityNodeVm
  sketchVm?: SketchNodeVm
  extrudeVm?: ExtrudeNodeVm
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
  driverVm: ReturnType<typeof selectDriverVm>['driverVm']
  driverGroups: DriverSectionGroupVm[]
  driverRowIndexById: Record<string, number>
  featureRows: FeatureDependencyRow[]
  featureRowIndexById: Record<string, number>
  internalDependencyEdges: FeatureDependencyEdge[]
  inputRowIndexById: Record<string, number>
  outputEndpointIndexByRowId: Record<string, number>
  outputEndpointCount: number
  outputPreviewComponentLabel?: string
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
    const nodeOutputs =
      node.type === 'Geometry/Sketch'
        ? [...(nodeDef?.outputs ?? []), ...listSketchProfileMemberOutputPorts(node)]
        : node.type === 'Geometry/Extrude'
          ? listEffectiveOutputPorts(node, nodeDef, graph).filter(
              (port) => !port.portId.startsWith('out:drv:') && !port.portId.startsWith('drv:'),
            )
          : (nodeDef?.outputs ?? [])
    const effectiveInputPorts = listEffectiveInputPorts(node, nodeDef)
    const incoming = graph.edges.filter((edge) => edge.to.nodeId === node.nodeId)
    const outgoing = graph.edges.filter((edge) => edge.from.nodeId === node.nodeId)
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
          { text: `connections in: ${incomingForPort.length}/${formatMaxConnectionsIn(port.maxConnectionsIn)}` },
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
        if (port.type.kind === 'number' && typeof resolvedValue === 'number' && Number.isFinite(resolvedValue)) {
          lines.push({
            text: `value: ${formatNumber(resolvedValue)}`,
            kind: 'number',
          })
        }
        if (port.type.kind === 'boolean' && typeof resolvedValue === 'boolean') {
          lines.push({
            text: `value: ${resolvedValue ? 'true' : 'false'}`,
            kind: 'boolean',
          })
        }
        if (port.type.kind === 'vec2' && isVec2Like(resolvedValue)) {
          lines.push({
            text: `value: (${formatNumber(resolvedValue.x)}, ${formatNumber(resolvedValue.y)})`,
            kind: 'vec2',
          })
        }
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
    const sketchVm = (() : SketchNodeVm | undefined => {
      if (node.type !== 'Geometry/Sketch') {
        return undefined
      }

      const rawSketch = node.params.sketch
      const localPlane =
        typeof rawSketch === 'object' &&
        rawSketch !== null &&
        isSketchPlaneLike((rawSketch as { plane?: unknown }).plane)
          ? (rawSketch as { plane: 'XY' | 'YZ' | 'XZ' }).plane
          : 'XY'
      const planeInput = evaluation.inputsByNodeId[node.nodeId]?.SketchPlane
      const effectivePlane = isSketchPlaneLike(planeInput) ? planeInput : localPlane
      const profileOutput = evaluation.outputsByNodeId[node.nodeId]?.SketchProfiles
      const selectedProfile = evaluation.outputsByNodeId[node.nodeId]?.SketchProfile
      const wholeIncomingForPlane = incoming.filter(
        (edge) =>
          edge.to.portId === 'SketchPlane' &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )

      return {
        localPlane,
        effectivePlane,
        planeDriven: wholeIncomingForPlane.length > 0,
        profileCount: isSketchProfilesLike(profileOutput) ? profileOutput.length : 0,
        hasSelectedProfile: isProfileOutputLike(selectedProfile),
      }
    })()
    const extrudeVm = (() : ExtrudeNodeVm | undefined => {
      if (node.type !== 'Geometry/Extrude') {
        return undefined
      }

      const rawType = readGeometryExtrudeTypeFromParams(node.params)
      const bodyGenerationMode = readGeometryExtrudeBodyGenerationModeFromParams(node.params)
      const wholeIncomingForType = incoming.filter(
        (edge) =>
          edge.to.portId === 'Type' &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )
      const typeInput = evaluation.inputsByNodeId[node.nodeId]?.Type
      const effectiveType =
        wholeIncomingForType.length > 0 &&
        typeof typeInput === 'number' &&
        Number.isFinite(typeInput)
          ? mapWholeNumberToGeometryExtrudeType(typeInput)
          : rawType
      const rawDirection = readGeometryExtrudeDirectionFromParams(node.params)
      const wholeIncomingForDirection = incoming.filter(
        (edge) =>
          edge.to.portId === 'Direction' &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )
      const directionInput = evaluation.inputsByNodeId[node.nodeId]?.Direction
      const effectiveDirection =
        wholeIncomingForDirection.length > 0 &&
        typeof directionInput === 'number' &&
        Number.isFinite(directionInput)
          ? mapWholeNumberToGeometryExtrudeDirection(directionInput)
          : rawDirection
      const rawDepth = node.params.depthMm
      const localDepthMm =
        typeof rawDepth === 'number' && Number.isFinite(rawDepth) ? rawDepth : 20
      const depthInput = evaluation.inputsByNodeId[node.nodeId]?.Depth
      const effectiveDepthMm =
        typeof depthInput === 'number' && Number.isFinite(depthInput) ? depthInput : localDepthMm
      const rawStartDepth = node.params.startDepthMm
      const localStartDepthMm =
        typeof rawStartDepth === 'number' && Number.isFinite(rawStartDepth)
          ? rawStartDepth
          : localDepthMm
      const startDepthInput = evaluation.inputsByNodeId[node.nodeId]?.StartDepth
      const effectiveStartDepthMm =
        typeof startDepthInput === 'number' && Number.isFinite(startDepthInput)
          ? startDepthInput
          : localStartDepthMm
      const rawEndDepth = node.params.endDepthMm
      const localEndDepthMm =
        typeof rawEndDepth === 'number' && Number.isFinite(rawEndDepth)
          ? rawEndDepth
          : localDepthMm
      const endDepthInput = evaluation.inputsByNodeId[node.nodeId]?.EndDepth
      const effectiveEndDepthMm =
        typeof endDepthInput === 'number' && Number.isFinite(endDepthInput)
          ? endDepthInput
          : localEndDepthMm
      const localTaperAngleDeg = readGeometryExtrudeTaperAngleDegFromParams(node.params)
      const taperAngleInput = evaluation.inputsByNodeId[node.nodeId]?.TaperAngle
      const effectiveTaperAngleDeg =
        typeof taperAngleInput === 'number' && Number.isFinite(taperAngleInput)
          ? taperAngleInput
          : localTaperAngleDeg
      const profileInput = evaluation.inputsByNodeId[node.nodeId]?.ExtrusionProfile
      const profileOutput = evaluation.outputsByNodeId[node.nodeId]?.SolidBody
      const resolvedBodyId = isSolidBodyLike(profileOutput)
        ? profileOutput.bodyId
        : isSolidBodiesLike(profileOutput)
          ? (profileOutput.bodies.find((entry) => isSolidBodyLike(entry)) as
              | { bodyId: string }
              | undefined)?.bodyId
          : undefined
      const resolvedBodyCount = isSolidBodiesLike(profileOutput)
        ? profileOutput.bodies.length
        : isSolidBodyLike(profileOutput)
          ? 1
          : 0
      const wholeIncomingForProfile = incoming.filter(
        (edge) =>
          edge.to.portId === 'ExtrusionProfile' &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )
      const validProfileIncoming = wholeIncomingForProfile
        .map((edge) => {
          const contributor = classifyExtrudeProfileContributorEdge(edge)
          return contributor === null ? null : { edge, contributor }
        })
        .filter(
          (
            entry,
          ): entry is { edge: SpaghettiGraph['edges'][number]; contributor: ExtrudeProfileContributor } =>
            entry !== null,
        )
      const resolvedSingleProfile = isProfileOutputLike(profileInput) ? profileInput : null
      const aggregateProfileSourceNodeId = validProfileIncoming.find(
        (entry) => entry.contributor.kind === 'aggregate',
      )?.edge.from.nodeId
      const aggregateProfilesFromSource =
        aggregateProfileSourceNodeId === undefined
          ? null
          : evaluation.outputsByNodeId[aggregateProfileSourceNodeId]?.SketchProfiles
      const resolvedAggregateProfiles = isSketchProfilesLike(profileInput)
        ? profileInput
        : isSketchProfilesLike(aggregateProfilesFromSource)
          ? aggregateProfilesFromSource
          : null
      const aggregateProfileWired = validProfileIncoming.some(
        (entry) => entry.contributor.kind === 'aggregate',
      )
      const singleProfileWired = validProfileIncoming.some(
        (entry) => entry.contributor.kind === 'single',
      )
      const profileTargetMode =
        resolvedAggregateProfiles !== null || aggregateProfileWired
          ? 'allFromSketch'
          : resolvedSingleProfile !== null || singleProfileWired
            ? 'single'
            : undefined
      const profileCount =
        resolvedAggregateProfiles !== null
          ? resolvedAggregateProfiles.length
          : resolvedSingleProfile !== null
            ? 1
            : 0
      const bodyMemberPortIds = buildExpectedExtrudeBodyMemberPortIds({
        bodyGenerationMode,
        resolvedBodyCount,
        resolvedAggregateProfiles,
        resolvedSingleProfile,
        validProfileIncoming,
      })
      const hasResolvedProfileTarget =
        resolvedSingleProfile !== null ||
        (resolvedAggregateProfiles !== null && resolvedAggregateProfiles.length > 0)
      const profileInputEntries = validProfileIncoming
        .map(({ edge, contributor }) => {
          const sourceNode = nodeById.get(edge.from.nodeId)
          return {
            entryId: edge.edgeId,
            endpointPortId: buildExtrudeProfileEntryPortId(edge.edgeId),
            kind: contributor.kind,
            label: contributor.label,
            sourceNodeId: edge.from.nodeId,
            sourceNodeLabel:
              sourceNode === undefined ? edge.from.nodeId : resolveNodeDisplayLabel(sourceNode),
            ...(contributor.profileId !== undefined ? { profileId: contributor.profileId } : {}),
          }
        })
      const wholeIncomingForDepth = incoming.filter(
        (edge) =>
          edge.to.portId === 'Depth' &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )
      const wholeIncomingForStartDepth = incoming.filter(
        (edge) =>
          edge.to.portId === 'StartDepth' &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )
      const wholeIncomingForEndDepth = incoming.filter(
        (edge) =>
          edge.to.portId === 'EndDepth' &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )
      const wholeIncomingForTaperAngle = incoming.filter(
        (edge) =>
          edge.to.portId === 'TaperAngle' &&
          (edge.to.path === undefined || edge.to.path.length === 0),
      )
      return {
        extrudeType: effectiveType,
        bodyGenerationMode,
        localExtrudeType: rawType,
        typeDriven: wholeIncomingForType.length > 0,
        extrudeDirection: effectiveDirection,
        localExtrudeDirection: rawDirection,
        directionDriven: wholeIncomingForDirection.length > 0,
        localDepthMm,
        effectiveDepthMm,
        depthVisible: effectiveDirection !== 'TwoSides',
        depthDriven: wholeIncomingForDepth.length > 0,
        localStartDepthMm,
        effectiveStartDepthMm,
        startDepthVisible: effectiveDirection === 'TwoSides',
        startDepthDriven: wholeIncomingForStartDepth.length > 0,
        localEndDepthMm,
        effectiveEndDepthMm,
        endDepthVisible: effectiveDirection === 'TwoSides',
        endDepthDriven: wholeIncomingForEndDepth.length > 0,
        localTaperAngleDeg,
        effectiveTaperAngleDeg,
        taperVisible: effectiveType === 'Body' && effectiveDirection === 'OneSide',
        taperDriven: wholeIncomingForTaperAngle.length > 0,
        hasProfile: hasResolvedProfileTarget,
        ...(profileInputEntries.length > 0 ? { profileInputEntries } : {}),
        ...(profileTargetMode !== undefined ? { profileTargetMode } : {}),
        ...(profileCount > 0 ? { profileCount } : {}),
        ...(resolvedSingleProfile !== null
          ? {
              profileId: resolvedSingleProfile.profileId,
              profileArea: resolvedSingleProfile.area,
            }
          : {}),
        ...(resolvedBodyId !== undefined ? { bodyId: resolvedBodyId } : {}),
        ...(resolvedBodyCount > 0 ? { bodyCount: resolvedBodyCount } : {}),
        ...(bodyMemberPortIds.length > 0 ? { bodyMemberPortIds } : {}),
      }
    })()
    const utilityVm = (() : UtilityNodeVm | undefined => {
      const valuePort = nodeOutputs.find((port) => port.portId === 'value')
      if (valuePort === undefined) {
        return undefined
      }

      if (node.type === 'Param/Number' || node.type === 'Primitive/Number') {
        const rawValue = node.params.value
        return {
          source: node.type === 'Param/Number' ? 'param' : 'legacyPrimitive',
          kind: 'paramNumber',
          value: typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : 0,
          outputPort: valuePort,
        }
      }

      if (node.type === 'Param/Boolean') {
        return {
          source: 'param',
          kind: 'paramBoolean',
          value: isBooleanLike(node.params.value) ? node.params.value : false,
          outputPort: valuePort,
        }
      }

      if (node.type === 'Param/Vec2' || node.type === 'Primitive/Vec2') {
        const rawValue =
          node.type === 'Param/Vec2'
            ? node.params.value
            : {
                x: node.params.x,
                y: node.params.y,
              }
        return {
          source: node.type === 'Param/Vec2' ? 'param' : 'legacyPrimitive',
          kind: 'paramVec2',
          value: isVec2Like(rawValue) ? rawValue : { x: 0, y: 0 },
          outputPort: valuePort,
        }
      }

      return undefined
    })()
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
            evaluation,
            slotStatusById: resolvedDiagnosticsVm.slotStatus,
            edgeStatusById: resolvedDiagnosticsVm.edgeStatusById,
          })
        : undefined
    const outputPreviewComponentLabel =
      node.type === OUTPUT_PREVIEW_NODE_TYPE
        ? normalizeOutputPreviewParams(node.params as Record<string, unknown>).componentLabel
        : undefined

    const nodeVm: NodeVm = {
      nodeId: node.nodeId,
      title: nodeDef?.label ?? node.type,
      template: nodeDef?.template,
      utilityVm,
      sketchVm,
      extrudeVm,
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
      driverVm: orderedDriverVm,
      driverGroups,
      driverRowIndexById,
      featureRows: dependencyGraph.featureRows,
      featureRowIndexById,
      internalDependencyEdges: dependencyGraph.edges,
      inputRowIndexById,
      outputEndpointIndexByRowId,
      outputEndpointCount,
      outputPreviewComponentLabel,
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
