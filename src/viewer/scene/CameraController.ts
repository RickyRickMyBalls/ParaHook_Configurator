import { Box3, MathUtils, Object3D, PerspectiveCamera, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export type CameraPreset = 'iso' | 'top' | 'front' | 'left' | 'right'

export class CameraController {
  private readonly camera: PerspectiveCamera
  private readonly controls: OrbitControls
  private readonly tmpSize = new Vector3()
  private readonly tmpCenter = new Vector3()
  private readonly tmpDirection = new Vector3()
  private temporaryOrbitDrag:
    | {
        lastClientX: number
        lastClientY: number
      }
    | null = null

  public constructor(camera: PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera
    this.controls = new OrbitControls(camera, domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.screenSpacePanning = false
    this.controls.rotateSpeed = 0.8
    this.controls.zoomSpeed = 1
    this.controls.panSpeed = 0.8
  }

  public getControls(): OrbitControls {
    return this.controls
  }

  public update(dt: number): void {
    this.controls.update(dt)
  }

  public setEnabled(enabled: boolean): void {
    this.controls.enabled = enabled
  }

  public beginTemporaryOrbitDrag(startClientX: number, startClientY: number): void {
    this.temporaryOrbitDrag = {
      lastClientX: startClientX,
      lastClientY: startClientY,
    }
  }

  public updateTemporaryOrbitDrag(clientX: number, clientY: number): void {
    if (this.temporaryOrbitDrag === null) {
      return
    }
    const deltaX = clientX - this.temporaryOrbitDrag.lastClientX
    const deltaY = clientY - this.temporaryOrbitDrag.lastClientY
    if (deltaX === 0 && deltaY === 0) {
      return
    }

    const elementHeight = Math.max(this.controls.domElement?.clientHeight ?? 1, 1)
    const twoPi = Math.PI * 2
    this.controls.rotateLeft((twoPi * deltaX) / elementHeight)
    this.controls.rotateUp((twoPi * deltaY) / elementHeight)
    this.controls.update()

    this.temporaryOrbitDrag = {
      lastClientX: clientX,
      lastClientY: clientY,
    }
  }

  public endTemporaryOrbitDrag(): void {
    this.temporaryOrbitDrag = null
  }

  public frameBox(box3: Box3): void {
    if (box3.isEmpty()) {
      return
    }

    box3.getSize(this.tmpSize)
    box3.getCenter(this.tmpCenter)
    const maxDim = Math.max(this.tmpSize.x, this.tmpSize.y, this.tmpSize.z, 0.001)
    const verticalFov = MathUtils.degToRad(this.camera.fov)
    const fitHeightDistance = maxDim / (2 * Math.tan(verticalFov / 2))
    const fitWidthDistance = fitHeightDistance / Math.max(this.camera.aspect, 0.01)
    const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance)

    this.tmpDirection
      .copy(this.camera.position)
      .sub(this.controls.target)
      .normalize()
    if (!Number.isFinite(this.tmpDirection.lengthSq()) || this.tmpDirection.lengthSq() < 1e-8) {
      this.tmpDirection.set(1, 1, 1).normalize()
    }

    this.controls.target.copy(this.tmpCenter)
    this.camera.position.copy(this.tmpCenter).addScaledVector(this.tmpDirection, distance)
    this.camera.near = Math.max(distance / 100, 0.01)
    this.camera.far = Math.max(distance * 100, 100)
    this.camera.updateProjectionMatrix()
    this.controls.update()
  }

  public frameAll(sceneRoot: Object3D): void {
    const bounds = new Box3().setFromObject(sceneRoot, true)
    this.frameBox(bounds)
  }

  public frameObject(obj: Object3D): void {
    const bounds = new Box3().setFromObject(obj, true)
    this.frameBox(bounds)
  }

  public trackScaledObject(
    obj: Object3D,
    previousCenter: Vector3 | null,
    previousMaxDim: number | null,
    targetCenter: Vector3 | null = previousCenter,
  ): { center: Vector3 | null; maxDim: number | null } {
    const bounds = new Box3().setFromObject(obj, true)
    if (bounds.isEmpty()) {
      return { center: previousCenter, maxDim: previousMaxDim }
    }

    bounds.getSize(this.tmpSize)
    bounds.getCenter(this.tmpCenter)
    const nextMaxDim = Math.max(this.tmpSize.x, this.tmpSize.y, this.tmpSize.z, 0.001)
    if (previousCenter === null || previousMaxDim === null || previousMaxDim <= 0.000001) {
      this.frameBox(bounds)
      return { center: this.tmpCenter.clone(), maxDim: nextMaxDim }
    }

    const nextTargetCenter = targetCenter ?? previousCenter
    const currentDistance = Math.max(this.camera.position.distanceTo(nextTargetCenter), 0.001)
    const nextDistance = currentDistance * (nextMaxDim / previousMaxDim)

    this.tmpDirection.copy(this.camera.position).sub(nextTargetCenter).normalize()
    if (!Number.isFinite(this.tmpDirection.lengthSq()) || this.tmpDirection.lengthSq() < 1e-8) {
      this.tmpDirection.set(1, 1, 1).normalize()
    }

    this.controls.target.copy(nextTargetCenter)
    this.camera.position.copy(nextTargetCenter).addScaledVector(this.tmpDirection, nextDistance)
    this.camera.near = Math.max(nextDistance / 100, 0.01)
    this.camera.far = Math.max(nextDistance * 100, 100)
    this.camera.updateProjectionMatrix()
    this.controls.update()
    return { center: previousCenter.clone(), maxDim: nextMaxDim }
  }

  public trackObject(obj: Object3D, previousCenter: Vector3 | null = null): Vector3 | null {
    const bounds = new Box3().setFromObject(obj, true)
    if (bounds.isEmpty()) {
      return previousCenter
    }

    bounds.getCenter(this.tmpCenter)
    if (previousCenter === null) {
      const offset = this.camera.position.clone().sub(this.controls.target)
      this.controls.target.copy(this.tmpCenter)
      this.camera.position.copy(this.tmpCenter).add(offset)
      this.camera.updateProjectionMatrix()
      this.controls.update()
      return this.tmpCenter.clone()
    }

    const delta = this.tmpCenter.clone().sub(previousCenter)
    this.controls.target.add(delta)
    this.camera.position.add(delta)
    this.camera.updateProjectionMatrix()
    this.controls.update()
    return this.tmpCenter.clone()
  }

  public setPreset(preset: CameraPreset): void {
    const direction = new Vector3(1, 1, 1).normalize()

    switch (preset) {
      case 'top':
        direction.set(0, 1, 0)
        break
      case 'front':
        direction.set(0, 0, 1)
        break
      case 'left':
        direction.set(-1, 0, 0)
        break
      case 'right':
        direction.set(1, 0, 0)
        break
      case 'iso':
      default:
        direction.set(1, 1, 1).normalize()
        break
    }

    this.snapToDirection(direction)
  }

  public snapToDirection(direction: Vector3): void {
    const target = this.controls.target.clone()
    const currentDistance = Math.max(this.camera.position.distanceTo(target), 0.5)
    const normalized = direction.clone().normalize()
    if (!Number.isFinite(normalized.lengthSq()) || normalized.lengthSq() < 1e-8) {
      return
    }

    if (Math.abs(normalized.dot(new Vector3(0, 1, 0))) > 0.98) {
      this.camera.up.set(0, 0, -1)
    } else {
      this.camera.up.set(0, 1, 0)
    }

    this.camera.position.copy(target).addScaledVector(normalized, currentDistance)
    this.camera.lookAt(target)
    this.controls.update()
  }
}
