import { editHistoryStore } from './editHistoryStore'
import type { ConsoleInputPriorityMode, WorkspaceStartupSurface } from './uiPrefsStore'
import { useUiPrefsStore } from './uiPrefsStore'
import type { SpaghettiWindowAppearance } from '../panels/spaghettiWindowAppearance'

type UiPreferenceHistoryOptions = {
  entryId?: string
}

type UiPreferenceHistoryConfig<TValue> = {
  label: string
  sourceId: string
  sourceLabel: string
  targetId: string
  targetLabel: string
  getValue: () => TValue
  setValue: (value: TValue) => void
}

let uiPreferenceHistorySequence = 0

const uiPreferenceHistorySource = {
  surface: 'home-page',
}

const nextUiPreferenceHistoryEntryId = (): string => {
  uiPreferenceHistorySequence += 1
  return `ui-preference-${uiPreferenceHistorySequence}`
}

const commitUiPreferenceWithHistory = <TValue>(
  config: UiPreferenceHistoryConfig<TValue>,
  nextValue: TValue,
  options: UiPreferenceHistoryOptions = {},
): boolean => {
  const beforeValue = config.getValue()
  config.setValue(nextValue)
  const afterValue = config.getValue()

  if (Object.is(beforeValue, afterValue)) {
    return false
  }

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextUiPreferenceHistoryEntryId(),
    label: config.label,
    source: {
      ...uiPreferenceHistorySource,
      sourceId: config.sourceId,
      sourceLabel: config.sourceLabel,
    },
    targetId: config.targetId,
    targetLabel: config.targetLabel,
    undo: () => config.setValue(beforeValue),
    redo: () => config.setValue(afterValue),
  })
}

const workspaceStartupSurfaceConfig: UiPreferenceHistoryConfig<WorkspaceStartupSurface> = {
  label: 'Change startup preference',
  sourceId: 'startup-preferences',
  sourceLabel: 'Startup preferences',
  targetId: 'ui-pref:workspaceStartupSurface',
  targetLabel: 'Startup surface',
  getValue: () => useUiPrefsStore.getState().workspaceStartupSurface,
  setValue: (value) => useUiPrefsStore.getState().setWorkspaceStartupSurface(value),
}

const consoleInputPriorityModeConfig: UiPreferenceHistoryConfig<ConsoleInputPriorityMode> = {
  label: 'Change Console input priority',
  sourceId: 'general-settings',
  sourceLabel: 'General Settings',
  targetId: 'ui-pref:consoleInputPriorityMode',
  targetLabel: 'Console input priority',
  getValue: () => useUiPrefsStore.getState().consoleInputPriorityMode,
  setValue: (value) => useUiPrefsStore.getState().setConsoleInputPriorityMode(value),
}

const spaghettiWindowAppearanceDefaultsConfig: UiPreferenceHistoryConfig<SpaghettiWindowAppearance> = {
  label: 'Change Spaghetti Editor defaults',
  sourceId: 'spaghetti-editor-defaults',
  sourceLabel: 'Spaghetti Editor Defaults',
  targetId: 'ui-pref:spaghettiWindowAppearanceDefaults',
  targetLabel: 'Spaghetti Editor window appearance defaults',
  getValue: () => useUiPrefsStore.getState().spaghettiWindowAppearanceDefaults,
  setValue: (value) => useUiPrefsStore.getState().setSpaghettiWindowAppearanceDefaults(value),
}

const workspaceRestorePersistenceConfig: UiPreferenceHistoryConfig<boolean> = {
  label: 'Change persistence preference',
  sourceId: 'storage-management',
  sourceLabel: 'Storage Management',
  targetId: 'ui-pref:workspaceRestorePersistence',
  targetLabel: 'Workspace restore persistence',
  getValue: () => useUiPrefsStore.getState().workspaceRestorePersistence,
  setValue: (value) => useUiPrefsStore.getState().setWorkspaceRestorePersistence(value),
}

const workspacePaneFilletRadiusConfig: UiPreferenceHistoryConfig<number> = {
  label: 'Change workspace corner radius',
  sourceId: 'workspace-settings',
  sourceLabel: 'Workspace Settings',
  targetId: 'ui-pref:workspacePaneFilletRadiusPx',
  targetLabel: 'Workspace corner radius',
  getValue: () => useUiPrefsStore.getState().workspacePaneFilletRadiusPx,
  setValue: (value) => useUiPrefsStore.getState().setWorkspacePaneFilletRadiusPx(value),
}

