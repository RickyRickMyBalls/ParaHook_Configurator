// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useViewerCameraShortcuts } from './useViewerCameraShortcuts'
import { useConsoleStore } from './console/useConsoleStore'
import { useAppStore } from './store/useAppStore'
import { useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { setViewer } from './viewerBridge'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const {
  setCameraPresetCommandMock,
} = vi.hoisted(() => ({
  setCameraPresetCommandMock: vi.fn(),
}))

vi.mock('./viewCommands', () => ({
  setCameraPresetCommand: setCameraPresetCommandMock,
}))

function ShortcutHarness({ viewportId }: { viewportId: string }) {
  useViewerCameraShortcuts(viewportId)
  return null
}

describe('useViewerCameraShortcuts', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  const viewportId = 'model-viewer-primary'

  const renderHarness = () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    act(() => {
      root?.render(<ShortcutHarness viewportId={viewportId} />)
    })
  }

  beforeEach(() => {
    setCameraPresetCommandMock.mockReset()
    useAppStore.setState(useAppStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    setViewer(viewportId, null)
  })

  afterEach(() => {
    act(() => {
      root?.unmount()
    })
    root = null
    container?.remove()
    container = null
    setViewer(viewportId, null)
  })

  it('routes numpad view shortcuts through the shared camera preset command seam for the active viewer', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => false,
    } as any)
    useAppStore.setState((state) => ({
      ...state,
      workspaceSelection: {
        ...state.workspaceSelection,
        activeSurface: 'viewer',
      },
    }))
    useWorkspaceStore.setState((state) => ({
      ...state,
      activeViewerViewportId: viewportId,
    }))

    renderHarness()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '5',
          code: 'Numpad5',
          bubbles: true,
          cancelable: true,
        }),
      )
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '8',
          code: 'Numpad8',
          bubbles: true,
          cancelable: true,
        }),
      )
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '6',
          code: 'Numpad6',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(setCameraPresetCommandMock).toHaveBeenNthCalledWith(1, 'top', viewportId)
    expect(setCameraPresetCommandMock).toHaveBeenNthCalledWith(2, 'back', viewportId)
    expect(setCameraPresetCommandMock).toHaveBeenNthCalledWith(3, 'right', viewportId)
  })

  it('does not fire shortcuts when this viewport is not the active viewer surface', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => false,
    } as any)
    useWorkspaceStore.setState((state) => ({
      ...state,
      activeViewerViewportId: 'model-viewer-secondary',
    }))

    renderHarness()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '4',
          code: 'Numpad4',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
  })

  it('keeps camera shortcuts dormant while fly mode is active', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => true,
    } as any)
    useAppStore.setState((state) => ({
      ...state,
      workspaceSelection: {
        ...state.workspaceSelection,
        activeSurface: 'viewer',
      },
    }))
    useWorkspaceStore.setState((state) => ({
      ...state,
      activeViewerViewportId: viewportId,
    }))

    renderHarness()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '2',
          code: 'Numpad2',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
  })
})
