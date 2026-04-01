// @vitest-environment jsdom

import { act } from 'react'
import type { ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let currentSpaghettiState: any
let currentAppState: any

vi.mock('../spaghetti/store/useSpaghettiStore', () => ({
  useSpaghettiStore: (selector: (state: any) => unknown) => selector(currentSpaghettiState),
  selectEditorViewportById: (state: any, editorViewportId: string) =>
    state.editorViewportsById[editorViewportId] ?? null,
  selectEditorViewportSelectedNodeId: (state: any, editorViewportId: string) =>
    Object.prototype.hasOwnProperty.call(state.editorViewportSelectedNodeIdById ?? {}, editorViewportId)
      ? state.editorViewportSelectedNodeIdById[editorViewportId] ?? null
      : state.activeEditorViewportId === editorViewportId
        ? state.selectedNodeId
        : null,
  selectGraphByDocumentId: (state: any, graphDocumentId: string) =>
    state.graphDocumentsById[graphDocumentId]?.graph ?? null,
  selectGraphCompileResultByDocumentId: () => null,
  selectSharedViewerComposition: (state: any) => state.sharedViewerComposition,
}))

vi.mock('../store/useAppStore', () => ({
  useAppStore: (selector: (state: any) => unknown) => selector(currentAppState),
}))

vi.mock('../spaghetti/ui/DebugInspectorDrawer', () => ({
  DebugInspectorDrawer: () => <div>Debug Inspector</div>,
}))

vi.mock('../spaghetti/ui/SpaghettiEditor', () => ({
  SpaghettiEditor: ({
    viewMode,
    focusNodeId,
    fitNodeId,
    fitNodeRequestKey,
  }: {
    viewMode: string
    focusNodeId: string | null
    fitNodeId?: string | null
    fitNodeRequestKey?: number
  }) => (
    <div>{`Spaghetti Editor Canvas ${viewMode} ${focusNodeId ?? 'no-focus'} ${fitNodeId ?? 'no-fit'} ${fitNodeRequestKey ?? 0}`}</div>
  ),
}))

vi.mock('../spaghetti/ui/SpaghettiEditorBoundary', () => ({
  SpaghettiEditorBoundary: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

import { SpaghettiPanel } from './SpaghettiPanel'
import { defaultSpaghettiWindowAppearance } from './spaghettiWindowAppearance'

const renderSpaghettiPanel = async () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(<SpaghettiPanel editorViewportId="editor-viewport-1" />)
  })

  return { container, root }
}

describe('SpaghettiPanel', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    currentSpaghettiState = {
      activeEditorViewportId: 'editor-viewport-1',
      uiMessage: null,
      graphDocumentsById: {
        'graph-document-1': {
          graphDocumentId: 'graph-document-1',
          name: 'Graph 1',
          version: 1,
          graph: {
            schemaVersion: 1,
            nodes: [
              { nodeId: 'node-1', type: 'Part/Baseplate', params: {} },
              { nodeId: 'node-2', type: 'Part/ToeHook', params: {} },
            ],
            edges: [],
          },
        },
        'graph-document-2': {
          graphDocumentId: 'graph-document-2',
          name: 'Graph 2',
          version: 1,
          graph: { schemaVersion: 1, nodes: [], edges: [] },
        },
      },
      graphDocumentOrder: ['graph-document-1', 'graph-document-2'],
      selectedNodeId: 'node-1',
      editorViewportSelectedNodeIdById: {
        'editor-viewport-1': 'node-1',
      },
      editorViewportNodeFitRequest: null,
      editorViewportsById: {
        'editor-viewport-1': {
          editorViewportId: 'editor-viewport-1',
          graphDocumentId: 'graph-document-1',
          isFocused: true,
          windowMode: 'expanded',
          position: { x: 12, y: 12 },
          size: { width: 800, height: 600 },
          splitRatio: 0.5,
          restoreFromCollapsed: null,
          restoreFromSplit: null,
          zOrder: 1,
        },
      },
      sharedViewerComposition: null,
      applyGraphCommand: vi.fn(),
      createGraphDocument: vi.fn(() => 'graph-document-3'),
      setActiveEditorViewportId: vi.fn(),
      bindEditorViewportToGraphDocument: vi.fn(),
      addEditorViewportGraphToSharedViewerComposition: vi.fn(),
      removeEditorViewportGraphFromSharedViewerComposition: vi.fn(),
      saveFocusedEditorViewportGraphToFile: vi.fn(async () => {}),
      setEditorViewportSelectedNodeId: vi.fn(),
      setUiMessage: vi.fn(),
    }

    currentAppState = {
      workspaceSelection: {
        selectedTarget: null,
        activeSurface: 'spaghetti',
      },
      buildPolicy: 'manual',
      setSpaghettiGraph: vi.fn(),
      setWorkspaceSelectedTarget: vi.fn((target: unknown) => {
        currentAppState = {
          ...currentAppState,
          workspaceSelection: {
            ...currentAppState.workspaceSelection,
            selectedTarget: target,
          },
        }
      }),
      requestConsoleContextSync: vi.fn(),
      compileGraphDocument: vi.fn(),
      requestGraphDocumentBuild: vi.fn(),
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

  it('renders the collapsible toolbar sections in the panel header area', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    const graphSection = container?.querySelector('.SpaghettiGraphSection')
    const standaloneGraphRow = container?.querySelector('.SpaghettiGraphDocumentRow')
    const toolbarSections = Array.from(
      container?.querySelectorAll('.SpaghettiToolbarSection') ?? [],
    ) as HTMLDetailsElement[]
    const buildSection = toolbarSections.find((section) =>
      section.textContent?.includes('Build'),
    )

    expect(graphSection).toBeNull()
    expect(standaloneGraphRow).toBeNull()
    expect(toolbarSections.length).toBeGreaterThanOrEqual(6)
    expect(buildSection?.open).toBe(false)
    expect(container?.textContent).toContain('Part Nodes')
    expect(container?.textContent).toContain('Samples')
    expect(container?.textContent).toContain('Build')
    expect(container?.textContent).toContain('Viewer')
    expect(container?.textContent).toContain('Type Legend')
    expect(container?.textContent).toContain('Diagnostics')
    expect(container?.textContent).toContain('Focus Node')
    expect(container?.textContent).toContain('New Part Node')
    expect(container?.textContent).toContain('number')
  })

  it('uses the default expanded toolbar height on first render so the toolbar scroll area is bounded', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    const headerBlock = container?.querySelector('.SpaghettiPanelHeaderBlock') as HTMLDivElement | null
    expect(headerBlock?.style.height).toBe('150px')
  })

  it('uses the default expanded window-settings height on first render so the i-menu scroll area is bounded', async () => {
    const settingsContainer = document.createElement('div')
    document.body.appendChild(settingsContainer)
    root = createRoot(settingsContainer)

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isWindowSettingsOpen
          windowAppearance={defaultSpaghettiWindowAppearance}
        />,
      )
    })

    container = settingsContainer

    const settingsGroups = container.querySelector(
      '.SpaghettiWindowSettingsGroups',
    ) as HTMLDivElement | null
    const settingsResizeBar = container.querySelector(
      '.SpaghettiWindowSettingsResizeBar',
    ) as HTMLButtonElement | null

    expect(settingsGroups?.style.height).toBe('180px')
    expect(settingsResizeBar).not.toBeNull()
  })

  it('renders the new body side-padding slider in window settings', async () => {
    const settingsContainer = document.createElement('div')
    document.body.appendChild(settingsContainer)
    root = createRoot(settingsContainer)

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isWindowSettingsOpen
          windowAppearance={defaultSpaghettiWindowAppearance}
        />,
      )
    })

    container = settingsContainer

    expect(container.textContent).toContain('Side Padding')
    expect(container.textContent).toContain('Top Bottom Padding')
    expect(container.textContent).toContain('0px')
  })

  it('cycles the focus node forward from the focus ParaSelect caps', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    const nextButton = container?.querySelector(
      'button[aria-label="Next Focus Node"]',
    ) as HTMLButtonElement | null
    const focusTrack = container?.querySelector(
      '.SpaghettiFocusRow button.ParaSelectTrackButton[aria-label="Focus Node"]',
    ) as HTMLButtonElement | null

    expect(nextButton).not.toBeNull()
    expect(focusTrack?.textContent).toContain('node-1')
    expect(container?.textContent).toContain('Spaghetti Editor Canvas expanded node-1 no-fit 0')

    await act(async () => {
      nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(focusTrack?.textContent).toContain('node-2')
    expect(container?.textContent).toContain('Spaghetti Editor Canvas expanded node-2 node-2 1')
  })

  it('renders the graph picker beside the focus-node picker in the pinned row', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    const graphPicker = container?.querySelector(
      '.SpaghettiFocusRow .ParaSelectNative[aria-label="Graph"]',
    ) as HTMLSelectElement | null
    const focusPicker = container?.querySelector(
      '.SpaghettiFocusRow .ParaSelectNative[aria-label="Focus Node"]',
    ) as HTMLSelectElement | null

    expect(graphPicker).not.toBeNull()
    expect(graphPicker?.value).toBe('graph-document-1')
    expect(focusPicker).not.toBeNull()
    expect(focusPicker?.value).toBe('node-1')
  })

  it('offers an add new graph shortcut in the pinned graph picker menu', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    const trackButton = container?.querySelector(
      '.SpaghettiFocusRow .ParaSelectTrackButton[aria-label="Graph"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      trackButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const addNewGraphButton = Array.from(
      container?.querySelectorAll('.SpaghettiFocusRow .ParaSelectMenuAction') ?? [],
    ).find((button) => button.textContent === 'Add New Graph') as HTMLButtonElement | undefined

    expect(addNewGraphButton).not.toBeUndefined()

    await act(async () => {
      addNewGraphButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(currentSpaghettiState.createGraphDocument).toHaveBeenCalledTimes(1)
    expect(currentSpaghettiState.setActiveEditorViewportId).toHaveBeenCalledWith('editor-viewport-1')
    expect(currentSpaghettiState.bindEditorViewportToGraphDocument).toHaveBeenCalledWith(
      'editor-viewport-1',
      'graph-document-3',
    )
  })

  it('forwards an external viewport-targeted node-fit request into the editor canvas props', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      editorViewportNodeFitRequest: {
        editorViewportId: 'editor-viewport-1',
        nodeId: 'node-2',
        key: 7,
      },
    }

    ;({ container, root } = await renderSpaghettiPanel())

    expect(container?.textContent).toContain('Spaghetti Editor Canvas expanded node-1 node-2 7')
  })

  it('clears the focused node when shared selection returns to the graph level', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    expect(container?.textContent).toContain('Spaghetti Editor Canvas expanded node-1 no-fit 0')

    currentSpaghettiState = {
      ...currentSpaghettiState,
      selectedNodeId: null,
      editorViewportSelectedNodeIdById: {
        ...currentSpaghettiState.editorViewportSelectedNodeIdById,
        'editor-viewport-1': null,
      },
    }

    await act(async () => {
      root?.render(<SpaghettiPanel editorViewportId="editor-viewport-1" />)
    })

    expect(container?.textContent).toContain('Spaghetti Editor Canvas expanded no-focus no-fit 0')
  })

  it('syncs spaghetti node clicks into the shared workspace target on the first change', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    currentSpaghettiState = {
      ...currentSpaghettiState,
      selectedNodeId: 'node-2',
      editorViewportSelectedNodeIdById: {
        ...currentSpaghettiState.editorViewportSelectedNodeIdById,
        'editor-viewport-1': 'node-2',
      },
    }

    await act(async () => {
      root?.render(<SpaghettiPanel editorViewportId="editor-viewport-1" />)
    })

    expect(currentAppState.workspaceSelection.selectedTarget).toEqual({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'node-2',
    })
    expect(currentAppState.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
    expect(container?.textContent).toContain('Spaghetti Editor Canvas expanded node-2 no-fit 0')
  })

  it('does not let an inactive editor viewport overwrite the shared workspace target', async () => {
    currentSpaghettiState = {
      ...currentSpaghettiState,
      activeEditorViewportId: 'editor-viewport-2',
      editorViewportsById: {
        ...currentSpaghettiState.editorViewportsById,
        'editor-viewport-2': {
          editorViewportId: 'editor-viewport-2',
          graphDocumentId: 'graph-document-2',
          isFocused: true,
          windowMode: 'expanded',
          position: { x: 48, y: 32 },
          size: { width: 800, height: 600 },
          splitRatio: 0.5,
          restoreFromCollapsed: null,
          restoreFromSplit: null,
          zOrder: 2,
        },
      },
      selectedNodeId: 'node-2',
      editorViewportSelectedNodeIdById: {
        'editor-viewport-1': 'node-1',
        'editor-viewport-2': 'node-2',
      },
    }

    ;({ container, root } = await renderSpaghettiPanel())

    expect(currentAppState.workspaceSelection.selectedTarget).toBeNull()
    expect(currentAppState.requestConsoleContextSync).not.toHaveBeenCalled()
    expect(container?.textContent).toContain('Spaghetti Editor Canvas expanded node-1 no-fit 0')
  })

  it('keeps the focus node row outside the scrollable toolbar block', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    const focusRow = container?.querySelector('.SpaghettiPanelPinnedRow') as HTMLDivElement | null
    const headerBlock = container?.querySelector('.SpaghettiPanelHeaderBlock') as HTMLDivElement | null

    expect(focusRow).not.toBeNull()
    expect(headerBlock?.contains(focusRow ?? null)).toBe(false)
    expect(focusRow?.textContent).toContain('Focus Node')
  })

  it('renders window settings above the focus row when opened', async () => {
    const settingsContainer = document.createElement('div')
    document.body.appendChild(settingsContainer)
    root = createRoot(settingsContainer)

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isWindowSettingsOpen
          windowAppearance={defaultSpaghettiWindowAppearance}
        />,
      )
    })

    container = settingsContainer

    const settingsSection = container.querySelector('.SpaghettiWindowSettingsSection') as HTMLDivElement | null
    const focusRow = container.querySelector('.SpaghettiFocusRow') as HTMLDivElement | null

    expect(settingsSection).not.toBeNull()
    expect(focusRow).not.toBeNull()
    expect(settingsSection?.textContent).toContain('Window Settings')
    expect(
      (settingsSection?.compareDocumentPosition(focusRow as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('lets the user collapse and expand the whole window-settings section', async () => {
    const settingsContainer = document.createElement('div')
    document.body.appendChild(settingsContainer)
    root = createRoot(settingsContainer)

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isWindowSettingsOpen
          windowAppearance={defaultSpaghettiWindowAppearance}
        />,
      )
    })

    container = settingsContainer

    const sectionToggle = container.querySelector(
      '.SpaghettiWindowSettingsHeaderToggle',
    ) as HTMLButtonElement | null

    expect(sectionToggle).not.toBeNull()
    expect(sectionToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(container.textContent).toContain('Title bar')
    expect(container.textContent).toContain('Body')
    expect(container.textContent).toContain('Text')
    expect(container.querySelector('.SpaghettiWindowSettingsResizeBar')).not.toBeNull()

    await act(async () => {
      sectionToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(sectionToggle?.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('.SpaghettiWindowSettingsGroups')).toBeNull()
    expect(container.querySelector('.SpaghettiWindowSettingsResizeBar')).toBeNull()
    expect(container.textContent).toContain('Window Settings')

    await act(async () => {
      sectionToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(sectionToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector('.SpaghettiWindowSettingsGroups')).not.toBeNull()
    expect(container.querySelector('.SpaghettiWindowSettingsResizeBar')).not.toBeNull()
    expect(container.textContent).toContain('Title bar')
    expect(container.textContent).toContain('Body')
    expect(container.textContent).toContain('Text')
  })

  it('lets the user collapse and expand window-settings subsections', async () => {
    const settingsContainer = document.createElement('div')
    document.body.appendChild(settingsContainer)
    root = createRoot(settingsContainer)

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isWindowSettingsOpen
          windowAppearance={defaultSpaghettiWindowAppearance}
        />,
      )
    })

    container = settingsContainer

    const titlebarToggle = container.querySelector(
      '.SpaghettiWindowSettingsGroup[data-section-id="titlebar"] .SpaghettiWindowSettingsGroupToggle',
    ) as HTMLButtonElement | null
    const titlebarFields = container.querySelector(
      '.SpaghettiWindowSettingsGroup[data-section-id="titlebar"] .SpaghettiWindowSettingsGroupFields',
    ) as HTMLDivElement | null

    expect(titlebarToggle).not.toBeNull()
    expect(titlebarToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(titlebarToggle?.textContent).toContain('-')
    expect(titlebarFields?.textContent).toContain('Opacity')
    expect(titlebarFields?.textContent).toContain('Color')

    await act(async () => {
      titlebarToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const collapsedTitlebarFields = container.querySelector(
      '.SpaghettiWindowSettingsGroup[data-section-id="titlebar"] .SpaghettiWindowSettingsGroupFields',
    ) as HTMLDivElement | null

    expect(titlebarToggle?.getAttribute('aria-expanded')).toBe('false')
    expect(titlebarToggle?.textContent).toContain('+')
    expect(collapsedTitlebarFields).toBeNull()

    await act(async () => {
      titlebarToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const expandedTitlebarFields = container.querySelector(
      '.SpaghettiWindowSettingsGroup[data-section-id="titlebar"] .SpaghettiWindowSettingsGroupFields',
    ) as HTMLDivElement | null

    expect(titlebarToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(titlebarToggle?.textContent).toContain('-')
    expect(expandedTitlebarFields?.className).toContain('isExpanded')
    expect(expandedTitlebarFields?.textContent).toContain('Opacity')
    expect(expandedTitlebarFields?.textContent).toContain('Color')
  })

  it('opens the text-size ParaSelect menu from the middle track in window settings', async () => {
    const settingsContainer = document.createElement('div')
    document.body.appendChild(settingsContainer)
    root = createRoot(settingsContainer)

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isWindowSettingsOpen
          windowAppearance={defaultSpaghettiWindowAppearance}
        />,
      )
    })

    container = settingsContainer

    const sizeTrackButton = container.querySelector(
      '.SpaghettiWindowSettingsGroup[data-section-id="text"] button.ParaSelectTrackButton[aria-label="Size"]',
    ) as HTMLButtonElement | null

    expect(sizeTrackButton).not.toBeNull()
    expect(sizeTrackButton?.textContent).toContain('Size')
    expect(sizeTrackButton?.textContent).toContain('Normal')

    await act(async () => {
      sizeTrackButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const sizeMenu = container.querySelector(
      '.SpaghettiWindowSettingsGroup[data-section-id="text"] .ParaSelectMenu[aria-label="Size options"]',
    ) as HTMLDivElement | null

    expect(sizeMenu).not.toBeNull()
    expect(sizeMenu?.textContent).toContain('Small')
    expect(sizeMenu?.textContent).toContain('Normal')
    expect(sizeMenu?.textContent).toContain('Large')
  })

  it('resets the window appearance controls back to defaults', async () => {
    const handleWindowAppearanceChange = vi.fn()
    const handleResetWindowAppearance = vi.fn()
    const handleToggleClampEditing = vi.fn()
    const customAppearance = {
      ...defaultSpaghettiWindowAppearance,
      titlebarOpacity: 0.75,
      windowOpacity: 0.65,
      graphContentOpacity: 0.7,
      titlebarTint: 'red' as const,
      bodyTint: 'glass-dark' as const,
      fontScale: 'lg' as const,
      fontFamily: 'mono' as const,
      paddingScale: 'loose' as const,
    }

    const settingsContainer = document.createElement('div')
    document.body.appendChild(settingsContainer)
    root = createRoot(settingsContainer)

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isWindowSettingsOpen
          windowAppearance={customAppearance}
          onWindowAppearanceChange={handleWindowAppearanceChange}
          onToggleClampEditing={handleToggleClampEditing}
          onResetWindowAppearance={handleResetWindowAppearance}
        />,
      )
    })

    container = settingsContainer

    const sliders = Array.from(
      container.querySelectorAll('.ParaSliderTrack[role="slider"]'),
    ) as HTMLDivElement[]
    const settingsSection = container.querySelector(
      '.SpaghettiWindowSettingsSection',
    ) as HTMLDivElement | null
    const selectTracks = Array.from(
      settingsSection?.querySelectorAll('.ParaSelectNative') ?? [],
    ) as HTMLSelectElement[]
    const settingGroups = Array.from(
      container.querySelectorAll('.SpaghettiWindowSettingsGroup'),
    ) as HTMLDivElement[]
    const incrementButtons = Array.from(
      container.querySelectorAll('button[aria-label^="Increase "]'),
    ) as HTMLButtonElement[]
    const editClampButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Edit Clamp'),
    ) as HTMLButtonElement | undefined
    const nextFontTypeButton = container.querySelector(
      'button[aria-label="Next Type"]',
    ) as HTMLButtonElement | null
    const resetButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Reset Window Style'),
    ) as HTMLButtonElement | undefined

    expect(container.textContent).toContain('Title bar')
    expect(container.textContent).toContain('Body')
    expect(container.textContent).toContain('Text')
    expect(container.textContent).toContain('Opacity')
    expect(container.textContent).toContain('Color')
    expect(container.textContent).toContain('Side Padding')
    expect(container.textContent).toContain('Top Bottom Padding')
    expect(container.textContent).toContain('Size')
    expect(container.textContent).toContain('Type')
    expect(container.textContent).toContain('Padding')
    expect(settingGroups).toHaveLength(3)
    expect(sliders).toHaveLength(5)
    expect(selectTracks).toHaveLength(5)
    expect(sliders[0]?.getAttribute('aria-valuetext')).toBe('75%')
    expect(sliders[1]?.getAttribute('aria-valuetext')).toBe('65%')
    expect(sliders[2]?.getAttribute('aria-valuetext')).toBe('0px')
    expect(sliders[3]?.getAttribute('aria-valuetext')).toBe('0px')
    expect(sliders[4]?.getAttribute('aria-valuetext')).toBe('70%')
    expect(incrementButtons).toHaveLength(5)
    expect(editClampButton).not.toBeUndefined()
    expect(nextFontTypeButton).not.toBeNull()
    expect(resetButton).not.toBeUndefined()

    await act(async () => {
      incrementButtons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(handleWindowAppearanceChange).toHaveBeenCalledWith({ titlebarOpacity: 0.8 })

    await act(async () => {
      nextFontTypeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(handleWindowAppearanceChange).toHaveBeenCalledWith({ fontFamily: 'serif' })

    await act(async () => {
      editClampButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(handleToggleClampEditing).toHaveBeenCalledTimes(1)

    await act(async () => {
      resetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(handleResetWindowAppearance).toHaveBeenCalledTimes(1)
  })

  it('keeps a retained header band when the panel header is collapsed', async () => {
    const collapsedContainer = document.createElement('div')
    document.body.appendChild(collapsedContainer)
    root = createRoot(collapsedContainer)

    await act(async () => {
      root?.render(<SpaghettiPanel editorViewportId="editor-viewport-1" isHeaderCollapsed />)
    })

    container = collapsedContainer

    const headerBlock = container.querySelector('.SpaghettiPanelHeaderBlock') as HTMLDivElement | null
    const headerScroll = container.querySelector('.SpaghettiPanelHeaderScroll') as HTMLDivElement | null
    const graphRow = container.querySelector('.SpaghettiGraphDocumentRow') as HTMLDivElement | null
    expect(headerBlock).not.toBeNull()
    expect(headerBlock?.className).toContain('isCollapsed')
    expect(headerScroll?.className).toContain('isCollapsed')
    expect(graphRow).toBeNull()
  })

  it('restores the toolbar body to the default 150px height after an i-button style reopen', async () => {
    const toggleContainer = document.createElement('div')
    document.body.appendChild(toggleContainer)
    root = createRoot(toggleContainer)

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isHeaderCollapsed
          headerToggleRevision={1}
        />,
      )
    })

    await act(async () => {
      root?.render(
        <SpaghettiPanel
          editorViewportId="editor-viewport-1"
          isHeaderCollapsed={false}
          headerToggleRevision={2}
        />,
      )
    })

    container = toggleContainer

    const headerBlock = container.querySelector('.SpaghettiPanelHeaderBlock') as HTMLDivElement | null
    expect(headerBlock?.style.height).toBe('150px')
  })

  it('hides panel chrome and forwards essentials mode into the editor canvas', async () => {
    const essentialsContainer = document.createElement('div')
    document.body.appendChild(essentialsContainer)
    root = createRoot(essentialsContainer)

    await act(async () => {
      root?.render(<SpaghettiPanel editorViewportId="editor-viewport-1" isEssentials />)
    })

    container = essentialsContainer

    expect(container.querySelector('.SpaghettiPanelHeaderShell')).toBeNull()
    expect(container.querySelector('.SpaghettiCanvasResizeBar')).toBeNull()
    expect(container.textContent).toContain('Spaghetti Editor Canvas essentials node-1 no-fit 0')
    expect(container.querySelector('.SpaghettiPanelRoot')?.className).toContain('isEssentials')
    expect(container.querySelector('.SpaghettiPanelCanvasWrap')?.className).toContain('isEssentials')
    expect(container.textContent).not.toContain('Focus Node')
    expect(container.textContent).not.toContain('Part Nodes')
  })
})
