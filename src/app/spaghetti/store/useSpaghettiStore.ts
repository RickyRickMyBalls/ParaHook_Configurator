import { create } from 'zustand'
import { useUiPrefsStore } from '../../store/uiPrefsStore'
import {
  loadGraphDocumentFromFile as loadGraphDocumentFromFileCommand,
  saveGraphDocumentToFile as saveGraphDocumentToFileCommand,
} from '../../io/graphDocumentPersistence'
import type { GraphBrowserStorageWorkingSetSnapshot } from './graphBrowserStoragePersistence'
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
  addNode as addNodeCommand,
  addEdge as addEdgeCommand,
  connectEdgeWithAutoReplace,
  removeEdge as removeEdgeCommand,
  removeNode as removeNodeCommand,
  type GraphCommand,
} from '../graphCommands'
import {
  editHistoryStore,
} from '../../store/editHistoryStore'
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
import { getDefaultNodeParams, getNodeDef } from '../registry/nodeRegistry'
import { ensureOutputPreviewSingletonPatch } from '../families/OutputPreview/system/ensureOutputPreviewSingleton'
import { ensureOutputPreviewSlotsPatch } from '../families/OutputPreview/system/ensureOutputPreviewSlots'
import { getNextViewMode, type ViewMode } from '../canvas/rowViewMode'
import {
  buildSketchDrawSessionIdlePrompt,
  getPrimarySketchDrawConsoleToolLabel,
  isPrimarySketchDrawTool,
  type GeometrySketchDrawCommand,
  type PrimarySketchDrawTool,
} from '../sketchCommands/drawCommands'
import {
  DEFAULT_SPAGHETTI_NODE_WIDTH,
  MIN_SPAGHETTI_NODE_WIDTH,
} from '../schema/spaghettiTypes'
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
  BuildChangedInputHint,
  BuildExecutionIntent,
  BuildResultBundle,
  BuildRoutingIdentity,
  BuildUnitId,
  PartArtifact,
} from '../../../shared/buildTypes'
import {
  getGeometryResultAuthoritativeHandleId,
  type GeometryResultBundle,
} from '../../../shared/geometryResult'
import { buildDispatcher } from '../../buildDispatcher'
import { appendConsoleEntry } from '../../console/useConsoleStore'
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
import {
  buildFinalizedAcceptedResultArtifacts,
  cloneAcceptedBuildImpactSnapshot,
  cloneAcceptedGeometryLane,
  cloneBuildResultBundle,
  cloneStagedAuthoritativePreviewResult,
  resolveAcceptedGeometryPromotion,
  type GraphCompileBuildState,
  type GraphRuntimeState,
} from './graphRuntime/acceptedRuntime'
import {
  applyGeometrySketchSessionSnapshot,
  buildGeometrySketchCommittedSessionSnapshot,
  buildGeometrySketchLocalHistoryState,
  buildGeometrySketchSessionSnapshot,
  buildGeometrySketchSessionWithHistory,
  cloneGeometrySketchLocalHistoryState,
  cloneGeometrySketchSessionSnapshot,
  createGeometrySketchChildSummaries,
  findPreferredGeometrySketchHistoryCommandIndex,
  getGeometrySketchLocalHistoryTargetId,
  type GeometrySketchLocalHistoryState,
  type GeometrySketchSessionHistoryCommand,
  type GeometrySketchSessionSnapshot,
  type GeometrySketchStagedCommand,
  type GeometrySketchToolSelectionCommand,
  withGeometrySketchLocalHistoryState,
} from './history/geometrySketchHistory'
import {
  createGeometrySketchHistoryCommitAdapter,
} from './history/geometrySketchHistoryCommitAdapter'
import {
  createGraphNodeHistoryCommitAdapter,
  type CommitGraphNodeMoveHistoryOptions,
  type CommitGraphNodeParameterHistoryOptions,
} from './history/graphNodeHistoryCommitAdapter'
import {
  createPartFeatureHistoryCommitAdapter,
  type CommitPartFeatureParameterHistoryOptions,
  type CommitPartSketchFeatureHistoryOptions,
} from './history/partFeatureHistoryCommitAdapter'
import {
  buildSketchPlaneMovePrompt,
  buildSketchPlaneRotatePrompt,
  createSketchPlaneCommandSessionActions,
  SKETCH_PLANE_ROOT_PROMPT,
} from './sketch/sketchPlaneCommandSession'
import {
  createSketchPlanePickDraftTransformActions,
} from './sketch/sketchPlanePickDraftTransform'
import {
  createGeometrySketchPlaneGraphWriteActions,
} from './sketch/geometrySketchPlaneGraphWrite'
import {
  createGeometrySketchSessionLifecycleActions,
} from './sketch/geometrySketchSessionLifecycle'
import {
  createGeometrySketchDrawSessionControlActions,
} from './sketch/geometrySketchDrawSessionControl'
import {
  createGeometrySketchDrawDraftActions,
} from './sketch/geometrySketchDrawDraftActions'
import {
  createGeometrySketchSelectionActions,
} from './sketch/geometrySketchSelectionActions'
import {
  createGeometrySketchComponentEditActions,
} from './sketch/geometrySketchComponentEditActions'
import {
  selectActiveGraph,
  selectActiveGraphCompileResult,
  selectActiveGraphDocument,
  selectActiveGraphRuntime,
  selectCachedGraphEntryByDocumentId,
  selectCachedGraphEntryById,
  selectGraphBrowserStorageWorkingSetSnapshot,
  selectGraphByDocumentId,
  selectGraphCompileResultByDocumentId,
  selectGraphDocumentById,
  selectGraphReceiveReferencesByDocumentId,
  selectGraphRuntimeByDocumentId,
  selectOrderedCachedGraphEntries,
  selectOrderedGraphDocuments,
} from '../selectors/selectGraphDocumentRuntime'
export type {
  AcceptedBuildImpactEntry,
  AcceptedBuildImpactSnapshot,
  GraphCompileBuildState,
  GraphRuntimeState,
  StagedAuthoritativePreviewResult,
} from './graphRuntime/acceptedRuntime'

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
  width?: number
}

type EdgeWaypoint = {
  waypointId: string
  x: number
  y: number
  flipSide1: boolean
  flipSide2: boolean
}

type AddGraphNodeHistoryOptions = {
  node: SpaghettiNode
  position?: GraphNodePos
  nodeMode?: NodeRowMode
}

type ConnectGraphEdgeHistoryOptions = {
  edgeId: string
  from: EdgeEndpoint
  to: EdgeEndpoint
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

type CreateGraphNodeInDocumentOptions = {
  graphDocumentId: string
  nodeType: 'Geometry/Sketch' | 'Geometry/Extrude' | 'System/OutputPreview'
  labelPrefix: 'sketch' | 'extrude' | 'outputPreview'
}

export type CreateGraphNodeInDocumentResult = {
  nodeId: string
  nodeLabel: string
}

const cloneBuildChangedInputHint = (
  hint: BuildChangedInputHint | null | undefined,
): BuildChangedInputHint | null => {
  if (hint === undefined || hint === null) {
    return null
  }
  if (hint.kind === 'graph_local_extrude_params') {
    return {
      ...hint,
      changedFields: [...hint.changedFields],
    }
  }
  return {
    ...hint,
    changedPartKeys: [...hint.changedPartKeys],
    upstreamNodeIds: [...hint.upstreamNodeIds],
  }
}

let fallbackCreatedGraphNodeIdCounter = 0

const buildTentativeCreatedGraphNodeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `node-${crypto.randomUUID()}`
  }
  fallbackCreatedGraphNodeIdCounter += 1
  return `node-created-fallback-${fallbackCreatedGraphNodeIdCounter}`
}

const generateUniqueCreatedGraphNodeId = (graph: SpaghettiGraph): string => {
  const existing = new Set(graph.nodes.map((node) => node.nodeId))
  let candidate = buildTentativeCreatedGraphNodeId()
  let suffix = 2
  while (existing.has(candidate)) {
    candidate = `${buildTentativeCreatedGraphNodeId()}-${suffix}`
    suffix += 1
  }
  return candidate
}

const buildDefaultCreatedGraphNodePosition = (graph: SpaghettiGraph): GraphNodePos => {
  const positions = graph.nodes
    .map((node) => graph.ui?.nodes?.[node.nodeId] ?? node.ui ?? null)
    .filter((position): position is GraphNodePos => position !== null)
  if (positions.length === 0) {
    return { x: 160, y: 140 }
  }
  const maxX = Math.max(...positions.map((position) => position.x))
  const minY = Math.min(...positions.map((position) => position.y))
  return {
    x: Math.round(maxX + 240),
    y: Math.round(minY),
  }
}

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
  stagedBaselineParams: SpaghettiNode['params'] | null
  stagedBaselineHistory: GeometrySketchLocalHistoryState | null
  stagedUndoCommands: GeometrySketchStagedCommand[]
  stagedRedoCommands: GeometrySketchStagedCommand[]
  sessionUndoCommands: GeometrySketchSessionHistoryCommand[]
  sessionRedoCommands: GeometrySketchSessionHistoryCommand[]
}

