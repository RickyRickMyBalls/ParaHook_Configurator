import { create } from 'zustand'
import { newId } from '../spaghetti/utils/id'
import type {
  ConsoleAppendEntryInput,
  ConsoleAssistChoice,
  ConsoleAssistDescriptor,
  ConsoleBackgroundColorMode,
  ConsoleBackgroundFillMode,
  ConsoleCommandLineKind,
  ConsoleFilterMode,
  ConsoleFloatingRect,
  ConsoleLayer,
  ConsoleLayerVisibility,
  ConsoleSeverity,
  ConsoleTranscriptEntry,
  ConsoleToolsPreset,
  ConsoleWindowMode,
} from './consoleTypes'
import type {
  ConsoleStagedNavigationChoice,
  ConsoleStagedNavigationSession,
} from './stagedNavigation'

export type ConsolePromptSessionKind =
  | 'radio.url'
  | 'radio.sampleBurstTime'
  | 'reference-transform.axis'
  | 'reference-transform.plane'
  | 'content.owner.label'
  | 'transform.delete-latest.confirm'

export type ConsolePromptSession =
  | {
      kind: 'radio.url' | 'radio.sampleBurstTime'
      breadcrumb: string[]
      label: string
      prefill: string
      returnSession: ConsoleStagedNavigationSession
    }
  | {
      kind: 'reference-transform.axis'
      breadcrumb: string[]
      label: string
      prefill: string
      returnSession: ConsoleStagedNavigationSession
      mode: 'translate' | 'rotate' | 'scale'
      axis: 'x' | 'y' | 'z'
    }
  | {
      kind: 'reference-transform.plane'
      breadcrumb: string[]
      label: string
      prefill: string
      returnSession: ConsoleStagedNavigationSession
      mode: 'translate' | 'rotate' | 'scale'
      plane: 'xy' | 'xz' | 'yz'
    }
  | {
      kind: 'content.owner.label'
      breadcrumb: string[]
      label: string
      prefill: string
      returnSession: ConsoleStagedNavigationSession
      target:
        | { kind: 'assembly'; assemblyId: string }
        | { kind: 'component'; componentId: string }
    }
  | {
      kind: 'transform.delete-latest.confirm'
      breadcrumb: string[]
      label: string
      prefill: string
      returnSession: ConsoleStagedNavigationSession
      target:
        | { kind: 'reference'; referenceId: string }
        | { kind: 'content-object'; objectId: string }
        | { kind: 'environment-light'; lightId: string }
    }

const CONSOLE_LAYERS: ConsoleLayer[] = [
  'Commands',
  'Shortcuts',
  'App',
  'Worker',
  'Diagnostics',
  'Params',
  'Selection',
  'View',
  'Browser',
  'Transforms',
]

const DEFAULT_EXPANDED_HEIGHT = 280
const MIN_EXPANDED_HEIGHT = 10
const MAX_EXPANDED_HEIGHT = 10000
const COLLAPSE_SNAP_HEIGHT = 44
const DEFAULT_SUMMARY_WIDTH: number | null = null
const MIN_SUMMARY_WIDTH = 180
const MAX_SUMMARY_WIDTH = 720
const DEFAULT_BACKGROUND_OPACITY = 96
const DEFAULT_TEXT_OPACITY = 100
const DEFAULT_FONT_SIZE = 12
const DEFAULT_Z_INDEX = 28
const MIN_Z_INDEX = 0
const MAX_Z_INDEX = 40
const DEFAULT_BACKGROUND_FILL_MODE: ConsoleBackgroundFillMode = 'blur'
const DEFAULT_BACKGROUND_COLOR_MODE: ConsoleBackgroundColorMode = 'midnight'
const DEFAULT_WINDOW_MODE: ConsoleWindowMode = 'docked'
const DEFAULT_FLOATING_RECT: ConsoleFloatingRect = {
  x: 64,
  y: 64,
  width: 720,
  height: 420,
}
const CLEAR_PRESET_BACKGROUND_OPACITY = 10
const CLEAR_PRESET_BACKGROUND_FILL_MODE: ConsoleBackgroundFillMode = 'flat'

export type ConsoleInputFocusReason = 'extrude-depth'

export type ConsoleInputFocusRequest = {
  seq: number
  reason: ConsoleInputFocusReason
}

