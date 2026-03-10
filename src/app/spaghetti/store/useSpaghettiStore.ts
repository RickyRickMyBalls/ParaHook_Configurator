import { create } from 'zustand'
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
import { prepareGraphPreviewPreparation, type GraphPreviewPreparation } from '../previewPreparation'
import { getNodeDef } from '../registry/nodeRegistry'
import { ensureOutputPreviewSingletonPatch } from '../system/ensureOutputPreviewSingleton'
import { ensureOutputPreviewSlotsPatch } from '../system/ensureOutputPreviewSlots'
import type { ViewMode } from '../canvas/rowViewMode'
import type {
  EdgeEndpoint,
  EditorViewport,
  EditorViewportPosition,
  EditorViewportSize,
  GraphDocument,
  GraphNodePos,
  NodeRowMode,
  SpaghettiEdge,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'
import { newId } from '../utils/id'
import { makeComponentId, makeRowId } from '../utils/id'

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
  lastBuildSeq: number | null
}

export type GraphRuntimeState = {
  compileBuild: GraphCompileBuildState
  previewPreparation: GraphPreviewPreparation
}

export type SpaghettiStoreState = {
  graph: SpaghettiGraph
  graphDocumentsById: Record<string, GraphDocument>
  graphDocumentOrder: string[]
  activeGraphDocumentId: string
  graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
  graphDocumentIdByBuildSeq: Record<number, string>
  editorViewportsById: Record<string, EditorViewport>
  editorViewportOrder: string[]
  activeEditorViewportId: string
  partFeatureStackIrByPartKey: FeatureStackIrParts
  partKeyByNodeId: Record<string, string>
  edgeWaypoints: Record<string, EdgeWaypoint[]>
  selectedNodeId: string | null
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
  setSelectedEdgeId: (edgeId: string | null) => void
  setHoveredEdgeId: (edgeId: string | null) => void
  setConnectionDrag: (drag: ConnectionDragState | null) => void
  clearConnectionDrag: () => void
  setUiMessage: (message: CanvasUiMessage | null) => void
  clearUiMessage: () => void
  createGraphDocument: (graph?: SpaghettiGraph, name?: string) => string
  duplicateActiveGraphDocument: () => string
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
      buildSeq: number
    },
  ) => void
  acceptGraphBuildResult: (buildSeq: number) => void
  clearGraphBuildRequest: (buildSeq: number) => void
  openGraphDocumentInViewport: (graphDocumentId: string) => string | null
  bindEditorViewportToGraphDocument: (editorViewportId: string, graphDocumentId: string) => void
  closeEditorViewport: (editorViewportId: string) => void
  setActiveEditorViewportId: (editorViewportId: string) => void
  setEditorViewportWindowMode: (
    editorViewportId: string,
    windowMode: EditorViewport['windowMode'],
  ) => void
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
  | 'graphRuntimeByDocumentId'
  | 'graphDocumentIdByBuildSeq'
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
const defaultViewportPosition: EditorViewportPosition = { x: 12, y: 12 }
const defaultViewportSize: EditorViewportSize = { width: 980, height: 760 }

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

  return {
    ...graph,
    nodes: normalizedNodes,
    edges: normalizedEdges,
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
  zOrder: options?.zOrder ?? 1,
})

const createEmptyGraphCompileBuildState = (): GraphCompileBuildState => ({
  lastCompileResult: null,
  previousBuildInputs: null,
  pendingChangedParamIds: [],
  pendingStatsPartKeys: [],
  pendingInstances: null,
  lastBuildSeq: null,
})

const createGraphRuntimeState = (graph: SpaghettiGraph): GraphRuntimeState => ({
  compileBuild: createEmptyGraphCompileBuildState(),
  previewPreparation: prepareGraphPreviewPreparation(graph),
})

const withUpdatedGraphRuntimeGraph = (
  runtime: GraphRuntimeState | undefined,
  graph: SpaghettiGraph,
): GraphRuntimeState => ({
  compileBuild: runtime?.compileBuild ?? createEmptyGraphCompileBuildState(),
  previewPreparation: {
    ...prepareGraphPreviewPreparation(graph),
    buildStatsReadyPartKeys:
      runtime?.previewPreparation.buildStatsReadyPartKeys ?? [],
  },
})