export type GeometrySketchHistoryScrubState = {
  parentEntryId: string
  childId: string
  graphDocumentId: string
  nodeId: string
  childLabel: string
  childSequence: number
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
  editorViewportOverlayModeById: Record<string, boolean>
  editorViewportOverlayCanvasHiddenById: Record<string, boolean>
  editorViewportOverlayBackgroundOpacityById: Record<string, number>
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
  geometrySketchHistoryScrub: GeometrySketchHistoryScrubState | null
  geometrySketchLocalHistoryByTargetId: Record<string, GeometrySketchLocalHistoryState>
  uiMessage: CanvasUiMessage | null
  setGraph: (next: SpaghettiGraph) => void
  applyGraphCommand: (cmd: GraphCommand) => void
  applyGraphPatch: (patchFn: (prev: SpaghettiGraph) => SpaghettiGraph) => void
  setNodePos: (nodeId: string, x: number, y: number) => void
  setManyNodePos: (updates: NodePosUpdate[]) => void
  commitGraphNodeMoveWithHistory: (options: CommitGraphNodeMoveHistoryOptions) => boolean
  commitGraphNodeParameterWithHistory: (
    options: CommitGraphNodeParameterHistoryOptions,
  ) => boolean
  commitPartFeatureParameterWithHistory: (
    options: CommitPartFeatureParameterHistoryOptions,
  ) => boolean
  commitPartSketchFeatureWithHistory: (
    options: CommitPartSketchFeatureHistoryOptions,
  ) => boolean
  ensureNodePositions: () => void
  setNodeMode: (nodeId: string, mode: NodeRowMode) => void
  setNewNodeSpawnMode: (mode: NodeRowMode) => void
  cycleNewNodeSpawnMode: () => void
  addGraphNodeWithHistory: (options: AddGraphNodeHistoryOptions) => boolean
  removeGraphNodeWithHistory: (nodeId: string) => boolean
  connectGraphEdgeWithHistory: (options: ConnectGraphEdgeHistoryOptions) => boolean
  removeGraphEdgeWithHistory: (edgeId: string) => boolean
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
  openGeometrySketchHistoryScrub: (input: GeometrySketchHistoryScrubState) => boolean
  clearGeometrySketchHistoryScrub: () => void
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
  undoGeometrySketchStagedCommand: () => boolean
  redoGeometrySketchStagedCommand: () => boolean
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
      pendingChangedInputHint?: BuildChangedInputHint
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
  stageAuthoritativePreviewGraphBuildResult: (
    routingIdentity: BuildRoutingIdentity & {
      buildSeq: number
      bundle?: BuildResultBundle
      draftGeometryResult?: GeometryResultBundle
      authoritativeGeometryResult?: GeometryResultBundle
    },
  ) => boolean
  promoteStagedAuthoritativePreviewResult: (graphDocumentId: string) => boolean
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
  hydrateGraphBrowserStorageSnapshot: (
    snapshot: GraphBrowserStorageWorkingSetSnapshot,
  ) => boolean
  createGraphNodeInDocumentAndSelect: (
    options: CreateGraphNodeInDocumentOptions,
  ) => CreateGraphNodeInDocumentResult | null
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
    mode: 'collapsed' | 'essentials' | 'expanded' | 'overlay',
  ) => void
  setEditorViewportOverlayCanvasHidden: (editorViewportId: string, hidden: boolean) => void
  setEditorViewportOverlayBackgroundOpacity: (editorViewportId: string, opacity: number) => void
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
  | 'editorViewportOverlayModeById'
  | 'editorViewportOverlayCanvasHiddenById'
  | 'editorViewportOverlayBackgroundOpacityById'
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
const overlayBackgroundOpacityMin = 0
const overlayBackgroundOpacityMax = 1
const overlayBackgroundOpacityStep = 0.05

const normalizeOverlayBackgroundOpacity = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0
  }
  const clamped = Math.min(overlayBackgroundOpacityMax, Math.max(overlayBackgroundOpacityMin, value))
  const steps = Math.round((clamped - overlayBackgroundOpacityMin) / overlayBackgroundOpacityStep)
  return Number((overlayBackgroundOpacityMin + steps * overlayBackgroundOpacityStep).toFixed(4))
}

const compareNodes = (a: SpaghettiNode, b: SpaghettiNode): number =>
  a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isNodeRowMode = (value: unknown): value is NodeRowMode =>
  value === 'collapsed' || value === 'essentials' || value === 'expanded'

const roundPos = (value: number): number => Math.round(value)
const roundNodeWidth = (value: number): number => Math.round(value)
const normalizeNodeWidth = (value: unknown): number =>
  isFiniteNumber(value) && value > 0
    ? Math.max(MIN_SPAGHETTI_NODE_WIDTH, roundNodeWidth(value))
    : DEFAULT_SPAGHETTI_NODE_WIDTH

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
        width: normalizeNodeWidth(canonical.width),
      }
      return
    }

    if (node.ui !== undefined && isFiniteNumber(node.ui.x) && isFiniteNumber(node.ui.y)) {
      normalizedNodePos[node.nodeId] = {
        x: roundPos(node.ui.x),
        y: roundPos(node.ui.y),
        width: normalizeNodeWidth(node.ui.width),
      }
      return
    }

    normalizedNodePos[node.nodeId] = {
      ...defaultPosForIndex(index),
      width: DEFAULT_SPAGHETTI_NODE_WIDTH,
    }
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

const graphStructureHistorySource = {
  surface: 'spaghetti-graph',
  sourceId: 'graph-structure',
  sourceLabel: 'Graph Structure',
}

const graphNodeMoveHistorySource = {
  surface: 'spaghetti-graph',
  sourceId: 'graph-node-position',
  sourceLabel: 'Graph Node Position',
}

const graphNodeParameterHistorySource = {
  surface: 'spaghetti-graph',
  sourceId: 'graph-node-parameter',
  sourceLabel: 'Graph Node Parameter',
}

const graphFeatureStackHistorySource = {
  surface: 'spaghetti-graph',
  sourceId: 'graph-feature-stack',
  sourceLabel: 'Graph Feature Stack',
}

const graphFeatureParameterHistorySource = {
  surface: 'spaghetti-graph',
  sourceId: 'graph-feature-parameter',
  sourceLabel: 'Graph Feature Parameter',
}

const graphSketchFeatureHistorySource = {
  surface: 'spaghetti-graph',
  sourceId: 'graph-sketch-feature',
  sourceLabel: 'Graph Sketch Feature',
}

const geometrySketchDrawHistorySource = {
  surface: 'spaghetti-graph',
  sourceId: 'geometry-sketch-draw',
  sourceLabel: 'Sketch Draw',
}

let graphStructureHistoryEntryCounter = 0

const nextGraphStructureHistoryEntryId = (graphDocumentId: string): string => {
  graphStructureHistoryEntryCounter += 1
  return `graph-structure:${graphDocumentId}:${graphStructureHistoryEntryCounter}`
}

let geometrySketchStagedCommandCounter = 0

const nextGeometrySketchStagedCommandId = (nodeId: string): string => {
  geometrySketchStagedCommandCounter += 1
  return `geometry-sketch-staged:${nodeId}:${geometrySketchStagedCommandCounter}`
}

let geometrySketchToolSelectionCommandCounter = 0

const nextGeometrySketchToolSelectionCommandId = (tool: GeometrySketchTool): string => {
  geometrySketchToolSelectionCommandCounter += 1
  return `geometry-sketch-tool:${tool}:${geometrySketchToolSelectionCommandCounter}`
}

const getGeometrySketchToolSelectionHistoryLabel = (tool: GeometrySketchTool): string =>
  `Select sketch ${tool} tool`

const roundGraphNodePos = (pos: GraphNodePos): GraphNodePos => ({
  x: roundPos(pos.x),
  y: roundPos(pos.y),
  ...(typeof pos.width === 'number' && Number.isFinite(pos.width)
    ? { width: roundPos(pos.width) }
    : {}),
})

const areNormalizedGraphsEqual = (left: SpaghettiGraph, right: SpaghettiGraph): boolean =>
  JSON.stringify(left) === JSON.stringify(right)

const cloneNodeParams = (params: SpaghettiNode['params']): SpaghettiNode['params'] =>
  JSON.parse(JSON.stringify(params)) as SpaghettiNode['params']

const areNodeParamsEqual = (
  left: SpaghettiNode['params'],
  right: SpaghettiNode['params'],
): boolean => JSON.stringify(left) === JSON.stringify(right)

const cloneFeatureStack = (stack: FeatureStack): FeatureStack =>
  readFeatureStack(JSON.parse(JSON.stringify(stack)))

const areFeatureStacksEqual = (left: FeatureStack, right: FeatureStack): boolean =>
  JSON.stringify(left) === JSON.stringify(right)

const replaceGraphNodeParams = (
  graph: SpaghettiGraph,
  nodeId: string,
  params: SpaghettiNode['params'],
): SpaghettiGraph => {
  const canonical = normalizeGraphForStoreCommit(graph)
  let changed = false
  const nodes = canonical.nodes.map((node) => {
    if (node.nodeId !== nodeId) {
      return node
    }
    changed = true
    return {
      ...node,
      params: cloneNodeParams(params),
    }
  })
  return changed ? normalizeGraphForStoreCommit({ ...canonical, nodes }) : canonical
}

const readGeometrySketchNodeParams = (
  graph: SpaghettiGraph,
  nodeId: string,
): SpaghettiNode['params'] | null => {
  const node = graph.nodes.find((candidate) => candidate.nodeId === nodeId)
  return node !== undefined && isGeometrySketchNode(node) ? cloneNodeParams(node.params) : null
}

const restoreGraphHistorySnapshot = (
  graphDocumentId: string,
  graph: SpaghettiGraph,
): void => {
  const nextGraph = normalizeGraphForStoreCommit(graph)
  const state = useSpaghettiStore.getState()
  if (state.activeGraphDocumentId === graphDocumentId) {
    applyGraphHistorySnapshotToActiveDocument(nextGraph)
    return
  }

  useSpaghettiStore.setState((current) => {
    const document = current.graphDocumentsById[graphDocumentId]
    if (document === undefined) {
      return current
    }

    return {
      ...current,
      graphDocumentsById: {
        ...current.graphDocumentsById,
        [graphDocumentId]: {
          ...document,
          graph: nextGraph,
        },
      },
    }
  })
}

