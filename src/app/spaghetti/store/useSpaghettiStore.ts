import { create } from 'zustand'
import {
  loadGraphDocumentFromFile as loadGraphDocumentFromFileCommand,
  saveGraphDocumentToFile as saveGraphDocumentToFileCommand,
} from '../../io/graphDocumentPersistence'
import {
  compileSpaghettiGraph,
  computeFeatureStackIrParts,
  type FeatureStackIrParts,
} from '../compiler/compileGraph'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import { pickDefaultProfileRef } from '../features/autoLink'
import {
  moveFeatureInStack,
} from '../features/featureDependencies'
import { readFeatureStack } from '../features/featureSchema'
import { deriveProfilesWithDiagnostics } from '../features/profileDerivation'
import type { NumberExpression, Vec2Expression } from '../features/expressions'
import type { FeatureStack, SketchComponent, SketchFeature } from '../features/featureTypes'
import { isFeatureEnabled as isFeatureEnabledInStack } from '../features/featureTypes'
import type { FeatureStackIR } from '../features/compileFeatureStack'
import { parseDriverVirtualInputPortId } from '../features/driverVirtualPorts'
import {
  addEdge as addEdgeCommand,
  removeEdge as removeEdgeCommand,
  type GraphCommand,
} from '../graphCommands'
import { isPartNodeType, normalizePartSlots } from '../parts/partSlots'
import { buildNodeDriverVm, type OutputPinnedRowVm } from '../canvas/driverVm'
import {
  buildVmRowIdsForSection,
  normalizePartRowOrder,
} from '../parts/partRowOrder'
import {
  buildGraphOutputSurface,
  type GraphPublishedOutputEntry,
  type GraphOutputSurface,
} from '../outputSurface'
import { prepareGraphPreviewPreparation, type GraphPreviewPreparation } from '../previewPreparation'
import { getNodeDef } from '../registry/nodeRegistry'
import { ensureOutputPreviewSingletonPatch } from '../system/ensureOutputPreviewSingleton'
import { ensureOutputPreviewSlotsPatch } from '../system/ensureOutputPreviewSlots'
import type { ViewMode } from '../canvas/rowViewMode'
import type {
  EdgeEndpoint,
  EditorViewport,
  EditorViewportRestoreFromCollapsed,
  EditorViewportRestoreFromSplit,
  EditorViewportPosition,
  EditorViewportSize,
  GraphDocument,
  GraphReceiveReference,
  GraphNodePos,
  NodeRowMode,
  SpaghettiEdge,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'
import { newId } from '../utils/id'
import { makeComponentId, makeRowId } from '../utils/id'
import type { BuildRoutingIdentity, PartArtifact } from '../../../shared/buildTypes'

export type ConnectionDragState = {
  anchorDirection: 'in' | 'out'
  anchorNodeId: string
  anchorPortId: string
  anchorPath?: string[]
  pointerX: number
  pointerY: number
}

export type CanvasUiMessage = {
  level: 'error' | 'info'
  text: string
}

type NodePosUpdate = {
  nodeId: string
  x: number
  y: number
}

type EdgeWaypoint = {
  waypointId: string
  x: number
  y: number
  flipSide1: boolean
  flipSide2: boolean
}

export type GraphBuildInstances = {
  heelKickInstances: number[]
  toeHookInstances: number[]
}

export type GraphCompileBuildState = {
  lastCompileResult: ReturnType<typeof compileSpaghettiGraph> | null
  previousBuildInputs: ReturnType<typeof compileSpaghettiGraph>['buildInputs'] | null
  pendingChangedParamIds: string[]
  pendingStatsPartKeys: string[]
  pendingInstances: GraphBuildInstances | null
  currentGraphRevision: number
  lastBuildSeq: number | null
  latestIssuedGraphRevision: number | null
  latestIssuedBuildSeq: number
  latestAcceptedGraphRevision: number | null
  latestAcceptedBuildSeq: number | null
  inFlightGraphRevision: number | null
  inFlightBuildRequestId: string | null
  inFlightBuildSeq: number | null
}

export type GraphRuntimeState = {
  compileBuild: GraphCompileBuildState
  previewPreparation: GraphPreviewPreparation
  acceptedBuildOutputs: PartArtifact[]
  acceptedPreviewBuildOutputs: PartArtifact[]
  outputSurface: GraphOutputSurface
}

export type ResolvedGraphReceiveReference = GraphReceiveReference & {
  receivingGraphDocumentId: string
  sourceEntry: GraphPublishedOutputEntry | null
  resolutionState: 'resolved' | 'unresolved'
}

export type SharedViewerCompositionState = {
  compositionId: string
  graphDocumentIds: string[]
}

export type CachedGraphEntry = {
  cachedGraphId: string
  graphDocumentId: string
  source: 'in-memory' | 'file-load'
  isDirty: boolean
  lastSavedAt?: string
}

export type EditorViewportNodeFitRequest = {
  editorViewportId: string
  nodeId: string
  key: number
}

export type SpaghettiStoreState = {
  graph: SpaghettiGraph
  graphDocumentsById: Record<string, GraphDocument>
  graphDocumentOrder: string[]
  activeGraphDocumentId: string
  viewerTargetGraphDocumentId: string | null
  sharedViewerComposition: SharedViewerCompositionState | null
  graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
  graphDocumentIdByBuildSeq: Record<number, string>
  cachedGraphEntriesById: Record<string, CachedGraphEntry>
  cachedGraphEntryOrder: string[]
  editorViewportsById: Record<string, EditorViewport>
  editorViewportOrder: string[]
  activeEditorViewportId: string
  partFeatureStackIrByPartKey: FeatureStackIrParts
  partKeyByNodeId: Record<string, string>
  edgeWaypoints: Record<string, EdgeWaypoint[]>
  selectedNodeId: string | null
  editorViewportNodeFitRequest: EditorViewportNodeFitRequest | null
  selectedEdgeId: string | null
  hoveredEdgeId: string | null
  connectionDrag: ConnectionDragState | null
  uiMessage: CanvasUiMessage | null
  setGraph: (next: SpaghettiGraph) => void
  applyGraphCommand: (cmd: GraphCommand) => void
  applyGraphPatch: (patchFn: (prev: SpaghettiGraph) => SpaghettiGraph) => void
  setNodePos: (nodeId: string, x: number, y: number) => void
  setManyNodePos: (updates: NodePosUpdate[]) => void
  ensureNodePositions: () => void
  setNodeMode: (nodeId: string, mode: NodeRowMode) => void
  addEdge: (edge: SpaghettiEdge) => void
  removeEdge: (edgeId: string) => void
  insertEdgeWaypoint: (edgeId: string, x: number, y: number, insertIndex?: number) => void
  setEdgeWaypointPos: (edgeId: string, waypointId: string, x: number, y: number) => void
  removeEdgeWaypoint: (edgeId: string, waypointId: string) => void
  toggleEdgeWaypointSide1: (edgeId: string, waypointId: string) => void
  toggleEdgeWaypointSide2: (edgeId: string, waypointId: string) => void
  setSelectedNodeId: (nodeId: string | null) => void
  requestEditorViewportNodeFit: (editorViewportId: string, nodeId: string) => void
  setSelectedEdgeId: (edgeId: string | null) => void
  setHoveredEdgeId: (edgeId: string | null) => void
  setConnectionDrag: (drag: ConnectionDragState | null) => void
  clearConnectionDrag: () => void
  setUiMessage: (message: CanvasUiMessage | null) => void
  clearUiMessage: () => void
  createGraphDocument: (graph?: SpaghettiGraph, name?: string) => string
  duplicateActiveGraphDocument: () => string
  addGraphReceiveReference: (
    graphDocumentId: string,
    reference: {
      sourceGraphDocumentId: string
      sourceOutputEntryId: string
      receiveId?: string
      receiveNodeId?: string
      mode?: 'link'
    },
  ) => string | null
  removeGraphReceiveReference: (graphDocumentId: string, receiveId: string) => boolean
  setGraphCompileResult: (
    graphDocumentId: string,
    compileResult: ReturnType<typeof compileSpaghettiGraph> | null,
  ) => void
  stageGraphBuildRequest: (
    graphDocumentId: string,
    options: {
      compileResult: ReturnType<typeof compileSpaghettiGraph>
      previousBuildInputs: ReturnType<typeof compileSpaghettiGraph>['buildInputs'] | null
      pendingChangedParamIds: string[]
      pendingStatsPartKeys: string[]
      pendingInstances: GraphBuildInstances
      buildRequestId: string
      buildSeq: number
    },
  ) => void
  acceptGraphBuildResult: (
    routingIdentity: BuildRoutingIdentity & {
      buildSeq: number
      buildOutputs?: PartArtifact[]
    },
  ) => boolean
  clearGraphBuildRequest: (
    routingIdentity: BuildRoutingIdentity & { buildSeq: number },
  ) => boolean
  saveCachedGraphEntryToFile: (
    cachedGraphId: string,
    options?: {
      filename?: string
      savedAt?: string
      env?: NonNullable<Parameters<typeof saveGraphDocumentToFileCommand>[2]>
    },
  ) => Promise<void>
  loadGraphDocumentFromFile: (
    options?: {
      env?: NonNullable<Parameters<typeof loadGraphDocumentFromFileCommand>[1]>
    },
  ) => Promise<string>
  openGraphDocumentInViewport: (graphDocumentId: string) => string | null
  openGraphDocumentInNewViewport: (graphDocumentId: string) => string | null
  bindEditorViewportToGraphDocument: (editorViewportId: string, graphDocumentId: string) => void
  swapFocusedEditorViewportToGraphDocument: (graphDocumentId: string) => string | null
  loadGraphDocumentIntoNewGraphFromFile: (
    options?: {
      env?: NonNullable<Parameters<typeof loadGraphDocumentFromFileCommand>[1]>
    },
  ) => Promise<string>
  saveFocusedEditorViewportGraphToFile: (
    options?: {
      filename?: string
      savedAt?: string
      env?: NonNullable<Parameters<typeof saveGraphDocumentToFileCommand>[2]>
    },
  ) => Promise<void>
  closeEditorViewport: (editorViewportId: string) => void
  setActiveEditorViewportId: (editorViewportId: string) => void
  setViewerTargetGraphDocumentId: (graphDocumentId: string | null) => void
  addEditorViewportGraphToSharedViewerComposition: (editorViewportId: string) => string | null
  removeEditorViewportGraphFromSharedViewerComposition: (editorViewportId: string) => string | null
  setEditorViewportWindowMode: (
    editorViewportId: string,
    windowMode: EditorViewport['windowMode'],
  ) => void
  setEditorViewportSplitRatio: (editorViewportId: string, splitRatio: number) => void
  setEditorViewportPosition: (
    editorViewportId: string,
    position: EditorViewportPosition,
  ) => void
  setEditorViewportSize: (editorViewportId: string, size: EditorViewportSize) => void
  addSketchFeature: (nodeId: string) => void
  addCloseProfileFeature: (nodeId: string) => void
  addExtrudeFeature: (nodeId: string) => void
  toggleFeatureCollapsed: (nodeId: string, featureId: string) => void
  moveFeatureUp: (nodeId: string, featureId: string) => void
  moveFeatureDown: (nodeId: string, featureId: string) => void
  setFeatureEnabled: (nodeId: string, featureId: string, enabled: boolean) => void
  addSketchComponent: (
    nodeId: string,
    featureId: string,
    componentType: SketchComponent['type'],
  ) => void
  updateSketchComponentPoint: (
    nodeId: string,
    featureId: string,
    rowId: string,
    pointKey: 'a' | 'b' | 'p0' | 'p1' | 'p2' | 'p3' | 'start' | 'mid' | 'end',
    value: Vec2Expression,
  ) => void
  moveSketchComponentUp: (nodeId: string, featureId: string, rowId: string) => void
  moveSketchComponentDown: (nodeId: string, featureId: string, rowId: string) => void
  removeSketchComponent: (nodeId: string, featureId: string, rowId: string) => void
  setSketchRectangleDimensions: (
    nodeId: string,
    featureId: string,
    dimensions: { width?: number; length?: number },
  ) => void
  setCloseProfileSource: (
    nodeId: string,
    featureId: string,
    sourceSketchFeatureId: string | null,
  ) => void
  // Legacy compatibility methods kept for existing tests/callers.
  addSketchLine: (nodeId: string, featureId: string) => void
  updateSketchLineEndpoint: (
    nodeId: string,
    featureId: string,
    entityId: string,
    which: 'start' | 'end',
    value: Vec2Expression,
  ) => void
  setExtrudeDepth: (nodeId: string, featureId: string, depth: NumberExpression) => void
  setExtrudeTaper: (nodeId: string, featureId: string, taper: NumberExpression) => void
  setExtrudeOffset: (nodeId: string, featureId: string, offset: NumberExpression) => void
  setExtrudeProfileRef: (
    nodeId: string,
    featureId: string,
    ref: { sourceFeatureId: string; profileId: string; profileIndex?: number } | null,
  ) => void
  getPartFeatureStackIrForNode: (nodeId: string) => FeatureStackIR | null
  validate: () => ReturnType<typeof compileSpaghettiGraph>
}

type GraphDocumentStateSlice = Pick<
  SpaghettiStoreState,
  | 'graph'
  | 'graphDocumentsById'
  | 'graphDocumentOrder'
  | 'activeGraphDocumentId'
  | 'viewerTargetGraphDocumentId'
  | 'graphRuntimeByDocumentId'
  | 'graphDocumentIdByBuildSeq'
>

type CachedGraphStateSlice = Pick<
  SpaghettiStoreState,
  'cachedGraphEntriesById' | 'cachedGraphEntryOrder'
>

type ViewportStateSlice = Pick<
  SpaghettiStoreState,
  'editorViewportsById' | 'editorViewportOrder' | 'activeEditorViewportId'
>

const defaultGridColumns = 4
const defaultXStart = 40
const defaultYStart = 40
const defaultXStep = 280
const defaultYStep = 200
const defaultNodeRowMode: NodeRowMode = 'essentials'
const defaultEditorViewportId = 'editor-viewport-1'
// Spawn new floating editors just to the right of the left dock/title-status stack.
export const defaultViewportPosition: EditorViewportPosition = { x: 344, y: 16 }
export const defaultViewportSize: EditorViewportSize = { width: 980, height: 760 }
export const defaultViewportSplitRatio = 0.5
const minViewportSplitRatio = 0.25
const maxViewportSplitRatio = 0.75
const EMPTY_PART_ARTIFACTS: PartArtifact[] = []
const EMPTY_GRAPH_RECEIVE_REFERENCES: GraphReceiveReference[] = []
const EMPTY_RESOLVED_GRAPH_RECEIVE_REFERENCES: ResolvedGraphReceiveReference[] = []
const EMPTY_SHARED_VIEWER_COMPOSITION_GRAPH_DOCUMENT_IDS: string[] = []

const compareNodes = (a: SpaghettiNode, b: SpaghettiNode): number =>
  a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isNodeRowMode = (value: unknown): value is NodeRowMode =>
  value === 'collapsed' || value === 'essentials' || value === 'expanded'

const roundPos = (value: number): number => Math.round(value)

const defaultPosForIndex = (index: number): GraphNodePos => ({
  x: defaultXStart + (index % defaultGridColumns) * defaultXStep,
  y: defaultYStart + Math.floor(index / defaultGridColumns) * defaultYStep,
})

const normalizePath = (path: string[] | undefined): string[] | undefined => {
  if (path === undefined) {
    return undefined
  }
  const normalized = path.filter((segment) => segment.length > 0)
  return normalized.length > 0 ? normalized : undefined
}

const normalizeEndpoint = (endpoint: EdgeEndpoint): EdgeEndpoint => {
  const legacyScalarMatch = /^(anchorPoint[1-5])(X|Y)$/.exec(endpoint.portId)
  if (legacyScalarMatch !== null) {
    return {
      nodeId: endpoint.nodeId,
      portId: legacyScalarMatch[1],
      path: [legacyScalarMatch[2] === 'X' ? 'x' : 'y'],
    }
  }

  const path = normalizePath(endpoint.path)
  return {
    nodeId: endpoint.nodeId,
    portId: endpoint.portId,
    ...(path === undefined ? {} : { path }),
  }
}

const normalizeInputEndpointPortAlias = (
  endpoint: EdgeEndpoint,
  toNode: SpaghettiNode | undefined,
): EdgeEndpoint => {
  if (toNode === undefined) {
    return endpoint
  }
  const aliases = getNodeDef(toNode.type)?.legacyInputPortAliases
  if (aliases === undefined) {
    return endpoint
  }
  const canonicalPortId = aliases[endpoint.portId] ?? endpoint.portId
  if (canonicalPortId === endpoint.portId) {
    return endpoint
  }
  return {
    ...endpoint,
    portId: canonicalPortId,
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isGraphReceiveReference = (value: unknown): value is GraphReceiveReference => {
  if (!isRecord(value)) {
    return false
  }
  return (
    typeof value.receiveId === 'string' &&
    value.receiveId.length > 0 &&
    typeof value.sourceGraphDocumentId === 'string' &&
    value.sourceGraphDocumentId.length > 0 &&
    typeof value.sourceOutputEntryId === 'string' &&
    value.sourceOutputEntryId.length > 0 &&
    value.mode === 'link' &&
    (value.receiveNodeId === undefined ||
      (typeof value.receiveNodeId === 'string' && value.receiveNodeId.length > 0))
  )
}

const cloneGraph = (graph: SpaghettiGraph): SpaghettiGraph => {
  if (typeof structuredClone === 'function') {
    return structuredClone(graph)
  }
  return JSON.parse(JSON.stringify(graph)) as SpaghettiGraph
}

const nextOrdinalId = (prefix: string, existingIds: readonly string[]): string => {
  let maxNumber = 0
  for (const id of existingIds) {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(id)
    if (match === null) {
      continue
    }
    maxNumber = Math.max(maxNumber, Number.parseInt(match[1] ?? '0', 10))
  }
  return `${prefix}-${maxNumber + 1}`
}

const normalizeReceiveReferences = (
  receiveReferences: SpaghettiGraph['receiveReferences'],
): SpaghettiGraph['receiveReferences'] => {
  if (!Array.isArray(receiveReferences) || receiveReferences.length === 0) {
    return undefined
  }

  const seenReceiveIds = new Set<string>()
  const normalized: GraphReceiveReference[] = []
  for (const reference of [...receiveReferences].sort((left, right) =>
    left.receiveId.localeCompare(right.receiveId),
  )) {
    if (!isGraphReceiveReference(reference) || seenReceiveIds.has(reference.receiveId)) {
      continue
    }
    seenReceiveIds.add(reference.receiveId)
    normalized.push({
      receiveId: reference.receiveId,
      sourceGraphDocumentId: reference.sourceGraphDocumentId,
      sourceOutputEntryId: reference.sourceOutputEntryId,
      mode: 'link',
      ...(reference.receiveNodeId === undefined ? {} : { receiveNodeId: reference.receiveNodeId }),
    })
  }

  return normalized.length > 0 ? normalized : undefined
}

const listNumericNodeParamDriverParamIds = (
  nodeDef: ReturnType<typeof getNodeDef>,
): string[] => {
  if (nodeDef === undefined) {
    return []
  }
  const ids = new Set<string>()
  for (const spec of nodeDef.inputDrivers ?? []) {
    if (spec.kind !== 'nodeParam') {
      continue
    }
    if (spec.control.kind !== 'nodeParam') {
      continue
    }
    if (spec.control.wireOutputType?.kind !== 'number') {
      continue
    }
    ids.add(spec.control.paramId)
  }
  return [...ids].sort((a, b) => a.localeCompare(b))
}

const canonicalizeDriverOffsetMetadata = (options: {
  params: Record<string, unknown>
  numericParamIds: readonly string[]
  drivenNumericParamIds: ReadonlySet<string> | undefined
}): Record<string, unknown> => {
  const { params, numericParamIds, drivenNumericParamIds } = options
  if (numericParamIds.length === 0) {
    let changed = false
    const next = {
      ...params,
    }
    if (next.driverOffsetByParamId !== undefined) {
      delete next.driverOffsetByParamId
      changed = true
    }
    if (next.driverDrivenByParamId !== undefined) {
      delete next.driverDrivenByParamId
      changed = true
    }
    return changed ? next : params
  }

  const rawOffset =
    isRecord(params.driverOffsetByParamId) ? params.driverOffsetByParamId : undefined

  const canonicalOffsetEntries: Array<[string, number]> = []
  const canonicalDrivenEntries: Array<[string, true]> = []
  for (const paramId of numericParamIds) {
    if (drivenNumericParamIds?.has(paramId) === true) {
      canonicalDrivenEntries.push([paramId, true])
    }

    const rawOffsetValue = rawOffset?.[paramId]
    if (typeof rawOffsetValue === 'number' && Number.isFinite(rawOffsetValue)) {
      canonicalOffsetEntries.push([paramId, rawOffsetValue])
      continue
    }
    if (drivenNumericParamIds?.has(paramId) === true) {
      canonicalOffsetEntries.push([paramId, 0])
    }
  }

  const canonicalOffset =
    canonicalOffsetEntries.length === 0
      ? undefined
      : Object.fromEntries(canonicalOffsetEntries)
  const canonicalDriven =
    canonicalDrivenEntries.length === 0
      ? undefined
      : Object.fromEntries(canonicalDrivenEntries)

  const offsetChanged = (() => {
    if (canonicalOffset === undefined) {
      return params.driverOffsetByParamId !== undefined
    }
    if (!isRecord(params.driverOffsetByParamId)) {
      return true
    }
    const rawOffsetByParamId = params.driverOffsetByParamId
    const rawKeys = Object.keys(rawOffsetByParamId)
    const canonicalKeys = Object.keys(canonicalOffset)
    if (rawKeys.length !== canonicalKeys.length) {
      return true
    }
    for (const key of canonicalKeys) {
      const rawValue = rawOffsetByParamId[key]
      if (typeof rawValue !== 'number' || !Number.isFinite(rawValue) || rawValue !== canonicalOffset[key]) {
        return true
      }
    }
    return false
  })()

  const drivenChanged = (() => {
    if (canonicalDriven === undefined) {
      return params.driverDrivenByParamId !== undefined
    }
    if (!isRecord(params.driverDrivenByParamId)) {
      return true
    }
    const rawDrivenByParamId = params.driverDrivenByParamId
    const rawKeys = Object.keys(rawDrivenByParamId)
    const canonicalKeys = Object.keys(canonicalDriven)
    if (rawKeys.length !== canonicalKeys.length) {
      return true
    }
    for (const key of canonicalKeys) {
      if (rawDrivenByParamId[key] !== true) {
        return true
      }
    }
    return false
  })()

  if (!offsetChanged && !drivenChanged) {
    return params
  }

  const next: Record<string, unknown> = {
    ...params,
  }
  if (canonicalOffset === undefined) {
    delete next.driverOffsetByParamId
  } else {
    next.driverOffsetByParamId = canonicalOffset
  }
  if (canonicalDriven === undefined) {
    delete next.driverDrivenByParamId
  } else {
    next.driverDrivenByParamId = canonicalDriven
  }
  return next
}

const normalizeGraphUiPositions = (graph: SpaghettiGraph): SpaghettiGraph => {
  const sortedNodes = [...graph.nodes].sort(compareNodes)
  const nodeById = new Map(graph.nodes.map((node) => [node.nodeId, node]))
  const existingNodePos = graph.ui?.nodes ?? {}
  const normalizedNodePos: Record<string, GraphNodePos> = {}

  sortedNodes.forEach((node, index) => {
    const canonical = existingNodePos[node.nodeId]
    if (canonical !== undefined && isFiniteNumber(canonical.x) && isFiniteNumber(canonical.y)) {
      normalizedNodePos[node.nodeId] = {
        x: roundPos(canonical.x),
        y: roundPos(canonical.y),
      }
      return
    }

    if (node.ui !== undefined && isFiniteNumber(node.ui.x) && isFiniteNumber(node.ui.y)) {
      normalizedNodePos[node.nodeId] = {
        x: roundPos(node.ui.x),
        y: roundPos(node.ui.y),
      }
      return
    }

    normalizedNodePos[node.nodeId] = defaultPosForIndex(index)
  })

  const normalizedEdges = graph.edges.map((edge) => ({
    ...edge,
    from: normalizeEndpoint(edge.from),
    to: normalizeInputEndpointPortAlias(
      normalizeEndpoint(edge.to),
      nodeById.get(edge.to.nodeId),
    ),
  }))

  const inputConnectionCountsByNodeId = new Map<string, Map<string, number>>()
  for (const edge of normalizedEdges) {
    const nextMap = inputConnectionCountsByNodeId.get(edge.to.nodeId) ?? new Map<string, number>()
    nextMap.set(edge.to.portId, (nextMap.get(edge.to.portId) ?? 0) + 1)
    inputConnectionCountsByNodeId.set(edge.to.nodeId, nextMap)
  }

  const numericDriverParamIdsByNodeId = new Map<string, string[]>()
  for (const node of graph.nodes) {
    if (!isPartNodeType(node.type)) {
      continue
    }
    const numericDriverParamIds = listNumericNodeParamDriverParamIds(getNodeDef(node.type))
    if (numericDriverParamIds.length === 0) {
      continue
    }
    numericDriverParamIdsByNodeId.set(node.nodeId, numericDriverParamIds)
  }

  const drivenNumericParamIdsByNodeId = new Map<string, Set<string>>()
  for (const edge of normalizedEdges) {
    if (normalizePath(edge.to.path) !== undefined) {
      continue
    }
    const parsedDriverInput = parseDriverVirtualInputPortId(edge.to.portId)
    if (parsedDriverInput === null) {
      continue
    }
    const numericDriverParamIds = numericDriverParamIdsByNodeId.get(edge.to.nodeId)
    if (numericDriverParamIds === undefined || !numericDriverParamIds.includes(parsedDriverInput.paramId)) {
      continue
    }
    const next = drivenNumericParamIdsByNodeId.get(edge.to.nodeId) ?? new Set<string>()
    next.add(parsedDriverInput.paramId)
    drivenNumericParamIdsByNodeId.set(edge.to.nodeId, next)
  }

  const normalizedNodes = graph.nodes.map((node) => {
    const normalizedPartSlots = isPartNodeType(node.type)
      ? normalizePartSlots(node.partSlots, node.nodeId).partSlots
      : node.partSlots
    let normalizedParams = node.params
    if (isPartNodeType(node.type)) {
      const nodeDef = getNodeDef(node.type)
      normalizedParams = canonicalizeDriverOffsetMetadata({
        params: normalizedParams,
        numericParamIds: numericDriverParamIdsByNodeId.get(node.nodeId) ?? [],
        drivenNumericParamIds: drivenNumericParamIdsByNodeId.get(node.nodeId),
      })
      const vm = buildNodeDriverVm(node, nodeDef, {
        connectionCountByPortId: inputConnectionCountsByNodeId.get(node.nodeId),
      })
      if (vm !== null) {
        const outputEndpointRows = vm.outputs.filter(
          (row): row is Extract<OutputPinnedRowVm, { kind: 'endpoint' }> => row.kind === 'endpoint',
        )
        const normalizedPartRowOrder = normalizePartRowOrder({
          node: {
            ...node,
            params: normalizedParams,
          },
          vmDriversRowIds: buildVmRowIdsForSection(node.nodeId, vm.drivers),
          vmInputsRowIds: buildVmRowIdsForSection(node.nodeId, vm.inputs),
          vmOutputsRowIds: buildVmRowIdsForSection(node.nodeId, outputEndpointRows),
        })
        if (normalizedPartRowOrder.repairedNode !== undefined) {
          normalizedParams = normalizedPartRowOrder.repairedNode.params
        }
      }
    }
    const normalizedNode = {
      nodeId: node.nodeId,
      type: node.type,
      params: normalizedParams,
      ...(normalizedPartSlots === undefined ? {} : { partSlots: normalizedPartSlots }),
    }
    if (node.ui === undefined) {
      if (isPartNodeType(node.type)) {
        return normalizedNode
      }
      return node
    }
    return normalizedNode
  })

  const existingNodeModes = graph.ui?.nodeModesByNodeId ?? {}
  const normalizedNodeModes: Record<string, NodeRowMode> = {}
  for (const node of graph.nodes) {
    const mode = existingNodeModes[node.nodeId]
    if (!isNodeRowMode(mode) || mode === defaultNodeRowMode) {
      continue
    }
    normalizedNodeModes[node.nodeId] = mode
  }

  const normalizedReceiveReferences = normalizeReceiveReferences(graph.receiveReferences)

  return {
    schemaVersion: graph.schemaVersion,
    nodes: normalizedNodes,
    edges: normalizedEdges,
    ...(normalizedReceiveReferences === undefined
      ? {}
      : { receiveReferences: normalizedReceiveReferences }),
    ui: {
      ...(Object.keys(normalizedNodeModes).length === 0
        ? {}
        : { nodeModesByNodeId: normalizedNodeModes }),
      ...(graph.ui?.viewport === undefined ? {} : { viewport: graph.ui.viewport }),
      nodes: normalizedNodePos,
    },
  }
}

export const normalizeGraphForStoreCommit = (graph: SpaghettiGraph): SpaghettiGraph => {
  const singletonPatch = ensureOutputPreviewSingletonPatch(graph)
  const singletonRepaired = singletonPatch ? singletonPatch(graph) : graph
  const slotsPatch = ensureOutputPreviewSlotsPatch(singletonRepaired)
  const slotsRepaired = slotsPatch ? slotsPatch(singletonRepaired) : singletonRepaired
  return normalizeGraphUiPositions(slotsRepaired)
}

const isPartNode = (node: SpaghettiNode): boolean => isPartNodeType(node.type)

const getPartFeatureStack = (node: SpaghettiNode): FeatureStack =>
  readFeatureStack(node.params.featureStack)

const setPartFeatureStack = (node: SpaghettiNode, stack: FeatureStack): SpaghettiNode => ({
  ...node,
  params: {
    ...node.params,
    featureStack: readFeatureStack(stack),
  },
})

const recomputeSketchFeature = (feature: SketchFeature): SketchFeature => ({
  ...feature,
  outputs: {
    ...deriveProfilesWithDiagnostics(feature.components),
  },
})

const createSketchFeature = (): SketchFeature => ({
  type: 'sketch',
  featureId: newId('feature'),
  plane: 'XY',
  components: [],
  outputs: {
    profiles: [],
    diagnostics: [],
  },
  uiState: {
    collapsed: false,
  },
})

const createDefaultLineComponent = (): SketchComponent => ({
  rowId: makeRowId(),
  componentId: makeComponentId(),
  type: 'line',
  a: {
    kind: 'lit' as const,
    x: 0,
    y: 0,
  },
  b: {
    kind: 'lit' as const,
    x: 100,
    y: 0,
  },
})

const createDefaultSplineComponent = (): SketchComponent => ({
  rowId: makeRowId(),
  componentId: makeComponentId(),
  type: 'spline',
  p0: { kind: 'lit', x: 0, y: 0 },
  p1: { kind: 'lit', x: 25, y: 0 },
  p2: { kind: 'lit', x: 75, y: 0 },
  p3: { kind: 'lit', x: 100, y: 0 },
})

const createDefaultArcComponent = (): SketchComponent => ({
  rowId: makeRowId(),
  componentId: makeComponentId(),
  type: 'arc3pt',
  start: { kind: 'lit', x: 0, y: 0 },
  mid: { kind: 'lit', x: 50, y: 25 },
  end: { kind: 'lit', x: 100, y: 0 },
})

const createDefaultComponent = (
  componentType: SketchComponent['type'],
): SketchComponent => {
  if (componentType === 'spline') return createDefaultSplineComponent()
  if (componentType === 'arc3pt') return createDefaultArcComponent()
  return createDefaultLineComponent()
}

const isCubeSeedRectangleSketch = (feature: SketchFeature): boolean =>
  feature.featureId === 'cube-sketch-1' &&
  feature.components.length === 4 &&
  feature.components.every((component) => component.type === 'line')

const rewriteCubeSeedRectangleSketch = (
  feature: SketchFeature,
  dimensions: {
    width?: number
    length?: number
  },
): SketchFeature => {
  if (!isCubeSeedRectangleSketch(feature)) {
    return feature
  }

  const currentLength = feature.components[0]?.type === 'line' ? feature.components[0].b.x : 0
  const currentWidth = feature.components[1]?.type === 'line' ? feature.components[1].b.y : 0
  const nextLength =
    typeof dimensions.length === 'number' && Number.isFinite(dimensions.length)
      ? dimensions.length
      : currentLength
  const nextWidth =
    typeof dimensions.width === 'number' && Number.isFinite(dimensions.width)
      ? dimensions.width
      : currentWidth

  const nextComponents = [
    {
      ...feature.components[0],
      a: { kind: 'lit' as const, x: 0, y: 0 },
      b: { kind: 'lit' as const, x: nextLength, y: 0 },
    },
    {
      ...feature.components[1],
      a: { kind: 'lit' as const, x: nextLength, y: 0 },
      b: { kind: 'lit' as const, x: nextLength, y: nextWidth },
    },
    {
      ...feature.components[2],
      a: { kind: 'lit' as const, x: nextLength, y: nextWidth },
      b: { kind: 'lit' as const, x: 0, y: nextWidth },
    },
    {
      ...feature.components[3],
      a: { kind: 'lit' as const, x: 0, y: nextWidth },
      b: { kind: 'lit' as const, x: 0, y: 0 },
    },
  ]

  const unchanged = nextComponents.every((component, index) => {
    const current = feature.components[index]
    return (
      current?.type === 'line' &&
      current.a.x === component.a.x &&
      current.a.y === component.a.y &&
      current.b.x === component.b.x &&
      current.b.y === component.b.y
    )
  })
  if (unchanged) {
    return feature
  }

  return recomputeSketchFeature({
    ...feature,
    components: nextComponents,
  })
}

const createCloseProfileFeature = () => ({
  type: 'closeProfile' as const,
  featureId: newId('feature'),
  inputs: {
    sourceSketchFeatureId: null,
  },
  outputs: {
    profileRef: null,
  },
  uiState: {
    collapsed: false,
  },
})

const recomputeCloseProfileOutputs = (stack: FeatureStack): FeatureStack => {
  const sketchById = new Map<string, Extract<FeatureStack[number], { type: 'sketch' }>>()
  return stack.map((feature) => {
    if (feature.type === 'sketch') {
      if (isFeatureEnabledInStack(feature)) {
        sketchById.set(feature.featureId, feature)
      }
      return feature
    }
    if (feature.type !== 'closeProfile') {
      return feature
    }
    if (!isFeatureEnabledInStack(feature)) {
      if (feature.outputs.profileRef === null) {
        return feature
      }
      return {
        ...feature,
        outputs: {
          ...feature.outputs,
          profileRef: null,
        },
      }
    }
    const sourceId = feature.inputs.sourceSketchFeatureId
    const source = sourceId === null ? undefined : sketchById.get(sourceId)
    const selected = source?.outputs.profiles[0]
    const nextRef =
      sourceId === null || selected === undefined
        ? null
        : {
            sourceFeatureId: sourceId,
            profileId: selected.profileId,
            profileIndex: 0 as const,
          }
    if (
      feature.outputs.profileRef?.sourceFeatureId === nextRef?.sourceFeatureId &&
      feature.outputs.profileRef?.profileId === nextRef?.profileId &&
      feature.outputs.profileRef?.profileIndex === nextRef?.profileIndex
    ) {
      return feature
    }
    return {
      ...feature,
      outputs: {
        ...feature.outputs,
        profileRef: nextRef,
      },
    }
  })
}

const updatePartNodeFeatureStack = (
  graph: SpaghettiGraph,
  nodeId: string,
  updateFn: (stack: FeatureStack) => FeatureStack,
): SpaghettiGraph => {
  let changed = false
  const nodes = graph.nodes.map((node) => {
    if (node.nodeId !== nodeId || !isPartNode(node)) {
      return node
    }
    const currentStack = getPartFeatureStack(node)
    const nextStack = recomputeCloseProfileOutputs(updateFn(currentStack))
    if (nextStack === currentStack) {
      return node
    }
    changed = true
    return setPartFeatureStack(node, nextStack)
  })
  return changed
    ? {
        ...graph,
        nodes,
      }
    : graph
}

const upsertNodePos = (
  graph: SpaghettiGraph,
  updatesByNodeId: Record<string, GraphNodePos>,
): SpaghettiGraph => {
  const canonical = normalizeGraphForStoreCommit(graph)
  const currentPos = canonical.ui?.nodes ?? {}
  let changed = false
  const nextPos: Record<string, GraphNodePos> = { ...currentPos }

  for (const [nodeId, pos] of Object.entries(updatesByNodeId)) {
    if (!canonical.nodes.some((node) => node.nodeId === nodeId)) {
      continue
    }
    const rounded = {
      x: roundPos(pos.x),
      y: roundPos(pos.y),
    }
    const prev = nextPos[nodeId]
    if (prev !== undefined && prev.x === rounded.x && prev.y === rounded.y) {
      continue
    }
    nextPos[nodeId] = rounded
    changed = true
  }

  if (!changed) {
    return canonical
  }

  return {
    ...canonical,
    ui: {
      ...(canonical.ui?.nodeModesByNodeId === undefined
        ? {}
        : { nodeModesByNodeId: canonical.ui.nodeModesByNodeId }),
      ...(canonical.ui?.viewport === undefined ? {} : { viewport: canonical.ui.viewport }),
      nodes: nextPos,
    },
  }
}

export const selectNodeMode = (
  state: Pick<SpaghettiStoreState, 'graph'>,
  nodeId: string,
): ViewMode => state.graph.ui?.nodeModesByNodeId?.[nodeId] ?? defaultNodeRowMode

const upsertNodeMode = (
  graph: SpaghettiGraph,
  nodeId: string,
  mode: NodeRowMode,
): SpaghettiGraph => {
  const canonical = normalizeGraphForStoreCommit(graph)
  if (!canonical.nodes.some((node) => node.nodeId === nodeId)) {
    return canonical
  }

  const currentMode = canonical.ui?.nodeModesByNodeId?.[nodeId] ?? defaultNodeRowMode
  if (currentMode === mode) {
    return canonical
  }

  const nextNodeModes = { ...(canonical.ui?.nodeModesByNodeId ?? {}) }
  if (mode === defaultNodeRowMode) {
    delete nextNodeModes[nodeId]
  } else {
    nextNodeModes[nodeId] = mode
  }

  return {
    ...canonical,
    ui: {
      ...(Object.keys(nextNodeModes).length === 0 ? {} : { nodeModesByNodeId: nextNodeModes }),
      ...(canonical.ui?.viewport === undefined ? {} : { viewport: canonical.ui.viewport }),
      nodes: canonical.ui?.nodes ?? {},
    },
  }
}

const pruneEdgeWaypoints = (
  graph: SpaghettiGraph,
  edgeWaypoints: Record<string, EdgeWaypoint[]>,
): Record<string, EdgeWaypoint[]> => {
  const validIds = new Set(graph.edges.map((edge) => edge.edgeId))
  const next: Record<string, EdgeWaypoint[]> = {}
  for (const [edgeId, waypoints] of Object.entries(edgeWaypoints)) {
    if (!validIds.has(edgeId)) {
      continue
    }
    next[edgeId] = waypoints
  }
  return next
}

const buildWaypointId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `wp-${crypto.randomUUID()}`
  }
  fallbackWaypointCounter += 1
  return `wp-fallback-${fallbackWaypointCounter}`
}

let fallbackWaypointCounter = 0

const emptyGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [],
  edges: [],
}