const workspacePanelShellPaddingConfig: UiPreferenceHistoryConfig<number> = {
  label: 'Change workspace panel shell padding',
  sourceId: 'workspace-settings',
  sourceLabel: 'Workspace Settings',
  targetId: 'ui-pref:workspacePanelShellPaddingPx',
  targetLabel: 'Workspace panel shell padding',
  getValue: () => useUiPrefsStore.getState().workspacePanelShellPaddingPx,
  setValue: (value) => useUiPrefsStore.getState().setWorkspacePanelShellPaddingPx(value),
}

const workspaceNestedResizeKeepsFarPaneConfig: UiPreferenceHistoryConfig<boolean> = {
  label: 'Change workspace resize behavior',
  sourceId: 'workspace-settings',
  sourceLabel: 'Workspace Settings',
  targetId: 'ui-pref:workspaceNestedResizeKeepsFarPane',
  targetLabel: 'Keep far pane fixed on nested resize',
  getValue: () => useUiPrefsStore.getState().workspaceNestedResizeKeepsFarPane,
  setValue: (value) => useUiPrefsStore.getState().setWorkspaceNestedResizeKeepsFarPane(value),
}

const viewSettingsPersistenceConfig: UiPreferenceHistoryConfig<boolean> = {
  label: 'Change persistence preference',
  sourceId: 'storage-management',
  sourceLabel: 'Storage Management',
  targetId: 'ui-pref:viewSettingsPersistence',
  targetLabel: 'View settings persistence',
  getValue: () => useUiPrefsStore.getState().viewSettingsPersistence,
  setValue: (value) => useUiPrefsStore.getState().setViewSettingsPersistence(value),
}

const environmentPersistenceConfig: UiPreferenceHistoryConfig<boolean> = {
  label: 'Change persistence preference',
  sourceId: 'storage-management',
  sourceLabel: 'Storage Management',
  targetId: 'ui-pref:environmentPersistence',
  targetLabel: 'Environment persistence',
  getValue: () => useUiPrefsStore.getState().environmentPersistence,
  setValue: (value) => useUiPrefsStore.getState().setEnvironmentPersistence(value),
}

const dashboardPersistenceConfig: UiPreferenceHistoryConfig<boolean> = {
  label: 'Change persistence preference',
  sourceId: 'storage-management',
  sourceLabel: 'Storage Management',
  targetId: 'ui-pref:dashboardPersistence',
  targetLabel: 'Dashboard persistence',
  getValue: () => useUiPrefsStore.getState().dashboardPersistence,
  setValue: (value) => useUiPrefsStore.getState().setDashboardPersistence(value),
}

const notepadPersistenceConfig: UiPreferenceHistoryConfig<boolean> = {
  label: 'Change persistence preference',
  sourceId: 'storage-management',
  sourceLabel: 'Storage Management',
  targetId: 'ui-pref:notepadPersistence',
  targetLabel: 'Notepad persistence',
  getValue: () => useUiPrefsStore.getState().notepadPersistence,
  setValue: (value) => useUiPrefsStore.getState().setNotepadPersistence(value),
}

export const setWorkspaceStartupSurfaceWithHistory = (
  nextValue: WorkspaceStartupSurface,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(workspaceStartupSurfaceConfig, nextValue, options)

export const setConsoleInputPriorityModeWithHistory = (
  nextValue: ConsoleInputPriorityMode,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(consoleInputPriorityModeConfig, nextValue, options)

export const setSpaghettiWindowAppearanceDefaultsWithHistory = (
  nextValue: SpaghettiWindowAppearance,
  options?: UiPreferenceHistoryOptions,
): boolean =>
  commitUiPreferenceWithHistory(spaghettiWindowAppearanceDefaultsConfig, nextValue, options)

export const setWorkspaceRestorePersistenceWithHistory = (
  nextValue: boolean,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(workspaceRestorePersistenceConfig, nextValue, options)

export const setWorkspacePaneFilletRadiusWithHistory = (
  nextValue: number,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(workspacePaneFilletRadiusConfig, nextValue, options)

export const setWorkspacePanelShellPaddingWithHistory = (
  nextValue: number,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(workspacePanelShellPaddingConfig, nextValue, options)

export const setWorkspaceNestedResizeKeepsFarPaneWithHistory = (
  nextValue: boolean,
  options?: UiPreferenceHistoryOptions,
): boolean =>
  commitUiPreferenceWithHistory(workspaceNestedResizeKeepsFarPaneConfig, nextValue, options)

export const setViewSettingsPersistenceWithHistory = (
  nextValue: boolean,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(viewSettingsPersistenceConfig, nextValue, options)

export const setEnvironmentPersistenceWithHistory = (
  nextValue: boolean,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(environmentPersistenceConfig, nextValue, options)

export const setDashboardPersistenceWithHistory = (
  nextValue: boolean,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(dashboardPersistenceConfig, nextValue, options)

export const setNotepadPersistenceWithHistory = (
  nextValue: boolean,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(notepadPersistenceConfig, nextValue, options)
