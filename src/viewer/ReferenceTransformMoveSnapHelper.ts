import {
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from 'three'
import type { ActiveReferenceTransformHandle } from '../app/store/useAppStore'
import type { ReferenceTransformOverride } from '../app/references/referenceManifest'

const MOVE_SNAP_POINT_COLOR = '#ffffff'
const MOVE_SNAP_RENDER_ORDER = 113
const DEFAULT_MOVE_SNAP_DOT_DELAY_MS = 120
const DEFAULT_MOVE_SNAP_DOT_NEAR_SCALE = 1.45
const DEFAULT_MOVE_SNAP_DOT_FAR_SCALE = 0.04
const DEFAULT_MOVE_SNAP_VISIBLE_RADIUS_DISTANCE = 40
const MIN_MOVE_SNAP_VISIBLE_RADIUS_DISTANCE = 1
const MAX_MOVE_SNAP_VISIBLE_RADIUS_DISTANCE = 200
const MAX_AXIS_VISIBLE_RADIUS = 20
const MAX_PLANE_VISIBLE_RADIUS = 12
const MAX_CENTER_VISIBLE_RADIUS = 4
const MOVE_SNAP_MIN_OPACITY = 0.7
const MOVE_SNAP_MAX_OPACITY = 0.92
const MOVE_SNAP_TARGET_OPACITY = 1
const CURRENT_TARGET_HIGHLIGHT_MULTIPLIER = 1.2
const MOVE_SNAP_BASE_SIZE = 2.2
const MOVE_SNAP_VISIBILITY_EPSILON = 0.01
const MOVE_SNAP_GEOMETRY = new IcosahedronGeometry(0.5, 1)

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
  anchorPosition?: { x: number; y: number; z: number } | null
}

export type ReferenceTransformMoveSnapDotTarget = {
  key: string
  position: { x: number; y: number; z: number }
  normalizedDistance: number
  targetOpacity: number
  targetScale: number
  isCurrentTarget: boolean
}

type AnimatedMoveSnapDot = {
  key: string | null
  mesh: Mesh
  material: MeshBasicMaterial
  currentOpacity: number
  targetOpacity: number
  currentScale: number
  targetScale: number
  isTargeted: boolean
}

