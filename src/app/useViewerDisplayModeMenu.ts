import { useEffect, useState } from 'react'
import type { ViewDisplayMode } from '../shared/viewSettingsTypes'
import { useAppStore } from './store/useAppStore'
import { useUiPrefsStore } from './store/uiPrefsStore'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import type { WorkspaceViewportId } from './workspace/workspaceShellTypes'
import { getViewer } from './viewerBridge'
import { routeKeyboardInput } from './inputRouting'

export type ViewerDisplayModeMenuState = {
  isOpen: boolean
  close: () => void
  selectDisplayMode: (mode: ViewDisplayMode) => void
}

export function useViewerDisplayModeMenu(
  viewportId: WorkspaceViewportId,
): ViewerDisplayModeMenuState {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }

      if (isOpen && event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        setIsOpen(false)
        return
      }

      const appState = useAppStore.getState()
      const workspaceState = useWorkspaceStore.getState()
      const viewer = getViewer(viewportId)
      const viewerSurfaceOwnsShortcuts =
        appState.workspaceSelection.activeSurface === 'viewer' &&
        workspaceState.activeViewerViewportId === viewportId &&
        viewer !== null

      const routing = routeKeyboardInput({
        event,
        viewerFlyActive: viewer?.isFlyModeActive?.() === true,
        viewerDisplayModeShortcutsEnabled: viewerSurfaceOwnsShortcuts,
        consoleInputPriorityMode: useUiPrefsStore.getState().consoleInputPriorityMode,
      })

      if (routing.owner !== 'viewer-display-mode' || routing.decision !== 'handle') {
        return
      }

      event.preventDefault()
      event.stopImmediatePropagation()
      setIsOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isOpen, viewportId])

  return {
    isOpen,
    close: () => setIsOpen(false),
    selectDisplayMode: (mode) => {
      useUiPrefsStore.getState().setViewKey('displayMode', mode)
      setIsOpen(false)
    },
  }
}
