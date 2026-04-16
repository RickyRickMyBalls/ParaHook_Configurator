import type { ProjectionMode } from '../shared/viewSettingsTypes'
import { useUiPrefsStore } from './store/uiPrefsStore'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import {
  getViewer,
  type CameraPreset,
  type CameraPresetOptions,
  type FrameTargetOptions,
} from './viewerBridge'
import type { WorkspaceViewportId } from './workspace/workspaceShellTypes'

export const setProjectionModeCommand = (
  mode: ProjectionMode,
  viewportId?: WorkspaceViewportId,
): void => {
  if (viewportId !== undefined) {
    useWorkspaceStore.getState().setViewportLocalViewState(viewportId, {
      projectionMode: mode,
    })
    return
  }
  useUiPrefsStore.getState().setViewKey('projectionMode', mode)
}

export const setCameraPresetCommand = (
  preset: CameraPreset,
  viewportId?: WorkspaceViewportId,
  options?: CameraPresetOptions,
): void => {
  if (options === undefined) {
    getViewer(viewportId)?.setCameraPreset(preset)
    return
  }
  getViewer(viewportId)?.setCameraPreset(preset, options)
}

export const frameAllCommand = (viewportId?: WorkspaceViewportId): void => {
  getViewer(viewportId)?.frameAll()
}

export const frameExtentsCommand = (): void => {
  getViewer()?.frameExtents()
}

export const framePreviousCommand = (): void => {
  getViewer()?.framePrevious()
}

export const frameSelectedCommand = (
  partKey: string | null,
  viewportId?: WorkspaceViewportId,
  options?: FrameTargetOptions,
): void => {
  getViewer(viewportId)?.frameSelected(partKey, options)
}

export const frameSelectionSetCommand = (
  partKeys: string[],
  referenceIds: string[],
): boolean => getViewer()?.frameSelectionSet(partKeys, referenceIds) ?? false

export const frameSelectedGeometrySketchCommand = (): boolean =>
  getViewer()?.frameSelectedGeometrySketch() ?? false

export const frameReferenceCommand = (
  referenceId: string,
  viewportId?: WorkspaceViewportId,
  options?: FrameTargetOptions,
): void => {
  getViewer(viewportId)?.frameReference(referenceId, options)
}

export const setConsoleCameraModeCommand = (
  mode: 'pan' | 'orbit' | 'zoom-window' | null,
): void => {
  getViewer()?.setConsoleCameraMode(mode)
}
