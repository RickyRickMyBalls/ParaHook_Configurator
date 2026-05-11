// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useViewerCameraShortcuts } from './useViewerCameraShortcuts'
import { useConsoleStore } from './console/useConsoleStore'
import { useAppStore } from './store/useAppStore'
import { editHistoryStore } from './store/editHistoryStore'
import { useUiPrefsStore } from './store/uiPrefsStore'
import { useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { setViewer } from './viewerBridge'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const {
  frameEnvironmentLightCommandMock,
  setCameraPresetCommandMock,
  frameReferenceCommandMock,
  frameSelectedCommandMock,
  frameSelectionSetCommandMock,
} = vi.hoisted(() => ({
  frameEnvironmentLightCommandMock: vi.fn(),
  setCameraPresetCommandMock: vi.fn(),
  frameReferenceCommandMock: vi.fn(),
  frameSelectedCommandMock: vi.fn(),
  frameSelectionSetCommandMock: vi.fn(),
}))

vi.mock('./viewCommands', () => ({
  frameEnvironmentLightCommand: frameEnvironmentLightCommandMock,
  frameReferenceCommand: frameReferenceCommandMock,
  frameSelectedCommand: frameSelectedCommandMock,
  frameSelectionSetCommand: frameSelectionSetCommandMock,
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
    frameEnvironmentLightCommandMock.mockReset()
    frameReferenceCommandMock.mockReset()
    frameSelectedCommandMock.mockReset()
    frameSelectionSetCommandMock.mockReset()
    useAppStore.setState(useAppStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    editHistoryStore.clear()
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
    useUiPrefsStore.getState().setCameraShortcutTransitionDurationMs(480)
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

    expect(setCameraPresetCommandMock).toHaveBeenNthCalledWith(1, 'top', viewportId, {
      animate: true,
      durationMs: 480,
    })
    expect(setCameraPresetCommandMock).toHaveBeenNthCalledWith(2, 'back', viewportId, {
      animate: true,
      durationMs: 480,
    })
    expect(setCameraPresetCommandMock).toHaveBeenNthCalledWith(3, 'right', viewportId, {
      animate: true,
      durationMs: 480,
    })
    expect(frameSelectedCommandMock).not.toHaveBeenCalled()
    expect(frameReferenceCommandMock).not.toHaveBeenCalled()
  })

  it('routes Ctrl+Z through edit history before active viewer camera shortcuts', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => false,
    } as any)
    useAppStore.setState((state) => ({
      ...state,
      selectedPartKey: 'part:object-1',
      workspaceSelection: {
        ...state.workspaceSelection,
        activeSurface: 'viewer',
      },
    }))
    useWorkspaceStore.setState((state) => ({
      ...state,
      activeViewerViewportId: viewportId,
    }))
    const undo = vi.fn()
    const redo = vi.fn()
    editHistoryStore.commitEntry({
      entryId: 'viewer-shortcut-undo-entry',
      label: 'Draw sketch rectangle',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'geometry-sketch-draw',
        sourceLabel: 'Sketch Draw',
      },
      undo,
      redo,
    })

    renderHarness()

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      code: 'KeyZ',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      window.dispatchEvent(event)
    })

    expect(undo).toHaveBeenCalledTimes(1)
    expect(redo).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(true)
    expect(editHistoryStore.getRedoEntries()).toHaveLength(1)
    expect(frameSelectedCommandMock).not.toHaveBeenCalled()
    expect(frameReferenceCommandMock).not.toHaveBeenCalled()
    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
  })

  it('routes Shift+Z through the shared selected-part framing seam for the active viewer', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => false,
    } as any)
    useUiPrefsStore.getState().setCameraShortcutTransitionDurationMs(510)
    useAppStore.setState((state) => ({
      ...state,
      selectedPartKey: 'part:object-1',
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
          key: 'Z',
          code: 'KeyZ',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(frameSelectedCommandMock).toHaveBeenCalledWith('part:object-1', viewportId, {
      animate: true,
      durationMs: 510,
    })
    expect(frameReferenceCommandMock).not.toHaveBeenCalled()
    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
  })

  it('routes plain Z through the selected-part framing seam when Console input priority is Shortcuts first', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => false,
    } as any)
    useUiPrefsStore.getState().setConsoleInputPriorityMode('shortcuts-first')
    useUiPrefsStore.getState().setCameraShortcutTransitionDurationMs(505)
    useAppStore.setState((state) => ({
      ...state,
      selectedPartKey: 'part:object-1',
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
          key: 'z',
          code: 'KeyZ',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(frameSelectedCommandMock).toHaveBeenCalledWith('part:object-1', viewportId, {
      animate: true,
      durationMs: 505,
    })
    expect(frameReferenceCommandMock).not.toHaveBeenCalled()
    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
  })

  it('routes Shift+Z through the shared selected-reference framing seam when no part target exists', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => false,
    } as any)
    useUiPrefsStore.getState().setCameraShortcutTransitionDurationMs(275)
    useAppStore.setState((state) => ({
      ...state,
      selectedPartKey: null,
      workspaceSelection: {
        ...state.workspaceSelection,
        activeSurface: 'viewer',
      },
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeReferenceTransformSession: {
          referenceId: 'shoe:shoe-1',
          sessionId: 'session-1',
          sessionOrdinal: 1,
          mode: 'translate',
          space: 'world',
          shellActive: false,
          entryActive: false,
          activeHandle: null,
          draftTransform: {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          entryOrigin: null,
        },
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
          key: 'Z',
          code: 'KeyZ',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(frameReferenceCommandMock).toHaveBeenCalledWith('shoe:shoe-1', viewportId, {
      animate: true,
      durationMs: 275,
    })
    expect(frameSelectedCommandMock).not.toHaveBeenCalled()
    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
  })

  it('routes Shift+Z through the shared environment-light framing seam', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => false,
    } as any)
    useUiPrefsStore.getState().setCameraShortcutTransitionDurationMs(410)
    useAppStore.setState((state) => ({
      ...state,
      selectedPartKey: null,
      workspaceSelection: {
        ...state.workspaceSelection,
        activeSurface: 'viewer',
        selectedTarget: {
          kind: 'environment-light',
          lightId: 'light-key',
        },
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
          key: 'Z',
          code: 'KeyZ',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(frameEnvironmentLightCommandMock).toHaveBeenCalledWith('light-key', viewportId, {
      animate: true,
      durationMs: 410,
    })
    expect(frameSelectedCommandMock).not.toHaveBeenCalled()
    expect(frameReferenceCommandMock).not.toHaveBeenCalled()
    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
  })

  it('keeps Shift+Z quiet when no zoom target exists', () => {
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
          key: 'Z',
          code: 'KeyZ',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(frameSelectedCommandMock).not.toHaveBeenCalled()
    expect(frameReferenceCommandMock).not.toHaveBeenCalled()
    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
  })

  it('keeps the removed numpad decimal shortcut dormant', () => {
    setViewer(viewportId, {
      isFlyModeActive: () => false,
    } as any)
    useAppStore.setState((state) => ({
      ...state,
      selectedPartKey: 'part:object-1',
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
          key: '.',
          code: 'NumpadDecimal',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(frameSelectedCommandMock).not.toHaveBeenCalled()
    expect(frameReferenceCommandMock).not.toHaveBeenCalled()
    expect(setCameraPresetCommandMock).not.toHaveBeenCalled()
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