type MoveSnapBuildConfig = {
  nearScale?: number
  farScale?: number
  visibleRadiusDistance?: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const isFinitePositive = (value: number): boolean => Number.isFinite(value) && value > 0

const formatVectorKey = (vector: Vector3): string =>
  `${vector.x.toFixed(4)},${vector.y.toFixed(4)},${vector.z.toFixed(4)}`

const getReferenceTransformBasePosition = (referenceObject: Object3D): Vector3 => {
  const baseTransform = referenceObject.userData.referenceTransformBase as
    | ReferenceTransformOverride
    | undefined
  const basePosition = baseTransform?.position ?? { x: 0, y: 0, z: 0 }
  return new Vector3(basePosition.x, basePosition.y, basePosition.z)
}

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

const createMoveSnapMaterial = (): MeshBasicMaterial =>
  new MeshBasicMaterial({
    color: MOVE_SNAP_POINT_COLOR,
    transparent: true,
    opacity: 1,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
  })

const toWorldPoint = (
  origin: Vector3,
  components: Array<{ basis: Vector3; offset: number }>,
): Vector3 => {
  const point = origin.clone()
  components.forEach(({ basis, offset }) => {
    point.addScaledVector(basis, offset)
  })
  return point
}

const getVisibleRadiusDistance = (distance: number): number =>
  clamp(
    Number.isFinite(distance) ? distance : DEFAULT_MOVE_SNAP_VISIBLE_RADIUS_DISTANCE,
    MIN_MOVE_SNAP_VISIBLE_RADIUS_DISTANCE,
    MAX_MOVE_SNAP_VISIBLE_RADIUS_DISTANCE,
  )

const getVisibleRadiusCount = (distance: number, step: number, maxRadius: number): number => {
  if (!isFinitePositive(step)) {
    return 1
  }
  return clamp(Math.ceil(distance / step), 1, maxRadius)
}

const buildNormalVisualWeight = (
  normalizedDistance: number,
  nearScale: number,
  farScale: number,
): {
  targetOpacity: number
  targetScale: number
} => {
  const clampedDistance = clamp(normalizedDistance, 0, 1)
  const opacityFalloff = (1 - clampedDistance) ** 1.8
  const scaleFalloff = (1 - clampedDistance) ** 4.25
  const middleScale = farScale + (nearScale - farScale) * 0.6
  return {
    targetOpacity:
      MOVE_SNAP_MIN_OPACITY +
      (MOVE_SNAP_MAX_OPACITY - MOVE_SNAP_MIN_OPACITY) * opacityFalloff,
    targetScale: farScale + (middleScale - farScale) * scaleFalloff,
  }
}

const buildVisualWeight = (
  normalizedDistance: number,
  isCurrentTarget: boolean,
  nearScale: number,
  farScale: number,
): {
  targetOpacity: number
  targetScale: number
} => {
  const baseWeight = buildNormalVisualWeight(normalizedDistance, nearScale, farScale)
  if (!isCurrentTarget) {
    return baseWeight
  }
  return {
    targetOpacity: MOVE_SNAP_TARGET_OPACITY,
    targetScale: baseWeight.targetScale * CURRENT_TARGET_HIGHLIGHT_MULTIPLIER,
  }
}

const pushDotTarget = (
  targets: ReferenceTransformMoveSnapDotTarget[],
  key: string,
  position: Vector3,
  normalizedDistance: number,
  isCurrentTarget: boolean,
  nearScale: number,
  farScale: number,
  explicitWeight?: { targetOpacity: number; targetScale: number },
): void => {
  const { targetOpacity, targetScale } =
    explicitWeight ?? buildVisualWeight(normalizedDistance, isCurrentTarget, nearScale, farScale)
  targets.push({
    key,
    position: { x: position.x, y: position.y, z: position.z },
    normalizedDistance,
    targetOpacity,
    targetScale,
    isCurrentTarget,
  })
}

const getMoveSnapFieldOrigin = (
  overlay: ReferenceTransformMoveSnapOverlay,
  referenceObject: Object3D,
): Vector3 =>
  overlay.anchorPosition === undefined || overlay.anchorPosition === null
    ? getReferenceTransformBasePosition(referenceObject)
    : new Vector3(overlay.anchorPosition.x, overlay.anchorPosition.y, overlay.anchorPosition.z)

const buildMoveSnapFieldIdentityKey = (
  overlay: ReferenceTransformMoveSnapOverlay,
  referenceObject: Object3D,
): string => {
  const origin = getMoveSnapFieldOrigin(overlay, referenceObject)
  const axes = getOrientedAxes(referenceObject, overlay.space)
  const handleKey =
    overlay.handle.kind === 'axis'
      ? `axis:${overlay.handle.axis}`
      : overlay.handle.kind === 'plane'
        ? `plane:${overlay.handle.plane}`
        : 'center'
  return [
    handleKey,
    `space:${overlay.space}`,
    `origin:${formatVectorKey(origin)}`,
    `x:${formatVectorKey(axes.x)}`,
    `y:${formatVectorKey(axes.y)}`,
    `z:${formatVectorKey(axes.z)}`,
    `snap:${overlay.snapValues.x.toFixed(4)},${overlay.snapValues.y.toFixed(4)},${overlay.snapValues.z.toFixed(4)}`,
  ].join('|')
}

export const buildReferenceTransformMoveSnapDotTargets = (
  overlay: ReferenceTransformMoveSnapOverlay,
  referenceObject: Object3D,
  config?: MoveSnapBuildConfig,
): ReferenceTransformMoveSnapDotTarget[] => {
  const nearScale = config?.nearScale ?? DEFAULT_MOVE_SNAP_DOT_NEAR_SCALE
  const farScale = config?.farScale ?? DEFAULT_MOVE_SNAP_DOT_FAR_SCALE
  const visibleRadiusDistance = getVisibleRadiusDistance(
    config?.visibleRadiusDistance ?? DEFAULT_MOVE_SNAP_VISIBLE_RADIUS_DISTANCE,
  )
  const axes = getOrientedAxes(referenceObject, overlay.space)
  const origin = getMoveSnapFieldOrigin(overlay, referenceObject)
  const currentPosition = referenceObject.getWorldPosition(new Vector3())
  const targets: ReferenceTransformMoveSnapDotTarget[] = []

  if (overlay.handle.kind === 'axis') {
    const step = overlay.snapValues[overlay.handle.axis]
    if (!isFinitePositive(step)) {
      return targets
    }
    const axisVisibleRadius = getVisibleRadiusCount(
      visibleRadiusDistance,
      step,
      MAX_AXIS_VISIBLE_RADIUS,
    )
    const axisBufferedRadius = axisVisibleRadius + 1
    const axisVector = axes[overlay.handle.axis]
    const currentOffset = currentPosition.clone().sub(origin).dot(axisVector)
    const snappedIndex = Math.round(currentOffset / step)
    for (let offsetIndex = -axisBufferedRadius; offsetIndex <= axisBufferedRadius; offsetIndex += 1) {
      const absoluteIndex = snappedIndex + offsetIndex
      const offsetDistance = Math.abs(offsetIndex * step)
      const isBuffered = Math.abs(offsetIndex) > axisVisibleRadius
      pushDotTarget(
        targets,
        `axis:${overlay.handle.axis}:${absoluteIndex}`,
        toWorldPoint(origin, [{ basis: axisVector, offset: step * absoluteIndex }]),
        offsetDistance / visibleRadiusDistance,
        offsetIndex === 0,
        nearScale,
        farScale,
        isBuffered ? { targetOpacity: 0, targetScale: 0 } : undefined,
      )
    }
    return targets
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
      return targets
    }
    const firstVisibleRadius = getVisibleRadiusCount(
      visibleRadiusDistance,
      firstStep,
      MAX_PLANE_VISIBLE_RADIUS,
    )
    const secondVisibleRadius = getVisibleRadiusCount(
      visibleRadiusDistance,
      secondStep,
      MAX_PLANE_VISIBLE_RADIUS,
    )
    const firstBufferedRadius = firstVisibleRadius + 1
    const secondBufferedRadius = secondVisibleRadius + 1
    const firstAxisVector = axes[planeAxes[0]]
    const secondAxisVector = axes[planeAxes[1]]
    const currentOffset = currentPosition.clone().sub(origin)
    const snappedFirstIndex = Math.round(currentOffset.dot(firstAxisVector) / firstStep)
    const snappedSecondIndex = Math.round(currentOffset.dot(secondAxisVector) / secondStep)
    for (let firstOffsetIndex = -firstBufferedRadius; firstOffsetIndex <= firstBufferedRadius; firstOffsetIndex += 1) {
      for (let secondOffsetIndex = -secondBufferedRadius; secondOffsetIndex <= secondBufferedRadius; secondOffsetIndex += 1) {
        const absoluteFirstIndex = snappedFirstIndex + firstOffsetIndex
        const absoluteSecondIndex = snappedSecondIndex + secondOffsetIndex
        const firstOffsetDistance = Math.abs(firstOffsetIndex * firstStep)
        const secondOffsetDistance = Math.abs(secondOffsetIndex * secondStep)
        const isBuffered =
          Math.abs(firstOffsetIndex) > firstVisibleRadius ||
          Math.abs(secondOffsetIndex) > secondVisibleRadius
        const normalizedDistance =
          Math.sqrt(
            (firstOffsetDistance / visibleRadiusDistance) ** 2 +
              (secondOffsetDistance / visibleRadiusDistance) ** 2,
          ) / Math.sqrt(2)
        pushDotTarget(
          targets,
          `plane:${overlay.handle.plane}:${absoluteFirstIndex}:${absoluteSecondIndex}`,
          toWorldPoint(origin, [
            { basis: firstAxisVector, offset: firstStep * absoluteFirstIndex },
            { basis: secondAxisVector, offset: secondStep * absoluteSecondIndex },
          ]),
          normalizedDistance,
          firstOffsetIndex === 0 && secondOffsetIndex === 0,
          nearScale,
          farScale,
          isBuffered ? { targetOpacity: 0, targetScale: 0 } : undefined,
        )
      }
    }
    return targets
  }

  const { x, y, z } = overlay.snapValues
  if (!isFinitePositive(x) || !isFinitePositive(y) || !isFinitePositive(z)) {
    return targets
  }
  const currentOffset = currentPosition.clone().sub(origin)
  const snappedXIndex = Math.round(currentOffset.dot(axes.x) / x)
  const snappedYIndex = Math.round(currentOffset.dot(axes.y) / y)
  const snappedZIndex = Math.round(currentOffset.dot(axes.z) / z)
  const xVisibleRadius = getVisibleRadiusCount(
    visibleRadiusDistance,
    x,
    MAX_CENTER_VISIBLE_RADIUS,
  )
  const yVisibleRadius = getVisibleRadiusCount(
    visibleRadiusDistance,
    y,
    MAX_CENTER_VISIBLE_RADIUS,
  )
  const zVisibleRadius = getVisibleRadiusCount(
    visibleRadiusDistance,
    z,
    MAX_CENTER_VISIBLE_RADIUS,
  )
  const xBufferedRadius = xVisibleRadius + 1
  const yBufferedRadius = yVisibleRadius + 1
  const zBufferedRadius = zVisibleRadius + 1
  for (let xOffsetIndex = -xBufferedRadius; xOffsetIndex <= xBufferedRadius; xOffsetIndex += 1) {
    for (let yOffsetIndex = -yBufferedRadius; yOffsetIndex <= yBufferedRadius; yOffsetIndex += 1) {
      for (let zOffsetIndex = -zBufferedRadius; zOffsetIndex <= zBufferedRadius; zOffsetIndex += 1) {
        const absoluteXIndex = snappedXIndex + xOffsetIndex
        const absoluteYIndex = snappedYIndex + yOffsetIndex
        const absoluteZIndex = snappedZIndex + zOffsetIndex
        const xOffsetDistance = Math.abs(xOffsetIndex * x)
        const yOffsetDistance = Math.abs(yOffsetIndex * y)
        const zOffsetDistance = Math.abs(zOffsetIndex * z)
        const isBuffered =
          Math.abs(xOffsetIndex) > xVisibleRadius ||
          Math.abs(yOffsetIndex) > yVisibleRadius ||
          Math.abs(zOffsetIndex) > zVisibleRadius
        const normalizedDistance =
          Math.sqrt(
            (xOffsetDistance / visibleRadiusDistance) ** 2 +
              (yOffsetDistance / visibleRadiusDistance) ** 2 +
              (zOffsetDistance / visibleRadiusDistance) ** 2,
          ) / Math.sqrt(3)
        pushDotTarget(
          targets,
          `center:${absoluteXIndex}:${absoluteYIndex}:${absoluteZIndex}`,
          toWorldPoint(origin, [
            { basis: axes.x, offset: x * absoluteXIndex },
            { basis: axes.y, offset: y * absoluteYIndex },
            { basis: axes.z, offset: z * absoluteZIndex },
          ]),
          normalizedDistance,
          xOffsetIndex === 0 && yOffsetIndex === 0 && zOffsetIndex === 0,
          nearScale,
          farScale,
          isBuffered ? { targetOpacity: 0, targetScale: 0 } : undefined,
        )
      }
    }
  }
  return targets
}