type ConsoleState = {
  isExpanded: boolean
  windowMode: ConsoleWindowMode
  isListMode: boolean
  expandedHeight: number
  summaryWidth: number | null
  inputText: string
  inputFocusRequest: ConsoleInputFocusRequest | null
  commandHistory: string[]
  historyIndex: number | null
  historyDraft: string
  isToolsOpen: boolean
  isLayerToolbarVisible: boolean
  isChromeHidden: boolean
  backgroundOpacity: number
  textOpacity: number
  fontSize: number
  zIndex: number
  backgroundFillMode: ConsoleBackgroundFillMode
  backgroundColorMode: ConsoleBackgroundColorMode
  floatingRect: ConsoleFloatingRect
  lastFloatingRect: ConsoleFloatingRect
  entries: ConsoleTranscriptEntry[]
  visibleLayers: ConsoleLayerVisibility
  filterMode: ConsoleFilterMode
  isolatedLayer: ConsoleLayer | null
  subsetLayers: ConsoleLayerVisibility
  isDiagnosticsPinned: boolean
  stagedNavigationSession: ConsoleStagedNavigationSession | null
  consolePromptSession: ConsolePromptSession | null
  featureAssistDescriptor: ConsoleAssistDescriptor | null
  stagedChoiceIndex: number | null
  isStagedChoiceManualOverride: boolean
  appendEntry: (entry: ConsoleAppendEntryInput) => void
  clearEntries: () => void
  setInputText: (
    value: string,
    options?: {
      fromAssist?: boolean
      startManualOverride?: boolean
      preserveGuidedReplace?: boolean
    },
  ) => void
  requestInputFocus: (reason: ConsoleInputFocusReason) => void
  seedInputText: (value: string) => void
  pushCommandHistory: (value: string) => void
  recallPreviousHistory: () => void
  recallNextHistory: () => void
  resetHistoryNavigation: () => void
  setToolsOpen: (value: boolean) => void
  setLayerToolbarVisible: (value: boolean) => void
  setChromeHidden: (value: boolean) => void
  toggleExpanded: () => void
  setExpanded: (expanded: boolean) => void
  setExpandedHeight: (height: number) => void
  setExpandedHeightFromDrag: (height: number) => void
  setSummaryWidth: (width: number) => void
  setBackgroundOpacity: (value: number) => void
  setTextOpacity: (value: number) => void
  setFontSize: (value: number) => void
  setZIndex: (value: number) => void
  setBackgroundFillMode: (value: ConsoleBackgroundFillMode) => void
  setBackgroundColorMode: (value: ConsoleBackgroundColorMode) => void
  applyToolsPreset: (preset: Exclude<ConsoleToolsPreset, 'custom'>) => void
  switchToDocked: (expanded?: boolean) => void
  switchToFloating: () => void
  switchToPopout: () => void
  switchToList: () => void
  returnFromList: () => void
  setFloatingRect: (rect: ConsoleFloatingRect) => void
  handlePopoutWindowClosed: () => void
  toggleVisibleLayer: (layer: ConsoleLayer) => void
  setFilterMode: (mode: ConsoleFilterMode) => void
  setIsolatedLayer: (layer: ConsoleLayer) => void
  toggleSubsetLayer: (layer: ConsoleLayer) => void
  setDiagnosticsPinned: (value: boolean) => void
  setStagedNavigationSession: (session: ConsoleStagedNavigationSession | null) => void
  setConsolePromptSession: (session: ConsolePromptSession | null) => void
  updateConsolePromptSessionPrefill: (prefill: string) => void
  setFeatureAssistDescriptor: (descriptor: ConsoleAssistDescriptor | null) => void
  clearStagedNavigationSession: () => void
  clearConsolePromptSession: () => void
  cycleStagedChoice: (direction: 'previous' | 'next') => void
}

const descriptorChoicesFromStagedChoices = (
  choices: ConsoleStagedNavigationChoice[],
): ConsoleAssistChoice[] =>
  choices.map((choice) => ({
    canonicalToken: choice.canonicalToken,
    aliases: choice.aliases,
    label: choice.label,
  }))

