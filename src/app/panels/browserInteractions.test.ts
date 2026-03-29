import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBrowserRowInteractionHandlers } from './browserInteractions'
import type {
  BrowserAssemblyTreeRowVm,
  BrowserComponentTreeRowVm,
  BrowserGraphTreeRowVm,
  BrowserGraphNodeTreeRowVm,
  BrowserObjectTreeRowVm,
  BrowserReferenceItemTreeRowVm,
  BrowserSketchTreeRowVm,
} from './selectBrowserTreeRows'
import type { BrowserRowInteractionDeps } from './browserInteractions'

const { activateGraphDocumentIntentMock, activateGraphNodeIntentMock } = vi.hoisted(() => ({
  activateGraphDocumentIntentMock: vi.fn(() => ({ editorViewportId: 'editor-viewport-1' })),
  activateGraphNodeIntentMock: vi.fn(() => ({ editorViewportId: 'editor-viewport-1' })),
}))

vi.mock('../store/workspaceIntents', () => ({
  activateGraphDocumentIntent: activateGraphDocumentIntentMock,
  activateGraphNodeIntent: activateGraphNodeIntentMock,
}))

const graphDocument = {
  graphDocumentId: 'graph-document-1',
  name: 'Graph 1',
  version: 1 as const,
  graph: {
    schemaVersion: 1 as const,
    nodes: [],
    edges: [],
  },
}

const assemblyRow = (assemblyId: string, label: string): BrowserAssemblyTreeRowVm => ({
  rowId: assemblyId,
  rowKind: 'assembly',
  depth: 0,
  treeGuides: [],
  iconLabel: 'A',
  label,
  meta: '',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  isVisible: true,
  visibilityPartKeys: [`part:${assemblyId}`],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
})

const objectRow = (objectId: string, label: string, partKey = 'part:object-1'): BrowserObjectTreeRowVm => ({
  rowId: objectId,
  rowKind: 'object',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'O',
  label,
  meta: 'Graph 1',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  isVisible: true,
  visibilityPartKeys: [partKey],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: 'graph-document-1',
  parentComponentId: 'component-1',
  objectSourceKind: 'published-object',
  sourceGraphDocumentId: 'graph-document-1',
  sourceOutputEntryId: 'output-entry:s001:node-1',
  slotId: 's001',
  sourceNodeId: 'node-1',
  resolutionState: 'resolved',
  highlightViewerKey: partKey,
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-1',
})

const componentRow = (componentId: string, label: string): BrowserComponentTreeRowVm => ({
  rowId: componentId,
  rowKind: 'component',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'C',
  label,
  meta: '',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  isVisible: true,
  visibilityPartKeys: [`part:${componentId}`],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: null,
  sourceGraphDocumentId: null,
  sourceOutputEntryId: null,
  componentSourceKind: 'receive-link',
  resolutionState: 'resolved',
  receiveId: null,
  slotId: null,
  sourceNodeId: null,
  highlightViewerKey: null,
  authoringGraphDocumentId: null,
  authoringNodeId: null,
})

const graphRow = (): BrowserGraphTreeRowVm => ({
  rowId: 'graph-row:graph-document-1',
  rowKind: 'graph-document',
  depth: 0,
  treeGuides: [],
  cachedGraphId: 'cached-graph-1',
  graphDocumentId: 'graph-document-1',
  isInSharedViewerComposition: false,
  iconLabel: 'G',
  label: 'Graph 1',
  meta: 'Saved',
  isSelected: false,
  isExpandable: true,
  isExpanded: false,
  actions: [],
  saveState: 'saved',
  openViewportCount: 0,
  hasFocusedViewport: false,
  buildState: 'done',
  buildStateLabel: 'Done',
  children: [],
})

const graphNodeRow = (): BrowserGraphNodeTreeRowVm => ({
  rowId: 'graph-node-row:graph-document-1:node-1',
  rowKind: 'graph-node',
  depth: 1,
  treeGuides: ['elbow'],
  graphDocumentId: 'graph-document-1',
  nodeId: 'node-1',
  nodeType: 'Part/Cube',
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-1',
  iconLabel: 'N',
  label: 'Cube',
  meta: 'Part/Cube',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
})

const sketchRow = (): BrowserSketchTreeRowVm => ({
  rowId: 'project-sketch:graph-document-1:node-2:feature-1',
  rowKind: 'sketch',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'S',
  label: 'Sketch 1',
  meta: '',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  isVisible: true,
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: 'graph-document-1',
  graphDocumentId: 'graph-document-1',
  nodeId: 'node-2',
  featureId: 'feature-1',
  plane: 'XY',
  componentCount: 0,
  profileCount: 0,
  diagnosticsCount: 0,
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-2',
})

