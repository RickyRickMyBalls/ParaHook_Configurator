import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Object3D,
  Points,
  PointsMaterial,
  Quaternion,
  Vector3,
} from 'three'
import type { ActiveReferenceTransformHandle } from '../app/store/useAppStore'

const MOVE_SNAP_POINT_COLOR = '#ffffff'
const MOVE_SNAP_POINT_SIZE = 7
const MOVE_SNAP_RENDER_ORDER = 113
const AXIS_NEIGHBOR_RADIUS = 3
const PLANE_NEIGHBOR_RADIUS = 2
const CENTER_NEIGHBOR_RADIUS = 1

type GizmoSpace = 'local' | 'world'
type MoveSnapHandle =
  | {
      mode: 'translate'
      kind: 'axis'
      axis: 'x' | 'y' | 'z'
    }
  | {
      mode: 'translate'
      kind: 'plane'
      plane: 'xy' | 'xz' | 'yz'
    }
  | {
      mode: 'translate'
      kind: 'center'
    }

export type ReferenceTransformMoveSnapOverlay = {
  handle: MoveSnapHandle
  snapValues: { x: number; y: number; z: number }
  space: GizmoSpace
}

const isFinitePositive = (value: number): boolean => Number.isFinite(value) && value > 0

const getOrientedAxes = (
  referenceObject: Object3D,
  space: GizmoSpace,
): Record<'x' | 'y' | 'z', Vector3> => {
  const rotation = space === 'local' ? referenceObject.getWorldQuaternion(new Quaternion()) : null
  const orient = (vector: Vector3): Vector3 =>
    (rotation === null ? vector.clone() : vector.clone().applyQuaternion(rotation)).normalize()
  return {
    x: orient(new Vector3(1, 0, 0)),
    y: orient(new Vector3(0, 1, 0)),
    z: orient(new Vector3(0, 0, 1)),
  }
}

const pushPoint = (
  positions: number[],
  origin: Vector3,
  components: Array<{ basis: Vector3; offset: number }>,
): void => {
  const point = origin.clone()
  components.forEach(({ basis, offset }) => {
    point.addScaledVector(basis, offset)
  })
  positions.push(point.x, point.y, point.z)
}

export const buildReferenceTransformMoveSnapPositions = (
  overlay: ReferenceTransformMoveSnapOverlay,
  referenceObject: Object3D,
): number[] => {
  const axes = getOrientedAxes(referenceObject, overlay.space)
  const origin = referenceObject.getWorldPosition(new Vector3())
  const positions: number[] = []

  if (overlay.handle.kind === 'axis') {
    const step = overlay.snapValues[overlay.handle.axis]
    if (!isFinitePositive(step)) {
      return positions
    }
    for (let index = -AXIS_NEIGHBOR_RADIUS; index <= AXIS_NEIGHBOR_RADIUS; index += 1) {
      pushPoint(positions, origin, [{ basis: axes[overlay.handle.axis], offset: step * index }])
    }
    return positions
  }

  if (overlay.handle.kind === 'plane') {
    const planeAxes =
      overlay.handle.plane === 'xy'
        ? (['x', 'y'] as const)
        : overlay.handle.plane === 'xz'
          ? (['x', 'z'] as const)
          : (['y', 'z'] as const)
    const firstStep = overlay.snapValues[planeAxes[0]]
    const secondStep = overlay.snapValues[planeAxes[1]]
    if (!isFinitePositive(firstStep) || !isFinitePositive(secondStep)) {
      return positions
    }
    for (let firstIndex = -PLANE_NEIGHBOR_RADIUS; firstIndex <= PLANE_NEIGHBOR_RADIUS; firstIndex += 1) {
      for (
        let secondIndex = -PLANE_NEIGHBOR_RADIUS;
        secondIndex <= PLANE_NEIGHBOR_RADIUS;
        secondIndex += 1
      ) {
        pushPoint(positions, origin, [
          { basis: axes[planeAxes[0]], offset: firstStep * firstIndex },
          { basis: axes[planeAxes[1]], offset: secondStep * secondIndex },
        ])
      }
    }
    return positions
  }

  const { x, y, z } = overlay.snapValues
  if (!isFinitePositive(x) || !isFinitePositive(y) || !isFinitePositive(z)) {
    return positions
  }
  for (let xIndex = -CENTER_NEIGHBOR_RADIUS; xIndex <= CENTER_NEIGHBOR_RADIUS; xIndex += 1) {
    for (let yIndex = -CENTER_NEIGHBOR_RADIUS; yIndex <= CENTER_NEIGHBOR_RADIUS; yIndex += 1) {
      for (let zIndex = -CENTER_NEIGHBOR_RADIUS; zIndex <= CENTER_NEIGHBOR_RADIUS; zIndex += 1) {
        pushPoint(positions, origin, [
          { basis: axes.x, offset: x * xIndex },
          { basis: axes.y, offset: y * yIndex },
          { basis: axes.z, offset: z * zIndex },
        ])
      }
    }
  }
  return positions
}

export class ReferenceTransformMoveSnapHelper {
  private readonly group = new Group()
  private readonly points = new Points(
    new BufferGeometry(),
    new PointsMaterial({
      color: MOVE_SNAP_POINT_COLOR,
      size: MOVE_SNAP_POINT_SIZE,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.96,
      toneMapped: false,
      depthTest: false,
    }),
  )

  public constructor() {
    this.group.name = 'ReferenceTransformMoveSnapHelper'
    this.group.visible = false
    this.points.name = 'ReferenceTransformMoveSnapAvailabilityDots'
    this.points.frustumCulled = false
    this.points.renderOrder = MOVE_SNAP_RENDER_ORDER
    this.group.add(this.points)
  }

  public getGroup(): Group {
    return this.group
  }

  public setOverlay(
    overlay: ReferenceTransformMoveSnapOverlay | null,
    referenceObject: Object3D | null,
  ): void {
    if (overlay === null || referenceObject === null || !referenceObject.visible) {
      this.points.visible = false
      this.group.visible = false
      return
    }

    const positions = buildReferenceTransformMoveSnapPositions(overlay, referenceObject)
    this.points.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    this.points.visible = positions.length >= 3
    this.group.visible = this.points.visible
    if (this.points.visible) {
      this.points.geometry.computeBoundingSphere()
    }
  }

  public dispose(): void {
    this.points.geometry.dispose()
    const material = this.points.material
    if (Array.isArray(material)) {
      material.forEach((entry) => entry.dispose())
      return
    }
    material.dispose()
  }
}

export const isReferenceTransformMoveSnapHandle = (
  handle: ActiveReferenceTransformHandle | null,
): handle is MoveSnapHandle => handle?.mode === 'translate'