const applyGraphHistorySnapshotToActiveDocument = (nextGraph: SpaghettiGraph): void => {
  const normalizedGraph = normalizeGraphForStoreCommit(nextGraph)
  useSpaghettiStore.setState((state) => ({
    ...withUpdatedActiveGraphDocumentState(state, normalizedGraph),
    sketchPlanePickSession: pruneSketchPlanePickSession(
      normalizedGraph,
      state.sketchPlanePickSession,
    ),
    edgeWaypoints: pruneEdgeWaypoints(normalizedGraph, state.edgeWaypoints),
  }))
}

const restoreGraphNodePositionSnapshot = (
  graphDocumentId: string,
  nodeId: string,
  position: GraphNodePos,
): void => {
  const roundedPosition = roundGraphNodePos(position)
  const state = useSpaghettiStore.getState()
  if (state.activeGraphDocumentId === graphDocumentId) {
    useSpaghettiStore.setState((current) => {
      const nextGraph = upsertNodePos(current.graph, {
        [nodeId]: roundedPosition,
      })
      return {
        ...withUpdatedActiveGraphDocumentState(current, nextGraph, 'document-only'),
      }
    })
    return
  }

  useSpaghettiStore.setState((current) => {
    const document = current.graphDocumentsById[graphDocumentId]
    if (document === undefined) {
      return current
    }
    const nextGraph = upsertNodePos(document.graph, {
      [nodeId]: roundedPosition,
    })
    if (
      areNormalizedGraphsEqual(
        normalizeGraphForStoreCommit(document.graph),
        normalizeGraphForStoreCommit(nextGraph),
      )
    ) {
      return current
    }

    return {
      ...current,
      graphDocumentsById: {
        ...current.graphDocumentsById,
        [graphDocumentId]: {
          ...document,
          graph: nextGraph,
        },
      },
    }
  })
}

const restoreGraphNodeParameterSnapshot = (
  graphDocumentId: string,
  nodeId: string,
  params: SpaghettiNode['params'],
): void => {
  const state = useSpaghettiStore.getState()
  if (state.activeGraphDocumentId === graphDocumentId) {
    useSpaghettiStore.setState((current) => {
      const nextGraph = replaceGraphNodeParams(current.graph, nodeId, params)
      return {
        ...withUpdatedActiveGraphDocumentState(current, nextGraph),
      }
    })
    return
  }

  useSpaghettiStore.setState((current) => {
    const document = current.graphDocumentsById[graphDocumentId]
    if (document === undefined) {
      return current
    }
    const nextGraph = replaceGraphNodeParams(document.graph, nodeId, params)
    if (
      areNormalizedGraphsEqual(
        normalizeGraphForStoreCommit(document.graph),
        normalizeGraphForStoreCommit(nextGraph),
      )
    ) {
      return current
    }

    return {
      ...current,
      graphDocumentsById: {
        ...current.graphDocumentsById,
        [graphDocumentId]: {
          ...document,
          graph: nextGraph,
        },
      },
    }
  })
}

const restoreGeometrySketchNodeParameterSnapshot = (
  graphDocumentId: string,
  nodeId: string,
  params: SpaghettiNode['params'],
  localHistory?: GeometrySketchLocalHistoryState,
): void => {
  const state = useSpaghettiStore.getState()
  if (state.activeGraphDocumentId === graphDocumentId) {
    useSpaghettiStore.setState((current) => {
      const nextGraph = replaceGraphNodeParams(current.graph, nodeId, params)
      const targetId = getGeometrySketchLocalHistoryTargetId(graphDocumentId, nodeId)
      const nextHistoryByTargetId =
        localHistory === undefined
          ? current.geometrySketchLocalHistoryByTargetId
          : withGeometrySketchLocalHistoryState(
              current.geometrySketchLocalHistoryByTargetId,
              targetId,
              localHistory,
              cloneNodeParams,
            )
      return {
        ...withUpdatedActiveGraphDocumentState(current, nextGraph),
        geometrySketchSession: pruneGeometrySketchSession(nextGraph, current.geometrySketchSession),
        geometrySketchHistoryScrub: pruneGeometrySketchHistoryScrub(
          nextGraph,
          current.geometrySketchHistoryScrub,
        ),
        geometrySketchLocalHistoryByTargetId: nextHistoryByTargetId,
      }
    })
    return
  }

  restoreGraphNodeParameterSnapshot(graphDocumentId, nodeId, params)
}

const restorePartNodeFeatureStackSnapshot = (
  graphDocumentId: string,
  nodeId: string,
  stack: FeatureStack,
): void => {
  const state = useSpaghettiStore.getState()
  if (state.activeGraphDocumentId === graphDocumentId) {
    useSpaghettiStore.setState((current) => {
      const nextGraph = replacePartNodeFeatureStack(current.graph, nodeId, stack)
      return {
        ...withUpdatedActiveGraphDocumentState(current, nextGraph),
      }
    })
    return
  }

  useSpaghettiStore.setState((current) => {
    const document = current.graphDocumentsById[graphDocumentId]
    if (document === undefined) {
      return current
    }
    const nextGraph = replacePartNodeFeatureStack(document.graph, nodeId, stack)
    if (
      areNormalizedGraphsEqual(
        normalizeGraphForStoreCommit(document.graph),
        normalizeGraphForStoreCommit(nextGraph),
      )
    ) {
      return current
    }

    return {
      ...current,
      graphDocumentsById: {
        ...current.graphDocumentsById,
        [graphDocumentId]: {
          ...document,
          graph: nextGraph,
        },
      },
    }
  })
}

const commitGraphStructureHistoryCommand = (options: {
  command: GraphCommand
  label: string
  targetId?: string
  targetLabel?: string
  applyGraph?: (afterGraph: SpaghettiGraph) => void
}): boolean => {
  const state = useSpaghettiStore.getState()
  const graphDocumentId = state.activeGraphDocumentId
  const beforeGraph = normalizeGraphForStoreCommit(state.graph)
  const afterGraph = normalizeGraphForStoreCommit(options.command(beforeGraph))

  if (areNormalizedGraphsEqual(beforeGraph, afterGraph)) {
    return false
  }

  const applyGraph = options.applyGraph ?? applyGraphHistorySnapshotToActiveDocument
  applyGraph(afterGraph)

  return editHistoryStore.commitEntry({
    entryId: nextGraphStructureHistoryEntryId(graphDocumentId),
    label: options.label,
    source: graphStructureHistorySource,
    targetId: options.targetId ?? graphDocumentId,
    targetLabel: options.targetLabel,
    undo: () => restoreGraphHistorySnapshot(graphDocumentId, beforeGraph),
    redo: () => restoreGraphHistorySnapshot(graphDocumentId, afterGraph),
  })
}

const commitPartFeatureStackHistoryCommand = (options: {
  nodeId: string
  label: string
  targetId?: string
  targetLabel?: string
  buildFeatureStack: (stack: FeatureStack) => FeatureStack
}): boolean => {
  const state = useSpaghettiStore.getState()
  const graphDocumentId = state.activeGraphDocumentId
  const beforeGraph = normalizeGraphForStoreCommit(state.graph)
  const beforeNode = beforeGraph.nodes.find((node) => node.nodeId === options.nodeId)
  if (beforeNode === undefined || !isPartNode(beforeNode)) {
    return false
  }

  const beforeStack = cloneFeatureStack(getPartFeatureStack(beforeNode))
  const afterStack = recomputeCloseProfileOutputs(
    cloneFeatureStack(options.buildFeatureStack(beforeStack)),
  )
  if (areFeatureStacksEqual(beforeStack, afterStack)) {
    return false
  }

  const afterGraph = replacePartNodeFeatureStack(beforeGraph, options.nodeId, afterStack)
  if (areNormalizedGraphsEqual(beforeGraph, afterGraph)) {
    return false
  }

  applyGraphHistorySnapshotToActiveDocument(afterGraph)

  return editHistoryStore.commitEntry({
    entryId: nextGraphStructureHistoryEntryId(graphDocumentId),
    label: options.label,
    source: graphFeatureStackHistorySource,
    targetId: options.targetId ?? options.nodeId,
    targetLabel: options.targetLabel ?? options.nodeId,
    undo: () => restorePartNodeFeatureStackSnapshot(graphDocumentId, options.nodeId, beforeStack),
    redo: () => restorePartNodeFeatureStackSnapshot(graphDocumentId, options.nodeId, afterStack),
  })
}

const {
  commitGeometrySketchFeatureHistoryCommand,
  buildGeometrySketchStagedCommand,
  createGeometrySketchChildRestorePoints,
} = createGeometrySketchHistoryCommitAdapter({
  getActiveGraphDocumentId: () => useSpaghettiStore.getState().activeGraphDocumentId,
  getCurrentGraph: () => useSpaghettiStore.getState().graph,
  normalizeGraphForStoreCommit,
  cloneNodeParams,
  areNodeParamsEqual,
  readGeometrySketchNodeParams,
  isGeometrySketchNode,
  nextGraphStructureHistoryEntryId,
  nextGeometrySketchStagedCommandId,
  geometrySketchDrawHistorySource,
  commitEditHistoryEntry: editHistoryStore.commitEntry,
  restoreGeometrySketchNodeParameterSnapshot,
})

const {
  commitGraphNodeParameterHistoryCommand,
  commitGraphNodeMoveHistoryCommand,
} = createGraphNodeHistoryCommitAdapter({
  getActiveGraphDocumentId: () => useSpaghettiStore.getState().activeGraphDocumentId,
  getCurrentGraph: () => useSpaghettiStore.getState().graph,
  normalizeGraphForStoreCommit,
  cloneNodeParams,
  areNodeParamsEqual,
  normalizeNodeWidth,
  nextGraphStructureHistoryEntryId,
  graphNodeMoveHistorySource,
  graphNodeParameterHistorySource,
  commitEditHistoryEntry: editHistoryStore.commitEntry,
  restoreGraphNodeParameterSnapshot,
  restoreGraphNodePositionSnapshot,
})

