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
import { selectSharedPreviewRenderVm } from '../spaghetti/selectors/selectSharedPreviewRenderVm'
import { sketchFeatureSchema } from '../spaghetti/features/featureSchema'
import { buildRequestFromBuildInputs } from '../spaghetti/integration/buildInputsToRequest'
import {
  buildGraphPublishedContentSurface,
  buildQualifiedGraphOutputEntryId,
  type GraphOutputSurface,
  type GraphPublishedContentSurface,
} from '../spaghetti/outputSurface'
import { OUTPUT_PREVIEW_DEFAULT_COMPONENT_LABEL } from '../spaghetti/system/outputPreviewNode'
import {
  type BuildChangedInputHint,
  DEFAULT_BUILD_EXECUTION_INTENT,
  type BuildIdentity,
  type BuildInvalidation,
  type BuildExecutionIntent,
  type BuildResult,
  type CompiledBuildData,
  type GeometryExecutionTarget,
  toViewerRenderablePart,
  type ViewerRenderablePart,
} from '../../shared/buildTypes'
import {
  deriveAuthoritativeExportInput,
  type ExportPreparationResult,
} from '../../shared/exportTypes'
import { newId } from '../spaghetti/utils/id'
import {
  REFERENCE_MANIFEST_CATEGORIES,
  REFERENCE_MANIFEST_ITEMS,
  USER_REFERENCE_CATEGORY_ID,
  USER_REFERENCE_CATEGORY_LABEL,
  resolveReferenceAssetPath,
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
import {
  selectViewportResultModeById,
  selectViewportResultModeBehaviorById,
  useWorkspaceStore,
  type WorkspaceStoreState,
} from '../workspace/useWorkspaceStore'
import type { WorkspaceViewportResultModeBehavior } from '../workspace/workspaceViewportResultMode'

type PartsVisibility = Record<string, boolean>
type BuildPolicy = 'live' | 'release' | 'manual'
export type BrowserBuildPolicy = 'live' | 'release' | 'manual' | 'off'
export type BrowserBuildExecutionTarget = {
  kind: 'graph-document'
  graphDocumentId: string
}
export type GraphDocumentBuildRequestOptions = {
  browserExecutionPolicy?: BrowserBuildPolicy
  explicit?: boolean
  reuseCurrentAcceptedPreviewComparison?: boolean
  delayedDraftDispatchTrigger?: BuildExecutionIntent['draftPolicy']
  delayedAuthoritativeDispatchTrigger?: BuildExecutionIntent['authoritativePolicy']
  draftPolicyOverride?: BuildExecutionIntent['draftPolicy']
  authoritativePolicyOverride?: BuildExecutionIntent['authoritativePolicy']
  geometryTargetOverride?: GeometryExecutionTarget
}
export type DelayedDraftBuildPlaceholder = {
  projectFileId: string
  graphDocumentId: string
  graphRevision: number
  compileResult: CompileSpaghettiGraphResult
  previousBuildInputs: CompileSpaghettiGraphResult['buildInputs'] | null
  executionIntent: BuildExecutionIntent
  compiledBuildData: CompiledBuildData
  buildIdentity: BuildIdentity
  invalidation: BuildInvalidation
  changedParamIds: string[]
  changedInputHint?: BuildChangedInputHint
  buildStatsPartKeys: string[]
}
export type DelayedAuthoritativeBuildPlaceholder = {
  projectFileId: string
  graphDocumentId: string
  graphRevision: number
  compileResult: CompileSpaghettiGraphResult
  previousBuildInputs: CompileSpaghettiGraphResult['buildInputs'] | null
  executionIntent: BuildExecutionIntent
  compiledBuildData: CompiledBuildData
  buildIdentity: BuildIdentity
  invalidation: BuildInvalidation
  changedParamIds: string[]
  changedInputHint?: BuildChangedInputHint
  buildStatsPartKeys: string[]
}
export type DraftSchedulingRuntimeEventType =
  | 'draft_delayed'
  | 'draft_released'
  | 'draft_replaced'
  | 'draft_suppressed'
export type DraftSchedulingRuntimeEvent = {
  eventSeq: number
  type: DraftSchedulingRuntimeEventType
  graphDocumentId: string
  draftPolicy: BuildExecutionIntent['draftPolicy']
}
export type ViewportPresentationStateId = 'lastLoaded' | 'previewMesh' | 'previewBrep'
export type ViewportPresentationStyleSettings = {
  opacity: number
  color: string
}
export type ViewportPresentationSettings = Record<
  ViewportPresentationStateId,
  ViewportPresentationStyleSettings
>
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

export type ActiveContentObjectTransformSession = {
  objectId: string
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

export type ViewerTransformTarget =
  | {
      kind: 'reference'
      referenceId: string
    }
  | {
      kind: 'content-object'
      objectId: string
    }

export type ActiveViewerTransformSession = {
  targetKind: ViewerTransformTarget['kind']
  targetId: string
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
  sourceKind: ReferenceSourceKind
  categoryId: ReferenceCategoryId
  label: string
  fileType: ReferenceFileType
  assetPath: string
  parentAssemblyId: string | null
  parentComponentId: string | null
}

export type ReferenceWorkspacePartVm = {
  rowId: string
  partKey: string
  label: string
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
  parentAssemblyId?: string | null
  assemblySourceKind?: 'runtime-root' | 'authored'
  childRowIds: string[]
}

export type ProjectComponentRecord = {
  componentId: string
  parentAssemblyId?: string | null
  parentComponentId?: string | null
  ownerGraphDocumentId: string | null
  sourceGraphDocumentId: string | null
  sourceOutputEntryId: string | null
  sourceNodeId: string | null
  label: string
  componentSourceKind: 'published-component' | 'receive-link' | 'authored'
  resolutionState: 'resolved' | 'unresolved'
  receiveId: string | null
  childRowIds?: string[]
  childObjectIds: string[]
}

export type ProjectObjectRecord = {
  objectId: string
  ownerGraphDocumentId: string
  parentAssemblyId?: string | null
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

export type RuntimeContentPlacementRecord = {
  parentAssemblyId: string | null
  parentComponentId: string | null
}

export type ProjectContentBrowserRowVm =
  | {
      rowId: string
      kind: 'assembly'
      label: string
      meta: string
      parentAssemblyId?: string | null
      isVisible?: boolean
      visibilityPartKeys?: string[]
      buildState?: ProjectContentBuildState
      buildStateLabel?: string
      rebuildGraphDocumentIds?: string[]
      statusLabel?: string
      statusTone?: 'quiet' | 'ready' | 'warning'
      referenceContainerKind?: 'root' | null
      referenceCategoryId?: ReferenceCategoryId | null
      referenceContainerItemCount?: number | null
      referenceContainerEmptyLabel?: string | null
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
      parentAssemblyId?: string | null
      parentComponentId?: string | null
      isVisible?: boolean
      visibilityPartKeys?: string[]
      buildState?: ProjectContentBuildState
      buildStateLabel?: string
      rebuildGraphDocumentIds?: string[]
      statusLabel?: string
      statusTone?: 'quiet' | 'ready' | 'warning'
      ownerGraphDocumentId: string | null
      sourceGraphDocumentId: string | null
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
      referenceContainerKind?: 'category' | null
      referenceCategoryId?: ReferenceCategoryId | null
      referenceContainerItemCount?: number | null
      referenceContainerEmptyLabel?: string | null
    }
  | {
      rowId: string
      kind: 'object'
      label: string
      meta: string
      parentAssemblyId?: string | null
      isVisible?: boolean
      visibilityPartKeys?: string[]
      buildState?: ProjectContentBuildState
      buildStateLabel?: string
      rebuildGraphDocumentIds?: string[]
      statusLabel?: string
      statusTone?: 'quiet' | 'ready' | 'warning'
      ownerGraphDocumentId: string | null
      parentComponentId: string | null
      objectSourceKind: ProjectObjectRecord['objectSourceKind'] | null
      sourceGraphDocumentId: string | null
      sourceOutputEntryId: string | null
      slotId: string | null
      sourceNodeId: string | null
      resolutionState: ProjectObjectRecord['resolutionState'] | null
      highlightViewerKey: string | null
      authoringGraphDocumentId: string | null
      authoringNodeId: string | null
      contentOriginKind?: 'generated' | 'imported-reference' | 'source-reference'
      referenceId?: string | null
      referenceSourceKind?: ImportedReferenceRecord['sourceKind'] | null
      referenceCategoryId?: ReferenceCategoryId | null
      referenceLoadState?: ReferenceItemLoadState | null
      fileType?: ReferenceFileType | null
      assetPath?: string | null
      errorMessage?: string | null
      partRows?: ReferenceWorkspacePartVm[]
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
  transformSnapByObjectId: Record<string, ReferenceTransformSnapState>
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
  contentObjectTransformOverrideById: Record<string, ReferenceTransformOverride | null>
  transformHistoryByObjectId: Record<string, ReferenceTransformHistoryEntry[]>
  activeContentObjectTransformSession: ActiveContentObjectTransformSession | null
  importedReferencesById: Record<string, ImportedReferenceRecord>
  importedReferenceOrder: string[]
  partRowsByReferenceId: Record<string, ReferenceWorkspacePartVm[]>
  contentOrderByParentKey: Record<string, string[]>
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
  parentAssemblyId?: string | null
  parentComponentId?: string | null
  parts: ReferenceWorkspacePartVm[]
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

type ReferenceWorkspaceRuntimeTraitSource = Pick<
  ReferenceWorkspaceState,
  'visibilityById' | 'loadStateById' | 'errorById' | 'partRowsByReferenceId'
> &
  Partial<Pick<ReferenceWorkspaceState, 'transformOverrideById'>>

export type ReferenceRuntimeTraits = {
  isVisible: boolean
  loadState: ReferenceItemLoadState
  errorMessage: string | null
  transformOverride: ReferenceTransformOverride | null
  parts: ReferenceWorkspacePartVm[]
}

export type ReferenceWorkspaceBrowserTreeVm = {
  rowId: string
  label: string
  isExpanded: boolean
  categories: ReferenceWorkspaceBrowserCategoryVm[]
}

export type RenderedProjectPartVm = {
  objectId: string
  parentAssemblyId: string | null
  parentComponentId: string | null
  ownerGraphDocumentId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  sourceNodeId: string | null
  slotId: string | null
  label: string
  viewerKey: string
  viewerPart: ViewerRenderablePart
  isVisible: boolean
}

export type RenderedProjectPartSetVm = {
  parts: RenderedProjectPartVm[]
  viewerParts: ViewerRenderablePart[]
  contributingGraphDocumentIds: string[]
}

const REFERENCE_MANIFEST_ITEM_BY_ID = Object.fromEntries(
  REFERENCE_MANIFEST_ITEMS.map((item) => [item.referenceId, item] as const),
) satisfies Record<string, ReferenceManifestItem>

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

export type WorkspaceSelectedContentOwnerKind = 'assembly' | 'component' | 'object-part'

export type WorkspaceSelectedContentOwnerTarget = {
  ownerKind: WorkspaceSelectedContentOwnerKind
  ownerId: string
  ownerLabel: string
  parentOwnerId: string | null
  parentOwnerKind: Extract<WorkspaceSelectedContentOwnerKind, 'assembly' | 'component'> | null
  parentOwnerLabel: string | null
  fallbackGraphDocumentId: string | null
  supportsViewerTransform: boolean
  supportsSelectAll: boolean
  supportsRename: boolean
  supportsDelete: boolean
}

export type ProjectContentOwnerTarget =
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
      kind: 'imported-reference'
      referenceId: string
    }

export type BrowserDraggableTarget =
  | ProjectContentOwnerTarget

export type ProjectContentContainerTarget =
  | {
      kind: 'assembly'
      assemblyId: string
    }
  | {
      kind: 'component'
      componentId: string
    }

export type ProjectContentDropPosition = 'before' | 'after' | 'into'

export type ProjectContentOwnerDropTarget =
  | ({
      kind: 'assembly'
      assemblyId: string
    } & { position: ProjectContentDropPosition })
  | ({
      kind: 'component'
      componentId: string
    } & { position: ProjectContentDropPosition })
  | ({
      kind: 'object'
      objectId: string
    } & { position: ProjectContentDropPosition })

export type ProjectContentOwnerDropResolution =
  | {
      valid: false
      reason:
        | 'missing-owner'
        | 'not-draggable'
        | 'same-row'
        | 'same-parent-into'
        | 'invalid-same-parent'
        | 'illegal-target'
        | 'illegal-container'
        | 'descendant-cycle'
    }
  | {
      valid: true
      kind: 'reorder'
      parentTarget: ProjectContentContainerTarget | null
      draggedTarget: ProjectContentOwnerTarget
      dropTarget: ProjectContentOwnerDropTarget
    }
  | {
      valid: true
      kind: 'reparent'
      parentTarget: ProjectContentContainerTarget
      draggedTarget: ProjectContentOwnerTarget
      dropTarget: ProjectContentOwnerDropTarget
    }

export type BrowserDraggableTargetDropResolution = ProjectContentOwnerDropResolution

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
      contentBreadcrumbLabels?: string[]
      fallbackGraphDocumentId: null
      canDelete: boolean
      canLoadAll?: boolean
      categoryOptions?: Array<{
        categoryId: ReferenceCategoryId
        label: string
      }>
    }
  | {
      kind: 'component'
      componentId: string
      label: string
      contentBreadcrumbLabels?: string[]
      fallbackGraphDocumentId: string | null
      canRename: boolean
      canDelete: boolean
      canLoadAll?: boolean
      referenceCategoryId?: ReferenceCategoryId
    }
  | {
      kind: 'object'
      objectId: string
      label: string
      contentBreadcrumbLabels?: string[]
      fallbackGraphDocumentId: string | null
      referenceId?: string
      canLoadModel?: boolean
      referenceCategoryId?: ReferenceCategoryId
      referenceCategoryLabel?: string
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

export type ConsoleContextSyncSource =
  | 'legacy'
  | 'viewer-activation'
  | 'global-outside-click'
  | 'lost-spaghetti-visibility'
  | 'console-selection-clear'

export type ConsoleContextSyncRequest = {
  reason: ConsoleContextSyncReason
  source: ConsoleContextSyncSource
  seq: number
}

export type ConsoleWorkspaceContextHandoffMode = 'root' | 'graph' | 'node' | 'selection'

export type ConsoleWorkspaceContextHandoff = {
  sourceSurface: WorkspaceSurface | null
  mode: ConsoleWorkspaceContextHandoffMode
  graphDocumentId: string | null
  nodeId: string | null
  editorViewportId: string | null
  selectedTarget: WorkspaceSelectedTarget | null
  seq: number
}

export type ReferenceTransformShellExitRequest = {
  source: 'commit-shell' | 'toolbar-close'
  seq: number
}

const draftSchedulingRuntimeListeners = new Set<(event: DraftSchedulingRuntimeEvent) => void>()
let nextDraftSchedulingRuntimeEventSeq = 1

const DEFAULT_VIEWPORT_PRESENTATION_SETTINGS = {
  lastLoaded: {
    opacity: 0.5,
    color: '#5f83d6',
  },
  previewMesh: {
    opacity: 0.5,
    color: '#ffff00',
  },
  previewBrep: {
    opacity: 0.5,
    color: '#00ff00',
  },
} satisfies ViewportPresentationSettings

const clampViewportPresentationOpacity = (
  value: number,
  fallback: number,
): number => Math.min(1, Math.max(0, Number.isFinite(value) ? value : fallback))

const normalizeViewportPresentationColor = (value: string, fallback: string): string => {
  const trimmed = value.trim()
  const shortHexMatch = /^#([\da-fA-F]{3})$/.exec(trimmed)
  if (shortHexMatch !== null) {
    return `#${shortHexMatch[1]
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
      .toLowerCase()}`
  }
  const longHexMatch = /^#([\da-fA-F]{6})$/.exec(trimmed)
  if (longHexMatch !== null) {
    return `#${longHexMatch[1].toLowerCase()}`
  }
  return fallback
}

const createInitialViewportPresentationSettings = (): ViewportPresentationSettings => ({
  lastLoaded: { ...DEFAULT_VIEWPORT_PRESENTATION_SETTINGS.lastLoaded },
  previewMesh: { ...DEFAULT_VIEWPORT_PRESENTATION_SETTINGS.previewMesh },
  previewBrep: { ...DEFAULT_VIEWPORT_PRESENTATION_SETTINGS.previewBrep },
})

const publishDraftSchedulingRuntimeEvent = (
  event: Omit<DraftSchedulingRuntimeEvent, 'eventSeq'>,
): void => {
  const nextEvent = {
    ...event,
    eventSeq: nextDraftSchedulingRuntimeEventSeq++,
  } satisfies DraftSchedulingRuntimeEvent
  draftSchedulingRuntimeListeners.forEach((listener) => listener(nextEvent))
}

export const subscribeDraftSchedulingRuntimeEvents = (
  listener: (event: DraftSchedulingRuntimeEvent) => void,
): (() => void) => {
  draftSchedulingRuntimeListeners.add(listener)
  return () => {
    draftSchedulingRuntimeListeners.delete(listener)
  }
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
  delayedDraftBuildByGraphDocumentId: Record<string, DelayedDraftBuildPlaceholder>
  delayedAuthoritativeBuildByGraphDocumentId: Record<string, DelayedAuthoritativeBuildPlaceholder>
  isInteracting: boolean
  pendingBuildAfterRelease: boolean
  currentProject: ProjectFile
  projectContent: ProjectContentState
  runtimeContentPlacementByRowId: Record<string, RuntimeContentPlacementRecord>
  viewportPresentationSettings: ViewportPresentationSettings
  referenceWorkspace: ReferenceWorkspaceState
  sketchVisibilityByRowId: Record<string, boolean>
  workspaceSelection: WorkspaceSelectionState
  floatingShellActivationRequest: FloatingShellActivationRequest | null
  consoleContextSyncRequest: ConsoleContextSyncRequest | null
  consoleWorkspaceContextHandoff: ConsoleWorkspaceContextHandoff | null
  referenceTransformShellExitRequest: ReferenceTransformShellExitRequest | null
  workerError: string | null
  setSpaghettiGraph: (graph: SpaghettiGraph) => void
  compileGraphDocument: (graphDocumentId: string) => CompileSpaghettiGraphResult
  requestGraphDocumentBuild: (
    graphDocumentId: string,
    options?: GraphDocumentBuildRequestOptions,
  ) => CompileSpaghettiGraphResult
  prepareGraphDocumentExport: (graphDocumentId: string) => ExportPreparationResult
  compileSpaghetti: () => CompileSpaghettiGraphResult
  requestSpaghettiBuild: () => CompileSpaghettiGraphResult
  prepareSpaghettiExport: () => ExportPreparationResult
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
  setViewportPresentationOpacity: (stateId: ViewportPresentationStateId, opacity: number) => void
  setViewportPresentationColor: (stateId: ViewportPresentationStateId, color: string) => void
  beginBrowserBuildInteraction: (graphDocumentId: string) => void
  endBrowserBuildInteraction: (graphDocumentId: string) => void
  requestBrowserGraphDocumentBuild: (
    graphDocumentId: string,
    options?: GraphDocumentBuildRequestOptions,
  ) => CompileSpaghettiGraphResult | null
  settleGraphViewportComparison: (graphDocumentId: string) => void
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
    parentAssemblyId?: string | null
    parentComponentId?: string | null
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
  createProjectAssembly: () => string
  createProjectComponent: (parentAssemblyId: string) => string | null
  moveProjectContentOwner: (
    draggedTarget: ProjectContentOwnerTarget,
    dropTarget: ProjectContentOwnerDropTarget,
  ) => boolean
  renameProjectContentOwner: (
    target:
      | { kind: 'assembly'; assemblyId: string }
      | { kind: 'component'; componentId: string },
    label: string,
  ) => boolean
  deleteProjectContentOwner: (
    target:
      | { kind: 'assembly'; assemblyId: string }
      | { kind: 'component'; componentId: string },
  ) => boolean
  setReferenceItemLoadState: (
    referenceId: string,
    loadState: ReferenceItemLoadState,
    errorMessage?: string | null,
  ) => void
  setReferenceItemPartRows: (
    referenceId: string,
    partRows: Array<{
      partKey: string
      label: string
    }>,
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
  beginContentObjectTransformShell: (objectId: string) => void
  exitContentObjectTransformShell: () => void
  beginContentObjectTransformEntry: (mode: ReferenceTransformMode) => void
  commitActiveContentObjectTransformEntry: () => void
  setActiveContentObjectTransformMode: (mode: ReferenceTransformMode) => void
  setActiveContentObjectTransformSpace: (space: ReferenceTransformSpace) => void
  setActiveContentObjectTransformHandle: (handle: ActiveReferenceTransformHandle | null) => void
  setActiveContentObjectTransformDraft: (transformOverride: ReferenceTransformOverride | null) => void
  setContentObjectTransformOverride: (
    objectId: string,
    transformOverride: ReferenceTransformOverride | null,
  ) => void
  setActiveContentObjectTransformHistoryScrubIndex: (scrubIndex: number) => void
  resetContentObjectTransform: (objectId: string) => void
  setContentObjectTransformHistoryEntryDeltaValue: (
    objectId: string,
    entryId: string,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => void
  deleteContentObjectTransformHistoryEntry: (objectId: string, entryId: string) => void
  toggleContentObjectTransformHistoryLock: (objectId: string, entryId: string) => void
  mergeContentObjectTransformHistory: (objectId: string) => void
  cancelActiveContentObjectTransformEntry: () => void
  beginViewerTransformShell: (target: ViewerTransformTarget) => void
  exitActiveViewerTransformShell: () => void
  beginActiveViewerTransformEntry: (mode: ReferenceTransformMode) => void
  commitActiveViewerTransformEntry: () => void
  setActiveViewerTransformMode: (mode: ReferenceTransformMode) => void
  setActiveViewerTransformSpace: (space: ReferenceTransformSpace) => void
  setActiveViewerTransformHandle: (handle: ActiveReferenceTransformHandle | null) => void
  setActiveViewerTransformDraft: (transformOverride: ReferenceTransformOverride | null) => void
  setActiveViewerTransformHistoryScrubIndex: (scrubIndex: number) => void
  cancelActiveViewerTransformEntry: () => void
  resetViewerTransform: (target: ViewerTransformTarget) => void
  setViewerTransformHistoryEntryDeltaValue: (
    target: ViewerTransformTarget,
    entryId: string,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => void
  deleteViewerTransformHistoryEntry: (target: ViewerTransformTarget, entryId: string) => void
  toggleViewerTransformHistoryLock: (target: ViewerTransformTarget, entryId: string) => void
  mergeViewerTransformHistory: (target: ViewerTransformTarget) => void
  setViewerTransformSnapEnabled: (
    target: ViewerTransformTarget,
    mode: ReferenceTransformSnapMode,
    enabled: boolean,
  ) => void
  setViewerTransformSnapValue: (
    target: ViewerTransformTarget,
    mode: ReferenceTransformSnapMode,
    value: number,
  ) => void
  setViewerTransformSnapAxisValue: (
    target: ViewerTransformTarget,
    mode: ReferenceTransformSnapMode,
    axis: ReferenceTransformSnapAxis,
    value: number,
  ) => void
  setViewerTransformSnapLocked: (
    target: ViewerTransformTarget,
    mode: ReferenceTransformSnapMode,
    locked: boolean,
  ) => void
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
  setContentObjectTransformSnapEnabled: (
    objectId: string,
    mode: ReferenceTransformSnapMode,
    enabled: boolean,
  ) => void
  setContentObjectTransformSnapValue: (
    objectId: string,
    mode: ReferenceTransformSnapMode,
    value: number,
  ) => void
  setContentObjectTransformSnapAxisValue: (
    objectId: string,
    mode: ReferenceTransformSnapMode,
    axis: ReferenceTransformSnapAxis,
    value: number,
  ) => void
  setContentObjectTransformSnapLocked: (
    objectId: string,
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
  requestConsoleContextSync: (
    reason: ConsoleContextSyncReason,
    source?: ConsoleContextSyncSource,
  ) => void
  requestConsoleWorkspaceContextHandoff: (
    handoff: Omit<ConsoleWorkspaceContextHandoff, 'seq'>,
  ) => void
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
export const REFERENCE_ROOT_ROW_ID = 'reference-root'
const IMPORTED_REFERENCE_ROW_ID_PREFIX = 'reference-import'
export const buildReferenceCategoryRowId = (categoryId: ReferenceCategoryId): string =>
  `reference-category-row:${categoryId}`
export const buildImportedReferenceRowId = (referenceId: string): string =>
  `reference-item-row:${referenceId}`
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
  | { kind: 'assembly' }
  | { kind: 'component' }
  | { kind: 'object' }
> =>
  target !== null &&
  (target.kind === 'assembly' ||
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

const resolveReferenceCategoryLabel = (categoryId: ReferenceCategoryId): string =>
  categoryId === USER_REFERENCE_CATEGORY_ID
    ? USER_REFERENCE_CATEGORY_LABEL
    : REFERENCE_MANIFEST_CATEGORIES.find((category) => category.categoryId === categoryId)?.label ??
      categoryId

const shouldRenderReferenceCategoryInBrowser = (categoryId: ReferenceCategoryId): boolean =>
  categoryId !== USER_REFERENCE_CATEGORY_ID

const resolveReferenceCategoryIdFromComponentId = (
  componentId: string,
): ReferenceCategoryId | null =>
  [...REFERENCE_MANIFEST_CATEGORIES.map((category) => category.categoryId), USER_REFERENCE_CATEGORY_ID].find(
    (categoryId) => buildReferenceCategoryRowId(categoryId) === componentId,
  ) ?? null

const selectVisibleReferenceCategoryIds = (): ReferenceCategoryId[] => {
  return REFERENCE_MANIFEST_CATEGORIES.map((category) => category.categoryId)
}

const resolveReferenceContainerParentAssemblyId = (
  projectContent: Pick<ProjectContentState, 'assembliesById'>,
  rowId: string,
): string | null =>
  Object.values(projectContent.assembliesById).find((assembly) => assembly.childRowIds.includes(rowId))
    ?.assemblyId ?? null

type ReferenceContainerOwnerRecordSource = {
  projectContent: Pick<ProjectContentState, 'assembliesById' | 'componentsById' | 'objectsById'>
  referenceWorkspace: Pick<ReferenceWorkspaceState, 'importedReferencesById' | 'importedReferenceOrder'>
}

const buildReferenceRootAssemblyRecord = (
  state: ReferenceContainerOwnerRecordSource,
): ProjectAssemblyRecord => ({
  assemblyId: REFERENCE_ROOT_ROW_ID,
  label: 'References',
  parentAssemblyId: resolveReferenceContainerParentAssemblyId(
    state.projectContent,
    REFERENCE_ROOT_ROW_ID,
  ),
  assemblySourceKind: 'runtime-root',
  childRowIds: [
    ...selectVisibleReferenceCategoryIds()
      .map(buildReferenceCategoryRowId)
      .filter(
        (categoryRowId) =>
          resolveReferenceContainerParentAssemblyId(state.projectContent, categoryRowId) === null,
      ),
    ...Object.values(state.projectContent.assembliesById)
      .filter((assembly) => assembly.parentAssemblyId === REFERENCE_ROOT_ROW_ID)
      .map((assembly) => assembly.assemblyId),
    ...Object.values(state.projectContent.componentsById)
      .filter(
        (component) =>
          component.parentAssemblyId === REFERENCE_ROOT_ROW_ID &&
          (component.parentComponentId ?? null) === null,
      )
      .map((component) => component.componentId),
    ...Object.values(state.projectContent.objectsById)
      .filter(
        (objectRow) =>
          objectRow.parentAssemblyId === REFERENCE_ROOT_ROW_ID && objectRow.parentComponentId === null,
      )
      .map((objectRow) => objectRow.objectId),
    ...state.referenceWorkspace.importedReferenceOrder
      .map((referenceId) => state.referenceWorkspace.importedReferencesById[referenceId] ?? null)
      .filter((item): item is ImportedReferenceRecord => item !== null)
      .filter(
        (item) =>
          item.parentComponentId === null &&
          (item.parentAssemblyId === REFERENCE_ROOT_ROW_ID ||
            (item.parentAssemblyId == null &&
              !shouldRenderReferenceCategoryInBrowser(item.categoryId))),
      )
      .map((item) => buildImportedReferenceRowId(item.referenceId)),
  ],
})

const buildReferenceCategoryComponentRecord = (
  state: ReferenceContainerOwnerRecordSource,
  categoryId: ReferenceCategoryId,
): ProjectComponentRecord => ({
  componentId: buildReferenceCategoryRowId(categoryId),
  parentAssemblyId:
    resolveReferenceContainerParentAssemblyId(
      state.projectContent,
      buildReferenceCategoryRowId(categoryId),
    ) ?? REFERENCE_ROOT_ROW_ID,
  parentComponentId: null,
  ownerGraphDocumentId: null,
  sourceGraphDocumentId: null,
  sourceOutputEntryId: null,
  sourceNodeId: null,
  label: resolveReferenceCategoryLabel(categoryId),
  componentSourceKind: 'receive-link',
  resolutionState: 'resolved',
  receiveId: null,
  childRowIds: Object.values(state.projectContent.objectsById)
    .filter((objectRow) => objectRow.parentComponentId === buildReferenceCategoryRowId(categoryId))
    .map((objectRow) => objectRow.objectId),
  childObjectIds: Object.values(state.projectContent.objectsById)
    .filter((objectRow) => objectRow.parentComponentId === buildReferenceCategoryRowId(categoryId))
    .map((objectRow) => objectRow.objectId),
})

const resolveProjectAssemblyRecord = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  assemblyId: string,
): ProjectAssemblyRecord | null => {
  const assembly = state.projectContent.assembliesById[assemblyId]
  if (assembly !== undefined) {
    return assembly
  }
  if (assemblyId === REFERENCE_ROOT_ROW_ID) {
    return buildReferenceRootAssemblyRecord(state)
  }
  return null
}

const resolveProjectComponentRecord = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  componentId: string,
): ProjectComponentRecord | null => {
  const component = state.projectContent.componentsById[componentId]
  if (component !== undefined) {
    return component
  }
  const referenceCategoryId = resolveReferenceCategoryIdFromComponentId(componentId)
  return referenceCategoryId === null
    ? null
    : buildReferenceCategoryComponentRecord(state, referenceCategoryId)
}

const resolveParentAssemblyIdByChildRowId = (
  projectContent: Pick<ProjectContentState, 'assembliesById'>,
  rowId: string,
): string | null =>
  Object.values(projectContent.assembliesById).find((assembly) => assembly.childRowIds.includes(rowId))
    ?.assemblyId ?? null

const resolveReferenceRuntimeTraitsFromWorkspace = (
  referenceWorkspace: ReferenceWorkspaceRuntimeTraitSource,
  referenceId: string,
): ReferenceRuntimeTraits => ({
  isVisible: referenceWorkspace.visibilityById[referenceId] ?? false,
  loadState: referenceWorkspace.loadStateById[referenceId] ?? 'unloaded',
  errorMessage: referenceWorkspace.errorById[referenceId] ?? null,
  transformOverride: referenceWorkspace.transformOverrideById?.[referenceId] ?? null,
  parts: referenceWorkspace.partRowsByReferenceId[referenceId] ?? [],
})

export const resolveReferenceRuntimeTraits = (
  state: Pick<AppState, 'referenceWorkspace'>,
  referenceId: string,
): ReferenceRuntimeTraits =>
  resolveReferenceRuntimeTraitsFromWorkspace(state.referenceWorkspace, referenceId)

const buildReferenceWorkspaceBrowserItemVm = (
  referenceWorkspace: ReferenceWorkspaceRuntimeTraitSource,
  item: ImportedReferenceRecord,
): ReferenceWorkspaceBrowserItemVm => {
  const runtimeTraits = resolveReferenceRuntimeTraitsFromWorkspace(referenceWorkspace, item.referenceId)
  return {
    rowId: buildImportedReferenceRowId(item.referenceId),
    referenceId: item.referenceId,
    sourceKind: item.sourceKind,
    label: item.label,
    categoryId: item.categoryId,
    fileType: item.fileType,
    assetPath: item.assetPath,
    displayTransform:
      item.sourceKind === 'manifest'
        ? REFERENCE_MANIFEST_ITEM_BY_ID[item.referenceId]?.displayTransform
        : undefined,
    isVisible: runtimeTraits.isVisible,
    loadState: runtimeTraits.loadState,
    errorMessage: runtimeTraits.errorMessage,
    transformOverride: runtimeTraits.transformOverride,
    parentAssemblyId: item.parentAssemblyId,
    parentComponentId: item.parentComponentId,
    parts: runtimeTraits.parts,
  }
}

const resolveImportedReferenceRecordByObjectRowId = (
  state: Pick<AppState, 'referenceWorkspace'>,
  objectRowId: string,
): ImportedReferenceRecord | null =>
  state.referenceWorkspace.importedReferenceOrder
    .map((referenceId) => state.referenceWorkspace.importedReferencesById[referenceId] ?? null)
    .find((record) => record !== null && buildImportedReferenceRowId(record.referenceId) === objectRowId) ??
  null

const collectReferenceIdsForAssemblySelection = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  assemblyId: string,
): string[] => {
  if (assemblyId === REFERENCE_ROOT_ROW_ID) {
    return state.referenceWorkspace.importedReferenceOrder.filter((referenceId) => {
      const record = state.referenceWorkspace.importedReferencesById[referenceId]
      if (record === undefined) {
        return false
      }
      return (
        (record.parentAssemblyId == null && record.parentComponentId == null) ||
        record.parentAssemblyId === REFERENCE_ROOT_ROW_ID ||
        record.parentComponentId === buildReferenceCategoryRowId(record.categoryId)
      )
    })
  }

  const referenceIdSet = new Set<string>()
  const visitAssembly = (currentAssemblyId: string) => {
    state.referenceWorkspace.importedReferenceOrder.forEach((referenceId) => {
      const record = state.referenceWorkspace.importedReferencesById[referenceId]
      if (
        record !== undefined &&
        record.parentAssemblyId === currentAssemblyId &&
        record.parentComponentId === null
      ) {
        referenceIdSet.add(referenceId)
      }
    })

    const currentAssembly = state.projectContent.assembliesById[currentAssemblyId]
    if (currentAssembly === undefined) {
      return
    }
    currentAssembly.childRowIds.forEach((childRowId) => {
      const childAssembly = state.projectContent.assembliesById[childRowId]
      if (childAssembly !== undefined) {
        visitAssembly(childAssembly.assemblyId)
        return
      }
      const componentRecord = resolveProjectComponentRecord(state, childRowId)
      if (componentRecord !== null) {
        resolveReferenceIdsForWorkspaceTarget(state, {
          kind: 'component',
          componentId: componentRecord.componentId,
        }).forEach((referenceId) => referenceIdSet.add(referenceId))
      }
    })
  }

  visitAssembly(assemblyId)
  return [...referenceIdSet]
}

export const resolveReferenceIdsForWorkspaceTarget = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  target: WorkspaceSelectedTarget | null,
): string[] => {
  if (target === null) {
    return []
  }
  if (target.kind === 'references-root') {
    return [...state.referenceWorkspace.importedReferenceOrder]
  }
  if (target.kind === 'reference-category') {
    return state.referenceWorkspace.importedReferenceOrder.filter((referenceId) => {
      const record = state.referenceWorkspace.importedReferencesById[referenceId]
      return record?.categoryId === target.categoryId
    })
  }
  if (target.kind === 'reference-item') {
    return state.referenceWorkspace.importedReferencesById[target.referenceId] !== undefined
      ? [target.referenceId]
      : []
  }
  if (target.kind === 'object') {
    const importedReference = resolveImportedReferenceRecordByObjectRowId(state, target.objectId)
    return importedReference === null ? [] : [importedReference.referenceId]
  }
  if (target.kind === 'component') {
    const referenceCategoryId = resolveReferenceCategoryIdFromComponentId(target.componentId)
    if (referenceCategoryId !== null) {
      return state.referenceWorkspace.importedReferenceOrder.filter((referenceId) => {
        const record = state.referenceWorkspace.importedReferencesById[referenceId]
        if (record === undefined || record.categoryId !== referenceCategoryId) {
          return false
        }
        return (
          (record.parentAssemblyId == null && record.parentComponentId == null) ||
          record.parentComponentId === target.componentId
        )
      })
    }
    return state.referenceWorkspace.importedReferenceOrder.filter((referenceId) => {
      const record = state.referenceWorkspace.importedReferencesById[referenceId]
      return record?.parentComponentId === target.componentId
    })
  }
  if (target.kind === 'assembly') {
    return collectReferenceIdsForAssemblySelection(state, target.assemblyId)
  }
  return []
}

const resolveContentOwnerParentTarget = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  options: {
    parentAssemblyId?: string | null
    parentComponentId?: string | null
  },
): Pick<
  WorkspaceSelectedContentOwnerTarget,
  'parentOwnerId' | 'parentOwnerKind' | 'parentOwnerLabel'
> => {
  if (options.parentComponentId !== undefined && options.parentComponentId !== null) {
    const parentComponent = resolveProjectComponentRecord(state, options.parentComponentId)
    if (parentComponent !== null) {
      return {
        parentOwnerId: options.parentComponentId,
        parentOwnerKind: 'component',
        parentOwnerLabel: parentComponent.label,
      }
    }
    return {
      parentOwnerId: options.parentComponentId,
      parentOwnerKind: 'component',
      parentOwnerLabel: options.parentComponentId,
    }
  }
  if (options.parentAssemblyId !== undefined && options.parentAssemblyId !== null) {
    const parentAssembly = resolveProjectAssemblyRecord(state, options.parentAssemblyId)
    if (parentAssembly !== null) {
      return {
        parentOwnerId: options.parentAssemblyId,
        parentOwnerKind: 'assembly',
        parentOwnerLabel: parentAssembly.label,
      }
    }
    return {
      parentOwnerId: options.parentAssemblyId,
      parentOwnerKind: 'assembly',
      parentOwnerLabel: options.parentAssemblyId,
    }
  }
  return {
    parentOwnerId: null,
    parentOwnerKind: null,
    parentOwnerLabel: null,
  }
}

export const resolveWorkspaceSelectedContentOwnerTarget = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  target: WorkspaceSelectedTarget | null,
): WorkspaceSelectedContentOwnerTarget | null => {
  if (target === null) {
    return null
  }

  if (target.kind === 'assembly') {
    const assembly = resolveProjectAssemblyRecord(state, target.assemblyId)
    if (assembly !== null) {
      return {
        ownerKind: 'assembly',
        ownerId: assembly.assemblyId,
        ownerLabel: assembly.label,
        ...resolveContentOwnerParentTarget(state, {
          parentAssemblyId: assembly.parentAssemblyId ?? null,
        }),
        fallbackGraphDocumentId: null,
        supportsViewerTransform: false,
        supportsSelectAll: true,
        supportsRename: assembly.assemblySourceKind === 'authored',
        supportsDelete: assembly.assemblySourceKind === 'authored',
      }
    }
    return null
  }

  if (target.kind === 'component') {
    const component = resolveProjectComponentRecord(state, target.componentId)
    if (component !== null) {
      const authored = component.componentSourceKind === 'authored'
      return {
        ownerKind: 'component',
        ownerId: component.componentId,
        ownerLabel: component.label,
        ...resolveContentOwnerParentTarget(state, {
          parentAssemblyId: component.parentAssemblyId ?? null,
          parentComponentId: component.parentComponentId ?? null,
        }),
        fallbackGraphDocumentId: component.sourceGraphDocumentId,
        supportsViewerTransform: false,
        supportsSelectAll: true,
        supportsRename: authored,
        supportsDelete: authored,
      }
    }
    return null
  }

  if (target.kind !== 'object') {
    return null
  }

  const objectRow = state.projectContent.objectsById[target.objectId]
  if (objectRow !== undefined) {
    return {
      ownerKind: 'object-part',
      ownerId: objectRow.objectId,
      ownerLabel: objectRow.label,
      ...resolveContentOwnerParentTarget(state, {
        parentAssemblyId: objectRow.parentAssemblyId ?? null,
        parentComponentId: objectRow.parentComponentId,
      }),
      fallbackGraphDocumentId: objectRow.sourceGraphDocumentId,
      supportsViewerTransform: objectRow.objectSourceKind === 'published-object',
      supportsSelectAll: false,
      supportsRename: false,
      supportsDelete: false,
    }
  }
  const importedReference = resolveImportedReferenceRecordByObjectRowId(state, target.objectId)
  if (importedReference === null) {
    return null
  }
  return {
    ownerKind: 'object-part',
    ownerId: target.objectId,
    ownerLabel: importedReference.label,
    ...resolveContentOwnerParentTarget(state, {
      parentAssemblyId: importedReference.parentAssemblyId ?? null,
      parentComponentId: importedReference.parentComponentId ?? null,
    }),
    fallbackGraphDocumentId: null,
    supportsViewerTransform: false,
    supportsSelectAll: false,
    supportsRename: false,
    supportsDelete: false,
  }
}

export const buildObjectPartKeys = (objectRecord: ProjectObjectRecord): string[] =>
  (() => {
    const outputEntryViewerKey = buildQualifiedGraphOutputEntryId(
      objectRecord.ownerGraphDocumentId,
      objectRecord.sourceOutputEntryId,
    )
    if (outputEntryViewerKey !== null) {
      return [outputEntryViewerKey]
    }
    return objectRecord.slotId === null ? [] : [`${objectRecord.ownerGraphDocumentId}:${objectRecord.slotId}`]
  })()

export const resolveOwnedContentSelection = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  target: WorkspaceSelectedTarget,
): WorkspaceResolvedContentSelection | null => {
  if (target.kind === 'object') {
    const objectRecord = state.projectContent.objectsById[target.objectId]
    if (objectRecord !== undefined) {
      return {
        rootRowId: objectRecord.objectId,
        rootKind: 'object',
        partKeys: buildObjectPartKeys(objectRecord),
        groupedRowIds: [],
      }
    }
    const importedReference = resolveImportedReferenceRecordByObjectRowId(state, target.objectId)
    if (importedReference === null) {
      return null
    }
    return {
      rootRowId: target.objectId,
      rootKind: 'object',
      partKeys: [],
      groupedRowIds: [],
    }
  }

  if (target.kind === 'component') {
    const componentRecord = resolveProjectComponentRecord(state, target.componentId)
    if (componentRecord !== null) {
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
      resolveReferenceIdsForWorkspaceTarget(state, target).forEach((referenceId) => {
        groupedRowIds.push(buildImportedReferenceRowId(referenceId))
      })
      return {
        rootRowId: componentRecord.componentId,
        rootKind: 'component',
        partKeys: [...partKeySet],
        groupedRowIds,
      }
    }
    const referenceIds = resolveReferenceIdsForWorkspaceTarget(state, target)
    if (referenceIds.length === 0) {
      return null
    }
    return {
      rootRowId: target.componentId,
      rootKind: 'component',
      partKeys: [],
      groupedRowIds: referenceIds.map((referenceId) => buildImportedReferenceRowId(referenceId)),
    }
  }

  if (target.kind !== 'assembly') {
    return null
  }

  const assemblyRecord = resolveProjectAssemblyRecord(state, target.assemblyId)
  if (assemblyRecord === null) {
    return null
  }
  const partKeySet = new Set<string>()
  const groupedRowIds: string[] = []
  const visitAssembly = (assemblyId: string) => {
    resolveReferenceIdsForWorkspaceTarget(state, { kind: 'assembly', assemblyId }).forEach((referenceId) => {
      const record = state.referenceWorkspace.importedReferencesById[referenceId]
      if (record?.parentComponentId === null) {
          groupedRowIds.push(buildImportedReferenceRowId(referenceId))
      }
    })

    const currentAssembly = resolveProjectAssemblyRecord(state, assemblyId)
    if (currentAssembly === null) {
      return
    }
    currentAssembly.childRowIds.forEach((childRowId) => {
      const childAssembly = resolveProjectAssemblyRecord(state, childRowId)
      if (childAssembly !== null) {
        groupedRowIds.push(childAssembly.assemblyId)
        visitAssembly(childAssembly.assemblyId)
        return
      }
      const componentRecord = resolveProjectComponentRecord(state, childRowId)
      if (componentRecord !== null) {
        groupedRowIds.push(componentRecord.componentId)
        resolveReferenceIdsForWorkspaceTarget(state, {
          kind: 'component',
          componentId: componentRecord.componentId,
        }).forEach((referenceId) => {
          groupedRowIds.push(buildImportedReferenceRowId(referenceId))
        })
        componentRecord.childObjectIds.forEach((objectId) => {
          groupedRowIds.push(objectId)
          const objectRecord = state.projectContent.objectsById[objectId]
          if (objectRecord === undefined) {
            return
          }
          buildObjectPartKeys(objectRecord).forEach((partKey) => partKeySet.add(partKey))
        })
        return
      }
      const objectRecord = state.projectContent.objectsById[childRowId]
      if (objectRecord === undefined) {
        return
      }
      groupedRowIds.push(objectRecord.objectId)
      buildObjectPartKeys(objectRecord).forEach((partKey) => partKeySet.add(partKey))
    })
  }
  visitAssembly(target.assemblyId)
  return {
    rootRowId: target.assemblyId,
    rootKind: 'assembly',
    partKeys: [...partKeySet],
    groupedRowIds: [...new Set(groupedRowIds)],
  }
}

export const resolveSingleTargetContentSelection = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  target: WorkspaceSelectedTarget,
): WorkspaceResolvedContentSelection | null => {
  if (target.kind === 'object') {
    return resolveOwnedContentSelection(state, target)
  }

  if (target.kind === 'component') {
    const componentRecord = resolveProjectComponentRecord(state, target.componentId)
    if (componentRecord !== null) {
      return {
        rootRowId: componentRecord.componentId,
        rootKind: 'component',
        partKeys: [],
        groupedRowIds: [],
      }
    }
    if (resolveReferenceIdsForWorkspaceTarget(state, target).length === 0) {
      return null
    }
    return {
      rootRowId: target.componentId,
      rootKind: 'component',
      partKeys: [],
      groupedRowIds: [],
    }
  }

  if (target.kind !== 'assembly') {
    return null
  }

  const assemblyRecord = resolveProjectAssemblyRecord(state, target.assemblyId)
  if (assemblyRecord === null) {
    return null
  }
  return {
    rootRowId: target.assemblyId,
    rootKind: 'assembly',
    partKeys: [],
    groupedRowIds: [],
  }
}

type ProjectContentOwnerRecord = {
  kind: ProjectContentOwnerTarget['kind']
  ownerId: string
  parentTarget: ProjectContentContainerTarget | null
  draggable: boolean
}

const resolveWorkspaceSelectedTargetFromProjectContentOwnerTarget = (
  target: ProjectContentOwnerTarget,
): WorkspaceSelectedTarget =>
  target.kind === 'assembly'
    ? { kind: 'assembly', assemblyId: target.assemblyId }
    : target.kind === 'component'
      ? { kind: 'component', componentId: target.componentId }
      : target.kind === 'object'
        ? { kind: 'object', objectId: target.objectId }
        : { kind: 'object', objectId: buildImportedReferenceRowId(target.referenceId) }

const buildProjectContentOwnerRowId = (target: ProjectContentOwnerTarget): string =>
  target.kind === 'assembly'
    ? target.assemblyId
    : target.kind === 'component'
      ? target.componentId
      : target.kind === 'object'
        ? target.objectId
        : buildImportedReferenceRowId(target.referenceId)

const buildContentParentOrderKey = (target: ProjectContentContainerTarget): string =>
  target.kind === 'assembly' ? `assembly:${target.assemblyId}` : `component:${target.componentId}`

const getImportedReferenceItemsForParent = (
  state: Pick<AppState, 'referenceWorkspace'>,
  parentTarget: ProjectContentContainerTarget,
): ImportedReferenceRecord[] =>
  state.referenceWorkspace.importedReferenceOrder
    .map((referenceId) => state.referenceWorkspace.importedReferencesById[referenceId] ?? null)
    .filter((item): item is ImportedReferenceRecord => item !== null)
    .filter((item) =>
      parentTarget.kind === 'assembly'
        ? item.parentComponentId === null &&
          (item.parentAssemblyId === parentTarget.assemblyId ||
            (parentTarget.assemblyId === REFERENCE_ROOT_ROW_ID &&
              item.parentAssemblyId == null &&
              !shouldRenderReferenceCategoryInBrowser(item.categoryId)))
        : item.parentComponentId === parentTarget.componentId,
    )

const buildDefaultContentOrderForParent = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  parentTarget: ProjectContentContainerTarget,
): string[] => {
  if (parentTarget.kind === 'assembly') {
    const parentAssembly = resolveProjectAssemblyRecord(state, parentTarget.assemblyId)
    const authoredChildIds = parentAssembly?.childRowIds ?? []
    const importedChildIds = getImportedReferenceItemsForParent(state, parentTarget).map((item) =>
      buildImportedReferenceRowId(item.referenceId),
    )
    return [...authoredChildIds, ...importedChildIds]
  }
  const parentComponent = resolveProjectComponentRecord(state, parentTarget.componentId)
  const authoredChildIds =
    parentComponent === undefined || parentComponent === null
      ? []
      : getProjectComponentChildRowIds(parentComponent)
  const importedChildIds = getImportedReferenceItemsForParent(state, parentTarget).map((item) =>
    buildImportedReferenceRowId(item.referenceId),
  )
  return [...authoredChildIds, ...importedChildIds]
}

