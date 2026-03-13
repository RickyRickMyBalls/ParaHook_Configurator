import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type {
  BrowserGraphRowVm,
  BrowserPublishedGraphOutputRowVm,
} from './selectBrowserGraphRows'

export type BrowserTreeRowKind = 'graph-document' | 'published-output' | 'viewport'

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
  | BrowserGraphTreeRowVm
  | BrowserPublishedOutputTreeRowVm
  | BrowserViewportTreeRowVm

export type BrowserTreeRowsVm = {
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
  graphDocumentId,
  outputEntryId: row.outputEntryId,
  state: row.state,
  iconLabel: 'O',
  label: row.label,
  meta: row.meta,
  isSelected: selectedRowId === row.rowId,
  isExpandable: false,
  isExpanded: false,
  actions: [],
})

export const selectBrowserTreeRows = (options: {
  graphRows: BrowserGraphRowVm[]
  editorViewports: EditorViewport[]
  graphDocumentsById: Record<string, GraphDocument>
  selectedRowId: string | null
  expandedGraphDocumentIds: string[]
  hasActiveEditorViewport: boolean
  sharedViewerCompositionGraphDocumentIds: string[]
  sharedViewerCompositionActive: boolean
}): BrowserTreeRowsVm => {
  const {
    editorViewports,
    expandedGraphDocumentIds,
    graphDocumentsById,
    graphRows,
    hasActiveEditorViewport,
    selectedRowId,
    sharedViewerCompositionActive,
    sharedViewerCompositionGraphDocumentIds,
  } = options

  return {
    graphRows: graphRows.map((row) => {
      const isInSharedViewerComposition = sharedViewerCompositionGraphDocumentIds.includes(
        row.graphDocumentId,
      )
      return {
        rowId: `graph-row:${row.graphDocumentId}`,
        rowKind: 'graph-document',
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
