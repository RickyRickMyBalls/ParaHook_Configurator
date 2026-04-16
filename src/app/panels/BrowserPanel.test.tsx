// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReferenceWorkspaceBrowserTreeVm } from '../store/useAppStore'

let currentSpaghettiState: any
let currentAppState: any
let importReferenceFileFromDiskMock: ReturnType<typeof vi.fn>
let importReferenceFilesFromDiskMock: ReturnType<typeof vi.fn>
let importSupportedReferenceFilesFromDiskMock: ReturnType<typeof vi.fn>
let mockRequestBrowserGraphDocumentBuild: ReturnType<typeof vi.fn>
const { viewerFrameSelectionSetMock } = vi.hoisted(() => ({
  viewerFrameSelectionSetMock: vi.fn(),
}))

const countMockRows = (count: number, singular: string, plural: string) =>
  count === 1 ? `1 ${singular}` : `${count} ${plural}`

const isReferenceCategoryComponentId = (componentId: string) =>
  componentId.startsWith('reference-category-row:')

const resolveMockOwnerParentKey = (target: any) => {
  if (target.kind === 'object' || target.kind === 'imported-reference') {
    if (target.kind === 'imported-reference') {
      const referenceItem =
        currentAppState.referenceWorkspaceTree?.categories
          ?.flatMap((category: any) => category.items)
          ?.find((item: any) => item.referenceId === target.referenceId) ?? null
      if (referenceItem === null) {
        return null
      }
      return (
        referenceItem.parentComponentId ??
        referenceItem.parentAssemblyId ??
        `reference-category-row:${referenceItem.categoryId}`
      )
    }
    const objectRow = currentAppState.projectContent?.objectsById?.[target.objectId] ?? null
    if (objectRow !== null) {
      return objectRow.parentComponentId ?? objectRow.parentAssemblyId ?? null
    }
    const referenceItem =
      currentAppState.referenceWorkspaceTree?.categories
        ?.flatMap((category: any) => category.items)
        ?.find((item: any) => item.rowId === target.objectId) ?? null
    if (referenceItem === null) {
      return null
    }
    return (
      referenceItem.parentComponentId ??
      referenceItem.parentAssemblyId ??
      `reference-category-row:${referenceItem.categoryId}`
    )
  }
  if (target.kind === 'component') {
    const componentRow = currentAppState.projectContent?.componentsById?.[target.componentId] ?? null
    if (componentRow !== null) {
      return componentRow.parentComponentId ?? componentRow.parentAssemblyId ?? null
    }
    if (isReferenceCategoryComponentId(target.componentId)) {
      return currentAppState.referenceWorkspaceTree?.rowId ?? null
    }
    return null
  }
  const assemblyRow = currentAppState.projectContent?.assembliesById?.[target.assemblyId] ?? null
  return assemblyRow?.parentAssemblyId ?? null
}

const buildMockProjectContentRows = () => {
  const authoredRows = currentAppState?.projectContentRows ?? []
  const referenceWorkspaceTree = currentAppState?.referenceWorkspaceTree ?? null
  if (referenceWorkspaceTree === null) {
    return authoredRows
  }
  const hasUnifiedReferenceHierarchy = authoredRows.some(
    (row: any) =>
      (row.kind === 'assembly' && row.referenceContainerKind === 'root') ||
      (row.kind === 'component' && row.referenceContainerKind === 'category') ||
      (row.kind === 'object' &&
        (row.contentOriginKind === 'source-reference' ||
          row.contentOriginKind === 'imported-reference')),
  )
  if (hasUnifiedReferenceHierarchy) {
    return authoredRows
  }

  const syntheticRows: any[] = [
    {
      rowId: referenceWorkspaceTree.rowId,
      kind: 'assembly',
      label: referenceWorkspaceTree.label,
      meta: countMockRows(
        referenceWorkspaceTree.categories.reduce(
          (sum: number, category: any) => sum + category.itemCount,
          0,
        ),
        'item',
        'items',
      ),
      parentAssemblyId: null,
      isVisible: referenceWorkspaceTree.categories.some((category: any) =>
        category.items.some((item: any) => item.isVisible && item.loadState === 'loaded'),
      ),
      visibilityPartKeys: [],
      referenceContainerKind: 'root',
      referenceCategoryId: null,
      referenceContainerItemCount: referenceWorkspaceTree.categories.reduce(
        (sum: number, category: any) => sum + category.itemCount,
        0,
      ),
      referenceContainerEmptyLabel: null,
    },
  ]

  referenceWorkspaceTree.categories.forEach((category: any) => {
    const shelfItems = category.items.filter(
      (item: any) => item.parentAssemblyId == null && item.parentComponentId == null,
    )
    const renderCategoryRow = category.categoryId !== 'user-references'
    if (renderCategoryRow) {
      syntheticRows.push({
        rowId: category.rowId,
        kind: 'component',
        label: category.label,
        meta: countMockRows(category.itemCount, 'item', 'items'),
        parentAssemblyId: referenceWorkspaceTree.rowId,
        isVisible: shelfItems.some((item: any) => item.isVisible && item.loadState === 'loaded'),
        visibilityPartKeys: [],
        ownerGraphDocumentId: null,
        sourceGraphDocumentId: null,
        sourceOutputEntryId: null,
        componentSourceKind: 'receive-link',
        resolutionState: 'resolved',
        receiveId: null,
        childObjectCount: category.itemCount,
        slotId: null,
        sourceNodeId: null,
        highlightViewerKey: null,
        authoringGraphDocumentId: null,
        authoringNodeId: null,
        referenceContainerKind: 'category',
        referenceCategoryId: category.categoryId,
        referenceContainerItemCount: category.itemCount,
        referenceContainerEmptyLabel: category.emptyLabel,
      })
    }

    shelfItems.forEach((item: any) => {
      syntheticRows.push({
        rowId: item.rowId,
        kind: 'object',
        label: item.label,
        meta: item.fileType.toUpperCase(),
        parentAssemblyId:
          item.parentAssemblyId ??
          (item.parentComponentId == null ? referenceWorkspaceTree.rowId : null),
        parentComponentId:
          item.parentComponentId ?? (item.parentAssemblyId == null && renderCategoryRow ? category.rowId : null),
        isVisible: item.isVisible,
        visibilityPartKeys: [],
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
          item.parentAssemblyId != null || item.parentComponentId != null
            ? 'imported-reference'
            : 'source-reference',
        referenceId: item.referenceId,
        referenceSourceKind: item.sourceKind,
        referenceCategoryId: category.categoryId,
        referenceLoadState: item.loadState,
        fileType: item.fileType,
        assetPath: item.assetPath,
        errorMessage: item.errorMessage ?? null,
        partRows: item.parts ?? [],
      })
    })

    category.items
      .filter((item: any) => item.parentAssemblyId != null || item.parentComponentId != null)
      .forEach((item: any) => {
        syntheticRows.push({
          rowId: item.rowId,
          kind: 'object',
          label: item.label,
          meta: item.fileType.toUpperCase(),
          parentAssemblyId: item.parentAssemblyId ?? null,
          parentComponentId: item.parentComponentId ?? null,
          isVisible: item.isVisible,
          visibilityPartKeys: [],
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
          contentOriginKind: 'imported-reference',
          referenceId: item.referenceId,
          referenceSourceKind: item.sourceKind,
          referenceCategoryId: category.categoryId,
          referenceLoadState: item.loadState,
          fileType: item.fileType,
          assetPath: item.assetPath,
          errorMessage: item.errorMessage ?? null,
          partRows: item.parts ?? [],
        })
      })
  })

  return [...syntheticRows, ...authoredRows]
}

vi.mock('../spaghetti/store/useSpaghettiStore', () => ({
  useSpaghettiStore: (selector: (state: any) => unknown) => selector(currentSpaghettiState),
  selectSharedViewerComposition: (state: any) => state.sharedViewerComposition,
  selectSharedViewerCompositionGraphDocumentIds: (state: any) =>
    state.sharedViewerCompositionGraphDocumentIds,
  defaultViewportPosition: { x: 344, y: 16 },
}))

vi.mock('../store/useAppStore', () => ({
  useAppStore: (selector: (state: any) => unknown) => selector(currentAppState),
  canReferenceItemExplode: (state: any, referenceId: string) => {
    const referenceRecord = state.referenceWorkspace?.importedReferencesById?.[referenceId]
    if (referenceRecord === undefined) {
      return false
    }
    const runtimeParts = state.referenceWorkspace?.partRowsByReferenceId?.[referenceId] ?? []
    const loadState = state.referenceWorkspace?.loadStateById?.[referenceId] ?? 'unloaded'
    return (
      loadState === 'loaded' &&
      runtimeParts.length > 0 &&
      runtimeParts.every(
        (part: any) => Number.isInteger(part.sourceMeshIndex) && part.sourceMeshIndex >= 0,
      )
    )
  },
  REFERENCE_ROOT_ROW_ID: 'reference-root',
  buildImportedReferenceRowId: (referenceId: string) => `reference-item-row:${referenceId}`,
  buildReferenceCategoryRowId: (categoryId: string) => `reference-category-row:${categoryId}`,
  selectCurrentProjectContentBrowserRows: () => buildMockProjectContentRows(),
  selectReferenceWorkspaceBrowserTree: () => currentAppState.referenceWorkspaceTree,
  selectShouldSuppressBrowserGraphRuntimeOutput: () => false,
  resolveProjectContentOwnerDrop: (_state: any, draggedTarget: any, dropTarget: any) => {
    const resolveParentKey = (target: any) => resolveMockOwnerParentKey(target)
    if (
      (draggedTarget.kind === 'object' ||
        draggedTarget.kind === 'component' ||
        draggedTarget.kind === 'imported-reference') &&
      (dropTarget.kind === 'object' ||
        dropTarget.kind === 'component' ||
        dropTarget.kind === 'imported-reference') &&
      (dropTarget.position === 'before' || dropTarget.position === 'after')
    ) {
      return resolveParentKey(draggedTarget) === resolveParentKey(dropTarget)
        ? {
            valid: true,
            kind: 'reorder',
            parentTarget: null,
            draggedTarget,
            dropTarget,
          }
        : { valid: false, reason: 'invalid-same-parent' }
    }
    if (
      (draggedTarget.kind === 'object' ||
        draggedTarget.kind === 'component' ||
        draggedTarget.kind === 'imported-reference') &&
      dropTarget.kind === 'component' &&
      dropTarget.position === 'into'
    ) {
      return {
        valid: true,
        kind: 'reparent',
        parentTarget: { kind: 'component', componentId: dropTarget.componentId },
        draggedTarget,
        dropTarget,
      }
    }
    if (
      (draggedTarget.kind === 'object' ||
        draggedTarget.kind === 'component' ||
        draggedTarget.kind === 'imported-reference') &&
      dropTarget.kind === 'assembly' &&
      dropTarget.position === 'into'
    ) {
      const draggedParentKey = resolveParentKey(draggedTarget)
      const targetParentKey = dropTarget.assemblyId
      if (draggedParentKey === targetParentKey) {
        return { valid: false, reason: 'same-parent-into' }
      }
      return {
        valid: true,
        kind: 'reparent',
        parentTarget: { kind: 'assembly', assemblyId: dropTarget.assemblyId },
        draggedTarget,
        dropTarget,
      }
    }
    return { valid: false, reason: 'illegal-target' }
  },
  resolveBrowserDraggableTargetDrop: (state: any, draggedTarget: any, dropTarget: any) => {
    const { resolveProjectContentOwnerDrop } = {
      resolveProjectContentOwnerDrop: (_nextState: any, nextDraggedTarget: any, nextDropTarget: any) => {
        const resolveParentKey = (target: any) => resolveMockOwnerParentKey(target)
        if (
          (nextDraggedTarget.kind === 'object' ||
            nextDraggedTarget.kind === 'component' ||
            nextDraggedTarget.kind === 'imported-reference') &&
          (nextDropTarget.kind === 'object' ||
            nextDropTarget.kind === 'component' ||
            nextDropTarget.kind === 'imported-reference') &&
          (nextDropTarget.position === 'before' || nextDropTarget.position === 'after')
        ) {
          return resolveParentKey(nextDraggedTarget) === resolveParentKey(nextDropTarget)
            ? {
                valid: true,
                kind: 'reorder',
                parentTarget: null,
                draggedTarget: nextDraggedTarget,
                dropTarget: nextDropTarget,
              }
            : { valid: false, reason: 'invalid-same-parent' }
        }
        if (
          (nextDraggedTarget.kind === 'object' ||
            nextDraggedTarget.kind === 'component' ||
            nextDraggedTarget.kind === 'imported-reference') &&
          nextDropTarget.kind === 'component' &&
          nextDropTarget.position === 'into'
        ) {
          return {
            valid: true,
            kind: 'reparent',
            parentTarget: { kind: 'component', componentId: nextDropTarget.componentId },
            draggedTarget: nextDraggedTarget,
            dropTarget: nextDropTarget,
          }
        }
        if (
          (nextDraggedTarget.kind === 'object' ||
            nextDraggedTarget.kind === 'component' ||
            nextDraggedTarget.kind === 'imported-reference') &&
          nextDropTarget.kind === 'assembly' &&
          nextDropTarget.position === 'into'
        ) {
          const draggedParentKey = resolveParentKey(nextDraggedTarget)
          const targetParentKey = nextDropTarget.assemblyId
          if (draggedParentKey === targetParentKey) {
            return { valid: false, reason: 'same-parent-into' }
          }
          return {
            valid: true,
            kind: 'reparent',
            parentTarget: { kind: 'assembly', assemblyId: nextDropTarget.assemblyId },
            draggedTarget: nextDraggedTarget,
            dropTarget: nextDropTarget,
          }
        }
        return { valid: false, reason: 'illegal-target' }
      },
    }
    return resolveProjectContentOwnerDrop(state, draggedTarget, dropTarget)
  },
  buildProjectSketchBrowserRowId: (
    graphDocumentId: string,
    nodeId: string,
    featureId: string,
  ) => `project-sketch:${graphDocumentId}:${nodeId}:${featureId}`,
}))

vi.mock('../references/importReferenceFile', () => ({
  REFERENCE_IMPORT_LABEL_BY_FILE_TYPE: {
    step: 'Import .step',
    stl: 'Import .stl',
    obj: 'Import .obj',
    glb: 'Import .glb',
  },
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES: ['step', 'stl', 'obj', 'glb'],
  importReferenceFileFromDisk: (...args: unknown[]) => importReferenceFileFromDiskMock(...args),
  importReferenceFilesFromDisk: (...args: unknown[]) => importReferenceFilesFromDiskMock(...args),
  importSupportedReferenceFilesFromDisk: (...args: unknown[]) =>
    importSupportedReferenceFilesFromDiskMock(...args),
}))

vi.mock('../viewerBridge', () => ({
  getViewer: () => ({
    frameSelectionSet: viewerFrameSelectionSetMock,
  }),
}))

import { BrowserPanel } from './BrowserPanel'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const graphDocument = {
  graphDocumentId: 'graph-document-1',
  name: 'Graph 1',
  version: 1,
  graph: {
    schemaVersion: 1,
    nodes: [],
    edges: [],
  },
}

const secondGraphDocument = {
  graphDocumentId: 'graph-document-2',
  name: 'Graph 2',
  version: 1,
  graph: {
    schemaVersion: 1,
    nodes: [],
    edges: [],
  },
}

const cachedGraphEntry = {
  cachedGraphId: 'cached-graph-1',
  graphDocumentId: 'graph-document-1',
  source: 'in-memory' as const,
  isDirty: true,
}

const editorViewport = {
  editorViewportId: 'editor-viewport-1',
  graphDocumentId: 'graph-document-1',
  isFocused: true,
  windowMode: 'expanded' as const,
  position: { x: 12, y: 12 },
  size: { width: 800, height: 600 },
  splitRatio: 0.5,
  restoreFromCollapsed: null,
  restoreFromSplit: null,
  zOrder: 21,
}

const renderBrowserPanel = async (props?: Record<string, unknown>) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(<BrowserPanel {...props} />)
  })

  return { container, root }
}

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

const referenceWorkspaceStateFromTree = (tree: ReferenceWorkspaceBrowserTreeVm) => ({
  referencesExpanded: tree.isExpanded,
  categoryExpandedById: Object.fromEntries(
    tree.categories.map((category) => [category.categoryId, category.isExpanded]),
  ),
  visibilityById: Object.fromEntries(
    tree.categories.flatMap((category) =>
      category.items.map((item) => [item.referenceId, item.isVisible] as const),
    ),
  ),
  loadStateById: Object.fromEntries(
    tree.categories.flatMap((category) =>
      category.items.map((item) => [item.referenceId, item.loadState] as const),
    ),
  ),
  errorById: Object.fromEntries(
    tree.categories.flatMap((category) =>
      category.items.map((item) => [item.referenceId, item.errorMessage] as const),
    ),
  ),
  partRowsByReferenceId: Object.fromEntries(
    tree.categories.flatMap((category) =>
      category.items.map((item) => [item.referenceId, item.parts ?? []] as const),
    ),
  ),
  importedReferencesById: Object.fromEntries(
    tree.categories
      .flatMap((category) => category.items)
      .filter((item) => item.sourceKind === 'imported')
      .map((item) => [
        item.referenceId,
        {
          referenceId: item.referenceId,
          sourceKind: item.sourceKind,
          label: item.label,
          categoryId: item.categoryId,
          fileType: item.fileType,
          assetPath: item.assetPath,
          parentAssemblyId: item.parentAssemblyId ?? null,
          parentComponentId: item.parentComponentId ?? null,
          explodedFromReferenceId: item.explodedFromReferenceId ?? null,
          sourcePartKey: item.sourcePartKey ?? null,
          sourceMeshIndex: item.sourceMeshIndex ?? null,
        },
      ]),
  ),
  importedReferenceOrder: tree.categories
    .flatMap((category) => category.items)
    .filter((item) => item.sourceKind === 'imported')
    .map((item) => item.referenceId),
  stagedImportDraft: null,
  transformOverrideById: {},
  contentOrderByParentKey: {},
  referenceLoadBatch: null,
})

