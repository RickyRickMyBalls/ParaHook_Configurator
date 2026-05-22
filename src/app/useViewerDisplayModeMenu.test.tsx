// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type {
  ViewDisplayMode,
  ViewEdgeDisplayMode,
  ViewportStyle,
} from '../shared/viewSettingsTypes'
import {
  CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE,
  createViewAmbientOcclusionPresetSettings,
} from '../shared/viewSettingsTypes'
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
const edgeDisplayModeOptions: Array<ViewEdgeDisplayMode | 'hiddenLine'> = [
  'on',
  'off',
  'visibleEdgesOnly',
  'hiddenLine',
]
const viewportStyleOptions: ViewportStyle[] = ['clayStudio']

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
      {viewportStyleOptions.map((style) => (
        <button key={style} type="button" onClick={() => menu.selectViewportStyle(style)}>
          {style}
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

  it('selects the Hidden Line edge preset without closing the display mode menu', () => {
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

    const hiddenLineButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'hiddenLine',
    ) as HTMLButtonElement | undefined

    act(() => {
      hiddenLineButton?.click()
    })

    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('on')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges).toMatchObject({
      preset: 'hiddenLine',
      mode: 'all',
      depthMode: 'xray',
      hiddenEdges: true,
      lineStyle: 'dashed',
    })
    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).not.toBeNull()
  })

  it('selects Clay Studio through the style view setting contract', () => {
    makeActiveViewerShortcutOwner()
    renderHarness()
    useUiPrefsStore.getState().setViewKey('displayMode', 'material')

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

    const clayStudioButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'clayStudio',
    ) as HTMLButtonElement | undefined

    act(() => {
      clayStudioButton?.click()
    })

    expect(useUiPrefsStore.getState().view.viewportStyle).toBe('clayStudio')
    expect(useUiPrefsStore.getState().view.displayMode).toBe('rendered')
    expect(useUiPrefsStore.getState().view.environmentGrade).toEqual(
      CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE,
    )
    expect(useUiPrefsStore.getState().view.shadowsEnabled).toBe(false)
    expect(useUiPrefsStore.getState().view.ground.enabled).toBe(true)
    expect(useUiPrefsStore.getState().view.gridVisible).toBe(false)
    expect(useUiPrefsStore.getState().view.postProcessing).toEqual(
      createViewAmbientOcclusionPresetSettings('medium'),
    )
    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).toBeNull()
  })

  it('preserves the current render preset when selecting a normal display mode', () => {
    makeActiveViewerShortcutOwner()
    renderHarness()
    useUiPrefsStore.getState().setView({
      displayMode: 'rendered',
      viewportStyle: 'clayStudio',
    })

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

    const solidButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === 'solid',
    ) as HTMLButtonElement | undefined

    act(() => {
      solidButton?.click()
    })

    expect(useUiPrefsStore.getState().view.viewportStyle).toBe('clayStudio')
    expect(useUiPrefsStore.getState().view.displayMode).toBe('solid')
    expect(container?.querySelector('[role="menu"][aria-label="Display mode"]')).toBeNull()
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
