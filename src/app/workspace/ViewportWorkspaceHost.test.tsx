// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../panels/SpaghettiPanel', () => ({
  SpaghettiPanel: ({
    editorViewportId,
    isEssentials,
    isHeaderCollapsed,
    isCanvasToolbarVisible,
  }: {
    editorViewportId: string
    isEssentials?: boolean
    isHeaderCollapsed?: boolean
    isCanvasToolbarVisible?: boolean
  }) => (
    <div
      className="MockSpaghettiPanel"
      data-editor-viewport-id={editorViewportId}
      data-is-essentials={isEssentials ? 'true' : 'false'}
      data-header-collapsed={isHeaderCollapsed ? 'true' : 'false'}
      data-canvas-toolbar-visible={isCanvasToolbarVisible ? 'true' : 'false'}
    />
  ),
}))

vi.mock('../components/ViewerHost', () => ({
  ViewerHost: ({ viewportId }: { viewportId: string }) => (
    <div className="ViewerHostMock" data-workspace-viewport-id={viewportId} />
  ),
}))

vi.mock('../components/ViewportOverlay', () => ({
  ViewportOverlay: ({ viewportId }: { viewportId: string }) => (
    <div className="ViewportOverlayMock" data-workspace-viewport-id={viewportId} />
  ),
}))