const referenceItemRow = (): BrowserReferenceItemTreeRowVm => ({
  rowId: 'reference-item-row:shoe-1',
  rowKind: 'reference-item',
  depth: 2,
  treeGuides: ['vertical', 'elbow'],
  iconLabel: 'O',
  label: 'Shoe 1',
  meta: 'GLB',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  referenceId: 'shoe-1',
  sourceKind: 'manifest',
  categoryId: 'shoes',
  fileType: 'glb',
  assetPath: '/ReferenceModels/shoes/shoe-1.glb',
  isVisible: false,
  state: 'dormant',
  stateLabel: 'Dormant',
  errorMessage: null,
})

const createDeps = (
  overrides: Partial<BrowserRowInteractionDeps> = {},
): BrowserRowInteractionDeps => ({
  browserTreeRows: {
    referenceRows: [],
    contentRows: [],
  },
  graphDocumentsById: {
    'graph-document-1': graphDocument,
  },
  referenceWorkspaceRootRowId: 'reference-root',
  buildProjectSketchBrowserRowId: (graphDocumentId, nodeId, featureId) =>
    `project-sketch:${graphDocumentId}:${nodeId}:${featureId}`,
  workspaceSelectedTarget: null,
  workspaceExplicitSelectedTargets: [],
  workspaceSelectionAnchorTarget: null,
  workspaceIntentDeps: {
    app: {} as never,
    spaghetti: {} as never,
  },
  newEditorSpawnPosition: { x: 100, y: 200 },
  sharedViewerCompositionActive: false,
  closeMenus: vi.fn(),
  setLocalSelectedBrowserRowId: vi.fn(),
  setWorkspaceSelectedTarget: vi.fn(),
  setWorkspaceExplicitSelection: vi.fn(),
  setActiveSurface: vi.fn(),
  selectPart: vi.fn(),
  requestConsoleContextSync: vi.fn(),
  setActiveEditorViewportId: vi.fn(),
  toggleReferenceWorkspaceExpanded: vi.fn(),
  toggleReferenceCategoryExpanded: vi.fn(),
  toggleReferenceItemVisibility: vi.fn(),
  toggleReferenceCategoryVisibility: vi.fn(),
  toggleSketchVisibility: vi.fn(),
  setPartVisibility: vi.fn(),
  setExpandedGraphDocumentIds: vi.fn(),
  setGraphSectionExpandedByRowId: vi.fn(),
  setCollapsedContentRowIds: vi.fn(),
  appendBrowserEntry: vi.fn(),
  ...overrides,
})

