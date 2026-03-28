import { create } from 'zustand'
import { buildDispatcher } from '../buildDispatcher'
import {
  selectActiveGraphDocument,
  selectGraphByDocumentId,
  selectOrderedGraphDocuments,
  selectResolvedGraphReceiveReferencesByDocumentId,
  selectGraphRuntimeByDocumentId,
  type GraphRuntimeState,
  type SpaghettiStoreState,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import type { GraphDocument, SpaghettiGraph } from '../spaghetti/schema/spaghettiTypes'
import {
  compileSpaghettiGraph,
  type CompileSpaghettiGraphResult,
} from '../spaghetti/compiler/compileGraph'
import { sketchFeatureSchema } from '../spaghetti/features/featureSchema'
import { buildRequestFromBuildInputs } from '../spaghetti/integration/buildInputsToRequest'
import { buildGraphPublishedContentSurface } from '../spaghetti/outputSurface'
import { OUTPUT_PREVIEW_DEFAULT_COMPONENT_LABEL } from '../spaghetti/system/outputPreviewNode'
import type { BuildResult } from '../../shared/buildTypes'
import { newId } from '../spaghetti/utils/id'
import {
  REFERENCE_MANIFEST_CATEGORIES,
  REFERENCE_MANIFEST_ITEMS,
  USER_REFERENCE_CATEGORY_ID,
  USER_REFERENCE_CATEGORY_LABEL,
  resolveReferenceAssetPath,
  selectReferenceManifestItemsForCategory,
  type ReferenceCategoryId,
  type ReferenceTransformOverride,
  type ReferenceFileType,
  type ReferenceManifestItem,
  type ReferenceSourceKind,
} from '../references/referenceManifest'
import {
  DEFAULT_REFERENCE_ROTATE_SNAP,
  buildReferenceTimelineConfig,
  getReferenceTimelineDefaultRange,
  getReferenceTransformOverrideAxisValue,
  shiftReferenceTimelineConfig,
  type ReferenceTimelineChannelKey,
  type ReferenceTimelineConfig,
  type ReferenceTimelineMode,
  type ReferenceTimelineRange,
} from '../references/referenceTimeline'
import { appendConsoleEntry } from '../console/useConsoleStore'

type PartsVisibility = Record<string, boolean>
type BuildPolicy = 'live' | 'release' | 'manual'
export type BrowserBuildPolicy = 'live' | 'release' | 'manual' | 'off'
export type BrowserBuildExecutionTarget = {
  kind: 'graph-document'
  graphDocumentId: string
}
type ProjectFileVersion = 1
export type ProjectContentBuildState = 'rebuild' | 'building' | 'done'
export type ReferenceItemLoadState = 'unloaded' | 'loading' | 'loaded' | 'error'
export type ReferenceTransformMode = 'translate' | 'rotate' | 'scale'
export type ReferenceTransformSpace = 'local' | 'world'
export type ReferenceTransformSnapMode = ReferenceTransformMode
export type ReferenceTransformSnapAxis = 'x' | 'y' | 'z'
export type ReferenceTransformSnapAxisValues = Record<ReferenceTransformSnapAxis, number>
export type ReferenceTransformSnapSetting = {
  enabled: boolean
  xyzLocked: boolean
  values: ReferenceTransformSnapAxisValues
}
export type ReferenceTransformSnapState = Record<
  ReferenceTransformSnapMode,
  ReferenceTransformSnapSetting
>
export type ReferenceTransformHistoryEntryKind = 'move' | 'rotate' | 'scale'
export type ReferenceTransformHistoryVector = {
  x: number
  y: number
  z: number
}
export type ActiveReferenceTransformHandle =
  | {
      mode: ReferenceTransformMode
      kind: 'axis'
      axis: 'x' | 'y' | 'z'
    }
  | {
      mode: ReferenceTransformMode
      kind: 'plane'
      plane: 'xy' | 'xz' | 'yz'
    }
  | {
      mode: ReferenceTransformMode
      kind: 'center' | 'free-rotate'
    }

export type ReferenceTransformHistoryEntry = {
  entryId: string
  sessionId: string
  sessionOrdinal: number
  kind: ReferenceTransformHistoryEntryKind
  delta: ReferenceTransformHistoryVector
  after: ReferenceTransformHistoryVector
  transformAfter: ReferenceTransformOverride
  locked: boolean
}

export type ActiveReferenceTransformSession = {
  referenceId: string
  sessionId: string
  sessionOrdinal: number
  mode: ReferenceTransformMode
  space: ReferenceTransformSpace
  shellActive: boolean
  entryActive: boolean
  activeHandle: ActiveReferenceTransformHandle | null
  historyScrubIndex?: number
  draftTransform: ReferenceTransformOverride
  entryOrigin: ReferenceTransformOverride | null
}

export type ImportedReferenceRecord = {
  referenceId: string
  label: string
  fileType: ReferenceFileType
  assetPath: string
}

export type ProjectGraphDocumentEntry = {
  graphDocumentId: string
  label: string
  sourceFilePath: string | null
  orderIndex: number
}

export type ProjectFile = {
  projectFileId: string
  name: string
  version: ProjectFileVersion
  graphDocuments: ProjectGraphDocumentEntry[]
  rootAssemblyId: string | null
}

export type ProjectAssemblyRecord = {
  assemblyId: string
  label: string
  childRowIds: string[]
}

export type ProjectComponentRecord = {
  componentId: string
  ownerGraphDocumentId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string | null
  sourceNodeId: string | null
  label: string
  componentSourceKind: 'published-component' | 'receive-link'
  resolutionState: 'resolved' | 'unresolved'
  receiveId: string | null
  childObjectIds: string[]
}

export type ProjectObjectRecord = {
  objectId: string
  ownerGraphDocumentId: string
  parentComponentId: string | null
  objectSourceKind: 'published-object' | 'receive-link'
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  sourceNodeId: string | null
  slotId: string | null
  label: string
  resolutionState: 'resolved' | 'unresolved' | 'empty'
}

export type ProjectContentState = {
  assembliesById: Record<string, ProjectAssemblyRecord>
  componentsById: Record<string, ProjectComponentRecord>
  objectsById: Record<string, ProjectObjectRecord>
}

export type ProjectContentBrowserRowVm =
  | {
      rowId: string
      kind: 'assembly'
      label: string
      meta: string
      isVisible?: boolean
      visibilityPartKeys?: string[]
      buildState?: ProjectContentBuildState
      buildStateLabel?: string
      rebuildGraphDocumentIds?: string[]
      statusLabel?: string
      statusTone?: 'quiet' | 'ready' | 'warning'
    }
  | {
      rowId: string
      kind: 'sketches-root'
      label: string
      meta: string
      sketchCount: number
    }
  | {
      rowId: string
      kind: 'sketch'
      label: string
      meta: string
      isVisible: boolean
      buildState?: ProjectContentBuildState
      buildStateLabel?: string
      rebuildGraphDocumentIds?: string[]
      statusLabel?: string
      statusTone?: 'quiet' | 'ready' | 'warning'
      ownerGraphDocumentId: string
      graphDocumentId: string
      nodeId: string
      featureId: string
      plane: 'XY' | 'YZ' | 'XZ'
      componentCount: number
      profileCount: number
      diagnosticsCount: number
      authoringGraphDocumentId: string
      authoringNodeId: string
    }
  | {
      rowId: string
      kind: 'component'
      label: string
      meta: string
      isVisible?: boolean
      visibilityPartKeys?: string[]
      buildState?: ProjectContentBuildState
      buildStateLabel?: string
      rebuildGraphDocumentIds?: string[]
      statusLabel?: string
      statusTone?: 'quiet' | 'ready' | 'warning'
      ownerGraphDocumentId: string
      sourceGraphDocumentId: string
      sourceOutputEntryId: string | null
      componentSourceKind: ProjectComponentRecord['componentSourceKind']
      resolutionState: ProjectComponentRecord['resolutionState']
      receiveId: string | null
      childObjectCount: number
      slotId: string | null
      sourceNodeId: string | null
      highlightViewerKey: string | null
      authoringGraphDocumentId: string | null
      authoringNodeId: string | null
    }
  | {
      rowId: string
      kind: 'object'
      label: string
      meta: string
      isVisible?: boolean
      visibilityPartKeys?: string[]
      buildState?: ProjectContentBuildState
      buildStateLabel?: string
      rebuildGraphDocumentIds?: string[]
      statusLabel?: string
      statusTone?: 'quiet' | 'ready' | 'warning'
      ownerGraphDocumentId: string
      parentComponentId: string | null
      objectSourceKind: ProjectObjectRecord['objectSourceKind']
      sourceGraphDocumentId: string
      sourceOutputEntryId: string
      slotId: string | null
      sourceNodeId: string | null
      resolutionState: ProjectObjectRecord['resolutionState']
      highlightViewerKey: string | null
      authoringGraphDocumentId: string
      authoringNodeId: string | null
    }

export type ReferenceWorkspaceState = {
  referencesExpanded: boolean
  categoryExpandedById: Record<ReferenceCategoryId, boolean>
  visibilityById: Record<string, boolean>
  loadStateById: Record<string, ReferenceItemLoadState>
  errorById: Record<string, string | null>
  referenceLoadBatch: ReferenceLoadBatchState | null
  transformOverrideById: Record<string, ReferenceTransformOverride | null>
  channelClampRangeByReferenceId: Record<
    string,
    Partial<Record<ReferenceTimelineChannelKey, ReferenceTimelineRange>>
  >
  timelineModeByReferenceId: Record<
    string,
    Partial<Record<ReferenceTimelineChannelKey, ReferenceTimelineMode>>
  >
  timelineConfigByReferenceId: Record<
    string,
    Partial<Record<ReferenceTimelineChannelKey, ReferenceTimelineConfig>>
  >
  transformSnapByReferenceId: Record<string, ReferenceTransformSnapState>
  moveSnapDotsEnabled: boolean
  previewLastMoveSnapDotsEnabled: boolean
  moveSnapDotScale: number
  moveSnapDotDelayMs: number
  moveSnapDotNearScale: number
  moveSnapDotFarScale: number
  moveSnapDotVisibleRadiusMultiplier: number
  rotateSnapPreviewEnabled: boolean
  rotateSnapPreviewLineSize: number
  rotateSnapPreviewLineThickness: number
  rotateSnapPreviewRadiusDeg: number
  rotateSnapPreviewDelayMs: number
  transformHistoryByReferenceId: Record<string, ReferenceTransformHistoryEntry[]>
  activeReferenceTransformSession: ActiveReferenceTransformSession | null
  importedReferencesById: Record<string, ImportedReferenceRecord>
  importedReferenceOrder: string[]
}

export type ReferenceLoadBatchSource = 'root-load-all' | 'category-load-all'

export type ReferenceLoadBatchState = {
  requestId: string
  source: ReferenceLoadBatchSource
  scopeLabel: string
  targetIds: string[]
  remainingIds: string[]
  activeReferenceId: string | null
  completedIds: string[]
  failedIds: string[]
  startedAt: number
}

export type ReferenceWorkspaceBrowserItemVm = {
  rowId: string
  referenceId: string
  sourceKind: ReferenceSourceKind
  label: string
  categoryId: ReferenceCategoryId
  fileType: ReferenceFileType
  assetPath: string
  displayTransform?: ReferenceManifestItem['displayTransform']
  isVisible: boolean
  loadState: ReferenceItemLoadState
  errorMessage: string | null
  transformOverride?: ReferenceTransformOverride | null
}

export type ReferenceWorkspaceBrowserCategoryVm = {
  rowId: string
  categoryId: ReferenceCategoryId
  label: string
  isExpanded: boolean
  itemCount: number
  visibleItemCount: number
  hasLoadingItem: boolean
  hasErrorItem: boolean
  emptyLabel: string
  items: ReferenceWorkspaceBrowserItemVm[]
}

export type ReferenceWorkspaceBrowserTreeVm = {
  rowId: string
  label: string
  isExpanded: boolean
  categories: ReferenceWorkspaceBrowserCategoryVm[]
}

export type FloatingShellActivationTarget = 'spaghetti' | 'browser'

export type FloatingShellActivationRequest = {
  target: FloatingShellActivationTarget
  seq: number
}

export type WorkspaceSurface = 'console' | 'browser' | 'spaghetti' | 'viewer'

export type WorkspaceSelectedTarget =
  | {
      kind: 'graph-document'
      graphDocumentId: string
    }
  | {
      kind: 'graph-node'
      graphDocumentId: string
      nodeId: string
    }
  | {
      kind: 'references-root'
    }
  | {
      kind: 'reference-category'
      categoryId: ReferenceCategoryId
    }
  | {
      kind: 'reference-item'
      referenceId: string
    }
  | {
      kind: 'assembly'
      assemblyId: string
    }
  | {
      kind: 'component'
      componentId: string
    }
  | {
      kind: 'object'
      objectId: string
    }
  | {
      kind: 'part'
      partKey: string
    }

export type WorkspaceResolvedContentSelection = {
  rootRowId: string
  rootKind: 'assembly' | 'component' | 'object' | 'multi-select'
  partKeys: string[]
  groupedRowIds: string[]
}

export type ConsoleWorkspaceContextTarget =
  | {
      kind: 'graph-document'
      graphDocumentId: string
    }
  | {
      kind: 'graph-node'
      graphDocumentId: string
      nodeId: string
    }
  | {
      kind: 'assembly'
      assemblyId: string
      label: string
      fallbackGraphDocumentId: null
    }
  | {
      kind: 'component'
      componentId: string
      label: string
      fallbackGraphDocumentId: string | null
    }
  | {
      kind: 'object'
      objectId: string
      label: string
      fallbackGraphDocumentId: string | null
    }
  | {
      kind: 'references-root'
      label: string
      fallbackGraphDocumentId: null
      canLoadAll: boolean
      categoryOptions: Array<{
        categoryId: ReferenceCategoryId
        label: string
      }>
    }
  | {
      kind: 'reference-category'
      categoryId: ReferenceCategoryId
      label: string
      fallbackGraphDocumentId: null
      canLoadAll: boolean
    }
  | {
      kind: 'reference-item'
      referenceId: string
      label: string
      fallbackGraphDocumentId: null
      canLoadModel: boolean
      referenceCategoryId: ReferenceCategoryId
      referenceCategoryLabel: string
    }
  | {
      kind: 'multi-select'
      label: string
      fallbackGraphDocumentId: null
      selectedCount: number
      selectedLabels: string[]
    }

export type WorkspaceSelectionState = {
  selectedTarget: WorkspaceSelectedTarget | null
  explicitSelectedTargets: WorkspaceSelectedTarget[]
  selectionAnchorTarget: WorkspaceSelectedTarget | null
  resolvedContentSelection?: WorkspaceResolvedContentSelection | null
  activeSurface: WorkspaceSurface | null
}

export type ConsoleContextSyncReason =
  | 'surface-activation'
  | 'target-selection'
  | 'surface-clear'

export type ConsoleContextSyncRequest = {
  reason: ConsoleContextSyncReason
  seq: number
}

export type ReferenceTransformShellExitRequest = {
  source: 'commit-shell' | 'toolbar-close'
  seq: number
}

export type AppState = {
  lastBuildSeq: number
  geomDirty: Record<string, number>
  geomBuilt: Record<string, number>
  partsVisibility: PartsVisibility
  selectedPartKey: string | null
  buildPolicy: BuildPolicy
  browserGraphBuildPolicyByGraphDocumentId: Record<string, BrowserBuildPolicy>
  browserContentBuildPolicyByRowId: Record<string, BrowserBuildPolicy>
  browserInteractionGraphDocumentIds: Record<string, true>
  pendingBrowserBuildGraphDocumentIds: Record<string, true>
  isInteracting: boolean
  pendingBuildAfterRelease: boolean
  currentProject: ProjectFile
  projectContent: ProjectContentState
  referenceWorkspace: ReferenceWorkspaceState
  sketchVisibilityByRowId: Record<string, boolean>
  workspaceSelection: WorkspaceSelectionState
  floatingShellActivationRequest: FloatingShellActivationRequest | null
  consoleContextSyncRequest: ConsoleContextSyncRequest | null
  referenceTransformShellExitRequest: ReferenceTransformShellExitRequest | null
  workerError: string | null
  setSpaghettiGraph: (graph: SpaghettiGraph) => void
  compileGraphDocument: (graphDocumentId: string) => CompileSpaghettiGraphResult
  requestGraphDocumentBuild: (graphDocumentId: string) => CompileSpaghettiGraphResult
  compileSpaghetti: () => CompileSpaghettiGraphResult
  requestSpaghettiBuild: () => CompileSpaghettiGraphResult
  setBuildPolicy: (policy: BuildPolicy) => void
  getBrowserGraphBuildPolicy: (graphDocumentId: string) => BrowserBuildPolicy | null
  getBrowserContentBuildPolicy: (rowId: string) => BrowserBuildPolicy | null
  setBrowserGraphBuildPolicy: (graphDocumentId: string, policy: BrowserBuildPolicy) => void
  clearBrowserGraphBuildPolicy: (graphDocumentId: string) => void
  cycleBrowserGraphBuildPolicy: (
    graphDocumentId: string,
    basePolicy?: BrowserBuildPolicy,
  ) => void
  setBrowserContentBuildPolicy: (rowId: string, policy: BrowserBuildPolicy) => void
  clearBrowserContentBuildPolicy: (rowId: string) => void
  cycleBrowserContentBuildPolicy: (rowId: string, basePolicy?: BrowserBuildPolicy) => void
  beginBrowserBuildInteraction: (graphDocumentId: string) => void
  endBrowserBuildInteraction: (graphDocumentId: string) => void
  requestBrowserGraphDocumentBuild: (
    graphDocumentId: string,
    options?: {
      explicit?: boolean
    },
  ) => CompileSpaghettiGraphResult | null
  beginInteraction: () => void
  endInteraction: () => void
  requestManualBuild: () => void
  acceptBuildResult: (result: BuildResult) => void
  setWorkerError: (message: string | null) => void
  toggleReferenceWorkspaceExpanded: () => void
  toggleReferenceCategoryExpanded: (categoryId: ReferenceCategoryId) => void
  toggleReferenceItemVisibility: (referenceId: string) => void
  setReferenceItemVisibility: (referenceId: string, visible: boolean) => void
  toggleReferenceCategoryVisibility: (categoryId: ReferenceCategoryId) => void
  toggleSketchVisibility: (rowId: string) => void
  setSketchVisibility: (rowId: string, visible: boolean) => void
  addImportedReference: (reference: {
    fileName: string
    fileType: ReferenceFileType
    objectUrl: string
  }) => string
  retryReferenceItemLoad: (referenceId: string) => void
  startReferenceLoadBatchForAll: () => void
  startReferenceLoadBatchForCategory: (categoryId: ReferenceCategoryId) => void
  markReferenceBatchItemStarted: (referenceId: string, requestId: string) => void
  markReferenceBatchItemCompleted: (
    referenceId: string,
    requestId: string,
    outcome: 'loaded' | 'error',
  ) => void
  loadAllReferences: () => void
  loadReferenceCategory: (categoryId: ReferenceCategoryId) => void
  removeImportedReference: (referenceId: string) => void
  setReferenceItemLoadState: (
    referenceId: string,
    loadState: ReferenceItemLoadState,
    errorMessage?: string | null,
  ) => void
  beginReferenceTransformShell: (referenceId: string) => void
  exitReferenceTransformShell: () => void
  beginReferenceTransformEntry: (mode: ReferenceTransformMode) => void
  commitActiveReferenceTransformEntry: () => void
  setActiveReferenceTransformMode: (mode: ReferenceTransformMode) => void
  setActiveReferenceTransformSpace: (space: ReferenceTransformSpace) => void
  setActiveReferenceTransformHandle: (handle: ActiveReferenceTransformHandle | null) => void
  setActiveReferenceTransformDraft: (transformOverride: ReferenceTransformOverride | null) => void
  setReferenceTransformOverride: (
    referenceId: string,
    transformOverride: ReferenceTransformOverride | null,
  ) => void
  setActiveReferenceTransformHistoryScrubIndex: (scrubIndex: number) => void
  resetReferenceTransform: (referenceId: string) => void
  setReferenceTransformHistoryEntryDeltaValue: (
    referenceId: string,
    entryId: string,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => void
  deleteReferenceTransformHistoryEntry: (referenceId: string, entryId: string) => void
  toggleReferenceTransformHistoryLock: (referenceId: string, entryId: string) => void
  mergeReferenceTransformHistory: (referenceId: string) => void
  cancelActiveReferenceTransformEntry: () => void
  setReferenceChannelClampRange: (
    referenceId: string,
    channel: ReferenceTimelineChannelKey,
    range: ReferenceTimelineRange,
  ) => void
  setReferenceTimelineMode: (
    referenceId: string,
    channel: ReferenceTimelineChannelKey,
    mode: ReferenceTimelineMode,
    startedAtMs?: number,
  ) => void
  setReferenceTimelineSpeed: (
    referenceId: string,
    channel: ReferenceTimelineChannelKey,
    speed: number,
  ) => void
  setReferenceTimelineCycle: (
    referenceId: string,
    channel: ReferenceTimelineChannelKey,
    cycle: ReferenceTimelineConfig['cycle'],
  ) => void
  setReferenceTimelinePoints: (
    referenceId: string,
    channel: ReferenceTimelineChannelKey,
    points: ReferenceTimelineConfig['points'],
  ) => void
  setReferenceTransformSnapEnabled: (
    referenceId: string,
    mode: ReferenceTransformSnapMode,
    enabled: boolean,
  ) => void
  setReferenceTransformSnapValue: (
    referenceId: string,
    mode: ReferenceTransformSnapMode,
    value: number,
  ) => void
  setReferenceTransformSnapAxisValue: (
    referenceId: string,
    mode: ReferenceTransformSnapMode,
    axis: ReferenceTransformSnapAxis,
    value: number,
  ) => void
  setReferenceTransformSnapLocked: (
    referenceId: string,
    mode: ReferenceTransformSnapMode,
    locked: boolean,
  ) => void
  setReferenceTransformMoveSnapDotScale: (value: number) => void
  setReferenceTransformMoveSnapDotsEnabled: (enabled: boolean) => void
  setReferenceTransformPreviewLastMoveSnapDotsEnabled: (enabled: boolean) => void
  setReferenceTransformMoveSnapDotDelayMs: (value: number) => void
  setReferenceTransformMoveSnapDotNearScale: (value: number) => void
  setReferenceTransformMoveSnapDotFarScale: (value: number) => void
  setReferenceTransformMoveSnapDotVisibleRadiusMultiplier: (value: number) => void
  setReferenceTransformRotateSnapPreviewEnabled: (enabled: boolean) => void
  setReferenceTransformRotateSnapPreviewLineSize: (value: number) => void
  setReferenceTransformRotateSnapPreviewLineThickness: (value: number) => void
  setReferenceTransformRotateSnapPreviewRadiusDeg: (value: number) => void
  setReferenceTransformRotateSnapPreviewDelayMs: (value: number) => void
  setWorkspaceSelectedTarget: (target: WorkspaceSelectedTarget | null) => void
  setWorkspaceExplicitSelection: (selection: {
    selectedTarget: WorkspaceSelectedTarget | null
    explicitSelectedTargets: WorkspaceSelectedTarget[]
    selectionAnchorTarget: WorkspaceSelectedTarget | null
  }) => void
  setWorkspaceResolvedContentSelection: (
    selection: WorkspaceResolvedContentSelection | null,
  ) => void
  setActiveSurface: (surface: WorkspaceSurface | null) => void
  requestConsoleContextSync: (reason: ConsoleContextSyncReason) => void
  requestReferenceTransformShellExit: (
    source: ReferenceTransformShellExitRequest['source'],
  ) => void
  requestFloatingShellActivation: (target: FloatingShellActivationTarget) => void
  ensureVisibilityForPartKeys: (keys: string[], defaultValue?: boolean) => void
  togglePartVisibility: (partKeyStr: string) => void
  setPartVisibility: (partKeyStr: string, visible: boolean) => void
  selectPart: (partKeyStr: string | null) => void
}

const defaultVisibility: PartsVisibility = {
  baseplate: true,
  'heelKick#1': true,
  'toeHook#1': true,
}

const PROJECT_FILE_VERSION: ProjectFileVersion = 1
const INITIAL_PROJECT_FILE_ID = 'project-file-1'
const ROOT_ASSEMBLY_LABEL = 'Assembly 1'
const REFERENCE_ROOT_ROW_ID = 'reference-root'
const IMPORTED_REFERENCE_ROW_ID_PREFIX = 'reference-import'
export const DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE: ReferenceTransformSnapState = {
  translate: {
    enabled: false,
    xyzLocked: true,
    values: { x: 10, y: 10, z: 10 },
  },
  rotate: {
    enabled: DEFAULT_REFERENCE_ROTATE_SNAP.enabled,
    xyzLocked: true,
    values: {
      x: DEFAULT_REFERENCE_ROTATE_SNAP.value,
      y: DEFAULT_REFERENCE_ROTATE_SNAP.value,
      z: DEFAULT_REFERENCE_ROTATE_SNAP.value,
    },
  },
  scale: {
    enabled: false,
    xyzLocked: true,
    values: { x: 0.25, y: 0.25, z: 0.25 },
  },
}
export const buildProjectSketchesRootRowId = (projectFileId: string): string =>
  `project-sketches-root:${projectFileId}`
export const buildProjectSketchBrowserRowId = (
  graphDocumentId: string,
  nodeId: string,
  featureId: string,
): string => `project-sketch:${graphDocumentId}:${nodeId}:${featureId}`
const DEFAULT_COLLAPSED_REFERENCE_CATEGORY_IDS: ReferenceCategoryId[] = [
  'footpads',
  'shoes',
  'premade-foothooks',
]

const isExplicitWorkspaceSelectionTarget = (
  target: WorkspaceSelectedTarget | null,
): target is Extract<
  WorkspaceSelectedTarget,
  | { kind: 'references-root' }
  | { kind: 'reference-category' }
  | { kind: 'reference-item' }
  | { kind: 'assembly' }
  | { kind: 'component' }
  | { kind: 'object' }
> =>
  target !== null &&
  (target.kind === 'references-root' ||
    target.kind === 'reference-category' ||
    target.kind === 'reference-item' ||
    target.kind === 'assembly' ||
    target.kind === 'component' ||
    target.kind === 'object')

const getWorkspaceSelectedTargetKey = (target: WorkspaceSelectedTarget): string => {
  switch (target.kind) {
    case 'graph-document':
      return `graph-document:${target.graphDocumentId}`
    case 'graph-node':
      return `graph-node:${target.graphDocumentId}:${target.nodeId}`
    case 'references-root':
      return 'references-root'
    case 'reference-category':
      return `reference-category:${target.categoryId}`
    case 'reference-item':
      return `reference-item:${target.referenceId}`
    case 'assembly':
      return `assembly:${target.assemblyId}`
    case 'component':
      return `component:${target.componentId}`
    case 'object':
      return `object:${target.objectId}`
    case 'part':
      return `part:${target.partKey}`
  }
}

const areWorkspaceSelectedTargetsEqual = (
  left: WorkspaceSelectedTarget | null,
  right: WorkspaceSelectedTarget | null,
): boolean => {
  if (left === right) {
    return true
  }
  if (left === null || right === null) {
    return false
  }
  return getWorkspaceSelectedTargetKey(left) === getWorkspaceSelectedTargetKey(right)
}

export const buildObjectPartKeys = (objectRecord: ProjectObjectRecord): string[] =>
  objectRecord.slotId === null
    ? []
    : [objectRecord.slotId, `${objectRecord.ownerGraphDocumentId}:${objectRecord.slotId}`]

export const resolveSingleTargetContentSelection = (
  state: Pick<AppState, 'projectContent'>,
  target: WorkspaceSelectedTarget,
): WorkspaceResolvedContentSelection | null => {
  if (target.kind === 'object') {
    const objectRecord = state.projectContent.objectsById[target.objectId]
    if (objectRecord === undefined) {
      return null
    }
    return {
      rootRowId: objectRecord.objectId,
      rootKind: 'object',
      partKeys: buildObjectPartKeys(objectRecord),
      groupedRowIds: [],
    }
  }

  if (target.kind === 'component') {
    const componentRecord = state.projectContent.componentsById[target.componentId]
    if (componentRecord === undefined) {
      return null
    }
    const partKeySet = new Set<string>()
    const groupedRowIds: string[] = []
    for (const objectId of componentRecord.childObjectIds) {
      groupedRowIds.push(objectId)
      const objectRecord = state.projectContent.objectsById[objectId]
      if (objectRecord === undefined) {
        continue
      }
      buildObjectPartKeys(objectRecord).forEach((partKey) => partKeySet.add(partKey))
    }
    return {
      rootRowId: componentRecord.componentId,
      rootKind: 'component',
      partKeys: [...partKeySet],
      groupedRowIds,
    }
  }

  if (target.kind !== 'assembly') {
    return null
  }

  const assemblyRecord = state.projectContent.assembliesById[target.assemblyId]
  if (assemblyRecord === undefined) {
    return null
  }
  const partKeySet = new Set<string>()
  const groupedRowIds: string[] = []
  for (const childRowId of assemblyRecord.childRowIds) {
    const componentRecord = state.projectContent.componentsById[childRowId]
    if (componentRecord !== undefined) {
      groupedRowIds.push(componentRecord.componentId)
      for (const objectId of componentRecord.childObjectIds) {
        groupedRowIds.push(objectId)
        const objectRecord = state.projectContent.objectsById[objectId]
        if (objectRecord === undefined) {
          continue
        }
        buildObjectPartKeys(objectRecord).forEach((partKey) => partKeySet.add(partKey))
      }
      continue
    }
    const objectRecord = state.projectContent.objectsById[childRowId]
    if (objectRecord === undefined) {
      continue
    }
    groupedRowIds.push(objectRecord.objectId)
    buildObjectPartKeys(objectRecord).forEach((partKey) => partKeySet.add(partKey))
  }
  return {
    rootRowId: assemblyRecord.assemblyId,
    rootKind: 'assembly',
    partKeys: [...partKeySet],
    groupedRowIds,
  }
}

const resolveExplicitContentSelection = (
  state: Pick<AppState, 'projectContent'>,
  selectedTarget: WorkspaceSelectedTarget | null,
  explicitSelectedTargets: WorkspaceSelectedTarget[],
): WorkspaceResolvedContentSelection | null => {
  const explicitContentTargets = explicitSelectedTargets.filter(
    (target): target is Extract<
      WorkspaceSelectedTarget,
      { kind: 'assembly' } | { kind: 'component' } | { kind: 'object' }
    > =>
      target.kind === 'assembly' || target.kind === 'component' || target.kind === 'object',
  )

  if (explicitContentTargets.length === 0) {
    return null
  }

  if (explicitSelectedTargets.length === 1) {
    return resolveSingleTargetContentSelection(state, explicitContentTargets[0])
  }

  const partKeySet = new Set<string>()
  const groupedRowIdSet = new Set<string>()
  for (const target of explicitContentTargets) {
    const selection = resolveSingleTargetContentSelection(state, target)
    if (selection === null) {
      continue
    }
    selection.partKeys.forEach((partKey) => partKeySet.add(partKey))
    selection.groupedRowIds.forEach((rowId) => groupedRowIdSet.add(rowId))
  }

  if (partKeySet.size === 0 && groupedRowIdSet.size === 0) {
    return null
  }

  return {
    rootRowId:
      selectedTarget !== null &&
      (selectedTarget.kind === 'assembly' ||
        selectedTarget.kind === 'component' ||
        selectedTarget.kind === 'object')
        ? getWorkspaceSelectedTargetKey(selectedTarget)
        : 'multi-select',
    rootKind: 'multi-select',
    partKeys: [...partKeySet],
    groupedRowIds: [...groupedRowIdSet],
  }
}

const createInitialReferenceWorkspaceState = (): ReferenceWorkspaceState => ({
  referencesExpanded: true,
  categoryExpandedById: Object.fromEntries(
    [...REFERENCE_MANIFEST_CATEGORIES.map((category) => category.categoryId), USER_REFERENCE_CATEGORY_ID].map(
      (categoryId) => [
        categoryId,
        !DEFAULT_COLLAPSED_REFERENCE_CATEGORY_IDS.includes(categoryId),
      ],
    ),
  ) as Record<ReferenceCategoryId, boolean>,
  visibilityById: Object.fromEntries(
    REFERENCE_MANIFEST_ITEMS.map((item) => [item.referenceId, false]),
  ) as Record<string, boolean>,
  loadStateById: Object.fromEntries(
    REFERENCE_MANIFEST_ITEMS.map((item) => [item.referenceId, 'unloaded']),
  ) as Record<string, ReferenceItemLoadState>,
  errorById: Object.fromEntries(
    REFERENCE_MANIFEST_ITEMS.map((item) => [item.referenceId, null]),
  ) as Record<string, string | null>,
  referenceLoadBatch: null,
  transformOverrideById: {},
  channelClampRangeByReferenceId: {},
  timelineModeByReferenceId: {},
  timelineConfigByReferenceId: {},
  transformSnapByReferenceId: {},
  moveSnapDotsEnabled: true,
  previewLastMoveSnapDotsEnabled: false,
  moveSnapDotScale: 1,
  moveSnapDotDelayMs: 120,
  moveSnapDotNearScale: 1.45,
  moveSnapDotFarScale: 0.04,
  moveSnapDotVisibleRadiusMultiplier: 40,
  rotateSnapPreviewEnabled: true,
  rotateSnapPreviewLineSize: 1,
  rotateSnapPreviewLineThickness: 1,
  rotateSnapPreviewRadiusDeg: 60,
  rotateSnapPreviewDelayMs: 120,
  transformHistoryByReferenceId: {},
  activeReferenceTransformSession: null,
  importedReferencesById: {},
  importedReferenceOrder: [],
})

const buildDefaultReferenceTransformOverride = (): ReferenceTransformOverride => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

const cloneReferenceTransformSnapState = (
  value: ReferenceTransformSnapState = DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE,
): ReferenceTransformSnapState => ({
  translate: {
    ...value.translate,
    values: { ...value.translate.values },
  },
  rotate: {
    ...value.rotate,
    values: { ...value.rotate.values },
  },
  scale: {
    ...value.scale,
    values: { ...value.scale.values },
  },
})

type LegacyReferenceTransformSnapSetting = {
  enabled?: boolean
  value?: number
}

const normalizeReferenceTransformSnapSetting = (
  value: ReferenceTransformSnapSetting | LegacyReferenceTransformSnapSetting | undefined,
  fallback: ReferenceTransformSnapSetting,
): ReferenceTransformSnapSetting => {
  if (
    value !== undefined &&
    typeof value === 'object' &&
    'values' in value &&
    value.values !== null &&
    typeof value.values === 'object'
  ) {
    const values = value.values as Partial<Record<ReferenceTransformSnapAxis, unknown>>
    return {
      enabled: value.enabled ?? fallback.enabled,
      xyzLocked: value.xyzLocked ?? true,
      values: {
        x: typeof values.x === 'number' ? values.x : fallback.values.x,
        y: typeof values.y === 'number' ? values.y : fallback.values.y,
        z: typeof values.z === 'number' ? values.z : fallback.values.z,
      },
    }
  }
  const legacySetting = value as LegacyReferenceTransformSnapSetting | undefined
  const legacyValue =
    typeof legacySetting?.value === 'number' && Number.isFinite(legacySetting.value)
      ? legacySetting.value
      : fallback.values.x
  return {
    enabled:
      value !== undefined && typeof value === 'object' && typeof value.enabled === 'boolean'
        ? value.enabled
        : fallback.enabled,
    xyzLocked: true,
    values: {
      x: legacyValue,
      y: legacyValue,
      z: legacyValue,
    },
  }
}

const normalizeReferenceTransformSnapState = (
  value: Partial<Record<ReferenceTransformSnapMode, ReferenceTransformSnapSetting | LegacyReferenceTransformSnapSetting>> | undefined,
): ReferenceTransformSnapState => ({
  translate: normalizeReferenceTransformSnapSetting(value?.translate, DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE.translate),
  rotate: normalizeReferenceTransformSnapSetting(value?.rotate, DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE.rotate),
  scale: normalizeReferenceTransformSnapSetting(value?.scale, DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE.scale),
})

const setAllReferenceTransformSnapAxes = (
  value: number,
): ReferenceTransformSnapAxisValues => ({
  x: value,
  y: value,
  z: value,
})

const scaleReferenceTransformSnapAxisValues = (
  currentValues: ReferenceTransformSnapAxisValues,
  axis: ReferenceTransformSnapAxis,
  nextValue: number,
): ReferenceTransformSnapAxisValues => {
  const baseline = currentValues[axis]
  if (Math.abs(baseline) < 0.000001) {
    return {
      ...currentValues,
      [axis]: nextValue,
    }
  }
  const scaleFactor = nextValue / baseline
  return {
    x:
      axis === 'x'
        ? nextValue
        : Math.abs(currentValues.x) < 0.000001
          ? 0
          : Number((currentValues.x * scaleFactor).toFixed(4)),
    y:
      axis === 'y'
        ? nextValue
        : Math.abs(currentValues.y) < 0.000001
          ? 0
          : Number((currentValues.y * scaleFactor).toFixed(4)),
    z:
      axis === 'z'
        ? nextValue
        : Math.abs(currentValues.z) < 0.000001
          ? 0
          : Number((currentValues.z * scaleFactor).toFixed(4)),
  }
}

const getReferenceTransformSnapDriverValue = (value: ReferenceTransformSnapSetting): number =>
  value.values.x

type LegacyReferenceTransformHistoryEntry = Omit<
  ReferenceTransformHistoryEntry,
  'delta' | 'after' | 'transformAfter'
> & {
  value: ReferenceTransformHistoryVector
}

type ReferenceTransformHistoryEntryDraft = Omit<
  ReferenceTransformHistoryEntry,
  'transformAfter'
>

type ReferenceTransformHistoryEntryLike =
  | ReferenceTransformHistoryEntry
  | ReferenceTransformHistoryEntryDraft
  | LegacyReferenceTransformHistoryEntry

const cloneReferenceTransformVector = (
  value: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryVector => ({
  x: value.x,
  y: value.y,
  z: value.z,
})

const addReferenceTransformVectors = (
  left: ReferenceTransformHistoryVector,
  right: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryVector => ({
  x: left.x + right.x,
  y: left.y + right.y,
  z: left.z + right.z,
})

const subtractReferenceTransformVectors = (
  left: ReferenceTransformHistoryVector,
  right: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryVector => ({
  x: left.x - right.x,
  y: left.y - right.y,
  z: left.z - right.z,
})

const buildReferenceTransformHistoryIdentityVector = (
  kind: ReferenceTransformHistoryEntryKind,
): ReferenceTransformHistoryVector =>
  kind === 'scale' ? { x: 1, y: 1, z: 1 } : { x: 0, y: 0, z: 0 }

const getReferenceTransformHistoryVectorRange = (
  kind: ReferenceTransformHistoryEntryKind,
): { min: number; max: number } => {
  switch (kind) {
    case 'move':
      return { min: -300, max: 300 }
    case 'rotate':
      return { min: -180, max: 180 }
    case 'scale':
      return { min: 0.01, max: 10 }
  }
}

const clampReferenceTransformHistoryVector = (
  kind: ReferenceTransformHistoryEntryKind,
  value: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryVector => {
  const range = getReferenceTransformHistoryVectorRange(kind)
  return {
    x: Math.min(range.max, Math.max(range.min, value.x)),
    y: Math.min(range.max, Math.max(range.min, value.y)),
    z: Math.min(range.max, Math.max(range.min, value.z)),
  }
}

const cloneReferenceTransformHistoryEntry = (
  entry: ReferenceTransformHistoryEntry,
): ReferenceTransformHistoryEntry => ({
  ...entry,
  delta: cloneReferenceTransformVector(entry.delta),
  after: cloneReferenceTransformVector(entry.after),
  transformAfter:
    cloneReferenceTransformOverride(entry.transformAfter) ??
    buildDefaultReferenceTransformOverride(),
})

const cloneReferenceTransformOverride = (
  value: ReferenceTransformOverride | null,
): ReferenceTransformOverride | null =>
  value === null
    ? null
    : {
        position: { ...value.position },
        rotationDeg: { ...value.rotationDeg },
        scale: { ...value.scale },
      }

const cloneActiveReferenceTransformSession = (
  value: ActiveReferenceTransformSession | null,
): ActiveReferenceTransformSession | null =>
  value === null
    ? null
    : {
        referenceId: value.referenceId,
        sessionId: value.sessionId,
        sessionOrdinal: value.sessionOrdinal,
        mode: value.mode,
        space: value.space,
        shellActive: value.shellActive,
        entryActive: value.entryActive,
        activeHandle: value.activeHandle === null ? null : { ...value.activeHandle },
        historyScrubIndex: value.historyScrubIndex,
        draftTransform:
          cloneReferenceTransformOverride(value.draftTransform) ??
          buildDefaultReferenceTransformOverride(),
        entryOrigin: cloneReferenceTransformOverride(value.entryOrigin),
      }

const areReferenceTransformOverridesEqual = (
  left: ReferenceTransformOverride | null,
  right: ReferenceTransformOverride | null,
): boolean => {
  if (left === right) {
    return true
  }
  if (left === null || right === null) {
    return false
  }
  return (
    areReferenceTransformVectorsEqual(left.position, right.position) &&
    areReferenceTransformVectorsEqual(left.rotationDeg, right.rotationDeg) &&
    areReferenceTransformVectorsEqual(left.scale, right.scale)
  )
}

const areReferenceTransformVectorsEqual = (
  left: ReferenceTransformHistoryVector,
  right: ReferenceTransformHistoryVector,
): boolean => left.x === right.x && left.y === right.y && left.z === right.z

const getReferenceTransformHistoryEntryAfterValue = (
  transformOverride: ReferenceTransformOverride | null,
  kind: ReferenceTransformHistoryEntryKind,
): ReferenceTransformHistoryVector => {
  const current = transformOverride ?? buildDefaultReferenceTransformOverride()
  switch (kind) {
    case 'move':
      return cloneReferenceTransformVector(current.position)
    case 'rotate':
      return cloneReferenceTransformVector(current.rotationDeg)
    case 'scale':
      return cloneReferenceTransformVector(current.scale)
  }
}

const isLegacyReferenceTransformHistoryEntry = (
  entry: ReferenceTransformHistoryEntryLike,
): entry is LegacyReferenceTransformHistoryEntry => 'value' in entry

const buildReferenceTransformHistoryOverrideAfter = (
  currentTransform: ReferenceTransformOverride,
  kind: ReferenceTransformHistoryEntryKind,
  after: ReferenceTransformHistoryVector,
): ReferenceTransformOverride => {
  const nextTransform = cloneReferenceTransformOverride(currentTransform) ??
    buildDefaultReferenceTransformOverride()
  switch (kind) {
    case 'move':
      nextTransform.position = cloneReferenceTransformVector(after)
      break
    case 'rotate':
      nextTransform.rotationDeg = cloneReferenceTransformVector(after)
      break
    case 'scale':
      nextTransform.scale = cloneReferenceTransformVector(after)
      break
  }
  return nextTransform
}

export const normalizeReferenceTransformHistoryEntries = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
): ReferenceTransformHistoryEntry[] => {
  let currentTransform = buildDefaultReferenceTransformOverride()
  return entries.map((entry) => {
    const before = getReferenceTransformHistoryEntryAfterValue(currentTransform, entry.kind)
    const after = isLegacyReferenceTransformHistoryEntry(entry)
      ? clampReferenceTransformHistoryVector(entry.kind, entry.value)
      : clampReferenceTransformHistoryVector(
          entry.kind,
          addReferenceTransformVectors(before, entry.delta),
        )
    currentTransform = buildReferenceTransformHistoryOverrideAfter(currentTransform, entry.kind, after)
    const nextEntry: ReferenceTransformHistoryEntry = {
      entryId: entry.entryId,
      sessionId: entry.sessionId,
      sessionOrdinal: entry.sessionOrdinal,
      kind: entry.kind,
      delta: subtractReferenceTransformVectors(after, before),
      after,
      transformAfter:
        cloneReferenceTransformOverride(currentTransform) ??
        buildDefaultReferenceTransformOverride(),
      locked: entry.locked,
    }
    return nextEntry
  })
}

const resolveReferenceTransformHistoryKind = (
  mode: ReferenceTransformMode,
): ReferenceTransformHistoryEntryKind => {
  switch (mode) {
    case 'rotate':
      return 'rotate'
    case 'scale':
      return 'scale'
    case 'translate':
      return 'move'
  }
}

const getNextReferenceTransformSessionOrdinal = (
  entries: readonly ReferenceTransformHistoryEntry[],
): number => {
  const maxSessionOrdinal = entries.reduce(
    (currentMax, entry) => Math.max(currentMax, entry.sessionOrdinal),
    0,
  )
  return maxSessionOrdinal + 1
}

const clampReferenceTransformHistoryScrubIndex = (
  scrubIndex: number,
  entryCount: number,
): number =>
  Math.min(entryCount, Math.max(0, Math.trunc(scrubIndex)))

const resolveReferenceTransformHistoryScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number | null | undefined,
): number => {
  const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(entries)
  if (scrubIndex === null || scrubIndex === undefined || !Number.isFinite(scrubIndex)) {
    return latestScrubIndex
  }
  return clampReferenceTransformHistoryScrubIndex(scrubIndex, latestScrubIndex)
}

export const getReferenceTransformHistoryLatestScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
): number => normalizeReferenceTransformHistoryEntries(entries).length

export const getReferenceTransformHistoryEntriesThroughScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number,
): ReferenceTransformHistoryEntry[] => {
  const normalizedEntries = normalizeReferenceTransformHistoryEntries(entries)
  return normalizedEntries
    .slice(0, clampReferenceTransformHistoryScrubIndex(scrubIndex, normalizedEntries.length))
    .map(cloneReferenceTransformHistoryEntry)
}

export const getReferenceTransformHistoryTransformAtScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number,
): ReferenceTransformOverride => {
  const effectiveEntries = getReferenceTransformHistoryEntriesThroughScrubIndex(entries, scrubIndex)
  const lastEntry = effectiveEntries.at(-1)
  return lastEntry === undefined
    ? buildDefaultReferenceTransformOverride()
    : cloneReferenceTransformOverride(lastEntry.transformAfter) ??
        buildDefaultReferenceTransformOverride()
}

export const insertReferenceTransformHistoryEntryAtScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number,
  sessionId: string,
  sessionOrdinal: number,
  kind: ReferenceTransformHistoryEntryKind,
  after: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryEntry[] => {
  const normalizedEntries = normalizeReferenceTransformHistoryEntries(entries)
  const clampedScrubIndex = clampReferenceTransformHistoryScrubIndex(scrubIndex, normalizedEntries.length)
  const previousTransform = getReferenceTransformHistoryTransformAtScrubIndex(
    normalizedEntries,
    clampedScrubIndex,
  )
  const previousAfter = getReferenceTransformHistoryEntryAfterValue(previousTransform, kind)
  const nextAfter = clampReferenceTransformHistoryVector(kind, after)
  if (areReferenceTransformVectorsEqual(previousAfter, nextAfter)) {
    return normalizedEntries.map(cloneReferenceTransformHistoryEntry)
  }
  const nextDelta = subtractReferenceTransformVectors(nextAfter, previousAfter)
  const insertedEntry: ReferenceTransformHistoryEntryDraft = {
    entryId: newId('reference-transform-history'),
    sessionId,
    sessionOrdinal,
    kind,
    delta: nextDelta,
    after: nextAfter,
    locked: false,
  }
  return normalizeReferenceTransformHistoryEntries([
    ...normalizedEntries.slice(0, clampedScrubIndex),
    insertedEntry,
    ...normalizedEntries.slice(clampedScrubIndex),
  ])
}

const mergeReferenceTransformHistoryEntries = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
): ReferenceTransformHistoryEntry[] => {
  const normalizedEntries = normalizeReferenceTransformHistoryEntries(entries)
  if (normalizedEntries.length <= 1) {
    return normalizedEntries.map(cloneReferenceTransformHistoryEntry)
  }
  const preservedEntries: Array<{ sortIndex: number; entry: ReferenceTransformHistoryEntryLike }> = []
  const unlockedDeltaByKind = new Map<ReferenceTransformHistoryEntryKind, ReferenceTransformHistoryVector>()
  const lastUnlockedEntryByKind = new Map<ReferenceTransformHistoryEntryKind, ReferenceTransformHistoryEntry>()
  normalizedEntries.forEach((entry, index) => {
    if (entry.locked) {
      preservedEntries.push({
        sortIndex: index,
        entry: cloneReferenceTransformHistoryEntry(entry),
      })
      return
    }
    const currentDelta =
      unlockedDeltaByKind.get(entry.kind) ?? { x: 0, y: 0, z: 0 }
    unlockedDeltaByKind.set(entry.kind, addReferenceTransformVectors(currentDelta, entry.delta))
    lastUnlockedEntryByKind.set(entry.kind, entry)
  })
  for (const [kind, delta] of unlockedDeltaByKind.entries()) {
    const template = lastUnlockedEntryByKind.get(kind)
    if (template === undefined) {
      continue
    }
    preservedEntries.push({
      sortIndex: normalizedEntries.findIndex((entry) => entry.entryId === template.entryId),
      entry: {
        entryId: template.entryId,
        sessionId: template.sessionId,
        sessionOrdinal: template.sessionOrdinal,
        kind,
        delta: cloneReferenceTransformVector(delta),
        after: buildReferenceTransformHistoryIdentityVector(kind),
        locked: false,
      },
    })
  }
  return normalizeReferenceTransformHistoryEntries(
    preservedEntries
      .sort((left, right) => left.sortIndex - right.sortIndex)
      .map(({ entry }) => entry),
  )
}

