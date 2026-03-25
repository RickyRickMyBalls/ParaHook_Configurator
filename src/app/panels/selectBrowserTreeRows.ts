import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type {
  BrowserBuildPolicy,
  ProjectContentBrowserRowVm,
  ProjectContentBuildState,
  ReferenceLoadBatchState,
  ReferenceWorkspaceBrowserTreeVm,
  ReferenceWorkspaceBrowserCategoryVm,
  ReferenceWorkspaceBrowserItemVm,
} from '../store/useAppStore'
import type { BrowserGraphRowVm } from './selectBrowserGraphRows'

export type BrowserBuildPolicySource = 'self' | 'graph' | 'assembly' | 'component' | 'default'

export type BrowserTreeRowKind =
  | 'references-root'
  | 'reference-category'
  | 'reference-item'
  | 'assembly'
  | 'sketches-root'
  | 'sketch'
  | 'component'
  | 'object'
  | 'graph-document'
  | 'graph-section'
  | 'graph-rebuild-object'
  | 'graph-node'
  | 'viewport'

export type BrowserTreeRowActionId =
  | 'open'
  | 'save'
  | 'new-editor'
  | 'swap-editor'
  | 'reveal'
  | 'view-in-graph'
  | 'transform-object'
  | 'focus'
  | 'close'

export type BrowserTreeRowActionVm = {
  actionId: BrowserTreeRowActionId
  label: string
  ariaLabel: string
  disabled?: boolean
}

export type BrowserTreeGuideKind = 'none' | 'vertical' | 'elbow' | 'tee'

export type BrowserGraphSectionKind = 'needs-rebuild' | 'nodes'

type BrowserTreeRowBaseVm = {
  rowId: string
  rowKind: BrowserTreeRowKind
  depth: number
  treeGuides: BrowserTreeGuideKind[]
  iconLabel: string
  label: string
  meta: string
  isSelected: boolean
  isGroupedSelected?: boolean
  isExpandable: boolean
  isExpanded: boolean
  actions: BrowserTreeRowActionVm[]
  showOverflowButton?: boolean
  authoredBrowserBuildPolicy?: BrowserBuildPolicy | null
  effectiveBrowserBuildPolicy?: BrowserBuildPolicy
  effectiveBrowserBuildPolicySource?: BrowserBuildPolicySource
  effectiveBrowserBuildPolicySourceLabel?: string | null
}

export type BrowserReferenceRowState =
  | 'highlighted'
  | 'active'
  | 'dormant'
  | 'loading'
  | 'error'

export type BrowserReferencesRootTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'references-root'
  isVisible: boolean
  state: BrowserReferenceRowState
  stateLabel: string
  progress01?: number
}

export type BrowserReferenceCategoryTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'reference-category'
  categoryId: ReferenceWorkspaceBrowserCategoryVm['categoryId']
  itemCount: number
  emptyLabel: string
  isVisible: boolean
  state: BrowserReferenceRowState
  stateLabel: string
  progress01?: number
}

export type BrowserReferenceItemTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'reference-item'
  referenceId: string
  sourceKind: ReferenceWorkspaceBrowserItemVm['sourceKind']
  categoryId: ReferenceWorkspaceBrowserItemVm['categoryId']
  fileType: ReferenceWorkspaceBrowserItemVm['fileType']
  assetPath: string
  isVisible: boolean
  state: BrowserReferenceRowState
  stateLabel: string
  errorMessage: string | null
}

export type BrowserGraphSectionTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'graph-section'
  graphDocumentId: string
  sectionKind: BrowserGraphSectionKind
  childCount: number
  emptyLabel: string
}

export type BrowserAssemblyTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'assembly'
  isVisible: boolean
  visibilityPartKeys: string[]
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
}

export type BrowserSketchesRootTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'sketches-root'
  sketchCount: number
}

export type BrowserSketchTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'sketch'
  isVisible: boolean
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
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

export type BrowserComponentTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'component'
  isVisible: boolean
  visibilityPartKeys: string[]
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
  ownerGraphDocumentId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string | null
  componentSourceKind: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'component'; componentSourceKind: infer K }
      ? K
      : never
    : never
  resolutionState: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'component'; resolutionState: infer K }
      ? K
      : never
    : never
  receiveId: string | null
  slotId: string | null
  sourceNodeId: string | null
  highlightViewerKey: string | null
  authoringGraphDocumentId: string | null
  authoringNodeId: string | null
}

export type BrowserObjectTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'object'
  isVisible: boolean
  visibilityPartKeys: string[]
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
  ownerGraphDocumentId: string
  parentComponentId: string | null
  objectSourceKind: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'object'; objectSourceKind: infer K }
      ? K
      : never
    : never
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  slotId: string | null
  sourceNodeId: string | null
  resolutionState: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'object'; resolutionState: infer K }
      ? K
      : never
    : never
  highlightViewerKey: string | null
  authoringGraphDocumentId: string
  authoringNodeId: string | null
}

export type BrowserGraphTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'graph-document'
  cachedGraphId: string
  graphDocumentId: string
  isInSharedViewerComposition: boolean
  saveState: BrowserGraphRowVm['saveState']
  openViewportCount: number
  hasFocusedViewport: boolean
  buildState: BrowserGraphRowVm['buildState']
  buildStateLabel: string
  children: BrowserGraphChildTreeRowVm[]
}

export type BrowserGraphRebuildObjectTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'graph-rebuild-object'
  graphDocumentId: string
  objectRowId: string
  objectSourceKind: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'object'; objectSourceKind: infer K }
      ? K
      : never
    : never
  buildState: ProjectContentBuildState
  buildStateLabel: string
  resolutionState: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'object'; resolutionState: infer K }
      ? K
      : never
    : never
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
  sourceOutputEntryId: string
  sourceNodeId: string | null
  authoringGraphDocumentId: string
  authoringNodeId: string | null
}