export const buildReferenceTransformMoveSnapPositions = (
  overlay: ReferenceTransformMoveSnapOverlay,
  referenceObject: Object3D,
): number[] =>
  buildReferenceTransformMoveSnapDotTargets(overlay, referenceObject).flatMap((entry) => [
    entry.position.x,
    entry.position.y,
    entry.position.z,
  ])

export class ReferenceTransformMoveSnapHelper {
  private readonly group = new Group()
  private readonly activeDotsByKey = new Map<string, AnimatedMoveSnapDot>()
  private readonly freeDots: AnimatedMoveSnapDot[] = []
  private readonly allDots: AnimatedMoveSnapDot[] = []
  private enabled = true
  private dotScaleMultiplier = 1
  private dotDelayMs = DEFAULT_MOVE_SNAP_DOT_DELAY_MS
  private dotNearScale = DEFAULT_MOVE_SNAP_DOT_NEAR_SCALE
  private dotFarScale = DEFAULT_MOVE_SNAP_DOT_FAR_SCALE
  private dotVisibleRadiusDistance = DEFAULT_MOVE_SNAP_VISIBLE_RADIUS_DISTANCE
  private lastFieldIdentityKey: string | null = null

  public constructor() {
    this.group.name = 'ReferenceTransformMoveSnapHelper'
    this.group.visible = false
  }