const applyReferenceTransformHistoryEntriesToOverride = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
): ReferenceTransformOverride => {
  const normalizedEntries = normalizeReferenceTransformHistoryEntries(entries)
  const lastEntry = normalizedEntries.at(-1)
  return lastEntry === undefined
    ? buildDefaultReferenceTransformOverride()
    : cloneReferenceTransformOverride(lastEntry.transformAfter) ??
        buildDefaultReferenceTransformOverride()
}

const getReferenceChannelClampRange = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
  channel: ReferenceTimelineChannelKey,
): ReferenceTimelineRange =>
  referenceWorkspace.channelClampRangeByReferenceId[referenceId]?.[channel] ??
  getReferenceTimelineDefaultRange(channel)

const getReferenceTimelineMode = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
  channel: ReferenceTimelineChannelKey,
): ReferenceTimelineMode =>
  referenceWorkspace.timelineModeByReferenceId[referenceId]?.[channel] ?? 'basic'

const getReferenceTransformSnapState = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
): ReferenceTransformSnapState =>
  normalizeReferenceTransformSnapState(referenceWorkspace.transformSnapByReferenceId[referenceId])

const applyReferenceTransformTimelineDeltas = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
  previousTransformOverride: ReferenceTransformOverride | null | undefined,
  nextTransformOverride: ReferenceTransformOverride | null | undefined,
): Record<string, Partial<Record<ReferenceTimelineChannelKey, ReferenceTimelineConfig>>> => {
  const nextTimelineConfigByReferenceId = { ...referenceWorkspace.timelineConfigByReferenceId }
  const channels: ReferenceTimelineChannelKey[] = [
    'move-x',
    'move-y',
    'move-z',
    'rotate-x',
    'rotate-y',
    'rotate-z',
    'scale-x',
    'scale-y',
    'scale-z',
  ]

  for (const channel of channels) {
    if (getReferenceTimelineMode(referenceWorkspace, referenceId, channel) !== 'timeline') {
      continue
    }
    const previousValue = getReferenceTransformOverrideAxisValue(previousTransformOverride, channel)
    const nextValue = getReferenceTransformOverrideAxisValue(nextTransformOverride, channel)
    const delta = nextValue - previousValue
    if (Math.abs(delta) < 0.000001) {
      continue
    }
    const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.[channel]
    if (existingConfig === undefined) {
      continue
    }
    const nextReferenceConfigs = {
      ...(nextTimelineConfigByReferenceId[referenceId] ?? {}),
      [channel]: shiftReferenceTimelineConfig(
        existingConfig,
        delta,
        getReferenceChannelClampRange(referenceWorkspace, referenceId, channel),
      ),
    }
    nextTimelineConfigByReferenceId[referenceId] = nextReferenceConfigs
  }

  return nextTimelineConfigByReferenceId
}

