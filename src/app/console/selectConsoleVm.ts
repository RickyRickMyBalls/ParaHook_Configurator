import type { ConsoleLayer, ConsoleTranscriptEntry } from './consoleTypes'
import { CONSOLE_LAYERS_IN_ORDER } from './useConsoleStore'

type ConsoleSelectorState = {
  isExpanded: boolean
  expandedHeight: number
  inputText: string
  entries: ConsoleTranscriptEntry[]
  visibleLayers: Record<ConsoleLayer, boolean>
}

export type ConsoleVm = {
  isExpanded: boolean
  expandedHeight: number
  inputText: string
  summaryText: string
  visibleEntries: ConsoleTranscriptEntry[]
  layerStates: Array<{
    layer: ConsoleLayer
    isVisible: boolean
  }>
}

export const selectConsoleVm = (state: ConsoleSelectorState): ConsoleVm => {
  const visibleEntries = state.entries.filter((entry) => state.visibleLayers[entry.layer] ?? true)
  const latestVisibleEntry = visibleEntries.at(-1) ?? null

  return {
    isExpanded: state.isExpanded,
    expandedHeight: state.expandedHeight,
    inputText: state.inputText,
    summaryText: latestVisibleEntry?.text ?? 'Ready',
    visibleEntries,
    layerStates: CONSOLE_LAYERS_IN_ORDER.map((layer) => ({
      layer,
      isVisible: state.visibleLayers[layer] ?? true,
    })),
  }
}
