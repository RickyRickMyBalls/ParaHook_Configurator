import type { ProjectionMode, ViewSettings } from '../shared/viewSettingsTypes'
import type { CameraPose } from '../viewer/scene/CameraController'
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
  getCameraPose?: () => CameraPose
  applyCameraPose?: (pose: CameraPose) => void
  setOnCameraPoseChange?: (handler: ((pose: CameraPose) => void) | null) => void
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
let activeViewerViewportId: string | null = null
const viewerByViewportId = new Map<string, ViewerApi>()
const activeListeners = new Set<(viewer: ViewerApi | null) => void>()
const listenersByViewportId = new Map<string, Set<(viewer: ViewerApi | null) => void>>()
const queuedCameraPoseByViewportId = new Map<string, CameraPose>()
const latestCameraPoseByViewportId = new Map<string, CameraPose>()
const scheduledCameraRestoreByViewportId = new Map<
  string,
  { firstFrameId: number; secondFrameId: number | null }
>()

const cloneCameraPose = (pose: CameraPose): CameraPose => ({
  position: pose.position.clone(),
  target: pose.target.clone(),
  up: pose.up.clone(),
  projectionMode: pose.projectionMode,
  perspectiveFovDeg: pose.perspectiveFovDeg,
  orthoViewHeight: pose.orthoViewHeight,
})

const cancelScheduledViewerCameraRestore = (viewportId: string): void => {
  const scheduled = scheduledCameraRestoreByViewportId.get(viewportId) ?? null
  if (scheduled === null) {
    return
  }
  window.cancelAnimationFrame(scheduled.firstFrameId)
  if (scheduled.secondFrameId !== null) {
    window.cancelAnimationFrame(scheduled.secondFrameId)
  }
  scheduledCameraRestoreByViewportId.delete(viewportId)
}

const applyViewerCameraPoseIfPresent = (viewportId: string, pose: CameraPose): void => {
  const activeViewer = getViewer(viewportId)
  if (activeViewer === null || typeof activeViewer.applyCameraPose !== 'function') {
    return
  }
  activeViewer.applyCameraPose(cloneCameraPose(pose))
}

const scheduleViewerCameraRestore = (viewportId: string, pose: CameraPose): void => {
  cancelScheduledViewerCameraRestore(viewportId)
  applyViewerCameraPoseIfPresent(viewportId, pose)
  const scheduled = {
    firstFrameId: 0,
    secondFrameId: null as number | null,
  }
  scheduled.firstFrameId = window.requestAnimationFrame(() => {
    applyViewerCameraPoseIfPresent(viewportId, pose)
    scheduled.secondFrameId = window.requestAnimationFrame(() => {
      applyViewerCameraPoseIfPresent(viewportId, pose)
      scheduledCameraRestoreByViewportId.delete(viewportId)
    })
  })
  scheduledCameraRestoreByViewportId.set(viewportId, scheduled)
}

const getViewportListeners = (viewportId: string): Set<(viewer: ViewerApi | null) => void> => {
  const currentListeners = listenersByViewportId.get(viewportId)
  if (currentListeners !== undefined) {
    return currentListeners
  }
  const nextListeners = new Set<(viewer: ViewerApi | null) => void>()
  listenersByViewportId.set(viewportId, nextListeners)
  return nextListeners
}

const resolveActiveViewer = (): ViewerApi | null => {
  if (activeViewerViewportId !== null) {
    return viewerByViewportId.get(activeViewerViewportId) ?? null
  }
  return viewer
}

const notifyActiveViewerListeners = (): void => {
  const nextViewer = resolveActiveViewer()
  for (const listener of activeListeners) {
    listener(nextViewer)
  }
}

const notifyViewportViewerListeners = (viewportId: string): void => {
  const listeners = listenersByViewportId.get(viewportId)
  if (listeners === undefined) {
    return
  }
  const nextViewer = viewerByViewportId.get(viewportId) ?? null
  for (const listener of listeners) {
    listener(nextViewer)
  }
}

export const setViewer = (viewportIdOrViewer: string | ViewerApi | null, nextViewer?: ViewerApi | null): void => {
  if (typeof viewportIdOrViewer === 'string') {
    const viewportId = viewportIdOrViewer
    if (nextViewer === null || nextViewer === undefined) {
      cancelScheduledViewerCameraRestore(viewportId)
      viewerByViewportId.delete(viewportId)
      if (activeViewerViewportId === viewportId) {
        activeViewerViewportId = null
      }
    } else {
      viewerByViewportId.set(viewportId, nextViewer)
      if (activeViewerViewportId === null) {
        activeViewerViewportId = viewportId
      }
      const pendingCameraPose =
        queuedCameraPoseByViewportId.get(viewportId) ?? latestCameraPoseByViewportId.get(viewportId) ?? null
      if (pendingCameraPose !== null) {
        scheduleViewerCameraRestore(viewportId, pendingCameraPose)
      }
    }
    notifyViewportViewerListeners(viewportId)
    notifyActiveViewerListeners()
    return
  }

  viewer = viewportIdOrViewer
  if (activeViewerViewportId === null) {
    notifyActiveViewerListeners()
  }
}

