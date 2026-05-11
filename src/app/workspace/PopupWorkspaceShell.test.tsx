// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PopupWorkspaceShell } from './PopupWorkspaceShell'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'

vi.mock('../panels/BrowserPanel', () => ({
  BrowserPanel: () => <div className="BrowserPanelMock">Browser Panel</div>,
}))

vi.mock('../console/ConsoleBar', () => ({
  ConsoleBar: () => <div className="ConsoleBarMock">Console Bar</div>,
}))

vi.mock('../console/ConsolePanel', () => ({
  ConsolePanel: () => <div className="ConsolePanelMock">Console Panel</div>,
}))

vi.mock('../panels/SpaghettiPanel', () => ({
  SpaghettiPanel: ({ editorViewportId }: { editorViewportId: string }) => (
    <div className="SpaghettiPanelMock" data-editor-viewport-id={editorViewportId}>
      Spaghetti Panel
    </div>
  ),
}))

vi.mock('./ViewportWorkspaceHost', () => ({
  ViewportWorkspaceHost: ({ viewportId }: { viewportId: string }) => (
    <div className="ViewportWorkspaceHostMock" data-workspace-viewport-id={viewportId} />
  ),
}))

vi.mock('./ViewportOverlayModeTitlebarControls', () => ({
  ViewportOverlayModeTitlebarControls: ({ viewportId }: { viewportId: string }) => (
    <div className="ViewportOverlayModeTitlebarControlsMock" data-workspace-viewport-id={viewportId} />
  ),
}))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('PopupWorkspaceShell', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
    document.body.innerHTML = ''
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
  })

  const renderPopupShell = async (props?: Partial<Parameters<typeof PopupWorkspaceShell>[0]>) => {
    const onCollapseToRootSurface = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <PopupWorkspaceShell
          popupWorkspaceId="popup-workspace-test"
          rootSurfaceKind="browser"
          rootSurfaceInstanceId="browser-popup-root"
          initialSplitDockSide="right"
          onActivateSpaghettiSurface={() => {}}
          onActivateViewerSurface={() => {}}
          onCreatePopupSpaghettiViewport={() => null}
          onClosePopupSpaghettiViewport={() => {}}
          onCollapseToRootSurface={onCollapseToRootSurface}
          {...props}
        />,
      )
    })

    return { onCollapseToRootSurface }
  }

  it('keeps the popup root close route protected while showing inline close on secondary split panes', async () => {
    await renderPopupShell()

    const rootFrame = container?.querySelector(
      '.ViewportFrame[data-workspace-slot-id="popup-workspace-test-slot-1"]',
    ) as HTMLDivElement | null
    const secondaryFrame = container?.querySelector(
      '.ViewportFrame[data-workspace-slot-id="popup-workspace-test-slot-2"]',
    ) as HTMLDivElement | null

    expect(rootFrame).not.toBeNull()
    expect(secondaryFrame).not.toBeNull()
    expect(rootFrame?.querySelector('.ViewportFrameInlineCloseButton')).toBeNull()
    expect(secondaryFrame?.querySelector('.ViewportFrameInlineCloseButton')).not.toBeNull()

    await act(async () => {
      rootFrame
        ?.querySelector('.ViewportFrameHeader')
        ?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const rootCloseMenuButton = Array.from(
      rootFrame?.querySelectorAll('.ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Close') as HTMLButtonElement | undefined

    expect(rootCloseMenuButton).toBeDefined()
    expect(rootCloseMenuButton?.disabled).toBe(true)
  })

  it('closes a popup-local secondary split pane through the shared inline close button', async () => {
    const { onCollapseToRootSurface } = await renderPopupShell()

    const secondaryFrame = container?.querySelector(
      '.ViewportFrame[data-workspace-slot-id="popup-workspace-test-slot-2"]',
    ) as HTMLDivElement | null
    const closeButton = secondaryFrame?.querySelector(
      '.ViewportFrameInlineCloseButton',
    ) as HTMLButtonElement | null

    expect(closeButton).not.toBeNull()

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(
      container?.querySelector('.ViewportFrame[data-workspace-slot-id="popup-workspace-test-slot-2"]'),
    ).toBeNull()
    expect(
      container?.querySelector('.ViewportFrame[data-workspace-slot-id="popup-workspace-test-slot-1"]'),
    ).not.toBeNull()
    expect(onCollapseToRootSurface).toHaveBeenCalledTimes(1)
  })
})