type FeatureStackIrCacheSlice = Pick<
  SpaghettiStoreState,
  'partFeatureStackIrByPartKey' | 'partKeyByNodeId'
>

const deriveFeatureStackIrCache = (graph: SpaghettiGraph): FeatureStackIrCacheSlice => {
  const hasPartNodes = graph.nodes.some((node) => node.type.startsWith('Part/'))
  if (!hasPartNodes) {
    const computed = computeFeatureStackIrParts(graph)
    return {
      partFeatureStackIrByPartKey: computed.parts,
      partKeyByNodeId: computed.nodeIdToPartKey,
    }
  }
  const evaluation = evaluateSpaghettiGraph(graph)
  const computed = computeFeatureStackIrParts(graph, {
    resolvedInputsByNodeId: evaluation.ok ? evaluation.inputsByNodeId : undefined,
  })
  return {
    partFeatureStackIrByPartKey: computed.parts,
    partKeyByNodeId: computed.nodeIdToPartKey,
  }
}

const withGraphAndFeatureStackCache = (
  graph: SpaghettiGraph,
): Pick<SpaghettiStoreState, 'graph'> & FeatureStackIrCacheSlice => ({
  graph,
  ...deriveFeatureStackIrCache(graph),
})

const createGraphDocument = (
  graph: SpaghettiGraph,
  options?: {
    graphDocumentId?: string
    name?: string
  },
): GraphDocument => ({
  graphDocumentId: options?.graphDocumentId ?? 'graph-document-1',
  name: options?.name ?? 'Graph 1',
  version: 1,
  graph,
})