const buildImportedReferenceId = (): string =>
  `${IMPORTED_REFERENCE_ROW_ID_PREFIX}:${newId('imported-reference')}`

const buildImportedReferenceLabel = (
  fileName: string,
  existingLabels: readonly string[],
): string => {
  if (!existingLabels.includes(fileName)) {
    return fileName
  }

  let duplicateOrdinal = 2
  while (existingLabels.includes(`${fileName} (${duplicateOrdinal})`)) {
    duplicateOrdinal += 1
  }
  return `${fileName} (${duplicateOrdinal})`
}

const getReferenceIdsForCategory = (
  referenceWorkspace: ReferenceWorkspaceState,
  categoryId: ReferenceCategoryId,
): string[] => {
  if (categoryId === USER_REFERENCE_CATEGORY_ID) {
    return referenceWorkspace.importedReferenceOrder.filter(
      (referenceId) => referenceWorkspace.importedReferencesById[referenceId] !== undefined,
    )
  }
  return selectReferenceManifestItemsForCategory(categoryId).map((item) => item.referenceId)
}

const getOrderedReferenceIds = (referenceWorkspace: ReferenceWorkspaceState): string[] =>
  selectReferenceWorkspaceBrowserTree({ referenceWorkspace }).categories.flatMap((category) =>
    category.items.map((item) => item.referenceId),
  )

let referenceLoadBatchRequestCounter = 0

const buildReferenceLoadBatchRequestId = (): string => {
  referenceLoadBatchRequestCounter += 1
  return `reference-load-batch:${referenceLoadBatchRequestCounter}`
}

const dedupeReferenceIds = (referenceIds: readonly string[]): string[] => Array.from(new Set(referenceIds))

const filterReferenceLoadBatch = (
  batch: ReferenceLoadBatchState | null,
  excludedIds: readonly string[],
): ReferenceLoadBatchState | null => {
  if (batch === null || excludedIds.length === 0) {
    return batch
  }
  const excludedIdSet = new Set(excludedIds)
  const activeReferenceId =
    batch.activeReferenceId !== null && excludedIdSet.has(batch.activeReferenceId)
      ? batch.activeReferenceId
      : batch.activeReferenceId
  const targetIds = batch.targetIds.filter(
    (referenceId) => referenceId === activeReferenceId || !excludedIdSet.has(referenceId),
  )
  const remainingIds = batch.remainingIds.filter((referenceId) => !excludedIdSet.has(referenceId))
  const completedIds = batch.completedIds.filter((referenceId) => !excludedIdSet.has(referenceId))
  const failedIds = batch.failedIds.filter((referenceId) => !excludedIdSet.has(referenceId))
  if (targetIds.length === 0 && activeReferenceId === null) {
    return null
  }
  return {
    ...batch,
    targetIds,
    remainingIds,
    completedIds,
    failedIds,
  }
}

