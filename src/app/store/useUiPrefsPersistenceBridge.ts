import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  applyPersistedUiPrefsView,
  readPersistedUiPrefs,
  mergePersistedUiPrefsView,
  serializePersistedUiPrefs,
  writePersistedUiPrefs,
} from './uiPrefsPersistence'
import { useUiPrefsStore } from './uiPrefsStore'

export function useUiPrefsPersistenceBridge() {
  const hasHydratedUiPrefsPersistenceRef = useRef(false)
  const lastPersistedUiPrefsRef = useRef<ReturnType<typeof readPersistedUiPrefs>>(null)

  useLayoutEffect(() => {
    if (hasHydratedUiPrefsPersistenceRef.current) {
      return
    }
    hasHydratedUiPrefsPersistenceRef.current = true

    const persistedUiPrefs = readPersistedUiPrefs()
    if (persistedUiPrefs !== null) {
      lastPersistedUiPrefsRef.current = persistedUiPrefs
      const currentUiPrefs = useUiPrefsStore.getState()
      useUiPrefsStore.setState({
        view: applyPersistedUiPrefsView(currentUiPrefs.view, persistedUiPrefs),
        workspaceStartupSurface: persistedUiPrefs.workspaceStartupSurface,
        consoleInputPriorityMode: persistedUiPrefs.consoleInputPriorityMode,
        spaghettiWindowAppearanceDefaults:
          persistedUiPrefs.spaghettiWindowAppearanceDefaults,
        workspacePaneFilletRadiusPx: persistedUiPrefs.workspacePaneFilletRadiusPx,
        workspacePanelShellPaddingPx: persistedUiPrefs.workspacePanelShellPaddingPx,
        workspaceNestedResizeKeepsFarPane: persistedUiPrefs.workspaceNestedResizeKeepsFarPane,
        radialMenuRecipeId: persistedUiPrefs.radialMenuRecipeId,
        edgeRecipeFollowsDisplayMode: persistedUiPrefs.edgeRecipeFollowsDisplayMode,
        workspaceRestorePersistence: persistedUiPrefs.workspaceRestorePersistence,
        viewSettingsPersistence: persistedUiPrefs.viewSettingsPersistence,
        environmentPersistence: persistedUiPrefs.environmentPersistence,
        dashboardPersistence: persistedUiPrefs.dashboardPersistence,
        notepadPersistence: persistedUiPrefs.notepadPersistence,
      })
    }

    const currentUiPrefs = useUiPrefsStore.getState()
    const currentPolicy = {
      workspaceRestorePersistence: currentUiPrefs.workspaceRestorePersistence,
      viewSettingsPersistence: currentUiPrefs.viewSettingsPersistence,
      environmentPersistence: currentUiPrefs.environmentPersistence,
      dashboardPersistence: currentUiPrefs.dashboardPersistence,
      notepadPersistence: currentUiPrefs.notepadPersistence,
    }
    const viewToPersist =
      persistedUiPrefs === null
        ? currentUiPrefs.view
        : mergePersistedUiPrefsView(currentUiPrefs.view, persistedUiPrefs.view, {
            viewSettingsPersistence: currentUiPrefs.viewSettingsPersistence,
            environmentPersistence: currentUiPrefs.environmentPersistence,
          })
    const nextSnapshot = serializePersistedUiPrefs(
      viewToPersist,
      currentUiPrefs.workspaceStartupSurface,
      currentUiPrefs.spaghettiWindowAppearanceDefaults,
      currentPolicy,
      currentUiPrefs.workspacePaneFilletRadiusPx,
      currentUiPrefs.workspacePanelShellPaddingPx,
      currentUiPrefs.workspaceNestedResizeKeepsFarPane,
      currentUiPrefs.consoleInputPriorityMode,
      currentUiPrefs.radialMenuRecipeId,
      currentUiPrefs.edgeRecipeFollowsDisplayMode,
    )
    writePersistedUiPrefs(nextSnapshot)
    lastPersistedUiPrefsRef.current = nextSnapshot
  }, [])

  useEffect(() => {
    const unsubscribe = useUiPrefsStore.subscribe((state) => {
      if (!hasHydratedUiPrefsPersistenceRef.current) {
        return
      }
      const persistedUiPrefs = lastPersistedUiPrefsRef.current
      const viewToPersist =
        persistedUiPrefs === null
          ? state.view
          : mergePersistedUiPrefsView(state.view, persistedUiPrefs.view, {
              viewSettingsPersistence: state.viewSettingsPersistence,
              environmentPersistence: state.environmentPersistence,
            })
      const nextSnapshot = serializePersistedUiPrefs(
        viewToPersist,
        state.workspaceStartupSurface,
        state.spaghettiWindowAppearanceDefaults,
        {
          workspaceRestorePersistence: state.workspaceRestorePersistence,
          viewSettingsPersistence: state.viewSettingsPersistence,
          environmentPersistence: state.environmentPersistence,
          dashboardPersistence: state.dashboardPersistence,
          notepadPersistence: state.notepadPersistence,
        },
        state.workspacePaneFilletRadiusPx,
        state.workspacePanelShellPaddingPx,
        state.workspaceNestedResizeKeepsFarPane,
        state.consoleInputPriorityMode,
        state.radialMenuRecipeId,
        state.edgeRecipeFollowsDisplayMode,
      )
      lastPersistedUiPrefsRef.current = nextSnapshot
      writePersistedUiPrefs(
        nextSnapshot,
      )
    })
    return unsubscribe
  }, [])
}
