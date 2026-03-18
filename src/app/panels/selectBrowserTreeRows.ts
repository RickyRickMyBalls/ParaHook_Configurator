import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type {
  ProjectContentBrowserRowVm,
  ProjectContentBuildState,
  ReferenceWorkspaceBrowserTreeVm,
  ReferenceWorkspaceBrowserCategoryVm,
  ReferenceWorkspaceBrowserItemVm,
} from '../store/useAppStore'
import type { BrowserGraphRowVm } from './selectBrowserGraphRows'

export type BrowserTreeRowKind =
  | 'references-root'
  | 'reference-category'
  | 'reference-item'
  | 'assembly'
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
  isExpandable: boolean
  isExpanded: boolean
  actions: BrowserTreeRowActionVm[]
  showOverflowButton?: boolean
}

export type BrowserReferenceRowState = 'highlighted' | 'idle' | 'loading' | 'error'

export type BrowserReferencesRootTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'references-root'
  isVisible: boolean
  state: BrowserReferenceRowState
  stateLabel: string
}

export type BrowserReferenceCategoryTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'reference-category'
  categoryId: ReferenceWorkspaceBrowserCategoryVm['categoryId']
  itemCount: number
  emptyLabel: string
  isVisible: boolean
  state: BrowserReferenceRowState
  stateLabel: string
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
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
}

export type BrowserComponentTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'component'
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
    BrowserAssemblyTreeRowVm | BrowserComponentTreeRowVm | BrowserObjectTreeRowVm
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
    return 'idle'
  }

  return 'idle'
}

