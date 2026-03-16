import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  defaultViewportPosition,
  selectSharedViewerComposition,
  selectSharedViewerCompositionGraphDocumentIds,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import {
  selectCurrentProjectContentBrowserRows,
  useAppStore,
} from '../store/useAppStore'
import { selectBrowserGraphRows } from './selectBrowserGraphRows'
import { runBrowserRowAction } from './browserRowActions'
import {
  type BrowserRenderableRowVm,
  type BrowserGraphTreeRowVm,
  type BrowserTreeRowActionVm,
  selectBrowserTreeRows,
} from './selectBrowserTreeRows'

type BrowserGraphBuildPolicy = 'live' | 'release' | 'manual'

const BROWSER_GRAPH_BUILD_POLICY_ORDER: readonly BrowserGraphBuildPolicy[] = [
  'live',
  'release',
  'manual',
]

const browserGraphBuildPolicyChipLabel = (policy: BrowserGraphBuildPolicy): string => {
  switch (policy) {
    case 'release':
      return 'R'
    case 'manual':
      return 'M'
    default:
      return 'L'
  }
}

const browserGraphBuildPolicyLabel = (policy: BrowserGraphBuildPolicy): string => {
  switch (policy) {
    case 'release':
      return 'Release'
    case 'manual':
      return 'Manual'
    default:
      return 'Live'
  }
}

const cycleBrowserGraphBuildPolicy = (
  policy: BrowserGraphBuildPolicy,
): BrowserGraphBuildPolicy => {
  const currentIndex = BROWSER_GRAPH_BUILD_POLICY_ORDER.indexOf(policy)
  return BROWSER_GRAPH_BUILD_POLICY_ORDER[
    (currentIndex + 1) % BROWSER_GRAPH_BUILD_POLICY_ORDER.length
  ]
}

