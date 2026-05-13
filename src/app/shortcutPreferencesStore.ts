import { create } from 'zustand'
import type { ShortcutBasePresetId } from './shortcutInventoryReadModel'
import type { ShortcutBindingOverride } from './shortcutCustomPresetModel'

export type ShortcutPreferencesState = {
  selectedShortcutBasePresetId: ShortcutBasePresetId
  shortcutBindingOverrides: readonly ShortcutBindingOverride[]
  setSelectedShortcutBasePresetId: (presetId: ShortcutBasePresetId) => void
  setShortcutBindingOverrides: (overrides: readonly ShortcutBindingOverride[]) => void
  resetShortcutPreferences: () => void
}

const defaultShortcutPreferences = {
  selectedShortcutBasePresetId: 'default' as ShortcutBasePresetId,
  shortcutBindingOverrides: [] as readonly ShortcutBindingOverride[],
}

export const useShortcutPreferencesStore = create<ShortcutPreferencesState>((set) => ({
  ...defaultShortcutPreferences,
  setSelectedShortcutBasePresetId: (presetId) => {
    set({ selectedShortcutBasePresetId: presetId })
  },
  setShortcutBindingOverrides: (overrides) => {
    set({ shortcutBindingOverrides: [...overrides] })
  },
  resetShortcutPreferences: () => {
    set(defaultShortcutPreferences)
  },
}))

