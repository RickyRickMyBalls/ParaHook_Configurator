import { describe, expect, it, vi } from 'vitest'
import {
  buildBrowserContextMenuItems,
  type BrowserContextMenuBuilderDeps,
} from './browserContextMenu'
import type {
  BrowserAssemblyTreeRowVm,
  BrowserComponentTreeRowVm,
  BrowserGraphTreeRowVm,
  BrowserObjectTreeRowVm,
  BrowserReferenceItemTreeRowVm,
  BrowserTreeRowActionVm,
} from './selectBrowserTreeRows'

const action = (actionId: BrowserTreeRowActionVm['actionId']): BrowserTreeRowActionVm => ({
  actionId,
  label: actionId,
  ariaLabel: actionId,
})

const referenceRootRow = (): BrowserAssemblyTreeRowVm => ({
  rowId: 'reference-root',
  rowKind: 'assembly',
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
  visibilityPartKeys: [],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
})

const referenceCategoryRow = (): BrowserComponentTreeRowVm => ({
  rowId: 'reference-category-row:footpads',
  rowKind: 'component',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'C',
  label: 'Footpads',
  meta: '2 items',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  isVisible: false,
  visibilityPartKeys: [],
  buildState: 'done',
  buildStateLabel: 'Dormant',
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
  referenceCategoryId: 'footpads',
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
  isVisible: false,
  state: 'dormant',
  stateLabel: 'Dormant',
  referenceId: 'shoe-1',
  sourceKind: 'manifest',
  categoryId: 'shoes',
  fileType: 'glb',
  assetPath: '/ReferenceModels/shoes/shoe-1.glb',
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

const visibleContentObjectRow = (): BrowserObjectTreeRowVm => ({
  rowId: 'object-1',
  rowKind: 'object',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'O',
  label: 'Object 1',
  meta: 'Graph 1',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  isVisible: true,
  visibilityPartKeys: ['slot-a'],
  buildState: 'done',
  buildStateLabel: 'Built',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: 'graph-document-1',
  parentComponentId: null,
  objectSourceKind: 'published-object',
  sourceGraphDocumentId: 'graph-document-1',
  sourceOutputEntryId: 'output-entry-1',
  slotId: 'slot-a',
  sourceNodeId: 'node-1',
  resolutionState: 'resolved',
  highlightViewerKey: 'slot-a',
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-1',
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

const hiddenComponentRow = (): BrowserComponentTreeRowVm => ({
  ...inheritedComponentRow(),
  isVisible: false,
})

const visibleAssemblyRow = (): BrowserAssemblyTreeRowVm => ({
  rowId: 'assembly-1',
  rowKind: 'assembly',
  depth: 0,
  treeGuides: [],
  iconLabel: 'A',
  label: 'Main Assembly',
  meta: '',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  isVisible: true,
  visibilityPartKeys: ['slot-a', 'slot-b', 'slot-a'],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
})

const visibleAssemblyRowWithReferences = (): BrowserAssemblyTreeRowVm => ({
  ...visibleAssemblyRow(),
  visibilityPartKeys: [],
  visibilityReferenceIds: ['reference-import:1', 'reference-import:2'],
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

const createDeps = () =>
  ({
    handleRowAction: vi.fn(),
    closeMenus: vi.fn(),
    selectRow: vi.fn(),
    appendBrowserEntry: vi.fn(),
    startReferenceLoadBatchForAll: vi.fn(),
    startReferenceLoadBatchForCategory: vi.fn(),
    retryReferenceItemLoad: vi.fn(),
    setReferenceItemVisibility: vi.fn(),
    setPartVisibility: vi.fn(),
    canExplodeImportedReferenceRow: vi.fn(() => false),
    handleExplodeImportedReferenceRow: vi.fn(),
    handleRetryImportedReferenceRow: vi.fn(),
    handleRemoveImportedReferenceRow: vi.fn(),
    handleRemoveImportedReferenceRows: vi.fn(),
    getMultiSelectImportedReferenceDeleteAction:
      vi.fn<NonNullable<BrowserContextMenuBuilderDeps['getMultiSelectImportedReferenceDeleteAction']>>(
        () => null,
      ),
    getMultiSelectVisibilityAction:
      vi.fn<NonNullable<BrowserContextMenuBuilderDeps['getMultiSelectVisibilityAction']>>(() => null),
    setBrowserGraphBuildPolicy: vi.fn(),
    setBrowserContentBuildPolicy: vi.fn(),
    clearBrowserGraphBuildPolicy: vi.fn(),
    clearBrowserContentBuildPolicy: vi.fn(),
  }) satisfies BrowserContextMenuBuilderDeps

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

  it('adds Explode for eligible imported content-object rows and routes it through the explode seam', () => {
    const deps = createDeps()
    deps.canExplodeImportedReferenceRow.mockReturnValue(true)
    const items = buildBrowserContextMenuItems({
      ...importedContentObjectRow(),
      isVisible: true,
      referenceState: 'active',
      errorMessage: null,
    }, deps)
    const explodeItem = items.find((item) => item.id === 'imported-object:explode')

    explodeItem?.onSelect()

    expect(explodeItem?.label).toBe('Explode')
    expect(deps.canExplodeImportedReferenceRow).toHaveBeenCalledWith('shoe-1')
    expect(deps.handleExplodeImportedReferenceRow).toHaveBeenCalledWith('shoe-1')
  })

  it('uses grouped remove for imported reference rows when a deletable multi-select action is available', () => {
    const deps = createDeps()
    deps.getMultiSelectImportedReferenceDeleteAction.mockReturnValue({
      referenceIds: ['shoe-1', 'shoe-2'],
      ariaLabel: 'Remove 2 selected reference objects',
    })
    const items = buildBrowserContextMenuItems(importedContentObjectRow(), deps)
    const removeItem = items.find((item) => item.id === 'imported-object:remove-multi')

    removeItem?.onSelect()

    expect(removeItem?.label).toBe('Remove')
    expect(removeItem?.ariaLabel).toBe('Remove 2 selected reference objects')
    expect(deps.handleRemoveImportedReferenceRows).toHaveBeenCalledWith(['shoe-1', 'shoe-2'])
    expect(deps.handleRemoveImportedReferenceRow).not.toHaveBeenCalled()
  })

  it('uses grouped Hide for visible object rows when a selected visibility action is available', () => {
    const deps = createDeps()
    deps.getMultiSelectVisibilityAction.mockReturnValue({
      id: 'selected-rows:visibility:hide',
      label: 'Hide',
      ariaLabel: 'Hide 2 selected browser rows',
      onSelect: vi.fn(),
    })
    const items = buildBrowserContextMenuItems(visibleContentObjectRow(), deps)
    const hideItem = items.find((item) => item.id === 'selected-rows:visibility:hide')

    hideItem?.onSelect()

    expect(hideItem?.label).toBe('Hide')
    expect(hideItem?.ariaLabel).toBe('Hide 2 selected browser rows')
    expect(deps.getMultiSelectVisibilityAction).toHaveBeenCalledWith(
      expect.objectContaining({ rowId: 'object-1' }),
    )
  })

  it('uses grouped Hide for imported reference object rows when a selected visibility action is available', () => {
    const deps = createDeps()
    deps.getMultiSelectVisibilityAction.mockReturnValue({
      id: 'selected-rows:visibility:hide',
      label: 'Hide',
      ariaLabel: 'Hide 2 selected browser rows',
      onSelect: vi.fn(),
    })
    const items = buildBrowserContextMenuItems(importedContentObjectRow(), deps)
    const hideItem = items.find((item) => item.id === 'selected-rows:visibility:hide')

    hideItem?.onSelect()

    expect(hideItem?.label).toBe('Hide')
    expect(hideItem?.ariaLabel).toBe('Hide 2 selected browser rows')
    expect(deps.getMultiSelectVisibilityAction).toHaveBeenCalledWith(
      expect.objectContaining({ rowId: 'reference-item-row:shoe-1' }),
    )
  })

  it('adds make-independent actions for inherited build-policy rows', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(inheritedComponentRow(), deps)
    const makeIndependentItem = items.find((item) => item.id === 'browser-policy:make-independent')

    makeIndependentItem?.onSelect()

    expect(makeIndependentItem?.label).toBe('Make Independent')
    expect(deps.setBrowserContentBuildPolicy).toHaveBeenCalledWith('component-1', 'manual')
  })

  it('adds Hide for visible assembly rows and toggles all unique descendant part keys off', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(visibleAssemblyRow(), deps)
    const hideItem = items.find((item) => item.id === 'assembly:assembly-1:visibility')

    hideItem?.onSelect()

    expect(hideItem?.label).toBe('Hide')
    expect(deps.closeMenus).toHaveBeenCalledTimes(1)
    expect(deps.selectRow).toHaveBeenCalledWith('assembly-1')
    expect(deps.appendBrowserEntry).toHaveBeenCalledWith('Hide: assembly Main Assembly')
    expect(deps.setPartVisibility).toHaveBeenNthCalledWith(1, 'slot-a', false)
    expect(deps.setPartVisibility).toHaveBeenNthCalledWith(2, 'slot-b', false)
    expect(deps.setPartVisibility).toHaveBeenCalledTimes(2)
  })

  it('adds Show for hidden component rows and toggles descendant part keys on', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(hiddenComponentRow(), deps)
    const showItem = items.find((item) => item.id === 'component:component-1:visibility')

    showItem?.onSelect()

    expect(showItem?.label).toBe('Show')
    expect(deps.closeMenus).toHaveBeenCalledTimes(1)
    expect(deps.selectRow).toHaveBeenCalledWith('component-1')
    expect(deps.appendBrowserEntry).toHaveBeenCalledWith('Show: component Pedal Component')
    expect(deps.setPartVisibility).toHaveBeenCalledWith('part:component-1', true)
  })

  it('adds Hide for visible assembly rows that only own reference-backed children and routes through reference visibility', () => {
    const deps = createDeps()
    const items = buildBrowserContextMenuItems(visibleAssemblyRowWithReferences(), deps)
    const hideItem = items.find((item) => item.id === 'assembly:assembly-1:visibility')

    hideItem?.onSelect()

    expect(hideItem?.label).toBe('Hide')
    expect(deps.setReferenceItemVisibility).toHaveBeenNthCalledWith(1, 'reference-import:1', false)
    expect(deps.setReferenceItemVisibility).toHaveBeenNthCalledWith(2, 'reference-import:2', false)
    expect(deps.setPartVisibility).not.toHaveBeenCalled()
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
