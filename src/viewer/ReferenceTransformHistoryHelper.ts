import {
  Box3,
  BufferGeometry,
  Euler,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Object3D,
  Quaternion,
  Vector3,
} from 'three'
import type { ReferenceTransformOverride } from '../app/references/referenceManifest'
import type {
  ViewerTransformHistoryOverlayVm,
  ReferenceTransformHistoryVec3Vm,
} from '../app/viewerBridge'

const MOVE_HISTORY_COLOR = '#ff9f7a'
const HISTORY_BEFORE_COLOR = '#7cd4ff'
const HISTORY_AFTER_COLOR = '#ffd66b'
const HISTORY_ARC_COLOR = '#ffb08d'
const MIN_HISTORY_RADIUS = 12
const MAX_HISTORY_RADIUS = 96
const MOVE_HISTORY_RENDER_ORDER = 110
const ROTATE_HISTORY_RENDER_ORDER = 111
const SCALE_HISTORY_RENDER_ORDER = 112
const ARC_SEGMENT_COUNT = 28
const SPHERE_SEGMENT_COUNT = 32

const getReferenceTransformBasePosition = (referenceObject: Object3D): ReferenceTransformHistoryVec3Vm => {
  const baseTransform = referenceObject.userData.referenceTransformBase as
    | ReferenceTransformOverride
    | undefined
  return baseTransform?.position ?? { x: 0, y: 0, z: 0 }
}

const getHistoryVisualRadius = (referenceObject: Object3D): number => {
  const bounds = new Box3().setFromObject(referenceObject, true)
  if (bounds.isEmpty()) {
    return 24
  }
  const size = bounds.getSize(new Vector3())
  return Math.min(
    MAX_HISTORY_RADIUS,
    Math.max(MIN_HISTORY_RADIUS, Math.max(size.x, size.y, size.z, 0.001) * 0.22),
  )
}

const buildWorldPoint = (
  basePosition: ReferenceTransformHistoryVec3Vm,
  localPoint: ReferenceTransformHistoryVec3Vm,
): Vector3 =>
  new Vector3(
    basePosition.x + localPoint.x,
    basePosition.y + localPoint.y,
    basePosition.z + localPoint.z,
  )

const buildMoveHistoryPositions = (
  basePosition: ReferenceTransformHistoryVec3Vm,
  points: readonly ReferenceTransformHistoryVec3Vm[],
): number[] => {
  const positions: number[] = []
  for (let index = 1; index < points.length; index += 1) {
    const previous = buildWorldPoint(basePosition, points[index - 1]!)
    const current = buildWorldPoint(basePosition, points[index]!)
    positions.push(previous.x, previous.y, previous.z, current.x, current.y, current.z)
  }
  return positions
}

const getHistoryEntryOpacity = (
  index: number,
  total: number,
  minOpacity: number,
  maxOpacity: number,
): number => {
  if (total <= 1) {
    return maxOpacity
  }
  const t = index / (total - 1)
  return minOpacity + (maxOpacity - minOpacity) * t
}

const getNormalFromRotationDeg = (rotationDeg: ReferenceTransformHistoryVec3Vm): Vector3 =>
  new Vector3(0, 0, 1)
    .applyEuler(
      new Euler(
        MathUtils.degToRad(rotationDeg.x),
        MathUtils.degToRad(rotationDeg.y),
        MathUtils.degToRad(rotationDeg.z),
        'XYZ',
      ),
    )
    .normalize()

const getFallbackArcAxis = (direction: Vector3): Vector3 => {
  const xAxis = new Vector3(1, 0, 0)
  const yAxis = new Vector3(0, 1, 0)
  const fallback = Math.abs(direction.dot(xAxis)) < 0.95 ? xAxis : yAxis
  return direction.clone().cross(fallback).normalize()
}

const buildArcPoints = (
  startDirection: Vector3,
  endDirection: Vector3,
  radius: number,
): Vector3[] => {
  const start = startDirection.clone().normalize()
  const end = endDirection.clone().normalize()
  const angle = start.angleTo(end)
  if (angle < 1e-4) {
    return [start.multiplyScalar(radius), end.multiplyScalar(radius)]
  }
  let axis = start.clone().cross(end)
  if (axis.lengthSq() < 1e-6) {
    axis = getFallbackArcAxis(start)
  } else {
    axis.normalize()
  }
  const points: Vector3[] = []
  for (let index = 0; index <= ARC_SEGMENT_COUNT; index += 1) {
    const t = index / ARC_SEGMENT_COUNT
    const rotation = new Quaternion().setFromAxisAngle(axis, angle * t)
    points.push(start.clone().applyQuaternion(rotation).multiplyScalar(radius))
  }
  return points
}

