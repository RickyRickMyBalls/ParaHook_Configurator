import { create } from 'zustand'
import { newId } from '../spaghetti/utils/id'
import type {
  ConsoleAppendEntryInput,
  ConsoleBackgroundColorMode,
  ConsoleBackgroundFillMode,
  ConsoleFilterMode,
  ConsoleFloatingRect,
  ConsoleLayer,
  ConsoleLayerVisibility,
  ConsoleSeverity,
  ConsoleTranscriptEntry,
  ConsoleToolsPreset,
  ConsoleWindowMode,
} from './consoleTypes'

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

type ConsoleState = {
  isExpanded: boolean
  windowMode: ConsoleWindowMode
  isListMode: boolean
  expandedHeight: number
  inputText: string
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
  appendEntry: (entry: ConsoleAppendEntryInput) => void
  clearEntries: () => void
  setInputText: (value: string) => void
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
}

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

const clampPercent = (value: number): number => Math.min(100, Math.max(0, Math.round(value)))
const clampFontSize = (value: number): number => Math.min(24, Math.max(1, Math.round(value)))
const clampZIndex = (value: number): number =>
  Math.min(MAX_Z_INDEX, Math.max(MIN_Z_INDEX, Math.round(value)))

const createEntry = (
  sequence: number,
  input: ConsoleAppendEntryInput,
): ConsoleTranscriptEntry => {
  const createdAtMs = Date.now()
  const severity: ConsoleSeverity = input.severity ?? 'normal'
  return {
    id: newId('console-entry'),
    sequence,
    createdAtMs,
    timestampLabel: formatTimestamp(createdAtMs),
    layer: input.layer,
    text: input.text,
    source: input.source ?? null,
    severity,
  }
}

export const useConsoleStore = create<ConsoleState>((set, get) => ({
  isExpanded: false,
  windowMode: DEFAULT_WINDOW_MODE,
  isListMode: false,
  expandedHeight: DEFAULT_EXPANDED_HEIGHT,
  inputText: '',
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
  appendEntry: (entry) => {
    const nextSequence = (get().entries.at(-1)?.sequence ?? 0) + 1
    set((state) => ({
      entries: [...state.entries, createEntry(nextSequence, entry)],
    }))
  },
  clearEntries: () => {
    set({ entries: [] })
  },
  setInputText: (inputText) => {
    set({
      inputText,
      historyIndex: null,
      historyDraft: '',
    })
  },
  pushCommandHistory: (value) => {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      set({
        inputText: '',
        historyIndex: null,
        historyDraft: '',
      })
      return
    }
    set((state) => ({
      commandHistory: [...state.commandHistory, trimmed],
      inputText: '',
      historyIndex: null,
      historyDraft: '',
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