const buildExplodedImportedChildrenScenario = (options?: {
  includeSecondAssembly?: boolean
  selectedReferenceIds?: string[]
}) => {
  const includeSecondAssembly = options?.includeSecondAssembly ?? false
  const selectedReferenceIds = options?.selectedReferenceIds ?? []
  const referenceWorkspaceTree: ReferenceWorkspaceBrowserTreeVm = {
    rowId: 'reference-root',
    label: 'References',
    isExpanded: true,
    categories: [
      ...emptyReferenceWorkspaceTree.categories.slice(0, 3),
      {
        rowId: 'reference-category-row:user-references',
        categoryId: 'user-references',
        label: 'User References',
        isExpanded: true,
        itemCount: 2,
        visibleItemCount: 2,
        hasLoadingItem: false,
        hasErrorItem: false,
        emptyLabel: 'No imported references yet.',
        items: [
          {
            rowId: 'reference-item-row:reference-import:child-1',
            referenceId: 'reference-import:child-1',
            sourceKind: 'imported',
            label: 'Sole',
            categoryId: 'user-references',
            fileType: 'glb',
            assetPath: 'blob:shoe-exploded',
            isVisible: true,
            loadState: 'loaded',
            errorMessage: null,
            parts: [],
            parentAssemblyId: 'assembly-1',
            explodedFromReferenceId: 'reference-import:wrapper-1',
            sourcePartKey: 'reference-part:reference-import:wrapper-1:0',
            sourceMeshIndex: 0,
          },
          {
            rowId: 'reference-item-row:reference-import:child-2',
            referenceId: 'reference-import:child-2',
            sourceKind: 'imported',
            label: 'Upper',
            categoryId: 'user-references',
            fileType: 'glb',
            assetPath: 'blob:shoe-exploded',
            isVisible: true,
            loadState: 'loaded',
            errorMessage: null,
            parts: [],
            parentAssemblyId: 'assembly-1',
            explodedFromReferenceId: 'reference-import:wrapper-1',
            sourcePartKey: 'reference-part:reference-import:wrapper-1:1',
            sourceMeshIndex: 1,
          },
        ],
      },
    ],
  }
  const firstSelectedReferenceId = selectedReferenceIds[0] ?? null
  const explicitSelectedTargets = selectedReferenceIds.map((referenceId) => ({
    kind: 'object' as const,
    objectId: `reference-item-row:${referenceId}`,
  }))

  return {
    ...currentAppState,
    projectContent: {
      assembliesById: {
        'assembly-1': {
          assemblyId: 'assembly-1',
          label: 'Assembly 1',
          parentAssemblyId: null,
          assemblySourceKind: 'authored',
          childRowIds: [
            'reference-item-row:reference-import:child-1',
            'reference-item-row:reference-import:child-2',
          ],
        },
        ...(includeSecondAssembly
          ? {
              'assembly-2': {
                assemblyId: 'assembly-2',
                label: 'Assembly 2',
                parentAssemblyId: null,
                assemblySourceKind: 'authored',
                childRowIds: [],
              },
            }
          : {}),
      },
      componentsById: {},
      objectsById: {},
    },
    projectContentRows: [
      {
        rowId: 'assembly-1',
        kind: 'assembly',
        label: 'Assembly 1',
        meta: '',
        parentAssemblyId: null,
        isVisible: true,
        visibilityPartKeys: [],
        buildState: 'done',
        buildStateLabel: 'Built',
        rebuildGraphDocumentIds: [],
        statusLabel: 'Ready',
        statusTone: 'ready',
      },
      ...(includeSecondAssembly
        ? [
            {
              rowId: 'assembly-2',
              kind: 'assembly',
              label: 'Assembly 2',
              meta: '',
              parentAssemblyId: null,
              isVisible: true,
              visibilityPartKeys: [],
              buildState: 'done',
              buildStateLabel: 'Built',
              rebuildGraphDocumentIds: [],
              statusLabel: 'Ready',
              statusTone: 'ready',
            },
          ]
        : []),
    ],
    referenceWorkspaceTree,
    referenceWorkspace: referenceWorkspaceStateFromTree(referenceWorkspaceTree),
    workspaceSelection: {
      ...currentAppState.workspaceSelection,
      selectedTarget:
        firstSelectedReferenceId === null
          ? null
          : {
              kind: 'object',
              objectId: `reference-item-row:${firstSelectedReferenceId}`,
            },
      explicitSelectedTargets,
      selectionAnchorTarget:
        firstSelectedReferenceId === null
          ? null
          : {
              kind: 'object',
              objectId: `reference-item-row:${firstSelectedReferenceId}`,
            },
      resolvedContentSelection: null,
      activeSurface: 'browser',
    },
  }
}

const isMockExplicitSelectionTarget = (target: any): boolean =>
  target !== null &&
  [
    'references-root',
    'reference-category',
    'reference-item',
    'assembly',
    'component',
    'object',
  ].includes(target.kind)

const getMockSelectionTargetKey = (target: any): string => {
  switch (target.kind) {
    case 'references-root':
      return 'references-root'
    case 'reference-category':
      return `reference-category:${target.categoryId}`
    case 'reference-item':
      return `reference-item:${target.referenceId}`
    case 'assembly':
      return `assembly:${target.assemblyId}`
    case 'component':
      return `component:${target.componentId}`
    case 'object':
      return `object:${target.objectId}`
    default:
      return `${target.kind}`
  }
}

const resolveMockWorkspaceSelectionTargetFromOwnerTarget = (target: any) =>
  target.kind === 'assembly'
    ? { kind: 'assembly', assemblyId: target.assemblyId }
    : target.kind === 'component'
      ? { kind: 'component', componentId: target.componentId }
      : target.kind === 'object'
        ? { kind: 'object', objectId: target.objectId }
        : { kind: 'object', objectId: `reference-item-row:${target.referenceId}` }

const resolveMockContentSelection = (explicitTargets: any[]) => {
  const projectContentRows = buildMockProjectContentRows()
  const contentTargets = explicitTargets.filter((target) =>
    ['assembly', 'component', 'object'].includes(target.kind),
  )
  if (contentTargets.length === 0) {
    return null
  }

  const resolveSingle = (
    target: any,
  ): {
    rootRowId: string
    rootKind: 'assembly' | 'component' | 'object'
    partKeys: string[]
    groupedRowIds: string[]
  } | null => {
    if (target.kind === 'object') {
      const objectRow = projectContentRows.find(
        (row: any) => row.kind === 'object' && row.rowId === target.objectId,
      )
      return objectRow === undefined
        ? null
        : {
            rootRowId: objectRow.rowId,
            rootKind: 'object' as const,
            partKeys: [...new Set((objectRow.visibilityPartKeys ?? []) as string[])],
            groupedRowIds: [],
          }
    }
    if (target.kind === 'component') {
      const componentRow = projectContentRows.find(
        (row: any) => row.kind === 'component' && row.rowId === target.componentId,
      )
      if (componentRow === undefined) {
        return null
      }
      const groupedRows = projectContentRows.filter(
        (row: any) => row.kind === 'object' && row.parentComponentId === componentRow.rowId,
      )
      return {
        rootRowId: componentRow.rowId,
        rootKind: 'component' as const,
        partKeys: [
          ...new Set<string>(
            groupedRows.flatMap((row: any) => (row.visibilityPartKeys ?? []) as string[]),
          ),
        ],
        groupedRowIds: groupedRows.map((row: any) => row.rowId),
      }
    }

    const assemblyRow = projectContentRows.find(
      (row: any) => row.kind === 'assembly' && row.rowId === target.assemblyId,
    )
    if (assemblyRow === undefined) {
      return null
    }
    const groupedRowIds: string[] = []
    const partKeySet = new Set<string>()
    const groupedRowIdSet = new Set<string>()
    const addGroupedRow = (row: any) => {
      if (groupedRowIdSet.has(row.rowId)) {
        return
      }
      groupedRowIdSet.add(row.rowId)
      groupedRowIds.push(row.rowId)
      ;((row.visibilityPartKeys ?? []) as string[]).forEach((partKey) => partKeySet.add(partKey))
    }
    const visitAssembly = (assemblyId: string) => {
      projectContentRows
        .filter((row: any) => row.kind === 'assembly' && row.parentAssemblyId === assemblyId)
        .forEach((row: any) => {
          addGroupedRow(row)
          visitAssembly(row.rowId)
        })
      projectContentRows
        .filter((row: any) => row.kind === 'component' && row.parentAssemblyId === assemblyId)
        .forEach((row: any) => {
          addGroupedRow(row)
          projectContentRows
            .filter((objectRow: any) => objectRow.kind === 'object' && objectRow.parentComponentId === row.rowId)
            .forEach((objectRow: any) => {
              addGroupedRow(objectRow)
            })
        })
      projectContentRows
        .filter(
          (row: any) =>
            row.kind === 'object' &&
            row.parentAssemblyId === assemblyId &&
            row.parentComponentId == null,
        )
        .forEach((row: any) => {
          addGroupedRow(row)
        })
    }
    visitAssembly(assemblyRow.rowId)
    const assemblyPartKeys = (assemblyRow.visibilityPartKeys ?? []) as string[]
    if (assemblyPartKeys.length > 0) {
      projectContentRows
        .filter(
          (row: any) =>
            (row.kind === 'component' || row.kind === 'object') &&
            ((row.visibilityPartKeys ?? []) as string[]).some((partKey) => assemblyPartKeys.includes(partKey)),
        )
        .forEach((row: any) => addGroupedRow(row))
    }
    return {
      rootRowId: assemblyRow.rowId,
      rootKind: 'assembly' as const,
      partKeys: [...partKeySet],
      groupedRowIds,
    }
  }

  if (explicitTargets.length === 1) {
    return resolveSingle(contentTargets[0])
  }

  const partKeySet = new Set<string>()
  const groupedRowIdSet = new Set<string>()
  for (const target of contentTargets) {
    const selection = resolveSingle(target)
    if (selection === null) {
      continue
    }
    selection.partKeys.forEach((partKey: string) => partKeySet.add(partKey))
    if (selection.rootKind === 'object') {
      groupedRowIdSet.add(selection.rootRowId)
    }
    selection.groupedRowIds.forEach((rowId: string) => groupedRowIdSet.add(rowId))
  }
  return {
    rootRowId: 'multi-select',
    rootKind: 'multi-select' as const,
    partKeys: [...partKeySet],
    groupedRowIds: [...groupedRowIdSet],
  }
}

const click = async (element: Element) => {
  await clickWithModifiers(element, {})
}

const clickWithModifiers = async (
  element: Element,
  options: { ctrlKey?: boolean; shiftKey?: boolean },
) => {
  await act(async () => {
    element.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        ctrlKey: options.ctrlKey ?? false,
        shiftKey: options.shiftKey ?? false,
      }),
    )
    element.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        ctrlKey: options.ctrlKey ?? false,
        shiftKey: options.shiftKey ?? false,
      }),
    )
  })
}

const doubleClick = async (element: Element) => {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }))
  })
}

const contextMenu = async (element: Element, clientX = 160, clientY = 200) => {
  await act(async () => {
    element.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      }),
    )
  })
}

const createMockDataTransfer = () => ({
  pointerId: 1,
})

const ensureRowRect = (row: Element) => {
  if (Object.prototype.hasOwnProperty.call(row, 'getBoundingClientRect')) {
    return
  }
  const rowElements = Array.from(document.querySelectorAll('.BrowserTreeRow'))
  const rowIndex = Math.max(0, rowElements.indexOf(row as HTMLElement))
  const top = rowIndex * 36
  Object.defineProperty(row, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: 0,
      y: top,
      top,
      left: 0,
      right: 240,
      bottom: top + 32,
      width: 240,
      height: 32,
      toJSON: () => ({}),
    }),
  })
}

const mockRowRect = (
  row: Element,
  top: number,
  options: { left?: number; width?: number; height?: number } = {},
) => {
  const { height = 32, left = 0, width = 240 } = options
  Object.defineProperty(row, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: left,
      y: top,
      top,
      left,
      right: left + width,
      bottom: top + height,
      width,
      height,
      toJSON: () => ({}),
    }),
  })
}

const getRowMainElement = (row: Element) =>
  (row.querySelector('.BrowserTreeRowMain') as HTMLButtonElement | null) ?? (row as HTMLButtonElement)

const beginDragRow = async (source: Element, dataTransfer = createMockDataTransfer()) => {
  ensureRowRect(source)
  const sourceRect = (source as HTMLElement).getBoundingClientRect()
  const sourceMain = getRowMainElement(source)
  await act(async () => {
    sourceMain.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        pointerId: dataTransfer.pointerId,
        clientX: sourceRect.left + 16,
        clientY: sourceRect.top + 16,
      }),
    )
  })
  await act(async () => {
    await Promise.resolve()
  })
  await act(async () => {
    window.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        cancelable: true,
        pointerId: dataTransfer.pointerId,
        clientX: sourceRect.left + 24,
        clientY: sourceRect.top + 16,
      }),
    )
  })
  return dataTransfer
}

const dragOverRow = async (target: Element, dataTransfer: ReturnType<typeof createMockDataTransfer>, clientY = 24) => {
  ensureRowRect(target)
  const rect = (target as HTMLElement).getBoundingClientRect()
  await act(async () => {
    window.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        cancelable: true,
        pointerId: dataTransfer.pointerId,
        clientX: rect.left + rect.width / 2,
        clientY,
      }),
    )
  })
}

const dropRow = async (target: Element, dataTransfer: ReturnType<typeof createMockDataTransfer>, clientY = 24) => {
  ensureRowRect(target)
  const rect = (target as HTMLElement).getBoundingClientRect()
  await act(async () => {
    window.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        cancelable: true,
        pointerId: dataTransfer.pointerId,
        clientX: rect.left + rect.width / 2,
        clientY,
      }),
    )
  })
}

const endDragRow = async (_source: Element, dataTransfer = createMockDataTransfer()) => {
  await act(async () => {
    window.dispatchEvent(
      new PointerEvent('pointercancel', {
        bubbles: true,
        cancelable: true,
        pointerId: dataTransfer.pointerId,
      }),
    )
  })
}

const dragRow = async (source: Element, target: Element, clientY = 24) => {
  const dataTransfer = {
    ...createMockDataTransfer(),
  }
  await beginDragRow(source, dataTransfer)
  await dragOverRow(target, dataTransfer, clientY)
  await dropRow(target, dataTransfer, clientY)
  await endDragRow(source, dataTransfer)
}

const findButtonByLabel = (label: string) =>
  Array.from(document.querySelectorAll('button')).find(
    (element) => element.getAttribute('aria-label') === label || element.textContent?.trim() === label,
  ) ?? null

const findRowMainByLabel = (label: string) =>
  Array.from(document.querySelectorAll('.BrowserTreeRowMain')).find((element) =>
    element.textContent?.includes(label),
  ) ?? null

