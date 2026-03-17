// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Vector3 } from 'three'

const orbitControlMocks = vi.hoisted(() => ({
  instances: [] as Array<{
    rotateLeft: ReturnType<typeof vi.fn>
    rotateUp: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
  }>,
}))

vi.mock('three/examples/jsm/controls/OrbitControls.js', async () => {
  const { Vector3 } = await import('three')

  class OrbitControls {
    public readonly domElement: HTMLElement
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

    public constructor(_camera: unknown, domElement: HTMLElement) {
      this.domElement = domElement
      orbitControlMocks.instances.push(this)
    }
  }

  return { OrbitControls }
})

import { CameraController } from './CameraController'

describe('CameraController temporary orbit drag', () => {
  beforeEach(() => {
    orbitControlMocks.instances.length = 0
  })

  it('rotates the viewer during a temporary orbit drag and stops after release', () => {
    const domElement = document.createElement('div')
    Object.defineProperty(domElement, 'clientHeight', {
      configurable: true,
      value: 400,
    })

    const controller = new CameraController(
      new PerspectiveCamera(45, 1, 0.1, 1000),
      domElement,
    )
    const controls = orbitControlMocks.instances[0]

    expect(controls).toBeDefined()

    controller.beginTemporaryOrbitDrag(100, 100)
    controller.updateTemporaryOrbitDrag(140, 120)

    expect(controls.rotateLeft).toHaveBeenCalledTimes(1)
    expect(controls.rotateUp).toHaveBeenCalledTimes(1)
    expect(controls.rotateLeft).toHaveBeenCalledWith((Math.PI * 2 * 40) / 400)
    expect(controls.rotateUp).toHaveBeenCalledWith((Math.PI * 2 * 20) / 400)
    expect(controls.update).toHaveBeenCalledTimes(1)

    controller.endTemporaryOrbitDrag()
    controller.updateTemporaryOrbitDrag(200, 220)

    expect(controls.rotateLeft).toHaveBeenCalledTimes(1)
    expect(controls.rotateUp).toHaveBeenCalledTimes(1)
    expect(controls.update).toHaveBeenCalledTimes(1)
  })

  it('tracks an object without changing camera distance', async () => {
    const domElement = document.createElement('div')
    Object.defineProperty(domElement, 'clientHeight', {
      configurable: true,
      value: 400,
    })

    const camera = new PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.set(10, 10, 10)

    const controller = new CameraController(camera, domElement)
    const controls = orbitControlMocks.instances[0]
    controls.target.set(0, 0, 0)

    const object = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
    object.position.set(20, 0, 0)

    const distanceBefore = camera.position.distanceTo(controls.target)

    const nextCenter = controller.trackObject(object)

    expect(controls.target.x).toBe(20)
    expect(controls.target.y).toBe(0)
    expect(controls.target.z).toBe(0)
    expect(camera.position.distanceTo(controls.target)).toBeCloseTo(distanceBefore, 6)
    expect(nextCenter?.x).toBe(20)
    expect(controls.update).toHaveBeenCalled()
  })

  it('scales camera distance proportionally to object size while preserving current zoom ratio', async () => {
    const domElement = document.createElement('div')
    Object.defineProperty(domElement, 'clientHeight', {
      configurable: true,
      value: 400,
    })

    const camera = new PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.set(10, 0, 0)

    const controller = new CameraController(camera, domElement)
    const controls = orbitControlMocks.instances[0]
    controls.target.set(0, 0, 0)

    const object = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
    object.position.set(20, 0, 0)
    const lockCenter = object.position.clone()
    const distanceBefore = camera.position.distanceTo(lockCenter)

    const firstMetrics = controller.trackScaledObject(object, lockCenter, 2)

    expect(firstMetrics.maxDim).toBeCloseTo(2, 6)
    expect(firstMetrics.center?.x).toBeCloseTo(20, 6)
    expect(camera.position.distanceTo(controls.target)).toBeCloseTo(distanceBefore, 6)

    object.scale.setScalar(2)
    const scaledMetrics = controller.trackScaledObject(
      object,
      firstMetrics.center,
      firstMetrics.maxDim,
    )

    expect(scaledMetrics.maxDim).toBeCloseTo(4, 6)
    expect(camera.position.distanceTo(controls.target)).toBeCloseTo(distanceBefore * 2, 6)
    expect(controls.update).toHaveBeenCalled()
  })

  it('keeps a pivot anchor stable while scaling an off-center object', async () => {
    const domElement = document.createElement('div')
    Object.defineProperty(domElement, 'clientHeight', {
      configurable: true,
      value: 400,
    })

    const camera = new PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.set(10, 0, 0)

    const controller = new CameraController(camera, domElement)
    const controls = orbitControlMocks.instances[0]
    controls.target.set(0, 0, 0)

    const pivot = new Group()
    const geometry = new BoxGeometry(2, 2, 2)
    geometry.translate(2, 0, 0)
    const object = new Mesh(geometry, new MeshBasicMaterial())
    pivot.add(object)

    const scaleAnchor = new Vector3(0, 0, 0)
    const distanceBefore = camera.position.distanceTo(scaleAnchor)

    const firstMetrics = controller.trackScaledObject(pivot, scaleAnchor, 2)

    expect(firstMetrics.maxDim).toBeCloseTo(2, 6)
    expect(camera.position.distanceTo(scaleAnchor)).toBeCloseTo(distanceBefore, 6)

    pivot.scale.setScalar(2)
    const scaledMetrics = controller.trackScaledObject(
      pivot,
      scaleAnchor,
      firstMetrics.maxDim,
    )

    expect(scaledMetrics.maxDim).toBeCloseTo(4, 6)
    expect(controls.target.x).toBeCloseTo(0, 6)
    expect(controls.target.y).toBeCloseTo(0, 6)
    expect(controls.target.z).toBeCloseTo(0, 6)
    expect(camera.position.distanceTo(scaleAnchor)).toBeCloseTo(distanceBefore * 2, 6)
  })

  it('preserves the current orbit target offset while scaling a locked object', async () => {
    const domElement = document.createElement('div')
    Object.defineProperty(domElement, 'clientHeight', {
      configurable: true,
      value: 400,
    })

    const camera = new PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.set(12, 0, 0)

    const controller = new CameraController(camera, domElement)
    const controls = orbitControlMocks.instances[0]
    controls.target.set(2, 0, 0)

    const object = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
    const scaleAnchor = new Vector3(0, 0, 0)
    const scaleTarget = new Vector3(2, 0, 0)
    const distanceBefore = camera.position.distanceTo(scaleTarget)

    const firstMetrics = controller.trackScaledObject(object, scaleAnchor, 2, scaleTarget)
    expect(firstMetrics.maxDim).toBeCloseTo(2, 6)

    object.scale.setScalar(2)
    const scaledMetrics = controller.trackScaledObject(
      object,
      scaleAnchor,
      firstMetrics.maxDim,
      scaleTarget,
    )

    expect(scaledMetrics.maxDim).toBeCloseTo(4, 6)
    expect(controls.target.x).toBeCloseTo(2, 6)
    expect(controls.target.y).toBeCloseTo(0, 6)
    expect(controls.target.z).toBeCloseTo(0, 6)
    expect(camera.position.distanceTo(scaleTarget)).toBeCloseTo(distanceBefore * 2, 6)
  })
})
