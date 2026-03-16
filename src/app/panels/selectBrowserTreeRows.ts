import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type { ProjectContentBrowserRowVm } from '../store/useAppStore'
import type {
  BrowserGraphRowVm,
  BrowserPublishedGraphOutputRowVm,
} from './selectBrowserGraphRows'

export type BrowserTreeRowKind =
  | 'assembly'
  | 'component'
  | 'object'
  | 'graph-document'
  | 'published-output'
  | 'viewport'

export type BrowserTreeRowActionId =
  | 'open'
  | 'save'
  | 'new-editor'
  | 'swap-editor'
  | 'reveal'
  | 'focus'
  | 'close'

export type BrowserTreeRowActionVm = {
  actionId: BrowserTreeRowActionId
  label: string
  ariaLabel: string
  disabled?: boolean
}

type BrowserTreeRowBaseVm = {
  rowId: string
  rowKind: BrowserTreeRowKind
  depth: number
  iconLabel: string
  label: string
  meta: string
  isSelected: boolean
  isExpandable: boolean
  isExpanded: boolean
  actions: BrowserTreeRowActionVm[]
}

export type BrowserPublishedOutputTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'published-output'
  graphDocumentId: string
  outputEntryId: string
  state: BrowserPublishedGraphOutputRowVm['state']
  highlightViewerKey: string | null
  authoringGraphDocumentId: string
  authoringNodeId: string | null
}

export type BrowserAssemblyTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'assembly'
}

export type BrowserComponentTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'component'
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
  parentComponentId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  slotId: string
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
  children: BrowserPublishedOutputTreeRowVm[]
}

export type BrowserViewportTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'viewport'
  editorViewportId: string
  graphDocumentId: string
}

export type BrowserRenderableRowVm =
  | BrowserAssemblyTreeRowVm
  | BrowserComponentTreeRowVm
  | BrowserObjectTreeRowVm
  | BrowserGraphTreeRowVm
  | BrowserPublishedOutputTreeRowVm
  | BrowserViewportTreeRowVm

export type BrowserTreeRowsVm = {
  contentRows: Array<
    BrowserAssemblyTreeRowVm | BrowserComponentTreeRowVm | BrowserObjectTreeRowVm
  >
  graphRows: BrowserGraphTreeRowVm[]
  viewportRows: BrowserViewportTreeRowVm[]
}

const toPublishedOutputRow = (
  graphDocumentId: string,
  row: BrowserPublishedGraphOutputRowVm,
  selectedRowId: string | null,
): BrowserPublishedOutputTreeRowVm => ({
  rowId: row.rowId,
  rowKind: 'published-output',
  depth: 1,
  graphDocumentId,
  outputEntryId: row.outputEntryId,
  state: row.state,
  highlightViewerKey: row.highlightViewerKey,
  authoringGraphDocumentId: row.authoringGraphDocumentId,
  authoringNodeId: row.authoringNodeId,
  iconLabel: 'O',
  label: row.label,
  meta: row.meta,
  isSelected: selectedRowId === row.rowId,
  isExpandable: false,
  isExpanded: false,
  actions: [],
})

