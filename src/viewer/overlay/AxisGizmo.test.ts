// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three')

  class MockWebGLRenderer {
    public constructor(_options?: unknown) {}

    public setClearColor(_color: unknown, _alpha?: number): void {}

    public setPixelRatio(_ratio: number): void {}

    public render(): void {}

    public setSize(_width: number, _height: number, _updateStyle?: boolean): void {}

    public dispose(): void {}
  }

  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  }
})

import {
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three'
import { AxisGizmo, type AxisGizmoTarget } from './AxisGizmo'

type TestAxisGizmoInternals = {
  camera: PerspectiveCamera
  root: Group
  pickables: unknown[]
}

const asTestGizmo = (gizmo: AxisGizmo): TestAxisGizmoInternals =>
  gizmo as unknown as TestAxisGizmoInternals

const assertDefined = <T>(value: T | undefined | null): T => {
  expect(value).toBeDefined()
  if (value === undefined || value === null) {
    throw new Error('Expected value to be defined')
  }
  return value
}

const createCanvas = () => {
  const canvas = document.createElement('canvas')
  Object.defineProperty(canvas, 'clientWidth', {
    configurable: true,
    value: 128,
  })
  Object.defineProperty(canvas, 'clientHeight', {
    configurable: true,
    value: 128,
  })
  Object.defineProperty(canvas, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      left: 0,
      top: 0,
      width: 128,
      height: 128,
      right: 128,
      bottom: 128,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  })
  return canvas
}

const projectToCanvas = (worldPoint: Vector3, gizmo: TestAxisGizmoInternals) => {
  const projected = worldPoint.clone().project(gizmo.camera)
  return {
    clientX: ((projected.x + 1) / 2) * 128,
    clientY: ((1 - projected.y) / 2) * 128,
  }
}

