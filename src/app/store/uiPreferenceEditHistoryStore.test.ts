import { beforeEach, describe, expect, it } from 'vitest'
import { type EditHistoryEntry, editHistoryStore } from './editHistoryStore'
import {
  setDashboardPersistenceWithHistory,
  setEnvironmentPersistenceWithHistory,
  setNotepadPersistenceWithHistory,
  setSpaghettiWindowAppearanceDefaultsWithHistory,
  setViewSettingsPersistenceWithHistory,
  setWorkspaceRestorePersistenceWithHistory,
  setWorkspaceStartupSurfaceWithHistory,
} from './uiPreferenceEditHistory'
import { useUiPrefsStore, type WorkspaceStartupSurface } from './uiPrefsStore'
import {
  defaultSpaghettiWindowAppearance,
  normalizeSpaghettiWindowAppearance,
} from '../panels/spaghettiWindowAppearance'

const redoEntryId = 'ui-preference-history-redo'

const seedRedoEntry = () => {
  const marker = { value: 'after' }
  const entry: EditHistoryEntry = {
    entryId: redoEntryId,
    label: 'UI preference history redo',
    source: {
      surface: 'ui-preference-history',
      sourceId: 'test',
      sourceLabel: 'UI preference history test',
    },
    undo: () => {
      marker.value = 'before'
    },
    redo: () => {
      marker.value = 'after'
    },
  }

  editHistoryStore.commitEntry(entry)
  editHistoryStore.undo()

  expect(marker.value).toBe('before')
  expect(editHistoryStore.getUndoEntries()).toEqual([])
  expect(editHistoryStore.getRedoEntries().map((redoEntry) => redoEntry.entryId)).toEqual([
    redoEntryId,
  ])

  return marker
}

const expectRedoPreserved = (marker: { value: string }) => {
  expect(marker.value).toBe('before')
  expect(editHistoryStore.getUndoEntries()).toEqual([])
  expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([redoEntryId])
  expect(editHistoryStore.canRedo()).toBe(true)
}

