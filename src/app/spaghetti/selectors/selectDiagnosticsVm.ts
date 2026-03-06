import type { EvaluationResult } from '../compiler/evaluateGraph'
import type { GraphValidationResult, SpaghettiDiagnostic } from '../compiler/validateGraph'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

const compareDiagnostics = (a: SpaghettiDiagnostic, b: SpaghettiDiagnostic): number =>
  (a.nodeId ?? '').localeCompare(b.nodeId ?? '') ||
  (a.edgeId ?? '').localeCompare(b.edgeId ?? '') ||
  a.code.localeCompare(b.code) ||
  a.message.localeCompare(b.message)

const uniqDiagnostics = (
  diagnostics: readonly SpaghettiDiagnostic[],
): SpaghettiDiagnostic[] => {
  const deduped = new Map<string, SpaghettiDiagnostic>()
  for (const diagnostic of diagnostics) {
    const key = [
      diagnostic.level,
      diagnostic.code,
      diagnostic.message,
      diagnostic.nodeId ?? '',
      diagnostic.edgeId ?? '',
    ].join('::')
    if (!deduped.has(key)) {
      deduped.set(key, diagnostic)
    }
  }
  return [...deduped.values()].sort(compareDiagnostics)
}

export type EdgeDiagnosticReason = 'missingPort' | 'cycle' | 'typeMismatch' | 'unresolved'
export type EdgeDiagnosticKind = 'ok' | EdgeDiagnosticReason

const EDGE_REASON_ORDER: EdgeDiagnosticReason[] = [
  'missingPort',
  'cycle',
  'typeMismatch',
  'unresolved',
]

const EDGE_CYCLE_EXCLUDED_CODES = new Set([
  'FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED',
  'DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED',
  'FEATURE_WIRE_INTRA_NODE_UNSUPPORTED',
])

const EDGE_MISSING_PORT_CODES = new Set([
  'EDGE_FROM_NODE_MISSING',
  'EDGE_TO_NODE_MISSING',
  'NODE_TYPE_UNKNOWN',
  'EDGE_FROM_PORT_MISSING',
  'EDGE_TO_PORT_MISSING',
  'EDGE_FROM_PATH_INVALID',
  'EDGE_FROM_PATH_NOT_LEAF',
  'EDGE_TO_PATH_INVALID',
  'EDGE_TO_PATH_NOT_LEAF',
])

const EDGE_TYPE_MISMATCH_CODES = new Set(['EDGE_TYPE_MISMATCH'])

const EDGE_UNRESOLVED_CODES = new Set([
  'INPUT_SOURCE_VALUE_MISSING',
  'EDGE_TO_PATH_DUPLICATE',
  'EDGE_TO_MAX_CONNECTIONS',
])

const parseCycleNodesFromMessage = (message: string): Set<string> => {
  const marker = 'Cycle detected involving nodes:'
  const markerIndex = message.indexOf(marker)
  if (markerIndex < 0) {
    return new Set<string>()
  }
  const trailing = message.slice(markerIndex + marker.length).trim()
  const rawList = trailing.endsWith('.') ? trailing.slice(0, -1) : trailing
  const ids = rawList
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
  return new Set(ids)
}

