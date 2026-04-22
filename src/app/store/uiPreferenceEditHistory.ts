import { editHistoryStore } from './editHistoryStore'
import type { WorkspaceStartupSurface } from './uiPrefsStore'
import { useUiPrefsStore } from './uiPrefsStore'

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

const workspaceRestorePersistenceConfig: UiPreferenceHistoryConfig<boolean> = {
  label: 'Change persistence preference',
  sourceId: 'storage-management',
  sourceLabel: 'Storage Management',
  targetId: 'ui-pref:workspaceRestorePersistence',
  targetLabel: 'Workspace restore persistence',
  getValue: () => useUiPrefsStore.getState().workspaceRestorePersistence,
  setValue: (value) => useUiPrefsStore.getState().setWorkspaceRestorePersistence(value),
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

export const setWorkspaceRestorePersistenceWithHistory = (
  nextValue: boolean,
  options?: UiPreferenceHistoryOptions,
): boolean => commitUiPreferenceWithHistory(workspaceRestorePersistenceConfig, nextValue, options)

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