export type BrowserGraphNodeTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'graph-node'
  graphDocumentId: string
  nodeId: string
  nodeType: string
  authoringGraphDocumentId: string
  authoringNodeId: string
}

export type BrowserViewportTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'viewport'
  editorViewportId: string
  graphDocumentId: string
}

export type BrowserRenderableRowVm =
  | BrowserReferencesRootTreeRowVm
  | BrowserReferenceCategoryTreeRowVm
  | BrowserReferenceItemTreeRowVm
  | BrowserAssemblyTreeRowVm
  | BrowserSketchesRootTreeRowVm
  | BrowserSketchTreeRowVm
  | BrowserComponentTreeRowVm
  | BrowserObjectTreeRowVm
  | BrowserGraphTreeRowVm
  | BrowserGraphSectionTreeRowVm
  | BrowserGraphRebuildObjectTreeRowVm
  | BrowserGraphNodeTreeRowVm
  | BrowserViewportTreeRowVm

export type BrowserGraphChildTreeRowVm =
  | BrowserGraphSectionTreeRowVm
  | BrowserGraphRebuildObjectTreeRowVm
  | BrowserGraphNodeTreeRowVm

export type BrowserTreeRowsVm = {
  referenceRows: Array<
    BrowserReferencesRootTreeRowVm | BrowserReferenceCategoryTreeRowVm | BrowserReferenceItemTreeRowVm
  >
  contentRows: Array<
    | BrowserAssemblyTreeRowVm
    | BrowserSketchesRootTreeRowVm
    | BrowserSketchTreeRowVm
    | BrowserComponentTreeRowVm
    | BrowserObjectTreeRowVm
  >
  graphRows: BrowserGraphTreeRowVm[]
  viewportRows: BrowserViewportTreeRowVm[]
}

const buildGraphSectionRowId = (
  graphDocumentId: string,
  sectionKind: BrowserGraphSectionKind,
): string => `graph-section-row:${graphDocumentId}:${sectionKind}`

const isDefaultGraphSectionExpanded = (sectionKind: BrowserGraphSectionKind): boolean =>
  sectionKind === 'needs-rebuild'

const formatGraphSectionMeta = (
  sectionKind: BrowserGraphSectionKind,
  childCount: number,
): string => {
  if (sectionKind === 'needs-rebuild') {
    return childCount === 1 ? '1 object' : `${childCount} objects`
  }
  return childCount === 1 ? '1 node' : `${childCount} nodes`
}

const formatGraphNodeLabel = (nodeType: string): string => {
  const [lastSegment] = nodeType.split('/').slice(-1)
  return lastSegment?.trim().length ? lastSegment : nodeType
}

const buildGraphNodeMeta = (nodeType: string, nodeId: string): string => `${nodeType} | ${nodeId}`

const countLabel = (count: number, singular: string, plural: string): string =>
  count === 1 ? `1 ${singular}` : `${count} ${plural}`

const formatReferenceItemMeta = (fileType: string): string => fileType.toUpperCase()

const formatReferenceStateLabel = (state: BrowserReferenceRowState): string => {
  switch (state) {
    case 'highlighted':
      return 'Highlight'
    case 'loading':
      return 'Loading'
    case 'error':
      return 'Error'
    case 'active':
      return 'Active'
    default:
      return 'Dormant'
  }
}

const selectReferenceCategoryState = (
  items: ReferenceWorkspaceBrowserCategoryVm['items'],
  activeTransformReferenceId: string | null,
): BrowserReferenceRowState => {
  const hasHighlightedItem =
    activeTransformReferenceId !== null &&
    items.some((item) => item.referenceId === activeTransformReferenceId)
  if (hasHighlightedItem) {
    return 'highlighted'
  }

  const hasVisibleLoadingItem = items.some((item) => item.isVisible && item.loadState === 'loading')
  if (hasVisibleLoadingItem) {
    return 'loading'
  }

  const hasErrorItem = items.some((item) => item.loadState === 'error')
  if (hasErrorItem) {
    return 'error'
  }

  const hasVisibleLoadedItem = items.some((item) => item.isVisible && item.loadState === 'loaded')
  if (hasVisibleLoadedItem) {
    return 'active'
  }

  return 'dormant'
}

const clampProgress01 = (value: number): number => Math.max(0, Math.min(1, value))

const countBatchCompletedForIds = (
  batch: ReferenceLoadBatchState,
  referenceIds: readonly string[],
): number =>
  referenceIds.filter(
    (referenceId) =>
      batch.completedIds.includes(referenceId) || batch.failedIds.includes(referenceId),
  ).length