const formatTimestamp = (createdAtMs: number): string => {
  const date = new Date(createdAtMs)
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')
  const seconds = `${date.getSeconds()}`.padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const createVisibleLayers = (): ConsoleLayerVisibility =>
  Object.fromEntries(CONSOLE_LAYERS.map((layer) => [layer, true])) as ConsoleLayerVisibility

const ensureAtLeastOneLayerVisible = (
  visibility: ConsoleLayerVisibility,
  fallbackLayer: ConsoleLayer,
): ConsoleLayerVisibility => {
  if (Object.values(visibility).some(Boolean)) {
    return visibility
  }
  return {
    ...visibility,
    [fallbackLayer]: true,
  }
}

const resolveConsoleEntryVisibility = (
  entry: ConsoleTranscriptEntry,
  state: Pick<
    ConsoleState,
    'visibleLayers' | 'filterMode' | 'isolatedLayer' | 'subsetLayers' | 'isDiagnosticsPinned'
  >,
): boolean => {
  const baseVisible = state.visibleLayers[entry.layer] ?? true
  if (entry.layer === 'Diagnostics' && state.isDiagnosticsPinned) {
    return true
  }
  if (!baseVisible) {
    return false
  }
  if (state.filterMode === 'isolate') {
    return entry.layer === state.isolatedLayer
  }
  if (state.filterMode === 'subset') {
    return state.subsetLayers[entry.layer] ?? false
  }
  return true
}

const clampExpandedHeight = (height: number): number =>
  Math.min(MAX_EXPANDED_HEIGHT, Math.max(MIN_EXPANDED_HEIGHT, Math.round(height)))

const clampSummaryWidth = (width: number): number =>
  Math.min(MAX_SUMMARY_WIDTH, Math.max(MIN_SUMMARY_WIDTH, Math.round(width)))

const clampPercent = (value: number): number => Math.min(100, Math.max(0, Math.round(value)))
const clampFontSize = (value: number): number => Math.min(24, Math.max(1, Math.round(value)))
const clampZIndex = (value: number): number =>
  Math.min(MAX_Z_INDEX, Math.max(MIN_Z_INDEX, Math.round(value)))

const normalizeChoiceToken = (value: string): string => value.trim().toUpperCase()

const shouldUseChoiceLabelAsInput = (choice: {
  canonicalToken: string
  aliases: string[]
  label: string
}): boolean => {
  const normalizedLabel = normalizeChoiceToken(choice.label)
  const compactLabel = normalizedLabel.replace(/\s+/gu, '')
  return (
    normalizedLabel === choice.canonicalToken ||
    compactLabel === choice.canonicalToken ||
    choice.aliases.includes(normalizedLabel)
  )
}

const getStagedChoiceInputText = (choice: ConsoleStagedNavigationChoice): string =>
  shouldUseChoiceLabelAsInput(choice) ? choice.label : choice.canonicalToken

const getAssistChoiceInputText = (choice: ConsoleAssistChoice): string =>
  shouldUseChoiceLabelAsInput(choice) ? choice.label : choice.canonicalToken

const isInputDrivenByDescriptor = (
  descriptor: ConsoleAssistDescriptor,
  inputText: string,
): boolean => {
  const normalizedInput = normalizeChoiceToken(inputText)
  if (normalizedInput.length === 0) {
    return false
  }
  if (descriptor.prefill !== null && normalizeChoiceToken(descriptor.prefill) === normalizedInput) {
    return true
  }
  return descriptor.choices.some((choice) => {
    const choiceInputText = getAssistChoiceInputText(choice)
    return (
      normalizeChoiceToken(choiceInputText) === normalizedInput ||
      choice.canonicalToken === normalizedInput ||
      choice.aliases.includes(normalizedInput)
    )
  })
}

const isInputDrivenByStagedNavigationSession = (
  session: ConsoleStagedNavigationSession,
  inputText: string,
): boolean => {
  const normalizedInput = normalizeChoiceToken(inputText)
  if (normalizedInput.length === 0) {
    return false
  }
  return session.validChoices.some((choice) => {
    const choiceInputText = getStagedChoiceInputText(choice)
    return (
      normalizeChoiceToken(choiceInputText) === normalizedInput ||
      choice.canonicalToken === normalizedInput ||
      choice.aliases.includes(normalizedInput)
    )
  })
}

const areAssistDescriptorsEqual = (
  left: ConsoleAssistDescriptor | null,
  right: ConsoleAssistDescriptor | null,
): boolean => {
  if (left === right) {
    return true
  }
  if (left === null || right === null) {
    return false
  }
  if (
    left.label !== right.label ||
    left.prefill !== right.prefill ||
    left.summaryLeadText !== right.summaryLeadText ||
    (left.summaryMode ?? 'default') !== (right.summaryMode ?? 'default')
  ) {
    return false
  }
  if ((left.breadcrumb?.length ?? 0) !== (right.breadcrumb?.length ?? 0)) {
    return false
  }
  if ((left.breadcrumb ?? []).some((segment, index) => segment !== right.breadcrumb?.[index])) {
    return false
  }
  if (left.choices.length !== right.choices.length) {
    return false
  }
  return left.choices.every((choice, index) => {
    const other = right.choices[index]
    if (other === undefined) {
      return false
    }
    return (
      choice.canonicalToken === other.canonicalToken &&
      choice.label === other.label &&
      choice.aliases.length === other.aliases.length &&
      choice.aliases.every((alias, aliasIndex) => alias === other.aliases[aliasIndex])
    )
  })
}

const getActiveAssistDescriptor = (
  state: Pick<ConsoleState, 'stagedNavigationSession' | 'consolePromptSession' | 'featureAssistDescriptor'>,
): ConsoleAssistDescriptor | null => {
  if (state.consolePromptSession !== null) {
    return {
      label: state.consolePromptSession.label,
      breadcrumb: state.consolePromptSession.breadcrumb,
      choices: [
        {
          canonicalToken: state.consolePromptSession.prefill,
          aliases: [],
          label: state.consolePromptSession.prefill,
        },
      ],
      prefill: state.consolePromptSession.prefill,
    }
  }
  if (state.featureAssistDescriptor !== null) {
    return state.featureAssistDescriptor
  }
  if (state.stagedNavigationSession !== null && state.stagedNavigationSession.validChoices.length > 0) {
    return {
      label:
        state.stagedNavigationSession.breadcrumb.at(-1) ??
        state.stagedNavigationSession.scopeId,
      choices: descriptorChoicesFromStagedChoices(state.stagedNavigationSession.validChoices),
      prefill:
        state.stagedNavigationSession.validChoices[0] === undefined
          ? null
          : getStagedChoiceInputText(state.stagedNavigationSession.validChoices[0]),
    }
  }
  return null
}

const getDescriptorDrivenInputText = (
  state: Pick<
    ConsoleState,
    'stagedNavigationSession' | 'consolePromptSession' | 'featureAssistDescriptor' | 'stagedChoiceIndex'
  >,
): string | null => {
  if (state.consolePromptSession !== null) {
    return state.consolePromptSession.prefill
  }
  if (state.featureAssistDescriptor !== null && state.featureAssistDescriptor.choices.length > 0) {
    const choiceIndex = state.stagedChoiceIndex ?? 0
    const choice =
      state.featureAssistDescriptor.choices[choiceIndex] ?? state.featureAssistDescriptor.choices[0]
    return choice === undefined
      ? state.featureAssistDescriptor.prefill
      : getAssistChoiceInputText(choice)
  }
  if (state.stagedNavigationSession !== null && state.stagedNavigationSession.validChoices.length > 0) {
    const choiceIndex = state.stagedChoiceIndex ?? 0
    const choice =
      state.stagedNavigationSession.validChoices[choiceIndex] ?? state.stagedNavigationSession.validChoices[0]
    return choice === undefined ? null : getStagedChoiceInputText(choice)
  }
  return state.featureAssistDescriptor?.prefill ?? null
}

const resolveStagedChoiceTracking = (
  descriptor: ConsoleAssistDescriptor | null,
  inputText: string,
  options?: { forceManualOverride?: boolean },
): {
  stagedChoiceIndex: number | null
  isStagedChoiceManualOverride: boolean
} => {
  if (descriptor === null || descriptor.choices.length === 0) {
    return {
      stagedChoiceIndex: null,
      isStagedChoiceManualOverride: false,
    }
  }

  const normalizedInput = normalizeChoiceToken(inputText)
  if (normalizedInput.length === 0) {
    return {
      stagedChoiceIndex: 0,
      isStagedChoiceManualOverride: options?.forceManualOverride ?? false,
    }
  }

  const matchedIndex = descriptor.choices.findIndex((choice) => {
    const choiceInputText = getAssistChoiceInputText(choice)
    const normalizedChoiceInput = normalizeChoiceToken(choiceInputText)
    return (
      normalizedInput === normalizedChoiceInput ||
      normalizedInput === choice.canonicalToken ||
      choice.aliases.includes(normalizedInput)
    )
  })

  if (matchedIndex !== -1) {
    return {
      stagedChoiceIndex: matchedIndex,
      isStagedChoiceManualOverride: options?.forceManualOverride ?? false,
    }
  }

  return {
    stagedChoiceIndex: 0,
    isStagedChoiceManualOverride: true,
  }
}

const createEntry = (
  sequence: number,
  input: ConsoleAppendEntryInput,
): ConsoleTranscriptEntry => {
  const createdAtMs = Date.now()
  const severity: ConsoleSeverity = input.severity ?? 'normal'
  const commandLineKind: ConsoleCommandLineKind | null =
    input.layer === 'Commands' ? (input.commandLineKind ?? 'system') : null
  return {
    id: newId('console-entry'),
    sequence,
    createdAtMs,
    timestampLabel: formatTimestamp(createdAtMs),
    layer: input.layer,
    commandLineKind,
    text: input.text,
    source: input.source ?? null,
    severity,
  }
}

export const formatConsoleEntryLayerLabel = (entry: ConsoleTranscriptEntry): string => {
  if (entry.layer === 'Commands' && entry.commandLineKind !== null) {
    return `commands.${entry.commandLineKind}`
  }
  return entry.layer
}

export const useConsoleStore = create<ConsoleState>((set, get) => ({
  isExpanded: false,
  windowMode: DEFAULT_WINDOW_MODE,
  isListMode: false,
  expandedHeight: DEFAULT_EXPANDED_HEIGHT,
  summaryWidth: DEFAULT_SUMMARY_WIDTH,
  inputText: '',
  inputFocusRequest: null,
  commandHistory: [],
  historyIndex: null,
  historyDraft: '',
  isToolsOpen: false,
  isLayerToolbarVisible: true,
  isChromeHidden: false,
  backgroundOpacity: DEFAULT_BACKGROUND_OPACITY,
  textOpacity: DEFAULT_TEXT_OPACITY,
  fontSize: DEFAULT_FONT_SIZE,
  zIndex: DEFAULT_Z_INDEX,
  backgroundFillMode: DEFAULT_BACKGROUND_FILL_MODE,
  backgroundColorMode: DEFAULT_BACKGROUND_COLOR_MODE,
  floatingRect: DEFAULT_FLOATING_RECT,
  lastFloatingRect: DEFAULT_FLOATING_RECT,
  entries: [],
  visibleLayers: createVisibleLayers(),
  filterMode: 'normal',
  isolatedLayer: 'Commands',
  subsetLayers: createVisibleLayers(),
  isDiagnosticsPinned: false,
  stagedNavigationSession: null,
  consolePromptSession: null,
  featureAssistDescriptor: null,
  stagedChoiceIndex: null,
  isStagedChoiceManualOverride: false,
  appendEntry: (entry) => {
    const nextSequence = (get().entries.at(-1)?.sequence ?? 0) + 1
    set((state) => ({
      entries: [...state.entries, createEntry(nextSequence, entry)],
    }))
  },
  clearEntries: () => {
    set({ entries: [] })
  },
  setInputText: (inputText, options) => {
    set((state) => {
      const activeDescriptor = getActiveAssistDescriptor(state)
      const shouldPreserveGuidedReplace =
        activeDescriptor !== null &&
        options?.preserveGuidedReplace === true &&
        options?.fromAssist !== true &&
        options?.startManualOverride !== true
      const shouldForceManualOverride =
        activeDescriptor !== null &&
        !shouldPreserveGuidedReplace &&
        options?.fromAssist !== true &&
        (options?.startManualOverride === true || state.isStagedChoiceManualOverride)
      const nextTracking =
        activeDescriptor === null
          ? {
              stagedChoiceIndex: null,
              isStagedChoiceManualOverride: false,
            }
          : shouldPreserveGuidedReplace
            ? {
                stagedChoiceIndex: resolveStagedChoiceTracking(activeDescriptor, inputText)
                  .stagedChoiceIndex,
                isStagedChoiceManualOverride: false,
              }
          : resolveStagedChoiceTracking(activeDescriptor, inputText, {
              forceManualOverride: shouldForceManualOverride,
            })

      return {
        inputText,
        historyIndex: null,
        historyDraft: '',
        stagedChoiceIndex: nextTracking.stagedChoiceIndex,
        isStagedChoiceManualOverride:
          activeDescriptor === null ? false : nextTracking.isStagedChoiceManualOverride,
      }
    })
  },
  requestInputFocus: (reason) => {
    set((state) => ({
      inputFocusRequest: {
        seq: (state.inputFocusRequest?.seq ?? 0) + 1,
        reason,
      },
      ...(reason === 'extrude-depth'
        ? {
            stagedNavigationSession: null,
            consolePromptSession: null,
            stagedChoiceIndex: null,
            isStagedChoiceManualOverride: false,
            inputText: '',
            historyIndex: null,
            historyDraft: '',
          }
        : {}),
    }))
  },
  seedInputText: (value) => {
    set((state) => {
      const activeDescriptor = getActiveAssistDescriptor(state)
      const descriptorDrivenInputText = getDescriptorDrivenInputText(state)
      const shouldReplaceAssistedInput =
        activeDescriptor !== null &&
        !state.isStagedChoiceManualOverride &&
        descriptorDrivenInputText !== null &&
        normalizeChoiceToken(state.inputText) === normalizeChoiceToken(descriptorDrivenInputText)
      const nextInputText = shouldReplaceAssistedInput ? value : `${state.inputText}${value}`

      return {
        inputText: nextInputText,
        historyIndex: null,
        historyDraft: '',
        ...(activeDescriptor === null
          ? {
              stagedChoiceIndex: null,
              isStagedChoiceManualOverride: false,
            }
          : resolveStagedChoiceTracking(activeDescriptor, nextInputText, {
              forceManualOverride:
                shouldReplaceAssistedInput || state.isStagedChoiceManualOverride,
            })),
      }
    })
  },
  pushCommandHistory: (value) => {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      set({
        inputText: '',
        historyIndex: null,
        historyDraft: '',
        isStagedChoiceManualOverride: false,
      })
      return
    }
    set((state) => ({
      commandHistory: [...state.commandHistory, trimmed],
      inputText: '',
      historyIndex: null,
      historyDraft: '',
      isStagedChoiceManualOverride: false,
    }))
  },
  recallPreviousHistory: () => {
    set((state) => {
      if (state.commandHistory.length === 0) {
        return {}
      }
      if (state.historyIndex === null) {
        const nextIndex = state.commandHistory.length - 1
        return {
          historyIndex: nextIndex,
          historyDraft: state.inputText,
          inputText: state.commandHistory[nextIndex] ?? state.inputText,
        }
      }
      const nextIndex = Math.max(0, state.historyIndex - 1)
      return {
        historyIndex: nextIndex,
        inputText: state.commandHistory[nextIndex] ?? state.inputText,
      }
    })
  },
  recallNextHistory: () => {
    set((state) => {
      if (state.historyIndex === null) {
        return {}
      }
      if (state.historyIndex >= state.commandHistory.length - 1) {
        return {
          historyIndex: null,
          inputText: state.historyDraft,
          historyDraft: '',
        }
      }
      const nextIndex = state.historyIndex + 1
      return {
        historyIndex: nextIndex,
        inputText: state.commandHistory[nextIndex] ?? state.inputText,
      }
    })
  },
  resetHistoryNavigation: () => {
    set({
      historyIndex: null,
      historyDraft: '',
    })
  },
  setToolsOpen: (isToolsOpen) => {
    set({ isToolsOpen })
  },
  setLayerToolbarVisible: (isLayerToolbarVisible) => {
    set({ isLayerToolbarVisible })
  },
  setChromeHidden: (isChromeHidden) => {
    set({ isChromeHidden })
  },
  toggleExpanded: () => {
    set((state) => {
      if (state.windowMode === 'docked') {
        return {
          isExpanded: !state.isExpanded,
          expandedHeight: DEFAULT_EXPANDED_HEIGHT,
          windowMode: state.windowMode,
        }
      }
      return {
        isExpanded: true,
        expandedHeight: DEFAULT_EXPANDED_HEIGHT,
        windowMode: 'docked' as const,
      }
    })
  },
  setExpanded: (isExpanded) => {
    set({
      isExpanded,
      expandedHeight: DEFAULT_EXPANDED_HEIGHT,
      windowMode: DEFAULT_WINDOW_MODE,
    })
  },
  setExpandedHeight: (expandedHeight) => {
    set({ expandedHeight: clampExpandedHeight(expandedHeight) })
  },
  setExpandedHeightFromDrag: (expandedHeight) => {
    if (expandedHeight <= COLLAPSE_SNAP_HEIGHT) {
      set({
        isExpanded: false,
        expandedHeight: DEFAULT_EXPANDED_HEIGHT,
      })
      return
    }

    set({
      isExpanded: true,
      expandedHeight: clampExpandedHeight(expandedHeight),
    })
  },
  setSummaryWidth: (summaryWidth) => {
    set({ summaryWidth: clampSummaryWidth(summaryWidth) })
  },
  setBackgroundOpacity: (backgroundOpacity) => {
    set({ backgroundOpacity: clampPercent(backgroundOpacity) })
  },
  setTextOpacity: (textOpacity) => {
    set({ textOpacity: clampPercent(textOpacity) })
  },
  setFontSize: (fontSize) => {
    set({ fontSize: clampFontSize(fontSize) })
  },
  setZIndex: (zIndex) => {
    set({ zIndex: clampZIndex(zIndex) })
  },
  setBackgroundFillMode: (backgroundFillMode) => {
    set({ backgroundFillMode })
  },
  setBackgroundColorMode: (backgroundColorMode) => {
    set({ backgroundColorMode })
  },
  applyToolsPreset: (preset) => {
    if (preset === 'default') {
      set({
        backgroundOpacity: DEFAULT_BACKGROUND_OPACITY,
        textOpacity: DEFAULT_TEXT_OPACITY,
        fontSize: DEFAULT_FONT_SIZE,
        zIndex: DEFAULT_Z_INDEX,
        backgroundFillMode: DEFAULT_BACKGROUND_FILL_MODE,
        backgroundColorMode: DEFAULT_BACKGROUND_COLOR_MODE,
      })
      return
    }
    set({
      backgroundOpacity: CLEAR_PRESET_BACKGROUND_OPACITY,
      textOpacity: DEFAULT_TEXT_OPACITY,
      fontSize: DEFAULT_FONT_SIZE,
      zIndex: DEFAULT_Z_INDEX,
      backgroundFillMode: CLEAR_PRESET_BACKGROUND_FILL_MODE,
      backgroundColorMode: DEFAULT_BACKGROUND_COLOR_MODE,
    })
  },
  switchToDocked: (expanded = true) => {
    set((state) => ({
      windowMode: 'docked',
      isExpanded: expanded,
      expandedHeight: expanded ? state.expandedHeight : DEFAULT_EXPANDED_HEIGHT,
    }))
  },
  switchToFloating: () => {
    set((state) => ({
      windowMode: 'floating',
      isExpanded: false,
      floatingRect: state.lastFloatingRect,
    }))
  },
  switchToPopout: () => {
    set({
      windowMode: 'popout',
      isExpanded: false,
    })
  },
  switchToList: () => {
    set({
      isListMode: true,
    })
  },
  returnFromList: () => {
    set({
      isListMode: false,
    })
  },
  setFloatingRect: (floatingRect) => {
    set({
      floatingRect,
      lastFloatingRect: floatingRect,
    })
  },
  handlePopoutWindowClosed: () => {
    set({
      windowMode: 'docked',
      isExpanded: false,
    })
  },
  toggleVisibleLayer: (layer) => {
    set((state) => ({
      visibleLayers: {
        ...state.visibleLayers,
        [layer]: !state.visibleLayers[layer],
      },
    }))
  },
  setFilterMode: (filterMode) => {
    set((state) => {
      if (filterMode === 'isolate') {
        return {
          filterMode,
          isolatedLayer: state.isolatedLayer ?? 'Commands',
        }
      }
      if (filterMode === 'subset') {
        return {
          filterMode,
          subsetLayers: ensureAtLeastOneLayerVisible(
            state.subsetLayers,
            state.isolatedLayer ?? 'Commands',
          ),
        }
      }
      return { filterMode }
    })
  },
  setIsolatedLayer: (isolatedLayer) => {
    set({
      isolatedLayer,
      filterMode: 'isolate',
    })
  },
  toggleSubsetLayer: (layer) => {
    set((state) => ({
      subsetLayers: ensureAtLeastOneLayerVisible(
        {
          ...state.subsetLayers,
          [layer]: !state.subsetLayers[layer],
        },
        layer,
      ),
      filterMode: 'subset',
    }))
  },
  setDiagnosticsPinned: (isDiagnosticsPinned) => {
    set({ isDiagnosticsPinned })
  },
  setStagedNavigationSession: (stagedNavigationSession) => {
    set((state) => {
      if (stagedNavigationSession === null || stagedNavigationSession.validChoices.length === 0) {
        const fallbackDescriptor =
          stagedNavigationSession === null ? state.featureAssistDescriptor : state.featureAssistDescriptor
        if (fallbackDescriptor !== null && fallbackDescriptor.choices.length > 0) {
          const stagedChoiceIndex = 0
          const inputText = fallbackDescriptor.prefill ?? getAssistChoiceInputText(fallbackDescriptor.choices[stagedChoiceIndex])
          return {
            stagedNavigationSession,
            consolePromptSession: null,
            stagedChoiceIndex,
            isStagedChoiceManualOverride: false,
            inputText,
            historyIndex: null,
            historyDraft: '',
          }
        }
        return {
          stagedNavigationSession,
          consolePromptSession: null,
          stagedChoiceIndex: null,
          isStagedChoiceManualOverride: false,
        }
      }

      const stagedChoiceIndex = 0
      const inputText = getStagedChoiceInputText(stagedNavigationSession.validChoices[stagedChoiceIndex])
      return {
        stagedNavigationSession,
        consolePromptSession: null,
        stagedChoiceIndex,
        isStagedChoiceManualOverride: false,
        inputText,
        historyIndex: null,
        historyDraft: '',
      }
    })
  },
  setConsolePromptSession: (consolePromptSession) => {
    set((state) => {
      if (consolePromptSession === null) {
        const fallbackDescriptor =
          state.featureAssistDescriptor !== null
            ? state.featureAssistDescriptor
            : state.stagedNavigationSession !== null && state.stagedNavigationSession.validChoices.length > 0
            ? {
                label:
                  state.stagedNavigationSession.breadcrumb.at(-1) ??
                  state.stagedNavigationSession.scopeId,
                choices: descriptorChoicesFromStagedChoices(state.stagedNavigationSession.validChoices),
                prefill:
                  state.stagedNavigationSession.validChoices[0] === undefined
                    ? null
                    : getStagedChoiceInputText(state.stagedNavigationSession.validChoices[0]),
              }
            : null
        if (fallbackDescriptor !== null && fallbackDescriptor.choices.length > 0) {
          const stagedChoiceIndex = 0
          const inputText =
            fallbackDescriptor.prefill ??
            getAssistChoiceInputText(fallbackDescriptor.choices[stagedChoiceIndex]!)
          return {
            consolePromptSession: null,
            stagedChoiceIndex,
            isStagedChoiceManualOverride: false,
            inputText,
            historyIndex: null,
            historyDraft: '',
          }
        }
        return {
          consolePromptSession: null,
          stagedChoiceIndex: null,
          isStagedChoiceManualOverride: false,
        }
      }

      return {
        consolePromptSession,
        ...(consolePromptSession.kind === 'reference-transform.axis' ||
        consolePromptSession.kind === 'reference-transform.plane'
          ? {}
          : { stagedNavigationSession: null }),
        stagedChoiceIndex: 0,
        isStagedChoiceManualOverride: false,
        inputText: consolePromptSession.prefill,
        historyIndex: null,
        historyDraft: '',
      }
    })
  },
  updateConsolePromptSessionPrefill: (prefill) => {
    set((state) => {
      if (state.consolePromptSession === null || state.consolePromptSession.prefill === prefill) {
        return {}
      }
      const shouldMirrorInput =
        !state.isStagedChoiceManualOverride ||
        state.inputText.trim() === state.consolePromptSession.prefill.trim()
      return {
        consolePromptSession: {
          ...state.consolePromptSession,
          prefill,
        },
        ...(shouldMirrorInput
          ? {
              inputText: prefill,
            }
          : {}),
      }
    })
  },
  clearStagedNavigationSession: () => {
    set((state) => {
      if (state.featureAssistDescriptor !== null && state.featureAssistDescriptor.choices.length > 0) {
        const stagedChoiceIndex = 0
        const inputText =
          state.featureAssistDescriptor.prefill ??
          getAssistChoiceInputText(state.featureAssistDescriptor.choices[stagedChoiceIndex]!)
        return {
          stagedNavigationSession: null,
          stagedChoiceIndex,
          isStagedChoiceManualOverride: false,
          inputText,
          historyIndex: null,
          historyDraft: '',
        }
      }
      return {
        stagedNavigationSession: null,
        consolePromptSession: null,
        stagedChoiceIndex: null,
        isStagedChoiceManualOverride: false,
      }
    })
  },
  clearConsolePromptSession: () => {
    set((state) => {
      if (state.featureAssistDescriptor !== null && state.featureAssistDescriptor.choices.length > 0) {
        const stagedChoiceIndex = 0
        return {
          consolePromptSession: null,
          stagedChoiceIndex,
          isStagedChoiceManualOverride: false,
          inputText:
            state.featureAssistDescriptor.prefill ??
            getAssistChoiceInputText(state.featureAssistDescriptor.choices[stagedChoiceIndex]!),
          historyIndex: null,
          historyDraft: '',
        }
      }
      if (state.stagedNavigationSession !== null && state.stagedNavigationSession.validChoices.length > 0) {
        const stagedChoiceIndex = 0
        return {
          consolePromptSession: null,
          stagedChoiceIndex,
          isStagedChoiceManualOverride: false,
          inputText:
            getStagedChoiceInputText(state.stagedNavigationSession.validChoices[stagedChoiceIndex]!),
          historyIndex: null,
          historyDraft: '',
        }
      }
      return {
        consolePromptSession: null,
        stagedChoiceIndex: null,
        isStagedChoiceManualOverride: false,
      }
    })
  },
  setFeatureAssistDescriptor: (featureAssistDescriptor) => {
    set((state) => {
      const nextState = {
        featureAssistDescriptor,
      }
      if (state.consolePromptSession !== null) {
        return nextState
      }
      if (areAssistDescriptorsEqual(state.featureAssistDescriptor, featureAssistDescriptor)) {
        return nextState
      }
      if (featureAssistDescriptor === null || featureAssistDescriptor.choices.length === 0) {
        const shouldClearStaleAssistInput =
          !state.isStagedChoiceManualOverride &&
          ((state.featureAssistDescriptor !== null &&
            isInputDrivenByDescriptor(state.featureAssistDescriptor, state.inputText)) ||
            (state.stagedNavigationSession !== null &&
              isInputDrivenByStagedNavigationSession(state.stagedNavigationSession, state.inputText)))
        return {
          ...nextState,
          ...(shouldClearStaleAssistInput
            ? {
                inputText: '',
                historyIndex: null,
                historyDraft: '',
              }
            : {}),
          stagedChoiceIndex: null,
          isStagedChoiceManualOverride: false,
        }
      }
      const stagedChoiceIndex = 0
      const currentDescriptorDrivenInputText = getDescriptorDrivenInputText(state)
      const shouldPreserveExistingInput =
        state.inputText.trim().length > 0 &&
        (state.isStagedChoiceManualOverride ||
          currentDescriptorDrivenInputText === null ||
          normalizeChoiceToken(state.inputText) !==
            normalizeChoiceToken(currentDescriptorDrivenInputText))
      const inputText = shouldPreserveExistingInput
        ? state.inputText
        : (featureAssistDescriptor.prefill ??
          getAssistChoiceInputText(featureAssistDescriptor.choices[stagedChoiceIndex]!))
      const nextTracking = resolveStagedChoiceTracking(featureAssistDescriptor, inputText, {
        forceManualOverride: shouldPreserveExistingInput && state.isStagedChoiceManualOverride,
      })
      return {
        ...nextState,
        stagedChoiceIndex: nextTracking.stagedChoiceIndex,
        isStagedChoiceManualOverride: nextTracking.isStagedChoiceManualOverride,
        inputText,
        historyIndex: null,
        historyDraft: '',
      }
    })
  },
  cycleStagedChoice: (direction) => {
    set((state) => {
      const activeDescriptor = getActiveAssistDescriptor(state)
      if (activeDescriptor === null || activeDescriptor.choices.length === 0) {
        return {}
      }

      const currentIndex = state.stagedChoiceIndex ?? 0
      const delta = direction === 'next' ? 1 : -1
      const nextIndex =
        (currentIndex + delta + activeDescriptor.choices.length) % activeDescriptor.choices.length
      const nextChoice = activeDescriptor.choices[nextIndex]
      if (nextChoice === undefined) {
        return {}
      }

      return {
        stagedChoiceIndex: nextIndex,
        isStagedChoiceManualOverride: false,
        inputText: getAssistChoiceInputText(nextChoice),
        historyIndex: null,
        historyDraft: '',
      }
    })
  },
}))

