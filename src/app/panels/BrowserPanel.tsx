import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  REFERENCE_IMPORT_LABEL_BY_FILE_TYPE,
  importReferenceFileFromDisk,
} from '../references/importReferenceFile'
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
  selectReferenceWorkspaceBrowserTree,
  type WorkspaceSelectedTarget,
  useAppStore,
} from '../store/useAppStore'
import {
  activateObjectIntent,
  activateReferenceItemIntent,
  activateGraphDocumentIntent,
  activateGraphNodeIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
import { selectBrowserGraphRows } from './selectBrowserGraphRows'
import { runBrowserRowAction } from './browserRowActions'
import {
  type BrowserRenderableRowVm,
  type BrowserReferenceCategoryTreeRowVm,
  type BrowserReferenceItemTreeRowVm,
  type BrowserReferencesRootTreeRowVm,
  type BrowserGraphTreeRowVm,
  type BrowserGraphSectionTreeRowVm,
  type BrowserTreeRowActionVm,
  selectBrowserTreeRows,
} from './selectBrowserTreeRows'
import { appendConsoleEntry } from '../console/useConsoleStore'

type BrowserGraphBuildPolicy = 'live' | 'release' | 'manual'

const BROWSER_GRAPH_BUILD_POLICY_ORDER: readonly BrowserGraphBuildPolicy[] = [
  'live',
  'release',
  'manual',
]

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

const describeBrowserRow = (row: BrowserRenderableRowVm): string => {
  switch (row.rowKind) {
    case 'reference-item':
      return `Reference ${row.label}`
    case 'reference-category':
      return `Category ${row.label}`
    case 'references-root':
      return row.label
    case 'sketches-root':
      return row.label
    case 'sketch':
      return `Sketch ${row.label}`
    case 'graph-document':
      return `Graph ${row.label}`
    case 'graph-node':
      return `Node ${row.label}`
    case 'graph-section':
      return `Graph section ${row.label}`
    case 'viewport':
      return `Viewport ${row.label}`
    case 'assembly':
    case 'component':
    case 'object':
      return `${row.rowKind} ${row.label}`
    default:
      return row.label
  }
}

function BrowserTreeRowShell(props: {
  row: BrowserRenderableRowVm
  contentBuildPolicy: BrowserGraphBuildPolicy | null
  isOverflowMenuOpen: boolean
  isSaveMenuOpen: boolean
  onSelect: (row: BrowserRenderableRowVm) => void
  onToggleReferenceVisibility?: (row: BrowserRenderableRowVm) => void
  onDoubleSelect?: (row: BrowserRenderableRowVm) => void
  onToggleExpand?: (row: BrowserRenderableRowVm) => void
  onCycleContentBuildPolicy?: (rowId: string) => void
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
  onRetryReferenceRow?: (referenceId: string) => void
  onRemoveImportedReferenceRow?: (referenceId: string) => void
  onCloseViewportRow?: (editorViewportId: string) => void
}) {
  const {
    contentBuildPolicy,
    isOverflowMenuOpen,
    isSaveMenuOpen,
    onCloseViewportRow,
    onContextMenu,
    onCycleContentBuildPolicy,
    onDoubleSelect,
    onOpenMenu,
    onOpenSaveMenu,
    onRemoveImportedReferenceRow,
    onRetryReferenceRow,
    onSelect,
    onToggleReferenceVisibility,
    onToggleExpand,
    row,
  } = props

  const isGraphRow = row.rowKind === 'graph-document'
  const graphRow = isGraphRow ? (row as BrowserGraphTreeRowVm) : null
  const graphSectionRow =
    row.rowKind === 'graph-section' ? (row as BrowserGraphSectionTreeRowVm) : null
  const referenceRootRow =
    row.rowKind === 'references-root' ? (row as BrowserReferencesRootTreeRowVm) : null
  const referenceCategoryRow =
    row.rowKind === 'reference-category' ? (row as BrowserReferenceCategoryTreeRowVm) : null
  const referenceItemRow =
    row.rowKind === 'reference-item' ? (row as BrowserReferenceItemTreeRowVm) : null
  const referenceRow = referenceRootRow ?? referenceCategoryRow ?? referenceItemRow
  const isImportedReferenceRow = referenceItemRow?.sourceKind === 'imported'
  const isContentRow =
    row.rowKind === 'assembly' ||
    row.rowKind === 'component' ||
    row.rowKind === 'object' ||
    row.rowKind === 'sketch'
  const isBuildPolicyRow =
    row.rowKind === 'assembly' || row.rowKind === 'component' || row.rowKind === 'object'
  const isGraphRebuildRow = row.rowKind === 'graph-rebuild-object'
  const isGraphChildPlainRow = row.rowKind === 'graph-section' || row.rowKind === 'graph-node'
  const isReferenceRow = referenceRow !== null
  const isReferenceVisibilityRow =
    row.rowKind === 'reference-category' || row.rowKind === 'reference-item'
  const isReferenceVisible = referenceRow !== null ? referenceRow.isVisible : false
  const isViewportRow = row.rowKind === 'viewport'
  const buildSurfaceRow =
    isContentRow || isGraphRebuildRow
      ? row
      : null
  const isActiveViewportRow = row.rowKind === 'viewport' && row.meta === 'Active editor'
  const contentStatusLabel = buildSurfaceRow ? buildSurfaceRow.statusLabel ?? '' : ''
  const contentStatusTone = buildSurfaceRow ? buildSurfaceRow.statusTone ?? 'quiet' : 'quiet'
  const contentBuildState = buildSurfaceRow ? buildSurfaceRow.buildState : 'done'
  const contentBuildStateLabel = buildSurfaceRow ? buildSurfaceRow.buildStateLabel : ''
  const rowClassName = [
    'BrowserTreeRow',
    `BrowserTreeRow--${row.rowKind}`,
    `BrowserTreeRow--depth-${row.depth}`,
    row.isSelected ? 'isSelected' : '',
    !row.isExpandable ? 'isLeaf' : '',
    graphRow?.openViewportCount ? 'isOpen' : '',
    graphRow?.hasFocusedViewport || isActiveViewportRow ? 'isActiveEditor' : '',
    graphRow?.buildState === 'building' || contentBuildState === 'building' ? 'isBuilding' : '',
  ]
    .filter((value) => value.length > 0)
    .join(' ')
  const rowMainClassName = [
    'BrowserTreeRowMain',
    graphRow !== null ? 'isGraphRow' : '',
    isContentRow ? 'isContentRow' : '',
    row.rowKind === 'sketches-root' ? 'isSketchesRootRow' : '',
    isGraphRebuildRow ? 'isGraphChildBuildRow' : '',
    isReferenceRow ? 'isReferenceRow' : '',
    isGraphChildPlainRow ? 'isGraphChildPlainRow' : '',
    isViewportRow ? 'isViewportRow' : '',
    isContentRow ? `isContentRow--${contentBuildState}` : '',
    isGraphRebuildRow ? `isGraphChildBuildRow--${contentBuildState}` : '',
    row.rowKind === 'object' ? 'isContentRow--slim' : '',
    row.rowKind === 'graph-rebuild-object' ? 'isGraphChildBuildRow--slim' : '',
  ]
    .filter((value) => value.length > 0)
    .join(' ')
  const showOverflowButton = (row.showOverflowButton ?? true) && row.actions.length > 0

  return (
    <div
      className={rowClassName}
      onContextMenu={(event) => onContextMenu(row, event)}
    >
      <div className="BrowserTreeRowLead">
        {row.treeGuides.length > 0 ? (
          <span className="BrowserTreeRowGuides" aria-hidden="true">
            {row.treeGuides.map((guide, index) => (
              <span
                key={`${row.rowId}:guide:${index}`}
                className={`BrowserTreeRowGuide BrowserTreeRowGuide--${guide}`}
              />
            ))}
          </span>
        ) : null}
        {row.isExpandable ? (
          <button
            type="button"
            className="BrowserTreeRowExpand"
            onClick={() => onToggleExpand?.(row)}
            aria-label={
              isGraphRow
                ? row.isExpanded
                  ? `Collapse ${row.label} child sections`
                  : `Expand ${row.label} child sections`
                : graphSectionRow !== null
                  ? row.isExpanded
                    ? `Collapse ${row.label}`
                    : `Expand ${row.label}`
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
        {isBuildPolicyRow && contentBuildPolicy !== null ? (
          <button
            type="button"
            className={`BrowserTreeRowIcon BrowserTreeRowIcon--policy BrowserTreeRowIcon--${contentBuildPolicy}`}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onCycleContentBuildPolicy?.(row.rowId)
            }}
            aria-label={`Cycle build policy for ${row.label}. Current policy ${browserGraphBuildPolicyLabel(contentBuildPolicy)}`}
            title={`Build policy: ${browserGraphBuildPolicyLabel(contentBuildPolicy)}`}
          >
            {row.iconLabel}
          </button>
        ) : (
          <span className="BrowserTreeRowIcon" aria-hidden="true">
            {row.iconLabel}
          </span>
        )}
        {isReferenceVisibilityRow ? (
          <button
            type="button"
            className={`BrowserTreeRowVisibilityToggle ${isReferenceVisible ? 'isVisible' : 'isHidden'}`}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onToggleReferenceVisibility?.(row)
            }}
            aria-label={`${isReferenceVisible ? 'Hide' : 'Show'} ${row.label}`}
            title={`${isReferenceVisible ? 'Hide' : 'Show'} ${row.label}`}
          >
            <span className="BrowserTreeRowVisibilityToggleEye" aria-hidden="true">
              <span className="BrowserTreeRowVisibilityTogglePupil" />
            </span>
            {!isReferenceVisible ? (
              <span className="BrowserTreeRowVisibilityToggleSlash" aria-hidden="true" />
            ) : null}
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className={rowMainClassName}
        onClick={() => onSelect(row)}
        onDoubleClick={() => {
          onSelect(row)
          onDoubleSelect?.(row)
        }}
        aria-pressed={row.isSelected}
      >
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
        ) : buildSurfaceRow !== null ? (
          <span
            className={`BrowserContentStateBar BrowserContentStateBar--${contentBuildState} ${
              row.rowKind === 'object' || row.rowKind === 'graph-rebuild-object'
                ? 'BrowserContentStateBar--slim'
                : ''
            }`}
            title={row.meta}
          >
            <span className="BrowserContentStateFill" aria-hidden="true" />
            <span className="BrowserTreeRowText">
              <span className="BrowserTreeRowLabel">{row.label}</span>
              {row.meta.length > 0 ? <span className="BrowserTreeRowMeta">{row.meta}</span> : null}
            </span>
            {contentBuildStateLabel.length > 0 || contentStatusLabel.length > 0 ? (
              <span className="BrowserContentStateMeta">
                {contentBuildStateLabel.length > 0 ? (
                  <span className="BrowserContentStateText">{contentBuildStateLabel}</span>
                ) : null}
                {contentStatusLabel.length > 0 ? (
                  <span
                    className={`BrowserTreeRowStatus BrowserTreeRowStatus--${contentStatusTone} BrowserTreeRowStatus--inline`}
                  >
                    {contentStatusLabel}
                  </span>
                ) : null}
              </span>
            ) : null}
          </span>
        ) : referenceRow !== null ? (
          <span
            className={`BrowserReferenceStateBar BrowserReferenceStateBar--${referenceRow.state}`}
            title={row.meta}
          >
            <span className="BrowserReferenceStateFill" aria-hidden="true" />
            <span className="BrowserTreeRowText">
              <span className="BrowserTreeRowLabel">{row.label}</span>
              {row.meta.length > 0 ? <span className="BrowserTreeRowMeta">{row.meta}</span> : null}
            </span>
            <span className="BrowserReferenceStateText">{referenceRow.stateLabel}</span>
          </span>
        ) : (
          <span className="BrowserGraphChildPlainBar" title={row.meta}>
            <span className="BrowserTreeRowText">
              <span className="BrowserTreeRowLabel">{row.label}</span>
              {row.meta.length > 0 ? <span className="BrowserTreeRowMeta">{row.meta}</span> : null}
            </span>
          </span>
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

      {isImportedReferenceRow && referenceItemRow.state === 'error' ? (
        <button
          type="button"
          className="BrowserTreeRowQuickAction BrowserTreeRowQuickAction--retry"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onRetryReferenceRow?.(referenceItemRow.referenceId)
          }}
          aria-label={`Retry ${row.label}`}
          title={`Retry ${row.label}`}
        >
          ↻
        </button>
      ) : null}

      {isImportedReferenceRow ? (
        <button
          type="button"
          className="BrowserTreeRowQuickAction BrowserTreeRowQuickAction--close"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onRemoveImportedReferenceRow?.(referenceItemRow.referenceId)
          }}
          aria-label={`Remove ${row.label}`}
          title={`Remove ${row.label}`}
        >
          x
        </button>
      ) : null}

      {showOverflowButton ? (
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

type BrowserImportMenuState = {
  x: number
  y: number
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
  const workspaceSelectedTarget = useAppStore((state) => state.workspaceSelection?.selectedTarget ?? null)
  const defaultBuildPolicy = useAppStore((state) => state.buildPolicy)
  const requestGraphDocumentBuild = useAppStore((state) => state.requestGraphDocumentBuild)
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
  const addImportedReference = useAppStore((state) => state.addImportedReference)
  const retryReferenceItemLoad = useAppStore((state) => state.retryReferenceItemLoad)
  const removeImportedReference = useAppStore((state) => state.removeImportedReference)
  const beginReferenceTransform = useAppStore((state) => state.beginReferenceTransform)
  const setWorkspaceSelectedTarget = useAppStore((state) => state.setWorkspaceSelectedTarget)
  const setActiveSurface = useAppStore((state) => state.setActiveSurface)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const requestFloatingShellActivation = useAppStore(
    (state) => state.requestFloatingShellActivation,
  )
  const activeTransformReferenceId = useAppStore(
    (state) => state.referenceWorkspace.activeTransformReferenceId,
  )
  const [expandedGraphDocumentIds, setExpandedGraphDocumentIds] = useState<string[]>([])
  const [graphSectionExpandedByRowId, setGraphSectionExpandedByRowId] = useState<
    Record<string, boolean>
  >({})
  const [collapsedContentRowIds, setCollapsedContentRowIds] = useState<string[]>([])
  const [localSelectedBrowserRowId, setLocalSelectedBrowserRowId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<BrowserContextMenuState | null>(null)
  const [importMenu, setImportMenu] = useState<BrowserImportMenuState | null>(null)
  const [localIsBrowserCollapsed, setLocalIsBrowserCollapsed] = useState(false)
  const [contentBuildPolicyByRowId, setContentBuildPolicyByRowId] = useState<
    Record<string, BrowserGraphBuildPolicy>
  >({})
  const contextMenuRef = useRef<HTMLDivElement | null>(null)
  const importMenuRef = useRef<HTMLDivElement | null>(null)
  const isBrowserCollapsed = controlledIsCollapsed ?? localIsBrowserCollapsed

  const projectContentRows = useMemo(
    () =>
      selectCurrentProjectContentBrowserRows({
        currentProject,
        projectContent,
        graphRuntimeByDocumentId,
        graphDocumentsById,
      }),
    [currentProject, graphDocumentsById, graphRuntimeByDocumentId, projectContent],
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

  const resolveSelectedBrowserRowIdFromTarget = useCallback(
    (target: WorkspaceSelectedTarget | null): string | null => {
      if (target === null) {
        return null
      }
      if (target.kind === 'graph-document') {
        return `graph-row:${target.graphDocumentId}`
      }
      if (target.kind === 'graph-node') {
        const graphNode = graphDocumentsById[target.graphDocumentId]?.graph.nodes.find(
          (node) => node.nodeId === target.nodeId,
        )
        if (graphNode?.type === 'Geometry/Sketch') {
          const rawSketch = graphNode.params.sketch as { featureId?: unknown } | undefined
          if (typeof rawSketch?.featureId === 'string' && rawSketch.featureId.length > 0) {
            return buildProjectSketchBrowserRowId(
              target.graphDocumentId,
              target.nodeId,
              rawSketch.featureId,
            )
          }
        }
        return `graph-node-row:${target.graphDocumentId}:${target.nodeId}`
      }
      if (target.kind === 'reference-item') {
        return `reference-item-row:${target.referenceId}`
      }
      if (target.kind === 'object') {
        return target.objectId
      }
      return null
    },
    [graphDocumentsById],
  )

  const selectedBrowserRowId =
    resolveSelectedBrowserRowIdFromTarget(workspaceSelectedTarget) ?? localSelectedBrowserRowId

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
        activeTransformReferenceId,
        contentRows: projectContentRows,
        graphRows,
        editorViewports,
        graphDocumentsById,
        selectedRowId: selectedBrowserRowId,
        collapsedContentRowIds,
        expandedGraphDocumentIds,
        graphSectionExpandedByRowId,
        hasActiveEditorViewport: activeEditorViewportId.length > 0,
        sharedViewerCompositionGraphDocumentIds,
        sharedViewerCompositionActive: sharedViewerComposition !== null,
      }),
    [
      activeEditorViewportId,
      collapsedContentRowIds,
      editorViewports,
      expandedGraphDocumentIds,
      graphSectionExpandedByRowId,
      graphDocumentsById,
      graphRows,
      projectContentRows,
      referenceWorkspaceTree,
      activeTransformReferenceId,
      selectedBrowserRowId,
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

  const handleCycleContentBuildPolicy = (rowId: string) => {
    setContentBuildPolicyByRowId((current) => {
      const nextPolicy = cycleBrowserGraphBuildPolicy(
        current[rowId] ?? defaultBuildPolicy,
      )
      return {
        ...current,
        [rowId]: nextPolicy,
      }
    })
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

  const handleSectionActionPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleSectionActionClick =
    (action: () => void) => (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      action()
    }

  const handleActivateBrowserSurface = useCallback(() => {
    setActiveSurface('browser')
  }, [setActiveSurface])

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

  const handleSelectBrowserRow = (row: BrowserRenderableRowVm) => {
    setLocalSelectedBrowserRowId(row.rowId)
    setContextMenu(null)
    setImportMenu(null)
    if (row.rowKind === 'references-root') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `${row.isExpanded ? 'Collapse' : 'Expand'} ${describeBrowserRow(row)}`,
        source: 'browser',
        severity: 'info',
      })
      toggleReferenceWorkspaceExpanded()
      return
    }
    if (row.rowKind === 'sketches-root') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `${row.isExpanded ? 'Collapse' : 'Expand'} ${describeBrowserRow(row)}`,
        source: 'browser',
        severity: 'info',
      })
      toggleContentRowExpanded(row.rowId)
      return
    }
    if (row.rowKind === 'reference-category') {
      handleToggleReferenceVisibility(row)
      return
    }
    if (row.rowKind === 'reference-item') {
      handleHighlightReferenceRow(row.referenceId, row.label)
      return
    }
    if (row.rowKind === 'viewport') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `Focused ${describeBrowserRow(row)}`,
        source: 'browser',
        severity: 'info',
      })
      setActiveEditorViewportId(row.editorViewportId)
      return
    }
    if (row.rowKind === 'assembly' || row.rowKind === 'component' || row.rowKind === 'object') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `Selected ${describeBrowserRow(row)}`,
        source: 'browser',
        severity: 'info',
      })
      requestContentRowBuild(row)
      if (row.rowKind === 'object') {
        activateObjectIntent(workspaceIntentDeps, row.rowId, {
          partKey:
            sharedViewerComposition === null
              ? row.highlightViewerKey
              : undefined,
        })
        return
      }
      if (row.rowKind !== 'assembly' && sharedViewerComposition === null && row.highlightViewerKey !== null) {
        selectPart(row.highlightViewerKey)
      }
      return
    }
    if (row.rowKind === 'sketch') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `Focused ${describeBrowserRow(row)}`,
        source: 'browser',
        severity: 'info',
      })
      activateGraphNodeIntent(workspaceIntentDeps, row.authoringGraphDocumentId, row.authoringNodeId, {
        strategy: 'open-or-focus',
        spawnPosition: newEditorSpawnPosition,
        fitNodeInViewport: true,
      })
      requestConsoleContextSync('target-selection')
      return
    }
    if (row.rowKind === 'graph-section') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `${row.isExpanded ? 'Collapse' : 'Expand'} ${describeBrowserRow(row)}`,
        source: 'browser',
        severity: 'info',
      })
      setGraphSectionExpandedByRowId((current) => ({
        ...current,
        [row.rowId]: !(current[row.rowId] ?? row.isExpanded),
      }))
      return
    }
    if (row.rowKind === 'graph-rebuild-object' || row.rowKind === 'graph-node') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `Focused ${describeBrowserRow(row)}`,
        source: 'browser',
        severity: 'info',
      })
      if (row.authoringNodeId === null) {
        activateGraphDocumentIntent(workspaceIntentDeps, row.authoringGraphDocumentId, {
          strategy: 'open-or-focus',
          spawnPosition: newEditorSpawnPosition,
        })
      } else {
        activateGraphNodeIntent(
          workspaceIntentDeps,
          row.authoringGraphDocumentId,
          row.authoringNodeId,
          {
            strategy: 'open-or-focus',
            spawnPosition: newEditorSpawnPosition,
            fitNodeInViewport: row.rowKind === 'graph-node',
          },
        )
      }
      requestConsoleContextSync('target-selection')
      return
    }
    const editorViewportId = activateGraphDocumentIntent(
      workspaceIntentDeps,
      row.graphDocumentId,
      {
        strategy: 'swap-focused-or-open',
        spawnPosition: newEditorSpawnPosition,
      },
    ).editorViewportId
    if (editorViewportId !== null) {
      requestConsoleContextSync('target-selection')
      appendConsoleEntry({
        layer: 'Browser',
        text: `Opened ${describeBrowserRow(row)}`,
        source: 'browser',
        severity: 'info',
      })
    }
  }

  const handleDoubleSelectBrowserRow = (row: BrowserRenderableRowVm) => {
    if (
      row.rowKind !== 'component' &&
      row.rowKind !== 'object' &&
      row.rowKind !== 'sketch' &&
      row.rowKind !== 'graph-rebuild-object' &&
      row.rowKind !== 'graph-node'
    ) {
      return
    }
    if (row.authoringGraphDocumentId === null) {
      return
    }
    handleActivateGraphTarget(row.authoringGraphDocumentId, row.authoringNodeId, {
      fitNodeInViewport: row.authoringNodeId !== null,
    })
    requestConsoleContextSync('target-selection')
  }

  const toggleGraphExpanded = (graphDocumentId: string) => {
    setContextMenu(null)
    setImportMenu(null)
    setExpandedGraphDocumentIds((currentIds) =>
      currentIds.includes(graphDocumentId)
        ? currentIds.filter((currentId) => currentId !== graphDocumentId)
        : [...currentIds, graphDocumentId],
    )
  }

  const toggleGraphSectionExpanded = (rowId: string, isExpanded: boolean) => {
    setContextMenu(null)
    setImportMenu(null)
    setGraphSectionExpandedByRowId((current) => ({
      ...current,
      [rowId]: !isExpanded,
    }))
  }

  const toggleContentRowExpanded = (rowId: string) => {
    setContextMenu(null)
    setImportMenu(null)
    setCollapsedContentRowIds((currentIds) =>
      currentIds.includes(rowId)
        ? currentIds.filter((currentId) => currentId !== rowId)
        : [...currentIds, rowId],
    )
  }

  const handleToggleBrowserRowExpand = (row: BrowserRenderableRowVm) => {
    if (row.rowKind === 'references-root') {
      toggleReferenceWorkspaceExpanded()
      return
    }
    if (row.rowKind === 'reference-category') {
      toggleReferenceCategoryExpanded(row.categoryId)
      return
    }
    if (row.rowKind === 'graph-document') {
      toggleGraphExpanded(row.graphDocumentId)
      return
    }
    if (row.rowKind === 'graph-section') {
      toggleGraphSectionExpanded(row.rowId, row.isExpanded)
      return
    }
    if (
      row.rowKind === 'assembly' ||
      row.rowKind === 'component' ||
      row.rowKind === 'sketches-root'
    ) {
      toggleContentRowExpanded(row.rowId)
    }
  }

  const handleToggleReferenceVisibility = (row: BrowserRenderableRowVm) => {
    setLocalSelectedBrowserRowId(row.rowId)
    setContextMenu(null)
    setImportMenu(null)
    if (row.rowKind === 'reference-category') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `${row.label} visibility toggled`,
        source: 'browser',
        severity: 'info',
      })
      toggleReferenceCategoryVisibility(row.categoryId)
      return
    }
    if (row.rowKind === 'reference-item') {
      appendConsoleEntry({
        layer: 'Browser',
        text: `${row.label} visibility toggled`,
        source: 'browser',
        severity: 'info',
      })
      toggleReferenceItemVisibility(row.referenceId)
    }
  }

  const handleHighlightReferenceRow = (referenceId: string, label: string) => {
    setLocalSelectedBrowserRowId(`reference-item-row:${referenceId}`)
    setContextMenu(null)
    setImportMenu(null)
    appendConsoleEntry({
      layer: 'Browser',
      text: `Highlight ${label}`,
      source: 'browser',
      severity: 'info',
    })
    activateReferenceItemIntent(workspaceIntentDeps, referenceId)
  }

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
    setContextMenu(null)
    setImportMenu(null)
    appendConsoleEntry({
      layer: 'Browser',
      text: `Retry imported reference ${referenceId}`,
      source: 'browser',
      severity: 'info',
    })
    retryReferenceItemLoad(referenceId)
  }

  const handleRemoveImportedReferenceRow = (referenceId: string) => {
    setContextMenu(null)
    setImportMenu(null)
    appendConsoleEntry({
      layer: 'Browser',
      text: `Removed imported reference ${referenceId}`,
      source: 'browser',
      severity: 'info',
    })
    removeImportedReference(referenceId)
    setLocalSelectedBrowserRowId((current) =>
      current === `reference-item-row:${referenceId}` ? null : current,
    )
  }

  const handleTransformReferenceRow = (referenceId: string) => {
    handleHighlightReferenceRow(referenceId, referenceId)
  }

  const requestContentRowBuild = (
    row:
      | Extract<BrowserRenderableRowVm, { rowKind: 'assembly' }>
      | Extract<BrowserRenderableRowVm, { rowKind: 'component' }>
      | Extract<BrowserRenderableRowVm, { rowKind: 'object' }>,
  ) => {
    if (row.buildState !== 'rebuild') {
      return
    }
    for (const graphDocumentId of [...new Set(row.rebuildGraphDocumentIds)]) {
      const inFlightBuildSeq =
        graphRuntimeByDocumentId[graphDocumentId]?.compileBuild?.inFlightBuildSeq ?? null
      if (inFlightBuildSeq !== null) {
        continue
      }
      requestGraphDocumentBuild(graphDocumentId)
    }
  }

  const handleRowAction = (
    row: BrowserRenderableRowVm,
    action: BrowserTreeRowActionVm,
  ) => {
    setContextMenu(null)
    appendConsoleEntry({
      layer: 'Browser',
      text: `${action.label}: ${describeBrowserRow(row)}`,
      source: 'browser',
      severity: 'info',
    })
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

  const handleRowContextMenu = (
    row: BrowserRenderableRowVm,
    event: ReactMouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    event.preventDefault()
    setLocalSelectedBrowserRowId(row.rowId)
    setImportMenu(null)
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
    setImportMenu(null)
    if (row.actions.length === 0) {
      setContextMenu(null)
      return
    }
    if (contextMenu?.row.rowId === row.rowId) {
      setContextMenu(null)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setLocalSelectedBrowserRowId(row.rowId)
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
    setImportMenu(null)
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
    setLocalSelectedBrowserRowId(row.rowId)
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
        <div id="browser-panel-body" className="BrowserPanelBody">
          <div className="BrowserTree" role="tree" aria-label="Project browser">
            <details open className="BrowserTreeSection BrowserTreeSection--root">
              <summary className="BrowserTreeSummary">Project Browser</summary>

                <details open className="BrowserTreeSection BrowserTreeSection--content">
                  <summary className="BrowserTreeSummary BrowserTreeSummary--withActions">
                    <span className="BrowserTreeSummaryLabel">Content</span>
                    <span className="BrowserTreeSummaryActions">
                      <button
                        type="button"
                        className="BrowserTreeSummaryAction"
                        onPointerDown={handleSectionActionPointerDown}
                        onClick={handleOpenContentImportMenu}
                        aria-label="Import reference file"
                        title="Import Reference"
                      >
                        +
                      </button>
                    </span>
                  </summary>
                  <div className="BrowserTreeGroup BrowserTreeGroup--content">
                    {browserTreeRows.referenceRows.map((row) => (
                      <div key={row.rowId}>
                        <BrowserTreeRowShell
                          row={row}
                          contentBuildPolicy={null}
                          isOverflowMenuOpen={false}
                          isSaveMenuOpen={false}
                          onSelect={handleSelectBrowserRow}
                          onToggleReferenceVisibility={handleToggleReferenceVisibility}
                          onDoubleSelect={handleDoubleSelectBrowserRow}
                          onToggleExpand={handleToggleBrowserRowExpand}
                          onContextMenu={handleRowContextMenu}
                          onOpenMenu={handleRowOverflowMenu}
                          onRetryReferenceRow={handleRetryImportedReferenceRow}
                          onRemoveImportedReferenceRow={handleRemoveImportedReferenceRow}
                          onCloseViewportRow={closeEditorViewport}
                        />
                        {row.rowKind === 'reference-category' &&
                        row.isExpanded &&
                        row.itemCount === 0 &&
                        row.emptyLabel.length > 0 ? (
                          <div className="BrowserTreeEmpty BrowserTreeEmpty--nested">
                            {row.emptyLabel}
                          </div>
                        ) : null}
                      </div>
                    ))}
                    {browserTreeRows.referenceRows.length === 0 && browserTreeRows.contentRows.length === 0 ? (
                      <div className="BrowserTreeEmpty">No project content.</div>
                    ) : (
                      <>
                        {browserTreeRows.contentRows.map((row) => (
                          <BrowserTreeRowShell
                            key={row.rowId}
                            row={row}
                            contentBuildPolicy={
                              contentBuildPolicyByRowId[row.rowId] ?? defaultBuildPolicy
                            }
                            isOverflowMenuOpen={
                              contextMenu?.row.rowId === row.rowId && contextMenu.source === 'row'
                            }
                            isSaveMenuOpen={false}
                            onSelect={handleSelectBrowserRow}
                            onToggleReferenceVisibility={handleToggleReferenceVisibility}
                            onDoubleSelect={handleDoubleSelectBrowserRow}
                            onToggleExpand={handleToggleBrowserRowExpand}
                            onCycleContentBuildPolicy={handleCycleContentBuildPolicy}
                            onContextMenu={handleRowContextMenu}
                            onOpenMenu={handleRowOverflowMenu}
                            onRetryReferenceRow={handleRetryImportedReferenceRow}
                            onRemoveImportedReferenceRow={handleRemoveImportedReferenceRow}
                            onCloseViewportRow={closeEditorViewport}
                          />
                        ))}
                        {browserTreeRows.contentRows.length === 1 &&
                        browserTreeRows.contentRows[0]?.rowKind === 'assembly' &&
                        !browserTreeRows.contentRows[0].isExpandable &&
                        browserTreeRows.referenceRows.length === 0 ? (
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
                              contentBuildPolicy={null}
                              isOverflowMenuOpen={
                                contextMenu?.row.rowId === row.rowId && contextMenu.source === 'row'
                              }
                              isSaveMenuOpen={
                                contextMenu?.row.rowId === row.rowId &&
                                contextMenu.source === 'save-button'
                              }
                              onSelect={handleSelectBrowserRow}
                              onToggleReferenceVisibility={handleToggleReferenceVisibility}
                              onDoubleSelect={handleDoubleSelectBrowserRow}
                              onToggleExpand={handleToggleBrowserRowExpand}
                              onContextMenu={handleRowContextMenu}
                              onOpenMenu={handleRowOverflowMenu}
                              onOpenSaveMenu={handleRowSaveMenu}
                              onRetryReferenceRow={handleRetryImportedReferenceRow}
                              onRemoveImportedReferenceRow={handleRemoveImportedReferenceRow}
                              onCloseViewportRow={closeEditorViewport}
                            />
                            {row.isExpanded ? (
                              <div className="BrowserTreeGroup">
                                {row.children.length === 0 ? (
                                  <div className="BrowserTreeEmpty">No graph child sections.</div>
                                ) : (
                                  row.children.map((childRow) => (
                                    <div key={childRow.rowId}>
                                      <BrowserTreeRowShell
                                        row={childRow}
                                        contentBuildPolicy={null}
                                        isOverflowMenuOpen={
                                          contextMenu?.row.rowId === childRow.rowId &&
                                          contextMenu.source === 'row'
                                        }
                                        isSaveMenuOpen={false}
                                        onSelect={handleSelectBrowserRow}
                                        onToggleReferenceVisibility={handleToggleReferenceVisibility}
                                        onDoubleSelect={handleDoubleSelectBrowserRow}
                                        onToggleExpand={handleToggleBrowserRowExpand}
                                        onContextMenu={handleRowContextMenu}
                                        onOpenMenu={handleRowOverflowMenu}
                                        onRetryReferenceRow={handleRetryImportedReferenceRow}
                                        onRemoveImportedReferenceRow={handleRemoveImportedReferenceRow}
                                        onCloseViewportRow={closeEditorViewport}
                                      />
                                      {childRow.rowKind === 'graph-section' &&
                                      childRow.isExpanded &&
                                      childRow.childCount === 0 &&
                                      childRow.emptyLabel.length > 0 ? (
                                        <div className="BrowserTreeEmpty BrowserTreeEmpty--nested">
                                          {childRow.emptyLabel}
                                        </div>
                                      ) : null}
                                    </div>
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
                          contentBuildPolicy={null}
                          isOverflowMenuOpen={
                            contextMenu?.row.rowId === viewport.rowId && contextMenu.source === 'row'
                          }
                          isSaveMenuOpen={false}
                          onSelect={handleSelectBrowserRow}
                          onToggleReferenceVisibility={handleToggleReferenceVisibility}
                          onDoubleSelect={handleDoubleSelectBrowserRow}
                          onContextMenu={handleRowContextMenu}
                          onOpenMenu={handleRowOverflowMenu}
                          onRetryReferenceRow={handleRetryImportedReferenceRow}
                          onRemoveImportedReferenceRow={handleRemoveImportedReferenceRow}
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

      {importMenu !== null ? (
        <div
          ref={importMenuRef}
          className="BrowserTreeContextMenu"
          style={importMenuStyle}
          role="menu"
          aria-label="Import reference options"
        >
          <div className="BrowserTreeContextMenuHeader">Import Reference</div>
          {(['step', 'stl', 'obj', 'glb'] as const).map((fileType) => (
            <button
              key={fileType}
              type="button"
              className="BrowserTreeContextMenuAction"
              onClick={() => handleImportReferenceFile(fileType)}
              role="menuitem"
            >
              {REFERENCE_IMPORT_LABEL_BY_FILE_TYPE[fileType]}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
