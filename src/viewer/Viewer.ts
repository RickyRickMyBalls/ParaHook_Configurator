import {
  ACESFilmicToneMapping,
  AmbientLight,
  AxesHelper,
  Box3,
  BoxGeometry,
  BufferGeometry,
  Clock,
  Color,
  DoubleSide,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  Light,
  Line,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  NoToneMapping,
  Object3D,
  OrthographicCamera,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Points,
  Quaternion,
  Raycaster,
  Scene,
  SpotLight,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import type { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { ViewerRenderablePart } from '../shared/buildTypes'
import {
  DEFAULT_VIEW_SETTINGS,
  type LightSpec,
  type LightType,
  type MaterialPreset,
  type ProjectionMode,
  type ViewSettings,
} from '../shared/viewSettingsTypes'
import type { ReferenceLoadableItem } from '../app/references/referenceManifest'
import type { ReferenceTransformOverride } from '../app/references/referenceManifest'
import type { ActiveReferenceTransformHandle } from '../app/store/useAppStore'
import { appendConsoleEntry } from '../app/console/useConsoleStore'
import { isEditableTarget, routeKeyboardInput } from '../app/inputRouting'
import type {
  GeometrySketchOverlayVm,
  ViewerTransformHistoryOverlayVm,
  GeometrySketchSnapTarget,
  SketchPlanePickOverlayVm,
  ViewerRuntimeStats,
  ViewerTransformSession,
  ViewerTransformTarget,
  VisibleGeometrySketchOverlayVm,
} from '../app/viewerBridge'
import { loadStepReferenceObject } from './stepReferenceLoader'
import {
  extractReferencePartDescriptors,
  type ReferencePartDescriptor,
} from './referencePartDescriptors'
import { createViewerGeometryFromArtifactMesh } from './artifactMeshGeometry'
import { resolveViewerPartPlacement } from './previewPartPlacement'
import {
  buildGeometrySketchRenderPolylines,
  collectGeometrySketchSelectionIds,
  expandGeometrySketchSelectionFromRowId,
  type GeometrySketchRenderLayer,
} from './geometrySketchOverlay'
import { TransformGizmo } from './gizmo/TransformGizmo'
import { AxisGizmo, type AxisGizmoTarget, type SnapDirection } from './overlay/AxisGizmo'
import { CameraController, type CameraPose, type CameraPreset } from './scene/CameraController'
import { SketchPlanePickHelper } from './sketch/SketchPlanePickHelper'
import { GeometrySketchDrawHelper } from './sketch/GeometrySketchDrawHelper'
import { ReferenceTransformHistoryHelper } from './ReferenceTransformHistoryHelper'
import {
  ReferenceTransformMoveSnapHelper,
  isReferenceTransformMoveSnapHandle,
  type ReferenceTransformMoveSnapOverlay,
} from './ReferenceTransformMoveSnapHelper'
import { ReferenceTransformRotateSnapHelper } from './ReferenceTransformRotateSnapHelper'
import {
  getSketchPlaneWorldNormal,
  getSketchPlaneWorldOrigin,
  getSketchPlaneWorldYAxis,
} from './sketch/sketchPlaneMath'
import type { SketchPlane, SketchPlaneTransform } from '../app/spaghetti/features/featureTypes'
import type { GeometrySketchSelectionWindowDraft } from '../app/spaghetti/store/useSpaghettiStore'
import {
  WORKSPACE_SELECTION_DRAG_THRESHOLD_PX,
  collectWorkspaceSelectionWindowPicks,
  getWorkspaceSelectionWindowMode,
  hasWorkspaceSelectionDragExceededThreshold,
  isObjectWorldVisible,
  type WorkspaceSelectionCandidate,
  type WorkspaceSelectionPick,
  type WorkspaceSelectionPickEvent,
  type WorkspaceSelectionWindowMode,
} from './workspaceSelectionWindow'

type GizmoSpace = 'local' | 'world'
type MaterialPresetId = string
type ReferenceTransformBase = ReferenceTransformOverride
type ReferenceTransformSession = {
  referenceId: string
  mode: TransformControlsMode
  space: GizmoSpace
  entryOrigin: ReferenceTransformOverride | null
}
type ContentObjectTransformSession = {
  objectId: string
  mode: TransformControlsMode
  space: GizmoSpace
  entryOrigin: ReferenceTransformOverride | null
}
type FlyMovementKey =
  | 'forward'
  | 'backward'
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'boost'
  | 'roll-left'
  | 'roll-right'
type FlySession = {
  pointerId: number
  lastClientX: number
  lastClientY: number
  heldKeys: Set<FlyMovementKey>
  pointerLockActive: boolean
}
const DEFAULT_BACKGROUND = '#0b0b0f'
const STUDIO_BACKGROUND = '#151922'
const ACTIVE_PART_SELECTION_OUTLINE = '#9ec3ff'
const GRID_SIZE = 300
const GRID_MINOR_STEP = 1
const GRID_MAJOR_STEP = 10
const GRID_DOUBLE_MAJOR_STEP = 50
const DEFAULT_FLY_CAMERA_MOVE_SPEED_UNITS_PER_SEC = 4
const FLY_CAMERA_BOOST_MULTIPLIER = 3
const FLY_CAMERA_ROLL_RADIANS_PER_SEC = Math.PI * 0.75
const FLY_CAMERA_WHEEL_SPEED_SCALE = 1.1
const MIN_FLY_CAMERA_MOVE_SPEED_UNITS_PER_SEC = 0.1

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const normalizeFlyMoveSpeedUnitsPerSec = (speed: number): number => {
  if (!Number.isFinite(speed)) {
    return DEFAULT_FLY_CAMERA_MOVE_SPEED_UNITS_PER_SEC
  }
  return Math.max(speed, MIN_FLY_CAMERA_MOVE_SPEED_UNITS_PER_SEC)
}

const isMultipleOf = (value: number, step: number): boolean => Math.abs(value % step) < 1e-6

const shouldExcludeGridCoordinate = (coordinate: number, excludedSteps: readonly number[]): boolean =>
  excludedSteps.some((step) => isMultipleOf(coordinate, step))

const getGridCoordinates = (size: number, step: number): number[] => {
  const halfSize = size / 2
  const coordinates = new Set<number>([0])

  for (let coordinate = step; coordinate <= halfSize + 1e-6; coordinate += step) {
    const normalizedCoordinate = Math.round(coordinate * 1_000) / 1_000
    coordinates.add(normalizedCoordinate)
    coordinates.add(-normalizedCoordinate)
  }

  return [...coordinates].sort((left, right) => left - right)
}

const createGridLayer = (
  size: number,
  step: number,
  color: number,
  opacity: number,
  excludedSteps: readonly number[] = [],
): LineSegments => {
  const halfSize = size / 2
  const positions: number[] = []

  for (const coordinate of getGridCoordinates(size, step)) {
    if (shouldExcludeGridCoordinate(coordinate, excludedSteps)) {
      continue
    }

    positions.push(-halfSize, 0, coordinate, halfSize, 0, coordinate)
    positions.push(coordinate, 0, -halfSize, coordinate, 0, halfSize)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))

  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    toneMapped: false,
  })

  return new LineSegments(geometry, material)
}

const cloneViewSettings = (settings: ViewSettings): ViewSettings => ({
  ...settings,
  axisOverlayStyle: {
    ...settings.axisOverlayStyle,
  },
  lighting: {
    selectedLightId: settings.lighting.selectedLightId,
    lights: settings.lighting.lights.map((light) => ({
      ...light,
      position: light.position === undefined ? undefined : { ...light.position },
      target: light.target === undefined ? undefined : { ...light.target },
    })),
  },
  materials: {
    selectedPresetId: settings.materials.selectedPresetId,
    usePerPart: settings.materials.usePerPart,
    presets: settings.materials.presets.map((preset) => ({ ...preset })),
    perPart: { ...settings.materials.perPart },
  },
})

const fallbackPreset = (): MaterialPreset => ({
  id: 'default_matte',
  name: 'Default Matte',
  color: '#5f83d6',
  metalness: 0.06,
  roughness: 0.84,
  emissive: '#000000',
  emissiveIntensity: 0,
  opacity: 1,
  transparent: false,
})

export type ViewerViewportRenderLayers = {
  baseParts: ViewerRenderablePart[]
  baseStyle?: {
    opacity: number
    color: string
  }
  baselineParts: ViewerRenderablePart[]
  baselineStyle?: {
    opacity: number
    color: string
  }
  overlayParts: ViewerRenderablePart[]
  overlayStyle?: {
    opacity: number
    color: string
  }
  overlayOpacity: number
}

const supportsPosition = (type: LightType): boolean =>
  type === 'directional' || type === 'point' || type === 'spot'

const supportsTarget = (type: LightType): boolean =>
  type === 'directional' || type === 'spot'

const toLightType = (light: Light): LightType | null => {
  if (light instanceof DirectionalLight) {
    return 'directional'
  }
  if (light instanceof PointLight) {
    return 'point'
  }
  if (light instanceof SpotLight) {
    return 'spot'
  }
  if (light instanceof HemisphereLight) {
    return 'hemisphere'
  }
  if (light instanceof AmbientLight) {
    return 'ambient'
  }
  return null
}

export class Viewer {
  private readonly container: HTMLElement
  private readonly scene: Scene
  private readonly perspectiveCamera: PerspectiveCamera
  private readonly orthographicCamera: OrthographicCamera
  private readonly renderer: WebGLRenderer
  private readonly clock: Clock
  private readonly rootGroup: Group
  private readonly geometrySketchOverlayGroup: Group
  private readonly visibleGeometrySketchOverlayGroup: Group
  private readonly gridGroup: Group
  private readonly minorGridHelper: LineSegments
  private readonly majorGridHelper: LineSegments
  private readonly doubleMajorGridHelper: LineSegments
  private readonly axesHelper: AxesHelper
  private readonly cameraController: CameraController
  private readonly transformGizmo: TransformGizmo
  private axisGizmo: AxisGizmo | null = null
  private axisOverlayCanvas: HTMLCanvasElement | null = null
  private axisOverlayEnabled = true
  private readonly sketchPlanePickHelper: SketchPlanePickHelper
  private readonly referenceTransformHistoryHelper: ReferenceTransformHistoryHelper
  private readonly referenceTransformMoveSnapHelper: ReferenceTransformMoveSnapHelper
  private readonly referenceTransformRotateSnapHelper: ReferenceTransformRotateSnapHelper
  private readonly geometrySketchDrawHelper: GeometrySketchDrawHelper
  private geometrySketchOverlay: GeometrySketchOverlayVm | null = null
  private geometrySketchCameraAlignKey: string | null = null
  private geometrySketchRestoreCameraPose: CameraPose | null = null
  private sketchPlanePickOverlay: SketchPlanePickOverlayVm | null = null
  private viewerTransformHistoryOverlay: ViewerTransformHistoryOverlayVm | null = null
  private readonly geometrySketchComponentMaterial: LineBasicMaterial
  private readonly geometrySketchDraftChainMaterial: LineBasicMaterial
  private readonly geometrySketchDraftGhostMaterial: LineBasicMaterial
  private readonly geometrySketchHoveredComponentMaterial: LineBasicMaterial
  private readonly geometrySketchSelectedComponentMaterial: LineBasicMaterial
  private readonly geometrySketchProfileMaterial: LineBasicMaterial
  private readonly geometrySketchSelectedProfileMaterial: LineBasicMaterial
  private readonly geometrySketchSelectionWindowMaterial: LineBasicMaterial
  private readonly geometrySketchSelectionCrossingMaterial: LineBasicMaterial
  private readonly raycaster = new Raycaster()
  private readonly pointer = new Vector2()
  private frameId: number | null = null
  private readonly partMeshes = new Map<string, Mesh>()
  private readonly baselinePartMeshes = new Map<string, Mesh>()
  private readonly overlayPartMeshes = new Map<string, Mesh>()
  private readonly partSelectionOutlines = new Map<string, LineSegments>()
  private readonly contentObjectPivots = new Map<string, Group>()
  private readonly partKeyToContentObjectId = new Map<string, string>()
  private contentObjectTransformOverrides: Record<string, ReferenceTransformOverride | null> = {}
  private highlightedPartKeys = new Set<string>()
  private readonly referenceSelectionOutlines = new Map<string, LineSegments[]>()
  private highlightedReferenceIds = new Set<string>()
  private readonly referenceGroup: Group
  private readonly referenceObjects = new Map<string, Object3D>()
  private readonly referencePartDescriptorsByReferenceId = new Map<string, ReferencePartDescriptor[]>()
  private readonly referenceLoadPromises = new Map<string, Promise<void>>()
  private readonly removedReferenceIds = new Set<string>()
  private activeReferenceTransformReferenceId: string | null = null
  private activeReferenceTransformEntryOrigin: ReferenceTransformOverride | null = null
  private activeContentObjectTransformObjectId: string | null = null
  private activeContentObjectTransformEntryOrigin: ReferenceTransformOverride | null = null
  private cameraLockedReferenceId: string | null = null
  private cameraLockedReferenceCenter: Vector3 | null = null
  private cameraLockedReferenceMaxDim: number | null = null
  private cameraLockedReferenceTargetOffset: Vector3 | null = null
  private onReferenceTransformChange:
    | ((referenceId: string, transform: ReferenceTransformOverride) => void)
    | null = null
  private onReferenceTransformCommit: (() => void) | null = null
  private onReferenceTransformExit: (() => void) | null = null
  private onReferenceTransformHandleChange:
    ((handle: ActiveReferenceTransformHandle | null) => void)
    | null = null
  private activeReferenceTransformHandle: ActiveReferenceTransformHandle | null = null
  private lastReferenceTransformMoveSnapHandle: ActiveReferenceTransformHandle | null = null
  private previewLastMoveSnapDotsEnabled = false
  private activeReferenceTransformRotatePreviewBasis:
    | {
        axis: 'x' | 'y' | 'z'
        axisDirection: Vector3
        referenceDirection: Vector3
      }
    | null = null
  private activeReferenceTransformRotatePreviewRingRadius: number | null = null
  private referenceTransformDragging = false
  private gizmoSnap: {
    translate?: { x: number; y: number; z: number }
    rotate?: { x: number; y: number; z: number }
    scale?: { x: number; y: number; z: number }
  } = {}
  private onReferenceTransformModeChange: ((mode: TransformControlsMode) => void) | null = null
  private onReferenceTransformSpaceChange: ((space: GizmoSpace) => void) | null = null
  private onViewerTransformChange:
    | ((target: ViewerTransformTarget, transform: ReferenceTransformOverride) => void)
    | null = null
  private onViewerTransformCommit: (() => void) | null = null
  private onViewerTransformExit: (() => void) | null = null
  private onViewerTransformHandleChange:
    | ((handle: ActiveReferenceTransformHandle | null) => void)
    | null = null
  private onViewerTransformModeChange: ((mode: TransformControlsMode) => void) | null = null
  private onViewerTransformSpaceChange: ((space: GizmoSpace) => void) | null = null
  private onContentObjectTransformChange:
    | ((objectId: string, transform: ReferenceTransformOverride) => void)
    | null = null
  private onContentObjectTransformCommit: (() => void) | null = null
  private onContentObjectTransformHandleChange:
    | ((handle: ActiveReferenceTransformHandle | null) => void)
    | null = null
  private onContentObjectTransformModeChange: ((mode: TransformControlsMode) => void) | null = null
  private onContentObjectTransformSpaceChange: ((space: GizmoSpace) => void) | null = null
  private onSketchPlanePickPlaneSelect: ((plane: SketchPlane) => void) | null = null
  private onSketchPlanePickTransformChange: ((transform: SketchPlaneTransform) => void) | null = null
  private onSketchPlanePickTransformCommit: (() => void) | null = null
  private onFlyMoveSpeedChange: ((speed: number) => void) | null = null
  private onCameraPoseChange: ((pose: CameraPose) => void) | null = null
  private lastEmittedCameraPose: CameraPose | null = null
  private onRuntimeStatsChange: ((stats: ViewerRuntimeStats) => void) | null = null
  private currentRuntimeStats: ViewerRuntimeStats = {
    triangles: null,
    lines: null,
    points: null,
    fps: null,
  }
  private fpsSampleElapsedSec = 0
  private fpsSampleFrameCount = 0
  private statsSampleElapsedSec = 0
  private onGeometrySketchHoverPoint:
    | ((point: { x: number; y: number } | null, snapTarget: GeometrySketchSnapTarget | null) => void)
    | null = null
  private onGeometrySketchConfirmPoint:
    | ((point: { x: number; y: number }, snapTarget: GeometrySketchSnapTarget | null) => void)
    | null = null
  private onGeometrySketchHoverComponent: ((rowId: string | null) => void) | null = null
  private onGeometrySketchSelectComponents: ((rowIds: string[]) => void) | null = null
  private onGeometrySketchSelectionWindowDraftChange:
    | ((draft: GeometrySketchSelectionWindowDraft | null) => void)
    | null = null
  private onGeometrySketchDeleteSelection: (() => void) | null = null
  private onGeometrySketchFinishDraft: (() => void) | null = null
  private onGeometrySketchCancelDraft: (() => void) | null = null
  private onWorkspaceSelectionPick: ((event: WorkspaceSelectionPickEvent) => void) | null = null
  private geometrySketchSelectionDrag:
    | {
        pointerId: number
        anchorPoint: { x: number; y: number }
        anchorClientX: number
        anchorClientY: number
      }
    | null = null
  private cameraOrbitModifierDrag:
    | {
        pointerId: number
      }
    | null = null
  private middleClickTracker:
    | {
        pointerId: number
        anchorClientX: number
        anchorClientY: number
        moved: boolean
      }
    | null = null
  private workspaceSelectionClickTracker:
    | {
        pointerId: number
        anchorClientX: number
        anchorClientY: number
        moved: boolean
        ctrlKey: boolean
      }
    | null = null
  private consoleCameraMode: 'pan' | 'orbit' | 'zoom-window' | null = null
  private consoleCameraModeDrag:
    | {
        pointerId: number
        mode: 'pan' | 'orbit'
      }
    | null = null
  private consoleZoomWindowDrag:
    | {
        pointerId: number
        anchorClientX: number
        anchorClientY: number
      }
    | null = null
  private flySession: FlySession | null = null
  private flyMoveSpeedUnitsPerSec = DEFAULT_FLY_CAMERA_MOVE_SPEED_UNITS_PER_SEC
  private suppressFlyContextMenu = false
  private readonly zoomWindowOverlayRoot: HTMLDivElement
  private readonly zoomWindowOverlayBox: HTMLDivElement
  private readonly workspaceSelectionOverlayRoot: HTMLDivElement
  private readonly workspaceSelectionOverlayBox: HTMLDivElement
  private readonly cameraPoseHistory: CameraPose[] = []
  private lastMiddleClick:
    | {
        atMs: number
        clientX: number
        clientY: number
      }
    | null = null
  private selectedPartKey: string | null = null
  private gizmoEnabled = false
  private gizmoSpace: GizmoSpace = 'local'
  private gizmoMode: TransformControlsMode = 'translate'
  private readonly lightsById = new Map<string, Light>()
  private readonly lightTargetsById = new Map<string, Object3D>()
  private readonly materialCacheByPresetId = new Map<MaterialPresetId, MeshStandardMaterial>()
  private readonly assignedPresetByPartKey = new Map<string, MaterialPresetId>()
  private currentViewSettings: ViewSettings = cloneViewSettings(DEFAULT_VIEW_SETTINGS)
  private readonly resizeObserver: ResizeObserver