describe('createBrowserRowInteractionHandlers', () => {
  beforeEach(() => {
    activateGraphDocumentIntentMock.mockReset()
    activateGraphNodeIntentMock.mockReset()
    activateGraphDocumentIntentMock.mockReturnValue({ editorViewportId: 'editor-viewport-1' })
    activateGraphNodeIntentMock.mockReturnValue({ editorViewportId: 'editor-viewport-1' })
  })

  it('clears Browser selection and requests console sync for empty-body deselect', () => {
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.clearBrowserSelection()

    expect(deps.setLocalSelectedBrowserRowId).toHaveBeenCalledWith(null)
    expect(deps.setWorkspaceSelectedTarget).toHaveBeenCalledWith(null)
    expect(deps.selectPart).toHaveBeenCalledWith(null)
    expect(deps.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
  })

  it('commits single explicit selection for content rows and keeps viewer highlighting outside the panel', () => {
    const row = objectRow('object-1', 'Pedal Body')
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'object-1' },
      explicitSelectedTargets: [{ kind: 'object', objectId: 'object-1' }],
      selectionAnchorTarget: { kind: 'object', objectId: 'object-1' },
    })
    expect(deps.setActiveSurface).toHaveBeenCalledWith('browser')
    expect(deps.selectPart).toHaveBeenCalledWith('part:object-1')
  })

  it('keeps converged reference container rows on owner targets instead of legacy reference targets', () => {
    const row: BrowserAssemblyTreeRowVm = {
      ...assemblyRow('reference-root', 'References'),
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'assembly', assemblyId: 'reference-root' },
      explicitSelectedTargets: [{ kind: 'assembly', assemblyId: 'reference-root' }],
      selectionAnchorTarget: { kind: 'assembly', assemblyId: 'reference-root' },
    })
  })

  it('keeps converged reference-backed object rows on object targets', () => {
    const row: BrowserObjectTreeRowVm = {
      ...objectRow('reference-item-row:shoe-1', 'Shoe 1', 'reference:shoe-1'),
      contentOriginKind: 'imported-reference',
      referenceId: 'shoe-1',
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      slotId: null,
      sourceNodeId: null,
      highlightViewerKey: null,
      authoringGraphDocumentId: null,
      authoringNodeId: null,
      objectSourceKind: null,
      ownerGraphDocumentId: null,
      parentComponentId: 'reference-category-row:shoes',
      visibilityPartKeys: [],
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'reference-item-row:shoe-1' },
      explicitSelectedTargets: [{ kind: 'object', objectId: 'reference-item-row:shoe-1' }],
      selectionAnchorTarget: { kind: 'object', objectId: 'reference-item-row:shoe-1' },
    })
  })

  it('adds ctrl-clicked rows into explicit multi-select without rewriting the anchor logic in BrowserPanel', () => {
    const firstRow = assemblyRow('assembly-1', 'Assembly 1')
    const secondRow = objectRow('object-1', 'Pedal Body')
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, secondRow],
      },
      workspaceSelectedTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
      workspaceExplicitSelectedTargets: [{ kind: 'assembly', assemblyId: 'assembly-1' }],
      workspaceSelectionAnchorTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(secondRow, { ctrlKey: true, shiftKey: false })

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'object-1' },
      explicitSelectedTargets: [
        { kind: 'assembly', assemblyId: 'assembly-1' },
        { kind: 'object', objectId: 'object-1' },
      ],
      selectionAnchorTarget: { kind: 'object', objectId: 'object-1' },
    })
  })

  it('extends shift-click selection across the eligible section rows', () => {
    const firstRow = assemblyRow('assembly-1', 'Assembly 1')
    const middleRow = objectRow('object-1', 'Pedal Body')
    const lastRow = objectRow('object-2', 'Pedal Cap', 'part:object-2')
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, middleRow, lastRow],
      },
      workspaceSelectedTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
      workspaceExplicitSelectedTargets: [{ kind: 'assembly', assemblyId: 'assembly-1' }],
      workspaceSelectionAnchorTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(lastRow, { ctrlKey: false, shiftKey: true })

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'object-2' },
      explicitSelectedTargets: [
        { kind: 'assembly', assemblyId: 'assembly-1' },
        { kind: 'object', objectId: 'object-1' },
        { kind: 'object', objectId: 'object-2' },
      ],
      selectionAnchorTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
    })
  })

  it('routes graph and sketch selection through the workspace intent seam', () => {
    const nextGraphRow = graphRow()
    const nextSketchRow = sketchRow()
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(nextGraphRow)
    handlers.handleSelectBrowserRow(nextSketchRow)

    expect(activateGraphDocumentIntentMock).toHaveBeenCalledWith(
      deps.workspaceIntentDeps,
      'graph-document-1',
      {
        strategy: 'swap-focused-or-open',
        spawnPosition: { x: 100, y: 200 },
      },
    )
    expect(activateGraphNodeIntentMock).toHaveBeenCalledWith(
      deps.workspaceIntentDeps,
      'graph-document-1',
      'node-2',
      {
        strategy: 'open-or-focus',
        spawnPosition: { x: 100, y: 200 },
        fitNodeInViewport: true,
      },
    )
  })

  it('routes graph-child double select through the authoring graph intent path', () => {
    const row = graphNodeRow()
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleDoubleSelectBrowserRow(row)

    expect(activateGraphNodeIntentMock).toHaveBeenCalledWith(
      deps.workspaceIntentDeps,
      'graph-document-1',
      'node-1',
      {
        strategy: 'open-or-focus',
        spawnPosition: { x: 100, y: 200 },
        fitNodeInViewport: true,
      },
    )
  })

  it('dispatches expand toggles to the family-specific ownership seam', () => {
    const graphDocumentRow = graphRow()
    const categoryRow: BrowserComponentTreeRowVm = {
      ...componentRow('reference-category-row:footpads', 'Footpads'),
      referenceCategoryId: 'footpads',
    }
    const setExpandedGraphDocumentIds = vi.fn()
    const deps = createDeps({
      setExpandedGraphDocumentIds,
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleBrowserRowExpand(graphDocumentRow)
    handlers.handleToggleBrowserRowExpand(categoryRow)

    expect(deps.toggleReferenceCategoryExpanded).toHaveBeenCalledWith('footpads')
    expect(setExpandedGraphDocumentIds).toHaveBeenCalledTimes(1)
    const graphUpdater = setExpandedGraphDocumentIds.mock.calls[0]?.[0] as
      | ((currentIds: string[]) => string[])
      | undefined
    expect(graphUpdater?.([])).toEqual(['graph-document-1'])
    expect(graphUpdater?.(['graph-document-1'])).toEqual([])
  })

  it('dispatches visibility toggles through reference, sketch, and content-specific handlers', () => {
    const nextReferenceRow = referenceItemRow()
    const nextSketchRow = sketchRow()
    const nextObjectRow = objectRow('object-1', 'Pedal Body')
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleReferenceVisibility(nextReferenceRow)
    handlers.handleToggleSketchVisibility(nextSketchRow)
    handlers.handleToggleContentVisibility(nextObjectRow)

    expect(deps.toggleReferenceItemVisibility).toHaveBeenCalledWith('shoe-1')
    expect(deps.toggleSketchVisibility).toHaveBeenCalledWith(nextSketchRow.rowId)
    expect(deps.setPartVisibility).toHaveBeenCalledWith('part:object-1', false)
  })
})