function BrowserTreeRowShell(props: {
  row: BrowserRenderableRowVm
  graphBuildPolicy: BrowserGraphBuildPolicy | null
  isOverflowMenuOpen: boolean
  isSaveMenuOpen: boolean
  onSelect: (row: BrowserRenderableRowVm) => void
  onDoubleSelect?: (row: BrowserRenderableRowVm) => void
  onToggleExpand?: (row: BrowserRenderableRowVm) => void
  onCycleGraphBuildPolicy?: (graphDocumentId: string) => void
  onContextMenu: (
    row: BrowserRenderableRowVm,
    event: ReactMouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => void
  onOpenMenu: (
    row: BrowserRenderableRowVm,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => void
  onOpenSaveMenu?: (
    row: BrowserGraphTreeRowVm,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => void
  onCloseViewportRow?: (editorViewportId: string) => void
}) {
  const {
    graphBuildPolicy,
    isOverflowMenuOpen,
    isSaveMenuOpen,
    onCloseViewportRow,
    onContextMenu,
    onCycleGraphBuildPolicy,
    onDoubleSelect,
    onOpenMenu,
    onOpenSaveMenu,
    onSelect,
    onToggleExpand,
    row,
  } = props

  const isGraphRow = row.rowKind === 'graph-document'
  const graphRow = isGraphRow ? (row as BrowserGraphTreeRowVm) : null
  const isActiveViewportRow = row.rowKind === 'viewport' && row.meta === 'Active editor'
  const rowClassName = [
    'BrowserTreeRow',
    row.isSelected ? 'isSelected' : '',
    graphRow?.openViewportCount ? 'isOpen' : '',
    graphRow?.hasFocusedViewport || isActiveViewportRow ? 'isActiveEditor' : '',
    graphRow?.buildState === 'building' ? 'isBuilding' : '',
  ]
    .filter((value) => value.length > 0)
    .join(' ')

  return (
    <div
      className={rowClassName}
      onContextMenu={(event) => onContextMenu(row, event)}
      style={{ marginLeft: `${row.depth * 16}px` }}
    >
      <div className="BrowserTreeRowLead">
        {row.isExpandable ? (
          <button
            type="button"
            className="BrowserTreeRowExpand"
            onClick={() => onToggleExpand?.(row)}
            aria-label={
              isGraphRow
                ? row.isExpanded
                  ? `Collapse ${row.label} published outputs`
                  : `Expand ${row.label} published outputs`
                : row.isExpanded
                  ? `Collapse ${row.label} children`
                  : `Expand ${row.label} children`
            }
          >
            {row.isExpanded ? '-' : '+'}
          </button>
        ) : (
          <span className="BrowserTreeRowExpand BrowserTreeRowExpand--placeholder" aria-hidden="true">
            .
          </span>
        )}
        {graphRow !== null && graphBuildPolicy !== null ? (
          <button
            type="button"
            className={`BrowserTreeRowPolicy BrowserTreeRowPolicy--${graphBuildPolicy}`}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onCycleGraphBuildPolicy?.(graphRow.graphDocumentId)
            }}
            aria-label={`Cycle build policy for ${graphRow.label}. Current policy ${browserGraphBuildPolicyLabel(graphBuildPolicy)}`}
            title={`Build policy: ${browserGraphBuildPolicyLabel(graphBuildPolicy)}`}
          >
            {browserGraphBuildPolicyChipLabel(graphBuildPolicy)}
          </button>
        ) : (
          <span className="BrowserTreeRowIcon" aria-hidden="true">
            {row.iconLabel}
          </span>
        )}
      </div>

      <button
        type="button"
        className={`BrowserTreeRowMain ${graphRow !== null ? 'isGraphRow' : ''}`}
        onClick={() => onSelect(row)}
        onDoubleClick={() => {
          onSelect(row)
          onDoubleSelect?.(row)
        }}
        aria-pressed={row.isSelected}
      >
        <span className="BrowserTreeRowLabel">{row.label}</span>
        {graphRow !== null ? (
          <span
            className={`BrowserGraphStateBar BrowserGraphStateBar--${graphRow.buildState}`}
            title={row.meta}
          >
            <span className="BrowserGraphStateFill" aria-hidden="true" />
            <span className="BrowserGraphStateLabel">{row.label}</span>
            {graphRow.buildStateLabel.length > 0 ? (
              <span className="BrowserGraphStateText">{graphRow.buildStateLabel}</span>
            ) : null}
          </span>
        ) : (
          <span className="BrowserTreeRowMeta">{row.meta}</span>
        )}
      </button>

      {graphRow !== null ? (
        <button
          type="button"
          className={`BrowserTreeRowQuickAction BrowserTreeRowQuickAction--save BrowserTreeRowQuickAction--${graphRow.saveState} ${
            isSaveMenuOpen ? 'isActive' : ''
          }`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onOpenSaveMenu?.(graphRow, event)
          }}
          onContextMenu={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onOpenSaveMenu?.(graphRow, event)
          }}
          aria-label={`Graph save options for ${row.label}`}
          aria-haspopup="menu"
          aria-expanded={isSaveMenuOpen}
          title={graphRow.saveState === 'unsaved' ? `${row.label} has unsaved changes` : `${row.label} is saved`}
        >
          S
        </button>
      ) : null}

      {row.rowKind === 'viewport' ? (
        <button
          type="button"
          className="BrowserTreeRowQuickAction BrowserTreeRowQuickAction--close"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onCloseViewportRow?.(row.editorViewportId)
          }}
          aria-label={`Close ${row.label}`}
          title={`Close ${row.label}`}
        >
          x
        </button>
      ) : null}

      {row.actions.length > 0 ? (
        <button
          type="button"
          className={`BrowserTreeRowOverflow ${isOverflowMenuOpen ? 'isActive' : ''}`}
          onClick={(event) => onOpenMenu(row, event)}
          aria-label={`More options for ${row.label}`}
          aria-haspopup="menu"
          aria-expanded={isOverflowMenuOpen}
        >
          ...
        </button>
      ) : null}
    </div>
  )
}

