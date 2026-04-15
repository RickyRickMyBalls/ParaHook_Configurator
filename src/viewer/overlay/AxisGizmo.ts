import {
  AxesHelper,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import {
  DEFAULT_AXIS_OVERLAY_STYLE_SETTINGS,
  type AxisOverlayLabelSize,
  type AxisOverlayStyleSettings,
} from '../../shared/viewSettingsTypes'

export type SnapDirection = '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z'
export type AxisGizmoTarget = {
  kind: 'axis' | 'corner' | 'edge'
  direction: readonly [number, number, number]
}

type PickableMesh = Mesh<SphereGeometry, MeshBasicMaterial> & {
  userData: { orientationTarget: AxisGizmoTarget }
}
type PickableLine = LineSegments<BufferGeometry, LineBasicMaterial> & {
  userData: { orientationTarget: AxisGizmoTarget }
}
type PickableObject = PickableMesh | PickableLine
type Anchor = {
  key: string
  point: Vector3
  target: AxisGizmoTarget
}

const MIN_GIZMO_CAMERA_DISTANCE = 2.4
const MAX_GIZMO_CAMERA_DISTANCE = 5.2
const ORBIT_DRAG_THRESHOLD_PX = 4

type PendingPointerInteraction = {
  pointerId: number
  anchorClientX: number
  anchorClientY: number
  target: AxisGizmoTarget | null
  orbitDragStarted: boolean
}

export class AxisGizmo {
  private readonly canvas: HTMLCanvasElement
  private readonly renderer: WebGLRenderer
  private readonly scene: Scene
  private readonly camera: PerspectiveCamera
  private readonly root: Group
  private readonly raycaster = new Raycaster()
  private readonly pointer = new Vector2()
  private readonly pickables: PickableObject[] = []
  private readonly materials: Array<MeshBasicMaterial | LineBasicMaterial | SpriteMaterial> = []
  private readonly geometries: Array<SphereGeometry | BufferGeometry> = []
  private readonly textures: CanvasTexture[] = []
  private readonly sphereMeshes: Mesh<SphereGeometry, MeshBasicMaterial>[] = []
  private readonly edgeLines: PickableLine[] = []
  private readonly labelSprites: Sprite[] = []
  private onTargetSelected: ((target: AxisGizmoTarget) => void) | null = null
  private onOrbitDragStart: ((clientX: number, clientY: number) => void) | null = null
  private onOrbitDragMove: ((clientX: number, clientY: number) => void) | null = null
  private onOrbitDragEnd: (() => void) | null = null
  private connectorMaterial: LineBasicMaterial | null = null
  private hoveredEdgeLine: PickableLine | null = null
  private pendingPointerInteraction: PendingPointerInteraction | null = null
  private style: AxisOverlayStyleSettings = { ...DEFAULT_AXIS_OVERLAY_STYLE_SETTINGS }
  private width = 0
  private height = 0

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setClearColor(new Color('#000000'), 0)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    this.scene = new Scene()
    this.camera = new PerspectiveCamera(50, 1, 0.1, 10)
    this.camera.position.set(0, 0, DEFAULT_AXIS_OVERLAY_STYLE_SETTINGS.cameraDistance)
    this.camera.lookAt(0, 0, 0)
    this.raycaster.params.Line.threshold = 0.12

    this.root = new Group()
    this.scene.add(this.root)
    this.root.add(new AxesHelper(1.35))
    this.buildClickableGizmo()
    this.applyStyle()
  }

  public setOnTargetSelected(
    handler: ((target: AxisGizmoTarget) => void) | null,
  ): void {
    this.onTargetSelected = handler
  }

  public setOnOrbitDragStart(handler: ((clientX: number, clientY: number) => void) | null): void {
    this.onOrbitDragStart = handler
  }

  public setOnOrbitDragMove(handler: ((clientX: number, clientY: number) => void) | null): void {
    this.onOrbitDragMove = handler
  }

  public setOnOrbitDragEnd(handler: (() => void) | null): void {
    this.onOrbitDragEnd = handler
  }

  public setStyle(nextStyle: AxisOverlayStyleSettings): void {
    this.style = {
      ...nextStyle,
    }
    this.applyStyle()
  }

  public renderFromCameraQuaternion(cameraQuaternion: Quaternion): void {
    this.resizeToCanvas()
    this.root.quaternion.copy(cameraQuaternion).invert()
    this.renderer.render(this.scene, this.camera)
  }

  public beginPointerInteraction(pointerId: number, clientX: number, clientY: number): void {
    this.pendingPointerInteraction = {
      pointerId,
      anchorClientX: clientX,
      anchorClientY: clientY,
      target: this.resolvePointerTarget(clientX, clientY),
      orbitDragStarted: false,
    }
    this.setHoveredEdgeLine(null)
  }

  public updatePointerInteraction(pointerId: number, clientX: number, clientY: number): void {
    if (this.pendingPointerInteraction === null || this.pendingPointerInteraction.pointerId !== pointerId) {
      return
    }
    if (!this.pendingPointerInteraction.orbitDragStarted) {
      const hasExceededThreshold =
        Math.max(
          Math.abs(clientX - this.pendingPointerInteraction.anchorClientX),
          Math.abs(clientY - this.pendingPointerInteraction.anchorClientY),
        ) >= ORBIT_DRAG_THRESHOLD_PX
      if (hasExceededThreshold) {
        this.pendingPointerInteraction.orbitDragStarted = true
        this.setHoveredEdgeLine(null)
        this.onOrbitDragStart?.(
          this.pendingPointerInteraction.anchorClientX,
          this.pendingPointerInteraction.anchorClientY,
        )
        this.onOrbitDragMove?.(clientX, clientY)
      }
      return
    }
    this.onOrbitDragMove?.(clientX, clientY)
  }

  public endPointerInteraction(pointerId: number): void {
    if (this.pendingPointerInteraction === null || this.pendingPointerInteraction.pointerId !== pointerId) {
      return
    }
    if (this.pendingPointerInteraction.orbitDragStarted) {
      this.onOrbitDragEnd?.()
    } else if (this.pendingPointerInteraction.target !== null) {
      this.onTargetSelected?.(this.pendingPointerInteraction.target)
    }
    this.pendingPointerInteraction = null
  }

  public cancelPointerInteraction(pointerId: number): void {
    if (this.pendingPointerInteraction === null || this.pendingPointerInteraction.pointerId !== pointerId) {
      return
    }
    if (this.pendingPointerInteraction.orbitDragStarted) {
      this.onOrbitDragEnd?.()
    }
    this.pendingPointerInteraction = null
  }

  public updatePointerHover(clientX: number, clientY: number): void {
    if (this.pendingPointerInteraction !== null) {
      return
    }
    const hitObject = this.resolvePointerHitObject(clientX, clientY)
    if (hitObject === undefined || hitObject.userData.orientationTarget.kind !== 'edge') {
      this.setHoveredEdgeLine(null)
      return
    }
    this.setHoveredEdgeLine(hitObject as PickableLine)
  }

  public clearPointerHover(): void {
    if (this.pendingPointerInteraction !== null) {
      return
    }
    this.setHoveredEdgeLine(null)
  }

  public dispose(): void {
    for (const material of this.materials) {
      material.dispose()
    }
    for (const geometry of this.geometries) {
      geometry.dispose()
    }
    for (const texture of this.textures) {
      texture.dispose()
    }
    this.renderer.dispose()
  }

  private buildClickableGizmo(): void {
    const axisGeo = new SphereGeometry(0.16, 20, 20)
    const cornerGeo = new SphereGeometry(0.095, 16, 16)
    this.geometries.push(axisGeo, cornerGeo)
    const axisAnchors: Anchor[] = []
    const cornerAnchors: Anchor[] = []

    const addPickSphere = (
      anchor: Anchor,
      color: number,
      geometry: SphereGeometry,
    ): void => {
      const material = new MeshBasicMaterial({ color, depthTest: false, depthWrite: false })
      this.materials.push(material)
      const mesh = new Mesh(geometry, material) as PickableMesh
      mesh.position.copy(anchor.point)
      mesh.userData = {
        orientationTarget: anchor.target,
      }
      this.root.add(mesh)
      this.pickables.push(mesh)
      this.sphereMeshes.push(mesh)
    }

    const axisAnchorDefs: Array<{
      point: Vector3
      color: number
      direction: AxisGizmoTarget['direction']
      label: string
    }> = [
      { point: new Vector3(1.2, 0, 0), color: 0xff3b6b, direction: [1, 0, 0], label: 'X' },
      { point: new Vector3(-1.2, 0, 0), color: 0xf07a95, direction: [-1, 0, 0], label: '-X' },
      { point: new Vector3(0, 1.2, 0), color: 0x2d7cff, direction: [0, 1, 0], label: 'Y' },
      { point: new Vector3(0, -1.2, 0), color: 0x5ea1ff, direction: [0, -1, 0], label: '-Y' },
      { point: new Vector3(0, 0, 1.2), color: 0x2ecc71, direction: [0, 0, 1], label: 'Z' },
      { point: new Vector3(0, 0, -1.2), color: 0x43d67a, direction: [0, 0, -1], label: '-Z' },
    ]
    for (const axisAnchorDef of axisAnchorDefs) {
      const axisAnchor: Anchor = {
        key: this.anchorKey('axis', axisAnchorDef.direction),
        point: axisAnchorDef.point.clone(),
        target: {
          kind: 'axis',
          direction: axisAnchorDef.direction,
        },
      }
      axisAnchors.push(axisAnchor)
      addPickSphere(axisAnchor, axisAnchorDef.color, axisGeo)
      this.addAxisLabel(axisAnchorDef.label, axisAnchorDef.point, axisAnchorDef.color)
    }

    const signs = [-1, 1] as const
    for (const sx of signs) {
      for (const sy of signs) {
        for (const sz of signs) {
          const direction = new Vector3(sx, sy, sz).normalize()
          const cornerAnchor: Anchor = {
            key: this.anchorKey('corner', [sx, sy, sz]),
            point: direction.clone().multiplyScalar(1.45),
            target: {
              kind: 'corner',
              direction: [sx, sy, sz],
            },
          }
          cornerAnchors.push(cornerAnchor)
          addPickSphere(cornerAnchor, 0xd9dbe1, cornerGeo)
        }
      }
    }

    this.addConnectorCage(axisAnchors, cornerAnchors)
  }

  private addConnectorCage(axisAnchors: Anchor[], cornerAnchors: Anchor[]): void {
    const connectorMaterial = new LineBasicMaterial({
      color: 0xb8bec8,
      transparent: true,
      opacity: 0.18,
      depthTest: false,
      depthWrite: false,
    })
    this.connectorMaterial = connectorMaterial
    this.materials.push(connectorMaterial)

    const cornerByKey = new Map<string, Anchor>()
    for (const cornerAnchor of cornerAnchors) {
      cornerByKey.set(cornerAnchor.key, cornerAnchor)
    }

    const outerEdgePairKeys = new Set<string>()
    let outerEdgeIndex = 0
    const addOuterEdge = (
      from: readonly [number, number, number],
      to: readonly [number, number, number],
      direction: readonly [number, number, number],
    ): void => {
      const fromKey = this.anchorKey('corner', from)
      const toKey = this.anchorKey('corner', to)
      const start = cornerByKey.get(fromKey)
      const end = cornerByKey.get(toKey)
      if (start === undefined || end === undefined) {
        return
      }
      outerEdgePairKeys.add(this.pairKey(start.key, end.key))
      const geometry = new BufferGeometry().setFromPoints([start.point.clone(), end.point.clone()])
      this.geometries.push(geometry)
      const edgeMaterial = new LineBasicMaterial({
        color: 0xb8bec8,
        transparent: true,
        opacity: 0.18,
        depthTest: false,
        depthWrite: false,
      })
      this.materials.push(edgeMaterial)
      const edgeLine = new LineSegments(geometry, edgeMaterial) as PickableLine
      edgeLine.name = `axisGizmoOuterEdgeLine_${outerEdgeIndex}`
      edgeLine.renderOrder = -2
      edgeLine.userData = {
        orientationTarget: {
          kind: 'edge',
          direction,
        },
      }
      outerEdgeIndex += 1
      this.root.add(edgeLine)
      this.pickables.push(edgeLine)
      this.edgeLines.push(edgeLine)
    }

    for (const sy of [-1, 1] as const) {
      for (const sz of [-1, 1] as const) {
        addOuterEdge([-1, sy, sz], [1, sy, sz], [0, sy, sz])
      }
    }
    for (const sx of [-1, 1] as const) {
      for (const sz of [-1, 1] as const) {
        addOuterEdge([sx, -1, sz], [sx, 1, sz], [sx, 0, sz])
      }
    }
    for (const sx of [-1, 1] as const) {
      for (const sy of [-1, 1] as const) {
        addOuterEdge([sx, sy, -1], [sx, sy, 1], [sx, sy, 0])
      }
    }

    const anchors = [...axisAnchors, ...cornerAnchors]
    const connectorPoints: Vector3[] = []
    for (let anchorIndex = 0; anchorIndex < anchors.length; anchorIndex += 1) {
      for (
        let otherAnchorIndex = anchorIndex + 1;
        otherAnchorIndex < anchors.length;
        otherAnchorIndex += 1
      ) {
        const anchor = anchors[anchorIndex]
        const otherAnchor = anchors[otherAnchorIndex]
        if (outerEdgePairKeys.has(this.pairKey(anchor.key, otherAnchor.key))) {
          continue
        }
        connectorPoints.push(anchor.point.clone(), otherAnchor.point.clone())
      }
    }

    const geometry = new BufferGeometry().setFromPoints(connectorPoints)
    this.geometries.push(geometry)

    const connectorCage = new LineSegments(geometry, connectorMaterial)
    connectorCage.name = 'axisGizmoConnectorCage'
    connectorCage.renderOrder = -3
    this.root.add(connectorCage)
  }

  private addAxisLabel(text: string, anchorPoint: Vector3, color: number): void {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const context = canvas.getContext('2d')
    if (context !== null) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.font = '700 72px Arial'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.lineJoin = 'round'
      context.lineWidth = 12
      context.strokeStyle = 'rgba(11, 11, 15, 0.82)'
      context.strokeText(text, canvas.width / 2, canvas.height / 2)
      context.fillStyle = `#${color.toString(16).padStart(6, '0')}`
      context.fillText(text, canvas.width / 2, canvas.height / 2)
    }

    const texture = new CanvasTexture(canvas)
    texture.needsUpdate = true
    this.textures.push(texture)

    const material = new SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    this.materials.push(material)

    const sprite = new Sprite(material)
    sprite.name = `axisGizmoLabel_${text}`
    sprite.position.copy(anchorPoint.clone().normalize().multiplyScalar(1.82))
    sprite.renderOrder = 4
    this.labelSprites.push(sprite)
    this.root.add(sprite)
  }

  private applyStyle(): void {
    const lineOpacityMain = MathUtils.clamp(this.style.mainLineOpacity, 0, 1)
    const lineOpacitySecondary = MathUtils.clamp(this.style.secondaryLineOpacity, 0, 1)
    const sphereScale = MathUtils.clamp(this.style.sphereScale, 0.5, 2)
    const cameraDistance = MathUtils.clamp(
      this.style.cameraDistance,
      MIN_GIZMO_CAMERA_DISTANCE,
      MAX_GIZMO_CAMERA_DISTANCE,
    )
    const labelScale = this.resolveLabelScale(this.style.labelSize)
    const hoveredEdgeOpacity = this.resolveHoveredEdgeOpacity(lineOpacityMain)

    this.camera.position.set(0, 0, cameraDistance)
    this.camera.lookAt(0, 0, 0)

    for (const edgeLine of this.edgeLines) {
      const isHovered = this.hoveredEdgeLine === edgeLine
      edgeLine.material.opacity = isHovered ? hoveredEdgeOpacity : lineOpacityMain
      edgeLine.material.transparent = edgeLine.material.opacity < 1
    }
    if (this.connectorMaterial !== null) {
      this.connectorMaterial.opacity = lineOpacitySecondary
      this.connectorMaterial.transparent = lineOpacitySecondary < 1
    }

    for (const sphereMesh of this.sphereMeshes) {
      sphereMesh.scale.setScalar(sphereScale)
    }
    for (const labelSprite of this.labelSprites) {
      const labelText = labelSprite.name.replace('axisGizmoLabel_', '')
      const widthMultiplier = labelText.length > 1 ? 1.45 : 1
      labelSprite.visible = this.style.labelsVisible
      labelSprite.scale.set(labelScale * widthMultiplier, labelScale, 1)
    }
  }

  private resizeToCanvas(): void {
    const nextWidth = Math.max(Math.floor(this.canvas.clientWidth), 1)
    const nextHeight = Math.max(Math.floor(this.canvas.clientHeight), 1)
    if (nextWidth === this.width && nextHeight === this.height) {
      return
    }
    this.width = nextWidth
    this.height = nextHeight
    this.camera.aspect = nextWidth / nextHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(nextWidth, nextHeight, false)
  }

  private resolvePointerTarget(clientX: number, clientY: number): AxisGizmoTarget | null {
    const hitObject = this.resolvePointerHitObject(clientX, clientY)
    return hitObject?.userData.orientationTarget ?? null
  }

  private resolvePointerHitObject(clientX: number, clientY: number): PickableObject | undefined {
    const rect = this.canvas.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      return undefined
    }

    this.resizeToCanvas()
    this.pointer.set(
      MathUtils.clamp(((clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
      MathUtils.clamp(-(((clientY - rect.top) / rect.height) * 2 - 1), -1, 1),
    )
    this.scene.updateMatrixWorld(true)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hit = this.raycaster.intersectObjects(this.pickables, false)[0]
    return hit?.object as PickableObject | undefined
  }

  private anchorKey(
    kind: AxisGizmoTarget['kind'],
    direction: readonly [number, number, number],
  ): string {
    return `${kind}_${direction[0]}_${direction[1]}_${direction[2]}`
  }

  private resolveLabelScale(size: AxisOverlayLabelSize): number {
    if (size === 'small') {
      return 0.38
    }
    if (size === 'large') {
      return 0.66
    }
    return 0.5
  }

  private resolveHoveredEdgeOpacity(baseOpacity: number): number {
    return MathUtils.clamp(Math.max(baseOpacity + 0.34, 0.72), 0, 1)
  }

  private setHoveredEdgeLine(nextHoveredEdgeLine: PickableLine | null): void {
    if (this.hoveredEdgeLine === nextHoveredEdgeLine) {
      return
    }
    this.hoveredEdgeLine = nextHoveredEdgeLine
    this.applyStyle()
  }

  private pairKey(left: string, right: string): string {
    return left < right ? `${left}|${right}` : `${right}|${left}`
  }

}