export const selectBrowserTreeRows = (options: {
  referenceWorkspaceTree: ReferenceWorkspaceBrowserTreeVm
  activeTransformReferenceId?: string | null
  contentRows: ProjectContentBrowserRowVm[]
  graphRows: BrowserGraphRowVm[]
  editorViewports: EditorViewport[]
  graphDocumentsById: Record<string, GraphDocument>
  selectedRowId: string | null
  collapsedContentRowIds: string[]
  expandedGraphDocumentIds: string[]
  graphSectionExpandedByRowId?: Record<string, boolean>
  hasActiveEditorViewport: boolean
  sharedViewerCompositionGraphDocumentIds: string[]
  sharedViewerCompositionActive: boolean
}): BrowserTreeRowsVm => {
  const {
    referenceWorkspaceTree,
    activeTransformReferenceId = null,
    contentRows,
    editorViewports,
    expandedGraphDocumentIds,
    graphSectionExpandedByRowId = {},
    graphDocumentsById,
    graphRows,
    hasActiveEditorViewport,
    collapsedContentRowIds,
    selectedRowId,
    sharedViewerCompositionActive,
    sharedViewerCompositionGraphDocumentIds,
  } = options

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
    BrowserAssemblyTreeRowVm | BrowserComponentTreeRowVm | BrowserObjectTreeRowVm
  > = []
  const visibleReferenceRows: Array<
    BrowserReferencesRootTreeRowVm | BrowserReferenceCategoryTreeRowVm | BrowserReferenceItemTreeRowVm
  > = []
  const orderedAssemblies = contentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }> => row.kind === 'assembly',
  )

  orderedAssemblies.forEach((row) => {
    const assemblyChildren = rootContentRows
    const isExpanded = !collapsedContentRowIds.includes(row.rowId)
    visibleContentRows.push({
      rowId: row.rowId,
      rowKind: 'assembly',
      depth: 0,
      treeGuides: [],
      buildState: row.buildState ?? 'done',
      buildStateLabel: row.buildStateLabel ?? '',
      rebuildGraphDocumentIds: row.rebuildGraphDocumentIds ?? [],
      iconLabel: 'A',
      label: row.label,
      meta: row.meta,
      ...(row.statusLabel !== undefined
        ? {
            statusLabel: row.statusLabel,
            statusTone: row.statusTone ?? 'quiet',
          }
        : {}),
      isSelected: selectedRowId === row.rowId,
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
          ...(contentRow.statusLabel !== undefined
            ? {
                statusLabel: contentRow.statusLabel,
                statusTone: contentRow.statusTone ?? 'quiet',
              }
            : {}),
          isSelected: selectedRowId === contentRow.rowId,
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
        ...(contentRow.statusLabel !== undefined
          ? {
              statusLabel: contentRow.statusLabel,
              statusTone: contentRow.statusTone ?? 'quiet',
            }
          : {}),
        isSelected: selectedRowId === contentRow.rowId,
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
          ...(objectRow.statusLabel !== undefined
            ? {
                statusLabel: objectRow.statusLabel,
                statusTone: objectRow.statusTone ?? 'quiet',
              }
            : {}),
          isSelected: selectedRowId === objectRow.rowId,
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
      : hasLoadingReference
      ? 'loading'
      : hasReferenceError
        ? 'error'
        : 'idle'

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
    isSelected: selectedRowId === referenceWorkspaceTree.rowId,
    isExpandable: true,
    isExpanded: referenceWorkspaceTree.isExpanded,
    actions: [],
    isVisible: hasVisibleLoadedReference,
    state: referenceRootState,
    stateLabel:
      referenceRootState === 'error'
        ? 'Error'
        : referenceRootState === 'loading'
          ? 'Loading'
          : referenceRootState === 'highlighted'
            ? 'Highlight'
            : 'Idle',
  } satisfies BrowserReferencesRootTreeRowVm)

  if (referenceWorkspaceTree.isExpanded) {
    referenceCategories.forEach((category, categoryIndex) => {
      const hasMoreCategories = categoryIndex < referenceCategories.length - 1
      const categoryState = selectReferenceCategoryState(category.items, activeTransformReferenceId)
      const categoryVisible = category.items.some((item) => item.isVisible && item.loadState === 'loaded')
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
        isSelected: selectedRowId === category.rowId,
        isExpandable: true,
        isExpanded: category.isExpanded,
        actions: [],
        categoryId: category.categoryId,
        itemCount: category.itemCount,
        emptyLabel: category.emptyLabel,
        isVisible: categoryVisible,
        state: categoryState,
        stateLabel:
          categoryState === 'error'
            ? 'Error'
            : categoryState === 'loading'
              ? 'Loading'
              : categoryState === 'highlighted'
                ? 'Highlight'
                : 'Idle',
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
              : 'idle'
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
          isSelected: selectedRowId === item.rowId,
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
          stateLabel:
            itemState === 'error'
              ? 'Error'
              : itemState === 'loading'
                ? 'Loading'
                : itemState === 'highlighted'
                  ? 'Highlight'
                  : 'Idle',
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
          isSelected: selectedRowId === `graph-rebuild-row:${row.graphDocumentId}:${objectRow.rowId}`,
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
          isSelected: selectedRowId === `graph-node-row:${row.graphDocumentId}:${node.nodeId}`,
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
          isSelected: selectedRowId === sectionRowId,
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
        isSelected: selectedRowId === `graph-row:${row.graphDocumentId}`,
        isExpandable: true,
        isExpanded: expandedGraphDocumentIds.includes(row.graphDocumentId),
        saveState: row.saveState,
        openViewportCount: row.openViewportCount,
        hasFocusedViewport: row.hasFocusedViewport,
        buildState: row.buildState,
        buildStateLabel: row.buildStateLabel,
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
        isSelected: selectedRowId === `viewport-row:${viewport.editorViewportId}`,
        isExpandable: false,
        isExpanded: false,
        actions: [
          {
            actionId: 'focus',
            label: 'Focus',
            ariaLabel: `Focus ${label}`,
            disabled: viewport.isFocused,
          },
        ],
      } satisfies BrowserViewportTreeRowVm
    }),
  }
}
