import { useEffect, useRef } from 'react'
import {
  readPersistedWorkspaceLayout,
  serializeWorkspaceLayout,
  writePersistedWorkspaceLayout,
} from './workspacePersistence'
import { useWorkspaceLegacyCompatibilityBridge } from './useWorkspaceLegacyCompatibilityBridge'
import { useWorkspaceStore } from './useWorkspaceStore'

export function useWorkspacePersistenceBridge() {
  const hydratePersistedWorkspaceLayout = useWorkspaceStore(
    (state) => state.hydratePersistedWorkspaceLayout,
  )
  const hasHydratedWorkspacePersistenceRef = useRef(false)
  const { replayPersistedEditorSurfacePlacements } = useWorkspaceLegacyCompatibilityBridge()

  useEffect(() => {
    if (hasHydratedWorkspacePersistenceRef.current) {
      return
    }
    hasHydratedWorkspacePersistenceRef.current = true

    const persistedLayout = readPersistedWorkspaceLayout()
    if (persistedLayout !== null) {
      const shouldRestorePersistedLayout =
        typeof window.confirm !== 'function' ||
        window.confirm('Restore your saved workspace layout? Click Cancel to start fresh.')
      if (shouldRestorePersistedLayout) {
        hydratePersistedWorkspaceLayout(persistedLayout)
        replayPersistedEditorSurfacePlacements(persistedLayout.editorSurfacePlacementById)
      }
    }

    writePersistedWorkspaceLayout(serializeWorkspaceLayout(useWorkspaceStore.getState()))
  }, [hydratePersistedWorkspaceLayout, replayPersistedEditorSurfacePlacements])

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
