import { describe, expect, it } from 'vitest'
import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type { BrowserGraphRowVm } from './selectBrowserGraphRows'
import { selectBrowserTreeRows } from './selectBrowserTreeRows'
import type { BrowserBuildPolicy, ReferenceWorkspaceBrowserTreeVm } from '../store/useAppStore'

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
  authoredBrowserBuildPolicy?: BrowserBuildPolicy | null
  effectiveBrowserBuildPolicy?: BrowserBuildPolicy
  effectiveBrowserBuildPolicySource?: 'self' | 'graph' | 'assembly' | 'component' | 'default'
  effectiveBrowserBuildPolicySourceLabel?: string | null
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
  authoredBrowserBuildPolicy: options?.authoredBrowserBuildPolicy ?? null,
  effectiveBrowserBuildPolicy: options?.effectiveBrowserBuildPolicy ?? 'live',
  effectiveBrowserBuildPolicySource: options?.effectiveBrowserBuildPolicySource ?? 'default',
  effectiveBrowserBuildPolicySourceLabel: options?.effectiveBrowserBuildPolicySourceLabel ?? null,
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
        authoredBrowserBuildPolicy: null,
        effectiveBrowserBuildPolicy: 'live',
        effectiveBrowserBuildPolicySource: 'default',
        effectiveBrowserBuildPolicySourceLabel: null,
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
    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
      expect.objectContaining({
        rowId: 'reference-root',
        rowKind: 'assembly',
        referenceContainerKind: 'root',
        label: 'References',
      }),
      expect.objectContaining({
        rowId: 'reference-category-row:footpads',
        rowKind: 'component',
        referenceContainerKind: 'category',
        label: 'Footpads',
      }),
      expect.objectContaining({
        rowId: 'reference-category-row:shoes',
        rowKind: 'component',
        referenceContainerKind: 'category',
        label: 'Shoes',
      }),
      expect.objectContaining({
        rowId: 'reference-category-row:premade-foothooks',
        rowKind: 'component',
        referenceContainerKind: 'category',
        label: 'Premade Foothooks',
      }),
      ]),
    )
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
          {
            actionId: 'close',
            label: 'Close',
            ariaLabel: 'Close Graph 1',
          },
        ],
      },
    ])
  })

  it('marks every explicit root row selected while keeping descendant grouped rows softer', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      contentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          visibilityPartKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
        },
        {
          rowId: 'component-1',
          kind: 'component',
          label: 'Component 1',
          meta: '2 Objects',
          visibilityPartKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 2,
          slotId: 'slot-a',
          sourceNodeId: 'node-1',
          highlightViewerKey: 'slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-1',
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
          visibilityPartKeys: ['graph-document-1:slot-a'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-1',
          slotId: 'slot-a',
          sourceNodeId: 'node-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-1',
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: 'Graph 1',
          visibilityPartKeys: ['graph-document-1:slot-b'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-2',
          slotId: 'slot-b',
          sourceNodeId: 'node-2',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-b',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-2',
        },
      ],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: 'object-2',
      selectedRowIds: ['component-1', 'object-2'],
      groupedSelectedRowIds: ['object-1'],
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: false,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    const componentRow = rows.contentRows.find((row) => row.rowId === 'component-1')
    const objectRow = rows.contentRows.find((row) => row.rowId === 'object-2')
    const groupedObjectRow = rows.contentRows.find((row) => row.rowId === 'object-1')

    expect(componentRow?.isSelected).toBe(true)
    expect(objectRow?.isSelected).toBe(true)
    expect(groupedObjectRow?.isGroupedSelected).toBe(true)
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

  it('derives effective browser build policy from graph, assembly, and component authored overrides', () => {
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
          rowId: 'component-1',
          kind: 'component',
          label: 'Pedal Component',
          meta: 'Graph 1',
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-a:node-a',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 2,
          slotId: 'slot-a',
          sourceNodeId: 'node-a',
          highlightViewerKey: 'slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-a:node-a',
          slotId: 'slot-a',
          sourceNodeId: 'node-a',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-b:node-b',
          slotId: 'slot-b',
          sourceNodeId: 'node-b',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-b',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-b',
        },
      ],
      graphRows: [graphRow()],
      browserGraphBuildPolicyByGraphDocumentId: {
        'graph-document-1': 'manual',
      },
      browserContentBuildPolicyByRowId: {
        'component-1': 'release',
        'object-2': 'off',
      },
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: null,
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: ['graph-document-1'],
      hasActiveEditorViewport: false,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.graphRows[0]).toMatchObject({
      authoredBrowserBuildPolicy: 'manual',
      effectiveBrowserBuildPolicy: 'manual',
      effectiveBrowserBuildPolicySource: 'self',
      effectiveBrowserBuildPolicySourceLabel: 'Graph 1',
    })
    expect(rows.contentRows.find((row) => row.rowId === 'assembly-root:project-file-1')).toMatchObject({
      rowKind: 'assembly',
      authoredBrowserBuildPolicy: null,
      effectiveBrowserBuildPolicy: 'live',
      effectiveBrowserBuildPolicySource: 'default',
      effectiveBrowserBuildPolicySourceLabel: null,
    })
    expect(
      rows.contentRows.find(
        (row) => row.rowId === 'component-1',
      ),
    ).toMatchObject({
      rowKind: 'component',
      authoredBrowserBuildPolicy: 'release',
      effectiveBrowserBuildPolicy: 'release',
      effectiveBrowserBuildPolicySource: 'self',
      effectiveBrowserBuildPolicySourceLabel: 'Pedal Component',
    })
    expect(rows.contentRows.find((row) => row.rowId === 'object-1')).toMatchObject({
      rowKind: 'object',
      authoredBrowserBuildPolicy: null,
      effectiveBrowserBuildPolicy: 'release',
      effectiveBrowserBuildPolicySource: 'component',
      effectiveBrowserBuildPolicySourceLabel: 'Pedal Component',
    })
    expect(rows.contentRows.find((row) => row.rowId === 'object-2')).toMatchObject({
      rowKind: 'object',
      authoredBrowserBuildPolicy: 'off',
      effectiveBrowserBuildPolicy: 'off',
      effectiveBrowserBuildPolicySource: 'self',
      effectiveBrowserBuildPolicySourceLabel: 'Object 2',
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

    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
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
      }),
      expect.objectContaining({
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
        }),
        expect.objectContaining({
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
        }),
      ]),
    )
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
      'reference-root',
      'reference-category-row:footpads',
      'reference-category-row:shoes',
      'reference-category-row:premade-foothooks',
      'assembly-root:project-file-1',
      'project-component:project-file-1:graph-document-1:published',
    ])
    expect(
      rows.contentRows.find(
        (row) => row.rowId === 'project-component:project-file-1:graph-document-1:published',
      ),
    ).toMatchObject({
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

    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
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
      }),
        expect.objectContaining({
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
        }),
      ]),
    )
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
                parts: [],
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
                parts: [],
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

    expect(rows.referenceRows).toEqual([])
    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
      expect.objectContaining({
        rowId: 'reference-root',
        rowKind: 'assembly',
        iconLabel: 'A',
        treeGuides: ['elbow'],
        referenceContainerKind: 'root',
        referenceContainerState: 'loading',
        referenceContainerStateLabel: 'Loading',
      }),
      expect.objectContaining({
        rowId: 'reference-category-row:premade-foothooks',
        rowKind: 'component',
        iconLabel: 'C',
        treeGuides: ['none', 'tee'],
        referenceContainerKind: 'category',
        referenceContainerState: 'loading',
        referenceContainerStateLabel: 'Loading',
      }),
      expect.objectContaining({
        rowId: 'reference-item-row:hook:large',
        rowKind: 'object',
        contentOriginKind: 'source-reference',
        iconLabel: 'O',
        treeGuides: ['none', 'none', 'tee'],
        meta: 'STEP',
        referenceState: 'loading',
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
        rowKind: 'object',
        contentOriginKind: 'source-reference',
        iconLabel: 'O',
        treeGuides: ['none', 'none', 'elbow'],
        meta: 'STEP',
        referenceState: 'error',
        errorMessage: 'STEP import failed',
      }),
      ]),
    )
  })

  it('renders imported references inside the content hierarchy when they have a landing parent', () => {
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
                parentAssemblyId: 'assembly-1',
                parentComponentId: null,
                parts: [],
              },
            ],
          },
        ],
      },
      contentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
      ],
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

    expect(rows.referenceRows).toEqual([])
    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
      expect.objectContaining({
        rowId: 'reference-root',
        rowKind: 'assembly',
        referenceContainerKind: 'root',
        referenceContainerState: 'dormant',
        referenceContainerStateLabel: 'Dormant',
      }),
      expect.objectContaining({
        rowId: 'assembly-1',
        rowKind: 'assembly',
      }),
      expect.objectContaining({
        rowId: 'reference-item-row:reference-import:1',
        rowKind: 'object',
        contentOriginKind: 'imported-reference',
        referenceId: 'reference-import:1',
        referenceSourceKind: 'imported',
        meta: 'GLB',
        referenceState: 'active',
        isSelected: true,
      }),
      ]),
    )
  })

  it('moves manifest library objects into the content hierarchy when they gain a landing parent', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          {
            rowId: 'reference-category-row:shoes',
            categoryId: 'shoes',
            label: 'Shoes',
            isExpanded: true,
            itemCount: 1,
            visibleItemCount: 1,
            hasLoadingItem: false,
            hasErrorItem: false,
            emptyLabel: 'No loadable references yet.',
            items: [
              {
                rowId: 'reference-item-row:shoe:shoe-1',
                referenceId: 'shoe:shoe-1',
                sourceKind: 'manifest',
                label: 'Shoe 1',
                categoryId: 'shoes',
                fileType: 'glb',
                assetPath: '/ReferenceModels/shoes/shoe-1.glb',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
                parentAssemblyId: 'assembly-1',
                parentComponentId: null,
                parts: [],
              },
              {
                rowId: 'reference-item-row:shoe:shoe-2',
                referenceId: 'shoe:shoe-2',
                sourceKind: 'manifest',
                label: 'Shoe 2',
                categoryId: 'shoes',
                fileType: 'glb',
                assetPath: '/ReferenceModels/shoes/shoe-2.glb',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
                parentAssemblyId: null,
                parentComponentId: null,
                parts: [],
              },
            ],
          },
        ],
      },
      contentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
      ],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: 'reference-item-row:shoe:shoe-1',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.referenceRows).toEqual([])
    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
      expect.objectContaining({
        rowId: 'reference-root',
        rowKind: 'assembly',
        referenceContainerKind: 'root',
      }),
      expect.objectContaining({
        rowId: 'reference-category-row:shoes',
        rowKind: 'component',
        referenceContainerKind: 'category',
        referenceContainerItemCount: 1,
      }),
      expect.objectContaining({
        rowId: 'reference-item-row:shoe:shoe-2',
        rowKind: 'object',
        contentOriginKind: 'source-reference',
      }),
      expect.objectContaining({
        rowId: 'assembly-1',
        rowKind: 'assembly',
      }),
      expect.objectContaining({
        rowId: 'reference-item-row:shoe:shoe-1',
        rowKind: 'object',
        contentOriginKind: 'imported-reference',
        referenceSourceKind: 'manifest',
        isSelected: true,
      }),
      ]),
    )
  })

  it('renders part rows under landed reference-backed objects when real part structure is available', () => {
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
                parentAssemblyId: 'assembly-1',
                parentComponentId: null,
                parts: [
                  {
                    rowId: 'reference-part-row:reference-part:reference-import:1:0',
                    partKey: 'reference-part:reference-import:1:0',
                    label: 'Upper',
                  },
                  {
                    rowId: 'reference-part-row:reference-part:reference-import:1:1',
                    partKey: 'reference-part:reference-import:1:1',
                    label: 'Sole',
                  },
                ],
              },
            ],
          },
        ],
      },
      contentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
      ],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: 'reference-part-row:reference-part:reference-import:1:1',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowId: 'assembly-1',
          rowKind: 'assembly',
        }),
        expect.objectContaining({
          rowId: 'reference-item-row:reference-import:1',
          rowKind: 'object',
          contentOriginKind: 'imported-reference',
          isExpandable: true,
          isExpanded: true,
        }),
        expect.objectContaining({
          rowId: 'reference-part-row:reference-part:reference-import:1:0',
          rowKind: 'part',
          label: 'Upper',
          parentReferenceId: 'reference-import:1',
          isSelected: false,
        }),
        expect.objectContaining({
          rowId: 'reference-part-row:reference-part:reference-import:1:1',
          rowKind: 'part',
          label: 'Sole',
          parentReferenceId: 'reference-import:1',
          isSelected: true,
        }),
      ]),
    )
  })

  it('derives aggregate root and category progress from the active reference batch without changing item bars', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          {
            rowId: 'reference-category-row:footpads',
            categoryId: 'footpads',
            label: 'Footpads',
            isExpanded: true,
            itemCount: 1,
            visibleItemCount: 1,
            hasLoadingItem: false,
            hasErrorItem: false,
            emptyLabel: 'No loadable references yet.',
            items: [
              {
                rowId: 'reference-item-row:footpad:pubpad-full-assembly',
                referenceId: 'footpad:pubpad-full-assembly',
                sourceKind: 'manifest',
                label: 'PubPad Full Assembly',
                categoryId: 'footpads',
                fileType: 'obj',
                assetPath: 'ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
                parts: [],
              },
            ],
          },
          {
            rowId: 'reference-category-row:shoes',
            categoryId: 'shoes',
            label: 'Shoes',
            isExpanded: true,
            itemCount: 2,
            visibleItemCount: 2,
            hasLoadingItem: true,
            hasErrorItem: false,
            emptyLabel: 'No loadable references yet.',
            items: [
              {
                rowId: 'reference-item-row:shoe:shoe-1',
                referenceId: 'shoe:shoe-1',
                sourceKind: 'manifest',
                label: 'Shoe 1',
                categoryId: 'shoes',
                fileType: 'glb',
                assetPath: 'shoe-1.glb',
                isVisible: true,
                loadState: 'loading',
                errorMessage: null,
                parts: [],
              },
              {
                rowId: 'reference-item-row:shoe:shoe-2',
                referenceId: 'shoe:shoe-2',
                sourceKind: 'manifest',
                label: 'Shoe 2',
                categoryId: 'shoes',
                fileType: 'glb',
                assetPath: 'shoe-2.glb',
                isVisible: true,
                loadState: 'unloaded',
                errorMessage: null,
                parts: [],
              },
            ],
          },
        ],
      },
      referenceLoadBatch: {
        requestId: 'reference-load-batch:1',
        source: 'root-load-all',
        scopeLabel: 'References',
        targetIds: ['footpad:pubpad-full-assembly', 'shoe:shoe-1', 'shoe:shoe-2'],
        remainingIds: ['shoe:shoe-2'],
        activeReferenceId: 'shoe:shoe-1',
        completedIds: ['footpad:pubpad-full-assembly'],
        failedIds: ['shoe:shoe-1'],
        startedAt: 1,
      },
      contentRows: [],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: 'reference-category-row:shoes',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.referenceRows).toEqual([])
    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowId: 'reference-root',
          rowKind: 'assembly',
          referenceContainerState: 'loading',
          referenceContainerProgress01: 2 / 3,
        }),
        expect.objectContaining({
          rowId: 'reference-category-row:footpads',
          rowKind: 'component',
          referenceContainerState: 'loading',
          referenceContainerProgress01: 1,
        }),
        expect.objectContaining({
          rowId: 'reference-category-row:shoes',
          rowKind: 'component',
          referenceContainerState: 'loading',
          referenceContainerProgress01: 1 / 2,
          isSelected: true,
        }),
        expect.objectContaining({
          rowId: 'reference-item-row:shoe:shoe-1',
          rowKind: 'object',
          contentOriginKind: 'source-reference',
          referenceState: 'loading',
        }),
      ]),
    )
  })

  it('renders the authored Sketches content family as a collapsible browser root with sketch rows', () => {
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
          rowId: 'project-sketches-root:project-file-1',
          kind: 'sketches-root',
          label: 'Sketches',
          meta: '1 sketch',
          sketchCount: 1,
        },
        {
          rowId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
          kind: 'sketch',
          label: 'Sketch 1',
          meta: 'Graph 1 | XY | 4 comps | 1 profile',
          isVisible: false,
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          statusLabel: 'Ready',
          statusTone: 'ready',
          ownerGraphDocumentId: 'graph-document-1',
          graphDocumentId: 'graph-document-1',
          nodeId: 'node-sketch-1',
          featureId: 'sketch-1',
          plane: 'XY',
          componentCount: 4,
          profileCount: 1,
          diagnosticsCount: 0,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-sketch-1',
        },
      ],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowId: 'project-sketches-root:project-file-1',
          rowKind: 'sketches-root',
          iconLabel: 'S',
          label: 'Sketches',
          meta: '1 sketch',
          treeGuides: ['elbow'],
          isExpandable: true,
          isExpanded: true,
        }),
        expect.objectContaining({
          rowId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
          rowKind: 'sketch',
          depth: 1,
          treeGuides: ['none', 'elbow'],
          iconLabel: 'S',
          label: 'Sketch 1',
          meta: 'Graph 1 | XY | 4 comps | 1 profile',
          isSelected: true,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: 'View Sketch 1 in graph',
            },
          ],
        }),
      ]),
    )
  })

  it('interleaves imported reference rows with authored content children using parent content order', () => {
    const rows = selectBrowserTreeRows({
      referenceWorkspaceTree: {
        ...emptyReferenceWorkspaceTree,
        categories: emptyReferenceWorkspaceTree.categories.map((category) =>
          category.categoryId !== 'user-references'
            ? category
            : {
                ...category,
                itemCount: 1,
                visibleItemCount: 1,
                items: [
                  {
                    rowId: 'reference-item-row:shoe-import-1',
                    referenceId: 'shoe-import-1',
                    sourceKind: 'imported',
                    label: 'Imported Shoe',
                    categoryId: 'user-references',
                    fileType: 'glb',
                    assetPath: 'references/imported/shoe.glb',
                    isVisible: true,
                    loadState: 'loaded',
                    errorMessage: null,
                    parentAssemblyId: 'assembly-root:project-file-1',
                    parentComponentId: null,
                    parts: [],
                  },
                ],
              },
        ),
      },
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
          label: 'Generated Object',
          meta: 'Object',
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Done',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-root:project-file-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-a',
          slotId: 'slot-a',
          sourceNodeId: 'node-a',
          resolutionState: 'resolved',
          highlightViewerKey: 'object-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
      ],
      contentOrderByParentKey: {
        'assembly:assembly-root:project-file-1': [
          'reference-item-row:shoe-import-1',
          'project-object:project-file-1:graph-document-1:object-a',
        ],
      },
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      selectedRowId: 'reference-item-row:shoe-import-1',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.contentRows.map((row) => row.rowId)).toEqual([
      'reference-root',
      'reference-category-row:footpads',
      'reference-category-row:shoes',
      'reference-category-row:premade-foothooks',
      'assembly-root:project-file-1',
      'reference-item-row:shoe-import-1',
      'project-object:project-file-1:graph-document-1:object-a',
    ])
    expect(rows.contentRows.find((row) => row.rowId === 'reference-item-row:shoe-import-1')).toMatchObject({
      rowKind: 'object',
      contentOriginKind: 'imported-reference',
      referenceId: 'shoe-import-1',
      label: 'Imported Shoe',
      depth: 1,
      treeGuides: ['none', 'tee'],
      isSelected: true,
    })
    expect(
      rows.contentRows.find((row) => row.rowId === 'project-object:project-file-1:graph-document-1:object-a'),
    ).toMatchObject({
      rowKind: 'object',
      label: 'Generated Object',
      depth: 1,
      treeGuides: ['none', 'elbow'],
    })
  })
})