const buildGeometrySketchToolSelectionCommand = (options: {
  tool: GeometrySketchTool
  beforeSessionState: GeometrySketchSessionSnapshot
  afterSessionState: GeometrySketchSessionSnapshot
}): GeometrySketchToolSelectionCommand => ({
  commandId: nextGeometrySketchToolSelectionCommandId(options.tool),
  label: getGeometrySketchToolSelectionHistoryLabel(options.tool),
  kind: 'tool-selection',
  beforeSessionState: cloneGeometrySketchSessionSnapshot(options.beforeSessionState),
  afterSessionState: cloneGeometrySketchSessionSnapshot(options.afterSessionState),
})

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

const replacePartNodeFeatureStack = (
  graph: SpaghettiGraph,
  nodeId: string,
  stack: FeatureStack,
): SpaghettiGraph => {
  const canonical = normalizeGraphForStoreCommit(graph)
  let changed = false
  const nextStack = recomputeCloseProfileOutputs(cloneFeatureStack(stack))
  const nodes = canonical.nodes.map((node) => {
    if (node.nodeId !== nodeId || !isPartNode(node)) {
      return node
    }
    changed = true
    return setPartFeatureStack(node, nextStack)
  })
  return changed ? normalizeGraphForStoreCommit({ ...canonical, nodes }) : canonical
}

