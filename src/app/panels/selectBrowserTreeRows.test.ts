import { describe, expect, it } from 'vitest'
import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type { ReferenceFileType } from '../references/referenceManifest'
import type { BrowserGraphRowVm } from './selectBrowserGraphRows'
import { selectBrowserTreeRows } from './selectBrowserTreeRows'
import type {
  BrowserBuildPolicy,
  ReferenceItemLoadState,
  ReferenceWorkspaceBrowserTreeVm,
} from '../store/useAppStore'

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
      label: 'Wearable',
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

const referenceRootContentRow = (options?: {
  rowId?: string
  label?: string
  isVisible?: boolean
  itemCount?: number
}) => ({
  rowId: options?.rowId ?? 'reference-root',
  kind: 'assembly' as const,
  label: options?.label ?? 'References',
  meta: `${options?.itemCount ?? 0} items`,
  parentAssemblyId: null,
  isVisible: options?.isVisible ?? false,
  visibilityPartKeys: [],
  buildState: 'done' as const,
  buildStateLabel: '',
  rebuildGraphDocumentIds: [],
  statusLabel: '',
  statusTone: 'quiet' as const,
  referenceContainerKind: 'root' as const,
  referenceCategoryId: null,
  referenceContainerItemCount: options?.itemCount ?? 0,
  referenceContainerEmptyLabel: null,
})

const referenceCategoryContentRow = (options: {
  rowId: string
  label: string
  categoryId: 'footpads' | 'shoes' | 'premade-foothooks' | 'user-references'
  itemCount: number
  isVisible?: boolean
  parentAssemblyId?: string
  emptyLabel?: string
}) => ({
  rowId: options.rowId,
  kind: 'component' as const,
  label: options.label,
  meta: options.itemCount === 1 ? '1 item' : `${options.itemCount} items`,
  parentAssemblyId: options.parentAssemblyId ?? 'reference-root',
  isVisible: options.isVisible ?? false,
  visibilityPartKeys: [],
  buildState: 'done' as const,
  buildStateLabel: '',
  rebuildGraphDocumentIds: [],
  statusLabel: '',
  statusTone: 'quiet' as const,
  ownerGraphDocumentId: null,
  sourceGraphDocumentId: null,
  sourceOutputEntryId: null,
  componentSourceKind: 'receive-link' as const,
  resolutionState: 'resolved' as const,
  receiveId: null,
  childObjectCount: options.itemCount,
  slotId: null,
  sourceNodeId: null,
  highlightViewerKey: null,
  authoringGraphDocumentId: null,
  authoringNodeId: null,
  referenceContainerKind: 'category' as const,
  referenceCategoryId: options.categoryId,
  referenceContainerItemCount: options.itemCount,
  referenceContainerEmptyLabel: options.emptyLabel ?? null,
})

const referenceObjectContentRow = (options: {
  rowId: string
  label: string
  referenceId: string
  sourceKind: 'manifest' | 'imported'
  categoryId: 'footpads' | 'shoes' | 'premade-foothooks' | 'user-references'
  fileType: ReferenceFileType
  assetPath: string
  loadState: ReferenceItemLoadState
  isVisible: boolean
  parentAssemblyId?: string | null
  parentComponentId?: string | null
  errorMessage?: string | null
  contentOriginKind?: 'source-reference' | 'imported-reference'
  buildStateLabel?: string
}) => ({
  ...(options.contentOriginKind === undefined
    ? {}
    : { contentOriginKind: options.contentOriginKind }),
  rowId: options.rowId,
  kind: 'object' as const,
  label: options.label,
  meta: options.fileType.toUpperCase(),
  parentAssemblyId: options.parentAssemblyId ?? 'reference-root',
  parentComponentId: options.parentComponentId ?? null,
  isVisible: options.isVisible,
  visibilityPartKeys: [],
  buildState: 'done' as const,
  buildStateLabel:
    options.buildStateLabel ??
    ((options.contentOriginKind ??
      (options.parentAssemblyId != null || options.parentComponentId != null
        ? 'imported-reference'
        : 'source-reference')) === 'imported-reference'
      ? 'Imported'
      : options.sourceKind === 'manifest'
        ? 'Library'
        : 'Imported'),
  rebuildGraphDocumentIds: [],
  statusLabel: '',
  statusTone: 'quiet' as const,
  ownerGraphDocumentId: null,
  objectSourceKind: null,
  sourceGraphDocumentId: null,
  sourceOutputEntryId: null,
  slotId: null,
  sourceNodeId: null,
  resolutionState: null,
  highlightViewerKey: null,
  authoringGraphDocumentId: null,
  authoringNodeId: null,
  contentOriginKind:
    options.contentOriginKind ??
    (options.parentAssemblyId != null || options.parentComponentId != null
      ? ('imported-reference' as const)
      : ('source-reference' as const)),
  referenceId: options.referenceId,
  referenceSourceKind: options.sourceKind,
  referenceCategoryId: options.categoryId,
  referenceLoadState: options.loadState,
  fileType: options.fileType,
  assetPath: options.assetPath,
  errorMessage: options.errorMessage ?? null,
  partRows: [],
})