const createReferenceLoadBatch = (
  referenceWorkspace: ReferenceWorkspaceState,
  targetIds: readonly string[],
  source: ReferenceLoadBatchSource,
  scopeLabel: string,
): {
  referenceWorkspace: ReferenceWorkspaceState
  referenceLoadBatch: ReferenceLoadBatchState | null
} => {
  const dedupedTargetIds = dedupeReferenceIds(targetIds)
  const nextVisibilityById = { ...referenceWorkspace.visibilityById }
  const nextLoadStateById = { ...referenceWorkspace.loadStateById }
  const nextErrorById = { ...referenceWorkspace.errorById }

  dedupedTargetIds.forEach((referenceId) => {
    nextVisibilityById[referenceId] = true
    if ((nextLoadStateById[referenceId] ?? 'unloaded') === 'error') {
      nextLoadStateById[referenceId] = 'unloaded'
      nextErrorById[referenceId] = null
    }
  })

  const existingBatch = referenceWorkspace.referenceLoadBatch
  const carriedActiveReferenceId = existingBatch?.activeReferenceId ?? null
  const actionableTargetIds = dedupedTargetIds.filter((referenceId) => {
    if (referenceId === carriedActiveReferenceId) {
      return false
    }
    return (nextLoadStateById[referenceId] ?? 'unloaded') !== 'loaded'
  })
  const completedIds: string[] = []
  const remainingIds = actionableTargetIds.filter((referenceId) => {
    if (referenceId === carriedActiveReferenceId) {
      return false
    }
    return (nextLoadStateById[referenceId] ?? 'unloaded') === 'unloaded'
  })

  const nextReferenceWorkspace: ReferenceWorkspaceState = {
    ...referenceWorkspace,
    visibilityById: nextVisibilityById,
    loadStateById: nextLoadStateById,
    errorById: nextErrorById,
    referenceLoadBatch:
      actionableTargetIds.length === 0 && carriedActiveReferenceId === null
        ? null
        : {
            requestId: buildReferenceLoadBatchRequestId(),
            source,
            scopeLabel,
            targetIds: actionableTargetIds,
            remainingIds,
            activeReferenceId: carriedActiveReferenceId,
            completedIds,
            failedIds: [],
            startedAt: Date.now(),
          },
  }

  return {
    referenceWorkspace: nextReferenceWorkspace,
    referenceLoadBatch: nextReferenceWorkspace.referenceLoadBatch,
  }
}

const clearActiveReferenceTransformIfMatches = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceIds: readonly string[],
): Pick<ReferenceWorkspaceState, 'activeReferenceTransformSession'> => ({
  activeReferenceTransformSession:
    referenceWorkspace.activeReferenceTransformSession === null ||
    !referenceIds.includes(referenceWorkspace.activeReferenceTransformSession.referenceId)
      ? cloneActiveReferenceTransformSession(referenceWorkspace.activeReferenceTransformSession)
      : null,
})

const buildRootAssemblyId = (projectFileId: string): string =>
  `assembly-root:${projectFileId}`

const buildProjectPublishedComponentId = (
  projectFileId: string,
  graphDocumentId: string,
): string => `project-component:${projectFileId}:${graphDocumentId}:published`

const buildProjectObjectId = (
  projectFileId: string,
  graphDocumentId: string,
  objectId: string,
): string => `project-object:${projectFileId}:${graphDocumentId}:${objectId}`

const buildProjectReceiveObjectId = (
  projectFileId: string,
  ownerGraphDocumentId: string,
  receiveId: string,
): string => `project-object:${projectFileId}:receive:${ownerGraphDocumentId}:${receiveId}`

const toProjectGraphDocumentEntry = (
  document: Pick<GraphDocument, 'graphDocumentId' | 'name'>,
  orderIndex: number,
): ProjectGraphDocumentEntry => ({
  graphDocumentId: document.graphDocumentId,
  label: document.name,
  sourceFilePath: null,
  orderIndex,
})

const buildProjectGraphDocuments = (
  spaghettiState: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'graphDocumentOrder'>,
): ProjectGraphDocumentEntry[] =>
  selectOrderedGraphDocuments(spaghettiState).map((document, orderIndex) =>
    toProjectGraphDocumentEntry(document, orderIndex),
  )

const createInitialProjectFile = (): ProjectFile => ({
  projectFileId: INITIAL_PROJECT_FILE_ID,
  name: 'Project 1',
  version: PROJECT_FILE_VERSION,
  graphDocuments: buildProjectGraphDocuments(useSpaghettiStore.getState()),
  rootAssemblyId: buildRootAssemblyId(INITIAL_PROJECT_FILE_ID),
})

const buildProjectContentState = (
  project: ProjectFile,
  spaghettiState: Pick<
    SpaghettiStoreState,
    'graphDocumentsById' | 'graphDocumentOrder' | 'graphRuntimeByDocumentId'
  >,
  browserPolicyState?: Pick<
    AppState,
    | 'currentProject'
    | 'projectContent'
    | 'browserGraphBuildPolicyByGraphDocumentId'
    | 'browserContentBuildPolicyByRowId'
  >,
): ProjectContentState => {
  const rootAssemblyId = project.rootAssemblyId ?? buildRootAssemblyId(project.projectFileId)
  const childRowIds: string[] = []
  const componentsById: Record<string, ProjectComponentRecord> = {}
  const objectsById: Record<string, ProjectObjectRecord> = {}
  let publishedComponentOrdinal = 0

  for (const documentEntry of project.graphDocuments) {
    const graphDocument = spaghettiState.graphDocumentsById[documentEntry.graphDocumentId]
    const suppressRuntimeOutput =
      browserPolicyState === undefined
        ? false
        : selectShouldSuppressBrowserGraphRuntimeOutput(
            browserPolicyState,
            documentEntry.graphDocumentId,
          )
    const outputSurface = suppressRuntimeOutput
      ? null
      : selectGraphRuntimeByDocumentId(spaghettiState, documentEntry.graphDocumentId)?.outputSurface
    const publishedContentSurface =
      graphDocument === undefined
        ? null
        : buildGraphPublishedContentSurface({
            graphDocumentId: documentEntry.graphDocumentId,
            graph: graphDocument.graph,
            outputSurface,
          })

    if (
      publishedContentSurface !== null &&
      outputSurface !== null &&
      publishedContentSurface.rows.length > 0
    ) {
      for (const publishedRow of publishedContentSurface.rows) {
        if (publishedRow.kind === 'object') {
          const objectRow = publishedRow.object
          const objectId = buildProjectObjectId(
            project.projectFileId,
            documentEntry.graphDocumentId,
            objectRow.objectId,
          )
          childRowIds.push(objectId)
          objectsById[objectId] = {
            objectId,
            ownerGraphDocumentId: documentEntry.graphDocumentId,
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: documentEntry.graphDocumentId,
            sourceOutputEntryId: objectRow.outputEntryId,
            sourceNodeId: objectRow.sourceNodeId,
            slotId: objectRow.slotId,
            label: objectRow.label,
            resolutionState: objectRow.state,
          }
          continue
        }

        publishedComponentOrdinal += 1
        const componentId = buildProjectPublishedComponentId(
          project.projectFileId,
          documentEntry.graphDocumentId,
        )
        const childObjectIds = publishedRow.objects.map((objectRow) =>
          buildProjectObjectId(project.projectFileId, documentEntry.graphDocumentId, objectRow.objectId),
        )
        const resolutionState = publishedRow.objects.some((objectRow) => objectRow.state === 'resolved')
          ? 'resolved'
          : 'unresolved'
        childRowIds.push(componentId)
        componentsById[componentId] = {
          componentId,
          ownerGraphDocumentId: documentEntry.graphDocumentId,
          sourceGraphDocumentId: documentEntry.graphDocumentId,
          sourceOutputEntryId: null,
          sourceNodeId: null,
          label:
            publishedRow.componentLabel === OUTPUT_PREVIEW_DEFAULT_COMPONENT_LABEL
              ? `Component ${publishedComponentOrdinal}`
              : publishedRow.componentLabel,
          componentSourceKind: 'published-component',
          resolutionState,
          receiveId: null,
          childObjectIds,
        }
        publishedRow.objects.forEach((objectRow, index) => {
          const objectId = childObjectIds[index]
          if (objectId === undefined) {
            return
          }
          objectsById[objectId] = {
            objectId,
            ownerGraphDocumentId: documentEntry.graphDocumentId,
            parentComponentId: componentId,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: documentEntry.graphDocumentId,
            sourceOutputEntryId: objectRow.outputEntryId,
            sourceNodeId: objectRow.sourceNodeId,
            slotId: objectRow.slotId,
            label: objectRow.label,
            resolutionState: objectRow.state,
          }
        })
      }
    }

    for (const receiveReference of selectResolvedGraphReceiveReferencesByDocumentId(
      spaghettiState,
      documentEntry.graphDocumentId,
    )) {
      const objectId = buildProjectReceiveObjectId(
        project.projectFileId,
        documentEntry.graphDocumentId,
        receiveReference.receiveId,
      )
      const label = receiveReference.sourceEntry?.label ?? receiveReference.sourceOutputEntryId
      childRowIds.push(objectId)
      objectsById[objectId] = {
        objectId,
        ownerGraphDocumentId: documentEntry.graphDocumentId,
        parentComponentId: null,
        objectSourceKind: 'receive-link',
        sourceGraphDocumentId: receiveReference.sourceGraphDocumentId,
        sourceOutputEntryId: receiveReference.sourceOutputEntryId,
        sourceNodeId: receiveReference.sourceEntry?.sourceNodeId ?? null,
        slotId: receiveReference.sourceEntry?.slotId ?? null,
        label,
        resolutionState: receiveReference.resolutionState,
      }
    }
  }

  return {
    assembliesById: {
      [rootAssemblyId]: {
        assemblyId: rootAssemblyId,
        label: ROOT_ASSEMBLY_LABEL,
        childRowIds,
      },
    },
    componentsById,
    objectsById,
  }
}

const createInitialProjectContentState = (): ProjectContentState => {
  const initialProject = createInitialProjectFile()
  return buildProjectContentState(initialProject, useSpaghettiStore.getState())
}

const areProjectGraphDocumentsEqual = (
  left: ProjectGraphDocumentEntry[],
  right: ProjectGraphDocumentEntry[],
): boolean =>
  left.length === right.length &&
  left.every((entry, index) => {
    const other = right[index]
    return (
      other !== undefined &&
      entry.graphDocumentId === other.graphDocumentId &&
      entry.label === other.label &&
      entry.sourceFilePath === other.sourceFilePath &&
      entry.orderIndex === other.orderIndex
    )
  })

const areOrderedStringArraysEqual = (left: string[], right: string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index])

const areProjectAssemblyRecordsEqual = (
  left: ProjectAssemblyRecord,
  right: ProjectAssemblyRecord,
): boolean =>
  left.assemblyId === right.assemblyId &&
  left.label === right.label &&
  areOrderedStringArraysEqual(left.childRowIds, right.childRowIds)

const areProjectAssembliesEqual = (
  left: Record<string, ProjectAssemblyRecord>,
  right: Record<string, ProjectAssemblyRecord>,
): boolean => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    areOrderedStringArraysEqual(leftKeys, rightKeys) &&
    leftKeys.every((assemblyId) => {
      const other = right[assemblyId]
      return other !== undefined && areProjectAssemblyRecordsEqual(left[assemblyId], other)
    })
  )
}

const areProjectComponentsEqual = (
  left: Record<string, ProjectComponentRecord>,
  right: Record<string, ProjectComponentRecord>,
): boolean => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    areOrderedStringArraysEqual(leftKeys, rightKeys) &&
    leftKeys.every((componentId) => {
      const other = right[componentId]
      const entry = left[componentId]
      return (
        other !== undefined &&
        entry.componentId === other.componentId &&
        entry.ownerGraphDocumentId === other.ownerGraphDocumentId &&
        entry.sourceGraphDocumentId === other.sourceGraphDocumentId &&
        entry.sourceOutputEntryId === other.sourceOutputEntryId &&
        entry.sourceNodeId === other.sourceNodeId &&
        entry.label === other.label &&
        entry.componentSourceKind === other.componentSourceKind &&
        entry.resolutionState === other.resolutionState &&
        entry.receiveId === other.receiveId &&
        areOrderedStringArraysEqual(entry.childObjectIds, other.childObjectIds)
      )
    })
  )
}

const areProjectObjectsEqual = (
  left: Record<string, ProjectObjectRecord>,
  right: Record<string, ProjectObjectRecord>,
): boolean => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    areOrderedStringArraysEqual(leftKeys, rightKeys) &&
    leftKeys.every((objectId) => {
      const entry = left[objectId]
      const other = right[objectId]
      return (
        other !== undefined &&
        entry.objectId === other.objectId &&
        entry.ownerGraphDocumentId === other.ownerGraphDocumentId &&
        entry.parentComponentId === other.parentComponentId &&
        entry.objectSourceKind === other.objectSourceKind &&
        entry.sourceGraphDocumentId === other.sourceGraphDocumentId &&
        entry.sourceOutputEntryId === other.sourceOutputEntryId &&
        entry.sourceNodeId === other.sourceNodeId &&
        entry.slotId === other.slotId &&
        entry.label === other.label &&
        entry.resolutionState === other.resolutionState
      )
    })
  )
}

const areProjectContentStatesEqual = (
  left: ProjectContentState,
  right: ProjectContentState,
): boolean =>
  areProjectAssembliesEqual(left.assembliesById, right.assembliesById) &&
  areProjectComponentsEqual(left.componentsById, right.componentsById) &&
  areProjectObjectsEqual(left.objectsById, right.objectsById)

export const selectChangedGeomParamIds = (state: Pick<AppState, 'geomDirty' | 'geomBuilt'>): string[] => {
  const changed: string[] = []
  for (const id of Object.keys(state.geomDirty)) {
    if ((state.geomDirty[id] ?? 0) > (state.geomBuilt[id] ?? 0)) {
      changed.push(id)
    }
  }
  return changed
}

const BROWSER_BUILD_POLICY_ORDER: readonly BrowserBuildPolicy[] = [
  'live',
  'release',
  'manual',
  'off',
]

const BROWSER_BUILD_POLICY_PRIORITY: Record<BrowserBuildPolicy, number> = {
  off: 0,
  manual: 1,
  release: 2,
  live: 3,
}

const cycleBrowserBuildPolicy = (policy: BrowserBuildPolicy): BrowserBuildPolicy => {
  const currentIndex = BROWSER_BUILD_POLICY_ORDER.indexOf(policy)
  return BROWSER_BUILD_POLICY_ORDER[(currentIndex + 1) % BROWSER_BUILD_POLICY_ORDER.length]
}

const pickMoreEagerBrowserBuildPolicy = (
  left: BrowserBuildPolicy,
  right: BrowserBuildPolicy,
): BrowserBuildPolicy =>
  BROWSER_BUILD_POLICY_PRIORITY[right] > BROWSER_BUILD_POLICY_PRIORITY[left] ? right : left

const deleteRecordKey = <T extends Record<string, unknown>>(
  record: T,
  key: string,
): T => {
  if (!(key in record)) {
    return record
  }
  const next = { ...record }
  delete next[key]
  return next
}

const selectAssemblyBrowserBuildPolicy = (
  state: Pick<
    AppState,
    'currentProject' | 'browserContentBuildPolicyByRowId'
  >,
): BrowserBuildPolicy | null => {
  const rootAssemblyId =
    state.currentProject.rootAssemblyId ?? buildRootAssemblyId(state.currentProject.projectFileId)
  return state.browserContentBuildPolicyByRowId[rootAssemblyId] ?? null
}

const selectStrongestIndependentBrowserContentPolicyForGraphDocument = (
  state: Pick<AppState, 'projectContent' | 'browserContentBuildPolicyByRowId'>,
  graphDocumentId: string,
): BrowserBuildPolicy | null => {
  let strongest: BrowserBuildPolicy | null = null

  for (const component of Object.values(state.projectContent.componentsById)) {
    if (component.ownerGraphDocumentId !== graphDocumentId) {
      continue
    }
    const authored = state.browserContentBuildPolicyByRowId[component.componentId] ?? null
    if (authored === null) {
      continue
    }
    strongest = strongest === null ? authored : pickMoreEagerBrowserBuildPolicy(strongest, authored)
  }

  for (const objectRow of Object.values(state.projectContent.objectsById)) {
    if (objectRow.ownerGraphDocumentId !== graphDocumentId) {
      continue
    }
    const authored = state.browserContentBuildPolicyByRowId[objectRow.objectId] ?? null
    if (authored === null) {
      continue
    }
    strongest = strongest === null ? authored : pickMoreEagerBrowserBuildPolicy(strongest, authored)
  }

  return strongest
}

export const selectEffectiveBrowserExecutionPolicy = (
  state: Pick<
    AppState,
    | 'currentProject'
    | 'projectContent'
    | 'browserGraphBuildPolicyByGraphDocumentId'
    | 'browserContentBuildPolicyByRowId'
  >,
  target: BrowserBuildExecutionTarget,
): BrowserBuildPolicy => {
  if (target.kind !== 'graph-document') {
    return 'live'
  }

  let effective =
    state.browserGraphBuildPolicyByGraphDocumentId[target.graphDocumentId] ??
    selectAssemblyBrowserBuildPolicy(state) ??
    'live'

  const strongestIndependent =
    selectStrongestIndependentBrowserContentPolicyForGraphDocument(state, target.graphDocumentId)
  if (strongestIndependent !== null) {
    effective = pickMoreEagerBrowserBuildPolicy(effective, strongestIndependent)
  }

  return effective
}

export const selectShouldSuppressBrowserGraphRuntimeOutput = (
  state: Pick<
    AppState,
    | 'currentProject'
    | 'projectContent'
    | 'browserGraphBuildPolicyByGraphDocumentId'
    | 'browserContentBuildPolicyByRowId'
  >,
  graphDocumentId: string,
): boolean =>
  selectEffectiveBrowserExecutionPolicy(state, {
    kind: 'graph-document',
    graphDocumentId,
  }) === 'off'

