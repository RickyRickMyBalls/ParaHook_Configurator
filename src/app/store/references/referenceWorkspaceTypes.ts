import type { ImportedReferenceStructureInspectionSummary } from '../../../viewer/referenceStructureInspection'
import type {
  ImportedReferenceFile,
  ImportedReferenceSourceAttribution,
} from '../../references/importReferenceFile'
import type {
  DirectPartBackedReferenceLoadKind,
  ReferenceCategoryId,
  ReferenceFileType,
  ReferenceSourceKind,
  ReferenceTransformOverride,
} from '../../references/referenceManifest'
import type {
  ReferenceTimelineChannelKey,
  ReferenceTimelineConfig,
  ReferenceTimelineMode,
  ReferenceTimelineRange,
} from '../../references/referenceTimeline'
import type {
  ActiveContentObjectTransformSession,
  ActiveEnvironmentLightTransformSession,
  ActiveReferenceTransformSession,
  ReferenceItemLoadState,
  ReferenceTransformHistoryEntry,
  ReferenceTransformSnapState,
} from '../useAppStore'

export type ImportedReferenceRecord = {
  referenceId: string
  sourceKind: ReferenceSourceKind
  categoryId: ReferenceCategoryId
  label: string
  fileType: ReferenceFileType
  assetPath: string
  catalogItemId?: string | null
  catalogFamilyKey?: string | null
  sourceAttribution?: ImportedReferenceSourceAttribution | null
  parentAssemblyId: string | null
  parentComponentId: string | null
  directPartSourceKind?: DirectPartBackedReferenceLoadKind | null
  directPartSourceGroupId?: string | null
  explodedFromReferenceId: string | null
  sourcePartKey: string | null
  sourceMeshIndex: number | null
}

export type StagedImportMode = 'single-object' | 'multiple-objects-in-component'

export type StagedImportUpAxis = 'z-up' | 'y-up' | 'x-up'

export type StagedImportScaleAlignment =
  | 'current-size'
  | 'millimeters'
  | 'centimeters'
  | 'meters'
  | 'inches'
  | 'custom'

export type StagedImportPreviewNodeKind = 'assembly' | 'component' | 'object'

export type StagedImportPreviewNodeRecord = {
  nodeId: string
  nodeKind: StagedImportPreviewNodeKind
  sourceKind: 'authored' | 'staged-file' | 'staged-part'
  label: string
  parentNodeId: string | null
  stagedFileId: string | null
  fileType: ReferenceFileType | null
  sourcePartKey: string | null
  sourceMeshIndex: number | null
}

export type StagedImportPreviewOrganizationState = {
  nodesById: Record<string, StagedImportPreviewNodeRecord>
  rootNodeIds: string[]
  childNodeIdsByParentId: Record<string, string[]>
}

export type StagedImportStructureInspectionState =
  | {
      status: 'idle' | 'loading'
      summary: null
      errorMessage: null
    }
  | {
      status: 'ready'
      summary: ImportedReferenceStructureInspectionSummary
      errorMessage: null
    }
  | {
      status: 'error'
      summary: null
      errorMessage: string
    }

export type StagedImportDraftFileRecord = ImportedReferenceFile & {
  stagedFileId: string
  importMode: StagedImportMode
  upAxis: StagedImportUpAxis
  scaleAlignment: StagedImportScaleAlignment
  scaleMultiplier?: number
  structureInspection: StagedImportStructureInspectionState
}

export type StagedImportDraftState = {
  parentAssemblyId: string | null
  parentComponentId: string | null
  putAcceptedImportsInNewAssembly: boolean
  stagedFiles: StagedImportDraftFileRecord[]
  previewOrganization: StagedImportPreviewOrganizationState
}

export type StagedImportCommitFileResult =
  | {
      stagedFileId: string
      fileName: string
      outcome: 'committed'
      anchorRowId: string | null
      errorMessage: null
    }
  | {
      stagedFileId: string
      fileName: string
      outcome: 'failed'
      anchorRowId: null
      errorMessage: string
    }

export type StagedImportCommitResult = {
  status: 'success' | 'partial' | 'failed'
  anchorRowId: string | null
  committedReferenceCount: number
  fileResults: StagedImportCommitFileResult[]
}

export type ReferenceWorkspacePartVm = {
  rowId: string
  partKey: string
  label: string
  sourceMeshIndex: number
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
  environmentLightTransformBaseById: Record<string, ReferenceTransformOverride>
  transformHistoryByEnvironmentLightId: Record<string, ReferenceTransformHistoryEntry[]>
  activeContentObjectTransformSession: ActiveContentObjectTransformSession | null
  activeEnvironmentLightTransformSession: ActiveEnvironmentLightTransformSession | null
  stagedImportDraft: StagedImportDraftState | null
  importedReferencesById: Record<string, ImportedReferenceRecord>
  importedReferenceOrder: string[]
  partRowsByReferenceId: Record<string, ReferenceWorkspacePartVm[]>
  contentOrderByParentKey: Record<string, string[]>
}
