// @vitest-environment jsdom

import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MOUSE,
  OrthographicCamera,
  PerspectiveCamera,
  Vector3,
} from 'three'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const orbitControlMocks = vi.hoisted(() => ({
  instances: [] as Array<{
    object: unknown
    target: Vector3
    rotateLeft: ReturnType<typeof vi.fn>
    rotateUp: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    mouseButtons: {
      LEFT: number | null
      MIDDLE: number | null
      RIGHT: number | null
    }
  }>,
}))

vi.mock('three/examples/jsm/controls/OrbitControls.js', async () => {
  const { Vector3 } = await import('three')

  class OrbitControls {
    public readonly domElement: HTMLElement
    public object: unknown
    public readonly target = new Vector3()
    public enableDamping = false
    public dampingFactor = 0
    public screenSpacePanning = false
    public rotateSpeed = 0
    public zoomSpeed = 0
    public panSpeed = 0
    public enabled = true
    public readonly rotateLeft = vi.fn()
    public readonly rotateUp = vi.fn()
    public readonly update = vi.fn()
    public readonly mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    }

    public constructor(camera: unknown, domElement: HTMLElement) {
      this.object = camera
      this.domElement = domElement
      orbitControlMocks.instances.push(this)
    }
  }

  return { OrbitControls }
})

import { CameraController } from './CameraController'

const createController = () => {
  const domElement = document.createElement('div')
  Object.defineProperty(domElement, 'clientHeight', {
    configurable: true,
    value: 400,
  })
  Object.defineProperty(domElement, 'clientWidth', {
    configurable: true,
    value: 400,
  })

  const perspectiveCamera = new PerspectiveCamera(45, 1, 0.1, 1000)
  perspectiveCamera.position.set(0, 0, 10)
  const orthographicCamera = new OrthographicCamera(-2, 2, 2, -2, 0.1, 1000)
  const controller = new CameraController(perspectiveCamera, orthographicCamera, domElement)
  controller.setViewportSize(400, 400)
  const controls = orbitControlMocks.instances[0]!
  controls.target.set(0, 0, 0)
  return { controller, controls, perspectiveCamera, orthographicCamera, domElement }
}