vi.mock('../components/ViewToolbar', () => ({
  ViewToolbar: ({ viewportId }: { viewportId: string }) => (
    <div className="ViewToolbarMock" data-workspace-viewport-id={viewportId} />
  ),
}))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('ViewportWorkspaceHost', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    const { useWorkspaceStore } = await import('./useWorkspaceStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
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

  it('does not write a shared axis-widget size onto the viewport host shell', async () => {
    const { ViewportWorkspaceHost } = await import('./ViewportWorkspaceHost')
    const { useWorkspaceStore } = await import('./useWorkspaceStore')

    act(() => {
      useWorkspaceStore.getState().ensureViewportChrome('model-viewer-primary')
      useWorkspaceStore.getState().ensureViewportChrome('model-viewer-secondary')
      useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
        viewToolbarOpen: true,
        viewToolbarExpandedAxisWidgetSize: 308,
      })
      useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-secondary', {
        viewToolbarOpen: false,
        viewToolbarExpandedAxisWidgetSize: null,
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <>
          <ViewportWorkspaceHost
            viewportId="model-viewer-primary"
            onActivateViewerSurface={() => {}}
          />
          <ViewportWorkspaceHost
            viewportId="model-viewer-secondary"
            onActivateViewerSurface={() => {}}
          />
        </>,
      )
    })

    const hosts = Array.from(
      container.querySelectorAll('.ViewportWorkspaceHost'),
    ) as HTMLDivElement[]
    expect(hosts).toHaveLength(2)
    expect(hosts[0]?.style.getPropertyValue('--v15-axis-widget-size')).toBe('')
    expect(hosts[1]?.style.getPropertyValue('--v15-axis-widget-size')).toBe('')
  })

  it('marks only opted-in hosts for bottom console-bar reserve', async () => {
    const { ViewportWorkspaceHost } = await import('./ViewportWorkspaceHost')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <>
          <ViewportWorkspaceHost
            viewportId="model-viewer-primary"
            onActivateViewerSurface={() => {}}
            reserveBottomConsoleBar
          />
          <ViewportWorkspaceHost
            viewportId="model-viewer-secondary"
            onActivateViewerSurface={() => {}}
          />
        </>,
      )
    })

    const primaryHost = container?.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLDivElement | null
    const secondaryHost = container?.querySelector(
      '.ViewportWorkspaceHost[data-workspace-viewport-id="model-viewer-secondary"]',
    ) as HTMLDivElement | null

    expect(primaryHost?.dataset.bottomConsoleBarReserved).toBe('true')
    expect(secondaryHost?.dataset.bottomConsoleBarReserved).toBe('false')
    expect(primaryHost?.querySelector('[data-build-path-viewport-dock="bottom"]')).not.toBeNull()
  })

  it('mounts the active overlay editor inside the active viewport host only', async () => {
    const { ViewportWorkspaceHost } = await import('./ViewportWorkspaceHost')
    const { useWorkspaceStore } = await import('./useWorkspaceStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useWorkspaceStore.getState().setActiveViewerViewportId('model-viewer-secondary')
      useSpaghettiStore.setState((state) => ({
        ...state,
        activeEditorViewportId: 'editor-viewport-1',
        editorViewportsById: {
          ...state.editorViewportsById,
          'editor-viewport-1': {
            ...state.editorViewportsById['editor-viewport-1'],
            editorViewportId: 'editor-viewport-1',
            graphDocumentId: 'graph-document-1',
          },
        },
        editorViewportOverlayModeById: {
          ...state.editorViewportOverlayModeById,
          'editor-viewport-1': true,
        },
        editorViewportOverlayCanvasHiddenById: {
          ...state.editorViewportOverlayCanvasHiddenById,
          'editor-viewport-1': false,
        },
        editorViewportOverlayBackgroundOpacityById: {
          ...state.editorViewportOverlayBackgroundOpacityById,
          'editor-viewport-1': 0.35,
        },
        editorViewportHeaderCollapsedById: {
          ...state.editorViewportHeaderCollapsedById,
          'editor-viewport-1': true,
        },
        editorViewportCanvasToolbarVisibleById: {
          ...state.editorViewportCanvasToolbarVisibleById,
          'editor-viewport-1': false,
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <>
          <ViewportWorkspaceHost
            viewportId="model-viewer-primary"
            onActivateViewerSurface={() => {}}
          />
          <ViewportWorkspaceHost
            viewportId="model-viewer-secondary"
            onActivateViewerSurface={() => {}}
          />
        </>,
      )
    })

    const primaryOverlay = container?.querySelector(
      '.ViewportSpaghettiOverlayRoot[data-workspace-viewport-id="model-viewer-primary"]',
    ) as HTMLDivElement | null
    const secondaryOverlay = container?.querySelector(
      '.ViewportSpaghettiOverlayRoot[data-workspace-viewport-id="model-viewer-secondary"]',
    ) as HTMLDivElement | null
    const overlayPanel = secondaryOverlay?.querySelector(
      '.MockSpaghettiPanel[data-editor-viewport-id="editor-viewport-1"]',
    ) as HTMLDivElement | null
    const overlayShell = secondaryOverlay?.querySelector(
      '.ViewportSpaghettiOverlayPanel',
    ) as HTMLDivElement | null

    expect(primaryOverlay).toBeNull()
    expect(secondaryOverlay).not.toBeNull()
    expect(overlayShell?.dataset.overlayBackgroundOpacity).toBe('0.35')
    expect(overlayPanel?.dataset.isEssentials).toBe('true')
    expect(overlayPanel?.dataset.headerCollapsed).toBe('true')
    expect(overlayPanel?.dataset.canvasToolbarVisible).toBe('false')
  })

  it('hides the overlay panel when the overlay canvas is temporarily turned off', async () => {
    const { ViewportWorkspaceHost } = await import('./ViewportWorkspaceHost')
    const { useWorkspaceStore } = await import('./useWorkspaceStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useWorkspaceStore.getState().setActiveViewerViewportId('model-viewer-primary')
      useSpaghettiStore.setState((state) => ({
        ...state,
        activeEditorViewportId: 'editor-viewport-1',
        editorViewportsById: {
          ...state.editorViewportsById,
          'editor-viewport-1': {
            ...state.editorViewportsById['editor-viewport-1'],
            editorViewportId: 'editor-viewport-1',
            graphDocumentId: 'graph-document-1',
          },
        },
        editorViewportOverlayModeById: {
          ...state.editorViewportOverlayModeById,
          'editor-viewport-1': true,
        },
        editorViewportOverlayCanvasHiddenById: {
          ...state.editorViewportOverlayCanvasHiddenById,
          'editor-viewport-1': true,
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ViewportWorkspaceHost
          viewportId="model-viewer-primary"
          onActivateViewerSurface={() => {}}
        />,
      )
    })

    const overlayRoot = container?.querySelector(
      '.ViewportSpaghettiOverlayRoot[data-workspace-viewport-id="model-viewer-primary"]',
    )
    const overlayPanel = container?.querySelector('.MockSpaghettiPanel')

    expect(overlayRoot).toBeNull()
    expect(overlayPanel).toBeNull()
  })
})