  public getGroup(): Group {
    return this.group
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (!enabled) {
      this.clearTargets()
    }
  }

  public setDotScaleMultiplier(value: number): void {
    this.dotScaleMultiplier = clamp(Number.isFinite(value) ? value : 1, 0.1, 4)
    this.allDots.forEach((dot) => {
      dot.mesh.scale.setScalar(MOVE_SNAP_BASE_SIZE * this.dotScaleMultiplier * dot.currentScale)
    })
  }

  public setDotDelayMs(value: number): void {
    this.dotDelayMs = clamp(Number.isFinite(value) ? value : DEFAULT_MOVE_SNAP_DOT_DELAY_MS, 0, 500)
  }

  public setDotNearScale(value: number): void {
    this.dotNearScale = clamp(
      Number.isFinite(value) ? value : DEFAULT_MOVE_SNAP_DOT_NEAR_SCALE,
      0.1,
      3,
    )
  }

  public setDotFarScale(value: number): void {
    this.dotFarScale = clamp(
      Number.isFinite(value) ? value : DEFAULT_MOVE_SNAP_DOT_FAR_SCALE,
      0,
      1.5,
    )
  }

  public setDotVisibleRadiusMultiplier(value: number): void {
    this.dotVisibleRadiusDistance = getVisibleRadiusDistance(value)
  }