const upsertGraphReceiveReference = (
  graph: SpaghettiGraph,
  reference: GraphReceiveReference,
): SpaghettiGraph => {
  const current = graph.receiveReferences ?? EMPTY_GRAPH_RECEIVE_REFERENCES
  const existingIndex = current.findIndex((entry) => entry.receiveId === reference.receiveId)
  if (existingIndex >= 0) {
    const existing = current[existingIndex]
    if (
      existing.sourceGraphDocumentId === reference.sourceGraphDocumentId &&
      existing.sourceOutputEntryId === reference.sourceOutputEntryId &&
      existing.mode === reference.mode &&
      existing.receiveNodeId === reference.receiveNodeId
    ) {
      return graph
    }
    const nextReceiveReferences = [...current]
    nextReceiveReferences[existingIndex] = reference
    return {
      ...graph,
      receiveReferences: nextReceiveReferences,
    }
  }
  return {
    ...graph,
    receiveReferences: [...current, reference],
  }
}

const removeGraphReceiveReferenceFromGraph = (
  graph: SpaghettiGraph,
  receiveId: string,
): SpaghettiGraph => {
  const current = graph.receiveReferences
  if (current === undefined) {
    return graph
  }
  const nextReceiveReferences = current.filter((entry) => entry.receiveId !== receiveId)
  if (nextReceiveReferences.length === current.length) {
    return graph
  }
  if (nextReceiveReferences.length === 0) {
    const nextGraph = { ...graph }
    delete nextGraph.receiveReferences
    return nextGraph
  }
  return {
    ...graph,
    receiveReferences: nextReceiveReferences,
  }
}

