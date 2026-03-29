import { describe, expect, it, vi } from 'vitest'
import { buildBrowserContextMenuItems } from './browserContextMenu'
import type {
  BrowserComponentTreeRowVm,
  BrowserGraphTreeRowVm,
  BrowserObjectTreeRowVm,
  BrowserReferenceCategoryTreeRowVm,
  BrowserReferenceItemTreeRowVm,
  BrowserReferencesRootTreeRowVm,
  BrowserTreeRowActionVm,
} from './selectBrowserTreeRows'

const action = (actionId: BrowserTreeRowActionVm['actionId']): BrowserTreeRowActionVm => ({
  actionId,
  label: actionId,
  ariaLabel: actionId,
})

const referenceRootRow = (): BrowserReferencesRootTreeRowVm => ({
  rowId: 'reference-root',
  rowKind: 'references-root',
  depth: 0,
  treeGuides: [],
  iconLabel: 'A',
  label: 'References',
  meta: '3 categories',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  isVisible: false,
  state: 'dormant',
  stateLabel: 'Dormant',
})

const referenceCategoryRow = (): BrowserReferenceCategoryTreeRowVm => ({
  rowId: 'reference-category-row:footpads',
  rowKind: 'reference-category',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'C',
  label: 'Footpads',
  meta: '2 items',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  categoryId: 'footpads',
  itemCount: 2,
  emptyLabel: '',
  isVisible: false,
  state: 'dormant',
  stateLabel: 'Dormant',
})

