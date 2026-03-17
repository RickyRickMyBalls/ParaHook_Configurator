import { describe, expect, it } from 'vitest'
import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type { BrowserGraphRowVm } from './selectBrowserGraphRows'
import { selectBrowserTreeRows } from './selectBrowserTreeRows'
import type { ReferenceWorkspaceBrowserTreeVm } from '../store/useAppStore'

const graphDocument = (
  graphDocumentId: string,
  name: string,
  nodes: GraphDocument['graph']['nodes'] = [],
): GraphDocument => ({
  graphDocumentId,
  name,
  version: 1,
  graph: {
    schemaVersion: 1,
    nodes,
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
      slotId: 's001',
      sourceNodeId: 'node-a',
      label: 's001',
      meta: 'Resolved | baseplate | Build 7',
      state: 'resolved',
      highlightViewerKey: 's001',
      authoringGraphDocumentId: 'graph-document-1',
      authoringNodeId: 'node-a',
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

const emptyReferenceWorkspaceTree: ReferenceWorkspaceBrowserTreeVm = {
  rowId: 'reference-root',
  label: 'References',
  isExpanded: true,
  categories: [
    {
      rowId: 'reference-category-row:footpads',
      categoryId: 'footpads',
      label: 'Footpads',
      isExpanded: true,
      itemCount: 0,
      visibleItemCount: 0,
      hasLoadingItem: false,
      hasErrorItem: false,
      emptyLabel: 'No loadable references yet.',
      items: [],
    },
    {
      rowId: 'reference-category-row:shoes',
      categoryId: 'shoes',
      label: 'Shoes',
      isExpanded: true,
      itemCount: 0,
      visibleItemCount: 0,
      hasLoadingItem: false,
      hasErrorItem: false,
      emptyLabel: 'No loadable references yet.',
      items: [],
    },
    {
      rowId: 'reference-category-row:premade-foothooks',
      categoryId: 'premade-foothooks',
      label: 'Premade Foothooks',
      isExpanded: true,
      itemCount: 0,
      visibleItemCount: 0,
      hasLoadingItem: false,
      hasErrorItem: false,
      emptyLabel: 'No loadable references yet.',
      items: [],
    },
    {
      rowId: 'reference-category-row:user-references',
      categoryId: 'user-references',
      label: 'User References',
      isExpanded: true,
      itemCount: 0,
      visibleItemCount: 0,
      hasLoadingItem: false,
      hasErrorItem: false,
      emptyLabel: 'No imported references yet.',
      items: [],
    },
  ],
}

describe('selectBrowserTreeRows', () => {
  it('builds graph rows with child sections instead of published-output rows', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      contentRows: [],
      graphRows: [graphRow()],
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: 'graph-row:graph-document-1',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: ['graph-document-1'],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.graphRows).toEqual([
      {
        rowId: 'graph-row:graph-document-1',
        rowKind: 'graph-document',
        depth: 0,
        treeGuides: [],
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
            rowId: 'graph-section-row:graph-document-1:needs-rebuild',
            rowKind: 'graph-section',
            depth: 1,
            treeGuides: ['tee'],
            graphDocumentId: 'graph-document-1',
            sectionKind: 'needs-rebuild',
            childCount: 0,
            emptyLabel: '',
            iconLabel: '!',
            label: 'Needs Rebuild',
            meta: '0 objects',
            isSelected: false,
            isExpandable: true,
            isExpanded: true,
            actions: [],
          },
          {
            rowId: 'graph-section-row:graph-document-1:nodes',
            rowKind: 'graph-section',
            depth: 1,
            treeGuides: ['elbow'],
            graphDocumentId: 'graph-document-1',
            sectionKind: 'nodes',
            childCount: 0,
            emptyLabel: 'No graph nodes.',
            iconLabel: 'N',
            label: 'Nodes',
            meta: '0 nodes',
            isSelected: false,
            isExpandable: true,
            isExpanded: false,
            actions: [],
          },
        ],
      },
    ])
    expect(rows.contentRows).toEqual([])
  })

  it('keeps Browser selection local and separates it from viewport focus state', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      contentRows: [],
      graphRows: [graphRow()],
      editorViewports: [editorViewport({ isFocused: true, zOrder: 5 })],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: 'graph-section-row:graph-document-1:nodes',
      collapsedContentRowIds: [],
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
    expect(rows.graphRows[0].children[1]).toMatchObject({
      isSelected: true,
      rowKind: 'graph-section',
    })
    expect(rows.viewportRows).toEqual([
      {
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
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      contentRows: [],
      graphRows: [graphRow()],
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: null,
      collapsedContentRowIds: [],
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
      rowKind: 'graph-section',
      label: 'Needs Rebuild',
    })
  })

  it('renders Needs Rebuild before Nodes and filters graph child rows to stale produced objects plus graph nodes', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      contentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:object-a',
          kind: 'object',
          label: 'Object A',
          meta: '',
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
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:object-b',
          kind: 'object',
          label: 'Object B',
          meta: '',
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s002:node-b',
          slotId: 's002',
          sourceNodeId: 'node-b',
          resolutionState: 'resolved',
          highlightViewerKey: 's002',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-b',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:object-c',
          kind: 'object',
          label: 'Object C',
          meta: '',
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s003:node-c',
          slotId: 's003',
          sourceNodeId: 'node-c',
          resolutionState: 'unresolved',
          highlightViewerKey: null,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-c',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:object-d',
          kind: 'object',
          label: 'Receive Object',
          meta: '',
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'receive-link',
          sourceGraphDocumentId: 'graph-document-2',
          sourceOutputEntryId: 'output-entry:s004:node-d',
          slotId: null,
          sourceNodeId: null,
          resolutionState: 'unresolved',
          highlightViewerKey: null,
          authoringGraphDocumentId: 'graph-document-2',
          authoringNodeId: null,
        },
      ],
      graphRows: [graphRow()],
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1', [
          { nodeId: 'node-a', type: 'Part/Cube', params: {} },
          { nodeId: 'node-b', type: 'System/OutputPreview', params: {} },
        ]),
      },
      selectedRowId: 'graph-node-row:graph-document-1:node-b',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: ['graph-document-1'],
      graphSectionExpandedByRowId: {
        'graph-section-row:graph-document-1:nodes': true,
      },
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.graphRows[0]?.children.map((row) => row.rowId)).toEqual([
      'graph-section-row:graph-document-1:needs-rebuild',
      'graph-rebuild-row:graph-document-1:project-object:project-file-1:graph-document-1:object-a',
      'graph-rebuild-row:graph-document-1:project-object:project-file-1:graph-document-1:object-c',
      'graph-section-row:graph-document-1:nodes',
      'graph-node-row:graph-document-1:node-a',
      'graph-node-row:graph-document-1:node-b',
    ])
    expect(rows.graphRows[0]?.children[1]).toMatchObject({
      rowKind: 'graph-rebuild-object',
      label: 'Object A',
      buildState: 'rebuild',
    })
    expect(rows.graphRows[0]?.children[2]).toMatchObject({
      rowKind: 'graph-rebuild-object',
      label: 'Object C',
      resolutionState: 'unresolved',
      statusLabel: 'Unresolved',
    })
    expect(rows.graphRows[0]?.children[5]).toMatchObject({
      rowKind: 'graph-node',
      label: 'OutputPreview',
      isSelected: true,
    })
  })

  it('maps component and object content rows into the shared Browser row shell', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      contentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          statusLabel: 'Ready',
          statusTone: 'ready',
        },
        {
          rowId: 'project-component:project-file-1:graph-document-1:published',
          kind: 'component',
          label: 'Pedal Component',
          meta: 'Graph 1',
          statusLabel: 'Ready',
          statusTone: 'ready',
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s001:node-a',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 's001',
          sourceNodeId: 'node-a',
          highlightViewerKey: 's001',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          kind: 'object',
          label: 'Pedal Body',
          meta: '',
          statusLabel: 'Unresolved',
          statusTone: 'warning',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s001:node-a',
          slotId: 's001',
          sourceNodeId: 'node-a',
          resolutionState: 'unresolved',
          highlightViewerKey: null,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
      ],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: 'project-object:project-file-1:graph-document-1:pedal-body',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

      expect(rows.contentRows).toEqual([
        {
          rowId: 'assembly-root:project-file-1',
          rowKind: 'assembly',
          depth: 0,
          treeGuides: ['elbow'],
          buildState: 'done',
          buildStateLabel: '',
          rebuildGraphDocumentIds: [],
          iconLabel: 'A',
          label: 'Assembly 1',
          meta: '',
        statusLabel: 'Ready',
        statusTone: 'ready',
        isSelected: false,
        isExpandable: true,
        isExpanded: true,
        actions: [],
      },
      {
        rowId: 'project-component:project-file-1:graph-document-1:published',
        rowKind: 'component',
          depth: 1,
          treeGuides: ['none', 'tee'],
          buildState: 'done',
          buildStateLabel: '',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: 'output-entry:s001:node-a',
        componentSourceKind: 'published-component',
        resolutionState: 'resolved',
        receiveId: null,
        slotId: 's001',
        sourceNodeId: 'node-a',
        highlightViewerKey: 's001',
        authoringGraphDocumentId: 'graph-document-1',
        authoringNodeId: 'node-a',
        iconLabel: 'C',
        label: 'Pedal Component',
        meta: 'Graph 1',
          statusLabel: 'Ready',
          statusTone: 'ready',
          isSelected: false,
          isExpandable: true,
          isExpanded: true,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: 'View Pedal Component in graph',
            },
          ],
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          rowKind: 'object',
          depth: 2,
          treeGuides: ['none', 'none', 'elbow'],
          buildState: 'done',
          buildStateLabel: '',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
        parentComponentId: 'project-component:project-file-1:graph-document-1:published',
        objectSourceKind: 'published-object',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: 'output-entry:s001:node-a',
        slotId: 's001',
        sourceNodeId: 'node-a',
        resolutionState: 'unresolved',
        highlightViewerKey: null,
        authoringGraphDocumentId: 'graph-document-1',
        authoringNodeId: 'node-a',
        iconLabel: 'O',
        label: 'Pedal Body',
        meta: '',
          statusLabel: 'Unresolved',
          statusTone: 'warning',
          isSelected: true,
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: 'View Pedal Body in graph',
            },
          ],
        },
      ])
    expect(rows.graphRows).toEqual([])
    expect(rows.viewportRows).toEqual([])
  })

  it('filters descendant content rows by local collapsed state', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      contentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'project-component:project-file-1:graph-document-1:published',
          kind: 'component',
          label: 'Pedal Component',
          meta: '1 Object',
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s001:node-a',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 's001',
          sourceNodeId: 'node-a',
          highlightViewerKey: 's001',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          kind: 'object',
          label: 'Pedal Body',
          meta: '',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s001:node-a',
          slotId: 's001',
          sourceNodeId: 'node-a',
          resolutionState: 'resolved',
          highlightViewerKey: 's001',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
      ],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: null,
      collapsedContentRowIds: ['project-component:project-file-1:graph-document-1:published'],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.contentRows.map((row) => row.rowId)).toEqual([
      'assembly-root:project-file-1',
      'project-component:project-file-1:graph-document-1:published',
    ])
    expect(rows.contentRows[1]).toMatchObject({
      rowKind: 'component',
      treeGuides: ['none', 'elbow'],
      isExpandable: true,
      isExpanded: false,
    })
  })

  it('renders singleton root objects directly under the assembly without a component row', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      contentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:output-object:s001',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
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
        },
      ],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: 'project-object:project-file-1:graph-document-1:output-object:s001',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

      expect(rows.contentRows).toEqual([
        {
          rowId: 'assembly-root:project-file-1',
          rowKind: 'assembly',
          depth: 0,
          treeGuides: ['elbow'],
          buildState: 'done',
          buildStateLabel: '',
          rebuildGraphDocumentIds: [],
          iconLabel: 'A',
          label: 'Assembly 1',
          meta: '',
        isSelected: false,
        isExpandable: true,
        isExpanded: true,
        actions: [],
      },
        {
          rowId: 'project-object:project-file-1:graph-document-1:output-object:s001',
          rowKind: 'object',
          depth: 1,
          treeGuides: ['none', 'elbow'],
          buildState: 'done',
          buildStateLabel: '',
          rebuildGraphDocumentIds: [],
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
          label: 'Object 1',
          meta: 'Graph 1',
          isSelected: true,
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: 'View Object 1 in graph',
            },
          ],
        },
      ])
  })

  it('renders STEP reference rows as normal items and prefers loading over error in aggregate category state', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          {
            rowId: 'reference-category-row:premade-foothooks',
            categoryId: 'premade-foothooks',
            label: 'Premade Foothooks',
            isExpanded: true,
            itemCount: 2,
            visibleItemCount: 1,
            hasLoadingItem: true,
            hasErrorItem: true,
            emptyLabel: 'No loadable references yet.',
            items: [
              {
                rowId: 'reference-item-row:hook:large',
                referenceId: 'hook:large',
                sourceKind: 'manifest',
                label: 'Large',
                categoryId: 'premade-foothooks',
                fileType: 'step',
                assetPath: '/ReferenceModels/hooks/large.step',
                isVisible: true,
                loadState: 'loading',
                errorMessage: null,
              },
              {
                rowId: 'reference-item-row:hook:medium',
                referenceId: 'hook:medium',
                sourceKind: 'manifest',
                label: 'Medium',
                categoryId: 'premade-foothooks',
                fileType: 'step',
                assetPath: '/ReferenceModels/hooks/medium.step',
                isVisible: false,
                loadState: 'error',
                errorMessage: 'STEP import failed',
              },
            ],
          },
        ],
      },
      contentRows: [],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: 'reference-item-row:hook:large',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.referenceRows).toEqual([
      expect.objectContaining({
        rowId: 'reference-root',
        rowKind: 'references-root',
        treeGuides: ['elbow'],
        state: 'loading',
        stateLabel: 'Loading',
      }),
      expect.objectContaining({
        rowId: 'reference-category-row:premade-foothooks',
        rowKind: 'reference-category',
        treeGuides: ['none', 'elbow'],
        state: 'loading',
        stateLabel: 'Loading',
      }),
      expect.objectContaining({
        rowId: 'reference-item-row:hook:large',
        rowKind: 'reference-item',
        treeGuides: ['none', 'none', 'tee'],
        meta: 'STEP',
        state: 'loading',
        stateLabel: 'Loading',
        isSelected: true,
        showOverflowButton: false,
        actions: [
          {
            actionId: 'transform-object',
            label: 'Transform Object',
            ariaLabel: 'Transform Large',
          },
        ],
      }),
      expect.objectContaining({
        rowId: 'reference-item-row:hook:medium',
        rowKind: 'reference-item',
        treeGuides: ['none', 'none', 'elbow'],
        meta: 'STEP',
        state: 'error',
        stateLabel: 'Error',
        errorMessage: 'STEP import failed',
      }),
    ])
  })

  it('renders imported references under User References and preserves imported source kind on item rows', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          {
            rowId: 'reference-category-row:user-references',
            categoryId: 'user-references',
            label: 'User References',
            isExpanded: true,
            itemCount: 1,
            visibleItemCount: 1,
            hasLoadingItem: false,
            hasErrorItem: false,
            emptyLabel: 'No imported references yet.',
            items: [
              {
                rowId: 'reference-item-row:reference-import:1',
                referenceId: 'reference-import:1',
                sourceKind: 'imported',
                label: 'shoe.glb',
                categoryId: 'user-references',
                fileType: 'glb',
                assetPath: 'blob:shoe-1',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
        ],
      },
      contentRows: [],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: 'reference-item-row:reference-import:1',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.referenceRows).toEqual([
      expect.objectContaining({
        rowId: 'reference-root',
        state: 'visible',
        stateLabel: 'On',
      }),
      expect.objectContaining({
        rowId: 'reference-category-row:user-references',
        label: 'User References',
        state: 'visible',
        stateLabel: 'On',
      }),
      expect.objectContaining({
        rowId: 'reference-item-row:reference-import:1',
        sourceKind: 'imported',
        meta: 'GLB',
        state: 'visible',
        stateLabel: 'On',
        isSelected: true,
        showOverflowButton: false,
      }),
    ])
  })
})