const createEditorViewport = (
  graphDocumentId: string,
  options?: {
    editorViewportId?: string
    isFocused?: boolean
    windowMode?: EditorViewport['windowMode']
    position?: EditorViewportPosition
    size?: EditorViewportSize
    zOrder?: number
  },
): EditorViewport => ({
  editorViewportId: options?.editorViewportId ?? defaultEditorViewportId,
  graphDocumentId,
  isFocused: options?.isFocused ?? true,
  windowMode: options?.windowMode ?? 'expanded',
  position: options?.position ?? defaultViewportPosition,
  size: options?.size ?? defaultViewportSize,
  splitRatio: defaultViewportSplitRatio,
  restoreFromCollapsed: null,
  restoreFromSplit: null,
  zOrder: options?.zOrder ?? 1,
})

const clampViewportSplitRatio = (splitRatio: number): number =>
  Math.min(maxViewportSplitRatio, Math.max(minViewportSplitRatio, splitRatio))

const snapshotExpandedRestoreState = (
  viewport: EditorViewport,
): EditorViewportRestoreFromSplit => ({
  windowMode: 'expanded',
  position: viewport.position,
  size: viewport.size,
})

const snapshotCollapsedRestoreState = (
  viewport: EditorViewport,
): EditorViewportRestoreFromCollapsed => {
  if (viewport.windowMode === 'split view') {
    return {
      windowMode: 'split view',
      position: viewport.position,
      size: viewport.size,
      splitRatio: viewport.splitRatio,
    }
  }
  if (viewport.windowMode === 'maximized') {
    return {
      windowMode: 'maximized',
      position: viewport.position,
      size: viewport.size,
    }
  }
  return {
    windowMode: 'expanded',
    position: viewport.position,
    size: viewport.size,
  }
}

const addGraphDocumentIdToSharedViewerComposition = (
  composition: SharedViewerCompositionState | null,
  graphDocumentId: string,
): SharedViewerCompositionState => {
  if (composition === null) {
    return {
      compositionId: newId('shared-viewer-composition'),
      graphDocumentIds: [graphDocumentId],
    }
  }
  if (composition.graphDocumentIds.includes(graphDocumentId)) {
    return composition
  }
  return {
    ...composition,
    graphDocumentIds: [...composition.graphDocumentIds, graphDocumentId],
  }
}

const removeGraphDocumentIdFromSharedViewerComposition = (
  composition: SharedViewerCompositionState | null,
  graphDocumentId: string,
): SharedViewerCompositionState | null => {
  if (composition === null) {
    return null
  }
  const nextGraphDocumentIds = composition.graphDocumentIds.filter((id) => id !== graphDocumentId)
  if (nextGraphDocumentIds.length === composition.graphDocumentIds.length) {
    return composition
  }
  if (nextGraphDocumentIds.length === 0) {
    return null
  }
  return {
    ...composition,
    graphDocumentIds: nextGraphDocumentIds,
  }
}

const createEmptyGraphCompileBuildState = (): GraphCompileBuildState => ({
  lastCompileResult: null,
  previousBuildInputs: null,
  pendingChangedParamIds: [],
  pendingStatsPartKeys: [],
  pendingInstances: null,
  currentGraphRevision: 0,
  lastBuildSeq: null,
  latestIssuedGraphRevision: null,
  latestIssuedBuildSeq: 0,
  latestAcceptedGraphRevision: null,
  latestAcceptedBuildSeq: null,
  inFlightGraphRevision: null,
  inFlightBuildRequestId: null,
  inFlightBuildSeq: null,
})

const createGraphRuntimeState = (
  graphDocumentId: string,
  graph: SpaghettiGraph,
): GraphRuntimeState => {
  const compileBuild = createEmptyGraphCompileBuildState()
  const previewPreparation = prepareGraphPreviewPreparation(graph)
  const acceptedBuildOutputs: PartArtifact[] = []
  const acceptedPreviewBuildOutputs: PartArtifact[] = []
  return {
    compileBuild,
    previewPreparation,
    acceptedBuildOutputs,
    acceptedPreviewBuildOutputs,
    outputSurface: buildGraphOutputSurface({
      graphDocumentId,
      previewPreparation,
      acceptedBuildOutputs,
      publishedAtBuildSeq: compileBuild.latestAcceptedBuildSeq,
    }),
  }
}

const createCachedGraphEntry = (
  graphDocumentId: string,
  options?: {
    source?: CachedGraphEntry['source']
    isDirty?: boolean
    lastSavedAt?: string
  },
): CachedGraphEntry => ({
  cachedGraphId: graphDocumentId,
  graphDocumentId,
  source: options?.source ?? 'in-memory',
  isDirty: options?.isDirty ?? true,
  lastSavedAt: options?.lastSavedAt,
})

const syncCachedGraphEntries = (
  graphDocumentOrder: string[],
  cachedGraphEntriesById: Record<string, CachedGraphEntry>,
): CachedGraphStateSlice => {
  const nextCachedGraphEntriesById: Record<string, CachedGraphEntry> = {}
  for (const graphDocumentId of graphDocumentOrder) {
    const existingEntry = cachedGraphEntriesById[graphDocumentId]
    nextCachedGraphEntriesById[graphDocumentId] =
      existingEntry ?? createCachedGraphEntry(graphDocumentId)
  }
  return {
    cachedGraphEntriesById: nextCachedGraphEntriesById,
    cachedGraphEntryOrder: [...graphDocumentOrder],
  }
}

const withUpdatedGraphRuntimeGraph = (
  runtime: GraphRuntimeState | undefined,
  graphDocumentId: string,
  graph: SpaghettiGraph,
): GraphRuntimeState => {
  const compileBuild = runtime?.compileBuild ?? createEmptyGraphCompileBuildState()
  const previewPreparation = {
    ...prepareGraphPreviewPreparation(graph),
    buildStatsReadyPartKeys:
      runtime?.previewPreparation.buildStatsReadyPartKeys ?? [],
  }
  const acceptedBuildOutputs = runtime?.acceptedBuildOutputs ?? []
  const acceptedPreviewBuildOutputs = runtime?.acceptedPreviewBuildOutputs ?? []
  return {
    compileBuild,
    previewPreparation,
    acceptedBuildOutputs,
    acceptedPreviewBuildOutputs,
    outputSurface: buildGraphOutputSurface({
      graphDocumentId,
      previewPreparation,
      acceptedBuildOutputs,
      publishedAtBuildSeq: compileBuild.latestAcceptedBuildSeq,
    }),
  }
}

type BrowserViewportState = Pick<
  SpaghettiStoreState,
  | 'graph'
  | 'graphDocumentsById'
  | 'graphDocumentOrder'
  | 'activeGraphDocumentId'
  | 'viewerTargetGraphDocumentId'
  | 'graphRuntimeByDocumentId'
  | 'graphDocumentIdByBuildSeq'
  | 'cachedGraphEntriesById'
  | 'cachedGraphEntryOrder'
  | 'editorViewportsById'
  | 'editorViewportOrder'
  | 'activeEditorViewportId'
>

const getGraphDocumentForViewportBridge = (
  state: BrowserViewportState,
  activeEditorViewportId: string,
  fallbackGraphDocumentId?: string,
): GraphDocument | null => {
  const activeViewport = state.editorViewportsById[activeEditorViewportId]
  if (activeViewport !== undefined) {
    return state.graphDocumentsById[activeViewport.graphDocumentId] ?? null
  }
  if (fallbackGraphDocumentId !== undefined) {
    return state.graphDocumentsById[fallbackGraphDocumentId] ?? null
  }
  return state.graphDocumentsById[state.activeGraphDocumentId] ?? null
}

const withBrowserViewportState = (
  state: BrowserViewportState,
  next: {
    graphDocumentsById?: Record<string, GraphDocument>
    graphDocumentOrder?: string[]
    graphRuntimeByDocumentId?: Record<string, GraphRuntimeState>
    graphDocumentIdByBuildSeq?: Record<number, string>
    cachedGraphEntriesById?: Record<string, CachedGraphEntry>
    cachedGraphEntryOrder?: string[]
    editorViewportsById?: Record<string, EditorViewport>
    editorViewportOrder?: string[]
    activeEditorViewportId?: string
    viewerTargetGraphDocumentId?: string | null
    fallbackGraphDocumentId?: string
  },
): GraphDocumentStateSlice & CachedGraphStateSlice & ViewportStateSlice & FeatureStackIrCacheSlice => {
  const graphDocumentsById = next.graphDocumentsById ?? state.graphDocumentsById
  const graphDocumentOrder = next.graphDocumentOrder ?? state.graphDocumentOrder
  const graphRuntimeByDocumentId = next.graphRuntimeByDocumentId ?? state.graphRuntimeByDocumentId
  const graphDocumentIdByBuildSeq =
    next.graphDocumentIdByBuildSeq ?? state.graphDocumentIdByBuildSeq
  const syncedCachedGraphState = syncCachedGraphEntries(
    graphDocumentOrder,
    next.cachedGraphEntriesById ?? state.cachedGraphEntriesById,
  )
  const editorViewportsById = next.editorViewportsById ?? state.editorViewportsById
  const editorViewportOrder = next.editorViewportOrder ?? state.editorViewportOrder
  const activeEditorViewportId = next.activeEditorViewportId ?? state.activeEditorViewportId
  const activeDocument =
    getGraphDocumentForViewportBridge(
      {
        ...state,
        graphDocumentsById,
        graphDocumentOrder,
        editorViewportsById,
        editorViewportOrder,
        activeEditorViewportId,
      },
      activeEditorViewportId,
      next.fallbackGraphDocumentId,
    ) ?? graphDocumentsById[graphDocumentOrder[0] ?? ''] ?? null

  const activeGraph = activeDocument?.graph ?? state.graph
  const viewerTargetGraphDocumentId =
    next.viewerTargetGraphDocumentId !== undefined
      ? next.viewerTargetGraphDocumentId
      : activeDocument?.graphDocumentId ??
        (state.viewerTargetGraphDocumentId !== null &&
        graphDocumentsById[state.viewerTargetGraphDocumentId] !== undefined
          ? state.viewerTargetGraphDocumentId
          : next.fallbackGraphDocumentId ?? null)

  return {
    ...withGraphAndFeatureStackCache(activeGraph),
    graphDocumentsById,
    graphDocumentOrder,
    activeGraphDocumentId: activeDocument?.graphDocumentId ?? state.activeGraphDocumentId,
    viewerTargetGraphDocumentId,
    graphRuntimeByDocumentId,
    graphDocumentIdByBuildSeq,
    ...syncedCachedGraphState,
    editorViewportsById,
    editorViewportOrder,
    activeEditorViewportId,
  }
}

