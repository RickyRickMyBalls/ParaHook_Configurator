// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PerspectiveCamera } from 'three'

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
})
