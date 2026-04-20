import { useEffect, useRef } from 'react'
import {
  readPersistedWorkspaceLayout,
  serializeWorkspaceLayout,
  writePersistedWorkspaceLayout,
} from './workspacePersistence'
import { useWorkspaceLegacyCompatibilityBridge } from './useWorkspaceLegacyCompatibilityBridge'
import { useWorkspaceStore } from './useWorkspaceStore'
import { defaultPrimaryViewportSlotId } from './workspaceShellTypes'
import { useUiPrefsStore } from '../store/uiPrefsStore'

export function useWorkspacePersistenceBridge() {
  const hydratePersistedWorkspaceLayout = useWorkspaceStore(
    (state) => state.hydratePersistedWorkspaceLayout,
  )
  const workspaceRestorePersistence = useUiPrefsStore(
    (state) => state.workspaceRestorePersistence,
  )
  const hasHydratedWorkspacePersistenceRef = useRef(false)
  const { replayPersistedEditorSurfacePlacements } = useWorkspaceLegacyCompatibilityBridge()

  useEffect(() => {
    if (hasHydratedWorkspacePersistenceRef.current) {
      return
    }
    hasHydratedWorkspacePersistenceRef.current = true

    const applyWorkspaceStartupSurface = () => {
      const workspaceStartupSurface = useUiPrefsStore.getState().workspaceStartupSurface
      useWorkspaceStore.getState().setViewportSlotSurfaceKind(
        defaultPrimaryViewportSlotId,
        workspaceStartupSurface,
      )
    }

    const persistedLayout = readPersistedWorkspaceLayout()
    if (persistedLayout !== null && workspaceRestorePersistence) {
      hydratePersistedWorkspaceLayout(persistedLayout)
      replayPersistedEditorSurfacePlacements(persistedLayout.editorSurfacePlacementById)
      applyWorkspaceStartupSurface()
      writePersistedWorkspaceLayout(serializeWorkspaceLayout(useWorkspaceStore.getState()))
    } else {
      applyWorkspaceStartupSurface()
    }
  }, [
    hydratePersistedWorkspaceLayout,
    replayPersistedEditorSurfacePlacements,
    workspaceRestorePersistence,
  ])

  useEffect(() => {
    const unsubscribe = useWorkspaceStore.subscribe((state) => {
      if (!hasHydratedWorkspacePersistenceRef.current) {
        return
      }
      writePersistedWorkspaceLayout(serializeWorkspaceLayout(state))
    })
    return unsubscribe
  }, [])
}
