import { describe, expect, it } from 'vitest'
import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type { BrowserGraphRowVm } from './selectBrowserGraphRows'
import { selectBrowserTreeRows } from './selectBrowserTreeRows'

const graphDocument = (graphDocumentId: string, name: string): GraphDocument => ({
  graphDocumentId,
  name,
  version: 1,
  graph: {
    schemaVersion: 1,
    nodes: [],
    edges: [],
  },
})

const graphRow = (options?: {
  graphDocumentId?: string
  cachedGraphId?: string
  label?: string
  meta?: string
  openViewportCount?: number
  hasFocusedViewport?: boolean
  buildState?: 'rebuild' | 'building' | 'done'
  buildStateLabel?: string
}): BrowserGraphRowVm => ({
  cachedGraphId: options?.cachedGraphId ?? 'cached-graph-1',
  graphDocumentId: options?.graphDocumentId ?? 'graph-document-1',
  label: options?.label ?? 'Graph 1',
  meta: options?.meta ?? 'Dirty | Active editor | 2 editors',
  saveState: options?.buildState === 'done' ? 'saved' : 'unsaved',
  isFocused: true,
  openViewportCount: options?.openViewportCount ?? 2,
  hasFocusedViewport: options?.hasFocusedViewport ?? true,
  buildState: options?.buildState ?? 'rebuild',
  buildStateLabel: options?.buildStateLabel ?? 'Rebuild',
  publishedOutputRows: [
    {
      rowId: 'published-output-row:graph-document-1:output-entry:s001:node-a',
      outputEntryId: 'output-entry:s001:node-a',
      label: 's001',
      meta: 'Resolved | baseplate | Build 7',
      state: 'resolved',
    },
  ],
})

const editorViewport = (options?: {
  editorViewportId?: string
  graphDocumentId?: string
  isFocused?: boolean
  zOrder?: number
}): EditorViewport => ({
  editorViewportId: options?.editorViewportId ?? 'editor-viewport-1',
  graphDocumentId: options?.graphDocumentId ?? 'graph-document-1',
  isFocused: options?.isFocused ?? false,
  windowMode: 'expanded',
  position: { x: 0, y: 0 },
  size: { width: 800, height: 600 },
  splitRatio: 0.5,
  restoreFromCollapsed: null,
  restoreFromSplit: null,
  zOrder: options?.zOrder ?? 2,
})

describe('selectBrowserTreeRows', () => {
  it('builds graph rows with a shared row shell contract and local selection state', () => {
    const rows = selectBrowserTreeRows({
      graphRows: [graphRow()],
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: 'graph-row:graph-document-1',
      expandedGraphDocumentIds: ['graph-document-1'],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.graphRows).toEqual([
      {
        rowId: 'graph-row:graph-document-1',
        rowKind: 'graph-document',
        cachedGraphId: 'cached-graph-1',
        graphDocumentId: 'graph-document-1',
        iconLabel: 'G',
        label: 'Graph 1',
        meta: 'Dirty | Active editor | 2 editors',
        isSelected: true,
        isInSharedViewerComposition: false,
        isExpandable: true,
        isExpanded: true,
        saveState: 'unsaved',
        openViewportCount: 2,
        hasFocusedViewport: true,
        buildState: 'rebuild',
        buildStateLabel: 'Rebuild',
        actions: [
          {
            actionId: 'save',
            label: 'Export Graph',
            ariaLabel: 'Export Graph 1',
          },
          {
            actionId: 'open',
            label: 'Open',
            ariaLabel: 'Open Graph 1',
          },
          {
            actionId: 'reveal',
            label: 'Reveal',
            ariaLabel: 'Reveal Graph 1 in viewer',
            disabled: false,
          },
          {
            actionId: 'new-editor',
            label: 'New Editor',
            ariaLabel: 'Open Graph 1 in a new editor',
          },
          {
            actionId: 'swap-editor',
            label: 'Swap Editor',
            ariaLabel: 'Swap focused editor to Graph 1',
            disabled: false,
          },
        ],
        children: [
          {
            rowId: 'published-output-row:graph-document-1:output-entry:s001:node-a',
            rowKind: 'published-output',
            graphDocumentId: 'graph-document-1',
            outputEntryId: 'output-entry:s001:node-a',
            state: 'resolved',
            iconLabel: 'O',
            label: 's001',
            meta: 'Resolved | baseplate | Build 7',
            isSelected: false,
            isExpandable: false,
            isExpanded: false,
            actions: [
              {
                actionId: 'reveal',
                label: 'Reveal',
                ariaLabel: 'Reveal s001 in viewer',
                disabled: false,
              },
            ],
          },
        ],
      },
    ])
  })

  it('keeps Browser selection local and separates it from viewport focus state', () => {
    const rows = selectBrowserTreeRows({
      graphRows: [graphRow()],
      editorViewports: [editorViewport({ isFocused: true, zOrder: 5 })],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: 'published-output-row:graph-document-1:output-entry:s001:node-a',
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: false,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.graphRows[0]).toMatchObject({
      isSelected: false,
      isExpanded: false,
      openViewportCount: 2,
      hasFocusedViewport: true,
      actions: expect.arrayContaining([
        expect.objectContaining({
          actionId: 'swap-editor',
          disabled: true,
        }),
        expect.objectContaining({
          actionId: 'save',
          label: 'Export Graph',
        }),
      ]),
    })
    expect(rows.graphRows[0].children[0]).toMatchObject({
      isSelected: true,
      rowKind: 'published-output',
    })
    expect(rows.viewportRows).toEqual([
      {
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
        actions: [
          {
            actionId: 'focus',
            label: 'Focus',
            ariaLabel: 'Focus Graph 1',
            disabled: true,
          },
        ],
      },
    ])
  })

  it('shows read-only shared composition status and disables reveal when shared composition is active', () => {
    const rows = selectBrowserTreeRows({
      graphRows: [graphRow()],
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: null,
      expandedGraphDocumentIds: ['graph-document-1'],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: ['graph-document-1'],
      sharedViewerCompositionActive: true,
    })

    expect(rows.graphRows[0]).toMatchObject({
      meta: 'Dirty | Active editor | 2 editors | In Shared Viewer',
      isInSharedViewerComposition: true,
      actions: expect.arrayContaining([
        expect.objectContaining({
          actionId: 'reveal',
          disabled: true,
        }),
      ]),
    })
    expect(rows.graphRows[0].children[0]).toMatchObject({
      actions: [
        {
          actionId: 'reveal',
          label: 'Reveal',
          ariaLabel: 'Reveal s001 in viewer',
          disabled: true,
        },
      ],
    })
  })
})
