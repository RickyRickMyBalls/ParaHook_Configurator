// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConsoleStore } from './console/useConsoleStore'
import { resetAudioSamplerStore } from './store/audioSamplerStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

class MockWorker {
  public addEventListener(): void {}
  public removeEventListener(): void {}
  public postMessage(): void {}
  public terminate(): void {}
}

vi.mock('./components/TitleStatusBar', () => ({
  TitleStatusBar: () => <div>Title Status</div>,
}))

vi.mock('./components/ViewToolbar', () => ({
  ViewToolbar: () => <div>View Toolbar</div>,
}))

vi.mock('./components/ViewerHost', () => ({
  ViewerHost: () => <div>Viewer Host</div>,
}))

vi.mock('./components/ViewportOverlay', () => ({
  ViewportOverlay: () => <div>Viewport Overlay</div>,
}))

vi.mock('./workspace/ViewportWorkspaceHost', () => ({
  ViewportWorkspaceHost: ({
    viewportId,
    onActivateViewerSurface,
  }: {
    viewportId: string
    onActivateViewerSurface: (viewportId: string) => void
  }) => (
    <div
      className="ViewportWorkspaceHost"
      data-workspace-viewport-id={viewportId}
      onPointerDownCapture={() => onActivateViewerSurface(viewportId)}
    >
      <div className="ViewportViewerSurface" data-workspace-viewport-id={viewportId}>
        Viewer Host
      </div>
      <div className="ViewportOverlayRoot" data-workspace-viewport-id={viewportId}>
        Viewport Overlay
      </div>
      <div className="RightDock" data-workspace-viewport-id={viewportId}>
        View Toolbar
      </div>
    </div>
  ),
}))

vi.mock('./panels/BrowserPanel', () => ({
  BrowserPanel: () => <div>Browser Panel</div>,
}))

vi.mock('./panels/SpaghettiPanel', () => ({
  SpaghettiPanel: ({ editorViewportId }: { editorViewportId: string }) => (
    <div className="MockSpaghettiPanel" data-editor-viewport-id={editorViewportId}>
      {`Spaghetti Panel ${editorViewportId}`}
    </div>
  ),
}))

vi.mock('./hosts/BrowserDockHost', () => ({
  BrowserDockHost: () => null,
}))

vi.mock('./hosts/SpaghettiWindowHost', () => ({
  SpaghettiWindowHost: () => null,
}))

vi.mock('./hosts/RadioRuntimeHost', () => ({
  RadioRuntimeHost: () => null,
}))

vi.mock('./panels/RadioPanel', () => ({
  RadioPanel: () => null,
}))

describe('AppShell split spaghetti console live focus reproduction', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalWorker = globalThis.Worker
  let AppShell: typeof import('./AppShell').AppShell
  let useAppStore: typeof import('./store/useAppStore').useAppStore
  let useWorkspaceStore: typeof import('./workspace/useWorkspaceStore').useWorkspaceStore
  let useSpaghettiStore: typeof import('./spaghetti/store/useSpaghettiStore').useSpaghettiStore
  let setViewer: typeof import('./viewerBridge').setViewer

  beforeEach(async () => {
    resetAudioSamplerStore()
    window.localStorage.clear()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ useAppStore } = await import('./store/useAppStore'))
    ;({ useWorkspaceStore } = await import('./workspace/useWorkspaceStore'))
    ;({ useSpaghettiStore } = await import('./spaghetti/store/useSpaghettiStore'))
    ;({ setViewer } = await import('./viewerBridge'))
    ;({ AppShell } = await import('./AppShell'))
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    setViewer(null)
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
    globalThis.Worker = originalWorker
    setViewer(null)
  })

  it.fails(
    'keeps the real docked console in the split spaghetti graph on repeated split-host clicks',
    async () => {
      const secondGraphDocumentId = useSpaghettiStore.getState().createGraphDocument(undefined, 'Graph 2')
      const secondEditorViewportId =
        useSpaghettiStore.getState().openGraphDocumentInNewViewport(secondGraphDocumentId)

      expect(secondEditorViewportId).not.toBeNull()

      container = document.createElement('div')
      document.body.appendChild(container)
      root = createRoot(container)

      await act(async () => {
        root?.render(<AppShell />)
      })

      await act(async () => {
        useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
          surfaceKind: 'spaghettiEditor',
          surfaceInstanceId: secondEditorViewportId!,
        })
        root?.render(<AppShell />)
      })

      const splitSpaghettiSurface = container.querySelector(
        `.WorkspaceViewportSlotSurface--spaghetti[data-workspace-surface-instance-id="${secondEditorViewportId}"]`,
      ) as HTMLDivElement | null
      const splitSpaghettiHeader = splitSpaghettiSurface?.closest('.ViewportFrame')?.querySelector(
        '.ViewportFrameHeader',
      ) as HTMLDivElement | null

      expect(splitSpaghettiSurface).not.toBeNull()
      expect(splitSpaghettiHeader).not.toBeNull()

      await act(async () => {
        useAppStore.getState().setActiveSurface('viewer')
        useAppStore.getState().requestConsoleWorkspaceContextHandoff({
          sourceSurface: 'viewer',
          mode: 'root',
          graphDocumentId: null,
          nodeId: null,
          editorViewportId: null,
          selectedTarget: useAppStore.getState().workspaceSelection.selectedTarget,
        })
      })

      expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
      expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('Root > Choose next')

      await act(async () => {
        splitSpaghettiHeader?.dispatchEvent(
          new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
        )
      })

      expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
      expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
        'Root > Graph Documents > Graph 2 > Choose next',
      )
      expect(
        useConsoleStore.getState().entries.some((entry) => entry.text === 'Selected target: graph_[2]'),
      ).toBe(true)

      await act(async () => {
        splitSpaghettiHeader?.dispatchEvent(
          new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
        )
      })

      expect(useAppStore.getState().workspaceSelection.activeSurface).toBe('spaghetti')
      expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
        kind: 'graph-document',
        graphDocumentId: secondGraphDocumentId,
      })
      expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
      expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
        'Root > Graph Documents > Graph 2 > Choose next',
      )
      expect(
        useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
      ).toBe(false)
    },
  )
})