const dedupeOrderedRowIds = (orderedRowIds: readonly string[]): string[] => {
  const seen = new Set<string>()
  const deduped: string[] = []
  orderedRowIds.forEach((rowId) => {
    if (seen.has(rowId)) {
      return
    }
    seen.add(rowId)
    deduped.push(rowId)
  })
  return deduped
}

const normalizeContentOrder = (
  orderedRowIds: string[] | undefined,
  defaultRowIds: string[],
): string[] => {
  if (orderedRowIds === undefined) {
    return dedupeOrderedRowIds(defaultRowIds)
  }
  const defaultRowIdSet = new Set(defaultRowIds)
  const normalized = dedupeOrderedRowIds(
    orderedRowIds.filter((rowId) => defaultRowIdSet.has(rowId)),
  )
  defaultRowIds.forEach((rowId) => {
    if (!normalized.includes(rowId)) {
      normalized.push(rowId)
    }
  })
  return normalized
}

const removeRowIdFromAllContentOrders = (
  contentOrderByParentKey: Record<string, string[]>,
  rowId: string,
): Record<string, string[]> => {
  let mutated = false
  const next: Record<string, string[]> = {}
  Object.entries(contentOrderByParentKey).forEach(([parentKey, orderedRowIds]) => {
    const filtered = orderedRowIds.filter((candidate) => candidate !== rowId)
    if (filtered.length !== orderedRowIds.length) {
      mutated = true
    }
    if (filtered.length > 0) {
      next[parentKey] = filtered
    } else if (filtered.length !== orderedRowIds.length) {
      mutated = true
    }
  })
  return mutated ? next : contentOrderByParentKey
}