type BrowserViewportState = Pick<
  SpaghettiStoreState,
  | 'graph'
  | 'graphDocumentsById'
  | 'graphDocumentOrder'
  | 'activeGraphDocumentId'
  | 'graphRuntimeByDocumentId'
  | 'graphDocumentIdByBuildSeq'
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
    editorViewportsById?: Record<string, EditorViewport>
    editorViewportOrder?: string[]
    activeEditorViewportId?: string
    fallbackGraphDocumentId?: string
  },
): GraphDocumentStateSlice & ViewportStateSlice & FeatureStackIrCacheSlice => {
  const graphDocumentsById = next.graphDocumentsById ?? state.graphDocumentsById
  const graphDocumentOrder = next.graphDocumentOrder ?? state.graphDocumentOrder
  const graphRuntimeByDocumentId = next.graphRuntimeByDocumentId ?? state.graphRuntimeByDocumentId
  const graphDocumentIdByBuildSeq =
    next.graphDocumentIdByBuildSeq ?? state.graphDocumentIdByBuildSeq
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

  return {
    ...withGraphAndFeatureStackCache(activeGraph),
    graphDocumentsById,
    graphDocumentOrder,
    activeGraphDocumentId: activeDocument?.graphDocumentId ?? state.activeGraphDocumentId,
    graphRuntimeByDocumentId,
    graphDocumentIdByBuildSeq,
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

const withInitialGraphDocumentState = (
  document: GraphDocument,
): GraphDocumentStateSlice & ViewportStateSlice & FeatureStackIrCacheSlice => {
  return withBrowserViewportState(
    {
      ...withGraphAndFeatureStackCache(document.graph),
      graphDocumentsById: {
        [document.graphDocumentId]: document,
      },
      graphDocumentOrder: [document.graphDocumentId],
      activeGraphDocumentId: document.graphDocumentId,
      graphRuntimeByDocumentId: {
        [document.graphDocumentId]: createGraphRuntimeState(document.graph),
      },
      graphDocumentIdByBuildSeq: {},
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
    | 'graphRuntimeByDocumentId'
    | 'graphDocumentIdByBuildSeq'
    | 'editorViewportsById'
    | 'editorViewportOrder'
    | 'activeEditorViewportId'
  >,
  graph: SpaghettiGraph,
): GraphDocumentStateSlice & ViewportStateSlice & FeatureStackIrCacheSlice => {
  const activeDocument = state.graphDocumentsById[state.activeGraphDocumentId]
  if (activeDocument === undefined) {
    return withInitialGraphDocumentState(createGraphDocument(graph))
  }

  const nextDocument: GraphDocument = {
    ...activeDocument,
    graph,
  }

  return withBrowserViewportState(state, {
    graphDocumentsById: {
      ...state.graphDocumentsById,
      [nextDocument.graphDocumentId]: nextDocument,
    },
    graphRuntimeByDocumentId: {
      ...state.graphRuntimeByDocumentId,
      [nextDocument.graphDocumentId]: withUpdatedGraphRuntimeGraph(
        state.graphRuntimeByDocumentId[nextDocument.graphDocumentId],
        graph,
      ),
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

export const selectActiveGraph = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'activeGraphDocumentId' | 'graph'>,
): SpaghettiGraph => selectActiveGraphDocument(state).graph

export const selectGraphByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById'>,
  graphDocumentId: string,
): SpaghettiGraph | null => selectGraphDocumentById(state, graphDocumentId)?.graph ?? null

export const selectGraphRuntimeByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GraphRuntimeState | null => state.graphRuntimeByDocumentId[graphDocumentId] ?? null

export const selectActiveGraphRuntime = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'activeGraphDocumentId'>,
): GraphRuntimeState | null =>
  selectGraphRuntimeByDocumentId(state, state.activeGraphDocumentId)

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
  edgeWaypoints: {},
  selectedNodeId: null,
  selectedEdgeId: null,
  hoveredEdgeId: null,
  connectionDrag: null,
  uiMessage: null,
  setGraph: (next) => {
    const nextGraph = normalizeGraphForStoreCommit(next)
    set((state) => {
      const nextState = withUpdatedActiveGraphDocumentState(state, nextGraph)
      const activeGraphDocumentId = nextState.activeGraphDocumentId
      const nextGraphDocumentIdByBuildSeq = Object.fromEntries(
        Object.entries(nextState.graphDocumentIdByBuildSeq).filter(
          ([, graphDocumentId]) => graphDocumentId !== activeGraphDocumentId,
        ),
      ) as Record<number, string>
      return {
        ...nextState,
        graphRuntimeByDocumentId: {
          ...nextState.graphRuntimeByDocumentId,
          [activeGraphDocumentId]: createGraphRuntimeState(nextGraph),
        },
        graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
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
          [graphDocumentId]: createGraphRuntimeState(nextGraph),
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
      return {
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          [graphDocumentId]: {
            compileBuild: {
              lastCompileResult: options.compileResult,
              previousBuildInputs: options.compileResult.buildInputs ?? options.previousBuildInputs,
              pendingChangedParamIds: [...options.pendingChangedParamIds],
              pendingStatsPartKeys: [...options.pendingStatsPartKeys],
              pendingInstances: {
                heelKickInstances: [...options.pendingInstances.heelKickInstances],
                toeHookInstances: [...options.pendingInstances.toeHookInstances],
              },
              lastBuildSeq: options.buildSeq,
            },
            previewPreparation: {
              ...runtime.previewPreparation,
              buildStatsReadyPartKeys: [...options.pendingStatsPartKeys],
            },
          },
        },
        graphDocumentIdByBuildSeq: {
          ...state.graphDocumentIdByBuildSeq,
          [options.buildSeq]: graphDocumentId,
        },
      }
    })
  },
  acceptGraphBuildResult: (buildSeq) => {
    set((state) => {
      const graphDocumentId = state.graphDocumentIdByBuildSeq[buildSeq]
      if (graphDocumentId === undefined) {
        return state
      }
      const runtime = state.graphRuntimeByDocumentId[graphDocumentId]
      if (runtime === undefined) {
        const nextGraphDocumentIdByBuildSeq = { ...state.graphDocumentIdByBuildSeq }
        delete nextGraphDocumentIdByBuildSeq[buildSeq]
        return {
          graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
        }
      }

      const nextGraphDocumentIdByBuildSeq = { ...state.graphDocumentIdByBuildSeq }
      delete nextGraphDocumentIdByBuildSeq[buildSeq]

      return {
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          [graphDocumentId]: {
            ...runtime,
            compileBuild: {
              ...runtime.compileBuild,
              lastBuildSeq: buildSeq,
            },
          },
        },
        graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
      }
    })
  },
  clearGraphBuildRequest: (buildSeq) => {
    set((state) => {
      if (state.graphDocumentIdByBuildSeq[buildSeq] === undefined) {
        return state
      }
      const nextGraphDocumentIdByBuildSeq = { ...state.graphDocumentIdByBuildSeq }
      delete nextGraphDocumentIdByBuildSeq[buildSeq]
      return {
        graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
      }
    })
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

    const editorViewportId = nextOrdinalId('editor-viewport', state.editorViewportOrder)
    set((current) => {
      const nextViewport = createEditorViewport(graphDocumentId, {
        editorViewportId,
        isFocused: true,
        zOrder: getMaxViewportZOrder(current.editorViewportsById) + 1,
      })
      return withBrowserViewportState(current, {
        editorViewportsById: focusViewportCollection(
          {
            ...current.editorViewportsById,
            [editorViewportId]: nextViewport,
          },
          editorViewportId,
        ),
        editorViewportOrder: [...current.editorViewportOrder, editorViewportId],
        activeEditorViewportId: editorViewportId,
      })
    })
    return editorViewportId
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
  setEditorViewportWindowMode: (editorViewportId, windowMode) => {
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined || viewport.windowMode === windowMode) {
        return state
      }
      const nextViewportsById: Record<string, EditorViewport> = {}
      for (const [currentViewportId, currentViewport] of Object.entries(state.editorViewportsById)) {
        if (
          currentViewportId !== editorViewportId &&
          windowMode === 'meatball editor view' &&
          currentViewport.windowMode === 'meatball editor view'
        ) {
          nextViewportsById[currentViewportId] = {
            ...currentViewport,
            windowMode: 'expanded',
          }
          continue
        }
        nextViewportsById[currentViewportId] =
          currentViewportId === editorViewportId
            ? {
                ...currentViewport,
                windowMode,
              }
            : currentViewport
      }
      return withBrowserViewportState(state, {
        editorViewportsById: nextViewportsById,
      })
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