export const useAppStore = create<AppState>((set, get) => ({
  lastBuildSeq: 0,
  geomDirty: {},
  geomBuilt: {},
  partsVisibility: defaultVisibility,
  selectedPartKey: null,
  buildPolicy: 'live',
  browserGraphBuildPolicyByGraphDocumentId: {},
  browserContentBuildPolicyByRowId: {},
  browserInteractionGraphDocumentIds: {},
  pendingBrowserBuildGraphDocumentIds: {},
  isInteracting: false,
  pendingBuildAfterRelease: false,
  currentProject: createInitialProjectFile(),
  projectContent: createInitialProjectContentState(),
    referenceWorkspace: createInitialReferenceWorkspaceState(),
    sketchVisibilityByRowId: {},
    workspaceSelection: {
      selectedTarget: null,
      explicitSelectedTargets: [],
      selectionAnchorTarget: null,
      resolvedContentSelection: null,
      activeSurface: null,
  },
  floatingShellActivationRequest: null,
  consoleContextSyncRequest: null,
  referenceTransformShellExitRequest: null,
  workerError: null,
  setSpaghettiGraph: (graph) => {
    useSpaghettiStore.getState().setGraph(graph)
  },
  compileGraphDocument: (graphDocumentId) => {
    const spaghettiState = useSpaghettiStore.getState()
    const graph = selectGraphByDocumentId(spaghettiState, graphDocumentId)
    if (graph === null) {
      throw new Error(`Graph document "${graphDocumentId}" was not found.`)
    }
    const compileResult = compileSpaghettiGraph(graph)
    spaghettiState.setGraphCompileResult(graphDocumentId, compileResult)
    return compileResult
  },
  requestGraphDocumentBuild: (graphDocumentId) => {
    const state = get()
    const spaghettiState = useSpaghettiStore.getState()
    const compileResult = get().compileGraphDocument(graphDocumentId)
    if (!compileResult.ok || compileResult.buildInputs === undefined) {
      return compileResult
    }

    const pendingBuildState =
      selectGraphRuntimeByDocumentId(spaghettiState, graphDocumentId)?.compileBuild ?? null
    const previewPreparation =
      selectGraphRuntimeByDocumentId(spaghettiState, graphDocumentId)?.previewPreparation ?? null
    if (previewPreparation === null) {
      return compileResult
    }
    const requestBuild = buildRequestFromBuildInputs(
      compileResult.buildInputs,
      previewPreparation,
      pendingBuildState?.previousBuildInputs ?? undefined,
    )
    if (requestBuild.targetBuildUnitIds.length === 0) {
      return compileResult
    }
    const buildRequestId = newId('build-request')
    const buildSeq = buildDispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: state.currentProject.projectFileId,
        graphDocumentId,
        buildRequestId,
      },
      compiledBuildData: requestBuild.compiledBuildData,
      buildIdentity: {
        graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
        targetBuildUnitIds: requestBuild.targetBuildUnitIds,
      },
      invalidation: {
        affectedBuildUnitIds: requestBuild.affectedBuildUnitIds,
      },
      changedParamIds: requestBuild.changedParamIds,
      buildStatsPartKeys: requestBuild.buildStatsPartKeys,
    })
    spaghettiState.stageGraphBuildRequest(graphDocumentId, {
      compileResult,
      previousBuildInputs: pendingBuildState?.previousBuildInputs ?? null,
      pendingChangedParamIds: requestBuild.changedParamIds,
      pendingStatsPartKeys: requestBuild.buildStatsPartKeys,
      pendingTargetBuildUnitIds: requestBuild.targetBuildUnitIds,
      pendingAffectedBuildUnitIds: requestBuild.affectedBuildUnitIds,
      buildRequestId,
      buildSeq,
    })
    appendConsoleEntry({
      layer: 'App',
      text: `Requested graph build for ${graphDocumentId}`,
      source: graphDocumentId,
      severity: 'info',
    })
    return compileResult
  },
  compileSpaghetti: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    return get().compileGraphDocument(activeGraphDocument.graphDocumentId)
  },
  requestSpaghettiBuild: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    return get().requestGraphDocumentBuild(activeGraphDocument.graphDocumentId)
  },
  setBuildPolicy: (policy) => {
    set((state) => ({
      buildPolicy: policy,
      pendingBuildAfterRelease:
        policy === 'release' ? state.pendingBuildAfterRelease : false,
    }))
  },
  getBrowserGraphBuildPolicy: (graphDocumentId) =>
    get().browserGraphBuildPolicyByGraphDocumentId[graphDocumentId] ?? null,
  getBrowserContentBuildPolicy: (rowId) => get().browserContentBuildPolicyByRowId[rowId] ?? null,
  setBrowserGraphBuildPolicy: (graphDocumentId, policy) => {
    set((state) => ({
      browserGraphBuildPolicyByGraphDocumentId: {
        ...state.browserGraphBuildPolicyByGraphDocumentId,
        [graphDocumentId]: policy,
      },
    }))
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  clearBrowserGraphBuildPolicy: (graphDocumentId) => {
    set((state) => {
      const next = { ...state.browserGraphBuildPolicyByGraphDocumentId }
      delete next[graphDocumentId]
      return {
        browserGraphBuildPolicyByGraphDocumentId: next,
      }
    })
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  cycleBrowserGraphBuildPolicy: (graphDocumentId, basePolicy) => {
    set((state) => {
      const currentPolicy =
        state.browserGraphBuildPolicyByGraphDocumentId[graphDocumentId] ?? basePolicy ?? 'live'
      return {
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          [graphDocumentId]: cycleBrowserBuildPolicy(currentPolicy),
        },
      }
    })
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  setBrowserContentBuildPolicy: (rowId, policy) => {
    set((state) => ({
      browserContentBuildPolicyByRowId: {
        ...state.browserContentBuildPolicyByRowId,
        [rowId]: policy,
      },
    }))
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  clearBrowserContentBuildPolicy: (rowId) => {
    set((state) => {
      const next = { ...state.browserContentBuildPolicyByRowId }
      delete next[rowId]
      return {
        browserContentBuildPolicyByRowId: next,
      }
    })
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  cycleBrowserContentBuildPolicy: (rowId, basePolicy) => {
    set((state) => {
      const currentPolicy =
        state.browserContentBuildPolicyByRowId[rowId] ?? basePolicy ?? 'live'
      return {
        browserContentBuildPolicyByRowId: {
          ...state.browserContentBuildPolicyByRowId,
          [rowId]: cycleBrowserBuildPolicy(currentPolicy),
        },
      }
    })
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  beginBrowserBuildInteraction: (graphDocumentId) => {
    if (graphDocumentId.length === 0) {
      return
    }
    set((state) =>
      state.browserInteractionGraphDocumentIds[graphDocumentId] === true
        ? state
        : {
            browserInteractionGraphDocumentIds: {
              ...state.browserInteractionGraphDocumentIds,
              [graphDocumentId]: true,
            },
          },
    )
  },
  endBrowserBuildInteraction: (graphDocumentId) => {
    if (graphDocumentId.length === 0) {
      return
    }
    const shouldDispatchQueuedBuild =
      get().pendingBrowserBuildGraphDocumentIds[graphDocumentId] === true
    set((state) => ({
      browserInteractionGraphDocumentIds: deleteRecordKey(
        state.browserInteractionGraphDocumentIds,
        graphDocumentId,
      ),
      pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
        state.pendingBrowserBuildGraphDocumentIds,
        graphDocumentId,
      ),
    }))
    if (shouldDispatchQueuedBuild) {
      get().requestBrowserGraphDocumentBuild(graphDocumentId)
    }
  },
  requestBrowserGraphDocumentBuild: (graphDocumentId, options) => {
    const policy = selectEffectiveBrowserExecutionPolicy(get(), {
      kind: 'graph-document',
      graphDocumentId,
    })
    const isExplicit = options?.explicit === true

    if (policy === 'off') {
      set((state) => ({
        pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
          state.pendingBrowserBuildGraphDocumentIds,
          graphDocumentId,
        ),
      }))
      appendConsoleEntry({
        layer: 'Browser',
        text: `Build suppressed for ${graphDocumentId} because policy is Off`,
        source: graphDocumentId,
        severity: 'info',
      })
      syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
      return null
    }

    if (!isExplicit && policy === 'manual') {
      return null
    }

    set((state) => ({
      pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
        state.pendingBrowserBuildGraphDocumentIds,
        graphDocumentId,
      ),
    }))
    return get().requestGraphDocumentBuild(graphDocumentId)
  },
  beginInteraction: () => {
    set((state) => (state.isInteracting ? state : { isInteracting: true }))
  },
  endInteraction: () => {
    set((state) => {
      if (!state.isInteracting) {
        return state
      }
      return {
        isInteracting: false,
        pendingBuildAfterRelease: false,
      }
    })
  },
  requestManualBuild: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    set({ pendingBuildAfterRelease: false })
    appendConsoleEntry({
      layer: 'App',
      text: `Manual build requested for ${activeGraphDocument.graphDocumentId}`,
      source: activeGraphDocument.graphDocumentId,
      severity: 'info',
    })
    get().requestBrowserGraphDocumentBuild(activeGraphDocument.graphDocumentId, {
      explicit: true,
    })
  },
  acceptBuildResult: (result) => {
    const currentProjectId = get().currentProject.projectFileId
    if (result.projectFileId !== currentProjectId) {
      return
    }
    const acceptedSpaghettiResult = useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: result.projectFileId,
      graphDocumentId: result.graphDocumentId,
      buildRequestId: result.buildRequestId,
      buildSeq: result.seq,
      bundle: result.bundle,
    })
    if (!acceptedSpaghettiResult) {
      return
    }

    set((state) =>
      result.seq <= state.lastBuildSeq
        ? {
            lastBuildSeq: state.lastBuildSeq,
          }
        : {
            lastBuildSeq: result.seq,
          },
    )
  },
  setWorkerError: (message) => {
    set({ workerError: message })
    if (message === null) {
      return
    }
    appendConsoleEntry({
      layer: 'Worker',
      text: message,
      source: 'worker',
      severity: 'error',
    })
  },
  toggleReferenceWorkspaceExpanded: () => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        referencesExpanded: !state.referenceWorkspace.referencesExpanded,
      },
    }))
  },
  toggleReferenceCategoryExpanded: (categoryId) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        categoryExpandedById: {
          ...state.referenceWorkspace.categoryExpandedById,
          [categoryId]: !state.referenceWorkspace.categoryExpandedById[categoryId],
        },
      },
    }))
  },
  toggleReferenceItemVisibility: (referenceId) => {
    set((state) => {
      const wasVisible = state.referenceWorkspace.visibilityById[referenceId] ?? false
      const nextVisible = !wasVisible
      const nextReferenceWorkspace = {
        ...state.referenceWorkspace,
        visibilityById: {
          ...state.referenceWorkspace.visibilityById,
          [referenceId]: nextVisible,
        },
        referenceLoadBatch: nextVisible
          ? state.referenceWorkspace.referenceLoadBatch
          : filterReferenceLoadBatch(state.referenceWorkspace.referenceLoadBatch, [referenceId]),
        ...(!nextVisible
          ? clearActiveReferenceTransformIfMatches(state.referenceWorkspace, [referenceId])
          : {}),
      }
      return {
        referenceWorkspace: nextReferenceWorkspace,
      }
    })
  },
  setReferenceItemVisibility: (referenceId, visible) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        visibilityById: {
          ...state.referenceWorkspace.visibilityById,
          [referenceId]: visible,
        },
        referenceLoadBatch: visible
          ? state.referenceWorkspace.referenceLoadBatch
          : filterReferenceLoadBatch(state.referenceWorkspace.referenceLoadBatch, [referenceId]),
        ...(!visible
          ? clearActiveReferenceTransformIfMatches(state.referenceWorkspace, [referenceId])
          : {}),
      },
    }))
  },
  toggleReferenceCategoryVisibility: (categoryId) => {
    set((state) => {
      const referenceIds = getReferenceIdsForCategory(state.referenceWorkspace, categoryId)
      const anyVisible = referenceIds.some(
        (referenceId) => state.referenceWorkspace.visibilityById[referenceId] ?? false,
      )
      const nextVisible = !anyVisible
      const nextVisibilityById = { ...state.referenceWorkspace.visibilityById }
      for (const referenceId of referenceIds) {
        nextVisibilityById[referenceId] = nextVisible
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: nextVisibilityById,
          referenceLoadBatch: nextVisible
            ? state.referenceWorkspace.referenceLoadBatch
            : filterReferenceLoadBatch(state.referenceWorkspace.referenceLoadBatch, referenceIds),
          ...(!nextVisible
            ? clearActiveReferenceTransformIfMatches(state.referenceWorkspace, referenceIds)
            : {}),
        },
      }
    })
  },
  toggleSketchVisibility: (rowId) => {
    set((state) => ({
      sketchVisibilityByRowId: {
        ...state.sketchVisibilityByRowId,
        [rowId]: !(state.sketchVisibilityByRowId[rowId] ?? false),
      },
    }))
  },
  setSketchVisibility: (rowId, visible) => {
    set((state) => ({
      sketchVisibilityByRowId: {
        ...state.sketchVisibilityByRowId,
        [rowId]: visible,
      },
    }))
  },
  addImportedReference: ({ fileName, fileType, objectUrl }) => {
    const referenceId = buildImportedReferenceId()
    set((state) => {
      const existingImportedLabels = state.referenceWorkspace.importedReferenceOrder
        .map((currentReferenceId) => state.referenceWorkspace.importedReferencesById[currentReferenceId]?.label)
        .filter((label): label is string => label !== undefined)
      const label = buildImportedReferenceLabel(fileName, existingImportedLabels)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          referencesExpanded: true,
          categoryExpandedById: {
            ...state.referenceWorkspace.categoryExpandedById,
            [USER_REFERENCE_CATEGORY_ID]: true,
          },
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            [referenceId]: true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            [referenceId]: 'unloaded',
          },
          errorById: {
            ...state.referenceWorkspace.errorById,
            [referenceId]: null,
          },
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: null,
          },
          channelClampRangeByReferenceId: {
            ...state.referenceWorkspace.channelClampRangeByReferenceId,
            [referenceId]: {
              'move-x': getReferenceTimelineDefaultRange('move-x'),
              'move-y': getReferenceTimelineDefaultRange('move-y'),
              'move-z': getReferenceTimelineDefaultRange('move-z'),
              'rotate-x': getReferenceTimelineDefaultRange('rotate-x'),
              'rotate-y': getReferenceTimelineDefaultRange('rotate-y'),
              'rotate-z': getReferenceTimelineDefaultRange('rotate-z'),
              'scale-x': getReferenceTimelineDefaultRange('scale-x'),
              'scale-y': getReferenceTimelineDefaultRange('scale-y'),
              'scale-z': getReferenceTimelineDefaultRange('scale-z'),
              'rotate-snap': getReferenceTimelineDefaultRange('rotate-snap'),
            },
          },
          timelineModeByReferenceId: {
            ...state.referenceWorkspace.timelineModeByReferenceId,
            [referenceId]: {},
          },
          timelineConfigByReferenceId: {
            ...state.referenceWorkspace.timelineConfigByReferenceId,
            [referenceId]: {},
          },
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: cloneReferenceTransformSnapState(),
          },
          importedReferencesById: {
            ...state.referenceWorkspace.importedReferencesById,
            [referenceId]: {
              referenceId,
              label,
              fileType,
              assetPath: objectUrl,
            },
          },
          importedReferenceOrder: [...state.referenceWorkspace.importedReferenceOrder, referenceId],
        },
      }
    })
    appendConsoleEntry({
      layer: 'Browser',
      text: `Imported ${fileName} (${fileType})`,
      source: referenceId,
      severity: 'info',
    })
    return referenceId
  },
  retryReferenceItemLoad: (referenceId) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        visibilityById: {
          ...state.referenceWorkspace.visibilityById,
          [referenceId]: true,
        },
        loadStateById: {
          ...state.referenceWorkspace.loadStateById,
          [referenceId]: 'unloaded',
        },
        errorById: {
          ...state.referenceWorkspace.errorById,
          [referenceId]: null,
        },
      },
    }))
  },
  startReferenceLoadBatchForAll: () => {
    set((state) => {
      const targetIds = getOrderedReferenceIds(state.referenceWorkspace)
      const { referenceWorkspace } = createReferenceLoadBatch(
        state.referenceWorkspace,
        targetIds,
        'root-load-all',
        'References',
      )
      return {
        referenceWorkspace,
      }
    })
  },
  startReferenceLoadBatchForCategory: (categoryId) => {
    set((state) => {
      const orderedReferenceIds = getOrderedReferenceIds(state.referenceWorkspace)
      const categoryReferenceIdSet = new Set(
        getReferenceIdsForCategory(state.referenceWorkspace, categoryId),
      )
      const targetIds = orderedReferenceIds.filter((referenceId) =>
        categoryReferenceIdSet.has(referenceId),
      )
      const { referenceWorkspace } = createReferenceLoadBatch(
        state.referenceWorkspace,
        targetIds,
        'category-load-all',
        selectReferenceWorkspaceBrowserTree({ referenceWorkspace: state.referenceWorkspace }).categories.find(
          (category) => category.categoryId === categoryId,
        )?.label ?? categoryId,
      )
      return {
        referenceWorkspace,
      }
    })
  },
  markReferenceBatchItemStarted: (referenceId, requestId) => {
    set((state) => {
      const currentBatch = state.referenceWorkspace.referenceLoadBatch
      if (currentBatch === null || currentBatch.requestId !== requestId) {
        return state
      }
      if (!currentBatch.remainingIds.includes(referenceId)) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          referenceLoadBatch: {
            ...currentBatch,
            activeReferenceId: referenceId,
            remainingIds: currentBatch.remainingIds.filter((currentId) => currentId !== referenceId),
          },
        },
      }
    })
  },
  markReferenceBatchItemCompleted: (referenceId, requestId, outcome) => {
    set((state) => {
      const currentBatch = state.referenceWorkspace.referenceLoadBatch
      if (
        currentBatch === null ||
        (currentBatch.requestId !== requestId && currentBatch.activeReferenceId !== referenceId)
      ) {
        return state
      }
      const participatesInCurrentBatch = currentBatch.targetIds.includes(referenceId)
      const nextCompletedIds =
        participatesInCurrentBatch && outcome === 'loaded' && !currentBatch.completedIds.includes(referenceId)
          ? [...currentBatch.completedIds, referenceId]
          : currentBatch.completedIds
      const nextFailedIds =
        participatesInCurrentBatch && outcome === 'error' && !currentBatch.failedIds.includes(referenceId)
          ? [...currentBatch.failedIds, referenceId]
          : currentBatch.failedIds
      const nextActiveReferenceId =
        currentBatch.activeReferenceId === referenceId ? null : currentBatch.activeReferenceId
      const targetDoneCount = currentBatch.targetIds.filter(
        (targetId) => nextCompletedIds.includes(targetId) || nextFailedIds.includes(targetId),
      ).length
      const nextReferenceLoadBatch =
        currentBatch.targetIds.length === 0 ||
        (nextActiveReferenceId === null && targetDoneCount >= currentBatch.targetIds.length)
          ? null
          : {
              ...currentBatch,
              activeReferenceId: nextActiveReferenceId,
              completedIds: nextCompletedIds,
              failedIds: nextFailedIds,
            }
      if (nextReferenceLoadBatch === null && currentBatch.targetIds.length > 0) {
        appendConsoleEntry({
          layer: 'Browser',
          text: `Load All Complete: ${currentBatch.scopeLabel}`,
          source: currentBatch.requestId,
          severity: 'info',
        })
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          referenceLoadBatch: nextReferenceLoadBatch,
        },
      }
    })
  },
  loadAllReferences: () => {
    get().startReferenceLoadBatchForAll()
  },
  loadReferenceCategory: (categoryId) => {
    get().startReferenceLoadBatchForCategory(categoryId)
  },
  removeImportedReference: (referenceId) => {
    set((state) => {
      const importedReference = state.referenceWorkspace.importedReferencesById[referenceId]
      if (importedReference === undefined) {
        return state
      }
      if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(importedReference.assetPath)
      }
      const nextImportedReferencesById = { ...state.referenceWorkspace.importedReferencesById }
      delete nextImportedReferencesById[referenceId]
      const nextVisibilityById = { ...state.referenceWorkspace.visibilityById }
      delete nextVisibilityById[referenceId]
      const nextLoadStateById = { ...state.referenceWorkspace.loadStateById }
      delete nextLoadStateById[referenceId]
      const nextErrorById = { ...state.referenceWorkspace.errorById }
      delete nextErrorById[referenceId]
      const nextTransformOverrideById = { ...state.referenceWorkspace.transformOverrideById }
      delete nextTransformOverrideById[referenceId]
      const nextChannelClampRangeByReferenceId = {
        ...state.referenceWorkspace.channelClampRangeByReferenceId,
      }
      delete nextChannelClampRangeByReferenceId[referenceId]
      const nextTimelineModeByReferenceId = {
        ...state.referenceWorkspace.timelineModeByReferenceId,
      }
      delete nextTimelineModeByReferenceId[referenceId]
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      delete nextTimelineConfigByReferenceId[referenceId]
      const nextTransformSnapByReferenceId = {
        ...state.referenceWorkspace.transformSnapByReferenceId,
      }
      delete nextTransformSnapByReferenceId[referenceId]
      const nextTransformHistoryByReferenceId = {
        ...state.referenceWorkspace.transformHistoryByReferenceId,
      }
      delete nextTransformHistoryByReferenceId[referenceId]
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: nextVisibilityById,
          loadStateById: nextLoadStateById,
          errorById: nextErrorById,
          referenceLoadBatch: filterReferenceLoadBatch(
            state.referenceWorkspace.referenceLoadBatch,
            [referenceId],
          ),
          transformOverrideById: nextTransformOverrideById,
          channelClampRangeByReferenceId: nextChannelClampRangeByReferenceId,
          timelineModeByReferenceId: nextTimelineModeByReferenceId,
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
          transformSnapByReferenceId: nextTransformSnapByReferenceId,
          transformHistoryByReferenceId: nextTransformHistoryByReferenceId,
          importedReferencesById: nextImportedReferencesById,
          importedReferenceOrder: state.referenceWorkspace.importedReferenceOrder.filter(
            (currentReferenceId) => currentReferenceId !== referenceId,
          ),
          ...clearActiveReferenceTransformIfMatches(state.referenceWorkspace, [referenceId]),
        },
      }
    })
  },
  setReferenceItemLoadState: (referenceId, loadState, errorMessage = null) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        loadStateById: {
          ...state.referenceWorkspace.loadStateById,
          [referenceId]: loadState,
        },
        errorById: {
          ...state.referenceWorkspace.errorById,
          [referenceId]: loadState === 'error' ? errorMessage : null,
        },
      },
    }))
  },
  beginReferenceTransformShell: (referenceId) => {
    set((state) => {
      const existingSession = state.referenceWorkspace.activeReferenceTransformSession
      if (existingSession?.referenceId === referenceId && existingSession.shellActive) {
        return state
      }
      const currentTransformOverride =
        state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(currentEntries)
      const draftTransform =
        cloneReferenceTransformOverride(currentTransformOverride) ??
        getReferenceTransformHistoryTransformAtScrubIndex(currentEntries, latestScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: currentEntries,
          },
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            [referenceId]: true,
          },
          activeReferenceTransformSession: {
            referenceId,
            sessionId: newId('reference-transform-session'),
            sessionOrdinal: getNextReferenceTransformSessionOrdinal(currentEntries),
            mode: 'translate',
            space: 'local',
            shellActive: true,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: latestScrubIndex,
            draftTransform,
            entryOrigin: null,
          },
        },
      }
    })
  },
  exitReferenceTransformShell: () => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeReferenceTransformSession: null,
      },
    }))
  },
  beginReferenceTransformEntry: (mode) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            mode,
            entryActive: true,
            activeHandle: null,
            entryOrigin:
              cloneReferenceTransformOverride(activeSession.draftTransform) ??
              buildDefaultReferenceTransformOverride(),
            draftTransform:
              cloneReferenceTransformOverride(activeSession.draftTransform) ??
              buildDefaultReferenceTransformOverride(),
          },
        },
      }
    })
  },
  commitActiveReferenceTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      const activeReferenceId = activeSession.referenceId
      const committedTransformOverride =
        cloneReferenceTransformOverride(activeSession.draftTransform) ??
        buildDefaultReferenceTransformOverride()
      const previousTransformOverride =
        state.referenceWorkspace.transformOverrideById[activeReferenceId] ?? null
      const kind = resolveReferenceTransformHistoryKind(activeSession.mode)
      const after = getReferenceTransformHistoryEntryAfterValue(committedTransformOverride, kind)
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[activeReferenceId] ?? [],
      )
      const currentScrubIndex = resolveReferenceTransformHistoryScrubIndex(
        currentEntries,
        activeSession.historyScrubIndex,
      )
      const nextEntries = insertReferenceTransformHistoryEntryAtScrubIndex(
        currentEntries,
        currentScrubIndex,
        activeSession.sessionId,
        activeSession.sessionOrdinal,
        kind,
        after,
      )
      const historyChanged =
        currentEntries.length !== nextEntries.length ||
        currentEntries.some((entry, index) => {
          const other = nextEntries[index]
          return (
            other === undefined ||
            entry.entryId !== other.entryId ||
            !areReferenceTransformVectorsEqual(entry.delta, other.delta) ||
            !areReferenceTransformVectorsEqual(entry.after, other.after) ||
            !areReferenceTransformOverridesEqual(entry.transformAfter, other.transformAfter) ||
            entry.locked !== other.locked
          )
        })
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(nextEntries)
      const nextTransformOverride = getReferenceTransformHistoryTransformAtScrubIndex(
        nextEntries,
        latestScrubIndex,
      )
      const nextActiveScrubIndex = historyChanged
        ? Math.min(latestScrubIndex, currentScrubIndex + 1)
        : Math.min(latestScrubIndex, currentScrubIndex)
      const nextActiveDraftTransform = getReferenceTransformHistoryTransformAtScrubIndex(
        nextEntries,
        nextActiveScrubIndex,
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: nextActiveScrubIndex,
            draftTransform: nextActiveDraftTransform,
            entryOrigin: null,
          },
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [activeReferenceId]: nextTransformOverride,
          },
          transformHistoryByReferenceId: historyChanged
            ? {
                ...state.referenceWorkspace.transformHistoryByReferenceId,
                [activeReferenceId]: nextEntries,
              }
            : state.referenceWorkspace.transformHistoryByReferenceId,
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            activeReferenceId,
            previousTransformOverride,
            nextTransformOverride,
          ),
        },
      }
    })
  },
  setActiveReferenceTransformMode: (mode) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            mode,
          },
        },
      }
    })
  },
  setActiveReferenceTransformSpace: (space) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null || activeSession.space === space) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            space,
          },
        },
      }
    })
  },
  setActiveReferenceTransformHandle: (handle) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            activeHandle: handle === null ? null : { ...handle },
          },
        },
      }
    })
  },
  setActiveReferenceTransformDraft: (transformOverride) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            draftTransform:
              cloneReferenceTransformOverride(transformOverride) ??
              buildDefaultReferenceTransformOverride(),
          },
        },
      }
    })
  },
  setActiveReferenceTransformHistoryScrubIndex: (scrubIndex) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null || activeSession.entryActive) {
        return state
      }
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[activeSession.referenceId] ?? [],
      )
      const nextScrubIndex = resolveReferenceTransformHistoryScrubIndex(currentEntries, scrubIndex)
      if (nextScrubIndex === activeSession.historyScrubIndex) {
        return state
      }
      const nextDraftTransform = getReferenceTransformHistoryTransformAtScrubIndex(
        currentEntries,
        nextScrubIndex,
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            historyScrubIndex: nextScrubIndex,
            draftTransform: nextDraftTransform,
          },
        },
      }
    })
  },
  setReferenceTransformOverride: (referenceId, transformOverride) => {
    set((state) => {
      const previousTransformOverride = state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: transformOverride,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId === referenceId
              ? {
                  ...activeSession,
                  draftTransform:
                    cloneReferenceTransformOverride(transformOverride) ??
                    buildDefaultReferenceTransformOverride(),
                }
              : activeSession,
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            referenceId,
            previousTransformOverride,
            transformOverride,
          ),
        },
      }
    })
  },
  resetReferenceTransform: (referenceId) => {
    set((state) => {
      const previousTransformOverride = state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: null,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId === referenceId
              ? {
                  ...activeSession,
                  draftTransform: buildDefaultReferenceTransformOverride(),
                  entryOrigin: activeSession.entryActive
                    ? activeSession.entryOrigin
                    : null,
                }
              : activeSession,
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            referenceId,
            previousTransformOverride,
            null,
          ),
        },
      }
    })
  },
  setReferenceTransformHistoryEntryDeltaValue: (referenceId, entryId, axis, value) => {
    set((state) => {
      const previousTransformOverride = state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      let changed = false
      const nextEntries = normalizeReferenceTransformHistoryEntries(currentEntries.map((entry) => {
        if (entry.entryId !== entryId || entry.delta[axis] === value) {
          return entry
        }
        changed = true
        return {
          ...entry,
          delta: {
            ...entry.delta,
            [axis]: value,
          },
        }
      }))
      if (!changed) {
        return state
      }
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const nextScrubIndex =
        activeSession?.referenceId !== referenceId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: nextTransformOverride,
          },
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: nextEntries,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId !== referenceId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform: cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin: activeSession.entryOrigin === null
                    ? null
                    : cloneReferenceTransformOverride(nextDraftTransform),
                },
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            referenceId,
            previousTransformOverride,
            nextTransformOverride,
          ),
        },
      }
    })
  },
  deleteReferenceTransformHistoryEntry: (referenceId, entryId) => {
    set((state) => {
      const previousTransformOverride = state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      const removedIndex = currentEntries.findIndex((entry) => entry.entryId === entryId)
      if (removedIndex < 0) {
        return state
      }
      const nextEntries = normalizeReferenceTransformHistoryEntries([
        ...currentEntries.slice(0, removedIndex),
        ...currentEntries.slice(removedIndex + 1),
      ])
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const currentScrubIndex =
        activeSession?.referenceId !== referenceId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(currentEntries, activeSession.historyScrubIndex)
      const nextScrubIndex =
        currentScrubIndex === undefined
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(
              nextEntries,
              currentScrubIndex - (removedIndex + 1 < currentScrubIndex ? 1 : 0),
            )
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: nextTransformOverride,
          },
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: nextEntries,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId !== referenceId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform: cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin: activeSession.entryOrigin === null
                    ? null
                    : cloneReferenceTransformOverride(nextDraftTransform),
                },
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            referenceId,
            previousTransformOverride,
            nextTransformOverride,
          ),
        },
      }
    })
  },
  toggleReferenceTransformHistoryLock: (referenceId, entryId) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      let changed = false
      const nextEntries = currentEntries.map((entry) => {
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
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      const nextScrubIndex =
        activeSession?.referenceId !== referenceId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: nextTransformOverride,
          },
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: nextEntries,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId !== referenceId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform: cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                },
        },
      }
    })
  },
  mergeReferenceTransformHistory: (referenceId) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      const nextEntries = mergeReferenceTransformHistoryEntries(currentEntries)
      const changed =
        currentEntries.length !== nextEntries.length ||
        currentEntries.some((entry, index) => {
          const other = nextEntries[index]
          return (
            other === undefined ||
            entry.entryId !== other.entryId ||
            entry.sessionId !== other.sessionId ||
            entry.sessionOrdinal !== other.sessionOrdinal ||
            entry.locked !== other.locked ||
            !areReferenceTransformVectorsEqual(entry.delta, other.delta) ||
            !areReferenceTransformVectorsEqual(entry.after, other.after) ||
            !areReferenceTransformOverridesEqual(entry.transformAfter, other.transformAfter)
          )
        })
      if (!changed) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: nextEntries,
          },
        },
      }
    })
  },
  cancelActiveReferenceTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      const baseline =
        cloneReferenceTransformOverride(activeSession.entryOrigin) ??
        buildDefaultReferenceTransformOverride()
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            draftTransform: baseline,
            entryOrigin: null,
          },
        },
      }
    })
  },
  setReferenceChannelClampRange: (referenceId, channel, range) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        channelClampRangeByReferenceId: {
          ...state.referenceWorkspace.channelClampRangeByReferenceId,
          [referenceId]: {
            ...(state.referenceWorkspace.channelClampRangeByReferenceId[referenceId] ?? {}),
            [channel]: range,
          },
        },
      },
    }))
  },
  setReferenceTimelineMode: (referenceId, channel, mode, startedAtMs = performance.now()) => {
    set((state) => {
      const effectiveMode =
        channel === 'rotate-snap' &&
        mode === 'timeline' &&
        !getReferenceTransformSnapState(state.referenceWorkspace, referenceId).rotate.xyzLocked
          ? 'basic'
          : mode
      const nextTimelineModeByReferenceId = {
        ...state.referenceWorkspace.timelineModeByReferenceId,
        [referenceId]: {
          ...(state.referenceWorkspace.timelineModeByReferenceId[referenceId] ?? {}),
          [channel]: effectiveMode,
        },
      }
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      if (effectiveMode === 'timeline') {
        const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.[channel]
        if (existingConfig === undefined) {
          const baseValue =
            channel === 'rotate-snap'
              ? getReferenceTransformSnapDriverValue(
                  getReferenceTransformSnapState(state.referenceWorkspace, referenceId).rotate,
                )
              : getReferenceTransformOverrideAxisValue(
                  state.referenceWorkspace.transformOverrideById[referenceId],
                  channel,
                )
          nextTimelineConfigByReferenceId[referenceId] = {
            ...(nextTimelineConfigByReferenceId[referenceId] ?? {}),
            [channel]: buildReferenceTimelineConfig(
              baseValue,
              getReferenceChannelClampRange(state.referenceWorkspace, referenceId, channel),
              startedAtMs,
            ),
          }
        }
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          timelineModeByReferenceId: nextTimelineModeByReferenceId,
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
        },
      }
    })
  },
  setReferenceTimelineSpeed: (referenceId, channel, speed) => {
    set((state) => {
      const existingConfig = state.referenceWorkspace.timelineConfigByReferenceId[referenceId]?.[channel]
      if (existingConfig === undefined) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          timelineConfigByReferenceId: {
            ...state.referenceWorkspace.timelineConfigByReferenceId,
            [referenceId]: {
              ...(state.referenceWorkspace.timelineConfigByReferenceId[referenceId] ?? {}),
              [channel]: {
                ...existingConfig,
                speed,
              },
            },
          },
        },
      }
    })
  },
  setReferenceTimelineCycle: (referenceId, channel, cycle) => {
    set((state) => {
      const existingConfig = state.referenceWorkspace.timelineConfigByReferenceId[referenceId]?.[channel]
      if (existingConfig === undefined) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          timelineConfigByReferenceId: {
            ...state.referenceWorkspace.timelineConfigByReferenceId,
            [referenceId]: {
              ...(state.referenceWorkspace.timelineConfigByReferenceId[referenceId] ?? {}),
              [channel]: {
                ...existingConfig,
                cycle,
              },
            },
          },
        },
      }
    })
  },
  setReferenceTimelinePoints: (referenceId, channel, points) => {
    set((state) => {
      const existingConfig = state.referenceWorkspace.timelineConfigByReferenceId[referenceId]?.[channel]
      if (existingConfig === undefined) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          timelineConfigByReferenceId: {
            ...state.referenceWorkspace.timelineConfigByReferenceId,
            [referenceId]: {
              ...(state.referenceWorkspace.timelineConfigByReferenceId[referenceId] ?? {}),
              [channel]: {
                ...existingConfig,
                points,
              },
            },
          },
        },
      }
    })
  },
  setReferenceTransformSnapEnabled: (referenceId, mode, enabled) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getReferenceTransformSnapState(state.referenceWorkspace, referenceId),
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: {
              ...currentSnapState,
              [mode]: {
                ...currentSnapState[mode],
                enabled,
              },
            },
          },
        },
      }
    })
  },
  setReferenceTransformSnapValue: (referenceId, mode, value) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getReferenceTransformSnapState(state.referenceWorkspace, referenceId),
      )
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      if (mode === 'rotate') {
        const previousValue = getReferenceTransformSnapDriverValue(currentSnapState.rotate)
        if (
          getReferenceTimelineMode(state.referenceWorkspace, referenceId, 'rotate-snap') === 'timeline'
        ) {
          const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.['rotate-snap']
          if (existingConfig !== undefined) {
            nextTimelineConfigByReferenceId[referenceId] = {
              ...(nextTimelineConfigByReferenceId[referenceId] ?? {}),
              'rotate-snap': shiftReferenceTimelineConfig(
                existingConfig,
                value - previousValue,
                getReferenceChannelClampRange(state.referenceWorkspace, referenceId, 'rotate-snap'),
              ),
            }
          }
        }
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: {
              ...currentSnapState,
              [mode]: {
                ...currentSnapState[mode],
                enabled: true,
                values: setAllReferenceTransformSnapAxes(value),
              },
            },
          },
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
        },
      }
    })
  },
  setReferenceTransformSnapAxisValue: (referenceId, mode, axis, value) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getReferenceTransformSnapState(state.referenceWorkspace, referenceId),
      )
      const currentModeState = currentSnapState[mode]
      const previousRotateDriverValue = getReferenceTransformSnapDriverValue(currentSnapState.rotate)
      const nextModeState: ReferenceTransformSnapSetting = {
        ...currentModeState,
        enabled: true,
        values: currentModeState.xyzLocked
          ? scaleReferenceTransformSnapAxisValues(currentModeState.values, axis, value)
          : {
              ...currentModeState.values,
              [axis]: value,
            },
      }
      const nextSnapState: ReferenceTransformSnapState = {
        ...currentSnapState,
        [mode]: nextModeState,
      }
      const nextTimelineModeByReferenceId = {
        ...state.referenceWorkspace.timelineModeByReferenceId,
      }
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      if (mode === 'rotate') {
        if (!nextModeState.xyzLocked) {
          nextTimelineModeByReferenceId[referenceId] = {
            ...(nextTimelineModeByReferenceId[referenceId] ?? {}),
            'rotate-snap': 'basic',
          }
        } else if (
          getReferenceTimelineMode(state.referenceWorkspace, referenceId, 'rotate-snap') === 'timeline'
        ) {
          const nextRotateDriverValue = getReferenceTransformSnapDriverValue(nextModeState)
          const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.['rotate-snap']
          if (existingConfig !== undefined) {
            nextTimelineConfigByReferenceId[referenceId] = {
              ...(nextTimelineConfigByReferenceId[referenceId] ?? {}),
              'rotate-snap': shiftReferenceTimelineConfig(
                existingConfig,
                nextRotateDriverValue - previousRotateDriverValue,
                getReferenceChannelClampRange(state.referenceWorkspace, referenceId, 'rotate-snap'),
              ),
            }
          }
        }
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: nextSnapState,
          },
          timelineModeByReferenceId: nextTimelineModeByReferenceId,
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
        },
      }
    })
  },
  setReferenceTransformSnapLocked: (referenceId, mode, locked) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getReferenceTransformSnapState(state.referenceWorkspace, referenceId),
      )
      const nextSnapState: ReferenceTransformSnapState = {
        ...currentSnapState,
        [mode]: {
          ...currentSnapState[mode],
          xyzLocked: locked,
        },
      }
      const nextTimelineModeByReferenceId = {
        ...state.referenceWorkspace.timelineModeByReferenceId,
      }
      if (mode === 'rotate' && !locked) {
        nextTimelineModeByReferenceId[referenceId] = {
          ...(nextTimelineModeByReferenceId[referenceId] ?? {}),
          'rotate-snap': 'basic',
        }
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: nextSnapState,
          },
          timelineModeByReferenceId: nextTimelineModeByReferenceId,
        },
      }
    })
  },
  setReferenceTransformMoveSnapDotScale: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotScale: Math.min(4, Math.max(0.1, Number.isFinite(value) ? value : 1)),
      },
    }))
  },
  setReferenceTransformMoveSnapDotsEnabled: (enabled) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotsEnabled: enabled,
      },
    }))
  },
  setReferenceTransformPreviewLastMoveSnapDotsEnabled: (enabled) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        previewLastMoveSnapDotsEnabled: enabled,
      },
    }))
  },
  setReferenceTransformMoveSnapDotDelayMs: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotDelayMs: Math.min(500, Math.max(0, Number.isFinite(value) ? value : 120)),
      },
    }))
  },
  setReferenceTransformMoveSnapDotNearScale: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotNearScale: Math.min(3, Math.max(0.1, Number.isFinite(value) ? value : 1.45)),
      },
    }))
  },
  setReferenceTransformMoveSnapDotFarScale: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotFarScale: Math.min(1.5, Math.max(0, Number.isFinite(value) ? value : 0.04)),
      },
    }))
  },
  setReferenceTransformMoveSnapDotVisibleRadiusMultiplier: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotVisibleRadiusMultiplier: Math.min(
          200,
          Math.max(1, Number.isFinite(value) ? value : 40),
        ),
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewEnabled: (enabled) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewEnabled: enabled,
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewLineSize: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewLineSize: Math.min(3, Math.max(0.25, Number.isFinite(value) ? value : 1)),
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewLineThickness: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewLineThickness: Math.min(
          3,
          Math.max(0.25, Number.isFinite(value) ? value : 1),
        ),
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewRadiusDeg: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewRadiusDeg: Math.min(
          180,
          Math.max(10, Number.isFinite(value) ? value : 60),
        ),
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewDelayMs: (value) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewDelayMs: Math.min(500, Math.max(0, Number.isFinite(value) ? value : 120)),
      },
    }))
  },
  setWorkspaceSelectedTarget: (target) => {
    set((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        selectedTarget: target,
        explicitSelectedTargets: isExplicitWorkspaceSelectionTarget(target) ? [target] : [],
        selectionAnchorTarget: isExplicitWorkspaceSelectionTarget(target) ? target : null,
        resolvedContentSelection: null,
      },
    }))
  },
  setWorkspaceExplicitSelection: (selection) => {
    set((state) => {
      const dedupedExplicitSelectedTargets = selection.explicitSelectedTargets.filter(
        (target, index, targets) =>
          targets.findIndex((candidate) => areWorkspaceSelectedTargetsEqual(candidate, target)) === index,
      )
      return {
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: selection.selectedTarget,
          explicitSelectedTargets: dedupedExplicitSelectedTargets,
          selectionAnchorTarget: selection.selectionAnchorTarget,
          resolvedContentSelection: resolveExplicitContentSelection(
            state,
            selection.selectedTarget,
            dedupedExplicitSelectedTargets,
          ),
        },
      }
    })
  },
  setWorkspaceResolvedContentSelection: (selection) => {
    set((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        resolvedContentSelection: selection,
      },
    }))
  },
  setActiveSurface: (surface) => {
    const currentSurface = get().workspaceSelection.activeSurface
    if (currentSurface === surface) {
      return
    }
    set((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        activeSurface: surface,
      },
    }))
    const shouldSuppressSurfaceEntry =
      surface === 'viewer' && useSpaghettiStore.getState().sketchPlanePickSession !== null
    if (surface !== null && !shouldSuppressSurfaceEntry) {
      appendConsoleEntry({
        layer: 'Selection',
        text: `Active surface: ${surface}`,
        source: surface,
        severity: 'info',
      })
    }
  },
  requestConsoleContextSync: (reason) => {
    set((state) => ({
      consoleContextSyncRequest: {
        reason,
        seq: (state.consoleContextSyncRequest?.seq ?? 0) + 1,
      },
    }))
  },
  requestReferenceTransformShellExit: (source) => {
    set((state) => ({
      referenceTransformShellExitRequest: {
        source,
        seq: (state.referenceTransformShellExitRequest?.seq ?? 0) + 1,
      },
    }))
  },
  requestFloatingShellActivation: (target) => {
    set((state) => ({
      floatingShellActivationRequest: {
        target,
        seq: (state.floatingShellActivationRequest?.seq ?? 0) + 1,
      },
    }))
  },
  ensureVisibilityForPartKeys: (keys, defaultValue = true) => {
    set((state) => {
      let changed = false
      const nextVisibility = { ...state.partsVisibility }
      for (const key of keys) {
        if (nextVisibility[key] !== undefined) {
          continue
        }
        nextVisibility[key] = defaultValue
        changed = true
      }
      return changed ? { partsVisibility: nextVisibility } : state
    })
  },
  togglePartVisibility: (partKeyStr) => {
    const visible = get().partsVisibility[partKeyStr] ?? true
    set({
      partsVisibility: {
        ...get().partsVisibility,
        [partKeyStr]: !visible,
      },
    })
  },
  setPartVisibility: (partKeyStr, visible) => {
    set({
      partsVisibility: {
        ...get().partsVisibility,
        [partKeyStr]: visible,
      },
    })
  },
  selectPart: (partKeyStr) => {
    set({ selectedPartKey: partKeyStr })
    appendConsoleEntry({
      layer: 'Selection',
      text: partKeyStr === null ? 'Selection cleared' : `Selected ${partKeyStr}`,
      source: partKeyStr,
      severity: 'info',
    })
  },
}))

