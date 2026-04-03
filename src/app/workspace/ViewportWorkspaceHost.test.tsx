// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
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
})