describe('CameraController', () => {
  beforeEach(() => {
    orbitControlMocks.instances.length = 0
  })

  it('rotates during a temporary orbit drag and stops after release', () => {
    const { controller, controls } = createController()

    controller.beginTemporaryOrbitDrag(100, 100)
    controller.updateTemporaryOrbitDrag(140, 120)

    expect(controls.rotateLeft).toHaveBeenCalledWith((Math.PI * 2 * 40) / 400)
    expect(controls.rotateUp).toHaveBeenCalledWith((Math.PI * 2 * 20) / 400)
    expect(controls.update).toHaveBeenCalledTimes(1)

    controller.endTemporaryOrbitDrag()
    controller.updateTemporaryOrbitDrag(200, 220)

    expect(controls.rotateLeft).toHaveBeenCalledTimes(1)
    expect(controls.rotateUp).toHaveBeenCalledTimes(1)
  })

  it('can disable and restore left-button orbit ownership without affecting other mouse buttons', () => {
    const { controller, controls } = createController()

    expect(controls.mouseButtons.LEFT).toBeNull()
    expect(controls.mouseButtons.MIDDLE).toBe(MOUSE.PAN)
    expect(controls.mouseButtons.RIGHT).toBeNull()

    controller.setLeftButtonOrbitEnabled(true)
    expect(controls.mouseButtons.LEFT).toBe(MOUSE.ROTATE)

    controller.setLeftButtonOrbitEnabled(false)
    expect(controls.mouseButtons.LEFT).toBeNull()
  })

  it('pans the camera and orbit target during a temporary pan drag and stops after release', () => {
    const { controller, controls, perspectiveCamera } = createController()
    controls.update.mockClear()
    const initialPosition = perspectiveCamera.position.clone()
    const initialTarget = controls.target.clone()

    controller.beginTemporaryPanDrag(100, 100)
    controller.updateTemporaryPanDrag(140, 120)

    expect(perspectiveCamera.position.equals(initialPosition)).toBe(false)
    expect(controls.target.equals(initialTarget)).toBe(false)
    expect(controls.update).toHaveBeenCalledTimes(1)

    const positionAfterDrag = perspectiveCamera.position.clone()
    const targetAfterDrag = controls.target.clone()
    controller.endTemporaryPanDrag()
    controller.updateTemporaryPanDrag(180, 160)

    expect(perspectiveCamera.position.toArray()).toEqual(positionAfterDrag.toArray())
    expect(controls.target.toArray()).toEqual(targetAfterDrag.toArray())
  })

  it('pans orthographic views along the camera screen axes', () => {
    const { controller, controls, orthographicCamera } = createController()
    controller.setProjectionMode('orthographic')
    controller.snapToDirection(new Vector3(0, 1, 0))
    controls.update.mockClear()

    const startPosition = orthographicCamera.position.clone()
    const startTarget = controls.target.clone()

    controller.beginTemporaryPanDrag(100, 100)
    controller.updateTemporaryPanDrag(140, 120)

    expect(orthographicCamera.position.y).toBeCloseTo(startPosition.y, 6)
    expect(controls.target.y).toBeCloseTo(startTarget.y, 6)
    expect(orthographicCamera.position.x).not.toBeCloseTo(startPosition.x, 6)
    expect(controls.target.x).not.toBeCloseTo(startTarget.x, 6)
    expect(orthographicCamera.position.z).not.toBeCloseTo(startPosition.z, 6)
    expect(controls.target.z).not.toBeCloseTo(startTarget.z, 6)
    expect(controls.update).toHaveBeenCalledTimes(1)
  })

  it('supports pure vertical orthographic pan drags', () => {
    const { controller, controls, orthographicCamera } = createController()
    controller.setProjectionMode('orthographic')
    controller.snapToDirection(new Vector3(0, 1, 0))

    const startPosition = orthographicCamera.position.clone()
    const startTarget = controls.target.clone()

    controller.beginTemporaryPanDrag(100, 100)
    controller.updateTemporaryPanDrag(100, 140)

    expect(orthographicCamera.position.y).toBeCloseTo(startPosition.y, 6)
    expect(controls.target.y).toBeCloseTo(startTarget.y, 6)
    expect(orthographicCamera.position.x).toBeCloseTo(startPosition.x, 6)
    expect(controls.target.x).toBeCloseTo(startTarget.x, 6)
    expect(orthographicCamera.position.z).not.toBeCloseTo(startPosition.z, 6)
    expect(controls.target.z).not.toBeCloseTo(startTarget.z, 6)
  })

  it('supports pure vertical orthographic pan in a plane-aligned front view', () => {
    const { controller, controls, orthographicCamera } = createController()
    controller.setProjectionMode('orthographic')
    controller.animateToDirection(new Vector3(0, 0, 1), {
      up: new Vector3(0, 1, 0),
      durationMs: 1,
    })
    controller.update(1)

    const startPosition = orthographicCamera.position.clone()
    const startTarget = controls.target.clone()

    controller.beginTemporaryPanDrag(100, 100)
    controller.updateTemporaryPanDrag(100, 140)

    expect(orthographicCamera.position.z).toBeCloseTo(startPosition.z, 6)
    expect(controls.target.z).toBeCloseTo(startTarget.z, 6)
    expect(orthographicCamera.position.x).toBeCloseTo(startPosition.x, 6)
    expect(controls.target.x).toBeCloseTo(startTarget.x, 6)
    expect(orthographicCamera.position.y).not.toBeCloseTo(startPosition.y, 6)
    expect(controls.target.y).not.toBeCloseTo(startTarget.y, 6)
  })

  it('zooms perspective by changing camera distance and orthographic by changing view height', () => {
    const { controller, controls, perspectiveCamera } = createController()
    controls.update.mockClear()

    const perspectiveDistanceBefore = perspectiveCamera.position.distanceTo(controls.target)
    controller.zoomByWheelDelta(-120)
    expect(perspectiveCamera.position.distanceTo(controls.target)).toBeLessThan(perspectiveDistanceBefore)

    controller.setProjectionMode('orthographic')
    const orthographicPoseBefore = controller.getPose()
    controller.zoomByWheelDelta(-120)
    const orthographicPoseAfter = controller.getPose()

    expect(orthographicPoseAfter.position.toArray()).toEqual(orthographicPoseBefore.position.toArray())
    expect(orthographicPoseAfter.orthoViewHeight).toBeLessThan(orthographicPoseBefore.orthoViewHeight)
  })

  it('applies fly-look deltas by rotating the camera target around the current position', () => {
    const { controller, controls, perspectiveCamera } = createController()
    controls.update.mockClear()
    const targetBefore = controls.target.clone()

    controller.applyFlyLookDelta(40, 0)

    expect(controls.target.toArray()).not.toEqual(targetBefore.toArray())
    expect(perspectiveCamera.position.toArray()).toEqual([0, 0, 10])
    expect(controls.update).toHaveBeenCalledTimes(1)
  })

  it('translates fly movement by moving both the camera position and orbit target together', () => {
    const { controller, controls, perspectiveCamera } = createController()
    controls.update.mockClear()
    const positionBefore = perspectiveCamera.position.clone()
    const targetBefore = controls.target.clone()

    controller.translateFly(1, 0.5, 0.25)

    expect(perspectiveCamera.position.toArray()).not.toEqual(positionBefore.toArray())
    expect(controls.target.toArray()).not.toEqual(targetBefore.toArray())
    expect(
      perspectiveCamera.position.clone().sub(positionBefore).toArray(),
    ).toEqual(controls.target.clone().sub(targetBefore).toArray())
    expect(controls.update).toHaveBeenCalledTimes(1)
  })

  it('rolls the fly camera around the current forward axis and can remain upside down', () => {
    const { controller, controls, perspectiveCamera } = createController()
    controls.update.mockClear()

    controller.applyFlyRollDelta(Math.PI)

    expect(perspectiveCamera.up.x).toBeCloseTo(0, 6)
    expect(perspectiveCamera.up.y).toBeCloseTo(-1, 6)
    expect(controls.target.toArray()).toEqual([0, 0, 0])
    expect(controls.update).toHaveBeenCalledTimes(1)
  })

  it('moves along the rolled local up axis after fly roll is applied', () => {
    const { controller, controls, perspectiveCamera } = createController()
    controls.update.mockClear()

    controller.applyFlyRollDelta(Math.PI / 2)

    const positionBefore = perspectiveCamera.position.clone()
    const targetBefore = controls.target.clone()

    controller.translateFly(0, 0, 1)

    expect(perspectiveCamera.position.x).toBeGreaterThan(positionBefore.x)
    expect(controls.target.x).toBeGreaterThan(targetBefore.x)
    expect(perspectiveCamera.position.y).toBeCloseTo(positionBefore.y, 6)
    expect(controls.target.y).toBeCloseTo(targetBefore.y, 6)
  })

  it('frames a client drag window on the target plane in both projection modes', () => {
    const { controller, controls, perspectiveCamera } = createController()

    const perspectiveDistanceBefore = perspectiveCamera.position.distanceTo(controls.target)
    expect(controller.frameWindowClientRect(100, 100, 300, 300)).toBe(true)
    const perspectiveDistanceAfter = perspectiveCamera.position.distanceTo(controls.target)
    expect(perspectiveDistanceAfter).toBeLessThan(perspectiveDistanceBefore)

    controller.setProjectionMode('orthographic')
    const orthoPoseBefore = controller.getPose()
    expect(controller.frameWindowClientRect(100, 100, 300, 300)).toBe(true)
    const orthoPoseAfter = controller.getPose()
    expect(orthoPoseAfter.orthoViewHeight).toBeLessThan(orthoPoseBefore.orthoViewHeight)
  })

  it('preserves framing when switching between perspective and orthographic', () => {
    const { controller, controls } = createController()
    controls.target.set(2, 3, 4)
    controller.getActiveCamera().position.set(8, 9, 10)
    controller.getActiveCamera().up.set(0, 1, 0)

    const perspectivePose = controller.getPose()
    controller.setProjectionMode('orthographic')
    const orthographicPose = controller.getPose()

    expect(orthographicPose.position.toArray()).toEqual(perspectivePose.position.toArray())
    expect(orthographicPose.target.toArray()).toEqual(perspectivePose.target.toArray())
    expect(orthographicPose.up.toArray()).toEqual(perspectivePose.up.toArray())
    expect(orthographicPose.projectionMode).toBe('orthographic')

    controller.setProjectionMode('perspective')
    const roundTripPose = controller.getPose()
    expect(roundTripPose.projectionMode).toBe('perspective')
    expect(roundTripPose.position.toArray()).toEqual(perspectivePose.position.toArray())
    expect(roundTripPose.target.toArray()).toEqual(perspectivePose.target.toArray())
    expect(roundTripPose.perspectiveFovDeg).toBeCloseTo(perspectivePose.perspectiveFovDeg, 6)
  })

  it('frames bounds correctly in orthographic mode', () => {
    const { controller, orthographicCamera } = createController()
    controller.setProjectionMode('orthographic')

    const box = new Mesh(new BoxGeometry(10, 4, 2), new MeshBasicMaterial())
    controller.frameObject(box)

    const orthoHeight = orthographicCamera.top - orthographicCamera.bottom
    const orthoWidth = orthographicCamera.right - orthographicCamera.left
    expect(orthoWidth).toBeGreaterThanOrEqual(10)
    expect(orthoHeight).toBeGreaterThanOrEqual(4)
  })

  it('stores projection metadata in camera poses and can animate back to an orthographic pose', () => {
    const { controller } = createController()
    controller.setProjectionMode('orthographic')
    const orthoPose = controller.getPose()

    controller.setProjectionMode('perspective')
    controller.animateToPose(orthoPose, { durationMs: 1 })
    controller.update(1)

    const restoredPose = controller.getPose()
    expect(restoredPose.projectionMode).toBe('orthographic')
    expect(restoredPose.orthoViewHeight).toBeCloseTo(orthoPose.orthoViewHeight, 6)
  })

  it('honors an explicit up vector when animating to a direction', () => {
    const { controller } = createController()
    controller.animateToDirection(new Vector3(0, 0, 1), {
      up: new Vector3(1, 0, 0),
      durationMs: 1,
    })
    controller.update(1)

    const pose = controller.getPose()
    expect(pose.up.x).toBeCloseTo(1, 6)
    expect(pose.up.y).toBeCloseTo(0, 6)
    expect(pose.up.z).toBeCloseTo(0, 6)
  })

  it('tracks an object without changing camera distance', () => {
    const { controller, controls, perspectiveCamera } = createController()
    perspectiveCamera.position.set(10, 10, 10)

    const object = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
    object.position.set(20, 0, 0)

    const distanceBefore = perspectiveCamera.position.distanceTo(controls.target)
    const nextCenter = controller.trackObject(object)

    expect(controls.target.x).toBe(20)
    expect(perspectiveCamera.position.distanceTo(controls.target)).toBeCloseTo(distanceBefore, 6)
    expect(nextCenter?.x).toBe(20)
  })

  it('scales orthographic height proportionally while tracking scaled objects', () => {
    const { controller } = createController()
    controller.setProjectionMode('orthographic')

    const object = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
    object.position.set(20, 0, 0)

    const firstMetrics = controller.trackScaledObject(object, object.position.clone(), 2)
    const firstPose = controller.getPose()

    object.scale.setScalar(2)
    const scaledMetrics = controller.trackScaledObject(
      object,
      firstMetrics.center,
      firstMetrics.maxDim,
    )
    const scaledPose = controller.getPose()

    expect(scaledMetrics.maxDim).toBeCloseTo(4, 6)
    expect(scaledPose.orthoViewHeight).toBeGreaterThan(firstPose.orthoViewHeight)
  })

  it('preserves orbit target offset while scaling a locked object', () => {
    const { controller, controls, perspectiveCamera } = createController()
    perspectiveCamera.position.set(12, 0, 0)
    controls.target.set(2, 0, 0)

    const object = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
    const scaleAnchor = new Vector3(0, 0, 0)
    const scaleTarget = new Vector3(2, 0, 0)
    const distanceBefore = perspectiveCamera.position.distanceTo(scaleTarget)

    const firstMetrics = controller.trackScaledObject(object, scaleAnchor, 2, scaleTarget)
    object.scale.setScalar(2)
    const scaledMetrics = controller.trackScaledObject(
      object,
      scaleAnchor,
      firstMetrics.maxDim,
      scaleTarget,
    )

    expect(scaledMetrics.maxDim).toBeCloseTo(4, 6)
    expect(controls.target.toArray()).toEqual([2, 0, 0])
    expect(perspectiveCamera.position.distanceTo(scaleTarget)).toBeCloseTo(distanceBefore * 2, 6)
  })

  it('keeps a pivot anchor stable while scaling an off-center object', () => {
    const { controller, controls, perspectiveCamera } = createController()
    perspectiveCamera.position.set(10, 0, 0)

    const pivot = new Group()
    const geometry = new BoxGeometry(2, 2, 2)
    geometry.translate(2, 0, 0)
    const object = new Mesh(geometry, new MeshBasicMaterial())
    pivot.add(object)

    const scaleAnchor = new Vector3(0, 0, 0)
    const distanceBefore = perspectiveCamera.position.distanceTo(scaleAnchor)
    const firstMetrics = controller.trackScaledObject(pivot, scaleAnchor, 2)

    pivot.scale.setScalar(2)
    const scaledMetrics = controller.trackScaledObject(
      pivot,
      scaleAnchor,
      firstMetrics.maxDim,
    )

    expect(scaledMetrics.maxDim).toBeCloseTo(4, 6)
    expect(controls.target.toArray()).toEqual([0, 0, 0])
    expect(perspectiveCamera.position.distanceTo(scaleAnchor)).toBeCloseTo(distanceBefore * 2, 6)
  })
})