const getMaxViewportZOrder = (editorViewportsById: Record<string, EditorViewport>): number =>
  Object.values(editorViewportsById).reduce((maxValue, viewport) => Math.max(maxValue, viewport.zOrder), 0)

const focusViewportCollection = (
  editorViewportsById: Record<string, EditorViewport>,
  editorViewportId: string,
): Record<string, EditorViewport> => {
  const targetViewport = editorViewportsById[editorViewportId]
  if (targetViewport === undefined) {
    return editorViewportsById
  }
  const nextZOrder = getMaxViewportZOrder(editorViewportsById) + 1
  const nextViewportsById: Record<string, EditorViewport> = {}
  for (const [currentViewportId, viewport] of Object.entries(editorViewportsById)) {
    nextViewportsById[currentViewportId] =
      currentViewportId === editorViewportId
        ? {
            ...viewport,
            isFocused: true,
            zOrder: nextZOrder,
          }
        : viewport.isFocused
          ? {
              ...viewport,
              isFocused: false,
            }
          : viewport
  }
  return nextViewportsById
}

const appendFocusedViewport = (
  state: Pick<
    SpaghettiStoreState,
    'editorViewportsById' | 'editorViewportOrder' | 'graphDocumentsById'
  >,
  graphDocumentId: string,
): {
  editorViewportId: string
  editorViewportsById: Record<string, EditorViewport>
  editorViewportOrder: string[]
} | null => {
  if (state.graphDocumentsById[graphDocumentId] === undefined) {
    return null
  }
  const editorViewportId = nextOrdinalId('editor-viewport', state.editorViewportOrder)
  const nextViewport = createEditorViewport(graphDocumentId, {
    editorViewportId,
    isFocused: true,
    zOrder: getMaxViewportZOrder(state.editorViewportsById) + 1,
  })
  return {
    editorViewportId,
    editorViewportsById: focusViewportCollection(
      {
        ...state.editorViewportsById,
        [editorViewportId]: nextViewport,
      },
      editorViewportId,
    ),
    editorViewportOrder: [...state.editorViewportOrder, editorViewportId],
  }
}

const withInitialGraphDocumentState = (
  document: GraphDocument,
): GraphDocumentStateSlice & CachedGraphStateSlice & ViewportStateSlice & FeatureStackIrCacheSlice => {
  return withBrowserViewportState(
    {
      ...withGraphAndFeatureStackCache(document.graph),
      graphDocumentsById: {
        [document.graphDocumentId]: document,
      },
      graphDocumentOrder: [document.graphDocumentId],
      activeGraphDocumentId: document.graphDocumentId,
      viewerTargetGraphDocumentId: document.graphDocumentId,
      graphRuntimeByDocumentId: {
        [document.graphDocumentId]: createGraphRuntimeState(document.graphDocumentId, document.graph),
      },
      graphDocumentIdByBuildSeq: {},
      cachedGraphEntriesById: {
        [document.graphDocumentId]: createCachedGraphEntry(document.graphDocumentId, {
          source: 'in-memory',
          isDirty: true,
        }),
      },
      cachedGraphEntryOrder: [document.graphDocumentId],
      editorViewportsById: {},
      editorViewportOrder: [],
      activeEditorViewportId: '',
    },
    {
      fallbackGraphDocumentId: document.graphDocumentId,
    },
  )
}

const withUpdatedActiveGraphDocumentState = (
  state: Pick<
    SpaghettiStoreState,
    | 'graph'
    | 'graphDocumentsById'
    | 'graphDocumentOrder'
    | 'activeGraphDocumentId'
    | 'viewerTargetGraphDocumentId'
    | 'graphRuntimeByDocumentId'
    | 'graphDocumentIdByBuildSeq'
    | 'cachedGraphEntriesById'
    | 'cachedGraphEntryOrder'
    | 'editorViewportsById'
    | 'editorViewportOrder'
    | 'activeEditorViewportId'
  >,
  graph: SpaghettiGraph,
): GraphDocumentStateSlice & CachedGraphStateSlice & ViewportStateSlice & FeatureStackIrCacheSlice => {
  return withUpdatedGraphDocumentState(state, state.activeGraphDocumentId, graph)
}

const withUpdatedGraphDocumentState = (
  state: Pick<
    SpaghettiStoreState,
    | 'graph'
    | 'graphDocumentsById'
    | 'graphDocumentOrder'
    | 'activeGraphDocumentId'
    | 'viewerTargetGraphDocumentId'
    | 'graphRuntimeByDocumentId'
    | 'graphDocumentIdByBuildSeq'
    | 'cachedGraphEntriesById'
    | 'cachedGraphEntryOrder'
    | 'editorViewportsById'
    | 'editorViewportOrder'
    | 'activeEditorViewportId'
  >,
  graphDocumentId: string,
  graph: SpaghettiGraph,
): GraphDocumentStateSlice & CachedGraphStateSlice & ViewportStateSlice & FeatureStackIrCacheSlice => {
  const targetDocument = state.graphDocumentsById[graphDocumentId]
  if (targetDocument === undefined) {
    return withInitialGraphDocumentState(createGraphDocument(graph))
  }

  const nextDocument: GraphDocument = {
    ...targetDocument,
    graph,
  }
  const currentRuntime = state.graphRuntimeByDocumentId[nextDocument.graphDocumentId]
  const nextRuntime = withUpdatedGraphRuntimeGraph(
    currentRuntime,
    nextDocument.graphDocumentId,
    graph,
  )

  return withBrowserViewportState(state, {
    graphDocumentsById: {
      ...state.graphDocumentsById,
      [nextDocument.graphDocumentId]: nextDocument,
    },
    graphRuntimeByDocumentId: {
      ...state.graphRuntimeByDocumentId,
      [nextDocument.graphDocumentId]: {
        ...nextRuntime,
        compileBuild: {
          ...nextRuntime.compileBuild,
          currentGraphRevision: (currentRuntime?.compileBuild.currentGraphRevision ?? 0) + 1,
        },
      },
    },
    cachedGraphEntriesById: {
      ...state.cachedGraphEntriesById,
      [nextDocument.graphDocumentId]: {
        ...(state.cachedGraphEntriesById[nextDocument.graphDocumentId] ??
          createCachedGraphEntry(nextDocument.graphDocumentId)),
        cachedGraphId: nextDocument.graphDocumentId,
        graphDocumentId: nextDocument.graphDocumentId,
        isDirty: true,
      },
    },
  })
}

export const selectActiveGraphDocument = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'activeGraphDocumentId' | 'graph'>,
): GraphDocument => {
  const activeDocument = state.graphDocumentsById[state.activeGraphDocumentId]
  if (activeDocument !== undefined) {
    return activeDocument
  }
  return createGraphDocument(state.graph)
}

export const selectGraphDocumentById = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById'>,
  graphDocumentId: string,
): GraphDocument | null => state.graphDocumentsById[graphDocumentId] ?? null

export const selectOrderedGraphDocuments = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'graphDocumentOrder'>,
): GraphDocument[] =>
  state.graphDocumentOrder
    .map((graphDocumentId) => state.graphDocumentsById[graphDocumentId] ?? null)
    .filter((document): document is GraphDocument => document !== null)

export const selectCachedGraphEntryById = (
  state: Pick<SpaghettiStoreState, 'cachedGraphEntriesById'>,
  cachedGraphId: string,
): CachedGraphEntry | null => state.cachedGraphEntriesById[cachedGraphId] ?? null

export const selectCachedGraphEntryByDocumentId = (
  state: Pick<SpaghettiStoreState, 'cachedGraphEntriesById'>,
  graphDocumentId: string,
): CachedGraphEntry | null =>
  Object.values(state.cachedGraphEntriesById).find(
    (entry) => entry.graphDocumentId === graphDocumentId,
  ) ?? null

export const selectOrderedCachedGraphEntries = (
  state: Pick<SpaghettiStoreState, 'cachedGraphEntriesById' | 'cachedGraphEntryOrder'>,
): CachedGraphEntry[] =>
  state.cachedGraphEntryOrder
    .map((cachedGraphId) => state.cachedGraphEntriesById[cachedGraphId] ?? null)
    .filter((entry): entry is CachedGraphEntry => entry !== null)

export const selectActiveGraph = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'activeGraphDocumentId' | 'graph'>,
): SpaghettiGraph => selectActiveGraphDocument(state).graph

export const selectViewerTargetGraphDocumentId = (
  state: Pick<SpaghettiStoreState, 'viewerTargetGraphDocumentId'>,
): string | null => state.viewerTargetGraphDocumentId

export const selectSharedViewerComposition = (
  state: Pick<SpaghettiStoreState, 'sharedViewerComposition'>,
): SharedViewerCompositionState | null => state.sharedViewerComposition

export const selectSharedViewerCompositionGraphDocumentIds = (
  state: Pick<SpaghettiStoreState, 'sharedViewerComposition'>,
): string[] =>
  state.sharedViewerComposition?.graphDocumentIds ?? EMPTY_SHARED_VIEWER_COMPOSITION_GRAPH_DOCUMENT_IDS

export const selectIsGraphDocumentInSharedViewerComposition = (
  state: Pick<SpaghettiStoreState, 'sharedViewerComposition'>,
  graphDocumentId: string,
): boolean => selectSharedViewerCompositionGraphDocumentIds(state).includes(graphDocumentId)

export const selectViewerTargetGraphDocument = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'viewerTargetGraphDocumentId'>,
): GraphDocument | null =>
  state.viewerTargetGraphDocumentId === null
    ? null
    : state.graphDocumentsById[state.viewerTargetGraphDocumentId] ?? null

export const selectViewerTargetGraph = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'viewerTargetGraphDocumentId'>,
): SpaghettiGraph | null => selectViewerTargetGraphDocument(state)?.graph ?? null

export const selectGraphByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById'>,
  graphDocumentId: string,
): SpaghettiGraph | null => selectGraphDocumentById(state, graphDocumentId)?.graph ?? null

export const selectGraphReceiveReferencesByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById'>,
  graphDocumentId: string,
): GraphReceiveReference[] =>
  selectGraphByDocumentId(state, graphDocumentId)?.receiveReferences ?? EMPTY_GRAPH_RECEIVE_REFERENCES

export const selectGraphRuntimeByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GraphRuntimeState | null => state.graphRuntimeByDocumentId[graphDocumentId] ?? null

export const selectActiveGraphRuntime = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'activeGraphDocumentId'>,
): GraphRuntimeState | null =>
  selectGraphRuntimeByDocumentId(state, state.activeGraphDocumentId)

export const selectViewerTargetGraphRuntime = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GraphRuntimeState | null =>
  state.viewerTargetGraphDocumentId === null
    ? null
    : selectGraphRuntimeByDocumentId(state, state.viewerTargetGraphDocumentId)

export const selectGraphCompileResultByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): ReturnType<typeof compileSpaghettiGraph> | null =>
  selectGraphRuntimeByDocumentId(state, graphDocumentId)?.compileBuild.lastCompileResult ?? null

export const selectActiveGraphCompileResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'activeGraphDocumentId'>,
): ReturnType<typeof compileSpaghettiGraph> | null =>
  selectActiveGraphRuntime(state)?.compileBuild.lastCompileResult ?? null

export const selectGraphPreviewPreparationByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GraphPreviewPreparation | null =>
  selectGraphRuntimeByDocumentId(state, graphDocumentId)?.previewPreparation ?? null

export const selectGraphOutputSurfaceByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GraphOutputSurface | null =>
  selectGraphRuntimeByDocumentId(state, graphDocumentId)?.outputSurface ?? null

export const selectResolvedGraphReceiveReferencesByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): ResolvedGraphReceiveReference[] => {
  const receiveReferences = selectGraphReceiveReferencesByDocumentId(state, graphDocumentId)
  if (receiveReferences.length === 0) {
    return EMPTY_RESOLVED_GRAPH_RECEIVE_REFERENCES
  }

  return receiveReferences.map((reference) => {
    const sourceEntry =
      selectGraphOutputSurfaceByDocumentId(state, reference.sourceGraphDocumentId)?.entries.find(
        (entry) => entry.outputEntryId === reference.sourceOutputEntryId,
      ) ?? null
    return {
      ...reference,
      receivingGraphDocumentId: graphDocumentId,
      sourceEntry,
      resolutionState: sourceEntry?.state === 'resolved' ? 'resolved' : 'unresolved',
    }
  })
}

export const selectViewerTargetGraphOutputSurface = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GraphOutputSurface | null =>
  selectViewerTargetGraphRuntime(state)?.outputSurface ?? null

