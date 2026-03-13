import { describe, expect, it, vi } from 'vitest'
import type { BrowserRenderableRowVm, BrowserTreeRowActionVm } from './selectBrowserTreeRows'
import { runBrowserRowAction } from './browserRowActions'

const graphRow: BrowserRenderableRowVm = {
  rowId: 'graph-row:graph-document-1',
  rowKind: 'graph-document',
  cachedGraphId: 'cached-graph-1',
  graphDocumentId: 'graph-document-1',
  isInSharedViewerComposition: false,
  iconLabel: 'G',
  label: 'Graph 1',
  meta: 'Saved | Open',
  saveState: 'saved',
  isSelected: false,
  isExpandable: true,
  isExpanded: false,
  openViewportCount: 1,
  hasFocusedViewport: false,
  buildState: 'done',
  buildStateLabel: 'Done',
  actions: [],
  children: [],
}

const publishedOutputRow: BrowserRenderableRowVm = {
  rowId: 'published-output-row:graph-document-1:output-entry:s001:node-a',
  rowKind: 'published-output',
  graphDocumentId: 'graph-document-1',
  outputEntryId: 'output-entry:s001:node-a',
  state: 'resolved',
  iconLabel: 'O',
  label: 's001',
  meta: 'Resolved | Build 7',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
}

const viewportRow: BrowserRenderableRowVm = {
  rowId: 'viewport-row:editor-viewport-1',
  rowKind: 'viewport',
  editorViewportId: 'editor-viewport-1',
  graphDocumentId: 'graph-document-1',
  iconLabel: 'V',
  label: 'Graph 1',
  meta: 'Active editor',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
}

const action = (actionId: BrowserTreeRowActionVm['actionId']): BrowserTreeRowActionVm => ({
  actionId,
  label: actionId,
  ariaLabel: actionId,
})

const handlers = (sharedViewerCompositionActive = false) => ({
  sharedViewerCompositionActive,
  onSaveGraph: vi.fn(),
  onOpenGraph: vi.fn(),
  onOpenGraphInNewViewport: vi.fn(),
  onSwapFocusedEditorViewportToGraphDocument: vi.fn(),
  onRevealGraph: vi.fn(),
  onFocusViewport: vi.fn(),
  onCloseViewport: vi.fn(),
})

describe('runBrowserRowAction', () => {
  it('reveals a graph row by reusing graph-scoped viewer targeting when shared composition is not active', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(graphRow, action('reveal'), nextHandlers)

    expect(nextHandlers.onRevealGraph).toHaveBeenCalledWith('graph-document-1')
  })

  it('reveals a published output row by targeting its source graph document', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(publishedOutputRow, action('reveal'), nextHandlers)

    expect(nextHandlers.onRevealGraph).toHaveBeenCalledWith('graph-document-1')
  })

  it('does not retarget viewer reveal while shared composition is active', () => {
    const nextHandlers = handlers(true)

    runBrowserRowAction(graphRow, action('reveal'), nextHandlers)
    runBrowserRowAction(publishedOutputRow, action('reveal'), nextHandlers)

    expect(nextHandlers.onRevealGraph).not.toHaveBeenCalled()
  })

  it('keeps explicit viewport focus movement separate from row-body selection', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(viewportRow, action('focus'), nextHandlers)

    expect(nextHandlers.onFocusViewport).toHaveBeenCalledWith('editor-viewport-1')
  })
})
