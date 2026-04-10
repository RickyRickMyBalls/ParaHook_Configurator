import { create } from 'zustand'
import { useUiPrefsStore } from '../../store/uiPrefsStore'
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
import {
  readFeatureStack,
  sketchFeatureSchema,
} from '../features/featureSchema'
import { deriveProfilesWithDiagnostics } from '../features/profileDerivation'
import type { NumberExpression, Vec2Expression } from '../features/expressions'
import type {
  FeatureStack,
  SketchComponent,
  SketchFeature,
  SketchPlane,
  SketchPlaneTransformHistoryEntry,
  SketchPlaneTransform,
  Vec3Literal,
} from '../features/featureTypes'
import { createDefaultSketchPlaneTransform } from '../features/featureTypes'
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
import { getNextViewMode, type ViewMode } from '../canvas/rowViewMode'
import type {
  EdgeEndpoint,
  EditorViewport,
  EditorViewportRestoreFromCollapsed,
  EditorViewportRestoreFromSeparateWindow,
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
import type {
  BuildExecutionIntent,
  BuildResultBundle,
  BuildResultEntry,
  BuildRoutingIdentity,
  BuildUnitId,
  PartArtifact,
} from '../../../shared/buildTypes'
import { DEFAULT_BUILD_EXECUTION_INTENT } from '../../../shared/buildTypes'
import {
  cloneGeometryResultBundle,
  getGeometryResultAuthoritativeHandleId,
  type GeometryResultBundle,
} from '../../../shared/geometryResult'
import { buildDispatcher } from '../../buildDispatcher'
import { appendConsoleEntry } from '../../console/useConsoleStore'
import { artifactToPartKeyStr } from '../../parts/partKeyResolver'
import {
  createDefaultEditorPopoutState,
  createDefaultEditorWorkspaceSurfaceState,
  defaultEditorSurfacePosition,
  defaultEditorSurfaceSize,
  defaultEditorSurfaceSplitRatio,
  type EditorSurfaceRestoreFromSeparateWindow,
  resolveWorkspacePresentationMode,
  type EditorSurfaceRestoreFromCollapsed,
  type EditorSurfaceRestoreFromSplit,
  type EditorSurfaceWindowMode,
  type EditorWorkspaceSurfaceState,
} from '../../workspace/workspaceShellTypes'
import { useWorkspaceStore } from '../../workspace/useWorkspaceStore'
import {
  defaultWorkspaceSplitDirection,
  resolveDefaultWorkspaceSplitDockSide,
  resolveWorkspaceSplitDirectionForDockSide,
  type WorkspaceSplitDockSide,
  defaultWorkspaceSplitPriority,
  type WorkspaceSplitDirection,
  type WorkspaceSplitPriority,
} from '../../workspace/workspaceSplitTypes'

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

export type GraphCompileBuildState = {
  lastCompileResult: ReturnType<typeof compileSpaghettiGraph> | null
  previousBuildInputs: ReturnType<typeof compileSpaghettiGraph>['buildInputs'] | null
  pendingChangedParamIds: string[]
  pendingStatsPartKeys: string[]
  pendingTargetBuildUnitIds: BuildUnitId[]
  pendingAffectedBuildUnitIds: BuildUnitId[]
  currentGraphRevision: number
  lastBuildSeq: number | null
  latestIssuedGraphRevision: number | null
  latestIssuedBuildSeq: number
  latestAcceptedGraphRevision: number | null
  latestAcceptedBuildSeq: number | null
  latestAcceptedBuildUnitIds: BuildUnitId[]
  inFlightGraphRevision: number | null
  inFlightBuildRequestId: string | null
  inFlightBuildSeq: number | null
  inFlightExecutionIntent: BuildExecutionIntent | null
}

export type AcceptedBuildImpactEntry = Pick<
  BuildResultEntry,
  'buildUnitId' | 'outputEntryId' | 'sourceNodeId' | 'status' | 'resultClass'
>

export type AcceptedBuildImpactSnapshot = {
  seq: number
  graphDocumentId: string
  buildRequestId: string
  changedParamIds: string[]
  affectedBuildUnitIds: BuildUnitId[]
  targetBuildUnitIds: BuildUnitId[]
  summary: BuildResultBundle['summary']
  entries: AcceptedBuildImpactEntry[]
}

export type GraphRuntimeState = {
  compileBuild: GraphCompileBuildState
  previewPreparation: GraphPreviewPreparation
  acceptedBuildImpact: AcceptedBuildImpactSnapshot | null
  acceptedBuildBundle: BuildResultBundle | null
  acceptedPreviewBuildBundle: BuildResultBundle | null
  acceptedAuthoritativeGraphRevision: number | null
  acceptedDraftGraphRevision: number | null
  acceptedAuthoritativeGeometryResult: GeometryResultBundle | null
  acceptedDraftGeometryResult: GeometryResultBundle | null
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

const EMPTY_BUILD_RESULT_ENTRIES: BuildResultEntry[] = []

const releaseAuthoritativeHandleIds = (handleIds: readonly (string | null | undefined)[]): void => {
  const normalizedHandleIds = [
    ...new Set(
      handleIds.filter(
        (handleId): handleId is string => typeof handleId === 'string' && handleId.length > 0,
      ),
    ),
  ]
  if (normalizedHandleIds.length === 0) {
    return
  }
  buildDispatcher.releaseAuthoritativeHandles(normalizedHandleIds)
}

const cloneBuildResultEntry = (entry: BuildResultEntry): BuildResultEntry => ({
  buildUnitId: entry.buildUnitId,
  outputEntryId: entry.outputEntryId,
  sourceNodeId: entry.sourceNodeId,
  status: entry.status,
  resultClass: entry.resultClass,
  artifacts: [...entry.artifacts],
})

const finalizeAcceptedBuildBundle = (options: {
  previousBundle: BuildResultBundle | null
  nextBundle: BuildResultBundle
  targetBuildUnitIds: readonly BuildUnitId[]
}): BuildResultBundle => {
  const previousEntries = options.previousBundle?.entries ?? EMPTY_BUILD_RESULT_ENTRIES
  const nextEntries = options.nextBundle.entries
  const previousByBuildUnitId = new Map(previousEntries.map((entry) => [entry.buildUnitId, entry] as const))
  const nextByBuildUnitId = new Map(nextEntries.map((entry) => [entry.buildUnitId, entry] as const))
  const orderedBuildUnitIds = [
    ...new Set([
      ...previousEntries.map((entry) => entry.buildUnitId),
      ...options.targetBuildUnitIds,
      ...nextEntries.map((entry) => entry.buildUnitId),
    ]),
  ]

  const entries: BuildResultEntry[] = []
  for (const buildUnitId of orderedBuildUnitIds) {
    const rebuiltEntry = nextByBuildUnitId.get(buildUnitId)
    if (rebuiltEntry !== undefined) {
      entries.push({
        ...cloneBuildResultEntry(rebuiltEntry),
        status: 'rebuilt',
        resultClass: options.nextBundle.resultClass,
      })
      continue
    }

    const previousEntry = previousByBuildUnitId.get(buildUnitId)
    if (previousEntry === undefined) {
      continue
    }

    if (options.targetBuildUnitIds.includes(buildUnitId)) {
      entries.push({
        ...cloneBuildResultEntry(previousEntry),
        status: 'evicted',
        resultClass: options.nextBundle.resultClass,
        artifacts: [],
      })
      continue
    }

    entries.push({
      ...cloneBuildResultEntry(previousEntry),
      status: 'retained',
      resultClass: options.nextBundle.resultClass,
    })
  }

  return {
    buildRequestId: options.nextBundle.buildRequestId,
    graphDocumentId: options.nextBundle.graphDocumentId,
    seq: options.nextBundle.seq,
    resultClass: options.nextBundle.resultClass,
    executionIntent: { ...options.nextBundle.executionIntent },
    summary: {
      rebuiltCount: entries.filter((entry) => entry.status === 'rebuilt').length,
      retainedCount: entries.filter((entry) => entry.status === 'retained').length,
      evictedCount: entries.filter((entry) => entry.status === 'evicted').length,
    },
    entries,
  }
}

const bundleToAcceptedBuildOutputs = (bundle: BuildResultBundle | null): PartArtifact[] => {
  if (bundle === null) {
    return []
  }
  const artifactsByPartKey = new Map<string, PartArtifact>()
  for (const entry of bundle.entries) {
    if (entry.status === 'evicted') {
      continue
    }
    for (const artifact of entry.artifacts) {
      const partKey = artifactToPartKeyStr(artifact)
      if (!artifactsByPartKey.has(partKey)) {
        artifactsByPartKey.set(partKey, artifact)
      }
    }
  }
  return [...artifactsByPartKey.values()]
}

const buildAcceptedBuildImpactSnapshot = (options: {
  acceptedBuildBundle: BuildResultBundle
  changedParamIds: readonly string[]
  affectedBuildUnitIds: readonly BuildUnitId[]
  targetBuildUnitIds: readonly BuildUnitId[]
}): AcceptedBuildImpactSnapshot => ({
  seq: options.acceptedBuildBundle.seq,
  graphDocumentId: options.acceptedBuildBundle.graphDocumentId,
  buildRequestId: options.acceptedBuildBundle.buildRequestId,
  changedParamIds: [...options.changedParamIds],
  affectedBuildUnitIds: [...options.affectedBuildUnitIds],
  targetBuildUnitIds: [...options.targetBuildUnitIds],
  summary: {
    rebuiltCount: options.acceptedBuildBundle.summary.rebuiltCount,
    retainedCount: options.acceptedBuildBundle.summary.retainedCount,
    evictedCount: options.acceptedBuildBundle.summary.evictedCount,
  },
  entries: options.acceptedBuildBundle.entries.map((entry) => ({
    buildUnitId: entry.buildUnitId,
    outputEntryId: entry.outputEntryId,
    sourceNodeId: entry.sourceNodeId,
    status: entry.status,
    resultClass: entry.resultClass,
  })),
})

const cloneAcceptedGeometryLane = (
  geometryResult: GeometryResultBundle | null | undefined,
): GeometryResultBundle | null =>
  geometryResult === undefined || geometryResult === null
    ? null
    : cloneGeometryResultBundle(geometryResult)

const resolveAcceptedGeometryPromotion = (options: {
  previousAcceptedDraftGeometryResult: GeometryResultBundle | null
  previousAcceptedAuthoritativeGeometryResult: GeometryResultBundle | null
  incomingDraftGeometryResult?: GeometryResultBundle
  incomingAuthoritativeGeometryResult?: GeometryResultBundle
}): {
  acceptedDraftGeometryResult: GeometryResultBundle | null
  acceptedAuthoritativeGeometryResult: GeometryResultBundle | null
  authoritativeHandleIdsToRelease: string[]
} => {
  const acceptedDraftGeometryResult =
    options.incomingDraftGeometryResult === undefined
      ? cloneAcceptedGeometryLane(options.previousAcceptedDraftGeometryResult)
      : cloneAcceptedGeometryLane(options.incomingDraftGeometryResult)
  const acceptedAuthoritativeGeometryResult =
    options.incomingAuthoritativeGeometryResult === undefined
      ? cloneAcceptedGeometryLane(options.previousAcceptedAuthoritativeGeometryResult)
      : cloneAcceptedGeometryLane(options.incomingAuthoritativeGeometryResult)

  const previousAuthoritativeHandleId = getGeometryResultAuthoritativeHandleId(
    options.previousAcceptedAuthoritativeGeometryResult,
  )
  const nextAuthoritativeHandleId = getGeometryResultAuthoritativeHandleId(
    acceptedAuthoritativeGeometryResult,
  )

  return {
    acceptedDraftGeometryResult,
    acceptedAuthoritativeGeometryResult,
    authoritativeHandleIdsToRelease:
      previousAuthoritativeHandleId !== null &&
      nextAuthoritativeHandleId !== null &&
      previousAuthoritativeHandleId !== nextAuthoritativeHandleId
        ? [previousAuthoritativeHandleId]
        : [],
  }
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

export type EditorViewportCanvasFitRequest = {
  editorViewportId: string
  key: number
}

export type SketchPlanePickSession = {
  nodeId: string
  editorViewportId: string | null
  shouldRestoreViewportWindowMode: boolean
  stage: 'pick' | 'adjust'
  liveTransformActivationNonce: number
  adjustScope: 'root' | 'move' | 'move-axis' | 'move-snap' | 'rotate' | 'rotate-snap'
  activeTransformAxis: 'free' | 'x' | 'y' | 'z' | null
  gizmoMode: 'translate' | 'rotate'
  draftPlane: SketchPlane
  previewPlane: SketchPlane | null
  transformCommandOrigin: SketchPlaneTransform | null
  draftTransform: SketchPlaneTransform
  transformHistory: SketchPlaneTransformHistoryEntry[]
  pendingMoveAxisOffSnapConfirmation: {
    axis: 'x' | 'y' | 'z'
    value: number
    literal: string
  } | null
}

export type GeometrySketchTool = 'line' | 'pline' | 'arc3pt' | 'spline' | 'rectangle' | 'circle'

export type GeometrySketchDraftPoint = {
  x: number
  y: number
}

export type GeometrySketchDrawDraft = {
  points: GeometrySketchDraftPoint[]
  hoverPoint: GeometrySketchDraftPoint | null
  hoverSnapTarget: 'origin' | 'endpoint' | null
}

export type GeometrySketchSelectionWindowDraft = {
  anchor: GeometrySketchDraftPoint
  current: GeometrySketchDraftPoint
  mode: 'window' | 'crossing'
}

export type GeometrySketchDrawStage = 'sessionIdle' | 'toolSelected' | 'draftActive'
export type SketchPlaneCommand =
  | 'xy'
  | 'xz'
  | 'yz'
  | 'esc'
  | 'back'
  | 'done'
  | 'confirm-to-sketch'
  | 'x'
  | 'move'
  | 'move-again'
  | 'move-snap'
  | 'rotate'
  | 'rotate-snap'
  | 'move-x'
  | 'move-y'
  | 'move-z'
  | 'rotate-x'
  | 'rotate-y'
  | 'rotate-z'
export type GeometrySketchDrawCommand =
  | 'line'
  | 'l'
  | 'pline'
  | 'pl'
  | 'rectangle'
  | 'rec'
  | 'circle'
  | 'cc'
  | 'previous'
  | 'p'
  | 'undo'
  | 'enter'
  | 'delete'
  | 'del'
  | 'back'
  | 'b'
  | 'esc'
  | 'x'

type GeometrySketchConsolePrompt = {
  tool: GeometrySketchTool | null
  draft: GeometrySketchDrawDraft | null
  lastUsedTool: GeometrySketchTool | null
}

export type GeometrySketchSession = {
  nodeId: string
  mode: 'draw' | 'review'
  activeTool: GeometrySketchTool | null
  lastUsedTool: GeometrySketchTool | null
  drawStage: GeometrySketchDrawStage | null
  editorViewportId: string | null
  shouldRestoreViewportWindowMode: boolean
  drawDraft: GeometrySketchDrawDraft | null
  selectedComponentIds: string[]
  hoveredComponentId: string | null
  selectionWindowDraft: GeometrySketchSelectionWindowDraft | null
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
  editorViewportHeaderCollapsedById: Record<string, boolean>
  editorViewportCanvasToolbarVisibleById: Record<string, boolean>
  newNodeSpawnMode: NodeRowMode
  editorViewportSelectedNodeIdById: Record<string, string | null>
  editorViewportSelectedEdgeIdById: Record<string, string | null>
  editorViewportConsolePreviewNodeIdById: Record<string, string | null>
  partFeatureStackIrByPartKey: FeatureStackIrParts
  partKeyByNodeId: Record<string, string>
  edgeWaypoints: Record<string, EdgeWaypoint[]>
  selectedNodeId: string | null
  consolePreviewNodeId: string | null
  editorViewportNodeFitRequest: EditorViewportNodeFitRequest | null
  editorViewportCanvasFitRequest: EditorViewportCanvasFitRequest | null
  selectedEdgeId: string | null
  hoveredEdgeId: string | null
  connectionDrag: ConnectionDragState | null
  sketchPlanePickSession: SketchPlanePickSession | null
  geometrySketchSession: GeometrySketchSession | null
  uiMessage: CanvasUiMessage | null
  setGraph: (next: SpaghettiGraph) => void
  applyGraphCommand: (cmd: GraphCommand) => void
  applyGraphPatch: (patchFn: (prev: SpaghettiGraph) => SpaghettiGraph) => void
  setNodePos: (nodeId: string, x: number, y: number) => void
  setManyNodePos: (updates: NodePosUpdate[]) => void
  ensureNodePositions: () => void
  setNodeMode: (nodeId: string, mode: NodeRowMode) => void
  setNewNodeSpawnMode: (mode: NodeRowMode) => void
  cycleNewNodeSpawnMode: () => void
  addEdge: (edge: SpaghettiEdge) => void
  removeEdge: (edgeId: string) => void
  insertEdgeWaypoint: (edgeId: string, x: number, y: number, insertIndex?: number) => void
  setEdgeWaypointPos: (edgeId: string, waypointId: string, x: number, y: number) => void
  removeEdgeWaypoint: (edgeId: string, waypointId: string) => void
  toggleEdgeWaypointSide1: (edgeId: string, waypointId: string) => void
  toggleEdgeWaypointSide2: (edgeId: string, waypointId: string) => void
  setSelectedNodeId: (nodeId: string | null) => void
  setEditorViewportSelectedNodeId: (editorViewportId: string, nodeId: string | null) => void
  setConsolePreviewNodeId: (nodeId: string | null) => void
  setEditorViewportConsolePreviewNodeId: (editorViewportId: string, nodeId: string | null) => void
  requestEditorViewportNodeFit: (editorViewportId: string, nodeId: string) => void
  requestEditorViewportCanvasFit: (editorViewportId: string) => void
  setSelectedEdgeId: (edgeId: string | null) => void
  setEditorViewportSelectedEdgeId: (editorViewportId: string, edgeId: string | null) => void
  setHoveredEdgeId: (edgeId: string | null) => void
  setConnectionDrag: (drag: ConnectionDragState | null) => void
  clearConnectionDrag: () => void
  startSketchPlanePick: (nodeId: string) => void
  cancelSketchPlanePick: () => void
  finishSketchPlanePick: () => void
  confirmSketchPlanePick: () => void
  setSketchPlanePickDraftPlane: (plane: SketchPlane) => void
  reopenSketchPlanePickPlaneSelection: () => void
  setSketchPlanePickGizmoMode: (mode: 'translate' | 'rotate') => void
  runSketchPlaneCommand: (command: SketchPlaneCommand) => void
  setSketchPlanePickPreviewPlane: (plane: SketchPlane | null) => void
  acceptActiveSketchPlaneTransformCommand: () => void
  commitSketchPlaneTransformHistoryFromDraftRelease: () => void
  toggleSketchPlaneTransformHistoryLock: (entryId: string) => void
  mergeSketchPlaneTransformHistory: () => void
  resetSketchPlanePickDraftTransform: () => void
  setSketchPlanePickDraftTransform: (transform: SketchPlaneTransform) => void
  setSketchPlanePickTranslationAxis: (axis: 'x' | 'y' | 'z', value: number) => void
  setSketchPlanePickRotationAxis: (axis: 'x' | 'y' | 'z', value: number) => void
  setSketchPlaneMoveAxisOffSnapConfirmation: (
    axis: 'x' | 'y' | 'z',
    value: number,
    literal: string,
  ) => void
  clearSketchPlaneMoveAxisOffSnapConfirmation: () => void
  setGeometrySketchPlane: (nodeId: string, plane: SketchPlane) => void
  setGeometrySketchPlaneOffset: (nodeId: string, offsetMm: number) => void
  setGeometrySketchPlaneTranslationAxis: (
    nodeId: string,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => void
  setGeometrySketchPlaneRotationAxis: (
    nodeId: string,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => void
  setGeometrySketchPlaneInPlaneRotation: (nodeId: string, rotationDeg: number) => void
  startGeometrySketchSession: (nodeId: string, mode: GeometrySketchSession['mode']) => void
  closeGeometrySketchSession: () => void
  returnActiveSketchSessionOneLevel: () => void
  runGeometrySketchDrawCommand: (command: GeometrySketchDrawCommand) => void
  setGeometrySketchSessionTool: (tool: GeometrySketchTool) => void
  setGeometrySketchDrawHoverPoint: (
    point: GeometrySketchDraftPoint | null,
    snapTarget: 'origin' | 'endpoint' | null,
  ) => void
  setGeometrySketchHoveredComponent: (rowId: string | null) => void
  setGeometrySketchSelectedComponents: (rowIds: string[]) => void
  setGeometrySketchSelectionWindowDraft: (
    draft: {
      anchor: GeometrySketchDraftPoint
      current: GeometrySketchDraftPoint
      mode: 'window' | 'crossing'
    } | null,
  ) => void
  undoGeometrySketchDrawDraftPoint: () => void
  confirmGeometrySketchDrawPoint: (
    point: GeometrySketchDraftPoint,
    snapTarget: 'origin' | 'endpoint' | null,
  ) => void
  confirmGeometrySketchDrawRadius: (radius: number) => void
  finishGeometrySketchDrawDraft: () => void
  cancelGeometrySketchDrawDraft: () => void
  deleteGeometrySketchSelectedComponents: () => void
  appendGeometrySketchComponent: (nodeId: string, component: SketchComponent) => void
  updateGeometrySketchComponentPoint: (
    nodeId: string,
    rowId: string,
    pointKey:
      | 'a'
      | 'b'
      | 'p0'
      | 'p1'
      | 'p2'
      | 'p3'
      | 'start'
      | 'mid'
      | 'end'
      | 'center'
      | 'edge',
    value: Vec2Expression,
  ) => void
  setGeometrySketchComponentName: (nodeId: string, rowId: string, name: string | null) => void
  setGeometrySketchDrawGroupName: (nodeId: string, drawGroupId: string, name: string | null) => void
  moveGeometrySketchComponentUp: (nodeId: string, rowId: string) => void
  moveGeometrySketchComponentDown: (nodeId: string, rowId: string) => void
  removeGeometrySketchComponent: (nodeId: string, rowId: string) => void
  setGeometrySketchSelectedProfile: (nodeId: string, profileId: string | null) => void
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
      pendingTargetBuildUnitIds?: BuildUnitId[]
      pendingAffectedBuildUnitIds?: BuildUnitId[]
      buildRequestId: string
      buildSeq: number
      executionIntent?: BuildExecutionIntent
    },
  ) => void
  acceptGraphBuildResult: (
    routingIdentity: BuildRoutingIdentity & {
      buildSeq: number
      bundle?: BuildResultBundle
      draftGeometryResult?: GeometryResultBundle
      authoritativeGeometryResult?: GeometryResultBundle
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
  restoreEditorViewportFromSeparateWindow: (editorViewportId: string) => void
  setEditorViewportHeaderCollapsed: (editorViewportId: string, collapsed: boolean) => void
  setEditorViewportCanvasToolbarVisible: (editorViewportId: string, visible: boolean) => void
  setEditorViewportPresentationMode: (
    editorViewportId: string,
    mode: 'collapsed' | 'essentials' | 'expanded',
  ) => void
  setEditorViewportSplitRatio: (editorViewportId: string, splitRatio: number) => void
  setEditorViewportSplitDirection: (
    editorViewportId: string,
    splitDirection: WorkspaceSplitDirection,
  ) => void
  setEditorViewportSplitDockSide: (
    editorViewportId: string,
    splitDockSide: WorkspaceSplitDockSide,
  ) => void
  setEditorViewportSplitPriority: (
    editorViewportId: string,
    splitPriority: WorkspaceSplitPriority,
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
    pointKey:
      | 'a'
      | 'b'
      | 'p0'
      | 'p1'
      | 'p2'
      | 'p3'
      | 'start'
      | 'mid'
      | 'end'
      | 'center'
      | 'edge',
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
  | 'editorViewportsById'
  | 'editorViewportOrder'
  | 'activeEditorViewportId'
  | 'editorViewportHeaderCollapsedById'
  | 'editorViewportCanvasToolbarVisibleById'
>

const defaultGridColumns = 4
const defaultXStart = 40
const defaultYStart = 40
const defaultXStep = 280
const defaultYStep = 200
const defaultNodeRowMode: NodeRowMode = 'collapsed'
const defaultEditorViewportId = 'editor-viewport-1'
// Spawn new floating editors just to the right of the left dock/title-status stack.
export const defaultViewportPosition: EditorViewportPosition = defaultEditorSurfacePosition
export const defaultViewportSize: EditorViewportSize = defaultEditorSurfaceSize
export const defaultViewportSplitRatio = defaultEditorSurfaceSplitRatio
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

const isSketchPlane = (value: unknown): value is SketchPlane =>
  value === 'XY' || value === 'YZ' || value === 'XZ'

const isGeometrySketchNode = (node: SpaghettiNode): boolean => node.type === 'Geometry/Sketch'

const readManagedSketchFeature = (value: unknown): SketchFeature | null => {
  const parsed = sketchFeatureSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}

const ensureSketchPlaneTransform = (feature: SketchFeature) =>
  feature.planeTransform ?? createDefaultSketchPlaneTransform()

const isVec3Equal = (left: Vec3Literal, right: Vec3Literal): boolean =>
  left.x === right.x && left.y === right.y && left.z === right.z

const cloneVec3Literal = (value: Vec3Literal): Vec3Literal => ({
  x: value.x,
  y: value.y,
  z: value.z,
})

const cloneSketchPlaneTransformHistoryEntries = (
  entries: readonly SketchPlaneTransformHistoryEntry[],
): SketchPlaneTransformHistoryEntry[] =>
  entries.map((entry) => ({
    entryId: entry.entryId,
    point: cloneVec3Literal(entry.point),
    locked: entry.locked,
  }))

const buildDefaultSketchPlaneTransformHistory = (
  transform: SketchPlaneTransform,
): SketchPlaneTransformHistoryEntry[] =>
  isVec3Equal(transform.translation, { x: 0, y: 0, z: 0 })
    ? []
    : [
        {
          entryId: 'sketch-plane-history-1',
          point: cloneVec3Literal(transform.translation),
          locked: false,
        },
      ]

const ensureSketchPlaneTransformHistory = (
  feature: SketchFeature,
): SketchPlaneTransformHistoryEntry[] =>
  feature.uiState.sketchPlaneTransformHistory === undefined
    ? buildDefaultSketchPlaneTransformHistory(ensureSketchPlaneTransform(feature))
    : cloneSketchPlaneTransformHistoryEntries(feature.uiState.sketchPlaneTransformHistory)

const appendSketchPlaneTransformHistoryEntry = (
  entries: readonly SketchPlaneTransformHistoryEntry[],
  point: Vec3Literal,
): SketchPlaneTransformHistoryEntry[] => {
  const nextPoint = cloneVec3Literal(point)
  const previousPoint =
    entries.length > 0 ? entries[entries.length - 1]!.point : { x: 0, y: 0, z: 0 }
  if (isVec3Equal(previousPoint, nextPoint)) {
    return cloneSketchPlaneTransformHistoryEntries(entries)
  }
  return [
    ...cloneSketchPlaneTransformHistoryEntries(entries),
    {
      entryId: nextOrdinalId(
        'sketch-plane-history',
        entries.map((entry) => entry.entryId),
      ),
      point: nextPoint,
      locked: false,
    },
  ]
}

const resolvePersistedSketchPlaneTransformHistory = (
  entries: readonly SketchPlaneTransformHistoryEntry[],
  transform: SketchPlaneTransform,
): SketchPlaneTransformHistoryEntry[] =>
  entries.length > 0
    ? cloneSketchPlaneTransformHistoryEntries(entries)
    : buildDefaultSketchPlaneTransformHistory(transform)

const areSketchPlaneTransformHistoryEntriesEqual = (
  left: readonly SketchPlaneTransformHistoryEntry[] | undefined,
  right: readonly SketchPlaneTransformHistoryEntry[],
): boolean => {
  const normalizedLeft = left ?? []
  if (normalizedLeft.length !== right.length) {
    return false
  }
  return normalizedLeft.every((entry, index) => {
    const other = right[index]
    return (
      other !== undefined &&
      entry.entryId === other.entryId &&
      entry.locked === other.locked &&
      isVec3Equal(entry.point, other.point)
    )
  })
}

const mergeSketchPlaneTransformHistoryEntries = (
  entries: readonly SketchPlaneTransformHistoryEntry[],
): SketchPlaneTransformHistoryEntry[] => {
  if (entries.length <= 1) {
    return cloneSketchPlaneTransformHistoryEntries(entries)
  }
  const preservedIndexes = new Set<number>()
  const lastIndex = entries.length - 1
  preservedIndexes.add(lastIndex)
  entries.forEach((entry, index) => {
    if (entry.locked) {
      preservedIndexes.add(index)
    }
  })
  return entries
    .filter((_entry, index) => preservedIndexes.has(index))
    .map((entry) => ({
      entryId: entry.entryId,
      point: cloneVec3Literal(entry.point),
      locked: entry.locked,
    }))
}

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

const reconcileSketchSelectionId = (
  selectedProfileId: string | undefined,
  profiles: SketchFeature['outputs']['profiles'],
): string | undefined => {
  if (
    selectedProfileId !== undefined &&
    profiles.some((profile) => profile.profileId === selectedProfileId)
  ) {
    return selectedProfileId
  }
  if (profiles.length === 1) {
    return profiles[0].profileId
  }
  return undefined
}

const recomputeSketchFeature = (feature: SketchFeature): SketchFeature => {
  const nextOutputs = deriveProfilesWithDiagnostics(feature.components)
  const selectedProfileId = reconcileSketchSelectionId(
    feature.uiState.selectedProfileId,
    nextOutputs.profiles,
  )
  return {
    ...feature,
    outputs: {
      ...nextOutputs,
    },
    uiState: {
      collapsed: feature.uiState.collapsed,
      ...(selectedProfileId === undefined ? {} : { selectedProfileId }),
      ...(feature.uiState.sketchPlaneTransformHistory === undefined
        ? {}
        : {
            sketchPlaneTransformHistory: cloneSketchPlaneTransformHistoryEntries(
              feature.uiState.sketchPlaneTransformHistory,
            ),
          }),
    },
  }
}

const createSketchFeature = (): SketchFeature => ({
  type: 'sketch',
  featureId: newId('feature'),
  plane: 'XY',
  planeTransform: createDefaultSketchPlaneTransform(),
  components: [],
  outputs: {
    profiles: [],
    diagnostics: [],
  },
  uiState: {
    collapsed: false,
  },
})

const createManagedGeometrySketchFeature = (): SketchFeature => ({
  ...createSketchFeature(),
  featureId: 'sketch-1',
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

const createDefaultRectangleComponent = (): SketchComponent => ({
  rowId: makeRowId(),
  componentId: makeComponentId(),
  type: 'rectangle',
  a: { kind: 'lit', x: 0, y: 0 },
  b: { kind: 'lit', x: 100, y: 60 },
})

const createDefaultCircleComponent = (): SketchComponent => ({
  rowId: makeRowId(),
  componentId: makeComponentId(),
  type: 'circle',
  center: { kind: 'lit', x: 0, y: 0 },
  edge: { kind: 'lit', x: 40, y: 0 },
})

const createDefaultComponent = (
  componentType: SketchComponent['type'],
): SketchComponent => {
  if (componentType === 'rectangle') return createDefaultRectangleComponent()
  if (componentType === 'circle') return createDefaultCircleComponent()
  if (componentType === 'spline') return createDefaultSplineComponent()
  if (componentType === 'arc3pt') return createDefaultArcComponent()
  return createDefaultLineComponent()
}

const isGeometrySketchDrawTool = (
  tool: GeometrySketchTool | null,
): tool is 'line' | 'pline' | 'rectangle' | 'circle' =>
  tool === 'line' || tool === 'pline' || tool === 'rectangle' || tool === 'circle'

const getGeometrySketchConsoleToolLabel = (tool: GeometrySketchTool): string =>
  tool === 'pline'
    ? 'PLINE'
    : tool === 'rectangle'
      ? 'REC'
      : tool === 'circle'
        ? 'CC'
        : tool.toUpperCase()

const roundGeometrySketchDraftCoordinate = (value: number): number =>
  Math.round(value * 1_000) / 1_000

const normalizeGeometrySketchDraftPoint = (
  point: GeometrySketchDraftPoint,
): GeometrySketchDraftPoint => ({
  x: roundGeometrySketchDraftCoordinate(point.x),
  y: roundGeometrySketchDraftCoordinate(point.y),
})

const areGeometrySketchDraftPointsEqual = (
  left: GeometrySketchDraftPoint | null,
  right: GeometrySketchDraftPoint | null,
): boolean =>
  left === right ||
  (left !== null &&
    right !== null &&
    left.x === right.x &&
    left.y === right.y)

const createEmptyGeometrySketchDrawDraft = (): GeometrySketchDrawDraft => ({
  points: [],
  hoverPoint: null,
  hoverSnapTarget: null,
})

const resolveGeometrySketchDrawStage = (
  mode: GeometrySketchSession['mode'],
  tool: GeometrySketchTool | null,
  draft: GeometrySketchDrawDraft | null,
): GeometrySketchDrawStage | null => {
  if (mode !== 'draw') {
    return null
  }
  if (tool === null) {
    return 'sessionIdle'
  }
  if (draft !== null && (draft.points.length > 0 || draft.hoverPoint !== null)) {
    return 'draftActive'
  }
  return 'toolSelected'
}

const buildGeometrySketchConsolePrompt = (
  tool: GeometrySketchTool | null,
  draft: GeometrySketchDrawDraft | null,
  lastUsedTool: GeometrySketchTool | null,
): string | null => {
  if (tool === null) {
    return lastUsedTool !== null
      ? 'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]'
      : 'Sketch Draw > [Line, PLine, Rectangle, Circle, X]'
  }
  if (!isGeometrySketchDrawTool(tool)) {
    return null
  }
  const toolLabel = getGeometrySketchConsoleToolLabel(tool)
  if (tool === 'line' || tool === 'rectangle') {
    return (draft?.points[0] ?? null) === null
      ? `${toolLabel} Specify point 1:`
      : `${toolLabel} Specify point 2 or [Enter Accept]:`
  }
  if (tool === 'circle') {
    return (draft?.points[0] ?? null) === null
      ? `${toolLabel} Specify center point:`
      : `${toolLabel} Specify radius or [Enter Accept]:`
  }
  const pointCount = draft?.points.length ?? 0
  if (pointCount === 0) {
    return `${toolLabel} Specify point 1:`
  }
  if (pointCount === 1) {
    return `${toolLabel} Specify point 2:`
  }
  return `${toolLabel} Specify point ${pointCount + 1} or [Enter Finish]:`
}

const appendGeometrySketchConsolePrompt = (
  tool: GeometrySketchTool | null,
  draft: GeometrySketchDrawDraft | null,
  lastUsedTool: GeometrySketchTool | null,
) => {
  const prompt = buildGeometrySketchConsolePrompt(tool, draft, lastUsedTool)
  if (prompt === null) {
    return
  }
  appendConsoleEntry({
    layer: 'App',
    text: prompt,
    source: 'sketch-draw',
    severity: 'info',
  })
}

const buildSketchPlaneMovePrompt = (translation: {
  x: number
  y: number
  z: number
}): string =>
  `Sketch Plane > Move > [Vec3(${translation.x.toFixed(1)}, ${translation.y.toFixed(1)}, ${translation.z.toFixed(1)}), Move Again, Move X, Move Y, Move Z, Snap, Back]`

const buildSketchPlaneMoveAxisPrompt = (axis: 'x' | 'y' | 'z', value: number): string =>
  `Sketch Plane > Move > ${axis.toUpperCase()} > [${value.toFixed(1)}, Back]`

const buildSketchPlaneMoveAxisOffSnapConfirmPrompt = (
  axis: 'x' | 'y' | 'z',
  literal: string,
): string => `Sketch Plane > Move > ${axis.toUpperCase()} > confirm ${literal} off snap > [confirm, deny]`

const buildSketchPlaneMoveSessionState = (
  session: SketchPlanePickSession,
): SketchPlanePickSession => ({
  ...session,
  stage: 'adjust',
  liveTransformActivationNonce: session.liveTransformActivationNonce + 1,
  adjustScope: 'move',
  activeTransformAxis: 'free',
  gizmoMode: 'translate',
  transformCommandOrigin: cloneSketchPlaneTransform(session.draftTransform),
  pendingMoveAxisOffSnapConfirmation: null,
})

const buildSketchPlaneRotatePrompt = (rotationDeg: {
  x: number
  y: number
  z: number
}): string =>
  `Sketch Plane > Rotate > [Vec3(${rotationDeg.x.toFixed(1)}, ${rotationDeg.y.toFixed(1)}, ${rotationDeg.z.toFixed(1)}), Rotate X, Rotate Y, Rotate Z, Snap, Back]`

const buildSketchPlaneSnapPrompt = (
  mode: 'move' | 'rotate',
  value: number,
): string =>
  `Sketch Plane > ${mode === 'move' ? 'Move' : 'Rotate'} > Snap > [${value.toFixed(
    mode === 'move' ? 1 : 0,
  )}, On, Off, Back]`

const SKETCH_PLANE_ROOT_PROMPT = 'Sketch Plane > [Move, Rotate, Done, ConfirmToSketch, Back]'

const cloneSketchPlaneTransform = (transform: SketchPlaneTransform): SketchPlaneTransform => ({
  offsetMm: transform.offsetMm,
  inPlaneRotationDeg: transform.inPlaneRotationDeg,
  translation: { ...transform.translation },
  rotationDeg: { ...transform.rotationDeg },
})

const buildGeometrySketchSessionDraft = (
  mode: GeometrySketchSession['mode'],
  tool: GeometrySketchTool | null,
): GeometrySketchDrawDraft | null =>
  mode === 'draw' && isGeometrySketchDrawTool(tool) ? createEmptyGeometrySketchDrawDraft() : null

const buildGeometrySketchLineComponent = (
  start: GeometrySketchDraftPoint,
  end: GeometrySketchDraftPoint,
  options?: { drawGroupId?: string },
): SketchComponent => ({
  rowId: makeRowId(),
  componentId: makeComponentId(),
  type: 'line',
  ...(options?.drawGroupId !== undefined ? { drawGroupId: options.drawGroupId } : {}),
  a: { kind: 'lit', x: start.x, y: start.y },
  b: { kind: 'lit', x: end.x, y: end.y },
})

const buildGeometrySketchRectangleComponent = (
  start: GeometrySketchDraftPoint,
  end: GeometrySketchDraftPoint,
): SketchComponent => ({
  rowId: makeRowId(),
  componentId: makeComponentId(),
  type: 'rectangle',
  a: { kind: 'lit', x: start.x, y: start.y },
  b: { kind: 'lit', x: end.x, y: end.y },
})

const buildGeometrySketchCircleComponent = (
  center: GeometrySketchDraftPoint,
  edge: GeometrySketchDraftPoint,
): SketchComponent => ({
  rowId: makeRowId(),
  componentId: makeComponentId(),
  type: 'circle',
  center: { kind: 'lit', x: center.x, y: center.y },
  edge: { kind: 'lit', x: edge.x, y: edge.y },
})

const buildGeometrySketchCircleEdgeFromRadius = (
  center: GeometrySketchDraftPoint,
  radius: number,
): GeometrySketchDraftPoint => ({
  x: roundGeometrySketchDraftCoordinate(center.x + radius),
  y: center.y,
})

const normalizeSketchComponentName = (name: string | null): string | undefined => {
  if (name === null) {
    return undefined
  }
  const trimmed = name.trim()
  return trimmed.length === 0 ? undefined : trimmed
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

const updateGeometrySketchNode = (
  graph: SpaghettiGraph,
  nodeId: string,
  updateFn: (feature: SketchFeature) => SketchFeature,
): SpaghettiGraph => {
  let changed = false
  const nodes = graph.nodes.map((node) => {
    if (node.nodeId !== nodeId || !isGeometrySketchNode(node)) {
      return node
    }
    const currentSketch = readManagedSketchFeature(node.params.sketch) ?? createManagedGeometrySketchFeature()
    const nextSketch = updateFn(currentSketch)
    if (nextSketch === currentSketch) {
      return node
    }
    changed = true
    return {
      ...node,
      params: {
        ...node.params,
        sketch: nextSketch,
      },
    }
  })
  return changed
    ? {
        ...graph,
        nodes,
      }
    : graph
}

const pruneSketchPlanePickSession = (
  graph: SpaghettiGraph,
  session: SketchPlanePickSession | null,
): SketchPlanePickSession | null => {
  if (session === null) {
    return null
  }
  const node = graph.nodes.find((candidate) => candidate.nodeId === session.nodeId)
  return node !== undefined && isGeometrySketchNode(node) ? session : null
}

const pruneGeometrySketchSession = (
  graph: SpaghettiGraph,
  session: GeometrySketchSession | null,
): GeometrySketchSession | null => {
  if (session === null) {
    return null
  }
  const node = graph.nodes.find((candidate) => candidate.nodeId === session.nodeId)
  if (node === undefined || !isGeometrySketchNode(node)) {
    return null
  }
  const sketchFeature = readManagedSketchFeature(node.params.sketch)
  if (sketchFeature === null) {
    return null
  }
  const componentRowIds = new Set(sketchFeature.components.map((component) => component.rowId))
  const nextSelectedComponentIds = session.selectedComponentIds.filter((rowId) =>
    componentRowIds.has(rowId),
  )
  const nextHoveredComponentId =
    session.hoveredComponentId !== null && componentRowIds.has(session.hoveredComponentId)
      ? session.hoveredComponentId
      : null
  if (
    nextSelectedComponentIds.length === session.selectedComponentIds.length &&
    nextHoveredComponentId === session.hoveredComponentId
  ) {
    return session
  }
  return {
    ...session,
    selectedComponentIds: nextSelectedComponentIds,
    hoveredComponentId: nextHoveredComponentId,
  }
}

const normalizeGeometrySketchSelectionIds = (rowIds: readonly string[]): string[] => {
  const unique = new Set<string>()
  for (const rowId of rowIds) {
    if (typeof rowId === 'string' && rowId.length > 0) {
      unique.add(rowId)
    }
  }
  return [...unique]
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
  splitDirection: defaultWorkspaceSplitDirection,
  splitDockSide: resolveDefaultWorkspaceSplitDockSide(defaultWorkspaceSplitDirection),
  splitPriority: defaultWorkspaceSplitPriority,
  restoreFromCollapsed: null,
  restoreFromSplit: null,
  restoreFromSeparateWindow: null,
  zOrder: options?.zOrder ?? 1,
})

const clampViewportSplitRatio = (splitRatio: number): number =>
  Math.min(maxViewportSplitRatio, Math.max(minViewportSplitRatio, splitRatio))

const withViewportSplitDefaults = (viewport: EditorViewport): EditorViewport => ({
  ...viewport,
  splitDirection: viewport.splitDirection ?? defaultWorkspaceSplitDirection,
  splitDockSide:
    viewport.splitDockSide ??
    resolveDefaultWorkspaceSplitDockSide(viewport.splitDirection ?? defaultWorkspaceSplitDirection),
  splitPriority: viewport.splitPriority ?? defaultWorkspaceSplitPriority,
})

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

const cloneEditorSurfaceRestoreFromCollapsed = (
  restore: EditorSurfaceRestoreFromCollapsed | null,
): EditorViewportRestoreFromCollapsed | null =>
  restore === null
    ? null
    : {
        windowMode: restore.windowMode,
        position: restore.position === undefined ? undefined : { ...restore.position },
        size: restore.size === undefined ? undefined : { ...restore.size },
        splitRatio: restore.splitRatio,
      }

const cloneEditorSurfaceRestoreFromSplit = (
  restore: EditorSurfaceRestoreFromSplit | null,
): EditorViewportRestoreFromSplit | null =>
  restore === null
    ? null
    : {
        windowMode: restore.windowMode,
        position: restore.position === undefined ? undefined : { ...restore.position },
        size: restore.size === undefined ? undefined : { ...restore.size },
      }

const snapshotSeparateWindowRestoreState = (
  viewport: EditorViewport,
): EditorViewportRestoreFromSeparateWindow => ({
  windowMode:
    viewport.windowMode === 'separateWindow' ? 'expanded' : viewport.windowMode,
  position: viewport.position,
  size: viewport.size,
  splitRatio: viewport.splitRatio,
  splitDirection: viewport.splitDirection,
  splitDockSide: viewport.splitDockSide,
  splitPriority: viewport.splitPriority,
})

const cloneEditorSurfaceRestoreFromSeparateWindow = (
  restore: EditorSurfaceRestoreFromSeparateWindow | null,
): EditorViewportRestoreFromSeparateWindow | null =>
  restore === null
    ? null
    : {
        windowMode: restore.windowMode,
        position: restore.position === undefined ? undefined : { ...restore.position },
        size: restore.size === undefined ? undefined : { ...restore.size },
        splitRatio: restore.splitRatio,
        splitDirection: restore.splitDirection,
        splitDockSide: restore.splitDockSide,
        splitPriority: restore.splitPriority,
      }

const createEditorWorkspaceSurfaceStateFromViewport = (
  viewport: EditorViewport,
): EditorWorkspaceSurfaceState => ({
  ...createDefaultEditorWorkspaceSurfaceState(viewport.editorViewportId),
  surfaceInstanceId: viewport.editorViewportId,
  windowMode: viewport.windowMode as EditorSurfaceWindowMode,
  presentationMode: resolveWorkspacePresentationMode(viewport.windowMode as EditorSurfaceWindowMode),
  position: {
    x: viewport.position.x,
    y: viewport.position.y,
  },
  size: {
    width: viewport.size.width,
    height: viewport.size.height,
  },
  splitRatio: viewport.splitRatio,
  splitDirection: viewport.splitDirection ?? defaultWorkspaceSplitDirection,
  splitDockSide:
    viewport.splitDockSide ??
    resolveDefaultWorkspaceSplitDockSide(viewport.splitDirection ?? defaultWorkspaceSplitDirection),
  splitPriority: viewport.splitPriority ?? defaultWorkspaceSplitPriority,
  popoutState: createDefaultEditorPopoutState(viewport.editorViewportId),
  restoreFromCollapsed: viewport.restoreFromCollapsed
    ? {
        windowMode: viewport.restoreFromCollapsed.windowMode,
        position:
          viewport.restoreFromCollapsed.position === undefined
            ? undefined
            : {
                ...viewport.restoreFromCollapsed.position,
              },
        size:
          viewport.restoreFromCollapsed.size === undefined
            ? undefined
            : {
                ...viewport.restoreFromCollapsed.size,
              },
        splitRatio: viewport.restoreFromCollapsed.splitRatio,
      }
    : null,
  restoreFromSplit: viewport.restoreFromSplit
    ? {
        windowMode: viewport.restoreFromSplit.windowMode,
        position:
          viewport.restoreFromSplit.position === undefined
            ? undefined
            : {
                ...viewport.restoreFromSplit.position,
              },
        size:
          viewport.restoreFromSplit.size === undefined
            ? undefined
            : {
                ...viewport.restoreFromSplit.size,
              },
      }
    : null,
  restoreFromSeparateWindow: viewport.restoreFromSeparateWindow
    ? {
        windowMode: viewport.restoreFromSeparateWindow.windowMode,
        position:
          viewport.restoreFromSeparateWindow.position === undefined
            ? undefined
            : {
                ...viewport.restoreFromSeparateWindow.position,
              },
        size:
          viewport.restoreFromSeparateWindow.size === undefined
            ? undefined
            : {
                ...viewport.restoreFromSeparateWindow.size,
              },
        splitRatio: viewport.restoreFromSeparateWindow.splitRatio,
        splitDirection: viewport.restoreFromSeparateWindow.splitDirection,
        splitDockSide: viewport.restoreFromSeparateWindow.splitDockSide,
        splitPriority: viewport.restoreFromSeparateWindow.splitPriority,
      }
    : null,
})

const readEditorWorkspaceSurfaceState = (
  viewport: EditorViewport,
): EditorWorkspaceSurfaceState =>
  useWorkspaceStore.getState().editorSurfacePlacementById[viewport.editorViewportId] ??
  createEditorWorkspaceSurfaceStateFromViewport(viewport)

const applyEditorWorkspaceSurfaceStateToViewport = (
  viewport: EditorViewport,
  surface: EditorWorkspaceSurfaceState,
): EditorViewport =>
  withViewportSplitDefaults({
    ...viewport,
    windowMode: surface.windowMode,
    position: {
      x: surface.position.x,
      y: surface.position.y,
    },
    size: {
      width: surface.size.width,
      height: surface.size.height,
    },
    splitRatio: surface.splitRatio,
    splitDirection: surface.splitDirection,
    splitDockSide: surface.splitDockSide,
    splitPriority: surface.splitPriority,
    restoreFromSeparateWindow: cloneEditorSurfaceRestoreFromSeparateWindow(
      surface.restoreFromSeparateWindow,
    ),
    restoreFromCollapsed: cloneEditorSurfaceRestoreFromCollapsed(surface.restoreFromCollapsed),
    restoreFromSplit: cloneEditorSurfaceRestoreFromSplit(surface.restoreFromSplit),
  })

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
  pendingTargetBuildUnitIds: [],
  pendingAffectedBuildUnitIds: [],
  currentGraphRevision: 0,
  lastBuildSeq: null,
  latestIssuedGraphRevision: null,
  latestIssuedBuildSeq: 0,
  latestAcceptedGraphRevision: null,
  latestAcceptedBuildSeq: null,
  latestAcceptedBuildUnitIds: [],
  inFlightGraphRevision: null,
  inFlightBuildRequestId: null,
  inFlightBuildSeq: null,
  inFlightExecutionIntent: null,
})

const createGraphRuntimeState = (
  graphDocumentId: string,
  graph: SpaghettiGraph,
): GraphRuntimeState => {
  const compileBuild = createEmptyGraphCompileBuildState()
  const previewPreparation = prepareGraphPreviewPreparation(graph)
  const acceptedBuildImpact = null
  const acceptedBuildBundle = null
  const acceptedPreviewBuildBundle = null
  const acceptedAuthoritativeGraphRevision = null
  const acceptedDraftGraphRevision = null
  const acceptedAuthoritativeGeometryResult = null
  const acceptedDraftGeometryResult = null
  const acceptedBuildOutputs: PartArtifact[] = []
  const acceptedPreviewBuildOutputs: PartArtifact[] = []
  return {
    compileBuild,
    previewPreparation,
    acceptedBuildImpact,
    acceptedBuildBundle,
    acceptedPreviewBuildBundle,
    acceptedAuthoritativeGraphRevision,
    acceptedDraftGraphRevision,
    acceptedAuthoritativeGeometryResult,
    acceptedDraftGeometryResult,
    acceptedBuildOutputs,
    acceptedPreviewBuildOutputs,
    outputSurface: buildGraphOutputSurface({
      graphDocumentId,
      previewPreparation,
      acceptedBundle: acceptedBuildBundle,
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
  const acceptedBuildImpact = runtime?.acceptedBuildImpact ?? null
  const acceptedBuildBundle = runtime?.acceptedBuildBundle ?? null
  const acceptedPreviewBuildBundle = runtime?.acceptedPreviewBuildBundle ?? null
  const acceptedAuthoritativeGraphRevision = runtime?.acceptedAuthoritativeGraphRevision ?? null
  const acceptedDraftGraphRevision = runtime?.acceptedDraftGraphRevision ?? null
  const acceptedAuthoritativeGeometryResult =
    runtime?.acceptedAuthoritativeGeometryResult ?? null
  const acceptedDraftGeometryResult = runtime?.acceptedDraftGeometryResult ?? null
  const acceptedBuildOutputs = runtime?.acceptedBuildOutputs ?? []
  const acceptedPreviewBuildOutputs = runtime?.acceptedPreviewBuildOutputs ?? []
  return {
    compileBuild,
    previewPreparation,
    acceptedBuildImpact,
    acceptedBuildBundle,
    acceptedPreviewBuildBundle,
    acceptedAuthoritativeGraphRevision,
    acceptedDraftGraphRevision,
    acceptedAuthoritativeGeometryResult,
    acceptedDraftGeometryResult,
    acceptedBuildOutputs,
    acceptedPreviewBuildOutputs,
    outputSurface: buildGraphOutputSurface({
      graphDocumentId,
      previewPreparation,
      acceptedBundle: acceptedBuildBundle,
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
  | 'editorViewportHeaderCollapsedById'
  | 'editorViewportCanvasToolbarVisibleById'
  | 'editorViewportSelectedNodeIdById'
  | 'editorViewportSelectedEdgeIdById'
  | 'editorViewportConsolePreviewNodeIdById'
  | 'selectedNodeId'
  | 'selectedEdgeId'
  | 'consolePreviewNodeId'
>

const pruneViewportBooleanRecord = (
  record: Record<string, boolean> | undefined,
  editorViewportsById: Record<string, EditorViewport>,
): Record<string, boolean> =>
  Object.fromEntries(
    Object.entries(record ?? {}).filter(
      ([editorViewportId]) => editorViewportsById[editorViewportId] !== undefined,
    ),
  )

const pruneViewportNullableStringRecord = (
  record: Record<string, string | null> | undefined,
  editorViewportsById: Record<string, EditorViewport>,
): Record<string, string | null> =>
  Object.fromEntries(
    Object.entries(record ?? {}).filter(
      ([editorViewportId]) => editorViewportsById[editorViewportId] !== undefined,
    ),
  )

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
    editorViewportHeaderCollapsedById?: Record<string, boolean>
    editorViewportCanvasToolbarVisibleById?: Record<string, boolean>
    editorViewportSelectedNodeIdById?: Record<string, string | null>
    editorViewportSelectedEdgeIdById?: Record<string, string | null>
    editorViewportConsolePreviewNodeIdById?: Record<string, string | null>
    viewerTargetGraphDocumentId?: string | null
    fallbackGraphDocumentId?: string
  },
): GraphDocumentStateSlice &
  CachedGraphStateSlice &
  ViewportStateSlice &
  FeatureStackIrCacheSlice &
  Pick<
    SpaghettiStoreState,
    | 'editorViewportSelectedNodeIdById'
    | 'editorViewportSelectedEdgeIdById'
    | 'editorViewportConsolePreviewNodeIdById'
    | 'selectedNodeId'
    | 'selectedEdgeId'
    | 'consolePreviewNodeId'
  > => {
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
  const editorViewportHeaderCollapsedById = pruneViewportBooleanRecord(
    next.editorViewportHeaderCollapsedById ?? state.editorViewportHeaderCollapsedById,
    editorViewportsById,
  )
  const editorViewportCanvasToolbarVisibleById = pruneViewportBooleanRecord(
    next.editorViewportCanvasToolbarVisibleById ?? state.editorViewportCanvasToolbarVisibleById,
    editorViewportsById,
  )
  const editorViewportSelectedNodeIdById = pruneViewportNullableStringRecord(
    next.editorViewportSelectedNodeIdById ?? state.editorViewportSelectedNodeIdById,
    editorViewportsById,
  )
  const editorViewportSelectedEdgeIdById = pruneViewportNullableStringRecord(
    next.editorViewportSelectedEdgeIdById ?? state.editorViewportSelectedEdgeIdById,
    editorViewportsById,
  )
  const editorViewportConsolePreviewNodeIdById = pruneViewportNullableStringRecord(
    next.editorViewportConsolePreviewNodeIdById ?? state.editorViewportConsolePreviewNodeIdById,
    editorViewportsById,
  )
  const selectedNodeId = selectEditorViewportSelectedNodeId(
    {
      editorViewportSelectedNodeIdById,
      activeEditorViewportId,
      selectedNodeId: state.selectedNodeId,
    },
    activeEditorViewportId,
  )
  const selectedEdgeId = selectEditorViewportSelectedEdgeId(
    {
      editorViewportSelectedEdgeIdById,
      activeEditorViewportId,
      selectedEdgeId: state.selectedEdgeId,
    },
    activeEditorViewportId,
  )
  const consolePreviewNodeId = selectEditorViewportConsolePreviewNodeId(
    {
      editorViewportConsolePreviewNodeIdById,
      activeEditorViewportId,
      consolePreviewNodeId: state.consolePreviewNodeId,
    },
    activeEditorViewportId,
  )
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
    editorViewportHeaderCollapsedById,
    editorViewportCanvasToolbarVisibleById,
    editorViewportSelectedNodeIdById,
    editorViewportSelectedEdgeIdById,
    editorViewportConsolePreviewNodeIdById,
    selectedNodeId,
    selectedEdgeId,
    consolePreviewNodeId,
  }
}

const getMaxViewportZOrder = (editorViewportsById: Record<string, EditorViewport>): number =>
  Object.values(editorViewportsById).reduce((maxValue, viewport) => Math.max(maxValue, viewport.zOrder), 0)

const floatingViewportSpawnCascadeOffset = 32

const resolveNextViewportSpawnPosition = (
  editorViewportsById: Record<string, EditorViewport>,
): EditorViewportPosition => {
  const highestZViewport =
    [...Object.values(editorViewportsById)].sort((left, right) => right.zOrder - left.zOrder)[0] ?? null
  if (highestZViewport === null) {
    return defaultViewportPosition
  }
  return {
    x: highestZViewport.position.x + floatingViewportSpawnCascadeOffset,
    y: highestZViewport.position.y + floatingViewportSpawnCascadeOffset,
  }
}

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
    position: resolveNextViewportSpawnPosition(state.editorViewportsById),
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
      editorViewportHeaderCollapsedById: {},
      editorViewportCanvasToolbarVisibleById: {},
      editorViewportSelectedNodeIdById: {},
      editorViewportSelectedEdgeIdById: {},
      editorViewportConsolePreviewNodeIdById: {},
      selectedNodeId: null,
      selectedEdgeId: null,
      consolePreviewNodeId: null,
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
    | 'editorViewportHeaderCollapsedById'
    | 'editorViewportCanvasToolbarVisibleById'
    | 'editorViewportSelectedNodeIdById'
    | 'editorViewportSelectedEdgeIdById'
    | 'editorViewportConsolePreviewNodeIdById'
    | 'selectedNodeId'
    | 'selectedEdgeId'
    | 'consolePreviewNodeId'
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
    | 'editorViewportHeaderCollapsedById'
    | 'editorViewportCanvasToolbarVisibleById'
    | 'editorViewportSelectedNodeIdById'
    | 'editorViewportSelectedEdgeIdById'
    | 'editorViewportConsolePreviewNodeIdById'
    | 'selectedNodeId'
    | 'selectedEdgeId'
    | 'consolePreviewNodeId'
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

const doesRuntimeAcceptedAuthoritativeRevisionMatchCurrentGraphRevision = (
  runtime: GraphRuntimeState | null,
): runtime is GraphRuntimeState =>
  runtime !== null &&
  runtime.acceptedAuthoritativeGraphRevision !== null &&
  runtime.acceptedAuthoritativeGraphRevision === runtime.compileBuild.currentGraphRevision

const doesRuntimeAcceptedDraftRevisionMatchCurrentGraphRevision = (
  runtime: GraphRuntimeState | null,
): runtime is GraphRuntimeState =>
  runtime !== null &&
  runtime.acceptedDraftGraphRevision !== null &&
  runtime.acceptedDraftGraphRevision === runtime.compileBuild.currentGraphRevision

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

export const selectGraphAcceptedGeometryResultByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GeometryResultBundle | null =>
  doesRuntimeAcceptedAuthoritativeRevisionMatchCurrentGraphRevision(
    selectGraphRuntimeByDocumentId(state, graphDocumentId),
  )
    ? selectGraphRuntimeByDocumentId(state, graphDocumentId)?.acceptedAuthoritativeGeometryResult ??
      null
    : null

export const selectGraphAcceptedDraftGeometryResultByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GeometryResultBundle | null =>
  doesRuntimeAcceptedDraftRevisionMatchCurrentGraphRevision(
    selectGraphRuntimeByDocumentId(state, graphDocumentId),
  )
    ? selectGraphRuntimeByDocumentId(state, graphDocumentId)?.acceptedDraftGeometryResult ?? null
    : null

export const selectViewerTargetGraphAcceptedBuildOutputs = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): PartArtifact[] =>
  selectViewerTargetGraphRuntime(state)?.acceptedBuildOutputs ?? EMPTY_PART_ARTIFACTS

export const selectViewerTargetGraphAcceptedGeometryResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GeometryResultBundle | null =>
  doesRuntimeAcceptedAuthoritativeRevisionMatchCurrentGraphRevision(
    selectViewerTargetGraphRuntime(state),
  )
    ? selectViewerTargetGraphRuntime(state)?.acceptedAuthoritativeGeometryResult ?? null
    : null

export const selectViewerTargetGraphAcceptedAuthoritativeGeometryResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GeometryResultBundle | null =>
  doesRuntimeAcceptedAuthoritativeRevisionMatchCurrentGraphRevision(
    selectViewerTargetGraphRuntime(state),
  )
    ? selectViewerTargetGraphRuntime(state)?.acceptedAuthoritativeGeometryResult ?? null
    : null

export const selectViewerTargetGraphAcceptedPreviewBuildOutputs = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): PartArtifact[] =>
  selectViewerTargetGraphRuntime(state)?.acceptedPreviewBuildOutputs ?? EMPTY_PART_ARTIFACTS

export const selectViewerTargetGraphAcceptedPreviewGeometryResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GeometryResultBundle | null =>
  doesRuntimeAcceptedDraftRevisionMatchCurrentGraphRevision(selectViewerTargetGraphRuntime(state))
    ? selectViewerTargetGraphRuntime(state)?.acceptedDraftGeometryResult ?? null
    : null

export const selectViewerTargetGraphAcceptedDraftGeometryResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GeometryResultBundle | null =>
  doesRuntimeAcceptedDraftRevisionMatchCurrentGraphRevision(selectViewerTargetGraphRuntime(state))
    ? selectViewerTargetGraphRuntime(state)?.acceptedDraftGeometryResult ?? null
    : null

export const selectViewerTargetGraphCommittedAuthoritativeGeometryResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GeometryResultBundle | null =>
  selectViewerTargetGraphRuntime(state)?.acceptedAuthoritativeGeometryResult ?? null

export const selectViewerTargetGraphCommittedDraftGeometryResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GeometryResultBundle | null =>
  selectViewerTargetGraphRuntime(state)?.acceptedDraftGeometryResult ?? null

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

export const selectEditorViewportSelectedNodeId = (
  state: Pick<
    SpaghettiStoreState,
    'editorViewportSelectedNodeIdById' | 'activeEditorViewportId' | 'selectedNodeId'
  >,
  editorViewportId: string,
): string | null =>
  Object.prototype.hasOwnProperty.call(state.editorViewportSelectedNodeIdById, editorViewportId)
    ? state.editorViewportSelectedNodeIdById[editorViewportId] ?? null
    : state.activeEditorViewportId === editorViewportId
      ? state.selectedNodeId
      : null

export const selectEditorViewportSelectedEdgeId = (
  state: Pick<
    SpaghettiStoreState,
    'editorViewportSelectedEdgeIdById' | 'activeEditorViewportId' | 'selectedEdgeId'
  >,
  editorViewportId: string,
): string | null =>
  Object.prototype.hasOwnProperty.call(state.editorViewportSelectedEdgeIdById, editorViewportId)
    ? state.editorViewportSelectedEdgeIdById[editorViewportId] ?? null
    : state.activeEditorViewportId === editorViewportId
      ? state.selectedEdgeId
      : null

export const selectEditorViewportConsolePreviewNodeId = (
  state: Pick<
    SpaghettiStoreState,
    'editorViewportConsolePreviewNodeIdById' | 'activeEditorViewportId' | 'consolePreviewNodeId'
  >,
  editorViewportId: string,
): string | null =>
  Object.prototype.hasOwnProperty.call(
    state.editorViewportConsolePreviewNodeIdById,
    editorViewportId,
  )
    ? state.editorViewportConsolePreviewNodeIdById[editorViewportId] ?? null
    : state.activeEditorViewportId === editorViewportId
      ? state.consolePreviewNodeId
      : null

export const selectActiveEditorViewport = (
  state: Pick<SpaghettiStoreState, 'editorViewportsById' | 'activeEditorViewportId'>,
): EditorViewport | null => selectEditorViewportById(state, state.activeEditorViewportId)

export const selectNewNodeSpawnMode = (
  state: Pick<SpaghettiStoreState, 'newNodeSpawnMode'>,
): NodeRowMode => state.newNodeSpawnMode

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
  consolePreviewNodeId: null,
  editorViewportNodeFitRequest: null,
  editorViewportCanvasFitRequest: null,
  editorViewportHeaderCollapsedById: {},
  editorViewportCanvasToolbarVisibleById: {},
  newNodeSpawnMode: defaultNodeRowMode,
  editorViewportSelectedNodeIdById: {},
  editorViewportSelectedEdgeIdById: {},
  editorViewportConsolePreviewNodeIdById: {},
  selectedEdgeId: null,
  hoveredEdgeId: null,
  connectionDrag: null,
  sketchPlanePickSession: null,
  geometrySketchSession: null,
  uiMessage: null,
  setGraph: (next) => {
    const nextGraph = normalizeGraphForStoreCommit(next)
    set((state) => {
      const nextState = {
        ...state,
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
      return {
        ...nextState,
        ...withBrowserViewportState(nextState, {
          editorViewportSelectedNodeIdById: {
            ...nextState.editorViewportSelectedNodeIdById,
            [nextState.activeEditorViewportId]: null,
          },
          editorViewportSelectedEdgeIdById: {
            ...nextState.editorViewportSelectedEdgeIdById,
            [nextState.activeEditorViewportId]: null,
          },
          editorViewportConsolePreviewNodeIdById: {
            ...nextState.editorViewportConsolePreviewNodeIdById,
            [nextState.activeEditorViewportId]: null,
          },
        }),
        hoveredEdgeId: null,
        connectionDrag: null,
        sketchPlanePickSession: pruneSketchPlanePickSession(nextGraph, state.sketchPlanePickSession),
        geometrySketchSession: pruneGeometrySketchSession(
          nextGraph,
          state.geometrySketchSession,
        ),
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
        sketchPlanePickSession: pruneSketchPlanePickSession(nextGraph, state.sketchPlanePickSession),
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
        sketchPlanePickSession: pruneSketchPlanePickSession(nextGraph, state.sketchPlanePickSession),
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
  setNewNodeSpawnMode: (mode) => {
    if (!isNodeRowMode(mode)) {
      return
    }
    set({ newNodeSpawnMode: mode })
  },
  cycleNewNodeSpawnMode: () => {
    set((state) => ({
      newNodeSpawnMode: getNextViewMode(state.newNodeSpawnMode),
    }))
  },
  addEdge: (edge) => {
    get().applyGraphCommand(addEdgeCommand(edge))
  },
  removeEdge: (edgeId) => {
    set((state) => {
      const nextGraph = normalizeGraphForStoreCommit(removeEdgeCommand(edgeId)(state.graph))
      const nextWaypoints = { ...state.edgeWaypoints }
      delete nextWaypoints[edgeId]
      const nextState = {
        ...state,
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
      const activeSelectedEdgeId = selectEditorViewportSelectedEdgeId(
        nextState,
        nextState.activeEditorViewportId,
      )
      return {
        ...nextState,
        edgeWaypoints: nextWaypoints,
        ...withBrowserViewportState(nextState, {
          editorViewportSelectedEdgeIdById: {
            ...nextState.editorViewportSelectedEdgeIdById,
            [nextState.activeEditorViewportId]:
              activeSelectedEdgeId === edgeId ? null : activeSelectedEdgeId,
          },
        }),
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
    set((state) =>
      withBrowserViewportState(state, {
        editorViewportSelectedNodeIdById: {
          ...state.editorViewportSelectedNodeIdById,
          [state.activeEditorViewportId]: selectedNodeId,
        },
      }),
    )
  },
  setEditorViewportSelectedNodeId: (editorViewportId, selectedNodeId) => {
    set((state) => {
      if (state.editorViewportsById[editorViewportId] === undefined) {
        return state
      }
      return withBrowserViewportState(state, {
        editorViewportSelectedNodeIdById: {
          ...state.editorViewportSelectedNodeIdById,
          [editorViewportId]: selectedNodeId,
        },
      })
    })
  },
  setConsolePreviewNodeId: (consolePreviewNodeId) => {
    set((state) =>
      withBrowserViewportState(state, {
        editorViewportConsolePreviewNodeIdById: {
          ...state.editorViewportConsolePreviewNodeIdById,
          [state.activeEditorViewportId]: consolePreviewNodeId,
        },
      }),
    )
  },
  setEditorViewportConsolePreviewNodeId: (editorViewportId, consolePreviewNodeId) => {
    set((state) => {
      if (state.editorViewportsById[editorViewportId] === undefined) {
        return state
      }
      return withBrowserViewportState(state, {
        editorViewportConsolePreviewNodeIdById: {
          ...state.editorViewportConsolePreviewNodeIdById,
          [editorViewportId]: consolePreviewNodeId,
        },
      })
    })
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
  requestEditorViewportCanvasFit: (editorViewportId) => {
    set((state) => ({
      editorViewportCanvasFitRequest: {
        editorViewportId,
        key: (state.editorViewportCanvasFitRequest?.key ?? 0) + 1,
      },
    }))
  },
  setSelectedEdgeId: (selectedEdgeId) => {
    set((state) =>
      withBrowserViewportState(state, {
        editorViewportSelectedEdgeIdById: {
          ...state.editorViewportSelectedEdgeIdById,
          [state.activeEditorViewportId]: selectedEdgeId,
        },
      }),
    )
  },
  setEditorViewportSelectedEdgeId: (editorViewportId, selectedEdgeId) => {
    set((state) => {
      if (state.editorViewportsById[editorViewportId] === undefined) {
        return state
      }
      return withBrowserViewportState(state, {
        editorViewportSelectedEdgeIdById: {
          ...state.editorViewportSelectedEdgeIdById,
          [editorViewportId]: selectedEdgeId,
        },
      })
    })
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
  startSketchPlanePick: (nodeId) => {
    let didStart = false
    let collapsedViewportForWorkspace: EditorViewport | null = null
    set((state) => {
      const node = state.graph.nodes.find((candidate) => candidate.nodeId === nodeId)
      if (node === undefined || !isGeometrySketchNode(node)) {
        return state
      }
      const feature = readManagedSketchFeature(node.params.sketch)
      if (feature === null) {
        return state
      }
      const activeViewport = selectActiveEditorViewport(state)
      const shouldRestoreViewportWindowMode =
        activeViewport !== null &&
        activeViewport.windowMode !== 'collapsed' &&
        activeViewport.windowMode !== 'separateWindow'
      const editorViewportId = activeViewport?.editorViewportId ?? null
      const nextEditorViewportsById: typeof state.editorViewportsById =
        shouldRestoreViewportWindowMode && activeViewport !== null
          ? (() => {
              const collapsedViewport: EditorViewport = {
                ...activeViewport,
                windowMode: 'collapsed',
                restoreFromCollapsed: snapshotCollapsedRestoreState(activeViewport),
              }
              collapsedViewportForWorkspace = collapsedViewport
              return {
                ...state.editorViewportsById,
                [activeViewport.editorViewportId]: collapsedViewport,
              }
            })()
          : state.editorViewportsById
      didStart = true
      return {
        ...(nextEditorViewportsById === state.editorViewportsById
          ? {}
          : { editorViewportsById: nextEditorViewportsById }),
        sketchPlanePickSession: {
          nodeId,
          editorViewportId,
          shouldRestoreViewportWindowMode,
          stage: 'pick',
          liveTransformActivationNonce: 0,
          adjustScope: 'root',
          activeTransformAxis: null,
          gizmoMode: 'translate',
          draftPlane: feature.plane,
          previewPlane: feature.plane,
          transformCommandOrigin: null,
          draftTransform: ensureSketchPlaneTransform(feature),
          transformHistory: ensureSketchPlaneTransformHistory(feature),
          pendingMoveAxisOffSnapConfirmation: null,
        },
        geometrySketchSession:
          state.geometrySketchSession?.nodeId === nodeId ? null : state.geometrySketchSession,
      }
    })
    if (didStart) {
      if (collapsedViewportForWorkspace !== null) {
        const collapsedViewport = collapsedViewportForWorkspace as EditorViewport
        useWorkspaceStore
          .getState()
          .setEditorSurfacePlacement(
            collapsedViewport.editorViewportId,
            createEditorWorkspaceSurfaceStateFromViewport(collapsedViewport),
          )
      }
      appendConsoleEntry({
        layer: 'Commands',
        text: `Sketch plane pick started: ${nodeId}`,
        source: 'sketch-plane',
        severity: 'info',
      })
    }
  },
  cancelSketchPlanePick: () => {
    const session = get().sketchPlanePickSession
    set({ sketchPlanePickSession: null })
    if (
      session?.shouldRestoreViewportWindowMode === true &&
      session.editorViewportId !== null &&
      selectEditorViewportById(get(), session.editorViewportId)?.windowMode === 'collapsed'
    ) {
      get().setEditorViewportWindowMode(session.editorViewportId, 'collapsed')
    }
    if (session !== null) {
      appendConsoleEntry({
        layer: 'Commands',
        text: `Sketch plane pick cancelled: ${session.nodeId}`,
        source: 'sketch-plane',
        severity: 'info',
      })
    }
  },
  finishSketchPlanePick: () => {
    const session = get().sketchPlanePickSession
    if (session === null) {
      return
    }
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, session.nodeId, (feature) => {
        const currentTransform = ensureSketchPlaneTransform(feature)
        const nextTransform = session.draftTransform
        const nextTransformHistory = resolvePersistedSketchPlaneTransformHistory(
          session.transformHistory,
          nextTransform,
        )
        if (
          feature.plane === session.draftPlane &&
          currentTransform.offsetMm === nextTransform.offsetMm &&
          currentTransform.translation.x === nextTransform.translation.x &&
          currentTransform.translation.y === nextTransform.translation.y &&
          currentTransform.translation.z === nextTransform.translation.z &&
          currentTransform.rotationDeg.x === nextTransform.rotationDeg.x &&
          currentTransform.rotationDeg.y === nextTransform.rotationDeg.y &&
          currentTransform.rotationDeg.z === nextTransform.rotationDeg.z &&
          currentTransform.inPlaneRotationDeg === nextTransform.inPlaneRotationDeg &&
          areSketchPlaneTransformHistoryEntriesEqual(
            feature.uiState.sketchPlaneTransformHistory,
            nextTransformHistory,
          )
        ) {
          return feature
        }
        return {
          ...feature,
          plane: session.draftPlane,
          planeTransform: {
            ...nextTransform,
            translation: { ...nextTransform.translation },
            rotationDeg: { ...nextTransform.rotationDeg },
          },
          uiState: {
            ...feature.uiState,
            sketchPlaneTransformHistory: nextTransformHistory,
          },
        }
      })
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        sketchPlanePickSession: null,
      }
    })
    if (
      session.shouldRestoreViewportWindowMode === true &&
      session.editorViewportId !== null &&
      selectEditorViewportById(get(), session.editorViewportId)?.windowMode === 'collapsed'
    ) {
      get().setEditorViewportWindowMode(session.editorViewportId, 'collapsed')
    }
    appendConsoleEntry({
      layer: 'Commands',
      text: `Sketch plane finished: ${session.draftPlane}`,
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  confirmSketchPlanePick: () => {
    const session = get().sketchPlanePickSession
    if (session === null || session.stage !== 'adjust' || session.adjustScope !== 'root') {
      return
    }
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, session.nodeId, (feature) => {
        const currentTransform = ensureSketchPlaneTransform(feature)
        const nextTransform = session.draftTransform
        const nextTransformHistory = resolvePersistedSketchPlaneTransformHistory(
          session.transformHistory,
          nextTransform,
        )
        if (
          feature.plane === session.draftPlane &&
          currentTransform.offsetMm === nextTransform.offsetMm &&
          currentTransform.translation.x === nextTransform.translation.x &&
          currentTransform.translation.y === nextTransform.translation.y &&
          currentTransform.translation.z === nextTransform.translation.z &&
          currentTransform.rotationDeg.x === nextTransform.rotationDeg.x &&
          currentTransform.rotationDeg.y === nextTransform.rotationDeg.y &&
          currentTransform.rotationDeg.z === nextTransform.rotationDeg.z &&
          currentTransform.inPlaneRotationDeg === nextTransform.inPlaneRotationDeg &&
          areSketchPlaneTransformHistoryEntriesEqual(
            feature.uiState.sketchPlaneTransformHistory,
            nextTransformHistory,
          )
        ) {
          return feature
        }
        return {
          ...feature,
          plane: session.draftPlane,
          planeTransform: {
            ...nextTransform,
            translation: { ...nextTransform.translation },
            rotationDeg: { ...nextTransform.rotationDeg },
          },
          uiState: {
            ...feature.uiState,
            sketchPlaneTransformHistory: nextTransformHistory,
          },
        }
      })
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        sketchPlanePickSession: null,
      }
    })
    if (
      session.shouldRestoreViewportWindowMode === true &&
      session.editorViewportId !== null &&
      selectEditorViewportById(get(), session.editorViewportId)?.windowMode === 'collapsed'
    ) {
      get().setEditorViewportWindowMode(session.editorViewportId, 'collapsed')
    }
    appendConsoleEntry({
      layer: 'Commands',
      text: `Sketch plane pick confirmed: ${session.draftPlane}`,
      source: 'sketch-plane',
      severity: 'info',
    })
    get().startGeometrySketchSession(session.nodeId, 'draw')
  },
  setSketchPlanePickDraftPlane: (plane) => {
    if (!isSketchPlane(plane)) {
      return
    }
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftPlane: plane,
          previewPlane: null,
          transformCommandOrigin: null,
          stage: 'adjust',
          adjustScope: 'root',
          activeTransformAxis: null,
        },
      }
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: `Sketch plane selected: ${plane}`,
      source: 'sketch-plane',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: SKETCH_PLANE_ROOT_PROMPT,
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  reopenSketchPlanePickPlaneSelection: () => {
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.stage === 'pick') {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          stage: 'pick',
          adjustScope: 'root',
          activeTransformAxis: null,
          previewPlane: session.draftPlane,
          transformCommandOrigin: null,
        },
      }
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: 'Sketch Plane > [XY, XZ, YZ]',
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  setSketchPlanePickGizmoMode: (mode) => {
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.gizmoMode === mode) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          adjustScope: 'root',
          activeTransformAxis: null,
          previewPlane: null,
          transformCommandOrigin: null,
          gizmoMode: mode,
        },
      }
    })
  },
  setSketchPlanePickPreviewPlane: (plane) => {
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.stage !== 'pick' || session.previewPlane === plane) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          previewPlane: plane,
        },
      }
    })
  },
  acceptActiveSketchPlaneTransformCommand: () => {
    const session = get().sketchPlanePickSession
    if (session === null || session.stage !== 'adjust' || session.adjustScope === 'root') {
      return
    }
    const nextTransformHistory =
      session.adjustScope === 'move' || session.adjustScope === 'move-axis'
        ? appendSketchPlaneTransformHistoryEntry(
            session.transformHistory,
            session.draftTransform.translation,
          )
        : cloneSketchPlaneTransformHistoryEntries(session.transformHistory)
    if (session.adjustScope === 'move-axis') {
      set({
        sketchPlanePickSession: {
          ...session,
          adjustScope: 'move',
          activeTransformAxis: 'free',
          transformCommandOrigin: cloneSketchPlaneTransform(session.draftTransform),
          transformHistory: nextTransformHistory,
          pendingMoveAxisOffSnapConfirmation: null,
        },
      })
      appendConsoleEntry({
        layer: 'Commands',
        text: buildSketchPlaneMovePrompt(session.draftTransform.translation),
        source: 'sketch-plane',
        severity: 'info',
      })
      return
    }
    set({
      sketchPlanePickSession: {
        ...session,
        adjustScope: 'root',
        activeTransformAxis: null,
        transformCommandOrigin: null,
        transformHistory: nextTransformHistory,
        pendingMoveAxisOffSnapConfirmation: null,
      },
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: SKETCH_PLANE_ROOT_PROMPT,
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  commitSketchPlaneTransformHistoryFromDraftRelease: () => {
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.stage !== 'adjust') {
        return state
      }
      const nextHistory = appendSketchPlaneTransformHistoryEntry(
        session.transformHistory,
        session.draftTransform.translation,
      )
      if (
        areSketchPlaneTransformHistoryEntriesEqual(session.transformHistory, nextHistory) &&
        session.transformCommandOrigin !== null &&
        session.transformCommandOrigin.offsetMm === session.draftTransform.offsetMm &&
        session.transformCommandOrigin.translation.x === session.draftTransform.translation.x &&
        session.transformCommandOrigin.translation.y === session.draftTransform.translation.y &&
        session.transformCommandOrigin.translation.z === session.draftTransform.translation.z &&
        session.transformCommandOrigin.rotationDeg.x === session.draftTransform.rotationDeg.x &&
        session.transformCommandOrigin.rotationDeg.y === session.draftTransform.rotationDeg.y &&
        session.transformCommandOrigin.rotationDeg.z === session.draftTransform.rotationDeg.z &&
        session.transformCommandOrigin.inPlaneRotationDeg ===
          session.draftTransform.inPlaneRotationDeg
      ) {
        return state
      }
      return {
        ...state,
        sketchPlanePickSession: {
          ...session,
          transformCommandOrigin: {
            ...session.draftTransform,
            translation: { ...session.draftTransform.translation },
            rotationDeg: { ...session.draftTransform.rotationDeg },
          },
          transformHistory: nextHistory,
        },
      }
    })
  },
  toggleSketchPlaneTransformHistoryLock: (entryId) => {
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null) {
        return state
      }
      let changed = false
      const nextHistory = session.transformHistory.map((entry) => {
        if (entry.entryId !== entryId) {
          return entry
        }
        changed = true
        return {
          ...entry,
          locked: !entry.locked,
        }
      })
      if (!changed) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          transformHistory: nextHistory,
        },
      }
    })
  },
  mergeSketchPlaneTransformHistory: () => {
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null) {
        return state
      }
      const nextHistory = mergeSketchPlaneTransformHistoryEntries(session.transformHistory)
      if (
        areSketchPlaneTransformHistoryEntriesEqual(
          session.transformHistory,
          nextHistory,
        )
      ) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          transformHistory: nextHistory,
        },
      }
    })
  },
  runSketchPlaneCommand: (command) => {
    const state = get()
    switch (command) {
      case 'xy':
        state.setSketchPlanePickDraftPlane('XY')
        return
      case 'xz':
        state.setSketchPlanePickDraftPlane('XZ')
        return
      case 'yz':
        state.setSketchPlanePickDraftPlane('YZ')
        return
      case 'esc':
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: '> esc',
        })
        state.returnActiveSketchSessionOneLevel()
        return
      case 'back':
        state.returnActiveSketchSessionOneLevel()
        return
      case 'done':
        state.finishSketchPlanePick()
        return
      case 'confirm-to-sketch':
        state.confirmSketchPlanePick()
        return
      case 'x':
        state.cancelSketchPlanePick()
        return
      case 'move':
      case 'move-again':
        const moveSession = get().sketchPlanePickSession
        set((currentState) => {
          const session = currentState.sketchPlanePickSession
          if (session === null) {
            return currentState
          }
          return {
            sketchPlanePickSession: buildSketchPlaneMoveSessionState(session),
          }
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneMovePrompt(
            moveSession?.draftTransform.translation ?? { x: 0, y: 0, z: 0 },
          ),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      case 'move-snap':
        set((currentState) => {
          const session = currentState.sketchPlanePickSession
          if (session === null) {
            return currentState
          }
          return {
            sketchPlanePickSession: {
              ...session,
              stage: 'adjust',
              liveTransformActivationNonce: session.liveTransformActivationNonce + 1,
              adjustScope: 'move-snap',
              activeTransformAxis: null,
              gizmoMode: 'translate',
              pendingMoveAxisOffSnapConfirmation: null,
            },
          }
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneSnapPrompt(
            'move',
            useUiPrefsStore.getState().sketchPlaneToolbarTranslateSnapValue,
          ),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      case 'rotate-snap':
        set((currentState) => {
          const session = currentState.sketchPlanePickSession
          if (session === null) {
            return currentState
          }
          return {
            sketchPlanePickSession: {
              ...session,
              stage: 'adjust',
              liveTransformActivationNonce: session.liveTransformActivationNonce + 1,
              adjustScope: 'rotate-snap',
              activeTransformAxis: null,
              gizmoMode: 'rotate',
              pendingMoveAxisOffSnapConfirmation: null,
            },
          }
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneSnapPrompt(
            'rotate',
            useUiPrefsStore.getState().sketchPlaneToolbarRotateSnapValue,
          ),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      case 'rotate':
        const rotateSession = get().sketchPlanePickSession
        set((currentState) => {
          const session = currentState.sketchPlanePickSession
          if (session === null) {
            return currentState
          }
          return {
            sketchPlanePickSession: {
              ...session,
              stage: 'adjust',
              liveTransformActivationNonce: session.liveTransformActivationNonce + 1,
              adjustScope: 'rotate',
              activeTransformAxis: 'free',
              gizmoMode: 'rotate',
              transformCommandOrigin: cloneSketchPlaneTransform(session.draftTransform),
              pendingMoveAxisOffSnapConfirmation: null,
            },
          }
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneRotatePrompt(
            rotateSession?.draftTransform.rotationDeg ?? { x: 0, y: 0, z: 0 },
          ),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      case 'move-x':
      case 'move-y':
      case 'move-z':
        const moveAxisSession = get().sketchPlanePickSession
        set((currentState) => {
          const session = currentState.sketchPlanePickSession
          if (session === null) {
            return currentState
          }
          const baselineTransform = cloneSketchPlaneTransform(session.draftTransform)
          return {
            sketchPlanePickSession: {
              ...session,
              stage: 'adjust',
              liveTransformActivationNonce: session.liveTransformActivationNonce + 1,
              adjustScope: 'move-axis',
              activeTransformAxis:
                command === 'move-x' ? 'x' : command === 'move-y' ? 'y' : 'z',
              gizmoMode: 'translate',
              draftTransform: baselineTransform,
              transformCommandOrigin: baselineTransform,
              pendingMoveAxisOffSnapConfirmation: null,
            },
          }
        })
        const moveAxis =
          command === 'move-x' ? 'x' : command === 'move-y' ? 'y' : 'z'
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneMoveAxisPrompt(
            moveAxis,
            moveAxisSession?.draftTransform.translation[moveAxis] ?? 0,
          ),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      case 'rotate-x':
      case 'rotate-y':
      case 'rotate-z':
        set((currentState) => {
          const session = currentState.sketchPlanePickSession
          if (session === null) {
            return currentState
          }
          const baselineTransform =
            session.transformCommandOrigin === null
              ? cloneSketchPlaneTransform(session.draftTransform)
              : cloneSketchPlaneTransform(session.transformCommandOrigin)
          return {
            sketchPlanePickSession: {
              ...session,
              stage: 'adjust',
              liveTransformActivationNonce: session.liveTransformActivationNonce + 1,
              adjustScope: 'rotate',
              activeTransformAxis:
                command === 'rotate-x' ? 'x' : command === 'rotate-y' ? 'y' : 'z',
              gizmoMode: 'rotate',
              draftTransform: baselineTransform,
              transformCommandOrigin: baselineTransform,
            },
          }
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneRotatePrompt(
            get().sketchPlanePickSession?.draftTransform.rotationDeg ?? { x: 0, y: 0, z: 0 },
          ),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
    }
  },
  resetSketchPlanePickDraftTransform: () => {
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null) {
        return state
      }
      const nextTransform = createDefaultSketchPlaneTransform()
      if (
        session.draftTransform.offsetMm === nextTransform.offsetMm &&
        session.draftTransform.inPlaneRotationDeg === nextTransform.inPlaneRotationDeg &&
        session.draftTransform.translation.x === nextTransform.translation.x &&
        session.draftTransform.translation.y === nextTransform.translation.y &&
        session.draftTransform.translation.z === nextTransform.translation.z &&
        session.draftTransform.rotationDeg.x === nextTransform.rotationDeg.x &&
        session.draftTransform.rotationDeg.y === nextTransform.rotationDeg.y &&
        session.draftTransform.rotationDeg.z === nextTransform.rotationDeg.z
      ) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftTransform: nextTransform,
        },
      }
    })
    appendConsoleEntry({
      layer: 'Transforms',
      text: 'Sketch plane transform reset',
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  setSketchPlanePickDraftTransform: (transform) => {
    const normalizedTransform: SketchPlaneTransform = {
      offsetMm: Number.isFinite(transform.offsetMm) ? transform.offsetMm : 0,
      inPlaneRotationDeg: Number.isFinite(transform.inPlaneRotationDeg)
        ? transform.inPlaneRotationDeg
        : 0,
      translation: {
        x: Number.isFinite(transform.translation.x) ? transform.translation.x : 0,
        y: Number.isFinite(transform.translation.y) ? transform.translation.y : 0,
        z: Number.isFinite(transform.translation.z) ? transform.translation.z : 0,
      },
      rotationDeg: {
        x: Number.isFinite(transform.rotationDeg.x) ? transform.rotationDeg.x : 0,
        y: Number.isFinite(transform.rotationDeg.y) ? transform.rotationDeg.y : 0,
        z: Number.isFinite(transform.rotationDeg.z) ? transform.rotationDeg.z : 0,
      },
    }
    set((state) => {
      const session = state.sketchPlanePickSession
      if (
        session === null ||
        (
          session.draftTransform.offsetMm === normalizedTransform.offsetMm &&
          session.draftTransform.inPlaneRotationDeg === normalizedTransform.inPlaneRotationDeg &&
          session.draftTransform.translation.x === normalizedTransform.translation.x &&
          session.draftTransform.translation.y === normalizedTransform.translation.y &&
          session.draftTransform.translation.z === normalizedTransform.translation.z &&
          session.draftTransform.rotationDeg.x === normalizedTransform.rotationDeg.x &&
          session.draftTransform.rotationDeg.y === normalizedTransform.rotationDeg.y &&
          session.draftTransform.rotationDeg.z === normalizedTransform.rotationDeg.z
        )
      ) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftTransform: {
            ...normalizedTransform,
            translation: { ...normalizedTransform.translation },
            rotationDeg: { ...normalizedTransform.rotationDeg },
          },
          pendingMoveAxisOffSnapConfirmation: null,
        },
      }
    })
    appendConsoleEntry({
      layer: 'Transforms',
      text:
        `Sketch plane draft transform: ` +
        `move (${normalizedTransform.translation.x.toFixed(1)}, ${normalizedTransform.translation.y.toFixed(1)}, ${normalizedTransform.translation.z.toFixed(1)}) ` +
        `rotate (${normalizedTransform.rotationDeg.x.toFixed(0)}, ${normalizedTransform.rotationDeg.y.toFixed(0)}, ${normalizedTransform.rotationDeg.z.toFixed(0)})`,
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  setSketchPlanePickTranslationAxis: (axis, value) => {
    if (!Number.isFinite(value)) {
      return
    }
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.draftTransform.translation[axis] === value) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftTransform: {
            ...session.draftTransform,
            translation: {
              ...session.draftTransform.translation,
              [axis]: value,
            },
          },
          pendingMoveAxisOffSnapConfirmation:
            session.pendingMoveAxisOffSnapConfirmation !== null &&
            session.pendingMoveAxisOffSnapConfirmation.axis === axis
              ? null
              : session.pendingMoveAxisOffSnapConfirmation,
        },
      }
    })
    appendConsoleEntry({
      layer: 'Transforms',
      text: `Sketch plane moved: ${axis.toUpperCase()} ${value.toFixed(1)}`,
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  setSketchPlanePickRotationAxis: (axis, value) => {
    if (!Number.isFinite(value)) {
      return
    }
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.draftTransform.rotationDeg[axis] === value) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftTransform: {
            ...session.draftTransform,
            rotationDeg: {
              ...session.draftTransform.rotationDeg,
              [axis]: value,
            },
          },
          pendingMoveAxisOffSnapConfirmation: null,
        },
      }
    })
    appendConsoleEntry({
      layer: 'Transforms',
      text: `Sketch plane rotated: ${axis.toUpperCase()} ${value.toFixed(0)}`,
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  setSketchPlaneMoveAxisOffSnapConfirmation: (axis, value, literal) => {
    if (!Number.isFinite(value)) {
      return
    }
    set((state) => {
      const session = state.sketchPlanePickSession
      if (
        session === null ||
        session.adjustScope !== 'move-axis' ||
        session.activeTransformAxis !== axis
      ) {
        return state
      }
      if (
        session.pendingMoveAxisOffSnapConfirmation?.axis === axis &&
        session.pendingMoveAxisOffSnapConfirmation.value === value &&
        session.pendingMoveAxisOffSnapConfirmation.literal === literal
      ) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          pendingMoveAxisOffSnapConfirmation: {
            axis,
            value,
            literal,
          },
        },
      }
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildSketchPlaneMoveAxisOffSnapConfirmPrompt(axis, literal),
      source: 'sketch-plane',
      severity: 'info',
    })
  },
  clearSketchPlaneMoveAxisOffSnapConfirmation: () => {
    set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.pendingMoveAxisOffSnapConfirmation === null) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          pendingMoveAxisOffSnapConfirmation: null,
        },
      }
    })
  },
  setGeometrySketchPlane: (nodeId, plane) => {
    if (!isSketchPlane(plane)) {
      return
    }
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        if (feature.plane === plane) {
          return feature
        }
        return {
          ...feature,
          plane,
        }
      })
      const nextSession =
        state.sketchPlanePickSession?.nodeId === nodeId
          ? null
          : pruneSketchPlanePickSession(nextGraph, state.sketchPlanePickSession)
      if (nextGraph === state.graph && nextSession === state.sketchPlanePickSession) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        sketchPlanePickSession: nextSession,
      }
    })
  },
  setGeometrySketchPlaneOffset: (nodeId, offsetMm) => {
    if (!Number.isFinite(offsetMm)) {
      return
    }
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const currentTransform = ensureSketchPlaneTransform(feature)
        if (currentTransform.offsetMm === offsetMm) {
          return feature
        }
        return {
          ...feature,
          planeTransform: {
            ...currentTransform,
            offsetMm,
          },
        }
      })
      if (nextGraph === state.graph) {
        return state
      }
      return withUpdatedActiveGraphDocumentState(state, nextGraph)
    })
  },
  setGeometrySketchPlaneTranslationAxis: (nodeId, axis, value) => {
    if (!Number.isFinite(value)) {
      return
    }
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const currentTransform = ensureSketchPlaneTransform(feature)
        if (currentTransform.translation[axis] === value) {
          return feature
        }
        return {
          ...feature,
          planeTransform: {
            ...currentTransform,
            translation: {
              ...currentTransform.translation,
              [axis]: value,
            },
          },
        }
      })
      if (nextGraph === state.graph) {
        return state
      }
      return withUpdatedActiveGraphDocumentState(state, nextGraph)
    })
  },
  setGeometrySketchPlaneRotationAxis: (nodeId, axis, value) => {
    if (!Number.isFinite(value)) {
      return
    }
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const currentTransform = ensureSketchPlaneTransform(feature)
        if (currentTransform.rotationDeg[axis] === value) {
          return feature
        }
        return {
          ...feature,
          planeTransform: {
            ...currentTransform,
            rotationDeg: {
              ...currentTransform.rotationDeg,
              [axis]: value,
            },
          },
        }
      })
      if (nextGraph === state.graph) {
        return state
      }
      return withUpdatedActiveGraphDocumentState(state, nextGraph)
    })
  },
  setGeometrySketchPlaneInPlaneRotation: (nodeId, rotationDeg) => {
    if (!Number.isFinite(rotationDeg)) {
      return
    }
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const currentTransform = ensureSketchPlaneTransform(feature)
        if (currentTransform.inPlaneRotationDeg === rotationDeg) {
          return feature
        }
        return {
          ...feature,
          planeTransform: {
            ...currentTransform,
            inPlaneRotationDeg: rotationDeg,
          },
        }
      })
      if (nextGraph === state.graph) {
        return state
      }
      return withUpdatedActiveGraphDocumentState(state, nextGraph)
    })
  },
  startGeometrySketchSession: (nodeId, mode) => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    let collapsedViewportForWorkspace: EditorViewport | null = null
    set((state) => {
      const node = state.graph.nodes.find((candidate) => candidate.nodeId === nodeId)
      if (node === undefined || !isGeometrySketchNode(node)) {
        return state
      }
      const current = state.geometrySketchSession
      if (
        current !== null &&
        current.nodeId === nodeId &&
        current.mode === mode
      ) {
        return state
      }
      const shouldCollapseViewport = mode === 'draw'
      const activeViewport = shouldCollapseViewport ? selectActiveEditorViewport(state) : null
      const shouldRestoreViewportWindowMode =
        shouldCollapseViewport &&
        activeViewport !== null &&
        activeViewport.windowMode !== 'collapsed' &&
        activeViewport.windowMode !== 'separateWindow'
      const editorViewportId =
        shouldCollapseViewport
          ? (current?.editorViewportId ?? activeViewport?.editorViewportId ?? null)
          : null
      const nextEditorViewportsById: typeof state.editorViewportsById =
        shouldRestoreViewportWindowMode && activeViewport !== null
          ? (() => {
              const collapsedViewport: EditorViewport = {
                ...activeViewport,
                windowMode: 'collapsed',
                restoreFromCollapsed: snapshotCollapsedRestoreState(activeViewport),
              }
              collapsedViewportForWorkspace = collapsedViewport
              return {
                ...state.editorViewportsById,
                [activeViewport.editorViewportId]: collapsedViewport,
              }
            })()
          : state.editorViewportsById
      const activeTool =
        mode === 'draw' && current?.nodeId === nodeId && current.mode === 'draw'
          ? current.activeTool
          : null
      const lastUsedTool =
        current?.nodeId === nodeId
          ? current.lastUsedTool
          : null
      const drawDraft = buildGeometrySketchSessionDraft(mode, activeTool)
      if (mode === 'draw') {
        nextPromptRef.current = {
          tool: activeTool,
          draft: drawDraft,
          lastUsedTool,
        }
      }
      return {
        ...(nextEditorViewportsById === state.editorViewportsById
          ? {}
          : { editorViewportsById: nextEditorViewportsById }),
        geometrySketchSession: {
          nodeId,
          mode,
          activeTool,
          lastUsedTool,
          drawStage: resolveGeometrySketchDrawStage(mode, activeTool, drawDraft),
          editorViewportId,
          shouldRestoreViewportWindowMode:
            current?.nodeId === nodeId
              ? current.shouldRestoreViewportWindowMode || shouldRestoreViewportWindowMode
              : shouldRestoreViewportWindowMode,
          drawDraft,
          selectedComponentIds: [],
          hoveredComponentId: null,
          selectionWindowDraft: null,
        },
        sketchPlanePickSession: null,
      }
    })
    if (collapsedViewportForWorkspace !== null) {
      const collapsedViewport = collapsedViewportForWorkspace as EditorViewport
      useWorkspaceStore
        .getState()
        .setEditorSurfacePlacement(
          collapsedViewport.editorViewportId,
          createEditorWorkspaceSurfaceStateFromViewport(collapsedViewport),
        )
    }
    if (nextPromptRef.current !== null) {
      appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },
  closeGeometrySketchSession: () => {
    const session = get().geometrySketchSession
    set({ geometrySketchSession: null })
    if (
      session?.shouldRestoreViewportWindowMode === true &&
      session.editorViewportId !== null &&
      selectEditorViewportById(get(), session.editorViewportId)?.windowMode === 'collapsed'
    ) {
      get().setEditorViewportWindowMode(session.editorViewportId, 'collapsed')
    }
  },
  returnActiveSketchSessionOneLevel: () => {
    const state = get()
    if (state.sketchPlanePickSession !== null) {
      if (state.sketchPlanePickSession.adjustScope === 'move-axis') {
        const revertedTransform =
          state.sketchPlanePickSession.transformCommandOrigin === null
            ? state.sketchPlanePickSession.draftTransform
            : cloneSketchPlaneTransform(state.sketchPlanePickSession.transformCommandOrigin)
        set({
          sketchPlanePickSession: {
            ...state.sketchPlanePickSession,
            adjustScope: 'move',
            activeTransformAxis: 'free',
            transformCommandOrigin: cloneSketchPlaneTransform(revertedTransform),
            draftTransform: revertedTransform,
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneMovePrompt(revertedTransform.translation),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      if (state.sketchPlanePickSession.adjustScope === 'move-snap') {
        set({
          sketchPlanePickSession: {
            ...state.sketchPlanePickSession,
            adjustScope: 'move',
            activeTransformAxis: 'free',
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneMovePrompt(state.sketchPlanePickSession.draftTransform.translation),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      if (state.sketchPlanePickSession.adjustScope === 'rotate-snap') {
        set({
          sketchPlanePickSession: {
            ...state.sketchPlanePickSession,
            adjustScope: 'rotate',
            activeTransformAxis: 'free',
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneRotatePrompt(state.sketchPlanePickSession.draftTransform.rotationDeg),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      if (
        state.sketchPlanePickSession.stage === 'adjust' &&
        state.sketchPlanePickSession.adjustScope !== 'root'
      ) {
        const revertedTransform =
          state.sketchPlanePickSession.transformCommandOrigin === null
            ? state.sketchPlanePickSession.draftTransform
            : cloneSketchPlaneTransform(state.sketchPlanePickSession.transformCommandOrigin)
        set({
          sketchPlanePickSession: {
            ...state.sketchPlanePickSession,
            adjustScope: 'root',
            activeTransformAxis: null,
            transformCommandOrigin: null,
            draftTransform: revertedTransform,
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: SKETCH_PLANE_ROOT_PROMPT,
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      if (state.sketchPlanePickSession.stage === 'adjust') {
        state.reopenSketchPlanePickPlaneSelection()
        return
      }
      state.cancelSketchPlanePick()
      return
    }
    if (state.geometrySketchSession?.mode === 'draw') {
      state.cancelGeometrySketchDrawDraft()
    }
  },
  runGeometrySketchDrawCommand: (command) => {
    const state = get()
    switch (command) {
      case 'line':
      case 'l':
        state.setGeometrySketchSessionTool('line')
        return
      case 'pline':
      case 'pl':
        state.setGeometrySketchSessionTool('pline')
        return
      case 'rectangle':
      case 'rec':
        state.setGeometrySketchSessionTool('rectangle')
        return
      case 'circle':
      case 'cc':
        state.setGeometrySketchSessionTool('circle')
        return
      case 'previous':
      case 'p':
        if (
          state.geometrySketchSession?.mode === 'draw' &&
          isGeometrySketchDrawTool(state.geometrySketchSession.lastUsedTool)
        ) {
          state.setGeometrySketchSessionTool(state.geometrySketchSession.lastUsedTool)
        }
        return
      case 'undo':
        state.undoGeometrySketchDrawDraftPoint()
        return
      case 'enter':
        if (
          state.geometrySketchSession?.mode === 'draw' &&
          state.geometrySketchSession.activeTool === null &&
          isGeometrySketchDrawTool(state.geometrySketchSession.lastUsedTool)
        ) {
          state.setGeometrySketchSessionTool(state.geometrySketchSession.lastUsedTool)
          return
        }
        state.finishGeometrySketchDrawDraft()
        return
      case 'delete':
      case 'del':
        state.deleteGeometrySketchSelectedComponents()
        return
      case 'back':
      case 'b':
        state.cancelGeometrySketchDrawDraft()
        return
      case 'esc':
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: '> esc',
        })
        state.cancelGeometrySketchDrawDraft()
        return
      case 'x':
        state.closeGeometrySketchSession()
        return
    }
  },
  setGeometrySketchSessionTool: (tool) => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    set((state) => {
      if (state.geometrySketchSession === null) {
        return state
      }
      if (state.geometrySketchSession.mode === 'draw') {
        const nextDraft =
          state.geometrySketchSession.activeTool === tool
            ? state.geometrySketchSession.drawDraft
            : buildGeometrySketchSessionDraft(state.geometrySketchSession.mode, tool)
        nextPromptRef.current = {
          tool,
          draft: nextDraft,
          lastUsedTool: tool,
        }
      }
      if (state.geometrySketchSession.activeTool === tool) {
        return state
      }
      return {
        geometrySketchSession: {
          ...state.geometrySketchSession,
          activeTool: tool,
          lastUsedTool: isGeometrySketchDrawTool(tool)
            ? tool
            : state.geometrySketchSession.lastUsedTool,
          drawStage: resolveGeometrySketchDrawStage(
            state.geometrySketchSession.mode,
            tool,
            buildGeometrySketchSessionDraft(state.geometrySketchSession.mode, tool),
          ),
          drawDraft: buildGeometrySketchSessionDraft(state.geometrySketchSession.mode, tool),
          selectedComponentIds: [],
          hoveredComponentId: null,
          selectionWindowDraft: null,
        },
      }
    })
    if (nextPromptRef.current !== null) {
      appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },
  setGeometrySketchDrawHoverPoint: (point, snapTarget) => {
    set((state) => {
      const session = state.geometrySketchSession
      if (session === null || session.mode !== 'draw' || session.drawDraft === null) {
        return state
      }
      const normalizedPoint = point === null ? null : normalizeGeometrySketchDraftPoint(point)
      const nextSnapTarget = normalizedPoint === null ? null : snapTarget
      if (
        areGeometrySketchDraftPointsEqual(session.drawDraft.hoverPoint, normalizedPoint) &&
        session.drawDraft.hoverSnapTarget === nextSnapTarget
      ) {
        return state
      }
      return {
        geometrySketchSession: {
          ...session,
          drawStage: resolveGeometrySketchDrawStage(
            session.mode,
            session.activeTool,
            {
              ...session.drawDraft,
              hoverPoint: normalizedPoint,
              hoverSnapTarget: nextSnapTarget,
            },
          ),
          drawDraft: {
            ...session.drawDraft,
            hoverPoint: normalizedPoint,
            hoverSnapTarget: nextSnapTarget,
          },
        },
      }
    })
  },
  setGeometrySketchHoveredComponent: (rowId) => {
    set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== null ||
        session.drawStage !== 'sessionIdle' ||
        session.hoveredComponentId === rowId
      ) {
        return state
      }
      return {
        geometrySketchSession: {
          ...session,
          hoveredComponentId: rowId,
        },
      }
    })
  },
  setGeometrySketchSelectedComponents: (rowIds) => {
    set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== null ||
        session.drawStage !== 'sessionIdle'
      ) {
        return state
      }
      const nextSelectedComponentIds = normalizeGeometrySketchSelectionIds(rowIds)
      if (
        nextSelectedComponentIds.length === session.selectedComponentIds.length &&
        nextSelectedComponentIds.every((rowId, index) => rowId === session.selectedComponentIds[index])
      ) {
        return state
      }
      return {
        geometrySketchSession: {
          ...session,
          selectedComponentIds: nextSelectedComponentIds,
          selectionWindowDraft: null,
        },
      }
    })
  },
  setGeometrySketchSelectionWindowDraft: (draft) => {
    set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== null ||
        session.drawStage !== 'sessionIdle'
      ) {
        return state
      }
      const nextDraft =
        draft === null
          ? null
          : {
              anchor: normalizeGeometrySketchDraftPoint(draft.anchor),
              current: normalizeGeometrySketchDraftPoint(draft.current),
              mode: draft.mode,
            }
      const currentDraft = session.selectionWindowDraft
      if (
        (currentDraft === null && nextDraft === null) ||
        (currentDraft !== null &&
          nextDraft !== null &&
          currentDraft.mode === nextDraft.mode &&
          areGeometrySketchDraftPointsEqual(currentDraft.anchor, nextDraft.anchor) &&
          areGeometrySketchDraftPointsEqual(currentDraft.current, nextDraft.current))
      ) {
        return state
      }
      return {
        geometrySketchSession: {
          ...session,
          selectionWindowDraft: nextDraft,
          hoveredComponentId: nextDraft === null ? session.hoveredComponentId : null,
        },
      }
    })
  },
  undoGeometrySketchDrawDraftPoint: () => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.drawDraft === null ||
        !isGeometrySketchDrawTool(session.activeTool) ||
        session.drawDraft.points.length === 0
      ) {
        return state
      }

      const nextDraft = {
        ...session.drawDraft,
        points: session.drawDraft.points.slice(0, -1),
      }
      nextPromptRef.current = {
        tool: session.activeTool,
        draft: nextDraft,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        geometrySketchSession: {
          ...session,
          drawStage: resolveGeometrySketchDrawStage(session.mode, session.activeTool, nextDraft),
          drawDraft: nextDraft,
        },
      }
    })
    if (nextPromptRef.current !== null) {
      appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },
  confirmGeometrySketchDrawPoint: (point, snapTarget) => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.drawDraft === null ||
        !isGeometrySketchDrawTool(session.activeTool)
      ) {
        return state
      }

      const nextPoint = normalizeGeometrySketchDraftPoint(point)
      if (
        session.activeTool === 'line' ||
        session.activeTool === 'rectangle' ||
        session.activeTool === 'circle'
      ) {
        const startPoint = session.drawDraft.points[0] ?? null
        if (startPoint === null) {
          const nextDraft = {
            points: [nextPoint],
            hoverPoint: session.activeTool === 'circle' ? null : nextPoint,
            hoverSnapTarget: session.activeTool === 'circle' ? null : snapTarget,
          }
          nextPromptRef.current = {
            tool: session.activeTool,
            draft: nextDraft,
            lastUsedTool: session.lastUsedTool,
          }
          return {
            geometrySketchSession: {
              ...session,
              drawStage: resolveGeometrySketchDrawStage(session.mode, session.activeTool, nextDraft),
              drawDraft: nextDraft,
            },
          }
        }
        if (areGeometrySketchDraftPointsEqual(startPoint, nextPoint)) {
          return state
        }
        const nextGraph = updateGeometrySketchNode(state.graph, session.nodeId, (feature) =>
          recomputeSketchFeature({
            ...feature,
            components: [
              ...feature.components,
              session.activeTool === 'line'
                ? buildGeometrySketchLineComponent(startPoint, nextPoint)
                : session.activeTool === 'circle'
                  ? buildGeometrySketchCircleComponent(startPoint, nextPoint)
                : buildGeometrySketchRectangleComponent(startPoint, nextPoint),
            ],
          }),
        )
        if (nextGraph === state.graph) {
          return state
        }
        nextPromptRef.current = {
          tool: null,
          draft: null,
          lastUsedTool: session.lastUsedTool,
        }
        return {
          ...withUpdatedActiveGraphDocumentState(state, nextGraph),
          geometrySketchSession: {
            ...session,
            activeTool: null,
            drawStage: resolveGeometrySketchDrawStage(session.mode, null, null),
            drawDraft: null,
            selectedComponentIds: [],
            hoveredComponentId: null,
            selectionWindowDraft: null,
          },
        }
      }

      const previousPoint = session.drawDraft.points[session.drawDraft.points.length - 1] ?? null
      if (previousPoint !== null && areGeometrySketchDraftPointsEqual(previousPoint, nextPoint)) {
        return state
      }
      const nextDraft = {
        points: [...session.drawDraft.points, nextPoint],
        hoverPoint: nextPoint,
        hoverSnapTarget: snapTarget,
      }
      nextPromptRef.current = {
        tool: session.activeTool,
        draft: nextDraft,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        geometrySketchSession: {
          ...session,
          drawStage: resolveGeometrySketchDrawStage(session.mode, session.activeTool, nextDraft),
          drawDraft: nextDraft,
        },
      }
    })
    if (nextPromptRef.current !== null) {
      appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },
  confirmGeometrySketchDrawRadius: (radius) => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== 'circle' ||
        session.drawDraft === null
      ) {
        return state
      }

      const center = session.drawDraft.points[0] ?? null
      if (center === null || !Number.isFinite(radius) || radius <= 0) {
        return state
      }

      const edge = buildGeometrySketchCircleEdgeFromRadius(center, radius)
      if (areGeometrySketchDraftPointsEqual(center, edge)) {
        return state
      }

      const nextGraph = updateGeometrySketchNode(state.graph, session.nodeId, (feature) =>
        recomputeSketchFeature({
          ...feature,
          components: [...feature.components, buildGeometrySketchCircleComponent(center, edge)],
        }),
      )
      if (nextGraph === state.graph) {
        return state
      }
      nextPromptRef.current = {
        tool: null,
        draft: null,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        geometrySketchSession: {
          ...session,
          activeTool: null,
          drawStage: resolveGeometrySketchDrawStage(session.mode, null, null),
          drawDraft: null,
          selectedComponentIds: [],
          hoveredComponentId: null,
          selectionWindowDraft: null,
        },
      }
    })
    if (nextPromptRef.current !== null) {
      appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },
  finishGeometrySketchDrawDraft: () => {
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.drawDraft === null ||
        !isGeometrySketchDrawTool(session.activeTool)
      ) {
        return state
      }

      if (
        session.activeTool === 'line' ||
        session.activeTool === 'rectangle' ||
        session.activeTool === 'circle'
      ) {
        const startPoint = session.drawDraft.points[0] ?? null
        const hoverPoint = session.drawDraft.hoverPoint
        if (
          startPoint === null ||
          hoverPoint === null ||
          areGeometrySketchDraftPointsEqual(startPoint, hoverPoint)
        ) {
          return state
        }
        const nextGraph = updateGeometrySketchNode(state.graph, session.nodeId, (feature) =>
          recomputeSketchFeature({
            ...feature,
            components: [
              ...feature.components,
              session.activeTool === 'line'
                ? buildGeometrySketchLineComponent(startPoint, hoverPoint)
                : session.activeTool === 'circle'
                  ? buildGeometrySketchCircleComponent(startPoint, hoverPoint)
                : buildGeometrySketchRectangleComponent(startPoint, hoverPoint),
            ],
          }),
        )
        if (nextGraph === state.graph) {
          return state
        }
        nextPromptRef.current = {
          tool: null,
          draft: null,
          lastUsedTool: session.lastUsedTool,
        }
        return {
          ...withUpdatedActiveGraphDocumentState(state, nextGraph),
          geometrySketchSession: {
            ...session,
            activeTool: null,
            drawStage: resolveGeometrySketchDrawStage(session.mode, null, null),
            drawDraft: null,
            selectedComponentIds: [],
            hoveredComponentId: null,
            selectionWindowDraft: null,
          },
        }
      }

      if (session.drawDraft.points.length < 2) {
        return state
      }

      const drawGroupId = `pline:${makeComponentId()}`
      const nextComponents = session.drawDraft.points
        .slice(1)
        .map((point, index) =>
          buildGeometrySketchLineComponent(session.drawDraft!.points[index], point, {
            drawGroupId,
          }),
        )
      const nextGraph = updateGeometrySketchNode(state.graph, session.nodeId, (feature) =>
        recomputeSketchFeature({
          ...feature,
          components: [...feature.components, ...nextComponents],
        }),
      )
      if (nextGraph === state.graph) {
        return state
      }
      nextPromptRef.current = {
        tool: null,
        draft: null,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        geometrySketchSession: {
          ...session,
          activeTool: null,
          drawStage: resolveGeometrySketchDrawStage(session.mode, null, null),
          drawDraft: null,
          selectedComponentIds: [],
          hoveredComponentId: null,
          selectionWindowDraft: null,
        },
      }
    })
    if (nextPromptRef.current !== null) {
      appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },
  cancelGeometrySketchDrawDraft: () => {
    const currentSession = get().geometrySketchSession
    if (currentSession === null || currentSession.mode !== 'draw') {
      return
    }
    if (currentSession.activeTool === null) {
      return
    }
    const nextPromptRef: { current: GeometrySketchConsolePrompt | null } = { current: null }
    set((state) => {
      const session = state.geometrySketchSession
      if (session === null) {
        return state
      }
      nextPromptRef.current = {
        tool: null,
        draft: null,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        geometrySketchSession: {
          ...session,
          activeTool: null,
          drawStage: resolveGeometrySketchDrawStage(session.mode, null, null),
          drawDraft: null,
          hoveredComponentId: null,
          selectionWindowDraft: null,
        },
      }
    })
    if (nextPromptRef.current !== null) {
      appendGeometrySketchConsolePrompt(
        nextPromptRef.current.tool,
        nextPromptRef.current.draft,
        nextPromptRef.current.lastUsedTool,
      )
    }
  },
  deleteGeometrySketchSelectedComponents: () => {
    set((state) => {
      const session = state.geometrySketchSession
      if (
        session === null ||
        session.mode !== 'draw' ||
        session.activeTool !== null ||
        session.drawStage !== 'sessionIdle' ||
        session.selectedComponentIds.length === 0
      ) {
        return state
      }
      const selectedIds = new Set(session.selectedComponentIds)
      const nextGraph = updateGeometrySketchNode(state.graph, session.nodeId, (feature) => {
        const nextComponents = feature.components.filter(
          (component) => !selectedIds.has(component.rowId),
        )
        if (nextComponents.length === feature.components.length) {
          return feature
        }
        return recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        geometrySketchSession: {
          ...session,
          selectedComponentIds: [],
          hoveredComponentId: null,
          selectionWindowDraft: null,
        },
      }
    })
  },
  appendGeometrySketchComponent: (nodeId, component) => {
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) =>
        recomputeSketchFeature({
          ...feature,
          components: [...feature.components, component],
        }),
      )
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        geometrySketchSession: pruneGeometrySketchSession(nextGraph, state.geometrySketchSession),
      }
    })
  },
  updateGeometrySketchComponentPoint: (nodeId, rowId, pointKey, value) => {
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const components = feature.components.map((component) => {
          if (component.rowId !== rowId || !(pointKey in component)) {
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
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setGeometrySketchComponentName: (nodeId, rowId, name) => {
    set((state) => {
      const normalizedName = normalizeSketchComponentName(name)
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        let didChange = false
        const nextComponents = feature.components.map((component) => {
          if (component.rowId !== rowId) {
            return component
          }
          if (component.name === normalizedName) {
            return component
          }
          didChange = true
          if (normalizedName === undefined) {
            const { name: _name, ...rest } = component
            return rest as SketchComponent
          }
          return {
            ...component,
            name: normalizedName,
          }
        })
        if (!didChange) {
          return feature
        }
        return recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setGeometrySketchDrawGroupName: (nodeId, drawGroupId, name) => {
    set((state) => {
      const normalizedName = normalizeSketchComponentName(name)
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        let didChange = false
        const nextComponents = feature.components.map((component) => {
          if (component.type !== 'line' || component.drawGroupId !== drawGroupId) {
            return component
          }
          if (component.drawGroupName === normalizedName) {
            return component
          }
          didChange = true
          if (normalizedName === undefined) {
            const { drawGroupName: _drawGroupName, ...rest } = component
            return rest as SketchComponent
          }
          return {
            ...component,
            drawGroupName: normalizedName,
          }
        })
        if (!didChange) {
          return feature
        }
        return recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  moveGeometrySketchComponentUp: (nodeId, rowId) => {
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const index = feature.components.findIndex((component) => component.rowId === rowId)
        if (index <= 0) {
          return feature
        }
        const nextComponents = feature.components.slice()
        const temp = nextComponents[index - 1]
        nextComponents[index - 1] = nextComponents[index]
        nextComponents[index] = temp
        return recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  moveGeometrySketchComponentDown: (nodeId, rowId) => {
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const index = feature.components.findIndex((component) => component.rowId === rowId)
        if (index < 0 || index >= feature.components.length - 1) {
          return feature
        }
        const nextComponents = feature.components.slice()
        const temp = nextComponents[index + 1]
        nextComponents[index + 1] = nextComponents[index]
        nextComponents[index] = temp
        return recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  removeGeometrySketchComponent: (nodeId, rowId) => {
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const nextComponents = feature.components.filter((component) => component.rowId !== rowId)
        if (nextComponents.length === feature.components.length) {
          return feature
        }
        return recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
  setGeometrySketchSelectedProfile: (nodeId, profileId) => {
    set((state) => {
      const nextGraph = updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const nextSelectedProfileId =
          profileId === null || profileId.length === 0 ? undefined : profileId
        const nextFeature = recomputeSketchFeature({
          ...feature,
          uiState: {
            ...feature.uiState,
            ...(nextSelectedProfileId === undefined
              ? {}
              : { selectedProfileId: nextSelectedProfileId }),
          },
        })
        if (nextSelectedProfileId === undefined && nextFeature.uiState.selectedProfileId !== undefined) {
          return {
            ...nextFeature,
            uiState: {
              collapsed: nextFeature.uiState.collapsed,
            },
          }
        }
        return nextFeature
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
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
              pendingTargetBuildUnitIds: [...(options.pendingTargetBuildUnitIds ?? [])],
              pendingAffectedBuildUnitIds: [...(options.pendingAffectedBuildUnitIds ?? [])],
              currentGraphRevision: runtime.compileBuild.currentGraphRevision,
              lastBuildSeq: options.buildSeq,
              latestIssuedGraphRevision: runtime.compileBuild.currentGraphRevision,
              latestIssuedBuildSeq: options.buildSeq,
              latestAcceptedGraphRevision: runtime.compileBuild.latestAcceptedGraphRevision,
              latestAcceptedBuildSeq: runtime.compileBuild.latestAcceptedBuildSeq,
              latestAcceptedBuildUnitIds: [...runtime.compileBuild.latestAcceptedBuildUnitIds],
              inFlightGraphRevision: runtime.compileBuild.currentGraphRevision,
              inFlightBuildRequestId: options.buildRequestId,
              inFlightBuildSeq: options.buildSeq,
              inFlightExecutionIntent:
                options.executionIntent === undefined ? null : { ...options.executionIntent },
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
    const authoritativeHandleIdsToRelease: string[] = []
    const incomingAuthoritativeHandleId = getGeometryResultAuthoritativeHandleId(
      routingIdentity.authoritativeGeometryResult,
    )
    set((state) => {
      const trackedGraphDocumentId = state.graphDocumentIdByBuildSeq[routingIdentity.buildSeq]
      if (trackedGraphDocumentId !== routingIdentity.graphDocumentId) {
        if (incomingAuthoritativeHandleId !== null) {
          authoritativeHandleIdsToRelease.push(incomingAuthoritativeHandleId)
        }
        return state
      }
      const runtime = state.graphRuntimeByDocumentId[routingIdentity.graphDocumentId]
      if (runtime === undefined) {
        if (incomingAuthoritativeHandleId !== null) {
          authoritativeHandleIdsToRelease.push(incomingAuthoritativeHandleId)
        }
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
        if (incomingAuthoritativeHandleId !== null) {
          authoritativeHandleIdsToRelease.push(incomingAuthoritativeHandleId)
        }
        return state
      }

      const nextGraphDocumentIdByBuildSeq = { ...state.graphDocumentIdByBuildSeq }
      delete nextGraphDocumentIdByBuildSeq[routingIdentity.buildSeq]
      accepted = true
      const nextBundle =
        routingIdentity.bundle ??
        ({
          buildRequestId: routingIdentity.buildRequestId,
          graphDocumentId: routingIdentity.graphDocumentId,
          seq: routingIdentity.buildSeq,
          resultClass: 'final',
          executionIntent: { ...DEFAULT_BUILD_EXECUTION_INTENT },
          summary: {
            rebuiltCount: 0,
            retainedCount: 0,
            evictedCount: 0,
          },
          entries: [],
        } satisfies BuildResultBundle)
      const acceptedBuildBundle = finalizeAcceptedBuildBundle({
        previousBundle: runtime.acceptedBuildBundle,
        nextBundle,
        targetBuildUnitIds: compileBuild.pendingTargetBuildUnitIds,
      })
      const acceptedPreviewBuildBundle = acceptedBuildBundle
      const previousAcceptedAuthoritativeGeometryResult =
        runtime.acceptedAuthoritativeGeometryResult
      const previousAcceptedDraftGeometryResult = runtime.acceptedDraftGeometryResult
      const acceptedGeometryPromotion = resolveAcceptedGeometryPromotion({
        previousAcceptedDraftGeometryResult,
        previousAcceptedAuthoritativeGeometryResult,
        incomingDraftGeometryResult: routingIdentity.draftGeometryResult,
        incomingAuthoritativeGeometryResult: routingIdentity.authoritativeGeometryResult,
      })
      authoritativeHandleIdsToRelease.push(
        ...acceptedGeometryPromotion.authoritativeHandleIdsToRelease,
      )
      const acceptedBuildOutputs = bundleToAcceptedBuildOutputs(acceptedBuildBundle)
      const acceptedPreviewBuildOutputs = bundleToAcceptedBuildOutputs(acceptedPreviewBuildBundle)
      const acceptedBuildImpact = buildAcceptedBuildImpactSnapshot({
        acceptedBuildBundle,
        changedParamIds: compileBuild.pendingChangedParamIds,
        affectedBuildUnitIds: compileBuild.pendingAffectedBuildUnitIds,
        targetBuildUnitIds: compileBuild.pendingTargetBuildUnitIds,
      })

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
              latestAcceptedBuildUnitIds: [...compileBuild.pendingTargetBuildUnitIds],
              pendingTargetBuildUnitIds: [],
              pendingAffectedBuildUnitIds: [],
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
              inFlightExecutionIntent: null,
            },
            acceptedBuildBundle,
            acceptedPreviewBuildBundle,
            acceptedAuthoritativeGraphRevision:
              routingIdentity.authoritativeGeometryResult === undefined
                ? runtime.acceptedAuthoritativeGraphRevision
                : compileBuild.inFlightGraphRevision,
            acceptedDraftGraphRevision:
              routingIdentity.draftGeometryResult === undefined
                ? runtime.acceptedDraftGraphRevision
                : compileBuild.inFlightGraphRevision,
            acceptedAuthoritativeGeometryResult:
              acceptedGeometryPromotion.acceptedAuthoritativeGeometryResult,
            acceptedDraftGeometryResult: acceptedGeometryPromotion.acceptedDraftGeometryResult,
            acceptedBuildOutputs,
            acceptedPreviewBuildOutputs,
            acceptedBuildImpact,
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: routingIdentity.graphDocumentId,
              previewPreparation: runtime.previewPreparation,
              acceptedBundle: acceptedBuildBundle,
              publishedAtBuildSeq: routingIdentity.buildSeq,
            }),
          },
        },
        graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
      }
    })
    releaseAuthoritativeHandleIds(authoritativeHandleIdsToRelease)
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
              pendingTargetBuildUnitIds: [],
              pendingAffectedBuildUnitIds: [],
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
              inFlightExecutionIntent: null,
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
    const previousAuthoritativeHandleId = getGeometryResultAuthoritativeHandleId(
      get().graphRuntimeByDocumentId[graphDocumentId]?.acceptedAuthoritativeGeometryResult,
    )

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
    releaseAuthoritativeHandleIds([previousAuthoritativeHandleId])

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
        editorViewportSelectedNodeIdById: {
          ...current.editorViewportSelectedNodeIdById,
          [nextViewportState.editorViewportId]:
            current.editorViewportSelectedNodeIdById[nextViewportState.editorViewportId] ?? null,
        },
        editorViewportSelectedEdgeIdById: {
          ...current.editorViewportSelectedEdgeIdById,
          [nextViewportState.editorViewportId]:
            current.editorViewportSelectedEdgeIdById[nextViewportState.editorViewportId] ?? null,
        },
        editorViewportConsolePreviewNodeIdById: {
          ...current.editorViewportConsolePreviewNodeIdById,
          [nextViewportState.editorViewportId]:
            current.editorViewportConsolePreviewNodeIdById[nextViewportState.editorViewportId] ??
            null,
        },
      })
    })
    const nextViewport = nextViewportState.editorViewportsById[nextViewportState.editorViewportId]
    if (nextViewport !== undefined) {
      const workspaceState = useWorkspaceStore.getState()
      workspaceState.setEditorSurfacePlacement(
        nextViewport.editorViewportId,
        createEditorWorkspaceSurfaceStateFromViewport(nextViewport),
      )
      workspaceState.setEditorSurfaceBinding(
        nextViewport.editorViewportId,
        nextViewport.graphDocumentId,
      )
    }
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
        editorViewportSelectedNodeIdById: {
          ...current.editorViewportSelectedNodeIdById,
          [nextViewportState.editorViewportId]:
            current.editorViewportSelectedNodeIdById[nextViewportState.editorViewportId] ?? null,
        },
        editorViewportSelectedEdgeIdById: {
          ...current.editorViewportSelectedEdgeIdById,
          [nextViewportState.editorViewportId]:
            current.editorViewportSelectedEdgeIdById[nextViewportState.editorViewportId] ?? null,
        },
        editorViewportConsolePreviewNodeIdById: {
          ...current.editorViewportConsolePreviewNodeIdById,
          [nextViewportState.editorViewportId]:
            current.editorViewportConsolePreviewNodeIdById[nextViewportState.editorViewportId] ??
            null,
        },
      }),
    )
    const nextViewport = nextViewportState.editorViewportsById[nextViewportState.editorViewportId]
    if (nextViewport !== undefined) {
      const workspaceState = useWorkspaceStore.getState()
      workspaceState.setEditorSurfacePlacement(
        nextViewport.editorViewportId,
        createEditorWorkspaceSurfaceStateFromViewport(nextViewport),
      )
      workspaceState.setEditorSurfaceBinding(
        nextViewport.editorViewportId,
        nextViewport.graphDocumentId,
      )
    }
    return nextViewportState.editorViewportId
  },
  bindEditorViewportToGraphDocument: (editorViewportId, graphDocumentId) => {
    let nextGraphDocumentId: string | null = null
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
      nextGraphDocumentId = graphDocumentId
      return withBrowserViewportState(state, {
        editorViewportsById: nextViewportsById,
        activeEditorViewportId: editorViewportId,
        editorViewportSelectedNodeIdById: {
          ...state.editorViewportSelectedNodeIdById,
          [editorViewportId]: null,
        },
        editorViewportSelectedEdgeIdById: {
          ...state.editorViewportSelectedEdgeIdById,
          [editorViewportId]: null,
        },
        editorViewportConsolePreviewNodeIdById: {
          ...state.editorViewportConsolePreviewNodeIdById,
          [editorViewportId]: null,
        },
      })
    })
    if (nextGraphDocumentId !== null) {
      useWorkspaceStore.getState().setEditorSurfaceBinding(editorViewportId, nextGraphDocumentId)
    }
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
    useWorkspaceStore.getState().removeEditorSurfacePlacement(editorViewportId)
    useWorkspaceStore.getState().removeEditorSurfaceBinding(editorViewportId)
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
        editorViewportSelectedNodeIdById: {
          ...state.editorViewportSelectedNodeIdById,
          [editorViewportId]: state.editorViewportSelectedNodeIdById[editorViewportId] ?? null,
        },
        editorViewportSelectedEdgeIdById: {
          ...state.editorViewportSelectedEdgeIdById,
          [editorViewportId]: state.editorViewportSelectedEdgeIdById[editorViewportId] ?? null,
        },
        editorViewportConsolePreviewNodeIdById: {
          ...state.editorViewportConsolePreviewNodeIdById,
          [editorViewportId]:
            state.editorViewportConsolePreviewNodeIdById[editorViewportId] ?? null,
        },
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
    let nextPlacementsByViewportId: Record<string, EditorWorkspaceSurfaceState> | null = null
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      const currentSurface = viewport === undefined ? null : readEditorWorkspaceSurfaceState(viewport)
      if (viewport === undefined || currentSurface === null) {
        return state
      }

      const isSurfaceAlreadyInRequestedMode = currentSurface.windowMode === windowMode
      const isViewportAlreadyInRequestedMode = viewport.windowMode === windowMode
      if (
        isSurfaceAlreadyInRequestedMode &&
        isViewportAlreadyInRequestedMode &&
        currentSurface.windowMode !== 'collapsed' &&
        currentSurface.windowMode !== 'maximized' &&
        currentSurface.windowMode !== 'split view' &&
        currentSurface.windowMode !== 'separateWindow'
      ) {
        return state
      }

      const resolveRestoreFromCollapsed = (): EditorWorkspaceSurfaceState => {
        const restore = currentSurface.restoreFromCollapsed ?? null
        if (restore === null) {
          return {
            ...currentSurface,
            windowMode: 'expanded',
            position: defaultViewportPosition,
            size: defaultViewportSize,
            presentationMode: 'windowed',
            restoreFromCollapsed: null,
          }
        }
        return {
          ...currentSurface,
          windowMode: restore.windowMode,
          position: restore.position ?? currentSurface.position,
          size: restore.size ?? currentSurface.size,
          splitRatio: restore.splitRatio ?? currentSurface.splitRatio,
          presentationMode: resolveWorkspacePresentationMode(restore.windowMode),
          restoreFromCollapsed: null,
        }
      }

      const resolveRestoreFromSplit = (): EditorWorkspaceSurfaceState => {
        const restore = currentSurface.restoreFromSplit ?? null
        if (restore === null) {
          return {
            ...currentSurface,
            windowMode: 'expanded',
            position: defaultViewportPosition,
            size: defaultViewportSize,
            presentationMode: 'windowed',
            restoreFromSplit: null,
          }
        }
        return {
          ...currentSurface,
          windowMode: restore.windowMode,
          position: restore.position ?? currentSurface.position,
          size: restore.size ?? currentSurface.size,
          presentationMode: resolveWorkspacePresentationMode(restore.windowMode),
          restoreFromSplit: null,
        }
      }

      const resolveRestoreFromSeparateWindow = (): EditorWorkspaceSurfaceState => {
        const restore = currentSurface.restoreFromSeparateWindow ?? null
        const popoutState = currentSurface.popoutState ?? createDefaultEditorPopoutState(editorViewportId)
        if (restore === null) {
          return {
            ...currentSurface,
            windowMode: 'expanded',
            position: defaultViewportPosition,
            size: defaultViewportSize,
            presentationMode: 'windowed',
            popoutState: {
              ...popoutState,
              owner: 'main-app',
            },
            restoreFromSeparateWindow: null,
          }
        }
        return {
          ...currentSurface,
          windowMode: restore.windowMode,
          position: restore.position ?? currentSurface.position,
          size: restore.size ?? currentSurface.size,
          splitRatio: restore.splitRatio ?? currentSurface.splitRatio,
          splitDirection: restore.splitDirection ?? currentSurface.splitDirection,
          splitDockSide: restore.splitDockSide ?? currentSurface.splitDockSide,
          splitPriority: restore.splitPriority ?? currentSurface.splitPriority,
          presentationMode: resolveWorkspacePresentationMode(restore.windowMode),
          popoutState: {
            ...popoutState,
            owner: 'main-app',
          },
          restoreFromSeparateWindow: null,
        }
      }

      let nextSurface: EditorWorkspaceSurfaceState

      if (windowMode === 'collapsed') {
        nextSurface =
          currentSurface.windowMode === 'collapsed'
            ? resolveRestoreFromCollapsed()
            : {
                ...currentSurface,
                windowMode: 'collapsed',
                presentationMode: 'windowed',
                restoreFromCollapsed: snapshotCollapsedRestoreState(viewport),
              }
      } else if (windowMode === 'maximized') {
        nextSurface =
          currentSurface.windowMode === 'maximized'
            ? {
                ...currentSurface,
                windowMode: 'expanded',
                position: defaultViewportPosition,
                size: defaultViewportSize,
                presentationMode: 'windowed',
                restoreFromCollapsed: null,
                restoreFromSplit: null,
              }
            : {
                ...currentSurface,
                windowMode: 'maximized',
                presentationMode: 'windowed',
                restoreFromCollapsed: null,
                restoreFromSplit: null,
              }
      } else if (windowMode === 'split view') {
        if (currentSurface.windowMode === 'split view') {
          nextSurface = resolveRestoreFromSplit()
        } else if (currentSurface.windowMode === 'collapsed') {
          nextSurface = {
            ...currentSurface,
            windowMode: 'split view',
            splitRatio: defaultViewportSplitRatio,
            presentationMode: 'tiled',
            restoreFromCollapsed: null,
            restoreFromSplit:
              currentSurface.restoreFromSplit ??
              (currentSurface.restoreFromCollapsed !== null &&
              currentSurface.restoreFromCollapsed.windowMode !== 'split view'
                ? {
                    windowMode: currentSurface.restoreFromCollapsed.windowMode,
                    position: currentSurface.restoreFromCollapsed.position,
                    size: currentSurface.restoreFromCollapsed.size,
                  }
                : snapshotExpandedRestoreState(viewport)),
          }
        } else {
          nextSurface = {
            ...currentSurface,
            windowMode: 'split view',
            splitRatio: defaultViewportSplitRatio,
            presentationMode: 'tiled',
            restoreFromCollapsed: null,
            restoreFromSplit:
              currentSurface.windowMode === 'maximized'
                ? {
                    windowMode: 'maximized',
                    position: currentSurface.position,
                    size: currentSurface.size,
                  }
                : snapshotExpandedRestoreState(viewport),
          }
        }
      } else if (windowMode === 'separateWindow') {
        nextSurface =
          isSurfaceAlreadyInRequestedMode && isViewportAlreadyInRequestedMode
            ? resolveRestoreFromSeparateWindow()
            : {
                ...currentSurface,
                windowMode: 'separateWindow',
                presentationMode: 'windowed',
                popoutState: {
                  ...(currentSurface.popoutState ?? createDefaultEditorPopoutState(editorViewportId)),
                  owner: 'child-window',
                },
                restoreFromSeparateWindow:
                  currentSurface.restoreFromSeparateWindow ?? snapshotSeparateWindowRestoreState(viewport),
              }
      } else if (windowMode === 'meatball editor view') {
        nextSurface = {
          ...currentSurface,
          windowMode: 'meatball editor view',
          presentationMode: 'windowed',
          restoreFromCollapsed: null,
          restoreFromSplit: null,
        }
      } else {
        nextSurface = {
          ...currentSurface,
          windowMode,
          presentationMode: resolveWorkspacePresentationMode(windowMode),
        }
      }

      if (nextSurface.windowMode !== 'separateWindow') {
        nextSurface = {
          ...nextSurface,
          popoutState: nextSurface.popoutState
            ? {
                ...nextSurface.popoutState,
                owner: 'main-app',
              }
            : createDefaultEditorPopoutState(editorViewportId),
          restoreFromSeparateWindow:
            windowMode === 'separateWindow' ? nextSurface.restoreFromSeparateWindow : null,
        }
      }

      nextSurface = {
        ...nextSurface,
        splitDirection: nextSurface.splitDirection ?? defaultWorkspaceSplitDirection,
        splitDockSide:
          nextSurface.splitDockSide ??
          resolveDefaultWorkspaceSplitDockSide(
            nextSurface.splitDirection ?? defaultWorkspaceSplitDirection,
          ),
        splitPriority: nextSurface.splitPriority ?? defaultWorkspaceSplitPriority,
      }

      const nextPlacements: Record<string, EditorWorkspaceSurfaceState> = {}
      const nextViewportsById: Record<string, EditorViewport> = {}
      for (const [currentViewportId, currentViewport] of Object.entries(state.editorViewportsById)) {
        if (
          currentViewportId !== editorViewportId &&
          nextSurface.windowMode === 'meatball editor view' &&
          readEditorWorkspaceSurfaceState(currentViewport).windowMode === 'meatball editor view'
        ) {
          const expandedSurface: EditorWorkspaceSurfaceState = {
            ...readEditorWorkspaceSurfaceState(currentViewport),
            windowMode: 'expanded',
            presentationMode: 'windowed',
            restoreFromCollapsed: null,
            restoreFromSplit: null,
          }
          nextPlacements[currentViewportId] = expandedSurface
          nextViewportsById[currentViewportId] = applyEditorWorkspaceSurfaceStateToViewport(
            currentViewport,
            expandedSurface,
          )
          continue
        }
        if (currentViewportId === editorViewportId) {
          nextPlacements[currentViewportId] = nextSurface
          nextViewportsById[currentViewportId] = applyEditorWorkspaceSurfaceStateToViewport(
            currentViewport,
            nextSurface,
          )
          continue
        }
        nextViewportsById[currentViewportId] = currentViewport
      }
      nextPlacementsByViewportId = nextPlacements
      return withBrowserViewportState(state, {
        editorViewportsById: nextViewportsById,
      })
    })
    if (nextPlacementsByViewportId !== null) {
      const workspaceState = useWorkspaceStore.getState()
      for (const [currentViewportId, placement] of Object.entries(
        nextPlacementsByViewportId as Record<string, EditorWorkspaceSurfaceState>,
      )) {
        workspaceState.setEditorSurfacePlacement(currentViewportId, placement)
      }
    }
  },
  restoreEditorViewportFromSeparateWindow: (editorViewportId) => {
    let nextPlacement: EditorWorkspaceSurfaceState | null = null
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      const currentSurface = readEditorWorkspaceSurfaceState(viewport)
      if (currentSurface.windowMode !== 'separateWindow') {
        return state
      }
      const restore = currentSurface.restoreFromSeparateWindow ?? null
      const popoutState = currentSurface.popoutState ?? createDefaultEditorPopoutState(editorViewportId)
      nextPlacement =
        restore === null
          ? {
              ...currentSurface,
              windowMode: 'expanded',
              position: defaultViewportPosition,
              size: defaultViewportSize,
              presentationMode: 'windowed',
              popoutState: {
                ...popoutState,
                owner: 'main-app',
              },
              restoreFromSeparateWindow: null,
            }
          : {
              ...currentSurface,
              windowMode: restore.windowMode,
              position: restore.position ?? currentSurface.position,
              size: restore.size ?? currentSurface.size,
              splitRatio: restore.splitRatio ?? currentSurface.splitRatio,
              splitDirection: restore.splitDirection ?? currentSurface.splitDirection,
              splitDockSide: restore.splitDockSide ?? currentSurface.splitDockSide,
              splitPriority: restore.splitPriority ?? currentSurface.splitPriority,
              presentationMode: resolveWorkspacePresentationMode(restore.windowMode),
              popoutState: {
                ...popoutState,
                owner: 'main-app',
              },
              restoreFromSeparateWindow: null,
            }
      return withBrowserViewportState(state, {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: applyEditorWorkspaceSurfaceStateToViewport(viewport, nextPlacement),
        },
      })
    })
    if (nextPlacement !== null) {
      useWorkspaceStore.getState().setEditorSurfacePlacement(editorViewportId, nextPlacement)
    }
  },
  setEditorViewportHeaderCollapsed: (editorViewportId, collapsed) => {
    set((state) => {
      if (state.editorViewportsById[editorViewportId] === undefined) {
        return state
      }
      return {
        editorViewportHeaderCollapsedById: {
          ...state.editorViewportHeaderCollapsedById,
          [editorViewportId]: collapsed,
        },
      }
    })
  },
  setEditorViewportCanvasToolbarVisible: (editorViewportId, visible) => {
    set((state) => {
      if (state.editorViewportsById[editorViewportId] === undefined) {
        return state
      }
      return {
        editorViewportCanvasToolbarVisibleById: {
          ...state.editorViewportCanvasToolbarVisibleById,
          [editorViewportId]: visible,
        },
      }
    })
  },
  setEditorViewportPresentationMode: (editorViewportId, mode) => {
    const state = get()
    const viewport = state.editorViewportsById[editorViewportId]
    if (viewport === undefined) {
      return
    }

    if (mode === 'collapsed') {
      if (viewport.windowMode !== 'collapsed') {
        get().setEditorViewportWindowMode(editorViewportId, 'collapsed')
      }
      get().setEditorViewportHeaderCollapsed(editorViewportId, false)
      get().setEditorViewportCanvasToolbarVisible(editorViewportId, true)
      return
    }

    if (mode === 'essentials') {
      if (viewport.windowMode !== 'maximized') {
        get().setEditorViewportWindowMode(editorViewportId, 'maximized')
      }
      get().setEditorViewportHeaderCollapsed(editorViewportId, true)
      get().setEditorViewportCanvasToolbarVisible(editorViewportId, false)
      return
    }
    if (viewport.windowMode !== 'expanded') {
      get().setEditorViewportWindowMode(editorViewportId, 'expanded')
    }
    get().setEditorViewportHeaderCollapsed(editorViewportId, false)
    get().setEditorViewportCanvasToolbarVisible(editorViewportId, true)
  },
  setEditorViewportSplitRatio: (editorViewportId, splitRatio) => {
    let nextPlacement: EditorWorkspaceSurfaceState | null = null
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      const nextSplitRatio = clampViewportSplitRatio(splitRatio)
      const currentSurface = readEditorWorkspaceSurfaceState(viewport)
      if (currentSurface.splitRatio === nextSplitRatio) {
        return state
      }
      nextPlacement = {
        ...currentSurface,
        splitRatio: nextSplitRatio,
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: applyEditorWorkspaceSurfaceStateToViewport(viewport, nextPlacement),
        },
      }
    })
    if (nextPlacement !== null) {
      useWorkspaceStore.getState().setEditorSurfacePlacement(editorViewportId, nextPlacement)
    }
  },
  setEditorViewportSplitDirection: (editorViewportId, splitDirection) => {
    let nextPlacement: EditorWorkspaceSurfaceState | null = null
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      const currentSurface = readEditorWorkspaceSurfaceState(viewport)
      const currentSplitDirection = currentSurface.splitDirection ?? defaultWorkspaceSplitDirection
      if (currentSplitDirection === splitDirection) {
        return state
      }
      nextPlacement = {
        ...currentSurface,
        splitDirection,
        splitDockSide:
          splitDirection === 'vertical'
            ? currentSurface.splitDockSide === 'left' || currentSurface.splitDockSide === 'right'
              ? currentSurface.splitDockSide
              : resolveDefaultWorkspaceSplitDockSide(splitDirection)
            : currentSurface.splitDockSide === 'top' || currentSurface.splitDockSide === 'bottom'
              ? currentSurface.splitDockSide
              : resolveDefaultWorkspaceSplitDockSide(splitDirection),
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: applyEditorWorkspaceSurfaceStateToViewport(viewport, nextPlacement),
        },
      }
    })
    if (nextPlacement !== null) {
      useWorkspaceStore.getState().setEditorSurfacePlacement(editorViewportId, nextPlacement)
    }
  },
  setEditorViewportSplitDockSide: (editorViewportId, splitDockSide) => {
    let nextPlacement: EditorWorkspaceSurfaceState | null = null
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      const currentSurface = readEditorWorkspaceSurfaceState(viewport)
      const nextSplitDirection = resolveWorkspaceSplitDirectionForDockSide(splitDockSide)
      const currentSplitDockSide =
        currentSurface.splitDockSide ??
        resolveDefaultWorkspaceSplitDockSide(currentSurface.splitDirection ?? defaultWorkspaceSplitDirection)
      if (
        currentSplitDockSide === splitDockSide &&
        currentSurface.splitDirection === nextSplitDirection
      ) {
        return state
      }
      nextPlacement = {
        ...currentSurface,
        splitDirection: nextSplitDirection,
        splitDockSide,
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: applyEditorWorkspaceSurfaceStateToViewport(viewport, nextPlacement),
        },
      }
    })
    if (nextPlacement !== null) {
      useWorkspaceStore.getState().setEditorSurfacePlacement(editorViewportId, nextPlacement)
    }
  },
  setEditorViewportSplitPriority: (editorViewportId, splitPriority) => {
    let nextPlacement: EditorWorkspaceSurfaceState | null = null
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      const currentSurface = readEditorWorkspaceSurfaceState(viewport)
      const currentSplitPriority = currentSurface.splitPriority ?? defaultWorkspaceSplitPriority
      if (currentSplitPriority === splitPriority) {
        return state
      }
      nextPlacement = {
        ...currentSurface,
        splitPriority,
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: applyEditorWorkspaceSurfaceStateToViewport(viewport, nextPlacement),
        },
      }
    })
    if (nextPlacement !== null) {
      useWorkspaceStore.getState().setEditorSurfacePlacement(editorViewportId, nextPlacement)
    }
  },
  setEditorViewportPosition: (editorViewportId, position) => {
    let nextPlacement: EditorWorkspaceSurfaceState | null = null
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      const currentSurface = readEditorWorkspaceSurfaceState(viewport)
      nextPlacement = {
        ...currentSurface,
        position: {
          x: Math.round(position.x),
          y: Math.round(position.y),
        },
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: applyEditorWorkspaceSurfaceStateToViewport(viewport, nextPlacement),
        },
      }
    })
    if (nextPlacement !== null) {
      useWorkspaceStore.getState().setEditorSurfacePlacement(editorViewportId, nextPlacement)
    }
  },
  setEditorViewportSize: (editorViewportId, size) => {
    let nextPlacement: EditorWorkspaceSurfaceState | null = null
    set((state) => {
      const viewport = state.editorViewportsById[editorViewportId]
      if (viewport === undefined) {
        return state
      }
      const currentSurface = readEditorWorkspaceSurfaceState(viewport)
      nextPlacement = {
        ...currentSurface,
        size: {
          width: Math.round(size.width),
          height: Math.round(size.height),
        },
      }
      return {
        editorViewportsById: {
          ...state.editorViewportsById,
          [editorViewportId]: applyEditorWorkspaceSurfaceStateToViewport(viewport, nextPlacement),
        },
      }
    })
    if (nextPlacement !== null) {
      useWorkspaceStore.getState().setEditorSurfacePlacement(editorViewportId, nextPlacement)
    }
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

for (const viewport of Object.values(useSpaghettiStore.getState().editorViewportsById)) {
  const workspaceState = useWorkspaceStore.getState()
  workspaceState.setEditorSurfacePlacement(
    viewport.editorViewportId,
    createEditorWorkspaceSurfaceStateFromViewport(viewport),
  )
  workspaceState.setEditorSurfaceBinding(viewport.editorViewportId, viewport.graphDocumentId)
}
