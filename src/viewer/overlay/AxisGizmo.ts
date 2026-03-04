import {
  AxesHelper,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

export type SnapDirection = '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z'

type PickableMesh = Mesh<SphereGeometry, MeshBasicMaterial> & {
  userData: { snapDirection: SnapDirection }
}

export class AxisGizmo {
  private readonly canvas: HTMLCanvasElement
  private readonly renderer: WebGLRenderer
  private readonly scene: Scene
  private readonly camera: PerspectiveCamera
  private readonly root: Group
  private readonly raycaster = new Raycaster()
  private readonly pointer = new Vector2()
  private readonly pickables: PickableMesh[] = []
  private readonly materials: MeshBasicMaterial[] = []
  private readonly geometries: SphereGeometry[] = []
  private onDirectionSelected: ((dir: SnapDirection) => void) | null = null
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
    this.camera.position.set(0, 0, 3.1)
    this.camera.lookAt(0, 0, 0)

    this.root = new Group()
    this.scene.add(this.root)
    this.root.add(new AxesHelper(1.35))
    this.buildClickableGizmo()

    this.canvas.addEventListener('pointerdown', this.handlePointerDown)
  }

  public setOnDirectionSelected(
    handler: ((dir: SnapDirection) => void) | null,
  ): void {
    this.onDirectionSelected = handler
  }

  public renderFromCameraQuaternion(cameraQuaternion: Quaternion): void {
    this.resizeToCanvas()
    this.root.quaternion.copy(cameraQuaternion).invert()
    this.renderer.render(this.scene, this.camera)
  }

  public dispose(): void {
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown)
    for (const material of this.materials) {
      material.dispose()
    }
    for (const geometry of this.geometries) {
      geometry.dispose()
    }
    this.renderer.dispose()
  }

  private buildClickableGizmo(): void {
    const axisGeo = new SphereGeometry(0.16, 20, 20)
    const cornerGeo = new SphereGeometry(0.095, 16, 16)
    this.geometries.push(axisGeo, cornerGeo)

    const addPickSphere = (
      position: Vector3,
      color: number,
      direction: Vector3,
      geometry: SphereGeometry,
    ): void => {
      const material = new MeshBasicMaterial({ color, depthTest: false, depthWrite: false })
      this.materials.push(material)
      const mesh = new Mesh(geometry, material) as PickableMesh
      mesh.position.copy(position)
      mesh.userData = {
        snapDirection: this.vectorToSnapDirection(direction),
      }
      this.root.add(mesh)
      this.pickables.push(mesh)
    }

    addPickSphere(new Vector3(1.2, 0, 0), 0xff3b6b, new Vector3(1, 0, 0), axisGeo)
    addPickSphere(new Vector3(-1.2, 0, 0), 0xf07a95, new Vector3(-1, 0, 0), axisGeo)
    addPickSphere(new Vector3(0, 1.2, 0), 0x2d7cff, new Vector3(0, 1, 0), axisGeo)
    addPickSphere(new Vector3(0, -1.2, 0), 0x5ea1ff, new Vector3(0, -1, 0), axisGeo)
    addPickSphere(new Vector3(0, 0, 1.2), 0x2ecc71, new Vector3(0, 0, 1), axisGeo)
    addPickSphere(new Vector3(0, 0, -1.2), 0x43d67a, new Vector3(0, 0, -1), axisGeo)

    const signs = [-1, 1] as const
    for (const sx of signs) {
      for (const sy of signs) {
        for (const sz of signs) {
          const direction = new Vector3(sx, sy, sz).normalize()
          const point = direction.clone().multiplyScalar(1.45)
          addPickSphere(point, 0xd9dbe1, direction, cornerGeo)
        }
      }
    }
  }

  private vectorToSnapDirection(dir: Vector3): SnapDirection {
    const absX = Math.abs(dir.x)
    const absY = Math.abs(dir.y)
    const absZ = Math.abs(dir.z)
    if (absX >= absY && absX >= absZ) {
      return dir.x >= 0 ? '+X' : '-X'
    }
    if (absY >= absX && absY >= absZ) {
      return dir.y >= 0 ? '+Y' : '-Y'
    }
    return dir.z >= 0 ? '+Z' : '-Z'
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

  private readonly handlePointerDown = (event: PointerEvent): void => {
    const rect = this.canvas.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      return
    }

    this.pointer.set(
      MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
      MathUtils.clamp(-(((event.clientY - rect.top) / rect.height) * 2 - 1), -1, 1),
    )
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hit = this.raycaster.intersectObjects(this.pickables, false)[0]
    const direction = (hit?.object as PickableMesh | undefined)?.userData?.snapDirection
    if (direction === undefined) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    this.onDirectionSelected?.(direction)
  }
}
