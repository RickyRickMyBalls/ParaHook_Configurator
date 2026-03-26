import type { ProjectionMode } from '../shared/viewSettingsTypes'
import { useUiPrefsStore } from './store/uiPrefsStore'
import {
  getViewer,
  type CameraPreset,
} from './viewerBridge'

export const setProjectionModeCommand = (mode: ProjectionMode): void => {
  useUiPrefsStore.getState().setViewKey('projectionMode', mode)
}

export const setCameraPresetCommand = (preset: CameraPreset): void => {
  getViewer()?.setCameraPreset(preset)
}

export const frameAllCommand = (): void => {
  getViewer()?.frameAll()
}

export const frameExtentsCommand = (): void => {
  getViewer()?.frameExtents()
}

export const framePreviousCommand = (): void => {
  getViewer()?.framePrevious()
}

export const frameSelectedCommand = (partKey: string | null): void => {
  getViewer()?.frameSelected(partKey)
}

export const frameSelectedGeometrySketchCommand = (): boolean =>
  getViewer()?.frameSelectedGeometrySketch() ?? false

export const frameReferenceCommand = (referenceId: string): void => {
  getViewer()?.frameReference(referenceId)
}

export const setConsoleCameraModeCommand = (
  mode: 'pan' | 'orbit' | 'zoom-window' | null,
): void => {
  getViewer()?.setConsoleCameraMode(mode)
}