const createLineSegments = (
  positions: number[],
  color: string,
  opacity: number,
  name: string,
  renderOrder: number,
): LineSegments => {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    toneMapped: false,
    depthTest: false,
  })
  const line = new LineSegments(geometry, material)
  line.name = name
  line.frustumCulled = false
  line.renderOrder = renderOrder
  line.visible = positions.length >= 6
  if (line.visible) {
    line.geometry.computeBoundingSphere()
  }
  return line
}

const createLine = (
  points: readonly Vector3[],
  color: string,
  opacity: number,
  name: string,
  renderOrder: number,
): Line => {
  const geometry = new BufferGeometry()
  geometry.setFromPoints([...points])
  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    toneMapped: false,
    depthTest: false,
  })
  const line = new Line(geometry, material)
  line.name = name
  line.frustumCulled = false
  line.renderOrder = renderOrder
  line.visible = points.length >= 2
  if (line.visible) {
    line.geometry.computeBoundingSphere()
  }
  return line
}

const buildCirclePoints = (radius: number, plane: 'xy' | 'xz' | 'yz'): Vector3[] => {
  const points: Vector3[] = []
  for (let index = 0; index <= SPHERE_SEGMENT_COUNT; index += 1) {
    const theta = (index / SPHERE_SEGMENT_COUNT) * Math.PI * 2
    const cos = Math.cos(theta) * radius
    const sin = Math.sin(theta) * radius
    if (plane === 'xy') {
      points.push(new Vector3(cos, sin, 0))
      continue
    }
    if (plane === 'xz') {
      points.push(new Vector3(cos, 0, sin))
      continue
    }
    points.push(new Vector3(0, cos, sin))
  }
  return points
}

const disposeLineObject = (object: Line | LineSegments): void => {
  object.geometry.dispose()
  const material = object.material
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose())
    return
  }
  material.dispose()
}

const disposeHistoryObjectTree = (object: Object3D): void => {
  object.traverse((child) => {
    if (child instanceof Line || child instanceof LineSegments) {
      disposeLineObject(child)
    }
  })
}

const createScaleRingGroup = (color: string, opacity: number, name: string): Group => {
  const group = new Group()
  group.name = name
  group.add(createLine(buildCirclePoints(1, 'xy'), color, opacity, `${name}:xy`, SCALE_HISTORY_RENDER_ORDER))
  group.add(createLine(buildCirclePoints(1, 'xz'), color, opacity, `${name}:xz`, SCALE_HISTORY_RENDER_ORDER))
  group.add(createLine(buildCirclePoints(1, 'yz'), color, opacity, `${name}:yz`, SCALE_HISTORY_RENDER_ORDER))
  return group
}

export class ReferenceTransformHistoryHelper {
  private readonly group = new Group()
  private readonly moveHistoryLine = createLineSegments(
    [],
    MOVE_HISTORY_COLOR,
    0.72,
    'ReferenceTransformMoveHistoryGuide',
    MOVE_HISTORY_RENDER_ORDER,
  )
  private readonly rotateHistoryGroup = new Group()
  private readonly scaleHistoryGroup = new Group()

  public constructor() {
    this.group.name = 'ReferenceTransformHistoryHelper'
    this.group.visible = false
    this.rotateHistoryGroup.name = 'ReferenceTransformRotateHistoryEntries'
    this.scaleHistoryGroup.name = 'ReferenceTransformScaleHistoryEntries'
    this.group.add(this.moveHistoryLine)
    this.group.add(this.rotateHistoryGroup)
    this.group.add(this.scaleHistoryGroup)
  }

  public getGroup(): Group {
    return this.group
  }