type BrowserContextMenuState = {
  row: BrowserRenderableRowVm
  x: number
  y: number
  actions: BrowserTreeRowActionVm[]
  source: 'row' | 'save-button'
}

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
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const sharedViewerCompositionGraphDocumentIds = useSpaghettiStore(
    selectSharedViewerCompositionGraphDocumentIds,
  )
  const currentProject = useAppStore((state) => state.currentProject)
  const projectContent = useAppStore((state) => state.projectContent)
  const defaultBuildPolicy = useAppStore((state) => state.buildPolicy)
  const setInputMode = useAppStore((state) => state.setInputMode)
  const selectPart = useAppStore((state) => state.selectPart)
  const [expandedGraphDocumentIds, setExpandedGraphDocumentIds] = useState<string[]>([])
  const [collapsedContentRowIds, setCollapsedContentRowIds] = useState<string[]>([])
  const [selectedBrowserRowId, setSelectedBrowserRowId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<BrowserContextMenuState | null>(null)
  const [localIsBrowserCollapsed, setLocalIsBrowserCollapsed] = useState(false)
  const [graphBuildPolicyByDocumentId, setGraphBuildPolicyByDocumentId] = useState<
    Record<string, BrowserGraphBuildPolicy>
  >({})
  const contextMenuRef = useRef<HTMLDivElement | null>(null)
  const isBrowserCollapsed = controlledIsCollapsed ?? localIsBrowserCollapsed

  const projectContentRows = useMemo(
    () =>
      selectCurrentProjectContentBrowserRows({
        currentProject,
        projectContent,
        graphRuntimeByDocumentId,
      }),
    [currentProject, graphRuntimeByDocumentId, projectContent],
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
    () =>
      selectBrowserGraphRows({
        cachedGraphEntryOrder,
        cachedGraphEntriesById,
        graphDocumentsById,
        graphRuntimeByDocumentId,
        activeGraphDocumentId,
        openViewportCountByGraphDocumentId,
        hasFocusedViewportByGraphDocumentId,
      }),
    [
      activeGraphDocumentId,
      cachedGraphEntriesById,
      cachedGraphEntryOrder,
      hasFocusedViewportByGraphDocumentId,
      graphDocumentsById,
      graphRuntimeByDocumentId,
      openViewportCountByGraphDocumentId,
    ],
  )

  const browserTreeRows = useMemo(
    () =>
      selectBrowserTreeRows({
        contentRows: projectContentRows,
        graphRows,
        editorViewports,
        graphDocumentsById,
        selectedRowId: selectedBrowserRowId,
        collapsedContentRowIds,
        expandedGraphDocumentIds,
        hasActiveEditorViewport: activeEditorViewportId.length > 0,
        sharedViewerCompositionGraphDocumentIds,
        sharedViewerCompositionActive: sharedViewerComposition !== null,
      }),
    [
      activeEditorViewportId,
      collapsedContentRowIds,
      editorViewports,
      expandedGraphDocumentIds,
      graphDocumentsById,
      graphRows,
      projectContentRows,
      selectedBrowserRowId,
      sharedViewerComposition,
      sharedViewerCompositionGraphDocumentIds,
    ],
  )

  const handleOpenOrFocusGraph = (graphDocumentId: string) => {
    const existingViewport = Object.values(editorViewportsById).find(
      (viewport) => viewport.graphDocumentId === graphDocumentId,
    )
    const editorViewportId = openGraphDocumentInViewport(graphDocumentId)
    if (editorViewportId !== null && existingViewport === undefined) {
      setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
    }
    setInputMode('spaghetti')
  }

  const handleCycleGraphBuildPolicy = (graphDocumentId: string) => {
    setGraphBuildPolicyByDocumentId((current) => {
      const nextPolicy = cycleBrowserGraphBuildPolicy(
        current[graphDocumentId] ?? defaultBuildPolicy,
      )
      return {
        ...current,
        [graphDocumentId]: nextPolicy,
      }
    })
  }

  const toggleBrowserCollapsed = () => {
    setContextMenu(null)
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

  const handleSectionActionPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleSectionActionClick =
    (action: () => void) => (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      action()
    }

  useEffect(() => {
    if (contextMenu === null) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const nextTarget = event.target
      if (contextMenuRef.current?.contains(nextTarget as Node) ?? false) {
        return
      }
      setContextMenu(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenu(null)
      }
    }

    const handleWindowChange = () => {
      setContextMenu(null)
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
  }, [contextMenu])

  const handleSelectBrowserRow = (row: BrowserRenderableRowVm) => {
    setSelectedBrowserRowId(row.rowId)
    setContextMenu(null)
    if (row.rowKind === 'viewport') {
      setActiveEditorViewportId(row.editorViewportId)
      setInputMode('spaghetti')
      return
    }
    if (row.rowKind !== 'graph-document') {
      if (
        (row.rowKind === 'component' ||
          row.rowKind === 'object' ||
          row.rowKind === 'published-output') &&
        sharedViewerComposition === null &&
        row.highlightViewerKey !== null
      ) {
        selectPart(row.highlightViewerKey)
      }
      return
    }
    let editorViewportId: string | null = null
    if (activeEditorViewportId.length > 0) {
      editorViewportId = swapFocusedEditorViewportToGraphDocument(row.graphDocumentId)
    } else {
      editorViewportId = openGraphDocumentInViewport(row.graphDocumentId)
      if (editorViewportId !== null) {
        setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
      }
    }
    if (editorViewportId !== null) {
      setInputMode('spaghetti')
    }
  }

  const handleDoubleSelectBrowserRow = (row: BrowserRenderableRowVm) => {
    if (
      row.rowKind !== 'component' &&
      row.rowKind !== 'object' &&
      row.rowKind !== 'published-output'
    ) {
      return
    }
    if (row.authoringGraphDocumentId === null) {
      return
    }
    handleOpenOrFocusGraph(row.authoringGraphDocumentId)
    if (row.authoringNodeId !== null) {
      setSelectedNodeId(row.authoringNodeId)
    }
  }

  const toggleGraphExpanded = (graphDocumentId: string) => {
    setContextMenu(null)
    setExpandedGraphDocumentIds((currentIds) =>
      currentIds.includes(graphDocumentId)
        ? currentIds.filter((currentId) => currentId !== graphDocumentId)
        : [...currentIds, graphDocumentId],
    )
  }

  const toggleContentRowExpanded = (rowId: string) => {
    setContextMenu(null)
    setCollapsedContentRowIds((currentIds) =>
      currentIds.includes(rowId)
        ? currentIds.filter((currentId) => currentId !== rowId)
        : [...currentIds, rowId],
    )
  }

  const handleToggleBrowserRowExpand = (row: BrowserRenderableRowVm) => {
    if (row.rowKind === 'graph-document') {
      toggleGraphExpanded(row.graphDocumentId)
      return
    }
    if (row.rowKind === 'assembly' || row.rowKind === 'component') {
      toggleContentRowExpanded(row.rowId)
    }
  }

  const handleCreateGraph = () => {
    const graphDocumentId = createGraphDocument()
    const editorViewportId = openGraphDocumentInViewport(graphDocumentId)
    if (editorViewportId !== null) {
      setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
      setInputMode('spaghetti')
    }
  }

  const handleDuplicateFocusedGraph = () => {
    const graphDocumentId = duplicateActiveGraphDocument()
    const editorViewportId = openGraphDocumentInViewport(graphDocumentId)
    if (editorViewportId !== null) {
      setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
      setInputMode('spaghetti')
    }
  }

  const handleOpenNewEditor = () => {
    if (activeGraphDocumentId.length === 0 || graphDocumentsById[activeGraphDocumentId] === undefined) {
      return
    }
    const editorViewportId = openGraphDocumentInNewViewport(activeGraphDocumentId)
    if (editorViewportId !== null) {
      setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
      setInputMode('spaghetti')
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
    setInputMode('spaghetti')
  }

  const handleRowAction = (
    row: BrowserRenderableRowVm,
    action: BrowserTreeRowActionVm,
  ) => {
    setContextMenu(null)
    runBrowserRowAction(row, action, {
      sharedViewerCompositionActive: sharedViewerComposition !== null,
      onSaveGraph: (cachedGraphId) => {
        void saveCachedGraphEntryToFile(cachedGraphId).catch((error: unknown) => {
          console.error(`Failed to save cached graph "${cachedGraphId}".`, error)
        })
      },
      onOpenGraph: handleOpenOrFocusGraph,
      onOpenGraphInNewViewport: (graphDocumentId) => {
        const editorViewportId = openGraphDocumentInNewViewport(graphDocumentId)
        if (editorViewportId !== null) {
          setEditorViewportPosition(editorViewportId, newEditorSpawnPosition)
          setInputMode('spaghetti')
        }
      },
      onSwapFocusedEditorViewportToGraphDocument: (graphDocumentId) => {
        const viewportId = swapFocusedEditorViewportToGraphDocument(graphDocumentId)
        if (viewportId !== null) {
          setInputMode('spaghetti')
        }
      },
      onRevealGraph: handleRevealGraph,
      onFocusViewport: (editorViewportId) => {
        setActiveEditorViewportId(editorViewportId)
        setInputMode('spaghetti')
      },
      onCloseViewport: closeEditorViewport,
    })
  }

  const handleRowContextMenu = (
    row: BrowserRenderableRowVm,
    event: ReactMouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    event.preventDefault()
    setSelectedBrowserRowId(row.rowId)
    if (row.actions.length === 0) {
      setContextMenu(null)
      return
    }
    setContextMenu({
      row,
      x: event.clientX,
      y: event.clientY,
      actions: row.actions,
      source: 'row',
    })
  }

  const handleRowOverflowMenu = (
    row: BrowserRenderableRowVm,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    if (row.actions.length === 0) {
      setContextMenu(null)
      return
    }
    if (contextMenu?.row.rowId === row.rowId) {
      setContextMenu(null)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setSelectedBrowserRowId(row.rowId)
    setContextMenu({
      row,
      x: rect.right - 8,
      y: rect.bottom + 6,
      actions: row.actions,
      source: 'row',
    })
  }

  const handleRowSaveMenu = (
    row: BrowserGraphTreeRowVm,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const saveActions = row.actions.filter((action) => action.actionId === 'save')
    if (saveActions.length === 0) {
      setContextMenu(null)
      return
    }
    if (contextMenu?.row.rowId === row.rowId && contextMenu.source === 'save-button') {
      setContextMenu(null)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setSelectedBrowserRowId(row.rowId)
    setContextMenu({
      row,
      x: rect.right - 8,
      y: rect.bottom + 6,
      actions: saveActions,
      source: 'save-button',
    })
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

  return (
    <section
      className={`V15Panel BrowserPanelRoot ${isFloating ? 'isFloating' : ''} ${
        isBrowserCollapsed ? 'isCollapsed' : ''
      }`}
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
        <div id="browser-panel-body" className="BrowserPanelBody">
          <div className="BrowserTree" role="tree" aria-label="Project browser">
            <details open className="BrowserTreeSection BrowserTreeSection--root">
              <summary className="BrowserTreeSummary">Project</summary>

                <details open className="BrowserTreeSection">
                  <summary className="BrowserTreeSummary">Content</summary>
                  <div className="BrowserTreeGroup">
                    {browserTreeRows.contentRows.length === 0 ? (
                      <div className="BrowserTreeEmpty">No project content.</div>
                    ) : (
                      <>
                        {browserTreeRows.contentRows.map((row) => (
                          <BrowserTreeRowShell
                            key={row.rowId}
                            row={row}
                            graphBuildPolicy={null}
                            isOverflowMenuOpen={false}
                            isSaveMenuOpen={false}
                            onSelect={handleSelectBrowserRow}
                            onDoubleSelect={handleDoubleSelectBrowserRow}
                            onToggleExpand={handleToggleBrowserRowExpand}
                            onContextMenu={handleRowContextMenu}
                            onOpenMenu={handleRowOverflowMenu}
                            onCloseViewportRow={closeEditorViewport}
                          />
                        ))}
                        {browserTreeRows.contentRows.length === 1 &&
                        browserTreeRows.contentRows[0]?.rowKind === 'assembly' &&
                        !browserTreeRows.contentRows[0].isExpandable ? (
                          <div className="BrowserTreeEmpty">No published content.</div>
                        ) : null}
                      </>
                    )}
                  </div>
                </details>

                <details open className="BrowserTreeSection">
                  <summary className="BrowserTreeSummary BrowserTreeSummary--withActions">
                    <span className="BrowserTreeSummaryLabel">Graph Documents</span>
                    <span className="BrowserTreeSummaryActions">
                      <button
                        type="button"
                        className="BrowserTreeSummaryAction"
                        onPointerDown={handleSectionActionPointerDown}
                        onClick={handleSectionActionClick(handleCreateGraph)}
                        aria-label="Create new graph"
                        title="New Graph"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="BrowserTreeSummaryAction"
                        onPointerDown={handleSectionActionPointerDown}
                        onClick={handleSectionActionClick(handleDuplicateFocusedGraph)}
                        aria-label="Duplicate focused graph"
                        title="Duplicate Focused"
                      >
                        D
                      </button>
                      <button
                        type="button"
                        className="BrowserTreeSummaryAction"
                        onPointerDown={handleSectionActionPointerDown}
                        onClick={handleSectionActionClick(handleLoadGraphFile)}
                        aria-label="Load graph into new graph"
                        title="Load Into New Graph"
                      >
                        L
                      </button>
                    </span>
                  </summary>
                  <div className="BrowserTreeGroup">
                    {browserTreeRows.graphRows.length === 0 ? (
                      <div className="BrowserTreeEmpty">No graph documents.</div>
                    ) : (
                      browserTreeRows.graphRows.map((row) => {
                        return (
                          <div key={row.cachedGraphId}>
                            <BrowserTreeRowShell
                              row={row}
                              graphBuildPolicy={
                                graphBuildPolicyByDocumentId[row.graphDocumentId] ?? defaultBuildPolicy
                              }
                              isOverflowMenuOpen={
                                contextMenu?.row.rowId === row.rowId && contextMenu.source === 'row'
                              }
                              isSaveMenuOpen={
                                contextMenu?.row.rowId === row.rowId &&
                                contextMenu.source === 'save-button'
                              }
                              onSelect={handleSelectBrowserRow}
                              onDoubleSelect={handleDoubleSelectBrowserRow}
                              onToggleExpand={handleToggleBrowserRowExpand}
                              onCycleGraphBuildPolicy={handleCycleGraphBuildPolicy}
                              onContextMenu={handleRowContextMenu}
                              onOpenMenu={handleRowOverflowMenu}
                              onOpenSaveMenu={handleRowSaveMenu}
                              onCloseViewportRow={closeEditorViewport}
                            />
                            {row.isExpanded ? (
                              <div className="BrowserTreeGroup">
                                {row.children.length === 0 ? (
                                  <div className="BrowserTreeEmpty">No published graph outputs.</div>
                                ) : (
                                  row.children.map((publishedRow) => (
                                    <BrowserTreeRowShell
                                      key={publishedRow.rowId}
                                      row={publishedRow}
                                      graphBuildPolicy={null}
                                      isOverflowMenuOpen={
                                        contextMenu?.row.rowId === publishedRow.rowId &&
                                        contextMenu.source === 'row'
                                      }
                                      isSaveMenuOpen={false}
                                      onSelect={handleSelectBrowserRow}
                                      onDoubleSelect={handleDoubleSelectBrowserRow}
                                      onContextMenu={handleRowContextMenu}
                                      onOpenMenu={handleRowOverflowMenu}
                                      onCloseViewportRow={closeEditorViewport}
                                    />
                                  ))
                                )}
                              </div>
                            ) : null}
                          </div>
                        )
                      })
                    )}
                  </div>
                </details>

                <details open className="BrowserTreeSection">
                  <summary className="BrowserTreeSummary BrowserTreeSummary--withActions">
                    <span className="BrowserTreeSummaryLabel">Open Editors</span>
                    <span className="BrowserTreeSummaryActions">
                      <button
                        type="button"
                        className="BrowserTreeSummaryAction"
                        onPointerDown={handleSectionActionPointerDown}
                        onClick={handleSectionActionClick(handleOpenNewEditor)}
                        aria-label="Open new editor"
                        title="New Editor"
                        disabled={
                          activeGraphDocumentId.length === 0 ||
                          graphDocumentsById[activeGraphDocumentId] === undefined
                        }
                      >
                        +
                      </button>
                    </span>
                  </summary>
                  <div className="BrowserTreeSectionNote">
                    Tracks editor sessions. The workspace currently shows the active editor
                    surface.
                  </div>
                  <div className="BrowserTreeGroup">
                    {editorViewports.length === 0 ? (
                      <div className="BrowserTreeEmpty">No open editors.</div>
                    ) : (
                      browserTreeRows.viewportRows.map((viewport) => (
                        <BrowserTreeRowShell
                          key={viewport.rowId}
                          row={viewport}
                          graphBuildPolicy={null}
                          isOverflowMenuOpen={
                            contextMenu?.row.rowId === viewport.rowId && contextMenu.source === 'row'
                          }
                          isSaveMenuOpen={false}
                          onSelect={handleSelectBrowserRow}
                          onDoubleSelect={handleDoubleSelectBrowserRow}
                          onContextMenu={handleRowContextMenu}
                          onOpenMenu={handleRowOverflowMenu}
                          onCloseViewportRow={closeEditorViewport}
                        />
                      ))
                    )}
                  </div>
                </details>
              </details>
          </div>
        </div>
      ) : null}

      {contextMenu !== null ? (
        <div
          ref={contextMenuRef}
          className="BrowserTreeContextMenu"
          style={contextMenuStyle}
          role="menu"
          aria-label={`${contextMenu.row.label} options`}
        >
          <div className="BrowserTreeContextMenuHeader">{contextMenu.row.label}</div>
          {contextMenu.actions.map((action) => (
            <button
              key={action.actionId}
              type="button"
              className="BrowserTreeContextMenuAction"
              onClick={() => handleRowAction(contextMenu.row, action)}
              aria-label={action.ariaLabel}
              disabled={action.disabled === true}
              role="menuitem"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