const hiddenReferenceItemRow = (): BrowserReferenceItemTreeRowVm => ({
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
  actions: [action('transform-object')],
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

const importedErrorReferenceItemRow = (): BrowserReferenceItemTreeRowVm => ({
  ...hiddenReferenceItemRow(),
  sourceKind: 'imported',
  state: 'error',
  stateLabel: 'Error',
  errorMessage: 'Load failed',
})

const importedContentObjectRow = (): BrowserObjectTreeRowVm => ({
  rowId: 'reference-item-row:shoe-1',
  rowKind: 'object',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'O',
  label: 'Shoe 1',
  meta: 'GLB',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [action('transform-object')],
  isVisible: false,
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
  referenceId: 'shoe-1',
  referenceSourceKind: 'imported',
  referenceState: 'error',
  fileType: 'glb',
  assetPath: '/ReferenceModels/shoes/shoe-1.glb',
  errorMessage: 'Load failed',
})

const inheritedComponentRow = (): BrowserComponentTreeRowVm => ({
  rowId: 'component-1',
  rowKind: 'component',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'C',
  label: 'Pedal Component',
  meta: 'Graph 1',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  isVisible: true,
  visibilityPartKeys: ['part:component-1'],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: 'graph-document-1',
  sourceGraphDocumentId: 'graph-document-1',
  sourceOutputEntryId: 'output-entry:s001:node-1',
  componentSourceKind: 'published-component',
  resolutionState: 'resolved',
  receiveId: null,
  slotId: null,
  sourceNodeId: 'node-1',
  highlightViewerKey: 'part:component-1',
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-1',
  authoredBrowserBuildPolicy: null,
  effectiveBrowserBuildPolicy: 'manual',
  effectiveBrowserBuildPolicySource: 'assembly',
  effectiveBrowserBuildPolicySourceLabel: 'Main Assembly',
})

const authoredGraphRow = (): BrowserGraphTreeRowVm => ({
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
  isExpanded: true,
  actions: [],
  saveState: 'saved',
  openViewportCount: 0,
  hasFocusedViewport: false,
  buildState: 'done',
  buildStateLabel: 'Done',
  children: [],
  authoredBrowserBuildPolicy: 'release',
  effectiveBrowserBuildPolicy: 'release',
  effectiveBrowserBuildPolicySource: 'self',
  effectiveBrowserBuildPolicySourceLabel: null,
})

const createDeps = () => ({
  handleRowAction: vi.fn(),
  closeMenus: vi.fn(),
  selectRow: vi.fn(),
  appendBrowserEntry: vi.fn(),
  startReferenceLoadBatchForAll: vi.fn(),
  startReferenceLoadBatchForCategory: vi.fn(),
  retryReferenceItemLoad: vi.fn(),
  setReferenceItemVisibility: vi.fn(),
  handleRetryImportedReferenceRow: vi.fn(),
  handleRemoveImportedReferenceRow: vi.fn(),
  setBrowserGraphBuildPolicy: vi.fn(),
  setBrowserContentBuildPolicy: vi.fn(),
  clearBrowserGraphBuildPolicy: vi.fn(),
  clearBrowserContentBuildPolicy: vi.fn(),
})

describe('buildBrowserContextMenuItems', () => {
  it('adds load-all actions for the references root and categories', () => {
    const deps = createDeps()

    const rootItems = buildBrowserContextMenuItems(referenceRootRow(), deps)
    const categoryItems = buildBrowserContextMenuItems(referenceCategoryRow(), deps)

    rootItems[0]?.onSelect()
    categoryItems[0]?.onSelect()

    expect(rootItems[0]?.label).toBe('Load All')
    expect(categoryItems[0]?.label).toBe('Load All')
    expect(deps.startReferenceLoadBatchForAll).toHaveBeenCalledTimes(1)
    expect(deps.startReferenceLoadBatchForCategory).toHaveBeenCalledWith('footpads')
  })

  it('adds a load-model action for hidden reference items and routes it through the reference loader seam', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(hiddenReferenceItemRow(), deps)
    const loadModelItem = items.find((item) => item.id === 'reference-item:load-model')

    loadModelItem?.onSelect()

    expect(loadModelItem?.label).toBe('Load Model')
    expect(deps.selectRow).toHaveBeenCalledWith('reference-item-row:shoe-1')
    expect(deps.retryReferenceItemLoad).toHaveBeenCalledWith('shoe-1')
    expect(deps.setReferenceItemVisibility).not.toHaveBeenCalled()
  })

  it('adds retry and remove actions for imported references in error', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(importedErrorReferenceItemRow(), deps)
    const retryItem = items.find((item) => item.id === 'reference-item:retry')
    const removeItem = items.find((item) => item.id === 'reference-item:remove')

    retryItem?.onSelect()
    removeItem?.onSelect()

    expect(retryItem?.label).toBe('Retry')
    expect(removeItem?.label).toBe('Remove')
    expect(deps.handleRetryImportedReferenceRow).toHaveBeenCalledWith('shoe-1')
    expect(deps.handleRemoveImportedReferenceRow).toHaveBeenCalledWith('shoe-1')
  })

  it('keeps imported content-object maintenance actions on object rows in the content tree', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(importedContentObjectRow(), deps)
    const retryItem = items.find((item) => item.id === 'imported-object:retry')
    const removeItem = items.find((item) => item.id === 'imported-object:remove')

    retryItem?.onSelect()
    removeItem?.onSelect()

    expect(retryItem?.label).toBe('Retry')
    expect(removeItem?.label).toBe('Remove')
    expect(deps.handleRetryImportedReferenceRow).toHaveBeenCalledWith('shoe-1')
    expect(deps.handleRemoveImportedReferenceRow).toHaveBeenCalledWith('shoe-1')
  })

  it('adds make-independent actions for inherited build-policy rows', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(inheritedComponentRow(), deps)
    const makeIndependentItem = items.find((item) => item.id === 'browser-policy:make-independent')

    makeIndependentItem?.onSelect()

    expect(makeIndependentItem?.label).toBe('Make Independent')
    expect(deps.setBrowserContentBuildPolicy).toHaveBeenCalledWith('component-1', 'manual')
  })

  it('adds return-to-default actions for authored graph build-policy rows', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(authoredGraphRow(), deps)
    const returnItem = items.find((item) => item.id === 'browser-policy:return-to-parent')

    returnItem?.onSelect()

    expect(returnItem?.label).toBe('Return To Default')
    expect(deps.clearBrowserGraphBuildPolicy).toHaveBeenCalledWith('graph-document-1')
  })
})
