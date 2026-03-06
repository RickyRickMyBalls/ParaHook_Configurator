import {
  ACESFilmicToneMapping,
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Clock,
  Color,
  DirectionalLight,
  Group,
  GridHelper,
  HemisphereLight,
  Light,
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
import type { AssembleResult, ViewerRenderablePart } from '../shared/buildTypes'
import {
  DEFAULT_VIEW_SETTINGS,
  type LightSpec,
  type LightType,
  type MaterialPreset,
  type ViewSettings,
} from '../shared/viewSettingsTypes'
import { TransformGizmo } from './gizmo/TransformGizmo'
import { AxisGizmo, type SnapDirection } from './overlay/AxisGizmo'
import { CameraController, type CameraPreset } from './scene/CameraController'

type GizmoSpace = 'local' | 'world'
type MaterialPresetId = string

const DEFAULT_BACKGROUND = '#0b0b0f'
const STUDIO_BACKGROUND = '#151922'

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

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
  private readonly gridHelper: GridHelper
  private readonly axesHelper: AxesHelper
  private readonly cameraController: CameraController
  private readonly transformGizmo: TransformGizmo
  private axisGizmo: AxisGizmo | null = null
  private axisOverlayCanvas: HTMLCanvasElement | null = null
  private axisOverlayEnabled = true
  private frameId: number | null = null
  private readonly partMeshes = new Map<string, Mesh>()
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

    this.gridHelper = new GridHelper(10, 20, 0xc8c8c8, 0xe1e1e1)
    this.scene.add(this.gridHelper)

    this.axesHelper = new AxesHelper(1.5)
    this.axesHelper.visible = false
    this.scene.add(this.axesHelper)

    this.rootGroup = new Group()
    this.scene.add(this.rootGroup)

    this.cameraController = new CameraController(this.camera, this.renderer.domElement)
    this.transformGizmo = new TransformGizmo(
      this.camera,
      this.renderer.domElement,
      this.cameraController.getControls(),
    )
    this.transformGizmo.setMode(this.gizmoMode)
    this.transformGizmo.setSpace(this.gizmoSpace)
    this.transformGizmo.setEnabled(this.gizmoEnabled)
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
    this.gridHelper.visible = settings.gridVisible
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
  }

  public frameAll(): void {
    this.cameraController.frameAll(this.rootGroup)
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
  }

  public setGizmoEnabled(enabled: boolean): void {
    this.gizmoEnabled = enabled
    this.transformGizmo.setEnabled(enabled)
    this.refreshGizmoAttachment()
  }

  public setGizmoMode(mode: TransformControlsMode): void {
    this.gizmoMode = mode
    this.transformGizmo.setMode(mode)
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

  private clearAssembledMesh(): void {
    if (this.assembledMesh === null) {
      return
    }

    this.rootGroup.remove(this.assembledMesh)
    this.assembledMesh.geometry.dispose()
    this.assembledMesh = null
  }

  private refreshSelectionStyling(): void {
    for (const [partKeyStr, mesh] of this.partMeshes.entries()) {
      mesh.scale.setScalar(partKeyStr === this.selectedPartKey ? 1.05 : 1)
    }
  }

  private refreshGizmoAttachment(): void {
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
    if (key === 'w') {
      event.preventDefault()
      this.setGizmoMode('translate')
      return
    }
    if (key === 'e') {
      event.preventDefault()
      this.setGizmoMode('rotate')
      return
    }
    if (key === 'r') {
      event.preventDefault()
      this.setGizmoMode('scale')
      return
    }
    if (key === 'q') {
      event.preventDefault()
      this.setGizmoSpace(this.gizmoSpace === 'local' ? 'world' : 'local')
      return
    }
    if (key === 'f') {
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
