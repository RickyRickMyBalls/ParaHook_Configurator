import { useEffect, useState } from 'react'
import type {
  ViewDisplayMode,
  ViewEdgeDisplayMode,
  ViewportStyle,
} from '../shared/viewSettingsTypes'
import {
  createDisplayModeViewPatch,
  createRenderPresetViewPatch,
  geometryDisplayEdgePresetToDepthMode,
  geometryDisplayEdgePresetToHiddenEdges,
  geometryDisplayEdgePresetToLineStyle,
  geometryDisplayEdgePresetToMode,
} from '../shared/viewSettingsTypes'
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
  selectEdgeDisplayMode: (mode: ViewEdgeDisplayMode | 'hiddenLine') => void
  selectViewportStyle: (style: ViewportStyle) => void
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
      useUiPrefsStore.getState().setView(createDisplayModeViewPatch(mode))
      setIsOpen(false)
    },
    selectEdgeDisplayMode: (mode) => {
      if (mode === 'hiddenLine') {
        const currentView = useUiPrefsStore.getState().view
        useUiPrefsStore.getState().setView({
          edgeDisplayMode: 'on',
          geometryDisplay: {
            ...currentView.geometryDisplay,
            edges: {
              ...currentView.geometryDisplay.edges,
              preset: 'hiddenLine',
              mode: geometryDisplayEdgePresetToMode('hiddenLine'),
              depthMode: geometryDisplayEdgePresetToDepthMode('hiddenLine'),
              hiddenEdges: geometryDisplayEdgePresetToHiddenEdges('hiddenLine'),
              lineStyle: geometryDisplayEdgePresetToLineStyle('hiddenLine'),
            },
          },
        })
        return
      }
      useUiPrefsStore.getState().setViewKey('edgeDisplayMode', mode)
    },
    selectViewportStyle: (style) => {
      const currentView = useUiPrefsStore.getState().view
      useUiPrefsStore.getState().setView(createRenderPresetViewPatch(style, currentView))
      setIsOpen(false)
    },
  }
}
