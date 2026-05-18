// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { ViewDisplayMode, ViewEdgeDisplayMode } from '../shared/viewSettingsTypes'
import { useViewerDisplayModeMenu } from './useViewerDisplayModeMenu'
import { useAppStore } from './store/useAppStore'
import { useUiPrefsStore } from './store/uiPrefsStore'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import { setViewer } from './viewerBridge'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const displayModeOptions: ViewDisplayMode[] = [
  'solid',
  'wireframe',
  'material',
  'rendered',
  'renderPreview',
]
const edgeDisplayModeOptions: ViewEdgeDisplayMode[] = ['on', 'off', 'visibleEdgesOnly']

function DisplayModeMenuHarness({ viewportId }: { viewportId: string }) {
  const menu = useViewerDisplayModeMenu(viewportId)

  return menu.isOpen ? (
    <div role="menu" aria-label="Display mode">
      {displayModeOptions.map((mode) => (
        <button key={mode} type="button" onClick={() => menu.selectDisplayMode(mode)}>
          {mode}
        </button>
      ))}
      {edgeDisplayModeOptions.map((mode) => (
        <button key={mode} type="button" onClick={() => menu.selectEdgeDisplayMode(mode)}>
          {mode}
        </button>
      ))}
      <button type="button" onClick={menu.close}>
        Close
      </button>
    </div>
  ) : null
}

describe('useViewerDisplayModeMenu', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  const viewportId = 'model-viewer-primary'

  const renderHarness = () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    act(() => {
      root?.render(<DisplayModeMenuHarness viewportId={viewportId} />)
    })
  }

  const makeActiveViewerShortcutOwner = (options?: { flyActive?: boolean }) => {
    setViewer(viewportId, {
      isFlyModeActive: () => options?.flyActive === true,
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
  }

  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState(), true)
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
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

  it('opens the display mode menu for Shift+D in the active viewer shortcut context', () => {
    makeActiveViewerShortcutOwner()
    renderHarness()

    const event = new KeyboardEvent('keydown', {
      key: 'D',
      code: 'KeyD',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      window.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(true)
    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).not.toBeNull()
  })

  it('does not open while an editable field owns the event target', () => {
    makeActiveViewerShortcutOwner()
    renderHarness()
    const input = document.createElement('input')
    document.body.appendChild(input)

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'D',
          code: 'KeyD',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).toBeNull()
    input.remove()
  })

  it('does not open while fly mode owns Shift+D movement', () => {
    makeActiveViewerShortcutOwner({ flyActive: true })
    renderHarness()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'D',
          code: 'KeyD',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).toBeNull()
  })

  it('selects a display mode through the Phase 1 view setting contract', () => {
    makeActiveViewerShortcutOwner()
    renderHarness()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'D',
          code: 'KeyD',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    const materialButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'material',
    ) as HTMLButtonElement | undefined

    act(() => {
      materialButton?.click()
    })

    expect(useUiPrefsStore.getState().view.displayMode).toBe('material')
    expect(useUiPrefsStore.getState().view.wireframe).toBe(false)
    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).toBeNull()
  })

  it('selects an edge display mode without closing the display mode menu', () => {
    makeActiveViewerShortcutOwner()
    renderHarness()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'D',
          code: 'KeyD',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    const visibleEdgesOnlyButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'visibleEdgesOnly',
    ) as HTMLButtonElement | undefined

    act(() => {
      visibleEdgesOnlyButton?.click()
    })

    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('visibleEdgesOnly')
    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).not.toBeNull()
  })

  it('closes with Escape without changing the current display mode', () => {
    makeActiveViewerShortcutOwner()
    renderHarness()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'D',
          code: 'KeyD',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(useUiPrefsStore.getState().view.displayMode).toBe('rendered')
    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).toBeNull()
  })
})