const areProjectContentContainerTargetsEqual = (
  left: ProjectContentContainerTarget | null,
  right: ProjectContentContainerTarget | null,
): boolean => {
  if (left === right) {
    return true
  }
  if (left === null || right === null) {
    return false
  }
  if (left.kind !== right.kind) {
    return false
  }
  return left.kind === 'assembly'
    ? left.assemblyId === (right as Extract<ProjectContentContainerTarget, { kind: 'assembly' }>).assemblyId
    : left.componentId === (right as Extract<ProjectContentContainerTarget, { kind: 'component' }>).componentId
}

const resolveProjectContentOwnerRecord = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  target: ProjectContentOwnerTarget,
): ProjectContentOwnerRecord | null => {
  if (target.kind === 'assembly') {
    const assembly = resolveProjectAssemblyRecord(state, target.assemblyId)
    if (assembly === null) {
      return null
    }
    return {
      kind: 'assembly',
      ownerId: assembly.assemblyId,
      parentTarget:
        assembly.parentAssemblyId == null
          ? null
          : { kind: 'assembly', assemblyId: assembly.parentAssemblyId },
      draggable: assembly.assemblySourceKind === 'authored' && assembly.assemblyId !== REFERENCE_ROOT_ROW_ID,
    }
  }
  if (target.kind === 'component') {
    const component = resolveProjectComponentRecord(state, target.componentId)
    if (component === null) {
      return null
    }
    return {
      kind: 'component',
      ownerId: component.componentId,
      parentTarget:
        component.parentAssemblyId == null
          ? null
          : { kind: 'assembly', assemblyId: component.parentAssemblyId },
      draggable:
        component.componentSourceKind === 'authored' ||
        resolveReferenceCategoryIdFromComponentId(component.componentId) !== null,
    }
  }
  if (target.kind === 'imported-reference') {
    const importedReference = state.referenceWorkspace.importedReferencesById[target.referenceId]
    if (importedReference === undefined) {
      return null
    }
    return {
      kind: 'imported-reference',
      ownerId: importedReference.referenceId,
      parentTarget:
        importedReference.parentComponentId !== null
          ? { kind: 'component', componentId: importedReference.parentComponentId }
          : importedReference.parentAssemblyId == null
            ? null
            : { kind: 'assembly', assemblyId: importedReference.parentAssemblyId },
      draggable: true,
    }
  }
  const objectRow = state.projectContent.objectsById[target.objectId]
  if (objectRow === undefined) {
    return null
  }
  return {
    kind: 'object',
    ownerId: objectRow.objectId,
    parentTarget:
      objectRow.parentComponentId !== null
        ? { kind: 'component', componentId: objectRow.parentComponentId }
        : objectRow.parentAssemblyId == null
          ? null
          : { kind: 'assembly', assemblyId: objectRow.parentAssemblyId },
    draggable: objectRow.objectSourceKind === 'published-object',
  }
}

const selectTopLevelAssemblyIds = (state: Pick<AppState, 'projectContent'>): string[] =>
  Object.values(state.projectContent.assembliesById)
    .filter((assembly) => assembly.parentAssemblyId == null)
    .map((assembly) => assembly.assemblyId)

const selectAssemblyDescendantIds = (
  state: Pick<AppState, 'projectContent'>,
  assemblyId: string,
): Set<string> => {
  const descendantIds = new Set<string>()
  const visit = (currentAssemblyId: string) => {
    const currentAssembly = state.projectContent.assembliesById[currentAssemblyId]
    if (currentAssembly === undefined) {
      return
    }
    currentAssembly.childRowIds.forEach((childRowId) => {
      const childAssembly = state.projectContent.assembliesById[childRowId]
      if (childAssembly === undefined || descendantIds.has(childAssembly.assemblyId)) {
        return
      }
      descendantIds.add(childAssembly.assemblyId)
      visit(childAssembly.assemblyId)
    })
  }
  visit(assemblyId)
  return descendantIds
}

const rebuildAssembliesByTopLevelOrder = (
  assembliesById: Record<string, ProjectAssemblyRecord>,
  orderedTopLevelAssemblyIds: string[],
): Record<string, ProjectAssemblyRecord> => {
  const nextAssembliesById: Record<string, ProjectAssemblyRecord> = {}
  orderedTopLevelAssemblyIds.forEach((assemblyId) => {
    const assembly = assembliesById[assemblyId]
    if (assembly !== undefined) {
      nextAssembliesById[assemblyId] = assembly
    }
  })
  Object.entries(assembliesById).forEach(([assemblyId, assembly]) => {
    if (nextAssembliesById[assemblyId] !== undefined) {
      return
    }
    nextAssembliesById[assemblyId] = assembly
  })
  return nextAssembliesById
}

export const resolveProjectContentOwnerDrop = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  draggedTarget: ProjectContentOwnerTarget,
  dropTarget: ProjectContentOwnerDropTarget,
): ProjectContentOwnerDropResolution => {
  const draggedRecord = resolveProjectContentOwnerRecord(state, draggedTarget)
  const targetRecord = resolveProjectContentOwnerRecord(state, dropTarget)
  if (draggedRecord === null || targetRecord === null) {
    return { valid: false, reason: 'missing-owner' }
  }
  if (!draggedRecord.draggable) {
    return { valid: false, reason: 'not-draggable' }
  }
  if (draggedRecord.kind === targetRecord.kind && draggedRecord.ownerId === targetRecord.ownerId) {
    return { valid: false, reason: 'same-row' }
  }

  if (dropTarget.position === 'before' || dropTarget.position === 'after') {
    if (!areProjectContentContainerTargetsEqual(draggedRecord.parentTarget, targetRecord.parentTarget)) {
      return { valid: false, reason: 'invalid-same-parent' }
    }
    return {
      valid: true,
      kind: 'reorder',
      parentTarget: draggedRecord.parentTarget,
      draggedTarget,
      dropTarget,
    }
  }

  if (targetRecord.kind === 'object' || targetRecord.kind === 'imported-reference') {
    return { valid: false, reason: 'illegal-target' }
  }

  const targetContainer: ProjectContentContainerTarget =
    targetRecord.kind === 'assembly'
      ? { kind: 'assembly', assemblyId: targetRecord.ownerId }
      : { kind: 'component', componentId: targetRecord.ownerId }

  if (
    targetRecord.kind === 'assembly' &&
    targetRecord.ownerId === REFERENCE_ROOT_ROW_ID &&
    !(
      draggedRecord.kind === 'component' &&
      resolveReferenceCategoryIdFromComponentId(draggedRecord.ownerId) !== null
    )
  ) {
    return { valid: false, reason: 'illegal-target' }
  }

  if (areProjectContentContainerTargetsEqual(draggedRecord.parentTarget, targetContainer)) {
    return { valid: false, reason: 'same-parent-into' }
  }

  if (
    targetRecord.kind === 'component' &&
    draggedRecord.kind !== 'object' &&
    draggedRecord.kind !== 'imported-reference'
  ) {
    return { valid: false, reason: 'illegal-container' }
  }

  if (draggedRecord.kind === 'assembly' && targetRecord.kind === 'assembly') {
    if (selectAssemblyDescendantIds(state, draggedRecord.ownerId).has(targetRecord.ownerId)) {
      return { valid: false, reason: 'descendant-cycle' }
    }
  }

  return {
    valid: true,
    kind: 'reparent',
    parentTarget:
      targetRecord.kind === 'assembly'
        ? { kind: 'assembly', assemblyId: targetRecord.ownerId }
        : { kind: 'component', componentId: targetRecord.ownerId },
    draggedTarget,
    dropTarget,
  }
}

export const resolveBrowserDraggableTargetDrop = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  draggedTarget: BrowserDraggableTarget,
  dropTarget: ProjectContentOwnerDropTarget,
): BrowserDraggableTargetDropResolution =>
  resolveProjectContentOwnerDrop(state, draggedTarget, dropTarget)

const moveOrderedIdAroundSibling = (
  siblingIds: string[],
  draggedId: string,
  targetId: string,
  position: Extract<ProjectContentDropPosition, 'before' | 'after'>,
): string[] => {
  const filteredIds = dedupeOrderedRowIds(siblingIds).filter((childId) => childId !== draggedId)
  const targetIndex = filteredIds.indexOf(targetId)
  if (targetIndex < 0) {
    return dedupeOrderedRowIds(siblingIds)
  }
  const insertIndex = position === 'before' ? targetIndex : targetIndex + 1
  return [
    ...filteredIds.slice(0, insertIndex),
    draggedId,
    ...filteredIds.slice(insertIndex),
  ]
}

const resolveEffectiveContentOrderForParent = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  parentTarget: ProjectContentContainerTarget,
): string[] =>
  normalizeContentOrder(
    state.referenceWorkspace.contentOrderByParentKey[buildContentParentOrderKey(parentTarget)],
    buildDefaultContentOrderForParent(state, parentTarget),
  )

const removeProjectContentOwnerFromParent = (
  projectContent: ProjectContentState,
  ownerRecord: ProjectContentOwnerRecord,
): ProjectContentState => {
  if (ownerRecord.parentTarget === null) {
    return projectContent
  }
  if (ownerRecord.parentTarget.kind === 'assembly') {
    const parentAssembly = projectContent.assembliesById[ownerRecord.parentTarget.assemblyId]
    if (parentAssembly === undefined) {
      return projectContent
    }
    return {
      ...projectContent,
      assembliesById: {
        ...projectContent.assembliesById,
        [parentAssembly.assemblyId]: {
          ...parentAssembly,
          childRowIds: parentAssembly.childRowIds.filter((childRowId) => childRowId !== ownerRecord.ownerId),
        },
      },
    }
  }
  const parentComponent = projectContent.componentsById[ownerRecord.parentTarget.componentId]
  if (parentComponent === undefined) {
    return projectContent
  }
  return {
    ...projectContent,
    componentsById: {
      ...projectContent.componentsById,
      [parentComponent.componentId]: {
        ...parentComponent,
        childObjectIds: parentComponent.childObjectIds.filter((objectId) => objectId !== ownerRecord.ownerId),
      },
    },
  }
}

const resolveExplicitContentSelection = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
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
    return resolveOwnedContentSelection(state, explicitContentTargets[0])
  }

  const partKeySet = new Set<string>()
  const groupedRowIdSet = new Set<string>()
  for (const target of explicitContentTargets) {
    const selection = resolveOwnedContentSelection(state, target)
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
  transformSnapByObjectId: {},
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
  contentObjectTransformOverrideById: {},
  transformHistoryByObjectId: {},
  activeContentObjectTransformSession: null,
  importedReferencesById: buildInitialReferenceRecords(),
  importedReferenceOrder: [...INITIAL_REFERENCE_RECORD_ORDER],
  partRowsByReferenceId: {},
  contentOrderByParentKey: {},
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

const cloneActiveContentObjectTransformSession = (
  value: ActiveContentObjectTransformSession | null,
): ActiveContentObjectTransformSession | null =>
  value === null
    ? null
    : {
        objectId: value.objectId,
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

export const selectActiveViewerTransformTarget = (
  referenceWorkspace: Pick<
    ReferenceWorkspaceState,
    'activeReferenceTransformSession' | 'activeContentObjectTransformSession'
  >,
): ViewerTransformTarget | null => {
  if (referenceWorkspace.activeContentObjectTransformSession !== null) {
    return {
      kind: 'content-object',
      objectId: referenceWorkspace.activeContentObjectTransformSession.objectId,
    }
  }
  if (referenceWorkspace.activeReferenceTransformSession !== null) {
    return {
      kind: 'reference',
      referenceId: referenceWorkspace.activeReferenceTransformSession.referenceId,
    }
  }
  return null
}

export const selectActiveViewerTransformSession = (
  referenceWorkspace: Pick<
    ReferenceWorkspaceState,
    'activeReferenceTransformSession' | 'activeContentObjectTransformSession'
  >,
): ActiveViewerTransformSession | null => {
  const activeContentObjectSession = cloneActiveContentObjectTransformSession(
    referenceWorkspace.activeContentObjectTransformSession,
  )
  if (activeContentObjectSession !== null) {
    return {
      targetKind: 'content-object',
      targetId: activeContentObjectSession.objectId,
      sessionId: activeContentObjectSession.sessionId,
      sessionOrdinal: activeContentObjectSession.sessionOrdinal,
      mode: activeContentObjectSession.mode,
      space: activeContentObjectSession.space,
      shellActive: activeContentObjectSession.shellActive,
      entryActive: activeContentObjectSession.entryActive,
      activeHandle: activeContentObjectSession.activeHandle,
      historyScrubIndex: activeContentObjectSession.historyScrubIndex,
      draftTransform: activeContentObjectSession.draftTransform,
      entryOrigin: activeContentObjectSession.entryOrigin,
    }
  }
  const activeReferenceSession = cloneActiveReferenceTransformSession(
    referenceWorkspace.activeReferenceTransformSession,
  )
  if (activeReferenceSession !== null) {
    return {
      targetKind: 'reference',
      targetId: activeReferenceSession.referenceId,
      sessionId: activeReferenceSession.sessionId,
      sessionOrdinal: activeReferenceSession.sessionOrdinal,
      mode: activeReferenceSession.mode,
      space: activeReferenceSession.space,
      shellActive: activeReferenceSession.shellActive,
      entryActive: activeReferenceSession.entryActive,
      activeHandle: activeReferenceSession.activeHandle,
      historyScrubIndex: activeReferenceSession.historyScrubIndex,
      draftTransform: activeReferenceSession.draftTransform,
      entryOrigin: activeReferenceSession.entryOrigin,
    }
  }
  return null
}

export const selectActiveViewerTransformHistoryEntries = (
  referenceWorkspace: Pick<
    ReferenceWorkspaceState,
    'activeReferenceTransformSession' | 'activeContentObjectTransformSession' | 'transformHistoryByReferenceId' | 'transformHistoryByObjectId'
  >,
): ReferenceTransformHistoryEntry[] => {
  const activeTarget = selectActiveViewerTransformTarget(referenceWorkspace)
  if (activeTarget === null) {
    return []
  }
  return activeTarget.kind === 'reference'
    ? referenceWorkspace.transformHistoryByReferenceId[activeTarget.referenceId] ?? []
    : referenceWorkspace.transformHistoryByObjectId[activeTarget.objectId] ?? []
}

export const selectActiveViewerTransformSnapState = (
  referenceWorkspace: Pick<
    ReferenceWorkspaceState,
    'activeReferenceTransformSession' | 'activeContentObjectTransformSession' | 'transformSnapByReferenceId' | 'transformSnapByObjectId'
  >,
): ReferenceTransformSnapState => {
  const activeTarget = selectActiveViewerTransformTarget(referenceWorkspace)
  if (activeTarget === null) {
    return DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
  }
  return activeTarget.kind === 'reference'
    ? referenceWorkspace.transformSnapByReferenceId[activeTarget.referenceId] ??
        DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
    : referenceWorkspace.transformSnapByObjectId[activeTarget.objectId] ??
        DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
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

const getContentObjectTransformSnapState = (
  referenceWorkspace: ReferenceWorkspaceState,
  objectId: string,
): ReferenceTransformSnapState =>
  normalizeReferenceTransformSnapState(referenceWorkspace.transformSnapByObjectId[objectId])

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

const buildInitialReferenceRecords = (): Record<string, ImportedReferenceRecord> =>
  Object.fromEntries(
    REFERENCE_MANIFEST_ITEMS.map((item) => [
      item.referenceId,
      {
        referenceId: item.referenceId,
        sourceKind: 'manifest',
        categoryId: item.categoryId,
        label: item.label,
        fileType: item.fileType,
        assetPath: resolveReferenceAssetPath(item.assetPath),
        parentAssemblyId: null,
        parentComponentId: null,
      } satisfies ImportedReferenceRecord,
    ]),
  )

const INITIAL_REFERENCE_RECORD_ORDER = REFERENCE_MANIFEST_ITEMS.map((item) => item.referenceId)

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
): string[] =>
  referenceWorkspace.importedReferenceOrder.filter((referenceId) => {
    const referenceRecord = referenceWorkspace.importedReferencesById[referenceId]
    if (referenceRecord === undefined) {
      return false
    }
    return (
      referenceRecord.categoryId === categoryId &&
      referenceRecord.parentAssemblyId == null &&
      referenceRecord.parentComponentId == null
    )
  })

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

const buildAuthoredAssemblyId = (projectFileId: string): string =>
  `project-assembly:${projectFileId}:${newId('project-assembly')}`

const buildAuthoredComponentId = (projectFileId: string): string =>
  `project-component:${projectFileId}:authored:${newId('project-component')}`

const buildProjectPublishedComponentId = (
  projectFileId: string,
  graphDocumentId: string,
): string => `project-component:${projectFileId}:${graphDocumentId}:published`

const buildProjectPublishedSubcomponentId = (
  projectFileId: string,
  graphDocumentId: string,
  slotId: string,
): string => `project-component:${projectFileId}:${graphDocumentId}:published-subcomponent:${slotId}`

const buildProjectPublishedComponentIdFromSubcomponentId = (
  subcomponentId: string | null | undefined,
): string | null => {
  if (typeof subcomponentId !== 'string' || subcomponentId.length === 0) {
    return null
  }
  const marker = ':published-subcomponent:'
  const markerIndex = subcomponentId.indexOf(marker)
  if (markerIndex < 0) {
    return null
  }
  return `${subcomponentId.slice(0, markerIndex)}:published`
}

const buildProjectObjectId = (
  projectFileId: string,
  graphDocumentId: string,
  objectId: string,
): string => `project-object:${projectFileId}:${graphDocumentId}:${objectId}`

const getProjectComponentChildRowIds = (component: ProjectComponentRecord): string[] =>
  component.childRowIds ?? component.childObjectIds

const buildGraphViewerPartKey = (
  graphDocumentId: string,
  outputEntryId: string | null,
): string | null => buildQualifiedGraphOutputEntryId(graphDocumentId, outputEntryId)

const buildViewerPartByQualifiedOutputEntryKey = (options: {
  graphDocumentId: string
  runtime: GraphRuntimeState | undefined
}): Map<string, ViewerRenderablePart> => {
  const qualifiedViewerPartByKey = new Map<string, ViewerRenderablePart>()
  const acceptedBundle =
    options.runtime?.acceptedPreviewBuildBundle ?? options.runtime?.acceptedBuildBundle ?? null
  if (acceptedBundle === null) {
    return qualifiedViewerPartByKey
  }

  acceptedBundle.entries.forEach((entry) => {
    if (entry.status === 'evicted') {
      return
    }
    const artifact = entry.artifacts[0] ?? null
    const viewerKey = buildGraphViewerPartKey(options.graphDocumentId, entry.outputEntryId)
    if (artifact === null || viewerKey === null || qualifiedViewerPartByKey.has(viewerKey)) {
      return
    }
    qualifiedViewerPartByKey.set(viewerKey, toViewerRenderablePart(artifact, viewerKey))
  })

  return qualifiedViewerPartByKey
}

const buildProjectReceiveObjectId = (
  projectFileId: string,
  ownerGraphDocumentId: string,
  receiveId: string,
): string => `project-object:${projectFileId}:receive:${ownerGraphDocumentId}:${receiveId}`

const normalizeProjectContentLabel = (label: string): string => label.trim().replace(/\s+/g, ' ')

const isRuntimeBackedComponentRecord = (component: ProjectComponentRecord): boolean =>
  component.ownerGraphDocumentId !== null && component.componentSourceKind !== 'authored'

const isRuntimeBackedObjectRecord = (objectRow: ProjectObjectRecord): boolean =>
  objectRow.ownerGraphDocumentId !== null

const deriveRuntimeContentPlacementOverlay = (
  projectContent: ProjectContentState,
): Record<string, RuntimeContentPlacementRecord> => {
  const runtimeContentPlacementByRowId: Record<string, RuntimeContentPlacementRecord> = {}

  Object.values(projectContent.componentsById).forEach((component) => {
    if (!isRuntimeBackedComponentRecord(component)) {
      return
    }
    runtimeContentPlacementByRowId[component.componentId] = {
      parentAssemblyId: component.parentAssemblyId ?? null,
      parentComponentId: component.parentComponentId ?? null,
    }
  })

  Object.values(projectContent.objectsById).forEach((objectRow) => {
    if (!isRuntimeBackedObjectRecord(objectRow)) {
      return
    }
    runtimeContentPlacementByRowId[objectRow.objectId] = {
      parentAssemblyId: objectRow.parentAssemblyId ?? null,
      parentComponentId: objectRow.parentComponentId ?? null,
    }
  })

  return runtimeContentPlacementByRowId
}

const areRuntimeContentPlacementOverlaysEqual = (
  left: Record<string, RuntimeContentPlacementRecord>,
  right: Record<string, RuntimeContentPlacementRecord>,
): boolean => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    areOrderedStringArraysEqual(leftKeys, rightKeys) &&
    leftKeys.every((rowId) => {
      const other = right[rowId]
      const entry = left[rowId]
      return (
        other !== undefined &&
        entry.parentAssemblyId === other.parentAssemblyId &&
        entry.parentComponentId === other.parentComponentId
      )
    })
  )
}

const buildNextOrdinalLabel = (
  existingLabels: string[],
  baseLabel: 'Assembly' | 'Component',
): string => {
  let maxOrdinal = 0
  const pattern = new RegExp(`^${baseLabel}\\s+(\\d+)$`, 'i')
  existingLabels.forEach((label) => {
    const matched = normalizeProjectContentLabel(label).match(pattern)
    if (matched === null) {
      return
    }
    const ordinal = Number(matched[1])
    if (Number.isFinite(ordinal)) {
      maxOrdinal = Math.max(maxOrdinal, ordinal)
    }
  })
  return `${baseLabel} ${maxOrdinal + 1}`
}

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

type ProjectAcceptedPublicationPolicyState = Pick<
  AppState,
  | 'currentProject'
  | 'projectContent'
  | 'browserGraphBuildPolicyByGraphDocumentId'
  | 'browserContentBuildPolicyByRowId'
>

type ProjectDerivationCarryForwardState = Pick<
  AppState,
  'projectContent' | 'runtimeContentPlacementByRowId'
>

type ProjectGraphAcceptedPublicationRecord = {
  graphDocumentId: string
  fullOutputSurface: GraphOutputSurface | null
  fullPublishedContentSurface: GraphPublishedContentSurface | null
  outputSurface: GraphOutputSurface | null
  publishedContentSurface: GraphPublishedContentSurface | null
}

const buildProjectAcceptedPublicationRecords = (
  project: ProjectFile,
  spaghettiState: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'graphRuntimeByDocumentId'>,
  browserPolicyState?: ProjectAcceptedPublicationPolicyState,
): ProjectGraphAcceptedPublicationRecord[] =>
  project.graphDocuments.map((documentEntry) => {
    const graphDocumentId = documentEntry.graphDocumentId
    const fullOutputSurface =
      selectGraphRuntimeByDocumentId(spaghettiState, graphDocumentId)?.outputSurface ?? null
    const graphDocument = spaghettiState.graphDocumentsById[graphDocumentId]
    const fullPublishedContentSurface =
      graphDocument === undefined
        ? null
        : buildGraphPublishedContentSurface({
            graphDocumentId,
            graph: graphDocument.graph,
            outputSurface: fullOutputSurface,
          })
    const suppressRuntimeOutput =
      browserPolicyState === undefined
        ? false
        : selectShouldSuppressBrowserGraphRuntimeOutput(browserPolicyState, graphDocumentId)

    return {
      graphDocumentId,
      fullOutputSurface,
      fullPublishedContentSurface,
      outputSurface: suppressRuntimeOutput ? null : fullOutputSurface,
      publishedContentSurface: suppressRuntimeOutput ? null : fullPublishedContentSurface,
    }
  })