  public setOverlay(
    overlay: ViewerTransformHistoryOverlayVm | null,
    referenceObject: Object3D | null,
  ): void {
    this.clearDynamicHistoryEntries()
    if (overlay === null || referenceObject === null || !referenceObject.visible) {
      this.moveHistoryLine.visible = false
      this.group.visible = false
      return
    }

    const basePosition = getReferenceTransformBasePosition(referenceObject)
    const historyRadius = getHistoryVisualRadius(referenceObject)
    const movePositions = buildMoveHistoryPositions(basePosition, overlay.movePoints)
    this.moveHistoryLine.geometry.setAttribute('position', new Float32BufferAttribute(movePositions, 3))
    this.moveHistoryLine.visible = movePositions.length >= 6
    if (this.moveHistoryLine.visible) {
      this.moveHistoryLine.geometry.computeBoundingSphere()
    }

    overlay.rotateEntries.forEach((entry, index) => {
      const anchor = buildWorldPoint(basePosition, entry.position)
      const beforeDirection = getNormalFromRotationDeg(entry.beforeRotationDeg)
      const afterDirection = getNormalFromRotationDeg(entry.afterRotationDeg)
      const opacity = getHistoryEntryOpacity(index, overlay.rotateEntries.length, 0.3, 0.88)
      const radius = historyRadius * 1.05
      const entryGroup = new Group()
      entryGroup.name = `ReferenceTransformRotateHistoryEntry:${entry.entryId}`
      entryGroup.position.copy(anchor)
      entryGroup.add(
        createLineSegments(
          [0, 0, 0, beforeDirection.x * radius, beforeDirection.y * radius, beforeDirection.z * radius],
          HISTORY_BEFORE_COLOR,
          opacity * 0.75,
          `${entryGroup.name}:before`,
          ROTATE_HISTORY_RENDER_ORDER,
        ),
      )
      entryGroup.add(
        createLineSegments(
          [0, 0, 0, afterDirection.x * radius, afterDirection.y * radius, afterDirection.z * radius],
          HISTORY_AFTER_COLOR,
          opacity,
          `${entryGroup.name}:after`,
          ROTATE_HISTORY_RENDER_ORDER,
        ),
      )
      entryGroup.add(
        createLine(
          buildArcPoints(beforeDirection, afterDirection, radius),
          HISTORY_ARC_COLOR,
          opacity * 0.92,
          `${entryGroup.name}:arc`,
          ROTATE_HISTORY_RENDER_ORDER,
        ),
      )
      this.rotateHistoryGroup.add(entryGroup)
    })

    overlay.scaleEntries.forEach((entry, index) => {
      const anchor = buildWorldPoint(basePosition, entry.position)
      const opacity = getHistoryEntryOpacity(index, overlay.scaleEntries.length, 0.24, 0.78)
      const entryGroup = new Group()
      entryGroup.name = `ReferenceTransformScaleHistoryEntry:${entry.entryId}`
      entryGroup.position.copy(anchor)
      entryGroup.rotation.set(
        MathUtils.degToRad(entry.rotationDeg.x),
        MathUtils.degToRad(entry.rotationDeg.y),
        MathUtils.degToRad(entry.rotationDeg.z),
        'XYZ',
      )
      const beforeRings = createScaleRingGroup(
        HISTORY_BEFORE_COLOR,
        opacity * 0.72,
        `${entryGroup.name}:before`,
      )
      beforeRings.scale.set(
        historyRadius * entry.beforeScale.x,
        historyRadius * entry.beforeScale.y,
        historyRadius * entry.beforeScale.z,
      )
      const afterRings = createScaleRingGroup(
        HISTORY_AFTER_COLOR,
        opacity,
        `${entryGroup.name}:after`,
      )
      afterRings.scale.set(
        historyRadius * entry.afterScale.x,
        historyRadius * entry.afterScale.y,
        historyRadius * entry.afterScale.z,
      )
      entryGroup.add(beforeRings)
      entryGroup.add(afterRings)
      this.scaleHistoryGroup.add(entryGroup)
    })

    this.group.visible =
      this.moveHistoryLine.visible ||
      this.rotateHistoryGroup.children.length > 0 ||
      this.scaleHistoryGroup.children.length > 0
  }

  public dispose(): void {
    this.clearDynamicHistoryEntries()
    disposeLineObject(this.moveHistoryLine)
  }

  private clearDynamicHistoryEntries(): void {
    this.rotateHistoryGroup.children.forEach((child) => disposeHistoryObjectTree(child))
    this.scaleHistoryGroup.children.forEach((child) => disposeHistoryObjectTree(child))
    this.rotateHistoryGroup.clear()
    this.scaleHistoryGroup.clear()
  }
}
