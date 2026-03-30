import type { ProjectionMode, ViewSettings } from '../shared/viewSettingsTypes'
import type { ReferenceTransformOverride } from './references/referenceManifest'
import type { ActiveReferenceTransformHandle } from './store/useAppStore'
import type {
  SketchComponent,
  SketchPlane,
  SketchPlaneTransform,
} from './spaghetti/features/featureTypes'
import type {
  GeometrySketchDrawStage,
  GeometrySketchSelectionWindowDraft,
} from './spaghetti/store/useSpaghettiStore'

export type CameraPreset = 'iso' | 'top' | 'front' | 'left' | 'right'
export type GizmoMode = 'translate' | 'rotate' | 'scale'
export type GizmoSpace = 'local' | 'world'
export type SnapDirection = '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z'

export type GeometrySketchOverlayProfileVm = {
  profileId: string
  vertices: Array<{ x: number; y: number }>
}

export type GeometrySketchSnapTarget = 'origin' | 'endpoint'

export type GeometrySketchDrawDraftVm = {
  points: Array<{ x: number; y: number }>
  hoverPoint: { x: number; y: number } | null
  hoverSnapTarget: GeometrySketchSnapTarget | null
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
  selectedComponentIds?: string[]
  hoveredComponentId?: string | null
  selectionWindowDraft?: GeometrySketchSelectionWindowDraft | null
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

export type VisibleGeometrySketchOverlayVm = {
  overlayId: string
  plane: SketchPlane
  planeTransform: SketchPlaneTransform
  components: SketchComponent[]
  profiles: GeometrySketchOverlayProfileVm[]
}

export type SketchPlanePickOverlayVm = {
  stage: 'pick' | 'adjust'
  gizmoMode: 'translate' | 'rotate'
  draftPlane: SketchPlane
  previewPlane: SketchPlane | null
  draftTransform: SketchPlaneTransform
  commandOriginTransform: SketchPlaneTransform | null
  transformHistoryPoints: Array<{ x: number; y: number; z: number }>
  showMoveCommandGuide: boolean
  snap: {
    translateMm: number | null
    rotateDeg: number | null
  }
  ui: {
    gizmoScale: number
    ghostPlaneScale: number
  }
}

export type ReferenceTransformHistoryVec3Vm = {
  x: number
  y: number
  z: number
}

export type ReferenceTransformRotateHistoryEntryVm = {
  entryId: string
  position: ReferenceTransformHistoryVec3Vm
  beforeRotationDeg: ReferenceTransformHistoryVec3Vm
  afterRotationDeg: ReferenceTransformHistoryVec3Vm
}

export type ReferenceTransformScaleHistoryEntryVm = {
  entryId: string
  position: ReferenceTransformHistoryVec3Vm
  rotationDeg: ReferenceTransformHistoryVec3Vm
  beforeScale: ReferenceTransformHistoryVec3Vm
  afterScale: ReferenceTransformHistoryVec3Vm
}

export type ViewerTransformTarget =
  | {
      kind: 'reference'
      referenceId: string
    }
  | {
      kind: 'content-object'
      objectId: string
    }

export type ViewerTransformHistoryOverlayVm = {
  target: ViewerTransformTarget
  movePoints: ReferenceTransformHistoryVec3Vm[]
  rotateEntries: ReferenceTransformRotateHistoryEntryVm[]
  scaleEntries: ReferenceTransformScaleHistoryEntryVm[]
}

export type ViewerTransformSession = {
  targetKind: ViewerTransformTarget['kind']
  targetId: string
  mode: GizmoMode
  space: GizmoSpace
  entryOrigin: ReferenceTransformOverride | null
}

export interface ViewerApi {
  setCameraPreset: (preset: CameraPreset) => void
  setProjectionMode: (mode: ProjectionMode) => void
  alignCameraToGeometrySketchPlane: () => void
  frameAll: () => void
  frameExtents: () => void
  frameGeometrySketch: () => void
  frameSelectedGeometrySketch: () => boolean
  framePrevious: () => void
  frameSelected: (partId: string | null) => void
  frameSelectionSet: (partIds: string[], referenceIds: string[]) => boolean
  frameReference: (referenceId: string) => void
  snapCameraToDirection: (dir: SnapDirection) => void
  zoomCameraByWheelDelta: (deltaY: number) => void
  beginTemporaryPanDrag: (startClientX: number, startClientY: number) => void
  updateTemporaryPanDrag: (clientX: number, clientY: number) => void
  endTemporaryPanDrag: () => void
  beginTemporaryOrbitDrag: (startClientX: number, startClientY: number) => void
  updateTemporaryOrbitDrag: (clientX: number, clientY: number) => void
  endTemporaryOrbitDrag: () => void
  setConsoleCameraMode: (mode: 'pan' | 'orbit' | 'zoom-window' | null) => void
  applyViewSettings: (settings: ViewSettings) => void
  setGizmoEnabled: (enabled: boolean) => void
  setGizmoMode: (mode: GizmoMode) => void
  completeReferenceTransformDrag: () => void
  commitReferenceTransformSession: () => void
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
    translate?: { x: number; y: number; z: number }
    rotate?: { x: number; y: number; z: number }
    scale?: { x: number; y: number; z: number }
  }) => void
  setReferenceTransformMoveSnapDotScale: (scale: number) => void
  setReferenceTransformMoveSnapDotsEnabled: (enabled: boolean) => void
  setReferenceTransformPreviewLastMoveSnapDotsEnabled: (enabled: boolean) => void
  setReferenceTransformMoveSnapDotDelayMs: (delayMs: number) => void
  setReferenceTransformMoveSnapDotNearScale: (scale: number) => void
  setReferenceTransformMoveSnapDotFarScale: (scale: number) => void
  setReferenceTransformMoveSnapDotVisibleRadiusMultiplier: (multiplier: number) => void
  setReferenceTransformRotateSnapPreviewEnabled: (enabled: boolean) => void
  setReferenceTransformRotateSnapPreviewLineSize: (size: number) => void
  setReferenceTransformRotateSnapPreviewLineThickness: (thickness: number) => void
  setReferenceTransformRotateSnapPreviewRadiusDeg: (radiusDeg: number) => void
  setReferenceTransformRotateSnapPreviewDelayMs: (delayMs: number) => void
  setSelectedPart: (partId: string | null) => void
  setHighlightedPartKeys: (partIds: string[]) => void
  setHighlightedReferenceIds: (referenceIds: string[]) => void
  setReferenceTransformSession: (session: {
    referenceId: string
    mode: GizmoMode
    space: GizmoSpace
    entryOrigin: ReferenceTransformOverride | null
  } | null) => void
  setContentObjectTransformGroups: (
    groups: Array<{
      objectId: string
      partKeys: string[]
    }>,
  ) => void
  setContentObjectTransformSession: (session: {
    objectId: string
    mode: GizmoMode
    space: GizmoSpace
    entryOrigin: ReferenceTransformOverride | null
  } | null) => void
  setContentObjectTransformOverrides: (
    overrides: Record<string, ReferenceTransformOverride | null>,
  ) => void
  setViewerTransformSession: (session: ViewerTransformSession | null) => void
  setViewerTransformHistoryOverlay: (overlay: ViewerTransformHistoryOverlayVm | null) => void
  setReferenceCameraLock: (referenceId: string | null) => void
  setReferenceTransformOverride: (
    referenceId: string,
    transformOverride: ReferenceTransformOverride | null,
  ) => void
  getReferencePartDescriptors: (
    referenceId: string,
  ) => Array<{
    partKey: string
    label: string
  }>
  setOnReferenceTransformChange: (
    handler: ((referenceId: string, transform: ReferenceTransformOverride) => void) | null,
  ) => void
  setOnReferenceTransformCommit: (handler: (() => void) | null) => void
  setOnReferenceTransformExit: (handler: (() => void) | null) => void
  setOnReferenceTransformHandleChange: (
    handler: ((handle: ActiveReferenceTransformHandle | null) => void) | null,
  ) => void
  setOnReferenceTransformModeChange: ((handler: ((mode: GizmoMode) => void) | null) => void)
  setOnReferenceTransformSpaceChange: ((handler: ((space: GizmoSpace) => void) | null) => void)
  setOnViewerTransformChange: (
    handler: ((target: ViewerTransformTarget, transform: ReferenceTransformOverride) => void) | null,
  ) => void
  setOnViewerTransformCommit: (handler: (() => void) | null) => void
  setOnViewerTransformExit: (handler: (() => void) | null) => void
  setOnViewerTransformHandleChange: (
    handler: ((handle: ActiveReferenceTransformHandle | null) => void) | null,
  ) => void
  setOnViewerTransformModeChange: ((handler: ((mode: GizmoMode) => void) | null) => void)
  setOnViewerTransformSpaceChange: ((handler: ((space: GizmoSpace) => void) | null) => void)
  setOnContentObjectTransformChange: (
    handler: ((objectId: string, transform: ReferenceTransformOverride) => void) | null,
  ) => void
  setOnContentObjectTransformCommit: (handler: (() => void) | null) => void
  setOnContentObjectTransformHandleChange: (
    handler: ((handle: ActiveReferenceTransformHandle | null) => void) | null,
  ) => void
  setOnContentObjectTransformModeChange: ((handler: ((mode: GizmoMode) => void) | null) => void)
  setOnContentObjectTransformSpaceChange: ((handler: ((space: GizmoSpace) => void) | null) => void)
  setAxisOverlayEnabled: (enabled: boolean) => void
  setAxisOverlayCanvas: (canvas: HTMLCanvasElement | null) => void
  setGeometrySketchOverlay: (overlay: GeometrySketchOverlayVm | null) => void
  setVisibleGeometrySketchOverlays: (overlays: VisibleGeometrySketchOverlayVm[]) => void
  setOnGeometrySketchHoverPoint: (
    handler: ((point: { x: number; y: number } | null, snapTarget: GeometrySketchSnapTarget | null) => void) | null,
  ) => void
  setOnGeometrySketchConfirmPoint: (
    handler: ((point: { x: number; y: number }, snapTarget: GeometrySketchSnapTarget | null) => void) | null,
  ) => void
  setOnGeometrySketchHoverComponent: (
    handler: ((rowId: string | null) => void) | null,
  ) => void
  setOnGeometrySketchSelectComponents: (
    handler: ((rowIds: string[]) => void) | null,
  ) => void
  setOnGeometrySketchSelectionWindowDraftChange: (
    handler: ((draft: GeometrySketchSelectionWindowDraft | null) => void) | null,
  ) => void
  setOnGeometrySketchDeleteSelection: (handler: (() => void) | null) => void
  setOnGeometrySketchFinishDraft: (handler: (() => void) | null) => void
  setOnGeometrySketchCancelDraft: (handler: (() => void) | null) => void
  setSketchPlanePickOverlay: (overlay: SketchPlanePickOverlayVm | null) => void
  setOnSketchPlanePickPlaneSelect: (
    handler: ((plane: SketchPlane) => void) | null,
  ) => void
  setOnSketchPlanePickTransformChange: (
    handler: ((transform: SketchPlaneTransform) => void) | null,
  ) => void
  setOnSketchPlanePickTransformCommit: (handler: (() => void) | null) => void
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

export const setViewerConsoleCameraMode = (mode: 'pan' | 'orbit' | 'zoom-window' | null): void => {
  viewer?.setConsoleCameraMode(mode)
}

export const frameViewerPrevious = (): void => {
  viewer?.framePrevious()
}

export const zoomViewerCameraByWheelDelta = (deltaY: number): void => {
  viewer?.zoomCameraByWheelDelta(deltaY)
}

export const beginViewerTemporaryPanDrag = (
  startClientX: number,
  startClientY: number,
): void => {
  viewer?.beginTemporaryPanDrag(startClientX, startClientY)
}

export const updateViewerTemporaryPanDrag = (
  clientX: number,
  clientY: number,
): void => {
  viewer?.updateTemporaryPanDrag(clientX, clientY)
}

export const endViewerTemporaryPanDrag = (): void => {
  viewer?.endTemporaryPanDrag()
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