describe('AxisGizmo', () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext

  beforeEach(() => {
    const getContextMock = function (this: HTMLCanvasElement, contextId: string) {
      if (contextId !== '2d') {
        return null
      }
      return {
        clearRect() {},
        strokeText() {},
        fillText() {},
        font: '',
        textAlign: 'center',
        textBaseline: 'middle',
        lineJoin: 'round',
        lineWidth: 0,
        strokeStyle: '',
        fillStyle: '',
      } as unknown as CanvasRenderingContext2D
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      getContextMock as unknown as HTMLCanvasElement['getContext'],
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    HTMLCanvasElement.prototype.getContext = originalGetContext
  })

  it('keeps the dense interior connector web visual-only while spheres and outer edges are the exposed snap targets', () => {
    const canvas = createCanvas()
    const gizmo = new AxisGizmo(canvas)
    const testGizmo = asTestGizmo(gizmo)
    const { root, pickables } = testGizmo

    const connector = root.children.find(
      (child: { name?: string }) => child.name === 'axisGizmoConnectorCage',
    ) as LineSegments | undefined
    const labels = root.children.filter((child: { name?: string }) =>
      child.name?.startsWith('axisGizmoLabel_'),
    )

    expect(connector).toBeDefined()
    expect(connector).toBeInstanceOf(LineSegments)
    expect(labels).toHaveLength(6)
    expect(pickables).toHaveLength(26)
    expect(pickables.filter((entry: unknown) => entry instanceof Mesh)).toHaveLength(14)
    expect(pickables.filter((entry: unknown) => entry instanceof LineSegments)).toHaveLength(12)
    expect(
      pickables
        .filter((entry: unknown): entry is Mesh => entry instanceof Mesh)
        .every((entry) => entry.geometry instanceof SphereGeometry),
    ).toBe(true)
    expect(pickables).not.toContain(connector)
    expect(connector?.geometry.getAttribute('position').count).toBe(158)
    expect((connector?.material as LineBasicMaterial | undefined)?.opacity).toBeCloseTo(0.1)
    expect(testGizmo.camera.position.z).toBeCloseTo(4.5)

    gizmo.dispose()
  })

  it('applies separate line-family opacity, sphere scaling, and label visibility settings', () => {
    const canvas = createCanvas()
    const gizmo = new AxisGizmo(canvas)
    const testGizmo = asTestGizmo(gizmo)
    const { root, pickables } = testGizmo

    const connector = root.children.find(
      (child: { name?: string }) => child.name === 'axisGizmoConnectorCage',
    ) as LineSegments | undefined
    const edgeLine = pickables.find((entry: unknown) => entry instanceof LineSegments) as
      | LineSegments
      | undefined
    const sphere = pickables.find((entry: unknown) => entry instanceof Mesh) as Mesh | undefined
    const label = root.children.find((child: { name?: string }) => child.name === 'axisGizmoLabel_X') as
      | { visible?: boolean; scale?: Vector3 }
      | undefined

    gizmo.setStyle({
      mainLineOpacity: 0.44,
      secondaryLineOpacity: 0.09,
      sphereScale: 1.4,
      cameraDistance: 4.2,
      labelsVisible: false,
      labelSize: 'large',
      backgroundMode: 'none',
      backgroundOpacity: 0,
    })

    expect((edgeLine?.material as LineBasicMaterial | undefined)?.opacity).toBeCloseTo(0.44)
    expect((connector?.material as LineBasicMaterial | undefined)?.opacity).toBeCloseTo(0.09)
    expect(sphere?.scale.x).toBeCloseTo(1.4)
    expect(sphere?.scale.y).toBeCloseTo(1.4)
    expect(testGizmo.camera.position.z).toBeCloseTo(4.2)
    expect(label?.visible).toBe(false)

    gizmo.setStyle({
      mainLineOpacity: 0.2,
      secondaryLineOpacity: 0.12,
      sphereScale: 0.9,
      cameraDistance: 2.75,
      labelsVisible: true,
      labelSize: 'small',
      backgroundMode: 'blur',
      backgroundOpacity: 0,
    })

    expect(label?.visible).toBe(true)
    expect(label?.scale?.x).toBeGreaterThan(0)

    gizmo.dispose()
  })

  it('emits the true corner target on pointer release when a corner sphere is clicked without dragging', () => {
    const canvas = createCanvas()
    const gizmo = new AxisGizmo(canvas)
    const testGizmo = asTestGizmo(gizmo)
    gizmo.renderFromCameraQuaternion(new Quaternion())
    const { pickables } = testGizmo

    const cornerSphere = pickables.find(
      (entry: unknown) =>
        entry instanceof Mesh &&
        (entry as Mesh & { userData?: { orientationTarget?: AxisGizmoTarget } }).userData?.orientationTarget?.kind ===
          'corner' &&
        (entry as Mesh & { userData?: { orientationTarget?: AxisGizmoTarget } }).userData?.orientationTarget?.direction.join(
          ',',
        ) === '1,1,1',
    ) as (Mesh & { userData: { orientationTarget: AxisGizmoTarget } }) | undefined

    const resolvedCornerSphere = assertDefined(cornerSphere)

    let emittedTarget: AxisGizmoTarget | null = null
    gizmo.setOnTargetSelected((target) => {
      emittedTarget = target
    })

    const { clientX, clientY } = projectToCanvas(resolvedCornerSphere.position.clone(), testGizmo)
    gizmo.beginPointerInteraction(1, clientX, clientY)
    expect(emittedTarget).toBeNull()
    gizmo.endPointerInteraction(1)

    expect(emittedTarget).toEqual({
      kind: 'corner',
      direction: [1, 1, 1],
    })

    gizmo.dispose()
  })

  it('emits the correct outer-edge target on pointer release when an outer edge line is clicked without dragging', () => {
    const canvas = createCanvas()
    const gizmo = new AxisGizmo(canvas)
    const testGizmo = asTestGizmo(gizmo)
    gizmo.renderFromCameraQuaternion(new Quaternion())
    const { pickables } = testGizmo

    const edgeLine = pickables.find(
      (entry: unknown) =>
        entry instanceof LineSegments &&
        (entry as LineSegments & { userData?: { orientationTarget?: AxisGizmoTarget } }).userData?.orientationTarget?.kind ===
          'edge' &&
        (
          entry as LineSegments & {
            userData?: { orientationTarget?: AxisGizmoTarget }
          }
        ).userData?.orientationTarget?.direction.join(',') === '0,1,1',
    ) as (LineSegments & { userData: { orientationTarget: AxisGizmoTarget } }) | undefined

    const resolvedEdgeLine = assertDefined(edgeLine)

    const positionAttribute = resolvedEdgeLine.geometry.getAttribute('position')
    const midpoint = new Vector3(
      (positionAttribute.getX(0) + positionAttribute.getX(1)) / 2,
      (positionAttribute.getY(0) + positionAttribute.getY(1)) / 2,
      (positionAttribute.getZ(0) + positionAttribute.getZ(1)) / 2,
    )

    let emittedTarget: AxisGizmoTarget | null = null
    gizmo.setOnTargetSelected((target) => {
      emittedTarget = target
    })

    const { clientX, clientY } = projectToCanvas(midpoint, testGizmo)
    gizmo.beginPointerInteraction(2, clientX, clientY)
    expect(emittedTarget).toBeNull()
    gizmo.endPointerInteraction(2)

    expect(emittedTarget).toEqual({
      kind: 'edge',
      direction: [0, 1, 1],
    })

    gizmo.dispose()
  })

  it('promotes only the hovered outer edge line and restores the default treatment on leave', () => {
    const canvas = createCanvas()
    const gizmo = new AxisGizmo(canvas)
    const testGizmo = asTestGizmo(gizmo)
    gizmo.renderFromCameraQuaternion(new Quaternion())
    const { pickables } = testGizmo

    const hoveredEdgeLine = pickables.find(
      (entry: unknown) =>
        entry instanceof LineSegments &&
        (entry as LineSegments & { userData?: { orientationTarget?: AxisGizmoTarget } }).userData?.orientationTarget?.kind ===
          'edge' &&
        (
          entry as LineSegments & {
            userData?: { orientationTarget?: AxisGizmoTarget }
          }
        ).userData?.orientationTarget?.direction.join(',') === '0,1,1',
    ) as (LineSegments & { userData: { orientationTarget: AxisGizmoTarget } }) | undefined
    const otherEdgeLine = pickables.find(
      (entry: unknown) =>
        entry instanceof LineSegments &&
        (entry as LineSegments & { userData?: { orientationTarget?: AxisGizmoTarget } }).userData?.orientationTarget?.kind ===
          'edge' &&
        (
          entry as LineSegments & {
            userData?: { orientationTarget?: AxisGizmoTarget }
          }
        ).userData?.orientationTarget?.direction.join(',') === '1,0,1',
    ) as (LineSegments & { userData: { orientationTarget: AxisGizmoTarget } }) | undefined

    const resolvedHoveredEdgeLine = assertDefined(hoveredEdgeLine)
    const resolvedOtherEdgeLine = assertDefined(otherEdgeLine)

    gizmo.setStyle({
      mainLineOpacity: 0.2,
      secondaryLineOpacity: 0.1,
      sphereScale: 1,
      cameraDistance: 4.5,
      labelsVisible: true,
      labelSize: 'medium',
      backgroundMode: 'none',
      backgroundOpacity: 0,
    })

    const positionAttribute = resolvedHoveredEdgeLine.geometry.getAttribute('position')
    const midpoint = new Vector3(
      (positionAttribute.getX(0) + positionAttribute.getX(1)) / 2,
      (positionAttribute.getY(0) + positionAttribute.getY(1)) / 2,
      (positionAttribute.getZ(0) + positionAttribute.getZ(1)) / 2,
    )

    const { clientX, clientY } = projectToCanvas(midpoint, testGizmo)
    gizmo.updatePointerHover(clientX, clientY)

    expect((resolvedHoveredEdgeLine.material as LineBasicMaterial).opacity).toBeCloseTo(0.72)
    expect((resolvedOtherEdgeLine.material as LineBasicMaterial).opacity).toBeCloseTo(0.2)

    gizmo.clearPointerHover()

    expect((resolvedHoveredEdgeLine.material as LineBasicMaterial).opacity).toBeCloseTo(0.2)
    expect((resolvedOtherEdgeLine.material as LineBasicMaterial).opacity).toBeCloseTo(0.2)

    gizmo.dispose()
  })

  it('switches from pending helper click to orbit drag once the drag threshold is exceeded', () => {
    const canvas = createCanvas()
    const gizmo = new AxisGizmo(canvas)
    gizmo.renderFromCameraQuaternion(new Quaternion())

    const orbitEvents: string[] = []
    let emittedTarget: AxisGizmoTarget | null = null

    gizmo.setOnTargetSelected((target) => {
      emittedTarget = target
    })
    gizmo.setOnOrbitDragStart((clientX, clientY) => {
      orbitEvents.push(`start:${clientX},${clientY}`)
    })
    gizmo.setOnOrbitDragMove((clientX, clientY) => {
      orbitEvents.push(`move:${clientX},${clientY}`)
    })
    gizmo.setOnOrbitDragEnd(() => {
      orbitEvents.push('end')
    })

    gizmo.beginPointerInteraction(3, 64, 64)
    gizmo.updatePointerInteraction(3, 70, 70)
    gizmo.endPointerInteraction(3)

    expect(orbitEvents).toEqual(['start:64,64', 'move:70,70', 'end'])
    expect(emittedTarget).toBeNull()

    gizmo.dispose()
  })
})