const toReasonForDiagnostic = (
  diagnostic: SpaghettiDiagnostic,
): {
  reason: EdgeDiagnosticReason | null
  blame?: 'from' | 'to' | 'both'
} => {
  if (diagnostic.code === 'GRAPH_CYCLE_DETECTED') {
    return {
      reason: 'cycle',
      blame: 'both',
    }
  }
  if (EDGE_MISSING_PORT_CODES.has(diagnostic.code)) {
    if (
      diagnostic.code === 'EDGE_FROM_NODE_MISSING' ||
      diagnostic.code === 'EDGE_FROM_PORT_MISSING' ||
      diagnostic.code === 'EDGE_FROM_PATH_INVALID' ||
      diagnostic.code === 'EDGE_FROM_PATH_NOT_LEAF'
    ) {
      return { reason: 'missingPort', blame: 'from' }
    }
    if (
      diagnostic.code === 'EDGE_TO_NODE_MISSING' ||
      diagnostic.code === 'EDGE_TO_PORT_MISSING' ||
      diagnostic.code === 'EDGE_TO_PATH_INVALID' ||
      diagnostic.code === 'EDGE_TO_PATH_NOT_LEAF'
    ) {
      return { reason: 'missingPort', blame: 'to' }
    }
    return { reason: 'missingPort', blame: 'both' }
  }
  if (EDGE_TYPE_MISMATCH_CODES.has(diagnostic.code)) {
    return {
      reason: 'typeMismatch',
      blame: 'both',
    }
  }
  if (EDGE_UNRESOLVED_CODES.has(diagnostic.code)) {
    if (diagnostic.code === 'INPUT_SOURCE_VALUE_MISSING') {
      return { reason: 'unresolved', blame: 'from' }
    }
    return { reason: 'unresolved', blame: 'to' }
  }
  if (diagnostic.edgeId !== undefined) {
    return { reason: 'unresolved', blame: 'both' }
  }
  return { reason: null }
}

type EdgeStatusAccumulator = {
  reasons: Set<EdgeDiagnosticReason>
  messageByReason: Map<EdgeDiagnosticReason, string>
  blameByReason: Map<EdgeDiagnosticReason, 'from' | 'to' | 'both'>
}

const createEdgeStatusAccumulator = (): EdgeStatusAccumulator => ({
  reasons: new Set<EdgeDiagnosticReason>(),
  messageByReason: new Map<EdgeDiagnosticReason, string>(),
  blameByReason: new Map<EdgeDiagnosticReason, 'from' | 'to' | 'both'>(),
})

const addReasonToAccumulator = (
  accumulator: EdgeStatusAccumulator,
  reason: EdgeDiagnosticReason,
  diagnostic: SpaghettiDiagnostic,
  blame: 'from' | 'to' | 'both',
): void => {
  accumulator.reasons.add(reason)
  if (!accumulator.messageByReason.has(reason)) {
    accumulator.messageByReason.set(reason, diagnostic.message)
  }
  if (!accumulator.blameByReason.has(reason)) {
    accumulator.blameByReason.set(reason, blame)
  }
}

const toSortedReasonList = (
  reasons: ReadonlySet<EdgeDiagnosticReason>,
): EdgeDiagnosticReason[] =>
  EDGE_REASON_ORDER.filter((reason) => reasons.has(reason))

const toWinningReason = (
  reasons: ReadonlySet<EdgeDiagnosticReason>,
): EdgeDiagnosticReason | null => {
  for (const reason of EDGE_REASON_ORDER) {
    if (reasons.has(reason)) {
      return reason
    }
  }
  return null
}

export type EdgeStatusByIdEntry = {
  kind: EdgeDiagnosticKind
  message?: string
  blame?: 'from' | 'to' | 'both'
  reasons?: EdgeDiagnosticReason[]
}

export type DiagnosticsVmItem = SpaghettiDiagnostic & {
  id: string
}

export type DiagnosticsVm = {
  items: DiagnosticsVmItem[]
  all: SpaghettiDiagnostic[]
  nodeDiagnostics: Record<string, SpaghettiDiagnostic[]>
  edgeDiagnostics: Record<string, SpaghettiDiagnostic[]>
  portDiagnostics: Record<string, SpaghettiDiagnostic[]>
  edgeStatusById: Record<string, EdgeStatusByIdEntry>
  slotStatus: Record<string, 'ok' | 'unresolved' | 'empty'>
}

type SelectDiagnosticsParams = {
  graph?: SpaghettiGraph
  validation?: GraphValidationResult
  evaluation?: EvaluationResult
}

