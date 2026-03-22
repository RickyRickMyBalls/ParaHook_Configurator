import { beforeEach, describe, expect, it } from 'vitest'
import {
  CONSOLE_DEFAULT_EXPANDED_HEIGHT,
  CONSOLE_MAX_SUMMARY_WIDTH,
  CONSOLE_MIN_SUMMARY_WIDTH,
  getConsoleToolsPreset,
  isConsoleEntryVisible,
  useConsoleStore,
} from './useConsoleStore'
import type { ConsoleAssistDescriptor } from './consoleTypes'

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

  it('clamps the console summary width into the supported range', () => {
    useConsoleStore.getState().setSummaryWidth(40)
    expect(useConsoleStore.getState().summaryWidth).toBe(CONSOLE_MIN_SUMMARY_WIDTH)

    useConsoleStore.getState().setSummaryWidth(420)
    expect(useConsoleStore.getState().summaryWidth).toBe(420)

    useConsoleStore.getState().setSummaryWidth(2000)
    expect(useConsoleStore.getState().summaryWidth).toBe(CONSOLE_MAX_SUMMARY_WIDTH)
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
      commandLineKind: null,
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
      commandLineKind: null,
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

  it('defaults command entries to system and preserves explicit command user entries', () => {
    useConsoleStore.getState().appendEntry({
      layer: 'Commands',
      text: 'Help text',
      source: 'console',
      severity: 'info',
    })
    useConsoleStore.getState().appendEntry({
      layer: 'Commands',
      commandLineKind: 'user',
      text: '> help',
    })

    expect(useConsoleStore.getState().entries[0]?.commandLineKind).toBe('system')
    expect(useConsoleStore.getState().entries[1]?.commandLineKind).toBe('user')
  })

  it('prefills, cycles, and respects manual override for staged choices', () => {
    useConsoleStore.getState().setStagedNavigationSession({
      scopeId: 'graphSketchSelected',
      breadcrumb: ['Select', 'Graph', 'graph_[1]', 'Sketch', 'sketch_[1]'],
      selections: {
        graphDocumentId: 'graph-1',
        selectedNodeId: 'node-1',
        sketchNodeId: 'node-1',
      },
      validChoices: [
        {
          canonicalToken: 'SKETCH PLANE',
          aliases: ['SKETCHPLANE', 'SP'],
          label: 'Sketch Plane',
          kind: 'action',
        },
        {
          canonicalToken: 'SKETCH DRAW',
          aliases: ['SKETCHDRAW', 'SD'],
          label: 'Sketch Draw',
          kind: 'action',
        },
        {
          canonicalToken: 'BACK',
          aliases: ['B'],
          label: 'Back',
          kind: 'scope',
        },
      ],
    })

    expect(useConsoleStore.getState().inputText).toBe('Sketch Plane')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(0)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(false)

    useConsoleStore.getState().cycleStagedChoice('next')

    expect(useConsoleStore.getState().inputText).toBe('Sketch Draw')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(1)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(false)

    useConsoleStore.getState().setInputText('B')

    expect(useConsoleStore.getState().inputText).toBe('B')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(2)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(false)

    useConsoleStore.getState().setInputText('custom token')

    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(0)
  })

  it('prefills and cycles the guided root session like other staged layers', () => {
    useConsoleStore.getState().setStagedNavigationSession({
      scopeId: 'root',
      breadcrumb: ['Root'],
      selections: {
        graphDocumentId: null,
        selectedNodeId: null,
        sketchNodeId: null,
      },
      validChoices: [
        {
          canonicalToken: 'GRAPH',
          aliases: ['G'],
          label: 'Graph',
          kind: 'scope',
        },
        {
          canonicalToken: 'RADIO',
          aliases: ['R'],
          label: 'Radio',
          kind: 'scope',
        },
      ],
    })

    expect(useConsoleStore.getState().inputText).toBe('Graph')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(0)

    useConsoleStore.getState().cycleStagedChoice('next')

    expect(useConsoleStore.getState().inputText).toBe('Radio')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(1)

    useConsoleStore.getState().seedInputText('g')

    expect(useConsoleStore.getState().inputText).toBe('g')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
  })

  it('replaces staged assist prefill on the first seeded printable key and keeps manual override active', () => {
    useConsoleStore.getState().setStagedNavigationSession({
      scopeId: 'graphSelected',
      breadcrumb: ['Select', 'Graph', 'graph_[1]'],
      selections: {
        graphDocumentId: 'graph-1',
        selectedNodeId: null,
        sketchNodeId: null,
      },
      validChoices: [
        {
          canonicalToken: 'SKETCH',
          aliases: ['S'],
          label: 'Sketch',
          kind: 'scope',
        },
        {
          canonicalToken: 'EXTRUDE',
          aliases: ['E'],
          label: 'Extrude',
          kind: 'scope',
        },
      ],
    })

    expect(useConsoleStore.getState().inputText).toBe('Sketch')

    useConsoleStore.getState().seedInputText('s')

    expect(useConsoleStore.getState().inputText).toBe('s')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(0)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
  })

  it('appends subsequent seeded printable keys after the first guided replacement so multi-letter aliases can continue typing', () => {
    useConsoleStore.getState().setStagedNavigationSession({
      scopeId: 'radioRoot',
      breadcrumb: ['Select', 'Radio'],
      selections: {
        graphDocumentId: null,
        selectedNodeId: null,
        sketchNodeId: null,
      },
      validChoices: [
        {
          canonicalToken: 'ON',
          aliases: ['O'],
          label: 'On',
          kind: 'action',
        },
        {
          canonicalToken: 'OPENTOOLBAR',
          aliases: ['OT'],
          label: 'OpenToolbar',
          kind: 'action',
        },
      ],
    })

    expect(useConsoleStore.getState().inputText).toBe('On')

    useConsoleStore.getState().seedInputText('o')
    expect(useConsoleStore.getState().inputText).toBe('o')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)

    useConsoleStore.getState().seedInputText('t')
    expect(useConsoleStore.getState().inputText).toBe('ot')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
  })

  it('preserves manual override after the first typed replacement even if the text matches a valid assisted token', () => {
    useConsoleStore.getState().setFeatureAssistDescriptor({
      label: 'Sketch Plane > Move',
      prefill: 'Vec3(0.0, 0.0, 0.0)',
      choices: [
        { canonicalToken: 'X', aliases: ['MOVE X', 'MX'], label: 'Move X' },
        { canonicalToken: 'Y', aliases: ['MOVE Y', 'MY'], label: 'Move Y' },
        { canonicalToken: 'Z', aliases: ['MOVE Z', 'MZ'], label: 'Move Z' },
      ],
    })

    useConsoleStore.getState().setInputText('x', { startManualOverride: true })

    expect(useConsoleStore.getState().inputText).toBe('x')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(0)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)

    useConsoleStore.getState().setInputText('xy')

    expect(useConsoleStore.getState().inputText).toBe('xy')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
  })

  it('prefills, cycles, and respects manual override for feature assist descriptors', () => {
    const descriptor: ConsoleAssistDescriptor = {
      label: 'Sketch Draw',
      prefill: 'Line',
      choices: [
        { canonicalToken: 'LINE', aliases: ['L'], label: 'Line' },
        { canonicalToken: 'PLINE', aliases: ['PL'], label: 'PLine' },
        { canonicalToken: 'X', aliases: [], label: 'X' },
      ],
    }

    useConsoleStore.getState().setFeatureAssistDescriptor(descriptor)

    expect(useConsoleStore.getState().inputText).toBe('Line')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(0)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(false)

    useConsoleStore.getState().cycleStagedChoice('next')

    expect(useConsoleStore.getState().inputText).toBe('PLine')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(1)

    useConsoleStore.getState().setInputText('custom token')

    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)

    useConsoleStore.getState().setFeatureAssistDescriptor(null)

    expect(useConsoleStore.getState().inputText).toBe('custom token')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBeNull()
  })

  it('clears stale feature-assist prefill when the descriptor disappears', () => {
    const descriptor: ConsoleAssistDescriptor = {
      label: 'Sketch Draw',
      prefill: 'Line',
      choices: [
        { canonicalToken: 'LINE', aliases: ['L'], label: 'Line' },
        { canonicalToken: 'PLINE', aliases: ['PL'], label: 'PLine' },
        { canonicalToken: 'X', aliases: [], label: 'X' },
      ],
    }

    useConsoleStore.getState().setFeatureAssistDescriptor(descriptor)
    expect(useConsoleStore.getState().inputText).toBe('Line')

    useConsoleStore.getState().setFeatureAssistDescriptor(null)

    expect(useConsoleStore.getState().inputText).toBe('')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBeNull()
  })

  it('keeps manual feature-assist input when the same descriptor is re-published', () => {
    const descriptor: ConsoleAssistDescriptor = {
      label: 'Sketch Plane',
      prefill: 'X',
      choices: [
        { canonicalToken: 'X', aliases: ['MOVE X', 'MX'], label: 'X' },
        { canonicalToken: 'Y', aliases: ['MOVE Y', 'MY'], label: 'Y' },
        { canonicalToken: 'Z', aliases: ['MOVE Z', 'MZ'], label: 'Z' },
        { canonicalToken: '3,3,3', aliases: [], label: '3,3,3' },
      ],
    }

    useConsoleStore.getState().setFeatureAssistDescriptor(descriptor)
    useConsoleStore.getState().setInputText('3,3,3')
    useConsoleStore.getState().setFeatureAssistDescriptor({
      ...descriptor,
      choices: [...descriptor.choices],
    })

    expect(useConsoleStore.getState().inputText).toBe('3,3,3')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(3)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(false)
  })

  it('restores feature assist after staged navigation clears', () => {
    const descriptor: ConsoleAssistDescriptor = {
      label: 'Sketch Plane',
      prefill: 'XY',
      choices: [
        { canonicalToken: 'XY', aliases: [], label: 'XY' },
        { canonicalToken: 'XZ', aliases: [], label: 'XZ' },
        { canonicalToken: 'YZ', aliases: [], label: 'YZ' },
      ],
    }

    useConsoleStore.getState().setFeatureAssistDescriptor(descriptor)
    useConsoleStore.getState().setStagedNavigationSession({
      scopeId: 'graphSelected',
      breadcrumb: ['Select', 'Graph', 'graph_[1]'],
      selections: {
        graphDocumentId: 'graph-1',
        selectedNodeId: null,
        sketchNodeId: null,
      },
      validChoices: [
        {
          canonicalToken: 'SKETCH',
          aliases: ['S'],
          label: 'Sketch',
          kind: 'scope',
        },
      ],
    })

    expect(useConsoleStore.getState().inputText).toBe('Sketch')

    useConsoleStore.getState().clearStagedNavigationSession()

    expect(useConsoleStore.getState().inputText).toBe('XY')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(0)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(false)
  })

  it('prefills and respects manual override for console prompt sessions', () => {
    useConsoleStore.getState().setConsolePromptSession({
      kind: 'radio.sampleBurstTime',
      breadcrumb: ['Select', 'Radio', 'SampleBurstTime'],
      label: 'Radio SampleBurstTime',
      prefill: '0.1',
      returnSession: {
        scopeId: 'radioRoot',
        breadcrumb: ['Select', 'Radio'],
        selections: {
          graphDocumentId: null,
          selectedNodeId: null,
          sketchNodeId: null,
        },
        validChoices: [
          {
            canonicalToken: 'ON',
            aliases: ['O'],
            label: 'On',
            kind: 'action',
          },
        ],
      },
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(useConsoleStore.getState().inputText).toBe('0.1')
    expect(useConsoleStore.getState().stagedChoiceIndex).toBe(0)
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(false)

    useConsoleStore.getState().setInputText('0.25')

    expect(useConsoleStore.getState().inputText).toBe('0.25')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
  })
})