export const selectCurrentProject = (state: Pick<AppState, 'currentProject'>): ProjectFile =>
  state.currentProject

export const selectWorkspaceSelection = (
  state: Pick<AppState, 'workspaceSelection'>,
): WorkspaceSelectionState => state.workspaceSelection

export const selectWorkspaceSelectedTarget = (
  state: Pick<AppState, 'workspaceSelection'>,
): WorkspaceSelectedTarget | null => state.workspaceSelection.selectedTarget

export const selectActiveWorkspaceSurface = (
  state: Pick<AppState, 'workspaceSelection'>,
): WorkspaceSurface | null => state.workspaceSelection.activeSurface

export const selectCurrentProjectId = (state: Pick<AppState, 'currentProject'>): string =>
  state.currentProject.projectFileId

export const selectCurrentProjectGraphDocuments = (
  state: Pick<AppState, 'currentProject'>,
): ProjectGraphDocumentEntry[] => state.currentProject.graphDocuments

export const selectCurrentProjectContent = (
  state: Pick<AppState, 'projectContent'>,
): ProjectContentState => state.projectContent

export const selectCurrentProjectRootAssembly = (
  state: Pick<AppState, 'currentProject' | 'projectContent'>,
): ProjectAssemblyRecord | null => {
  const rootAssemblyId = state.currentProject.rootAssemblyId
  if (rootAssemblyId === null) {
    return null
  }
  return state.projectContent.assembliesById[rootAssemblyId] ?? null
}

