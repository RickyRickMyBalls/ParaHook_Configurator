import { Box3, MOUSE, MathUtils, Object3D, PerspectiveCamera, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export type CameraPreset = 'iso' | 'top' | 'front' | 'left' | 'right'
export type CameraPose = {
  position: Vector3
  target: Vector3
  up: Vector3
}

export class CameraController {
  private readonly camera: PerspectiveCamera
  private readonly controls: OrbitControls
  private leftButtonOrbitEnabled = false
  private readonly tmpSize = new Vector3()
  private readonly tmpCenter = new Vector3()
  private readonly tmpDirection = new Vector3()
  private readonly tmpOffset = new Vector3()
  private readonly tmpPanOffset = new Vector3()
  private readonly tmpPanVertical = new Vector3()
  private readonly transitionFromPosition = new Vector3()
  private readonly transitionFromTarget = new Vector3()
  private readonly transitionFromUp = new Vector3()
  private readonly transitionToPosition = new Vector3()
  private readonly transitionToTarget = new Vector3()
  private readonly transitionToUp = new Vector3()
  private cameraTransition:
    | {
        elapsed: number
        duration: number
      }
    | null = null
  private temporaryOrbitDrag:
    | {
        lastClientX: number
        lastClientY: number
      }
    | null = null
  private temporaryPanDrag:
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
    this.applyMouseBindings()
  }

  public getControls(): OrbitControls {
    return this.controls
  }

  public update(dt: number): void {
    if (this.cameraTransition !== null) {
      this.cameraTransition.elapsed = Math.min(
        this.cameraTransition.elapsed + Math.max(dt, 0),
        this.cameraTransition.duration,
      )
      const linearT =
        this.cameraTransition.duration <= 1e-6
          ? 1
          : this.cameraTransition.elapsed / this.cameraTransition.duration
      const easedT =
        linearT < 0.5
          ? 4 * linearT * linearT * linearT
          : 1 - Math.pow(-2 * linearT + 2, 3) / 2
      this.controls.target.lerpVectors(
        this.transitionFromTarget,
        this.transitionToTarget,
        easedT,
      )
      this.camera.position.lerpVectors(
        this.transitionFromPosition,
        this.transitionToPosition,
        easedT,
      )
      this.camera.up.lerpVectors(this.transitionFromUp, this.transitionToUp, easedT).normalize()
      this.camera.lookAt(this.controls.target)
      if (linearT >= 1) {
        this.cameraTransition = null
      }
    }
    this.controls.update(dt)
  }

  public setEnabled(enabled: boolean): void {
    this.controls.enabled = enabled
  }

  public setLeftButtonOrbitEnabled(enabled: boolean): void {
    this.leftButtonOrbitEnabled = enabled
    this.applyMouseBindings()
  }

  public beginTemporaryOrbitDrag(startClientX: number, startClientY: number): void {
    this.cameraTransition = null
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

  public beginTemporaryPanDrag(startClientX: number, startClientY: number): void {
    this.cameraTransition = null
    this.temporaryPanDrag = {
      lastClientX: startClientX,
      lastClientY: startClientY,
    }
  }

  public updateTemporaryPanDrag(clientX: number, clientY: number): void {
    if (this.temporaryPanDrag === null) {
      return
    }
    const deltaX = clientX - this.temporaryPanDrag.lastClientX
    const deltaY = clientY - this.temporaryPanDrag.lastClientY
    if (deltaX === 0 && deltaY === 0) {
      return
    }

    this.panByClientDelta(deltaX, deltaY)
    this.temporaryPanDrag = {
      lastClientX: clientX,
      lastClientY: clientY,
    }
  }

  public endTemporaryPanDrag(): void {
    this.temporaryPanDrag = null
  }

  public zoomByWheelDelta(deltaY: number): void {
    if (!Number.isFinite(deltaY) || deltaY === 0) {
      return
    }
    this.cameraTransition = null
    const zoomFactor = deltaY < 0 ? 0.92 : 1.08
    this.tmpOffset.copy(this.camera.position).sub(this.controls.target)
    const nextDistance = Math.max(this.tmpOffset.length() * zoomFactor, 0.05)
    if (this.tmpOffset.lengthSq() <= 1e-8) {
      this.tmpOffset.set(1, 1, 1).normalize()
    } else {
      this.tmpOffset.normalize()
    }
    this.camera.position.copy(this.controls.target).addScaledVector(this.tmpOffset, nextDistance)
    this.camera.near = Math.max(nextDistance / 100, 0.01)
    this.camera.far = Math.max(nextDistance * 100, 100)
    this.camera.updateProjectionMatrix()
    this.controls.update()
  }

  public frameBox(box3: Box3): void {
    this.cameraTransition = null
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
    this.cameraTransition = null
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
    this.cameraTransition = null
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

  public getPose(): CameraPose {
    return {
      position: this.camera.position.clone(),
      target: this.controls.target.clone(),
      up: this.camera.up.clone(),
    }
  }

  public animateToDirection(
    direction: Vector3,
    options?: {
      target?: Vector3
      durationMs?: number
    },
  ): void {
    const normalized = direction.clone().normalize()
    if (!Number.isFinite(normalized.lengthSq()) || normalized.lengthSq() < 1e-8) {
      return
    }

    const nextTarget = options?.target?.clone() ?? this.controls.target.clone()
    const currentDistance = Math.max(this.camera.position.distanceTo(this.controls.target), 0.5)
    const nextUp =
      Math.abs(normalized.dot(new Vector3(0, 1, 0))) > 0.98
        ? new Vector3(0, 0, -1)
        : new Vector3(0, 1, 0)
    const nextPosition = nextTarget.clone().addScaledVector(normalized, currentDistance)

    this.transitionFromPosition.copy(this.camera.position)
    this.transitionFromTarget.copy(this.controls.target)
    this.transitionFromUp.copy(this.camera.up)
    this.transitionToPosition.copy(nextPosition)
    this.transitionToTarget.copy(nextTarget)
    this.transitionToUp.copy(nextUp)
    this.cameraTransition = {
      elapsed: 0,
      duration: Math.max((options?.durationMs ?? 320) / 1000, 0.001),
    }
  }

  public animateToPose(
    pose: CameraPose,
    options?: {
      durationMs?: number
    },
  ): void {
    this.transitionFromPosition.copy(this.camera.position)
    this.transitionFromTarget.copy(this.controls.target)
    this.transitionFromUp.copy(this.camera.up)
    this.transitionToPosition.copy(pose.position)
    this.transitionToTarget.copy(pose.target)
    this.transitionToUp.copy(pose.up)
    this.cameraTransition = {
      elapsed: 0,
      duration: Math.max((options?.durationMs ?? 320) / 1000, 0.001),
    }
  }

  public snapToDirection(direction: Vector3): void {
    this.cameraTransition = null
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

  private applyMouseBindings(): void {
    this.controls.mouseButtons.LEFT = this.leftButtonOrbitEnabled ? MOUSE.ROTATE : null
    this.controls.mouseButtons.MIDDLE = MOUSE.PAN
    this.controls.mouseButtons.RIGHT = null
  }

  private panByClientDelta(deltaX: number, deltaY: number): void {
    const elementHeight = Math.max(this.controls.domElement?.clientHeight ?? 1, 1)
    this.tmpOffset.copy(this.camera.position).sub(this.controls.target)
    const targetDistance =
      this.tmpOffset.length() * Math.tan(((this.camera.fov / 2) * Math.PI) / 180)
    const panX = (2 * deltaX * targetDistance) / elementHeight
    const panY = (2 * deltaY * targetDistance) / elementHeight

    this.camera.updateMatrix()
    this.tmpPanOffset.setFromMatrixColumn(this.camera.matrix, 0).multiplyScalar(-panX)
    this.tmpPanVertical
      .copy(this.camera.up)
      .setLength(panY)
    this.tmpPanOffset.add(this.tmpPanVertical)

    this.camera.position.add(this.tmpPanOffset)
    this.controls.target.add(this.tmpPanOffset)
    this.controls.update()
  }
}
