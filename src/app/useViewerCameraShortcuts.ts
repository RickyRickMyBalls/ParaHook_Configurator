import { useEffect } from 'react'
import { useConsoleStore } from './console/useConsoleStore'
import { dispatchEditHistoryShortcut, routeKeyboardInput } from './inputRouting'
import { useAppStore } from './store/useAppStore'
import { editHistoryStore } from './store/editHistoryStore'
import { useUiPrefsStore } from './store/uiPrefsStore'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import type { WorkspaceViewportId } from './workspace/workspaceShellTypes'
import { useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { getViewer } from './viewerBridge'
import { resolveViewerCameraShortcutAction } from './cameraShortcuts'
import { resolveZoomObjectTarget } from './zoomObjectTarget'
import {
  frameEnvironmentLightCommand,
  frameReferenceCommand,
  frameSelectedCommand,
  frameSelectionSetCommand,
  setCameraPresetCommand,
} from './viewCommands'

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
        editHistoryCanUndo: editHistoryStore.canUndo(),
        editHistoryCanRedo: editHistoryStore.canRedo(),
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

      if (dispatchEditHistoryShortcut(routing, event, editHistoryStore)) {
        return
      }

      if (routing.owner !== 'viewer-camera-shortcuts' || routing.decision !== 'handle') {
        return
      }

      const action = resolveViewerCameraShortcutAction(event)
      if (action === null) {
        return
      }

      switch (action) {
        case 'zoom-object': {
          const zoomTarget = resolveZoomObjectTarget(appState)
          if (zoomTarget === null) {
            return
          }
          const animationOptions = {
            animate: true,
            durationMs: useUiPrefsStore.getState().cameraShortcutTransitionDurationMs,
          } as const
          event.preventDefault()
          event.stopImmediatePropagation()
          if (zoomTarget.kind === 'part') {
            frameSelectedCommand(zoomTarget.partKey, viewportId, animationOptions)
            return
          }
          if (zoomTarget.kind === 'environment-light') {
            frameEnvironmentLightCommand(zoomTarget.lightId, viewportId, animationOptions)
            return
          }
          if (zoomTarget.kind === 'selection-set') {
            frameSelectionSetCommand(zoomTarget.partKeys, zoomTarget.referenceIds)
            return
          }
          frameReferenceCommand(zoomTarget.referenceId, viewportId, animationOptions)
          return
        }
        case 'preset-top':
        case 'preset-front':
        case 'preset-back':
        case 'preset-left':
        case 'preset-right': {
          event.preventDefault()
          event.stopImmediatePropagation()
          const animationOptions = {
            animate: true,
            durationMs: useUiPrefsStore.getState().cameraShortcutTransitionDurationMs,
          } as const
          if (action === 'preset-top') {
            setCameraPresetCommand('top', viewportId, animationOptions)
            return
          }
          if (action === 'preset-front') {
            setCameraPresetCommand('front', viewportId, animationOptions)
            return
          }
          if (action === 'preset-back') {
            setCameraPresetCommand('back', viewportId, animationOptions)
            return
          }
          if (action === 'preset-left') {
            setCameraPresetCommand('left', viewportId, animationOptions)
            return
          }
          setCameraPresetCommand('right', viewportId, animationOptions)
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [viewportId])
}
