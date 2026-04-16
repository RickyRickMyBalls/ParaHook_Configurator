import { useEffect } from 'react'
import { useConsoleStore } from './console/useConsoleStore'
import { routeKeyboardInput } from './inputRouting'
import { useAppStore } from './store/useAppStore'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import type { WorkspaceViewportId } from './workspace/workspaceShellTypes'
import { useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { getViewer } from './viewerBridge'
import { resolveViewerCameraShortcutAction } from './cameraShortcuts'
import { setCameraPresetCommand } from './viewCommands'

export function useViewerCameraShortcuts(viewportId: WorkspaceViewportId): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }

      const appState = useAppStore.getState()
      const workspaceState = useWorkspaceStore.getState()
      const spaghettiState = useSpaghettiStore.getState()
      const consoleState = useConsoleStore.getState()
      const viewerSurfaceOwnsShortcuts =
        appState.workspaceSelection.activeSurface === 'viewer' &&
        workspaceState.activeViewerViewportId === viewportId &&
        getViewer(viewportId) !== null

      const routing = routeKeyboardInput({
        event,
        viewerFlyActive: getViewer(viewportId)?.isFlyModeActive?.() === true,
        viewerCameraShortcutsEnabled: viewerSurfaceOwnsShortcuts,
        sketchPlanePickStage: spaghettiState.sketchPlanePickSession?.stage ?? null,
        geometrySketchMode:
          consoleState.featureAssistDescriptor !== null
            ? null
            : spaghettiState.geometrySketchSession?.mode ?? null,
        referenceTransformActive:
          appState.referenceWorkspace.activeReferenceTransformSession?.entryActive === true ||
          appState.referenceWorkspace.activeContentObjectTransformSession?.entryActive === true,
      })

      if (routing.owner !== 'viewer-camera-shortcuts' || routing.decision !== 'handle') {
        return
      }

      const action = resolveViewerCameraShortcutAction(event)
      if (action === null) {
        return
      }

      event.preventDefault()
      event.stopImmediatePropagation()

      switch (action) {
        case 'preset-top':
          setCameraPresetCommand('top', viewportId)
          return
        case 'preset-front':
          setCameraPresetCommand('front', viewportId)
          return
        case 'preset-back':
          setCameraPresetCommand('back', viewportId)
          return
        case 'preset-left':
          setCameraPresetCommand('left', viewportId)
          return
        case 'preset-right':
          setCameraPresetCommand('right', viewportId)
          return
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [viewportId])
}