describe('selectBrowserTreeRows', () => {
  it('derives a normal Content environment tree from the shared view environment truth', () => {
    const rows = selectBrowserTreeRows({
      environmentView: {
        envPreset: 'studio',
        environmentSource: {
          kind: 'custom',
          label: 'Custom Studio',
          assetPath: null,
        },
        environmentGrade: {
          toneMapping: 'aces',
          exposure: 1.28,
          contrast: 1,
          highlights: 0,
          shadows: 0,
          whites: 0,
          blacks: 0,
          temperature: 0,
          tint: 0,
          saturation: 1,
        },
        lighting: {
          selectedLightId: 'light-key',
          lights: [
            {
              id: 'light-key',
              name: 'Key',
              type: 'directional',
              enabled: true,
              color: '#fff2e6',
              intensity: 1.85,
              position: { x: 1, y: 2, z: 3 },
              target: { x: 0, y: 0.5, z: 0 },
              castShadow: true,
              shadowBias: -0.0005,
              shadowMapSize: 1024,
            },
            {
              id: 'light-fill',
              name: 'Fill',
              type: 'hemisphere',
              enabled: false,
              color: '#eef3ff',
              intensity: 0.95,
            },
          ],
        },
      },
      contentRows: [],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: 'environment-light-row:light-key',
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: false,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.environmentRows).toEqual([])
    expect(rows.contentRows.map((row) => row.rowKind)).toEqual([
      'environment-root',
      'environment-source',
      'environment-light',
      'environment-light',
    ])
    expect(rows.contentRows[0]).toMatchObject({
      rowId: 'environment-root',
      rowKind: 'environment-root',
      label: 'Environment',
      meta: '3 objects',
      depth: 0,
      treeGuides: ['elbow'],
      isExpandable: true,
      isExpanded: true,
      childCount: 3,
    })
    expect(rows.contentRows[1]).toMatchObject({
      rowId: 'environment-source-row:active',
      rowKind: 'environment-source',
      label: 'Source: Custom Studio',
      meta: 'Custom source | Exposure 1.28',
      depth: 1,
      treeGuides: ['none', 'tee'],
      isDiverged: true,
      sourceKind: 'custom',
      sourceLabel: 'Custom Studio',
    })
    expect(rows.contentRows[2]).toMatchObject({
      rowId: 'environment-light-row:light-key',
      rowKind: 'environment-light',
      label: 'Key',
      meta: 'Selected | On | directional | 1.85',
      depth: 1,
      treeGuides: ['none', 'tee'],
      isSelected: true,
      isSelectedLight: true,
    })
    expect(rows.contentRows[3]).toMatchObject({
      rowId: 'environment-light-row:light-fill',
      rowKind: 'environment-light',
      label: 'Fill',
      meta: 'Off | hemisphere | 0.95',
      depth: 1,
      treeGuides: ['none', 'elbow'],
      isSelectedLight: false,
    })
  })

  it('collapses the derived environment collection row through the Content row collapse state', () => {
    const rows = selectBrowserTreeRows({
      environmentView: {
        envPreset: 'studio',
        environmentSource: {
          kind: 'preset',
          label: 'Studio',
          assetPath: null,
        },
        environmentGrade: {
          toneMapping: 'aces',
          exposure: 1,
          contrast: 1,
          highlights: 0,
          shadows: 0,
          whites: 0,
          blacks: 0,
          temperature: 0,
          tint: 0,
          saturation: 1,
        },
        lighting: {
          selectedLightId: null,
          lights: [
            {
              id: 'light-key',
              name: 'Key',
              type: 'directional',
              enabled: true,
              color: '#ffffff',
              intensity: 1,
            },
          ],
        },
      },
      contentRows: [],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: null,
      collapsedContentRowIds: ['environment-root'],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: false,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.contentRows).toEqual([
      expect.objectContaining({
        rowId: 'environment-root',
        rowKind: 'environment-root',
        isExpandable: true,
        isExpanded: false,
        meta: '2 objects',
      }),
    ])
  })

  it('represents an HDRI environment source in the Content environment collection', () => {
    const rows = selectBrowserTreeRows({
      environmentView: {
        envPreset: 'baseline',
        environmentSource: {
          kind: 'hdri',
          label: 'Workshop Loft',
          assetPath: 'assets/hdri/workshop-loft.hdr',
        },
        environmentGrade: {
          toneMapping: 'aces',
          exposure: 1.15,
          contrast: 1,
          highlights: 0,
          shadows: 0,
          whites: 0,
          blacks: 0,
          temperature: 0,
          tint: 0,
          saturation: 1,
        },
        lighting: {
          selectedLightId: null,
          lights: [],
        },
      },
      contentRows: [],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: null,
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: false,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.contentRows[1]).toMatchObject({
      rowId: 'environment-source-row:active',
      rowKind: 'environment-source',
      label: 'HDRI: Workshop Loft',
      meta: 'HDRI source | Exposure 1.15 | assets/hdri/workshop-loft.hdr',
      sourceKind: 'hdri',
      sourceLabel: 'Workshop Loft',
      sourceAssetPath: 'assets/hdri/workshop-loft.hdr',
    })
  })

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
            actionId: 'export-step',
            label: 'Export STEP',
            ariaLabel: 'Export Graph 1 as STEP',
          },
          {
            actionId: 'save',
            label: 'Save Graph File',
            ariaLabel: 'Save Graph 1 graph file',
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

  it('does not synthesize a startup reference root when the reference tree is absent', () => {
    const rows = selectBrowserTreeRows({
      contentRows: [],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: null,
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: false,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    expect(rows.referenceRows).toEqual([])
    expect(rows.contentRows).toEqual([])
    expect(rows.graphRows).toEqual([])
    expect(rows.viewportRows).toEqual([])
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
          actionId: 'export-step',
          label: 'Export STEP',
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
          disabled: false,
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

  it('renders nested published subcomponents under their parent component while keeping direct object siblings', () => {
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
          label: 'Pedal Assembly',
          meta: 'Graph 1',
          parentAssemblyId: 'assembly-root:project-file-1',
          parentComponentId: null,
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: null,
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 3,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: null,
        },
        {
          rowId: 'project-component:project-file-1:graph-document-1:published-subcomponent:s001',
          kind: 'component',
          label: 'Object 1',
          meta: 'Graph 1',
          parentAssemblyId: 'assembly-root:project-file-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published',
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: null,
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 2,
          slotId: 's001',
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: null,
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:output-object:s001:member-001',
          kind: 'object',
          label: 'Object 1 1',
          meta: '',
          parentAssemblyId: 'assembly-root:project-file-1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published-subcomponent:s001',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s001:node-extrude-a:member-001',
          slotId: 's001',
          sourceNodeId: 'node-extrude-a',
          resolutionState: 'resolved',
          highlightViewerKey: 'graph-document-1:output-entry:s001:node-extrude-a:member-001',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-extrude-a',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:output-object:s001:member-002',
          kind: 'object',
          label: 'Object 1 2',
          meta: '',
          parentAssemblyId: 'assembly-root:project-file-1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published-subcomponent:s001',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s001:node-extrude-a:member-002',
          slotId: 's001',
          sourceNodeId: 'node-extrude-a',
          resolutionState: 'resolved',
          highlightViewerKey: 'graph-document-1:output-entry:s001:node-extrude-a:member-002',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-extrude-a',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:output-object:s002',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          parentAssemblyId: 'assembly-root:project-file-1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s002:node-extrude-b',
          slotId: 's002',
          sourceNodeId: 'node-extrude-b',
          resolutionState: 'resolved',
          highlightViewerKey: 'graph-document-1:output-entry:s002:node-extrude-b',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-extrude-b',
        },
      ],
      graphRows: [],
      editorViewports: [],
      graphDocumentsById: {},
      selectedRowId: null,
      collapsedContentRowIds: [],
      expandedGraphDocumentIds: [],
      hasActiveEditorViewport: true,
      sharedViewerCompositionGraphDocumentIds: [],
      sharedViewerCompositionActive: false,
    })

    const authoredRows = rows.contentRows.filter((row) =>
      row.rowId.startsWith('project-component:project-file-1:graph-document-1:') ||
      row.rowId.startsWith('project-object:project-file-1:graph-document-1:'),
    )

    expect(authoredRows.map((row) => row.rowId)).toEqual([
      'project-component:project-file-1:graph-document-1:published',
      'project-component:project-file-1:graph-document-1:published-subcomponent:s001',
      'project-object:project-file-1:graph-document-1:output-object:s001:member-001',
      'project-object:project-file-1:graph-document-1:output-object:s001:member-002',
      'project-object:project-file-1:graph-document-1:output-object:s002',
    ])
    expect(
      authoredRows.find(
        (row) => row.rowId === 'project-component:project-file-1:graph-document-1:published',
      ),
    ).toMatchObject({
      rowKind: 'component',
      depth: 1,
      parentComponentId: null,
    })
    expect(
      authoredRows.find(
        (row) => row.rowId === 'project-component:project-file-1:graph-document-1:published-subcomponent:s001',
      ),
    ).toMatchObject({
      rowKind: 'component',
      depth: 2,
      parentComponentId: 'project-component:project-file-1:graph-document-1:published',
    })
    expect(
      authoredRows.find(
        (row) => row.rowId === 'project-object:project-file-1:graph-document-1:output-object:s002',
      ),
    ).toMatchObject({
      rowKind: 'object',
      depth: 2,
      parentComponentId: 'project-component:project-file-1:graph-document-1:published',
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
      contentRows: [
        referenceRootContentRow({ itemCount: 2, isVisible: true }),
        referenceCategoryContentRow({
          rowId: 'reference-category-row:premade-foothooks',
          categoryId: 'premade-foothooks',
          label: 'Premade Foothooks',
          itemCount: 2,
          isVisible: true,
          emptyLabel: 'No loadable references yet.',
        }),
        referenceObjectContentRow({
          rowId: 'reference-item-row:hook:large',
          referenceId: 'hook:large',
          sourceKind: 'manifest',
          label: 'Large',
          categoryId: 'premade-foothooks',
          fileType: 'step',
          assetPath: '/Catalog/hooks/large.step',
          isVisible: true,
          loadState: 'loading',
          contentOriginKind: 'source-reference',
          buildStateLabel: 'Library',
          parentComponentId: 'reference-category-row:premade-foothooks',
        }),
        referenceObjectContentRow({
          rowId: 'reference-item-row:hook:medium',
          referenceId: 'hook:medium',
          sourceKind: 'manifest',
          label: 'Medium',
          categoryId: 'premade-foothooks',
          fileType: 'step',
          assetPath: '/Catalog/hooks/medium.step',
          isVisible: false,
          loadState: 'error',
          errorMessage: 'STEP import failed',
          contentOriginKind: 'source-reference',
          buildStateLabel: 'Library',
          parentComponentId: 'reference-category-row:premade-foothooks',
        }),
      ],
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
      contentRows: [
        referenceRootContentRow({ itemCount: 0, isVisible: false }),
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        referenceObjectContentRow({
          rowId: 'reference-item-row:reference-import:1',
          referenceId: 'reference-import:1',
          sourceKind: 'imported',
          label: 'shoe.glb',
          categoryId: 'user-references',
          fileType: 'glb',
          assetPath: 'blob:shoe-1',
          isVisible: true,
          loadState: 'loaded',
          contentOriginKind: 'imported-reference',
          parentAssemblyId: 'assembly-1',
          parentComponentId: null,
        }),
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

  it('flattens imported user references directly under References when no grouping parent survives', () => {
    const rows = selectBrowserTreeRows({
      contentRows: [
        referenceRootContentRow({ itemCount: 1, isVisible: true }),
        referenceObjectContentRow({
          rowId: 'reference-item-row:reference-import:1',
          referenceId: 'reference-import:1',
          sourceKind: 'imported',
          label: 'shoe.glb',
          categoryId: 'user-references',
          fileType: 'glb',
          assetPath: 'blob:shoe-1',
          isVisible: true,
          loadState: 'loaded',
          contentOriginKind: 'source-reference',
          buildStateLabel: 'Imported',
          parentAssemblyId: 'reference-root',
          parentComponentId: null,
        }),
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
    expect(rows.contentRows.some((row) => row.rowId === 'reference-category-row:user-references')).toBe(
      false,
    )
    expect(rows.contentRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowId: 'reference-root',
          rowKind: 'assembly',
          referenceContainerKind: 'root',
        }),
        expect.objectContaining({
          rowId: 'reference-item-row:reference-import:1',
          rowKind: 'object',
          contentOriginKind: 'source-reference',
          referenceSourceKind: 'imported',
          label: 'shoe.glb',
          isSelected: true,
        }),
      ]),
    )
  })

  it('moves manifest library objects into the content hierarchy when they gain a landing parent', () => {
    const rows = selectBrowserTreeRows({
      contentRows: [
        referenceRootContentRow({ itemCount: 1, isVisible: true }),
        referenceCategoryContentRow({
          rowId: 'reference-category-row:shoes',
          categoryId: 'shoes',
          label: 'Wearable',
          itemCount: 1,
          isVisible: true,
          emptyLabel: 'No loadable references yet.',
        }),
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        referenceObjectContentRow({
          rowId: 'reference-item-row:shoe:shoe-2',
          referenceId: 'shoe:shoe-2',
          sourceKind: 'manifest',
          label: 'Shoe 2',
          categoryId: 'shoes',
          fileType: 'glb',
          assetPath: '/Catalog/shoes/shoe-2.glb',
          isVisible: true,
          loadState: 'loaded',
          contentOriginKind: 'source-reference',
          buildStateLabel: 'Library',
          parentAssemblyId: 'reference-root',
          parentComponentId: 'reference-category-row:shoes',
        }),
        referenceObjectContentRow({
          rowId: 'reference-item-row:shoe:shoe-1',
          referenceId: 'shoe:shoe-1',
          sourceKind: 'manifest',
          label: 'Shoe 1',
          categoryId: 'shoes',
          fileType: 'glb',
          assetPath: '/Catalog/shoes/shoe-1.glb',
          isVisible: true,
          loadState: 'loaded',
          contentOriginKind: 'imported-reference',
          parentAssemblyId: 'assembly-1',
          parentComponentId: null,
        }),
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
      contentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          ...referenceObjectContentRow({
            rowId: 'reference-item-row:reference-import:1',
            referenceId: 'reference-import:1',
            sourceKind: 'imported',
            label: 'shoe.glb',
            categoryId: 'user-references',
            fileType: 'glb',
            assetPath: 'blob:shoe-1',
            isVisible: true,
            loadState: 'loaded',
            contentOriginKind: 'imported-reference',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
          }),
          partRows: [
            {
              rowId: 'reference-part-row:reference-part:reference-import:1:0',
              partKey: 'reference-part:reference-import:1:0',
              label: 'Upper',
              sourceMeshIndex: 0,
            },
            {
              rowId: 'reference-part-row:reference-part:reference-import:1:1',
              partKey: 'reference-part:reference-import:1:1',
              label: 'Sole',
              sourceMeshIndex: 1,
            },
          ],
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
      contentRows: [
        referenceRootContentRow({ itemCount: 3, isVisible: true }),
        referenceCategoryContentRow({
          rowId: 'reference-category-row:footpads',
          categoryId: 'footpads',
          label: 'Footpads',
          itemCount: 1,
          isVisible: true,
          emptyLabel: 'No loadable references yet.',
        }),
        referenceObjectContentRow({
          rowId: 'reference-item-row:footpad:pubpad-full-assembly',
          referenceId: 'footpad:pubpad-full-assembly',
          sourceKind: 'manifest',
          label: 'PubPad Full Assembly',
          categoryId: 'footpads',
          fileType: 'obj',
          assetPath: 'Catalog/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
          isVisible: true,
          loadState: 'loaded',
          contentOriginKind: 'source-reference',
          buildStateLabel: 'Library',
          parentComponentId: 'reference-category-row:footpads',
        }),
        referenceCategoryContentRow({
          rowId: 'reference-category-row:shoes',
          categoryId: 'shoes',
          label: 'Wearable',
          itemCount: 2,
          isVisible: true,
          emptyLabel: 'No loadable references yet.',
        }),
        referenceObjectContentRow({
          rowId: 'reference-item-row:shoe:shoe-1',
          referenceId: 'shoe:shoe-1',
          sourceKind: 'manifest',
          label: 'Shoe 1',
          categoryId: 'shoes',
          fileType: 'glb',
          assetPath: 'shoe-1.glb',
          isVisible: true,
          loadState: 'loading',
          contentOriginKind: 'source-reference',
          buildStateLabel: 'Library',
          parentComponentId: 'reference-category-row:shoes',
        }),
        referenceObjectContentRow({
          rowId: 'reference-item-row:shoe:shoe-2',
          referenceId: 'shoe:shoe-2',
          sourceKind: 'manifest',
          label: 'Shoe 2',
          categoryId: 'shoes',
          fileType: 'glb',
          assetPath: 'shoe-2.glb',
          isVisible: true,
          loadState: 'unloaded',
          contentOriginKind: 'source-reference',
          buildStateLabel: 'Library',
          parentComponentId: 'reference-category-row:shoes',
        }),
      ],
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

  it('renders expandable sketch profile rows from the sketch projection rows', () => {
    const selectRows = (collapsedContentRowIds: string[] = []) =>
      selectBrowserTreeRows({
        referenceWorkspaceTree: emptyReferenceWorkspaceTree,
        contentRows: [
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
            meta: 'Graph 1 | XY | 4 comps | 2 profiles',
            isVisible: true,
            buildState: 'done',
            buildStateLabel: 'Done',
            rebuildGraphDocumentIds: [],
            ownerGraphDocumentId: 'graph-document-1',
            graphDocumentId: 'graph-document-1',
            nodeId: 'node-sketch-1',
            featureId: 'sketch-1',
            plane: 'XY',
            componentCount: 4,
            profileCount: 2,
            profiles: [
              { profileId: 'profile-a', profileIndex: 0 },
              { profileId: 'profile-b', profileIndex: 1 },
            ],
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
        selectedRowId: 'sketch-profile-row:graph-document-1:node-sketch-1:profile-b',
        collapsedContentRowIds,
        expandedGraphDocumentIds: [],
        hasActiveEditorViewport: true,
        sharedViewerCompositionGraphDocumentIds: [],
        sharedViewerCompositionActive: false,
      })

    const rows = selectRows()

    const sketchRow = rows.contentRows.find(
      (row) => row.rowKind === 'sketch',
    )
    expect(sketchRow).toEqual(
      expect.objectContaining({
        rowId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
        rowKind: 'sketch',
        isExpandable: true,
        isExpanded: true,
        treeGuides: ['none', 'tee'],
      }),
    )
    expect(rows.contentRows.map((row) => row.rowKind)).toEqual([
      'sketches-root',
      'sketch',
      'sketch-profiles',
      'sketch-profile',
      'sketch-profile',
    ])
    expect(rows.contentRows[2]).toEqual(
      expect.objectContaining({
        rowId: 'sketch-profiles-row:graph-document-1:node-sketch-1',
        rowKind: 'sketch-profiles',
        label: 'SketchProfiles',
        meta: '2 profiles',
        depth: 2,
        treeGuides: ['none', 'none', 'tee'],
        isExpandable: true,
        isExpanded: true,
      }),
    )
    expect(rows.contentRows[3]).toEqual(
      expect.objectContaining({
        rowId: 'sketch-profile-row:graph-document-1:node-sketch-1:profile-a',
        rowKind: 'sketch-profile',
        label: 'SketchProfile',
        meta: 'Profile 1',
        depth: 3,
        treeGuides: ['none', 'none', 'none', 'tee'],
        isExpandable: false,
      }),
    )
    expect(rows.contentRows[4]).toEqual(
      expect.objectContaining({
        rowId: 'sketch-profile-row:graph-document-1:node-sketch-1:profile-b',
        rowKind: 'sketch-profile',
        label: 'SketchProfile',
        meta: 'Profile 2',
        depth: 3,
        treeGuides: ['none', 'none', 'none', 'elbow'],
        isSelected: true,
      }),
    )
    const profileProjectionRows = sketchRow?.profileProjectionRows ?? []
    expect(profileProjectionRows).toEqual([
      expect.objectContaining({
        rowId: 'sketch-profiles-row:graph-document-1:node-sketch-1',
        rowKind: 'sketch-profiles',
        graphDocumentId: 'graph-document-1',
        nodeId: 'node-sketch-1',
        featureId: 'sketch-1',
        profileCount: 2,
        label: 'SketchProfiles',
        meta: '2 profiles',
        isSelected: false,
        authoringGraphDocumentId: 'graph-document-1',
        authoringNodeId: 'node-sketch-1',
      }),
      expect.objectContaining({
        rowId: 'sketch-profile-row:graph-document-1:node-sketch-1:profile-a',
        rowKind: 'sketch-profile',
        graphDocumentId: 'graph-document-1',
        nodeId: 'node-sketch-1',
        featureId: 'sketch-1',
        profileId: 'profile-a',
        profileIndex: 0,
        profilePortId: 'SketchProfile:profile-a',
        label: 'SketchProfile',
        meta: 'Profile 1',
        isSelected: false,
        authoringGraphDocumentId: 'graph-document-1',
        authoringNodeId: 'node-sketch-1',
      }),
      expect.objectContaining({
        rowId: 'sketch-profile-row:graph-document-1:node-sketch-1:profile-b',
        rowKind: 'sketch-profile',
        profileId: 'profile-b',
        profileIndex: 1,
        profilePortId: 'SketchProfile:profile-b',
        label: 'SketchProfile',
        meta: 'Profile 2',
        isSelected: true,
      }),
    ])
    expect(
      profileProjectionRows.some((row) =>
        `${row.label} ${row.meta}`.toLowerCase().includes('selected'),
      ),
    ).toBe(false)
    expect(
      rows.contentRows.some((row) =>
        `${row.label} ${row.meta}`.toLowerCase().includes('selected'),
      ),
    ).toBe(false)

    const sketchCollapsedRows = selectRows([
      'project-sketch:graph-document-1:node-sketch-1:sketch-1',
    ]).contentRows
    expect(sketchCollapsedRows.map((row) => row.rowKind)).toEqual([
      'sketches-root',
      'sketch',
    ])
    expect(sketchCollapsedRows[1]).toEqual(
      expect.objectContaining({
        rowKind: 'sketch',
        isExpandable: true,
        isExpanded: false,
      }),
    )

    const profilesCollapsedRows = selectRows([
      'sketch-profiles-row:graph-document-1:node-sketch-1',
    ]).contentRows
    expect(profilesCollapsedRows.map((row) => row.rowKind)).toEqual([
      'sketches-root',
      'sketch',
      'sketch-profiles',
    ])
    expect(profilesCollapsedRows[2]).toEqual(
      expect.objectContaining({
        rowKind: 'sketch-profiles',
        isExpandable: true,
        isExpanded: false,
      }),
    )
  })

  it('interleaves imported reference rows with authored content children using parent content order', () => {
    const rows = selectBrowserTreeRows({
      contentRows: [
        referenceRootContentRow({ itemCount: 0, isVisible: false }),
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        referenceObjectContentRow({
          rowId: 'reference-item-row:shoe-import-1',
          referenceId: 'shoe-import-1',
          sourceKind: 'imported',
          label: 'Imported Shoe',
          categoryId: 'user-references',
          fileType: 'glb',
          assetPath: 'references/imported/shoe.glb',
          isVisible: true,
          loadState: 'loaded',
          contentOriginKind: 'imported-reference',
          parentAssemblyId: 'assembly-root:project-file-1',
          parentComponentId: null,
        }),
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