  public constructor(container: HTMLElement) {
    this.container = container
    if (window.getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative'
    }
    this.scene = new Scene()
    this.scene.background = new Color(DEFAULT_BACKGROUND)
    this.clock = new Clock()

    this.perspectiveCamera = new PerspectiveCamera(60, 1, 0.1, 1000)
    this.perspectiveCamera.position.set(3, 2.4, 3)
    this.perspectiveCamera.lookAt(0, 0, 0)
    this.orthographicCamera = new OrthographicCamera(-2, 2, 2, -2, 0.1, 1000)
    this.orthographicCamera.position.copy(this.perspectiveCamera.position)
    this.orthographicCamera.up.copy(this.perspectiveCamera.up)
    this.orthographicCamera.lookAt(0, 0, 0)

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.domElement.style.display = 'block'
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.container.appendChild(this.renderer.domElement)
    this.zoomWindowOverlayRoot = document.createElement('div')
    this.zoomWindowOverlayRoot.style.position = 'absolute'
    this.zoomWindowOverlayRoot.style.inset = '0'
    this.zoomWindowOverlayRoot.style.pointerEvents = 'none'
    this.zoomWindowOverlayRoot.style.zIndex = '5'
    this.zoomWindowOverlayBox = document.createElement('div')
    this.zoomWindowOverlayBox.style.position = 'absolute'
    this.zoomWindowOverlayBox.style.display = 'none'
    this.zoomWindowOverlayBox.style.border = '1px solid rgba(122, 196, 255, 0.95)'
    this.zoomWindowOverlayBox.style.background = 'rgba(122, 196, 255, 0.12)'
    this.zoomWindowOverlayBox.style.boxSizing = 'border-box'
    this.zoomWindowOverlayRoot.appendChild(this.zoomWindowOverlayBox)
    this.container.appendChild(this.zoomWindowOverlayRoot)
    this.workspaceSelectionOverlayRoot = document.createElement('div')
    this.workspaceSelectionOverlayRoot.style.position = 'absolute'
    this.workspaceSelectionOverlayRoot.style.inset = '0'
    this.workspaceSelectionOverlayRoot.style.pointerEvents = 'none'
    this.workspaceSelectionOverlayRoot.style.zIndex = '5'
    this.workspaceSelectionOverlayBox = document.createElement('div')
    this.workspaceSelectionOverlayBox.style.position = 'absolute'
    this.workspaceSelectionOverlayBox.style.display = 'none'
    this.workspaceSelectionOverlayBox.style.boxSizing = 'border-box'
    this.workspaceSelectionOverlayRoot.appendChild(this.workspaceSelectionOverlayBox)
    this.container.appendChild(this.workspaceSelectionOverlayRoot)

    this.gridGroup = new Group()
    this.minorGridHelper = createGridLayer(
      GRID_SIZE,
      GRID_MINOR_STEP,
      0xffffff,
      0.1,
      [GRID_MAJOR_STEP, GRID_DOUBLE_MAJOR_STEP],
    )
    this.majorGridHelper = createGridLayer(
      GRID_SIZE,
      GRID_MAJOR_STEP,
      0xffffff,
      0.3,
      [GRID_DOUBLE_MAJOR_STEP],
    )
    this.doubleMajorGridHelper = createGridLayer(
      GRID_SIZE,
      GRID_DOUBLE_MAJOR_STEP,
      0xffffff,
      1,
    )
    this.majorGridHelper.position.y = 0.001
    this.doubleMajorGridHelper.position.y = 0.002
    this.gridGroup.add(this.minorGridHelper)
    this.gridGroup.add(this.majorGridHelper)
    this.gridGroup.add(this.doubleMajorGridHelper)
    this.scene.add(this.gridGroup)

    this.axesHelper = new AxesHelper(1.5)
    this.axesHelper.visible = false
    this.scene.add(this.axesHelper)
    this.geometrySketchOverlayGroup = new Group()
    this.geometrySketchOverlayGroup.renderOrder = 96
    this.scene.add(this.geometrySketchOverlayGroup)
    this.visibleGeometrySketchOverlayGroup = new Group()
    this.visibleGeometrySketchOverlayGroup.renderOrder = 94
    this.scene.add(this.visibleGeometrySketchOverlayGroup)
    this.sketchPlanePickHelper = new SketchPlanePickHelper()
    this.scene.add(this.sketchPlanePickHelper.getGroup())
    this.referenceTransformHistoryHelper = new ReferenceTransformHistoryHelper()
    this.scene.add(this.referenceTransformHistoryHelper.getGroup())
    this.referenceTransformMoveSnapHelper = new ReferenceTransformMoveSnapHelper()
    this.scene.add(this.referenceTransformMoveSnapHelper.getGroup())
    this.referenceTransformRotateSnapHelper = new ReferenceTransformRotateSnapHelper()
    this.scene.add(this.referenceTransformRotateSnapHelper.getGroup())
    this.geometrySketchDrawHelper = new GeometrySketchDrawHelper()
    this.scene.add(this.geometrySketchDrawHelper.getGroup())
    this.geometrySketchComponentMaterial = new LineBasicMaterial({
      color: new Color('#8bbdff'),
      transparent: true,
      opacity: 0.96,
      toneMapped: false,
      depthTest: false,
    })
    this.geometrySketchDraftChainMaterial = new LineBasicMaterial({
      color: new Color('#8bbdff'),
      transparent: true,
      opacity: 0.98,
      toneMapped: false,
      depthTest: false,
    })
    this.geometrySketchDraftGhostMaterial = new LineBasicMaterial({
      color: new Color('#c7ffd5'),
      transparent: true,
      opacity: 1,
      toneMapped: false,
      depthTest: false,
    })
    this.geometrySketchHoveredComponentMaterial = new LineBasicMaterial({
      color: new Color('#f4f8ff'),
      transparent: true,
      opacity: 0.96,
      toneMapped: false,
      depthTest: false,
    })
    this.geometrySketchSelectedComponentMaterial = new LineBasicMaterial({
      color: new Color('#ffd66b'),
      transparent: true,
      opacity: 1,
      toneMapped: false,
      depthTest: false,
    })
    this.geometrySketchProfileMaterial = new LineBasicMaterial({
      color: new Color('#74f2cf'),
      transparent: true,
      opacity: 0.92,
      toneMapped: false,
      depthTest: false,
    })
    this.geometrySketchSelectedProfileMaterial = new LineBasicMaterial({
      color: new Color('#ffd66b'),
      transparent: true,
      opacity: 1,
      toneMapped: false,
      depthTest: false,
    })
    this.geometrySketchSelectionWindowMaterial = new LineBasicMaterial({
      color: new Color('#68a9ff'),
      transparent: true,
      opacity: 0.96,
      toneMapped: false,
      depthTest: false,
    })
    this.geometrySketchSelectionCrossingMaterial = new LineBasicMaterial({
      color: new Color('#59e39c'),
      transparent: true,
      opacity: 0.96,
      toneMapped: false,
      depthTest: false,
    })

    this.rootGroup = new Group()
    this.scene.add(this.rootGroup)
    this.referenceGroup = new Group()
    this.rootGroup.add(this.referenceGroup)

    this.cameraController = new CameraController(
      this.perspectiveCamera,
      this.orthographicCamera,
      this.renderer.domElement,
    )
    this.transformGizmo = new TransformGizmo(
      this.cameraController.getActiveCamera(),
      this.renderer.domElement,
      this.cameraController.getControls(),
    )
    this.transformGizmo.setOnObjectChange(this.handleTransformGizmoObjectChange)
    this.transformGizmo.setOnDragComplete(this.handleTransformGizmoDragComplete)
    this.transformGizmo.setOnDraggingChange(this.handleReferenceTransformDraggingChange)
    this.transformGizmo.setOnHandleChange(this.handleReferenceTransformHandleChange)
    this.transformGizmo.setMode(this.gizmoMode)
    this.transformGizmo.setSpace(this.gizmoSpace)
    this.syncGizmoEnabledState()
    this.scene.add(this.transformGizmo.getHelper())

    this.resizeObserver = new ResizeObserver(this.handleResize)
    this.resizeObserver.observe(this.container)

    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('blur', this.handleWindowBlur)
    this.renderer.domElement.addEventListener(
      'pointerdown',
      this.handleSketchPlanePickPointerDown,
      true,
    )
    this.renderer.domElement.addEventListener(
      'pointermove',
      this.handleSketchPlanePickPointerMove,
      true,
    )
    this.renderer.domElement.addEventListener(
      'pointerup',
      this.handleSketchPlanePickPointerUp,
      true,
    )
    this.renderer.domElement.addEventListener(
      'pointercancel',
      this.handleViewerPointerCancel,
      true,
    )
    this.renderer.domElement.addEventListener('wheel', this.handleViewerWheel, {
      capture: true,
      passive: false,
    })
    this.renderer.domElement.addEventListener('contextmenu', this.handleViewerContextMenu)

    this.applyViewSettings(this.currentViewSettings)
    this.handleResize()
    this.renderLoop()
  }

  public setParts(
    parts: ViewerRenderablePart[],
    visibility: Record<string, boolean>,
    selectedPartKey: string | null = this.selectedPartKey,
  ): void {
    this.setViewportRenderLayers(
      {
        baseParts: parts,
        baseStyle: {
          opacity: 1,
          color: '#5f83d6',
        },
        baselineParts: [],
        overlayParts: [],
        overlayStyle: {
          opacity: 0.5,
          color: '#5f83d6',
        },
        overlayOpacity: 0.5,
      },
      visibility,
      selectedPartKey,
    )
  }

  public setViewportRenderLayers(
    layers: ViewerViewportRenderLayers,
    visibility: Record<string, boolean>,
    selectedPartKey: string | null = this.selectedPartKey,
  ): void {
    this.selectedPartKey = selectedPartKey
    this.clearPartMeshes()
    this.contentObjectPivots.clear()

    let xCursor = -2
    for (const part of layers.baseParts) {
      const partKeyStr = part.viewerKey
      const artifact = part.artifact
      const baseMaterial = this.resolveMaterialForPart(partKeyStr)
      const material = this.createLayerMaterial(baseMaterial, layers.baseStyle)
      const geometry =
        artifact.kind === 'box'
          ? new BoxGeometry(
              artifact.params.length,
              artifact.params.height,
              artifact.params.width,
            )
          : createViewerGeometryFromArtifactMesh(artifact.mesh)
      if (geometry === null) {
        continue
      }
      const mesh = new Mesh(geometry, material)
      mesh.name = partKeyStr
      const placement = resolveViewerPartPlacement(artifact, geometry, xCursor)
      mesh.position.set(placement.position.x, placement.position.y, placement.position.z)
      mesh.visible = visibility[partKeyStr] ?? true
      mesh.castShadow = this.currentViewSettings.shadowsEnabled
      mesh.receiveShadow = this.currentViewSettings.shadowsEnabled
      mesh.userData.partKey = partKeyStr
      mesh.userData.disposeMaterial = material !== baseMaterial
      const selectionOutline = new LineSegments(
        new EdgesGeometry(geometry),
        new LineBasicMaterial({
          color: new Color(ACTIVE_PART_SELECTION_OUTLINE),
          transparent: true,
          opacity: 0.96,
          toneMapped: false,
          depthTest: false,
          depthWrite: false,
        }),
      )
      selectionOutline.name = `${partKeyStr}:selection-outline`
      selectionOutline.visible = false
      selectionOutline.renderOrder = 120
      selectionOutline.frustumCulled = false
      selectionOutline.userData.partKey = partKeyStr
      selectionOutline.userData.selectionOverlay = true
      mesh.add(selectionOutline)
      const contentObjectId = this.partKeyToContentObjectId.get(partKeyStr) ?? null
      if (contentObjectId !== null) {
        let pivot = this.contentObjectPivots.get(contentObjectId)
        if (pivot === undefined) {
          pivot = new Group()
          pivot.name = `${contentObjectId}:pivot`
          pivot.userData.referenceTransformBase = {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          } satisfies ReferenceTransformBase
          this.contentObjectPivots.set(contentObjectId, pivot)
          this.rootGroup.add(pivot)
        }
        pivot.add(mesh)
      } else {
        this.rootGroup.add(mesh)
      }
      this.partMeshes.set(partKeyStr, mesh)
      this.partSelectionOutlines.set(partKeyStr, selectionOutline)
      if (placement.lengthForCursor > 0) {
        xCursor += placement.lengthForCursor + 0.2
      }
    }

    for (const part of layers.overlayParts) {
      const partKeyStr = part.viewerKey
      const artifact = part.artifact
      const material = this.createLayerMaterial(
        this.resolveMaterialForPart(partKeyStr),
        layers.overlayStyle,
        layers.overlayOpacity,
        true,
      )
      const geometry =
        artifact.kind === 'box'
          ? new BoxGeometry(
              artifact.params.length,
              artifact.params.height,
              artifact.params.width,
            )
          : createViewerGeometryFromArtifactMesh(artifact.mesh)
      if (geometry === null) {
        material.dispose()
        continue
      }
      const mesh = new Mesh(geometry, material)
      mesh.name = `${partKeyStr}:overlay`
      const placement = resolveViewerPartPlacement(artifact, geometry, xCursor)
      mesh.position.set(placement.position.x, placement.position.y, placement.position.z)
      mesh.visible = visibility[partKeyStr] ?? true
      mesh.castShadow = false
      mesh.receiveShadow = false
      mesh.renderOrder = 40
      mesh.userData.partKey = partKeyStr
      mesh.userData.disposeMaterial = true
      const contentObjectId = this.partKeyToContentObjectId.get(partKeyStr) ?? null
      if (contentObjectId !== null) {
        let pivot = this.contentObjectPivots.get(contentObjectId)
        if (pivot === undefined) {
          pivot = new Group()
          pivot.name = `${contentObjectId}:pivot`
          pivot.userData.referenceTransformBase = {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          } satisfies ReferenceTransformBase
          this.contentObjectPivots.set(contentObjectId, pivot)
          this.rootGroup.add(pivot)
        }
        pivot.add(mesh)
      } else {
        this.rootGroup.add(mesh)
      }
      this.overlayPartMeshes.set(partKeyStr, mesh)
    }

    for (const part of layers.baselineParts) {
      const partKeyStr = part.viewerKey
      const artifact = part.artifact
      const material = this.createLayerMaterial(
        this.resolveMaterialForPart(partKeyStr),
        layers.baselineStyle,
      )
      const geometry =
        artifact.kind === 'box'
          ? new BoxGeometry(
              artifact.params.length,
              artifact.params.height,
              artifact.params.width,
            )
          : createViewerGeometryFromArtifactMesh(artifact.mesh)
      if (geometry === null) {
        material.dispose()
        continue
      }
      const mesh = new Mesh(geometry, material)
      mesh.name = `${partKeyStr}:baseline`
      const placement = resolveViewerPartPlacement(artifact, geometry, xCursor)
      mesh.position.set(placement.position.x, placement.position.y, placement.position.z)
      mesh.visible = visibility[partKeyStr] ?? true
      mesh.castShadow = false
      mesh.receiveShadow = false
      mesh.renderOrder = 20
      mesh.userData.partKey = partKeyStr
      mesh.userData.disposeMaterial = true
      const contentObjectId = this.partKeyToContentObjectId.get(partKeyStr) ?? null
      if (contentObjectId !== null) {
        let pivot = this.contentObjectPivots.get(contentObjectId)
        if (pivot === undefined) {
          pivot = new Group()
          pivot.name = `${contentObjectId}:pivot`
          pivot.userData.referenceTransformBase = {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          } satisfies ReferenceTransformBase
          this.contentObjectPivots.set(contentObjectId, pivot)
          this.rootGroup.add(pivot)
        }
        pivot.add(mesh)
      } else {
        this.rootGroup.add(mesh)
      }
      this.baselinePartMeshes.set(partKeyStr, mesh)
    }

    for (const [objectId, pivot] of this.contentObjectPivots.entries()) {
      this.anchorContentObjectPivotToBoundsCenter(pivot)
      this.applyReferenceTransformOverride(pivot, this.contentObjectTransformOverrides[objectId] ?? null)
    }

    this.refreshSelectionStyling()
    this.refreshGizmoAttachment()
  }

  public applyViewSettings(settings: ViewSettings): void {
    this.currentViewSettings = cloneViewSettings(settings)

    this.setProjectionMode(settings.projectionMode)
    this.syncCameraInteractionState()
    this.gridGroup.visible =
      this.geometrySketchOverlay?.mode === 'draw' ? false : settings.gridVisible
    this.axesHelper.visible = settings.axesVisible

    this.renderer.shadowMap.enabled = settings.shadowsEnabled
    this.renderer.toneMapping =
      settings.toneMapping === 'aces' ? ACESFilmicToneMapping : NoToneMapping
    this.renderer.toneMappingExposure = settings.exposure

    this.scene.background = new Color(
      settings.envPreset === 'studio' ? STUDIO_BACKGROUND : DEFAULT_BACKGROUND,
    )

    this.setAxisOverlayEnabled(settings.axisOverlayEnabled)
    this.axisGizmo?.setStyle(settings.axisOverlayStyle)
    this.applyLights(settings.lighting.lights)
    this.applyMaterialSettings(settings.materials)
    this.applyShadowFlags()
    this.refreshSelectionStyling()
  }

  public setProjectionMode(mode: ProjectionMode): void {
    this.cameraController.setProjectionMode(mode)
    if (
      this.geometrySketchOverlay?.mode === 'draw' &&
      this.geometrySketchOverlay.activeTool === null
    ) {
      this.alignCameraToGeometrySketchPlaneInternal(this.geometrySketchOverlay)
    }
    this.transformGizmo.setCamera(this.cameraController.getActiveCamera())
  }

  public setCameraPreset(preset: CameraPreset): void {
    this.cameraController.setPreset(preset)
  }

  public alignCameraToGeometrySketchPlane(): void {
    if (this.geometrySketchOverlay === null) {
      return
    }
    this.alignCameraToGeometrySketchPlaneInternal(this.geometrySketchOverlay)
    appendConsoleEntry({
      layer: 'View',
      text: 'Align camera: sketch plane',
      source: 'viewer',
      severity: 'info',
    })
  }

  public snapCameraToDirection(dir: SnapDirection): void {
    const direction = this.mapSnapDirectionToVector(dir)
    this.cameraController.snapToDirection(direction)
    appendConsoleEntry({
      layer: 'View',
      text: `Snap camera: ${dir}`,
      source: 'viewer',
      severity: 'info',
    })
  }

  private snapCameraToOrientationTarget(target: AxisGizmoTarget): void {
    this.cameraController.animateToDirection(
      new Vector3(target.direction[0], target.direction[1], target.direction[2]),
      {
        durationMs: 320,
      },
    )
    appendConsoleEntry({
      layer: 'View',
      text: `Snap camera: ${this.describeAxisGizmoTarget(target)}`,
      source: 'viewer',
      severity: 'info',
    })
  }

  public async ensureReferenceLoaded(reference: ReferenceLoadableItem): Promise<void> {
    this.removedReferenceIds.delete(reference.referenceId)
    if (this.referenceObjects.has(reference.referenceId)) {
      return
    }
    const existingPromise = this.referenceLoadPromises.get(reference.referenceId)
    if (existingPromise !== undefined) {
      return existingPromise
    }

    const loadPromise = this.loadReferenceObject(reference)
        .then((object) => {
          if (this.removedReferenceIds.has(reference.referenceId)) {
            this.disposeObjectTree(object)
            return
          }
          this.referencePartDescriptorsByReferenceId.set(
            reference.referenceId,
            extractReferencePartDescriptors(reference.referenceId, object),
          )
          object.name = reference.referenceId
          this.applyReferenceObjectDefaults(object)
          this.referenceObjects.set(reference.referenceId, object)
        this.refreshReferenceHighlightStyling()
        this.syncReferenceTransformHistoryOverlay()
      })
      .finally(() => {
        this.referenceLoadPromises.delete(reference.referenceId)
      })
    this.referenceLoadPromises.set(reference.referenceId, loadPromise)
    return loadPromise
  }

  public setReferenceVisible(referenceId: string, visible: boolean): void {
    const object = this.referenceObjects.get(referenceId)
    if (!visible && this.activeReferenceTransformReferenceId === referenceId) {
      this.requestReferenceTransformExit()
    }
    if (!visible && this.cameraLockedReferenceId === referenceId) {
      this.cameraLockedReferenceId = null
      this.cameraLockedReferenceCenter = null
      this.cameraLockedReferenceMaxDim = null
      this.cameraLockedReferenceTargetOffset = null
    }
    if (object === undefined) {
      return
    }
    if (visible) {
      if (object.parent !== this.referenceGroup) {
        this.referenceGroup.add(object)
      }
      object.visible = true
      this.refreshReferenceHighlightStyling()
      this.refreshGizmoAttachment()
      this.syncReferenceTransformHistoryOverlay()
      this.syncReferenceTransformMoveSnapAvailabilityOverlay()
      return
    }
    if (object.parent === this.referenceGroup) {
      this.referenceGroup.remove(object)
    }
    object.visible = false
    this.refreshReferenceHighlightStyling()
    this.refreshGizmoAttachment()
    this.syncReferenceTransformHistoryOverlay()
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
  }

  public getReferencePartDescriptors(referenceId: string): ReferencePartDescriptor[] {
    return [...(this.referencePartDescriptorsByReferenceId.get(referenceId) ?? [])]
  }