const buildProjectContentDerivation = (
  project: ProjectFile,
  spaghettiState: Pick<
    SpaghettiStoreState,
    'graphDocumentsById' | 'graphDocumentOrder' | 'graphRuntimeByDocumentId'
  >,
  acceptedPublicationRecords: readonly ProjectGraphAcceptedPublicationRecord[],
  carryForwardState?: ProjectDerivationCarryForwardState,
): {
  projectContent: ProjectContentState
  runtimeContentPlacementByRowId: Record<string, RuntimeContentPlacementRecord>
} => {
  const rootAssemblyId = project.rootAssemblyId ?? buildRootAssemblyId(project.projectFileId)
  const previousAssemblies = carryForwardState?.projectContent.assembliesById ?? {}
  const previousComponents = carryForwardState?.projectContent.componentsById ?? {}
  const previousObjects = carryForwardState?.projectContent.objectsById ?? {}
  const previousPlacementOverlay = {
    ...(carryForwardState?.projectContent === undefined
      ? {}
      : deriveRuntimeContentPlacementOverlay(carryForwardState.projectContent)),
    ...(carryForwardState?.runtimeContentPlacementByRowId ?? {}),
  }
  const componentsById: Record<string, ProjectComponentRecord> = {}
  const objectsById: Record<string, ProjectObjectRecord> = {}
  const nextRuntimePlacementByRowId: Record<string, RuntimeContentPlacementRecord> = {}
  const validRuntimeRowIds = new Set<string>()
  const authoredAssemblies = Object.values(previousAssemblies).filter(
    (assembly) =>
      assembly.assemblyId !== rootAssemblyId && (assembly.assemblySourceKind ?? 'authored') === 'authored',
  )
  const authoredComponents = Object.values(previousComponents).filter(
    (component) => component.componentSourceKind === 'authored',
  )
  let publishedComponentOrdinal = 0
  const resolveRuntimePlacement = (
    rowId: string,
    defaultParentAssemblyId: string | null,
    defaultParentComponentId: string | null,
  ): RuntimeContentPlacementRecord => {
    const overlayPlacement = previousPlacementOverlay[rowId]
    const publishedTopComponentId =
      buildProjectPublishedComponentIdFromSubcomponentId(defaultParentComponentId)
    const shouldUpgradeLegacyPublishedParent =
      publishedTopComponentId !== null &&
      overlayPlacement?.parentComponentId === publishedTopComponentId
    if (overlayPlacement !== undefined) {
      if (shouldUpgradeLegacyPublishedParent) {
        return {
          parentAssemblyId: defaultParentAssemblyId,
          parentComponentId: defaultParentComponentId,
        }
      }
      return overlayPlacement
    }
    const previousComponent = previousComponents[rowId]
    if (previousComponent !== undefined && isRuntimeBackedComponentRecord(previousComponent)) {
      if (publishedTopComponentId !== null && previousComponent.parentComponentId === publishedTopComponentId) {
        return {
          parentAssemblyId: defaultParentAssemblyId,
          parentComponentId: defaultParentComponentId,
        }
      }
      return {
        parentAssemblyId: previousComponent.parentAssemblyId ?? defaultParentAssemblyId,
        parentComponentId: previousComponent.parentComponentId ?? defaultParentComponentId,
      }
    }
    const previousObject = previousObjects[rowId]
    if (previousObject !== undefined && isRuntimeBackedObjectRecord(previousObject)) {
      if (publishedTopComponentId !== null && previousObject.parentComponentId === publishedTopComponentId) {
        return {
          parentAssemblyId: defaultParentAssemblyId,
          parentComponentId: defaultParentComponentId,
        }
      }
      return {
        parentAssemblyId: previousObject.parentAssemblyId ?? defaultParentAssemblyId,
        parentComponentId: previousObject.parentComponentId ?? defaultParentComponentId,
      }
    }
    return {
      parentAssemblyId: defaultParentAssemblyId,
      parentComponentId: defaultParentComponentId,
    }
  }
  const orderByPreviousIds = (currentIds: string[], previousIds?: string[]): string[] => {
    if (previousIds === undefined) {
      return dedupeOrderedRowIds(currentIds)
    }
    const currentIdSet = new Set(currentIds)
    const ordered = dedupeOrderedRowIds(previousIds.filter((rowId) => currentIdSet.has(rowId)))
    currentIds.forEach((rowId) => {
      if (!ordered.includes(rowId)) {
        ordered.push(rowId)
      }
    })
    return ordered
  }

  for (const publicationRecord of acceptedPublicationRecords) {
    const graphDocumentId = publicationRecord.graphDocumentId
    const {
      fullOutputSurface,
      fullPublishedContentSurface,
      outputSurface,
      publishedContentSurface,
    } = publicationRecord
    if (fullPublishedContentSurface !== null && fullOutputSurface !== null) {
      for (const publishedRow of fullPublishedContentSurface.rows) {
        if (publishedRow.kind === 'object') {
          validRuntimeRowIds.add(
            buildProjectObjectId(
              project.projectFileId,
              graphDocumentId,
              publishedRow.object.objectId,
            ),
          )
          continue
        }
        validRuntimeRowIds.add(
          buildProjectPublishedComponentId(project.projectFileId, graphDocumentId),
        )
        publishedRow.subcomponents?.forEach((subcomponent) => {
          validRuntimeRowIds.add(
            buildProjectPublishedSubcomponentId(
              project.projectFileId,
              graphDocumentId,
              subcomponent.slotId,
            ),
          )
        })
        publishedRow.objects.forEach((objectRow) => {
          validRuntimeRowIds.add(
            buildProjectObjectId(project.projectFileId, graphDocumentId, objectRow.objectId),
          )
        })
      }
    }

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
            graphDocumentId,
            objectRow.objectId,
          )
          const placement = resolveRuntimePlacement(objectId, rootAssemblyId, null)
          nextRuntimePlacementByRowId[objectId] = placement
          objectsById[objectId] = {
            objectId,
            ownerGraphDocumentId: graphDocumentId,
            parentAssemblyId: placement.parentAssemblyId,
            parentComponentId: placement.parentComponentId,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: graphDocumentId,
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
          graphDocumentId,
        )
        const childObjectIds = publishedRow.objects.map((objectRow) =>
          buildProjectObjectId(project.projectFileId, graphDocumentId, objectRow.objectId),
        )
        const componentPlacement = resolveRuntimePlacement(componentId, rootAssemblyId, null)
        nextRuntimePlacementByRowId[componentId] = componentPlacement
        const resolutionState = publishedRow.objects.some((objectRow) => objectRow.state === 'resolved')
          ? 'resolved'
          : 'unresolved'
        const publishedSubcomponents = publishedRow.subcomponents ?? []
        const topLevelChildRowIds: string[] = []
        const includedTopLevelRowIds = new Set<string>()
        publishedRow.objects.forEach((objectRow) => {
          const matchingSubcomponent = publishedSubcomponents.find(
            (subcomponent) => subcomponent.slotId === objectRow.slotId,
          )
          if (matchingSubcomponent !== undefined) {
            const subcomponentId = buildProjectPublishedSubcomponentId(
              project.projectFileId,
              graphDocumentId,
              matchingSubcomponent.slotId,
            )
            if (!includedTopLevelRowIds.has(subcomponentId)) {
              includedTopLevelRowIds.add(subcomponentId)
              topLevelChildRowIds.push(subcomponentId)
            }
            return
          }
          const directObjectId = buildProjectObjectId(
            project.projectFileId,
            graphDocumentId,
            objectRow.objectId,
          )
          if (!includedTopLevelRowIds.has(directObjectId)) {
            includedTopLevelRowIds.add(directObjectId)
            topLevelChildRowIds.push(directObjectId)
          }
        })
        componentsById[componentId] = {
          componentId,
          parentAssemblyId: componentPlacement.parentAssemblyId,
          parentComponentId: componentPlacement.parentComponentId,
          ownerGraphDocumentId: graphDocumentId,
          sourceGraphDocumentId: graphDocumentId,
          sourceOutputEntryId: null,
          sourceNodeId: null,
          label:
            publishedRow.componentLabel === OUTPUT_PREVIEW_DEFAULT_COMPONENT_LABEL
              ? `Component ${publishedComponentOrdinal}`
              : publishedRow.componentLabel,
          componentSourceKind: 'published-component',
          resolutionState,
          receiveId: null,
          childRowIds: topLevelChildRowIds,
          childObjectIds,
        }
        publishedSubcomponents.forEach((subcomponent) => {
          const subcomponentId = buildProjectPublishedSubcomponentId(
            project.projectFileId,
            graphDocumentId,
            subcomponent.slotId,
          )
          const subcomponentChildObjectIds = subcomponent.objects.map((objectRow) =>
            buildProjectObjectId(project.projectFileId, graphDocumentId, objectRow.objectId),
          )
          const subcomponentPlacement = resolveRuntimePlacement(
            subcomponentId,
            componentPlacement.parentAssemblyId,
            componentId,
          )
          nextRuntimePlacementByRowId[subcomponentId] = subcomponentPlacement
          componentsById[subcomponentId] = {
            componentId: subcomponentId,
            parentAssemblyId: subcomponentPlacement.parentAssemblyId,
            parentComponentId: subcomponentPlacement.parentComponentId,
            ownerGraphDocumentId: graphDocumentId,
            sourceGraphDocumentId: graphDocumentId,
            sourceOutputEntryId: null,
            sourceNodeId: null,
            label: subcomponent.label,
            componentSourceKind: 'published-component',
            resolutionState: subcomponent.objects.some((objectRow) => objectRow.state === 'resolved')
              ? 'resolved'
              : 'unresolved',
            receiveId: null,
            childRowIds: subcomponentChildObjectIds,
            childObjectIds: subcomponentChildObjectIds,
          }
        })
        publishedRow.objects.forEach((objectRow, index) => {
          const objectId = childObjectIds[index]
          if (objectId === undefined) {
            return
          }
          const parentSubcomponent = publishedSubcomponents.find(
            (subcomponent) => subcomponent.slotId === objectRow.slotId,
          )
          const objectPlacement = resolveRuntimePlacement(
            objectId,
            componentPlacement.parentAssemblyId,
            parentSubcomponent === undefined
              ? componentId
              : buildProjectPublishedSubcomponentId(
                  project.projectFileId,
                  graphDocumentId,
                  parentSubcomponent.slotId,
                ),
          )
          nextRuntimePlacementByRowId[objectId] = objectPlacement
          objectsById[objectId] = {
            objectId,
            ownerGraphDocumentId: graphDocumentId,
            parentAssemblyId: objectPlacement.parentAssemblyId,
            parentComponentId: objectPlacement.parentComponentId,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: graphDocumentId,
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
      graphDocumentId,
    )) {
      const objectId = buildProjectReceiveObjectId(
        project.projectFileId,
        graphDocumentId,
        receiveReference.receiveId,
      )
      validRuntimeRowIds.add(objectId)
      const placement = resolveRuntimePlacement(objectId, rootAssemblyId, null)
      nextRuntimePlacementByRowId[objectId] = placement
      const label = receiveReference.sourceEntry?.label ?? receiveReference.sourceOutputEntryId
      objectsById[objectId] = {
        objectId,
        ownerGraphDocumentId: graphDocumentId,
        parentAssemblyId: placement.parentAssemblyId,
        parentComponentId: placement.parentComponentId,
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

  authoredComponents.forEach((component) => {
    componentsById[component.componentId] = {
      ...component,
      parentAssemblyId: component.parentAssemblyId,
      parentComponentId: component.parentComponentId ?? null,
      ownerGraphDocumentId: component.ownerGraphDocumentId ?? null,
      sourceGraphDocumentId: component.sourceGraphDocumentId ?? null,
      componentSourceKind: 'authored',
      childObjectIds: [],
    }
  })

  const assembliesById: Record<string, ProjectAssemblyRecord> = {
    [rootAssemblyId]: {
      assemblyId: rootAssemblyId,
      label: previousAssemblies[rootAssemblyId]?.label ?? ROOT_ASSEMBLY_LABEL,
      parentAssemblyId: null,
      assemblySourceKind: 'runtime-root',
      childRowIds: [],
    },
  }

  authoredAssemblies.forEach((assembly) => {
    assembliesById[assembly.assemblyId] = {
      assemblyId: assembly.assemblyId,
      label: assembly.label,
      parentAssemblyId: assembly.parentAssemblyId,
      assemblySourceKind: 'authored',
      childRowIds: [],
    }
  })

  Object.values(componentsById).forEach((component) => {
    if (
      component.parentComponentId !== null &&
      component.parentComponentId !== undefined &&
      componentsById[component.parentComponentId] === undefined
    ) {
      component.parentComponentId = null
    }
    if (component.parentAssemblyId === null || component.parentAssemblyId === undefined) {
      component.parentAssemblyId = rootAssemblyId
    }
    if (!(component.parentAssemblyId in assembliesById)) {
      component.parentAssemblyId = rootAssemblyId
    }
    if (component.parentComponentId != null) {
      component.parentAssemblyId =
        componentsById[component.parentComponentId]?.parentAssemblyId ?? component.parentAssemblyId
    }
  })

  Object.values(objectsById).forEach((objectRow) => {
    if (
      objectRow.parentComponentId !== null &&
      componentsById[objectRow.parentComponentId] === undefined
    ) {
      objectRow.parentComponentId = null
    }
    if (objectRow.parentComponentId !== null) {
      objectRow.parentAssemblyId =
        componentsById[objectRow.parentComponentId]?.parentAssemblyId ?? rootAssemblyId
    } else if (
      objectRow.parentAssemblyId === null ||
      objectRow.parentAssemblyId === undefined ||
      assembliesById[objectRow.parentAssemblyId] === undefined
    ) {
      objectRow.parentAssemblyId = rootAssemblyId
    }
  })

  Object.values(componentsById).forEach((component) => {
    component.childRowIds = orderByPreviousIds(
      [
        ...Object.values(componentsById)
          .filter((candidate) => candidate.parentComponentId === component.componentId)
          .map((candidate) => candidate.componentId),
        ...Object.values(objectsById)
          .filter((objectRow) => objectRow.parentComponentId === component.componentId)
          .map((objectRow) => objectRow.objectId),
      ],
      previousComponents[component.componentId]?.childRowIds ??
        previousComponents[component.componentId]?.childObjectIds,
    )
  })

  Object.values(componentsById).forEach((component) => {
    const descendantObjectIds: string[] = []
    const visitComponent = (componentId: string, visited: Set<string>) => {
      if (visited.has(componentId)) {
        return
      }
      visited.add(componentId)
      const currentComponent = componentsById[componentId]
      if (currentComponent === undefined) {
        return
      }
      getProjectComponentChildRowIds(currentComponent).forEach((childRowId) => {
        const childComponent = componentsById[childRowId]
        if (childComponent !== undefined) {
          visitComponent(childComponent.componentId, visited)
          return
        }
        if (objectsById[childRowId] !== undefined) {
          descendantObjectIds.push(childRowId)
        }
      })
    }
    visitComponent(component.componentId, new Set<string>())
    component.childObjectIds = orderByPreviousIds(
      descendantObjectIds,
      previousComponents[component.componentId]?.childObjectIds,
    )
  })

  Object.values(componentsById).forEach((component) => {
    if (
      component.componentSourceKind !== 'published-component' ||
      component.childObjectIds.length > 0
    ) {
      return
    }
    delete componentsById[component.componentId]
    delete nextRuntimePlacementByRowId[component.componentId]
    validRuntimeRowIds.delete(component.componentId)
  })

  Object.values(assembliesById).forEach((assembly) => {
    const childAssemblyIds = authoredAssemblies
      .filter((candidate) => candidate.parentAssemblyId === assembly.assemblyId)
      .map((candidate) => candidate.assemblyId)
    const childComponentIds = Object.values(componentsById)
      .filter(
        (component) =>
          component.parentAssemblyId === assembly.assemblyId &&
          (component.parentComponentId ?? null) === null,
      )
      .map((component) => component.componentId)
    const looseObjectIds = Object.values(objectsById)
      .filter(
        (objectRow) =>
          objectRow.parentComponentId === null && objectRow.parentAssemblyId === assembly.assemblyId,
      )
      .map((objectRow) => objectRow.objectId)
    assembly.childRowIds = orderByPreviousIds(
      [...childAssemblyIds, ...childComponentIds, ...looseObjectIds],
      previousAssemblies[assembly.assemblyId]?.childRowIds,
    )
  })

  validRuntimeRowIds.forEach((rowId) => {
    if (nextRuntimePlacementByRowId[rowId] !== undefined) {
      return
    }
    const previousPlacement = previousPlacementOverlay[rowId]
    if (previousPlacement !== undefined) {
      nextRuntimePlacementByRowId[rowId] = previousPlacement
    }
  })

  return {
    projectContent: {
      assembliesById,
      componentsById,
      objectsById,
    },
    runtimeContentPlacementByRowId: nextRuntimePlacementByRowId,
  }
}

const createInitialProjectContentState = (): ProjectContentState => {
  const initialProject = createInitialProjectFile()
  const spaghettiState = useSpaghettiStore.getState()
  const acceptedPublicationRecords = buildProjectAcceptedPublicationRecords(
    initialProject,
    spaghettiState,
  )
  return buildProjectContentDerivation(
    initialProject,
    spaghettiState,
    acceptedPublicationRecords,
  ).projectContent
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
  left.parentAssemblyId === right.parentAssemblyId &&
  left.assemblySourceKind === right.assemblySourceKind &&
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
        entry.parentAssemblyId === other.parentAssemblyId &&
        (entry.parentComponentId ?? null) === (other.parentComponentId ?? null) &&
        entry.ownerGraphDocumentId === other.ownerGraphDocumentId &&
        entry.sourceGraphDocumentId === other.sourceGraphDocumentId &&
        entry.sourceOutputEntryId === other.sourceOutputEntryId &&
        entry.sourceNodeId === other.sourceNodeId &&
        entry.label === other.label &&
        entry.componentSourceKind === other.componentSourceKind &&
        entry.resolutionState === other.resolutionState &&
        entry.receiveId === other.receiveId &&
        areOrderedStringArraysEqual(
          getProjectComponentChildRowIds(entry),
          getProjectComponentChildRowIds(other),
        ) &&
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
        entry.parentAssemblyId === other.parentAssemblyId &&
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

const isGraphVisibleInActiveViewer = (
  state: Pick<SpaghettiStoreState, 'viewerTargetGraphDocumentId' | 'sharedViewerComposition'>,
  graphDocumentId: string,
): boolean =>
  state.viewerTargetGraphDocumentId === graphDocumentId ||
  state.sharedViewerComposition?.graphDocumentIds.includes(graphDocumentId) === true

const selectActiveViewerModeBehavior = (): WorkspaceViewportResultModeBehavior => {
  const workspaceState = useWorkspaceStore.getState()
  return selectViewportResultModeBehaviorById(
    workspaceState,
    workspaceState.activeViewerViewportId,
  )
}

const isGraphVisibleInActiveAutoViewer = (graphDocumentId: string): boolean =>
  isGraphVisibleInActiveViewer(useSpaghettiStore.getState(), graphDocumentId) &&
  selectActiveViewerModeBehavior().mode === 'auto'

const doesRuntimeHaveCurrentAcceptedResult = (
  runtime: GraphRuntimeState | null | undefined,
): boolean => {
  if (runtime === undefined || runtime === null) {
    return false
  }

  const currentGraphRevision = runtime.compileBuild.currentGraphRevision
  const latestAcceptedGraphRevision = runtime.compileBuild.latestAcceptedGraphRevision
  if (
    currentGraphRevision === null ||
    latestAcceptedGraphRevision === null ||
    latestAcceptedGraphRevision !== currentGraphRevision
  ) {
    return false
  }

  return (
    runtime.acceptedAuthoritativeGeometryResult !== null ||
    runtime.acceptedDraftGeometryResult !== null ||
    runtime.acceptedPreviewBuildOutputs.length > 0
  )
}

const resolveRequestComparisonBuildInputs = (
  runtime: GraphRuntimeState | null,
  executionIntent: BuildExecutionIntent,
  options?: GraphDocumentBuildRequestOptions,
): CompileSpaghettiGraphResult['buildInputs'] | undefined => {
  const compileBuild = runtime?.compileBuild ?? null
  const previousBuildInputs = compileBuild?.previousBuildInputs ?? undefined
  if (
    options?.reuseCurrentAcceptedPreviewComparison !== true ||
    executionIntent.geometryTarget !== 'authoritative'
  ) {
    return previousBuildInputs
  }

  const currentGraphRevision = compileBuild?.currentGraphRevision ?? null
  const latestAcceptedGraphRevision = compileBuild?.latestAcceptedGraphRevision ?? null
  const comparisonBuildInputs = compileBuild?.comparisonBuildInputs ?? null
  if (
    currentGraphRevision === null ||
    latestAcceptedGraphRevision === null ||
    latestAcceptedGraphRevision !== currentGraphRevision ||
    runtime?.acceptedPreviewGraphRevision !== currentGraphRevision ||
    runtime?.acceptedAuthoritativeGraphRevision === currentGraphRevision ||
    comparisonBuildInputs === null
  ) {
    return previousBuildInputs
  }

  return comparisonBuildInputs
}

const requestAutoViewportDraftBuildIfAllowed = (graphDocumentId: string): void => {
  const appState = useAppStore.getState()
  const policy = selectEffectiveBrowserExecutionPolicy(appState, {
    kind: 'graph-document',
    graphDocumentId,
  })
  if (policy === 'manual' || policy === 'off') {
    return
  }

  appState.requestGraphDocumentBuild(graphDocumentId, {
    browserExecutionPolicy: policy,
    geometryTargetOverride: 'draft_preview',
  })
}

const maybeRequestAutoViewportAuthoritativeFollowThrough = (graphDocumentId: string): void => {
  if (!isGraphVisibleInActiveAutoViewer(graphDocumentId)) {
    return
  }

  const appState = useAppStore.getState()
  const policy = selectEffectiveBrowserExecutionPolicy(appState, {
    kind: 'graph-document',
    graphDocumentId,
  })
  if (policy === 'manual' || policy === 'off') {
    return
  }

  if (appState.delayedAuthoritativeBuildByGraphDocumentId[graphDocumentId] !== undefined) {
    return
  }

  const runtime = selectGraphRuntimeByDocumentId(useSpaghettiStore.getState(), graphDocumentId)
  if (runtime === null) {
    return
  }

  const currentGraphRevision = runtime.compileBuild.currentGraphRevision
  const latestAcceptedGraphRevision = runtime.compileBuild.latestAcceptedGraphRevision
  if (
    currentGraphRevision === null ||
    latestAcceptedGraphRevision === null ||
    latestAcceptedGraphRevision !== currentGraphRevision
  ) {
    return
  }

  if (runtime.compileBuild.inFlightBuildRequestId !== null) {
    return
  }

  if (
    runtime.acceptedDraftGeometryResult === null &&
    runtime.acceptedPreviewBuildOutputs.length === 0
  ) {
    return
  }

  if (
    runtime.acceptedAuthoritativeGeometryResult !== null &&
    runtime.acceptedAuthoritativeGraphRevision === currentGraphRevision
  ) {
    return
  }

  appState.requestBrowserGraphDocumentBuild(graphDocumentId, {
    geometryTargetOverride: 'authoritative',
    reuseCurrentAcceptedPreviewComparison: true,
  })
}

const resolveGraphBuildGeometryTarget = (graphDocumentId: string): GeometryExecutionTarget => {
  const spaghettiState = useSpaghettiStore.getState()
  if (!isGraphVisibleInActiveViewer(spaghettiState, graphDocumentId)) {
    return DEFAULT_BUILD_EXECUTION_INTENT.geometryTarget
  }

  const workspaceState = useWorkspaceStore.getState()
  const modeBehavior = selectViewportResultModeBehaviorById(
    workspaceState,
    workspaceState.activeViewerViewportId,
  )
  return modeBehavior.mode === 'final' ? 'authoritative' : 'draft_preview'
}

const resolveGraphBuildUpdatePolicy = (
  options?: GraphDocumentBuildRequestOptions,
): BuildExecutionIntent['updatePolicy'] => {
  if (options?.explicit === true || options?.browserExecutionPolicy === 'manual') {
    return 'manual'
  }
  if (options?.browserExecutionPolicy === 'release') {
    return 'defer_until_release'
  }
  return DEFAULT_BUILD_EXECUTION_INTENT.updatePolicy
}

export const resolveGraphBuildDraftPolicy = (
  graphDocumentId: string,
  options?: GraphDocumentBuildRequestOptions,
): BuildExecutionIntent['draftPolicy'] => {
  if (options?.draftPolicyOverride !== undefined) {
    return options.draftPolicyOverride
  }

  const geometryTarget =
    options?.geometryTargetOverride ?? resolveGraphBuildGeometryTarget(graphDocumentId)
  if (geometryTarget !== 'draft_preview') {
    return DEFAULT_BUILD_EXECUTION_INTENT.draftPolicy
  }

  if (options?.browserExecutionPolicy === 'off') {
    return 'suppressed'
  }
  if (options?.browserExecutionPolicy === 'release') {
    return 'release'
  }

  return DEFAULT_BUILD_EXECUTION_INTENT.draftPolicy
}

export const resolveGraphBuildAuthoritativePolicy = (
  graphDocumentId: string,
  options?: GraphDocumentBuildRequestOptions,
): BuildExecutionIntent['authoritativePolicy'] => {
  if (options?.authoritativePolicyOverride !== undefined) {
    return options.authoritativePolicyOverride
  }

  const geometryTarget =
    options?.geometryTargetOverride ?? resolveGraphBuildGeometryTarget(graphDocumentId)
  if (geometryTarget !== 'authoritative') {
    return DEFAULT_BUILD_EXECUTION_INTENT.authoritativePolicy
  }

  if (options?.explicit === true || options?.browserExecutionPolicy === 'manual') {
    return 'explicit'
  }
  if (options?.browserExecutionPolicy === 'live') {
    return 'live'
  }
  return 'release'
}

export const resolveGraphBuildExecutionIntent = (
  graphDocumentId: string,
  options?: GraphDocumentBuildRequestOptions,
): BuildExecutionIntent => ({
  ...DEFAULT_BUILD_EXECUTION_INTENT,
  updatePolicy: resolveGraphBuildUpdatePolicy(options),
  draftPolicy: resolveGraphBuildDraftPolicy(graphDocumentId, options),
  authoritativePolicy: resolveGraphBuildAuthoritativePolicy(graphDocumentId, options),
  geometryTarget: options?.geometryTargetOverride ?? resolveGraphBuildGeometryTarget(graphDocumentId),
})

const getCompileErrorMessage = (compileResult: CompileSpaghettiGraphResult): string =>
  compileResult.diagnostics.errors[0]?.message ?? 'The graph does not currently compile.'

const dispatchDelayedGraphBuildPlaceholder = (
  graphDocumentId: string,
  placeholder: DelayedDraftBuildPlaceholder | DelayedAuthoritativeBuildPlaceholder,
): void => {
  const buildRequestId = newId('build-request')
  const buildSeq = buildDispatcher.requestGraphBuild({
    routingIdentity: {
      projectFileId: placeholder.projectFileId,
      graphDocumentId,
      buildRequestId,
    },
    executionIntent: placeholder.executionIntent,
    compiledBuildData: placeholder.compiledBuildData,
    buildIdentity: placeholder.buildIdentity,
    invalidation: placeholder.invalidation,
    changedParamIds: placeholder.changedParamIds,
    ...(placeholder.changedInputHint === undefined
      ? {}
      : { changedInputHint: placeholder.changedInputHint }),
    buildStatsPartKeys: placeholder.buildStatsPartKeys,
  })
  useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
    compileResult: placeholder.compileResult,
    previousBuildInputs: placeholder.previousBuildInputs,
    pendingChangedParamIds: placeholder.changedParamIds,
    pendingChangedInputHint: placeholder.changedInputHint,
    pendingStatsPartKeys: placeholder.buildStatsPartKeys,
    pendingTargetBuildUnitIds: placeholder.buildIdentity.targetBuildUnitIds,
    pendingAffectedBuildUnitIds: placeholder.invalidation.affectedBuildUnitIds,
    buildRequestId,
    buildSeq,
    executionIntent: placeholder.executionIntent,
  })
}

const isCurrentRevisionAuthoritativeUnavailable = (
  runtime: GraphRuntimeState | null | undefined,
): boolean =>
  runtime !== undefined &&
  runtime !== null &&
  runtime.compileBuild.inFlightBuildRequestId === null &&
  runtime.compileBuild.latestAcceptedGraphRevision !== null &&
  runtime.compileBuild.latestAcceptedGraphRevision === runtime.compileBuild.currentGraphRevision &&
  runtime.acceptedBuildBundle?.executionIntent.geometryTarget === 'authoritative' &&
  deriveAuthoritativeExportInput(runtime.acceptedAuthoritativeGeometryResult) === null

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
  delayedDraftBuildByGraphDocumentId: {},
  delayedAuthoritativeBuildByGraphDocumentId: {},
  isInteracting: false,
  pendingBuildAfterRelease: false,
  currentProject: createInitialProjectFile(),
  projectContent: createInitialProjectContentState(),
  runtimeContentPlacementByRowId: {},
  viewportPresentationSettings: createInitialViewportPresentationSettings(),
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
  consoleWorkspaceContextHandoff: null,
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
  requestGraphDocumentBuild: (graphDocumentId, options) => {
    if (options?.explicit === true) {
      get().settleGraphViewportComparison(graphDocumentId)
    }
    const state = get()
    const spaghettiState = useSpaghettiStore.getState()
    const existingDelayedPlaceholder =
      state.delayedDraftBuildByGraphDocumentId[graphDocumentId] ?? null
    const compileResult = get().compileGraphDocument(graphDocumentId)
    if (!compileResult.ok || compileResult.buildInputs === undefined) {
      return compileResult
    }

    const runtime = selectGraphRuntimeByDocumentId(spaghettiState, graphDocumentId)
    const pendingBuildState = runtime?.compileBuild ?? null
    const previewPreparation = runtime?.previewPreparation ?? null
    if (previewPreparation === null) {
      return compileResult
    }
    const executionIntent = resolveGraphBuildExecutionIntent(graphDocumentId, options)
    const comparisonBuildInputs = resolveRequestComparisonBuildInputs(
      runtime,
      executionIntent,
      options,
    )
    const requestBuild = buildRequestFromBuildInputs(
      compileResult.buildInputs,
      previewPreparation,
      comparisonBuildInputs,
    )
    if (requestBuild.targetBuildUnitIds.length === 0) {
      return compileResult
    }
    if (
      executionIntent.geometryTarget === 'authoritative' &&
      executionIntent.authoritativePolicy !== 'live' &&
      options?.delayedAuthoritativeDispatchTrigger !== executionIntent.authoritativePolicy
    ) {
      set((current) => ({
        delayedAuthoritativeBuildByGraphDocumentId: {
          ...current.delayedAuthoritativeBuildByGraphDocumentId,
          [graphDocumentId]: {
            projectFileId: state.currentProject.projectFileId,
            graphDocumentId,
            graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
            compileResult,
            previousBuildInputs: comparisonBuildInputs ?? null,
            executionIntent: { ...executionIntent },
            compiledBuildData: requestBuild.compiledBuildData,
            buildIdentity: {
              graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
              targetBuildUnitIds: [...requestBuild.targetBuildUnitIds],
            },
            invalidation: {
              affectedBuildUnitIds: [...requestBuild.affectedBuildUnitIds],
            },
            changedParamIds: [...requestBuild.changedParamIds],
            ...(requestBuild.changedInputHint === undefined
              ? {}
              : { changedInputHint: requestBuild.changedInputHint }),
            buildStatsPartKeys: [...requestBuild.buildStatsPartKeys],
          },
        },
      }))
      appendConsoleEntry({
        layer: 'App',
        text: `Delayed authoritative build staged for ${graphDocumentId}`,
        source: graphDocumentId,
        severity: 'info',
      })
      return compileResult
    }
    if (
      executionIntent.geometryTarget === 'draft_preview' &&
      (executionIntent.draftPolicy === 'release' || executionIntent.draftPolicy === 'settle') &&
      options?.delayedDraftDispatchTrigger !== executionIntent.draftPolicy
    ) {
      if (existingDelayedPlaceholder !== null) {
        publishDraftSchedulingRuntimeEvent({
          type: 'draft_replaced',
          graphDocumentId,
          draftPolicy: existingDelayedPlaceholder.executionIntent.draftPolicy,
        })
      }
      set((current) => ({
        delayedDraftBuildByGraphDocumentId: {
          ...current.delayedDraftBuildByGraphDocumentId,
          [graphDocumentId]: {
            projectFileId: state.currentProject.projectFileId,
            graphDocumentId,
            graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
            compileResult,
            previousBuildInputs: comparisonBuildInputs ?? null,
            executionIntent: { ...executionIntent },
            compiledBuildData: requestBuild.compiledBuildData,
            buildIdentity: {
              graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
              targetBuildUnitIds: [...requestBuild.targetBuildUnitIds],
            },
            invalidation: {
              affectedBuildUnitIds: [...requestBuild.affectedBuildUnitIds],
            },
            changedParamIds: [...requestBuild.changedParamIds],
            ...(requestBuild.changedInputHint === undefined
              ? {}
              : { changedInputHint: requestBuild.changedInputHint }),
            buildStatsPartKeys: [...requestBuild.buildStatsPartKeys],
          },
        },
      }))
      appendConsoleEntry({
        layer: 'App',
        text: `Delayed draft build staged for ${graphDocumentId}`,
        source: graphDocumentId,
        severity: 'info',
      })
      publishDraftSchedulingRuntimeEvent({
        type: 'draft_delayed',
        graphDocumentId,
        draftPolicy: executionIntent.draftPolicy,
      })
      return compileResult
    }

    set((current) => ({
      delayedDraftBuildByGraphDocumentId: deleteRecordKey(
        current.delayedDraftBuildByGraphDocumentId,
        graphDocumentId,
      ),
      delayedAuthoritativeBuildByGraphDocumentId:
        executionIntent.geometryTarget === 'authoritative'
          ? deleteRecordKey(current.delayedAuthoritativeBuildByGraphDocumentId, graphDocumentId)
          : current.delayedAuthoritativeBuildByGraphDocumentId,
    }))
    const releaseTriggeredPlaceholderDispatch =
      existingDelayedPlaceholder !== null &&
      options?.delayedDraftDispatchTrigger === existingDelayedPlaceholder.executionIntent.draftPolicy &&
      executionIntent.draftPolicy === existingDelayedPlaceholder.executionIntent.draftPolicy
    if (existingDelayedPlaceholder !== null && !releaseTriggeredPlaceholderDispatch) {
      publishDraftSchedulingRuntimeEvent({
        type: 'draft_replaced',
        graphDocumentId,
        draftPolicy: existingDelayedPlaceholder.executionIntent.draftPolicy,
      })
    }
    const buildRequestId = newId('build-request')
    const buildSeq = buildDispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: state.currentProject.projectFileId,
        graphDocumentId,
        buildRequestId,
      },
      executionIntent,
      compiledBuildData: requestBuild.compiledBuildData,
      buildIdentity: {
        graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
        targetBuildUnitIds: requestBuild.targetBuildUnitIds,
      },
      invalidation: {
        affectedBuildUnitIds: requestBuild.affectedBuildUnitIds,
      },
      changedParamIds: requestBuild.changedParamIds,
      ...(requestBuild.changedInputHint === undefined
        ? {}
        : { changedInputHint: requestBuild.changedInputHint }),
      buildStatsPartKeys: requestBuild.buildStatsPartKeys,
    })
    spaghettiState.stageGraphBuildRequest(graphDocumentId, {
      compileResult,
      previousBuildInputs: comparisonBuildInputs ?? null,
      pendingChangedParamIds: requestBuild.changedParamIds,
      pendingChangedInputHint: requestBuild.changedInputHint,
      pendingStatsPartKeys: requestBuild.buildStatsPartKeys,
      pendingTargetBuildUnitIds: requestBuild.targetBuildUnitIds,
      pendingAffectedBuildUnitIds: requestBuild.affectedBuildUnitIds,
      buildRequestId,
      buildSeq,
      executionIntent,
    })
    appendConsoleEntry({
      layer: 'App',
      text: `Requested graph build for ${graphDocumentId}`,
      source: graphDocumentId,
      severity: 'info',
    })
    return compileResult
  },
  prepareGraphDocumentExport: (graphDocumentId) => {
    const initialRuntime = selectGraphRuntimeByDocumentId(
      useSpaghettiStore.getState(),
      graphDocumentId,
    )
    const acceptedExportInput = deriveAuthoritativeExportInput(
      initialRuntime?.acceptedAuthoritativeGeometryResult,
    )
    if (acceptedExportInput !== null) {
      return {
        status: 'ready',
        graphDocumentId,
        input: acceptedExportInput,
      }
    }

    const compileResult = get().compileGraphDocument(graphDocumentId)
    if (!compileResult.ok) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'compile-invalid',
        message: getCompileErrorMessage(compileResult),
      }
    }
    if (compileResult.buildInputs === undefined) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'missing-build-inputs',
        message: 'The graph has no buildable output to prepare for export.',
      }
    }

    const runtimeAfterCompile = selectGraphRuntimeByDocumentId(
      useSpaghettiStore.getState(),
      graphDocumentId,
    )
    if (runtimeAfterCompile === null || runtimeAfterCompile === undefined) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'missing-preview-preparation',
        message: 'The graph runtime is not available for export preparation.',
      }
    }

    const currentAcceptedExportInput = deriveAuthoritativeExportInput(
      runtimeAfterCompile.acceptedAuthoritativeGeometryResult,
    )
    if (currentAcceptedExportInput !== null) {
      return {
        status: 'ready',
        graphDocumentId,
        input: currentAcceptedExportInput,
      }
    }

    const delayedAuthoritativePlaceholder =
      get().delayedAuthoritativeBuildByGraphDocumentId[graphDocumentId] ?? null
    if (delayedAuthoritativePlaceholder !== null) {
      return {
        status: 'pending',
        graphDocumentId,
        pendingReason: 'awaiting-authoritative-build',
      }
    }

    if (
      runtimeAfterCompile.compileBuild.inFlightBuildRequestId !== null &&
      runtimeAfterCompile.compileBuild.inFlightBuildSeq !== null &&
      runtimeAfterCompile.compileBuild.inFlightExecutionIntent?.geometryTarget ===
        'authoritative'
    ) {
      return {
        status: 'pending',
        graphDocumentId,
        pendingReason: 'awaiting-authoritative-build',
        buildRequestId: runtimeAfterCompile.compileBuild.inFlightBuildRequestId,
        buildSeq: runtimeAfterCompile.compileBuild.inFlightBuildSeq,
      }
    }

    if (isCurrentRevisionAuthoritativeUnavailable(runtimeAfterCompile)) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'authoritative-unavailable',
        message: 'The current graph revision does not have reusable authoritative geometry for export.',
      }
    }

    const requestResult = get().requestGraphDocumentBuild(graphDocumentId, {
      explicit: true,
      delayedAuthoritativeDispatchTrigger: 'explicit',
      geometryTargetOverride: 'authoritative',
    })
    if (!requestResult.ok) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'compile-invalid',
        message: getCompileErrorMessage(requestResult),
      }
    }

    const runtimeAfterRequest = selectGraphRuntimeByDocumentId(
      useSpaghettiStore.getState(),
      graphDocumentId,
    )
    const delayedAuthoritativePlaceholderAfterRequest =
      get().delayedAuthoritativeBuildByGraphDocumentId[graphDocumentId] ?? null
    const pendingBuildRequestId = runtimeAfterRequest?.compileBuild.inFlightBuildRequestId ?? null
    const pendingBuildSeq = runtimeAfterRequest?.compileBuild.inFlightBuildSeq ?? null
    if (
      pendingBuildRequestId !== null &&
      pendingBuildSeq !== null &&
      runtimeAfterRequest?.compileBuild.inFlightExecutionIntent?.geometryTarget === 'authoritative'
    ) {
      return {
        status: 'pending',
        graphDocumentId,
        pendingReason: 'requested-authoritative-build',
        buildRequestId: pendingBuildRequestId,
        buildSeq: pendingBuildSeq,
      }
    }
    if (delayedAuthoritativePlaceholderAfterRequest !== null) {
      return {
        status: 'pending',
        graphDocumentId,
        pendingReason: 'requested-authoritative-build',
      }
    }

    const requestedAcceptedExportInput = deriveAuthoritativeExportInput(
      runtimeAfterRequest?.acceptedAuthoritativeGeometryResult,
    )
    if (requestedAcceptedExportInput !== null) {
      return {
        status: 'ready',
        graphDocumentId,
        input: requestedAcceptedExportInput,
      }
    }

    if (isCurrentRevisionAuthoritativeUnavailable(runtimeAfterRequest)) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'authoritative-unavailable',
        message: 'The current graph revision does not have reusable authoritative geometry for export.',
      }
    }

    return {
      status: 'blocked',
      graphDocumentId,
      blockedReason: 'no-build-targets',
      message: 'The graph has no exportable build targets to prepare.',
    }
  },
  compileSpaghetti: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    return get().compileGraphDocument(activeGraphDocument.graphDocumentId)
  },
  requestSpaghettiBuild: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    return get().requestGraphDocumentBuild(activeGraphDocument.graphDocumentId)
  },
  prepareSpaghettiExport: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    return get().prepareGraphDocumentExport(activeGraphDocument.graphDocumentId)
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
  setViewportPresentationOpacity: (stateId, opacity) => {
    set((state) => {
      const currentSettings = state.viewportPresentationSettings[stateId]
      const nextOpacity = clampViewportPresentationOpacity(opacity, currentSettings.opacity)
      if (currentSettings.opacity === nextOpacity) {
        return state
      }
      return {
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          [stateId]: {
            ...currentSettings,
            opacity: nextOpacity,
          },
        },
      }
    })
  },
  setViewportPresentationColor: (stateId, color) => {
    set((state) => {
      const currentSettings = state.viewportPresentationSettings[stateId]
      const nextColor = normalizeViewportPresentationColor(color, currentSettings.color)
      if (currentSettings.color === nextColor) {
        return state
      }
      return {
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          [stateId]: {
            ...currentSettings,
            color: nextColor,
          },
        },
      }
    })
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
    const delayedDraftPlaceholder = get().delayedDraftBuildByGraphDocumentId[graphDocumentId] ?? null
    const delayedAuthoritativePlaceholder =
      get().delayedAuthoritativeBuildByGraphDocumentId[graphDocumentId] ?? null
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
    useSpaghettiStore.getState().promoteStagedAuthoritativePreviewResult(graphDocumentId)
    if (shouldDispatchQueuedBuild) {
      if (delayedDraftPlaceholder !== null) {
        publishDraftSchedulingRuntimeEvent({
          type: 'draft_released',
          graphDocumentId,
          draftPolicy: delayedDraftPlaceholder.executionIntent.draftPolicy,
        })
      }
      get().requestBrowserGraphDocumentBuild(graphDocumentId, {
        delayedDraftDispatchTrigger: 'release',
        delayedAuthoritativeDispatchTrigger: 'release',
      })
      return
    }
    if (delayedDraftPlaceholder?.executionIntent.draftPolicy === 'release') {
      publishDraftSchedulingRuntimeEvent({
        type: 'draft_released',
        graphDocumentId,
        draftPolicy: delayedDraftPlaceholder.executionIntent.draftPolicy,
      })
      set((state) => ({
        delayedDraftBuildByGraphDocumentId: deleteRecordKey(
          state.delayedDraftBuildByGraphDocumentId,
          graphDocumentId,
        ),
      }))
      dispatchDelayedGraphBuildPlaceholder(graphDocumentId, delayedDraftPlaceholder)
      appendConsoleEntry({
        layer: 'App',
        text: `Released delayed draft build for ${graphDocumentId}`,
        source: graphDocumentId,
        severity: 'info',
      })
    }
    if (delayedAuthoritativePlaceholder?.executionIntent.authoritativePolicy === 'release') {
      set((state) => ({
        delayedAuthoritativeBuildByGraphDocumentId: deleteRecordKey(
          state.delayedAuthoritativeBuildByGraphDocumentId,
          graphDocumentId,
        ),
      }))
      dispatchDelayedGraphBuildPlaceholder(graphDocumentId, delayedAuthoritativePlaceholder)
      appendConsoleEntry({
        layer: 'App',
        text: `Released delayed authoritative build for ${graphDocumentId}`,
        source: graphDocumentId,
        severity: 'info',
      })
    }
  },
  requestBrowserGraphDocumentBuild: (graphDocumentId, options) => {
    const policy = selectEffectiveBrowserExecutionPolicy(get(), {
      kind: 'graph-document',
      graphDocumentId,
    })
    const isExplicit = options?.explicit === true
    const releaseAlreadyReached =
      policy === 'release' && get().browserInteractionGraphDocumentIds[graphDocumentId] !== true

    if (policy === 'off') {
      set((state) => ({
        delayedDraftBuildByGraphDocumentId: deleteRecordKey(
          state.delayedDraftBuildByGraphDocumentId,
          graphDocumentId,
        ),
        delayedAuthoritativeBuildByGraphDocumentId: deleteRecordKey(
          state.delayedAuthoritativeBuildByGraphDocumentId,
          graphDocumentId,
        ),
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
      publishDraftSchedulingRuntimeEvent({
        type: 'draft_suppressed',
        graphDocumentId,
        draftPolicy: 'suppressed',
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
    return get().requestGraphDocumentBuild(graphDocumentId, {
      browserExecutionPolicy: policy,
      explicit: isExplicit,
      reuseCurrentAcceptedPreviewComparison: options?.reuseCurrentAcceptedPreviewComparison,
      delayedDraftDispatchTrigger:
        options?.delayedDraftDispatchTrigger ?? (releaseAlreadyReached ? 'release' : undefined),
      delayedAuthoritativeDispatchTrigger:
        options?.delayedAuthoritativeDispatchTrigger ??
        (isExplicit ? 'explicit' : releaseAlreadyReached ? 'release' : undefined),
      draftPolicyOverride: options?.draftPolicyOverride,
      authoritativePolicyOverride: options?.authoritativePolicyOverride,
      geometryTargetOverride: options?.geometryTargetOverride,
    })
  },
  settleGraphViewportComparison: (graphDocumentId) => {
    if (graphDocumentId.length === 0) {
      return
    }
    const ownedInteraction = get().browserInteractionGraphDocumentIds[graphDocumentId] === true
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
    if (!ownedInteraction) {
      return
    }
    if (Object.keys(get().browserInteractionGraphDocumentIds).length > 0) {
      return
    }
    get().endInteraction()
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
    const shouldStageAuthoritativePreview =
      result.authoritativeGeometryResult !== undefined &&
      get().browserInteractionGraphDocumentIds[result.graphDocumentId] === true &&
      selectEffectiveBrowserExecutionPolicy(get(), {
        kind: 'graph-document',
        graphDocumentId: result.graphDocumentId,
      }) === 'live'
    const acceptedSpaghettiResult = shouldStageAuthoritativePreview
      ? useSpaghettiStore.getState().stageAuthoritativePreviewGraphBuildResult({
          projectFileId: result.projectFileId,
          graphDocumentId: result.graphDocumentId,
          buildRequestId: result.buildRequestId,
          buildSeq: result.seq,
          bundle: result.bundle,
          draftGeometryResult: result.draftGeometryResult,
          authoritativeGeometryResult: result.authoritativeGeometryResult,
        })
      : useSpaghettiStore.getState().acceptGraphBuildResult({
          projectFileId: result.projectFileId,
          graphDocumentId: result.graphDocumentId,
          buildRequestId: result.buildRequestId,
          buildSeq: result.seq,
          bundle: result.bundle,
          draftGeometryResult: result.draftGeometryResult,
          authoritativeGeometryResult: result.authoritativeGeometryResult,
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
  addImportedReference: ({
    fileName,
    fileType,
    objectUrl,
    parentAssemblyId = null,
    parentComponentId = null,
  }) => {
    const referenceId = buildImportedReferenceId()
    set((state) => {
      const existingImportedLabels = state.referenceWorkspace.importedReferenceOrder
        .map((currentReferenceId) => state.referenceWorkspace.importedReferencesById[currentReferenceId]?.label)
        .filter((label): label is string => label !== undefined)
      const label = buildImportedReferenceLabel(fileName, existingImportedLabels)
      const parentTarget =
        parentComponentId !== null
          ? ({ kind: 'component', componentId: parentComponentId } as const)
          : parentAssemblyId !== null
            ? ({ kind: 'assembly', assemblyId: parentAssemblyId } as const)
            : null
      const nextContentOrderByParentKey =
        parentTarget === null
          ? state.referenceWorkspace.contentOrderByParentKey
          : {
              ...state.referenceWorkspace.contentOrderByParentKey,
              [buildContentParentOrderKey(parentTarget)]: [
                ...resolveEffectiveContentOrderForParent(state, parentTarget),
                buildImportedReferenceRowId(referenceId),
              ],
            }
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
              sourceKind: 'imported',
              categoryId: USER_REFERENCE_CATEGORY_ID,
              label,
              fileType,
              assetPath: objectUrl,
              parentAssemblyId,
              parentComponentId,
            },
          },
          importedReferenceOrder: [...state.referenceWorkspace.importedReferenceOrder, referenceId],
          partRowsByReferenceId: {
            ...state.referenceWorkspace.partRowsByReferenceId,
            [referenceId]: [],
          },
          contentOrderByParentKey: nextContentOrderByParentKey,
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
      if (importedReference === undefined || importedReference.sourceKind !== 'imported') {
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
      const nextPartRowsByReferenceId = {
        ...state.referenceWorkspace.partRowsByReferenceId,
      }
      delete nextPartRowsByReferenceId[referenceId]
      const nextContentOrderByParentKey = removeRowIdFromAllContentOrders(
        state.referenceWorkspace.contentOrderByParentKey,
        buildImportedReferenceRowId(referenceId),
      )
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
          partRowsByReferenceId: nextPartRowsByReferenceId,
          contentOrderByParentKey: nextContentOrderByParentKey,
          ...clearActiveReferenceTransformIfMatches(state.referenceWorkspace, [referenceId]),
        },
      }
    })
  },
  createProjectAssembly: () => {
    const projectFileId = get().currentProject.projectFileId
    const assemblyId = buildAuthoredAssemblyId(projectFileId)
    set((state) => {
      const label = buildNextOrdinalLabel(
        Object.values(state.projectContent.assembliesById).map((assembly) => assembly.label),
        'Assembly',
      )
      const nextAssembliesById = {
        ...state.projectContent.assembliesById,
        [assemblyId]: {
          assemblyId,
          label,
          parentAssemblyId: null,
          assemblySourceKind: 'authored' as const,
          childRowIds: [],
        },
      }
      return {
        projectContent: {
          ...state.projectContent,
          assembliesById: nextAssembliesById,
        },
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: { kind: 'assembly', assemblyId },
          explicitSelectedTargets: [{ kind: 'assembly', assemblyId }],
          selectionAnchorTarget: { kind: 'assembly', assemblyId },
          resolvedContentSelection: resolveOwnedContentSelection(
            {
              projectContent: {
                ...state.projectContent,
                assembliesById: nextAssembliesById,
              },
              referenceWorkspace: state.referenceWorkspace,
            },
            { kind: 'assembly', assemblyId },
          ),
        },
        activeSurface: 'viewer',
      }
    })
    return assemblyId
  },
  createProjectComponent: (parentAssemblyId) => {
    const state = get()
    if (state.projectContent.assembliesById[parentAssemblyId] === undefined) {
      return null
    }
    const componentId = buildAuthoredComponentId(state.currentProject.projectFileId)
    set((current) => {
      const label = buildNextOrdinalLabel(
        Object.values(current.projectContent.componentsById)
          .filter((component) => component.parentAssemblyId === parentAssemblyId)
          .map((component) => component.label),
        'Component',
      )
      return {
        projectContent: {
          ...current.projectContent,
          assembliesById: {
            ...current.projectContent.assembliesById,
            [parentAssemblyId]: {
              ...current.projectContent.assembliesById[parentAssemblyId],
              childRowIds: [
                ...current.projectContent.assembliesById[parentAssemblyId]!.childRowIds,
                componentId,
              ],
            },
          },
          componentsById: {
            ...current.projectContent.componentsById,
            [componentId]: {
              componentId,
              parentAssemblyId,
              parentComponentId: null,
              ownerGraphDocumentId: null,
              sourceGraphDocumentId: null,
              sourceOutputEntryId: null,
              sourceNodeId: null,
              label,
              componentSourceKind: 'authored',
              resolutionState: 'resolved',
              receiveId: null,
              childObjectIds: [],
            },
          },
        },
        workspaceSelection: {
          ...current.workspaceSelection,
          selectedTarget: { kind: 'component', componentId },
          explicitSelectedTargets: [{ kind: 'component', componentId }],
          selectionAnchorTarget: { kind: 'component', componentId },
          resolvedContentSelection: null,
        },
        activeSurface: 'viewer',
      }
    })
    return componentId
  },
  moveProjectContentOwner: (draggedTarget, dropTarget) => {
    const resolution = resolveProjectContentOwnerDrop(get(), draggedTarget, dropTarget)
    if (!resolution.valid) {
      return false
    }

    let moved = false
    set((state) => {
      const draggedRecord = resolveProjectContentOwnerRecord(state, draggedTarget)
      if (draggedRecord === null) {
        return state
      }

      const draggedWorkspaceTarget =
        resolveWorkspaceSelectedTargetFromProjectContentOwnerTarget(draggedTarget)
      const draggedRowId = buildProjectContentOwnerRowId(draggedTarget)
      const dropRowId = buildProjectContentOwnerRowId(dropTarget)
      const nextWorkspaceSelection = {
        ...state.workspaceSelection,
        selectedTarget: draggedWorkspaceTarget,
        explicitSelectedTargets: [draggedWorkspaceTarget],
        selectionAnchorTarget: draggedWorkspaceTarget,
        resolvedContentSelection: null,
      }

      if (resolution.kind === 'reorder') {
        moved = true
        const reorderPosition = dropTarget.position === 'before' ? 'before' : 'after'
        const nextReferenceWorkspace =
          resolution.parentTarget === null
            ? state.referenceWorkspace
            : {
                ...state.referenceWorkspace,
                contentOrderByParentKey: {
                  ...state.referenceWorkspace.contentOrderByParentKey,
                  [buildContentParentOrderKey(resolution.parentTarget)]: moveOrderedIdAroundSibling(
                    resolveEffectiveContentOrderForParent(state, resolution.parentTarget),
                    draggedRowId,
                    dropRowId,
                    reorderPosition,
                  ),
                },
              }
        if (resolution.parentTarget === null) {
          return {
            projectContent: {
              ...state.projectContent,
              assembliesById: rebuildAssembliesByTopLevelOrder(
                state.projectContent.assembliesById,
                moveOrderedIdAroundSibling(
                  selectTopLevelAssemblyIds(state),
                  draggedRecord.ownerId,
                  dropRowId,
                  reorderPosition,
                ),
              ),
            },
            referenceWorkspace: nextReferenceWorkspace,
            workspaceSelection: nextWorkspaceSelection,
          }
        }
        if (draggedRecord.kind === 'imported-reference') {
          return {
            referenceWorkspace: nextReferenceWorkspace,
            workspaceSelection: nextWorkspaceSelection,
          }
        }
        if (resolution.parentTarget.kind === 'assembly') {
          if (resolution.parentTarget.assemblyId === REFERENCE_ROOT_ROW_ID) {
            return {
              referenceWorkspace: nextReferenceWorkspace,
              workspaceSelection: nextWorkspaceSelection,
            }
          }
          const parentAssembly = state.projectContent.assembliesById[resolution.parentTarget.assemblyId]
          if (parentAssembly === undefined) {
            moved = false
            return state
          }
          return {
            projectContent: {
              ...state.projectContent,
              assembliesById: {
                ...state.projectContent.assembliesById,
                [parentAssembly.assemblyId]: {
                  ...parentAssembly,
                  childRowIds: moveOrderedIdAroundSibling(
                    parentAssembly.childRowIds,
                    draggedRecord.ownerId,
                    dropRowId,
                    reorderPosition,
                  ),
                },
              },
            },
            referenceWorkspace: nextReferenceWorkspace,
            workspaceSelection: nextWorkspaceSelection,
          }
        }
        const parentComponent = state.projectContent.componentsById[resolution.parentTarget.componentId]
        if (parentComponent === undefined) {
          if (resolveReferenceCategoryIdFromComponentId(resolution.parentTarget.componentId) !== null) {
            return {
              referenceWorkspace: nextReferenceWorkspace,
              workspaceSelection: nextWorkspaceSelection,
            }
          }
          moved = false
          return state
        }
        return {
          projectContent: {
            ...state.projectContent,
            componentsById: {
              ...state.projectContent.componentsById,
              [parentComponent.componentId]: {
                ...parentComponent,
                childObjectIds: moveOrderedIdAroundSibling(
                  parentComponent.childObjectIds,
                  draggedRecord.ownerId,
                  dropRowId,
                  reorderPosition,
                ),
              },
            },
          },
          referenceWorkspace: nextReferenceWorkspace,
          workspaceSelection: nextWorkspaceSelection,
        }
      }

      let nextProjectContent =
        draggedRecord.kind === 'imported-reference'
          ? state.projectContent
          : removeProjectContentOwnerFromParent(state.projectContent, draggedRecord)
      if (draggedRecord.parentTarget === null && draggedRecord.kind === 'assembly') {
        nextProjectContent = {
          ...nextProjectContent,
          assembliesById: rebuildAssembliesByTopLevelOrder(
            nextProjectContent.assembliesById,
            selectTopLevelAssemblyIds(state).filter((assemblyId) => assemblyId !== draggedRecord.ownerId),
          ),
        }
      }

      const nextDraggedParentTarget = draggedRecord.parentTarget
      let nextReferenceWorkspace = {
        ...state.referenceWorkspace,
        contentOrderByParentKey:
          nextDraggedParentTarget === null
            ? state.referenceWorkspace.contentOrderByParentKey
            : {
                ...state.referenceWorkspace.contentOrderByParentKey,
                [buildContentParentOrderKey(nextDraggedParentTarget)]: resolveEffectiveContentOrderForParent(
                  state,
                  nextDraggedParentTarget,
                ).filter((rowId) => rowId !== draggedRowId),
              },
      }

      if (resolution.parentTarget.kind === 'assembly') {
        if (resolution.parentTarget.assemblyId !== REFERENCE_ROOT_ROW_ID && draggedRecord.kind !== 'imported-reference') {
          const parentAssembly = nextProjectContent.assembliesById[resolution.parentTarget.assemblyId]
          if (parentAssembly === undefined) {
            return state
          }
          nextProjectContent = {
            ...nextProjectContent,
            assembliesById: {
              ...nextProjectContent.assembliesById,
              [parentAssembly.assemblyId]: {
                ...parentAssembly,
                childRowIds: [...parentAssembly.childRowIds, draggedRecord.ownerId],
              },
            },
          }
        }
      } else if (draggedRecord.kind !== 'imported-reference') {
        const parentComponent = nextProjectContent.componentsById[resolution.parentTarget.componentId]
        if (parentComponent === undefined) {
          if (resolveReferenceCategoryIdFromComponentId(resolution.parentTarget.componentId) === null) {
            return state
          }
        } else {
          nextProjectContent = {
            ...nextProjectContent,
            componentsById: {
              ...nextProjectContent.componentsById,
              [parentComponent.componentId]: {
                ...parentComponent,
                childObjectIds: [...parentComponent.childObjectIds, draggedRecord.ownerId],
              },
            },
          }
        }
      }

      if (draggedRecord.kind === 'imported-reference') {
        const importedReference = nextReferenceWorkspace.importedReferencesById[draggedRecord.ownerId]
        if (importedReference === undefined) {
          return state
        }
        nextReferenceWorkspace = {
          ...nextReferenceWorkspace,
          importedReferencesById: {
            ...nextReferenceWorkspace.importedReferencesById,
            [draggedRecord.ownerId]: {
              ...importedReference,
              parentAssemblyId:
                resolution.parentTarget.kind === 'assembly'
                  ? resolution.parentTarget.assemblyId
                  : nextProjectContent.componentsById[resolution.parentTarget.componentId]
                        ?.parentAssemblyId ?? importedReference.parentAssemblyId,
              parentComponentId:
                resolution.parentTarget.kind === 'component'
                  ? resolution.parentTarget.componentId
                  : null,
            },
          },
        }
      }

      if (draggedRecord.kind === 'assembly') {
        const assembly = nextProjectContent.assembliesById[draggedRecord.ownerId]
        if (assembly === undefined) {
          return state
        }
        nextProjectContent = {
          ...nextProjectContent,
          assembliesById: {
            ...nextProjectContent.assembliesById,
            [assembly.assemblyId]: {
              ...assembly,
              parentAssemblyId:
                resolution.parentTarget.kind === 'assembly'
                  ? resolution.parentTarget.assemblyId
                  : assembly.parentAssemblyId ?? null,
            },
          },
        }
      } else if (draggedRecord.kind === 'component') {
        const component = nextProjectContent.componentsById[draggedRecord.ownerId]
        if (component === undefined) {
          if (resolveReferenceCategoryIdFromComponentId(draggedRecord.ownerId) !== null) {
            // Effective reference-category containers derive parentage from assembly child row order.
          } else {
            return state
          }
        } else {
          nextProjectContent = {
            ...nextProjectContent,
            componentsById: {
              ...nextProjectContent.componentsById,
              [component.componentId]: {
                ...component,
                parentAssemblyId:
                  resolution.parentTarget.kind === 'assembly'
                    ? resolution.parentTarget.assemblyId
                    : component.parentAssemblyId ?? null,
              },
            },
          }
        }
      } else if (draggedRecord.kind === 'object') {
        const objectRow = nextProjectContent.objectsById[draggedRecord.ownerId]
        if (objectRow === undefined) {
          return state
        }
        nextProjectContent = {
          ...nextProjectContent,
          objectsById: {
            ...nextProjectContent.objectsById,
            [objectRow.objectId]: {
              ...objectRow,
              parentAssemblyId:
                resolution.parentTarget.kind === 'assembly'
                  ? resolution.parentTarget.assemblyId
                  : nextProjectContent.componentsById[resolution.parentTarget.componentId]
                        ?.parentAssemblyId ?? objectRow.parentAssemblyId,
              parentComponentId:
                resolution.parentTarget.kind === 'component'
                  ? resolution.parentTarget.componentId
                  : null,
            },
          },
        }
      }

      const nextRuntimeContentPlacementByRowId = { ...state.runtimeContentPlacementByRowId }
      if (draggedRecord.kind === 'component') {
        const component = nextProjectContent.componentsById[draggedRecord.ownerId]
        if (component !== undefined && isRuntimeBackedComponentRecord(component)) {
          nextRuntimeContentPlacementByRowId[draggedRecord.ownerId] = {
            parentAssemblyId: component.parentAssemblyId ?? null,
            parentComponentId: null,
          }
        } else {
          delete nextRuntimeContentPlacementByRowId[draggedRecord.ownerId]
        }
      } else if (draggedRecord.kind === 'object') {
        const objectRow = nextProjectContent.objectsById[draggedRecord.ownerId]
        if (objectRow !== undefined && isRuntimeBackedObjectRecord(objectRow)) {
          nextRuntimeContentPlacementByRowId[draggedRecord.ownerId] = {
            parentAssemblyId: objectRow.parentAssemblyId ?? null,
            parentComponentId: objectRow.parentComponentId,
          }
        } else {
          delete nextRuntimeContentPlacementByRowId[draggedRecord.ownerId]
        }
      }

      nextReferenceWorkspace = {
        ...nextReferenceWorkspace,
        contentOrderByParentKey: {
          ...nextReferenceWorkspace.contentOrderByParentKey,
          [buildContentParentOrderKey(resolution.parentTarget)]: resolveEffectiveContentOrderForParent(
            {
              projectContent: nextProjectContent,
              referenceWorkspace: nextReferenceWorkspace,
            },
            resolution.parentTarget,
          ),
        },
      }

      moved = true
      return {
        projectContent: nextProjectContent,
        runtimeContentPlacementByRowId: nextRuntimeContentPlacementByRowId,
        referenceWorkspace: nextReferenceWorkspace,
        workspaceSelection: nextWorkspaceSelection,
      }
    })
    return moved
  },
  renameProjectContentOwner: (target, label) => {
    const nextLabel = normalizeProjectContentLabel(label)
    if (nextLabel.length === 0) {
      return false
    }
    let renamed = false
    set((state) => {
      if (target.kind === 'assembly') {
        const assembly = state.projectContent.assembliesById[target.assemblyId]
        if (assembly === undefined) {
          return state
        }
        renamed = true
        return {
          projectContent: {
            ...state.projectContent,
            assembliesById: {
              ...state.projectContent.assembliesById,
              [target.assemblyId]: {
                ...assembly,
                label: nextLabel,
              },
            },
          },
        }
      }
      const component = state.projectContent.componentsById[target.componentId]
      if (component === undefined || component.componentSourceKind !== 'authored') {
        return state
      }
      renamed = true
      return {
        projectContent: {
          ...state.projectContent,
          componentsById: {
            ...state.projectContent.componentsById,
            [target.componentId]: {
              ...component,
              label: nextLabel,
            },
          },
        },
      }
    })
    return renamed
  },
  deleteProjectContentOwner: (target) => {
    let deleted = false
    set((state) => {
      if (target.kind === 'assembly') {
        const assembly = state.projectContent.assembliesById[target.assemblyId]
        if (assembly === undefined || assembly.assemblySourceKind !== 'authored') {
          return state
        }
        deleted = true
        const nextAssembliesById = { ...state.projectContent.assembliesById }
        const nextComponentsById = { ...state.projectContent.componentsById }
        const nextObjectsById = { ...state.projectContent.objectsById }
        const deleteAssemblySubtree = (assemblyId: string) => {
          const currentAssembly = state.projectContent.assembliesById[assemblyId]
          if (currentAssembly === undefined) {
            return
          }
          delete nextAssembliesById[assemblyId]
          currentAssembly.childRowIds.forEach((childRowId) => {
            const childAssembly = state.projectContent.assembliesById[childRowId]
            if (childAssembly !== undefined) {
              deleteAssemblySubtree(childAssembly.assemblyId)
              return
            }
            const childComponent = state.projectContent.componentsById[childRowId]
            if (childComponent !== undefined) {
              delete nextComponentsById[childComponent.componentId]
              childComponent.childObjectIds.forEach((objectId) => {
                delete nextObjectsById[objectId]
              })
              return
            }
            delete nextObjectsById[childRowId]
          })
        }
        deleteAssemblySubtree(target.assemblyId)
        const nextSelectedTarget =
          state.workspaceSelection.selectedTarget === null
            ? null
            : state.workspaceSelection.selectedTarget.kind === 'assembly'
              ? nextAssembliesById[state.workspaceSelection.selectedTarget.assemblyId] === undefined
                ? null
                : state.workspaceSelection.selectedTarget
              : state.workspaceSelection.selectedTarget.kind === 'component'
                ? nextComponentsById[state.workspaceSelection.selectedTarget.componentId] === undefined
                  ? null
                  : state.workspaceSelection.selectedTarget
                : state.workspaceSelection.selectedTarget.kind === 'object'
                  ? nextObjectsById[state.workspaceSelection.selectedTarget.objectId] === undefined
                    ? null
                    : state.workspaceSelection.selectedTarget
                  : state.workspaceSelection.selectedTarget
        return {
          projectContent: {
            ...state.projectContent,
            assembliesById: nextAssembliesById,
            componentsById: nextComponentsById,
            objectsById: nextObjectsById,
          },
          workspaceSelection: {
            ...state.workspaceSelection,
            selectedTarget: nextSelectedTarget,
            explicitSelectedTargets: state.workspaceSelection.explicitSelectedTargets.filter(
              (selectedTarget) =>
                (selectedTarget.kind !== 'assembly' ||
                  nextAssembliesById[selectedTarget.assemblyId] !== undefined) &&
                (selectedTarget.kind !== 'component' ||
                  nextComponentsById[selectedTarget.componentId] !== undefined) &&
                (selectedTarget.kind !== 'object' ||
                  nextObjectsById[selectedTarget.objectId] !== undefined),
            ),
            selectionAnchorTarget:
              state.workspaceSelection.selectionAnchorTarget === null
                ? null
                : state.workspaceSelection.selectionAnchorTarget.kind === 'assembly'
                  ? nextAssembliesById[state.workspaceSelection.selectionAnchorTarget.assemblyId] ===
                    undefined
                    ? null
                    : state.workspaceSelection.selectionAnchorTarget
                  : state.workspaceSelection.selectionAnchorTarget.kind === 'component'
                    ? nextComponentsById[state.workspaceSelection.selectionAnchorTarget.componentId] ===
                      undefined
                      ? null
                      : state.workspaceSelection.selectionAnchorTarget
                    : state.workspaceSelection.selectionAnchorTarget.kind === 'object'
                      ? nextObjectsById[state.workspaceSelection.selectionAnchorTarget.objectId] ===
                        undefined
                        ? null
                        : state.workspaceSelection.selectionAnchorTarget
                      : state.workspaceSelection.selectionAnchorTarget,
            resolvedContentSelection:
              state.workspaceSelection.resolvedContentSelection?.rootRowId === target.assemblyId
                ? null
                : state.workspaceSelection.resolvedContentSelection,
          },
        }
      }
      const component = state.projectContent.componentsById[target.componentId]
      if (component === undefined || component.componentSourceKind !== 'authored') {
        return state
      }
      deleted = true
      const nextComponentsById = { ...state.projectContent.componentsById }
      const nextObjectsById = { ...state.projectContent.objectsById }
      delete nextComponentsById[target.componentId]
      component.childObjectIds.forEach((objectId) => {
        delete nextObjectsById[objectId]
      })
      const parentAssembly =
        component.parentAssemblyId == null
          ? null
          : state.projectContent.assembliesById[component.parentAssemblyId] ?? null
      const nextSelectedTarget =
        state.workspaceSelection.selectedTarget === null
          ? null
          : state.workspaceSelection.selectedTarget.kind === 'component'
            ? nextComponentsById[state.workspaceSelection.selectedTarget.componentId] === undefined
              ? null
              : state.workspaceSelection.selectedTarget
            : state.workspaceSelection.selectedTarget.kind === 'object'
              ? nextObjectsById[state.workspaceSelection.selectedTarget.objectId] === undefined
                ? null
                : state.workspaceSelection.selectedTarget
              : state.workspaceSelection.selectedTarget
      return {
        projectContent: {
          ...state.projectContent,
          assembliesById:
            parentAssembly === null
              ? state.projectContent.assembliesById
              : {
                  ...state.projectContent.assembliesById,
                  [parentAssembly.assemblyId]: {
                    ...parentAssembly,
                    childRowIds: parentAssembly.childRowIds.filter(
                      (childRowId: string) => childRowId !== target.componentId,
                    ),
                  },
                },
          componentsById: nextComponentsById,
          objectsById: nextObjectsById,
        },
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: nextSelectedTarget,
          explicitSelectedTargets: state.workspaceSelection.explicitSelectedTargets.filter(
            (selectedTarget) =>
              (selectedTarget.kind !== 'component' ||
                nextComponentsById[selectedTarget.componentId] !== undefined) &&
              (selectedTarget.kind !== 'object' ||
                nextObjectsById[selectedTarget.objectId] !== undefined),
          ),
          selectionAnchorTarget:
            state.workspaceSelection.selectionAnchorTarget === null
              ? null
              : state.workspaceSelection.selectionAnchorTarget.kind === 'component'
                ? nextComponentsById[state.workspaceSelection.selectionAnchorTarget.componentId] ===
                  undefined
                  ? null
                  : state.workspaceSelection.selectionAnchorTarget
                : state.workspaceSelection.selectionAnchorTarget.kind === 'object'
                  ? nextObjectsById[state.workspaceSelection.selectionAnchorTarget.objectId] === undefined
                    ? null
                    : state.workspaceSelection.selectionAnchorTarget
                  : state.workspaceSelection.selectionAnchorTarget,
          resolvedContentSelection:
            state.workspaceSelection.resolvedContentSelection?.rootRowId === target.componentId
              ? null
                : state.workspaceSelection.resolvedContentSelection,
        },
      }
    })
    return deleted
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
        partRowsByReferenceId:
          loadState === 'loaded'
            ? state.referenceWorkspace.partRowsByReferenceId
            : {
                ...state.referenceWorkspace.partRowsByReferenceId,
                [referenceId]: [],
              },
      },
    }))
  },
  setReferenceItemPartRows: (referenceId, partRows) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        partRowsByReferenceId: {
          ...state.referenceWorkspace.partRowsByReferenceId,
          [referenceId]: partRows.map((partRow) => ({
            rowId: `reference-part-row:${partRow.partKey}`,
            partKey: partRow.partKey,
            label: partRow.label,
          })),
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
          activeContentObjectTransformSession: null,
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
  beginContentObjectTransformShell: (objectId) => {
    set((state) => {
      const existingSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (existingSession?.objectId === objectId && existingSession.shellActive) {
        return state
      }
      const currentTransformOverride =
        state.referenceWorkspace.contentObjectTransformOverrideById[objectId] ?? null
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
      )
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(currentEntries)
      const draftTransform =
        cloneReferenceTransformOverride(currentTransformOverride) ??
        getReferenceTransformHistoryTransformAtScrubIndex(currentEntries, latestScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: currentEntries,
          },
          activeReferenceTransformSession: null,
          activeContentObjectTransformSession: {
            objectId,
            sessionId: newId('content-object-transform-session'),
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
  exitContentObjectTransformShell: () => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeContentObjectTransformSession: null,
      },
    }))
  },
  beginContentObjectTransformEntry: (mode) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
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
  commitActiveContentObjectTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      const activeObjectId = activeSession.objectId
      const committedTransformOverride =
        cloneReferenceTransformOverride(activeSession.draftTransform) ??
        buildDefaultReferenceTransformOverride()
      const kind = resolveReferenceTransformHistoryKind(activeSession.mode)
      const after = getReferenceTransformHistoryEntryAfterValue(committedTransformOverride, kind)
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[activeObjectId] ?? [],
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
          activeContentObjectTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: nextActiveScrubIndex,
            draftTransform:
              cloneReferenceTransformOverride(nextActiveDraftTransform) ??
              buildDefaultReferenceTransformOverride(),
            entryOrigin: null,
          },
          contentObjectTransformOverrideById: {
            ...state.referenceWorkspace.contentObjectTransformOverrideById,
            [activeObjectId]: nextTransformOverride,
          },
          transformHistoryByObjectId: historyChanged
            ? {
                ...state.referenceWorkspace.transformHistoryByObjectId,
                [activeObjectId]: nextEntries,
              }
            : state.referenceWorkspace.transformHistoryByObjectId,
        },
      }
    })
  },
  setActiveContentObjectTransformMode: (mode) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null || activeSession.mode === mode) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            mode,
          },
        },
      }
    })
  },
  setActiveContentObjectTransformSpace: (space) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null || activeSession.space === space) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            space,
          },
        },
      }
    })
  },
  setActiveContentObjectTransformHandle: (handle) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            activeHandle: handle === null ? null : { ...handle },
          },
        },
      }
    })
  },
  setActiveContentObjectTransformDraft: (transformOverride) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            draftTransform:
              cloneReferenceTransformOverride(transformOverride) ??
              buildDefaultReferenceTransformOverride(),
          },
        },
      }
    })
  },
  setContentObjectTransformOverride: (objectId, transformOverride) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        contentObjectTransformOverrideById: {
          ...state.referenceWorkspace.contentObjectTransformOverrideById,
          [objectId]: transformOverride,
        },
        activeContentObjectTransformSession:
          state.referenceWorkspace.activeContentObjectTransformSession?.objectId !== objectId
            ? state.referenceWorkspace.activeContentObjectTransformSession
            : {
                ...state.referenceWorkspace.activeContentObjectTransformSession,
                draftTransform:
                  cloneReferenceTransformOverride(transformOverride) ??
                  buildDefaultReferenceTransformOverride(),
              },
      },
    }))
  },
  setActiveContentObjectTransformHistoryScrubIndex: (scrubIndex) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[activeSession.objectId] ?? [],
      )
      const nextScrubIndex = resolveReferenceTransformHistoryScrubIndex(currentEntries, scrubIndex)
      const nextDraftTransform = getReferenceTransformHistoryTransformAtScrubIndex(
        currentEntries,
        nextScrubIndex,
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: nextScrubIndex,
            draftTransform:
              cloneReferenceTransformOverride(nextDraftTransform) ??
              buildDefaultReferenceTransformOverride(),
            entryOrigin:
              activeSession.entryOrigin === null
                ? null
                : cloneReferenceTransformOverride(nextDraftTransform),
          },
        },
      }
    })
  },
  resetContentObjectTransform: (objectId) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        contentObjectTransformOverrideById: {
          ...state.referenceWorkspace.contentObjectTransformOverrideById,
          [objectId]: null,
        },
        transformHistoryByObjectId: {
          ...state.referenceWorkspace.transformHistoryByObjectId,
          [objectId]: [],
        },
        activeContentObjectTransformSession:
          state.referenceWorkspace.activeContentObjectTransformSession?.objectId !== objectId
            ? state.referenceWorkspace.activeContentObjectTransformSession
            : {
                ...state.referenceWorkspace.activeContentObjectTransformSession,
                historyScrubIndex: 0,
                draftTransform: buildDefaultReferenceTransformOverride(),
                entryOrigin: null,
                entryActive: false,
                activeHandle: null,
              },
      },
    }))
  },
  setContentObjectTransformHistoryEntryDeltaValue: (objectId, entryId, axis, value) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
      )
      let changed = false
      const nextEntries = currentEntries.map((entry) => {
        if (entry.entryId !== entryId) {
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
      })
      if (!changed) {
        return state
      }
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      const nextScrubIndex =
        activeSession?.objectId !== objectId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          contentObjectTransformOverrideById: {
            ...state.referenceWorkspace.contentObjectTransformOverrideById,
            [objectId]: nextTransformOverride,
          },
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: nextEntries,
          },
          activeContentObjectTransformSession:
            activeSession?.objectId !== objectId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin:
                    activeSession.entryOrigin === null
                      ? null
                      : cloneReferenceTransformOverride(nextDraftTransform),
                },
        },
      }
    })
  },
  deleteContentObjectTransformHistoryEntry: (objectId, entryId) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
      )
      const nextEntries = currentEntries.filter((entry) => entry.entryId !== entryId)
      if (nextEntries.length === currentEntries.length) {
        return state
      }
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      const nextScrubIndex =
        activeSession?.objectId !== objectId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          contentObjectTransformOverrideById: {
            ...state.referenceWorkspace.contentObjectTransformOverrideById,
            [objectId]: nextTransformOverride,
          },
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: nextEntries,
          },
          activeContentObjectTransformSession:
            activeSession?.objectId !== objectId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin:
                    activeSession.entryOrigin === null
                      ? null
                      : cloneReferenceTransformOverride(nextDraftTransform),
                },
        },
      }
    })
  },
  toggleContentObjectTransformHistoryLock: (objectId, entryId) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
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
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      const nextScrubIndex =
        activeSession?.objectId !== objectId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          contentObjectTransformOverrideById: {
            ...state.referenceWorkspace.contentObjectTransformOverrideById,
            [objectId]: nextTransformOverride,
          },
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: nextEntries,
          },
          activeContentObjectTransformSession:
            activeSession?.objectId !== objectId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                },
        },
      }
    })
  },
  mergeContentObjectTransformHistory: (objectId) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
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
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: nextEntries,
          },
        },
      }
    })
  },
  cancelActiveContentObjectTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      const baseline =
        cloneReferenceTransformOverride(activeSession.entryOrigin) ??
        buildDefaultReferenceTransformOverride()
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
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
  beginViewerTransformShell: (target) => {
    const state = get()
    if (target.kind === 'reference') {
      state.beginReferenceTransformShell(target.referenceId)
      return
    }
    state.beginContentObjectTransformShell(target.objectId)
  },
  exitActiveViewerTransformShell: () => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.exitReferenceTransformShell()
      return
    }
    state.exitContentObjectTransformShell()
  },
  beginActiveViewerTransformEntry: (mode) => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.beginReferenceTransformEntry(mode)
      return
    }
    state.beginContentObjectTransformEntry(mode)
  },
  commitActiveViewerTransformEntry: () => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.commitActiveReferenceTransformEntry()
      return
    }
    state.commitActiveContentObjectTransformEntry()
  },
  setActiveViewerTransformMode: (mode) => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.setActiveReferenceTransformMode(mode)
      return
    }
    state.setActiveContentObjectTransformMode(mode)
  },
  setActiveViewerTransformSpace: (space) => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.setActiveReferenceTransformSpace(space)
      return
    }
    state.setActiveContentObjectTransformSpace(space)
  },
  setActiveViewerTransformHandle: (handle) => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.setActiveReferenceTransformHandle(handle)
      return
    }
    state.setActiveContentObjectTransformHandle(handle)
  },
  setActiveViewerTransformDraft: (transformOverride) => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.setActiveReferenceTransformDraft(transformOverride)
      return
    }
    state.setActiveContentObjectTransformDraft(transformOverride)
  },
  setActiveViewerTransformHistoryScrubIndex: (scrubIndex) => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.setActiveReferenceTransformHistoryScrubIndex(scrubIndex)
      return
    }
    state.setActiveContentObjectTransformHistoryScrubIndex(scrubIndex)
  },
  cancelActiveViewerTransformEntry: () => {
    const state = get()
    const activeTarget = selectActiveViewerTransformTarget(state.referenceWorkspace)
    if (activeTarget === null) {
      return
    }
    if (activeTarget.kind === 'reference') {
      state.cancelActiveReferenceTransformEntry()
      return
    }
    state.cancelActiveContentObjectTransformEntry()
  },
  resetViewerTransform: (target) => {
    const state = get()
    if (target.kind === 'reference') {
      state.resetReferenceTransform(target.referenceId)
      return
    }
    state.resetContentObjectTransform(target.objectId)
  },
  setViewerTransformHistoryEntryDeltaValue: (target, entryId, axis, value) => {
    const state = get()
    if (target.kind === 'reference') {
      state.setReferenceTransformHistoryEntryDeltaValue(target.referenceId, entryId, axis, value)
      return
    }
    state.setContentObjectTransformHistoryEntryDeltaValue(target.objectId, entryId, axis, value)
  },
  deleteViewerTransformHistoryEntry: (target, entryId) => {
    const state = get()
    if (target.kind === 'reference') {
      state.deleteReferenceTransformHistoryEntry(target.referenceId, entryId)
      return
    }
    state.deleteContentObjectTransformHistoryEntry(target.objectId, entryId)
  },
  toggleViewerTransformHistoryLock: (target, entryId) => {
    const state = get()
    if (target.kind === 'reference') {
      state.toggleReferenceTransformHistoryLock(target.referenceId, entryId)
      return
    }
    state.toggleContentObjectTransformHistoryLock(target.objectId, entryId)
  },
  mergeViewerTransformHistory: (target) => {
    const state = get()
    if (target.kind === 'reference') {
      state.mergeReferenceTransformHistory(target.referenceId)
      return
    }
    state.mergeContentObjectTransformHistory(target.objectId)
  },
  setViewerTransformSnapEnabled: (target, mode, enabled) => {
    const state = get()
    if (target.kind === 'reference') {
      state.setReferenceTransformSnapEnabled(target.referenceId, mode, enabled)
      return
    }
    state.setContentObjectTransformSnapEnabled(target.objectId, mode, enabled)
  },
  setViewerTransformSnapValue: (target, mode, value) => {
    const state = get()
    if (target.kind === 'reference') {
      state.setReferenceTransformSnapValue(target.referenceId, mode, value)
      return
    }
    state.setContentObjectTransformSnapValue(target.objectId, mode, value)
  },
  setViewerTransformSnapAxisValue: (target, mode, axis, value) => {
    const state = get()
    if (target.kind === 'reference') {
      state.setReferenceTransformSnapAxisValue(target.referenceId, mode, axis, value)
      return
    }
    state.setContentObjectTransformSnapAxisValue(target.objectId, mode, axis, value)
  },
  setViewerTransformSnapLocked: (target, mode, locked) => {
    const state = get()
    if (target.kind === 'reference') {
      state.setReferenceTransformSnapLocked(target.referenceId, mode, locked)
      return
    }
    state.setContentObjectTransformSnapLocked(target.objectId, mode, locked)
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
  setContentObjectTransformSnapEnabled: (objectId, mode, enabled) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getContentObjectTransformSnapState(state.referenceWorkspace, objectId),
      )
      currentSnapState[mode].enabled = enabled
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByObjectId: {
            ...state.referenceWorkspace.transformSnapByObjectId,
            [objectId]: currentSnapState,
          },
        },
      }
    })
  },
  setContentObjectTransformSnapValue: (objectId, mode, value) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getContentObjectTransformSnapState(state.referenceWorkspace, objectId),
      )
      currentSnapState[mode].values =
        currentSnapState[mode].xyzLocked === true
          ? setAllReferenceTransformSnapAxes(value)
          : {
              ...currentSnapState[mode].values,
              x: value,
            }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByObjectId: {
            ...state.referenceWorkspace.transformSnapByObjectId,
            [objectId]: currentSnapState,
          },
        },
      }
    })
  },
  setContentObjectTransformSnapAxisValue: (objectId, mode, axis, value) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getContentObjectTransformSnapState(state.referenceWorkspace, objectId),
      )
      currentSnapState[mode].values[axis] = value
      if (currentSnapState[mode].xyzLocked) {
        currentSnapState[mode].values = setAllReferenceTransformSnapAxes(value)
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByObjectId: {
            ...state.referenceWorkspace.transformSnapByObjectId,
            [objectId]: currentSnapState,
          },
        },
      }
    })
  },
  setContentObjectTransformSnapLocked: (objectId, mode, locked) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getContentObjectTransformSnapState(state.referenceWorkspace, objectId),
      )
      currentSnapState[mode].xyzLocked = locked
      if (locked) {
        currentSnapState[mode].values = setAllReferenceTransformSnapAxes(
          getReferenceTransformSnapDriverValue(currentSnapState[mode]),
        )
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByObjectId: {
            ...state.referenceWorkspace.transformSnapByObjectId,
            [objectId]: currentSnapState,
          },
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
  requestConsoleContextSync: (reason, source = 'legacy') => {
    set((state) => ({
      consoleContextSyncRequest: {
        reason,
        source,
        seq: (state.consoleContextSyncRequest?.seq ?? 0) + 1,
      },
    }))
  },
  requestConsoleWorkspaceContextHandoff: (handoff) => {
    set((state) => ({
      consoleWorkspaceContextHandoff: {
        ...handoff,
        seq: (state.consoleWorkspaceContextHandoff?.seq ?? 0) + 1,
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
    if (get().selectedPartKey === partKeyStr) {
      return
    }
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

export const selectViewportPresentationSettings = (
  state: Pick<AppState, 'viewportPresentationSettings'>,
): ViewportPresentationSettings => state.viewportPresentationSettings

export const selectViewportPresentationStyleSettings = (
  state: Pick<AppState, 'viewportPresentationSettings'>,
  stateId: ViewportPresentationStateId,
): ViewportPresentationStyleSettings => state.viewportPresentationSettings[stateId]

export const selectWorkspaceSelection = (
  state: Pick<AppState, 'workspaceSelection'>,
): WorkspaceSelectionState => state.workspaceSelection

export const selectWorkspaceSelectedTarget = (
  state: Pick<AppState, 'workspaceSelection'>,
): WorkspaceSelectedTarget | null => state.workspaceSelection.selectedTarget

export const selectWorkspaceSelectedContentOwnerTarget = (
  state: Pick<AppState, 'workspaceSelection' | 'projectContent' | 'referenceWorkspace'>,
): WorkspaceSelectedContentOwnerTarget | null =>
  resolveWorkspaceSelectedContentOwnerTarget(state, state.workspaceSelection.selectedTarget)

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

export const selectCurrentProjectTopLevelAssemblies = (
  state: Pick<AppState, 'projectContent'> & {
    referenceWorkspace?: Pick<ReferenceWorkspaceState, 'importedReferencesById' | 'importedReferenceOrder'>
  },
): ProjectAssemblyRecord[] =>
  [
    ...(state.referenceWorkspace === undefined
      ? []
      : [buildReferenceRootAssemblyRecord({
          projectContent: state.projectContent,
          referenceWorkspace: state.referenceWorkspace,
        })].filter((assembly) => assembly.parentAssemblyId == null)),
    ...Object.values(state.projectContent.assembliesById).filter(
      (assembly) => assembly.parentAssemblyId == null,
    ),
  ]

const selectProjectObjectsForComponent = (
  state: Pick<AppState, 'projectContent'>,
  component: ProjectComponentRecord,
): ProjectObjectRecord[] => {
  const ownedObjects = component.childObjectIds
    .map((objectId) => state.projectContent.objectsById[objectId] ?? null)
    .filter((objectRow): objectRow is ProjectObjectRecord => objectRow !== null)
  const directOwnedObjects = Object.values(state.projectContent.objectsById).filter(
    (objectRow) =>
      objectRow.parentComponentId === component.componentId &&
      !component.childObjectIds.includes(objectRow.objectId),
  )
  const orderedObjectIds = [
    ...ownedObjects.map((objectRow) => objectRow.objectId),
    ...directOwnedObjects
      .map((objectRow) => objectRow.objectId)
      .filter((objectId) => !component.childObjectIds.includes(objectId)),
  ]
  return orderedObjectIds
    .map((objectId) => state.projectContent.objectsById[objectId] ?? null)
    .filter((objectRow): objectRow is ProjectObjectRecord => objectRow !== null)
}

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

export const selectRenderedProjectPartSet = (
  state: Pick<AppState, 'currentProject' | 'projectContent'> & {
    graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
    graphDocumentsById: Record<string, GraphDocument>
    browserGraphBuildPolicyByGraphDocumentId?: Record<string, BrowserBuildPolicy>
    browserContentBuildPolicyByRowId?: Record<string, BrowserBuildPolicy>
    partsVisibility?: PartsVisibility
    graphDocumentIds?: readonly string[]
  },
): RenderedProjectPartSetVm => {
  const candidateGraphDocumentIds = [
    ...new Set(
      (state.graphDocumentIds ?? state.currentProject.graphDocuments.map((document) => document.graphDocumentId))
        .filter((graphDocumentId) => state.graphDocumentsById[graphDocumentId] !== undefined),
    ),
  ]

  const sharedRenderVm = selectSharedPreviewRenderVm(
    candidateGraphDocumentIds.map((graphDocumentId) => ({
      graphDocumentId,
      previewPreparation: state.graphRuntimeByDocumentId[graphDocumentId]?.previewPreparation ?? null,
      buildBundle: selectShouldSuppressBrowserGraphRuntimeOutput(
        {
          currentProject: state.currentProject,
          projectContent: state.projectContent,
          browserGraphBuildPolicyByGraphDocumentId:
            state.browserGraphBuildPolicyByGraphDocumentId ?? {},
          browserContentBuildPolicyByRowId: state.browserContentBuildPolicyByRowId ?? {},
        },
        graphDocumentId,
      )
        ? null
        : state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedBuildBundle ?? null,
      buildOutputs:
        selectShouldSuppressBrowserGraphRuntimeOutput(
          {
            currentProject: state.currentProject,
            projectContent: state.projectContent,
            browserGraphBuildPolicyByGraphDocumentId:
              state.browserGraphBuildPolicyByGraphDocumentId ?? {},
            browserContentBuildPolicyByRowId: state.browserContentBuildPolicyByRowId ?? {},
          },
          graphDocumentId,
        )
          ? []
          : state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedBuildOutputs ?? [],
    })),
  )
  const bundleViewerPartByKey = new Map<string, ViewerRenderablePart>()
  candidateGraphDocumentIds.forEach((graphDocumentId) => {
    if (
      selectShouldSuppressBrowserGraphRuntimeOutput(
        {
          currentProject: state.currentProject,
          projectContent: state.projectContent,
          browserGraphBuildPolicyByGraphDocumentId:
            state.browserGraphBuildPolicyByGraphDocumentId ?? {},
          browserContentBuildPolicyByRowId: state.browserContentBuildPolicyByRowId ?? {},
        },
        graphDocumentId,
      )
    ) {
      return
    }
    buildViewerPartByQualifiedOutputEntryKey({
      graphDocumentId,
      runtime: state.graphRuntimeByDocumentId[graphDocumentId],
    }).forEach((viewerPart, viewerKey) => {
      if (!bundleViewerPartByKey.has(viewerKey)) {
        bundleViewerPartByKey.set(viewerKey, viewerPart)
      }
    })
  })
  const viewerPartByKey = new Map(
    sharedRenderVm.viewerParts.map((viewerPart) => [viewerPart.viewerKey, viewerPart] as const),
  )
  const partsVisibility = state.partsVisibility ?? {}
  const renderedParts = Object.values(state.projectContent.objectsById).flatMap((objectRow) => {
    if (
      objectRow.resolutionState !== 'resolved' ||
      objectRow.sourceOutputEntryId === null ||
      !candidateGraphDocumentIds.includes(objectRow.ownerGraphDocumentId)
    ) {
      return []
    }
    const viewerKey = buildGraphViewerPartKey(
      objectRow.ownerGraphDocumentId,
      objectRow.sourceOutputEntryId,
    )
    if (viewerKey === null) {
      return []
    }
    const viewerPart = bundleViewerPartByKey.get(viewerKey) ?? viewerPartByKey.get(viewerKey)
    if (viewerPart === undefined) {
      return []
    }
    return [
      {
        objectId: objectRow.objectId,
        parentAssemblyId: objectRow.parentAssemblyId ?? null,
        parentComponentId: objectRow.parentComponentId,
        ownerGraphDocumentId: objectRow.ownerGraphDocumentId,
        sourceGraphDocumentId: objectRow.sourceGraphDocumentId,
        sourceOutputEntryId: objectRow.sourceOutputEntryId,
        sourceNodeId: objectRow.sourceNodeId,
        slotId: objectRow.slotId,
        label: objectRow.label,
        viewerKey,
        viewerPart,
        isVisible: partsVisibility[viewerKey] ?? true,
      } satisfies RenderedProjectPartVm,
    ]
  })

  return {
    parts: renderedParts,
    viewerParts: [...new Map(renderedParts.map((part) => [part.viewerKey, part.viewerPart])).values()],
    contributingGraphDocumentIds: [...new Set(renderedParts.map((part) => part.ownerGraphDocumentId))],
  }
}

export const selectCurrentProjectContentBrowserRows = (
  state: Pick<AppState, 'currentProject' | 'projectContent' | 'sketchVisibilityByRowId'> & {
    referenceWorkspace?: Pick<
      ReferenceWorkspaceState,
      | 'importedReferencesById'
      | 'importedReferenceOrder'
      | 'visibilityById'
      | 'loadStateById'
      | 'errorById'
      | 'partRowsByReferenceId'
      | 'transformOverrideById'
    >
    partsVisibility?: PartsVisibility
    graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
    graphDocumentsById: Record<string, GraphDocument>
  },
): ProjectContentBrowserRowVm[] => {
  const partsVisibility = state.partsVisibility ?? {}
  const renderedProjectPartSet = selectRenderedProjectPartSet({
    currentProject: state.currentProject,
    projectContent: state.projectContent,
    graphRuntimeByDocumentId: state.graphRuntimeByDocumentId,
    graphDocumentsById: state.graphDocumentsById,
    partsVisibility,
  })
  const renderedPartsByObjectId = new Map<string, RenderedProjectPartVm[]>()
  renderedProjectPartSet.parts.forEach((part) => {
    const currentParts = renderedPartsByObjectId.get(part.objectId) ?? []
    currentParts.push(part)
    renderedPartsByObjectId.set(part.objectId, currentParts)
  })
  const visibleRenderedProjectPartKeySet = new Set(
    renderedProjectPartSet.parts
      .filter((part) => part.isVisible)
      .map((part) => part.viewerKey),
  )
  const includeReferenceHierarchy = state.referenceWorkspace !== undefined
  const referenceWorkspace = state.referenceWorkspace ?? {
    importedReferencesById: {},
    importedReferenceOrder: [],
    visibilityById: {},
    loadStateById: {},
    errorById: {},
    partRowsByReferenceId: {},
    transformOverrideById: {},
  }
  const resolveRenderedVisibility = (partKeys: readonly string[]): boolean =>
    partKeys.length > 0 && partKeys.some((partKey) => visibleRenderedProjectPartKeySet.has(partKey))
  const getRenderedPartsForObject = (objectId: string): RenderedProjectPartVm[] =>
    renderedPartsByObjectId.get(objectId) ?? []
  const topLevelAssemblies = selectCurrentProjectTopLevelAssemblies(state).filter(
    (assembly) => assembly.assemblyId !== REFERENCE_ROOT_ROW_ID,
  )
  const rows: ProjectContentBrowserRowVm[] = []
  const graphLabelByDocumentId = new Map(
    state.currentProject.graphDocuments.map((documentEntry) => [
      documentEntry.graphDocumentId,
      documentEntry.label,
    ] as const),
  )
  const allReferenceItems = includeReferenceHierarchy
    ? referenceWorkspace.importedReferenceOrder
        .map((referenceId) => referenceWorkspace.importedReferencesById[referenceId] ?? null)
        .filter((item): item is ImportedReferenceRecord => item !== null)
        .map((item) => buildReferenceWorkspaceBrowserItemVm(referenceWorkspace, item))
    : []
  const referenceCategories = includeReferenceHierarchy
    ? REFERENCE_MANIFEST_CATEGORIES.map((category) => ({
        categoryId: category.categoryId,
        label: category.label,
        emptyLabel: 'No loadable references yet.',
      }))
    : []
  const totalShelfReferenceCount = allReferenceItems.filter(
    (item) => item.parentAssemblyId == null && item.parentComponentId == null,
  ).length

  if (includeReferenceHierarchy) {
    const referenceRootAssembly = buildReferenceRootAssemblyRecord({
      projectContent: state.projectContent,
      referenceWorkspace,
    })
    rows.push({
      rowId: referenceRootAssembly.assemblyId,
      kind: 'assembly',
      label: referenceRootAssembly.label,
      meta: totalShelfReferenceCount === 1 ? '1 item' : `${totalShelfReferenceCount} items`,
      parentAssemblyId: referenceRootAssembly.parentAssemblyId ?? null,
      isVisible: allReferenceItems.some((item) => item.isVisible && item.loadState === 'loaded'),
      visibilityPartKeys: [],
      buildState: 'done',
      buildStateLabel: '',
      rebuildGraphDocumentIds: [],
      statusLabel: '',
      statusTone: 'quiet',
      referenceContainerKind: 'root',
      referenceCategoryId: null,
      referenceContainerItemCount: totalShelfReferenceCount,
      referenceContainerEmptyLabel: null,
    })

    referenceCategories.forEach((category) => {
      const categoryRecord = buildReferenceCategoryComponentRecord(
        {
          projectContent: state.projectContent,
          referenceWorkspace,
        },
        category.categoryId,
      )
      const shelfItems = allReferenceItems.filter(
        (item) =>
          item.categoryId === category.categoryId &&
          item.parentAssemblyId == null &&
          item.parentComponentId == null,
      )
      rows.push({
        rowId: categoryRecord.componentId,
        kind: 'component',
        label: categoryRecord.label,
        meta: shelfItems.length === 1 ? '1 item' : `${shelfItems.length} items`,
        parentAssemblyId: categoryRecord.parentAssemblyId ?? REFERENCE_ROOT_ROW_ID,
        isVisible: shelfItems.some((item) => item.isVisible && item.loadState === 'loaded'),
        visibilityPartKeys: [],
        buildState: 'done',
        buildStateLabel: '',
        rebuildGraphDocumentIds: [],
        statusLabel: '',
        statusTone: 'quiet',
        ownerGraphDocumentId: categoryRecord.ownerGraphDocumentId,
        sourceGraphDocumentId: categoryRecord.sourceGraphDocumentId,
        sourceOutputEntryId: categoryRecord.sourceOutputEntryId,
        componentSourceKind: categoryRecord.componentSourceKind,
        resolutionState: categoryRecord.resolutionState,
        receiveId: categoryRecord.receiveId,
        childObjectCount: categoryRecord.childObjectIds.length,
        slotId: null,
        sourceNodeId: categoryRecord.sourceNodeId,
        highlightViewerKey: null,
        authoringGraphDocumentId: null,
        authoringNodeId: null,
        referenceContainerKind: 'category',
        referenceCategoryId: category.categoryId,
        referenceContainerItemCount: shelfItems.length,
        referenceContainerEmptyLabel: category.emptyLabel,
      })
      shelfItems.forEach((item) => {
        rows.push({
          rowId: item.rowId,
          kind: 'object',
          label: item.label,
          meta: item.fileType.toUpperCase(),
          parentAssemblyId: REFERENCE_ROOT_ROW_ID,
          parentComponentId: buildReferenceCategoryRowId(category.categoryId),
          isVisible: item.isVisible,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: item.sourceKind === 'manifest' ? 'Library' : 'Imported',
          rebuildGraphDocumentIds: [],
          statusLabel: '',
          statusTone: 'quiet',
          ownerGraphDocumentId: null,
          objectSourceKind: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          slotId: null,
          sourceNodeId: null,
          resolutionState: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
          contentOriginKind: 'source-reference',
          referenceId: item.referenceId,
          referenceSourceKind: item.sourceKind,
          referenceCategoryId: item.categoryId,
          referenceLoadState: item.loadState,
          fileType: item.fileType,
          assetPath: item.assetPath,
          errorMessage: item.errorMessage,
          partRows: item.parts,
        })
      })
    })

    allReferenceItems
      .filter(
        (item) =>
          item.parentComponentId == null &&
          (item.parentAssemblyId === REFERENCE_ROOT_ROW_ID ||
            (item.parentAssemblyId == null &&
              !shouldRenderReferenceCategoryInBrowser(item.categoryId))),
      )
      .forEach((item) => {
        rows.push({
          rowId: item.rowId,
          kind: 'object',
          label: item.label,
          meta: item.fileType.toUpperCase(),
          parentAssemblyId: REFERENCE_ROOT_ROW_ID,
          parentComponentId: null,
          isVisible: item.isVisible,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel:
            item.parentAssemblyId != null || item.parentComponentId != null
              ? 'Imported'
              : item.sourceKind === 'manifest'
                ? 'Library'
                : 'Imported',
          rebuildGraphDocumentIds: [],
          statusLabel: '',
          statusTone: 'quiet',
          ownerGraphDocumentId: null,
          objectSourceKind: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          slotId: null,
          sourceNodeId: null,
          resolutionState: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
          contentOriginKind:
            item.parentAssemblyId != null || item.parentComponentId != null
              ? 'imported-reference'
              : 'source-reference',
          referenceId: item.referenceId,
          referenceSourceKind: item.sourceKind,
          referenceCategoryId: item.categoryId,
          referenceLoadState: item.loadState,
          fileType: item.fileType,
          assetPath: item.assetPath,
          errorMessage: item.errorMessage,
          partRows: item.parts,
        })
      })
  }
  const pushAssemblyBranchRows = (assembly: ProjectAssemblyRecord) => {
    const assemblyStartIndex = rows.length
    rows.push({
      rowId: assembly.assemblyId,
      kind: 'assembly',
      label: assembly.label,
      meta: '',
      parentAssemblyId: assembly.parentAssemblyId,
      isVisible: false,
      visibilityPartKeys: [],
      buildState: 'done',
      buildStateLabel: '',
      rebuildGraphDocumentIds: [],
      statusLabel: '',
      statusTone: 'quiet',
    })
    let assemblyHasUnresolvedContent = false
    const assemblyRebuildGraphDocumentIds = new Set<string>()

    const appendComponentBranchRows = (component: ProjectComponentRecord) => {
      const componentObjects = selectProjectObjectsForComponent(state, component)
      if (
        component.componentSourceKind === 'published-component' &&
        componentObjects.length === 0
      ) {
        return
      }
      const singleResolvedObject =
        componentObjects.length === 1 && componentObjects[0]?.resolutionState === 'resolved'
          ? componentObjects[0]
          : null
      const sourceOutputEntry =
        component.sourceGraphDocumentId === null || component.sourceOutputEntryId === null
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
        component.sourceGraphDocumentId === null
          ? 'Component'
          : graphLabelByDocumentId.get(component.sourceGraphDocumentId) ?? component.sourceGraphDocumentId
      const componentVisibilityPartKeys = componentObjects.flatMap((objectRow) =>
        getRenderedPartsForObject(objectRow.objectId).map((part) => part.viewerKey),
      )
      const componentHasUnresolvedObject = componentObjects.some(
        (objectRow) => objectRow.resolutionState !== 'resolved',
      )
      const componentHasUnresolvedContent =
        component.componentSourceKind === 'published-component'
          ? componentHasUnresolvedObject
          : component.componentSourceKind === 'authored'
            ? false
            : component.resolutionState !== 'resolved'
      if (component.componentSourceKind === 'published-component') {
        assemblyHasUnresolvedContent ||= componentHasUnresolvedObject
      } else if (component.componentSourceKind !== 'authored') {
        assemblyHasUnresolvedContent ||= component.resolutionState !== 'resolved'
      }
      const componentBuildState =
        component.ownerGraphDocumentId === null
          ? { buildState: 'done' as const, buildStateLabel: '' }
          : selectProjectContentBuildState({
              graphRuntimeByDocumentId: state.graphRuntimeByDocumentId,
              ownerGraphDocumentIds: [component.ownerGraphDocumentId],
              hasUnresolvedContent: componentHasUnresolvedContent,
              hasContent: true,
            })
      if (
        component.ownerGraphDocumentId !== null &&
        componentBuildState.buildState === 'rebuild'
      ) {
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
        parentAssemblyId: component.parentAssemblyId,
        parentComponentId: component.parentComponentId ?? null,
        isVisible: resolveRenderedVisibility(componentVisibilityPartKeys),
        visibilityPartKeys: componentVisibilityPartKeys,
        buildState: componentBuildState.buildState,
        buildStateLabel: componentBuildState.buildStateLabel,
        rebuildGraphDocumentIds:
          componentBuildState.buildState === 'rebuild' && component.ownerGraphDocumentId !== null
            ? [component.ownerGraphDocumentId]
            : [],
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
          component.componentSourceKind === 'published-component'
            ? (singleResolvedObject === null
                ? null
                : getRenderedPartsForObject(singleResolvedObject.objectId)[0]?.viewerKey ?? null)
            : componentObjects.flatMap((objectRow) =>
                getRenderedPartsForObject(objectRow.objectId).map((part) => part.viewerKey),
              )[0] ?? null,
        authoringGraphDocumentId: component.sourceGraphDocumentId,
        authoringNodeId:
          component.componentSourceKind === 'published-component'
            ? singleResolvedObject?.sourceNodeId ?? null
            : sourceNodeId,
      })

      getProjectComponentChildRowIds(component).forEach((childRowId) => {
        const childComponent = state.projectContent.componentsById[childRowId]
        if (childComponent !== undefined) {
          appendComponentBranchRows(childComponent)
          return
        }
        const objectRow = state.projectContent.objectsById[childRowId]
        if (objectRow === undefined) {
          return
        }
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
        const objectRenderedParts = getRenderedPartsForObject(objectRow.objectId)
        const objectVisibilityPartKeys = objectRenderedParts.map((part) => part.viewerKey)
        rows.push({
          rowId: objectRow.objectId,
          kind: 'object',
          label: objectRow.label,
          meta: '',
          parentAssemblyId: objectRow.parentAssemblyId,
          isVisible:
            objectRow.resolutionState === 'resolved' &&
            resolveRenderedVisibility(objectVisibilityPartKeys),
          visibilityPartKeys:
            objectRow.resolutionState === 'resolved' ? objectVisibilityPartKeys : [],
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
          highlightViewerKey: objectRenderedParts[0]?.viewerKey ?? null,
          authoringGraphDocumentId: objectRow.sourceGraphDocumentId,
          authoringNodeId: objectRow.sourceNodeId,
        })
      })
    }

    assembly.childRowIds.forEach((childRowId) => {
      const childAssembly = state.projectContent.assembliesById[childRowId]
      if (childAssembly !== undefined) {
        pushAssemblyBranchRows(childAssembly)
        return
      }
      const component = state.projectContent.componentsById[childRowId]
      if (component === undefined) {
        const objectRow = state.projectContent.objectsById[childRowId]
        if (objectRow === undefined) {
          return
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
        const objectRenderedParts = getRenderedPartsForObject(objectRow.objectId)
        const objectVisibilityPartKeys = objectRenderedParts.map((part) => part.viewerKey)
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
          parentAssemblyId: objectRow.parentAssemblyId,
          isVisible:
            objectRow.resolutionState === 'resolved' &&
            resolveRenderedVisibility(objectVisibilityPartKeys),
          visibilityPartKeys:
            objectRow.resolutionState === 'resolved' ? objectVisibilityPartKeys : [],
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
          highlightViewerKey: objectRenderedParts[0]?.viewerKey ?? null,
          authoringGraphDocumentId: objectRow.sourceGraphDocumentId,
          authoringNodeId: objectRow.sourceNodeId,
        })
        return
      }
      appendComponentBranchRows(component)
    })

    const assemblyRows = rows.slice(assemblyStartIndex + 1)
    const derivedAssemblyHasUnresolvedContent = assemblyRows.some(
      (row) =>
        (row.kind === 'object' || row.kind === 'component' || row.kind === 'assembly') &&
        row.statusTone === 'warning',
    )
    const assemblyVisibilityPartKeys = assemblyRows.flatMap((row) =>
      row.kind === 'object' || row.kind === 'component' ? (row.visibilityPartKeys ?? []) : [],
    )
    const assemblyOwnerGraphDocumentIds = [
      ...new Set(
        assemblyRows
          .map((row) =>
            row.kind === 'component'
              ? row.ownerGraphDocumentId
              : row.kind === 'object'
                ? row.ownerGraphDocumentId
                : null,
          )
          .filter((graphDocumentId): graphDocumentId is string => graphDocumentId !== null),
      ),
    ]
    const assemblyBuildState = selectProjectContentBuildState({
      graphRuntimeByDocumentId: state.graphRuntimeByDocumentId,
      ownerGraphDocumentIds: assemblyOwnerGraphDocumentIds,
      hasUnresolvedContent: derivedAssemblyHasUnresolvedContent || assemblyHasUnresolvedContent,
      hasContent: assembly.childRowIds.length > 0,
    })
    rows[assemblyStartIndex] = {
      ...(rows[assemblyStartIndex] as Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }>),
      isVisible: resolveRenderedVisibility(assemblyVisibilityPartKeys),
      visibilityPartKeys: [...new Set(assemblyVisibilityPartKeys)],
      buildState: assemblyBuildState.buildState,
      buildStateLabel: assemblyBuildState.buildStateLabel,
      rebuildGraphDocumentIds: [...assemblyRebuildGraphDocumentIds],
      statusLabel:
        assembly.childRowIds.length > 0
          ? derivedAssemblyHasUnresolvedContent || assemblyHasUnresolvedContent
            ? 'Unresolved'
            : 'Ready'
          : '',
      statusTone:
        assembly.childRowIds.length === 0
          ? 'quiet'
          : derivedAssemblyHasUnresolvedContent || assemblyHasUnresolvedContent
            ? 'warning'
            : 'ready',
    }
  }

  topLevelAssemblies.forEach((assembly) => {
    pushAssemblyBranchRows(assembly)
  })

  if (includeReferenceHierarchy) {
    allReferenceItems
      .filter((item) => item.parentAssemblyId != null || item.parentComponentId != null)
      .forEach((item) => {
        rows.push({
          rowId: item.rowId,
          kind: 'object',
          label: item.label,
          meta: item.fileType.toUpperCase(),
          parentAssemblyId: item.parentAssemblyId ?? null,
          parentComponentId: item.parentComponentId ?? null,
          isVisible: item.isVisible,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Imported',
          rebuildGraphDocumentIds: [],
          statusLabel: '',
          statusTone: 'quiet',
          ownerGraphDocumentId: null,
          objectSourceKind: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          slotId: null,
          sourceNodeId: null,
          resolutionState: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
          contentOriginKind: 'imported-reference',
          referenceId: item.referenceId,
          referenceSourceKind: item.sourceKind,
          referenceCategoryId: item.categoryId,
          referenceLoadState: item.loadState,
          fileType: item.fileType,
          assetPath: item.assetPath,
          errorMessage: item.errorMessage,
          partRows: item.parts,
        })
      })
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
  const allReferenceItems = state.referenceWorkspace.importedReferenceOrder
    .map((referenceId) => state.referenceWorkspace.importedReferencesById[referenceId] ?? null)
    .filter((item): item is ImportedReferenceRecord => item !== null)
    .map((item) => buildReferenceWorkspaceBrowserItemVm(state.referenceWorkspace, item))

  const buildCategoryVm = (
    categoryId: ReferenceCategoryId,
    label: string,
    emptyLabel: string,
  ): ReferenceWorkspaceBrowserCategoryVm => {
    const items = allReferenceItems.filter((item) => item.categoryId === categoryId)
    const shelfItems = items.filter(
      (item) => item.parentAssemblyId == null && item.parentComponentId == null,
    )

    return {
      rowId: `reference-category-row:${categoryId}`,
      categoryId,
      label,
      isExpanded: state.referenceWorkspace.categoryExpandedById[categoryId] ?? true,
      itemCount: shelfItems.length,
      visibleItemCount: shelfItems.filter((item) => item.isVisible).length,
      hasLoadingItem: shelfItems.some((item) => item.isVisible && item.loadState === 'loading'),
      hasErrorItem: shelfItems.some((item) => item.loadState === 'error'),
      emptyLabel,
      items,
    }
  }

  const manifestCategories = REFERENCE_MANIFEST_CATEGORIES.map((category) =>
    buildCategoryVm(category.categoryId, category.label, 'No loadable references yet.'),
  )

  const importedItems = allReferenceItems.filter((item) => item.categoryId === USER_REFERENCE_CATEGORY_ID)

  const categories = [
    ...manifestCategories,
    ...(importedItems.length > 0
      ? [buildCategoryVm(USER_REFERENCE_CATEGORY_ID, USER_REFERENCE_CATEGORY_LABEL, '')]
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
  state.referenceWorkspace.importedReferenceOrder
    .map((referenceId) => state.referenceWorkspace.importedReferencesById[referenceId] ?? null)
    .filter((item): item is ImportedReferenceRecord => item !== null)
    .map((item) => buildReferenceWorkspaceBrowserItemVm(state.referenceWorkspace, item))

const resolveConsoleSelectedTargetLabel = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  target: WorkspaceSelectedTarget,
): string | null => {
  switch (target.kind) {
    case 'assembly':
    case 'component':
    case 'object':
      return resolveWorkspaceSelectedContentOwnerTarget(state, target)?.ownerLabel ?? null
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

const resolveConsoleContentBreadcrumbLabels = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  target: WorkspaceSelectedTarget,
): string[] | null => {
  if (target.kind === 'assembly') {
    const assembly = resolveProjectAssemblyRecord(state, target.assemblyId)
    if (assembly === null) {
      return null
    }
    if (assembly.parentAssemblyId == null) {
      return [assembly.label]
    }
    return [
      ...(resolveConsoleContentBreadcrumbLabels(state, {
        kind: 'assembly',
        assemblyId: assembly.parentAssemblyId,
      }) ?? [assembly.parentAssemblyId]),
      assembly.label,
    ]
  }

  if (target.kind === 'component') {
    const component = resolveProjectComponentRecord(state, target.componentId)
    if (component === null) {
      return null
    }
    if (component.parentComponentId != null) {
      return [
        ...(resolveConsoleContentBreadcrumbLabels(state, {
          kind: 'component',
          componentId: component.parentComponentId,
        }) ?? [component.parentComponentId]),
        component.label,
      ]
    }
    const parentAssemblyId =
      component.parentAssemblyId ?? resolveParentAssemblyIdByChildRowId(state.projectContent, target.componentId)
    if (parentAssemblyId == null) {
      return [component.label]
    }
    return [
      ...(resolveConsoleContentBreadcrumbLabels(state, {
        kind: 'assembly',
        assemblyId: parentAssemblyId,
      }) ?? [parentAssemblyId]),
      component.label,
    ]
  }

  if (target.kind !== 'object') {
    return null
  }

  const objectRow = state.projectContent.objectsById[target.objectId]
  if (objectRow !== undefined) {
    if (objectRow.parentComponentId != null) {
      return [
        ...(resolveConsoleContentBreadcrumbLabels(state, {
          kind: 'component',
          componentId: objectRow.parentComponentId,
        }) ?? [objectRow.parentComponentId]),
        objectRow.label,
      ]
    }
    if (objectRow.parentAssemblyId != null) {
      return [
        ...(resolveConsoleContentBreadcrumbLabels(state, {
          kind: 'assembly',
          assemblyId: objectRow.parentAssemblyId,
        }) ?? [objectRow.parentAssemblyId]),
        objectRow.label,
      ]
    }
    return [objectRow.label]
  }

  const importedReference = resolveImportedReferenceRecordByObjectRowId(state, target.objectId)
  if (importedReference === null) {
    return null
  }
  if (importedReference.parentComponentId != null) {
    return [
      ...(resolveConsoleContentBreadcrumbLabels(state, {
        kind: 'component',
        componentId: importedReference.parentComponentId,
      }) ?? [importedReference.parentComponentId]),
      importedReference.label,
    ]
  }
  if (importedReference.parentAssemblyId != null) {
    return [
      ...(resolveConsoleContentBreadcrumbLabels(state, {
        kind: 'assembly',
        assemblyId: importedReference.parentAssemblyId,
      }) ?? [importedReference.parentAssemblyId]),
      importedReference.label,
    ]
  }
  return [importedReference.label]
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
    const selectedOwnerTarget = resolveWorkspaceSelectedContentOwnerTarget(state, {
      kind: 'assembly',
      assemblyId: REFERENCE_ROOT_ROW_ID,
    })
    if (selectedOwnerTarget === null) {
      return null
    }
    const referenceTree = selectReferenceWorkspaceBrowserTree(state)
    const referenceItems = referenceTree.categories.flatMap((category) => category.items)
    return {
      kind: 'assembly',
      assemblyId: REFERENCE_ROOT_ROW_ID,
      label: selectedOwnerTarget.ownerLabel,
      fallbackGraphDocumentId: null,
      canDelete: selectedOwnerTarget.supportsDelete,
      canLoadAll: referenceItems.some(
        (item) => !item.isVisible || item.loadState === 'error' || item.loadState === 'unloaded',
      ),
      categoryOptions: referenceTree.categories.map((category) => ({
        categoryId: category.categoryId,
        label: category.label,
      })),
    }
  }
  if (selectedTarget.kind === 'reference-category') {
    const category = selectReferenceWorkspaceBrowserTree(state).categories.find(
      (currentCategory) => currentCategory.categoryId === selectedTarget.categoryId,
    )
    if (category === undefined) {
      return null
    }
    const selectedOwnerTarget = resolveWorkspaceSelectedContentOwnerTarget(state, {
      kind: 'component',
      componentId: buildReferenceCategoryRowId(selectedTarget.categoryId),
    })
    if (selectedOwnerTarget === null) {
      return null
    }
    return {
      kind: 'component',
      componentId: buildReferenceCategoryRowId(category.categoryId),
      label: selectedOwnerTarget.ownerLabel,
      fallbackGraphDocumentId: selectedOwnerTarget.fallbackGraphDocumentId,
      canRename: selectedOwnerTarget.supportsRename,
      canDelete: selectedOwnerTarget.supportsDelete,
      canLoadAll: category.items.some(
        (item) => !item.isVisible || item.loadState === 'error' || item.loadState === 'unloaded',
      ),
      referenceCategoryId: category.categoryId,
    }
  }
  const selectedContentOwnerTarget = resolveWorkspaceSelectedContentOwnerTarget(state, selectedTarget)
  if (selectedContentOwnerTarget?.ownerKind === 'assembly') {
    const isReferenceRootAssembly = selectedContentOwnerTarget.ownerId === REFERENCE_ROOT_ROW_ID
    const referenceTree = isReferenceRootAssembly ? selectReferenceWorkspaceBrowserTree(state) : null
    const referenceItems = referenceTree?.categories.flatMap((category) => category.items) ?? []
    return {
      kind: 'assembly',
      assemblyId: selectedContentOwnerTarget.ownerId,
      label: selectedContentOwnerTarget.ownerLabel,
      contentBreadcrumbLabels:
        resolveConsoleContentBreadcrumbLabels(state, {
          kind: 'assembly',
          assemblyId: selectedContentOwnerTarget.ownerId,
        }) ?? [selectedContentOwnerTarget.ownerLabel],
      fallbackGraphDocumentId: null,
      canDelete: selectedContentOwnerTarget.supportsDelete,
      canLoadAll: isReferenceRootAssembly
        ? referenceItems.some(
            (item) => !item.isVisible || item.loadState === 'error' || item.loadState === 'unloaded',
          )
        : undefined,
      categoryOptions: isReferenceRootAssembly
        ? referenceTree?.categories.map((category) => ({
            categoryId: category.categoryId,
            label: category.label,
          }))
        : undefined,
    }
  }
  if (selectedContentOwnerTarget?.ownerKind === 'component') {
    const referenceCategoryId = [
      ...REFERENCE_MANIFEST_CATEGORIES.map((category) => category.categoryId),
      USER_REFERENCE_CATEGORY_ID,
    ].find((categoryId) => buildReferenceCategoryRowId(categoryId) === selectedContentOwnerTarget.ownerId)
    const referenceCategory =
      referenceCategoryId === undefined
        ? null
        : selectReferenceWorkspaceBrowserTree(state).categories.find(
            (category) => category.categoryId === referenceCategoryId,
          ) ?? null
    return {
      kind: 'component',
      componentId: selectedContentOwnerTarget.ownerId,
      label: selectedContentOwnerTarget.ownerLabel,
      contentBreadcrumbLabels:
        resolveConsoleContentBreadcrumbLabels(state, {
          kind: 'component',
          componentId: selectedContentOwnerTarget.ownerId,
        }) ?? [selectedContentOwnerTarget.ownerLabel],
      fallbackGraphDocumentId: selectedContentOwnerTarget.fallbackGraphDocumentId,
      canRename: selectedContentOwnerTarget.supportsRename,
      canDelete: selectedContentOwnerTarget.supportsDelete,
      canLoadAll:
        referenceCategory?.items.some(
          (item) => !item.isVisible || item.loadState === 'error' || item.loadState === 'unloaded',
        ) ?? undefined,
      referenceCategoryId,
    }
  }
  if (selectedContentOwnerTarget?.ownerKind === 'object-part') {
    const importedReference =
      selectedTarget?.kind === 'object'
        ? resolveImportedReferenceRecordByObjectRowId(state, selectedTarget.objectId)
        : selectedTarget?.kind === 'reference-item'
          ? state.referenceWorkspace.importedReferencesById[selectedTarget.referenceId] ?? null
          : null
    const referenceCategoryLabel =
      importedReference === null
        ? undefined
        : selectReferenceWorkspaceBrowserTree(state).categories.find(
            (category) => category.categoryId === importedReference.categoryId,
          )?.label ?? importedReference.categoryId
    const importedReferenceRuntimeTraits =
      importedReference === null ? null : resolveReferenceRuntimeTraits(state, importedReference.referenceId)
    return {
      kind: 'object',
      objectId: selectedContentOwnerTarget.ownerId,
      label: selectedContentOwnerTarget.ownerLabel,
      contentBreadcrumbLabels:
        resolveConsoleContentBreadcrumbLabels(state, {
          kind: 'object',
          objectId: selectedContentOwnerTarget.ownerId,
        }) ?? [selectedContentOwnerTarget.ownerLabel],
      fallbackGraphDocumentId: selectedContentOwnerTarget.fallbackGraphDocumentId,
      referenceId: importedReference?.referenceId,
      canLoadModel:
        importedReference === null
          ? undefined
          : !importedReferenceRuntimeTraits?.isVisible &&
            importedReferenceRuntimeTraits?.loadState !== 'error',
      referenceCategoryId: importedReference?.categoryId,
      referenceCategoryLabel,
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
    kind: 'object',
    objectId: buildImportedReferenceRowId(referenceItem.referenceId),
    label: referenceItem.label,
    contentBreadcrumbLabels:
      resolveConsoleContentBreadcrumbLabels(state, {
        kind: 'object',
        objectId: buildImportedReferenceRowId(referenceItem.referenceId),
      }) ?? [referenceItem.label],
    fallbackGraphDocumentId: null,
    referenceId: referenceItem.referenceId,
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
    const acceptedPublicationRecords = buildProjectAcceptedPublicationRecords(
      nextCurrentProject,
      spaghettiState,
      {
        currentProject: nextCurrentProject,
        projectContent: state.projectContent,
        browserGraphBuildPolicyByGraphDocumentId:
          state.browserGraphBuildPolicyByGraphDocumentId,
        browserContentBuildPolicyByRowId: state.browserContentBuildPolicyByRowId,
      },
    )
    const nextDerivation = buildProjectContentDerivation(
      nextCurrentProject,
      spaghettiState,
      acceptedPublicationRecords,
      {
        projectContent: state.projectContent,
        runtimeContentPlacementByRowId: state.runtimeContentPlacementByRowId,
      },
    )
    const nextProjectContent = nextDerivation.projectContent

    if (
      nextCurrentProject === state.currentProject &&
      areProjectContentStatesEqual(state.projectContent, nextProjectContent) &&
      areRuntimeContentPlacementOverlaysEqual(
        state.runtimeContentPlacementByRowId,
        nextDerivation.runtimeContentPlacementByRowId,
      )
    ) {
      return state
    }
    return {
      currentProject: nextCurrentProject,
      projectContent: nextProjectContent,
      runtimeContentPlacementByRowId: nextDerivation.runtimeContentPlacementByRowId,
    }
  })
}

const handleBrowserGraphRuntimeRevisionChange = (graphDocumentId: string): void => {
  const state = useAppStore.getState()
  const policy = selectEffectiveBrowserExecutionPolicy(state, {
    kind: 'graph-document',
    graphDocumentId,
  })

  if (isGraphVisibleInActiveAutoViewer(graphDocumentId)) {
    if (policy === 'live' || policy === 'release') {
      requestAutoViewportDraftBuildIfAllowed(graphDocumentId)
      return
    }

    useAppStore.setState((current) => ({
      pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
        current.pendingBrowserBuildGraphDocumentIds,
        graphDocumentId,
      ),
    }))
    return
  }

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

const shouldTriggerViewerModeBuildRequest = (
  previousState: Pick<WorkspaceStoreState, 'activeViewerViewportId' | 'viewportChromeById'>,
  nextState: Pick<WorkspaceStoreState, 'activeViewerViewportId' | 'viewportChromeById'>,
): boolean => {
  const previousActiveViewportId = previousState.activeViewerViewportId
  const nextActiveViewportId = nextState.activeViewerViewportId
  const previousMode = selectViewportResultModeById(previousState, previousActiveViewportId)
  const nextMode = selectViewportResultModeById(nextState, nextActiveViewportId)

  if (
    previousActiveViewportId === nextActiveViewportId &&
    previousMode === nextMode
  ) {
    return false
  }

  return nextMode === 'auto' || nextMode === 'final'
}

const requestViewerTargetBuildForViewportPreference = (): void => {
  const viewerTargetGraphDocumentId = useSpaghettiStore.getState().viewerTargetGraphDocumentId
  if (viewerTargetGraphDocumentId === null) {
    return
  }
  const modeBehavior = selectActiveViewerModeBehavior()
  const graphRuntime = selectGraphRuntimeByDocumentId(
    useSpaghettiStore.getState(),
    viewerTargetGraphDocumentId,
  )
  const currentGraphRevision = graphRuntime?.compileBuild.currentGraphRevision ?? null
  const latestAcceptedGraphRevision = graphRuntime?.compileBuild.latestAcceptedGraphRevision ?? null
  if (modeBehavior.mode === 'auto') {
    if (!doesRuntimeHaveCurrentAcceptedResult(graphRuntime)) {
      requestAutoViewportDraftBuildIfAllowed(viewerTargetGraphDocumentId)
    }
    maybeRequestAutoViewportAuthoritativeFollowThrough(viewerTargetGraphDocumentId)
    return
  }
  if (
    graphRuntime?.acceptedAuthoritativeGeometryResult !== null &&
    currentGraphRevision !== null &&
    latestAcceptedGraphRevision !== null &&
    currentGraphRevision <= latestAcceptedGraphRevision
  ) {
    return
  }
  useAppStore.getState().requestBrowserGraphDocumentBuild(viewerTargetGraphDocumentId)
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

  for (const graphDocumentId of changedGraphDocumentIds) {
    const nextCompileBuild = state.graphRuntimeByDocumentId[graphDocumentId]?.compileBuild ?? null
    const previousCompileBuild =
      previousState.graphRuntimeByDocumentId[graphDocumentId]?.compileBuild ?? null
    const acceptedRevisionChanged =
      nextCompileBuild?.latestAcceptedGraphRevision !== previousCompileBuild?.latestAcceptedGraphRevision
    const inFlightRequestChanged =
      nextCompileBuild?.inFlightBuildRequestId !== previousCompileBuild?.inFlightBuildRequestId
    if (!acceptedRevisionChanged && !inFlightRequestChanged) {
      continue
    }
    maybeRequestAutoViewportAuthoritativeFollowThrough(graphDocumentId)
  }
})

useWorkspaceStore.subscribe((state, previousState) => {
  if (
    !shouldTriggerViewerModeBuildRequest(previousState, state)
  ) {
    return
  }
  requestViewerTargetBuildForViewportPreference()
})