export const selectViewerTargetGraphPreviewPreparation = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GraphPreviewPreparation | null =>
  selectViewerTargetGraphRuntime(state)?.previewPreparation ?? null

export const selectGraphAcceptedBuildOutputsByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): PartArtifact[] =>
  selectGraphRuntimeByDocumentId(state, graphDocumentId)?.acceptedBuildOutputs ?? EMPTY_PART_ARTIFACTS

export const selectViewerTargetGraphAcceptedBuildOutputs = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): PartArtifact[] =>
  selectViewerTargetGraphRuntime(state)?.acceptedBuildOutputs ?? EMPTY_PART_ARTIFACTS

export const selectViewerTargetGraphAcceptedPreviewBuildOutputs = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): PartArtifact[] =>
  selectViewerTargetGraphRuntime(state)?.acceptedPreviewBuildOutputs ?? EMPTY_PART_ARTIFACTS

export const selectViewerTargetGraphCompileResult = (
  state: Pick<
    SpaghettiStoreState,
    'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'
  >,
): ReturnType<typeof compileSpaghettiGraph> | null =>
  selectViewerTargetGraphRuntime(state)?.compileBuild.lastCompileResult ?? null

export const selectActiveGraphPreviewPreparation = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'activeGraphDocumentId'>,
): GraphPreviewPreparation | null =>
  selectActiveGraphRuntime(state)?.previewPreparation ?? null

export const selectActiveGraphPendingBuildState = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'activeGraphDocumentId'>,
): GraphCompileBuildState | null =>
  selectActiveGraphRuntime(state)?.compileBuild ?? null

export const selectEditorViewportById = (
  state: Pick<SpaghettiStoreState, 'editorViewportsById'>,
  editorViewportId: string,
): EditorViewport | null => state.editorViewportsById[editorViewportId] ?? null

export const selectActiveEditorViewport = (
  state: Pick<SpaghettiStoreState, 'editorViewportsById' | 'activeEditorViewportId'>,
): EditorViewport | null => selectEditorViewportById(state, state.activeEditorViewportId)

export const selectOrderedEditorViewports = (
  state: Pick<SpaghettiStoreState, 'editorViewportsById' | 'editorViewportOrder'>,
): EditorViewport[] =>
  state.editorViewportOrder
    .map((editorViewportId) => state.editorViewportsById[editorViewportId] ?? null)
    .filter((viewport): viewport is EditorViewport => viewport !== null)

const initialGraph = normalizeGraphForStoreCommit(emptyGraph)
const initialGraphDocument = createGraphDocument(initialGraph)

