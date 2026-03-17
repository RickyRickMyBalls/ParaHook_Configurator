import { create } from 'zustand'
import { buildDispatcher } from '../buildDispatcher'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
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
import { buildRequestFromBuildInputs } from '../spaghetti/integration/buildInputsToRequest'
import { buildGraphPublishedContentSurface } from '../spaghetti/outputSurface'
import { OUTPUT_PREVIEW_DEFAULT_COMPONENT_LABEL } from '../spaghetti/system/outputPreviewNode'
import type {
  AssembleResult,
  BoxParams,
  BuildResult,
  PartArtifact,
  ViewMode,
} from '../../shared/buildTypes'
import {
  LEGACY_RUNTIME_GRAPH_DOCUMENT_ID,
  LEGACY_RUNTIME_PROJECT_FILE_ID,
} from '../../shared/buildTypes'
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
  type ReferenceRotateSnapState,
  type ReferenceTimelineChannelKey,
  type ReferenceTimelineConfig,
  type ReferenceTimelineMode,
  type ReferenceTimelineRange,
} from '../references/referenceTimeline'
import { appendConsoleEntry } from '../console/useConsoleStore'

type BoxParamKey = keyof BoxParams
type PartsVisibility = Record<string, boolean>
type AssembledMesh = AssembleResult['assembled']
type BuildPolicy = 'live' | 'release' | 'manual'
type InputMode = 'legacy' | 'spaghetti'
type ProjectFileVersion = 1
export type ProjectContentBuildState = 'rebuild' | 'building' | 'done'
export type ReferenceItemLoadState = 'unloaded' | 'loading' | 'loaded' | 'error'
export type ReferenceTransformMode = 'translate' | 'rotate' | 'scale'
export type ReferenceTransformSpace = 'local' | 'world'

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
      buildState?: ProjectContentBuildState
      buildStateLabel?: string
      rebuildGraphDocumentIds?: string[]
      statusLabel?: string
      statusTone?: 'quiet' | 'ready' | 'warning'
    }
  | {
      rowId: string
      kind: 'component'
      label: string
      meta: string
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
  rotateSnapByReferenceId: Record<string, ReferenceRotateSnapState>
  activeTransformReferenceId: string | null
  activeTransformMode: ReferenceTransformMode
  activeTransformSpace: ReferenceTransformSpace
  importedReferencesById: Record<string, ImportedReferenceRecord>
  importedReferenceOrder: string[]
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

export type AppState = {
  box: BoxParams
  lastBuildSeq: number
  parts: PartArtifact[]
  heelKickInstances: number[]
  toeHookInstances: number[]
  geomDirty: Record<string, number>
  geomBuilt: Record<string, number>
  partsVisibility: PartsVisibility
  selectedPartKey: string | null
  buildPolicy: BuildPolicy
  isInteracting: boolean
  pendingBuildAfterRelease: boolean
  inputMode: InputMode
  viewMode: ViewMode
  assembled: AssembledMesh | null
  assembledSignature: string | null
  currentProject: ProjectFile
  projectContent: ProjectContentState
  referenceWorkspace: ReferenceWorkspaceState
  workerError: string | null
  setBoxParam: (key: BoxParamKey, value: number) => void
  setInputMode: (mode: InputMode) => void
  setSpaghettiGraph: (graph: SpaghettiGraph) => void
  compileGraphDocument: (graphDocumentId: string) => CompileSpaghettiGraphResult
  requestGraphDocumentBuild: (graphDocumentId: string) => CompileSpaghettiGraphResult
  compileSpaghetti: () => CompileSpaghettiGraphResult
  requestSpaghettiBuild: () => CompileSpaghettiGraphResult
  setBuildPolicy: (policy: BuildPolicy) => void
  beginInteraction: () => void
  endInteraction: () => void
  requestManualBuild: () => void
  setViewMode: (mode: ViewMode) => void
  acceptBuildResult: (result: BuildResult) => void
  setAssembled: (result: AssembleResult) => void
  setWorkerError: (message: string | null) => void
  toggleReferenceWorkspaceExpanded: () => void
  toggleReferenceCategoryExpanded: (categoryId: ReferenceCategoryId) => void
  toggleReferenceItemVisibility: (referenceId: string) => void
  setReferenceItemVisibility: (referenceId: string, visible: boolean) => void
  toggleReferenceCategoryVisibility: (categoryId: ReferenceCategoryId) => void
  addImportedReference: (reference: {
    fileName: string
    fileType: ReferenceFileType
    objectUrl: string
  }) => string
  retryReferenceItemLoad: (referenceId: string) => void
  removeImportedReference: (referenceId: string) => void
  setReferenceItemLoadState: (
    referenceId: string,
    loadState: ReferenceItemLoadState,
    errorMessage?: string | null,
  ) => void
  beginReferenceTransform: (referenceId: string) => void
  endReferenceTransform: () => void
  setReferenceTransformMode: (mode: ReferenceTransformMode) => void
  setReferenceTransformSpace: (space: ReferenceTransformSpace) => void
  setReferenceTransformOverride: (
    referenceId: string,
    transformOverride: ReferenceTransformOverride | null,
  ) => void
  resetReferenceTransform: (referenceId: string) => void
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
  setReferenceRotateSnapEnabled: (referenceId: string, enabled: boolean) => void
  setReferenceRotateSnapValue: (referenceId: string, value: number) => void
  ensureVisibilityForPartKeys: (keys: string[], defaultValue?: boolean) => void
  togglePartVisibility: (partKeyStr: string) => void
  setPartVisibility: (partKeyStr: string, visible: boolean) => void
  selectPart: (partKeyStr: string | null) => void
  addHeelKickInstance: () => void
  addToeHookInstance: () => void
  removeHeelKickInstance: (instance: number) => void
  removeToeHookInstance: (instance: number) => void
}

const initialBox: BoxParams = {
  width: 1,
  length: 2,
  height: 1,
}

const defaultVisibility: PartsVisibility = {
  baseplate: true,
  'heelKick#1': true,
  'toeHook#1': true,
  assembled: true,
}

const PROJECT_FILE_VERSION: ProjectFileVersion = 1
const INITIAL_PROJECT_FILE_ID = 'project-file-1'
const ROOT_ASSEMBLY_LABEL = 'Assembly 1'
const REFERENCE_ROOT_ROW_ID = 'reference-root'
const IMPORTED_REFERENCE_ROW_ID_PREFIX = 'reference-import'

const createInitialReferenceWorkspaceState = (): ReferenceWorkspaceState => ({
  referencesExpanded: true,
  categoryExpandedById: Object.fromEntries(
    [...REFERENCE_MANIFEST_CATEGORIES.map((category) => category.categoryId), USER_REFERENCE_CATEGORY_ID].map(
      (categoryId) => [categoryId, true],
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
  transformOverrideById: {},
  channelClampRangeByReferenceId: {},
  timelineModeByReferenceId: {},
  timelineConfigByReferenceId: {},
  rotateSnapByReferenceId: {},
  activeTransformReferenceId: null,
  activeTransformMode: 'translate',
  activeTransformSpace: 'local',
  importedReferencesById: {},
  importedReferenceOrder: [],
})

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

const getReferenceRotateSnapState = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
): ReferenceRotateSnapState =>
  referenceWorkspace.rotateSnapByReferenceId[referenceId] ?? DEFAULT_REFERENCE_ROTATE_SNAP

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

const clearActiveReferenceTransformIfMatches = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceIds: readonly string[],
): Pick<
  ReferenceWorkspaceState,
  'activeTransformReferenceId' | 'activeTransformMode' | 'activeTransformSpace'
> => {
  if (
    referenceWorkspace.activeTransformReferenceId === null ||
    !referenceIds.includes(referenceWorkspace.activeTransformReferenceId)
  ) {
    return {
      activeTransformReferenceId: referenceWorkspace.activeTransformReferenceId,
      activeTransformMode: referenceWorkspace.activeTransformMode,
      activeTransformSpace: referenceWorkspace.activeTransformSpace,
    }
  }
  return {
    activeTransformReferenceId: null,
    activeTransformMode: referenceWorkspace.activeTransformMode,
    activeTransformSpace: referenceWorkspace.activeTransformSpace,
  }
}

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
): ProjectContentState => {
  const rootAssemblyId = project.rootAssemblyId ?? buildRootAssemblyId(project.projectFileId)
  const childRowIds: string[] = []
  const componentsById: Record<string, ProjectComponentRecord> = {}
  const objectsById: Record<string, ProjectObjectRecord> = {}
  let publishedComponentOrdinal = 0

  for (const documentEntry of project.graphDocuments) {
    const graphDocument = spaghettiState.graphDocumentsById[documentEntry.graphDocumentId]
    const outputSurface = selectGraphRuntimeByDocumentId(
      spaghettiState,
      documentEntry.graphDocumentId,
    )?.outputSurface
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

const nextInstanceId = (instances: number[]): number =>
  Math.max(...instances, 0) + 1

export const useAppStore = create<AppState>((set, get) => ({
  box: initialBox,
  lastBuildSeq: 0,
  parts: [],
  heelKickInstances: [1],
  toeHookInstances: [1],
  geomDirty: {},
  geomBuilt: {},
  partsVisibility: defaultVisibility,
  selectedPartKey: null,
  buildPolicy: 'live',
  isInteracting: false,
  pendingBuildAfterRelease: false,
  inputMode: 'legacy',
  viewMode: 'parts',
  assembled: null,
  assembledSignature: null,
  currentProject: createInitialProjectFile(),
  projectContent: createInitialProjectContentState(),
  referenceWorkspace: createInitialReferenceWorkspaceState(),
  workerError: null,
  setBoxParam: (key, value) => {
    const state = get()
    if (state.box[key] === value) {
      return
    }
    const nextBox: BoxParams = {
      ...state.box,
      [key]: value,
    }
    set((state) => ({
      box: nextBox,
      geomDirty: {
        ...state.geomDirty,
        [key]: (state.geomDirty[key] ?? 0) + 1,
      },
    }))
    appendConsoleEntry({
      layer: 'Params',
      text: `${key} = ${value}`,
      source: 'legacy-box',
    })
    if (state.inputMode === 'spaghetti') {
      return
    }
    if (state.buildPolicy === 'live') {
      buildDispatcher.requestBuild(nextBox)
      return
    }
    if (state.buildPolicy === 'release') {
      if (state.isInteracting) {
        if (!state.pendingBuildAfterRelease) {
          set({ pendingBuildAfterRelease: true })
        }
        return
      }
      buildDispatcher.requestBuild(nextBox)
    }
  },
  setInputMode: (mode) => {
    set({
      inputMode: mode,
      pendingBuildAfterRelease: false,
    })
  },
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
    const requestBuild = buildRequestFromBuildInputs(
      compileResult.buildInputs,
      pendingBuildState?.previousBuildInputs ?? undefined,
    )
    const buildRequestId = newId('build-request')

    const payloadWithPatch = {
      ...state.box,
      ...requestBuild.profilePatch,
    }
    const buildSeq = buildDispatcher.requestBuild(payloadWithPatch as BoxParams, {
      routingIdentity: {
        projectFileId: state.currentProject.projectFileId,
        graphDocumentId,
        buildRequestId,
      },
      changedParamIds: requestBuild.changedParamIds,
      buildInstances: requestBuild.instances,
      buildStatsPartKeys: requestBuild.partKeys,
    })
    spaghettiState.stageGraphBuildRequest(graphDocumentId, {
      compileResult,
      previousBuildInputs: pendingBuildState?.previousBuildInputs ?? null,
      pendingChangedParamIds: requestBuild.changedParamIds,
      pendingStatsPartKeys: requestBuild.partKeys,
      pendingInstances: requestBuild.instances,
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
  beginInteraction: () => {
    set((state) => (state.isInteracting ? state : { isInteracting: true }))
  },
  endInteraction: () => {
    let shouldRequestBuild = false
    set((state) => {
      if (!state.isInteracting) {
        return state
      }
      shouldRequestBuild =
        state.buildPolicy === 'release' && state.pendingBuildAfterRelease
      return {
        isInteracting: false,
        pendingBuildAfterRelease: false,
      }
    })
    if (shouldRequestBuild && get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
  requestManualBuild: () => {
    if (get().inputMode === 'spaghetti') {
      const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
      appendConsoleEntry({
        layer: 'App',
        text: `Manual build requested for ${activeGraphDocument.graphDocumentId}`,
        source: activeGraphDocument.graphDocumentId,
        severity: 'info',
      })
      get().requestGraphDocumentBuild(activeGraphDocument.graphDocumentId)
      return
    }
    set({ pendingBuildAfterRelease: false })
    appendConsoleEntry({
      layer: 'App',
      text: 'Manual legacy build requested',
      source: 'legacy-build',
      severity: 'info',
    })
    buildDispatcher.requestBuild(get().box)
  },
  setViewMode: (mode) => {
    set({ viewMode: mode })
    appendConsoleEntry({
      layer: 'View',
      text: `View mode: ${mode}`,
      source: 'view-mode',
      severity: 'info',
    })
  },
  acceptBuildResult: (result) => {
    const currentProjectId = get().currentProject.projectFileId
    const isLegacyRoutingResult =
      result.projectFileId === LEGACY_RUNTIME_PROJECT_FILE_ID &&
      result.graphDocumentId === LEGACY_RUNTIME_GRAPH_DOCUMENT_ID
    if (!isLegacyRoutingResult && result.projectFileId !== currentProjectId) {
      return
    }
    const acceptedSpaghettiResult = isLegacyRoutingResult
      ? false
      : useSpaghettiStore.getState().acceptGraphBuildResult({
          projectFileId: result.projectFileId,
          graphDocumentId: result.graphDocumentId,
          buildRequestId: result.buildRequestId,
          buildSeq: result.seq,
          buildOutputs: result.parts,
        })
    if (!isLegacyRoutingResult && !acceptedSpaghettiResult) {
      return
    }

    set((state) => {
      if (result.seq <= state.lastBuildSeq) {
        if (!isLegacyRoutingResult) {
          return {
            lastBuildSeq: state.lastBuildSeq,
          }
        }
        return state
      }

      if (!isLegacyRoutingResult) {
        return {
          lastBuildSeq: result.seq,
        }
      }

      const nextGeomBuilt = { ...state.geomBuilt }
      for (const id of result.changedParamIds ?? []) {
        nextGeomBuilt[id] = state.geomDirty[id] ?? state.geomBuilt[id] ?? 0
      }
      const incomingPartKeys = result.parts.map((part) => artifactToPartKeyStr(part))
      const incomingPartKeySet = new Set(incomingPartKeys)
      const nextVisibility = { ...state.partsVisibility }
      for (const key of incomingPartKeys) {
        if (nextVisibility[key] === undefined) {
          nextVisibility[key] = true
        }
      }

      let selectedPartKey = state.selectedPartKey
      if (selectedPartKey !== null && !incomingPartKeySet.has(selectedPartKey)) {
        if (incomingPartKeySet.has('baseplate')) {
          selectedPartKey = 'baseplate'
        } else {
          const firstVisible = incomingPartKeys.find((key) => nextVisibility[key] ?? true)
          selectedPartKey = firstVisible ?? incomingPartKeys[0] ?? null
        }
      }
      return {
        lastBuildSeq: result.seq,
        parts: result.parts,
        geomBuilt: nextGeomBuilt,
        partsVisibility: nextVisibility,
        selectedPartKey,
      }
    })
  },
  setAssembled: (result) => {
    set({
      assembled: result.assembled,
      assembledSignature: result.signature,
      workerError: null,
    })
  },
  setWorkerError: (message) => {
    set({ workerError: message })
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
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            [referenceId]: nextVisible,
          },
          ...(!nextVisible
            ? clearActiveReferenceTransformIfMatches(state.referenceWorkspace, [referenceId])
            : {}),
        },
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
          ...(!nextVisible
            ? clearActiveReferenceTransformIfMatches(state.referenceWorkspace, referenceIds)
            : {}),
        },
      }
    })
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
          rotateSnapByReferenceId: {
            ...state.referenceWorkspace.rotateSnapByReferenceId,
            [referenceId]: { ...DEFAULT_REFERENCE_ROTATE_SNAP },
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
      const nextRotateSnapByReferenceId = {
        ...state.referenceWorkspace.rotateSnapByReferenceId,
      }
      delete nextRotateSnapByReferenceId[referenceId]
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: nextVisibilityById,
          loadStateById: nextLoadStateById,
          errorById: nextErrorById,
          transformOverrideById: nextTransformOverrideById,
          channelClampRangeByReferenceId: nextChannelClampRangeByReferenceId,
          timelineModeByReferenceId: nextTimelineModeByReferenceId,
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
          rotateSnapByReferenceId: nextRotateSnapByReferenceId,
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
  beginReferenceTransform: (referenceId) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        visibilityById: {
          ...state.referenceWorkspace.visibilityById,
          [referenceId]: true,
        },
        activeTransformReferenceId: referenceId,
        activeTransformMode: state.referenceWorkspace.activeTransformMode,
        activeTransformSpace: state.referenceWorkspace.activeTransformSpace,
      },
    }))
  },
  endReferenceTransform: () => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeTransformReferenceId: null,
      },
    }))
  },
  setReferenceTransformMode: (mode) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeTransformMode: mode,
      },
    }))
  },
  setReferenceTransformSpace: (space) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeTransformSpace: space,
      },
    }))
  },
  setReferenceTransformOverride: (referenceId, transformOverride) => {
    set((state) => {
      const previousTransformOverride = state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: transformOverride,
          },
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
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: null,
          },
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
      const nextTimelineModeByReferenceId = {
        ...state.referenceWorkspace.timelineModeByReferenceId,
        [referenceId]: {
          ...(state.referenceWorkspace.timelineModeByReferenceId[referenceId] ?? {}),
          [channel]: mode,
        },
      }
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      if (mode === 'timeline') {
        const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.[channel]
        if (existingConfig === undefined) {
          const baseValue =
            channel === 'rotate-snap'
              ? getReferenceRotateSnapState(state.referenceWorkspace, referenceId).value
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
  setReferenceRotateSnapEnabled: (referenceId, enabled) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapByReferenceId: {
          ...state.referenceWorkspace.rotateSnapByReferenceId,
          [referenceId]: {
            ...getReferenceRotateSnapState(state.referenceWorkspace, referenceId),
            enabled,
          },
        },
      },
    }))
  },
  setReferenceRotateSnapValue: (referenceId, value) => {
    set((state) => {
      const previousValue = getReferenceRotateSnapState(state.referenceWorkspace, referenceId).value
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      if (getReferenceTimelineMode(state.referenceWorkspace, referenceId, 'rotate-snap') === 'timeline') {
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
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          rotateSnapByReferenceId: {
            ...state.referenceWorkspace.rotateSnapByReferenceId,
            [referenceId]: {
              ...getReferenceRotateSnapState(state.referenceWorkspace, referenceId),
              value,
            },
          },
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
        },
      }
    })
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
  addHeelKickInstance: () => {
    const next = [...get().heelKickInstances, nextInstanceId(get().heelKickInstances)]
    set({ heelKickInstances: next })
    if (get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
  addToeHookInstance: () => {
    const next = [...get().toeHookInstances, nextInstanceId(get().toeHookInstances)]
    set({ toeHookInstances: next })
    if (get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
  removeHeelKickInstance: (instance) => {
    const current = get().heelKickInstances
    if (!current.includes(instance) || current.length <= 1) {
      return
    }
    const next = current.filter((value) => value !== instance)
    const removedKey = `heelKick#${instance}`
    set((state) => {
      const nextVisibility = { ...state.partsVisibility }
      delete nextVisibility[removedKey]
      return {
        heelKickInstances: next,
        partsVisibility: nextVisibility,
        selectedPartKey:
          state.selectedPartKey === removedKey ? null : state.selectedPartKey,
      }
    })
    if (get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
  removeToeHookInstance: (instance) => {
    const current = get().toeHookInstances
    if (!current.includes(instance) || current.length <= 1) {
      return
    }
    const next = current.filter((value) => value !== instance)
    const removedKey = `toeHook#${instance}`
    set((state) => {
      const nextVisibility = { ...state.partsVisibility }
      delete nextVisibility[removedKey]
      return {
        toeHookInstances: next,
        partsVisibility: nextVisibility,
        selectedPartKey:
          state.selectedPartKey === removedKey ? null : state.selectedPartKey,
      }
    })
    if (get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
}))

export const selectCurrentProject = (state: Pick<AppState, 'currentProject'>): ProjectFile =>
  state.currentProject

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
  state: Pick<AppState, 'currentProject' | 'projectContent'> & {
    graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
  },
): ProjectContentBrowserRowVm[] => {
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
      rows.push({
        rowId: objectRow.objectId,
        kind: 'object',
        label: objectRow.label,
        meta: '',
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
  rows[0] = {
    ...rows[0],
    buildState: assemblyBuildState.buildState,
    buildStateLabel: assemblyBuildState.buildStateLabel,
    rebuildGraphDocumentIds: [...assemblyRebuildGraphDocumentIds],
    statusLabel: assemblyHasContent ? (assemblyHasUnresolvedContent ? 'Unresolved' : 'Ready') : '',
    statusTone:
      !assemblyHasContent ? 'quiet' : assemblyHasUnresolvedContent ? 'warning' : 'ready',
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
    {
      rowId: `reference-category-row:${USER_REFERENCE_CATEGORY_ID}`,
      categoryId: USER_REFERENCE_CATEGORY_ID,
      label: USER_REFERENCE_CATEGORY_LABEL,
      isExpanded: state.referenceWorkspace.categoryExpandedById[USER_REFERENCE_CATEGORY_ID] ?? true,
      itemCount: importedItems.length,
      visibleItemCount: importedItems.filter((item) => item.isVisible).length,
      hasLoadingItem: importedItems.some((item) => item.isVisible && item.loadState === 'loading'),
      hasErrorItem: importedItems.some((item) => item.loadState === 'error'),
      emptyLabel: 'No imported references yet.',
      items: importedItems,
    },
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
    const nextProjectContent = buildProjectContentState(nextCurrentProject, spaghettiState)

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

useSpaghettiStore.subscribe((state, previousState) => {
  if (
    state.graphDocumentOrder === previousState.graphDocumentOrder &&
    state.graphDocumentsById === previousState.graphDocumentsById &&
    state.graphRuntimeByDocumentId === previousState.graphRuntimeByDocumentId
  ) {
    return
  }
  syncCurrentProjectFromSpaghetti(state)
})
