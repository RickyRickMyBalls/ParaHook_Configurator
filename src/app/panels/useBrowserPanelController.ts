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
import { importReferenceFileFromDisk } from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
import { getViewer } from '../viewerBridge'
import {
  defaultViewportPosition,
  selectSharedViewerComposition,
  selectSharedViewerCompositionGraphDocumentIds,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import {
  buildImportedReferenceRowId,
  buildProjectSketchBrowserRowId,
  REFERENCE_ROOT_ROW_ID,
  resolveBrowserDraggableTargetDrop,
  selectCurrentProjectContentBrowserRows,
  selectReferenceWorkspaceBrowserTree,
  selectShouldSuppressBrowserGraphRuntimeOutput,
  type BrowserDraggableTarget,
  type ProjectContentOwnerTarget,
  type WorkspaceSelectedTarget,
  useAppStore,
} from '../store/useAppStore'
import type { BrowserBuildPolicy } from '../store/useAppStore'
import {
  activateGraphDocumentIntent,
  activateGraphNodeIntent,
  activateObjectIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
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
    onImportReferenceFile: (fileType: ReferenceFileType) => void
  }
  bodyHandlers: {
    onBrowserBodyClick: (event: ReactMouseEvent<HTMLDivElement>) => void
    onActivateBrowserSurface: () => void
    closeBrowserOverlays: () => void
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
  const requestEditorViewportNodeFit = useSpaghettiStore(
    (state) => state.requestEditorViewportNodeFit,
  )
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const sharedViewerCompositionGraphDocumentIds = useSpaghettiStore(
    selectSharedViewerCompositionGraphDocumentIds,
  )
  const currentProject = useAppStore((state) => state.currentProject)
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
  const addImportedReference = useAppStore((state) => state.addImportedReference)
  const retryReferenceItemLoad = useAppStore((state) => state.retryReferenceItemLoad)
  const startReferenceLoadBatchForAll = useAppStore((state) => state.startReferenceLoadBatchForAll)
  const startReferenceLoadBatchForCategory = useAppStore(
    (state) => state.startReferenceLoadBatchForCategory,
  )
  const removeImportedReference = useAppStore((state) => state.removeImportedReference)
  const createProjectAssembly = useAppStore((state) => state.createProjectAssembly)
  const createProjectComponent = useAppStore((state) => state.createProjectComponent)
  const moveProjectContentOwner = useAppStore((state) => state.moveProjectContentOwner)
  const renameProjectContentOwner = useAppStore((state) => state.renameProjectContentOwner)
  const deleteProjectContentOwner = useAppStore((state) => state.deleteProjectContentOwner)
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
  const contextMenuRef = useRef<HTMLDivElement | null>(null)
  const importMenuRef = useRef<HTMLDivElement | null>(null)
  const contentRowElementsByIdRef = useRef(new Map<string, HTMLDivElement>())
  const suppressedClickRowIdRef = useRef<string | null>(null)

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

  const browserTreeRows = useMemo(
    () =>
      selectBrowserTreeRows({
        referenceLoadBatch: referenceWorkspace.referenceLoadBatch,
        activeTransformReferenceId,
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

  const clearSuppressedBrowserRowClick = useCallback((row: BrowserRenderableRowVm) => {
    if (suppressedClickRowIdRef.current === row.rowId) {
      suppressedClickRowIdRef.current = null
    }
  }, [])

  const shouldSuppressBrowserRowClick = useCallback(
    (row: BrowserRenderableRowVm) => suppressedClickRowIdRef.current === row.rowId,
    [],
  )

  const handleOpenOrFocusGraph = useCallback(
    (graphDocumentId: string): string | null =>
      activateGraphDocumentIntent(workspaceIntentDeps, graphDocumentId, {
        strategy: 'open-or-focus',
        spawnPosition: newEditorSpawnPosition,
      }).editorViewportId,
    [newEditorSpawnPosition, workspaceIntentDeps],
  )

  const handleActivateGraphTarget = useCallback(
    (
      graphDocumentId: string,
      nodeId: string | null,
      options: {
        strategy?: 'open-or-focus' | 'swap-focused-or-open'
        fitNodeInViewport?: boolean
      } = {},
    ): string | null => {
      if (nodeId === null) {
        return activateGraphDocumentIntent(workspaceIntentDeps, graphDocumentId, {
          strategy: options.strategy ?? 'open-or-focus',
          spawnPosition: newEditorSpawnPosition,
        }).editorViewportId
      }
      return activateGraphNodeIntent(workspaceIntentDeps, graphDocumentId, nodeId, {
        strategy: options.strategy ?? 'open-or-focus',
        spawnPosition: newEditorSpawnPosition,
        fitNodeInViewport: options.fitNodeInViewport ?? false,
      }).editorViewportId
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
      const resolveImportLandingParent = (): {
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
                parentAssemblyId: objectRow.parentAssemblyId ?? null,
                parentComponentId: null,
              }
            }
            if (objectRow.parentComponentId !== null) {
              const parentComponent =
                projectContent?.componentsById?.[objectRow.parentComponentId] ?? null
              if (parentComponent?.parentAssemblyId != null) {
                return {
                  parentAssemblyId: parentComponent.parentAssemblyId,
                  parentComponentId: null,
                }
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
      }

      setImportMenu(null)
      void importReferenceFileFromDisk(fileType)
        .then((file) => {
          const referenceId = addImportedReference({
            ...file,
            ...resolveImportLandingParent(),
          })
          setLocalSelectedBrowserRowId(buildImportedReferenceRowId(referenceId))
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.message === 'No reference file selected.') {
            return
          }
          console.error(`Failed to import ${fileType.toUpperCase()} reference file.`, error)
        })
    },
    [addImportedReference, projectContent, projectContentRows, workspaceSelectedTarget],
  )

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
        let moved = moveProjectContentOwner(resolvedCurrent.draggedTarget, resolvedDropTarget)
        if (
          moved &&
          resolvedDropTarget.position === 'into' &&
          (resolvedCurrent.resolvedIntent === 'before' || resolvedCurrent.resolvedIntent === 'after') &&
          resolvedCurrent.previewAnchorRowId !== null
        ) {
          const anchorTarget = resolveContentOwnerTargetFromRowId(resolvedCurrent.previewAnchorRowId)
          if (
            anchorTarget !== null &&
            anchorTarget.kind !== 'imported-reference'
          ) {
            moved =
              moveProjectContentOwner(resolvedCurrent.draggedTarget, {
                ...anchorTarget,
                position: resolvedCurrent.resolvedIntent,
              }) || moved
          }
        }
        if (moved) {
          setLocalSelectedBrowserRowId(resolvedCurrent.draggedRowId)
          requestConsoleContextSync('target-selection')
          const movedRow =
            browserTreeRows.contentRows.find((row) => row.rowId === resolvedCurrent.draggedRowId) ?? null
          appendBrowserEntry(
            movedRow === null ? 'Move' : `Move: ${describeBrowserRow(movedRow)}`,
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
          setWorkspaceExplicitSelection({
            selectedTarget,
            explicitSelectedTargets: [selectedTarget],
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
    moveProjectContentOwner,
    projectContent,
    referenceWorkspace,
    requestConsoleContextSync,
    resolveContentOwnerTargetFromRowId,
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
    if (!referenceWorkspaceTree.isExpanded) {
      referenceControlledRowIds.add(referenceWorkspaceTree.rowId)
    }
    referenceWorkspaceTree.categories.forEach((category) => {
      if (!category.isExpanded) {
        referenceControlledRowIds.add(category.rowId)
      }
    })
    setCollapsedContentRowIds((currentRowIds) => {
      const nextRowIds = [
        ...currentRowIds.filter(
          (rowId) =>
            rowId !== referenceWorkspaceTree.rowId &&
            !referenceWorkspaceTree.categories.some((category) => category.rowId === rowId),
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
  }, [referenceWorkspaceTree])

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
        workspaceIntentDeps,
        newEditorSpawnPosition,
        sharedViewerCompositionActive: sharedViewerComposition !== null,
        closeMenus: closeBrowserOverlays,
        setLocalSelectedBrowserRowId,
        setWorkspaceSelectedTarget,
        setWorkspaceExplicitSelection,
        setActiveSurface,
        selectPart,
        requestConsoleContextSync,
        requestConsoleWorkspaceContextHandoff,
        setActiveEditorViewportId,
        toggleReferenceWorkspaceExpanded,
        toggleReferenceCategoryExpanded,
        toggleReferenceItemVisibility,
        toggleReferenceCategoryVisibility,
        toggleSketchVisibility,
        setPartVisibility,
        setExpandedGraphDocumentIds,
        setGraphSectionExpandedByRowId,
        setCollapsedContentRowIds,
        appendBrowserEntry,
      }),
    [
      appendBrowserEntry,
      browserTreeRows,
      closeBrowserOverlays,
      graphDocumentsById,
      newEditorSpawnPosition,
      requestConsoleContextSync,
      requestConsoleWorkspaceContextHandoff,
      selectPart,
      setActiveEditorViewportId,
      setActiveSurface,
      setPartVisibility,
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

  const handleViewInGraph = useCallback(
    (graphDocumentId: string, nodeId: string | null) => {
      handleActivateGraphTarget(graphDocumentId, nodeId, {
        fitNodeInViewport: nodeId !== null,
      })
    },
    [handleActivateGraphTarget],
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
        onOpenGraph: handleOpenOrFocusGraph,
        onTransformReference: handleTransformReferenceRow,
        onViewInGraph: handleViewInGraph,
        onOpenGraphInNewViewport: (graphDocumentId) => {
          const editorViewportId = openGraphDocumentInNewViewport(graphDocumentId)
          if (editorViewportId !== null) {
            setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
          }
        },
        onSwapFocusedEditorViewportToGraphDocument: (graphDocumentId) => {
          const viewportId = swapFocusedEditorViewportToGraphDocument(graphDocumentId)
          void viewportId
        },
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
      handleOpenOrFocusGraph,
      handleRevealGraph,
      handleTransformReferenceRow,
      handleViewInGraph,
      newEditorSpawnPosition,
      openGraphDocumentInNewViewport,
      saveCachedGraphEntryToFile,
      setActiveEditorViewportId,
      setEditorViewportPosition,
      sharedViewerComposition,
      swapFocusedEditorViewportToGraphDocument,
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
        handleRetryImportedReferenceRow,
        handleRemoveImportedReferenceRow,
        setBrowserGraphBuildPolicy,
        setBrowserContentBuildPolicy,
        clearBrowserGraphBuildPolicy,
        clearBrowserContentBuildPolicy,
      }),
    [
      appendBrowserEntry,
      clearBrowserContentBuildPolicy,
      clearBrowserGraphBuildPolicy,
      closeBrowserOverlays,
      createProjectAssembly,
      createProjectComponent,
      handleRemoveImportedReferenceRow,
      handleRetryImportedReferenceRow,
      handleRowAction,
      handleCreateAssembly,
      handleCreateComponent,
      handleDeleteContentOwner,
      promptForContentOwnerRename,
      projectContent,
      retryReferenceItemLoad,
      setBrowserContentBuildPolicy,
      setBrowserGraphBuildPolicy,
      setReferenceItemVisibility,
      startReferenceLoadBatchForAll,
      startReferenceLoadBatchForCategory,
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
      event.stopPropagation()
      closeBrowserOverlays()
      setContentDragState(
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
    [
      closeBrowserOverlays,
      isDraggableContentOwnerRow,
      resolveBrowserDraggableTargetFromRow,
    ],
  )

  const resolveBrowserRowDragState = useCallback(
    (row: BrowserRenderableRowVm) => ({
      draggable: isDraggableContentOwnerRow(row),
      isDragging:
        contentDragState?.draggedRowId === row.rowId && contentDragState.phase === 'active',
      isPendingDrag:
        contentDragState?.draggedRowId === row.rowId && contentDragState.phase === 'pending',
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
      onImportReferenceFile: handleImportReferenceFile,
    },
    bodyHandlers: {
      onBrowserBodyClick: handleBrowserBodyClick,
      onActivateBrowserSurface: handleActivateBrowserSurface,
      closeBrowserOverlays,
    },
  }
}