  public removeReference(referenceId: string): void {
    this.removedReferenceIds.add(referenceId)
    if (this.activeReferenceTransformReferenceId === referenceId) {
      this.requestReferenceTransformExit()
    }
    if (this.cameraLockedReferenceId === referenceId) {
      this.cameraLockedReferenceId = null
      this.cameraLockedReferenceCenter = null
      this.cameraLockedReferenceMaxDim = null
      this.cameraLockedReferenceTargetOffset = null
    }
    const object = this.referenceObjects.get(referenceId)
    if (object === undefined) {
      return
    }
    if (object.parent === this.referenceGroup) {
      this.referenceGroup.remove(object)
    }
    this.disposeObjectTree(object)
    this.referenceObjects.delete(referenceId)
    this.referencePartDescriptorsByReferenceId.delete(referenceId)
    this.referenceSelectionOutlines.delete(referenceId)
    this.refreshReferenceHighlightStyling()
    this.refreshGizmoAttachment()
    this.syncReferenceTransformHistoryOverlay()
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  public setReferenceTransformSession(session: ReferenceTransformSession | null): void {
    this.activeReferenceTransformReferenceId = session?.referenceId ?? null
    this.activeReferenceTransformEntryOrigin = session?.entryOrigin ?? null
    if (session !== null) {
      this.activeContentObjectTransformObjectId = null
      this.activeContentObjectTransformEntryOrigin = null
    }
    this.lastReferenceTransformMoveSnapHandle = null
    this.activeReferenceTransformRotatePreviewBasis = null
    this.activeReferenceTransformRotatePreviewRingRadius = null
    if (session !== null) {
      this.gizmoMode = session.mode
      this.gizmoSpace = session.space
      this.transformGizmo.setMode(session.mode)
      this.transformGizmo.setSpace(session.space)
    }
    this.syncGizmoEnabledState()
    this.refreshReferenceHighlightStyling()
    this.refreshGizmoAttachment()
    this.syncReferenceTransformHistoryOverlay()
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  public setContentObjectTransformGroups(
    groups: Array<{
      objectId: string
      partKeys: string[]
    }>,
  ): void {
    this.partKeyToContentObjectId.clear()
    groups.forEach((group) => {
      group.partKeys.forEach((partKey) => {
        this.partKeyToContentObjectId.set(partKey, group.objectId)
      })
    })
  }

  public setContentObjectTransformOverrides(
    overrides: Record<string, ReferenceTransformOverride | null>,
  ): void {
    this.contentObjectTransformOverrides = { ...overrides }
    for (const [objectId, pivot] of this.contentObjectPivots.entries()) {
      this.applyReferenceTransformOverride(pivot, this.contentObjectTransformOverrides[objectId] ?? null)
    }
    this.refreshGizmoAttachment()
  }

  public setContentObjectTransformSession(session: ContentObjectTransformSession | null): void {
    this.activeContentObjectTransformObjectId = session?.objectId ?? null
    this.activeContentObjectTransformEntryOrigin = session?.entryOrigin ?? null
    if (session !== null) {
      this.activeReferenceTransformReferenceId = null
      this.activeReferenceTransformEntryOrigin = null
      this.lastReferenceTransformMoveSnapHandle = null
      this.activeReferenceTransformRotatePreviewBasis = null
      this.activeReferenceTransformRotatePreviewRingRadius = null
    }
    if (session !== null) {
      this.gizmoMode = session.mode
      this.gizmoSpace = session.space
      this.transformGizmo.setMode(session.mode)
      this.transformGizmo.setSpace(session.space)
    }
    this.syncGizmoEnabledState()
    this.refreshGizmoAttachment()
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  public setViewerTransformSession(session: ViewerTransformSession | null): void {
    if (session === null) {
      this.setReferenceTransformSession(null)
      this.setContentObjectTransformSession(null)
      return
    }
    if (session.targetKind === 'reference') {
      this.setReferenceTransformSession({
        referenceId: session.targetId,
        mode: session.mode,
        space: session.space,
        entryOrigin: session.entryOrigin,
      })
      return
    }
    this.setContentObjectTransformSession({
      objectId: session.targetId,
      mode: session.mode,
      space: session.space,
      entryOrigin: session.entryOrigin,
    })
  }

  public setViewerTransformHistoryOverlay(
    overlay: ViewerTransformHistoryOverlayVm | null,
  ): void {
    this.viewerTransformHistoryOverlay = overlay
    this.syncReferenceTransformHistoryOverlay()
  }

  public setReferenceCameraLock(referenceId: string | null): void {
    this.cameraLockedReferenceId = referenceId
    if (referenceId !== null) {
      const object = this.referenceObjects.get(referenceId)
      if (object !== undefined) {
        const metrics = this.readReferenceBoundsMetrics(object)
        const scaleAnchor = this.readReferenceScaleAnchor(object)
        this.cameraLockedReferenceCenter = metrics?.center ?? null
        this.cameraLockedReferenceMaxDim = metrics?.maxDim ?? null
        this.cameraLockedReferenceTargetOffset = this.cameraController
          .getControls()
          .target.clone()
          .sub(scaleAnchor)
        return
      }
      this.cameraLockedReferenceCenter = null
      this.cameraLockedReferenceMaxDim = null
      this.cameraLockedReferenceTargetOffset = null
      return
    }
    this.cameraLockedReferenceCenter = null
    this.cameraLockedReferenceMaxDim = null
    this.cameraLockedReferenceTargetOffset = null
  }

  public setReferenceTransformOverride(
    referenceId: string,
    transformOverride: ReferenceTransformOverride | null,
  ): void {
    const object = this.referenceObjects.get(referenceId)
    if (object === undefined) {
      return
    }
    this.applyReferenceTransformOverride(object, transformOverride)
    if (this.cameraLockedReferenceId === referenceId) {
      this.syncLockedReferenceCamera(object)
    }
  }

  public setOnContentObjectTransformChange(
    handler: ((objectId: string, transform: ReferenceTransformOverride) => void) | null,
  ): void {
    this.onContentObjectTransformChange = handler
  }

  public setOnContentObjectTransformCommit(handler: (() => void) | null): void {
    this.onContentObjectTransformCommit = handler
  }

  public setOnContentObjectTransformHandleChange(
    handler: ((handle: ActiveReferenceTransformHandle | null) => void) | null,
  ): void {
    this.onContentObjectTransformHandleChange = handler
  }

  public setOnContentObjectTransformModeChange(
    handler: ((mode: TransformControlsMode) => void) | null,
  ): void {
    this.onContentObjectTransformModeChange = handler
  }

  public setOnContentObjectTransformSpaceChange(handler: ((space: GizmoSpace) => void) | null): void {
    this.onContentObjectTransformSpaceChange = handler
  }

  public setOnReferenceTransformChange(
    handler: ((referenceId: string, transform: ReferenceTransformOverride) => void) | null,
  ): void {
    this.onReferenceTransformChange = handler
  }

  public setOnReferenceTransformCommit(handler: (() => void) | null): void {
    this.onReferenceTransformCommit = handler
  }

  public setOnReferenceTransformExit(handler: (() => void) | null): void {
    this.onReferenceTransformExit = handler
  }

  public setOnReferenceTransformHandleChange(
    handler: ((handle: ActiveReferenceTransformHandle | null) => void) | null,
  ): void {
    this.onReferenceTransformHandleChange = handler
  }

  public setOnReferenceTransformModeChange(
    handler: ((mode: TransformControlsMode) => void) | null,
  ): void {
    this.onReferenceTransformModeChange = handler
  }

  public setOnReferenceTransformSpaceChange(handler: ((space: GizmoSpace) => void) | null): void {
    this.onReferenceTransformSpaceChange = handler
  }

  public setOnViewerTransformChange(
    handler: ((target: ViewerTransformTarget, transform: ReferenceTransformOverride) => void) | null,
  ): void {
    this.onViewerTransformChange = handler
  }

  public setOnViewerTransformCommit(handler: (() => void) | null): void {
    this.onViewerTransformCommit = handler
  }

  public setOnViewerTransformExit(handler: (() => void) | null): void {
    this.onViewerTransformExit = handler
  }

  public setOnViewerTransformHandleChange(
    handler: ((handle: ActiveReferenceTransformHandle | null) => void) | null,
  ): void {
    this.onViewerTransformHandleChange = handler
  }

  public setOnViewerTransformModeChange(
    handler: ((mode: TransformControlsMode) => void) | null,
  ): void {
    this.onViewerTransformModeChange = handler
  }

  public setOnViewerTransformSpaceChange(handler: ((space: GizmoSpace) => void) | null): void {
    this.onViewerTransformSpaceChange = handler
  }

  public beginTemporaryOrbitDrag(startClientX: number, startClientY: number): void {
    if (!this.currentViewSettings.orbitEnabled) {
      return
    }
    this.rememberCameraPose()
    this.cameraController.beginTemporaryOrbitDrag(startClientX, startClientY)
  }

  public updateTemporaryOrbitDrag(clientX: number, clientY: number): void {
    if (!this.currentViewSettings.orbitEnabled) {
      return
    }
    this.cameraController.updateTemporaryOrbitDrag(clientX, clientY)
  }

  public endTemporaryOrbitDrag(): void {
    this.cameraController.endTemporaryOrbitDrag()
  }

  public zoomCameraByWheelDelta(deltaY: number): void {
    if (!this.currentViewSettings.orbitEnabled) {
      return
    }
    if (this.flySession !== null) {
      if (!Number.isFinite(deltaY) || deltaY === 0) {
        return
      }
      const currentSpeed = this.getFlyMoveSpeed()
      const nextSpeed =
        deltaY < 0
          ? currentSpeed * FLY_CAMERA_WHEEL_SPEED_SCALE
          : currentSpeed / FLY_CAMERA_WHEEL_SPEED_SCALE
      this.setFlyMoveSpeed(nextSpeed)
      return
    }
    this.rememberCameraPose()
    this.cameraController.zoomByWheelDelta(deltaY)
  }

  public beginTemporaryPanDrag(startClientX: number, startClientY: number): void {
    if (!this.currentViewSettings.orbitEnabled) {
      return
    }
    this.rememberCameraPose()
    this.cameraController.beginTemporaryPanDrag(startClientX, startClientY)
  }

  public updateTemporaryPanDrag(clientX: number, clientY: number): void {
    if (!this.currentViewSettings.orbitEnabled) {
      return
    }
    this.cameraController.updateTemporaryPanDrag(clientX, clientY)
  }

  public endTemporaryPanDrag(): void {
    this.cameraController.endTemporaryPanDrag()
  }

  public isFlyModeActive(): boolean {
    return this.flySession !== null
  }

  public getFlyMoveSpeed(): number {
    return this.flyMoveSpeedUnitsPerSec
  }

  public setFlyMoveSpeed(speed: number): void {
    this.flyMoveSpeedUnitsPerSec = normalizeFlyMoveSpeedUnitsPerSec(speed)
    this.onFlyMoveSpeedChange?.(this.flyMoveSpeedUnitsPerSec)
  }

  public setOnFlyMoveSpeedChange(handler: ((speed: number) => void) | null): void {
    this.onFlyMoveSpeedChange = handler
  }

  public frameAll(): void {
    this.rememberCameraPose()
    this.cameraController.frameBox(this.getFrameAllBounds())
    appendConsoleEntry({
      layer: 'View',
      text: 'Frame all',
      source: 'viewer',
      severity: 'info',
    })
  }

  public frameExtents(): void {
    this.rememberCameraPose()
    this.cameraController.frameBox(this.getFrameExtentsBounds())
    appendConsoleEntry({
      layer: 'View',
      text: 'Zoom extents',
      source: 'viewer',
      severity: 'info',
    })
  }

  public frameGeometrySketch(): void {
    const sketchBounds = this.getGeometrySketchFrameBounds()
    if (sketchBounds.isEmpty()) {
      appendConsoleEntry({
        layer: 'View',
        text: 'Sketch zoom: no sketch geometry to frame',
        source: 'viewer',
        severity: 'warn',
      })
      return
    }
    this.rememberCameraPose()
    this.cameraController.frameBox(sketchBounds)
    appendConsoleEntry({
      layer: 'View',
      text: 'Sketch zoom extents',
      source: 'viewer',
      severity: 'info',
    })
  }

  public frameSelectedGeometrySketch(): boolean {
    const selectedBounds = this.getSelectedGeometrySketchFrameBounds()
    if (selectedBounds.isEmpty()) {
      appendConsoleEntry({
        layer: 'View',
        text: 'Sketch zoom object: no selected sketch geometry',
        source: 'viewer',
        severity: 'warn',
      })
      return false
    }
    this.rememberCameraPose()
    this.cameraController.frameBox(selectedBounds)
    appendConsoleEntry({
      layer: 'View',
      text: 'Sketch zoom object',
      source: 'viewer',
      severity: 'info',
    })
    return true
  }

  public framePrevious(): void {
    const previousPose = this.cameraPoseHistory.pop() ?? null
    if (previousPose === null) {
      appendConsoleEntry({
        layer: 'View',
        text: 'Zoom previous: no stored camera pose',
        source: 'viewer',
        severity: 'warn',
      })
      return
    }
    this.cameraController.animateToPose(previousPose, {
      durationMs: 220,
    })
    appendConsoleEntry({
      layer: 'View',
      text: 'Zoom previous',
      source: 'viewer',
      severity: 'info',
    })
  }

  public getCameraPose(): CameraPose {
    return this.cameraController.getPose()
  }

  public applyCameraPose(pose: CameraPose): void {
    this.cameraController.applyPose(pose)
  }

  public setOnCameraPoseChange(handler: ((pose: CameraPose) => void) | null): void {
    this.onCameraPoseChange = handler
    if (handler === null) {
      return
    }
    const pose = this.cameraController.getPose()
    this.lastEmittedCameraPose = pose
    handler({
      position: pose.position.clone(),
      target: pose.target.clone(),
      up: pose.up.clone(),
      projectionMode: pose.projectionMode,
      perspectiveFovDeg: pose.perspectiveFovDeg,
      orthoViewHeight: pose.orthoViewHeight,
    })
  }

  public getRuntimeStats(): ViewerRuntimeStats {
    return { ...this.currentRuntimeStats }
  }

  public setOnRuntimeStatsChange(
    handler: ((stats: ViewerRuntimeStats) => void) | null,
  ): void {
    this.onRuntimeStatsChange = handler
    handler?.(this.getRuntimeStats())
  }

  public frameSelected(partId: string | null): void {
    if (partId === null) {
      this.frameAll()
      return
    }
    const obj = this.partMeshes.get(partId)
    if (obj === undefined) {
      this.frameAll()
      return
    }
    this.rememberCameraPose()
    this.cameraController.frameObject(obj)
    appendConsoleEntry({
      layer: 'View',
      text: `Zoom selected: ${partId}`,
      source: 'viewer',
      severity: 'info',
    })
  }

  public frameSelectionSet(partIds: string[], referenceIds: string[]): boolean {
    const bounds = new Box3()
    let hasTarget = false

    for (const partId of partIds) {
      const obj = this.partMeshes.get(partId)
      if (obj === undefined) {
        continue
      }
      bounds.union(new Box3().setFromObject(obj, true))
      hasTarget = true
    }

    for (const referenceId of referenceIds) {
      const obj = this.referenceObjects.get(referenceId)
      if (obj === undefined) {
        continue
      }
      bounds.union(new Box3().setFromObject(obj, true))
      hasTarget = true
    }

    if (!hasTarget || bounds.isEmpty()) {
      appendConsoleEntry({
        layer: 'View',
        text: 'Zoom selected set: no selected objects',
        source: 'viewer',
        severity: 'warn',
      })
      return false
    }

    this.rememberCameraPose()
    this.cameraController.frameBox(bounds)
    appendConsoleEntry({
      layer: 'View',
      text: 'Zoom selected set',
      source: 'viewer',
      severity: 'info',
    })
    return true
  }

  public frameReference(referenceId: string): void {
    const obj = this.referenceObjects.get(referenceId)
    if (obj === undefined) {
      this.frameAll()
      return
    }
    this.rememberCameraPose()
    this.cameraController.frameObject(obj)
    appendConsoleEntry({
      layer: 'View',
      text: `Zoom reference: ${referenceId}`,
      source: 'viewer',
      severity: 'info',
    })
  }

  public setConsoleCameraMode(mode: 'pan' | 'orbit' | 'zoom-window' | null): void {
    this.consoleCameraMode = mode
    if (mode === null) {
      this.consoleCameraModeDrag = null
      this.consoleZoomWindowDrag = null
      this.clearZoomWindowOverlay()
      this.cameraController.endTemporaryPanDrag()
      this.cameraController.endTemporaryOrbitDrag()
    }
  }

  public setGizmoEnabled(enabled: boolean): void {
    this.gizmoEnabled = enabled
    this.syncGizmoEnabledState()
    this.refreshGizmoAttachment()
  }

  public setGizmoMode(mode: TransformControlsMode): void {
    this.gizmoMode = mode
    this.transformGizmo.setMode(mode)
  }

  public completeReferenceTransformDrag(): void {
    this.transformGizmo.completeActiveDrag()
  }

  public commitReferenceTransformSession(): void {
    if (
      this.activeReferenceTransformReferenceId === null &&
      this.activeContentObjectTransformObjectId === null
    ) {
      return
    }
    if (this.transformGizmo.isDragging()) {
      this.transformGizmo.completeActiveDrag()
      return
    }
    if (this.activeContentObjectTransformObjectId !== null) {
      this.requestContentObjectTransformCommit()
      return
    }
    this.requestReferenceTransformCommit()
  }

  public cancelReferenceTransformDrag(): void {
    this.transformGizmo.cancelActiveDrag()
  }

  public clearReferenceTransformHandle(): void {
    this.transformGizmo.clearActiveHandle()
  }

  public activateTranslateCenterHandle(): void {
    this.gizmoMode = 'translate'
    const startedDrag = this.transformGizmo.beginTranslateCenterHandleDragFromGizmoCenter()
    if (!startedDrag) {
      this.transformGizmo.activateHandle('translate', 'XYZ')
    }
  }

  public activateTranslateHandle(axis: 'X' | 'Y' | 'Z' | 'XYZ'): void {
    this.gizmoMode = 'translate'
    const startedDrag = this.transformGizmo.beginHandleDrag('translate', axis)
    if (!startedDrag) {
      this.transformGizmo.activateHandle('translate', axis)
    }
  }

  public activateRotateHandle(axis: 'X' | 'Y' | 'Z'): void {
    this.gizmoMode = 'rotate'
    const startedDrag = this.transformGizmo.beginHandleDrag('rotate', axis)
    if (!startedDrag) {
      this.transformGizmo.activateHandle('rotate', axis)
    }
  }

  public activateScaleHandle(axis: 'X' | 'Y' | 'Z'): void {
    this.gizmoMode = 'scale'
    const startedDrag = this.transformGizmo.beginHandleDrag('scale', axis)
    if (!startedDrag) {
      this.transformGizmo.activateHandle('scale', axis)
    }
  }

  public activateRotateCenterHandle(): void {
    this.gizmoMode = 'rotate'
    const startedDrag = this.transformGizmo.beginHandleDrag('rotate', 'E')
    if (!startedDrag) {
      this.transformGizmo.activateHandle('rotate', 'E')
    }
  }

  public activateScaleCenterHandle(): void {
    this.gizmoMode = 'scale'
    const startedDrag = this.transformGizmo.beginHandleDrag('scale', 'XYZ')
    if (!startedDrag) {
      this.transformGizmo.activateHandle('scale', 'XYZ')
    }
  }

  public setGizmoSpace(space: GizmoSpace): void {
    this.gizmoSpace = space
    this.transformGizmo.setSpace(space)
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  public setGizmoSnap(opts: {
    translate?: { x: number; y: number; z: number }
    rotate?: { x: number; y: number; z: number }
    scale?: { x: number; y: number; z: number }
  }): void {
    this.gizmoSnap = {
      translate: opts.translate,
      rotate: opts.rotate,
      scale: opts.scale,
    }
    this.transformGizmo.setSnap(opts)
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  public setReferenceTransformMoveSnapDotScale(scale: number): void {
    this.referenceTransformMoveSnapHelper.setDotScaleMultiplier(scale)
  }

  public setReferenceTransformMoveSnapDotsEnabled(enabled: boolean): void {
    this.referenceTransformMoveSnapHelper.setEnabled(enabled)
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
  }

  public setReferenceTransformPreviewLastMoveSnapDotsEnabled(enabled: boolean): void {
    this.previewLastMoveSnapDotsEnabled = enabled
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
  }

  public setReferenceTransformMoveSnapDotDelayMs(delayMs: number): void {
    this.referenceTransformMoveSnapHelper.setDotDelayMs(delayMs)
  }

  public setReferenceTransformMoveSnapDotNearScale(scale: number): void {
    this.referenceTransformMoveSnapHelper.setDotNearScale(scale)
  }

  public setReferenceTransformMoveSnapDotFarScale(scale: number): void {
    this.referenceTransformMoveSnapHelper.setDotFarScale(scale)
  }

  public setReferenceTransformMoveSnapDotVisibleRadiusMultiplier(multiplier: number): void {
    this.referenceTransformMoveSnapHelper.setDotVisibleRadiusMultiplier(multiplier)
  }

  public setReferenceTransformRotateSnapPreviewEnabled(enabled: boolean): void {
    this.referenceTransformRotateSnapHelper.setEnabled(enabled)
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  public setReferenceTransformRotateSnapPreviewLineSize(size: number): void {
    this.referenceTransformRotateSnapHelper.setLineSize(size)
  }

  public setReferenceTransformRotateSnapPreviewLineThickness(thickness: number): void {
    this.referenceTransformRotateSnapHelper.setLineThickness(thickness)
  }

  public setReferenceTransformRotateSnapPreviewRadiusDeg(radiusDeg: number): void {
    this.referenceTransformRotateSnapHelper.setPreviewRadiusDeg(radiusDeg)
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  public setReferenceTransformRotateSnapPreviewDelayMs(delayMs: number): void {
    this.referenceTransformRotateSnapHelper.setDelayMs(delayMs)
  }

  public setSelectedPart(partId: string | null): void {
    this.selectedPartKey = partId
    this.refreshSelectionStyling()
    this.refreshGizmoAttachment()
  }

  public setHighlightedPartKeys(partIds: string[]): void {
    this.highlightedPartKeys = new Set(partIds)
    this.refreshSelectionStyling()
  }

  public setHighlightedReferenceIds(referenceIds: string[]): void {
    this.highlightedReferenceIds = new Set(referenceIds)
    this.refreshReferenceHighlightStyling()
  }

  public setAxisOverlayEnabled(enabled: boolean): void {
    this.axisOverlayEnabled = enabled
    this.syncAxisOverlay()
  }

  public setAxisOverlayCanvas(canvas: HTMLCanvasElement | null): void {
    if (this.axisOverlayCanvas === canvas) {
      return
    }

    this.axisOverlayCanvas = canvas
    this.axisGizmo?.dispose()
    this.axisGizmo = null
    this.syncAxisOverlay()
  }

  public beginAxisOverlayPointerInteraction(pointerId: number, clientX: number, clientY: number): void {
    this.axisGizmo?.beginPointerInteraction(pointerId, clientX, clientY)
  }

  public updateAxisOverlayPointerInteraction(pointerId: number, clientX: number, clientY: number): void {
    this.axisGizmo?.updatePointerInteraction(pointerId, clientX, clientY)
  }

  public endAxisOverlayPointerInteraction(pointerId: number): void {
    this.axisGizmo?.endPointerInteraction(pointerId)
  }

  public cancelAxisOverlayPointerInteraction(pointerId: number): void {
    this.axisGizmo?.cancelPointerInteraction(pointerId)
  }

  public updateAxisOverlayPointerHover(clientX: number, clientY: number): void {
    this.axisGizmo?.updatePointerHover(clientX, clientY)
  }

  public clearAxisOverlayPointerHover(): void {
    this.axisGizmo?.clearPointerHover()
  }

  public setGeometrySketchOverlay(overlay: GeometrySketchOverlayVm | null): void {
    const previousOverlayMode = this.geometrySketchOverlay?.mode ?? null
    this.geometrySketchOverlay = overlay
    this.syncCameraInteractionState()
    if (overlay === null || overlay.mode !== 'draw' || overlay.activeTool !== null) {
      this.geometrySketchSelectionDrag = null
      this.onGeometrySketchSelectionWindowDraftChange?.(null)
      this.onGeometrySketchHoverComponent?.(null)
    }
    this.clearGeometrySketchOverlayGroup(this.geometrySketchOverlayGroup)
    this.geometrySketchDrawHelper.setOverlay(overlay)
    this.gridGroup.visible =
      overlay?.mode === 'draw' ? false : this.currentViewSettings.gridVisible
    if (
      previousOverlayMode === 'draw' &&
      overlay?.mode !== 'draw' &&
      this.geometrySketchRestoreCameraPose !== null
    ) {
      this.cameraController.animateToPose(this.geometrySketchRestoreCameraPose, {
        durationMs: 320,
      })
      this.geometrySketchRestoreCameraPose = null
    }
    if (overlay === null) {
      this.geometrySketchCameraAlignKey = null
      return
    }

    this.renderGeometrySketchOverlayPolylines(this.geometrySketchOverlayGroup, overlay)

    if (overlay.mode === 'draw') {
      const nextAlignKey = JSON.stringify({
        plane: overlay.plane,
        planeTransform: overlay.planeTransform,
      })
      if (this.geometrySketchCameraAlignKey !== nextAlignKey) {
        if (this.geometrySketchCameraAlignKey === null) {
          this.geometrySketchRestoreCameraPose = this.cameraController.getPose()
        }
        this.alignCameraToGeometrySketchPlaneInternal(overlay)
        this.geometrySketchCameraAlignKey = nextAlignKey
      }
    } else {
      this.geometrySketchCameraAlignKey = null
    }
  }

  public setVisibleGeometrySketchOverlays(overlays: VisibleGeometrySketchOverlayVm[]): void {
    this.clearGeometrySketchOverlayGroup(this.visibleGeometrySketchOverlayGroup)
    for (const overlay of overlays) {
      this.renderGeometrySketchOverlayPolylines(this.visibleGeometrySketchOverlayGroup, {
        mode: 'review',
        plane: overlay.plane,
        planeTransform: overlay.planeTransform,
        drawStage: null,
        activeTool: null,
        components: overlay.components,
        profiles: overlay.profiles,
        drawDraft: null,
        ui: {
          snapEnabled: false,
          snapDistancePx: 0,
          crosshairSize: 0,
          startPointVisible: false,
          startPointSymbolSize: 0,
          startPointSymbolType: 'circle',
          plinePointVisible: false,
          plinePointSymbolSize: 0,
          plinePointSymbolType: 'circle',
        },
      })
    }
  }

  private syncCameraInteractionState(): void {
    if (!this.currentViewSettings.orbitEnabled) {
      this.clearCameraGestureDrafts()
    }
    this.cameraController.setEnabled(this.currentViewSettings.orbitEnabled)
    this.cameraController.setLeftButtonOrbitEnabled(false)
  }

  private areCameraPosesEquivalent(left: CameraPose, right: CameraPose): boolean {
    return (
      left.position.distanceToSquared(right.position) <= 1e-8 &&
      left.target.distanceToSquared(right.target) <= 1e-8 &&
      left.up.distanceToSquared(right.up) <= 1e-8
    )
  }

  private isPerspectiveFlyAvailable(): boolean {
    return this.cameraController.getActiveCamera() === this.perspectiveCamera
  }

  private resolveFlyMovementKey(key: string): FlyMovementKey | null {
    const normalizedKey = key.toLowerCase()
    if (normalizedKey === 'w') {
      return 'forward'
    }
    if (normalizedKey === 's') {
      return 'backward'
    }
    if (normalizedKey === 'a') {
      return 'left'
    }
    if (normalizedKey === 'd') {
      return 'right'
    }
    if (key === ' ' || normalizedKey === 'spacebar') {
      return 'up'
    }
    if (normalizedKey === 'control') {
      return 'down'
    }
    if (normalizedKey === 'shift') {
      return 'boost'
    }
    if (normalizedKey === 'q') {
      return 'roll-left'
    }
    if (normalizedKey === 'e') {
      return 'roll-right'
    }
    return null
  }

  private canStartFlySession(event: PointerEvent): boolean {
    return (
      this.currentViewSettings.orbitEnabled &&
      this.isPerspectiveFlyAvailable() &&
      this.flySession === null &&
      this.sketchPlanePickOverlay === null &&
      this.geometrySketchOverlay === null &&
      this.geometrySketchSelectionDrag === null &&
      this.consoleCameraMode === null &&
      this.consoleCameraModeDrag === null &&
      this.consoleZoomWindowDrag === null &&
      this.workspaceSelectionClickTracker === null &&
      this.cameraOrbitModifierDrag === null &&
      this.middleClickTracker === null &&
      this.activeReferenceTransformReferenceId === null &&
      this.activeContentObjectTransformObjectId === null &&
      !this.transformGizmo.isDragging() &&
      !this.isWorkspaceSelectionViewportGizmoHit(event.clientX, event.clientY)
    )
  }

  private startFlySession(event: PointerEvent): void {
    this.rememberCameraPose()
    this.cameraController.beginFlyMode()
    this.flySession = {
      pointerId: event.pointerId,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
      heldKeys: new Set<FlyMovementKey>(),
      pointerLockActive: this.isFlyPointerLockActive(),
    }
    this.suppressFlyContextMenu = false
    this.renderer.domElement.setPointerCapture(event.pointerId)
    this.requestFlyPointerLock()
    event.preventDefault()
    event.stopPropagation()
  }

  private endFlySession(options?: { pointerId?: number; suppressContextMenu?: boolean }): void {
    if (this.flySession === null) {
      return
    }
    const pointerId = options?.pointerId ?? this.flySession.pointerId
    if (this.renderer.domElement.hasPointerCapture(pointerId)) {
      this.renderer.domElement.releasePointerCapture(pointerId)
    }
    this.exitFlyPointerLock()
    this.cameraController.endFlyMode({ restoreUpright: true })
    this.flySession.heldKeys.clear()
    this.flySession = null
    if (options?.suppressContextMenu === true) {
      this.suppressFlyContextMenu = true
    }
  }

  private updateFlySessionPointer(event: PointerEvent): void {
    if (this.flySession === null || event.pointerId !== this.flySession.pointerId) {
      return
    }
    const pointerLockActive = this.isFlyPointerLockActive()
    if (this.flySession.pointerLockActive && !pointerLockActive) {
      this.flySession.pointerLockActive = false
      this.flySession.lastClientX = event.clientX
      this.flySession.lastClientY = event.clientY
      event.preventDefault()
      event.stopPropagation()
      return
    }
    this.flySession.pointerLockActive = pointerLockActive

    const deltaX = pointerLockActive
      ? typeof event.movementX === 'number'
        ? event.movementX
        : 0
      : event.clientX - this.flySession.lastClientX
    const deltaY = pointerLockActive
      ? typeof event.movementY === 'number'
        ? event.movementY
        : 0
      : event.clientY - this.flySession.lastClientY
    this.flySession.lastClientX = event.clientX
    this.flySession.lastClientY = event.clientY
    event.preventDefault()
    event.stopPropagation()
    this.cameraController.applyFlyLookDelta(deltaX, deltaY)
  }

  private handleFlyKeyDown(event: KeyboardEvent): void {
    if (this.flySession === null) {
      return
    }
    const flyMovementKey = this.resolveFlyMovementKey(event.key)
    if (flyMovementKey !== null) {
      this.flySession.heldKeys.add(flyMovementKey)
    }
  }

  private updateFlyMovement(dt: number): void {
    if (this.flySession === null) {
      return
    }
    if (!this.isPerspectiveFlyAvailable()) {
      this.endFlySession()
      return
    }

    const forward =
      (this.flySession.heldKeys.has('forward') ? 1 : 0) -
      (this.flySession.heldKeys.has('backward') ? 1 : 0)
    const right =
      (this.flySession.heldKeys.has('right') ? 1 : 0) -
      (this.flySession.heldKeys.has('left') ? 1 : 0)
    const up =
      (this.flySession.heldKeys.has('up') ? 1 : 0) -
      (this.flySession.heldKeys.has('down') ? 1 : 0)

    const movementVector = new Vector3(right, up, forward)
    if (movementVector.lengthSq() < 1e-8) {
      return
    }

    const moveSpeed =
      this.flyMoveSpeedUnitsPerSec * (this.flySession.heldKeys.has('boost') ? FLY_CAMERA_BOOST_MULTIPLIER : 1)
    movementVector.normalize().multiplyScalar(moveSpeed * dt)
    this.cameraController.translateFly(movementVector.z, movementVector.x, movementVector.y)
  }

  private updateFlyRoll(dt: number): void {
    if (this.flySession === null) {
      return
    }
    if (!this.isPerspectiveFlyAvailable()) {
      this.endFlySession()
      return
    }

    const rollDirection =
      (this.flySession.heldKeys.has('roll-right') ? 1 : 0) -
      (this.flySession.heldKeys.has('roll-left') ? 1 : 0)
    if (rollDirection === 0) {
      return
    }

    this.cameraController.applyFlyRollDelta(rollDirection * FLY_CAMERA_ROLL_RADIANS_PER_SEC * dt)
  }

  private rememberCameraPose(): void {
    const nextPose = this.cameraController.getPose()
    const lastPose = this.cameraPoseHistory[this.cameraPoseHistory.length - 1] ?? null
    if (lastPose !== null && this.areCameraPosesEquivalent(lastPose, nextPose)) {
      return
    }
    this.cameraPoseHistory.push(nextPose)
    if (this.cameraPoseHistory.length > 24) {
      this.cameraPoseHistory.splice(0, this.cameraPoseHistory.length - 24)
    }
  }

  private getCanvasLocalClientPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.renderer.domElement.getBoundingClientRect()
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  private updateZoomWindowOverlay(
    anchorClientX: number,
    anchorClientY: number,
    currentClientX: number,
    currentClientY: number,
  ): void {
    const anchor = this.getCanvasLocalClientPoint(anchorClientX, anchorClientY)
    const current = this.getCanvasLocalClientPoint(currentClientX, currentClientY)
    const left = Math.min(anchor.x, current.x)
    const top = Math.min(anchor.y, current.y)
    const width = Math.abs(current.x - anchor.x)
    const height = Math.abs(current.y - anchor.y)
    this.zoomWindowOverlayBox.style.display = 'block'
    this.zoomWindowOverlayBox.style.left = `${left}px`
    this.zoomWindowOverlayBox.style.top = `${top}px`
    this.zoomWindowOverlayBox.style.width = `${width}px`
    this.zoomWindowOverlayBox.style.height = `${height}px`
  }

  private clearZoomWindowOverlay(): void {
    this.zoomWindowOverlayBox.style.display = 'none'
    this.zoomWindowOverlayBox.style.left = '0'
    this.zoomWindowOverlayBox.style.top = '0'
    this.zoomWindowOverlayBox.style.width = '0'
    this.zoomWindowOverlayBox.style.height = '0'
  }

  private updateWorkspaceSelectionOverlay(
    anchorClientX: number,
    anchorClientY: number,
    currentClientX: number,
    currentClientY: number,
    mode: WorkspaceSelectionWindowMode,
  ): void {
    const anchor = this.getCanvasLocalClientPoint(anchorClientX, anchorClientY)
    const current = this.getCanvasLocalClientPoint(currentClientX, currentClientY)
    const left = Math.min(anchor.x, current.x)
    const top = Math.min(anchor.y, current.y)
    const width = Math.abs(current.x - anchor.x)
    const height = Math.abs(current.y - anchor.y)
    this.workspaceSelectionOverlayBox.style.display = 'block'
    this.workspaceSelectionOverlayBox.style.left = `${left}px`
    this.workspaceSelectionOverlayBox.style.top = `${top}px`
    this.workspaceSelectionOverlayBox.style.width = `${width}px`
    this.workspaceSelectionOverlayBox.style.height = `${height}px`
    this.workspaceSelectionOverlayBox.style.borderStyle = mode === 'window' ? 'solid' : 'dashed'
    this.workspaceSelectionOverlayBox.style.borderColor =
      mode === 'window' ? 'rgba(122, 196, 255, 0.95)' : 'rgba(123, 224, 150, 0.95)'
    this.workspaceSelectionOverlayBox.style.background =
      mode === 'window' ? 'rgba(122, 196, 255, 0.12)' : 'rgba(123, 224, 150, 0.12)'
  }

  private clearWorkspaceSelectionOverlay(): void {
    this.workspaceSelectionOverlayBox.style.display = 'none'
    this.workspaceSelectionOverlayBox.style.left = '0'
    this.workspaceSelectionOverlayBox.style.top = '0'
    this.workspaceSelectionOverlayBox.style.width = '0'
    this.workspaceSelectionOverlayBox.style.height = '0'
  }

  private clearCameraGestureDrafts(): void {
    this.endFlySession()
    if (
      this.cameraOrbitModifierDrag !== null &&
      this.renderer.domElement.hasPointerCapture(this.cameraOrbitModifierDrag.pointerId)
    ) {
      this.renderer.domElement.releasePointerCapture(this.cameraOrbitModifierDrag.pointerId)
    }
    this.cameraOrbitModifierDrag = null
    if (
      this.consoleCameraModeDrag !== null &&
      this.renderer.domElement.hasPointerCapture(this.consoleCameraModeDrag.pointerId)
    ) {
      this.renderer.domElement.releasePointerCapture(this.consoleCameraModeDrag.pointerId)
    }
    this.consoleCameraModeDrag = null
    if (
      this.consoleZoomWindowDrag !== null &&
      this.renderer.domElement.hasPointerCapture(this.consoleZoomWindowDrag.pointerId)
    ) {
      this.renderer.domElement.releasePointerCapture(this.consoleZoomWindowDrag.pointerId)
    }
    this.consoleZoomWindowDrag = null
    this.clearZoomWindowOverlay()
    if (
      this.workspaceSelectionClickTracker !== null &&
      this.renderer.domElement.hasPointerCapture(this.workspaceSelectionClickTracker.pointerId)
    ) {
      this.renderer.domElement.releasePointerCapture(this.workspaceSelectionClickTracker.pointerId)
    }
    this.workspaceSelectionClickTracker = null
    this.clearWorkspaceSelectionOverlay()
    this.middleClickTracker = null
    this.lastMiddleClick = null
    this.cameraController.endTemporaryPanDrag()
    this.cameraController.endTemporaryOrbitDrag()
  }

  public setOnGeometrySketchHoverPoint(
    handler: ((point: { x: number; y: number } | null, snapTarget: GeometrySketchSnapTarget | null) => void) | null,
  ): void {
    this.onGeometrySketchHoverPoint = handler
  }

  public setOnGeometrySketchConfirmPoint(
    handler: ((point: { x: number; y: number }, snapTarget: GeometrySketchSnapTarget | null) => void) | null,
  ): void {
    this.onGeometrySketchConfirmPoint = handler
  }

  public setOnGeometrySketchHoverComponent(
    handler: ((rowId: string | null) => void) | null,
  ): void {
    this.onGeometrySketchHoverComponent = handler
  }

  public setOnGeometrySketchSelectComponents(
    handler: ((rowIds: string[]) => void) | null,
  ): void {
    this.onGeometrySketchSelectComponents = handler
  }

  public setOnGeometrySketchSelectionWindowDraftChange(
    handler: ((draft: GeometrySketchSelectionWindowDraft | null) => void) | null,
  ): void {
    this.onGeometrySketchSelectionWindowDraftChange = handler
  }

  public setOnGeometrySketchDeleteSelection(handler: (() => void) | null): void {
    this.onGeometrySketchDeleteSelection = handler
  }

  public setOnGeometrySketchFinishDraft(handler: (() => void) | null): void {
    this.onGeometrySketchFinishDraft = handler
  }

  public setOnGeometrySketchCancelDraft(handler: (() => void) | null): void {
    this.onGeometrySketchCancelDraft = handler
  }

  public setSketchPlanePickOverlay(overlay: SketchPlanePickOverlayVm | null): void {
    this.sketchPlanePickOverlay = overlay
    if (overlay !== null) {
      this.gizmoMode = overlay.gizmoMode
      this.transformGizmo.setMode(overlay.gizmoMode)
      this.transformGizmo.setSpace('world')
      this.transformGizmo.setSize(overlay.ui.gizmoScale)
      this.transformGizmo.setSnap({
        translate:
          overlay.snap.translateMm === null
            ? undefined
            : {
                x: overlay.snap.translateMm,
                y: overlay.snap.translateMm,
                z: overlay.snap.translateMm,
              },
        rotate:
          overlay.snap.rotateDeg === null
            ? undefined
            : {
                x: overlay.snap.rotateDeg,
                y: overlay.snap.rotateDeg,
                z: overlay.snap.rotateDeg,
              },
      })
    } else {
      this.transformGizmo.setSize(1)
      this.transformGizmo.setSnap({})
    }
    this.sketchPlanePickHelper.setOverlay(overlay)
    this.syncGizmoEnabledState()
    this.refreshGizmoAttachment()
  }

  public setOnSketchPlanePickPlaneSelect(
    handler: ((plane: SketchPlane) => void) | null,
  ): void {
    this.onSketchPlanePickPlaneSelect = handler
  }

  public setOnSketchPlanePickTransformChange(
    handler: ((transform: SketchPlaneTransform) => void) | null,
  ): void {
    this.onSketchPlanePickTransformChange = handler
  }

  public setOnSketchPlanePickTransformCommit(handler: (() => void) | null): void {
    this.onSketchPlanePickTransformCommit = handler
  }

  public setOnWorkspaceSelectionPick(
    handler: ((event: WorkspaceSelectionPickEvent) => void) | null,
  ): void {
    this.onWorkspaceSelectionPick = handler
  }

  public dispose(): void {
    if (this.frameId !== null) {
      window.cancelAnimationFrame(this.frameId)
      this.frameId = null
    }

    this.resizeObserver.disconnect()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('blur', this.handleWindowBlur)
    this.renderer.domElement.removeEventListener(
      'pointerdown',
      this.handleSketchPlanePickPointerDown,
      true,
    )
    this.renderer.domElement.removeEventListener(
      'pointermove',
      this.handleSketchPlanePickPointerMove,
      true,
    )
    this.renderer.domElement.removeEventListener(
      'pointerup',
      this.handleSketchPlanePickPointerUp,
      true,
    )
    this.renderer.domElement.removeEventListener(
      'pointercancel',
      this.handleViewerPointerCancel,
      true,
    )
    this.renderer.domElement.removeEventListener('wheel', this.handleViewerWheel, true)
    this.renderer.domElement.removeEventListener('contextmenu', this.handleViewerContextMenu)
    this.endFlySession()

    this.clearPartMeshes()
    this.clearReferenceObjects()
    this.clearAllLights()
    this.clearGeometrySketchOverlayGroup(this.geometrySketchOverlayGroup)
    this.clearGeometrySketchOverlayGroup(this.visibleGeometrySketchOverlayGroup)

    for (const material of this.materialCacheByPresetId.values()) {
      material.dispose()
    }
    this.materialCacheByPresetId.clear()
    this.assignedPresetByPartKey.clear()

    this.transformGizmo.dispose()
    this.axisGizmo?.dispose()
    this.axisGizmo = null
    this.sketchPlanePickHelper.dispose()
    this.referenceTransformHistoryHelper.dispose()
    this.referenceTransformMoveSnapHelper.dispose()
    this.referenceTransformRotateSnapHelper.dispose()
    this.geometrySketchDrawHelper.dispose()
    this.geometrySketchComponentMaterial.dispose()
    this.geometrySketchHoveredComponentMaterial.dispose()
    this.geometrySketchSelectedComponentMaterial.dispose()
    this.geometrySketchProfileMaterial.dispose()
    this.geometrySketchSelectedProfileMaterial.dispose()
    this.geometrySketchSelectionWindowMaterial.dispose()
    this.geometrySketchSelectionCrossingMaterial.dispose()
    this.onRuntimeStatsChange = null

    this.renderer.dispose()
    this.zoomWindowOverlayRoot.remove()
    this.workspaceSelectionOverlayRoot.remove()
    this.container.removeChild(this.renderer.domElement)
  }

  private applyLights(lightSpecs: LightSpec[]): void {
    const nextIds = new Set(lightSpecs.map((light) => light.id))

    for (const [id] of this.lightsById.entries()) {
      if (!nextIds.has(id)) {
        this.removeLight(id)
      }
    }

    for (const spec of lightSpecs) {
      let light = this.lightsById.get(spec.id)
      let targetObject = this.lightTargetsById.get(spec.id) ?? null

      if (light !== undefined) {
        const currentType = toLightType(light)
        if (currentType !== spec.type) {
          this.removeLight(spec.id)
          light = undefined
          targetObject = null
        }
      }

      if (light === undefined) {
        const created = this.createThreeLightFromSpec(spec)
        light = created.light
        targetObject = created.targetObject
        this.lightsById.set(spec.id, light)
        this.scene.add(light)
        if (targetObject !== null) {
          this.lightTargetsById.set(spec.id, targetObject)
          this.scene.add(targetObject)
        }
      }

      this.applySpecToLight(light, targetObject, spec)
    }
  }

  private createThreeLightFromSpec(spec: LightSpec): {
    light: Light
    targetObject: Object3D | null
  } {
    if (spec.type === 'directional') {
      return {
        light: new DirectionalLight(0xffffff, 1),
        targetObject: new Object3D(),
      }
    }

    if (spec.type === 'point') {
      return {
        light: new PointLight(0xffffff, 1),
        targetObject: null,
      }
    }

    if (spec.type === 'spot') {
      return {
        light: new SpotLight(0xffffff, 1),
        targetObject: new Object3D(),
      }
    }

    if (spec.type === 'hemisphere') {
      return {
        light: new HemisphereLight(0xffffff, 0x232733, 1),
        targetObject: null,
      }
    }

    return {
      light: new AmbientLight(0xffffff, 1),
      targetObject: null,
    }
  }

  private applySpecToLight(light: Light, targetObject: Object3D | null, spec: LightSpec): void {
    light.name = spec.name
    light.visible = spec.enabled
    light.intensity = Math.max(spec.intensity, 0)

    if (light instanceof HemisphereLight) {
      light.color.set(spec.color)
      light.groundColor.set('#232733')
    } else {
      light.color.set(spec.color)
    }

    if (supportsPosition(spec.type)) {
      const position = spec.position ?? { x: 0, y: 5, z: 0 }
      light.position.set(position.x, position.y, position.z)
    }

    if (supportsTarget(spec.type) && targetObject !== null) {
      const target = spec.target ?? { x: 0, y: 0, z: 0 }
      targetObject.position.set(target.x, target.y, target.z)
      if (light instanceof DirectionalLight || light instanceof SpotLight) {
        light.target = targetObject
      }
    }

    if (light instanceof PointLight || light instanceof SpotLight) {
      light.distance = Math.max(spec.distance ?? 0, 0)
      light.decay = Math.max(spec.decay ?? 2, 0)
    }

    if (light instanceof SpotLight) {
      const angleDeg = clamp(spec.angleDeg ?? 35, 0, 89)
      light.angle = MathUtils.degToRad(angleDeg)
      light.penumbra = clamp(spec.penumbra ?? 0.2, 0, 1)
    }

    if (
      light instanceof DirectionalLight ||
      light instanceof SpotLight ||
      light instanceof PointLight
    ) {
      const castShadow = this.currentViewSettings.shadowsEnabled && (spec.castShadow ?? false)
      light.castShadow = castShadow

      if (spec.shadowBias !== undefined) {
        light.shadow.bias = spec.shadowBias
      }

      if (spec.shadowMapSize !== undefined) {
        const size = Math.max(256, spec.shadowMapSize)
        light.shadow.mapSize.set(size, size)
      }

      if (light.shadow.map !== null) {
        light.shadow.map.dispose()
        light.shadow.map = null
      }
    }
  }

  private applyMaterialSettings(materials: ViewSettings['materials']): void {
    const presets = materials.presets.length > 0 ? materials.presets : [fallbackPreset()]
    const nextPresetIds = new Set(presets.map((preset) => preset.id))

    for (const preset of presets) {
      const cached = this.materialCacheByPresetId.get(preset.id)
      if (cached !== undefined) {
        this.applyPresetToMaterial(cached, preset)
        continue
      }

      const material = new MeshStandardMaterial()
      this.applyPresetToMaterial(material, preset)
      this.materialCacheByPresetId.set(preset.id, material)
    }

    for (const [presetId, material] of this.materialCacheByPresetId.entries()) {
      if (nextPresetIds.has(presetId)) {
        continue
      }
      material.dispose()
      this.materialCacheByPresetId.delete(presetId)
    }

    this.assignedPresetByPartKey.clear()
    for (const [partId, presetId] of Object.entries(materials.perPart)) {
      if (this.materialCacheByPresetId.has(presetId)) {
        this.assignedPresetByPartKey.set(partId, presetId)
      }
    }

    this.applyMaterialAssignmentsToScene()
  }

  private applyPresetToMaterial(material: MeshStandardMaterial, preset: MaterialPreset): void {
    material.color.set(preset.color)
    material.metalness = clamp(preset.metalness, 0, 1)
    material.roughness = clamp(preset.roughness, 0, 1)
    material.emissive.set(preset.emissive)
    material.emissiveIntensity = clamp(preset.emissiveIntensity, 0, 2)
    material.opacity = clamp(preset.opacity, 0, 1)
    material.transparent = preset.transparent || material.opacity < 1
    // Runtime CAD previews should remain legible from either side of the authored sketch plane.
    material.side = DoubleSide
    material.wireframe = this.currentViewSettings.wireframe
    material.needsUpdate = true
  }

  private createLayerMaterial(
    baseMaterial: MeshStandardMaterial,
    style:
      | {
          opacity: number
          color: string
        }
      | undefined,
    fallbackOpacity = 1,
    overlay = false,
  ): MeshStandardMaterial {
    if (style === undefined) {
      if (!overlay && fallbackOpacity === 1) {
        return baseMaterial
      }
      const fallbackMaterial = baseMaterial.clone()
      fallbackMaterial.opacity = clamp(baseMaterial.opacity * fallbackOpacity, 0, 1)
      fallbackMaterial.transparent = fallbackMaterial.opacity < 1 || overlay
      fallbackMaterial.depthWrite = !overlay && fallbackMaterial.opacity >= 1
      fallbackMaterial.needsUpdate = true
      return fallbackMaterial
    }

    const material = baseMaterial.clone()
    material.color.set(style.color)
    material.opacity = clamp(style.opacity, 0, 1)
    material.transparent = material.opacity < 1 || overlay
    material.depthWrite = !overlay && material.opacity >= 1
    material.needsUpdate = true
    return material
  }

  private applyMaterialAssignmentsToScene(): void {
    for (const [partKeyStr, mesh] of this.partMeshes.entries()) {
      mesh.material = this.resolveMaterialForPart(partKeyStr)
    }
  }

  private resolveMaterialForPart(partKey: string): MeshStandardMaterial {
    const materials = this.currentViewSettings.materials

    if (materials.usePerPart) {
      const mapped = this.assignedPresetByPartKey.get(partKey)
      if (mapped !== undefined) {
        const mappedMaterial = this.materialCacheByPresetId.get(mapped)
        if (mappedMaterial !== undefined) {
          return mappedMaterial
        }
      }
    }

    const selected = this.materialCacheByPresetId.get(materials.selectedPresetId)
    if (selected !== undefined) {
      return selected
    }

    const first = this.materialCacheByPresetId.values().next().value as
      | MeshStandardMaterial
      | undefined
    if (first !== undefined) {
      return first
    }

    const material = new MeshStandardMaterial({ color: '#5f83d6' })
    material.wireframe = this.currentViewSettings.wireframe
    this.materialCacheByPresetId.set('fallback_runtime', material)
    return material
  }

  private applyShadowFlags(): void {
    for (const mesh of this.partMeshes.values()) {
      mesh.castShadow = this.currentViewSettings.shadowsEnabled
      mesh.receiveShadow = this.currentViewSettings.shadowsEnabled
    }

    for (const mesh of this.baselinePartMeshes.values()) {
      mesh.castShadow = false
      mesh.receiveShadow = false
    }

    for (const mesh of this.overlayPartMeshes.values()) {
      mesh.castShadow = false
      mesh.receiveShadow = false
    }

    for (const referenceObject of this.referenceObjects.values()) {
      referenceObject.traverse((child) => {
        if (!(child instanceof Mesh)) {
          return
        }
        child.castShadow = this.currentViewSettings.shadowsEnabled
        child.receiveShadow = this.currentViewSettings.shadowsEnabled
      })
    }
  }

  private removeLight(id: string): void {
    const light = this.lightsById.get(id)
    if (light !== undefined) {
      this.scene.remove(light)
      if ((light instanceof DirectionalLight || light instanceof SpotLight || light instanceof PointLight) && light.shadow.map !== null) {
        light.shadow.map.dispose()
        light.shadow.map = null
      }
      this.lightsById.delete(id)
    }

    const target = this.lightTargetsById.get(id)
    if (target !== undefined) {
      this.scene.remove(target)
      this.lightTargetsById.delete(id)
    }
  }

  private clearAllLights(): void {
    for (const id of [...this.lightsById.keys()]) {
      this.removeLight(id)
    }
  }

  private clearPartMeshes(): void {
    for (const mesh of [
      ...this.partMeshes.values(),
      ...this.baselinePartMeshes.values(),
      ...this.overlayPartMeshes.values(),
    ]) {
      if (mesh.parent !== null) {
        mesh.parent.remove(mesh)
      }
      mesh.traverse((child) => {
        if (child instanceof LineSegments) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose())
            return
          }
          child.material.dispose()
        }
      })
      if (mesh.userData.disposeMaterial === true) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose())
        } else {
          mesh.material.dispose()
        }
      }
      mesh.geometry.dispose()
    }
    this.partMeshes.clear()
    this.baselinePartMeshes.clear()
    this.overlayPartMeshes.clear()
    this.partSelectionOutlines.clear()
    for (const pivot of this.contentObjectPivots.values()) {
      if (pivot.parent === this.rootGroup) {
        this.rootGroup.remove(pivot)
      }
    }
    this.contentObjectPivots.clear()
  }

  private clearReferenceObjects(): void {
    for (const object of this.referenceObjects.values()) {
      if (object.parent === this.referenceGroup) {
        this.referenceGroup.remove(object)
      }
      this.disposeObjectTree(object)
    }
    this.referenceObjects.clear()
    this.referencePartDescriptorsByReferenceId.clear()
    this.referenceSelectionOutlines.clear()
    this.referenceLoadPromises.clear()
    this.removedReferenceIds.clear()
  }

  private applyReferenceObjectDefaults(object: Object3D): void {
    object.visible = false
    const selectionOutlines: LineSegments[] = []
    object.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return
      }
      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) =>
          material instanceof MeshStandardMaterial
            ? material.clone()
            : new MeshStandardMaterial({ color: '#7f8fae' }),
        )
      } else if (child.material instanceof MeshStandardMaterial) {
        child.material = child.material.clone()
      } else {
        child.material = new MeshStandardMaterial({ color: '#7f8fae' })
      }
      child.castShadow = this.currentViewSettings.shadowsEnabled
      child.receiveShadow = this.currentViewSettings.shadowsEnabled
      const selectionOutline = new LineSegments(
        new EdgesGeometry(child.geometry),
        new LineBasicMaterial({
          color: new Color(ACTIVE_PART_SELECTION_OUTLINE),
          transparent: true,
          opacity: 0.96,
          toneMapped: false,
          depthTest: false,
          depthWrite: false,
        }),
      )
      selectionOutline.name = `${object.name}:selection-outline`
      selectionOutline.visible = false
      selectionOutline.renderOrder = 120
      selectionOutline.frustumCulled = false
      selectionOutline.userData.referenceSelectionOverlay = true
      child.add(selectionOutline)
      selectionOutlines.push(selectionOutline)
    })
    const referenceId = object.userData.referenceId
    if (typeof referenceId === 'string' && referenceId.length > 0) {
      this.referenceSelectionOutlines.set(referenceId, selectionOutlines)
    }
  }

  private refreshReferenceHighlightStyling(): void {
    for (const [referenceId, object] of this.referenceObjects.entries()) {
      const isSelected = this.highlightedReferenceIds.has(referenceId) && object.visible
      const isHighlighted =
        referenceId === this.activeReferenceTransformReferenceId && object.visible
      const outlines = this.referenceSelectionOutlines.get(referenceId) ?? []
      for (const outline of outlines) {
        outline.visible = isSelected || isHighlighted
      }
    }
  }

  private createReferencePivot(reference: ReferenceLoadableItem, object: Object3D): Object3D {
    const transform = reference.displayTransform
    if (transform?.centerUnderPivot) {
      this.centerObjectUnderPivot(object)
    }

    const scale = transform?.scale
    if (scale !== undefined) {
      object.scale.setScalar(scale)
    }

    object.rotation.set(
      MathUtils.degToRad(transform?.rotationDeg?.x ?? 0),
      MathUtils.degToRad(transform?.rotationDeg?.y ?? 0),
      MathUtils.degToRad(transform?.rotationDeg?.z ?? 0),
    )

    const pivot = new Group()
    pivot.name = `${reference.referenceId}:pivot`
    pivot.position.set(
      transform?.offset?.x ?? 0,
      transform?.offset?.y ?? 0,
      transform?.offset?.z ?? 0,
    )
    pivot.userData.referenceId = reference.referenceId
    pivot.userData.referenceTransformBase = {
      position: {
        x: transform?.offset?.x ?? 0,
        y: transform?.offset?.y ?? 0,
        z: transform?.offset?.z ?? 0,
      },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    } satisfies ReferenceTransformBase
    this.applyReferenceTransformOverride(pivot, reference.transformOverride ?? null)
    pivot.add(object)
    return pivot
  }

  private applyReferenceTransformOverride(
    object: Object3D,
    transformOverride: ReferenceTransformOverride | null,
  ): void {
    const baseTransform = this.getReferenceTransformBase(object)
    object.position.set(
      baseTransform.position.x + (transformOverride?.position.x ?? 0),
      baseTransform.position.y + (transformOverride?.position.y ?? 0),
      baseTransform.position.z + (transformOverride?.position.z ?? 0),
    )
    object.rotation.set(
      MathUtils.degToRad(baseTransform.rotationDeg.x + (transformOverride?.rotationDeg.x ?? 0)),
      MathUtils.degToRad(baseTransform.rotationDeg.y + (transformOverride?.rotationDeg.y ?? 0)),
      MathUtils.degToRad(baseTransform.rotationDeg.z + (transformOverride?.rotationDeg.z ?? 0)),
    )
    object.scale.set(
      baseTransform.scale.x * (transformOverride?.scale.x ?? 1),
      baseTransform.scale.y * (transformOverride?.scale.y ?? 1),
      baseTransform.scale.z * (transformOverride?.scale.z ?? 1),
    )
  }

  private getReferenceTransformBase(object: Object3D): ReferenceTransformBase {
    const baseTransform = object.userData.referenceTransformBase as ReferenceTransformBase | undefined
    return (
      baseTransform ?? {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      }
    )
  }

  private readReferenceTransformOverride(object: Object3D): ReferenceTransformOverride {
    const baseTransform = this.getReferenceTransformBase(object)
    return {
      position: {
        x: object.position.x - baseTransform.position.x,
        y: object.position.y - baseTransform.position.y,
        z: object.position.z - baseTransform.position.z,
      },
      rotationDeg: {
        x: MathUtils.radToDeg(object.rotation.x) - baseTransform.rotationDeg.x,
        y: MathUtils.radToDeg(object.rotation.y) - baseTransform.rotationDeg.y,
        z: MathUtils.radToDeg(object.rotation.z) - baseTransform.rotationDeg.z,
      },
      scale: {
        x: object.scale.x / baseTransform.scale.x,
        y: object.scale.y / baseTransform.scale.y,
        z: object.scale.z / baseTransform.scale.z,
      },
    }
  }

  private centerObjectUnderPivot(object: Object3D): void {
    object.updateMatrixWorld(true)
    const bounds = new Box3().setFromObject(object)
    if (bounds.isEmpty()) {
      return
    }
    const center = bounds.getCenter(new Vector3())
    object.position.sub(center)
    object.position.y -= bounds.min.y - center.y
  }

  private anchorContentObjectPivotToBoundsCenter(pivot: Group): void {
    pivot.updateMatrixWorld(true)
    const bounds = new Box3().setFromObject(pivot)
    if (bounds.isEmpty()) {
      return
    }
    const center = bounds.getCenter(new Vector3())
    for (const child of pivot.children) {
      child.position.sub(center)
    }
    pivot.position.copy(center)
  }

  private async loadReferenceObject(reference: ReferenceLoadableItem): Promise<Object3D> {
    if (reference.fileType === 'glb') {
      const loader = new GLTFLoader()
      return new Promise<Object3D>((resolve, reject) => {
        loader.load(
          reference.assetPath,
          (result) => resolve(this.createReferencePivot(reference, result.scene)),
          undefined,
          reject,
        )
      })
    }

    if (reference.fileType === 'obj') {
      const loader = new OBJLoader()
      return new Promise<Object3D>((resolve, reject) => {
        loader.load(
          reference.assetPath,
          (object) => resolve(this.createReferencePivot(reference, object)),
          undefined,
          reject,
        )
      })
    }

    if (reference.fileType === 'stl') {
      const loader = new STLLoader()
      return new Promise<Object3D>((resolve, reject) => {
        loader.load(
          reference.assetPath,
          (geometry) => {
            const mesh = new Mesh(
              geometry,
              new MeshStandardMaterial({
                color: '#7f8fae',
                metalness: 0.08,
                roughness: 0.86,
              }),
            )
            resolve(this.createReferencePivot(reference, mesh))
          },
          undefined,
          reject,
        )
      })
    }

    const object = await loadStepReferenceObject(reference)
    return this.createReferencePivot(reference, object)
  }

  private disposeObjectTree(object: Object3D): void {
    object.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return
      }
      child.geometry.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose())
        return
      }
      child.material.dispose()
    })
  }

  private refreshSelectionStyling(): void {
    for (const [partKeyStr, outline] of this.partSelectionOutlines.entries()) {
      outline.visible =
        partKeyStr === this.selectedPartKey || this.highlightedPartKeys.has(partKeyStr)
    }
  }

  private refreshGizmoAttachment(): void {
    if (this.activeReferenceTransformReferenceId !== null) {
      const referenceObject = this.referenceObjects.get(this.activeReferenceTransformReferenceId)
      if (referenceObject === undefined || !referenceObject.visible) {
        this.transformGizmo.detach()
        return
      }
      this.transformGizmo.attach(referenceObject)
      return
    }

    if (this.activeContentObjectTransformObjectId !== null) {
      const contentObjectPivot = this.contentObjectPivots.get(this.activeContentObjectTransformObjectId)
      if (contentObjectPivot === undefined || !contentObjectPivot.visible) {
        this.transformGizmo.detach()
        return
      }
      this.transformGizmo.attach(contentObjectPivot)
      return
    }

    if (this.sketchPlanePickOverlay?.stage === 'adjust') {
      this.transformGizmo.setMode(this.sketchPlanePickOverlay.gizmoMode)
      this.transformGizmo.setSpace('world')
      this.transformGizmo.attach(this.sketchPlanePickHelper.getPreviewPivot())
      return
    }

    if (!this.gizmoEnabled || this.selectedPartKey === null) {
      this.transformGizmo.detach()
      return
    }

    const selected =
      this.partMeshes.get(this.selectedPartKey) ?? this.overlayPartMeshes.get(this.selectedPartKey)
    if (selected === undefined || !selected.visible) {
      this.transformGizmo.detach()
      return
    }

    this.transformGizmo.attach(selected)
  }

  private syncGizmoEnabledState(): void {
    this.transformGizmo.setEnabled(
      this.gizmoEnabled ||
        this.activeReferenceTransformReferenceId !== null ||
        this.activeContentObjectTransformObjectId !== null ||
        this.sketchPlanePickOverlay?.stage === 'adjust',
    )
  }

  private syncReferenceTransformHistoryOverlay(): void {
    if (this.viewerTransformHistoryOverlay === null) {
      this.referenceTransformHistoryHelper.setOverlay(null, null)
      return
    }
    const referenceObject =
      this.viewerTransformHistoryOverlay.target.kind === 'reference'
        ? this.referenceObjects.get(this.viewerTransformHistoryOverlay.target.referenceId) ?? null
        : this.contentObjectPivots.get(this.viewerTransformHistoryOverlay.target.objectId) ?? null
    this.referenceTransformHistoryHelper.setOverlay(
      this.viewerTransformHistoryOverlay,
      referenceObject,
    )
  }

  private getActiveViewerTransformObject(): Object3D | null {
    if (this.activeReferenceTransformReferenceId !== null) {
      return this.referenceObjects.get(this.activeReferenceTransformReferenceId) ?? null
    }
    if (this.activeContentObjectTransformObjectId !== null) {
      return this.contentObjectPivots.get(this.activeContentObjectTransformObjectId) ?? null
    }
    return null
  }

  private getActiveViewerTransformEntryOrigin(): ReferenceTransformOverride | null {
    if (this.activeReferenceTransformReferenceId !== null) {
      return this.activeReferenceTransformEntryOrigin
    }
    if (this.activeContentObjectTransformObjectId !== null) {
      return this.activeContentObjectTransformEntryOrigin
    }
    return null
  }

  private syncReferenceTransformMoveSnapAvailabilityOverlay(): void {
    const activeObject = this.getActiveViewerTransformObject()
    if (activeObject === null || this.gizmoSnap.translate === undefined) {
      this.referenceTransformMoveSnapHelper.setOverlay(null, null)
      return
    }
    let moveSnapHandle: ReferenceTransformMoveSnapOverlay['handle'] | null = null
    if (this.referenceTransformDragging === true) {
      const activeHandle = this.activeReferenceTransformHandle
      moveSnapHandle = isReferenceTransformMoveSnapHandle(activeHandle) ? activeHandle : null
    } else if (this.previewLastMoveSnapDotsEnabled) {
      moveSnapHandle = this.getPreviewLastMoveSnapHandle()
    }
    if (moveSnapHandle === null) {
      this.referenceTransformMoveSnapHelper.setOverlay(null, null)
      return
    }
    this.referenceTransformMoveSnapHelper.setOverlay(
      {
        handle: moveSnapHandle,
        snapValues: this.gizmoSnap.translate,
        space: this.gizmoSpace,
        anchorPosition: this.getActiveViewerTransformEntryOrigin()?.position ?? null,
      },
      activeObject,
    )
  }

  private getPreviewLastMoveSnapHandle(): ReferenceTransformMoveSnapOverlay['handle'] {
    if (isReferenceTransformMoveSnapHandle(this.lastReferenceTransformMoveSnapHandle)) {
      return this.lastReferenceTransformMoveSnapHandle
    }
    return {
      mode: 'translate',
      kind: 'center',
    }
  }

  private syncReferenceTransformRotateSnapPreviewOverlay(): void {
    if (
      this.referenceTransformDragging !== true ||
      this.gizmoSnap.rotate === undefined ||
      this.activeReferenceTransformHandle?.mode !== 'rotate' ||
      this.activeReferenceTransformHandle.kind !== 'axis'
    ) {
      this.referenceTransformRotateSnapHelper.setOverlay(null)
      return
    }

    const activeObject = this.getActiveViewerTransformObject()
    if (activeObject === null || !activeObject.visible) {
      this.referenceTransformRotateSnapHelper.setOverlay(null)
      return
    }

    const basis = this.getReferenceTransformRotatePreviewBasis(
      this.activeReferenceTransformHandle.axis,
      activeObject,
    )
    const ringRadius =
      this.activeReferenceTransformRotatePreviewRingRadius ??
      this.getReferenceTransformRotatePreviewRingRadius(
        activeObject,
        this.activeReferenceTransformHandle.axis,
      )
    const landedAngleDeg = this.readReferenceTransformOverride(activeObject).rotationDeg[
      this.activeReferenceTransformHandle.axis
    ]
    const snapStepDeg = this.gizmoSnap.rotate[this.activeReferenceTransformHandle.axis]

    if (basis === null || !Number.isFinite(ringRadius) || ringRadius === null) {
      this.referenceTransformRotateSnapHelper.setOverlay(null)
      return
    }

    const origin = activeObject.getWorldPosition(new Vector3())
    this.referenceTransformRotateSnapHelper.setOverlay({
      axis: this.activeReferenceTransformHandle.axis,
      origin: { x: origin.x, y: origin.y, z: origin.z },
      axisDirection: {
        x: basis.axisDirection.x,
        y: basis.axisDirection.y,
        z: basis.axisDirection.z,
      },
      referenceDirection: {
        x: basis.referenceDirection.x,
        y: basis.referenceDirection.y,
        z: basis.referenceDirection.z,
      },
      landedAngleDeg,
      snapStepDeg,
      ringRadius,
    })
  }

  private getReferenceTransformRotatePreviewBasis(
    axis: 'x' | 'y' | 'z',
    referenceObject: Object3D,
  ): { axisDirection: Vector3; referenceDirection: Vector3 } | null {
    if (
      this.activeReferenceTransformRotatePreviewBasis !== null &&
      this.activeReferenceTransformRotatePreviewBasis.axis === axis
    ) {
      return {
        axisDirection: this.activeReferenceTransformRotatePreviewBasis.axisDirection.clone(),
        referenceDirection: this.activeReferenceTransformRotatePreviewBasis.referenceDirection.clone(),
      }
    }

    const rotation = this.gizmoSpace === 'local' ? referenceObject.getWorldQuaternion(new Quaternion()) : null
    const orient = (vector: Vector3): Vector3 =>
      (rotation === null ? vector.clone() : vector.clone().applyQuaternion(rotation)).normalize()
    const axisDirection = orient(
      axis === 'x' ? new Vector3(1, 0, 0) : axis === 'y' ? new Vector3(0, 1, 0) : new Vector3(0, 0, 1),
    )
    const baseReferenceDirection = orient(
      axis === 'x' ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0),
    )
    const referenceDirection = baseReferenceDirection
      .addScaledVector(axisDirection, -baseReferenceDirection.dot(axisDirection))
      .normalize()
    if (referenceDirection.lengthSq() < 1e-6) {
      return null
    }
    return { axisDirection, referenceDirection }
  }

  private captureReferenceTransformRotatePreviewContext(): void {
    if (
      this.activeReferenceTransformHandle?.mode !== 'rotate' ||
      this.activeReferenceTransformHandle.kind !== 'axis'
    ) {
      this.activeReferenceTransformRotatePreviewBasis = null
      this.activeReferenceTransformRotatePreviewRingRadius = null
      return
    }

    const activeObject = this.getActiveViewerTransformObject()
    if (activeObject === null) {
      this.activeReferenceTransformRotatePreviewBasis = null
      this.activeReferenceTransformRotatePreviewRingRadius = null
      return
    }

    const basis = this.getReferenceTransformRotatePreviewBasis(
      this.activeReferenceTransformHandle.axis,
      activeObject,
    )
    this.activeReferenceTransformRotatePreviewBasis =
      basis === null
        ? null
        : {
            axis: this.activeReferenceTransformHandle.axis,
            axisDirection: basis.axisDirection.clone(),
            referenceDirection: basis.referenceDirection.clone(),
          }
    this.activeReferenceTransformRotatePreviewRingRadius =
      this.getReferenceTransformRotatePreviewRingRadius(
        activeObject,
        this.activeReferenceTransformHandle.axis,
      )
  }

  private getReferenceTransformRotatePreviewRingRadius(
    referenceObject: Object3D,
    axis: 'x' | 'y' | 'z',
  ): number | null {
    const helper = this.transformGizmo.getHelper()
    const origin = referenceObject.getWorldPosition(new Vector3())
    const axisName = axis.toUpperCase()
    const position = new Vector3()
    const worldPosition = new Vector3()
    let maxRadius = 0

    helper.updateMatrixWorld(true)
    helper.traverse((object) => {
      const geometryOwner = object as Object3D & { geometry?: BufferGeometry }
      if (geometryOwner.geometry === undefined || object.name !== axisName) {
        return
      }
      if (!this.isWorldVisible(object)) {
        return
      }
      const geometry = geometryOwner.geometry
      const positionAttribute = geometry.getAttribute('position')
      if (positionAttribute === undefined) {
        return
      }
      for (let index = 0; index < positionAttribute.count; index += 1) {
        position.fromBufferAttribute(positionAttribute, index)
        worldPosition.copy(position).applyMatrix4(object.matrixWorld)
        maxRadius = Math.max(maxRadius, worldPosition.distanceTo(origin))
      }
    })

    return maxRadius > 0 ? maxRadius : null
  }

  private isWorldVisible(object: Object3D): boolean {
    let current: Object3D | null = object
    while (current !== null) {
      if (!current.visible) {
        return false
      }
      current = current.parent
    }
    return true
  }

  private requestReferenceTransformExit(): void {
    if (this.activeReferenceTransformReferenceId === null) {
      return
    }
    this.activeReferenceTransformReferenceId = null
    this.activeReferenceTransformEntryOrigin = null
    this.lastReferenceTransformMoveSnapHandle = null
    this.activeReferenceTransformRotatePreviewBasis = null
    this.activeReferenceTransformRotatePreviewRingRadius = null
    this.syncGizmoEnabledState()
    this.refreshReferenceHighlightStyling()
    this.refreshGizmoAttachment()
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
    this.onReferenceTransformExit?.()
    this.onViewerTransformExit?.()
  }

  private requestReferenceTransformCommit(): void {
    if (this.activeReferenceTransformReferenceId === null) {
      return
    }
    this.onReferenceTransformCommit?.()
    this.onViewerTransformCommit?.()
    this.transformGizmo.clearActiveHandle()
    this.refreshGizmoAttachment()
  }

  private requestContentObjectTransformCommit(): void {
    if (this.activeContentObjectTransformObjectId === null) {
      return
    }
    this.onContentObjectTransformCommit?.()
    this.onViewerTransformCommit?.()
    this.transformGizmo.clearActiveHandle()
    this.refreshGizmoAttachment()
  }

  private applyReferenceTransformSnapToOverride(
    object: Object3D,
    transformOverride: ReferenceTransformOverride,
  ): ReferenceTransformOverride {
    const handle = this.activeReferenceTransformHandle
    if (handle === null) {
      return transformOverride
    }
    const snapValues =
      handle.mode === 'translate'
        ? this.gizmoSnap.translate
        : handle.mode === 'rotate'
          ? this.gizmoSnap.rotate
          : this.gizmoSnap.scale
    if (snapValues === undefined) {
      return transformOverride
    }
    const quantize = (value: number, step: number): number => {
      if (!Number.isFinite(step) || step <= 0) {
        return value
      }
      return Number((Math.round(value / step) * step).toFixed(4))
    }
    const snapAxes = (
      values: { x: number; y: number; z: number },
      axes: ReadonlyArray<'x' | 'y' | 'z'>,
      stepByAxis: { x: number; y: number; z: number },
    ) => {
      const nextValues = { ...values }
      axes.forEach((axis) => {
        nextValues[axis] = quantize(values[axis], stepByAxis[axis])
      })
      return nextValues
    }
    const nextOverride: ReferenceTransformOverride = {
      position: { ...transformOverride.position },
      rotationDeg: { ...transformOverride.rotationDeg },
      scale: { ...transformOverride.scale },
    }
    if (handle.mode === 'translate') {
      const axes =
        handle.kind === 'axis'
          ? [handle.axis]
          : handle.kind === 'plane'
            ? handle.plane === 'xy'
              ? (['x', 'y'] as const)
              : handle.plane === 'xz'
                ? (['x', 'z'] as const)
                : (['y', 'z'] as const)
            : (['x', 'y', 'z'] as const)
      nextOverride.position = snapAxes(transformOverride.position, axes, snapValues)
    } else if (handle.mode === 'rotate') {
      if (handle.kind === 'axis') {
        nextOverride.rotationDeg = snapAxes(transformOverride.rotationDeg, [handle.axis], snapValues)
      } else if (handle.kind === 'free-rotate') {
        nextOverride.rotationDeg = snapAxes(transformOverride.rotationDeg, ['x', 'y', 'z'], {
          x: snapValues.x,
          y: snapValues.x,
          z: snapValues.x,
        })
      }
    } else {
      const axes = handle.kind === 'axis' ? [handle.axis] : (['x', 'y', 'z'] as const)
      nextOverride.scale = snapAxes(transformOverride.scale, axes, snapValues)
    }
    const changed =
      nextOverride.position.x !== transformOverride.position.x ||
      nextOverride.position.y !== transformOverride.position.y ||
      nextOverride.position.z !== transformOverride.position.z ||
      nextOverride.rotationDeg.x !== transformOverride.rotationDeg.x ||
      nextOverride.rotationDeg.y !== transformOverride.rotationDeg.y ||
      nextOverride.rotationDeg.z !== transformOverride.rotationDeg.z ||
      nextOverride.scale.x !== transformOverride.scale.x ||
      nextOverride.scale.y !== transformOverride.scale.y ||
      nextOverride.scale.z !== transformOverride.scale.z
    if (changed) {
      this.applyReferenceTransformOverride(object, nextOverride)
    }
    return nextOverride
  }

  private readonly handleReferenceTransformObjectChange = (object: Object3D): void => {
    if (this.activeReferenceTransformReferenceId === null) {
      return
    }
    const activeObject = this.referenceObjects.get(this.activeReferenceTransformReferenceId)
    if (activeObject === undefined || activeObject !== object) {
      return
    }
    const snappedOverride = this.applyReferenceTransformSnapToOverride(
      object,
      this.readReferenceTransformOverride(object),
    )
    this.onReferenceTransformChange?.(
      this.activeReferenceTransformReferenceId,
      snappedOverride,
    )
    this.onViewerTransformChange?.(
      {
        kind: 'reference',
        referenceId: this.activeReferenceTransformReferenceId,
      },
      snappedOverride,
    )
    if (this.cameraLockedReferenceId === this.activeReferenceTransformReferenceId) {
      this.syncLockedReferenceCamera(object)
    }
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  private readonly handleReferenceTransformHandleChange = (
    handle: ActiveReferenceTransformHandle | null,
  ): void => {
    this.activeReferenceTransformHandle = handle
    if (isReferenceTransformMoveSnapHandle(handle)) {
      this.lastReferenceTransformMoveSnapHandle =
        handle.kind === 'axis'
          ? { mode: 'translate', kind: 'axis', axis: handle.axis }
          : handle.kind === 'plane'
            ? { mode: 'translate', kind: 'plane', plane: handle.plane }
            : { mode: 'translate', kind: 'center' }
    }
    if (this.referenceTransformDragging === true) {
      this.captureReferenceTransformRotatePreviewContext()
    } else if (handle?.mode !== 'rotate' || handle.kind !== 'axis') {
      this.activeReferenceTransformRotatePreviewBasis = null
      this.activeReferenceTransformRotatePreviewRingRadius = null
    }
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
    if (this.activeReferenceTransformReferenceId !== null) {
      this.onReferenceTransformHandleChange?.(handle)
      this.onViewerTransformHandleChange?.(handle)
      return
    }
    if (this.activeContentObjectTransformObjectId !== null) {
      this.onContentObjectTransformHandleChange?.(handle)
      this.onViewerTransformHandleChange?.(handle)
    }
  }

  private readonly handleReferenceTransformDraggingChange = (dragging: boolean): void => {
    this.referenceTransformDragging = dragging
    if (dragging) {
      this.captureReferenceTransformRotatePreviewContext()
    } else {
      this.activeReferenceTransformRotatePreviewBasis = null
      this.activeReferenceTransformRotatePreviewRingRadius = null
    }
    this.syncReferenceTransformMoveSnapAvailabilityOverlay()
    this.syncReferenceTransformRotateSnapPreviewOverlay()
  }

  private readonly handleSketchPlanePickTransformObjectChange = (object: Object3D): void => {
    if (
      this.sketchPlanePickOverlay?.stage !== 'adjust' ||
      object !== this.sketchPlanePickHelper.getPreviewPivot()
    ) {
      return
    }
    const nextTransform = this.sketchPlanePickHelper.readDraftTransform()
    if (nextTransform === null) {
      return
    }
    this.onSketchPlanePickTransformChange?.(nextTransform)
  }

  private readonly handleSketchPlanePickTransformDragComplete = (object: Object3D): void => {
    if (
      this.sketchPlanePickOverlay?.stage !== 'adjust' ||
      object !== this.sketchPlanePickHelper.getPreviewPivot()
    ) {
      return
    }
    this.onSketchPlanePickTransformCommit?.()
  }

  private readonly handleTransformGizmoObjectChange = (object: Object3D): void => {
    if (
      this.activeReferenceTransformReferenceId !== null &&
      this.referenceObjects.get(this.activeReferenceTransformReferenceId) === object
    ) {
      this.handleReferenceTransformObjectChange(object)
      return
    }
    if (
      this.activeContentObjectTransformObjectId !== null &&
      this.contentObjectPivots.get(this.activeContentObjectTransformObjectId) === object
    ) {
      const snappedOverride = this.applyReferenceTransformSnapToOverride(
        object,
        this.readReferenceTransformOverride(object),
      )
      this.onContentObjectTransformChange?.(this.activeContentObjectTransformObjectId, snappedOverride)
      this.onViewerTransformChange?.(
        {
          kind: 'content-object',
          objectId: this.activeContentObjectTransformObjectId,
        },
        snappedOverride,
      )
      this.syncReferenceTransformMoveSnapAvailabilityOverlay()
      this.syncReferenceTransformRotateSnapPreviewOverlay()
      return
    }
    this.handleSketchPlanePickTransformObjectChange(object)
  }

  private readonly handleTransformGizmoDragComplete = (object: Object3D): void => {
    if (
      this.activeReferenceTransformReferenceId !== null &&
      this.referenceObjects.get(this.activeReferenceTransformReferenceId) === object
    ) {
      this.requestReferenceTransformCommit()
      return
    }
    if (
      this.activeContentObjectTransformObjectId !== null &&
      this.contentObjectPivots.get(this.activeContentObjectTransformObjectId) === object
    ) {
      this.requestContentObjectTransformCommit()
      return
    }
    this.handleSketchPlanePickTransformDragComplete(object)
  }

  private syncLockedReferenceCamera(object: Object3D): void {
    if (this.gizmoMode === 'translate') {
      this.cameraLockedReferenceCenter = this.cameraController.trackObject(
        object,
        this.cameraLockedReferenceCenter,
      )
      const metrics = this.readReferenceBoundsMetrics(object)
      this.cameraLockedReferenceMaxDim = metrics?.maxDim ?? null
      return
    }
    if (this.gizmoMode === 'scale') {
      const scaleAnchor = this.readReferenceScaleAnchor(object)
      const scaleTarget =
        this.cameraLockedReferenceTargetOffset === null
          ? scaleAnchor
          : scaleAnchor.clone().add(this.cameraLockedReferenceTargetOffset)
      const nextMetrics = this.cameraController.trackScaledObject(
        object,
        scaleAnchor,
        this.cameraLockedReferenceMaxDim,
        scaleTarget,
      )
      const boundsMetrics = this.readReferenceBoundsMetrics(object)
      this.cameraLockedReferenceCenter = boundsMetrics?.center ?? nextMetrics.center
      this.cameraLockedReferenceMaxDim = nextMetrics.maxDim
      return
    }
    this.cameraController.frameObject(object)
    const metrics = this.readReferenceBoundsMetrics(object)
    this.cameraLockedReferenceCenter = metrics?.center ?? null
    this.cameraLockedReferenceMaxDim = metrics?.maxDim ?? null
  }

  private readReferenceBoundsMetrics(
    object: Object3D,
  ): { center: Vector3; maxDim: number } | null {
    const bounds = new Box3().setFromObject(object, true)
    if (bounds.isEmpty()) {
      return null
    }
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    return {
      center,
      maxDim: Math.max(size.x, size.y, size.z, 0.001),
    }
  }

  private readReferenceScaleAnchor(object: Object3D): Vector3 {
    return object.getWorldPosition(new Vector3())
  }

  private getFrameAllBounds(): Box3 {
    const bounds = this.getFrameExtentsBounds()
    if (this.gridGroup.visible) {
      bounds.union(new Box3().setFromObject(this.gridGroup, true))
    }
    return bounds
  }

  private getFrameExtentsBounds(): Box3 {
    return new Box3().setFromObject(this.rootGroup, true)
  }

  private getGeometrySketchFrameBounds(): Box3 {
    const bounds = new Box3().setFromObject(this.geometrySketchOverlayGroup, true)
    const shouldIncludeDrawDraft =
      this.geometrySketchOverlay?.mode === 'draw' &&
      this.geometrySketchOverlay.drawDraft !== null &&
      (this.geometrySketchOverlay.activeTool === 'line' ||
        this.geometrySketchOverlay.activeTool === 'pline' ||
        this.geometrySketchOverlay.activeTool === 'rectangle' ||
        this.geometrySketchOverlay.activeTool === 'circle')
    const drawDraftGroup = this.geometrySketchDrawHelper.getGroup()
    if (shouldIncludeDrawDraft && drawDraftGroup.visible) {
      bounds.union(new Box3().setFromObject(drawDraftGroup, true))
    }
    return bounds
  }

  private getSelectedGeometrySketchFrameBounds(): Box3 {
    if (
      this.geometrySketchOverlay?.mode !== 'draw' ||
      this.geometrySketchOverlay.activeTool !== null ||
      (this.geometrySketchOverlay.selectedComponentIds?.length ?? 0) === 0
    ) {
      return new Box3()
    }

    const bounds = new Box3()
    const selectedPolylines = buildGeometrySketchRenderPolylines(this.geometrySketchOverlay).filter(
      (polyline) => polyline.layer === 'selectedComponent',
    )
    for (const polyline of selectedPolylines) {
      for (const point of polyline.points) {
        bounds.expandByPoint(new Vector3(point.x, point.y, point.z))
      }
    }
    return bounds
  }

  private syncAxisOverlay(): void {
    if (!this.axisOverlayEnabled || this.axisOverlayCanvas === null) {
      this.axisGizmo?.dispose()
      this.axisGizmo = null
      return
    }

    if (this.axisGizmo !== null) {
      return
    }

    this.axisGizmo = new AxisGizmo(this.axisOverlayCanvas)
    this.axisGizmo.setStyle(this.currentViewSettings.axisOverlayStyle)
    this.axisGizmo.setOnTargetSelected((target) => {
      this.snapCameraToOrientationTarget(target)
    })
    this.axisGizmo.setOnOrbitDragStart((clientX, clientY) => {
      this.beginTemporaryOrbitDrag(clientX, clientY)
    })
    this.axisGizmo.setOnOrbitDragMove((clientX, clientY) => {
      this.updateTemporaryOrbitDrag(clientX, clientY)
    })
    this.axisGizmo.setOnOrbitDragEnd(() => {
      this.endTemporaryOrbitDrag()
    })
  }

  private getGeometrySketchMaterial(layer: GeometrySketchRenderLayer): LineBasicMaterial {
    if (layer === 'draftGhost') {
      return this.geometrySketchDraftGhostMaterial
    }
    if (layer === 'draftChain') {
      return this.geometrySketchDraftChainMaterial
    }
    if (layer === 'hoveredComponent') {
      return this.geometrySketchHoveredComponentMaterial
    }
    if (layer === 'selectedComponent') {
      return this.geometrySketchSelectedComponentMaterial
    }
    if (layer === 'selectedProfile') {
      return this.geometrySketchSelectedProfileMaterial
    }
    if (layer === 'profile') {
      return this.geometrySketchProfileMaterial
    }
    if (layer === 'selectionWindowWindow') {
      return this.geometrySketchSelectionWindowMaterial
    }
    if (layer === 'selectionWindowCrossing') {
      return this.geometrySketchSelectionCrossingMaterial
    }
    return this.geometrySketchComponentMaterial
  }

  private clearGeometrySketchOverlayGroup(group: Group): void {
    group.children.forEach((child) => {
      const line = child as Line
      line.geometry.dispose()
    })
    group.clear()
  }

  private renderGeometrySketchOverlayPolylines(
    group: Group,
    overlay: GeometrySketchOverlayVm,
  ): void {
    for (const polyline of buildGeometrySketchRenderPolylines(overlay)) {
      if (polyline.points.length < 2) {
        continue
      }
      const geometry = new BufferGeometry()
      geometry.setFromPoints(
        polyline.points.map((point) => new Vector3(point.x, point.y, point.z)),
      )
      const line = new Line(geometry, this.getGeometrySketchMaterial(polyline.layer))
      line.frustumCulled = false
      line.renderOrder =
        polyline.layer === 'selectedComponent'
          ? 99
          : polyline.layer === 'hoveredComponent'
            ? 98
            : polyline.layer === 'selectedProfile'
              ? 98
              : polyline.layer === 'profile'
                ? 97
                : polyline.layer === 'selectionWindowWindow' ||
                    polyline.layer === 'selectionWindowCrossing'
                  ? 100
                  : 96
      if (group === this.geometrySketchOverlayGroup && polyline.layer === 'component' && typeof polyline.componentRowId === 'string') {
        line.userData.geometrySketchComponentRowId = polyline.componentRowId
      }
      group.add(line)
    }
  }

  private getHoveredGeometrySketchComponentId(
    clientX: number,
    clientY: number,
  ): string | null {
    if (
      this.geometrySketchOverlay === null ||
      this.geometrySketchOverlay.mode !== 'draw' ||
      this.geometrySketchOverlay.activeTool !== null
    ) {
      return null
    }
    const rect = this.renderer.domElement.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      return null
    }
    this.pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1),
    )
    this.raycaster.params.Line = {
      ...(this.raycaster.params.Line ?? {}),
      threshold: 0.18,
    }
    this.raycaster.setFromCamera(this.pointer, this.cameraController.getActiveCamera())
    const intersections = this.raycaster.intersectObjects(this.geometrySketchOverlayGroup.children, false)
    for (const intersection of intersections) {
      const rowId = intersection.object.userData.geometrySketchComponentRowId
      if (typeof rowId === 'string' && rowId.length > 0) {
        return rowId
      }
    }
    return null
  }

  private shouldHandleWorkspaceSelectionPick(): boolean {
    return (
      this.onWorkspaceSelectionPick !== null &&
      this.sketchPlanePickOverlay === null &&
      this.geometrySketchOverlay === null &&
      this.consoleCameraMode === null &&
      this.consoleCameraModeDrag === null &&
      this.consoleZoomWindowDrag === null &&
      this.cameraOrbitModifierDrag === null &&
      this.activeReferenceTransformReferenceId === null
    )
  }

  private isWorkspaceSelectionViewportGizmoHit(clientX: number, clientY: number): boolean {
    const helper = this.transformGizmo.getHelper()
    if (!helper.visible) {
      return false
    }
    const rect = this.renderer.domElement.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      return false
    }
    this.pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1),
    )
    this.raycaster.setFromCamera(this.pointer, this.cameraController.getActiveCamera())
    return this.raycaster.intersectObject(helper, true).length > 0
  }

  private collectWorkspaceSelectionCandidates(): WorkspaceSelectionCandidate[] {
    const candidates: WorkspaceSelectionCandidate[] = []
    for (const [referenceId, object] of this.referenceObjects.entries()) {
      if (!isObjectWorldVisible(object)) {
        continue
      }
      candidates.push({
        pick: {
          kind: 'reference-item',
          referenceId,
        },
        object,
      })
    }
    for (const [partKey, mesh] of [
      ...this.partMeshes.entries(),
      ...this.overlayPartMeshes.entries(),
    ]) {
      if (!isObjectWorldVisible(mesh)) {
        continue
      }
      candidates.push({
        pick: {
          kind: 'part',
          partKey,
        },
        object: mesh,
      })
    }
    return candidates
  }

  private pickWorkspaceSelection(
    clientX: number,
    clientY: number,
  ): WorkspaceSelectionPick | null {
    const rect = this.renderer.domElement.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      return null
    }
    this.pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1),
    )
    this.raycaster.setFromCamera(this.pointer, this.cameraController.getActiveCamera())
    const pickRoots = this.collectWorkspaceSelectionCandidates().map((candidate) => candidate.object)
    const intersections = this.raycaster.intersectObjects(pickRoots, true)
    for (const intersection of intersections) {
      let current: Object3D | null = intersection.object
      while (current !== null) {
        const referenceId = current.userData.referenceId
        if (typeof referenceId === 'string' && referenceId.length > 0) {
          return {
            kind: 'reference-item',
            referenceId,
          }
        }
        const partKey = current.userData.partKey
        if (typeof partKey === 'string' && partKey.length > 0) {
          return {
            kind: 'part',
            partKey,
          }
        }
        current = current.parent
      }
    }
    return null
  }

  private pickWorkspaceSelectionWindow(
    anchorClientX: number,
    anchorClientY: number,
    currentClientX: number,
    currentClientY: number,
  ): WorkspaceSelectionPick[] {
    const rect = this.renderer.domElement.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      return []
    }
    return collectWorkspaceSelectionWindowPicks(
      this.collectWorkspaceSelectionCandidates(),
      this.cameraController.getActiveCamera(),
      {
        width: rect.width,
        height: rect.height,
      },
      this.getCanvasLocalClientPoint(anchorClientX, anchorClientY),
      this.getCanvasLocalClientPoint(currentClientX, currentClientY),
    )
  }

  private getCurrentGeometrySketchSelectionWindowMode(
    anchor: { x: number; y: number },
    current: { x: number; y: number },
  ): 'window' | 'crossing' {
    return getWorkspaceSelectionWindowMode(anchor, current)
  }

  private alignCameraToGeometrySketchPlaneInternal(overlay: GeometrySketchOverlayVm): void {
    const planeOrigin = getSketchPlaneWorldOrigin(overlay.plane, overlay.planeTransform)
    const planeNormal = getSketchPlaneWorldNormal(overlay.plane, overlay.planeTransform)
    const planeYAxis = getSketchPlaneWorldYAxis(overlay.plane, overlay.planeTransform)
    const controls = this.cameraController.getControls()
    const currentViewDirection = this.cameraController
      .getActiveCamera()
      .position.clone()
      .sub(controls.target)
      .normalize()
    const currentUp = this.cameraController.getActiveCamera().up.clone().normalize()
    const oppositeNormal = planeNormal.clone().multiplyScalar(-1)
    const preferredDirection =
      currentViewDirection.dot(planeNormal) >= currentViewDirection.dot(oppositeNormal)
        ? planeNormal
        : oppositeNormal
    const oppositePlaneYAxis = planeYAxis.clone().multiplyScalar(-1)
    const preferredUp =
      currentUp.dot(planeYAxis) >= currentUp.dot(oppositePlaneYAxis)
        ? planeYAxis
        : oppositePlaneYAxis
    this.cameraController.animateToDirection(preferredDirection, {
      target: planeOrigin,
      up: preferredUp,
      durationMs: 320,
    })
  }

  private readonly handleResize = (): void => {
    const width = Math.max(this.container.clientWidth, 1)
    const height = Math.max(this.container.clientHeight, 1)
    this.cameraController.setViewportSize(width, height)
    this.renderer.setSize(width, height, false)
  }

  private readonly handleSketchPlanePickPointerDown = (event: PointerEvent): void => {
    if (event.button === 2) {
      if (this.canStartFlySession(event)) {
        this.startFlySession(event)
      }
      return
    }
    if (
      event.button === 1 &&
      this.currentViewSettings.orbitEnabled
    ) {
      if (event.ctrlKey) {
        event.preventDefault()
        event.stopPropagation()
        this.cameraOrbitModifierDrag = {
          pointerId: event.pointerId,
        }
        this.renderer.domElement.setPointerCapture(event.pointerId)
        this.beginTemporaryOrbitDrag(event.clientX, event.clientY)
        return
      }
      this.middleClickTracker = {
        pointerId: event.pointerId,
        anchorClientX: event.clientX,
        anchorClientY: event.clientY,
        moved: false,
      }
      return
    }
    if (
      event.button === 0 &&
      this.currentViewSettings.orbitEnabled &&
      this.consoleCameraMode !== null &&
      this.sketchPlanePickOverlay === null
    ) {
      event.preventDefault()
      event.stopPropagation()
      this.renderer.domElement.setPointerCapture(event.pointerId)
      if (this.consoleCameraMode === 'zoom-window') {
        this.consoleZoomWindowDrag = {
          pointerId: event.pointerId,
          anchorClientX: event.clientX,
          anchorClientY: event.clientY,
        }
        this.updateZoomWindowOverlay(event.clientX, event.clientY, event.clientX, event.clientY)
      } else {
        this.consoleCameraModeDrag = {
          pointerId: event.pointerId,
          mode: this.consoleCameraMode,
        }
        if (this.consoleCameraMode === 'pan') {
          this.beginTemporaryPanDrag(event.clientX, event.clientY)
        } else {
          this.beginTemporaryOrbitDrag(event.clientX, event.clientY)
        }
      }
      return
    }
    if (event.button !== 0) {
      return
    }
    if (
      this.shouldHandleWorkspaceSelectionPick() &&
      !this.isWorkspaceSelectionViewportGizmoHit(event.clientX, event.clientY)
    ) {
      this.workspaceSelectionClickTracker = {
        pointerId: event.pointerId,
        anchorClientX: event.clientX,
        anchorClientY: event.clientY,
        moved: false,
        ctrlKey: event.ctrlKey,
      }
      this.renderer.domElement.setPointerCapture(event.pointerId)
    } else {
      this.workspaceSelectionClickTracker = null
    }
    if (
      this.consoleZoomWindowDrag !== null &&
      event.pointerId === this.consoleZoomWindowDrag.pointerId
    ) {
      return
    }
    if (
      this.sketchPlanePickOverlay !== null &&
      this.sketchPlanePickOverlay.stage === 'pick'
    ) {
      const plane = this.sketchPlanePickHelper.pickPlane(
        this.cameraController.getActiveCamera(),
        this.renderer.domElement,
        event.clientX,
        event.clientY,
      )
      if (plane === null) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      this.onSketchPlanePickPlaneSelect?.(plane)
      return
    }
    if (
      this.geometrySketchOverlay?.mode === 'draw' &&
      this.geometrySketchOverlay.activeTool === null &&
      this.geometrySketchOverlay.drawStage === 'sessionIdle'
    ) {
      const projectedPoint = this.geometrySketchDrawHelper.projectPointerToSketch(
        this.cameraController.getActiveCamera(),
        this.renderer.domElement,
        event.clientX,
        event.clientY,
      )
      if (projectedPoint === null) {
        return
      }
      const hoveredComponentId = this.getHoveredGeometrySketchComponentId(
        event.clientX,
        event.clientY,
      )
      event.preventDefault()
      event.stopPropagation()
      if (hoveredComponentId !== null) {
        this.onGeometrySketchSelectionWindowDraftChange?.(null)
        this.onGeometrySketchSelectComponents?.(
          expandGeometrySketchSelectionFromRowId(
            this.geometrySketchOverlay.components,
            hoveredComponentId,
          ),
        )
        return
      }
      this.geometrySketchSelectionDrag = {
        pointerId: event.pointerId,
        anchorPoint: projectedPoint.point,
        anchorClientX: event.clientX,
        anchorClientY: event.clientY,
      }
      this.renderer.domElement.setPointerCapture(event.pointerId)
      this.onGeometrySketchHoverComponent?.(null)
      this.onGeometrySketchSelectionWindowDraftChange?.({
        anchor: projectedPoint.point,
        current: projectedPoint.point,
        mode: 'crossing',
      })
      return
    }
    const drawHit = this.geometrySketchDrawHelper.projectPointerToSketch(
      this.cameraController.getActiveCamera(),
      this.renderer.domElement,
      event.clientX,
      event.clientY,
    )
    if (drawHit === null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    this.onGeometrySketchConfirmPoint?.(drawHit.point, drawHit.snapTarget)
  }

  private readonly handleSketchPlanePickPointerMove = (event: PointerEvent): void => {
    if (this.flySession !== null && event.pointerId === this.flySession.pointerId) {
      this.updateFlySessionPointer(event)
      return
    }
    if (
      this.workspaceSelectionClickTracker !== null &&
      event.pointerId === this.workspaceSelectionClickTracker.pointerId
    ) {
      this.workspaceSelectionClickTracker.ctrlKey =
        this.workspaceSelectionClickTracker.ctrlKey || event.ctrlKey
      this.workspaceSelectionClickTracker.moved =
        this.workspaceSelectionClickTracker.moved ||
        hasWorkspaceSelectionDragExceededThreshold(
          this.workspaceSelectionClickTracker.anchorClientX,
          this.workspaceSelectionClickTracker.anchorClientY,
          event.clientX,
          event.clientY,
          WORKSPACE_SELECTION_DRAG_THRESHOLD_PX,
        )
      if (this.workspaceSelectionClickTracker.moved) {
        event.preventDefault()
        event.stopPropagation()
        this.updateWorkspaceSelectionOverlay(
          this.workspaceSelectionClickTracker.anchorClientX,
          this.workspaceSelectionClickTracker.anchorClientY,
          event.clientX,
          event.clientY,
          getWorkspaceSelectionWindowMode(
            this.getCanvasLocalClientPoint(
              this.workspaceSelectionClickTracker.anchorClientX,
              this.workspaceSelectionClickTracker.anchorClientY,
            ),
            this.getCanvasLocalClientPoint(event.clientX, event.clientY),
          ),
        )
        return
      }
    }
    if (
      this.consoleZoomWindowDrag !== null &&
      event.pointerId === this.consoleZoomWindowDrag.pointerId
    ) {
      event.preventDefault()
      event.stopPropagation()
      this.updateZoomWindowOverlay(
        this.consoleZoomWindowDrag.anchorClientX,
        this.consoleZoomWindowDrag.anchorClientY,
        event.clientX,
        event.clientY,
      )
      return
    }
    if (
      this.consoleCameraModeDrag !== null &&
      event.pointerId === this.consoleCameraModeDrag.pointerId
    ) {
      event.preventDefault()
      event.stopPropagation()
      if (this.consoleCameraModeDrag.mode === 'pan') {
        this.updateTemporaryPanDrag(event.clientX, event.clientY)
      } else {
        this.updateTemporaryOrbitDrag(event.clientX, event.clientY)
      }
      return
    }
    if (
      this.cameraOrbitModifierDrag !== null &&
      event.pointerId === this.cameraOrbitModifierDrag.pointerId
    ) {
      event.preventDefault()
      event.stopPropagation()
      this.updateTemporaryOrbitDrag(event.clientX, event.clientY)
      return
    }
    if (
      this.middleClickTracker !== null &&
      event.pointerId === this.middleClickTracker.pointerId &&
      !this.middleClickTracker.moved
    ) {
      this.middleClickTracker.moved =
        Math.max(
          Math.abs(event.clientX - this.middleClickTracker.anchorClientX),
          Math.abs(event.clientY - this.middleClickTracker.anchorClientY),
        ) >= 3
    }
    if (
      this.sketchPlanePickOverlay !== null &&
      this.sketchPlanePickOverlay.stage === 'pick'
    ) {
      const plane = this.sketchPlanePickHelper.pickPlane(
        this.cameraController.getActiveCamera(),
        this.renderer.domElement,
        event.clientX,
        event.clientY,
      )
      this.sketchPlanePickHelper.setHoveredPlane(plane)
      return
    }
    this.sketchPlanePickHelper.setHoveredPlane(null)
    if (
      this.geometrySketchOverlay?.mode === 'draw' &&
      this.geometrySketchOverlay.activeTool === null &&
      this.geometrySketchOverlay.drawStage === 'sessionIdle'
    ) {
      if (this.geometrySketchSelectionDrag !== null) {
        const projectedPoint = this.geometrySketchDrawHelper.projectPointerToSketch(
          this.cameraController.getActiveCamera(),
          this.renderer.domElement,
          event.clientX,
          event.clientY,
        )
        if (projectedPoint !== null) {
          this.onGeometrySketchSelectionWindowDraftChange?.({
            anchor: this.geometrySketchSelectionDrag.anchorPoint,
            current: projectedPoint.point,
            mode: this.getCurrentGeometrySketchSelectionWindowMode(
              this.geometrySketchSelectionDrag.anchorPoint,
              projectedPoint.point,
            ),
          })
        }
        return
      }
      this.onGeometrySketchHoverComponent?.(
        this.getHoveredGeometrySketchComponentId(event.clientX, event.clientY),
      )
      return
    }
    const drawHit = this.geometrySketchDrawHelper.projectPointerToSketch(
      this.cameraController.getActiveCamera(),
      this.renderer.domElement,
      event.clientX,
      event.clientY,
    )
    this.onGeometrySketchHoverPoint?.(drawHit?.point ?? null, drawHit?.snapTarget ?? null)
  }

  private readonly handleSketchPlanePickPointerUp = (event: PointerEvent): void => {
    if (this.flySession !== null && event.pointerId === this.flySession.pointerId) {
      event.preventDefault()
      event.stopPropagation()
      this.endFlySession({
        pointerId: event.pointerId,
        suppressContextMenu: true,
      })
      return
    }
    if (
      this.consoleZoomWindowDrag !== null &&
      event.pointerId === this.consoleZoomWindowDrag.pointerId
    ) {
      const zoomWindowDrag = this.consoleZoomWindowDrag
      this.consoleZoomWindowDrag = null
      this.consoleCameraMode = null
      if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
        this.renderer.domElement.releasePointerCapture(event.pointerId)
      }
      event.preventDefault()
      event.stopPropagation()
      this.clearZoomWindowOverlay()
      if (
        Math.max(
          Math.abs(event.clientX - zoomWindowDrag.anchorClientX),
          Math.abs(event.clientY - zoomWindowDrag.anchorClientY),
        ) < 3
      ) {
        appendConsoleEntry({
          layer: 'View',
          text: 'Zoom Window cancelled',
          source: 'viewer',
          severity: 'info',
        })
        return
      }
      const anchor = this.getCanvasLocalClientPoint(
        zoomWindowDrag.anchorClientX,
        zoomWindowDrag.anchorClientY,
      )
      const current = this.getCanvasLocalClientPoint(event.clientX, event.clientY)
      this.rememberCameraPose()
      const didFrameWindow = this.cameraController.frameWindowClientRect(
        anchor.x,
        anchor.y,
        current.x,
        current.y,
      )
      appendConsoleEntry({
        layer: 'View',
        text: didFrameWindow ? 'Zoom Window complete' : 'Zoom Window could not resolve a frame box',
        source: 'viewer',
        severity: didFrameWindow ? 'info' : 'warn',
      })
      return
    }
    if (
      this.consoleCameraModeDrag !== null &&
      event.pointerId === this.consoleCameraModeDrag.pointerId
    ) {
      const mode = this.consoleCameraModeDrag.mode
      this.consoleCameraModeDrag = null
      this.consoleCameraMode = null
      if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
        this.renderer.domElement.releasePointerCapture(event.pointerId)
      }
      event.preventDefault()
      event.stopPropagation()
      if (mode === 'pan') {
        this.endTemporaryPanDrag()
      } else {
        this.endTemporaryOrbitDrag()
      }
      appendConsoleEntry({
        layer: 'View',
        text: `${mode === 'pan' ? 'Pan' : 'Orbit'} complete`,
        source: 'viewer',
        severity: 'info',
      })
      return
    }
    if (
      this.cameraOrbitModifierDrag !== null &&
      event.pointerId === this.cameraOrbitModifierDrag.pointerId
    ) {
      this.cameraOrbitModifierDrag = null
      if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
        this.renderer.domElement.releasePointerCapture(event.pointerId)
      }
      event.preventDefault()
      event.stopPropagation()
      this.endTemporaryOrbitDrag()
      return
    }
    if (
      this.middleClickTracker !== null &&
      event.pointerId === this.middleClickTracker.pointerId
    ) {
      const click = this.middleClickTracker
      this.middleClickTracker = null
      if (!click.moved && this.currentViewSettings.orbitEnabled) {
        const nextClickAtMs = performance.now()
        if (
          this.lastMiddleClick !== null &&
          nextClickAtMs - this.lastMiddleClick.atMs <= 350 &&
          Math.max(
            Math.abs(event.clientX - this.lastMiddleClick.clientX),
            Math.abs(event.clientY - this.lastMiddleClick.clientY),
          ) <= 6
        ) {
          this.lastMiddleClick = null
          event.preventDefault()
          event.stopPropagation()
          this.frameAll()
          return
        }
        this.lastMiddleClick = {
          atMs: nextClickAtMs,
          clientX: event.clientX,
          clientY: event.clientY,
        }
      } else if (click.moved) {
        this.lastMiddleClick = null
      }
      return
    }
    if (
      this.workspaceSelectionClickTracker !== null &&
      event.pointerId === this.workspaceSelectionClickTracker.pointerId
    ) {
      const click = this.workspaceSelectionClickTracker
      this.workspaceSelectionClickTracker = null
      if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
        this.renderer.domElement.releasePointerCapture(event.pointerId)
      }
      this.clearWorkspaceSelectionOverlay()
      if (!click.moved) {
        this.onWorkspaceSelectionPick?.({
          picks: (() => {
            const pick = this.pickWorkspaceSelection(event.clientX, event.clientY)
            return pick === null ? [] : [pick]
          })(),
          ctrlKey: click.ctrlKey || event.ctrlKey,
        })
      } else {
        event.preventDefault()
        event.stopPropagation()
        this.onWorkspaceSelectionPick?.({
          picks: this.pickWorkspaceSelectionWindow(
            click.anchorClientX,
            click.anchorClientY,
            event.clientX,
            event.clientY,
          ),
          ctrlKey: click.ctrlKey || event.ctrlKey,
        })
      }
    }
    if (
      this.geometrySketchSelectionDrag === null ||
      event.pointerId !== this.geometrySketchSelectionDrag.pointerId
    ) {
      return
    }
    const selectionDrag = this.geometrySketchSelectionDrag
    this.geometrySketchSelectionDrag = null
    if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
      this.renderer.domElement.releasePointerCapture(event.pointerId)
    }
    const projectedPoint =
      this.geometrySketchDrawHelper.projectPointerToSketch(
        this.cameraController.getActiveCamera(),
        this.renderer.domElement,
        event.clientX,
        event.clientY,
      ) ?? {
        point: selectionDrag.anchorPoint,
        snapTarget: null,
      }
    this.onGeometrySketchSelectionWindowDraftChange?.(null)
    if (
      Math.max(
        Math.abs(event.clientX - selectionDrag.anchorClientX),
        Math.abs(event.clientY - selectionDrag.anchorClientY),
      ) < 3
    ) {
      this.onGeometrySketchSelectComponents?.([])
      return
    }
    if (this.geometrySketchOverlay === null) {
      this.onGeometrySketchSelectComponents?.([])
      return
    }
    const mode = this.getCurrentGeometrySketchSelectionWindowMode(
      selectionDrag.anchorPoint,
      projectedPoint.point,
    )
    this.onGeometrySketchSelectComponents?.(
      collectGeometrySketchSelectionIds(
        this.geometrySketchOverlay.components,
        selectionDrag.anchorPoint,
        projectedPoint.point,
        mode,
      ),
    )
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) {
      return
    }
    if (isEditableTarget(event.target)) {
      return
    }
    const routing = routeKeyboardInput({
      event,
      viewerFlyActive: this.flySession !== null,
      geometrySketchMode: this.geometrySketchOverlay?.mode ?? null,
      referenceTransformActive: this.activeReferenceTransformReferenceId !== null,
    })

    if (routing.owner === 'viewer-fly' && this.flySession !== null) {
      event.preventDefault()
      this.handleFlyKeyDown(event)
      return
    }

    if (routing.owner === 'sketch-draw' && this.geometrySketchOverlay?.mode === 'draw') {
      if (
        event.key === 'Delete' &&
        this.geometrySketchOverlay.activeTool === null &&
        (this.geometrySketchOverlay.selectedComponentIds?.length ?? 0) > 0
      ) {
        event.preventDefault()
        this.onGeometrySketchDeleteSelection?.()
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        this.onGeometrySketchFinishDraft?.()
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        this.onGeometrySketchCancelDraft?.()
        return
      }
    }

    const key = event.key.toLowerCase()
    if (
      this.sketchPlanePickOverlay?.stage === 'adjust' &&
      (key === 'w' || key === 'e' || key === 'r' || key === 'q')
    ) {
      return
    }
    if (
      this.activeReferenceTransformReferenceId !== null &&
      (key === 'w' || key === 'e' || key === 'r')
    ) {
      return
    }
    if (key === 'w') {
      event.preventDefault()
      this.setGizmoMode('translate')
      if (this.activeReferenceTransformReferenceId !== null) {
        this.onReferenceTransformModeChange?.('translate')
        this.onViewerTransformModeChange?.('translate')
      } else if (this.activeContentObjectTransformObjectId !== null) {
        this.onContentObjectTransformModeChange?.('translate')
        this.onViewerTransformModeChange?.('translate')
      }
      return
    }
    if (key === 'e') {
      event.preventDefault()
      this.setGizmoMode('rotate')
      if (this.activeReferenceTransformReferenceId !== null) {
        this.onReferenceTransformModeChange?.('rotate')
        this.onViewerTransformModeChange?.('rotate')
      } else if (this.activeContentObjectTransformObjectId !== null) {
        this.onContentObjectTransformModeChange?.('rotate')
        this.onViewerTransformModeChange?.('rotate')
      }
      return
    }
    if (key === 'r') {
      event.preventDefault()
      this.setGizmoMode('scale')
      if (this.activeReferenceTransformReferenceId !== null) {
        this.onReferenceTransformModeChange?.('scale')
        this.onViewerTransformModeChange?.('scale')
      } else if (this.activeContentObjectTransformObjectId !== null) {
        this.onContentObjectTransformModeChange?.('scale')
        this.onViewerTransformModeChange?.('scale')
      }
      return
    }
    if (key === 'q') {
      event.preventDefault()
      const nextSpace = this.gizmoSpace === 'local' ? 'world' : 'local'
      this.setGizmoSpace(nextSpace)
      if (this.activeReferenceTransformReferenceId !== null) {
        this.onReferenceTransformSpaceChange?.(nextSpace)
        this.onViewerTransformSpaceChange?.(nextSpace)
      } else if (this.activeContentObjectTransformObjectId !== null) {
        this.onContentObjectTransformSpaceChange?.(nextSpace)
        this.onViewerTransformSpaceChange?.(nextSpace)
      }
      return
    }
    if (key === 'f' || key === 'z') {
      event.preventDefault()
      this.frameSelected(this.selectedPartKey)
      return
    }
    if (key === 'a') {
      event.preventDefault()
      this.frameAll()
      return
    }
  }

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (this.flySession === null) {
      return
    }
    const flyMovementKey = this.resolveFlyMovementKey(event.key)
    if (flyMovementKey === null) {
      return
    }
    event.preventDefault()
    this.flySession.heldKeys.delete(flyMovementKey)
  }

  private readonly handleWindowBlur = (): void => {
    this.endFlySession()
  }

  private readonly handleViewerPointerCancel = (event: PointerEvent): void => {
    if (this.flySession === null || event.pointerId !== this.flySession.pointerId) {
      return
    }
    this.endFlySession({ pointerId: event.pointerId })
  }

  private readonly handleViewerContextMenu = (event: MouseEvent): void => {
    if (this.flySession !== null) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    if (!this.suppressFlyContextMenu) {
      return
    }
    this.suppressFlyContextMenu = false
    event.preventDefault()
    event.stopPropagation()
  }

  private readonly handleViewerWheel = (event: WheelEvent): void => {
    if (this.flySession === null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation?.()
    this.zoomCameraByWheelDelta(event.deltaY)
  }

  private isFlyPointerLockActive(): boolean {
    return document.pointerLockElement === this.renderer.domElement
  }

  private requestFlyPointerLock(): void {
    const requestPointerLock = this.renderer.domElement.requestPointerLock
    if (typeof requestPointerLock !== 'function') {
      return
    }

    try {
      const maybePromise = requestPointerLock.call(this.renderer.domElement) as
        | Promise<void>
        | void
      maybePromise?.catch?.(() => {})
    } catch {
      // Browsers may reject pointer lock if the gesture or permissions do not allow it.
    }
  }

  private exitFlyPointerLock(): void {
    if (!this.isFlyPointerLockActive()) {
      return
    }
    document.exitPointerLock?.()
  }

  private readonly renderLoop = (): void => {
    this.frameId = window.requestAnimationFrame(this.renderLoop)
    const dt = this.clock.getDelta()
    this.updateFlyRoll(dt)
    this.updateFlyMovement(dt)
    this.cameraController.update(dt)
    if (this.onCameraPoseChange !== null) {
      const pose = this.cameraController.getPose()
      if (
        this.lastEmittedCameraPose === null ||
        !this.areCameraPosesEquivalent(this.lastEmittedCameraPose, pose) ||
        this.lastEmittedCameraPose.projectionMode !== pose.projectionMode ||
        Math.abs(this.lastEmittedCameraPose.perspectiveFovDeg - pose.perspectiveFovDeg) > 1e-8 ||
        Math.abs(this.lastEmittedCameraPose.orthoViewHeight - pose.orthoViewHeight) > 1e-8
      ) {
        this.lastEmittedCameraPose = pose
        this.onCameraPoseChange({
          position: pose.position.clone(),
          target: pose.target.clone(),
          up: pose.up.clone(),
          projectionMode: pose.projectionMode,
          perspectiveFovDeg: pose.perspectiveFovDeg,
          orthoViewHeight: pose.orthoViewHeight,
        })
      }
    }
    this.referenceTransformMoveSnapHelper.tick(dt)
    this.referenceTransformRotateSnapHelper.tick(dt)
    const activeCamera = this.cameraController.getActiveCamera()
    this.renderer.render(this.scene, activeCamera)
    this.refreshRuntimeStats(dt)
    this.axisGizmo?.renderFromCameraQuaternion(activeCamera.quaternion)
  }

  private refreshRuntimeStats(dt: number): void {
    this.fpsSampleElapsedSec += dt
    this.fpsSampleFrameCount += 1
    this.statsSampleElapsedSec += dt

    let nextFps = this.currentRuntimeStats.fps
    if (this.fpsSampleElapsedSec >= 0.5) {
      nextFps = Math.max(1, Math.round(this.fpsSampleFrameCount / this.fpsSampleElapsedSec))
      this.fpsSampleElapsedSec = 0
      this.fpsSampleFrameCount = 0
    }

    if (this.statsSampleElapsedSec < 0.25 && this.currentRuntimeStats.triangles !== null) {
      if (nextFps !== this.currentRuntimeStats.fps) {
        this.emitRuntimeStats({
          ...this.currentRuntimeStats,
          fps: nextFps,
        })
      }
      return
    }
    this.statsSampleElapsedSec = 0

    const geometryCounts = this.collectRuntimeGeometryCounts()
    this.emitRuntimeStats({
      triangles: geometryCounts.triangles,
      lines: geometryCounts.lines,
      points: geometryCounts.points,
      fps: nextFps,
    })
  }

  private emitRuntimeStats(nextStats: ViewerRuntimeStats): void {
    if (
      this.currentRuntimeStats.triangles === nextStats.triangles &&
      this.currentRuntimeStats.lines === nextStats.lines &&
      this.currentRuntimeStats.points === nextStats.points &&
      this.currentRuntimeStats.fps === nextStats.fps
    ) {
      return
    }
    this.currentRuntimeStats = nextStats
    this.onRuntimeStatsChange?.(this.getRuntimeStats())
  }

  private collectRuntimeGeometryCounts(): { triangles: number; lines: number; points: number } {
    const totals = {
      triangles: 0,
      lines: 0,
      points: 0,
    }

    const accumulateObject = (object: Object3D, parentVisible: boolean): void => {
      const isVisible = parentVisible && object.visible
      if (!isVisible) {
        return
      }

      if (object instanceof Mesh) {
        totals.triangles += this.resolveTriangleCount(object.geometry)
      } else if (object instanceof LineSegments) {
        totals.lines += this.resolveLineSegmentCount(object.geometry)
      } else if (object instanceof Line) {
        totals.lines +=
          object instanceof LineLoop
            ? this.resolveLineLoopCount(object.geometry)
            : this.resolveLineStripCount(object.geometry)
      } else if (object instanceof Points) {
        totals.points += this.resolvePointCount(object.geometry)
      }

      for (const child of object.children) {
        accumulateObject(child, isVisible)
      }
    }

    accumulateObject(this.rootGroup, true)
    accumulateObject(this.referenceGroup, true)
    accumulateObject(this.geometrySketchOverlayGroup, true)
    accumulateObject(this.visibleGeometrySketchOverlayGroup, true)

    return totals
  }

  private resolveTriangleCount(geometry: BufferGeometry): number {
    if (geometry.index !== null) {
      return Math.floor(geometry.index.count / 3)
    }
    const positions = geometry.getAttribute('position')
    return positions === undefined ? 0 : Math.floor(positions.count / 3)
  }

  private resolveLineSegmentCount(geometry: BufferGeometry): number {
    if (geometry.index !== null) {
      return Math.floor(geometry.index.count / 2)
    }
    const positions = geometry.getAttribute('position')
    return positions === undefined ? 0 : Math.floor(positions.count / 2)
  }

  private resolveLineStripCount(geometry: BufferGeometry): number {
    const pointCount = this.resolvePointCount(geometry)
    return pointCount > 1 ? pointCount - 1 : 0
  }

  private resolveLineLoopCount(geometry: BufferGeometry): number {
    const pointCount = this.resolvePointCount(geometry)
    return pointCount > 1 ? pointCount : 0
  }

  private resolvePointCount(geometry: BufferGeometry): number {
    if (geometry.index !== null) {
      return geometry.index.count
    }
    const positions = geometry.getAttribute('position')
    return positions === undefined ? 0 : positions.count
  }

  private mapSnapDirectionToVector(dir: SnapDirection): Vector3 {
    switch (dir) {
      case '+X':
        return new Vector3(1, 0, 0)
      case '-X':
        return new Vector3(-1, 0, 0)
      case '+Y':
        return new Vector3(0, 1, 0)
      case '-Y':
        return new Vector3(0, -1, 0)
      case '+Z':
        return new Vector3(0, 0, 1)
      case '-Z':
      default:
        return new Vector3(0, 0, -1)
    }
  }

  private describeAxisGizmoTarget(target: AxisGizmoTarget): string {
    const [x, y, z] = target.direction
    if (target.kind === 'axis') {
      if (x > 0) {
        return '+X'
      }
      if (x < 0) {
        return '-X'
      }
      if (y > 0) {
        return '+Y'
      }
      if (y < 0) {
        return '-Y'
      }
      if (z > 0) {
        return '+Z'
      }
      return '-Z'
    }
    return `${target.kind} (${x},${y},${z})`
  }
}