export const appendConsoleEntry = (entry: ConsoleAppendEntryInput): void => {
  if (entry.text.trim().length === 0) {
    return
  }
  useConsoleStore.getState().appendEntry(entry)
}

export const CONSOLE_DEFAULT_EXPANDED_HEIGHT = DEFAULT_EXPANDED_HEIGHT
export const CONSOLE_MIN_EXPANDED_HEIGHT = MIN_EXPANDED_HEIGHT
export const CONSOLE_MAX_EXPANDED_HEIGHT = MAX_EXPANDED_HEIGHT
export const CONSOLE_COLLAPSE_SNAP_HEIGHT = COLLAPSE_SNAP_HEIGHT
export const CONSOLE_DEFAULT_SUMMARY_WIDTH = DEFAULT_SUMMARY_WIDTH
export const CONSOLE_MIN_SUMMARY_WIDTH = MIN_SUMMARY_WIDTH
export const CONSOLE_MAX_SUMMARY_WIDTH = MAX_SUMMARY_WIDTH
export const CONSOLE_DEFAULT_BACKGROUND_OPACITY = DEFAULT_BACKGROUND_OPACITY
export const CONSOLE_DEFAULT_TEXT_OPACITY = DEFAULT_TEXT_OPACITY
export const CONSOLE_DEFAULT_FONT_SIZE = DEFAULT_FONT_SIZE
export const CONSOLE_DEFAULT_Z_INDEX = DEFAULT_Z_INDEX
export const CONSOLE_MIN_Z_INDEX = MIN_Z_INDEX
export const CONSOLE_MAX_Z_INDEX = MAX_Z_INDEX
export const CONSOLE_DEFAULT_BACKGROUND_FILL_MODE = DEFAULT_BACKGROUND_FILL_MODE
export const CONSOLE_DEFAULT_BACKGROUND_COLOR_MODE = DEFAULT_BACKGROUND_COLOR_MODE
export const CONSOLE_DEFAULT_WINDOW_MODE = DEFAULT_WINDOW_MODE
export const CONSOLE_DEFAULT_FLOATING_RECT = DEFAULT_FLOATING_RECT
export const CONSOLE_CLEAR_PRESET_BACKGROUND_OPACITY = CLEAR_PRESET_BACKGROUND_OPACITY
export const CONSOLE_CLEAR_PRESET_BACKGROUND_FILL_MODE = CLEAR_PRESET_BACKGROUND_FILL_MODE
export const CONSOLE_LAYERS_IN_ORDER = CONSOLE_LAYERS
export const isConsoleEntryVisible = resolveConsoleEntryVisibility