export const setActiveViewer = (viewportId: string | null): void => {
  activeViewerViewportId = viewportId
  notifyActiveViewerListeners()
}

export const getViewer = (viewportId?: string | null): ViewerApi | null => {
  if (typeof viewportId === 'string') {
    return viewerByViewportId.get(viewportId) ?? null
  }
  return resolveActiveViewer()
}

export const subscribeViewer = (
  listener: (viewer: ViewerApi | null) => void,
  viewportId?: string | null,
): (() => void) => {
  if (typeof viewportId === 'string') {
    const listeners = getViewportListeners(viewportId)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) {
        listenersByViewportId.delete(viewportId)
      }
    }
  }
  activeListeners.add(listener)
  return () => {
    activeListeners.delete(listener)
  }
}

export const queueViewerCameraPose = (viewportId: string, pose: CameraPose): void => {
  latestCameraPoseByViewportId.set(viewportId, cloneCameraPose(pose))
  queuedCameraPoseByViewportId.set(viewportId, cloneCameraPose(pose))
}

export const restoreViewerCameraPose = (viewportId: string, pose: CameraPose): void => {
  queueViewerCameraPose(viewportId, pose)
  scheduleViewerCameraRestore(viewportId, pose)
}

export const queueViewerCameraClone = (
  sourceViewportId: string,
  targetViewportId: string,
): boolean => {
  const sourceViewer = getViewer(sourceViewportId)
  const sourcePose =
    sourceViewer !== null && typeof sourceViewer.getCameraPose === 'function'
      ? sourceViewer.getCameraPose()
      : latestCameraPoseByViewportId.get(sourceViewportId) ?? null
  if (sourcePose === null) {
    return false
  }
  queueViewerCameraPose(targetViewportId, sourcePose)
  return true
}

export const consumeQueuedViewerCameraPose = (viewportId: string): CameraPose | null => {
  const pose = queuedCameraPoseByViewportId.get(viewportId) ?? null
  if (pose !== null) {
    queuedCameraPoseByViewportId.delete(viewportId)
  }
  return pose
}

export const setLatestViewerCameraPose = (viewportId: string, pose: CameraPose): void => {
  latestCameraPoseByViewportId.set(viewportId, cloneCameraPose(pose))
}

export const getLatestViewerCameraPose = (viewportId: string): CameraPose | null => {
  const pose = latestCameraPoseByViewportId.get(viewportId) ?? null
  if (pose === null) {
    return null
  }
  return {
    position: pose.position.clone(),
    target: pose.target.clone(),
    up: pose.up.clone(),
    projectionMode: pose.projectionMode,
    perspectiveFovDeg: pose.perspectiveFovDeg,
    orthoViewHeight: pose.orthoViewHeight,
  }
}

export const beginViewerTemporaryOrbitDrag = (
  startClientX: number,
  startClientY: number,
): void => {
  getViewer()?.beginTemporaryOrbitDrag(startClientX, startClientY)
}

export const setViewerConsoleCameraMode = (mode: 'pan' | 'orbit' | 'zoom-window' | null): void => {
  getViewer()?.setConsoleCameraMode(mode)
}

export const frameViewerPrevious = (): void => {
  getViewer()?.framePrevious()
}

export const zoomViewerCameraByWheelDelta = (deltaY: number): void => {
  getViewer()?.zoomCameraByWheelDelta(deltaY)
}

export const beginViewerTemporaryPanDrag = (
  startClientX: number,
  startClientY: number,
): void => {
  getViewer()?.beginTemporaryPanDrag(startClientX, startClientY)
}

export const updateViewerTemporaryPanDrag = (
  clientX: number,
  clientY: number,
): void => {
  getViewer()?.updateTemporaryPanDrag(clientX, clientY)
}

export const endViewerTemporaryPanDrag = (): void => {
  getViewer()?.endTemporaryPanDrag()
}

export const updateViewerTemporaryOrbitDrag = (
  clientX: number,
  clientY: number,
): void => {
  getViewer()?.updateTemporaryOrbitDrag(clientX, clientY)
}

export const endViewerTemporaryOrbitDrag = (): void => {
  getViewer()?.endTemporaryOrbitDrag()
}