  public setOverlay(
    overlay: ReferenceTransformMoveSnapOverlay | null,
    referenceObject: Object3D | null,
  ): void {
    if (!this.enabled || overlay === null || referenceObject === null || !referenceObject.visible) {
      this.clearTargets()
      return
    }

    const fieldIdentityKey = buildMoveSnapFieldIdentityKey(overlay, referenceObject)
    if (fieldIdentityKey !== this.lastFieldIdentityKey) {
      this.resetFieldIdentity()
      this.lastFieldIdentityKey = fieldIdentityKey
    }

    const targets = buildReferenceTransformMoveSnapDotTargets(overlay, referenceObject, {
      nearScale: this.dotNearScale,
      farScale: this.dotFarScale,
      visibleRadiusDistance: this.dotVisibleRadiusDistance,
    })
    this.group.visible = targets.length > 0 || this.group.visible
    this.activeDotsByKey.forEach((dot) => {
      dot.isTargeted = false
    })

    targets.forEach((target) => {
      let dot = this.activeDotsByKey.get(target.key)
      const isNewDot = dot === undefined
      if (dot === undefined) {
        dot = this.acquireDot(target.key)
      }
      dot.isTargeted = true
      dot.mesh.position.set(target.position.x, target.position.y, target.position.z)
      dot.targetOpacity = target.targetOpacity
      dot.targetScale = target.targetScale
      if (isNewDot && dot.currentOpacity <= MOVE_SNAP_VISIBILITY_EPSILON) {
        dot.currentOpacity = 0
        dot.currentScale = 0
        dot.material.opacity = 0
        dot.mesh.scale.setScalar(0)
      }
      dot.material.opacity = dot.currentOpacity
      dot.mesh.scale.setScalar(MOVE_SNAP_BASE_SIZE * this.dotScaleMultiplier * dot.currentScale)
      dot.mesh.visible = true
    })

    this.activeDotsByKey.forEach((dot) => {
      if (!dot.isTargeted) {
        dot.targetOpacity = 0
        dot.targetScale = 0
      }
    })
  }

