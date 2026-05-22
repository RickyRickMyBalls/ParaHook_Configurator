import {
  normalizeViewSettings,
  type LegacyViewSettingsInput,
  type ViewSettings,
} from '../../shared/viewSettingsTypes'
import {
  defaultSpaghettiWindowAppearance,
  normalizeSpaghettiWindowAppearance,
  type SpaghettiWindowAppearance,
} from '../panels/spaghettiWindowAppearance'
import {
  DEFAULT_CONSOLE_INPUT_PRIORITY_MODE,
  DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX,
  DEFAULT_WORKSPACE_PANEL_SHELL_PADDING_PX,
  MAX_WORKSPACE_PANE_FILLET_RADIUS_PX,
  MAX_WORKSPACE_PANEL_SHELL_PADDING_PX,
  MIN_WORKSPACE_PANE_FILLET_RADIUS_PX,
  MIN_WORKSPACE_PANEL_SHELL_PADDING_PX,
  type ConsoleInputPriorityMode,
  type WorkspaceStartupSurface,
} from './uiPrefsStore'
import {
  DEFAULT_VISUAL_STYLE_MENU_RECIPE_ID,
  normalizeVisualStyleMenuRecipeId,
  type VisualStyleMenuRecipeId,
} from '../visualStyleMenuRecipes'

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
  version: 3
  view: ViewSettings
  workspaceStartupSurface: WorkspaceStartupSurface
  consoleInputPriorityMode: ConsoleInputPriorityMode
  spaghettiWindowAppearanceDefaults: SpaghettiWindowAppearance
  workspacePaneFilletRadiusPx: number
  workspacePanelShellPaddingPx: number
  workspaceNestedResizeKeepsFarPane: boolean
  radialMenuRecipeId: VisualStyleMenuRecipeId
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

const normalizeConsoleInputPriorityMode = (value: unknown): ConsoleInputPriorityMode =>
  value === 'shortcuts-first' ? 'shortcuts-first' : DEFAULT_CONSOLE_INPUT_PRIORITY_MODE

const normalizeWorkspacePaneFilletRadiusPx = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(
        MAX_WORKSPACE_PANE_FILLET_RADIUS_PX,
        Math.max(MIN_WORKSPACE_PANE_FILLET_RADIUS_PX, Math.round(value)),
      )
    : DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX

const normalizeWorkspacePanelShellPaddingPx = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(
        MAX_WORKSPACE_PANEL_SHELL_PADDING_PX,
        Math.max(MIN_WORKSPACE_PANEL_SHELL_PADDING_PX, Math.round(value)),
      )
    : DEFAULT_WORKSPACE_PANEL_SHELL_PADDING_PX

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

const normalizeWorkspaceNestedResizeKeepsFarPane = (value: unknown): boolean =>
  typeof value === 'boolean' ? value : true

const normalizeRadialMenuRecipeId = (value: unknown): VisualStyleMenuRecipeId =>
  normalizeVisualStyleMenuRecipeId(value)

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
    nextView.displayMode = persistedView.displayMode
    nextView.wireframe = persistedView.wireframe
    nextView.edgeDisplayMode = persistedView.edgeDisplayMode
    nextView.geometryDisplay = persistedView.geometryDisplay
    nextView.viewportStyle = persistedView.viewportStyle
    nextView.ground = persistedView.ground
    nextView.gridPresentation = persistedView.gridPresentation
    nextView.renderPreview = persistedView.renderPreview
    nextView.postProcessing = persistedView.postProcessing
    nextView.contactShadows = persistedView.contactShadows
    nextView.highlights = persistedView.highlights
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
  spaghettiWindowAppearanceDefaults: SpaghettiWindowAppearance = defaultSpaghettiWindowAppearance,
  policy: UiPrefsPersistencePolicy = defaultUiPrefsPersistencePolicy,
  workspacePaneFilletRadiusPx = DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX,
  workspacePanelShellPaddingPx = DEFAULT_WORKSPACE_PANEL_SHELL_PADDING_PX,
  workspaceNestedResizeKeepsFarPane = true,
  consoleInputPriorityMode: ConsoleInputPriorityMode = DEFAULT_CONSOLE_INPUT_PRIORITY_MODE,
  radialMenuRecipeId: VisualStyleMenuRecipeId = DEFAULT_VISUAL_STYLE_MENU_RECIPE_ID,
): PersistedUiPrefsState => ({
  version: 3,
  view: normalizeViewSettings(view),
  workspaceStartupSurface,
  consoleInputPriorityMode: normalizeConsoleInputPriorityMode(consoleInputPriorityMode),
  spaghettiWindowAppearanceDefaults: normalizeSpaghettiWindowAppearance(
    spaghettiWindowAppearanceDefaults,
  ),
  workspacePaneFilletRadiusPx: normalizeWorkspacePaneFilletRadiusPx(workspacePaneFilletRadiusPx),
  workspacePanelShellPaddingPx: normalizeWorkspacePanelShellPaddingPx(
    workspacePanelShellPaddingPx,
  ),
  workspaceNestedResizeKeepsFarPane: normalizeWorkspaceNestedResizeKeepsFarPane(
    workspaceNestedResizeKeepsFarPane,
  ),
  radialMenuRecipeId: normalizeRadialMenuRecipeId(radialMenuRecipeId),
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
    version: 3,
    view,
    workspaceStartupSurface: normalizeWorkspaceStartupSurface(
      isRecord(value) ? value.workspaceStartupSurface : null,
    ),
    consoleInputPriorityMode: normalizeConsoleInputPriorityMode(
      isRecord(value) ? value.consoleInputPriorityMode : null,
    ),
    spaghettiWindowAppearanceDefaults: normalizeSpaghettiWindowAppearance(
      isRecord(value) && isRecord(value.spaghettiWindowAppearanceDefaults)
        ? (value.spaghettiWindowAppearanceDefaults as SpaghettiWindowAppearance)
        : defaultSpaghettiWindowAppearance,
    ),
    workspacePaneFilletRadiusPx: normalizeWorkspacePaneFilletRadiusPx(
      isRecord(value) ? value.workspacePaneFilletRadiusPx : null,
    ),
    workspacePanelShellPaddingPx: normalizeWorkspacePanelShellPaddingPx(
      isRecord(value) ? value.workspacePanelShellPaddingPx : null,
    ),
    workspaceNestedResizeKeepsFarPane: normalizeWorkspaceNestedResizeKeepsFarPane(
      isRecord(value) ? value.workspaceNestedResizeKeepsFarPane : null,
    ),
    radialMenuRecipeId: normalizeRadialMenuRecipeId(
      isRecord(value) ? value.radialMenuRecipeId : null,
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
    nextView.displayMode = currentView.displayMode
    nextView.wireframe = currentView.wireframe
    nextView.edgeDisplayMode = currentView.edgeDisplayMode
    nextView.viewportStyle = currentView.viewportStyle
    nextView.ground = currentView.ground
    nextView.gridPresentation = currentView.gridPresentation
    nextView.renderPreview = currentView.renderPreview
    nextView.postProcessing = currentView.postProcessing
    nextView.contactShadows = currentView.contactShadows
    nextView.geometryDisplay = currentView.geometryDisplay
    nextView.highlights = currentView.highlights
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
