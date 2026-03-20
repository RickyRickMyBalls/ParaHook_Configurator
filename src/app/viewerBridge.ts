import type { ViewSettings } from '../shared/viewSettingsTypes'
import type { ReferenceTransformOverride } from './references/referenceManifest'
import type {
  SketchComponent,
  SketchPlane,
  SketchPlaneTransform,
} from './spaghetti/features/featureTypes'
import type { GeometrySketchDrawStage } from './spaghetti/store/useSpaghettiStore'

export type CameraPreset = 'iso' | 'top' | 'front' | 'left' | 'right'
export type GizmoMode = 'translate' | 'rotate' | 'scale'
export type GizmoSpace = 'local' | 'world'
export type SnapDirection = '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z'

export type GeometrySketchOverlayProfileVm = {
  profileId: string
  vertices: Array<{ x: number; y: number }>
}

export type GeometrySketchDrawDraftVm = {
  points: Array<{ x: number; y: number }>
  hoverPoint: { x: number; y: number } | null
  hoverSnapTarget: 'origin' | null
}

export type GeometrySketchOverlayVm = {
  mode: 'draw' | 'review'
  plane: SketchPlane
  planeTransform: SketchPlaneTransform
  drawStage: GeometrySketchDrawStage | null
  activeTool: 'line' | 'pline' | 'arc3pt' | 'spline' | 'rectangle' | 'circle' | null
  components: SketchComponent[]
  profiles: GeometrySketchOverlayProfileVm[]
  selectedProfileId?: string
  drawDraft: GeometrySketchDrawDraftVm | null
  ui: {
    snapEnabled: boolean
    snapDistancePx: number
    crosshairSize: number
    startPointVisible: boolean
    startPointSymbolSize: number
    startPointSymbolType: 'crosshair' | 'circle'
    plinePointVisible: boolean
    plinePointSymbolSize: number
    plinePointSymbolType: 'crosshair' | 'circle'
  }
}

export type SketchPlanePickOverlayVm = {
  stage: 'pick' | 'adjust'
  gizmoMode: 'translate' | 'rotate'
  draftPlane: SketchPlane
  draftTransform: SketchPlaneTransform
  snap: {
    translateMm: number | null
    rotateDeg: number | null
  }
  ui: {
    gizmoScale: number
    ghostPlaneScale: number
  }
}

export interface ViewerApi {
  setCameraPreset: (preset: CameraPreset) => void
  frameAll: () => void
  frameSelected: (partId: string | null) => void
  frameReference: (referenceId: string) => void
  snapCameraToDirection: (dir: SnapDirection) => void
  beginTemporaryOrbitDrag: (startClientX: number, startClientY: number) => void
  updateTemporaryOrbitDrag: (clientX: number, clientY: number) => void
  endTemporaryOrbitDrag: () => void
  applyViewSettings: (settings: ViewSettings) => void
  setGizmoEnabled: (enabled: boolean) => void
  setGizmoMode: (mode: GizmoMode) => void
  completeReferenceTransformDrag: () => void
  cancelReferenceTransformDrag: () => void
  clearReferenceTransformHandle: () => void
  activateTranslateCenterHandle: () => void
  activateTranslateHandle: (axis: 'X' | 'Y' | 'Z' | 'XYZ') => void
  activateRotateCenterHandle: () => void
  activateRotateHandle: (axis: 'X' | 'Y' | 'Z') => void
  activateScaleCenterHandle: () => void
  activateScaleHandle: (axis: 'X' | 'Y' | 'Z') => void
  setGizmoSpace: (space: GizmoSpace) => void
  setGizmoSnap: (opts: {
    translateMm?: number
    rotateDeg?: number
    scale?: number
  }) => void
  setSelectedPart: (partId: string | null) => void
  setReferenceTransformSession: (session: {
    referenceId: string
    mode: GizmoMode
    space: GizmoSpace
  } | null) => void
  setReferenceCameraLock: (referenceId: string | null) => void
  setReferenceTransformOverride: (
    referenceId: string,
    transformOverride: ReferenceTransformOverride | null,
  ) => void
  setOnReferenceTransformChange: (
    handler: ((referenceId: string, transform: ReferenceTransformOverride) => void) | null,
  ) => void
  setOnReferenceTransformExit: (handler: (() => void) | null) => void
  setOnReferenceTransformModeChange: ((handler: ((mode: GizmoMode) => void) | null) => void)
  setOnReferenceTransformSpaceChange: ((handler: ((space: GizmoSpace) => void) | null) => void)
  setAxisOverlayEnabled: (enabled: boolean) => void
  setAxisOverlayCanvas: (canvas: HTMLCanvasElement | null) => void
  setGeometrySketchOverlay: (overlay: GeometrySketchOverlayVm | null) => void
  setOnGeometrySketchHoverPoint: (
    handler: ((point: { x: number; y: number } | null, snapTarget: 'origin' | null) => void) | null,
  ) => void
  setOnGeometrySketchConfirmPoint: (
    handler: ((point: { x: number; y: number }, snapTarget: 'origin' | null) => void) | null,
  ) => void
  setOnGeometrySketchFinishDraft: (handler: (() => void) | null) => void
  setOnGeometrySketchCancelDraft: (handler: (() => void) | null) => void
  setSketchPlanePickOverlay: (overlay: SketchPlanePickOverlayVm | null) => void
  setOnSketchPlanePickPlaneSelect: (
    handler: ((plane: SketchPlane) => void) | null,
  ) => void
  setOnSketchPlanePickTransformChange: (
    handler: ((transform: SketchPlaneTransform) => void) | null,
  ) => void
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

export const beginViewerTemporaryOrbitDrag = (
  startClientX: number,
  startClientY: number,
): void => {
  viewer?.beginTemporaryOrbitDrag(startClientX, startClientY)
}

export const updateViewerTemporaryOrbitDrag = (
  clientX: number,
  clientY: number,
): void => {
  viewer?.updateTemporaryOrbitDrag(clientX, clientY)
}

export const endViewerTemporaryOrbitDrag = (): void => {
  viewer?.endTemporaryOrbitDrag()
}
