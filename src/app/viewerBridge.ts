import type { ViewSettings } from '../shared/viewSettingsTypes'

export type CameraPreset = 'iso' | 'top' | 'front' | 'left' | 'right'
export type GizmoMode = 'translate' | 'rotate' | 'scale'
export type GizmoSpace = 'local' | 'world'
export type SnapDirection = '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z'

export interface ViewerApi {
  setCameraPreset: (preset: CameraPreset) => void
  frameAll: () => void
  frameSelected: (partId: string | null) => void
  snapCameraToDirection: (dir: SnapDirection) => void
  applyViewSettings: (settings: ViewSettings) => void
  setGizmoEnabled: (enabled: boolean) => void
  setGizmoMode: (mode: GizmoMode) => void
  setGizmoSpace: (space: GizmoSpace) => void
  setGizmoSnap: (opts: {
    translateMm?: number
    rotateDeg?: number
    scale?: number
  }) => void
  setSelectedPart: (partId: string | null) => void
  setAxisOverlayEnabled: (enabled: boolean) => void
  setAxisOverlayCanvas: (canvas: HTMLCanvasElement | null) => void
}

let viewer: ViewerApi | null = null
const listeners = new Set<(viewer: ViewerApi | null) => void>()

export const setViewer = (nextViewer: ViewerApi | null): void => {
  viewer = nextViewer
  for (const listener of listeners) {
    listener(nextViewer)
  }
}

export const getViewer = (): ViewerApi | null => viewer

export const subscribeViewer = (
  listener: (viewer: ViewerApi | null) => void,
): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
