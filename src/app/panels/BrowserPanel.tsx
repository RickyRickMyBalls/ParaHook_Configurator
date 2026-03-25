import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { importReferenceFileFromDisk } from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
import {
  defaultViewportPosition,
  selectSharedViewerComposition,
  selectSharedViewerCompositionGraphDocumentIds,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import {
  buildProjectSketchBrowserRowId,
  selectCurrentProjectContentBrowserRows,
  selectShouldSuppressBrowserGraphRuntimeOutput,
  selectReferenceWorkspaceBrowserTree,
  type WorkspaceSelectedTarget,
  useAppStore,
} from '../store/useAppStore'
import {
  activateGraphDocumentIntent,
  activateGraphNodeIntent,
  activateReferenceItemIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
import { selectBrowserGraphRows } from './selectBrowserGraphRows'
import { runBrowserRowAction } from './browserRowActions'
import { buildBrowserContextMenuItems } from './browserContextMenu'
import {
  createBrowserRowInteractionHandlers,
  resolveBrowserSelectedRowIdFromTarget,
} from './browserInteractions'
import { describeBrowserRow } from './browserRowFamilies'
import {
  type BrowserRenderableRowVm,
  type BrowserTreeRowActionVm,
  selectBrowserTreeRows,
} from './selectBrowserTreeRows'
import {
  BrowserContentSection,
  BrowserGraphDocumentsSection,
  BrowserOpenEditorsSection,
} from './browserTreeSections'
import {
  BrowserImportMenu,
  BrowserRowContextMenu,
  type BrowserImportMenuState,
  type BrowserRowContextMenuState,
} from './browserTreeMenus'
import { appendConsoleEntry } from '../console/useConsoleStore'

type BrowserPanelProps = {
  isCollapsed?: boolean
  onToggleCollapsed?: () => void
  isFloating?: boolean
  onTogglePopout?: () => void
  onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void
  newEditorSpawnPosition?: { x: number; y: number }
}

export function BrowserPanel({
  isCollapsed: controlledIsCollapsed,
  onToggleCollapsed,
  isFloating = false,
  onTogglePopout,
  onTitleBarPointerDown,
  newEditorSpawnPosition = defaultViewportPosition,
}: BrowserPanelProps = {}) {
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
  const browserGraphBuildPolicyByGraphDocumentId = useAppStore((state) => state.browserGraphBuildPolicyByGraphDocumentId)
  const browserContentBuildPolicyByRowId = useAppStore((state) => state.browserContentBuildPolicyByRowId)
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
  const beginReferenceTransform = useAppStore((state) => state.beginReferenceTransform)
  const setWorkspaceSelectedTarget = useAppStore((state) => state.setWorkspaceSelectedTarget)
  const setWorkspaceExplicitSelection = useAppStore((state) => state.setWorkspaceExplicitSelection)
  const setActiveSurface = useAppStore((state) => state.setActiveSurface)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const requestFloatingShellActivation = useAppStore(
    (state) => state.requestFloatingShellActivation,
  )
  const activeTransformReferenceId = useAppStore(
    (state) => state.referenceWorkspace.activeTransformReferenceId,
  )
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const [expandedGraphDocumentIds, setExpandedGraphDocumentIds] = useState<string[]>([])
  const [graphSectionExpandedByRowId, setGraphSectionExpandedByRowId] = useState<
    Record<string, boolean>
  >({})
  const [collapsedContentRowIds, setCollapsedContentRowIds] = useState<string[]>([])
  const [localSelectedBrowserRowId, setLocalSelectedBrowserRowId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<BrowserRowContextMenuState | null>(null)
  const [importMenu, setImportMenu] = useState<BrowserImportMenuState | null>(null)
  const [localIsBrowserCollapsed, setLocalIsBrowserCollapsed] = useState(false)
  const contextMenuRef = useRef<HTMLDivElement | null>(null)
  const importMenuRef = useRef<HTMLDivElement | null>(null)
  const isBrowserCollapsed = controlledIsCollapsed ?? localIsBrowserCollapsed

  const projectContentRows = useMemo(
    () =>
      selectCurrentProjectContentBrowserRows({
        currentProject,
        projectContent,
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
      sketchVisibilityByRowId,
    ],
  )

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

  const graphRows = useMemo(
    () => {
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
    },
    [
      activeGraphDocumentId,
      browserContentBuildPolicyByRowId,
      browserGraphBuildPolicyByGraphDocumentId,
      cachedGraphEntriesById,
      cachedGraphEntryOrder,
      currentProject,
      hasFocusedViewportByGraphDocumentId,
      graphDocumentsById,
      graphRuntimeByDocumentId,
      openViewportCountByGraphDocumentId,
      projectContent,
    ],
  )

  const resolveSelectedBrowserRowIdFromTarget = useCallback(
    (target: WorkspaceSelectedTarget | null): string | null =>
      resolveBrowserSelectedRowIdFromTarget(target, {
        graphDocumentsById,
        referenceWorkspaceRootRowId: referenceWorkspaceTree.rowId,
        buildProjectSketchBrowserRowId,
      }),
    [graphDocumentsById, referenceWorkspaceTree.rowId],
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
    const explicitTargets =
      workspaceExplicitSelectedTargets.length > 0
        ? workspaceExplicitSelectedTargets
        : workspaceSelectedTarget === null
          ? []
          : [workspaceSelectedTarget]

    for (const target of explicitTargets) {
      if (target.kind === 'references-root') {
        referenceWorkspaceTree.categories.forEach((category) => {
          groupedRowIdSet.add(category.rowId)
          category.items.forEach((item) => groupedRowIdSet.add(item.rowId))
        })
        continue
      }
      if (target.kind === 'reference-category') {
        const selectedReferenceCategory = referenceWorkspaceTree.categories.find(
          (category) => category.categoryId === target.categoryId,
        )
        selectedReferenceCategory?.items.forEach((item) => groupedRowIdSet.add(item.rowId))
      }
    }

    if (workspaceResolvedContentSelection !== null) {
      workspaceResolvedContentSelection.groupedRowIds.forEach((rowId) => groupedRowIdSet.add(rowId))
    }

    return [...groupedRowIdSet]
  }, [
    referenceWorkspaceTree,
    workspaceExplicitSelectedTargets,
    workspaceResolvedContentSelection,
    workspaceSelectedTarget,
  ])

  const workspaceIntentDeps = useMemo<WorkspaceIntentDeps>(
    () => ({
      app: {
        setWorkspaceSelectedTarget,
        setActiveSurface,
        requestFloatingShellActivation,
        setReferenceItemVisibility,
        beginReferenceTransform,
        selectPart,
      },
      spaghetti: {
        activeEditorViewportId,
        editorViewportsById,
        openGraphDocumentInViewport,
        swapFocusedEditorViewportToGraphDocument,
        setActiveEditorViewportId,
        setEditorViewportPosition,
        setSelectedNodeId,
        requestEditorViewportNodeFit,
      },
    }),
    [
      activeEditorViewportId,
      editorViewportsById,
      openGraphDocumentInViewport,
      requestEditorViewportNodeFit,
      requestFloatingShellActivation,
      selectPart,
      setActiveEditorViewportId,
      setActiveSurface,
      setEditorViewportPosition,
      setSelectedNodeId,
      setReferenceItemVisibility,
      setWorkspaceSelectedTarget,
      swapFocusedEditorViewportToGraphDocument,
      beginReferenceTransform,
    ],
  )

  const browserTreeRows = useMemo(
    () =>
      selectBrowserTreeRows({
        referenceWorkspaceTree,
        referenceLoadBatch: referenceWorkspace.referenceLoadBatch,
        activeTransformReferenceId,
        contentRows: projectContentRows,
        graphRows,
        browserGraphBuildPolicyByGraphDocumentId,
        browserContentBuildPolicyByRowId,
        editorViewports,
        graphDocumentsById,
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
      browserContentBuildPolicyByRowId,
      browserGraphBuildPolicyByGraphDocumentId,
      collapsedContentRowIds,
      editorViewports,
      expandedGraphDocumentIds,
      graphSectionExpandedByRowId,
      graphDocumentsById,
      groupedSelectedBrowserRowIds,
      graphRows,
      projectContentRows,
      referenceWorkspaceTree,
      referenceWorkspace,
      activeTransformReferenceId,
      selectedBrowserRowId,
      selectedBrowserRowIds,
      sharedViewerComposition,
      sharedViewerCompositionGraphDocumentIds,
    ],
  )

  const handleOpenOrFocusGraph = (graphDocumentId: string): string | null => {
    return activateGraphDocumentIntent(workspaceIntentDeps, graphDocumentId, {
      strategy: 'open-or-focus',
      spawnPosition: newEditorSpawnPosition,
    }).editorViewportId
  }

  const handleActivateGraphTarget = (
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
  }

  const handleCycleBrowserBuildPolicy = (row: BrowserRenderableRowVm) => {
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
  }

  const toggleBrowserCollapsed = () => {
    setContextMenu(null)
    setImportMenu(null)
    if (onToggleCollapsed !== undefined) {
      onToggleCollapsed()
      return
    }
    setLocalIsBrowserCollapsed((current) => !current)
  }

  const handlePopoutBrowser = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onTogglePopout?.()
  }

  const stopTitleBarPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleActivateBrowserSurface = useCallback(() => {
    setActiveSurface('browser')
  }, [setActiveSurface])

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

  const handleOpenContentImportMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
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
  }

  const handleImportReferenceFile = (fileType: ReferenceFileType) => {
    setImportMenu(null)
    void importReferenceFileFromDisk(fileType)
      .then((file) => {
        const referenceId = addImportedReference(file)
        setLocalSelectedBrowserRowId(`reference-item-row:${referenceId}`)
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.message === 'No reference file selected.') {
          return
        }
        console.error(`Failed to import ${fileType.toUpperCase()} reference file.`, error)
      })
  }

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

  const browserRowInteractionHandlers = useMemo(
    () =>
      createBrowserRowInteractionHandlers({
        browserTreeRows,
        graphDocumentsById,
        referenceWorkspaceRootRowId: referenceWorkspaceTree.rowId,
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
      referenceWorkspaceTree.rowId,
      requestConsoleContextSync,
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

  const handleCreateGraph = () => {
    const graphDocumentId = createGraphDocument()
    activateGraphDocumentIntent(workspaceIntentDeps, graphDocumentId, {
      strategy: 'open-or-focus',
      spawnPosition: newEditorSpawnPosition,
    })
  }

  const handleDuplicateFocusedGraph = () => {
    const graphDocumentId = duplicateActiveGraphDocument()
    activateGraphDocumentIntent(workspaceIntentDeps, graphDocumentId, {
      strategy: 'open-or-focus',
      spawnPosition: newEditorSpawnPosition,
    })
  }

  const handleOpenNewEditor = () => {
    if (activeGraphDocumentId.length === 0 || graphDocumentsById[activeGraphDocumentId] === undefined) {
      return
    }
    const editorViewportId = openGraphDocumentInNewViewport(activeGraphDocumentId)
    if (editorViewportId !== null) {
      setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
    }
  }

  const handleLoadGraphFile = () => {
    void loadGraphDocumentIntoNewGraphFromFile().catch((error: unknown) => {
      console.error('Failed to load graph into a new graph document.', error)
    })
  }

  const handleRevealGraph = (graphDocumentId: string) => {
    if (sharedViewerComposition !== null) {
      return
    }
    setViewerTargetGraphDocumentId(graphDocumentId)
  }

  const handleViewInGraph = (graphDocumentId: string, nodeId: string | null) => {
    handleActivateGraphTarget(graphDocumentId, nodeId, {
      fitNodeInViewport: nodeId !== null,
    })
  }

  const handleRetryImportedReferenceRow = (referenceId: string) => {
    closeBrowserOverlays()
    appendBrowserEntry(`Retry imported reference ${referenceId}`)
    retryReferenceItemLoad(referenceId)
  }

  const handleRemoveImportedReferenceRow = (referenceId: string) => {
    closeBrowserOverlays()
    appendBrowserEntry(`Removed imported reference ${referenceId}`)
    removeImportedReference(referenceId)
    setLocalSelectedBrowserRowId((current) =>
      current === `reference-item-row:${referenceId}` ? null : current,
    )
  }

  const handleTransformReferenceRow = (referenceId: string) => {
    setLocalSelectedBrowserRowId(`reference-item-row:${referenceId}`)
    closeBrowserOverlays()
    appendBrowserEntry(`Transform ${referenceId}`)
    activateReferenceItemIntent(workspaceIntentDeps, referenceId, {
      ensureVisible: true,
      beginTransform: true,
    })
  }

  const handleRowAction = (
    row: BrowserRenderableRowVm,
    action: BrowserTreeRowActionVm,
  ) => {
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
  }

  const createRowContextMenuItems = (row: BrowserRenderableRowVm) =>
    buildBrowserContextMenuItems(row, {
      handleRowAction,
      closeMenus: closeBrowserOverlays,
      selectRow: (rowId) => setLocalSelectedBrowserRowId(rowId),
      appendBrowserEntry,
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
    })

  const handleRowContextMenu = (
    row: BrowserRenderableRowVm,
    event: ReactMouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
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
  }

  const rowHandlers = {
    onSelect: handleSelectBrowserRow,
    onToggleContentVisibility: handleToggleContentVisibility,
    onToggleReferenceVisibility: handleToggleReferenceVisibility,
    onToggleSketchVisibility: handleToggleSketchVisibility,
    onDoubleSelect: handleDoubleSelectBrowserRow,
    onToggleExpand: handleToggleBrowserRowExpand,
    onCycleBrowserBuildPolicy: handleCycleBrowserBuildPolicy,
    onContextMenu: handleRowContextMenu,
  }

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

  return (
    <section
      className={`V15Panel BrowserPanelRoot ${isFloating ? 'isFloating' : ''} ${
        isBrowserCollapsed ? 'isCollapsed' : ''
      }`}
      onPointerDownCapture={handleActivateBrowserSurface}
    >
      <div
        className={`BrowserPanelTitleBar ${isBrowserCollapsed ? 'isCollapsed' : ''}`}
        onPointerDown={onTitleBarPointerDown}
      >
        <div className="BrowserPanelTitleCluster">
          <button
            type="button"
            className="BrowserPanelChromeButton BrowserPanelCollapseButton"
            onPointerDown={stopTitleBarPointer}
            onClick={toggleBrowserCollapsed}
            aria-label="Toggle browser panel"
            aria-expanded={!isBrowserCollapsed}
            aria-controls="browser-panel-body"
            title={isBrowserCollapsed ? 'Expand browser' : 'Collapse browser'}
          >
            {isBrowserCollapsed ? '+' : '-'}
          </button>
          <h3 className="BrowserPanelTitle">Browser</h3>
        </div>
        <button
          type="button"
          className="BrowserPanelChromeButton BrowserPanelPopoutButton"
          onPointerDown={stopTitleBarPointer}
          onClick={handlePopoutBrowser}
          aria-label={isFloating ? 'Dock browser' : 'Pop out browser'}
          title={isFloating ? 'Dock browser' : 'Pop out browser'}
        >
          []
        </button>
      </div>
      {!isBrowserCollapsed ? (
        <div
          id="browser-panel-body"
          className="BrowserPanelBody"
          onClick={handleBrowserBodyClick}
        >
          <div className="BrowserTree" role="tree" aria-label="Project browser">
            <details open className="BrowserTreeSection BrowserTreeSection--root">
              <summary className="BrowserTreeSummary">Project Browser</summary>
              <BrowserContentSection
                referenceRows={browserTreeRows.referenceRows}
                contentRows={browserTreeRows.contentRows}
                rowHandlers={rowHandlers}
                onOpenContentImportMenu={handleOpenContentImportMenu}
              />
              <BrowserGraphDocumentsSection
                graphRows={browserTreeRows.graphRows}
                rowHandlers={rowHandlers}
                onCreateGraph={handleCreateGraph}
                onDuplicateFocusedGraph={handleDuplicateFocusedGraph}
                onLoadGraphFile={handleLoadGraphFile}
              />
              <BrowserOpenEditorsSection
                viewportRows={browserTreeRows.viewportRows}
                rowHandlers={rowHandlers}
                canOpenNewEditor={
                  activeGraphDocumentId.length > 0 &&
                  graphDocumentsById[activeGraphDocumentId] !== undefined
                }
                onOpenNewEditor={handleOpenNewEditor}
              />
            </details>
          </div>
        </div>
      ) : null}
      <BrowserRowContextMenu
        contextMenu={contextMenu}
        menuRef={contextMenuRef}
        style={contextMenuStyle}
      />
      <BrowserImportMenu
        importMenu={importMenu}
        menuRef={importMenuRef}
        onImportReferenceFile={handleImportReferenceFile}
        style={importMenuStyle}
      />
    </section>
  )
}
