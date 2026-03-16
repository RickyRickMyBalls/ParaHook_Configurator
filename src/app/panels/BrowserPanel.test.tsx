// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let currentSpaghettiState: any
let currentAppState: any

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
      sharedViewerComposition: null,
      sharedViewerCompositionGraphDocumentIds: [],
    }

    currentAppState = {
      currentProject: null,
      projectContent: null,
      projectContentRows: [],
      buildPolicy: 'live',
      selectPart: vi.fn(),
      setInputMode: vi.fn(),
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

  it('replaces the graph icon with a local build-policy cycle button and keeps the row one-line', async () => {
    ;({ container, root } = await renderBrowserPanel())

    const policyButton = findButtonByLabel('Cycle build policy for Graph 1. Current policy Live')
    const saveButton = findButtonByLabel('Graph save options for Graph 1')
    expect(policyButton).not.toBeNull()
    expect(saveButton).not.toBeNull()
    expect(policyButton?.textContent).toBe('L')
    expect(container?.querySelector('.BrowserGraphStateBar--rebuild')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRowQuickAction--save.BrowserTreeRowQuickAction--unsaved')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRow.isOpen')).not.toBeNull()
    expect(container?.querySelector('.BrowserTreeRow.isActiveEditor')).not.toBeNull()
    expect(container?.textContent).toContain('Rebuild')
    expect(container?.textContent).not.toContain('Dirty')
    expect(container?.textContent).not.toContain('Saved')

    await click(policyButton!)
    expect(findButtonByLabel('Cycle build policy for Graph 1. Current policy Release')).not.toBeNull()

    await click(findButtonByLabel('Cycle build policy for Graph 1. Current policy Release')!)
    expect(findButtonByLabel('Cycle build policy for Graph 1. Current policy Manual')).not.toBeNull()
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

  it('single-clicking a component row selects it and highlights the viewport target when shared composition is inactive', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly Root',
          meta: '1 Component',
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

    ;({ root } = await renderBrowserPanel())

    const componentRow = findRowMainByLabel('Pedal Component')
    expect(componentRow).not.toBeNull()

    await click(componentRow!)

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
          label: 'Assembly Root',
          meta: '1 Component',
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

    expect(findRowMainByLabel('Pedal Component')).not.toBeNull()
    expect(findRowMainByLabel('Pedal Body')).not.toBeNull()

    await click(findButtonByLabel('Collapse Assembly Root children')!)

    expect(findRowMainByLabel('Pedal Component')).toBeNull()
    expect(findRowMainByLabel('Pedal Body')).toBeNull()
    expect(container?.textContent).toContain('Assembly Root')
  })

  it('lets a component row collapse and hide its object children', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly Root',
          meta: '1 Component',
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

    expect(findRowMainByLabel('Pedal Body')).not.toBeNull()

    await click(findButtonByLabel('Collapse Pedal Component children')!)

    expect(findRowMainByLabel('Pedal Body')).toBeNull()
    expect(findRowMainByLabel('Pedal Component')).not.toBeNull()
    expect(container?.textContent).toContain('Assembly Root')
  })

  it('single-clicking a component row becomes selection-only when shared composition is active', async () => {
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
          label: 'Assembly Root',
          meta: '1 Component',
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

    ;({ root } = await renderBrowserPanel())

    const componentRow = findRowMainByLabel('Pedal Component')
    expect(componentRow).not.toBeNull()

    await click(componentRow!)

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
          label: 'Assembly Root',
          meta: '1 Component',
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
          label: 'Assembly Root',
          meta: '1 Component',
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

  it('single-clicking an object row selects it and highlights the viewport target when shared composition is inactive', async () => {
    currentAppState = {
      ...currentAppState,
      projectContentRows: [
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly Root',
          meta: '1 Component',
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

    ;({ root } = await renderBrowserPanel())

    const objectRow = findRowMainByLabel('Pedal Body')
    expect(objectRow).not.toBeNull()

    await click(objectRow!)

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
          label: 'Assembly Root',
          meta: '1 Component',
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

  it('single-clicking a published output row highlights it and double click focuses its source graph node', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: '',
      editorViewportsById: {},
      editorViewportOrder: [],
      openGraphDocumentInViewport: vi.fn(() => 'editor-viewport-2'),
      graphRuntimeByDocumentId: {
        'graph-document-1': {
          outputSurface: {
            graphDocumentId: 'graph-document-1',
            publishedAtBuildSeq: 7,
            surfaceVersion: 1,
            entries: [
              {
                outputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
                slotId: 'slot-baseplate',
                sourceNodeId: 'node-baseplate-1',
                label: 'slot-baseplate',
                state: 'resolved',
                acceptedArtifactKey: 'baseplate',
              },
            ],
          },
        },
      },
    }

    ;({ root } = await renderBrowserPanel({
      newEditorSpawnPosition: { x: 405, y: 16 },
    }))

    await click(findButtonByLabel('Expand Graph 1 published outputs')!)

    const outputRow = findRowMainByLabel('Resolved | baseplate | Build 7')
    expect(outputRow).not.toBeNull()

    await click(outputRow!)
    expect(currentAppState.selectPart).toHaveBeenCalledWith('slot-baseplate')

    await doubleClick(outputRow!)
    expect(currentSpaghettiState.openGraphDocumentInViewport).toHaveBeenCalledWith('graph-document-1')
    expect(currentSpaghettiState.setSelectedNodeId).toHaveBeenCalledWith('node-baseplate-1')
  })
})
