import {
  normalizeViewSettings,
  type LegacyViewSettingsInput,
  type ViewSettings,
} from '../../shared/viewSettingsTypes'
import type { WorkspaceStartupSurface } from './uiPrefsStore'

export const uiPrefsStorageKey = 'parahook.uiPrefs.view.v1'

export type UiPrefsPersistencePolicy = {
  workspaceRestorePersistence: boolean
  viewSettingsPersistence: boolean
  environmentPersistence: boolean
  dashboardPersistence: boolean
  notepadPersistence: boolean
}

export const defaultUiPrefsPersistencePolicy: UiPrefsPersistencePolicy = {
  workspaceRestorePersistence: true,
  viewSettingsPersistence: true,
  environmentPersistence: true,
  dashboardPersistence: true,
  notepadPersistence: true,
}

type PersistedUiPrefsState = UiPrefsPersistencePolicy & {
  version: 2
  view: ViewSettings
  workspaceStartupSurface: WorkspaceStartupSurface
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

const normalizeWorkspaceStartupSurface = (value: unknown): WorkspaceStartupSurface =>
  value === 'modelViewer' ? 'modelViewer' : 'homePage'

const normalizeUiPrefsPersistencePolicy = (value: unknown): UiPrefsPersistencePolicy => ({
  workspaceRestorePersistence:
    isRecord(value) && typeof value.workspaceRestorePersistence === 'boolean'
      ? value.workspaceRestorePersistence
      : defaultUiPrefsPersistencePolicy.workspaceRestorePersistence,
  viewSettingsPersistence:
    isRecord(value) && typeof value.viewSettingsPersistence === 'boolean'
      ? value.viewSettingsPersistence
      : defaultUiPrefsPersistencePolicy.viewSettingsPersistence,
  environmentPersistence:
    isRecord(value) && typeof value.environmentPersistence === 'boolean'
      ? value.environmentPersistence
      : defaultUiPrefsPersistencePolicy.environmentPersistence,
  dashboardPersistence:
    isRecord(value) && typeof value.dashboardPersistence === 'boolean'
      ? value.dashboardPersistence
      : defaultUiPrefsPersistencePolicy.dashboardPersistence,
  notepadPersistence:
    isRecord(value) && typeof value.notepadPersistence === 'boolean'
      ? value.notepadPersistence
      : defaultUiPrefsPersistencePolicy.notepadPersistence,
})

const applyPersistedViewPolicy = (
  baseView: ViewSettings,
  persistedView: ViewSettings,
  policy: Pick<UiPrefsPersistencePolicy, 'viewSettingsPersistence' | 'environmentPersistence'>,
): ViewSettings => {
  const nextView: LegacyViewSettingsInput = {
    ...baseView,
  }

  if (policy.viewSettingsPersistence) {
    nextView.projectionMode = persistedView.projectionMode
    nextView.orbitEnabled = persistedView.orbitEnabled
    nextView.gridVisible = persistedView.gridVisible
    nextView.axesVisible = persistedView.axesVisible
    nextView.shadowsEnabled = persistedView.shadowsEnabled
    nextView.wireframe = persistedView.wireframe
    nextView.ground = persistedView.ground
    nextView.axisOverlayEnabled = persistedView.axisOverlayEnabled
    nextView.axisOverlayStyle = persistedView.axisOverlayStyle
    nextView.materials = persistedView.materials
  }

  if (policy.environmentPersistence) {
    nextView.envPreset = persistedView.envPreset
    nextView.environmentGrade = persistedView.environmentGrade
    nextView.environmentSource = persistedView.environmentSource
    nextView.lighting = persistedView.lighting
  }

  return normalizeViewSettings(nextView)
}

export const serializePersistedUiPrefs = (
  view: ViewSettings,
  workspaceStartupSurface: WorkspaceStartupSurface,
  policy: UiPrefsPersistencePolicy = defaultUiPrefsPersistencePolicy,
): PersistedUiPrefsState => ({
  version: 2,
  view: normalizeViewSettings(view),
  workspaceStartupSurface,
  workspaceRestorePersistence: policy.workspaceRestorePersistence,
  viewSettingsPersistence: policy.viewSettingsPersistence,
  environmentPersistence: policy.environmentPersistence,
  dashboardPersistence: policy.dashboardPersistence,
  notepadPersistence: policy.notepadPersistence,
})

export const normalizePersistedUiPrefs = (value: unknown): PersistedUiPrefsState | null => {
  const view = normalizePersistedView(value)
  if (view === null) {
    return null
  }

  const policy = normalizeUiPrefsPersistencePolicy(value)

  return {
    version: 2,
    view,
    workspaceStartupSurface: normalizeWorkspaceStartupSurface(
      isRecord(value) ? value.workspaceStartupSurface : null,
    ),
    workspaceRestorePersistence: policy.workspaceRestorePersistence,
    viewSettingsPersistence: policy.viewSettingsPersistence,
    environmentPersistence: policy.environmentPersistence,
    dashboardPersistence: policy.dashboardPersistence,
    notepadPersistence: policy.notepadPersistence,
  }
}

export const applyPersistedUiPrefsView = (
  baseView: ViewSettings,
  persistedUiPrefs: Pick<
    PersistedUiPrefsState,
    'view' | 'viewSettingsPersistence' | 'environmentPersistence'
  >,
): ViewSettings =>
  applyPersistedViewPolicy(baseView, persistedUiPrefs.view, {
    viewSettingsPersistence: persistedUiPrefs.viewSettingsPersistence,
    environmentPersistence: persistedUiPrefs.environmentPersistence,
  })

export const mergePersistedUiPrefsView = (
  currentView: ViewSettings,
  persistedView: ViewSettings,
  policy: Pick<UiPrefsPersistencePolicy, 'viewSettingsPersistence' | 'environmentPersistence'>,
): ViewSettings => {
  const nextView: LegacyViewSettingsInput = {
    ...persistedView,
  }

  if (policy.viewSettingsPersistence) {
    nextView.projectionMode = currentView.projectionMode
    nextView.orbitEnabled = currentView.orbitEnabled
    nextView.gridVisible = currentView.gridVisible
    nextView.axesVisible = currentView.axesVisible
    nextView.shadowsEnabled = currentView.shadowsEnabled
    nextView.wireframe = currentView.wireframe
    nextView.ground = currentView.ground
    nextView.axisOverlayEnabled = currentView.axisOverlayEnabled
    nextView.axisOverlayStyle = currentView.axisOverlayStyle
    nextView.materials = currentView.materials
  }

  if (policy.environmentPersistence) {
    nextView.envPreset = currentView.envPreset
    nextView.environmentGrade = currentView.environmentGrade
    nextView.environmentSource = currentView.environmentSource
    nextView.lighting = currentView.lighting
  }

  return normalizeViewSettings(nextView)
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