const toDiagnosticId = (diagnostic: SpaghettiDiagnostic): string =>
  [
    diagnostic.level,
    diagnostic.code,
    diagnostic.message,
    diagnostic.nodeId ?? '',
    diagnostic.edgeId ?? '',
  ].join('::')

const buildDiagnosticsVm = (params: SelectDiagnosticsParams): DiagnosticsVm => {
  const merged = uniqDiagnostics([
    ...(params.validation?.errors ?? []),
    ...(params.validation?.warnings ?? []),
    ...(params.evaluation?.diagnostics.errors ?? []),
    ...(params.evaluation?.diagnostics.warnings ?? []),
  ])
  const items: DiagnosticsVmItem[] = merged.map((diagnostic) => ({
    ...diagnostic,
    id: toDiagnosticId(diagnostic),
  }))

  const nodeDiagnostics: Record<string, SpaghettiDiagnostic[]> = {}
  const edgeDiagnostics: Record<string, SpaghettiDiagnostic[]> = {}
  const portDiagnostics: Record<string, SpaghettiDiagnostic[]> = {}
  const edgeStatusAccumById = new Map<string, EdgeStatusAccumulator>()
  const cycleExcludedEdgeIds = new Set<string>()
  const cycleNodeIds = new Set<string>()

  if (params.graph !== undefined) {
    const sortedEdges = [...params.graph.edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))
    for (const edge of sortedEdges) {
      edgeStatusAccumById.set(edge.edgeId, createEdgeStatusAccumulator())
    }
  }

  for (const diagnostic of merged) {
    if (diagnostic.nodeId !== undefined) {
      nodeDiagnostics[diagnostic.nodeId] = [
        ...(nodeDiagnostics[diagnostic.nodeId] ?? []),
        diagnostic,
      ]
      const portKey = `${diagnostic.nodeId}::${diagnostic.code}`
      portDiagnostics[portKey] = [...(portDiagnostics[portKey] ?? []), diagnostic]
    }
    if (diagnostic.edgeId !== undefined) {
      edgeDiagnostics[diagnostic.edgeId] = [
        ...(edgeDiagnostics[diagnostic.edgeId] ?? []),
        diagnostic,
      ]
      if (!edgeStatusAccumById.has(diagnostic.edgeId)) {
        edgeStatusAccumById.set(diagnostic.edgeId, createEdgeStatusAccumulator())
      }
      if (EDGE_CYCLE_EXCLUDED_CODES.has(diagnostic.code)) {
        cycleExcludedEdgeIds.add(diagnostic.edgeId)
      }
    }
    if (diagnostic.code === 'GRAPH_CYCLE_DETECTED') {
      const parsed = parseCycleNodesFromMessage(diagnostic.message)
      parsed.forEach((nodeId) => cycleNodeIds.add(nodeId))
    }

    const { reason, blame } = toReasonForDiagnostic(diagnostic)
    if (reason === null || diagnostic.edgeId === undefined) {
      continue
    }
    const accumulator = edgeStatusAccumById.get(diagnostic.edgeId)
    if (accumulator === undefined) {
      continue
    }
    addReasonToAccumulator(accumulator, reason, diagnostic, blame ?? 'both')
  }

  if (params.graph !== undefined && cycleNodeIds.size > 0) {
    const sortedEdges = [...params.graph.edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))
    for (const edge of sortedEdges) {
      if (cycleExcludedEdgeIds.has(edge.edgeId)) {
        continue
      }
      if (!cycleNodeIds.has(edge.from.nodeId) || !cycleNodeIds.has(edge.to.nodeId)) {
        continue
      }
      const accumulator = edgeStatusAccumById.get(edge.edgeId)
      if (accumulator === undefined) {
        continue
      }
      addReasonToAccumulator(
        accumulator,
        'cycle',
        {
          level: 'error',
          code: 'GRAPH_CYCLE_DETECTED',
          message: `Cycle edge "${edge.edgeId}" participates in a detected cycle.`,
          edgeId: edge.edgeId,
        },
        'both',
      )
    }
  }

  const edgeStatusById: Record<string, EdgeStatusByIdEntry> = {}
  const inGraphEdgeIds = new Set<string>()
  if (params.graph !== undefined) {
    const sortedEdges = [...params.graph.edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))
    for (const edge of sortedEdges) {
      inGraphEdgeIds.add(edge.edgeId)
      const accumulator = edgeStatusAccumById.get(edge.edgeId) ?? createEdgeStatusAccumulator()
      const winningReason = toWinningReason(accumulator.reasons)
      const reasons = toSortedReasonList(accumulator.reasons)
      if (winningReason === null) {
        edgeStatusById[edge.edgeId] = { kind: 'ok' }
        continue
      }
      edgeStatusById[edge.edgeId] = {
        kind: winningReason,
        message: accumulator.messageByReason.get(winningReason),
        blame: accumulator.blameByReason.get(winningReason),
        reasons,
      }
    }
  }
  const extraEdgeIds = [...edgeStatusAccumById.keys()]
    .filter((edgeId) => !inGraphEdgeIds.has(edgeId))
    .sort((a, b) => a.localeCompare(b))
  for (const edgeId of extraEdgeIds) {
    const accumulator = edgeStatusAccumById.get(edgeId) ?? createEdgeStatusAccumulator()
    const winningReason = toWinningReason(accumulator.reasons)
    const reasons = toSortedReasonList(accumulator.reasons)
    edgeStatusById[edgeId] =
      winningReason === null
        ? { kind: 'ok' }
        : {
            kind: winningReason,
            message: accumulator.messageByReason.get(winningReason),
            blame: accumulator.blameByReason.get(winningReason),
            reasons,
          }
  }

  const slotStatus: Record<string, 'ok' | 'unresolved' | 'empty'> = {}
  if (params.graph !== undefined) {
    const outputPreviewNode = params.graph.nodes.find(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )
    if (outputPreviewNode !== undefined) {
      const rawSlots = (outputPreviewNode.params as { slots?: unknown }).slots
      const slotIds = Array.isArray(rawSlots)
        ? rawSlots
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
        : []
      const sortedEdges = [...params.graph.edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))
      for (const slotId of slotIds) {
        const targetPortId = `in:solid:${slotId}`
        const slotEdges = sortedEdges.filter(
          (edge) =>
            edge.to.nodeId === outputPreviewNode.nodeId && edge.to.portId === targetPortId,
        )
        if (slotEdges.length === 0) {
          slotStatus[slotId] = 'empty'
          continue
        }
        const hasNonOk = slotEdges.some((edge) => edgeStatusById[edge.edgeId]?.kind !== 'ok')
        slotStatus[slotId] = hasNonOk ? 'unresolved' : 'ok'
      }
    }
  }

  return {
    items,
    all: merged,
    nodeDiagnostics,
    edgeDiagnostics,
    portDiagnostics,
    edgeStatusById,
    slotStatus,
  }
}

let lastGraph: SpaghettiGraph | undefined
let lastValidation: GraphValidationResult | undefined
let lastEvaluation: EvaluationResult | undefined
let lastDiagnosticsVm: DiagnosticsVm | undefined

export const selectDiagnosticsVm = (params: SelectDiagnosticsParams): DiagnosticsVm => {
  if (
    lastDiagnosticsVm !== undefined &&
    lastGraph === params.graph &&
    lastValidation === params.validation &&
    lastEvaluation === params.evaluation
  ) {
    return lastDiagnosticsVm
  }
  const next = buildDiagnosticsVm(params)
  lastGraph = params.graph
  lastValidation = params.validation
  lastEvaluation = params.evaluation
  lastDiagnosticsVm = next
  return next
}