describe('BrowserPanel', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    viewerFrameSelectionSetMock.mockReset()
    importReferenceFileFromDiskMock = vi.fn()
    importReferenceFilesFromDiskMock = vi.fn()
    importSupportedReferenceFilesFromDiskMock = vi.fn()
    mockRequestBrowserGraphDocumentBuild = vi.fn()
    currentSpaghettiState = {
      graphDocumentsById: {
        'graph-document-1': graphDocument,
      },
      cachedGraphEntriesById: {
        'cached-graph-1': cachedGraphEntry,
      },
      cachedGraphEntryOrder: ['cached-graph-1'],
      editorViewportsById: {
        'editor-viewport-1': editorViewport,
      },
      editorViewportOrder: ['editor-viewport-1'],
      activeGraphDocumentId: 'graph-document-1',
      activeEditorViewportId: 'editor-viewport-1',
      graphRuntimeByDocumentId: {
        'graph-document-1': {
          outputSurface: null,
        },
      },
      createGraphDocument: vi.fn(() => 'graph-document-2'),
      duplicateActiveGraphDocument: vi.fn(() => 'graph-document-2'),
      loadGraphDocumentIntoNewGraphFromFile: vi.fn(async () => {}),
      saveCachedGraphEntryToFile: vi.fn(async () => {}),
      openGraphDocumentInViewport: vi.fn(() => 'editor-viewport-1'),
      openGraphDocumentInNewViewport: vi.fn(() => 'editor-viewport-1'),
      swapFocusedEditorViewportToGraphDocument: vi.fn(() => 'editor-viewport-1'),
      closeEditorViewport: vi.fn(),
      setActiveEditorViewportId: vi.fn(),
      setEditorViewportPosition: vi.fn(),
      setViewerTargetGraphDocumentId: vi.fn(),
      setSelectedNodeId: vi.fn(),
      requestEditorViewportNodeFit: vi.fn(),
      sharedViewerComposition: null,
      sharedViewerCompositionGraphDocumentIds: [],
    }

    currentAppState = {
      currentProject: {
        projectFileId: 'project-file-1',
        rootAssemblyId: 'assembly-root:project-file-1',
      },
      projectContent: null,
      projectContentRows: [],
      browserGraphBuildPolicyByGraphDocumentId: {},
      browserContentBuildPolicyByRowId: {},
      partsVisibility: {},
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      referenceWorkspace: referenceWorkspaceStateFromTree(emptyReferenceWorkspaceTree),
      sketchVisibilityByRowId: {},
      workspaceSelection: {
        selectedTarget: null,
        explicitSelectedTargets: [],
        selectionAnchorTarget: null,
        resolvedContentSelection: null,
        activeSurface: null,
      },
      consoleContextSyncRequest: null,
      setWorkspaceSelectedTarget: vi.fn((target) => {
        currentAppState = {
          ...currentAppState,
          workspaceSelection: {
            ...currentAppState.workspaceSelection,
            selectedTarget: target,
            explicitSelectedTargets: isMockExplicitSelectionTarget(target) ? [target] : [],
            selectionAnchorTarget: isMockExplicitSelectionTarget(target) ? target : null,
            resolvedContentSelection: null,
          },
        }
      }),
      setWorkspaceExplicitSelection: vi.fn((selection) => {
        currentAppState = {
          ...currentAppState,
          workspaceSelection: {
            ...currentAppState.workspaceSelection,
            selectedTarget: selection.selectedTarget,
            explicitSelectedTargets: selection.explicitSelectedTargets.filter(
              (target: any, index: number, targets: any[]) =>
                targets.findIndex(
                  (candidate: any) =>
                    getMockSelectionTargetKey(candidate) === getMockSelectionTargetKey(target),
                ) === index,
            ),
            selectionAnchorTarget: selection.selectionAnchorTarget,
            resolvedContentSelection: resolveMockContentSelection(selection.explicitSelectedTargets),
          },
        }
      }),
      setWorkspaceResolvedContentSelection: vi.fn((selection) => {
        currentAppState = {
          ...currentAppState,
          workspaceSelection: {
            ...currentAppState.workspaceSelection,
            resolvedContentSelection: selection,
          },
        }
      }),
      setActiveSurface: vi.fn((surface) => {
        currentAppState = {
          ...currentAppState,
          workspaceSelection: {
            ...currentAppState.workspaceSelection,
            activeSurface: surface,
          },
        }
      }),
      requestConsoleContextSync: vi.fn(),
      requestConsoleWorkspaceContextHandoff: vi.fn(),
      requestFloatingShellActivation: vi.fn(),
      buildPolicy: 'live',
      setBrowserGraphBuildPolicy: vi.fn((graphDocumentId: string, policy: string) => {
        currentAppState = {
          ...currentAppState,
          browserGraphBuildPolicyByGraphDocumentId: {
            ...currentAppState.browserGraphBuildPolicyByGraphDocumentId,
            [graphDocumentId]: policy,
          },
        }
      }),
      clearBrowserGraphBuildPolicy: vi.fn((graphDocumentId: string) => {
        const next = { ...currentAppState.browserGraphBuildPolicyByGraphDocumentId }
        delete next[graphDocumentId]
        currentAppState = {
          ...currentAppState,
          browserGraphBuildPolicyByGraphDocumentId: next,
        }
      }),
      cycleBrowserGraphBuildPolicy: vi.fn((graphDocumentId: string, basePolicy?: string) => {
        const currentPolicy =
          currentAppState.browserGraphBuildPolicyByGraphDocumentId[graphDocumentId] ?? basePolicy ?? 'live'
        const nextPolicy =
          currentPolicy === 'live'
            ? 'release'
            : currentPolicy === 'release'
              ? 'manual'
              : currentPolicy === 'manual'
                ? 'off'
                : 'live'
        currentAppState = {
          ...currentAppState,
          browserGraphBuildPolicyByGraphDocumentId: {
            ...currentAppState.browserGraphBuildPolicyByGraphDocumentId,
            [graphDocumentId]: nextPolicy,
          },
        }
      }),
      setBrowserContentBuildPolicy: vi.fn((rowId: string, policy: string) => {
        currentAppState = {
          ...currentAppState,
          browserContentBuildPolicyByRowId: {
            ...currentAppState.browserContentBuildPolicyByRowId,
            [rowId]: policy,
          },
        }
      }),
      clearBrowserContentBuildPolicy: vi.fn((rowId: string) => {
        const next = { ...currentAppState.browserContentBuildPolicyByRowId }
        delete next[rowId]
        currentAppState = {
          ...currentAppState,
          browserContentBuildPolicyByRowId: next,
        }
      }),
      cycleBrowserContentBuildPolicy: vi.fn((rowId: string, basePolicy?: string) => {
        const currentPolicy =
          currentAppState.browserContentBuildPolicyByRowId[rowId] ?? basePolicy ?? 'live'
        const nextPolicy =
          currentPolicy === 'live'
            ? 'release'
            : currentPolicy === 'release'
              ? 'manual'
              : currentPolicy === 'manual'
                ? 'off'
                : 'live'
        currentAppState = {
          ...currentAppState,
          browserContentBuildPolicyByRowId: {
            ...currentAppState.browserContentBuildPolicyByRowId,
            [rowId]: nextPolicy,
          },
        }
      }),
      requestGraphDocumentBuild: mockRequestBrowserGraphDocumentBuild,
      requestBrowserGraphDocumentBuild: mockRequestBrowserGraphDocumentBuild,
      setPartVisibility: vi.fn(),
      selectPart: vi.fn(),
      toggleReferenceWorkspaceExpanded: vi.fn(),
      toggleReferenceCategoryExpanded: vi.fn(),
      toggleReferenceItemVisibility: vi.fn(),
      setReferenceItemVisibility: vi.fn(),
      toggleReferenceCategoryVisibility: vi.fn(),
      toggleSketchVisibility: vi.fn(),
      openStagedImportDraft: vi.fn((draft: { parentAssemblyId?: string | null; parentComponentId?: string | null }) => {
        currentAppState = {
          ...currentAppState,
          referenceWorkspace: {
            ...currentAppState.referenceWorkspace,
            stagedImportDraft: {
              parentAssemblyId: draft.parentAssemblyId ?? null,
              parentComponentId: draft.parentComponentId ?? null,
              stagedFiles: [],
            },
          },
        }
      }),
      appendStagedImportDraftFiles: vi.fn(
        (files: Array<{ fileName: string; fileType: string; objectUrl: string }>) => {
          const currentDraft = currentAppState.referenceWorkspace.stagedImportDraft
          if (currentDraft === null) {
            return
          }
          currentAppState = {
            ...currentAppState,
            referenceWorkspace: {
              ...currentAppState.referenceWorkspace,
              stagedImportDraft: {
                ...currentDraft,
                stagedFiles: [
                  ...currentDraft.stagedFiles,
                  ...files.map((file, index) => ({
                    ...file,
                    stagedFileId: `staged-import-file:${currentDraft.stagedFiles.length + index + 1}`,
                  })),
                ],
              },
            },
          }
        },
      ),
      closeStagedImportDraft: vi.fn(() => {
        currentAppState = {
          ...currentAppState,
          referenceWorkspace: {
            ...currentAppState.referenceWorkspace,
            stagedImportDraft: null,
          },
        }
      }),
      addImportedReference: vi.fn(() => 'reference-import:1'),
      retryReferenceItemLoad: vi.fn(),
      startReferenceLoadBatchForAll: vi.fn(),
      startReferenceLoadBatchForCategory: vi.fn(),
      loadAllReferences: vi.fn(),
      loadReferenceCategory: vi.fn(),
      explodeImportedReference: vi.fn(() => true),
      removeImportedReference: vi.fn(),
      createProjectAssembly: vi.fn(() => 'assembly-authored-1'),
      createProjectComponent: vi.fn(() => 'component-authored-1'),
      moveProjectContentOwner: vi.fn(() => true),
      moveProjectContentOwnersBatch: vi.fn((draggedTargets: any[], dropTarget: any) => {
        if (draggedTargets.length === 0) {
          return false
        }
        const moved = draggedTargets.every((draggedTarget) =>
          currentAppState.moveProjectContentOwner(draggedTarget, dropTarget),
        )
        if (!moved) {
          return false
        }
        const selectedTarget = resolveMockWorkspaceSelectionTargetFromOwnerTarget(draggedTargets[0])
        const explicitSelectedTargets = draggedTargets.map(
          resolveMockWorkspaceSelectionTargetFromOwnerTarget,
        )
        currentAppState = {
          ...currentAppState,
          workspaceSelection: {
            ...currentAppState.workspaceSelection,
            selectedTarget,
            explicitSelectedTargets,
            selectionAnchorTarget: selectedTarget,
            resolvedContentSelection: resolveMockContentSelection(explicitSelectedTargets),
          },
        }
        return true
      }),
      renameProjectContentOwner: vi.fn(() => true),
      deleteProjectContentOwner: vi.fn(() => true),
      beginReferenceTransform: vi.fn(),
      beginReferenceTransformShell: vi.fn(),
    }
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
  })

  it('renames the section to Open Editors and renders the new shell-honesty note', async () => {
    ;({ container, root } = await renderBrowserPanel())

    expect(container?.textContent).toContain('Open Editors')
    expect(container?.textContent).toContain(
      'Tracks editor sessions. The workspace currently shows the active editor surface.',
    )
    expect(container?.textContent).not.toContain('Open Viewports')
    expect(findButtonByLabel('Open new editor')).not.toBeNull()
  })

  it('cycles the Browser header through essentials and collapsed modes', async () => {
    ;({ container, root } = await renderBrowserPanel())

    const browserToggle = findButtonByLabel('Toggle browser panel')
    expect(browserToggle).not.toBeNull()
    expect(findButtonByLabel('Create new graph')).not.toBeNull()
    expect(container?.textContent).toContain('Graph Documents')
    expect(container?.textContent).toContain('Open Editors')

    await click(browserToggle!)

    expect(findButtonByLabel('Create new graph')).not.toBeNull()
    expect(container?.textContent).toContain('Graph Documents')
    expect(container?.textContent).toContain('Open Editors')
    const graphDocumentsSection = Array.from(
      container?.querySelectorAll('.BrowserTreeSummaryLabel') ?? [],
    ).find((element) => element.textContent?.includes('Graph Documents'))?.closest(
      'details',
    ) as HTMLDetailsElement | null
    const openEditorsSection = Array.from(
      container?.querySelectorAll('.BrowserTreeSummaryLabel') ?? [],
    ).find((element) => element.textContent?.includes('Open Editors'))?.closest(
      'details',
    ) as HTMLDetailsElement | null

    expect(graphDocumentsSection?.open).toBe(false)
    expect(openEditorsSection?.open).toBe(false)

    await click(browserToggle!)

    expect(findButtonByLabel('Create new graph')).toBeNull()
    expect(container?.textContent).not.toContain('Graph Documents')
    expect(container?.textContent).not.toContain('Open Editors')

    await click(browserToggle!)

    expect(findButtonByLabel('Create new graph')).not.toBeNull()
    expect(container?.textContent).toContain('Graph Documents')
    expect(container?.textContent).toContain('Open Editors')
  })

  it('claims the browser as the active surface when the panel is clicked', async () => {
    ;({ container, root } = await renderBrowserPanel())

    const browserRoot = container?.querySelector('.BrowserPanelRoot') as HTMLElement | null
    expect(browserRoot).not.toBeNull()

    await act(async () => {
      browserRoot?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      )
    })

    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('browser')
  })

  it('does not render User References or its empty string when no imported references exist', async () => {
    currentAppState = {
      ...currentAppState,
      referenceWorkspaceTree: {
        ...emptyReferenceWorkspaceTree,
        categories: emptyReferenceWorkspaceTree.categories.slice(0, 3),
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ container, root } = await renderBrowserPanel())

    expect(container?.textContent).not.toContain('User References')
    expect(container?.textContent).not.toContain('No imported references yet.')
  })

  it('renders part rows through the slim content-row surface without the extra outer row box', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'reference-item-row:reference-import:1',
          kind: 'object',
          label: 'PubPad Full Assembly',
          meta: 'OBJ',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: null,
          parentAssemblyId: 'assembly-1',
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
          referenceId: 'reference-import:1',
          referenceSourceKind: 'imported',
          referenceCategoryId: 'footpads',
          referenceLoadState: 'loaded',
          fileType: 'obj',
          assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
          errorMessage: null,
          partRows: [
            {
              rowId: 'reference-part-row:reference-part:reference-import:1:0',
              partKey: 'reference-part:reference-import:1:0',
              label: 'XR_Footpad Base',
            },
          ],
        },
      ],
    }

    ;({ container } = await renderBrowserPanel())

    const partRowMain = findRowMainByLabel('XR_Footpad Base')
    expect(partRowMain).not.toBeNull()
    expect(partRowMain?.classList.contains('isPartRow')).toBe(true)
    expect(partRowMain?.querySelector('.BrowserContentStateBar--part')).not.toBeNull()
    expect(partRowMain?.querySelector('.BrowserGraphChildPlainBar')).toBeNull()
    expect(findButtonByLabel('Hide XR_Footpad Base')).not.toBeNull()
  })

  it('runs the graph document header icon actions from the summary row', async () => {
    ;({ container, root } = await renderBrowserPanel())

    const createButton = findButtonByLabel('Create new graph')
    const duplicateButton = findButtonByLabel('Duplicate focused graph')
    const loadButton = findButtonByLabel('Load graph into new graph')

    expect(createButton).not.toBeNull()
    expect(duplicateButton).not.toBeNull()
    expect(loadButton).not.toBeNull()

    await click(createButton!)
    expect(currentSpaghettiState.createGraphDocument).toHaveBeenCalledTimes(1)
    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-2')

    await click(duplicateButton!)
    expect(currentSpaghettiState.duplicateActiveGraphDocument).toHaveBeenCalledTimes(1)

    await click(loadButton!)
    expect(currentSpaghettiState.loadGraphDocumentIntoNewGraphFromFile).toHaveBeenCalledTimes(1)
  })

  it('opens the row menu from right click and runs graph actions through the shared menu surface', async () => {
    ;({ container, root } = await renderBrowserPanel())

    const graphRow = findRowMainByLabel('Graph 1')
    expect(graphRow).not.toBeNull()

    await contextMenu(graphRow!)

    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Graph 1')
    expect(findButtonByLabel('New Editor')).not.toBeNull()
    expect(findButtonByLabel('Export Graph')).not.toBeNull()

    await click(findButtonByLabel('New Editor')!)

    expect(currentSpaghettiState.openGraphDocumentInNewViewport).toHaveBeenCalledWith('graph-document-1')
    expect(document.querySelector('.BrowserTreeContextMenu')).toBeNull()
  })

  it('reveals a graph row by framing that graphs currently rendered parts in the viewer', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'reference-root',
          kind: 'assembly',
          label: 'References',
          meta: '1 item',
          parentAssemblyId: null,
          isVisible: true,
          visibilityPartKeys: [],
          referenceContainerKind: 'root',
          referenceCategoryId: null,
          referenceContainerItemCount: 1,
          referenceContainerEmptyLabel: null,
        },
        {
          rowId: 'reference-category-row:footpads',
          kind: 'component',
          label: 'Footpads',
          meta: '1 item',
          parentAssemblyId: 'reference-root',
          isVisible: true,
          visibilityPartKeys: [],
          ownerGraphDocumentId: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          componentSourceKind: 'receive-link',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
          referenceContainerKind: 'category',
          referenceCategoryId: 'footpads',
          referenceContainerItemCount: 1,
          referenceContainerEmptyLabel: 'No loadable references yet.',
        },
        {
          rowId: 'reference-item-row:footpad:pubpad-full-assembly',
          kind: 'object',
          label: 'PubPad Full Assembly',
          meta: 'OBJ',
          parentAssemblyId: 'reference-root',
          parentComponentId: 'reference-category-row:footpads',
          isVisible: true,
          visibilityPartKeys: [],
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
          contentOriginKind: 'source-reference',
          referenceId: 'footpad:pubpad-full-assembly',
          referenceSourceKind: 'manifest',
          referenceCategoryId: 'footpads',
          referenceLoadState: 'loaded',
          fileType: 'obj',
          assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
          errorMessage: null,
          partRows: [],
        },
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-a', 'graph-document-2:slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-root:project-file-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:s001:node-a',
          slotId: 'slot-a',
          sourceNodeId: 'node-a',
          resolutionState: 'resolved',
          highlightViewerKey: 'graph-document-1:slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['graph-document-2:slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-2',
          parentAssemblyId: 'assembly-root:project-file-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-2',
          sourceOutputEntryId: 'output-entry:s001:node-b',
          slotId: 'slot-b',
          sourceNodeId: 'node-b',
          resolutionState: 'resolved',
          highlightViewerKey: 'graph-document-2:slot-b',
          authoringGraphDocumentId: 'graph-document-2',
          authoringNodeId: 'node-b',
        },
      ],
    }

    ;({ container, root } = await renderBrowserPanel())

    const graphRow = findRowMainByLabel('Graph 1')
    expect(graphRow).not.toBeNull()

    await contextMenu(graphRow!)
    expect(findButtonByLabel('Reveal')).not.toBeNull()

    await click(findButtonByLabel('Reveal')!)

    expect(viewerFrameSelectionSetMock).toHaveBeenCalledWith(['graph-document-1:slot-a'], [])
    expect(document.querySelector('.BrowserTreeContextMenu')).toBeNull()
  })

  it('keeps graph rows document-oriented and shows the first build-policy chip on content rows', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: ['graph-document-1'],
        },
        {
          rowId: 'project-component:project-file-1:graph-document-1:published',
          kind: 'component',
          label: 'Pedal Component',
          meta: 'Graph 1',
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ container, root } = await renderBrowserPanel())

    const contentPolicyButton = findButtonByLabel('Cycle build policy for Content. Current policy Live')
    expect(contentPolicyButton).not.toBeNull()

    const graphPolicyButton = findButtonByLabel('Cycle build policy for Graph 1. Current policy Live')
    expect(graphPolicyButton).not.toBeNull()

    const policyButton = findButtonByLabel('Cycle build policy for Pedal Component. Current policy Live')
    expect(policyButton).not.toBeNull()
    expect(findButtonByLabel('Graph save options for Graph 1')).toBeNull()
    expect(policyButton?.textContent).toBe('C')
    expect(container?.querySelector('.BrowserGraphStateBar--rebuild')).not.toBeNull()
    expect(container?.querySelector('.BrowserContentStateBar--rebuild')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRow.isOpen')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRow.isActiveEditor')).not.toBeNull()
    expect(container?.textContent).not.toContain('Dirty')
    expect(container?.textContent).not.toContain('Saved')

    await click(policyButton!)
    await act(async () => {
      root!.render(<BrowserPanel />)
    })
    expect(currentAppState.cycleBrowserContentBuildPolicy).toHaveBeenCalledWith(
      'project-component:project-file-1:graph-document-1:published',
      'live',
    )
    expect(findButtonByLabel('Cycle build policy for Pedal Component. Current policy Release')).not.toBeNull()
    expect(findButtonByLabel('Cycle build policy for Graph 1. Current policy Live')).not.toBeNull()
    expect(findButtonByLabel('Cycle build policy for Content. Current policy Live')).not.toBeNull()

    await click(findButtonByLabel('Cycle build policy for Pedal Component. Current policy Release')!)
    await act(async () => {
      root!.render(<BrowserPanel />)
    })
    expect(findButtonByLabel('Cycle build policy for Pedal Component. Current policy Manual')).not.toBeNull()

    await click(findButtonByLabel('Cycle build policy for Pedal Component. Current policy Manual')!)
    await act(async () => {
      root!.render(<BrowserPanel />)
    })
    expect(findButtonByLabel('Cycle build policy for Pedal Component. Current policy Off')).not.toBeNull()

    const componentRow = findRowMainByLabel('Pedal Component')
    expect(componentRow?.getAttribute('aria-pressed')).toBe('false')
  })

  it('cycles the hidden root content policy from the inline Content header button', async () => {
    ;({ root } = await renderBrowserPanel())

    const contentPolicyButton = findButtonByLabel('Cycle build policy for Content. Current policy Live')
    expect(contentPolicyButton).not.toBeNull()
    expect(contentPolicyButton?.textContent).toBe('C')

    await click(contentPolicyButton!)
    await act(async () => {
      root!.render(<BrowserPanel />)
    })

    expect(currentAppState.cycleBrowserContentBuildPolicy).toHaveBeenCalledWith(
      'assembly-root:project-file-1',
      'live',
    )
    expect(findButtonByLabel('Cycle build policy for Content. Current policy Release')).not.toBeNull()

    await click(findButtonByLabel('Cycle build policy for Content. Current policy Release')!)
    await act(async () => {
      root!.render(<BrowserPanel />)
    })

    expect(findButtonByLabel('Cycle build policy for Content. Current policy Manual')).not.toBeNull()
  })

  it('shows effective inherited policy and only creates a self override through the row menu', async () => {
    currentAppState = {
      ...currentAppState,
      browserGraphBuildPolicyByGraphDocumentId: {
        'graph-document-1': 'manual',
      },
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'project-component:project-file-1:graph-document-1:published',
          kind: 'component',
          label: 'Pedal Component',
          meta: 'Graph 1',
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ container, root } = await renderBrowserPanel())

    const policyButton = findButtonByLabel(
      'Inherited build policy for Pedal Component. Current policy Manual. Right-click for independence options',
    )
    expect(policyButton).not.toBeNull()
    expect(policyButton?.getAttribute('title')).toContain('Build policy: Manual (from Graph 1)')
    expect(policyButton?.getAttribute('title')).toContain('Right-click to manage independence.')

    await click(policyButton!)
    await act(async () => {
      root!.render(<BrowserPanel />)
    })

    expect(currentAppState.cycleBrowserContentBuildPolicy).not.toHaveBeenCalled()
    expect(findButtonByLabel(
      'Inherited build policy for Pedal Component. Current policy Manual. Right-click for independence options',
    )).not.toBeNull()

    await contextMenu(policyButton!)

    expect(findButtonByLabel('Make Independent')).not.toBeNull()

    await click(findButtonByLabel('Make Independent')!)

    expect(currentAppState.setBrowserContentBuildPolicy).toHaveBeenCalledWith(
      'project-component:project-file-1:graph-document-1:published',
      'manual',
    )
    await act(async () => {
      root!.render(<BrowserPanel />)
    })
    const independentPolicyButton = findButtonByLabel(
      'Cycle build policy for Pedal Component. Current policy Manual',
    )
    expect(independentPolicyButton).not.toBeNull()
    expect(independentPolicyButton?.className).toContain('BrowserTreeRowIcon--independent')

    await contextMenu(independentPolicyButton!)

    expect(findButtonByLabel('Return To Parent')).not.toBeNull()

    await click(findButtonByLabel('Return To Parent')!)

    expect(currentAppState.clearBrowserContentBuildPolicy).toHaveBeenCalledWith(
      'project-component:project-file-1:graph-document-1:published',
    )
    await act(async () => {
      root!.render(<BrowserPanel />)
    })
    expect(findButtonByLabel(
      'Inherited build policy for Pedal Component. Current policy Manual. Right-click for independence options',
    )).not.toBeNull()
  })

  it('keeps the right-click path available for the same row menu', async () => {
    ;({ root } = await renderBrowserPanel())

    const rowMain = findRowMainByLabel('Graph 1')
    expect(rowMain).not.toBeNull()

    await contextMenu(rowMain!)

    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Graph 1')
    expect(findButtonByLabel('Export Graph')).not.toBeNull()
    expect(findButtonByLabel('Swap Editor')).not.toBeNull()
  })

  it('exports through the row menu and no longer renders the legacy graph save button', async () => {
    ;({ root } = await renderBrowserPanel())

    const graphRow = findRowMainByLabel('Graph 1')
    expect(graphRow).not.toBeNull()
    expect(findButtonByLabel('Graph save options for Graph 1')).toBeNull()

    await contextMenu(graphRow!)

    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Graph 1')
    expect(findButtonByLabel('Export Graph')).not.toBeNull()

    await click(findButtonByLabel('Export Graph')!)

    expect(currentSpaghettiState.saveCachedGraphEntryToFile).toHaveBeenCalledWith('cached-graph-1')
    expect(document.querySelector('.BrowserTreeContextMenu')).toBeNull()
  })

  it('shows building state without rendering a legacy graph save button', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      cachedGraphEntriesById: {
        'cached-graph-1': {
          ...cachedGraphEntry,
          isDirty: false,
        },
      },
      graphRuntimeByDocumentId: {
        'graph-document-1': {
          outputSurface: null,
          compileBuild: {
            inFlightBuildSeq: 7,
          },
        },
      },
    }

    ;({ container, root } = await renderBrowserPanel())

    expect(findButtonByLabel('Graph save options for Graph 1')).toBeNull()
    expect(container?.querySelector('.BrowserGraphStateBar--building')).not.toBeNull()
    expect(container?.textContent).not.toContain('Dirty')
    expect(container?.textContent).not.toContain('Saved')
  })

  it('shows done when the accepted build matches the current graph revision even if save state is unsaved', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      graphRuntimeByDocumentId: {
        'graph-document-1': {
          outputSurface: null,
          compileBuild: {
            currentGraphRevision: 4,
            latestAcceptedGraphRevision: 4,
            inFlightBuildSeq: null,
          },
        },
      },
    }

    ;({ container, root } = await renderBrowserPanel())

    expect(container?.querySelector('.BrowserGraphStateBar--done')).not.toBeNull()
    expect(findButtonByLabel('Graph save options for Graph 1')).toBeNull()
  })

  it('clicking a graph row selects it without swapping the focused editor', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      graphDocumentsById: {
        'graph-document-1': graphDocument,
        'graph-document-2': secondGraphDocument,
      },
      cachedGraphEntriesById: {
        'cached-graph-1': cachedGraphEntry,
        'cached-graph-2': {
          cachedGraphId: 'cached-graph-2',
          graphDocumentId: 'graph-document-2',
          source: 'in-memory' as const,
          isDirty: true,
        },
      },
      cachedGraphEntryOrder: ['cached-graph-1', 'cached-graph-2'],
      graphRuntimeByDocumentId: {
        'graph-document-1': {
          outputSurface: null,
        },
        'graph-document-2': {
          outputSurface: null,
        },
      },
    }
    currentSpaghettiState.swapFocusedEditorViewportToGraphDocument = vi.fn((graphDocumentId: string) => {
      currentSpaghettiState = {
        ...currentSpaghettiState,
        activeGraphDocumentId: graphDocumentId,
        activeEditorViewportId: 'editor-viewport-1',
        editorViewportsById: {
          ...currentSpaghettiState.editorViewportsById,
          'editor-viewport-1': {
            ...currentSpaghettiState.editorViewportsById['editor-viewport-1'],
            graphDocumentId,
            isFocused: true,
          },
        },
      }
      return 'editor-viewport-1'
    })

    ;({ container, root } = await renderBrowserPanel())

    const graphTwoRow = findRowMainByLabel('Graph 2')
    expect(graphTwoRow).not.toBeNull()

    await click(graphTwoRow!)

    expect(currentSpaghettiState.swapFocusedEditorViewportToGraphDocument).not.toHaveBeenCalled()
    expect(currentSpaghettiState.openGraphDocumentInViewport).not.toHaveBeenCalled()
    expect(graphTwoRow?.getAttribute('aria-pressed')).toBe('true')

    const graphTwoShell = graphTwoRow?.closest('.BrowserTreeRow')
    expect(graphTwoShell?.classList.contains('isOpen')).toBe(false)
    expect(graphTwoShell?.classList.contains('isActiveEditor')).toBe(false)
    expect(container?.querySelectorAll('.BrowserTreeRow.isOpen')).toHaveLength(1)
  })

  it('opens a new editor from the Open Editors section for the active graph at the provided spawn anchor', async () => {
    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    const newEditorButton = findButtonByLabel('Open new editor')
    expect(newEditorButton).not.toBeNull()

    await click(newEditorButton!)

    expect(currentSpaghettiState.openGraphDocumentInNewViewport).toHaveBeenCalledWith(
      'graph-document-1',
    )
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith('editor-viewport-1', {
      x: 405,
      y: 16,
    })
  })

  it('single-clicking a graph row selects it without opening an editor', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    const graphRow = findRowMainByLabel('Graph 1')
    expect(graphRow).not.toBeNull()

    await click(graphRow!)

    expect(currentSpaghettiState.openGraphDocumentInViewport).not.toHaveBeenCalled()
    expect(currentSpaghettiState.openGraphDocumentInNewViewport).not.toHaveBeenCalled()
    expect(graphRow?.getAttribute('aria-pressed')).toBe('true')
  })

  it('double-clicking a graph row opens a new editor at the provided spawn anchor', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
      openGraphDocumentInNewViewport: vi.fn(() => 'editor-viewport-2'),
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    const graphRow = findRowMainByLabel('Graph 1')
    expect(graphRow).not.toBeNull()

    await doubleClick(graphRow!)

    expect(currentSpaghettiState.openGraphDocumentInNewViewport).toHaveBeenCalledWith(
      'graph-document-1',
    )
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith('editor-viewport-2', {
      x: 405,
      y: 16,
    })
  })

  it('clicking an open editor row focuses that editor and close remains in the row menu', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      graphDocumentsById: {
        'graph-document-1': graphDocument,
        'graph-document-2': secondGraphDocument,
      },
      editorViewportsById: {
        'editor-viewport-1': {
          ...editorViewport,
          editorViewportId: 'editor-viewport-1',
          graphDocumentId: 'graph-document-1',
          isFocused: true,
          zOrder: 60,
        },
        'editor-viewport-2': {
          ...editorViewport,
          editorViewportId: 'editor-viewport-2',
          graphDocumentId: 'graph-document-2',
          isFocused: false,
          zOrder: 21,
        },
      },
      editorViewportOrder: ['editor-viewport-1', 'editor-viewport-2'],
      activeGraphDocumentId: 'graph-document-1',
      activeEditorViewportId: 'editor-viewport-1',
    }
    currentSpaghettiState.setActiveEditorViewportId = vi.fn((editorViewportId: string) => {
      currentSpaghettiState = {
        ...currentSpaghettiState,
        activeEditorViewportId: editorViewportId,
        activeGraphDocumentId:
          currentSpaghettiState.editorViewportsById[editorViewportId]?.graphDocumentId ??
          currentSpaghettiState.activeGraphDocumentId,
        editorViewportsById: Object.fromEntries(
          Object.entries(currentSpaghettiState.editorViewportsById).map(([viewportId, viewport]: [string, any]) => [
            viewportId,
            {
              ...viewport,
              isFocused: viewportId === editorViewportId,
            },
          ]),
        ),
      }
    })

    ;({ container, root } = await renderBrowserPanel())

    const graphTwoEditorRow = findRowMainByLabel('Graph 2')
    expect(graphTwoEditorRow).not.toBeNull()

    await click(graphTwoEditorRow!)

    expect(currentSpaghettiState.setActiveEditorViewportId).toHaveBeenCalledWith('editor-viewport-2')
    expect(graphTwoEditorRow?.getAttribute('aria-pressed')).toBe('true')

    const graphTwoEditorShell = graphTwoEditorRow?.closest('.BrowserTreeRow')
    expect(graphTwoEditorShell?.classList.contains('isActiveEditor')).toBe(true)
    expect(container?.querySelector('[aria-label=\"Close Graph 2\"]')).toBeNull()

    await contextMenu(graphTwoEditorRow!)
    expect(findButtonByLabel('Close')).not.toBeNull()
    await click(findButtonByLabel('Close')!)

    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-2')
  })

  it('single-clicking a component row selects it as a content subtree target when shared composition is inactive', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const componentRow = findRowMainByLabel('Pedal Component')
    expect(componentRow).not.toBeNull()

    await click(componentRow!)

    expect(currentAppState.requestGraphDocumentBuild).not.toHaveBeenCalled()
    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'component',
        componentId: 'project-component:project-file-1:graph-document-1:published',
      },
      explicitSelectedTargets: [
        {
          kind: 'component',
          componentId: 'project-component:project-file-1:graph-document-1:published',
        },
      ],
      selectionAnchorTarget: {
        kind: 'component',
        componentId: 'project-component:project-file-1:graph-document-1:published',
      },
    })
    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'browser',
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: {
        kind: 'component',
        componentId: 'project-component:project-file-1:graph-document-1:published',
      },
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
    expect(currentAppState.selectPart).toHaveBeenCalledWith(null)
    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('browser')
    expect(currentSpaghettiState.swapFocusedEditorViewportToGraphDocument).not.toHaveBeenCalled()
    expect(componentRow?.getAttribute('aria-pressed')).toBe('true')
  })

  it('lets the content assembly row collapse and hide descendant content rows', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ container, root } = await renderBrowserPanel())

    expect(findRowMainByLabel('Pedal Component')).not.toBeNull()
    expect(findRowMainByLabel('Pedal Body')).not.toBeNull()

    await click(findButtonByLabel('Collapse Assembly 1 children')!)

    expect(findRowMainByLabel('Pedal Component')).toBeNull()
    expect(findRowMainByLabel('Pedal Body')).toBeNull()
    expect(container?.textContent).toContain('Assembly 1')
  })

  it('lets a component row collapse and hide its object children', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ container, root } = await renderBrowserPanel())

    expect(findRowMainByLabel('Pedal Body')).not.toBeNull()

    await click(findButtonByLabel('Collapse Pedal Component children')!)

    expect(findRowMainByLabel('Pedal Body')).toBeNull()
    expect(findRowMainByLabel('Pedal Component')).not.toBeNull()
    expect(container?.textContent).toContain('Assembly 1')
  })

  it('renders simple tree-guide cells for nested content rows', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          kind: 'object',
          label: 'Pedal Body',
          meta: '',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ container, root } = await renderBrowserPanel())

    const guideCells = container?.querySelectorAll('.BrowserTreeRowGuide') ?? []
    expect(guideCells.length).toBeGreaterThanOrEqual(3)
    expect(container?.querySelector('.BrowserTreeRowGuide--tee')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRowGuide--elbow')).not.toBeNull()
  })

  it('renders content row state through fill-bar classes without inline status text', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'unresolved',
          highlightViewerKey: null,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ container, root } = await renderBrowserPanel())

    expect(container?.querySelector('.BrowserContentStateBar--done')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRowStatus')).toBeNull()
    expect(container?.querySelector('.BrowserContentStateText')).toBeNull()
    expect(findRowMainByLabel('Pedal Component')?.textContent).toContain('Graph 1')
  })

  it('single-clicking a component row keeps selection light while shared composition suppresses highlight selection', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      sharedViewerComposition: {
        compositionId: 'shared-1',
        graphDocumentIds: ['graph-document-1'],
      },
      sharedViewerCompositionGraphDocumentIds: ['graph-document-1'],
    }
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const componentRow = findRowMainByLabel('Pedal Component')
    expect(componentRow).not.toBeNull()

    await click(componentRow!)

    expect(currentAppState.requestGraphDocumentBuild).not.toHaveBeenCalled()
    expect(currentAppState.selectPart).toHaveBeenCalledWith(null)
    expect(componentRow?.getAttribute('aria-pressed')).toBe('true')
  })

  it('double-clicking a component row opens the source graph and focuses the source node', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
      openGraphDocumentInViewport: vi.fn(() => 'editor-viewport-2'),
    }
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    const componentRow = findRowMainByLabel('Pedal Component')
    expect(componentRow).not.toBeNull()

    await doubleClick(componentRow!)

    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith('editor-viewport-2', {
      x: 405,
      y: 16,
    })
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-baseplate-1')
    expect(currentAppState.setWorkspaceSelectedTarget).toHaveBeenCalledWith({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'node-baseplate-1',
    })
    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('spaghetti')
  })

  it('shows View In Graph as a secondary action for content rows', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
      openGraphDocumentInViewport: vi.fn(() => 'editor-viewport-2'),
    }
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    const componentRow = findRowMainByLabel('Pedal Component')
    expect(componentRow).not.toBeNull()

    await contextMenu(componentRow!)
    expect(findButtonByLabel('View In Graph')).not.toBeNull()

    await click(findButtonByLabel('View In Graph')!)
    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-baseplate-1')
    expect(currentAppState.setWorkspaceSelectedTarget).toHaveBeenCalledWith({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'node-baseplate-1',
    })
    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('spaghetti')
  })

  it('double-clicking a component row without a source node opens the source graph only', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
      openGraphDocumentInViewport: vi.fn(() => 'editor-viewport-2'),
    }
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'project-component:project-file-1:receive:graph-document-1:receive-1',
          kind: 'component',
          label: 'slot-missing',
          meta: 'Graph 1 unresolved',
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-2',
          sourceOutputEntryId: 'output-entry:slot-missing:node-missing-1',
          componentSourceKind: 'receive-link',
          resolutionState: 'unresolved',
          receiveId: 'receive-1',
          childObjectCount: 0,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: 'graph-document-2',
          authoringNodeId: null,
        },
      ],
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    const componentRow = findRowMainByLabel('slot-missing')
    expect(componentRow).not.toBeNull()

    await doubleClick(componentRow!)

    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-2')
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith(null)
    expect(currentAppState.setWorkspaceSelectedTarget).toHaveBeenCalledWith({
      kind: 'graph-document',
      graphDocumentId: 'graph-document-2',
    })
    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('spaghetti')
  })

  it('single-clicking an object row selects it and highlights the viewport target when shared composition is inactive', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          kind: 'object',
          label: 'Pedal Body',
          meta: 'Graph 1',
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const objectRow = findRowMainByLabel('Pedal Body')
    expect(objectRow).not.toBeNull()

    await click(objectRow!)

    expect(currentAppState.requestGraphDocumentBuild).not.toHaveBeenCalled()
    expect(currentAppState.selectPart).toHaveBeenCalledWith('slot-baseplate')
    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:pedal-body',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:pedal-body',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:pedal-body',
      },
    })
    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'browser',
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:pedal-body',
      },
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('browser')
    expect(currentSpaghettiState.swapFocusedEditorViewportToGraphDocument).not.toHaveBeenCalled()
    expect(objectRow?.getAttribute('aria-pressed')).toBe('true')
  })

  it('clicking the non-interactive gutter of an object row still selects the object instead of leaving the parent assembly selected', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
          parentAssemblyId: 'assembly-root:project-file-1',
          visibilityPartKeys: ['graph-document-1:slot-a'],
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
        },
      ],
      workspaceSelection: {
        selectedTarget: {
          kind: 'assembly',
          assemblyId: 'assembly-root:project-file-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'assembly',
            assemblyId: 'assembly-root:project-file-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'assembly',
          assemblyId: 'assembly-root:project-file-1',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
    }

    ;({ root } = await renderBrowserPanel())

    const objectRow = findRowMainByLabel('Object 1')
    const objectRowShell = objectRow?.closest('.BrowserTreeRow') as HTMLDivElement | null
    expect(objectRowShell).not.toBeNull()

    await click(objectRowShell!)

    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'object',
        objectId: 'object-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'object-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'object-1',
      },
    })
  })

  it('ctrl-click adds a second content row into the explicit browser selection set', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
          visibilityPartKeys: ['graph-document-1:slot-a'],
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
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: 'Graph 1',
          visibilityPartKeys: ['graph-document-1:slot-b'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
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
      workspaceSelection: {
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
    }

    ;({ root } = await renderBrowserPanel())

    await clickWithModifiers(findRowMainByLabel('Object 2')!, { ctrlKey: true })

    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'object',
        objectId: 'object-2',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'object-1',
        },
        {
          kind: 'object',
          objectId: 'object-2',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'object-2',
      },
    })
  })

  it('shift-click builds a same-section range from the current anchor', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
          visibilityPartKeys: ['graph-document-1:slot-a'],
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
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: 'Graph 1',
          visibilityPartKeys: ['graph-document-1:slot-b'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
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
      workspaceSelection: {
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
    }

    ;({ root } = await renderBrowserPanel())

    await clickWithModifiers(findRowMainByLabel('Object 2')!, { shiftKey: true })

    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'object',
        objectId: 'object-2',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'object-1',
        },
        {
          kind: 'object',
          objectId: 'object-2',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'object-1',
      },
    })
  })

  it('clears stale local row selection when the viewer becomes the active surface with no selected target', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          kind: 'object',
          label: 'Pedal Body',
          meta: 'Graph 1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const objectRow = findRowMainByLabel('Pedal Body')
    expect(objectRow).not.toBeNull()

    await click(objectRow!)
    expect(objectRow?.getAttribute('aria-pressed')).toBe('true')

    currentAppState = {
      ...currentAppState,
      workspaceSelection: {
        selectedTarget: null,
        activeSurface: 'viewer',
      },
    }

    await act(async () => {
      root!.render(<BrowserPanel />)
    })

    expect(findRowMainByLabel('Pedal Body')?.getAttribute('aria-pressed')).toBe('false')
  })

  it('clears browser selection when the user clicks empty browser space', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          kind: 'object',
          label: 'Pedal Body',
          meta: 'Graph 1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ container } = await renderBrowserPanel())

    const objectRow = findRowMainByLabel('Pedal Body')
    expect(objectRow).not.toBeNull()

    await click(objectRow!)
    expect(objectRow?.getAttribute('aria-pressed')).toBe('true')

    const browserBody = container?.querySelector('.BrowserPanelBody') as HTMLElement | null
    expect(browserBody).not.toBeNull()

    await click(browserBody!)

    expect(currentAppState.setWorkspaceSelectedTarget).toHaveBeenCalledWith(null)
    expect(currentAppState.selectPart).toHaveBeenCalledWith(null)
    expect(findRowMainByLabel('Pedal Body')?.getAttribute('aria-pressed')).toBe('false')
  })

  it('stores one root target plus a grouped resolved content selection for parent rows', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          visibilityPartKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
        },
        {
          rowId: 'project-component:project-file-1:graph-document-1:component-1',
          kind: 'component',
          label: 'Pedal Component',
          meta: '2 Objects',
          visibilityPartKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:object-1',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
          visibilityPartKeys: ['graph-document-1:slot-a'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-a',
          slotId: 'slot-a',
          sourceNodeId: 'node-a',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-a',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:object-2',
          kind: 'object',
          label: 'Object 2',
          meta: 'Graph 1',
          visibilityPartKeys: ['graph-document-1:slot-b'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-b',
          slotId: 'slot-b',
          sourceNodeId: 'node-b',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-b',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-b',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const assemblyRow = findRowMainByLabel('Assembly 1')
    expect(assemblyRow).not.toBeNull()

    await click(assemblyRow!)

    expect(currentAppState.workspaceSelection.selectedTarget).toEqual({
      kind: 'assembly',
      assemblyId: 'assembly-root:project-file-1',
    })
    expect(currentAppState.workspaceSelection.resolvedContentSelection).toEqual({
      rootRowId: 'assembly-root:project-file-1',
      rootKind: 'assembly',
      partKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
      groupedRowIds: [
        'project-component:project-file-1:graph-document-1:component-1',
        'project-object:project-file-1:graph-document-1:object-1',
        'project-object:project-file-1:graph-document-1:object-2',
      ],
    })
    expect(assemblyRow?.closest('.BrowserTreeRow')?.classList.contains('isSelected')).toBe(true)
    expect(findRowMainByLabel('Object 1')?.closest('.BrowserTreeRow')?.classList.contains('isGroupedSelected')).toBe(
      true,
    )
    expect(findRowMainByLabel('Object 2')?.closest('.BrowserTreeRow')?.classList.contains('isGroupedSelected')).toBe(
      true,
    )
  })

  it('double-clicking an object row frames it in the model viewport instead of opening the source graph', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
      openGraphDocumentInViewport: vi.fn(() => 'editor-viewport-2'),
    }
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          kind: 'object',
          label: 'Pedal Body',
          meta: 'Graph 1',
          visibilityPartKeys: ['slot-baseplate'],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'project-component:project-file-1:graph-document-1:published',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    const objectRow = findRowMainByLabel('Pedal Body')
    expect(objectRow).not.toBeNull()

    await doubleClick(objectRow!)

    expect(viewerFrameSelectionSetMock).toHaveBeenCalledWith(['slot-baseplate'], [])
    expect(currentSpaghettiState.openGraphDocumentInViewport).not.toHaveBeenCalled()
    expect(currentSpaghettiState.setEditorViewportPosition).not.toHaveBeenCalled()
    expect(currentSpaghettiState.setSelectedNodeId).not.toHaveBeenCalled()
  })

  it('shows Needs Rebuild and Nodes under graph documents and remembers section expand state per graph', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
      openGraphDocumentInViewport: vi.fn(() => 'editor-viewport-2'),
      graphDocumentsById: {
        'graph-document-1': {
          ...graphDocument,
          graph: {
            ...graphDocument.graph,
            nodes: [
              {
                nodeId: 'node-baseplate-1',
                type: 'Part/Cube',
                params: {},
              },
              {
                nodeId: 'node-output-1',
                type: 'System/OutputPreview',
                params: {},
              },
            ],
          },
        },
      },
    }
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          sourceOutputEntryId: 'output-entry:s001:node-baseplate-1',
          slotId: 's001',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 's001',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    await click(findButtonByLabel('Expand Graph 1 child sections')!)

    expect(findRowMainByLabel('Needs Rebuild')).not.toBeNull()
    expect(findRowMainByLabel('Nodes')).not.toBeNull()
    expect(findRowMainByLabel('Object A')).not.toBeNull()
    expect(findRowMainByLabel('Cube')).toBeNull()

    const rebuildObjectRow = Array.from(document.querySelectorAll('.BrowserTreeRowMain')).filter(
      (element) => element.textContent?.includes('Object A'),
    ).at(-1)
    expect(rebuildObjectRow).not.toBeNull()

    await click(rebuildObjectRow!)
    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-baseplate-1')
    expect(currentSpaghettiState.requestEditorViewportNodeFit).not.toHaveBeenCalled()
    expect(currentAppState.selectPart).not.toHaveBeenCalled()

    const nodesToggle =
      findButtonByLabel('Expand Nodes') ?? findButtonByLabel('Collapse Nodes')
    expect(nodesToggle).not.toBeNull()
    if (nodesToggle?.getAttribute('aria-label') === 'Expand Nodes') {
      await click(nodesToggle)
    }
    expect(findRowMainByLabel('Cube')).not.toBeNull()

    await click(findButtonByLabel('Collapse Graph 1 child sections')!)
    await click(findButtonByLabel('Expand Graph 1 child sections')!)
    expect(findRowMainByLabel('Cube')).not.toBeNull()

    const outputPreviewRow = Array.from(document.querySelectorAll('.BrowserTreeRowMain')).find(
      (element) => element.textContent?.includes('OutputPreview'),
    )
    expect(outputPreviewRow).not.toBeNull()

    await click(outputPreviewRow!)
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-output-1')
    expect(currentSpaghettiState.requestEditorViewportNodeFit).toHaveBeenCalledWith(
      'editor-viewport-2',
      'node-output-1',
    )
  })

  it('reflects a shared graph-node target into browser row selection and expansion', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      graphDocumentsById: {
        'graph-document-1': {
          ...graphDocument,
          graph: {
            ...graphDocument.graph,
            nodes: [
              {
                nodeId: 'node-sketch-1',
                type: 'Geometry/Sketch',
                params: {},
              },
            ],
          },
        },
      },
    }
    currentAppState = {
      ...currentAppState,
      workspaceSelection: {
        selectedTarget: {
          kind: 'graph-node',
          graphDocumentId: 'graph-document-1',
          nodeId: 'node-sketch-1',
        },
        activeSurface: 'spaghetti',
      },
    }

    ;({ container, root } = await renderBrowserPanel())

    expect(findRowMainByLabel('Graph 1')).not.toBeNull()
    expect(findRowMainByLabel('Sketch')).not.toBeNull()

    const selectedSketchRow = Array.from(
      container!.querySelectorAll('.BrowserTreeRow.BrowserTreeRow--graph-node'),
    ).find((element) => element.textContent?.includes('Sketch'))

    expect(selectedSketchRow).not.toBeNull()
    expect(selectedSketchRow?.classList.contains('isSelected')).toBe(true)
  })

  it('reflects shared reference and object targets into browser row selection', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
        },
        {
          rowId: 'project-object:project-file-1:graph-document-1:pedal-body',
          kind: 'object',
          label: 'Pedal Body',
          meta: 'Graph 1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-baseplate',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-baseplate-1',
        },
      ],
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
      workspaceSelection: {
        selectedTarget: {
          kind: 'reference-item',
          referenceId: 'footpad:pubpad-full-assembly',
        },
        activeSurface: 'browser',
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ container, root } = await renderBrowserPanel())

    const selectedReferenceRow = findRowMainByLabel('PubPad Full Assembly')?.closest('.BrowserTreeRow')
    const footpadsRow = findRowMainByLabel('Footpads')?.closest('.BrowserTreeRow')
    const referencesRow = findRowMainByLabel('References')?.closest('.BrowserTreeRow')
    expect(selectedReferenceRow?.classList.contains('isSelected')).toBe(true)
    expect(footpadsRow?.classList.contains('isGroupedSelected')).toBe(false)
    expect(referencesRow?.classList.contains('isGroupedSelected')).toBe(false)

    currentAppState = {
      ...currentAppState,
      workspaceSelection: {
        selectedTarget: {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:pedal-body',
        },
        activeSurface: 'browser',
      },
    }

    await act(async () => {
      root!.render(<BrowserPanel />)
    })

    const selectedObjectRow = Array.from(
      container!.querySelectorAll('.BrowserTreeRow.BrowserTreeRow--object'),
    ).find((element) => element.textContent?.includes('Pedal Body'))
    expect(selectedObjectRow?.classList.contains('isSelected')).toBe(true)
  })

  it('projects grouped highlight downward when a reference parent row is selected', async () => {
    currentAppState = {
      ...currentAppState,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
      workspaceSelection: {
        selectedTarget: null,
        activeSurface: 'browser',
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ container } = await renderBrowserPanel())

    await click(findRowMainByLabel('Footpads')!)

    const selectedCategoryRow = findRowMainByLabel('Footpads')?.closest('.BrowserTreeRow')
    const groupedItemRow = findRowMainByLabel('PubPad Full Assembly')?.closest('.BrowserTreeRow')
    expect(selectedCategoryRow?.classList.contains('isSelected')).toBe(true)
    expect(groupedItemRow?.classList.contains('isGroupedSelected')).toBe(true)
    expect(findRowMainByLabel('References')?.closest('.BrowserTreeRow')?.classList.contains('isGroupedSelected')).toBe(
      false,
    )
  })

  it('clicking reference parents selects them and groups their children downward', async () => {
    currentAppState = {
      ...currentAppState,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
      workspaceSelection: {
        selectedTarget: {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:pedal-body',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ container } = await renderBrowserPanel())

    await click(findRowMainByLabel('References')!)
    expect(findRowMainByLabel('References')?.closest('.BrowserTreeRow')?.classList.contains('isSelected')).toBe(
      true,
    )
    expect(findRowMainByLabel('Footpads')?.closest('.BrowserTreeRow')?.classList.contains('isGroupedSelected')).toBe(
      true,
    )
    expect(
      findRowMainByLabel('PubPad Full Assembly')
        ?.closest('.BrowserTreeRow')
        ?.classList.contains('isGroupedSelected'),
    ).toBe(true)

    await click(findRowMainByLabel('Footpads')!)
    expect(findRowMainByLabel('Footpads')?.closest('.BrowserTreeRow')?.classList.contains('isSelected')).toBe(
      true,
    )
    expect(
      findRowMainByLabel('PubPad Full Assembly')
        ?.closest('.BrowserTreeRow')
        ?.classList.contains('isGroupedSelected'),
    ).toBe(true)
  })

  it('adds Load All to the References row menu and routes it through the shared action', async () => {
    currentAppState = {
      ...currentAppState,
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
            visibleItemCount: 0,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: false,
                loadState: 'unloaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ container, root } = await renderBrowserPanel())

    await contextMenu(findRowMainByLabel('References')!)
    expect(findButtonByLabel('Load All')).not.toBeNull()

    await click(findButtonByLabel('Load All')!)
    expect(currentAppState.startReferenceLoadBatchForAll).toHaveBeenCalled()
  })

  it('adds Load All to a reference category row menu and routes it through the shared category action', async () => {
    currentAppState = {
      ...currentAppState,
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
            visibleItemCount: 0,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: false,
                loadState: 'unloaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ root } = await renderBrowserPanel())

    await contextMenu(findRowMainByLabel('Footpads')!)
    expect(findButtonByLabel('Load All')).not.toBeNull()

    await click(findButtonByLabel('Load All')!)
    expect(currentAppState.startReferenceLoadBatchForCategory).toHaveBeenCalledWith('footpads')
  })

  it('renders References inside Content and keeps category toggle separate from +/- expansion', async () => {
    currentAppState = {
      ...currentAppState,
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
            visibleItemCount: 0,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: false,
                loadState: 'unloaded',
                errorMessage: null,
              },
            ],
          },
          {
            rowId: 'reference-category-row:shoes',
            categoryId: 'shoes',
            label: 'Shoes',
            isExpanded: false,
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
                assetPath: '/ReferenceModels/shoes/Shoe_1.glb',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
          emptyReferenceWorkspaceTree.categories[2],
          emptyReferenceWorkspaceTree.categories[3],
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ container, root } = await renderBrowserPanel())

    expect(container?.textContent).toContain('References')
    expect(container?.textContent).not.toContain('No loadable references yet.')
    expect(findRowMainByLabel('Footpads')).not.toBeNull()
    expect(findRowMainByLabel('PubPad Full Assembly')).not.toBeNull()
    expect(findRowMainByLabel('Shoes')).not.toBeNull()
    expect(findRowMainByLabel('Shoe 1')).toBeNull()
    const footpadsVisibilityButton =
      findButtonByLabel('Hide Footpads') ?? findButtonByLabel('Show Footpads')
    const pubPadVisibilityButton =
      findButtonByLabel('Hide PubPad Full Assembly') ??
      findButtonByLabel('Show PubPad Full Assembly')

    expect(footpadsVisibilityButton).not.toBeNull()
    expect(pubPadVisibilityButton).not.toBeNull()

    await click(footpadsVisibilityButton!)
    expect(currentAppState.toggleReferenceCategoryVisibility).toHaveBeenCalledWith('footpads')

    await click(findButtonByLabel('Expand Shoes children')!)
    expect(currentAppState.toggleReferenceCategoryExpanded).toHaveBeenCalledWith('shoes')

    await click(findRowMainByLabel('PubPad Full Assembly')!)
    expect(currentAppState.toggleReferenceItemVisibility).not.toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
    )
    expect(currentAppState.setReferenceItemVisibility).not.toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
      true,
    )
    expect(currentAppState.beginReferenceTransform).not.toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
    )
    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:footpad:pubpad-full-assembly',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'reference-item-row:footpad:pubpad-full-assembly',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'reference-item-row:footpad:pubpad-full-assembly',
      },
    })
    expect(currentAppState.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'browser',
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:footpad:pubpad-full-assembly',
      },
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
    expect(currentAppState.setActiveSurface).toHaveBeenCalledWith('browser')
  })

  it('reference category expansion belongs to the branch control instead of row click', async () => {
    currentAppState = {
      ...currentAppState,
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          {
            rowId: 'reference-category-row:footpads',
            categoryId: 'footpads',
            label: 'Footpads',
            isExpanded: false,
            itemCount: 1,
            visibleItemCount: 0,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: false,
                loadState: 'unloaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ root } = await renderBrowserPanel())

    const footpadsRow = findRowMainByLabel('Footpads')
    expect(footpadsRow).not.toBeNull()

    await click(footpadsRow!)

    expect(currentAppState.toggleReferenceCategoryExpanded).not.toHaveBeenCalled()
    expect(currentAppState.toggleReferenceCategoryVisibility).not.toHaveBeenCalledWith('footpads')
    expect(currentAppState.toggleReferenceItemVisibility).not.toHaveBeenCalled()
    expect(currentAppState.setReferenceItemVisibility).not.toHaveBeenCalled()

    await click(findButtonByLabel('Expand Footpads children')!)

    expect(currentAppState.toggleReferenceCategoryExpanded).toHaveBeenCalledWith('footpads')
  })

  it('opens the staged Import Files dialog from the Content import menu and closes without changing project content', async () => {
    ;({ root } = await renderBrowserPanel())

    const importButton = findButtonByLabel('Import reference file')
    expect(importButton).not.toBeNull()

    await click(importButton!)
    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Import Reference')
    expect(
      Array.from(document.querySelectorAll('.BrowserTreeContextMenu button')).map((element) =>
        element.textContent?.trim(),
      ),
    ).toMatchObject(['Import Files...', 'Import .step', 'Import .stl', 'Import .obj', 'Import .glb'])

    await click(findButtonByLabel('Import Files...')!)

    expect(currentAppState.openStagedImportDraft).toHaveBeenCalledWith({
      parentAssemblyId: null,
      parentComponentId: null,
    })
    expect(currentAppState.addImportedReference).not.toHaveBeenCalled()
    expect(importReferenceFileFromDiskMock).not.toHaveBeenCalled()
    expect(importReferenceFilesFromDiskMock).not.toHaveBeenCalled()
    expect(importSupportedReferenceFilesFromDiskMock).not.toHaveBeenCalled()
    expect(document.querySelector('.BrowserTreeContextMenu')).toBeNull()
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Import Files')

    await click(findButtonByLabel('Cancel')!)
    await act(async () => {
      root!.render(<BrowserPanel />)
    })

    expect(currentAppState.closeStagedImportDraft).toHaveBeenCalled()
    expect(currentAppState.referenceWorkspace.stagedImportDraft).toBeNull()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(currentAppState.addImportedReference).not.toHaveBeenCalled()
  })

  it('shows supported staged import types and stages files through the dialog Browser intake without changing project content', async () => {
    importSupportedReferenceFilesFromDiskMock.mockResolvedValue([
      {
        fileName: 'shoe.step',
        fileType: 'step',
        objectUrl: 'blob:shoe-step',
      },
      {
        fileName: 'shoe.glb',
        fileType: 'glb',
        objectUrl: 'blob:shoe-glb',
      },
    ])

    ;({ root } = await renderBrowserPanel())

    await click(findButtonByLabel('Import reference file')!)
    await click(findButtonByLabel('Import Files...')!)

    const importDialog = document.querySelector('[role="dialog"]')
    expect(importDialog?.textContent).toContain('.step')
    expect(importDialog?.textContent).toContain('.stl')
    expect(importDialog?.textContent).toContain('.obj')
    expect(importDialog?.textContent).toContain('.glb')
    expect(importDialog?.textContent).toContain('0 files staged in draft')
    expect(importDialog?.textContent).toContain('No files staged yet.')
    expect(document.querySelectorAll('.BrowserImportDialogStagedRow')).toHaveLength(0)

    await click(findButtonByLabel('Browser')!)
    await act(async () => {
      await Promise.resolve()
    })
    await act(async () => {
      root!.render(<BrowserPanel />)
    })

    expect(importSupportedReferenceFilesFromDiskMock).toHaveBeenCalledTimes(1)
    expect(currentAppState.appendStagedImportDraftFiles).toHaveBeenCalledWith([
      {
        fileName: 'shoe.step',
        fileType: 'step',
        objectUrl: 'blob:shoe-step',
      },
      {
        fileName: 'shoe.glb',
        fileType: 'glb',
        objectUrl: 'blob:shoe-glb',
      },
    ])
    expect(currentAppState.referenceWorkspace.stagedImportDraft?.stagedFiles).toHaveLength(2)
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('2 files staged in draft')
    expect(
      Array.from(document.querySelectorAll('.BrowserImportDialogStagedRowName')).map((element) =>
        element.textContent?.trim(),
      ),
    ).toEqual(['shoe.step', 'shoe.glb'])
    expect(
      Array.from(document.querySelectorAll('.BrowserImportDialogStagedRowType')).map((element) =>
        element.textContent?.trim(),
      ),
    ).toEqual(['.STEP', '.GLB'])
    expect(currentAppState.addImportedReference).not.toHaveBeenCalled()
  })

  it('appends repeated staged Browser intake into the visible review list in stable order', async () => {
    importSupportedReferenceFilesFromDiskMock
      .mockResolvedValueOnce([
        {
          fileName: 'alpha.step',
          fileType: 'step',
          objectUrl: 'blob:alpha-step',
        },
      ])
      .mockResolvedValueOnce([
        {
          fileName: 'beta.obj',
          fileType: 'obj',
          objectUrl: 'blob:beta-obj',
        },
        {
          fileName: 'gamma.glb',
          fileType: 'glb',
          objectUrl: 'blob:gamma-glb',
        },
      ])

    ;({ root } = await renderBrowserPanel())

    await click(findButtonByLabel('Import reference file')!)
    await click(findButtonByLabel('Import Files...')!)

    await click(findButtonByLabel('Browser')!)
    await act(async () => {
      await Promise.resolve()
    })
    await click(findButtonByLabel('Browser')!)
    await act(async () => {
      await Promise.resolve()
    })
    await act(async () => {
      root!.render(<BrowserPanel />)
    })

    expect(importSupportedReferenceFilesFromDiskMock).toHaveBeenCalledTimes(2)
    expect(
      Array.from(document.querySelectorAll('.BrowserImportDialogStagedRowName')).map((element) =>
        element.textContent?.trim(),
      ),
    ).toEqual(['alpha.step', 'beta.obj', 'gamma.glb'])
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('3 files staged in draft')
    expect(currentAppState.addImportedReference).not.toHaveBeenCalled()
  })

  it('opens the Content import menu from the header + button and still imports a single accepted file type into the working hierarchy from the direct compatibility rows', async () => {
    importReferenceFileFromDiskMock.mockResolvedValue({
      fileName: 'shoe.glb',
      fileType: 'glb',
      objectUrl: 'blob:shoe-1',
    })

    ;({ root } = await renderBrowserPanel())

    const importButton = findButtonByLabel('Import reference file')
    expect(importButton).not.toBeNull()

    await click(importButton!)
    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Import Reference')
    expect(findButtonByLabel('Import Files...')).not.toBeNull()
    expect(findButtonByLabel('Import .step')).not.toBeNull()
    expect(findButtonByLabel('Import .glb')).not.toBeNull()

    await click(findButtonByLabel('Import .glb')!)

    expect(importReferenceFileFromDiskMock).toHaveBeenCalledWith('glb')
    expect(currentAppState.addImportedReference).toHaveBeenCalledWith({
      fileName: 'shoe.glb',
      fileType: 'glb',
      objectUrl: 'blob:shoe-1',
      parentAssemblyId: null,
      parentComponentId: null,
    })
    expect(document.querySelector('.BrowserTreeContextMenu')).toBeNull()
  })

  it('imports a batch of obj files into the working hierarchy from one menu action', async () => {
    importReferenceFilesFromDiskMock.mockResolvedValue([
      {
        fileName: 'shoe-1.obj',
        fileType: 'obj',
        objectUrl: 'blob:shoe-1',
      },
      {
        fileName: 'shoe-2.obj',
        fileType: 'obj',
        objectUrl: 'blob:shoe-2',
      },
    ])

    ;({ root } = await renderBrowserPanel())

    const importButton = findButtonByLabel('Import reference file')
    expect(importButton).not.toBeNull()

    await click(importButton!)
    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Import Reference')

    await click(findButtonByLabel('Import .obj')!)

    expect(importReferenceFilesFromDiskMock).toHaveBeenCalledWith('obj')
    expect(importReferenceFileFromDiskMock).not.toHaveBeenCalledWith('obj')
    expect(currentAppState.addImportedReference).toHaveBeenCalledTimes(2)
    expect(currentAppState.addImportedReference).toHaveBeenNthCalledWith(1, {
      fileName: 'shoe-1.obj',
      fileType: 'obj',
      objectUrl: 'blob:shoe-1',
      parentAssemblyId: null,
      parentComponentId: null,
    })
    expect(currentAppState.addImportedReference).toHaveBeenNthCalledWith(2, {
      fileName: 'shoe-2.obj',
      fileType: 'obj',
      objectUrl: 'blob:shoe-2',
      parentAssemblyId: null,
      parentComponentId: null,
    })
    expect(document.querySelector('.BrowserTreeContextMenu')).toBeNull()
  })

  it('shows Transform Object on reference item right-click and starts reference transform mode', async () => {
    currentAppState = {
      ...currentAppState,
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
            visibleItemCount: 0,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: false,
                loadState: 'unloaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ root } = await renderBrowserPanel())

    const referenceRow = findRowMainByLabel('PubPad Full Assembly')
    expect(referenceRow).not.toBeNull()

    await contextMenu(referenceRow!)

    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe(
      'PubPad Full Assembly',
    )
    await click(findButtonByLabel('Transform Object')!)

    expect(currentAppState.beginReferenceTransformShell).toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
    )
  })

  it('shows Explode on imported parent object right-click and routes it through the explode seam', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'authored',
            childRowIds: ['reference-item-row:reference-import:1'],
          },
        },
        componentsById: {},
        objectsById: {},
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
      ],
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          ...emptyReferenceWorkspaceTree.categories.slice(0, 3),
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
                parts: [
                  {
                    rowId: 'part-row:reference-import:1:sole',
                    partKey: 'reference-import:1:sole',
                    label: 'Sole',
                    sourceMeshIndex: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ root } = await renderBrowserPanel())

    const importedObjectRow = findRowMainByLabel('shoe.glb')
    expect(importedObjectRow).not.toBeNull()

    await contextMenu(importedObjectRow!)

    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('shoe.glb')
    await click(findButtonByLabel('Explode')!)

    expect(currentAppState.explodeImportedReference).toHaveBeenCalledWith('reference-import:1')
  })

  it('treats exploded imported children like ordinary object rows for selection and double-click frame', async () => {
    currentAppState = buildExplodedImportedChildrenScenario()

    ;({ root } = await renderBrowserPanel())

    const explodedRow = findRowMainByLabel('Sole')
    expect(explodedRow).not.toBeNull()

    await click(explodedRow!)

    expect(currentAppState.selectPart).toHaveBeenCalledWith(null)
    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:reference-import:child-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'reference-item-row:reference-import:child-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'reference-item-row:reference-import:child-1',
      },
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
    expect(explodedRow?.getAttribute('aria-pressed')).toBe('true')

    viewerFrameSelectionSetMock.mockReset()
    await doubleClick(explodedRow!)

    expect(viewerFrameSelectionSetMock).toHaveBeenCalledWith([], ['reference-import:child-1'])
  })

  it('applies exploded imported child hide across the eligible browser multi-selection', async () => {
    currentAppState = buildExplodedImportedChildrenScenario({
      selectedReferenceIds: ['reference-import:child-1'],
    })

    ;({ root } = await renderBrowserPanel())

    await clickWithModifiers(findRowMainByLabel('Upper')!, { ctrlKey: true })
    await click(findButtonByLabel('Hide Sole')!)

    expect(currentAppState.setReferenceItemVisibility).toHaveBeenNthCalledWith(
      1,
      'reference-import:child-1',
      false,
    )
    expect(currentAppState.setReferenceItemVisibility).toHaveBeenNthCalledWith(
      2,
      'reference-import:child-2',
      false,
    )
  })

  it('removes exploded imported children through the ordinary row-menu remove seam', async () => {
    currentAppState = buildExplodedImportedChildrenScenario()

    ;({ root } = await renderBrowserPanel())

    await contextMenu(findRowMainByLabel('Sole')!)
    await click(findButtonByLabel('Remove')!)

    expect(currentAppState.removeImportedReference).toHaveBeenCalledWith('reference-import:child-1')
  })

  it('keeps exploded imported children draggable through the imported-reference owner-target seam', async () => {
    currentAppState = buildExplodedImportedChildrenScenario({
      includeSecondAssembly: true,
      selectedReferenceIds: ['reference-import:child-1'],
    })

    ;({ root } = await renderBrowserPanel())

    const sourceRow = findRowMainByLabel('Sole')?.closest('.BrowserTreeRow')
    const targetRow = findRowMainByLabel('Assembly 2')?.closest('.BrowserTreeRow')
    expect(sourceRow).not.toBeNull()
    expect(targetRow).not.toBeNull()

    mockRowRect(sourceRow!, 0)
    mockRowRect(targetRow!, 48)

    await dragRow(sourceRow!, targetRow!, 64)

    expect(currentAppState.moveProjectContentOwner).toHaveBeenCalledWith(
      { kind: 'imported-reference', referenceId: 'reference-import:child-1' },
      { kind: 'assembly', assemblyId: 'assembly-2', position: 'into' },
    )
  })

  it('moves imported reference retry and remove actions into the row menu', async () => {
    currentAppState = {
      ...currentAppState,
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          ...emptyReferenceWorkspaceTree.categories.slice(0, 3),
          {
            rowId: 'reference-category-row:user-references',
            categoryId: 'user-references',
            label: 'User References',
            isExpanded: true,
            itemCount: 1,
            visibleItemCount: 0,
            hasLoadingItem: false,
            hasErrorItem: true,
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
                isVisible: false,
                loadState: 'error',
                errorMessage: 'Load failed',
              },
            ],
          },
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ container, root } = await renderBrowserPanel())

    expect(container?.textContent ?? '').not.toContain('User References')

    expect(findButtonByLabel('More options for shoe.glb')).toBeNull()
    expect(findButtonByLabel('Retry shoe.glb')).toBeNull()
    expect(findButtonByLabel('Remove shoe.glb')).toBeNull()

    await contextMenu(findRowMainByLabel('shoe.glb')!)
    expect(findButtonByLabel('Retry')).not.toBeNull()
    expect(findButtonByLabel('Remove')).not.toBeNull()

    await click(findButtonByLabel('Retry')!)
    expect(currentAppState.retryReferenceItemLoad).toHaveBeenCalledWith('reference-import:1')

    await contextMenu(findRowMainByLabel('shoe.glb')!)
    await click(findButtonByLabel('Remove')!)
    expect(currentAppState.removeImportedReference).toHaveBeenCalledWith('reference-import:1')
  })

  it('uses grouped remove from the row menu when the clicked imported reference belongs to a deletable multi-select', async () => {
    currentAppState = {
      ...currentAppState,
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          ...emptyReferenceWorkspaceTree.categories.slice(0, 3),
          {
            rowId: 'reference-category-row:user-references',
            categoryId: 'user-references',
            label: 'User References',
            isExpanded: true,
            itemCount: 2,
            visibleItemCount: 2,
            hasLoadingItem: false,
            hasErrorItem: false,
            emptyLabel: 'No imported references yet.',
            items: [
              {
                rowId: 'reference-item-row:reference-import:1',
                referenceId: 'reference-import:1',
                sourceKind: 'imported',
                label: 'shoe-a.glb',
                categoryId: 'user-references',
                fileType: 'glb',
                assetPath: 'blob:shoe-a',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
              {
                rowId: 'reference-item-row:reference-import:2',
                referenceId: 'reference-import:2',
                sourceKind: 'imported',
                label: 'shoe-b.glb',
                categoryId: 'user-references',
                fileType: 'glb',
                assetPath: 'blob:shoe-b',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
        ],
      },
      workspaceSelection: {
        ...currentAppState.workspaceSelection,
        selectedTarget: {
          kind: 'object',
          objectId: 'reference-item-row:reference-import:1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'reference-item-row:reference-import:1',
          },
          {
            kind: 'object',
            objectId: 'reference-item-row:reference-import:2',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'reference-item-row:reference-import:1',
        },
        resolvedContentSelection: {
          rootRowId: 'multi-select',
          rootKind: 'multi-select',
          partKeys: [],
          groupedRowIds: [
            'reference-item-row:reference-import:1',
            'reference-item-row:reference-import:2',
          ],
        },
        activeSurface: 'browser',
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ root } = await renderBrowserPanel())

    await contextMenu(findRowMainByLabel('shoe-a.glb')!)
    await click(findButtonByLabel('Remove')!)

    expect(currentAppState.removeImportedReference).toHaveBeenNthCalledWith(1, 'reference-import:1')
    expect(currentAppState.removeImportedReference).toHaveBeenNthCalledWith(2, 'reference-import:2')
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
  })

  it('uses grouped Hide from the row menu when the clicked object belongs to a visible browser multi-select', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-a'],
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
          highlightViewerKey: 'graph-document-1:slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-1',
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: 'Graph 1',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-2',
          slotId: 'slot-b',
          sourceNodeId: 'node-2',
          resolutionState: 'resolved',
          highlightViewerKey: 'graph-document-1:slot-b',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-2',
        },
      ],
      workspaceSelection: {
        ...currentAppState.workspaceSelection,
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
    }

    ;({ root } = await renderBrowserPanel())

    await clickWithModifiers(findRowMainByLabel('Object 2')!, { ctrlKey: true })
    await contextMenu(findRowMainByLabel('Object 1')!)
    await click(findButtonByLabel('Hide')!)

    expect(currentAppState.setPartVisibility).toHaveBeenNthCalledWith(1, 'graph-document-1:slot-a', false)
    expect(currentAppState.setPartVisibility).toHaveBeenNthCalledWith(2, 'graph-document-1:slot-b', false)
  })

  it('uses grouped Hide from the row menu when the clicked imported reference row belongs to a visible browser multi-select', async () => {
    currentAppState = {
      ...currentAppState,
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          ...emptyReferenceWorkspaceTree.categories.slice(0, 3),
          {
            rowId: 'reference-category-row:user-references',
            categoryId: 'user-references',
            label: 'User References',
            isExpanded: true,
            itemCount: 2,
            visibleItemCount: 2,
            hasLoadingItem: false,
            hasErrorItem: false,
            emptyLabel: 'No imported references yet.',
            items: [
              {
                rowId: 'reference-item-row:shoe-1',
                referenceId: 'shoe-1',
                sourceKind: 'imported',
                label: 'shoe-a.glb',
                categoryId: 'user-references',
                fileType: 'glb',
                assetPath: 'blob:shoe-a',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
              {
                rowId: 'reference-item-row:shoe-2',
                referenceId: 'shoe-2',
                sourceKind: 'imported',
                label: 'shoe-b.glb',
                categoryId: 'user-references',
                fileType: 'glb',
                assetPath: 'blob:shoe-b',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
        ],
      },
      workspaceSelection: {
        ...currentAppState.workspaceSelection,
        selectedTarget: {
          kind: 'object',
          objectId: 'reference-item-row:shoe-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'reference-item-row:shoe-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'reference-item-row:shoe-1',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ root } = await renderBrowserPanel())

    await clickWithModifiers(findRowMainByLabel('shoe-b.glb')!, { ctrlKey: true })
    await contextMenu(findRowMainByLabel('shoe-a.glb')!)
    await click(findButtonByLabel('Hide')!)

    expect(currentAppState.setReferenceItemVisibility).toHaveBeenNthCalledWith(1, 'shoe-1', false)
    expect(currentAppState.setReferenceItemVisibility).toHaveBeenNthCalledWith(2, 'shoe-2', false)
  })

  it('applies a selected imported reference row hide eye across the eligible browser multi-selection', async () => {
    currentAppState = {
      ...currentAppState,
      referenceWorkspaceTree: {
        rowId: 'reference-root',
        label: 'References',
        isExpanded: true,
        categories: [
          ...emptyReferenceWorkspaceTree.categories.slice(0, 3),
          {
            rowId: 'reference-category-row:user-references',
            categoryId: 'user-references',
            label: 'User References',
            isExpanded: true,
            itemCount: 2,
            visibleItemCount: 2,
            hasLoadingItem: false,
            hasErrorItem: false,
            emptyLabel: 'No imported references yet.',
            items: [
              {
                rowId: 'reference-item-row:shoe-1',
                referenceId: 'shoe-1',
                sourceKind: 'imported',
                label: 'shoe-a.glb',
                categoryId: 'user-references',
                fileType: 'glb',
                assetPath: 'blob:shoe-a',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
              {
                rowId: 'reference-item-row:shoe-2',
                referenceId: 'shoe-2',
                sourceKind: 'imported',
                label: 'shoe-b.glb',
                categoryId: 'user-references',
                fileType: 'glb',
                assetPath: 'blob:shoe-b',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
        ],
      },
      workspaceSelection: {
        ...currentAppState.workspaceSelection,
        selectedTarget: {
          kind: 'object',
          objectId: 'reference-item-row:shoe-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'reference-item-row:shoe-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'reference-item-row:shoe-1',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ root } = await renderBrowserPanel())

    await clickWithModifiers(findRowMainByLabel('shoe-b.glb')!, { ctrlKey: true })
    await click(findButtonByLabel('Hide shoe-a.glb')!)

    expect(currentAppState.setReferenceItemVisibility).toHaveBeenNthCalledWith(1, 'shoe-1', false)
    expect(currentAppState.setReferenceItemVisibility).toHaveBeenNthCalledWith(2, 'shoe-2', false)
  })

  it('renders active reference bars darker for loaded rows and dormant bars lighter for unloaded rows', async () => {
    currentAppState = {
      ...currentAppState,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
            ],
          },
          {
            rowId: 'reference-category-row:shoes',
            categoryId: 'shoes',
            label: 'Shoes',
            isExpanded: true,
            itemCount: 1,
            visibleItemCount: 0,
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
                assetPath: '/ReferenceModels/shoes/Shoe_1.glb',
                isVisible: false,
                loadState: 'unloaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(2),
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ container } = await renderBrowserPanel())

    expect(
      findRowMainByLabel('PubPad Full Assembly')?.querySelector('.BrowserContentStateBar--imported-active'),
    ).not.toBeNull()
    expect(
      findRowMainByLabel('Shoe 1')?.querySelector('.BrowserContentStateBar--imported-dormant'),
    ).not.toBeNull()
  })

  it('renders determinate aggregate progress for loading reference root and category rows', async () => {
    currentAppState = {
      ...currentAppState,
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
            itemCount: 2,
            visibleItemCount: 2,
            hasLoadingItem: true,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: true,
                loadState: 'loaded',
                errorMessage: null,
              },
              {
                rowId: 'reference-item-row:footpad:pubpad-2',
                referenceId: 'footpad:pubpad-2',
                sourceKind: 'manifest',
                label: 'PubPad 2',
                categoryId: 'footpads',
                fileType: 'obj',
                assetPath: '/ReferenceModels/footpads/PubPad_2.obj',
                isVisible: true,
                loadState: 'loading',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
    }
    currentAppState.referenceWorkspace = {
      ...referenceWorkspaceStateFromTree(currentAppState.referenceWorkspaceTree),
      referenceLoadBatch: {
        requestId: 'reference-load-batch:1',
        source: 'root-load-all',
        scopeLabel: 'References',
        targetIds: ['footpad:pubpad-full-assembly', 'footpad:pubpad-2'],
        remainingIds: [],
        activeReferenceId: 'footpad:pubpad-2',
        completedIds: ['footpad:pubpad-full-assembly'],
        failedIds: [],
        startedAt: 1,
      },
    }

    ;({ container } = await renderBrowserPanel())

    const rootFill = findRowMainByLabel('References')
      ?.querySelector('.BrowserContentStateFill') as HTMLSpanElement | null
    const categoryFill = findRowMainByLabel('Footpads')
      ?.querySelector('.BrowserContentStateFill') as HTMLSpanElement | null

    expect(
      findRowMainByLabel('References')?.querySelector('.BrowserContentStateBar--reference-container-loading'),
    ).not.toBeNull()
    expect(
      findRowMainByLabel('Footpads')?.querySelector('.BrowserContentStateBar--reference-container-loading'),
    ).not.toBeNull()
    expect(rootFill?.classList.contains('BrowserContentStateFill--determinate')).toBe(true)
    expect(categoryFill?.classList.contains('BrowserContentStateFill--determinate')).toBe(true)
    expect(rootFill?.style.width).toBe('50%')
    expect(categoryFill?.style.width).toBe('50%')
  })

  it('adds Load Model to hidden reference rows and loads without starting transform', async () => {
    currentAppState = {
      ...currentAppState,
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
            visibleItemCount: 0,
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
                assetPath: '/ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
                isVisible: false,
                loadState: 'unloaded',
                errorMessage: null,
              },
            ],
          },
          ...emptyReferenceWorkspaceTree.categories.slice(1),
        ],
      },
    }
    currentAppState.referenceWorkspace = referenceWorkspaceStateFromTree(
      currentAppState.referenceWorkspaceTree,
    )

    ;({ root } = await renderBrowserPanel())

    await contextMenu(findRowMainByLabel('PubPad Full Assembly')!)
    expect(findButtonByLabel('Load Model')).not.toBeNull()

    await click(findButtonByLabel('Load Model')!)
    expect(currentAppState.retryReferenceItemLoad).toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
    )
    expect(currentAppState.beginReferenceTransform).not.toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
    )
  })

  it('does not render inline overflow buttons for browser rows', async () => {
    ;({ root } = await renderBrowserPanel())

    expect(
      Array.from(document.querySelectorAll('button')).some((element) =>
        (element.getAttribute('aria-label') ?? '').startsWith('More options for '),
      ),
    ).toBe(false)
  })

  it('focuses authored sketch content rows back into their graph node authoring surface', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      graphDocumentsById: {
        'graph-document-1': {
          ...graphDocument,
          graph: {
            ...graphDocument.graph,
            nodes: [
              {
                nodeId: 'node-sketch-1',
                type: 'Geometry/Sketch',
                params: {
                  sketch: {
                    featureId: 'sketch-1',
                  },
                },
              },
            ],
          },
        },
      },
    }
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          meta: 'Graph 1 | XY | 1 comp | 0 profiles',
          isVisible: false,
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          statusLabel: 'Draft',
          statusTone: 'quiet',
          ownerGraphDocumentId: 'graph-document-1',
          graphDocumentId: 'graph-document-1',
          nodeId: 'node-sketch-1',
          featureId: 'sketch-1',
          plane: 'XY',
          componentCount: 1,
          profileCount: 0,
          diagnosticsCount: 0,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-sketch-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const sketchesRootRow = findRowMainByLabel('Sketches')
    expect(sketchesRootRow).not.toBeNull()
    expect(sketchesRootRow?.classList.contains('isSketchesRootRow')).toBe(true)
    expect(sketchesRootRow?.classList.contains('isContentRow')).toBe(false)

    const sketchRow = findRowMainByLabel('Sketch 1')
    expect(sketchRow).not.toBeNull()

    await click(sketchRow!)

    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-sketch-1')
    expect(currentSpaghettiState.requestEditorViewportNodeFit).toHaveBeenCalledWith(
      'editor-viewport-1',
      'node-sketch-1',
    )
    expect(currentAppState.setWorkspaceSelectedTarget).toHaveBeenCalledWith({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'node-sketch-1',
    })
  })

  it('shows a sketch visibility eye and toggles browser sketch visibility from the eyeball', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
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
          meta: 'Graph 1 | XY | 1 comp | 0 profiles',
          isVisible: false,
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          statusLabel: 'Ready',
          statusTone: 'ready',
          ownerGraphDocumentId: 'graph-document-1',
          graphDocumentId: 'graph-document-1',
          nodeId: 'node-sketch-1',
          featureId: 'sketch-1',
          plane: 'XY',
          componentCount: 1,
          profileCount: 0,
          diagnosticsCount: 0,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-sketch-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const visibilityButton = findButtonByLabel('Show Sketch 1')
    expect(visibilityButton).not.toBeNull()

    await click(visibilityButton!)

    expect(currentAppState.toggleSketchVisibility).toHaveBeenCalledWith(
      'project-sketch:graph-document-1:node-sketch-1:sketch-1',
    )
  })

  it('shows content visibility eyes for assembly, component, and object rows', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'reference-root',
          kind: 'assembly',
          label: 'References',
          meta: '0 items',
          parentAssemblyId: null,
          isVisible: false,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: '',
          rebuildGraphDocumentIds: [],
          statusLabel: '',
          statusTone: 'quiet',
          referenceContainerKind: 'root',
          referenceCategoryId: null,
          referenceContainerItemCount: 0,
          referenceContainerEmptyLabel: null,
        },
        {
          rowId: 'reference-category-row:shoes',
          kind: 'component',
          label: 'Shoes',
          meta: '0 items',
          parentAssemblyId: 'reference-root',
          isVisible: false,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: '',
          rebuildGraphDocumentIds: [],
          statusLabel: '',
          statusTone: 'quiet',
          ownerGraphDocumentId: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          componentSourceKind: 'receive-link',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 0,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
          referenceContainerKind: 'category',
          referenceCategoryId: 'shoes',
          referenceContainerItemCount: 0,
          referenceContainerEmptyLabel: 'No loadable references yet.',
        },
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'component-1',
          kind: 'component',
          label: 'Component 1',
          meta: 'Graph 1',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-1',
          componentSourceKind: 'published-component',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 2,
          slotId: null,
          sourceNodeId: 'node-output-1',
          highlightViewerKey: null,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-output-1',
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-1',
          slotId: 'slot-a',
          sourceNodeId: 'node-output-1',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-output-1',
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    expect(findButtonByLabel('Hide Assembly 1')).not.toBeNull()
    expect(findButtonByLabel('Hide Component 1')).not.toBeNull()
    expect(findButtonByLabel('Hide Object 1')).not.toBeNull()
  })

  it('applies a selected object row hide eye across the eligible browser multi-selection', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-a'],
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
          highlightViewerKey: 'graph-document-1:slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-1',
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: 'Graph 1',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-2',
          slotId: 'slot-b',
          sourceNodeId: 'node-2',
          resolutionState: 'resolved',
          highlightViewerKey: 'graph-document-1:slot-b',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-2',
        },
      ],
      workspaceSelection: {
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
    }

    ;({ root } = await renderBrowserPanel())

    await clickWithModifiers(findRowMainByLabel('Object 2')!, { ctrlKey: true })
    await click(findButtonByLabel('Hide Object 1')!)

    expect(currentAppState.setPartVisibility).toHaveBeenNthCalledWith(1, 'graph-document-1:slot-a', false)
    expect(currentAppState.setPartVisibility).toHaveBeenNthCalledWith(2, 'graph-document-1:slot-b', false)
  })

  it('applies an object row hide eye across the resolved selected content set when explicit targets are narrower', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: 'Graph 1',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-a'],
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
          highlightViewerKey: 'graph-document-1:slot-a',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-1',
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: 'Graph 1',
          isVisible: true,
          visibilityPartKeys: ['graph-document-1:slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-2',
          slotId: 'slot-b',
          sourceNodeId: 'node-2',
          resolutionState: 'resolved',
          highlightViewerKey: 'graph-document-1:slot-b',
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-2',
        },
      ],
      workspaceSelection: {
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        resolvedContentSelection: {
          rootRowId: 'multi-select',
          rootKind: 'multi-select',
          partKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
          groupedRowIds: [],
        },
        activeSurface: 'viewport',
      },
    }

    ;({ root } = await renderBrowserPanel())

    await click(findButtonByLabel('Hide Object 1')!)

    expect(currentAppState.setPartVisibility).toHaveBeenNthCalledWith(1, 'graph-document-1:slot-a', false)
    expect(currentAppState.setPartVisibility).toHaveBeenNthCalledWith(2, 'graph-document-1:slot-b', false)
  })

  it('adds Hide to authored container row menus and routes it through shared part visibility', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['component-1'],
          },
        },
        componentsById: {
          'component-1': {
            componentId: 'component-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            ownerGraphDocumentId: 'graph-document-1',
            label: 'Component 1',
            componentSourceKind: 'authored',
            sourceGraphDocumentId: null,
            sourceOutputEntryId: null,
            sourceNodeId: null,
            slotId: null,
            receiveId: null,
            resolutionState: 'resolved',
            childObjectIds: ['object-1', 'object-2'],
          },
        },
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: null,
            parentComponentId: 'component-1',
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: null,
            parentComponentId: 'component-1',
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'component-1',
          kind: 'component',
          label: 'Component 1',
          meta: 'Graph 1',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          componentSourceKind: 'authored',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 2,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    await contextMenu(findRowMainByLabel('Assembly 1')!)
    const hideButton =
      Array.from(document.querySelectorAll('.BrowserTreeContextMenu button')).find(
        (element) => element.textContent?.trim() === 'Hide',
      ) ?? null

    expect(hideButton).not.toBeNull()

    await click(hideButton!)

    expect(currentAppState.setPartVisibility).toHaveBeenNthCalledWith(1, 'slot-a', false)
    expect(currentAppState.setPartVisibility).toHaveBeenNthCalledWith(2, 'slot-b', false)
  })

  it('shows same-parent drop intent and reorders published objects through the shared move seam', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['object-1', 'object-2'],
          },
        },
        componentsById: {},
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
          parentComponentId: null,
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
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRow = findRowMainByLabel('Object 1')
    const targetRow = findRowMainByLabel('Object 2')
    expect(sourceRow).not.toBeNull()
    expect(targetRow).not.toBeNull()

    mockRowRect(sourceRow!.closest('.BrowserTreeRow')!, 0)
    mockRowRect(targetRow!.closest('.BrowserTreeRow')!, 48)

    await dragRow(sourceRow!.closest('.BrowserTreeRow')!, targetRow!.closest('.BrowserTreeRow')!, 74)

    expect(currentAppState.moveProjectContentOwner).toHaveBeenCalledWith(
      { kind: 'object', objectId: 'object-1' },
      { kind: 'object', objectId: 'object-2', position: 'after' },
    )
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
  })

  it('shows a lifted dragged row and active reorder preview before drop', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['object-1', 'object-2'],
          },
        },
        componentsById: {},
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
          parentComponentId: null,
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
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRowMain = findRowMainByLabel('Object 1')
    const targetRowMain = findRowMainByLabel('Object 2')
    expect(sourceRowMain).not.toBeNull()
    expect(targetRowMain).not.toBeNull()

    const sourceRow = sourceRowMain!.closest('.BrowserTreeRow')!
    const targetRow = targetRowMain!.closest('.BrowserTreeRow')!
    mockRowRect(sourceRow, 0)
    mockRowRect(targetRow, 48)
    const dataTransfer = await beginDragRow(sourceRow)

    expect(sourceRow.classList.contains('isDragging')).toBe(true)
    expect(sourceRow.querySelector('.BrowserTreeRowDragGhost')).toBeNull()

    await dragOverRow(targetRow, dataTransfer, 74)

    expect(targetRow.classList.contains('isDropTargetAfter')).toBe(true)
    expect(sourceRow.classList.contains('isDragPreviewHidden')).toBe(false)
    expect(document.querySelector('.BrowserTreeDropPlaceholder')).toBeNull()

    await endDragRow(sourceRow)
  })

  it('resolves vertical gap hover to the nearest row instead of keeping a stale lower target', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['object-1', 'object-2'],
          },
        },
        componentsById: {},
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
          parentComponentId: null,
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
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRowMain = findRowMainByLabel('Object 1')
    const targetRowMain = findRowMainByLabel('Object 2')
    expect(sourceRowMain).not.toBeNull()
    expect(targetRowMain).not.toBeNull()

    const sourceRow = sourceRowMain!.closest('.BrowserTreeRow')!
    const targetRow = targetRowMain!.closest('.BrowserTreeRow')!
    mockRowRect(sourceRow, 0)
    mockRowRect(targetRow, 48)

    const dataTransfer = await beginDragRow(sourceRow)

    await dragOverRow(targetRow, dataTransfer, 41)

    expect(targetRow.classList.contains('isDropTargetBefore')).toBe(true)

    await dropRow(targetRow, dataTransfer, 40)

    expect(currentAppState.moveProjectContentOwner).toHaveBeenCalledWith(
      { kind: 'object', objectId: 'object-1' },
      { kind: 'object', objectId: 'object-2', position: 'before' },
    )
  })

  it('falls back to the nearer legal reorder side when middle-band into is illegal', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['object-1', 'object-2'],
          },
        },
        componentsById: {},
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
          parentComponentId: null,
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
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRowMain = findRowMainByLabel('Object 1')
    const targetRowMain = findRowMainByLabel('Object 2')
    expect(sourceRowMain).not.toBeNull()
    expect(targetRowMain).not.toBeNull()

    const sourceRow = sourceRowMain!.closest('.BrowserTreeRow')!
    const targetRow = targetRowMain!.closest('.BrowserTreeRow')!
    mockRowRect(sourceRow, 0)
    mockRowRect(targetRow, 48)

    const dataTransfer = await beginDragRow(sourceRow)

    await dragOverRow(targetRow, dataTransfer, 68)

    expect(targetRow.classList.contains('isDropTargetAfter')).toBe(true)

    await dropRow(targetRow, dataTransfer, 68)

    expect(currentAppState.moveProjectContentOwner).toHaveBeenCalledWith(
      { kind: 'object', objectId: 'object-1' },
      { kind: 'object', objectId: 'object-2', position: 'after' },
    )
  })

  it('keeps a visible insert line for legal cross-parent owner drops while the owner stays secondary', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['object-1'],
          },
          'assembly-2': {
            assemblyId: 'assembly-2',
            label: 'Assembly 2',
            parentAssemblyId: null,
            assemblySourceKind: 'authored',
            childRowIds: ['object-2'],
          },
        },
        componentsById: {},
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-2',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
        {
          rowId: 'assembly-2',
          kind: 'assembly',
          label: 'Assembly 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-2',
          parentComponentId: null,
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
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRowMain = findRowMainByLabel('Object 2')
    const targetOwnerRowMain = findRowMainByLabel('Assembly 1')
    const targetAnchorRowMain = findRowMainByLabel('Object 1')
    expect(sourceRowMain).not.toBeNull()
    expect(targetOwnerRowMain).not.toBeNull()
    expect(targetAnchorRowMain).not.toBeNull()

    const sourceRow = sourceRowMain!.closest('.BrowserTreeRow')!
    const targetOwnerRow = targetOwnerRowMain!.closest('.BrowserTreeRow')!
    const targetAnchorRow = targetAnchorRowMain!.closest('.BrowserTreeRow')!
    mockRowRect(targetOwnerRow, 0)
    mockRowRect(targetAnchorRow, 36)
    mockRowRect(sourceRow, 96)

    const dataTransfer = await beginDragRow(sourceRow)

    await dragOverRow(targetOwnerRow, dataTransfer, 16)

    expect(targetAnchorRow.classList.contains('isDropTargetAfter')).toBe(true)
    expect(targetOwnerRow.classList.contains('isDropOwnerSupport')).toBe(true)

    await dropRow(targetOwnerRow, dataTransfer, 16)

    expect(currentAppState.moveProjectContentOwner).toHaveBeenCalledWith(
      { kind: 'object', objectId: 'object-2' },
      { kind: 'assembly', assemblyId: 'assembly-1', position: 'into' },
    )
  })

  it('lands a first cross-parent drop directly beside the hovered child slot', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['object-1'],
          },
          'assembly-2': {
            assemblyId: 'assembly-2',
            label: 'Assembly 2',
            parentAssemblyId: null,
            assemblySourceKind: 'authored',
            childRowIds: ['object-2'],
          },
        },
        componentsById: {},
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-2',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
        {
          rowId: 'assembly-2',
          kind: 'assembly',
          label: 'Assembly 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-2',
          parentComponentId: null,
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
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRowMain = findRowMainByLabel('Object 2')
    const targetOwnerRowMain = findRowMainByLabel('Assembly 1')
    const targetAnchorRowMain = findRowMainByLabel('Object 1')
    expect(sourceRowMain).not.toBeNull()
    expect(targetOwnerRowMain).not.toBeNull()
    expect(targetAnchorRowMain).not.toBeNull()

    const sourceRow = sourceRowMain!.closest('.BrowserTreeRow')!
    const targetOwnerRow = targetOwnerRowMain!.closest('.BrowserTreeRow')!
    const targetAnchorRow = targetAnchorRowMain!.closest('.BrowserTreeRow')!
    mockRowRect(targetOwnerRow, 0)
    mockRowRect(targetAnchorRow, 36)
    mockRowRect(sourceRow, 96)

    const dataTransfer = await beginDragRow(sourceRow)

    await dragOverRow(targetAnchorRow, dataTransfer, 58)

    expect(targetAnchorRow.classList.contains('isDropTargetAfter')).toBe(true)
    expect(targetOwnerRow.classList.contains('isDropOwnerSupport')).toBe(true)

    await dropRow(targetAnchorRow, dataTransfer, 58)

    expect(currentAppState.moveProjectContentOwner).toHaveBeenNthCalledWith(
      1,
      { kind: 'object', objectId: 'object-2' },
      { kind: 'assembly', assemblyId: 'assembly-1', position: 'into' },
    )
    expect(currentAppState.moveProjectContentOwner).toHaveBeenNthCalledWith(
      2,
      { kind: 'object', objectId: 'object-2' },
      { kind: 'object', objectId: 'object-1', position: 'after' },
    )
  })

  it('clears the Browser drag session through the global escape fallback', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['object-1', 'object-2'],
          },
        },
        componentsById: {},
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a', 'slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
          parentComponentId: null,
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
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRowMain = findRowMainByLabel('Object 1')
    const targetRowMain = findRowMainByLabel('Object 2')
    expect(sourceRowMain).not.toBeNull()
    expect(targetRowMain).not.toBeNull()

    const sourceRow = sourceRowMain!.closest('.BrowserTreeRow')!
    const targetRow = targetRowMain!.closest('.BrowserTreeRow')!
    mockRowRect(sourceRow, 0)
    mockRowRect(targetRow, 48)
    const dataTransfer = await beginDragRow(sourceRow)

    await dragOverRow(targetRow, dataTransfer, 74)

    expect(targetRow.classList.contains('isDropTargetAfter')).toBe(true)
    expect(document.querySelector('.BrowserTreeDropPlaceholder')).toBeNull()
    expect(sourceRow.classList.contains('isDragPreviewHidden')).toBe(false)

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })

    expect(document.querySelector('.BrowserTreeDropPlaceholder')).toBeNull()
    expect(sourceRow.classList.contains('isDragging')).toBe(false)
    expect(sourceRow.classList.contains('isDragPreviewHidden')).toBe(false)
  })

  it('promotes the dragged owner into selection on drag start', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'authored',
            childRowIds: ['component-1'],
          },
        },
        componentsById: {
          'component-1': {
            componentId: 'component-1',
            parentAssemblyId: 'assembly-1',
            ownerGraphDocumentId: null,
            sourceGraphDocumentId: null,
            sourceOutputEntryId: null,
            sourceNodeId: null,
            label: 'Component 1',
            componentSourceKind: 'authored',
            resolutionState: 'resolved',
            receiveId: null,
            childObjectIds: [],
          },
          'component-2': {
            componentId: 'component-2',
            parentAssemblyId: 'assembly-1',
            ownerGraphDocumentId: null,
            sourceGraphDocumentId: null,
            sourceOutputEntryId: null,
            sourceNodeId: null,
            label: 'Component 2',
            componentSourceKind: 'authored',
            resolutionState: 'resolved',
            receiveId: null,
            childObjectIds: [],
          },
        },
        objectsById: {},
      },
      workspaceSelection: {
        selectedTarget: {
          kind: 'component',
          componentId: 'component-2',
        },
        explicitSelectedTargets: [
          {
            kind: 'component',
            componentId: 'component-2',
          },
        ],
        selectionAnchorTarget: {
          kind: 'component',
          componentId: 'component-2',
        },
        resolvedContentSelection: null,
        activeSurface: 'browser',
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          parentAssemblyId: null,
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          statusLabel: 'Ready',
          statusTone: 'ready',
        },
        {
          rowId: 'component-1',
          kind: 'component',
          label: 'Component 1',
          meta: '',
          parentAssemblyId: 'assembly-1',
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          componentSourceKind: 'authored',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 0,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
        },
        {
          rowId: 'component-2',
          kind: 'component',
          label: 'Component 2',
          meta: '',
          parentAssemblyId: 'assembly-1',
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          componentSourceKind: 'authored',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 0,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const assemblyRowMain = findRowMainByLabel('Assembly 1')
    expect(assemblyRowMain).not.toBeNull()

    await beginDragRow(assemblyRowMain!.closest('.BrowserTreeRow')!)

    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'assembly',
        assemblyId: 'assembly-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'assembly',
          assemblyId: 'assembly-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'assembly',
        assemblyId: 'assembly-1',
      },
    })
    expect(currentAppState.workspaceSelection.selectedTarget).toEqual({
      kind: 'assembly',
      assemblyId: 'assembly-1',
    })
  })

  const buildGroupedImportedReferenceDragScenario = (options?: {
    includeTargetObject?: boolean
  }) => {
    const includeTargetObject = options?.includeTargetObject ?? false
    const referenceWorkspaceTree: ReferenceWorkspaceBrowserTreeVm = {
      rowId: 'reference-root',
      label: 'References',
      isExpanded: true,
      categories: [
        ...emptyReferenceWorkspaceTree.categories.slice(0, 3),
        {
          rowId: 'reference-category-row:user-references',
          categoryId: 'user-references',
          label: 'User References',
          isExpanded: true,
          itemCount: 2,
          visibleItemCount: 2,
          hasLoadingItem: false,
          hasErrorItem: false,
          emptyLabel: 'No imported references yet.',
          items: [
            {
              rowId: 'reference-item-row:reference-import:1',
              referenceId: 'reference-import:1',
              sourceKind: 'imported',
              label: 'shoe-a.glb',
              categoryId: 'user-references',
              fileType: 'glb',
              assetPath: 'blob:shoe-a',
              isVisible: true,
              loadState: 'loaded',
              errorMessage: null,
              parts: [],
              parentAssemblyId: 'assembly-1',
              explodedFromReferenceId: null,
              sourcePartKey: null,
              sourceMeshIndex: null,
            },
            {
              rowId: 'reference-item-row:reference-import:2',
              referenceId: 'reference-import:2',
              sourceKind: 'imported',
              label: 'shoe-b.glb',
              categoryId: 'user-references',
              fileType: 'glb',
              assetPath: 'blob:shoe-b',
              isVisible: true,
              loadState: 'loaded',
              errorMessage: null,
              parts: [],
              parentAssemblyId: 'assembly-1',
              explodedFromReferenceId: null,
              sourcePartKey: null,
              sourceMeshIndex: null,
            },
          ],
        },
      ],
    }

    return {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'authored',
            childRowIds: [],
          },
          'assembly-2': {
            assemblyId: 'assembly-2',
            label: 'Assembly 2',
            parentAssemblyId: null,
            assemblySourceKind: 'authored',
            childRowIds: includeTargetObject ? ['object-target-1'] : [],
          },
        },
        componentsById: {},
        objectsById: includeTargetObject
          ? {
              'object-target-1': {
                objectId: 'object-target-1',
                ownerGraphDocumentId: 'graph-document-1',
                parentAssemblyId: 'assembly-2',
                parentComponentId: null,
                objectSourceKind: 'published-object',
                sourceGraphDocumentId: 'graph-document-1',
                sourceOutputEntryId: 'output-entry-target-1',
                sourceNodeId: 'node-target-1',
                slotId: 'slot-target-1',
                label: 'Target Object 1',
                resolutionState: 'resolved',
              },
            }
          : {},
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          parentAssemblyId: null,
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          statusLabel: 'Ready',
          statusTone: 'ready',
        },
        {
          rowId: 'assembly-2',
          kind: 'assembly',
          label: 'Assembly 2',
          meta: '',
          parentAssemblyId: null,
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          statusLabel: 'Ready',
          statusTone: 'ready',
        },
        ...(includeTargetObject
          ? [
              {
                rowId: 'object-target-1',
                kind: 'object',
                label: 'Target Object 1',
                meta: '',
                isVisible: true,
                visibilityPartKeys: ['slot-target-1'],
                buildState: 'done',
                buildStateLabel: 'Built',
                rebuildGraphDocumentIds: [],
                ownerGraphDocumentId: 'graph-document-1',
                parentAssemblyId: 'assembly-2',
                parentComponentId: null,
                objectSourceKind: 'published-object',
                sourceGraphDocumentId: 'graph-document-1',
                sourceOutputEntryId: 'output-entry-target-1',
                slotId: 'slot-target-1',
                sourceNodeId: 'node-target-1',
                resolutionState: 'resolved',
                highlightViewerKey: 'slot-target-1',
                authoringGraphDocumentId: 'graph-document-1',
                authoringNodeId: 'node-target-1',
              },
            ]
          : []),
      ],
      referenceWorkspaceTree,
      referenceWorkspace: referenceWorkspaceStateFromTree(referenceWorkspaceTree),
      workspaceSelection: {
        ...currentAppState.workspaceSelection,
        selectedTarget: {
          kind: 'object',
          objectId: 'reference-item-row:reference-import:1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'reference-item-row:reference-import:1',
          },
          {
            kind: 'object',
            objectId: 'reference-item-row:reference-import:2',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'reference-item-row:reference-import:1',
        },
        resolvedContentSelection: {
          rootRowId: 'multi-select',
          rootKind: 'multi-select',
          partKeys: [],
          groupedRowIds: [
            'reference-item-row:reference-import:1',
            'reference-item-row:reference-import:2',
          ],
        },
        activeSurface: 'browser',
      },
    }
  }

  it('keeps imported reference multi-select rows grouped through drag start', async () => {
    currentAppState = buildGroupedImportedReferenceDragScenario()

    ;({ root } = await renderBrowserPanel())

    const sourceRow = findRowMainByLabel('shoe-a.glb')?.closest('.BrowserTreeRow')
    const siblingRow = findRowMainByLabel('shoe-b.glb')?.closest('.BrowserTreeRow')
    expect(sourceRow).not.toBeNull()
    expect(siblingRow).not.toBeNull()

    await beginDragRow(sourceRow!)

    expect(sourceRow!.classList.contains('isDragging')).toBe(true)
    expect(siblingRow!.classList.contains('isDragging')).toBe(true)
    expect(currentAppState.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:reference-import:1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'reference-item-row:reference-import:1',
        },
        {
          kind: 'object',
          objectId: 'reference-item-row:reference-import:2',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'reference-item-row:reference-import:1',
      },
    })
  })

  it('keeps grouped imported reference drag invalid on non-owner rows', async () => {
    currentAppState = buildGroupedImportedReferenceDragScenario({
      includeTargetObject: true,
    })

    ;({ root } = await renderBrowserPanel())

    const sourceRow = findRowMainByLabel('shoe-a.glb')?.closest('.BrowserTreeRow')
    const targetObjectRow = findRowMainByLabel('Target Object 1')?.closest('.BrowserTreeRow')
    const targetAssemblyRow = findRowMainByLabel('Assembly 2')?.closest('.BrowserTreeRow')
    expect(sourceRow).not.toBeNull()
    expect(targetObjectRow).not.toBeNull()
    expect(targetAssemblyRow).not.toBeNull()

    mockRowRect(targetAssemblyRow!, 0)
    mockRowRect(targetObjectRow!, 36)
    mockRowRect(sourceRow!, 72)

    const dataTransfer = await beginDragRow(sourceRow!)

    await dragOverRow(targetObjectRow!, dataTransfer, 52)

    expect(targetObjectRow!.classList.contains('isDropTargetInvalid')).toBe(true)
    expect(targetAssemblyRow!.classList.contains('isDropOwnerSupport')).toBe(false)
  })

  it('preserves grouped selection after moving imported reference multi-selects', async () => {
    currentAppState = buildGroupedImportedReferenceDragScenario()

    ;({ root } = await renderBrowserPanel())

    const sourceRow = findRowMainByLabel('shoe-a.glb')?.closest('.BrowserTreeRow')
    const targetAssemblyRow = findRowMainByLabel('Assembly 2')?.closest('.BrowserTreeRow')
    expect(sourceRow).not.toBeNull()
    expect(targetAssemblyRow).not.toBeNull()

    mockRowRect(targetAssemblyRow!, 0)
    mockRowRect(sourceRow!, 72)

    await dragRow(sourceRow!, targetAssemblyRow!, 16)

    expect(currentAppState.moveProjectContentOwnersBatch).toHaveBeenCalledWith(
      [
        { kind: 'imported-reference', referenceId: 'reference-import:1' },
        { kind: 'imported-reference', referenceId: 'reference-import:2' },
      ],
      { kind: 'assembly', assemblyId: 'assembly-2', position: 'into' },
    )
    expect(currentAppState.workspaceSelection.selectedTarget).toEqual({
      kind: 'object',
      objectId: 'reference-item-row:reference-import:1',
    })
    expect(currentAppState.workspaceSelection.explicitSelectedTargets).toEqual([
      {
        kind: 'object',
        objectId: 'reference-item-row:reference-import:1',
      },
      {
        kind: 'object',
        objectId: 'reference-item-row:reference-import:2',
      },
    ])
    expect(currentAppState.workspaceSelection.resolvedContentSelection).toMatchObject({
      rootKind: 'multi-select',
      groupedRowIds: [
        'reference-item-row:reference-import:1',
        'reference-item-row:reference-import:2',
      ],
    })
  })

  it('allows direct into-drop on collapsed authored components', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['component-1', 'object-1'],
          },
        },
        componentsById: {
          'component-1': {
            componentId: 'component-1',
            parentAssemblyId: 'assembly-1',
            ownerGraphDocumentId: null,
            sourceGraphDocumentId: null,
            sourceOutputEntryId: null,
            sourceNodeId: null,
            label: 'Component 1',
            componentSourceKind: 'authored',
            resolutionState: 'resolved',
            receiveId: null,
            childObjectIds: ['object-2'],
          },
        },
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: 'component-1',
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'component-1',
          kind: 'component',
          label: 'Component 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          componentSourceKind: 'authored',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 1,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
        {
          rowId: 'object-2',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-b'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRow = findRowMainByLabel('Object 1')
    const targetRow = findRowMainByLabel('Component 1')
    expect(sourceRow).not.toBeNull()
    expect(targetRow).not.toBeNull()

    Object.defineProperty(sourceRow!.closest('.BrowserTreeRow')!, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 240,
        bottom: 32,
        width: 240,
        height: 32,
        toJSON: () => ({}),
      }),
    })
    Object.defineProperty(targetRow!.closest('.BrowserTreeRow')!, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0,
        y: 48,
        top: 48,
        left: 0,
        right: 240,
        bottom: 80,
        width: 240,
        height: 32,
        toJSON: () => ({}),
      }),
    })

    await dragRow(sourceRow!.closest('.BrowserTreeRow')!, targetRow!.closest('.BrowserTreeRow')!, 64)

    expect(currentAppState.moveProjectContentOwner).toHaveBeenCalledWith(
      { kind: 'object', objectId: 'object-1' },
      { kind: 'component', componentId: 'component-1', position: 'into' },
    )
  })

  it('drops promoted reference category containers into authored assemblies', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'authored',
            childRowIds: [],
          },
        },
        componentsById: {},
        objectsById: {},
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          statusLabel: '',
          statusTone: 'quiet',
          parentAssemblyId: null,
        },
      ],
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      referenceWorkspace: referenceWorkspaceStateFromTree(emptyReferenceWorkspaceTree),
      moveProjectContentOwner: vi.fn(() => true),
    }

    ;({ root } = await renderBrowserPanel())

    const sourceRow = findRowMainByLabel('Shoes')
    const targetRow = findRowMainByLabel('Assembly 1')
    expect(sourceRow).not.toBeNull()
    expect(targetRow).not.toBeNull()

    Object.defineProperty(sourceRow!.closest('.BrowserTreeRow')!, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 240,
        bottom: 32,
        width: 240,
        height: 32,
        toJSON: () => ({}),
      }),
    })
    Object.defineProperty(targetRow!.closest('.BrowserTreeRow')!, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0,
        y: 48,
        top: 48,
        left: 0,
        right: 240,
        bottom: 80,
        width: 240,
        height: 32,
        toJSON: () => ({}),
      }),
    })

    await dragRow(sourceRow!.closest('.BrowserTreeRow')!, targetRow!.closest('.BrowserTreeRow')!, 64)

    expect(currentAppState.moveProjectContentOwner).toHaveBeenCalledWith(
      { kind: 'component', componentId: 'reference-category-row:shoes' },
      { kind: 'assembly', assemblyId: 'assembly-1', position: 'into' },
    )
  })

  it('shows a visible landing slot for collapsed or empty owner drops before commit', async () => {
    currentAppState = {
      ...currentAppState,
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'runtime-root',
            childRowIds: ['component-1', 'object-1'],
          },
        },
        componentsById: {
          'component-1': {
            componentId: 'component-1',
            parentAssemblyId: 'assembly-1',
            ownerGraphDocumentId: null,
            sourceGraphDocumentId: null,
            sourceOutputEntryId: null,
            sourceNodeId: null,
            label: 'Component 1',
            componentSourceKind: 'authored',
            resolutionState: 'resolved',
            receiveId: null,
            childObjectIds: [],
          },
        },
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
        },
      },
      projectContentRows: [
        {
          rowId: 'assembly-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
        },
        {
          rowId: 'component-1',
          kind: 'component',
          label: 'Component 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: [],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: null,
          sourceGraphDocumentId: null,
          sourceOutputEntryId: null,
          componentSourceKind: 'authored',
          resolutionState: 'resolved',
          receiveId: null,
          childObjectCount: 0,
          slotId: null,
          sourceNodeId: null,
          highlightViewerKey: null,
          authoringGraphDocumentId: null,
          authoringNodeId: null,
        },
        {
          rowId: 'object-1',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: ['slot-a'],
          buildState: 'done',
          buildStateLabel: 'Built',
          rebuildGraphDocumentIds: [],
          ownerGraphDocumentId: 'graph-document-1',
          parentAssemblyId: 'assembly-1',
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
        },
      ],
    }

    ;({ root } = await renderBrowserPanel())

    const componentRowMain = findRowMainByLabel('Component 1')
    expect(componentRowMain).not.toBeNull()

    await click(componentRowMain!)

    const componentRow = componentRowMain!.closest('.BrowserTreeRow')!
    const collapseButton = componentRow.querySelector('.BrowserTreeRowExpand') as HTMLButtonElement | null
    expect(collapseButton).not.toBeNull()

    await click(collapseButton!)

    const collapsedComponentRowMain = findRowMainByLabel('Component 1')
    expect(collapsedComponentRowMain).not.toBeNull()
    const collapsedComponentRow = collapsedComponentRowMain!.closest('.BrowserTreeRow')!
    expect(findRowMainByLabel('Object 2')).toBeNull()
    const sourceRowMain = findRowMainByLabel('Object 1')
    expect(sourceRowMain).not.toBeNull()
    const sourceRow = sourceRowMain!.closest('.BrowserTreeRow')!
    Object.defineProperty(sourceRow, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 240,
        bottom: 32,
        width: 240,
        height: 32,
        toJSON: () => ({}),
      }),
    })
    Object.defineProperty(collapsedComponentRow, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0,
        y: 48,
        top: 48,
        left: 0,
        right: 240,
        bottom: 80,
        width: 240,
        height: 32,
        toJSON: () => ({}),
      }),
    })
    const dataTransfer = await beginDragRow(sourceRow)

    await dragOverRow(collapsedComponentRow, dataTransfer, 64)

    expect(collapsedComponentRow.classList.contains('isDropTargetAfter')).toBe(true)
    expect(collapsedComponentRow.classList.contains('isDropOwnerSupport')).toBe(true)
    expect(sourceRow.classList.contains('isDragPreviewHidden')).toBe(false)
    expect(document.querySelector('.BrowserTreeDropPlaceholder--into')).toBeNull()

    await endDragRow(sourceRow)
  })
})
