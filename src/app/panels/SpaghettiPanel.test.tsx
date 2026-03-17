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
      setActiveEditorViewportId: vi.fn(),
      bindEditorViewportToGraphDocument: vi.fn(),
      addEditorViewportGraphToSharedViewerComposition: vi.fn(),
      removeEditorViewportGraphFromSharedViewerComposition: vi.fn(),
      saveFocusedEditorViewportGraphToFile: vi.fn(async () => {}),
      setSelectedNodeId: vi.fn(),
      setUiMessage: vi.fn(),
    }

    currentAppState = {
      buildPolicy: 'manual',
      setSpaghettiGraph: vi.fn(),
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

  it('cycles the focus node forward from the row buttons', async () => {
    ;({ container, root } = await renderSpaghettiPanel())

    const nextButton = container?.querySelector(
      'button[aria-label="Focus next node"]',
    ) as HTMLButtonElement | null
    const select = container?.querySelector('.SpaghettiEditorFocusField select') as HTMLSelectElement | null

    expect(nextButton).not.toBeNull()
    expect(select?.value).toBe('node-1')

    await act(async () => {
      nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(select?.value).toBe('node-2')
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
    const selectTracks = Array.from(
      container.querySelectorAll('.ParaSelectNative'),
    ) as HTMLSelectElement[]
    const incrementButtons = Array.from(
      container.querySelectorAll('button[aria-label^="Increase "]'),
    ) as HTMLButtonElement[]
    const editClampButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Edit Clamp'),
    ) as HTMLButtonElement | undefined
    const nextFontTypeButton = container.querySelector(
      'button[aria-label="Next Font Type"]',
    ) as HTMLButtonElement | null
    const resetButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Reset Window Style'),
    ) as HTMLButtonElement | undefined

    expect(container.textContent).toContain('Window Fill')
    expect(container.textContent).toContain('Graph Content')
    expect(container.textContent).toContain('Title Bar')
    expect(container.textContent).toContain('Title Bar Color')
    expect(container.textContent).toContain('Body Color')
    expect(container.textContent).toContain('Font Size')
    expect(container.textContent).toContain('Font Type')
    expect(container.textContent).toContain('Padding')
    expect(sliders).toHaveLength(3)
    expect(selectTracks).toHaveLength(5)
    expect(sliders[0]?.getAttribute('aria-valuetext')).toBe('75%')
    expect(sliders[1]?.getAttribute('aria-valuetext')).toBe('65%')
    expect(sliders[2]?.getAttribute('aria-valuetext')).toBe('70%')
    expect(incrementButtons).toHaveLength(3)
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
})
