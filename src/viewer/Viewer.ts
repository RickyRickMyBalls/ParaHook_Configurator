import {
  ACESFilmicToneMapping,
  AmbientLight,
  AxesHelper,
  Box3,
  BoxGeometry,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  Light,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  NoToneMapping,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from 'three'
import type { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { AssembleResult, ViewerRenderablePart } from '../shared/buildTypes'
import {
  DEFAULT_VIEW_SETTINGS,
  type LightSpec,
  type LightType,
  type MaterialPreset,
  type ViewSettings,
} from '../shared/viewSettingsTypes'
import type { ReferenceLoadableItem } from '../app/references/referenceManifest'
import type { ReferenceTransformOverride } from '../app/references/referenceManifest'
import { appendConsoleEntry } from '../app/console/useConsoleStore'
import { loadStepReferenceObject } from './stepReferenceLoader'
import { TransformGizmo } from './gizmo/TransformGizmo'
import { AxisGizmo, type SnapDirection } from './overlay/AxisGizmo'
import { CameraController, type CameraPreset } from './scene/CameraController'

type GizmoSpace = 'local' | 'world'
type MaterialPresetId = string
type ReferenceTransformBase = ReferenceTransformOverride
type ReferenceTransformSession = {
  referenceId: string
  mode: TransformControlsMode
  space: GizmoSpace
}
type ReferenceHighlightMaterialState = {
  colorHex: number
  emissiveHex: number
  emissiveIntensity: number
}

const DEFAULT_BACKGROUND = '#0b0b0f'
const STUDIO_BACKGROUND = '#151922'
const ACTIVE_REFERENCE_HIGHLIGHT_COLOR = '#fff4c2'
const ACTIVE_REFERENCE_HIGHLIGHT_EMISSIVE = '#ffd66b'
const GRID_SIZE = 300
const GRID_MINOR_STEP = 1
const GRID_MAJOR_STEP = 10
const GRID_DOUBLE_MAJOR_STEP = 50

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

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
  private readonly camera: PerspectiveCamera
  private readonly renderer: WebGLRenderer
  private readonly clock: Clock
  private readonly rootGroup: Group
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
  private frameId: number | null = null
  private readonly partMeshes = new Map<string, Mesh>()
  private readonly referenceGroup: Group
  private readonly referenceObjects = new Map<string, Object3D>()
  private readonly referenceLoadPromises = new Map<string, Promise<void>>()
  private readonly removedReferenceIds = new Set<string>()
  private activeReferenceTransformReferenceId: string | null = null
  private cameraLockedReferenceId: string | null = null
  private cameraLockedReferenceCenter: Vector3 | null = null
  private cameraLockedReferenceMaxDim: number | null = null
  private cameraLockedReferenceTargetOffset: Vector3 | null = null
  private onReferenceTransformChange:
    | ((referenceId: string, transform: ReferenceTransformOverride) => void)
    | null = null
  private onReferenceTransformExit: (() => void) | null = null
  private onReferenceTransformModeChange: ((mode: TransformControlsMode) => void) | null = null
  private onReferenceTransformSpaceChange: ((space: GizmoSpace) => void) | null = null
  private assembledMesh: Mesh | null = null
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
    this.scene = new Scene()
    this.scene.background = new Color(DEFAULT_BACKGROUND)
    this.clock = new Clock()

    this.camera = new PerspectiveCamera(60, 1, 0.1, 1000)
    this.camera.position.set(3, 2.4, 3)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.domElement.style.display = 'block'
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.container.appendChild(this.renderer.domElement)

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

    this.rootGroup = new Group()
    this.scene.add(this.rootGroup)
    this.referenceGroup = new Group()
    this.rootGroup.add(this.referenceGroup)

    this.cameraController = new CameraController(this.camera, this.renderer.domElement)
    this.transformGizmo = new TransformGizmo(
      this.camera,
      this.renderer.domElement,
      this.cameraController.getControls(),
    )
    this.transformGizmo.setOnObjectChange(this.handleReferenceTransformObjectChange)
    this.transformGizmo.setMode(this.gizmoMode)
    this.transformGizmo.setSpace(this.gizmoSpace)
    this.syncGizmoEnabledState()
    this.scene.add(this.transformGizmo.getHelper())

    this.resizeObserver = new ResizeObserver(this.handleResize)
    this.resizeObserver.observe(this.container)

    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeyDown)

    this.applyViewSettings(this.currentViewSettings)
    this.handleResize()
    this.renderLoop()
  }

  public setParts(
    parts: ViewerRenderablePart[],
    visibility: Record<string, boolean>,
    selectedPartKey: string | null = this.selectedPartKey,
  ): void {
    this.selectedPartKey = selectedPartKey
    this.clearPartMeshes()

    let xCursor = -2
    for (const part of parts) {
      const partKeyStr = part.viewerKey
      const artifact = part.artifact
      const geometry = new BoxGeometry(
        artifact.params.length,
        artifact.params.height,
        artifact.params.width,
      )
      const material = this.resolveMaterialForPart(partKeyStr)
      const mesh = new Mesh(geometry, material)
      mesh.name = partKeyStr
      mesh.position.set(xCursor + artifact.params.length / 2, artifact.params.height / 2, 0)
      mesh.visible = visibility[partKeyStr] ?? true
      mesh.castShadow = this.currentViewSettings.shadowsEnabled
      mesh.receiveShadow = this.currentViewSettings.shadowsEnabled
      this.rootGroup.add(mesh)
      this.partMeshes.set(partKeyStr, mesh)
      xCursor += artifact.params.length + 0.2
    }

    this.refreshSelectionStyling()
    this.refreshGizmoAttachment()
  }

  public setAssembled(assembled: AssembleResult['assembled'] | null): void {
    this.clearAssembledMesh()
    if (assembled === null) {
      this.refreshGizmoAttachment()
      return
    }

    const geometry = new BoxGeometry(
      assembled.length,
      assembled.height,
      assembled.width,
    )
    const material = this.resolveMaterialForAssembled()
    const mesh = new Mesh(geometry, material)
    mesh.name = 'assembled'
    mesh.position.set(0, assembled.height / 2, 0)
    mesh.castShadow = this.currentViewSettings.shadowsEnabled
    mesh.receiveShadow = this.currentViewSettings.shadowsEnabled
    this.rootGroup.add(mesh)
    this.assembledMesh = mesh
    this.refreshGizmoAttachment()
  }

  public applyViewSettings(settings: ViewSettings): void {
    this.currentViewSettings = cloneViewSettings(settings)

    this.cameraController.setEnabled(settings.orbitEnabled)
    this.gridGroup.visible = settings.gridVisible
    this.axesHelper.visible = settings.axesVisible

    this.renderer.shadowMap.enabled = settings.shadowsEnabled
    this.renderer.toneMapping =
      settings.toneMapping === 'aces' ? ACESFilmicToneMapping : NoToneMapping
    this.renderer.toneMappingExposure = settings.exposure

    this.scene.background = new Color(
      settings.envPreset === 'studio' ? STUDIO_BACKGROUND : DEFAULT_BACKGROUND,
    )

    this.setAxisOverlayEnabled(settings.axisOverlayEnabled)
    this.applyLights(settings.lighting.lights)
    this.applyMaterialSettings(settings.materials)
    this.applyShadowFlags()
    this.refreshSelectionStyling()
  }

  public setCameraPreset(preset: CameraPreset): void {
    this.cameraController.setPreset(preset)
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
        object.name = reference.referenceId
        this.applyReferenceObjectDefaults(object)
        this.referenceObjects.set(reference.referenceId, object)
        this.refreshReferenceHighlightStyling()
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
      return
    }
    if (object.parent === this.referenceGroup) {
      this.referenceGroup.remove(object)
    }
    object.visible = false
    this.refreshReferenceHighlightStyling()
    this.refreshGizmoAttachment()
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
    this.refreshReferenceHighlightStyling()
    this.refreshGizmoAttachment()
  }

  public setReferenceTransformSession(session: ReferenceTransformSession | null): void {
    this.activeReferenceTransformReferenceId = session?.referenceId ?? null
    if (session !== null) {
      this.gizmoMode = session.mode
      this.gizmoSpace = session.space
      this.transformGizmo.setMode(session.mode)
      this.transformGizmo.setSpace(session.space)
    }
    this.syncGizmoEnabledState()
    this.refreshReferenceHighlightStyling()
    this.refreshGizmoAttachment()
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

  public setOnReferenceTransformChange(
    handler: ((referenceId: string, transform: ReferenceTransformOverride) => void) | null,
  ): void {
    this.onReferenceTransformChange = handler
  }

  public setOnReferenceTransformExit(handler: (() => void) | null): void {
    this.onReferenceTransformExit = handler
  }

  public setOnReferenceTransformModeChange(
    handler: ((mode: TransformControlsMode) => void) | null,
  ): void {
    this.onReferenceTransformModeChange = handler
  }

  public setOnReferenceTransformSpaceChange(handler: ((space: GizmoSpace) => void) | null): void {
    this.onReferenceTransformSpaceChange = handler
  }

  public beginTemporaryOrbitDrag(startClientX: number, startClientY: number): void {
    this.cameraController.beginTemporaryOrbitDrag(startClientX, startClientY)
  }

  public updateTemporaryOrbitDrag(clientX: number, clientY: number): void {
    this.cameraController.updateTemporaryOrbitDrag(clientX, clientY)
  }

  public endTemporaryOrbitDrag(): void {
    this.cameraController.endTemporaryOrbitDrag()
  }

  public frameAll(): void {
    this.cameraController.frameAll(this.rootGroup)
    appendConsoleEntry({
      layer: 'View',
      text: 'Frame all',
      source: 'viewer',
      severity: 'info',
    })
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
    this.cameraController.frameObject(obj)
    appendConsoleEntry({
      layer: 'View',
      text: `Zoom selected: ${partId}`,
      source: 'viewer',
      severity: 'info',
    })
  }

  public frameReference(referenceId: string): void {
    const obj = this.referenceObjects.get(referenceId)
    if (obj === undefined) {
      this.frameAll()
      return
    }
    this.cameraController.frameObject(obj)
    appendConsoleEntry({
      layer: 'View',
      text: `Zoom reference: ${referenceId}`,
      source: 'viewer',
      severity: 'info',
    })
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
  }

  public setGizmoSnap(opts: {
    translateMm?: number
    rotateDeg?: number
    scale?: number
  }): void {
    this.transformGizmo.setSnap(opts.translateMm, opts.rotateDeg, opts.scale)
  }

  public setSelectedPart(partId: string | null): void {
    this.selectedPartKey = partId
    this.refreshSelectionStyling()
    this.refreshGizmoAttachment()
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

  public dispose(): void {
    if (this.frameId !== null) {
      window.cancelAnimationFrame(this.frameId)
      this.frameId = null
    }

    this.resizeObserver.disconnect()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeyDown)

    this.clearPartMeshes()
    this.clearReferenceObjects()
    this.clearAssembledMesh()
    this.clearAllLights()

    for (const material of this.materialCacheByPresetId.values()) {
      material.dispose()
    }
    this.materialCacheByPresetId.clear()
    this.assignedPresetByPartKey.clear()

    this.transformGizmo.dispose()
    this.axisGizmo?.dispose()
    this.axisGizmo = null

    this.renderer.dispose()
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
    material.wireframe = this.currentViewSettings.wireframe
    material.needsUpdate = true
  }

  private applyMaterialAssignmentsToScene(): void {
    for (const [partKeyStr, mesh] of this.partMeshes.entries()) {
      mesh.material = this.resolveMaterialForPart(partKeyStr)
    }

    if (this.assembledMesh !== null) {
      this.assembledMesh.material = this.resolveMaterialForAssembled()
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

  private resolveMaterialForAssembled(): MeshStandardMaterial {
    const selected = this.materialCacheByPresetId.get(
      this.currentViewSettings.materials.selectedPresetId,
    )
    if (selected !== undefined) {
      return selected
    }

    const first = this.materialCacheByPresetId.values().next().value as
      | MeshStandardMaterial
      | undefined
    if (first !== undefined) {
      return first
    }

    const material = new MeshStandardMaterial({ color: '#31a36a' })
    material.wireframe = this.currentViewSettings.wireframe
    this.materialCacheByPresetId.set('fallback_runtime', material)
    return material
  }

  private applyShadowFlags(): void {
    for (const mesh of this.partMeshes.values()) {
      mesh.castShadow = this.currentViewSettings.shadowsEnabled
      mesh.receiveShadow = this.currentViewSettings.shadowsEnabled
    }

    if (this.assembledMesh !== null) {
      this.assembledMesh.castShadow = this.currentViewSettings.shadowsEnabled
      this.assembledMesh.receiveShadow = this.currentViewSettings.shadowsEnabled
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
    for (const mesh of this.partMeshes.values()) {
      this.rootGroup.remove(mesh)
      mesh.geometry.dispose()
    }
    this.partMeshes.clear()
  }

  private clearReferenceObjects(): void {
    for (const object of this.referenceObjects.values()) {
      if (object.parent === this.referenceGroup) {
        this.referenceGroup.remove(object)
      }
      this.disposeObjectTree(object)
    }
    this.referenceObjects.clear()
    this.referenceLoadPromises.clear()
    this.removedReferenceIds.clear()
  }

  private clearAssembledMesh(): void {
    if (this.assembledMesh === null) {
      return
    }

    this.rootGroup.remove(this.assembledMesh)
    this.assembledMesh.geometry.dispose()
    this.assembledMesh = null
  }

  private applyReferenceObjectDefaults(object: Object3D): void {
    object.visible = false
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
    })
  }

  private refreshReferenceHighlightStyling(): void {
    const highlightTint = new Color(ACTIVE_REFERENCE_HIGHLIGHT_COLOR)
    const highlightEmissive = new Color(ACTIVE_REFERENCE_HIGHLIGHT_EMISSIVE)
    for (const [referenceId, object] of this.referenceObjects.entries()) {
      const isHighlighted =
        referenceId === this.activeReferenceTransformReferenceId && object.visible
      object.traverse((child) => {
        if (!(child instanceof Mesh)) {
          return
        }
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        for (const material of materials) {
          if (!(material instanceof MeshStandardMaterial)) {
            continue
          }
          const storedBase =
            material.userData.referenceHighlightBase as ReferenceHighlightMaterialState | undefined
          const baseState: ReferenceHighlightMaterialState =
            storedBase ?? {
              colorHex: material.color.getHex(),
              emissiveHex: material.emissive.getHex(),
              emissiveIntensity: material.emissiveIntensity,
            }
          if (storedBase === undefined) {
            material.userData.referenceHighlightBase = baseState
          }
          material.color.setHex(baseState.colorHex)
          material.emissive.setHex(baseState.emissiveHex)
          material.emissiveIntensity = baseState.emissiveIntensity
          if (isHighlighted) {
            material.color.lerp(highlightTint, 0.18)
            material.emissive.copy(highlightEmissive)
            material.emissiveIntensity = Math.max(baseState.emissiveIntensity, 0.9)
          }
          material.needsUpdate = true
        }
      })
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
    for (const [partKeyStr, mesh] of this.partMeshes.entries()) {
      mesh.scale.setScalar(partKeyStr === this.selectedPartKey ? 1.05 : 1)
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

    if (!this.gizmoEnabled || this.selectedPartKey === null) {
      this.transformGizmo.detach()
      return
    }

    const selected = this.partMeshes.get(this.selectedPartKey)
    if (selected === undefined || !selected.visible) {
      this.transformGizmo.detach()
      return
    }

    this.transformGizmo.attach(selected)
  }

  private syncGizmoEnabledState(): void {
    this.transformGizmo.setEnabled(this.gizmoEnabled || this.activeReferenceTransformReferenceId !== null)
  }

  private requestReferenceTransformExit(): void {
    if (this.activeReferenceTransformReferenceId === null) {
      return
    }
    this.activeReferenceTransformReferenceId = null
    this.syncGizmoEnabledState()
    this.refreshReferenceHighlightStyling()
    this.refreshGizmoAttachment()
    this.onReferenceTransformExit?.()
  }

  private readonly handleReferenceTransformObjectChange = (object: Object3D): void => {
    if (this.activeReferenceTransformReferenceId === null) {
      return
    }
    const activeObject = this.referenceObjects.get(this.activeReferenceTransformReferenceId)
    if (activeObject === undefined || activeObject !== object) {
      return
    }
    this.onReferenceTransformChange?.(
      this.activeReferenceTransformReferenceId,
      this.readReferenceTransformOverride(object),
    )
    if (this.cameraLockedReferenceId === this.activeReferenceTransformReferenceId) {
      this.syncLockedReferenceCamera(object)
    }
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
    this.axisGizmo.setOnDirectionSelected((dir) => {
      this.snapCameraToDirection(dir)
    })
  }

  private readonly handleResize = (): void => {
    const width = Math.max(this.container.clientWidth, 1)
    const height = Math.max(this.container.clientHeight, 1)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) {
      return
    }
    const target = event.target as HTMLElement | null
    if (
      target !== null &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable)
    ) {
      return
    }

    const key = event.key.toLowerCase()
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
      }
      return
    }
    if (key === 'e') {
      event.preventDefault()
      this.setGizmoMode('rotate')
      if (this.activeReferenceTransformReferenceId !== null) {
        this.onReferenceTransformModeChange?.('rotate')
      }
      return
    }
    if (key === 'r') {
      event.preventDefault()
      this.setGizmoMode('scale')
      if (this.activeReferenceTransformReferenceId !== null) {
        this.onReferenceTransformModeChange?.('scale')
      }
      return
    }
    if (key === 'q') {
      event.preventDefault()
      const nextSpace = this.gizmoSpace === 'local' ? 'world' : 'local'
      this.setGizmoSpace(nextSpace)
      if (this.activeReferenceTransformReferenceId !== null) {
        this.onReferenceTransformSpaceChange?.(nextSpace)
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
    if (event.key === 'Escape') {
      event.preventDefault()
      if (this.activeReferenceTransformReferenceId !== null) {
        this.requestReferenceTransformExit()
        return
      }
      this.transformGizmo.detach()
    }
  }

  private readonly renderLoop = (): void => {
    this.frameId = window.requestAnimationFrame(this.renderLoop)
    const dt = this.clock.getDelta()
    this.cameraController.update(dt)
    this.renderer.render(this.scene, this.camera)
    this.axisGizmo?.renderFromCameraQuaternion(this.camera.quaternion)
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
}