export const getConsoleToolsPreset = ({
  backgroundOpacity,
  textOpacity,
  fontSize,
  zIndex,
  backgroundFillMode,
  backgroundColorMode,
}: Pick<
  ConsoleState,
  | 'backgroundOpacity'
  | 'textOpacity'
  | 'fontSize'
  | 'zIndex'
  | 'backgroundFillMode'
  | 'backgroundColorMode'
>): ConsoleToolsPreset => {
  if (
    backgroundOpacity === DEFAULT_BACKGROUND_OPACITY &&
    textOpacity === DEFAULT_TEXT_OPACITY &&
    fontSize === DEFAULT_FONT_SIZE &&
    zIndex === DEFAULT_Z_INDEX &&
    backgroundFillMode === DEFAULT_BACKGROUND_FILL_MODE &&
    backgroundColorMode === DEFAULT_BACKGROUND_COLOR_MODE
  ) {
    return 'default'
  }
  if (
    backgroundOpacity === CLEAR_PRESET_BACKGROUND_OPACITY &&
    textOpacity === DEFAULT_TEXT_OPACITY &&
    fontSize === DEFAULT_FONT_SIZE &&
    zIndex === DEFAULT_Z_INDEX &&
    backgroundFillMode === CLEAR_PRESET_BACKGROUND_FILL_MODE &&
    backgroundColorMode === DEFAULT_BACKGROUND_COLOR_MODE
  ) {
    return 'clear'
  }
  return 'custom'
}
