import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { appendConsoleEntry } from '../console/useConsoleStore'
import {
  importReferenceFileFromDisk,
  importReferenceFilesFromDisk,
  importSupportedReferenceFilesFromDisk,
} from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
import { getViewer } from '../viewerBridge'
import { inspectImportedReferenceFileStructure } from '../../viewer/referenceStructureInspection'
import { runEnvironmentLookHistoryAction } from '../store/environmentLookEditHistory'
import {
  defaultViewportPosition,
  selectSharedViewerComposition,
  selectSharedViewerCompositionGraphDocumentIds,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import {
  buildImportedReferenceRowId,
  canReferenceItemExplode,
  canStagedImportFileUseMultipleObjects,
  buildProjectSketchBrowserRowId,
  REFERENCE_ROOT_ROW_ID,
  resolveBrowserDraggableTargetDrop,
  resolveStagedImportPreviewOwnerDrop,
  selectCurrentProjectContentBrowserRows,
  selectReferenceWorkspaceBrowserTree,
  selectShouldSuppressBrowserGraphRuntimeOutput,
  type StagedImportMode,
  type StagedImportCommitResult,
  type StagedImportScaleAlignment,
  type StagedImportUpAxis,
  type BrowserDraggableTarget,
  type ProjectContentOwnerTarget,
  type StagedImportDraftState,
  type WorkspaceSelectedTarget,
  useAppStore,
} from '../store/useAppStore'
import type { BrowserBuildPolicy } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import {
  activateGraphTargetIntent,
  activateGraphDocumentIntent,
  activateObjectIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
import { deleteWorkspaceSelectedEnvironmentLightWithHistory } from '../store/workspaceSelectionCommands'
import { buildBrowserContextMenuItems } from './browserContextMenu'
import {
  createBrowserContentDragSession,
  hasBrowserContentDragCrossedThreshold,
  resolveBrowserContentDragPreviewState,
  type BrowserContentDragSession,
  type BrowserContentPointer,
  type BrowserContentRowMetric,
} from './browserContentDrag'
import {
  createBrowserRowInteractionHandlers,
  resolveBrowserSelectedRowIdFromTarget,
} from './browserInteractions'
import { describeBrowserRow } from './browserRowFamilies'
import { runBrowserRowAction } from './browserRowActions'
import { selectBrowserGraphRows } from './selectBrowserGraphRows'
import {
  type BrowserRenderableRowVm,
  type BrowserTreeRowActionVm,
  selectBrowserTreeRows,
} from './selectBrowserTreeRows'
import {
  selectStagedImportPreviewRows,
  type StagedImportPreviewSelectionState,
  type StagedImportPreviewRowVm,
} from './selectStagedImportPreviewRows'
import type { BrowserTreeRowHandlers } from './browserTreeRowPresenter'
import type { BrowserImportMenuState, BrowserRowContextMenuState } from './browserTreeMenus'

type BrowserPanelControllerInput = {
  newEditorSpawnPosition?: { x: number; y: number }
}

type BrowserPanelControllerOutput = {
  browserTreeRows: ReturnType<typeof selectBrowserTreeRows>
  canOpenNewEditor: boolean
  rowHandlers: BrowserTreeRowHandlers
  sectionHandlers: {
    contentBuildPolicy: BrowserBuildPolicy
    onCycleContentBuildPolicy: () => void
    onOpenContentImportMenu: (event: ReactMouseEvent<HTMLButtonElement>) => void
    registerContentRowElement: (rowId: string) => (element: HTMLDivElement | null) => void
    onCreateGraph: () => void
    onDuplicateFocusedGraph: () => void
    onLoadGraphFile: () => void
    onOpenNewEditor: () => void
  }
  overlay: {
    contextMenu: BrowserRowContextMenuState | null
    contextMenuRef: React.RefObject<HTMLDivElement | null>
    contextMenuStyle: { left: string; top: string } | undefined
    importMenu: BrowserImportMenuState | null
    importMenuRef: React.RefObject<HTMLDivElement | null>
    importMenuStyle: { left: string; top: string } | undefined
    stagedImportDraft: StagedImportDraftState | null
    stagedImportCommitResult: StagedImportCommitResult | null
    stagedImportPreviewSelection: StagedImportPreviewSelectionState | null
    stagedImportColumnWidths: {
      leftPercent: number
      middlePercent: number
      rightPercent: number
    }
    stagedImportPreviewRows: StagedImportPreviewRowVm[]
    stagedImportPreviewSelectedRowId: string | null
    stagedImportPreviewSelectedRowIds: string[]
    isBrowsingImportFiles: boolean
    onOpenImportFiles: () => void
    onBrowseImportFiles: () => void
    onSetStagedImportFileMode: (stagedFileId: string, importMode: StagedImportMode) => void
    onSetStagedImportFileUpAxis: (stagedFileId: string, upAxis: StagedImportUpAxis) => void
    onSetStagedImportFileScaleAlignment: (
      stagedFileId: string,
      scaleAlignment: StagedImportScaleAlignment,
    ) => void
    onSetStagedImportFileScaleMultiplier: (
      stagedFileId: string,
      scaleMultiplier: number,
    ) => void
    onRemoveStagedImportFile: (stagedFileId: string) => void
    onLoadStagedImportPreview: (stagedFileId: string, sourceRowId?: string | null) => void
    onSelectStagedImportPreviewRow: (
      row: StagedImportPreviewRowVm,
      modifiers?: {
        ctrlKey: boolean
        shiftKey: boolean
      },
    ) => void
    onStartStagedImportColumnResize: (
      divider: 'left-middle' | 'middle-right',
      event: ReactPointerEvent<HTMLButtonElement>,
      dialogWidth: number,
    ) => void
    onSetStagedImportPutAcceptedInNewAssembly: (enabled: boolean) => void
    onCreateStagedImportPreviewAssembly: () => void
    canRemoveSelectedPreviewRows: boolean
    onRemoveSelectedPreviewRows: () => void
    onCreateStagedImportPreviewComponent: (assemblyId: string) => void
    registerStagedImportPreviewRowElement: (rowId: string) => (element: HTMLDivElement | null) => void
    onStagedImportPreviewRowPointerDown: (
      row: StagedImportPreviewRowVm,
      event: ReactPointerEvent<HTMLButtonElement>,
    ) => void
    getStagedImportPreviewRowDragState: (row: StagedImportPreviewRowVm) => {
      draggable: boolean
      isDragging: boolean
      isPendingDrag: boolean
      dropIntent: 'none' | 'before' | 'after' | 'into' | 'invalid'
      isDropOwnerSupport: boolean
    }
    onCommitStagedImportDraft: () => void
    onCloseImportDialog: () => void
    onImportReferenceFile: (fileType: ReferenceFileType) => void
  }
  bodyHandlers: {
    onBrowserBodyClick: (event: ReactMouseEvent<HTMLDivElement>) => void
    onActivateBrowserSurface: () => void
    closeBrowserOverlays: () => void
  }
}

type StagedImportColumnWidths = {
  leftPercent: number
  middlePercent: number
  rightPercent: number
}

type StagedImportPreviewRowSelectionState = {
  selectedRowId: string | null
  explicitSelectedRowIds: string[]
  selectionAnchorRowId: string | null
}

const defaultStagedImportColumnWidths: StagedImportColumnWidths = {
  leftPercent: 44,
  middlePercent: 31,
  rightPercent: 25,
}

const clampStagedImportColumnWidths = (
  widths: StagedImportColumnWidths,
  dialogWidth: number,
) => {
  const safeDialogWidth = Math.max(dialogWidth, 960)
  const minLeft = (320 / safeDialogWidth) * 100
  const minMiddle = (300 / safeDialogWidth) * 100
  const minRight = (280 / safeDialogWidth) * 100

  let leftPercent = widths.leftPercent
  let middlePercent = widths.middlePercent
  let rightPercent = widths.rightPercent

  if (leftPercent < minLeft) {
    const delta = minLeft - leftPercent
    leftPercent += delta
    middlePercent = Math.max(minMiddle, middlePercent - delta)
  }

  if (rightPercent < minRight) {
    const delta = minRight - rightPercent
    rightPercent += delta
    middlePercent = Math.max(minMiddle, middlePercent - delta)
  }

  if (middlePercent < minMiddle) {
    const deficit = minMiddle - middlePercent
    middlePercent += deficit
    if (leftPercent - deficit >= minLeft) {
      leftPercent -= deficit
    } else {
      const leftDelta = Math.max(0, leftPercent - minLeft)
      leftPercent -= leftDelta
      rightPercent = Math.max(minRight, rightPercent - (deficit - leftDelta))
    }
  }

  const total = leftPercent + middlePercent + rightPercent
  return {
    leftPercent: (leftPercent / total) * 100,
    middlePercent: (middlePercent / total) * 100,
    rightPercent: (rightPercent / total) * 100,
  }
}

export function useBrowserPanelController(
  input: BrowserPanelControllerInput = {},
): BrowserPanelControllerOutput {
  const { newEditorSpawnPosition = defaultViewportPosition } = input
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const cachedGraphEntriesById = useSpaghettiStore((state) => state.cachedGraphEntriesById)
  const cachedGraphEntryOrder = useSpaghettiStore((state) => state.cachedGraphEntryOrder)
  const editorViewportsById = useSpaghettiStore((state) => state.editorViewportsById)
  const editorViewportOrder = useSpaghettiStore((state) => state.editorViewportOrder)
  const activeGraphDocumentId = useSpaghettiStore((state) => state.activeGraphDocumentId)
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const graphRuntimeByDocumentId = useSpaghettiStore((state) => state.graphRuntimeByDocumentId)
  const createGraphDocument = useSpaghettiStore((state) => state.createGraphDocument)
  const duplicateActiveGraphDocument = useSpaghettiStore((state) => state.duplicateActiveGraphDocument)
  const loadGraphDocumentIntoNewGraphFromFile = useSpaghettiStore(
    (state) => state.loadGraphDocumentIntoNewGraphFromFile,
  )
  const saveCachedGraphEntryToFile = useSpaghettiStore((state) => state.saveCachedGraphEntryToFile)
  const requestGraphDocumentStepExport = useAppStore(
    (state) => state.requestGraphDocumentStepExport,
  )
  const openGraphDocumentInViewport = useSpaghettiStore((state) => state.openGraphDocumentInViewport)
  const openGraphDocumentInNewViewport = useSpaghettiStore(
    (state) => state.openGraphDocumentInNewViewport,
  )
  const swapFocusedEditorViewportToGraphDocument = useSpaghettiStore(
    (state) => state.swapFocusedEditorViewportToGraphDocument,
  )
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const setEditorViewportPosition = useSpaghettiStore((state) => state.setEditorViewportPosition)
  const setViewerTargetGraphDocumentId = useSpaghettiStore(
    (state) => state.setViewerTargetGraphDocumentId,
  )
  const setSelectedNodeId = useSpaghettiStore((state) => state.setSelectedNodeId)
  const requestEditorViewportCanvasFit = useSpaghettiStore(
    (state) => state.requestEditorViewportCanvasFit,
  )
  const requestEditorViewportNodeFit = useSpaghettiStore(
    (state) => state.requestEditorViewportNodeFit,
  )
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const sharedViewerCompositionGraphDocumentIds = useSpaghettiStore(
    selectSharedViewerCompositionGraphDocumentIds,
  )
  const currentProject = useAppStore((state) => state.currentProject)
  const environmentView = useUiPrefsStore((state) => state.view)
  const projectContent = useAppStore((state) => state.projectContent)
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const sketchVisibilityByRowId = useAppStore((state) => state.sketchVisibilityByRowId)
  const partsVisibility = useAppStore((state) => state.partsVisibility)
  const workspaceSelectedTarget = useAppStore((state) => state.workspaceSelection?.selectedTarget ?? null)
  const workspaceExplicitSelectedTargets = useAppStore(
    (state) => state.workspaceSelection?.explicitSelectedTargets ?? [],
  )
  const workspaceSelectionAnchorTarget = useAppStore(
    (state) => state.workspaceSelection?.selectionAnchorTarget ?? null,
  )
  const workspaceResolvedContentSelection = useAppStore(
    (state) => state.workspaceSelection?.resolvedContentSelection ?? null,
  )
  const browserGraphBuildPolicyByGraphDocumentId = useAppStore(
    (state) => state.browserGraphBuildPolicyByGraphDocumentId,
  )
  const browserContentBuildPolicyByRowId = useAppStore(
    (state) => state.browserContentBuildPolicyByRowId,
  )
  const selectLight = useUiPrefsStore((state) => state.selectLight)
  const deleteLight = useUiPrefsStore((state) => state.deleteLight)
  const updateLight = useUiPrefsStore((state) => state.updateLight)
  const activeViewerViewportId = useWorkspaceStore((state) => state.activeViewerViewportId)
  const setViewportLocalViewState = useWorkspaceStore(
    (state) => state.setViewportLocalViewState,
  )
  const setHdriEnvironmentBackgroundVisible = useUiPrefsStore(
    (state) => state.setHdriEnvironmentBackgroundVisible,
  )
  const cycleBrowserGraphBuildPolicy = useAppStore((state) => state.cycleBrowserGraphBuildPolicy)
  const cycleBrowserContentBuildPolicy = useAppStore((state) => state.cycleBrowserContentBuildPolicy)
  const setBrowserGraphBuildPolicy = useAppStore((state) => state.setBrowserGraphBuildPolicy)
  const setBrowserContentBuildPolicy = useAppStore((state) => state.setBrowserContentBuildPolicy)
  const clearBrowserGraphBuildPolicy = useAppStore((state) => state.clearBrowserGraphBuildPolicy)
  const clearBrowserContentBuildPolicy = useAppStore((state) => state.clearBrowserContentBuildPolicy)
  const selectPart = useAppStore((state) => state.selectPart)
  const toggleReferenceWorkspaceExpanded = useAppStore(
    (state) => state.toggleReferenceWorkspaceExpanded,
  )
  const toggleReferenceCategoryExpanded = useAppStore(
    (state) => state.toggleReferenceCategoryExpanded,
  )
  const toggleReferenceItemVisibility = useAppStore(
    (state) => state.toggleReferenceItemVisibility,
  )
  const setReferenceItemVisibility = useAppStore((state) => state.setReferenceItemVisibility)
  const toggleReferenceCategoryVisibility = useAppStore(
    (state) => state.toggleReferenceCategoryVisibility,
  )
  const toggleSketchVisibility = useAppStore((state) => state.toggleSketchVisibility)
  const setPartVisibility = useAppStore((state) => state.setPartVisibility)
  const stagedImportDraft = useAppStore((state) => state.referenceWorkspace.stagedImportDraft)
  const openStagedImportDraft = useAppStore((state) => state.openStagedImportDraft)
  const appendStagedImportDraftFiles = useAppStore((state) => state.appendStagedImportDraftFiles)
  const removeStagedImportDraftFile = useAppStore((state) => state.removeStagedImportDraftFile)
  const createStagedImportPreviewAssembly = useAppStore(
    (state) => state.createStagedImportPreviewAssembly,
  )
  const createStagedImportPreviewComponent = useAppStore(
    (state) => state.createStagedImportPreviewComponent,
  )
  const removeStagedImportPreviewOwners = useAppStore(
    (state) => state.removeStagedImportPreviewOwners,
  )
  const moveStagedImportPreviewOwner = useAppStore((state) => state.moveStagedImportPreviewOwner)
  const setStagedImportFileMode = useAppStore((state) => state.setStagedImportFileMode)
  const setStagedImportFileUpAxis = useAppStore((state) => state.setStagedImportFileUpAxis)
  const setStagedImportFileScaleAlignment = useAppStore(
    (state) => state.setStagedImportFileScaleAlignment,
  )
  const setStagedImportFileScaleMultiplier = useAppStore(
    (state) => state.setStagedImportFileScaleMultiplier,
  )
  const setStagedImportPutAcceptedInNewAssembly = useAppStore(
    (state) => state.setStagedImportPutAcceptedInNewAssembly,
  )
  const commitStagedImportDraftWithHistory = useAppStore(
    (state) => state.commitStagedImportDraftWithHistory,
  )
  const beginStagedImportFileStructureInspection = useAppStore(
    (state) => state.beginStagedImportFileStructureInspection,
  )
  const resolveStagedImportFileStructureInspection = useAppStore(
    (state) => state.resolveStagedImportFileStructureInspection,
  )
  const failStagedImportFileStructureInspection = useAppStore(
    (state) => state.failStagedImportFileStructureInspection,
  )
  const closeStagedImportDraft = useAppStore((state) => state.closeStagedImportDraft)
  const addImportedReference = useAppStore((state) => state.addImportedReference)
  const retryReferenceItemLoad = useAppStore((state) => state.retryReferenceItemLoad)
  const startReferenceLoadBatchForAll = useAppStore((state) => state.startReferenceLoadBatchForAll)
  const startReferenceLoadBatchForCategory = useAppStore(
    (state) => state.startReferenceLoadBatchForCategory,
  )
  const explodeImportedReference = useAppStore((state) => state.explodeImportedReference)
  const removeImportedReference = useAppStore((state) => state.removeImportedReference)
  const createProjectAssembly = useAppStore((state) => state.createProjectAssemblyWithHistory)
  const createProjectComponent = useAppStore((state) => state.createProjectComponentWithHistory)
  const moveProjectContentOwner = useAppStore((state) => state.moveProjectContentOwner)
  const moveProjectContentOwnersBatch = useAppStore((state) => state.moveProjectContentOwnersBatch)
  const captureProjectContentOrganizationHistorySnapshot = useAppStore(
    (state) => state.captureProjectContentOrganizationHistorySnapshot,
  )
  const commitProjectContentOrganizationMoveHistory = useAppStore(
    (state) => state.commitProjectContentOrganizationMoveHistory,
  )
  const renameProjectContentOwner = useAppStore((state) => state.renameProjectContentOwnerWithHistory)
  const deleteProjectContentOwner = useAppStore((state) => state.deleteProjectContentOwnerWithHistory)
  const beginReferenceTransformShell = useAppStore((state) => state.beginReferenceTransformShell)
  const setWorkspaceSelectedTarget = useAppStore((state) => state.setWorkspaceSelectedTarget)
  const setWorkspaceExplicitSelection = useAppStore((state) => state.setWorkspaceExplicitSelection)
  const setActiveSurface = useAppStore((state) => state.setActiveSurface)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const requestConsoleWorkspaceContextHandoff = useAppStore(
    (state) => state.requestConsoleWorkspaceContextHandoff,
  )
  const requestFloatingShellActivation = useAppStore(
    (state) => state.requestFloatingShellActivation,
  )
  const activeTransformReferenceId = useAppStore(
    (state) => state.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null,
  )
  const contentOrderByParentKey = useAppStore(
    (state) => state.referenceWorkspace.contentOrderByParentKey,
  )
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const [expandedGraphDocumentIds, setExpandedGraphDocumentIds] = useState<string[]>([])
  const [graphSectionExpandedByRowId, setGraphSectionExpandedByRowId] = useState<
    Record<string, boolean>
  >({})
  const [collapsedContentRowIds, setCollapsedContentRowIds] = useState<string[]>([])
  const [localSelectedBrowserRowId, setLocalSelectedBrowserRowId] = useState<string | null>(null)
  const [contentDragState, setContentDragState] = useState<BrowserContentDragSession | null>(null)
  const [contextMenu, setContextMenu] = useState<BrowserRowContextMenuState | null>(null)
  const [importMenu, setImportMenu] = useState<BrowserImportMenuState | null>(null)
  const [isBrowsingImportFiles, setIsBrowsingImportFiles] = useState(false)
  const [stagedImportCommitResult, setStagedImportCommitResult] =
    useState<StagedImportCommitResult | null>(null)
  const [stagedImportPreviewSelection, setStagedImportPreviewSelection] =
    useState<StagedImportPreviewSelectionState | null>(null)
  const [stagedImportPreviewRowSelection, setStagedImportPreviewRowSelection] =
    useState<StagedImportPreviewRowSelectionState>({
      selectedRowId: null,
      explicitSelectedRowIds: [],
      selectionAnchorRowId: null,
    })
  const [stagedImportColumnWidths, setStagedImportColumnWidths] = useState(
    defaultStagedImportColumnWidths,
  )
  const [stagedImportPreviewDragState, setStagedImportPreviewDragState] =
    useState<BrowserContentDragSession | null>(null)
  const contextMenuRef = useRef<HTMLDivElement | null>(null)
  const importMenuRef = useRef<HTMLDivElement | null>(null)
  const contentRowElementsByIdRef = useRef(new Map<string, HTMLDivElement>())
  const stagedImportPreviewRowElementsByIdRef = useRef(new Map<string, HTMLDivElement>())
  const suppressedClickRowIdRef = useRef<string | null>(null)
  const stagedImportInspectionIdsRef = useRef(new Set<string>())

  const projectContentRows = useMemo(
    () =>
      selectCurrentProjectContentBrowserRows({
        currentProject,
        projectContent,
        referenceWorkspace,
        partsVisibility,
        sketchVisibilityByRowId,
        graphRuntimeByDocumentId,
        graphDocumentsById,
      }),
    [
      currentProject,
      graphDocumentsById,
      graphRuntimeByDocumentId,
      partsVisibility,
      projectContent,
      referenceWorkspace,
      sketchVisibilityByRowId,
    ],
  )

  const stagedImportPreviewRows = useMemo(
    () => selectStagedImportPreviewRows(stagedImportDraft, stagedImportPreviewSelection),
    [stagedImportDraft, stagedImportPreviewSelection],
  )

  useEffect(() => {
    const validRowIds = new Set(stagedImportPreviewRows.map((row) => row.rowId))
    setStagedImportPreviewRowSelection((current) => {
      const explicitSelectedRowIds = current.explicitSelectedRowIds.filter((rowId) =>
        validRowIds.has(rowId),
      )
      const selectedRowId =
        current.selectedRowId !== null && validRowIds.has(current.selectedRowId)
          ? current.selectedRowId
          : explicitSelectedRowIds.at(-1) ?? null
      const normalizedExplicitSelectedRowIds =
        selectedRowId === null
          ? []
          : explicitSelectedRowIds.length > 0
            ? explicitSelectedRowIds
            : [selectedRowId]
      const selectionAnchorRowId =
        current.selectionAnchorRowId !== null && validRowIds.has(current.selectionAnchorRowId)
          ? current.selectionAnchorRowId
          : normalizedExplicitSelectedRowIds[0] ?? null

      if (
        current.selectedRowId === selectedRowId &&
        current.selectionAnchorRowId === selectionAnchorRowId &&
        current.explicitSelectedRowIds.length === normalizedExplicitSelectedRowIds.length &&
        current.explicitSelectedRowIds.every(
          (rowId, index) => rowId === normalizedExplicitSelectedRowIds[index],
        )
      ) {
        return current
      }

      return {
        selectedRowId,
        explicitSelectedRowIds: normalizedExplicitSelectedRowIds,
        selectionAnchorRowId,
      }
    })
  }, [stagedImportPreviewRows])

  const selectedStagedImportPreviewRows = useMemo(() => {
    const selectedRowIds =
      stagedImportPreviewRowSelection.explicitSelectedRowIds.length > 0
        ? stagedImportPreviewRowSelection.explicitSelectedRowIds
        : stagedImportPreviewRowSelection.selectedRowId !== null
          ? [stagedImportPreviewRowSelection.selectedRowId]
          : []
    const rowById = new Map(stagedImportPreviewRows.map((row) => [row.rowId, row] as const))
    return selectedRowIds
      .map((rowId) => rowById.get(rowId) ?? null)
      .filter((row): row is StagedImportPreviewRowVm => row !== null)
  }, [stagedImportPreviewRowSelection, stagedImportPreviewRows])

  const canRemoveSelectedPreviewRows =
    selectedStagedImportPreviewRows.length > 0 &&
    selectedStagedImportPreviewRows.every((row) => row.canDeleteFromPreviewOrganization)

  const contentRootBuildPolicy = useMemo<BrowserBuildPolicy>(() => {
    const rootAssemblyId = currentProject?.rootAssemblyId ?? null
    if (rootAssemblyId === null) {
      return 'live'
    }
    return browserContentBuildPolicyByRowId[rootAssemblyId] ?? 'live'
  }, [browserContentBuildPolicyByRowId, currentProject])

  const referenceWorkspaceTree = useMemo(
    () => selectReferenceWorkspaceBrowserTree({ referenceWorkspace }),
    [referenceWorkspace],
  )

  const editorViewports = useMemo(
    () =>
      editorViewportOrder
        .map((editorViewportId) => editorViewportsById[editorViewportId] ?? null)
        .filter((viewport) => viewport !== null),
    [editorViewportOrder, editorViewportsById],
  )

  const { hasFocusedViewportByGraphDocumentId, openViewportCountByGraphDocumentId } = useMemo(() => {
    const nextOpenViewportCountByGraphDocumentId = new Map<string, number>()
    const nextHasFocusedViewportByGraphDocumentId = new Map<string, boolean>()
    for (const viewport of editorViewports) {
      nextOpenViewportCountByGraphDocumentId.set(
        viewport.graphDocumentId,
        (nextOpenViewportCountByGraphDocumentId.get(viewport.graphDocumentId) ?? 0) + 1,
      )
      if (viewport.isFocused) {
        nextHasFocusedViewportByGraphDocumentId.set(viewport.graphDocumentId, true)
      }
    }
    return {
      openViewportCountByGraphDocumentId: nextOpenViewportCountByGraphDocumentId,
      hasFocusedViewportByGraphDocumentId: nextHasFocusedViewportByGraphDocumentId,
    }
  }, [editorViewports])

  const graphRows = useMemo(() => {
    const suppressedGraphDocumentIds = new Set(
      Object.keys(graphRuntimeByDocumentId).filter((graphDocumentId) =>
        selectShouldSuppressBrowserGraphRuntimeOutput(
          {
            currentProject,
            projectContent,
            browserGraphBuildPolicyByGraphDocumentId,
            browserContentBuildPolicyByRowId,
          },
          graphDocumentId,
        ),
      ),
    )

    return selectBrowserGraphRows({
      cachedGraphEntryOrder,
      cachedGraphEntriesById,
      graphDocumentsById,
      graphRuntimeByDocumentId,
      browserGraphBuildPolicyByGraphDocumentId,
      suppressedGraphDocumentIds,
      activeGraphDocumentId,
      openViewportCountByGraphDocumentId,
      hasFocusedViewportByGraphDocumentId,
    })
  }, [
    activeGraphDocumentId,
    browserContentBuildPolicyByRowId,
    browserGraphBuildPolicyByGraphDocumentId,
    cachedGraphEntriesById,
    cachedGraphEntryOrder,
    currentProject,
    graphDocumentsById,
    graphRuntimeByDocumentId,
    hasFocusedViewportByGraphDocumentId,
    openViewportCountByGraphDocumentId,
    projectContent,
  ])

  const resolveSelectedBrowserRowIdFromTarget = useCallback(
    (target: WorkspaceSelectedTarget | null): string | null =>
      resolveBrowserSelectedRowIdFromTarget(target, {
        graphDocumentsById,
        referenceWorkspaceRootRowId: REFERENCE_ROOT_ROW_ID,
        buildProjectSketchBrowserRowId,
      }),
    [graphDocumentsById],
  )

  const resolvedSelectedBrowserRowId = resolveSelectedBrowserRowIdFromTarget(workspaceSelectedTarget)
  const resolveSelectedBrowserRowIdsFromTargets = useCallback(
    (targets: WorkspaceSelectedTarget[]): string[] =>
      targets
        .map((target) => resolveSelectedBrowserRowIdFromTarget(target))
        .filter((rowId): rowId is string => rowId !== null),
    [resolveSelectedBrowserRowIdFromTarget],
  )

  const explicitSelectedBrowserRowIds = useMemo(
    () => resolveSelectedBrowserRowIdsFromTargets(workspaceExplicitSelectedTargets),
    [resolveSelectedBrowserRowIdsFromTargets, workspaceExplicitSelectedTargets],
  )

  const multiSelectImportedReferenceDeleteIds = useMemo(() => {
    if (workspaceExplicitSelectedTargets.length <= 1) {
      return null
    }
    const referenceIds: string[] = []
    for (const target of workspaceExplicitSelectedTargets) {
      if (target.kind === 'reference-item') {
        const importedReference = referenceWorkspace.importedReferencesById[target.referenceId]
        if (importedReference === undefined) {
          return null
        }
        referenceIds.push(target.referenceId)
        continue
      }
      if (target.kind === 'object') {
        const importedReference = referenceWorkspace.importedReferenceOrder
          .map((referenceId) => referenceWorkspace.importedReferencesById[referenceId] ?? null)
          .find(
            (record) =>
              record !== null && buildImportedReferenceRowId(record.referenceId) === target.objectId,
          )
        if (importedReference === undefined || importedReference === null) {
          return null
        }
        referenceIds.push(importedReference.referenceId)
        continue
      }
      return null
    }
    return referenceIds.length > 1 ? [...new Set(referenceIds)] : null
  }, [referenceWorkspace, workspaceExplicitSelectedTargets])

  const selectedBrowserRowId =
    resolvedSelectedBrowserRowId ??
    (workspaceActiveSurface === 'browser' ? localSelectedBrowserRowId : null)
  const selectedBrowserRowIds =
    explicitSelectedBrowserRowIds.length > 0
      ? explicitSelectedBrowserRowIds
      : selectedBrowserRowId === null
        ? []
        : [selectedBrowserRowId]

  const groupedSelectedBrowserRowIds = useMemo(() => {
    const groupedRowIdSet = new Set<string>()
    if (workspaceResolvedContentSelection !== null) {
      workspaceResolvedContentSelection.groupedRowIds.forEach((rowId) => groupedRowIdSet.add(rowId))
    }

    return [...groupedRowIdSet]
  }, [
    workspaceResolvedContentSelection,
  ])

  const browserTreeRows = useMemo(
    () =>
      selectBrowserTreeRows({
        referenceLoadBatch: referenceWorkspace.referenceLoadBatch,
        activeTransformReferenceId,
        environmentView,
        contentRows: projectContentRows,
        contentOrderByParentKey,
        graphRows,
        browserGraphBuildPolicyByGraphDocumentId,
        browserContentBuildPolicyByRowId,
        editorViewports,
        graphDocumentsById,
        partsVisibility,
        selectedRowId: selectedBrowserRowId,
        selectedRowIds: selectedBrowserRowIds,
        groupedSelectedRowIds: groupedSelectedBrowserRowIds,
        collapsedContentRowIds,
        expandedGraphDocumentIds,
        graphSectionExpandedByRowId,
        hasActiveEditorViewport: activeEditorViewportId.length > 0,
        sharedViewerCompositionGraphDocumentIds,
        sharedViewerCompositionActive: sharedViewerComposition !== null,
      }),
    [
      activeEditorViewportId,
      activeTransformReferenceId,
      environmentView,
      browserContentBuildPolicyByRowId,
      browserGraphBuildPolicyByGraphDocumentId,
      collapsedContentRowIds,
      contentOrderByParentKey,
      editorViewports,
      expandedGraphDocumentIds,
      graphDocumentsById,
      graphRows,
      graphSectionExpandedByRowId,
      groupedSelectedBrowserRowIds,
      partsVisibility,
      projectContentRows,
      referenceWorkspace,
      selectedBrowserRowId,
      selectedBrowserRowIds,
      sharedViewerComposition,
      sharedViewerCompositionGraphDocumentIds,
    ],
  )

  const mountedReferenceContainerRowIds = useMemo(() => {
    const rowIds = new Set<string>()
    browserTreeRows.contentRows.forEach((row) => {
      if (row.rowKind === 'assembly' && row.referenceContainerKind === 'root') {
        rowIds.add(row.rowId)
        return
      }
      if (row.rowKind === 'component' && row.referenceContainerKind === 'category') {
        rowIds.add(row.rowId)
      }
    })
    return rowIds
  }, [browserTreeRows.contentRows])

  const workspaceIntentDeps = useMemo<WorkspaceIntentDeps>(
    () => ({
      app: {
        setWorkspaceSelectedTarget,
        setActiveSurface,
        requestFloatingShellActivation,
        requestConsoleContextSync,
        requestConsoleWorkspaceContextHandoff,
        setReferenceItemVisibility,
        beginReferenceTransform: beginReferenceTransformShell,
        selectPart,
      },
      spaghetti: {
        activeEditorViewportId,
        editorViewportsById,
        openGraphDocumentInViewport,
      openGraphDocumentInNewViewport,
      swapFocusedEditorViewportToGraphDocument,
      setActiveEditorViewportId,
      setEditorViewportPosition,
      setSelectedNodeId,
      requestEditorViewportCanvasFit,
      requestEditorViewportNodeFit,
    },
  }),
    [
      activeEditorViewportId,
      beginReferenceTransformShell,
      editorViewportsById,
      openGraphDocumentInViewport,
      openGraphDocumentInNewViewport,
      requestConsoleContextSync,
      requestConsoleWorkspaceContextHandoff,
      requestEditorViewportCanvasFit,
      requestEditorViewportNodeFit,
      requestFloatingShellActivation,
      selectPart,
      setActiveEditorViewportId,
      setActiveSurface,
      setEditorViewportPosition,
      setReferenceItemVisibility,
      setSelectedNodeId,
      setWorkspaceSelectedTarget,
      swapFocusedEditorViewportToGraphDocument,
    ],
  )

  const resolveBrowserContentOwnerTargetFromRow = useCallback(
    (row: BrowserRenderableRowVm): BrowserDraggableTarget | null => {
      if (row.rowKind === 'assembly') {
        return { kind: 'assembly', assemblyId: row.rowId }
      }
      if (row.rowKind === 'component') {
        return { kind: 'component', componentId: row.rowId }
      }
      if (
        row.rowKind === 'object' &&
        (row.contentOriginKind === 'source-reference' ||
          row.contentOriginKind === 'imported-reference') &&
        row.referenceId
      ) {
        return { kind: 'imported-reference', referenceId: row.referenceId }
      }
      if (row.rowKind === 'object') {
        return { kind: 'object', objectId: row.rowId }
      }
      return null
    },
    [],
  )

  const resolveBrowserDraggableTargetFromRow = useCallback(
    (row: BrowserRenderableRowVm): BrowserDraggableTarget | null =>
      resolveBrowserContentOwnerTargetFromRow(row),
    [resolveBrowserContentOwnerTargetFromRow],
  )

  const resolveWorkspaceTargetFromContentOwnerTarget = useCallback(
    (target: BrowserDraggableTarget): WorkspaceSelectedTarget =>
      target.kind === 'assembly'
        ? { kind: 'assembly', assemblyId: target.assemblyId }
        : target.kind === 'component'
          ? { kind: 'component', componentId: target.componentId }
          : target.kind === 'object'
            ? { kind: 'object', objectId: target.objectId }
            : { kind: 'object', objectId: buildImportedReferenceRowId(target.referenceId) },
    [],
  )

  const isDraggableContentOwnerRow = useCallback((row: BrowserRenderableRowVm): boolean => {
    if (row.rowKind === 'assembly') {
      return row.rowId !== REFERENCE_ROOT_ROW_ID &&
        projectContent?.assembliesById[row.rowId]?.assemblySourceKind === 'authored'
    }
    if (row.rowKind === 'component') {
      return row.referenceCategoryId != null || row.componentSourceKind === 'authored'
    }
    if (row.rowKind === 'object') {
      if (row.contentOriginKind === 'source-reference') {
        return true
      }
      if (row.contentOriginKind === 'imported-reference') {
        return true
      }
      return row.objectSourceKind === 'published-object'
    }
    return false
  }, [projectContent])

  const registerContentRowElement = useCallback(
    (rowId: string) => (element: HTMLDivElement | null) => {
      if (element === null) {
        contentRowElementsByIdRef.current.delete(rowId)
        return
      }
      contentRowElementsByIdRef.current.set(rowId, element)
    },
    [],
  )

  const resolveContentOwnerTargetFromRowId = useCallback(
    (rowId: string): ProjectContentOwnerTarget | null => {
      const row = browserTreeRows.contentRows.find((candidate) => candidate.rowId === rowId) ?? null
      if (row === null) {
        return null
      }
      const ownerTarget = resolveBrowserContentOwnerTargetFromRow(row)
      if (ownerTarget === null) {
        return null
      }
      return ownerTarget
    },
    [browserTreeRows.contentRows, resolveBrowserContentOwnerTargetFromRow],
  )

  const groupedImportedReferenceDragSelection = useMemo(() => {
    if (workspaceExplicitSelectedTargets.length <= 1) {
      return null
    }
    const selectedRowIds = new Set<string>()
    for (const target of workspaceExplicitSelectedTargets) {
      if (target.kind === 'reference-item') {
        const importedReference = referenceWorkspace.importedReferencesById[target.referenceId]
        if (importedReference === undefined) {
          return null
        }
        selectedRowIds.add(buildImportedReferenceRowId(target.referenceId))
        continue
      }
      if (target.kind === 'object') {
        const importedReference = referenceWorkspace.importedReferenceOrder
          .map((referenceId) => referenceWorkspace.importedReferencesById[referenceId] ?? null)
          .find(
            (record) =>
              record !== null && buildImportedReferenceRowId(record.referenceId) === target.objectId,
          )
        if (importedReference === undefined || importedReference === null) {
          return null
        }
        selectedRowIds.add(buildImportedReferenceRowId(importedReference.referenceId))
        continue
      }
      return null
    }

    if (selectedRowIds.size <= 1) {
      return null
    }

    const orderedRows = browserTreeRows.contentRows.filter((row) => selectedRowIds.has(row.rowId))
    if (orderedRows.length !== selectedRowIds.size) {
      return null
    }

    const draggedTargets = orderedRows
      .map((row) => resolveBrowserDraggableTargetFromRow(row))
      .filter((target): target is BrowserDraggableTarget => target !== null)

    if (
      draggedTargets.length !== orderedRows.length ||
      draggedTargets.some((target) => target.kind !== 'imported-reference')
    ) {
      return null
    }

    return {
      rowIds: orderedRows.map((row) => row.rowId),
      draggedTargets,
      workspaceTargets: draggedTargets.map(resolveWorkspaceTargetFromContentOwnerTarget),
    }
  }, [
    browserTreeRows.contentRows,
    referenceWorkspace,
    resolveBrowserDraggableTargetFromRow,
    resolveWorkspaceTargetFromContentOwnerTarget,
    workspaceExplicitSelectedTargets,
  ])

  const buildVisibleContentRowMetrics = useCallback((): BrowserContentRowMetric[] => {
    return browserTreeRows.contentRows
      .flatMap((row) => {
        const element = contentRowElementsByIdRef.current.get(row.rowId)
        if (element === undefined) {
          return []
        }
        const rect = element.getBoundingClientRect()
        if (rect.height <= 0 || rect.width <= 0) {
          return []
        }
        return [
          {
            rowId: row.rowId,
            depth: row.depth,
            isExpandable: row.isExpandable,
            isExpanded: row.isExpanded,
            rowKind: row.rowKind,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          } satisfies BrowserContentRowMetric,
        ]
      })
      .sort((left, right) => {
        if (left.top !== right.top) {
          return left.top - right.top
        }
        if (left.left !== right.left) {
          return left.left - right.left
        }
        return left.rowId.localeCompare(right.rowId)
      })
  }, [browserTreeRows.contentRows])

  const registerStagedImportPreviewRowElement = useCallback(
    (rowId: string) => (element: HTMLDivElement | null) => {
      if (element === null) {
        stagedImportPreviewRowElementsByIdRef.current.delete(rowId)
        return
      }
      stagedImportPreviewRowElementsByIdRef.current.set(rowId, element)
    },
    [],
  )

  const resolveStagedImportPreviewOwnerTargetFromRowId = useCallback(
    (rowId: string): ProjectContentOwnerTarget | null => {
      const row = stagedImportPreviewRows.find((candidate) => candidate.rowId === rowId) ?? null
      if (row === null) {
        return null
      }
      if (row.rowKind === 'part') {
        return null
      }
      return row.rowKind === 'assembly'
        ? { kind: 'assembly', assemblyId: row.rowId }
        : row.rowKind === 'component'
          ? { kind: 'component', componentId: row.rowId }
          : { kind: 'object', objectId: row.rowId }
    },
    [stagedImportPreviewRows],
  )

  const buildVisibleStagedImportPreviewRowMetrics = useCallback((): BrowserContentRowMetric[] => {
    return stagedImportPreviewRows
      .flatMap((row) => {
        const element = stagedImportPreviewRowElementsByIdRef.current.get(row.rowId)
        if (element === undefined) {
          return []
        }
        const rect = element.getBoundingClientRect()
        if (rect.height <= 0 || rect.width <= 0) {
          return []
        }
        return [
          {
            rowId: row.rowId,
            depth: row.depth,
            isExpandable: row.isExpandable,
            isExpanded: row.isExpanded,
            rowKind: row.rowKind,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          } satisfies BrowserContentRowMetric,
        ]
      })
      .sort((left, right) => {
        if (left.top !== right.top) {
          return left.top - right.top
        }
        if (left.left !== right.left) {
          return left.left - right.left
        }
        return left.rowId.localeCompare(right.rowId)
      })
  }, [stagedImportPreviewRows])

  const clearSuppressedBrowserRowClick = useCallback((row: BrowserRenderableRowVm) => {
    if (suppressedClickRowIdRef.current === row.rowId) {
      suppressedClickRowIdRef.current = null
    }
  }, [])

  const shouldSuppressBrowserRowClick = useCallback(
    (row: BrowserRenderableRowVm) => suppressedClickRowIdRef.current === row.rowId,
    [],
  )

  const handleActivateGraphTarget = useCallback(
    (
      graphDocumentId: string,
      nodeId: string | null,
      options: {
        strategy?: 'open-or-focus' | 'swap-focused-or-open' | 'open-new'
        fitNodeInViewport?: boolean
        fitCanvasInViewport?: boolean
      } = {},
    ): string | null => {
      return activateGraphTargetIntent(
        workspaceIntentDeps,
        {
          graphDocumentId,
          nodeId,
        },
        {
          strategy: options.strategy ?? 'open-or-focus',
          spawnPosition: newEditorSpawnPosition,
          fitNodeInViewport: options.fitNodeInViewport ?? false,
          fitCanvasInViewport: options.fitCanvasInViewport ?? false,
        },
      ).editorViewportId
    },
    [newEditorSpawnPosition, workspaceIntentDeps],
  )

  const handleCycleBrowserBuildPolicy = useCallback(
    (row: BrowserRenderableRowVm) => {
      const isInherited =
        row.effectiveBrowserBuildPolicySource !== undefined &&
        row.effectiveBrowserBuildPolicySource !== 'self' &&
        row.effectiveBrowserBuildPolicySource !== 'default'
      if (isInherited) {
        return
      }
      if (row.rowKind === 'graph-document') {
        cycleBrowserGraphBuildPolicy(
          row.graphDocumentId,
          row.authoredBrowserBuildPolicy ?? row.effectiveBrowserBuildPolicy ?? 'live',
        )
        return
      }
      if (row.rowKind === 'assembly' || row.rowKind === 'component' || row.rowKind === 'object') {
        cycleBrowserContentBuildPolicy(
          row.rowId,
          row.authoredBrowserBuildPolicy ?? row.effectiveBrowserBuildPolicy ?? 'live',
        )
      }
    },
    [cycleBrowserContentBuildPolicy, cycleBrowserGraphBuildPolicy],
  )

  const closeBrowserOverlays = useCallback(() => {
    setContextMenu(null)
    setImportMenu(null)
  }, [])

  const appendBrowserEntry = useCallback((text: string) => {
    appendConsoleEntry({
      layer: 'Browser',
      text,
      source: 'browser',
      severity: 'info',
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key !== 'Delete') {
        return
      }
      const eventTarget = event.target
      if (
        eventTarget instanceof HTMLElement &&
        (eventTarget.isContentEditable ||
          eventTarget.tagName === 'INPUT' ||
          eventTarget.tagName === 'TEXTAREA' ||
          eventTarget.tagName === 'SELECT')
      ) {
        return
      }
      if (workspaceSelectedTarget?.kind !== 'environment-light') {
        return
      }
      event.preventDefault()
      const target = workspaceSelectedTarget
      const lightLabel =
        useUiPrefsStore
          .getState()
          .view.lighting.lights.find((light) => light.id === target.lightId)?.name ?? target.lightId
      const deletedTarget = deleteWorkspaceSelectedEnvironmentLightWithHistory(
        {
          setWorkspaceSelectedTarget,
          selectLight,
          setActiveSurface,
          requestConsoleContextSync,
          requestConsoleWorkspaceContextHandoff,
          deleteLight,
        },
        target,
        {
          activeSurface: 'browser',
        },
      )
      if (deletedTarget === null) {
        return
      }
      closeBrowserOverlays()
      appendBrowserEntry(`Delete: ${lightLabel}`)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    appendBrowserEntry,
    closeBrowserOverlays,
    deleteLight,
    requestConsoleContextSync,
    requestConsoleWorkspaceContextHandoff,
    selectLight,
    setActiveSurface,
    setWorkspaceSelectedTarget,
    workspaceSelectedTarget,
  ])

  const handleOpenContentImportMenu = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    setContextMenu(null)
    setImportMenu((current) =>
      current === null
        ? {
            x: rect.right - 8,
            y: rect.bottom + 6,
          }
        : null,
    )
  }, [])

  const resolveImportLandingParent = useCallback(
    (): {
      parentAssemblyId: string | null
      parentComponentId: string | null
    } => {
      if (workspaceSelectedTarget?.kind === 'component') {
        return {
          parentAssemblyId: null,
          parentComponentId: workspaceSelectedTarget.componentId,
        }
      }

      if (workspaceSelectedTarget?.kind === 'assembly') {
        return {
          parentAssemblyId: workspaceSelectedTarget.assemblyId,
          parentComponentId: null,
        }
      }

      if (workspaceSelectedTarget?.kind === 'object') {
        const objectRow = projectContent?.objectsById?.[workspaceSelectedTarget.objectId] ?? null
        if (objectRow !== null) {
          if (objectRow.parentAssemblyId != null) {
            return {
              parentAssemblyId: objectRow.parentAssemblyId,
              parentComponentId: null,
            }
          }
          if (objectRow.parentComponentId !== null) {
            return {
              parentAssemblyId: null,
              parentComponentId: objectRow.parentComponentId,
            }
          }
        }
      }

      const fallbackAssemblyRow =
        projectContentRows.find(
          (row): row is Extract<typeof projectContentRows[number], { kind: 'assembly' }> =>
            row.kind === 'assembly' &&
            row.parentAssemblyId == null &&
            row.rowId !== REFERENCE_ROOT_ROW_ID,
        ) ?? null
      return {
        parentAssemblyId: fallbackAssemblyRow?.rowId ?? null,
        parentComponentId: null,
      }
    },
    [projectContent, projectContentRows, workspaceSelectedTarget],
  )

  const handleOpenImportFiles = useCallback(() => {
    setImportMenu(null)
    setStagedImportCommitResult(null)
    setStagedImportColumnWidths(defaultStagedImportColumnWidths)
    openStagedImportDraft(resolveImportLandingParent())
  }, [openStagedImportDraft, resolveImportLandingParent])

  const handleCycleContentBuildPolicy = useCallback(() => {
    const rootAssemblyId = currentProject?.rootAssemblyId ?? null
    if (rootAssemblyId === null) {
      return
    }
    cycleBrowserContentBuildPolicy(
      rootAssemblyId,
      browserContentBuildPolicyByRowId[rootAssemblyId] ?? 'live',
    )
  }, [browserContentBuildPolicyByRowId, currentProject, cycleBrowserContentBuildPolicy])

  const handleImportReferenceFile = useCallback(
    (fileType: ReferenceFileType) => {
      setImportMenu(null)
      const landingParent = resolveImportLandingParent()
      const importPromise =
        fileType === 'obj'
          ? importReferenceFilesFromDisk('obj')
              .then((files) => {
                let lastImportedReferenceId: string | null = null
                for (const file of files) {
                  lastImportedReferenceId = addImportedReference({
                    ...file,
                    ...landingParent,
                  })
                }
                if (lastImportedReferenceId !== null) {
                  setLocalSelectedBrowserRowId(buildImportedReferenceRowId(lastImportedReferenceId))
                }
              })
          : importReferenceFileFromDisk(fileType)
              .then((file) => {
                const referenceId = addImportedReference({
                  ...file,
                  ...landingParent,
                })
                setLocalSelectedBrowserRowId(buildImportedReferenceRowId(referenceId))
              })
      void importPromise
        .catch((error: unknown) => {
          if (error instanceof Error && error.message === 'No reference file selected.') {
            return
          }
          console.error(`Failed to import ${fileType.toUpperCase()} reference file.`, error)
        })
    },
    [addImportedReference, resolveImportLandingParent],
  )

  const handleBrowseImportFiles = useCallback(() => {
    if (stagedImportDraft === null || isBrowsingImportFiles) {
      return
    }

    setStagedImportCommitResult(null)
    setIsBrowsingImportFiles(true)
    void importSupportedReferenceFilesFromDisk()
      .then((files) => {
        appendStagedImportDraftFiles(files)
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.message === 'No reference file selected.') {
          return
        }
        console.error('Failed to stage imported reference files.', error)
      })
      .finally(() => {
        setIsBrowsingImportFiles(false)
      })
  }, [appendStagedImportDraftFiles, isBrowsingImportFiles, stagedImportDraft])

  const resolveStagedDraftFile = useCallback(
    (stagedFileId: string) =>
      stagedImportDraft?.stagedFiles.find((file) => file.stagedFileId === stagedFileId) ?? null,
    [stagedImportDraft],
  )

  const handleSetStagedImportFileMode = useCallback(
    (stagedFileId: string, importMode: StagedImportMode) => {
      const stagedFile = resolveStagedDraftFile(stagedFileId)
      if (stagedFile === null) {
        return
      }
      if (
        importMode === 'multiple-objects-in-component' &&
        !canStagedImportFileUseMultipleObjects(stagedFile)
      ) {
        return
      }
      setStagedImportFileMode(stagedFileId, importMode)
    },
    [resolveStagedDraftFile, setStagedImportFileMode],
  )

  const handleSetStagedImportFileUpAxis = useCallback(
    (stagedFileId: string, upAxis: StagedImportUpAxis) => {
      const stagedFile = resolveStagedDraftFile(stagedFileId)
      if (stagedFile === null) {
        return
      }
      setStagedImportFileUpAxis(stagedFileId, upAxis)
    },
    [resolveStagedDraftFile, setStagedImportFileUpAxis],
  )

  const handleSetStagedImportFileScaleAlignment = useCallback(
    (stagedFileId: string, scaleAlignment: StagedImportScaleAlignment) => {
      const stagedFile = resolveStagedDraftFile(stagedFileId)
      if (stagedFile === null) {
        return
      }
      setStagedImportFileScaleAlignment(stagedFileId, scaleAlignment)
    },
    [resolveStagedDraftFile, setStagedImportFileScaleAlignment],
  )

  const handleSetStagedImportFileScaleMultiplier = useCallback(
    (stagedFileId: string, scaleMultiplier: number) => {
      const stagedFile = resolveStagedDraftFile(stagedFileId)
      if (stagedFile === null) {
        return
      }
      setStagedImportFileScaleMultiplier(stagedFileId, scaleMultiplier)
    },
    [resolveStagedDraftFile, setStagedImportFileScaleMultiplier],
  )

  const handleLoadStagedImportPreview = useCallback(
    (stagedFileId: string, sourceRowId: string | null = null) => {
      const stagedFile = resolveStagedDraftFile(stagedFileId)
      if (stagedFile === null) {
        return
      }
      setStagedImportPreviewSelection({ stagedFileId, sourceRowId })
    },
    [resolveStagedDraftFile],
  )

  const handleRemoveStagedImportFile = useCallback(
    (stagedFileId: string) => {
      const stagedFile = resolveStagedDraftFile(stagedFileId)
      if (stagedFile === null) {
        return
      }
      if (!removeStagedImportDraftFile(stagedFileId)) {
        return
      }
      setStagedImportCommitResult(null)
      if (stagedImportPreviewSelection?.stagedFileId === stagedFileId) {
        setStagedImportPreviewSelection(null)
      }
    },
    [removeStagedImportDraftFile, resolveStagedDraftFile, stagedImportPreviewSelection],
  )

  const handleSelectStagedImportPreviewRow = useCallback(
    (
      row: StagedImportPreviewRowVm,
      modifiers: {
        ctrlKey: boolean
        shiftKey: boolean
      } = { ctrlKey: false, shiftKey: false },
    ) => {
      setStagedImportPreviewRowSelection((current) => {
        const currentSelectedRowIds =
          current.explicitSelectedRowIds.length > 0
            ? current.explicitSelectedRowIds
            : current.selectedRowId !== null
              ? [current.selectedRowId]
              : []

        if (modifiers.shiftKey) {
          const anchorRowId =
            current.selectionAnchorRowId ?? current.selectedRowId ?? row.rowId
          const anchorIndex = stagedImportPreviewRows.findIndex(
            (candidate) => candidate.rowId === anchorRowId,
          )
          const clickedIndex = stagedImportPreviewRows.findIndex(
            (candidate) => candidate.rowId === row.rowId,
          )

          if (anchorIndex !== -1 && clickedIndex !== -1) {
            const explicitSelectedRowIds = stagedImportPreviewRows
              .slice(Math.min(anchorIndex, clickedIndex), Math.max(anchorIndex, clickedIndex) + 1)
              .map((candidate) => candidate.rowId)

            return {
              selectedRowId: row.rowId,
              explicitSelectedRowIds,
              selectionAnchorRowId: anchorRowId,
            }
          }
        }

        if (modifiers.ctrlKey) {
          const isAlreadySelected = currentSelectedRowIds.includes(row.rowId)
          if (!isAlreadySelected) {
            return {
              selectedRowId: row.rowId,
              explicitSelectedRowIds: [...currentSelectedRowIds, row.rowId],
              selectionAnchorRowId: row.rowId,
            }
          }

          const explicitSelectedRowIds = currentSelectedRowIds.filter(
            (rowId) => rowId !== row.rowId,
          )
          const selectedRowId =
            current.selectedRowId !== null &&
            current.selectedRowId !== row.rowId &&
            explicitSelectedRowIds.includes(current.selectedRowId)
              ? current.selectedRowId
              : explicitSelectedRowIds.at(-1) ?? null

          return {
            selectedRowId,
            explicitSelectedRowIds,
            selectionAnchorRowId: row.rowId,
          }
        }

        return {
          selectedRowId: row.rowId,
          explicitSelectedRowIds: [row.rowId],
          selectionAnchorRowId: row.rowId,
        }
      })
    },
    [stagedImportPreviewRows],
  )

  const handleStartStagedImportColumnResize = useCallback(
    (
      divider: 'left-middle' | 'middle-right',
      event: ReactPointerEvent<HTMLButtonElement>,
      dialogWidth: number,
    ) => {
      if (event.button !== 0) {
        return
      }

      const safeDialogWidth = Math.max(dialogWidth, 960)
      const startClientX = event.clientX
      const startWidths = stagedImportColumnWidths

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaPercent = ((moveEvent.clientX - startClientX) / safeDialogWidth) * 100
        const nextWidths =
          divider === 'left-middle'
            ? clampStagedImportColumnWidths(
                {
                  leftPercent: startWidths.leftPercent + deltaPercent,
                  middlePercent: startWidths.middlePercent - deltaPercent,
                  rightPercent: startWidths.rightPercent,
                },
                safeDialogWidth,
              )
            : clampStagedImportColumnWidths(
                {
                  leftPercent: startWidths.leftPercent,
                  middlePercent: startWidths.middlePercent + deltaPercent,
                  rightPercent: startWidths.rightPercent - deltaPercent,
                },
                safeDialogWidth,
              )
        setStagedImportColumnWidths(nextWidths)
      }

      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }

      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      event.preventDefault()
    },
    [stagedImportColumnWidths],
  )

  const handleSetStagedImportPutAcceptedInNewAssembly = useCallback(
    (enabled: boolean) => {
      if (stagedImportDraft === null) {
        return
      }
      setStagedImportPutAcceptedInNewAssembly(enabled)
    },
    [setStagedImportPutAcceptedInNewAssembly, stagedImportDraft],
  )

  const handleCreateStagedImportPreviewAssembly = useCallback(() => {
    createStagedImportPreviewAssembly()
  }, [createStagedImportPreviewAssembly])

  const handleRemoveSelectedPreviewRows = useCallback(() => {
    if (!canRemoveSelectedPreviewRows) {
      return
    }
    if (!removeStagedImportPreviewOwners(selectedStagedImportPreviewRows.map((row) => row.rowId))) {
      return
    }
    setStagedImportPreviewRowSelection({
      selectedRowId: null,
      explicitSelectedRowIds: [],
      selectionAnchorRowId: null,
    })
  }, [
    canRemoveSelectedPreviewRows,
    removeStagedImportPreviewOwners,
    selectedStagedImportPreviewRows,
  ])

  const handleCreateStagedImportPreviewComponent = useCallback(
    (assemblyId: string) => {
      createStagedImportPreviewComponent(assemblyId)
    },
    [createStagedImportPreviewComponent],
  )

  const handleCommitStagedImportDraft = useCallback(() => {
    if (stagedImportDraft === null || stagedImportDraft.stagedFiles.length === 0) {
      return
    }
    const commitResult = commitStagedImportDraftWithHistory()
    if (commitResult === null) {
      return
    }
    setStagedImportCommitResult(commitResult.status === 'success' ? null : commitResult)
    if (commitResult.anchorRowId !== null) {
      setLocalSelectedBrowserRowId(commitResult.anchorRowId)
    }
    if (commitResult.status === 'success') {
      setStagedImportCommitResult(null)
      closeStagedImportDraft()
    }
  }, [closeStagedImportDraft, commitStagedImportDraftWithHistory, stagedImportDraft])

  const handleCloseImportDialog = useCallback(() => {
    setStagedImportCommitResult(null)
    setStagedImportPreviewSelection(null)
    setStagedImportPreviewRowSelection({
      selectedRowId: null,
      explicitSelectedRowIds: [],
      selectionAnchorRowId: null,
    })
    setStagedImportColumnWidths(defaultStagedImportColumnWidths)
    setStagedImportPreviewDragState(null)
    closeStagedImportDraft()
  }, [closeStagedImportDraft])

  useEffect(() => {
    if (stagedImportDraft === null) {
      stagedImportInspectionIdsRef.current.clear()
      setStagedImportCommitResult(null)
      setStagedImportPreviewSelection(null)
      setStagedImportPreviewRowSelection({
        selectedRowId: null,
        explicitSelectedRowIds: [],
        selectionAnchorRowId: null,
      })
      setStagedImportColumnWidths(defaultStagedImportColumnWidths)
      return
    }

    if (
      stagedImportPreviewSelection !== null &&
      !stagedImportDraft.stagedFiles.some(
        (file) => file.stagedFileId === stagedImportPreviewSelection.stagedFileId,
      )
    ) {
      setStagedImportPreviewSelection(null)
    }

    for (const file of stagedImportDraft.stagedFiles) {
      if (
        file.structureInspection.status !== 'idle' ||
        stagedImportInspectionIdsRef.current.has(file.stagedFileId)
      ) {
        continue
      }

      stagedImportInspectionIdsRef.current.add(file.stagedFileId)
      beginStagedImportFileStructureInspection(file.stagedFileId)
      void inspectImportedReferenceFileStructure(file.stagedFileId, file)
        .then((summary) => {
          resolveStagedImportFileStructureInspection(file.stagedFileId, summary)
        })
        .catch((error: unknown) => {
          failStagedImportFileStructureInspection(
            file.stagedFileId,
            error instanceof Error ? error.message : 'Failed to inspect import structure.',
          )
        })
        .finally(() => {
          stagedImportInspectionIdsRef.current.delete(file.stagedFileId)
        })
    }
  }, [
    beginStagedImportFileStructureInspection,
    failStagedImportFileStructureInspection,
    resolveStagedImportFileStructureInspection,
    stagedImportDraft,
    stagedImportPreviewSelection,
  ])

  useEffect(() => {
    if (stagedImportDraft === null) {
      if (isBrowsingImportFiles) {
        setIsBrowsingImportFiles(false)
      }
      if (stagedImportPreviewDragState !== null) {
        setStagedImportPreviewDragState(null)
      }
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key !== 'Escape') {
        return
      }
      closeStagedImportDraft()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    closeStagedImportDraft,
    isBrowsingImportFiles,
    stagedImportDraft,
    stagedImportPreviewDragState,
  ])

  const handleStagedImportPreviewRowPointerDragStartCandidate = useCallback(
    (row: StagedImportPreviewRowVm, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return
      }
      if (event.ctrlKey || event.shiftKey || event.metaKey) {
        return
      }
      const draggedTarget = resolveStagedImportPreviewOwnerTargetFromRowId(row.rowId)
      if (draggedTarget === null) {
        return
      }
      event.stopPropagation()
      setStagedImportPreviewDragState(
        createBrowserContentDragSession({
          draggedRowId: row.rowId,
          draggedTarget,
          pointerId: event.pointerId,
          startPointer: {
            x: event.clientX,
            y: event.clientY,
          },
        }),
      )
    },
    [resolveStagedImportPreviewOwnerTargetFromRowId],
  )

  const getStagedImportPreviewRowDragState = useCallback(
    (row: StagedImportPreviewRowVm) => ({
      draggable: row.rowKind !== 'part',
      isDragging:
        stagedImportPreviewDragState?.draggedRowIds.includes(row.rowId) === true &&
        stagedImportPreviewDragState.phase === 'active',
      isPendingDrag:
        stagedImportPreviewDragState?.draggedRowIds.includes(row.rowId) === true &&
        stagedImportPreviewDragState.phase === 'pending',
      dropIntent:
        stagedImportPreviewDragState?.previewAnchorRowId === row.rowId
          ? stagedImportPreviewDragState.displayIntent
          : stagedImportPreviewDragState?.hoveredRowId === row.rowId &&
              stagedImportPreviewDragState.resolvedIntent === 'invalid'
            ? 'invalid'
            : 'none',
      isDropOwnerSupport:
        stagedImportPreviewDragState?.ownerSupportRowId === row.rowId &&
        stagedImportPreviewDragState.phase === 'active',
    }),
    [stagedImportPreviewDragState],
  )

  useEffect(() => {
    if (stagedImportPreviewDragState === null || stagedImportDraft === null) {
      return
    }

    const resolveDragSessionAtPointer = (
      current: BrowserContentDragSession,
      pointer: BrowserContentPointer,
    ): BrowserContentDragSession =>
      resolveBrowserContentDragPreviewState({
        contentRows: stagedImportPreviewRows,
        rowMetrics: buildVisibleStagedImportPreviewRowMetrics(),
        session: {
          ...current,
          phase: 'active',
        },
        pointer,
        resolveRowTarget: resolveStagedImportPreviewOwnerTargetFromRowId,
        resolveDrop: (sourceTarget, dropTarget) =>
          resolveStagedImportPreviewOwnerDrop(
            stagedImportDraft.previewOrganization,
            sourceTarget,
            dropTarget,
          ),
      })

    const clearDragPreview = () => {
      setStagedImportPreviewDragState(null)
    }

    const commitPointerDrag = (pointer?: BrowserContentPointer) => {
      setStagedImportPreviewDragState((current) => {
        if (current === null) {
          return null
        }
        const resolvedCurrent =
          pointer === undefined
            ? current
            : resolveDragSessionAtPointer(
                current.phase === 'pending'
                  ? {
                      ...current,
                      phase: 'active',
                    }
                  : current,
                pointer,
              )
        if (resolvedCurrent.phase !== 'active') {
          return null
        }
        const resolvedDropTarget = resolvedCurrent.resolvedDropTarget
        if (resolvedDropTarget === null) {
          return null
        }
        let moved = moveStagedImportPreviewOwner(resolvedCurrent.draggedTarget, resolvedDropTarget)
        if (
          moved &&
          resolvedDropTarget.position === 'into' &&
          (resolvedCurrent.resolvedIntent === 'before' ||
            resolvedCurrent.resolvedIntent === 'after') &&
          resolvedCurrent.previewAnchorRowId !== null
        ) {
          const anchorTarget = resolveStagedImportPreviewOwnerTargetFromRowId(
            resolvedCurrent.previewAnchorRowId,
          )
          if (anchorTarget !== null && anchorTarget.kind !== 'imported-reference') {
            moved =
              moveStagedImportPreviewOwner(resolvedCurrent.draggedTarget, {
                ...anchorTarget,
                position: resolvedCurrent.resolvedIntent,
              }) || moved
          }
        }
        return null
      })
    }

    const handlePointerMove = (event: PointerEvent) => {
      setStagedImportPreviewDragState((current) => {
        if (current === null || event.pointerId !== current.pointerId) {
          return current
        }
        const pointer: BrowserContentPointer = {
          x: event.clientX,
          y: event.clientY,
        }
        if (current.phase === 'pending' && !hasBrowserContentDragCrossedThreshold(current, pointer)) {
          return {
            ...current,
            currentPointer: pointer,
          }
        }
        return resolveDragSessionAtPointer(current, pointer)
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        clearDragPreview()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        clearDragPreview()
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (
        stagedImportPreviewDragState !== null &&
        event.pointerId === stagedImportPreviewDragState.pointerId
      ) {
        commitPointerDrag({
          x: event.clientX,
          y: event.clientY,
        })
      }
    }

    const handlePointerCancel = (event: PointerEvent) => {
      if (
        stagedImportPreviewDragState !== null &&
        event.pointerId === stagedImportPreviewDragState.pointerId
      ) {
        clearDragPreview()
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerCancel)
    window.addEventListener('blur', clearDragPreview)
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
      window.removeEventListener('blur', clearDragPreview)
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [
    buildVisibleStagedImportPreviewRowMetrics,
    moveStagedImportPreviewOwner,
    resolveStagedImportPreviewOwnerTargetFromRowId,
    stagedImportDraft,
    stagedImportPreviewDragState,
    stagedImportPreviewRows,
  ])

  useEffect(() => {
    if (contextMenu === null && importMenu === null) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const nextTarget = event.target
      if (contextMenuRef.current?.contains(nextTarget as Node) ?? false) {
        return
      }
      if (importMenuRef.current?.contains(nextTarget as Node) ?? false) {
        return
      }
      setContextMenu(null)
      setImportMenu(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      if (event.key === 'Escape') {
        setContextMenu(null)
        setImportMenu(null)
      }
    }

    const handleWindowChange = () => {
      setContextMenu(null)
      setImportMenu(null)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('blur', handleWindowChange)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('blur', handleWindowChange)
    }
  }, [contextMenu, importMenu])

  useEffect(() => {
    if (contentDragState === null) {
      return
    }

    const resolveDragSessionAtPointer = (
      current: BrowserContentDragSession,
      pointer: BrowserContentPointer,
    ): BrowserContentDragSession =>
      resolveBrowserContentDragPreviewState({
        contentRows: browserTreeRows.contentRows,
        rowMetrics: buildVisibleContentRowMetrics(),
        session: {
          ...current,
          phase: 'active',
        },
        pointer,
        resolveRowTarget: resolveContentOwnerTargetFromRowId,
        resolveDrop: (sourceTarget, dropTarget) =>
          resolveBrowserDraggableTargetDrop(
            { projectContent, referenceWorkspace },
            sourceTarget,
            dropTarget,
          ),
      })

    const clearDragPreview = () => {
      setContentDragState(null)
    }

    const commitPointerDrag = (pointer?: BrowserContentPointer) => {
      setContentDragState((current) => {
        if (current === null) {
          return null
        }
        const resolvedCurrent =
          pointer === undefined
            ? current
            : resolveDragSessionAtPointer(
                current.phase === 'pending'
                  ? {
                      ...current,
                      phase: 'active',
                    }
                  : current,
                pointer,
              )
        if (resolvedCurrent.phase !== 'active') {
          return null
        }
        suppressedClickRowIdRef.current = resolvedCurrent.draggedRowId
        const resolvedDropTarget = resolvedCurrent.resolvedDropTarget
        if (resolvedDropTarget === null) {
          return null
        }
        const draggedTargets =
          resolvedCurrent.draggedTargets.length > 0
            ? resolvedCurrent.draggedTargets
            : [resolvedCurrent.draggedTarget]
        const isGroupedDrag = draggedTargets.length > 1
        const beforeMoveSnapshot = captureProjectContentOrganizationHistorySnapshot()
        let moved = isGroupedDrag
          ? moveProjectContentOwnersBatch(draggedTargets, resolvedDropTarget)
          : moveProjectContentOwner(resolvedCurrent.draggedTarget, resolvedDropTarget)
        if (
          moved &&
          !isGroupedDrag &&
          resolvedDropTarget.position === 'into' &&
          (resolvedCurrent.resolvedIntent === 'before' || resolvedCurrent.resolvedIntent === 'after') &&
          resolvedCurrent.previewAnchorRowId !== null
        ) {
          const anchorTarget = resolveContentOwnerTargetFromRowId(resolvedCurrent.previewAnchorRowId)
          if (anchorTarget !== null && anchorTarget.kind !== 'imported-reference') {
            moved =
              moveProjectContentOwner(resolvedCurrent.draggedTarget, {
                ...anchorTarget,
                position: resolvedCurrent.resolvedIntent,
              }) || moved
          }
        }
        if (moved) {
          if (!isGroupedDrag) {
            const selectedTarget = resolveWorkspaceTargetFromContentOwnerTarget(
              resolvedCurrent.draggedTarget,
            )
            setWorkspaceExplicitSelection({
              selectedTarget,
              explicitSelectedTargets: [selectedTarget],
              selectionAnchorTarget: selectedTarget,
            })
          }
          setLocalSelectedBrowserRowId(resolvedCurrent.draggedRowId)
          requestConsoleContextSync('target-selection')
          const movedRow =
            browserTreeRows.contentRows.find((row) => row.rowId === resolvedCurrent.draggedRowId) ??
            null
          commitProjectContentOrganizationMoveHistory(beforeMoveSnapshot, {
            targetId: resolvedCurrent.draggedRowIds.join(','),
            targetLabel:
              resolvedCurrent.draggedRowIds.length > 1
                ? `${resolvedCurrent.draggedRowIds.length} Browser items`
                : movedRow === null
                  ? resolvedCurrent.draggedRowId
                  : describeBrowserRow(movedRow),
          })
          appendBrowserEntry(
            isGroupedDrag
              ? `Move: ${draggedTargets.length} reference objects`
              : movedRow === null
                ? 'Move'
                : `Move: ${describeBrowserRow(movedRow)}`,
          )
        }
        return null
      })
    }

    const handlePointerMove = (event: PointerEvent) => {
      setContentDragState((current) => {
        if (current === null || event.pointerId !== current.pointerId) {
          return current
        }
        const pointer: BrowserContentPointer = {
          x: event.clientX,
          y: event.clientY,
        }
        if (
          current.phase === 'pending' &&
          !hasBrowserContentDragCrossedThreshold(current, pointer)
        ) {
          return {
            ...current,
            currentPointer: pointer,
          }
        }

        if (current.phase === 'pending') {
          const selectedTarget = resolveWorkspaceTargetFromContentOwnerTarget(current.draggedTarget)
          const explicitSelectedTargets =
            current.draggedTargets.length > 1
              ? current.draggedTargets.map(resolveWorkspaceTargetFromContentOwnerTarget)
              : [selectedTarget]
          setWorkspaceExplicitSelection({
            selectedTarget,
            explicitSelectedTargets,
            selectionAnchorTarget: selectedTarget,
          })
        }

        return resolveDragSessionAtPointer(current, pointer)
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearDragPreview()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        clearDragPreview()
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (contentDragState !== null && event.pointerId === contentDragState.pointerId) {
        commitPointerDrag({
          x: event.clientX,
          y: event.clientY,
        })
      }
    }

    const handlePointerCancel = (event: PointerEvent) => {
      if (contentDragState !== null && event.pointerId === contentDragState.pointerId) {
        clearDragPreview()
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerCancel)
    window.addEventListener('blur', clearDragPreview)
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
      window.removeEventListener('blur', clearDragPreview)
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [
    appendBrowserEntry,
    browserTreeRows.contentRows,
    buildVisibleContentRowMetrics,
    contentDragState,
    captureProjectContentOrganizationHistorySnapshot,
    commitProjectContentOrganizationMoveHistory,
    moveProjectContentOwner,
    moveProjectContentOwnersBatch,
    projectContent,
    referenceWorkspace,
    requestConsoleContextSync,
    resolveContentOwnerTargetFromRowId,
    resolveWorkspaceTargetFromContentOwnerTarget,
    setWorkspaceExplicitSelection,
  ])

  useEffect(() => {
    if (workspaceSelectedTarget?.kind === 'graph-document' || workspaceSelectedTarget?.kind === 'graph-node') {
      setExpandedGraphDocumentIds((currentIds) =>
        currentIds.includes(workspaceSelectedTarget.graphDocumentId)
          ? currentIds
          : [...currentIds, workspaceSelectedTarget.graphDocumentId],
      )
    }
    if (workspaceSelectedTarget?.kind === 'graph-node') {
      const nodesSectionRowId = `graph-section-row:${workspaceSelectedTarget.graphDocumentId}:nodes`
      setGraphSectionExpandedByRowId((current) =>
        current[nodesSectionRowId] === true
          ? current
          : {
              ...current,
              [nodesSectionRowId]: true,
            },
      )
    }
  }, [workspaceSelectedTarget])

  useEffect(() => {
    const referenceControlledRowIds = new Set<string>()
    const referenceCategoryRowIds = referenceWorkspaceTree.categories.map((category) => category.rowId)
    const rootRowIsMounted = mountedReferenceContainerRowIds.has(referenceWorkspaceTree.rowId)

    if (rootRowIsMounted && !referenceWorkspaceTree.isExpanded) {
      referenceControlledRowIds.add(referenceWorkspaceTree.rowId)
    }
    referenceWorkspaceTree.categories.forEach((category) => {
      if (mountedReferenceContainerRowIds.has(category.rowId) && !category.isExpanded) {
        referenceControlledRowIds.add(category.rowId)
      }
    })
    setCollapsedContentRowIds((currentRowIds) => {
      const nextRowIds = [
        ...currentRowIds.filter(
          (rowId) =>
            rowId !== referenceWorkspaceTree.rowId &&
            !referenceCategoryRowIds.includes(rowId),
        ),
        ...referenceControlledRowIds,
      ]
      if (
        nextRowIds.length === currentRowIds.length &&
        nextRowIds.every((rowId, index) => rowId === currentRowIds[index])
      ) {
        return currentRowIds
      }
      return nextRowIds
    })
  }, [mountedReferenceContainerRowIds, referenceWorkspaceTree])

  const browserRowInteractionHandlers = useMemo(
    () =>
      createBrowserRowInteractionHandlers({
        browserTreeRows,
        graphDocumentsById,
        referenceWorkspaceRootRowId: REFERENCE_ROOT_ROW_ID,
        buildProjectSketchBrowserRowId,
        workspaceSelectedTarget,
        workspaceExplicitSelectedTargets,
        workspaceSelectionAnchorTarget,
        workspaceResolvedContentSelection,
        workspaceIntentDeps,
        newEditorSpawnPosition,
        sharedViewerCompositionActive: sharedViewerComposition !== null,
        closeMenus: closeBrowserOverlays,
        setLocalSelectedBrowserRowId,
        setWorkspaceSelectedTarget,
        setWorkspaceExplicitSelection,
        setActiveSurface,
        activeViewerViewportId,
        selectLight,
        selectPart,
        requestConsoleContextSync,
        requestConsoleWorkspaceContextHandoff,
        setActiveEditorViewportId,
        toggleReferenceWorkspaceExpanded,
        toggleReferenceCategoryExpanded,
        toggleReferenceItemVisibility,
        setReferenceItemVisibility,
        toggleReferenceCategoryVisibility,
        toggleSketchVisibility,
        setEnvironmentSourceBackgroundVisible: (visible) =>
          runEnvironmentLookHistoryAction(
            () => setHdriEnvironmentBackgroundVisible(visible),
            {
              targetId: 'environment-source:background',
              targetLabel: 'HDRI background',
            },
          ),
        setEnvironmentLightEnabled: (lightId, enabled) =>
          runEnvironmentLookHistoryAction(
            () => updateLight(lightId, { enabled }),
            {
              targetId: `environment-light:${lightId}`,
              targetLabel: 'Environment light',
            },
          ),
        setPartVisibility,
        setExpandedGraphDocumentIds,
        setGraphSectionExpandedByRowId,
        setCollapsedContentRowIds,
        setViewportLocalViewState,
        appendBrowserEntry,
      }),
    [
      activeViewerViewportId,
      appendBrowserEntry,
      browserTreeRows,
      closeBrowserOverlays,
      graphDocumentsById,
      newEditorSpawnPosition,
      requestConsoleContextSync,
      requestConsoleWorkspaceContextHandoff,
      selectPart,
      selectLight,
      setHdriEnvironmentBackgroundVisible,
      updateLight,
      setActiveEditorViewportId,
      setActiveSurface,
      setPartVisibility,
      setReferenceItemVisibility,
      setViewportLocalViewState,
      setWorkspaceExplicitSelection,
      setWorkspaceSelectedTarget,
      sharedViewerComposition,
      toggleReferenceCategoryExpanded,
      toggleReferenceCategoryVisibility,
      toggleReferenceItemVisibility,
      toggleReferenceWorkspaceExpanded,
      toggleSketchVisibility,
      workspaceExplicitSelectedTargets,
      workspaceIntentDeps,
      workspaceResolvedContentSelection,
      workspaceSelectedTarget,
      workspaceSelectionAnchorTarget,
    ],
  )
  const {
    clearBrowserSelection,
    handleDoubleSelectBrowserRow,
    handleSelectBrowserRow,
    handleToggleBrowserRowExpand,
    handleToggleContentVisibility,
    handleToggleReferenceVisibility,
    handleToggleSketchVisibility,
  } = browserRowInteractionHandlers

  const handleBrowserBodyClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return
      }
      clearBrowserSelection()
      closeBrowserOverlays()
    },
    [clearBrowserSelection, closeBrowserOverlays],
  )

  const handleCreateGraph = useCallback(() => {
    const graphDocumentId = createGraphDocument()
    activateGraphDocumentIntent(workspaceIntentDeps, graphDocumentId, {
      strategy: 'open-or-focus',
      spawnPosition: newEditorSpawnPosition,
    })
  }, [createGraphDocument, newEditorSpawnPosition, workspaceIntentDeps])

  const handleDuplicateFocusedGraph = useCallback(() => {
    const graphDocumentId = duplicateActiveGraphDocument()
    activateGraphDocumentIntent(workspaceIntentDeps, graphDocumentId, {
      strategy: 'open-or-focus',
      spawnPosition: newEditorSpawnPosition,
    })
  }, [duplicateActiveGraphDocument, newEditorSpawnPosition, workspaceIntentDeps])

  const handleOpenNewEditor = useCallback(() => {
    if (activeGraphDocumentId.length === 0 || graphDocumentsById[activeGraphDocumentId] === undefined) {
      return
    }
    const editorViewportId = openGraphDocumentInNewViewport(activeGraphDocumentId)
    if (editorViewportId !== null) {
      setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
    }
  }, [
    activeGraphDocumentId,
    graphDocumentsById,
    newEditorSpawnPosition,
    openGraphDocumentInNewViewport,
    setEditorViewportPosition,
  ])

  const handleLoadGraphFile = useCallback(() => {
    void loadGraphDocumentIntoNewGraphFromFile().catch((error: unknown) => {
      console.error('Failed to load graph into a new graph document.', error)
    })
  }, [loadGraphDocumentIntoNewGraphFromFile])

  const handleRevealGraph = useCallback(
    (graphDocumentId: string) => {
      if (
        selectShouldSuppressBrowserGraphRuntimeOutput(
          {
            currentProject,
            projectContent,
            browserGraphBuildPolicyByGraphDocumentId,
            browserContentBuildPolicyByRowId,
          },
          graphDocumentId,
        )
      ) {
        return
      }
      const visiblePartKeys = [
        ...new Set(
          projectContentRows.flatMap((row) =>
            row.kind === 'object' &&
            row.ownerGraphDocumentId === graphDocumentId &&
            row.isVisible
              ? (row.visibilityPartKeys ?? []).filter((partKey) => partKey.length > 0)
              : [],
          ),
        ),
      ]
      if (visiblePartKeys.length > 0) {
        getViewer()?.frameSelectionSet(visiblePartKeys, [])
        return
      }
      if (sharedViewerComposition !== null) {
        return
      }
      setViewerTargetGraphDocumentId(graphDocumentId)
    },
    [
      browserContentBuildPolicyByRowId,
      browserGraphBuildPolicyByGraphDocumentId,
      currentProject,
      projectContent,
      projectContentRows,
      setViewerTargetGraphDocumentId,
      sharedViewerComposition,
    ],
  )

  const handleRetryImportedReferenceRow = useCallback(
    (referenceId: string) => {
      closeBrowserOverlays()
      appendBrowserEntry(`Retry imported reference ${referenceId}`)
      retryReferenceItemLoad(referenceId)
    },
    [appendBrowserEntry, closeBrowserOverlays, retryReferenceItemLoad],
  )

  const handleRemoveImportedReferenceRow = useCallback(
    (referenceId: string) => {
      closeBrowserOverlays()
      appendBrowserEntry(`Removed imported reference ${referenceId}`)
      removeImportedReference(referenceId)
      setLocalSelectedBrowserRowId((current) =>
        current === buildImportedReferenceRowId(referenceId) ? null : current,
      )
    },
    [appendBrowserEntry, closeBrowserOverlays, removeImportedReference],
  )

  const handleRemoveImportedReferenceRows = useCallback(
    (referenceIds: string[]) => {
      if (referenceIds.length === 0) {
        return
      }
      closeBrowserOverlays()
      referenceIds.forEach((referenceId) => {
        removeImportedReference(referenceId)
      })
      setLocalSelectedBrowserRowId((current) =>
        current !== null &&
        referenceIds.some((referenceId) => buildImportedReferenceRowId(referenceId) === current)
          ? null
          : current,
      )
      requestConsoleContextSync('target-selection')
      appendBrowserEntry(
        referenceIds.length === 1
          ? `Removed imported reference ${referenceIds[0]}`
          : `Removed ${referenceIds.length} imported references`,
      )
    },
    [appendBrowserEntry, closeBrowserOverlays, removeImportedReference, requestConsoleContextSync],
  )

  const canExplodeImportedReferenceRow = useCallback(
    (referenceId: string) => canReferenceItemExplode({ referenceWorkspace }, referenceId),
    [referenceWorkspace],
  )

  const handleExplodeImportedReferenceRow = useCallback(
    (referenceId: string) => {
      closeBrowserOverlays()
      if (!explodeImportedReference(referenceId)) {
        return
      }
      setLocalSelectedBrowserRowId((current) =>
        current === buildImportedReferenceRowId(referenceId) ? null : current,
      )
      requestConsoleContextSync('target-selection')
      appendBrowserEntry(`Exploded imported reference ${referenceId}`)
    },
    [
      appendBrowserEntry,
      closeBrowserOverlays,
      explodeImportedReference,
      requestConsoleContextSync,
    ],
  )

  const getMultiSelectImportedReferenceDeleteAction = useCallback(
    (row: BrowserRenderableRowVm) => {
      if (
        multiSelectImportedReferenceDeleteIds === null ||
        multiSelectImportedReferenceDeleteIds.length <= 1 ||
        !explicitSelectedBrowserRowIds.includes(row.rowId)
      ) {
        return null
      }
      const rowReferenceId =
        row.rowKind === 'reference-item'
          ? row.referenceId
          : row.rowKind === 'object' &&
              (row.contentOriginKind === 'imported-reference' ||
                row.contentOriginKind === 'source-reference') &&
              row.referenceId
            ? row.referenceId
            : null
      if (
        rowReferenceId === null ||
        !multiSelectImportedReferenceDeleteIds.includes(rowReferenceId)
      ) {
        return null
      }
      return {
        referenceIds: multiSelectImportedReferenceDeleteIds,
        ariaLabel: `Remove ${multiSelectImportedReferenceDeleteIds.length} selected reference objects`,
      }
    },
    [explicitSelectedBrowserRowIds, multiSelectImportedReferenceDeleteIds],
  )

  const getMultiSelectVisibilityAction = useCallback(
    (row: BrowserRenderableRowVm) => {
      if (
        workspaceExplicitSelectedTargets.length <= 1 ||
        !explicitSelectedBrowserRowIds.includes(row.rowId)
      ) {
        return null
      }

      const isReferenceSectionRow =
        row.rowKind === 'reference-item' ||
        row.rowId === REFERENCE_ROOT_ROW_ID ||
        (row.rowKind === 'component' && row.referenceCategoryId != null)
      const selectedRows = (
        isReferenceSectionRow ? browserTreeRows.referenceRows : browserTreeRows.contentRows
      ).filter((candidate) => explicitSelectedBrowserRowIds.includes(candidate.rowId))

      if (selectedRows.length <= 1) {
        return null
      }

      const eligibleRows = selectedRows
        .map((candidate) => {
          const partKeys =
            candidate.rowKind === 'assembly' ||
            candidate.rowKind === 'component' ||
            candidate.rowKind === 'object'
              ? [...new Set((candidate.visibilityPartKeys ?? []).filter((partKey) => partKey.length > 0))]
              : []
          const referenceIds =
            candidate.rowKind === 'reference-item'
              ? [candidate.referenceId]
              : candidate.rowKind === 'object' &&
                  (candidate.contentOriginKind === 'imported-reference' ||
                    candidate.contentOriginKind === 'source-reference') &&
                  typeof candidate.referenceId === 'string' &&
                  candidate.referenceId.length > 0
                ? [candidate.referenceId]
                : candidate.rowKind === 'assembly' || candidate.rowKind === 'component'
                  ? [...new Set((candidate.visibilityReferenceIds ?? []).filter((referenceId) => referenceId.length > 0))]
                  : []
          if (partKeys.length === 0 && referenceIds.length === 0) {
            return null
          }
          return {
            rowId: candidate.rowId,
            isVisible: 'isVisible' in candidate ? candidate.isVisible : false,
            partKeys,
            referenceIds,
          }
        })
        .filter((candidate): candidate is {
          rowId: string
          isVisible: boolean
          partKeys: string[]
          referenceIds: string[]
        } => candidate !== null)

      if (
        eligibleRows.length <= 1 ||
        !eligibleRows.some((candidate) => candidate.rowId === row.rowId)
      ) {
        return null
      }

      const allVisible = eligibleRows.every((candidate) => candidate.isVisible)
      const allHidden = eligibleRows.every((candidate) => !candidate.isVisible)
      if (!allVisible && !allHidden) {
        return null
      }

      const nextVisible = allHidden
      const actionLabel = nextVisible ? 'Show' : 'Hide'
      const partKeys = [...new Set(eligibleRows.flatMap((candidate) => candidate.partKeys))]
      const referenceIds = [...new Set(eligibleRows.flatMap((candidate) => candidate.referenceIds))]

      if (partKeys.length === 0 && referenceIds.length === 0) {
        return null
      }

      return {
        id: `selected-rows:visibility:${nextVisible ? 'show' : 'hide'}`,
        label: actionLabel,
        ariaLabel: `${actionLabel} ${eligibleRows.length} selected browser rows`,
        onSelect: () => {
          closeBrowserOverlays()
          setLocalSelectedBrowserRowId(row.rowId)
          appendBrowserEntry(`${actionLabel}: ${eligibleRows.length} selected browser rows`)
          partKeys.forEach((partKey) => {
            setPartVisibility(partKey, nextVisible)
          })
          referenceIds.forEach((referenceId) => {
            setReferenceItemVisibility(referenceId, nextVisible)
          })
        },
      }
    },
    [
      appendBrowserEntry,
      browserTreeRows.contentRows,
      browserTreeRows.referenceRows,
      closeBrowserOverlays,
      explicitSelectedBrowserRowIds,
      setPartVisibility,
      setReferenceItemVisibility,
      setLocalSelectedBrowserRowId,
      workspaceExplicitSelectedTargets.length,
    ],
  )

  const handleTransformReferenceRow = useCallback(
    (referenceId: string) => {
      const objectRowId = buildImportedReferenceRowId(referenceId)
      setLocalSelectedBrowserRowId(objectRowId)
      closeBrowserOverlays()
      appendBrowserEntry(`Transform ${referenceId}`)
      setReferenceItemVisibility(referenceId, true)
      activateObjectIntent(workspaceIntentDeps, objectRowId)
      beginReferenceTransformShell(referenceId)
    },
    [
      appendBrowserEntry,
      beginReferenceTransformShell,
      closeBrowserOverlays,
      setReferenceItemVisibility,
      workspaceIntentDeps,
    ],
  )

  const promptForContentOwnerRename = useCallback(
    (
      target:
        | { kind: 'assembly'; assemblyId: string }
        | { kind: 'component'; componentId: string },
    ) => {
      const appState = useAppStore.getState()
      const currentLabel =
        target.kind === 'assembly'
          ? appState.projectContent.assembliesById[target.assemblyId]?.label ?? 'Assembly'
          : appState.projectContent.componentsById[target.componentId]?.label ?? 'Component'
      const nextLabel =
        typeof window.prompt === 'function'
          ? window.prompt(
              `Rename ${target.kind === 'assembly' ? 'assembly' : 'component'}`,
              currentLabel,
            )
          : currentLabel
      if (nextLabel === null) {
        return
      }
      const trimmed = nextLabel.trim()
      if (trimmed.length === 0 || trimmed === currentLabel) {
        return
      }
      if (!renameProjectContentOwner(target, trimmed)) {
        return
      }
      appendBrowserEntry(
        `Rename: ${target.kind === 'assembly' ? 'Assembly' : 'Component'} ${currentLabel} -> ${trimmed}`,
      )
      requestConsoleContextSync('target-selection')
    },
    [
      appendBrowserEntry,
      renameProjectContentOwner,
      requestConsoleContextSync,
    ],
  )

  const handleCreateAssembly = useCallback(() => {
    closeBrowserOverlays()
    const assemblyId = createProjectAssembly()
    setLocalSelectedBrowserRowId(assemblyId)
    requestConsoleContextSync('target-selection')
    promptForContentOwnerRename({ kind: 'assembly', assemblyId })
  }, [
    closeBrowserOverlays,
    createProjectAssembly,
    promptForContentOwnerRename,
    requestConsoleContextSync,
  ])

  const handleCreateComponent = useCallback(
    (assemblyId: string) => {
      closeBrowserOverlays()
      const componentId = createProjectComponent(assemblyId)
      if (componentId === null) {
        return
      }
      setLocalSelectedBrowserRowId(componentId)
      requestConsoleContextSync('target-selection')
      promptForContentOwnerRename({ kind: 'component', componentId })
    },
    [
      closeBrowserOverlays,
      createProjectComponent,
      promptForContentOwnerRename,
      requestConsoleContextSync,
    ],
  )

  const handleDeleteContentOwner = useCallback(
    (
      target:
        | { kind: 'assembly'; assemblyId: string }
        | { kind: 'component'; componentId: string },
    ) => {
      const appState = useAppStore.getState()
      const label =
        target.kind === 'assembly'
          ? appState.projectContent.assembliesById[target.assemblyId]?.label ?? target.assemblyId
          : appState.projectContent.componentsById[target.componentId]?.label ?? target.componentId
      const childCount =
        target.kind === 'assembly'
          ? appState.projectContent.assembliesById[target.assemblyId]?.childRowIds.length ?? 0
          : appState.projectContent.componentsById[target.componentId]?.childObjectIds.length ?? 0
      if (
        childCount > 0 &&
        typeof window.confirm === 'function' &&
        !window.confirm(`Delete ${label} and its subtree?`)
      ) {
        return
      }
      if (!deleteProjectContentOwner(target)) {
        return
      }
      closeBrowserOverlays()
      setLocalSelectedBrowserRowId(null)
      requestConsoleContextSync('target-selection')
      appendBrowserEntry(`Delete: ${label}`)
    },
    [appendBrowserEntry, closeBrowserOverlays, deleteProjectContentOwner, requestConsoleContextSync],
  )

  const handleRowAction = useCallback(
    (row: BrowserRenderableRowVm, action: BrowserTreeRowActionVm) => {
      closeBrowserOverlays()
      appendBrowserEntry(`${action.label}: ${describeBrowserRow(row)}`)
      runBrowserRowAction(row, action, {
        sharedViewerCompositionActive: sharedViewerComposition !== null,
        onSaveGraph: (cachedGraphId) => {
          void saveCachedGraphEntryToFile(cachedGraphId).catch((error: unknown) => {
            console.error(`Failed to save cached graph "${cachedGraphId}".`, error)
          })
        },
        onExportGraphStep: (graphDocumentId) => {
          requestGraphDocumentStepExport(graphDocumentId)
        },
        onActivateGraphTarget: handleActivateGraphTarget,
        onTransformReference: handleTransformReferenceRow,
        onRevealGraph: handleRevealGraph,
        onFocusViewport: (editorViewportId) => {
          setActiveEditorViewportId(editorViewportId)
        },
        onCloseViewport: closeEditorViewport,
      })
    },
    [
      appendBrowserEntry,
      closeBrowserOverlays,
      closeEditorViewport,
      handleActivateGraphTarget,
      handleRevealGraph,
      handleTransformReferenceRow,
      requestGraphDocumentStepExport,
      saveCachedGraphEntryToFile,
      setActiveEditorViewportId,
      sharedViewerComposition,
    ],
  )

  const createRowContextMenuItems = useCallback(
    (row: BrowserRenderableRowVm) =>
      buildBrowserContextMenuItems(row, {
        handleRowAction,
        closeMenus: closeBrowserOverlays,
        selectRow: (rowId) => setLocalSelectedBrowserRowId(rowId),
        appendBrowserEntry,
        createAssembly: handleCreateAssembly,
        createComponent: handleCreateComponent,
        renameContentOwner: promptForContentOwnerRename,
        deleteContentOwner: handleDeleteContentOwner,
        canDeleteAssembly: (assemblyId) =>
          projectContent?.assembliesById[assemblyId]?.assemblySourceKind === 'authored',
        canRenameComponent: (componentId) =>
          projectContent?.componentsById[componentId]?.componentSourceKind === 'authored',
        canDeleteComponent: (componentId) =>
          projectContent?.componentsById[componentId]?.componentSourceKind === 'authored',
        startReferenceLoadBatchForAll,
        startReferenceLoadBatchForCategory,
        retryReferenceItemLoad,
        setReferenceItemVisibility,
        setPartVisibility,
        canExplodeImportedReferenceRow,
        handleExplodeImportedReferenceRow,
        handleRetryImportedReferenceRow,
        handleRemoveImportedReferenceRow,
        handleRemoveImportedReferenceRows,
        getMultiSelectImportedReferenceDeleteAction,
        getMultiSelectVisibilityAction,
        setBrowserGraphBuildPolicy,
        setBrowserContentBuildPolicy,
        clearBrowserGraphBuildPolicy,
        clearBrowserContentBuildPolicy,
      }),
    [
      appendBrowserEntry,
      clearBrowserContentBuildPolicy,
      clearBrowserGraphBuildPolicy,
      canExplodeImportedReferenceRow,
      closeBrowserOverlays,
      createProjectAssembly,
      createProjectComponent,
      explodeImportedReference,
      handleExplodeImportedReferenceRow,
      handleRemoveImportedReferenceRow,
      handleRetryImportedReferenceRow,
      handleRowAction,
      handleCreateAssembly,
      handleCreateComponent,
      handleDeleteContentOwner,
      handleRemoveImportedReferenceRows,
      promptForContentOwnerRename,
      projectContent,
      retryReferenceItemLoad,
      setBrowserContentBuildPolicy,
      setBrowserGraphBuildPolicy,
      setPartVisibility,
      setReferenceItemVisibility,
      startReferenceLoadBatchForAll,
      startReferenceLoadBatchForCategory,
      getMultiSelectImportedReferenceDeleteAction,
      getMultiSelectVisibilityAction,
    ],
  )

  const handleRowContextMenu = useCallback(
    (row: BrowserRenderableRowVm, event: ReactMouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      event.preventDefault()
      setLocalSelectedBrowserRowId(row.rowId)
      setImportMenu(null)
      const actions = createRowContextMenuItems(row)
      if (actions.length === 0) {
        setContextMenu(null)
        return
      }
      setContextMenu({
        row,
        x: event.clientX,
        y: event.clientY,
        actions,
        source: 'row',
      })
    },
    [createRowContextMenuItems],
  )

  const handleBrowserRowPointerDragStartCandidate = useCallback(
    (row: BrowserRenderableRowVm, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return
      }
      if (!isDraggableContentOwnerRow(row)) {
        return
      }
      const draggedTarget = resolveBrowserDraggableTargetFromRow(row)
      if (draggedTarget === null) {
        return
      }
      const groupedDragSelection =
        groupedImportedReferenceDragSelection !== null &&
        groupedImportedReferenceDragSelection.rowIds.includes(row.rowId)
          ? groupedImportedReferenceDragSelection
          : null
      event.stopPropagation()
      closeBrowserOverlays()
      setContentDragState(
        createBrowserContentDragSession({
          draggedRowId: row.rowId,
          draggedRowIds: groupedDragSelection?.rowIds,
          draggedTarget,
          draggedTargets: groupedDragSelection?.draggedTargets,
          pointerId: event.pointerId,
          startPointer: {
            x: event.clientX,
            y: event.clientY,
          },
        }),
      )
    },
    [
      closeBrowserOverlays,
      groupedImportedReferenceDragSelection,
      isDraggableContentOwnerRow,
      resolveBrowserDraggableTargetFromRow,
    ],
  )

  const resolveBrowserRowDragState = useCallback(
    (row: BrowserRenderableRowVm) => ({
      draggable: isDraggableContentOwnerRow(row),
      isDragging:
        contentDragState?.draggedRowIds.includes(row.rowId) === true &&
        contentDragState.phase === 'active',
      isPendingDrag:
        contentDragState?.draggedRowIds.includes(row.rowId) === true &&
        contentDragState.phase === 'pending',
      dropIntent:
        contentDragState?.previewAnchorRowId === row.rowId
          ? contentDragState.displayIntent
          : contentDragState?.hoveredRowId === row.rowId &&
              contentDragState.resolvedIntent === 'invalid'
            ? 'invalid'
            : ('none' as const),
      isDropOwnerSupport:
        contentDragState?.ownerSupportRowId === row.rowId &&
        contentDragState.phase === 'active',
    }),
    [contentDragState, isDraggableContentOwnerRow],
  )

  const rowHandlers = useMemo<BrowserTreeRowHandlers>(
    () => ({
      onSelect: handleSelectBrowserRow,
      onToggleContentVisibility: handleToggleContentVisibility,
      onToggleReferenceVisibility: handleToggleReferenceVisibility,
      onToggleSketchVisibility: handleToggleSketchVisibility,
      onDoubleSelect: handleDoubleSelectBrowserRow,
      onToggleExpand: handleToggleBrowserRowExpand,
      onCycleBrowserBuildPolicy: handleCycleBrowserBuildPolicy,
      onContextMenu: handleRowContextMenu,
      onPointerDragStartCandidate: handleBrowserRowPointerDragStartCandidate,
      shouldSuppressClick: shouldSuppressBrowserRowClick,
      clearSuppressedClick: clearSuppressedBrowserRowClick,
      getDragState: resolveBrowserRowDragState,
    }),
    [
      clearSuppressedBrowserRowClick,
      handleCycleBrowserBuildPolicy,
      handleBrowserRowPointerDragStartCandidate,
      handleDoubleSelectBrowserRow,
      handleRowContextMenu,
      handleSelectBrowserRow,
      handleToggleBrowserRowExpand,
      handleToggleContentVisibility,
      handleToggleReferenceVisibility,
      handleToggleSketchVisibility,
      resolveBrowserRowDragState,
      shouldSuppressBrowserRowClick,
    ],
  )

  const contextMenuStyle =
    contextMenu === null
      ? undefined
      : {
          left: `${Math.max(
            12,
            Math.min(
              contextMenu.x,
              (typeof window === 'undefined' ? contextMenu.x : window.innerWidth) - 220,
            ),
          )}px`,
          top: `${Math.max(
            12,
            Math.min(
              contextMenu.y,
              (typeof window === 'undefined' ? contextMenu.y : window.innerHeight) - 260,
            ),
          )}px`,
        }

  const importMenuStyle =
    importMenu === null
      ? undefined
      : {
          left: `${Math.max(
            12,
            Math.min(
              importMenu.x,
              (typeof window === 'undefined' ? importMenu.x : window.innerWidth) - 220,
            ),
          )}px`,
          top: `${Math.max(
            12,
            Math.min(
              importMenu.y,
              (typeof window === 'undefined' ? importMenu.y : window.innerHeight) - 220,
            ),
          )}px`,
        }

  const handleActivateBrowserSurface = useCallback(() => {
    setActiveSurface('browser')
  }, [setActiveSurface])

  return {
    browserTreeRows,
    canOpenNewEditor:
      activeGraphDocumentId.length > 0 && graphDocumentsById[activeGraphDocumentId] !== undefined,
    rowHandlers,
    sectionHandlers: {
      contentBuildPolicy: contentRootBuildPolicy,
      onCycleContentBuildPolicy: handleCycleContentBuildPolicy,
      onOpenContentImportMenu: handleOpenContentImportMenu,
      registerContentRowElement,
      onCreateGraph: handleCreateGraph,
      onDuplicateFocusedGraph: handleDuplicateFocusedGraph,
      onLoadGraphFile: handleLoadGraphFile,
      onOpenNewEditor: handleOpenNewEditor,
    },
    overlay: {
      contextMenu,
      contextMenuRef,
      contextMenuStyle,
      importMenu,
      importMenuRef,
      importMenuStyle,
      stagedImportDraft,
      stagedImportCommitResult,
      stagedImportPreviewSelection,
      stagedImportColumnWidths,
      stagedImportPreviewRows,
      stagedImportPreviewSelectedRowId: stagedImportPreviewRowSelection.selectedRowId,
      stagedImportPreviewSelectedRowIds: stagedImportPreviewRowSelection.explicitSelectedRowIds,
      isBrowsingImportFiles,
      onOpenImportFiles: handleOpenImportFiles,
      onBrowseImportFiles: handleBrowseImportFiles,
      onSetStagedImportFileMode: handleSetStagedImportFileMode,
      onSetStagedImportFileUpAxis: handleSetStagedImportFileUpAxis,
      onSetStagedImportFileScaleAlignment: handleSetStagedImportFileScaleAlignment,
      onSetStagedImportFileScaleMultiplier: handleSetStagedImportFileScaleMultiplier,
      onRemoveStagedImportFile: handleRemoveStagedImportFile,
      onLoadStagedImportPreview: handleLoadStagedImportPreview,
      onSelectStagedImportPreviewRow: handleSelectStagedImportPreviewRow,
      onStartStagedImportColumnResize: handleStartStagedImportColumnResize,
      onSetStagedImportPutAcceptedInNewAssembly: handleSetStagedImportPutAcceptedInNewAssembly,
      onCreateStagedImportPreviewAssembly: handleCreateStagedImportPreviewAssembly,
      canRemoveSelectedPreviewRows,
      onRemoveSelectedPreviewRows: handleRemoveSelectedPreviewRows,
      onCreateStagedImportPreviewComponent: handleCreateStagedImportPreviewComponent,
      registerStagedImportPreviewRowElement,
      onStagedImportPreviewRowPointerDown: handleStagedImportPreviewRowPointerDragStartCandidate,
      getStagedImportPreviewRowDragState,
      onCommitStagedImportDraft: handleCommitStagedImportDraft,
      onCloseImportDialog: handleCloseImportDialog,
      onImportReferenceFile: handleImportReferenceFile,
    },
    bodyHandlers: {
      onBrowserBodyClick: handleBrowserBodyClick,
      onActivateBrowserSurface: handleActivateBrowserSurface,
      closeBrowserOverlays,
    },
  }
}