const {
  commitPartSketchFeatureStackHistoryCommand,
  commitPartSketchFeatureHistoryCommand,
  commitPartFeatureParameterHistoryCommand,
} = createPartFeatureHistoryCommitAdapter({
  getActiveGraphDocumentId: () => useSpaghettiStore.getState().activeGraphDocumentId,
  getCurrentGraph: () => useSpaghettiStore.getState().graph,
  normalizeGraphForStoreCommit,
  cloneFeatureStack,
  areFeatureStacksEqual,
  readPartNodeFeatureStack: (graph, nodeId) => {
    const node = graph.nodes.find((entry) => entry.nodeId === nodeId)
    if (node === undefined || !isPartNode(node)) {
      return null
    }
    return cloneFeatureStack(getPartFeatureStack(node))
  },
  recomputePartFeatureStack: (stack) =>
    recomputeCloseProfileOutputs(cloneFeatureStack(stack)),
  replacePartNodeFeatureStack: (graph, nodeId, stack) =>
    replacePartNodeFeatureStack(graph, nodeId, stack),
  areNormalizedGraphsEqual,
  applyGraphHistorySnapshotToActiveDocument,
  nextGraphStructureHistoryEntryId,
  graphSketchFeatureHistorySource,
  graphFeatureParameterHistorySource,
  commitEditHistoryEntry: editHistoryStore.commitEntry,
  restorePartNodeFeatureStackSnapshot: (graphDocumentId, nodeId, stack) =>
    restorePartNodeFeatureStackSnapshot(graphDocumentId, nodeId, stack),
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
): tool is PrimarySketchDrawTool =>
  isPrimarySketchDrawTool(tool)

const getGeometrySketchDrawHistoryLabel = (tool: PrimarySketchDrawTool): string => {
  switch (tool) {
    case 'line':
      return 'Draw sketch line'
    case 'rectangle':
      return 'Draw sketch rectangle'
    case 'circle':
      return 'Draw sketch circle'
    case 'pline':
      return 'Draw sketch polyline'
  }
}

const getGeometrySketchConsoleToolLabel = (tool: GeometrySketchTool): string =>
  isGeometrySketchDrawTool(tool)
    ? getPrimarySketchDrawConsoleToolLabel(tool)
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
    return buildSketchDrawSessionIdlePrompt(
      isGeometrySketchDrawTool(lastUsedTool) ? lastUsedTool : null,
    )
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

const cloneSketchPlaneTransform = (transform: SketchPlaneTransform): SketchPlaneTransform => ({
  offsetMm: transform.offsetMm,
  inPlaneRotationDeg: transform.inPlaneRotationDeg,
  translation: { ...transform.translation },
  rotationDeg: { ...transform.rotationDeg },
})

const normalizeFiniteSketchPlaneTransformNumber = (value: number): number =>
  Number.isFinite(value) ? value : 0

const normalizeFiniteSketchPlaneAxisValue = (value: number): number | null =>
  Number.isFinite(value) ? value : null

const areSketchPlaneTransformsEqual = (
  left: SketchPlaneTransform,
  right: SketchPlaneTransform,
): boolean =>
  left.offsetMm === right.offsetMm &&
  left.translation.x === right.translation.x &&
  left.translation.y === right.translation.y &&
  left.translation.z === right.translation.z &&
  left.rotationDeg.x === right.rotationDeg.x &&
  left.rotationDeg.y === right.rotationDeg.y &&
  left.rotationDeg.z === right.rotationDeg.z &&
  left.inPlaneRotationDeg === right.inPlaneRotationDeg

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
    const prev = nextPos[nodeId]
    const rounded = {
      x: roundPos(pos.x),
      y: roundPos(pos.y),
      ...((typeof pos.width === 'number' && Number.isFinite(pos.width))
        ? { width: roundPos(pos.width) }
        : typeof prev?.width === 'number'
          ? { width: prev.width }
          : {}),
    }
    if (
      prev !== undefined &&
      prev.x === rounded.x &&
      prev.y === rounded.y &&
      prev.width === rounded.width
    ) {
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

const pruneGeometrySketchHistoryScrub = (
  graph: SpaghettiGraph,
  scrub: GeometrySketchHistoryScrubState | null,
): GeometrySketchHistoryScrubState | null => {
  if (scrub === null) {
    return null
  }

  const node = graph.nodes.find((candidate) => candidate.nodeId === scrub.nodeId)
  return node !== undefined && isGeometrySketchNode(node) ? scrub : null
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
  if (viewport.windowMode === 'meatball editor view') {
    return {
      windowMode: 'meatball editor view',
      position: viewport.position,
      size: viewport.size,
    }
  }
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
  comparisonBuildInputs: null,
  pendingChangedParamIds: [],
  pendingChangedInputHint: null,
  pendingStatsPartKeys: [],
  pendingTargetBuildUnitIds: [],
  pendingAffectedBuildUnitIds: [],
  currentDocumentRevision: 0,
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
  const acceptedPreviewGraphRevision = null
  const acceptedDraftGraphRevision = null
  const acceptedAuthoritativeGeometryResult = null
  const acceptedDraftGeometryResult = null
  const stagedAuthoritativePreviewResult = null
  const acceptedBuildOutputs: PartArtifact[] = []
  const acceptedPreviewBuildOutputs: PartArtifact[] = []
  return {
    compileBuild,
    previewPreparation,
    acceptedBuildImpact,
    acceptedBuildBundle,
    acceptedPreviewBuildBundle,
    acceptedAuthoritativeGraphRevision,
    acceptedPreviewGraphRevision,
    acceptedDraftGraphRevision,
    acceptedAuthoritativeGeometryResult,
    acceptedDraftGeometryResult,
    stagedAuthoritativePreviewResult,
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
  const acceptedPreviewGraphRevision = runtime?.acceptedPreviewGraphRevision ?? null
  const acceptedDraftGraphRevision = runtime?.acceptedDraftGraphRevision ?? null
  const acceptedAuthoritativeGeometryResult =
    runtime?.acceptedAuthoritativeGeometryResult ?? null
  const acceptedDraftGeometryResult = runtime?.acceptedDraftGeometryResult ?? null
  const stagedAuthoritativePreviewResult =
    cloneStagedAuthoritativePreviewResult(runtime?.stagedAuthoritativePreviewResult)
  const acceptedBuildOutputs = runtime?.acceptedBuildOutputs ?? []
  const acceptedPreviewBuildOutputs = runtime?.acceptedPreviewBuildOutputs ?? []
  return {
    compileBuild,
    previewPreparation,
    acceptedBuildImpact,
    acceptedBuildBundle,
    acceptedPreviewBuildBundle,
    acceptedAuthoritativeGraphRevision,
    acceptedPreviewGraphRevision,
    acceptedDraftGraphRevision,
    acceptedAuthoritativeGeometryResult,
    acceptedDraftGeometryResult,
    stagedAuthoritativePreviewResult,
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
  | 'editorViewportOverlayModeById'
  | 'editorViewportOverlayCanvasHiddenById'
  | 'editorViewportOverlayBackgroundOpacityById'
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
    editorViewportOverlayModeById?: Record<string, boolean>
    editorViewportOverlayCanvasHiddenById?: Record<string, boolean>
    editorViewportOverlayBackgroundOpacityById?: Record<string, number>
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
  const editorViewportOverlayModeById = pruneViewportBooleanRecord(
    next.editorViewportOverlayModeById ?? state.editorViewportOverlayModeById,
    editorViewportsById,
  )
  const editorViewportOverlayCanvasHiddenById = pruneViewportBooleanRecord(
    next.editorViewportOverlayCanvasHiddenById ?? state.editorViewportOverlayCanvasHiddenById,
    editorViewportsById,
  )
  const editorViewportOverlayBackgroundOpacityById = Object.fromEntries(
    Object.entries(
      next.editorViewportOverlayBackgroundOpacityById ??
        state.editorViewportOverlayBackgroundOpacityById,
    )
      .filter(([editorViewportId]) => editorViewportsById[editorViewportId] !== undefined)
      .map(([editorViewportId, opacity]) => [
        editorViewportId,
        normalizeOverlayBackgroundOpacity(opacity),
      ]),
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
    editorViewportOverlayModeById,
    editorViewportOverlayCanvasHiddenById,
    editorViewportOverlayBackgroundOpacityById,
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
    | 'editorViewportsById'
    | 'editorViewportOrder'
    | 'graphDocumentsById'
    | 'editorViewportHeaderCollapsedById'
    | 'editorViewportCanvasToolbarVisibleById'
    | 'editorViewportOverlayModeById'
    | 'editorViewportOverlayCanvasHiddenById'
    | 'editorViewportOverlayBackgroundOpacityById'
  >,
  graphDocumentId: string,
): {
  editorViewportId: string
  editorViewportsById: Record<string, EditorViewport>
  editorViewportOrder: string[]
  editorViewportHeaderCollapsedById: Record<string, boolean>
  editorViewportCanvasToolbarVisibleById: Record<string, boolean>
  editorViewportOverlayModeById: Record<string, boolean>
  editorViewportOverlayCanvasHiddenById: Record<string, boolean>
  editorViewportOverlayBackgroundOpacityById: Record<string, number>
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
    editorViewportHeaderCollapsedById: {
      ...state.editorViewportHeaderCollapsedById,
      [editorViewportId]: true,
    },
    editorViewportCanvasToolbarVisibleById: {
      ...state.editorViewportCanvasToolbarVisibleById,
      [editorViewportId]: false,
    },
    editorViewportOverlayModeById: {
      ...state.editorViewportOverlayModeById,
      [editorViewportId]: false,
    },
    editorViewportOverlayCanvasHiddenById: {
      ...state.editorViewportOverlayCanvasHiddenById,
      [editorViewportId]: false,
    },
    editorViewportOverlayBackgroundOpacityById: {
      ...state.editorViewportOverlayBackgroundOpacityById,
    },
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
      editorViewportOverlayModeById: {},
      editorViewportOverlayCanvasHiddenById: {},
      editorViewportOverlayBackgroundOpacityById: {},
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

type GraphDocumentRevisionScope = 'document-only' | 'geometry'

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
    | 'editorViewportOverlayModeById'
    | 'editorViewportOverlayCanvasHiddenById'
    | 'editorViewportOverlayBackgroundOpacityById'
    | 'editorViewportSelectedNodeIdById'
    | 'editorViewportSelectedEdgeIdById'
    | 'editorViewportConsolePreviewNodeIdById'
    | 'selectedNodeId'
    | 'selectedEdgeId'
    | 'consolePreviewNodeId'
  >,
  graph: SpaghettiGraph,
  revisionScope: GraphDocumentRevisionScope = 'geometry',
): GraphDocumentStateSlice & CachedGraphStateSlice & ViewportStateSlice & FeatureStackIrCacheSlice => {
  return withUpdatedGraphDocumentState(state, state.activeGraphDocumentId, graph, revisionScope)
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
    | 'editorViewportOverlayModeById'
    | 'editorViewportOverlayCanvasHiddenById'
    | 'editorViewportOverlayBackgroundOpacityById'
    | 'editorViewportSelectedNodeIdById'
    | 'editorViewportSelectedEdgeIdById'
    | 'editorViewportConsolePreviewNodeIdById'
    | 'selectedNodeId'
    | 'selectedEdgeId'
    | 'consolePreviewNodeId'
  >,
  graphDocumentId: string,
  graph: SpaghettiGraph,
  revisionScope: GraphDocumentRevisionScope = 'geometry',
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
  const nextDocumentRevision = (currentRuntime?.compileBuild.currentDocumentRevision ?? 0) + 1
  const nextGeometryRevision =
    revisionScope === 'geometry'
      ? (currentRuntime?.compileBuild.currentGraphRevision ?? 0) + 1
      : (currentRuntime?.compileBuild.currentGraphRevision ?? 0)

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
          currentDocumentRevision: nextDocumentRevision,
          currentGraphRevision: nextGeometryRevision,
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

export {
  selectActiveGraph,
  selectActiveGraphCompileResult,
  selectActiveGraphDocument,
  selectActiveGraphRuntime,
  selectCachedGraphEntryByDocumentId,
  selectCachedGraphEntryById,
  selectGraphBrowserStorageWorkingSetSnapshot,
  selectGraphByDocumentId,
  selectGraphCompileResultByDocumentId,
  selectGraphDocumentById,
  selectGraphReceiveReferencesByDocumentId,
  selectGraphRuntimeByDocumentId,
  selectOrderedCachedGraphEntries,
  selectOrderedGraphDocuments,
}

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

const doesRuntimeAcceptedPreviewRevisionMatchCurrentGraphRevision = (
  runtime: GraphRuntimeState | null,
): runtime is GraphRuntimeState =>
  runtime !== null &&
  runtime.acceptedPreviewGraphRevision !== null &&
  runtime.acceptedPreviewGraphRevision === runtime.compileBuild.currentGraphRevision

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
  doesRuntimeAcceptedPreviewRevisionMatchCurrentGraphRevision(selectViewerTargetGraphRuntime(state))
    ? selectViewerTargetGraphRuntime(state)?.acceptedPreviewBuildOutputs ?? EMPTY_PART_ARTIFACTS
    : EMPTY_PART_ARTIFACTS

export const selectViewerTargetGraphAcceptedPreviewBuildBundle = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): BuildResultBundle | null =>
  doesRuntimeAcceptedPreviewRevisionMatchCurrentGraphRevision(selectViewerTargetGraphRuntime(state))
    ? selectViewerTargetGraphRuntime(state)?.acceptedPreviewBuildBundle ?? null
    : null

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

export const selectViewerTargetGraphPreviewReadyAuthoritativeGeometryResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GeometryResultBundle | null => {
  const runtime = selectViewerTargetGraphRuntime(state)
  if (
    runtime?.stagedAuthoritativePreviewResult === null ||
    runtime?.stagedAuthoritativePreviewResult === undefined
  ) {
    return null
  }
  return runtime.stagedAuthoritativePreviewResult.graphRevision === runtime.compileBuild.currentGraphRevision
    ? runtime.stagedAuthoritativePreviewResult.authoritativeGeometryResult
    : null
}

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

export const useSpaghettiStore = create<SpaghettiStoreState>((set, get) => {
  const sketchPlaneCommandSessionActions = createSketchPlaneCommandSessionActions({
    set,
    get,
    appendConsoleEntry,
    isSketchPlane,
    cloneSketchPlaneTransform,
    appendSketchPlaneTransformHistoryEntry,
    resolvePersistedSketchPlaneTransformHistory,
    areSketchPlaneTransformHistoryEntriesEqual,
    mergeSketchPlaneTransformHistoryEntries,
    ensureSketchPlaneTransform,
    updateGeometrySketchNode,
    withUpdatedActiveGraphDocumentState: (state, nextGraph) =>
      withUpdatedActiveGraphDocumentState(state, nextGraph),
    readEditorViewportWindowMode: (state, editorViewportId) =>
      selectEditorViewportById(state, editorViewportId)?.windowMode ?? null,
    setEditorViewportWindowMode: (editorViewportId, windowMode) =>
      get().setEditorViewportWindowMode(editorViewportId, windowMode),
    startGeometrySketchSession: (nodeId, mode) => get().startGeometrySketchSession(nodeId, mode),
    readTranslateSnapValue: () => useUiPrefsStore.getState().sketchPlaneToolbarTranslateSnapValue,
    readRotateSnapValue: () => useUiPrefsStore.getState().sketchPlaneToolbarRotateSnapValue,
    finishSketchPlanePick: () => get().finishSketchPlanePick(),
    cancelSketchPlanePick: () => get().cancelSketchPlanePick(),
    returnActiveSketchSessionOneLevel: () => get().returnActiveSketchSessionOneLevel(),
  })
  const sketchPlanePickDraftTransformActions = createSketchPlanePickDraftTransformActions({
    set,
    appendConsoleEntry,
    createDefaultSketchPlaneTransform,
    cloneSketchPlaneTransform,
    areSketchPlaneTransformsEqual,
    normalizeFiniteSketchPlaneTransformNumber,
    normalizeFiniteSketchPlaneAxisValue,
  })
  const geometrySketchPlaneGraphWriteActions = createGeometrySketchPlaneGraphWriteActions({
    set,
    isSketchPlane,
    updateGeometrySketchNode,
    ensureSketchPlaneTransform,
    withUpdatedActiveGraphDocumentState: (state, nextGraph) =>
      withUpdatedActiveGraphDocumentState(state, nextGraph),
    pruneSketchPlanePickSession,
  })
  const geometrySketchSessionLifecycleActions = createGeometrySketchSessionLifecycleActions({
    set,
    get,
    appendConsoleEntry,
    appendGeometrySketchConsolePrompt,
    buildGeometrySketchSessionDraft,
    resolveGeometrySketchDrawStage,
    readGeometrySketchNodeParams,
    getGeometrySketchLocalHistoryTargetId,
    cloneGeometrySketchLocalHistoryState,
    buildGeometrySketchSessionWithHistory,
    cloneNodeParams,
    selectActiveEditorViewport,
    snapshotCollapsedRestoreState,
    syncCollapsedViewportToWorkspace: (viewport) => {
      useWorkspaceStore
        .getState()
        .setEditorSurfacePlacement(
          viewport.editorViewportId,
          createEditorWorkspaceSurfaceStateFromViewport(viewport),
        )
    },
    replaceGraphNodeParams,
    areNodeParamsEqual,
    buildGeometrySketchLocalHistoryState,
    withGeometrySketchLocalHistoryState,
    commitGeometrySketchFeatureHistoryCommand,
    createGeometrySketchChildSummaries,
    createGeometrySketchChildRestorePoints,
    selectEditorViewportById,
    setEditorViewportWindowMode: (editorViewportId, windowMode) =>
      get().setEditorViewportWindowMode(editorViewportId, windowMode),
    isGeometrySketchNode,
    cloneSketchPlaneTransform,
    buildSketchPlaneMovePrompt,
    buildSketchPlaneRotatePrompt,
    sketchPlaneRootPrompt: SKETCH_PLANE_ROOT_PROMPT,
    reopenSketchPlanePickPlaneSelection: () => get().reopenSketchPlanePickPlaneSelection(),
    cancelSketchPlanePick: () => get().cancelSketchPlanePick(),
    cancelGeometrySketchDrawDraft: () => get().cancelGeometrySketchDrawDraft(),
  })
  const geometrySketchDrawSessionControlActions =
    createGeometrySketchDrawSessionControlActions({
      set,
      get,
      appendConsoleEntry,
      appendGeometrySketchConsolePrompt,
      isGeometrySketchDrawTool,
      buildGeometrySketchSessionDraft,
      resolveGeometrySketchDrawStage,
      buildGeometrySketchToolSelectionCommand,
      buildGeometrySketchSessionSnapshot,
      buildGeometrySketchSessionWithHistory,
      cloneNodeParams,
      normalizeGeometrySketchDraftPoint,
      areGeometrySketchDraftPointsEqual,
    })
  const geometrySketchDrawDraftActions = createGeometrySketchDrawDraftActions({
    set,
    get,
    appendGeometrySketchConsolePrompt,
    isGeometrySketchDrawTool,
    normalizeGeometrySketchDraftPoint,
    areGeometrySketchDraftPointsEqual,
    resolveGeometrySketchDrawStage,
    updateGeometrySketchNode,
    recomputeSketchFeature,
    buildGeometrySketchLineComponent,
    buildGeometrySketchRectangleComponent,
    buildGeometrySketchCircleComponent,
    makeComponentId,
    getGeometrySketchDrawHistoryLabel,
    buildGeometrySketchSessionSnapshot,
    buildGeometrySketchCommittedSessionSnapshot,
    buildGeometrySketchSessionWithHistory,
    applyGeometrySketchSessionSnapshot,
    cloneGeometrySketchSessionSnapshot,
    buildGeometrySketchStagedCommand,
    findPreferredGeometrySketchHistoryCommandIndex,
    cloneNodeParams,
    replaceGraphNodeParams,
    withUpdatedActiveGraphDocumentState: (state, nextGraph) =>
      withUpdatedActiveGraphDocumentState(state, nextGraph),
    pruneGeometrySketchSession,
    getGeometrySketchLocalHistoryTargetId,
    withGeometrySketchLocalHistoryState,
    selectEditorViewportById,
  })
  const geometrySketchSelectionActions = createGeometrySketchSelectionActions({
    set,
    normalizeGeometrySketchSelectionIds,
    normalizeGeometrySketchDraftPoint,
    areGeometrySketchDraftPointsEqual,
    updateGeometrySketchNode,
    recomputeSketchFeature,
    buildGeometrySketchStagedCommand,
    buildGeometrySketchSessionSnapshot,
    buildGeometrySketchCommittedSessionSnapshot,
    buildGeometrySketchSessionWithHistory,
    applyGeometrySketchSessionSnapshot,
    withUpdatedActiveGraphDocumentState: (state, nextGraph) =>
      withUpdatedActiveGraphDocumentState(state, nextGraph),
    cloneNodeParams,
  })
  const geometrySketchComponentEditActions = createGeometrySketchComponentEditActions({
    set,
    updateGeometrySketchNode,
    recomputeSketchFeature,
    withUpdatedActiveGraphDocumentState: (state, nextGraph) =>
      withUpdatedActiveGraphDocumentState(state, nextGraph),
    pruneGeometrySketchSession,
    normalizeSketchComponentName,
  })

  return {
  ...withInitialGraphDocumentState(initialGraphDocument),
  sharedViewerComposition: null,
  edgeWaypoints: {},
  selectedNodeId: null,
  consolePreviewNodeId: null,
  editorViewportNodeFitRequest: null,
  editorViewportCanvasFitRequest: null,
  editorViewportHeaderCollapsedById: {},
  editorViewportCanvasToolbarVisibleById: {},
  editorViewportOverlayModeById: {},
  editorViewportOverlayCanvasHiddenById: {},
  editorViewportOverlayBackgroundOpacityById: {},
  newNodeSpawnMode: defaultNodeRowMode,
  editorViewportSelectedNodeIdById: {},
  editorViewportSelectedEdgeIdById: {},
  editorViewportConsolePreviewNodeIdById: {},
  selectedEdgeId: null,
  hoveredEdgeId: null,
  connectionDrag: null,
  sketchPlanePickSession: null,
  geometrySketchSession: null,
  geometrySketchHistoryScrub: null,
  geometrySketchLocalHistoryByTargetId: {},
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
        geometrySketchHistoryScrub: null,
        geometrySketchLocalHistoryByTargetId: {},
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
        geometrySketchHistoryScrub: pruneGeometrySketchHistoryScrub(
          nextGraph,
          state.geometrySketchHistoryScrub,
        ),
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
        geometrySketchHistoryScrub: pruneGeometrySketchHistoryScrub(
          nextGraph,
          state.geometrySketchHistoryScrub,
        ),
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
        ...withUpdatedActiveGraphDocumentState(state, nextGraph, 'document-only'),
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
          ...(typeof update.width === 'number' ? { width: update.width } : {}),
        }
      }
      const nextGraph = upsertNodePos(state.graph, updatesByNodeId)
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph, 'document-only'),
      }
    })
  },
  commitGraphNodeMoveWithHistory: (options) => commitGraphNodeMoveHistoryCommand(options),
  commitGraphNodeParameterWithHistory: (options) =>
    commitGraphNodeParameterHistoryCommand(options),
  commitPartFeatureParameterWithHistory: (options) =>
    commitPartFeatureParameterHistoryCommand(options),
  commitPartSketchFeatureWithHistory: (options) =>
    commitPartSketchFeatureHistoryCommand(options),
  ensureNodePositions: () => {
    set((state) => {
      const nextGraph = normalizeGraphForStoreCommit(state.graph)
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph, 'document-only'),
      }
    })
  },
  setNodeMode: (nodeId, mode) => {
    set((state) => {
      const nextGraph = upsertNodeMode(state.graph, nodeId, mode)
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph, 'document-only'),
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
  addGraphNodeWithHistory: (options) =>
    commitGraphStructureHistoryCommand({
      command: addNodeCommand(options),
      label: 'Add graph node',
      targetId: options.node.nodeId,
      targetLabel: options.node.type,
    }),
  removeGraphNodeWithHistory: (nodeId) =>
    commitGraphStructureHistoryCommand({
      command: removeNodeCommand(nodeId),
      label: 'Remove graph node',
      targetId: nodeId,
      targetLabel: nodeId,
    }),
  connectGraphEdgeWithHistory: (options) =>
    commitGraphStructureHistoryCommand({
      command: connectEdgeWithAutoReplace(options),
      label: 'Connect graph wire',
      targetId: options.edgeId,
      targetLabel: options.edgeId,
    }),
  removeGraphEdgeWithHistory: (edgeId) =>
    commitGraphStructureHistoryCommand({
      command: removeEdgeCommand(edgeId),
      label: 'Remove graph wire',
      targetId: edgeId,
      targetLabel: edgeId,
    }),
  addEdge: (edge) => {
    commitGraphStructureHistoryCommand({
      command: addEdgeCommand(edge),
      label: 'Connect graph wire',
      targetId: edge.edgeId,
      targetLabel: edge.edgeId,
    })
  },
  removeEdge: (edgeId) => {
    commitGraphStructureHistoryCommand({
      command: removeEdgeCommand(edgeId),
      label: 'Remove graph wire',
      targetId: edgeId,
      targetLabel: edgeId,
      applyGraph: (afterGraph) => {
        set((state) => {
          const nextGraph = normalizeGraphForStoreCommit(afterGraph)
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
            sketchPlanePickSession: pruneSketchPlanePickSession(
              nextGraph,
              state.sketchPlanePickSession,
            ),
            edgeWaypoints: pruneEdgeWaypoints(nextGraph, nextWaypoints),
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
  ...sketchPlaneCommandSessionActions,
  ...sketchPlanePickDraftTransformActions,
  ...geometrySketchPlaneGraphWriteActions,
  ...geometrySketchSessionLifecycleActions,
  ...geometrySketchDrawSessionControlActions,
  ...geometrySketchDrawDraftActions,
  ...geometrySketchSelectionActions,
  ...geometrySketchComponentEditActions,
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
      const stagedCommand = buildGeometrySketchStagedCommand({
        nodeId: session.nodeId,
        beforeGraph: state.graph,
        afterGraph: nextGraph,
        label: 'Draw sketch circle',
        beforeSessionState: buildGeometrySketchSessionSnapshot(session),
        afterSessionState: buildGeometrySketchCommittedSessionSnapshot(session),
      })
      if (stagedCommand === null) {
        return state
      }
      nextPromptRef.current = {
        tool: null,
        draft: null,
        lastUsedTool: session.lastUsedTool,
      }
      return {
        ...withUpdatedActiveGraphDocumentState(state, nextGraph),
        geometrySketchSession: buildGeometrySketchSessionWithHistory({
          session: applyGeometrySketchSessionSnapshot(
            session,
            buildGeometrySketchCommittedSessionSnapshot(session),
          ),
          undoCommands: [...session.sessionUndoCommands, stagedCommand],
          redoCommands: [],
          cloneNodeParams,
        }),
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
              comparisonBuildInputs: options.previousBuildInputs,
              pendingChangedParamIds: [...options.pendingChangedParamIds],
              pendingChangedInputHint: cloneBuildChangedInputHint(
                options.pendingChangedInputHint,
              ),
              pendingStatsPartKeys: [...options.pendingStatsPartKeys],
              pendingTargetBuildUnitIds: [...(options.pendingTargetBuildUnitIds ?? [])],
              pendingAffectedBuildUnitIds: [...(options.pendingAffectedBuildUnitIds ?? [])],
              currentDocumentRevision: runtime.compileBuild.currentDocumentRevision,
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
      const finalizedAcceptedResult = buildFinalizedAcceptedResultArtifacts({
        runtime,
        routingIdentity,
      })
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
      const previousStagedAuthoritativeHandleId = getGeometryResultAuthoritativeHandleId(
        runtime.stagedAuthoritativePreviewResult?.authoritativeGeometryResult ?? null,
      )
      if (
        previousStagedAuthoritativeHandleId !== null &&
        previousStagedAuthoritativeHandleId !== incomingAuthoritativeHandleId &&
        previousStagedAuthoritativeHandleId !==
          getGeometryResultAuthoritativeHandleId(
            acceptedGeometryPromotion.acceptedAuthoritativeGeometryResult,
          )
      ) {
        authoritativeHandleIdsToRelease.push(previousStagedAuthoritativeHandleId)
      }

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
              latestAcceptedBuildUnitIds: [...finalizedAcceptedResult.targetBuildUnitIds],
              pendingTargetBuildUnitIds: [],
              pendingAffectedBuildUnitIds: [],
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
              inFlightExecutionIntent: null,
            },
            acceptedBuildBundle: finalizedAcceptedResult.acceptedBuildBundle,
            acceptedPreviewBuildBundle: finalizedAcceptedResult.acceptedPreviewBuildBundle,
            acceptedAuthoritativeGraphRevision:
              routingIdentity.authoritativeGeometryResult === undefined
                ? runtime.acceptedAuthoritativeGraphRevision
                : compileBuild.inFlightGraphRevision,
            acceptedPreviewGraphRevision: compileBuild.inFlightGraphRevision,
            acceptedDraftGraphRevision:
              routingIdentity.draftGeometryResult === undefined
                ? runtime.acceptedDraftGraphRevision
                : compileBuild.inFlightGraphRevision,
            acceptedAuthoritativeGeometryResult:
              acceptedGeometryPromotion.acceptedAuthoritativeGeometryResult,
            acceptedDraftGeometryResult: acceptedGeometryPromotion.acceptedDraftGeometryResult,
            stagedAuthoritativePreviewResult: null,
            acceptedBuildOutputs: finalizedAcceptedResult.acceptedBuildOutputs,
            acceptedPreviewBuildOutputs: finalizedAcceptedResult.acceptedPreviewBuildOutputs,
            acceptedBuildImpact: finalizedAcceptedResult.acceptedBuildImpact,
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: routingIdentity.graphDocumentId,
              previewPreparation: runtime.previewPreparation,
              acceptedBundle: finalizedAcceptedResult.acceptedBuildBundle,
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
  stageAuthoritativePreviewGraphBuildResult: (routingIdentity) => {
    let staged = false
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
        compileBuild.inFlightGraphRevision === null ||
        routingIdentity.buildSeq < compileBuild.latestIssuedBuildSeq ||
        (compileBuild.latestAcceptedBuildSeq !== null &&
          routingIdentity.buildSeq <= compileBuild.latestAcceptedBuildSeq)
      ) {
        if (incomingAuthoritativeHandleId !== null) {
          authoritativeHandleIdsToRelease.push(incomingAuthoritativeHandleId)
        }
        return state
      }

      const finalizedAcceptedResult = buildFinalizedAcceptedResultArtifacts({
        runtime,
        routingIdentity,
      })
      const previousStagedAuthoritativeHandleId = getGeometryResultAuthoritativeHandleId(
        runtime.stagedAuthoritativePreviewResult?.authoritativeGeometryResult ?? null,
      )
      if (
        previousStagedAuthoritativeHandleId !== null &&
        previousStagedAuthoritativeHandleId !== incomingAuthoritativeHandleId
      ) {
        authoritativeHandleIdsToRelease.push(previousStagedAuthoritativeHandleId)
      }

      const nextGraphDocumentIdByBuildSeq = { ...state.graphDocumentIdByBuildSeq }
      delete nextGraphDocumentIdByBuildSeq[routingIdentity.buildSeq]
      staged = true

      return {
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          [routingIdentity.graphDocumentId]: {
            ...runtime,
            compileBuild: {
              ...compileBuild,
              lastBuildSeq: routingIdentity.buildSeq,
              pendingTargetBuildUnitIds: [],
              pendingAffectedBuildUnitIds: [],
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
              inFlightExecutionIntent: null,
            },
            acceptedDraftGraphRevision:
              routingIdentity.draftGeometryResult === undefined
                ? runtime.acceptedDraftGraphRevision
                : compileBuild.inFlightGraphRevision,
            acceptedDraftGeometryResult:
              routingIdentity.draftGeometryResult === undefined
                ? cloneAcceptedGeometryLane(runtime.acceptedDraftGeometryResult)
                : cloneAcceptedGeometryLane(routingIdentity.draftGeometryResult),
            stagedAuthoritativePreviewResult: {
              buildSeq: routingIdentity.buildSeq,
              buildRequestId: routingIdentity.buildRequestId,
              graphRevision: compileBuild.inFlightGraphRevision,
              targetBuildUnitIds: [...finalizedAcceptedResult.targetBuildUnitIds],
              acceptedBuildImpact: finalizedAcceptedResult.acceptedBuildImpact,
              acceptedBuildBundle: finalizedAcceptedResult.acceptedBuildBundle,
              acceptedPreviewBuildBundle: finalizedAcceptedResult.acceptedPreviewBuildBundle,
              acceptedBuildOutputs: [...finalizedAcceptedResult.acceptedBuildOutputs],
              acceptedPreviewBuildOutputs: [
                ...finalizedAcceptedResult.acceptedPreviewBuildOutputs,
              ],
              authoritativeGeometryResult: cloneAcceptedGeometryLane(
                routingIdentity.authoritativeGeometryResult,
              ),
            },
          },
        },
        graphDocumentIdByBuildSeq: nextGraphDocumentIdByBuildSeq,
      }
    })
    releaseAuthoritativeHandleIds(authoritativeHandleIdsToRelease)
    return staged
  },
  promoteStagedAuthoritativePreviewResult: (graphDocumentId) => {
    let promoted = false
    const authoritativeHandleIdsToRelease: string[] = []
    set((state) => {
      const runtime = state.graphRuntimeByDocumentId[graphDocumentId]
      if (runtime === undefined) {
        return state
      }
      const stagedPreviewResult = runtime.stagedAuthoritativePreviewResult
      if (stagedPreviewResult === null) {
        return state
      }

      if (stagedPreviewResult.graphRevision !== runtime.compileBuild.currentGraphRevision) {
        const staleStagedHandleId = getGeometryResultAuthoritativeHandleId(
          stagedPreviewResult.authoritativeGeometryResult,
        )
        if (staleStagedHandleId !== null) {
          authoritativeHandleIdsToRelease.push(staleStagedHandleId)
        }
        return {
          graphRuntimeByDocumentId: {
            ...state.graphRuntimeByDocumentId,
            [graphDocumentId]: {
              ...runtime,
              stagedAuthoritativePreviewResult: null,
            },
          },
        }
      }

      promoted = true
      const acceptedGeometryPromotion = resolveAcceptedGeometryPromotion({
        previousAcceptedDraftGeometryResult: runtime.acceptedDraftGeometryResult,
        previousAcceptedAuthoritativeGeometryResult: runtime.acceptedAuthoritativeGeometryResult,
        incomingAuthoritativeGeometryResult:
          stagedPreviewResult.authoritativeGeometryResult ?? undefined,
      })
      authoritativeHandleIdsToRelease.push(
        ...acceptedGeometryPromotion.authoritativeHandleIdsToRelease,
      )

      return {
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          [graphDocumentId]: {
            ...runtime,
            compileBuild: {
              ...runtime.compileBuild,
              lastBuildSeq: stagedPreviewResult.buildSeq,
              latestAcceptedGraphRevision: stagedPreviewResult.graphRevision,
              latestAcceptedBuildSeq: stagedPreviewResult.buildSeq,
              latestAcceptedBuildUnitIds: [...stagedPreviewResult.targetBuildUnitIds],
            },
            acceptedBuildBundle: cloneBuildResultBundle(stagedPreviewResult.acceptedBuildBundle),
            acceptedPreviewBuildBundle: cloneBuildResultBundle(
              stagedPreviewResult.acceptedPreviewBuildBundle,
            ),
            acceptedAuthoritativeGraphRevision: stagedPreviewResult.graphRevision,
            acceptedPreviewGraphRevision: stagedPreviewResult.graphRevision,
            acceptedAuthoritativeGeometryResult:
              acceptedGeometryPromotion.acceptedAuthoritativeGeometryResult,
            stagedAuthoritativePreviewResult: null,
            acceptedBuildOutputs: [...stagedPreviewResult.acceptedBuildOutputs],
            acceptedPreviewBuildOutputs: [...stagedPreviewResult.acceptedPreviewBuildOutputs],
            acceptedBuildImpact: cloneAcceptedBuildImpactSnapshot(
              stagedPreviewResult.acceptedBuildImpact,
            ),
            outputSurface: buildGraphOutputSurface({
              graphDocumentId,
              previewPreparation: runtime.previewPreparation,
              acceptedBundle: stagedPreviewResult.acceptedBuildBundle,
              publishedAtBuildSeq: stagedPreviewResult.buildSeq,
            }),
          },
        },
      }
    })
    releaseAuthoritativeHandleIds(authoritativeHandleIdsToRelease)
    return promoted
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
  hydrateGraphBrowserStorageSnapshot: (snapshot) => {
    const graphDocumentOrder = snapshot.graphDocumentOrder.filter(
      (graphDocumentId) => snapshot.graphDocumentsById[graphDocumentId] !== undefined,
    )
    if (graphDocumentOrder.length === 0) {
      return false
    }

    const graphDocumentsById: Record<string, GraphDocument> = {}
    const graphRuntimeByDocumentId: Record<string, GraphRuntimeState> = {}
    const cachedGraphEntriesById: Record<string, CachedGraphEntry> = {}
    for (const graphDocumentId of graphDocumentOrder) {
      const document = snapshot.graphDocumentsById[graphDocumentId]
      const nextGraph = normalizeGraphForStoreCommit(cloneGraph(document.graph))
      graphDocumentsById[graphDocumentId] = {
        ...document,
        graph: nextGraph,
      }
      graphRuntimeByDocumentId[graphDocumentId] = createGraphRuntimeState(
        graphDocumentId,
        nextGraph,
      )
      cachedGraphEntriesById[graphDocumentId] = createCachedGraphEntry(graphDocumentId, {
        source: 'in-memory',
        isDirty: false,
      })
    }

    const fallbackGraphDocumentId =
      graphDocumentsById[snapshot.activeGraphDocumentId] !== undefined
        ? snapshot.activeGraphDocumentId
        : graphDocumentOrder[0]

    set((current) =>
      withBrowserViewportState(current, {
        graphDocumentsById,
        graphDocumentOrder,
        graphRuntimeByDocumentId,
        cachedGraphEntriesById,
        graphDocumentIdByBuildSeq: {},
        fallbackGraphDocumentId,
        viewerTargetGraphDocumentId: fallbackGraphDocumentId,
      }),
    )
    return true
  },
  createGraphNodeInDocumentAndSelect: ({ graphDocumentId, nodeType, labelPrefix }) => {
    const initialState = get()
    if (initialState.graphDocumentsById[graphDocumentId] === undefined) {
      return null
    }

    initialState.openGraphDocumentInViewport(graphDocumentId)
    const targetState = get()
    if (targetState.activeGraphDocumentId !== graphDocumentId) {
      return null
    }

    const targetDocument = selectGraphDocumentById(targetState, graphDocumentId)
    if (targetDocument === null) {
      return null
    }

    const existingNodeCount = targetDocument.graph.nodes.filter((node) => node.type === nodeType).length
    const nodeId = generateUniqueCreatedGraphNodeId(targetDocument.graph)
    targetState.addGraphNodeWithHistory({
      node: {
        nodeId,
        type: nodeType,
        params: getDefaultNodeParams(nodeType),
      },
      position: buildDefaultCreatedGraphNodePosition(targetDocument.graph),
    })
    get().setSelectedNodeId(nodeId)
    return {
      nodeId,
      nodeLabel: `${labelPrefix}_[${existingNodeCount + 1}]`,
    }
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
        editorViewportHeaderCollapsedById: nextViewportState.editorViewportHeaderCollapsedById,
        editorViewportCanvasToolbarVisibleById:
          nextViewportState.editorViewportCanvasToolbarVisibleById,
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
        editorViewportHeaderCollapsedById: nextViewportState.editorViewportHeaderCollapsedById,
        editorViewportCanvasToolbarVisibleById:
          nextViewportState.editorViewportCanvasToolbarVisibleById,
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

      const nextOverlayModeByViewportId = { ...state.editorViewportOverlayModeById }
      delete nextOverlayModeByViewportId[editorViewportId]

      return withBrowserViewportState(state, {
        editorViewportsById: focusedViewportsById,
        editorViewportOrder: nextEditorViewportOrder,
        activeEditorViewportId: fallbackViewportId,
        editorViewportOverlayModeById: nextOverlayModeByViewportId,
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
  setEditorViewportOverlayCanvasHidden: (editorViewportId, hidden) => {
    set((state) => {
      if (state.editorViewportsById[editorViewportId] === undefined) {
        return state
      }
      return {
        editorViewportOverlayCanvasHiddenById: {
          ...state.editorViewportOverlayCanvasHiddenById,
          [editorViewportId]: hidden,
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

    const setOverlayMode = (isOverlay: boolean) => {
      set((currentState) => {
        if (currentState.editorViewportsById[editorViewportId] === undefined) {
          return currentState
        }
        return {
          editorViewportOverlayModeById: {
            ...currentState.editorViewportOverlayModeById,
            [editorViewportId]: isOverlay,
          },
          editorViewportOverlayCanvasHiddenById: {
            ...currentState.editorViewportOverlayCanvasHiddenById,
            [editorViewportId]: false,
          },
        }
      })
    }

    if (mode === 'collapsed') {
      setOverlayMode(false)
      if (viewport.windowMode !== 'collapsed') {
        get().setEditorViewportWindowMode(editorViewportId, 'collapsed')
      }
      get().setEditorViewportHeaderCollapsed(editorViewportId, false)
      get().setEditorViewportCanvasToolbarVisible(editorViewportId, true)
      return
    }

    if (mode === 'essentials') {
      setOverlayMode(false)
      if (viewport.windowMode === 'collapsed') {
        get().setEditorViewportWindowMode(editorViewportId, 'collapsed')
      } else if (viewport.windowMode === 'maximized') {
        get().setEditorViewportWindowMode(editorViewportId, 'maximized')
      }
      get().setEditorViewportHeaderCollapsed(editorViewportId, true)
      get().setEditorViewportCanvasToolbarVisible(editorViewportId, false)
      return
    }

    if (mode === 'overlay') {
      setOverlayMode(true)
      if (viewport.windowMode !== 'maximized') {
        get().setEditorViewportWindowMode(editorViewportId, 'maximized')
      }
      get().setEditorViewportHeaderCollapsed(editorViewportId, true)
      get().setEditorViewportCanvasToolbarVisible(editorViewportId, false)
      return
    }

    setOverlayMode(false)
    if (viewport.windowMode === 'collapsed') {
      get().setEditorViewportWindowMode(editorViewportId, 'collapsed')
    } else if (viewport.windowMode === 'maximized') {
      get().setEditorViewportWindowMode(editorViewportId, 'maximized')
    }
    get().setEditorViewportHeaderCollapsed(editorViewportId, false)
    get().setEditorViewportCanvasToolbarVisible(editorViewportId, true)
  },
  setEditorViewportOverlayBackgroundOpacity: (editorViewportId, opacity) => {
    set((state) => {
      if (state.editorViewportsById[editorViewportId] === undefined) {
        return state
      }
      return {
        editorViewportOverlayBackgroundOpacityById: {
          ...state.editorViewportOverlayBackgroundOpacityById,
          [editorViewportId]: normalizeOverlayBackgroundOpacity(opacity),
        },
      }
    })
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
    commitPartFeatureStackHistoryCommand({
      nodeId,
      label: 'Add feature',
      targetLabel: 'Sketch feature',
      buildFeatureStack: (stack) => [
        ...stack,
        createSketchFeature(),
      ],
    })
  },
  addCloseProfileFeature: (nodeId) => {
    commitPartFeatureStackHistoryCommand({
      nodeId,
      label: 'Add feature',
      targetLabel: 'Close profile feature',
      buildFeatureStack: (stack) => [
        ...stack,
        createCloseProfileFeature(),
      ],
    })
  },
  addExtrudeFeature: (nodeId) => {
    commitPartFeatureStackHistoryCommand({
      nodeId,
      label: 'Add feature',
      targetLabel: 'Extrude feature',
      buildFeatureStack: (stack) => {
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
    commitPartSketchFeatureStackHistoryCommand({
      nodeId,
      featureId,
      label: 'Add sketch component',
      targetId: `${nodeId}:${featureId}:components`,
      targetLabel: 'Sketch component',
      buildFeatureStack: (stack) =>
        stack.map((feature) => {
          if (feature.featureId !== featureId || feature.type !== 'sketch') {
            return feature
          }
          return recomputeSketchFeature({
            ...feature,
            components: [...feature.components, createDefaultComponent(componentType)],
          })
        }),
    })
  },
  moveFeatureUp: (nodeId, featureId) => {
    commitPartFeatureStackHistoryCommand({
      nodeId,
      label: 'Reorder feature',
      targetId: featureId,
      targetLabel: featureId,
      buildFeatureStack: (stack) => moveFeatureInStack(stack, featureId, 'up'),
    })
  },
  moveFeatureDown: (nodeId, featureId) => {
    commitPartFeatureStackHistoryCommand({
      nodeId,
      label: 'Reorder feature',
      targetId: featureId,
      targetLabel: featureId,
      buildFeatureStack: (stack) => moveFeatureInStack(stack, featureId, 'down'),
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
    commitPartSketchFeatureStackHistoryCommand({
      nodeId,
      featureId,
      label: 'Reorder sketch component',
      targetId: `${nodeId}:${featureId}:${rowId}`,
      targetLabel: 'Sketch component',
      buildFeatureStack: (stack) =>
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
    })
  },
  moveSketchComponentDown: (nodeId, featureId, rowId) => {
    commitPartSketchFeatureStackHistoryCommand({
      nodeId,
      featureId,
      label: 'Reorder sketch component',
      targetId: `${nodeId}:${featureId}:${rowId}`,
      targetLabel: 'Sketch component',
      buildFeatureStack: (stack) =>
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
    })
  },
  removeSketchComponent: (nodeId, featureId, rowId) => {
    commitPartSketchFeatureStackHistoryCommand({
      nodeId,
      featureId,
      label: 'Remove sketch component',
      targetId: `${nodeId}:${featureId}:${rowId}`,
      targetLabel: 'Sketch component',
      buildFeatureStack: (stack) =>
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
    const beforeGraph = get().graph
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
    commitPartFeatureParameterHistoryCommand({
      nodeId,
      featureId,
      beforeGraph,
      targetId: `${nodeId}:${featureId}:source`,
      targetLabel: 'Close profile source',
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
    const beforeGraph = get().graph
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
    commitPartFeatureParameterHistoryCommand({
      nodeId,
      featureId,
      beforeGraph,
      targetId: `${nodeId}:${featureId}:profileRef`,
      targetLabel: 'Extrude profile',
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
  }
})

for (const viewport of Object.values(useSpaghettiStore.getState().editorViewportsById)) {
  const workspaceState = useWorkspaceStore.getState()
  workspaceState.setEditorSurfacePlacement(
    viewport.editorViewportId,
    createEditorWorkspaceSurfaceStateFromViewport(viewport),
  )
  workspaceState.setEditorSurfaceBinding(viewport.editorViewportId, viewport.graphDocumentId)
}
