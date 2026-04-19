import {
  normalizeViewSettings,
  type LegacyViewSettingsInput,
  type ViewSettings,
} from '../../shared/viewSettingsTypes'

export const uiPrefsStorageKey = 'parahook.uiPrefs.view.v1'

type PersistedUiPrefsState = {
  version: 1
  view: ViewSettings
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const normalizePersistedView = (value: unknown): ViewSettings | null => {
  if (!isRecord(value)) {
    return null
  }

  if (isRecord(value.view)) {
    return normalizeViewSettings(value.view as LegacyViewSettingsInput)
  }

  return normalizeViewSettings(value as LegacyViewSettingsInput)
}

export const serializePersistedUiPrefs = (view: ViewSettings): PersistedUiPrefsState => ({
  version: 1,
  view: normalizeViewSettings(view),
})

export const normalizePersistedUiPrefs = (value: unknown): PersistedUiPrefsState | null => {
  const view = normalizePersistedView(value)
  if (view === null) {
    return null
  }
  return {
    version: 1,
    view,
  }
}

export const readPersistedUiPrefs = (): PersistedUiPrefsState | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(uiPrefsStorageKey)
    if (rawValue === null || rawValue.length === 0) {
      return null
    }
    return normalizePersistedUiPrefs(JSON.parse(rawValue))
  } catch {
    return null
  }
}

export const writePersistedUiPrefs = (snapshot: PersistedUiPrefsState): void => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(uiPrefsStorageKey, JSON.stringify(snapshot))
  } catch {
    // Ignore storage write failures so environment look persistence never blocks the app.
  }
}