describe('UI preference edit history', () => {
  beforeEach(() => {
    editHistoryStore.clear()
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
  })

  it.each([
    {
      name: 'startup surface',
      run: () => setWorkspaceStartupSurfaceWithHistory('modelViewer'),
      expectedValue: 'modelViewer' as WorkspaceStartupSurface,
      getValue: () => useUiPrefsStore.getState().workspaceStartupSurface,
      label: 'Change startup preference',
      sourceId: 'startup-preferences',
      sourceLabel: 'Startup preferences',
      targetId: 'ui-pref:workspaceStartupSurface',
      targetLabel: 'Startup surface',
    },
    {
      name: 'workspace restore persistence',
      run: () => setWorkspaceRestorePersistenceWithHistory(false),
      expectedValue: false,
      getValue: () => useUiPrefsStore.getState().workspaceRestorePersistence,
      label: 'Change persistence preference',
      sourceId: 'storage-management',
      sourceLabel: 'Storage Management',
      targetId: 'ui-pref:workspaceRestorePersistence',
      targetLabel: 'Workspace restore persistence',
    },
    {
      name: 'view settings persistence',
      run: () => setViewSettingsPersistenceWithHistory(false),
      expectedValue: false,
      getValue: () => useUiPrefsStore.getState().viewSettingsPersistence,
      label: 'Change persistence preference',
      sourceId: 'storage-management',
      sourceLabel: 'Storage Management',
      targetId: 'ui-pref:viewSettingsPersistence',
      targetLabel: 'View settings persistence',
    },
    {
      name: 'environment persistence',
      run: () => setEnvironmentPersistenceWithHistory(false),
      expectedValue: false,
      getValue: () => useUiPrefsStore.getState().environmentPersistence,
      label: 'Change persistence preference',
      sourceId: 'storage-management',
      sourceLabel: 'Storage Management',
      targetId: 'ui-pref:environmentPersistence',
      targetLabel: 'Environment persistence',
    },
    {
      name: 'dashboard persistence',
      run: () => setDashboardPersistenceWithHistory(false),
      expectedValue: false,
      getValue: () => useUiPrefsStore.getState().dashboardPersistence,
      label: 'Change persistence preference',
      sourceId: 'storage-management',
      sourceLabel: 'Storage Management',
      targetId: 'ui-pref:dashboardPersistence',
      targetLabel: 'Dashboard persistence',
    },
    {
      name: 'notepad persistence',
      run: () => setNotepadPersistenceWithHistory(false),
      expectedValue: false,
      getValue: () => useUiPrefsStore.getState().notepadPersistence,
      label: 'Change persistence preference',
      sourceId: 'storage-management',
      sourceLabel: 'Storage Management',
      targetId: 'ui-pref:notepadPersistence',
      targetLabel: 'Notepad persistence',
    },
    {
      name: 'Spaghetti Editor defaults',
      run: () =>
        setSpaghettiWindowAppearanceDefaultsWithHistory({
          ...defaultSpaghettiWindowAppearance,
          titlebarOpacity: 0.85,
        }),
      expectedValue: normalizeSpaghettiWindowAppearance({
        ...defaultSpaghettiWindowAppearance,
        titlebarOpacity: 0.85,
      }),
      getValue: () => useUiPrefsStore.getState().spaghettiWindowAppearanceDefaults,
      label: 'Change Spaghetti Editor defaults',
      sourceId: 'spaghetti-editor-defaults',
      sourceLabel: 'Spaghetti Editor Defaults',
      targetId: 'ui-pref:spaghettiWindowAppearanceDefaults',
      targetLabel: 'Spaghetti Editor window appearance defaults',
    },
  ])('commits reader metadata for $name changes', (scenario) => {
    const committed = scenario.run()

    expect(committed).toBe(true)
    expect(scenario.getValue()).toEqual(scenario.expectedValue)

    const [entry] = editHistoryStore.getUndoEntries()
    expect(entry).toEqual(expect.objectContaining({
      label: scenario.label,
      source: {
        surface: 'home-page',
        sourceId: scenario.sourceId,
        sourceLabel: scenario.sourceLabel,
      },
      targetId: scenario.targetId,
      targetLabel: scenario.targetLabel,
    }))
  })

  it('undoes and redoes only the startup preference field', () => {
    expect(setWorkspaceStartupSurfaceWithHistory('modelViewer')).toBe(true)

    useUiPrefsStore.getState().setDashboardPersistence(false)
    useUiPrefsStore.getState().setView({ gridVisible: false })

    expect(editHistoryStore.undo()?.targetId).toBe('ui-pref:workspaceStartupSurface')
    expect(useUiPrefsStore.getState().workspaceStartupSurface).toBe('homePage')
    expect(useUiPrefsStore.getState().dashboardPersistence).toBe(false)
    expect(useUiPrefsStore.getState().view.gridVisible).toBe(false)

    expect(editHistoryStore.redo()?.targetId).toBe('ui-pref:workspaceStartupSurface')
    expect(useUiPrefsStore.getState().workspaceStartupSurface).toBe('modelViewer')
    expect(useUiPrefsStore.getState().dashboardPersistence).toBe(false)
    expect(useUiPrefsStore.getState().view.gridVisible).toBe(false)
  })

  it('undoes and redoes only the target persistence preference field', () => {
    expect(setViewSettingsPersistenceWithHistory(false)).toBe(true)

    useUiPrefsStore.getState().setEnvironmentPersistence(false)
    useUiPrefsStore.getState().applyEnvironmentPreset('studio')

    expect(editHistoryStore.undo()?.targetId).toBe('ui-pref:viewSettingsPersistence')
    expect(useUiPrefsStore.getState().viewSettingsPersistence).toBe(true)
    expect(useUiPrefsStore.getState().environmentPersistence).toBe(false)
    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')

    expect(editHistoryStore.redo()?.targetId).toBe('ui-pref:viewSettingsPersistence')
    expect(useUiPrefsStore.getState().viewSettingsPersistence).toBe(false)
    expect(useUiPrefsStore.getState().environmentPersistence).toBe(false)
    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')
  })

  it('keeps no-op wrapper calls history-free and redo-preserving', () => {
    const marker = seedRedoEntry()

    expect(setWorkspaceRestorePersistenceWithHistory(true)).toBe(false)

    expectRedoPreserved(marker)
  })

  it('keeps raw UI preference setters history-free and redo-preserving', () => {
    const marker = seedRedoEntry()

    const prefs = useUiPrefsStore.getState()
    prefs.setWorkspaceStartupSurface('modelViewer')
    prefs.setWorkspaceRestorePersistence(false)
    prefs.setViewSettingsPersistence(false)
    prefs.setEnvironmentPersistence(false)
    prefs.setDashboardPersistence(false)
    prefs.setNotepadPersistence(false)
    const nextSpaghettiDefaults = {
      ...defaultSpaghettiWindowAppearance,
      titlebarOpacity: 0.8,
    }
    prefs.setSpaghettiWindowAppearanceDefaults(nextSpaghettiDefaults)

    expect(useUiPrefsStore.getState().workspaceStartupSurface).toBe('modelViewer')
    expect(useUiPrefsStore.getState().workspaceRestorePersistence).toBe(false)
    expect(useUiPrefsStore.getState().viewSettingsPersistence).toBe(false)
    expect(useUiPrefsStore.getState().environmentPersistence).toBe(false)
    expect(useUiPrefsStore.getState().dashboardPersistence).toBe(false)
    expect(useUiPrefsStore.getState().notepadPersistence).toBe(false)
    expect(useUiPrefsStore.getState().spaghettiWindowAppearanceDefaults).toEqual(
      normalizeSpaghettiWindowAppearance(nextSpaghettiDefaults),
    )
    expectRedoPreserved(marker)
  })
})
