// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReferenceWorkspaceBrowserTreeVm } from '../store/useAppStore'

let currentSpaghettiState: any
let currentAppState: any
let importReferenceFileFromDiskMock: ReturnType<typeof vi.fn>

vi.mock('../spaghetti/store/useSpaghettiStore', () => ({
  useSpaghettiStore: (selector: (state: any) => unknown) => selector(currentSpaghettiState),
  selectSharedViewerComposition: (state: any) => state.sharedViewerComposition,
  selectSharedViewerCompositionGraphDocumentIds: (state: any) =>
    state.sharedViewerCompositionGraphDocumentIds,
  defaultViewportPosition: { x: 344, y: 16 },
}))

vi.mock('../store/useAppStore', () => ({
  useAppStore: (selector: (state: any) => unknown) => selector(currentAppState),
  selectCurrentProjectContentBrowserRows: () => currentAppState.projectContentRows,
  selectReferenceWorkspaceBrowserTree: () => currentAppState.referenceWorkspaceTree,
}))

vi.mock('../references/importReferenceFile', () => ({
  REFERENCE_IMPORT_LABEL_BY_FILE_TYPE: {
    step: 'Import .step',
    stl: 'Import .stl',
    obj: 'Import .obj',
    glb: 'Import .glb',
  },
  importReferenceFileFromDisk: (...args: unknown[]) => importReferenceFileFromDiskMock(...args),
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

const referenceWorkspaceStateFromTree = (tree: typeof emptyReferenceWorkspaceTree) => ({
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
  importedReferencesById: Object.fromEntries(
    tree.categories
      .flatMap((category) => category.items)
      .filter((item) => item.sourceKind === 'imported')
      .map((item) => [
        item.referenceId,
        {
          referenceId: item.referenceId,
          label: item.label,
          fileType: item.fileType,
          assetPath: item.assetPath,
        },
      ]),
  ),
  importedReferenceOrder: tree.categories
    .flatMap((category) => category.items)
    .filter((item) => item.sourceKind === 'imported')
    .map((item) => item.referenceId),
})

const click = async (element: Element) => {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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
    importReferenceFileFromDiskMock = vi.fn()
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
      currentProject: null,
      projectContent: null,
      projectContentRows: [],
      referenceWorkspaceTree: emptyReferenceWorkspaceTree,
      referenceWorkspace: referenceWorkspaceStateFromTree(emptyReferenceWorkspaceTree),
      buildPolicy: 'live',
      requestGraphDocumentBuild: vi.fn(),
      selectPart: vi.fn(),
      setInputMode: vi.fn(),
      toggleReferenceWorkspaceExpanded: vi.fn(),
      toggleReferenceCategoryExpanded: vi.fn(),
      toggleReferenceItemVisibility: vi.fn(),
      setReferenceItemVisibility: vi.fn(),
      toggleReferenceCategoryVisibility: vi.fn(),
      addImportedReference: vi.fn(() => 'reference-import:1'),
      retryReferenceItemLoad: vi.fn(),
      removeImportedReference: vi.fn(),
      beginReferenceTransform: vi.fn(),
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

  it('lets the Browser header collapse and hide the panel body', async () => {
    ;({ container, root } = await renderBrowserPanel())

    const browserToggle = findButtonByLabel('Toggle browser panel')
    expect(browserToggle).not.toBeNull()
    expect(findButtonByLabel('Create new graph')).not.toBeNull()

    await click(browserToggle!)

    expect(findButtonByLabel('Create new graph')).toBeNull()
    expect(container?.textContent).not.toContain('Graph Documents')
    expect(container?.textContent).not.toContain('Open Editors')

    await click(browserToggle!)

    expect(findButtonByLabel('Create new graph')).not.toBeNull()
    expect(container?.textContent).toContain('Graph Documents')
  })

  it('runs the graph document header icon actions from the summary row', async () => {
    ;({ root } = await renderBrowserPanel())

    const createButton = findButtonByLabel('Create new graph')
    const duplicateButton = findButtonByLabel('Duplicate focused graph')
    const loadButton = findButtonByLabel('Load graph into new graph')

    expect(createButton).not.toBeNull()
    expect(duplicateButton).not.toBeNull()
    expect(loadButton).not.toBeNull()

    await click(createButton!)
    expect(currentSpaghettiState.createGraphDocument).toHaveBeenCalledTimes(1)
    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-2')
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')

    await click(duplicateButton!)
    expect(currentSpaghettiState.duplicateActiveGraphDocument).toHaveBeenCalledTimes(1)

    await click(loadButton!)
    expect(currentSpaghettiState.loadGraphDocumentIntoNewGraphFromFile).toHaveBeenCalledTimes(1)
  })

  it('opens the row menu from the overflow button and runs graph actions through the shared menu surface', async () => {
    ;({ root } = await renderBrowserPanel())

    const overflowButton = findButtonByLabel('More options for Graph 1')
    expect(overflowButton).not.toBeNull()

    await click(overflowButton!)

    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Graph 1')
    expect(findButtonByLabel('New Editor')).not.toBeNull()
    expect(findButtonByLabel('Export Graph')).not.toBeNull()

    await click(findButtonByLabel('New Editor')!)

    expect(currentSpaghettiState.openGraphDocumentInNewViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')
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

    const graphPolicyButton = findButtonByLabel('Cycle build policy for Graph 1. Current policy Live')
    expect(graphPolicyButton).toBeNull()

    const policyButton = findButtonByLabel('Cycle build policy for Pedal Component. Current policy Live')
    const saveButton = findButtonByLabel('Graph save options for Graph 1')
    expect(policyButton).not.toBeNull()
    expect(saveButton).not.toBeNull()
    expect(policyButton?.textContent).toBe('C')
    expect(container?.querySelector('.BrowserGraphStateBar--rebuild')).not.toBeNull()
    expect(container?.querySelector('.BrowserContentStateBar--rebuild')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRowQuickAction--save.BrowserTreeRowQuickAction--unsaved')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRow.isOpen')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRow.isActiveEditor')).not.toBeNull()
    expect(container?.textContent).toContain('Rebuild')
    expect(container?.textContent).not.toContain('Dirty')
    expect(container?.textContent).not.toContain('Saved')

    await click(policyButton!)
    expect(findButtonByLabel('Cycle build policy for Pedal Component. Current policy Release')).not.toBeNull()

    await click(findButtonByLabel('Cycle build policy for Pedal Component. Current policy Release')!)
    expect(findButtonByLabel('Cycle build policy for Pedal Component. Current policy Manual')).not.toBeNull()
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

  it('opens the dedicated save menu from the graph save button and exports through the existing disk path', async () => {
    ;({ root } = await renderBrowserPanel())

    const saveButton = findButtonByLabel('Graph save options for Graph 1')
    expect(saveButton).not.toBeNull()

    await click(saveButton!)

    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Graph 1')
    expect(findButtonByLabel('Export Graph')).not.toBeNull()
    expect(findButtonByLabel('Open')).toBeNull()

    await click(findButtonByLabel('Export Graph')!)

    expect(currentSpaghettiState.saveCachedGraphEntryToFile).toHaveBeenCalledWith('cached-graph-1')
    expect(document.querySelector('.BrowserTreeContextMenu')).toBeNull()
  })

  it('opens the same save menu from right-clicking the graph save button', async () => {
    ;({ root } = await renderBrowserPanel())

    const saveButton = findButtonByLabel('Graph save options for Graph 1')
    expect(saveButton).not.toBeNull()

    await contextMenu(saveButton!)

    expect(document.querySelector('.BrowserTreeContextMenuHeader')?.textContent).toBe('Graph 1')
    expect(findButtonByLabel('Export Graph')).not.toBeNull()
    expect(findButtonByLabel('Swap Editor')).toBeNull()
  })

  it('shows the save button as saved when the graph is clean and only shows build text while building', async () => {
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

    expect(container?.querySelector('.BrowserTreeRowQuickAction--save.BrowserTreeRowQuickAction--saved')).not.toBeNull()
    expect(container?.textContent).toContain('Building')
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
    expect(container?.textContent).toContain('Done')
    expect(container?.querySelector('.BrowserTreeRowQuickAction--save.BrowserTreeRowQuickAction--unsaved')).not.toBeNull()
  })

  it('clicking a graph row selects it and routes the focused editor to that graph', async () => {
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

    expect(currentSpaghettiState.swapFocusedEditorViewportToGraphDocument).toHaveBeenCalledWith(
      'graph-document-2',
    )
    expect(currentSpaghettiState.openGraphDocumentInViewport).not.toHaveBeenCalled()
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')
    expect(graphTwoRow?.getAttribute('aria-pressed')).toBe('true')

    const graphTwoShell = graphTwoRow?.closest('.BrowserTreeRow')
    expect(graphTwoShell?.classList.contains('isOpen')).toBe(true)
    expect(graphTwoShell?.classList.contains('isActiveEditor')).toBe(true)
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
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')
  })

  it('uses the provided spawn anchor when a graph row opens a new editor without an active editor', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
      openGraphDocumentInViewport: vi.fn(() => 'editor-viewport-2'),
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    const graphRow = findRowMainByLabel('Graph 1')
    expect(graphRow).not.toBeNull()

    await click(graphRow!)

    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith('editor-viewport-2', {
      x: 405,
      y: 16,
    })
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')
  })

  it('clicking an open editor row focuses that editor and the direct close button closes it', async () => {
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
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')
    expect(graphTwoEditorRow?.getAttribute('aria-pressed')).toBe('true')

    const graphTwoEditorShell = graphTwoEditorRow?.closest('.BrowserTreeRow')
    expect(graphTwoEditorShell?.classList.contains('isActiveEditor')).toBe(true)
    expect(container?.querySelector('[aria-label=\"Close Graph 2\"]')).not.toBeNull()

    await click(container?.querySelector('[aria-label=\"Close Graph 2\"]')!)

    expect(currentSpaghettiState.closeEditorViewport).toHaveBeenCalledWith('editor-viewport-2')
  })

  it('single-clicking a component row selects it, requests rebuild, and highlights the viewport target when shared composition is inactive', async () => {
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

    expect(currentAppState.requestGraphDocumentBuild).toHaveBeenCalledWith('graph-document-1')
    expect(currentAppState.selectPart).toHaveBeenCalledWith('slot-baseplate')
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

  it('renders passive right-side readiness status for content rows', async () => {
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

    const readyStatuses = container?.querySelectorAll('.BrowserTreeRowStatus--ready') ?? []
    const warningStatuses = container?.querySelectorAll('.BrowserTreeRowStatus--warning') ?? []

    expect(Array.from(readyStatuses).some((element) => element.textContent === 'Ready')).toBe(true)
    expect(Array.from(warningStatuses).some((element) => element.textContent === 'Unresolved')).toBe(true)
    expect(findRowMainByLabel('Pedal Component')?.textContent).toContain('Graph 1')
  })

  it('single-clicking a component row still requests rebuild while shared composition suppresses highlight selection', async () => {
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

    expect(currentAppState.requestGraphDocumentBuild).toHaveBeenCalledWith('graph-document-1')
    expect(currentAppState.selectPart).not.toHaveBeenCalled()
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
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')
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

    const overflowButton = findButtonByLabel('More options for Pedal Component')
    expect(overflowButton).not.toBeNull()

    await click(overflowButton!)
    expect(findButtonByLabel('View In Graph')).not.toBeNull()

    await click(findButtonByLabel('View In Graph')!)
    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-baseplate-1')
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')
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
    expect(currentSpaghettiState.setSelectedNodeId).not.toHaveBeenCalled()
  })

  it('single-clicking an object row selects it, requests rebuild, and highlights the viewport target when shared composition is inactive', async () => {
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

    expect(currentAppState.requestGraphDocumentBuild).toHaveBeenCalledWith('graph-document-1')
    expect(currentAppState.selectPart).toHaveBeenCalledWith('slot-baseplate')
    expect(currentSpaghettiState.swapFocusedEditorViewportToGraphDocument).not.toHaveBeenCalled()
    expect(objectRow?.getAttribute('aria-pressed')).toBe('true')
  })

  it('double-clicking an object row opens the source graph and focuses the source node', async () => {
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

    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setEditorViewportPosition).toHaveBeenCalledWith('editor-viewport-2', {
      x: 405,
      y: 16,
    })
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-baseplate-1')
    expect(currentAppState.setInputMode).toHaveBeenCalledWith('spaghetti')
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

    await click(findButtonByLabel('Expand Nodes')!)
    expect(findRowMainByLabel('Cube')).not.toBeNull()

    await click(findButtonByLabel('Collapse Graph 1 child sections')!)
    await click(findButtonByLabel('Expand Graph 1 child sections')!)
    expect(findRowMainByLabel('Cube')).not.toBeNull()

    await click(findRowMainByLabel('OutputPreview')!)
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-output-1')
    expect(currentSpaghettiState.requestEditorViewportNodeFit).toHaveBeenCalledWith(
      'editor-viewport-2',
      'node-output-1',
    )
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
    expect(findRowMainByLabel('Footpads')).not.toBeNull()
    expect(findRowMainByLabel('PubPad Full Assembly')).not.toBeNull()
    expect(findRowMainByLabel('Shoes')).not.toBeNull()
    expect(findRowMainByLabel('Shoe 1')).toBeNull()

    await click(findRowMainByLabel('Footpads')!)
    expect(currentAppState.toggleReferenceCategoryVisibility).toHaveBeenCalledWith('footpads')

    await click(findButtonByLabel('Expand Shoes children')!)
    expect(currentAppState.toggleReferenceCategoryExpanded).toHaveBeenCalledWith('shoes')

    await click(findRowMainByLabel('PubPad Full Assembly')!)
    expect(currentAppState.toggleReferenceItemVisibility).toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
    )
  })

  it('opens the Content import menu from the header + button and imports a single accepted file type into User References', async () => {
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
    expect(findButtonByLabel('Import .step')).not.toBeNull()
    expect(findButtonByLabel('Import .glb')).not.toBeNull()

    await click(findButtonByLabel('Import .glb')!)

    expect(importReferenceFileFromDiskMock).toHaveBeenCalledWith('glb')
    expect(currentAppState.addImportedReference).toHaveBeenCalledWith({
      fileName: 'shoe.glb',
      fileType: 'glb',
      objectUrl: 'blob:shoe-1',
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

    expect(currentAppState.setReferenceItemVisibility).toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
      true,
    )
    expect(currentAppState.beginReferenceTransform).toHaveBeenCalledWith(
      'footpad:pubpad-full-assembly',
    )
  })

  it('shows retry and remove inline actions for imported error rows without using an overflow menu', async () => {
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

    ;({ root } = await renderBrowserPanel())

    expect(findButtonByLabel('More options for shoe.glb')).toBeNull()
    expect(findButtonByLabel('Retry shoe.glb')).not.toBeNull()
    expect(findButtonByLabel('Remove shoe.glb')).not.toBeNull()

    await click(findButtonByLabel('Retry shoe.glb')!)
    expect(currentAppState.retryReferenceItemLoad).toHaveBeenCalledWith('reference-import:1')

    await click(findButtonByLabel('Remove shoe.glb')!)
    expect(currentAppState.removeImportedReference).toHaveBeenCalledWith('reference-import:1')
  })
})