export const selectBrowserTreeRows = (options: {
  contentRows: ProjectContentBrowserRowVm[]
  graphRows: BrowserGraphRowVm[]
  editorViewports: EditorViewport[]
  graphDocumentsById: Record<string, GraphDocument>
  selectedRowId: string | null
  collapsedContentRowIds: string[]
  expandedGraphDocumentIds: string[]
  hasActiveEditorViewport: boolean
  sharedViewerCompositionGraphDocumentIds: string[]
  sharedViewerCompositionActive: boolean
}): BrowserTreeRowsVm => {
  const {
    contentRows,
    editorViewports,
    expandedGraphDocumentIds,
    graphDocumentsById,
    graphRows,
    hasActiveEditorViewport,
    collapsedContentRowIds,
    selectedRowId,
    sharedViewerCompositionActive,
    sharedViewerCompositionGraphDocumentIds,
  } = options

  const componentRows = contentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'component' }> => row.kind === 'component',
  )
  const objectRowsByParentId = new Map<
    string,
    Array<Extract<ProjectContentBrowserRowVm, { kind: 'object' }>>
  >()
  const orderedObjectRows = contentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'object' }> => row.kind === 'object',
  )
  orderedObjectRows.forEach((row) => {
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
  const orderedAssemblies = contentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }> => row.kind === 'assembly',
  )

  orderedAssemblies.forEach((row) => {
    const assemblyChildren = componentRows
    const isExpanded = !collapsedContentRowIds.includes(row.rowId)
    visibleContentRows.push({
      rowId: row.rowId,
      rowKind: 'assembly',
      depth: 0,
      iconLabel: 'A',
      label: row.label,
      meta: row.meta,
      isSelected: selectedRowId === row.rowId,
      isExpandable: assemblyChildren.length > 0,
      isExpanded,
      actions: [],
    } satisfies BrowserAssemblyTreeRowVm)

    if (!isExpanded) {
      return
    }

    componentRows.forEach((componentRow) => {
      const componentChildren = objectRowsByParentId.get(componentRow.rowId) ?? []
      const isComponentExpanded = !collapsedContentRowIds.includes(componentRow.rowId)
      visibleContentRows.push({
        rowId: componentRow.rowId,
        rowKind: 'component',
        depth: 1,
        ownerGraphDocumentId: componentRow.ownerGraphDocumentId,
        sourceGraphDocumentId: componentRow.sourceGraphDocumentId,
        sourceOutputEntryId: componentRow.sourceOutputEntryId,
        componentSourceKind: componentRow.componentSourceKind,
        resolutionState: componentRow.resolutionState,
        receiveId: componentRow.receiveId,
        slotId: componentRow.slotId,
        sourceNodeId: componentRow.sourceNodeId,
        highlightViewerKey: componentRow.highlightViewerKey,
        authoringGraphDocumentId: componentRow.authoringGraphDocumentId,
        authoringNodeId: componentRow.authoringNodeId,
        iconLabel: 'C',
        label: componentRow.label,
        meta: componentRow.meta,
        isSelected: selectedRowId === componentRow.rowId,
        isExpandable: componentChildren.length > 0,
        isExpanded: isComponentExpanded,
        actions: [],
      } satisfies BrowserComponentTreeRowVm)

      if (!isComponentExpanded) {
        return
      }

      componentChildren.forEach((objectRow) => {
        visibleContentRows.push({
          rowId: objectRow.rowId,
          rowKind: 'object',
          depth: 2,
          parentComponentId: objectRow.parentComponentId,
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
          isSelected: selectedRowId === objectRow.rowId,
          isExpandable: false,
          isExpanded: false,
          actions: [],
        } satisfies BrowserObjectTreeRowVm)
      })
    })
  })

  return {
    contentRows: visibleContentRows,
    graphRows: graphRows.map((row) => {
      const isInSharedViewerComposition = sharedViewerCompositionGraphDocumentIds.includes(
        row.graphDocumentId,
      )
      return {
        rowId: `graph-row:${row.graphDocumentId}`,
        rowKind: 'graph-document',
        depth: 0,
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
        children: row.publishedOutputRows.map((childRow) => ({
          ...toPublishedOutputRow(row.graphDocumentId, childRow, selectedRowId),
          actions: [
            {
              actionId: 'reveal',
              label: 'Reveal',
              ariaLabel: `Reveal ${childRow.label} in viewer`,
              disabled: sharedViewerCompositionActive,
            },
          ],
        })),
      }
    }),
    viewportRows: editorViewports.map((viewport) => {
      const document = graphDocumentsById[viewport.graphDocumentId] ?? null
      const label = document?.name ?? viewport.graphDocumentId
      return {
        rowId: `viewport-row:${viewport.editorViewportId}`,
        rowKind: 'viewport',
        depth: 0,
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