export const useSpaghettiStore = create<SpaghettiStoreState>((set, get) => ({
  ...withInitialGraphDocumentState(initialGraphDocument),
  sharedViewerComposition: null,
  edgeWaypoints: {},
  selectedNodeId: null,
  editorViewportNodeFitRequest: null,
  selectedEdgeId: null,
  hoveredEdgeId: null,
  connectionDrag: null,
  uiMessage: null,
  setGraph: (next) => {
    const nextGraph = normalizeGraphForStoreCommit(next)
    set((state) => {
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        selectedNodeId: null,
        selectedEdgeId: null,
        hoveredEdgeId: null,
        connectionDrag: null,
        edgeWaypoints: {},
        uiMessage: null,
      }
    })
  },
  applyGraphCommand: (cmd) => {
    set((state) => {
      let nextGraph = cmd(state.graph)
      nextGraph = normalizeGraphForStoreCommit(nextGraph)
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        edgeWaypoints: pruneEdgeWaypoints(nextGraph, state.edgeWaypoints),
      }
    })
  },
  applyGraphPatch: (patchFn) => {
    set((state) => {
      let nextGraph = patchFn(state.graph)
      nextGraph = normalizeGraphForStoreCommit(nextGraph)
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        edgeWaypoints: pruneEdgeWaypoints(nextGraph, state.edgeWaypoints),
      }
    })
  },
  setNodePos: (nodeId, x, y) => {
    set((state) => {
      const nextGraph = upsertNodePos(state.graph, {
        [nodeId]: { x, y },
      })
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setManyNodePos: (updates) => {
    if (updates.length === 0) {
      return
    }
    set((state) => {
      const updatesByNodeId: Record<string, GraphNodePos> = {}
      for (const update of updates) {
        updatesByNodeId[update.nodeId] = {
          x: update.x,
          y: update.y,
        }
      }
      const nextGraph = upsertNodePos(state.graph, updatesByNodeId)
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  ensureNodePositions: () => {
    set((state) => {
      const nextGraph = normalizeGraphForStoreCommit(state.graph)
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setNodeMode: (nodeId, mode) => {
    set((state) => {
      const nextGraph = upsertNodeMode(state.graph, nodeId, mode)
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  addEdge: (edge) => {
    get().applyGraphCommand(addEdgeCommand(edge))
  },
  removeEdge: (edgeId) => {
    set((state) => {
      const nextGraph = normalizeGraphForStoreCommit(removeEdgeCommand(edgeId)(state.graph))
      const nextWaypoints = { ...state.edgeWaypoints }
      delete nextWaypoints[edgeId]
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        edgeWaypoints: nextWaypoints,
        selectedEdgeId: state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
        hoveredEdgeId: state.hoveredEdgeId === edgeId ? null : state.hoveredEdgeId,
      }
    })
  },
  insertEdgeWaypoint: (edgeId, x, y, insertIndex) => {
    set((state) => {
      if (!state.graph.edges.some((edge) => edge.edgeId === edgeId)) {
        return state
      }
      const rounded: EdgeWaypoint = {
        waypointId: buildWaypointId(),
        x: Math.round(x),
        y: Math.round(y),
        flipSide1: false,
        flipSide2: false,
      }
      const current = state.edgeWaypoints[edgeId] ?? []
      const clampedIndex =
        insertIndex === undefined
          ? current.length
          : Math.max(0, Math.min(current.length, Math.floor(insertIndex)))
      const nextForEdge = [
        ...current.slice(0, clampedIndex),
        rounded,
        ...current.slice(clampedIndex),
      ]
      return {
        edgeWaypoints: {
          ...state.edgeWaypoints,
          [edgeId]: nextForEdge,
        },
      }
    })
  },
  setEdgeWaypointPos: (edgeId, waypointId, x, y) => {
    set((state) => {
      const current = state.edgeWaypoints[edgeId]
      if (current === undefined) {
        return state
      }
      const roundedX = Math.round(x)
      const roundedY = Math.round(y)
      let changed = false
      const nextForEdge = current.map((waypoint) => {
        if (waypoint.waypointId !== waypointId) {
          return waypoint
        }
        if (waypoint.x === roundedX && waypoint.y === roundedY) {
          return waypoint
        }
        changed = true
        return {
          ...waypoint,
          x: roundedX,
          y: roundedY,
        }
      })
      if (!changed) {
        return state
      }
      return {
        edgeWaypoints: {
          ...state.edgeWaypoints,
          [edgeId]: nextForEdge,
        },
      }
    })
  },
  removeEdgeWaypoint: (edgeId, waypointId) => {
    set((state) => {
      const current = state.edgeWaypoints[edgeId]
      if (current === undefined) {
        return state
      }
      const nextForEdge = current.filter((waypoint) => waypoint.waypointId !== waypointId)
      if (nextForEdge.length === current.length) {
        return state
      }
      if (nextForEdge.length === 0) {
        const nextWaypoints = { ...state.edgeWaypoints }
        delete nextWaypoints[edgeId]
        return { edgeWaypoints: nextWaypoints }
      }
      return {
        edgeWaypoints: {
          ...state.edgeWaypoints,
          [edgeId]: nextForEdge,
        },
      }
    })
  },
  toggleEdgeWaypointSide1: (edgeId, waypointId) => {
    set((state) => {
      const current = state.edgeWaypoints[edgeId]
      if (current === undefined) {
        return state
      }
      let changed = false
      const nextForEdge = current.map((waypoint) => {
        if (waypoint.waypointId !== waypointId) {
          return waypoint
        }
        changed = true
        return {
          ...waypoint,
          flipSide1: !waypoint.flipSide1,
        }
      })
      if (!changed) {
        return state
      }
      return {
        edgeWaypoints: {
          ...state.edgeWaypoints,
          [edgeId]: nextForEdge,
        },
      }
    })
  },
  toggleEdgeWaypointSide2: (edgeId, waypointId) => {
    set((state) => {
      const current = state.edgeWaypoints[edgeId]
      if (current === undefined) {
        return state
      }
      let changed = false
      const nextForEdge = current.map((waypoint) => {
        if (waypoint.waypointId !== waypointId) {
          return waypoint
        }
        changed = true
        return {
          ...waypoint,
          flipSide2: !waypoint.flipSide2,
        }
      })
      if (!changed) {
        return state
      }
      return {
        edgeWaypoints: {
          ...state.edgeWaypoints,
          [edgeId]: nextForEdge,
        },
      }
    })
  },
  setSelectedNodeId: (selectedNodeId) => {
    set({ selectedNodeId })
  },
  requestEditorViewportNodeFit: (editorViewportId, nodeId) => {
    set((state) => ({
      editorViewportNodeFitRequest: {
        editorViewportId,
        nodeId,
        key: (state.editorViewportNodeFitRequest?.key ?? 0) + 1,
      },
    }))
  },
  setSelectedEdgeId: (selectedEdgeId) => {
    set({ selectedEdgeId })
  },
  setHoveredEdgeId: (hoveredEdgeId) => {
    set({ hoveredEdgeId })
  },
  setConnectionDrag: (connectionDrag) => {
    set({ connectionDrag })
  },
  clearConnectionDrag: () => {
    set({ connectionDrag: null })
  },
  setUiMessage: (uiMessage) => {
    set({ uiMessage })
  },
  clearUiMessage: () => {
    set({ uiMessage: null })
  },
  createGraphDocument: (graph = emptyGraph, name) => {
    const nextGraph = normalizeGraphForStoreCommit(cloneGraph(graph))
    const state = get()
    const graphDocumentId = nextOrdinalId('graph-document', state.graphDocumentOrder)
    const graphName = name?.trim() || `Graph ${state.graphDocumentOrder.length + 1}`
    set((current) =>
      withBrowserViewportState(current, {
        graphDocumentsById: {
          ...current.graphDocumentsById,
          [graphDocumentId]: createGraphDocument(nextGraph, {
            graphDocumentId,
            name: graphName,
          }),
        },
        graphRuntimeByDocumentId: {
          ...current.graphRuntimeByDocumentId,
          [graphDocumentId]: createGraphRuntimeState(graphDocumentId, nextGraph),
        },
        cachedGraphEntriesById: {
          ...current.cachedGraphEntriesById,
          [graphDocumentId]: createCachedGraphEntry(graphDocumentId, {
            source: 'in-memory',
            isDirty: true,
          }),
        },
        graphDocumentOrder: [...current.graphDocumentOrder, graphDocumentId],
      }),
    )
    return graphDocumentId
  },
  duplicateActiveGraphDocument: () => {
    const state = get()
    const activeDocument = selectActiveGraphDocument(state)
    return get().createGraphDocument(
      cloneGraph(activeDocument.graph),
      `${activeDocument.name} Copy`,
    )
  },
  addGraphReceiveReference: (graphDocumentId, reference) => {
    const state = get()
    const targetGraph = selectGraphByDocumentId(state, graphDocumentId)
    if (targetGraph === null) {
      return null
    }

    const receiveId =
      reference.receiveId?.trim().length
        ? reference.receiveId.trim()
        : nextOrdinalId(
            'receive',
            (targetGraph.receiveReferences ?? EMPTY_GRAPH_RECEIVE_REFERENCES).map((entry) => entry.receiveId),
          )
    const nextGraph = upsertGraphReceiveReference(targetGraph, {
      receiveId,
      sourceGraphDocumentId: reference.sourceGraphDocumentId,
      sourceOutputEntryId: reference.sourceOutputEntryId,
      mode: reference.mode ?? 'link',
      ...(reference.receiveNodeId === undefined
        ? {}
        : { receiveNodeId: reference.receiveNodeId }),
    })

    if (nextGraph === targetGraph) {
      return receiveId
    }

    set((current) => withUpdatedGraphDocumentState(current, graphDocumentId, nextGraph))
    return receiveId
  },
  removeGraphReceiveReference: (graphDocumentId, receiveId) => {
    let removed = false
    set((state) => {
      const targetGraph = selectGraphByDocumentId(state, graphDocumentId)
      if (targetGraph === null) {
        return state
      }
      const nextGraph = removeGraphReceiveReferenceFromGraph(targetGraph, receiveId)
      if (nextGraph === targetGraph) {
        return state
      }
      removed = true
      return withUpdatedGraphDocumentState(state, graphDocumentId, nextGraph)
    })
    return removed
  },
  setGraphCompileResult: (graphDocumentId, compileResult) => {
    set((state) => {
      const runtime = state.graphRuntimeByDocumentId[graphDocumentId]
      if (runtime === undefined) {
        return state
      }
      return {
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          [graphDocumentId]: {
            ...runtime,
            compileBuild: {
              ...runtime.compileBuild,
              lastCompileResult: compileResult,
            },
          },
        },
      }
    })
  },
  stageGraphBuildRequest: (graphDocumentId, options) => {
    set((state) => {
      const runtime = state.graphRuntimeByDocumentId[graphDocumentId]
      if (runtime === undefined) {
        return state
      }
      const nextGraphDocumentIdByBuildSeq = Object.fromEntries(
        Object.entries(state.graphDocumentIdByBuildSeq).filter(
          ([seq, trackedGraphDocumentId]) =>
            trackedGraphDocumentId !== graphDocumentId ||
            Number.parseInt(seq, 10) >= options.buildSeq,
        ),
      ) as Record<number, string>
      nextGraphDocumentIdByBuildSeq[options.buildSeq] = graphDocumentId
      return {
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          [graphDocumentId]: {
            ...runtime,
            compileBuild: {
              lastCompileResult: options.compileResult,
              previousBuildInputs: options.compileResult.buildInputs ?? options.previousBuildInputs,
              pendingChangedParamIds: [...options.pendingChangedParamIds],
              pendingStatsPartKeys: [...options.pendingStatsPartKeys],
              pendingInstances: {
                heelKickInstances: [...options.pendingInstances.heelKickInstances],
                toeHookInstances: [...options.pendingInstances.toeHookInstances],
              },
              currentGraphRevision: runtime.compileBuild.currentGraphRevision,
              lastBuildSeq: options.buildSeq,
              latestIssuedGraphRevision: runtime.compileBuild.currentGraphRevision,
              latestIssuedBuildSeq: options.buildSeq,
              latestAcceptedGraphRevision: runtime.compileBuild.latestAcceptedGraphRevision,
              latestAcceptedBuildSeq: runtime.compileBuild.latestAcceptedBuildSeq,
              inFlightGraphRevision: runtime.compileBuild.currentGraphRevision,
              inFlightBuildRequestId: options.buildRequestId,
              inFlightBuildSeq: options.buildSeq,
            },
            previewPreparation: {
              ...runtime.previewPreparation,
              buildStatsReadyPartKeys: [...options.pendingStatsPartKeys],
            },
          },
        },
        graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
      }
    })
  },
  acceptGraphBuildResult: (routingIdentity) => {
    let accepted = false
    set((state) => {
      const trackedGraphDocumentId = state.graphDocumentIdByBuildSeq[routingIdentity.buildSeq]
      if (trackedGraphDocumentId !== routingIdentity.graphDocumentId) {
        return state
      }
      const runtime = state.graphRuntimeByDocumentId[routingIdentity.graphDocumentId]
      if (runtime === undefined) {
        return state
      }
      const compileBuild = runtime.compileBuild
      if (
        compileBuild.inFlightBuildSeq !== routingIdentity.buildSeq ||
        compileBuild.inFlightBuildRequestId !== routingIdentity.buildRequestId ||
        routingIdentity.buildSeq < compileBuild.latestIssuedBuildSeq ||
        (compileBuild.latestAcceptedBuildSeq !== null &&
          routingIdentity.buildSeq <= compileBuild.latestAcceptedBuildSeq)
      ) {
        return state
      }

      const nextGraphDocumentIdByBuildSeq = { ...state.graphDocumentIdByBuildSeq }
      delete nextGraphDocumentIdByBuildSeq[routingIdentity.buildSeq]
      accepted = true
      const acceptedBuildOutputs = Array.isArray(routingIdentity.buildOutputs)
        ? [...routingIdentity.buildOutputs]
        : runtime.acceptedBuildOutputs

      return {
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          [routingIdentity.graphDocumentId]: {
            ...runtime,
            compileBuild: {
              ...compileBuild,
              lastBuildSeq: routingIdentity.buildSeq,
              latestAcceptedGraphRevision: compileBuild.inFlightGraphRevision,
              latestAcceptedBuildSeq: routingIdentity.buildSeq,
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
            },
            acceptedBuildOutputs,
            acceptedPreviewBuildOutputs: Array.isArray(routingIdentity.buildOutputs)
              ? [...routingIdentity.buildOutputs]
              : runtime.acceptedPreviewBuildOutputs,
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: routingIdentity.graphDocumentId,
              previewPreparation: runtime.previewPreparation,
              acceptedBuildOutputs,
              publishedAtBuildSeq: routingIdentity.buildSeq,
            }),
          },
        },
        graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
      }
    })
    return accepted
  },
  clearGraphBuildRequest: (routingIdentity) => {
    let cleared = false
    set((state) => {
      const trackedGraphDocumentId = state.graphDocumentIdByBuildSeq[routingIdentity.buildSeq]
      if (trackedGraphDocumentId !== routingIdentity.graphDocumentId) {
        return state
      }
      const runtime = state.graphRuntimeByDocumentId[routingIdentity.graphDocumentId]
      if (runtime === undefined) {
        return state
      }
      const compileBuild = runtime.compileBuild
      if (
        compileBuild.inFlightBuildSeq !== routingIdentity.buildSeq ||
        compileBuild.inFlightBuildRequestId !== routingIdentity.buildRequestId
      ) {
        return state
      }

      const nextGraphDocumentIdByBuildSeq = { ...state.graphDocumentIdByBuildSeq }
      delete nextGraphDocumentIdByBuildSeq[routingIdentity.buildSeq]
      cleared = true

      return {
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          [routingIdentity.graphDocumentId]: {
            ...runtime,
            compileBuild: {
              ...compileBuild,
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
            },
          },
        },
        graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
      }
    })
    return cleared
  },
  saveCachedGraphEntryToFile: async (cachedGraphId, options) => {
    const state = get()
    const entry = state.cachedGraphEntriesById[cachedGraphId]
    if (entry === undefined) {
      throw new Error(`Cached graph entry "${cachedGraphId}" was not found.`)
    }
    const document = state.graphDocumentsById[entry.graphDocumentId]
    if (document === undefined) {
      throw new Error(`Graph document "${entry.graphDocumentId}" was not found.`)
    }

    await saveGraphDocumentToFileCommand(
      document,
      options?.filename !== undefined
        ? {
            filename: options.filename,
          }
        : undefined,
      options?.env,
    )

    const savedAt = options?.savedAt ?? new Date().toISOString()
    set((current) => {
      const currentEntry = current.cachedGraphEntriesById[cachedGraphId]
      if (currentEntry === undefined) {
        return current
      }
      return {
        cachedGraphEntriesById: {
          ...current.cachedGraphEntriesById,
          [cachedGraphId]: {
            ...currentEntry,
            isDirty: false,
            lastSavedAt: savedAt,
          },
        },
      }
    })
  },
  loadGraphDocumentFromFile: async (options) => {
    const loadedDocument = await loadGraphDocumentFromFileCommand(undefined, options?.env)
    const graphDocumentId = loadedDocument.graphDocumentId
    const nextGraph = normalizeGraphForStoreCommit(cloneGraph(loadedDocument.graph))
    const nextDocument: GraphDocument = {
      ...loadedDocument,
      graph: nextGraph,
    }

    set((current) =>
      withBrowserViewportState(current, {
        graphDocumentsById: {
          ...current.graphDocumentsById,
          [graphDocumentId]: nextDocument,
        },
        graphRuntimeByDocumentId: {
          ...current.graphRuntimeByDocumentId,
          [graphDocumentId]: createGraphRuntimeState(graphDocumentId, nextGraph),
        },
        cachedGraphEntriesById: {
          ...current.cachedGraphEntriesById,
          [graphDocumentId]: createCachedGraphEntry(graphDocumentId, {
            source: 'file-load',
            isDirty: false,
          }),
        },
        graphDocumentOrder: current.graphDocumentOrder.includes(graphDocumentId)
          ? current.graphDocumentOrder
          : [...current.graphDocumentOrder, graphDocumentId],
        fallbackGraphDocumentId: graphDocumentId,
      }),
    )

    return graphDocumentId
  },
  openGraphDocumentInViewport: (graphDocumentId) => {
    const state = get()
    if (state.graphDocumentsById[graphDocumentId] === undefined) {
      return null
    }
    const existingViewport = Object.values(state.editorViewportsById).find(
      (viewport) => viewport.graphDocumentId === graphDocumentId,
    )
    if (existingViewport !== undefined) {
      get().setActiveEditorViewportId(existingViewport.editorViewportId)
      return existingViewport.editorViewportId
    }

    const nextViewportState = appendFocusedViewport(state, graphDocumentId)
    if (nextViewportState === null) {
      return null
    }
    set((current) => {
      return withBrowserViewportState(current, {
        editorViewportsById: nextViewportState.editorViewportsById,
        editorViewportOrder: nextViewportState.editorViewportOrder,
        activeEditorViewportId: nextViewportState.editorViewportId,
      })
    })
    return nextViewportState.editorViewportId
  },
  openGraphDocumentInNewViewport: (graphDocumentId) => {
    const state = get()
    const nextViewportState = appendFocusedViewport(state, graphDocumentId)
    if (nextViewportState === null) {
      return null
    }
    set((current) =>
      withBrowserViewportState(current, {
        editorViewportsById: nextViewportState.editorViewportsById,
        editorViewportOrder: nextViewportState.editorViewportOrder,
        activeEditorViewportId: nextViewportState.editorViewportId,
      }),
    )
    return nextViewportState.editorViewportId
  },
  bindEditorViewportToGraphDocument: (editorViewportId, graphDocumentId) => {
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined || state.graphDocumentsById[graphDocumentId] === undefined) {
        return state
      }
      const nextViewportsById = focusViewportCollection(
        {
          ...state.editorViewportsById,
          [editorViewportId]: {
            ...viewport,
            graphDocumentId,
          },
        },
        editorViewportId,
      )
      return withBrowserViewportState(state, {
        editorViewportsById: nextViewportsById,
        activeEditorViewportId: editorViewportId,
      })
    })
  },
  swapFocusedEditorViewportToGraphDocument: (graphDocumentId) => {
    const state = get()
    if (state.activeEditorViewportId.length === 0) {
      return null
    }
    const activeViewport = state.editorViewportsById[state.activeEditorViewportId]
    if (activeViewport === undefined || state.graphDocumentsById[graphDocumentId] === undefined) {
      return null
    }
    get().bindEditorViewportToGraphDocument(activeViewport.editorViewportId, graphDocumentId)
    return activeViewport.editorViewportId
  },
  loadGraphDocumentIntoNewGraphFromFile: async (options) => {
    const loadedDocument = await loadGraphDocumentFromFileCommand(undefined, options?.env)
    const nextGraph = normalizeGraphForStoreCommit(cloneGraph(loadedDocument.graph))
    const state = get()
    const graphDocumentId = nextOrdinalId('graph-document', state.graphDocumentOrder)

    set((current) =>
      withBrowserViewportState(current, {
        graphDocumentsById: {
          ...current.graphDocumentsById,
          [graphDocumentId]: createGraphDocument(nextGraph, {
            graphDocumentId,
            name: loadedDocument.name,
          }),
        },
        graphRuntimeByDocumentId: {
          ...current.graphRuntimeByDocumentId,
          [graphDocumentId]: createGraphRuntimeState(graphDocumentId, nextGraph),
        },
        cachedGraphEntriesById: {
          ...current.cachedGraphEntriesById,
          [graphDocumentId]: createCachedGraphEntry(graphDocumentId, {
            source: 'in-memory',
            isDirty: true,
          }),
        },
        graphDocumentOrder: [...current.graphDocumentOrder, graphDocumentId],
        fallbackGraphDocumentId: graphDocumentId,
      }),
    )

    return graphDocumentId
  },
  saveFocusedEditorViewportGraphToFile: async (options) => {
    const state = get()
    const activeViewport = selectActiveEditorViewport(state)
    if (activeViewport === null) {
      throw new Error('There is no focused editor viewport to save.')
    }
    const entry = selectCachedGraphEntryByDocumentId(state, activeViewport.graphDocumentId)
    if (entry === null) {
      throw new Error(
        `Cached graph entry for graph document "${activeViewport.graphDocumentId}" was not found.`,
      )
    }
    await get().saveCachedGraphEntryToFile(entry.cachedGraphId, options)
  },
  closeEditorViewport: (editorViewportId) => {
    set((state) => {
      if (state.editorViewportsById[editorViewportId] === undefined) {
        return state
      }
      const nextViewportsById = { ...state.editorViewportsById }
      delete nextViewportsById[editorViewportId]
      const nextEditorViewportOrder = state.editorViewportOrder.filter(
        (currentViewportId) => currentViewportId !== editorViewportId,
      )
      const fallbackViewportId =
        state.activeEditorViewportId === editorViewportId
          ? [...Object.values(nextViewportsById)]
              .sort((a, b) => b.zOrder - a.zOrder)
              .map((viewport) => viewport.editorViewportId)[0] ?? ''
          : state.activeEditorViewportId

      const focusedViewportsById =
        fallbackViewportId.length > 0
          ? focusViewportCollection(nextViewportsById, fallbackViewportId)
          : nextViewportsById

      return withBrowserViewportState(state, {
        editorViewportsById: focusedViewportsById,
        editorViewportOrder: nextEditorViewportOrder,
        activeEditorViewportId: fallbackViewportId,
      })
    })
  },
  setActiveEditorViewportId: (editorViewportId) => {
    set((state) => {
      const nextViewport = state.editorViewportsById[editorViewportId]
      if (nextViewport === undefined) {
        return state
      }
      const nextViewportsById = focusViewportCollection(state.editorViewportsById, editorViewportId)
      return withBrowserViewportState(state, {
        editorViewportsById: nextViewportsById,
        activeEditorViewportId: editorViewportId,
      })
    })
  },
  setViewerTargetGraphDocumentId: (graphDocumentId) => {
    set((state) => {
      if (graphDocumentId !== null && state.graphDocumentsById[graphDocumentId] === undefined) {
        return state
      }
      if (state.viewerTargetGraphDocumentId === graphDocumentId) {
        return state
      }
      return {
        viewerTargetGraphDocumentId: graphDocumentId,
      }
    })
  },
  addEditorViewportGraphToSharedViewerComposition: (editorViewportId) => {
    const viewport = selectEditorViewportById(get(), editorViewportId)
    if (viewport === null) {
      return null
    }
    const graphDocumentId = viewport.graphDocumentId
    set((state) => {
      if (state.graphDocumentsById[graphDocumentId] === undefined) {
        return state
      }
      const nextComposition = addGraphDocumentIdToSharedViewerComposition(
        state.sharedViewerComposition,
        graphDocumentId,
      )
      if (nextComposition === state.sharedViewerComposition) {
        return state
      }
      return {
        sharedViewerComposition: nextComposition,
      }
    })
    return graphDocumentId
  },
  removeEditorViewportGraphFromSharedViewerComposition: (editorViewportId) => {
    const viewport = selectEditorViewportById(get(), editorViewportId)
    if (viewport === null) {
      return null
    }
    const graphDocumentId = viewport.graphDocumentId
    set((state) => {
      const nextComposition = removeGraphDocumentIdFromSharedViewerComposition(
        state.sharedViewerComposition,
        graphDocumentId,
      )
      if (nextComposition === state.sharedViewerComposition) {
        return state
      }
      return {
        sharedViewerComposition: nextComposition,
      }
    })
    return graphDocumentId
  },
  setEditorViewportWindowMode: (editorViewportId, windowMode) => {
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined || viewport.windowMode === windowMode) {
        if (viewport?.windowMode !== 'collapsed' && viewport?.windowMode !== 'maximized' && viewport?.windowMode !== 'split view') {
          return state
        }
      }

      const resolveRestoreFromCollapsed = (): EditorViewport => {
        const restore = viewport.restoreFromCollapsed
        if (restore === null) {
          return {
            ...viewport,
            windowMode: 'expanded',
            position: defaultViewportPosition,
            size: defaultViewportSize,
            restoreFromCollapsed: null,
          }
        }
        return {
          ...viewport,
          windowMode: restore.windowMode,
          position: restore.position ?? viewport.position,
          size: restore.size ?? viewport.size,
          splitRatio: restore.splitRatio ?? viewport.splitRatio,
          restoreFromCollapsed: null,
        }
      }

      const resolveRestoreFromSplit = (): EditorViewport => {
        const restore = viewport.restoreFromSplit
        if (restore === null) {
          return {
            ...viewport,
            windowMode: 'expanded',
            position: defaultViewportPosition,
            size: defaultViewportSize,
            restoreFromSplit: null,
          }
        }
        return {
          ...viewport,
          windowMode: restore.windowMode,
          position: restore.position ?? viewport.position,
          size: restore.size ?? viewport.size,
          restoreFromSplit: null,
        }
      }

      let nextViewport: EditorViewport

      if (windowMode === 'collapsed') {
        nextViewport =
          viewport.windowMode === 'collapsed'
            ? resolveRestoreFromCollapsed()
            : {
                ...viewport,
                windowMode: 'collapsed',
                restoreFromCollapsed: snapshotCollapsedRestoreState(viewport),
              }
      } else if (windowMode === 'maximized') {
        nextViewport =
          viewport.windowMode === 'maximized'
            ? {
                ...viewport,
                windowMode: 'expanded',
                position: defaultViewportPosition,
                size: defaultViewportSize,
                restoreFromCollapsed: null,
                restoreFromSplit: null,
              }
            : {
                ...viewport,
                windowMode: 'maximized',
                restoreFromCollapsed: null,
                restoreFromSplit: null,
              }
      } else if (windowMode === 'split view') {
        if (viewport.windowMode === 'split view') {
          nextViewport = resolveRestoreFromSplit()
        } else if (viewport.windowMode === 'collapsed') {
          nextViewport = {
            ...viewport,
            windowMode: 'split view',
            splitRatio: defaultViewportSplitRatio,
            restoreFromCollapsed: null,
            restoreFromSplit:
              viewport.restoreFromSplit ??
              (viewport.restoreFromCollapsed !== null &&
              viewport.restoreFromCollapsed.windowMode !== 'split view'
                ? {
                    windowMode: viewport.restoreFromCollapsed.windowMode,
                    position: viewport.restoreFromCollapsed.position,
                    size: viewport.restoreFromCollapsed.size,
                  }
                : snapshotExpandedRestoreState(viewport)),
          }
        } else {
          nextViewport = {
            ...viewport,
            windowMode: 'split view',
            splitRatio: defaultViewportSplitRatio,
            restoreFromCollapsed: null,
            restoreFromSplit:
              viewport.windowMode === 'maximized'
                ? {
                    windowMode: 'maximized',
                    position: viewport.position,
                    size: viewport.size,
                  }
                : snapshotExpandedRestoreState(viewport),
          }
        }
      } else if (windowMode === 'meatball editor view') {
        nextViewport = {
          ...viewport,
          windowMode: 'meatball editor view',
          restoreFromCollapsed: null,
          restoreFromSplit: null,
        }
      } else {
        nextViewport = {
          ...viewport,
          windowMode,
        }
      }

      const nextViewportsById: Record<string, EditorViewport> = {}
      for (const [currentViewportId, currentViewport] of Object.entries(state.editorViewportsById)) {
        if (
          currentViewportId !== editorViewportId &&
          nextViewport.windowMode === 'meatball editor view' &&
          currentViewport.windowMode === 'meatball editor view'
        ) {
          nextViewportsById[currentViewportId] = {
            ...currentViewport,
            windowMode: 'expanded',
            restoreFromCollapsed: null,
            restoreFromSplit: null,
          }
          continue
        }
        nextViewportsById[currentViewportId] =
          currentViewportId === editorViewportId ? nextViewport : currentViewport
      }
      return withBrowserViewportState(state, {
        editorViewportsById: nextViewportsById,
      })
    })
  },
  setEditorViewportSplitRatio: (editorViewportId, splitRatio) => {
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      const nextSplitRatio = clampViewportSplitRatio(splitRatio)
      if (viewport.splitRatio === nextSplitRatio) {
        return state
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: {
            ...viewport,
            splitRatio: nextSplitRatio,
          },
        },
      }
    })
  },
  setEditorViewportPosition: (editorViewportId, position) => {
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: {
            ...viewport,
            position: {
              x: Math.round(position.x),
              y: Math.round(position.y),
            },
          },
        },
      }
    })
  },
  setEditorViewportSize: (editorViewportId, size) => {
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: {
            ...viewport,
            size: {
              width: Math.round(size.width),
              height: Math.round(size.height),
            },
          },
        },
      }
    })
  },
  addSketchFeature: (nodeId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) => [
        ...stack,
        createSketchFeature(),
      ])
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  addCloseProfileFeature: (nodeId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) => [
        ...stack,
        createCloseProfileFeature(),
      ])
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  addExtrudeFeature: (nodeId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) => {
        const profileRef = pickDefaultProfileRef(stack, stack.length)
        return [
          ...stack,
          {
            type: 'extrude',
            featureId: newId('feature'),
            inputs: {
              profileRef,
            },
            params: {
              depth: {
                kind: 'lit',
                value: 10,
              },
              taper: {
                kind: 'lit',
                value: 0,
              },
              offset: {
                kind: 'lit',
                value: 0,
              },
            },
            outputs: {
              bodyId: newId('body'),
            },
            uiState: {
              collapsed: false,
            },
          },
        ]
      })
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  toggleFeatureCollapsed: (nodeId, featureId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) =>
          feature.featureId !== featureId
            ? feature
            : {
                ...feature,
                uiState: {
                  ...feature.uiState,
                  collapsed: !feature.uiState.collapsed,
                },
              },
        ),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  addSketchComponent: (nodeId, featureId, componentType) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) => {
          if (feature.featureId !== featureId || feature.type !== 'sketch') {
            return feature
          }
          return recomputeSketchFeature({
            ...feature,
            components: [...feature.components, createDefaultComponent(componentType)],
          })
        }),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  moveFeatureUp: (nodeId, featureId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        moveFeatureInStack(stack, featureId, 'up'),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  moveFeatureDown: (nodeId, featureId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        moveFeatureInStack(stack, featureId, 'down'),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setFeatureEnabled: (nodeId, featureId, enabled) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) =>
          feature.featureId !== featureId
            ? feature
            : feature.enabled === enabled
              ? feature
              : {
                  ...feature,
                  enabled,
                },
        ),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  updateSketchComponentPoint: (nodeId, featureId, rowId, pointKey, value) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) => {
          if (feature.featureId !== featureId || feature.type !== 'sketch') {
            return feature
          }
          const components = feature.components.map((component) => {
            if (component.rowId !== rowId) {
              return component
            }
            if (!(pointKey in component)) {
              return component
            }
            return {
              ...component,
              [pointKey]: value,
            } as SketchComponent
          })
          return recomputeSketchFeature({
            ...feature,
            components,
          })
        }),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  moveSketchComponentUp: (nodeId, featureId, rowId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) => {
          if (feature.featureId !== featureId || feature.type !== 'sketch') {
            return feature
          }
          const index = feature.components.findIndex((component) => component.rowId === rowId)
          if (index <= 0) return feature
          const next = feature.components.slice()
          const temp = next[index - 1]
          next[index - 1] = next[index]
          next[index] = temp
          return recomputeSketchFeature({
            ...feature,
            components: next,
          })
        }),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  moveSketchComponentDown: (nodeId, featureId, rowId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) => {
          if (feature.featureId !== featureId || feature.type !== 'sketch') {
            return feature
          }
          const index = feature.components.findIndex((component) => component.rowId === rowId)
          if (index < 0 || index >= feature.components.length - 1) return feature
          const next = feature.components.slice()
          const temp = next[index + 1]
          next[index + 1] = next[index]
          next[index] = temp
          return recomputeSketchFeature({
            ...feature,
            components: next,
          })
        }),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  removeSketchComponent: (nodeId, featureId, rowId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) => {
          if (feature.featureId !== featureId || feature.type !== 'sketch') {
            return feature
          }
          const components = feature.components.filter((component) => component.rowId !== rowId)
          if (components.length === feature.components.length) return feature
          return recomputeSketchFeature({
            ...feature,
            components,
          })
        }),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setSketchRectangleDimensions: (nodeId, featureId, dimensions) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) =>
          feature.featureId !== featureId || feature.type !== 'sketch'
            ? feature
            : rewriteCubeSeedRectangleSketch(feature, dimensions),
        ),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setCloseProfileSource: (nodeId, featureId, sourceSketchFeatureId) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) =>
          feature.featureId !== featureId || feature.type !== 'closeProfile'
            ? feature
            : {
                ...feature,
                inputs: {
                  ...feature.inputs,
                  sourceSketchFeatureId,
                },
              },
        ),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  // Legacy compatibility wrappers.
  addSketchLine: (nodeId, featureId) => {
    get().addSketchComponent(nodeId, featureId, 'line')
  },
  updateSketchLineEndpoint: (nodeId, featureId, entityId, which, value) => {
    const pointKey = which === 'start' ? 'a' : 'b'
    get().updateSketchComponentPoint(nodeId, featureId, entityId, pointKey, value)
  },
  setExtrudeDepth: (nodeId, featureId, depth) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) =>
          feature.featureId !== featureId || feature.type !== 'extrude'
            ? feature
            : {
                ...feature,
                params: {
                  ...feature.params,
                  depth,
                },
              },
        ),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setExtrudeTaper: (nodeId, featureId, taper) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) =>
          feature.featureId !== featureId || feature.type !== 'extrude'
            ? feature
            : {
                ...feature,
                params: {
                  ...feature.params,
                  taper,
                },
              },
        ),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setExtrudeOffset: (nodeId, featureId, offset) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) =>
          feature.featureId !== featureId || feature.type !== 'extrude'
            ? feature
            : {
                ...feature,
                params: {
                  ...feature.params,
                  offset,
                },
              },
        ),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setExtrudeProfileRef: (nodeId, featureId, ref) => {
    set((state) => {
      const nextGraph = updatePartNodeFeatureStack(state.graph, nodeId, (stack) =>
        stack.map((feature) =>
          feature.featureId !== featureId || feature.type !== 'extrude'
            ? feature
            : {
                ...feature,
                inputs: {
                  ...feature.inputs,
                  profileRef: ref,
                },
              },
        ),
      )
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  getPartFeatureStackIrForNode: (nodeId) => {
    const partKey = get().partKeyByNodeId[nodeId]
    if (partKey === undefined) {
      return null
    }
    return get().partFeatureStackIrByPartKey[partKey] ?? null
  },
  validate: () => compileSpaghettiGraph(selectActiveGraph(get())),
}))