export const selectBrowserTreeRows = (options: {
  referenceWorkspaceTree: ReferenceWorkspaceBrowserTreeVm
  referenceLoadBatch?: ReferenceLoadBatchState | null
  activeTransformReferenceId?: string | null
  contentRows: ProjectContentBrowserRowVm[]
  graphRows: BrowserGraphRowVm[]
  browserGraphBuildPolicyByGraphDocumentId?: Record<string, BrowserBuildPolicy>
  browserContentBuildPolicyByRowId?: Record<string, BrowserBuildPolicy>
  editorViewports: EditorViewport[]
  graphDocumentsById: Record<string, GraphDocument>
  selectedRowId: string | null
  selectedRowIds?: string[]
  groupedSelectedRowIds?: string[]
  collapsedContentRowIds: string[]
  expandedGraphDocumentIds: string[]
  graphSectionExpandedByRowId?: Record<string, boolean>
  hasActiveEditorViewport: boolean
  sharedViewerCompositionGraphDocumentIds: string[]
  sharedViewerCompositionActive: boolean
}): BrowserTreeRowsVm => {
  const {
    referenceWorkspaceTree,
    referenceLoadBatch = null,
    activeTransformReferenceId = null,
    browserContentBuildPolicyByRowId = {},
    browserGraphBuildPolicyByGraphDocumentId = {},
    contentRows,
  editorViewports,
  expandedGraphDocumentIds,
  graphSectionExpandedByRowId = {},
  graphDocumentsById,
  graphRows,
  hasActiveEditorViewport,
  groupedSelectedRowIds = [],
  collapsedContentRowIds,
  selectedRowId,
  selectedRowIds = selectedRowId === null ? [] : [selectedRowId],
  sharedViewerCompositionActive,
  sharedViewerCompositionGraphDocumentIds,
  } = options
  const groupedSelectedRowIdSet = new Set(groupedSelectedRowIds)
  const selectedRowIdSet = new Set(selectedRowIds)

  const rootContentRows = contentRows.filter(
    (
      row,
    ): row is
      | Extract<ProjectContentBrowserRowVm, { kind: 'component' }>
      | Extract<ProjectContentBrowserRowVm, { kind: 'object' }> =>
      row.kind === 'component' || (row.kind === 'object' && row.parentComponentId === null),
  )
  const objectRowsByParentId = new Map<
    string,
    Array<Extract<ProjectContentBrowserRowVm, { kind: 'object' }>>
  >()
  const orderedObjectRows = contentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'object' }> => row.kind === 'object',
  )
  const orderedSketchRoots = contentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'sketches-root' }> =>
      row.kind === 'sketches-root',
  )
  const orderedSketchRows = contentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'sketch' }> => row.kind === 'sketch',
  )
  orderedObjectRows.forEach((row) => {
    if (row.parentComponentId === null) {
      return
    }
    const existing = objectRowsByParentId.get(row.parentComponentId)
    if (existing === undefined) {
      objectRowsByParentId.set(row.parentComponentId, [row])
      return
    }
    existing.push(row)
  })

  const visibleContentRows: Array<
    | BrowserAssemblyTreeRowVm
    | BrowserSketchesRootTreeRowVm
    | BrowserSketchTreeRowVm
    | BrowserComponentTreeRowVm
    | BrowserObjectTreeRowVm
  > = []
  const visibleReferenceRows: Array<
    BrowserReferencesRootTreeRowVm | BrowserReferenceCategoryTreeRowVm | BrowserReferenceItemTreeRowVm
  > = []
  const orderedAssemblies = contentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }> => row.kind === 'assembly',
  )
  const rootAssemblyRow = orderedAssemblies[0] ?? null
  const componentRowById = new Map(
    contentRows
      .filter((row): row is Extract<ProjectContentBrowserRowVm, { kind: 'component' }> => row.kind === 'component')
      .map((row) => [row.rowId, row] as const),
  )
  const graphLabelByDocumentId = new Map(graphRows.map((row) => [row.graphDocumentId, row.label] as const))

  const resolveGraphPolicy = (
    graphDocumentId: string,
  ): Pick<
    BrowserTreeRowBaseVm,
    | 'authoredBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicySource'
    | 'effectiveBrowserBuildPolicySourceLabel'
  > => {
    const authoredBrowserBuildPolicy =
      browserGraphBuildPolicyByGraphDocumentId[graphDocumentId] ?? null
    return {
      authoredBrowserBuildPolicy,
      effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy ?? 'live',
      effectiveBrowserBuildPolicySource: authoredBrowserBuildPolicy === null ? 'default' : 'self',
      effectiveBrowserBuildPolicySourceLabel:
        authoredBrowserBuildPolicy === null ? null : graphLabelByDocumentId.get(graphDocumentId) ?? graphDocumentId,
    }
  }

  const resolveAssemblyPolicy = (
    rowId: string,
    label: string,
  ): Pick<
    BrowserTreeRowBaseVm,
    | 'authoredBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicySource'
    | 'effectiveBrowserBuildPolicySourceLabel'
  > => {
    const authoredBrowserBuildPolicy = browserContentBuildPolicyByRowId[rowId] ?? null
    return {
      authoredBrowserBuildPolicy,
      effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy ?? 'live',
      effectiveBrowserBuildPolicySource: authoredBrowserBuildPolicy === null ? 'default' : 'self',
      effectiveBrowserBuildPolicySourceLabel: authoredBrowserBuildPolicy === null ? null : label,
    }
  }

  const resolveComponentPolicy = (
    row: Extract<ProjectContentBrowserRowVm, { kind: 'component' }>,
  ): Pick<
    BrowserTreeRowBaseVm,
    | 'authoredBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicySource'
    | 'effectiveBrowserBuildPolicySourceLabel'
  > => {
    const authoredBrowserBuildPolicy = browserContentBuildPolicyByRowId[row.rowId] ?? null
    if (authoredBrowserBuildPolicy !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicySource: 'self',
        effectiveBrowserBuildPolicySourceLabel: row.label,
      }
    }
    const assemblyAuthored =
      rootAssemblyRow === null ? null : browserContentBuildPolicyByRowId[rootAssemblyRow.rowId] ?? null
    if (assemblyAuthored !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: assemblyAuthored,
        effectiveBrowserBuildPolicySource: 'assembly',
        effectiveBrowserBuildPolicySourceLabel: rootAssemblyRow?.label ?? null,
      }
    }
    const graphAuthored = browserGraphBuildPolicyByGraphDocumentId[row.ownerGraphDocumentId] ?? null
    if (graphAuthored !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: graphAuthored,
        effectiveBrowserBuildPolicySource: 'graph',
        effectiveBrowserBuildPolicySourceLabel:
          graphLabelByDocumentId.get(row.ownerGraphDocumentId) ?? row.ownerGraphDocumentId,
      }
    }
    return {
      authoredBrowserBuildPolicy,
      effectiveBrowserBuildPolicy: 'live',
      effectiveBrowserBuildPolicySource: 'default',
      effectiveBrowserBuildPolicySourceLabel: null,
    }
  }

  const resolveObjectPolicy = (
    row: Extract<ProjectContentBrowserRowVm, { kind: 'object' }>,
  ): Pick<
    BrowserTreeRowBaseVm,
    | 'authoredBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicySource'
    | 'effectiveBrowserBuildPolicySourceLabel'
  > => {
    const authoredBrowserBuildPolicy = browserContentBuildPolicyByRowId[row.rowId] ?? null
    if (authoredBrowserBuildPolicy !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicySource: 'self',
        effectiveBrowserBuildPolicySourceLabel: row.label,
      }
    }
    const parentComponent =
      row.parentComponentId === null ? null : componentRowById.get(row.parentComponentId) ?? null
    if (parentComponent !== null) {
      const parentComponentAuthored = browserContentBuildPolicyByRowId[parentComponent.rowId] ?? null
      if (parentComponentAuthored !== null) {
        return {
          authoredBrowserBuildPolicy,
          effectiveBrowserBuildPolicy: parentComponentAuthored,
          effectiveBrowserBuildPolicySource: 'component',
          effectiveBrowserBuildPolicySourceLabel: parentComponent.label,
        }
      }
    }
    const assemblyAuthored =
      rootAssemblyRow === null ? null : browserContentBuildPolicyByRowId[rootAssemblyRow.rowId] ?? null
    if (assemblyAuthored !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: assemblyAuthored,
        effectiveBrowserBuildPolicySource: 'assembly',
        effectiveBrowserBuildPolicySourceLabel: rootAssemblyRow?.label ?? null,
      }
    }
    const graphAuthored = browserGraphBuildPolicyByGraphDocumentId[row.ownerGraphDocumentId] ?? null
    if (graphAuthored !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: graphAuthored,
        effectiveBrowserBuildPolicySource: 'graph',
        effectiveBrowserBuildPolicySourceLabel:
          graphLabelByDocumentId.get(row.ownerGraphDocumentId) ?? row.ownerGraphDocumentId,
      }
    }
    return {
      authoredBrowserBuildPolicy,
      effectiveBrowserBuildPolicy: 'live',
      effectiveBrowserBuildPolicySource: 'default',
      effectiveBrowserBuildPolicySourceLabel: null,
    }
  }

  orderedAssemblies.forEach((row) => {
    const assemblyChildren = rootContentRows
    const isExpanded = !collapsedContentRowIds.includes(row.rowId)
    visibleContentRows.push({
      rowId: row.rowId,
      rowKind: 'assembly',
      depth: 0,
      treeGuides: [],
      isVisible: row.isVisible ?? false,
      visibilityPartKeys: row.visibilityPartKeys ?? [],
      buildState: row.buildState ?? 'done',
      buildStateLabel: row.buildStateLabel ?? '',
      rebuildGraphDocumentIds: row.rebuildGraphDocumentIds ?? [],
      iconLabel: 'A',
      label: row.label,
      meta: row.meta,
      ...resolveAssemblyPolicy(row.rowId, row.label),
      ...(row.statusLabel !== undefined
        ? {
            statusLabel: row.statusLabel,
            statusTone: row.statusTone ?? 'quiet',
          }
        : {}),
      isSelected: selectedRowIdSet.has(row.rowId),
      isGroupedSelected: groupedSelectedRowIdSet.has(row.rowId),
      isExpandable: assemblyChildren.length > 0,
      isExpanded,
      actions: [],
    } satisfies BrowserAssemblyTreeRowVm)

    if (!isExpanded) {
      return
    }

    rootContentRows.forEach((contentRow, rootIndex) => {
      const hasMoreRootSiblings = rootIndex < rootContentRows.length - 1
      if (contentRow.kind === 'object') {
        visibleContentRows.push({
          rowId: contentRow.rowId,
          rowKind: 'object',
          depth: 1,
          treeGuides: [
            hasMoreRootSiblings ? 'tee' : 'elbow',
          ],
          isVisible: contentRow.isVisible ?? false,
          visibilityPartKeys: contentRow.visibilityPartKeys ?? [],
          buildState: contentRow.buildState ?? 'done',
          buildStateLabel: contentRow.buildStateLabel ?? '',
          rebuildGraphDocumentIds: contentRow.rebuildGraphDocumentIds ?? [],
          ownerGraphDocumentId: contentRow.ownerGraphDocumentId,
          parentComponentId: contentRow.parentComponentId,
          objectSourceKind: contentRow.objectSourceKind,
          sourceGraphDocumentId: contentRow.sourceGraphDocumentId,
          sourceOutputEntryId: contentRow.sourceOutputEntryId,
          slotId: contentRow.slotId,
          sourceNodeId: contentRow.sourceNodeId,
          resolutionState: contentRow.resolutionState,
          highlightViewerKey: contentRow.highlightViewerKey,
          authoringGraphDocumentId: contentRow.authoringGraphDocumentId,
          authoringNodeId: contentRow.authoringNodeId,
          iconLabel: 'O',
          label: contentRow.label,
          meta: contentRow.meta,
          ...resolveObjectPolicy(contentRow),
          ...(contentRow.statusLabel !== undefined
            ? {
                statusLabel: contentRow.statusLabel,
                statusTone: contentRow.statusTone ?? 'quiet',
              }
            : {}),
          isSelected: selectedRowIdSet.has(contentRow.rowId),
          isGroupedSelected: groupedSelectedRowIdSet.has(contentRow.rowId),
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: `View ${contentRow.label} in graph`,
            },
          ],
        } satisfies BrowserObjectTreeRowVm)
        return
      }

      const componentChildren = objectRowsByParentId.get(contentRow.rowId) ?? []
      const isComponentExpanded = !collapsedContentRowIds.includes(contentRow.rowId)
      visibleContentRows.push({
        rowId: contentRow.rowId,
        rowKind: 'component',
        depth: 1,
        treeGuides: [
          componentChildren.length > 0 && isComponentExpanded
            ? 'tee'
            : hasMoreRootSiblings
              ? 'tee'
              : 'elbow',
        ],
        isVisible: contentRow.isVisible ?? false,
        visibilityPartKeys: contentRow.visibilityPartKeys ?? [],
        buildState: contentRow.buildState ?? 'done',
        buildStateLabel: contentRow.buildStateLabel ?? '',
        rebuildGraphDocumentIds: contentRow.rebuildGraphDocumentIds ?? [],
        ownerGraphDocumentId: contentRow.ownerGraphDocumentId,
        sourceGraphDocumentId: contentRow.sourceGraphDocumentId,
        sourceOutputEntryId: contentRow.sourceOutputEntryId,
        componentSourceKind: contentRow.componentSourceKind,
        resolutionState: contentRow.resolutionState,
        receiveId: contentRow.receiveId,
        slotId: contentRow.slotId,
        sourceNodeId: contentRow.sourceNodeId,
        highlightViewerKey: contentRow.highlightViewerKey,
        authoringGraphDocumentId: contentRow.authoringGraphDocumentId,
        authoringNodeId: contentRow.authoringNodeId,
        iconLabel: 'C',
        label: contentRow.label,
        meta: contentRow.meta,
        ...resolveComponentPolicy(contentRow),
        ...(contentRow.statusLabel !== undefined
          ? {
              statusLabel: contentRow.statusLabel,
              statusTone: contentRow.statusTone ?? 'quiet',
            }
          : {}),
        isSelected: selectedRowIdSet.has(contentRow.rowId),
        isGroupedSelected: groupedSelectedRowIdSet.has(contentRow.rowId),
        isExpandable: componentChildren.length > 0,
        isExpanded: isComponentExpanded,
        actions: [
          {
            actionId: 'view-in-graph',
            label: 'View In Graph',
            ariaLabel: `View ${contentRow.label} in graph`,
          },
        ],
      } satisfies BrowserComponentTreeRowVm)

      if (!isComponentExpanded) {
        return
      }

      componentChildren.forEach((objectRow, objectIndex) => {
        visibleContentRows.push({
          rowId: objectRow.rowId,
          rowKind: 'object',
          depth: 2,
          treeGuides: [
            hasMoreRootSiblings ? 'vertical' : 'none',
            objectIndex < componentChildren.length - 1 ? 'tee' : 'elbow',
          ],
          isVisible: objectRow.isVisible ?? false,
          visibilityPartKeys: objectRow.visibilityPartKeys ?? [],
          buildState: objectRow.buildState ?? 'done',
          buildStateLabel: objectRow.buildStateLabel ?? '',
          rebuildGraphDocumentIds: objectRow.rebuildGraphDocumentIds ?? [],
          ownerGraphDocumentId: objectRow.ownerGraphDocumentId,
          parentComponentId: objectRow.parentComponentId,
          objectSourceKind: objectRow.objectSourceKind,
          sourceGraphDocumentId: objectRow.sourceGraphDocumentId,
          sourceOutputEntryId: objectRow.sourceOutputEntryId,
          slotId: objectRow.slotId,
          sourceNodeId: objectRow.sourceNodeId,
          resolutionState: objectRow.resolutionState,
          highlightViewerKey: objectRow.highlightViewerKey,
          authoringGraphDocumentId: objectRow.authoringGraphDocumentId,
          authoringNodeId: objectRow.authoringNodeId,
          iconLabel: 'O',
          label: objectRow.label,
          meta: objectRow.meta,
          ...resolveObjectPolicy(objectRow),
          ...(objectRow.statusLabel !== undefined
            ? {
                statusLabel: objectRow.statusLabel,
                statusTone: objectRow.statusTone ?? 'quiet',
              }
            : {}),
          isSelected: selectedRowIdSet.has(objectRow.rowId),
          isGroupedSelected: groupedSelectedRowIdSet.has(objectRow.rowId),
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: `View ${objectRow.label} in graph`,
            },
          ],
        } satisfies BrowserObjectTreeRowVm)
      })
    })
  })

  orderedSketchRoots.forEach((row) => {
    const isExpanded = !collapsedContentRowIds.includes(row.rowId)
    visibleContentRows.push({
      rowId: row.rowId,
      rowKind: 'sketches-root',
      depth: 0,
      treeGuides: [],
      sketchCount: row.sketchCount,
      iconLabel: 'S',
      label: row.label,
      meta: row.meta,
      isSelected: selectedRowIdSet.has(row.rowId),
      isExpandable: orderedSketchRows.length > 0,
      isExpanded,
      actions: [],
    } satisfies BrowserSketchesRootTreeRowVm)

    if (!isExpanded) {
      return
    }

    orderedSketchRows.forEach((sketchRow, sketchIndex) => {
      visibleContentRows.push({
        rowId: sketchRow.rowId,
        rowKind: 'sketch',
        depth: 1,
        treeGuides: [sketchIndex < orderedSketchRows.length - 1 ? 'tee' : 'elbow'],
        isVisible: sketchRow.isVisible,
        buildState: sketchRow.buildState ?? 'done',
        buildStateLabel: sketchRow.buildStateLabel ?? '',
        rebuildGraphDocumentIds: sketchRow.rebuildGraphDocumentIds ?? [],
        ownerGraphDocumentId: sketchRow.ownerGraphDocumentId,
        graphDocumentId: sketchRow.graphDocumentId,
        nodeId: sketchRow.nodeId,
        featureId: sketchRow.featureId,
        plane: sketchRow.plane,
        componentCount: sketchRow.componentCount,
        profileCount: sketchRow.profileCount,
        diagnosticsCount: sketchRow.diagnosticsCount,
        authoringGraphDocumentId: sketchRow.authoringGraphDocumentId,
        authoringNodeId: sketchRow.authoringNodeId,
        iconLabel: 'S',
        label: sketchRow.label,
        meta: sketchRow.meta,
        ...(sketchRow.statusLabel !== undefined
          ? {
              statusLabel: sketchRow.statusLabel,
              statusTone: sketchRow.statusTone ?? 'quiet',
            }
          : {}),
        isSelected: selectedRowIdSet.has(sketchRow.rowId),
        isExpandable: false,
        isExpanded: false,
        actions: [
          {
            actionId: 'view-in-graph',
            label: 'View In Graph',
            ariaLabel: `View ${sketchRow.label} in graph`,
          },
        ],
      } satisfies BrowserSketchTreeRowVm)
    })
  })

  const referenceCategories = referenceWorkspaceTree.categories
  const allReferenceItems = referenceCategories.flatMap((category) => category.items)
  const hasHighlightedReference =
    activeTransformReferenceId !== null &&
    allReferenceItems.some((item) => item.referenceId === activeTransformReferenceId)
  const hasLoadingReference = allReferenceItems.some(
    (item) => item.isVisible && item.loadState === 'loading',
  )
  const hasReferenceError = allReferenceItems.some((item) => item.loadState === 'error')
  const hasVisibleLoadedReference = allReferenceItems.some(
    (item) => item.isVisible && item.loadState === 'loaded',
  )
  const referenceRootState: BrowserReferenceRowState =
    hasHighlightedReference
      ? 'highlighted'
      : referenceLoadBatch !== null || hasLoadingReference
      ? 'loading'
      : hasReferenceError
        ? 'error'
        : hasVisibleLoadedReference
          ? 'active'
          : 'dormant'
  const rootBatchProgress01 =
    referenceLoadBatch !== null && referenceLoadBatch.targetIds.length > 0
      ? clampProgress01(
          countBatchCompletedForIds(referenceLoadBatch, referenceLoadBatch.targetIds) /
            referenceLoadBatch.targetIds.length,
        )
      : undefined

  visibleReferenceRows.push({
    rowId: referenceWorkspaceTree.rowId,
    rowKind: 'references-root',
    depth: 0,
    treeGuides: [],
    iconLabel: 'R',
    label: referenceWorkspaceTree.label,
    meta: countLabel(
      referenceCategories.reduce((sum, category) => sum + category.itemCount, 0),
      'item',
      'items',
    ),
    isSelected: selectedRowIdSet.has(referenceWorkspaceTree.rowId),
    isGroupedSelected: groupedSelectedRowIdSet.has(referenceWorkspaceTree.rowId),
    isExpandable: true,
    isExpanded: referenceWorkspaceTree.isExpanded,
    actions: [],
    isVisible: hasVisibleLoadedReference,
    state: referenceRootState,
    stateLabel: formatReferenceStateLabel(referenceRootState),
    progress01: rootBatchProgress01,
  } satisfies BrowserReferencesRootTreeRowVm)

  if (referenceWorkspaceTree.isExpanded) {
    referenceCategories.forEach((category, categoryIndex) => {
      const hasMoreCategories = categoryIndex < referenceCategories.length - 1
      const categoryState = selectReferenceCategoryState(category.items, activeTransformReferenceId)
      const categoryVisible = category.items.some((item) => item.isVisible && item.loadState === 'loaded')
      const categoryBatchTargetIds =
        referenceLoadBatch === null
          ? []
          : category.items
              .map((item) => item.referenceId)
              .filter((referenceId) => referenceLoadBatch.targetIds.includes(referenceId))
      const categoryStateWithBatch: BrowserReferenceRowState =
        activeTransformReferenceId !== null &&
        category.items.some((item) => item.referenceId === activeTransformReferenceId)
          ? 'highlighted'
          : categoryBatchTargetIds.length > 0
            ? 'loading'
            : categoryState
      const categoryProgress01 =
        categoryBatchTargetIds.length > 0 && referenceLoadBatch !== null
          ? clampProgress01(
              countBatchCompletedForIds(referenceLoadBatch, categoryBatchTargetIds) /
                categoryBatchTargetIds.length,
            )
          : undefined
      const categoryIconLabel =
        category.categoryId === 'footpads'
          ? 'F'
          : category.categoryId === 'shoes'
            ? 'S'
            : category.categoryId === 'premade-foothooks'
              ? 'P'
              : 'U'
      visibleReferenceRows.push({
        rowId: category.rowId,
        rowKind: 'reference-category',
        depth: 1,
        treeGuides: [hasMoreCategories ? 'tee' : 'elbow'],
        iconLabel: categoryIconLabel,
        label: category.label,
        meta: countLabel(category.itemCount, 'item', 'items'),
        isSelected: selectedRowIdSet.has(category.rowId),
        isGroupedSelected: groupedSelectedRowIdSet.has(category.rowId),
        isExpandable: true,
        isExpanded: category.isExpanded,
        actions: [],
        categoryId: category.categoryId,
        itemCount: category.itemCount,
        emptyLabel: category.emptyLabel,
        isVisible: categoryVisible,
        state: categoryStateWithBatch,
        stateLabel: formatReferenceStateLabel(categoryStateWithBatch),
        progress01: categoryProgress01,
      } satisfies BrowserReferenceCategoryTreeRowVm)

      if (!category.isExpanded) {
        return
      }

      category.items.forEach((item, itemIndex) => {
        const itemState: BrowserReferenceRowState =
          item.loadState === 'error'
            ? 'error'
            : activeTransformReferenceId === item.referenceId
              ? 'highlighted'
            : item.isVisible && item.loadState === 'loading'
              ? 'loading'
              : item.isVisible && item.loadState === 'loaded'
                ? 'active'
                : 'dormant'
        visibleReferenceRows.push({
          rowId: item.rowId,
          rowKind: 'reference-item',
          depth: 2,
          treeGuides: [
            hasMoreCategories ? 'vertical' : 'none',
            itemIndex < category.items.length - 1 ? 'tee' : 'elbow',
          ],
          iconLabel: 'R',
          label: item.label,
          meta: formatReferenceItemMeta(item.fileType),
          isSelected: selectedRowIdSet.has(item.rowId),
          isGroupedSelected: groupedSelectedRowIdSet.has(item.rowId),
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'transform-object',
              label: 'Transform Object',
              ariaLabel: `Transform ${item.label}`,
            },
          ],
          showOverflowButton: false,
          referenceId: item.referenceId,
          sourceKind: item.sourceKind,
          categoryId: item.categoryId,
          fileType: item.fileType,
          assetPath: item.assetPath,
          isVisible: item.isVisible,
          state: itemState,
          stateLabel: formatReferenceStateLabel(itemState),
          errorMessage: item.errorMessage,
        } satisfies BrowserReferenceItemTreeRowVm)
      })
    })
  }

  const contentSectionRootBranchRowIds = [
    ...(visibleReferenceRows.length > 0 ? [referenceWorkspaceTree.rowId] : []),
    ...visibleContentRows.filter((row) => row.depth === 0).map((row) => row.rowId),
  ]
  const contentSectionRootGuideByRowId = new Map<string, BrowserTreeGuideKind>()
  const contentSectionContinuationGuideByRowId = new Map<string, BrowserTreeGuideKind>()
  contentSectionRootBranchRowIds.forEach((rowId, index) => {
    const hasMoreRootBranches = index < contentSectionRootBranchRowIds.length - 1
    contentSectionRootGuideByRowId.set(rowId, hasMoreRootBranches ? 'tee' : 'elbow')
    contentSectionContinuationGuideByRowId.set(rowId, hasMoreRootBranches ? 'vertical' : 'none')
  })

  const transformedReferenceRows = visibleReferenceRows.map((row) => {
    const rootGuide = contentSectionRootGuideByRowId.get(referenceWorkspaceTree.rowId)
    const continuationGuide = contentSectionContinuationGuideByRowId.get(referenceWorkspaceTree.rowId)
    if (rootGuide === undefined || continuationGuide === undefined) {
      return row
    }
    if (row.depth === 0) {
      return {
        ...row,
        treeGuides: [rootGuide],
      }
    }
    return {
      ...row,
      treeGuides: [continuationGuide, ...row.treeGuides],
    }
  })

  let activeRootAssemblyRowId: string | null = null
  const transformedContentRows = visibleContentRows.map((row) => {
    if (row.depth === 0) {
      activeRootAssemblyRowId = row.rowId
      const rootGuide = contentSectionRootGuideByRowId.get(row.rowId)
      if (rootGuide === undefined) {
        return row
      }
      return {
        ...row,
        treeGuides: [rootGuide],
      }
    }
    if (activeRootAssemblyRowId === null) {
      return row
    }
    const continuationGuide = contentSectionContinuationGuideByRowId.get(activeRootAssemblyRowId)
    if (continuationGuide === undefined) {
      return row
    }
    return {
      ...row,
      treeGuides: [continuationGuide, ...row.treeGuides],
    }
  })

  return {
    referenceRows: transformedReferenceRows,
    contentRows: transformedContentRows,
    graphRows: graphRows.map((row) => {
      const isInSharedViewerComposition = sharedViewerCompositionGraphDocumentIds.includes(
        row.graphDocumentId,
      )
      const graphDocument = graphDocumentsById[row.graphDocumentId] ?? null
      const graphRebuildRows = orderedObjectRows
        .filter(
          (objectRow) =>
            objectRow.ownerGraphDocumentId === row.graphDocumentId &&
            objectRow.authoringGraphDocumentId === row.graphDocumentId &&
            objectRow.objectSourceKind === 'published-object' &&
            (objectRow.buildState === 'rebuild' ||
              objectRow.buildState === 'building' ||
              objectRow.resolutionState === 'unresolved'),
        )
        .map((objectRow) => ({
          rowId: `graph-rebuild-row:${row.graphDocumentId}:${objectRow.rowId}`,
          rowKind: 'graph-rebuild-object',
          depth: 2,
          treeGuides: [],
          graphDocumentId: row.graphDocumentId,
          objectRowId: objectRow.rowId,
          objectSourceKind: objectRow.objectSourceKind,
          buildState: objectRow.buildState ?? 'rebuild',
          buildStateLabel: objectRow.buildStateLabel ?? 'Rebuild',
          resolutionState: objectRow.resolutionState,
          ...(objectRow.statusLabel !== undefined
            ? {
                statusLabel: objectRow.statusLabel,
                statusTone: objectRow.statusTone ?? 'quiet',
              }
            : objectRow.resolutionState === 'unresolved'
              ? {
                  statusLabel: 'Unresolved',
                  statusTone: 'warning' as const,
                }
              : {}),
          sourceOutputEntryId: objectRow.sourceOutputEntryId,
          sourceNodeId: objectRow.sourceNodeId,
          authoringGraphDocumentId: objectRow.authoringGraphDocumentId,
          authoringNodeId: objectRow.authoringNodeId,
          iconLabel: 'O',
          label: objectRow.label,
          meta:
            objectRow.meta === row.label || objectRow.meta === `${row.label} unresolved`
              ? ''
              : objectRow.meta,
          isSelected: selectedRowIdSet.has(`graph-rebuild-row:${row.graphDocumentId}:${objectRow.rowId}`),
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: `View ${objectRow.label} in graph`,
            },
          ],
        } satisfies BrowserGraphRebuildObjectTreeRowVm))
      const graphNodeRows =
        graphDocument?.graph.nodes.map((node) => ({
          rowId: `graph-node-row:${row.graphDocumentId}:${node.nodeId}`,
          rowKind: 'graph-node',
          depth: 2,
          treeGuides: [],
          graphDocumentId: row.graphDocumentId,
          nodeId: node.nodeId,
          nodeType: node.type,
          authoringGraphDocumentId: row.graphDocumentId,
          authoringNodeId: node.nodeId,
          iconLabel: 'N',
          label: formatGraphNodeLabel(node.type),
          meta: buildGraphNodeMeta(node.type, node.nodeId),
          isSelected: selectedRowIdSet.has(`graph-node-row:${row.graphDocumentId}:${node.nodeId}`),
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: `View ${formatGraphNodeLabel(node.type)} in graph`,
            },
          ],
        } satisfies BrowserGraphNodeTreeRowVm)) ?? []

      const sectionDefinitions = [
        {
          sectionKind: 'needs-rebuild' as const,
          label: 'Needs Rebuild',
          iconLabel: '!',
          emptyLabel: '',
          children: graphRebuildRows,
        },
        {
          sectionKind: 'nodes' as const,
          label: 'Nodes',
          iconLabel: 'N',
          emptyLabel: 'No graph nodes.',
          children: graphNodeRows,
        },
      ]

      const graphChildRows = sectionDefinitions.flatMap((sectionDefinition, sectionIndex) => {
        const sectionRowId = buildGraphSectionRowId(row.graphDocumentId, sectionDefinition.sectionKind)
        const sectionExpanded =
          graphSectionExpandedByRowId[sectionRowId] ??
          isDefaultGraphSectionExpanded(sectionDefinition.sectionKind)
        const hasMoreSections = sectionIndex < sectionDefinitions.length - 1
        const sectionRow: BrowserGraphSectionTreeRowVm = {
          rowId: sectionRowId,
          rowKind: 'graph-section',
          depth: 1,
          treeGuides: [hasMoreSections ? 'tee' : 'elbow'],
          graphDocumentId: row.graphDocumentId,
          sectionKind: sectionDefinition.sectionKind,
          childCount: sectionDefinition.children.length,
          emptyLabel: sectionDefinition.emptyLabel,
          iconLabel: sectionDefinition.iconLabel,
          label: sectionDefinition.label,
          meta: formatGraphSectionMeta(sectionDefinition.sectionKind, sectionDefinition.children.length),
          isSelected: selectedRowIdSet.has(sectionRowId),
          isExpandable: true,
          isExpanded: sectionExpanded,
          actions: [],
        }

        if (!sectionExpanded) {
          return [sectionRow]
        }

        return [
          sectionRow,
          ...sectionDefinition.children.map((childRow, childIndex) => ({
            ...childRow,
            treeGuides: [
              hasMoreSections ? 'vertical' : 'none',
              childIndex < sectionDefinition.children.length - 1 ? 'tee' : 'elbow',
            ] as BrowserTreeGuideKind[],
          })),
        ]
      })

      return {
        rowId: `graph-row:${row.graphDocumentId}`,
        rowKind: 'graph-document',
        depth: 0,
        treeGuides: [],
        cachedGraphId: row.cachedGraphId,
        graphDocumentId: row.graphDocumentId,
        isInSharedViewerComposition,
        iconLabel: 'G',
        label: row.label,
        meta: isInSharedViewerComposition ? `${row.meta} | In Shared Viewer` : row.meta,
        isSelected: selectedRowIdSet.has(`graph-row:${row.graphDocumentId}`),
        isExpandable: true,
        isExpanded: expandedGraphDocumentIds.includes(row.graphDocumentId),
        saveState: row.saveState,
        openViewportCount: row.openViewportCount,
        hasFocusedViewport: row.hasFocusedViewport,
        buildState: row.buildState,
        buildStateLabel: row.buildStateLabel,
        ...resolveGraphPolicy(row.graphDocumentId),
        actions: [
          {
            actionId: 'save',
            label: 'Export Graph',
            ariaLabel: `Export ${row.label}`,
          },
          {
            actionId: 'open',
            label: 'Open',
            ariaLabel: `Open ${row.label}`,
          },
          {
            actionId: 'reveal',
            label: 'Reveal',
            ariaLabel: `Reveal ${row.label} in viewer`,
            disabled: sharedViewerCompositionActive,
          },
          {
            actionId: 'new-editor',
            label: 'New Editor',
            ariaLabel: `Open ${row.label} in a new editor`,
          },
          {
            actionId: 'swap-editor',
            label: 'Swap Editor',
            ariaLabel: `Swap focused editor to ${row.label}`,
            disabled: !hasActiveEditorViewport,
          },
        ],
        children: graphChildRows,
      }
    }),
    viewportRows: editorViewports.map((viewport) => {
      const document = graphDocumentsById[viewport.graphDocumentId] ?? null
      const label = document?.name ?? viewport.graphDocumentId
      return {
        rowId: `viewport-row:${viewport.editorViewportId}`,
        rowKind: 'viewport',
        depth: 0,
        treeGuides: [],
        editorViewportId: viewport.editorViewportId,
        graphDocumentId: viewport.graphDocumentId,
        iconLabel: 'V',
        label,
        meta: viewport.isFocused ? 'Active editor' : `Editor z${viewport.zOrder}`,
        isSelected: selectedRowIdSet.has(`viewport-row:${viewport.editorViewportId}`),
        isExpandable: false,
        isExpanded: false,
        actions: [
          {
            actionId: 'focus',
            label: 'Focus',
            ariaLabel: `Focus ${label}`,
            disabled: viewport.isFocused,
          },
          {
            actionId: 'close',
            label: 'Close',
            ariaLabel: `Close ${label}`,
          },
        ],
      } satisfies BrowserViewportTreeRowVm
    }),
  }
}