export const selectCurrentProjectRootComponents = (
  state: Pick<AppState, 'currentProject' | 'projectContent'>,
): ProjectComponentRecord[] => {
  const rootAssembly = selectCurrentProjectRootAssembly(state)
  if (rootAssembly === null) {
    return []
  }
  return rootAssembly.childRowIds
    .map((rowId) => state.projectContent.componentsById[rowId] ?? null)
    .filter((component): component is ProjectComponentRecord => component !== null)
}

const selectProjectObjectsForComponent = (
  state: Pick<AppState, 'projectContent'>,
  component: ProjectComponentRecord,
): ProjectObjectRecord[] =>
  component.childObjectIds
    .map((objectId) => state.projectContent.objectsById[objectId] ?? null)
    .filter((objectRow): objectRow is ProjectObjectRecord => objectRow !== null)

const selectGraphOwnedBuildState = (
  graphRuntimeByDocumentId: Record<string, GraphRuntimeState>,
  graphDocumentId: string,
): ProjectContentBuildState => {
  const compileBuild = graphRuntimeByDocumentId[graphDocumentId]?.compileBuild
  if ((compileBuild?.inFlightBuildSeq ?? null) !== null) {
    return 'building'
  }
  if (
    compileBuild !== undefined &&
    compileBuild.latestAcceptedGraphRevision !== null &&
    compileBuild.latestAcceptedGraphRevision === compileBuild.currentGraphRevision
  ) {
    return 'done'
  }
  return 'rebuild'
}

const selectProjectContentBuildState = (options: {
  graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
  ownerGraphDocumentIds: string[]
  hasUnresolvedContent: boolean
  hasContent: boolean
}): {
  buildState: ProjectContentBuildState
  buildStateLabel: string
} => {
  const {
    graphRuntimeByDocumentId,
    hasContent,
    hasUnresolvedContent,
    ownerGraphDocumentIds,
  } = options

  if (!hasContent) {
    return {
      buildState: 'done',
      buildStateLabel: '',
    }
  }

  const graphBuildStates = ownerGraphDocumentIds.map((graphDocumentId) =>
    selectGraphOwnedBuildState(graphRuntimeByDocumentId, graphDocumentId),
  )

  if (graphBuildStates.includes('building')) {
    return {
      buildState: 'building',
      buildStateLabel: 'Building',
    }
  }

  if (hasUnresolvedContent || graphBuildStates.includes('rebuild')) {
    return {
      buildState: 'rebuild',
      buildStateLabel: 'Rebuild',
    }
  }

  return {
    buildState: 'done',
    buildStateLabel: 'Built',
  }
}

export const selectCurrentProjectContentBrowserRows = (
  state: Pick<AppState, 'currentProject' | 'projectContent' | 'sketchVisibilityByRowId'> & {
    partsVisibility?: PartsVisibility
    graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
    graphDocumentsById: Record<string, GraphDocument>
  },
): ProjectContentBrowserRowVm[] => {
  const partsVisibility = state.partsVisibility ?? {}
  const buildViewerVisibilityPartKeys = (
    graphDocumentId: string,
    slotId: string | null,
  ): string[] =>
    slotId === null ? [] : [slotId, `${graphDocumentId}:${slotId}`]
  const resolveContentVisibility = (partKeys: readonly string[]): boolean =>
    partKeys.length > 0 && partKeys.some((partKey) => partsVisibility[partKey] ?? true)
  const rootAssembly = selectCurrentProjectRootAssembly(state)
  if (rootAssembly === null) {
    return []
  }
  const assemblyHasContent = rootAssembly.childRowIds.length > 0
  let assemblyHasUnresolvedContent = false
  const assemblyRebuildGraphDocumentIds = new Set<string>()
  const rows: ProjectContentBrowserRowVm[] = [
    {
      rowId: rootAssembly.assemblyId,
      kind: 'assembly',
      label: rootAssembly.label,
      meta: '',
      isVisible: false,
      visibilityPartKeys: [],
      buildState: 'done',
      buildStateLabel: '',
      rebuildGraphDocumentIds: [],
      statusLabel: '',
      statusTone: 'quiet',
    },
  ]
  const graphLabelByDocumentId = new Map(
    state.currentProject.graphDocuments.map((documentEntry) => [
      documentEntry.graphDocumentId,
      documentEntry.label,
    ] as const),
  )
  for (const childRowId of rootAssembly.childRowIds) {
    const component = state.projectContent.componentsById[childRowId]
    if (component === undefined) {
      const objectRow = state.projectContent.objectsById[childRowId]
      if (objectRow === undefined) {
        continue
      }
      const sourceGraphLabel =
        graphLabelByDocumentId.get(objectRow.sourceGraphDocumentId) ?? objectRow.sourceGraphDocumentId
      const hasUnresolvedContent = objectRow.resolutionState !== 'resolved'
      assemblyHasUnresolvedContent ||= hasUnresolvedContent
      const objectBuildState = selectProjectContentBuildState({
        graphRuntimeByDocumentId: state.graphRuntimeByDocumentId,
        ownerGraphDocumentIds: [objectRow.ownerGraphDocumentId],
        hasUnresolvedContent,
        hasContent: true,
      })
      if (objectBuildState.buildState === 'rebuild') {
        assemblyRebuildGraphDocumentIds.add(objectRow.ownerGraphDocumentId)
      }
      const objectVisibilityPartKeys = buildViewerVisibilityPartKeys(
        objectRow.ownerGraphDocumentId,
        objectRow.slotId,
      )
      rows.push({
        rowId: objectRow.objectId,
        kind: 'object',
        label: objectRow.label,
        meta:
          objectRow.objectSourceKind === 'receive-link'
            ? objectRow.resolutionState === 'resolved'
            ? 'Linked Object'
            : 'Unresolved Link'
          : sourceGraphLabel,
        isVisible:
          objectRow.resolutionState === 'resolved' && resolveContentVisibility(objectVisibilityPartKeys),
        visibilityPartKeys: objectRow.resolutionState === 'resolved' ? objectVisibilityPartKeys : [],
        buildState: objectBuildState.buildState,
        buildStateLabel: objectBuildState.buildStateLabel,
        rebuildGraphDocumentIds:
          objectBuildState.buildState === 'rebuild' ? [objectRow.ownerGraphDocumentId] : [],
        statusLabel: objectRow.resolutionState === 'resolved' ? '' : 'Unresolved',
        statusTone: objectRow.resolutionState === 'resolved' ? 'quiet' : 'warning',
        ownerGraphDocumentId: objectRow.ownerGraphDocumentId,
        parentComponentId: objectRow.parentComponentId,
        objectSourceKind: objectRow.objectSourceKind,
        sourceGraphDocumentId: objectRow.sourceGraphDocumentId,
        sourceOutputEntryId: objectRow.sourceOutputEntryId,
        slotId: objectRow.slotId,
        sourceNodeId: objectRow.sourceNodeId,
        resolutionState: objectRow.resolutionState,
        highlightViewerKey:
          objectRow.resolutionState === 'resolved' ? objectRow.slotId : null,
        authoringGraphDocumentId: objectRow.sourceGraphDocumentId,
        authoringNodeId: objectRow.sourceNodeId,
      })
      continue
    }
    const componentObjects = selectProjectObjectsForComponent(state, component)
    const singleResolvedObject =
      componentObjects.length === 1 && componentObjects[0]?.resolutionState === 'resolved'
        ? componentObjects[0]
        : null
    const sourceOutputEntry =
      component.sourceOutputEntryId === null
        ? null
        : (state.graphRuntimeByDocumentId[component.sourceGraphDocumentId]?.outputSurface?.entries.find(
            (entry) => entry.outputEntryId === component.sourceOutputEntryId,
          ) ?? null)
    const slotId =
      component.componentSourceKind === 'published-component'
        ? singleResolvedObject?.slotId ?? null
        : sourceOutputEntry?.slotId ?? null
    const sourceNodeId =
      component.componentSourceKind === 'published-component'
        ? singleResolvedObject?.sourceNodeId ?? null
        : sourceOutputEntry?.sourceNodeId ?? component.sourceNodeId
    const sourceGraphLabel =
      graphLabelByDocumentId.get(component.sourceGraphDocumentId) ?? component.sourceGraphDocumentId
    const componentVisibilityPartKeys = componentObjects
      .filter((objectRow) => objectRow.resolutionState === 'resolved' && objectRow.slotId !== null)
      .flatMap((objectRow) =>
        buildViewerVisibilityPartKeys(objectRow.ownerGraphDocumentId, objectRow.slotId),
      )
    const componentHasUnresolvedObject = componentObjects.some(
      (objectRow) => objectRow.resolutionState !== 'resolved',
    )
    const componentHasUnresolvedContent =
      component.componentSourceKind === 'published-component'
        ? componentHasUnresolvedObject
        : component.resolutionState !== 'resolved'
    if (component.componentSourceKind === 'published-component') {
      assemblyHasUnresolvedContent ||= componentHasUnresolvedObject
    } else {
      assemblyHasUnresolvedContent ||= component.resolutionState !== 'resolved'
    }
    const componentBuildState = selectProjectContentBuildState({
      graphRuntimeByDocumentId: state.graphRuntimeByDocumentId,
      ownerGraphDocumentIds: [component.ownerGraphDocumentId],
      hasUnresolvedContent: componentHasUnresolvedContent,
      hasContent: true,
    })
    if (componentBuildState.buildState === 'rebuild') {
      assemblyRebuildGraphDocumentIds.add(component.ownerGraphDocumentId)
    }
    const componentStatusLabel =
      component.componentSourceKind === 'published-component'
        ? componentObjects.length === 0
          ? ''
          : componentHasUnresolvedObject
            ? 'Unresolved'
            : 'Ready'
        : ''
    const componentStatusTone =
      componentStatusLabel === 'Unresolved'
        ? 'warning'
        : componentStatusLabel === 'Ready'
          ? 'ready'
          : 'quiet'
    rows.push({
      rowId: component.componentId,
      kind: 'component',
      label: component.label,
      meta:
        component.componentSourceKind === 'receive-link'
          ? component.resolutionState === 'resolved'
            ? 'Linked Component'
            : 'Unresolved Link'
          : sourceGraphLabel,
      isVisible: resolveContentVisibility(componentVisibilityPartKeys),
      visibilityPartKeys: componentVisibilityPartKeys,
      buildState: componentBuildState.buildState,
      buildStateLabel: componentBuildState.buildStateLabel,
      rebuildGraphDocumentIds:
        componentBuildState.buildState === 'rebuild' ? [component.ownerGraphDocumentId] : [],
      ownerGraphDocumentId: component.ownerGraphDocumentId,
      sourceGraphDocumentId: component.sourceGraphDocumentId,
      sourceOutputEntryId: component.sourceOutputEntryId,
      componentSourceKind: component.componentSourceKind,
      resolutionState: component.resolutionState,
      receiveId: component.receiveId,
      childObjectCount: component.childObjectIds.length,
      statusLabel: componentStatusLabel,
      statusTone: componentStatusTone,
      slotId,
      sourceNodeId,
      highlightViewerKey:
        component.componentSourceKind === 'published-component' ? singleResolvedObject?.slotId ?? null : slotId,
      authoringGraphDocumentId: component.sourceGraphDocumentId,
      authoringNodeId:
        component.componentSourceKind === 'published-component'
          ? singleResolvedObject?.sourceNodeId ?? null
          : sourceNodeId,
    })
    componentObjects.forEach((objectRow) => {
      const hasUnresolvedContent = objectRow.resolutionState !== 'resolved'
      const objectBuildState = selectProjectContentBuildState({
        graphRuntimeByDocumentId: state.graphRuntimeByDocumentId,
        ownerGraphDocumentIds: [objectRow.ownerGraphDocumentId],
        hasUnresolvedContent,
        hasContent: true,
      })
      if (objectBuildState.buildState === 'rebuild') {
        assemblyRebuildGraphDocumentIds.add(objectRow.ownerGraphDocumentId)
      }
      const objectVisibilityPartKeys = buildViewerVisibilityPartKeys(
        objectRow.ownerGraphDocumentId,
        objectRow.slotId,
      )
      rows.push({
        rowId: objectRow.objectId,
        kind: 'object',
        label: objectRow.label,
        meta: '',
        isVisible:
          objectRow.resolutionState === 'resolved' && resolveContentVisibility(objectVisibilityPartKeys),
        visibilityPartKeys: objectRow.resolutionState === 'resolved' ? objectVisibilityPartKeys : [],
        buildState: objectBuildState.buildState,
        buildStateLabel: objectBuildState.buildStateLabel,
        rebuildGraphDocumentIds:
          objectBuildState.buildState === 'rebuild' ? [objectRow.ownerGraphDocumentId] : [],
        statusLabel: objectRow.resolutionState === 'resolved' ? '' : 'Unresolved',
        statusTone: objectRow.resolutionState === 'resolved' ? 'quiet' : 'warning',
        ownerGraphDocumentId: objectRow.ownerGraphDocumentId,
        parentComponentId: objectRow.parentComponentId,
        objectSourceKind: objectRow.objectSourceKind,
        sourceGraphDocumentId: objectRow.sourceGraphDocumentId,
        sourceOutputEntryId: objectRow.sourceOutputEntryId,
        slotId: objectRow.slotId,
        sourceNodeId: objectRow.sourceNodeId,
        resolutionState: objectRow.resolutionState,
        highlightViewerKey: objectRow.resolutionState === 'resolved' ? objectRow.slotId : null,
        authoringGraphDocumentId: objectRow.sourceGraphDocumentId,
        authoringNodeId: objectRow.sourceNodeId,
      })
    })
  }
  const assemblyBuildState = selectProjectContentBuildState({
    graphRuntimeByDocumentId: state.graphRuntimeByDocumentId,
    ownerGraphDocumentIds: [...new Set(rootAssembly.childRowIds
      .map((childRowId) => state.projectContent.componentsById[childRowId]?.ownerGraphDocumentId ?? state.projectContent.objectsById[childRowId]?.ownerGraphDocumentId ?? null)
      .filter((graphDocumentId): graphDocumentId is string => graphDocumentId !== null))],
    hasUnresolvedContent: assemblyHasUnresolvedContent,
    hasContent: assemblyHasContent,
  })
  const rootAssemblyRow = rows[0] as Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }>
  const assemblyVisibilityPartKeys = rows.flatMap((row) =>
    row.kind === 'object' || row.kind === 'component' ? (row.visibilityPartKeys ?? []) : [],
  )
  rows[0] = {
    ...rootAssemblyRow,
    isVisible: resolveContentVisibility(assemblyVisibilityPartKeys),
    visibilityPartKeys: [...new Set(assemblyVisibilityPartKeys)],
    buildState: assemblyBuildState.buildState,
    buildStateLabel: assemblyBuildState.buildStateLabel,
    rebuildGraphDocumentIds: [...assemblyRebuildGraphDocumentIds],
    statusLabel: assemblyHasContent ? (assemblyHasUnresolvedContent ? 'Unresolved' : 'Ready') : '',
    statusTone:
      !assemblyHasContent ? 'quiet' : assemblyHasUnresolvedContent ? 'warning' : 'ready',
  }

  const sketchRows: Array<Extract<ProjectContentBrowserRowVm, { kind: 'sketch' }>> = []
  state.currentProject.graphDocuments.forEach((documentEntry) => {
    const graphDocument = state.graphDocumentsById[documentEntry.graphDocumentId]
    if (graphDocument === undefined) {
      return
    }

    let sketchIndex = 0
    graphDocument.graph.nodes.forEach((node) => {
      if (node.type !== 'Geometry/Sketch') {
        return
      }

      const parsedSketch = sketchFeatureSchema.safeParse(node.params.sketch)
      if (!parsedSketch.success) {
        return
      }

      sketchIndex += 1
      const feature = parsedSketch.data
      const profileCount = feature.outputs.profiles.length
      const diagnosticsCount = feature.outputs.diagnostics?.length ?? 0
      const sketchBuildState = selectProjectContentBuildState({
        graphRuntimeByDocumentId: state.graphRuntimeByDocumentId,
        ownerGraphDocumentIds: [documentEntry.graphDocumentId],
        hasUnresolvedContent: diagnosticsCount > 0,
        hasContent: true,
      })

      const componentCount = feature.components.length
      const statusLabel =
        diagnosticsCount > 0 ? 'Diagnostics' : profileCount > 0 ? 'Ready' : 'Draft'
      const statusTone =
        diagnosticsCount > 0 ? 'warning' : profileCount > 0 ? 'ready' : 'quiet'
      const sketchMeta = [
        documentEntry.label,
        feature.plane,
        `${componentCount} comp${componentCount === 1 ? '' : 's'}`,
        `${profileCount} profile${profileCount === 1 ? '' : 's'}`,
      ].join(' | ')

      sketchRows.push({
        rowId: buildProjectSketchBrowserRowId(
          documentEntry.graphDocumentId,
          node.nodeId,
          feature.featureId,
        ),
        kind: 'sketch',
        label: `Sketch ${sketchIndex}`,
        meta: sketchMeta,
        isVisible:
          state.sketchVisibilityByRowId[
            buildProjectSketchBrowserRowId(
              documentEntry.graphDocumentId,
              node.nodeId,
              feature.featureId,
            )
          ] ?? false,
        buildState: sketchBuildState.buildState,
        buildStateLabel: sketchBuildState.buildStateLabel,
        rebuildGraphDocumentIds:
          sketchBuildState.buildState === 'rebuild' ? [documentEntry.graphDocumentId] : [],
        statusLabel,
        statusTone,
        ownerGraphDocumentId: documentEntry.graphDocumentId,
        graphDocumentId: documentEntry.graphDocumentId,
        nodeId: node.nodeId,
        featureId: feature.featureId,
        plane: feature.plane,
        componentCount,
        profileCount,
        diagnosticsCount,
        authoringGraphDocumentId: documentEntry.graphDocumentId,
        authoringNodeId: node.nodeId,
      })
    })
  })

  if (sketchRows.length > 0) {
    rows.push({
      rowId: buildProjectSketchesRootRowId(state.currentProject.projectFileId),
      kind: 'sketches-root',
      label: 'Sketches',
      meta: `${sketchRows.length} sketch${sketchRows.length === 1 ? '' : 'es'}`,
      sketchCount: sketchRows.length,
    })
    rows.push(...sketchRows)
  }

  return rows
}