  public tick(dt: number): void {
    const visualLerp =
      this.dotDelayMs <= 0
        ? 1
        : 1 - Math.exp(-dt / Math.max(this.dotDelayMs / 1000, 0.0001))
    let hasVisibleDot = false
    const keysToRelease: string[] = []

    this.activeDotsByKey.forEach((dot, key) => {
      dot.currentOpacity += (dot.targetOpacity - dot.currentOpacity) * visualLerp
      dot.currentScale += (dot.targetScale - dot.currentScale) * visualLerp
      dot.material.opacity = dot.currentOpacity
      dot.mesh.scale.setScalar(MOVE_SNAP_BASE_SIZE * this.dotScaleMultiplier * dot.currentScale)

      const shouldStayVisible =
        dot.currentOpacity > MOVE_SNAP_VISIBILITY_EPSILON ||
        dot.targetOpacity > MOVE_SNAP_VISIBILITY_EPSILON
      dot.mesh.visible = shouldStayVisible
      if (!shouldStayVisible) {
        dot.currentOpacity = 0
        dot.currentScale = 0
        dot.material.opacity = 0
        dot.mesh.scale.setScalar(0)
        if (!dot.isTargeted) {
          keysToRelease.push(key)
        }
      } else {
        hasVisibleDot = true
      }
    })

    keysToRelease.forEach((key) => {
      const dot = this.activeDotsByKey.get(key)
      if (dot === undefined) {
        return
      }
      this.activeDotsByKey.delete(key)
      dot.key = null
      dot.isTargeted = false
      this.freeDots.push(dot)
    })

    this.group.visible = hasVisibleDot
  }

  public getDebugDots(): Array<{
    key: string
    position: { x: number; y: number; z: number }
    isTargeted: boolean
    currentScale: number
    targetScale: number
    targetOpacity: number
  }> {
    return Array.from(this.activeDotsByKey.values()).map((dot) => ({
      key: dot.key ?? '',
      position: {
        x: dot.mesh.position.x,
        y: dot.mesh.position.y,
        z: dot.mesh.position.z,
      },
      isTargeted: dot.isTargeted,
      currentScale: dot.currentScale,
      targetScale: dot.targetScale,
      targetOpacity: dot.targetOpacity,
    }))
  }

  public dispose(): void {
    this.allDots.forEach((dot) => {
      dot.material.dispose()
    })
  }

  private acquireDot(key: string): AnimatedMoveSnapDot {
    const dot = this.freeDots.pop() ?? this.createDot()
    dot.key = key
    dot.currentOpacity = 0
    dot.targetOpacity = 0
    dot.currentScale = 0
    dot.targetScale = 0
    dot.isTargeted = true
    dot.material.opacity = 0
    dot.mesh.visible = false
    dot.mesh.scale.setScalar(0)
    this.activeDotsByKey.set(key, dot)
    return dot
  }

  private createDot(): AnimatedMoveSnapDot {
    const material = createMoveSnapMaterial()
    const mesh = new Mesh(MOVE_SNAP_GEOMETRY, material)
    mesh.name = `ReferenceTransformMoveSnapAvailabilityDot:${this.allDots.length + 1}`
    mesh.renderOrder = MOVE_SNAP_RENDER_ORDER
    mesh.visible = false
    mesh.frustumCulled = false
    mesh.scale.setScalar(0)
    this.group.add(mesh)
    const dot: AnimatedMoveSnapDot = {
      key: null,
      mesh,
      material,
      currentOpacity: 0,
      targetOpacity: 0,
      currentScale: 0,
      targetScale: 0,
      isTargeted: false,
    }
    this.allDots.push(dot)
    return dot
  }

  private clearTargets(): void {
    this.lastFieldIdentityKey = null
    this.activeDotsByKey.forEach((dot) => {
      dot.isTargeted = false
      dot.targetOpacity = 0
      dot.targetScale = 0
    })
  }

  private resetFieldIdentity(): void {
    this.activeDotsByKey.forEach((dot, key) => {
      this.activeDotsByKey.delete(key)
      dot.key = null
      dot.isTargeted = false
      dot.currentOpacity = 0
      dot.targetOpacity = 0
      dot.currentScale = 0
      dot.targetScale = 0
      dot.material.opacity = 0
      dot.mesh.visible = false
      dot.mesh.scale.setScalar(0)
      this.freeDots.push(dot)
    })
    this.group.visible = false
  }
}

export const isReferenceTransformMoveSnapHandle = (
  handle: ActiveReferenceTransformHandle | null,
): handle is MoveSnapHandle => handle?.mode === 'translate'
