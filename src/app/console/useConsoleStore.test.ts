import { beforeEach, describe, expect, it } from 'vitest'
import {
  CONSOLE_DEFAULT_EXPANDED_HEIGHT,
  getConsoleToolsPreset,
  isConsoleEntryVisible,
  useConsoleStore,
} from './useConsoleStore'

describe('useConsoleStore', () => {
  beforeEach(() => {
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
  })

  it('pushes trimmed commands into history and clears the input', () => {
    useConsoleStore.getState().setInputText('  help  ')
    useConsoleStore.getState().pushCommandHistory('  help  ')

    expect(useConsoleStore.getState().commandHistory).toEqual(['help'])
    expect(useConsoleStore.getState().inputText).toBe('')
  })

  it('recalls older and newer command history entries while preserving the draft input', () => {
    useConsoleStore.getState().pushCommandHistory('help')
    useConsoleStore.getState().pushCommandHistory('status')
    useConsoleStore.getState().setInputText('ec')

    useConsoleStore.getState().recallPreviousHistory()
    expect(useConsoleStore.getState().inputText).toBe('status')

    useConsoleStore.getState().recallPreviousHistory()
    expect(useConsoleStore.getState().inputText).toBe('help')

    useConsoleStore.getState().recallNextHistory()
    expect(useConsoleStore.getState().inputText).toBe('status')

    useConsoleStore.getState().recallNextHistory()
    expect(useConsoleStore.getState().inputText).toBe('ec')
  })

  it('restores the default expanded height when reopening the console', () => {
    useConsoleStore.getState().setExpanded(true)
    useConsoleStore.getState().setExpandedHeight(420)

    useConsoleStore.getState().toggleExpanded()
    expect(useConsoleStore.getState().isExpanded).toBe(false)

    useConsoleStore.getState().toggleExpanded()
    expect(useConsoleStore.getState().isExpanded).toBe(true)
    expect(useConsoleStore.getState().expandedHeight).toBe(CONSOLE_DEFAULT_EXPANDED_HEIGHT)
  })

  it('returns to docked expanded mode when toggled open from floating mode', () => {
    useConsoleStore.getState().switchToFloating()

    useConsoleStore.getState().toggleExpanded()

    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(useConsoleStore.getState().isExpanded).toBe(true)
  })

  it('collapses back to the single-row bar when dragged down to the snap height', () => {
    useConsoleStore.getState().setExpanded(true)
    useConsoleStore.getState().setExpandedHeight(240)

    useConsoleStore.getState().setExpandedHeightFromDrag(20)

    expect(useConsoleStore.getState().isExpanded).toBe(false)
    expect(useConsoleStore.getState().expandedHeight).toBe(CONSOLE_DEFAULT_EXPANDED_HEIGHT)
  })

  it('clamps console opacity controls into a 0-100 range', () => {
    useConsoleStore.getState().setBackgroundOpacity(140)
    useConsoleStore.getState().setTextOpacity(-20)

    expect(useConsoleStore.getState().backgroundOpacity).toBe(100)
    expect(useConsoleStore.getState().textOpacity).toBe(0)
  })

  it('clamps console font size into the supported range', () => {
    useConsoleStore.getState().setFontSize(40)
    expect(useConsoleStore.getState().fontSize).toBe(24)

    useConsoleStore.getState().setFontSize(4)
    expect(useConsoleStore.getState().fontSize).toBe(4)

    useConsoleStore.getState().setFontSize(-2)
    expect(useConsoleStore.getState().fontSize).toBe(1)
  })

  it('clamps console z-index controls into the supported range', () => {
    useConsoleStore.getState().setZIndex(80)
    expect(useConsoleStore.getState().zIndex).toBe(40)

    useConsoleStore.getState().setZIndex(-5)
    expect(useConsoleStore.getState().zIndex).toBe(0)
  })

  it('updates the console background fill mode', () => {
    useConsoleStore.getState().setBackgroundFillMode('flat')
    expect(useConsoleStore.getState().backgroundFillMode).toBe('flat')
  })

  it('updates the console background color mode', () => {
    useConsoleStore.getState().setBackgroundColorMode('navy')
    expect(useConsoleStore.getState().backgroundColorMode).toBe('navy')
  })

  it('applies the default and clear console tool presets', () => {
    useConsoleStore.getState().setBackgroundOpacity(42)
    useConsoleStore.getState().setBackgroundFillMode('clear')

    useConsoleStore.getState().applyToolsPreset('default')
    expect(getConsoleToolsPreset(useConsoleStore.getState())).toBe('default')

    useConsoleStore.getState().applyToolsPreset('clear')
    expect(useConsoleStore.getState().backgroundOpacity).toBe(10)
    expect(useConsoleStore.getState().backgroundFillMode).toBe('flat')
    expect(getConsoleToolsPreset(useConsoleStore.getState())).toBe('clear')
  })

  it('reports custom when the console tool settings no longer match a preset', () => {
    useConsoleStore.getState().applyToolsPreset('clear')
    useConsoleStore.getState().setFontSize(16)

    expect(getConsoleToolsPreset(useConsoleStore.getState())).toBe('custom')
  })

  it('tracks floating and pop-out window ownership state', () => {
    useConsoleStore.getState().switchToFloating()
    useConsoleStore.getState().setFloatingRect({ x: 90, y: 80, width: 760, height: 460 })

    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(useConsoleStore.getState().lastFloatingRect.width).toBe(760)

    useConsoleStore.getState().switchToPopout()
    expect(useConsoleStore.getState().windowMode).toBe('popout')
    expect(useConsoleStore.getState().isExpanded).toBe(false)

    useConsoleStore.getState().handlePopoutWindowClosed()
    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(useConsoleStore.getState().isExpanded).toBe(false)
  })

  it('keeps list mode active when toggled open from list mode', () => {
    useConsoleStore.getState().switchToList()

    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(useConsoleStore.getState().isListMode).toBe(true)
    expect(useConsoleStore.getState().isExpanded).toBe(false)

    useConsoleStore.getState().toggleExpanded()

    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(useConsoleStore.getState().isListMode).toBe(true)
    expect(useConsoleStore.getState().isExpanded).toBe(true)
  })

  it('keeps floating mode active when list mode is opened from floating and closes only the list overlay on return', () => {
    useConsoleStore.getState().switchToFloating()
    useConsoleStore.getState().switchToList()

    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(useConsoleStore.getState().isListMode).toBe(true)

    useConsoleStore.getState().returnFromList()

    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(useConsoleStore.getState().isListMode).toBe(false)
    expect(useConsoleStore.getState().isExpanded).toBe(false)
  })

  it('keeps popout mode active when list mode is opened from popout and closes only the list overlay on return', () => {
    useConsoleStore.getState().switchToPopout()
    useConsoleStore.getState().switchToList()

    expect(useConsoleStore.getState().windowMode).toBe('popout')
    expect(useConsoleStore.getState().isListMode).toBe(true)

    useConsoleStore.getState().returnFromList()

    expect(useConsoleStore.getState().windowMode).toBe('popout')
    expect(useConsoleStore.getState().isListMode).toBe(false)
    expect(useConsoleStore.getState().isExpanded).toBe(false)
  })

  it('resets history navigation state explicitly', () => {
    useConsoleStore.getState().pushCommandHistory('help')
    useConsoleStore.getState().setInputText('status')
    useConsoleStore.getState().recallPreviousHistory()

    expect(useConsoleStore.getState().historyIndex).toBe(0)

    useConsoleStore.getState().resetHistoryNavigation()

    expect(useConsoleStore.getState().historyIndex).toBeNull()
    expect(useConsoleStore.getState().historyDraft).toBe('')
  })

  it('includes the 4.1D view, browser, and transforms layers in the default visibility set', () => {
    const state = useConsoleStore.getState()

    expect(state.visibleLayers.View).toBe(true)
    expect(state.visibleLayers.Browser).toBe(true)
    expect(state.visibleLayers.Transforms).toBe(true)
  })

  it('supports isolate mode and diagnostics pin without deleting visibility state', () => {
    const store = useConsoleStore.getState()
    store.setFilterMode('isolate')
    store.setIsolatedLayer('Browser')

    const browserEntry = {
      id: 'browser-entry',
      sequence: 1,
      createdAtMs: 1,
      timestampLabel: '00:00:01',
      layer: 'Browser' as const,
      text: 'Browser event',
      source: 'test',
      severity: 'info' as const,
    }
    const workerEntry = {
      ...browserEntry,
      id: 'worker-entry',
      layer: 'Worker' as const,
      text: 'Worker event',
    }
    const diagnosticsEntry = {
      ...browserEntry,
      id: 'diag-entry',
      layer: 'Diagnostics' as const,
      text: 'Diagnostic event',
    }

    expect(isConsoleEntryVisible(browserEntry, useConsoleStore.getState())).toBe(true)
    expect(isConsoleEntryVisible(workerEntry, useConsoleStore.getState())).toBe(false)
    expect(isConsoleEntryVisible(diagnosticsEntry, useConsoleStore.getState())).toBe(false)

    useConsoleStore.getState().setDiagnosticsPinned(true)

    expect(isConsoleEntryVisible(diagnosticsEntry, useConsoleStore.getState())).toBe(true)
  })

  it('supports subset mode with a small chosen group of layers', () => {
    const store = useConsoleStore.getState()
    store.setFilterMode('subset')
    store.toggleSubsetLayer('Commands')
    store.toggleSubsetLayer('Shortcuts')
    store.toggleSubsetLayer('App')
    store.toggleSubsetLayer('Worker')
    store.toggleSubsetLayer('Diagnostics')
    store.toggleSubsetLayer('Params')
    store.toggleSubsetLayer('Selection')
    store.toggleSubsetLayer('View')
    store.toggleSubsetLayer('Transforms')

    const browserEntry = {
      id: 'browser-entry',
      sequence: 1,
      createdAtMs: 1,
      timestampLabel: '00:00:01',
      layer: 'Browser' as const,
      text: 'Browser event',
      source: 'test',
      severity: 'info' as const,
    }
    const viewEntry = {
      ...browserEntry,
      id: 'view-entry',
      layer: 'View' as const,
      text: 'View event',
    }

    expect(isConsoleEntryVisible(browserEntry, useConsoleStore.getState())).toBe(true)
    expect(isConsoleEntryVisible(viewEntry, useConsoleStore.getState())).toBe(false)
  })
})