export const selectReferenceWorkspaceBrowserTree = (
  state: Pick<AppState, 'referenceWorkspace'>,
): ReferenceWorkspaceBrowserTreeVm => {
  const manifestCategories = REFERENCE_MANIFEST_CATEGORIES.map((category) => {
    const items = selectReferenceManifestItemsForCategory(category.categoryId).map((item) => ({
      rowId: `reference-item-row:${item.referenceId}`,
      referenceId: item.referenceId,
      sourceKind: 'manifest' as const,
      label: item.label,
      categoryId: item.categoryId,
      fileType: item.fileType,
      assetPath: resolveReferenceAssetPath(item.assetPath),
      displayTransform: item.displayTransform,
      isVisible: state.referenceWorkspace.visibilityById[item.referenceId] ?? false,
      loadState: state.referenceWorkspace.loadStateById[item.referenceId] ?? 'unloaded',
      errorMessage: state.referenceWorkspace.errorById[item.referenceId] ?? null,
      transformOverride: state.referenceWorkspace.transformOverrideById[item.referenceId] ?? null,
    }))

    return {
      rowId: `reference-category-row:${category.categoryId}`,
      categoryId: category.categoryId,
      label: category.label,
      isExpanded: state.referenceWorkspace.categoryExpandedById[category.categoryId] ?? true,
      itemCount: items.length,
      visibleItemCount: items.filter((item) => item.isVisible).length,
      hasLoadingItem: items.some((item) => item.isVisible && item.loadState === 'loading'),
      hasErrorItem: items.some((item) => item.loadState === 'error'),
      emptyLabel: 'No loadable references yet.',
      items,
    }
  })

  const importedItems = state.referenceWorkspace.importedReferenceOrder
    .map((referenceId) => state.referenceWorkspace.importedReferencesById[referenceId] ?? null)
    .filter((item): item is ImportedReferenceRecord => item !== null)
    .map((item) => ({
      rowId: `reference-item-row:${item.referenceId}`,
      referenceId: item.referenceId,
      sourceKind: 'imported' as const,
      label: item.label,
      categoryId: USER_REFERENCE_CATEGORY_ID,
      fileType: item.fileType,
      assetPath: item.assetPath,
      isVisible: state.referenceWorkspace.visibilityById[item.referenceId] ?? false,
      loadState: state.referenceWorkspace.loadStateById[item.referenceId] ?? 'unloaded',
      errorMessage: state.referenceWorkspace.errorById[item.referenceId] ?? null,
      transformOverride: state.referenceWorkspace.transformOverrideById[item.referenceId] ?? null,
    }))

  const categories = [
    ...manifestCategories,
    ...(importedItems.length > 0
      ? [
          {
            rowId: `reference-category-row:${USER_REFERENCE_CATEGORY_ID}`,
            categoryId: USER_REFERENCE_CATEGORY_ID,
            label: USER_REFERENCE_CATEGORY_LABEL,
            isExpanded: state.referenceWorkspace.categoryExpandedById[USER_REFERENCE_CATEGORY_ID] ?? true,
            itemCount: importedItems.length,
            visibleItemCount: importedItems.filter((item) => item.isVisible).length,
            hasLoadingItem: importedItems.some((item) => item.isVisible && item.loadState === 'loading'),
            hasErrorItem: importedItems.some((item) => item.loadState === 'error'),
            emptyLabel: '',
            items: importedItems,
          },
        ]
      : []),
  ]

  return {
    rowId: REFERENCE_ROOT_ROW_ID,
    label: 'References',
    isExpanded: state.referenceWorkspace.referencesExpanded,
    categories,
  }
}

export const selectReferenceWorkspaceItems = (
  state: Pick<AppState, 'referenceWorkspace'>,
): ReferenceWorkspaceBrowserItemVm[] =>
  selectReferenceWorkspaceBrowserTree(state).categories.flatMap((category) => category.items)

const resolveConsoleSelectedTargetLabel = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  target: WorkspaceSelectedTarget,
): string | null => {
  switch (target.kind) {
    case 'assembly':
      return state.projectContent.assembliesById[target.assemblyId]?.label ?? target.assemblyId
    case 'component':
      return state.projectContent.componentsById[target.componentId]?.label ?? target.componentId
    case 'object':
      return state.projectContent.objectsById[target.objectId]?.label ?? target.objectId
    case 'reference-item':
      return (
        selectReferenceWorkspaceItems(state).find((item) => item.referenceId === target.referenceId)?.label ??
        target.referenceId
      )
    case 'part':
      return target.partKey
    case 'graph-document':
      return target.graphDocumentId
    case 'graph-node':
      return target.nodeId
    case 'references-root':
      return 'References'
    case 'reference-category':
      return target.categoryId
    default:
      return null
  }
}

export const selectConsoleWorkspaceContextTarget = (
  state: Pick<AppState, 'workspaceSelection' | 'projectContent' | 'referenceWorkspace'>,
): ConsoleWorkspaceContextTarget | null => {
  const explicitSelectedTargets = state.workspaceSelection.explicitSelectedTargets ?? []
  if (explicitSelectedTargets.length > 1) {
    const selectedLabels = explicitSelectedTargets
      .map((target) => resolveConsoleSelectedTargetLabel(state, target))
      .filter((label): label is string => label !== null)
    return {
      kind: 'multi-select',
      label: 'Multi-Select',
      fallbackGraphDocumentId: null,
      selectedCount: explicitSelectedTargets.length,
      selectedLabels,
    }
  }

  const selectedTarget = state.workspaceSelection.selectedTarget
  if (selectedTarget === null) {
    return null
  }
  if (selectedTarget.kind === 'graph-document' || selectedTarget.kind === 'graph-node') {
    return selectedTarget
  }
  if (selectedTarget.kind === 'references-root') {
    const referenceTree = selectReferenceWorkspaceBrowserTree(state)
    const referenceItems = referenceTree.categories.flatMap((category) => category.items)
    const canLoadAll = referenceItems.some(
      (item) => !item.isVisible || item.loadState === 'error' || item.loadState === 'unloaded',
    )
    return {
      kind: 'references-root',
      label: 'References',
      fallbackGraphDocumentId: null,
      canLoadAll,
      categoryOptions: referenceTree.categories.map((category) => ({
        categoryId: category.categoryId,
        label: category.label,
      })),
    }
  }
  if (selectedTarget.kind === 'reference-category') {
    const referenceTree = selectReferenceWorkspaceBrowserTree(state)
    const category = referenceTree.categories.find(
      (currentCategory) => currentCategory.categoryId === selectedTarget.categoryId,
    )
    if (category === undefined) {
      return null
    }
    return {
      kind: 'reference-category',
      categoryId: category.categoryId,
      label: category.label,
      fallbackGraphDocumentId: null,
      canLoadAll: category.items.some(
        (item) => !item.isVisible || item.loadState === 'error' || item.loadState === 'unloaded',
      ),
    }
  }
  if (selectedTarget.kind === 'assembly') {
    const assembly = state.projectContent.assembliesById[selectedTarget.assemblyId]
    if (assembly === undefined) {
      return null
    }
    return {
      kind: 'assembly',
      assemblyId: assembly.assemblyId,
      label: assembly.label,
      fallbackGraphDocumentId: null,
    }
  }
  if (selectedTarget.kind === 'component') {
    const component = state.projectContent.componentsById[selectedTarget.componentId]
    if (component === undefined) {
      return null
    }
    return {
      kind: 'component',
      componentId: component.componentId,
      label: component.label,
      fallbackGraphDocumentId: component.sourceGraphDocumentId,
    }
  }
  if (selectedTarget.kind === 'object') {
    const objectRow = state.projectContent.objectsById[selectedTarget.objectId]
    if (objectRow === undefined) {
      return null
    }
    return {
      kind: 'object',
      objectId: objectRow.objectId,
      label: objectRow.label,
      fallbackGraphDocumentId: objectRow.sourceGraphDocumentId,
    }
  }
  if (selectedTarget.kind !== 'reference-item') {
    return null
  }
  const referenceItem = selectReferenceWorkspaceItems(state).find(
    (item) => item.referenceId === selectedTarget.referenceId,
  )
  if (referenceItem === undefined) {
    return null
  }
  const referenceCategoryLabel =
    selectReferenceWorkspaceBrowserTree(state).categories.find(
      (category) => category.categoryId === referenceItem.categoryId,
    )?.label ?? referenceItem.categoryId
  return {
    kind: 'reference-item',
    referenceId: referenceItem.referenceId,
    label: referenceItem.label,
    fallbackGraphDocumentId: null,
    canLoadModel: !referenceItem.isVisible && referenceItem.loadState !== 'error',
    referenceCategoryId: referenceItem.categoryId,
    referenceCategoryLabel,
  }
}

const syncCurrentProjectFromSpaghetti = (
  spaghettiState: Pick<
    SpaghettiStoreState,
    'graphDocumentsById' | 'graphDocumentOrder' | 'graphRuntimeByDocumentId'
  >,
): void => {
  const nextGraphDocuments = buildProjectGraphDocuments(spaghettiState)
  useAppStore.setState((state) => {
    const nextRootAssemblyId =
      state.currentProject.rootAssemblyId ?? buildRootAssemblyId(state.currentProject.projectFileId)
    const currentProjectChanged =
      !areProjectGraphDocumentsEqual(state.currentProject.graphDocuments, nextGraphDocuments) ||
      state.currentProject.rootAssemblyId !== nextRootAssemblyId
    const nextCurrentProject = currentProjectChanged
      ? {
          ...state.currentProject,
          graphDocuments: nextGraphDocuments,
          rootAssemblyId: nextRootAssemblyId,
        }
      : state.currentProject
    const nextProjectContent = buildProjectContentState(nextCurrentProject, spaghettiState, {
      currentProject: nextCurrentProject,
      projectContent: state.projectContent,
      browserGraphBuildPolicyByGraphDocumentId:
        state.browserGraphBuildPolicyByGraphDocumentId,
      browserContentBuildPolicyByRowId: state.browserContentBuildPolicyByRowId,
    })

    if (
      nextCurrentProject === state.currentProject &&
      areProjectContentStatesEqual(state.projectContent, nextProjectContent)
    ) {
      return state
    }
    return {
      currentProject: nextCurrentProject,
      projectContent: nextProjectContent,
    }
  })
}

const handleBrowserGraphRuntimeRevisionChange = (graphDocumentId: string): void => {
  const state = useAppStore.getState()
  const policy = selectEffectiveBrowserExecutionPolicy(state, {
    kind: 'graph-document',
    graphDocumentId,
  })

  if (policy === 'live') {
    state.requestBrowserGraphDocumentBuild(graphDocumentId)
    return
  }

  if (policy === 'release') {
    if (state.browserInteractionGraphDocumentIds[graphDocumentId] === true) {
      useAppStore.setState((current) => ({
        pendingBrowserBuildGraphDocumentIds: {
          ...current.pendingBrowserBuildGraphDocumentIds,
          [graphDocumentId]: true,
        },
      }))
      return
    }
    state.requestBrowserGraphDocumentBuild(graphDocumentId)
    return
  }

  useAppStore.setState((current) => ({
    pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
      current.pendingBrowserBuildGraphDocumentIds,
      graphDocumentId,
    ),
  }))
}

useSpaghettiStore.subscribe((state, previousState) => {
  if (
    state.graphDocumentOrder === previousState.graphDocumentOrder &&
    state.graphDocumentsById === previousState.graphDocumentsById &&
    state.graphRuntimeByDocumentId === previousState.graphRuntimeByDocumentId
  ) {
    return
  }
  syncCurrentProjectFromSpaghetti(state)

  const changedGraphDocumentIds = new Set<string>([
    ...Object.keys(state.graphRuntimeByDocumentId),
    ...Object.keys(previousState.graphRuntimeByDocumentId),
  ])

  for (const graphDocumentId of changedGraphDocumentIds) {
    const nextRevision =
      state.graphRuntimeByDocumentId[graphDocumentId]?.compileBuild.currentGraphRevision ?? null
    const previousRevision =
      previousState.graphRuntimeByDocumentId[graphDocumentId]?.compileBuild.currentGraphRevision ??
      null
    if (
      nextRevision === null ||
      previousRevision === null ||
      nextRevision === previousRevision
    ) {
      continue
    }
    handleBrowserGraphRuntimeRevisionChange(graphDocumentId)
  }
})
