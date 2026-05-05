import { describe, expect, it, vi } from 'vitest'
import type { BrowserRenderableRowVm, BrowserTreeRowActionVm } from './selectBrowserTreeRows'
import { runBrowserRowAction } from './browserRowActions'

const graphRow: BrowserRenderableRowVm = {
  rowId: 'graph-row:graph-document-1',
  rowKind: 'graph-document',
  depth: 0,
  treeGuides: [],
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

const graphRebuildRow: BrowserRenderableRowVm = {
  rowId: 'graph-rebuild-row:graph-document-1:project-object:project-file-1:graph-document-1:object-a',
  rowKind: 'graph-rebuild-object',
  depth: 1,
  treeGuides: [],
  graphDocumentId: 'graph-document-1',
  objectRowId: 'project-object:project-file-1:graph-document-1:object-a',
  objectSourceKind: 'published-object',
  buildState: 'rebuild',
  buildStateLabel: 'Rebuild',
  resolutionState: 'resolved',
  sourceOutputEntryId: 'output-entry:s001:node-a',
  sourceNodeId: 'node-a',
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-a',
  iconLabel: 'O',
  label: 'Object A',
  meta: '',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
}

const graphNodeRow: BrowserRenderableRowVm = {
  rowId: 'graph-node-row:graph-document-1:node-a',
  rowKind: 'graph-node',
  depth: 1,
  treeGuides: [],
  graphDocumentId: 'graph-document-1',
  nodeId: 'node-a',
  nodeType: 'Part/Cube',
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-a',
  iconLabel: 'N',
  label: 'Cube',
  meta: 'Part/Cube | node-a',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
}

const viewportRow: BrowserRenderableRowVm = {
  rowId: 'viewport-row:editor-viewport-1',
  rowKind: 'viewport',
  depth: 0,
  treeGuides: [],
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

const referenceItemRow: BrowserRenderableRowVm = {
  rowId: 'reference-item-row:shoe:shoe-1',
  rowKind: 'reference-item',
  depth: 2,
  treeGuides: [],
  referenceId: 'shoe:shoe-1',
  sourceKind: 'manifest',
  categoryId: 'shoes',
  fileType: 'glb',
  assetPath: '/Catalog/shoes/Shoe_1.glb',
  isVisible: false,
  state: 'dormant',
  stateLabel: 'Dormant',
  errorMessage: null,
  iconLabel: 'R',
  label: 'Shoe 1',
  meta: 'GLB',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  showOverflowButton: false,
}

const importedContentObjectRow: BrowserRenderableRowVm = {
  rowId: 'reference-item-row:shoe:shoe-1',
  rowKind: 'object',
  depth: 1,
  treeGuides: [],
  isVisible: true,
  visibilityPartKeys: [],
  buildState: 'done',
  buildStateLabel: 'Imported',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: null,
  parentComponentId: null,
  objectSourceKind: null,
  sourceGraphDocumentId: null,
  sourceOutputEntryId: null,
  slotId: null,
  sourceNodeId: null,
  resolutionState: null,
  highlightViewerKey: null,
  authoringGraphDocumentId: null,
  authoringNodeId: null,
  contentOriginKind: 'imported-reference',
  referenceId: 'shoe:shoe-1',
  referenceSourceKind: 'imported',
  referenceState: 'active',
  fileType: 'glb',
  assetPath: '/Catalog/shoes/Shoe_1.glb',
  errorMessage: null,
  iconLabel: 'O',
  label: 'Shoe 1',
  meta: 'GLB',
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
  onActivateGraphTarget: vi.fn(),
  onTransformReference: vi.fn(),
  onRevealGraph: vi.fn(),
  onFocusViewport: vi.fn(),
  onCloseViewport: vi.fn(),
})

describe('runBrowserRowAction', () => {
  it('reveals a graph row through the graph reveal handler when shared composition is not active', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(graphRow, action('reveal'), nextHandlers)

    expect(nextHandlers.onRevealGraph).toHaveBeenCalledWith('graph-document-1')
  })

  it('routes a graph rebuild row back through view-in-graph targeting', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(graphRebuildRow, action('view-in-graph'), nextHandlers)

    expect(nextHandlers.onActivateGraphTarget).toHaveBeenCalledWith('graph-document-1', 'node-a', {
      fitCanvasInViewport: true,
    })
  })

  it('routes a graph node row through the same authoring jump path', () => {
    const nextHandlers = handlers(true)

    runBrowserRowAction(graphNodeRow, action('view-in-graph'), nextHandlers)

    expect(nextHandlers.onActivateGraphTarget).toHaveBeenCalledWith('graph-document-1', 'node-a', {
      fitCanvasInViewport: true,
    })
  })

  it('still routes reveal through the graph reveal handler while shared composition is active', () => {
    const nextHandlers = handlers(true)

    runBrowserRowAction(graphRow, action('reveal'), nextHandlers)

    expect(nextHandlers.onRevealGraph).toHaveBeenCalledWith('graph-document-1')
  })

  it('routes content trace actions through view-in-graph instead of reveal targeting', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(
      {
        rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
        rowKind: 'object',
        depth: 1,
        treeGuides: [],
        isVisible: true,
        visibilityPartKeys: ['s001'],
        buildState: 'rebuild',
        buildStateLabel: 'Rebuild',
        rebuildGraphDocumentIds: ['graph-document-1'],
        ownerGraphDocumentId: 'graph-document-1',
        parentComponentId: null,
        objectSourceKind: 'published-object',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: 'output-entry:s001:node-a',
        slotId: 's001',
        sourceNodeId: 'node-a',
        resolutionState: 'resolved',
        highlightViewerKey: 's001',
        authoringGraphDocumentId: 'graph-document-1',
        authoringNodeId: 'node-a',
        iconLabel: 'O',
        label: 'Pedal Body',
        meta: 'Graph 1',
        isSelected: false,
        isExpandable: false,
        isExpanded: false,
        actions: [],
      },
      action('view-in-graph'),
      nextHandlers,
    )

    expect(nextHandlers.onActivateGraphTarget).toHaveBeenCalledWith('graph-document-1', 'node-a', {
      fitCanvasInViewport: true,
    })
    expect(nextHandlers.onRevealGraph).not.toHaveBeenCalled()
  })

  it('routes a reference transform action through the reference transform handler', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(referenceItemRow, action('transform-object'), nextHandlers)

    expect(nextHandlers.onTransformReference).toHaveBeenCalledWith('shoe:shoe-1')
  })

  it('routes imported content-object transform actions through the reference transform handler', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(importedContentObjectRow, action('transform-object'), nextHandlers)

    expect(nextHandlers.onTransformReference).toHaveBeenCalledWith('shoe:shoe-1')
  })

  it('keeps explicit viewport focus movement separate from row-body selection', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(viewportRow, action('focus'), nextHandlers)

    expect(nextHandlers.onFocusViewport).toHaveBeenCalledWith('editor-viewport-1')
  })

  it('routes graph document open and editor actions through the shared graph-target handler', () => {
    const nextHandlers = handlers(false)

    runBrowserRowAction(graphRow, action('open'), nextHandlers)
    runBrowserRowAction(graphRow, action('new-editor'), nextHandlers)
    runBrowserRowAction(graphRow, action('swap-editor'), nextHandlers)

    expect(nextHandlers.onActivateGraphTarget).toHaveBeenNthCalledWith(
      1,
      'graph-document-1',
      null,
      {
        strategy: 'open-or-focus',
        fitCanvasInViewport: true,
      },
    )
    expect(nextHandlers.onActivateGraphTarget).toHaveBeenNthCalledWith(
      2,
      'graph-document-1',
      null,
      {
        strategy: 'open-new',
        fitCanvasInViewport: true,
      },
    )
    expect(nextHandlers.onActivateGraphTarget).toHaveBeenNthCalledWith(
      3,
      'graph-document-1',
      null,
      {
        strategy: 'swap-focused-or-open',
        fitCanvasInViewport: true,
      },
    )
  })
})
