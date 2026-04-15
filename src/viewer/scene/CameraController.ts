import {
  Box3,
  Camera,
  MathUtils,
  MOUSE,
  Object3D,
  OrthographicCamera,
  Plane,
  PerspectiveCamera,
  Quaternion,
  Vector3,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { ProjectionMode } from '../../shared/viewSettingsTypes'

export type CameraPreset = 'iso' | 'top' | 'front' | 'left' | 'right'
export type CameraPose = {
  position: Vector3
  target: Vector3
  up: Vector3
  projectionMode: ProjectionMode
  perspectiveFovDeg: number
  orthoViewHeight: number
}

const MIN_CAMERA_DISTANCE = 0.05
const DEFAULT_ORTHO_VIEW_HEIGHT = 4
const FIT_PADDING = 1.2

export class CameraController {
  private readonly perspectiveCamera: PerspectiveCamera
  private readonly orthographicCamera: OrthographicCamera
  private readonly controls: OrbitControls
  private leftButtonOrbitEnabled = false
  private readonly tmpSize = new Vector3()
  private readonly tmpCenter = new Vector3()
  private readonly tmpDirection = new Vector3()
  private readonly tmpOffset = new Vector3()
  private readonly tmpPanOffset = new Vector3()
  private readonly tmpPanVertical = new Vector3()
  private readonly tmpPanHorizontal = new Vector3()
  private readonly tmpRight = new Vector3()
  private readonly tmpUp = new Vector3()
  private readonly tmpForward = new Vector3()
  private readonly tmpFlyOffset = new Vector3()
  private readonly tmpYawQuaternion = new Quaternion()
  private readonly tmpPitchQuaternion = new Quaternion()
  private readonly tmpRollQuaternion = new Quaternion()
  private readonly tmpCorner = new Vector3()
  private readonly tmpWindowCornerA = new Vector3()
  private readonly tmpWindowCornerB = new Vector3()
  private readonly tmpWindowCornerC = new Vector3()
  private readonly tmpWindowCornerD = new Vector3()
  private readonly tmpWindowNear = new Vector3()
  private readonly tmpWindowFar = new Vector3()
  private readonly tmpPlaneNormal = new Vector3()
  private readonly tmpWindowRayDirection = new Vector3()
  private readonly tmpTargetPlane = new Plane()
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
  private projectionMode: ProjectionMode = 'perspective'
  private lastPerspectiveFovDeg: number
  private orthoViewHeight = DEFAULT_ORTHO_VIEW_HEIGHT
  private viewportWidth = 1
  private viewportHeight = 1
  private flyMode:
    | {
        orientation: Quaternion
        targetDistance: number
      }
    | null = null

  public constructor(
    perspectiveCamera: PerspectiveCamera,
    orthographicCamera: OrthographicCamera,
    domElement: HTMLElement,
  ) {
    this.perspectiveCamera = perspectiveCamera
    this.orthographicCamera = orthographicCamera
    this.lastPerspectiveFovDeg = perspectiveCamera.fov
    this.controls = new OrbitControls(perspectiveCamera, domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.screenSpacePanning = true
    this.controls.rotateSpeed = 0.8
    this.controls.zoomSpeed = 1
    this.controls.panSpeed = 0.8
    this.syncOrthographicFromPerspective()
    this.applyMouseBindings()
  }

  public getControls(): OrbitControls {
    return this.controls
  }

  public getProjectionMode(): ProjectionMode {
    return this.projectionMode
  }

  public getActiveCamera(): PerspectiveCamera | OrthographicCamera {
    return this.projectionMode === 'orthographic' ? this.orthographicCamera : this.perspectiveCamera
  }

  public setViewportSize(width: number, height: number): void {
    this.viewportWidth = Math.max(width, 1)
    this.viewportHeight = Math.max(height, 1)
    this.perspectiveCamera.aspect = this.viewportWidth / this.viewportHeight
    this.perspectiveCamera.updateProjectionMatrix()
    this.updateOrthographicFrustum()
  }

  public setProjectionMode(mode: ProjectionMode): void {
    if (this.projectionMode === mode) {
      return
    }
    this.cameraTransition = null
    this.flyMode = null
    if (mode === 'orthographic') {
      this.syncOrthographicFromPerspective()
      this.controls.object = this.orthographicCamera as Camera
    } else {
      this.syncPerspectiveFromOrthographic()
      this.controls.object = this.perspectiveCamera as Camera
    }
    this.projectionMode = mode
    this.controls.update()
  }

  public update(dt: number): void {
    const activeCamera = this.getActiveCamera()
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
      this.controls.target.lerpVectors(this.transitionFromTarget, this.transitionToTarget, easedT)
      activeCamera.position.lerpVectors(
        this.transitionFromPosition,
        this.transitionToPosition,
        easedT,
      )
      activeCamera.up.lerpVectors(this.transitionFromUp, this.transitionToUp, easedT).normalize()
      activeCamera.lookAt(this.controls.target)
      activeCamera.updateProjectionMatrix()
      if (linearT >= 1) {
        this.cameraTransition = null
      }
    }
    if (this.flyMode !== null) {
      return
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

  public beginFlyMode(): void {
    if (this.projectionMode !== 'perspective') {
      return
    }

    this.cameraTransition = null
    this.flyMode = {
      orientation: this.perspectiveCamera.quaternion.clone().normalize(),
      targetDistance: Math.max(
        this.perspectiveCamera.position.distanceTo(this.controls.target),
        MIN_CAMERA_DISTANCE,
      ),
    }
    this.syncPerspectiveCameraFromFlyMode()
  }

  public endFlyMode(options?: { restoreUpright?: boolean }): void {
    if (this.flyMode === null) {
      return
    }

    this.cameraTransition = null
    const targetDistance = this.flyMode.targetDistance
    this.tmpForward.set(0, 0, -1).applyQuaternion(this.flyMode.orientation).normalize()
    this.flyMode = null

    if (options?.restoreUpright === true) {
      this.restorePerspectiveOrbitFromForward(this.tmpForward, targetDistance)
      return
    }

    this.controls.update()
  }

  public applyFlyLookDelta(deltaX: number, deltaY: number): void {
    if (this.projectionMode !== 'perspective' || (deltaX === 0 && deltaY === 0)) {
      return
    }

    this.cameraTransition = null
    if (this.flyMode !== null) {
      const elementHeight = Math.max(this.controls.domElement?.clientHeight ?? 1, 1)
      const twoPi = Math.PI * 2
      const yaw = (-twoPi * deltaX) / elementHeight
      const pitch = (-twoPi * deltaY) / elementHeight

      this.tmpUp.set(0, 1, 0).applyQuaternion(this.flyMode.orientation).normalize()
      this.tmpYawQuaternion.setFromAxisAngle(this.tmpUp, yaw)
      this.flyMode.orientation.premultiply(this.tmpYawQuaternion).normalize()

      this.tmpRight.set(1, 0, 0).applyQuaternion(this.flyMode.orientation).normalize()
      this.tmpPitchQuaternion.setFromAxisAngle(this.tmpRight, pitch)
      this.flyMode.orientation.premultiply(this.tmpPitchQuaternion).normalize()

      this.syncPerspectiveCameraFromFlyMode()
      return
    }

    const activeCamera = this.perspectiveCamera
    const targetDistance = Math.max(
      activeCamera.position.distanceTo(this.controls.target),
      MIN_CAMERA_DISTANCE,
    )
    this.tmpForward.copy(this.controls.target).sub(activeCamera.position)
    if (!Number.isFinite(this.tmpForward.lengthSq()) || this.tmpForward.lengthSq() < 1e-8) {
      this.tmpForward.set(0, 0, -1)
    } else {
      this.tmpForward.normalize()
    }

    this.tmpUp.copy(activeCamera.up)
    if (!Number.isFinite(this.tmpUp.lengthSq()) || this.tmpUp.lengthSq() < 1e-8) {
      this.tmpUp.set(0, 1, 0)
    } else {
      this.tmpUp.normalize()
    }

    const elementHeight = Math.max(this.controls.domElement?.clientHeight ?? 1, 1)
    const twoPi = Math.PI * 2
    const yaw = (-twoPi * deltaX) / elementHeight
    const pitch = (-twoPi * deltaY) / elementHeight

    this.tmpYawQuaternion.setFromAxisAngle(this.tmpUp, yaw)
    this.tmpForward.applyQuaternion(this.tmpYawQuaternion).normalize()
    this.tmpRight.crossVectors(this.tmpForward, this.tmpUp).normalize()
    if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
      activeCamera.lookAt(this.controls.target)
      activeCamera.updateProjectionMatrix()
      this.controls.update()
      return
    }

    this.tmpPitchQuaternion.setFromAxisAngle(this.tmpRight, pitch)
    this.tmpForward.applyQuaternion(this.tmpPitchQuaternion).normalize()
    this.tmpUp.applyQuaternion(this.tmpPitchQuaternion).normalize()
    this.tmpRight.crossVectors(this.tmpForward, this.tmpUp).normalize()
    if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
      activeCamera.lookAt(this.controls.target)
      activeCamera.updateProjectionMatrix()
      this.controls.update()
      return
    }
    this.tmpUp.crossVectors(this.tmpRight, this.tmpForward).normalize()

    activeCamera.up.copy(this.tmpUp)
    this.controls.target.copy(activeCamera.position).addScaledVector(this.tmpForward, targetDistance)
    activeCamera.lookAt(this.controls.target)
    activeCamera.updateProjectionMatrix()
    this.controls.update()
  }

  public applyFlyLookDeltaUpright(deltaX: number, deltaY: number): void {
    if (this.projectionMode !== 'perspective' || (deltaX === 0 && deltaY === 0)) {
      return
    }

    if (this.flyMode === null) {
      this.applyFlyLookDelta(deltaX, deltaY)
      return
    }

    this.cameraTransition = null
    const elementHeight = Math.max(this.controls.domElement?.clientHeight ?? 1, 1)
    const twoPi = Math.PI * 2
    const yaw = (-twoPi * deltaX) / elementHeight
    const pitch = (-twoPi * deltaY) / elementHeight

    this.tmpForward.set(0, 0, -1).applyQuaternion(this.flyMode.orientation).normalize()
    this.tmpUp.set(0, 1, 0)
    this.tmpYawQuaternion.setFromAxisAngle(this.tmpUp, yaw)
    this.tmpForward.applyQuaternion(this.tmpYawQuaternion).normalize()

    this.tmpRight.crossVectors(this.tmpForward, this.tmpUp).normalize()
    if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
      this.tmpRight.set(1, 0, 0).applyQuaternion(this.flyMode.orientation)
      this.tmpRight.addScaledVector(this.tmpForward, -this.tmpRight.dot(this.tmpForward))
      if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
        this.tmpRight.set(1, 0, 0)
      } else {
        this.tmpRight.normalize()
      }
    }

    this.tmpPitchQuaternion.setFromAxisAngle(this.tmpRight, pitch)
    this.tmpForward.applyQuaternion(this.tmpPitchQuaternion).normalize()

    this.tmpRight.crossVectors(this.tmpForward, this.tmpUp).normalize()
    if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
      this.tmpRight.set(1, 0, 0)
    }
    this.tmpUp.crossVectors(this.tmpRight, this.tmpForward).normalize()

    this.perspectiveCamera.up.copy(this.tmpUp)
    this.controls.target
      .copy(this.perspectiveCamera.position)
      .addScaledVector(this.tmpForward, this.flyMode.targetDistance)
    this.perspectiveCamera.lookAt(this.controls.target)
    this.flyMode.orientation.copy(this.perspectiveCamera.quaternion).normalize()
    this.syncPerspectiveCameraFromFlyMode()
  }

  public applyFlyRollDelta(deltaRadians: number): void {
    if (this.projectionMode !== 'perspective' || deltaRadians === 0) {
      return
    }

    this.cameraTransition = null
    if (this.flyMode !== null) {
      this.tmpForward.set(0, 0, -1).applyQuaternion(this.flyMode.orientation).normalize()
      this.tmpRollQuaternion.setFromAxisAngle(this.tmpForward, deltaRadians)
      this.flyMode.orientation.premultiply(this.tmpRollQuaternion).normalize()
      this.syncPerspectiveCameraFromFlyMode()
      return
    }

    const activeCamera = this.perspectiveCamera
    const targetDistance = Math.max(
      activeCamera.position.distanceTo(this.controls.target),
      MIN_CAMERA_DISTANCE,
    )
    this.tmpForward.copy(this.controls.target).sub(activeCamera.position)
    if (!Number.isFinite(this.tmpForward.lengthSq()) || this.tmpForward.lengthSq() < 1e-8) {
      this.tmpForward.set(0, 0, -1)
    } else {
      this.tmpForward.normalize()
    }

    this.tmpUp.copy(activeCamera.up)
    if (!Number.isFinite(this.tmpUp.lengthSq()) || this.tmpUp.lengthSq() < 1e-8) {
      this.tmpUp.set(0, 1, 0)
    } else {
      this.tmpUp.normalize()
    }

    this.tmpRollQuaternion.setFromAxisAngle(this.tmpForward, deltaRadians)
    this.tmpUp.applyQuaternion(this.tmpRollQuaternion).normalize()
    this.tmpRight.crossVectors(this.tmpForward, this.tmpUp).normalize()
    if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
      activeCamera.lookAt(this.controls.target)
      activeCamera.updateProjectionMatrix()
      this.controls.update()
      return
    }

    this.tmpUp.crossVectors(this.tmpRight, this.tmpForward).normalize()
    activeCamera.up.copy(this.tmpUp)
    this.controls.target.copy(activeCamera.position).addScaledVector(this.tmpForward, targetDistance)
    activeCamera.lookAt(this.controls.target)
    activeCamera.updateProjectionMatrix()
    this.controls.update()
  }

  public restoreFlyUpright(): void {
    if (this.projectionMode !== 'perspective' || this.flyMode === null) {
      return
    }

    this.cameraTransition = null
    this.tmpForward.set(0, 0, -1).applyQuaternion(this.flyMode.orientation).normalize()
    if (!Number.isFinite(this.tmpForward.lengthSq()) || this.tmpForward.lengthSq() < 1e-8) {
      this.tmpForward.set(0, 0, -1)
    }

    this.tmpUp.set(0, 1, 0)
    this.tmpRight.crossVectors(this.tmpForward, this.tmpUp).normalize()
    if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
      this.tmpRight.set(1, 0, 0).applyQuaternion(this.flyMode.orientation)
      this.tmpRight.addScaledVector(this.tmpForward, -this.tmpRight.dot(this.tmpForward))
      if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
        this.tmpRight.set(1, 0, 0)
      } else {
        this.tmpRight.normalize()
      }
    }

    this.tmpUp.crossVectors(this.tmpRight, this.tmpForward).normalize()
    this.perspectiveCamera.up.copy(this.tmpUp)
    this.controls.target
      .copy(this.perspectiveCamera.position)
      .addScaledVector(this.tmpForward, this.flyMode.targetDistance)
    this.perspectiveCamera.lookAt(this.controls.target)
    this.flyMode.orientation.copy(this.perspectiveCamera.quaternion).normalize()
    this.syncPerspectiveCameraFromFlyMode()
  }

  public translateFly(forwardDistance: number, rightDistance: number, upDistance: number): void {
    if (
      this.projectionMode !== 'perspective' ||
      (forwardDistance === 0 && rightDistance === 0 && upDistance === 0)
    ) {
      return
    }

    this.cameraTransition = null
    if (this.flyMode !== null) {
      const activeCamera = this.perspectiveCamera
      this.tmpForward.set(0, 0, -1).applyQuaternion(this.flyMode.orientation).normalize()
      this.tmpRight.set(1, 0, 0).applyQuaternion(this.flyMode.orientation).normalize()
      this.tmpUp.set(0, 1, 0).applyQuaternion(this.flyMode.orientation).normalize()

      this.tmpFlyOffset.set(0, 0, 0)
      this.tmpFlyOffset.addScaledVector(this.tmpForward, forwardDistance)
      this.tmpFlyOffset.addScaledVector(this.tmpRight, rightDistance)
      this.tmpFlyOffset.addScaledVector(this.tmpUp, upDistance)

      activeCamera.position.add(this.tmpFlyOffset)
      this.syncPerspectiveCameraFromFlyMode()
      return
    }

    const activeCamera = this.perspectiveCamera
    this.tmpForward.copy(this.controls.target).sub(activeCamera.position)
    if (!Number.isFinite(this.tmpForward.lengthSq()) || this.tmpForward.lengthSq() < 1e-8) {
      this.tmpForward.set(0, 0, -1)
    } else {
      this.tmpForward.normalize()
    }

    this.tmpUp.copy(activeCamera.up)
    if (!Number.isFinite(this.tmpUp.lengthSq()) || this.tmpUp.lengthSq() < 1e-8) {
      this.tmpUp.set(0, 1, 0)
    } else {
      this.tmpUp.normalize()
    }

    this.tmpRight.crossVectors(this.tmpForward, this.tmpUp).normalize()
    if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
      this.tmpRight.set(1, 0, 0)
    }

    this.tmpFlyOffset.set(0, 0, 0)
    this.tmpFlyOffset.addScaledVector(this.tmpForward, forwardDistance)
    this.tmpFlyOffset.addScaledVector(this.tmpRight, rightDistance)
    this.tmpFlyOffset.addScaledVector(this.tmpUp, upDistance)

    activeCamera.position.add(this.tmpFlyOffset)
    this.controls.target.add(this.tmpFlyOffset)
    activeCamera.lookAt(this.controls.target)
    activeCamera.updateProjectionMatrix()
    this.controls.update()
  }

  public zoomByWheelDelta(deltaY: number): void {
    if (!Number.isFinite(deltaY) || deltaY === 0) {
      return
    }
    this.cameraTransition = null
    const zoomFactor = deltaY < 0 ? 0.92 : 1.08
    if (this.projectionMode === 'orthographic') {
      this.orthoViewHeight = Math.max(this.orthoViewHeight * zoomFactor, 0.001)
      this.updateOrthographicFrustum()
      this.controls.update()
      return
    }

    this.tmpOffset.copy(this.perspectiveCamera.position).sub(this.controls.target)
    const nextDistance = Math.max(this.tmpOffset.length() * zoomFactor, MIN_CAMERA_DISTANCE)
    if (this.tmpOffset.lengthSq() <= 1e-8) {
      this.tmpOffset.set(1, 1, 1).normalize()
    } else {
      this.tmpOffset.normalize()
    }
    this.perspectiveCamera.position
      .copy(this.controls.target)
      .addScaledVector(this.tmpOffset, nextDistance)
    this.syncNearFarFromDistance(nextDistance)
    this.perspectiveCamera.updateProjectionMatrix()
    this.controls.update()
  }

  public frameBox(box3: Box3): void {
    this.cameraTransition = null
    if (box3.isEmpty()) {
      return
    }

    box3.getCenter(this.tmpCenter)
    const activeCamera = this.getActiveCamera()
    this.tmpDirection.copy(activeCamera.position).sub(this.controls.target)
    if (!Number.isFinite(this.tmpDirection.lengthSq()) || this.tmpDirection.lengthSq() < 1e-8) {
      this.tmpDirection.set(1, 1, 1).normalize()
    } else {
      this.tmpDirection.normalize()
    }

    const viewExtents = this.measureViewPlaneExtents(box3, this.tmpDirection, activeCamera.up)
    const nextDistance = Math.max(activeCamera.position.distanceTo(this.controls.target), 0.5)
    this.controls.target.copy(this.tmpCenter)
    activeCamera.position.copy(this.tmpCenter).addScaledVector(this.tmpDirection, nextDistance)
    activeCamera.lookAt(this.controls.target)

    if (this.projectionMode === 'orthographic') {
      this.orthoViewHeight = Math.max(
        FIT_PADDING * Math.max(viewExtents.height, viewExtents.width / this.getAspect()),
        0.001,
      )
      this.updateOrthographicFrustum()
    } else {
      const verticalFov = MathUtils.degToRad(this.perspectiveCamera.fov)
      const fitHeightDistance = (viewExtents.height / 2) / Math.max(Math.tan(verticalFov / 2), 1e-6)
      const fitWidthDistance =
        (viewExtents.width / 2) /
        Math.max(Math.tan(verticalFov / 2) * this.getAspect(), 1e-6)
      const distance = Math.max(FIT_PADDING * Math.max(fitHeightDistance, fitWidthDistance), 0.5)
      this.perspectiveCamera.position.copy(this.tmpCenter).addScaledVector(this.tmpDirection, distance)
      this.syncNearFarFromDistance(distance)
      this.perspectiveCamera.updateProjectionMatrix()
    }
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

  public frameWindowClientRect(
    startClientX: number,
    startClientY: number,
    endClientX: number,
    endClientY: number,
  ): boolean {
    const minX = Math.min(startClientX, endClientX)
    const maxX = Math.max(startClientX, endClientX)
    const minY = Math.min(startClientY, endClientY)
    const maxY = Math.max(startClientY, endClientY)
    if (maxX - minX < 3 || maxY - minY < 3) {
      return false
    }

    const activeCamera = this.getActiveCamera()
    this.tmpPlaneNormal.copy(this.controls.target).sub(activeCamera.position).normalize()
    if (!Number.isFinite(this.tmpPlaneNormal.lengthSq()) || this.tmpPlaneNormal.lengthSq() < 1e-8) {
      return false
    }
    this.tmpTargetPlane.setFromNormalAndCoplanarPoint(this.tmpPlaneNormal, this.controls.target)

    const didProjectAllCorners =
      this.projectClientPointToTargetPlane(minX, minY, this.tmpWindowCornerA) &&
      this.projectClientPointToTargetPlane(maxX, minY, this.tmpWindowCornerB) &&
      this.projectClientPointToTargetPlane(maxX, maxY, this.tmpWindowCornerC) &&
      this.projectClientPointToTargetPlane(minX, maxY, this.tmpWindowCornerD)

    if (!didProjectAllCorners) {
      return false
    }

    const bounds = new Box3()
    bounds.expandByPoint(this.tmpWindowCornerA)
    bounds.expandByPoint(this.tmpWindowCornerB)
    bounds.expandByPoint(this.tmpWindowCornerC)
    bounds.expandByPoint(this.tmpWindowCornerD)
    if (bounds.isEmpty()) {
      return false
    }

    this.frameBox(bounds)
    return true
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
    const activeCamera = this.getActiveCamera()
    const currentDistance = Math.max(activeCamera.position.distanceTo(nextTargetCenter), 0.001)
    const nextDistance = currentDistance * (nextMaxDim / previousMaxDim)

    this.tmpDirection.copy(activeCamera.position).sub(nextTargetCenter).normalize()
    if (!Number.isFinite(this.tmpDirection.lengthSq()) || this.tmpDirection.lengthSq() < 1e-8) {
      this.tmpDirection.set(1, 1, 1).normalize()
    }

    this.controls.target.copy(nextTargetCenter)
    activeCamera.position.copy(nextTargetCenter).addScaledVector(this.tmpDirection, nextDistance)
    if (this.projectionMode === 'orthographic') {
      this.orthoViewHeight = Math.max(this.orthoViewHeight * (nextMaxDim / previousMaxDim), 0.001)
      this.updateOrthographicFrustum()
    } else {
      this.syncNearFarFromDistance(nextDistance)
      this.perspectiveCamera.updateProjectionMatrix()
    }
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
    const activeCamera = this.getActiveCamera()
    if (previousCenter === null) {
      const offset = activeCamera.position.clone().sub(this.controls.target)
      this.controls.target.copy(this.tmpCenter)
      activeCamera.position.copy(this.tmpCenter).add(offset)
      activeCamera.updateProjectionMatrix()
      this.controls.update()
      return this.tmpCenter.clone()
    }

    const delta = this.tmpCenter.clone().sub(previousCenter)
    this.controls.target.add(delta)
    activeCamera.position.add(delta)
    activeCamera.updateProjectionMatrix()
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
    const activeCamera = this.getActiveCamera()
    return {
      position: activeCamera.position.clone(),
      target: this.controls.target.clone(),
      up: activeCamera.up.clone(),
      projectionMode: this.projectionMode,
      perspectiveFovDeg: this.lastPerspectiveFovDeg,
      orthoViewHeight: this.orthoViewHeight,
    }
  }

  public animateToDirection(
    direction: Vector3,
    options?: {
      target?: Vector3
      up?: Vector3
      durationMs?: number
    },
  ): void {
    const normalized = direction.clone().normalize()
    if (!Number.isFinite(normalized.lengthSq()) || normalized.lengthSq() < 1e-8) {
      return
    }

    const activeCamera = this.getActiveCamera()
    const nextTarget = options?.target?.clone() ?? this.controls.target.clone()
    const currentDistance = Math.max(activeCamera.position.distanceTo(this.controls.target), 0.5)
    const nextUp =
      options?.up !== undefined
        ? options.up.clone().normalize()
        : Math.abs(normalized.dot(new Vector3(0, 1, 0))) > 0.98
          ? new Vector3(0, 0, -1)
          : new Vector3(0, 1, 0)
    const nextPosition = nextTarget.clone().addScaledVector(normalized, currentDistance)

    this.transitionFromPosition.copy(activeCamera.position)
    this.transitionFromTarget.copy(this.controls.target)
    this.transitionFromUp.copy(activeCamera.up)
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
    this.lastPerspectiveFovDeg = pose.perspectiveFovDeg
    this.orthoViewHeight = Math.max(pose.orthoViewHeight, 0.001)
    this.setProjectionMode(pose.projectionMode)
    const activeCamera = this.getActiveCamera()
    this.transitionFromPosition.copy(activeCamera.position)
    this.transitionFromTarget.copy(this.controls.target)
    this.transitionFromUp.copy(activeCamera.up)
    this.transitionToPosition.copy(pose.position)
    this.transitionToTarget.copy(pose.target)
    this.transitionToUp.copy(pose.up)
    this.cameraTransition = {
      elapsed: 0,
      duration: Math.max((options?.durationMs ?? 320) / 1000, 0.001),
    }
  }

  public applyPose(pose: CameraPose): void {
    this.cameraTransition = null
    this.lastPerspectiveFovDeg = pose.perspectiveFovDeg
    this.orthoViewHeight = Math.max(pose.orthoViewHeight, 0.001)
    this.setProjectionMode(pose.projectionMode)
    const activeCamera = this.getActiveCamera()
    activeCamera.position.copy(pose.position)
    activeCamera.up.copy(pose.up).normalize()
    this.controls.target.copy(pose.target)
    if (this.projectionMode === 'orthographic') {
      this.updateOrthographicFrustum()
    } else {
      this.syncNearFarFromDistance(
        Math.max(this.perspectiveCamera.position.distanceTo(this.controls.target), MIN_CAMERA_DISTANCE),
      )
    }
    activeCamera.lookAt(this.controls.target)
    activeCamera.updateProjectionMatrix()
    this.controls.update()
  }

  public snapToDirection(direction: Vector3): void {
    this.cameraTransition = null
    const activeCamera = this.getActiveCamera()
    const target = this.controls.target.clone()
    const currentDistance = Math.max(activeCamera.position.distanceTo(target), 0.5)
    const normalized = direction.clone().normalize()
    if (!Number.isFinite(normalized.lengthSq()) || normalized.lengthSq() < 1e-8) {
      return
    }

    if (Math.abs(normalized.dot(new Vector3(0, 1, 0))) > 0.98) {
      activeCamera.up.set(0, 0, -1)
    } else {
      activeCamera.up.set(0, 1, 0)
    }

    activeCamera.position.copy(target).addScaledVector(normalized, currentDistance)
    activeCamera.lookAt(target)
    activeCamera.updateProjectionMatrix()
    this.controls.update()
  }

  private applyMouseBindings(): void {
    this.controls.mouseButtons.LEFT = this.leftButtonOrbitEnabled ? MOUSE.ROTATE : null
    this.controls.mouseButtons.MIDDLE = MOUSE.PAN
    this.controls.mouseButtons.RIGHT = null
  }

  private syncPerspectiveCameraFromFlyMode(): void {
    if (this.flyMode === null) {
      return
    }

    this.tmpForward.set(0, 0, -1).applyQuaternion(this.flyMode.orientation).normalize()
    this.tmpUp.set(0, 1, 0).applyQuaternion(this.flyMode.orientation).normalize()
    this.perspectiveCamera.up.copy(this.tmpUp)
    this.perspectiveCamera.quaternion.copy(this.flyMode.orientation)
    this.controls.target
      .copy(this.perspectiveCamera.position)
      .addScaledVector(this.tmpForward, this.flyMode.targetDistance)
    this.perspectiveCamera.updateProjectionMatrix()
    this.perspectiveCamera.updateMatrixWorld()
  }

  private restorePerspectiveOrbitFromForward(forward: Vector3, targetDistance: number): void {
    this.tmpForward.copy(forward)
    if (!Number.isFinite(this.tmpForward.lengthSq()) || this.tmpForward.lengthSq() < 1e-8) {
      this.tmpForward.set(0, 0, -1)
    } else {
      this.tmpForward.normalize()
    }

    if (Math.abs(this.tmpForward.dot(this.tmpUp.set(0, 1, 0))) > 0.999) {
      this.tmpRight.set(1, 0, 0).applyQuaternion(this.perspectiveCamera.quaternion)
      this.tmpRight.addScaledVector(this.tmpForward, -this.tmpRight.dot(this.tmpForward))
      if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
        this.tmpRight.set(1, 0, 0)
      } else {
        this.tmpRight.normalize()
      }
      this.tmpForward.addScaledVector(this.tmpRight, 0.001).normalize()
    }

    this.perspectiveCamera.up.set(0, 1, 0)
    this.controls.target
      .copy(this.perspectiveCamera.position)
      .addScaledVector(this.tmpForward, Math.max(targetDistance, MIN_CAMERA_DISTANCE))
    this.perspectiveCamera.lookAt(this.controls.target)
    this.perspectiveCamera.updateProjectionMatrix()
    this.controls.update()
  }

  private getAspect(): number {
    return Math.max(this.viewportWidth / Math.max(this.viewportHeight, 1), 0.01)
  }

  private syncNearFarFromDistance(distance: number): void {
    this.perspectiveCamera.near = Math.max(distance / 100, 0.01)
    this.perspectiveCamera.far = Math.max(distance * 100, 100)
  }

  private updateOrthographicFrustum(): void {
    const halfHeight = this.orthoViewHeight / 2
    const halfWidth = halfHeight * this.getAspect()
    this.orthographicCamera.left = -halfWidth
    this.orthographicCamera.right = halfWidth
    this.orthographicCamera.top = halfHeight
    this.orthographicCamera.bottom = -halfHeight
    const orthoDistance = Math.max(
      this.orthographicCamera.position.distanceTo(this.controls.target),
      0.5,
    )
    this.orthographicCamera.near = Math.max(orthoDistance / 100, 0.01)
    this.orthographicCamera.far = Math.max(orthoDistance * 100, 100)
    this.orthographicCamera.updateProjectionMatrix()
  }

  private syncOrthographicFromPerspective(): void {
    const distance = Math.max(
      this.perspectiveCamera.position.distanceTo(this.controls.target),
      MIN_CAMERA_DISTANCE,
    )
    this.lastPerspectiveFovDeg = this.perspectiveCamera.fov
    this.orthoViewHeight = Math.max(
      2 * distance * Math.tan(MathUtils.degToRad(this.perspectiveCamera.fov / 2)),
      0.001,
    )
    this.orthographicCamera.position.copy(this.perspectiveCamera.position)
    this.orthographicCamera.up.copy(this.perspectiveCamera.up)
    this.orthographicCamera.lookAt(this.controls.target)
    this.updateOrthographicFrustum()
  }

  private syncPerspectiveFromOrthographic(): void {
    this.perspectiveCamera.fov = this.lastPerspectiveFovDeg
    this.perspectiveCamera.position.copy(this.orthographicCamera.position)
    this.perspectiveCamera.up.copy(this.orthographicCamera.up)
    const distance = Math.max(
      this.perspectiveCamera.position.distanceTo(this.controls.target),
      MIN_CAMERA_DISTANCE,
    )
    this.syncNearFarFromDistance(distance)
    this.perspectiveCamera.updateProjectionMatrix()
    this.perspectiveCamera.lookAt(this.controls.target)
  }

  private panByClientDelta(deltaX: number, deltaY: number): void {
    const activeCamera = this.getActiveCamera()
    const elementWidth = Math.max(this.controls.domElement?.clientWidth ?? 1, 1)
    const elementHeight = Math.max(this.controls.domElement?.clientHeight ?? 1, 1)
    let worldPanX = 0
    let worldPanY = 0

    if (this.projectionMode === 'orthographic') {
      worldPanX = (deltaX * this.orthoViewHeight * this.getAspect()) / elementWidth
      worldPanY = (deltaY * this.orthoViewHeight) / elementHeight
    } else {
      this.tmpOffset.copy(this.perspectiveCamera.position).sub(this.controls.target)
      const targetDistance =
        this.tmpOffset.length() * Math.tan(((this.perspectiveCamera.fov / 2) * Math.PI) / 180)
      worldPanX = (2 * deltaX * targetDistance * this.getAspect()) / elementWidth
      worldPanY = (2 * deltaY * targetDistance) / elementHeight
    }

    activeCamera.updateMatrixWorld()
    this.tmpRight
      .setFromMatrixColumn(activeCamera.matrixWorld, 0)
      .normalize()
    this.tmpPanHorizontal
      .copy(this.tmpRight)
      .multiplyScalar(-worldPanX)
    this.tmpUp
      .setFromMatrixColumn(activeCamera.matrixWorld, 1)
      .normalize()
    this.tmpPanVertical.copy(this.tmpUp)
      .multiplyScalar(worldPanY)
    this.tmpPanOffset.copy(this.tmpPanHorizontal).add(this.tmpPanVertical)

    activeCamera.position.add(this.tmpPanOffset)
    this.controls.target.add(this.tmpPanOffset)
    activeCamera.updateProjectionMatrix()
    this.controls.update()
  }

  private measureViewPlaneExtents(
    box3: Box3,
    direction: Vector3,
    up: Vector3,
  ): { width: number; height: number } {
    this.tmpRight.crossVectors(direction, up).normalize()
    if (!Number.isFinite(this.tmpRight.lengthSq()) || this.tmpRight.lengthSq() < 1e-8) {
      this.tmpRight.set(1, 0, 0)
    }
    this.tmpUp.crossVectors(this.tmpRight, direction).normalize()

    let minX = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    for (const x of [box3.min.x, box3.max.x]) {
      for (const y of [box3.min.y, box3.max.y]) {
        for (const z of [box3.min.z, box3.max.z]) {
          this.tmpCorner.set(x, y, z).sub(this.tmpCenter)
          const projectedX = this.tmpCorner.dot(this.tmpRight)
          const projectedY = this.tmpCorner.dot(this.tmpUp)
          minX = Math.min(minX, projectedX)
          maxX = Math.max(maxX, projectedX)
          minY = Math.min(minY, projectedY)
          maxY = Math.max(maxY, projectedY)
        }
      }
    }

    return {
      width: Math.max(maxX - minX, 0.001),
      height: Math.max(maxY - minY, 0.001),
    }
  }

  private projectClientPointToTargetPlane(
    clientX: number,
    clientY: number,
    out: Vector3,
  ): boolean {
    const ndcX = (clientX / this.viewportWidth) * 2 - 1
    const ndcY = -((clientY / this.viewportHeight) * 2 - 1)
    const activeCamera = this.getActiveCamera()

    if (activeCamera instanceof PerspectiveCamera) {
      this.tmpWindowNear.copy(activeCamera.position)
      this.tmpWindowFar.set(ndcX, ndcY, 1).unproject(activeCamera)
    } else {
      this.tmpWindowNear.set(ndcX, ndcY, -1).unproject(activeCamera)
      this.tmpWindowFar.set(ndcX, ndcY, 1).unproject(activeCamera)
    }

    this.tmpWindowRayDirection.copy(this.tmpWindowFar).sub(this.tmpWindowNear)
    if (
      !Number.isFinite(this.tmpWindowRayDirection.lengthSq()) ||
      this.tmpWindowRayDirection.lengthSq() < 1e-8
    ) {
      return false
    }
    this.tmpWindowRayDirection.normalize()
    const denominator = this.tmpTargetPlane.normal.dot(this.tmpWindowRayDirection)
    if (Math.abs(denominator) < 1e-6) {
      return false
    }

    const distance =
      -(
        this.tmpTargetPlane.normal.dot(this.tmpWindowNear) +
        this.tmpTargetPlane.constant
      ) / denominator
    if (!Number.isFinite(distance)) {
      return false
    }

    out.copy(this.tmpWindowNear).addScaledVector(this.tmpWindowRayDirection, distance)
    return true
  }
}
